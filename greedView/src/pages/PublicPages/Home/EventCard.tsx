import { motion } from "framer-motion";
import React from "react";

interface EventCardProps {
  title: string;
  description: string;
  icon: React.ComponentType<{ className?: string }>;
  color: string;
  difficulty: string;
  participants: string;
}

export function EventCard({ title, description, icon: Icon, color, difficulty, participants }: EventCardProps) {
  return (
    <motion.div
      className="relative group cursor-pointer"
      whileHover={{ y: -8, scale: 1.02 }}
      transition={{ duration: 0.3 }}
    >
      {/* Glow effect on hover */}
      <div 
        className="absolute inset-0 rounded-lg opacity-0 group-hover:opacity-100 transition-opacity duration-300 blur-xl"
        style={{ backgroundColor: color, filter: 'blur(20px)' }}
      />
      
      {/* Card content */}
      <div className="relative bg-[#141420]/90 backdrop-blur-sm border-2 rounded-lg p-6 overflow-hidden transition-all duration-300"
        style={{ borderColor: color + '40' }}
      >
        {/* Corner accent */}
        <div 
          className="absolute top-0 right-0 w-20 h-20 opacity-20"
          style={{ 
            background: `linear-gradient(135deg, ${color} 0%, transparent 70%)` 
          }}
        />

        {/* Icon */}
        <div 
          className="w-14 h-14 rounded-lg flex items-center justify-center mb-4 relative overflow-hidden"
          style={{ backgroundColor: color + '20' }}
        >
          <Icon className="w-8 h-8 relative z-10" style={{ color }} />
          <div 
            className="absolute inset-0 animate-pulse"
            style={{ backgroundColor: color, opacity: 0.1 }}
          />
        </div>

        {/* Title */}
        <h3 className="text-xl font-bold mb-2 text-white group-hover:neon-glow transition-all" style={{ color: color }}>
          {title}
        </h3>

        {/* Description */}
        <p className="text-gray-400 mb-4 text-sm leading-relaxed">
          {description}
        </p>

        {/* Stats */}
        <div className="flex items-center justify-between text-xs">
          <div className="flex items-center gap-2">
            <div className="px-2 py-1 rounded bg-[#1a1a2e] text-gray-300 border border-gray-700">
              {difficulty}
            </div>
          </div>
          <div className="text-gray-500">
            {participants} hunters
          </div>
        </div>

        {/* Holographic line effect */}
        <div 
          className="absolute bottom-0 left-0 right-0 h-0.5 opacity-50 group-hover:opacity-100 transition-opacity"
          style={{ backgroundColor: color }}
        />
      </div>
    </motion.div>
  );
}
