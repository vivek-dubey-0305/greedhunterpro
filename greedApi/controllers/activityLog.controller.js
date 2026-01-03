import { asyncHandler } from "../middlewares/asyncHandler.middleware.js";
import ErrorHandler from "../middlewares/error.middleware.js";
import { ActivityLog } from "../models/activityLog.model.js";
import { User } from "../models/user.model.js";
import { logActivity } from "../utils/logActivity.utils.js";

// ============================================
// GET USER ACTIVITY LOG
// ============================================

const getUserActivityLog = asyncHandler(async (req, res, next) => {
    const userId = req.user._id;
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 20;
    const eventType = req.query.eventType; // filter by event type
    const startDate = req.query.startDate ? new Date(req.query.startDate) : null;
    const endDate = req.query.endDate ? new Date(req.query.endDate) : null;

    const activityLog = await ActivityLog.findOne({ user_id: userId, isDeleted: false });

    if (!activityLog) {
        return res.status(200).json({
            success: true,
            activities: [],
            pagination: {
                currentPage: 1,
                totalPages: 0,
                totalActivities: 0,
                hasNext: false,
                hasPrev: false
            }
        });
    }

    const { activities, totalActivities, currentPage, totalPages } = activityLog.getActivities(page, limit, eventType);

    // Apply date filters if provided
    let filteredActivities = activities;
    if (startDate || endDate) {
        filteredActivities = activities.filter(activity => {
            const activityDate = new Date(activity.createdAt);
            if (startDate && activityDate < startDate) return false;
            if (endDate && activityDate > endDate) return false;
            return true;
        });
    }

    res.status(200).json({
        success: true,
        activities: filteredActivities,
        pagination: {
            currentPage: page,
            totalPages: Math.ceil(filteredActivities.length / limit) || totalPages,
            totalActivities: filteredActivities.length,
            hasNext: page * limit < filteredActivities.length,
            hasPrev: page > 1
        }
    });
});

// ============================================
// GET ACTIVITY LOG BY USER ID (Admin)
// ============================================

const getActivityLogByUserId = asyncHandler(async (req, res, next) => {
    const { userId } = req.params;
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 20;
    const eventType = req.query.eventType;

    // Check if requester is admin
    const requester = await User.findById(req.user._id);
    if (requester.role !== 'admin' && requester.role !== 'super_admin') {
        return next(new ErrorHandler("Unauthorized to view other users' activity logs", 403));
    }

    const activityLog = await ActivityLog.findOne({ user_id: userId, isDeleted: false });

    if (!activityLog) {
        return next(new ErrorHandler("Activity log not found", 404));
    }

    const { activities, totalActivities, currentPage, totalPages } = activityLog.getActivities(page, limit, eventType);

    res.status(200).json({
        success: true,
        userId,
        activities,
        pagination: {
            currentPage,
            totalPages,
            totalActivities,
            hasNext: currentPage * limit < totalActivities,
            hasPrev: currentPage > 1
        }
    });
});

// ============================================
// GET ACTIVITY STATISTICS
// ============================================

const getActivityStats = asyncHandler(async (req, res, next) => {
    const userId = req.user._id;

    const activityLog = await ActivityLog.findOne({ user_id: userId, isDeleted: false });

    if (!activityLog) {
        return res.status(200).json({
            success: true,
            stats: {
                totalActivities: 0,
                activitiesByType: {},
                recentActivity: null,
                activityStreak: 0
            }
        });
    }

    const activities = activityLog.activities;
    const activitiesByType = {};

    activities.forEach(activity => {
        const type = activity.event_type;
        activitiesByType[type] = (activitiesByType[type] || 0) + 1;
    });

    // Calculate activity streak (consecutive days with activities)
    const sortedActivities = activities.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
    let streak = 0;
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    for (let i = 0; i < sortedActivities.length; i++) {
        const activityDate = new Date(sortedActivities[i].createdAt);
        activityDate.setHours(0, 0, 0, 0);

        const daysDiff = Math.floor((today - activityDate) / (1000 * 60 * 60 * 24));

        if (daysDiff === streak) {
            streak++;
        } else if (daysDiff > streak) {
            break;
        }
    }

    res.status(200).json({
        success: true,
        stats: {
            totalActivities: activities.length,
            activitiesByType,
            recentActivity: activityLog.latestActivity,
            activityStreak: streak
        }
    });
});

// ============================================
// SEARCH ACTIVITIES
// ============================================

const searchActivities = asyncHandler(async (req, res, next) => {
    const userId = req.user._id;
    const { query, eventType, startDate, endDate } = req.query;
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 20;

    const activityLog = await ActivityLog.findOne({ user_id: userId, isDeleted: false });

    if (!activityLog) {
        return res.status(200).json({
            success: true,
            activities: [],
            pagination: {
                currentPage: 1,
                totalPages: 0,
                totalActivities: 0,
                hasNext: false,
                hasPrev: false
            }
        });
    }

    let filteredActivities = activityLog.activities;

    // Filter by event type
    if (eventType) {
        filteredActivities = filteredActivities.filter(activity => activity.event_type === eventType);
    }

    // Filter by date range
    if (startDate || endDate) {
        const start = startDate ? new Date(startDate) : null;
        const end = endDate ? new Date(endDate) : null;

        filteredActivities = filteredActivities.filter(activity => {
            const activityDate = new Date(activity.createdAt);
            if (start && activityDate < start) return false;
            if (end && activityDate > end) return false;
            return true;
        });
    }

    // Search in description
    if (query) {
        const searchTerm = query.toLowerCase();
        filteredActivities = filteredActivities.filter(activity =>
            activity.description.toLowerCase().includes(searchTerm) ||
            activity.event_type.toLowerCase().includes(searchTerm)
        );
    }

    // Sort by date (newest first)
    filteredActivities.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));

    // Paginate
    const startIndex = (page - 1) * limit;
    const endIndex = startIndex + limit;
    const paginatedActivities = filteredActivities.slice(startIndex, endIndex);

    res.status(200).json({
        success: true,
        activities: paginatedActivities,
        pagination: {
            currentPage: page,
            totalPages: Math.ceil(filteredActivities.length / limit),
            totalActivities: filteredActivities.length,
            hasNext: endIndex < filteredActivities.length,
            hasPrev: page > 1
        }
    });
});

// ============================================
// DELETE ACTIVITY LOG (Admin)
// ============================================

const deleteActivityLog = asyncHandler(async (req, res, next) => {
    const { userId } = req.params;
    const adminId = req.user._id;

    // Check if requester is admin
    const admin = await User.findById(adminId);
    if (admin.role !== 'admin') {
        return next(new ErrorHandler("Unauthorized to delete activity logs", 403));
    }

    const activityLog = await ActivityLog.findOne({ user_id: userId, isDeleted: false });

    if (!activityLog) {
        return next(new ErrorHandler("Activity log not found", 404));
    }

    await activityLog.softDelete();

    await logActivity(
        adminId,
        "admin_deleted_log",
        `Deleted activity log for user ${userId}`,
        req,
        'activityLog',
        activityLog._id,
        null,
        { targetUser: userId }
    );

    res.status(200).json({
        success: true,
        message: "Activity log deleted successfully"
    });
});

// ============================================
// CLEAR USER ACTIVITIES (Admin)
// ============================================

const clearUserActivities = asyncHandler(async (req, res, next) => {
    const { userId } = req.params;
    const adminId = req.user._id;

    // Check if requester is admin
    const admin = await User.findById(adminId);
    if (admin.role !== 'admin') {
        return next(new ErrorHandler("Unauthorized to clear activities", 403));
    }

    const activityLog = await ActivityLog.findOne({ user_id: userId, isDeleted: false });

    if (!activityLog) {
        return next(new ErrorHandler("Activity log not found", 404));
    }

    activityLog.activities = [];
    await activityLog.save();

    await logActivity(
        adminId,
        "admin_cleared_log",
        `Cleared all activities for user ${userId}`,
        req,
        'activityLog',
        activityLog._id,
        null,
        { targetUser: userId }
    );

    res.status(200).json({
        success: true,
        message: "User activities cleared successfully"
    });
});

// ============================================
// GET SYSTEM ACTIVITY SUMMARY (Admin)
// ============================================

const getSystemActivitySummary = asyncHandler(async (req, res, next) => {
    const adminId = req.user._id;

    // Check if requester is admin
    const admin = await User.findById(adminId);
    if (admin.role !== 'admin' && admin.role !== 'super_admin') {
        return next(new ErrorHandler("Unauthorized to view system activity summary", 403));
    }

    const startDate = req.query.startDate ? new Date(req.query.startDate) : new Date(Date.now() - 30 * 24 * 60 * 60 * 1000); // Last 30 days
    const endDate = req.query.endDate ? new Date(req.query.endDate) : new Date();

    // Aggregate activities across all users
    const summary = await ActivityLog.aggregate([
        { $match: { isDeleted: false } },
        { $unwind: "$activities" },
        {
            $match: {
                "activities.createdAt": { $gte: startDate, $lte: endDate }
            }
        },
        {
            $group: {
                _id: "$activities.event_type",
                count: { $sum: 1 },
                uniqueUsers: { $addToSet: "$user_id" }
            }
        },
        {
            $project: {
                eventType: "$_id",
                count: 1,
                uniqueUsersCount: { $size: "$uniqueUsers" },
                _id: 0
            }
        },
        { $sort: { count: -1 } }
    ]);

    const totalActivities = summary.reduce((sum, item) => sum + item.count, 0);
    const totalUniqueUsers = new Set(summary.flatMap(item => item.uniqueUsers)).size;

    res.status(200).json({
        success: true,
        summary: {
            period: { startDate, endDate },
            totalActivities,
            totalUniqueUsers,
            activitiesByType: summary
        }
    });
});

// ============================================
// EXPORTS
// ============================================

export {
    getUserActivityLog,
    getActivityLogByUserId,
    getActivityStats,
    searchActivities,
    deleteActivityLog,
    clearUserActivities,
    getSystemActivitySummary
};
