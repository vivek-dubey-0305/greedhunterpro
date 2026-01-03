import { Router } from "express";
import {
    getAllChallenges,
    getChallengeById,
    getUserChallenges,
    updateChallengeProgress,
    createChallenge,
    updateChallenge,
    deleteChallenge,
    adminGetAllChallenges
} from "../controllers/challenge.controller.js";
import { verifyJWT, adminOnly } from "../middlewares/auth.middleware.js";
import { createChallengeValidator, validate } from "../middlewares/validation.middleware.js";
import { generalLimiter, adminLimiter } from "../middlewares/rateLimiter.middleware.js";

const router = Router();

// ============================================
// PUBLIC ROUTES
// ============================================

// Get all challenges (public)
router.get("/", generalLimiter, getAllChallenges);

// Get challenge by ID
router.get("/:challengeId", generalLimiter, getChallengeById);

// ============================================
// PROTECTED ROUTES (REQUIRE AUTH)
// ============================================

router.use(verifyJWT);

// Get user's challenges (with progress)
router.get("/user/my-challenges", getUserChallenges);

// Update challenge progress
router.post("/:challengeId/progress", updateChallengeProgress);

// ============================================
// ADMIN ROUTES
// ============================================

router.use(adminOnly);
router.use(adminLimiter);

// Admin: Get all challenges including inactive
router.get("/admin/all", adminGetAllChallenges);

// Create challenge
router.post("/", createChallengeValidator, validate, createChallenge);

// Update challenge
router.put("/:challengeId", updateChallenge);

// Delete challenge
router.delete("/:challengeId", deleteChallenge);

export default router;
