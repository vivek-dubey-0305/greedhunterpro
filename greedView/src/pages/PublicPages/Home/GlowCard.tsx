import { motion } from "framer-motion";
import { ReactNode } from "react";

interface GlowCardProps {
  children: ReactNode;
  glowColor?: string;
  className?: string;
}

export function GlowCard({ 
  children, 
  glowColor = "#00ff88",
  className = "" 
}: GlowCardProps) {
  return (
    <motion.div
      className={`relative group ${className}`}
      whileHover={{ scale: 1.02 }}
      transition={{ duration: 0.2 }}
    >
      {/* Glow effect */}
      <div 
        className="absolute inset-0 rounded-lg opacity-0 group-hover:opacity-50 transition-opacity duration-300 blur-xl"
        style={{ backgroundColor: glowColor }}
      />
      
      {/* Card content */}
      <div className="relative bg-[#141420]/80 backdrop-blur-sm rounded-lg border-2 transition-all"
        style={{ borderColor: glowColor + '40' }}
      >
        {children}
      </div>
    </motion.div>
  );
}
