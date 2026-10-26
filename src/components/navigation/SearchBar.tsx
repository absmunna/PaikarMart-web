import React, { useState, useRef, useEffect } from 'react';
import { Search, X, TrendingUp, History } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

const trendingSearches = [
  'iPhone 15 Pro Max',
  'Wholesale Saree Bangladesh',
  'Xiaomi Smart Watch',
  'Organic Mango Rajshahi',
];

export const SearchBar = () => {
  const [query, setQuery] = useState('');
  const [isFocused, setIsFocused] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);

  // Close dropdown on click outside
  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (containerRef.current && !containerRef.current.contains(e.target as Node)) {
        setIsFocused(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  return (
    <div ref={containerRef} className="relative w-full">
      <div className="relative w-full flex items-center bg-[var(--pm-surface-hover)] border border-[var(--pm-border)] rounded-full px-4 py-2 group focus-within:ring-2 focus-within:ring-[var(--pm-accent)]/20 transition-all duration-300 shadow-inner">
        <Search className="w-4 h-4 text-[var(--pm-accent)] shrink-0 transition-colors" />
        <input 
          type="text" 
          placeholder="Search products, vendors..." 
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          onFocus={() => setIsFocused(true)}
          className="w-full bg-transparent outline-none border-none text-xs text-[var(--pm-text)] pl-3 pr-2 placeholder-[var(--pm-text-muted)]"
        />
        {query && (
          <X 
            className="w-4 h-4 text-[var(--pm-text-muted)] hover:text-[var(--pm-text)] cursor-pointer shrink-0" 
            onClick={() => setQuery('')}
          />
        )}
      </div>

      {/* Elegant Glassmorphic Dropdown */}
      <AnimatePresence>
        {isFocused && (
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 10 }}
            className="absolute top-full left-0 right-0 mt-2 p-4 rounded-3xl glass border border-[var(--pm-border)]/40 shadow-2xl z-50 overflow-hidden"
          >
            {query ? (
              <div className="flex flex-col gap-2">
                <span className="text-[10px] font-bold text-[var(--pm-text-muted)] uppercase tracking-wider">Search Results</span>
                <div className="p-3 text-center text-xs text-[var(--pm-text-muted)]">
                  Searching for "{query}"...
                </div>
              </div>
            ) : (
              <div className="flex flex-col gap-4">
                {/* Recent Searches */}
                <div>
                  <div className="flex items-center gap-1.5 mb-2">
                    <History className="w-3.5 h-3.5 text-[var(--pm-text-muted)]" />
                    <span className="text-[10px] font-bold text-[var(--pm-text-muted)] uppercase tracking-wider">Recent Searches</span>
                  </div>
                  <div className="flex flex-col gap-1.5">
                    {['Saree Wholesale', 'Gadget Shop'].map((item, i) => (
                      <span key={i} className="text-xs text-[var(--pm-text)] hover:text-[var(--pm-accent)] cursor-pointer py-1 px-2 rounded-lg hover:bg-white/5 transition-all">
                        {item}
                      </span>
                    ))}
                  </div>
                </div>

                {/* Trending Searches */}
                <div>
                  <div className="flex items-center gap-1.5 mb-2">
                    <TrendingUp className="w-3.5 h-3.5 text-[var(--pm-accent)]" />
                    <span className="text-[10px] font-bold text-[var(--pm-accent)] uppercase tracking-wider">Trending</span>
                  </div>
                  <div className="flex flex-wrap gap-2">
                    {trendingSearches.map((item, i) => (
                      <span 
                        key={i} 
                        className="text-[10px] font-semibold text-[var(--pm-text)] bg-white/5 border border-[var(--pm-border)]/20 px-3 py-1.5 rounded-full hover:border-[var(--pm-accent)]/50 transition-all cursor-pointer"
                        onClick={() => setQuery(item)}
                      >
                        {item}
                      </span>
                    ))}
                  </div>
                </div>
              </div>
            )}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};
