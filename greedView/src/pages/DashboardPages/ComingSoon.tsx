import { motion } from 'framer-motion';
import { Construction, Sparkles } from 'lucide-react';

export function ComingSoon() {
  return (
    <div className="flex items-center justify-center h-full min-h-[600px]">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="text-center"
      >
        <motion.div
          animate={{ 
            rotate: [0, 5, -5, 0],
          }}
          transition={{ 
            duration: 2,
            repeat: Infinity,
            ease: "easeInOut" 
          }}
          className="inline-block mb-6"
        >
          <Construction className="w-24 h-24 text-[#00ff88] mx-auto" />
        </motion.div>
        
        <h2 className="text-4xl font-black text-white mb-4 flex items-center justify-center gap-2">
          Coming Soon
          <motion.span
            animate={{ 
              scale: [1, 1.2, 1],
              rotate: [0, 180, 360]
            }}
            transition={{ 
              duration: 2,
              repeat: Infinity,
            }}
          >
            <Sparkles className="w-6 h-6 text-[#ffd700]" />
          </motion.span>
        </h2>
        
        <p className="text-gray-400 text-lg max-w-md mx-auto">
          We're working hard to bring you this feature. Stay tuned for something amazing!
        </p>

        {/* Animated dots */}
        <div className="flex justify-center gap-2 mt-8">
          {[...Array(3)].map((_, i) => (
            <motion.div
              key={i}
              className="w-3 h-3 rounded-full bg-[#00ff88]"
              animate={{
                scale: [1, 1.5, 1],
                opacity: [0.5, 1, 0.5],
              }}
              transition={{
                duration: 1.5,
                repeat: Infinity,
                delay: i * 0.2,
              }}
            />
          ))}
        </div>
      </motion.div>
    </div>
  );
}
