import { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  QrCode, 
  User, 
  Coins, 
  Shield, 
  Clock, 
  MapPin,
  CheckCircle,
  Copy,
  Download,
  Share2,
  RefreshCw,
  Sparkles,
  AlertCircle,
  Smartphone,
  Store
} from 'lucide-react';

// QR Code Placeholder (In production, use a QR library)
function QRCodeDisplay({ value, size = 200 }: { value: string; size?: number }) {
  // Simulated QR pattern - In production use 'qrcode.react' or similar
  const gridSize = 21;
  const cellSize = size / gridSize;
  
  // Generate deterministic pattern based on value hash
  const pattern = Array.from({ length: gridSize * gridSize }, (_, i) => {
    const hash = value.split('').reduce((acc, char, idx) => acc + char.charCodeAt(0) * (idx + i + 1), 0);
    return hash % 3 !== 0;
  });

  return (
    <div className="relative">
      {/* Animated border */}
      <motion.div
        className="absolute -inset-2 rounded-2xl"
        style={{
          background: 'linear-gradient(90deg, #00ff88, #00d9ff, #8b5cf6, #00ff88)',
          backgroundSize: '300% 100%',
        }}
        animate={{
          backgroundPosition: ['0% 50%', '100% 50%', '0% 50%'],
        }}
        transition={{ duration: 4, repeat: Infinity, ease: 'linear' }}
      />
      
      <div className="relative bg-white p-4 rounded-xl">
        <svg width={size} height={size} viewBox={`0 0 ${size} ${size}`}>
          {pattern.map((filled, i) => {
            const x = (i % gridSize) * cellSize;
            const y = Math.floor(i / gridSize) * cellSize;
            
            // Skip corners for position markers
            const isCorner = (i % gridSize < 7 && Math.floor(i / gridSize) < 7) ||
                           (i % gridSize > 13 && Math.floor(i / gridSize) < 7) ||
                           (i % gridSize < 7 && Math.floor(i / gridSize) > 13);
            
            if (isCorner) return null;
            
            return filled ? (
              <rect
                key={i}
                x={x}
                y={y}
                width={cellSize}
                height={cellSize}
                fill="#141420"
              />
            ) : null;
          })}
          
          {/* Position markers */}
          {[[0, 0], [size - 7 * cellSize, 0], [0, size - 7 * cellSize]].map(([x, y], i) => (
            <g key={i}>
              <rect x={x} y={y} width={7 * cellSize} height={7 * cellSize} fill="#141420" />
              <rect x={x + cellSize} y={y + cellSize} width={5 * cellSize} height={5 * cellSize} fill="white" />
              <rect x={x + 2 * cellSize} y={y + 2 * cellSize} width={3 * cellSize} height={3 * cellSize} fill="#00ff88" />
            </g>
          ))}
        </svg>
        
        {/* Center logo */}
        <div className="absolute inset-0 flex items-center justify-center">
          <div className="w-12 h-12 bg-[#141420] rounded-lg flex items-center justify-center">
            <Coins className="w-6 h-6 text-[#ffd700]" />
          </div>
        </div>
      </div>
    </div>
  );
}

// Ticket Info Row
function InfoRow({ icon: Icon, label, value, color = '#00ff88' }: {
  icon: React.ElementType;
  label: string;
  value: string;
  color?: string;
}) {
  return (
    <div className="flex items-center justify-between py-3 border-b border-white/10 last:border-0">
      <div className="flex items-center gap-3">
        <Icon className="w-5 h-5" style={{ color }} />
        <span className="text-gray-400">{label}</span>
      </div>
      <span className="text-white font-medium">{value}</span>
    </div>
  );
}

// Animated Countdown Timer
function CountdownTimer({ expiresAt }: { expiresAt: Date }) {
  const [timeLeft, setTimeLeft] = useState({ minutes: 0, seconds: 0 });

  useEffect(() => {
    const timer = setInterval(() => {
      const now = new Date();
      const diff = expiresAt.getTime() - now.getTime();
      
      if (diff <= 0) {
        setTimeLeft({ minutes: 0, seconds: 0 });
        clearInterval(timer);
      } else {
        setTimeLeft({
          minutes: Math.floor(diff / 60000),
          seconds: Math.floor((diff % 60000) / 1000),
        });
      }
    }, 1000);

    return () => clearInterval(timer);
  }, [expiresAt]);

  const isLow = timeLeft.minutes < 5;

  return (
    <motion.div
      className={`flex items-center gap-2 px-4 py-2 rounded-xl ${
        isLow ? 'bg-red-500/20 text-red-400' : 'bg-[#00ff88]/20 text-[#00ff88]'
      }`}
      animate={isLow ? { scale: [1, 1.02, 1] } : {}}
      transition={{ duration: 1, repeat: isLow ? Infinity : 0 }}
    >
      <Clock className="w-5 h-5" />
      <span className="font-mono font-bold text-lg">
        {String(timeLeft.minutes).padStart(2, '0')}:{String(timeLeft.seconds).padStart(2, '0')}
      </span>
    </motion.div>
  );
}

// Main Component
export function GreedTicket() {
  const [ticketGenerated, setTicketGenerated] = useState(false);
  const [isGenerating, setIsGenerating] = useState(false);
  const [copied, setCopied] = useState(false);
  const ticketRef = useRef<HTMLDivElement>(null);

  // Mock user and ticket data
  const userData = {
    username: 'GreedMaster',
    fullName: 'John Doe',
    userId: 'GH-2024-78392',
    coinBalance: 12450,
    level: 42,
    verificationStatus: 'verified'
  };

  // Generate ticket data only once when component mounts
  const [ticketData] = useState(() => {
    const now = Date.now();
    const randomStr = Math.random().toString(36).substring(2, 10).toUpperCase();
    return {
      ticketId: 'TKT-' + randomStr,
      purpose: 'In-Store Redemption',
      amount: 5000,
      itemCategory: 'Gadgets',
      generatedAt: new Date(),
      expiresAt: new Date(now + 30 * 60 * 1000), // 30 minutes
      qrValue: `greed://ticket/${userData.userId}/${now}`
    };
  });

  const handleGenerate = () => {
    setIsGenerating(true);
    // Simulate generation delay
    setTimeout(() => {
      setIsGenerating(false);
      setTicketGenerated(true);
    }, 2000);
  };

  const handleCopy = () => {
    navigator.clipboard.writeText(ticketData.ticketId);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleRefresh = () => {
    setTicketGenerated(false);
    setTimeout(() => handleGenerate(), 500);
  };

  return (
    <div className="space-y-8">
      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
      >
        <div className="flex items-center gap-3 mb-2">
          <QrCode className="w-8 h-8 text-[#00ff88]" />
          <h1 className="text-3xl font-black text-white">GreedTicket</h1>
        </div>
        <p className="text-gray-400">
          Generate a secure verification ticket for in-store redemption
        </p>
      </motion.div>

      {/* Main Content */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Left: User Info & Actions */}
        <div className="space-y-6">
          {/* User Card */}
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            className="bg-[#141420]/80 backdrop-blur-xl border border-white/10 rounded-2xl p-6"
          >
            <div className="flex items-center gap-4 mb-6">
              <motion.div
                className="w-16 h-16 rounded-2xl bg-gradient-to-br from-[#00ff88] to-[#00d9ff] flex items-center justify-center"
                animate={{
                  boxShadow: ['0 0 20px #00ff8830', '0 0 40px #00ff8850', '0 0 20px #00ff8830']
                }}
                transition={{ duration: 2, repeat: Infinity }}
              >
                <User className="w-8 h-8 text-black" />
              </motion.div>
              <div className="flex-1">
                <h3 className="text-xl font-bold text-white">{userData.username}</h3>
                <p className="text-gray-400 text-sm">{userData.fullName}</p>
                <div className="flex items-center gap-2 mt-1">
                  <span className="px-2 py-0.5 bg-[#00ff88]/20 text-[#00ff88] text-xs font-bold rounded-full flex items-center gap-1">
                    <CheckCircle className="w-3 h-3" />
                    Verified
                  </span>
                  <span className="px-2 py-0.5 bg-[#8b5cf6]/20 text-[#8b5cf6] text-xs font-bold rounded-full">
                    Level {userData.level}
                  </span>
                </div>
              </div>
            </div>

            <div className="space-y-1">
              <InfoRow icon={User} label="User ID" value={userData.userId} />
              <InfoRow icon={Coins} label="Coin Balance" value={userData.coinBalance.toLocaleString()} color="#ffd700" />
              <InfoRow icon={Shield} label="Account Status" value="Active" />
            </div>
          </motion.div>

          {/* Generate Ticket Section */}
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.1 }}
            className="bg-[#141420]/80 backdrop-blur-xl border border-white/10 rounded-2xl p-6"
          >
            <h3 className="text-lg font-bold text-white mb-4 flex items-center gap-2">
              <Store className="w-5 h-5 text-[#00d9ff]" />
              Redemption Details
            </h3>

            <div className="space-y-4 mb-6">
              <div>
                <label className="text-gray-400 text-sm mb-2 block">Purpose</label>
                <select className="w-full px-4 py-3 bg-[#1a1a2e] border border-white/10 rounded-xl text-white focus:border-[#00ff88]/50 focus:outline-none">
                  <option>In-Store Gadget Redemption</option>
                  <option>Cash Pickup</option>
                  <option>Merchandise Collection</option>
                  <option>VIP Lounge Access</option>
                </select>
              </div>

              <div>
                <label className="text-gray-400 text-sm mb-2 block">Coins to Redeem</label>
                <div className="relative">
                  <input
                    type="number"
                    defaultValue={5000}
                    className="w-full px-4 py-3 bg-[#1a1a2e] border border-white/10 rounded-xl text-white focus:border-[#00ff88]/50 focus:outline-none pr-20"
                  />
                  <span className="absolute right-4 top-1/2 -translate-y-1/2 text-[#ffd700] font-bold flex items-center gap-1">
                    <Coins className="w-4 h-4" />
                    coins
                  </span>
                </div>
              </div>

              <div>
                <label className="text-gray-400 text-sm mb-2 block">Preferred Location</label>
                <select className="w-full px-4 py-3 bg-[#1a1a2e] border border-white/10 rounded-xl text-white focus:border-[#00ff88]/50 focus:outline-none">
                  <option>GreedStore - Mumbai Central</option>
                  <option>GreedStore - Delhi NCR</option>
                  <option>GreedStore - Bangalore Tech Park</option>
                  <option>GreedStore - Pune IT Hub</option>
                </select>
              </div>
            </div>

            <motion.button
              onClick={handleGenerate}
              disabled={isGenerating || ticketGenerated}
              className={`w-full py-4 rounded-xl font-bold flex items-center justify-center gap-2 ${
                ticketGenerated
                  ? 'bg-[#00ff88]/20 text-[#00ff88] cursor-default'
                  : 'bg-gradient-to-r from-[#00ff88] to-[#00d9ff] text-black hover:opacity-90'
              }`}
              whileHover={!ticketGenerated ? { scale: 1.02 } : {}}
              whileTap={!ticketGenerated ? { scale: 0.98 } : {}}
            >
              {isGenerating ? (
                <>
                  <motion.div
                    animate={{ rotate: 360 }}
                    transition={{ duration: 1, repeat: Infinity, ease: 'linear' }}
                  >
                    <RefreshCw className="w-5 h-5" />
                  </motion.div>
                  Generating Secure Ticket...
                </>
              ) : ticketGenerated ? (
                <>
                  <CheckCircle className="w-5 h-5" />
                  Ticket Generated Successfully
                </>
              ) : (
                <>
                  <QrCode className="w-5 h-5" />
                  Generate GreedTicket
                </>
              )}
            </motion.button>
          </motion.div>

          {/* Instructions */}
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.2 }}
            className="bg-[#1a1a2e]/50 border border-white/5 rounded-xl p-4"
          >
            <div className="flex items-start gap-3">
              <AlertCircle className="w-5 h-5 text-[#ffd700] shrink-0 mt-0.5" />
              <div className="text-sm text-gray-400">
                <p className="font-medium text-[#ffd700] mb-1">Important Instructions</p>
                <ul className="space-y-1 list-disc list-inside">
                  <li>Ticket is valid for 30 minutes after generation</li>
                  <li>Present QR code at the store counter</li>
                  <li>Keep your User ID ready for verification</li>
                  <li>Coins will be deducted after successful redemption</li>
                </ul>
              </div>
            </div>
          </motion.div>
        </div>

        {/* Right: Ticket Display */}
        <div>
          <AnimatePresence mode="wait">
            {!ticketGenerated ? (
              <motion.div
                key="placeholder"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="bg-[#141420]/80 backdrop-blur-xl border border-white/10 rounded-2xl p-8 h-full flex flex-col items-center justify-center min-h-[500px]"
              >
                <motion.div
                  className="w-32 h-32 rounded-3xl bg-[#1a1a2e] flex items-center justify-center mb-6"
                  animate={{ 
                    scale: [1, 1.05, 1],
                    borderColor: ['rgba(0,255,136,0.2)', 'rgba(0,255,136,0.5)', 'rgba(0,255,136,0.2)']
                  }}
                  transition={{ duration: 2, repeat: Infinity }}
                  style={{ border: '2px dashed' }}
                >
                  <QrCode className="w-16 h-16 text-gray-600" />
                </motion.div>
                <h3 className="text-xl font-bold text-white mb-2">No Active Ticket</h3>
                <p className="text-gray-400 text-center max-w-xs">
                  Generate a GreedTicket to redeem your coins at physical store locations
                </p>
              </motion.div>
            ) : (
              <motion.div
                key="ticket"
                ref={ticketRef}
                initial={{ opacity: 0, scale: 0.9, rotateY: -15 }}
                animate={{ opacity: 1, scale: 1, rotateY: 0 }}
                exit={{ opacity: 0, scale: 0.9 }}
                className="relative"
              >
                {/* Ticket Card */}
                <div className="bg-gradient-to-br from-[#141420] to-[#1a1a2e] border border-white/20 rounded-3xl overflow-hidden">
                  {/* Ticket Header */}
                  <div className="relative bg-gradient-to-r from-[#00ff88]/20 via-[#00d9ff]/20 to-[#8b5cf6]/20 p-6">
                    <motion.div
                      className="absolute inset-0"
                      animate={{
                        background: [
                          'linear-gradient(90deg, rgba(0,255,136,0.1) 0%, transparent 50%)',
                          'linear-gradient(90deg, transparent 0%, rgba(0,217,255,0.1) 50%, transparent 100%)',
                          'linear-gradient(90deg, transparent 50%, rgba(139,92,246,0.1) 100%)',
                          'linear-gradient(90deg, rgba(0,255,136,0.1) 0%, transparent 50%)',
                        ]
                      }}
                      transition={{ duration: 4, repeat: Infinity }}
                    />
                    
                    <div className="relative flex items-center justify-between">
                      <div className="flex items-center gap-3">
                        <Sparkles className="w-6 h-6 text-[#00ff88]" />
                        <div>
                          <h3 className="text-xl font-black text-white">GreedTicket</h3>
                          <p className="text-gray-400 text-sm">Secure Verification Pass</p>
                        </div>
                      </div>
                      <CountdownTimer expiresAt={ticketData.expiresAt} />
                    </div>
                  </div>

                  {/* QR Section */}
                  <div className="p-6 flex flex-col items-center">
                    <QRCodeDisplay value={ticketData.qrValue} size={180} />
                    
                    <div className="mt-4 flex items-center gap-2">
                      <span className="font-mono text-lg text-white font-bold">{ticketData.ticketId}</span>
                      <motion.button
                        onClick={handleCopy}
                        className="p-2 text-gray-400 hover:text-[#00ff88] transition-colors"
                        whileHover={{ scale: 1.1 }}
                        whileTap={{ scale: 0.95 }}
                      >
                        {copied ? <CheckCircle className="w-5 h-5 text-[#00ff88]" /> : <Copy className="w-5 h-5" />}
                      </motion.button>
                    </div>
                    
                    <p className="text-gray-500 text-sm mt-1">Scan at store counter</p>
                  </div>

                  {/* Divider with holes */}
                  <div className="relative px-6">
                    <div className="border-t-2 border-dashed border-white/10" />
                    <div className="absolute -left-4 top-1/2 -translate-y-1/2 w-8 h-8 bg-[#0a0a0f] rounded-full" />
                    <div className="absolute -right-4 top-1/2 -translate-y-1/2 w-8 h-8 bg-[#0a0a0f] rounded-full" />
                  </div>

                  {/* Ticket Details */}
                  <div className="p-6 space-y-3">
                    <div className="flex justify-between items-center">
                      <span className="text-gray-400">User</span>
                      <span className="text-white font-medium">{userData.username}</span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-gray-400">User ID</span>
                      <span className="text-white font-medium">{userData.userId}</span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-gray-400">Purpose</span>
                      <span className="text-[#00d9ff] font-medium">{ticketData.purpose}</span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-gray-400">Coins Reserved</span>
                      <span className="text-[#ffd700] font-bold flex items-center gap-1">
                        <Coins className="w-4 h-4" />
                        {ticketData.amount.toLocaleString()}
                      </span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-gray-400">Location</span>
                      <span className="text-white font-medium flex items-center gap-1">
                        <MapPin className="w-4 h-4 text-[#8b5cf6]" />
                        Mumbai Central
                      </span>
                    </div>
                  </div>

                  {/* Footer */}
                  <div className="p-6 pt-0 flex gap-3">
                    <motion.button
                      onClick={handleRefresh}
                      className="flex-1 py-3 border border-white/10 text-white font-medium rounded-xl flex items-center justify-center gap-2 hover:bg-white/5 transition-colors"
                      whileHover={{ scale: 1.02 }}
                      whileTap={{ scale: 0.98 }}
                    >
                      <RefreshCw className="w-5 h-5" />
                      Regenerate
                    </motion.button>
                    <motion.button
                      className="flex-1 py-3 bg-[#00ff88] text-black font-bold rounded-xl flex items-center justify-center gap-2"
                      whileHover={{ scale: 1.02 }}
                      whileTap={{ scale: 0.98 }}
                    >
                      <Smartphone className="w-5 h-5" />
                      Save to Phone
                    </motion.button>
                  </div>
                </div>

                {/* Share Options */}
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.3 }}
                  className="mt-4 flex justify-center gap-4"
                >
                  <motion.button
                    className="flex items-center gap-2 px-4 py-2 bg-[#1a1a2e] text-gray-400 rounded-lg hover:text-white transition-colors"
                    whileHover={{ scale: 1.05 }}
                  >
                    <Download className="w-4 h-4" />
                    Download
                  </motion.button>
                  <motion.button
                    className="flex items-center gap-2 px-4 py-2 bg-[#1a1a2e] text-gray-400 rounded-lg hover:text-white transition-colors"
                    whileHover={{ scale: 1.05 }}
                  >
                    <Share2 className="w-4 h-4" />
                    Share
                  </motion.button>
                </motion.div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>
    </div>
  );
}
