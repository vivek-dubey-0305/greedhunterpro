import axiosInstance from './axiosInstance';

// ============================================
// AUTHENTICATION APIs
// ============================================

export const authAPI = {
    // Register user
    register: async (userData) => {
        const response = await axiosInstance.post('/users/register', userData);
        return response.data;
    },

    // Login user
    login: async (credentials) => {
        const response = await axiosInstance.post('/users/login', credentials);
        return response.data;
    },

    // Logout user
    logout: async () => {
        const response = await axiosInstance.post('/users/logout');
        return response.data;
    },

    // Refresh access token
    refreshToken: async () => {
        const response = await axiosInstance.post('/users/refresh-token');
        return response.data;
    },

    // Get current user info
    getCurrentUser: async () => {
        const response = await axiosInstance.get('/users/profile');
        return response.data;
    },

    // Google OAuth
    googleAuth: () => {
        window.location.href = `${import.meta.env.VITE_API_URL || 'http://localhost:8000/api/v1'}/users/auth/google`;
    },

    // GitHub OAuth
    githubAuth: () => {
        window.location.href = `${import.meta.env.VITE_API_URL || 'http://localhost:8000/api/v1'}/users/auth/github`;
    },
};

// ============================================
// PASSWORD MANAGEMENT APIs
// ============================================

export const passwordAPI = {
    // Send reset password link
    forgotPassword: async (email) => {
        const response = await axiosInstance.post('/users/forgot-password', { email });
        return response.data;
    },

    // Reset password with token
    resetPassword: async (token, passwords) => {
        const response = await axiosInstance.post(`/users/reset-password/${token}`, passwords);
        return response.data;
    },

    // Change current password
    changePassword: async (passwords) => {
        const response = await axiosInstance.put('/users/change-password', passwords);
        return response.data;
    },
};

// ============================================
// OTP APIs
// ============================================

export const otpAPI = {
    // Send OTP
    sendOTP: async () => {
        const response = await axiosInstance.post('/users/send-otp');
        return response.data;
    },

    // Verify OTP
    verifyOTP: async (data) => {
        const response = await axiosInstance.post('/users/verify-otp', data);
        return response.data;
    },
};

// ============================================
// PROFILE MANAGEMENT APIs
// ============================================

export const profileAPI = {
    // Update profile
    updateProfile: async (profileData) => {
        const response = await axiosInstance.put('/users/profile', profileData);
        return response.data;
    },

    // Update avatar
    updateAvatar: async (avatarFile) => {
        const formData = new FormData();
        formData.append('avatar', avatarFile);

        const response = await axiosInstance.put('/users/avatar', formData, {
            headers: {
                'Content-Type': 'multipart/form-data',
            },
        });
        return response.data;
    },

    // Delete account
    deleteAccount: async () => {
        const response = await axiosInstance.delete('/users/delete');
        return response.data;
    },

    // Get user by ID (public)
    getUserById: async (userId) => {
        const response = await axiosInstance.get(`/users/${userId}`);
        return response.data;
    },
};

// ============================================
// SOCIAL APIs
// ============================================

export const socialAPI = {
    // Follow user
    followUser: async (userId) => {
        const response = await axiosInstance.post(`/users/follow/${userId}`);
        return response.data;
    },

    // Unfollow user
    unfollowUser: async (userId) => {
        const response = await axiosInstance.post(`/users/unfollow/${userId}`);
        return response.data;
    },
};
