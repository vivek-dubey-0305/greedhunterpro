import mongoose, { Schema } from "mongoose";

// ============================================
// STORE ITEM SCHEMA DEFINITION
// ============================================

const storeItemSchema = new Schema({
    name: {
        type: String,
        required: [true, "Item name is required"],
        trim: true,
        maxlength: [200, "Name cannot exceed 200 characters"]
    },
    description: {
        type: String,
        required: [true, "Description is required"],
        trim: true,
        maxlength: [2000, "Description cannot exceed 2000 characters"]
    },
    category: {
        type: String,
        required: true,
        enum: ["avatar", "badge", "theme", "powerup", "boost", "cosmetic", "ticket", "other"],
        default: "cosmetic"
    },
    // Pricing
    price: {
        type: Number,
        required: true,
        min: [0, "Price cannot be negative"]
    },
    currency: {
        type: String,
        required: true,
        enum: ["coins", "cash"],
        default: "coins"
    },
    discount: {
        type: Number,
        default: 0,
        min: 0,
        max: 100 // percentage
    },
    // Image
    image: {
        public_id: String,
        secure_url: String
    },
    // Stock management
    stock: {
        type: Number,
        default: null, // null = unlimited
        min: 0
    },
    sold: {
        type: Number,
        default: 0,
        min: 0
    },
    // Flags
    isActive: {
        type: Boolean,
        default: true
    },
    isNew: {
        type: Boolean,
        default: false
    },
    isFeatured: {
        type: Boolean,
        default: false
    },
    // Item effects (for powerups/boosts)
    effects: {
        type: {
            type: String,
            enum: ["xp_boost", "coin_boost", "skip_challenge", "streak_protection", "custom", null],
            default: null
        },
        value: {
            type: Number, // e.g., 2 for 2x boost
            default: 1
        },
        duration: {
            type: Number, // in hours
            default: 24
        }
    },
    // Requirements
    requirements: {
        minLevel: {
            type: Number,
            default: 0,
            min: 0
        },
        maxPurchases: {
            type: Number,
            default: null // null = unlimited per user
        }
    },
    // User purchases
    purchases: [{
        user: {
            type: Schema.Types.ObjectId,
            ref: "User",
            required: true
        },
        quantity: {
            type: Number,
            default: 1,
            min: 1
        },
        purchasedAt: {
            type: Date,
            default: Date.now
        },
        pricePaid: {
            type: Number,
            required: true
        },
        expiresAt: {
            type: Date // for temporary items
        }
    }],
    // Tags
    tags: [{
        type: String,
        trim: true,
        lowercase: true
    }],
    // Audit fields
    createdBy: {
        type: Schema.Types.ObjectId,
        ref: "User",
        required: true
    },
    updatedBy: {
        type: Schema.Types.ObjectId,
        ref: "User"
    },
    // Soft delete
    isDeleted: {
        type: Boolean,
        default: false
    },
    deletedAt: {
        type: Date
    },
    deletedBy: {
        type: Schema.Types.ObjectId,
        ref: "User"
    }
}, {
    timestamps: true
});

// ============================================
// INDEXES
// ============================================

storeItemSchema.index({ name: 1 });
storeItemSchema.index({ category: 1 });
storeItemSchema.index({ currency: 1 });
storeItemSchema.index({ price: 1 });
storeItemSchema.index({ isActive: 1 });
storeItemSchema.index({ isFeatured: 1 });
storeItemSchema.index({ isNew: 1 });
storeItemSchema.index({ sold: -1 });
storeItemSchema.index({ tags: 1 });
storeItemSchema.index({ isDeleted: 1 });
storeItemSchema.index({ "purchases.user": 1 });

// ============================================
// VIRTUALS
// ============================================

// Calculate discounted price
storeItemSchema.virtual("discountedPrice").get(function() {
    if (this.discount && this.discount > 0) {
        return this.price - (this.price * this.discount / 100);
    }
    return this.price;
});

// Check if in stock
storeItemSchema.virtual("inStock").get(function() {
    if (this.stock === null) return true; // unlimited
    return this.stock > 0;
});

// ============================================
// INSTANCE METHODS
// ============================================

// Check if user can purchase
storeItemSchema.methods.canPurchase = function(userId, userLevel = 0) {
    // Check if active
    if (!this.isActive || this.isDeleted) {
        return { canPurchase: false, reason: "Item is not available" };
    }
    
    // Check stock
    if (this.stock !== null && this.stock <= 0) {
        return { canPurchase: false, reason: "Item is out of stock" };
    }
    
    // Check level requirement
    if (userLevel < this.requirements.minLevel) {
        return { canPurchase: false, reason: `Requires level ${this.requirements.minLevel}` };
    }
    
    // Check max purchases per user
    if (this.requirements.maxPurchases !== null) {
        const userPurchases = this.purchases.filter(
            p => p.user.toString() === userId.toString()
        );
        const totalQuantity = userPurchases.reduce((sum, p) => sum + p.quantity, 0);
        
        if (totalQuantity >= this.requirements.maxPurchases) {
            return { canPurchase: false, reason: "Maximum purchase limit reached" };
        }
    }
    
    return { canPurchase: true };
};

// Process purchase
storeItemSchema.methods.processPurchase = async function(userId, quantity = 1) {
    const discountedPrice = this.discountedPrice;
    const totalPrice = discountedPrice * quantity;
    
    // Update stock
    if (this.stock !== null) {
        this.stock -= quantity;
    }
    this.sold += quantity;
    
    // Calculate expiry for temporary items
    let expiresAt = null;
    if (this.effects.duration && this.effects.type) {
        expiresAt = new Date(Date.now() + this.effects.duration * 60 * 60 * 1000);
    }
    
    // Add purchase record
    this.purchases.push({
        user: userId,
        quantity: quantity,
        purchasedAt: new Date(),
        pricePaid: totalPrice,
        expiresAt: expiresAt
    });
    
    await this.save();
    
    return {
        item: this,
        pricePaid: totalPrice,
        expiresAt: expiresAt
    };
};

// Get user's purchase history
storeItemSchema.methods.getUserPurchases = function(userId) {
    return this.purchases.filter(p => p.user.toString() === userId.toString());
};

// Soft delete
storeItemSchema.methods.softDelete = function(deletedBy) {
    this.isDeleted = true;
    this.deletedAt = new Date();
    this.deletedBy = deletedBy;
    return this.save();
};

// ============================================
// STATIC METHODS
// ============================================

// Get active store items
storeItemSchema.statics.getActiveItems = function(options = {}) {
    const { page = 1, limit = 20, category, currency, featured } = options;
    
    const query = {
        isDeleted: false,
        isActive: true
    };
    
    if (category) query.category = category;
    if (currency) query.currency = currency;
    if (featured) query.isFeatured = true;
    
    return this.find(query)
        .sort({ isFeatured: -1, isNew: -1, sold: -1 })
        .skip((page - 1) * limit)
        .limit(limit);
};

// Get featured items
storeItemSchema.statics.getFeaturedItems = function(limit = 10) {
    return this.find({
        isDeleted: false,
        isActive: true,
        isFeatured: true
    })
    .sort({ sold: -1 })
    .limit(limit);
};

// Get user's inventory
storeItemSchema.statics.getUserInventory = async function(userId) {
    const items = await this.find({
        isDeleted: false,
        "purchases.user": userId
    });
    
    return items.map(item => {
        const userPurchases = item.purchases.filter(
            p => p.user.toString() === userId.toString()
        );
        return {
            item: item,
            purchases: userPurchases,
            totalQuantity: userPurchases.reduce((sum, p) => sum + p.quantity, 0)
        };
    });
};

// ============================================
// EXPORT
// ============================================

export const StoreItem = mongoose.model("StoreItem", storeItemSchema);
