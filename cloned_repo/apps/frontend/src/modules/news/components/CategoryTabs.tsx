import React from 'react';
import { motion } from 'motion/react';
import { cn } from '@/lib/utils';
import { 
  Flame, 
  Layers, 
  Store, 
  Sparkles, 
  TrendingUp, 
  Cpu, 
  Rss 
} from 'lucide-react';

export interface NewsCategory {
  id: string;
  label: string;
  labelBn: string;
  icon: React.ComponentType<any>;
  color: string;
}

export const NEWS_CATEGORIES: NewsCategory[] = [
  { id: 'all', label: 'All News', labelBn: 'সব খবর', icon: Rss, color: 'from-[var(--pm-accent)] to-orange-600' },
  { id: 'trending', label: 'Trending', labelBn: 'জনপ্রিয় খবর', icon: Flame, color: 'from-amber-500 to-red-600' },
  { id: 'wholesale', label: 'Wholesale BD', labelBn: 'পাইকারি বাজার', icon: Layers, color: 'from-blue-600 to-indigo-700' },
  { id: 'retail', label: 'Retail Trends', labelBn: 'খুচরা মার্কেট', icon: Store, color: 'from-pink-600 to-rose-700' },
  { id: 'jamdani', label: 'Jamdani/Heritage', labelBn: 'জামদানি ঐতিহ্য', icon: Sparkles, color: 'from-amber-400 to-yellow-600' },
  { id: 'business', label: 'SME Secrets', labelBn: 'ব্যবসা গাইড', icon: TrendingUp, color: 'from-emerald-500 to-teal-700' },
  { id: 'tech', label: 'E-Commerce Tech', labelBn: 'ট্রেড টেকনোলজি', icon: Cpu, color: 'from-orange-500 to-amber-600' },
];

interface CategoryTabsProps {
  activeCategory: string;
  onCategoryChange: (categoryId: string) => void;
}

export const CategoryTabs: React.FC<CategoryTabsProps> = ({
  activeCategory,
  onCategoryChange,
}) => {
  return (
    <div className="w-full overflow-x-auto no-scrollbar py-3 px-1">
      <div className="flex items-center gap-3 min-w-max px-2">
        {NEWS_CATEGORIES.map((cat, i) => {
          const isActive = activeCategory === cat.id;
          const IconComponent = cat.icon;

          return (
            <motion.div
              key={cat.id}
              initial={{ opacity: 0, scale: 0.92 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: i * 0.03, duration: 0.3 }}
              className="h-12"
            >
              <button
                onClick={() => onCategoryChange(cat.id)}
                className={cn(
                  "relative flex items-center gap-3 min-w-[130px] h-full transition-all duration-300 rounded-2xl overflow-hidden cursor-pointer select-none border border-white/5",
                  isActive ? "border-transparent text-white" : "text-zinc-400 hover:text-white hover:bg-white/[0.03]"
                )}
                style={{ contentVisibility: 'auto' }}
              >
                {/* Background Layer with animation */}
                <div className="absolute inset-0 z-0">
                  {isActive ? (
                    <motion.div 
                      layoutId="active-news-category-bg"
                      className={cn("w-full h-full bg-gradient-to-r", cat.color)}
                      transition={{ type: "spring", stiffness: 380, damping: 30 }}
                    />
                  ) : (
                    <div className="w-full h-full bg-white/[0.02]" />
                  )}
                </div>

                {/* Content */}
                <div className="relative z-10 flex items-center gap-2.5 w-full h-full px-3">
                  <div className={cn(
                    "w-8 h-8 rounded-xl flex items-center justify-center shrink-0 transition-transform duration-300",
                    isActive ? "bg-white/20 scale-105" : "bg-white/5"
                  )}>
                    <IconComponent className="w-4 h-4" />
                  </div>

                  <div className="flex flex-col items-start text-left leading-tight overflow-hidden">
                    <span className="text-[10px] font-black tracking-tight truncate w-full">
                      {cat.labelBn}
                    </span>
                    <span className="text-[7.5px] font-bold uppercase tracking-[0.1em] opacity-60 truncate w-full">
                      {cat.label}
                    </span>
                  </div>
                </div>
              </button>
            </motion.div>
          );
        })}
      </div>
    </div>
  );
};
