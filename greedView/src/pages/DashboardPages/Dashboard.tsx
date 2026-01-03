import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  LayoutDashboard, 
  Calendar, 
  Target, 
  Trophy,
  Compass,
  MessageSquare,
  Search,
  Users,
  Crown,
  History,
  Shield,
  Lock,
  Eye,
  AlertTriangle,
  BarChart3,
  TrendingUp,
  PieChart,
  CreditCard,
  Store,
  Info,
  FileText,
  Ticket,
  ChevronLeft,
  ChevronRight,
  Menu,
  X,
  Coins,
  Zap
} from 'lucide-react';
import { DashboardLoadingScreen } from './DashboardLoadingScreen';

// Import all dashboard pages
import { Overview } from './General/Overview';
import { MyEvents } from './General/MyEvents';
import { DailyMission } from './General/DailyMission';
import { Challenges } from './General/Challenges';
import { Events } from './General/Events';
import { Chat } from './Explore/Chat';
import { Seek } from './Explore/Seek';
import { Community } from './Explore/Community';
import { TopProfile } from './Explore/TopProfile';
import { History as HistoryPage } from './History/History';
import { SecurityProfile } from './Security/SecurityProfile';
import { MultiFactorAuthentication } from './Security/MultiFactorAuthentication';
import { PrivacyControl } from './Security/PrivacyControl';
import { DangerZone } from './Security/DangerZone';
import { ChallengeStats } from './Stats/ChallengeStats/ChallengeStats';
import { DailyMissionStats } from './Stats/DailyMissionStats/DailyMissionStats';
import { EventStats } from './Stats/EventStats/EventStats';
import { PaymentStats } from './Stats/PaymentStats/PaymentStats';
import { AboutGreedStore } from './Store/AboutGreedStore';
import { GreedStore } from './Store/GreedStore';
import { GreedStorePolicy } from './Store/GreedStorePolicy';
import { GreedTicket } from './Store/GreedTicket';

// Define navigation structure
const navigationSections = [
  {
    title: 'General',
    icon: LayoutDashboard,
    items: [
      { id: 'overview', label: 'Overview', icon: LayoutDashboard },
      { id: 'my-events', label: 'My Events', icon: Calendar },
      { id: 'daily-missions', label: 'Daily Missions', icon: Target },
      { id: 'challenges', label: 'Challenges', icon: Trophy },
      { id: 'events', label: 'Explore Events', icon: Compass },
    ]
  },
  {
    title: 'Explore',
    icon: Compass,
    items: [
      { id: 'chat', label: 'Chat', icon: MessageSquare },
      { id: 'seek', label: 'Seek Users', icon: Search },
      { id: 'community', label: 'Community', icon: Users },
      { id: 'top-profiles', label: 'Top Profiles', icon: Crown },
    ]
  },
  {
    title: 'Stats',
    icon: BarChart3,
    items: [
      { id: 'challenge-stats', label: 'Challenge Stats', icon: TrendingUp },
      { id: 'mission-stats', label: 'Mission Stats', icon: PieChart },
      { id: 'event-stats', label: 'Event Stats', icon: BarChart3 },
      { id: 'payment-stats', label: 'Payment Stats', icon: CreditCard },
    ]
  },
  {
    title: 'Store',
    icon: Store,
    items: [
      { id: 'greed-store', label: 'GreedStore', icon: Store },
      { id: 'about-store', label: 'About Store', icon: Info },
      { id: 'store-policy', label: 'Store Policy', icon: FileText },
      { id: 'greed-ticket', label: 'My Ticket', icon: Ticket },
    ]
  },
  {
    title: 'Security',
    icon: Shield,
    items: [
      { id: 'security-profile', label: 'Security Profile', icon: Shield },
      { id: 'mfa', label: 'Two-Factor Auth', icon: Lock },
      { id: 'privacy', label: 'Privacy Control', icon: Eye },
      { id: 'danger-zone', label: 'Danger Zone', icon: AlertTriangle },
    ]
  },
  {
    title: 'History',
    icon: History,
    items: [
      { id: 'history', label: 'Activity History', icon: History },
    ]
  }
];

// Page component map
const pageComponents: { [key: string]: React.ComponentType } = {
  'overview': Overview,
  'my-events': MyEvents,
  'daily-missions': DailyMission,
  'challenges': Challenges,
  'events': Events,
  'chat': Chat,
  'seek': Seek,
  'community': Community,
  'top-profiles': TopProfile,
  'challenge-stats': ChallengeStats,
  'mission-stats': DailyMissionStats,
  'event-stats': EventStats,
  'payment-stats': PaymentStats,
  'greed-store': GreedStore,
  'about-store': AboutGreedStore,
  'store-policy': GreedStorePolicy,
  'greed-ticket': GreedTicket,
  'security-profile': SecurityProfile,
  'mfa': MultiFactorAuthentication,
  'privacy': PrivacyControl,
  'danger-zone': DangerZone,
  'history': HistoryPage,
};

// Sidebar Navigation Item
interface NavItemProps {
  item: { id: string; label: string; icon: React.ComponentType<{ className?: string }> };
  isActive: boolean;
  onClick: () => void;
  isCollapsed: boolean;
}

function NavItem({ item, isActive, onClick, isCollapsed }: NavItemProps) {
  const Icon = item.icon;
  
  return (
    <motion.button
      onClick={onClick}
      className={`
        relative w-full flex items-center gap-3 px-3 py-2.5 rounded-lg
        transition-all duration-200 group
        ${isActive 
          ? 'bg-[#00ff88]/10 text-[#00ff88]' 
          : 'text-gray-400 hover:text-white hover:bg-white/5'
        }
      `}
      whileHover={{ x: isCollapsed ? 0 : 4 }}
      whileTap={{ scale: 0.98 }}
    >
      {/* Active indicator */}
      {isActive && (
        <motion.div
          layoutId="activeIndicator"
          className="absolute left-0 top-1/2 -translate-y-1/2 w-1 h-6 bg-[#00ff88] rounded-r-full"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ type: 'spring', stiffness: 300, damping: 30 }}
        />
      )}
      
      <Icon className={`w-5 h-5 flex-shrink-0 ${isActive ? 'drop-shadow-[0_0_8px_#00ff88]' : ''}`} />
      
      <AnimatePresence>
        {!isCollapsed && (
          <motion.span
            initial={{ opacity: 0, width: 0 }}
            animate={{ opacity: 1, width: 'auto' }}
            exit={{ opacity: 0, width: 0 }}
            className="text-sm font-medium whitespace-nowrap overflow-hidden"
          >
            {item.label}
          </motion.span>
        )}
      </AnimatePresence>
      
      {/* Hover glow effect */}
      <motion.div
        className="absolute inset-0 rounded-lg bg-gradient-to-r from-[#00ff88]/0 via-[#00ff88]/5 to-[#00ff88]/0 opacity-0 group-hover:opacity-100 transition-opacity"
        initial={false}
      />
    </motion.button>
  );
}

// Sidebar Section
interface SectionProps {
  section: typeof navigationSections[0];
  activeItem: string;
  onItemClick: (id: string) => void;
  isCollapsed: boolean;
  isExpanded: boolean;
  onToggle: () => void;
}

function SidebarSection({ section, activeItem, onItemClick, isCollapsed, isExpanded, onToggle }: SectionProps) {
  const SectionIcon = section.icon;
  
  return (
    <div className="mb-2">
      <motion.button
        onClick={onToggle}
        className={`
          w-full flex items-center gap-2 px-3 py-2 rounded-lg
          text-gray-500 hover:text-gray-300 transition-colors
          ${isCollapsed ? 'justify-center' : ''}
        `}
        whileHover={{ backgroundColor: 'rgba(255,255,255,0.03)' }}
      >
        <SectionIcon className="w-4 h-4" />
        {!isCollapsed && (
          <>
            <span className="text-xs font-semibold uppercase tracking-wider flex-1 text-left">
              {section.title}
            </span>
            <motion.div
              animate={{ rotate: isExpanded ? 180 : 0 }}
              transition={{ duration: 0.2 }}
            >
              <ChevronRight className="w-3 h-3" />
            </motion.div>
          </>
        )}
      </motion.button>
      
      <AnimatePresence>
        {(isExpanded || isCollapsed) && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.2 }}
            className="overflow-hidden"
          >
            <div className={`${isCollapsed ? 'py-1' : 'pl-2 py-1'} space-y-0.5`}>
              {section.items.map((item) => (
                <NavItem
                  key={item.id}
                  item={item}
                  isActive={activeItem === item.id}
                  onClick={() => onItemClick(item.id)}
                  isCollapsed={isCollapsed}
                />
              ))}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

// Particle effect component
function FloatingParticles() {
  return (
    <div className="absolute inset-0 overflow-hidden pointer-events-none">
      {[...Array(30)].map((_, i) => (
        <motion.div
          key={i}
          className="absolute w-1 h-1 bg-[#00ff88]/30 rounded-full"
          style={{
            left: `${Math.random() * 100}%`,
            top: `${Math.random() * 100}%`,
          }}
          animate={{
            y: [0, -30, 0],
            opacity: [0.2, 0.6, 0.2],
            scale: [1, 1.5, 1],
          }}
          transition={{
            duration: 3 + Math.random() * 2,
            repeat: Infinity,
            delay: Math.random() * 2,
            ease: 'easeInOut',
          }}
        />
      ))}
    </div>
  );
}

// Main Dashboard Component
export default function Dashboard() {
  const [isLoading, setIsLoading] = useState(true);
  const [activePage, setActivePage] = useState('overview');
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [expandedSections, setExpandedSections] = useState<string[]>(['General']);
  
  // Mock user data
  const userData = {
    name: 'Hunter',
    coins: 12450,
    level: 24,
    avatar: null,
  };

  const handleLoadComplete = () => {
    setIsLoading(false);
  };

  const toggleSection = (sectionTitle: string) => {
    setExpandedSections(prev => 
      prev.includes(sectionTitle) 
        ? prev.filter(s => s !== sectionTitle)
        : [...prev, sectionTitle]
    );
  };

  const handleNavClick = (itemId: string) => {
    setActivePage(itemId);
    setMobileMenuOpen(false);
  };

  const ActiveComponent = pageComponents[activePage] || Overview;

  // Loading screen
  if (isLoading) {
    return <DashboardLoadingScreen onLoadComplete={handleLoadComplete} />;
  }

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ duration: 0.5, ease: 'easeOut' }}
      className="min-h-screen bg-[#0a0a0f] flex lg:grid lg:grid-cols-[auto_1fr] overflow-hidden"
    >
      {/* Animated Background */}
      <div className="fixed inset-0 pointer-events-none">
        {/* Cyber grid */}
        <div className="absolute inset-0 opacity-[0.03]">
          <div className="cyber-grid w-full h-full" />
        </div>
        
        {/* Gradient orbs */}
        <motion.div
          className="absolute w-[600px] h-[600px] rounded-full bg-[#00ff88]/5 blur-[150px]"
          style={{ left: '-10%', top: '20%' }}
          animate={{
            x: [0, 50, 0],
            y: [0, 30, 0],
          }}
          transition={{ duration: 20, repeat: Infinity, ease: 'easeInOut' }}
        />
        <motion.div
          className="absolute w-[500px] h-[500px] rounded-full bg-[#8b5cf6]/5 blur-[150px]"
          style={{ right: '-5%', bottom: '10%' }}
          animate={{
            x: [0, -30, 0],
            y: [0, -50, 0],
          }}
          transition={{ duration: 15, repeat: Infinity, ease: 'easeInOut' }}
        />
        
        <FloatingParticles />
      </div>

      {/* Mobile Menu Button */}
      <motion.button
        className="fixed top-4 left-4 z-50 lg:hidden p-3 bg-[#141420] border border-[#00ff88]/20 rounded-xl"
        whileHover={{ scale: 1.05, borderColor: 'rgba(0, 255, 136, 0.5)' }}
        whileTap={{ scale: 0.95 }}
        onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
      >
        {mobileMenuOpen ? (
          <X className="w-6 h-6 text-[#00ff88]" />
        ) : (
          <Menu className="w-6 h-6 text-[#00ff88]" />
        )}
      </motion.button>

      {/* Mobile Sidebar Overlay */}
      <AnimatePresence>
        {mobileMenuOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/70 backdrop-blur-sm z-40 lg:hidden"
            onClick={() => setMobileMenuOpen(false)}
          />
        )}
      </AnimatePresence>

      {/* Sidebar */}
      <motion.aside
        className={`
          flex-shrink-0 lg:relative z-40 h-screen
          bg-[#0d0d14]/95 backdrop-blur-xl
          border-r border-[#00ff88]/10
          flex flex-col
          transition-all duration-300 ease-in-out
          ${mobileMenuOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'}
          ${sidebarCollapsed ? 'w-20' : 'w-72'}
        `}
        initial={false}
        animate={{ width: sidebarCollapsed ? 80 : 288 }}
        transition={{ duration: 0.3, ease: 'easeInOut' }}
      >
        {/* Sidebar inner glow */}
        <div className="absolute inset-0 bg-gradient-to-b from-[#00ff88]/5 via-transparent to-[#8b5cf6]/5 pointer-events-none" />
        
        {/* Logo / Brand */}
        <div className="relative p-4 border-b border-[#00ff88]/10">
          <motion.div 
            className="flex items-center gap-3"
            whileHover={{ scale: 1.02 }}
          >
            <div className="relative">
              <motion.div
                className="w-10 h-10 rounded-xl bg-gradient-to-br from-[#00ff88] to-[#00d9ff] flex items-center justify-center"
                animate={{ 
                  boxShadow: ['0 0 20px rgba(0,255,136,0.3)', '0 0 40px rgba(0,255,136,0.5)', '0 0 20px rgba(0,255,136,0.3)']
                }}
                transition={{ duration: 2, repeat: Infinity }}
              >
                <Zap className="w-6 h-6 text-[#0a0a0f]" />
              </motion.div>
            </div>
            
            <AnimatePresence>
              {!sidebarCollapsed && (
                <motion.div
                  initial={{ opacity: 0, x: -10 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -10 }}
                  className="flex-1"
                >
                  <h1 className="text-lg font-black">
                    <span className="text-[#00ff88]">GREED</span>
                    <span className="text-[#00d9ff]">HUNTER</span>
                  </h1>
                  <p className="text-[10px] text-gray-500 uppercase tracking-widest">Command Center</p>
                </motion.div>
              )}
            </AnimatePresence>
          </motion.div>
        </div>

        {/* User Quick Stats */}
        <div className="relative p-4 border-b border-[#00ff88]/10">
          <motion.div 
            className="flex items-center gap-3"
            whileHover={{ scale: 1.02 }}
          >
            {/* Avatar */}
            <div className="relative">
              <motion.div
                className="w-10 h-10 rounded-full bg-gradient-to-br from-[#8b5cf6] to-[#00ff88] p-0.5"
                animate={{ 
                  rotate: [0, 360],
                }}
                transition={{ duration: 20, repeat: Infinity, ease: 'linear' }}
              >
                <div className="w-full h-full rounded-full bg-[#141420] flex items-center justify-center">
                  <span className="text-sm font-bold text-white">
                    {userData.name.charAt(0)}
                  </span>
                </div>
              </motion.div>
              <div className="absolute -bottom-1 -right-1 w-4 h-4 bg-[#00ff88] rounded-full flex items-center justify-center">
                <span className="text-[8px] font-bold text-black">{userData.level}</span>
              </div>
            </div>

            <AnimatePresence>
              {!sidebarCollapsed && (
                <motion.div
                  initial={{ opacity: 0, x: -10 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -10 }}
                  className="flex-1"
                >
                  <p className="text-sm font-semibold text-white">{userData.name}</p>
                  <div className="flex items-center gap-1 text-xs">
                    <Coins className="w-3 h-3 text-[#ffd700]" />
                    <motion.span 
                      className="text-[#ffd700] font-medium"
                      key={userData.coins}
                    >
                      {userData.coins.toLocaleString()}
                    </motion.span>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </motion.div>
        </div>

        {/* Navigation */}
        <nav 
          className="flex-1 p-3 overflow-y-auto custom-scrollbar"
          style={{
            scrollbarWidth: 'thin',
            scrollbarColor: '#00ff88 #1a1a2e',
          }}
        >
          {navigationSections.map((section) => (
            <SidebarSection
              key={section.title}
              section={section}
              activeItem={activePage}
              onItemClick={handleNavClick}
              isCollapsed={sidebarCollapsed}
              isExpanded={expandedSections.includes(section.title)}
              onToggle={() => toggleSection(section.title)}
            />
          ))}
        </nav>

        {/* Collapse Toggle */}
        <motion.button
          onClick={() => setSidebarCollapsed(!sidebarCollapsed)}
          className="hidden md:flex absolute -right-3 top-1/2 -translate-y-1/2 w-6 h-12 bg-[#141420] border border-[#00ff88]/30 rounded-r-lg items-center justify-center group hover:border-[#00ff88]/60 transition-colors"
          whileHover={{ scale: 1.1 }}
          whileTap={{ scale: 0.95 }}
        >
          <motion.div
            animate={{ rotate: sidebarCollapsed ? 0 : 180 }}
            transition={{ duration: 0.3 }}
          >
            <ChevronLeft className="w-4 h-4 text-[#00ff88] group-hover:drop-shadow-[0_0_8px_#00ff88]" />
          </motion.div>
        </motion.button>
      </motion.aside>

      {/* Main Content Area */}
      <main 
        className={`flex-1 h-screen overflow-y-auto custom-scrollbar relative transition-all duration-300 ease-in-out ${mobileMenuOpen ? `ml-[${sidebarCollapsed ? '80px' : '288px'}] lg:ml-0` : ''}`}
        style={{
          scrollbarWidth: 'thin',
          scrollbarColor: '#00ff88 #1a1a2e',
        }}
      >
        {/* Page Content */}
        <div className="min-h-full p-4 lg:p-8 pt-16 lg:pt-8">
          <AnimatePresence mode="wait">
            <motion.div
              key={activePage}
              initial={{ opacity: 0, y: 20, scale: 0.98 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: -20, scale: 0.98 }}
              transition={{ duration: 0.3, ease: 'easeOut' }}
              className="relative z-10"
            >
              <ActiveComponent />
            </motion.div>
          </AnimatePresence>
        </div>
      </main>

      {/* Custom Scrollbar Styles */}
      <style>{`
        .custom-scrollbar::-webkit-scrollbar {
          width: 6px;
        }
        .custom-scrollbar::-webkit-scrollbar-track {
          background: #1a1a2e;
          border-radius: 3px;
        }
        .custom-scrollbar::-webkit-scrollbar-thumb {
          background: linear-gradient(180deg, #00ff88, #00d9ff);
          border-radius: 3px;
        }
        .custom-scrollbar::-webkit-scrollbar-thumb:hover {
          background: linear-gradient(180deg, #00ff88, #8b5cf6);
        }
      `}</style>
    </motion.div>
  );
}
