import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  AlertTriangle, 
  Trash2, 
  Power, 
  Download,
  Shield,
  X,
  AlertCircle,
  CheckCircle,
  Clock
} from 'lucide-react';

// Confirmation Modal
function ConfirmationModal({ 
  isOpen, 
  onClose, 
  action, 
  title, 
  description, 
  confirmText,
  onConfirm,
  requireConfirmation = true
}: {
  isOpen: boolean;
  onClose: () => void;
  action: 'deactivate' | 'delete';
  title: string;
  description: string;
  confirmText: string;
  onConfirm: () => void;
  requireConfirmation?: boolean;
}) {
  const [confirmInput, setConfirmInput] = useState('');
  const [step, setStep] = useState(1);

  if (!isOpen) return null;

  const isConfirmed = !requireConfirmation || confirmInput === confirmText;

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm"
        onClick={onClose}
      >
        <motion.div
          initial={{ opacity: 0, scale: 0.9, y: 20 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.9, y: 20 }}
          className="w-full max-w-md bg-[#141420] border border-red-500/30 rounded-2xl overflow-hidden"
          onClick={(e) => e.stopPropagation()}
        >
          {/* Header with warning gradient */}
          <div className="relative h-24 bg-gradient-to-br from-red-500/30 to-red-900/20">
            <motion.div
              className="absolute inset-0 opacity-30"
              animate={{ 
                background: [
                  'radial-gradient(circle at 0% 0%, rgba(255,0,0,0.2) 0%, transparent 50%)',
                  'radial-gradient(circle at 100% 100%, rgba(255,0,0,0.2) 0%, transparent 50%)',
                  'radial-gradient(circle at 0% 0%, rgba(255,0,0,0.2) 0%, transparent 50%)',
                ]
              }}
              transition={{ duration: 4, repeat: Infinity }}
            />
            <motion.button
              onClick={onClose}
              className="absolute top-4 right-4 p-2 bg-black/50 rounded-lg hover:bg-black/70 transition-colors"
              whileHover={{ scale: 1.1, rotate: 90 }}
            >
              <X className="w-5 h-5 text-white" />
            </motion.button>
          </div>
          
          {/* Icon */}
          <div className="relative -mt-10 flex justify-center">
            <motion.div
              className="w-20 h-20 rounded-2xl bg-red-500/20 border border-red-500/30 flex items-center justify-center"
              animate={{ 
                scale: [1, 1.05, 1],
                boxShadow: ['0 0 20px rgba(255,0,0,0.2)', '0 0 40px rgba(255,0,0,0.3)', '0 0 20px rgba(255,0,0,0.2)']
              }}
              transition={{ duration: 2, repeat: Infinity }}
            >
              {action === 'delete' ? (
                <Trash2 className="w-10 h-10 text-red-500" />
              ) : (
                <Power className="w-10 h-10 text-red-500" />
              )}
            </motion.div>
          </div>
          
          {/* Content */}
          <div className="p-6 text-center">
            <h3 className="text-2xl font-bold text-white mb-2">{title}</h3>
            <p className="text-gray-400 mb-6">{description}</p>
            
            <AnimatePresence mode="wait">
              {step === 1 && (
                <motion.div
                  key="step1"
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -20 }}
                >
                  {/* Warning list */}
                  <div className="text-left mb-6 p-4 bg-red-500/10 border border-red-500/20 rounded-xl">
                    <p className="text-red-400 font-medium mb-3 flex items-center gap-2">
                      <AlertCircle className="w-5 h-5" />
                      This action will:
                    </p>
                    <ul className="space-y-2 text-sm text-gray-400">
                      {action === 'delete' ? (
                        <>
                          <li className="flex items-center gap-2">
                            <span className="w-1.5 h-1.5 bg-red-500 rounded-full" />
                            Permanently delete your account
                          </li>
                          <li className="flex items-center gap-2">
                            <span className="w-1.5 h-1.5 bg-red-500 rounded-full" />
                            Remove all your events and challenges data
                          </li>
                          <li className="flex items-center gap-2">
                            <span className="w-1.5 h-1.5 bg-red-500 rounded-full" />
                            Forfeit all coins and rewards
                          </li>
                          <li className="flex items-center gap-2">
                            <span className="w-1.5 h-1.5 bg-red-500 rounded-full" />
                            This cannot be undone
                          </li>
                        </>
                      ) : (
                        <>
                          <li className="flex items-center gap-2">
                            <span className="w-1.5 h-1.5 bg-yellow-500 rounded-full" />
                            Hide your profile from other users
                          </li>
                          <li className="flex items-center gap-2">
                            <span className="w-1.5 h-1.5 bg-yellow-500 rounded-full" />
                            Pause all event participations
                          </li>
                          <li className="flex items-center gap-2">
                            <span className="w-1.5 h-1.5 bg-yellow-500 rounded-full" />
                            Your data will be preserved
                          </li>
                          <li className="flex items-center gap-2">
                            <span className="w-1.5 h-1.5 bg-green-500 rounded-full" />
                            You can reactivate anytime
                          </li>
                        </>
                      )}
                    </ul>
                  </div>
                  
                  <motion.button
                    onClick={() => setStep(2)}
                    className="w-full py-3 bg-red-500 text-white font-bold rounded-xl"
                    whileHover={{ scale: 1.01 }}
                    whileTap={{ scale: 0.99 }}
                  >
                    I Understand, Continue
                  </motion.button>
                </motion.div>
              )}
              
              {step === 2 && (
                <motion.div
                  key="step2"
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -20 }}
                >
                  {requireConfirmation && (
                    <div className="mb-6">
                      <p className="text-gray-400 text-sm mb-3">
                        Type <span className="text-red-400 font-mono font-bold">"{confirmText}"</span> to confirm
                      </p>
                      <input
                        type="text"
                        value={confirmInput}
                        onChange={(e) => setConfirmInput(e.target.value)}
                        placeholder={confirmText}
                        className="w-full px-4 py-3 bg-[#1a1a2e] border border-red-500/30 rounded-xl text-white placeholder-gray-500 focus:border-red-500/50 focus:outline-none text-center font-mono"
                      />
                    </div>
                  )}
                  
                  <div className="flex gap-3">
                    <motion.button
                      onClick={() => setStep(1)}
                      className="flex-1 py-3 border border-white/10 text-white font-medium rounded-xl"
                      whileHover={{ scale: 1.01 }}
                      whileTap={{ scale: 0.99 }}
                    >
                      Back
                    </motion.button>
                    <motion.button
                      onClick={onConfirm}
                      disabled={!isConfirmed}
                      className={`flex-1 py-3 font-bold rounded-xl transition-all ${
                        isConfirmed
                          ? 'bg-red-500 text-white'
                          : 'bg-gray-600 text-gray-400 cursor-not-allowed'
                      }`}
                      whileHover={isConfirmed ? { scale: 1.01 } : {}}
                      whileTap={isConfirmed ? { scale: 0.99 } : {}}
                    >
                      {action === 'delete' ? 'Delete Account' : 'Deactivate'}
                    </motion.button>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
}

// Danger Action Card
function DangerActionCard({ icon: Icon, title, description, buttonText, severity, onClick }: {
  icon: React.ElementType;
  title: string;
  description: string;
  buttonText: string;
  severity: 'warning' | 'danger';
  onClick: () => void;
}) {
  const colors = {
    warning: {
      bg: '#ffd700',
      text: 'text-[#ffd700]',
      border: 'border-[#ffd700]/30',
      iconBg: 'bg-[#ffd700]/20',
      btnBg: 'bg-[#ffd700] text-black',
    },
    danger: {
      bg: '#ff6b6b',
      text: 'text-red-400',
      border: 'border-red-500/30',
      iconBg: 'bg-red-500/20',
      btnBg: 'bg-red-500 text-white',
    },
  };

  const color = colors[severity];

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      whileHover={{ y: -4 }}
      className={`relative p-5 rounded-2xl bg-[#141420]/80 border ${color.border} backdrop-blur-xl`}
    >
      <div className="flex items-start gap-4">
        <div className={`w-14 h-14 rounded-xl ${color.iconBg} flex items-center justify-center flex-shrink-0`}>
          <Icon className={`w-7 h-7 ${color.text}`} />
        </div>
        
        <div className="flex-1">
          <h3 className="font-bold text-white mb-1">{title}</h3>
          <p className="text-gray-400 text-sm mb-4">{description}</p>
          
          <motion.button
            onClick={onClick}
            className={`px-5 py-2.5 font-medium rounded-xl ${color.btnBg}`}
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
          >
            {buttonText}
          </motion.button>
        </div>
      </div>
    </motion.div>
  );
}

// Main Component
export function DangerZone() {
  const [showDeactivateModal, setShowDeactivateModal] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);

  return (
    <div className="space-y-8">
      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
      >
        <h1 className="text-3xl font-black text-white mb-2 flex items-center gap-3">
          <AlertTriangle className="w-8 h-8 text-red-500" />
          Danger Zone
        </h1>
        <p className="text-gray-400">Critical account actions - proceed with caution</p>
      </motion.div>

      {/* Warning Banner */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1 }}
        className="relative overflow-hidden bg-gradient-to-br from-red-500/20 to-red-900/10 border border-red-500/30 rounded-2xl p-6"
      >
        <motion.div
          className="absolute inset-0 opacity-20"
          animate={{ 
            background: [
              'linear-gradient(45deg, rgba(255,0,0,0.1) 0%, transparent 50%)',
              'linear-gradient(45deg, transparent 50%, rgba(255,0,0,0.1) 100%)',
              'linear-gradient(45deg, rgba(255,0,0,0.1) 0%, transparent 50%)',
            ]
          }}
          transition={{ duration: 3, repeat: Infinity }}
        />
        
        <div className="relative flex items-center gap-4">
          <motion.div
            className="w-16 h-16 rounded-2xl bg-red-500/20 flex items-center justify-center"
            animate={{ rotate: [0, -5, 5, 0] }}
            transition={{ duration: 2, repeat: Infinity }}
          >
            <Shield className="w-8 h-8 text-red-400" />
          </motion.div>
          <div>
            <h3 className="text-xl font-bold text-white mb-1">Irreversible Actions Ahead</h3>
            <p className="text-gray-400">
              The actions below can have permanent consequences. Please read each option carefully before proceeding.
            </p>
          </div>
        </div>
      </motion.div>

      {/* Export Data */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2 }}
      >
        <DangerActionCard
          icon={Download}
          title="Export Your Data"
          description="Download a copy of all your data including profile, events, challenges, and transaction history."
          buttonText="Request Data Export"
          severity="warning"
          onClick={() => {}}
        />
      </motion.div>

      {/* Deactivate Account */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.3 }}
      >
        <DangerActionCard
          icon={Power}
          title="Deactivate Account"
          description="Temporarily disable your account. Your profile will be hidden and you won't be able to participate in events."
          buttonText="Deactivate Account"
          severity="warning"
          onClick={() => setShowDeactivateModal(true)}
        />
      </motion.div>

      {/* Delete Account */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.4 }}
      >
        <DangerActionCard
          icon={Trash2}
          title="Delete Account Permanently"
          description="Permanently delete your account and all associated data. This action cannot be undone and you will lose all coins and achievements."
          buttonText="Delete Account"
          severity="danger"
          onClick={() => setShowDeleteModal(true)}
        />
      </motion.div>

      {/* Helpful Note */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.5 }}
        className="bg-[#1a1a2e] border border-white/10 rounded-2xl p-5"
      >
        <div className="flex items-start gap-4">
          <div className="w-10 h-10 rounded-lg bg-[#00ff88]/20 flex items-center justify-center flex-shrink-0">
            <CheckCircle className="w-5 h-5 text-[#00ff88]" />
          </div>
          <div>
            <h4 className="font-bold text-white mb-1">Need Help Instead?</h4>
            <p className="text-gray-400 text-sm">
              If you're facing issues with your account, our support team is here to help. 
              <a href="#" className="text-[#00d9ff] hover:underline ml-1">Contact Support</a>
            </p>
          </div>
        </div>
      </motion.div>

      {/* Modals */}
      <ConfirmationModal
        isOpen={showDeactivateModal}
        onClose={() => setShowDeactivateModal(false)}
        action="deactivate"
        title="Deactivate Account?"
        description="Your account will be temporarily disabled"
        confirmText="DEACTIVATE"
        onConfirm={() => setShowDeactivateModal(false)}
      />

      <ConfirmationModal
        isOpen={showDeleteModal}
        onClose={() => setShowDeleteModal(false)}
        action="delete"
        title="Delete Account Forever?"
        description="This will permanently erase all your data"
        confirmText="DELETE MY ACCOUNT"
        onConfirm={() => setShowDeleteModal(false)}
      />
    </div>
  );
}
