import mongoose, { Schema } from "mongoose";

// ============================================
// CHALLENGE SCHEMA DEFINITION
// ============================================

const challengeSchema = new Schema({
    title: {
        type: String,
        required: [true, "Challenge title is required"],
        trim: true,
        maxlength: [200, "Title cannot exceed 200 characters"]
    },
    description: {
        type: String,
        required: [true, "Description is required"],
        trim: true,
        maxlength: [2000, "Description cannot exceed 2000 characters"]
    },
    type: {
        type: String,
        required: true,
        enum: ["daily", "weekly", "monthly", "special"],
        default: "daily"
    },
    difficulty: {
        type: String,
        required: true,
        enum: ["easy", "medium", "hard", "expert"],
        default: "easy"
    },
    category: {
        type: String,
        required: true,
        enum: ["coding", "learning", "social", "engagement", "streak", "quiz", "event", "other"],
        default: "other"
    },
    // Rewards
    coinReward: {
        type: Number,
        required: true,
        min: [0, "Coin reward cannot be negative"],
        default: 100
    },
    xpReward: {
        type: Number,
        required: true,
        min: [0, "XP reward cannot be negative"],
        default: 200
    },
    // Requirements
    requirements: {
        type: String,
        required: true,
        trim: true,
        maxlength: [500, "Requirements cannot exceed 500 characters"]
    },
    targetValue: {
        type: Number,
        required: true,
        min: [1, "Target value must be at least 1"],
        default: 1
    },
    // Completion tracking
    completions: {
        type: Number,
        default: 0,
        min: 0
    },
    maxCompletions: {
        type: Number,
        default: 0, // 0 = unlimited
        min: 0
    },
    // User completions
    userCompletions: [{
        user: {
            type: Schema.Types.ObjectId,
            ref: "User",
            required: true
        },
        completedAt: {
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
        }
    }],
    // Schedule
    startDate: {
        type: Date,
        required: true
    },
    endDate: {
        type: Date,
        required: true,
        validate: {
            validator: function(value) {
                return value > this.startDate;
            },
            message: "End date must be after start date"
        }
    },
    // Status
    status: {
        type: String,
        enum: ["active", "inactive", "expired"],
        default: "active"
    },
    // Image
    image: {
        public_id: String,
        secure_url: String
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

challengeSchema.index({ type: 1 });
challengeSchema.index({ difficulty: 1 });
challengeSchema.index({ category: 1 });
challengeSchema.index({ status: 1 });
challengeSchema.index({ startDate: 1 });
challengeSchema.index({ endDate: 1 });
challengeSchema.index({ createdBy: 1 });
challengeSchema.index({ isDeleted: 1 });
challengeSchema.index({ "userCompletions.user": 1 });

// ============================================
// PRE-SAVE HOOKS
// ============================================

challengeSchema.pre("save", function() {
    const now = new Date();
    
    if (this.status === "inactive") return;
    
    if (now > this.endDate) {
        this.status = "expired";
    } else if (now >= this.startDate && now <= this.endDate) {
        this.status = "active";
    }
});

// ============================================
// INSTANCE METHODS
// ============================================

// Check if user completed the challenge
challengeSchema.methods.isCompletedByUser = function(userId) {
    const userCompletion = this.userCompletions.find(
        uc => uc.user.toString() === userId.toString()
    );
    return userCompletion?.isCompleted || false;
};

// Get user progress
challengeSchema.methods.getUserProgress = function(userId) {
    const userCompletion = this.userCompletions.find(
        uc => uc.user.toString() === userId.toString()
    );
    return userCompletion?.progress || 0;
};

// Update user progress
challengeSchema.methods.updateUserProgress = async function(userId, progress) {
    let userCompletion = this.userCompletions.find(
        uc => uc.user.toString() === userId.toString()
    );
    
    if (!userCompletion) {
        this.userCompletions.push({
            user: userId,
            progress: progress,
            isCompleted: progress >= this.targetValue
        });
    } else {
        userCompletion.progress = progress;
        if (progress >= this.targetValue && !userCompletion.isCompleted) {
            userCompletion.isCompleted = true;
            userCompletion.completedAt = new Date();
            this.completions += 1;
        }
    }
    
    return this.save();
};

// Soft delete
challengeSchema.methods.softDelete = function(deletedBy) {
    this.isDeleted = true;
    this.deletedAt = new Date();
    this.deletedBy = deletedBy;
    return this.save();
};

// ============================================
// STATIC METHODS
// ============================================

// Get active challenges
challengeSchema.statics.getActiveChallenges = function(type = null) {
    const query = {
        isDeleted: false,
        status: "active"
    };
    
    if (type) {
        query.type = type;
    }
    
    return this.find(query).sort({ startDate: -1 });
};

// ============================================
// EXPORT
// ============================================

export const Challenge = mongoose.model("Challenge", challengeSchema);
