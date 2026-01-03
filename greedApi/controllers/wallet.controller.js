import { asyncHandler } from "../middlewares/asyncHandler.middleware.js";
import ErrorHandler from "../middlewares/error.middleware.js";
import { Wallet } from "../models/wallet.model.js";
import { User } from "../models/user.model.js";
import { logActivity } from "../utils/logActivity.utils.js";

// ============================================
// GET WALLET INFO
// ============================================

const getWalletInfo = asyncHandler(async (req, res, next) => {
    const userId = req.user._id;

    const wallet = await Wallet.findOne({ user: userId, isDeleted: false });

    if (!wallet) {
        return next(new ErrorHandler("Wallet not found", 404));
    }

    res.status(200).json({
        success: true,
        wallet: {
            totalBalance: wallet.totalBalance,
            totalEarned: wallet.totalEarned,
            totalSpent: wallet.totalSpent,
            isFrozen: wallet.isFrozen,
            transactionCount: wallet.transactionCount
        }
    });
});

// ============================================
// GET TRANSACTION HISTORY
// ============================================

const getTransactionHistory = asyncHandler(async (req, res, next) => {
    const userId = req.user._id;
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 10;
    const type = req.query.type; // earn, spend, bonus, refund

    const wallet = await Wallet.findOne({ user: userId, isDeleted: false });

    if (!wallet) {
        return next(new ErrorHandler("Wallet not found", 404));
    }

    let transactions = wallet.transactions.sort((a, b) => b.timestamp - a.timestamp);

    if (type) {
        transactions = transactions.filter(tx => tx.type === type);
    }

    const startIndex = (page - 1) * limit;
    const endIndex = startIndex + limit;
    const paginatedTransactions = transactions.slice(startIndex, endIndex);

    res.status(200).json({
        success: true,
        transactions: paginatedTransactions,
        pagination: {
            currentPage: page,
            totalPages: Math.ceil(transactions.length / limit),
            totalTransactions: transactions.length,
            hasNext: endIndex < transactions.length,
            hasPrev: page > 1
        }
    });
});

// ============================================
// ADD COINS (Admin Function)
// ============================================

const addCoins = asyncHandler(async (req, res, next) => {
    const { userId, amount, type, description } = req.body;
    const adminId = req.user._id;

    // Check if user is admin (you might want to add role checking)
    const admin = await User.findById(adminId);
    if (admin.role !== 'admin' && admin.role !== 'super_admin' ) {
        return next(new ErrorHandler("Unauthorized to add coins", 403));
    }

    if (!userId || !amount || !type) {
        return next(new ErrorHandler("User ID, amount, and type are required", 400));
    }

    if (amount <= 0) {
        return next(new ErrorHandler("Amount must be positive", 400));
    }

    if (!['earn', 'bonus', 'refund'].includes(type)) {
        return next(new ErrorHandler("Invalid transaction type", 400));
    }

    const wallet = await Wallet.findOne({ user: userId, isDeleted: false });

    if (!wallet) {
        return next(new ErrorHandler("Wallet not found", 404));
    }

    await wallet.addCoins(amount, type, null, null, description || `Admin added ${type}`);

    await logActivity(
        adminId,
        "admin_coins_added",
        `Added ${amount} coins to user ${userId}`,
        req,
        'wallet',
        wallet._id,
        null,
        { amount, type, targetUser: userId }
    );

    res.status(200).json({
        success: true,
        message: `${amount} coins added successfully`,
        wallet: {
            totalBalance: wallet.totalBalance,
            totalEarned: wallet.totalEarned
        }
    });
});

// ============================================
// DEDUCT COINS (Admin Function)
// ============================================

const deductCoins = asyncHandler(async (req, res, next) => {
    const { userId, amount, description } = req.body;
    const adminId = req.user._id;

    // Check if user is admin
    const admin = await User.findById(adminId);
    if (admin.role !== 'admin' && admin.role !== 'super_admin') {
        return next(new ErrorHandler("Unauthorized to deduct coins", 403));
    }

    if (!userId || !amount) {
        return next(new ErrorHandler("User ID and amount are required", 400));
    }

    if (amount <= 0) {
        return next(new ErrorHandler("Amount must be positive", 400));
    }

    const wallet = await Wallet.findOne({ user: userId, isDeleted: false });

    if (!wallet) {
        return next(new ErrorHandler("Wallet not found", 404));
    }

    if (wallet.availableBalance < amount) {
        return next(new ErrorHandler("Insufficient balance", 400));
    }

    await wallet.deductCoins(amount, null, null, description || `Admin deducted coins`);

    await logActivity(
        adminId,
        "admin_coins_deducted",
        `Deducted ${amount} coins from user ${userId}`,
        req,
        'wallet',
        wallet._id,
        null,
        { amount, targetUser: userId }
    );

    res.status(200).json({
        success: true,
        message: `${amount} coins deducted successfully`,
        wallet: {
            totalBalance: wallet.totalBalance,
            totalSpent: wallet.totalSpent
        }
    });
});

// ============================================
// FREEZE WALLET (Admin Function)
// ============================================

const freezeWallet = asyncHandler(async (req, res, next) => {
    const { userId } = req.body;
    const adminId = req.user._id;

    // Check if user is admin
    const admin = await User.findById(adminId);
    if (admin.role !== 'admin' && admin.role !== 'super_admin') {
        return next(new ErrorHandler("Unauthorized to freeze wallet", 403));
    }

    const wallet = await Wallet.findOne({ user: userId, isDeleted: false });

    if (!wallet) {
        return next(new ErrorHandler("Wallet not found", 404));
    }

    if (wallet.isFrozen) {
        return next(new ErrorHandler("Wallet is already frozen", 400));
    }

    await wallet.freezeWallet();

    await logActivity(
        adminId,
        "wallet_frozen",
        `Froze wallet for user ${userId}`,
        req,
        'wallet',
        wallet._id,
        null,
        { targetUser: userId }
    );

    res.status(200).json({
        success: true,
        message: "Wallet frozen successfully"
    });
});

// ============================================
// UNFREEZE WALLET (Admin Function)
// ============================================

const unfreezeWallet = asyncHandler(async (req, res, next) => {
    try {
        
        const { userId } = req.body;
        const adminId = req.user._id;
    
        // Check if user is admin
        const admin = await User.findById(adminId);
        if (admin.role !== 'admin' && admin.role !== 'super_admin') {
            return next(new ErrorHandler("Unauthorized to unfreeze wallet", 403));
        }
    
        const wallet = await Wallet.findOne({ user: userId, isDeleted: false });
    
        if (!wallet) {
            return next(new ErrorHandler("Wallet not found", 404));
        }
    
        if (!wallet.isFrozen) {
            return next(new ErrorHandler("Wallet is not frozen", 400));
        }
    
        wallet.isFrozen = false;
        await wallet.save();
    
        await logActivity(
            adminId,
            "wallet_unfrozen",
            `Unfroze wallet for user ${userId}`,
            req,
            'wallet',
            wallet._id,
            null,
            { targetUser: userId }
        );
    
        res.status(200).json({
            success: true,
            message: "Wallet unfrozen successfully"
        });
    } catch (error) {
        return next(new ErrorHandler("Server Error", 500));
    }
});

// ============================================
// TRANSFER COINS (Future Feature)
// ============================================

const transferCoins = asyncHandler(async (req, res, next) => {
    const { recipientId, amount, description } = req.body;
    const senderId = req.user._id;

    if (!recipientId || !amount) {
        return next(new ErrorHandler("Recipient ID and amount are required", 400));
    }

    if (amount <= 0) {
        return next(new ErrorHandler("Amount must be positive", 400));
    }

    if (senderId.toString() === recipientId.toString()) {
        return next(new ErrorHandler("Cannot transfer to yourself", 400));
    }

    const senderWallet = await Wallet.findOne({ user: senderId, isDeleted: false });
    const recipientWallet = await Wallet.findOne({ user: recipientId, isDeleted: false });

    if (!senderWallet || !recipientWallet) {
        return next(new ErrorHandler("Wallet not found", 404));
    }

    if (senderWallet.availableBalance < amount) {
        return next(new ErrorHandler("Insufficient balance", 400));
    }

    // Perform transfer
    await senderWallet.deductCoins(amount, null, null, `Transfer to user ${recipientId}`);
    await recipientWallet.addCoins(amount, 'earn', null, null, `Transfer from user ${senderId}`);

    await logActivity(
        senderId,
        "coins_transferred",
        `Transferred ${amount} coins to user ${recipientId}`,
        req,
        'wallet',
        senderWallet._id,
        null,
        { amount, recipient: recipientId }
    );

    res.status(200).json({
        success: true,
        message: `${amount} coins transferred successfully`,
        wallet: {
            totalBalance: senderWallet.totalBalance,
            totalSpent: senderWallet.totalSpent
        }
    });
});

// ============================================
// GET WALLET STATISTICS
// ============================================

const getWalletStats = asyncHandler(async (req, res, next) => {
    const userId = req.user._id;

    const wallet = await Wallet.findOne({ user: userId, isDeleted: false });

    if (!wallet) {
        return next(new ErrorHandler("Wallet not found", 404));
    }

    // Calculate statistics
    const transactions = wallet.transactions;
    const earnTransactions = transactions.filter(tx => ['earn', 'bonus', 'refund'].includes(tx.type));
    const spendTransactions = transactions.filter(tx => tx.type === 'spend');

    const totalEarned = earnTransactions.reduce((sum, tx) => sum + tx.amount, 0);
    const totalSpent = spendTransactions.reduce((sum, tx) => sum + tx.amount, 0);

    const monthlyStats = {};
    transactions.forEach(tx => {
        const month = tx.timestamp.toISOString().slice(0, 7); // YYYY-MM
        if (!monthlyStats[month]) {
            monthlyStats[month] = { earned: 0, spent: 0 };
        }
        if (['earn', 'bonus', 'refund'].includes(tx.type)) {
            monthlyStats[month].earned += tx.amount;
        } else if (tx.type === 'spend') {
            monthlyStats[month].spent += tx.amount;
        }
    });

    res.status(200).json({
        success: true,
        stats: {
            totalBalance: wallet.totalBalance,
            totalEarned,
            totalSpent,
            netEarnings: totalEarned - totalSpent,
            transactionCount: transactions.length,
            monthlyStats
        }
    });
});

// ============================================
// EXPORTS
// ============================================

export {
    getWalletInfo,
    getTransactionHistory,
    addCoins,
    deductCoins,
    freezeWallet,
    unfreezeWallet,
    transferCoins,
    getWalletStats
};
