import { Router } from "express";
import {
    getUserActivityLog,
    getActivityLogByUserId,
    getActivityStats,
    searchActivities,
    deleteActivityLog,
    clearUserActivities,
    getSystemActivitySummary
} from "../controllers/activityLog.controller.js";
import { verifyJWT } from "../middlewares/auth.middleware.js";

const router = Router();

// ============================================
// PROTECTED ROUTES (Require Authentication)
// ============================================

// User activity routes
router.route("/").get(verifyJWT, getUserActivityLog);
router.route("/stats").get(verifyJWT, getActivityStats);
router.route("/search").get(verifyJWT, searchActivities);

// ============================================
// ADMIN ROUTES (Require Admin Role)
// ============================================

// Admin activity management
router.route("/admin/user/:userId").get(verifyJWT, getActivityLogByUserId);
router.route("/admin/user/:userId").delete(verifyJWT, deleteActivityLog);
router.route("/admin/user/:userId/clear").delete(verifyJWT, clearUserActivities);
router.route("/admin/summary").get(verifyJWT, getSystemActivitySummary);

export default router;
