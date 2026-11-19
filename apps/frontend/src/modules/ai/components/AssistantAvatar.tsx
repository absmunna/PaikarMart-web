import React from 'react';
import { Bot, Sparkles } from 'lucide-react';
import { motion } from 'motion/react';

export const AssistantAvatar: React.FC<{ isAnimating?: boolean, size?: 'sm' | 'md' | 'lg' }> = ({ 
  isAnimating = false,
  size = 'md' 
}) => {
  const sizeClasses = {
    sm: 'w-8 h-8',
    md: 'w-10 h-10',
    lg: 'w-14 h-14'
  };

  return (
    <div className={`relative flex items-center justify-center rounded-full bg-gradient-to-tr from-orange-500 to-amber-400 ${sizeClasses[size]} shadow-lg shadow-orange-500/20`}>
      <Bot className={`${size === 'lg' ? 'w-8 h-8' : 'w-5 h-5'} text-white`} />
      
      {isAnimating && (
        <>
          <motion.div
            className="absolute -inset-1 rounded-full border border-orange-400/50"
            animate={{ scale: [1, 1.2, 1], opacity: [0.5, 0, 0.5] }}
            transition={{ duration: 2, repeat: Infinity }}
          />
          <motion.div
            className="absolute -top-1 -right-1"
            animate={{ rotate: 360, scale: [1, 1.2, 1] }}
            transition={{ duration: 3, repeat: Infinity }}
          >
            <Sparkles className="w-4 h-4 text-amber-200" />
          </motion.div>
        </>
      )}
    </div>
  );
};
