import { useState } from 'react';
import { motion } from 'framer-motion';
import {
  MessageSquare,
  MoreVertical,
  Eye,
  Trash2,
  Ban,
  Clock,
  Users,
  AlertTriangle,
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

interface ChatRoom {
  id: string;
  type: 'direct' | 'group';
  name: string;
  participants: string[];
  messageCount: number;
  lastActivity: string;
  createdAt: string;
  status: 'active' | 'flagged' | 'blocked';
  reportCount: number;
}

const mockChats: ChatRoom[] = [
  {
    id: '1',
    type: 'group',
    name: 'JavaScript Devs',
    participants: ['john_doe', 'sarah_smith', 'mike_dev', 'alex_code'],
    messageCount: 15420,
    lastActivity: '2 minutes ago',
    createdAt: '2024-06-15',
    status: 'active',
    reportCount: 0,
  },
  {
    id: '2',
    type: 'direct',
    name: 'john_doe & sarah_smith',
    participants: ['john_doe', 'sarah_smith'],
    messageCount: 2150,
    lastActivity: '1 hour ago',
    createdAt: '2024-08-20',
    status: 'active',
    reportCount: 0,
  },
  {
    id: '3',
    type: 'group',
    name: 'Flagged Chat Room',
    participants: ['bad_user1', 'bad_user2', 'victim_user'],
    messageCount: 520,
    lastActivity: '30 minutes ago',
    createdAt: '2024-11-01',
    status: 'flagged',
    reportCount: 5,
  },
  {
    id: '4',
    type: 'group',
    name: 'Blocked Chat',
    participants: ['banned_user', 'suspended_user'],
    messageCount: 120,
    lastActivity: '2 days ago',
    createdAt: '2024-10-15',
    status: 'blocked',
    reportCount: 12,
  },
];

export function ChatsManagement() {
  const [chats, setChats] = useState<ChatRoom[]>(mockChats);
  const [searchQuery, setSearchQuery] = useState('');
  const [isViewModalOpen, setIsViewModalOpen] = useState(false);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [isBlockDialogOpen, setIsBlockDialogOpen] = useState(false);
  const [selectedChat, setSelectedChat] = useState<ChatRoom | null>(null);
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 10;

  const filteredChats = chats.filter(
    (chat) =>
      chat.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      chat.participants.some((p) => p.toLowerCase().includes(searchQuery.toLowerCase()))
  );

  const paginatedChats = filteredChats.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  const handleView = (chat: ChatRoom) => {
    setSelectedChat(chat);
    setIsViewModalOpen(true);
  };

  const handleDelete = (chat: ChatRoom) => {
    setSelectedChat(chat);
    setIsDeleteDialogOpen(true);
  };

  const handleBlock = (chat: ChatRoom) => {
    setSelectedChat(chat);
    setIsBlockDialogOpen(true);
  };

  const confirmDelete = () => {
    if (selectedChat) {
      setChats(chats.filter((c) => c.id !== selectedChat.id));
    }
    setIsDeleteDialogOpen(false);
    setSelectedChat(null);
  };

  const confirmBlock = () => {
    if (selectedChat) {
      setChats(
        chats.map((c) =>
          c.id === selectedChat.id
            ? { ...c, status: c.status === 'blocked' ? 'active' : 'blocked' }
            : c
        )
      );
    }
    setIsBlockDialogOpen(false);
    setSelectedChat(null);
  };

  const clearFlag = (chatId: string) => {
    setChats(
      chats.map((c) =>
        c.id === chatId ? { ...c, status: 'active', reportCount: 0 } : c
      )
    );
  };

  const columns = [
    {
      key: 'chat',
      header: 'Chat',
      render: (chat: ChatRoom) => (
        <div className="flex items-center gap-3">
          <div
            className={`w-10 h-10 rounded-lg flex items-center justify-center ${
              chat.type === 'group' ? 'bg-[#8b5cf6]/20' : 'bg-[#00ff88]/20'
            }`}
          >
            {chat.type === 'group' ? (
              <Users className="w-5 h-5 text-[#8b5cf6]" />
            ) : (
              <MessageSquare className="w-5 h-5 text-[#00ff88]" />
            )}
          </div>
          <div>
            <div className="flex items-center gap-2">
              <p className="text-white font-medium">{chat.name}</p>
              {chat.reportCount > 0 && (
                <Badge className="bg-red-500/20 text-red-400 border-red-500/30 text-xs">
                  {chat.reportCount} reports
                </Badge>
              )}
            </div>
            <p className="text-gray-500 text-xs capitalize">{chat.type} chat</p>
          </div>
        </div>
      ),
    },
    {
      key: 'participants',
      header: 'Participants',
      render: (chat: ChatRoom) => (
        <span className="text-white">{chat.participants.length}</span>
      ),
    },
    {
      key: 'messages',
      header: 'Messages',
      render: (chat: ChatRoom) => (
        <span className="text-gray-400">{chat.messageCount.toLocaleString()}</span>
      ),
    },
    {
      key: 'lastActivity',
      header: 'Last Activity',
      render: (chat: ChatRoom) => (
        <div className="flex items-center gap-1 text-gray-400 text-sm">
          <Clock className="w-3 h-3" />
          <span>{chat.lastActivity}</span>
        </div>
      ),
    },
    {
      key: 'status',
      header: 'Status',
      render: (chat: ChatRoom) => {
        const styles = {
          active: 'bg-green-500/20 text-green-400 border-green-500/30',
          flagged: 'bg-yellow-500/20 text-yellow-400 border-yellow-500/30',
          blocked: 'bg-red-500/20 text-red-400 border-red-500/30',
        };
        return (
          <Badge variant="outline" className={styles[chat.status]}>
            {chat.status.charAt(0).toUpperCase() + chat.status.slice(1)}
          </Badge>
        );
      },
    },
    {
      key: 'actions',
      header: 'Actions',
      render: (chat: ChatRoom) => (
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" size="icon" className="text-gray-400 hover:text-white">
              <MoreVertical className="w-4 h-4" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end" className="bg-[#1a1a2e] border-[#2a2a3e]">
            <DropdownMenuItem
              onClick={() => handleView(chat)}
              className="text-gray-300 hover:text-white hover:bg-white/10"
            >
              <Eye className="w-4 h-4 mr-2" />
              View Details
            </DropdownMenuItem>
            {chat.status === 'flagged' && (
              <DropdownMenuItem
                onClick={() => clearFlag(chat.id)}
                className="text-green-400 hover:bg-green-500/10"
              >
                <AlertTriangle className="w-4 h-4 mr-2" />
                Clear Flag
              </DropdownMenuItem>
            )}
            <DropdownMenuSeparator className="bg-[#2a2a3e]" />
            <DropdownMenuItem
              onClick={() => handleBlock(chat)}
              className={chat.status === 'blocked' ? 'text-green-400 hover:bg-green-500/10' : 'text-yellow-400 hover:bg-yellow-500/10'}
            >
              <Ban className="w-4 h-4 mr-2" />
              {chat.status === 'blocked' ? 'Unblock' : 'Block'}
            </DropdownMenuItem>
            <DropdownMenuItem
              onClick={() => handleDelete(chat)}
              className="text-red-400 hover:bg-red-500/10"
            >
              <Trash2 className="w-4 h-4 mr-2" />
              Delete Chat
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      ),
    },
  ];

  return (
    <div className="space-y-6">
      <PageHeader
        title="Chats Management"
        description="Monitor and manage all chat rooms and direct messages"
        icon={MessageSquare}
        showSearch
        searchValue={searchQuery}
        onSearchChange={setSearchQuery}
        searchPlaceholder="Search chats or users..."
        showFilter
      />

      {/* Stats */}
      <div className="grid grid-cols-4 gap-4">
        <div className="bg-[#141420] border border-[#2a2a3e] rounded-xl p-4">
          <p className="text-gray-400 text-sm">Total Chats</p>
          <p className="text-2xl font-bold text-white">{chats.length}</p>
        </div>
        <div className="bg-[#141420] border border-[#2a2a3e] rounded-xl p-4">
          <p className="text-gray-400 text-sm">Active</p>
          <p className="text-2xl font-bold text-green-400">{chats.filter((c) => c.status === 'active').length}</p>
        </div>
        <div className="bg-[#141420] border border-[#2a2a3e] rounded-xl p-4">
          <p className="text-gray-400 text-sm">Flagged</p>
          <p className="text-2xl font-bold text-yellow-400">{chats.filter((c) => c.status === 'flagged').length}</p>
        </div>
        <div className="bg-[#141420] border border-[#2a2a3e] rounded-xl p-4">
          <p className="text-gray-400 text-sm">Blocked</p>
          <p className="text-2xl font-bold text-red-400">{chats.filter((c) => c.status === 'blocked').length}</p>
        </div>
      </div>

      <DataTable
        columns={columns}
        data={paginatedChats}
        keyExtractor={(chat) => chat.id}
        emptyMessage="No chats found"
        pagination={{
          currentPage,
          totalPages: Math.ceil(filteredChats.length / itemsPerPage),
          onPageChange: setCurrentPage,
          totalItems: filteredChats.length,
          itemsPerPage,
        }}
      />

      {/* View Modal */}
      <FormModal
        isOpen={isViewModalOpen}
        onClose={() => setIsViewModalOpen(false)}
        title="Chat Details"
        size="lg"
      >
        {selectedChat && (
          <div className="space-y-6">
            <div className="flex items-center gap-4">
              <div
                className={`w-16 h-16 rounded-xl flex items-center justify-center ${
                  selectedChat.type === 'group' ? 'bg-[#8b5cf6]/20' : 'bg-[#00ff88]/20'
                }`}
              >
                {selectedChat.type === 'group' ? (
                  <Users className="w-8 h-8 text-[#8b5cf6]" />
                ) : (
                  <MessageSquare className="w-8 h-8 text-[#00ff88]" />
                )}
              </div>
              <div>
                <h3 className="text-xl font-bold text-white">{selectedChat.name}</h3>
                <p className="text-gray-400 capitalize">{selectedChat.type} Chat</p>
              </div>
            </div>

            <div className="grid grid-cols-3 gap-4">
              <div className="bg-[#1a1a2e] p-4 rounded-lg text-center">
                <Users className="w-5 h-5 text-[#8b5cf6] mx-auto mb-2" />
                <p className="text-xl font-bold text-white">{selectedChat.participants.length}</p>
                <p className="text-gray-500 text-xs">Participants</p>
              </div>
              <div className="bg-[#1a1a2e] p-4 rounded-lg text-center">
                <MessageSquare className="w-5 h-5 text-[#00ff88] mx-auto mb-2" />
                <p className="text-xl font-bold text-white">{selectedChat.messageCount.toLocaleString()}</p>
                <p className="text-gray-500 text-xs">Messages</p>
              </div>
              <div className="bg-[#1a1a2e] p-4 rounded-lg text-center">
                <AlertTriangle className="w-5 h-5 text-[#ffd700] mx-auto mb-2" />
                <p className="text-xl font-bold text-white">{selectedChat.reportCount}</p>
                <p className="text-gray-500 text-xs">Reports</p>
              </div>
            </div>

            <div>
              <h4 className="text-white font-medium mb-3">Participants</h4>
              <div className="flex flex-wrap gap-2">
                {selectedChat.participants.map((participant) => (
                  <Badge key={participant} variant="outline" className="bg-[#1a1a2e] text-gray-300 border-[#2a2a3e]">
                    @{participant}
                  </Badge>
                ))}
              </div>
            </div>

            <div className="bg-[#1a1a2e] p-4 rounded-lg">
              <div className="flex justify-between text-sm">
                <span className="text-gray-400">Created</span>
                <span className="text-white">{selectedChat.createdAt}</span>
              </div>
              <div className="flex justify-between text-sm mt-2">
                <span className="text-gray-400">Last Activity</span>
                <span className="text-white">{selectedChat.lastActivity}</span>
              </div>
            </div>
          </div>
        )}
      </FormModal>

      {/* Delete Confirmation */}
      <ConfirmDialog
        isOpen={isDeleteDialogOpen}
        onClose={() => setIsDeleteDialogOpen(false)}
        onConfirm={confirmDelete}
        title="Delete Chat"
        description={`Are you sure you want to delete "${selectedChat?.name}"? All messages will be permanently removed.`}
        confirmText="Delete Chat"
        variant="danger"
      />

      {/* Block Confirmation */}
      <ConfirmDialog
        isOpen={isBlockDialogOpen}
        onClose={() => setIsBlockDialogOpen(false)}
        onConfirm={confirmBlock}
        title={selectedChat?.status === 'blocked' ? 'Unblock Chat' : 'Block Chat'}
        description={
          selectedChat?.status === 'blocked'
            ? `Are you sure you want to unblock "${selectedChat?.name}"?`
            : `Are you sure you want to block "${selectedChat?.name}"? Participants will not be able to send messages.`
        }
        confirmText={selectedChat?.status === 'blocked' ? 'Unblock' : 'Block'}
        variant={selectedChat?.status === 'blocked' ? 'default' : 'warning'}
      />
    </div>
  );
}
