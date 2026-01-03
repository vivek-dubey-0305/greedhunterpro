import { Router } from "express";
import {
    createQuiz,
    getAllQuizzes,
    getQuizById,
    updateQuiz,
    deleteQuiz,
    startQuiz,
    submitQuiz,
    getQuizLeaderboard,
    getUserQuizzes
} from "../controllers/quiz.controller.js";
import { verifyJWT } from "../middlewares/auth.middleware.js";

const router = Router();

// ============================================
// PUBLIC ROUTES
// ============================================

// Get quizzes (public viewing)
router.route("/").get(getAllQuizzes);
router.route("/:quizId").get(getQuizById);
router.route("/:quizId/leaderboard").get(getQuizLeaderboard);

// ============================================
// PROTECTED ROUTES (Require Authentication)
// ============================================

// Quiz CRUD operations
router.route("/").post(verifyJWT, createQuiz);
router.route("/:quizId").put(verifyJWT, updateQuiz);
router.route("/:quizId").delete(verifyJWT, deleteQuiz);

// Quiz participation
router.route("/:quizId/start").post(verifyJWT, startQuiz);
router.route("/:quizId/submit").post(verifyJWT, submitQuiz);

// User-specific quiz routes
router.route("/user/my-quizzes").get(verifyJWT, getUserQuizzes);

export default router;
