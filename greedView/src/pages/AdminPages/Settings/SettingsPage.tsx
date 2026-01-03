import { useState } from 'react';
import { motion } from 'framer-motion';
import {
  Settings,
  Save,
  Shield,
  Bell,
  Palette,
  Globe,
  Database,
  Mail,
  Key,
  Lock,
  Smartphone,
  Clock,
  DollarSign,
  Coins,
  AlertTriangle,
  CheckCircle,
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Switch } from '@/components/ui/switch';
import { Textarea } from '@/components/ui/textarea';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { PageHeader } from '../components';

interface SettingsSection {
  id: string;
  title: string;
  icon: React.ElementType;
  color: string;
}

const sections: SettingsSection[] = [
  { id: 'general', title: 'General', icon: Settings, color: '#8b5cf6' },
  { id: 'security', title: 'Security', icon: Shield, color: '#00ff88' },
  { id: 'notifications', title: 'Notifications', icon: Bell, color: '#ffd700' },
  { id: 'appearance', title: 'Appearance', icon: Palette, color: '#00d9ff' },
  { id: 'rewards', title: 'Rewards & Economy', icon: Coins, color: '#ff6b6b' },
  { id: 'maintenance', title: 'Maintenance', icon: Database, color: '#f97316' },
];

export function SettingsPage() {
  const [activeSection, setActiveSection] = useState('general');
  const [isSaving, setIsSaving] = useState(false);
  const [showSaved, setShowSaved] = useState(false);

  // General Settings
  const [generalSettings, setGeneralSettings] = useState({
    siteName: 'GreedHunter',
    siteDescription: 'The ultimate platform for developers to learn, compete, and earn.',
    supportEmail: 'support@greedhunter.com',
    timezone: 'UTC',
    language: 'en',
    maintenanceMode: false,
  });

  // Security Settings
  const [securitySettings, setSecuritySettings] = useState({
    twoFactorRequired: false,
    sessionTimeout: 60,
    maxLoginAttempts: 5,
    passwordMinLength: 8,
    requireSpecialChars: true,
    allowSocialLogin: true,
    ipWhitelist: '',
  });

  // Notification Settings
  const [notificationSettings, setNotificationSettings] = useState({
    emailNotifications: true,
    pushNotifications: true,
    smsNotifications: false,
    marketingEmails: true,
    weeklyDigest: true,
    instantAlerts: true,
  });

  // Appearance Settings
  const [appearanceSettings, setAppearanceSettings] = useState({
    primaryColor: '#00ff88',
    secondaryColor: '#8b5cf6',
    darkModeDefault: true,
    customCss: '',
    logoUrl: '',
    faviconUrl: '',
  });

  // Rewards Settings
  const [rewardsSettings, setRewardsSettings] = useState({
    dailyLoginReward: 10,
    challengeBaseReward: 100,
    referralReward: 500,
    streakMultiplier: 1.5,
    maxDailyEarnings: 5000,
    coinsToCashRate: 100,
  });

  const handleSave = async () => {
    setIsSaving(true);
    // Simulate API call
    await new Promise((resolve) => setTimeout(resolve, 1000));
    setIsSaving(false);
    setShowSaved(true);
    setTimeout(() => setShowSaved(false), 3000);
  };

  const renderSection = () => {
    switch (activeSection) {
      case 'general':
        return (
          <div className="space-y-6">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="text-sm text-gray-400 mb-2 block">Site Name</label>
                <Input
                  value={generalSettings.siteName}
                  onChange={(e) => setGeneralSettings({ ...generalSettings, siteName: e.target.value })}
                  className="bg-[#1a1a2e] border-[#2a2a3e] text-white"
                />
              </div>
              <div>
                <label className="text-sm text-gray-400 mb-2 block">Support Email</label>
                <Input
                  value={generalSettings.supportEmail}
                  onChange={(e) => setGeneralSettings({ ...generalSettings, supportEmail: e.target.value })}
                  className="bg-[#1a1a2e] border-[#2a2a3e] text-white"
                />
              </div>
            </div>
            <div>
              <label className="text-sm text-gray-400 mb-2 block">Site Description</label>
              <Textarea
                value={generalSettings.siteDescription}
                onChange={(e) => setGeneralSettings({ ...generalSettings, siteDescription: e.target.value })}
                className="bg-[#1a1a2e] border-[#2a2a3e] text-white"
              />
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="text-sm text-gray-400 mb-2 block">Timezone</label>
                <Select
                  value={generalSettings.timezone}
                  onValueChange={(value) => setGeneralSettings({ ...generalSettings, timezone: value })}
                >
                  <SelectTrigger className="bg-[#1a1a2e] border-[#2a2a3e] text-white">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent className="bg-[#1a1a2e] border-[#2a2a3e]">
                    <SelectItem value="UTC" className="text-white">UTC</SelectItem>
                    <SelectItem value="EST" className="text-white">EST</SelectItem>
                    <SelectItem value="PST" className="text-white">PST</SelectItem>
                    <SelectItem value="GMT" className="text-white">GMT</SelectItem>
                    <SelectItem value="IST" className="text-white">IST</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div>
                <label className="text-sm text-gray-400 mb-2 block">Default Language</label>
                <Select
                  value={generalSettings.language}
                  onValueChange={(value) => setGeneralSettings({ ...generalSettings, language: value })}
                >
                  <SelectTrigger className="bg-[#1a1a2e] border-[#2a2a3e] text-white">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent className="bg-[#1a1a2e] border-[#2a2a3e]">
                    <SelectItem value="en" className="text-white">English</SelectItem>
                    <SelectItem value="es" className="text-white">Spanish</SelectItem>
                    <SelectItem value="fr" className="text-white">French</SelectItem>
                    <SelectItem value="de" className="text-white">German</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
            <div className="flex items-center justify-between p-4 bg-[#1a1a2e] rounded-lg border border-[#2a2a3e]">
              <div>
                <p className="text-white font-medium">Maintenance Mode</p>
                <p className="text-gray-500 text-sm">Temporarily disable access for users</p>
              </div>
              <Switch
                checked={generalSettings.maintenanceMode}
                onCheckedChange={(checked) => setGeneralSettings({ ...generalSettings, maintenanceMode: checked })}
                className="data-[state=checked]:bg-yellow-500"
              />
            </div>
          </div>
        );

      case 'security':
        return (
          <div className="space-y-6">
            <div className="flex items-center justify-between p-4 bg-[#1a1a2e] rounded-lg border border-[#2a2a3e]">
              <div>
                <p className="text-white font-medium">Require Two-Factor Authentication</p>
                <p className="text-gray-500 text-sm">All users must enable 2FA</p>
              </div>
              <Switch
                checked={securitySettings.twoFactorRequired}
                onCheckedChange={(checked) => setSecuritySettings({ ...securitySettings, twoFactorRequired: checked })}
                className="data-[state=checked]:bg-[#00ff88]"
              />
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="text-sm text-gray-400 mb-2 block">Session Timeout (minutes)</label>
                <Input
                  type="number"
                  value={securitySettings.sessionTimeout}
                  onChange={(e) => setSecuritySettings({ ...securitySettings, sessionTimeout: parseInt(e.target.value) })}
                  className="bg-[#1a1a2e] border-[#2a2a3e] text-white"
                />
              </div>
              <div>
                <label className="text-sm text-gray-400 mb-2 block">Max Login Attempts</label>
                <Input
                  type="number"
                  value={securitySettings.maxLoginAttempts}
                  onChange={(e) => setSecuritySettings({ ...securitySettings, maxLoginAttempts: parseInt(e.target.value) })}
                  className="bg-[#1a1a2e] border-[#2a2a3e] text-white"
                />
              </div>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="text-sm text-gray-400 mb-2 block">Minimum Password Length</label>
                <Input
                  type="number"
                  value={securitySettings.passwordMinLength}
                  onChange={(e) => setSecuritySettings({ ...securitySettings, passwordMinLength: parseInt(e.target.value) })}
                  className="bg-[#1a1a2e] border-[#2a2a3e] text-white"
                />
              </div>
              <div className="flex items-center justify-between p-4 bg-[#1a1a2e] rounded-lg border border-[#2a2a3e]">
                <div>
                  <p className="text-white font-medium text-sm">Require Special Characters</p>
                </div>
                <Switch
                  checked={securitySettings.requireSpecialChars}
                  onCheckedChange={(checked) => setSecuritySettings({ ...securitySettings, requireSpecialChars: checked })}
                  className="data-[state=checked]:bg-[#00ff88]"
                />
              </div>
            </div>
            <div className="flex items-center justify-between p-4 bg-[#1a1a2e] rounded-lg border border-[#2a2a3e]">
              <div>
                <p className="text-white font-medium">Allow Social Login</p>
                <p className="text-gray-500 text-sm">Google, GitHub, etc.</p>
              </div>
              <Switch
                checked={securitySettings.allowSocialLogin}
                onCheckedChange={(checked) => setSecuritySettings({ ...securitySettings, allowSocialLogin: checked })}
                className="data-[state=checked]:bg-[#00ff88]"
              />
            </div>
            <div>
              <label className="text-sm text-gray-400 mb-2 block">IP Whitelist (comma separated)</label>
              <Textarea
                value={securitySettings.ipWhitelist}
                onChange={(e) => setSecuritySettings({ ...securitySettings, ipWhitelist: e.target.value })}
                placeholder="192.168.1.1, 10.0.0.1"
                className="bg-[#1a1a2e] border-[#2a2a3e] text-white"
              />
            </div>
          </div>
        );

      case 'notifications':
        return (
          <div className="space-y-4">
            {[
              { key: 'emailNotifications', label: 'Email Notifications', desc: 'Send email notifications to users' },
              { key: 'pushNotifications', label: 'Push Notifications', desc: 'Browser push notifications' },
              { key: 'smsNotifications', label: 'SMS Notifications', desc: 'Send SMS for critical alerts' },
              { key: 'marketingEmails', label: 'Marketing Emails', desc: 'Allow promotional emails' },
              { key: 'weeklyDigest', label: 'Weekly Digest', desc: 'Send weekly activity summary' },
              { key: 'instantAlerts', label: 'Instant Alerts', desc: 'Real-time notifications for important events' },
            ].map((item) => (
              <div key={item.key} className="flex items-center justify-between p-4 bg-[#1a1a2e] rounded-lg border border-[#2a2a3e]">
                <div>
                  <p className="text-white font-medium">{item.label}</p>
                  <p className="text-gray-500 text-sm">{item.desc}</p>
                </div>
                <Switch
                  checked={notificationSettings[item.key as keyof typeof notificationSettings]}
                  onCheckedChange={(checked) => setNotificationSettings({ ...notificationSettings, [item.key]: checked })}
                  className="data-[state=checked]:bg-[#00ff88]"
                />
              </div>
            ))}
          </div>
        );

      case 'appearance':
        return (
          <div className="space-y-6">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="text-sm text-gray-400 mb-2 block">Primary Color</label>
                <div className="flex gap-2">
                  <Input
                    type="color"
                    value={appearanceSettings.primaryColor}
                    onChange={(e) => setAppearanceSettings({ ...appearanceSettings, primaryColor: e.target.value })}
                    className="w-16 h-10 p-1 bg-[#1a1a2e] border-[#2a2a3e]"
                  />
                  <Input
                    value={appearanceSettings.primaryColor}
                    onChange={(e) => setAppearanceSettings({ ...appearanceSettings, primaryColor: e.target.value })}
                    className="bg-[#1a1a2e] border-[#2a2a3e] text-white flex-1"
                  />
                </div>
              </div>
              <div>
                <label className="text-sm text-gray-400 mb-2 block">Secondary Color</label>
                <div className="flex gap-2">
                  <Input
                    type="color"
                    value={appearanceSettings.secondaryColor}
                    onChange={(e) => setAppearanceSettings({ ...appearanceSettings, secondaryColor: e.target.value })}
                    className="w-16 h-10 p-1 bg-[#1a1a2e] border-[#2a2a3e]"
                  />
                  <Input
                    value={appearanceSettings.secondaryColor}
                    onChange={(e) => setAppearanceSettings({ ...appearanceSettings, secondaryColor: e.target.value })}
                    className="bg-[#1a1a2e] border-[#2a2a3e] text-white flex-1"
                  />
                </div>
              </div>
            </div>
            <div className="flex items-center justify-between p-4 bg-[#1a1a2e] rounded-lg border border-[#2a2a3e]">
              <div>
                <p className="text-white font-medium">Dark Mode Default</p>
                <p className="text-gray-500 text-sm">Use dark mode as the default theme</p>
              </div>
              <Switch
                checked={appearanceSettings.darkModeDefault}
                onCheckedChange={(checked) => setAppearanceSettings({ ...appearanceSettings, darkModeDefault: checked })}
                className="data-[state=checked]:bg-[#00ff88]"
              />
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="text-sm text-gray-400 mb-2 block">Logo URL</label>
                <Input
                  value={appearanceSettings.logoUrl}
                  onChange={(e) => setAppearanceSettings({ ...appearanceSettings, logoUrl: e.target.value })}
                  placeholder="https://example.com/logo.png"
                  className="bg-[#1a1a2e] border-[#2a2a3e] text-white"
                />
              </div>
              <div>
                <label className="text-sm text-gray-400 mb-2 block">Favicon URL</label>
                <Input
                  value={appearanceSettings.faviconUrl}
                  onChange={(e) => setAppearanceSettings({ ...appearanceSettings, faviconUrl: e.target.value })}
                  placeholder="https://example.com/favicon.ico"
                  className="bg-[#1a1a2e] border-[#2a2a3e] text-white"
                />
              </div>
            </div>
            <div>
              <label className="text-sm text-gray-400 mb-2 block">Custom CSS</label>
              <Textarea
                value={appearanceSettings.customCss}
                onChange={(e) => setAppearanceSettings({ ...appearanceSettings, customCss: e.target.value })}
                placeholder="/* Add custom CSS here */"
                className="bg-[#1a1a2e] border-[#2a2a3e] text-white font-mono min-h-[150px]"
              />
            </div>
          </div>
        );

      case 'rewards':
        return (
          <div className="space-y-6">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="text-sm text-gray-400 mb-2 block">Daily Login Reward</label>
                <div className="relative">
                  <Coins className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-[#ffd700]" />
                  <Input
                    type="number"
                    value={rewardsSettings.dailyLoginReward}
                    onChange={(e) => setRewardsSettings({ ...rewardsSettings, dailyLoginReward: parseInt(e.target.value) })}
                    className="bg-[#1a1a2e] border-[#2a2a3e] text-white pl-10"
                  />
                </div>
              </div>
              <div>
                <label className="text-sm text-gray-400 mb-2 block">Challenge Base Reward</label>
                <div className="relative">
                  <Coins className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-[#ffd700]" />
                  <Input
                    type="number"
                    value={rewardsSettings.challengeBaseReward}
                    onChange={(e) => setRewardsSettings({ ...rewardsSettings, challengeBaseReward: parseInt(e.target.value) })}
                    className="bg-[#1a1a2e] border-[#2a2a3e] text-white pl-10"
                  />
                </div>
              </div>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="text-sm text-gray-400 mb-2 block">Referral Reward</label>
                <div className="relative">
                  <Coins className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-[#ffd700]" />
                  <Input
                    type="number"
                    value={rewardsSettings.referralReward}
                    onChange={(e) => setRewardsSettings({ ...rewardsSettings, referralReward: parseInt(e.target.value) })}
                    className="bg-[#1a1a2e] border-[#2a2a3e] text-white pl-10"
                  />
                </div>
              </div>
              <div>
                <label className="text-sm text-gray-400 mb-2 block">Streak Multiplier</label>
                <Input
                  type="number"
                  step="0.1"
                  value={rewardsSettings.streakMultiplier}
                  onChange={(e) => setRewardsSettings({ ...rewardsSettings, streakMultiplier: parseFloat(e.target.value) })}
                  className="bg-[#1a1a2e] border-[#2a2a3e] text-white"
                />
              </div>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="text-sm text-gray-400 mb-2 block">Max Daily Earnings</label>
                <div className="relative">
                  <Coins className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-[#ffd700]" />
                  <Input
                    type="number"
                    value={rewardsSettings.maxDailyEarnings}
                    onChange={(e) => setRewardsSettings({ ...rewardsSettings, maxDailyEarnings: parseInt(e.target.value) })}
                    className="bg-[#1a1a2e] border-[#2a2a3e] text-white pl-10"
                  />
                </div>
              </div>
              <div>
                <label className="text-sm text-gray-400 mb-2 block">Coins to Cash Rate</label>
                <div className="flex items-center gap-2">
                  <Input
                    type="number"
                    value={rewardsSettings.coinsToCashRate}
                    onChange={(e) => setRewardsSettings({ ...rewardsSettings, coinsToCashRate: parseInt(e.target.value) })}
                    className="bg-[#1a1a2e] border-[#2a2a3e] text-white"
                  />
                  <span className="text-gray-400 text-sm whitespace-nowrap">coins = $1</span>
                </div>
              </div>
            </div>
          </div>
        );

      case 'maintenance':
        return (
          <div className="space-y-6">
            <div className="bg-yellow-500/10 border border-yellow-500/30 rounded-lg p-4 flex items-start gap-3">
              <AlertTriangle className="w-5 h-5 text-yellow-400 mt-0.5" />
              <div>
                <p className="text-yellow-400 font-medium">Caution</p>
                <p className="text-yellow-400/80 text-sm">These actions can affect the entire platform. Use with care.</p>
              </div>
            </div>

            <div className="space-y-4">
              <div className="p-4 bg-[#1a1a2e] rounded-lg border border-[#2a2a3e]">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-white font-medium">Clear Cache</p>
                    <p className="text-gray-500 text-sm">Clear all cached data from the platform</p>
                  </div>
                  <Button variant="outline" className="border-[#2a2a3e] text-gray-400 hover:text-white hover:bg-white/10">
                    Clear Cache
                  </Button>
                </div>
              </div>

              <div className="p-4 bg-[#1a1a2e] rounded-lg border border-[#2a2a3e]">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-white font-medium">Rebuild Search Index</p>
                    <p className="text-gray-500 text-sm">Rebuild search indexes for better performance</p>
                  </div>
                  <Button variant="outline" className="border-[#2a2a3e] text-gray-400 hover:text-white hover:bg-white/10">
                    Rebuild
                  </Button>
                </div>
              </div>

              <div className="p-4 bg-[#1a1a2e] rounded-lg border border-[#2a2a3e]">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-white font-medium">Export Database</p>
                    <p className="text-gray-500 text-sm">Download a full backup of the database</p>
                  </div>
                  <Button variant="outline" className="border-[#2a2a3e] text-gray-400 hover:text-white hover:bg-white/10">
                    Export
                  </Button>
                </div>
              </div>

              <div className="p-4 bg-[#1a1a2e] rounded-lg border border-red-500/30">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-red-400 font-medium">Reset All Data</p>
                    <p className="text-gray-500 text-sm">Permanently delete all data. This cannot be undone!</p>
                  </div>
                  <Button variant="outline" className="border-red-500/30 text-red-400 hover:bg-red-500/10">
                    Reset
                  </Button>
                </div>
              </div>
            </div>
          </div>
        );

      default:
        return null;
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <PageHeader
          title="Settings"
          description="Configure platform settings and preferences"
          icon={Settings}
        />
        <div className="flex items-center gap-3">
          {showSaved && (
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: 20 }}
              className="flex items-center gap-2 text-[#00ff88]"
            >
              <CheckCircle className="w-4 h-4" />
              <span className="text-sm">Settings saved!</span>
            </motion.div>
          )}
          <Button
            onClick={handleSave}
            disabled={isSaving}
            className="bg-[#00ff88] hover:bg-[#00ff88]/80 text-black"
          >
            <Save className="w-4 h-4 mr-2" />
            {isSaving ? 'Saving...' : 'Save Changes'}
          </Button>
        </div>
      </div>

      <div className="grid grid-cols-12 gap-6">
        {/* Sidebar */}
        <div className="col-span-3">
          <div className="bg-[#141420] border border-[#2a2a3e] rounded-xl p-2">
            {sections.map((section) => (
              <button
                key={section.id}
                onClick={() => setActiveSection(section.id)}
                className={`w-full flex items-center gap-3 p-3 rounded-lg transition-colors ${
                  activeSection === section.id
                    ? 'bg-white/10 text-white'
                    : 'text-gray-400 hover:text-white hover:bg-white/5'
                }`}
              >
                <section.icon className="w-5 h-5" style={{ color: activeSection === section.id ? section.color : undefined }} />
                <span className="font-medium">{section.title}</span>
              </button>
            ))}
          </div>
        </div>

        {/* Content */}
        <div className="col-span-9">
          <motion.div
            key={activeSection}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-[#141420] border border-[#2a2a3e] rounded-xl p-6"
          >
            <h2 className="text-xl font-bold text-white mb-6 flex items-center gap-2">
              {sections.find((s) => s.id === activeSection)?.icon && (
                <span style={{ color: sections.find((s) => s.id === activeSection)?.color }}>
                  {(() => {
                    const Icon = sections.find((s) => s.id === activeSection)?.icon;
                    return Icon ? <Icon className="w-5 h-5" /> : null;
                  })()}
                </span>
              )}
              {sections.find((s) => s.id === activeSection)?.title} Settings
            </h2>
            {renderSection()}
          </motion.div>
        </div>
      </div>
    </div>
  );
}
