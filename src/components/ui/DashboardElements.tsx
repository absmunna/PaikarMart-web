import React, { useState } from 'react';
import { RefreshCw, ShieldCheck, ChevronDown, BarChart, Users } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { cn } from '@/lib/utils';

export const LiveBalanceCard = ({ balance }: { balance: number }) => (
  <div className="pm-glass-card p-5 relative group overflow-hidden">
    <div className="absolute inset-0 bg-gradient-to-br from-cyan-500/[0.03] to-transparent opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none" />
    <div className="flex justify-between items-center mb-3 relative z-10">
      <span className="text-[10px] font-black text-zinc-500 uppercase tracking-widest">উপলব্ধ ব্যালেন্স</span>
      <button className="text-cyan-500 p-2 hover:bg-cyan-500/10 rounded-full transition-all active:rotate-180"><RefreshCw className="w-4 h-4" /></button>
    </div>
    <div className="text-3xl font-black text-white relative z-10 tabular-nums">৳{balance.toLocaleString()}</div>
    <div className="mt-3 flex items-center gap-1.5 text-[9px] text-cyan-400 font-black bg-cyan-400/10 border border-cyan-400/20 px-2.5 py-1.5 rounded-xl w-fit relative z-10">
      <ShieldCheck className="w-3.5 h-3.5" /> এসক্রো ট্রেড প্রটেক্টেড (Escrow)
    </div>
  </div>
);

export const GraphToggle = ({ active, onChange }: { active: 'sales' | 'views', onChange: (v: 'sales' | 'views') => void }) => (
  <div className="flex bg-white/[0.02] p-1.5 rounded-full border border-white/5 w-fit backdrop-blur-md">
    <button 
      onClick={() => onChange('sales')}
      className={cn(
        "px-4 py-1.5 rounded-full text-[9px] font-black uppercase tracking-widest transition-all",
        active === 'sales' ? 'bg-cyan-500 text-black shadow-lg shadow-cyan-500/20' : 'text-zinc-500 hover:text-zinc-300'
      )}
    >
      <BarChart className="w-3.5 h-3.5 inline mr-1.5" /> বিক্রি
    </button>
    <button 
      onClick={() => onChange('views')}
      className={cn(
        "px-4 py-1.5 rounded-full text-[9px] font-black uppercase tracking-widest transition-all",
        active === 'views' ? 'bg-cyan-500 text-black shadow-lg shadow-cyan-500/20' : 'text-zinc-500 hover:text-zinc-300'
      )}
    >
      <Users className="w-3.5 h-3.5 inline mr-1.5" /> ট্রাফিক
    </button>
  </div>
);

export const RatingStarsDropdown = ({ rating, distribution }: { rating: number, distribution: Record<number, number> }) => {
  const [isOpen, setIsOpen] = useState(false);
  return (
    <div className="relative">
      <button onClick={() => setIsOpen(!isOpen)} className="flex items-center gap-1.5 text-[11px] font-black text-white hover:text-cyan-400 transition-colors uppercase tracking-widest bg-white/5 border border-white/5 px-3 py-1.5 rounded-full">
        {rating} <span className="text-amber-500">★</span> <ChevronDown className="w-3 h-3 text-zinc-500" />
      </button>
      <AnimatePresence>
        {isOpen && (
          <motion.div 
            initial={{ opacity: 0, y: 10, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 10, scale: 0.95 }}
            className="absolute top-10 right-0 pm-glass-card p-4 w-48 z-20 shadow-2xl shadow-black/50"
          >
            {[5,4,3,2,1].map(r => (
              <div key={r} className="flex items-center gap-2.5 text-[10px] text-zinc-400 mb-2.5 last:mb-0">
                <span className="font-black w-3 text-zinc-500">{r}</span>
                <div className="h-1.5 flex-1 bg-white/5 rounded-full overflow-hidden border border-white/5">
                  <motion.div 
                    initial={{ width: 0 }}
                    animate={{ width: `${distribution[r]}%` }}
                    className="h-full bg-gradient-to-r from-amber-500 to-orange-500" 
                  />
                </div>
                <span className="w-8 text-right font-bold text-zinc-500 tabular-nums">{distribution[r]}%</span>
              </div>
            ))}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};
