import mongoose, { Schema } from "mongoose";

// ============================================
// ACTIVITY SCHEMA (SUB-SCHEMA FOR ACTIVITIES ARRAY)
// ============================================

const activitySchema = new Schema({
    event_type: {
        type: String,
        required: true,
        enum: [
            "user_registered",
            "user_login",
            "user_logout",
            "profile_updated",
            "password_changed",
            "email_verified",
            "phone_verified",
            "quiz_created",
            "quiz_started",
            "quiz_completed",
            "quiz_won",
            "event_created",
            "event_joined",
            "event_completed",
            "event_won",
            "coins_earned",
            "coins_spent",
            "bonus_received",
            "refund_processed",
            "wallet_frozen",
            "wallet_unfrozen",
            "post_created",
            "post_saved",
            "comment_added",
            "community_joined",
            "user_followed",
            "user_unfollowed",
            "search_performed",
            "report_submitted",
            "admin_action",
            "register",
            "login",
            "logout",
            "verify-otp",
            "reset-password",
            "change-password",
            "update-profile",
            "avatar",
            "delete-user",
            "follow",
            "unfollow"
        ]
    },
    description: {
        type: String,
        default: ""
    },
    entity_type: {
        type: String,
        enum: ["user", "quiz", "event", "post", "comment", "community", "wallet"]
    },
    entity_id: {
        type: Schema.Types.ObjectId
    },
    session_id: {
        type: String
    },
    props: {
        geo_location: {
            type: String
        },
        ip_address: {
            type: String
        },
        device: {
            type: String
        },
        browser: {
            type: String
        },
        platform: {
            type: String
        }
    },
    createdAt: {
        type: Date,
        default: Date.now
    },
    updatedAt: {
        type: Date,
        default: Date.now
    }
});

// ============================================
// ACTIVITY LOG SCHEMA DEFINITION
// ============================================

const activityLogSchema = new Schema({
    user_id: {
        type: Schema.Types.ObjectId,
        ref: "User",
        required: true
    },
    activities: [activitySchema],
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

// Remove duplicate user_id index since unique: true already creates it
activityLogSchema.index({ user_id: 1 }, { unique: true });
activityLogSchema.index({ "activities.event_type": 1 });
activityLogSchema.index({ "activities.createdAt": -1 });
activityLogSchema.index({ isDeleted: 1 });

// Compound index for efficient queries
activityLogSchema.index({ user_id: 1, "activities.event_type": 1, "activities.createdAt": -1 });

// ============================================
// PRE-SAVE HOOKS
// ============================================

// Sanitize sensitive data in activities
// activityLogSchema.pre("save", function (next) {
//     if (this.activities && Array.isArray(this.activities)) {
//         this.activities.forEach(activity => {
//             if (activity.props && typeof activity.props === 'object') {
//                 // Remove sensitive information
//                 const sensitiveKeys = ['password', 'token', 'secret', 'key'];
//                 sensitiveKeys.forEach(key => {
//                     if (activity.props[key]) {
//                         delete activity.props[key];
//                     }
//                 });
//             }
//         });
//     }
//     next();
// });
activityLogSchema.pre("save", function () {
    if (!this.activities || !Array.isArray(this.activities)) {
      console.warn("No activities to sanitize.");
      throw new Error("Activities must be an array.");
    }
    
    const sensitiveKeys = ['password', 'token', 'secret', 'key', 'refreshToken', 
                          'accessToken', 'authorization', 'apiKey', 'privateKey'];
    
    // Normalize keys to lowercase for case-insensitive matching
    const normalizedSensitiveKeys = sensitiveKeys.map(key => key.toLowerCase());
    
    this.activities.forEach(activity => {
        if (!activity.props || typeof activity.props !== 'object') return;
        
        // Recursive function to clean nested objects
        const cleanSensitiveData = (obj) => {
            for (const key in obj) {
                if (obj.hasOwnProperty(key)) {
                    const lowerKey = key.toLowerCase();
                    
                    // Check if key contains any sensitive word
                    const isSensitive = normalizedSensitiveKeys.some(sensitiveKey => 
                        lowerKey.includes(sensitiveKey)
                    );
                    
                    if (isSensitive) {
                        obj[key] = '[REDACTED]'; // Replace instead of delete
                    } else if (typeof obj[key] === 'object' && obj[key] !== null) {
                        cleanSensitiveData(obj[key]);
                    }
                }
            }
        };
        
        cleanSensitiveData(activity.props);
    });
 
});
// ============================================
// INSTANCE METHODS
// ============================================

// Add a new activity
activityLogSchema.methods.addActivity = function (activityData) {
    this.activities.push({
        ...activityData,
        createdAt: new Date(),
        updatedAt: new Date()
    });
    return this.save();
};

// Get activities with pagination
activityLogSchema.methods.getActivities = function (page = 1, limit = 20, eventType = null) {
    let activities = this.activities.sort((a, b) => b.createdAt - a.createdAt);

    if (eventType) {
        activities = activities.filter(activity => activity.event_type === eventType);
    }

    const startIndex = (page - 1) * limit;
    const endIndex = startIndex + limit;

    return {
        activities: activities.slice(startIndex, endIndex),
        totalActivities: activities.length,
        currentPage: page,
        totalPages: Math.ceil(activities.length / limit)
    };
};

// Soft delete method
activityLogSchema.methods.softDelete = function () {
    this.isDeleted = true;
    this.deletedAt = new Date();
    return this.save();
};

// ============================================
// STATIC METHODS
// ============================================

// Get activity log for a user
activityLogSchema.statics.getUserActivityLog = function (userId) {
    return this.findOne({ user_id: userId, isDeleted: false });
};

// Get activities for a user with pagination
activityLogSchema.statics.getUserActivities = function (userId, page = 1, limit = 20, eventType = null) {
    return this.aggregate([
        { $match: { user_id: mongoose.Types.ObjectId(userId), isDeleted: false } },
        { $unwind: "$activities" },
        ...(eventType ? [{ $match: { "activities.event_type": eventType } }] : []),
        { $sort: { "activities.createdAt": -1 } },
        { $skip: (page - 1) * limit },
        { $limit: limit },
        {
            $group: {
                _id: "$_id",
                user_id: { $first: "$user_id" },
                activities: { $push: "$activities" },
                totalActivities: { $sum: 1 }
            }
        }
    ]);
};

// Count activities by user and date range
activityLogSchema.statics.countUserActivitiesInDateRange = function (userId, startDate, endDate) {
    return this.aggregate([
        { $match: { user_id: mongoose.Types.ObjectId(userId), isDeleted: false } },
        { $unwind: "$activities" },
        { $match: { "activities.createdAt": { $gte: startDate, $lte: endDate } } },
        { $count: "total" }
    ]);
};

// ============================================
// VIRTUALS
// ============================================

// Virtual for total activities count
activityLogSchema.virtual('totalActivities').get(function () {
    return this.activities.length;
});

// Virtual for latest activity
activityLogSchema.virtual('latestActivity').get(function () {
    if (this.activities.length === 0) return null;
    return this.activities.sort((a, b) => b.createdAt - a.createdAt)[0];
});

// ============================================
// EXPORT
// ============================================

export const ActivityLog = mongoose.model("ActivityLog", activityLogSchema);