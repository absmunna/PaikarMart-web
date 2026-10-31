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
    
    // Commerce Pillar
    if (
      path.startsWith('/wholesale') || 
      path.startsWith('/b2b') || 
      path.startsWith('/export') || 
      path.startsWith('/pk-shop') ||
      path.startsWith('/brands') ||
      path.startsWith('/marketplace') ||
      path.startsWith('/b2c') ||
      path.startsWith('/dropship') ||
      path.startsWith('/fashion') ||
      path.startsWith('/electronics')
    ) return 'commerce-hub';

    // Services & Logistics Pillar
    if (
      path.startsWith('/local') || 
      path.startsWith('/nearby') || 
      path.startsWith('/grocery') || 
      path.startsWith('/pharmacy') ||
      path.startsWith('/services') ||
      path.startsWith('/logistics') ||
      path.startsWith('/ride') ||
      path.startsWith('/food') ||
      path.startsWith('/transport')
    ) return 'services-logistics-hub';

    // Community Pillar
    if (
      path.startsWith('/social') ||
      path.startsWith('/feed') ||
      path.startsWith('/video') ||
      path.startsWith('/reels') ||
      path.startsWith('/news') ||
      path.startsWith('/demand')
    ) return 'community-content-hub';

    // Utility Pillar
    if (
      path.startsWith('/wallet') ||
      path.startsWith('/finance') ||
      path.startsWith('/workspace') ||
      path.startsWith('/education') ||
      path.startsWith('/healthcare')
    ) return 'utility-pro-hub';

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

  // Show category bar ONLY on the Marketplace Hub homepage (/marketplace or /market), hide everywhere else
  const shouldHide = useMemo(() => {
    const path = location.pathname.toLowerCase().replace(/\/$/, '');
    const isMarketplaceHome = path === '/marketplace' || path === '/market';
    return !isMarketplaceHome;
  }, [location.pathname]);

  if (shouldHide) {
    return null;
  }

  // ─── 4 PILLARS OF PAIKAR MART ───
  const pillarItems = [
    { 
      id: 'commerce', 
      icon: ShoppingBag, 
      label: 'কমার্স', 
      path: '/marketplace', 
      contextKey: 'commerce-hub',
      color: 'text-blue-400 bg-blue-500/10 border-blue-500/20' 
    },
    { 
      id: 'services', 
      icon: Wrench, 
      label: 'লজিস্টিকস', 
      path: '/services', 
      contextKey: 'services-logistics-hub',
      color: 'text-amber-400 bg-amber-500/10 border-amber-500/20' 
    },
    { 
      id: 'community', 
      icon: PlayCircle, 
      label: 'কমিউনিটি', 
      path: '/feed', 
      contextKey: 'community-content-hub',
      color: 'text-pink-400 bg-pink-500/10 border-pink-500/20' 
    },
    { 
      id: 'utility', 
      icon: Laptop, 
      label: 'ইউটিলিটি', 
      path: '/workspace', 
      contextKey: 'utility-pro-hub',
      color: 'text-cyan-400 bg-cyan-500/10 border-cyan-500/20' 
    },
  ];

  const categoriesList = PORTAL_CATEGORIES_MAP[portalContext] || PORTAL_CATEGORIES_MAP.all;
  const selectedCategoryObj = categoriesList.find(c => c.id === activeMainCategory) || categoriesList[0];
  const hasSubcategories = selectedCategoryObj?.subcategories && selectedCategoryObj.subcategories.length > 0;

  const handlePillarClick = (item: typeof pillarItems[0]) => {
    setPortalContext(item.contextKey as PortalContextType);
    navigate(item.path);
  };

  const handleCategoryClick = (catId: string) => {
    setMainCategory(catId);
    setSubCategory(null);
    
    // Update URL if needed
    if (portalContext === 'commerce-hub') {
       navigate(`/marketplace?category=${catId}`);
    }
  };

  const handleSelectSubCategory = (subSlug: string) => {
    const target = subSlug === 'all' || activeSubCategory === subSlug ? null : subSlug;
    setSubCategory(target);
  };

  const scrollCarousel = (direction: 'left' | 'right') => {
    if (scrollContainerRef.current) {
      const scrollAmount = direction === 'left' ? -260 : 260;
      scrollContainerRef.current.scrollBy({ left: scrollAmount, behavior: 'smooth' });
    }
  };

  return (
    <div className={cn(
      "sticky top-0 z-30 w-full bg-[var(--pm-bg)]/95 backdrop-blur-2xl border-b border-[var(--pm-border)] shadow-md transition-all duration-300 select-none",
      className
    )}>
      <div className="max-w-[1600px] mx-auto px-2 sm:px-4">
        
        {/* ─── 1. CORE PILLARS BAR ─── */}
        <div className="flex items-center justify-center gap-4 py-3 border-b border-white/5 overflow-x-auto no-scrollbar">
          {pillarItems.map((pillar) => {
            const isActive = portalContext === pillar.contextKey;
            const Icon = pillar.icon;
            return (
              <button
                key={pillar.id}
                onClick={() => handlePillarClick(pillar)}
                className={cn(
                  "flex items-center gap-2 px-4 py-2 rounded-2xl transition-all active:scale-95 whitespace-nowrap",
                  isActive 
                    ? "bg-[var(--pm-accent)] text-white shadow-lg shadow-[var(--pm-accent)]/20 font-black" 
                    : "bg-white/5 text-zinc-400 hover:text-white border border-white/5 hover:border-white/10"
                )}
              >
                <Icon className={cn("w-4 h-4", isActive ? "stroke-[3px]" : "stroke-[2px]")} />
                <span className="text-[11px] uppercase tracking-wider">{pillar.label}</span>
              </button>
            );
          })}
        </div>

        {/* ─── 2. SUB-PORTALS / CATEGORIES (Iconic) ─── */}
        <div className="relative group/carousel py-3">
          <div 
            ref={scrollContainerRef}
            className="flex items-center gap-4 sm:gap-6 overflow-x-auto no-scrollbar scroll-smooth px-1"
          >
            {categoriesList.map((cat) => {
              const Icon = cat.icon;
              const isActive = activeMainCategory === cat.id;

              return (
                <button
                  key={cat.id}
                  onClick={() => handleCategoryClick(cat.id)}
                  className="flex flex-col items-center gap-1.5 shrink-0 transition-all active:scale-95 group/icon cursor-pointer w-[64px]"
                >
                  <div className={cn(
                    "w-12 h-12 rounded-[20px] border flex items-center justify-center transition-all duration-300 relative overflow-hidden",
                    isActive 
                      ? "bg-gradient-to-br from-[var(--pm-accent)] to-orange-600 border-[var(--pm-accent)] shadow-lg scale-105" 
                      : "bg-[var(--pm-surface)] border-[var(--pm-border)] group-hover/icon:border-white/20"
                  )}>
                    <Icon className={cn(
                      "w-5 h-5 relative z-10 transition-transform duration-300",
                      isActive ? "text-white scale-110" : "text-zinc-500 group-hover/icon:text-zinc-200"
                    )} />
                  </div>
                  <span className={cn(
                    "text-[9px] font-black tracking-tight whitespace-nowrap transition-colors duration-300 truncate w-full text-center uppercase",
                    isActive ? "text-[var(--pm-accent)]" : "text-zinc-500 group-hover/icon:text-zinc-300"
                  )}>
                    {cat.nameBn}
                  </span>
                </button>
              );
            })}
          </div>
        </div>

        {/* ─── 3. FILTER CHIPS (Third Level) ─── */}
        <AnimatePresence mode="wait">
          {hasSubcategories && selectedCategoryObj.subcategories && (
            <motion.div
              key={selectedCategoryObj.id}
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              exit={{ opacity: 0, height: 0 }}
              className="overflow-hidden border-t border-white/5 pt-2 pb-3"
            >
              <div className="flex items-center gap-2 overflow-x-auto no-scrollbar px-1">
                {selectedCategoryObj.subcategories.map((sub) => {
                  const isSubActive = activeSubCategory === sub.slug || (sub.slug === 'all' && !activeSubCategory);
                  return (
                    <button
                      key={sub.id}
                      onClick={() => handleSelectSubCategory(sub.slug)}
                      className={cn(
                        "shrink-0 px-3 py-1.5 rounded-xl text-[10px] font-black transition-all whitespace-nowrap",
                        isSubActive
                          ? "bg-[var(--pm-accent)]/20 text-[var(--pm-accent)] border border-[var(--pm-accent)]/30"
                          : "text-zinc-500 hover:text-zinc-300 bg-white/5 border border-white/5"
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
