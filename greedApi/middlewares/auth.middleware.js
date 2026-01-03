import ErrorHandler from "./error.middleware.js";
import { asyncHandler } from "./asyncHandler.middleware.js";
import jwt from "jsonwebtoken";
import { User } from "../models/user.model.js";

// ============================================
// JWT VERIFICATION MIDDLEWARE
// ============================================

export const auth = asyncHandler(async (req, res, next) => {
    try {
        const token = req.cookies?.accessToken || req.header("Authorization")?.replace("Bearer ", "");

        if (!token) {
            return next(new ErrorHandler("Unauthorized! Please login to continue", 401));
        }

        try {
            const decodedTokenInformation = jwt.verify(token, process.env.ACCESS_TOKEN_SECRET);

            const user = await User.findById(decodedTokenInformation?._id).select("-password -refreshToken");

            if (!user) {
                return next(new ErrorHandler("Invalid access token. Please login again", 401));
            }

            // Check if user is banned/suspended
            if (user.status === "banned" || user.status === "suspended") {
                return next(new ErrorHandler(`Your account has been ${user.status}. Contact support for assistance.`, 403));
            }

            // Check if user is deleted
            if (user.isDeleted) {
                return next(new ErrorHandler("Account not found", 404));
            }

            req.user = user;
            next();
        } catch (error) {
            if (error.name === "TokenExpiredError") {
                return next(new ErrorHandler("Access token expired. Please refresh your token", 401));
            }
            return next(new ErrorHandler("Invalid access token", 401));
        }

    } catch (error) {
        console.error("Auth middleware error:", error);
        return next(new ErrorHandler("Authentication failed", 401));
    }
});

// ============================================
// ROLE-BASED ACCESS MIDDLEWARE
// ============================================

/**
 * Custom roles middleware - allows multiple roles
 * Usage: customRoles("admin", "super_admin")
 */
export const customRoles = (...roles) => {
    return asyncHandler(async (req, res, next) => {
        if (!req.user) {
            return next(new ErrorHandler("Authentication required", 401));
        }
        
        if (!roles.includes(req.user.role)) {
            return next(new ErrorHandler("You do not have permission to perform this action", 403));
        }
        next();
    });
};

/**
 * User only - any authenticated user
 */
export const userOnly = asyncHandler(async (req, res, next) => {
    if (!req.user) {
        return next(new ErrorHandler("Authentication required", 401));
    }
    next();
});

/**
 * Admin only - requires admin or super_admin role
 */
export const adminOnly = asyncHandler(async (req, res, next) => {
    if (!req.user) {
        return next(new ErrorHandler("Authentication required", 401));
    }
    
    if (req.user.role !== "admin" && req.user.role !== "super_admin") {
        return next(new ErrorHandler("Admin access required", 403));
    }
    next();
});

/**
 * Super Admin only - requires super_admin role
 */
export const superAdminOnly = asyncHandler(async (req, res, next) => {
    if (!req.user) {
        return next(new ErrorHandler("Authentication required", 401));
    }
    
    if (req.user.role !== "super_admin") {
        return next(new ErrorHandler("Super Admin access required", 403));
    }
    next();
});

/**
 * Moderator or higher - requires moderator, admin, or super_admin role
 */
export const moderatorOnly = asyncHandler(async (req, res, next) => {
    if (!req.user) {
        return next(new ErrorHandler("Authentication required", 401));
    }
    
    const allowedRoles = ["moderator", "admin", "super_admin"];
    if (!allowedRoles.includes(req.user.role)) {
        return next(new ErrorHandler("Moderator access required", 403));
    }
    next();
});

/**
 * Verified users only - user must have verified email
 */
export const verifiedOnly = asyncHandler(async (req, res, next) => {
    if (!req.user) {
        return next(new ErrorHandler("Authentication required", 401));
    }
    
    if (!req.user.isVerified) {
        return next(new ErrorHandler("Please verify your email to continue", 403));
    }
    next();
});

/**
 * Premium users only
 */
export const premiumOnly = asyncHandler(async (req, res, next) => {
    if (!req.user) {
        return next(new ErrorHandler("Authentication required", 401));
    }
    
    if (!req.user.isPremium) {
        return next(new ErrorHandler("Premium subscription required", 403));
    }
    
    // Check if premium has expired
    if (req.user.premiumExpiresAt && new Date() > new Date(req.user.premiumExpiresAt)) {
        return next(new ErrorHandler("Your premium subscription has expired", 403));
    }
    
    next();
});

/**
 * Resource owner or admin - checks if user owns the resource or is admin
 * Expects the resource's owner ID to be in req.resourceOwnerId
 */
export const ownerOrAdmin = asyncHandler(async (req, res, next) => {
    if (!req.user) {
        return next(new ErrorHandler("Authentication required", 401));
    }
    
    const isOwner = req.resourceOwnerId && 
        req.resourceOwnerId.toString() === req.user._id.toString();
    const isAdmin = req.user.role === "admin" || req.user.role === "super_admin";
    
    if (!isOwner && !isAdmin) {
        return next(new ErrorHandler("You do not have permission to access this resource", 403));
    }
    next();
});

// Alias for auth middleware
export const verifyJWT = auth;