import React, { useRef, useMemo, useEffect } from 'react';
import { useLocation, useNavigate, useSearchParams } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  ShoppingBag, Flame, ChevronRight, ChevronLeft, Sparkles, 
  Factory, Award, MapPin, Activity, Store, Wrench, Laptop, Briefcase,
  Shirt, Smartphone, Wheat, PlayCircle
} from 'lucide-react';
import { PORTAL_CATEGORIES_MAP, PortalContextType } from '@/shared/constants/categoriesData';
import { useCategoryStore } from '@/store/categoryStore';
import { cn } from '@/lib/utils';

export interface CategoryBarProps {
  className?: string;
  forcePortal?: PortalContextType;
  showDualFeedToggle?: boolean;
  context?: string;
}

export const CategoryBar: React.FC<CategoryBarProps> = ({
  className,
  forcePortal,
  showDualFeedToggle = true,
  context
}) => {
  const location = useLocation();
  const navigate = useNavigate();
  const [searchParams, setSearchParams] = useSearchParams();
  const scrollContainerRef = useRef<HTMLDivElement>(null);
  const subScrollContainerRef = useRef<HTMLDivElement>(null);

  const {
    portalContext,
    activeMainCategory,
    activeSubCategory,
    feedTab,
    setPortalContext,
    setMainCategory,
    setSubCategory,
    setFeedTab
  } = useCategoryStore();

  // 1. Auto-detect portal context from URL pathname
  const detectedPortal = useMemo<PortalContextType>(() => {
    if (forcePortal) return forcePortal;
    const path = location.pathname.toLowerCase();
    
    if (
      path.startsWith('/wholesale') || 
      path.startsWith('/b2b') || 
      path.startsWith('/export') || 
      path.startsWith('/rfq')
    ) return 'wholesale';

    if (
      path.startsWith('/local') || 
      path.startsWith('/nearby') || 
      path.startsWith('/grocery') || 
      path.startsWith('/pharmacy') ||
      path.startsWith('/electronics-local')
    ) return 'local';

    if (
      path.startsWith('/services') || 
      path.startsWith('/repair') || 
      path.startsWith('/travel')
    ) return 'services';

    if (
      path.startsWith('/logistics') || 
      path.startsWith('/transport') || 
      path.startsWith('/ride')
    ) return 'logistics';

    if (
      path.startsWith('/marketplace') || 
      path.startsWith('/b2c') || 
      path.startsWith('/shop') || 
      path.startsWith('/pk-shop') || 
      path.startsWith('/brands') || 
      path.startsWith('/dropship') || 
      path.startsWith('/auto') ||
      path.startsWith('/digital')
    ) return 'retail';

    return 'all';
  }, [location.pathname, forcePortal]);

  // Keep store in sync with detected portal
  useEffect(() => {
    if (portalContext !== detectedPortal) {
      setPortalContext(detectedPortal);
    }
  }, [detectedPortal, portalContext, setPortalContext]);

  // Sync category state from URL query parameters
  useEffect(() => {
    const catQuery = searchParams.get('category');
    const subQuery = searchParams.get('sub');
    
    if (catQuery && catQuery !== activeMainCategory) {
      setMainCategory(catQuery);
    }
    if (subQuery !== activeSubCategory) {
      setSubCategory(subQuery);
    }
  }, [searchParams]);

  // Routes where the category bar should be hidden
  const shouldHide = useMemo(() => {
    const path = location.pathname.toLowerCase();
    const hiddenRoutes = [
      '/',
      '/feed',
      '/social',
      '/auth',
      '/login',
      '/register',
      '/forgot-password',
      '/verify-email',
      '/settings',
      '/profile',
      '/reels',
      '/checkout',
      '/admin',
      '/client-vault',
      '/vault',
      '/messages',
      '/chat',
      '/portals',
      '/apps',
      '/hub',
      '/portal-hub',
      '/cart',
      '/orders',
      '/wallet'
    ];
    return hiddenRoutes.some(r => path === r || path.startsWith(r + '/'));
  }, [location.pathname]);

  if (shouldHide) {
    return null;
  }

  // Modern Category & Portal Icons List
  const categoryItems = [
    { id: 'all', icon: ShoppingBag, label: 'সব প্রোডাক্ট', path: '/market', categoryKey: 'all', color: 'text-orange-400 bg-orange-500/10 border-orange-500/20' },
    { id: 'video', icon: PlayCircle, label: 'ভিডিও পোর্টাল', path: '/video', categoryKey: 'video', color: 'text-rose-400 bg-rose-500/10 border-rose-500/20' },
    { id: 'wholesale', icon: Factory, label: 'পাইকারি আড়ত', path: '/wholesale', categoryKey: 'wholesale', color: 'text-indigo-400 bg-indigo-500/10 border-indigo-500/20' },
    { id: 'pk-shop', icon: Sparkles, label: 'পিকে স্টোর', path: '/pk-shop', categoryKey: 'pk-shop', color: 'text-amber-400 bg-amber-500/10 border-amber-500/20' },
    { id: 'brands', icon: Award, label: 'ব্র্যান্ড শপ', path: '/brands', categoryKey: 'brands', color: 'text-pink-400 bg-pink-500/10 border-pink-500/20' },
    { id: 'nearby', icon: MapPin, label: 'লোকাল শপ', path: '/nearby', categoryKey: 'nearby', color: 'text-emerald-400 bg-emerald-500/10 border-emerald-500/20' },
    { id: 'grocery', icon: Store, label: 'মুদি ও খামার', path: '/grocery', categoryKey: 'grocery', color: 'text-amber-500 bg-amber-600/10 border-amber-600/20' },
    { id: 'fashion', icon: Shirt, label: 'ফ্যাশন', path: '/marketplace?category=fashion', categoryKey: 'fashion', color: 'text-purple-400 bg-purple-500/10 border-purple-500/20' },
    { id: 'electronics', icon: Smartphone, label: 'ইলেকট্রনিক্স', path: '/marketplace?category=electronics', categoryKey: 'electronics', color: 'text-cyan-400 bg-cyan-500/10 border-cyan-500/20' },
    { id: 'pharmacy', icon: Activity, label: 'ফার্মেসি', path: '/pharmacy', categoryKey: 'pharmacy', color: 'text-teal-400 bg-teal-500/10 border-teal-500/20' },
    { id: 'services', icon: Wrench, label: 'সার্ভিস হাব', path: '/services', categoryKey: 'services', color: 'text-violet-400 bg-violet-500/10 border-violet-500/20' },
    { id: 'digital', icon: Laptop, label: 'ডিজিটাল', path: '/digital', categoryKey: 'digital', color: 'text-blue-400 bg-blue-500/10 border-blue-500/20' },
    { id: 'seller', icon: Briefcase, label: 'সেলার হন', path: '/become-seller', categoryKey: 'seller', color: 'text-zinc-400 bg-zinc-500/10 border-zinc-500/20' },
  ];

  const categoriesList = PORTAL_CATEGORIES_MAP[portalContext] || PORTAL_CATEGORIES_MAP.all;
  const selectedCategoryObj = categoriesList.find(c => c.id === activeMainCategory) || categoriesList[0];
  const hasSubcategories = selectedCategoryObj?.subcategories && selectedCategoryObj.subcategories.length > 0;

  const handleItemClick = (item: typeof categoryItems[0]) => {
    // If clicking an item that corresponds to a category filter
    if (location.pathname === '/' || location.pathname === '/marketplace') {
      if (item.id === 'all') {
        setMainCategory('all');
        setSubCategory(null);
        if (location.pathname !== '/') navigate('/');
        return;
      }
      if (item.id === 'fashion' || item.id === 'electronics' || item.id === 'grocery') {
        setMainCategory(item.id);
        const newParams = new URLSearchParams(searchParams);
        newParams.set('category', item.id);
        newParams.delete('sub');
        setSearchParams(newParams, { replace: true });
        return;
      }
    }

    // Otherwise navigate directly to the portal route
    navigate(item.path);
  };

  const handleSelectSubCategory = (subSlug: string) => {
    const target = subSlug === 'all' || activeSubCategory === subSlug ? null : subSlug;
    setSubCategory(target);
    const newParams = new URLSearchParams(searchParams);
    if (!target) {
      newParams.delete('sub');
    } else {
      newParams.set('sub', target);
    }
    setSearchParams(newParams, { replace: true });
  };

  const handleResetFilters = () => {
    setMainCategory('all');
    setSubCategory(null);
    const newParams = new URLSearchParams(searchParams);
    newParams.delete('category');
    newParams.delete('sub');
    setSearchParams(newParams, { replace: true });
  };

  const scrollCarousel = (direction: 'left' | 'right') => {
    if (scrollContainerRef.current) {
      const scrollAmount = direction === 'left' ? -260 : 260;
      scrollContainerRef.current.scrollBy({ left: scrollAmount, behavior: 'smooth' });
    }
  };

  const isHomeOrFeed = location.pathname === '/' || location.pathname === '/feed';
  const hasActiveFilter = activeMainCategory !== 'all' || Boolean(activeSubCategory);

  return (
    <div className={cn(
      "sticky top-0 z-30 w-full bg-[var(--pm-bg)]/95 backdrop-blur-2xl border-b border-[var(--pm-border)] shadow-md transition-all duration-300 select-none",
      className
    )}>
      <div className="max-w-[1600px] mx-auto px-2 sm:px-4">
        


        {/* ─── 2. MAIN CATEGORY BAR (Iconic Modern Squircle Cards) ─── */}
        <div className="relative group/carousel py-3">
          
          {/* Scroll Navigation Arrows */}
          <button
            onClick={() => scrollCarousel('left')}
            className="hidden md:flex absolute -left-2 top-1/2 -translate-y-1/2 z-20 w-8 h-8 rounded-full bg-[var(--pm-surface)] hover:bg-[var(--pm-surface-hover)] border border-[var(--pm-border)] shadow-lg text-[var(--pm-text)] items-center justify-center opacity-0 group-hover/carousel:opacity-100 transition-all hover:scale-110 active:scale-95 cursor-pointer backdrop-blur-md"
            aria-label="Scroll left"
          >
            <ChevronLeft className="w-4 h-4" />
          </button>

          <button
            onClick={() => scrollCarousel('right')}
            className="hidden md:flex absolute -right-2 top-1/2 -translate-y-1/2 z-20 w-8 h-8 rounded-full bg-[var(--pm-surface)] hover:bg-[var(--pm-surface-hover)] border border-[var(--pm-border)] shadow-lg text-[var(--pm-text)] items-center justify-center opacity-0 group-hover/carousel:opacity-100 transition-all hover:scale-110 active:scale-95 cursor-pointer backdrop-blur-md"
            aria-label="Scroll right"
          >
            <ChevronRight className="w-4 h-4" />
          </button>

          {/* Horizontal Icons Scrollable Track */}
          <div 
            ref={scrollContainerRef}
            className="flex items-center gap-3 sm:gap-4 overflow-x-auto no-scrollbar scroll-smooth px-1"
          >
            {categoryItems.map((item) => {
              const Icon = item.icon;
              const isRouteActive = location.pathname === item.path || (item.path !== '/' && location.pathname.startsWith(item.path));
              const isCategoryActive = (location.pathname === '/' || location.pathname === '/marketplace') && activeMainCategory === item.categoryKey;
              const isActive = isRouteActive || isCategoryActive;

              return (
                <button
                  key={item.id}
                  onClick={() => handleItemClick(item)}
                  className="flex flex-col items-center gap-2 shrink-0 transition-all active:scale-95 group/icon cursor-pointer select-none w-[68px]"
                >
                  <div className={cn(
                    "w-13 h-13 sm:w-14 sm:h-14 rounded-2xl border flex items-center justify-center shadow-md transition-all duration-300",
                    isActive 
                      ? "bg-[var(--pm-accent)] border-[var(--pm-accent)] shadow-lg shadow-[var(--pm-accent)]/30 scale-105" 
                      : "bg-[var(--pm-surface)] border-[var(--pm-border)] group-hover/icon:border-[var(--pm-accent)]/50 group-hover/icon:scale-105"
                  )}>
                    <div className={cn(
                      "w-10 h-10 rounded-xl flex items-center justify-center transition-colors duration-300",
                      isActive ? "text-white bg-transparent" : item.color
                    )}>
                      <Icon className={cn("w-5 h-5", isActive ? "stroke-[2.5px]" : "")} />
                    </div>
                  </div>
                  <span className={cn(
                    "text-[11px] font-black tracking-tight whitespace-nowrap transition-colors duration-300 truncate w-full text-center",
                    isActive ? "text-[var(--pm-accent)] font-extrabold" : "text-[var(--pm-muted)] group-hover/icon:text-[var(--pm-text)]"
                  )}>
                    {item.label}
                  </span>
                </button>
              );
            })}
          </div>
        </div>

        {/* ─── 3. SUB-CATEGORY SLIDER STRIP (Contextual Sub-Categories) ─── */}
        <AnimatePresence mode="wait">
          {hasSubcategories && selectedCategoryObj.subcategories && (
            <motion.div
              key={selectedCategoryObj.id}
              initial={{ opacity: 0, height: 0, y: -4 }}
              animate={{ opacity: 1, height: 'auto', y: 0 }}
              exit={{ opacity: 0, height: 0, y: -4 }}
              transition={{ duration: 0.2 }}
              className="overflow-hidden border-t border-[var(--pm-border)]/50 pt-2 pb-2.5"
            >
              <div 
                ref={subScrollContainerRef}
                className="flex items-center gap-2 overflow-x-auto no-scrollbar scroll-smooth px-1"
              >
                <span className="text-[10px] text-[var(--pm-accent)] font-black uppercase tracking-wider shrink-0 flex items-center gap-1 mr-1">
                  <Sparkles className="w-3 h-3 text-[var(--pm-accent)]" />
                  ফিল্টার:
                </span>

                {selectedCategoryObj.subcategories.map((sub) => {
                  const isSubActive = activeSubCategory === sub.slug || (sub.slug === 'all' && !activeSubCategory);

                  return (
                    <button
                      key={sub.id}
                      onClick={() => handleSelectSubCategory(sub.slug)}
                      className={cn(
                        "shrink-0 px-3.5 py-1.5 rounded-xl text-xs font-bold transition-all cursor-pointer whitespace-nowrap shadow-xs",
                        isSubActive
                          ? "bg-[var(--pm-accent)] text-white shadow-sm shadow-[var(--pm-accent)]/30 font-black"
                          : "text-[var(--pm-text-muted)] hover:text-[var(--pm-text)] bg-[var(--pm-surface)] hover:bg-[var(--pm-surface-hover)] border border-[var(--pm-border)]"
                      )}
                    >
                      {sub.nameBn}
                    </button>
                  );
                })}
              </div>
            </motion.div>
          )}
        </AnimatePresence>

      </div>
    </div>
  );
};

export default CategoryBar;
