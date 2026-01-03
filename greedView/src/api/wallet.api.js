import axiosInstance from './axiosInstance';

// ============================================
// WALLET APIs
// ============================================

export const walletAPI = {
    // Get wallet info
    getWalletInfo: async () => {
        const response = await axiosInstance.get('/wallet');
        return response.data;
    },

    // Get transaction history
    getTransactionHistory: async (page = 1, limit = 20) => {
        const response = await axiosInstance.get('/wallet/transactions', {
            params: { page, limit }
        });
        return response.data;
    },

    // Get wallet stats
    getWalletStats: async () => {
        const response = await axiosInstance.get('/wallet/stats');
        return response.data;
    },

    // Transfer coins
    transferCoins: async (transferData) => {
        const response = await axiosInstance.post('/wallet/transfer', transferData);
        return response.data;
    },
};

// ============================================
// ADMIN WALLET APIs
// ============================================

export const adminWalletAPI = {
    // Add coins to user wallet
    addCoins: async (userId, amount, reason) => {
        const response = await axiosInstance.post('/wallet/admin/add-coins', {
            userId,
            amount,
            reason
        });
        return response.data;
    },

    // Deduct coins from user wallet
    deductCoins: async (userId, amount, reason) => {
        const response = await axiosInstance.post('/wallet/admin/deduct-coins', {
            userId,
            amount,
            reason
        });
        return response.data;
    },

    // Freeze user wallet
    freezeWallet: async (userId, reason) => {
        const response = await axiosInstance.post('/wallet/admin/freeze', {
            userId,
            reason
        });
        return response.data;
    },

    // Unfreeze user wallet
    unfreezeWallet: async (userId) => {
        const response = await axiosInstance.post('/wallet/admin/unfreeze', {
            userId
        });
        return response.data;
    },
};
