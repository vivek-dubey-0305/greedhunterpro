import { useState } from 'react';
import { motion } from 'framer-motion';
import {
  CreditCard,
  MoreVertical,
  Eye,
  RefreshCcw,
  Download,
  CheckCircle,
  XCircle,
  Clock,
  DollarSign,
  TrendingUp,
  ArrowUpRight,
  ArrowDownRight,
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { PageHeader, DataTable, ConfirmDialog, FormModal } from '../components';

interface Payment {
  id: string;
  transactionId: string;
  userId: string;
  userName: string;
  userEmail: string;
  type: 'purchase' | 'subscription' | 'coin_purchase' | 'refund' | 'payout';
  amount: number;
  currency: string;
  status: 'completed' | 'pending' | 'failed' | 'refunded';
  paymentMethod: string;
  description: string;
  createdAt: string;
}

const mockPayments: Payment[] = [
  {
    id: '1',
    transactionId: 'TXN-2024-001234',
    userId: 'u1',
    userName: 'John Doe',
    userEmail: 'john@example.com',
    type: 'subscription',
    amount: 9.99,
    currency: 'USD',
    status: 'completed',
    paymentMethod: 'Visa •••• 4242',
    description: 'Premium Monthly Subscription',
    createdAt: '2024-11-15 14:32:00',
  },
  {
    id: '2',
    transactionId: 'TXN-2024-001235',
    userId: 'u2',
    userName: 'Sarah Smith',
    userEmail: 'sarah@example.com',
    type: 'coin_purchase',
    amount: 19.99,
    currency: 'USD',
    status: 'completed',
    paymentMethod: 'PayPal',
    description: '2500 Coins Package',
    createdAt: '2024-11-15 12:15:00',
  },
  {
    id: '3',
    transactionId: 'TXN-2024-001236',
    userId: 'u3',
    userName: 'Mike Developer',
    userEmail: 'mike@example.com',
    type: 'purchase',
    amount: 4.99,
    currency: 'USD',
    status: 'pending',
    paymentMethod: 'Mastercard •••• 5555',
    description: 'Premium Theme Pack',
    createdAt: '2024-11-15 10:45:00',
  },
  {
    id: '4',
    transactionId: 'TXN-2024-001237',
    userId: 'u4',
    userName: 'Alice Coder',
    userEmail: 'alice@example.com',
    type: 'refund',
    amount: -9.99,
    currency: 'USD',
    status: 'refunded',
    paymentMethod: 'Visa •••• 1234',
    description: 'Refund - Premium Monthly Subscription',
    createdAt: '2024-11-14 16:20:00',
  },
  {
    id: '5',
    transactionId: 'TXN-2024-001238',
    userId: 'u5',
    userName: 'Bob Builder',
    userEmail: 'bob@example.com',
    type: 'subscription',
    amount: 99.99,
    currency: 'USD',
    status: 'failed',
    paymentMethod: 'Amex •••• 3782',
    description: 'Premium Yearly Subscription',
    createdAt: '2024-11-14 09:10:00',
  },
];

export function PaymentsManagement() {
  const [payments, setPayments] = useState<Payment[]>(mockPayments);
  const [searchQuery, setSearchQuery] = useState('');
  const [isViewModalOpen, setIsViewModalOpen] = useState(false);
  const [isRefundDialogOpen, setIsRefundDialogOpen] = useState(false);
  const [selectedPayment, setSelectedPayment] = useState<Payment | null>(null);
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 10;

  const filteredPayments = payments.filter(
    (payment) =>
      payment.userName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      payment.transactionId.toLowerCase().includes(searchQuery.toLowerCase()) ||
      payment.userEmail.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const paginatedPayments = filteredPayments.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  const handleView = (payment: Payment) => {
    setSelectedPayment(payment);
    setIsViewModalOpen(true);
  };

  const handleRefund = (payment: Payment) => {
    setSelectedPayment(payment);
    setIsRefundDialogOpen(true);
  };

  const confirmRefund = () => {
    if (selectedPayment) {
      setPayments(
        payments.map((p) =>
          p.id === selectedPayment.id ? { ...p, status: 'refunded' } : p
        )
      );
    }
    setIsRefundDialogOpen(false);
    setSelectedPayment(null);
  };

  const totalRevenue = payments
    .filter((p) => p.status === 'completed' && p.amount > 0)
    .reduce((sum, p) => sum + p.amount, 0);
  
  const pendingAmount = payments
    .filter((p) => p.status === 'pending')
    .reduce((sum, p) => sum + p.amount, 0);
  
  const refundedAmount = payments
    .filter((p) => p.status === 'refunded')
    .reduce((sum, p) => sum + Math.abs(p.amount), 0);

  const columns = [
    {
      key: 'transaction',
      header: 'Transaction',
      render: (payment: Payment) => (
        <div>
          <p className="text-white font-mono text-sm">{payment.transactionId}</p>
          <p className="text-gray-500 text-xs">{payment.createdAt}</p>
        </div>
      ),
    },
    {
      key: 'user',
      header: 'User',
      render: (payment: Payment) => (
        <div>
          <p className="text-white font-medium">{payment.userName}</p>
          <p className="text-gray-500 text-xs">{payment.userEmail}</p>
        </div>
      ),
    },
    {
      key: 'type',
      header: 'Type',
      render: (payment: Payment) => {
        const typeStyles = {
          purchase: 'bg-[#8b5cf6]/20 text-[#8b5cf6] border-[#8b5cf6]/30',
          subscription: 'bg-[#00d9ff]/20 text-[#00d9ff] border-[#00d9ff]/30',
          coin_purchase: 'bg-[#ffd700]/20 text-[#ffd700] border-[#ffd700]/30',
          refund: 'bg-red-500/20 text-red-400 border-red-500/30',
          payout: 'bg-green-500/20 text-green-400 border-green-500/30',
        };
        const typeLabels = {
          purchase: 'Purchase',
          subscription: 'Subscription',
          coin_purchase: 'Coin Purchase',
          refund: 'Refund',
          payout: 'Payout',
        };
        return (
          <Badge variant="outline" className={typeStyles[payment.type]}>
            {typeLabels[payment.type]}
          </Badge>
        );
      },
    },
    {
      key: 'amount',
      header: 'Amount',
      render: (payment: Payment) => (
        <div className="flex items-center gap-1">
          {payment.amount >= 0 ? (
            <ArrowUpRight className="w-4 h-4 text-[#00ff88]" />
          ) : (
            <ArrowDownRight className="w-4 h-4 text-red-400" />
          )}
          <span className={`font-bold ${payment.amount >= 0 ? 'text-[#00ff88]' : 'text-red-400'}`}>
            {payment.amount >= 0 ? '+' : ''}${Math.abs(payment.amount).toFixed(2)}
          </span>
        </div>
      ),
    },
    {
      key: 'method',
      header: 'Method',
      render: (payment: Payment) => (
        <span className="text-gray-400 text-sm">{payment.paymentMethod}</span>
      ),
    },
    {
      key: 'status',
      header: 'Status',
      render: (payment: Payment) => {
        const statusStyles = {
          completed: 'bg-green-500/20 text-green-400 border-green-500/30',
          pending: 'bg-yellow-500/20 text-yellow-400 border-yellow-500/30',
          failed: 'bg-red-500/20 text-red-400 border-red-500/30',
          refunded: 'bg-gray-500/20 text-gray-400 border-gray-500/30',
        };
        const statusIcons = {
          completed: <CheckCircle className="w-3 h-3" />,
          pending: <Clock className="w-3 h-3" />,
          failed: <XCircle className="w-3 h-3" />,
          refunded: <RefreshCcw className="w-3 h-3" />,
        };
        return (
          <Badge variant="outline" className={`${statusStyles[payment.status]} flex items-center gap-1`}>
            {statusIcons[payment.status]}
            {payment.status.charAt(0).toUpperCase() + payment.status.slice(1)}
          </Badge>
        );
      },
    },
    {
      key: 'actions',
      header: 'Actions',
      render: (payment: Payment) => (
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" size="icon" className="text-gray-400 hover:text-white">
              <MoreVertical className="w-4 h-4" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end" className="bg-[#1a1a2e] border-[#2a2a3e]">
            <DropdownMenuItem
              onClick={() => handleView(payment)}
              className="text-gray-300 hover:text-white hover:bg-white/10"
            >
              <Eye className="w-4 h-4 mr-2" />
              View Details
            </DropdownMenuItem>
            {payment.status === 'completed' && payment.amount > 0 && (
              <>
                <DropdownMenuSeparator className="bg-[#2a2a3e]" />
                <DropdownMenuItem
                  onClick={() => handleRefund(payment)}
                  className="text-red-400 hover:bg-red-500/10"
                >
                  <RefreshCcw className="w-4 h-4 mr-2" />
                  Issue Refund
                </DropdownMenuItem>
              </>
            )}
          </DropdownMenuContent>
        </DropdownMenu>
      ),
    },
  ];

  return (
    <div className="space-y-6">
      <PageHeader
        title="Payments Management"
        description="Track and manage all payment transactions"
        icon={CreditCard}
        showSearch
        searchValue={searchQuery}
        onSearchChange={setSearchQuery}
        searchPlaceholder="Search transactions..."
        showFilter
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
            <p className="text-gray-400 text-sm">Total Revenue</p>
            <DollarSign className="w-5 h-5 text-[#00ff88]" />
          </div>
          <p className="text-2xl font-bold text-[#00ff88] mt-2">${totalRevenue.toFixed(2)}</p>
        </div>
        <div className="bg-[#141420] border border-[#2a2a3e] rounded-xl p-4">
          <div className="flex items-center justify-between">
            <p className="text-gray-400 text-sm">Pending</p>
            <Clock className="w-5 h-5 text-yellow-400" />
          </div>
          <p className="text-2xl font-bold text-yellow-400 mt-2">${pendingAmount.toFixed(2)}</p>
        </div>
        <div className="bg-[#141420] border border-[#2a2a3e] rounded-xl p-4">
          <div className="flex items-center justify-between">
            <p className="text-gray-400 text-sm">Refunded</p>
            <RefreshCcw className="w-5 h-5 text-red-400" />
          </div>
          <p className="text-2xl font-bold text-red-400 mt-2">${refundedAmount.toFixed(2)}</p>
        </div>
        <div className="bg-[#141420] border border-[#2a2a3e] rounded-xl p-4">
          <div className="flex items-center justify-between">
            <p className="text-gray-400 text-sm">Transactions</p>
            <TrendingUp className="w-5 h-5 text-[#8b5cf6]" />
          </div>
          <p className="text-2xl font-bold text-white mt-2">{payments.length}</p>
        </div>
      </div>

      <DataTable
        columns={columns}
        data={paginatedPayments}
        keyExtractor={(payment) => payment.id}
        emptyMessage="No transactions found"
        pagination={{
          currentPage,
          totalPages: Math.ceil(filteredPayments.length / itemsPerPage),
          onPageChange: setCurrentPage,
          totalItems: filteredPayments.length,
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
        {selectedPayment && (
          <div className="space-y-6">
            <div className="bg-[#1a1a2e] p-4 rounded-lg text-center">
              <p className="text-gray-400 text-sm mb-2">Amount</p>
              <p className={`text-3xl font-bold ${selectedPayment.amount >= 0 ? 'text-[#00ff88]' : 'text-red-400'}`}>
                {selectedPayment.amount >= 0 ? '+' : ''}${Math.abs(selectedPayment.amount).toFixed(2)}
              </p>
              <p className="text-gray-500 text-sm mt-1">{selectedPayment.currency}</p>
            </div>

            <div className="space-y-3">
              <div className="flex justify-between py-2 border-b border-[#2a2a3e]">
                <span className="text-gray-400">Transaction ID</span>
                <span className="text-white font-mono">{selectedPayment.transactionId}</span>
              </div>
              <div className="flex justify-between py-2 border-b border-[#2a2a3e]">
                <span className="text-gray-400">User</span>
                <div className="text-right">
                  <p className="text-white">{selectedPayment.userName}</p>
                  <p className="text-gray-500 text-xs">{selectedPayment.userEmail}</p>
                </div>
              </div>
              <div className="flex justify-between py-2 border-b border-[#2a2a3e]">
                <span className="text-gray-400">Type</span>
                <span className="text-white capitalize">{selectedPayment.type.replace('_', ' ')}</span>
              </div>
              <div className="flex justify-between py-2 border-b border-[#2a2a3e]">
                <span className="text-gray-400">Payment Method</span>
                <span className="text-white">{selectedPayment.paymentMethod}</span>
              </div>
              <div className="flex justify-between py-2 border-b border-[#2a2a3e]">
                <span className="text-gray-400">Description</span>
                <span className="text-white">{selectedPayment.description}</span>
              </div>
              <div className="flex justify-between py-2 border-b border-[#2a2a3e]">
                <span className="text-gray-400">Date</span>
                <span className="text-white">{selectedPayment.createdAt}</span>
              </div>
              <div className="flex justify-between py-2">
                <span className="text-gray-400">Status</span>
                <Badge
                  variant="outline"
                  className={
                    selectedPayment.status === 'completed'
                      ? 'bg-green-500/20 text-green-400 border-green-500/30'
                      : selectedPayment.status === 'pending'
                      ? 'bg-yellow-500/20 text-yellow-400 border-yellow-500/30'
                      : selectedPayment.status === 'refunded'
                      ? 'bg-gray-500/20 text-gray-400 border-gray-500/30'
                      : 'bg-red-500/20 text-red-400 border-red-500/30'
                  }
                >
                  {selectedPayment.status.charAt(0).toUpperCase() + selectedPayment.status.slice(1)}
                </Badge>
              </div>
            </div>

            {selectedPayment.status === 'completed' && selectedPayment.amount > 0 && (
              <Button
                onClick={() => {
                  setIsViewModalOpen(false);
                  handleRefund(selectedPayment);
                }}
                variant="outline"
                className="w-full border-red-500/30 text-red-400 hover:bg-red-500/10"
              >
                <RefreshCcw className="w-4 h-4 mr-2" />
                Issue Refund
              </Button>
            )}
          </div>
        )}
      </FormModal>

      {/* Refund Confirmation */}
      <ConfirmDialog
        isOpen={isRefundDialogOpen}
        onClose={() => setIsRefundDialogOpen(false)}
        onConfirm={confirmRefund}
        title="Issue Refund"
        description={`Are you sure you want to refund $${selectedPayment?.amount.toFixed(2)} to ${selectedPayment?.userName}? This action cannot be undone.`}
        confirmText="Issue Refund"
        variant="danger"
      />
    </div>
  );
}
