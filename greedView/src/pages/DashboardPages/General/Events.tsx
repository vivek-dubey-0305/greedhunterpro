import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Calendar, 
  Clock, 
  MapPin, 
  Users, 
  Coins, 
  Search,
  Filter,
  ChevronDown,
  Star,
  Zap,
  Trophy,
  BookOpen,
  Code,
  Mic,
  ArrowUpDown
} from 'lucide-react';

// Event interface
interface Event {
  id: string;
  title: string;
  description: string;
  date: string;
  time: string;
  location: string;
  category: 'workshop' | 'hackathon' | 'competition' | 'bootcamp' | 'meetup' | 'webinar';
  difficulty: 'beginner' | 'intermediate' | 'advanced';
  reward: number;
  participants: number;
  maxParticipants: number;
  isRegistered: boolean;
  isFeatured: boolean;
  tags: string[];
}

// Category config
const categoryConfig = {
  workshop: { icon: BookOpen, color: '#00d9ff', label: 'Workshop' },
  hackathon: { icon: Code, color: '#8b5cf6', label: 'Hackathon' },
  competition: { icon: Trophy, color: '#ffd700', label: 'Competition' },
  bootcamp: { icon: Zap, color: '#00ff88', label: 'Bootcamp' },
  meetup: { icon: Users, color: '#ff6b6b', label: 'Meetup' },
  webinar: { icon: Mic, color: '#ff8c00', label: 'Webinar' },
};

// Featured Event Card
function FeaturedEventCard({ event, onRegister }: { event: Event; onRegister: (id: string) => void }) {
  const category = categoryConfig[event.category];
  const CategoryIcon = category.icon;

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      whileHover={{ scale: 1.02 }}
      className="relative bg-gradient-to-br from-[#141420] to-[#1a1a2e] border border-[#00ff88]/30 rounded-2xl overflow-hidden"
    >
      {/* Animated background */}
      <div className="absolute inset-0 overflow-hidden">
        <motion.div
          className="absolute w-96 h-96 rounded-full bg-[#00ff88]/10 blur-3xl"
          style={{ top: '-50%', right: '-20%' }}
          animate={{ scale: [1, 1.2, 1], rotate: [0, 90, 0] }}
          transition={{ duration: 10, repeat: Infinity }}
        />
      </div>
      
      <div className="relative p-6 lg:p-8">
        <div className="flex flex-col lg:flex-row lg:items-center gap-6">
          <div className="flex-1">
            {/* Featured badge */}
            <motion.div 
              className="inline-flex items-center gap-2 px-3 py-1 bg-[#ffd700]/20 border border-[#ffd700]/30 rounded-full mb-4"
              animate={{ scale: [1, 1.05, 1] }}
              transition={{ duration: 2, repeat: Infinity }}
            >
              <Star className="w-4 h-4 text-[#ffd700] fill-[#ffd700]" />
              <span className="text-[#ffd700] text-sm font-medium">Featured Event</span>
            </motion.div>
            
            <div className="flex items-center gap-3 mb-3">
              <div className="p-2 rounded-lg" style={{ backgroundColor: `${category.color}20` }}>
                <CategoryIcon className="w-5 h-5" style={{ color: category.color }} />
              </div>
              <span className="text-gray-400 text-sm">{category.label}</span>
            </div>
            
            <h2 className="text-2xl lg:text-3xl font-bold text-white mb-3">{event.title}</h2>
            <p className="text-gray-400 mb-4 line-clamp-2">{event.description}</p>
            
            <div className="flex flex-wrap items-center gap-4 text-sm text-gray-400 mb-4">
              <div className="flex items-center gap-2">
                <Calendar className="w-4 h-4 text-[#00ff88]" />
                <span>{event.date}</span>
              </div>
              <div className="flex items-center gap-2">
                <Clock className="w-4 h-4 text-[#00d9ff]" />
                <span>{event.time}</span>
              </div>
              <div className="flex items-center gap-2">
                <MapPin className="w-4 h-4 text-[#8b5cf6]" />
                <span>{event.location}</span>
              </div>
              <div className="flex items-center gap-2">
                <Users className="w-4 h-4 text-[#ff6b6b]" />
                <span>{event.participants}/{event.maxParticipants}</span>
              </div>
            </div>
            
            <div className="flex flex-wrap gap-2 mb-4">
              {event.tags.map((tag, i) => (
                <span key={i} className="px-2 py-1 bg-white/5 rounded text-xs text-gray-400">
                  {tag}
                </span>
              ))}
            </div>
          </div>
          
          <div className="flex flex-col items-center lg:items-end gap-4">
            <div className="flex items-center gap-2 px-4 py-2 bg-[#ffd700]/10 rounded-xl">
              <Coins className="w-6 h-6 text-[#ffd700]" />
              <span className="text-[#ffd700] font-bold text-2xl">{event.reward}</span>
            </div>
            
            <motion.button
              onClick={() => onRegister(event.id)}
              className={`px-8 py-4 rounded-xl font-bold text-lg transition-all ${
                event.isRegistered
                  ? 'bg-[#00ff88]/20 text-[#00ff88] border border-[#00ff88]/30'
                  : 'bg-gradient-to-r from-[#00ff88] to-[#00d9ff] text-black'
              }`}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              {event.isRegistered ? '✓ Registered' : 'Register Now'}
            </motion.button>
          </div>
        </div>
      </div>
    </motion.div>
  );
}

// Event Card Component
function EventCard({ event, onRegister }: { event: Event; onRegister: (id: string) => void }) {
  const category = categoryConfig[event.category];
  const CategoryIcon = category.icon;

  const difficultyColors = {
    beginner: '#00ff88',
    intermediate: '#ffd700',
    advanced: '#ff6b6b',
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      whileHover={{ y: -8, scale: 1.02 }}
      className="relative group"
    >
      <motion.div
        className="absolute inset-0 rounded-2xl blur-xl opacity-0 group-hover:opacity-100 transition-opacity duration-500"
        style={{ backgroundColor: `${category.color}15` }}
      />
      
      <div className="relative bg-[#141420]/80 backdrop-blur-xl border border-white/10 rounded-2xl overflow-hidden group-hover:border-white/20 transition-all">
        {/* Header */}
        <div className="p-5">
          <div className="flex items-start justify-between mb-3">
            <div className="flex items-center gap-2">
              <div className="p-2 rounded-lg" style={{ backgroundColor: `${category.color}15` }}>
                <CategoryIcon className="w-5 h-5" style={{ color: category.color }} />
              </div>
              <span className="text-sm text-gray-400">{category.label}</span>
            </div>
            
            <span 
              className="px-2 py-0.5 rounded text-xs font-medium capitalize"
              style={{ 
                backgroundColor: `${difficultyColors[event.difficulty]}15`,
                color: difficultyColors[event.difficulty]
              }}
            >
              {event.difficulty}
            </span>
          </div>
          
          <h3 className="text-lg font-bold text-white mb-2 group-hover:text-[#00ff88] transition-colors line-clamp-2">
            {event.title}
          </h3>
          
          <p className="text-gray-400 text-sm line-clamp-2 mb-4">{event.description}</p>
          
          <div className="space-y-2 text-sm text-gray-400">
            <div className="flex items-center gap-2">
              <Calendar className="w-4 h-4 text-[#00ff88]" />
              <span>{event.date}</span>
              <Clock className="w-4 h-4 text-[#00d9ff] ml-2" />
              <span>{event.time}</span>
            </div>
            <div className="flex items-center gap-2">
              <MapPin className="w-4 h-4 text-[#8b5cf6]" />
              <span className="truncate">{event.location}</span>
            </div>
          </div>
        </div>
        
        {/* Footer */}
        <div className="px-5 py-4 border-t border-white/5 flex items-center justify-between">
          <div className="flex items-center gap-4">
            <div className="flex items-center gap-1 text-gray-400 text-sm">
              <Users className="w-4 h-4" />
              <span>{event.participants}/{event.maxParticipants}</span>
            </div>
            <div className="flex items-center gap-1">
              <Coins className="w-4 h-4 text-[#ffd700]" />
              <span className="text-[#ffd700] font-bold">{event.reward}</span>
            </div>
          </div>
          
          <motion.button
            onClick={() => onRegister(event.id)}
            className={`px-4 py-2 rounded-lg text-sm font-medium transition-all ${
              event.isRegistered
                ? 'bg-[#00ff88]/20 text-[#00ff88] border border-[#00ff88]/30'
                : 'bg-[#00ff88] text-black hover:bg-[#00ff88]/90'
            }`}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
          >
            {event.isRegistered ? 'Registered' : 'Register'}
          </motion.button>
        </div>
      </div>
    </motion.div>
  );
}

// Filter Dropdown Component
function FilterDropdown({ label, options, value, onChange }: {
  label: string;
  options: { id: string; label: string }[];
  value: string;
  onChange: (value: string) => void;
}) {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <div className="relative">
      <motion.button
        onClick={() => setIsOpen(!isOpen)}
        className="flex items-center gap-2 px-4 py-2 bg-[#141420] border border-white/10 rounded-xl text-sm text-gray-400 hover:text-white hover:border-white/20 transition-colors"
        whileHover={{ scale: 1.02 }}
        whileTap={{ scale: 0.98 }}
      >
        <span>{label}: {options.find(o => o.id === value)?.label || 'All'}</span>
        <ChevronDown className={`w-4 h-4 transition-transform ${isOpen ? 'rotate-180' : ''}`} />
      </motion.button>
      
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            className="absolute top-full left-0 mt-2 w-48 bg-[#141420] border border-white/10 rounded-xl overflow-hidden z-20 shadow-xl"
          >
            {options.map((option) => (
              <button
                key={option.id}
                onClick={() => {
                  onChange(option.id);
                  setIsOpen(false);
                }}
                className={`w-full px-4 py-2 text-left text-sm transition-colors ${
                  value === option.id
                    ? 'bg-[#00ff88]/10 text-[#00ff88]'
                    : 'text-gray-400 hover:bg-white/5 hover:text-white'
                }`}
              >
                {option.label}
              </button>
            ))}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

// Main Component
export function Events() {
  const [searchQuery, setSearchQuery] = useState('');
  const [categoryFilter, setCategoryFilter] = useState('all');
  const [difficultyFilter, setDifficultyFilter] = useState('all');
  const [sortBy, setSortBy] = useState('date');
  const [registeredEvents, setRegisteredEvents] = useState<string[]>([]);

  const events: Event[] = [
    {
      id: '1',
      title: 'React Advanced Workshop: Hooks, Patterns & Performance',
      description: 'Deep dive into advanced React concepts including custom hooks, render optimization, and design patterns.',
      date: 'Dec 15, 2024',
      time: '10:00 AM',
      location: 'Virtual - Zoom',
      category: 'workshop',
      difficulty: 'advanced',
      reward: 300,
      participants: 78,
      maxParticipants: 100,
      isRegistered: false,
      isFeatured: true,
      tags: ['React', 'TypeScript', 'Performance'],
    },
    {
      id: '2',
      title: 'Hackathon 2024: Build the Future',
      description: '48-hour coding marathon to build innovative solutions.',
      date: 'Dec 20, 2024',
      time: '9:00 AM',
      location: 'Tech Hub, Downtown',
      category: 'hackathon',
      difficulty: 'intermediate',
      reward: 1000,
      participants: 245,
      maxParticipants: 300,
      isRegistered: true,
      isFeatured: false,
      tags: ['Innovation', 'Teams', 'Prizes'],
    },
    {
      id: '3',
      title: 'AI/ML Bootcamp for Beginners',
      description: 'Start your journey in machine learning with hands-on projects.',
      date: 'Dec 22, 2024',
      time: '2:00 PM',
      location: 'Virtual - Google Meet',
      category: 'bootcamp',
      difficulty: 'beginner',
      reward: 250,
      participants: 156,
      maxParticipants: 200,
      isRegistered: false,
      isFeatured: false,
      tags: ['Python', 'TensorFlow', 'Beginner-Friendly'],
    },
    {
      id: '4',
      title: 'Code Golf Championship',
      description: 'Solve problems with the shortest code possible.',
      date: 'Dec 25, 2024',
      time: '3:00 PM',
      location: 'Virtual',
      category: 'competition',
      difficulty: 'advanced',
      reward: 500,
      participants: 89,
      maxParticipants: 150,
      isRegistered: false,
      isFeatured: false,
      tags: ['Algorithm', 'Optimization'],
    },
    {
      id: '5',
      title: 'Web Dev Community Meetup',
      description: 'Network with fellow developers and share experiences.',
      date: 'Dec 28, 2024',
      time: '6:00 PM',
      location: 'Coffee Hub, City Center',
      category: 'meetup',
      difficulty: 'beginner',
      reward: 50,
      participants: 34,
      maxParticipants: 50,
      isRegistered: false,
      isFeatured: false,
      tags: ['Networking', 'Community'],
    },
    {
      id: '6',
      title: 'System Design Masterclass',
      description: 'Learn how to design scalable systems from industry experts.',
      date: 'Jan 5, 2025',
      time: '11:00 AM',
      location: 'Virtual - Teams',
      category: 'webinar',
      difficulty: 'intermediate',
      reward: 200,
      participants: 412,
      maxParticipants: 500,
      isRegistered: false,
      isFeatured: false,
      tags: ['Architecture', 'Scalability'],
    },
  ];

  const featuredEvent = events.find(e => e.isFeatured);
  
  const filteredEvents = events
    .filter(e => !e.isFeatured)
    .filter(e => {
      const matchesSearch = e.title.toLowerCase().includes(searchQuery.toLowerCase());
      const matchesCategory = categoryFilter === 'all' || e.category === categoryFilter;
      const matchesDifficulty = difficultyFilter === 'all' || e.difficulty === difficultyFilter;
      return matchesSearch && matchesCategory && matchesDifficulty;
    })
    .map(e => ({
      ...e,
      isRegistered: registeredEvents.includes(e.id)
    }));

  const handleRegister = (id: string) => {
    if (registeredEvents.includes(id)) {
      setRegisteredEvents(registeredEvents.filter(e => e !== id));
    } else {
      setRegisteredEvents([...registeredEvents, id]);
    }
  };

  const categoryOptions = [
    { id: 'all', label: 'All Categories' },
    ...Object.entries(categoryConfig).map(([id, config]) => ({ id, label: config.label }))
  ];

  const difficultyOptions = [
    { id: 'all', label: 'All Levels' },
    { id: 'beginner', label: 'Beginner' },
    { id: 'intermediate', label: 'Intermediate' },
    { id: 'advanced', label: 'Advanced' },
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
            <Calendar className="w-8 h-8 text-[#00d9ff]" />
            Explore Events
          </h1>
          <p className="text-gray-400">Discover and join exciting events to earn rewards</p>
        </div>
        
        {/* Search */}
        <div className="relative">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-500" />
          <input
            type="text"
            placeholder="Search events..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-12 pr-4 py-3 bg-[#141420] border border-white/10 rounded-xl text-white placeholder-gray-500 focus:border-[#00ff88]/50 focus:outline-none w-full lg:w-80 transition-colors"
          />
        </div>
      </motion.div>

      {/* Filters */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1 }}
        className="flex flex-wrap gap-3"
      >
        <FilterDropdown
          label="Category"
          options={categoryOptions}
          value={categoryFilter}
          onChange={setCategoryFilter}
        />
        <FilterDropdown
          label="Difficulty"
          options={difficultyOptions}
          value={difficultyFilter}
          onChange={setDifficultyFilter}
        />
        <motion.button
          className="flex items-center gap-2 px-4 py-2 bg-[#141420] border border-white/10 rounded-xl text-sm text-gray-400 hover:text-white hover:border-white/20 transition-colors"
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
        >
          <ArrowUpDown className="w-4 h-4" />
          <span>Sort by Date</span>
        </motion.button>
      </motion.div>

      {/* Featured Event */}
      {featuredEvent && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
        >
          <FeaturedEventCard 
            event={{
              ...featuredEvent,
              isRegistered: registeredEvents.includes(featuredEvent.id)
            }} 
            onRegister={handleRegister}
          />
        </motion.div>
      )}

      {/* Events Grid */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.3 }}
        className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6"
      >
        {filteredEvents.map((event, index) => (
          <motion.div
            key={event.id}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 * index }}
          >
            <EventCard event={event} onRegister={handleRegister} />
          </motion.div>
        ))}
      </motion.div>

      {filteredEvents.length === 0 && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="text-center py-20"
        >
          <Calendar className="w-16 h-16 text-gray-600 mx-auto mb-4" />
          <h3 className="text-xl font-bold text-white mb-2">No Events Found</h3>
          <p className="text-gray-400">Try adjusting your filters or search query</p>
        </motion.div>
      )}
    </div>
  );
}
