import { asyncHandler } from "../middlewares/asyncHandler.middleware.js";
import ErrorHandler from "../middlewares/error.middleware.js";
import { Notification } from "../models/notification.model.js";
import { User } from "../models/user.model.js";
import { logActivity } from "../utils/logActivity.utils.js";

// ============================================
// GET USER NOTIFICATIONS
// ============================================

export const getUserNotifications = asyncHandler(async (req, res, next) => {
    const userId = req.user._id;
    const { 
        page = 1, 
        limit = 20, 
        type,
        unreadOnly = false
    } = req.query;

    const query = { 
        isDeleted: false,
        status: "sent",
        $or: [
            { targetType: "all" },
            { targetType: "specific", targetUsers: userId }
        ]
    };

    // Check if user is premium for premium-only notifications
    const user = await User.findById(userId);
    if (user.isPremium) {
        query.$or.push({ targetType: "premium" });
    }

    if (type) query.type = type;
    
    if (unreadOnly === "true") {
        query["readBy.user"] = { $ne: userId };
    }

    const skip = (parseInt(page) - 1) * parseInt(limit);

    const [notifications, total] = await Promise.all([
        Notification.find(query)
            .sort({ createdAt: -1 })
            .skip(skip)
            .limit(parseInt(limit))
            .populate("createdBy", "username avatar"),
        Notification.countDocuments(query)
    ]);

    // Mark as read status for each notification
    const notificationsWithReadStatus = notifications.map(notification => {
        const isRead = notification.readBy.some(
            r => r.user.toString() === userId.toString()
        );
        return {
            ...notification.toObject(),
            isRead
        };
    });

    // Count unread
    const unreadCount = await Notification.countDocuments({
        ...query,
        "readBy.user": { $ne: userId }
    });

    res.status(200).json({
        success: true,
        data: {
            notifications: notificationsWithReadStatus,
            unreadCount,
            pagination: {
                currentPage: parseInt(page),
                totalPages: Math.ceil(total / parseInt(limit)),
                totalNotifications: total,
                hasNextPage: skip + notifications.length < total,
                hasPrevPage: parseInt(page) > 1
            }
        }
    });
});

// ============================================
// MARK NOTIFICATION AS READ
// ============================================

export const markAsRead = asyncHandler(async (req, res, next) => {
    const { notificationId } = req.params;
    const userId = req.user._id;

    const notification = await Notification.findOne({ 
        _id: notificationId, 
        isDeleted: false 
    });

    if (!notification) {
        return next(new ErrorHandler("Notification not found", 404));
    }

    await notification.markAsRead(userId);

    res.status(200).json({
        success: true,
        message: "Notification marked as read"
    });
});

// ============================================
// MARK ALL NOTIFICATIONS AS READ
// ============================================

export const markAllAsRead = asyncHandler(async (req, res, next) => {
    const userId = req.user._id;

    const query = { 
        isDeleted: false,
        status: "sent",
        "readBy.user": { $ne: userId },
        $or: [
            { targetType: "all" },
            { targetType: "specific", targetUsers: userId }
        ]
    };

    const user = await User.findById(userId);
    if (user.isPremium) {
        query.$or.push({ targetType: "premium" });
    }

    const notifications = await Notification.find(query);

    for (const notification of notifications) {
        await notification.markAsRead(userId);
    }

    res.status(200).json({
        success: true,
        message: `${notifications.length} notifications marked as read`
    });
});

// ============================================
// GET UNREAD COUNT
// ============================================

export const getUnreadCount = asyncHandler(async (req, res, next) => {
    const userId = req.user._id;

    const query = { 
        isDeleted: false,
        status: "sent",
        "readBy.user": { $ne: userId },
        $or: [
            { targetType: "all" },
            { targetType: "specific", targetUsers: userId }
        ]
    };

    const user = await User.findById(userId);
    if (user.isPremium) {
        query.$or.push({ targetType: "premium" });
    }

    const count = await Notification.countDocuments(query);

    res.status(200).json({
        success: true,
        data: { unreadCount: count }
    });
});

// ============================================
// DELETE NOTIFICATION (USER)
// ============================================

export const deleteNotification = asyncHandler(async (req, res, next) => {
    const { notificationId } = req.params;
    const userId = req.user._id;

    // For user-specific deletion, we just mark as read and hide
    // We don't actually delete as other users might need it
    const notification = await Notification.findOne({ 
        _id: notificationId, 
        isDeleted: false 
    });

    if (!notification) {
        return next(new ErrorHandler("Notification not found", 404));
    }

    // Add to user's hidden notifications
    if (!notification.hiddenBy) notification.hiddenBy = [];
    
    if (!notification.hiddenBy.includes(userId)) {
        notification.hiddenBy.push(userId);
        await notification.save();
    }

    res.status(200).json({
        success: true,
        message: "Notification removed"
    });
});

// ============================================
// ADMIN: CREATE NOTIFICATION
// ============================================

export const createNotification = asyncHandler(async (req, res, next) => {
    const {
        title,
        message,
        type,
        targetType,
        targetUsers,
        priority,
        scheduledFor,
        expiresAt,
        actionUrl,
        metadata
    } = req.body;

    const notificationData = {
        title,
        message,
        type: type || "system",
        targetType: targetType || "all",
        priority: priority || "normal",
        createdBy: req.user._id
    };

    if (targetType === "specific" && targetUsers) {
        notificationData.targetUsers = targetUsers;
    }

    if (scheduledFor) {
        notificationData.scheduledFor = new Date(scheduledFor);
        notificationData.status = "scheduled";
    } else {
        notificationData.status = "sent";
        notificationData.sentAt = new Date();
    }

    if (expiresAt) notificationData.expiresAt = new Date(expiresAt);
    if (actionUrl) notificationData.actionUrl = actionUrl;
    if (metadata) notificationData.metadata = metadata;

    const notification = await Notification.create(notificationData);

    await logActivity(
        req.user._id,
        "admin_action",
        `Created notification: ${title}`,
        req,
        "notification",
        notification._id
    );

    res.status(201).json({
        success: true,
        message: "Notification created successfully",
        data: notification
    });
});

// ============================================
// ADMIN: UPDATE NOTIFICATION
// ============================================

export const updateNotification = asyncHandler(async (req, res, next) => {
    const { notificationId } = req.params;
    const updateData = req.body;

    const notification = await Notification.findOne({ 
        _id: notificationId, 
        isDeleted: false 
    });

    if (!notification) {
        return next(new ErrorHandler("Notification not found", 404));
    }

    // Can only update if not sent yet
    if (notification.status === "sent") {
        return next(new ErrorHandler("Cannot update sent notifications", 400));
    }

    const allowedUpdates = [
        "title", "message", "type", "targetType", "targetUsers",
        "priority", "scheduledFor", "expiresAt", "actionUrl", "metadata"
    ];

    allowedUpdates.forEach(field => {
        if (updateData[field] !== undefined) {
            notification[field] = updateData[field];
        }
    });

    notification.updatedBy = req.user._id;
    await notification.save();

    await logActivity(
        req.user._id,
        "admin_action",
        `Updated notification: ${notification.title}`,
        req,
        "notification",
        notification._id
    );

    res.status(200).json({
        success: true,
        message: "Notification updated successfully",
        data: notification
    });
});

// ============================================
// ADMIN: SEND NOTIFICATION NOW
// ============================================

export const sendNotification = asyncHandler(async (req, res, next) => {
    const { notificationId } = req.params;

    const notification = await Notification.findOne({ 
        _id: notificationId, 
        isDeleted: false 
    });

    if (!notification) {
        return next(new ErrorHandler("Notification not found", 404));
    }

    if (notification.status === "sent") {
        return next(new ErrorHandler("Notification already sent", 400));
    }

    notification.status = "sent";
    notification.sentAt = new Date();
    await notification.save();

    await logActivity(
        req.user._id,
        "admin_action",
        `Sent notification: ${notification.title}`,
        req,
        "notification",
        notification._id
    );

    res.status(200).json({
        success: true,
        message: "Notification sent successfully"
    });
});

// ============================================
// ADMIN: DELETE NOTIFICATION
// ============================================

export const adminDeleteNotification = asyncHandler(async (req, res, next) => {
    const { notificationId } = req.params;

    const notification = await Notification.findOne({ 
        _id: notificationId, 
        isDeleted: false 
    });

    if (!notification) {
        return next(new ErrorHandler("Notification not found", 404));
    }

    notification.isDeleted = true;
    notification.deletedAt = new Date();
    notification.deletedBy = req.user._id;
    await notification.save();

    await logActivity(
        req.user._id,
        "admin_action",
        `Deleted notification: ${notification.title}`,
        req,
        "notification",
        notification._id
    );

    res.status(200).json({
        success: true,
        message: "Notification deleted successfully"
    });
});

// ============================================
// ADMIN: GET ALL NOTIFICATIONS
// ============================================

export const adminGetAllNotifications = asyncHandler(async (req, res, next) => {
    const { 
        page = 1, 
        limit = 20, 
        type,
        status,
        targetType,
        priority,
        includeDeleted = false
    } = req.query;

    const query = {};
    
    if (!includeDeleted) query.isDeleted = false;
    if (type) query.type = type;
    if (status) query.status = status;
    if (targetType) query.targetType = targetType;
    if (priority) query.priority = priority;

    const skip = (parseInt(page) - 1) * parseInt(limit);

    const [notifications, total, stats] = await Promise.all([
        Notification.find(query)
            .sort({ createdAt: -1 })
            .skip(skip)
            .limit(parseInt(limit))
            .populate("createdBy", "username"),
        Notification.countDocuments(query),
        Notification.aggregate([
            { $match: { isDeleted: false } },
            {
                $group: {
                    _id: "$status",
                    count: { $sum: 1 }
                }
            }
        ])
    ]);

    // Format stats
    const formattedStats = {
        draft: 0,
        scheduled: 0,
        sent: 0,
        total: 0
    };
    
    stats.forEach(s => {
        formattedStats[s._id] = s.count;
        formattedStats.total += s.count;
    });

    res.status(200).json({
        success: true,
        data: {
            notifications,
            stats: formattedStats,
            pagination: {
                currentPage: parseInt(page),
                totalPages: Math.ceil(total / parseInt(limit)),
                totalNotifications: total,
                hasNextPage: skip + notifications.length < total,
                hasPrevPage: parseInt(page) > 1
            }
        }
    });
});

// ============================================
// PROCESS SCHEDULED NOTIFICATIONS (CRON JOB)
// ============================================

export const processScheduledNotifications = asyncHandler(async (req, res, next) => {
    const now = new Date();

    const scheduledNotifications = await Notification.find({
        isDeleted: false,
        status: "scheduled",
        scheduledFor: { $lte: now }
    });

    let processedCount = 0;

    for (const notification of scheduledNotifications) {
        notification.status = "sent";
        notification.sentAt = now;
        await notification.save();
        processedCount++;
    }

    res.status(200).json({
        success: true,
        message: `Processed ${processedCount} scheduled notifications`
    });
});

// ============================================
// GET NOTIFICATION STATS (ADMIN)
// ============================================

export const getNotificationStats = asyncHandler(async (req, res, next) => {
    const stats = await Notification.aggregate([
        { $match: { isDeleted: false } },
        {
            $facet: {
                byStatus: [
                    { $group: { _id: "$status", count: { $sum: 1 } } }
                ],
                byType: [
                    { $group: { _id: "$type", count: { $sum: 1 } } }
                ],
                byPriority: [
                    { $group: { _id: "$priority", count: { $sum: 1 } } }
                ],
                readStats: [
                    {
                        $project: {
                            readCount: { $size: "$readBy" }
                        }
                    },
                    {
                        $group: {
                            _id: null,
                            totalReads: { $sum: "$readCount" }
                        }
                    }
                ]
            }
        }
    ]);

    res.status(200).json({
        success: true,
        data: stats[0]
    });
});
