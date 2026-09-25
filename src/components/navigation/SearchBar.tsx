import React, { useState, useRef, useEffect } from 'react';
import { Search, X, TrendingUp, History, ChevronDown, Store, ArrowRight, Sparkles } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { mockProducts } from '@/lib/workspace-stub';

const CATEGORY_OPTIONS = [
  { id: 'all', label: 'সকল ক্যাটাগরি' },
  { id: 'wholesale', label: 'পাইকারি (B2B)' },
  { id: 'retail', label: 'খুচরা (Retail)' },
  { id: 'grocery', label: 'মুদি ও খামার' },
  { id: 'electronics', label: 'ইলেকট্রনিক্স' },
];

const trendingSearches = [
  'সুন্দরবনের খাঁটি মধু',
  'জামদানি শাড়ি হোলসেল',
  'স্মার্ট ওয়াচ',
  'চামড়ার জেনুইন ওয়ালেট',
  'সরিষার তেল পাইকারি'
];

export const SearchBar = () => {
  const [query, setQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [isFocused, setIsFocused] = useState(false);
  const [showCategoryMenu, setShowCategoryMenu] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);
  const navigate = useNavigate();

  // Close dropdown on click outside
  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (containerRef.current && !containerRef.current.contains(e.target as Node)) {
        setIsFocused(false);
        setShowCategoryMenu(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  // Filter products live
  const matchingProducts = query.trim().length > 0 
    ? mockProducts.filter((p: any) => {
        const q = query.toLowerCase();
        const matchesQuery = 
          (p.name || p.title || '').toLowerCase().includes(q) ||
          (p.category || '').toLowerCase().includes(q) ||
          (p.seller || '').toLowerCase().includes(q);
        
        if (selectedCategory === 'all') return matchesQuery;
        if (selectedCategory === 'wholesale') return matchesQuery && p.portal === 'wholesale';
        if (selectedCategory === 'retail') return matchesQuery && p.portal === 'b2c';
        return matchesQuery;
      }).slice(0, 5)
    : [];

  const handleSearchSubmit = (searchWord?: string) => {
    const term = searchWord !== undefined ? searchWord : query;
    if (!term.trim()) return;
    setIsFocused(false);
    setShowCategoryMenu(false);
    if (selectedCategory === 'wholesale') {
      navigate(`/wholesale?q=${encodeURIComponent(term)}`);
    } else {
      navigate(`/b2c?q=${encodeURIComponent(term)}`);
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      handleSearchSubmit();
    }
  };

  const currentCategoryLabel = CATEGORY_OPTIONS.find(c => c.id === selectedCategory)?.label || 'সকল ক্যাটাগরি';

  return (
    <div ref={containerRef} className="relative w-full select-none">
      
      {/* Search Input Bar with Category Selector */}
      <div className="relative w-full flex items-center bg-[var(--pm-surface-hover)] border border-[var(--pm-border)] rounded-2xl p-1 group focus-within:ring-2 focus-within:ring-[var(--pm-accent)]/30 focus-within:border-[var(--pm-accent)] transition-all duration-300 shadow-inner">
        
        {/* Category Dropdown Button (Desktop) */}
        <div className="relative hidden md:block">
          <button
            type="button"
            onClick={() => setShowCategoryMenu(!showCategoryMenu)}
            className="flex items-center gap-1.5 px-3 py-1.5 text-[11px] font-bold text-[var(--pm-text)] hover:text-[var(--pm-accent)] rounded-xl hover:bg-white/5 transition-colors border-r border-[var(--pm-border)] shrink-0"
          >
            <span>{currentCategoryLabel}</span>
            <ChevronDown className="w-3.5 h-3.5 text-[var(--pm-text-muted)]" />
          </button>

          {showCategoryMenu && (
            <div className="absolute top-full left-0 mt-2 w-44 rounded-2xl glass border border-[var(--pm-border)] shadow-2xl p-1.5 z-50 animate-in fade-in zoom-in-95">
              {CATEGORY_OPTIONS.map((cat) => (
                <button
                  key={cat.id}
                  type="button"
                  onClick={() => {
                    setSelectedCategory(cat.id);
                    setShowCategoryMenu(false);
                  }}
                  className={`w-full text-left px-3 py-2 text-xs font-semibold rounded-xl transition-all ${
                    selectedCategory === cat.id
                      ? 'bg-[var(--pm-accent)] text-white font-bold'
                      : 'text-[var(--pm-text)] hover:bg-[var(--pm-surface-hover)]'
                  }`}
                >
                  {cat.label}
                </button>
              ))}
            </div>
          )}
        </div>

        {/* Search Input */}
        <div className="flex-1 flex items-center pl-2.5 pr-1">
          <Search className="w-4 h-4 text-[var(--pm-accent)] shrink-0" />
          <input 
            type="text" 
            placeholder="পণ্য, পাইকারি প্রস্তুতকারক বা ব্র্যান্ড খুঁজুন..." 
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            onFocus={() => setIsFocused(true)}
            onKeyDown={handleKeyDown}
            className="w-full bg-transparent outline-none border-none text-xs text-[var(--pm-text)] pl-2.5 pr-2 placeholder-[var(--pm-text-muted)] font-medium"
          />
          {query && (
            <button
              type="button"
              onClick={() => setQuery('')}
              className="p-1 text-[var(--pm-text-muted)] hover:text-[var(--pm-text)] rounded-full transition-colors"
            >
              <X className="w-3.5 h-3.5" />
            </button>
          )}
        </div>

        {/* Submit Search Button */}
        <button
          type="button"
          onClick={() => handleSearchSubmit()}
          className="px-3.5 py-1.5 rounded-xl bg-[var(--pm-accent)] hover:bg-[var(--pm-accent-hover)] text-white text-xs font-bold transition-all shadow-sm active:scale-95 shrink-0 hidden sm:flex items-center gap-1"
        >
          <span>খুঁজুন</span>
        </button>
      </div>

      {/* Live Dropdown Overlay */}
      <AnimatePresence>
        {isFocused && (
          <motion.div
            initial={{ opacity: 0, y: 8, scale: 0.99 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 8, scale: 0.99 }}
            transition={{ duration: 0.2 }}
            className="absolute top-full left-0 right-0 mt-2 p-4 rounded-3xl glass border border-[var(--pm-border)] shadow-2xl z-50 overflow-hidden"
          >
            {query.trim() ? (
              <div className="flex flex-col gap-2">
                <div className="flex items-center justify-between pb-2 border-b border-white/5">
                  <span className="text-[10px] font-black text-[var(--pm-text-muted)] uppercase tracking-wider">
                    লাইভ অনুসন্ধান ফলাফল ({matchingProducts.length})
                  </span>
                  <button
                    onClick={() => handleSearchSubmit()}
                    className="text-[10px] font-bold text-[var(--pm-accent)] hover:underline flex items-center gap-1"
                  >
                    <span>সকল ফলাফল</span>
                    <ArrowRight className="w-3 h-3" />
                  </button>
                </div>

                {matchingProducts.length === 0 ? (
                  <div className="p-4 text-center text-xs text-[var(--pm-text-muted)]">
                    "{query}" এর সাথে মিল রেখে কোনো পণ্য পাওয়া যায়নি। Enter চাপুন পুরো ক্যাটালগ সার্চ করতে।
                  </div>
                ) : (
                  <div className="space-y-1.5">
                    {matchingProducts.map((prod: any) => (
                      <div
                        key={prod.id}
                        onClick={() => {
                          setIsFocused(false);
                          navigate(`/product/${prod.id}`);
                        }}
                        className="p-2 rounded-xl hover:bg-white/5 transition-all cursor-pointer flex items-center justify-between gap-3 group"
                      >
                        <div className="flex items-center gap-2.5 min-w-0">
                          <img
                            src={prod.image}
                            alt={prod.name}
                            className="w-10 h-10 rounded-lg object-cover bg-zinc-800 shrink-0"
                            referrerPolicy="no-referrer"
                          />
                          <div className="min-w-0">
                            <h5 className="text-xs font-bold text-[var(--pm-text)] truncate group-hover:text-[var(--pm-accent)] transition-colors">
                              {prod.name || prod.title}
                            </h5>
                            <span className="text-[10px] text-[var(--pm-text-muted)] flex items-center gap-1 mt-0.5">
                              <Store className="w-2.5 h-2.5 text-[var(--pm-accent)]" />
                              <span className="truncate">{prod.seller || prod.category}</span>
                            </span>
                          </div>
                        </div>
                        <span className="text-xs font-black text-[var(--pm-accent)] shrink-0">
                          ৳{prod.price.toLocaleString()}
                        </span>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            ) : (
              <div className="flex flex-col gap-4">
                {/* Trending Searches */}
                <div>
                  <div className="flex items-center gap-1.5 mb-2.5">
                    <TrendingUp className="w-3.5 h-3.5 text-[var(--pm-accent)]" />
                    <span className="text-[10px] font-black text-[var(--pm-text-muted)] uppercase tracking-wider">
                      জনপ্রিয় ট্রেন্ডিং অনুসন্ধান
                    </span>
                  </div>
                  <div className="flex flex-wrap gap-2">
                    {trendingSearches.map((item, i) => (
                      <button 
                        key={i} 
                        type="button"
                        className="text-[11px] font-bold text-[var(--pm-text)] bg-white/5 hover:bg-[var(--pm-accent)] hover:text-white border border-[var(--pm-border)] px-3 py-1 rounded-xl transition-all cursor-pointer active:scale-95"
                        onClick={() => {
                          setQuery(item);
                          handleSearchSubmit(item);
                        }}
                      >
                        #{item}
                      </button>
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
