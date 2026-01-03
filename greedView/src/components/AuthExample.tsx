import React, { useState, useEffect } from 'react';
import { useAppDispatch, useAppSelector } from '../redux/hooks';
import {
    registerUser,
    loginUser,
    logoutUser,
    getCurrentUser,
    clearError
} from '../redux/slice/user.slice';

const AuthExample = () => {
    const dispatch = useAppDispatch();
    const { user, isAuthenticated, loading, error } = useAppSelector(state => state.user);

    const [formData, setFormData] = useState({
        username: '',
        email: '',
        phone: '',
        password: '',
        confirmPassword: ''
    });

    const [isLogin, setIsLogin] = useState(true);

    // Get current user on component mount if authenticated
    useEffect(() => {
        if (isAuthenticated && !user) {
            dispatch(getCurrentUser());
        }
    }, [isAuthenticated, user, dispatch]);

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({
            ...prev,
            [name]: value
        }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        if (isLogin) {
            // Login
            dispatch(loginUser({
                email: formData.email,
                password: formData.password
            }));
        } else {
            // Register
            if (formData.password !== formData.confirmPassword) {
                alert('Passwords do not match');
                return;
            }

            dispatch(registerUser({
                username: formData.username,
                email: formData.email,
                phone: formData.phone,
                password: formData.password
            }));
        }
    };

    const handleLogout = () => {
        dispatch(logoutUser());
    };

    const handleClearError = (errorType) => {
        dispatch(clearError(errorType));
    };

    if (isAuthenticated && user) {
        return (
            <div className="max-w-md mx-auto mt-8 p-6 bg-white rounded-lg shadow-md">
                <h2 className="text-2xl font-bold mb-4">Welcome, {user.username}!</h2>
                <div className="mb-4">
                    <p><strong>Email:</strong> {user.email}</p>
                    <p><strong>Phone:</strong> {user.phone}</p>
                    <p><strong>Role:</strong> {user.role}</p>
                </div>
                <button
                    onClick={handleLogout}
                    disabled={loading.logout}
                    className="w-full bg-red-500 text-white py-2 px-4 rounded-md hover:bg-red-600 disabled:opacity-50"
                >
                    {loading.logout ? 'Logging out...' : 'Logout'}
                </button>
            </div>
        );
    }

    return (
        <div className="max-w-md mx-auto mt-8 p-6 bg-white rounded-lg shadow-md">
            <div className="flex mb-6">
                <button
                    onClick={() => setIsLogin(true)}
                    className={`flex-1 py-2 px-4 rounded-l-md ${
                        isLogin ? 'bg-blue-500 text-white' : 'bg-gray-200 text-gray-700'
                    }`}
                >
                    Login
                </button>
                <button
                    onClick={() => setIsLogin(false)}
                    className={`flex-1 py-2 px-4 rounded-r-md ${
                        !isLogin ? 'bg-blue-500 text-white' : 'bg-gray-200 text-gray-700'
                    }`}
                >
                    Register
                </button>
            </div>

            <form onSubmit={handleSubmit}>
                {!isLogin && (
                    <>
                        <div className="mb-4">
                            <label className="block text-gray-700 text-sm font-bold mb-2">
                                Username
                            </label>
                            <input
                                type="text"
                                name="username"
                                value={formData.username}
                                onChange={handleInputChange}
                                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                                required={!isLogin}
                            />
                        </div>

                        <div className="mb-4">
                            <label className="block text-gray-700 text-sm font-bold mb-2">
                                Phone
                            </label>
                            <input
                                type="tel"
                                name="phone"
                                value={formData.phone}
                                onChange={handleInputChange}
                                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                                required={!isLogin}
                            />
                        </div>
                    </>
                )}

                <div className="mb-4">
                    <label className="block text-gray-700 text-sm font-bold mb-2">
                        Email
                    </label>
                    <input
                        type="email"
                        name="email"
                        value={formData.email}
                        onChange={handleInputChange}
                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                        required
                    />
                </div>

                <div className="mb-4">
                    <label className="block text-gray-700 text-sm font-bold mb-2">
                        Password
                    </label>
                    <input
                        type="password"
                        name="password"
                        value={formData.password}
                        onChange={handleInputChange}
                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                        required
                    />
                </div>

                {!isLogin && (
                    <div className="mb-6">
                        <label className="block text-gray-700 text-sm font-bold mb-2">
                            Confirm Password
                        </label>
                        <input
                            type="password"
                            name="confirmPassword"
                            value={formData.confirmPassword}
                            onChange={handleInputChange}
                            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                            required={!isLogin}
                        />
                    </div>
                )}

                {/* Error Messages */}
                {error.register && (
                    <div className="mb-4 p-3 bg-red-100 border border-red-400 text-red-700 rounded">
                        {error.register}
                        <button
                            onClick={() => handleClearError('register')}
                            className="float-right ml-2 text-red-500 hover:text-red-700"
                        >
                            ×
                        </button>
                    </div>
                )}

                {error.login && (
                    <div className="mb-4 p-3 bg-red-100 border border-red-400 text-red-700 rounded">
                        {error.login}
                        <button
                            onClick={() => handleClearError('login')}
                            className="float-right ml-2 text-red-500 hover:text-red-700"
                        >
                            ×
                        </button>
                    </div>
                )}

                <button
                    type="submit"
                    disabled={loading.register || loading.login}
                    className="w-full bg-blue-500 text-white py-2 px-4 rounded-md hover:bg-blue-600 disabled:opacity-50"
                >
                    {loading.register || loading.login
                        ? 'Processing...'
                        : isLogin ? 'Login' : 'Register'
                    }
                </button>
            </form>
        </div>
    );
};

export default AuthExample;