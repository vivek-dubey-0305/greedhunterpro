import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Link, useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { Mail, Lock, User, Phone, Eye, EyeOff, Loader2, UserPlus, Calendar } from 'lucide-react';
import { registerUser } from '../../../redux/slice/user.slice';
import { Button } from '../../../components/ui/button';
import { Input } from '../../../components/ui/input';
import { Label } from '../../../components/ui/label';
import { Alert, AlertDescription } from '../../../components/ui/alert';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../../../components/ui/select';

const Register: React.FC = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { loading, error } = useSelector((state: any) => state.user);
  const isLoading = loading?.register || false;
  const registerError = error?.register || null;

  const [formData, setFormData] = useState({
    username: '',
    email: '',
    phone: '',
    password: '',
    confirmPassword: '',
    gender: '',
    dob: '',
  });
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [validationErrors, setValidationErrors] = useState<any>({});

  console.log('[Register] Component mounted');

  const validateForm = () => {
    console.log('[Register] Validating form data:', { ...formData, password: '***', confirmPassword: '***' });
    const errors: any = {};

    // Username validation
    if (!formData.username) {
      errors.username = 'Username is required';
    } else if (formData.username.length < 4) {
      errors.username = 'Username must be at least 4 characters';
    } else if (formData.username.length > 100) {
      errors.username = 'Username cannot exceed 100 characters';
    }

    // Email validation
    if (!formData.email) {
      errors.email = 'Email is required';
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
      errors.email = 'Email is invalid';
    }

    // Phone validation
    if (!formData.phone) {
      errors.phone = 'Phone number is required';
    } else if (!/^[1-9]\d{9}$/.test(formData.phone)) {
      errors.phone = 'Please enter a valid 10-digit phone number';
    }

    // Password validation
    if (!formData.password) {
      errors.password = 'Password is required';
    } else if (formData.password.length < 8) {
      errors.password = 'Password must be at least 8 characters';
    } else if (!/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/.test(formData.password)) {
      errors.password = 'Password must contain uppercase, lowercase, number, and special character';
    }

    // Confirm password validation
    if (!formData.confirmPassword) {
      errors.confirmPassword = 'Please confirm your password';
    } else if (formData.password !== formData.confirmPassword) {
      errors.confirmPassword = 'Passwords do not match';
    }

    // Date of birth validation (optional but if provided, must be valid)
    if (formData.dob) {
      const age = new Date().getFullYear() - new Date(formData.dob).getFullYear();
      if (age < 13) {
        errors.dob = 'You must be at least 13 years old';
      }
    }

    setValidationErrors(errors);
    console.log('[Register] Validation errors:', errors);
    return Object.keys(errors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    console.log('[Register] Form submitted');

    if (!validateForm()) {
      console.log('[Register] Form validation failed');
      return;
    }

    try {
      console.log('[Register] Dispatching registerUser action');
      const { confirmPassword, ...registerData } = formData;
      const result = await dispatch(registerUser(registerData) as any).unwrap();
      console.log('[Register] Registration successful:', result);
      console.log('[Register] Redirecting to OTP verification');
      navigate('/auth/otp', { state: { email: formData.email } });
    } catch (err: any) {
      console.error('[Register] Registration failed:', err);
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
    // Clear validation error for this field
    if (validationErrors[name]) {
      setValidationErrors((prev: any) => ({ ...prev, [name]: '' }));
    }
  };

  const handleGenderChange = (value: string) => {
    setFormData(prev => ({ ...prev, gender: value }));
  };

  const handleGoogleRegister = () => {
    console.log('[Register] Initiating Google OAuth registration');
    window.location.href = `${import.meta.env.VITE_API_URL}/users/auth/google`;
  };

  return (
    <div className="min-h-screen bg-[#0a0a0f] flex items-center justify-center overflow-hidden px-4 py-12">
      {/* Animated Background */}
      <div className="absolute inset-0 cyber-grid opacity-10"></div>
      <div className="absolute inset-0">
        {[...Array(25)].map((_, i) => (
          <motion.div
            key={i}
            className="absolute w-2 h-2 bg-[#00d9ff] rounded-full opacity-40"
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

      {/* Register Card */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        className="relative z-10 w-full max-w-2xl"
      >
        <div className="bg-[#141420] border border-[#00d9ff]/20 rounded-lg p-8 shadow-2xl">
          {/* Header */}
          <div className="text-center mb-8">
            <motion.div
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ type: "spring", duration: 0.6 }}
              className="inline-block mb-4"
            >
              <div className="w-16 h-16 bg-gradient-to-br from-[#00d9ff] to-[#8b5cf6] rounded-full flex items-center justify-center mx-auto">
                <UserPlus className="w-8 h-8 text-white" />
              </div>
            </motion.div>
            <h1 className="text-3xl font-black text-white mb-2">
              Join GreedHunter
            </h1>
            <p className="text-gray-400">Create your account and start hunting</p>
          </div>

          {/* Error Alert */}
          <AnimatePresence>
            {registerError && (
              <motion.div
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                className="mb-4"
              >
                <Alert variant="destructive" className="bg-red-500/10 border-red-500/50">
                  <AlertDescription className="text-red-400">
                    {registerError}
                  </AlertDescription>
                </Alert>
              </motion.div>
            )}
          </AnimatePresence>

          {/* Register Form */}
          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Username & Email */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="username" className="text-gray-300">
                  Username *
                </Label>
                <div className="relative">
                  <User className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-500" />
                  <Input
                    id="username"
                    name="username"
                    type="text"
                    value={formData.username}
                    onChange={handleChange}
                    className={`pl-10 bg-[#0a0a0f] border-[#00d9ff]/30 text-white focus:border-[#00d9ff] ${
                      validationErrors.username ? 'border-red-500' : ''
                    }`}
                    placeholder="Choose username"
                  />
                </div>
                {validationErrors.username && (
                  <p className="text-red-400 text-xs">{validationErrors.username}</p>
                )}
              </div>

              <div className="space-y-2">
                <Label htmlFor="email" className="text-gray-300">
                  Email *
                </Label>
                <div className="relative">
                  <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-500" />
                  <Input
                    id="email"
                    name="email"
                    type="email"
                    value={formData.email}
                    onChange={handleChange}
                    className={`pl-10 bg-[#0a0a0f] border-[#00d9ff]/30 text-white focus:border-[#00d9ff] ${
                      validationErrors.email ? 'border-red-500' : ''
                    }`}
                    placeholder="your@email.com"
                  />
                </div>
                {validationErrors.email && (
                  <p className="text-red-400 text-xs">{validationErrors.email}</p>
                )}
              </div>
            </div>

            {/* Phone & Gender */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="phone" className="text-gray-300">
                  Phone Number *
                </Label>
                <div className="relative">
                  <Phone className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-500" />
                  <Input
                    id="phone"
                    name="phone"
                    type="tel"
                    value={formData.phone}
                    onChange={handleChange}
                    className={`pl-10 bg-[#0a0a0f] border-[#00d9ff]/30 text-white focus:border-[#00d9ff] ${
                      validationErrors.phone ? 'border-red-500' : ''
                    }`}
                    placeholder="10-digit number"
                    maxLength={10}
                  />
                </div>
                {validationErrors.phone && (
                  <p className="text-red-400 text-xs">{validationErrors.phone}</p>
                )}
              </div>

              <div className="space-y-2">
                <Label htmlFor="gender" className="text-gray-300">
                  Gender (Optional)
                </Label>
                <Select value={formData.gender} onValueChange={handleGenderChange}>
                  <SelectTrigger className="bg-[#0a0a0f] border-[#00d9ff]/30 text-white focus:border-[#00d9ff]">
                    <SelectValue placeholder="Select gender" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="male">Male</SelectItem>
                    <SelectItem value="female">Female</SelectItem>
                    <SelectItem value="other">Other</SelectItem>
                    <SelectItem value="not specified">Prefer not to say</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>

            {/* Date of Birth */}
            <div className="space-y-2">
              <Label htmlFor="dob" className="text-gray-300">
                Date of Birth (Optional)
              </Label>
              <div className="relative">
                <Calendar className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-500" />
                <Input
                  id="dob"
                  name="dob"
                  type="date"
                  value={formData.dob}
                  onChange={handleChange}
                  className={`pl-10 bg-[#0a0a0f] border-[#00d9ff]/30 text-white focus:border-[#00d9ff] ${
                    validationErrors.dob ? 'border-red-500' : ''
                  }`}
                  max={new Date(new Date().setFullYear(new Date().getFullYear() - 13)).toISOString().split('T')[0]}
                />
              </div>
              {validationErrors.dob && (
                <p className="text-red-400 text-xs">{validationErrors.dob}</p>
              )}
            </div>

            {/* Password Fields */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="password" className="text-gray-300">
                  Password *
                </Label>
                <div className="relative">
                  <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-500" />
                  <Input
                    id="password"
                    name="password"
                    type={showPassword ? 'text' : 'password'}
                    value={formData.password}
                    onChange={handleChange}
                    className={`pl-10 pr-12 bg-[#0a0a0f] border-[#00d9ff]/30 text-white focus:border-[#00d9ff] ${
                      validationErrors.password ? 'border-red-500' : ''
                    }`}
                    placeholder="Create password"
                  />
                  <motion.button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 hover:text-[#00d9ff]"
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
                  <p className="text-red-400 text-xs">{validationErrors.password}</p>
                )}
              </div>

              <div className="space-y-2">
                <Label htmlFor="confirmPassword" className="text-gray-300">
                  Confirm Password *
                </Label>
                <div className="relative">
                  <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-500" />
                  <Input
                    id="confirmPassword"
                    name="confirmPassword"
                    type={showConfirmPassword ? 'text' : 'password'}
                    value={formData.confirmPassword}
                    onChange={handleChange}
                    className={`pl-10 pr-12 bg-[#0a0a0f] border-[#00d9ff]/30 text-white focus:border-[#00d9ff] ${
                      validationErrors.confirmPassword ? 'border-red-500' : ''
                    }`}
                    placeholder="Confirm password"
                  />
                  <motion.button
                    type="button"
                    onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 hover:text-[#00d9ff]"
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
                  <p className="text-red-400 text-xs">{validationErrors.confirmPassword}</p>
                )}
              </div>
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
                  Creating Account...
                </span>
              ) : (
                'Create Account'
              )}
            </Button>

            {/* Divider */}
            <div className="relative">
              <div className="absolute inset-0 flex items-center">
                <div className="w-full border-t border-gray-700"></div>
              </div>
              <div className="relative flex justify-center text-sm">
                <span className="px-2 bg-[#141420] text-gray-400">Or register with</span>
              </div>
            </div>

            {/* Google Register */}
            <Button
              type="button"
              onClick={handleGoogleRegister}
              variant="outline"
              className="w-full border-[#00d9ff]/30 hover:border-[#00d9ff] text-white py-6"
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

          {/* Login Link */}
          <div className="mt-6 text-center">
            <p className="text-gray-400">
              Already have an account?{' '}
              <Link
                to="/auth/login"
                className="text-[#00d9ff] hover:text-[#8b5cf6] font-semibold transition-colors"
              >
                Login Here
              </Link>
            </p>
          </div>

          {/* Back to Home */}
          <div className="mt-4 text-center">
            <Link
              to="/"
              className="text-sm text-gray-500 hover:text-[#00d9ff] transition-colors"
            >
              ← Back to Home
            </Link>
          </div>
        </div>
      </motion.div>
    </div>
  );
};

export default Register;
