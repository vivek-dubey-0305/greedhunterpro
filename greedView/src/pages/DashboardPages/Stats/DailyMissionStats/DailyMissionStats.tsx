import { useState } from 'react';
import { motion } from 'framer-motion';
import { 
  Target, 
  CheckCircle, 
  XCircle,
  Coins,
  Flame,
  TrendingUp,
  Calendar,
  Clock,
  Star,
  Zap
} from 'lucide-react';

// Stat Card Component
function StatCard({ icon: Icon, label, value, subtext, color, delay }: {
  icon: React.ElementType;
  label: string;
  value: string;
  subtext?: string;
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
      <div className="flex items-center gap-4">
        <div className="p-3 rounded-xl" style={{ backgroundColor: `${color}15` }}>
          <Icon className="w-6 h-6" style={{ color }} />
        </div>
        <div>
          <p className="text-gray-400 text-sm">{label}</p>
          <p className="text-2xl font-bold text-white">{value}</p>
          {subtext && <p className="text-xs text-gray-500">{subtext}</p>}
        </div>
      </div>
    </motion.div>
  );
}

// Line Chart Component
function LineChart({ data, color }: { data: number[]; color: string }) {
  const maxValue = Math.max(...data);
  const minValue = Math.min(...data);
  const range = maxValue - minValue;
  
  const points = data.map((value, i) => {
    const x = (i / (data.length - 1)) * 100;
    const y = 100 - ((value - minValue) / range) * 80;
    return `${x},${y}`;
  }).join(' ');

  return (
    <svg className="w-full h-40" preserveAspectRatio="none">
      {/* Grid lines */}
      {[0, 25, 50, 75, 100].map((y) => (
        <line key={y} x1="0%" y1={`${y}%`} x2="100%" y2={`${y}%`} stroke="#1a1a2e" strokeWidth="1" />
      ))}
      
      {/* Area fill */}
      <motion.polygon
        points={`0,100 ${points} 100,100`}
        fill={`${color}20`}
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 1 }}
      />
      
      {/* Line */}
      <motion.polyline
        points={points}
        fill="none"
        stroke={color}
        strokeWidth="3"
        strokeLinecap="round"
        strokeLinejoin="round"
        initial={{ pathLength: 0 }}
        animate={{ pathLength: 1 }}
        transition={{ duration: 1.5, delay: 0.2 }}
      />
      
      {/* Data points */}
      {data.map((value, i) => {
        const x = (i / (data.length - 1)) * 100;
        const y = 100 - ((value - minValue) / range) * 80;
        return (
          <motion.circle
            key={i}
            cx={`${x}%`}
            cy={`${y}%`}
            r="5"
            fill={color}
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ delay: 0.3 + i * 0.1 }}
          />
        );
      })}
    </svg>
  );
}

// Calendar Heatmap Component
function CalendarHeatmap({ data }: { data: { date: string; value: number }[] }) {
  const getColor = (value: number) => {
    if (value === 0) return '#1a1a2e';
    if (value === 1) return '#00ff8830';
    if (value === 2) return '#00ff8860';
    return '#00ff88';
  };

  return (
    <div className="grid grid-cols-7 gap-1">
      {data.map((day, i) => (
        <motion.div
          key={i}
          className="aspect-square rounded-md cursor-pointer"
          style={{ backgroundColor: getColor(day.value) }}
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          transition={{ delay: i * 0.01 }}
          whileHover={{ scale: 1.2 }}
          title={`${day.date}: ${day.value} missions`}
        />
      ))}
    </div>
  );
}

// Mission Item Component
function MissionItem({ name, completed, reward, category }: {
  name: string;
  completed: boolean;
  reward: number;
  category: string;
}) {
  return (
    <motion.div
      whileHover={{ x: 4 }}
      className="flex items-center justify-between p-4 bg-[#1a1a2e] rounded-xl"
    >
      <div className="flex items-center gap-3">
        <div className={`w-10 h-10 rounded-lg flex items-center justify-center ${
          completed ? 'bg-[#00ff88]/20' : 'bg-gray-500/20'
        }`}>
          {completed ? (
            <CheckCircle className="w-5 h-5 text-[#00ff88]" />
          ) : (
            <XCircle className="w-5 h-5 text-gray-500" />
          )}
        </div>
        <div>
          <p className="font-medium text-white">{name}</p>
          <span className="text-xs text-gray-500">{category}</span>
        </div>
      </div>
      <div className="flex items-center gap-2">
        <Coins className="w-4 h-4 text-[#ffd700]" />
        <span className={`font-bold ${completed ? 'text-[#ffd700]' : 'text-gray-500'}`}>
          {reward}
        </span>
      </div>
    </motion.div>
  );
}

// Main Component
export function DailyMissionStats() {
  const [selectedPeriod, setSelectedPeriod] = useState<'daily' | 'weekly' | 'monthly'>('weekly');

  const completionData = [85, 92, 78, 95, 88, 91, 97, 82, 89, 94, 86, 93];
  
  const calendarData = Array.from({ length: 35 }, (_, i) => ({
    date: `Day ${i + 1}`,
    value: Math.floor(Math.random() * 4),
  }));

  const todaysMissions = [
    { name: 'Complete 3 Challenges', completed: true, reward: 50, category: 'Challenges' },
    { name: 'Win 2 Consecutive Matches', completed: true, reward: 75, category: 'Streak' },
    { name: 'Earn 500 Coins', completed: false, reward: 100, category: 'Earnings' },
    { name: 'Join a Community Thread', completed: true, reward: 25, category: 'Social' },
    { name: 'Refer a Friend', completed: false, reward: 200, category: 'Referral' },
  ];

  return (
    <div className="space-y-8">
      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
      >
        <h1 className="text-3xl font-black text-white mb-2 flex items-center gap-3">
          <Target className="w-8 h-8 text-[#00ff88]" />
          Daily Mission Stats
        </h1>
        <p className="text-gray-400">Track your daily mission performance</p>
      </motion.div>

      {/* Stats Grid */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard icon={CheckCircle} label="Completed Today" value="4/5" color="#00ff88" delay={0.1} />
        <StatCard icon={Flame} label="Current Streak" value="12 days" color="#ff6b6b" delay={0.15} />
        <StatCard icon={Coins} label="Today's Earnings" value="150" subtext="+250 pending" color="#ffd700" delay={0.2} />
        <StatCard icon={Star} label="Avg. Completion" value="87%" color="#00d9ff" delay={0.25} />
      </div>

      {/* Charts */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Completion Rate */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="bg-[#141420]/80 backdrop-blur-xl border border-white/10 rounded-2xl p-5"
        >
          <div className="flex items-center justify-between mb-6">
            <h3 className="text-lg font-bold text-white">Completion Rate</h3>
            <div className="flex gap-2">
              {(['daily', 'weekly', 'monthly'] as const).map((period) => (
                <button
                  key={period}
                  onClick={() => setSelectedPeriod(period)}
                  className={`px-3 py-1 rounded-lg text-sm font-medium transition-colors ${
                    selectedPeriod === period
                      ? 'bg-[#00ff88] text-black'
                      : 'bg-[#1a1a2e] text-gray-400'
                  }`}
                >
                  {period.charAt(0).toUpperCase() + period.slice(1)}
                </button>
              ))}
            </div>
          </div>
          <LineChart data={completionData} color="#00ff88" />
          <div className="flex justify-between mt-4 text-xs text-gray-500">
            {['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'].map((month) => (
              <span key={month}>{month}</span>
            ))}
          </div>
        </motion.div>

        {/* Activity Calendar */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.35 }}
          className="bg-[#141420]/80 backdrop-blur-xl border border-white/10 rounded-2xl p-5"
        >
          <div className="flex items-center justify-between mb-6">
            <h3 className="text-lg font-bold text-white">Activity Calendar</h3>
            <span className="text-sm text-gray-400">Last 5 weeks</span>
          </div>
          <div className="flex justify-between mb-2 text-xs text-gray-500">
            {['S', 'M', 'T', 'W', 'T', 'F', 'S'].map((day) => (
              <span key={day} className="w-full text-center">{day}</span>
            ))}
          </div>
          <CalendarHeatmap data={calendarData} />
          <div className="flex items-center justify-end gap-2 mt-4 text-xs text-gray-500">
            <span>Less</span>
            {[0, 1, 2, 3].map((level) => (
              <div
                key={level}
                className="w-3 h-3 rounded"
                style={{
                  backgroundColor: level === 0 ? '#1a1a2e' : 
                                   level === 1 ? '#00ff8830' : 
                                   level === 2 ? '#00ff8860' : '#00ff88'
                }}
              />
            ))}
            <span>More</span>
          </div>
        </motion.div>
      </div>

      {/* Today's Missions */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.4 }}
        className="bg-[#141420]/80 backdrop-blur-xl border border-white/10 rounded-2xl overflow-hidden"
      >
        <div className="p-5 border-b border-white/10 flex items-center justify-between">
          <h3 className="text-lg font-bold text-white">Today's Missions</h3>
          <span className="text-sm text-[#00ff88]">4/5 Completed</span>
        </div>
        <div className="p-5 space-y-3">
          {todaysMissions.map((mission, i) => (
            <MissionItem key={i} {...mission} />
          ))}
        </div>
      </motion.div>

      {/* Insights */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.45 }}
        className="grid grid-cols-1 lg:grid-cols-3 gap-4"
      >
        <div className="bg-[#141420]/80 backdrop-blur-xl border border-white/10 rounded-2xl p-5">
          <div className="flex items-center gap-3 mb-3">
            <Zap className="w-6 h-6 text-[#ffd700]" />
            <span className="text-lg font-bold text-white">Best Day</span>
          </div>
          <p className="text-2xl font-bold text-[#ffd700]">Tuesday</p>
          <p className="text-gray-400 text-sm">96% completion rate</p>
        </div>
        <div className="bg-[#141420]/80 backdrop-blur-xl border border-white/10 rounded-2xl p-5">
          <div className="flex items-center gap-3 mb-3">
            <TrendingUp className="w-6 h-6 text-[#00ff88]" />
            <span className="text-lg font-bold text-white">Total Earned</span>
          </div>
          <p className="text-2xl font-bold text-[#00ff88]">8,450</p>
          <p className="text-gray-400 text-sm">From daily missions</p>
        </div>
        <div className="bg-[#141420]/80 backdrop-blur-xl border border-white/10 rounded-2xl p-5">
          <div className="flex items-center gap-3 mb-3">
            <Flame className="w-6 h-6 text-[#ff6b6b]" />
            <span className="text-lg font-bold text-white">Longest Streak</span>
          </div>
          <p className="text-2xl font-bold text-[#ff6b6b]">28 days</p>
          <p className="text-gray-400 text-sm">Your personal best</p>
        </div>
      </motion.div>
    </div>
  );
}
