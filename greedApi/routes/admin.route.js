import { Router } from "express";
import {
    getAllUsers,
    getUserById,
    updateUser,
    banUser,
    unbanUser,
    changeUserRole,
    deleteUser,
    addCoinsToUser,
    deductCoinsFromUser,
    getDashboardStats,
    getActivityLogs,
    getUserGrowthAnalytics
} from "../controllers/admin.controller.js";
import { verifyJWT, adminOnly, superAdminOnly } from "../middlewares/auth.middleware.js";
import { adminLimiter } from "../middlewares/rateLimiter.middleware.js";

const router = Router();

// ============================================
// ALL ADMIN ROUTES REQUIRE AUTH + ADMIN ROLE
// ============================================

router.use(verifyJWT);
router.use(adminOnly);
router.use(adminLimiter);

// ============================================
// DASHBOARD
// ============================================

// Get dashboard stats
router.get("/dashboard", getDashboardStats);

// Get activity logs
router.get("/activity-logs", getActivityLogs);

// Get user growth analytics
router.get("/analytics/user-growth", getUserGrowthAnalytics);

// ============================================
// USER MANAGEMENT
// ============================================

// Get all users
router.get("/users", getAllUsers);

// Get user by ID
router.get("/users/:userId", getUserById);

// Update user
router.put("/users/:userId", updateUser);

// Ban user
router.post("/users/:userId/ban", banUser);

// Unban user
router.post("/users/:userId/unban", unbanUser);

// Change user role (super admin only)
router.post("/users/:userId/role", superAdminOnly, changeUserRole);

// Delete user
router.delete("/users/:userId", deleteUser);

// ============================================
// WALLET MANAGEMENT
// ============================================

// Add coins to user
router.post("/users/:userId/add-coins", addCoinsToUser);

// Deduct coins from user
router.post("/users/:userId/deduct-coins", deductCoinsFromUser);

export default router;
