import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Search, 
  UserPlus, 
  MessageSquare, 
  Swords, 
  Trophy, 
  Star,
  Coins,
  TrendingUp,
  Calendar,
  ChevronRight,
  X,
  Award,
  Target,
  Flame
} from 'lucide-react';

// User Profile interface
interface UserProfile {
  id: string;
  name: string;
  username: string;
  level: number;
  coins: number;
  rank: number;
  isFollowing: boolean;
  isOnline: boolean;
  stats: {
    challenges: number;
    events: number;
    winRate: number;
  };
  achievements: string[];
  recentActivity: string;
}

// Profile Card Component
function ProfileCard({ user, onFollow, onChallenge, onMessage, onClick }: {
  user: UserProfile;
  onFollow: () => void;
  onChallenge: () => void;
  onMessage: () => void;
  onClick: () => void;
}) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      whileHover={{ y: -8, scale: 1.02 }}
      className="relative group cursor-pointer"
      onClick={onClick}
    >
      <motion.div
        className="absolute inset-0 rounded-2xl bg-gradient-to-r from-[#00ff88]/10 to-[#8b5cf6]/10 blur-xl opacity-0 group-hover:opacity-100 transition-opacity duration-500"
      />
      
      <div className="relative bg-[#141420]/80 backdrop-blur-xl border border-white/10 rounded-2xl overflow-hidden group-hover:border-white/20 transition-all">
        {/* Header with gradient */}
        <div className="relative h-24 bg-gradient-to-br from-[#8b5cf6]/30 to-[#00ff88]/20">
          <div className="absolute inset-0 bg-gradient-to-t from-[#141420] to-transparent" />
          
          {/* Rank badge */}
          <div className="absolute top-3 right-3 px-2 py-1 bg-black/50 backdrop-blur-md rounded-lg flex items-center gap-1">
            <Trophy className="w-3 h-3 text-[#ffd700]" />
            <span className="text-[#ffd700] text-xs font-bold">#{user.rank}</span>
          </div>
        </div>
        
        {/* Avatar */}
        <div className="relative -mt-12 px-5">
          <div className="relative inline-block">
            <motion.div
              className="w-20 h-20 rounded-2xl bg-gradient-to-br from-[#8b5cf6] to-[#00ff88] p-0.5"
              animate={user.isOnline ? { 
                boxShadow: ['0 0 20px #00ff8830', '0 0 40px #00ff8850', '0 0 20px #00ff8830']
              } : {}}
              transition={{ duration: 2, repeat: Infinity }}
            >
              <div className="w-full h-full rounded-2xl bg-[#141420] flex items-center justify-center">
                <span className="text-3xl font-black text-white">
                  {user.name.charAt(0)}
                </span>
              </div>
            </motion.div>
            
            {user.isOnline && (
              <motion.div
                className="absolute -bottom-1 -right-1 w-5 h-5 bg-[#00ff88] rounded-full border-3 border-[#141420] flex items-center justify-center"
                animate={{ scale: [1, 1.2, 1] }}
                transition={{ duration: 2, repeat: Infinity }}
              />
            )}
            
            {/* Level badge */}
            <div className="absolute -bottom-1 -left-1 px-2 py-0.5 bg-[#00ff88] rounded-full">
              <span className="text-xs font-bold text-black">Lv.{user.level}</span>
            </div>
          </div>
        </div>
        
        {/* Info */}
        <div className="p-5 pt-3">
          <div className="mb-3">
            <h3 className="text-lg font-bold text-white group-hover:text-[#00ff88] transition-colors">
              {user.name}
            </h3>
            <p className="text-gray-500 text-sm">@{user.username}</p>
          </div>
          
          {/* Stats */}
          <div className="grid grid-cols-3 gap-2 mb-4">
            <div className="text-center p-2 bg-[#1a1a2e] rounded-lg">
              <p className="text-[#00ff88] font-bold">{user.stats.challenges}</p>
              <p className="text-gray-500 text-xs">Challenges</p>
            </div>
            <div className="text-center p-2 bg-[#1a1a2e] rounded-lg">
              <p className="text-[#00d9ff] font-bold">{user.stats.events}</p>
              <p className="text-gray-500 text-xs">Events</p>
            </div>
            <div className="text-center p-2 bg-[#1a1a2e] rounded-lg">
              <p className="text-[#ffd700] font-bold">{user.stats.winRate}%</p>
              <p className="text-gray-500 text-xs">Win Rate</p>
            </div>
          </div>
          
          {/* Coins */}
          <div className="flex items-center justify-between mb-4 p-3 bg-[#1a1a2e] rounded-xl">
            <div className="flex items-center gap-2">
              <Coins className="w-5 h-5 text-[#ffd700]" />
              <span className="text-[#ffd700] font-bold">{user.coins.toLocaleString()}</span>
            </div>
            <span className="text-gray-500 text-sm">{user.recentActivity}</span>
          </div>
          
          {/* Action Buttons */}
          <div className="flex gap-2" onClick={(e) => e.stopPropagation()}>
            <motion.button
              onClick={onFollow}
              className={`flex-1 py-2 rounded-xl text-sm font-medium transition-all ${
                user.isFollowing
                  ? 'bg-[#00ff88]/20 text-[#00ff88] border border-[#00ff88]/30'
                  : 'bg-[#00ff88] text-black'
              }`}
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
            >
              <UserPlus className="w-4 h-4 inline mr-1" />
              {user.isFollowing ? 'Following' : 'Follow'}
            </motion.button>
            
            <motion.button
              onClick={onChallenge}
              className="p-2 bg-[#8b5cf6]/20 text-[#8b5cf6] rounded-xl hover:bg-[#8b5cf6]/30 transition-colors"
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.95 }}
            >
              <Swords className="w-5 h-5" />
            </motion.button>
            
            <motion.button
              onClick={onMessage}
              className="p-2 bg-[#00d9ff]/20 text-[#00d9ff] rounded-xl hover:bg-[#00d9ff]/30 transition-colors"
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.95 }}
            >
              <MessageSquare className="w-5 h-5" />
            </motion.button>
          </div>
        </div>
      </div>
    </motion.div>
  );
}

// Profile Detail Modal
function ProfileModal({ user, onClose }: { user: UserProfile | null; onClose: () => void }) {
  if (!user) return null;

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
          className="relative w-full max-w-md bg-[#141420] border border-white/10 rounded-2xl overflow-hidden"
          onClick={(e) => e.stopPropagation()}
        >
          {/* Header */}
          <div className="relative h-32 bg-gradient-to-br from-[#8b5cf6]/40 to-[#00ff88]/30">
            <motion.button
              onClick={onClose}
              className="absolute top-4 right-4 p-2 bg-black/50 rounded-lg hover:bg-black/70 transition-colors"
              whileHover={{ scale: 1.1, rotate: 90 }}
              whileTap={{ scale: 0.9 }}
            >
              <X className="w-5 h-5 text-white" />
            </motion.button>
          </div>
          
          {/* Avatar */}
          <div className="relative -mt-16 text-center px-6">
            <motion.div
              className="w-28 h-28 mx-auto rounded-3xl bg-gradient-to-br from-[#8b5cf6] to-[#00ff88] p-1"
              animate={{ 
                boxShadow: ['0 0 30px #00ff8830', '0 0 50px #00ff8850', '0 0 30px #00ff8830']
              }}
              transition={{ duration: 2, repeat: Infinity }}
            >
              <div className="w-full h-full rounded-3xl bg-[#141420] flex items-center justify-center">
                <span className="text-4xl font-black text-white">
                  {user.name.charAt(0)}
                </span>
              </div>
            </motion.div>
          </div>
          
          {/* Content */}
          <div className="p-6 pt-4 text-center">
            <h2 className="text-2xl font-bold text-white mb-1">{user.name}</h2>
            <p className="text-gray-500 mb-4">@{user.username}</p>
            
            {/* Badges */}
            <div className="flex justify-center gap-2 mb-6">
              <span className="px-3 py-1 bg-[#00ff88]/20 text-[#00ff88] rounded-full text-sm font-medium">
                Level {user.level}
              </span>
              <span className="px-3 py-1 bg-[#ffd700]/20 text-[#ffd700] rounded-full text-sm font-medium flex items-center gap-1">
                <Trophy className="w-3 h-3" /> Rank #{user.rank}
              </span>
            </div>
            
            {/* Stats Grid */}
            <div className="grid grid-cols-2 gap-3 mb-6">
              <div className="p-4 bg-[#1a1a2e] rounded-xl">
                <Target className="w-6 h-6 text-[#00ff88] mx-auto mb-2" />
                <p className="text-white font-bold text-xl">{user.stats.challenges}</p>
                <p className="text-gray-500 text-sm">Challenges Won</p>
              </div>
              <div className="p-4 bg-[#1a1a2e] rounded-xl">
                <Calendar className="w-6 h-6 text-[#00d9ff] mx-auto mb-2" />
                <p className="text-white font-bold text-xl">{user.stats.events}</p>
                <p className="text-gray-500 text-sm">Events Attended</p>
              </div>
              <div className="p-4 bg-[#1a1a2e] rounded-xl">
                <Flame className="w-6 h-6 text-[#ff6b6b] mx-auto mb-2" />
                <p className="text-white font-bold text-xl">{user.stats.winRate}%</p>
                <p className="text-gray-500 text-sm">Win Rate</p>
              </div>
              <div className="p-4 bg-[#1a1a2e] rounded-xl">
                <Coins className="w-6 h-6 text-[#ffd700] mx-auto mb-2" />
                <p className="text-[#ffd700] font-bold text-xl">{user.coins.toLocaleString()}</p>
                <p className="text-gray-500 text-sm">Total Coins</p>
              </div>
            </div>
            
            {/* Achievements */}
            <div className="mb-6">
              <h4 className="text-sm font-semibold text-gray-400 uppercase tracking-wider mb-3">Achievements</h4>
              <div className="flex justify-center gap-2 flex-wrap">
                {user.achievements.map((achievement, i) => (
                  <motion.div
                    key={i}
                    className="w-12 h-12 bg-[#1a1a2e] rounded-xl flex items-center justify-center text-2xl"
                    whileHover={{ scale: 1.1, rotate: [0, -5, 5, 0] }}
                  >
                    {achievement}
                  </motion.div>
                ))}
              </div>
            </div>
            
            {/* Actions */}
            <div className="flex gap-3">
              <motion.button
                className="flex-1 py-3 bg-gradient-to-r from-[#00ff88] to-[#00d9ff] text-black font-bold rounded-xl"
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
              >
                Follow
              </motion.button>
              <motion.button
                className="flex-1 py-3 bg-[#8b5cf6] text-white font-bold rounded-xl"
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
              >
                Challenge
              </motion.button>
            </div>
          </div>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
}

// Main Component
export function Seek() {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedUser, setSelectedUser] = useState<UserProfile | null>(null);
  const [followedUsers, setFollowedUsers] = useState<string[]>([]);

  const users: UserProfile[] = [
    {
      id: '1',
      name: 'Alex Hunter',
      username: 'alexhunter',
      level: 45,
      coins: 24500,
      rank: 12,
      isFollowing: false,
      isOnline: true,
      stats: { challenges: 156, events: 89, winRate: 78 },
      achievements: ['🏆', '⚡', '🔥', '💎', '🎯'],
      recentActivity: 'Active 2m ago',
    },
    {
      id: '2',
      name: 'Sarah Dev',
      username: 'sarahdev',
      level: 38,
      coins: 18900,
      rank: 45,
      isFollowing: true,
      isOnline: true,
      stats: { challenges: 98, events: 67, winRate: 72 },
      achievements: ['🎓', '💻', '🌟'],
      recentActivity: 'Active now',
    },
    {
      id: '3',
      name: 'Mike Coder',
      username: 'mikecoder',
      level: 52,
      coins: 31200,
      rank: 8,
      isFollowing: false,
      isOnline: false,
      stats: { challenges: 234, events: 112, winRate: 85 },
      achievements: ['👑', '🏆', '⚡', '🔥', '💎', '🎯'],
      recentActivity: 'Active 1h ago',
    },
    {
      id: '4',
      name: 'Emma Tech',
      username: 'emmatech',
      level: 29,
      coins: 12400,
      rank: 89,
      isFollowing: false,
      isOnline: true,
      stats: { challenges: 67, events: 45, winRate: 68 },
      achievements: ['🌟', '💻'],
      recentActivity: 'Active 15m ago',
    },
  ];

  const filteredUsers = users.filter(user =>
    user.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    user.username.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const handleFollow = (userId: string) => {
    setFollowedUsers(prev =>
      prev.includes(userId)
        ? prev.filter(id => id !== userId)
        : [...prev, userId]
    );
  };

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
            <Search className="w-8 h-8 text-[#00d9ff]" />
            Seek Hunters
          </h1>
          <p className="text-gray-400">Discover and connect with fellow hunters</p>
        </div>
        
        {/* Search */}
        <div className="relative">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-500" />
          <input
            type="text"
            placeholder="Search by name or username..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-12 pr-4 py-3 bg-[#141420] border border-white/10 rounded-xl text-white placeholder-gray-500 focus:border-[#00ff88]/50 focus:outline-none w-full lg:w-80 transition-colors"
          />
        </div>
      </motion.div>

      {/* Stats */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1 }}
        className="grid grid-cols-2 lg:grid-cols-4 gap-4"
      >
        {[
          { icon: UserPlus, label: 'Following', value: 156, color: '#00ff88' },
          { icon: Star, label: 'Followers', value: 892, color: '#ffd700' },
          { icon: Swords, label: 'Battles Won', value: 47, color: '#8b5cf6' },
          { icon: TrendingUp, label: 'Your Rank', value: '#247', color: '#00d9ff' },
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

      {/* Users Grid */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.2 }}
        className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6"
      >
        {filteredUsers.map((user, index) => (
          <motion.div
            key={user.id}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 * index }}
          >
            <ProfileCard
              user={{
                ...user,
                isFollowing: followedUsers.includes(user.id) || user.isFollowing
              }}
              onFollow={() => handleFollow(user.id)}
              onChallenge={() => {}}
              onMessage={() => {}}
              onClick={() => setSelectedUser(user)}
            />
          </motion.div>
        ))}
      </motion.div>

      {filteredUsers.length === 0 && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="text-center py-20"
        >
          <Search className="w-16 h-16 text-gray-600 mx-auto mb-4" />
          <h3 className="text-xl font-bold text-white mb-2">No Hunters Found</h3>
          <p className="text-gray-400">Try a different search term</p>
        </motion.div>
      )}

      {/* Profile Modal */}
      <ProfileModal user={selectedUser} onClose={() => setSelectedUser(null)} />
    </div>
  );
}
