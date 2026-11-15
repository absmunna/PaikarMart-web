import React, { useEffect, useMemo, useRef, useState } from 'react';
import { 
  ShoppingBag, 
  Package, 
  MapPin, 
  Wrench, 
  Megaphone, 
  Tag, 
  Star, 
  Truck, 
  ShieldCheck, 
  Layers, 
  ChevronRight, 
  Building2, 
  Globe, 
  Clock, 
  Briefcase, 
  Home, 
  Heart, 
  ArrowDownCircle, 
  Users,
  Search,
  Filter,
  SlidersHorizontal,
  Plus,
  Minus,
  Check,
  Sparkles,
  Zap,
  TrendingUp,
  Sliders
} from 'lucide-react';
import { CommerceItem, TradeMode, PortalTab, Order, User } from '@/types';
import { useLanguage } from '@/contexts/LanguageContext';
import { useLocationSettings } from '@/contexts';
import { computeLocalGeofenceMeta } from '@/lib/hyperlocal';
import {
  CommerceProductCard,
  CategoryBar,
  VoucherDealsStrip,
  PrescriptionUploadModal
} from '@/features/marketplace';
import { PromotionalAdCard } from '@/components/shared/PromotionalAdCard';
import type { MainCategoryTile } from '@/data/portalsData';

export type PortalFilterType = 
  | 'all' 
  | 'retail' 
  | 'wholesale' 
  | 'nearby' 
  | 'services' 
  | 'demand' 
  | 'used';

interface CommercePortalProps {
  items: CommerceItem[];
  onAddToCart: (item: CommerceItem, quantity: number, isWholesale: boolean) => void;
  onSelectTab?: (tab: PortalTab) => void;
  currentUser?: User;
  appliedVoucherCode?: string;
  onSelectVoucher?: (code: string) => void;
  onOrderPlaced?: (order: Order) => void;
  externalSearchQuery?: string;
}

export const CommercePortal: React.FC<CommercePortalProps> = ({
  items,
  onAddToCart,
  onSelectTab,
  currentUser,
  appliedVoucherCode,
  onSelectVoucher,
  onOrderPlaced,
  externalSearchQuery = '',
}) => {
  const { language } = useLanguage();
  const { activeLocation, coordinates, radarRadiusKm, setRadarRadiusKm } = useLocationSettings();
  const isBn = language === 'bn';

  // Active portal filter
  const [activePortal, setActivePortal] = useState<PortalFilterType>('all');
  const [selectedSubCategory, setSelectedSubCategory] = useState<string>('all');
  const [searchQuery, setSearchQuery] = useState<string>(externalSearchQuery);
  const [sortBy, setSortBy] = useState<'recommended' | 'price_low' | 'price_high' | 'rating' | 'moq'>('recommended');
  const [activeChildPortalId, setActiveChildPortalId] = useState('c-retail-home');
  const [visibleCount, setVisibleCount] = useState(12);
  const loadMoreRef = useRef<HTMLDivElement>(null);

  const childPortalHome: Record<string, { title: string; subtitle: string; accent: string }> = {
    'c-retail-home': {
      title: isBn ? 'রিটেইল মার্কেট হোম' : 'Retail Marketplace Home',
      subtitle: isBn ? 'সব খুচরা পণ্য, অফার ও verified seller এক ফিডে।' : 'Retail products, offers, and verified sellers in one feed.',
      accent: 'from-sky-600 to-indigo-700',
    },
    'c-wholesale-home': {
      title: isBn ? 'হোলসেল ও B2B হোম' : 'Wholesale & B2B Home',
      subtitle: isBn ? 'MOQ লট, factory rate এবং bulk trade feed দেখুন।' : 'Browse MOQ lots, factory rates, and bulk trade listings.',
      accent: 'from-amber-600 to-orange-700',
    },
    'c-grocery-home': {
      title: isBn ? 'গ্রোসারি মার্কেট হোম' : 'Grocery Market Home',
      subtitle: isBn ? 'দৈনন্দিন বাজার ও fresh grocery দ্রুত খুঁজুন।' : 'Find daily essentials and fresh grocery nearby.',
      accent: 'from-emerald-600 to-green-700',
    },
    'c-pharmacy-home': {
      title: isBn ? 'ফার্মেসি ও Rx হোম' : 'Pharmacy & Rx Home',
      subtitle: isBn ? 'লাইসেন্সপ্রাপ্ত pharmacy, prescription ও care products।' : 'Licensed pharmacies, prescriptions, and care products.',
      accent: 'from-teal-600 to-cyan-700',
    },
    'c-brand-shops-home': {
      title: isBn ? 'ব্র্যান্ড শপ হোম' : 'Brand Shops Home',
      subtitle: isBn ? 'Official flagship shop ও verified brand catalog।' : 'Official flagship shops and verified brand catalogs.',
      accent: 'from-amber-600 to-red-700',
    },
    'c-digital-home': {
      title: isBn ? 'ডিজিটাল পণ্য হোম' : 'Digital Goods Home',
      subtitle: isBn ? 'Electronics, gadgets ও technology products এক জায়গায়।' : 'Electronics, gadgets, and technology products in one place.',
      accent: 'from-cyan-600 to-blue-700',
    },
  };

  React.useEffect(() => {
    setSearchQuery(externalSearchQuery);
  }, [externalSearchQuery]);

  useEffect(() => {
    setVisibleCount(12);
  }, [activePortal, selectedSubCategory, searchQuery, sortBy]);
  
  // Wholesale MOQ quantity state
  const [wholesaleQtyMap, setWholesaleQtyMap] = useState<Record<string, number>>({});
  const [addedNoticeMap, setAddedNoticeMap] = useState<Record<string, boolean>>({});
  const [isPrescriptionModalOpen, setIsPrescriptionModalOpen] = useState(false);

  // Dynamic Sub-Categories map based on Active Portal
  const dynamicSubCategories = useMemo(() => {
    switch (activePortal) {
      case 'retail':
        return [
          { id: 'all', label: isBn ? 'সব ক্যাটাগরি' : 'All Retail' },
          { id: 'brand', label: isBn ? 'ব্র্যান্ড শপ' : 'Brand Shops', icon: Building2 },
          { id: 'nearby', label: isBn ? 'নিকটস্থ আউটলেট' : 'Nearby Outlets', icon: MapPin },
          { id: 'homemade', label: isBn ? 'হোম মেইড' : 'Homemade', icon: Home },
          { id: 'pharmacy', label: isBn ? 'ফার্মেসী ও ড্রাগস' : 'Pharmacy', icon: Heart },
          { id: 'online', label: isBn ? 'অনলাইন বুটিক' : 'Online Boutique', icon: Globe },
          { id: 'dropshipping', label: isBn ? 'ড্রপশিপিং' : 'DropShipping', icon: Truck },
        ];
      case 'wholesale':
        return [
          { id: 'all', label: isBn ? 'সব পাইকারি ডিল' : 'All Wholesale' },
          { id: 'factory', label: isBn ? 'ফ্যাক্টরি ডাইরেক্ট' : 'Direct Factory', icon: Layers },
          { id: 'exporter', label: isBn ? 'এক্সপোর্টার' : 'Exporters', icon: Globe },
          { id: 'importer', label: isBn ? 'ইম্পোর্টার' : 'Importers', icon: ArrowDownCircle },
          { id: 'dealer', label: isBn ? 'ডিলার ও এজেন্ট' : 'Dealers', icon: Briefcase },
          { id: 'broker', label: isBn ? 'হোলসেল ব্রোকার' : 'Wholesale Brokers', icon: Users },
        ];
      case 'nearby':
        return [
          { id: 'all', label: isBn ? 'সব নিকটস্থ দোকান' : 'All Nearby' },
          { id: '0.5km', label: isBn ? '৫০০ মিটারের মধ্যে' : 'Within 500m' },
          { id: '2km', label: isBn ? '২ কিমির মধ্যে' : 'Within 2 km' },
          { id: 'express', label: isBn ? 'তাত্ক্ষণিক ৩০ মিনিট ডেলিভারি' : 'Express 30min' },
        ];
      case 'services':
        return [
          { id: 'all', label: isBn ? 'সব সার্ভিস' : 'All Services' },
          { id: 'repair', label: isBn ? 'এসি ও ফ্যান মেরামত' : 'Home Repairs' },
          { id: 'salon', label: isBn ? 'সেলুন ও বিউটি' : 'Salons & Beauty' },
          { id: 'electrician', label: isBn ? 'ইলেকট্রিশিয়ান' : 'Electricians' },
          { id: 'plumber', label: isBn ? 'প্লাম্বার' : 'Plumbing' },
        ];
      case 'demand':
        return [
          { id: 'all', label: isBn ? 'সব ক্রেতার রিকোয়েস্ট' : 'All Buying Requests' },
          { id: 'bulk_demand', label: isBn ? 'পাইকারি কোটেশন (RFQ)' : 'Bulk RFQ' },
          { id: 'urgent', label: isBn ? 'জরুরি ক্রয় প্রয়োজন' : 'Urgent Demand' },
        ];
      case 'used':
        return [
          { id: 'all', label: isBn ? 'সব ব্যবহৃত পণ্য' : 'All Used Goods' },
          { id: 'electronics', label: isBn ? 'মোবাইল ও গ্যাজেট' : 'Gadgets & Phones' },
          { id: 'vehicles', label: isBn ? 'বাইক ও গাড়ি' : 'Bikes & Vehicles' },
          { id: 'furniture', label: isBn ? 'আসবাবপত্র' : 'Home Furniture' },
        ];
      default:
        return [
          { id: 'all', label: isBn ? 'সব র্যান্ডম পণ্য' : 'All Amazon-Style Feed' },
          { id: 'electronics', label: isBn ? 'ইলেক্ট্রনিক্স' : 'Electronics' },
          { id: 'fashion', label: isBn ? 'ফ্যাশন ও ক্লদিং' : 'Fashion & Apparel' },
          { id: 'grocery', label: isBn ? 'গ্রোসারী ও ফুড' : 'Grocery & Food' },
          { id: 'services', label: isBn ? 'সার্ভিস ও মেরামত' : 'Services & Repair' },
        ];
    }
  }, [activePortal, isBn]);

  // Handle portal switch reset
  const handlePortalSwitch = (portalId: PortalFilterType) => {
    setActivePortal(portalId);
    setSelectedSubCategory('all');
  };

  // Tiered Pricing Calculator
  const getDynamicTierPrice = (item: CommerceItem, qty: number): number => {
    if (!item.wholesaleTiers || item.wholesaleTiers.length === 0) return item.price;
    let unitPrice = item.price;
    for (const tier of item.wholesaleTiers) {
      if (qty >= tier.minQty) {
        unitPrice = tier.pricePerUnit;
      }
    }
    return unitPrice;
  };

  const handleQtyChange = (itemId: string, qty: number, minQty = 1) => {
    setWholesaleQtyMap(prev => ({ ...prev, [itemId]: Math.max(minQty, qty) }));
  };

  const handleAddWithFeedback = (item: CommerceItem, isWholesale: boolean) => {
    const qty = wholesaleQtyMap[item.id] || (isWholesale ? (item.minWholesaleQty || 25) : 1);
    onAddToCart(item, qty, isWholesale);
    setAddedNoticeMap(prev => ({ ...prev, [item.id]: true }));
    setTimeout(() => {
      setAddedNoticeMap(prev => ({ ...prev, [item.id]: false }));
    }, 2000);
  };

  // Synthesize Mock Demand & Used items to populate rich feed
  const fullDiscoveryItems = useMemo(() => {
    const base = [...items];

    // Mock Demand item
    const demandMock: CommerceItem = {
      id: 'demand_rfq_01',
      storeId: 'buyer_mizan_corp',
      storeName: 'Mizan Super Shop (Buyer)',
      type: 'retail',
      tradeMode: 'retail',
      title: '[BUYING REQUEST] Need 500 Pcs USB Type-C Fast Charging Cables',
      description: 'Urgent wholesale requirement for retail chain in Chittagong. Target budget ৳120/pc. Instant cash payment.',
      price: 120.0,
      rating: 4.9,
      reviewsCount: 18,
      deliveryEta: 'Urgent Needed',
      category: 'Electronics',
      badge: 'Demand / RFQ',
      inStock: true,
      proximityDistance: '1.2 km',
      isDemandRequest: true,
    } as any;

    // Mock Used Product item
    const usedMock: CommerceItem = {
      id: 'used_item_01',
      storeId: 'user_rahim_99',
      storeName: 'Rahim Chowdhury (Verified Seller)',
      type: 'retail',
      tradeMode: 'retail',
      title: 'Used iPhone 13 Pro 128GB (Graphite - 92% Battery Health)',
      description: '100% original box, cable, and money receipt included. Used for 10 months with extreme care.',
      price: 68500.0,
      rating: 4.8,
      reviewsCount: 8,
      deliveryEta: 'Hand to Hand Pickup',
      category: 'Electronics',
      badge: 'Used / Pre-Owned',
      inStock: true,
      proximityDistance: '0.6 km',
      isUsedItem: true,
    } as any;

    return [demandMock, usedMock, ...base];
  }, [items]);

  const hyperlocalMetaMap = useMemo(() => {
    const map: Record<string, ReturnType<typeof computeLocalGeofenceMeta>> = {};
    fullDiscoveryItems.forEach((item, idx) => {
      map[item.id] = computeLocalGeofenceMeta(item, coordinates, radarRadiusKm, idx);
    });
    return map;
  }, [fullDiscoveryItems, coordinates, radarRadiusKm]);

  // Filtered & Sorted Feed Data
  const feedItems = useMemo(() => {
    return fullDiscoveryItems.filter((item: any) => {
      const geoMeta = hyperlocalMetaMap[item.id];
      // Portal Filter
      if (activePortal === 'retail' && item.tradeMode !== 'retail') return false;
      if (activePortal === 'wholesale' && item.tradeMode !== 'wholesale') return false;
      if (activePortal === 'nearby' && (!geoMeta || !geoMeta.withinRadius)) return false;
      if (activePortal === 'services' && item.type !== 'service') return false;
      if (activePortal === 'demand' && !item.isDemandRequest && !item.badge?.includes('Demand')) return false;
      if (activePortal === 'used' && !item.isUsedItem && !item.badge?.includes('Used')) return false;

      // Sub-category Filter
      if (selectedSubCategory !== 'all') {
        if (selectedSubCategory === '0.5km' && (!geoMeta || geoMeta.distanceKm > 0.5)) return false;
        else if (selectedSubCategory === '2km' && (!geoMeta || geoMeta.distanceKm > 2.0)) return false;
        else if (selectedSubCategory === 'express' && (!geoMeta || geoMeta.totalEtaMin > 30)) return false;
        else if (!['0.5km', '2km', 'express'].includes(selectedSubCategory)) {
          if (item.subCategory && item.subCategory !== selectedSubCategory) return false;
          if (!item.subCategory && item.category && !item.category.toLowerCase().includes(selectedSubCategory.toLowerCase())) return false;
        }
      }

      // Search Query
      if (searchQuery.trim()) {
        const q = searchQuery.toLowerCase();
        const matchTitle = item.title.toLowerCase().includes(q);
        const matchStore = item.storeName?.toLowerCase().includes(q);
        const matchCat = item.category?.toLowerCase().includes(q);
        if (!matchTitle && !matchStore && !matchCat) return false;
      }

      return true;
    }).sort((a, b) => {
      if (activePortal === 'nearby') {
        return (hyperlocalMetaMap[a.id]?.distanceKm ?? 99) - (hyperlocalMetaMap[b.id]?.distanceKm ?? 99);
      }
      if (sortBy === 'price_low') return a.price - b.price;
      if (sortBy === 'price_high') return b.price - a.price;
      if (sortBy === 'rating') return (b.rating || 0) - (a.rating || 0);
      if (sortBy === 'moq') return (b.minWholesaleQty || 1) - (a.minWholesaleQty || 1);
      return 0; // Recommended default
    });
  }, [fullDiscoveryItems, hyperlocalMetaMap, activePortal, selectedSubCategory, searchQuery, sortBy]);

  const visibleFeedItems = feedItems.slice(0, visibleCount);

  useEffect(() => {
    const sentinel = loadMoreRef.current;
    if (!sentinel || visibleCount >= feedItems.length) return;
    const observer = new IntersectionObserver(([entry]) => {
      if (entry.isIntersecting) setVisibleCount((count) => Math.min(count + 12, feedItems.length));
    }, { rootMargin: '360px 0px' });
    observer.observe(sentinel);
    return () => observer.disconnect();
  }, [feedItems.length, visibleCount]);

  // Compute item counts for each portal filter chip dynamically
  const portalCounts = useMemo(() => {
    return {
      all: fullDiscoveryItems.length,
      retail: fullDiscoveryItems.filter((i: any) => i.tradeMode === 'retail').length,
      wholesale: fullDiscoveryItems.filter((i: any) => i.tradeMode === 'wholesale').length,
      nearby: fullDiscoveryItems.filter((i: any) => hyperlocalMetaMap[i.id]?.withinRadius).length,
      services: fullDiscoveryItems.filter((i: any) => i.type === 'service').length,
      demand: fullDiscoveryItems.filter((i: any) => i.isDemandRequest || i.badge?.includes('Demand')).length,
      used: fullDiscoveryItems.filter((i: any) => i.isUsedItem || i.badge?.includes('Used')).length,
    };
  }, [fullDiscoveryItems, hyperlocalMetaMap]);

  return (
    <div className="space-y-5 pb-20 animate-fadeIn">
      {/* 1. 3-Tier Iconic Category Bar */}
      <CategoryBar
        isBn={isBn}
        activePortal={activePortal}
        selectedSubCategory={selectedSubCategory}
        initialPillar="commerce-hub"
        onPortalSwitch={handlePortalSwitch}
        onSubCategorySelect={setSelectedSubCategory}
        onSearchFilter={(kw) => setSearchQuery(kw)}
        onSelectTab={onSelectTab}
        onMainTileSelect={(tile: MainCategoryTile) => {
          setActiveChildPortalId(tile.id);
          setSearchQuery(tile.searchFilter || '');
        }}
      />

      {childPortalHome[activeChildPortalId] && (
        <section className={`rounded-3xl bg-gradient-to-r ${childPortalHome[activeChildPortalId].accent} p-5 sm:p-6 text-white shadow-lg overflow-hidden`}>
          <div className="max-w-2xl space-y-1.5">
            <p className="text-[10px] font-black uppercase tracking-[0.18em] text-white/70">
              {isBn ? 'Marketplace Hub · Portal Home' : 'Marketplace Hub · Portal Home'}
            </p>
            <h1 className="text-xl sm:text-2xl font-black tracking-tight">
              {childPortalHome[activeChildPortalId].title}
            </h1>
            <p className="text-xs sm:text-sm text-white/80">
              {childPortalHome[activeChildPortalId].subtitle}
            </p>
          </div>
      </section>
      )}

      <div className="px-1 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div className="space-y-1">
          <div className="flex items-center gap-2">
            <h2 className="text-xl font-black tracking-tight text-[var(--pm-text)]">
              {isBn ? 'পণ্য ও সেবা এক্সপ্লোর করুন' : 'Discover Items & Services'}
            </h2>
            <div className="flex items-center gap-1 px-2 py-0.5 rounded-full bg-[var(--pm-accent-soft)] text-[var(--pm-accent)] text-[10px] font-bold">
              <Zap className="w-3 h-3" />
              <span>{isBn ? 'লাইভ' : 'Live'}</span>
            </div>
          </div>
          <p className="text-xs text-[var(--pm-muted)]">
            {isBn 
              ? 'পাইকারি লট, খুচরা পণ্য এবং স্থানীয় সার্ভিস সব একসাথে' 
              : 'Explore factory-direct wholesale, retail deals, and local services'}
          </p>
        </div>

        <div className="flex items-center gap-2 self-stretch sm:self-auto">
          <button
            type="button"
            onClick={() => onSelectTab?.('wholesale')}
            className="flex-1 sm:flex-none px-4 py-2 rounded-xl bg-[var(--pm-card)] border border-[var(--pm-border)] text-[var(--pm-text)] text-xs font-bold hover:border-[var(--pm-accent)] hover:text-[var(--pm-accent)] transition-all flex items-center justify-center gap-2 active-scale cursor-pointer"
          >
            <Package className="w-4 h-4 text-[var(--pm-accent)]" />
            <span>{isBn ? 'পাইকারি বাজার' : 'Wholesale'}</span>
          </button>

          <div className="relative flex-1 sm:flex-none">
            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value as any)}
              className="w-full sm:w-auto px-3 py-2 rounded-xl bg-[var(--pm-card)] border border-[var(--pm-border)] text-[var(--pm-text)] text-xs font-bold focus:outline-none focus:border-[var(--pm-accent)] cursor-pointer appearance-none pr-8"
            >
              <option value="recommended">{isBn ? 'সর্ট: সেরা ম্যাচ' : 'Sort: Recommended'}</option>
              <option value="price_low">{isBn ? 'দাম: কম' : 'Price: Low'}</option>
              <option value="price_high">{isBn ? 'দাম: বেশি' : 'Price: High'}</option>
              <option value="rating">{isBn ? 'রেটিং' : 'Rating'}</option>
            </select>
            <SlidersHorizontal className="absolute right-2.5 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-[var(--pm-muted)] pointer-events-none" />
          </div>
        </div>
      </div>

      {/* Verified Vouchers & Rx / Bazar List Shortcut */}
      <VoucherDealsStrip
        isBn={isBn}
        appliedVoucherCode={appliedVoucherCode}
        onSelectVoucher={(code) => onSelectVoucher?.(code)}
        onOpenPrescriptionModal={() => setIsPrescriptionModalOpen(true)}
      />

      {/* Live Hyperlocal Radar Strip when Nearby Portal is Active */}
      {activePortal === 'nearby' && (
        <div className="p-4 rounded-2xl bg-[var(--pm-card)] border border-[var(--pm-success)]/30 space-y-2.5">
          <div className="flex flex-wrap items-center justify-between gap-2 text-xs">
            <span className="font-bold text-[var(--pm-text)] flex items-center gap-1.5">
              <Sliders className="w-4 h-4 text-[var(--pm-success)]" />
              <span>{activeLocation} · Radar Range: <span className="font-mono text-[var(--pm-success)]">{radarRadiusKm} km</span></span>
            </span>
            <div className="flex items-center gap-1.5">
              {[2, 5, 10, 20].map((km) => (
                <button
                  key={km}
                  type="button"
                  onClick={() => setRadarRadiusKm(km)}
                  className={`px-2 py-0.5 rounded-md font-mono font-bold text-[11px] cursor-pointer ${
                    radarRadiusKm === km
                      ? 'bg-[var(--pm-accent)] text-[var(--pm-accent-fg)]'
                      : 'bg-[var(--pm-surface)] border border-[var(--pm-border)] text-[var(--pm-muted)] hover:text-[var(--pm-text)]'
                  }`}
                >
                  {km}km
                </button>
              ))}
            </div>
          </div>
          <input
            type="range"
            min={1}
            max={20}
            value={radarRadiusKm}
            onChange={(e) => setRadarRadiusKm(Number(e.target.value))}
            className="w-full accent-[var(--pm-accent)] cursor-pointer"
          />
        </div>
      )}

      {/* 4. FEED COUNT & QUICK SEARCH FILTER */}
      <div className="flex items-center justify-between gap-4 px-1">
        <p className="text-xs font-bold text-[var(--pm-muted)]">
          {isBn ? `${visibleFeedItems.length}/${feedItems.length} টি পণ্য ও সেবা` : `Showing ${visibleFeedItems.length} of ${feedItems.length} items`}
        </p>

        {activePortal !== 'all' && (
          <button
            type="button"
            onClick={() => handlePortalSwitch('all')}
            className="text-xs font-black text-[var(--pm-accent)] hover:underline cursor-pointer"
          >
            {isBn ? '← সব ফিড রিসেট করুন' : '← Reset to All Feed'}
          </button>
        )}
      </div>

      {/* 5. INFINITE DISCOVERY PRODUCT FEED GRID */}
      <div className="grid grid-cols-1 xs:grid-cols-2 lg:grid-cols-3 gap-3 sm:gap-4">
        {visibleFeedItems.map((item: any, idx: number) => {
          const isWholesale = item.tradeMode === 'wholesale';
          const currentQty = wholesaleQtyMap[item.id] || (isWholesale ? (item.minWholesaleQty || 25) : 1);
          const unitPrice = isWholesale ? getDynamicTierPrice(item, currentQty) : item.price;
          const totalPrice = unitPrice * currentQty;
          const isAddedNotice = addedNoticeMap[item.id];
          const showAdAfter = (idx + 1) % 4 === 0;

          return (
            <React.Fragment key={item.id}>
              <CommerceProductCard
                item={item}
                isBn={isBn}
                currentQty={currentQty}
                unitPrice={unitPrice}
                totalPrice={totalPrice}
                isAddedNotice={isAddedNotice}
                onQtyChange={handleQtyChange}
                onAddToCart={handleAddWithFeedback}
                onSelectTab={onSelectTab}
              />
              {showAdAfter && (
                <PromotionalAdCard
                  key={`ad_card_${idx}`}
                  index={Math.floor((idx + 1) / 4) - 1}
                  isBn={isBn}
                />
              )}
            </React.Fragment>
          );
        })}
      </div>

      {visibleCount < feedItems.length && (
        <div ref={loadMoreRef} className="h-10 flex items-center justify-center text-xs font-semibold text-[var(--pm-muted)]" aria-live="polite">
          Loading more products…
        </div>
      )}

      <PrescriptionUploadModal
        isOpen={isPrescriptionModalOpen}
        onClose={() => setIsPrescriptionModalOpen(false)}
        isBn={isBn}
        currentUser={
          currentUser || {
            id: 'guest_buyer',
            name: 'Guest Buyer',
            handle: '@guest',
            avatar: '',
            role: 'consumer',
            isVendor: false,
            location: activeLocation || 'Dhaka, Bangladesh',
            balance: 0,
          }
        }
        onOrderCreated={(order) => {
          onOrderPlaced?.(order);
        }}
      />
    </div>
  );
};
