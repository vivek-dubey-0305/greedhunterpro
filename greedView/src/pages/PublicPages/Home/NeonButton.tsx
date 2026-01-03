import { motion } from "framer-motion";
import React from "react";

interface NeonButtonProps {
  children: React.ReactNode;
  variant?: "primary" | "secondary" | "accent";
  size?: "sm" | "md" | "lg";
  icon?: React.ComponentType<{ className?: string }>;
  onClick?: () => void;
  className?: string;
}

export function NeonButton({ 
  children, 
  variant = "primary", 
  size = "md", 
  icon: Icon,
  onClick,
  className = ""
}: NeonButtonProps) {
  const variants = {
    primary: "bg-[#00ff88] text-[#0a0a0f] hover:shadow-[0_0_20px_rgba(0,255,136,0.6)]",
    secondary: "bg-[#8b5cf6] text-white hover:shadow-[0_0_20px_rgba(139,92,246,0.6)]",
    accent: "bg-[#00d9ff] text-[#0a0a0f] hover:shadow-[0_0_20px_rgba(0,217,255,0.6)]",
  };

  const sizes = {
    sm: "px-4 py-2 text-sm",
    md: "px-6 py-3",
    lg: "px-8 py-4 text-lg",
  };

  return (
    <motion.button
      whileHover={{ scale: 1.05 }}
      whileTap={{ scale: 0.95 }}
      className={`${variants[variant]} ${sizes[size]} rounded-md transition-all duration-300 flex items-center gap-2 border-2 border-transparent hover:border-current ${className}`}
      onClick={onClick}
    >
      {Icon && <Icon className="w-5 h-5" />}
      {children}
    </motion.button>
  );
}
