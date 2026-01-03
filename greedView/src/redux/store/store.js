import { configureStore } from '@reduxjs/toolkit';
import { persistStore, persistReducer } from 'redux-persist';
import storage from 'redux-persist/lib/storage'; // defaults to localStorage for web
import Cookies from 'js-cookie';

// Import slices
import userReducer, { refreshToken } from '../slice/user.slice.js';
import walletReducer from '../slice/wallet.slice.js';
import quizReducer from '../slice/quiz.slice.js';
import eventReducer from '../slice/event.slice.js';
import activityLogReducer from '../slice/activityLog.slice.js';

// Clean up corrupted wallet data from localStorage
const cleanupCorruptedWalletData = () => {
    try {
        const walletData = localStorage.getItem('persist:wallet');
        if (walletData) {
            const parsed = JSON.parse(walletData);
            if (parsed.wallet === "null") {
                localStorage.removeItem('persist:wallet');
                console.log('Cleaned up corrupted wallet data from localStorage');
            }
        }
    } catch (error) {
        console.warn('Error cleaning up wallet data:', error);
    }
};

// Run cleanup on app start
cleanupCorruptedWalletData();

// Persist configuration for user slice (only persist user data, not loading/error states)
const userPersistConfig = {
    key: 'user',
    storage,
    whitelist: ['user', 'isAuthenticated'], // Only persist user data and auth status
};

// Persist configuration for wallet slice
const walletPersistConfig = {
    key: 'wallet',
    storage,
    whitelist: ['wallet'], // Only persist wallet data
    transforms: [{
        in: (inboundState, key) => {
            console.log("Inbound wallet state:", inboundState);
            console.log("Key:", key );
            // If the value is the string "null", convert it back to null
            if (inboundState === "null" || inboundState === null) {
                return null;
            }
            return inboundState;
        },
        out: (outboundState, key) => {
            console.log("Outbound wallet state:", outboundState);
            console.log("Key:", key );
            // If the value is null, don't persist it (undefined values are not persisted)
            if (outboundState === null) {
                return undefined;
            }
            return outboundState;
        },
    }],
};

// Create persisted reducers
const persistedUserReducer = persistReducer(userPersistConfig, userReducer);
const persistedWalletReducer = persistReducer(walletPersistConfig, walletReducer);

// Store configuration
export const store = configureStore({
    reducer: {
        user: persistedUserReducer,
        wallet: persistedWalletReducer,
        quiz: quizReducer,
        event: eventReducer,
        activityLog: activityLogReducer,
    },
    middleware: (getDefaultMiddleware) =>
        getDefaultMiddleware({
            serializableCheck: {
                ignoredActions: [
                    'persist/PERSIST',
                    'persist/REHYDRATE',
                    'persist/REGISTER',
                ],
            },
        }),
    devTools: import.meta.env.DEV, // Enable Redux DevTools in development
});

// Create persistor
export const persistor = persistStore(store);

// ============================================
// TOKEN MANAGEMENT UTILITIES
// ============================================

// Check if access token is expired or will expire soon
export const isTokenExpiringSoon = () => {
    const accessToken = Cookies.get('accessToken');
    if (!accessToken) return false; // No token, no need to refresh

    try {
        // Decode JWT payload (without verification)
        const payload = JSON.parse(atob(accessToken.split('.')[1]));
        const currentTime = Date.now() / 1000;
        const timeUntilExpiry = payload.exp - currentTime;

        // Refresh if token expires in less than 5 minutes
        return timeUntilExpiry < 300;
    } catch (error) {
        console.error('Error checking token expiry:', error);
        return true; // If we can't decode, assume it needs refresh
    }
};

// Initialize token refresh on app start
let tokenRefreshInitialized = false;

export const initializeTokenRefresh = () => {
    // Prevent multiple initializations
    if (tokenRefreshInitialized) {
        return () => {}; // Return empty cleanup function
    }

    tokenRefreshInitialized = true;

    const checkAndRefreshToken = async () => {
        const accessToken = Cookies.get('accessToken');
        const refreshToken = Cookies.get('refreshToken');

        // Only attempt refresh if we have both tokens
        if (accessToken && refreshToken && isTokenExpiringSoon()) {
            try {
                const result = await store.dispatch(refreshToken());
                if (result.meta.requestStatus === 'fulfilled') {
                    console.log('Token refreshed automatically');
                }
            } catch (error) {
                console.error('Failed to refresh token:', error);
                // Token refresh failed, user will be logged out
            }
        }
    };

    // Check token on app initialization
    checkAndRefreshToken();

    // Set up periodic token check (every 4 minutes)
    const tokenCheckInterval = setInterval(checkAndRefreshToken, 4 * 60 * 1000);

    // Return cleanup function
    return () => {
        clearInterval(tokenCheckInterval);
        tokenRefreshInitialized = false;
    };
};

// ============================================
// TYPE EXPORTS (Commented out for JS project)
// ============================================

// export type RootState = ReturnType<typeof store.getState>;
// export type AppDispatch = typeof store.dispatch;

// Default export for convenience
export default store;
