import React, { useState, useEffect, useMemo } from 'react';
import { useNavigate, useSearchParams, Link } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Search, ArrowLeft, X, TrendingUp, Filter, ShoppingBag, 
  Store, Building2, Flame, Wrench, ChevronRight, Star, 
  MapPin, SlidersHorizontal, Tag, Sparkles
} from 'lucide-react';
import { mockProducts } from '@/lib/workspace-stub';

const POPULAR_SEARCHES = [
  'সুন্দরবনের মধু',
  'কটন টি-শার্ট',
  'এসি সার্ভিস',
  'স্মার্ট ওয়াচ',
  'অর্গানিক চাল',
  'খাঁটি গাওয়া ঘি',
  'ট্রাক ও লজিস্টিকস',
  'পাইকারি ফেব্রিক'
];

const SEARCH_CATEGORIES = [
  { id: 'all', label: 'সকল', icon: Sparkles },
  { id: 'wholesale', label: 'পাইকারি আড়ত', icon: Building2 },
  { id: 'retail', label: 'খুচরা পণ্য', icon: ShoppingBag },
  { id: 'demand', label: 'ডিমান্ড ও চাহিদা', icon: Flame },
  { id: 'services', label: 'সার্ভিস হাব', icon: Wrench },
  { id: 'sellers', label: 'মার্চেন্ট ও শপ', icon: Store }
];

export const SearchPage: React.FC = () => {
  const navigate = useNavigate();
  const [searchParams, setSearchParams] = useSearchParams();
  const initialQuery = searchParams.get('q') || '';
  
  const [query, setQuery] = useState(initialQuery);
  const [activeCategory, setActiveCategory] = useState('all');
  const [recentSearches, setRecentSearches] = useState<string[]>(() => {
    try {
      const saved = localStorage.getItem('pm_recent_searches');
      return saved ? JSON.parse(saved) : ['সুন্দরবনের মধু', 'টি-শার্ট'];
    } catch {
      return ['সুন্দরবনের মধু', 'টি-শার্ট'];
    }
  });

  // Sync query state when URL param changes
  useEffect(() => {
    const q = searchParams.get('q');
    if (q !== null && q !== query) {
      setQuery(q);
    }
  }, [searchParams]);

  const saveRecentSearch = (term: string) => {
    if (!term.trim()) return;
    const updated = [term.trim(), ...recentSearches.filter(s => s.toLowerCase() !== term.toLowerCase())].slice(0, 6);
    setRecentSearches(updated);
    try {
      localStorage.setItem('pm_recent_searches', JSON.stringify(updated));
    } catch {}
  };

  const handleSearchSubmit = (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    if (query.trim()) {
      setSearchParams({ q: query.trim() });
      saveRecentSearch(query.trim());
    }
  };

  const clearQuery = () => {
    setQuery('');
    setSearchParams({});
  };

  // Filtered Products
  const filteredProducts = useMemo(() => {
    if (!query.trim()) return mockProducts.slice(0, 8);
    const qLower = query.toLowerCase().trim();
    return mockProducts.filter((p: any) => 
      (p.title || p.name || '').toLowerCase().includes(qLower) || 
      (p.category || '').toLowerCase().includes(qLower) ||
      (typeof p.vendor === 'string' ? p.vendor : p.vendor?.name || p.vendorName || p.seller || '').toLowerCase().includes(qLower)
    );
  }, [query]);

  return (
    <div className="min-h-screen bg-[var(--pm-bg)] text-[var(--pm-text)] pb-20 select-none">
      
      {/* ━━━ TOP SEARCH HEADER ━━━ */}
      <div className="sticky top-0 z-40 bg-[var(--pm-surface)]/95 backdrop-blur-md border-b border-[var(--pm-border)] shadow-sm">
        <div className="max-w-4xl mx-auto px-3 sm:px-4 py-2.5 sm:py-3 flex items-center gap-2 sm:gap-3">
          
          {/* Back button */}
          <button
            onClick={() => navigate(-1)}
            className="p-2 rounded-xl text-[var(--pm-text-muted)] hover:text-[var(--pm-text)] hover:bg-[var(--pm-surface-hover)] active:scale-95 transition-all shrink-0"
            title="ফিরে যান"
          >
            <ArrowLeft className="w-5 h-5" />
          </button>

          {/* Search Input Box */}
          <form onSubmit={handleSearchSubmit} className="flex-1 relative flex items-center">
            <Search className="absolute left-3.5 w-4 h-4 text-[var(--pm-accent)] pointer-events-none" />
            
            <input
              type="text"
              value={query}
              onChange={(e) => {
                setQuery(e.target.value);
                if (e.target.value) {
                  setSearchParams({ q: e.target.value });
                } else {
                  setSearchParams({});
                }
              }}
              placeholder="পণ্য, পাইকারি আড়ত, সার্ভিস বা ডিমান্ড খুঁজুন..."
              className="w-full bg-[var(--pm-bg)] border border-[var(--pm-border)] rounded-2xl py-2.5 pl-10 pr-9 text-xs sm:text-sm text-[var(--pm-text)] placeholder:text-[var(--pm-text-muted)] focus:outline-none focus:border-[var(--pm-accent)] transition-all font-medium"
              autoFocus
            />

            {query && (
              <button
                type="button"
                onClick={clearQuery}
                className="absolute right-3 p-1 rounded-full text-[var(--pm-text-muted)] hover:text-[var(--pm-text)] bg-[var(--pm-surface-hover)] transition-colors"
                title="মুছুন"
              >
                <X className="w-3.5 h-3.5" />
              </button>
            )}
          </form>

          {/* Search Button */}
          <button
            type="button"
            onClick={() => handleSearchSubmit()}
            className="px-3.5 py-2.5 rounded-2xl bg-[var(--pm-accent)] text-white text-xs font-black shadow-md shadow-[var(--pm-accent)]/20 active:scale-95 transition-all shrink-0 hidden sm:inline-flex items-center gap-1.5"
          >
            সার্চ করুন
          </button>
        </div>

        {/* ━━━ CATEGORY HORIZONTAL FILTER TABS ━━━ */}
        <div className="max-w-4xl mx-auto px-3 sm:px-4 pb-2.5 flex items-center gap-1.5 overflow-x-auto hide-scrollbar">
          {SEARCH_CATEGORIES.map(cat => {
            const Icon = cat.icon;
            const isActive = activeCategory === cat.id;
            return (
              <button
                key={cat.id}
                onClick={() => setActiveCategory(cat.id)}
                className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-bold transition-all whitespace-nowrap shrink-0 cursor-pointer ${
                  isActive
                    ? 'bg-[var(--pm-accent)] text-white shadow-xs'
                    : 'bg-[var(--pm-bg)] text-[var(--pm-text-muted)] hover:text-[var(--pm-text)] border border-[var(--pm-border)]/60'
                }`}
              >
                <Icon className="w-3.5 h-3.5" />
                <span>{cat.label}</span>
              </button>
            );
          })}
        </div>
      </div>

      {/* ━━━ MAIN BODY CONTENT ━━━ */}
      <div className="max-w-4xl mx-auto px-3 sm:px-4 py-4 space-y-5">
        
        {/* If no query, show Recent and Trending searches */}
        {!query.trim() && (
          <div className="space-y-4">
            
            {/* Recent Searches */}
            {recentSearches.length > 0 && (
              <div className="bg-[var(--pm-surface)] rounded-2xl p-4 border border-[var(--pm-border)]">
                <div className="flex items-center justify-between mb-2.5">
                  <h3 className="text-xs font-black text-[var(--pm-text)] flex items-center gap-1.5 uppercase tracking-wider">
                    <TrendingUp className="w-3.5 h-3.5 text-[var(--pm-accent)]" /> সাম্প্রতিক অনুসন্ধান
                  </h3>
                  <button
                    onClick={() => {
                      setRecentSearches([]);
                      localStorage.removeItem('pm_recent_searches');
                    }}
                    className="text-[10px] text-[var(--pm-text-muted)] hover:text-red-500 font-bold transition-colors"
                  >
                    ক্লিয়ার করুন
                  </button>
                </div>
                <div className="flex flex-wrap gap-1.5">
                  {recentSearches.map((item, idx) => (
                    <button
                      key={idx}
                      onClick={() => {
                        setQuery(item);
                        setSearchParams({ q: item });
                      }}
                      className="px-3 py-1.5 rounded-xl text-xs font-semibold bg-[var(--pm-bg)] border border-[var(--pm-border)] text-[var(--pm-text)] hover:border-[var(--pm-accent)] transition-all flex items-center gap-1"
                    >
                      <span>{item}</span>
                    </button>
                  ))}
                </div>
              </div>
            )}

            {/* Popular Trending Keywords */}
            <div className="bg-[var(--pm-surface)] rounded-2xl p-4 border border-[var(--pm-border)]">
              <h3 className="text-xs font-black text-[var(--pm-text)] flex items-center gap-1.5 uppercase tracking-wider mb-3">
                <Sparkles className="w-3.5 h-3.5 text-amber-400" /> জনপ্রিয় কিওয়ার্ডসমূহ
              </h3>
              <div className="flex flex-wrap gap-2">
                {POPULAR_SEARCHES.map((item, idx) => (
                  <button
                    key={idx}
                    onClick={() => {
                      setQuery(item);
                      setSearchParams({ q: item });
                      saveRecentSearch(item);
                    }}
                    className="px-3 py-1.5 rounded-xl text-xs font-bold bg-[var(--pm-accent)]/10 text-[var(--pm-accent)] border border-[var(--pm-accent)]/20 hover:bg-[var(--pm-accent)] hover:text-white transition-all active:scale-95"
                  >
                    {item}
                  </button>
                ))}
              </div>
            </div>

            {/* Direct Hub Shortcuts */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5">
              {[
                { title: 'পাইকারি আড়ত', subtitle: 'কারখানা রেট', path: '/wholesale', color: 'from-blue-600/20 to-indigo-600/10' },
                { title: 'খুচরা মার্কেট', subtitle: 'রিটেইল কেনাকাটা', path: '/b2c', color: 'from-emerald-600/20 to-teal-600/10' },
                { title: 'ডিমান্ড বোর্ড', subtitle: 'বায়ার চাহিদা', path: '/demand', color: 'from-amber-600/20 to-orange-600/10' },
                { title: 'সার্ভিস হাব', subtitle: 'মেরামত ও টেকনিশিয়ান', path: '/services', color: 'from-purple-600/20 to-pink-600/10' },
              ].map((hub, i) => (
                <Link
                  key={i}
                  to={hub.path}
                  className={`p-3 rounded-2xl bg-gradient-to-br ${hub.color} border border-[var(--pm-border)] hover:border-[var(--pm-accent)] transition-all flex flex-col justify-between`}
                >
                  <span className="text-xs font-black text-[var(--pm-text)]">{hub.title}</span>
                  <span className="text-[10px] text-[var(--pm-text-muted)] font-medium mt-1">{hub.subtitle}</span>
                </Link>
              ))}
            </div>

          </div>
        )}

        {/* ━━━ SEARCH RESULTS STREAM ━━━ */}
        <div className="space-y-3">
          <div className="flex items-center justify-between px-1">
            <h2 className="text-xs sm:text-sm font-black text-[var(--pm-text)]">
              {query.trim() ? `"${query}" এর সার্চ ফলাফল` : 'জনপ্রিয় পণ্যসমূহ'}
            </h2>
            <span className="text-[11px] text-[var(--pm-text-muted)] font-bold">
              {filteredProducts.length} টি ফলাফল
            </span>
          </div>

          {filteredProducts.length > 0 ? (
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-3">
              {filteredProducts.map((product) => (
                <Link
                  key={product.id}
                  to={`/product/${product.id}`}
                  className="bg-[var(--pm-surface)] rounded-2xl border border-[var(--pm-border)] overflow-hidden hover:border-[var(--pm-accent)]/50 transition-all flex flex-col justify-between group shadow-2xs hover:shadow-md"
                >
                  {/* Image */}
                  <div className="aspect-square bg-[var(--pm-bg)] relative overflow-hidden">
                    <img 
                      src={product.image} 
                      alt={product.title} 
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                    />
                    {product.badge && (
                      <span className="absolute top-2 left-2 bg-[var(--pm-accent)] text-white text-[9px] font-black px-1.5 py-0.5 rounded-md shadow-xs">
                        {product.badge}
                      </span>
                    )}
                  </div>

                  {/* Details */}
                  <div className="p-3 flex flex-col gap-1.5 flex-1 justify-between">
                    <div>
                      <span className="text-[9px] font-bold text-[var(--pm-text-muted)] uppercase tracking-wider block truncate">
                        {product.category}
                      </span>
                      <h3 className="text-xs font-bold text-[var(--pm-text)] line-clamp-2 leading-tight group-hover:text-[var(--pm-accent)] transition-colors">
                        {product.title}
                      </h3>
                    </div>

                    <div className="pt-1.5 border-t border-[var(--pm-border)]/40 flex items-baseline justify-between">
                      <div>
                        <span className="text-xs sm:text-sm font-black text-[var(--pm-accent)]">
                          ৳{product.price.toLocaleString()}
                        </span>
                        {product.originalPrice && (
                          <span className="text-[9px] text-[var(--pm-text-muted)] line-through ml-1">
                            ৳{product.originalPrice.toLocaleString()}
                          </span>
                        )}
                      </div>
                      <span className="text-[9px] text-amber-400 font-bold flex items-center gap-0.5">
                        <Star className="w-2.5 h-2.5 fill-amber-400 text-amber-400" /> {product.rating}
                      </span>
                    </div>
                  </div>
                </Link>
              ))}
            </div>
          ) : (
            /* Empty State */
            <div className="bg-[var(--pm-surface)] rounded-3xl p-8 text-center border border-[var(--pm-border)] flex flex-col items-center gap-3">
              <div className="w-12 h-12 rounded-full bg-red-500/10 text-red-500 flex items-center justify-center">
                <Search className="w-6 h-6" />
              </div>
              <h3 className="text-sm font-black text-[var(--pm-text)]">কোনো ফলাফল পাওয়া যায়নি</h3>
              <p className="text-xs text-[var(--pm-text-muted)] max-w-xs mx-auto">
                "{query}" এর জন্য কোনো পণ্য পাওয়া যায়নি। বানান ঠিক আছে কি না দেখে পুনরায় চেষ্টা করুন অথবা জনপ্রিয় কিওয়ার্ড নির্বাচন করুন।
              </p>
              <button
                onClick={clearQuery}
                className="mt-2 px-4 py-2 rounded-xl bg-[var(--pm-accent)] text-white text-xs font-bold active:scale-95 transition-all"
              >
                সব পণ্য দেখুন
              </button>
            </div>
          )}
        </div>

      </div>
    </div>
  );
};

export default SearchPage;
