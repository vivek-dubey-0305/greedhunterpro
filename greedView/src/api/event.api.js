import axiosInstance from './axiosInstance';

// ============================================
// EVENT APIs
// ============================================

export const eventAPI = {
    // Get all events (public)
    getAllEvents: async (page = 1, limit = 10, category, status) => {
        const response = await axiosInstance.get('/events', {
            params: { page, limit, category, status }
        });
        return response.data;
    },

    // Get event by ID (public)
    getEventById: async (eventId) => {
        const response = await axiosInstance.get(`/events/${eventId}`);
        return response.data;
    },

    // Get event leaderboard (public)
    getEventLeaderboard: async (eventId, limit = 10) => {
        const response = await axiosInstance.get(`/events/${eventId}/leaderboard`, {
            params: { limit }
        });
        return response.data;
    },

    // Create event
    createEvent: async (eventData) => {
        const response = await axiosInstance.post('/events', eventData);
        return response.data;
    },

    // Update event
    updateEvent: async (eventId, eventData) => {
        const response = await axiosInstance.put(`/events/${eventId}`, eventData);
        return response.data;
    },

    // Delete event
    deleteEvent: async (eventId) => {
        const response = await axiosInstance.delete(`/events/${eventId}`);
        return response.data;
    },

    // Join event
    joinEvent: async (eventId) => {
        const response = await axiosInstance.post(`/events/${eventId}/join`);
        return response.data;
    },

    // Submit to event
    submitToEvent: async (eventId, submissionData) => {
        const response = await axiosInstance.post(`/events/${eventId}/submit`, submissionData);
        return response.data;
    },

    // Get user's events
    getUserEvents: async (page = 1, limit = 10) => {
        const response = await axiosInstance.get('/events/user/my-events', {
            params: { page, limit }
        });
        return response.data;
    },
};
