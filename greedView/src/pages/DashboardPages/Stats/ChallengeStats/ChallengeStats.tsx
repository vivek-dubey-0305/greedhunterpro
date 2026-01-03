import { useState } from 'react';
import { motion } from 'framer-motion';
import { 
  Trophy, 
  TrendingUp, 
  Target,
  Clock,
  Coins,
  Flame,
  Award,
  Calendar,
  ChevronDown,
  Zap
} from 'lucide-react';

// Time range filter
type TimeRange = 'week' | 'month' | 'year' | 'all';

// Stat Card Component
function StatCard({ icon: Icon, label, value, change, color, delay }: {
  icon: React.ElementType;
  label: string;
  value: string;
  change?: { value: number; positive: boolean };
  color: string;
  delay: number;
}) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay }}
      whileHover={{ y: -4, scale: 1.02 }}
      className="bg-[#141420]/80 backdrop-blur-xl border border-white/10 rounded-2xl p-5"
    >
      <div className="flex items-center justify-between mb-4">
        <div className="p-3 rounded-xl" style={{ backgroundColor: `${color}15` }}>
          <Icon className="w-6 h-6" style={{ color }} />
        </div>
        {change && (
          <span className={`text-sm font-medium ${change.positive ? 'text-[#00ff88]' : 'text-red-400'}`}>
            {change.positive ? '+' : ''}{change.value}%
          </span>
        )}
      </div>
      <p className="text-gray-400 text-sm mb-1">{label}</p>
      <p className="text-2xl font-bold text-white">{value}</p>
    </motion.div>
  );
}

// Bar Chart Component
function BarChart({ data, color }: { data: { label: string; value: number }[]; color: string }) {
  const maxValue = Math.max(...data.map(d => d.value));

  return (
    <div className="flex items-end justify-between gap-2 h-40">
      {data.map((item, i) => (
        <div key={i} className="flex-1 flex flex-col items-center gap-2">
          <motion.div
            className="w-full rounded-t-lg"
            style={{ backgroundColor: color }}
            initial={{ height: 0 }}
            animate={{ height: `${(item.value / maxValue) * 100}%` }}
            transition={{ delay: 0.1 * i, duration: 0.5 }}
          />
          <span className="text-xs text-gray-500">{item.label}</span>
        </div>
      ))}
    </div>
  );
}

// Progress Ring Component
function ProgressRing({ value, label, color, size = 120 }: {
  value: number;
  label: string;
  color: string;
  size?: number;
}) {
  const radius = (size - 20) / 2;
  const circumference = radius * 2 * Math.PI;
  const offset = circumference - (value / 100) * circumference;

  return (
    <div className="flex flex-col items-center">
      <div className="relative" style={{ width: size, height: size }}>
        <svg className="w-full h-full -rotate-90">
          <circle
            cx={size / 2}
            cy={size / 2}
            r={radius}
            fill="none"
            stroke="#1a1a2e"
            strokeWidth="10"
          />
          <motion.circle
            cx={size / 2}
            cy={size / 2}
            r={radius}
            fill="none"
            stroke={color}
            strokeWidth="10"
            strokeLinecap="round"
            strokeDasharray={circumference}
            initial={{ strokeDashoffset: circumference }}
            animate={{ strokeDashoffset: offset }}
            transition={{ duration: 1, delay: 0.3 }}
          />
        </svg>
        <div className="absolute inset-0 flex items-center justify-center">
          <span className="text-2xl font-bold text-white">{value}%</span>
        </div>
      </div>
      <span className="text-gray-400 text-sm mt-2">{label}</span>
    </div>
  );
}

// Challenge Item Component
function ChallengeItem({ name, result, coins, time, rank }: {
  name: string;
  result: 'win' | 'loss';
  coins: number;
  time: string;
  rank: number;
}) {
  return (
    <motion.div
      whileHover={{ x: 4 }}
      className="flex items-center justify-between p-4 bg-[#1a1a2e] rounded-xl hover:bg-[#1a1a2e]/80 transition-colors"
    >
      <div className="flex items-center gap-3">
        <div className={`w-10 h-10 rounded-lg flex items-center justify-center ${
          result === 'win' ? 'bg-[#00ff88]/20' : 'bg-red-400/20'
        }`}>
          {result === 'win' ? (
            <Trophy className="w-5 h-5 text-[#00ff88]" />
          ) : (
            <Target className="w-5 h-5 text-red-400" />
          )}
        </div>
        <div>
          <p className="font-medium text-white">{name}</p>
          <div className="flex items-center gap-3 text-xs text-gray-500">
            <span className="flex items-center gap-1">
              <Clock className="w-3 h-3" /> {time}
            </span>
            <span>Rank #{rank}</span>
          </div>
        </div>
      </div>
      <div className={`font-bold ${result === 'win' ? 'text-[#00ff88]' : 'text-red-400'}`}>
        {result === 'win' ? '+' : ''}{coins} 🪙
      </div>
    </motion.div>
  );
}

// Main Component
export function ChallengeStats() {
  const [timeRange, setTimeRange] = useState<TimeRange>('month');

  const weeklyData = [
    { label: 'Mon', value: 3 },
    { label: 'Tue', value: 5 },
    { label: 'Wed', value: 2 },
    { label: 'Thu', value: 7 },
    { label: 'Fri', value: 4 },
    { label: 'Sat', value: 8 },
    { label: 'Sun', value: 6 },
  ];

  const recentChallenges = [
    { name: 'Speed Coding Sprint', result: 'win' as const, coins: 250, time: '4m 32s', rank: 3 },
    { name: 'Algorithm Master', result: 'win' as const, coins: 180, time: '12m 45s', rank: 8 },
    { name: 'Bug Hunt Challenge', result: 'loss' as const, coins: -50, time: '8m 20s', rank: 24 },
    { name: 'React Quiz Battle', result: 'win' as const, coins: 320, time: '6m 15s', rank: 1 },
    { name: 'CSS Showdown', result: 'loss' as const, coins: -30, time: '5m 40s', rank: 18 },
  ];

  return (
    <div className="space-y-8">
      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4"
      >
        <div>
          <h1 className="text-3xl font-black text-white mb-2 flex items-center gap-3">
            <Trophy className="w-8 h-8 text-[#ffd700]" />
            Challenge Stats
          </h1>
          <p className="text-gray-400">Track your challenge performance and progress</p>
        </div>

        {/* Time Range Filter */}
        <div className="flex gap-2">
          {(['week', 'month', 'year', 'all'] as TimeRange[]).map((range) => (
            <motion.button
              key={range}
              onClick={() => setTimeRange(range)}
              className={`px-4 py-2 rounded-xl font-medium transition-all ${
                timeRange === range
                  ? 'bg-[#ffd700] text-black'
                  : 'bg-[#1a1a2e] text-gray-400 hover:text-white'
              }`}
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
            >
              {range.charAt(0).toUpperCase() + range.slice(1)}
            </motion.button>
          ))}
        </div>
      </motion.div>

      {/* Stats Grid */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard icon={Trophy} label="Total Wins" value="89" change={{ value: 12, positive: true }} color="#ffd700" delay={0.1} />
        <StatCard icon={Target} label="Total Losses" value="23" change={{ value: 5, positive: false }} color="#ff6b6b" delay={0.15} />
        <StatCard icon={Coins} label="Coins Earned" value="12,450" change={{ value: 24, positive: true }} color="#00ff88" delay={0.2} />
        <StatCard icon={Flame} label="Win Streak" value="7" change={{ value: 3, positive: true }} color="#8b5cf6" delay={0.25} />
      </div>

      {/* Charts Row */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Weekly Performance */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="lg:col-span-2 bg-[#141420]/80 backdrop-blur-xl border border-white/10 rounded-2xl p-5"
        >
          <div className="flex items-center justify-between mb-6">
            <h3 className="text-lg font-bold text-white">Weekly Performance</h3>
            <span className="text-sm text-gray-400">Challenges per day</span>
          </div>
          <BarChart data={weeklyData} color="#ffd700" />
        </motion.div>

        {/* Win Rate */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.35 }}
          className="bg-[#141420]/80 backdrop-blur-xl border border-white/10 rounded-2xl p-5 flex flex-col items-center justify-center"
        >
          <h3 className="text-lg font-bold text-white mb-6">Win Rate</h3>
          <ProgressRing value={79} label="Overall" color="#00ff88" />
        </motion.div>
      </div>

      {/* Performance Breakdown */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.4 }}
        className="grid grid-cols-1 lg:grid-cols-3 gap-6"
      >
        <div className="bg-[#141420]/80 backdrop-blur-xl border border-white/10 rounded-2xl p-5 text-center">
          <Zap className="w-8 h-8 text-[#00d9ff] mx-auto mb-3" />
          <p className="text-3xl font-bold text-white mb-1">4m 23s</p>
          <p className="text-gray-400 text-sm">Avg. Completion Time</p>
        </div>
        <div className="bg-[#141420]/80 backdrop-blur-xl border border-white/10 rounded-2xl p-5 text-center">
          <Award className="w-8 h-8 text-[#ffd700] mx-auto mb-3" />
          <p className="text-3xl font-bold text-white mb-1">#12</p>
          <p className="text-gray-400 text-sm">Best Global Rank</p>
        </div>
        <div className="bg-[#141420]/80 backdrop-blur-xl border border-white/10 rounded-2xl p-5 text-center">
          <Calendar className="w-8 h-8 text-[#8b5cf6] mx-auto mb-3" />
          <p className="text-3xl font-bold text-white mb-1">112</p>
          <p className="text-gray-400 text-sm">Total Challenges</p>
        </div>
      </motion.div>

      {/* Recent Challenges */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.45 }}
        className="bg-[#141420]/80 backdrop-blur-xl border border-white/10 rounded-2xl overflow-hidden"
      >
        <div className="p-5 border-b border-white/10">
          <h3 className="text-lg font-bold text-white">Recent Challenges</h3>
        </div>
        <div className="p-5 space-y-3">
          {recentChallenges.map((challenge, i) => (
            <ChallengeItem key={i} {...challenge} />
          ))}
        </div>
      </motion.div>
    </div>
  );
}
