import mongoose, { Schema } from "mongoose";
import jwt from "jsonwebtoken";
import bcrypt from "bcryptjs";
import validator from "validator";
import crypto from "crypto";

// ============================================
// USER SCHEMA DEFINITION
// ============================================

const userSchema = new Schema({
    username: {
        type: String,
        required: true,
        trim: true,
        minlength: [4, "Username must be at least 4 characters long"],
        maxlength: [100, "Username cannot be more than 100 characters"],
        lowercase: true
    },
    phone: {
        type: String, // Changed to String for better validation
        required: function() {
            return !this.googleId; // Phone required only if not Google auth
        },
        // sparse: true, // Allows multiple null values
        trim: true,
        validate: {
            validator: function (value) {
                if (!value) return true; // Allow null for Google users
                return /^[1-9]\d{9}$/.test(value);
            },
            message: "Please enter a valid 10-digit Indian mobile number"
        }
    },
    email: {
        type: String,
        required: true,
        lowercase: true,
        trim: true,
        validate: {
            validator: function (value) {
                return validator.isEmail(value);
            },
            message: "Please enter email in correct format - e.g., xyz@gmail.com"
        }
    },
    googleId: {
        type: String,
        // sparse: true
    },
    gender: {
        type: String,
        lowercase: true,
        trim: true,
        enum: ["male", "female", "other", "not specified"],
        default: "not specified"
    },
    dob: {
        type: Date,
        validate: {
            validator: function (value) {
                // Ensure user is at least 13 years old if dob is provided
                if (!value) return true; // Allow null/undefined
                const age = new Date().getFullYear() - value.getFullYear();
                return age >= 13;
            },
            message: "User must be at least 13 years old"
        }
    },
    bio: {
        type: String,
        default: "",
        maxlength: [500, "Bio cannot be more than 500 characters"],
        trim: true
    },
    password: {
        type: String,
        required: function() {
            return !this.googleId; // Password required only if not Google auth
        },
        minlength: [8, "Password must be at least 8 characters long"],
        validate: {
            validator: function (value) {
                // Skip validation if password is already hashed (starts with bcrypt hash)
                if (!value || value.startsWith('$2b$')) return true;
                // Strong password: at least one uppercase, one lowercase, one number, one special char
                return /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/.test(value);
            },
            message: "Password must contain at least one uppercase letter, one lowercase letter, one number, and one special character"
        }
    },
    role: {
        type: String,
        default: "user",
        enum: ["user", "admin", "super_admin", "moderator"]
    },
    avatar: {
        public_id: {
            type: String
        },
        secure_url: {
            type: String
        }
    },
    refreshToken: {
        type: String
    },
    isVerified: {
        type: Boolean,
        default: false
    },
    // Gamification fields
    level: {
        type: Number,
        default: 1,
        min: 1
    },
    xp: {
        type: Number,
        default: 0,
        min: 0
    },
    points: {
        type: Number,
        default: 0,
        min: 0
    },
    // Statistics
    stats: {
        eventsJoined: {
            type: Number,
            default: 0,
            min: 0
        },
        eventsWon: {
            type: Number,
            default: 0,
            min: 0
        },
        quizzesCompleted: {
            type: Number,
            default: 0,
            min: 0
        },
        quizzesWon: {
            type: Number,
            default: 0,
            min: 0
        },
        challengesCompleted: {
            type: Number,
            default: 0,
            min: 0
        },
        missionsCompleted: {
            type: Number,
            default: 0,
            min: 0
        },
        currentStreak: {
            type: Number,
            default: 0,
            min: 0
        },
        longestStreak: {
            type: Number,
            default: 0,
            min: 0
        },
        lastActiveDate: {
            type: Date
        }
    },
    // Account status
    status: {
        type: String,
        enum: ["active", "banned", "restricted", "suspended"],
        default: "active"
    },
    statusReason: {
        type: String,
        trim: true
    },
    bannedAt: {
        type: Date
    },
    bannedBy: {
        type: Schema.Types.ObjectId,
        ref: "User"
    },
    // Premium/Subscription
    isPremium: {
        type: Boolean,
        default: false
    },
    premiumExpiresAt: {
        type: Date
    },
    // 2FA
    twoFactorEnabled: {
        type: Boolean,
        default: false
    },
    twoFactorSecret: {
        type: String
    },
    // Privacy settings
    privacy: {
        profileVisibility: {
            type: String,
            enum: ["public", "followers", "private"],
            default: "public"
        },
        showOnlineStatus: {
            type: Boolean,
            default: true
        },
        showActivityStatus: {
            type: Boolean,
            default: true
        },
        allowMessages: {
            type: String,
            enum: ["everyone", "followers", "none"],
            default: "everyone"
        }
    },
    // Login history
    loginHistory: [{
        timestamp: {
            type: Date,
            default: Date.now
        },
        ip: String,
        device: String,
        browser: String,
        location: String
    }],
    social_links: {
        youtube: {
            type: String,
            default: "",
            validate: {
                validator: function (value) {
                    if (!value) return true;
                    return validator.isURL(value, { protocols: ['http', 'https'], require_protocol: true });
                },
                message: "Please enter a valid YouTube URL"
            }
        },
        instagram: {
            type: String,
            default: "",
            validate: {
                validator: function (value) {
                    if (!value) return true;
                    return validator.isURL(value, { protocols: ['http', 'https'], require_protocol: true });
                },
                message: "Please enter a valid Instagram URL"
            }
        },
        linkedin: {
            type: String,
            default: "",
            validate: {
                validator: function (value) {
                    if (!value) return true;
                    return validator.isURL(value, { protocols: ['http', 'https'], require_protocol: true });
                },
                message: "Please enter a valid LinkedIn URL"
            }
        },
        twitter: {
            type: String,
            default: "",
            validate: {
                validator: function (value) {
                    if (!value) return true;
                    return validator.isURL(value, { protocols: ['http', 'https'], require_protocol: true });
                },
                message: "Please enter a valid Twitter URL"
            }
        },
        github: {
            type: String,
            default: "",
            validate: {
                validator: function (value) {
                    if (!value) return true;
                    return validator.isURL(value, { protocols: ['http', 'https'], require_protocol: true });
                },
                message: "Please enter a valid GitHub URL"
            }
        },
        website: {
            type: String,
            default: "",
            validate: {
                validator: function (value) {
                    if (!value) return true;
                    return validator.isURL(value, { protocols: ['http', 'https'], require_protocol: true });
                },
                message: "Please enter a valid website URL"
            }
        }
    },
    verificationCode: Number,
    verificationCodeExpire: Date,
    forgotPasswordToken: String,
    forgotPasswordTokenExpiry: Date,

    followers: [{
        type: Schema.Types.ObjectId,
        ref: "User"
    }],
    following: [{
        type: Schema.Types.ObjectId,
        ref: "User"
    }],

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

userSchema.index({ email: 1 }, { unique: true });
userSchema.index({ phone: 1 }, { unique: true, sparse: true });
userSchema.index({ username: 1 }, { unique: true });
userSchema.index({ googleId: 1 }, { unique: true, sparse: true });
userSchema.index({ isDeleted: 1 });

// ============================================
// PRE-SAVE HOOKS
// ============================================

// Hash password before saving
userSchema.pre("save", async function () {
    try {
        if (!this.isModified("password")) return;
        this.password = await bcrypt.hash(this.password, 12);
    } catch (error) {
        // Log error but let Mongoose handle it
        console.error('Error hashing password:', error);
        throw error; // Mongoose will catch and prevent save
    }
});

// ============================================
// INSTANCE METHODS
// ============================================

// Password validation
userSchema.methods.isPasswordCorrect = async function (password) {
    return await bcrypt.compare(password, this.password);
};

// Generate access token
userSchema.methods.generateAccessToken = function () {
    return jwt.sign(
        {
            _id: this._id,
            email: this.email,
            phone: this.phone || null,
            username: this.username,
        },
        process.env.ACCESS_TOKEN_SECRET,
        {
            expiresIn: process.env.ACCESS_TOKEN_EXPIRY
        }
    );
};

// Generate refresh token
userSchema.methods.generateRefreshToken = function () {
    return jwt.sign(
        { _id: this._id },
        process.env.REFRESH_TOKEN_SECRET,
        { expiresIn: process.env.REFRESH_TOKEN_EXPIRY }
    );
};

// Generate verification code
userSchema.methods.generateVerificationCode = function () {
    function generateCodeNumber() {
        const firstDigit = Math.floor(Math.random() * 9) + 1;
        const remainingDigits = Math.floor(Math.random() * 100000).toString().padStart(5, '0');
        return parseInt(firstDigit + remainingDigits);
    }
    const verificationCode = generateCodeNumber();
    this.verificationCode = verificationCode;
    this.verificationCodeExpire = Date.now() + 3 * 60 * 1000; // 3 minutes
    return verificationCode;
};

// Generate reset password link
userSchema.methods.generateResetPasswordLink = function () {
    const forgotToken = crypto.randomBytes(32).toString("hex"); // Increased to 32 bytes
    this.forgotPasswordToken = crypto.createHash("sha256").update(forgotToken).digest("hex");
    this.forgotPasswordTokenExpiry = Date.now() + 7 * 60 * 1000; // 7 minutes? Wait, probably 7 days
    return forgotToken;
};

// Soft delete method
userSchema.methods.softDelete = function () {
    this.isDeleted = true;
    this.deletedAt = new Date();
    return this.save();
};

// ============================================
// VIRTUALS
// ============================================

// Virtual for age
userSchema.virtual('age').get(function () {
    if (!this.dob) return null;
    return new Date().getFullYear() - this.dob.getFullYear();
});

// ============================================
// EXPORT
// ============================================

export const User = mongoose.model("User", userSchema);
