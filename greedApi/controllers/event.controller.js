import { asyncHandler } from "../middlewares/asyncHandler.middleware.js";
import ErrorHandler from "../middlewares/error.middleware.js";
import { Event } from "../models/event.model.js";
import { Quiz } from "../models/quiz.model.js";
import { User } from "../models/user.model.js";
import { Wallet } from "../models/wallet.model.js";
import { logActivity } from "../utils/logActivity.utils.js";
import { uploadOnCloudinary, destroyOnCloudinary } from "../utils/cloudinary.utils.js";
import mongoose from "mongoose";

// ============================================
// HELPER: Parse form-data fields
// ============================================
const parseFormData = (body) => {
    const parsed = {};
    
    for (const [key, value] of Object.entries(body)) {
        if (value === undefined || value === '') continue;
        
        // Try to parse JSON strings
        if (typeof value === 'string') {
            try {
                // Check if it looks like JSON
                if ((value.startsWith('{') && value.endsWith('}')) ||
                    (value.startsWith('[') && value.endsWith(']'))) {
                    parsed[key] = JSON.parse(value);
                    continue;
                }
            } catch (e) {
                // Not JSON, use as-is
            }
            
            // Handle booleans
            if (value === 'true') {
                parsed[key] = true;
                continue;
            }
            if (value === 'false') {
                parsed[key] = false;
                continue;
            }
            
            // Handle numbers
            if (!isNaN(value) && value.trim() !== '') {
                parsed[key] = Number(value);
                continue;
            }
        }
        
        parsed[key] = value;
    }
    
    return parsed;
};

// ============================================
// CREATE EVENT
// ============================================
// Creates a new event with all metadata, policies, and schedule
// Only accessible by moderators, admins, and super_admins
// Supports both JSON and form-data (for file uploads)

const createEvent = asyncHandler(async (req, res, next) => {
    // Parse form-data if needed
    const data = parseFormData(req.body);
    
    const {
        name,
        category,
        type,
        description,
        shortDescription,
        rules,
        duration,
        difficulty,
        location,
        isFeatured,
        isPublic,
        entryFee,
        currency,
        prizePool,
        rewardCoins,
        xpReward,
        maxParticipants,
        minParticipants,
        waitlistEnabled,
        schedule,
        content,
        accessLink,
        rewardPolicy,
        returnPolicy,
        tags,
        quizzes
    } = data;

    const userId = req.user._id;

    // Validate required fields
    if (!name || !description || !duration || !maxParticipants || !schedule?.startTime || !schedule?.endTime) {
        return next(new ErrorHandler("Name, description, duration, maxParticipants, and schedule are required", 400));
    }

    // Validate schedule
    const startTime = new Date(schedule.startTime);
    const endTime = new Date(schedule.endTime);
    const enrollmentStartTime = schedule.enrollmentStartTime ? new Date(schedule.enrollmentStartTime) : new Date();
    const enrollmentEndTime = schedule.enrollmentEndTime ? new Date(schedule.enrollmentEndTime) : startTime;

    if (startTime >= endTime) {
        return next(new ErrorHandler("End time must be after start time", 400));
    }

    if (startTime <= new Date()) {
        return next(new ErrorHandler("Start time must be in the future", 400));
    }

    // Validate quizzes if provided (for backward compatibility)
    const quizList = quizzes || [];
    if (quizList.length > 0) {
        const validQuizzes = await Quiz.find({
            _id: { $in: quizList },
            isDeleted: false
        });

        if (validQuizzes.length !== quizzes.length) {
            return next(new ErrorHandler("Some quizzes are invalid", 400));
        }
    }

    // Build event object
    const eventData = {
        name,
        category: category || "other",
        type: type || "online",
        description,
        shortDescription,
        rules,
        duration,
        difficulty: difficulty || "beginner",
        location: location || "Online",
        isFeatured: isFeatured || false,
        isPublic: isPublic !== false, // default true
        entryFee: entryFee || 0,
        currency: currency || "coins",
        prizePool: prizePool || 0,
        rewardCoins: rewardCoins || 0,
        xpReward: xpReward || 0,
        maxParticipants,
        minParticipants: minParticipants || 1,
        waitlistEnabled: waitlistEnabled || false,
        schedule: {
            enrollmentStartTime,
            enrollmentEndTime,
            startTime,
            endTime,
            resultsTime: schedule.resultsTime ? new Date(schedule.resultsTime) : null,
            prizeDistributionTime: schedule.prizeDistributionTime ? new Date(schedule.prizeDistributionTime) : null
        },
        createdBy: userId,
        quizzes,
        tags: tags || []
    };

    // Add content reference if provided
    if (content) {
        eventData.content = {
            model: content.model || "Custom",
            ref: content.ref || null,
            externalBaseUrl: content.externalBaseUrl || ""
        };
    }

    // Add access link configuration if provided
    if (accessLink) {
        eventData.accessLink = {
            baseUrl: accessLink.baseUrl || "",
            activationMinutes: accessLink.activationMinutes || 1,
            expirationMinutes: accessLink.expirationMinutes || 5,
            openInNewTab: accessLink.openInNewTab !== false,
            security: accessLink.security || {}
        };
    }

    // Add reward policy if provided
    if (rewardPolicy) {
        eventData.rewardPolicy = {
            description: rewardPolicy.description || "Rewards distributed based on final ranking.",
            distributionTime: rewardPolicy.distributionTime || "after_event_end",
            distributionDelayHours: rewardPolicy.distributionDelayHours || 24,
            rewardType: rewardPolicy.rewardType || "coins",
            prizeDistribution: rewardPolicy.prizeDistribution || [],
            participationReward: rewardPolicy.participationReward || { enabled: false },
            bonusRewards: rewardPolicy.bonusRewards || [],
            termsAndConditions: rewardPolicy.termsAndConditions || ""
        };
    }

    // Add return policy if provided
    if (returnPolicy) {
        eventData.returnPolicy = {
            description: returnPolicy.description || "Entry fees are non-refundable once the event has started.",
            refundAllowed: returnPolicy.refundAllowed !== false,
            refundWindowHours: returnPolicy.refundWindowHours || 24,
            refundTiers: returnPolicy.refundTiers || [],
            autoRefundConditions: returnPolicy.autoRefundConditions || {
                onEventCancellation: true,
                onEventReschedule: true,
                onMinParticipantsNotMet: true,
                onTechnicalIssues: true
            },
            noRefundConditions: returnPolicy.noRefundConditions || [],
            processingDays: returnPolicy.processingDays || 3,
            termsAndConditions: returnPolicy.termsAndConditions || ""
        };
    }

    // Handle image uploads
    if (req.files) {
        // Event image
        if (req.files.image && req.files.image[0]) {
            const uploadedImage = await uploadOnCloudinary(
                req.files.image[0].path, 
                "events", 
                req.user, 
                req.files.image[0].originalname
            );
            if (uploadedImage) {
                eventData.image = {
                    public_id: uploadedImage.public_id,
                    secure_url: uploadedImage.secure_url
                };
            }
        }
        
        // Banner image
        if (req.files.bannerImage && req.files.bannerImage[0]) {
            const uploadedBanner = await uploadOnCloudinary(
                req.files.bannerImage[0].path, 
                "events/banners", 
                req.user, 
                req.files.bannerImage[0].originalname
            );
            if (uploadedBanner) {
                eventData.bannerImage = {
                    public_id: uploadedBanner.public_id,
                    secure_url: uploadedBanner.secure_url
                };
            }
        }
    }

    const event = await Event.create(eventData);

    await logActivity(
        userId,
        "event_created",
        `Created event: ${name}`,
        req,
        "event",
        event._id
    );

    res.status(201).json({
        success: true,
        message: "Event created successfully",
        event
    });
});

// ============================================
// GET ALL EVENTS
// ============================================

const getAllEvents = asyncHandler(async (req, res, next) => {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 10;
    const status = req.query.status; // upcoming, ongoing, completed
    const category = req.query.category;
    const skip = (page - 1) * limit;

    const filter = { isDeleted: false };

    if (status) {
        filter.status = status;
    }

    if (category) {
        filter.category = category;
    }

    const events = await Event.find(filter)
        .populate('createdBy', 'username avatar')
        .populate('winner', 'username avatar')
        .sort({ createdAt: -1 })
        .skip(skip)
        .limit(limit);

    const totalEvents = await Event.countDocuments(filter);

    res.status(200).json({
        success: true,
        events,
        pagination: {
            currentPage: page,
            totalPages: Math.ceil(totalEvents / limit),
            totalEvents,
            hasNext: page * limit < totalEvents,
            hasPrev: page > 1
        }
    });
});

// ============================================
// GET EVENT BY ID
// ============================================

const getEventById = asyncHandler(async (req, res, next) => {
    const { eventId } = req.params;

    const event = await Event.findById(eventId)
        .populate('createdBy', 'username avatar bio')
        .populate('winner', 'username avatar')
        .populate('quizzes', 'title difficulty timeLimit maxParticipants')
        .populate('submissions.user', 'username avatar');

    if (!event || event.isDeleted) {
        return next(new ErrorHandler("Event not found", 404));
    }

    res.status(200).json({
        success: true,
        event
    });
});

// ============================================
// UPDATE EVENT
// ============================================

const updateEvent = asyncHandler(async (req, res, next) => {
    const { eventId } = req.params;
    const userId = req.user._id;
    
    // Parse form-data if needed
    const updateData = parseFormData(req.body);

    const event = await Event.findById(eventId);

    if (!event || event.isDeleted) {
        return next(new ErrorHandler("Event not found", 404));
    }

    if (event.createdBy.toString() !== userId.toString()) {
        return next(new ErrorHandler("You can only update your own events", 403));
    }

    // Allow updates only for events that haven't started yet
    const nonStartedStatuses = ["draft", "scheduled", "enrollment_open", "enrollment_closed", "upcoming"];
    if (!nonStartedStatuses.includes(event.status)) {
        return next(new ErrorHandler("Cannot update events that have already started", 400));
    }

    // Validate schedule if being updated
    if (updateData.schedule) {
        const startTime = new Date(updateData.schedule.startTime || event.schedule.startTime);
        const endTime = new Date(updateData.schedule.endTime || event.schedule.endTime);

        if (startTime >= endTime) {
            return next(new ErrorHandler("End time must be after start time", 400));
        }
    }

    // List of allowed fields to update
    const allowedFields = [
        "name", "category", "type", "description", "shortDescription", "rules",
        "duration", "difficulty", "location", "isFeatured", "isPublic",
        "entryFee", "currency", "prizePool", "rewardCoins", "xpReward",
        "maxParticipants", "minParticipants", "waitlistEnabled", "tags",
        "schedule", "content", "accessLink", "rewardPolicy", "returnPolicy"
    ];

    // Apply updates to the event document
    for (const field of allowedFields) {
        if (updateData[field] !== undefined) {
            if (field === "schedule" && updateData.schedule) {
                // Merge schedule fields
                event.schedule = {
                    ...event.schedule.toObject(),
                    enrollmentStartTime: updateData.schedule.enrollmentStartTime 
                        ? new Date(updateData.schedule.enrollmentStartTime) 
                        : event.schedule.enrollmentStartTime,
                    enrollmentEndTime: updateData.schedule.enrollmentEndTime 
                        ? new Date(updateData.schedule.enrollmentEndTime) 
                        : event.schedule.enrollmentEndTime,
                    startTime: updateData.schedule.startTime 
                        ? new Date(updateData.schedule.startTime) 
                        : event.schedule.startTime,
                    endTime: updateData.schedule.endTime 
                        ? new Date(updateData.schedule.endTime) 
                        : event.schedule.endTime,
                    resultsTime: updateData.schedule.resultsTime 
                        ? new Date(updateData.schedule.resultsTime) 
                        : event.schedule.resultsTime,
                    prizeDistributionTime: updateData.schedule.prizeDistributionTime 
                        ? new Date(updateData.schedule.prizeDistributionTime) 
                        : event.schedule.prizeDistributionTime
                };
            } else if (field === "accessLink" && updateData.accessLink) {
                // Merge accessLink fields (preserve secretKey)
                event.accessLink = {
                    ...event.accessLink.toObject(),
                    ...updateData.accessLink,
                    secretKey: event.accessLink.secretKey // Never overwrite secret key
                };
            } else if (field === "rewardPolicy" && updateData.rewardPolicy) {
                event.rewardPolicy = {
                    ...event.rewardPolicy?.toObject?.() || {},
                    ...updateData.rewardPolicy
                };
            } else if (field === "returnPolicy" && updateData.returnPolicy) {
                event.returnPolicy = {
                    ...event.returnPolicy?.toObject?.() || {},
                    ...updateData.returnPolicy
                };
            } else if (field === "content" && updateData.content) {
                event.content = {
                    ...event.content?.toObject?.() || {},
                    ...updateData.content
                };
            } else {
                event[field] = updateData[field];
            }
        }
    }

    // Handle image uploads
    if (req.files) {
        // Event image
        if (req.files.image && req.files.image[0]) {
            // Delete old image if exists
            if (event.image?.public_id) {
                await destroyOnCloudinary(event.image.public_id, "events");
            }
            const uploadedImage = await uploadOnCloudinary(
                req.files.image[0].path, 
                "events", 
                req.user, 
                req.files.image[0].originalname
            );
            if (uploadedImage) {
                event.image = {
                    public_id: uploadedImage.public_id,
                    secure_url: uploadedImage.secure_url
                };
            }
        }
        
        // Banner image
        if (req.files.bannerImage && req.files.bannerImage[0]) {
            // Delete old banner if exists
            if (event.bannerImage?.public_id) {
                await destroyOnCloudinary(event.bannerImage.public_id, "events/banners");
            }
            const uploadedBanner = await uploadOnCloudinary(
                req.files.bannerImage[0].path, 
                "events/banners", 
                req.user, 
                req.files.bannerImage[0].originalname
            );
            if (uploadedBanner) {
                event.bannerImage = {
                    public_id: uploadedBanner.public_id,
                    secure_url: uploadedBanner.secure_url
                };
            }
        }
    }

    event.updatedBy = userId;
    await event.save();

    // Populate for response
    await event.populate("createdBy", "username avatar");

    await logActivity(
        userId,
        "event_updated",
        `Updated event: ${event.name}`,
        req,
        "event",
        eventId
    );

    res.status(200).json({
        success: true,
        message: "Event updated successfully",
        event
    });
});

// ============================================
// DELETE EVENT
// ============================================

const deleteEvent = asyncHandler(async (req, res, next) => {
    const { eventId } = req.params;
    const userId = req.user._id;

    const event = await Event.findById(eventId);

    if (!event || event.isDeleted) {
        return next(new ErrorHandler("Event not found", 404));
    }

    if (event.createdBy.toString() !== userId.toString()) {
        return next(new ErrorHandler("You can only delete your own events", 403));
    }

    // Allow deletion only for events that haven't started yet
    const nonStartedStatuses = ["draft", "scheduled", "enrollment_open", "enrollment_closed", "upcoming"];
    if (!nonStartedStatuses.includes(event.status)) {
        return next(new ErrorHandler("Cannot delete events that have already started", 400));
    }

    await Event.findByIdAndUpdate(eventId, {
        isDeleted: true,
        deletedAt: new Date()
    });

    await logActivity(
        userId,
        "event_deleted",
        `Deleted event: ${event.name}`,
        req,
        'event',
        eventId
    );

    res.status(200).json({
        success: true,
        message: "Event deleted successfully"
    });
});

// ============================================
// JOIN EVENT (Enroll)
// ============================================
// User enrolls in an event
// Entry fee is deducted if applicable
// User receives a unique access token for secure gameplay link

const joinEvent = asyncHandler(async (req, res, next) => {
    const { eventId } = req.params;
    const userId = req.user._id;

    const event = await Event.findById(eventId);
    const user = await User.findById(userId);

    if (!event || event.isDeleted) {
        return next(new ErrorHandler("Event not found", 404));
    }

    // Check if already enrolled
    if (event.isUserEnrolled(userId)) {
        return next(new ErrorHandler("You have already enrolled in this event", 400));
    }

    // Check enrollment window
    const now = new Date();
    const enrollmentStart = event.schedule.enrollmentStartTime || new Date(0);
    const enrollmentEnd = event.schedule.enrollmentEndTime || event.schedule.startTime;
    
    if (now < enrollmentStart) {
        return next(new ErrorHandler("Enrollment has not started yet", 400));
    }
    if (now > enrollmentEnd) {
        return next(new ErrorHandler("Enrollment period has ended", 400));
    }

    // Check if event is full
    if (event.currentParticipants >= event.maxParticipants) {
        if (event.waitlistEnabled) {
            // Add to waitlist logic here
            return next(new ErrorHandler("Event is full. You have been added to the waitlist.", 200));
        }
        return next(new ErrorHandler("Event is full", 400));
    }

    // Handle entry fee
    let entryFeePaid = 0;
    if (event.entryFee > 0) {
        const wallet = await Wallet.findOne({ user: userId });
        if (!wallet || wallet.totalBalance < event.entryFee) {
            return next(new ErrorHandler("Insufficient balance to join this event", 400));
        }

        await wallet.deductCoins(
            event.entryFee, 
            eventId, 
            "Event", 
            `Entry fee for ${event.name}`
        );
        entryFeePaid = event.entryFee;
    }

    // Enroll user using the model method
    try {
        await event.enrollUser(userId, entryFeePaid);
    } catch (error) {
        // Refund if enrollment fails
        if (entryFeePaid > 0) {
            const wallet = await Wallet.findOne({ user: userId });
            await wallet.addCoins(
                entryFeePaid, 
                "refund", 
                eventId, 
                "Event", 
                `Refund for failed enrollment: ${event.name}`
            );
        }
        return next(new ErrorHandler(error.message, 400));
    }

    await logActivity(
        userId,
        "event_enrolled",
        `${user.username} enrolled in event: ${event.name}`,
        req,
        "event",
        eventId
    );

    res.status(200).json({
        success: true,
        message: `Successfully enrolled in ${event.name}`,
        data: {
            eventId: event._id,
            eventName: event.name,
            currentParticipants: event.currentParticipants,
            spotsRemaining: event.maxParticipants - event.currentParticipants,
            entryFeePaid,
            schedule: {
                startTime: event.schedule.startTime,
                endTime: event.schedule.endTime
            },
            accessLinkActivatesAt: new Date(
                event.schedule.startTime.getTime() - 
                (event.accessLink?.activationMinutes || 1) * 60 * 1000
            )
        }
    });
});

// ============================================
// LEAVE EVENT (Withdraw)
// ============================================
// User withdraws from an event before it starts
// Refund calculated based on returnPolicy

const leaveEvent = asyncHandler(async (req, res, next) => {
    const { eventId } = req.params;
    const userId = req.user._id;

    const event = await Event.findById(eventId);
    const user = await User.findById(userId);

    if (!event || event.isDeleted) {
        return next(new ErrorHandler("Event not found", 404));
    }

    // Check if enrolled
    const participant = event.participants.find(
        p => p.user.toString() === userId.toString()
    );

    if (!participant) {
        return next(new ErrorHandler("You are not enrolled in this event", 400));
    }

    // Check if can withdraw
    if (participant.status === "started" || participant.status === "completed") {
        return next(new ErrorHandler("Cannot withdraw after starting the event", 400));
    }

    if (participant.status === "withdrawn") {
        return next(new ErrorHandler("You have already withdrawn from this event", 400));
    }

    // Calculate refund based on return policy
    const refundAmount = event.calculateRefund(participant.entryFeePaid);

    // Update participant status
    participant.status = "withdrawn";
    participant.refundStatus = refundAmount > 0 ? "approved" : "none";
    participant.refundAmount = refundAmount;
    event.currentParticipants -= 1;
    await event.save();

    // Process refund if applicable
    if (refundAmount > 0) {
        const wallet = await Wallet.findOne({ user: userId });
        if (wallet) {
            await wallet.addCoins(
                refundAmount, 
                "refund", 
                eventId, 
                "Event", 
                `Refund for leaving ${event.name}`
            );
            
            // Update refund status
            participant.refundStatus = "processed";
            participant.refundedAt = new Date();
            await event.save();
        }
    }

    await logActivity(
        userId,
        "event_withdrawn",
        `${user.username} withdrew from event: ${event.name}`,
        req,
        "event",
        eventId
    );

    res.status(200).json({
        success: true,
        message: `Successfully withdrew from ${event.name}`,
        data: {
            refundAmount,
            refundStatus: participant.refundStatus,
            originalFee: participant.entryFeePaid
        }
    });
});

// ============================================
// SUBMIT TO EVENT
// ============================================

const submitToEvent = asyncHandler(async (req, res, next) => {
    const { eventId } = req.params;
    const { content, score } = req.body;
    const userId = req.user._id;

    const event = await Event.findById(eventId);

    if (!event || event.isDeleted) {
        return next(new ErrorHandler("Event not found", 404));
    }

    if (event.status !== 'ongoing') {
        return next(new ErrorHandler("Event is not currently accepting submissions", 400));
    }

    const submission = event.submissions.find(sub => sub.user.toString() === userId.toString());

    if (!submission) {
        return next(new ErrorHandler("You must join the event before submitting", 400));
    }

    if (submission.content) {
        return next(new ErrorHandler("You have already submitted to this event", 400));
    }

    submission.content = content || {};
    submission.score = score || 0;
    submission.submittedAt = new Date();

    await event.save();

    await logActivity(
        userId,
        "event_submitted",
        `Submitted to event: ${event.name}`,
        req,
        'event',
        eventId
    );

    res.status(200).json({
        success: true,
        message: "Submission successful",
        submission: {
            content: submission.content,
            score: submission.score,
            submittedAt: submission.submittedAt
        }
    });
});

// ============================================
// GET EVENT LEADERBOARD
// ============================================

const getEventLeaderboard = asyncHandler(async (req, res, next) => {
    const { eventId } = req.params;

    const event = await Event.findById(eventId)
        .populate('submissions.user', 'username avatar')
        .select('submissions winner name');

    if (!event || event.isDeleted) {
        return next(new ErrorHandler("Event not found", 404));
    }

    const leaderboard = event.submissions
        .filter(sub => sub.score !== undefined)
        .sort((a, b) => (b.score || 0) - (a.score || 0))
        .map((sub, index) => ({
            rank: index + 1,
            user: sub.user,
            score: sub.score,
            submittedAt: sub.submittedAt,
            isWinner: event.winner && event.winner.toString() === sub.user._id.toString()
        }));

    res.status(200).json({
        success: true,
        event: {
            _id: event._id,
            name: event.name,
            winner: event.winner
        },
        leaderboard
    });
});

// ============================================
// GET USER EVENTS
// ============================================

const getUserEvents = asyncHandler(async (req, res, next) => {
    const userId = req.user._id;
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 10;
    const type = req.query.type; // 'created', 'enrolled'
    const skip = (page - 1) * limit;

    let filter = { isDeleted: false };

    if (type === 'created') {
        // Events created by the user (for admins/moderators)
        filter.createdBy = userId;
    } else if (type === 'enrolled' || type === 'joined') {
        // Events the user has enrolled in
        filter["participants.user"] = userId;
        // Exclude withdrawn participants
        filter["participants.status"] = { $ne: "withdrawn" };
    } else {
        // Default: Only show enrolled events (not created)
        filter["participants.user"] = userId;
        filter["participants.status"] = { $ne: "withdrawn" };
    }

    const events = await Event.find(filter)
        .populate("createdBy", "username avatar")
        .populate("winner", "username avatar")
        .sort({ createdAt: -1 })
        .skip(skip)
        .limit(limit);

    const totalEvents = await Event.countDocuments(filter);

    res.status(200).json({
        success: true,
        events,
        pagination: {
            currentPage: page,
            totalPages: Math.ceil(totalEvents / limit),
            totalEvents,
            hasNext: page * limit < totalEvents,
            hasPrev: page > 1
        }
    });
});

// ============================================
// GET ACCESS LINK
// ============================================
// Returns the secure access link for an enrolled user
// Link only activates X minutes before event start (configurable)

const getAccessLink = asyncHandler(async (req, res, next) => {
    const { eventId } = req.params;
    const userId = req.user._id;

    const event = await Event.findById(eventId).select("+participants.accessToken");

    if (!event || event.isDeleted) {
        return next(new ErrorHandler("Event not found", 404));
    }

    // Check if user is enrolled
    if (!event.isUserEnrolled(userId)) {
        return next(new ErrorHandler("You must be enrolled to get the access link", 403));
    }

    // Generate access link
    const accessLinkResult = event.generateAccessLink(userId);

    res.status(200).json({
        success: true,
        data: {
            eventId: event._id,
            eventName: event.name,
            ...accessLinkResult,
            schedule: {
                startTime: event.schedule.startTime,
                endTime: event.schedule.endTime
            }
        }
    });
});

// ============================================
// VALIDATE ACCESS TOKEN (For external platforms)
// ============================================
// Called by the gameplay platform to validate a user's token

const validateAccessToken = asyncHandler(async (req, res, next) => {
    const { eventId, userId, token } = req.body;

    if (!eventId || !userId || !token) {
        return next(new ErrorHandler("eventId, userId, and token are required", 400));
    }

    const event = await Event.findById(eventId).select("+participants.accessToken +accessLink.secretKey");

    if (!event || event.isDeleted) {
        return next(new ErrorHandler("Event not found", 404));
    }

    const validationResult = event.validateAccessToken(userId, token);

    if (!validationResult.valid) {
        return res.status(401).json({
            success: false,
            valid: false,
            reason: validationResult.reason
        });
    }

    // Return event details needed for gameplay
    res.status(200).json({
        success: true,
        valid: true,
        data: {
            eventId: event._id,
            eventName: event.name,
            category: event.category,
            contentModel: event.content?.model,
            contentRef: event.content?.ref,
            schedule: {
                startTime: event.schedule.startTime,
                endTime: event.schedule.endTime
            },
            security: event.accessLink.security,
            participantStatus: validationResult.participant?.status
        }
    });
});

// ============================================
// MARK EVENT STARTED (For external platforms)
// ============================================
// Called when user starts the actual gameplay

const markEventStarted = asyncHandler(async (req, res, next) => {
    const { eventId, userId, deviceFingerprint } = req.body;

    if (!eventId || !userId) {
        return next(new ErrorHandler("eventId and userId are required", 400));
    }

    const event = await Event.findById(eventId);

    if (!event || event.isDeleted) {
        return next(new ErrorHandler("Event not found", 404));
    }

    try {
        await event.markStarted(userId, deviceFingerprint);
        
        res.status(200).json({
            success: true,
            message: "Event started for user",
            data: {
                startedAt: new Date()
            }
        });
    } catch (error) {
        return next(new ErrorHandler(error.message, 400));
    }
});

// ============================================
// RECORD TAB SWITCH (For external platforms)
// ============================================
// Called when tab switch is detected on gameplay platform

const recordTabSwitch = asyncHandler(async (req, res, next) => {
    const { eventId, userId } = req.body;

    if (!eventId || !userId) {
        return next(new ErrorHandler("eventId and userId are required", 400));
    }

    const event = await Event.findById(eventId);

    if (!event || event.isDeleted) {
        return next(new ErrorHandler("Event not found", 404));
    }

    const result = event.recordTabSwitch(userId);

    res.status(200).json({
        success: true,
        data: result
    });
});

// ============================================
// GET EVENT POLICIES
// ============================================
// Returns reward and return policies for an event

const getEventPolicies = asyncHandler(async (req, res, next) => {
    const { eventId } = req.params;

    const event = await Event.findById(eventId)
        .select("name rewardPolicy returnPolicy entryFee prizePool");

    if (!event || event.isDeleted) {
        return next(new ErrorHandler("Event not found", 404));
    }

    res.status(200).json({
        success: true,
        data: {
            eventId: event._id,
            eventName: event.name,
            entryFee: event.entryFee,
            prizePool: event.prizePool,
            rewardPolicy: event.rewardPolicy,
            returnPolicy: event.returnPolicy
        }
    });
});

// ============================================
// REQUEST REFUND
// ============================================
// User requests a refund based on return policy

const requestRefund = asyncHandler(async (req, res, next) => {
    const { eventId } = req.params;
    const userId = req.user._id;
    const { reason } = req.body;

    const event = await Event.findById(eventId);

    if (!event || event.isDeleted) {
        return next(new ErrorHandler("Event not found", 404));
    }

    const participant = event.participants.find(
        p => p.user.toString() === userId.toString()
    );

    if (!participant) {
        return next(new ErrorHandler("You are not enrolled in this event", 400));
    }

    if (participant.status === "started" || participant.status === "completed") {
        return next(new ErrorHandler("Cannot request refund after starting the event", 400));
    }

    if (participant.refundStatus !== "none") {
        return next(new ErrorHandler(`Refund already ${participant.refundStatus}`, 400));
    }

    // Calculate refund amount
    const refundAmount = event.calculateRefund(participant.entryFeePaid);

    if (refundAmount === 0) {
        return next(new ErrorHandler("Not eligible for refund based on return policy", 400));
    }

    // Update participant
    participant.refundStatus = "requested";
    participant.refundAmount = refundAmount;
    await event.save();

    await logActivity(
        userId,
        "refund_requested",
        `Requested refund for event: ${event.name}`,
        req,
        "event",
        eventId
    );

    res.status(200).json({
        success: true,
        message: "Refund requested successfully",
        data: {
            refundAmount,
            status: "requested",
            processingDays: event.returnPolicy.processingDays
        }
    });
});

// ============================================
// EXPORTS
// ============================================

export {
    createEvent,
    getAllEvents,
    getEventById,
    updateEvent,
    deleteEvent,
    joinEvent,
    leaveEvent,
    submitToEvent,
    getEventLeaderboard,
    getUserEvents,
    getAccessLink,
    validateAccessToken,
    markEventStarted,
    recordTabSwitch,
    getEventPolicies,
    requestRefund
};
