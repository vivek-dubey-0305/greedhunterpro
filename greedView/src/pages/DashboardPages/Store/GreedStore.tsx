import { useState, useRef } from 'react';
import { motion, AnimatePresence, useInView } from 'framer-motion';
import { 
  Store, 
  Coins, 
  Banknote, 
  Smartphone, 
  GraduationCap, 
  Sparkles,
  Search,
  ShoppingCart,
  Heart,
  Star,
  ChevronRight,
  Gift,
  Zap,
  Crown,
  CheckCircle,
  X,
  Plus,
  Minus,
  TrendingUp,
  Package
} from 'lucide-react';

// Category type
type CategoryType = 'all' | 'cash' | 'gadgets' | 'fees' | 'perks';

// Product interface
interface Product {
  id: string;
  name: string;
  description: string;
  coins: number;
  category: CategoryType;
  image: string;
  rating: number;
  reviews: number;
  inStock: boolean;
  featured?: boolean;
  discount?: number;
  tags?: string[];
}

// Category Tab Component
function CategoryTab({ 
  icon: Icon, 
  label, 
  active, 
  onClick,
  count
}: {
  icon: React.ElementType;
  label: string;
  active: boolean;
  onClick: () => void;
  count: number;
}) {
  return (
    <motion.button
      onClick={onClick}
      className={`flex items-center gap-2 px-4 py-2 rounded-xl font-medium whitespace-nowrap transition-all ${
        active
          ? 'bg-gradient-to-r from-[#00ff88] to-[#00d9ff] text-black'
          : 'bg-[#1a1a2e] text-gray-400 hover:text-white hover:bg-[#1a1a2e]/80'
      }`}
      whileHover={{ scale: 1.02 }}
      whileTap={{ scale: 0.98 }}
    >
      <Icon className="w-5 h-5" />
      <span>{label}</span>
      <span className={`text-xs px-2 py-0.5 rounded-full ${
        active ? 'bg-black/20' : 'bg-white/10'
      }`}>
        {count}
      </span>
    </motion.button>
  );
}

// Product Card Component
function ProductCard({ 
  product, 
  onQuickView,
  onAddToWishlist
}: {
  product: Product;
  onQuickView: () => void;
  onAddToWishlist: () => void;
}) {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true });
  const [isWishlisted, setIsWishlisted] = useState(false);

  const categoryColors: Record<CategoryType, string> = {
    all: '#00ff88',
    cash: '#00ff88',
    gadgets: '#00d9ff',
    fees: '#8b5cf6',
    perks: '#ffd700',
  };

  const categoryIcons: Record<CategoryType, React.ElementType> = {
    all: Package,
    cash: Banknote,
    gadgets: Smartphone,
    fees: GraduationCap,
    perks: Sparkles,
  };

  const Icon = categoryIcons[product.category];
  const color = categoryColors[product.category];

  const handleWishlist = (e: React.MouseEvent) => {
    e.stopPropagation();
    setIsWishlisted(!isWishlisted);
    onAddToWishlist();
  };

  return (
    <motion.div
      ref={ref}
      initial={{ opacity: 0, y: 30 }}
      animate={isInView ? { opacity: 1, y: 0 } : {}}
      whileHover={{ y: -8 }}
      className="relative group cursor-pointer"
      onClick={onQuickView}
    >
      {/* Card glow */}
      <motion.div
        className="absolute -inset-1 rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-500"
        style={{ background: `linear-gradient(135deg, ${color}30, transparent, ${color}20)` }}
      />
      
      <div className="relative bg-[#141420]/90 backdrop-blur-xl border border-white/10 rounded-2xl overflow-hidden group-hover:border-white/20 transition-colors">
        {/* Image/Icon Area */}
        <div className="relative h-48 bg-gradient-to-br from-[#1a1a2e] to-[#141420] flex items-center justify-center overflow-hidden">
          {/* Background pattern */}
          <div className="absolute inset-0 opacity-20">
            {[...Array(6)].map((_, i) => (
              <motion.div
                key={i}
                className="absolute w-20 h-20 border border-white/10 rounded-lg"
                style={{
                  left: `${(i % 3) * 40}%`,
                  top: `${Math.floor(i / 3) * 50}%`,
                }}
                animate={{ rotate: 360 }}
                transition={{ duration: 20 + i * 5, repeat: Infinity, ease: 'linear' }}
              />
            ))}
          </div>
          
          {/* Main Icon */}
          <motion.div
            className="relative w-24 h-24 rounded-2xl flex items-center justify-center"
            style={{ backgroundColor: `${color}15` }}
            whileHover={{ scale: 1.1, rotate: 5 }}
          >
            <Icon className="w-12 h-12" style={{ color }} />
          </motion.div>

          {/* Badges */}
          {product.featured && (
            <motion.div
              className="absolute top-3 left-3 px-3 py-1 bg-[#ffd700] text-black text-xs font-bold rounded-full flex items-center gap-1"
              initial={{ x: -50 }}
              animate={{ x: 0 }}
            >
              <Crown className="w-3 h-3" />
              Featured
            </motion.div>
          )}
          
          {product.discount && (
            <motion.div
              className="absolute top-3 right-3 px-3 py-1 bg-red-500 text-white text-xs font-bold rounded-full"
              animate={{ scale: [1, 1.1, 1] }}
              transition={{ duration: 2, repeat: Infinity }}
            >
              -{product.discount}%
            </motion.div>
          )}

          {/* Wishlist Button */}
          <motion.button
            onClick={handleWishlist}
            className={`absolute bottom-3 right-3 w-10 h-10 rounded-full flex items-center justify-center transition-colors ${
              isWishlisted ? 'bg-red-500 text-white' : 'bg-black/50 text-white hover:bg-black/70'
            }`}
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.95 }}
          >
            <Heart className={`w-5 h-5 ${isWishlisted ? 'fill-current' : ''}`} />
          </motion.button>
        </div>

        {/* Content */}
        <div className="p-5">
          {/* Category Tag */}
          <div className="flex items-center gap-2 mb-2">
            <span 
              className="px-2 py-1 text-xs font-medium rounded-lg capitalize"
              style={{ backgroundColor: `${color}20`, color }}
            >
              {product.category}
            </span>
            {product.tags?.map((tag, i) => (
              <span key={i} className="px-2 py-1 text-xs bg-white/5 text-gray-400 rounded-lg">
                {tag}
              </span>
            ))}
          </div>

          {/* Title */}
          <h3 className="text-lg font-bold text-white mb-1 line-clamp-1">{product.name}</h3>
          <p className="text-gray-400 text-sm mb-3 line-clamp-2">{product.description}</p>

          {/* Rating */}
          <div className="flex items-center gap-2 mb-4">
            <div className="flex">
              {[...Array(5)].map((_, i) => (
                <Star
                  key={i}
                  className={`w-4 h-4 ${i < product.rating ? 'text-[#ffd700] fill-[#ffd700]' : 'text-gray-600'}`}
                />
              ))}
            </div>
            <span className="text-gray-400 text-sm">({product.reviews})</span>
          </div>

          {/* Price & Action */}
          <div className="flex items-center justify-between">
            <div>
              <div className="flex items-center gap-2">
                <Coins className="w-5 h-5 text-[#ffd700]" />
                <span className="text-2xl font-black text-white">{product.coins.toLocaleString()}</span>
              </div>
              {product.discount && (
                <span className="text-gray-500 text-sm line-through ml-7">
                  {Math.round(product.coins / (1 - product.discount / 100)).toLocaleString()}
                </span>
              )}
            </div>
            
            <motion.button
              className={`px-4 py-2 rounded-xl font-medium flex items-center gap-2 ${
                product.inStock
                  ? 'bg-[#00ff88] text-black hover:bg-[#00ff88]/90'
                  : 'bg-gray-600 text-gray-300 cursor-not-allowed'
              }`}
              whileHover={product.inStock ? { scale: 1.05 } : {}}
              whileTap={product.inStock ? { scale: 0.95 } : {}}
              disabled={!product.inStock}
            >
              {product.inStock ? (
                <>
                  <ShoppingCart className="w-4 h-4" />
                  Redeem
                </>
              ) : (
                'Out of Stock'
              )}
            </motion.button>
          </div>
        </div>
      </div>
    </motion.div>
  );
}

// Quick View Modal
function QuickViewModal({ 
  product, 
  isOpen, 
  onClose 
}: {
  product: Product | null;
  isOpen: boolean;
  onClose: () => void;
}) {
  const [quantity, setQuantity] = useState(1);

  if (!isOpen || !product) return null;

  const categoryColors: Record<CategoryType, string> = {
    all: '#00ff88',
    cash: '#00ff88',
    gadgets: '#00d9ff',
    fees: '#8b5cf6',
    perks: '#ffd700',
  };

  const color = categoryColors[product.category];

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm"
        onClick={onClose}
      >
        <motion.div
          initial={{ opacity: 0, scale: 0.9, y: 20 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.9, y: 20 }}
          className="w-full max-w-2xl bg-[#141420] border border-white/10 rounded-3xl overflow-hidden"
          onClick={(e) => e.stopPropagation()}
        >
          {/* Header */}
          <div className="relative h-48 bg-gradient-to-br from-[#1a1a2e] to-[#141420] flex items-center justify-center">
            <motion.div
              className="w-32 h-32 rounded-3xl flex items-center justify-center"
              style={{ backgroundColor: `${color}15` }}
              animate={{ rotate: [0, 5, -5, 0] }}
              transition={{ duration: 4, repeat: Infinity }}
            >
              {product.category === 'cash' && <Banknote className="w-16 h-16" style={{ color }} />}
              {product.category === 'gadgets' && <Smartphone className="w-16 h-16" style={{ color }} />}
              {product.category === 'fees' && <GraduationCap className="w-16 h-16" style={{ color }} />}
              {product.category === 'perks' && <Sparkles className="w-16 h-16" style={{ color }} />}
            </motion.div>
            
            <motion.button
              onClick={onClose}
              className="absolute top-4 right-4 w-10 h-10 rounded-full bg-black/50 flex items-center justify-center hover:bg-black/70 transition-colors"
              whileHover={{ scale: 1.1, rotate: 90 }}
            >
              <X className="w-5 h-5 text-white" />
            </motion.button>
          </div>

          {/* Content */}
          <div className="p-6">
            <div className="flex items-start justify-between mb-4">
              <div>
                <span 
                  className="inline-block px-3 py-1 text-sm font-medium rounded-lg capitalize mb-2"
                  style={{ backgroundColor: `${color}20`, color }}
                >
                  {product.category}
                </span>
                <h2 className="text-2xl font-black text-white">{product.name}</h2>
              </div>
              <div className="flex items-center gap-1">
                {[...Array(5)].map((_, i) => (
                  <Star
                    key={i}
                    className={`w-5 h-5 ${i < product.rating ? 'text-[#ffd700] fill-[#ffd700]' : 'text-gray-600'}`}
                  />
                ))}
                <span className="text-gray-400 ml-2">({product.reviews} reviews)</span>
              </div>
            </div>

            <p className="text-gray-400 mb-6">{product.description}</p>

            {/* Features */}
            <div className="grid grid-cols-2 gap-4 mb-6">
              <div className="flex items-center gap-3 p-3 bg-[#1a1a2e] rounded-xl">
                <Zap className="w-5 h-5 text-[#00ff88]" />
                <span className="text-gray-300">Instant Delivery</span>
              </div>
              <div className="flex items-center gap-3 p-3 bg-[#1a1a2e] rounded-xl">
                <CheckCircle className="w-5 h-5 text-[#00ff88]" />
                <span className="text-gray-300">Verified Product</span>
              </div>
            </div>

            {/* Quantity & Price */}
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 p-4 bg-[#1a1a2e] rounded-xl mb-6">
              <div>
                <p className="text-gray-400 text-sm mb-1">Total Cost</p>
                <div className="flex items-center gap-2">
                  <Coins className="w-6 h-6 text-[#ffd700]" />
                  <span className="text-3xl font-black text-white">
                    {(product.coins * quantity).toLocaleString()}
                  </span>
                </div>
              </div>
              
              {product.category !== 'cash' && (
                <div className="flex items-center gap-4">
                  <span className="text-gray-400">Quantity</span>
                  <div className="flex items-center gap-2 bg-[#141420] rounded-xl p-1">
                    <motion.button
                      onClick={() => setQuantity(Math.max(1, quantity - 1))}
                      className="w-10 h-10 rounded-lg flex items-center justify-center hover:bg-white/10 transition-colors"
                      whileTap={{ scale: 0.9 }}
                    >
                      <Minus className="w-4 h-4 text-white" />
                    </motion.button>
                    <span className="w-12 text-center text-white font-bold">{quantity}</span>
                    <motion.button
                      onClick={() => setQuantity(quantity + 1)}
                      className="w-10 h-10 rounded-lg flex items-center justify-center hover:bg-white/10 transition-colors"
                      whileTap={{ scale: 0.9 }}
                    >
                      <Plus className="w-4 h-4 text-white" />
                    </motion.button>
                  </div>
                </div>
              )}
            </div>

            {/* Actions */}
            <div className="flex gap-4">
              <motion.button
                className="flex-1 py-4 bg-gradient-to-r from-[#00ff88] to-[#00d9ff] text-black font-bold rounded-xl flex items-center justify-center gap-2"
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
              >
                <ShoppingCart className="w-5 h-5" />
                Redeem Now
              </motion.button>
              <motion.button
                className="px-6 py-4 border border-white/10 text-white font-medium rounded-xl flex items-center justify-center gap-2 hover:bg-white/5 transition-colors"
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
              >
                <Heart className="w-5 h-5" />
              </motion.button>
            </div>
          </div>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
}

// Stats Bar Component
function StatsBar({ userCoins }: { userCoins: number }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: -20 }}
      animate={{ opacity: 1, y: 0 }}
      className="bg-gradient-to-r from-[#141420] to-[#1a1a2e] border border-white/10 rounded-2xl p-4 mb-6"
    >
      <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
        <div className="flex items-center gap-4">
          <motion.div
            className="w-14 h-14 rounded-2xl bg-gradient-to-br from-[#ffd700] to-[#ff8c00] flex items-center justify-center"
            animate={{
              boxShadow: ['0 0 20px #ffd70030', '0 0 40px #ffd70050', '0 0 20px #ffd70030']
            }}
            transition={{ duration: 2, repeat: Infinity }}
          >
            <Coins className="w-7 h-7 text-black" />
          </motion.div>
          <div>
            <p className="text-gray-400 text-sm">Your Balance</p>
            <motion.p 
              className="text-2xl font-black text-[#ffd700]"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
            >
              {userCoins.toLocaleString()} <span className="text-lg text-gray-400">coins</span>
            </motion.p>
          </div>
        </div>

        <div className="flex items-center gap-6 text-sm">
          <div className="flex items-center gap-2">
            <TrendingUp className="w-5 h-5 text-[#00ff88]" />
            <span className="text-gray-400">+2,450 this week</span>
          </div>
          <div className="flex items-center gap-2">
            <Gift className="w-5 h-5 text-[#8b5cf6]" />
            <span className="text-gray-400">3 items redeemed</span>
          </div>
        </div>
      </div>
    </motion.div>
  );
}

// Featured Section
function FeaturedSection({ products, onQuickView }: { products: Product[]; onQuickView: (p: Product) => void }) {
  const featured = products.filter(p => p.featured).slice(0, 3);
  
  if (featured.length === 0) return null;

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="mb-8"
    >
      <div className="flex items-center gap-3 mb-4">
        <Crown className="w-6 h-6 text-[#ffd700]" />
        <h2 className="text-xl font-bold text-white">Featured Rewards</h2>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {featured.map((product, i) => (
          <motion.div
            key={product.id}
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: i * 0.1 }}
            whileHover={{ scale: 1.02 }}
            onClick={() => onQuickView(product)}
            className="relative overflow-hidden rounded-2xl cursor-pointer group"
          >
            <div className="absolute inset-0 bg-gradient-to-br from-[#ffd700]/20 to-[#ff8c00]/10" />
            <div className="relative p-6 border border-[#ffd700]/30 rounded-2xl">
              <div className="flex items-center gap-4">
                <div className="w-16 h-16 rounded-xl bg-[#ffd700]/20 flex items-center justify-center">
                  {product.category === 'gadgets' && <Smartphone className="w-8 h-8 text-[#ffd700]" />}
                  {product.category === 'cash' && <Banknote className="w-8 h-8 text-[#ffd700]" />}
                  {product.category === 'fees' && <GraduationCap className="w-8 h-8 text-[#ffd700]" />}
                  {product.category === 'perks' && <Sparkles className="w-8 h-8 text-[#ffd700]" />}
                </div>
                <div className="flex-1">
                  <h3 className="font-bold text-white">{product.name}</h3>
                  <div className="flex items-center gap-2 mt-1">
                    <Coins className="w-4 h-4 text-[#ffd700]" />
                    <span className="text-[#ffd700] font-bold">{product.coins.toLocaleString()}</span>
                  </div>
                </div>
                <ChevronRight className="w-5 h-5 text-[#ffd700] group-hover:translate-x-1 transition-transform" />
              </div>
            </div>
          </motion.div>
        ))}
      </div>
    </motion.div>
  );
}

// Main Component
export function GreedStore() {
  const [activeCategory, setActiveCategory] = useState<CategoryType>('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);
  const [showModal, setShowModal] = useState(false);

  const userCoins = 12450;

  const products: Product[] = [
    // Cash Category
    {
      id: 'cash-1',
      name: '₹100 Cash Withdrawal',
      description: 'Withdraw ₹100 directly to your bank account or UPI. Instant processing.',
      coins: 10000,
      category: 'cash',
      image: '',
      rating: 5,
      reviews: 234,
      inStock: true,
      tags: ['Instant']
    },
    {
      id: 'cash-2',
      name: '₹500 Cash Withdrawal',
      description: 'Withdraw ₹500 directly to your bank account. Premium rate.',
      coins: 45000,
      category: 'cash',
      image: '',
      rating: 5,
      reviews: 189,
      inStock: true,
      featured: true,
      discount: 10,
      tags: ['Best Value']
    },
    {
      id: 'cash-3',
      name: '₹1000 Cash Withdrawal',
      description: 'Withdraw ₹1000 to your bank. VIP members get priority processing.',
      coins: 85000,
      category: 'cash',
      image: '',
      rating: 5,
      reviews: 98,
      inStock: true,
      tags: ['VIP']
    },
    // Gadgets Category
    {
      id: 'gadget-1',
      name: 'Wireless Earbuds Pro',
      description: 'Premium wireless earbuds with active noise cancellation and 24hr battery.',
      coins: 25000,
      category: 'gadgets',
      image: '',
      rating: 4,
      reviews: 156,
      inStock: true,
      featured: true,
      tags: ['Hot']
    },
    {
      id: 'gadget-2',
      name: 'Smart Fitness Band',
      description: 'Track your fitness with heart rate, sleep, and activity monitoring.',
      coins: 15000,
      category: 'gadgets',
      image: '',
      rating: 4,
      reviews: 312,
      inStock: true,
      tags: ['Trending']
    },
    {
      id: 'gadget-3',
      name: 'Mechanical Gaming Keyboard',
      description: 'RGB backlit mechanical keyboard with customizable keys for gamers.',
      coins: 35000,
      category: 'gadgets',
      image: '',
      rating: 5,
      reviews: 89,
      inStock: false
    },
    {
      id: 'gadget-4',
      name: 'Power Bank 20000mAh',
      description: 'Fast charging power bank with dual USB-C ports and LED display.',
      coins: 12000,
      category: 'gadgets',
      image: '',
      rating: 4,
      reviews: 245,
      inStock: true
    },
    // Fees Category
    {
      id: 'fee-1',
      name: 'Event Registration Waiver',
      description: 'Waive registration fee for any single event on the platform.',
      coins: 5000,
      category: 'fees',
      image: '',
      rating: 5,
      reviews: 567,
      inStock: true,
      tags: ['Popular']
    },
    {
      id: 'fee-2',
      name: 'Premium Subscription (1 Month)',
      description: 'Unlock all premium features for one month. No auto-renewal.',
      coins: 20000,
      category: 'fees',
      image: '',
      rating: 5,
      reviews: 423,
      inStock: true,
      featured: true,
      tags: ['Best Deal']
    },
    {
      id: 'fee-3',
      name: 'Challenge Entry Fee Waiver',
      description: 'Enter any paid challenge without spending coins. One-time use.',
      coins: 8000,
      category: 'fees',
      image: '',
      rating: 4,
      reviews: 198,
      inStock: true
    },
    // Perks Category
    {
      id: 'perk-1',
      name: 'VIP Badge',
      description: 'Show off your status with an exclusive VIP badge on your profile.',
      coins: 15000,
      category: 'perks',
      image: '',
      rating: 5,
      reviews: 789,
      inStock: true,
      tags: ['Exclusive']
    },
    {
      id: 'perk-2',
      name: 'Custom Profile Theme',
      description: 'Unlock exclusive profile themes and customization options.',
      coins: 8000,
      category: 'perks',
      image: '',
      rating: 4,
      reviews: 345,
      inStock: true
    },
    {
      id: 'perk-3',
      name: 'Priority Support Access',
      description: '24/7 priority support for 3 months. Skip the queue.',
      coins: 12000,
      category: 'perks',
      image: '',
      rating: 5,
      reviews: 167,
      inStock: true,
      tags: ['Premium']
    },
    {
      id: 'perk-4',
      name: '2x XP Boost (7 Days)',
      description: 'Double your XP earnings for a full week. Stack your levels faster.',
      coins: 10000,
      category: 'perks',
      image: '',
      rating: 5,
      reviews: 512,
      inStock: true,
      discount: 15,
      tags: ['Limited']
    },
  ];

  const categories: { type: CategoryType; icon: React.ElementType; label: string }[] = [
    { type: 'all', icon: Store, label: 'All Rewards' },
    { type: 'cash', icon: Banknote, label: 'Cash' },
    { type: 'gadgets', icon: Smartphone, label: 'Gadgets' },
    { type: 'fees', icon: GraduationCap, label: 'Fee Waivers' },
    { type: 'perks', icon: Sparkles, label: 'Perks' },
  ];

  const filteredProducts = products.filter(p => {
    const matchesCategory = activeCategory === 'all' || p.category === activeCategory;
    const matchesSearch = p.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         p.description.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesCategory && matchesSearch;
  });

  const getCategoryCount = (category: CategoryType) => {
    if (category === 'all') return products.length;
    return products.filter(p => p.category === category).length;
  };

  const handleQuickView = (product: Product) => {
    setSelectedProduct(product);
    setShowModal(true);
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4"
      >
        <div>
          <div className="flex items-center gap-3 mb-2">
            <Store className="w-8 h-8 text-[#00ff88]" />
            <h1 className="text-3xl font-black text-white">GreedStore</h1>
          </div>
          <p className="text-gray-400">Transform your coins into real rewards</p>
        </div>

        {/* Search */}
        <div className="relative w-full lg:w-80">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
          <input
            type="text"
            placeholder="Search rewards..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-12 pr-4 py-3 bg-[#141420] border border-white/10 rounded-xl text-white placeholder-gray-500 focus:border-[#00ff88]/50 focus:outline-none"
          />
        </div>
      </motion.div>

      {/* Stats Bar */}
      <StatsBar userCoins={userCoins} />

      {/* Categories */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.1 }}
        className="flex gap-3 overflow-x-auto pb-2 scrollbar-hide"
      >
        {categories.map((cat) => (
          <CategoryTab
            key={cat.type}
            icon={cat.icon}
            label={cat.label}
            active={activeCategory === cat.type}
            onClick={() => setActiveCategory(cat.type)}
            count={getCategoryCount(cat.type)}
          />
        ))}
      </motion.div>

      {/* Featured Section */}
      {activeCategory === 'all' && (
        <FeaturedSection products={products} onQuickView={handleQuickView} />
      )}

      {/* Products Grid */}
      <div>
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-xl font-bold text-white">
            {activeCategory === 'all' ? 'All Rewards' : categories.find(c => c.type === activeCategory)?.label}
          </h2>
          <span className="text-gray-400 text-sm">{filteredProducts.length} items</span>
        </div>

        {filteredProducts.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {filteredProducts.map((product) => (
              <ProductCard
                key={product.id}
                product={product}
                onQuickView={() => handleQuickView(product)}
                onAddToWishlist={() => {}}
              />
            ))}
          </div>
        ) : (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="text-center py-16 bg-[#141420]/50 rounded-2xl"
          >
            <Package className="w-16 h-16 text-gray-600 mx-auto mb-4" />
            <h3 className="text-xl font-bold text-white mb-2">No rewards found</h3>
            <p className="text-gray-400">Try adjusting your search or filter</p>
          </motion.div>
        )}
      </div>

      {/* Quick View Modal */}
      <QuickViewModal
        product={selectedProduct}
        isOpen={showModal}
        onClose={() => setShowModal(false)}
      />
    </div>
  );
}
