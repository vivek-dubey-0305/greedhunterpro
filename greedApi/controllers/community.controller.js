import { asyncHandler } from "../middlewares/asyncHandler.middleware.js";
import ErrorHandler from "../middlewares/error.middleware.js";
import { Community } from "../models/community.model.js";
import { logActivity } from "../utils/logActivity.utils.js";

// ============================================
// GET ALL COMMUNITIES (PUBLIC)
// ============================================

export const getAllCommunities = asyncHandler(async (req, res, next) => {
    const { 
        page = 1, 
        limit = 10, 
        category,
        visibility,
        search,
        sortBy = "memberCount"
    } = req.query;

    const query = { 
        isDeleted: false,
        status: "active"
    };
    
    // Only show public communities to non-members
    if (!req.user) {
        query.visibility = "public";
    } else if (visibility) {
        query.visibility = visibility;
    }
    
    if (category) query.category = category;
    
    if (search) {
        query.$or = [
            { name: { $regex: search, $options: "i" } },
            { description: { $regex: search, $options: "i" } },
            { tags: { $in: [new RegExp(search, "i")] } }
        ];
    }

    const skip = (parseInt(page) - 1) * parseInt(limit);
    const sortOptions = { [sortBy]: -1 };

    const [communities, total] = await Promise.all([
        Community.find(query)
            .sort(sortOptions)
            .skip(skip)
            .limit(parseInt(limit))
            .populate("owner", "username avatar"),
        Community.countDocuments(query)
    ]);

    res.status(200).json({
        success: true,
        data: {
            communities,
            pagination: {
                currentPage: parseInt(page),
                totalPages: Math.ceil(total / parseInt(limit)),
                totalCommunities: total,
                hasNextPage: skip + communities.length < total,
                hasPrevPage: parseInt(page) > 1
            }
        }
    });
});

// ============================================
// GET COMMUNITY BY ID
// ============================================

export const getCommunityById = asyncHandler(async (req, res, next) => {
    const { communityId } = req.params;

    const community = await Community.findOne({ 
        _id: communityId, 
        isDeleted: false 
    })
    .populate("owner", "username avatar")
    .populate("moderators", "username avatar")
    .populate("members.user", "username avatar level");

    if (!community) {
        return next(new ErrorHandler("Community not found", 404));
    }

    // Check visibility
    if (community.visibility === "private" || community.visibility === "invite-only") {
        if (!req.user || !community.isMember(req.user._id)) {
            // Return limited info for non-members
            return res.status(200).json({
                success: true,
                data: {
                    _id: community._id,
                    name: community.name,
                    description: community.description,
                    category: community.category,
                    visibility: community.visibility,
                    memberCount: community.memberCount,
                    image: community.image,
                    owner: community.owner,
                    isMember: false
                }
            });
        }
    }

    const isMember = req.user ? community.isMember(req.user._id) : false;
    const isModerator = req.user ? community.isModerator(req.user._id) : false;
    const isOwner = req.user ? community.isOwner(req.user._id) : false;

    res.status(200).json({
        success: true,
        data: {
            ...community.toObject(),
            isMember,
            isModerator,
            isOwner
        }
    });
});

// ============================================
// GET USER'S COMMUNITIES
// ============================================

export const getUserCommunities = asyncHandler(async (req, res, next) => {
    const userId = req.user._id;
    const { page = 1, limit = 10 } = req.query;

    const query = { 
        isDeleted: false,
        "members.user": userId
    };

    const skip = (parseInt(page) - 1) * parseInt(limit);

    const [communities, total] = await Promise.all([
        Community.find(query)
            .sort({ "members.joinedAt": -1 })
            .skip(skip)
            .limit(parseInt(limit))
            .populate("owner", "username avatar"),
        Community.countDocuments(query)
    ]);

    res.status(200).json({
        success: true,
        data: {
            communities,
            pagination: {
                currentPage: parseInt(page),
                totalPages: Math.ceil(total / parseInt(limit)),
                totalCommunities: total,
                hasNextPage: skip + communities.length < total,
                hasPrevPage: parseInt(page) > 1
            }
        }
    });
});

// ============================================
// JOIN COMMUNITY
// ============================================

export const joinCommunity = asyncHandler(async (req, res, next) => {
    const { communityId } = req.params;
    const userId = req.user._id;

    const community = await Community.findOne({ 
        _id: communityId, 
        isDeleted: false,
        status: "active"
    });

    if (!community) {
        return next(new ErrorHandler("Community not found", 404));
    }

    // Check if already a member
    if (community.isMember(userId)) {
        return next(new ErrorHandler("You are already a member", 400));
    }

    // Check visibility
    if (community.visibility === "invite-only") {
        return next(new ErrorHandler("This community is invite-only", 403));
    }

    if (community.visibility === "private") {
        // Add to pending requests
        const existingRequest = community.pendingRequests.find(
            pr => pr.user.toString() === userId.toString()
        );
        
        if (existingRequest) {
            return next(new ErrorHandler("You already have a pending request", 400));
        }

        community.pendingRequests.push({
            user: userId,
            requestedAt: new Date(),
            message: req.body.message || ""
        });
        await community.save();

        return res.status(200).json({
            success: true,
            message: "Join request submitted. Awaiting approval."
        });
    }

    // Join public community
    await community.addMember(userId);

    await logActivity(
        userId,
        "community_joined",
        `Joined community: ${community.name}`,
        req,
        "community",
        community._id
    );

    res.status(200).json({
        success: true,
        message: "Successfully joined the community"
    });
});

// ============================================
// LEAVE COMMUNITY
// ============================================

export const leaveCommunity = asyncHandler(async (req, res, next) => {
    const { communityId } = req.params;
    const userId = req.user._id;

    const community = await Community.findOne({ 
        _id: communityId, 
        isDeleted: false 
    });

    if (!community) {
        return next(new ErrorHandler("Community not found", 404));
    }

    // Owner cannot leave
    if (community.isOwner(userId)) {
        return next(new ErrorHandler("Owner cannot leave the community. Transfer ownership first.", 400));
    }

    await community.removeMember(userId);

    await logActivity(
        userId,
        "community_left",
        `Left community: ${community.name}`,
        req,
        "community",
        community._id
    );

    res.status(200).json({
        success: true,
        message: "Successfully left the community"
    });
});

// ============================================
// CREATE COMMUNITY
// ============================================

export const createCommunity = asyncHandler(async (req, res, next) => {
    const {
        name,
        description,
        category,
        visibility,
        rules,
        tags,
        settings
    } = req.body;

    // Check if name is unique
    const existingCommunity = await Community.findOne({ 
        name: { $regex: new RegExp(`^${name}$`, "i") },
        isDeleted: false
    });

    if (existingCommunity) {
        return next(new ErrorHandler("A community with this name already exists", 400));
    }

    const community = await Community.create({
        name,
        description,
        category,
        visibility: visibility || "public",
        owner: req.user._id,
        members: [{
            user: req.user._id,
            role: "admin",
            joinedAt: new Date()
        }],
        memberCount: 1,
        rules: rules || [],
        tags: tags || [],
        settings: settings || {},
        createdBy: req.user._id
    });

    await logActivity(
        req.user._id,
        "community_created",
        `Created community: ${name}`,
        req,
        "community",
        community._id
    );

    res.status(201).json({
        success: true,
        message: "Community created successfully",
        data: community
    });
});

// ============================================
// UPDATE COMMUNITY
// ============================================

export const updateCommunity = asyncHandler(async (req, res, next) => {
    const { communityId } = req.params;
    const updateData = req.body;

    const community = await Community.findOne({ 
        _id: communityId, 
        isDeleted: false 
    });

    if (!community) {
        return next(new ErrorHandler("Community not found", 404));
    }

    // Check permission
    const isAdminOrOwner = community.isOwner(req.user._id) || 
        req.user.role === "admin" || 
        req.user.role === "super_admin";

    if (!isAdminOrOwner) {
        return next(new ErrorHandler("You don't have permission to update this community", 403));
    }

    // Update allowed fields
    const allowedUpdates = [
        "name", "description", "category", "visibility",
        "image", "banner", "rules", "tags", "settings"
    ];

    allowedUpdates.forEach(field => {
        if (updateData[field] !== undefined) {
            community[field] = updateData[field];
        }
    });

    community.updatedBy = req.user._id;
    await community.save();

    await logActivity(
        req.user._id,
        "admin_action",
        `Updated community: ${community.name}`,
        req,
        "community",
        community._id
    );

    res.status(200).json({
        success: true,
        message: "Community updated successfully",
        data: community
    });
});

// ============================================
// ADMIN: SUSPEND COMMUNITY
// ============================================

export const suspendCommunity = asyncHandler(async (req, res, next) => {
    const { communityId } = req.params;
    const { reason } = req.body;

    const community = await Community.findOne({ 
        _id: communityId, 
        isDeleted: false 
    });

    if (!community) {
        return next(new ErrorHandler("Community not found", 404));
    }

    await community.suspend(reason, req.user._id);

    await logActivity(
        req.user._id,
        "admin_action",
        `Suspended community: ${community.name}. Reason: ${reason}`,
        req,
        "community",
        community._id
    );

    res.status(200).json({
        success: true,
        message: "Community suspended successfully"
    });
});

// ============================================
// ADMIN: UNSUSPEND COMMUNITY
// ============================================

export const unsuspendCommunity = asyncHandler(async (req, res, next) => {
    const { communityId } = req.params;

    const community = await Community.findOne({ 
        _id: communityId, 
        isDeleted: false 
    });

    if (!community) {
        return next(new ErrorHandler("Community not found", 404));
    }

    await community.unsuspend(req.user._id);

    await logActivity(
        req.user._id,
        "admin_action",
        `Unsuspended community: ${community.name}`,
        req,
        "community",
        community._id
    );

    res.status(200).json({
        success: true,
        message: "Community unsuspended successfully"
    });
});

// ============================================
// ADMIN: DELETE COMMUNITY
// ============================================

export const deleteCommunity = asyncHandler(async (req, res, next) => {
    const { communityId } = req.params;

    const community = await Community.findOne({ 
        _id: communityId, 
        isDeleted: false 
    });

    if (!community) {
        return next(new ErrorHandler("Community not found", 404));
    }

    await community.softDelete(req.user._id);

    await logActivity(
        req.user._id,
        "admin_action",
        `Deleted community: ${community.name}`,
        req,
        "community",
        community._id
    );

    res.status(200).json({
        success: true,
        message: "Community deleted successfully"
    });
});

// ============================================
// ADMIN: GET ALL COMMUNITIES
// ============================================

export const adminGetAllCommunities = asyncHandler(async (req, res, next) => {
    const { 
        page = 1, 
        limit = 10, 
        category, 
        status,
        visibility,
        includeDeleted = false
    } = req.query;

    const query = {};
    
    if (!includeDeleted) query.isDeleted = false;
    if (category) query.category = category;
    if (status) query.status = status;
    if (visibility) query.visibility = visibility;

    const skip = (parseInt(page) - 1) * parseInt(limit);

    const [communities, total] = await Promise.all([
        Community.find(query)
            .sort({ createdAt: -1 })
            .skip(skip)
            .limit(parseInt(limit))
            .populate("owner", "username avatar email")
            .populate("createdBy", "username"),
        Community.countDocuments(query)
    ]);

    res.status(200).json({
        success: true,
        data: {
            communities,
            pagination: {
                currentPage: parseInt(page),
                totalPages: Math.ceil(total / parseInt(limit)),
                totalCommunities: total,
                hasNextPage: skip + communities.length < total,
                hasPrevPage: parseInt(page) > 1
            }
        }
    });
});

// ============================================
// MODERATOR: APPROVE/REJECT JOIN REQUEST
// ============================================

export const handleJoinRequest = asyncHandler(async (req, res, next) => {
    const { communityId, userId } = req.params;
    const { action } = req.body; // "approve" or "reject"

    const community = await Community.findOne({ 
        _id: communityId, 
        isDeleted: false 
    });

    if (!community) {
        return next(new ErrorHandler("Community not found", 404));
    }

    // Check permission
    if (!community.isModerator(req.user._id)) {
        return next(new ErrorHandler("You don't have permission", 403));
    }

    const requestIndex = community.pendingRequests.findIndex(
        pr => pr.user.toString() === userId
    );

    if (requestIndex === -1) {
        return next(new ErrorHandler("Join request not found", 404));
    }

    community.pendingRequests.splice(requestIndex, 1);

    if (action === "approve") {
        await community.addMember(userId);
    }

    await community.save();

    res.status(200).json({
        success: true,
        message: action === "approve" ? "Request approved" : "Request rejected"
    });
});

// ============================================
// ADD/REMOVE MODERATOR
// ============================================

export const manageModerator = asyncHandler(async (req, res, next) => {
    const { communityId, userId } = req.params;
    const { action } = req.body; // "add" or "remove"

    const community = await Community.findOne({ 
        _id: communityId, 
        isDeleted: false 
    });

    if (!community) {
        return next(new ErrorHandler("Community not found", 404));
    }

    // Only owner can manage moderators
    if (!community.isOwner(req.user._id) && req.user.role !== "super_admin") {
        return next(new ErrorHandler("Only owner can manage moderators", 403));
    }

    if (action === "add") {
        await community.addModerator(userId);
    } else if (action === "remove") {
        await community.removeModerator(userId);
    }

    res.status(200).json({
        success: true,
        message: action === "add" ? "Moderator added" : "Moderator removed"
    });
});
