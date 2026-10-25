import React, { useState, useMemo } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { ShoppingBag, Sparkles, TrendingUp, Filter, CheckCircle2, MapPin } from 'lucide-react';
import { HomeHero } from '@/portals/marketplace-hub/retail/components/HomeHero';
import { CategoryNavBar, CategoryFilterItem } from '@shared/CategoryNavBar';
import { PortalAccess } from '@/portals/marketplace-hub/retail/components/PortalAccess';
import { SectionHeader } from '@/modules/home/components/SectionHeader';
import { ProductCard } from "@/modules/product";
import { mockProducts } from '@/portals/marketplace-hub/retail/data/products';
import { useCartStore } from '@/modules/cart';
import { useCartDrawerStore } from '@/modules/cart';
import { useCategoryStore } from '@/store/categoryStore';
import { useLocationStore } from '@/modules/location';

// Framer motion animation variants for container staggering
const containerVariants = {
  hidden: { opacity: 0 },
  show: {
    opacity: 1,
    transition: {
      staggerChildren: 0.04,
      delayChildren: 0.1
    }
  }
};

const itemVariants = {
  hidden: { opacity: 0, y: 15 },
  show: { 
    opacity: 1, 
    y: 0, 
    transition: { type: 'spring' as const, stiffness: 260, damping: 25 } 
  }
};

export const Home = () => {
  const { activeMainCategory, setMainCategory } = useCategoryStore();
  const { formattedAddress, city, isAutoDetected, openLocationModal } = useLocationStore();
  const currentHomeLocation = formattedAddress || city || 'ঢাকা';
  const openCart = useCartDrawerStore((state) => state.open);
  const totalItemsCount = useCartStore((state) => state.getTotalItems());
  const totalPrice = useCartStore((state) => state.getTotalPrice());

  // Static defined categories available
  const categoryItems: CategoryFilterItem[] = useMemo(() => {
    const list = [
      { id: 'all', labelBn: 'সব', label: 'All' },
      { id: 'fashion', labelBn: 'ফ্যাশন', label: 'Fashion' },
      { id: 'electronics', labelBn: 'ইলেকট্রনিক্স', label: 'Electronics' },
      { id: 'grocery', labelBn: 'গ্রোসারি', label: 'Grocery' },
      { id: 'home', labelBn: 'গৃহস্থালি', label: 'Home' },
      { id: 'beauty', labelBn: 'সৌন্দর্য', label: 'Beauty' }
    ];
    return list.map((item) => ({
      id: item.id,
      labelBn: item.labelBn,
      label: item.label,
      color: "from-cyan-500 to-teal-600"
    }));
  }, []);

  // Filter products by selected category tag synced with useCategoryStore
  const filteredProducts = useMemo(() => {
    if (!activeMainCategory || activeMainCategory === 'all' || activeMainCategory === 'সব') {
      return mockProducts;
    }

    const keywords: Record<string, string[]> = {
      fashion: ['পোশাক', 'শাড়ি', 'ব্যাগ', 'ফ্যাশন'],
      electronics: ['মোবাইল', 'সোলার', 'ইলেকট্রনিক্স'],
      grocery: ['মাছ', 'চাল', 'খাদ্য', 'মাংস', 'গ্রোসারি', 'মুদি'],
      home: ['আসবাবপত্র', 'গৃহস্থালি'],
      beauty: ['রূপচর্চা', 'সৌন্দর্য'],
      services: ['service', 'Electrician', 'Moving', 'Plumbing', 'Tech', 'Legal']
    };

    const targetKeywords = keywords[activeMainCategory] || [activeMainCategory];

    return mockProducts.filter((product) => {
      const prodCat = (product.category || '').toLowerCase();
      const prodName = (product.name || '').toLowerCase();
      return targetKeywords.some(kw => 
        prodCat.includes(kw.toLowerCase()) || prodName.includes(kw.toLowerCase())
      );
    });
  }, [activeMainCategory]);

  // Flash sale filtered list
  const flashSaleProducts = useMemo(() => {
    return mockProducts.filter((product: any) => product.isFlashSale);
  }, []);

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="pb-24 flex flex-col gap-6 relative"
    >
      {/* 1. Hero Banner Carousel with geolocation greeting */}
      <HomeHero />

      {/* 2. Portal Quick Connect Links for Bangladeshi Multitask */}
      <PortalAccess />

      {/* 3. Dynamic Sticky / Horizontal categories chip select filter */}
      <div className="px-2">
        <div className="flex items-center justify-between mb-3.5">
          <SectionHeader title="ক্যাটাগরি সমূহ (Explore Categories)" />
          <div className="flex items-center gap-1.5 text-xs text-[var(--pm-text-secondary)] font-medium bg-[var(--pm-surface-hover)] border border-[var(--pm-border)] px-2 py-1 rounded-lg">
            <Filter className="w-3.5 h-3.5" />
            <span>ফিল্টার</span>
          </div>
        </div>
        
        <CategoryNavBar 
          items={categoryItems} 
          activeFilter={activeMainCategory || 'all'} 
          onFilterChange={(id) => setMainCategory(id)} 
        />
      </div>

      {/* 4. Trending & Flash Sale Horizontal strip section */}
      <div className="px-2">
        <SectionHeader title="স্মার্ট ফ্ল্যাশ সেল! (Flash Sale)" />
        <div className="flex gap-4 overflow-x-auto pb-4 pt-1 hide-scrollbar">
          {flashSaleProducts.map((product) => (
            <div key={`flash-${product.id}`} className="shrink-0 w-[170px] sm:w-[190px]">
              <ProductCard product={product} isFlashSale />
            </div>
          ))}
        </div>
      </div>

      {/* 5. Recommended Grid main loop area */}
      <div className="px-2">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-2">
            <Sparkles className="w-5 h-5 text-[var(--pm-accent)] animate-pulse" />
            <SectionHeader title="আপনার পছন্দের পণ্য সমূহ" />
          </div>
          {activeMainCategory && activeMainCategory !== 'all' && (
            <button 
              onClick={() => setMainCategory('all')}
              className="text-xs text-[var(--pm-text-secondary)] hover:text-[var(--pm-accent)] transition-colors font-semibold cursor-pointer"
            >
              রিসেট
            </button>
          )}
        </div>

        {/* Dynamic products loop containing staggering transition lists */}
        <AnimatePresence mode="popLayout">
          {filteredProducts.length === 0 ? (
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="py-12 text-center bg-[var(--pm-surface-hover)] rounded-3xl border border-[var(--pm-border)] mx-auto p-6"
            >
              <div className="w-12 h-12 bg-muted text-muted-foreground rounded-full flex items-center justify-center mx-auto mb-3">
                <ShoppingBag className="w-6 h-6" />
              </div>
              <p className="text-sm font-bold text-[var(--pm-text)]">দুঃখিত, কোনো পণ্য পাওয়া যায়নি!</p>
              <p className="text-xs text-[var(--pm-text-secondary)] mt-1">অন্য ক্যাটাগরি ট্রাই করুন বা অনুসন্ধান করুন।</p>
            </motion.div>
          ) : (
            <motion.div
              variants={containerVariants}
              initial="hidden"
              animate="show"
              className="grid grid-cols-2 gap-3.5"
            >
              {filteredProducts.map((product) => (
                <motion.div
                  key={product.id}
                  variants={itemVariants}
                  layout
                >
                  <ProductCard product={product} />
                </motion.div>
              ))}
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* 6. Local Location/Pickup Nearby Store highlight */}
      <div className="mx-2 p-4 rounded-3xl bg-[var(--pm-surface-hover)] border border-[var(--pm-border)] flex items-center justify-between gap-3 shadow-inner">
        <div className="text-left min-w-0">
          <p className="text-[10px] text-[var(--pm-text-secondary)] font-bold uppercase tracking-widest flex items-center gap-1.5">
            <span className={`w-2 h-2 rounded-full ${isAutoDetected ? 'bg-emerald-400 animate-pulse' : 'bg-cyan-400'}`} />
            সংযুক্ত ডেলিভারি জোন ({isAutoDetected ? 'লাইভ GPS' : 'সেট করা অবস্থান'})
          </p>
          <p className="text-xs font-black text-[var(--pm-text)] mt-1 truncate">
            {currentHomeLocation} — নিকটস্থ দোকান ও দ্রুততম এক্সপ্রেস ডেলিভারি পান!
          </p>
        </div>
        <button
          onClick={openLocationModal}
          className="px-3 py-1.5 bg-cyan-500/10 hover:bg-cyan-500/20 active:scale-95 text-cyan-400 rounded-xl text-[11px] font-black flex items-center gap-1.5 shrink-0 border border-cyan-500/20 cursor-pointer transition-all"
        >
          <MapPin className="w-3.5 h-3.5" />
          <span>পরিবর্তন</span>
        </button>
      </div>

      {/* 7. Beautiful Floating Quick Action Cart Bar Sheet (Opens the drawer instantly) */}
      <AnimatePresence>
        {totalItemsCount > 0 && (
          <motion.div
            initial={{ opacity: 0, y: 100, scale: 0.9 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 100, scale: 0.9 }}
            className="fixed bottom-[80px] left-1/2 -translate-x-1/2 z-[40] w-[calc(100%-32px)] max-w-[440px]"
          >
            <button
              onClick={openCart}
              className="w-full bg-[var(--pm-accent)] text-white p-4 rounded-2xl flex items-center justify-between shadow-xl cursor-pointer hover:brightness-105 active:scale-98 transition-all border border-white/10"
            >
              <div className="flex items-center gap-3">
                <div className="relative p-2.5 bg-white/20 text-white rounded-xl">
                  <ShoppingBag className="w-5 h-5" />
                  <span className="absolute -top-1.5 -right-1.5 w-5 h-5 bg-white text-[var(--pm-accent)] text-[10px] font-black rounded-full flex items-center justify-center animate-bounce shadow">
                    {totalItemsCount}
                  </span>
                </div>
                <div className="text-left">
                  <p className="text-xs font-bold opacity-90">কার্টে পণ্য রয়েছে</p>
                  <p className="text-sm font-black text-white">৳ {totalPrice.toLocaleString()}</p>
                </div>
              </div>
              <div className="flex items-center gap-1 text-xs font-black bg-white/15 px-3.5 py-2 rounded-xl border border-white/5">
                <span>আমার ব্যাগ</span>
                <Sparkles className="w-3.5 h-3.5" />
              </div>
            </button>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
};
export default Home;
