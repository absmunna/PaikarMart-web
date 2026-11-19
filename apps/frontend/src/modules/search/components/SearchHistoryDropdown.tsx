import React, { useState, useEffect } from 'react';
import { History, ArrowRight } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { cn } from '@/lib/utils';

interface SearchHistoryDropdownProps {
  isVisible: boolean;
  onSelect: (query: string) => void;
  className?: string;
}

export const SearchHistoryDropdown: React.FC<SearchHistoryDropdownProps> = ({
  isVisible,
  onSelect,
  className
}) => {
  const [history, setHistory] = useState<string[]>([]);

  useEffect(() => {
    if (isVisible) {
      try {
        const saved = localStorage.getItem('paikarmart_search_history');
        if (saved) {
          const parsed = JSON.parse(saved);
          if (Array.isArray(parsed)) {
            setHistory(parsed.slice(0, 5));
          }
        }
      } catch {
        setHistory([]);
      }
    }
  }, [isVisible]);

  if (!isVisible || history.length === 0) return null;

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0, y: -10 }}
        animate={{ opacity: 1, y: 0 }}
        exit={{ opacity: 0, y: -10 }}
        className={cn(
          "absolute left-0 right-0 top-full mt-2 bg-zinc-950/95 border border-white/10 rounded-2xl shadow-2xl backdrop-blur-xl z-50 overflow-hidden py-2",
          className
        )}
      >
        <div className="px-4 py-2 border-b border-white/5 flex items-center justify-between">
          <div className="flex items-center gap-1.5 text-zinc-400">
            <History className="w-3 h-3 text-[var(--pm-accent)]" />
            <span className="text-[10px] font-black uppercase tracking-wider">Recent Searches</span>
          </div>
        </div>
        <div className="flex flex-col">
          {history.map((item, idx) => (
            <button
              key={idx}
              onMouseDown={(e) => {
                e.preventDefault();
                onSelect(item);
              }}
              className="flex items-center justify-between px-4 py-2.5 hover:bg-white/5 text-xs text-zinc-300 hover:text-white transition-all text-left group cursor-pointer"
            >
              <span className="truncate">{item}</span>
              <ArrowRight className="w-3.5 h-3.5 opacity-0 group-hover:opacity-100 transition-all text-[var(--pm-accent)]" />
            </button>
          ))}
        </div>
      </motion.div>
    </AnimatePresence>
  );
};

export default SearchHistoryDropdown;
