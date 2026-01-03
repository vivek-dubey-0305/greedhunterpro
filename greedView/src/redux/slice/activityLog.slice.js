import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { activityLogAPI, adminActivityLogAPI } from '../../api/activityLog.api';

// ============================================
// ASYNC THUNKS
// ============================================

// Get user's activity log
export const getUserActivityLog = createAsyncThunk(
    'activityLog/getUserActivityLog',
    async ({ page = 1, limit = 20, type, dateFrom, dateTo }, { rejectWithValue }) => {
        try {
            const response = await activityLogAPI.getUserActivityLog(page, limit, type, dateFrom, dateTo);
            return response.data;
        } catch (error) {
            return rejectWithValue(error.response?.data?.message || 'Failed to get activity log');
        }
    }
);

// Get activity stats
export const getActivityStats = createAsyncThunk(
    'activityLog/getActivityStats',
    async (_, { rejectWithValue }) => {
        try {
            const response = await activityLogAPI.getActivityStats();
            return response.data;
        } catch (error) {
            return rejectWithValue(error.response?.data?.message || 'Failed to get activity stats');
        }
    }
);

// Search activities
export const searchActivities = createAsyncThunk(
    'activityLog/searchActivities',
    async ({ query, type, page = 1, limit = 20 }, { rejectWithValue }) => {
        try {
            const response = await activityLogAPI.searchActivities(query, type, page, limit);
            return response.data;
        } catch (error) {
            return rejectWithValue(error.response?.data?.message || 'Failed to search activities');
        }
    }
);

// Admin: Get activity log by user ID
export const getActivityLogByUserId = createAsyncThunk(
    'activityLog/getActivityLogByUserId',
    async ({ userId, page = 1, limit = 20 }, { rejectWithValue }) => {
        try {
            const response = await adminActivityLogAPI.getActivityLogByUserId(userId, page, limit);
            return response.data;
        } catch (error) {
            return rejectWithValue(error.response?.data?.message || 'Failed to get user activity log');
        }
    }
);

// Admin: Delete activity log entry
export const deleteActivityLog = createAsyncThunk(
    'activityLog/deleteActivityLog',
    async ({ userId, activityId }, { rejectWithValue }) => {
        try {
            const response = await adminActivityLogAPI.deleteActivityLog(userId, activityId);
            return response.data;
        } catch (error) {
            return rejectWithValue(error.response?.data?.message || 'Failed to delete activity log');
        }
    }
);

// Admin: Clear all user activities
export const clearUserActivities = createAsyncThunk(
    'activityLog/clearUserActivities',
    async (userId, { rejectWithValue }) => {
        try {
            const response = await adminActivityLogAPI.clearUserActivities(userId);
            return response.data;
        } catch (error) {
            return rejectWithValue(error.response?.data?.message || 'Failed to clear user activities');
        }
    }
);

// Admin: Get system activity summary
export const getSystemActivitySummary = createAsyncThunk(
    'activityLog/getSystemActivitySummary',
    async ({ dateFrom, dateTo }, { rejectWithValue }) => {
        try {
            const response = await adminActivityLogAPI.getSystemActivitySummary(dateFrom, dateTo);
            return response.data;
        } catch (error) {
            return rejectWithValue(error.response?.data?.message || 'Failed to get system summary');
        }
    }
);

// ============================================
// SLICE
// ============================================

const initialState = {
    activities: [],
    stats: null,
    searchResults: [],
    systemSummary: null,
    pagination: {
        currentPage: 1,
        totalPages: 1,
        totalActivities: 0,
        hasNextPage: false,
        hasPrevPage: false,
    },
    searchPagination: {
        currentPage: 1,
        totalPages: 1,
        totalActivities: 0,
        hasNextPage: false,
        hasPrevPage: false,
    },
    loading: {
        getUserActivityLog: false,
        getActivityStats: false,
        searchActivities: false,
        getActivityLogByUserId: false,
        deleteActivityLog: false,
        clearUserActivities: false,
        getSystemActivitySummary: false,
    },
    error: {
        getUserActivityLog: null,
        getActivityStats: null,
        searchActivities: null,
        getActivityLogByUserId: null,
        deleteActivityLog: null,
        clearUserActivities: null,
        getSystemActivitySummary: null,
    },
};

const activityLogSlice = createSlice({
    name: 'activityLog',
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

        // Reset activity log state
        resetActivityLogState: (state) => {
            state.activities = [];
            state.stats = null;
            state.searchResults = [];
            state.systemSummary = null;
            state.pagination = {
                currentPage: 1,
                totalPages: 1,
                totalActivities: 0,
                hasNextPage: false,
                hasPrevPage: false,
            };
            state.searchPagination = {
                currentPage: 1,
                totalPages: 1,
                totalActivities: 0,
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

        // Clear search results
        clearSearchResults: (state) => {
            state.searchResults = [];
            state.searchPagination = {
                currentPage: 1,
                totalPages: 1,
                totalActivities: 0,
                hasNextPage: false,
                hasPrevPage: false,
            };
        },
    },
    extraReducers: (builder) => {
        // Get user activity log
        builder
            .addCase(getUserActivityLog.pending, (state) => {
                state.loading.getUserActivityLog = true;
                state.error.getUserActivityLog = null;
            })
            .addCase(getUserActivityLog.fulfilled, (state, action) => {
                state.loading.getUserActivityLog = false;
                state.activities = action.payload.activities || [];
                state.pagination = {
                    currentPage: action.payload.currentPage || 1,
                    totalPages: action.payload.totalPages || 1,
                    totalActivities: action.payload.totalActivities || 0,
                    hasNextPage: action.payload.hasNextPage || false,
                    hasPrevPage: action.payload.hasPrevPage || false,
                };
            })
            .addCase(getUserActivityLog.rejected, (state, action) => {
                state.loading.getUserActivityLog = false;
                state.error.getUserActivityLog = action.payload;
            })

        // Get activity stats
            .addCase(getActivityStats.pending, (state) => {
                state.loading.getActivityStats = true;
                state.error.getActivityStats = null;
            })
            .addCase(getActivityStats.fulfilled, (state, action) => {
                state.loading.getActivityStats = false;
                state.stats = action.payload;
            })
            .addCase(getActivityStats.rejected, (state, action) => {
                state.loading.getActivityStats = false;
                state.error.getActivityStats = action.payload;
            })

        // Search activities
            .addCase(searchActivities.pending, (state) => {
                state.loading.searchActivities = true;
                state.error.searchActivities = null;
            })
            .addCase(searchActivities.fulfilled, (state, action) => {
                state.loading.searchActivities = false;
                state.searchResults = action.payload.activities || [];
                state.searchPagination = {
                    currentPage: action.payload.currentPage || 1,
                    totalPages: action.payload.totalPages || 1,
                    totalActivities: action.payload.totalActivities || 0,
                    hasNextPage: action.payload.hasNextPage || false,
                    hasPrevPage: action.payload.hasPrevPage || false,
                };
            })
            .addCase(searchActivities.rejected, (state, action) => {
                state.loading.searchActivities = false;
                state.error.searchActivities = action.payload;
            })

        // Admin: Get activity log by user ID
            .addCase(getActivityLogByUserId.pending, (state) => {
                state.loading.getActivityLogByUserId = true;
                state.error.getActivityLogByUserId = null;
            })
            .addCase(getActivityLogByUserId.fulfilled, (state, action) => {
                state.loading.getActivityLogByUserId = false;
                // Store in searchResults for admin view
                state.searchResults = action.payload.activities || [];
                state.searchPagination = {
                    currentPage: action.payload.currentPage || 1,
                    totalPages: action.payload.totalPages || 1,
                    totalActivities: action.payload.totalActivities || 0,
                    hasNextPage: action.payload.hasNextPage || false,
                    hasPrevPage: action.payload.hasPrevPage || false,
                };
            })
            .addCase(getActivityLogByUserId.rejected, (state, action) => {
                state.loading.getActivityLogByUserId = false;
                state.error.getActivityLogByUserId = action.payload;
            })

        // Admin: Delete activity log
            .addCase(deleteActivityLog.pending, (state) => {
                state.loading.deleteActivityLog = true;
                state.error.deleteActivityLog = null;
            })
            .addCase(deleteActivityLog.fulfilled, (state, action) => {
                state.loading.deleteActivityLog = false;
                // Remove from activities or searchResults
                state.activities = state.activities.filter(activity => activity._id !== action.meta.arg.activityId);
                state.searchResults = state.searchResults.filter(activity => activity._id !== action.meta.arg.activityId);
            })
            .addCase(deleteActivityLog.rejected, (state, action) => {
                state.loading.deleteActivityLog = false;
                state.error.deleteActivityLog = action.payload;
            })

        // Admin: Clear user activities
            .addCase(clearUserActivities.pending, (state) => {
                state.loading.clearUserActivities = true;
                state.error.clearUserActivities = null;
            })
            .addCase(clearUserActivities.fulfilled, (state) => {
                state.loading.clearUserActivities = false;
                // Clear activities for the user
                state.searchResults = [];
                state.searchPagination = {
                    currentPage: 1,
                    totalPages: 1,
                    totalActivities: 0,
                    hasNextPage: false,
                    hasPrevPage: false,
                };
            })
            .addCase(clearUserActivities.rejected, (state, action) => {
                state.loading.clearUserActivities = false;
                state.error.clearUserActivities = action.payload;
            })

        // Admin: Get system activity summary
            .addCase(getSystemActivitySummary.pending, (state) => {
                state.loading.getSystemActivitySummary = true;
                state.error.getSystemActivitySummary = null;
            })
            .addCase(getSystemActivitySummary.fulfilled, (state, action) => {
                state.loading.getSystemActivitySummary = false;
                state.systemSummary = action.payload;
            })
            .addCase(getSystemActivitySummary.rejected, (state, action) => {
                state.loading.getSystemActivitySummary = false;
                state.error.getSystemActivitySummary = action.payload;
            });
    },
});

export const { clearError, clearAllErrors, resetActivityLogState, clearSearchResults } = activityLogSlice.actions;
export default activityLogSlice.reducer;
