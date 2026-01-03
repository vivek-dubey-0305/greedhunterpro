import mongoose, { Schema } from "mongoose";

// ============================================
// DAILY MISSION SCHEMA DEFINITION
// ============================================

const missionSchema = new Schema({
    title: {
        type: String,
        required: [true, "Mission title is required"],
        trim: true,
        maxlength: [200, "Title cannot exceed 200 characters"]
    },
    description: {
        type: String,
        required: [true, "Description is required"],
        trim: true,
        maxlength: [1000, "Description cannot exceed 1000 characters"]
    },
    category: {
        type: String,
        required: true,
        enum: ["coding", "learning", "social", "engagement", "streak", "daily_login", "quiz", "event", "other"],
        default: "engagement"
    },
    // Rewards
    coinReward: {
        type: Number,
        required: true,
        min: [0, "Coin reward cannot be negative"],
        default: 10
    },
    xpReward: {
        type: Number,
        required: true,
        min: [0, "XP reward cannot be negative"],
        default: 25
    },
    // Target/Progress
    targetValue: {
        type: Number,
        required: true,
        min: [1, "Target value must be at least 1"],
        default: 1
    },
    progressDescription: {
        type: String,
        trim: true,
        maxlength: [200, "Progress description cannot exceed 200 characters"]
    },
    // Tracking
    completionsToday: {
        type: Number,
        default: 0,
        min: 0
    },
    totalCompletions: {
        type: Number,
        default: 0,
        min: 0
    },
    // Daily completions by users
    dailyCompletions: [{
        user: {
            type: Schema.Types.ObjectId,
            ref: "User",
            required: true
        },
        date: {
            type: Date,
            default: Date.now
        },
        progress: {
            type: Number,
            default: 0
        },
        isCompleted: {
            type: Boolean,
            default: false
        },
        completedAt: {
            type: Date
        }
    }],
    // Settings
    resetTime: {
        type: String,
        default: "00:00" // UTC time for daily reset
    },
    isRecurring: {
        type: Boolean,
        default: true
    },
    status: {
        type: String,
        enum: ["active", "inactive"],
        default: "active"
    },
    // Image
    image: {
        public_id: String,
        secure_url: String
    },
    // Ordering
    order: {
        type: Number,
        default: 0
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

missionSchema.index({ category: 1 });
missionSchema.index({ status: 1 });
missionSchema.index({ isRecurring: 1 });
missionSchema.index({ order: 1 });
missionSchema.index({ createdBy: 1 });
missionSchema.index({ isDeleted: 1 });
missionSchema.index({ "dailyCompletions.user": 1 });
missionSchema.index({ "dailyCompletions.date": 1 });

// ============================================
// INSTANCE METHODS
// ============================================

// Get user's today completion status
missionSchema.methods.getUserTodayCompletion = function(userId) {
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    
    return this.dailyCompletions.find(dc => 
        dc.user.toString() === userId.toString() &&
        new Date(dc.date).setHours(0, 0, 0, 0) === today.getTime()
    );
};

// Check if user completed today
missionSchema.methods.isCompletedTodayByUser = function(userId) {
    const todayCompletion = this.getUserTodayCompletion(userId);
    return todayCompletion?.isCompleted || false;
};

// Update user progress for today
missionSchema.methods.updateUserProgress = async function(userId, progressIncrement = 1) {
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    
    let todayCompletion = this.dailyCompletions.find(dc =>
        dc.user.toString() === userId.toString() &&
        new Date(dc.date).setHours(0, 0, 0, 0) === today.getTime()
    );
    
    if (!todayCompletion) {
        todayCompletion = {
            user: userId,
            date: new Date(),
            progress: progressIncrement,
            isCompleted: progressIncrement >= this.targetValue
        };
        this.dailyCompletions.push(todayCompletion);
    } else {
        if (todayCompletion.isCompleted) {
            return { alreadyCompleted: true, mission: this };
        }
        todayCompletion.progress += progressIncrement;
    }
    
    // Check completion
    if (todayCompletion.progress >= this.targetValue && !todayCompletion.isCompleted) {
        todayCompletion.isCompleted = true;
        todayCompletion.completedAt = new Date();
        this.completionsToday += 1;
        this.totalCompletions += 1;
    }
    
    await this.save();
    return { alreadyCompleted: false, mission: this };
};

// Reset daily completions (called by cron job)
missionSchema.methods.resetDailyCompletions = async function() {
    this.completionsToday = 0;
    // Keep historical data but mark as new day
    return this.save();
};

// Soft delete
missionSchema.methods.softDelete = function(deletedBy) {
    this.isDeleted = true;
    this.deletedAt = new Date();
    this.deletedBy = deletedBy;
    return this.save();
};

// ============================================
// STATIC METHODS
// ============================================

// Get active missions
missionSchema.statics.getActiveMissions = function() {
    return this.find({
        isDeleted: false,
        status: "active"
    }).sort({ order: 1 });
};

// Reset all daily completions (cron job)
missionSchema.statics.resetAllDailyCompletions = async function() {
    return this.updateMany(
        { isDeleted: false },
        { $set: { completionsToday: 0 } }
    );
};

// ============================================
// EXPORT
// ============================================

export const Mission = mongoose.model("Mission", missionSchema);
