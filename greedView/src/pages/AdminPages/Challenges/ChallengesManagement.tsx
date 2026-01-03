import { useState } from 'react';
import { motion } from 'framer-motion';
import {
  Trophy,
  MoreVertical,
  Eye,
  Edit,
  Trash2,
  Clock,
  Coins,
  Target,
  Zap,
  Star,
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

interface Challenge {
  id: string;
  title: string;
  description: string;
  type: 'daily' | 'weekly' | 'monthly' | 'special';
  difficulty: 'easy' | 'medium' | 'hard' | 'expert';
  reward: number;
  xpReward: number;
  completions: number;
  maxCompletions: number;
  status: 'active' | 'inactive' | 'expired';
  startDate: string;
  endDate: string;
  requirements: string;
  image: string;
}

const mockChallenges: Challenge[] = [
  {
    id: '1',
    title: 'Code Marathon',
    description: 'Complete 10 coding exercises in a day',
    type: 'daily',
    difficulty: 'medium',
    reward: 200,
    xpReward: 500,
    completions: 1250,
    maxCompletions: 0,
    status: 'active',
    startDate: '2024-12-01',
    endDate: '2024-12-31',
    requirements: 'Complete 10 coding exercises',
    image: '',
  },
  {
    id: '2',
    title: 'Weekly Warrior',
    description: 'Win 5 competitions in a week',
    type: 'weekly',
    difficulty: 'hard',
    reward: 1000,
    xpReward: 2000,
    completions: 320,
    maxCompletions: 0,
    status: 'active',
    startDate: '2024-12-01',
    endDate: '2024-12-31',
    requirements: 'Win 5 competitions',
    image: '',
  },
  {
    id: '3',
    title: 'Master Coder',
    description: 'Achieve 100% accuracy in all quizzes for a month',
    type: 'monthly',
    difficulty: 'expert',
    reward: 5000,
    xpReward: 10000,
    completions: 45,
    maxCompletions: 100,
    status: 'active',
    startDate: '2024-12-01',
    endDate: '2024-12-31',
    requirements: '100% quiz accuracy',
    image: '',
  },
  {
    id: '4',
    title: 'Holiday Special',
    description: 'Complete the holiday themed challenges',
    type: 'special',
    difficulty: 'easy',
    reward: 500,
    xpReward: 1000,
    completions: 2500,
    maxCompletions: 5000,
    status: 'active',
    startDate: '2024-12-20',
    endDate: '2024-12-26',
    requirements: 'Complete holiday challenges',
    image: '',
  },
];

const difficultyColors = {
  easy: '#00ff88',
  medium: '#ffd700',
  hard: '#ff6b6b',
  expert: '#8b5cf6',
};

const typeColors = {
  daily: '#00d9ff',
  weekly: '#00ff88',
  monthly: '#8b5cf6',
  special: '#ffd700',
};

export function ChallengesManagement() {
  const [challenges, setChallenges] = useState<Challenge[]>(mockChallenges);
  const [searchQuery, setSearchQuery] = useState('');
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [isViewModalOpen, setIsViewModalOpen] = useState(false);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [selectedChallenge, setSelectedChallenge] = useState<Challenge | null>(null);
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 10;

  const [formData, setFormData] = useState<Partial<Challenge>>({
    title: '',
    description: '',
    type: 'daily',
    difficulty: 'easy',
    reward: 100,
    xpReward: 200,
    maxCompletions: 0,
    status: 'active',
    startDate: '',
    endDate: '',
    requirements: '',
    image: '',
  });

  const filteredChallenges = challenges.filter(
    (challenge) =>
      challenge.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      challenge.type.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const paginatedChallenges = filteredChallenges.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  const handleCreate = () => {
    setFormData({
      title: '',
      description: '',
      type: 'daily',
      difficulty: 'easy',
      reward: 100,
      xpReward: 200,
      maxCompletions: 0,
      status: 'active',
      startDate: '',
      endDate: '',
      requirements: '',
      image: '',
    });
    setIsCreateModalOpen(true);
  };

  const handleEdit = (challenge: Challenge) => {
    setSelectedChallenge(challenge);
    setFormData(challenge);
    setIsEditModalOpen(true);
  };

  const handleView = (challenge: Challenge) => {
    setSelectedChallenge(challenge);
    setIsViewModalOpen(true);
  };

  const handleDelete = (challenge: Challenge) => {
    setSelectedChallenge(challenge);
    setIsDeleteDialogOpen(true);
  };

  const confirmDelete = () => {
    if (selectedChallenge) {
      setChallenges(challenges.filter((c) => c.id !== selectedChallenge.id));
    }
    setIsDeleteDialogOpen(false);
    setSelectedChallenge(null);
  };

  const handleCreateSubmit = () => {
    const newChallenge: Challenge = {
      ...formData as Challenge,
      id: Date.now().toString(),
      completions: 0,
    };
    setChallenges([...challenges, newChallenge]);
    setIsCreateModalOpen(false);
  };

  const handleEditSubmit = () => {
    if (selectedChallenge) {
      setChallenges(challenges.map((c) => (c.id === selectedChallenge.id ? { ...c, ...formData } : c)));
    }
    setIsEditModalOpen(false);
    setSelectedChallenge(null);
  };

  const getStatusBadge = (status: Challenge['status']) => {
    const styles = {
      active: 'bg-green-500/20 text-green-400 border-green-500/30',
      inactive: 'bg-gray-500/20 text-gray-400 border-gray-500/30',
      expired: 'bg-red-500/20 text-red-400 border-red-500/30',
    };
    return (
      <Badge variant="outline" className={styles[status]}>
        {status.charAt(0).toUpperCase() + status.slice(1)}
      </Badge>
    );
  };

  const columns = [
    {
      key: 'challenge',
      header: 'Challenge',
      render: (challenge: Challenge) => (
        <div className="flex items-center gap-3">
          <div
            className="w-10 h-10 rounded-lg flex items-center justify-center"
            style={{ backgroundColor: `${typeColors[challenge.type]}20` }}
          >
            <Trophy className="w-5 h-5" style={{ color: typeColors[challenge.type] }} />
          </div>
          <div>
            <p className="text-white font-medium">{challenge.title}</p>
            <p className="text-gray-500 text-xs capitalize">{challenge.type} Challenge</p>
          </div>
        </div>
      ),
    },
    {
      key: 'difficulty',
      header: 'Difficulty',
      render: (challenge: Challenge) => (
        <Badge
          variant="outline"
          className="capitalize"
          style={{
            backgroundColor: `${difficultyColors[challenge.difficulty]}20`,
            color: difficultyColors[challenge.difficulty],
            borderColor: `${difficultyColors[challenge.difficulty]}50`,
          }}
        >
          {challenge.difficulty}
        </Badge>
      ),
    },
    {
      key: 'rewards',
      header: 'Rewards',
      render: (challenge: Challenge) => (
        <div className="space-y-1">
          <div className="flex items-center gap-1 text-[#ffd700]">
            <Coins className="w-4 h-4" />
            <span className="font-medium">{challenge.reward}</span>
          </div>
          <div className="flex items-center gap-1 text-[#00ff88] text-xs">
            <Zap className="w-3 h-3" />
            <span>{challenge.xpReward} XP</span>
          </div>
        </div>
      ),
    },
    {
      key: 'completions',
      header: 'Completions',
      render: (challenge: Challenge) => (
        <div className="text-gray-400">
          <span className="text-white font-medium">{challenge.completions.toLocaleString()}</span>
          {challenge.maxCompletions > 0 && (
            <span className="text-gray-500"> / {challenge.maxCompletions.toLocaleString()}</span>
          )}
        </div>
      ),
    },
    {
      key: 'duration',
      header: 'Duration',
      render: (challenge: Challenge) => (
        <div className="text-gray-400 text-sm">
          <div>{challenge.startDate}</div>
          <div className="text-gray-500">to {challenge.endDate}</div>
        </div>
      ),
    },
    {
      key: 'status',
      header: 'Status',
      render: (challenge: Challenge) => getStatusBadge(challenge.status),
    },
    {
      key: 'actions',
      header: 'Actions',
      render: (challenge: Challenge) => (
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" size="icon" className="text-gray-400 hover:text-white">
              <MoreVertical className="w-4 h-4" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end" className="bg-[#1a1a2e] border-[#2a2a3e]">
            <DropdownMenuItem
              onClick={() => handleView(challenge)}
              className="text-gray-300 hover:text-white hover:bg-white/10"
            >
              <Eye className="w-4 h-4 mr-2" />
              View Details
            </DropdownMenuItem>
            <DropdownMenuItem
              onClick={() => handleEdit(challenge)}
              className="text-gray-300 hover:text-white hover:bg-white/10"
            >
              <Edit className="w-4 h-4 mr-2" />
              Edit Challenge
            </DropdownMenuItem>
            <DropdownMenuSeparator className="bg-[#2a2a3e]" />
            <DropdownMenuItem
              onClick={() => handleDelete(challenge)}
              className="text-red-400 hover:bg-red-500/10"
            >
              <Trash2 className="w-4 h-4 mr-2" />
              Delete Challenge
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      ),
    },
  ];

  const ChallengeForm = () => (
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
            placeholder="Challenge title"
            className="bg-[#1a1a2e] border-[#2a2a3e] text-white"
          />
        </div>
        
        <div className="space-y-2 col-span-2">
          <Label className="text-gray-300">Description</Label>
          <Textarea
            value={formData.description}
            onChange={(e) => setFormData({ ...formData, description: e.target.value })}
            placeholder="Challenge description"
            className="bg-[#1a1a2e] border-[#2a2a3e] text-white min-h-[80px]"
          />
        </div>
        
        <div className="space-y-2">
          <Label className="text-gray-300">Type</Label>
          <Select
            value={formData.type}
            onValueChange={(value) => setFormData({ ...formData, type: value as Challenge['type'] })}
          >
            <SelectTrigger className="bg-[#1a1a2e] border-[#2a2a3e] text-white">
              <SelectValue />
            </SelectTrigger>
            <SelectContent className="bg-[#1a1a2e] border-[#2a2a3e]">
              <SelectItem value="daily">Daily</SelectItem>
              <SelectItem value="weekly">Weekly</SelectItem>
              <SelectItem value="monthly">Monthly</SelectItem>
              <SelectItem value="special">Special</SelectItem>
            </SelectContent>
          </Select>
        </div>
        
        <div className="space-y-2">
          <Label className="text-gray-300">Difficulty</Label>
          <Select
            value={formData.difficulty}
            onValueChange={(value) => setFormData({ ...formData, difficulty: value as Challenge['difficulty'] })}
          >
            <SelectTrigger className="bg-[#1a1a2e] border-[#2a2a3e] text-white">
              <SelectValue />
            </SelectTrigger>
            <SelectContent className="bg-[#1a1a2e] border-[#2a2a3e]">
              <SelectItem value="easy">Easy</SelectItem>
              <SelectItem value="medium">Medium</SelectItem>
              <SelectItem value="hard">Hard</SelectItem>
              <SelectItem value="expert">Expert</SelectItem>
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
          <Label className="text-gray-300">Start Date</Label>
          <Input
            type="date"
            value={formData.startDate}
            onChange={(e) => setFormData({ ...formData, startDate: e.target.value })}
            className="bg-[#1a1a2e] border-[#2a2a3e] text-white"
          />
        </div>
        
        <div className="space-y-2">
          <Label className="text-gray-300">End Date</Label>
          <Input
            type="date"
            value={formData.endDate}
            onChange={(e) => setFormData({ ...formData, endDate: e.target.value })}
            className="bg-[#1a1a2e] border-[#2a2a3e] text-white"
          />
        </div>
        
        <div className="space-y-2 col-span-2">
          <Label className="text-gray-300">Requirements</Label>
          <Input
            value={formData.requirements}
            onChange={(e) => setFormData({ ...formData, requirements: e.target.value })}
            placeholder="What users need to do"
            className="bg-[#1a1a2e] border-[#2a2a3e] text-white"
          />
        </div>
        
        <div className="space-y-2">
          <Label className="text-gray-300">Max Completions (0 = unlimited)</Label>
          <Input
            type="number"
            value={formData.maxCompletions}
            onChange={(e) => setFormData({ ...formData, maxCompletions: parseInt(e.target.value) })}
            className="bg-[#1a1a2e] border-[#2a2a3e] text-white"
          />
        </div>
        
        <div className="space-y-2">
          <Label className="text-gray-300">Status</Label>
          <Select
            value={formData.status}
            onValueChange={(value) => setFormData({ ...formData, status: value as Challenge['status'] })}
          >
            <SelectTrigger className="bg-[#1a1a2e] border-[#2a2a3e] text-white">
              <SelectValue />
            </SelectTrigger>
            <SelectContent className="bg-[#1a1a2e] border-[#2a2a3e]">
              <SelectItem value="active">Active</SelectItem>
              <SelectItem value="inactive">Inactive</SelectItem>
              <SelectItem value="expired">Expired</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>
    </div>
  );

  return (
    <div className="space-y-6">
      <PageHeader
        title="Challenges Management"
        description="Create and manage daily, weekly, and special challenges"
        icon={Trophy}
        showSearch
        searchValue={searchQuery}
        onSearchChange={setSearchQuery}
        searchPlaceholder="Search challenges..."
        showAddButton
        addButtonText="Create Challenge"
        onAddClick={handleCreate}
        showFilter
      />

      <DataTable
        columns={columns}
        data={paginatedChallenges}
        keyExtractor={(challenge) => challenge.id}
        emptyMessage="No challenges found"
        pagination={{
          currentPage,
          totalPages: Math.ceil(filteredChallenges.length / itemsPerPage),
          onPageChange: setCurrentPage,
          totalItems: filteredChallenges.length,
          itemsPerPage,
        }}
      />

      {/* Create Modal */}
      <FormModal
        isOpen={isCreateModalOpen}
        onClose={() => setIsCreateModalOpen(false)}
        title="Create New Challenge"
        onSubmit={handleCreateSubmit}
        submitText="Create Challenge"
        size="lg"
      >
        <ChallengeForm />
      </FormModal>

      {/* Edit Modal */}
      <FormModal
        isOpen={isEditModalOpen}
        onClose={() => setIsEditModalOpen(false)}
        title="Edit Challenge"
        onSubmit={handleEditSubmit}
        submitText="Save Changes"
        size="lg"
      >
        <ChallengeForm />
      </FormModal>

      {/* View Modal */}
      <FormModal
        isOpen={isViewModalOpen}
        onClose={() => setIsViewModalOpen(false)}
        title="Challenge Details"
        size="lg"
      >
        {selectedChallenge && (
          <div className="space-y-6">
            <div className="flex items-center gap-4">
              <div
                className="w-16 h-16 rounded-xl flex items-center justify-center"
                style={{ backgroundColor: `${typeColors[selectedChallenge.type]}20` }}
              >
                <Trophy className="w-8 h-8" style={{ color: typeColors[selectedChallenge.type] }} />
              </div>
              <div>
                <h3 className="text-xl font-bold text-white">{selectedChallenge.title}</h3>
                <div className="flex items-center gap-2 mt-1">
                  {getStatusBadge(selectedChallenge.status)}
                  <Badge
                    variant="outline"
                    className="capitalize"
                    style={{
                      backgroundColor: `${difficultyColors[selectedChallenge.difficulty]}20`,
                      color: difficultyColors[selectedChallenge.difficulty],
                      borderColor: `${difficultyColors[selectedChallenge.difficulty]}50`,
                    }}
                  >
                    {selectedChallenge.difficulty}
                  </Badge>
                </div>
              </div>
            </div>

            <p className="text-gray-400">{selectedChallenge.description}</p>

            <div className="grid grid-cols-3 gap-4">
              <div className="bg-[#ffd700]/10 border border-[#ffd700]/30 p-4 rounded-lg text-center">
                <Coins className="w-6 h-6 text-[#ffd700] mx-auto mb-2" />
                <p className="text-2xl font-bold text-[#ffd700]">{selectedChallenge.reward}</p>
                <p className="text-gray-400 text-sm">Coins</p>
              </div>
              <div className="bg-[#00ff88]/10 border border-[#00ff88]/30 p-4 rounded-lg text-center">
                <Zap className="w-6 h-6 text-[#00ff88] mx-auto mb-2" />
                <p className="text-2xl font-bold text-[#00ff88]">{selectedChallenge.xpReward}</p>
                <p className="text-gray-400 text-sm">XP</p>
              </div>
              <div className="bg-[#8b5cf6]/10 border border-[#8b5cf6]/30 p-4 rounded-lg text-center">
                <Target className="w-6 h-6 text-[#8b5cf6] mx-auto mb-2" />
                <p className="text-2xl font-bold text-[#8b5cf6]">{selectedChallenge.completions.toLocaleString()}</p>
                <p className="text-gray-400 text-sm">Completions</p>
              </div>
            </div>

            <div className="bg-[#1a1a2e] p-4 rounded-lg">
              <h4 className="text-gray-400 text-sm mb-2">Requirements</h4>
              <p className="text-white">{selectedChallenge.requirements}</p>
            </div>

            <div className="bg-[#1a1a2e] p-4 rounded-lg">
              <h4 className="text-gray-400 text-sm mb-2">Duration</h4>
              <p className="text-white">{selectedChallenge.startDate} → {selectedChallenge.endDate}</p>
            </div>
          </div>
        )}
      </FormModal>

      {/* Delete Confirmation */}
      <ConfirmDialog
        isOpen={isDeleteDialogOpen}
        onClose={() => setIsDeleteDialogOpen(false)}
        onConfirm={confirmDelete}
        title="Delete Challenge"
        description={`Are you sure you want to delete "${selectedChallenge?.title}"? This action cannot be undone.`}
        confirmText="Delete Challenge"
        variant="danger"
      />
    </div>
  );
}
