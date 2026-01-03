import { useState } from 'react';
import { motion } from 'framer-motion';
import {
  Target,
  MoreVertical,
  Eye,
  Edit,
  Trash2,
  Clock,
  Coins,
  Zap,
  CheckCircle,
  RefreshCw,
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
import { PageHeader, DataTable, ConfirmDialog, FormModal, ImageUpload } from '../components';
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
import { Switch } from '@/components/ui/switch';

interface DailyMission {
  id: string;
  title: string;
  description: string;
  category: 'coding' | 'learning' | 'social' | 'engagement' | 'streak';
  reward: number;
  xpReward: number;
  completionsToday: number;
  totalCompletions: number;
  status: 'active' | 'inactive';
  resetTime: string;
  isRecurring: boolean;
  targetValue: number;
  currentProgress: string;
  image: string;
}

const mockMissions: DailyMission[] = [
  {
    id: '1',
    title: 'Daily Login',
    description: 'Log in to the platform',
    category: 'engagement',
    reward: 10,
    xpReward: 25,
    completionsToday: 5420,
    totalCompletions: 125000,
    status: 'active',
    resetTime: '00:00',
    isRecurring: true,
    targetValue: 1,
    currentProgress: 'Login once',
    image: '',
  },
  {
    id: '2',
    title: 'Code Streak',
    description: 'Submit at least one code solution',
    category: 'coding',
    reward: 25,
    xpReward: 50,
    completionsToday: 2150,
    totalCompletions: 89000,
    status: 'active',
    resetTime: '00:00',
    isRecurring: true,
    targetValue: 1,
    currentProgress: 'Submit 1 solution',
    image: '',
  },
  {
    id: '3',
    title: 'Learn Something New',
    description: 'Complete a tutorial or course lesson',
    category: 'learning',
    reward: 30,
    xpReward: 75,
    completionsToday: 1820,
    totalCompletions: 67000,
    status: 'active',
    resetTime: '00:00',
    isRecurring: true,
    targetValue: 1,
    currentProgress: 'Complete 1 lesson',
    image: '',
  },
  {
    id: '4',
    title: 'Social Butterfly',
    description: 'Send 5 messages in community chat',
    category: 'social',
    reward: 15,
    xpReward: 30,
    completionsToday: 980,
    totalCompletions: 45000,
    status: 'active',
    resetTime: '00:00',
    isRecurring: true,
    targetValue: 5,
    currentProgress: 'Send 5 messages',
    image: '',
  },
  {
    id: '5',
    title: '7-Day Streak',
    description: 'Maintain a 7-day login streak',
    category: 'streak',
    reward: 100,
    xpReward: 250,
    completionsToday: 320,
    totalCompletions: 12000,
    status: 'active',
    resetTime: '00:00',
    isRecurring: true,
    targetValue: 7,
    currentProgress: 'Login 7 consecutive days',
    image: '',
  },
];

const categoryColors = {
  coding: '#00ff88',
  learning: '#8b5cf6',
  social: '#00d9ff',
  engagement: '#ffd700',
  streak: '#ff6b6b',
};

export function DailyMissionsManagement() {
  const [missions, setMissions] = useState<DailyMission[]>(mockMissions);
  const [searchQuery, setSearchQuery] = useState('');
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [isViewModalOpen, setIsViewModalOpen] = useState(false);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [selectedMission, setSelectedMission] = useState<DailyMission | null>(null);
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 10;

  const [formData, setFormData] = useState<Partial<DailyMission>>({
    title: '',
    description: '',
    category: 'engagement',
    reward: 10,
    xpReward: 25,
    status: 'active',
    resetTime: '00:00',
    isRecurring: true,
    targetValue: 1,
    currentProgress: '',
    image: '',
  });

  const filteredMissions = missions.filter(
    (mission) =>
      mission.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      mission.category.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const paginatedMissions = filteredMissions.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  const handleCreate = () => {
    setFormData({
      title: '',
      description: '',
      category: 'engagement',
      reward: 10,
      xpReward: 25,
      status: 'active',
      resetTime: '00:00',
      isRecurring: true,
      targetValue: 1,
      currentProgress: '',
      image: '',
    });
    setIsCreateModalOpen(true);
  };

  const handleEdit = (mission: DailyMission) => {
    setSelectedMission(mission);
    setFormData(mission);
    setIsEditModalOpen(true);
  };

  const handleView = (mission: DailyMission) => {
    setSelectedMission(mission);
    setIsViewModalOpen(true);
  };

  const handleDelete = (mission: DailyMission) => {
    setSelectedMission(mission);
    setIsDeleteDialogOpen(true);
  };

  const confirmDelete = () => {
    if (selectedMission) {
      setMissions(missions.filter((m) => m.id !== selectedMission.id));
    }
    setIsDeleteDialogOpen(false);
    setSelectedMission(null);
  };

  const handleCreateSubmit = () => {
    const newMission: DailyMission = {
      ...formData as DailyMission,
      id: Date.now().toString(),
      completionsToday: 0,
      totalCompletions: 0,
    };
    setMissions([...missions, newMission]);
    setIsCreateModalOpen(false);
  };

  const handleEditSubmit = () => {
    if (selectedMission) {
      setMissions(missions.map((m) => (m.id === selectedMission.id ? { ...m, ...formData } : m)));
    }
    setIsEditModalOpen(false);
    setSelectedMission(null);
  };

  const columns = [
    {
      key: 'mission',
      header: 'Mission',
      render: (mission: DailyMission) => (
        <div className="flex items-center gap-3">
          <div
            className="w-10 h-10 rounded-lg flex items-center justify-center"
            style={{ backgroundColor: `${categoryColors[mission.category]}20` }}
          >
            <Target className="w-5 h-5" style={{ color: categoryColors[mission.category] }} />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <p className="text-white font-medium">{mission.title}</p>
              {mission.isRecurring && (
                <RefreshCw className="w-3 h-3 text-gray-500" />
              )}
            </div>
            <p className="text-gray-500 text-xs capitalize">{mission.category}</p>
          </div>
        </div>
      ),
    },
    {
      key: 'progress',
      header: 'Target',
      render: (mission: DailyMission) => (
        <span className="text-gray-400 text-sm">{mission.currentProgress}</span>
      ),
    },
    {
      key: 'rewards',
      header: 'Rewards',
      render: (mission: DailyMission) => (
        <div className="space-y-1">
          <div className="flex items-center gap-1 text-[#ffd700]">
            <Coins className="w-4 h-4" />
            <span className="font-medium">{mission.reward}</span>
          </div>
          <div className="flex items-center gap-1 text-[#00ff88] text-xs">
            <Zap className="w-3 h-3" />
            <span>{mission.xpReward} XP</span>
          </div>
        </div>
      ),
    },
    {
      key: 'completionsToday',
      header: 'Today',
      render: (mission: DailyMission) => (
        <span className="text-white font-medium">{mission.completionsToday.toLocaleString()}</span>
      ),
    },
    {
      key: 'totalCompletions',
      header: 'Total',
      render: (mission: DailyMission) => (
        <span className="text-gray-400">{mission.totalCompletions.toLocaleString()}</span>
      ),
    },
    {
      key: 'status',
      header: 'Status',
      render: (mission: DailyMission) => (
        <Badge
          variant="outline"
          className={mission.status === 'active' 
            ? 'bg-green-500/20 text-green-400 border-green-500/30'
            : 'bg-gray-500/20 text-gray-400 border-gray-500/30'
          }
        >
          {mission.status.charAt(0).toUpperCase() + mission.status.slice(1)}
        </Badge>
      ),
    },
    {
      key: 'actions',
      header: 'Actions',
      render: (mission: DailyMission) => (
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" size="icon" className="text-gray-400 hover:text-white">
              <MoreVertical className="w-4 h-4" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end" className="bg-[#1a1a2e] border-[#2a2a3e]">
            <DropdownMenuItem
              onClick={() => handleView(mission)}
              className="text-gray-300 hover:text-white hover:bg-white/10"
            >
              <Eye className="w-4 h-4 mr-2" />
              View Details
            </DropdownMenuItem>
            <DropdownMenuItem
              onClick={() => handleEdit(mission)}
              className="text-gray-300 hover:text-white hover:bg-white/10"
            >
              <Edit className="w-4 h-4 mr-2" />
              Edit Mission
            </DropdownMenuItem>
            <DropdownMenuSeparator className="bg-[#2a2a3e]" />
            <DropdownMenuItem
              onClick={() => handleDelete(mission)}
              className="text-red-400 hover:bg-red-500/10"
            >
              <Trash2 className="w-4 h-4 mr-2" />
              Delete Mission
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      ),
    },
  ];

  const MissionForm = () => (
    <div className="space-y-4">
      <ImageUpload
        value={formData.image}
        onChange={(value) => setFormData({ ...formData, image: value })}
        aspectRatio="video"
      />
      
      <div className="grid grid-cols-2 gap-4">
        <div className="space-y-2 col-span-2">
          <Label className="text-gray-300">Title</Label>
          <Input
            value={formData.title}
            onChange={(e) => setFormData({ ...formData, title: e.target.value })}
            placeholder="Mission title"
            className="bg-[#1a1a2e] border-[#2a2a3e] text-white"
          />
        </div>
        
        <div className="space-y-2 col-span-2">
          <Label className="text-gray-300">Description</Label>
          <Textarea
            value={formData.description}
            onChange={(e) => setFormData({ ...formData, description: e.target.value })}
            placeholder="Mission description"
            className="bg-[#1a1a2e] border-[#2a2a3e] text-white min-h-[80px]"
          />
        </div>
        
        <div className="space-y-2">
          <Label className="text-gray-300">Category</Label>
          <Select
            value={formData.category}
            onValueChange={(value) => setFormData({ ...formData, category: value as DailyMission['category'] })}
          >
            <SelectTrigger className="bg-[#1a1a2e] border-[#2a2a3e] text-white">
              <SelectValue />
            </SelectTrigger>
            <SelectContent className="bg-[#1a1a2e] border-[#2a2a3e]">
              <SelectItem value="coding">Coding</SelectItem>
              <SelectItem value="learning">Learning</SelectItem>
              <SelectItem value="social">Social</SelectItem>
              <SelectItem value="engagement">Engagement</SelectItem>
              <SelectItem value="streak">Streak</SelectItem>
            </SelectContent>
          </Select>
        </div>
        
        <div className="space-y-2">
          <Label className="text-gray-300">Status</Label>
          <Select
            value={formData.status}
            onValueChange={(value) => setFormData({ ...formData, status: value as DailyMission['status'] })}
          >
            <SelectTrigger className="bg-[#1a1a2e] border-[#2a2a3e] text-white">
              <SelectValue />
            </SelectTrigger>
            <SelectContent className="bg-[#1a1a2e] border-[#2a2a3e]">
              <SelectItem value="active">Active</SelectItem>
              <SelectItem value="inactive">Inactive</SelectItem>
            </SelectContent>
          </Select>
        </div>
        
        <div className="space-y-2">
          <Label className="text-gray-300">Coin Reward</Label>
          <Input
            type="number"
            value={formData.reward}
            onChange={(e) => setFormData({ ...formData, reward: parseInt(e.target.value) })}
            className="bg-[#1a1a2e] border-[#2a2a3e] text-white"
          />
        </div>
        
        <div className="space-y-2">
          <Label className="text-gray-300">XP Reward</Label>
          <Input
            type="number"
            value={formData.xpReward}
            onChange={(e) => setFormData({ ...formData, xpReward: parseInt(e.target.value) })}
            className="bg-[#1a1a2e] border-[#2a2a3e] text-white"
          />
        </div>
        
        <div className="space-y-2">
          <Label className="text-gray-300">Target Value</Label>
          <Input
            type="number"
            value={formData.targetValue}
            onChange={(e) => setFormData({ ...formData, targetValue: parseInt(e.target.value) })}
            className="bg-[#1a1a2e] border-[#2a2a3e] text-white"
          />
        </div>
        
        <div className="space-y-2">
          <Label className="text-gray-300">Reset Time</Label>
          <Input
            type="time"
            value={formData.resetTime}
            onChange={(e) => setFormData({ ...formData, resetTime: e.target.value })}
            className="bg-[#1a1a2e] border-[#2a2a3e] text-white"
          />
        </div>
        
        <div className="space-y-2 col-span-2">
          <Label className="text-gray-300">Progress Text</Label>
          <Input
            value={formData.currentProgress}
            onChange={(e) => setFormData({ ...formData, currentProgress: e.target.value })}
            placeholder="e.g., Complete 3 quizzes"
            className="bg-[#1a1a2e] border-[#2a2a3e] text-white"
          />
        </div>
        
        <div className="flex items-center justify-between p-4 bg-[#1a1a2e] rounded-lg col-span-2">
          <div>
            <Label className="text-gray-300">Recurring Mission</Label>
            <p className="text-gray-500 text-xs">Resets daily at the specified time</p>
          </div>
          <Switch
            checked={formData.isRecurring}
            onCheckedChange={(checked) => setFormData({ ...formData, isRecurring: checked })}
          />
        </div>
      </div>
    </div>
  );

  return (
    <div className="space-y-6">
      <PageHeader
        title="Daily Missions"
        description="Manage recurring daily missions and tasks"
        icon={Target}
        showSearch
        searchValue={searchQuery}
        onSearchChange={setSearchQuery}
        searchPlaceholder="Search missions..."
        showAddButton
        addButtonText="Create Mission"
        onAddClick={handleCreate}
        showFilter
      />

      <DataTable
        columns={columns}
        data={paginatedMissions}
        keyExtractor={(mission) => mission.id}
        emptyMessage="No missions found"
        pagination={{
          currentPage,
          totalPages: Math.ceil(filteredMissions.length / itemsPerPage),
          onPageChange: setCurrentPage,
          totalItems: filteredMissions.length,
          itemsPerPage,
        }}
      />

      {/* Create Modal */}
      <FormModal
        isOpen={isCreateModalOpen}
        onClose={() => setIsCreateModalOpen(false)}
        title="Create New Daily Mission"
        onSubmit={handleCreateSubmit}
        submitText="Create Mission"
        size="lg"
      >
        <MissionForm />
      </FormModal>

      {/* Edit Modal */}
      <FormModal
        isOpen={isEditModalOpen}
        onClose={() => setIsEditModalOpen(false)}
        title="Edit Daily Mission"
        onSubmit={handleEditSubmit}
        submitText="Save Changes"
        size="lg"
      >
        <MissionForm />
      </FormModal>

      {/* View Modal */}
      <FormModal
        isOpen={isViewModalOpen}
        onClose={() => setIsViewModalOpen(false)}
        title="Mission Details"
        size="md"
      >
        {selectedMission && (
          <div className="space-y-6">
            <div className="flex items-center gap-4">
              <div
                className="w-16 h-16 rounded-xl flex items-center justify-center"
                style={{ backgroundColor: `${categoryColors[selectedMission.category]}20` }}
              >
                <Target className="w-8 h-8" style={{ color: categoryColors[selectedMission.category] }} />
              </div>
              <div>
                <h3 className="text-xl font-bold text-white">{selectedMission.title}</h3>
                <p className="text-gray-400 capitalize">{selectedMission.category} Mission</p>
              </div>
            </div>

            <p className="text-gray-400">{selectedMission.description}</p>

            <div className="grid grid-cols-2 gap-4">
              <div className="bg-[#ffd700]/10 border border-[#ffd700]/30 p-4 rounded-lg text-center">
                <Coins className="w-6 h-6 text-[#ffd700] mx-auto mb-2" />
                <p className="text-2xl font-bold text-[#ffd700]">{selectedMission.reward}</p>
                <p className="text-gray-400 text-sm">Coins</p>
              </div>
              <div className="bg-[#00ff88]/10 border border-[#00ff88]/30 p-4 rounded-lg text-center">
                <Zap className="w-6 h-6 text-[#00ff88] mx-auto mb-2" />
                <p className="text-2xl font-bold text-[#00ff88]">{selectedMission.xpReward}</p>
                <p className="text-gray-400 text-sm">XP</p>
              </div>
            </div>

            <div className="bg-[#1a1a2e] p-4 rounded-lg">
              <h4 className="text-gray-400 text-sm mb-2">Statistics</h4>
              <div className="flex justify-between">
                <div>
                  <p className="text-white font-bold">{selectedMission.completionsToday.toLocaleString()}</p>
                  <p className="text-gray-500 text-xs">Today</p>
                </div>
                <div className="text-right">
                  <p className="text-white font-bold">{selectedMission.totalCompletions.toLocaleString()}</p>
                  <p className="text-gray-500 text-xs">All Time</p>
                </div>
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
        title="Delete Daily Mission"
        description={`Are you sure you want to delete "${selectedMission?.title}"? This action cannot be undone.`}
        confirmText="Delete Mission"
        variant="danger"
      />
    </div>
  );
}
