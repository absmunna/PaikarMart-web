import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Construction } from 'lucide-react';
import { motion } from 'motion/react';

export const NotFound = () => {
  const navigate = useNavigate();
  return (
    <div className="flex flex-col items-center justify-center min-h-[60vh] p-4 text-center">
      <motion.div 
        initial={{ opacity: 0, scale: 0.8 }}
        animate={{ opacity: 1, scale: 1 }}
        className="w-24 h-24 bg-zinc-900 rounded-full flex items-center justify-center mb-6 shadow-xl shadow-black/5"
      >
        <Construction className="w-12 h-12 text-orange-500 animate-pulse" />
      </motion.div>
      <h1 className="text-3xl font-black text-white mb-2">Coming Soon</h1>
      <h2 className="text-xl font-bold text-orange-500 mb-4">404 - Not Found</h2>
      <p className="text-zinc-400 mb-8 max-w-sm">
        This portal or page is currently under construction. We are working hard to bring this feature to you!
      </p>
      <button 
        onClick={() => navigate('/')} 
        className="px-8 py-3 bg-orange-500 text-white font-bold rounded-xl shadow-lg shadow-orange-500/20 active:scale-95 transition-all"
      >
        Go Back Home
      </button>
    </div>
  );
};

export default NotFound;
