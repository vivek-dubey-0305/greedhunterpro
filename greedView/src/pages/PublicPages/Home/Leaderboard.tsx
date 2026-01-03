import { motion } from "framer-motion";
import { Trophy, Medal, Crown, TrendingUp } from "lucide-react";

const topHunters = [
  {
    rank: 1,
    name: "ShadowReaper",
    avatar: "SR",
    score: 98750,
    title: "Legendary Hunter",
    color: "#ffd700",
    icon: Crown,
  },
  {
    rank: 2,
    name: "NeonPhantom",
    avatar: "NP",
    score: 87320,
    title: "Elite Sniper",
    color: "#c0c0c0",
    icon: Trophy,
  },
  {
    rank: 3,
    name: "CyberNinja",
    avatar: "CN",
    score: 76540,
    title: "Speed Demon",
    color: "#cd7f32",
    icon: Medal,
  },
  {
    rank: 4,
    name: "QuantumHacker",
    avatar: "QH",
    score: 65890,
    title: "Quiz Master",
    color: "#00ff88",
  },
  {
    rank: 5,
    name: "VoidWalker",
    avatar: "VW",
    score: 54320,
    title: "Arena Champion",
    color: "#00d9ff",
  },
  {
    rank: 6,
    name: "StormBreaker",
    avatar: "SB",
    score: 48760,
    title: "Hunt Specialist",
    color: "#8b5cf6",
  },
];

export function Leaderboard() {
  return (
    <section className="relative py-20 px-4 sm:px-6 lg:px-8 overflow-hidden">
      {/* Background */}
      <div className="absolute inset-0 bg-gradient-to-b from-[#0f0f1a] via-[#0a0a0f] to-[#0f0f1a]"></div>
      
      {/* Animated circuit lines */}
      <div className="absolute inset-0 opacity-10">
        {[...Array(3)].map((_, i) => (
          <motion.div
            key={i}
            className="absolute w-px bg-gradient-to-b from-transparent via-[#00ff88] to-transparent"
            style={{ left: `${30 + i * 20}%`, height: '100%' }}
            animate={{ y: ['-100%', '100%'] }}
            transition={{ duration: 8 + i * 2, repeat: Infinity, ease: "linear" }}
          />
        ))}
      </div>

      <div className="relative z-10 max-w-5xl mx-auto">
        {/* Section Header */}
        <motion.div
          className="text-center mb-16"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
        >
          <motion.div
            className="inline-flex items-center gap-2 mb-4"
            animate={{ y: [0, -5, 0] }}
            transition={{ duration: 2, repeat: Infinity }}
          >
            <TrendingUp className="w-6 h-6 text-[#00ff88]" />
            <span className="text-[#00ff88] text-sm uppercase tracking-wide">Global Rankings</span>
          </motion.div>
          
          <h2 className="text-4xl sm:text-5xl md:text-6xl font-black mb-4">
            <span className="text-white">Top </span>
            <span className="text-[#00ff88] neon-glow">Hunters</span>
          </h2>
          
          <p className="text-gray-400 text-lg">
            The elite few who dominate the GreedVerse. Will you join their ranks?
          </p>
        </motion.div>

        {/* Leaderboard */}
        <div className="space-y-4">
          {topHunters.map((hunter, index) => (
            <motion.div
              key={hunter.rank}
              initial={{ opacity: 0, x: -50 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ delay: index * 0.1 }}
              whileHover={{ x: 10, scale: 1.02 }}
              className="relative group"
            >
              {/* Rank badge for top 3 */}
              {hunter.rank <= 3 && (
                <motion.div
                  className="absolute -left-4 top-1/2 -translate-y-1/2 z-10"
                  animate={{ rotate: [0, 10, -10, 0] }}
                  transition={{ duration: 3, repeat: Infinity }}
                >
                  {hunter.icon && (
                    <hunter.icon 
                      className="w-8 h-8"
                      style={{ color: hunter.color }}
                    />
                  )}
                </motion.div>
              )}

              {/* Holographic Card */}
              <div className="relative bg-[#141420]/80 backdrop-blur-sm rounded-lg border-2 border-transparent overflow-hidden transition-all duration-300"
                style={{ 
                  borderColor: hunter.rank <= 3 ? hunter.color + '60' : '#00ff88' + '20' 
                }}
              >
                {/* Glow effect */}
                <div 
                  className="absolute inset-0 opacity-0 group-hover:opacity-20 transition-opacity"
                  style={{ backgroundColor: hunter.color || '#00ff88' }}
                />

                {/* Content */}
                <div className="relative flex items-center gap-4 p-4 sm:p-6">
                  {/* Rank */}
                  <div className="text-3xl sm:text-4xl font-black w-12 sm:w-16 text-center"
                    style={{ color: hunter.color || '#00ff88' }}
                  >
                    #{hunter.rank}
                  </div>

                  {/* Avatar */}
                  <motion.div
                    className="w-14 h-14 sm:w-16 sm:h-16 rounded-lg flex items-center justify-center border-2 relative overflow-hidden"
                    style={{ 
                      borderColor: hunter.color || '#00ff88',
                      backgroundColor: (hunter.color || '#00ff88') + '20'
                    }}
                    whileHover={{ scale: 1.1 }}
                  >
                    <span className="text-xl sm:text-2xl font-black relative z-10" style={{ color: hunter.color || '#00ff88' }}>
                      {hunter.avatar}
                    </span>
                    <motion.div
                      className="absolute inset-0"
                      style={{ backgroundColor: hunter.color || '#00ff88' }}
                      animate={{ opacity: [0.1, 0.3, 0.1] }}
                      transition={{ duration: 2, repeat: Infinity }}
                    />
                  </motion.div>

                  {/* Info */}
                  <div className="flex-grow min-w-0">
                    <h4 className="text-lg sm:text-xl font-bold text-white truncate">
                      {hunter.name}
                    </h4>
                    <p className="text-sm text-gray-400 truncate">
                      {hunter.title}
                    </p>
                  </div>

                  {/* Score */}
                  <div className="text-right">
                    <div className="text-2xl sm:text-3xl font-black"
                      style={{ color: hunter.color || '#00ff88' }}
                    >
                      {hunter.score.toLocaleString()}
                    </div>
                    <div className="text-xs text-gray-500 uppercase">
                      Points
                    </div>
                  </div>
                </div>

                {/* Bottom accent line */}
                <motion.div
                  className="absolute bottom-0 left-0 h-1 bg-gradient-to-r from-transparent to-transparent"
                  style={{ 
                    background: `linear-gradient(90deg, transparent, ${hunter.color || '#00ff88'}, transparent)`
                  }}
                  animate={{ x: ['-100%', '100%'] }}
                  transition={{ duration: 3, repeat: Infinity, ease: "linear" }}
                />
              </div>
            </motion.div>
          ))}
        </div>

        {/* Your Rank Card */}
        <motion.div
          className="mt-8 relative"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ delay: 0.6 }}
        >
          <div className="bg-gradient-to-r from-[#00ff88]/20 to-[#00d9ff]/20 rounded-lg border-2 border-[#00ff88] p-4 sm:p-6">
            <div className="flex items-center justify-between flex-wrap gap-4">
              <div className="flex items-center gap-4">
                <div className="text-2xl sm:text-3xl font-black text-[#00ff88]">
                  #247
                </div>
                <div>
                  <div className="text-lg font-bold text-white">You</div>
                  <div className="text-sm text-gray-400">Rising Hunter</div>
                </div>
              </div>
              <div className="text-right">
                <div className="text-2xl sm:text-3xl font-black text-[#00ff88]">
                  15,320
                </div>
                <div className="text-xs text-gray-400">Keep hunting to climb!</div>
              </div>
            </div>
          </div>
        </motion.div>

        {/* CTA */}
        <motion.div
          className="text-center mt-8"
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
        >
          <p className="text-gray-500 text-sm">
            Rankings update live. Every hunt counts.
          </p>
        </motion.div>
      </div>
    </section>
  );
}
