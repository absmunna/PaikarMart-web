import React, { useEffect, useMemo, useRef } from 'react';
import { useLocation, useNavigate, useSearchParams } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  ShoppingBag, Flame, ChevronRight, Sparkles, Filter, 
  Grid, Check, ArrowRight
} from 'lucide-react';
import { 
  PORTAL_CATEGORIES_MAP, 
  PortalContextType, 
  MainCategoryItem, 
  SubCategoryItem 
} from '@/shared/constants/categoriesData';
import { useCategoryStore } from '@/store/categoryStore';
import { cn } from '@/lib/utils';

export interface DynamicCategoryBarProps {
  className?: string;
  forcePortal?: PortalContextType;
  showDualFeedToggle?: boolean;
}

export const DynamicCategoryBar: React.FC<DynamicCategoryBarProps> = ({
  className,
  forcePortal,
  showDualFeedToggle = true
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
    
    if (path.startsWith('/wholesale') || path.startsWith('/b2b')) return 'wholesale';
    if (path.startsWith('/local') || path.startsWith('/nearby') || path.startsWith('/grocery') || path.startsWith('/pharmacy')) return 'local';
    if (path.startsWith('/services')) return 'services';
    if (path.startsWith('/logistics') || path.startsWith('/transport') || path.startsWith('/ride')) return 'logistics';
    if (path.startsWith('/marketplace') || path.startsWith('/b2c')) return 'retail';
    return 'all';
  }, [location.pathname, forcePortal]);

  // Keep store in sync with detected portal
  useEffect(() => {
    if (portalContext !== detectedPortal) {
      setPortalContext(detectedPortal);
    }
  }, [detectedPortal, portalContext, setPortalContext]);

  // Sync category state from URL query parameters on initial mount or change
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

  // Check if current route should hide the category bar completely
  const shouldHide = useMemo(() => {
    const path = location.pathname.toLowerCase();
    const hiddenRoutes = [
      '/auth',
      '/login',
      '/register',
      '/forgot-password',
      '/settings',
      '/profile',
      '/reels',
      '/checkout',
      '/admin'
    ];
    return hiddenRoutes.some(r => path.startsWith(r));
  }, [location.pathname]);

  if (shouldHide) {
    return null;
  }

  // Active categories list based on portal
  const categoriesList = PORTAL_CATEGORIES_MAP[portalContext] || PORTAL_CATEGORIES_MAP.all;

  // Selected category object
  const selectedCategoryObj = categoriesList.find(c => c.id === activeMainCategory) || categoriesList[0];
  const hasSubcategories = selectedCategoryObj?.subcategories && selectedCategoryObj.subcategories.length > 0;

  // Handlers for category selection
  const handleSelectMainCategory = (catId: string) => {
    setMainCategory(catId);
    
    // Update URL query parameters
    const newParams = new URLSearchParams(searchParams);
    if (catId === 'all') {
      newParams.delete('category');
      newParams.delete('sub');
    } else {
      newParams.set('category', catId);
      newParams.delete('sub'); // reset sub on main change
    }
    setSearchParams(newParams, { replace: true });
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

  // Determine if on root home page where Dual Feed Toggle is shown
  const isHomeOrFeed = location.pathname === '/' || location.pathname === '/feed';

  return (
    <div className={cn(
      "sticky top-16 z-40 w-full bg-[var(--pm-bg)]/95 backdrop-blur-xl border-b border-[var(--pm-border)] shadow-xs transition-all duration-300 select-none",
      className
    )}>
      <div className="max-w-[1600px] mx-auto px-3 sm:px-4">
        
        {/* ─── DUAL-FEED TOP TOGGLE (Commerce Grid vs Social Community) ─── */}
        {isHomeOrFeed && showDualFeedToggle && (
          <div className="pt-2.5 pb-1.5 flex items-center justify-between gap-3 border-b border-[var(--pm-border)]/40">
            <div className="inline-flex p-1 rounded-xl bg-[var(--pm-surface)]/80 border border-[var(--pm-border)]/60">
              <button
                onClick={() => {
                  setFeedTab('commerce');
                  if (location.pathname === '/feed') navigate('/');
                }}
                className={cn(
                  "flex items-center gap-1.5 px-3.5 py-1.5 rounded-lg text-xs font-black transition-all cursor-pointer",
                  feedTab === 'commerce' && location.pathname !== '/feed'
                    ? "bg-[var(--pm-accent)] text-white shadow-sm shadow-[var(--pm-accent)]/30 scale-100"
                    : "text-[var(--pm-muted)] hover:text-[var(--pm-text)]"
                )}
              >
                <ShoppingBag className="w-3.5 h-3.5" />
                <span>মার্কেটপ্লেস শপ</span>
              </button>

              <button
                onClick={() => {
                  setFeedTab('social');
                  if (location.pathname === '/') navigate('/feed');
                }}
                className={cn(
                  "flex items-center gap-1.5 px-3.5 py-1.5 rounded-lg text-xs font-black transition-all cursor-pointer",
                  feedTab === 'social' || location.pathname === '/feed'
                    ? "bg-gradient-to-r from-orange-600 to-pink-600 text-white shadow-sm shadow-orange-500/30 scale-100"
                    : "text-[var(--pm-muted)] hover:text-[var(--pm-text)]"
                )}
              >
                <Flame className="w-3.5 h-3.5" />
                <span>সোশ্যাল ও ডিমান্ড ফিড</span>
              </button>
            </div>

            {/* Portal Badge / Active Route Indicator */}
            <div className="hidden sm:flex items-center gap-1.5 text-[10px] text-[var(--pm-muted)] font-black uppercase tracking-wider">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
              <span>
                {portalContext === 'retail' && 'B2C রিটেইল মার্কেট'}
                {portalContext === 'wholesale' && 'B2B পাইকারি আড়ত'}
                {portalContext === 'local' && 'হাইপারলোকাল আশেপাশের দোকান'}
                {portalContext === 'services' && 'এক্সপার্ট সার্ভিস হাব'}
                {portalContext === 'logistics' && 'লজিস্টিকস ও আন্তঃজেলা রাইড'}
                {portalContext === 'all' && 'সুপার কমার্স ফিড'}
              </span>
            </div>
          </div>
        )}

        {/* ─── LEVEL 1: MAIN CATEGORIES ROW ─── */}
        <div 
          ref={scrollContainerRef}
          className="flex items-center gap-1.5 sm:gap-2 py-2 overflow-x-auto no-scrollbar scroll-smooth"
        >
          {categoriesList.map((category) => {
            const Icon = category.icon;
            const isSelected = activeMainCategory === category.id;

            return (
              <button
                key={category.id}
                onClick={() => handleSelectMainCategory(category.id)}
                className={cn(
                  "group relative shrink-0 flex items-center gap-1.5 px-3 sm:px-3.5 py-1.5 rounded-xl text-xs font-bold transition-all duration-200 cursor-pointer",
                  isSelected
                    ? "text-white bg-[var(--pm-accent)] shadow-md shadow-[var(--pm-accent)]/20"
                    : "text-[var(--pm-muted)] hover:text-[var(--pm-text)] hover:bg-[var(--pm-surface-hover)] bg-[var(--pm-surface)]/50 border border-[var(--pm-border)]/40"
                )}
              >
                <Icon className={cn(
                  "w-3.5 h-3.5 transition-transform duration-200 group-hover:scale-110",
                  isSelected ? "text-white" : (category.color || "text-[var(--pm-accent)]")
                )} />
                <span className="whitespace-nowrap font-black tracking-tight">
                  {category.nameBn}
                </span>

                {/* Subcategory dot indicator */}
                {category.subcategories && category.subcategories.length > 0 && (
                  <span className={cn(
                    "w-1 h-1 rounded-full",
                    isSelected ? "bg-white/80" : "bg-[var(--pm-accent)]/70"
                  )} />
                )}
              </button>
            );
          })}
        </div>

        {/* ─── LEVEL 2: DYNAMIC SECONDARY SUB-CATEGORY STRIP ─── */}
        <AnimatePresence mode="wait">
          {hasSubcategories && selectedCategoryObj.subcategories && (
            <motion.div
              key={selectedCategoryObj.id}
              initial={{ opacity: 0, height: 0, y: -4 }}
              animate={{ opacity: 1, height: 'auto', y: 0 }}
              exit={{ opacity: 0, height: 0, y: -4 }}
              transition={{ duration: 0.2 }}
              className="overflow-hidden border-t border-[var(--pm-border)]/30 py-1.5"
            >
              <div 
                ref={subScrollContainerRef}
                className="flex items-center gap-1.5 overflow-x-auto no-scrollbar scroll-smooth"
              >
                <span className="text-[10px] text-[var(--pm-muted)] font-extrabold uppercase tracking-wider shrink-0 pl-1 mr-1">
                  উপ-ক্যাটাগরি:
                </span>

                {selectedCategoryObj.subcategories.map((sub) => {
                  const isSubActive = activeSubCategory === sub.slug || (sub.slug === 'all' && !activeSubCategory);

                  return (
                    <button
                      key={sub.id}
                      onClick={() => handleSelectSubCategory(sub.slug)}
                      className={cn(
                        "shrink-0 px-2.5 py-1 rounded-lg text-[11px] font-bold transition-all cursor-pointer whitespace-nowrap",
                        isSubActive
                          ? "bg-[var(--pm-accent)]/20 text-[var(--pm-accent)] border border-[var(--pm-accent)]/40 font-black shadow-xs"
                          : "text-zinc-400 hover:text-white bg-[var(--pm-surface)]/40 hover:bg-[var(--pm-surface)] border border-transparent"
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

export default DynamicCategoryBar;
