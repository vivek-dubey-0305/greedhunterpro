import { motion } from 'framer-motion';
import {
  Users,
  Calendar,
  Trophy,
  Coins,
  TrendingUp,
  Activity,
  MessageSquare,
  CreditCard,
} from 'lucide-react';
import { StatsCard } from '../components';

export function AdminDashboardOverview() {
  const stats = [
    { title: 'Total Users', value: '24,532', icon: Users, trend: { value: 12.5, isPositive: true }, color: '#8b5cf6' },
    { title: 'Active Events', value: '47', icon: Calendar, trend: { value: 8.2, isPositive: true }, color: '#00ff88' },
    { title: 'Challenges', value: '156', icon: Trophy, trend: { value: 3.1, isPositive: false }, color: '#ffd700' },
    { title: 'Total Revenue', value: '$128,430', icon: CreditCard, trend: { value: 22.4, isPositive: true }, color: '#00d9ff' },
    { title: 'Coins Distributed', value: '1.2M', icon: Coins, trend: { value: 15.7, isPositive: true }, color: '#ff6b6b' },
    { title: 'Active Communities', value: '89', icon: MessageSquare, trend: { value: 5.3, isPositive: true }, color: '#ff8c00' },
    { title: 'Daily Missions', value: '23', icon: Activity, trend: { value: 2.1, isPositive: true }, color: '#e91e63' },
    { title: 'Growth Rate', value: '18.5%', icon: TrendingUp, trend: { value: 4.2, isPositive: true }, color: '#4caf50' },
  ];

  const recentActivity = [
    { id: 1, action: 'New user registered', user: 'john_doe', time: '2 minutes ago', type: 'user' },
    { id: 2, action: 'Event created', user: 'admin', time: '15 minutes ago', type: 'event' },
    { id: 3, action: 'Payment received', user: 'jane_smith', time: '1 hour ago', type: 'payment' },
    { id: 4, action: 'Challenge completed', user: 'alex_pro', time: '2 hours ago', type: 'challenge' },
    { id: 5, action: 'Community created', user: 'tech_lead', time: '3 hours ago', type: 'community' },
  ];

  const topUsers = [
    { rank: 1, name: 'Alex Thompson', points: 15420, avatar: 'A' },
    { rank: 2, name: 'Sarah Wilson', points: 14850, avatar: 'S' },
    { rank: 3, name: 'Mike Johnson', points: 13920, avatar: 'M' },
    { rank: 4, name: 'Emily Davis', points: 12780, avatar: 'E' },
    { rank: 5, name: 'Chris Brown', points: 11650, avatar: 'C' },
  ];

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
      >
        <h1 className="text-2xl font-bold text-white">Dashboard Overview</h1>
        <p className="text-gray-400 mt-1">Welcome back! Here's what's happening with your platform.</p>
      </motion.div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {stats.map((stat, index) => (
          <motion.div
            key={stat.title}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.05 }}
          >
            <StatsCard {...stat} />
          </motion.div>
        ))}
      </div>

      {/* Main Content Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Recent Activity */}
        <motion.div
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.3 }}
          className="lg:col-span-2 bg-[#141420] border border-[#2a2a3e] rounded-xl p-6"
        >
          <h2 className="text-lg font-semibold text-white mb-4">Recent Activity</h2>
          <div className="space-y-4">
            {recentActivity.map((activity, index) => (
              <motion.div
                key={activity.id}
                initial={{ opacity: 0, x: -10 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.4 + index * 0.05 }}
                className="flex items-center gap-4 p-3 rounded-lg hover:bg-white/5 transition-colors"
              >
                <div className={`
                  w-10 h-10 rounded-full flex items-center justify-center
                  ${activity.type === 'user' ? 'bg-[#8b5cf6]/20 text-[#8b5cf6]' : ''}
                  ${activity.type === 'event' ? 'bg-[#00ff88]/20 text-[#00ff88]' : ''}
                  ${activity.type === 'payment' ? 'bg-[#ffd700]/20 text-[#ffd700]' : ''}
                  ${activity.type === 'challenge' ? 'bg-[#00d9ff]/20 text-[#00d9ff]' : ''}
                  ${activity.type === 'community' ? 'bg-[#ff6b6b]/20 text-[#ff6b6b]' : ''}
                `}>
                  {activity.type === 'user' && <Users className="w-5 h-5" />}
                  {activity.type === 'event' && <Calendar className="w-5 h-5" />}
                  {activity.type === 'payment' && <CreditCard className="w-5 h-5" />}
                  {activity.type === 'challenge' && <Trophy className="w-5 h-5" />}
                  {activity.type === 'community' && <MessageSquare className="w-5 h-5" />}
                </div>
                <div className="flex-1">
                  <p className="text-white text-sm">{activity.action}</p>
                  <p className="text-gray-500 text-xs">by @{activity.user}</p>
                </div>
                <span className="text-gray-500 text-xs">{activity.time}</span>
              </motion.div>
            ))}
          </div>
        </motion.div>

        {/* Top Users */}
        <motion.div
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.3 }}
          className="bg-[#141420] border border-[#2a2a3e] rounded-xl p-6"
        >
          <h2 className="text-lg font-semibold text-white mb-4">Top Users</h2>
          <div className="space-y-3">
            {topUsers.map((user, index) => (
              <motion.div
                key={user.rank}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.4 + index * 0.05 }}
                className="flex items-center gap-3 p-2 rounded-lg hover:bg-white/5 transition-colors"
              >
                <span className={`
                  w-6 h-6 rounded-full flex items-center justify-center text-xs font-bold
                  ${user.rank === 1 ? 'bg-[#ffd700] text-black' : ''}
                  ${user.rank === 2 ? 'bg-[#c0c0c0] text-black' : ''}
                  ${user.rank === 3 ? 'bg-[#cd7f32] text-black' : ''}
                  ${user.rank > 3 ? 'bg-[#2a2a3e] text-gray-400' : ''}
                `}>
                  {user.rank}
                </span>
                <div className="w-8 h-8 rounded-full bg-gradient-to-br from-[#8b5cf6] to-[#00ff88] flex items-center justify-center text-white font-bold text-sm">
                  {user.avatar}
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-white text-sm truncate">{user.name}</p>
                </div>
                <span className="text-[#00ff88] text-sm font-medium">{user.points.toLocaleString()}</span>
              </motion.div>
            ))}
          </div>
        </motion.div>
      </div>

      {/* Quick Actions */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.5 }}
        className="bg-[#141420] border border-[#2a2a3e] rounded-xl p-6"
      >
        <h2 className="text-lg font-semibold text-white mb-4">Quick Actions</h2>
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
          {[
            { label: 'Create Event', icon: Calendar, color: '#00ff88' },
            { label: 'Add Challenge', icon: Trophy, color: '#ffd700' },
            { label: 'Send Notification', icon: MessageSquare, color: '#00d9ff' },
            { label: 'View Reports', icon: TrendingUp, color: '#8b5cf6' },
          ].map((action, index) => (
            <motion.button
              key={action.label}
              whileHover={{ scale: 1.02, y: -2 }}
              whileTap={{ scale: 0.98 }}
              className="flex flex-col items-center gap-3 p-4 rounded-xl border border-[#2a2a3e] hover:border-[#3a3a4e] transition-colors bg-[#1a1a2e]"
            >
              <div
                className="w-12 h-12 rounded-full flex items-center justify-center"
                style={{ backgroundColor: `${action.color}20` }}
              >
                <action.icon className="w-6 h-6" style={{ color: action.color }} />
              </div>
              <span className="text-gray-300 text-sm font-medium">{action.label}</span>
            </motion.button>
          ))}
        </div>
      </motion.div>
    </div>
  );
}
