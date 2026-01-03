import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { walletAPI, adminWalletAPI } from '../../api/wallet.api';

// ============================================
// ASYNC THUNKS
// ============================================

// Get wallet info
export const getWalletInfo = createAsyncThunk(
    'wallet/getWalletInfo',
    async (_, { rejectWithValue }) => {
        try {
            const response = await walletAPI.getWalletInfo();
            return response.data;
        } catch (error) {
            return rejectWithValue(error.response?.data?.message || 'Failed to get wallet info');
        }
    }
);

// Get transaction history
export const getTransactionHistory = createAsyncThunk(
    'wallet/getTransactionHistory',
    async ({ page = 1, limit = 20 }, { rejectWithValue }) => {
        try {
            const response = await walletAPI.getTransactionHistory(page, limit);
            return response.data;
        } catch (error) {
            return rejectWithValue(error.response?.data?.message || 'Failed to get transaction history');
        }
    }
);

// Get wallet stats
export const getWalletStats = createAsyncThunk(
    'wallet/getWalletStats',
    async (_, { rejectWithValue }) => {
        try {
            const response = await walletAPI.getWalletStats();
            return response.data;
        } catch (error) {
            return rejectWithValue(error.response?.data?.message || 'Failed to get wallet stats');
        }
    }
);

// Transfer coins
export const transferCoins = createAsyncThunk(
    'wallet/transferCoins',
    async (transferData, { rejectWithValue }) => {
        try {
            const response = await walletAPI.transferCoins(transferData);
            return response.data;
        } catch (error) {
            return rejectWithValue(error.response?.data?.message || 'Transfer failed');
        }
    }
);

// Admin: Add coins
export const addCoins = createAsyncThunk(
    'wallet/addCoins',
    async ({ userId, amount, reason }, { rejectWithValue }) => {
        try {
            const response = await adminWalletAPI.addCoins(userId, amount, reason);
            return response.data;
        } catch (error) {
            return rejectWithValue(error.response?.data?.message || 'Failed to add coins');
        }
    }
);

// Admin: Deduct coins
export const deductCoins = createAsyncThunk(
    'wallet/deductCoins',
    async ({ userId, amount, reason }, { rejectWithValue }) => {
        try {
            const response = await adminWalletAPI.deductCoins(userId, amount, reason);
            return response.data;
        } catch (error) {
            return rejectWithValue(error.response?.data?.message || 'Failed to deduct coins');
        }
    }
);

// Admin: Freeze wallet
export const freezeWallet = createAsyncThunk(
    'wallet/freezeWallet',
    async ({ userId, reason }, { rejectWithValue }) => {
        try {
            const response = await adminWalletAPI.freezeWallet(userId, reason);
            return response.data;
        } catch (error) {
            return rejectWithValue(error.response?.data?.message || 'Failed to freeze wallet');
        }
    }
);

// Admin: Unfreeze wallet
export const unfreezeWallet = createAsyncThunk(
    'wallet/unfreezeWallet',
    async (userId, { rejectWithValue }) => {
        try {
            const response = await adminWalletAPI.unfreezeWallet(userId);
            return response.data;
        } catch (error) {
            return rejectWithValue(error.response?.data?.message || 'Failed to unfreeze wallet');
        }
    }
);

// ============================================
// SLICE
// ============================================

const initialState = {
    wallet: null,
    transactions: [],
    stats: null,
    pagination: {
        currentPage: 1,
        totalPages: 1,
        totalTransactions: 0,
        hasNextPage: false,
        hasPrevPage: false,
    },
    loading: {
        getWalletInfo: false,
        getTransactionHistory: false,
        getWalletStats: false,
        transferCoins: false,
        addCoins: false,
        deductCoins: false,
        freezeWallet: false,
        unfreezeWallet: false,
    },
    error: {
        getWalletInfo: null,
        getTransactionHistory: null,
        getWalletStats: null,
        transferCoins: null,
        addCoins: null,
        deductCoins: null,
        freezeWallet: null,
        unfreezeWallet: null,
    },
};

const walletSlice = createSlice({
    name: 'wallet',
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

        // Reset wallet state
        resetWalletState: (state) => {
            state.wallet = null;
            state.transactions = [];
            state.stats = null;
            state.pagination = {
                currentPage: 1,
                totalPages: 1,
                totalTransactions: 0,
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

        // Update wallet balance locally (for optimistic updates)
        updateWalletBalance: (state, action) => {
            if (state.wallet) {
                state.wallet.balance = action.payload;
            }
        },
    },
    extraReducers: (builder) => {
        // Get wallet info
        builder
            .addCase(getWalletInfo.pending, (state) => {
                state.loading.getWalletInfo = true;
                state.error.getWalletInfo = null;
            })
            .addCase(getWalletInfo.fulfilled, (state, action) => {
                state.loading.getWalletInfo = false;
                state.wallet = action.payload;
            })
            .addCase(getWalletInfo.rejected, (state, action) => {
                state.loading.getWalletInfo = false;
                state.error.getWalletInfo = action.payload;
            })

        // Get transaction history
            .addCase(getTransactionHistory.pending, (state) => {
                state.loading.getTransactionHistory = true;
                state.error.getTransactionHistory = null;
            })
            .addCase(getTransactionHistory.fulfilled, (state, action) => {
                state.loading.getTransactionHistory = false;
                state.transactions = action.payload.transactions || [];
                state.pagination = {
                    currentPage: action.payload.currentPage || 1,
                    totalPages: action.payload.totalPages || 1,
                    totalTransactions: action.payload.totalTransactions || 0,
                    hasNextPage: action.payload.hasNextPage || false,
                    hasPrevPage: action.payload.hasPrevPage || false,
                };
            })
            .addCase(getTransactionHistory.rejected, (state, action) => {
                state.loading.getTransactionHistory = false;
                state.error.getTransactionHistory = action.payload;
            })

        // Get wallet stats
            .addCase(getWalletStats.pending, (state) => {
                state.loading.getWalletStats = true;
                state.error.getWalletStats = null;
            })
            .addCase(getWalletStats.fulfilled, (state, action) => {
                state.loading.getWalletStats = false;
                state.stats = action.payload;
            })
            .addCase(getWalletStats.rejected, (state, action) => {
                state.loading.getWalletStats = false;
                state.error.getWalletStats = action.payload;
            })

        // Transfer coins
            .addCase(transferCoins.pending, (state) => {
                state.loading.transferCoins = true;
                state.error.transferCoins = null;
            })
            .addCase(transferCoins.fulfilled, (state, action) => {
                state.loading.transferCoins = false;
                // Update wallet balance if transfer was successful
                if (state.wallet && action.payload.newBalance !== undefined) {
                    state.wallet.balance = action.payload.newBalance;
                }
            })
            .addCase(transferCoins.rejected, (state, action) => {
                state.loading.transferCoins = false;
                state.error.transferCoins = action.payload;
            })

        // Admin: Add coins
            .addCase(addCoins.pending, (state) => {
                state.loading.addCoins = true;
                state.error.addCoins = null;
            })
            .addCase(addCoins.fulfilled, (state) => {
                state.loading.addCoins = false;
            })
            .addCase(addCoins.rejected, (state, action) => {
                state.loading.addCoins = false;
                state.error.addCoins = action.payload;
            })

        // Admin: Deduct coins
            .addCase(deductCoins.pending, (state) => {
                state.loading.deductCoins = true;
                state.error.deductCoins = null;
            })
            .addCase(deductCoins.fulfilled, (state) => {
                state.loading.deductCoins = false;
            })
            .addCase(deductCoins.rejected, (state, action) => {
                state.loading.deductCoins = false;
                state.error.deductCoins = action.payload;
            })

        // Admin: Freeze wallet
            .addCase(freezeWallet.pending, (state) => {
                state.loading.freezeWallet = true;
                state.error.freezeWallet = null;
            })
            .addCase(freezeWallet.fulfilled, (state) => {
                state.loading.freezeWallet = false;
            })
            .addCase(freezeWallet.rejected, (state, action) => {
                state.loading.freezeWallet = false;
                state.error.freezeWallet = action.payload;
            })

        // Admin: Unfreeze wallet
            .addCase(unfreezeWallet.pending, (state) => {
                state.loading.unfreezeWallet = true;
                state.error.unfreezeWallet = null;
            })
            .addCase(unfreezeWallet.fulfilled, (state) => {
                state.loading.unfreezeWallet = false;
            })
            .addCase(unfreezeWallet.rejected, (state, action) => {
                state.loading.unfreezeWallet = false;
                state.error.unfreezeWallet = action.payload;
            });
    },
});

export const { clearError, clearAllErrors, resetWalletState, updateWalletBalance } = walletSlice.actions;
export default walletSlice.reducer;
