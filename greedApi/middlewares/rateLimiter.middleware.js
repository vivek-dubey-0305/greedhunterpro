import rateLimit from "express-rate-limit";
import ErrorHandler from "./error.middleware.js";

// ============================================
// RATE LIMITERS
// ============================================

/**
 * General API rate limiter
 * 100 requests per 15 minutes
 */
export const generalLimiter = rateLimit({
    windowMs: 15 * 60 * 1000, // 15 minutes
    max: 100,
    message: "Too many requests, please try again later",
    standardHeaders: true,
    legacyHeaders: false,
    handler: (req, res, next) => {
        next(new ErrorHandler("Too many requests. Please try again later.", 429));
    }
});

/**
 * Strict rate limiter for sensitive operations
 * 5 requests per 15 minutes
 */
export const strictLimiter = rateLimit({
    windowMs: 15 * 60 * 1000, // 15 minutes
    max: 5,
    message: "Too many attempts, please try again later",
    standardHeaders: true,
    legacyHeaders: false,
    handler: (req, res, next) => {
        next(new ErrorHandler("Too many attempts. Please try again later.", 429));
    }
});

/**
 * Auth rate limiter for login/register
 * 10 requests per 15 minutes
 */
export const authLimiter = rateLimit({
    windowMs: 15 * 60 * 1000, // 15 minutes
    max: 10,
    message: "Too many authentication attempts, please try again later",
    standardHeaders: true,
    legacyHeaders: false,
    skipSuccessfulRequests: true, // Don't count successful attempts
    handler: (req, res, next) => {
        next(new ErrorHandler("Too many authentication attempts. Please try again later.", 429));
    }
});

/**
 * Password reset rate limiter
 * 3 requests per hour
 */
export const passwordResetLimiter = rateLimit({
    windowMs: 60 * 60 * 1000, // 1 hour
    max: 3,
    message: "Too many password reset attempts, please try again later",
    standardHeaders: true,
    legacyHeaders: false,
    handler: (req, res, next) => {
        next(new ErrorHandler("Too many password reset attempts. Please try again in an hour.", 429));
    }
});

/**
 * OTP rate limiter
 * 5 requests per 10 minutes
 */
export const otpLimiter = rateLimit({
    windowMs: 10 * 60 * 1000, // 10 minutes
    max: 5,
    message: "Too many OTP requests, please try again later",
    standardHeaders: true,
    legacyHeaders: false,
    handler: (req, res, next) => {
        next(new ErrorHandler("Too many OTP requests. Please try again later.", 429));
    }
});

/**
 * Wallet operations rate limiter
 * 20 requests per 15 minutes
 */
export const walletLimiter = rateLimit({
    windowMs: 15 * 60 * 1000, // 15 minutes
    max: 20,
    message: "Too many wallet operations, please try again later",
    standardHeaders: true,
    legacyHeaders: false,
    handler: (req, res, next) => {
        next(new ErrorHandler("Too many wallet operations. Please try again later.", 429));
    }
});

/**
 * Admin operations rate limiter
 * 50 requests per 15 minutes
 */
export const adminLimiter = rateLimit({
    windowMs: 15 * 60 * 1000, // 15 minutes
    max: 50,
    message: "Too many admin requests, please try again later",
    standardHeaders: true,
    legacyHeaders: false,
    handler: (req, res, next) => {
        next(new ErrorHandler("Too many admin requests. Please try again later.", 429));
    }
});

/**
 * File upload rate limiter
 * 10 uploads per hour
 */
export const uploadLimiter = rateLimit({
    windowMs: 60 * 60 * 1000, // 1 hour
    max: 10,
    message: "Too many file uploads, please try again later",
    standardHeaders: true,
    legacyHeaders: false,
    handler: (req, res, next) => {
        next(new ErrorHandler("Too many file uploads. Please try again later.", 429));
    }
});

/**
 * Search rate limiter
 * 30 requests per minute
 */
export const searchLimiter = rateLimit({
    windowMs: 60 * 1000, // 1 minute
    max: 30,
    message: "Too many search requests, please slow down",
    standardHeaders: true,
    legacyHeaders: false,
    handler: (req, res, next) => {
        next(new ErrorHandler("Too many search requests. Please slow down.", 429));
    }
});

/**
 * Create rate limiter for specific IP and user combination
 */
export const createUserSpecificLimiter = (options = {}) => {
    const {
        windowMs = 15 * 60 * 1000,
        max = 100,
        message = "Too many requests"
    } = options;
    
    return rateLimit({
        windowMs,
        max,
        message,
        standardHeaders: true,
        legacyHeaders: false,
        keyGenerator: (req) => {
            // Combine IP and user ID for more accurate rate limiting
            const userId = req.user?._id?.toString() || "anonymous";
            return `${req.ip}-${userId}`;
        },
        handler: (req, res, next) => {
            next(new ErrorHandler(message, 429));
        }
    });
};
