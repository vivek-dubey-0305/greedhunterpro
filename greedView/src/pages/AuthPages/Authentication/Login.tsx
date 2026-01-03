import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Link, useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { Mail, Lock, Loader2, Eye, EyeOff, Sparkles, LogIn } from 'lucide-react';
// import { loginUser } from '../../../redux/slice/user.slice';
import { loginUser } from '../../../redux/slice/user.slice.js'
import { Button } from '../../../components/ui/button';
import { Input } from '../../../components/ui/input';
import { Label } from '../../../components/ui/label';
import { Alert, AlertDescription } from '../../../components/ui/alert';

const Login: React.FC = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { loading, error } = useSelector((state: any) => state.user);
  const isLoading = loading?.login || false;
  const loginError = error?.login || null;

  const [formData, setFormData] = useState({
    email: '',
    password: '',
  });
  const [showPassword, setShowPassword] = useState(false);
  const [validationErrors, setValidationErrors] = useState<any>({});

  console.log('[Login] Component mounted');

  const validateForm = () => {
    console.log('[Login] Validating form data:', formData);
    const errors: any = {};

    if (!formData.email) {
      errors.email = 'Email is required';
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
      errors.email = 'Email is invalid';
    }

    if (!formData.password) {
      errors.password = 'Password is required';
    }

    setValidationErrors(errors);
    console.log('[Login] Validation errors:', errors);
    return Object.keys(errors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    console.log('[Login] Form submitted with data:', { email: formData.email });

    if (!validateForm()) {
      console.log('[Login] Form validation failed');
      return;
    }

    try {
      console.log('[Login] Dispatching loginUser action');
      const result = await dispatch(loginUser(formData) as any).unwrap();
      console.log('[Login] Login successful:', result);
      
      if (result.user.isVerified) {
        console.log('[Login] User is verified, redirecting to dashboard');
        navigate('/dashboard');
      } else {
        console.log('[Login] User not verified, redirecting to OTP page');
        navigate('/auth/otp', { state: { email: formData.email } });
      }
    } catch (err: any) {
      console.error('[Login] Login failed:', err);
    }
  };

  const handleGoogleLogin = () => {
    console.log('[Login] Initiating Google OAuth');
    window.location.href = `${import.meta.env.VITE_API_URL}/users/auth/google`;
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
    // Clear validation error for this field
    if (validationErrors[name]) {
      setValidationErrors((prev: any) => ({ ...prev, [name]: '' }));
    }
  };

  return (
    <div className="min-h-screen bg-[#0a0a0f] flex items-center justify-center overflow-hidden px-4">
      {/* Animated Background */}
      <div className="absolute inset-0 cyber-grid opacity-10"></div>
      <div className="absolute inset-0">
        {[...Array(20)].map((_, i) => (
          <motion.div
            key={i}
            className="absolute w-2 h-2 bg-[#00ff88] rounded-full opacity-40"
            style={{
              left: `${Math.random() * 100}%`,
              top: `${Math.random() * 100}%`,
            }}
            animate={{
              y: [0, -30, 0],
              opacity: [0, 0.6, 0],
            }}
            transition={{
              duration: 3 + Math.random() * 2,
              repeat: Infinity,
              delay: Math.random() * 2,
            }}
          />
        ))}
      </div>

      {/* Login Card */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        className="relative z-10 w-full max-w-md"
      >
        <div className="bg-[#141420] border border-[#00ff88]/20 rounded-lg p-8 shadow-2xl">
          {/* Header */}
          <div className="text-center mb-8">
            <motion.div
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ type: "spring", duration: 0.6 }}
              className="inline-block mb-4"
            >
              <div className="w-16 h-16 bg-gradient-to-br from-[#00ff88] to-[#00d9ff] rounded-full flex items-center justify-center mx-auto">
                <LogIn className="w-8 h-8 text-[#0a0a0f]" />
              </div>
            </motion.div>
            <h1 className="text-3xl font-black text-white mb-2">
              Welcome Back
            </h1>
            <p className="text-gray-400">Login to continue your journey</p>
          </div>

          {/* Error Alert */}
          <AnimatePresence>
            {loginError && (
              <motion.div
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                className="mb-4"
              >
                <Alert variant="destructive" className="bg-red-500/10 border-red-500/50">
                  <AlertDescription className="text-red-400">
                    {loginError}
                  </AlertDescription>
                </Alert>
              </motion.div>
            )}
          </AnimatePresence>

          {/* Login Form */}
          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Email Field */}
            <div className="space-y-2">
              <Label htmlFor="email" className="text-gray-300">
                Email
              </Label>
              <div className="relative">
                <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-500" />
                <Input
                  id="email"
                  name="email"
                  type="email"
                  value={formData.email}
                  onChange={handleChange}
                  className={`pl-10 bg-[#0a0a0f] border-[#00ff88]/30 text-white focus:border-[#00ff88] ${
                    validationErrors.email ? 'border-red-500' : ''
                  }`}
                  placeholder="your@email.com"
                />
              </div>
              {validationErrors.email && (
                <p className="text-red-400 text-sm">{validationErrors.email}</p>
              )}
            </div>

            {/* Password Field */}
            <div className="space-y-2">
              <Label htmlFor="password" className="text-gray-300">
                Password
              </Label>
              <div className="relative">
                <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-500" />
                <Input
                  id="password"
                  name="password"
                  type={showPassword ? 'text' : 'password'}
                  value={formData.password}
                  onChange={handleChange}
                  className={`pl-10 pr-12 bg-[#0a0a0f] border-[#00ff88]/30 text-white focus:border-[#00ff88] ${
                    validationErrors.password ? 'border-red-500' : ''
                  }`}
                  placeholder="Enter your password"
                />
                <motion.button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 hover:text-[#00ff88]"
                  whileHover={{ scale: 1.1 }}
                  whileTap={{ scale: 0.9 }}
                >
                  <AnimatePresence mode="wait">
                    {showPassword ? (
                      <motion.div
                        key="eye-off"
                        initial={{ rotate: -180, opacity: 0 }}
                        animate={{ rotate: 0, opacity: 1 }}
                        exit={{ rotate: 180, opacity: 0 }}
                        transition={{ duration: 0.3 }}
                      >
                        <EyeOff className="w-5 h-5" />
                      </motion.div>
                    ) : (
                      <motion.div
                        key="eye"
                        initial={{ rotate: -180, opacity: 0 }}
                        animate={{ rotate: 0, opacity: 1 }}
                        exit={{ rotate: 180, opacity: 0 }}
                        transition={{ duration: 0.3 }}
                      >
                        <Eye className="w-5 h-5" />
                      </motion.div>
                    )}
                  </AnimatePresence>
                </motion.button>
              </div>
              {validationErrors.password && (
                <p className="text-red-400 text-sm">{validationErrors.password}</p>
              )}
            </div>

            {/* Forgot Password Link */}
            <div className="text-right">
              <Link
                to="/auth/forgot-password"
                className="text-sm text-[#00ff88] hover:text-[#00d9ff] transition-colors"
              >
                Forgot Password?
              </Link>
            </div>

            {/* Submit Button */}
            <Button
              type="submit"
              disabled={isLoading}
              className="w-full bg-[#00ff88] hover:bg-[#00ff88]/90 text-[#0a0a0f] font-bold py-6 transition-all hover:shadow-[0_0_20px_rgba(0,255,136,0.6)]"
            >
              {isLoading ? (
                <span className="flex items-center gap-2">
                  <Loader2 className="w-5 h-5 animate-spin" />
                  Logging in...
                </span>
              ) : (
                'Login'
              )}
            </Button>

            {/* Divider */}
            <div className="relative">
              <div className="absolute inset-0 flex items-center">
                <div className="w-full border-t border-gray-700"></div>
              </div>
              <div className="relative flex justify-center text-sm">
                <span className="px-2 bg-[#141420] text-gray-400">Or continue with</span>
              </div>
            </div>

            {/* Google Login */}
            <Button
              type="button"
              onClick={handleGoogleLogin}
              variant="outline"
              className="w-full border-[#00ff88]/30 hover:border-[#00ff88] text-white py-6"
            >
              <svg className="w-5 h-5 mr-2" viewBox="0 0 24 24">
                <path
                  fill="currentColor"
                  d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
                />
                <path
                  fill="currentColor"
                  d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                />
                <path
                  fill="currentColor"
                  d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
                />
                <path
                  fill="currentColor"
                  d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
                />
              </svg>
              Continue with Google
            </Button>
          </form>

          {/* Register Link */}
          <div className="mt-6 text-center">
            <p className="text-gray-400">
              Don't have an account?{' '}
              <Link
                to="/auth/register"
                className="text-[#00ff88] hover:text-[#00d9ff] font-semibold transition-colors"
              >
                Register Now
              </Link>
            </p>
          </div>

          {/* Back to Home */}
          <div className="mt-4 text-center">
            <Link
              to="/"
              className="text-sm text-gray-500 hover:text-[#00ff88] transition-colors"
            >
              ← Back to Home
            </Link>
          </div>
        </div>
      </motion.div>
    </div>
  );
};

export default Login;
