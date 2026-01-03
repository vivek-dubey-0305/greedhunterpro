import axiosInstance from './axiosInstance';

// ============================================
// QUIZ APIs
// ============================================

export const quizAPI = {
    // Get all quizzes (public)
    getAllQuizzes: async (page = 1, limit = 10, category, status) => {
        const response = await axiosInstance.get('/quiz', {
            params: { page, limit, category, status }
        });
        return response.data;
    },

    // Get quiz by ID (public)
    getQuizById: async (quizId) => {
        const response = await axiosInstance.get(`/quiz/${quizId}`);
        return response.data;
    },

    // Get quiz leaderboard (public)
    getQuizLeaderboard: async (quizId, limit = 10) => {
        const response = await axiosInstance.get(`/quiz/${quizId}/leaderboard`, {
            params: { limit }
        });
        return response.data;
    },

    // Create quiz
    createQuiz: async (quizData) => {
        const response = await axiosInstance.post('/quiz', quizData);
        return response.data;
    },

    // Update quiz
    updateQuiz: async (quizId, quizData) => {
        const response = await axiosInstance.put(`/quiz/${quizId}`, quizData);
        return response.data;
    },

    // Delete quiz
    deleteQuiz: async (quizId) => {
        const response = await axiosInstance.delete(`/quiz/${quizId}`);
        return response.data;
    },

    // Start quiz
    startQuiz: async (quizId) => {
        const response = await axiosInstance.post(`/quiz/${quizId}/start`);
        return response.data;
    },

    // Submit quiz
    submitQuiz: async (quizId, answers) => {
        const response = await axiosInstance.post(`/quiz/${quizId}/submit`, { answers });
        return response.data;
    },

    // Get user's quizzes
    getUserQuizzes: async (page = 1, limit = 10) => {
        const response = await axiosInstance.get('/quiz/user/my-quizzes', {
            params: { page, limit }
        });
        return response.data;
    },
};
