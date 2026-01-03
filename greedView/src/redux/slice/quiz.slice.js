import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { quizAPI } from '../../api/quiz.api';

// ============================================
// ASYNC THUNKS
// ============================================

// Get all quizzes
export const getAllQuizzes = createAsyncThunk(
    'quiz/getAllQuizzes',
    async ({ page = 1, limit = 10, category, status }, { rejectWithValue }) => {
        try {
            const response = await quizAPI.getAllQuizzes(page, limit, category, status);
            return response.data;
        } catch (error) {
            return rejectWithValue(error.response?.data?.message || 'Failed to get quizzes');
        }
    }
);

// Get quiz by ID
export const getQuizById = createAsyncThunk(
    'quiz/getQuizById',
    async (quizId, { rejectWithValue }) => {
        try {
            const response = await quizAPI.getQuizById(quizId);
            return response.data;
        } catch (error) {
            return rejectWithValue(error.response?.data?.message || 'Failed to get quiz');
        }
    }
);

// Get quiz leaderboard
export const getQuizLeaderboard = createAsyncThunk(
    'quiz/getQuizLeaderboard',
    async ({ quizId, limit = 10 }, { rejectWithValue }) => {
        try {
            const response = await quizAPI.getQuizLeaderboard(quizId, limit);
            return response.data;
        } catch (error) {
            return rejectWithValue(error.response?.data?.message || 'Failed to get leaderboard');
        }
    }
);

// Create quiz
export const createQuiz = createAsyncThunk(
    'quiz/createQuiz',
    async (quizData, { rejectWithValue }) => {
        try {
            const response = await quizAPI.createQuiz(quizData);
            return response.data;
        } catch (error) {
            return rejectWithValue(error.response?.data?.message || 'Failed to create quiz');
        }
    }
);

// Update quiz
export const updateQuiz = createAsyncThunk(
    'quiz/updateQuiz',
    async ({ quizId, quizData }, { rejectWithValue }) => {
        try {
            const response = await quizAPI.updateQuiz(quizId, quizData);
            return response.data;
        } catch (error) {
            return rejectWithValue(error.response?.data?.message || 'Failed to update quiz');
        }
    }
);

// Delete quiz
export const deleteQuiz = createAsyncThunk(
    'quiz/deleteQuiz',
    async (quizId, { rejectWithValue }) => {
        try {
            const response = await quizAPI.deleteQuiz(quizId);
            return response.data;
        } catch (error) {
            return rejectWithValue(error.response?.data?.message || 'Failed to delete quiz');
        }
    }
);

// Start quiz
export const startQuiz = createAsyncThunk(
    'quiz/startQuiz',
    async (quizId, { rejectWithValue }) => {
        try {
            const response = await quizAPI.startQuiz(quizId);
            return response.data;
        } catch (error) {
            return rejectWithValue(error.response?.data?.message || 'Failed to start quiz');
        }
    }
);

// Submit quiz
export const submitQuiz = createAsyncThunk(
    'quiz/submitQuiz',
    async ({ quizId, answers }, { rejectWithValue }) => {
        try {
            const response = await quizAPI.submitQuiz(quizId, answers);
            return response.data;
        } catch (error) {
            return rejectWithValue(error.response?.data?.message || 'Failed to submit quiz');
        }
    }
);

// Get user's quizzes
export const getUserQuizzes = createAsyncThunk(
    'quiz/getUserQuizzes',
    async ({ page = 1, limit = 10 }, { rejectWithValue }) => {
        try {
            const response = await quizAPI.getUserQuizzes(page, limit);
            return response.data;
        } catch (error) {
            return rejectWithValue(error.response?.data?.message || 'Failed to get user quizzes');
        }
    }
);

// ============================================
// SLICE
// ============================================

const initialState = {
    quizzes: [],
    currentQuiz: null,
    leaderboard: [],
    userQuizzes: [],
    activeQuizSession: null, // For ongoing quiz
    quizResults: null, // For completed quiz results
    pagination: {
        currentPage: 1,
        totalPages: 1,
        totalQuizzes: 0,
        hasNextPage: false,
        hasPrevPage: false,
    },
    userQuizzesPagination: {
        currentPage: 1,
        totalPages: 1,
        totalQuizzes: 0,
        hasNextPage: false,
        hasPrevPage: false,
    },
    loading: {
        getAllQuizzes: false,
        getQuizById: false,
        getQuizLeaderboard: false,
        createQuiz: false,
        updateQuiz: false,
        deleteQuiz: false,
        startQuiz: false,
        submitQuiz: false,
        getUserQuizzes: false,
    },
    error: {
        getAllQuizzes: null,
        getQuizById: null,
        getQuizLeaderboard: null,
        createQuiz: null,
        updateQuiz: null,
        deleteQuiz: null,
        startQuiz: null,
        submitQuiz: null,
        getUserQuizzes: null,
    },
};

const quizSlice = createSlice({
    name: 'quiz',
    initialState,
    reducers: {
        // Clear specific error
        clearError: (state, action) => {
            const errorType = action.payload;
            if (state.error[errorType]) {
                state.error[errorType] = null;
            }
        },

        // Clear all errors
        clearAllErrors: (state) => {
            Object.keys(state.error).forEach(key => {
                state.error[key] = null;
            });
        },

        // Reset quiz state
        resetQuizState: (state) => {
            state.quizzes = [];
            state.currentQuiz = null;
            state.leaderboard = [];
            state.userQuizzes = [];
            state.activeQuizSession = null;
            state.quizResults = null;
            state.pagination = {
                currentPage: 1,
                totalPages: 1,
                totalQuizzes: 0,
                hasNextPage: false,
                hasPrevPage: false,
            };
            state.userQuizzesPagination = {
                currentPage: 1,
                totalPages: 1,
                totalQuizzes: 0,
                hasNextPage: false,
                hasPrevPage: false,
            };
            Object.keys(state.loading).forEach(key => {
                state.loading[key] = false;
            });
            Object.keys(state.error).forEach(key => {
                state.error[key] = null;
            });
        },

        // Set active quiz session
        setActiveQuizSession: (state, action) => {
            state.activeQuizSession = action.payload;
        },

        // Clear active quiz session
        clearActiveQuizSession: (state) => {
            state.activeQuizSession = null;
        },

        // Update quiz answers locally
        updateQuizAnswers: (state, action) => {
            if (state.activeQuizSession) {
                state.activeQuizSession.answers = {
                    ...state.activeQuizSession.answers,
                    ...action.payload
                };
            }
        },
    },
    extraReducers: (builder) => {
        // Get all quizzes
        builder
            .addCase(getAllQuizzes.pending, (state) => {
                state.loading.getAllQuizzes = true;
                state.error.getAllQuizzes = null;
            })
            .addCase(getAllQuizzes.fulfilled, (state, action) => {
                state.loading.getAllQuizzes = false;
                state.quizzes = action.payload.quizzes || [];
                state.pagination = {
                    currentPage: action.payload.currentPage || 1,
                    totalPages: action.payload.totalPages || 1,
                    totalQuizzes: action.payload.totalQuizzes || 0,
                    hasNextPage: action.payload.hasNextPage || false,
                    hasPrevPage: action.payload.hasPrevPage || false,
                };
            })
            .addCase(getAllQuizzes.rejected, (state, action) => {
                state.loading.getAllQuizzes = false;
                state.error.getAllQuizzes = action.payload;
            })

        // Get quiz by ID
            .addCase(getQuizById.pending, (state) => {
                state.loading.getQuizById = true;
                state.error.getQuizById = null;
            })
            .addCase(getQuizById.fulfilled, (state, action) => {
                state.loading.getQuizById = false;
                state.currentQuiz = action.payload;
            })
            .addCase(getQuizById.rejected, (state, action) => {
                state.loading.getQuizById = false;
                state.error.getQuizById = action.payload;
            })

        // Get quiz leaderboard
            .addCase(getQuizLeaderboard.pending, (state) => {
                state.loading.getQuizLeaderboard = true;
                state.error.getQuizLeaderboard = null;
            })
            .addCase(getQuizLeaderboard.fulfilled, (state, action) => {
                state.loading.getQuizLeaderboard = false;
                state.leaderboard = action.payload.leaderboard || [];
            })
            .addCase(getQuizLeaderboard.rejected, (state, action) => {
                state.loading.getQuizLeaderboard = false;
                state.error.getQuizLeaderboard = action.payload;
            })

        // Create quiz
            .addCase(createQuiz.pending, (state) => {
                state.loading.createQuiz = true;
                state.error.createQuiz = null;
            })
            .addCase(createQuiz.fulfilled, (state, action) => {
                state.loading.createQuiz = false;
                state.quizzes.unshift(action.payload);
            })
            .addCase(createQuiz.rejected, (state, action) => {
                state.loading.createQuiz = false;
                state.error.createQuiz = action.payload;
            })

        // Update quiz
            .addCase(updateQuiz.pending, (state) => {
                state.loading.updateQuiz = true;
                state.error.updateQuiz = null;
            })
            .addCase(updateQuiz.fulfilled, (state, action) => {
                state.loading.updateQuiz = false;
                const index = state.quizzes.findIndex(quiz => quiz._id === action.payload._id);
                if (index !== -1) {
                    state.quizzes[index] = action.payload;
                }
                if (state.currentQuiz && state.currentQuiz._id === action.payload._id) {
                    state.currentQuiz = action.payload;
                }
            })
            .addCase(updateQuiz.rejected, (state, action) => {
                state.loading.updateQuiz = false;
                state.error.updateQuiz = action.payload;
            })

        // Delete quiz
            .addCase(deleteQuiz.pending, (state) => {
                state.loading.deleteQuiz = true;
                state.error.deleteQuiz = null;
            })
            .addCase(deleteQuiz.fulfilled, (state, action) => {
                state.loading.deleteQuiz = false;
                state.quizzes = state.quizzes.filter(quiz => quiz._id !== action.meta.arg);
                if (state.currentQuiz && state.currentQuiz._id === action.meta.arg) {
                    state.currentQuiz = null;
                }
            })
            .addCase(deleteQuiz.rejected, (state, action) => {
                state.loading.deleteQuiz = false;
                state.error.deleteQuiz = action.payload;
            })

        // Start quiz
            .addCase(startQuiz.pending, (state) => {
                state.loading.startQuiz = true;
                state.error.startQuiz = null;
            })
            .addCase(startQuiz.fulfilled, (state, action) => {
                state.loading.startQuiz = false;
                state.activeQuizSession = action.payload;
            })
            .addCase(startQuiz.rejected, (state, action) => {
                state.loading.startQuiz = false;
                state.error.startQuiz = action.payload;
            })

        // Submit quiz
            .addCase(submitQuiz.pending, (state) => {
                state.loading.submitQuiz = true;
                state.error.submitQuiz = null;
            })
            .addCase(submitQuiz.fulfilled, (state, action) => {
                state.loading.submitQuiz = false;
                state.quizResults = action.payload;
                state.activeQuizSession = null;
            })
            .addCase(submitQuiz.rejected, (state, action) => {
                state.loading.submitQuiz = false;
                state.error.submitQuiz = action.payload;
            })

        // Get user quizzes
            .addCase(getUserQuizzes.pending, (state) => {
                state.loading.getUserQuizzes = true;
                state.error.getUserQuizzes = null;
            })
            .addCase(getUserQuizzes.fulfilled, (state, action) => {
                state.loading.getUserQuizzes = false;
                state.userQuizzes = action.payload.quizzes || [];
                state.userQuizzesPagination = {
                    currentPage: action.payload.currentPage || 1,
                    totalPages: action.payload.totalPages || 1,
                    totalQuizzes: action.payload.totalQuizzes || 0,
                    hasNextPage: action.payload.hasNextPage || false,
                    hasPrevPage: action.payload.hasPrevPage || false,
                };
            })
            .addCase(getUserQuizzes.rejected, (state, action) => {
                state.loading.getUserQuizzes = false;
                state.error.getUserQuizzes = action.payload;
            });
    },
});

export const {
    clearError,
    clearAllErrors,
    resetQuizState,
    setActiveQuizSession,
    clearActiveQuizSession,
    updateQuizAnswers
} = quizSlice.actions;
export default quizSlice.reducer;
