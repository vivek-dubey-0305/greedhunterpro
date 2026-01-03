import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useNavigate, useLocation } from 'react-router-dom';

// Sidebar
import { AdminSidebar } from './components/AdminSidebar';

// Pages
import { AdminDashboardOverview } from './Overview';
import { UsersManagement } from './Users';
import { EventsManagement } from './Events';
import { ChallengesManagement } from './Challenges';
import { DailyMissionsManagement } from './DailyMissions';
import { QuizzesManagement } from './Quizzes';
import { CommunitiesManagement } from './Communities';
import { ChatsManagement } from './Chats';
import { StoreManagement } from './Store';
import { PaymentsManagement } from './Payments';
import { CoinHistoryManagement } from './CoinHistory';
import { NotificationsManagement } from './Notifications';
import { SettingsPage } from './Settings';
import { AnalyticsPage } from './Analytics';

const pageComponents: Record<string, React.ComponentType> = {
  dashboard: AdminDashboardOverview,
  overview: AdminDashboardOverview,
  analytics: AnalyticsPage,
  users: UsersManagement,
  'user-levels': UsersManagement, // Could be separate component
  'user-activity': UsersManagement, // Could be separate component
  events: EventsManagement,
  challenges: ChallengesManagement,
  'daily-missions': DailyMissionsManagement,
  quizzes: QuizzesManagement,
  communities: CommunitiesManagement,
  chats: ChatsManagement,
  store: StoreManagement,
  payments: PaymentsManagement,
  coins: CoinHistoryManagement,
  notifications: NotificationsManagement,
  settings: SettingsPage,
};

export function AdminDashboard() {
  const navigate = useNavigate();
  const location = useLocation();
  const [activeTab, setActiveTab] = useState('overview');
  const [isCollapsed, setIsCollapsed] = useState(false);

  // Check authentication
  useEffect(() => {
    const isAuthenticated = localStorage.getItem('adminAuthenticated');
    if (!isAuthenticated) {
      navigate('/admin/login');
    }
  }, [navigate]);

  // Parse active tab from URL
  useEffect(() => {
    const path = location.pathname.replace('/admin/', '').replace('/admin', '');
    if (path && pageComponents[path]) {
      setActiveTab(path);
    } else if (path === '' || path === '/') {
      setActiveTab('overview');
    }
  }, [location.pathname]);

  const handleNavigate = (tab: string) => {
    setActiveTab(tab);
    navigate(`/admin/${tab}`);
  };

  const handleLogout = () => {
    localStorage.removeItem('adminAuthenticated');
    navigate('/admin/login');
  };

  const ActiveComponent = pageComponents[activeTab] || AdminDashboardOverview;

  return (
    <div className="min-h-screen bg-[#0a0a0f] flex">
      {/* Sidebar */}
      <AdminSidebar
        activeItem={activeTab}
        onItemClick={handleNavigate}
        isCollapsed={isCollapsed}
        onToggleCollapse={() => setIsCollapsed(!isCollapsed)}
        onLogout={handleLogout}
      />

      {/* Main Content */}
      <main
        className={`flex-1 transition-all duration-300 ${
          isCollapsed ? 'ml-20' : 'ml-64'
        }`}
      >
        <div className="p-8">
          <AnimatePresence mode="wait">
            <motion.div
              key={activeTab}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              transition={{ duration: 0.2 }}
            >
              <ActiveComponent />
            </motion.div>
          </AnimatePresence>
        </div>
      </main>
    </div>
  );
}
