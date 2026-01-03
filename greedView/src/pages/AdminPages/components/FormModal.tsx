import { ReactNode } from 'react';
import { motion } from 'framer-motion';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { X } from 'lucide-react';

interface FormModalProps {
  isOpen: boolean;
  onClose: () => void;
  title: string;
  description?: string;
  children: ReactNode;
  onSubmit?: () => void;
  submitText?: string;
  isLoading?: boolean;
  size?: 'sm' | 'md' | 'lg' | 'xl';
}

const sizeClasses = {
  sm: 'sm:max-w-md',
  md: 'sm:max-w-lg',
  lg: 'sm:max-w-2xl',
  xl: 'sm:max-w-4xl',
};

export function FormModal({
  isOpen,
  onClose,
  title,
  description,
  children,
  onSubmit,
  submitText = 'Save',
  isLoading = false,
  size = 'md',
}: FormModalProps) {
  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent 
        className={`bg-[#141420] border-[#2a2a3e] text-white ${sizeClasses[size]} max-h-[90vh] overflow-y-auto`}
        showCloseButton={false}
      >
        <DialogHeader>
          <div className="flex items-center justify-between">
            <DialogTitle className="text-xl text-white">{title}</DialogTitle>
            <Button
              variant="ghost"
              size="icon"
              onClick={onClose}
              className="text-gray-400 hover:text-white hover:bg-white/10"
            >
              <X className="w-4 h-4" />
            </Button>
          </div>
          {description && (
            <DialogDescription className="text-gray-400">
              {description}
            </DialogDescription>
          )}
        </DialogHeader>
        
        <div className="py-4">
          {children}
        </div>
        
        {onSubmit && (
          <DialogFooter className="gap-2">
            <Button
              variant="outline"
              onClick={onClose}
              className="border-[#2a2a3e] bg-transparent text-gray-300 hover:bg-[#2a2a3e]"
            >
              Cancel
            </Button>
            <Button
              onClick={onSubmit}
              disabled={isLoading}
              className="bg-gradient-to-r from-[#8b5cf6] to-[#00ff88] hover:opacity-90 text-white"
            >
              {isLoading ? (
                <motion.div
                  className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full"
                  animate={{ rotate: 360 }}
                  transition={{ duration: 1, repeat: Infinity, ease: 'linear' }}
                />
              ) : (
                submitText
              )}
            </Button>
          </DialogFooter>
        )}
      </DialogContent>
    </Dialog>
  );
}
