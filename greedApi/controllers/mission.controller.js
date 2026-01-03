import { asyncHandler } from "../middlewares/asyncHandler.middleware.js";
import ErrorHandler from "../middlewares/error.middleware.js";
import { Mission } from "../models/mission.model.js";
import { User } from "../models/user.model.js";
import { Wallet } from "../models/wallet.model.js";
import { logActivity } from "../utils/logActivity.utils.js";

// ============================================
// GET ALL MISSIONS (PUBLIC)
// ============================================

export const getAllMissions = asyncHandler(async (req, res, next) => {
    const { category, status = "active" } = req.query;

    const query = { isDeleted: false };
    
    if (category) query.category = category;
    if (status) query.status = status;

    const missions = await Mission.find(query)
        .sort({ order: 1, createdAt: -1 })
        .populate("createdBy", "username avatar");

    res.status(200).json({
        success: true,
        data: missions
    });
});

// ============================================
// GET MISSION BY ID
// ============================================

export const getMissionById = asyncHandler(async (req, res, next) => {
    const { missionId } = req.params;

    const mission = await Mission.findOne({ 
        _id: missionId, 
        isDeleted: false 
    }).populate("createdBy", "username avatar");

    if (!mission) {
        return next(new ErrorHandler("Mission not found", 404));
    }

    res.status(200).json({
        success: true,
        data: mission
    });
});

// ============================================
// GET USER'S DAILY MISSIONS
// ============================================

export const getUserMissions = asyncHandler(async (req, res, next) => {
    const userId = req.user._id;

    const missions = await Mission.find({ 
        isDeleted: false,
        status: "active"
    }).sort({ order: 1 });

    // Add user-specific progress for today
    const missionsWithProgress = missions.map(mission => {
        const todayCompletion = mission.getUserTodayCompletion(userId);
        return {
            ...mission.toObject(),
            userProgress: todayCompletion?.progress || 0,
            isCompletedToday: todayCompletion?.isCompleted || false,
            completedAt: todayCompletion?.completedAt
        };
    });

    res.status(200).json({
        success: true,
        data: missionsWithProgress
    });
});

// ============================================
// UPDATE MISSION PROGRESS
// ============================================

export const updateMissionProgress = asyncHandler(async (req, res, next) => {
    const { missionId } = req.params;
    const { progressIncrement = 1 } = req.body;
    const userId = req.user._id;

    const mission = await Mission.findOne({ 
        _id: missionId, 
        isDeleted: false,
        status: "active"
    });

    if (!mission) {
        return next(new ErrorHandler("Mission not found or not active", 404));
    }

    // Check if already completed today
    if (mission.isCompletedTodayByUser(userId)) {
        return res.status(200).json({
            success: true,
            message: "Mission already completed today",
            data: { alreadyCompleted: true }
        });
    }

    // Update progress
    const { alreadyCompleted } = await mission.updateUserProgress(userId, progressIncrement);

    if (alreadyCompleted) {
        return res.status(200).json({
            success: true,
            message: "Mission already completed today",
            data: { alreadyCompleted: true }
        });
    }

    // Check if just completed
    const isNowCompleted = mission.isCompletedTodayByUser(userId);
    
    if (isNowCompleted) {
        // Award rewards
        const wallet = await Wallet.findOne({ user: userId });
        if (wallet) {
            await wallet.addCoins(
                mission.coinReward, 
                "bonus", 
                mission._id, 
                "Mission",
                `Completed daily mission: ${mission.title}`
            );
        }

        // Update user stats and streak
        const user = await User.findById(userId);
        const today = new Date();
        today.setHours(0, 0, 0, 0);
        
        const lastActive = user.stats.lastActiveDate ? new Date(user.stats.lastActiveDate) : null;
        let currentStreak = user.stats.currentStreak || 0;
        
        if (lastActive) {
            lastActive.setHours(0, 0, 0, 0);
            const dayDiff = Math.floor((today - lastActive) / (1000 * 60 * 60 * 24));
            
            if (dayDiff === 1) {
                currentStreak += 1;
            } else if (dayDiff > 1) {
                currentStreak = 1;
            }
        } else {
            currentStreak = 1;
        }

        await User.findByIdAndUpdate(userId, {
            $inc: { 
                "stats.missionsCompleted": 1,
                xp: mission.xpReward,
                points: mission.coinReward
            },
            $set: {
                "stats.currentStreak": currentStreak,
                "stats.longestStreak": Math.max(currentStreak, user.stats.longestStreak || 0),
                "stats.lastActiveDate": new Date()
            }
        });

        // Log activity
        await logActivity(
            userId,
            "mission_completed",
            `Completed daily mission: ${mission.title}`,
            req,
            "mission",
            mission._id
        );
    }

    const todayCompletion = mission.getUserTodayCompletion(userId);

    res.status(200).json({
        success: true,
        message: isNowCompleted ? "Mission completed! Rewards earned." : "Progress updated",
        data: {
            progress: todayCompletion?.progress || 0,
            targetValue: mission.targetValue,
            isCompleted: isNowCompleted,
            rewards: isNowCompleted ? {
                coins: mission.coinReward,
                xp: mission.xpReward
            } : null
        }
    });
});

// ============================================
// ADMIN: CREATE MISSION
// ============================================

export const createMission = asyncHandler(async (req, res, next) => {
    const {
        title,
        description,
        category,
        coinReward,
        xpReward,
        targetValue,
        progressDescription,
        resetTime,
        isRecurring,
        status,
        order
    } = req.body;

    const mission = await Mission.create({
        title,
        description,
        category,
        coinReward: coinReward || 10,
        xpReward: xpReward || 25,
        targetValue: targetValue || 1,
        progressDescription,
        resetTime: resetTime || "00:00",
        isRecurring: isRecurring !== false,
        status: status || "active",
        order: order || 0,
        createdBy: req.user._id
    });

    await logActivity(
        req.user._id,
        "admin_action",
        `Created daily mission: ${title}`,
        req,
        "mission",
        mission._id
    );

    res.status(201).json({
        success: true,
        message: "Mission created successfully",
        data: mission
    });
});

// ============================================
// ADMIN: UPDATE MISSION
// ============================================

export const updateMission = asyncHandler(async (req, res, next) => {
    const { missionId } = req.params;
    const updateData = req.body;

    const mission = await Mission.findOne({ 
        _id: missionId, 
        isDeleted: false 
    });

    if (!mission) {
        return next(new ErrorHandler("Mission not found", 404));
    }

    // Update allowed fields
    const allowedUpdates = [
        "title", "description", "category", "coinReward", "xpReward",
        "targetValue", "progressDescription", "resetTime", "isRecurring",
        "status", "order", "image"
    ];

    allowedUpdates.forEach(field => {
        if (updateData[field] !== undefined) {
            mission[field] = updateData[field];
        }
    });

    mission.updatedBy = req.user._id;
    await mission.save();

    await logActivity(
        req.user._id,
        "admin_action",
        `Updated daily mission: ${mission.title}`,
        req,
        "mission",
        mission._id
    );

    res.status(200).json({
        success: true,
        message: "Mission updated successfully",
        data: mission
    });
});

// ============================================
// ADMIN: DELETE MISSION
// ============================================

export const deleteMission = asyncHandler(async (req, res, next) => {
    const { missionId } = req.params;

    const mission = await Mission.findOne({ 
        _id: missionId, 
        isDeleted: false 
    });

    if (!mission) {
        return next(new ErrorHandler("Mission not found", 404));
    }

    await mission.softDelete(req.user._id);

    await logActivity(
        req.user._id,
        "admin_action",
        `Deleted daily mission: ${mission.title}`,
        req,
        "mission",
        mission._id
    );

    res.status(200).json({
        success: true,
        message: "Mission deleted successfully"
    });
});

// ============================================
// ADMIN: GET ALL MISSIONS
// ============================================

export const adminGetAllMissions = asyncHandler(async (req, res, next) => {
    const { 
        page = 1, 
        limit = 20, 
        category, 
        status,
        includeDeleted = false
    } = req.query;

    const query = {};
    
    if (!includeDeleted) query.isDeleted = false;
    if (category) query.category = category;
    if (status) query.status = status;

    const skip = (parseInt(page) - 1) * parseInt(limit);

    const [missions, total] = await Promise.all([
        Mission.find(query)
            .sort({ order: 1, createdAt: -1 })
            .skip(skip)
            .limit(parseInt(limit))
            .populate("createdBy", "username avatar")
            .populate("updatedBy", "username"),
        Mission.countDocuments(query)
    ]);

    res.status(200).json({
        success: true,
        data: {
            missions,
            pagination: {
                currentPage: parseInt(page),
                totalPages: Math.ceil(total / parseInt(limit)),
                totalMissions: total,
                hasNextPage: skip + missions.length < total,
                hasPrevPage: parseInt(page) > 1
            }
        }
    });
});

// ============================================
// ADMIN: RESET DAILY MISSIONS (CRON JOB)
// ============================================

export const resetDailyMissions = asyncHandler(async (req, res, next) => {
    await Mission.resetAllDailyCompletions();

    await logActivity(
        req.user._id,
        "admin_action",
        "Reset all daily mission completions",
        req,
        "system",
        null
    );

    res.status(200).json({
        success: true,
        message: "Daily missions reset successfully"
    });
});

// ============================================
// GET MISSION STATS (FOR DASHBOARD)
// ============================================

export const getMissionStats = asyncHandler(async (req, res, next) => {
    const userId = req.user._id;

    const missions = await Mission.find({ 
        isDeleted: false,
        status: "active"
    });

    let completedToday = 0;
    let totalMissions = missions.length;

    missions.forEach(mission => {
        if (mission.isCompletedTodayByUser(userId)) {
            completedToday += 1;
        }
    });

    const user = await User.findById(userId).select("stats");

    res.status(200).json({
        success: true,
        data: {
            completedToday,
            totalMissions,
            totalCompleted: user?.stats?.missionsCompleted || 0,
            currentStreak: user?.stats?.currentStreak || 0,
            longestStreak: user?.stats?.longestStreak || 0
        }
    });
});
