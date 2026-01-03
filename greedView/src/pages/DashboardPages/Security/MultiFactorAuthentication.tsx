import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Shield, 
  Smartphone, 
  Mail, 
  Key,
  QrCode,
  CheckCircle,
  XCircle,
  ChevronRight,
  X,
  Copy,
  RefreshCw,
  AlertTriangle,
  Lock
} from 'lucide-react';

// MFA Method interface
interface MFAMethod {
  id: string;
  name: string;
  description: string;
  icon: React.ElementType;
  enabled: boolean;
  recommended?: boolean;
  setupRequired?: boolean;
}

// MFA Method Card Component
function MFAMethodCard({ method, onToggle, onSetup }: {
  method: MFAMethod;
  onToggle: () => void;
  onSetup: () => void;
}) {
  const Icon = method.icon;

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      whileHover={{ y: -4 }}
      className={`relative p-5 rounded-2xl border transition-all ${
        method.enabled
          ? 'bg-[#00ff88]/10 border-[#00ff88]/30'
          : 'bg-[#141420]/80 border-white/10 hover:border-white/20'
      }`}
    >
      {method.recommended && (
        <span className="absolute top-3 right-3 px-2 py-1 bg-[#ffd700]/20 text-[#ffd700] text-xs font-bold rounded-lg">
          Recommended
        </span>
      )}

      <div className="flex items-start gap-4">
        <motion.div
          className={`w-14 h-14 rounded-xl flex items-center justify-center ${
            method.enabled ? 'bg-[#00ff88]/20' : 'bg-[#1a1a2e]'
          }`}
          whileHover={{ rotate: [0, -5, 5, 0] }}
        >
          <Icon className={`w-7 h-7 ${method.enabled ? 'text-[#00ff88]' : 'text-gray-400'}`} />
        </motion.div>

        <div className="flex-1">
          <div className="flex items-center gap-2 mb-1">
            <h3 className="font-bold text-white">{method.name}</h3>
            {method.enabled ? (
              <span className="flex items-center gap-1 text-xs px-2 py-0.5 bg-[#00ff88]/20 text-[#00ff88] rounded-full">
                <CheckCircle className="w-3 h-3" />
                Active
              </span>
            ) : (
              <span className="flex items-center gap-1 text-xs px-2 py-0.5 bg-gray-500/20 text-gray-400 rounded-full">
                <XCircle className="w-3 h-3" />
                Inactive
              </span>
            )}
          </div>
          <p className="text-gray-400 text-sm mb-4">{method.description}</p>

          <div className="flex gap-2">
            {method.enabled ? (
              <>
                <motion.button
                  onClick={onSetup}
                  className="px-4 py-2 text-sm font-medium text-[#00d9ff] hover:bg-[#00d9ff]/10 rounded-lg transition-colors"
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                >
                  Reconfigure
                </motion.button>
                <motion.button
                  onClick={onToggle}
                  className="px-4 py-2 text-sm font-medium text-red-400 hover:bg-red-400/10 rounded-lg transition-colors"
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                >
                  Disable
                </motion.button>
              </>
            ) : (
              <motion.button
                onClick={onSetup}
                className="px-4 py-2 text-sm font-medium bg-[#00ff88] text-black rounded-lg"
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
              >
                Enable Now
              </motion.button>
            )}
          </div>
        </div>
      </div>
    </motion.div>
  );
}

// Authenticator Setup Modal
function AuthenticatorSetupModal({ isOpen, onClose }: { isOpen: boolean; onClose: () => void }) {
  const [step, setStep] = useState(1);
  const [code, setCode] = useState('');
  const backupCodes = ['ABC12-DEF34', 'GHI56-JKL78', 'MNO90-PQR12', 'STU34-VWX56', 'YZA78-BCD90'];

  if (!isOpen) return null;

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-sm"
        onClick={onClose}
      >
        <motion.div
          initial={{ opacity: 0, scale: 0.9, y: 20 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.9, y: 20 }}
          className="w-full max-w-md bg-[#141420] border border-white/10 rounded-2xl overflow-hidden"
          onClick={(e) => e.stopPropagation()}
        >
          {/* Header */}
          <div className="flex items-center justify-between p-5 border-b border-white/10">
            <h3 className="text-xl font-bold text-white">Setup Authenticator</h3>
            <motion.button
              onClick={onClose}
              className="p-2 hover:bg-white/10 rounded-lg transition-colors"
              whileHover={{ scale: 1.1, rotate: 90 }}
            >
              <X className="w-5 h-5 text-gray-400" />
            </motion.button>
          </div>

          {/* Progress */}
          <div className="px-5 pt-5">
            <div className="flex items-center gap-2 mb-6">
              {[1, 2, 3].map((s) => (
                <div key={s} className="flex-1 flex items-center gap-2">
                  <motion.div
                    className={`w-8 h-8 rounded-full flex items-center justify-center font-bold text-sm ${
                      s <= step
                        ? 'bg-[#00ff88] text-black'
                        : 'bg-[#1a1a2e] text-gray-500'
                    }`}
                    animate={s === step ? { scale: [1, 1.1, 1] } : {}}
                    transition={{ duration: 0.5 }}
                  >
                    {s}
                  </motion.div>
                  {s < 3 && (
                    <div className={`flex-1 h-1 rounded ${s < step ? 'bg-[#00ff88]' : 'bg-[#1a1a2e]'}`} />
                  )}
                </div>
              ))}
            </div>
          </div>

          {/* Content */}
          <div className="p-5">
            <AnimatePresence mode="wait">
              {step === 1 && (
                <motion.div
                  key="step1"
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -20 }}
                  className="text-center"
                >
                  <p className="text-gray-400 mb-6">Scan this QR code with your authenticator app</p>
                  <div className="w-48 h-48 mx-auto bg-white rounded-xl p-4 mb-6">
                    <div className="w-full h-full bg-[url('data:image/svg+xml,%3Csvg%20xmlns%3D%22http%3A%2F%2Fwww.w3.org%2F2000%2Fsvg%22%20viewBox%3D%220%200%2041%2041%22%3E%3Crect%20fill%3D%22%23000%22%20width%3D%2241%22%20height%3D%2241%22%2F%3E%3C%2Fsvg%3E')] rounded-lg flex items-center justify-center">
                      <QrCode className="w-24 h-24 text-gray-600" />
                    </div>
                  </div>
                  <p className="text-gray-500 text-sm mb-4">Can't scan? Enter this code manually:</p>
                  <div className="flex items-center justify-center gap-2 p-3 bg-[#1a1a2e] rounded-xl">
                    <code className="text-[#00ff88] font-mono tracking-wider">JBSWY3DPEHPK3PXP</code>
                    <motion.button
                      className="p-2 hover:bg-white/10 rounded-lg"
                      whileTap={{ scale: 0.95 }}
                    >
                      <Copy className="w-4 h-4 text-gray-400" />
                    </motion.button>
                  </div>
                </motion.div>
              )}

              {step === 2 && (
                <motion.div
                  key="step2"
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -20 }}
                >
                  <p className="text-gray-400 mb-6 text-center">Enter the 6-digit code from your authenticator app</p>
                  <div className="flex gap-2 justify-center mb-6">
                    {[...Array(6)].map((_, i) => (
                      <input
                        key={i}
                        type="text"
                        maxLength={1}
                        className="w-12 h-14 text-center text-2xl font-bold bg-[#1a1a2e] border border-white/10 rounded-xl text-white focus:border-[#00ff88]/50 focus:outline-none"
                        value={code[i] || ''}
                        onChange={(e) => {
                          const newCode = code.split('');
                          newCode[i] = e.target.value;
                          setCode(newCode.join(''));
                          if (e.target.value && e.target.nextElementSibling) {
                            (e.target.nextElementSibling as HTMLInputElement).focus();
                          }
                        }}
                      />
                    ))}
                  </div>
                  <p className="text-gray-500 text-sm text-center flex items-center justify-center gap-2">
                    <RefreshCw className="w-4 h-4" />
                    Code refreshes every 30 seconds
                  </p>
                </motion.div>
              )}

              {step === 3 && (
                <motion.div
                  key="step3"
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -20 }}
                >
                  <div className="text-center mb-6">
                    <motion.div
                      className="w-16 h-16 mx-auto mb-4 rounded-full bg-[#00ff88]/20 flex items-center justify-center"
                      initial={{ scale: 0 }}
                      animate={{ scale: 1 }}
                      transition={{ type: 'spring' }}
                    >
                      <CheckCircle className="w-8 h-8 text-[#00ff88]" />
                    </motion.div>
                    <h4 className="text-lg font-bold text-white mb-2">Almost Done!</h4>
                    <p className="text-gray-400 text-sm">Save these backup codes in a safe place</p>
                  </div>

                  <div className="p-4 bg-[#1a1a2e] rounded-xl mb-4">
                    <div className="flex items-center gap-2 text-[#ffd700] mb-3">
                      <AlertTriangle className="w-4 h-4" />
                      <span className="text-sm font-medium">Important</span>
                    </div>
                    <p className="text-gray-400 text-sm mb-4">These codes can be used to access your account if you lose your authenticator device.</p>
                    <div className="grid grid-cols-2 gap-2">
                      {backupCodes.map((code, i) => (
                        <div key={i} className="px-3 py-2 bg-[#141420] rounded-lg text-center">
                          <code className="text-white text-sm font-mono">{code}</code>
                        </div>
                      ))}
                    </div>
                  </div>

                  <motion.button
                    className="w-full py-3 border border-white/10 text-white rounded-xl flex items-center justify-center gap-2"
                    whileHover={{ scale: 1.01 }}
                  >
                    <Copy className="w-4 h-4" />
                    Copy All Codes
                  </motion.button>
                </motion.div>
              )}
            </AnimatePresence>
          </div>

          {/* Footer */}
          <div className="p-5 border-t border-white/10 flex gap-3">
            {step > 1 && (
              <motion.button
                onClick={() => setStep(step - 1)}
                className="flex-1 py-3 border border-white/10 text-white font-medium rounded-xl"
                whileHover={{ scale: 1.01 }}
                whileTap={{ scale: 0.99 }}
              >
                Back
              </motion.button>
            )}
            <motion.button
              onClick={() => step < 3 ? setStep(step + 1) : onClose()}
              className="flex-1 py-3 bg-[#00ff88] text-black font-bold rounded-xl"
              whileHover={{ scale: 1.01 }}
              whileTap={{ scale: 0.99 }}
            >
              {step === 3 ? 'Done' : 'Continue'}
            </motion.button>
          </div>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
}

// Main Component
export function MultiFactorAuthentication() {
  const [showSetupModal, setShowSetupModal] = useState(false);

  const methods: MFAMethod[] = [
    { id: '1', name: 'Authenticator App', description: 'Use an app like Google Authenticator or Authy to generate time-based codes', icon: Smartphone, enabled: true, recommended: true },
    { id: '2', name: 'Email OTP', description: 'Receive a one-time password via email for each login', icon: Mail, enabled: false },
    { id: '3', name: 'SMS OTP', description: 'Receive a verification code via SMS to your registered phone', icon: Smartphone, enabled: false },
    { id: '4', name: 'Security Keys', description: 'Use a physical security key like YubiKey for authentication', icon: Key, enabled: false },
  ];

  return (
    <div className="space-y-8">
      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
      >
        <h1 className="text-3xl font-black text-white mb-2 flex items-center gap-3">
          <Shield className="w-8 h-8 text-[#8b5cf6]" />
          Multi-Factor Authentication
        </h1>
        <p className="text-gray-400">Add extra layers of security to your account</p>
      </motion.div>

      {/* Security Status */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1 }}
        className="bg-gradient-to-br from-[#8b5cf6]/20 to-[#00ff88]/10 border border-[#8b5cf6]/30 rounded-2xl p-6"
      >
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-4">
            <motion.div
              className="w-16 h-16 rounded-2xl bg-[#8b5cf6]/20 flex items-center justify-center"
              animate={{ rotate: [0, 5, -5, 0] }}
              transition={{ duration: 4, repeat: Infinity }}
            >
              <Lock className="w-8 h-8 text-[#8b5cf6]" />
            </motion.div>
            <div>
              <h3 className="text-xl font-bold text-white mb-1">MFA is Enabled</h3>
              <p className="text-gray-400">1 authentication method is active</p>
            </div>
          </div>
          <div className="text-right">
            <span className="inline-flex items-center gap-2 px-4 py-2 bg-[#00ff88]/20 text-[#00ff88] rounded-xl font-medium">
              <CheckCircle className="w-5 h-5" />
              Protected
            </span>
          </div>
        </div>
      </motion.div>

      {/* MFA Methods */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2 }}
        className="space-y-4"
      >
        <h3 className="text-lg font-bold text-white">Authentication Methods</h3>
        {methods.map((method, i) => (
          <motion.div
            key={method.id}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 * i }}
          >
            <MFAMethodCard
              method={method}
              onToggle={() => {}}
              onSetup={() => setShowSetupModal(true)}
            />
          </motion.div>
        ))}
      </motion.div>

      {/* Backup Codes */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.4 }}
        className="bg-[#141420]/80 backdrop-blur-xl border border-white/10 rounded-2xl p-5"
      >
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 rounded-xl bg-[#ffd700]/20 flex items-center justify-center">
              <Key className="w-6 h-6 text-[#ffd700]" />
            </div>
            <div>
              <h3 className="font-bold text-white">Backup Codes</h3>
              <p className="text-gray-400 text-sm">5 codes remaining</p>
            </div>
          </div>
          <motion.button
            className="px-4 py-2 text-sm font-medium text-[#00d9ff] hover:bg-[#00d9ff]/10 rounded-lg transition-colors"
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
          >
            Generate New Codes
          </motion.button>
        </div>
      </motion.div>

      {/* Setup Modal */}
      <AuthenticatorSetupModal isOpen={showSetupModal} onClose={() => setShowSetupModal(false)} />
    </div>
  );
}
