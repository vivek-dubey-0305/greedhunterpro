import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  MessageSquare, 
  Heart, 
  MessageCircle, 
  Share2, 
  Flame,
  Clock,
  TrendingUp,
  Users,
  Send,
  X,
  Award,
  Zap,
  Star
} from 'lucide-react';

// Thread interface
interface Thread {
  id: string;
  title: string;
  content: string;
  author: {
    name: string;
    level: number;
    isVerified: boolean;
  };
  eventName: string;
  category: 'discussion' | 'question' | 'announcement' | 'tips';
  likes: number;
  replies: number;
  views: number;
  isLiked: boolean;
  createdAt: string;
  tags: string[];
  isPinned?: boolean;
}

// Reply interface
interface Reply {
  id: string;
  content: string;
  author: { name: string; level: number };
  likes: number;
  isLiked: boolean;
  createdAt: string;
}

// Filter Tab Component
function FilterTab({ label, icon: Icon, active, onClick, count }: {
  label: string;
  icon: React.ElementType;
  active: boolean;
  onClick: () => void;
  count?: number;
}) {
  return (
    <motion.button
      onClick={onClick}
      className={`flex items-center gap-2 px-4 py-2 rounded-xl font-medium transition-all ${
        active
          ? 'bg-[#00ff88] text-black'
          : 'bg-[#1a1a2e] text-gray-400 hover:text-white'
      }`}
      whileHover={{ scale: 1.02 }}
      whileTap={{ scale: 0.98 }}
    >
      <Icon className="w-4 h-4" />
      <span>{label}</span>
      {count !== undefined && (
        <span className={`px-2 py-0.5 rounded-full text-xs ${
          active ? 'bg-black/20 text-black' : 'bg-white/10 text-white'
        }`}>
          {count}
        </span>
      )}
    </motion.button>
  );
}

// Category Badge
function CategoryBadge({ category }: { category: Thread['category'] }) {
  const config = {
    discussion: { label: 'Discussion', color: '#00d9ff' },
    question: { label: 'Question', color: '#8b5cf6' },
    announcement: { label: 'Announcement', color: '#ffd700' },
    tips: { label: 'Tips', color: '#00ff88' },
  };

  const { label, color } = config[category];

  return (
    <span
      className="px-2 py-1 rounded-lg text-xs font-medium"
      style={{ backgroundColor: `${color}20`, color }}
    >
      {label}
    </span>
  );
}

// Thread Card Component
function ThreadCard({ thread, onClick }: { thread: Thread; onClick: () => void }) {
  const [liked, setLiked] = useState(thread.isLiked);
  const [likeCount, setLikeCount] = useState(thread.likes);

  const handleLike = (e: React.MouseEvent) => {
    e.stopPropagation();
    setLiked(!liked);
    setLikeCount(prev => liked ? prev - 1 : prev + 1);
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      whileHover={{ y: -4 }}
      className="group relative cursor-pointer"
      onClick={onClick}
    >
      {thread.isPinned && (
        <motion.div
          className="absolute -top-2 -right-2 z-10 p-2 bg-[#ffd700] rounded-lg shadow-lg"
          animate={{ scale: [1, 1.1, 1] }}
          transition={{ duration: 2, repeat: Infinity }}
        >
          <Star className="w-4 h-4 text-black" />
        </motion.div>
      )}
      
      <div className="relative bg-[#141420]/80 backdrop-blur-xl border border-white/10 rounded-2xl p-5 group-hover:border-[#00ff88]/30 transition-all">
        {/* Header */}
        <div className="flex items-start justify-between mb-3">
          <div className="flex items-center gap-3">
            <motion.div
              className="w-10 h-10 rounded-xl bg-gradient-to-br from-[#8b5cf6] to-[#00ff88] p-0.5"
              whileHover={{ rotate: 5 }}
            >
              <div className="w-full h-full rounded-xl bg-[#141420] flex items-center justify-center">
                <span className="text-sm font-bold text-white">
                  {thread.author.name.charAt(0)}
                </span>
              </div>
            </motion.div>
            <div>
              <div className="flex items-center gap-2">
                <span className="font-semibold text-white">{thread.author.name}</span>
                {thread.author.isVerified && (
                  <Award className="w-4 h-4 text-[#00ff88]" />
                )}
                <span className="text-xs text-[#00ff88]">Lv.{thread.author.level}</span>
              </div>
              <p className="text-xs text-gray-500">{thread.createdAt}</p>
            </div>
          </div>
          <CategoryBadge category={thread.category} />
        </div>
        
        {/* Event Tag */}
        <div className="mb-3">
          <span className="text-xs text-gray-500 bg-[#1a1a2e] px-2 py-1 rounded-lg">
            📅 {thread.eventName}
          </span>
        </div>
        
        {/* Content */}
        <h3 className="text-lg font-bold text-white mb-2 group-hover:text-[#00ff88] transition-colors">
          {thread.title}
        </h3>
        <p className="text-gray-400 text-sm leading-relaxed mb-4 line-clamp-2">
          {thread.content}
        </p>
        
        {/* Tags */}
        <div className="flex flex-wrap gap-2 mb-4">
          {thread.tags.map((tag, i) => (
            <span key={i} className="px-2 py-1 bg-[#1a1a2e] text-gray-400 rounded-lg text-xs">
              #{tag}
            </span>
          ))}
        </div>
        
        {/* Stats */}
        <div className="flex items-center justify-between pt-3 border-t border-white/5">
          <div className="flex items-center gap-4">
            <motion.button
              onClick={handleLike}
              className={`flex items-center gap-1.5 transition-colors ${
                liked ? 'text-red-500' : 'text-gray-500 hover:text-red-400'
              }`}
              whileTap={{ scale: 0.9 }}
            >
              <Heart className={`w-4 h-4 ${liked ? 'fill-current' : ''}`} />
              <span className="text-sm">{likeCount}</span>
            </motion.button>
            
            <div className="flex items-center gap-1.5 text-gray-500">
              <MessageCircle className="w-4 h-4" />
              <span className="text-sm">{thread.replies}</span>
            </div>
            
            <div className="flex items-center gap-1.5 text-gray-500">
              <Users className="w-4 h-4" />
              <span className="text-sm">{thread.views}</span>
            </div>
          </div>
          
          <motion.button
            className="text-gray-500 hover:text-[#00d9ff] transition-colors"
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.95 }}
            onClick={(e) => e.stopPropagation()}
          >
            <Share2 className="w-4 h-4" />
          </motion.button>
        </div>
      </div>
    </motion.div>
  );
}

// Thread Detail Modal
function ThreadModal({ thread, onClose }: { thread: Thread | null; onClose: () => void }) {
  const [replyText, setReplyText] = useState('');
  
  const replies: Reply[] = [
    { id: '1', content: 'Great insights! This really helped me understand the event better.', author: { name: 'Mike', level: 34 }, likes: 12, isLiked: true, createdAt: '2h ago' },
    { id: '2', content: 'Thanks for sharing! Can\'t wait for the next challenge.', author: { name: 'Sarah', level: 28 }, likes: 8, isLiked: false, createdAt: '1h ago' },
    { id: '3', content: 'This is exactly what I was looking for. 🔥', author: { name: 'Alex', level: 42 }, likes: 5, isLiked: false, createdAt: '30m ago' },
  ];

  if (!thread) return null;

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
          className="relative w-full max-w-2xl max-h-[80vh] bg-[#141420] border border-white/10 rounded-2xl overflow-hidden flex flex-col"
          onClick={(e) => e.stopPropagation()}
        >
          {/* Header */}
          <div className="flex items-center justify-between p-5 border-b border-white/10">
            <div className="flex items-center gap-3">
              <CategoryBadge category={thread.category} />
              <span className="text-gray-500 text-sm">in {thread.eventName}</span>
            </div>
            <motion.button
              onClick={onClose}
              className="p-2 hover:bg-white/10 rounded-lg transition-colors"
              whileHover={{ scale: 1.1, rotate: 90 }}
            >
              <X className="w-5 h-5 text-gray-400" />
            </motion.button>
          </div>
          
          {/* Content */}
          <div className="flex-1 overflow-y-auto p-5 custom-scrollbar">
            {/* Author */}
            <div className="flex items-center gap-3 mb-4">
              <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-[#8b5cf6] to-[#00ff88] p-0.5">
                <div className="w-full h-full rounded-xl bg-[#141420] flex items-center justify-center">
                  <span className="font-bold text-white">{thread.author.name.charAt(0)}</span>
                </div>
              </div>
              <div>
                <div className="flex items-center gap-2">
                  <span className="font-semibold text-white">{thread.author.name}</span>
                  <span className="text-xs text-[#00ff88]">Lv.{thread.author.level}</span>
                </div>
                <p className="text-xs text-gray-500">{thread.createdAt}</p>
              </div>
            </div>
            
            {/* Thread Content */}
            <h2 className="text-2xl font-bold text-white mb-4">{thread.title}</h2>
            <p className="text-gray-300 leading-relaxed mb-6">{thread.content}</p>
            
            {/* Tags */}
            <div className="flex flex-wrap gap-2 mb-6">
              {thread.tags.map((tag, i) => (
                <span key={i} className="px-3 py-1 bg-[#1a1a2e] text-gray-400 rounded-lg text-sm">
                  #{tag}
                </span>
              ))}
            </div>
            
            {/* Stats */}
            <div className="flex items-center gap-6 p-4 bg-[#1a1a2e] rounded-xl mb-6">
              <div className="flex items-center gap-2 text-red-400">
                <Heart className="w-5 h-5 fill-current" />
                <span className="font-medium">{thread.likes} Likes</span>
              </div>
              <div className="flex items-center gap-2 text-[#00d9ff]">
                <MessageCircle className="w-5 h-5" />
                <span className="font-medium">{thread.replies} Replies</span>
              </div>
              <div className="flex items-center gap-2 text-gray-400">
                <Users className="w-5 h-5" />
                <span className="font-medium">{thread.views} Views</span>
              </div>
            </div>
            
            {/* Replies */}
            <h4 className="text-lg font-bold text-white mb-4">Replies</h4>
            <div className="space-y-4">
              {replies.map((reply) => (
                <motion.div
                  key={reply.id}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  className="p-4 bg-[#1a1a2e] rounded-xl"
                >
                  <div className="flex items-center justify-between mb-3">
                    <div className="flex items-center gap-2">
                      <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-[#8b5cf6]/50 to-[#00ff88]/50 flex items-center justify-center">
                        <span className="text-xs font-bold text-white">{reply.author.name.charAt(0)}</span>
                      </div>
                      <span className="font-medium text-white">{reply.author.name}</span>
                      <span className="text-xs text-[#00ff88]">Lv.{reply.author.level}</span>
                    </div>
                    <span className="text-xs text-gray-500">{reply.createdAt}</span>
                  </div>
                  <p className="text-gray-300 text-sm mb-3">{reply.content}</p>
                  <button className={`flex items-center gap-1 text-sm ${
                    reply.isLiked ? 'text-red-400' : 'text-gray-500 hover:text-red-400'
                  }`}>
                    <Heart className={`w-3 h-3 ${reply.isLiked ? 'fill-current' : ''}`} />
                    {reply.likes}
                  </button>
                </motion.div>
              ))}
            </div>
          </div>
          
          {/* Reply Input */}
          <div className="p-5 border-t border-white/10">
            <div className="flex gap-3">
              <input
                type="text"
                placeholder="Write a reply..."
                value={replyText}
                onChange={(e) => setReplyText(e.target.value)}
                className="flex-1 px-4 py-3 bg-[#1a1a2e] border border-white/10 rounded-xl text-white placeholder-gray-500 focus:border-[#00ff88]/50 focus:outline-none"
              />
              <motion.button
                className="px-6 py-3 bg-[#00ff88] text-black font-bold rounded-xl disabled:opacity-50"
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                disabled={!replyText.trim()}
              >
                <Send className="w-5 h-5" />
              </motion.button>
            </div>
          </div>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
}

// Main Component
export function Community() {
  const [activeFilter, setActiveFilter] = useState('trending');
  const [selectedThread, setSelectedThread] = useState<Thread | null>(null);

  const threads: Thread[] = [
    {
      id: '1',
      title: 'Tips for winning the Quantum Surge Challenge 🚀',
      content: 'After participating in 5 Quantum Surge events, I\'ve compiled my best strategies. First, always start with the resource gathering phase...',
      author: { name: 'Alex Hunter', level: 45, isVerified: true },
      eventName: 'Quantum Surge 2024',
      category: 'tips',
      likes: 234,
      replies: 47,
      views: 1250,
      isLiked: false,
      createdAt: '3h ago',
      tags: ['strategy', 'quantum', 'tips'],
      isPinned: true,
    },
    {
      id: '2',
      title: 'Question about event rewards distribution',
      content: 'Can someone explain how the reward pool is calculated? I\'m confused about the tier system and how coins are distributed among winners.',
      author: { name: 'Sarah Dev', level: 28, isVerified: false },
      eventName: 'Code Warriors League',
      category: 'question',
      likes: 45,
      replies: 23,
      views: 380,
      isLiked: true,
      createdAt: '5h ago',
      tags: ['rewards', 'help', 'newbie'],
    },
    {
      id: '3',
      title: 'Official: New Challenge Format Announcement 📢',
      content: 'We\'re excited to announce a new challenge format starting next month! Introducing Team Battles - form squads of 4 and compete together.',
      author: { name: 'GreedHunter Team', level: 99, isVerified: true },
      eventName: 'GreedHunter Updates',
      category: 'announcement',
      likes: 892,
      replies: 156,
      views: 5420,
      isLiked: false,
      createdAt: '1d ago',
      tags: ['official', 'update', 'teams'],
    },
    {
      id: '4',
      title: 'My journey from Level 1 to Level 40',
      content: 'It\'s been 6 months since I joined GreedHunter and I wanted to share my experience. The community here is amazing and I\'ve learned so much...',
      author: { name: 'Mike Coder', level: 40, isVerified: false },
      eventName: 'General Discussion',
      category: 'discussion',
      likes: 178,
      replies: 34,
      views: 890,
      isLiked: false,
      createdAt: '2d ago',
      tags: ['journey', 'experience', 'growth'],
    },
  ];

  const filters = [
    { id: 'trending', label: 'Trending', icon: Flame, count: 24 },
    { id: 'recent', label: 'Recent', icon: Clock, count: 156 },
    { id: 'popular', label: 'Popular', icon: TrendingUp, count: 89 },
    { id: 'mine', label: 'Your Threads', icon: MessageSquare, count: 12 },
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
            <Users className="w-8 h-8 text-[#8b5cf6]" />
            Community
          </h1>
          <p className="text-gray-400">Connect, discuss, and grow with fellow hunters</p>
        </div>
        
        <motion.button
          className="px-6 py-3 bg-gradient-to-r from-[#00ff88] to-[#00d9ff] text-black font-bold rounded-xl flex items-center gap-2"
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
        >
          <Zap className="w-5 h-5" />
          New Thread
        </motion.button>
      </motion.div>

      {/* Stats Bar */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1 }}
        className="grid grid-cols-2 lg:grid-cols-4 gap-4"
      >
        {[
          { label: 'Active Threads', value: '2.4K', color: '#00ff88' },
          { label: 'Online Members', value: '847', color: '#00d9ff' },
          { label: 'Your Posts', value: '23', color: '#8b5cf6' },
          { label: 'Your Karma', value: '1,245', color: '#ffd700' },
        ].map((stat, i) => (
          <div key={i} className="bg-[#141420]/80 backdrop-blur-xl border border-white/10 rounded-xl p-4 text-center">
            <p className="text-2xl font-bold" style={{ color: stat.color }}>{stat.value}</p>
            <p className="text-gray-500 text-sm">{stat.label}</p>
          </div>
        ))}
      </motion.div>

      {/* Filters */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2 }}
        className="flex flex-wrap gap-2"
      >
        {filters.map((filter) => (
          <FilterTab
            key={filter.id}
            label={filter.label}
            icon={filter.icon}
            active={activeFilter === filter.id}
            onClick={() => setActiveFilter(filter.id)}
            count={filter.count}
          />
        ))}
      </motion.div>

      {/* Threads List */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.3 }}
        className="space-y-4"
      >
        {threads.map((thread, index) => (
          <motion.div
            key={thread.id}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 * index }}
          >
            <ThreadCard
              thread={thread}
              onClick={() => setSelectedThread(thread)}
            />
          </motion.div>
        ))}
      </motion.div>

      {/* Thread Modal */}
      <ThreadModal thread={selectedThread} onClose={() => setSelectedThread(null)} />
    </div>
  );
}
