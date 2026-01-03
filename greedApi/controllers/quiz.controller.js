import { asyncHandler } from "../middlewares/asyncHandler.middleware.js";
import ErrorHandler from "../middlewares/error.middleware.js";
import { Quiz } from "../models/quiz.model.js";
import { User } from "../models/user.model.js";
import { Wallet } from "../models/wallet.model.js";
import { logActivity } from "../utils/logActivity.utils.js";

// ============================================
// CREATE QUIZ
// ============================================

const createQuiz = asyncHandler(async (req, res, next) => {
    const {
        title,
        description,
        options,
        correctAnswer,
        difficulty,
        tags,
        timeLimit,
        maxParticipants,
        expectedCompletionTime,
        baseScore,
        difficultyMultiplier,
        startTime,
        endTime
    } = req.body;

    const userId = req.user._id;

    // Validate required fields
    if (!title || !description || !options || !correctAnswer || !difficulty || !timeLimit || !maxParticipants || !startTime || !endTime || !baseScore || !difficultyMultiplier) {
        return next(new ErrorHandler("All required fields must be provided", 400));
    }

    // Validate options array
    if (!Array.isArray(options) || options.length < 2) {
        return next(new ErrorHandler("At least 2 options are required", 400));
    }

    // Validate correct answer
    if (!options.includes(correctAnswer)) {
        return next(new ErrorHandler("Correct answer must be one of the options", 400));
    }

    // Validate times
    const start = new Date(startTime);
    const end = new Date(endTime);

    if (start >= end) {
        return next(new ErrorHandler("End time must be after start time", 400));
    }

    if (start <= new Date()) {
        return next(new ErrorHandler("Start time must be in the future", 400));
    }

    const quiz = await Quiz.create({
        title,
        description,
        options,
        correctAnswer,
        difficulty,
        tags: tags || [],
        timeLimit,
        maxParticipants,
        expectedCompletionTime,
        createdBy: userId,
        baseScore,
        difficultyMultiplier,
        startTime: start,
        endTime: end
    });

    await logActivity(
        userId,
        "quiz_created",
        `Created quiz: ${title}`,
        req,
        'quiz',
        quiz._id
    );

    res.status(201).json({
        success: true,
        message: "Quiz created successfully",
        quiz
    });
});

// ============================================
// GET ALL QUIZZES
// ============================================

const getAllQuizzes = asyncHandler(async (req, res, next) => {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 10;
    const status = req.query.status; // upcoming, ongoing, completed
    const difficulty = req.query.difficulty;
    const tags = req.query.tags; // comma-separated
    const skip = (page - 1) * limit;

    const filter = { isDeleted: false };

    if (status) {
        filter.status = status;
    }

    if (difficulty) {
        filter.difficulty = difficulty;
    }

    if (tags) {
        const tagArray = tags.split(',').map(tag => tag.trim());
        filter.tags = { $in: tagArray };
    }

    const quizzes = await Quiz.find(filter)
        .populate('createdBy', 'username avatar')
        .populate('winner', 'username avatar')
        .sort({ createdAt: -1 })
        .skip(skip)
        .limit(limit);

    const totalQuizzes = await Quiz.countDocuments(filter);

    res.status(200).json({
        success: true,
        quizzes,
        pagination: {
            currentPage: page,
            totalPages: Math.ceil(totalQuizzes / limit),
            totalQuizzes,
            hasNext: page * limit < totalQuizzes,
            hasPrev: page > 1
        }
    });
});

// ============================================
// GET QUIZ BY ID
// ============================================

const getQuizById = asyncHandler(async (req, res, next) => {
    const { quizId } = req.params;

    const quiz = await Quiz.findById(quizId)
        .populate('createdBy', 'username avatar bio')
        .populate('winner', 'username avatar')
        .populate('participants.user', 'username avatar');

    if (!quiz || quiz.isDeleted) {
        return next(new ErrorHandler("Quiz not found", 404));
    }

    // Don't show correct answer and full participant details to non-creators
    const quizData = quiz.toObject();
    if (quiz.createdBy._id.toString() !== req.user?._id?.toString()) {
        delete quizData.correctAnswer;
        quizData.participants = quizData.participants.map(p => ({
            user: p.user,
            timeTaken: p.timeTaken,
            scoreObtained: p.scoreObtained,
            finalScore: p.finalScore,
            submittedAt: p.submittedAt
        }));
    }

    res.status(200).json({
        success: true,
        quiz: quizData
    });
});

// ============================================
// UPDATE QUIZ
// ============================================

const updateQuiz = asyncHandler(async (req, res, next) => {
    const { quizId } = req.params;
    const userId = req.user._id;
    const updateData = req.body;

    const quiz = await Quiz.findById(quizId);

    if (!quiz || quiz.isDeleted) {
        return next(new ErrorHandler("Quiz not found", 404));
    }

    if (quiz.createdBy.toString() !== userId.toString()) {
        return next(new ErrorHandler("You can only update your own quizzes", 403));
    }

    if (quiz.status !== 'upcoming') {
        return next(new ErrorHandler("Cannot update quizzes that have already started", 400));
    }

    // Validate options and correct answer if being updated
    if (updateData.options) {
        if (!Array.isArray(updateData.options) || updateData.options.length < 2) {
            return next(new ErrorHandler("At least 2 options are required", 400));
        }
        if (updateData.correctAnswer && !updateData.options.includes(updateData.correctAnswer)) {
            return next(new ErrorHandler("Correct answer must be one of the options", 400));
        }
    }

    // Validate times if being updated
    if (updateData.startTime || updateData.endTime) {
        const start = new Date(updateData.startTime || quiz.startTime);
        const end = new Date(updateData.endTime || quiz.endTime);

        if (start >= end) {
            return next(new ErrorHandler("End time must be after start time", 400));
        }
    }

    const updatedQuiz = await Quiz.findByIdAndUpdate(
        quizId,
        updateData,
        { new: true, runValidators: true }
    ).populate('createdBy', 'username avatar');

    await logActivity(
        userId,
        "quiz_updated",
        `Updated quiz: ${updatedQuiz.title}`,
        req,
        'quiz',
        quizId
    );

    res.status(200).json({
        success: true,
        message: "Quiz updated successfully",
        quiz: updatedQuiz
    });
});

// ============================================
// DELETE QUIZ
// ============================================

const deleteQuiz = asyncHandler(async (req, res, next) => {
    const { quizId } = req.params;
    const userId = req.user._id;

    const quiz = await Quiz.findById(quizId);

    if (!quiz || quiz.isDeleted) {
        return next(new ErrorHandler("Quiz not found", 404));
    }

    if (quiz.createdBy.toString() !== userId.toString()) {
        return next(new ErrorHandler("You can only delete your own quizzes", 403));
    }

    if (quiz.status !== 'upcoming') {
        return next(new ErrorHandler("Cannot delete quizzes that have already started", 400));
    }

    await Quiz.findByIdAndUpdate(quizId, {
        isDeleted: true,
        deletedAt: new Date()
    });

    await logActivity(
        userId,
        "quiz_deleted",
        `Deleted quiz: ${quiz.title}`,
        req,
        'quiz',
        quizId
    );

    res.status(200).json({
        success: true,
        message: "Quiz deleted successfully"
    });
});

// ============================================
// START QUIZ
// ============================================

const startQuiz = asyncHandler(async (req, res, next) => {
    const { quizId } = req.params;
    const userId = req.user._id;

    const quiz = await Quiz.findById(quizId);

    if (!quiz || quiz.isDeleted) {
        return next(new ErrorHandler("Quiz not found", 404));
    }

    if (quiz.status !== 'ongoing') {
        return next(new ErrorHandler("Quiz is not currently active", 400));
    }

    if (quiz.participants.some(p => p.user.toString() === userId.toString())) {
        return next(new ErrorHandler("You have already participated in this quiz", 400));
    }

    if (quiz.currentParticipants >= quiz.maxParticipants) {
        return next(new ErrorHandler("Quiz is full", 400));
    }

    await logActivity(
        userId,
        "quiz_started",
        `Started quiz: ${quiz.title}`,
        req,
        'quiz',
        quizId
    );

    res.status(200).json({
        success: true,
        message: "Quiz started successfully",
        quiz: {
            _id: quiz._id,
            title: quiz.title,
            timeLimit: quiz.timeLimit,
            options: quiz.options,
            startTime: new Date()
        }
    });
});

// ============================================
// SUBMIT QUIZ
// ============================================

const submitQuiz = asyncHandler(async (req, res, next) => {
    const { quizId } = req.params;
    const { answer, timeTaken } = req.body;
    const userId = req.user._id;

    const quiz = await Quiz.findById(quizId);
    const user = await User.findById(userId);
    const wallet = await Wallet.findOne({ user: userId });

    if (!quiz || quiz.isDeleted) {
        return next(new ErrorHandler("Quiz not found", 404));
    }

    if (quiz.status !== 'ongoing') {
        return next(new ErrorHandler("Quiz is not accepting submissions", 400));
    }

    if (quiz.participants.some(p => p.user.toString() === userId.toString())) {
        return next(new ErrorHandler("You have already submitted this quiz", 400));
    }

    // Validate time
    if (timeTaken > quiz.timeLimit) {
        return next(new ErrorHandler("Submission time exceeded quiz time limit", 400));
    }

    // Check answer
    const isCorrect = answer === quiz.correctAnswer;
    const scoreObtained = isCorrect ? quiz.baseScore : 0;

    // Calculate final score with time factor
    const finalScore = quiz.calculateScore(timeTaken, quiz.baseScore, quiz.difficultyMultiplier);

    // Add participant
    await quiz.addParticipant(userId, timeTaken, scoreObtained);

    // Award coins if correct
    if (isCorrect && wallet) {
        await wallet.addCoins(finalScore, 'earn', quizId, 'Quiz', `Correct answer in ${quiz.title}`);
    }

    await logActivity(
        userId,
        "quiz_completed",
        `Completed quiz: ${quiz.title} - Score: ${finalScore}`,
        req,
        'quiz',
        quizId,
        null,
        { score: finalScore, correct: isCorrect, timeTaken }
    );

    res.status(200).json({
        success: true,
        message: "Quiz submitted successfully",
        result: {
            correct: isCorrect,
            scoreObtained,
            finalScore,
            timeTaken,
            isWinner: quiz.winner.toString() === userId.toString()
        }
    });
});

// ============================================
// GET QUIZ LEADERBOARD
// ============================================

const getQuizLeaderboard = asyncHandler(async (req, res, next) => {
    const { quizId } = req.params;

    const quiz = await Quiz.findById(quizId)
        .populate('participants.user', 'username avatar')
        .select('participants winner title');

    if (!quiz || quiz.isDeleted) {
        return next(new ErrorHandler("Quiz not found", 404));
    }

    const leaderboard = quiz.participants
        .sort((a, b) => b.finalScore - a.finalScore)
        .map((participant, index) => ({
            rank: index + 1,
            user: participant.user,
            timeTaken: participant.timeTaken,
            scoreObtained: participant.scoreObtained,
            finalScore: participant.finalScore,
            submittedAt: participant.submittedAt,
            isWinner: quiz.winner && quiz.winner.toString() === participant.user._id.toString()
        }));

    res.status(200).json({
        success: true,
        quiz: {
            _id: quiz._id,
            title: quiz.title,
            winner: quiz.winner
        },
        leaderboard
    });
});

// ============================================
// GET USER QUIZZES
// ============================================

const getUserQuizzes = asyncHandler(async (req, res, next) => {
    const userId = req.user._id;
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 10;
    const type = req.query.type; // 'created', 'participated'
    const skip = (page - 1) * limit;

    let filter = { isDeleted: false };

    if (type === 'created') {
        filter.createdBy = userId;
    } else if (type === 'participated') {
        filter['participants.user'] = userId;
    } else {
        // Both created and participated
        filter.$or = [
            { createdBy: userId },
            { 'participants.user': userId }
        ];
    }

    const quizzes = await Quiz.find(filter)
        .populate('createdBy', 'username avatar')
        .populate('winner', 'username avatar')
        .sort({ createdAt: -1 })
        .skip(skip)
        .limit(limit);

    const totalQuizzes = await Quiz.countDocuments(filter);

    res.status(200).json({
        success: true,
        quizzes,
        pagination: {
            currentPage: page,
            totalPages: Math.ceil(totalQuizzes / limit),
            totalQuizzes,
            hasNext: page * limit < totalQuizzes,
            hasPrev: page > 1
        }
    });
});

// ============================================
// EXPORTS
// ============================================

export {
    createQuiz,
    getAllQuizzes,
    getQuizById,
    updateQuiz,
    deleteQuiz,
    startQuiz,
    submitQuiz,
    getQuizLeaderboard,
    getUserQuizzes
};
