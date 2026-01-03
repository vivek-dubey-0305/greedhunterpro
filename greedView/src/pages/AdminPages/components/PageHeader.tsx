import { ReactNode } from 'react';
import { motion } from 'framer-motion';
import { Plus, Search, Filter } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import React from 'react';


interface PageHeaderProps {
  title: string;
  description?: string;
  icon?: React.ComponentType<{ className?: string; style?: React.CSSProperties }>;
  actions?: ReactNode;
  showSearch?: boolean;
  searchValue?: string;
  onSearchChange?: (value: string) => void;
  searchPlaceholder?: string;
  showAddButton?: boolean;
  addButtonText?: string;
  onAddClick?: () => void;
  showFilter?: boolean;
  onFilterClick?: () => void;
}

export function PageHeader({
  title,
  description,
  icon: Icon,
  actions,
  showSearch,
  searchValue,
  onSearchChange,
  searchPlaceholder = 'Search...',
  showAddButton,
  addButtonText = 'Add New',
  onAddClick,
  showFilter,
  onFilterClick,
}: PageHeaderProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: -20 }}
      animate={{ opacity: 1, y: 0 }}
      className="mb-6"
    >
      <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
        <div className="flex items-center gap-3">
          {Icon && (
            <div className="p-3 bg-[#8b5cf6]/20 rounded-xl">
              <Icon className="w-6 h-6 text-[#8b5cf6]" />
            </div>
          )}
          <div>
            <h1 className="text-2xl font-bold text-white">{title}</h1>
            {description && (
              <p className="text-gray-400 text-sm mt-1">{description}</p>
            )}
          </div>
        </div>

        <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3">
          {showSearch && (
            <div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-500" />
              <Input
                value={searchValue}
                onChange={(e) => onSearchChange?.(e.target.value)}
                placeholder={searchPlaceholder}
                className="pl-10 bg-[#1a1a2e] border-[#2a2a3e] text-white placeholder:text-gray-500 w-full sm:w-64"
              />
            </div>
          )}
          
          {showFilter && (
            <Button
              variant="outline"
              onClick={onFilterClick}
              className="border-[#2a2a3e] bg-[#1a1a2e] text-gray-300 hover:bg-[#2a2a3e]"
            >
              <Filter className="w-4 h-4 mr-2" />
              Filter
            </Button>
          )}
          
          {showAddButton && (
            <Button
              onClick={onAddClick}
              className="bg-gradient-to-r from-[#8b5cf6] to-[#00ff88] hover:opacity-90 text-white"
            >
              <Plus className="w-4 h-4 mr-2" />
              {addButtonText}
            </Button>
          )}
          
          {actions}
        </div>
      </div>
    </motion.div>
  );
}
