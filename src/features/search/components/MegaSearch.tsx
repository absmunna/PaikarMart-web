import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  Search, X, TrendingUp, Clock, ArrowRight, 
  ShoppingBag, Users, FileText, Sparkles,
  ChevronRight, History
} from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { cn } from '@/lib/utils';

interface MegaSearchProps {
  isOpen: boolean;
  onClose: () => void;
}

const RECENT_SEARCHES = [
  "Wholesale cosmetics",
  "Dhaka to Chattogram logistics",
  "Fresh organic mangoes",
  "Verified sellers in Banani"
];

const TRENDING_KEYWORDS = [
  "Factory Direct", "Bulk Electronics", "Service Hub", "Emergency Demand"
];

const QUICK_RESULTS = {
  products: [
    { id: '1', title: 'Premium Cotton Fabrics', price: 450, category: 'Textiles' },
    { id: '2', title: 'Industrial Grade Motors', price: 12500, category: 'Hardware' },
  ],
  demands: [
    { id: 'd1', title: 'Need 5000 units of N95 Masks', budget: 'Negotiable' },
    { id: 'd2', title: 'Looking for reliable logistics Dhaka-Sylhet', budget: '৳15,000' },
  ],
  sellers: [
    { id: 's1', name: 'Al-Madina Enterprise', trustScore: '4.9', verified: true },
    { id: 's2', name: 'BD Tech Solutions', trustScore: '4.7', verified: true },
  ]
};

export const MegaSearch: React.FC<MegaSearchProps> = ({ isOpen, onClose }) => {
  const [query, setQuery] = useState('');
  const navigate = useNavigate();

  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'unset';
    }
  }, [isOpen]);

  const handleSearch = (q: string) => {
    if (!q) return;
    navigate(`/search?q=${encodeURIComponent(q)}`);
    onClose();
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-[1000] flex items-start justify-center pt-20 px-4 md:px-0">
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="absolute inset-0 bg-[#010804]/90 backdrop-blur-2xl"
          />

          <motion.div
            initial={{ opacity: 0, scale: 0.95, y: -20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: -20 }}
            className="relative w-full max-w-4xl bg-zinc-950/50 border border-white/10 rounded-[40px] shadow-2xl overflow-hidden shadow-cyan-500/5"
          >
            {/* Search Header */}
            <div className="p-6 md:p-10 pb-0 flex flex-col gap-8">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-2xl bg-cyan-500/10 flex items-center justify-center border border-cyan-500/20">
                    <Search className="w-5 h-5 text-cyan-500" />
                  </div>
                  <h3 className="text-xl font-black text-white uppercase tracking-tighter">Global Search</h3>
                </div>
                <button onClick={onClose} className="p-3 bg-white/5 hover:bg-white/10 rounded-full transition-all text-zinc-500 hover:text-white">
                  <X className="w-6 h-6" />
                </button>
              </div>

              <div className="relative">
                <input
                  autoFocus
                  type="text"
                  placeholder="পণ্য, বিক্রেতা বা ডিমান্ড খুঁজুন..."
                  value={query}
                  onChange={(e) => setQuery(e.target.value)}
                  onKeyDown={(e) => e.key === 'Enter' && handleSearch(query)}
                  className="w-full h-20 bg-white/[0.03] border-2 border-white/5 rounded-3xl px-8 text-2xl font-black text-white placeholder:text-zinc-700 outline-none focus:border-cyan-500/50 focus:bg-cyan-500/5 transition-all shadow-inner"
                />
                <div className="absolute right-6 top-1/2 -translate-y-1/2 flex items-center gap-4">
                  <kbd className="hidden sm:flex h-8 items-center gap-1 rounded bg-zinc-900 border border-white/10 px-2 text-[10px] font-black text-zinc-500 uppercase tracking-widest">
                    Enter to search
                  </kbd>
                  <button 
                    onClick={() => handleSearch(query)}
                    className="w-12 h-12 bg-cyan-500 rounded-2xl flex items-center justify-center text-black hover:bg-cyan-400 transition-all hover:scale-105 active:scale-95 shadow-lg shadow-cyan-500/20"
                  >
                    <ArrowRight className="w-6 h-6" />
                  </button>
                </div>
              </div>
            </div>

            {/* Results / Content */}
            <div className="p-6 md:p-10 grid grid-cols-1 md:grid-cols-12 gap-10">
              {/* Left Side: Recent & Trending */}
              <div className="md:col-span-4 space-y-10">
                <div className="space-y-4">
                  <div className="flex items-center gap-2 text-primary">
                    <History className="w-3.5 h-3.5" />
                    <h4 className="text-[10px] font-black uppercase tracking-[0.2em]">Recent</h4>
                  </div>
                  <div className="flex flex-col gap-2">
                    {RECENT_SEARCHES.map((s, i) => (
                      <button 
                        key={i} 
                        onClick={() => handleSearch(s)}
                        className="text-left py-2 px-3 rounded-xl hover:bg-white/5 text-sm font-bold text-zinc-400 hover:text-white transition-all flex items-center justify-between group"
                      >
                        {s}
                        <ChevronRight className="w-3.5 h-3.5 opacity-0 group-hover:opacity-100 transition-all -translate-x-2 group-hover:translate-x-0" />
                      </button>
                    ))}
                  </div>
                </div>

                <div className="space-y-4 pt-4 border-t border-white/5">
                  <div className="flex items-center gap-2 text-amber-500">
                    <TrendingUp className="w-3.5 h-3.5" />
                    <h4 className="text-[10px] font-black uppercase tracking-[0.2em]">Trending</h4>
                  </div>
                  <div className="flex flex-wrap gap-2">
                    {TRENDING_KEYWORDS.map((k, i) => (
                      <button 
                        key={i}
                        onClick={() => handleSearch(k)}
                        className="px-4 py-2 rounded-xl bg-white/5 border border-white/5 text-[10px] font-black text-zinc-300 hover:text-cyan-400 hover:border-cyan-400/30 transition-all uppercase tracking-widest"
                      >
                        {k}
                      </button>
                    ))}
                  </div>
                </div>
              </div>

              {/* Right Side: Quick Hits */}
              <div className="md:col-span-8 grid grid-cols-1 sm:grid-cols-2 gap-8">
                {/* Products */}
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2 text-sky-400">
                      <ShoppingBag className="w-3.5 h-3.5" />
                      <h4 className="text-[10px] font-black uppercase tracking-[0.2em]">Top Products</h4>
                    </div>
                  </div>
                  <div className="space-y-3">
                    {QUICK_RESULTS.products.map(p => (
                      <div key={p.id} className="p-4 rounded-2xl bg-white/[0.02] border border-white/5 hover:border-sky-400/30 transition-all group cursor-pointer">
                        <div className="flex items-center justify-between mb-1">
                          <span className="text-xs font-black text-white group-hover:text-sky-400 transition-colors uppercase truncate pr-4">{p.title}</span>
                          <span className="text-[10px] font-black text-cyan-400">৳{p.price}</span>
                        </div>
                        <span className="text-[9px] text-zinc-600 font-bold uppercase tracking-widest">{p.category}</span>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Demands */}
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2 text-orange-400">
                      <FileText className="w-3.5 h-3.5" />
                      <h4 className="text-[10px] font-black uppercase tracking-[0.2em]">Top Demands</h4>
                    </div>
                  </div>
                  <div className="space-y-3">
                    {QUICK_RESULTS.demands.map(d => (
                      <div key={d.id} className="p-4 rounded-2xl bg-white/[0.02] border border-white/5 hover:border-orange-400/30 transition-all group cursor-pointer">
                        <span className="text-xs font-black text-white group-hover:text-orange-400 transition-colors uppercase line-clamp-1 mb-1">{d.title}</span>
                        <div className="flex items-center gap-2 text-[8px] font-black uppercase tracking-widest text-zinc-600">
                          <History className="w-2.5 h-2.5" />
                          <span>Budget: {d.budget}</span>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Sellers - Full Width Bottom */}
                <div className="sm:col-span-2 space-y-4 pt-4 border-t border-white/5">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2 text-teal-400">
                      <Users className="w-3.5 h-3.5" />
                      <h4 className="text-[10px] font-black uppercase tracking-[0.2em]">Verified Sellers</h4>
                    </div>
                  </div>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    {QUICK_RESULTS.sellers.map(s => (
                      <div key={s.id} className="flex items-center gap-4 p-4 rounded-2xl bg-white/[0.02] border border-white/5 hover:border-teal-400/30 transition-all cursor-pointer">
                        <div className="w-10 h-10 rounded-xl bg-teal-400/10 flex items-center justify-center text-teal-400 font-black">
                          {s.name[0]}
                        </div>
                        <div className="flex-1 min-w-0">
                          <p className="text-xs font-black text-white uppercase truncate">{s.name}</p>
                          <div className="flex items-center gap-2 mt-1">
                            <span className="text-[8px] font-black text-zinc-500 uppercase tracking-widest">Score: {s.trustScore}</span>
                            <Sparkles className="w-2.5 h-2.5 text-amber-500" />
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>

            {/* Footer */}
            <div className="p-4 bg-white/[0.02] border-t border-white/5 flex justify-center items-center gap-4">
              <p className="text-[9px] text-zinc-600 font-bold uppercase tracking-widest flex items-center gap-2">
                <Sparkles className="w-3 h-3 text-cyan-500" />
                Find anything instantly in the PaikarMart Ecosystem
              </p>
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
};
