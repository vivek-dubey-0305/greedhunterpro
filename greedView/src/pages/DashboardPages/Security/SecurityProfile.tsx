import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Shield, 
  Mail, 
  Phone, 
  Smartphone, 
  Laptop, 
  MapPin,
  Clock,
  Key,
  Eye,
  EyeOff,
  CheckCircle,
  AlertCircle,
  ChevronRight,
  X,
  Lock,
  Unlock,
  Globe
} from 'lucide-react';

// Device interface
interface Device {
  id: string;
  name: string;
  type: 'mobile' | 'desktop' | 'tablet';
  browser: string;
  location: string;
  ip: string;
  lastActive: string;
  isCurrent: boolean;
}

// Security Item Component
function SecurityItem({ icon: Icon, label, value, status, verified, onAction, actionLabel }: {
  icon: React.ElementType;
  label: string;
  value: string;
  status?: 'secure' | 'warning' | 'danger';
  verified?: boolean;
  onAction?: () => void;
  actionLabel?: string;
}) {
  const statusColors = {
    secure: '#00ff88',
    warning: '#ffd700',
    danger: '#ff6b6b',
  };

  return (
    <motion.div
      whileHover={{ x: 4 }}
      className="flex items-center justify-between p-4 bg-[#1a1a2e] rounded-xl hover:bg-[#1a1a2e]/80 transition-colors"
    >
      <div className="flex items-center gap-4">
        <div className="w-12 h-12 rounded-xl bg-[#141420] flex items-center justify-center">
          <Icon className="w-6 h-6 text-[#00d9ff]" />
        </div>
        <div>
          <p className="text-gray-400 text-sm">{label}</p>
          <div className="flex items-center gap-2">
            <p className="text-white font-medium">{value}</p>
            {verified !== undefined && (
              <span className={`flex items-center gap-1 text-xs px-2 py-0.5 rounded-full ${
                verified ? 'bg-[#00ff88]/20 text-[#00ff88]' : 'bg-[#ffd700]/20 text-[#ffd700]'
              }`}>
                {verified ? <CheckCircle className="w-3 h-3" /> : <AlertCircle className="w-3 h-3" />}
                {verified ? 'Verified' : 'Unverified'}
              </span>
            )}
          </div>
        </div>
      </div>
      
      <div className="flex items-center gap-3">
        {status && (
          <div
            className="w-3 h-3 rounded-full"
            style={{ backgroundColor: statusColors[status] }}
          />
        )}
        {onAction && (
          <motion.button
            onClick={onAction}
            className="px-4 py-2 text-sm font-medium text-[#00d9ff] hover:text-white hover:bg-[#00d9ff]/20 rounded-lg transition-colors"
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
          >
            {actionLabel}
          </motion.button>
        )}
      </div>
    </motion.div>
  );
}

// Device Card Component
function DeviceCard({ device, onRemove }: { device: Device; onRemove: () => void }) {
  const icons = {
    mobile: Smartphone,
    desktop: Laptop,
    tablet: Smartphone,
  };
  const Icon = icons[device.type];

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className={`relative p-4 rounded-xl border transition-all ${
        device.isCurrent
          ? 'bg-[#00ff88]/10 border-[#00ff88]/30'
          : 'bg-[#1a1a2e] border-white/10 hover:border-white/20'
      }`}
    >
      {device.isCurrent && (
        <span className="absolute top-3 right-3 px-2 py-1 bg-[#00ff88] text-black text-xs font-bold rounded-lg">
          Current
        </span>
      )}
      
      <div className="flex items-start gap-4">
        <div className={`w-12 h-12 rounded-xl flex items-center justify-center ${
          device.isCurrent ? 'bg-[#00ff88]/20' : 'bg-[#141420]'
        }`}>
          <Icon className={`w-6 h-6 ${device.isCurrent ? 'text-[#00ff88]' : 'text-gray-400'}`} />
        </div>
        
        <div className="flex-1">
          <h4 className="font-semibold text-white mb-1">{device.name}</h4>
          <p className="text-gray-400 text-sm mb-2">{device.browser}</p>
          
          <div className="flex flex-wrap gap-3 text-xs text-gray-500">
            <span className="flex items-center gap-1">
              <MapPin className="w-3 h-3" />
              {device.location}
            </span>
            <span className="flex items-center gap-1">
              <Globe className="w-3 h-3" />
              {device.ip}
            </span>
            <span className="flex items-center gap-1">
              <Clock className="w-3 h-3" />
              {device.lastActive}
            </span>
          </div>
        </div>
        
        {!device.isCurrent && (
          <motion.button
            onClick={onRemove}
            className="p-2 text-gray-500 hover:text-red-400 hover:bg-red-400/10 rounded-lg transition-colors"
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.95 }}
          >
            <X className="w-5 h-5" />
          </motion.button>
        )}
      </div>
    </motion.div>
  );
}

// Password Change Modal
function PasswordModal({ isOpen, onClose }: { isOpen: boolean; onClose: () => void }) {
  const [showCurrent, setShowCurrent] = useState(false);
  const [showNew, setShowNew] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);

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
          className="w-full max-w-md bg-[#141420] border border-white/10 rounded-2xl p-6"
          onClick={(e) => e.stopPropagation()}
        >
          <div className="flex items-center justify-between mb-6">
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 rounded-xl bg-[#00ff88]/20 flex items-center justify-center">
                <Key className="w-6 h-6 text-[#00ff88]" />
              </div>
              <div>
                <h3 className="text-xl font-bold text-white">Change Password</h3>
                <p className="text-gray-400 text-sm">Keep your account secure</p>
              </div>
            </div>
            <motion.button
              onClick={onClose}
              className="p-2 hover:bg-white/10 rounded-lg transition-colors"
              whileHover={{ scale: 1.1, rotate: 90 }}
            >
              <X className="w-5 h-5 text-gray-400" />
            </motion.button>
          </div>
          
          <div className="space-y-4">
            <div className="relative">
              <label className="block text-sm font-medium text-gray-400 mb-2">Current Password</label>
              <div className="relative">
                <input
                  type={showCurrent ? 'text' : 'password'}
                  placeholder="Enter current password"
                  className="w-full px-4 py-3 bg-[#1a1a2e] border border-white/10 rounded-xl text-white placeholder-gray-500 focus:border-[#00ff88]/50 focus:outline-none pr-12"
                />
                <button
                  type="button"
                  onClick={() => setShowCurrent(!showCurrent)}
                  className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-500 hover:text-white"
                >
                  {showCurrent ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                </button>
              </div>
            </div>
            
            <div className="relative">
              <label className="block text-sm font-medium text-gray-400 mb-2">New Password</label>
              <div className="relative">
                <input
                  type={showNew ? 'text' : 'password'}
                  placeholder="Enter new password"
                  className="w-full px-4 py-3 bg-[#1a1a2e] border border-white/10 rounded-xl text-white placeholder-gray-500 focus:border-[#00ff88]/50 focus:outline-none pr-12"
                />
                <button
                  type="button"
                  onClick={() => setShowNew(!showNew)}
                  className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-500 hover:text-white"
                >
                  {showNew ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                </button>
              </div>
            </div>
            
            <div className="relative">
              <label className="block text-sm font-medium text-gray-400 mb-2">Confirm New Password</label>
              <div className="relative">
                <input
                  type={showConfirm ? 'text' : 'password'}
                  placeholder="Confirm new password"
                  className="w-full px-4 py-3 bg-[#1a1a2e] border border-white/10 rounded-xl text-white placeholder-gray-500 focus:border-[#00ff88]/50 focus:outline-none pr-12"
                />
                <button
                  type="button"
                  onClick={() => setShowConfirm(!showConfirm)}
                  className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-500 hover:text-white"
                >
                  {showConfirm ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                </button>
              </div>
            </div>
            
            {/* Password strength */}
            <div className="p-3 bg-[#1a1a2e] rounded-xl">
              <div className="flex items-center justify-between mb-2">
                <span className="text-sm text-gray-400">Password Strength</span>
                <span className="text-sm font-medium text-[#ffd700]">Medium</span>
              </div>
              <div className="h-2 bg-[#141420] rounded-full overflow-hidden">
                <motion.div
                  className="h-full bg-gradient-to-r from-[#ffd700] to-[#00ff88]"
                  initial={{ width: 0 }}
                  animate={{ width: '60%' }}
                  transition={{ duration: 0.5 }}
                />
              </div>
            </div>
          </div>
          
          <div className="flex gap-3 mt-6">
            <motion.button
              onClick={onClose}
              className="flex-1 py-3 border border-white/10 text-white font-medium rounded-xl hover:bg-white/5 transition-colors"
              whileHover={{ scale: 1.01 }}
              whileTap={{ scale: 0.99 }}
            >
              Cancel
            </motion.button>
            <motion.button
              className="flex-1 py-3 bg-[#00ff88] text-black font-bold rounded-xl"
              whileHover={{ scale: 1.01 }}
              whileTap={{ scale: 0.99 }}
            >
              Update Password
            </motion.button>
          </div>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
}

// Main Component
export function SecurityProfile() {
  const [showPasswordModal, setShowPasswordModal] = useState(false);

  const devices: Device[] = [
    { id: '1', name: 'MacBook Pro', type: 'desktop', browser: 'Chrome 120', location: 'Mumbai, India', ip: '192.168.1.xxx', lastActive: 'Now', isCurrent: true },
    { id: '2', name: 'iPhone 15 Pro', type: 'mobile', browser: 'Safari', location: 'Mumbai, India', ip: '192.168.1.xxx', lastActive: '2 hours ago', isCurrent: false },
    { id: '3', name: 'Windows PC', type: 'desktop', browser: 'Firefox 121', location: 'Delhi, India', ip: '103.xxx.xxx.xxx', lastActive: '3 days ago', isCurrent: false },
  ];

  return (
    <div className="space-y-8">
      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
      >
        <h1 className="text-3xl font-black text-white mb-2 flex items-center gap-3">
          <Shield className="w-8 h-8 text-[#00ff88]" />
          Security Profile
        </h1>
        <p className="text-gray-400">Manage your account security and login details</p>
      </motion.div>

      {/* Security Score */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1 }}
        className="bg-gradient-to-br from-[#00ff88]/20 to-[#00d9ff]/10 border border-[#00ff88]/30 rounded-2xl p-6"
      >
        <div className="flex items-center justify-between">
          <div>
            <p className="text-gray-400 mb-1">Security Score</p>
            <div className="flex items-center gap-3">
              <span className="text-4xl font-black text-[#00ff88]">85</span>
              <span className="text-gray-400">/100</span>
            </div>
            <p className="text-sm text-gray-400 mt-2">Your account is well protected</p>
          </div>
          <motion.div
            className="relative w-32 h-32"
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ type: 'spring', delay: 0.2 }}
          >
            <svg className="w-full h-full -rotate-90">
              <circle cx="64" cy="64" r="56" fill="none" stroke="#1a1a2e" strokeWidth="12" />
              <motion.circle
                cx="64"
                cy="64"
                r="56"
                fill="none"
                stroke="url(#securityGradient)"
                strokeWidth="12"
                strokeLinecap="round"
                strokeDasharray={352}
                initial={{ strokeDashoffset: 352 }}
                animate={{ strokeDashoffset: 352 * 0.15 }}
                transition={{ duration: 1, delay: 0.3 }}
              />
              <defs>
                <linearGradient id="securityGradient" x1="0%" y1="0%" x2="100%" y2="0%">
                  <stop offset="0%" stopColor="#00ff88" />
                  <stop offset="100%" stopColor="#00d9ff" />
                </linearGradient>
              </defs>
            </svg>
            <div className="absolute inset-0 flex items-center justify-center">
              <Lock className="w-10 h-10 text-[#00ff88]" />
            </div>
          </motion.div>
        </div>
      </motion.div>

      {/* Contact Info */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2 }}
        className="bg-[#141420]/80 backdrop-blur-xl border border-white/10 rounded-2xl overflow-hidden"
      >
        <div className="p-5 border-b border-white/10">
          <h3 className="text-lg font-bold text-white">Contact Information</h3>
        </div>
        <div className="p-5 space-y-3">
          <SecurityItem icon={Mail} label="Email Address" value="user@example.com" verified={true} onAction={() => {}} actionLabel="Change" />
          <SecurityItem icon={Phone} label="Phone Number" value="+91 98765 43210" verified={true} onAction={() => {}} actionLabel="Change" />
        </div>
      </motion.div>

      {/* Password & Security */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.3 }}
        className="bg-[#141420]/80 backdrop-blur-xl border border-white/10 rounded-2xl overflow-hidden"
      >
        <div className="p-5 border-b border-white/10">
          <h3 className="text-lg font-bold text-white">Password & Security</h3>
        </div>
        <div className="p-5 space-y-3">
          <SecurityItem icon={Key} label="Password" value="Last changed 30 days ago" status="secure" onAction={() => setShowPasswordModal(true)} actionLabel="Change" />
          <SecurityItem icon={Shield} label="Two-Factor Authentication" value="Enabled via Authenticator" status="secure" onAction={() => {}} actionLabel="Manage" />
        </div>
      </motion.div>

      {/* Active Devices */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.4 }}
        className="bg-[#141420]/80 backdrop-blur-xl border border-white/10 rounded-2xl overflow-hidden"
      >
        <div className="p-5 border-b border-white/10 flex items-center justify-between">
          <h3 className="text-lg font-bold text-white">Active Devices</h3>
          <motion.button
            className="text-sm text-red-400 hover:text-red-300 font-medium"
            whileHover={{ scale: 1.02 }}
          >
            Sign out all devices
          </motion.button>
        </div>
        <div className="p-5 space-y-3">
          {devices.map((device) => (
            <DeviceCard key={device.id} device={device} onRemove={() => {}} />
          ))}
        </div>
      </motion.div>

      {/* Password Modal */}
      <PasswordModal isOpen={showPasswordModal} onClose={() => setShowPasswordModal(false)} />
    </div>
  );
}
