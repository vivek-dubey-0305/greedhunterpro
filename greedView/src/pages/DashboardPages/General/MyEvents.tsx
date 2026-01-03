import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Calendar, 
  Clock, 
  MapPin, 
  Users, 
  Coins, 
  ChevronRight,
  Filter,
  Search,
  Trophy,
  Zap,
  Star,
  X
} from 'lucide-react';

// Event type definition
interface Event {
  id: string;
  title: string;
  description: string;
  date: string;
  time: string;
  location: string;
  type: 'workshop' | 'hackathon' | 'competition' | 'bootcamp' | 'meetup';
  status: 'upcoming' | 'ongoing' | 'completed';
  reward: number;
  participants: number;
  maxParticipants: number;
  image?: string;
}

// Status tab component
function StatusTabs({ activeStatus, onStatusChange }: { 
  activeStatus: string; 
  onStatusChange: (status: string) => void;
}) {
  const statuses = [
    { id: 'all', label: 'All Events', count: 12 },
    { id: 'upcoming', label: 'Upcoming', count: 5 },
    { id: 'ongoing', label: 'Ongoing', count: 3 },
    { id: 'completed', label: 'Completed', count: 4 },
  ];

  return (
    <div className="flex flex-wrap gap-2">
      {statuses.map((status) => (
        <motion.button
          key={status.id}
          onClick={() => onStatusChange(status.id)}
          className={`relative px-4 py-2 rounded-xl text-sm font-medium transition-all ${
            activeStatus === status.id
              ? 'text-[#00ff88]'
              : 'text-gray-400 hover:text-white'
          }`}
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
        >
          {activeStatus === status.id && (
            <motion.div
              layoutId="activeStatusBg"
              className="absolute inset-0 bg-[#00ff88]/10 border border-[#00ff88]/30 rounded-xl"
              transition={{ type: 'spring', stiffness: 300, damping: 30 }}
            />
          )}
          <span className="relative z-10 flex items-center gap-2">
            {status.label}
            <span className={`px-1.5 py-0.5 rounded text-xs ${
              activeStatus === status.id
                ? 'bg-[#00ff88]/20 text-[#00ff88]'
                : 'bg-white/10 text-gray-400'
            }`}>
              {status.count}
            </span>
          </span>
        </motion.button>
      ))}
    </div>
  );
}

// Event Card Component
function EventCard({ event, onClick }: { event: Event; onClick: () => void }) {
  const statusColors = {
    upcoming: { bg: 'bg-[#00d9ff]/10', text: 'text-[#00d9ff]', border: 'border-[#00d9ff]/30' },
    ongoing: { bg: 'bg-[#00ff88]/10', text: 'text-[#00ff88]', border: 'border-[#00ff88]/30' },
    completed: { bg: 'bg-[#ffd700]/10', text: 'text-[#ffd700]', border: 'border-[#ffd700]/30' },
  };

  const typeIcons = {
    workshop: '🎓',
    hackathon: '💻',
    competition: '🏆',
    bootcamp: '🚀',
    meetup: '🤝',
  };

  const colors = statusColors[event.status];

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      whileHover={{ y: -8, scale: 1.02 }}
      whileTap={{ scale: 0.98 }}
      onClick={onClick}
      className="relative group cursor-pointer"
    >
      {/* Glow effect on hover */}
      <motion.div
        className={`absolute inset-0 rounded-2xl blur-xl opacity-0 group-hover:opacity-100 transition-opacity duration-500 ${
          event.status === 'ongoing' ? 'bg-[#00ff88]/20' :
          event.status === 'upcoming' ? 'bg-[#00d9ff]/20' : 'bg-[#ffd700]/20'
        }`}
      />
      
      <div className="relative bg-[#141420]/80 backdrop-blur-xl border border-white/10 rounded-2xl overflow-hidden group-hover:border-white/20 transition-all">
        {/* Event Image/Banner */}
        <div className="relative h-40 bg-gradient-to-br from-[#1a1a2e] to-[#0d0d14] overflow-hidden">
          <div className="absolute inset-0 opacity-30">
            <div className="w-full h-full" style={{
              backgroundImage: 'radial-gradient(circle at 50% 50%, rgba(0,255,136,0.1) 0%, transparent 50%)',
            }} />
          </div>
          
          {/* Type badge */}
          <div className="absolute top-4 left-4 flex items-center gap-2">
            <span className="text-2xl">{typeIcons[event.type]}</span>
            <span className="px-3 py-1 bg-black/50 backdrop-blur-md rounded-lg text-white text-sm font-medium capitalize">
              {event.type}
            </span>
          </div>
          
          {/* Status badge */}
          <div className={`absolute top-4 right-4 px-3 py-1 rounded-lg text-xs font-semibold uppercase tracking-wider ${colors.bg} ${colors.text} border ${colors.border}`}>
            {event.status}
          </div>
          
          {/* Reward */}
          <div className="absolute bottom-4 right-4 flex items-center gap-1 px-3 py-1.5 bg-[#ffd700]/20 backdrop-blur-md rounded-lg">
            <Coins className="w-4 h-4 text-[#ffd700]" />
            <span className="text-[#ffd700] font-bold">{event.reward}</span>
          </div>
        </div>
        
        {/* Content */}
        <div className="p-5">
          <h3 className="text-lg font-bold text-white mb-2 line-clamp-2 group-hover:text-[#00ff88] transition-colors">
            {event.title}
          </h3>
          
          <p className="text-gray-400 text-sm mb-4 line-clamp-2">{event.description}</p>
          
          <div className="space-y-2 text-sm">
            <div className="flex items-center gap-2 text-gray-400">
              <Calendar className="w-4 h-4 text-[#00ff88]" />
              <span>{event.date}</span>
              <Clock className="w-4 h-4 text-[#00d9ff] ml-2" />
              <span>{event.time}</span>
            </div>
            
            <div className="flex items-center gap-2 text-gray-400">
              <MapPin className="w-4 h-4 text-[#8b5cf6]" />
              <span className="truncate">{event.location}</span>
            </div>
            
            <div className="flex items-center gap-2 text-gray-400">
              <Users className="w-4 h-4 text-[#ff6b6b]" />
              <span>{event.participants}/{event.maxParticipants} participants</span>
            </div>
          </div>
        </div>
        
        {/* Footer */}
        <div className="px-5 py-3 border-t border-white/5 flex items-center justify-between">
          <span className="text-sm text-gray-500">View Details</span>
          <ChevronRight className="w-5 h-5 text-gray-500 group-hover:text-[#00ff88] group-hover:translate-x-1 transition-all" />
        </div>
      </div>
    </motion.div>
  );
}

// Event Detail Modal
function EventDetailModal({ event, onClose }: { event: Event | null; onClose: () => void }) {
  if (!event) return null;

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
          className="relative w-full max-w-2xl bg-[#141420] border border-white/10 rounded-2xl overflow-hidden"
          onClick={(e) => e.stopPropagation()}
        >
          {/* Header */}
          <div className="relative h-48 bg-gradient-to-br from-[#1a1a2e] to-[#0d0d14]">
            <div className="absolute inset-0 bg-gradient-to-t from-[#141420] to-transparent" />
            
            <motion.button
              onClick={onClose}
              className="absolute top-4 right-4 p-2 bg-black/50 rounded-lg hover:bg-black/70 transition-colors"
              whileHover={{ scale: 1.1, rotate: 90 }}
              whileTap={{ scale: 0.9 }}
            >
              <X className="w-5 h-5 text-white" />
            </motion.button>
            
            <div className="absolute bottom-4 left-6 right-6">
              <div className={`inline-block px-3 py-1 rounded-lg text-xs font-semibold uppercase mb-2 ${
                event.status === 'ongoing' ? 'bg-[#00ff88]/20 text-[#00ff88]' :
                event.status === 'upcoming' ? 'bg-[#00d9ff]/20 text-[#00d9ff]' :
                'bg-[#ffd700]/20 text-[#ffd700]'
              }`}>
                {event.status}
              </div>
              <h2 className="text-2xl font-bold text-white">{event.title}</h2>
            </div>
          </div>
          
          {/* Content */}
          <div className="p-6 space-y-6">
            <p className="text-gray-300">{event.description}</p>
            
            <div className="grid grid-cols-2 gap-4">
              <div className="p-4 bg-[#1a1a2e] rounded-xl">
                <div className="flex items-center gap-2 text-gray-400 mb-1">
                  <Calendar className="w-4 h-4 text-[#00ff88]" />
                  <span className="text-sm">Date & Time</span>
                </div>
                <p className="text-white font-medium">{event.date} at {event.time}</p>
              </div>
              
              <div className="p-4 bg-[#1a1a2e] rounded-xl">
                <div className="flex items-center gap-2 text-gray-400 mb-1">
                  <MapPin className="w-4 h-4 text-[#8b5cf6]" />
                  <span className="text-sm">Location</span>
                </div>
                <p className="text-white font-medium">{event.location}</p>
              </div>
              
              <div className="p-4 bg-[#1a1a2e] rounded-xl">
                <div className="flex items-center gap-2 text-gray-400 mb-1">
                  <Users className="w-4 h-4 text-[#00d9ff]" />
                  <span className="text-sm">Participants</span>
                </div>
                <p className="text-white font-medium">{event.participants}/{event.maxParticipants}</p>
              </div>
              
              <div className="p-4 bg-[#1a1a2e] rounded-xl">
                <div className="flex items-center gap-2 text-gray-400 mb-1">
                  <Coins className="w-4 h-4 text-[#ffd700]" />
                  <span className="text-sm">Reward</span>
                </div>
                <p className="text-[#ffd700] font-bold text-xl">{event.reward} Coins</p>
              </div>
            </div>
            
            {event.status !== 'completed' && (
              <motion.button
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                className="w-full py-4 bg-gradient-to-r from-[#00ff88] to-[#00d9ff] text-black font-bold rounded-xl"
              >
                {event.status === 'ongoing' ? 'Join Now' : 'Set Reminder'}
              </motion.button>
            )}
          </div>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
}

// Empty State Component
function EmptyState() {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="flex flex-col items-center justify-center py-20 text-center"
    >
      <motion.div
        animate={{ y: [0, -10, 0] }}
        transition={{ duration: 2, repeat: Infinity }}
      >
        <Calendar className="w-20 h-20 text-gray-600 mb-4" />
      </motion.div>
      <h3 className="text-xl font-bold text-white mb-2">No Events Found</h3>
      <p className="text-gray-400 mb-6">You haven't registered for any events yet.</p>
      <motion.button
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
        className="px-6 py-3 bg-gradient-to-r from-[#00ff88] to-[#00d9ff] text-black font-bold rounded-xl"
      >
        Explore Events
      </motion.button>
    </motion.div>
  );
}

// Main Component
export function MyEvents() {
  const [activeStatus, setActiveStatus] = useState('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedEvent, setSelectedEvent] = useState<Event | null>(null);

  // Mock events data
  const events: Event[] = [
    {
      id: '1',
      title: 'React Advanced Workshop',
      description: 'Deep dive into React hooks, patterns, and performance optimization techniques.',
      date: 'Dec 15, 2024',
      time: '10:00 AM',
      location: 'Virtual - Zoom',
      type: 'workshop',
      status: 'upcoming',
      reward: 200,
      participants: 45,
      maxParticipants: 100,
    },
    {
      id: '2',
      title: 'Hackathon 2024',
      description: 'Build innovative solutions in 48 hours and compete for amazing prizes.',
      date: 'Dec 20, 2024',
      time: '9:00 AM',
      location: 'Tech Hub, Downtown',
      type: 'hackathon',
      status: 'upcoming',
      reward: 1000,
      participants: 120,
      maxParticipants: 150,
    },
    {
      id: '3',
      title: 'AI/ML Bootcamp',
      description: 'Intensive training program on machine learning fundamentals and applications.',
      date: 'Dec 10, 2024',
      time: '2:00 PM',
      location: 'Virtual - Google Meet',
      type: 'bootcamp',
      status: 'ongoing',
      reward: 300,
      participants: 80,
      maxParticipants: 80,
    },
    {
      id: '4',
      title: 'Code Golf Championship',
      description: 'Solve problems with the shortest code possible.',
      date: 'Dec 5, 2024',
      time: '3:00 PM',
      location: 'Virtual',
      type: 'competition',
      status: 'completed',
      reward: 500,
      participants: 200,
      maxParticipants: 200,
    },
  ];

  const filteredEvents = events.filter(event => {
    const matchesStatus = activeStatus === 'all' || event.status === activeStatus;
    const matchesSearch = event.title.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesStatus && matchesSearch;
  });

  return (
    <div className="space-y-6">
      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4"
      >
        <div>
          <h1 className="text-3xl font-black text-white mb-2">My Events</h1>
          <p className="text-gray-400">Track and manage your registered events</p>
        </div>
        
        {/* Search */}
        <div className="relative">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-500" />
          <input
            type="text"
            placeholder="Search events..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-12 pr-4 py-3 bg-[#141420] border border-white/10 rounded-xl text-white placeholder-gray-500 focus:border-[#00ff88]/50 focus:outline-none w-full lg:w-64 transition-colors"
          />
        </div>
      </motion.div>

      {/* Status Tabs */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1 }}
      >
        <StatusTabs activeStatus={activeStatus} onStatusChange={setActiveStatus} />
      </motion.div>

      {/* Events Grid */}
      {filteredEvents.length > 0 ? (
        <motion.div
          className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.2 }}
        >
          {filteredEvents.map((event, index) => (
            <motion.div
              key={event.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 * index }}
            >
              <EventCard event={event} onClick={() => setSelectedEvent(event)} />
            </motion.div>
          ))}
        </motion.div>
      ) : (
        <EmptyState />
      )}

      {/* Event Detail Modal */}
      <EventDetailModal event={selectedEvent} onClose={() => setSelectedEvent(null)} />
    </div>
  );
}
