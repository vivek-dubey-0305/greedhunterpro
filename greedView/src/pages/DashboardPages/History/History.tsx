import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  History as HistoryIcon,
  Calendar,
  Trophy,
  Coins,
  User,
  MessageSquare,
  Shield,
  CreditCard,
  Search,
  Filter,
  ChevronDown,
  Clock,
  CheckCircle,
  XCircle,
  AlertCircle,
  LogIn,
  LogOut,
  Award,
  Target,
  Zap
} from 'lucide-react';

// Activity types
type ActivityType = 'all' | 'events' | 'auth' | 'profile' | 'chat' | 'payments' | 'challenges';

// Activity interface
interface Activity {
  id: string;
  type: ActivityType;
  title: string;
  description: string;
  timestamp: string;
  date: string;
  status: 'success' | 'pending' | 'failed' | 'info';
  icon: React.ElementType;
  iconColor: string;
  details?: string;
  amount?: string;
}

// Category Tab Component
function CategoryTab({ category, icon: Icon, active, onClick, count }: {
  category: string;
  icon: React.ElementType;
  active: boolean;
  onClick: () => void;
  count?: number;
}) {
  return (
    <motion.button
      onClick={onClick}
      className={`flex items-center gap-2 px-4 py-2.5 rounded-xl font-medium transition-all whitespace-nowrap ${
        active
          ? 'bg-[#00ff88] text-black'
          : 'bg-[#1a1a2e] text-gray-400 hover:text-white hover:bg-[#1a1a2e]/80'
      }`}
      whileHover={{ scale: 1.02 }}
      whileTap={{ scale: 0.98 }}
    >
      <Icon className="w-4 h-4" />
      <span>{category}</span>
      {count !== undefined && count > 0 && (
        <span className={`px-2 py-0.5 rounded-full text-xs ${
          active ? 'bg-black/20' : 'bg-white/10'
        }`}>
          {count}
        </span>
      )}
    </motion.button>
  );
}

// Status Badge Component
function StatusBadge({ status }: { status: Activity['status'] }) {
  const config = {
    success: { icon: CheckCircle, label: 'Success', color: '#00ff88' },
    pending: { icon: Clock, label: 'Pending', color: '#ffd700' },
    failed: { icon: XCircle, label: 'Failed', color: '#ff6b6b' },
    info: { icon: AlertCircle, label: 'Info', color: '#00d9ff' },
  };

  const { icon: Icon, label, color } = config[status];

  return (
    <span
      className="flex items-center gap-1 px-2 py-1 rounded-lg text-xs font-medium"
      style={{ backgroundColor: `${color}15`, color }}
    >
      <Icon className="w-3 h-3" />
      {label}
    </span>
  );
}

// Activity Card Component
function ActivityCard({ activity, index }: { activity: Activity; index: number }) {
  const [expanded, setExpanded] = useState(false);
  const Icon = activity.icon;

  return (
    <motion.div
      initial={{ opacity: 0, x: -20 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ delay: index * 0.05 }}
      className="relative group"
    >
      {/* Timeline connector */}
      <div className="absolute left-6 top-16 bottom-0 w-px bg-gradient-to-b from-white/10 to-transparent group-last:hidden" />

      <motion.div
        className="relative bg-[#141420]/80 backdrop-blur-xl border border-white/10 rounded-xl p-4 hover:border-white/20 transition-all cursor-pointer"
        onClick={() => setExpanded(!expanded)}
        whileHover={{ x: 4 }}
      >
        <div className="flex items-start gap-4">
          {/* Icon */}
          <motion.div
            className="relative flex-shrink-0"
            whileHover={{ rotate: [0, -10, 10, 0] }}
            transition={{ duration: 0.4 }}
          >
            <div
              className="w-12 h-12 rounded-xl flex items-center justify-center"
              style={{ backgroundColor: `${activity.iconColor}15` }}
            >
              <Icon className="w-6 h-6" style={{ color: activity.iconColor }} />
            </div>
            {/* Status indicator */}
            <motion.div
              className="absolute -bottom-1 -right-1 w-4 h-4 rounded-full border-2 border-[#141420]"
              style={{ backgroundColor: activity.status === 'success' ? '#00ff88' : activity.status === 'failed' ? '#ff6b6b' : activity.status === 'pending' ? '#ffd700' : '#00d9ff' }}
              animate={{ scale: activity.status === 'pending' ? [1, 1.2, 1] : 1 }}
              transition={{ duration: 1.5, repeat: activity.status === 'pending' ? Infinity : 0 }}
            />
          </motion.div>

          {/* Content */}
          <div className="flex-1 min-w-0">
            <div className="flex items-start justify-between gap-4 mb-1">
              <h3 className="font-semibold text-white">{activity.title}</h3>
              <StatusBadge status={activity.status} />
            </div>
            <p className="text-gray-400 text-sm mb-2">{activity.description}</p>
            
            <div className="flex items-center gap-4 text-xs text-gray-500">
              <span className="flex items-center gap-1">
                <Calendar className="w-3 h-3" />
                {activity.date}
              </span>
              <span className="flex items-center gap-1">
                <Clock className="w-3 h-3" />
                {activity.timestamp}
              </span>
              {activity.amount && (
                <span className="flex items-center gap-1 text-[#ffd700]">
                  <Coins className="w-3 h-3" />
                  {activity.amount}
                </span>
              )}
            </div>

            {/* Expanded details */}
            <AnimatePresence>
              {expanded && activity.details && (
                <motion.div
                  initial={{ opacity: 0, height: 0 }}
                  animate={{ opacity: 1, height: 'auto' }}
                  exit={{ opacity: 0, height: 0 }}
                  className="mt-3 pt-3 border-t border-white/10"
                >
                  <p className="text-gray-300 text-sm">{activity.details}</p>
                </motion.div>
              )}
            </AnimatePresence>
          </div>

          {/* Expand indicator */}
          {activity.details && (
            <motion.div
              animate={{ rotate: expanded ? 180 : 0 }}
              className="text-gray-500"
            >
              <ChevronDown className="w-5 h-5" />
            </motion.div>
          )}
        </div>
      </motion.div>
    </motion.div>
  );
}

// Main Component
export function History() {
  const [activeCategory, setActiveCategory] = useState<ActivityType>('all');
  const [searchQuery, setSearchQuery] = useState('');

  const categories = [
    { id: 'all', label: 'All Activity', icon: HistoryIcon, count: 156 },
    { id: 'events', label: 'Events', icon: Calendar, count: 45 },
    { id: 'challenges', label: 'Challenges', icon: Trophy, count: 32 },
    { id: 'payments', label: 'Payments', icon: CreditCard, count: 28 },
    { id: 'auth', label: 'Auth', icon: Shield, count: 18 },
    { id: 'profile', label: 'Profile', icon: User, count: 12 },
    { id: 'chat', label: 'Chat', icon: MessageSquare, count: 21 },
  ];

  const activities: Activity[] = [
    { id: '1', type: 'challenges', title: 'Challenge Completed', description: 'You completed the "Speed Coding" challenge', timestamp: '2:45 PM', date: 'Today', status: 'success', icon: Trophy, iconColor: '#ffd700', amount: '+250 coins', details: 'Ranked #12 out of 156 participants. Time: 4m 32s' },
    { id: '2', type: 'payments', title: 'Coins Received', description: 'Daily mission reward credited', timestamp: '1:30 PM', date: 'Today', status: 'success', icon: Coins, iconColor: '#00ff88', amount: '+100 coins' },
    { id: '3', type: 'events', title: 'Event Registered', description: 'You registered for "Quantum Surge 2024"', timestamp: '11:20 AM', date: 'Today', status: 'success', icon: Calendar, iconColor: '#00d9ff', details: 'Event starts on Dec 25, 2024 at 10:00 AM' },
    { id: '4', type: 'auth', title: 'Login Successful', description: 'Logged in from Chrome on Windows', timestamp: '10:00 AM', date: 'Today', status: 'success', icon: LogIn, iconColor: '#8b5cf6', details: 'IP: 192.168.1.xxx • Location: Mumbai, India' },
    { id: '5', type: 'profile', title: 'Profile Updated', description: 'You updated your bio and avatar', timestamp: '9:15 AM', date: 'Today', status: 'success', icon: User, iconColor: '#00ff88' },
    { id: '6', type: 'challenges', title: 'Challenge Started', description: 'You joined "Algorithm Master" challenge', timestamp: '8:00 PM', date: 'Yesterday', status: 'pending', icon: Target, iconColor: '#ffd700', details: 'Challenge ends in 2 days' },
    { id: '7', type: 'payments', title: 'Withdrawal Requested', description: 'Withdrawal of 1000 coins initiated', timestamp: '6:45 PM', date: 'Yesterday', status: 'pending', icon: CreditCard, iconColor: '#ff6b6b', amount: '-1000 coins', details: 'Processing time: 24-48 hours' },
    { id: '8', type: 'events', title: 'Event Completed', description: 'Participated in "Code Warriors League"', timestamp: '5:30 PM', date: 'Yesterday', status: 'success', icon: Award, iconColor: '#ffd700', amount: '+500 coins', details: 'Final rank: #8 • XP earned: 1,250' },
    { id: '9', type: 'chat', title: 'New Message', description: 'Alex Hunter sent you a message', timestamp: '3:20 PM', date: 'Yesterday', status: 'info', icon: MessageSquare, iconColor: '#00d9ff' },
    { id: '10', type: 'auth', title: 'Password Changed', description: 'Your account password was updated', timestamp: '2:00 PM', date: 'Yesterday', status: 'success', icon: Shield, iconColor: '#00ff88', details: 'If you didn\'t make this change, contact support immediately.' },
  ];

  const filteredActivities = activities.filter(activity => {
    const matchesCategory = activeCategory === 'all' || activity.type === activeCategory;
    const matchesSearch = activity.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         activity.description.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesCategory && matchesSearch;
  });

  // Group activities by date
  const groupedActivities = filteredActivities.reduce((groups, activity) => {
    const date = activity.date;
    if (!groups[date]) {
      groups[date] = [];
    }
    groups[date].push(activity);
    return groups;
  }, {} as Record<string, Activity[]>);

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
            <HistoryIcon className="w-8 h-8 text-[#00d9ff]" />
            Activity History
          </h1>
          <p className="text-gray-400">Track all your actions and transactions</p>
        </div>

        {/* Search */}
        <div className="relative">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-500" />
          <input
            type="text"
            placeholder="Search activities..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-12 pr-4 py-3 bg-[#141420] border border-white/10 rounded-xl text-white placeholder-gray-500 focus:border-[#00ff88]/50 focus:outline-none w-full lg:w-80 transition-colors"
          />
        </div>
      </motion.div>

      {/* Stats Summary */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1 }}
        className="grid grid-cols-2 lg:grid-cols-4 gap-4"
      >
        {[
          { icon: Zap, label: 'Total Actions', value: '1,247', color: '#00ff88' },
          { icon: Trophy, label: 'Challenges', value: '89', color: '#ffd700' },
          { icon: Coins, label: 'Total Earned', value: '24,500', color: '#00d9ff' },
          { icon: Calendar, label: 'Events Joined', value: '32', color: '#8b5cf6' },
        ].map((stat, i) => (
          <motion.div
            key={i}
            whileHover={{ scale: 1.02 }}
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

      {/* Category Tabs */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2 }}
        className="flex gap-2 overflow-x-auto pb-2 scrollbar-hide"
      >
        {categories.map((category) => (
          <CategoryTab
            key={category.id}
            category={category.label}
            icon={category.icon}
            active={activeCategory === category.id}
            onClick={() => setActiveCategory(category.id as ActivityType)}
            count={category.count}
          />
        ))}
      </motion.div>

      {/* Activity Timeline */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.3 }}
        className="space-y-6"
      >
        {Object.entries(groupedActivities).map(([date, activities]) => (
          <div key={date}>
            <motion.h3
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="text-sm font-semibold text-gray-500 uppercase tracking-wider mb-4 pl-2"
            >
              {date}
            </motion.h3>
            <div className="space-y-3">
              {activities.map((activity, index) => (
                <ActivityCard key={activity.id} activity={activity} index={index} />
              ))}
            </div>
          </div>
        ))}
      </motion.div>

      {filteredActivities.length === 0 && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="text-center py-20"
        >
          <HistoryIcon className="w-16 h-16 text-gray-600 mx-auto mb-4" />
          <h3 className="text-xl font-bold text-white mb-2">No Activities Found</h3>
          <p className="text-gray-400">Try adjusting your filters or search query</p>
        </motion.div>
      )}
    </div>
  );
}
