import { Router } from "express";
import {
    getAllMissions,
    getMissionById,
    getUserMissions,
    updateMissionProgress,
    createMission,
    updateMission,
    deleteMission,
    adminGetAllMissions,
    resetDailyMissions,
    getMissionStats
} from "../controllers/mission.controller.js";
import { verifyJWT, adminOnly } from "../middlewares/auth.middleware.js";
import { createMissionValidator, validate } from "../middlewares/validation.middleware.js";
import { generalLimiter, adminLimiter } from "../middlewares/rateLimiter.middleware.js";

const router = Router();

// ============================================
// PUBLIC ROUTES
// ============================================

// Get all missions
router.get("/", generalLimiter, getAllMissions);

// Get mission by ID
router.get("/:missionId", generalLimiter, getMissionById);

// ============================================
// PROTECTED ROUTES (REQUIRE AUTH)
// ============================================

router.use(verifyJWT);

// Get user's missions (with progress)
router.get("/user/my-missions", getUserMissions);

// Update mission progress
router.post("/:missionId/progress", updateMissionProgress);

// ============================================
// ADMIN ROUTES
// ============================================

router.use(adminOnly);
router.use(adminLimiter);

// Admin: Get all missions
router.get("/admin/all", adminGetAllMissions);

// Admin: Get mission stats
router.get("/admin/stats", getMissionStats);

// Admin: Reset daily missions (cron job endpoint)
router.post("/admin/reset-daily", resetDailyMissions);

// Create mission
router.post("/", createMissionValidator, validate, createMission);

// Update mission
router.put("/:missionId", updateMission);

// Delete mission
router.delete("/:missionId", deleteMission);

export default router;
