import React, { useState, useMemo } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { motion, AnimatePresence } from 'motion/react';
import { 
  Search, ArrowLeft, Download, ShieldCheck, Star, Sparkles, BookOpen, 
  Terminal, Palette, Laptop, Play, ShoppingCart, CheckCircle, RefreshCw,
  X, Package
} from 'lucide-react';
import { useListProducts, getListProductsQueryKey } from "@/modules/app/api/client/hooks";
import { ProductGrid } from "@/features/product/components/ProductGrid";
import { StoryBar } from "@shared/StoryBar";
import { CategoryNavBar } from "@shared/CategoryNavBar";

const CATEGORIES = [
  { id: 'all', label: 'সব ক্যাটাগরি', icon: null },
  { id: 'Course', label: 'ভিডিও কোর্স', icon: <Play className="w-4 h-4" /> },
  { id: 'Template', label: 'ওয়েব টেমপ্লেট', icon: <Terminal className="w-4 h-4" /> },
  { id: 'eBook', label: 'ই-বুক পিডিএফ', icon: <BookOpen className="w-4 h-4" /> },
  { id: 'Software', label: 'ইউটিলিটি সফটওয়্যার', icon: <Laptop className="w-4 h-4" /> }
];

export default function DigitalProductsHome() {
  const navigate = useNavigate();
  const location = useLocation();
  const [search, setSearch] = useState('');
  const [selectedType, setSelectedType] = useState('all');

  const { data: products, isLoading } = useListProducts(
    { type: "digital" }, 
    { query: { queryKey: getListProductsQueryKey({ type: "digital" }) } }
  );

  const filteredProducts = useMemo(() => {
    return products?.filter((p: any) => {
      const matchSearch = !search || 
                          p.name?.toLowerCase().includes(search.toLowerCase()) || 
                          p.category?.toLowerCase().includes(search.toLowerCase());
      const matchType = selectedType === 'all' || p.category?.toLowerCase().includes(selectedType.toLowerCase());
      return matchSearch && matchType;
    }) || [];
  }, [products, search, selectedType]);

  return (
    <div className="pt-2 pb-16 w-full max-w-7xl mx-auto min-h-screen bg-[var(--pm-bg)] text-[var(--pm-text)] px-4 flex flex-col gap-6">
      
      {/* 1. STORY BAR */}
      <section className="pt-2">
        <StoryBar context="digital-services" />
      </section>

      {/* 2. STICKY PORTAL BAR */}
      <div className="md:sticky top-16 z-40 bg-[var(--pm-bg)]/90 backdrop-blur-lg border-b border-border/50 px-0 mt-2">
        <CategoryNavBar context="digital-services" />
      </div>

      {/* 3. HERO HEADER */}
      <div className="mt-2 p-6 rounded-3xl bg-gradient-to-br from-indigo-500/10 via-[var(--pm-surface)] to-[var(--pm-bg)] border border-[var(--pm-border)] relative overflow-hidden shadow-sm">
        <div className="absolute top-0 right-0 p-3 opacity-10">
          <Laptop className="w-16 h-16 text-indigo-400 rotate-12" />
        </div>
        <div className="relative z-10">
          <h1 className="text-xl md:text-2xl font-black text-[var(--pm-text)] tracking-tight">Digital Store</h1>
          <p className="text-xs text-indigo-400 font-bold uppercase mt-1">Premium eBooks, Courses, & Web Templates</p>
          
          <div className="flex items-center gap-2 mt-4 text-[11px] text-[var(--pm-text-muted)] font-bold">
            <CheckCircle className="w-4 h-4 text-cyan-500" />
            <span>Instant delivery on purchase</span>
          </div>
        </div>
      </div>

      {/* 4. SEARCH & FILTERS */}
      <div className="flex flex-col gap-4">
        <div className="flex gap-2">
          <div className="flex-1 h-12 bg-[var(--pm-surface)] rounded-2xl border border-[var(--pm-border)] px-4 flex items-center gap-3 focus-within:border-indigo-500/40 transition-all">
            <Search className="w-4 h-4 text-indigo-400" />
            <input 
              type="text" 
              placeholder="প্রোডাক্ট এর নাম দিয়ে খুঁজুন..." 
              value={search}
              onChange={e => setSearch(e.target.value)}
              className="flex-1 bg-transparent text-[13px] text-[var(--pm-text)] placeholder-zinc-600 outline-none font-semibold" 
            />
            {search && <button onClick={() => setSearch("")}><X className="w-4 h-4 text-zinc-500" /></button>}
          </div>
        </div>

        {/* Category Chips */}
        <div className="flex gap-2 overflow-x-auto no-scrollbar pb-1 items-center">
          {CATEGORIES.map(cat => {
            const active = selectedType === cat.id;
            return (
              <button
                key={cat.id}
                onClick={() => setSelectedType(cat.id)}
                className={`shrink-0 flex items-center gap-1.5 px-4 py-2 rounded-2xl border text-[11px] font-black transition-all ${
                  active
                    ? "bg-indigo-500/15 border-indigo-500/20 text-indigo-400"
                    : "bg-white/[0.02] border-white/[0.05] text-zinc-500 hover:text-zinc-300 hover:border-white/[0.12]"
                }`}
              >
                {cat.icon}
                <span>{cat.label}</span>
              </button>
            );
          })}
        </div>
      </div>

      {/* 5. PRODUCT FEED GRID */}
      <div className="flex flex-col gap-4">
        <div className="flex items-center gap-2 mb-1">
          <Package className="w-4 h-4 text-zinc-500" />
          <h2 className="text-[10px] font-black text-zinc-500 uppercase tracking-widest">
            {isLoading ? "Fetching digital assets..." : `${filteredProducts.length} Premium Assets Available`}
          </h2>
        </div>

        <ProductGrid 
          products={filteredProducts} 
          isLoading={isLoading}
          emptyMessage={`No digital products found matching "${search}" in "${selectedType}".`} 
        />
      </div>

    </div>
  );
}

