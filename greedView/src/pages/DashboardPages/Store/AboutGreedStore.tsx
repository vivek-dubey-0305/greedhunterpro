import { useRef } from 'react';
import { motion, useInView } from 'framer-motion';
import { 
  Store, 
  Sparkles, 
  Coins, 
  Gift, 
  MapPin, 
  Smartphone,
  CreditCard,
  Zap,
  ArrowRight,
  Trophy,
  ShoppingBag,
  Crown,
  Star,
  CheckCircle,
  Globe
} from 'lucide-react';
import { Link } from 'react-router-dom';

// Animated Feature Card
function FeatureCard({ 
  icon: Icon, 
  title, 
  description, 
  color, 
  delay 
}: {
  icon: React.ElementType;
  title: string;
  description: string;
  color: string;
  delay: number;
}) {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true });

  return (
    <motion.div
      ref={ref}
      initial={{ opacity: 0, y: 30 }}
      animate={isInView ? { opacity: 1, y: 0 } : {}}
      transition={{ duration: 0.6, delay }}
      whileHover={{ y: -8, scale: 1.02 }}
      className="relative group"
    >
      <div className="absolute inset-0 bg-gradient-to-br from-white/5 to-transparent rounded-2xl blur-xl opacity-0 group-hover:opacity-100 transition-opacity" />
      <div className="relative bg-[#141420]/80 backdrop-blur-xl border border-white/10 rounded-2xl p-6 overflow-hidden h-full">
        {/* Glow effect */}
        <motion.div
          className="absolute -top-20 -right-20 w-40 h-40 rounded-full opacity-0 group-hover:opacity-100 transition-opacity duration-500"
          style={{ background: `radial-gradient(circle, ${color}30, transparent 70%)` }}
        />
        
        <div className="relative z-10">
          <motion.div 
            className="w-14 h-14 rounded-2xl flex items-center justify-center mb-4"
            style={{ backgroundColor: `${color}15` }}
            whileHover={{ rotate: [0, -10, 10, 0] }}
            transition={{ duration: 0.5 }}
          >
            <Icon className="w-7 h-7" style={{ color }} />
          </motion.div>
          <h3 className="text-xl font-bold text-white mb-2">{title}</h3>
          <p className="text-gray-400 text-sm leading-relaxed">{description}</p>
        </div>
      </div>
    </motion.div>
  );
}

// Journey Step Component
function JourneyStep({ 
  step, 
  title, 
  description, 
  icon: Icon, 
  isLast = false,
  delay
}: {
  step: number;
  title: string;
  description: string;
  icon: React.ElementType;
  isLast?: boolean;
  delay: number;
}) {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true });

  return (
    <motion.div
      ref={ref}
      initial={{ opacity: 0, x: -30 }}
      animate={isInView ? { opacity: 1, x: 0 } : {}}
      transition={{ duration: 0.6, delay }}
      className="relative flex gap-6"
    >
      {/* Timeline line */}
      {!isLast && (
        <div className="absolute left-7 top-16 w-0.5 h-full bg-gradient-to-b from-[#00ff88]/50 to-transparent" />
      )}
      
      {/* Step indicator */}
      <motion.div
        className="relative z-10 w-14 h-14 rounded-2xl bg-gradient-to-br from-[#00ff88] to-[#00d9ff] flex items-center justify-center shrink-0"
        animate={isInView ? { 
          boxShadow: ['0 0 0px #00ff8800', '0 0 30px #00ff8840', '0 0 0px #00ff8800']
        } : {}}
        transition={{ duration: 2, repeat: Infinity, delay: delay + 0.5 }}
      >
        <span className="text-xl font-black text-black">{step}</span>
      </motion.div>
      
      {/* Content */}
      <div className="flex-1 pb-8">
        <div className="flex items-center gap-3 mb-2">
          <Icon className="w-5 h-5 text-[#00ff88]" />
          <h4 className="text-lg font-bold text-white">{title}</h4>
        </div>
        <p className="text-gray-400 text-sm leading-relaxed">{description}</p>
      </div>
    </motion.div>
  );
}

// Main Component
export function AboutGreedStore() {
  const heroRef = useRef(null);
  const heroInView = useInView(heroRef, { once: true });

  return (
    <div className="space-y-10">
      {/* Hero Section */}
      <motion.div
        ref={heroRef}
        initial={{ opacity: 0 }}
        animate={heroInView ? { opacity: 1 } : {}}
        className="relative overflow-hidden rounded-3xl"
      >
        {/* Animated Background */}
        <div className="absolute inset-0 bg-gradient-to-br from-[#00ff88]/20 via-[#141420] to-[#8b5cf6]/20">
          <motion.div
            className="absolute inset-0"
            animate={{
              background: [
                'radial-gradient(circle at 20% 30%, rgba(0,255,136,0.15) 0%, transparent 50%)',
                'radial-gradient(circle at 80% 70%, rgba(139,92,246,0.15) 0%, transparent 50%)',
                'radial-gradient(circle at 20% 30%, rgba(0,255,136,0.15) 0%, transparent 50%)',
              ]
            }}
            transition={{ duration: 8, repeat: Infinity }}
          />
          {/* Floating particles */}
          {[...Array(15)].map((_, i) => (
            <motion.div
              key={i}
              className="absolute w-2 h-2 rounded-full bg-[#00ff88]/30"
              style={{
                left: `${(i * 7) % 100}%`,
                top: `${(i * 11) % 100}%`,
              }}
              animate={{
                y: [-20, 20, -20],
                opacity: [0.3, 0.7, 0.3],
                scale: [1, 1.5, 1],
              }}
              transition={{
                duration: 4 + (i % 3),
                repeat: Infinity,
                delay: i * 0.2,
              }}
            />
          ))}
        </div>

        <div className="relative z-10 p-8 md:p-12">
          <div className="flex flex-col lg:flex-row items-center gap-8">
            <div className="flex-1">
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={heroInView ? { opacity: 1, y: 0 } : {}}
                transition={{ delay: 0.2 }}
                className="flex items-center gap-3 mb-4"
              >
                <Store className="w-8 h-8 text-[#00ff88]" />
                <span className="px-3 py-1 bg-[#00ff88]/20 text-[#00ff88] text-sm font-bold rounded-full">
                  GREED STORE
                </span>
              </motion.div>
              
              <motion.h1
                initial={{ opacity: 0, y: 20 }}
                animate={heroInView ? { opacity: 1, y: 0 } : {}}
                transition={{ delay: 0.3 }}
                className="text-4xl md:text-5xl font-black text-white mb-4"
              >
                Where Your{' '}
                <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#00ff88] to-[#00d9ff]">
                  Greed Pays Off
                </span>
              </motion.h1>
              
              <motion.p
                initial={{ opacity: 0, y: 20 }}
                animate={heroInView ? { opacity: 1, y: 0 } : {}}
                transition={{ delay: 0.4 }}
                className="text-gray-400 text-lg mb-6 max-w-xl"
              >
                Transform your hard-earned GreedCoins into real-world rewards. From cash withdrawals 
                to premium gadgets, exclusive perks, and fee waivers — your dedication deserves tangible rewards.
              </motion.p>

              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={heroInView ? { opacity: 1, y: 0 } : {}}
                transition={{ delay: 0.5 }}
                className="flex flex-wrap gap-4"
              >
                <Link to="/dashboard/store">
                  <motion.button
                    className="flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-[#00ff88] to-[#00d9ff] text-black font-bold rounded-xl"
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.98 }}
                  >
                    <ShoppingBag className="w-5 h-5" />
                    Explore Store
                    <ArrowRight className="w-5 h-5" />
                  </motion.button>
                </Link>
                <Link to="/dashboard/store/policy">
                  <motion.button
                    className="flex items-center gap-2 px-6 py-3 border border-white/20 text-white font-medium rounded-xl hover:bg-white/5 transition-colors"
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                  >
                    View Policies
                  </motion.button>
                </Link>
              </motion.div>
            </div>

            {/* Hero Graphic */}
            <motion.div
              initial={{ opacity: 0, scale: 0.8 }}
              animate={heroInView ? { opacity: 1, scale: 1 } : {}}
              transition={{ delay: 0.4, duration: 0.6 }}
              className="relative"
            >
              <motion.div
                className="w-48 h-48 md:w-64 md:h-64 rounded-3xl bg-gradient-to-br from-[#00ff88]/20 to-[#8b5cf6]/20 backdrop-blur-xl border border-white/10 flex items-center justify-center"
                animate={{ 
                  boxShadow: ['0 0 40px #00ff8820', '0 0 80px #00ff8840', '0 0 40px #00ff8820']
                }}
                transition={{ duration: 3, repeat: Infinity }}
              >
                <motion.div
                  animate={{ rotate: 360 }}
                  transition={{ duration: 20, repeat: Infinity, ease: 'linear' }}
                  className="absolute inset-4 rounded-2xl border border-dashed border-[#00ff88]/30"
                />
                <Coins className="w-24 h-24 md:w-32 md:h-32 text-[#ffd700]" />
              </motion.div>
              
              {/* Floating badges */}
              <motion.div
                className="absolute -top-4 -right-4 px-3 py-2 bg-[#ffd700] text-black text-sm font-bold rounded-xl"
                animate={{ y: [-5, 5, -5] }}
                transition={{ duration: 2, repeat: Infinity }}
              >
                <Crown className="w-5 h-5 inline mr-1" />
                Premium
              </motion.div>
              <motion.div
                className="absolute -bottom-4 -left-4 px-3 py-2 bg-[#00d9ff] text-black text-sm font-bold rounded-xl"
                animate={{ y: [5, -5, 5] }}
                transition={{ duration: 2, repeat: Infinity, delay: 0.5 }}
              >
                <Sparkles className="w-5 h-5 inline mr-1" />
                Exclusive
              </motion.div>
            </motion.div>
          </div>
        </div>
      </motion.div>

      {/* Features Grid */}
      <div>
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mb-8"
        >
          <h2 className="text-3xl font-black text-white mb-2">Why GreedStore?</h2>
          <p className="text-gray-400">More than just a rewards program — it's your gateway to real value</p>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          <FeatureCard
            icon={CreditCard}
            title="Real Cash"
            description="Convert your coins directly to cash. Withdraw to your bank or UPI instantly."
            color="#00ff88"
            delay={0.1}
          />
          <FeatureCard
            icon={Smartphone}
            title="Premium Gadgets"
            description="Redeem coins for smartphones, laptops, accessories, and more premium tech."
            color="#00d9ff"
            delay={0.2}
          />
          <FeatureCard
            icon={Gift}
            title="Exclusive Perks"
            description="Unlock VIP benefits, early access to events, and special member privileges."
            color="#8b5cf6"
            delay={0.3}
          />
          <FeatureCard
            icon={Zap}
            title="Fee Waivers"
            description="Use coins to waive platform fees, event registrations, and premium subscriptions."
            color="#ffd700"
            delay={0.4}
          />
        </div>
      </div>

      {/* How It Works */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        className="bg-[#141420]/80 backdrop-blur-xl border border-white/10 rounded-2xl p-8"
      >
        <div className="flex items-center gap-3 mb-8">
          <div className="w-12 h-12 rounded-xl bg-[#00ff88]/20 flex items-center justify-center">
            <Trophy className="w-6 h-6 text-[#00ff88]" />
          </div>
          <div>
            <h2 className="text-2xl font-black text-white">Your Journey to Rewards</h2>
            <p className="text-gray-400">From earning to redeeming — it's seamless</p>
          </div>
        </div>

        <div className="space-y-2">
          <JourneyStep
            step={1}
            title="Earn GreedCoins"
            description="Complete challenges, win events, accomplish daily missions, and climb the leaderboard to earn coins."
            icon={Coins}
            delay={0.1}
          />
          <JourneyStep
            step={2}
            title="Browse the Store"
            description="Explore our curated collection of rewards — cash, gadgets, perks, and exclusive items."
            icon={ShoppingBag}
            delay={0.2}
          />
          <JourneyStep
            step={3}
            title="Select Your Reward"
            description="Choose what you want to redeem. Check eligibility and coin requirements."
            icon={Gift}
            delay={0.3}
          />
          <JourneyStep
            step={4}
            title="Generate Ticket"
            description="For physical items, generate a secure GreedTicket with QR code for store validation."
            icon={CheckCircle}
            delay={0.4}
            isLast
          />
        </div>
      </motion.div>

      {/* Physical Store Section */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <motion.div
          initial={{ opacity: 0, x: -20 }}
          whileInView={{ opacity: 1, x: 0 }}
          viewport={{ once: true }}
          className="bg-gradient-to-br from-[#8b5cf6]/20 to-[#141420] border border-[#8b5cf6]/30 rounded-2xl p-8"
        >
          <div className="flex items-center gap-3 mb-6">
            <MapPin className="w-8 h-8 text-[#8b5cf6]" />
            <h3 className="text-2xl font-bold text-white">Physical Stores</h3>
          </div>
          <p className="text-gray-400 mb-6">
            Visit our physical GreedStore locations to redeem your coins for gadgets, merchandise, 
            and exclusive items. Present your GreedTicket at the counter for instant verification.
          </p>
          <div className="space-y-3">
            <div className="flex items-center gap-3 text-gray-300">
              <CheckCircle className="w-5 h-5 text-[#8b5cf6]" />
              <span>Instant QR verification</span>
            </div>
            <div className="flex items-center gap-3 text-gray-300">
              <CheckCircle className="w-5 h-5 text-[#8b5cf6]" />
              <span>Hands-on product experience</span>
            </div>
            <div className="flex items-center gap-3 text-gray-300">
              <CheckCircle className="w-5 h-5 text-[#8b5cf6]" />
              <span>Exclusive in-store deals</span>
            </div>
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, x: 20 }}
          whileInView={{ opacity: 1, x: 0 }}
          viewport={{ once: true }}
          className="bg-gradient-to-br from-[#00d9ff]/20 to-[#141420] border border-[#00d9ff]/30 rounded-2xl p-8"
        >
          <div className="flex items-center gap-3 mb-6">
            <Globe className="w-8 h-8 text-[#00d9ff]" />
            <h3 className="text-2xl font-bold text-white">Digital Redemption</h3>
          </div>
          <p className="text-gray-400 mb-6">
            Redeem coins online for digital goods, cash transfers, fee waivers, and subscription 
            upgrades. Everything processed instantly without leaving your dashboard.
          </p>
          <div className="space-y-3">
            <div className="flex items-center gap-3 text-gray-300">
              <CheckCircle className="w-5 h-5 text-[#00d9ff]" />
              <span>Instant digital delivery</span>
            </div>
            <div className="flex items-center gap-3 text-gray-300">
              <CheckCircle className="w-5 h-5 text-[#00d9ff]" />
              <span>Direct bank transfers</span>
            </div>
            <div className="flex items-center gap-3 text-gray-300">
              <CheckCircle className="w-5 h-5 text-[#00d9ff]" />
              <span>Automatic fee application</span>
            </div>
          </div>
        </motion.div>
      </div>

      {/* CTA Section */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        className="relative overflow-hidden rounded-2xl bg-gradient-to-r from-[#00ff88]/10 via-[#00d9ff]/10 to-[#8b5cf6]/10 border border-white/10 p-8 text-center"
      >
        <motion.div
          className="absolute inset-0"
          animate={{
            background: [
              'radial-gradient(circle at 0% 50%, rgba(0,255,136,0.1) 0%, transparent 50%)',
              'radial-gradient(circle at 100% 50%, rgba(139,92,246,0.1) 0%, transparent 50%)',
              'radial-gradient(circle at 0% 50%, rgba(0,255,136,0.1) 0%, transparent 50%)',
            ]
          }}
          transition={{ duration: 6, repeat: Infinity }}
        />
        
        <div className="relative z-10">
          <Star className="w-12 h-12 text-[#ffd700] mx-auto mb-4" />
          <h2 className="text-3xl font-black text-white mb-3">Ready to Redeem?</h2>
          <p className="text-gray-400 mb-6 max-w-lg mx-auto">
            Your coins are waiting to be transformed into something amazing. 
            Start exploring the store and claim your rewards today.
          </p>
          <Link to="/dashboard/store">
            <motion.button
              className="inline-flex items-center gap-2 px-8 py-4 bg-gradient-to-r from-[#00ff88] to-[#00d9ff] text-black font-bold rounded-xl text-lg"
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.98 }}
            >
              <ShoppingBag className="w-6 h-6" />
              Enter GreedStore
              <ArrowRight className="w-6 h-6" />
            </motion.button>
          </Link>
        </div>
      </motion.div>
    </div>
  );
}
