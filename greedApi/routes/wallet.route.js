import { Router } from "express";
import {
    getWalletInfo,
    getTransactionHistory,
    addCoins,
    deductCoins,
    freezeWallet,
    unfreezeWallet,
    transferCoins,
    getWalletStats
} from "../controllers/wallet.controller.js";
import { verifyJWT } from "../middlewares/auth.middleware.js";

const router = Router();

// ============================================
// PROTECTED ROUTES (Require Authentication)
// ============================================

// User wallet routes
router.route("/").get(verifyJWT, getWalletInfo);
router.route("/transactions").get(verifyJWT, getTransactionHistory);
router.route("/stats").get(verifyJWT, getWalletStats);
router.route("/transfer").post(verifyJWT, transferCoins);

// ============================================
// ADMIN ROUTES (Require Admin Role)
// ============================================

// Admin wallet management
router.route("/admin/add-coins").post(verifyJWT, addCoins);
router.route("/admin/deduct-coins").post(verifyJWT, deductCoins);
router.route("/admin/freeze").post(verifyJWT, freezeWallet);
router.route("/admin/unfreeze").post(verifyJWT, unfreezeWallet);

export default router;
