import React from 'react';
import { motion } from 'framer-motion';
import { ChevronRight, Laptop, Shirt, Sofa, Sparkles, Watch, Dumbbell, Apple } from 'lucide-react';

const categories = [
  { id: 1, name: 'Electronics', icon: Laptop, count: '1,245 Products', color: 'from-blue-500/20 to-indigo-500/20' },
  { id: 2, name: 'Fashion', icon: Shirt, count: '3,876 Products', color: 'from-pink-500/20 to-rose-500/20' },
  { id: 3, name: 'Home & Living', icon: Sofa, count: '982 Products', color: 'from-orange-500/20 to-amber-500/20' },
  { id: 4, name: 'Beauty', icon: Sparkles, count: '2,341 Products', color: 'from-purple-500/20 to-fuchsia-500/20' },
  { id: 5, name: 'Watch', icon: Watch, count: '654 Products', color: 'from-cyan-500/20 to-blue-500/20' },
  { id: 6, name: 'Sports', icon: Dumbbell, count: '445 Products', color: 'from-emerald-500/20 to-teal-500/20' },
  { id: 7, name: 'Grocery', icon: Apple, count: '1,120 Products', color: 'from-green-500/20 to-lime-500/20' },
];

export const CategorySection = () => {
  return (
    <div className="flex flex-col gap-4 py-4">
      <div className="flex items-center justify-between px-6">
        <h3 className="text-lg font-black text-[var(--pm-text)] flex items-center gap-2">
          Featured Categories
        </h3>
        <button className="text-[var(--pm-accent)] text-xs font-bold flex items-center gap-1 hover:underline">
          See All <ChevronRight className="w-3 h-3" />
        </button>
      </div>

      <div className="flex gap-4 overflow-x-auto px-6 pb-4 hide-scrollbar">
        {categories.map((cat) => (
          <motion.div 
            key={cat.id}
            className="flex flex-col items-center gap-3 shrink-0 group cursor-pointer"
            whileTap={{ scale: 0.95 }}
          >
            <div className={`w-16 h-16 rounded-[24px] bg-gradient-to-br ${cat.color} border border-[var(--pm-border)]/30 flex items-center justify-center transition-all group-hover:border-[var(--pm-accent)]/50 group-hover:shadow-lg group-hover:shadow-[var(--pm-accent)]/10`}>
              <cat.icon className="w-7 h-7 text-[var(--pm-text)] opacity-80 group-hover:opacity-100 group-hover:text-[var(--pm-accent)]" />
            </div>
            <div className="text-center">
              <p className="text-[11px] font-bold text-[var(--pm-text)] leading-none">{cat.name}</p>
              <p className="text-[8px] text-[var(--pm-text-muted)] mt-1">{cat.count}</p>
            </div>
          </motion.div>
        ))}
      </div>
    </div>
  );
};
