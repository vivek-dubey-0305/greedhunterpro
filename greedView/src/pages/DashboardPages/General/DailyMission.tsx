import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Target, 
  Clock, 
  Coins, 
  CheckCircle2, 
  Circle, 
  Flame, 
  Zap, 
  Gift,
  Trophy,
  Star,
  Sparkles,
  ChevronRight,
  RefreshCw
} from 'lucide-react';

// Mission interface
interface Mission {
  id: string;
  title: string;
  description: string;
  progress: number;
  target: number;
  reward: number;
  difficulty: 'easy' | 'medium' | 'hard';
  type: 'daily' | 'weekly' | 'special';
  timeLeft?: string;
  completed: boolean;
}

// Countdown Timer Component
function CountdownTimer({ endTime }: { endTime: string }) {
  const [timeLeft, setTimeLeft] = useState(endTime);
  
  useEffect(() => {
    const timer = setInterval(() => {
      // In production, calculate actual time difference
      const hours = Math.floor(Math.random() * 24);
      const minutes = Math.floor(Math.random() * 60);
      const seconds = Math.floor(Math.random() * 60);
      setTimeLeft(`${hours.toString().padStart(2, '0')}:${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`);
    }, 1000);
    
    return () => clearInterval(timer);
  }, []);

  return (
    <div className="flex items-center gap-2">
      <Clock className="w-4 h-4 text-[#ff6b6b]" />
      <span className="text-[#ff6b6b] font-mono text-sm">{timeLeft}</span>
    </div>
  );
}

// Mission Card Component
function MissionCard({ mission, onClaim }: { mission: Mission; onClaim: (id: string) => void }) {
  const difficultyColors = {
    easy: { bg: 'bg-[#00ff88]/10', text: 'text-[#00ff88]', border: 'border-[#00ff88]/30' },
    medium: { bg: 'bg-[#ffd700]/10', text: 'text-[#ffd700]', border: 'border-[#ffd700]/30' },
    hard: { bg: 'bg-[#ff6b6b]/10', text: 'text-[#ff6b6b]', border: 'border-[#ff6b6b]/30' },
  };

  const typeIcons = {
    daily: Target,
    weekly: Trophy,
    special: Star,
  };

  const colors = difficultyColors[mission.difficulty];
  const TypeIcon = typeIcons[mission.type];
  const progressPercent = (mission.progress / mission.target) * 100;

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      whileHover={{ scale: 1.01, y: -4 }}
      className={`relative bg-[#141420]/80 backdrop-blur-xl border rounded-2xl overflow-hidden transition-all ${
        mission.completed ? 'border-[#00ff88]/30' : 'border-white/10 hover:border-white/20'
      }`}
    >
      {/* Completion glow */}
      {mission.completed && (
        <motion.div
          className="absolute inset-0 bg-gradient-to-r from-[#00ff88]/5 via-[#00ff88]/10 to-[#00ff88]/5"
          animate={{ opacity: [0.5, 1, 0.5] }}
          transition={{ duration: 2, repeat: Infinity }}
        />
      )}

      <div className="relative p-5">
        <div className="flex items-start justify-between mb-4">
          <div className="flex items-start gap-3">
            <motion.div
              className={`p-3 rounded-xl ${colors.bg}`}
              whileHover={{ rotate: [0, -10, 10, 0] }}
              transition={{ duration: 0.5 }}
            >
              <TypeIcon className={`w-6 h-6 ${colors.text}`} />
            </motion.div>
            
            <div>
              <div className="flex items-center gap-2 mb-1">
                <span className={`px-2 py-0.5 rounded text-xs font-medium uppercase ${colors.bg} ${colors.text}`}>
                  {mission.difficulty}
                </span>
                <span className="px-2 py-0.5 bg-white/5 rounded text-xs text-gray-400 capitalize">
                  {mission.type}
                </span>
              </div>
              <h3 className="text-lg font-bold text-white">{mission.title}</h3>
              <p className="text-gray-400 text-sm mt-1">{mission.description}</p>
            </div>
          </div>
          
          {/* Reward */}
          <div className="flex items-center gap-1 px-3 py-1.5 bg-[#ffd700]/10 rounded-xl">
            <Coins className="w-5 h-5 text-[#ffd700]" />
            <span className="text-[#ffd700] font-bold">{mission.reward}</span>
          </div>
        </div>

        {/* Progress Section */}
        <div className="space-y-3">
          <div className="flex items-center justify-between text-sm">
            <span className="text-gray-400">
              Progress: <span className="text-white font-medium">{mission.progress}/{mission.target}</span>
            </span>
            {mission.timeLeft && !mission.completed && (
              <CountdownTimer endTime={mission.timeLeft} />
            )}
          </div>
          
          {/* Progress Bar */}
          <div className="relative h-3 bg-[#1a1a2e] rounded-full overflow-hidden">
            <motion.div
              className={`absolute inset-y-0 left-0 rounded-full ${
                mission.completed 
                  ? 'bg-gradient-to-r from-[#00ff88] to-[#00d9ff]'
                  : 'bg-gradient-to-r from-[#8b5cf6] to-[#00ff88]'
              }`}
              initial={{ width: 0 }}
              animate={{ width: `${progressPercent}%` }}
              transition={{ duration: 1, ease: 'easeOut' }}
            />
            
            {/* Shimmer effect */}
            {!mission.completed && (
              <motion.div
                className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent"
                animate={{ x: ['-100%', '100%'] }}
                transition={{ duration: 2, repeat: Infinity, ease: 'linear' }}
              />
            )}
          </div>
        </div>

        {/* Action Button */}
        <div className="mt-4">
          {mission.completed ? (
            <motion.button
              onClick={() => onClaim(mission.id)}
              className="w-full py-3 bg-gradient-to-r from-[#00ff88] to-[#00d9ff] text-black font-bold rounded-xl flex items-center justify-center gap-2"
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
            >
              <Gift className="w-5 h-5" />
              Claim Reward
              <Sparkles className="w-4 h-4" />
            </motion.button>
          ) : (
            <div className="w-full py-3 bg-white/5 text-gray-400 font-medium rounded-xl text-center">
              {Math.round(progressPercent)}% Complete
            </div>
          )}
        </div>
      </div>
    </motion.div>
  );
}

// Stats Card Component
function StatsCard({ icon: Icon, label, value, color }: {
  icon: React.ComponentType<{ className?: string }>;
  label: string;
  value: string | number;
  color: string;
}) {
  return (
    <motion.div
      whileHover={{ scale: 1.02, y: -4 }}
      className="bg-[#141420]/80 backdrop-blur-xl border border-white/10 rounded-xl p-4"
    >
      <div className="flex items-center gap-3">
        <div className="p-2 rounded-lg" style={{ backgroundColor: `${color}15` }}>
          <Icon className="w-5 h-5" style={{ color }} />
        </div>
        <div>
          <p className="text-gray-400 text-sm">{label}</p>
          <p className="text-white font-bold text-xl">{value}</p>
        </div>
      </div>
    </motion.div>
  );
}

// Main Component
export function DailyMission() {
  const [activeTab, setActiveTab] = useState<'daily' | 'weekly' | 'special'>('daily');
  const [claimedMissions, setClaimedMissions] = useState<string[]>([]);

  const missions: Mission[] = [
    {
      id: '1',
      title: 'Complete 3 Coding Challenges',
      description: 'Solve any 3 coding problems to earn rewards',
      progress: 2,
      target: 3,
      reward: 50,
      difficulty: 'easy',
      type: 'daily',
      timeLeft: '12:45:30',
      completed: false,
    },
    {
      id: '2',
      title: 'Maintain Login Streak',
      description: 'Log in daily to build your streak',
      progress: 7,
      target: 7,
      reward: 100,
      difficulty: 'easy',
      type: 'daily',
      completed: true,
    },
    {
      id: '3',
      title: 'Win a Coding Battle',
      description: 'Challenge and defeat another hunter',
      progress: 0,
      target: 1,
      reward: 150,
      difficulty: 'medium',
      type: 'daily',
      timeLeft: '08:22:15',
      completed: false,
    },
    {
      id: '4',
      title: 'Complete Speed Challenge',
      description: 'Finish 5 problems in under 30 minutes',
      progress: 3,
      target: 5,
      reward: 200,
      difficulty: 'hard',
      type: 'daily',
      timeLeft: '05:10:45',
      completed: false,
    },
    {
      id: '5',
      title: 'Attend 3 Events',
      description: 'Participate in any 3 community events',
      progress: 2,
      target: 3,
      reward: 300,
      difficulty: 'medium',
      type: 'weekly',
      completed: false,
    },
    {
      id: '6',
      title: 'Earn 1000 Coins',
      description: 'Accumulate 1000 coins this week',
      progress: 750,
      target: 1000,
      reward: 500,
      difficulty: 'hard',
      type: 'weekly',
      completed: false,
    },
    {
      id: '7',
      title: 'Holiday Special Challenge',
      description: 'Complete the exclusive holiday coding marathon',
      progress: 8,
      target: 10,
      reward: 1000,
      difficulty: 'hard',
      type: 'special',
      completed: false,
    },
  ];

  const filteredMissions = missions.filter(m => m.type === activeTab);
  
  const handleClaim = (id: string) => {
    setClaimedMissions([...claimedMissions, id]);
    // Show celebration animation
  };

  const tabs = [
    { id: 'daily', label: 'Daily', icon: Target, count: missions.filter(m => m.type === 'daily').length },
    { id: 'weekly', label: 'Weekly', icon: Trophy, count: missions.filter(m => m.type === 'weekly').length },
    { id: 'special', label: 'Special', icon: Star, count: missions.filter(m => m.type === 'special').length },
  ];

  return (
    <div className="space-y-6">
      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4"
      >
        <div>
          <h1 className="text-3xl font-black text-white mb-2 flex items-center gap-3">
            <Target className="w-8 h-8 text-[#00ff88]" />
            Daily Missions
          </h1>
          <p className="text-gray-400">Complete missions to earn coins and level up</p>
        </div>
        
        <motion.button
          whileHover={{ scale: 1.05, rotate: 180 }}
          whileTap={{ scale: 0.95 }}
          className="flex items-center gap-2 px-4 py-2 bg-[#141420] border border-white/10 rounded-xl text-gray-400 hover:text-white transition-colors"
        >
          <RefreshCw className="w-5 h-5" />
          <span>Refresh</span>
        </motion.button>
      </motion.div>

      {/* Stats Row */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1 }}
        className="grid grid-cols-2 lg:grid-cols-4 gap-4"
      >
        <StatsCard icon={Target} label="Missions Completed" value="12" color="#00ff88" />
        <StatsCard icon={Flame} label="Current Streak" value="7 days" color="#ff6b6b" />
        <StatsCard icon={Coins} label="Coins Earned Today" value="350" color="#ffd700" />
        <StatsCard icon={Zap} label="Bonus Multiplier" value="1.5x" color="#8b5cf6" />
      </motion.div>

      {/* Mission Type Tabs */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2 }}
        className="flex gap-2"
      >
        {tabs.map((tab) => {
          const Icon = tab.icon;
          return (
            <motion.button
              key={tab.id}
              onClick={() => setActiveTab(tab.id as typeof activeTab)}
              className={`relative flex items-center gap-2 px-5 py-3 rounded-xl font-medium transition-all ${
                activeTab === tab.id
                  ? 'text-[#00ff88]'
                  : 'text-gray-400 hover:text-white'
              }`}
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
            >
              {activeTab === tab.id && (
                <motion.div
                  layoutId="activeMissionTab"
                  className="absolute inset-0 bg-[#00ff88]/10 border border-[#00ff88]/30 rounded-xl"
                  transition={{ type: 'spring', stiffness: 300, damping: 30 }}
                />
              )}
              <Icon className="w-5 h-5 relative z-10" />
              <span className="relative z-10">{tab.label}</span>
              <span className={`relative z-10 px-2 py-0.5 rounded text-xs ${
                activeTab === tab.id
                  ? 'bg-[#00ff88]/20 text-[#00ff88]'
                  : 'bg-white/10 text-gray-400'
              }`}>
                {tab.count}
              </span>
            </motion.button>
          );
        })}
      </motion.div>

      {/* Missions Grid */}
      <AnimatePresence mode="wait">
        <motion.div
          key={activeTab}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -20 }}
          transition={{ duration: 0.3 }}
          className="grid grid-cols-1 lg:grid-cols-2 gap-4"
        >
          {filteredMissions.map((mission, index) => (
            <motion.div
              key={mission.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
            >
              <MissionCard 
                mission={mission} 
                onClaim={handleClaim}
              />
            </motion.div>
          ))}
        </motion.div>
      </AnimatePresence>

      {/* Bonus Section */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        className="relative bg-gradient-to-r from-[#8b5cf6]/20 to-[#00ff88]/20 border border-[#8b5cf6]/30 rounded-2xl p-6 overflow-hidden"
      >
        <motion.div
          className="absolute top-0 right-0 w-64 h-64 bg-[#8b5cf6]/20 rounded-full blur-3xl"
          animate={{ scale: [1, 1.2, 1] }}
          transition={{ duration: 4, repeat: Infinity }}
        />
        
        <div className="relative z-10 flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
          <div className="flex items-center gap-4">
            <motion.div
              className="p-4 bg-gradient-to-br from-[#8b5cf6] to-[#00ff88] rounded-2xl"
              animate={{ rotate: [0, 5, -5, 0] }}
              transition={{ duration: 4, repeat: Infinity }}
            >
              <Zap className="w-8 h-8 text-white" />
            </motion.div>
            <div>
              <h3 className="text-xl font-bold text-white">Complete All Daily Missions</h3>
              <p className="text-gray-300">Get a 500 coin bonus + 2x multiplier for tomorrow!</p>
            </div>
          </div>
          
          <div className="flex items-center gap-4">
            <div className="text-right">
              <p className="text-gray-400 text-sm">Progress</p>
              <p className="text-white font-bold">2/4 Completed</p>
            </div>
            <ChevronRight className="w-6 h-6 text-gray-400" />
          </div>
        </div>
      </motion.div>
    </div>
  );
}
