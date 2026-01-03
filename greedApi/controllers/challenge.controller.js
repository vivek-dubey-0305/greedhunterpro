import { asyncHandler } from "../middlewares/asyncHandler.middleware.js";
import ErrorHandler from "../middlewares/error.middleware.js";
import { Challenge } from "../models/challenge.model.js";
import { User } from "../models/user.model.js";
import { Wallet } from "../models/wallet.model.js";
import { logActivity } from "../utils/logActivity.utils.js";

// ============================================
// GET ALL CHALLENGES (PUBLIC)
// ============================================

export const getAllChallenges = asyncHandler(async (req, res, next) => {
    const { 
        page = 1, 
        limit = 10, 
        type, 
        difficulty, 
        category, 
        status = "active" 
    } = req.query;

    const query = { isDeleted: false };
    
    if (type) query.type = type;
    if (difficulty) query.difficulty = difficulty;
    if (category) query.category = category;
    if (status) query.status = status;

    const skip = (parseInt(page) - 1) * parseInt(limit);

    const [challenges, total] = await Promise.all([
        Challenge.find(query)
            .sort({ startDate: -1 })
            .skip(skip)
            .limit(parseInt(limit))
            .populate("createdBy", "username avatar"),
        Challenge.countDocuments(query)
    ]);

    res.status(200).json({
        success: true,
        data: {
            challenges,
            pagination: {
                currentPage: parseInt(page),
                totalPages: Math.ceil(total / parseInt(limit)),
                totalChallenges: total,
                hasNextPage: skip + challenges.length < total,
                hasPrevPage: parseInt(page) > 1
            }
        }
    });
});

// ============================================
// GET CHALLENGE BY ID
// ============================================

export const getChallengeById = asyncHandler(async (req, res, next) => {
    const { challengeId } = req.params;

    const challenge = await Challenge.findOne({ 
        _id: challengeId, 
        isDeleted: false 
    }).populate("createdBy", "username avatar");

    if (!challenge) {
        return next(new ErrorHandler("Challenge not found", 404));
    }

    res.status(200).json({
        success: true,
        data: challenge
    });
});

// ============================================
// GET USER'S CHALLENGES
// ============================================

export const getUserChallenges = asyncHandler(async (req, res, next) => {
    const userId = req.user._id;
    const { page = 1, limit = 10, status } = req.query;

    const query = { 
        isDeleted: false,
        "userCompletions.user": userId
    };
    
    if (status) query.status = status;

    const skip = (parseInt(page) - 1) * parseInt(limit);

    const [challenges, total] = await Promise.all([
        Challenge.find(query)
            .sort({ "userCompletions.completedAt": -1 })
            .skip(skip)
            .limit(parseInt(limit)),
        Challenge.countDocuments(query)
    ]);

    // Add user-specific data
    const challengesWithProgress = challenges.map(challenge => {
        const userCompletion = challenge.userCompletions.find(
            uc => uc.user.toString() === userId.toString()
        );
        return {
            ...challenge.toObject(),
            userProgress: userCompletion?.progress || 0,
            isCompleted: userCompletion?.isCompleted || false,
            completedAt: userCompletion?.completedAt
        };
    });

    res.status(200).json({
        success: true,
        data: {
            challenges: challengesWithProgress,
            pagination: {
                currentPage: parseInt(page),
                totalPages: Math.ceil(total / parseInt(limit)),
                totalChallenges: total,
                hasNextPage: skip + challenges.length < total,
                hasPrevPage: parseInt(page) > 1
            }
        }
    });
});

// ============================================
// UPDATE CHALLENGE PROGRESS
// ============================================

export const updateChallengeProgress = asyncHandler(async (req, res, next) => {
    const { challengeId } = req.params;
    const { progress } = req.body;
    const userId = req.user._id;

    const challenge = await Challenge.findOne({ 
        _id: challengeId, 
        isDeleted: false,
        status: "active"
    });

    if (!challenge) {
        return next(new ErrorHandler("Challenge not found or not active", 404));
    }

    // Check if already completed
    if (challenge.isCompletedByUser(userId)) {
        return res.status(200).json({
            success: true,
            message: "Challenge already completed",
            data: { alreadyCompleted: true }
        });
    }

    // Update progress
    await challenge.updateUserProgress(userId, progress);

    // Check if just completed
    const isNowCompleted = challenge.isCompletedByUser(userId);
    
    if (isNowCompleted) {
        // Award rewards
        const wallet = await Wallet.findOne({ user: userId });
        if (wallet) {
            await wallet.addCoins(
                challenge.coinReward, 
                "bonus", 
                challenge._id, 
                "Challenge",
                `Completed challenge: ${challenge.title}`
            );
        }

        // Update user stats
        await User.findByIdAndUpdate(userId, {
            $inc: { 
                "stats.challengesCompleted": 1,
                xp: challenge.xpReward,
                points: challenge.coinReward
            }
        });

        // Log activity
        await logActivity(
            userId,
            "challenge_completed",
            `Completed challenge: ${challenge.title}`,
            req,
            "challenge",
            challenge._id
        );
    }

    res.status(200).json({
        success: true,
        message: isNowCompleted ? "Challenge completed! Rewards earned." : "Progress updated",
        data: {
            progress: challenge.getUserProgress(userId),
            isCompleted: isNowCompleted,
            rewards: isNowCompleted ? {
                coins: challenge.coinReward,
                xp: challenge.xpReward
            } : null
        }
    });
});

// ============================================
// ADMIN: CREATE CHALLENGE
// ============================================

export const createChallenge = asyncHandler(async (req, res, next) => {
    const {
        title,
        description,
        type,
        difficulty,
        category,
        coinReward,
        xpReward,
        requirements,
        targetValue,
        maxCompletions,
        startDate,
        endDate,
        status
    } = req.body;

    const challenge = await Challenge.create({
        title,
        description,
        type,
        difficulty,
        category,
        coinReward: coinReward || 100,
        xpReward: xpReward || 200,
        requirements,
        targetValue: targetValue || 1,
        maxCompletions: maxCompletions || 0,
        startDate: new Date(startDate),
        endDate: new Date(endDate),
        status: status || "active",
        createdBy: req.user._id
    });

    await logActivity(
        req.user._id,
        "admin_action",
        `Created challenge: ${title}`,
        req,
        "challenge",
        challenge._id
    );

    res.status(201).json({
        success: true,
        message: "Challenge created successfully",
        data: challenge
    });
});

// ============================================
// ADMIN: UPDATE CHALLENGE
// ============================================

export const updateChallenge = asyncHandler(async (req, res, next) => {
    const { challengeId } = req.params;
    const updateData = req.body;

    const challenge = await Challenge.findOne({ 
        _id: challengeId, 
        isDeleted: false 
    });

    if (!challenge) {
        return next(new ErrorHandler("Challenge not found", 404));
    }

    // Update allowed fields
    const allowedUpdates = [
        "title", "description", "type", "difficulty", "category",
        "coinReward", "xpReward", "requirements", "targetValue",
        "maxCompletions", "startDate", "endDate", "status", "image"
    ];

    allowedUpdates.forEach(field => {
        if (updateData[field] !== undefined) {
            if (field === "startDate" || field === "endDate") {
                challenge[field] = new Date(updateData[field]);
            } else {
                challenge[field] = updateData[field];
            }
        }
    });

    challenge.updatedBy = req.user._id;
    await challenge.save();

    await logActivity(
        req.user._id,
        "admin_action",
        `Updated challenge: ${challenge.title}`,
        req,
        "challenge",
        challenge._id
    );

    res.status(200).json({
        success: true,
        message: "Challenge updated successfully",
        data: challenge
    });
});

// ============================================
// ADMIN: DELETE CHALLENGE
// ============================================

export const deleteChallenge = asyncHandler(async (req, res, next) => {
    const { challengeId } = req.params;

    const challenge = await Challenge.findOne({ 
        _id: challengeId, 
        isDeleted: false 
    });

    if (!challenge) {
        return next(new ErrorHandler("Challenge not found", 404));
    }

    await challenge.softDelete(req.user._id);

    await logActivity(
        req.user._id,
        "admin_action",
        `Deleted challenge: ${challenge.title}`,
        req,
        "challenge",
        challenge._id
    );

    res.status(200).json({
        success: true,
        message: "Challenge deleted successfully"
    });
});

// ============================================
// ADMIN: GET ALL CHALLENGES (WITH DELETED)
// ============================================

export const adminGetAllChallenges = asyncHandler(async (req, res, next) => {
    const { 
        page = 1, 
        limit = 10, 
        type, 
        difficulty, 
        status,
        includeDeleted = false
    } = req.query;

    const query = {};
    
    if (!includeDeleted) query.isDeleted = false;
    if (type) query.type = type;
    if (difficulty) query.difficulty = difficulty;
    if (status) query.status = status;

    const skip = (parseInt(page) - 1) * parseInt(limit);

    const [challenges, total] = await Promise.all([
        Challenge.find(query)
            .sort({ createdAt: -1 })
            .skip(skip)
            .limit(parseInt(limit))
            .populate("createdBy", "username avatar")
            .populate("updatedBy", "username"),
        Challenge.countDocuments(query)
    ]);

    res.status(200).json({
        success: true,
        data: {
            challenges,
            pagination: {
                currentPage: parseInt(page),
                totalPages: Math.ceil(total / parseInt(limit)),
                totalChallenges: total,
                hasNextPage: skip + challenges.length < total,
                hasPrevPage: parseInt(page) > 1
            }
        }
    });
});
