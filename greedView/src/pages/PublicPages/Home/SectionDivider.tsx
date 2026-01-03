import { motion } from "framer-motion";

interface SectionDividerProps {
  color?: string;
}

export function SectionDivider({ color = "#00ff88" }: SectionDividerProps) {
  return (
    <div className="relative h-24 overflow-hidden">
      {/* Animated line */}
      <motion.div
        className="absolute top-1/2 left-0 right-0 h-px"
        style={{
          background: `linear-gradient(90deg, transparent, ${color}, transparent)`,
        }}
        initial={{ scaleX: 0 }}
        whileInView={{ scaleX: 1 }}
        viewport={{ once: true }}
        transition={{ duration: 1.5, ease: "easeOut" }}
      />

      {/* Center glow */}
      <motion.div
        className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-2 h-2 rounded-full"
        style={{ backgroundColor: color, boxShadow: `0 0 20px ${color}` }}
        animate={{
          scale: [1, 1.5, 1],
          opacity: [0.5, 1, 0.5],
        }}
        transition={{
          duration: 2,
          repeat: Infinity,
          ease: "easeInOut",
        }}
      />

      {/* Orbiting particles */}
      {[...Array(3)].map((_, i) => (
        <motion.div
          key={i}
          className="absolute top-1/2 left-1/2 w-1 h-1 rounded-full"
          style={{ backgroundColor: color }}
          animate={{
            x: [0, Math.cos(i * 2.1) * 50, 0],
            y: [0, Math.sin(i * 2.1) * 50, 0],
            opacity: [0, 1, 0],
          }}
          transition={{
            duration: 3,
            repeat: Infinity,
            delay: i * 0.4,
            ease: "easeInOut",
          }}
        />
      ))}
    </div>
  );
}
