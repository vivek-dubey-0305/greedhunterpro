import { validationResult, body, param, query } from "express-validator";
import ErrorHandler from "./error.middleware.js";
import mongoose from "mongoose";

// ============================================
// VALIDATION RESULT HANDLER
// ============================================

export const validate = (req, res, next) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        const errorMessages = errors.array().map(err => err.msg);
        return next(new ErrorHandler(errorMessages.join(", "), 400));
    }
    next();
};

// ============================================
// COMMON VALIDATORS
// ============================================

// MongoDB ObjectId validator
export const isValidObjectId = (value) => {
    return mongoose.Types.ObjectId.isValid(value);
};

export const validateObjectId = (paramName) => {
    return param(paramName)
        .custom(isValidObjectId)
        .withMessage(`Invalid ${paramName}`);
};

// Pagination validators
export const paginationValidators = [
    query("page")
        .optional()
        .isInt({ min: 1 })
        .withMessage("Page must be a positive integer"),
    query("limit")
        .optional()
        .isInt({ min: 1, max: 100 })
        .withMessage("Limit must be between 1 and 100")
];

// ============================================
// USER VALIDATORS
// ============================================

export const registerValidator = [
    body("username")
        .trim()
        .notEmpty().withMessage("Username is required")
        .isLength({ min: 4, max: 100 }).withMessage("Username must be 4-100 characters")
        .matches(/^[a-zA-Z0-9_]+$/).withMessage("Username can only contain letters, numbers, and underscores"),
    body("email")
        .trim()
        .notEmpty().withMessage("Email is required")
        .isEmail().withMessage("Please enter a valid email"),
    body("phone")
        .optional()
        .trim()
        .matches(/^[1-9]\d{9}$/).withMessage("Please enter a valid 10-digit phone number"),
    body("password")
        .notEmpty().withMessage("Password is required")
        .isLength({ min: 8 }).withMessage("Password must be at least 8 characters")
        .matches(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])/)
        .withMessage("Password must contain uppercase, lowercase, number, and special character"),
    validate
];

export const loginValidator = [
    body("email")
        .trim()
        .notEmpty().withMessage("Email is required")
        .isEmail().withMessage("Please enter a valid email"),
    body("password")
        .notEmpty().withMessage("Password is required"),
    validate
];

export const updateProfileValidator = [
    body("username")
        .optional()
        .trim()
        .isLength({ min: 4, max: 100 }).withMessage("Username must be 4-100 characters"),
    body("bio")
        .optional()
        .trim()
        .isLength({ max: 500 }).withMessage("Bio cannot exceed 500 characters"),
    body("gender")
        .optional()
        .isIn(["male", "female", "other", "not specified"]).withMessage("Invalid gender"),
    validate
];

export const changePasswordValidator = [
    body("currentPassword")
        .notEmpty().withMessage("Current password is required"),
    body("newPassword")
        .notEmpty().withMessage("New password is required")
        .isLength({ min: 8 }).withMessage("New password must be at least 8 characters")
        .matches(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])/)
        .withMessage("Password must contain uppercase, lowercase, number, and special character"),
    body("confirmPassword")
        .notEmpty().withMessage("Confirm password is required")
        .custom((value, { req }) => value === req.body.newPassword)
        .withMessage("Passwords do not match"),
    validate
];

// ============================================
// EVENT VALIDATORS
// ============================================

export const createEventValidator = [
    body("name")
        .trim()
        .notEmpty().withMessage("Event name is required")
        .isLength({ max: 200 }).withMessage("Event name cannot exceed 200 characters"),
    body("description")
        .trim()
        .notEmpty().withMessage("Description is required")
        .isLength({ max: 2000 }).withMessage("Description cannot exceed 2000 characters"),
    body("category")
        .notEmpty().withMessage("Category is required")
        .isIn(["workshop", "hackathon", "competition", "bootcamp", "meetup", "webinar", "quiz", "game", "task", "marathon", "other"])
        .withMessage("Invalid category"),
    body("type")
        .notEmpty().withMessage("Type is required"),
    body("duration")
        .notEmpty().withMessage("Duration is required")
        .isInt({ min: 1 }).withMessage("Duration must be at least 1 minute"),
    body("maxParticipants")
        .notEmpty().withMessage("Max participants is required")
        .isInt({ min: 1, max: 10000 }).withMessage("Max participants must be between 1 and 10,000"),
    body("schedule.startTime")
        .notEmpty().withMessage("Start time is required")
        .isISO8601().withMessage("Invalid start time format"),
    body("schedule.endTime")
        .notEmpty().withMessage("End time is required")
        .isISO8601().withMessage("Invalid end time format"),
    body("entryFee")
        .optional()
        .isFloat({ min: 0 }).withMessage("Entry fee cannot be negative"),
    body("prizePool")
        .optional()
        .isFloat({ min: 0 }).withMessage("Prize pool cannot be negative"),
    validate
];

export const updateEventValidator = [
    body("name")
        .optional()
        .trim()
        .isLength({ max: 200 }).withMessage("Event name cannot exceed 200 characters"),
    body("description")
        .optional()
        .trim()
        .isLength({ max: 2000 }).withMessage("Description cannot exceed 2000 characters"),
    body("maxParticipants")
        .optional()
        .isInt({ min: 1, max: 10000 }).withMessage("Max participants must be between 1 and 10,000"),
    validate
];

// ============================================
// CHALLENGE VALIDATORS
// ============================================

export const createChallengeValidator = [
    body("title")
        .trim()
        .notEmpty().withMessage("Title is required")
        .isLength({ max: 200 }).withMessage("Title cannot exceed 200 characters"),
    body("description")
        .trim()
        .notEmpty().withMessage("Description is required")
        .isLength({ max: 2000 }).withMessage("Description cannot exceed 2000 characters"),
    body("type")
        .notEmpty().withMessage("Type is required")
        .isIn(["daily", "weekly", "monthly", "special"]).withMessage("Invalid challenge type"),
    body("difficulty")
        .notEmpty().withMessage("Difficulty is required")
        .isIn(["easy", "medium", "hard", "expert"]).withMessage("Invalid difficulty"),
    body("coinReward")
        .optional()
        .isInt({ min: 0 }).withMessage("Coin reward must be non-negative"),
    body("xpReward")
        .optional()
        .isInt({ min: 0 }).withMessage("XP reward must be non-negative"),
    body("targetValue")
        .notEmpty().withMessage("Target value is required")
        .isInt({ min: 1 }).withMessage("Target value must be at least 1"),
    body("startDate")
        .notEmpty().withMessage("Start date is required")
        .isISO8601().withMessage("Invalid start date format"),
    body("endDate")
        .notEmpty().withMessage("End date is required")
        .isISO8601().withMessage("Invalid end date format"),
    validate
];

// ============================================
// MISSION VALIDATORS
// ============================================

export const createMissionValidator = [
    body("title")
        .trim()
        .notEmpty().withMessage("Title is required")
        .isLength({ max: 200 }).withMessage("Title cannot exceed 200 characters"),
    body("description")
        .trim()
        .notEmpty().withMessage("Description is required")
        .isLength({ max: 1000 }).withMessage("Description cannot exceed 1000 characters"),
    body("category")
        .notEmpty().withMessage("Category is required")
        .isIn(["coding", "learning", "social", "engagement", "streak", "daily_login", "quiz", "event", "other"])
        .withMessage("Invalid category"),
    body("coinReward")
        .optional()
        .isInt({ min: 0 }).withMessage("Coin reward must be non-negative"),
    body("xpReward")
        .optional()
        .isInt({ min: 0 }).withMessage("XP reward must be non-negative"),
    body("targetValue")
        .optional()
        .isInt({ min: 1 }).withMessage("Target value must be at least 1"),
    validate
];

// ============================================
// COMMUNITY VALIDATORS
// ============================================

export const createCommunityValidator = [
    body("name")
        .trim()
        .notEmpty().withMessage("Community name is required")
        .isLength({ max: 100 }).withMessage("Name cannot exceed 100 characters"),
    body("description")
        .trim()
        .notEmpty().withMessage("Description is required")
        .isLength({ max: 2000 }).withMessage("Description cannot exceed 2000 characters"),
    body("category")
        .notEmpty().withMessage("Category is required")
        .isIn(["programming", "gaming", "design", "general", "tech", "learning", "sports", "music", "art", "other"])
        .withMessage("Invalid category"),
    body("visibility")
        .optional()
        .isIn(["public", "private", "invite-only"]).withMessage("Invalid visibility"),
    validate
];

// ============================================
// STORE VALIDATORS
// ============================================

export const createStoreItemValidator = [
    body("name")
        .trim()
        .notEmpty().withMessage("Item name is required")
        .isLength({ max: 200 }).withMessage("Name cannot exceed 200 characters"),
    body("description")
        .trim()
        .notEmpty().withMessage("Description is required")
        .isLength({ max: 2000 }).withMessage("Description cannot exceed 2000 characters"),
    body("category")
        .notEmpty().withMessage("Category is required")
        .isIn(["avatar", "badge", "theme", "powerup", "boost", "cosmetic", "ticket", "other"])
        .withMessage("Invalid category"),
    body("price")
        .notEmpty().withMessage("Price is required")
        .isFloat({ min: 0 }).withMessage("Price must be non-negative"),
    body("currency")
        .optional()
        .isIn(["coins", "cash"]).withMessage("Invalid currency"),
    body("discount")
        .optional()
        .isFloat({ min: 0, max: 100 }).withMessage("Discount must be between 0 and 100"),
    validate
];

// ============================================
// NOTIFICATION VALIDATORS
// ============================================

export const createNotificationValidator = [
    body("title")
        .trim()
        .notEmpty().withMessage("Title is required")
        .isLength({ max: 200 }).withMessage("Title cannot exceed 200 characters"),
    body("message")
        .trim()
        .notEmpty().withMessage("Message is required")
        .isLength({ max: 2000 }).withMessage("Message cannot exceed 2000 characters"),
    body("type")
        .optional()
        .isIn(["info", "success", "warning", "error", "promotion", "system", "achievement", "reminder"])
        .withMessage("Invalid notification type"),
    body("target")
        .optional()
        .isIn(["all", "premium", "free", "specific", "role_admin", "role_user"])
        .withMessage("Invalid target"),
    body("scheduledAt")
        .optional()
        .isISO8601().withMessage("Invalid scheduled date format"),
    validate
];

// ============================================
// WALLET VALIDATORS
// ============================================

export const transferCoinsValidator = [
    body("recipientId")
        .notEmpty().withMessage("Recipient ID is required")
        .custom(isValidObjectId).withMessage("Invalid recipient ID"),
    body("amount")
        .notEmpty().withMessage("Amount is required")
        .isFloat({ min: 1 }).withMessage("Amount must be at least 1"),
    body("note")
        .optional()
        .trim()
        .isLength({ max: 200 }).withMessage("Note cannot exceed 200 characters"),
    validate
];

export const adminWalletActionValidator = [
    body("userId")
        .notEmpty().withMessage("User ID is required")
        .custom(isValidObjectId).withMessage("Invalid user ID"),
    body("amount")
        .notEmpty().withMessage("Amount is required")
        .isFloat({ min: 0.01 }).withMessage("Amount must be at least 0.01"),
    body("reason")
        .optional()
        .trim()
        .isLength({ max: 200 }).withMessage("Reason cannot exceed 200 characters"),
    validate
];

// ============================================
// QUIZ VALIDATORS
// ============================================

export const createQuizValidator = [
    body("title")
        .trim()
        .notEmpty().withMessage("Title is required")
        .isLength({ max: 200 }).withMessage("Title cannot exceed 200 characters"),
    body("description")
        .trim()
        .notEmpty().withMessage("Description is required")
        .isLength({ max: 1000 }).withMessage("Description cannot exceed 1000 characters"),
    body("options")
        .isArray({ min: 2 }).withMessage("At least 2 options are required"),
    body("correctAnswer")
        .trim()
        .notEmpty().withMessage("Correct answer is required"),
    body("difficulty")
        .notEmpty().withMessage("Difficulty is required")
        .isIn(["easy", "medium", "hard"]).withMessage("Invalid difficulty"),
    body("timeLimit")
        .notEmpty().withMessage("Time limit is required")
        .isInt({ min: 1, max: 120 }).withMessage("Time limit must be between 1 and 120 minutes"),
    body("maxParticipants")
        .notEmpty().withMessage("Max participants is required")
        .isInt({ min: 1, max: 10000 }).withMessage("Max participants must be between 1 and 10,000"),
    body("startTime")
        .notEmpty().withMessage("Start time is required")
        .isISO8601().withMessage("Invalid start time format"),
    body("endTime")
        .notEmpty().withMessage("End time is required")
        .isISO8601().withMessage("Invalid end time format"),
    body("baseScore")
        .notEmpty().withMessage("Base score is required")
        .isInt({ min: 0 }).withMessage("Base score must be non-negative"),
    body("difficultyMultiplier")
        .notEmpty().withMessage("Difficulty multiplier is required")
        .isFloat({ min: 0.1, max: 5 }).withMessage("Difficulty multiplier must be between 0.1 and 5"),
    validate
];
