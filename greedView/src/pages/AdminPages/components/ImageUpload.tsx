import { useCallback, useState } from 'react';
import { motion } from 'framer-motion';
import { Upload, X, Image as ImageIcon } from 'lucide-react';
import { cn } from '@/lib/utils';

interface ImageUploadProps {
  value?: string;
  onChange: (value: string) => void;
  className?: string;
  aspectRatio?: 'square' | 'video' | 'banner';
}

const aspectRatioClasses = {
  square: 'aspect-square',
  video: 'aspect-video',
  banner: 'aspect-[3/1]',
};

export function ImageUpload({ value, onChange, className, aspectRatio = 'video' }: ImageUploadProps) {
  const [isDragging, setIsDragging] = useState(false);

  const handleDragOver = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(true);
  }, []);

  const handleDragLeave = useCallback(() => {
    setIsDragging(false);
  }, []);

  const handleDrop = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
    const file = e.dataTransfer.files[0];
    if (file && file.type.startsWith('image/')) {
      handleFileSelect(file);
    }
  }, []);

  const handleFileSelect = (file: File) => {
    const reader = new FileReader();
    reader.onloadend = () => {
      onChange(reader.result as string);
    };
    reader.readAsDataURL(file);
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      handleFileSelect(file);
    }
  };

  const handleRemove = () => {
    onChange('');
  };

  return (
    <div className={className}>
      {value ? (
        <div className={cn('relative rounded-xl overflow-hidden bg-[#1a1a2e]', aspectRatioClasses[aspectRatio])}>
          <img
            src={value}
            alt="Upload preview"
            className="w-full h-full object-cover"
          />
          <motion.button
            onClick={handleRemove}
            className="absolute top-2 right-2 p-2 bg-black/50 rounded-lg text-white hover:bg-black/70 transition-colors"
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.9 }}
          >
            <X className="w-4 h-4" />
          </motion.button>
        </div>
      ) : (
        <label
          onDragOver={handleDragOver}
          onDragLeave={handleDragLeave}
          onDrop={handleDrop}
          className={cn(
            'flex flex-col items-center justify-center rounded-xl border-2 border-dashed cursor-pointer transition-colors',
            aspectRatioClasses[aspectRatio],
            isDragging
              ? 'border-[#8b5cf6] bg-[#8b5cf6]/10'
              : 'border-[#2a2a3e] bg-[#1a1a2e] hover:border-[#3a3a4e]'
          )}
        >
          <input
            type="file"
            accept="image/*"
            onChange={handleInputChange}
            className="hidden"
          />
          <div className="flex flex-col items-center gap-3 p-6">
            <div className={cn(
              'p-4 rounded-full transition-colors',
              isDragging ? 'bg-[#8b5cf6]/20' : 'bg-[#2a2a3e]'
            )}>
              {isDragging ? (
                <Upload className="w-8 h-8 text-[#8b5cf6]" />
              ) : (
                <ImageIcon className="w-8 h-8 text-gray-500" />
              )}
            </div>
            <div className="text-center">
              <p className="text-gray-300 font-medium">
                {isDragging ? 'Drop image here' : 'Click or drag to upload'}
              </p>
              <p className="text-gray-500 text-sm mt-1">
                PNG, JPG, GIF up to 10MB
              </p>
            </div>
          </div>
        </label>
      )}
    </div>
  );
}
