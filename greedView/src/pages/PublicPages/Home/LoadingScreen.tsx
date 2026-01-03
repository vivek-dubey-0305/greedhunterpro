import { motion } from "framer-motion";
import { useEffect, useState } from "react";

export function LoadingScreen() {
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const timer = setTimeout(() => {
      setIsLoading(false);
    }, 2000);

    return () => clearTimeout(timer);
  }, []);

  if (!isLoading) return null;

  return (
    <motion.div
      className="fixed inset-0 z-[100] bg-[#0a0a0f] flex items-center justify-center"
      initial={{ opacity: 1 }}
      animate={{ opacity: isLoading ? 1 : 0 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.5 }}
      style={{ pointerEvents: isLoading ? "auto" : "none" }}
    >
      {/* Animated background grid */}
      <div className="absolute inset-0 cyber-grid opacity-20"></div>

      {/* Loading content */}
      <div className="relative z-10 text-center">
        {/* Logo with animation */}
        <motion.div
          initial={{ scale: 0.8, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ duration: 0.5 }}
        >
          <h1 className="text-5xl sm:text-6xl md:text-7xl font-black mb-8">
            <motion.span
              className="text-[#00ff88] neon-glow inline-block"
              animate={{ 
                textShadow: [
                  "0 0 10px #00ff88, 0 0 20px #00ff88, 0 0 30px #00ff88",
                  "0 0 20px #00ff88, 0 0 30px #00ff88, 0 0 40px #00ff88",
                  "0 0 10px #00ff88, 0 0 20px #00ff88, 0 0 30px #00ff88",
                ]
              }}
              transition={{ duration: 1.5, repeat: Infinity }}
            >
              GREED
            </motion.span>
            <motion.span
              className="text-[#00d9ff] neon-glow inline-block ml-2"
              animate={{ 
                textShadow: [
                  "0 0 10px #00d9ff, 0 0 20px #00d9ff, 0 0 30px #00d9ff",
                  "0 0 20px #00d9ff, 0 0 30px #00d9ff, 0 0 40px #00d9ff",
                  "0 0 10px #00d9ff, 0 0 20px #00d9ff, 0 0 30px #00d9ff",
                ]
              }}
              transition={{ duration: 1.5, repeat: Infinity, delay: 0.2 }}
            >
              HUNTER
            </motion.span>
          </h1>
        </motion.div>

        {/* Loading bar */}
        <div className="w-64 h-1 bg-[#1a1a2e] rounded-full overflow-hidden mx-auto">
          <motion.div
            className="h-full bg-gradient-to-r from-[#00ff88] via-[#00d9ff] to-[#8b5cf6]"
            initial={{ width: "0%" }}
            animate={{ width: "100%" }}
            transition={{ duration: 1.8, ease: "easeInOut" }}
          />
        </div>

        {/* Loading text */}
        <motion.p
          className="mt-6 text-gray-400 text-sm"
          animate={{ opacity: [0.5, 1, 0.5] }}
          transition={{ duration: 1.5, repeat: Infinity }}
        >
          Initializing GreedVerse...
        </motion.p>

        {/* Orbiting particles */}
        {[...Array(8)].map((_, i) => (
          <motion.div
            key={i}
            className="absolute w-2 h-2 rounded-full"
            style={{
              backgroundColor: i % 3 === 0 ? "#00ff88" : i % 3 === 1 ? "#00d9ff" : "#8b5cf6",
              left: "50%",
              top: "50%",
            }}
            animate={{
              x: [0, Math.cos((i / 8) * Math.PI * 2) * 100],
              y: [0, Math.sin((i / 8) * Math.PI * 2) * 100],
              opacity: [0, 1, 0],
              scale: [0, 1, 0],
            }}
            transition={{
              duration: 2,
              repeat: Infinity,
              delay: i * 0.1,
              ease: "easeInOut",
            }}
          />
        ))}
      </div>
    </motion.div>
  );
}
