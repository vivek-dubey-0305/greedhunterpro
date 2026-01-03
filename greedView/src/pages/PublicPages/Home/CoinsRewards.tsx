import { motion } from "framer-motion";
import { Coins, Gift, Trophy, Star, Zap, Target } from "lucide-react";

const earnMethods = [
  {
    title: "Complete Hunts",
    coins: "500-2000",
    icon: Target,
    color: "#00ff88",
  },
  {
    title: "Win Battles",
    coins: "1000-5000",
    icon: Trophy,
    color: "#ffd700",
  },
  {
    title: "Daily Challenges",
    coins: "300-800",
    icon: Star,
    color: "#00d9ff",
  },
  {
    title: "Speed Bonuses",
    coins: "200-1500",
    icon: Zap,
    color: "#8b5cf6",
  },
];

export function CoinsRewards() {
  return (
    <section className="relative py-20 px-4 sm:px-6 lg:px-8 overflow-hidden">
      {/* Background */}
      <div className="absolute inset-0 bg-[#0a0a0f]"></div>
      
      {/* Floating coins animation */}
      <div className="absolute inset-0">
        {[...Array(15)].map((_, i) => (
          <motion.div
            key={i}
            className="absolute"
            style={{
              left: `${Math.random() * 100}%`,
              top: `${Math.random() * 100}%`,
            }}
            animate={{
              y: [0, -50, 0],
              opacity: [0.1, 0.3, 0.1],
              scale: [1, 1.2, 1],
            }}
            transition={{
              duration: 4 + Math.random() * 2,
              repeat: Infinity,
              delay: Math.random() * 2,
            }}
          >
            <Coins className="w-6 h-6 text-[#ffd700]" />
          </motion.div>
        ))}
      </div>

      <div className="relative z-10 max-w-6xl mx-auto">
        {/* Section Header */}
        <motion.div
          className="text-center mb-16"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
        >
          <motion.div
            className="inline-flex items-center gap-3 mb-6"
            animate={{ rotate: [0, 360] }}
            transition={{ duration: 4, repeat: Infinity, ease: "linear" }}
          >
            <div className="w-16 h-16 rounded-full bg-gradient-to-br from-[#ffd700] to-[#ff8800] flex items-center justify-center border-4 border-[#ffd700]/30">
              <Coins className="w-8 h-8 text-[#0a0a0f]" />
            </div>
          </motion.div>
          
          <h2 className="text-4xl sm:text-5xl md:text-6xl font-black mb-4">
            <span className="text-[#ffd700] neon-glow">GREED</span>
            <span className="text-white">COINS</span>
          </h2>
          
          <p className="text-gray-400 text-lg max-w-2xl mx-auto">
            Your universal currency in the GreedVerse. Earn through gameplay, 
            convert to real rewards, and dominate the economy.
          </p>
        </motion.div>

        {/* Coin Flow Diagram */}
        <motion.div
          className="mb-16 bg-gradient-to-br from-[#141420] to-[#0f0f1a] rounded-2xl p-8 border-2 border-[#ffd700]/30"
          initial={{ opacity: 0, scale: 0.9 }}
          whileInView={{ opacity: 1, scale: 1 }}
          viewport={{ once: true }}
        >
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 items-center">
            {/* Play */}
            <motion.div
              className="text-center"
              whileHover={{ scale: 1.05 }}
            >
              <div className="w-20 h-20 mx-auto rounded-full bg-[#00ff88]/20 border-2 border-[#00ff88] flex items-center justify-center mb-4">
                <Target className="w-10 h-10 text-[#00ff88]" />
              </div>
              <h3 className="text-xl font-bold text-white mb-2">PLAY</h3>
              <p className="text-gray-400 text-sm">
                Complete challenges, win battles, climb ranks
              </p>
            </motion.div>

            {/* Arrow */}
            <motion.div
              className="hidden md:flex justify-center"
              animate={{ x: [0, 10, 0] }}
              transition={{ duration: 2, repeat: Infinity }}
            >
              <div className="w-full h-px bg-gradient-to-r from-[#00ff88] via-[#ffd700] to-[#00d9ff]" />
            </motion.div>

            {/* Earn */}
            <motion.div
              className="text-center"
              whileHover={{ scale: 1.05 }}
            >
              <div className="w-20 h-20 mx-auto rounded-full bg-[#ffd700]/20 border-2 border-[#ffd700] flex items-center justify-center mb-4">
                <Coins className="w-10 h-10 text-[#ffd700]" />
              </div>
              <h3 className="text-xl font-bold text-white mb-2">EARN</h3>
              <p className="text-gray-400 text-sm">
                Collect GreedCoins based on your performance
              </p>
            </motion.div>

            {/* Arrow */}
            <motion.div
              className="hidden md:flex justify-center md:col-start-2"
              animate={{ x: [0, 10, 0] }}
              transition={{ duration: 2, repeat: Infinity, delay: 0.5 }}
            >
              <div className="w-full h-px bg-gradient-to-r from-[#ffd700] via-[#00d9ff] to-[#8b5cf6]" />
            </motion.div>

            {/* Redeem */}
            <motion.div
              className="text-center md:col-start-3"
              whileHover={{ scale: 1.05 }}
            >
              <div className="w-20 h-20 mx-auto rounded-full bg-[#00d9ff]/20 border-2 border-[#00d9ff] flex items-center justify-center mb-4">
                <Gift className="w-10 h-10 text-[#00d9ff]" />
              </div>
              <h3 className="text-xl font-bold text-white mb-2">REDEEM</h3>
              <p className="text-gray-400 text-sm">
                Convert coins to real-world prizes and rewards
              </p>
            </motion.div>
          </div>
        </motion.div>

        {/* Earning Methods */}
        <div>
          <motion.h3
            className="text-2xl sm:text-3xl font-bold text-center mb-8 text-white"
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
          >
            How to <span className="text-[#ffd700]">Earn Coins</span>
          </motion.h3>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {earnMethods.map((method, index) => (
              <motion.div
                key={method.title}
                className="relative group"
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.1 }}
                whileHover={{ y: -5 }}
              >
                {/* Glow effect */}
                <div 
                  className="absolute inset-0 rounded-lg opacity-0 group-hover:opacity-50 transition-opacity blur-xl"
                  style={{ backgroundColor: method.color }}
                />

                {/* Card */}
                <div className="relative bg-[#141420] rounded-lg p-6 border-2 border-transparent group-hover:border-current transition-all"
                  style={{ borderColor: method.color + '40' }}
                >
                  {/* Icon */}
                  <div 
                    className="w-14 h-14 rounded-lg flex items-center justify-center mb-4 mx-auto"
                    style={{ backgroundColor: method.color + '20' }}
                  >
                    <method.icon className="w-8 h-8" style={{ color: method.color }} />
                  </div>

                  {/* Title */}
                  <h4 className="text-white text-center mb-2">
                    {method.title}
                  </h4>

                  {/* Coins */}
                  <div className="text-center">
                    <div 
                      className="text-2xl font-black mb-1"
                      style={{ color: method.color }}
                    >
                      {method.coins}
                    </div>
                    <div className="text-xs text-gray-500">
                      COINS
                    </div>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </div>

        {/* Stats Display */}
        <motion.div
          className="mt-16 grid grid-cols-1 sm:grid-cols-3 gap-6"
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
        >
          {[
            { label: "Total Coins Distributed", value: "1.2M+", color: "#ffd700" },
            { label: "Active Hunters", value: "50K+", color: "#00ff88" },
            { label: "Rewards Claimed", value: "8.5K+", color: "#00d9ff" },
          ].map((stat, index) => (
            <motion.div
              key={stat.label}
              className="bg-[#141420]/50 backdrop-blur-sm rounded-lg p-6 border border-white/10 text-center"
              whileHover={{ scale: 1.05 }}
              transition={{ delay: index * 0.1 }}
            >
              <motion.div
                className="text-4xl font-black mb-2"
                style={{ color: stat.color }}
                animate={{ scale: [1, 1.1, 1] }}
                transition={{ duration: 2, repeat: Infinity, delay: index * 0.3 }}
              >
                {stat.value}
              </motion.div>
              <div className="text-gray-400 text-sm">
                {stat.label}
              </div>
            </motion.div>
          ))}
        </motion.div>
      </div>
    </section>
  );
}
