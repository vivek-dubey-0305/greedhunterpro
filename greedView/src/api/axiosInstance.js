import axios from 'axios';
import Cookies from 'js-cookie';

// Create axios instance
const axiosInstance = axios.create({
    baseURL: import.meta.env.VITE_API_URL || 'http://localhost:8000/api/v1',
    withCredentials: true, // Important for cookies
    headers: {
        'Content-Type': 'application/json',
    },
});

// Request interceptor to add access token
axiosInstance.interceptors.request.use(
    (config) => {
        const accessToken = Cookies.get('accessToken');
        if (accessToken) {
            config.headers.Authorization = `Bearer ${accessToken}`;
        }
        return config;
    },
    (error) => {
        return Promise.reject(error);
    }
);

// Response interceptor to handle token refresh
axiosInstance.interceptors.response.use(
    (response) => {
        return response;
    },
    async (error) => {
        const originalRequest = error.config;

        // If error is 401 and we haven't already tried to refresh
        if (error.response?.status === 401 && !originalRequest._retry) {
            originalRequest._retry = true;

            try {
                // Try to refresh the token
                const refreshResponse = await axios.post(
                    `${import.meta.env.VITE_API_URL || 'http://localhost:8000/api/v1'}/users/refresh-token`,
                    {},
                    { withCredentials: true }
                );

                const { accessToken } = refreshResponse.data.data;

                // Store new access token
                Cookies.set('accessToken', accessToken, {
                    expires: 1, // 1 day
                    secure: import.meta.env.PROD,
                    sameSite: 'strict'
                });

                // Retry the original request with new token
                originalRequest.headers.Authorization = `Bearer ${accessToken}`;
                return axiosInstance(originalRequest);
            } catch (refreshError) {
                // If refresh fails, redirect to login
                Cookies.remove('accessToken');
                Cookies.remove('refreshToken');
                window.location.href = '/login';
                return Promise.reject(refreshError);
            }
        }

        return Promise.reject(error);
    }
);

export default axiosInstance;
