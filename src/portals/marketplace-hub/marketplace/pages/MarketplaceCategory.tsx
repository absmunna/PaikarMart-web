import React, { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { SlidersHorizontal, ChevronRight, Grid, List as ListIcon } from 'lucide-react';
import { motion } from 'motion/react';
import { StoryBar } from '@shared/StoryBar';
import { useListProducts, getListProductsQueryKey } from "@/modules/app/api/client/hooks";
import { ProductGrid } from "@/features/product/components/ProductGrid";

export const MarketplaceCategoryPage = () => {
  const { slug } = useParams();
  const navigate = useNavigate();
  const [viewType, setViewType] = useState<'grid' | 'list'>('grid');
  
  const { data: products, isLoading } = useListProducts(
    { categoryId: slug },
    { query: { queryKey: getListProductsQueryKey({ categoryId: slug }) } }
  );

  return (
    <div className="min-h-screen bg-[var(--pm-bg)] text-white pb-20">
      {/* ━━━ HERO ZONE: Stories ━━━ */}
      <section className="pt-3 md:pt-4 overflow-hidden bg-[var(--pm-bg)] border-b border-[var(--pm-border)] pb-2">
        <StoryBar context="retail" />
      </section>

      {/* Category Header / Banner */}
      <div className="relative h-[200px] md:h-[280px] w-full overflow-hidden">
        <img 
          src={`https://images.unsplash.com/photo-1441986300917-64674bd600d8?w=1200`} 
          className="w-full h-full object-cover"
          alt="Category Banner"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-[var(--pm-bg)] via-[var(--pm-bg)]/40 to-transparent" />
        
        <div className="absolute bottom-0 left-0 right-0 max-w-[1440px] mx-auto px-4 md:px-6 pb-8">
           
           <h1 className="text-3xl md:text-5xl font-black italic uppercase tracking-tighter text-white">
             {slug?.replace('-', ' ')}
           </h1>
           <div className="flex items-center gap-2 mt-2 text-zinc-500 text-[10px] font-bold uppercase tracking-widest">
             <span>Marketplace</span>
             <ChevronRight className="w-3 h-3" />
             <span>Categories</span>
             <ChevronRight className="w-3 h-3" />
             <span className="text-cyan-400">{slug}</span>
           </div>
        </div>
      </div>

      <main className="max-w-[1440px] mx-auto px-4 md:px-6 mt-8">
        {/* Controls */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-8 bg-[var(--pm-surface)] p-4 rounded-[24px] border border-[var(--pm-border)]">
          <div className="flex items-center gap-4 overflow-x-auto no-scrollbar">
             {['Smartphones', 'Accessories', 'Tablets', 'Laptops', 'Audio'].map(sub => (
                <button key={sub} className="px-4 py-2 rounded-xl bg-white/5 border border-white/5 text-[10px] font-black uppercase tracking-widest hover:border-cyan-400/50 transition-all whitespace-nowrap">
                  {sub}
                </button>
             ))}
          </div>

          <div className="flex items-center gap-3">
             <div className="flex bg-black/40 p-1 rounded-xl border border-white/5">
                <button 
                  onClick={() => setViewType('grid')}
                  className={`p-2 rounded-lg transition-all ${viewType === 'grid' ? 'bg-cyan-400 text-black shadow-lg shadow-cyan-400/20' : 'text-zinc-500 hover:text-white'}`}
                >
                  <Grid className="w-4 h-4" />
                </button>
                <button 
                  onClick={() => setViewType('list')}
                  className={`p-2 rounded-lg transition-all ${viewType === 'list' ? 'bg-cyan-400 text-black shadow-lg shadow-cyan-400/20' : 'text-zinc-500 hover:text-white'}`}
                >
                  <ListIcon className="w-4 h-4" />
                </button>
             </div>
             
             <button className="flex items-center gap-2 px-4 h-10 rounded-xl bg-white/5 border border-white/5 text-xs font-bold text-zinc-300 hover:border-cyan-400/50 transition-all">
                <SlidersHorizontal className="w-4 h-4" /> Sort & Filter
             </button>
          </div>
        </div>

        {/* Results Grid */}
        <div className="pb-20">
           <ProductGrid products={products} isLoading={isLoading} />
        </div>
      </main>
    </div>
  );
};
