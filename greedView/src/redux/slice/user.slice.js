import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import Cookies from 'js-cookie';
import { authAPI, passwordAPI, otpAPI, profileAPI, socialAPI } from '../../api/user.api';

// ============================================
// ASYNC THUNKS
// ============================================

// Register user
export const registerUser = createAsyncThunk(
    'user/register',
    async (userData, { rejectWithValue }) => {
        console.log('[userSlice] Registering user:', { ...userData, password: '***' });
        try {
            const response = await authAPI.register(userData);
            console.log('[userSlice] Registration API response:', response);
            const { user, accessToken, refreshToken } = response;

            // Store tokens in cookies
            Cookies.set('accessToken', accessToken, {
                expires: 1, // 1 day
                secure: import.meta.env.PROD,
                sameSite: 'strict'
            });
            Cookies.set('refreshToken', refreshToken, {
                expires: 10, // 10 days
                secure: import.meta.env.PROD,
                sameSite: 'strict'
            });

            console.log('[userSlice] Registration successful, tokens stored');
            return { user, accessToken, refreshToken };
        } catch (error) {
            console.error('[userSlice] Registration failed:', error.response?.data || error.message);
            return rejectWithValue(error.response?.data?.message || 'Registration failed');
        }
    }
);

// Login user
export const loginUser = createAsyncThunk(
    'user/login',
    async (credentials, { rejectWithValue }) => {
        console.log('[userSlice] Logging in user:', credentials.email);
        try {
            const response = await authAPI.login(credentials);
            console.log('[userSlice] Login API response:', response);
            const { user, accessToken, refreshToken } = response;

            // Store tokens in cookies
            Cookies.set('accessToken', accessToken, {
                expires: 1,
                secure: import.meta.env.PROD,
                sameSite: 'strict'
            });
            Cookies.set('refreshToken', refreshToken, {
                expires: 10,
                secure: import.meta.env.PROD,
                sameSite: 'strict'
            });

            console.log('[userSlice] Login successful, user:', user.username);
            return { user, accessToken, refreshToken };
        } catch (error) {
            console.error('[userSlice] Login failed:', error.response?.data || error.message);
            return rejectWithValue(error.response?.data?.message || 'Login failed');
        }
    }
);

// Logout user
export const logoutUser = createAsyncThunk(
    'user/logout',
    async (_, { rejectWithValue }) => {
        try {
            await authAPI.logout();

            // Clear tokens from cookies
            Cookies.remove('accessToken');
            Cookies.remove('refreshToken');

            return null;
        } catch (error) {
            // Even if API call fails, clear local tokens
            Cookies.remove('accessToken');
            Cookies.remove('refreshToken');
            return rejectWithValue(error.response?.data?.message || 'Logout failed');
        }
    }
);

// Get current user
export const getCurrentUser = createAsyncThunk(
    'user/getCurrentUser',
    async (_, { rejectWithValue }) => {
        try {
            const response = await authAPI.getCurrentUser();
            return response.data;
        } catch (error) {
            return rejectWithValue(error.response?.data?.message || 'Failed to get user info');
        }
    }
);

// Refresh token
export const refreshToken = createAsyncThunk(
    'user/refreshToken',
    async (_, { rejectWithValue }) => {
        try {
            const response = await authAPI.refreshToken();
            const { accessToken } = response.data;

            // Update access token in cookies
            Cookies.set('accessToken', accessToken, {
                expires: 1,
                secure: import.meta.env.PROD,
                sameSite: 'strict'
            });

            return { accessToken };
        } catch (error) {
            console.error('Refresh token failed:', error);
            // Clear tokens if refresh fails
            Cookies.remove('accessToken');
            Cookies.remove('refreshToken');
            return rejectWithValue('Session expired. Please login again.');
        }
    }
);

// Send Reset Password Link
export const sendResetPasswordLink = createAsyncThunk(
    'user/sendResetPasswordLink',
    async (data, { rejectWithValue }) => {
        console.log('[userSlice] Sending reset password link to:', data.email);
        try {
            const response = await passwordAPI.forgotPassword(data.email);
            console.log('[userSlice] Reset link sent successfully');
            return response.data;
        } catch (error) {
            console.error('[userSlice] Failed to send reset link:', error.response?.data || error.message);
            return rejectWithValue(error.response?.data?.message || 'Failed to send reset email');
        }
    }
);

// Reset password
export const resetPassword = createAsyncThunk(
    'user/resetPassword',
    async ({ token, password, confirmPassword }, { rejectWithValue }) => {
        console.log('[userSlice] Resetting password with token');
        try {
            const response = await passwordAPI.resetPassword(token, { password, confirmPassword });
            console.log('[userSlice] Password reset successful');
            return response.data;
        } catch (error) {
            console.error('[userSlice] Password reset failed:', error.response?.data || error.message);
            return rejectWithValue(error.response?.data?.message || 'Password reset failed');
        }
    }
);

// Change password
export const changePassword = createAsyncThunk(
    'user/changePassword',
    async (passwords, { rejectWithValue }) => {
        try {
            const response = await passwordAPI.changePassword(passwords);
            return response.data;
        } catch (error) {
            return rejectWithValue(error.response?.data?.message || 'Password change failed');
        }
    }
);

// Send OTP
export const sendOtp = createAsyncThunk(
    'user/sendOtp',
    async (_, { rejectWithValue }) => {
        console.log('[userSlice] Sending OTP');
        try {
            const response = await otpAPI.sendOTP();
            console.log('[userSlice] OTP sent successfully');
            return response.data;
        } catch (error) {
            console.error('[userSlice] Failed to send OTP:', error.response?.data || error.message);
            return rejectWithValue(error.response?.data?.message || 'Failed to send OTP');
        }
    }
);

// Verify OTP
export const verifyOtp = createAsyncThunk(
    'user/verifyOtp',
    async (data, { rejectWithValue }) => {
        console.log('[userSlice] Verifying OTP for email:', data.email);
        try {
            const response = await otpAPI.verifyOTP(data);
            console.log('[userSlice] OTP verified successfully');
            return response.data;
        } catch (error) {
            console.error('[userSlice] OTP verification failed:', error.response?.data || error.message);
            return rejectWithValue(error.response?.data?.message || 'OTP verification failed');
        }
    }
);

// Update profile
export const updateProfile = createAsyncThunk(
    'user/updateProfile',
    async (profileData, { rejectWithValue }) => {
        try {
            const response = await profileAPI.updateProfile(profileData);
            return response.data;
        } catch (error) {
            return rejectWithValue(error.response?.data?.message || 'Profile update failed');
        }
    }
);

// Update avatar
export const updateAvatar = createAsyncThunk(
    'user/updateAvatar',
    async (avatarFile, { rejectWithValue }) => {
        try {
            const response = await profileAPI.updateAvatar(avatarFile);
            return response.data;
        } catch (error) {
            return rejectWithValue(error.response?.data?.message || 'Avatar update failed');
        }
    }
);

// Delete account
export const deleteAccount = createAsyncThunk(
    'user/deleteAccount',
    async (_, { rejectWithValue }) => {
        try {
            await profileAPI.deleteAccount();

            // Clear tokens
            Cookies.remove('accessToken');
            Cookies.remove('refreshToken');

            return null;
        } catch (error) {
            return rejectWithValue(error.response?.data?.message || 'Account deletion failed');
        }
    }
);

// Get user by ID
export const getUserById = createAsyncThunk(
    'user/getUserById',
    async (userId, { rejectWithValue }) => {
        try {
            const response = await profileAPI.getUserById(userId);
            return response.data;
        } catch (error) {
            return rejectWithValue(error.response?.data?.message || 'Failed to get user');
        }
    }
);

// Follow user
export const followUser = createAsyncThunk(
    'user/followUser',
    async (userId, { rejectWithValue }) => {
        try {
            const response = await socialAPI.followUser(userId);
            return response.data;
        } catch (error) {
            return rejectWithValue(error.response?.data?.message || 'Follow failed');
        }
    }
);

// Unfollow user
export const unfollowUser = createAsyncThunk(
    'user/unfollowUser',
    async (userId, { rejectWithValue }) => {
        try {
            const response = await socialAPI.unfollowUser(userId);
            return response.data;
        } catch (error) {
            return rejectWithValue(error.response?.data?.message || 'Unfollow failed');
        }
    }
);

// ============================================
// SLICE
// ============================================

const initialState = {
    user: null,
    isAuthenticated: false,
    loading: {
        register: false,
        login: false,
        logout: false,
        getCurrentUser: false,
        refreshToken: false,
        forgotPassword: false,
        resetPassword: false,
        changePassword: false,
        sendOTP: false,
        verifyOTP: false,
        updateProfile: false,
        updateAvatar: false,
        deleteAccount: false,
        getUserById: false,
        followUser: false,
        unfollowUser: false,
    },
    error: {
        register: null,
        login: null,
        logout: null,
        getCurrentUser: null,
        refreshToken: null,
        forgotPassword: null,
        resetPassword: null,
        changePassword: null,
        sendOTP: null,
        verifyOTP: null,
        updateProfile: null,
        updateAvatar: null,
        deleteAccount: null,
        getUserById: null,
        followUser: null,
        unfollowUser: null,
    },
};

const userSlice = createSlice({
    name: 'user',
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

        // Reset user state
        resetUserState: (state) => {
            state.user = null;
            state.isAuthenticated = false;
            Object.keys(state.loading).forEach(key => {
                state.loading[key] = false;
            });
            Object.keys(state.error).forEach(key => {
                state.error[key] = null;
            });
        },

        // Set user from persisted state
        setUserFromStorage: (state, action) => {
            state.user = action.payload;
            state.isAuthenticated = true;
        },
    },
    extraReducers: (builder) => {
        // Register
        builder
            .addCase(registerUser.pending, (state) => {
                state.loading.register = true;
                state.error.register = null;
            })
            .addCase(registerUser.fulfilled, (state, action) => {
                state.loading.register = false;
                state.user = action.payload.user;
                state.isAuthenticated = true;
            })
            .addCase(registerUser.rejected, (state, action) => {
                state.loading.register = false;
                state.error.register = action.payload;
            })

        // Login
            .addCase(loginUser.pending, (state) => {
                state.loading.login = true;
                state.error.login = null;
            })
            .addCase(loginUser.fulfilled, (state, action) => {
                state.loading.login = false;
                state.user = action.payload.user;
                state.isAuthenticated = true;
            })
            .addCase(loginUser.rejected, (state, action) => {
                state.loading.login = false;
                state.error.login = action.payload;
            })

        // Logout
            .addCase(logoutUser.pending, (state) => {
                state.loading.logout = true;
                state.error.logout = null;
            })
            .addCase(logoutUser.fulfilled, (state) => {
                state.loading.logout = false;
                state.user = null;
                state.isAuthenticated = false;
            })
            .addCase(logoutUser.rejected, (state, action) => {
                state.loading.logout = false;
                state.error.logout = action.payload;
                // Still clear user state even if API call fails
                state.user = null;
                state.isAuthenticated = false;
            })

        // Get current user
            .addCase(getCurrentUser.pending, (state) => {
                state.loading.getCurrentUser = true;
                state.error.getCurrentUser = null;
            })
            .addCase(getCurrentUser.fulfilled, (state, action) => {
                state.loading.getCurrentUser = false;
                state.user = action.payload;
                state.isAuthenticated = true;
            })
            .addCase(getCurrentUser.rejected, (state, action) => {
                state.loading.getCurrentUser = false;
                state.error.getCurrentUser = action.payload;
            })

        // Refresh token
            .addCase(refreshToken.pending, (state) => {
                state.loading.refreshToken = true;
                state.error.refreshToken = null;
            })
            .addCase(refreshToken.fulfilled, (state) => {
                state.loading.refreshToken = false;
            })
            .addCase(refreshToken.rejected, (state, action) => {
                state.loading.refreshToken = false;
                state.error.refreshToken = action.payload;
                state.user = null;
                state.isAuthenticated = false;
            })

        // Forgot password
            .addCase(sendResetPasswordLink.pending, (state) => {
                state.loading.forgotPassword = true;
                state.error.forgotPassword = null;
            })
            .addCase(sendResetPasswordLink.fulfilled, (state) => {
                state.loading.forgotPassword = false;
            })
            .addCase(sendResetPasswordLink.rejected, (state, action) => {
                state.loading.forgotPassword = false;
                state.error.forgotPassword = action.payload;
            })

        // Reset password
            .addCase(resetPassword.pending, (state) => {
                state.loading.resetPassword = true;
                state.error.resetPassword = null;
            })
            .addCase(resetPassword.fulfilled, (state) => {
                state.loading.resetPassword = false;
            })
            .addCase(resetPassword.rejected, (state, action) => {
                state.loading.resetPassword = false;
                state.error.resetPassword = action.payload;
            })

        // Change password
            .addCase(changePassword.pending, (state) => {
                state.loading.changePassword = true;
                state.error.changePassword = null;
            })
            .addCase(changePassword.fulfilled, (state) => {
                state.loading.changePassword = false;
            })
            .addCase(changePassword.rejected, (state, action) => {
                state.loading.changePassword = false;
                state.error.changePassword = action.payload;
            })

        // Send OTP
            .addCase(sendOtp.pending, (state) => {
                state.loading.sendOTP = true;
                state.error.sendOTP = null;
            })
            .addCase(sendOtp.fulfilled, (state) => {
                state.loading.sendOTP = false;
            })
            .addCase(sendOtp.rejected, (state, action) => {
                state.loading.sendOTP = false;
                state.error.sendOTP = action.payload;
            })

        // Verify OTP
            .addCase(verifyOtp.pending, (state) => {
                state.loading.verifyOTP = true;
                state.error.verifyOTP = null;
            })
            .addCase(verifyOtp.fulfilled, (state) => {
                state.loading.verifyOTP = false;
            })
            .addCase(verifyOtp.rejected, (state, action) => {
                state.loading.verifyOTP = false;
                state.error.verifyOTP = action.payload;
            })

        // Update profile
            .addCase(updateProfile.pending, (state) => {
                state.loading.updateProfile = true;
                state.error.updateProfile = null;
            })
            .addCase(updateProfile.fulfilled, (state, action) => {
                state.loading.updateProfile = false;
                state.user = action.payload;
            })
            .addCase(updateProfile.rejected, (state, action) => {
                state.loading.updateProfile = false;
                state.error.updateProfile = action.payload;
            })

        // Update avatar
            .addCase(updateAvatar.pending, (state) => {
                state.loading.updateAvatar = true;
                state.error.updateAvatar = null;
            })
            .addCase(updateAvatar.fulfilled, (state, action) => {
                state.loading.updateAvatar = false;
                state.user = action.payload;
            })
            .addCase(updateAvatar.rejected, (state, action) => {
                state.loading.updateAvatar = false;
                state.error.updateAvatar = action.payload;
            })

        // Delete account
            .addCase(deleteAccount.pending, (state) => {
                state.loading.deleteAccount = true;
                state.error.deleteAccount = null;
            })
            .addCase(deleteAccount.fulfilled, (state) => {
                state.loading.deleteAccount = false;
                state.user = null;
                state.isAuthenticated = false;
            })
            .addCase(deleteAccount.rejected, (state, action) => {
                state.loading.deleteAccount = false;
                state.error.deleteAccount = action.payload;
            })

        // Get user by ID
            .addCase(getUserById.pending, (state) => {
                state.loading.getUserById = true;
                state.error.getUserById = null;
            })
            .addCase(getUserById.fulfilled, (state) => {
                state.loading.getUserById = false;
            })
            .addCase(getUserById.rejected, (state, action) => {
                state.loading.getUserById = false;
                state.error.getUserById = action.payload;
            })

        // Follow user
            .addCase(followUser.pending, (state) => {
                state.loading.followUser = true;
                state.error.followUser = null;
            })
            .addCase(followUser.fulfilled, (state) => {
                state.loading.followUser = false;
            })
            .addCase(followUser.rejected, (state, action) => {
                state.loading.followUser = false;
                state.error.followUser = action.payload;
            })

        // Unfollow user
            .addCase(unfollowUser.pending, (state) => {
                state.loading.unfollowUser = true;
                state.error.unfollowUser = null;
            })
            .addCase(unfollowUser.fulfilled, (state) => {
                state.loading.unfollowUser = false;
            })
            .addCase(unfollowUser.rejected, (state, action) => {
                state.loading.unfollowUser = false;
                state.error.unfollowUser = action.payload;
            });
    },
});

export const { clearError, clearAllErrors, resetUserState, setUserFromStorage } = userSlice.actions;
export default userSlice.reducer;
