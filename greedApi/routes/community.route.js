import { Router } from "express";
import {
    getAllCommunities,
    getCommunityById,
    getUserCommunities,
    joinCommunity,
    leaveCommunity,
    createCommunity,
    updateCommunity,
    suspendCommunity,
    unsuspendCommunity,
    deleteCommunity,
    adminGetAllCommunities,
    handleJoinRequest,
    manageModerator
} from "../controllers/community.controller.js";
import { verifyJWT, adminOnly, verifiedOnly } from "../middlewares/auth.middleware.js";
import { createCommunityValidator, validate } from "../middlewares/validation.middleware.js";
import { generalLimiter, adminLimiter } from "../middlewares/rateLimiter.middleware.js";

const router = Router();

// ============================================
// PUBLIC ROUTES
// ============================================

// Get all public communities
router.get("/", generalLimiter, getAllCommunities);

// Get community by ID
router.get("/:communityId", generalLimiter, getCommunityById);

// ============================================
// PROTECTED ROUTES (REQUIRE AUTH)
// ============================================

router.use(verifyJWT);

// Get user's communities
router.get("/user/my-communities", getUserCommunities);

// Join community
router.post("/:communityId/join", joinCommunity);

// Leave community
router.post("/:communityId/leave", leaveCommunity);

// Create community (verified users only)
router.post("/", verifiedOnly, createCommunityValidator, validate, createCommunity);

// Update community (owner/moderator)
router.put("/:communityId", updateCommunity);

// Handle join request (moderator)
router.post("/:communityId/requests/:userId", handleJoinRequest);

// Manage moderators (owner only)
router.post("/:communityId/moderators/:userId", manageModerator);

// ============================================
// ADMIN ROUTES
// ============================================

router.use(adminOnly);
router.use(adminLimiter);

// Admin: Get all communities
router.get("/admin/all", adminGetAllCommunities);

// Admin: Suspend community
router.post("/:communityId/suspend", suspendCommunity);

// Admin: Unsuspend community
router.post("/:communityId/unsuspend", unsuspendCommunity);

// Admin: Delete community
router.delete("/:communityId", deleteCommunity);

export default router;
