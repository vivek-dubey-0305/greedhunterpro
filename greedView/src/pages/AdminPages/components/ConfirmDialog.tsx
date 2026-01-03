import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from '@/components/ui/alert-dialog';
import { AlertTriangle } from 'lucide-react';

interface ConfirmDialogProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => void;
  title: string;
  description: string;
  confirmText?: string;
  cancelText?: string;
  variant?: 'danger' | 'warning' | 'default';
}

export function ConfirmDialog({
  isOpen,
  onClose,
  onConfirm,
  title,
  description,
  confirmText = 'Confirm',
  cancelText = 'Cancel',
  variant = 'danger',
}: ConfirmDialogProps) {
  const variantStyles = {
    danger: 'bg-red-500 hover:bg-red-600',
    warning: 'bg-yellow-500 hover:bg-yellow-600',
    default: 'bg-[#8b5cf6] hover:bg-[#7c4ce6]',
  };

  return (
    <AlertDialog open={isOpen} onOpenChange={onClose}>
      <AlertDialogContent className="bg-[#141420] border-[#2a2a3e]">
        <AlertDialogHeader>
          <div className="flex items-center gap-3">
            <div className={`p-2 rounded-lg ${variant === 'danger' ? 'bg-red-500/20' : variant === 'warning' ? 'bg-yellow-500/20' : 'bg-[#8b5cf6]/20'}`}>
              <AlertTriangle className={`w-5 h-5 ${variant === 'danger' ? 'text-red-400' : variant === 'warning' ? 'text-yellow-400' : 'text-[#8b5cf6]'}`} />
            </div>
            <AlertDialogTitle className="text-white">{title}</AlertDialogTitle>
          </div>
          <AlertDialogDescription className="text-gray-400 mt-2">
            {description}
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel className="border-[#2a2a3e] bg-transparent text-gray-300 hover:bg-[#2a2a3e] hover:text-white">
            {cancelText}
          </AlertDialogCancel>
          <AlertDialogAction
            onClick={onConfirm}
            className={`text-white ${variantStyles[variant]}`}
          >
            {confirmText}
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
}
