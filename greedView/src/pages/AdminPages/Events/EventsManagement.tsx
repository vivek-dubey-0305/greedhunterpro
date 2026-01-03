import { useState } from 'react';
import { motion } from 'framer-motion';
import {
  Calendar,
  MoreVertical,
  Eye,
  Edit,
  Trash2,
  Plus,
  Users,
  Coins,
  Clock,
  MapPin,
  CheckCircle,
  XCircle,
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

interface Event {
  id: string;
  title: string;
  description: string;
  category: 'workshop' | 'hackathon' | 'competition' | 'bootcamp' | 'meetup' | 'webinar';
  date: string;
  time: string;
  location: string;
  maxParticipants: number;
  currentParticipants: number;
  reward: number;
  status: 'draft' | 'active' | 'completed' | 'cancelled';
  isFeatured: boolean;
  image: string;
  difficulty: 'beginner' | 'intermediate' | 'advanced';
}

const mockEvents: Event[] = [
  {
    id: '1',
    title: 'Web Development Bootcamp',
    description: 'Learn modern web development with React and Node.js',
    category: 'bootcamp',
    date: '2024-12-20',
    time: '10:00 AM',
    location: 'Online',
    maxParticipants: 100,
    currentParticipants: 75,
    reward: 500,
    status: 'active',
    isFeatured: true,
    image: '',
    difficulty: 'intermediate',
  },
  {
    id: '2',
    title: 'AI Hackathon 2024',
    description: 'Build innovative AI solutions in 48 hours',
    category: 'hackathon',
    date: '2024-12-25',
    time: '09:00 AM',
    location: 'Tech Hub, NYC',
    maxParticipants: 200,
    currentParticipants: 180,
    reward: 2000,
    status: 'active',
    isFeatured: true,
    image: '',
    difficulty: 'advanced',
  },
  {
    id: '3',
    title: 'Intro to Python',
    description: 'Beginner-friendly Python programming workshop',
    category: 'workshop',
    date: '2024-12-15',
    time: '02:00 PM',
    location: 'Online',
    maxParticipants: 50,
    currentParticipants: 48,
    reward: 100,
    status: 'completed',
    isFeatured: false,
    image: '',
    difficulty: 'beginner',
  },
  {
    id: '4',
    title: 'Coding Competition',
    description: 'Test your skills in competitive programming',
    category: 'competition',
    date: '2024-12-30',
    time: '11:00 AM',
    location: 'Online',
    maxParticipants: 500,
    currentParticipants: 320,
    reward: 1500,
    status: 'active',
    isFeatured: false,
    image: '',
    difficulty: 'advanced',
  },
];

const categoryColors = {
  workshop: '#00ff88',
  hackathon: '#8b5cf6',
  competition: '#ffd700',
  bootcamp: '#00d9ff',
  meetup: '#ff6b6b',
  webinar: '#ff8c00',
};

export function EventsManagement() {
  const [events, setEvents] = useState<Event[]>(mockEvents);
  const [searchQuery, setSearchQuery] = useState('');
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [isViewModalOpen, setIsViewModalOpen] = useState(false);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [selectedEvent, setSelectedEvent] = useState<Event | null>(null);
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 10;

  // Form state for create/edit
  const [formData, setFormData] = useState<Partial<Event>>({
    title: '',
    description: '',
    category: 'workshop',
    date: '',
    time: '',
    location: '',
    maxParticipants: 100,
    reward: 100,
    status: 'draft',
    isFeatured: false,
    image: '',
    difficulty: 'beginner',
  });

  const filteredEvents = events.filter(
    (event) =>
      event.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      event.category.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const paginatedEvents = filteredEvents.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  const handleCreate = () => {
    setFormData({
      title: '',
      description: '',
      category: 'workshop',
      date: '',
      time: '',
      location: '',
      maxParticipants: 100,
      reward: 100,
      status: 'draft',
      isFeatured: false,
      image: '',
      difficulty: 'beginner',
    });
    setIsCreateModalOpen(true);
  };

  const handleEdit = (event: Event) => {
    setSelectedEvent(event);
    setFormData(event);
    setIsEditModalOpen(true);
  };

  const handleView = (event: Event) => {
    setSelectedEvent(event);
    setIsViewModalOpen(true);
  };

  const handleDelete = (event: Event) => {
    setSelectedEvent(event);
    setIsDeleteDialogOpen(true);
  };

  const confirmDelete = () => {
    if (selectedEvent) {
      setEvents(events.filter((e) => e.id !== selectedEvent.id));
    }
    setIsDeleteDialogOpen(false);
    setSelectedEvent(null);
  };

  const handleCreateSubmit = () => {
    const newEvent: Event = {
      ...formData as Event,
      id: Date.now().toString(),
      currentParticipants: 0,
    };
    setEvents([...events, newEvent]);
    setIsCreateModalOpen(false);
  };

  const handleEditSubmit = () => {
    if (selectedEvent) {
      setEvents(events.map((e) => (e.id === selectedEvent.id ? { ...e, ...formData } : e)));
    }
    setIsEditModalOpen(false);
    setSelectedEvent(null);
  };

  const getStatusBadge = (status: Event['status']) => {
    const styles = {
      draft: 'bg-gray-500/20 text-gray-400 border-gray-500/30',
      active: 'bg-green-500/20 text-green-400 border-green-500/30',
      completed: 'bg-blue-500/20 text-blue-400 border-blue-500/30',
      cancelled: 'bg-red-500/20 text-red-400 border-red-500/30',
    };
    return (
      <Badge variant="outline" className={styles[status]}>
        {status.charAt(0).toUpperCase() + status.slice(1)}
      </Badge>
    );
  };

  const columns = [
    {
      key: 'event',
      header: 'Event',
      render: (event: Event) => (
        <div className="flex items-center gap-3">
          <div
            className="w-10 h-10 rounded-lg flex items-center justify-center"
            style={{ backgroundColor: `${categoryColors[event.category]}20` }}
          >
            <Calendar className="w-5 h-5" style={{ color: categoryColors[event.category] }} />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <p className="text-white font-medium">{event.title}</p>
              {event.isFeatured && (
                <Badge className="bg-[#ffd700]/20 text-[#ffd700] border-[#ffd700]/30 text-xs">
                  Featured
                </Badge>
              )}
            </div>
            <p className="text-gray-500 text-xs capitalize">{event.category}</p>
          </div>
        </div>
      ),
    },
    {
      key: 'dateTime',
      header: 'Date & Time',
      render: (event: Event) => (
        <div className="text-gray-400">
          <div className="flex items-center gap-1">
            <Calendar className="w-3 h-3" />
            <span className="text-sm">{event.date}</span>
          </div>
          <div className="flex items-center gap-1 text-xs">
            <Clock className="w-3 h-3" />
            <span>{event.time}</span>
          </div>
        </div>
      ),
    },
    {
      key: 'participants',
      header: 'Participants',
      render: (event: Event) => (
        <div className="flex items-center gap-2">
          <Users className="w-4 h-4 text-gray-500" />
          <span className="text-white">
            {event.currentParticipants}/{event.maxParticipants}
          </span>
        </div>
      ),
    },
    {
      key: 'reward',
      header: 'Reward',
      render: (event: Event) => (
        <div className="flex items-center gap-1 text-[#ffd700]">
          <Coins className="w-4 h-4" />
          <span className="font-medium">{event.reward}</span>
        </div>
      ),
    },
    {
      key: 'status',
      header: 'Status',
      render: (event: Event) => getStatusBadge(event.status),
    },
    {
      key: 'actions',
      header: 'Actions',
      render: (event: Event) => (
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" size="icon" className="text-gray-400 hover:text-white">
              <MoreVertical className="w-4 h-4" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end" className="bg-[#1a1a2e] border-[#2a2a3e]">
            <DropdownMenuItem
              onClick={() => handleView(event)}
              className="text-gray-300 hover:text-white hover:bg-white/10"
            >
              <Eye className="w-4 h-4 mr-2" />
              View Details
            </DropdownMenuItem>
            <DropdownMenuItem
              onClick={() => handleEdit(event)}
              className="text-gray-300 hover:text-white hover:bg-white/10"
            >
              <Edit className="w-4 h-4 mr-2" />
              Edit Event
            </DropdownMenuItem>
            <DropdownMenuSeparator className="bg-[#2a2a3e]" />
            <DropdownMenuItem
              onClick={() => handleDelete(event)}
              className="text-red-400 hover:bg-red-500/10"
            >
              <Trash2 className="w-4 h-4 mr-2" />
              Delete Event
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      ),
    },
  ];

  const EventForm = () => (
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
            placeholder="Event title"
            className="bg-[#1a1a2e] border-[#2a2a3e] text-white"
          />
        </div>
        
        <div className="space-y-2 col-span-2">
          <Label className="text-gray-300">Description</Label>
          <Textarea
            value={formData.description}
            onChange={(e) => setFormData({ ...formData, description: e.target.value })}
            placeholder="Event description"
            className="bg-[#1a1a2e] border-[#2a2a3e] text-white min-h-[100px]"
          />
        </div>
        
        <div className="space-y-2">
          <Label className="text-gray-300">Category</Label>
          <Select
            value={formData.category}
            onValueChange={(value) => setFormData({ ...formData, category: value as Event['category'] })}
          >
            <SelectTrigger className="bg-[#1a1a2e] border-[#2a2a3e] text-white">
              <SelectValue />
            </SelectTrigger>
            <SelectContent className="bg-[#1a1a2e] border-[#2a2a3e]">
              <SelectItem value="workshop">Workshop</SelectItem>
              <SelectItem value="hackathon">Hackathon</SelectItem>
              <SelectItem value="competition">Competition</SelectItem>
              <SelectItem value="bootcamp">Bootcamp</SelectItem>
              <SelectItem value="meetup">Meetup</SelectItem>
              <SelectItem value="webinar">Webinar</SelectItem>
            </SelectContent>
          </Select>
        </div>
        
        <div className="space-y-2">
          <Label className="text-gray-300">Difficulty</Label>
          <Select
            value={formData.difficulty}
            onValueChange={(value) => setFormData({ ...formData, difficulty: value as Event['difficulty'] })}
          >
            <SelectTrigger className="bg-[#1a1a2e] border-[#2a2a3e] text-white">
              <SelectValue />
            </SelectTrigger>
            <SelectContent className="bg-[#1a1a2e] border-[#2a2a3e]">
              <SelectItem value="beginner">Beginner</SelectItem>
              <SelectItem value="intermediate">Intermediate</SelectItem>
              <SelectItem value="advanced">Advanced</SelectItem>
            </SelectContent>
          </Select>
        </div>
        
        <div className="space-y-2">
          <Label className="text-gray-300">Date</Label>
          <Input
            type="date"
            value={formData.date}
            onChange={(e) => setFormData({ ...formData, date: e.target.value })}
            className="bg-[#1a1a2e] border-[#2a2a3e] text-white"
          />
        </div>
        
        <div className="space-y-2">
          <Label className="text-gray-300">Time</Label>
          <Input
            type="time"
            value={formData.time}
            onChange={(e) => setFormData({ ...formData, time: e.target.value })}
            className="bg-[#1a1a2e] border-[#2a2a3e] text-white"
          />
        </div>
        
        <div className="space-y-2 col-span-2">
          <Label className="text-gray-300">Location</Label>
          <Input
            value={formData.location}
            onChange={(e) => setFormData({ ...formData, location: e.target.value })}
            placeholder="Event location or 'Online'"
            className="bg-[#1a1a2e] border-[#2a2a3e] text-white"
          />
        </div>
        
        <div className="space-y-2">
          <Label className="text-gray-300">Max Participants</Label>
          <Input
            type="number"
            value={formData.maxParticipants}
            onChange={(e) => setFormData({ ...formData, maxParticipants: parseInt(e.target.value) })}
            className="bg-[#1a1a2e] border-[#2a2a3e] text-white"
          />
        </div>
        
        <div className="space-y-2">
          <Label className="text-gray-300">Reward (Coins)</Label>
          <Input
            type="number"
            value={formData.reward}
            onChange={(e) => setFormData({ ...formData, reward: parseInt(e.target.value) })}
            className="bg-[#1a1a2e] border-[#2a2a3e] text-white"
          />
        </div>
        
        <div className="space-y-2">
          <Label className="text-gray-300">Status</Label>
          <Select
            value={formData.status}
            onValueChange={(value) => setFormData({ ...formData, status: value as Event['status'] })}
          >
            <SelectTrigger className="bg-[#1a1a2e] border-[#2a2a3e] text-white">
              <SelectValue />
            </SelectTrigger>
            <SelectContent className="bg-[#1a1a2e] border-[#2a2a3e]">
              <SelectItem value="draft">Draft</SelectItem>
              <SelectItem value="active">Active</SelectItem>
              <SelectItem value="completed">Completed</SelectItem>
              <SelectItem value="cancelled">Cancelled</SelectItem>
            </SelectContent>
          </Select>
        </div>
        
        <div className="flex items-center justify-between p-4 bg-[#1a1a2e] rounded-lg">
          <div>
            <Label className="text-gray-300">Featured Event</Label>
            <p className="text-gray-500 text-xs">Show this event prominently</p>
          </div>
          <Switch
            checked={formData.isFeatured}
            onCheckedChange={(checked) => setFormData({ ...formData, isFeatured: checked })}
          />
        </div>
      </div>
    </div>
  );

  return (
    <div className="space-y-6">
      <PageHeader
        title="Events Management"
        description="Create, edit, and manage all events"
        icon={Calendar}
        showSearch
        searchValue={searchQuery}
        onSearchChange={setSearchQuery}
        searchPlaceholder="Search events..."
        showAddButton
        addButtonText="Create Event"
        onAddClick={handleCreate}
        showFilter
      />

      <DataTable
        columns={columns}
        data={paginatedEvents}
        keyExtractor={(event) => event.id}
        emptyMessage="No events found"
        pagination={{
          currentPage,
          totalPages: Math.ceil(filteredEvents.length / itemsPerPage),
          onPageChange: setCurrentPage,
          totalItems: filteredEvents.length,
          itemsPerPage,
        }}
      />

      {/* Create Event Modal */}
      <FormModal
        isOpen={isCreateModalOpen}
        onClose={() => setIsCreateModalOpen(false)}
        title="Create New Event"
        onSubmit={handleCreateSubmit}
        submitText="Create Event"
        size="lg"
      >
        <EventForm />
      </FormModal>

      {/* Edit Event Modal */}
      <FormModal
        isOpen={isEditModalOpen}
        onClose={() => setIsEditModalOpen(false)}
        title="Edit Event"
        onSubmit={handleEditSubmit}
        submitText="Save Changes"
        size="lg"
      >
        <EventForm />
      </FormModal>

      {/* View Event Modal */}
      <FormModal
        isOpen={isViewModalOpen}
        onClose={() => setIsViewModalOpen(false)}
        title="Event Details"
        size="lg"
      >
        {selectedEvent && (
          <div className="space-y-6">
            {selectedEvent.image && (
              <img
                src={selectedEvent.image}
                alt={selectedEvent.title}
                className="w-full aspect-video object-cover rounded-xl"
              />
            )}
            
            <div>
              <div className="flex items-center gap-2 mb-2">
                {getStatusBadge(selectedEvent.status)}
                {selectedEvent.isFeatured && (
                  <Badge className="bg-[#ffd700]/20 text-[#ffd700] border-[#ffd700]/30">
                    Featured
                  </Badge>
                )}
              </div>
              <h3 className="text-xl font-bold text-white">{selectedEvent.title}</h3>
              <p className="text-gray-400 mt-2">{selectedEvent.description}</p>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="bg-[#1a1a2e] p-4 rounded-lg">
                <div className="flex items-center gap-2 text-gray-400 mb-1">
                  <Calendar className="w-4 h-4" />
                  <span className="text-sm">Date & Time</span>
                </div>
                <p className="text-white">{selectedEvent.date} at {selectedEvent.time}</p>
              </div>
              <div className="bg-[#1a1a2e] p-4 rounded-lg">
                <div className="flex items-center gap-2 text-gray-400 mb-1">
                  <MapPin className="w-4 h-4" />
                  <span className="text-sm">Location</span>
                </div>
                <p className="text-white">{selectedEvent.location}</p>
              </div>
              <div className="bg-[#1a1a2e] p-4 rounded-lg">
                <div className="flex items-center gap-2 text-gray-400 mb-1">
                  <Users className="w-4 h-4" />
                  <span className="text-sm">Participants</span>
                </div>
                <p className="text-white">
                  {selectedEvent.currentParticipants} / {selectedEvent.maxParticipants}
                </p>
              </div>
              <div className="bg-[#1a1a2e] p-4 rounded-lg">
                <div className="flex items-center gap-2 text-gray-400 mb-1">
                  <Coins className="w-4 h-4" />
                  <span className="text-sm">Reward</span>
                </div>
                <p className="text-[#ffd700] font-bold">{selectedEvent.reward} Coins</p>
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
        title="Delete Event"
        description={`Are you sure you want to delete "${selectedEvent?.title}"? This action cannot be undone.`}
        confirmText="Delete Event"
        variant="danger"
      />
    </div>
  );
}
