import { asyncHandler } from "../middlewares/asyncHandler.middleware.js";
import ErrorHandler from "../middlewares/error.middleware.js";
import { StoreItem } from "../models/storeItem.model.js";
import { Wallet } from "../models/wallet.model.js";
import { User } from "../models/user.model.js";
import { logActivity } from "../utils/logActivity.utils.js";
import { uploadOnCloudinary, destroyOnCloudinary } from "../utils/cloudinary.utils.js";

// ============================================
// GET ALL STORE ITEMS (PUBLIC)
// ============================================

export const getAllStoreItems = asyncHandler(async (req, res, next) => {
    const { 
        page = 1, 
        limit = 12, 
        category,
        rarity,
        type,
        minPrice,
        maxPrice,
        sortBy = "popular",
        search
    } = req.query;

    const query = { 
        isDeleted: false,
        isActive: true
    };
    
    // Apply filters
    if (category) query.category = category;
    if (rarity) query.rarity = rarity;
    if (type) query.type = type;
    
    if (minPrice || maxPrice) {
        query["price.coins"] = {};
        if (minPrice) query["price.coins"].$gte = parseInt(minPrice);
        if (maxPrice) query["price.coins"].$lte = parseInt(maxPrice);
    }
    
    if (search) {
        query.$or = [
            { name: { $regex: search, $options: "i" } },
            { description: { $regex: search, $options: "i" } },
            { tags: { $in: [new RegExp(search, "i")] } }
        ];
    }

    const skip = (parseInt(page) - 1) * parseInt(limit);
    
    // Sort options
    let sortOptions = {};
    switch (sortBy) {
        case "popular":
            sortOptions = { purchaseCount: -1 };
            break;
        case "newest":
            sortOptions = { createdAt: -1 };
            break;
        case "price-low":
            sortOptions = { "price.coins": 1 };
            break;
        case "price-high":
            sortOptions = { "price.coins": -1 };
            break;
        default:
            sortOptions = { purchaseCount: -1 };
    }

    const [items, total] = await Promise.all([
        StoreItem.find(query)
            .sort(sortOptions)
            .skip(skip)
            .limit(parseInt(limit)),
        StoreItem.countDocuments(query)
    ]);

    res.status(200).json({
        success: true,
        data: {
            items,
            pagination: {
                currentPage: parseInt(page),
                totalPages: Math.ceil(total / parseInt(limit)),
                totalItems: total,
                hasNextPage: skip + items.length < total,
                hasPrevPage: parseInt(page) > 1
            }
        }
    });
});

// ============================================
// GET STORE ITEM BY ID
// ============================================

export const getStoreItemById = asyncHandler(async (req, res, next) => {
    const { itemId } = req.params;

    const item = await StoreItem.findOne({ 
        _id: itemId, 
        isDeleted: false 
    });

    if (!item) {
        return next(new ErrorHandler("Item not found", 404));
    }

    // Check if user owns this item
    let owned = false;
    if (req.user) {
        owned = await item.hasUserPurchased(req.user._id);
    }

    res.status(200).json({
        success: true,
        data: {
            ...item.toObject(),
            owned
        }
    });
});

// ============================================
// GET FEATURED ITEMS
// ============================================

export const getFeaturedItems = asyncHandler(async (req, res, next) => {
    const items = await StoreItem.find({ 
        isDeleted: false,
        isActive: true,
        isFeatured: true
    })
    .sort({ createdAt: -1 })
    .limit(6);

    res.status(200).json({
        success: true,
        data: items
    });
});

// ============================================
// GET USER'S PURCHASED ITEMS (INVENTORY)
// ============================================

export const getUserInventory = asyncHandler(async (req, res, next) => {
    const userId = req.user._id;
    const { page = 1, limit = 20, category } = req.query;

    const query = { 
        isDeleted: false,
        "purchases.user": userId
    };
    
    if (category) query.category = category;

    const skip = (parseInt(page) - 1) * parseInt(limit);

    const [items, total] = await Promise.all([
        StoreItem.find(query)
            .sort({ createdAt: -1 })
            .skip(skip)
            .limit(parseInt(limit)),
        StoreItem.countDocuments(query)
    ]);

    // Add purchase details
    const itemsWithDetails = items.map(item => {
        const purchaseInfo = item.purchases.find(
            p => p.user.toString() === userId.toString()
        );
        return {
            ...item.toObject(),
            purchasedAt: purchaseInfo?.purchasedAt,
            quantity: purchaseInfo?.quantity || 1
        };
    });

    res.status(200).json({
        success: true,
        data: {
            items: itemsWithDetails,
            pagination: {
                currentPage: parseInt(page),
                totalPages: Math.ceil(total / parseInt(limit)),
                totalItems: total,
                hasNextPage: skip + items.length < total,
                hasPrevPage: parseInt(page) > 1
            }
        }
    });
});

// ============================================
// PURCHASE ITEM
// ============================================

export const purchaseItem = asyncHandler(async (req, res, next) => {
    const { itemId } = req.params;
    const userId = req.user._id;
    const { quantity = 1, paymentMethod = "coins" } = req.body;

    const item = await StoreItem.findOne({ 
        _id: itemId, 
        isDeleted: false,
        isActive: true
    });

    if (!item) {
        return next(new ErrorHandler("Item not found", 404));
    }

    // Check stock availability
    if (item.stock !== -1 && item.stock < quantity) {
        return next(new ErrorHandler("Not enough stock available", 400));
    }

    // Get user for level check and can purchase validation
    const user = await User.findById(userId);
    if (!user) {
        return next(new ErrorHandler("User not found", 404));
    }

    // Use model's canPurchase method to check eligibility
    const purchaseCheck = item.canPurchase(userId, user.level);
    if (!purchaseCheck.canPurchase) {
        return next(new ErrorHandler(purchaseCheck.reason, 400));
    }

    // Calculate total price using discountedPrice virtual
    const unitPrice = item.discountedPrice || item.price;
    const totalPrice = unitPrice * quantity;

    // Get user wallet
    const wallet = await Wallet.findOne({ user: userId });
    if (!wallet) {
        return next(new ErrorHandler("Wallet not found", 404));
    }

    // Check balance based on currency
    if (item.currency === "coins" || paymentMethod === "coins") {
        if (wallet.totalBalance < totalPrice) {
            return next(new ErrorHandler("Insufficient coins", 400));
        }
    }

    // Deduct coins using wallet's deductCoins method
    // Signature: deductCoins(amount, reference, refModel, description)
    await wallet.deductCoins(
        totalPrice,
        item._id,
        "StoreItem",
        `Purchased ${item.name} x${quantity}`
    );

    // Use model's processPurchase method to record purchase and update stock
    await item.processPurchase(userId, quantity);

    // If item is a boost/powerup, apply effects
    if (item.effects && (item.type === "boost" || item.type === "powerup")) {
        if (item.effects.xpMultiplier) {
            // Store boost in user profile with expiry
            user.activeBoosts = user.activeBoosts || [];
            user.activeBoosts.push({
                type: "xp",
                multiplier: item.effects.xpMultiplier,
                expiresAt: new Date(Date.now() + (item.effects.duration || 3600) * 1000)
            });
        }
        
        if (item.effects.coinMultiplier) {
            user.activeBoosts = user.activeBoosts || [];
            user.activeBoosts.push({
                type: "coin",
                multiplier: item.effects.coinMultiplier,
                expiresAt: new Date(Date.now() + (item.effects.duration || 3600) * 1000)
            });
        }
        
        await user.save();
    }

    await logActivity(
        userId,
        "store_purchase",
        `Purchased ${item.name} for ${totalPrice} ${item.currency}`,
        req,
        "store",
        item._id
    );

    // Refresh wallet to get updated balance
    const updatedWallet = await Wallet.findOne({ user: userId });

    res.status(200).json({
        success: true,
        message: "Purchase successful",
        data: {
            item: {
                _id: item._id,
                name: item.name,
                category: item.category,
                type: item.type
            },
            quantity,
            unitPrice,
            totalPaid: totalPrice,
            currency: item.currency,
            remainingBalance: updatedWallet.totalBalance
        }
    });
});

// ============================================
// ADMIN: CREATE STORE ITEM
// ============================================

export const createStoreItem = asyncHandler(async (req, res, next) => {
    const {
        name,
        description,
        category,
        currency,
        rarity,
        stock,
        isActive,
        isNew,
        isFeatured,
        tags
    } = req.body;

    // Parse numeric values from form-data (they come as strings)
    const price = Number(req.body.price) || 0;
    const discount = Number(req.body.discount) || 0;
    const stockNum = req.body.stock ? Number(req.body.stock) : null;

    // Parse effects if it's a string (from form-data)
    let effects = {};
    if (req.body.effects) {
        try {
            effects = typeof req.body.effects === 'string' 
                ? JSON.parse(req.body.effects) 
                : req.body.effects;
        } catch (e) {
            // If parsing fails, ignore effects
        }
    }

    // Parse tags if it's a string
    let parsedTags = [];
    if (tags) {
        try {
            parsedTags = typeof tags === 'string' ? JSON.parse(tags) : tags;
        } catch (e) {
            parsedTags = typeof tags === 'string' ? tags.split(',').map(t => t.trim()) : [];
        }
    }

    // Handle image upload
    let imageData = {};
    if (req.file) {
        const uploadedImage = await uploadOnCloudinary(req.file.path, "store-items", req.user, req.file.originalname);
        if (uploadedImage) {
            imageData = {
                public_id: uploadedImage.public_id,
                secure_url: uploadedImage.secure_url
            };
        }
    }

    const item = await StoreItem.create({
        name,
        description,
        category,
        price,
        currency: currency || "coins",
        discount,
        stock: stockNum,
        image: imageData,
        effects,
        isActive: isActive === 'true' || isActive === true,
        isNew: isNew === 'true' || isNew === true,
        isFeatured: isFeatured === 'true' || isFeatured === true,
        tags: parsedTags,
        createdBy: req.user._id
    });

    await logActivity(
        req.user._id,
        "admin_action",
        `Created store item: ${name}`,
        req,
        "store",
        item._id
    );

    res.status(201).json({
        success: true,
        message: "Store item created successfully",
        data: item
    });
});

// ============================================
// ADMIN: UPDATE STORE ITEM
// ============================================

export const updateStoreItem = asyncHandler(async (req, res, next) => {
    const { itemId } = req.params;

    const item = await StoreItem.findOne({ 
        _id: itemId, 
        isDeleted: false 
    });

    if (!item) {
        return next(new ErrorHandler("Item not found", 404));
    }

    // Parse form-data fields properly
    const updateData = {};

    // String fields
    if (req.body.name !== undefined) updateData.name = req.body.name;
    if (req.body.description !== undefined) updateData.description = req.body.description;
    if (req.body.category !== undefined) updateData.category = req.body.category;
    if (req.body.currency !== undefined) updateData.currency = req.body.currency;

    // Number fields
    if (req.body.price !== undefined) updateData.price = Number(req.body.price);
    if (req.body.discount !== undefined) updateData.discount = Number(req.body.discount);
    if (req.body.stock !== undefined) updateData.stock = req.body.stock === '' || req.body.stock === 'null' ? null : Number(req.body.stock);

    // Boolean fields
    if (req.body.isActive !== undefined) updateData.isActive = req.body.isActive === 'true' || req.body.isActive === true;
    if (req.body.isNew !== undefined) updateData.isNew = req.body.isNew === 'true' || req.body.isNew === true;
    if (req.body.isFeatured !== undefined) updateData.isFeatured = req.body.isFeatured === 'true' || req.body.isFeatured === true;

    // JSON object fields (come as strings from form-data)
    if (req.body.effects !== undefined) {
        try {
            updateData.effects = typeof req.body.effects === 'string' 
                ? JSON.parse(req.body.effects) 
                : req.body.effects;
        } catch (e) {
            return next(new ErrorHandler("Invalid effects format. Must be valid JSON.", 400));
        }
    }

    if (req.body.requirements !== undefined) {
        try {
            updateData.requirements = typeof req.body.requirements === 'string' 
                ? JSON.parse(req.body.requirements) 
                : req.body.requirements;
        } catch (e) {
            return next(new ErrorHandler("Invalid requirements format. Must be valid JSON.", 400));
        }
    }

    // Tags field
    if (req.body.tags !== undefined) {
        try {
            updateData.tags = typeof req.body.tags === 'string' 
                ? JSON.parse(req.body.tags) 
                : req.body.tags;
        } catch (e) {
            updateData.tags = typeof req.body.tags === 'string' 
                ? req.body.tags.split(',').map(t => t.trim()) 
                : [];
        }
    }

    // Handle image upload
    if (req.file) {
        // Delete old image if exists
        if (item.image?.public_id) {
            await destroyOnCloudinary(item.image.public_id, "store-items");
        }
        
        const uploadedImage = await uploadOnCloudinary(req.file.path, "store-items", req.user, req.file.originalname);
        if (uploadedImage) {
            updateData.image = {
                public_id: uploadedImage.public_id,
                secure_url: uploadedImage.secure_url
            };
        }
    }

    // Apply updates
    Object.keys(updateData).forEach(field => {
        item[field] = updateData[field];
    });

    item.updatedBy = req.user._id;
    await item.save();

    await logActivity(
        req.user._id,
        "admin_action",
        `Updated store item: ${item.name}`,
        req,
        "store",
        item._id
    );

    res.status(200).json({
        success: true,
        message: "Store item updated successfully",
        data: item
    });
});

// ============================================
// ADMIN: DELETE STORE ITEM
// ============================================

export const deleteStoreItem = asyncHandler(async (req, res, next) => {
    const { itemId } = req.params;

    const item = await StoreItem.findOne({ 
        _id: itemId, 
        isDeleted: false 
    });

    if (!item) {
        return next(new ErrorHandler("Item not found", 404));
    }

    item.isDeleted = true;
    item.deletedAt = new Date();
    item.deletedBy = req.user._id;
    await item.save();

    await logActivity(
        req.user._id,
        "admin_action",
        `Deleted store item: ${item.name}`,
        req,
        "store",
        item._id
    );

    res.status(200).json({
        success: true,
        message: "Store item deleted successfully"
    });
});

// ============================================
// ADMIN: GET ALL STORE ITEMS (INCLUDING INACTIVE)
// ============================================

export const adminGetAllStoreItems = asyncHandler(async (req, res, next) => {
    const { 
        page = 1, 
        limit = 20, 
        category,
        type,
        isActive,
        includeDeleted = false
    } = req.query;

    const query = {};
    
    if (!includeDeleted) query.isDeleted = false;
    if (category) query.category = category;
    if (type) query.type = type;
    if (isActive !== undefined) query.isActive = isActive === "true";

    const skip = (parseInt(page) - 1) * parseInt(limit);

    const [items, total, stats] = await Promise.all([
        StoreItem.find(query)
            .sort({ createdAt: -1 })
            .skip(skip)
            .limit(parseInt(limit))
            .populate("createdBy", "username"),
        StoreItem.countDocuments(query),
        StoreItem.aggregate([
            { $match: { isDeleted: false } },
            {
                $group: {
                    _id: null,
                    totalItems: { $sum: 1 },
                    totalRevenue: { 
                        $sum: { 
                            $multiply: ["$price.coins", "$purchaseCount"] 
                        } 
                    },
                    totalPurchases: { $sum: "$purchaseCount" }
                }
            }
        ])
    ]);

    res.status(200).json({
        success: true,
        data: {
            items,
            stats: stats[0] || { totalItems: 0, totalRevenue: 0, totalPurchases: 0 },
            pagination: {
                currentPage: parseInt(page),
                totalPages: Math.ceil(total / parseInt(limit)),
                totalItems: total,
                hasNextPage: skip + items.length < total,
                hasPrevPage: parseInt(page) > 1
            }
        }
    });
});

// ============================================
// GET STORE CATEGORIES
// ============================================

export const getStoreCategories = asyncHandler(async (req, res, next) => {
    const categories = await StoreItem.aggregate([
        { $match: { isDeleted: false, isActive: true } },
        { $group: { _id: "$category", count: { $sum: 1 } } },
        { $sort: { count: -1 } }
    ]);

    res.status(200).json({
        success: true,
        data: categories.map(c => ({
            category: c._id,
            count: c.count
        }))
    });
});
