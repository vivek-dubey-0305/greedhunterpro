import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Trophy, 
  Flame, 
  Clock, 
  Coins, 
  Users, 
  Target,
  CheckCircle2,
  Circle,
  ChevronRight,
  X,
  Star,
  Zap,
  Award,
  TrendingUp
} from 'lucide-react';

// Challenge interface
interface Challenge {
  id: string;
  title: string;
  description: string;
  type: 'coding' | 'quiz' | 'speed' | 'battle';
  difficulty: 'easy' | 'medium' | 'hard' | 'extreme';
  status: 'ongoing' | 'completed' | 'failed';
  progress: number;
  target: number;
  reward: number;
  participants: number;
  timeLimit?: string;
  xpGained?: number;
  completedAt?: string;
}

// Challenge Card Component
function ChallengeCard({ challenge, onClick }: { challenge: Challenge; onClick: () => void }) {
  const statusConfig = {
    ongoing: { 
      color: '#8b5cf6', 
      bg: 'bg-[#8b5cf6]/10', 
      border: 'border-[#8b5cf6]/30',
      label: 'In Progress'
    },
    completed: { 
      color: '#ffd700', 
      bg: 'bg-[#ffd700]/10', 
      border: 'border-[#ffd700]/30',
      label: 'Completed'
    },
    failed: { 
      color: '#ff6b6b', 
      bg: 'bg-[#ff6b6b]/10', 
      border: 'border-[#ff6b6b]/30',
      label: 'Failed'
    },
  };

  const difficultyConfig = {
    easy: { color: '#00ff88', label: 'Easy', stars: 1 },
    medium: { color: '#00d9ff', label: 'Medium', stars: 2 },
    hard: { color: '#ffd700', label: 'Hard', stars: 3 },
    extreme: { color: '#ff6b6b', label: 'Extreme', stars: 4 },
  };

  const typeIcons = {
    coding: '💻',
    quiz: '❓',
    speed: '⚡',
    battle: '⚔️',
  };

  const config = statusConfig[challenge.status];
  const difficulty = difficultyConfig[challenge.difficulty];
  const progressPercent = (challenge.progress / challenge.target) * 100;

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      whileHover={{ scale: 1.02, y: -4 }}
      whileTap={{ scale: 0.98 }}
      onClick={onClick}
      className="relative group cursor-pointer"
    >
      {/* Glow effect */}
      <motion.div
        className="absolute inset-0 rounded-2xl blur-xl opacity-0 group-hover:opacity-100 transition-opacity duration-500"
        style={{ backgroundColor: `${config.color}20` }}
      />
      
      <div className={`relative bg-[#141420]/80 backdrop-blur-xl border rounded-2xl overflow-hidden transition-all ${config.border} group-hover:border-opacity-60`}>
        {/* Header */}
        <div className="p-5 pb-4">
          <div className="flex items-start justify-between mb-3">
            <div className="flex items-center gap-3">
              <motion.span 
                className="text-3xl"
                whileHover={{ scale: 1.2, rotate: [0, -10, 10, 0] }}
              >
                {typeIcons[challenge.type]}
              </motion.span>
              <div>
                <div className="flex items-center gap-2 mb-1">
                  <span className={`px-2 py-0.5 rounded text-xs font-semibold ${config.bg}`} style={{ color: config.color }}>
                    {config.label}
                  </span>
                  <span className="flex items-center gap-1 px-2 py-0.5 bg-white/5 rounded text-xs" style={{ color: difficulty.color }}>
                    {[...Array(difficulty.stars)].map((_, i) => (
                      <Star key={i} className="w-3 h-3 fill-current" />
                    ))}
                    <span className="ml-1">{difficulty.label}</span>
                  </span>
                </div>
                <h3 className="text-lg font-bold text-white group-hover:text-[#00ff88] transition-colors">
                  {challenge.title}
                </h3>
              </div>
            </div>
            
            <div className="flex items-center gap-1 px-3 py-1.5 bg-[#ffd700]/10 rounded-xl">
              <Coins className="w-4 h-4 text-[#ffd700]" />
              <span className="text-[#ffd700] font-bold">{challenge.reward}</span>
            </div>
          </div>
          
          <p className="text-gray-400 text-sm line-clamp-2 mb-4">{challenge.description}</p>
          
          {/* Stats Row */}
          <div className="flex items-center gap-4 text-sm text-gray-400">
            <div className="flex items-center gap-1">
              <Users className="w-4 h-4" />
              <span>{challenge.participants} hunters</span>
            </div>
            {challenge.timeLimit && (
              <div className="flex items-center gap-1">
                <Clock className="w-4 h-4" />
                <span>{challenge.timeLimit}</span>
              </div>
            )}
            {challenge.xpGained && (
              <div className="flex items-center gap-1 text-[#00ff88]">
                <TrendingUp className="w-4 h-4" />
                <span>+{challenge.xpGained} XP</span>
              </div>
            )}
          </div>
        </div>
        
        {/* Progress Section */}
        <div className="px-5 pb-5">
          <div className="flex items-center justify-between text-sm mb-2">
            <span className="text-gray-400">
              Progress: <span className="text-white font-medium">{challenge.progress}/{challenge.target}</span>
            </span>
            <span className="font-medium" style={{ color: config.color }}>
              {Math.round(progressPercent)}%
            </span>
          </div>
          
          <div className="relative h-2 bg-[#1a1a2e] rounded-full overflow-hidden">
            <motion.div
              className="absolute inset-y-0 left-0 rounded-full"
              style={{ 
                background: challenge.status === 'completed' 
                  ? 'linear-gradient(90deg, #ffd700, #ff8c00)' 
                  : challenge.status === 'failed'
                  ? '#ff6b6b'
                  : `linear-gradient(90deg, ${config.color}, #00ff88)` 
              }}
              initial={{ width: 0 }}
              animate={{ width: `${progressPercent}%` }}
              transition={{ duration: 1, ease: 'easeOut' }}
            />
          </div>
        </div>
        
        {/* Footer */}
        <div className="px-5 py-3 border-t border-white/5 flex items-center justify-between">
          <span className="text-sm text-gray-500">
            {challenge.completedAt ? `Completed ${challenge.completedAt}` : 'View Details'}
          </span>
          <ChevronRight className="w-5 h-5 text-gray-500 group-hover:text-[#00ff88] group-hover:translate-x-1 transition-all" />
        </div>
      </div>
    </motion.div>
  );
}

// Challenge Detail Modal
function ChallengeModal({ challenge, onClose }: { challenge: Challenge | null; onClose: () => void }) {
  if (!challenge) return null;

  const statusConfig = {
    ongoing: { color: '#8b5cf6', label: 'In Progress' },
    completed: { color: '#ffd700', label: 'Completed' },
    failed: { color: '#ff6b6b', label: 'Failed' },
  };

  const config = statusConfig[challenge.status];
  const progressPercent = (challenge.progress / challenge.target) * 100;

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
          className="relative w-full max-w-lg bg-[#141420] border border-white/10 rounded-2xl overflow-hidden"
          onClick={(e) => e.stopPropagation()}
        >
          {/* Gradient header */}
          <div className="relative h-32 overflow-hidden">
            <div 
              className="absolute inset-0"
              style={{ 
                background: `linear-gradient(135deg, ${config.color}30, transparent)` 
              }}
            />
            <div className="absolute inset-0 bg-gradient-to-t from-[#141420] to-transparent" />
            
            <motion.button
              onClick={onClose}
              className="absolute top-4 right-4 p-2 bg-black/50 rounded-lg hover:bg-black/70 transition-colors"
              whileHover={{ scale: 1.1, rotate: 90 }}
              whileTap={{ scale: 0.9 }}
            >
              <X className="w-5 h-5 text-white" />
            </motion.button>
            
            <div className="absolute bottom-4 left-6">
              <span 
                className="px-3 py-1 rounded-lg text-xs font-semibold uppercase"
                style={{ backgroundColor: `${config.color}20`, color: config.color }}
              >
                {config.label}
              </span>
            </div>
          </div>
          
          {/* Content */}
          <div className="p-6 space-y-6">
            <div>
              <h2 className="text-2xl font-bold text-white mb-2">{challenge.title}</h2>
              <p className="text-gray-400">{challenge.description}</p>
            </div>
            
            {/* Progress */}
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-gray-400">Progress</span>
                <span className="text-white font-bold">{challenge.progress}/{challenge.target}</span>
              </div>
              <div className="relative h-4 bg-[#1a1a2e] rounded-full overflow-hidden">
                <motion.div
                  className="absolute inset-y-0 left-0 rounded-full"
                  style={{ 
                    background: `linear-gradient(90deg, ${config.color}, #00ff88)` 
                  }}
                  initial={{ width: 0 }}
                  animate={{ width: `${progressPercent}%` }}
                  transition={{ duration: 1 }}
                />
              </div>
            </div>
            
            {/* Stats Grid */}
            <div className="grid grid-cols-2 gap-4">
              <div className="p-4 bg-[#1a1a2e] rounded-xl">
                <div className="flex items-center gap-2 text-gray-400 mb-1">
                  <Coins className="w-4 h-4 text-[#ffd700]" />
                  <span className="text-sm">Reward</span>
                </div>
                <p className="text-[#ffd700] font-bold text-xl">{challenge.reward} Coins</p>
              </div>
              
              <div className="p-4 bg-[#1a1a2e] rounded-xl">
                <div className="flex items-center gap-2 text-gray-400 mb-1">
                  <Users className="w-4 h-4 text-[#00d9ff]" />
                  <span className="text-sm">Participants</span>
                </div>
                <p className="text-white font-bold text-xl">{challenge.participants}</p>
              </div>
              
              {challenge.xpGained && (
                <div className="p-4 bg-[#1a1a2e] rounded-xl">
                  <div className="flex items-center gap-2 text-gray-400 mb-1">
                    <TrendingUp className="w-4 h-4 text-[#00ff88]" />
                    <span className="text-sm">XP Gained</span>
                  </div>
                  <p className="text-[#00ff88] font-bold text-xl">+{challenge.xpGained}</p>
                </div>
              )}
              
              {challenge.timeLimit && (
                <div className="p-4 bg-[#1a1a2e] rounded-xl">
                  <div className="flex items-center gap-2 text-gray-400 mb-1">
                    <Clock className="w-4 h-4 text-[#ff6b6b]" />
                    <span className="text-sm">Time Limit</span>
                  </div>
                  <p className="text-white font-bold text-xl">{challenge.timeLimit}</p>
                </div>
              )}
            </div>
            
            {/* Action Button */}
            {challenge.status === 'ongoing' && (
              <motion.button
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                className="w-full py-4 bg-gradient-to-r from-[#8b5cf6] to-[#00ff88] text-white font-bold rounded-xl flex items-center justify-center gap-2"
              >
                <Zap className="w-5 h-5" />
                Continue Challenge
              </motion.button>
            )}
          </div>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
}

// Filter Tabs Component
function FilterTabs({ activeFilter, onFilterChange }: { 
  activeFilter: string; 
  onFilterChange: (filter: string) => void;
}) {
  const filters = [
    { id: 'all', label: 'All', icon: Target },
    { id: 'ongoing', label: 'Ongoing', icon: Flame },
    { id: 'completed', label: 'Completed', icon: Trophy },
  ];

  return (
    <div className="flex gap-2">
      {filters.map((filter) => {
        const Icon = filter.icon;
        return (
          <motion.button
            key={filter.id}
            onClick={() => onFilterChange(filter.id)}
            className={`relative flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-medium transition-all ${
              activeFilter === filter.id
                ? 'text-[#00ff88]'
                : 'text-gray-400 hover:text-white'
            }`}
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
          >
            {activeFilter === filter.id && (
              <motion.div
                layoutId="activeFilterBg"
                className="absolute inset-0 bg-[#00ff88]/10 border border-[#00ff88]/30 rounded-xl"
                transition={{ type: 'spring', stiffness: 300, damping: 30 }}
              />
            )}
            <Icon className="w-4 h-4 relative z-10" />
            <span className="relative z-10">{filter.label}</span>
          </motion.button>
        );
      })}
    </div>
  );
}

// Main Component
export function Challenges() {
  const [activeFilter, setActiveFilter] = useState('all');
  const [selectedChallenge, setSelectedChallenge] = useState<Challenge | null>(null);

  const challenges: Challenge[] = [
    {
      id: '1',
      title: 'Algorithm Master',
      description: 'Solve 10 algorithm problems with optimal time complexity.',
      type: 'coding',
      difficulty: 'hard',
      status: 'ongoing',
      progress: 7,
      target: 10,
      reward: 500,
      participants: 1234,
      timeLimit: '48 hours',
    },
    {
      id: '2',
      title: 'Speed Demon',
      description: 'Complete 5 coding challenges in under 15 minutes each.',
      type: 'speed',
      difficulty: 'medium',
      status: 'ongoing',
      progress: 3,
      target: 5,
      reward: 300,
      participants: 856,
      timeLimit: '24 hours',
    },
    {
      id: '3',
      title: 'Quiz Champion',
      description: 'Answer 20 tech trivia questions correctly.',
      type: 'quiz',
      difficulty: 'easy',
      status: 'completed',
      progress: 20,
      target: 20,
      reward: 150,
      participants: 2341,
      xpGained: 250,
      completedAt: '2 days ago',
    },
    {
      id: '4',
      title: 'Battle Royale',
      description: 'Win 3 consecutive coding battles against other hunters.',
      type: 'battle',
      difficulty: 'extreme',
      status: 'ongoing',
      progress: 1,
      target: 3,
      reward: 1000,
      participants: 567,
      timeLimit: '72 hours',
    },
    {
      id: '5',
      title: 'Frontend Warrior',
      description: 'Build 5 UI components from scratch.',
      type: 'coding',
      difficulty: 'medium',
      status: 'completed',
      progress: 5,
      target: 5,
      reward: 400,
      participants: 1567,
      xpGained: 400,
      completedAt: '1 week ago',
    },
  ];

  const filteredChallenges = activeFilter === 'all' 
    ? challenges 
    : challenges.filter(c => c.status === activeFilter);

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
            <Trophy className="w-8 h-8 text-[#ffd700]" />
            Challenges
          </h1>
          <p className="text-gray-400">Compete, conquer, and claim your rewards</p>
        </div>
        
        <FilterTabs activeFilter={activeFilter} onFilterChange={setActiveFilter} />
      </motion.div>

      {/* Stats Banner */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1 }}
        className="grid grid-cols-2 lg:grid-cols-4 gap-4"
      >
        {[
          { icon: Trophy, label: 'Challenges Won', value: 23, color: '#ffd700' },
          { icon: Flame, label: 'Win Streak', value: 5, color: '#ff6b6b' },
          { icon: Coins, label: 'Total Earned', value: '12.5k', color: '#00ff88' },
          { icon: Award, label: 'Rank', value: '#147', color: '#8b5cf6' },
        ].map((stat, i) => (
          <motion.div
            key={i}
            whileHover={{ scale: 1.02, y: -4 }}
            className="bg-[#141420]/80 backdrop-blur-xl border border-white/10 rounded-xl p-4"
          >
            <div className="flex items-center gap-3">
              <div className="p-2 rounded-lg" style={{ backgroundColor: `${stat.color}15` }}>
                <stat.icon className="w-5 h-5" style={{ color: stat.color }} />
              </div>
              <div>
                <p className="text-gray-400 text-sm">{stat.label}</p>
                <p className="text-white font-bold text-xl">{stat.value}</p>
              </div>
            </div>
          </motion.div>
        ))}
      </motion.div>

      {/* Challenges Grid */}
      <AnimatePresence mode="wait">
        <motion.div
          key={activeFilter}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -20 }}
          className="grid grid-cols-1 lg:grid-cols-2 gap-4"
        >
          {filteredChallenges.map((challenge, index) => (
            <motion.div
              key={challenge.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
            >
              <ChallengeCard 
                challenge={challenge} 
                onClick={() => setSelectedChallenge(challenge)}
              />
            </motion.div>
          ))}
        </motion.div>
      </AnimatePresence>

      {/* Challenge Modal */}
      <ChallengeModal 
        challenge={selectedChallenge} 
        onClose={() => setSelectedChallenge(null)} 
      />
    </div>
  );
}
