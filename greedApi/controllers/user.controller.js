import { asyncHandler } from "../middlewares/asyncHandler.middleware.js";
import ErrorHandler from "../middlewares/error.middleware.js";
import jwt from "jsonwebtoken";
import bcrypt from "bcryptjs";
import crypto from "crypto";
import fs from "fs";
import path from "path";

import { User } from "../models/user.model.js";
import { Wallet } from "../models/wallet.model.js";
import { destroyOnCloudinary, uploadOnCloudinary } from "../utils/cloudinary.utils.js";
import mongoose from "mongoose";
import { sendEmail } from "../utils/mail.utils.js";
import { cookieToken } from "../utils/cookie.utils.js";
import { cloudinaryAvatarRefer } from "../utils/constants.utils.js";
import { logActivity } from "../utils/logActivity.utils.js";

// ============================================
// EMAIL TEMPLATES
// ============================================

const generateEmailLinkTemplate = (token) => {
    const templatePath = path.join(process.cwd(), 'templates', 'password.template.html');
    let template = fs.readFileSync(templatePath, 'utf8');
    const resetLink = `${process.env.FRONTEND_URL}/reset-password/${token}`;
    template = template.replace('{{RESET_LINK}}', resetLink);
    return template;
};

const generateEmailTemplate = (verificationCode) => {
    const templatePath = path.join(process.cwd(), 'templates', 'otp.template.html');
    let template = fs.readFileSync(templatePath, 'utf8');
    template = template.replace('{{OTP_CODE}}', verificationCode);
    return template;
};

// ============================================
// REFRESH ACCESS TOKEN
// ============================================

const refreshAccessToken = asyncHandler(async (req, res, next) => {
    const incomingRefreshToken = req.cookies.refreshToken || req.body.refreshToken;

    if (!incomingRefreshToken) {
        return next(new ErrorHandler("Unauthorized Request", 401));
    }

    try {
        const decodedToken = jwt.verify(
            incomingRefreshToken,
            process.env.REFRESH_TOKEN_SECRET
        );

        const user = await User.findById(decodedToken?._id);

        if (!user || user.refreshToken !== incomingRefreshToken) {
            return next(new ErrorHandler("Invalid or Expired Refresh Token", 401));
        }

        cookieToken(user, res);
    } catch (error) {
        return next(new ErrorHandler(error?.message || "Invalid Refresh Token", 401));
    }
});

// ============================================
// REGISTER USER (tested and working)
// ============================================

const registerUser = asyncHandler(async (req, res, next) => {
    const { username, email, phone, password} = req.body;

    console.log("Registration data received:", { username, email, phone});

    if (!username || !email || !phone || !password) {
        return next(new ErrorHandler("All fields are required", 400));
    }

    if (password.length < 8) {
        return next(new ErrorHandler("Password must be at least 8 characters long", 400));
    }

    const existingUser = await User.findOne({
        $or: [{ email }, { phone }, { username }]
    });

    if (existingUser) {
        const duplicateField = existingUser.email === email ? 'email' :
                              existingUser.phone === phone ? 'phone' : 'username';
        return next(new ErrorHandler(`User already exists with the same ${duplicateField}`, 400));
    }

    try {
        const user = await User.create({
            username,
            email,
            phone,
            password,
            // gender,
            // dob: new Date(dob) || "",
            isVerified: false
        });

        // Create wallet for the user
        await Wallet.create({ user: user._id });

        await cookieToken(user, res);
        await logActivity(
            user._id,
            "register",
            `${user.username} registered`,
            req,
            'user',
            user._id
        );
        return; // Important: return after sending response
    } catch (error) {
        console.error("User creation error:", error);
        if (error instanceof mongoose.Error.ValidationError) {
            const messages = Object.values(error.errors).map(e => e.message);
            return next(new ErrorHandler(`Validation failed: ${messages.join(", ")}`, 400));
        } else {
            return next(new ErrorHandler(`Database error: ${error.message}`, 500));
        }
    }
});

// ============================================
// LOGIN USER (tested and working)
// ============================================

const loginUser = asyncHandler(async (req, res, next) => {
    const { email, password } = req.body;

    try {
        if (!email || !password) {
            return next(new ErrorHandler("Please fill in all fields", 400));
        }

        const user = await User.findOne({ email }).select("+password");

        if (!user) {
            return next(new ErrorHandler("Invalid Credentials", 401));
        }

        const isPasswordValid = await user.isPasswordCorrect(password);

        if (!isPasswordValid) {
            return next(new ErrorHandler("Invalid credentials", 401));
        }

        cookieToken(user, res, "User logged in successfully");
        await logActivity(
            user._id,
            "login",
            `${user.username} logged in`,
            req,
            'user',
            user._id
        );
    } catch (error) {
        return next(new ErrorHandler(`Something went wrong: ${error.message}`, 500));
    }
});

// ============================================
// LOGOUT USER
// ============================================

const logoutUser = asyncHandler(async (req, res, next) => {
    try {
        const userId = req.user._id;

        const user = await User.findByIdAndUpdate(
            userId,
            { $unset: { refreshToken: "" } },
            { new: true }
        ).select("username");

        await logActivity(
            req.user._id,
            "logout",
            `${user.username || req.user.email || 'User'} logged out`,
            req,
            'user',
            req.user._id
        );

        return res
            .status(200)
            .json({
                success: true,
                message: "User Logged Out Successfully!",
            });
    } catch (error) {
        return next(new ErrorHandler(`Error logging out: ${error}`, 400));
    }
});

// ============================================
// SEND OTP (tested and working)
// ============================================

const sendOtpToUser = asyncHandler(async (req, res, next) => {
     console.log("Sending OTP to user ....userId", req.user);
    console.log("Sending OTP to user ....userId", req.user._id);
    const userId = req.user._id;
    if (!userId) {
        return next(new ErrorHandler("You are unauthorized to get OTP, please register/login to continue", 400));
    }

    const user = await User.findById(userId);
    if (!user?.email) {
        return next(new ErrorHandler("Please provide email used for account creation!"));
    }

    const OTP = await user.generateVerificationCode();
    await user.save();

    try {
        const message = generateEmailTemplate(OTP);
        const mailResponse = await sendEmail({
            email: user.email,
            subject: "YOUR VERIFICATION CODE - GreedHunter",
            message
        });
        return res.status(200).json({
            success: true,
            message: `Code sent successfully to ${user.email}`
        });
    } catch (error) {
        return next(new ErrorHandler(`Unable to send email to ${user.email}\nError: ${error.message}`, 400));
    }
});

// ============================================
// VERIFY OTP (tested and working)
// ============================================

const verifyOtpForUser = asyncHandler(async (req, res, next) => {
    const { email, otp } = req.body;
    if (!email) {
        return next(new ErrorHandler("Enter the email to receive OTP", 400));
    }

    if (!otp) {
        return next(new ErrorHandler(`Please enter OTP sent to your mail: ${email} to verify Email`, 400));
    }

    const user = await User.findOne({ email });

    if (!user) {
        return next(new ErrorHandler("Invalid Email", 400));
    }

    if (!user.verificationCode || user.verificationCode !== Number(otp)) {
        return next(new ErrorHandler("Invalid OTP", 400));
    }

    if (user.verificationCodeExpire < Date.now()) {
        return next(new ErrorHandler("OTP Expired", 400));
    }

    user.isVerified = true;
    user.verificationCode = undefined;
    user.verificationCodeExpire = undefined;

    await user.save({ validateBeforeSave: false });

    await logActivity(
        user._id,
        "verify-otp",
        `${user.username} verified OTP`,
        req,
        'user',
        user._id
    );

    const resUser = await User.findById(user._id).select("-password -refreshToken");
    return res.status(200)
        .json({
            success: true,
            message: `${email} verified successfully`,
            user: resUser
        });
});

// ============================================
// SEND RESET PASSWORD LINK (tested and working)
// ============================================

const sendResetPasswordLinkToUser = asyncHandler(async (req, res, next) => {
    const { email } = req.body;
    if (!email) {
        return next(new ErrorHandler("Please provide the email to send OTP", 400));
    }

    const user = await User.findOne({ email });
    if (!user) {
        return next(new ErrorHandler("Please provide email used for account creation!"));
    }

    const token = await user.generateResetPasswordLink();
    await user.save();

    try {
        const message = generateEmailLinkTemplate(token);
        const mailRes = await sendEmail({
            email,
            subject: "YOUR RESET PASSWORD LINK - GreedHunter",
            message
        });
        return res.status(200).json({
            success: true,
            message: `Email sent successfully to ${email}`
        });
    } catch (error) {
        return next(new ErrorHandler(`Unable to send email to ${email}\nError: ${error.message}`, 400));
    }
});

// ============================================
// RESET PASSWORD (tested and working)
// ============================================

const resetPassword = asyncHandler(async (req, res, next) => {
    const { password, confirmPassword } = req.body;
    const token = req?.params?.token;

    const encryptedToken = crypto
        .createHash("sha256")
        .update(token)
        .digest("hex");

    const user = await User.findOne({
        forgotPasswordToken: encryptedToken,
        forgotPasswordTokenExpiry: { $gt: Date.now() }
    });

    if (!user) {
        return next(new ErrorHandler("Invalid link", 400));
    }

    if (!password || !confirmPassword) {
        return next(new ErrorHandler("Enter both fields", 400));
    }

    if (password !== confirmPassword) {
        return next(new ErrorHandler("Password and confirm password do not match", 400));
    }

    user.password = password;
    user.forgotPasswordToken = undefined;
    user.forgotPasswordTokenExpiry = undefined;

    await user.save({ validateBeforeSave: true });

    await logActivity(
        user._id,
        "reset-password",
        `${user.username} reset password`,
        req,
        'user',
        user._id
    );

    return res.status(200).json({
        success: true,
        message: `Password for ${user.username} changed!`,
    });
});

// ============================================
// CHANGE CURRENT PASSWORD (tested and working)
// ============================================

const changeCurrentPassword = asyncHandler(async (req, res, next) => {
    const { currentPassword, newPassword, confirmPassword } = req.body;

    if (!currentPassword || !newPassword || !confirmPassword) {
        return next(new ErrorHandler("All fields are required", 400));
    }

    if (newPassword.length < 8) {
        return next(new ErrorHandler("Password must be at least 8 characters long", 400));
    }

    const user = await User.findById(req.user?._id).select("+password");
    const isPasswordCorrect = await user.isPasswordCorrect(currentPassword);

    if (!isPasswordCorrect) {
        return next(new ErrorHandler("Invalid old password", 401));
    }

    if (newPassword !== confirmPassword) {
        return next(new ErrorHandler("Confirm password didn't match the new password!", 401));
    }

    user.password = newPassword;
    await user.save({ validateBeforeSave: false });

    await logActivity(
        req.user._id,
        "change-password",
        `${user.username} changed password`,
        req,
        'user',
        req.user._id
    );

    return res.status(200).json({
        success: true,
        message: "Password updated successfully!"
    });
});

// ============================================
// UPDATE USER PROFILE (tested and working)
// ============================================

const updateUserProfile = asyncHandler(async (req, res, next) => {
    const userId = req.user?._id;
    const { username, email, phone, gender, bio } = req.body;
    
    // Parse social_links if it's a string (from form-data)
    let social_links = {};
    if (req.body.social_links) {
        try {
            social_links = typeof req.body.social_links === 'string' 
                ? JSON.parse(req.body.social_links) 
                : req.body.social_links;
        } catch (e) {
            return next(new ErrorHandler("Invalid social_links format. Must be valid JSON.", 400));
        }
    }

    if (!username || !email || !phone) {
        return next(new ErrorHandler("Username, email, and phone are required", 400));
    }

    const existingUser = await User.findOne({
        _id: { $ne: userId },
        $or: [{ email }, { phone }, { username }]
    });

    if (existingUser) {
        const duplicateField = existingUser.email === email ? 'email' :
                              existingUser.phone === phone ? 'phone' : 'username';
        return next(new ErrorHandler(`User already exists with the same ${duplicateField}`, 400));
    }

    // Validate social links
    try {
        Object.entries(social_links).forEach(([platform, url]) => {
            if (url) {
                const parsed = new URL(url);
                if (parsed.protocol !== "https:") {
                    throw new Error(`${platform} link must start with https://`);
                }
                if (platform !== "website" && !parsed.hostname.includes(`${platform}.com`)) {
                    throw new Error(`${platform} link must be a valid ${platform}.com domain`);
                }
            }
        });
    } catch (error) {
        return next(new ErrorHandler(error.message, 400));
    }

    // Handle avatar upload if file is provided
    let avatarUpdate = {};
    if (req.file) {
        const user = await User.findById(userId);
        const previousAvatar = user?.avatar?.public_id;

        if (previousAvatar) {
            await destroyOnCloudinary(previousAvatar, cloudinaryAvatarRefer);
        }

        const newAvatar = await uploadOnCloudinary(req.file.path, cloudinaryAvatarRefer, req?.user, req?.file?.originalname);

        if (newAvatar && newAvatar.url && newAvatar.public_id) {
            avatarUpdate = {
                "avatar.public_id": newAvatar.public_id,
                "avatar.secure_url": newAvatar.secure_url,
            };
        }
    }

    const updatedUser = await User.findByIdAndUpdate(
        userId,
        { username, email, phone, gender, bio, social_links, ...avatarUpdate },
        { new: true, runValidators: true }
    ).select("-password -refreshToken");

    if (!updatedUser) {
        return next(new ErrorHandler("User not found", 404));
    }

    await logActivity(
        userId,
        "update-profile",
        `${updatedUser.username} updated profile`,
        req,
        'user',
        userId
    );

    return res.status(200).json({
        success: true,
        message: "Profile updated successfully",
        user: updatedUser
    });
});

// ============================================
// UPDATE USER AVATAR (tested and working)
// ============================================

const updateUserAvatar = asyncHandler(async (req, res, next) => {
    const avatarLocalPath = req.file?.path;

    if (!avatarLocalPath) {
        return next(new ErrorHandler("Avatar file is missing", 404));
    }

    const user = await User.findById(req?.user?._id);
    if (!user) {
        return next(new ErrorHandler("User not found", 404));
    }

    const previousAvatar = user.avatar?.public_id;

    if (previousAvatar) {
        await destroyOnCloudinary(previousAvatar, cloudinaryAvatarRefer);
    }

    const newAvatar = await uploadOnCloudinary(avatarLocalPath, cloudinaryAvatarRefer, req?.user, req?.file?.originalname);

    if (!newAvatar || !newAvatar.url || !newAvatar.public_id) {
        return next(new ErrorHandler("Error while uploading avatar!", 500));
    }

    try {
        const updatedUser = await User.findByIdAndUpdate(
            req.user?._id,
            {
                $set: {
                    "avatar.public_id": newAvatar.public_id,
                    "avatar.secure_url": newAvatar.secure_url,
                },
            },
            { new: true }
        ).select("-password");

        await logActivity(
            req.user._id,
            "avatar",
            `${updatedUser.username} updated avatar`,
            req,
            'user',
            req.user._id
        );

        return res.status(200).json({
            success: true,
            user: updatedUser,
            message: "Avatar updated successfully!"
        });
    } catch (error) {
        await destroyOnCloudinary(newAvatar?.public_id, cloudinaryAvatarRefer);
        return next(new ErrorHandler(`Unable to update user profile: ${error}`, 401));
    }
});

// ============================================
// GET LOGGED IN USER INFO (tested and working)
// ============================================

const getLoggedInUserInfo = asyncHandler(async (req, res, next) => {
    const userId = req.user._id;

    const user = await User.findById(userId).select("-password -refreshToken");

    if (!user) {
        return next(new ErrorHandler("User not found", 404));
    }

    // Get wallet info
    const wallet = await Wallet.findOne({ user: userId });

    const userWithWallet = {
        ...user.toObject(),
        wallet: {
            totalBalance: wallet?.totalBalance || 0,
            totalEarned: wallet?.totalEarned || 0,
            totalSpent: wallet?.totalSpent || 0
        }
    };

    res.status(200).json({
        success: true,
        user: userWithWallet
    });
});

// ============================================
// DELETE USER 
// ============================================

const deleteUser = asyncHandler(async (req, res, next) => {
    try {
        const userId = req.user?._id;

        const user = await User.findById(userId);
        if (!user) {
            return next(new ErrorHandler("User not found", 404));
        }

        await logActivity(
            req.user._id,
            "delete-user",
            `${user.username} deleted account`,
            req,
            'user',
            userId
        );

        // Soft delete user and wallet
        await User.findByIdAndUpdate(userId, { isDeleted: true, deletedAt: new Date() });
        await Wallet.findOneAndUpdate({ user: userId }, { isDeleted: true, deletedAt: new Date() });

        res.status(200).json({
            success: true,
            message: "User deleted successfully"
        });
    } catch (error) {
        return next(new ErrorHandler("Internal Server Error", 500));
    }
});

// ============================================
// GOOGLE AUTH CALLBACK
// ============================================

const googleAuthCallback = asyncHandler(async (req, res, next) => {
    try {
        const user = req.user;

        if (!user) {
            return res.redirect(`${process.env.FRONTEND_URL || 'http://localhost:5173'}/login?error=Google authentication failed`);
        }

        const accessToken = await user.generateAccessToken();
        const refreshToken = await user.generateRefreshToken();

        user.refreshToken = refreshToken;
        await user.save({ validateBeforeSave: false });

        const isProduction = process.env.NODE_ENV === "production";
        const options = {
            httpOnly: true,
            secure: isProduction,
            sameSite: isProduction ? "none" : "lax"
        };

        res.cookie('accessToken', accessToken, options);
        res.cookie('refreshToken', refreshToken, options);

        await logActivity(
            user._id,
            "login",
            `${user.username} logged in via Google`,
            req,
            'user',
            user._id
        );

        res.redirect(`${process.env.FRONTEND_URL || 'http://localhost:5173'}/?auth=success&accessToken=${accessToken}&refreshToken=${refreshToken}`);
    } catch (error) {
        console.error('Google auth callback error:', error);
        res.redirect(`${process.env.FRONTEND_URL || 'http://localhost:5173'}/login?error=Authentication failed`);
    }
});

// ============================================
// GITHUB AUTH CALLBACK
// ============================================

const githubAuthCallback = asyncHandler(async (req, res, next) => {
    try {
        const user = req.user;

        if (!user) {
            return res.redirect(`${process.env.FRONTEND_URL || 'http://localhost:5173'}/login?error=GitHub authentication failed`);
        }

        const accessToken = await user.generateAccessToken();
        const refreshToken = await user.generateRefreshToken();

        user.refreshToken = refreshToken;
        await user.save({ validateBeforeSave: false });

        const isProduction = process.env.NODE_ENV === "production";
        const options = {
            httpOnly: true,
            secure: isProduction,
            sameSite: isProduction ? "none" : "lax"
        };

        res.cookie('accessToken', accessToken, options);
        res.cookie('refreshToken', refreshToken, options);

        await logActivity(
            user._id,
            "login",
            `${user.username} logged in via GitHub`,
            req,
            'user',
            user._id
        );

        res.redirect(`${process.env.FRONTEND_URL || 'http://localhost:5173'}/?auth=success&accessToken=${accessToken}&refreshToken=${refreshToken}`);
    } catch (error) {
        console.error('GitHub auth callback error:', error);
        res.redirect(`${process.env.FRONTEND_URL || 'http://localhost:5173'}/login?error=Authentication failed`);
    }
});

// ============================================
// FOLLOW USER (tested and working)
// ============================================

const followUser = asyncHandler(async (req, res, next) => {
    const { userId } = req.params;
    const currentUserId = req.user._id;

    if (userId === currentUserId.toString()) {
        return next(new ErrorHandler("You cannot follow yourself", 400));
    }

    const userToFollow = await User.findById(userId);
    const currentUser = await User.findById(currentUserId);

    if (!userToFollow) {
        return next(new ErrorHandler("User not found", 404));
    }

    if (currentUser.following.includes(userId)) {
        return next(new ErrorHandler("You are already following this user", 400));
    }

    await User.findByIdAndUpdate(currentUserId, {
        $push: { following: userId },
        $inc: { num_following: 1 }
    });

    await User.findByIdAndUpdate(userId, {
        $push: { followers: currentUserId },
        $inc: { num_followers: 1 }
    });

    await logActivity(
        currentUserId,
        "follow",
        `${currentUser.username} followed ${userToFollow.username}`,
        req,
        'user',
        userId
    );

    res.status(200).json({
        success: true,
        message: `You are now following ${userToFollow.username}`
    });
});

// ============================================
// UNFOLLOW USER (tested and working)
// ============================================

const unfollowUser = asyncHandler(async (req, res, next) => {
    const { userId } = req.params;
    const currentUserId = req.user._id;

    if (userId === currentUserId.toString()) {
        return next(new ErrorHandler("You cannot unfollow yourself", 400));
    }

    const userToUnfollow = await User.findById(userId);
    const currentUser = await User.findById(currentUserId);

    if (!userToUnfollow) {
        return next(new ErrorHandler("User not found", 404));
    }

    if (!currentUser.following.includes(userId)) {
        return next(new ErrorHandler("You are not following this user", 400));
    }

    await User.findByIdAndUpdate(currentUserId, {
        $pull: { following: userId },
        $inc: { num_following: -1 }
    });

    await User.findByIdAndUpdate(userId, {
        $pull: { followers: currentUserId },
        $inc: { num_followers: -1 }
    });

    await logActivity(
        currentUserId,
        "unfollow",
        `${currentUser.username} unfollowed ${userToUnfollow.username}`,
        req,
        'user',
        userId
    );

    res.status(200).json({
        success: true,
        message: `You have unfollowed ${userToUnfollow.username}`
    });
});

// ============================================
// GET USER BY ID (tested and working)
// ============================================

const getUserById = asyncHandler(async (req, res, next) => {
    const { userId } = req.params;

    const user = await User.findById(userId).select("-password -refreshToken -verificationCode -verificationCodeExpire -forgotPasswordToken -forgotPasswordTokenExpiry");

    if (!user) {
        return next(new ErrorHandler("User not found", 404));
    }

    res.status(200).json({
        success: true,
        user
    });
});

// ============================================
// EXPORTS
// ============================================

export {
    refreshAccessToken,
    registerUser,
    loginUser,
    logoutUser,
    sendOtpToUser,
    verifyOtpForUser,
    sendResetPasswordLinkToUser,
    resetPassword,
    getLoggedInUserInfo,
    changeCurrentPassword,
    updateUserProfile,
    updateUserAvatar,
    deleteUser,
    googleAuthCallback,
    githubAuthCallback,
    followUser,
    unfollowUser,
    getUserById,
    getUserStats,
    updatePrivacySettings,
    getLeaderboard
};

// ============================================
// GET USER STATS (tested and working)
// ============================================

const getUserStats = asyncHandler(async (req, res, next) => {
    const userId = req.user._id;

    const user = await User.findById(userId).select("level xp points stats");

    if (!user) {
        return next(new ErrorHandler("User not found", 404));
    }

    // Calculate XP needed for next level
    const xpForNextLevel = user.level * 1000; // Simple formula: level * 1000
    const xpProgress = (user.xp / xpForNextLevel) * 100;

    res.status(200).json({
        success: true,
        data: {
            level: user.level,
            xp: user.xp,
            xpForNextLevel,
            xpProgress: Math.round(xpProgress),
            points: user.points,
            stats: user.stats || {
                eventsJoined: 0,
                eventsWon: 0,
                quizzesCompleted: 0,
                challengesCompleted: 0,
                missionsCompleted: 0,
                totalEarnings: 0,
                currentStreak: 0,
                longestStreak: 0
            }
        }
    });
});

// ============================================
// UPDATE PRIVACY SETTINGS (tested and working --check with model and frontend)
// ============================================

const updatePrivacySettings = asyncHandler(async (req, res, next) => {
    const userId = req.user._id;
    const { showOnlineStatus, showActivity, showWallet, profileVisibility } = req.body;

    const user = await User.findById(userId);

    if (!user) {
        return next(new ErrorHandler("User not found", 404));
    }

    if (!user.privacy) {
        user.privacy = {};
    }

    if (showOnlineStatus !== undefined) user.privacy.showOnlineStatus = showOnlineStatus;
    if (showActivity !== undefined) user.privacy.showActivity = showActivity;
    if (showWallet !== undefined) user.privacy.showWallet = showWallet;
    if (profileVisibility) user.privacy.profileVisibility = profileVisibility;

    await user.save();

    await logActivity(
        userId,
        "update-privacy",
        "Updated privacy settings",
        req,
        'user',
        userId
    );

    res.status(200).json({
        success: true,
        message: "Privacy settings updated successfully",
        privacy: user.privacy
    });
});

// ============================================
// GET LEADERBOARD (tested and working)
// ============================================

const getLeaderboard = asyncHandler(async (req, res, next) => {
    const { type = "points", limit = 10, page = 1 } = req.query;

    let sortField;
    switch (type) {
        case "level":
            sortField = { level: -1, xp: -1 };
            break;
        case "earnings":
            sortField = { "stats.totalEarnings": -1 };
            break;
        case "events":
            sortField = { "stats.eventsWon": -1 };
            break;
        case "streak":
            sortField = { "stats.currentStreak": -1 };
            break;
        default:
            sortField = { points: -1 };
    }

    const skip = (parseInt(page) - 1) * parseInt(limit);

    const [users, total] = await Promise.all([
        User.find({ 
            isDeleted: { $ne: true },
            status: "active",
            "privacy.profileVisibility": { $ne: "private" }
        })
        .select("username avatar level xp points stats")
        .sort(sortField)
        .skip(skip)
        .limit(parseInt(limit)),
        User.countDocuments({ 
            isDeleted: { $ne: true },
            status: "active"
        })
    ]);

    // Add rank to each user
    const leaderboard = users.map((user, index) => ({
        rank: skip + index + 1,
        ...user.toObject()
    }));

    // Get current user's rank if authenticated
    let myRank = null;
    if (req.user) {
        const higherRanked = await User.countDocuments({
            isDeleted: { $ne: true },
            status: "active",
            [Object.keys(sortField)[0]]: { $gt: req.user[Object.keys(sortField)[0]] || 0 }
        });
        myRank = higherRanked + 1;
    }

    res.status(200).json({
        success: true,
        data: {
            leaderboard,
            myRank,
            pagination: {
                currentPage: parseInt(page),
                totalPages: Math.ceil(total / parseInt(limit)),
                totalUsers: total
            }
        }
    });
});
