import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Coins, 
  TrendingUp, 
  TrendingDown,
  ArrowUpRight,
  ArrowDownRight,
  Wallet,
  CreditCard,
  Calendar,
  Filter,
  Download,
  RefreshCw
} from 'lucide-react';

// Transaction type
type TransactionType = 'all' | 'earned' | 'spent' | 'withdrawn';

// Transaction interface
interface Transaction {
  id: string;
  type: 'earn' | 'spend' | 'withdraw';
  title: string;
  description: string;
  amount: number;
  date: string;
  time: string;
  status: 'completed' | 'pending' | 'failed';
}

// Stat Card Component
function StatCard({ icon: Icon, label, value, change, color, delay }: {
  icon: React.ElementType;
  label: string;
  value: string;
  change?: { value: number; positive: boolean };
  color: string;
  delay: number;
}) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay }}
      whileHover={{ y: -4, scale: 1.02 }}
      className="bg-[#141420]/80 backdrop-blur-xl border border-white/10 rounded-2xl p-5"
    >
      <div className="flex items-center justify-between mb-4">
        <div className="p-3 rounded-xl" style={{ backgroundColor: `${color}15` }}>
          <Icon className="w-6 h-6" style={{ color }} />
        </div>
        {change && (
          <div className={`flex items-center gap-1 text-sm font-medium ${change.positive ? 'text-[#00ff88]' : 'text-red-400'}`}>
            {change.positive ? <TrendingUp className="w-4 h-4" /> : <TrendingDown className="w-4 h-4" />}
            {Math.abs(change.value)}%
          </div>
        )}
      </div>
      <p className="text-gray-400 text-sm mb-1">{label}</p>
      <p className="text-2xl font-bold text-white">{value}</p>
    </motion.div>
  );
}

// Area Chart Component
function AreaChart({ data, height = 160 }: { data: { earned: number; spent: number }[]; height?: number }) {
  const maxEarned = Math.max(...data.map(d => d.earned));
  const maxSpent = Math.max(...data.map(d => d.spent));
  const maxValue = Math.max(maxEarned, maxSpent);

  const earnedPoints = data.map((d, i) => {
    const x = (i / (data.length - 1)) * 100;
    const y = 100 - (d.earned / maxValue) * 80;
    return `${x},${y}`;
  }).join(' ');

  const spentPoints = data.map((d, i) => {
    const x = (i / (data.length - 1)) * 100;
    const y = 100 - (d.spent / maxValue) * 80;
    return `${x},${y}`;
  }).join(' ');

  return (
    <svg className="w-full" style={{ height }} preserveAspectRatio="none">
      {/* Grid */}
      {[20, 40, 60, 80].map((y) => (
        <line key={y} x1="0%" y1={`${y}%`} x2="100%" y2={`${y}%`} stroke="#1a1a2e" strokeWidth="1" />
      ))}
      
      {/* Earned area */}
      <motion.polygon
        points={`0,100 ${earnedPoints} 100,100`}
        fill="#00ff8820"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.5 }}
      />
      <motion.polyline
        points={earnedPoints}
        fill="none"
        stroke="#00ff88"
        strokeWidth="2"
        initial={{ pathLength: 0 }}
        animate={{ pathLength: 1 }}
        transition={{ duration: 1 }}
      />
      
      {/* Spent area */}
      <motion.polygon
        points={`0,100 ${spentPoints} 100,100`}
        fill="#ff6b6b20"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.5, delay: 0.2 }}
      />
      <motion.polyline
        points={spentPoints}
        fill="none"
        stroke="#ff6b6b"
        strokeWidth="2"
        initial={{ pathLength: 0 }}
        animate={{ pathLength: 1 }}
        transition={{ duration: 1, delay: 0.2 }}
      />
    </svg>
  );
}

// Transaction Item Component
function TransactionItem({ transaction }: { transaction: Transaction }) {
  const config = {
    earn: { icon: ArrowDownRight, color: '#00ff88', prefix: '+' },
    spend: { icon: ArrowUpRight, color: '#ff6b6b', prefix: '-' },
    withdraw: { icon: Wallet, color: '#ffd700', prefix: '-' },
  };

  const { icon: Icon, color, prefix } = config[transaction.type];

  return (
    <motion.div
      whileHover={{ x: 4 }}
      className="flex items-center justify-between p-4 bg-[#1a1a2e] rounded-xl hover:bg-[#1a1a2e]/80 transition-colors"
    >
      <div className="flex items-center gap-4">
        <div className="w-12 h-12 rounded-xl flex items-center justify-center" style={{ backgroundColor: `${color}20` }}>
          <Icon className="w-6 h-6" style={{ color }} />
        </div>
        <div>
          <h4 className="font-medium text-white">{transaction.title}</h4>
          <p className="text-gray-500 text-sm">{transaction.description}</p>
        </div>
      </div>
      
      <div className="text-right">
        <p className="font-bold" style={{ color }}>
          {prefix}{transaction.amount.toLocaleString()} 🪙
        </p>
        <div className="flex items-center gap-2 text-xs text-gray-500">
          <span>{transaction.date}</span>
          <span>•</span>
          <span>{transaction.time}</span>
        </div>
      </div>
    </motion.div>
  );
}

// Filter Tab Component
function FilterTab({ label, active, onClick, count }: {
  label: string;
  active: boolean;
  onClick: () => void;
  count?: number;
}) {
  return (
    <motion.button
      onClick={onClick}
      className={`flex items-center gap-2 px-4 py-2 rounded-xl font-medium transition-all whitespace-nowrap ${
        active
          ? 'bg-[#ffd700] text-black'
          : 'bg-[#1a1a2e] text-gray-400 hover:text-white'
      }`}
      whileHover={{ scale: 1.02 }}
      whileTap={{ scale: 0.98 }}
    >
      {label}
      {count !== undefined && (
        <span className={`px-2 py-0.5 rounded-full text-xs ${
          active ? 'bg-black/20' : 'bg-white/10'
        }`}>
          {count}
        </span>
      )}
    </motion.button>
  );
}

// Main Component
export function PaymentStats() {
  const [transactionFilter, setTransactionFilter] = useState<TransactionType>('all');

  const chartData = [
    { earned: 1200, spent: 400 },
    { earned: 1800, spent: 600 },
    { earned: 1500, spent: 800 },
    { earned: 2200, spent: 500 },
    { earned: 1900, spent: 700 },
    { earned: 2500, spent: 900 },
    { earned: 2100, spent: 600 },
    { earned: 2800, spent: 1000 },
    { earned: 2400, spent: 800 },
    { earned: 3100, spent: 700 },
    { earned: 2700, spent: 500 },
    { earned: 3500, spent: 900 },
  ];

  const transactions: Transaction[] = [
    { id: '1', type: 'earn', title: 'Challenge Reward', description: 'Speed Coding Sprint - 3rd Place', amount: 250, date: 'Today', time: '2:45 PM', status: 'completed' },
    { id: '2', type: 'earn', title: 'Daily Mission', description: 'Completed all daily missions', amount: 150, date: 'Today', time: '1:30 PM', status: 'completed' },
    { id: '3', type: 'spend', title: 'Store Purchase', description: 'Premium Avatar Pack', amount: 500, date: 'Today', time: '11:20 AM', status: 'completed' },
    { id: '4', type: 'withdraw', title: 'Withdrawal', description: 'Bank transfer to ****4521', amount: 1000, date: 'Yesterday', time: '6:45 PM', status: 'pending' },
    { id: '5', type: 'earn', title: 'Event Reward', description: 'Quantum Surge 2024 - 1st Place', amount: 1500, date: 'Yesterday', time: '5:30 PM', status: 'completed' },
    { id: '6', type: 'earn', title: 'Referral Bonus', description: 'User alexhunter joined via your link', amount: 200, date: '2 days ago', time: '3:15 PM', status: 'completed' },
    { id: '7', type: 'spend', title: 'Event Entry', description: 'Code Warriors League entry fee', amount: 100, date: '2 days ago', time: '10:00 AM', status: 'completed' },
  ];

  const filteredTransactions = transactionFilter === 'all'
    ? transactions
    : transactions.filter(t => {
        if (transactionFilter === 'earned') return t.type === 'earn';
        if (transactionFilter === 'spent') return t.type === 'spend';
        if (transactionFilter === 'withdrawn') return t.type === 'withdraw';
        return true;
      });

  const filterCounts = {
    all: transactions.length,
    earned: transactions.filter(t => t.type === 'earn').length,
    spent: transactions.filter(t => t.type === 'spend').length,
    withdrawn: transactions.filter(t => t.type === 'withdraw').length,
  };

  return (
    <div className="space-y-8">
      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4"
      >
        <div>
          <h1 className="text-3xl font-black text-white mb-2 flex items-center gap-3">
            <Coins className="w-8 h-8 text-[#ffd700]" />
            Payment Stats
          </h1>
          <p className="text-gray-400">Track your earnings, spending, and withdrawals</p>
        </div>

        <div className="flex gap-2">
          <motion.button
            className="px-4 py-2 bg-[#1a1a2e] text-gray-400 hover:text-white rounded-xl flex items-center gap-2"
            whileHover={{ scale: 1.02 }}
          >
            <Download className="w-4 h-4" />
            Export
          </motion.button>
          <motion.button
            className="px-4 py-2 bg-[#1a1a2e] text-gray-400 hover:text-white rounded-xl flex items-center gap-2"
            whileHover={{ scale: 1.02 }}
          >
            <RefreshCw className="w-4 h-4" />
            Refresh
          </motion.button>
        </div>
      </motion.div>

      {/* Stats Grid */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard icon={Wallet} label="Current Balance" value="24,580" color="#ffd700" delay={0.1} />
        <StatCard icon={TrendingUp} label="Total Earned" value="156,450" change={{ value: 24, positive: true }} color="#00ff88" delay={0.15} />
        <StatCard icon={TrendingDown} label="Total Spent" value="45,230" change={{ value: 8, positive: false }} color="#ff6b6b" delay={0.2} />
        <StatCard icon={CreditCard} label="Withdrawn" value="86,640" color="#00d9ff" delay={0.25} />
      </div>

      {/* Chart */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.3 }}
        className="bg-[#141420]/80 backdrop-blur-xl border border-white/10 rounded-2xl p-5"
      >
        <div className="flex items-center justify-between mb-6">
          <div>
            <h3 className="text-lg font-bold text-white">Earnings vs Spending</h3>
            <p className="text-gray-400 text-sm">Last 12 months</p>
          </div>
          <div className="flex items-center gap-6">
            <div className="flex items-center gap-2">
              <div className="w-3 h-3 rounded-full bg-[#00ff88]" />
              <span className="text-gray-400 text-sm">Earned</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-3 h-3 rounded-full bg-[#ff6b6b]" />
              <span className="text-gray-400 text-sm">Spent</span>
            </div>
          </div>
        </div>
        <AreaChart data={chartData} />
        <div className="flex justify-between mt-4 text-xs text-gray-500">
          {['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'].map((month) => (
            <span key={month}>{month}</span>
          ))}
        </div>
      </motion.div>

      {/* Summary Cards */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.35 }}
        className="grid grid-cols-1 lg:grid-cols-3 gap-4"
      >
        <div className="bg-[#00ff88]/10 border border-[#00ff88]/30 rounded-2xl p-5">
          <h4 className="text-[#00ff88] font-bold mb-2">Best Earning Month</h4>
          <p className="text-3xl font-bold text-white">December</p>
          <p className="text-gray-400 text-sm">+3,500 coins earned</p>
        </div>
        <div className="bg-[#ffd700]/10 border border-[#ffd700]/30 rounded-2xl p-5">
          <h4 className="text-[#ffd700] font-bold mb-2">Conversion Rate</h4>
          <p className="text-3xl font-bold text-white">₹0.50</p>
          <p className="text-gray-400 text-sm">Per coin (current rate)</p>
        </div>
        <div className="bg-[#00d9ff]/10 border border-[#00d9ff]/30 rounded-2xl p-5">
          <h4 className="text-[#00d9ff] font-bold mb-2">Pending Withdrawal</h4>
          <p className="text-3xl font-bold text-white">1,000</p>
          <p className="text-gray-400 text-sm">Processing time: 24-48h</p>
        </div>
      </motion.div>

      {/* Transaction History */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.4 }}
        className="bg-[#141420]/80 backdrop-blur-xl border border-white/10 rounded-2xl overflow-hidden"
      >
        <div className="p-5 border-b border-white/10">
          <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
            <h3 className="text-lg font-bold text-white">Transaction History</h3>
            <div className="flex gap-2 overflow-x-auto pb-2 lg:pb-0">
              {([
                { id: 'all', label: 'All' },
                { id: 'earned', label: 'Earned' },
                { id: 'spent', label: 'Spent' },
                { id: 'withdrawn', label: 'Withdrawn' },
              ] as const).map((filter) => (
                <FilterTab
                  key={filter.id}
                  label={filter.label}
                  active={transactionFilter === filter.id}
                  onClick={() => setTransactionFilter(filter.id)}
                  count={filterCounts[filter.id]}
                />
              ))}
            </div>
          </div>
        </div>
        <div className="p-5 space-y-3">
          {filteredTransactions.map((transaction, i) => (
            <motion.div
              key={transaction.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.05 * i }}
            >
              <TransactionItem transaction={transaction} />
            </motion.div>
          ))}
        </div>
      </motion.div>
    </div>
  );
}
