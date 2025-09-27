'use client';

import { useVibe } from './VibeProvider';
import { motion } from 'framer-motion';
import { Sparkles, Zap } from 'lucide-react';

export const VibeToggle = () => {
  const { vibeMode, toggleVibeMode } = useVibe();

  return (
    <motion.button
      onClick={toggleVibeMode}
      className="fixed top-4 right-4 z-50 p-3 rounded-2xl glass-button hover:hover-glow transition-all duration-300 group"
      whileHover={{ scale: 1.05 }}
      whileTap={{ scale: 0.95 }}
      aria-label="Toggle Vibe Mode"
    >
      <div className="flex items-center gap-2">
        {vibeMode ? (
          <Zap className="w-4 h-4 text-primary animate-pulse" />
        ) : (
          <Sparkles className="w-4 h-4 text-muted-foreground" />
        )}
        <span className="text-xs font-medium">
          {vibeMode ? 'Vibe On' : 'Vibe Off'}
        </span>
        <div 
          className={`w-2 h-2 rounded-full transition-all duration-300 ${
            vibeMode 
              ? 'bg-primary animate-pulse box-glow-primary' 
              : 'bg-muted-foreground'
          }`}
        />
      </div>
    </motion.button>
  );
};