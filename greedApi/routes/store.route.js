import { Router } from "express";
import {
    getAllStoreItems,
    getStoreItemById,
    getFeaturedItems,
    getUserInventory,
    purchaseItem,
    createStoreItem,
    updateStoreItem,
    deleteStoreItem,
    adminGetAllStoreItems,
    getStoreCategories
} from "../controllers/storeItem.controller.js";
import { verifyJWT, adminOnly } from "../middlewares/auth.middleware.js";
import { createStoreItemValidator, validate } from "../middlewares/validation.middleware.js";
import { generalLimiter, walletLimiter, adminLimiter } from "../middlewares/rateLimiter.middleware.js";
import multer from "multer";
import { upload } from "../middlewares/multer.middleware.js";

const router = Router();

// ============================================
// PUBLIC ROUTES
// ============================================

// Get all store items
router.get("/", generalLimiter, getAllStoreItems);

// Get featured items
router.get("/featured", generalLimiter, getFeaturedItems);

// Get store categories
router.get("/categories", generalLimiter, getStoreCategories);

// Get store item by ID
router.get("/:itemId", generalLimiter, getStoreItemById);

// ============================================
// PROTECTED ROUTES (REQUIRE AUTH)
// ============================================

router.use(verifyJWT);

// Get user's inventory
router.get("/user/inventory", getUserInventory);

// Purchase item
router.post("/:itemId/purchase", walletLimiter, purchaseItem);

// ============================================
// ADMIN ROUTES
// ============================================

router.use(adminOnly);
router.use(adminLimiter);

// Admin: Get all store items
router.get("/admin/all", adminGetAllStoreItems);

// Create store item (upload MUST come before validators for form-data)
router.post("/", upload.single("image"), createStoreItemValidator, validate, createStoreItem);

// Update store item
router.put("/:itemId", upload.single("image"), updateStoreItem);

// Delete store item
router.delete("/:itemId", deleteStoreItem);

export default router;
