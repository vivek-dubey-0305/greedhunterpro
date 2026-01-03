import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { eventAPI } from '../../api/event.api';

// ============================================
// ASYNC THUNKS
// ============================================

// Get all events
export const getAllEvents = createAsyncThunk(
    'event/getAllEvents',
    async ({ page = 1, limit = 10, category, status }, { rejectWithValue }) => {
        try {
            const response = await eventAPI.getAllEvents(page, limit, category, status);
            return response.data;
        } catch (error) {
            return rejectWithValue(error.response?.data?.message || 'Failed to get events');
        }
    }
);

// Get event by ID
export const getEventById = createAsyncThunk(
    'event/getEventById',
    async (eventId, { rejectWithValue }) => {
        try {
            const response = await eventAPI.getEventById(eventId);
            return response.data;
        } catch (error) {
            return rejectWithValue(error.response?.data?.message || 'Failed to get event');
        }
    }
);

// Get event leaderboard
export const getEventLeaderboard = createAsyncThunk(
    'event/getEventLeaderboard',
    async ({ eventId, limit = 10 }, { rejectWithValue }) => {
        try {
            const response = await eventAPI.getEventLeaderboard(eventId, limit);
            return response.data;
        } catch (error) {
            return rejectWithValue(error.response?.data?.message || 'Failed to get leaderboard');
        }
    }
);

// Create event
export const createEvent = createAsyncThunk(
    'event/createEvent',
    async (eventData, { rejectWithValue }) => {
        try {
            const response = await eventAPI.createEvent(eventData);
            return response.data;
        } catch (error) {
            return rejectWithValue(error.response?.data?.message || 'Failed to create event');
        }
    }
);

// Update event
export const updateEvent = createAsyncThunk(
    'event/updateEvent',
    async ({ eventId, eventData }, { rejectWithValue }) => {
        try {
            const response = await eventAPI.updateEvent(eventId, eventData);
            return response.data;
        } catch (error) {
            return rejectWithValue(error.response?.data?.message || 'Failed to update event');
        }
    }
);

// Delete event
export const deleteEvent = createAsyncThunk(
    'event/deleteEvent',
    async (eventId, { rejectWithValue }) => {
        try {
            const response = await eventAPI.deleteEvent(eventId);
            return response.data;
        } catch (error) {
            return rejectWithValue(error.response?.data?.message || 'Failed to delete event');
        }
    }
);

// Join event
export const joinEvent = createAsyncThunk(
    'event/joinEvent',
    async (eventId, { rejectWithValue }) => {
        try {
            const response = await eventAPI.joinEvent(eventId);
            return response.data;
        } catch (error) {
            return rejectWithValue(error.response?.data?.message || 'Failed to join event');
        }
    }
);

// Submit to event
export const submitToEvent = createAsyncThunk(
    'event/submitToEvent',
    async ({ eventId, submissionData }, { rejectWithValue }) => {
        try {
            const response = await eventAPI.submitToEvent(eventId, submissionData);
            return response.data;
        } catch (error) {
            return rejectWithValue(error.response?.data?.message || 'Failed to submit to event');
        }
    }
);

// Get user's events
export const getUserEvents = createAsyncThunk(
    'event/getUserEvents',
    async ({ page = 1, limit = 10 }, { rejectWithValue }) => {
        try {
            const response = await eventAPI.getUserEvents(page, limit);
            return response.data;
        } catch (error) {
            return rejectWithValue(error.response?.data?.message || 'Failed to get user events');
        }
    }
);

// ============================================
// SLICE
// ============================================

const initialState = {
    events: [],
    currentEvent: null,
    leaderboard: [],
    userEvents: [],
    activeEventSession: null, // For ongoing event participation
    eventResults: null, // For completed event results
    pagination: {
        currentPage: 1,
        totalPages: 1,
        totalEvents: 0,
        hasNextPage: false,
        hasPrevPage: false,
    },
    userEventsPagination: {
        currentPage: 1,
        totalPages: 1,
        totalEvents: 0,
        hasNextPage: false,
        hasPrevPage: false,
    },
    loading: {
        getAllEvents: false,
        getEventById: false,
        getEventLeaderboard: false,
        createEvent: false,
        updateEvent: false,
        deleteEvent: false,
        joinEvent: false,
        submitToEvent: false,
        getUserEvents: false,
    },
    error: {
        getAllEvents: null,
        getEventById: null,
        getEventLeaderboard: null,
        createEvent: null,
        updateEvent: null,
        deleteEvent: null,
        joinEvent: null,
        submitToEvent: null,
        getUserEvents: null,
    },
};

const eventSlice = createSlice({
    name: 'event',
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

        // Reset event state
        resetEventState: (state) => {
            state.events = [];
            state.currentEvent = null;
            state.leaderboard = [];
            state.userEvents = [];
            state.activeEventSession = null;
            state.eventResults = null;
            state.pagination = {
                currentPage: 1,
                totalPages: 1,
                totalEvents: 0,
                hasNextPage: false,
                hasPrevPage: false,
            };
            state.userEventsPagination = {
                currentPage: 1,
                totalPages: 1,
                totalEvents: 0,
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

        // Set active event session
        setActiveEventSession: (state, action) => {
            state.activeEventSession = action.payload;
        },

        // Clear active event session
        clearActiveEventSession: (state) => {
            state.activeEventSession = null;
        },

        // Update event submission locally
        updateEventSubmission: (state, action) => {
            if (state.activeEventSession) {
                state.activeEventSession.submission = {
                    ...state.activeEventSession.submission,
                    ...action.payload
                };
            }
        },
    },
    extraReducers: (builder) => {
        // Get all events
        builder
            .addCase(getAllEvents.pending, (state) => {
                state.loading.getAllEvents = true;
                state.error.getAllEvents = null;
            })
            .addCase(getAllEvents.fulfilled, (state, action) => {
                state.loading.getAllEvents = false;
                state.events = action.payload.events || [];
                state.pagination = {
                    currentPage: action.payload.currentPage || 1,
                    totalPages: action.payload.totalPages || 1,
                    totalEvents: action.payload.totalEvents || 0,
                    hasNextPage: action.payload.hasNextPage || false,
                    hasPrevPage: action.payload.hasPrevPage || false,
                };
            })
            .addCase(getAllEvents.rejected, (state, action) => {
                state.loading.getAllEvents = false;
                state.error.getAllEvents = action.payload;
            })

        // Get event by ID
            .addCase(getEventById.pending, (state) => {
                state.loading.getEventById = true;
                state.error.getEventById = null;
            })
            .addCase(getEventById.fulfilled, (state, action) => {
                state.loading.getEventById = false;
                state.currentEvent = action.payload;
            })
            .addCase(getEventById.rejected, (state, action) => {
                state.loading.getEventById = false;
                state.error.getEventById = action.payload;
            })

        // Get event leaderboard
            .addCase(getEventLeaderboard.pending, (state) => {
                state.loading.getEventLeaderboard = true;
                state.error.getEventLeaderboard = null;
            })
            .addCase(getEventLeaderboard.fulfilled, (state, action) => {
                state.loading.getEventLeaderboard = false;
                state.leaderboard = action.payload.leaderboard || [];
            })
            .addCase(getEventLeaderboard.rejected, (state, action) => {
                state.loading.getEventLeaderboard = false;
                state.error.getEventLeaderboard = action.payload;
            })

        // Create event
            .addCase(createEvent.pending, (state) => {
                state.loading.createEvent = true;
                state.error.createEvent = null;
            })
            .addCase(createEvent.fulfilled, (state, action) => {
                state.loading.createEvent = false;
                state.events.unshift(action.payload);
            })
            .addCase(createEvent.rejected, (state, action) => {
                state.loading.createEvent = false;
                state.error.createEvent = action.payload;
            })

        // Update event
            .addCase(updateEvent.pending, (state) => {
                state.loading.updateEvent = true;
                state.error.updateEvent = null;
            })
            .addCase(updateEvent.fulfilled, (state, action) => {
                state.loading.updateEvent = false;
                const index = state.events.findIndex(event => event._id === action.payload._id);
                if (index !== -1) {
                    state.events[index] = action.payload;
                }
                if (state.currentEvent && state.currentEvent._id === action.payload._id) {
                    state.currentEvent = action.payload;
                }
            })
            .addCase(updateEvent.rejected, (state, action) => {
                state.loading.updateEvent = false;
                state.error.updateEvent = action.payload;
            })

        // Delete event
            .addCase(deleteEvent.pending, (state) => {
                state.loading.deleteEvent = true;
                state.error.deleteEvent = null;
            })
            .addCase(deleteEvent.fulfilled, (state, action) => {
                state.loading.deleteEvent = false;
                state.events = state.events.filter(event => event._id !== action.meta.arg);
                if (state.currentEvent && state.currentEvent._id === action.meta.arg) {
                    state.currentEvent = null;
                }
            })
            .addCase(deleteEvent.rejected, (state, action) => {
                state.loading.deleteEvent = false;
                state.error.deleteEvent = action.payload;
            })

        // Join event
            .addCase(joinEvent.pending, (state) => {
                state.loading.joinEvent = true;
                state.error.joinEvent = null;
            })
            .addCase(joinEvent.fulfilled, (state, action) => {
                state.loading.joinEvent = false;
                state.activeEventSession = action.payload;
            })
            .addCase(joinEvent.rejected, (state, action) => {
                state.loading.joinEvent = false;
                state.error.joinEvent = action.payload;
            })

        // Submit to event
            .addCase(submitToEvent.pending, (state) => {
                state.loading.submitToEvent = true;
                state.error.submitToEvent = null;
            })
            .addCase(submitToEvent.fulfilled, (state, action) => {
                state.loading.submitToEvent = false;
                state.eventResults = action.payload;
                state.activeEventSession = null;
            })
            .addCase(submitToEvent.rejected, (state, action) => {
                state.loading.submitToEvent = false;
                state.error.submitToEvent = action.payload;
            })

        // Get user events
            .addCase(getUserEvents.pending, (state) => {
                state.loading.getUserEvents = true;
                state.error.getUserEvents = null;
            })
            .addCase(getUserEvents.fulfilled, (state, action) => {
                state.loading.getUserEvents = false;
                state.userEvents = action.payload.events || [];
                state.userEventsPagination = {
                    currentPage: action.payload.currentPage || 1,
                    totalPages: action.payload.totalPages || 1,
                    totalEvents: action.payload.totalEvents || 0,
                    hasNextPage: action.payload.hasNextPage || false,
                    hasPrevPage: action.payload.hasPrevPage || false,
                };
            })
            .addCase(getUserEvents.rejected, (state, action) => {
                state.loading.getUserEvents = false;
                state.error.getUserEvents = action.payload;
            });
    },
});

export const {
    clearError,
    clearAllErrors,
    resetEventState,
    setActiveEventSession,
    clearActiveEventSession,
    updateEventSubmission
} = eventSlice.actions;
export default eventSlice.reducer;
