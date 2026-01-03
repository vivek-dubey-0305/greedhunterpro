import mongoose, { Schema } from "mongoose";

// ============================================
// WALLET SCHEMA DEFINITION
// ============================================

const walletSchema = new Schema({
    user: {
        type: Schema.Types.ObjectId,
        ref: "User",
        required: true
    },
    totalBalance: {
        type: Number,
        default: 0,
        min: [0, "Balance cannot be negative"]
    },
    totalEarned: {
        type: Number,
        default: 0,
        min: [0, "Total earned cannot be negative"]
    },
    totalSpent: {
        type: Number,
        default: 0,
        min: [0, "Total spent cannot be negative"]
    },
    isFrozen: {
        type: Boolean,
        default: false
    },
    transactions: [{
        type: {
            type: String,
            enum: ["earn", "spend", "bonus", "refund"],
            required: true
        },
        amount: {
            type: Number,
            required: true,
            min: [0.01, "Amount must be at least 0.01"]
        },
        reference: {
            type: Schema.Types.ObjectId,
            refPath: 'transactions.refModel'
        },
        refModel: {
            type: String,
            enum: ["Quiz", "Event", "StoreItem", "Challenge", "Mission"]
        },
        description: {
            type: String,
            trim: true,
            maxlength: [200, "Description cannot be more than 200 characters"]
        },
        balanceBefore: {
            type: Number,
            required: true,
            min: 0
        },
        balanceAfter: {
            type: Number,
            required: true,
            min: 0
        },
        timestamp: {
            type: Date,
            default: Date.now
        }
    }],
    // Soft delete fields
    isDeleted: {
        type: Boolean,
        default: false
    },
    deletedAt: {
        type: Date
    }
}, {
    timestamps: true
});

// ============================================
// INDEXES FOR PERFORMANCE
// ============================================

walletSchema.index({ user: 1 }, { unique: true });
walletSchema.index({ "transactions.timestamp": -1 });
walletSchema.index({ isDeleted: 1 });

// ============================================
// PRE-SAVE HOOKS
// ============================================

// Ensure balance consistency
// walletSchema.pre("save", function (next) {
//     try {
//         // Recalculate totals from transactions if needed
//         if (this.transactions && this.transactions.length > 0) {
//             let earned = 0;
//             let spent = 0;
//             this.transactions.forEach(tx => {
//                 if (tx.type === "earn" || tx.type === "bonus" || tx.type === "refund") {
//                     earned += Math.abs(tx.amount);
//                 } else if (tx.type === "spend") {
//                     spent += Math.abs(tx.amount);
//                 }
//             });
//             this.totalEarned = earned;
//             this.totalSpent = spent;
//             this.totalBalance = earned - spent;
//         }
//         next();
//     } catch (error) {
//         next(error);
//     }
// });
walletSchema.pre("save", async function () {
    try {
        // Recalculate totals from transactions if needed
        if (this.transactions && this.transactions.length > 0) {
            let earned = 0;
            let spent = 0;
            this.transactions.forEach(tx => {
                if (tx.type === "earn" || tx.type === "bonus" || tx.type === "refund") {
                    earned += Math.abs(tx.amount);
                } else if (tx.type === "spend") {
                    spent += Math.abs(tx.amount);
                }
            });
            this.totalEarned = earned;
            this.totalSpent = spent;
            this.totalBalance = earned - spent;
        }
       
    } catch (error) {
        console.error('Error in pre-save hook:', error);
        throw error; // Let Mongoose handle the error
    }
});

// ============================================
// INSTANCE METHODS
// ============================================

// Add coins (earn, bonus, refund)
walletSchema.methods.addCoins = async function (amount, type, reference = null, refModel = null, description = "") {
    if (this.isFrozen) {
        throw new Error("Wallet is frozen");
    }

    if (!["earn", "bonus", "refund"].includes(type)) {
        throw new Error("Invalid transaction type for adding coins");
    }

    const balanceBefore = this.totalBalance;
    this.totalBalance += amount;
    this.totalEarned += amount;

    this.transactions.push({
        type,
        amount,
        reference,
        refModel,
        description,
        balanceBefore,
        balanceAfter: this.totalBalance,
        timestamp: new Date()
    });

    return this.save();
};

// Deduct coins (spend)
walletSchema.methods.deductCoins = async function (amount, reference = null, refModel = null, description = "") {
    if (this.isFrozen) {
        throw new Error("Wallet is frozen");
    }

    if (this.totalBalance < amount) {
        throw new Error("Insufficient balance");
    }

    const balanceBefore = this.totalBalance;
    this.totalBalance -= amount;
    this.totalSpent += amount;

    this.transactions.push({
        type: "spend",
        amount,
        reference,
        refModel,
        description,
        balanceBefore,
        balanceAfter: this.totalBalance,
        timestamp: new Date()
    });

    return this.save();
};

// Freeze/unfreeze wallet
walletSchema.methods.freezeWallet = function () {
    this.isFrozen = true;
    return this.save();
};

walletSchema.methods.unfreezeWallet = function () {
    this.isFrozen = false;
    return this.save();
};

// Calculate lifetime earnings
walletSchema.methods.calculateLifetimeEarnings = function () {
    return this.totalEarned;
};

// Get transaction history with pagination
walletSchema.methods.getTransactionHistory = function (page = 1, limit = 10) {
    const startIndex = (page - 1) * limit;
    const endIndex = page * limit;
    return this.transactions.slice(startIndex, endIndex);
};

// Soft delete method
walletSchema.methods.softDelete = function () {
    this.isDeleted = true;
    this.deletedAt = new Date();
    return this.save();
};

// ============================================
// VIRTUALS
// ============================================

// Virtual for available balance
walletSchema.virtual('availableBalance').get(function () {
    return this.isFrozen ? 0 : this.totalBalance;
});

// Virtual for transaction count
walletSchema.virtual('transactionCount').get(function () {
    return this.transactions.length;
});

// ============================================
// STATIC METHODS
// ============================================

// Find wallet by user ID
walletSchema.statics.findByUserId = function (userId) {
    return this.findOne({ user: userId, isDeleted: false });
};

// ============================================
// EXPORT
// ============================================

export const Wallet = mongoose.model("Wallet", walletSchema);
