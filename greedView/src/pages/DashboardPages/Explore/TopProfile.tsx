import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Crown, 
  Trophy, 
  Medal, 
  Star,
  Coins,
  TrendingUp,
  Target,
  Flame,
  Calendar,
  Award,
  Zap,
  ChevronRight,
  Sparkles
} from 'lucide-react';

// Top User interface
interface TopUser {
  id: string;
  rank: number;
  name: string;
  username: string;
  level: number;
  coins: number;
  xp: number;
  challengesWon: number;
  eventsAttended: number;
  winStreak: number;
  achievements: string[];
  change: 'up' | 'down' | 'same';
  changeAmount?: number;
}

// Rank Icon Component
function RankIcon({ rank }: { rank: number }) {
  if (rank === 1) {
    return (
      <motion.div
        className="w-14 h-14 rounded-2xl bg-gradient-to-br from-[#ffd700] to-[#ff9500] flex items-center justify-center shadow-lg"
        animate={{ 
          scale: [1, 1.05, 1],
          boxShadow: ['0 0 20px #ffd70050', '0 0 40px #ffd70070', '0 0 20px #ffd70050']
        }}
        transition={{ duration: 2, repeat: Infinity }}
      >
        <Crown className="w-8 h-8 text-white drop-shadow" />
      </motion.div>
    );
  }
  if (rank === 2) {
    return (
      <motion.div
        className="w-12 h-12 rounded-xl bg-gradient-to-br from-[#c0c0c0] to-[#8a8a8a] flex items-center justify-center"
        animate={{ scale: [1, 1.03, 1] }}
        transition={{ duration: 2, repeat: Infinity, delay: 0.3 }}
      >
        <Trophy className="w-6 h-6 text-white" />
      </motion.div>
    );
  }
  if (rank === 3) {
    return (
      <motion.div
        className="w-12 h-12 rounded-xl bg-gradient-to-br from-[#cd7f32] to-[#8b4513] flex items-center justify-center"
        animate={{ scale: [1, 1.03, 1] }}
        transition={{ duration: 2, repeat: Infinity, delay: 0.6 }}
      >
        <Medal className="w-6 h-6 text-white" />
      </motion.div>
    );
  }
  return (
    <div className="w-12 h-12 rounded-xl bg-[#1a1a2e] flex items-center justify-center">
      <span className="text-xl font-black text-gray-400">#{rank}</span>
    </div>
  );
}

// Podium Component
function Podium({ users }: { users: TopUser[] }) {
  const [first, second, third] = users;

  return (
    <motion.div
      initial={{ opacity: 0, y: 40 }}
      animate={{ opacity: 1, y: 0 }}
      className="relative py-8"
    >
      {/* Sparkles Background */}
      <motion.div
        className="absolute inset-0 overflow-hidden pointer-events-none"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
      >
        {[...Array(20)].map((_, i) => (
          <motion.div
            key={i}
            className="absolute w-1 h-1 bg-[#ffd700] rounded-full"
            style={{
              left: `${Math.random() * 100}%`,
              top: `${Math.random() * 100}%`,
            }}
            animate={{
              scale: [0, 1, 0],
              opacity: [0, 1, 0],
            }}
            transition={{
              duration: 2,
              repeat: Infinity,
              delay: Math.random() * 2,
            }}
          />
        ))}
      </motion.div>

      <div className="flex items-end justify-center gap-4 lg:gap-8">
        {/* Second Place */}
        <motion.div
          initial={{ opacity: 0, y: 60, x: -30 }}
          animate={{ opacity: 1, y: 0, x: 0 }}
          transition={{ delay: 0.3 }}
          className="relative"
        >
          <div className="relative">
            <motion.div
              className="w-20 h-20 lg:w-28 lg:h-28 rounded-2xl bg-gradient-to-br from-[#c0c0c0] to-[#8a8a8a] p-1"
              animate={{ y: [0, -5, 0] }}
              transition={{ duration: 3, repeat: Infinity, delay: 0.5 }}
            >
              <div className="w-full h-full rounded-2xl bg-[#141420] flex items-center justify-center">
                <span className="text-3xl lg:text-4xl font-black text-white">{second?.name.charAt(0)}</span>
              </div>
            </motion.div>
            <div className="absolute -bottom-3 left-1/2 -translate-x-1/2 bg-gradient-to-br from-[#c0c0c0] to-[#8a8a8a] px-4 py-1 rounded-full shadow-lg">
              <span className="text-black font-bold text-sm">2nd</span>
            </div>
          </div>
          <div className="text-center mt-6">
            <p className="font-bold text-white text-sm lg:text-base">{second?.name}</p>
            <p className="text-[#ffd700] font-bold text-sm">{second?.coins.toLocaleString()} 🪙</p>
          </div>
          {/* Podium */}
          <motion.div
            className="w-24 lg:w-32 h-20 lg:h-28 mx-auto mt-4 bg-gradient-to-t from-[#c0c0c0]/30 to-[#c0c0c0]/10 rounded-t-xl border border-[#c0c0c0]/20"
            initial={{ height: 0 }}
            animate={{ height: 112 }}
            transition={{ delay: 0.4, duration: 0.5 }}
          />
        </motion.div>

        {/* First Place */}
        <motion.div
          initial={{ opacity: 0, y: 60 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="relative -mt-8"
        >
          <div className="relative">
            <motion.div
              className="absolute -inset-4 bg-gradient-to-r from-[#ffd700]/30 via-[#ff9500]/20 to-[#ffd700]/30 rounded-3xl blur-xl"
              animate={{ opacity: [0.5, 0.8, 0.5] }}
              transition={{ duration: 2, repeat: Infinity }}
            />
            <motion.div
              className="relative w-28 h-28 lg:w-36 lg:h-36 rounded-3xl bg-gradient-to-br from-[#ffd700] to-[#ff9500] p-1"
              animate={{ 
                y: [0, -8, 0],
                boxShadow: ['0 0 40px #ffd70040', '0 0 60px #ffd70060', '0 0 40px #ffd70040']
              }}
              transition={{ duration: 3, repeat: Infinity }}
            >
              <div className="w-full h-full rounded-3xl bg-[#141420] flex items-center justify-center">
                <span className="text-4xl lg:text-5xl font-black text-white">{first?.name.charAt(0)}</span>
              </div>
            </motion.div>
            <motion.div
              className="absolute -top-5 left-1/2 -translate-x-1/2"
              animate={{ rotate: [-5, 5, -5], y: [0, -3, 0] }}
              transition={{ duration: 2, repeat: Infinity }}
            >
              <Crown className="w-10 h-10 text-[#ffd700] drop-shadow-lg" />
            </motion.div>
            <div className="absolute -bottom-3 left-1/2 -translate-x-1/2 bg-gradient-to-br from-[#ffd700] to-[#ff9500] px-5 py-1.5 rounded-full shadow-lg">
              <span className="text-black font-bold">1st</span>
            </div>
          </div>
          <div className="text-center mt-6">
            <p className="font-bold text-white text-lg">{first?.name}</p>
            <p className="text-[#ffd700] font-bold">{first?.coins.toLocaleString()} 🪙</p>
          </div>
          {/* Podium */}
          <motion.div
            className="w-28 lg:w-40 h-28 lg:h-40 mx-auto mt-4 bg-gradient-to-t from-[#ffd700]/30 to-[#ffd700]/10 rounded-t-xl border border-[#ffd700]/20"
            initial={{ height: 0 }}
            animate={{ height: 160 }}
            transition={{ delay: 0.2, duration: 0.5 }}
          />
        </motion.div>

        {/* Third Place */}
        <motion.div
          initial={{ opacity: 0, y: 60, x: 30 }}
          animate={{ opacity: 1, y: 0, x: 0 }}
          transition={{ delay: 0.5 }}
          className="relative"
        >
          <div className="relative">
            <motion.div
              className="w-20 h-20 lg:w-28 lg:h-28 rounded-2xl bg-gradient-to-br from-[#cd7f32] to-[#8b4513] p-1"
              animate={{ y: [0, -5, 0] }}
              transition={{ duration: 3, repeat: Infinity, delay: 1 }}
            >
              <div className="w-full h-full rounded-2xl bg-[#141420] flex items-center justify-center">
                <span className="text-3xl lg:text-4xl font-black text-white">{third?.name.charAt(0)}</span>
              </div>
            </motion.div>
            <div className="absolute -bottom-3 left-1/2 -translate-x-1/2 bg-gradient-to-br from-[#cd7f32] to-[#8b4513] px-4 py-1 rounded-full shadow-lg">
              <span className="text-white font-bold text-sm">3rd</span>
            </div>
          </div>
          <div className="text-center mt-6">
            <p className="font-bold text-white text-sm lg:text-base">{third?.name}</p>
            <p className="text-[#ffd700] font-bold text-sm">{third?.coins.toLocaleString()} 🪙</p>
          </div>
          {/* Podium */}
          <motion.div
            className="w-24 lg:w-32 h-16 lg:h-20 mx-auto mt-4 bg-gradient-to-t from-[#cd7f32]/30 to-[#cd7f32]/10 rounded-t-xl border border-[#cd7f32]/20"
            initial={{ height: 0 }}
            animate={{ height: 80 }}
            transition={{ delay: 0.6, duration: 0.5 }}
          />
        </motion.div>
      </div>
    </motion.div>
  );
}

// Leaderboard Row Component
function LeaderboardRow({ user, index }: { user: TopUser; index: number }) {
  const isTop3 = user.rank <= 3;

  return (
    <motion.div
      initial={{ opacity: 0, x: -20 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ delay: index * 0.05 }}
      whileHover={{ x: 4, backgroundColor: 'rgba(0, 255, 136, 0.05)' }}
      className={`relative flex items-center gap-4 p-4 rounded-xl transition-all cursor-pointer ${
        isTop3 ? 'bg-[#1a1a2e]/80' : 'hover:bg-[#1a1a2e]/50'
      }`}
    >
      {/* Rank */}
      <RankIcon rank={user.rank} />

      {/* Avatar */}
      <div className="relative">
        <motion.div
          className={`w-12 h-12 rounded-xl p-0.5 ${
            isTop3
              ? 'bg-gradient-to-br from-[#8b5cf6] to-[#00ff88]'
              : 'bg-white/10'
          }`}
          whileHover={{ rotate: 5 }}
        >
          <div className="w-full h-full rounded-xl bg-[#141420] flex items-center justify-center">
            <span className="font-bold text-white">{user.name.charAt(0)}</span>
          </div>
        </motion.div>
        <div className={`absolute -bottom-1 -right-1 w-5 h-5 rounded-full flex items-center justify-center text-xs font-bold ${
          user.change === 'up' ? 'bg-green-500 text-white' :
          user.change === 'down' ? 'bg-red-500 text-white' :
          'bg-gray-500 text-white'
        }`}>
          {user.change === 'up' ? '↑' : user.change === 'down' ? '↓' : '–'}
        </div>
      </div>

      {/* Info */}
      <div className="flex-1 min-w-0">
        <div className="flex items-center gap-2">
          <h3 className="font-bold text-white truncate">{user.name}</h3>
          <span className="text-xs text-[#00ff88]">Lv.{user.level}</span>
        </div>
        <p className="text-gray-500 text-sm">@{user.username}</p>
      </div>

      {/* Stats */}
      <div className="hidden lg:flex items-center gap-6">
        <div className="text-center">
          <p className="text-[#ffd700] font-bold">{user.coins.toLocaleString()}</p>
          <p className="text-gray-500 text-xs">Coins</p>
        </div>
        <div className="text-center">
          <p className="text-[#00ff88] font-bold">{user.challengesWon}</p>
          <p className="text-gray-500 text-xs">Wins</p>
        </div>
        <div className="text-center">
          <p className="text-[#ff6b6b] font-bold flex items-center gap-1">
            <Flame className="w-4 h-4" /> {user.winStreak}
          </p>
          <p className="text-gray-500 text-xs">Streak</p>
        </div>
      </div>

      {/* Achievements */}
      <div className="hidden md:flex items-center gap-1">
        {user.achievements.slice(0, 3).map((badge, i) => (
          <span key={i} className="text-lg">{badge}</span>
        ))}
        {user.achievements.length > 3 && (
          <span className="text-xs text-gray-500">+{user.achievements.length - 3}</span>
        )}
      </div>

      <ChevronRight className="w-5 h-5 text-gray-500" />
    </motion.div>
  );
}

// Main Component
export function TopProfile() {
  const [timeFilter, setTimeFilter] = useState<'all' | 'month' | 'week'>('all');

  const topUsers: TopUser[] = [
    { id: '1', rank: 1, name: 'CryptoKing', username: 'cryptoking', level: 67, coins: 156780, xp: 892000, challengesWon: 312, eventsAttended: 145, winStreak: 24, achievements: ['👑', '🏆', '⚡', '💎', '🔥', '🎯'], change: 'same' },
    { id: '2', rank: 2, name: 'CodeMaster', username: 'codemaster', level: 62, coins: 134500, xp: 780000, challengesWon: 287, eventsAttended: 128, winStreak: 18, achievements: ['🏆', '⚡', '💎', '🔥'], change: 'up', changeAmount: 1 },
    { id: '3', rank: 3, name: 'DevNinja', username: 'devninja', level: 58, coins: 118200, xp: 720000, challengesWon: 256, eventsAttended: 115, winStreak: 15, achievements: ['🏆', '💎', '🔥'], change: 'down', changeAmount: 1 },
    { id: '4', rank: 4, name: 'PixelHunter', username: 'pixelhunter', level: 55, coins: 98400, xp: 650000, challengesWon: 224, eventsAttended: 98, winStreak: 12, achievements: ['⚡', '🔥'], change: 'up', changeAmount: 2 },
    { id: '5', rank: 5, name: 'ByteWarrior', username: 'bytewarrior', level: 52, coins: 87600, xp: 580000, challengesWon: 198, eventsAttended: 87, winStreak: 8, achievements: ['💎', '🎯'], change: 'same' },
    { id: '6', rank: 6, name: 'AlgoQueen', username: 'algoqueen', level: 50, coins: 76300, xp: 520000, challengesWon: 176, eventsAttended: 76, winStreak: 6, achievements: ['🔥', '⚡'], change: 'up', changeAmount: 3 },
    { id: '7', rank: 7, name: 'DataDragon', username: 'datadragon', level: 48, coins: 68900, xp: 480000, challengesWon: 165, eventsAttended: 72, winStreak: 5, achievements: ['🎯'], change: 'down', changeAmount: 1 },
    { id: '8', rank: 8, name: 'StackOverflow', username: 'stackoverflow', level: 46, coins: 61200, xp: 440000, challengesWon: 154, eventsAttended: 68, winStreak: 4, achievements: ['⚡', '🔥'], change: 'same' },
  ];

  const timeFilters = [
    { id: 'all', label: 'All Time' },
    { id: 'month', label: 'This Month' },
    { id: 'week', label: 'This Week' },
  ];

  return (
    <div className="space-y-8">
      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="text-center"
      >
        <motion.div
          className="inline-flex items-center gap-3 px-6 py-2 bg-[#ffd700]/10 border border-[#ffd700]/30 rounded-full mb-6"
          animate={{ 
            boxShadow: ['0 0 20px #ffd70020', '0 0 40px #ffd70040', '0 0 20px #ffd70020']
          }}
          transition={{ duration: 2, repeat: Infinity }}
        >
          <Sparkles className="w-5 h-5 text-[#ffd700]" />
          <span className="text-[#ffd700] font-bold">Global Leaderboard</span>
          <Sparkles className="w-5 h-5 text-[#ffd700]" />
        </motion.div>

        <h1 className="text-4xl lg:text-5xl font-black text-white mb-3">
          Top <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#ffd700] to-[#ff9500]">Hunters</span>
        </h1>
        <p className="text-gray-400 max-w-md mx-auto">
          The elite warriors who dominate the arena. Will you rise to the top?
        </p>
      </motion.div>

      {/* Podium */}
      <Podium users={topUsers.slice(0, 3)} />

      {/* Time Filters */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="flex justify-center gap-2"
      >
        {timeFilters.map((filter) => (
          <motion.button
            key={filter.id}
            onClick={() => setTimeFilter(filter.id as 'all' | 'month' | 'week')}
            className={`px-6 py-2 rounded-xl font-medium transition-all ${
              timeFilter === filter.id
                ? 'bg-[#00ff88] text-black'
                : 'bg-[#1a1a2e] text-gray-400 hover:text-white'
            }`}
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
          >
            {filter.label}
          </motion.button>
        ))}
      </motion.div>

      {/* Stats Summary */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2 }}
        className="grid grid-cols-2 lg:grid-cols-4 gap-4"
      >
        {[
          { icon: Trophy, label: 'Your Rank', value: '#247', color: '#ffd700' },
          { icon: Target, label: 'Your Score', value: '12,450', color: '#00ff88' },
          { icon: Flame, label: 'Win Streak', value: '5', color: '#ff6b6b' },
          { icon: TrendingUp, label: 'Rank Change', value: '+12', color: '#00d9ff' },
        ].map((stat, i) => (
          <motion.div
            key={i}
            whileHover={{ scale: 1.02, y: -4 }}
            className="bg-[#141420]/80 backdrop-blur-xl border border-white/10 rounded-xl p-5 text-center"
          >
            <div className="w-12 h-12 mx-auto mb-3 rounded-xl flex items-center justify-center" style={{ backgroundColor: `${stat.color}15` }}>
              <stat.icon className="w-6 h-6" style={{ color: stat.color }} />
            </div>
            <p className="text-2xl font-bold text-white">{stat.value}</p>
            <p className="text-gray-500 text-sm">{stat.label}</p>
          </motion.div>
        ))}
      </motion.div>

      {/* Leaderboard */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.3 }}
        className="bg-[#141420]/80 backdrop-blur-xl border border-white/10 rounded-2xl overflow-hidden"
      >
        <div className="p-5 border-b border-white/10">
          <h3 className="text-xl font-bold text-white flex items-center gap-2">
            <Award className="w-6 h-6 text-[#ffd700]" />
            Full Rankings
          </h3>
        </div>
        <div className="divide-y divide-white/5">
          {topUsers.map((user, index) => (
            <LeaderboardRow key={user.id} user={user} index={index} />
          ))}
        </div>
      </motion.div>
    </div>
  );
}
