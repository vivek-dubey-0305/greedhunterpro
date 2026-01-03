import { useState } from 'react';
import { motion } from 'framer-motion';
import {
  BarChart3,
  TrendingUp,
  TrendingDown,
  Users,
  DollarSign,
  Target,
  Calendar,
  Download,
  ArrowUpRight,
  Activity,
  Eye,
  Clock,
  Zap,
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { PageHeader, StatsCard } from '../components';

interface ChartData {
  label: string;
  value: number;
}

const mockUserGrowth: ChartData[] = [
  { label: 'Jan', value: 2400 },
  { label: 'Feb', value: 3200 },
  { label: 'Mar', value: 4100 },
  { label: 'Apr', value: 5200 },
  { label: 'May', value: 6800 },
  { label: 'Jun', value: 8200 },
  { label: 'Jul', value: 9500 },
  { label: 'Aug', value: 11200 },
  { label: 'Sep', value: 12800 },
  { label: 'Oct', value: 14200 },
  { label: 'Nov', value: 15420 },
];

const mockRevenueData: ChartData[] = [
  { label: 'Jan', value: 12500 },
  { label: 'Feb', value: 15200 },
  { label: 'Mar', value: 18400 },
  { label: 'Apr', value: 22100 },
  { label: 'May', value: 28500 },
  { label: 'Jun', value: 32400 },
  { label: 'Jul', value: 38200 },
  { label: 'Aug', value: 42800 },
  { label: 'Sep', value: 48500 },
  { label: 'Oct', value: 52100 },
  { label: 'Nov', value: 58420 },
];

const mockEngagementData: ChartData[] = [
  { label: 'Mon', value: 85 },
  { label: 'Tue', value: 92 },
  { label: 'Wed', value: 78 },
  { label: 'Thu', value: 88 },
  { label: 'Fri', value: 95 },
  { label: 'Sat', value: 72 },
  { label: 'Sun', value: 68 },
];

const topPerformers = [
  { name: 'JavaScript Mastery', type: 'Challenge', completions: 2840, growth: 12 },
  { name: 'Python Basics', type: 'Quiz', completions: 2150, growth: 8 },
  { name: 'React Pro Workshop', type: 'Event', completions: 1890, growth: 15 },
  { name: 'Daily Coding Streak', type: 'Mission', completions: 1650, growth: 5 },
  { name: 'Algorithms 101', type: 'Challenge', completions: 1420, growth: -3 },
];

export function AnalyticsPage() {
  const [dateRange, setDateRange] = useState('30d');

  const maxUserValue = Math.max(...mockUserGrowth.map((d) => d.value));
  const maxRevenueValue = Math.max(...mockRevenueData.map((d) => d.value));
  const maxEngagementValue = Math.max(...mockEngagementData.map((d) => d.value));

  const SimpleBarChart = ({ data, maxValue, color }: { data: ChartData[]; maxValue: number; color: string }) => (
    <div className="flex items-end gap-1 h-40">
      {data.map((item, index) => (
        <div key={index} className="flex-1 flex flex-col items-center">
          <motion.div
            initial={{ height: 0 }}
            animate={{ height: `${(item.value / maxValue) * 100}%` }}
            transition={{ delay: index * 0.05, duration: 0.5 }}
            className="w-full rounded-t-sm"
            style={{ backgroundColor: color, minHeight: '4px' }}
          />
          <span className="text-[10px] text-gray-500 mt-2">{item.label}</span>
        </div>
      ))}
    </div>
  );

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <PageHeader
          title="Analytics"
          description="Platform performance and insights"
          icon={BarChart3}
        />
        <div className="flex items-center gap-3">
          <Select value={dateRange} onValueChange={setDateRange}>
            <SelectTrigger className="w-40 bg-[#141420] border-[#2a2a3e] text-white">
              <Calendar className="w-4 h-4 mr-2 text-gray-400" />
              <SelectValue />
            </SelectTrigger>
            <SelectContent className="bg-[#1a1a2e] border-[#2a2a3e]">
              <SelectItem value="7d" className="text-white">Last 7 days</SelectItem>
              <SelectItem value="30d" className="text-white">Last 30 days</SelectItem>
              <SelectItem value="90d" className="text-white">Last 90 days</SelectItem>
              <SelectItem value="1y" className="text-white">Last year</SelectItem>
            </SelectContent>
          </Select>
          <Button
            variant="outline"
            className="border-[#2a2a3e] text-gray-400 hover:text-white hover:bg-white/10"
          >
            <Download className="w-4 h-4 mr-2" />
            Export Report
          </Button>
        </div>
      </div>

      {/* Key Metrics */}
      <div className="grid grid-cols-4 gap-4">
        <StatsCard
          title="Total Users"
          value="15,420"
          trend={{ value: 12.5, isPositive: true }}
          icon={Users}
          color="#8b5cf6"
        />
        <StatsCard
          title="Monthly Revenue"
          value="$58,420"
          trend={{ value: 18.2, isPositive: true }}
          icon={DollarSign}
          color="#00ff88"
        />
        <StatsCard
          title="Active Sessions"
          value="2,840"
          trend={{ value: 5.3, isPositive: true }}
          icon={Activity}
          color="#00d9ff"
        />
        <StatsCard
          title="Conversion Rate"
          value="4.2%"
          trend={{ value: 0.8, isPositive: true }}
          icon={Target}
          color="#ffd700"
        />
      </div>

      {/* Charts Row */}
      <div className="grid grid-cols-2 gap-6">
        {/* User Growth Chart */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-[#141420] border border-[#2a2a3e] rounded-xl p-6"
        >
          <div className="flex items-center justify-between mb-6">
            <div>
              <h3 className="text-white font-bold">User Growth</h3>
              <p className="text-gray-500 text-sm">Total registered users over time</p>
            </div>
            <div className="flex items-center gap-2 text-[#00ff88]">
              <TrendingUp className="w-4 h-4" />
              <span className="text-sm font-medium">+12.5%</span>
            </div>
          </div>
          <SimpleBarChart data={mockUserGrowth} maxValue={maxUserValue} color="#8b5cf6" />
        </motion.div>

        {/* Revenue Chart */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="bg-[#141420] border border-[#2a2a3e] rounded-xl p-6"
        >
          <div className="flex items-center justify-between mb-6">
            <div>
              <h3 className="text-white font-bold">Revenue</h3>
              <p className="text-gray-500 text-sm">Monthly revenue breakdown</p>
            </div>
            <div className="flex items-center gap-2 text-[#00ff88]">
              <TrendingUp className="w-4 h-4" />
              <span className="text-sm font-medium">+18.2%</span>
            </div>
          </div>
          <SimpleBarChart data={mockRevenueData} maxValue={maxRevenueValue} color="#00ff88" />
        </motion.div>
      </div>

      {/* Second Row */}
      <div className="grid grid-cols-3 gap-6">
        {/* Engagement Chart */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="bg-[#141420] border border-[#2a2a3e] rounded-xl p-6"
        >
          <div className="flex items-center justify-between mb-6">
            <div>
              <h3 className="text-white font-bold">Weekly Engagement</h3>
              <p className="text-gray-500 text-sm">Daily active users %</p>
            </div>
          </div>
          <SimpleBarChart data={mockEngagementData} maxValue={100} color="#00d9ff" />
        </motion.div>

        {/* Quick Stats */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="bg-[#141420] border border-[#2a2a3e] rounded-xl p-6"
        >
          <h3 className="text-white font-bold mb-6">Quick Stats</h3>
          <div className="space-y-4">
            <div className="flex items-center justify-between p-3 bg-[#1a1a2e] rounded-lg">
              <div className="flex items-center gap-3">
                <Eye className="w-5 h-5 text-[#8b5cf6]" />
                <span className="text-gray-400">Page Views</span>
              </div>
              <span className="text-white font-bold">284K</span>
            </div>
            <div className="flex items-center justify-between p-3 bg-[#1a1a2e] rounded-lg">
              <div className="flex items-center gap-3">
                <Clock className="w-5 h-5 text-[#00d9ff]" />
                <span className="text-gray-400">Avg. Session</span>
              </div>
              <span className="text-white font-bold">12m 34s</span>
            </div>
            <div className="flex items-center justify-between p-3 bg-[#1a1a2e] rounded-lg">
              <div className="flex items-center gap-3">
                <Zap className="w-5 h-5 text-[#ffd700]" />
                <span className="text-gray-400">Challenges Done</span>
              </div>
              <span className="text-white font-bold">42.5K</span>
            </div>
            <div className="flex items-center justify-between p-3 bg-[#1a1a2e] rounded-lg">
              <div className="flex items-center gap-3">
                <Target className="w-5 h-5 text-[#00ff88]" />
                <span className="text-gray-400">Quizzes Completed</span>
              </div>
              <span className="text-white font-bold">28.2K</span>
            </div>
          </div>
        </motion.div>

        {/* Top Performers */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
          className="bg-[#141420] border border-[#2a2a3e] rounded-xl p-6"
        >
          <h3 className="text-white font-bold mb-6">Top Performing Content</h3>
          <div className="space-y-3">
            {topPerformers.map((item, index) => (
              <div key={index} className="flex items-center justify-between p-3 bg-[#1a1a2e] rounded-lg">
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 rounded-lg bg-[#8b5cf6]/20 flex items-center justify-center text-white font-bold text-sm">
                    {index + 1}
                  </div>
                  <div>
                    <p className="text-white text-sm font-medium">{item.name}</p>
                    <p className="text-gray-500 text-xs">{item.type}</p>
                  </div>
                </div>
                <div className="text-right">
                  <p className="text-white font-bold text-sm">{item.completions.toLocaleString()}</p>
                  <div className={`flex items-center gap-1 text-xs ${item.growth >= 0 ? 'text-[#00ff88]' : 'text-red-400'}`}>
                    {item.growth >= 0 ? <TrendingUp className="w-3 h-3" /> : <TrendingDown className="w-3 h-3" />}
                    {item.growth >= 0 ? '+' : ''}{item.growth}%
                  </div>
                </div>
              </div>
            ))}
          </div>
        </motion.div>
      </div>

      {/* Platform Health */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.5 }}
        className="bg-[#141420] border border-[#2a2a3e] rounded-xl p-6"
      >
        <h3 className="text-white font-bold mb-6">Platform Health</h3>
        <div className="grid grid-cols-4 gap-4">
          <div className="p-4 bg-[#1a1a2e] rounded-lg">
            <div className="flex items-center justify-between mb-3">
              <span className="text-gray-400 text-sm">Server Uptime</span>
              <span className="text-[#00ff88] text-sm font-bold">99.9%</span>
            </div>
            <div className="w-full h-2 bg-[#2a2a3e] rounded-full overflow-hidden">
              <div className="h-full bg-[#00ff88] rounded-full" style={{ width: '99.9%' }} />
            </div>
          </div>
          <div className="p-4 bg-[#1a1a2e] rounded-lg">
            <div className="flex items-center justify-between mb-3">
              <span className="text-gray-400 text-sm">API Response</span>
              <span className="text-[#00ff88] text-sm font-bold">45ms</span>
            </div>
            <div className="w-full h-2 bg-[#2a2a3e] rounded-full overflow-hidden">
              <div className="h-full bg-[#00ff88] rounded-full" style={{ width: '85%' }} />
            </div>
          </div>
          <div className="p-4 bg-[#1a1a2e] rounded-lg">
            <div className="flex items-center justify-between mb-3">
              <span className="text-gray-400 text-sm">Error Rate</span>
              <span className="text-[#00ff88] text-sm font-bold">0.02%</span>
            </div>
            <div className="w-full h-2 bg-[#2a2a3e] rounded-full overflow-hidden">
              <div className="h-full bg-[#00ff88] rounded-full" style={{ width: '2%' }} />
            </div>
          </div>
          <div className="p-4 bg-[#1a1a2e] rounded-lg">
            <div className="flex items-center justify-between mb-3">
              <span className="text-gray-400 text-sm">Database Load</span>
              <span className="text-yellow-400 text-sm font-bold">68%</span>
            </div>
            <div className="w-full h-2 bg-[#2a2a3e] rounded-full overflow-hidden">
              <div className="h-full bg-yellow-400 rounded-full" style={{ width: '68%' }} />
            </div>
          </div>
        </div>
      </motion.div>
    </div>
  );
}
