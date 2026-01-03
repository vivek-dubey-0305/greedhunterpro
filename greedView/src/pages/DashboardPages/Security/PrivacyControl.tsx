import { useState } from 'react';
import { motion } from 'framer-motion';
import { 
  Eye, 
  EyeOff, 
  Users, 
  Globe, 
  Lock,
  User,
  Trophy,
  Activity,
  Calendar,
  Coins,
  MessageSquare,
  MapPin,
  ChevronRight,
  Info,
  Shield
} from 'lucide-react';

// Privacy Setting interface
interface PrivacySetting {
  id: string;
  title: string;
  description: string;
  icon: React.ElementType;
  value: 'everyone' | 'followers' | 'nobody';
  options: { value: string; label: string; icon: React.ElementType }[];
}

// Toggle Switch Component
function ToggleSwitch({ enabled, onChange }: { enabled: boolean; onChange: () => void }) {
  return (
    <motion.button
      onClick={onChange}
      className={`relative w-14 h-8 rounded-full transition-colors ${
        enabled ? 'bg-[#00ff88]' : 'bg-[#1a1a2e]'
      }`}
      whileTap={{ scale: 0.95 }}
    >
      <motion.div
        className="absolute top-1 w-6 h-6 rounded-full bg-white shadow-lg"
        animate={{ left: enabled ? '1.75rem' : '0.25rem' }}
        transition={{ type: 'spring', stiffness: 500, damping: 30 }}
      />
    </motion.button>
  );
}

// Privacy Option Selector
function PrivacySelector({ setting, onChange }: { 
  setting: PrivacySetting; 
  onChange: (value: PrivacySetting['value']) => void;
}) {
  const Icon = setting.icon;

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="bg-[#141420]/80 backdrop-blur-xl border border-white/10 rounded-2xl p-5"
    >
      <div className="flex items-start gap-4 mb-4">
        <div className="w-12 h-12 rounded-xl bg-[#00d9ff]/20 flex items-center justify-center flex-shrink-0">
          <Icon className="w-6 h-6 text-[#00d9ff]" />
        </div>
        <div className="flex-1">
          <h3 className="font-bold text-white mb-1">{setting.title}</h3>
          <p className="text-gray-400 text-sm">{setting.description}</p>
        </div>
      </div>

      <div className="grid grid-cols-3 gap-2">
        {setting.options.map((option) => {
          const OptionIcon = option.icon;
          const isActive = setting.value === option.value;

          return (
            <motion.button
              key={option.value}
              onClick={() => onChange(option.value as PrivacySetting['value'])}
              className={`p-3 rounded-xl flex flex-col items-center gap-2 transition-all ${
                isActive
                  ? 'bg-[#00ff88]/20 border border-[#00ff88]/50 text-[#00ff88]'
                  : 'bg-[#1a1a2e] border border-transparent text-gray-400 hover:text-white hover:border-white/10'
              }`}
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
            >
              <OptionIcon className="w-5 h-5" />
              <span className="text-xs font-medium">{option.label}</span>
            </motion.button>
          );
        })}
      </div>
    </motion.div>
  );
}

// Quick Toggle Component
function QuickToggle({ icon: Icon, label, description, enabled, onChange }: {
  icon: React.ElementType;
  label: string;
  description: string;
  enabled: boolean;
  onChange: () => void;
}) {
  return (
    <motion.div
      whileHover={{ x: 4 }}
      className="flex items-center justify-between p-4 bg-[#1a1a2e] rounded-xl hover:bg-[#1a1a2e]/80 transition-colors"
    >
      <div className="flex items-center gap-4">
        <div className={`w-10 h-10 rounded-lg flex items-center justify-center ${
          enabled ? 'bg-[#00ff88]/20' : 'bg-gray-500/20'
        }`}>
          <Icon className={`w-5 h-5 ${enabled ? 'text-[#00ff88]' : 'text-gray-500'}`} />
        </div>
        <div>
          <p className="font-medium text-white">{label}</p>
          <p className="text-gray-500 text-sm">{description}</p>
        </div>
      </div>
      <ToggleSwitch enabled={enabled} onChange={onChange} />
    </motion.div>
  );
}

// Main Component
export function PrivacyControl() {
  const [settings, setSettings] = useState<Record<string, PrivacySetting['value']>>({
    profile: 'everyone',
    stats: 'followers',
    activity: 'followers',
    events: 'everyone',
  });

  const [toggles, setToggles] = useState({
    showOnlineStatus: true,
    showLocation: false,
    allowMessages: true,
    showWallet: false,
  });

  const privacySettings: PrivacySetting[] = [
    {
      id: 'profile',
      title: 'Profile Visibility',
      description: 'Control who can see your profile information',
      icon: User,
      value: settings.profile,
      options: [
        { value: 'everyone', label: 'Everyone', icon: Globe },
        { value: 'followers', label: 'Followers', icon: Users },
        { value: 'nobody', label: 'Only Me', icon: Lock },
      ],
    },
    {
      id: 'stats',
      title: 'Stats & Achievements',
      description: 'Who can see your stats and achievements',
      icon: Trophy,
      value: settings.stats,
      options: [
        { value: 'everyone', label: 'Everyone', icon: Globe },
        { value: 'followers', label: 'Followers', icon: Users },
        { value: 'nobody', label: 'Only Me', icon: Lock },
      ],
    },
    {
      id: 'activity',
      title: 'Activity Feed',
      description: 'Control visibility of your recent activities',
      icon: Activity,
      value: settings.activity,
      options: [
        { value: 'everyone', label: 'Everyone', icon: Globe },
        { value: 'followers', label: 'Followers', icon: Users },
        { value: 'nobody', label: 'Only Me', icon: Lock },
      ],
    },
    {
      id: 'events',
      title: 'Event Participation',
      description: 'Who can see events you\'re participating in',
      icon: Calendar,
      value: settings.events,
      options: [
        { value: 'everyone', label: 'Everyone', icon: Globe },
        { value: 'followers', label: 'Followers', icon: Users },
        { value: 'nobody', label: 'Only Me', icon: Lock },
      ],
    },
  ];

  const handleSettingChange = (id: string, value: PrivacySetting['value']) => {
    setSettings(prev => ({ ...prev, [id]: value }));
  };

  const handleToggle = (key: keyof typeof toggles) => {
    setToggles(prev => ({ ...prev, [key]: !prev[key] }));
  };

  return (
    <div className="space-y-8">
      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
      >
        <h1 className="text-3xl font-black text-white mb-2 flex items-center gap-3">
          <Eye className="w-8 h-8 text-[#00d9ff]" />
          Privacy Controls
        </h1>
        <p className="text-gray-400">Manage what others can see about you</p>
      </motion.div>

      {/* Privacy Score */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1 }}
        className="bg-[#141420]/80 backdrop-blur-xl border border-white/10 rounded-2xl p-6"
      >
        <div className="flex items-center gap-6">
          <motion.div
            className="relative"
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ type: 'spring', delay: 0.2 }}
          >
            <svg className="w-24 h-24 -rotate-90">
              <circle cx="48" cy="48" r="42" fill="none" stroke="#1a1a2e" strokeWidth="8" />
              <motion.circle
                cx="48"
                cy="48"
                r="42"
                fill="none"
                stroke="#00d9ff"
                strokeWidth="8"
                strokeLinecap="round"
                strokeDasharray={264}
                initial={{ strokeDashoffset: 264 }}
                animate={{ strokeDashoffset: 264 * 0.35 }}
                transition={{ duration: 1, delay: 0.3 }}
              />
            </svg>
            <div className="absolute inset-0 flex items-center justify-center">
              <span className="text-2xl font-black text-white">65%</span>
            </div>
          </motion.div>
          
          <div className="flex-1">
            <h3 className="text-lg font-bold text-white mb-1">Privacy Level: Balanced</h3>
            <p className="text-gray-400 text-sm mb-3">Your profile is partially visible to the community</p>
            <div className="flex items-center gap-2">
              <Info className="w-4 h-4 text-[#00d9ff]" />
              <span className="text-[#00d9ff] text-sm">Increase privacy for more protection</span>
            </div>
          </div>
        </div>
      </motion.div>

      {/* Visibility Settings */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.2 }}
        className="space-y-4"
      >
        <h3 className="text-lg font-bold text-white">Visibility Settings</h3>
        {privacySettings.map((setting, i) => (
          <motion.div
            key={setting.id}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 * i }}
          >
            <PrivacySelector
              setting={setting}
              onChange={(value) => handleSettingChange(setting.id, value)}
            />
          </motion.div>
        ))}
      </motion.div>

      {/* Quick Toggles */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.4 }}
        className="bg-[#141420]/80 backdrop-blur-xl border border-white/10 rounded-2xl overflow-hidden"
      >
        <div className="p-5 border-b border-white/10">
          <h3 className="text-lg font-bold text-white">Quick Toggles</h3>
        </div>
        <div className="p-5 space-y-3">
          <QuickToggle
            icon={Globe}
            label="Show Online Status"
            description="Let others see when you're online"
            enabled={toggles.showOnlineStatus}
            onChange={() => handleToggle('showOnlineStatus')}
          />
          <QuickToggle
            icon={MapPin}
            label="Show Location"
            description="Display your location on your profile"
            enabled={toggles.showLocation}
            onChange={() => handleToggle('showLocation')}
          />
          <QuickToggle
            icon={MessageSquare}
            label="Allow Messages"
            description="Let others send you direct messages"
            enabled={toggles.allowMessages}
            onChange={() => handleToggle('allowMessages')}
          />
          <QuickToggle
            icon={Coins}
            label="Show Wallet Balance"
            description="Display your coin balance publicly"
            enabled={toggles.showWallet}
            onChange={() => handleToggle('showWallet')}
          />
        </div>
      </motion.div>

      {/* Data Privacy Notice */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.5 }}
        className="bg-[#1a1a2e] border border-white/10 rounded-2xl p-5"
      >
        <div className="flex items-start gap-4">
          <div className="w-10 h-10 rounded-lg bg-[#8b5cf6]/20 flex items-center justify-center flex-shrink-0">
            <Shield className="w-5 h-5 text-[#8b5cf6]" />
          </div>
          <div>
            <h4 className="font-bold text-white mb-1">Your Data is Protected</h4>
            <p className="text-gray-400 text-sm">
              We use industry-standard encryption to protect your data. Your privacy settings are respected across all GreedHunter services.
            </p>
          </div>
        </div>
      </motion.div>
    </div>
  );
}
