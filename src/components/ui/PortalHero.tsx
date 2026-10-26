import React from 'react';
import { motion } from 'motion/react';
import { Sparkles, ArrowRight } from 'lucide-react';

interface PortalHeroProps {
  title: string;
  subtitle: string;
  badge?: string;
  image?: string;
  ctaText?: string;
  onCtaClick?: () => void;
  gradient?: string;
}

export const PortalHero: React.FC<PortalHeroProps> = ({
  title,
  subtitle,
  badge,
  image = 'https://images.unsplash.com/photo-1607082348824-0a96f2a4b9da?w=1200&auto=format&fit=crop',
  ctaText = 'Explore Now',
  onCtaClick,
  gradient = 'from-[#05050a] via-[#121220]/80 to-transparent'
}) => {
  return (
    <motion.div 
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      whileHover={{ y: -4 }}
      className="relative w-full h-[200px] sm:h-[280px] rounded-[2.5rem] overflow-hidden group shadow-2xl border border-white/10"
    >
      {/* Background Image with Parallax & Scanning Effect */}
      <div className="absolute inset-0 z-0">
        <img 
          src={image} 
          alt={title}
          className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-[10s] ease-out opacity-50 grayscale group-hover:grayscale-0"
          referrerPolicy="no-referrer"
        />
        {/* Futuristic Scanning Line */}
        <div className="absolute inset-0 bg-gradient-to-b from-transparent via-cyan-500/10 to-transparent h-20 w-full -translate-y-full group-hover:animate-[scan_3s_linear_infinite] pointer-events-none z-10" />
      </div>
      
      {/* Gradients */}
      <div className={`absolute inset-0 bg-gradient-to-r ${gradient} z-10`} />
      <div className="absolute inset-0 bg-gradient-to-t from-[#05050a] via-transparent to-transparent z-10" />

      {/* Content Layer */}
      <div className="absolute inset-0 z-20 p-5 sm:p-8 flex flex-col justify-center gap-2 sm:gap-3">
        {badge && (
          <motion.div 
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.2 }}
            className="flex"
          >
            <span className="px-2.5 py-1 rounded-lg bg-cyan-500/10 backdrop-blur-md border border-cyan-500/30 text-[8px] sm:text-[9px] font-black text-cyan-400 uppercase tracking-[0.2em] flex items-center gap-2">
              <Sparkles className="w-2.5 h-2.5 sm:w-3.5 h-3.5" />
              {badge}
            </span>
          </motion.div>
        )}

        <div className="max-w-[90%] sm:max-w-[70%]">
          <motion.h1 
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
            className="text-lg sm:text-3xl font-black text-white leading-[1.1] uppercase tracking-tight drop-shadow-2xl"
          >
            {title}
          </motion.h1>
          <motion.p 
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4 }}
            className="text-[9px] sm:text-xs font-bold text-white/40 mt-1 sm:mt-2 leading-relaxed max-w-sm"
          >
            {subtitle}
          </motion.p>
        </div>

        <motion.div 
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5 }}
          className="mt-2 sm:mt-3"
        >
          <button 
            onClick={onCtaClick}
            className="group/btn px-4 sm:px-6 py-2 sm:py-3 rounded-xl bg-white text-black text-[8px] sm:text-[10px] font-black uppercase tracking-[0.2em] flex items-center gap-2.5 shadow-xl active:scale-95 hover:bg-cyan-500 hover:text-white transition-all transform-gpu"
          >
            {ctaText}
            <div className="w-4 h-4 sm:w-5 h-5 rounded-lg bg-black/5 flex items-center justify-center group-hover/btn:bg-white/20 group-hover/btn:translate-x-1 transition-all">
              <ArrowRight className="w-2.5 h-2.5 sm:w-3 h-3" />
            </div>
          </button>
        </motion.div>
      </div>

      {/* Floating Blobs (Desktop Only) */}
      <div className="hidden sm:block absolute top-10 right-10 w-32 h-32 bg-cyan-500/20 blur-[80px] rounded-full animate-pulse z-0" />
      <div className="hidden sm:block absolute bottom-10 right-20 w-48 h-24 bg-blue-500/10 blur-[100px] rounded-full z-0" />
    </motion.div>
  );
};
