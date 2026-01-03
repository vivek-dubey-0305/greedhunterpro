import { motion } from "framer-motion";

interface AnimatedBackgroundProps {
  variant?: "grid" | "particles" | "waves";
  color?: string;
  opacity?: number;
}

export function AnimatedBackground({ 
  variant = "grid", 
  color = "#00ff88",
  opacity = 0.1 
}: AnimatedBackgroundProps) {
  if (variant === "particles") {
    return (
      <div className="absolute inset-0 overflow-hidden">
        {[...Array(30)].map((_, i) => (
          <motion.div
            key={i}
            className="absolute w-1 h-1 rounded-full"
            style={{
              backgroundColor: color,
              left: `${Math.random() * 100}%`,
              top: `${Math.random() * 100}%`,
            }}
            animate={{
              y: [0, -50, 0],
              opacity: [0, opacity, 0],
              scale: [1, 1.5, 1],
            }}
            transition={{
              duration: 3 + Math.random() * 2,
              repeat: Infinity,
              delay: Math.random() * 2,
              ease: "easeInOut",
            }}
          />
        ))}
      </div>
    );
  }

  if (variant === "waves") {
    return (
      <div className="absolute inset-0 overflow-hidden">
        {[...Array(5)].map((_, i) => (
          <motion.div
            key={i}
            className="absolute h-px w-full"
            style={{
              background: `linear-gradient(90deg, transparent, ${color}, transparent)`,
              top: `${20 + i * 15}%`,
              opacity: opacity,
            }}
            animate={{
              x: ["-100%", "100%"],
            }}
            transition={{
              duration: 10 + i * 2,
              repeat: Infinity,
              ease: "linear",
            }}
          />
        ))}
      </div>
    );
  }

  // Default: grid
  return (
    <div className="absolute inset-0 cyber-grid" style={{ opacity }} />
  );
}
