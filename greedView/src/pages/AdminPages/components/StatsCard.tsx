import { motion } from 'framer-motion';
import React from 'react';

interface StatsCardProps {
  title: string;
  value: string | number;
  icon : React.ComponentType<{ className?: string; style?: React.CSSProperties }>;
  trend?: {
    value: number;
    isPositive: boolean;
  };
  color?: string;
}

export function StatsCard({ title, value, icon: Icon, trend, color = '#8b5cf6' }: StatsCardProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="bg-[#141420] border border-[#2a2a3e] rounded-xl p-6 hover:border-[#3a3a4e] transition-colors"
    >
      <div className="flex items-start justify-between">
        <div>
          <p className="text-gray-400 text-sm">{title}</p>
          <h3 className="text-2xl font-bold text-white mt-1">{value}</h3>
          {trend && (
            <div className={`flex items-center gap-1 mt-2 text-sm ${trend.isPositive ? 'text-green-400' : 'text-red-400'}`}>
              <span>{trend.isPositive ? '↑' : '↓'} {Math.abs(trend.value)}%</span>
              <span className="text-gray-500">vs last month</span>
            </div>
          )}
        </div>
        <div 
          className="p-3 rounded-lg" 
          style={{ backgroundColor: `${color}20` }}
        >
          <Icon className="w-6 h-6" style={{ color }} />
        </div>
      </div>
    </motion.div>
  );
}
