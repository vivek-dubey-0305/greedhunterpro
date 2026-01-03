import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Calendar, 
  Trophy, 
  Coins,
  Users,
  TrendingUp,
  Clock,
  Award,
  Target,
  ChevronDown,
  ChevronRight,
  Star
} from 'lucide-react';

// Event interface
interface EventData {
  id: string;
  name: string;
  date: string;
  rank: number;
  participants: number;
  coinsEarned: number;
  xpEarned: number;
  category: string;
  status: 'completed' | 'ongoing';
}

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
        <div className="flex-1">
          <p className="text-gray-400 text-sm">{label}</p>
          <p className="text-2xl font-bold text-white">{value}</p>
          {subtext && <p className="text-xs text-gray-500">{subtext}</p>}
        </div>
      </div>
    </motion.div>
  );
}

// Donut Chart Component
function DonutChart({ data }: { data: { label: string; value: number; color: string }[] }) {
  const total = data.reduce((sum, item) => sum + item.value, 0);
  let currentAngle = 0;

  return (
    <div className="relative w-48 h-48 mx-auto">
      <svg className="w-full h-full -rotate-90">
        {data.map((item, i) => {
          const angle = (item.value / total) * 360;
          const startAngle = currentAngle;
          currentAngle += angle;
          
          const r = 70;
          const circumference = 2 * Math.PI * r;
          const strokeDasharray = (angle / 360) * circumference;
          const strokeDashoffset = -(startAngle / 360) * circumference;

          return (
            <motion.circle
              key={i}
              cx="96"
              cy="96"
              r={r}
              fill="none"
              stroke={item.color}
              strokeWidth="24"
              strokeLinecap="round"
              strokeDasharray={`${strokeDasharray} ${circumference}`}
              strokeDashoffset={strokeDashoffset}
              initial={{ opacity: 0, pathLength: 0 }}
              animate={{ opacity: 1, pathLength: 1 }}
              transition={{ delay: 0.3 + i * 0.1, duration: 0.5 }}
            />
          );
        })}
      </svg>
      <div className="absolute inset-0 flex flex-col items-center justify-center">
        <span className="text-3xl font-bold text-white">{total}</span>
        <span className="text-gray-400 text-sm">Events</span>
      </div>
    </div>
  );
}

// Event Row Component
function EventRow({ event, expanded, onToggle }: {
  event: EventData;
  expanded: boolean;
  onToggle: () => void;
}) {
  const getRankColor = (rank: number) => {
    if (rank === 1) return '#ffd700';
    if (rank === 2) return '#c0c0c0';
    if (rank === 3) return '#cd7f32';
    return '#8b5cf6';
  };

  return (
    <motion.div
      initial={{ opacity: 0, x: -20 }}
      animate={{ opacity: 1, x: 0 }}
      className="border-b border-white/5 last:border-0"
    >
      <motion.div
        className="flex items-center justify-between p-4 cursor-pointer hover:bg-[#1a1a2e]/50 transition-colors"
        onClick={onToggle}
        whileHover={{ x: 4 }}
      >
        <div className="flex items-center gap-4">
          <div className="w-12 h-12 rounded-xl bg-[#1a1a2e] flex items-center justify-center">
            <Calendar className="w-6 h-6 text-[#00d9ff]" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h4 className="font-semibold text-white">{event.name}</h4>
              {event.rank <= 3 && (
                <Star className="w-4 h-4" style={{ color: getRankColor(event.rank) }} />
              )}
            </div>
            <div className="flex items-center gap-3 text-xs text-gray-500">
              <span>{event.date}</span>
              <span className="flex items-center gap-1">
                <Users className="w-3 h-3" /> {event.participants}
              </span>
            </div>
          </div>
        </div>

        <div className="flex items-center gap-6">
          <div className="text-right hidden md:block">
            <span 
              className="px-3 py-1 rounded-full text-sm font-bold"
              style={{ 
                backgroundColor: `${getRankColor(event.rank)}20`,
                color: getRankColor(event.rank)
              }}
            >
              #{event.rank}
            </span>
          </div>
          <div className="text-right">
            <p className="text-[#ffd700] font-bold">+{event.coinsEarned}</p>
            <p className="text-xs text-gray-500">coins</p>
          </div>
          <motion.div
            animate={{ rotate: expanded ? 180 : 0 }}
            className="text-gray-500"
          >
            <ChevronDown className="w-5 h-5" />
          </motion.div>
        </div>
      </motion.div>

      <AnimatePresence>
        {expanded && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            className="overflow-hidden"
          >
            <div className="p-4 pt-0 pl-20">
              <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 p-4 bg-[#1a1a2e] rounded-xl">
                <div>
                  <p className="text-gray-400 text-xs mb-1">Rank</p>
                  <p className="font-bold text-white">#{event.rank} of {event.participants}</p>
                </div>
                <div>
                  <p className="text-gray-400 text-xs mb-1">Coins Earned</p>
                  <p className="font-bold text-[#ffd700]">{event.coinsEarned}</p>
                </div>
                <div>
                  <p className="text-gray-400 text-xs mb-1">XP Earned</p>
                  <p className="font-bold text-[#00ff88]">{event.xpEarned}</p>
                </div>
                <div>
                  <p className="text-gray-400 text-xs mb-1">Category</p>
                  <p className="font-bold text-[#00d9ff]">{event.category}</p>
                </div>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
}

// Main Component
export function EventStats() {
  const [expandedEvent, setExpandedEvent] = useState<string | null>(null);
  const [categoryFilter, setCategoryFilter] = useState<string>('all');

  const events: EventData[] = [
    { id: '1', name: 'Quantum Surge 2024', date: 'Dec 15, 2024', rank: 1, participants: 256, coinsEarned: 1500, xpEarned: 2500, category: 'Coding', status: 'completed' },
    { id: '2', name: 'Code Warriors League', date: 'Dec 10, 2024', rank: 8, participants: 512, coinsEarned: 450, xpEarned: 1200, category: 'Competition', status: 'completed' },
    { id: '3', name: 'Algorithm Challenge', date: 'Dec 5, 2024', rank: 3, participants: 128, coinsEarned: 800, xpEarned: 1800, category: 'Algorithms', status: 'completed' },
    { id: '4', name: 'React Hackathon', date: 'Nov 28, 2024', rank: 12, participants: 384, coinsEarned: 320, xpEarned: 950, category: 'Hackathon', status: 'completed' },
    { id: '5', name: 'Bug Hunt Championship', date: 'Nov 20, 2024', rank: 2, participants: 200, coinsEarned: 950, xpEarned: 2100, category: 'Debugging', status: 'completed' },
  ];

  const categoryData = [
    { label: 'Coding', value: 12, color: '#00ff88' },
    { label: 'Competition', value: 8, color: '#00d9ff' },
    { label: 'Hackathon', value: 5, color: '#8b5cf6' },
    { label: 'Other', value: 7, color: '#ffd700' },
  ];

  const categories = ['all', 'Coding', 'Competition', 'Algorithms', 'Hackathon', 'Debugging'];

  const filteredEvents = categoryFilter === 'all' 
    ? events 
    : events.filter(e => e.category === categoryFilter);

  return (
    <div className="space-y-8">
      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
      >
        <h1 className="text-3xl font-black text-white mb-2 flex items-center gap-3">
          <Calendar className="w-8 h-8 text-[#00d9ff]" />
          Event Stats
        </h1>
        <p className="text-gray-400">Your event participation and performance analytics</p>
      </motion.div>

      {/* Stats Grid */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard icon={Calendar} label="Events Attended" value="32" color="#00d9ff" delay={0.1} />
        <StatCard icon={Trophy} label="Top 3 Finishes" value="8" color="#ffd700" delay={0.15} />
        <StatCard icon={Coins} label="Total Earned" value="12,450" color="#00ff88" delay={0.2} />
        <StatCard icon={TrendingUp} label="Avg. Rank" value="#15" color="#8b5cf6" delay={0.25} />
      </div>

      {/* Charts Row */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Category Breakdown */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="bg-[#141420]/80 backdrop-blur-xl border border-white/10 rounded-2xl p-5"
        >
          <h3 className="text-lg font-bold text-white mb-6">Events by Category</h3>
          <DonutChart data={categoryData} />
          <div className="grid grid-cols-2 gap-2 mt-6">
            {categoryData.map((item, i) => (
              <div key={i} className="flex items-center gap-2">
                <div className="w-3 h-3 rounded-full" style={{ backgroundColor: item.color }} />
                <span className="text-gray-400 text-sm">{item.label}</span>
                <span className="text-white font-bold ml-auto">{item.value}</span>
              </div>
            ))}
          </div>
        </motion.div>

        {/* Performance Summary */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.35 }}
          className="bg-[#141420]/80 backdrop-blur-xl border border-white/10 rounded-2xl p-5"
        >
          <h3 className="text-lg font-bold text-white mb-6">Performance Summary</h3>
          <div className="space-y-4">
            <div className="p-4 bg-[#1a1a2e] rounded-xl">
              <div className="flex items-center justify-between mb-2">
                <span className="text-gray-400">Win Rate</span>
                <span className="text-[#00ff88] font-bold">78%</span>
              </div>
              <div className="h-2 bg-[#141420] rounded-full overflow-hidden">
                <motion.div
                  className="h-full bg-[#00ff88] rounded-full"
                  initial={{ width: 0 }}
                  animate={{ width: '78%' }}
                  transition={{ duration: 1, delay: 0.4 }}
                />
              </div>
            </div>
            <div className="p-4 bg-[#1a1a2e] rounded-xl">
              <div className="flex items-center justify-between mb-2">
                <span className="text-gray-400">Completion Rate</span>
                <span className="text-[#00d9ff] font-bold">92%</span>
              </div>
              <div className="h-2 bg-[#141420] rounded-full overflow-hidden">
                <motion.div
                  className="h-full bg-[#00d9ff] rounded-full"
                  initial={{ width: 0 }}
                  animate={{ width: '92%' }}
                  transition={{ duration: 1, delay: 0.5 }}
                />
              </div>
            </div>
            <div className="p-4 bg-[#1a1a2e] rounded-xl">
              <div className="flex items-center justify-between mb-2">
                <span className="text-gray-400">Top 10 Finishes</span>
                <span className="text-[#ffd700] font-bold">65%</span>
              </div>
              <div className="h-2 bg-[#141420] rounded-full overflow-hidden">
                <motion.div
                  className="h-full bg-[#ffd700] rounded-full"
                  initial={{ width: 0 }}
                  animate={{ width: '65%' }}
                  transition={{ duration: 1, delay: 0.6 }}
                />
              </div>
            </div>
          </div>
        </motion.div>
      </div>

      {/* Event History */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.4 }}
        className="bg-[#141420]/80 backdrop-blur-xl border border-white/10 rounded-2xl overflow-hidden"
      >
        <div className="p-5 border-b border-white/10 flex flex-col lg:flex-row lg:items-center justify-between gap-4">
          <h3 className="text-lg font-bold text-white">Event History</h3>
          <div className="flex gap-2 overflow-x-auto pb-2 lg:pb-0">
            {categories.map((cat) => (
              <button
                key={cat}
                onClick={() => setCategoryFilter(cat)}
                className={`px-3 py-1 rounded-lg text-sm font-medium whitespace-nowrap transition-colors ${
                  categoryFilter === cat
                    ? 'bg-[#00d9ff] text-black'
                    : 'bg-[#1a1a2e] text-gray-400 hover:text-white'
                }`}
              >
                {cat === 'all' ? 'All' : cat}
              </button>
            ))}
          </div>
        </div>
        <div>
          {filteredEvents.map((event) => (
            <EventRow
              key={event.id}
              event={event}
              expanded={expandedEvent === event.id}
              onToggle={() => setExpandedEvent(expandedEvent === event.id ? null : event.id)}
            />
          ))}
        </div>
      </motion.div>
    </div>
  );
}
