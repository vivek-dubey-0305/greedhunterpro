import mongoose, { Schema } from "mongoose";

// ============================================
// COMMUNITY SCHEMA DEFINITION
// ============================================

const communitySchema = new Schema({
    name: {
        type: String,
        required: [true, "Community name is required"],
        trim: true,
        unique: true,
        maxlength: [100, "Name cannot exceed 100 characters"]
    },
    slug: {
        type: String,
        unique: true,
        lowercase: true,
        trim: true
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
        enum: ["programming", "gaming", "design", "general", "tech", "learning", "sports", "music", "art", "other"],
        default: "general"
    },
    visibility: {
        type: String,
        required: true,
        enum: ["public", "private", "invite-only"],
        default: "public"
    },
    // Image/Banner
    image: {
        public_id: String,
        secure_url: String
    },
    banner: {
        public_id: String,
        secure_url: String
    },
    // Members
    owner: {
        type: Schema.Types.ObjectId,
        ref: "User",
        required: true
    },
    moderators: [{
        type: Schema.Types.ObjectId,
        ref: "User"
    }],
    members: [{
        user: {
            type: Schema.Types.ObjectId,
            ref: "User",
            required: true
        },
        role: {
            type: String,
            enum: ["member", "moderator", "admin"],
            default: "member"
        },
        joinedAt: {
            type: Date,
            default: Date.now
        }
    }],
    memberCount: {
        type: Number,
        default: 0,
        min: 0
    },
    // Posts
    postCount: {
        type: Number,
        default: 0,
        min: 0
    },
    // Rules
    rules: [{
        title: {
            type: String,
            required: true,
            trim: true,
            maxlength: [200, "Rule title cannot exceed 200 characters"]
        },
        description: {
            type: String,
            trim: true,
            maxlength: [500, "Rule description cannot exceed 500 characters"]
        }
    }],
    // Settings
    settings: {
        allowPosts: {
            type: Boolean,
            default: true
        },
        requirePostApproval: {
            type: Boolean,
            default: false
        },
        allowInvites: {
            type: Boolean,
            default: true
        },
        minLevelToJoin: {
            type: Number,
            default: 0,
            min: 0
        }
    },
    // Pending invites/requests
    pendingRequests: [{
        user: {
            type: Schema.Types.ObjectId,
            ref: "User"
        },
        requestedAt: {
            type: Date,
            default: Date.now
        },
        message: String
    }],
    // Status
    status: {
        type: String,
        enum: ["active", "suspended", "archived"],
        default: "active"
    },
    suspensionReason: {
        type: String,
        trim: true
    },
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

communitySchema.index({ name: 1 });
communitySchema.index({ slug: 1 });
communitySchema.index({ category: 1 });
communitySchema.index({ visibility: 1 });
communitySchema.index({ status: 1 });
communitySchema.index({ owner: 1 });
communitySchema.index({ "members.user": 1 });
communitySchema.index({ memberCount: -1 });
communitySchema.index({ tags: 1 });
communitySchema.index({ isDeleted: 1 });
communitySchema.index({ createdAt: -1 });

// ============================================
// PRE-SAVE HOOKS
// ============================================

communitySchema.pre("save", function(next) {
    // Generate slug from name
    if (this.isModified("name") || !this.slug) {
        this.slug = this.name
            .toLowerCase()
            .replace(/[^a-z0-9]+/g, "-")
            .replace(/(^-|-$)/g, "");
    }
    next();
});

// ============================================
// INSTANCE METHODS
// ============================================

// Check if user is member
communitySchema.methods.isMember = function(userId) {
    return this.members.some(m => m.user.toString() === userId.toString());
};

// Check if user is moderator
communitySchema.methods.isModerator = function(userId) {
    return this.moderators.some(m => m.toString() === userId.toString()) ||
           this.owner.toString() === userId.toString();
};

// Check if user is owner
communitySchema.methods.isOwner = function(userId) {
    return this.owner.toString() === userId.toString();
};

// Add member
communitySchema.methods.addMember = async function(userId, role = "member") {
    if (this.isMember(userId)) {
        throw new Error("User is already a member");
    }
    
    this.members.push({
        user: userId,
        role: role,
        joinedAt: new Date()
    });
    this.memberCount += 1;
    
    return this.save();
};

// Remove member
communitySchema.methods.removeMember = async function(userId) {
    const memberIndex = this.members.findIndex(
        m => m.user.toString() === userId.toString()
    );
    
    if (memberIndex === -1) {
        throw new Error("User is not a member");
    }
    
    this.members.splice(memberIndex, 1);
    this.memberCount -= 1;
    
    // Also remove from moderators if applicable
    const modIndex = this.moderators.indexOf(userId);
    if (modIndex > -1) {
        this.moderators.splice(modIndex, 1);
    }
    
    return this.save();
};

// Add moderator
communitySchema.methods.addModerator = async function(userId) {
    if (!this.isMember(userId)) {
        throw new Error("User must be a member first");
    }
    
    if (this.isModerator(userId)) {
        throw new Error("User is already a moderator");
    }
    
    this.moderators.push(userId);
    
    // Update member role
    const member = this.members.find(m => m.user.toString() === userId.toString());
    if (member) {
        member.role = "moderator";
    }
    
    return this.save();
};

// Remove moderator
communitySchema.methods.removeModerator = async function(userId) {
    const modIndex = this.moderators.findIndex(m => m.toString() === userId.toString());
    
    if (modIndex === -1) {
        throw new Error("User is not a moderator");
    }
    
    this.moderators.splice(modIndex, 1);
    
    // Update member role
    const member = this.members.find(m => m.user.toString() === userId.toString());
    if (member) {
        member.role = "member";
    }
    
    return this.save();
};

// Suspend community
communitySchema.methods.suspend = async function(reason, suspendedBy) {
    this.status = "suspended";
    this.suspensionReason = reason;
    this.updatedBy = suspendedBy;
    return this.save();
};

// Unsuspend community
communitySchema.methods.unsuspend = async function(unsuspendedBy) {
    this.status = "active";
    this.suspensionReason = null;
    this.updatedBy = unsuspendedBy;
    return this.save();
};

// Soft delete
communitySchema.methods.softDelete = function(deletedBy) {
    this.isDeleted = true;
    this.deletedAt = new Date();
    this.deletedBy = deletedBy;
    return this.save();
};

// ============================================
// STATIC METHODS
// ============================================

// Get public communities
communitySchema.statics.getPublicCommunities = function(options = {}) {
    const { page = 1, limit = 10, category, sortBy = "memberCount" } = options;
    
    const query = {
        isDeleted: false,
        status: "active",
        visibility: "public"
    };
    
    if (category) {
        query.category = category;
    }
    
    return this.find(query)
        .sort({ [sortBy]: -1 })
        .skip((page - 1) * limit)
        .limit(limit)
        .populate("owner", "username avatar");
};

// Search communities
communitySchema.statics.searchCommunities = function(searchTerm, options = {}) {
    const { page = 1, limit = 10 } = options;
    
    return this.find({
        isDeleted: false,
        status: "active",
        $or: [
            { name: { $regex: searchTerm, $options: "i" } },
            { description: { $regex: searchTerm, $options: "i" } },
            { tags: { $in: [new RegExp(searchTerm, "i")] } }
        ]
    })
    .sort({ memberCount: -1 })
    .skip((page - 1) * limit)
    .limit(limit)
    .populate("owner", "username avatar");
};

// ============================================
// EXPORT
// ============================================

export const Community = mongoose.model("Community", communitySchema);
