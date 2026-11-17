import React, { useEffect, useMemo, useRef, useState } from 'react';
import { useSearchParams } from 'react-router-dom';
import { 
  Home, 
  Search,
  Filter,
  SlidersHorizontal,
  Zap,
} from 'lucide-react';
import { CommerceItem, TradeMode, PortalTab, Order, User } from '@/types';
import { useLanguage } from '@/contexts/LanguageContext';
import { useLocationSettings } from '@/contexts';
import {
  CommerceProductCard,
  VoucherDealsStrip,
  PrescriptionUploadModal
} from '@/features/marketplace';
import { HubPortalNavigation } from '@/hubs/shared/HubPortalNavigation';
import { marketplacePortals } from '@/hubs/marketplace/config/marketplacePortals';
import { WholesalePortal } from '@/hubs/marketplace/portals/wholesale';
import type { PortalFilterType } from '@/features/marketplace/types';
import { PromotionalAdCard } from '@/components/shared/PromotionalAdCard';
import type { MarketplacePortalHomeProps } from '@/hubs/marketplace/portals/shared/types';

interface MarketplaceHubPageProps {
  items: CommerceItem[];
  onAddToCart: (item: CommerceItem, quantity: number, isWholesale: boolean) => void;
  onBuyNow?: (item: CommerceItem, quantity: number, isWholesale: boolean) => void;
  onSelectTab?: (tab: PortalTab) => void;
  currentUser?: User;
  appliedVoucherCode?: string;
  onSelectVoucher?: (code: string) => void;
  onOrderPlaced?: (order: Order) => void;
  externalSearchQuery?: string;
}

const RetailHomePage = React.lazy(() => import('@/hubs/marketplace/portals/retail').then((module) => ({ default: module.RetailHomePage })));
const GroceryHomePage = React.lazy(() => import('@/hubs/marketplace/portals/grocery').then((module) => ({ default: module.GroceryHomePage })));
const PharmacyHomePage = React.lazy(() => import('@/hubs/marketplace/portals/pharmacy').then((module) => ({ default: module.PharmacyHomePage })));
const BrandShopsHomePage = React.lazy(() => import('@/hubs/marketplace/portals/brand-shops').then((module) => ({ default: module.BrandShopsHomePage })));
const DigitalHomePage = React.lazy(() => import('@/hubs/marketplace/portals/digital').then((module) => ({ default: module.DigitalHomePage })));
const DemandHomePage = React.lazy(() => import('@/hubs/marketplace/portals/demand').then((module) => ({ default: module.DemandHomePage })));
const UsedHomePage = React.lazy(() => import('@/hubs/marketplace/portals/used').then((module) => ({ default: module.UsedHomePage })));

const MARKETPLACE_CHILD_PAGES: Partial<Record<PortalFilterType, React.LazyExoticComponent<React.ComponentType<MarketplacePortalHomeProps>>>> = {
  retail: RetailHomePage,
  grocery: GroceryHomePage,
  pharmacy: PharmacyHomePage,
  'brand-shops': BrandShopsHomePage,
  digital: DigitalHomePage,
  demand: DemandHomePage,
  used: UsedHomePage,
};

const parsePortalFilter = (value: string | null): PortalFilterType =>
  value && marketplacePortals.some((portal) => portal.id === value)
    ? value as PortalFilterType
    : 'all';

export const MarketplaceHubPage: React.FC<MarketplaceHubPageProps> = ({
  items,
  onAddToCart,
  onBuyNow,
  onSelectTab,
  currentUser,
  appliedVoucherCode,
  onSelectVoucher,
  onOrderPlaced,
  externalSearchQuery = '',
}) => {
  const { language } = useLanguage();
  const { activeLocation } = useLocationSettings();
  const isBn = language === 'bn';
  const [searchParams, setSearchParams] = useSearchParams();

  // Active portal filter
  const [activePortal, setActivePortal] = useState<PortalFilterType>(() => parsePortalFilter(searchParams.get('portal')));
  const [selectedCategoryId, setSelectedCategoryId] = useState<string>(() => searchParams.get('category') || 'all');
  const [searchQuery, setSearchQuery] = useState<string>(externalSearchQuery);
  const [sortBy, setSortBy] = useState<'recommended' | 'price_low' | 'price_high' | 'rating' | 'moq'>('recommended');
  const [visibleCount, setVisibleCount] = useState(12);
  const loadMoreRef = useRef<HTMLDivElement>(null);
  const activePortalDefinition = marketplacePortals.find((portal) => portal.id === activePortal);
  const selectedCategory = activePortalDefinition?.categories.find((category) => category.id === selectedCategoryId)
    || marketplacePortals.flatMap((portal) => portal.categories).find((category) => category.id === selectedCategoryId);
  const selectedSubCategory = selectedCategory?.filterKey || 'all';

  useEffect(() => {
    setActivePortal(parsePortalFilter(searchParams.get('portal')));
    setSelectedCategoryId(searchParams.get('category') || 'all');
  }, [searchParams]);

  const mixedFeedHome = {
    title: isBn ? 'মার্কেটপ্লেস মিক্সড ফিড' : 'Marketplace Mixed Feed',
    subtitle: isBn ? 'সব শপ, ক্যাটাগরি, অফার ও পণ্য একসাথে দেখুন।' : 'Explore products and offers from every marketplace channel.',
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

  // Handle portal switch reset
  const handlePortalSwitch = (portalId: string) => {
    const nextPortal = parsePortalFilter(portalId);
    setActivePortal(nextPortal);
    setSelectedCategoryId('all');
    setSearchParams((current) => {
      const next = new URLSearchParams(current);
      if (nextPortal === 'all') next.delete('portal');
      else next.set('portal', nextPortal);
      next.delete('category');
      return next;
    });
  };

  const handleCategorySelect = (categoryId: string) => {
    setSelectedCategoryId(categoryId);
    setSearchParams((current) => {
      const next = new URLSearchParams(current);
      if (categoryId === 'all') next.delete('category');
      else next.set('category', categoryId);
      return next;
    });
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

  const handleBuyNow = (item: CommerceItem, isWholesale: boolean) => {
    const qty = wholesaleQtyMap[item.id] || (isWholesale ? (item.minWholesaleQty || 25) : 1);
    if (onBuyNow) {
      onBuyNow(item, qty, isWholesale);
      return;
    }
    onAddToCart(item, qty, isWholesale);
  };

  // Synthesize Mock Demand & Used items to populate rich feed
  const fullDiscoveryItems = useMemo(() => {
    const base = items.filter((item) => item.type !== 'service' && item.type !== 'rides');

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

  // Filtered & Sorted Feed Data
  const feedItems = useMemo(() => {
    return fullDiscoveryItems.filter((item: any) => {
      // Portal Filter
      if (activePortal === 'retail' && (item.tradeMode !== 'retail' || item.isDemandRequest || item.isUsedItem)) return false;
      if (activePortal === 'wholesale' && item.tradeMode !== 'wholesale') return false;
      const itemSearchText = `${item.title} ${item.description} ${item.category} ${item.subCategory} ${item.storeName}`.toLowerCase();
      if (['grocery', 'pharmacy', 'brand-shops', 'digital'].includes(activePortal) && item.tradeMode === 'wholesale') return false;
      if (activePortal === 'grocery' && item.type !== 'grocery' && item.type !== 'food' && !/grocery|food|produce|rice|bakery|গ্রোসারি|খাবার/.test(itemSearchText)) return false;
      const pharmacyListingText = `${item.category} ${item.subCategory} ${item.storeName}`.toLowerCase();
      if (activePortal === 'pharmacy' && !/pharmacy|medicine|health|care|drug|pharma|ফার্মেসি|ওষুধ/.test(pharmacyListingText)) return false;
      if (activePortal === 'brand-shops' && !/official|brand|samsung|apple|vision/.test(itemSearchText)) return false;
      if (activePortal === 'digital' && !/electronics|mobile|phone|tablet|computer|gadget|digital|ইলেকট্রনিক্স|মোবাইল/.test(itemSearchText)) return false;
      if (activePortal === 'demand' && !item.isDemandRequest && !item.badge?.includes('Demand')) return false;
      if (activePortal === 'used' && !item.isUsedItem && !item.badge?.includes('Used')) return false;

      // Sub-category Filter
      if (selectedSubCategory !== 'all') {
        if (!itemSearchText.includes(selectedSubCategory.toLowerCase())) return false;
      }

      // Search Query
      if (searchQuery.trim()) {
        const q = searchQuery.toLowerCase();
        if (!itemSearchText.includes(q)) return false;
      }

      return true;
    }).sort((a, b) => {
      if (sortBy === 'price_low') return a.price - b.price;
      if (sortBy === 'price_high') return b.price - a.price;
      if (sortBy === 'rating') return (b.rating || 0) - (a.rating || 0);
      if (sortBy === 'moq') return (b.minWholesaleQty || 1) - (a.minWholesaleQty || 1);
      return 0; // Recommended default
    });
  }, [fullDiscoveryItems, activePortal, selectedSubCategory, searchQuery, sortBy]);

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

  const categoryNavigation = (
    <HubPortalNavigation
      portals={marketplacePortals}
      activePortalId={activePortal}
      selectedCategoryId={selectedCategoryId}
      allLabel={isBn ? 'সব পণ্য' : 'All Products'}
      categoryAllLabel={isBn ? 'সব ক্যাটাগরি' : 'All categories'}
      isBn={isBn}
      onPortalSelect={handlePortalSwitch}
      onCategorySelect={handleCategorySelect}
    />
  );

  const prescriptionUploadModal = (
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
      onOrderCreated={(order) => onOrderPlaced?.(order)}
    />
  );

  if (activePortal === 'wholesale') {
    return (
      <div className="space-y-5 pb-20 animate-fadeIn">
        {categoryNavigation}
        <WholesalePortal items={items} onAddToCart={onAddToCart} onSelectTab={onSelectTab} />
      </div>
    );
  }

  const ChildPortalHome = MARKETPLACE_CHILD_PAGES[activePortal];
  if (ChildPortalHome) {
    return (
      <div className="space-y-4 pb-20 sm:space-y-5">
        {categoryNavigation}
        <React.Suspense fallback={<div className="h-48 animate-pulse rounded-2xl bg-[var(--pm-card)]" aria-label={isBn ? 'পোর্টাল লোড হচ্ছে' : 'Loading portal'} />}>
          <ChildPortalHome
            items={visibleFeedItems}
            totalCount={feedItems.length}
            hasMore={visibleCount < feedItems.length}
            loadMoreRef={loadMoreRef}
            isBn={isBn}
            appliedVoucherCode={appliedVoucherCode}
            sortBy={sortBy}
            addedNoticeMap={addedNoticeMap}
            wholesaleQtyMap={wholesaleQtyMap}
            onSortChange={setSortBy}
            onQuantityChange={handleQtyChange}
            onAddToCart={handleAddWithFeedback}
            onBuyNow={handleBuyNow}
            onSelectTab={onSelectTab}
            onSelectVoucher={onSelectVoucher}
            onOpenPrescription={() => setIsPrescriptionModalOpen(true)}
          />
        </React.Suspense>
        {prescriptionUploadModal}
      </div>
    );
  }

  return (
    <div className="space-y-5 pb-20 animate-fadeIn">
      {/* 1. 3-Tier Iconic Category Bar */}
      {categoryNavigation}

      {activePortal === 'all' && (
        <section className="rounded-2xl border border-[var(--pm-border)] bg-[var(--pm-card)] p-4 text-[var(--pm-text)] shadow-xs sm:rounded-3xl sm:p-6">
          <div className="max-w-2xl space-y-1.5">
            <p className="text-xs font-bold text-[var(--pm-accent)]">
              {isBn ? 'Marketplace Hub · Portal Home' : 'Marketplace Hub · Portal Home'}
            </p>
            <h1 className="text-xl font-black tracking-tight sm:text-2xl">{mixedFeedHome.title}</h1>
            <p className="text-xs leading-5 text-[var(--pm-muted)] sm:text-sm">{mixedFeedHome.subtitle}</p>
          </div>
        </section>
      )}

      <div className="px-1 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div className="space-y-1">
          <div className="flex items-center gap-2">
            <h2 className="text-xl font-black tracking-tight text-[var(--pm-text)]">
              {isBn ? 'মার্কেটপ্লেসের পণ্য এক্সপ্লোর করুন' : 'Discover Marketplace Products'}
            </h2>
            <div className="flex items-center gap-1 px-2 py-0.5 rounded-full bg-[var(--pm-accent-soft)] text-[var(--pm-accent)] text-[10px] font-bold">
              <Zap className="w-3 h-3" />
              <span>{isBn ? 'লাইভ' : 'Live'}</span>
            </div>
          </div>
          <p className="text-xs text-[var(--pm-muted)]">
            {isBn 
              ? 'রিটেইল, পাইকারি, গ্রোসারি, ফার্মেসি ও ব্র্যান্ড শপের পণ্য এক ফিডে'
              : 'Retail, wholesale, grocery, pharmacy, brand and resale listings in one feed'}
          </p>
        </div>

        <div className="flex items-center gap-2 self-stretch sm:self-auto">
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
                onBuyNow={handleBuyNow}
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

      {prescriptionUploadModal}
    </div>
  );
};
