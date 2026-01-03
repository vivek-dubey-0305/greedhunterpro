import { Router } from "express";
import {
    getUserNotifications,
    markAsRead,
    markAllAsRead,
    getUnreadCount,
    deleteNotification,
    createNotification,
    updateNotification,
    sendNotification,
    adminDeleteNotification,
    adminGetAllNotifications,
    processScheduledNotifications,
    getNotificationStats
} from "../controllers/notification.controller.js";
import { verifyJWT, adminOnly } from "../middlewares/auth.middleware.js";
import { createNotificationValidator, validate } from "../middlewares/validation.middleware.js";
import { generalLimiter, adminLimiter } from "../middlewares/rateLimiter.middleware.js";

const router = Router();

// ============================================
// PROTECTED ROUTES (REQUIRE AUTH)
// ============================================

router.use(verifyJWT);
router.use(generalLimiter);

// Get user notifications
router.get("/", getUserNotifications);

// Get unread count
router.get("/unread-count", getUnreadCount);

// Mark notification as read
router.post("/:notificationId/read", markAsRead);

// Mark all as read
router.post("/mark-all-read", markAllAsRead);

// Delete (hide) notification for user
router.delete("/:notificationId", deleteNotification);

// ============================================
// ADMIN ROUTES
// ============================================

router.use(adminOnly);
router.use(adminLimiter);

// Admin: Get all notifications
router.get("/admin/all", adminGetAllNotifications);

// Admin: Get notification stats
router.get("/admin/stats", getNotificationStats);

// Admin: Process scheduled notifications (for cron job)
router.post("/admin/process-scheduled", processScheduledNotifications);

// Admin: Create notification
router.post("/", createNotificationValidator, validate, createNotification);

// Admin: Update notification
router.put("/:notificationId", updateNotification);

// Admin: Send notification immediately
router.post("/:notificationId/send", sendNotification);

// Admin: Delete notification
router.delete("/admin/:notificationId", adminDeleteNotification);

export default router;
