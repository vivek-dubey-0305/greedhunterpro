import { useState } from 'react';
import { motion } from 'framer-motion';
import {
  Users,
  MoreVertical,
  Eye,
  Edit,
  Trash2,
  Ban,
  Crown,
  Shield,
  Check,
  X,
  Mail,
  Calendar,
  Coins,
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
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { ImageUpload } from '../components/ImageUpload';

interface User {
  id: string;
  username: string;
  email: string;
  fullName: string;
  avatar: string;
  level: number;
  points: number;
  status: 'active' | 'banned' | 'restricted';
  role: 'user' | 'moderator' | 'admin';
  joinedAt: string;
  lastActive: string;
  totalCoins: number;
  eventsJoined: number;
  challengesCompleted: number;
}

// Mock data
const mockUsers: User[] = [
  {
    id: '1',
    username: 'john_doe',
    email: 'john@example.com',
    fullName: 'John Doe',
    avatar: '',
    level: 15,
    points: 15420,
    status: 'active',
    role: 'user',
    joinedAt: '2024-01-15',
    lastActive: '2024-12-13',
    totalCoins: 2500,
    eventsJoined: 12,
    challengesCompleted: 45,
  },
  {
    id: '2',
    username: 'sarah_smith',
    email: 'sarah@example.com',
    fullName: 'Sarah Smith',
    avatar: '',
    level: 22,
    points: 28750,
    status: 'active',
    role: 'moderator',
    joinedAt: '2023-06-20',
    lastActive: '2024-12-12',
    totalCoins: 5800,
    eventsJoined: 25,
    challengesCompleted: 89,
  },
  {
    id: '3',
    username: 'mike_banned',
    email: 'mike@example.com',
    fullName: 'Mike Johnson',
    avatar: '',
    level: 8,
    points: 4200,
    status: 'banned',
    role: 'user',
    joinedAt: '2024-03-10',
    lastActive: '2024-11-05',
    totalCoins: 350,
    eventsJoined: 3,
    challengesCompleted: 12,
  },
  {
    id: '4',
    username: 'emily_pro',
    email: 'emily@example.com',
    fullName: 'Emily Davis',
    avatar: '',
    level: 30,
    points: 45000,
    status: 'active',
    role: 'admin',
    joinedAt: '2023-01-05',
    lastActive: '2024-12-13',
    totalCoins: 12000,
    eventsJoined: 50,
    challengesCompleted: 150,
  },
  {
    id: '5',
    username: 'restricted_user',
    email: 'restricted@example.com',
    fullName: 'Alex Turner',
    avatar: '',
    level: 5,
    points: 1800,
    status: 'restricted',
    role: 'user',
    joinedAt: '2024-08-15',
    lastActive: '2024-12-10',
    totalCoins: 200,
    eventsJoined: 2,
    challengesCompleted: 5,
  },
];

export function UsersManagement() {
  const [users, setUsers] = useState<User[]>(mockUsers);
  const [searchQuery, setSearchQuery] = useState('');
  const [isViewModalOpen, setIsViewModalOpen] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [isBanDialogOpen, setIsBanDialogOpen] = useState(false);
  const [isPromoteModalOpen, setIsPromoteModalOpen] = useState(false);
  const [selectedUser, setSelectedUser] = useState<User | null>(null);
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 10;

  const filteredUsers = users.filter(
    (user) =>
      user.username.toLowerCase().includes(searchQuery.toLowerCase()) ||
      user.email.toLowerCase().includes(searchQuery.toLowerCase()) ||
      user.fullName.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const paginatedUsers = filteredUsers.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  const handleView = (user: User) => {
    setSelectedUser(user);
    setIsViewModalOpen(true);
  };

  const handleEdit = (user: User) => {
    setSelectedUser(user);
    setIsEditModalOpen(true);
  };

  const handleDelete = (user: User) => {
    setSelectedUser(user);
    setIsDeleteDialogOpen(true);
  };

  const handleBan = (user: User) => {
    setSelectedUser(user);
    setIsBanDialogOpen(true);
  };

  const handlePromote = (user: User) => {
    setSelectedUser(user);
    setIsPromoteModalOpen(true);
  };

  const confirmDelete = () => {
    if (selectedUser) {
      setUsers(users.filter((u) => u.id !== selectedUser.id));
    }
    setIsDeleteDialogOpen(false);
    setSelectedUser(null);
  };

  const confirmBan = () => {
    if (selectedUser) {
      setUsers(
        users.map((u) =>
          u.id === selectedUser.id
            ? { ...u, status: u.status === 'banned' ? 'active' : 'banned' }
            : u
        )
      );
    }
    setIsBanDialogOpen(false);
    setSelectedUser(null);
  };

  const getStatusBadge = (status: User['status']) => {
    const styles = {
      active: 'bg-green-500/20 text-green-400 border-green-500/30',
      banned: 'bg-red-500/20 text-red-400 border-red-500/30',
      restricted: 'bg-yellow-500/20 text-yellow-400 border-yellow-500/30',
    };
    return (
      <Badge variant="outline" className={styles[status]}>
        {status.charAt(0).toUpperCase() + status.slice(1)}
      </Badge>
    );
  };

  const getRoleBadge = (role: User['role']) => {
    const styles = {
      user: 'bg-gray-500/20 text-gray-400 border-gray-500/30',
      moderator: 'bg-blue-500/20 text-blue-400 border-blue-500/30',
      admin: 'bg-purple-500/20 text-purple-400 border-purple-500/30',
    };
    const icons = {
      user: null,
      moderator: <Shield className="w-3 h-3 mr-1" />,
      admin: <Crown className="w-3 h-3 mr-1" />,
    };
    return (
      <Badge variant="outline" className={`${styles[role]} flex items-center`}>
        {icons[role]}
        {role.charAt(0).toUpperCase() + role.slice(1)}
      </Badge>
    );
  };

  const columns = [
    {
      key: 'user',
      header: 'User',
      render: (user: User) => (
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-full bg-gradient-to-br from-[#8b5cf6] to-[#00ff88] flex items-center justify-center text-white font-bold">
            {user.fullName.charAt(0)}
          </div>
          <div>
            <p className="text-white font-medium">{user.fullName}</p>
            <p className="text-gray-500 text-xs">@{user.username}</p>
          </div>
        </div>
      ),
    },
    {
      key: 'email',
      header: 'Email',
      render: (user: User) => (
        <span className="text-gray-400">{user.email}</span>
      ),
    },
    {
      key: 'level',
      header: 'Level',
      render: (user: User) => (
        <div className="flex items-center gap-2">
          <span className="text-[#ffd700] font-bold">Lvl {user.level}</span>
          <span className="text-gray-500 text-xs">({user.points.toLocaleString()} pts)</span>
        </div>
      ),
    },
    {
      key: 'status',
      header: 'Status',
      render: (user: User) => getStatusBadge(user.status),
    },
    {
      key: 'role',
      header: 'Role',
      render: (user: User) => getRoleBadge(user.role),
    },
    {
      key: 'lastActive',
      header: 'Last Active',
      render: (user: User) => (
        <span className="text-gray-400 text-sm">{user.lastActive}</span>
      ),
    },
    {
      key: 'actions',
      header: 'Actions',
      render: (user: User) => (
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" size="icon" className="text-gray-400 hover:text-white">
              <MoreVertical className="w-4 h-4" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end" className="bg-[#1a1a2e] border-[#2a2a3e]">
            <DropdownMenuItem
              onClick={() => handleView(user)}
              className="text-gray-300 hover:text-white hover:bg-white/10"
            >
              <Eye className="w-4 h-4 mr-2" />
              View Details
            </DropdownMenuItem>
            <DropdownMenuItem
              onClick={() => handleEdit(user)}
              className="text-gray-300 hover:text-white hover:bg-white/10"
            >
              <Edit className="w-4 h-4 mr-2" />
              Edit User
            </DropdownMenuItem>
            <DropdownMenuItem
              onClick={() => handlePromote(user)}
              className="text-gray-300 hover:text-white hover:bg-white/10"
            >
              <Crown className="w-4 h-4 mr-2" />
              Change Role/Level
            </DropdownMenuItem>
            <DropdownMenuSeparator className="bg-[#2a2a3e]" />
            <DropdownMenuItem
              onClick={() => handleBan(user)}
              className={user.status === 'banned' ? 'text-green-400 hover:bg-green-500/10' : 'text-yellow-400 hover:bg-yellow-500/10'}
            >
              {user.status === 'banned' ? (
                <>
                  <Check className="w-4 h-4 mr-2" />
                  Unban User
                </>
              ) : (
                <>
                  <Ban className="w-4 h-4 mr-2" />
                  Ban User
                </>
              )}
            </DropdownMenuItem>
            <DropdownMenuItem
              onClick={() => handleDelete(user)}
              className="text-red-400 hover:bg-red-500/10"
            >
              <Trash2 className="w-4 h-4 mr-2" />
              Delete User
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      ),
    },
  ];

  return (
    <div className="space-y-6">
      <PageHeader
        title="User Management"
        description="Manage all users, their roles, and permissions"
        icon={Users}
        showSearch
        searchValue={searchQuery}
        onSearchChange={setSearchQuery}
        searchPlaceholder="Search users..."
        showFilter
      />

      <DataTable
        columns={columns}
        data={paginatedUsers}
        keyExtractor={(user) => user.id}
        emptyMessage="No users found"
        pagination={{
          currentPage,
          totalPages: Math.ceil(filteredUsers.length / itemsPerPage),
          onPageChange: setCurrentPage,
          totalItems: filteredUsers.length,
          itemsPerPage,
        }}
      />

      {/* View User Modal */}
      <FormModal
        isOpen={isViewModalOpen}
        onClose={() => setIsViewModalOpen(false)}
        title="User Details"
        size="lg"
      >
        {selectedUser && (
          <div className="space-y-6">
            <div className="flex items-center gap-4">
              <div className="w-20 h-20 rounded-full bg-gradient-to-br from-[#8b5cf6] to-[#00ff88] flex items-center justify-center text-white font-bold text-2xl">
                {selectedUser.fullName.charAt(0)}
              </div>
              <div>
                <h3 className="text-xl font-bold text-white">{selectedUser.fullName}</h3>
                <p className="text-gray-400">@{selectedUser.username}</p>
                <div className="flex items-center gap-2 mt-2">
                  {getStatusBadge(selectedUser.status)}
                  {getRoleBadge(selectedUser.role)}
                </div>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="bg-[#1a1a2e] p-4 rounded-lg">
                <div className="flex items-center gap-2 text-gray-400 mb-1">
                  <Mail className="w-4 h-4" />
                  <span className="text-sm">Email</span>
                </div>
                <p className="text-white">{selectedUser.email}</p>
              </div>
              <div className="bg-[#1a1a2e] p-4 rounded-lg">
                <div className="flex items-center gap-2 text-gray-400 mb-1">
                  <Calendar className="w-4 h-4" />
                  <span className="text-sm">Joined</span>
                </div>
                <p className="text-white">{selectedUser.joinedAt}</p>
              </div>
              <div className="bg-[#1a1a2e] p-4 rounded-lg">
                <div className="flex items-center gap-2 text-gray-400 mb-1">
                  <Crown className="w-4 h-4" />
                  <span className="text-sm">Level & Points</span>
                </div>
                <p className="text-white">
                  Level {selectedUser.level} ({selectedUser.points.toLocaleString()} pts)
                </p>
              </div>
              <div className="bg-[#1a1a2e] p-4 rounded-lg">
                <div className="flex items-center gap-2 text-gray-400 mb-1">
                  <Coins className="w-4 h-4" />
                  <span className="text-sm">Total Coins</span>
                </div>
                <p className="text-white">{selectedUser.totalCoins.toLocaleString()}</p>
              </div>
            </div>

            <div className="grid grid-cols-3 gap-4">
              <div className="bg-[#8b5cf6]/10 border border-[#8b5cf6]/30 p-4 rounded-lg text-center">
                <p className="text-2xl font-bold text-[#8b5cf6]">{selectedUser.eventsJoined}</p>
                <p className="text-gray-400 text-sm">Events Joined</p>
              </div>
              <div className="bg-[#00ff88]/10 border border-[#00ff88]/30 p-4 rounded-lg text-center">
                <p className="text-2xl font-bold text-[#00ff88]">{selectedUser.challengesCompleted}</p>
                <p className="text-gray-400 text-sm">Challenges</p>
              </div>
              <div className="bg-[#ffd700]/10 border border-[#ffd700]/30 p-4 rounded-lg text-center">
                <p className="text-2xl font-bold text-[#ffd700]">{selectedUser.level}</p>
                <p className="text-gray-400 text-sm">Current Level</p>
              </div>
            </div>
          </div>
        )}
      </FormModal>

      {/* Edit User Modal */}
      <FormModal
        isOpen={isEditModalOpen}
        onClose={() => setIsEditModalOpen(false)}
        title="Edit User"
        onSubmit={() => setIsEditModalOpen(false)}
        submitText="Save Changes"
        size="lg"
      >
        {selectedUser && (
          <div className="space-y-4">
            <div className="flex justify-center mb-4">
              <ImageUpload
                value={selectedUser.avatar}
                onChange={() => {}}
                aspectRatio="square"
                className="w-32"
              />
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label className="text-gray-300">Full Name</Label>
                <Input
                  defaultValue={selectedUser.fullName}
                  className="bg-[#1a1a2e] border-[#2a2a3e] text-white"
                />
              </div>
              <div className="space-y-2">
                <Label className="text-gray-300">Username</Label>
                <Input
                  defaultValue={selectedUser.username}
                  className="bg-[#1a1a2e] border-[#2a2a3e] text-white"
                />
              </div>
              <div className="space-y-2 col-span-2">
                <Label className="text-gray-300">Email</Label>
                <Input
                  defaultValue={selectedUser.email}
                  type="email"
                  className="bg-[#1a1a2e] border-[#2a2a3e] text-white"
                />
              </div>
              <div className="space-y-2">
                <Label className="text-gray-300">Status</Label>
                <Select defaultValue={selectedUser.status}>
                  <SelectTrigger className="bg-[#1a1a2e] border-[#2a2a3e] text-white">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent className="bg-[#1a1a2e] border-[#2a2a3e]">
                    <SelectItem value="active">Active</SelectItem>
                    <SelectItem value="restricted">Restricted</SelectItem>
                    <SelectItem value="banned">Banned</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <Label className="text-gray-300">Role</Label>
                <Select defaultValue={selectedUser.role}>
                  <SelectTrigger className="bg-[#1a1a2e] border-[#2a2a3e] text-white">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent className="bg-[#1a1a2e] border-[#2a2a3e]">
                    <SelectItem value="user">User</SelectItem>
                    <SelectItem value="moderator">Moderator</SelectItem>
                    <SelectItem value="admin">Admin</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
          </div>
        )}
      </FormModal>

      {/* Promote User Modal */}
      <FormModal
        isOpen={isPromoteModalOpen}
        onClose={() => setIsPromoteModalOpen(false)}
        title="Change User Role & Level"
        onSubmit={() => setIsPromoteModalOpen(false)}
        submitText="Update"
        size="md"
      >
        {selectedUser && (
          <div className="space-y-4">
            <div className="bg-[#1a1a2e] p-4 rounded-lg">
              <p className="text-white font-medium">{selectedUser.fullName}</p>
              <p className="text-gray-400 text-sm">@{selectedUser.username}</p>
            </div>
            <div className="space-y-2">
              <Label className="text-gray-300">Role</Label>
              <Select defaultValue={selectedUser.role}>
                <SelectTrigger className="bg-[#1a1a2e] border-[#2a2a3e] text-white">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent className="bg-[#1a1a2e] border-[#2a2a3e]">
                  <SelectItem value="user">User</SelectItem>
                  <SelectItem value="moderator">Moderator</SelectItem>
                  <SelectItem value="admin">Admin</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <Label className="text-gray-300">Level</Label>
              <Input
                type="number"
                defaultValue={selectedUser.level}
                min={1}
                max={100}
                className="bg-[#1a1a2e] border-[#2a2a3e] text-white"
              />
            </div>
            <div className="space-y-2">
              <Label className="text-gray-300">Add Bonus Points</Label>
              <Input
                type="number"
                placeholder="0"
                className="bg-[#1a1a2e] border-[#2a2a3e] text-white"
              />
            </div>
          </div>
        )}
      </FormModal>

      {/* Delete Confirmation */}
      <ConfirmDialog
        isOpen={isDeleteDialogOpen}
        onClose={() => setIsDeleteDialogOpen(false)}
        onConfirm={confirmDelete}
        title="Delete User"
        description={`Are you sure you want to delete "${selectedUser?.fullName}"? This action cannot be undone and all user data will be permanently removed.`}
        confirmText="Delete User"
        variant="danger"
      />

      {/* Ban Confirmation */}
      <ConfirmDialog
        isOpen={isBanDialogOpen}
        onClose={() => setIsBanDialogOpen(false)}
        onConfirm={confirmBan}
        title={selectedUser?.status === 'banned' ? 'Unban User' : 'Ban User'}
        description={
          selectedUser?.status === 'banned'
            ? `Are you sure you want to unban "${selectedUser?.fullName}"? They will regain access to the platform.`
            : `Are you sure you want to ban "${selectedUser?.fullName}"? They will lose access to the platform.`
        }
        confirmText={selectedUser?.status === 'banned' ? 'Unban User' : 'Ban User'}
        variant={selectedUser?.status === 'banned' ? 'default' : 'warning'}
      />
    </div>
  );
}
