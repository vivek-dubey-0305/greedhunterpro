import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  LayoutDashboard,
  Users,
  Calendar,
  Target,
  Trophy,
  MessageSquare,
  Store,
  CreditCard,
  Bell,
  Settings,
  ChevronLeft,
  ChevronRight,
  LogOut,
  Shield,
  Coins,
  Activity,
  BarChart3,
} from 'lucide-react';
import { cn } from '@/lib/utils';

export interface NavItem {
  id: string;
  label: string;
  icon: React.ComponentType<{ className?: string }>;
}

export interface NavSection {
  title: string;
  icon: React.ComponentType<{ className?: string }>;
  items: NavItem[];
}

export const adminNavigationSections: NavSection[] = [
  {
    title: 'Overview',
    icon: LayoutDashboard,
    items: [
      { id: 'dashboard', label: 'Dashboard', icon: LayoutDashboard },
      { id: 'analytics', label: 'Analytics', icon: BarChart3 },
    ]
  },
  {
    title: 'User Management',
    icon: Users,
    items: [
      { id: 'users', label: 'All Users', icon: Users },
      { id: 'user-levels', label: 'User Levels', icon: Trophy },
      { id: 'user-activity', label: 'User Activity', icon: Activity },
    ]
  },
  {
    title: 'Content Management',
    icon: Calendar,
    items: [
      { id: 'events', label: 'Events', icon: Calendar },
      { id: 'challenges', label: 'Challenges', icon: Trophy },
      { id: 'daily-missions', label: 'Daily Missions', icon: Target },
      { id: 'quizzes', label: 'Quizzes', icon: Target },
    ]
  },
  {
    title: 'Community',
    icon: MessageSquare,
    items: [
      { id: 'communities', label: 'Communities', icon: Users },
      { id: 'chats', label: 'Chats', icon: MessageSquare },
    ]
  },
  {
    title: 'Commerce',
    icon: Store,
    items: [
      { id: 'store', label: 'Store Items', icon: Store },
      { id: 'payments', label: 'Payments', icon: CreditCard },
      { id: 'coins', label: 'Coin History', icon: Coins },
    ]
  },
  {
    title: 'System',
    icon: Settings,
    items: [
      { id: 'notifications', label: 'Notifications', icon: Bell },
      { id: 'settings', label: 'Settings', icon: Settings },
    ]
  },
];

interface AdminSidebarProps {
  activeItem: string;
  onItemClick: (id: string) => void;
  isCollapsed: boolean;
  onToggleCollapse: () => void;
  onLogout: () => void;
}

interface NavItemComponentProps {
  item: NavItem;
  isActive: boolean;
  onClick: () => void;
  isCollapsed: boolean;
}

function NavItemComponent({ item, isActive, onClick, isCollapsed }: NavItemComponentProps) {
  const Icon = item.icon;
  
  return (
    <motion.button
      onClick={onClick}
      className={cn(
        'relative w-full flex items-center gap-3 px-3 py-2.5 rounded-lg transition-all duration-200 group',
        isActive 
          ? 'bg-[#8b5cf6]/10 text-[#8b5cf6]' 
          : 'text-gray-400 hover:text-white hover:bg-white/5'
      )}
      whileHover={{ x: isCollapsed ? 0 : 4 }}
      whileTap={{ scale: 0.98 }}
      title={isCollapsed ? item.label : undefined}
    >
      {isActive && (
        <motion.div
          layoutId="adminActiveIndicator"
          className="absolute left-0 top-1/2 -translate-y-1/2 w-1 h-6 bg-[#8b5cf6] rounded-r-full"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ type: 'spring', stiffness: 300, damping: 30 }}
        />
      )}
      
      <Icon className={cn('w-5 h-5 flex-shrink-0', isActive && 'drop-shadow-[0_0_8px_#8b5cf6]')} />
      
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
      
      <motion.div
        className="absolute inset-0 rounded-lg bg-gradient-to-r from-[#8b5cf6]/0 via-[#8b5cf6]/5 to-[#8b5cf6]/0 opacity-0 group-hover:opacity-100 transition-opacity"
        initial={false}
      />
    </motion.button>
  );
}

interface SidebarSectionProps {
  section: NavSection;
  activeItem: string;
  onItemClick: (id: string) => void;
  isCollapsed: boolean;
  isExpanded: boolean;
  onToggle: () => void;
}

function SidebarSection({ section, activeItem, onItemClick, isCollapsed, isExpanded, onToggle }: SidebarSectionProps) {
  const SectionIcon = section.icon;
  
  return (
    <div className="mb-2">
      <motion.button
        onClick={onToggle}
        className={cn(
          'w-full flex items-center gap-2 px-3 py-2 rounded-lg text-gray-500 hover:text-gray-300 transition-colors',
          isCollapsed && 'justify-center'
        )}
        whileHover={{ backgroundColor: 'rgba(255,255,255,0.03)' }}
      >
        <SectionIcon className="w-4 h-4" />
        {!isCollapsed && (
          <>
            <span className="text-xs font-semibold uppercase tracking-wider flex-1 text-left">
              {section.title}
            </span>
            <motion.div
              animate={{ rotate: isExpanded ? 90 : 0 }}
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
            <div className={cn(isCollapsed ? 'py-1' : 'pl-2 py-1', 'space-y-0.5')}>
              {section.items.map((item) => (
                <NavItemComponent
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

export function AdminSidebar({ activeItem, onItemClick, isCollapsed, onToggleCollapse, onLogout }: AdminSidebarProps) {
  const [expandedSections, setExpandedSections] = useState<string[]>(adminNavigationSections.map(s => s.title));

  const toggleSection = (title: string) => {
    setExpandedSections(prev => 
      prev.includes(title) 
        ? prev.filter(t => t !== title)
        : [...prev, title]
    );
  };

  return (
    <motion.aside
      initial={false}
      animate={{ width: isCollapsed ? 80 : 280 }}
      transition={{ duration: 0.3, ease: 'easeInOut' }}
      className="fixed left-0 top-0 h-screen bg-[#0a0a0f]/95 backdrop-blur-xl border-r border-[#1a1a2e] z-50 flex flex-col"
    >
      {/* Header */}
      <div className="flex items-center justify-between p-4 border-b border-[#1a1a2e]">
        <AnimatePresence>
          {!isCollapsed && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="flex items-center gap-2"
            >
              <div className="w-10 h-10 bg-gradient-to-br from-[#8b5cf6] to-[#00ff88] rounded-xl flex items-center justify-center">
                <Shield className="w-5 h-5 text-white" />
              </div>
              <div>
                <h1 className="text-white font-bold text-lg">Admin</h1>
                <p className="text-gray-500 text-xs">Control Panel</p>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
        
        {isCollapsed && (
          <div className="w-10 h-10 bg-gradient-to-br from-[#8b5cf6] to-[#00ff88] rounded-xl flex items-center justify-center mx-auto">
            <Shield className="w-5 h-5 text-white" />
          </div>
        )}
      </div>

      {/* Navigation */}
      <div className="flex-1 overflow-y-auto py-4 px-2 scrollbar-thin scrollbar-thumb-[#2a2a3e] scrollbar-track-transparent">
        {adminNavigationSections.map((section) => (
          <SidebarSection
            key={section.title}
            section={section}
            activeItem={activeItem}
            onItemClick={onItemClick}
            isCollapsed={isCollapsed}
            isExpanded={expandedSections.includes(section.title)}
            onToggle={() => toggleSection(section.title)}
          />
        ))}
      </div>

      {/* Footer */}
      <div className="p-4 border-t border-[#1a1a2e] space-y-2">
        <motion.button
          onClick={onToggleCollapse}
          className="w-full flex items-center justify-center gap-2 px-3 py-2 rounded-lg text-gray-400 hover:text-white hover:bg-white/5 transition-colors"
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
        >
          {isCollapsed ? <ChevronRight className="w-5 h-5" /> : <ChevronLeft className="w-5 h-5" />}
          {!isCollapsed && <span className="text-sm">Collapse</span>}
        </motion.button>
        
        <motion.button
          onClick={onLogout}
          className="w-full flex items-center justify-center gap-2 px-3 py-2 rounded-lg text-red-400 hover:text-red-300 hover:bg-red-500/10 transition-colors"
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
        >
          <LogOut className="w-5 h-5" />
          {!isCollapsed && <span className="text-sm">Logout</span>}
        </motion.button>
      </div>
    </motion.aside>
  );
}
