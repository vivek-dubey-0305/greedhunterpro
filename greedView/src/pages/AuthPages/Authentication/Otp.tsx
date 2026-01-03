import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { Shield, Loader2, CheckCircle, RefreshCw } from 'lucide-react';
import { verifyOtp, sendOtp } from '../../../redux/slice/user.slice';
import { Button } from '../../../components/ui/button';
import { Input } from '../../../components/ui/input';
import { Alert, AlertDescription } from '../../../components/ui/alert';

const Otp: React.FC = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const dispatch = useDispatch();
  const { loading, error } = useSelector((state: any) => state.user);
  const isVerifying = loading?.verifyOTP || false;
  const isSending = loading?.sendOTP || false;
  const verifyError = error?.verifyOTP || null;

  const email = location.state?.email || '';
  const [otp, setOtp] = useState(['', '', '', '', '', '']);
  const [resendTimer, setResendTimer] = useState(60);
  const [canResend, setCanResend] = useState(false);
  const inputRefs = useRef<(HTMLInputElement | null)[]>([]);

  console.log('[OTP] Component mounted with email:', email);

  useEffect(() => {
    if (!email) {
      console.log('[OTP] No email provided, redirecting to login');
      navigate('/auth/login');
    }
  }, [email, navigate]);

  useEffect(() => {
    if (resendTimer > 0) {
      const timer = setTimeout(() => setResendTimer(resendTimer - 1), 1000);
      return () => clearTimeout(timer);
    } else {
      setCanResend(true);
    }
  }, [resendTimer]);

  const handleChange = (index: number, value: string) => {
    if (!/^\d*$/.test(value)) return;

    const newOtp = [...otp];
    newOtp[index] = value.slice(-1);
    setOtp(newOtp);

    // Auto-focus next input
    if (value && index < 5) {
      inputRefs.current[index + 1]?.focus();
    }
  };

  const handleKeyDown = (index: number, e: React.KeyboardEvent) => {
    if (e.key === 'Backspace' && !otp[index] && index > 0) {
      inputRefs.current[index - 1]?.focus();
    }
  };

  const handlePaste = (e: React.ClipboardEvent) => {
    e.preventDefault();
    const pastedData = e.clipboardData.getData('text').slice(0, 6);
    if (!/^\d+$/.test(pastedData)) return;

    const newOtp = pastedData.split('').concat(Array(6 - pastedData.length).fill(''));
    setOtp(newOtp);

    const nextIndex = Math.min(pastedData.length, 5);
    inputRefs.current[nextIndex]?.focus();
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const otpString = otp.join('');

    if (otpString.length !== 6) {
      console.log('[OTP] Invalid OTP length');
      return;
    }

    try {
      console.log('[OTP] Verifying OTP:', otpString);
      await dispatch(verifyOtp({ email, otp: otpString }) as any).unwrap();
      console.log('[OTP] Verification successful, redirecting to dashboard');
      navigate('/dashboard');
    } catch (err: any) {
      console.error('[OTP] Verification failed:', err);
    }
  };

  const handleResend = async () => {
    if (!canResend) return;

    try {
      console.log('[OTP] Resending OTP to:', email);
      await dispatch(sendOtp() as any).unwrap();
      console.log('[OTP] OTP resent successfully');
      setResendTimer(60);
      setCanResend(false);
    } catch (err: any) {
      console.error('[OTP] Failed to resend OTP:', err);
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
            className="absolute w-2 h-2 bg-[#8b5cf6] rounded-full opacity-40"
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

      {/* OTP Card */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        className="relative z-10 w-full max-w-md"
      >
        <div className="bg-[#141420] border border-[#8b5cf6]/20 rounded-lg p-8 shadow-2xl">
          {/* Header */}
          <div className="text-center mb-8">
            <motion.div
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ type: "spring", duration: 0.6 }}
              className="inline-block mb-4"
            >
              <div className="w-16 h-16 bg-gradient-to-br from-[#8b5cf6] to-[#00ff88] rounded-full flex items-center justify-center mx-auto">
                <Shield className="w-8 h-8 text-white" />
              </div>
            </motion.div>
            <h1 className="text-3xl font-black text-white mb-2">
              Verify Your Email
            </h1>
            <p className="text-gray-400">
              We've sent a 6-digit code to
            </p>
            <p className="text-[#8b5cf6] font-semibold mt-1">{email}</p>
          </div>

          {/* Error Alert */}
          <AnimatePresence>
            {verifyError && (
              <motion.div
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                className="mb-4"
              >
                <Alert variant="destructive" className="bg-red-500/10 border-red-500/50">
                  <AlertDescription className="text-red-400">
                    {verifyError}
                  </AlertDescription>
                </Alert>
              </motion.div>
            )}
          </AnimatePresence>

          {/* OTP Form */}
          <form onSubmit={handleSubmit} className="space-y-6">
            {/* OTP Input */}
            <div className="flex justify-center gap-2">
              {otp.map((digit, index) => (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, scale: 0.5 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ delay: index * 0.1 }}
                >
                  <Input
                    ref={(el) => (inputRefs.current[index] = el)}
                    type="text"
                    inputMode="numeric"
                    maxLength={1}
                    value={digit}
                    onChange={(e) => handleChange(index, e.target.value)}
                    onKeyDown={(e) => handleKeyDown(index, e)}
                    onPaste={handlePaste}
                    className="w-12 h-14 text-center text-2xl font-bold bg-[#0a0a0f] border-[#8b5cf6]/30 text-white focus:border-[#8b5cf6] focus:ring-2 focus:ring-[#8b5cf6]/20"
                  />
                </motion.div>
              ))}
            </div>

            {/* Submit Button */}
            <Button
              type="submit"
              disabled={isVerifying || otp.join('').length !== 6}
              className="w-full bg-[#00ff88] hover:bg-[#00ff88]/90 text-[#0a0a0f] font-bold py-6 transition-all hover:shadow-[0_0_20px_rgba(0,255,136,0.6)]"
            >
              {isVerifying ? (
                <span className="flex items-center gap-2">
                  <Loader2 className="w-5 h-5 animate-spin" />
                  Verifying...
                </span>
              ) : (
                <span className="flex items-center gap-2">
                  <CheckCircle className="w-5 h-5" />
                  Verify Email
                </span>
              )}
            </Button>

            {/* Resend OTP */}
            <div className="text-center">
              {canResend ? (
                <Button
                  type="button"
                  onClick={handleResend}
                  variant="ghost"
                  className="text-[#8b5cf6] hover:text-[#8b5cf6]/80"
                >
                  <RefreshCw className="w-4 h-4 mr-2" />
                  Resend OTP
                </Button>
              ) : (
                <p className="text-gray-400 text-sm">
                  Resend OTP in <span className="text-[#8b5cf6] font-semibold">{resendTimer}s</span>
                </p>
              )}
            </div>
          </form>

          {/* Back to Login */}
          <div className="mt-6 text-center">
            <Link
              to="/auth/login"
              className="text-sm text-gray-500 hover:text-[#8b5cf6] transition-colors"
            >
              ← Back to Login
            </Link>
          </div>
        </div>
      </motion.div>
    </div>
  );
};

export default Otp;