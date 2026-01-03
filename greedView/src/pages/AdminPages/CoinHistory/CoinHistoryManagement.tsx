import { useState } from 'react';
import { motion } from 'framer-motion';
import {
  Coins,
  ArrowUpRight,
  ArrowDownRight,
  Eye,
  Download,
  Filter,
  TrendingUp,
  Wallet,
  ShoppingBag,
  Gift,
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { PageHeader, DataTable, FormModal } from '../components';

interface CoinTransaction {
  id: string;
  userId: string;
  userName: string;
  userAvatar: string;
  type: 'earned' | 'spent' | 'purchased' | 'bonus' | 'refund' | 'admin_credit' | 'admin_debit';
  amount: number;
  balance: number;
  source: string;
  description: string;
  createdAt: string;
}

const mockTransactions: CoinTransaction[] = [
  {
    id: '1',
    userId: 'u1',
    userName: 'John Doe',
    userAvatar: '/avatars/john.jpg',
    type: 'earned',
    amount: 500,
    balance: 12500,
    source: 'challenge',
    description: 'Completed "JavaScript Master" challenge',
    createdAt: '2024-11-15 14:32:00',
  },
  {
    id: '2',
    userId: 'u2',
    userName: 'Sarah Smith',
    userAvatar: '/avatars/sarah.jpg',
    type: 'purchased',
    amount: 2500,
    balance: 8000,
    source: 'store_purchase',
    description: 'Purchased 2500 Coins Package',
    createdAt: '2024-11-15 12:15:00',
  },
  {
    id: '3',
    userId: 'u3',
    userName: 'Mike Developer',
    userAvatar: '/avatars/mike.jpg',
    type: 'spent',
    amount: -150,
    balance: 3200,
    source: 'store',
    description: 'Purchased XP Boost (24h)',
    createdAt: '2024-11-15 10:45:00',
  },
  {
    id: '4',
    userId: 'u1',
    userName: 'John Doe',
    userAvatar: '/avatars/john.jpg',
    type: 'bonus',
    amount: 1000,
    balance: 12000,
    source: 'login_streak',
    description: '30-day login streak bonus',
    createdAt: '2024-11-14 16:20:00',
  },
  {
    id: '5',
    userId: 'u4',
    userName: 'Alice Coder',
    userAvatar: '/avatars/alice.jpg',
    type: 'admin_credit',
    amount: 500,
    balance: 5500,
    source: 'admin',
    description: 'Compensation for technical issue',
    createdAt: '2024-11-14 09:10:00',
  },
  {
    id: '6',
    userId: 'u5',
    userName: 'Bob Builder',
    userAvatar: '/avatars/bob.jpg',
    type: 'refund',
    amount: 200,
    balance: 2200,
    source: 'refund',
    description: 'Refund for failed store purchase',
    createdAt: '2024-11-13 18:00:00',
  },
];

export function CoinHistoryManagement() {
  const [transactions, setTransactions] = useState<CoinTransaction[]>(mockTransactions);
  const [searchQuery, setSearchQuery] = useState('');
  const [typeFilter, setTypeFilter] = useState<string>('all');
  const [isViewModalOpen, setIsViewModalOpen] = useState(false);
  const [isCreditModalOpen, setIsCreditModalOpen] = useState(false);
  const [selectedTransaction, setSelectedTransaction] = useState<CoinTransaction | null>(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [creditData, setCreditData] = useState({ userId: '', amount: 0, description: '' });
  const itemsPerPage = 10;

  const filteredTransactions = transactions.filter((tx) => {
    const matchesSearch =
      tx.userName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      tx.description.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesType = typeFilter === 'all' || tx.type === typeFilter;
    return matchesSearch && matchesType;
  });

  const paginatedTransactions = filteredTransactions.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  const handleView = (tx: CoinTransaction) => {
    setSelectedTransaction(tx);
    setIsViewModalOpen(true);
  };

  const handleCredit = () => {
    // In real app, would find user and create transaction
    console.log('Credit coins:', creditData);
    setIsCreditModalOpen(false);
    setCreditData({ userId: '', amount: 0, description: '' });
  };

  const totalCoinsEarned = transactions
    .filter((tx) => tx.amount > 0)
    .reduce((sum, tx) => sum + tx.amount, 0);

  const totalCoinsSpent = transactions
    .filter((tx) => tx.amount < 0)
    .reduce((sum, tx) => sum + Math.abs(tx.amount), 0);

  const columns = [
    {
      key: 'user',
      header: 'User',
      render: (tx: CoinTransaction) => (
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-full bg-gradient-to-br from-[#8b5cf6] to-[#00ff88] flex items-center justify-center text-white font-bold">
            {tx.userName.charAt(0)}
          </div>
          <div>
            <p className="text-white font-medium">{tx.userName}</p>
            <p className="text-gray-500 text-xs">ID: {tx.userId}</p>
          </div>
        </div>
      ),
    },
    {
      key: 'type',
      header: 'Type',
      render: (tx: CoinTransaction) => {
        const typeStyles = {
          earned: 'bg-[#00ff88]/20 text-[#00ff88] border-[#00ff88]/30',
          spent: 'bg-red-500/20 text-red-400 border-red-500/30',
          purchased: 'bg-[#00d9ff]/20 text-[#00d9ff] border-[#00d9ff]/30',
          bonus: 'bg-[#ffd700]/20 text-[#ffd700] border-[#ffd700]/30',
          refund: 'bg-gray-500/20 text-gray-400 border-gray-500/30',
          admin_credit: 'bg-[#8b5cf6]/20 text-[#8b5cf6] border-[#8b5cf6]/30',
          admin_debit: 'bg-orange-500/20 text-orange-400 border-orange-500/30',
        };
        const typeLabels = {
          earned: 'Earned',
          spent: 'Spent',
          purchased: 'Purchased',
          bonus: 'Bonus',
          refund: 'Refund',
          admin_credit: 'Admin Credit',
          admin_debit: 'Admin Debit',
        };
        return (
          <Badge variant="outline" className={typeStyles[tx.type]}>
            {typeLabels[tx.type]}
          </Badge>
        );
      },
    },
    {
      key: 'amount',
      header: 'Amount',
      render: (tx: CoinTransaction) => (
        <div className="flex items-center gap-2">
          {tx.amount >= 0 ? (
            <ArrowUpRight className="w-4 h-4 text-[#00ff88]" />
          ) : (
            <ArrowDownRight className="w-4 h-4 text-red-400" />
          )}
          <Coins className={`w-4 h-4 ${tx.amount >= 0 ? 'text-[#ffd700]' : 'text-gray-500'}`} />
          <span className={`font-bold ${tx.amount >= 0 ? 'text-[#00ff88]' : 'text-red-400'}`}>
            {tx.amount >= 0 ? '+' : ''}{tx.amount.toLocaleString()}
          </span>
        </div>
      ),
    },
    {
      key: 'balance',
      header: 'Balance After',
      render: (tx: CoinTransaction) => (
        <span className="text-white font-medium">{tx.balance.toLocaleString()}</span>
      ),
    },
    {
      key: 'source',
      header: 'Source',
      render: (tx: CoinTransaction) => (
        <span className="text-gray-400 capitalize">{tx.source.replace('_', ' ')}</span>
      ),
    },
    {
      key: 'date',
      header: 'Date',
      render: (tx: CoinTransaction) => (
        <span className="text-gray-400 text-sm">{tx.createdAt}</span>
      ),
    },
    {
      key: 'actions',
      header: '',
      render: (tx: CoinTransaction) => (
        <Button
          variant="ghost"
          size="icon"
          onClick={() => handleView(tx)}
          className="text-gray-400 hover:text-white"
        >
          <Eye className="w-4 h-4" />
        </Button>
      ),
    },
  ];

  return (
    <div className="space-y-6">
      <PageHeader
        title="Coin History"
        description="Track all coin transactions across the platform"
        icon={Coins}
        showSearch
        searchValue={searchQuery}
        onSearchChange={setSearchQuery}
        searchPlaceholder="Search transactions..."
        showAddButton
        addButtonText="Credit Coins"
        onAddClick={() => setIsCreditModalOpen(true)}
        customAction={
          <Button
            variant="outline"
            className="border-[#2a2a3e] text-gray-400 hover:text-white hover:bg-white/10"
          >
            <Download className="w-4 h-4 mr-2" />
            Export
          </Button>
        }
      />

      {/* Stats */}
      <div className="grid grid-cols-4 gap-4">
        <div className="bg-[#141420] border border-[#2a2a3e] rounded-xl p-4">
          <div className="flex items-center justify-between">
            <p className="text-gray-400 text-sm">Total Circulating</p>
            <Wallet className="w-5 h-5 text-[#ffd700]" />
          </div>
          <p className="text-2xl font-bold text-[#ffd700] mt-2">2.5M</p>
        </div>
        <div className="bg-[#141420] border border-[#2a2a3e] rounded-xl p-4">
          <div className="flex items-center justify-between">
            <p className="text-gray-400 text-sm">Earned (This Month)</p>
            <TrendingUp className="w-5 h-5 text-[#00ff88]" />
          </div>
          <p className="text-2xl font-bold text-[#00ff88] mt-2">{totalCoinsEarned.toLocaleString()}</p>
        </div>
        <div className="bg-[#141420] border border-[#2a2a3e] rounded-xl p-4">
          <div className="flex items-center justify-between">
            <p className="text-gray-400 text-sm">Spent (This Month)</p>
            <ShoppingBag className="w-5 h-5 text-red-400" />
          </div>
          <p className="text-2xl font-bold text-red-400 mt-2">{totalCoinsSpent.toLocaleString()}</p>
        </div>
        <div className="bg-[#141420] border border-[#2a2a3e] rounded-xl p-4">
          <div className="flex items-center justify-between">
            <p className="text-gray-400 text-sm">Bonuses Given</p>
            <Gift className="w-5 h-5 text-[#8b5cf6]" />
          </div>
          <p className="text-2xl font-bold text-[#8b5cf6] mt-2">1,000</p>
        </div>
      </div>

      {/* Filters */}
      <div className="flex gap-4">
        <Select value={typeFilter} onValueChange={setTypeFilter}>
          <SelectTrigger className="w-48 bg-[#141420] border-[#2a2a3e] text-white">
            <Filter className="w-4 h-4 mr-2 text-gray-400" />
            <SelectValue placeholder="Filter by type" />
          </SelectTrigger>
          <SelectContent className="bg-[#1a1a2e] border-[#2a2a3e]">
            <SelectItem value="all" className="text-white">All Types</SelectItem>
            <SelectItem value="earned" className="text-white">Earned</SelectItem>
            <SelectItem value="spent" className="text-white">Spent</SelectItem>
            <SelectItem value="purchased" className="text-white">Purchased</SelectItem>
            <SelectItem value="bonus" className="text-white">Bonus</SelectItem>
            <SelectItem value="refund" className="text-white">Refund</SelectItem>
            <SelectItem value="admin_credit" className="text-white">Admin Credit</SelectItem>
          </SelectContent>
        </Select>
      </div>

      <DataTable
        columns={columns}
        data={paginatedTransactions}
        keyExtractor={(tx) => tx.id}
        emptyMessage="No transactions found"
        pagination={{
          currentPage,
          totalPages: Math.ceil(filteredTransactions.length / itemsPerPage),
          onPageChange: setCurrentPage,
          totalItems: filteredTransactions.length,
          itemsPerPage,
        }}
      />

      {/* View Modal */}
      <FormModal
        isOpen={isViewModalOpen}
        onClose={() => setIsViewModalOpen(false)}
        title="Transaction Details"
        size="md"
      >
        {selectedTransaction && (
          <div className="space-y-6">
            <div className="bg-[#1a1a2e] p-6 rounded-lg text-center">
              <div className="flex items-center justify-center gap-2 mb-2">
                {selectedTransaction.amount >= 0 ? (
                  <ArrowUpRight className="w-6 h-6 text-[#00ff88]" />
                ) : (
                  <ArrowDownRight className="w-6 h-6 text-red-400" />
                )}
                <Coins className="w-6 h-6 text-[#ffd700]" />
              </div>
              <p className={`text-3xl font-bold ${selectedTransaction.amount >= 0 ? 'text-[#00ff88]' : 'text-red-400'}`}>
                {selectedTransaction.amount >= 0 ? '+' : ''}{selectedTransaction.amount.toLocaleString()}
              </p>
              <p className="text-gray-400 text-sm mt-2">coins</p>
            </div>

            <div className="space-y-3">
              <div className="flex justify-between py-2 border-b border-[#2a2a3e]">
                <span className="text-gray-400">Transaction ID</span>
                <span className="text-white font-mono">{selectedTransaction.id}</span>
              </div>
              <div className="flex justify-between py-2 border-b border-[#2a2a3e]">
                <span className="text-gray-400">User</span>
                <span className="text-white">{selectedTransaction.userName}</span>
              </div>
              <div className="flex justify-between py-2 border-b border-[#2a2a3e]">
                <span className="text-gray-400">Type</span>
                <span className="text-white capitalize">{selectedTransaction.type.replace('_', ' ')}</span>
              </div>
              <div className="flex justify-between py-2 border-b border-[#2a2a3e]">
                <span className="text-gray-400">Source</span>
                <span className="text-white capitalize">{selectedTransaction.source.replace('_', ' ')}</span>
              </div>
              <div className="flex justify-between py-2 border-b border-[#2a2a3e]">
                <span className="text-gray-400">Description</span>
                <span className="text-white text-right max-w-[200px]">{selectedTransaction.description}</span>
              </div>
              <div className="flex justify-between py-2 border-b border-[#2a2a3e]">
                <span className="text-gray-400">Balance After</span>
                <span className="text-white font-bold">{selectedTransaction.balance.toLocaleString()} coins</span>
              </div>
              <div className="flex justify-between py-2">
                <span className="text-gray-400">Date</span>
                <span className="text-white">{selectedTransaction.createdAt}</span>
              </div>
            </div>
          </div>
        )}
      </FormModal>

      {/* Credit Coins Modal */}
      <FormModal
        isOpen={isCreditModalOpen}
        onClose={() => setIsCreditModalOpen(false)}
        title="Credit Coins to User"
        size="md"
      >
        <div className="space-y-4">
          <div>
            <label className="text-sm text-gray-400 mb-2 block">User ID or Email</label>
            <Input
              value={creditData.userId}
              onChange={(e) => setCreditData({ ...creditData, userId: e.target.value })}
              placeholder="Enter user ID or email"
              className="bg-[#1a1a2e] border-[#2a2a3e] text-white"
            />
          </div>
          <div>
            <label className="text-sm text-gray-400 mb-2 block">Amount</label>
            <Input
              type="number"
              value={creditData.amount || ''}
              onChange={(e) => setCreditData({ ...creditData, amount: parseInt(e.target.value) || 0 })}
              placeholder="Enter coin amount"
              className="bg-[#1a1a2e] border-[#2a2a3e] text-white"
            />
          </div>
          <div>
            <label className="text-sm text-gray-400 mb-2 block">Reason</label>
            <Input
              value={creditData.description}
              onChange={(e) => setCreditData({ ...creditData, description: e.target.value })}
              placeholder="Enter reason for credit"
              className="bg-[#1a1a2e] border-[#2a2a3e] text-white"
            />
          </div>

          <div className="flex gap-3 pt-4">
            <Button
              onClick={() => setIsCreditModalOpen(false)}
              variant="outline"
              className="flex-1 border-[#2a2a3e] text-gray-400 hover:text-white hover:bg-white/10"
            >
              Cancel
            </Button>
            <Button
              onClick={handleCredit}
              className="flex-1 bg-[#00ff88] hover:bg-[#00ff88]/80 text-black"
            >
              Credit Coins
            </Button>
          </div>
        </div>
      </FormModal>
    </div>
  );
}
