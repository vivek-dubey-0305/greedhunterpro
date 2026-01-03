import { Router } from "express";
import {
    refreshAccessToken,
    registerUser,
    loginUser,
    logoutUser,
    sendOtpToUser,
    verifyOtpForUser,
    sendResetPasswordLinkToUser,
    resetPassword,
    getLoggedInUserInfo,
    changeCurrentPassword,
    updateUserProfile,
    updateUserAvatar,
    deleteUser,
    googleAuthCallback,
    githubAuthCallback,
    followUser,
    unfollowUser,
    getUserById,
    getUserStats,
    updatePrivacySettings,
    getLeaderboard
} from "../controllers/user.controller.js";
import { upload } from "../middlewares/multer.middleware.js";
import { verifyJWT } from "../middlewares/auth.middleware.js";
import passport from "../configs/passport.js";
import { generalLimiter, authLimiter, passwordResetLimiter, otpLimiter } from "../middlewares/rateLimiter.middleware.js";
import { registerValidator, loginValidator, validate } from "../middlewares/validation.middleware.js";

const router = Router();

// ============================================
// PUBLIC ROUTES
// ============================================

// Authentication routes
router.route("/register").post(authLimiter, registerValidator, validate, registerUser);
router.route("/login").post(authLimiter, loginValidator, validate, loginUser);
router.route("/refresh-token").post(generalLimiter, refreshAccessToken);

// Password reset routes
router.route("/forgot-password").post(passwordResetLimiter, sendResetPasswordLinkToUser);
router.route("/reset-password/:token").post(passwordResetLimiter, resetPassword);

// OTP routes
router.route("/send-otp").post(verifyJWT, otpLimiter, sendOtpToUser);
router.route("/verify-otp").post(otpLimiter, verifyOtpForUser);

// OAuth routes
router.route("/auth/google").get(passport.authenticate('google', { scope: ['profile', 'email'] }));
router.route("/auth/google/callback").get(
    passport.authenticate('google', { failureRedirect: `${process.env.FRONTEND_URL}/login?error=oauth_failed` }),
    googleAuthCallback
);

router.route("/auth/github").get(passport.authenticate('github', { scope: ['user:email'] }));
router.route("/auth/github/callback").get(
    passport.authenticate('github', { failureRedirect: `${process.env.FRONTEND_URL}/login?error=oauth_failed` }),
    githubAuthCallback
);

// Leaderboard (public)
router.route("/leaderboard").get(generalLimiter, getLeaderboard);

// ============================================
// PROTECTED ROUTES (Require Authentication)
// ============================================

// User profile routes
router.route("/profile").get(verifyJWT, getLoggedInUserInfo);
router.route("/profile").put(verifyJWT, upload.single("avatar"), updateUserProfile);
router.route("/stats").get(verifyJWT, getUserStats);
router.route("/privacy").put(verifyJWT, updatePrivacySettings);
router.route("/change-password").put(verifyJWT, changeCurrentPassword);
router.route("/avatar").put(verifyJWT, upload.single("avatar"), updateUserAvatar);
router.route("/delete").delete(verifyJWT, deleteUser);

// Social routes
router.route("/follow/:userId").post(verifyJWT, followUser);
router.route("/unfollow/:userId").post(verifyJWT, unfollowUser);

// Logout (requires auth to get user info for logging)
router.route("/logout").post(verifyJWT, logoutUser);

// ============================================
// PUBLIC USER INFO ROUTES
// ============================================

// Get user by ID (public info)
router.route("/:userId").get(generalLimiter, getUserById);

export default router;
