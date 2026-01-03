import { motion } from "framer-motion";
import { NeonButton } from "./NeonButton";
import { Play, Zap } from "lucide-react";

export function Hero() {
  return (
    <section className="relative min-h-screen flex items-center justify-center overflow-hidden">
      {/* Animated Background */}
      <div className="absolute inset-0 cyber-grid opacity-20"></div>
      
      {/* Radial gradient overlay */}
      <div className="absolute inset-0 bg-gradient-radial from-transparent via-[#0a0a0f]/50 to-[#0a0a0f]"></div>
      
      {/* Floating particles */}
      <div className="absolute inset-0">
        {[...Array(20)].map((_, i) => (
          <motion.div
            key={i}
            className="absolute w-1 h-1 bg-[#00ff88] rounded-full"
            style={{
              left: `${Math.random() * 100}%`,
              top: `${Math.random() * 100}%`,
            }}
            animate={{
              y: [0, -30, 0],
              opacity: [0, 1, 0],
            }}
            transition={{
              duration: 3 + Math.random() * 2,
              repeat: Infinity,
              delay: Math.random() * 2,
            }}
          />
        ))}
      </div>

      {/* Content */}
      <div className="relative z-10 max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
        >
          {/* Logo/Title */}
          <motion.div
            className="mb-6"
            animate={{ scale: [1, 1.02, 1] }}
            transition={{ duration: 2, repeat: Infinity }}
          >
            <h1 className="text-5xl sm:text-6xl md:text-7xl lg:text-8xl font-black tracking-tight">
              <span className="text-[#00ff88] neon-glow">GREED</span>
              <span className="text-[#00d9ff] neon-glow">HUNTER</span>
            </h1>
          </motion.div>

          {/* Tagline */}
          <motion.h2
            className="text-2xl sm:text-3xl md:text-4xl font-bold mb-4 text-white"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.3 }}
          >
            Enter the <span className="text-[#8b5cf6]">GreedVerse</span> – Hunt. Compete. Rise.
          </motion.h2>

          {/* Subtitle */}
          <motion.p
            className="text-lg sm:text-xl text-gray-300 mb-8 max-w-3xl mx-auto"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.5 }}
          >
            Experience multi-world events, challenges, games, puzzles, and hunts. 
            Win coins, unlock rewards, and climb the global leaderboard.
          </motion.p>

          {/* CTA Buttons */}
          <motion.div
            className="flex flex-col sm:flex-row gap-4 justify-center items-center"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.7 }}
          >
            <NeonButton variant="primary" size="lg" icon={Play}>
              Join Hunt
            </NeonButton>
            <NeonButton variant="accent" size="lg" icon={Zap}>
              Explore Events
            </NeonButton>
          </motion.div>

          {/* Floating Cards Preview */}
          <motion.div 
            className="mt-16 grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-4 max-w-4xl mx-auto"
            initial={{ opacity: 0, y: 40 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 1 }}
          >
            {[
              { name: "SEARCH", color: "#00ff88" },
              { name: "QUIZ", color: "#00d9ff" },
              { name: "SCAVENGER", color: "#8b5cf6" },
              { name: "SPEED RUN", color: "#ff0055" },
              { name: "ARENA", color: "#ffd700" },
            ].map((event, i) => (
              <motion.div
                key={event.name}
                className="relative group"
                animate={{ 
                  y: [0, -10, 0],
                }}
                transition={{
                  duration: 2 + i * 0.2,
                  repeat: Infinity,
                  ease: "easeInOut",
                }}
              >
                <div 
                  className="bg-[#141420]/80 backdrop-blur-sm border-2 rounded-lg p-3 sm:p-4 transition-all duration-300 group-hover:scale-105"
                  style={{ borderColor: event.color }}
                >
                  <div 
                    className="text-xs sm:text-sm font-bold"
                    style={{ color: event.color }}
                  >
                    {event.name}
                  </div>
                </div>
              </motion.div>
            ))}
          </motion.div>
        </motion.div>
      </div>

      {/* Bottom gradient fade */}
      <div className="absolute bottom-0 left-0 right-0 h-32 bg-gradient-to-t from-[#0a0a0f] to-transparent"></div>
    </section>
  );
}
