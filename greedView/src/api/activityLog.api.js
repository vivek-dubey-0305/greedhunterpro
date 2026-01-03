import axiosInstance from './axiosInstance';

// ============================================
// ACTIVITY LOG APIs
// ============================================

export const activityLogAPI = {
    // Get user's activity log
    getUserActivityLog: async (page = 1, limit = 20, type, dateFrom, dateTo) => {
        const response = await axiosInstance.get('/logs', {
            params: { page, limit, type, dateFrom, dateTo }
        });
        return response.data;
    },

    // Get activity stats
    getActivityStats: async () => {
        const response = await axiosInstance.get('/logs/stats');
        return response.data;
    },

    // Search activities
    searchActivities: async (query, type, page = 1, limit = 20) => {
        const response = await axiosInstance.get('/logs/search', {
            params: { query, type, page, limit }
        });
        return response.data;
    },
};

// ============================================
// ADMIN ACTIVITY LOG APIs
// ============================================

export const adminActivityLogAPI = {
    // Get activity log by user ID
    getActivityLogByUserId: async (userId, page = 1, limit = 20) => {
        const response = await axiosInstance.get(`/logs/admin/user/${userId}`, {
            params: { page, limit }
        });
        return response.data;
    },

    // Delete activity log entry
    deleteActivityLog: async (userId, activityId) => {
        const response = await axiosInstance.delete(`/logs/admin/user/${userId}`, {
            data: { activityId }
        });
        return response.data;
    },

    // Clear all user activities
    clearUserActivities: async (userId) => {
        const response = await axiosInstance.delete(`/logs/admin/user/${userId}/clear`);
        return response.data;
    },

    // Get system activity summary
    getSystemActivitySummary: async (dateFrom, dateTo) => {
        const response = await axiosInstance.get('/logs/admin/summary', {
            params: { dateFrom, dateTo }
        });
        return response.data;
    },
};
