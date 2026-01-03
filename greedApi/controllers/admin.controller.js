import { asyncHandler } from "../middlewares/asyncHandler.middleware.js";
import ErrorHandler from "../middlewares/error.middleware.js";
import { User } from "../models/user.model.js";
import { Wallet } from "../models/wallet.model.js";
import { Event } from "../models/event.model.js";
import { Challenge } from "../models/challenge.model.js";
import { Mission } from "../models/mission.model.js";
import { Community } from "../models/community.model.js";
import { ActivityLog } from "../models/activityLog.model.js";
import { logActivity } from "../utils/logActivity.utils.js";

// ============================================
// GET ALL USERS (ADMIN)
// ============================================

export const getAllUsers = asyncHandler(async (req, res, next) => {
    const { 
        page = 1, 
        limit = 20, 
        role,
        status,
        search,
        sortBy = "createdAt",
        sortOrder = "desc",
        isPremium,
        isVerified
    } = req.query;

    const query = {};
    
    if (role) query.role = role;
    if (status) query.status = status;
    if (isPremium !== undefined) query.isPremium = isPremium === "true";
    if (isVerified !== undefined) query.isVerified = isVerified === "true";
    
    if (search) {
        query.$or = [
            { username: { $regex: search, $options: "i" } },
            { email: { $regex: search, $options: "i" } },
            { fullName: { $regex: search, $options: "i" } }
        ];
    }

    const skip = (parseInt(page) - 1) * parseInt(limit);
    const sortOptions = { [sortBy]: sortOrder === "asc" ? 1 : -1 };

    const [users, total] = await Promise.all([
        User.find(query)
            .select("-password -refreshToken -otp")
            .sort(sortOptions)
            .skip(skip)
            .limit(parseInt(limit)),
        User.countDocuments(query)
    ]);

    res.status(200).json({
        success: true,
        data: {
            users,
            pagination: {
                currentPage: parseInt(page),
                totalPages: Math.ceil(total / parseInt(limit)),
                totalUsers: total,
                hasNextPage: skip + users.length < total,
                hasPrevPage: parseInt(page) > 1
            }
        }
    });
});

// ============================================
// GET USER BY ID (ADMIN)
// ============================================

export const getUserById = asyncHandler(async (req, res, next) => {
    const { userId } = req.params;

    const user = await User.findById(userId)
        .select("-password -refreshToken -otp");

    if (!user) {
        return next(new ErrorHandler("User not found", 404));
    }

    // Get additional user data
    const [wallet, recentActivity] = await Promise.all([
        Wallet.findOne({ user: userId }),
        ActivityLog.find({ user: userId })
            .sort({ createdAt: -1 })
            .limit(10)
    ]);

    res.status(200).json({
        success: true,
        data: {
            user,
            wallet: wallet ? { balance: wallet.balance } : null,
            recentActivity
        }
    });
});

// ============================================
// UPDATE USER (ADMIN)
// ============================================

export const updateUser = asyncHandler(async (req, res, next) => {
    const { userId } = req.params;
    const updateData = req.body;

    const user = await User.findById(userId);

    if (!user) {
        return next(new ErrorHandler("User not found", 404));
    }

    // Prevent modifying super admin unless you are super admin
    if (user.role === "super_admin" && req.user.role !== "super_admin") {
        return next(new ErrorHandler("Cannot modify super admin", 403));
    }

    const allowedUpdates = [
        "fullName", "username", "email", "role", "status",
        "isVerified", "isPremium", "level", "xp", "points"
    ];

    allowedUpdates.forEach(field => {
        if (updateData[field] !== undefined) {
            user[field] = updateData[field];
        }
    });

    await user.save();

    await logActivity(
        req.user._id,
        "admin_action",
        `Updated user: ${user.username}`,
        req,
        "user",
        user._id
    );

    res.status(200).json({
        success: true,
        message: "User updated successfully",
        data: user
    });
});

// ============================================
// BAN USER
// ============================================

export const banUser = asyncHandler(async (req, res, next) => {
    const { userId } = req.params;
    const { reason, duration } = req.body;

    const user = await User.findById(userId);

    if (!user) {
        return next(new ErrorHandler("User not found", 404));
    }

    // Cannot ban admin or super_admin
    if (user.role === "admin" || user.role === "super_admin") {
        if (req.user.role !== "super_admin") {
            return next(new ErrorHandler("Cannot ban admin users", 403));
        }
    }

    user.status = "banned";
    user.banReason = reason;
    user.bannedAt = new Date();
    user.bannedBy = req.user._id;
    
    if (duration) {
        user.banExpiresAt = new Date(Date.now() + duration * 24 * 60 * 60 * 1000);
    }

    await user.save();

    await logActivity(
        req.user._id,
        "admin_action",
        `Banned user: ${user.username}. Reason: ${reason}`,
        req,
        "user",
        user._id
    );

    res.status(200).json({
        success: true,
        message: "User banned successfully"
    });
});

// ============================================
// UNBAN USER
// ============================================

export const unbanUser = asyncHandler(async (req, res, next) => {
    const { userId } = req.params;

    const user = await User.findById(userId);

    if (!user) {
        return next(new ErrorHandler("User not found", 404));
    }

    if (user.status !== "banned") {
        return next(new ErrorHandler("User is not banned", 400));
    }

    user.status = "active";
    user.banReason = undefined;
    user.bannedAt = undefined;
    user.bannedBy = undefined;
    user.banExpiresAt = undefined;
    user.unbannedBy = req.user._id;
    user.unbannedAt = new Date();

    await user.save();

    await logActivity(
        req.user._id,
        "admin_action",
        `Unbanned user: ${user.username}`,
        req,
        "user",
        user._id
    );

    res.status(200).json({
        success: true,
        message: "User unbanned successfully"
    });
});

// ============================================
// CHANGE USER ROLE
// ============================================

export const changeUserRole = asyncHandler(async (req, res, next) => {
    const { userId } = req.params;
    const { role } = req.body;

    if (!["user", "admin", "moderator", "super_admin"].includes(role)) {
        return next(new ErrorHandler("Invalid role", 400));
    }

    // Only super_admin can assign super_admin or admin roles
    if ((role === "super_admin" || role === "admin") && req.user.role !== "super_admin") {
        return next(new ErrorHandler("Only super admin can assign this role", 403));
    }

    const user = await User.findById(userId);

    if (!user) {
        return next(new ErrorHandler("User not found", 404));
    }

    // Cannot change super_admin role unless you are super_admin
    if (user.role === "super_admin" && req.user.role !== "super_admin") {
        return next(new ErrorHandler("Cannot modify super admin", 403));
    }

    const previousRole = user.role;
    user.role = role;
    await user.save();

    await logActivity(
        req.user._id,
        "admin_action",
        `Changed role for ${user.username}: ${previousRole} -> ${role}`,
        req,
        "user",
        user._id
    );

    res.status(200).json({
        success: true,
        message: "User role updated successfully"
    });
});

// ============================================
// DELETE USER (SOFT DELETE)
// ============================================

export const deleteUser = asyncHandler(async (req, res, next) => {
    const { userId } = req.params;

    const user = await User.findById(userId);

    if (!user) {
        return next(new ErrorHandler("User not found", 404));
    }

    // Cannot delete super_admin
    if (user.role === "super_admin") {
        return next(new ErrorHandler("Cannot delete super admin", 403));
    }

    // Cannot delete admin unless super_admin
    if (user.role === "admin" && req.user.role !== "super_admin") {
        return next(new ErrorHandler("Only super admin can delete admin users", 403));
    }

    user.isDeleted = true;
    user.deletedAt = new Date();
    user.deletedBy = req.user._id;
    user.email = `deleted_${Date.now()}_${user.email}`;
    user.username = `deleted_${Date.now()}_${user.username}`;
    await user.save();

    await logActivity(
        req.user._id,
        "admin_action",
        `Deleted user: ${user.username}`,
        req,
        "user",
        user._id
    );

    res.status(200).json({
        success: true,
        message: "User deleted successfully"
    });
});

// ============================================
// ADD COINS TO USER
// ============================================

export const addCoinsToUser = asyncHandler(async (req, res, next) => {
    const { userId } = req.params;
    const { amount, reason } = req.body;

    const numAmount = Number(amount);
    if (!numAmount || numAmount <= 0) {
        return next(new ErrorHandler("Invalid amount", 400));
    }

    const user = await User.findById(userId);
    if (!user) {
        return next(new ErrorHandler("User not found", 404));
    }

    const wallet = await Wallet.findOne({ user: userId });
    if (!wallet) {
        return next(new ErrorHandler("Wallet not found", 404));
    }

    // addCoins(amount, type, reference, refModel, description)
    await wallet.addCoins(
        numAmount,
        "bonus",
        null,
        null,
        reason || "Admin credit"
    );

    await logActivity(
        req.user._id,
        "admin_action",
        `Added ${numAmount} coins to ${user.username}. Reason: ${reason || "Admin credit"}`,
        req,
        "wallet",
        wallet._id
    );

    res.status(200).json({
        success: true,
        message: `${numAmount} coins added successfully`,
        data: { newBalance: wallet.totalBalance }
    });
});

// ============================================
// DEDUCT COINS FROM USER
// ============================================

export const deductCoinsFromUser = asyncHandler(async (req, res, next) => {
    const { userId } = req.params;
    const { amount, reason } = req.body;

    const numAmount = Number(amount);
    if (!numAmount || numAmount <= 0) {
        return next(new ErrorHandler("Invalid amount", 400));
    }

    const user = await User.findById(userId);
    if (!user) {
        return next(new ErrorHandler("User not found", 404));
    }

    const wallet = await Wallet.findOne({ user: userId });
    if (!wallet) {
        return next(new ErrorHandler("Wallet not found", 404));
    }

    if (wallet.totalBalance < numAmount) {
        return next(new ErrorHandler("User has insufficient balance", 400));
    }

    // deductCoins(amount, reference, refModel, description)
    await wallet.deductCoins(
        numAmount,
        null,
        null,
        reason || "Admin debit"
    );

    await logActivity(
        req.user._id,
        "admin_action",
        `Deducted ${numAmount} coins from ${user.username}. Reason: ${reason || "Admin debit"}`,
        req,
        "wallet",
        wallet._id
    );

    res.status(200).json({
        success: true,
        message: `${numAmount} coins deducted successfully`,
        data: { newBalance: wallet.totalBalance }
    });
});

// ============================================
// GET DASHBOARD STATS
// ============================================

export const getDashboardStats = asyncHandler(async (req, res, next) => {
    const now = new Date();
    const startOfToday = new Date(now.setHours(0, 0, 0, 0));
    const startOfWeek = new Date(now.setDate(now.getDate() - now.getDay()));
    const startOfMonth = new Date(now.getFullYear(), now.getMonth(), 1);

    const [
        totalUsers,
        newUsersToday,
        newUsersThisWeek,
        newUsersThisMonth,
        activeUsers,
        bannedUsers,
        premiumUsers,
        totalEvents,
        activeEvents,
        totalChallenges,
        totalMissions,
        totalCommunities,
        usersByRole
    ] = await Promise.all([
        User.countDocuments({ isDeleted: { $ne: true } }),
        User.countDocuments({ createdAt: { $gte: startOfToday } }),
        User.countDocuments({ createdAt: { $gte: startOfWeek } }),
        User.countDocuments({ createdAt: { $gte: startOfMonth } }),
        User.countDocuments({ status: "active", isDeleted: { $ne: true } }),
        User.countDocuments({ status: "banned" }),
        User.countDocuments({ isPremium: true }),
        Event.countDocuments({ isDeleted: { $ne: true } }),
        Event.countDocuments({ 
            isDeleted: { $ne: true },
            startDate: { $lte: new Date() },
            endDate: { $gte: new Date() }
        }),
        Challenge.countDocuments({ isDeleted: false }),
        Mission.countDocuments({ isDeleted: false }),
        Community.countDocuments({ isDeleted: false }),
        User.aggregate([
            { $match: { isDeleted: { $ne: true } } },
            { $group: { _id: "$role", count: { $sum: 1 } } }
        ])
    ]);

    // Format roles
    const roleStats = {};
    usersByRole.forEach(r => {
        roleStats[r._id] = r.count;
    });

    res.status(200).json({
        success: true,
        data: {
            users: {
                total: totalUsers,
                active: activeUsers,
                banned: bannedUsers,
                premium: premiumUsers,
                newToday: newUsersToday,
                newThisWeek: newUsersThisWeek,
                newThisMonth: newUsersThisMonth,
                byRole: roleStats
            },
            content: {
                events: {
                    total: totalEvents,
                    active: activeEvents
                },
                challenges: totalChallenges,
                missions: totalMissions,
                communities: totalCommunities
            }
        }
    });
});

// ============================================
// GET ACTIVITY LOGS (ADMIN)
// ============================================

export const getActivityLogs = asyncHandler(async (req, res, next) => {
    const { 
        page = 1, 
        limit = 50, 
        userId,
        action,
        startDate,
        endDate
    } = req.query;

    const query = { isDeleted: false };
    
    if (userId) query.user_id = userId;
    
    // Filter by action (event_type in activities array)
    let pipeline = [
        { $match: query },
        { $unwind: "$activities" }
    ];
    
    if (action) {
        pipeline.push({ $match: { "activities.event_type": action } });
    }
    
    if (startDate || endDate) {
        const dateFilter = {};
        if (startDate) dateFilter.$gte = new Date(startDate);
        if (endDate) dateFilter.$lte = new Date(endDate);
        pipeline.push({ $match: { "activities.createdAt": dateFilter } });
    }
    
    pipeline.push(
        { $sort: { "activities.createdAt": -1 } },
        { $skip: (parseInt(page) - 1) * parseInt(limit) },
        { $limit: parseInt(limit) },
        {
            $lookup: {
                from: "users",
                localField: "user_id",
                foreignField: "_id",
                as: "userInfo"
            }
        },
        { $unwind: { path: "$userInfo", preserveNullAndEmptyArrays: true } },
        {
            $project: {
                _id: 1,
                user_id: 1,
                username: "$userInfo.username",
                email: "$userInfo.email",
                avatar: "$userInfo.avatar",
                activity: "$activities"
            }
        }
    );

    const logs = await ActivityLog.aggregate(pipeline);
    
    // Get total count
    const countPipeline = [
        { $match: query },
        { $unwind: "$activities" }
    ];
    if (action) {
        countPipeline.push({ $match: { "activities.event_type": action } });
    }
    countPipeline.push({ $count: "total" });
    
    const countResult = await ActivityLog.aggregate(countPipeline);
    const total = countResult[0]?.total || 0;

    const skip = (parseInt(page) - 1) * parseInt(limit);

    res.status(200).json({
        success: true,
        data: {
            logs,
            pagination: {
                currentPage: parseInt(page),
                totalPages: Math.ceil(total / parseInt(limit)),
                totalLogs: total,
                hasNextPage: skip + logs.length < total,
                hasPrevPage: parseInt(page) > 1
            }
        }
    });
});

// ============================================
// GET USER GROWTH ANALYTICS
// ============================================

export const getUserGrowthAnalytics = asyncHandler(async (req, res, next) => {
    const { period = "30" } = req.query;
    const days = parseInt(period);

    const startDate = new Date();
    startDate.setDate(startDate.getDate() - days);

    const growth = await User.aggregate([
        {
            $match: {
                createdAt: { $gte: startDate }
            }
        },
        {
            $group: {
                _id: {
                    $dateToString: { format: "%Y-%m-%d", date: "$createdAt" }
                },
                count: { $sum: 1 }
            }
        },
        { $sort: { _id: 1 } }
    ]);

    res.status(200).json({
        success: true,
        data: growth.map(g => ({
            date: g._id,
            newUsers: g.count
        }))
    });
});
