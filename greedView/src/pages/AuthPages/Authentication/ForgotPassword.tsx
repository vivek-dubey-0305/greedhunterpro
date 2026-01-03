import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Link, useNavigate, useParams } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { Mail, Lock, Eye, EyeOff, Loader2, KeyRound, Send } from 'lucide-react';
import { sendResetPasswordLink, resetPassword } from '../../../redux/slice/user.slice';
import { Button } from '../../../components/ui/button';
import { Input } from '../../../components/ui/input';
import { Label } from '../../../components/ui/label';
import { Alert, AlertDescription } from '../../../components/ui/alert';

const ForgotPassword: React.FC = () => {
  const navigate = useNavigate();
  const { token } = useParams();
  const dispatch = useDispatch();
  const { loading, error } = useSelector((state: any) => state.user);
  const isLoading = loading?.forgotPassword || loading?.resetPassword || false;
  const forgotError = error?.forgotPassword || error?.resetPassword || null;

  const [email, setEmail] = useState('');
  const [passwords, setPasswords] = useState({
    password: '',
    confirmPassword: '',
  });
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [validationErrors, setValidationErrors] = useState<any>({});
  const [linkSent, setLinkSent] = useState(false);

  const isResetMode = !!token;
  console.log('[ForgotPassword] Mode:', isResetMode ? 'Reset Password' : 'Request Reset Link');
  console.log('[ForgotPassword] Token:', token);

  const validateEmail = () => {
    const errors: any = {};
    if (!email) {
      errors.email = 'Email is required';
    } else if (!/\S+@\S+\.\S+/.test(email)) {
      errors.email = 'Email is invalid';
    }
    setValidationErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const validatePasswords = () => {
    const errors: any = {};

    if (!passwords.password) {
      errors.password = 'Password is required';
    } else if (passwords.password.length < 8) {
      errors.password = 'Password must be at least 8 characters';
    } else if (!/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/.test(passwords.password)) {
      errors.password = 'Password must contain uppercase, lowercase, number, and special character';
    }

    if (!passwords.confirmPassword) {
      errors.confirmPassword = 'Please confirm your password';
    } else if (passwords.password !== passwords.confirmPassword) {
      errors.confirmPassword = 'Passwords do not match';
    }

    setValidationErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const handleSendLink = async (e: React.FormEvent) => {
    e.preventDefault();
    console.log('[ForgotPassword] Sending reset link to:', email);

    if (!validateEmail()) {
      console.log('[ForgotPassword] Email validation failed');
      return;
    }

    try {
      await dispatch(sendResetPasswordLink({ email }) as any).unwrap();
      console.log('[ForgotPassword] Reset link sent successfully');
      setLinkSent(true);
    } catch (err: any) {
      console.error('[ForgotPassword] Failed to send reset link:', err);
    }
  };

  const handleResetPassword = async (e: React.FormEvent) => {
    e.preventDefault();
    console.log('[ForgotPassword] Resetting password with token');

    if (!validatePasswords()) {
      console.log('[ForgotPassword] Password validation failed');
      return;
    }

    try {
      await dispatch(resetPassword({ token: token!, ...passwords }) as any).unwrap();
      console.log('[ForgotPassword] Password reset successful');
      navigate('/auth/login', { state: { message: 'Password reset successful! Please login.' } });
    } catch (err: any) {
      console.error('[ForgotPassword] Password reset failed:', err);
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
            className="absolute w-2 h-2 bg-[#ff0055] rounded-full opacity-40"
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

      {/* Main Card */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        className="relative z-10 w-full max-w-md"
      >
        <div className="bg-[#141420] border border-[#ff0055]/20 rounded-lg p-8 shadow-2xl">
          {/* Header */}
          <div className="text-center mb-8">
            <motion.div
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ type: "spring", duration: 0.6 }}
              className="inline-block mb-4"
            >
              <div className="w-16 h-16 bg-gradient-to-br from-[#ff0055] to-[#ff0088] rounded-full flex items-center justify-center mx-auto">
                <KeyRound className="w-8 h-8 text-white" />
              </div>
            </motion.div>
            <h1 className="text-3xl font-black text-white mb-2">
              {isResetMode ? 'Reset Password' : 'Forgot Password?'}
            </h1>
            <p className="text-gray-400">
              {isResetMode
                ? 'Enter your new password'
                : 'No worries, we\'ll send you reset instructions'}
            </p>
          </div>

          {/* Success Message for Link Sent */}
          <AnimatePresence>
            {linkSent && (
              <motion.div
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                className="mb-4"
              >
                <Alert className="bg-green-500/10 border-green-500/50">
                  <AlertDescription className="text-green-400">
                    Check your email! We've sent you a password reset link.
                  </AlertDescription>
                </Alert>
              </motion.div>
            )}
          </AnimatePresence>

          {/* Error Alert */}
          <AnimatePresence>
            {forgotError && (
              <motion.div
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                className="mb-4"
              >
                <Alert variant="destructive" className="bg-red-500/10 border-red-500/50">
                  <AlertDescription className="text-red-400">
                    {forgotError}
                  </AlertDescription>
                </Alert>
              </motion.div>
            )}
          </AnimatePresence>

          {/* Forms */}
          {!isResetMode ? (
            /* Request Reset Link Form */
            <form onSubmit={handleSendLink} className="space-y-6">
              <div className="space-y-2">
                <Label htmlFor="email" className="text-gray-300">
                  Email Address
                </Label>
                <div className="relative">
                  <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-500" />
                  <Input
                    id="email"
                    type="email"
                    value={email}
                    onChange={(e) => {
                      setEmail(e.target.value);
                      if (validationErrors.email) {
                        setValidationErrors({});
                      }
                    }}
                    className={`pl-10 bg-[#0a0a0f] border-[#ff0055]/30 text-white focus:border-[#ff0055] ${
                      validationErrors.email ? 'border-red-500' : ''
                    }`}
                    placeholder="your@email.com"
                  />
                </div>
                {validationErrors.email && (
                  <p className="text-red-400 text-sm">{validationErrors.email}</p>
                )}
              </div>

              <Button
                type="submit"
                disabled={loading || linkSent}
                className="w-full bg-[#ff0055] hover:bg-[#ff0055]/90 text-white font-bold py-6 transition-all hover:shadow-[0_0_20px_rgba(255,0,85,0.6)]"
              >
                {loading ? (
                  <span className="flex items-center gap-2">
                    <Loader2 className="w-5 h-5 animate-spin" />
                    Sending...
                  </span>
                ) : (
                  <span className="flex items-center gap-2">
                    <Send className="w-5 h-5" />
                    Send Reset Link
                  </span>
                )}
              </Button>
            </form>
          ) : (
            /* Reset Password Form */
            <form onSubmit={handleResetPassword} className="space-y-6">
              <div className="space-y-2">
                <Label htmlFor="password" className="text-gray-300">
                  New Password
                </Label>
                <div className="relative">
                  <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-500" />
                  <Input
                    id="password"
                    type={showPassword ? 'text' : 'password'}
                    value={passwords.password}
                    onChange={(e) => {
                      setPasswords((prev) => ({ ...prev, password: e.target.value }));
                      if (validationErrors.password) {
                        setValidationErrors((prev: any) => ({ ...prev, password: '' }));
                      }
                    }}
                    className={`pl-10 pr-12 bg-[#0a0a0f] border-[#ff0055]/30 text-white focus:border-[#ff0055] ${
                      validationErrors.password ? 'border-red-500' : ''
                    }`}
                    placeholder="Enter new password"
                  />
                  <motion.button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 hover:text-[#ff0055]"
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

              <div className="space-y-2">
                <Label htmlFor="confirmPassword" className="text-gray-300">
                  Confirm New Password
                </Label>
                <div className="relative">
                  <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-500" />
                  <Input
                    id="confirmPassword"
                    type={showConfirmPassword ? 'text' : 'password'}
                    value={passwords.confirmPassword}
                    onChange={(e) => {
                      setPasswords((prev) => ({ ...prev, confirmPassword: e.target.value }));
                      if (validationErrors.confirmPassword) {
                        setValidationErrors((prev: any) => ({ ...prev, confirmPassword: '' }));
                      }
                    }}
                    className={`pl-10 pr-12 bg-[#0a0a0f] border-[#ff0055]/30 text-white focus:border-[#ff0055] ${
                      validationErrors.confirmPassword ? 'border-red-500' : ''
                    }`}
                    placeholder="Confirm new password"
                  />
                  <motion.button
                    type="button"
                    onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 hover:text-[#ff0055]"
                    whileHover={{ scale: 1.1 }}
                    whileTap={{ scale: 0.9 }}
                  >
                    <AnimatePresence mode="wait">
                      {showConfirmPassword ? (
                        <motion.div
                          key="eye-off-confirm"
                          initial={{ rotate: -180, opacity: 0 }}
                          animate={{ rotate: 0, opacity: 1 }}
                          exit={{ rotate: 180, opacity: 0 }}
                          transition={{ duration: 0.3 }}
                        >
                          <EyeOff className="w-5 h-5" />
                        </motion.div>
                      ) : (
                        <motion.div
                          key="eye-confirm"
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
                {validationErrors.confirmPassword && (
                  <p className="text-red-400 text-sm">{validationErrors.confirmPassword}</p>
                )}
              </div>

              <Button
                type="submit"
                disabled={isLoading}
                className="w-full bg-[#00ff88] hover:bg-[#00ff88]/90 text-[#0a0a0f] font-bold py-6 transition-all hover:shadow-[0_0_20px_rgba(0,255,136,0.6)]"
              >
                {isLoading ? (
                  <span className="flex items-center gap-2">
                    <Loader2 className="w-5 h-5 animate-spin" />
                    Resetting...
                  </span>
                ) : (
                  'Reset Password'
                )}
              </Button>
            </form>
          )}

          {/* Back to Login */}
          <div className="mt-6 text-center">
            <Link
              to="/auth/login"
              className="text-sm text-gray-500 hover:text-[#ff0055] transition-colors"
            >
              ← Back to Login
            </Link>
          </div>
        </div>
      </motion.div>
    </div>
  );
};

export default ForgotPassword;