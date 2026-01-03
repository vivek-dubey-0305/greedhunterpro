import { useState } from 'react';
import { motion } from 'framer-motion';
import {
  Bell,
  Plus,
  MoreVertical,
  Edit,
  Trash2,
  Send,
  Eye,
  Users,
  CheckCircle,
  Clock,
  AlertTriangle,
  Megaphone,
  Gift,
  Info,
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Textarea } from '@/components/ui/textarea';
import { Switch } from '@/components/ui/switch';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { PageHeader, DataTable, ConfirmDialog, FormModal } from '../components';

interface Notification {
  id: string;
  title: string;
  message: string;
  type: 'info' | 'success' | 'warning' | 'promotion' | 'system';
  target: 'all' | 'premium' | 'free' | 'specific';
  targetCount: number;
  status: 'draft' | 'scheduled' | 'sent';
  scheduledAt: string | null;
  sentAt: string | null;
  readCount: number;
  createdAt: string;
  createdBy: string;
}

const mockNotifications: Notification[] = [
  {
    id: '1',
    title: 'New Feature: Dark Mode',
    message: 'We\'ve added a beautiful dark mode theme! Check it out in your settings.',
    type: 'info',
    target: 'all',
    targetCount: 15420,
    status: 'sent',
    scheduledAt: null,
    sentAt: '2024-11-15 10:00:00',
    readCount: 12540,
    createdAt: '2024-11-14',
    createdBy: 'Admin',
  },
  {
    id: '2',
    title: '🎉 Weekend Challenge Bonus!',
    message: 'Complete any challenge this weekend for 2x coins! Limited time only.',
    type: 'promotion',
    target: 'all',
    targetCount: 15420,
    status: 'scheduled',
    scheduledAt: '2024-11-16 09:00:00',
    sentAt: null,
    readCount: 0,
    createdAt: '2024-11-15',
    createdBy: 'Admin',
  },
  {
    id: '3',
    title: 'Scheduled Maintenance',
    message: 'Platform will be under maintenance on Nov 20, 2AM-4AM UTC.',
    type: 'warning',
    target: 'all',
    targetCount: 15420,
    status: 'draft',
    scheduledAt: null,
    sentAt: null,
    readCount: 0,
    createdAt: '2024-11-15',
    createdBy: 'Admin',
  },
  {
    id: '4',
    title: 'Premium Exclusive: Early Access',
    message: 'Get early access to our new quiz feature before anyone else!',
    type: 'promotion',
    target: 'premium',
    targetCount: 2150,
    status: 'sent',
    scheduledAt: null,
    sentAt: '2024-11-14 14:00:00',
    readCount: 1820,
    createdAt: '2024-11-14',
    createdBy: 'Admin',
  },
];

const notificationTypes = ['info', 'success', 'warning', 'promotion', 'system'] as const;
const targetOptions = ['all', 'premium', 'free', 'specific'] as const;

export function NotificationsManagement() {
  const [notifications, setNotifications] = useState<Notification[]>(mockNotifications);
  const [searchQuery, setSearchQuery] = useState('');
  const [isFormModalOpen, setIsFormModalOpen] = useState(false);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [isSendDialogOpen, setIsSendDialogOpen] = useState(false);
  const [selectedNotification, setSelectedNotification] = useState<Notification | null>(null);
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 10;

  const [formData, setFormData] = useState<Partial<Notification>>({
    title: '',
    message: '',
    type: 'info',
    target: 'all',
    status: 'draft',
    scheduledAt: null,
  });

  const filteredNotifications = notifications.filter(
    (notif) =>
      notif.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      notif.message.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const paginatedNotifications = filteredNotifications.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  const handleAdd = () => {
    setSelectedNotification(null);
    setFormData({
      title: '',
      message: '',
      type: 'info',
      target: 'all',
      status: 'draft',
      scheduledAt: null,
    });
    setIsFormModalOpen(true);
  };

  const handleEdit = (notif: Notification) => {
    setSelectedNotification(notif);
    setFormData(notif);
    setIsFormModalOpen(true);
  };

  const handleDelete = (notif: Notification) => {
    setSelectedNotification(notif);
    setIsDeleteDialogOpen(true);
  };

  const handleSend = (notif: Notification) => {
    setSelectedNotification(notif);
    setIsSendDialogOpen(true);
  };

  const handleSubmit = () => {
    if (selectedNotification) {
      setNotifications(
        notifications.map((n) =>
          n.id === selectedNotification.id ? { ...n, ...formData } : n
        )
      );
    } else {
      const newNotification: Notification = {
        ...formData as Notification,
        id: Date.now().toString(),
        targetCount: formData.target === 'all' ? 15420 : formData.target === 'premium' ? 2150 : 13270,
        readCount: 0,
        sentAt: null,
        createdAt: new Date().toISOString().split('T')[0],
        createdBy: 'Admin',
      };
      setNotifications([newNotification, ...notifications]);
    }
    setIsFormModalOpen(false);
  };

  const confirmDelete = () => {
    if (selectedNotification) {
      setNotifications(notifications.filter((n) => n.id !== selectedNotification.id));
    }
    setIsDeleteDialogOpen(false);
    setSelectedNotification(null);
  };

  const confirmSend = () => {
    if (selectedNotification) {
      setNotifications(
        notifications.map((n) =>
          n.id === selectedNotification.id
            ? { ...n, status: 'sent', sentAt: new Date().toISOString() }
            : n
        )
      );
    }
    setIsSendDialogOpen(false);
    setSelectedNotification(null);
  };

  const getTypeIcon = (type: string) => {
    switch (type) {
      case 'info':
        return <Info className="w-4 h-4" />;
      case 'success':
        return <CheckCircle className="w-4 h-4" />;
      case 'warning':
        return <AlertTriangle className="w-4 h-4" />;
      case 'promotion':
        return <Gift className="w-4 h-4" />;
      case 'system':
        return <Megaphone className="w-4 h-4" />;
      default:
        return <Bell className="w-4 h-4" />;
    }
  };

  const columns = [
    {
      key: 'notification',
      header: 'Notification',
      render: (notif: Notification) => (
        <div className="max-w-[300px]">
          <div className="flex items-center gap-2">
            <p className="text-white font-medium truncate">{notif.title}</p>
          </div>
          <p className="text-gray-500 text-xs truncate">{notif.message}</p>
        </div>
      ),
    },
    {
      key: 'type',
      header: 'Type',
      render: (notif: Notification) => {
        const typeStyles = {
          info: 'bg-[#00d9ff]/20 text-[#00d9ff] border-[#00d9ff]/30',
          success: 'bg-[#00ff88]/20 text-[#00ff88] border-[#00ff88]/30',
          warning: 'bg-yellow-500/20 text-yellow-400 border-yellow-500/30',
          promotion: 'bg-[#ffd700]/20 text-[#ffd700] border-[#ffd700]/30',
          system: 'bg-[#8b5cf6]/20 text-[#8b5cf6] border-[#8b5cf6]/30',
        };
        return (
          <Badge variant="outline" className={`${typeStyles[notif.type]} flex items-center gap-1`}>
            {getTypeIcon(notif.type)}
            {notif.type.charAt(0).toUpperCase() + notif.type.slice(1)}
          </Badge>
        );
      },
    },
    {
      key: 'target',
      header: 'Target',
      render: (notif: Notification) => (
        <div className="flex items-center gap-2">
          <Users className="w-4 h-4 text-gray-400" />
          <span className="text-gray-300 capitalize">{notif.target}</span>
          <span className="text-gray-500 text-xs">({notif.targetCount.toLocaleString()})</span>
        </div>
      ),
    },
    {
      key: 'status',
      header: 'Status',
      render: (notif: Notification) => {
        const statusStyles = {
          draft: 'bg-gray-500/20 text-gray-400 border-gray-500/30',
          scheduled: 'bg-yellow-500/20 text-yellow-400 border-yellow-500/30',
          sent: 'bg-[#00ff88]/20 text-[#00ff88] border-[#00ff88]/30',
        };
        const statusIcons = {
          draft: <Edit className="w-3 h-3" />,
          scheduled: <Clock className="w-3 h-3" />,
          sent: <CheckCircle className="w-3 h-3" />,
        };
        return (
          <Badge variant="outline" className={`${statusStyles[notif.status]} flex items-center gap-1`}>
            {statusIcons[notif.status]}
            {notif.status.charAt(0).toUpperCase() + notif.status.slice(1)}
          </Badge>
        );
      },
    },
    {
      key: 'readRate',
      header: 'Read Rate',
      render: (notif: Notification) => {
        if (notif.status !== 'sent') return <span className="text-gray-500">-</span>;
        const rate = Math.round((notif.readCount / notif.targetCount) * 100);
        return (
          <div className="flex items-center gap-2">
            <div className="w-16 h-2 bg-[#1a1a2e] rounded-full overflow-hidden">
              <div
                className="h-full bg-[#00ff88] rounded-full"
                style={{ width: `${rate}%` }}
              />
            </div>
            <span className="text-white text-sm">{rate}%</span>
          </div>
        );
      },
    },
    {
      key: 'actions',
      header: 'Actions',
      render: (notif: Notification) => (
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" size="icon" className="text-gray-400 hover:text-white">
              <MoreVertical className="w-4 h-4" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end" className="bg-[#1a1a2e] border-[#2a2a3e]">
            {notif.status !== 'sent' && (
              <>
                <DropdownMenuItem
                  onClick={() => handleEdit(notif)}
                  className="text-gray-300 hover:text-white hover:bg-white/10"
                >
                  <Edit className="w-4 h-4 mr-2" />
                  Edit
                </DropdownMenuItem>
                <DropdownMenuItem
                  onClick={() => handleSend(notif)}
                  className="text-[#00ff88] hover:bg-[#00ff88]/10"
                >
                  <Send className="w-4 h-4 mr-2" />
                  Send Now
                </DropdownMenuItem>
                <DropdownMenuSeparator className="bg-[#2a2a3e]" />
              </>
            )}
            <DropdownMenuItem
              onClick={() => handleDelete(notif)}
              className="text-red-400 hover:bg-red-500/10"
            >
              <Trash2 className="w-4 h-4 mr-2" />
              Delete
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      ),
    },
  ];

  return (
    <div className="space-y-6">
      <PageHeader
        title="Notifications"
        description="Create and manage global notifications"
        icon={Bell}
        showSearch
        searchValue={searchQuery}
        onSearchChange={setSearchQuery}
        searchPlaceholder="Search notifications..."
        showAddButton
        addButtonText="Create Notification"
        onAddClick={handleAdd}
        showFilter
      />

      {/* Stats */}
      <div className="grid grid-cols-4 gap-4">
        <div className="bg-[#141420] border border-[#2a2a3e] rounded-xl p-4">
          <p className="text-gray-400 text-sm">Total Notifications</p>
          <p className="text-2xl font-bold text-white">{notifications.length}</p>
        </div>
        <div className="bg-[#141420] border border-[#2a2a3e] rounded-xl p-4">
          <p className="text-gray-400 text-sm">Sent</p>
          <p className="text-2xl font-bold text-[#00ff88]">{notifications.filter((n) => n.status === 'sent').length}</p>
        </div>
        <div className="bg-[#141420] border border-[#2a2a3e] rounded-xl p-4">
          <p className="text-gray-400 text-sm">Scheduled</p>
          <p className="text-2xl font-bold text-yellow-400">{notifications.filter((n) => n.status === 'scheduled').length}</p>
        </div>
        <div className="bg-[#141420] border border-[#2a2a3e] rounded-xl p-4">
          <p className="text-gray-400 text-sm">Drafts</p>
          <p className="text-2xl font-bold text-gray-400">{notifications.filter((n) => n.status === 'draft').length}</p>
        </div>
      </div>

      <DataTable
        columns={columns}
        data={paginatedNotifications}
        keyExtractor={(notif) => notif.id}
        emptyMessage="No notifications found"
        pagination={{
          currentPage,
          totalPages: Math.ceil(filteredNotifications.length / itemsPerPage),
          onPageChange: setCurrentPage,
          totalItems: filteredNotifications.length,
          itemsPerPage,
        }}
      />

      {/* Form Modal */}
      <FormModal
        isOpen={isFormModalOpen}
        onClose={() => setIsFormModalOpen(false)}
        title={selectedNotification ? 'Edit Notification' : 'Create Notification'}
        size="lg"
      >
        <div className="space-y-4">
          <div>
            <label className="text-sm text-gray-400 mb-2 block">Title</label>
            <Input
              value={formData.title || ''}
              onChange={(e) => setFormData({ ...formData, title: e.target.value })}
              placeholder="Enter notification title"
              className="bg-[#1a1a2e] border-[#2a2a3e] text-white"
            />
          </div>

          <div>
            <label className="text-sm text-gray-400 mb-2 block">Message</label>
            <Textarea
              value={formData.message || ''}
              onChange={(e) => setFormData({ ...formData, message: e.target.value })}
              placeholder="Enter notification message"
              className="bg-[#1a1a2e] border-[#2a2a3e] text-white min-h-[100px]"
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="text-sm text-gray-400 mb-2 block">Type</label>
              <Select
                value={formData.type}
                onValueChange={(value) => setFormData({ ...formData, type: value as Notification['type'] })}
              >
                <SelectTrigger className="bg-[#1a1a2e] border-[#2a2a3e] text-white">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent className="bg-[#1a1a2e] border-[#2a2a3e]">
                  {notificationTypes.map((type) => (
                    <SelectItem key={type} value={type} className="text-white capitalize">
                      {type}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div>
              <label className="text-sm text-gray-400 mb-2 block">Target Audience</label>
              <Select
                value={formData.target}
                onValueChange={(value) => setFormData({ ...formData, target: value as Notification['target'] })}
              >
                <SelectTrigger className="bg-[#1a1a2e] border-[#2a2a3e] text-white">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent className="bg-[#1a1a2e] border-[#2a2a3e]">
                  {targetOptions.map((target) => (
                    <SelectItem key={target} value={target} className="text-white capitalize">
                      {target === 'all' ? 'All Users' : target === 'premium' ? 'Premium Users' : target === 'free' ? 'Free Users' : 'Specific Users'}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>

          <div>
            <label className="text-sm text-gray-400 mb-2 block">Schedule (optional)</label>
            <Input
              type="datetime-local"
              value={formData.scheduledAt || ''}
              onChange={(e) => setFormData({ ...formData, scheduledAt: e.target.value, status: e.target.value ? 'scheduled' : 'draft' })}
              className="bg-[#1a1a2e] border-[#2a2a3e] text-white"
            />
          </div>

          <div className="flex gap-3 pt-4">
            <Button
              onClick={() => setIsFormModalOpen(false)}
              variant="outline"
              className="flex-1 border-[#2a2a3e] text-gray-400 hover:text-white hover:bg-white/10"
            >
              Cancel
            </Button>
            <Button
              onClick={handleSubmit}
              variant="outline"
              className="flex-1 border-[#2a2a3e] text-white hover:bg-white/10"
            >
              Save Draft
            </Button>
            <Button
              onClick={() => {
                handleSubmit();
                // Would trigger send
              }}
              className="flex-1 bg-[#00ff88] hover:bg-[#00ff88]/80 text-black"
            >
              <Send className="w-4 h-4 mr-2" />
              Send Now
            </Button>
          </div>
        </div>
      </FormModal>

      {/* Delete Confirmation */}
      <ConfirmDialog
        isOpen={isDeleteDialogOpen}
        onClose={() => setIsDeleteDialogOpen(false)}
        onConfirm={confirmDelete}
        title="Delete Notification"
        description={`Are you sure you want to delete "${selectedNotification?.title}"?`}
        confirmText="Delete"
        variant="danger"
      />

      {/* Send Confirmation */}
      <ConfirmDialog
        isOpen={isSendDialogOpen}
        onClose={() => setIsSendDialogOpen(false)}
        onConfirm={confirmSend}
        title="Send Notification"
        description={`Are you sure you want to send "${selectedNotification?.title}" to ${selectedNotification?.targetCount.toLocaleString()} users?`}
        confirmText="Send Now"
        variant="default"
      />
    </div>
  );
}
