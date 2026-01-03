import mongoose, { Schema } from "mongoose";

// ============================================
// QUIZ SCHEMA DEFINITION
// ============================================

const quizSchema = new Schema({
    title: {
        type: String,
        required: true,
        trim: true,
        maxlength: [200, "Title cannot be more than 200 characters"]
    },
    description: {
        type: String,
        required: true,
        trim: true,
        maxlength: [1000, "Description cannot be more than 1000 characters"]
    },
    options: [{
        type: String,
        required: true,
        trim: true
    }],
    correctAnswer: {
        type: String,
        required: true,
        trim: true
    },
    difficulty: {
        type: String,
        required: true,
        enum: ["easy", "medium", "hard"],
        default: "medium"
    },
    tags: [{
        type: String,
        trim: true,
        lowercase: true
    }],
    timeLimit: {
        type: Number, // in minutes
        required: true,
        min: [1, "Time limit must be at least 1 minute"],
        max: [120, "Time limit cannot exceed 120 minutes"]
    },
    maxParticipants: {
        type: Number,
        required: true,
        min: [1, "Max participants must be at least 1"],
        max: [10000, "Max participants cannot exceed 10,000"]
    },
    expectedCompletionTime: {
        type: Number, // in minutes
        min: [1, "Expected completion time must be at least 1 minute"]
    },
    createdBy: {
        type: Schema.Types.ObjectId,
        ref: "User",
        required: true
    },
    participants: [{
        user: {
            type: Schema.Types.ObjectId,
            ref: "User",
            required: true
        },
        timeTaken: {
            type: Number, // in minutes
            required: true
        },
        scoreObtained: {
            type: Number,
            required: true,
            min: 0
        },
        finalScore: {
            type: Number,
            required: true,
            min: 0
        },
        submittedAt: {
            type: Date,
            default: Date.now
        }
    }],
    winner: {
        type: Schema.Types.ObjectId,
        ref: "User"
    },
    startTime: {
        type: Date,
        required: true
    },
    endTime: {
        type: Date,
        required: true,
        validate: {
            validator: function (value) {
                return value > this.startTime;
            },
            message: "End time must be after start time"
        }
    },
    baseScore: {
        type: Number,
        required: true,
        min: 0
    },
    difficultyMultiplier: {
        type: Number,
        required: true,
        min: 0.1,
        max: 5
    },
    status: {
        type: String,
        enum: ["upcoming", "ongoing", "completed"],
        default: "upcoming"
    },
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

quizSchema.index({ createdBy: 1 });
quizSchema.index({ status: 1 });
quizSchema.index({ startTime: 1 });
quizSchema.index({ endTime: 1 });
quizSchema.index({ tags: 1 });
quizSchema.index({ difficulty: 1 });
quizSchema.index({ isDeleted: 1 });

// ============================================
// PRE-SAVE HOOKS
// ============================================

// Update status based on current time
// quizSchema.pre("save", function (next) {
//     const now = new Date();
//     if (now < this.startTime) {
//         this.status = "upcoming";
//     } else if (now >= this.startTime && now <= this.endTime) {
//         this.status = "ongoing";
//     } else {
//         this.status = "completed";
//     }
//     next();
// });
quizSchema.pre("save", async function () {
    const now = new Date();
    
    // Guard against missing dates
    if (!this.startTime || !this.endTime) {
        console.error("Start time or end time is missing");
        throw new Error("Start time and end time must be defined");
    }
    
    if (now < this.startTime) {
        this.status = "upcoming";
    } else if (now >= this.startTime && now <= this.endTime) {
        this.status = "ongoing";
    } else {
        this.status = "completed";
    }
});
// ============================================
// INSTANCE METHODS
// ============================================

// Calculate final score using formula: B(1 - [t/l])^k
quizSchema.methods.calculateScore = function (timeTaken, baseScore, difficultyMultiplier) {
    const t = timeTaken;
    const l = this.timeLimit;
    const k = difficultyMultiplier || this.difficultyMultiplier;
    const B = baseScore || this.baseScore;

    if (t > l) return 0; // No score if exceeded time limit

    const score = B * Math.pow((1 - (t / l)), k);
    return Math.max(0, Math.round(score * 100) / 100); // Round to 2 decimal places
};

// Add participant
quizSchema.methods.addParticipant = function (userId, timeTaken, scoreObtained) {
    const finalScore = this.calculateScore(timeTaken, this.baseScore, this.difficultyMultiplier);

    this.participants.push({
        user: userId,
        timeTaken,
        scoreObtained,
        finalScore,
        submittedAt: new Date()
    });

    // Update winner if this participant has the highest score
    if (!this.winner || finalScore > this.getHighestScore()) {
        this.winner = userId;
    }

    return this.save();
};

// Get highest score
quizSchema.methods.getHighestScore = function () {
    if (this.participants.length === 0) return 0;
    return Math.max(...this.participants.map(p => p.finalScore));
};

// Soft delete method
quizSchema.methods.softDelete = function () {
    this.isDeleted = true;
    this.deletedAt = new Date();
    return this.save();
};

// ============================================
// VIRTUALS
// ============================================

// Virtual for duration in minutes
quizSchema.virtual('duration').get(function () {
    return Math.round((this.endTime - this.startTime) / (1000 * 60));
});

// Virtual for current participant count
quizSchema.virtual('currentParticipants').get(function () {
    return this.participants.length;
});

// ============================================
// EXPORT
// ============================================

export const Quiz = mongoose.model("Quiz", quizSchema);
