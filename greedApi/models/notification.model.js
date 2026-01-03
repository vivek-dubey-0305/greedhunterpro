import mongoose, { Schema } from "mongoose";

// ============================================
// NOTIFICATION SCHEMA DEFINITION
// ============================================

const notificationSchema = new Schema({
    title: {
        type: String,
        required: [true, "Notification title is required"],
        trim: true,
        maxlength: [200, "Title cannot exceed 200 characters"]
    },
    message: {
        type: String,
        required: [true, "Message is required"],
        trim: true,
        maxlength: [2000, "Message cannot exceed 2000 characters"]
    },
    type: {
        type: String,
        required: true,
        enum: ["info", "success", "warning", "error", "promotion", "system", "achievement", "reminder"],
        default: "info"
    },
    // Targeting
    target: {
        type: String,
        required: true,
        enum: ["all", "premium", "free", "specific", "role_admin", "role_user"],
        default: "all"
    },
    targetUsers: [{
        type: Schema.Types.ObjectId,
        ref: "User"
    }],
    targetCount: {
        type: Number,
        default: 0,
        min: 0
    },
    // Status
    status: {
        type: String,
        enum: ["draft", "scheduled", "sent", "cancelled"],
        default: "draft"
    },
    // Scheduling
    scheduledAt: {
        type: Date
    },
    sentAt: {
        type: Date
    },
    // Tracking
    readBy: [{
        user: {
            type: Schema.Types.ObjectId,
            ref: "User"
        },
        readAt: {
            type: Date,
            default: Date.now
        }
    }],
    readCount: {
        type: Number,
        default: 0,
        min: 0
    },
    // Action (optional link/action button)
    action: {
        label: {
            type: String,
            trim: true
        },
        url: {
            type: String,
            trim: true
        },
        type: {
            type: String,
            enum: ["link", "route", "action", null],
            default: null
        }
    },
    // Priority
    priority: {
        type: String,
        enum: ["low", "normal", "high", "urgent"],
        default: "normal"
    },
    // Expiry
    expiresAt: {
        type: Date
    },
    // Metadata
    metadata: {
        type: Schema.Types.Mixed,
        default: {}
    },
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

notificationSchema.index({ type: 1 });
notificationSchema.index({ target: 1 });
notificationSchema.index({ status: 1 });
notificationSchema.index({ scheduledAt: 1 });
notificationSchema.index({ sentAt: -1 });
notificationSchema.index({ priority: 1 });
notificationSchema.index({ targetUsers: 1 });
notificationSchema.index({ "readBy.user": 1 });
notificationSchema.index({ createdBy: 1 });
notificationSchema.index({ isDeleted: 1 });
notificationSchema.index({ expiresAt: 1 });

// ============================================
// INSTANCE METHODS
// ============================================

// Mark as read by user
notificationSchema.methods.markAsRead = async function(userId) {
    const alreadyRead = this.readBy.some(r => r.user.toString() === userId.toString());
    
    if (!alreadyRead) {
        this.readBy.push({
            user: userId,
            readAt: new Date()
        });
        this.readCount += 1;
        return this.save();
    }
    
    return this;
};

// Check if read by user
notificationSchema.methods.isReadByUser = function(userId) {
    return this.readBy.some(r => r.user.toString() === userId.toString());
};

// Send notification
notificationSchema.methods.send = async function() {
    if (this.status === "sent") {
        throw new Error("Notification already sent");
    }
    
    this.status = "sent";
    this.sentAt = new Date();
    
    return this.save();
};

// Schedule notification
notificationSchema.methods.schedule = async function(scheduleTime) {
    if (scheduleTime <= new Date()) {
        throw new Error("Scheduled time must be in the future");
    }
    
    this.status = "scheduled";
    this.scheduledAt = scheduleTime;
    
    return this.save();
};

// Cancel notification
notificationSchema.methods.cancel = async function() {
    if (this.status === "sent") {
        throw new Error("Cannot cancel sent notification");
    }
    
    this.status = "cancelled";
    return this.save();
};

// Soft delete
notificationSchema.methods.softDelete = function(deletedBy) {
    this.isDeleted = true;
    this.deletedAt = new Date();
    this.deletedBy = deletedBy;
    return this.save();
};

// ============================================
// STATIC METHODS
// ============================================

// Get notifications for user
notificationSchema.statics.getForUser = async function(userId, options = {}) {
    const { page = 1, limit = 20, unreadOnly = false } = options;
    
    const query = {
        isDeleted: false,
        status: "sent",
        $or: [
            { target: "all" },
            { targetUsers: userId }
        ],
        $and: [
            {
                $or: [
                    { expiresAt: { $exists: false } },
                    { expiresAt: null },
                    { expiresAt: { $gt: new Date() } }
                ]
            }
        ]
    };
    
    if (unreadOnly) {
        query["readBy.user"] = { $ne: userId };
    }
    
    const notifications = await this.find(query)
        .sort({ sentAt: -1 })
        .skip((page - 1) * limit)
        .limit(limit)
        .lean();
    
    // Add isRead flag
    return notifications.map(n => ({
        ...n,
        isRead: n.readBy?.some(r => r.user.toString() === userId.toString()) || false
    }));
};

// Get unread count for user
notificationSchema.statics.getUnreadCount = async function(userId) {
    return this.countDocuments({
        isDeleted: false,
        status: "sent",
        $or: [
            { target: "all" },
            { targetUsers: userId }
        ],
        "readBy.user": { $ne: userId },
        $or: [
            { expiresAt: { $exists: false } },
            { expiresAt: null },
            { expiresAt: { $gt: new Date() } }
        ]
    });
};

// Get scheduled notifications to send
notificationSchema.statics.getScheduledToSend = function() {
    return this.find({
        isDeleted: false,
        status: "scheduled",
        scheduledAt: { $lte: new Date() }
    });
};

// Mark all as read for user
notificationSchema.statics.markAllAsRead = async function(userId) {
    const notifications = await this.find({
        isDeleted: false,
        status: "sent",
        $or: [
            { target: "all" },
            { targetUsers: userId }
        ],
        "readBy.user": { $ne: userId }
    });
    
    const promises = notifications.map(n => n.markAsRead(userId));
    return Promise.all(promises);
};

// ============================================
// EXPORT
// ============================================

export const Notification = mongoose.model("Notification", notificationSchema);
