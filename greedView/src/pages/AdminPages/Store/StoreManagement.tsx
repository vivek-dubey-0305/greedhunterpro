import { useState } from 'react';
import { motion } from 'framer-motion';
import {
  Store,
  Plus,
  MoreVertical,
  Edit,
  Trash2,
  Eye,
  EyeOff,
  Package,
  Coins,
  Tag,
  TrendingUp,
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Switch } from '@/components/ui/switch';
import { Textarea } from '@/components/ui/textarea';
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
import { PageHeader, DataTable, ConfirmDialog, FormModal, ImageUpload } from '../components';

interface StoreItem {
  id: string;
  name: string;
  description: string;
  category: 'avatar' | 'badge' | 'theme' | 'powerup' | 'boost' | 'cosmetic';
  price: number;
  currency: 'coins' | 'cash';
  image: string;
  stock: number | null;
  sold: number;
  isActive: boolean;
  isNew: boolean;
  isFeatured: boolean;
  discount: number;
  createdAt: string;
}

const mockItems: StoreItem[] = [
  {
    id: '1',
    name: 'Premium Avatar Frame',
    description: 'A golden animated frame for your profile avatar',
    category: 'cosmetic',
    price: 500,
    currency: 'coins',
    image: '/store/avatar-frame.png',
    stock: null,
    sold: 1520,
    isActive: true,
    isNew: false,
    isFeatured: true,
    discount: 0,
    createdAt: '2024-01-15',
  },
  {
    id: '2',
    name: 'XP Boost (24h)',
    description: '2x XP gain for 24 hours',
    category: 'boost',
    price: 150,
    currency: 'coins',
    image: '/store/xp-boost.png',
    stock: null,
    sold: 8540,
    isActive: true,
    isNew: false,
    isFeatured: false,
    discount: 10,
    createdAt: '2024-02-20',
  },
  {
    id: '3',
    name: 'Dark Mode Theme',
    description: 'Sleek dark theme for your dashboard',
    category: 'theme',
    price: 2.99,
    currency: 'cash',
    image: '/store/dark-theme.png',
    stock: null,
    sold: 320,
    isActive: true,
    isNew: true,
    isFeatured: true,
    discount: 0,
    createdAt: '2024-11-01',
  },
  {
    id: '4',
    name: 'Challenge Skip',
    description: 'Skip one daily challenge without losing streak',
    category: 'powerup',
    price: 100,
    currency: 'coins',
    image: '/store/skip.png',
    stock: 500,
    sold: 245,
    isActive: true,
    isNew: false,
    isFeatured: false,
    discount: 0,
    createdAt: '2024-06-10',
  },
  {
    id: '5',
    name: 'Developer Badge',
    description: 'Show off your developer status',
    category: 'badge',
    price: 1000,
    currency: 'coins',
    image: '/store/dev-badge.png',
    stock: 100,
    sold: 85,
    isActive: false,
    isNew: false,
    isFeatured: false,
    discount: 25,
    createdAt: '2024-03-05',
  },
];

const categories = ['avatar', 'badge', 'theme', 'powerup', 'boost', 'cosmetic'] as const;

export function StoreManagement() {
  const [items, setItems] = useState<StoreItem[]>(mockItems);
  const [searchQuery, setSearchQuery] = useState('');
  const [isFormModalOpen, setIsFormModalOpen] = useState(false);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [selectedItem, setSelectedItem] = useState<StoreItem | null>(null);
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 10;

  const [formData, setFormData] = useState<Partial<StoreItem>>({
    name: '',
    description: '',
    category: 'cosmetic',
    price: 0,
    currency: 'coins',
    image: '',
    stock: null,
    isActive: true,
    isNew: false,
    isFeatured: false,
    discount: 0,
  });

  const filteredItems = items.filter((item) =>
    item.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    item.category.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const paginatedItems = filteredItems.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  const handleAdd = () => {
    setSelectedItem(null);
    setFormData({
      name: '',
      description: '',
      category: 'cosmetic',
      price: 0,
      currency: 'coins',
      image: '',
      stock: null,
      isActive: true,
      isNew: false,
      isFeatured: false,
      discount: 0,
    });
    setIsFormModalOpen(true);
  };

  const handleEdit = (item: StoreItem) => {
    setSelectedItem(item);
    setFormData(item);
    setIsFormModalOpen(true);
  };

  const handleDelete = (item: StoreItem) => {
    setSelectedItem(item);
    setIsDeleteDialogOpen(true);
  };

  const handleToggleActive = (itemId: string) => {
    setItems(
      items.map((item) =>
        item.id === itemId ? { ...item, isActive: !item.isActive } : item
      )
    );
  };

  const handleSubmit = () => {
    if (selectedItem) {
      setItems(
        items.map((item) =>
          item.id === selectedItem.id ? { ...item, ...formData } : item
        )
      );
    } else {
      const newItem: StoreItem = {
        ...formData as StoreItem,
        id: Date.now().toString(),
        sold: 0,
        createdAt: new Date().toISOString().split('T')[0],
      };
      setItems([newItem, ...items]);
    }
    setIsFormModalOpen(false);
  };

  const confirmDelete = () => {
    if (selectedItem) {
      setItems(items.filter((item) => item.id !== selectedItem.id));
    }
    setIsDeleteDialogOpen(false);
    setSelectedItem(null);
  };

  const totalRevenue = items.reduce((acc, item) => acc + item.price * item.sold, 0);
  const activeItems = items.filter((item) => item.isActive).length;
  const featuredItems = items.filter((item) => item.isFeatured).length;

  const columns = [
    {
      key: 'item',
      header: 'Item',
      render: (item: StoreItem) => (
        <div className="flex items-center gap-3">
          <div className="w-12 h-12 rounded-lg bg-[#1a1a2e] border border-[#2a2a3e] flex items-center justify-center overflow-hidden">
            {item.image ? (
              <img src={item.image} alt={item.name} className="w-full h-full object-cover" />
            ) : (
              <Package className="w-6 h-6 text-gray-500" />
            )}
          </div>
          <div>
            <div className="flex items-center gap-2">
              <p className="text-white font-medium">{item.name}</p>
              {item.isNew && (
                <Badge className="bg-[#00ff88]/20 text-[#00ff88] border-[#00ff88]/30 text-xs">
                  New
                </Badge>
              )}
              {item.isFeatured && (
                <Badge className="bg-[#ffd700]/20 text-[#ffd700] border-[#ffd700]/30 text-xs">
                  Featured
                </Badge>
              )}
            </div>
            <p className="text-gray-500 text-xs capitalize">{item.category}</p>
          </div>
        </div>
      ),
    },
    {
      key: 'price',
      header: 'Price',
      render: (item: StoreItem) => (
        <div className="flex items-center gap-2">
          {item.discount > 0 && (
            <span className="text-gray-500 line-through text-sm">
              {item.currency === 'coins' ? `${item.price}` : `$${item.price}`}
            </span>
          )}
          <span className="text-white font-medium flex items-center gap-1">
            {item.currency === 'coins' ? (
              <>
                <Coins className="w-4 h-4 text-[#ffd700]" />
                {item.discount > 0 ? Math.round(item.price * (1 - item.discount / 100)) : item.price}
              </>
            ) : (
              <>
                ${item.discount > 0 ? (item.price * (1 - item.discount / 100)).toFixed(2) : item.price}
              </>
            )}
          </span>
          {item.discount > 0 && (
            <Badge className="bg-red-500/20 text-red-400 border-red-500/30 text-xs">
              -{item.discount}%
            </Badge>
          )}
        </div>
      ),
    },
    {
      key: 'stock',
      header: 'Stock',
      render: (item: StoreItem) => (
        <span className={item.stock !== null && item.stock < 50 ? 'text-yellow-400' : 'text-gray-400'}>
          {item.stock === null ? 'Unlimited' : item.stock}
        </span>
      ),
    },
    {
      key: 'sold',
      header: 'Sold',
      render: (item: StoreItem) => (
        <span className="text-[#00ff88]">{item.sold.toLocaleString()}</span>
      ),
    },
    {
      key: 'status',
      header: 'Status',
      render: (item: StoreItem) => (
        <Switch
          checked={item.isActive}
          onCheckedChange={() => handleToggleActive(item.id)}
          className="data-[state=checked]:bg-[#00ff88]"
        />
      ),
    },
    {
      key: 'actions',
      header: 'Actions',
      render: (item: StoreItem) => (
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" size="icon" className="text-gray-400 hover:text-white">
              <MoreVertical className="w-4 h-4" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end" className="bg-[#1a1a2e] border-[#2a2a3e]">
            <DropdownMenuItem
              onClick={() => handleEdit(item)}
              className="text-gray-300 hover:text-white hover:bg-white/10"
            >
              <Edit className="w-4 h-4 mr-2" />
              Edit Item
            </DropdownMenuItem>
            <DropdownMenuSeparator className="bg-[#2a2a3e]" />
            <DropdownMenuItem
              onClick={() => handleDelete(item)}
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
        title="Store Management"
        description="Manage store items, pricing, and inventory"
        icon={Store}
        showSearch
        searchValue={searchQuery}
        onSearchChange={setSearchQuery}
        searchPlaceholder="Search items..."
        showAddButton
        addButtonText="Add Item"
        onAddClick={handleAdd}
        showFilter
      />

      {/* Stats */}
      <div className="grid grid-cols-4 gap-4">
        <div className="bg-[#141420] border border-[#2a2a3e] rounded-xl p-4">
          <div className="flex items-center justify-between">
            <p className="text-gray-400 text-sm">Total Items</p>
            <Package className="w-5 h-5 text-[#8b5cf6]" />
          </div>
          <p className="text-2xl font-bold text-white mt-2">{items.length}</p>
        </div>
        <div className="bg-[#141420] border border-[#2a2a3e] rounded-xl p-4">
          <div className="flex items-center justify-between">
            <p className="text-gray-400 text-sm">Active</p>
            <Eye className="w-5 h-5 text-[#00ff88]" />
          </div>
          <p className="text-2xl font-bold text-[#00ff88] mt-2">{activeItems}</p>
        </div>
        <div className="bg-[#141420] border border-[#2a2a3e] rounded-xl p-4">
          <div className="flex items-center justify-between">
            <p className="text-gray-400 text-sm">Featured</p>
            <Tag className="w-5 h-5 text-[#ffd700]" />
          </div>
          <p className="text-2xl font-bold text-[#ffd700] mt-2">{featuredItems}</p>
        </div>
        <div className="bg-[#141420] border border-[#2a2a3e] rounded-xl p-4">
          <div className="flex items-center justify-between">
            <p className="text-gray-400 text-sm">Total Sales</p>
            <TrendingUp className="w-5 h-5 text-[#00d9ff]" />
          </div>
          <p className="text-2xl font-bold text-[#00d9ff] mt-2">{items.reduce((a, b) => a + b.sold, 0).toLocaleString()}</p>
        </div>
      </div>

      <DataTable
        columns={columns}
        data={paginatedItems}
        keyExtractor={(item) => item.id}
        emptyMessage="No items found"
        pagination={{
          currentPage,
          totalPages: Math.ceil(filteredItems.length / itemsPerPage),
          onPageChange: setCurrentPage,
          totalItems: filteredItems.length,
          itemsPerPage,
        }}
      />

      {/* Form Modal */}
      <FormModal
        isOpen={isFormModalOpen}
        onClose={() => setIsFormModalOpen(false)}
        title={selectedItem ? 'Edit Item' : 'Add New Item'}
        size="lg"
      >
        <div className="space-y-6">
          <ImageUpload
            value={formData.image || ''}
            onChange={(url) => setFormData({ ...formData, image: url })}
            aspectRatio="square"
          />

          <div className="grid grid-cols-2 gap-4">
            <div className="col-span-2">
              <label className="text-sm text-gray-400 mb-2 block">Item Name</label>
              <Input
                value={formData.name || ''}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                placeholder="Enter item name"
                className="bg-[#1a1a2e] border-[#2a2a3e] text-white"
              />
            </div>

            <div className="col-span-2">
              <label className="text-sm text-gray-400 mb-2 block">Description</label>
              <Textarea
                value={formData.description || ''}
                onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                placeholder="Enter item description"
                className="bg-[#1a1a2e] border-[#2a2a3e] text-white min-h-[80px]"
              />
            </div>

            <div>
              <label className="text-sm text-gray-400 mb-2 block">Category</label>
              <Select
                value={formData.category}
                onValueChange={(value) => setFormData({ ...formData, category: value as StoreItem['category'] })}
              >
                <SelectTrigger className="bg-[#1a1a2e] border-[#2a2a3e] text-white">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent className="bg-[#1a1a2e] border-[#2a2a3e]">
                  {categories.map((cat) => (
                    <SelectItem key={cat} value={cat} className="text-white capitalize">
                      {cat}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div>
              <label className="text-sm text-gray-400 mb-2 block">Currency</label>
              <Select
                value={formData.currency}
                onValueChange={(value) => setFormData({ ...formData, currency: value as 'coins' | 'cash' })}
              >
                <SelectTrigger className="bg-[#1a1a2e] border-[#2a2a3e] text-white">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent className="bg-[#1a1a2e] border-[#2a2a3e]">
                  <SelectItem value="coins" className="text-white">Coins</SelectItem>
                  <SelectItem value="cash" className="text-white">Cash ($)</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div>
              <label className="text-sm text-gray-400 mb-2 block">Price</label>
              <Input
                type="number"
                value={formData.price || ''}
                onChange={(e) => setFormData({ ...formData, price: parseFloat(e.target.value) || 0 })}
                placeholder="0"
                className="bg-[#1a1a2e] border-[#2a2a3e] text-white"
              />
            </div>

            <div>
              <label className="text-sm text-gray-400 mb-2 block">Discount (%)</label>
              <Input
                type="number"
                value={formData.discount || ''}
                onChange={(e) => setFormData({ ...formData, discount: parseInt(e.target.value) || 0 })}
                placeholder="0"
                min="0"
                max="100"
                className="bg-[#1a1a2e] border-[#2a2a3e] text-white"
              />
            </div>

            <div>
              <label className="text-sm text-gray-400 mb-2 block">Stock (leave empty for unlimited)</label>
              <Input
                type="number"
                value={formData.stock || ''}
                onChange={(e) => setFormData({ ...formData, stock: e.target.value ? parseInt(e.target.value) : null })}
                placeholder="Unlimited"
                className="bg-[#1a1a2e] border-[#2a2a3e] text-white"
              />
            </div>

            <div className="flex items-center gap-6 col-span-2 pt-2">
              <div className="flex items-center gap-2">
                <Switch
                  checked={formData.isActive}
                  onCheckedChange={(checked) => setFormData({ ...formData, isActive: checked })}
                  className="data-[state=checked]:bg-[#00ff88]"
                />
                <span className="text-sm text-gray-400">Active</span>
              </div>
              <div className="flex items-center gap-2">
                <Switch
                  checked={formData.isNew}
                  onCheckedChange={(checked) => setFormData({ ...formData, isNew: checked })}
                  className="data-[state=checked]:bg-[#00ff88]"
                />
                <span className="text-sm text-gray-400">New Tag</span>
              </div>
              <div className="flex items-center gap-2">
                <Switch
                  checked={formData.isFeatured}
                  onCheckedChange={(checked) => setFormData({ ...formData, isFeatured: checked })}
                  className="data-[state=checked]:bg-[#ffd700]"
                />
                <span className="text-sm text-gray-400">Featured</span>
              </div>
            </div>
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
              className="flex-1 bg-[#00ff88] hover:bg-[#00ff88]/80 text-black"
            >
              {selectedItem ? 'Save Changes' : 'Add Item'}
            </Button>
          </div>
        </div>
      </FormModal>

      {/* Delete Confirmation */}
      <ConfirmDialog
        isOpen={isDeleteDialogOpen}
        onClose={() => setIsDeleteDialogOpen(false)}
        onConfirm={confirmDelete}
        title="Delete Item"
        description={`Are you sure you want to delete "${selectedItem?.name}"? This action cannot be undone.`}
        confirmText="Delete Item"
        variant="danger"
      />
    </div>
  );
}
