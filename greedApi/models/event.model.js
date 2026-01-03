import mongoose, { Schema } from "mongoose";
import crypto from "crypto";

// ============================================
// EVENT SCHEMA DEFINITION
// ============================================
// 
// This schema represents an EVENT CARD - a container that holds:
// - Event metadata (name, description, rules, schedule)
// - Policies (reward policy, return/refund policy)
// - Enrollment data (participants list)
// - Access configuration (secure external link for gameplay)
//
// The ACTUAL CONTENT (quiz questions, hackathon challenges, scavenger clues)
// is stored in SEPARATE COLLECTIONS and referenced via `content.ref`
//
// FLOW:
// 1. Admin creates event with metadata, policies, schedule
// 2. Admin creates actual content in separate DB (Quiz, Hackathon, ScavengerHunt, etc.)
// 3. Admin links content to event via `content.ref` and `content.model`
// 4. Users view event card on GreedHunter, read policies, enroll
// 5. 1 minute before start time, secure `accessLink` becomes active
// 6. User clicks link → opens NEW TAB with secure token-based URL
// 7. User plays the event on external/secure page
// 8. Results sync back → rewards distributed based on rewardPolicy
// 9. Refunds processed based on returnPolicy (if applicable)
//
// ============================================

const eventSchema = new Schema({
    // ============================================
    // BASIC INFO
    // ============================================
    name: {
        type: String,
        required: true,
        trim: true,
        maxlength: [200, "Event name cannot be more than 200 characters"]
    },
    slug: {
        type: String,
        unique: true,
        lowercase: true,
        trim: true
    },
    category: {
        type: String,
        required: true,
        trim: true,
        enum: ["workshop", "hackathon", "competition", "bootcamp", "meetup", "webinar", "quiz", "game", "task", "marathon", "ctf", "osint", "scavenger-hunt", "coding-challenge", "design-challenge", "other"],
        default: "other"
    },
    // Type defines WHERE the event happens
    type: {
        type: String,
        required: true,
        trim: true,
        enum: ["online", "offline", "hybrid"],
        default: "online"
    },
    description: {
        type: String,
        required: true,
        trim: true,
        maxlength: [5000, "Description cannot be more than 5000 characters"]
    },
    shortDescription: {
        type: String,
        trim: true,
        maxlength: [300, "Short description cannot be more than 300 characters"]
    },
    rules: {
        type: String,
        trim: true,
        maxlength: [5000, "Rules cannot be more than 5000 characters"],
        default: ""
    },
    
    // ============================================
    // CONTENT REFERENCE
    // ============================================
    // The actual event content (quiz questions, hackathon details, etc.)
    // is stored in a SEPARATE collection and referenced here
    content: {
        // The MongoDB model name where actual content is stored
        // e.g., "Quiz", "Hackathon", "ScavengerHunt", "CodingChallenge", "OSINTChallenge"
        model: {
            type: String,
            enum: ["Quiz", "Hackathon", "ScavengerHunt", "CodingChallenge", "OSINTChallenge", "DesignChallenge", "CTFChallenge", "Custom"],
            default: "Custom"
        },
        // Reference ID to the actual content document
        ref: {
            type: Schema.Types.ObjectId,
            refPath: "content.model"
        },
        // For custom/external events, store the base URL
        externalBaseUrl: {
            type: String,
            trim: true
        }
    },

    // ============================================
    // ACCESS LINK CONFIGURATION
    // ============================================
    // Secure link configuration for gameplay
    // Users enroll on GreedHunter but PLAY on this secure link
    accessLink: {
        // Base URL where the event is hosted (can be same domain or external)
        baseUrl: {
            type: String,
            trim: true,
            default: ""
        },
        // Secret key for generating secure tokens (auto-generated)
        secretKey: {
            type: String,
            select: false // Never expose this
        },
        // How many minutes before start time the link becomes active
        activationMinutes: {
            type: Number,
            default: 1, // Link activates 1 minute before start
            min: 0,
            max: 60
        },
        // How many minutes after end time the link expires
        expirationMinutes: {
            type: Number,
            default: 5, // Link expires 5 minutes after end
            min: 0
        },
        // Whether to open in new tab (recommended for security)
        openInNewTab: {
            type: Boolean,
            default: true
        },
        // Additional security options
        security: {
            // Require email verification before access
            requireEmailVerification: { type: Boolean, default: false },
            // Require phone verification before access
            requirePhoneVerification: { type: Boolean, default: false },
            // Single device only (prevent sharing)
            singleDeviceOnly: { type: Boolean, default: false },
            // Disable copy-paste
            disableCopyPaste: { type: Boolean, default: false },
            // Full screen mode required
            fullScreenRequired: { type: Boolean, default: false },
            // Tab switch detection (disqualify on switch)
            detectTabSwitch: { type: Boolean, default: false },
            // Max tab switches allowed before disqualification
            maxTabSwitches: { type: Number, default: 3 }
        }
    },

    // ============================================
    // REWARD POLICY
    // ============================================
    // Defines how rewards are distributed to participants
    rewardPolicy: {
        // Description of reward policy (shown to users)
        description: {
            type: String,
            trim: true,
            maxlength: [2000, "Reward policy description cannot exceed 2000 characters"],
            default: "Rewards are distributed based on final ranking after event completion."
        },
        // When rewards are distributed
        distributionTime: {
            type: String,
            enum: ["immediate", "after_review", "after_event_end", "manual"],
            default: "after_event_end"
        },
        // Delay in hours after event ends (for after_event_end type)
        distributionDelayHours: {
            type: Number,
            default: 24,
            min: 0
        },
        // Reward type
        rewardType: {
            type: String,
            enum: ["coins", "cash", "mixed", "prizes", "certificates", "xp", "custom"],
            default: "coins"
        },
        // Prize distribution structure
        prizeDistribution: [{
            position: { type: Number, required: true }, // 1st, 2nd, 3rd, etc.
            coins: { type: Number, default: 0 },
            cash: { type: Number, default: 0 },
            xp: { type: Number, default: 0 },
            prize: { type: String, default: "" }, // Physical prize description
            certificate: { type: Boolean, default: false },
            badge: { type: String, default: "" } // Badge ID or name
        }],
        // Participation rewards (for all who complete)
        participationReward: {
            enabled: { type: Boolean, default: false },
            coins: { type: Number, default: 0 },
            xp: { type: Number, default: 0 },
            certificate: { type: Boolean, default: false },
            minCompletionPercent: { type: Number, default: 100 } // Must complete X% to get reward
        },
        // Bonus rewards (streak bonuses, early bird, etc.)
        bonusRewards: [{
            type: {
                type: String,
                enum: ["early_bird", "perfect_score", "speed_bonus", "streak", "referral", "custom"]
            },
            description: { type: String },
            coins: { type: Number, default: 0 },
            xp: { type: Number, default: 0 },
            condition: { type: String } // e.g., "Complete within first 10 minutes"
        }],
        // Terms and conditions
        termsAndConditions: {
            type: String,
            trim: true,
            maxlength: [3000, "Terms cannot exceed 3000 characters"],
            default: ""
        }
    },

    // ============================================
    // RETURN/REFUND POLICY
    // ============================================
    // Defines when and how entry fees are refunded
    returnPolicy: {
        // Description of return policy (shown to users)
        description: {
            type: String,
            trim: true,
            maxlength: [2000, "Return policy description cannot exceed 2000 characters"],
            default: "Entry fees are non-refundable once the event has started."
        },
        // Is refund allowed at all?
        refundAllowed: {
            type: Boolean,
            default: true
        },
        // Refund window (hours before event start)
        refundWindowHours: {
            type: Number,
            default: 24, // Can get refund up to 24 hours before start
            min: 0
        },
        // Refund percentage based on timing
        refundTiers: [{
            hoursBeforeStart: { type: Number, required: true }, // e.g., 48 hours before
            refundPercent: { type: Number, required: true, min: 0, max: 100 } // e.g., 100%
        }],
        // Conditions for automatic refund
        autoRefundConditions: {
            // Refund if event is cancelled by admin
            onEventCancellation: { type: Boolean, default: true },
            // Refund if event is rescheduled
            onEventReschedule: { type: Boolean, default: true },
            // Refund if minimum participants not reached
            onMinParticipantsNotMet: { type: Boolean, default: true },
            // Refund if technical issues prevent participation
            onTechnicalIssues: { type: Boolean, default: true }
        },
        // Exceptions where refund is NOT allowed
        noRefundConditions: [{ type: String }], // e.g., ["After viewing quiz questions", "After starting event"]
        // Processing time for refunds
        processingDays: {
            type: Number,
            default: 3, // Refunds processed within 3 days
            min: 1
        },
        // Terms and conditions
        termsAndConditions: {
            type: String,
            trim: true,
            maxlength: [3000, "Terms cannot exceed 3000 characters"],
            default: ""
        }
    },

    // ============================================
    // EVENT DETAILS
    // ============================================
    duration: {
        type: Number, // in minutes
        required: true,
        min: [1, "Duration must be at least 1 minute"]
    },
    image: {
        public_id: String,
        secure_url: String
    },
    bannerImage: {
        public_id: String,
        secure_url: String
    },
    difficulty: {
        type: String,
        enum: ["beginner", "intermediate", "advanced", "expert", "mixed"],
        default: "beginner"
    },
    location: {
        type: String,
        trim: true,
        default: "Online"
    },
    isFeatured: {
        type: Boolean,
        default: false
    },
    isPublic: {
        type: Boolean,
        default: true
    },

    // ============================================
    // PRICING & PRIZES
    // ============================================
    entryFee: {
        type: Number,
        required: true,
        min: [0, "Entry fee cannot be negative"],
        default: 0
    },
    currency: {
        type: String,
        enum: ["coins", "cash", "free"],
        default: "coins"
    },
    prizePool: {
        type: Number,
        required: true,
        min: [0, "Prize pool cannot be negative"],
        default: 0
    },
    // Legacy fields for backward compatibility
    rewardCoins: {
        type: Number,
        default: 0,
        min: 0
    },
    xpReward: {
        type: Number,
        default: 0,
        min: 0
    },

    // ============================================
    // PARTICIPANT LIMITS
    // ============================================
    maxParticipants: {
        type: Number,
        required: true,
        min: [1, "Max participants must be at least 1"],
        max: [100000, "Max participants cannot exceed 100,000"]
    },
    minParticipants: {
        type: Number,
        default: 1,
        min: 1
    },
    currentParticipants: {
        type: Number,
        default: 0,
        min: 0
    },
    // Waitlist when full
    waitlistEnabled: {
        type: Boolean,
        default: false
    },
    waitlist: [{
        user: { type: Schema.Types.ObjectId, ref: "User" },
        addedAt: { type: Date, default: Date.now },
        position: { type: Number }
    }],

    // ============================================
    // PARTICIPANTS (Enrolled Users)
    // ============================================
    participants: [{
        user: {
            type: Schema.Types.ObjectId,
            ref: "User",
            required: true
        },
        joinedAt: {
            type: Date,
            default: Date.now
        },
        // Status of participant in this event
        status: {
            type: String,
            enum: ["enrolled", "started", "completed", "disqualified", "withdrawn", "no_show"],
            default: "enrolled"
        },
        // Entry fee paid (for refund tracking)
        entryFeePaid: {
            type: Number,
            default: 0
        },
        // Refund status
        refundStatus: {
            type: String,
            enum: ["none", "requested", "approved", "processed", "denied"],
            default: "none"
        },
        refundAmount: { type: Number, default: 0 },
        refundedAt: { type: Date },
        // Access token for secure link (unique per user)
        accessToken: {
            type: String,
            select: false
        },
        accessTokenExpiresAt: { type: Date },
        // Gameplay tracking
        startedAt: { type: Date },
        completedAt: { type: Date },
        timeSpentMinutes: { type: Number },
        // Tab switch tracking (if enabled)
        tabSwitches: { type: Number, default: 0 },
        // Device info (for single device enforcement)
        deviceFingerprint: { type: String }
    }],

    // ============================================
    // SUBMISSIONS & RESULTS
    // ============================================
    submissions: [{
        user: {
            type: Schema.Types.ObjectId,
            ref: "User",
            required: true
        },
        submittedAt: {
            type: Date,
            default: Date.now
        },
        // Flexible content for any event type
        content: {
            type: Schema.Types.Mixed,
            default: {}
        },
        // Score (can be points, time, etc.)
        score: {
            type: Number,
            min: 0,
            default: 0
        },
        // Secondary score (for tiebreakers - e.g., time taken)
        secondaryScore: {
            type: Number,
            default: 0
        },
        rank: { type: Number },
        // Review status (for hackathons, design challenges)
        reviewStatus: {
            type: String,
            enum: ["pending", "under_review", "reviewed", "disputed"],
            default: "pending"
        },
        reviewedBy: { type: Schema.Types.ObjectId, ref: "User" },
        reviewNotes: { type: String },
        // Reward status
        rewardStatus: {
            type: String,
            enum: ["pending", "eligible", "distributed", "ineligible"],
            default: "pending"
        },
        rewardDistributedAt: { type: Date }
    }],

    // ============================================
    // WINNERS
    // ============================================
    winners: [{
        user: {
            type: Schema.Types.ObjectId,
            ref: "User"
        },
        position: { type: Number, required: true },
        score: { type: Number },
        prize: {
            coins: { type: Number, default: 0 },
            cash: { type: Number, default: 0 },
            xp: { type: Number, default: 0 },
            other: { type: String }
        },
        announcedAt: { type: Date }
    }],
    // Legacy single winner field
    winner: {
        type: Schema.Types.ObjectId,
        ref: "User"
    },

    // ============================================
    // SCHEDULE
    // ============================================
    schedule: {
        // Enrollment opens
        enrollmentStartTime: {
            type: Date
        },
        // Enrollment closes (usually same as startTime)
        enrollmentEndTime: {
            type: Date
        },
        // Event start time
        startTime: {
            type: Date,
            required: true
        },
        // Event end time
        endTime: {
            type: Date,
            required: true,
            validate: {
                validator: function (value) {
                    return value > this.schedule.startTime;
                },
                message: "End time must be after start time"
            }
        },
        // Results announcement time
        resultsTime: {
            type: Date
        },
        // Prize distribution time
        prizeDistributionTime: {
            type: Date
        }
    },

    // ============================================
    // STATUS
    // ============================================
    status: {
        type: String,
        enum: ["draft", "scheduled", "enrollment_open", "enrollment_closed", "upcoming", "live", "ongoing", "completed", "results_announced", "cancelled", "postponed"],
        default: "draft"
    },
    cancellationReason: {
        type: String,
        trim: true
    },
    postponedTo: {
        type: Date
    },

    // ============================================
    // TAGS & SEO
    // ============================================
    tags: [{
        type: String,
        trim: true,
        lowercase: true
    }],
    seoTitle: { type: String, trim: true },
    seoDescription: { type: String, trim: true },

    // ============================================
    // LEGACY FIELD (for backward compatibility)
    // ============================================
    quizzes: [{
        type: Schema.Types.ObjectId,
        ref: "Quiz"
    }],

    // ============================================
    // AUDIT FIELDS
    // ============================================
    createdBy: {
        type: Schema.Types.ObjectId,
        ref: "User",
        required: true
    },
    updatedBy: {
        type: Schema.Types.ObjectId,
        ref: "User"
    },
    isDeleted: {
        type: Boolean,
        default: false
    },
    deletedAt: { type: Date },
    deletedBy: {
        type: Schema.Types.ObjectId,
        ref: "User"
    }
}, {
    timestamps: true
});

// ============================================
// INDEXES FOR PERFORMANCE
// ============================================

eventSchema.index({ slug: 1 });
eventSchema.index({ category: 1 });
eventSchema.index({ type: 1 });
eventSchema.index({ status: 1 });
eventSchema.index({ difficulty: 1 });
eventSchema.index({ isFeatured: 1 });
eventSchema.index({ isPublic: 1 });
eventSchema.index({ "schedule.startTime": 1 });
eventSchema.index({ "schedule.endTime": 1 });
eventSchema.index({ "schedule.enrollmentStartTime": 1 });
eventSchema.index({ "participants.user": 1 });
eventSchema.index({ "submissions.user": 1 });
eventSchema.index({ createdBy: 1 });
eventSchema.index({ isDeleted: 1 });
eventSchema.index({ tags: 1 });
eventSchema.index({ currentParticipants: -1 });
eventSchema.index({ "content.model": 1, "content.ref": 1 });

// ============================================
// PRE-SAVE HOOKS
// ============================================

// Generate slug from name
eventSchema.pre("save", function() {
    if (this.isNew || this.isModified("name")) {
        this.slug = this.name
            .toLowerCase()
            .replace(/[^a-z0-9]+/g, "-")
            .replace(/(^-|-$)/g, "") + 
            "-" + Date.now().toString(36);
    }
});

// Generate secret key for access link
eventSchema.pre("save", function() {
    // Initialize accessLink if not exists
    if (!this.accessLink) {
        this.accessLink = {};
    }
    
    if (this.isNew && !this.accessLink.secretKey) {
        this.accessLink.secretKey = crypto.randomBytes(32).toString("hex");
    }
   
});

// Update status based on schedule
eventSchema.pre("save", function() {
    const now = new Date();
    
    // Don't auto-update cancelled/postponed events
    if (this.status === "cancelled" || this.status === "postponed") {
        return ;
    }
    
    // Check for schedule existence
    if (!this.schedule || !this.schedule.startTime || !this.schedule.endTime) {
        return ;
    }
    
    const enrollmentStart = this.schedule.enrollmentStartTime || new Date(0);
    const enrollmentEnd = this.schedule.enrollmentEndTime || this.schedule.startTime;
    
    if (now < enrollmentStart) {
        this.status = "scheduled";
    } else if (now >= enrollmentStart && now < enrollmentEnd) {
        this.status = "enrollment_open";
    } else if (now >= enrollmentEnd && now < this.schedule.startTime) {
        this.status = "upcoming";
    } else if (now >= this.schedule.startTime && now <= this.schedule.endTime) {
        this.status = "live";
    } else if (now > this.schedule.endTime) {
        if (this.schedule.resultsTime && now < this.schedule.resultsTime) {
            this.status = "completed";
        } else {
            this.status = "results_announced";
        }
    }
    
    ;
});
// ============================================
// INSTANCE METHODS
// ============================================

// ----------------------------------------
// ENROLLMENT METHODS
// ----------------------------------------

// Join/Enroll in event
eventSchema.methods.enrollUser = async function(userId, entryFeePaid = 0) {
    // Check if already enrolled
    const alreadyEnrolled = this.participants.some(
        p => p.user.toString() === userId.toString()
    );
    
    if (alreadyEnrolled) {
        throw new Error("User has already enrolled in this event");
    }
    
    // Check max participants
    if (this.currentParticipants >= this.maxParticipants) {
        // Add to waitlist if enabled
        if (this.waitlistEnabled) {
            this.waitlist.push({
                user: userId,
                addedAt: new Date(),
                position: this.waitlist.length + 1
            });
            await this.save();
            return { enrolled: false, waitlisted: true, position: this.waitlist.length };
        }
        throw new Error("Event is full");
    }
    
    // Check enrollment window
    const now = new Date();
    const enrollmentStart = this.schedule.enrollmentStartTime || new Date(0);
    const enrollmentEnd = this.schedule.enrollmentEndTime || this.schedule.startTime;
    
    if (now < enrollmentStart) {
        throw new Error("Enrollment has not started yet");
    }
    if (now > enrollmentEnd) {
        throw new Error("Enrollment period has ended");
    }
    
    // Generate access token for this user
    const accessToken = crypto.randomBytes(32).toString("hex");
    const accessTokenExpiresAt = new Date(
        this.schedule.endTime.getTime() + (this.accessLink.expirationMinutes * 60 * 1000)
    );
    
    this.participants.push({
        user: userId,
        joinedAt: new Date(),
        status: "enrolled",
        entryFeePaid,
        accessToken,
        accessTokenExpiresAt
    });
    this.currentParticipants += 1;
    
    return this.save();
};

// Legacy join method (alias for enrollUser)
eventSchema.methods.joinEvent = async function(userId) {
    return this.enrollUser(userId, 0);
};

// Leave/Withdraw from event
eventSchema.methods.withdrawUser = async function(userId) {
    const participantIndex = this.participants.findIndex(
        p => p.user.toString() === userId.toString()
    );
    
    if (participantIndex === -1) {
        throw new Error("User has not enrolled in this event");
    }
    
    const participant = this.participants[participantIndex];
    
    // Can't withdraw after starting
    if (participant.status === "started" || participant.status === "completed") {
        throw new Error("Cannot withdraw after starting the event");
    }
    
    // Calculate refund based on return policy
    const refundAmount = this.calculateRefund(participant.entryFeePaid);
    
    // Update participant status
    participant.status = "withdrawn";
    participant.refundStatus = refundAmount > 0 ? "approved" : "none";
    participant.refundAmount = refundAmount;
    
    this.currentParticipants -= 1;
    
    // Move someone from waitlist if applicable
    if (this.waitlistEnabled && this.waitlist.length > 0) {
        const nextInLine = this.waitlist.shift();
        // Note: The actual enrollment of waitlisted user should be handled by controller
        // as it may require payment processing
    }
    
    await this.save();
    return { refundAmount, status: participant.refundStatus };
};

// Legacy leave method
eventSchema.methods.leaveEvent = async function(userId) {
    return this.withdrawUser(userId);
};

// ----------------------------------------
// ACCESS LINK METHODS
// ----------------------------------------

// Generate secure access link for a user
eventSchema.methods.generateAccessLink = function(userId) {
    const participant = this.participants.find(
        p => p.user.toString() === userId.toString()
    );
    
    if (!participant) {
        throw new Error("User is not enrolled in this event");
    }
    
    const now = new Date();
    const activationTime = new Date(
        this.schedule.startTime.getTime() - (this.accessLink.activationMinutes * 60 * 1000)
    );
    
    // Check if link is active
    if (now < activationTime) {
        const minutesUntilActive = Math.ceil((activationTime - now) / (60 * 1000));
        return {
            active: false,
            message: `Access link will be active in ${minutesUntilActive} minutes`,
            activatesAt: activationTime
        };
    }
    
    // Check if link has expired
    if (now > participant.accessTokenExpiresAt) {
        return {
            active: false,
            message: "Access link has expired",
            expired: true
        };
    }
    
    // Build the secure URL
    const baseUrl = this.accessLink.baseUrl || this.content.externalBaseUrl || "";
    const token = participant.accessToken;
    
    // URL format: baseUrl?event=eventId&token=accessToken&user=userId
    const secureUrl = `${baseUrl}?event=${this._id}&token=${token}&user=${userId}`;
    
    return {
        active: true,
        url: secureUrl,
        expiresAt: participant.accessTokenExpiresAt,
        openInNewTab: this.accessLink.openInNewTab,
        security: this.accessLink.security
    };
};

// Validate access token
eventSchema.methods.validateAccessToken = function(userId, token) {
    const participant = this.participants.find(
        p => p.user.toString() === userId.toString()
    );
    
    if (!participant) {
        return { valid: false, reason: "User not enrolled" };
    }
    
    if (participant.accessToken !== token) {
        return { valid: false, reason: "Invalid token" };
    }
    
    if (new Date() > participant.accessTokenExpiresAt) {
        return { valid: false, reason: "Token expired" };
    }
    
    return { valid: true, participant };
};

// ----------------------------------------
// REFUND CALCULATION
// ----------------------------------------

// Calculate refund amount based on return policy
eventSchema.methods.calculateRefund = function(amountPaid) {
    if (!this.returnPolicy.refundAllowed || amountPaid === 0) {
        return 0;
    }
    
    const now = new Date();
    const hoursBeforeStart = (this.schedule.startTime - now) / (1000 * 60 * 60);
    
    // If event already started, no refund
    if (hoursBeforeStart < 0) {
        return 0;
    }
    
    // Check refund tiers (sorted by hours descending)
    const sortedTiers = [...(this.returnPolicy.refundTiers || [])]
        .sort((a, b) => b.hoursBeforeStart - a.hoursBeforeStart);
    
    for (const tier of sortedTiers) {
        if (hoursBeforeStart >= tier.hoursBeforeStart) {
            return Math.floor(amountPaid * (tier.refundPercent / 100));
        }
    }
    
    // Default: check refund window
    if (hoursBeforeStart >= this.returnPolicy.refundWindowHours) {
        return amountPaid; // Full refund
    }
    
    return 0;
};

// ----------------------------------------
// SUBMISSION METHODS
// ----------------------------------------

// Add submission
eventSchema.methods.addSubmission = function(userId, content, score, secondaryScore = 0) {
    // Verify user is enrolled
    const participant = this.participants.find(
        p => p.user.toString() === userId.toString()
    );
    
    if (!participant) {
        throw new Error("User must enroll in the event first");
    }
    
    // Check if already submitted
    const existingSubmission = this.submissions.find(
        s => s.user.toString() === userId.toString()
    );
    
    if (existingSubmission) {
        // Update existing submission
        existingSubmission.content = content;
        existingSubmission.score = score;
        existingSubmission.secondaryScore = secondaryScore;
        existingSubmission.submittedAt = new Date();
    } else {
        this.submissions.push({
            user: userId,
            content,
            score,
            secondaryScore,
            submittedAt: new Date()
        });
    }

    // Update participant status
    participant.status = "completed";
    participant.completedAt = new Date();
    if (participant.startedAt) {
        participant.timeSpentMinutes = Math.round(
            (new Date() - participant.startedAt) / (1000 * 60)
        );
    }

    return this.save();
};

// ----------------------------------------
// GAMEPLAY TRACKING
// ----------------------------------------

// Mark user as started
eventSchema.methods.markStarted = function(userId, deviceFingerprint = null) {
    const participant = this.participants.find(
        p => p.user.toString() === userId.toString()
    );
    
    if (!participant) {
        throw new Error("User not enrolled");
    }
    
    // Check single device enforcement
    if (this.accessLink.security.singleDeviceOnly && participant.deviceFingerprint) {
        if (participant.deviceFingerprint !== deviceFingerprint) {
            throw new Error("Access denied: Different device detected");
        }
    }
    
    participant.status = "started";
    participant.startedAt = new Date();
    participant.deviceFingerprint = deviceFingerprint;
    
    return this.save();
};

// Record tab switch
eventSchema.methods.recordTabSwitch = function(userId) {
    const participant = this.participants.find(
        p => p.user.toString() === userId.toString()
    );
    
    if (!participant) return { disqualified: false };
    
    participant.tabSwitches = (participant.tabSwitches || 0) + 1;
    
    // Check if should disqualify
    if (this.accessLink.security.detectTabSwitch && 
        participant.tabSwitches > this.accessLink.security.maxTabSwitches) {
        participant.status = "disqualified";
        this.save();
        return { disqualified: true, reason: "Too many tab switches" };
    }
    
    this.save();
    return { disqualified: false, tabSwitches: participant.tabSwitches };
};

// ----------------------------------------
// UTILITY METHODS
// ----------------------------------------

// Check if user is enrolled
eventSchema.methods.isUserEnrolled = function(userId) {
    return this.participants.some(
        p => p.user.toString() === userId.toString() && p.status !== "withdrawn"
    );
};

// Legacy method alias
eventSchema.methods.hasUserJoined = function(userId) {
    return this.isUserEnrolled(userId);
};

// Check if user has submitted
eventSchema.methods.hasUserSubmitted = function(userId) {
    return this.submissions.some(
        sub => sub.user.toString() === userId.toString()
    );
};

// Get highest score
eventSchema.methods.getHighestScore = function() {
    if (this.submissions.length === 0) return 0;
    return Math.max(...this.submissions.map(s => s.score || 0));
};

// Get participant count
eventSchema.methods.getParticipantCount = function() {
    return this.currentParticipants;
};

// Soft delete
eventSchema.methods.softDelete = function(deletedBy, reason = "") {
    this.isDeleted = true;
    this.deletedAt = new Date();
    this.deletedBy = deletedBy;
    this.cancellationReason = reason;
    return this.save();
};

// ============================================
// VIRTUALS
// ============================================

// Total duration in minutes
eventSchema.virtual("totalDuration").get(function() {
    if (!this.schedule?.startTime || !this.schedule?.endTime) return 0;
    return Math.round((this.schedule.endTime - this.schedule.startTime) / (1000 * 60));
});

// Submission count
eventSchema.virtual("submissionCount").get(function() {
    return this.submissions?.length || 0;
});

// Is enrollment open
eventSchema.virtual("isEnrollmentOpen").get(function() {
    const now = new Date();
    const start = this.schedule?.enrollmentStartTime || new Date(0);
    const end = this.schedule?.enrollmentEndTime || this.schedule?.startTime;
    return now >= start && now <= end && this.currentParticipants < this.maxParticipants;
});

// Is event live
eventSchema.virtual("isLive").get(function() {
    const now = new Date();
    return now >= this.schedule?.startTime && now <= this.schedule?.endTime;
});

// Spots remaining
eventSchema.virtual("spotsRemaining").get(function() {
    return Math.max(0, this.maxParticipants - this.currentParticipants);
});

// Is access link active
eventSchema.virtual("isAccessLinkActive").get(function() {
    const now = new Date();
    const activationTime = new Date(
        this.schedule.startTime.getTime() - (this.accessLink?.activationMinutes || 1) * 60 * 1000
    );
    const expirationTime = new Date(
        this.schedule.endTime.getTime() + (this.accessLink?.expirationMinutes || 5) * 60 * 1000
    );
    return now >= activationTime && now <= expirationTime;
});

// ============================================
// STATIC METHODS
// ============================================

// Get user's enrolled events
eventSchema.statics.getUserEnrolledEvents = async function(userId, options = {}) {
    const { page = 1, limit = 10, status } = options;
    const skip = (page - 1) * limit;
    
    const query = {
        isDeleted: false,
        "participants.user": userId,
        "participants.status": { $ne: "withdrawn" }
    };
    
    if (status) query.status = status;
    
    return this.find(query)
        .sort({ "schedule.startTime": -1 })
        .skip(skip)
        .limit(limit)
        .populate("createdBy", "username avatar");
};

// Get upcoming events
eventSchema.statics.getUpcomingEvents = async function(options = {}) {
    const { page = 1, limit = 10, category } = options;
    const skip = (page - 1) * limit;
    
    const query = {
        isDeleted: false,
        isPublic: true,
        "schedule.startTime": { $gt: new Date() }
    };
    
    if (category) query.category = category;
    
    return this.find(query)
        .sort({ "schedule.startTime": 1 })
        .skip(skip)
        .limit(limit);
};

// ============================================
// ENSURE VIRTUALS IN JSON
// ============================================

eventSchema.set("toJSON", { virtuals: true });
eventSchema.set("toObject", { virtuals: true });

// ============================================
// EXPORT
// ============================================

export const Event = mongoose.model("Event", eventSchema);

// ============================================
// FLOW DOCUMENTATION
// ============================================
/*
 * COMPLETE EVENT FLOW: FROM CREATION TO REWARD DISTRIBUTION
 * =========================================================
 * 
 * 1. EVENT CREATION (Admin/Moderator)
 *    ─────────────────────────────────
 *    a. Admin creates event with:
 *       - Basic info (name, description, rules, category)
 *       - Schedule (enrollment start/end, event start/end, results time)
 *       - Pricing (entry fee, prize pool)
 *       - Policies (rewardPolicy, returnPolicy)
 *       - Access link configuration
 *    
 *    b. Admin creates ACTUAL CONTENT in separate collection:
 *       - For Quiz: Create Quiz document with questions
 *       - For Hackathon: Create Hackathon document with challenge details
 *       - For Scavenger Hunt: Create ScavengerHunt with clues
 *       - For OSINT: Create OSINTChallenge with targets
 *       - etc.
 *    
 *    c. Admin links content to event:
 *       - Set content.model = "Quiz" (or whatever type)
 *       - Set content.ref = ObjectId of the content document
 *       - Set accessLink.baseUrl = URL where gameplay happens
 * 
 * 2. USER ENROLLMENT
 *    ────────────────
 *    a. User browses events on GreedHunter website
 *    b. User views event card with:
 *       - Description, rules, schedule
 *       - Reward policy (how prizes are distributed)
 *       - Return policy (refund conditions)
 *       - Entry fee, prize pool
 *    
 *    c. User clicks "Enroll" → pays entry fee (if any)
 *    d. System generates unique accessToken for user
 *    e. User is added to participants array with status "enrolled"
 *    
 *    Note: At this point, user CANNOT access the actual content!
 *          They can only see the event card/metadata.
 * 
 * 3. ACCESS LINK ACTIVATION (1 min before start)
 *    ───────────────────────────────────────────
 *    a. accessLink.activationMinutes before startTime:
 *       - System activates access links for all enrolled users
 *    
 *    b. User sees "Join Event" button become active
 *    c. On click → generateAccessLink(userId) is called
 *    d. Returns secure URL with token:
 *       baseUrl?event=eventId&token=accessToken&user=userId
 *    
 *    e. Link opens in NEW TAB (for security)
 *    f. User lands on the gameplay platform (could be same domain or external)
 * 
 * 4. GAMEPLAY (On External/Secure Link)
 *    ──────────────────────────────────
 *    a. Gameplay platform validates token via API:
 *       - Call event.validateAccessToken(userId, token)
 *       - If invalid → reject access
 *    
 *    b. Platform marks user as started:
 *       - Call event.markStarted(userId, deviceFingerprint)
 *       - Status changes: "enrolled" → "started"
 *    
 *    c. Security features enforced (based on accessLink.security):
 *       - Tab switch detection → recordTabSwitch(userId)
 *       - Single device enforcement
 *       - Full screen requirement
 *       - Copy-paste disabled
 *    
 *    d. User completes the event (quiz, hackathon, etc.)
 *    e. Score/results submitted to GreedHunter via API
 * 
 * 5. SUBMISSION & SCORING
 *    ────────────────────
 *    a. Gameplay platform calls:
 *       event.addSubmission(userId, content, score, secondaryScore)
 *    
 *    b. User status changes: "started" → "completed"
 *    c. Submission stored with timestamp
 *    d. For auto-scored events: rank calculated immediately
 *    e. For manual review (hackathons): status = "pending"
 * 
 * 6. EVENT COMPLETION
 *    ────────────────
 *    a. When event.schedule.endTime passes:
 *       - Status changes to "completed"
 *       - No more submissions accepted
 *    
 *    b. For events requiring review:
 *       - Moderators review submissions
 *       - Update scores/ranks
 *       - Mark as "reviewed"
 *    
 *    c. Final rankings calculated (score, then secondaryScore for ties)
 * 
 * 7. RESULTS ANNOUNCEMENT
 *    ────────────────────
 *    a. At schedule.resultsTime (or when admin triggers):
 *       - Status changes to "results_announced"
 *       - Winners array populated
 *       - Leaderboard finalized
 *    
 *    b. All participants can view:
 *       - Their rank, score
 *       - Leaderboard
 *       - Winners
 * 
 * 8. REWARD DISTRIBUTION
 *    ───────────────────
 *    Based on rewardPolicy.distributionTime:
 *    
 *    a. "immediate": Right after results announcement
 *    b. "after_event_end": distributionDelayHours after event ends
 *    c. "after_review": After all submissions reviewed
 *    d. "manual": Admin triggers manually
 *    
 *    Distribution process:
 *    - Read prizeDistribution array
 *    - For each winner position:
 *      → Add coins to wallet
 *      → Add XP to user
 *      → Award badges (if any)
 *      → Generate certificate (if enabled)
 *    
 *    - For participation rewards (if enabled):
 *      → Check minCompletionPercent requirement
 *      → Award to all who qualify
 *    
 *    - For bonus rewards:
 *      → Check conditions (early_bird, perfect_score, etc.)
 *      → Award to qualifying users
 * 
 * 9. REFUND SCENARIOS
 *    ────────────────
 *    Based on returnPolicy:
 *    
 *    a. User withdraws before event:
 *       - Calculate refund using refundTiers
 *       - Process if within refundWindowHours
 *    
 *    b. Event cancelled by admin:
 *       - If autoRefundConditions.onEventCancellation = true
 *       - Full refund to all participants
 *    
 *    c. Event rescheduled:
 *       - Offer refund or transfer enrollment
 *    
 *    d. Technical issues:
 *       - Admin can trigger refunds manually
 *    
 *    Refund process:
 *    - Update participant.refundStatus = "processed"
 *    - Add coins back to wallet
 *    - Log transaction
 * 
 * 10. POST-EVENT
 *     ──────────
 *     a. Event data preserved for:
 *        - Historical leaderboards
 *        - User profile achievements
 *        - Analytics
 *     
 *     b. Users can:
 *        - View their past participation
 *        - Download certificates
 *        - Share achievements
 * 
 * =========================================================
 * KEY POINTS:
 * - Event schema is a CONTAINER/CARD, not the actual content
 * - Actual content lives in separate collections (Quiz, Hackathon, etc.)
 * - Users enroll on GreedHunter, play on secure external link
 * - Access tokens ensure security and prevent sharing
 * - Policies are transparent and shown upfront
 * =========================================================
 */
