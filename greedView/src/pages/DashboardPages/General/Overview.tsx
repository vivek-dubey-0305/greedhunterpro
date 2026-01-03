import { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence, useInView } from 'framer-motion';
import { 
  Coins, 
  Target, 
  Calendar, 
  Trophy, 
  TrendingUp,
  Clock,
  Star,
  Zap,
  ChevronRight,
  Award,
  Flame,
  Medal,
  Crown,
  Sparkles,
  Activity,
  CheckCircle2,
  Circle,
  X
} from 'lucide-react';

// Animated counter hook
function useAnimatedCounter(target: number, duration: number = 2000) {
  const [count, setCount] = useState(0);
  
  useEffect(() => {
    let start = 0;
    const increment = target / (duration / 16);
    
    const timer = setInterval(() => {
      start += increment;
      if (start >= target) {
        setCount(target);
        clearInterval(timer);
      } else {
        setCount(Math.floor(start));
      }
    }, 16);
    
    return () => clearInterval(timer);
  }, [target, duration]);
  
  return count;
}

// Dynamic greeting based on time
function getGreeting(): { text: string; emoji: string } {
  const hour = new Date().getHours();
  if (hour < 12) return { text: 'Good Morning', emoji: '☀️' };
  if (hour < 17) return { text: 'Good Afternoon', emoji: '🌤️' };
  if (hour < 21) return { text: 'Good Evening', emoji: '🌅' };
  return { text: 'Night Owl Mode', emoji: '🌙' };
}

// Animated Grid Background
function AnimatedGridBackground() {
  return (
    <div className="absolute inset-0 overflow-hidden">
      <div className="absolute inset-0 bg-gradient-to-br from-[#000/5 via-transparent to-[#8b5cf6]/5" />
      <div className="grid-background absolute inset-0 opacity-20" />
      {/* Hover glow spots */}
      {[...Array(6)].map((_, i) => (
        <motion.div
          key={i}
          className="absolute w-32 h-32 rounded-full bg-[#00ff88]/10 blur-3xl"
          style={{
            left: `${20 + (i % 3) * 30}%`,
            top: `${20 + Math.floor(i / 3) * 40}%`,
          }}
          animate={{
            scale: [1, 1.3, 1],
            opacity: [0.3, 0.6, 0.3],
          }}
          transition={{
            duration: 4 + i,
            repeat: Infinity,
            ease: 'easeInOut',
            delay: i * 0.5,
          }}
        />
      ))}
    </div>
  );
}

// Stat Card Component
interface StatCardProps {
  icon: React.ComponentType<{ className?: string }>;
  label: string;
  value: number;
  suffix?: string;
  color: string;
  delay?: number;
}

function StatCard({ icon: Icon, label, value, suffix = '', color, delay = 0 }: StatCardProps) {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true });
  const animatedValue = useAnimatedCounter(isInView ? value : 0, 2000);
  
  return (
    <motion.div
      ref={ref}
      initial={{ opacity: 0, y: 20 }}
      animate={isInView ? { opacity: 1, y: 0 } : {}}
      transition={{ duration: 0.5, delay }}
      whileHover={{ scale: 1.02, y: -4 }}
      className="relative group"
    >
      <div className="absolute inset-0 bg-gradient-to-br from-white/5 to-transparent rounded-2xl blur-xl group-hover:blur-2xl transition-all" />
      <div className="relative bg-[#141420]/80 backdrop-blur-xl border border-white/10 rounded-2xl p-5 overflow-hidden">
        {/* Glow effect */}
        <motion.div
          className="absolute -top-10 -right-10 w-32 h-32 rounded-full opacity-0 group-hover:opacity-100 transition-opacity duration-500"
          style={{ background: `radial-gradient(circle, ${color}40, transparent 70%)` }}
        />
        
        <div className="relative z-10 flex items-start justify-between">
          <div>
            <p className="text-gray-400 text-sm mb-1">{label}</p>
            <motion.p 
              className="text-3xl font-black"
              style={{ color }}
            >
              {animatedValue.toLocaleString()}{suffix}
            </motion.p>
          </div>
          <div 
            className="p-3 rounded-xl"
            style={{ backgroundColor: `${color}15` }}
          >
            <Icon className="w-6 h-6" style={{ color }} />
          </div>
        </div>
      </div>
    </motion.div>
  );
}

// Level Progress Component
function LevelProgress({ level, progress }: { level: number; progress: number }) {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true });
  
  return (
    <motion.div
      ref={ref}
      initial={{ opacity: 0, scale: 0.95 }}
      animate={isInView ? { opacity: 1, scale: 1 } : {}}
      transition={{ duration: 0.5 }}
      className="relative bg-[#141420]/80 backdrop-blur-xl border border-white/10 rounded-2xl p-6 overflow-hidden"
    >
      {/* Animated border glow */}
      <div className="absolute inset-0 rounded-2xl overflow-hidden">
        <motion.div
          className="absolute inset-0"
          style={{
            background: 'linear-gradient(90deg, transparent, #00ff88, transparent)',
            opacity: 0.1,
          }}
          animate={{ x: ['-100%', '100%'] }}
          transition={{ duration: 3, repeat: Infinity, ease: 'linear' }}
        />
      </div>
      
      <div className="relative z-10">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-3">
            <motion.div
              className="w-14 h-14 rounded-2xl bg-gradient-to-br from-[#00ff88] to-[#00d9ff] flex items-center justify-center"
              animate={{ 
                boxShadow: ['0 0 20px #00ff8830', '0 0 40px #00ff8860', '0 0 20px #00ff8830']
              }}
              transition={{ duration: 2, repeat: Infinity }}
            >
              <span className="text-2xl font-black text-black">{level}</span>
            </motion.div>
            <div>
              <p className="text-gray-400 text-sm">Current Level</p>
              <p className="text-white font-bold text-lg">Greed Hunter</p>
            </div>
          </div>
          <div className="text-right">
            <p className="text-gray-400 text-sm">Next Level</p>
            <p className="text-[#00ff88] font-bold text-lg">{level + 1}</p>
          </div>
        </div>
        
        {/* Progress bar */}
        <div className="relative h-4 bg-[#1a1a2e] rounded-full overflow-hidden">
          <motion.div
            className="absolute inset-y-0 left-0 bg-gradient-to-r from-[#00ff88] via-[#00d9ff] to-[#8b5cf6] rounded-full"
            initial={{ width: 0 }}
            animate={isInView ? { width: `${progress}%` } : {}}
            transition={{ duration: 1.5, delay: 0.3, ease: 'easeOut' }}
          />
          <motion.div
            className="absolute inset-0 bg-gradient-to-r from-transparent via-white/30 to-transparent"
            animate={{ x: ['-100%', '100%'] }}
            transition={{ duration: 2, repeat: Infinity, ease: 'linear' }}
          />
        </div>
        
        <div className="flex justify-between mt-2 text-sm">
          <span className="text-gray-500">{progress}% Complete</span>
          <span className="text-gray-500">{100 - progress}% to go</span>
        </div>
      </div>
    </motion.div>
  );
}

// Ranking Component
function RankingCard({ rank, totalUsers }: { rank: number; totalUsers: number }) {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true });
  
  return (
    <motion.div
      ref={ref}
      initial={{ opacity: 0, x: -20 }}
      animate={isInView ? { opacity: 1, x: 0 } : {}}
      transition={{ duration: 0.5 }}
      whileHover={{ scale: 1.02 }}
      className="relative bg-gradient-to-br from-[#ffd700]/10 to-[#ff8c00]/5 backdrop-blur-xl border border-[#ffd700]/20 rounded-2xl p-6 overflow-hidden"
    >
      <motion.div
        className="absolute top-0 right-0 w-32 h-32 bg-[#ffd700]/10 rounded-full blur-3xl"
        animate={{ scale: [1, 1.2, 1] }}
        transition={{ duration: 3, repeat: Infinity }}
      />
      
      <div className="relative z-10 flex items-center gap-4">
        <motion.div
          className="w-16 h-16 rounded-2xl bg-gradient-to-br from-[#ffd700] to-[#ff8c00] flex items-center justify-center"
          animate={{ rotate: [0, 5, -5, 0] }}
          transition={{ duration: 4, repeat: Infinity }}
        >
          <Crown className="w-8 h-8 text-black" />
        </motion.div>
        
        <div>
          <p className="text-gray-400 text-sm">Global Ranking</p>
          <div className="flex items-baseline gap-2">
            <motion.span 
              className="text-4xl font-black text-[#ffd700]"
              initial={{ opacity: 0, scale: 0 }}
              animate={isInView ? { opacity: 1, scale: 1 } : {}}
              transition={{ duration: 0.5, delay: 0.3, type: 'spring' }}
            >
              #{rank}
            </motion.span>
            <span className="text-gray-500 text-sm">of {totalUsers.toLocaleString()}</span>
          </div>
        </div>
      </div>
    </motion.div>
  );
}

// Recent Activity Item
interface ActivityItem {
  id: string;
  type: 'event' | 'challenge' | 'mission' | 'achievement';
  title: string;
  timestamp: string;
  coins?: number;
}

function RecentActivityItem({ activity, delay }: { activity: ActivityItem; delay: number }) {
  const icons = {
    event: Calendar,
    challenge: Trophy,
    mission: Target,
    achievement: Award,
  };
  const colors = {
    event: '#00d9ff',
    challenge: '#8b5cf6',
    mission: '#00ff88',
    achievement: '#ffd700',
  };
  
  const Icon = icons[activity.type];
  const color = colors[activity.type];
  
  return (
    <motion.div
      initial={{ opacity: 0, x: -20 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ duration: 0.3, delay }}
      whileHover={{ x: 8, backgroundColor: 'rgba(255,255,255,0.02)' }}
      className="flex items-center gap-4 p-3 rounded-xl cursor-pointer transition-colors"
    >
      <div 
        className="w-10 h-10 rounded-xl flex items-center justify-center"
        style={{ backgroundColor: `${color}15` }}
      >
        <Icon className="w-5 h-5" style={{ color }} />
      </div>
      
      <div className="flex-1 min-w-0">
        <p className="text-white font-medium truncate">{activity.title}</p>
        <p className="text-gray-500 text-sm">{activity.timestamp}</p>
      </div>
      
      {activity.coins && (
        <div className="flex items-center gap-1 text-[#ffd700]">
          <Coins className="w-4 h-4" />
          <span className="font-medium">+{activity.coins}</span>
        </div>
      )}
    </motion.div>
  );
}

// Upcoming Event Card
interface UpcomingEvent {
  id: string;
  title: string;
  date: string;
  time: string;
  type: string;
  reward: number;
}

function UpcomingEventCard({ event, delay }: { event: UpcomingEvent; delay: number }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3, delay }}
      whileHover={{ scale: 1.02, y: -4 }}
      className="relative bg-[#141420]/60 backdrop-blur-xl border border-white/5 rounded-xl p-4 cursor-pointer group overflow-hidden"
    >
      <motion.div
        className="absolute inset-0 bg-gradient-to-r from-[#00ff88]/0 via-[#00ff88]/5 to-[#00ff88]/0 opacity-0 group-hover:opacity-100 transition-opacity"
      />
      
      <div className="relative z-10">
        <div className="flex items-start justify-between mb-3">
          <div className="flex items-center gap-2">
            <span className="px-2 py-0.5 bg-[#00ff88]/10 text-[#00ff88] text-xs font-medium rounded">
              {event.type}
            </span>
          </div>
          <div className="flex items-center gap-1 text-[#ffd700] text-sm">
            <Coins className="w-3 h-3" />
            <span>{event.reward}</span>
          </div>
        </div>
        
        <h4 className="text-white font-semibold mb-2 line-clamp-2">{event.title}</h4>
        
        <div className="flex items-center gap-4 text-sm text-gray-400">
          <div className="flex items-center gap-1">
            <Calendar className="w-4 h-4" />
            <span>{event.date}</span>
          </div>
          <div className="flex items-center gap-1">
            <Clock className="w-4 h-4" />
            <span>{event.time}</span>
          </div>
        </div>
      </div>
      
      <ChevronRight className="absolute right-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-600 group-hover:text-[#00ff88] transition-colors" />
    </motion.div>
  );
}

// Tab Card Component
interface TabItem {
  id: string;
  label: string;
  icon: React.ComponentType<{ className?: string }>;
}

function TabbedCards({ tabs, children }: { tabs: TabItem[]; children: (activeTab: string) => React.ReactNode }) {
  const [activeTab, setActiveTab] = useState(tabs[0].id);
  
  return (
    <div className="relative bg-[#141420]/80 backdrop-blur-xl border border-white/10 rounded-2xl overflow-hidden">
      {/* Tab Header */}
      <div className="flex border-b border-white/5">
        {tabs.map((tab) => {
          const Icon = tab.icon;
          return (
            <motion.button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`flex-1 flex items-center justify-center gap-2 py-4 px-4 relative transition-colors ${
                activeTab === tab.id ? 'text-[#00ff88]' : 'text-gray-400 hover:text-white'
              }`}
              whileHover={{ backgroundColor: 'rgba(255,255,255,0.02)' }}
              whileTap={{ scale: 0.98 }}
            >
              <Icon className="w-4 h-4" />
              <span className="font-medium text-sm">{tab.label}</span>
              
              {activeTab === tab.id && (
                <motion.div
                  layoutId="activeTabIndicator"
                  className="absolute bottom-0 left-0 right-0 h-0.5 bg-gradient-to-r from-[#00ff88] to-[#00d9ff]"
                  transition={{ type: 'spring', stiffness: 300, damping: 30 }}
                />
              )}
            </motion.button>
          );
        })}
      </div>
      
      {/* Tab Content */}
      <div className="p-4">
        <AnimatePresence mode="wait">
          <motion.div
            key={activeTab}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            transition={{ duration: 0.2 }}
          >
            {children(activeTab)}
          </motion.div>
        </AnimatePresence>
      </div>
    </div>
  );
}

// Challenge Preview Component
interface Challenge {
  id: string;
  title: string;
  progress: number;
  status: 'ongoing' | 'completed';
  reward: number;
}

function ChallengePreview({ challenge, onClick }: { challenge: Challenge; onClick: () => void }) {
  return (
    <motion.div
      whileHover={{ scale: 1.01, x: 4 }}
      whileTap={{ scale: 0.99 }}
      onClick={onClick}
      className="flex items-center gap-4 p-3 rounded-xl cursor-pointer hover:bg-white/5 transition-colors"
    >
      <div className={`w-10 h-10 rounded-xl flex items-center justify-center ${
        challenge.status === 'completed' 
          ? 'bg-[#ffd700]/20' 
          : 'bg-[#8b5cf6]/20'
      }`}>
        {challenge.status === 'completed' ? (
          <CheckCircle2 className="w-5 h-5 text-[#ffd700]" />
        ) : (
          <Flame className="w-5 h-5 text-[#8b5cf6]" />
        )}
      </div>
      
      <div className="flex-1 min-w-0">
        <p className="text-white font-medium text-sm truncate">{challenge.title}</p>
        <div className="flex items-center gap-2 mt-1">
          <div className="flex-1 h-1.5 bg-[#1a1a2e] rounded-full overflow-hidden">
            <motion.div
              className={`h-full rounded-full ${
                challenge.status === 'completed'
                  ? 'bg-[#ffd700]'
                  : 'bg-gradient-to-r from-[#8b5cf6] to-[#00ff88]'
              }`}
              initial={{ width: 0 }}
              animate={{ width: `${challenge.progress}%` }}
              transition={{ duration: 0.5 }}
            />
          </div>
          <span className="text-gray-500 text-xs">{challenge.progress}%</span>
        </div>
      </div>
      
      <div className="flex items-center gap-1 text-[#ffd700] text-sm">
        <Coins className="w-4 h-4" />
        <span>{challenge.reward}</span>
      </div>
    </motion.div>
  );
}

// Achievement Badge Component
interface Achievement {
  id: string;
  title: string;
  icon: string;
  rarity: 'common' | 'rare' | 'epic' | 'legendary';
  date: string;
}

function AchievementBadge({ achievement, onClick }: { achievement: Achievement; onClick: () => void }) {
  const rarityColors = {
    common: '#9ca3af',
    rare: '#00d9ff',
    epic: '#8b5cf6',
    legendary: '#ffd700',
  };
  const color = rarityColors[achievement.rarity];
  
  return (
    <motion.button
      onClick={onClick}
      whileHover={{ scale: 1.05, y: -4 }}
      whileTap={{ scale: 0.95 }}
      className="relative flex flex-col items-center p-3 rounded-xl bg-white/5 hover:bg-white/10 transition-colors"
    >
      <motion.div
        className="w-14 h-14 rounded-2xl flex items-center justify-center mb-2"
        style={{ 
          backgroundColor: `${color}20`,
          boxShadow: `0 0 20px ${color}40`,
        }}
        animate={{ 
          boxShadow: [`0 0 10px ${color}20`, `0 0 25px ${color}40`, `0 0 10px ${color}20`]
        }}
        transition={{ duration: 2, repeat: Infinity }}
      >
        <span className="text-2xl">{achievement.icon}</span>
      </motion.div>
      <p className="text-xs text-white font-medium text-center line-clamp-2">{achievement.title}</p>
      <span 
        className="text-[10px] uppercase tracking-wider mt-1"
        style={{ color }}
      >
        {achievement.rarity}
      </span>
    </motion.button>
  );
}

// Modal Component
function Modal({ isOpen, onClose, title, children }: { 
  isOpen: boolean; 
  onClose: () => void; 
  title: string; 
  children: React.ReactNode 
}) {
  if (!isOpen) return null;
  
  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm"
        onClick={onClose}
      >
        <motion.div
          initial={{ opacity: 0, scale: 0.9, y: 20 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.9, y: 20 }}
          transition={{ type: 'spring', damping: 25, stiffness: 300 }}
          className="relative w-full max-w-lg bg-[#141420] border border-white/10 rounded-2xl p-6 overflow-hidden"
          onClick={(e) => e.stopPropagation()}
        >
          <div className="absolute inset-0 bg-gradient-to-br from-[#00ff88]/5 via-transparent to-[#8b5cf6]/5" />
          
          <div className="relative z-10">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-xl font-bold text-white">{title}</h3>
              <motion.button
                onClick={onClose}
                whileHover={{ scale: 1.1, rotate: 90 }}
                whileTap={{ scale: 0.9 }}
                className="p-2 rounded-lg hover:bg-white/10 transition-colors"
              >
                <X className="w-5 h-5 text-gray-400" />
              </motion.button>
            </div>
            {children}
          </div>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
}

// Main Overview Component
export function Overview() {
  const greeting = getGreeting();
  const userName = 'Hunter';
  
  // Mock data
  const stats = {
    coins: 12450,
    tasksCompleted: 847,
    eventsAttended: 156,
    challengesWon: 89,
    level: 24,
    levelProgress: 67,
    rank: 1247,
    totalUsers: 50000,
  };
  
  const recentActivities: ActivityItem[] = [
    { id: '1', type: 'challenge', title: 'Won Speed Coding Challenge', timestamp: '2 hours ago', coins: 500 },
    { id: '2', type: 'event', title: 'Attended Web Dev Workshop', timestamp: '5 hours ago', coins: 150 },
    { id: '3', type: 'mission', title: 'Completed Daily Login Streak', timestamp: 'Yesterday', coins: 50 },
    { id: '4', type: 'achievement', title: 'Unlocked "Code Warrior" Badge', timestamp: 'Yesterday' },
    { id: '5', type: 'challenge', title: 'Participated in Algorithm Battle', timestamp: '2 days ago', coins: 300 },
  ];
  
  const upcomingEvents: UpcomingEvent[] = [
    { id: '1', title: 'React Advanced Workshop', date: 'Dec 15', time: '10:00 AM', type: 'Workshop', reward: 200 },
    { id: '2', title: 'Hackathon 2024', date: 'Dec 20', time: '9:00 AM', type: 'Competition', reward: 1000 },
    { id: '3', title: 'AI/ML Bootcamp', date: 'Dec 22', time: '2:00 PM', type: 'Bootcamp', reward: 300 },
  ];
  
  const challenges: Challenge[] = [
    { id: '1', title: 'Complete 5 Daily Missions', progress: 80, status: 'ongoing', reward: 100 },
    { id: '2', title: 'Win 3 Coding Battles', progress: 66, status: 'ongoing', reward: 250 },
    { id: '3', title: 'Attend 2 Events', progress: 100, status: 'completed', reward: 150 },
    { id: '4', title: 'Earn 1000 Coins', progress: 45, status: 'ongoing', reward: 200 },
  ];
  
  const achievements: Achievement[] = [
    { id: '1', title: 'First Blood', icon: '🩸', rarity: 'common', date: 'Dec 10' },
    { id: '2', title: 'Speed Demon', icon: '⚡', rarity: 'rare', date: 'Dec 8' },
    { id: '3', title: 'Code Master', icon: '👨‍💻', rarity: 'epic', date: 'Dec 5' },
    { id: '4', title: 'Legend', icon: '🏆', rarity: 'legendary', date: 'Dec 1' },
    { id: '5', title: 'Night Owl', icon: '🦉', rarity: 'rare', date: 'Nov 28' },
    { id: '6', title: 'Team Player', icon: '🤝', rarity: 'common', date: 'Nov 25' },
  ];
  
  const [selectedChallenge, setSelectedChallenge] = useState<Challenge | null>(null);
  const [selectedAchievement, setSelectedAchievement] = useState<Achievement | null>(null);
  
  const tabs: TabItem[] = [
    { id: 'events', label: 'Active Events', icon: Calendar },
    { id: 'missions', label: 'Daily Missions', icon: Target },
    { id: 'coins', label: 'Coins Earned', icon: Coins },
  ];

  return (
    <div className="relative min-h-full">
      {/* Grid Background */}
      <AnimatedGridBackground />
      
      <div className="relative z-10 space-y-6">
        {/* Welcome Section */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4"
        >
          <div>
            <motion.div 
              className="flex items-center gap-3 mb-2"
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.2 }}
            >
              <span className="text-3xl">{greeting.emoji}</span>
              <h1 className="text-3xl lg:text-4xl font-black text-white">
                {greeting.text}, <span className="text-[#00ff88] neon-glow">{userName}</span>
              </h1>
            </motion.div>
            <motion.p 
              className="text-gray-400 text-lg"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.4 }}
            >
              Ready to dominate? Your empire awaits.
            </motion.p>
          </div>
          
          {/* Coins Display */}
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.3 }}
            whileHover={{ scale: 1.05 }}
            className="relative"
          >
            <div className="relative bg-gradient-to-r from-[#ffd700]/20 to-[#ff8c00]/10 backdrop-blur-xl border border-[#ffd700]/30 rounded-2xl px-6 py-4">
              <motion.div
                className="absolute inset-0 rounded-2xl"
                animate={{
                  boxShadow: ['0 0 20px #ffd70030', '0 0 40px #ffd70050', '0 0 20px #ffd70030'],
                }}
                transition={{ duration: 2, repeat: Infinity }}
              />
              
              <div className="relative z-10 flex items-center gap-3">
                <motion.div
                  animate={{ rotate: [0, 360] }}
                  transition={{ duration: 10, repeat: Infinity, ease: 'linear' }}
                >
                  <Coins className="w-10 h-10 text-[#ffd700]" />
                </motion.div>
                <div>
                  <p className="text-sm text-gray-400">Total Coins</p>
                  <motion.p 
                    className="text-3xl font-black text-[#ffd700]"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                  >
                    {useAnimatedCounter(stats.coins, 2500).toLocaleString()}
                  </motion.p>
                </div>
              </div>
            </div>
          </motion.div>
        </motion.div>

        {/* Stats Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          <StatCard 
            icon={CheckCircle2} 
            label="Tasks Completed" 
            value={stats.tasksCompleted} 
            color="#00ff88" 
            delay={0.1}
          />
          <StatCard 
            icon={Calendar} 
            label="Events Attended" 
            value={stats.eventsAttended} 
            color="#00d9ff" 
            delay={0.2}
          />
          <StatCard 
            icon={Trophy} 
            label="Challenges Won" 
            value={stats.challengesWon} 
            color="#8b5cf6" 
            delay={0.3}
          />
          <StatCard 
            icon={Flame} 
            label="Streak" 
            value={12} 
            suffix=" days"
            color="#ff6b6b" 
            delay={0.4}
          />
        </div>

        {/* Level & Ranking Row */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
          <LevelProgress level={stats.level} progress={stats.levelProgress} />
          <RankingCard rank={stats.rank} totalUsers={stats.totalUsers} />
        </div>

        {/* Tabbed Cards Section */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Main Tabbed Content */}
          <div className="lg:col-span-2">
            <TabbedCards tabs={tabs}>
              {(activeTab) => {
                if (activeTab === 'events') {
                  return (
                    <div className="space-y-3">
                      {upcomingEvents.map((event, i) => (
                        <UpcomingEventCard key={event.id} event={event} delay={i * 0.1} />
                      ))}
                    </div>
                  );
                }
                if (activeTab === 'missions') {
                  return (
                    <div className="space-y-2">
                      {[
                        { title: 'Complete 3 Coding Challenges', progress: 66, reward: 50 },
                        { title: 'Login Daily Streak', progress: 100, reward: 25 },
                        { title: 'Share an Achievement', progress: 0, reward: 30 },
                        { title: 'Join a Community Discussion', progress: 50, reward: 40 },
                      ].map((mission, i) => (
                        <motion.div
                          key={i}
                          initial={{ opacity: 0, x: -20 }}
                          animate={{ opacity: 1, x: 0 }}
                          transition={{ delay: i * 0.1 }}
                          className="flex items-center gap-4 p-3 rounded-xl hover:bg-white/5 transition-colors"
                        >
                          <div className={`w-10 h-10 rounded-xl flex items-center justify-center ${
                            mission.progress === 100 ? 'bg-[#00ff88]/20' : 'bg-[#00d9ff]/20'
                          }`}>
                            {mission.progress === 100 ? (
                              <CheckCircle2 className="w-5 h-5 text-[#00ff88]" />
                            ) : (
                              <Circle className="w-5 h-5 text-[#00d9ff]" />
                            )}
                          </div>
                          <div className="flex-1">
                            <p className="text-white text-sm font-medium">{mission.title}</p>
                            <div className="flex items-center gap-2 mt-1">
                              <div className="flex-1 h-1.5 bg-[#1a1a2e] rounded-full overflow-hidden">
                                <motion.div
                                  className="h-full bg-gradient-to-r from-[#00ff88] to-[#00d9ff] rounded-full"
                                  initial={{ width: 0 }}
                                  animate={{ width: `${mission.progress}%` }}
                                  transition={{ duration: 0.5 }}
                                />
                              </div>
                              <span className="text-gray-500 text-xs">{mission.progress}%</span>
                            </div>
                          </div>
                          <div className="flex items-center gap-1 text-[#ffd700] text-sm">
                            <Coins className="w-4 h-4" />
                            <span>{mission.reward}</span>
                          </div>
                        </motion.div>
                      ))}
                    </div>
                  );
                }
                return (
                  <div className="space-y-3">
                    {[
                      { source: 'Challenge Victory', amount: 500, time: '2 hours ago' },
                      { source: 'Event Attendance', amount: 150, time: '5 hours ago' },
                      { source: 'Daily Mission', amount: 50, time: 'Yesterday' },
                      { source: 'Referral Bonus', amount: 200, time: '2 days ago' },
                    ].map((earning, i) => (
                      <motion.div
                        key={i}
                        initial={{ opacity: 0, x: -20 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: i * 0.1 }}
                        className="flex items-center justify-between p-3 rounded-xl hover:bg-white/5 transition-colors"
                      >
                        <div className="flex items-center gap-3">
                          <div className="w-10 h-10 rounded-xl bg-[#ffd700]/20 flex items-center justify-center">
                            <Coins className="w-5 h-5 text-[#ffd700]" />
                          </div>
                          <div>
                            <p className="text-white font-medium">{earning.source}</p>
                            <p className="text-gray-500 text-sm">{earning.time}</p>
                          </div>
                        </div>
                        <span className="text-[#00ff88] font-bold text-lg">+{earning.amount}</span>
                      </motion.div>
                    ))}
                  </div>
                );
              }}
            </TabbedCards>
          </div>

          {/* Recent Activities */}
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.5, delay: 0.3 }}
            className="bg-[#141420]/80 backdrop-blur-xl border border-white/10 rounded-2xl overflow-hidden"
          >
            <div className="p-4 border-b border-white/5 flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Activity className="w-5 h-5 text-[#00ff88]" />
                <h3 className="font-semibold text-white">Recent Activity</h3>
              </div>
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className="text-sm text-[#00ff88] hover:underline"
              >
                View All
              </motion.button>
            </div>
            <div className="p-2 max-h-80 overflow-y-auto custom-scrollbar">
              {recentActivities.map((activity, i) => (
                <RecentActivityItem key={activity.id} activity={activity} delay={i * 0.1} />
              ))}
            </div>
          </motion.div>
        </div>

        {/* Challenges & Achievements Row */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Challenges Preview */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="bg-[#141420]/80 backdrop-blur-xl border border-white/10 rounded-2xl overflow-hidden"
          >
            <div className="p-4 border-b border-white/5 flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Trophy className="w-5 h-5 text-[#8b5cf6]" />
                <h3 className="font-semibold text-white">Challenges</h3>
              </div>
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className="text-sm text-[#8b5cf6] hover:underline"
              >
                View All
              </motion.button>
            </div>
            <div className="p-2">
              {challenges.map((challenge) => (
                <ChallengePreview 
                  key={challenge.id} 
                  challenge={challenge} 
                  onClick={() => setSelectedChallenge(challenge)}
                />
              ))}
            </div>
          </motion.div>

          {/* Achievements */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="bg-[#141420]/80 backdrop-blur-xl border border-white/10 rounded-2xl overflow-hidden"
          >
            <div className="p-4 border-b border-white/5 flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Award className="w-5 h-5 text-[#ffd700]" />
                <h3 className="font-semibold text-white">Recent Achievements</h3>
              </div>
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className="text-sm text-[#ffd700] hover:underline"
              >
                View All
              </motion.button>
            </div>
            <div className="p-4 grid grid-cols-3 sm:grid-cols-6 lg:grid-cols-3 gap-3">
              {achievements.map((achievement) => (
                <AchievementBadge 
                  key={achievement.id} 
                  achievement={achievement}
                  onClick={() => setSelectedAchievement(achievement)}
                />
              ))}
            </div>
          </motion.div>
        </div>

        {/* Challenge Modal */}
        <Modal 
          isOpen={!!selectedChallenge} 
          onClose={() => setSelectedChallenge(null)}
          title="Challenge Details"
        >
          {selectedChallenge && (
            <div className="space-y-4">
              <div className="flex items-center gap-3">
                <div className={`w-12 h-12 rounded-xl flex items-center justify-center ${
                  selectedChallenge.status === 'completed' ? 'bg-[#ffd700]/20' : 'bg-[#8b5cf6]/20'
                }`}>
                  {selectedChallenge.status === 'completed' ? (
                    <Trophy className="w-6 h-6 text-[#ffd700]" />
                  ) : (
                    <Flame className="w-6 h-6 text-[#8b5cf6]" />
                  )}
                </div>
                <div>
                  <h4 className="text-lg font-bold text-white">{selectedChallenge.title}</h4>
                  <span className={`text-sm ${
                    selectedChallenge.status === 'completed' ? 'text-[#ffd700]' : 'text-[#8b5cf6]'
                  }`}>
                    {selectedChallenge.status === 'completed' ? 'Completed' : 'In Progress'}
                  </span>
                </div>
              </div>
              
              <div className="space-y-2">
                <div className="flex justify-between text-sm">
                  <span className="text-gray-400">Progress</span>
                  <span className="text-white font-medium">{selectedChallenge.progress}%</span>
                </div>
                <div className="h-3 bg-[#1a1a2e] rounded-full overflow-hidden">
                  <motion.div
                    className="h-full bg-gradient-to-r from-[#8b5cf6] to-[#00ff88] rounded-full"
                    initial={{ width: 0 }}
                    animate={{ width: `${selectedChallenge.progress}%` }}
                    transition={{ duration: 0.8 }}
                  />
                </div>
              </div>
              
              <div className="flex items-center justify-between p-4 bg-[#1a1a2e] rounded-xl">
                <span className="text-gray-400">Reward</span>
                <div className="flex items-center gap-2">
                  <Coins className="w-5 h-5 text-[#ffd700]" />
                  <span className="text-xl font-bold text-[#ffd700]">{selectedChallenge.reward}</span>
                </div>
              </div>
            </div>
          )}
        </Modal>

        {/* Achievement Modal */}
        <Modal 
          isOpen={!!selectedAchievement} 
          onClose={() => setSelectedAchievement(null)}
          title="Achievement Unlocked!"
        >
          {selectedAchievement && (
            <div className="text-center space-y-4">
              <motion.div
                className="w-24 h-24 mx-auto rounded-3xl flex items-center justify-center"
                style={{ 
                  backgroundColor: `${
                    selectedAchievement.rarity === 'legendary' ? '#ffd700' :
                    selectedAchievement.rarity === 'epic' ? '#8b5cf6' :
                    selectedAchievement.rarity === 'rare' ? '#00d9ff' : '#9ca3af'
                  }20`,
                }}
                animate={{ 
                  scale: [1, 1.1, 1],
                  boxShadow: [
                    `0 0 20px ${selectedAchievement.rarity === 'legendary' ? '#ffd700' : '#8b5cf6'}30`,
                    `0 0 40px ${selectedAchievement.rarity === 'legendary' ? '#ffd700' : '#8b5cf6'}60`,
                    `0 0 20px ${selectedAchievement.rarity === 'legendary' ? '#ffd700' : '#8b5cf6'}30`,
                  ]
                }}
                transition={{ duration: 2, repeat: Infinity }}
              >
                <span className="text-5xl">{selectedAchievement.icon}</span>
              </motion.div>
              
              <div>
                <h4 className="text-2xl font-bold text-white mb-1">{selectedAchievement.title}</h4>
                <p 
                  className="text-sm uppercase tracking-wider font-medium"
                  style={{ 
                    color: selectedAchievement.rarity === 'legendary' ? '#ffd700' :
                           selectedAchievement.rarity === 'epic' ? '#8b5cf6' :
                           selectedAchievement.rarity === 'rare' ? '#00d9ff' : '#9ca3af'
                  }}
                >
                  {selectedAchievement.rarity}
                </p>
              </div>
              
              <p className="text-gray-400">Earned on {selectedAchievement.date}</p>
              
              <div className="flex justify-center gap-2">
                <Sparkles className="w-5 h-5 text-[#ffd700]" />
                <span className="text-gray-300">You're a true Greed Hunter!</span>
                <Sparkles className="w-5 h-5 text-[#ffd700]" />
              </div>
            </div>
          )}
        </Modal>
      </div>

      {/* Custom styles */}
      <style>{`
        .grid-background {
          background-image: 
            linear-gradient(rgba(0, 255, 136, 0.03) 1px, transparent 1px),
            linear-gradient(90deg, rgba(0, 255, 136, 0.03) 1px, transparent 1px);
          background-size: 40px 40px;
        }
        .custom-scrollbar::-webkit-scrollbar {
          width: 4px;
        }
        .custom-scrollbar::-webkit-scrollbar-track {
          background: #1a1a2e;
          border-radius: 2px;
        }
        .custom-scrollbar::-webkit-scrollbar-thumb {
          background: linear-gradient(180deg, #00ff88, #00d9ff);
          border-radius: 2px;
        }
        .neon-glow {
          text-shadow: 0 0 10px #00ff88, 0 0 20px #00ff88, 0 0 30px #00ff88;
        }
      `}</style>
    </div>
  );
}