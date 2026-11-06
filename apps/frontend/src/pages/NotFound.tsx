import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Construction } from 'lucide-react';
import { motion } from 'framer-motion';

export const NotFound = () => {
  const navigate = useNavigate();
  return (
    <div className="flex flex-col items-center justify-center min-h-[60vh] p-4 text-center">
      <motion.div 
        initial={{ opacity: 0, scale: 0.8 }}
        animate={{ opacity: 1, scale: 1 }}
        className="w-24 h-24 bg-[var(--pm-surface)] rounded-full flex items-center justify-center mb-6 shadow-xl shadow-black/5"
      >
        <Construction className="w-12 h-12 text-[var(--pm-accent)] animate-pulse" />
      </motion.div>
      <h1 className="text-3xl font-black text-[var(--pm-text)] mb-2">Coming Soon</h1>
      <h2 className="text-xl font-bold text-[var(--pm-accent)] mb-4">404 - Not Found</h2>
      <p className="text-[var(--pm-text-secondary)] mb-8 max-w-sm">
        This portal or page is currently under construction. We are working hard to bring this feature to you!
      </p>
      <button 
        onClick={() => navigate('/')} 
        className="px-8 py-3 bg-[var(--pm-accent)] text-white font-bold rounded-xl shadow-lg shadow-[var(--pm-accent)]/20 active:scale-95 transition-all"
      >
        Go Back Home
      </button>
    </div>
  );
};
