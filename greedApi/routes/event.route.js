import { Router } from "express";
import {
    createEvent,
    getAllEvents,
    getEventById,
    updateEvent,
    deleteEvent,
    joinEvent,
    leaveEvent,
    submitToEvent,
    getEventLeaderboard,
    getUserEvents,
    getAccessLink,
    validateAccessToken,
    markEventStarted,
    recordTabSwitch,
    getEventPolicies,
    requestRefund
} from "../controllers/event.controller.js";
import { verifyJWT, moderatorOnly } from "../middlewares/auth.middleware.js";
import { upload } from "../middlewares/multer.middleware.js";

const router = Router();

// ============================================
// PUBLIC ROUTES
// ============================================

// Get events (public viewing)
router.route("/").get(getAllEvents);
router.route("/:eventId").get(getEventById);
router.route("/:eventId/leaderboard").get(getEventLeaderboard);
router.route("/:eventId/policies").get(getEventPolicies);

// ============================================
// EXTERNAL PLATFORM ROUTES (Token-based auth)
// ============================================
// These endpoints are called by the gameplay platform (quiz, hackathon, etc.)
// to validate users and track gameplay

router.route("/external/validate-token").post(validateAccessToken);
router.route("/external/mark-started").post(markEventStarted);
router.route("/external/tab-switch").post(recordTabSwitch);

// ============================================
// PROTECTED ROUTES (Require Authentication)
// ============================================

// User-specific event routes (must be before /:eventId routes)
router.route("/user/my-events").get(verifyJWT, getUserEvents);

// Event participation (any authenticated user)
router.route("/:eventId/join").post(verifyJWT, joinEvent);
router.route("/:eventId/leave").post(verifyJWT, leaveEvent);
router.route("/:eventId/submit").post(verifyJWT, submitToEvent);
router.route("/:eventId/access-link").get(verifyJWT, getAccessLink);
router.route("/:eventId/refund").post(verifyJWT, requestRefund);

// ============================================
// ADMIN/MODERATOR ROUTES (Create, Update, Delete)
// ============================================

// Event CRUD operations (moderator, admin, super_admin only)
// Use upload.fields for multiple file uploads (image + bannerImage)
router.route("/").post(
    verifyJWT, 
    moderatorOnly, 
    upload.fields([
        { name: "image", maxCount: 1 },
        { name: "bannerImage", maxCount: 1 }
    ]),
    createEvent
);
router.route("/:eventId").put(
    verifyJWT, 
    moderatorOnly, 
    upload.fields([
        { name: "image", maxCount: 1 },
        { name: "bannerImage", maxCount: 1 }
    ]),
    updateEvent
);
router.route("/:eventId").delete(verifyJWT, moderatorOnly, deleteEvent);

export default router;
