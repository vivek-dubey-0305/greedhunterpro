import { useState } from 'react';
import { motion } from 'framer-motion';
import {
  Users,
  MoreVertical,
  Eye,
  Edit,
  Trash2,
  MessageSquare,
  Lock,
  Globe,
  Shield,
  Crown,
  Ban,
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

interface Community {
  id: string;
  name: string;
  description: string;
  category: 'programming' | 'gaming' | 'design' | 'general' | 'tech' | 'learning';
  visibility: 'public' | 'private' | 'invite-only';
  members: number;
  posts: number;
  createdAt: string;
  owner: string;
  status: 'active' | 'suspended' | 'archived';
  image: string;
  rules: string[];
}

const mockCommunities: Community[] = [
  {
    id: '1',
    name: 'JavaScript Masters',
    description: 'A community for JavaScript enthusiasts to share knowledge and projects',
    category: 'programming',
    visibility: 'public',
    members: 15420,
    posts: 8750,
    createdAt: '2023-06-15',
    owner: 'john_doe',
    status: 'active',
    image: '',
    rules: ['Be respectful', 'No spam', 'Stay on topic'],
  },
  {
    id: '2',
    name: 'UI/UX Designers Hub',
    description: 'Share your designs, get feedback, and learn from others',
    category: 'design',
    visibility: 'public',
    members: 8920,
    posts: 4520,
    createdAt: '2023-08-20',
    owner: 'sarah_design',
    status: 'active',
    image: '',
    rules: ['Credit original work', 'Constructive feedback only'],
  },
  {
    id: '3',
    name: 'Private Coding Club',
    description: 'Exclusive community for advanced developers',
    category: 'programming',
    visibility: 'invite-only',
    members: 250,
    posts: 1200,
    createdAt: '2024-01-10',
    owner: 'elite_coder',
    status: 'active',
    image: '',
    rules: ['NDA applies', 'No screenshots'],
  },
  {
    id: '4',
    name: 'Suspended Community',
    description: 'This community violated terms of service',
    category: 'general',
    visibility: 'public',
    members: 500,
    posts: 120,
    createdAt: '2024-05-01',
    owner: 'bad_actor',
    status: 'suspended',
    image: '',
    rules: [],
  },
];

const categoryColors = {
  programming: '#00ff88',
  gaming: '#8b5cf6',
  design: '#ff6b6b',
  general: '#ffd700',
  tech: '#00d9ff',
  learning: '#ff8c00',
};

export function CommunitiesManagement() {
  const [communities, setCommunities] = useState<Community[]>(mockCommunities);
  const [searchQuery, setSearchQuery] = useState('');
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [isViewModalOpen, setIsViewModalOpen] = useState(false);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [isSuspendDialogOpen, setIsSuspendDialogOpen] = useState(false);
  const [selectedCommunity, setSelectedCommunity] = useState<Community | null>(null);
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 10;

  const [formData, setFormData] = useState<Partial<Community>>({
    name: '',
    description: '',
    category: 'general',
    visibility: 'public',
    status: 'active',
    image: '',
    rules: [],
  });

  const [newRule, setNewRule] = useState('');

  const filteredCommunities = communities.filter(
    (community) =>
      community.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      community.category.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const paginatedCommunities = filteredCommunities.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  const handleCreate = () => {
    setFormData({
      name: '',
      description: '',
      category: 'general',
      visibility: 'public',
      status: 'active',
      image: '',
      rules: [],
    });
    setIsCreateModalOpen(true);
  };

  const handleEdit = (community: Community) => {
    setSelectedCommunity(community);
    setFormData(community);
    setIsEditModalOpen(true);
  };

  const handleView = (community: Community) => {
    setSelectedCommunity(community);
    setIsViewModalOpen(true);
  };

  const handleDelete = (community: Community) => {
    setSelectedCommunity(community);
    setIsDeleteDialogOpen(true);
  };

  const handleSuspend = (community: Community) => {
    setSelectedCommunity(community);
    setIsSuspendDialogOpen(true);
  };

  const confirmDelete = () => {
    if (selectedCommunity) {
      setCommunities(communities.filter((c) => c.id !== selectedCommunity.id));
    }
    setIsDeleteDialogOpen(false);
    setSelectedCommunity(null);
  };

  const confirmSuspend = () => {
    if (selectedCommunity) {
      setCommunities(
        communities.map((c) =>
          c.id === selectedCommunity.id
            ? { ...c, status: c.status === 'suspended' ? 'active' : 'suspended' }
            : c
        )
      );
    }
    setIsSuspendDialogOpen(false);
    setSelectedCommunity(null);
  };

  const handleCreateSubmit = () => {
    const newCommunity: Community = {
      ...formData as Community,
      id: Date.now().toString(),
      members: 0,
      posts: 0,
      createdAt: new Date().toISOString().split('T')[0],
      owner: 'admin',
    };
    setCommunities([...communities, newCommunity]);
    setIsCreateModalOpen(false);
  };

  const handleEditSubmit = () => {
    if (selectedCommunity) {
      setCommunities(communities.map((c) => (c.id === selectedCommunity.id ? { ...c, ...formData } : c)));
    }
    setIsEditModalOpen(false);
    setSelectedCommunity(null);
  };

  const addRule = () => {
    if (newRule.trim()) {
      setFormData({
        ...formData,
        rules: [...(formData.rules || []), newRule.trim()],
      });
      setNewRule('');
    }
  };

  const removeRule = (index: number) => {
    setFormData({
      ...formData,
      rules: formData.rules?.filter((_, i) => i !== index) || [],
    });
  };

  const getVisibilityIcon = (visibility: Community['visibility']) => {
    switch (visibility) {
      case 'public': return <Globe className="w-4 h-4" />;
      case 'private': return <Lock className="w-4 h-4" />;
      case 'invite-only': return <Shield className="w-4 h-4" />;
    }
  };

  const columns = [
    {
      key: 'community',
      header: 'Community',
      render: (community: Community) => (
        <div className="flex items-center gap-3">
          <div
            className="w-10 h-10 rounded-lg flex items-center justify-center"
            style={{ backgroundColor: `${categoryColors[community.category]}20` }}
          >
            <Users className="w-5 h-5" style={{ color: categoryColors[community.category] }} />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <p className="text-white font-medium">{community.name}</p>
              <span className="text-gray-500">{getVisibilityIcon(community.visibility)}</span>
            </div>
            <p className="text-gray-500 text-xs capitalize">{community.category}</p>
          </div>
        </div>
      ),
    },
    {
      key: 'members',
      header: 'Members',
      render: (community: Community) => (
        <span className="text-white font-medium">{community.members.toLocaleString()}</span>
      ),
    },
    {
      key: 'posts',
      header: 'Posts',
      render: (community: Community) => (
        <span className="text-gray-400">{community.posts.toLocaleString()}</span>
      ),
    },
    {
      key: 'owner',
      header: 'Owner',
      render: (community: Community) => (
        <span className="text-gray-400">@{community.owner}</span>
      ),
    },
    {
      key: 'status',
      header: 'Status',
      render: (community: Community) => {
        const styles = {
          active: 'bg-green-500/20 text-green-400 border-green-500/30',
          suspended: 'bg-red-500/20 text-red-400 border-red-500/30',
          archived: 'bg-gray-500/20 text-gray-400 border-gray-500/30',
        };
        return (
          <Badge variant="outline" className={styles[community.status]}>
            {community.status.charAt(0).toUpperCase() + community.status.slice(1)}
          </Badge>
        );
      },
    },
    {
      key: 'actions',
      header: 'Actions',
      render: (community: Community) => (
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" size="icon" className="text-gray-400 hover:text-white">
              <MoreVertical className="w-4 h-4" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end" className="bg-[#1a1a2e] border-[#2a2a3e]">
            <DropdownMenuItem
              onClick={() => handleView(community)}
              className="text-gray-300 hover:text-white hover:bg-white/10"
            >
              <Eye className="w-4 h-4 mr-2" />
              View Details
            </DropdownMenuItem>
            <DropdownMenuItem
              onClick={() => handleEdit(community)}
              className="text-gray-300 hover:text-white hover:bg-white/10"
            >
              <Edit className="w-4 h-4 mr-2" />
              Edit Community
            </DropdownMenuItem>
            <DropdownMenuSeparator className="bg-[#2a2a3e]" />
            <DropdownMenuItem
              onClick={() => handleSuspend(community)}
              className={community.status === 'suspended' ? 'text-green-400 hover:bg-green-500/10' : 'text-yellow-400 hover:bg-yellow-500/10'}
            >
              <Ban className="w-4 h-4 mr-2" />
              {community.status === 'suspended' ? 'Unsuspend' : 'Suspend'}
            </DropdownMenuItem>
            <DropdownMenuItem
              onClick={() => handleDelete(community)}
              className="text-red-400 hover:bg-red-500/10"
            >
              <Trash2 className="w-4 h-4 mr-2" />
              Delete Community
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      ),
    },
  ];

  const CommunityForm = () => (
    <div className="space-y-4">
      <ImageUpload
        value={formData.image}
        onChange={(value) => setFormData({ ...formData, image: value })}
        aspectRatio="banner"
      />
      
      <div className="grid grid-cols-2 gap-4">
        <div className="space-y-2 col-span-2">
          <Label className="text-gray-300">Name</Label>
          <Input
            value={formData.name}
            onChange={(e) => setFormData({ ...formData, name: e.target.value })}
            placeholder="Community name"
            className="bg-[#1a1a2e] border-[#2a2a3e] text-white"
          />
        </div>
        
        <div className="space-y-2 col-span-2">
          <Label className="text-gray-300">Description</Label>
          <Textarea
            value={formData.description}
            onChange={(e) => setFormData({ ...formData, description: e.target.value })}
            placeholder="Community description"
            className="bg-[#1a1a2e] border-[#2a2a3e] text-white min-h-[80px]"
          />
        </div>
        
        <div className="space-y-2">
          <Label className="text-gray-300">Category</Label>
          <Select
            value={formData.category}
            onValueChange={(value) => setFormData({ ...formData, category: value as Community['category'] })}
          >
            <SelectTrigger className="bg-[#1a1a2e] border-[#2a2a3e] text-white">
              <SelectValue />
            </SelectTrigger>
            <SelectContent className="bg-[#1a1a2e] border-[#2a2a3e]">
              <SelectItem value="programming">Programming</SelectItem>
              <SelectItem value="gaming">Gaming</SelectItem>
              <SelectItem value="design">Design</SelectItem>
              <SelectItem value="general">General</SelectItem>
              <SelectItem value="tech">Tech</SelectItem>
              <SelectItem value="learning">Learning</SelectItem>
            </SelectContent>
          </Select>
        </div>
        
        <div className="space-y-2">
          <Label className="text-gray-300">Visibility</Label>
          <Select
            value={formData.visibility}
            onValueChange={(value) => setFormData({ ...formData, visibility: value as Community['visibility'] })}
          >
            <SelectTrigger className="bg-[#1a1a2e] border-[#2a2a3e] text-white">
              <SelectValue />
            </SelectTrigger>
            <SelectContent className="bg-[#1a1a2e] border-[#2a2a3e]">
              <SelectItem value="public">Public</SelectItem>
              <SelectItem value="private">Private</SelectItem>
              <SelectItem value="invite-only">Invite Only</SelectItem>
            </SelectContent>
          </Select>
        </div>
        
        <div className="space-y-2 col-span-2">
          <Label className="text-gray-300">Community Rules</Label>
          <div className="flex gap-2">
            <Input
              value={newRule}
              onChange={(e) => setNewRule(e.target.value)}
              placeholder="Add a rule"
              className="bg-[#1a1a2e] border-[#2a2a3e] text-white"
              onKeyDown={(e) => e.key === 'Enter' && addRule()}
            />
            <Button onClick={addRule} className="bg-[#8b5cf6] hover:bg-[#7c4ce6]">
              Add
            </Button>
          </div>
          <div className="space-y-2 mt-2">
            {formData.rules?.map((rule, index) => (
              <div key={index} className="flex items-center gap-2 bg-[#1a1a2e] p-2 rounded-lg">
                <span className="flex-1 text-gray-300 text-sm">{index + 1}. {rule}</span>
                <Button
                  variant="ghost"
                  size="icon-sm"
                  onClick={() => removeRule(index)}
                  className="text-red-400 hover:text-red-300 hover:bg-red-500/10"
                >
                  <Trash2 className="w-3 h-3" />
                </Button>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );

  return (
    <div className="space-y-6">
      <PageHeader
        title="Communities Management"
        description="Create, edit, and manage all communities"
        icon={Users}
        showSearch
        searchValue={searchQuery}
        onSearchChange={setSearchQuery}
        searchPlaceholder="Search communities..."
        showAddButton
        addButtonText="Create Community"
        onAddClick={handleCreate}
        showFilter
      />

      <DataTable
        columns={columns}
        data={paginatedCommunities}
        keyExtractor={(community) => community.id}
        emptyMessage="No communities found"
        pagination={{
          currentPage,
          totalPages: Math.ceil(filteredCommunities.length / itemsPerPage),
          onPageChange: setCurrentPage,
          totalItems: filteredCommunities.length,
          itemsPerPage,
        }}
      />

      {/* Create Modal */}
      <FormModal
        isOpen={isCreateModalOpen}
        onClose={() => setIsCreateModalOpen(false)}
        title="Create New Community"
        onSubmit={handleCreateSubmit}
        submitText="Create Community"
        size="lg"
      >
        <CommunityForm />
      </FormModal>

      {/* Edit Modal */}
      <FormModal
        isOpen={isEditModalOpen}
        onClose={() => setIsEditModalOpen(false)}
        title="Edit Community"
        onSubmit={handleEditSubmit}
        submitText="Save Changes"
        size="lg"
      >
        <CommunityForm />
      </FormModal>

      {/* View Modal */}
      <FormModal
        isOpen={isViewModalOpen}
        onClose={() => setIsViewModalOpen(false)}
        title="Community Details"
        size="lg"
      >
        {selectedCommunity && (
          <div className="space-y-6">
            <div className="flex items-center gap-4">
              <div
                className="w-16 h-16 rounded-xl flex items-center justify-center"
                style={{ backgroundColor: `${categoryColors[selectedCommunity.category]}20` }}
              >
                <Users className="w-8 h-8" style={{ color: categoryColors[selectedCommunity.category] }} />
              </div>
              <div>
                <div className="flex items-center gap-2">
                  <h3 className="text-xl font-bold text-white">{selectedCommunity.name}</h3>
                  {getVisibilityIcon(selectedCommunity.visibility)}
                </div>
                <p className="text-gray-400">by @{selectedCommunity.owner}</p>
              </div>
            </div>

            <p className="text-gray-400">{selectedCommunity.description}</p>

            <div className="grid grid-cols-3 gap-4">
              <div className="bg-[#1a1a2e] p-4 rounded-lg text-center">
                <Users className="w-5 h-5 text-[#8b5cf6] mx-auto mb-2" />
                <p className="text-xl font-bold text-white">{selectedCommunity.members.toLocaleString()}</p>
                <p className="text-gray-500 text-xs">Members</p>
              </div>
              <div className="bg-[#1a1a2e] p-4 rounded-lg text-center">
                <MessageSquare className="w-5 h-5 text-[#00ff88] mx-auto mb-2" />
                <p className="text-xl font-bold text-white">{selectedCommunity.posts.toLocaleString()}</p>
                <p className="text-gray-500 text-xs">Posts</p>
              </div>
              <div className="bg-[#1a1a2e] p-4 rounded-lg text-center">
                <Crown className="w-5 h-5 text-[#ffd700] mx-auto mb-2" />
                <p className="text-sm font-bold text-white truncate">@{selectedCommunity.owner}</p>
                <p className="text-gray-500 text-xs">Owner</p>
              </div>
            </div>

            {selectedCommunity.rules.length > 0 && (
              <div>
                <h4 className="text-white font-medium mb-3">Community Rules</h4>
                <div className="space-y-2">
                  {selectedCommunity.rules.map((rule, index) => (
                    <div key={index} className="bg-[#1a1a2e] p-3 rounded-lg text-gray-300 text-sm">
                      {index + 1}. {rule}
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        )}
      </FormModal>

      {/* Delete Confirmation */}
      <ConfirmDialog
        isOpen={isDeleteDialogOpen}
        onClose={() => setIsDeleteDialogOpen(false)}
        onConfirm={confirmDelete}
        title="Delete Community"
        description={`Are you sure you want to delete "${selectedCommunity?.name}"? All posts and data will be permanently removed.`}
        confirmText="Delete Community"
        variant="danger"
      />

      {/* Suspend Confirmation */}
      <ConfirmDialog
        isOpen={isSuspendDialogOpen}
        onClose={() => setIsSuspendDialogOpen(false)}
        onConfirm={confirmSuspend}
        title={selectedCommunity?.status === 'suspended' ? 'Unsuspend Community' : 'Suspend Community'}
        description={
          selectedCommunity?.status === 'suspended'
            ? `Are you sure you want to unsuspend "${selectedCommunity?.name}"?`
            : `Are you sure you want to suspend "${selectedCommunity?.name}"? Members will not be able to post.`
        }
        confirmText={selectedCommunity?.status === 'suspended' ? 'Unsuspend' : 'Suspend'}
        variant={selectedCommunity?.status === 'suspended' ? 'default' : 'warning'}
      />
    </div>
  );
}
