import { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Zap, Shield, Target } from 'lucide-react';

interface DashboardLoadingScreenProps {
  onLoadComplete: () => void;
}

export function DashboardLoadingScreen({ onLoadComplete }: DashboardLoadingScreenProps) {
  const [progress, setProgress] = useState(0);
  const [loadingText, setLoadingText] = useState('Initializing Greed Systems...');

  useEffect(() => {
    const texts = [
      'Initializing Greed Systems...',
      'Syncing Hunter Data...',
      'Loading Your Arsenal...',
      'Preparing Mission Briefs...',
      'Almost Ready...',
    ];

    let currentTextIndex = 0;
    const textInterval = setInterval(() => {
      currentTextIndex = (currentTextIndex + 1) % texts.length;
      setLoadingText(texts[currentTextIndex]);
    }, 800);

    // Progress animation
    const progressInterval = setInterval(() => {
      setProgress(prev => {
        if (prev >= 100) {
          clearInterval(progressInterval);
          clearInterval(textInterval);
          setTimeout(() => onLoadComplete(), 500);
          return 100;
        }
        return prev + 2;
      });
    }, 40);

    return () => {
      clearInterval(textInterval);
      clearInterval(progressInterval);
    };
  }, [onLoadComplete]);

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="fixed inset-0 z-[100] bg-[#0a0a0f] flex items-center justify-center overflow-hidden"
      >
        {/* Animated Cyber Grid Background */}
        <div className="absolute inset-0 opacity-20">
          <div className="cyber-grid"></div>
        </div>

        {/* Pulsing Rings */}
        <div className="absolute inset-0 flex items-center justify-center">
          {[...Array(3)].map((_, i) => (
            <motion.div
              key={i}
              className="absolute border border-[#00ff88]/30 rounded-full"
              initial={{ width: 0, height: 0, opacity: 0 }}
              animate={{
                width: [0, 400, 800],
                height: [0, 400, 800],
                opacity: [0, 0.5, 0],
              }}
              transition={{
                duration: 3,
                repeat: Infinity,
                delay: i * 1,
                ease: 'easeOut',
              }}
            />
          ))}
        </div>

        {/* Central Emblem/Sigil */}
        <div className="relative z-10 flex flex-col items-center">
          {/* Rotating Outer Ring */}
          <motion.div
            className="relative w-48 h-48 mb-12"
            animate={{ rotate: 360 }}
            transition={{ duration: 8, repeat: Infinity, ease: 'linear' }}
          >
            {/* Outer hexagon ring */}
            <svg
              className="w-full h-full"
              viewBox="0 0 200 200"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
            >
              <motion.path
                d="M100 10 L170 50 L170 150 L100 190 L30 150 L30 50 Z"
                stroke="url(#gradient1)"
                strokeWidth="2"
                fill="none"
                initial={{ pathLength: 0 }}
                animate={{ pathLength: 1 }}
                transition={{ duration: 2, ease: 'easeInOut' }}
              />
              <defs>
                <linearGradient id="gradient1" x1="0%" y1="0%" x2="100%" y2="100%">
                  <stop offset="0%" stopColor="#00ff88" />
                  <stop offset="50%" stopColor="#00d9ff" />
                  <stop offset="100%" stopColor="#8b5cf6" />
                </linearGradient>
              </defs>
            </svg>

            {/* Inner elements */}
            <div className="absolute inset-0 flex items-center justify-center">
              <motion.div
                className="relative"
                animate={{ rotate: -360 }}
                transition={{ duration: 6, repeat: Infinity, ease: 'linear' }}
              >
                {/* Three orbiting icons */}
                {[Zap, Shield, Target].map((Icon, index) => (
                  <motion.div
                    key={index}
                    className="absolute"
                    style={{
                      left: '50%',
                      top: '50%',
                      marginLeft: '-12px',
                      marginTop: '-12px',
                    }}
                    animate={{
                      x: Math.cos((index * 2 * Math.PI) / 3) * 40,
                      y: Math.sin((index * 2 * Math.PI) / 3) * 40,
                    }}
                  >
                    <Icon
                      className="w-6 h-6"
                      style={{
                        color: index === 0 ? '#00ff88' : index === 1 ? '#00d9ff' : '#8b5cf6',
                        filter: 'drop-shadow(0 0 8px currentColor)',
                      }}
                    />
                  </motion.div>
                ))}
              </motion.div>
            </div>
          </motion.div>

          {/* Center Logo */}
          <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2">
            <motion.div
              initial={{ scale: 0, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              transition={{ delay: 0.5, duration: 0.8, type: 'spring' }}
            >
              <h1 className="text-4xl font-black text-center">
                <span className="text-[#00ff88] neon-glow">GREED</span>
                <br />
                <span className="text-[#00d9ff] neon-glow">HUNTER</span>
              </h1>
            </motion.div>
          </div>

          {/* Loading Text */}
          <motion.div
            className="text-center mt-64"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 1 }}
          >
            <p className="text-[#00ff88] mb-4 text-sm tracking-wider">{loadingText}</p>
            
            {/* Progress Bar */}
            <div className="w-64 h-1 bg-[#1a1a2e] rounded-full overflow-hidden">
              <motion.div
                className="h-full bg-gradient-to-r from-[#00ff88] via-[#00d9ff] to-[#8b5cf6]"
                initial={{ width: '0%' }}
                animate={{ width: `${progress}%` }}
                transition={{ duration: 0.3 }}
              />
            </div>
            
            <p className="text-gray-500 text-xs mt-2">{progress}%</p>
          </motion.div>
        </div>

        {/* Particle Effects */}
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
          {[...Array(20)].map((_, i) => (
            <motion.div
              key={i}
              className="absolute w-1 h-1 bg-[#00ff88] rounded-full"
              style={{
                left: `${Math.random() * 100}%`,
                top: `${Math.random() * 100}%`,
              }}
              animate={{
                opacity: [0, 1, 0],
                scale: [0, 1.5, 0],
              }}
              transition={{
                duration: 2,
                repeat: Infinity,
                delay: Math.random() * 2,
              }}
            />
          ))}
        </div>
      </motion.div>
    </AnimatePresence>
  );
}
