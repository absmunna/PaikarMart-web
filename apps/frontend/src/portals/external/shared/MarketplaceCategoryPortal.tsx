import React, { useEffect, useMemo, useRef, useState } from 'react';
import { Package, RotateCcw, SlidersHorizontal, Zap } from 'lucide-react';
import { CommerceItem, Order, PortalTab, User } from '@/types';
import { useLanguage } from '@/contexts/LanguageContext';
import { useLocationSettings } from '@/contexts';
import { computeLocalGeofenceMeta } from '@/features/logistics';
import {
  CommerceProductCard,
  PrescriptionUploadModal,
  VoucherDealsStrip,
  type PortalFilterType,
} from '@/features/marketplace';
import { PromotionalAdCard } from '@/design-system/components';

export interface MarketplacePortalBaseProps {
  items: CommerceItem[];
  onAddToCart: (item: CommerceItem, quantity: number, isWholesale: boolean) => void;
  onBuyNow?: (item: CommerceItem, quantity: number, isWholesale: boolean) => void;
  onSelectTab?: (tab: PortalTab) => void;
  currentUser?: User;
  appliedVoucherCode?: string;
  onSelectVoucher?: (code: string) => void;
  onOrderPlaced?: (order: Order) => void;
  externalSearchQuery?: string;
  externalActivePortal?: PortalFilterType;
  externalSubCategory?: string;
  onResetChildPortal?: () => void;
}

interface MarketplaceCategoryPortalConfig {
  portalId: string;
  badgeEn: string;
  badgeBn: string;
  titleEn: string;
  titleBn: string;
  subtitleEn: string;
  subtitleBn: string;
  accentGradient: string;
  showVouchers?: boolean;
  showRxUploadCta?: boolean;
  itemMatcher?: (item: CommerceItem) => boolean;
}

interface MarketplaceCategoryPortalProps extends MarketplacePortalBaseProps {
  config: MarketplaceCategoryPortalConfig;
}

export const MarketplaceCategoryPortal: React.FC<MarketplaceCategoryPortalProps> = ({
  config,
  items,
  onAddToCart,
  onBuyNow,
  onSelectTab,
  currentUser,
  appliedVoucherCode,
  onSelectVoucher,
  onOrderPlaced,
  externalSearchQuery = '',
  externalActivePortal = 'all',
  externalSubCategory = 'all',
  onResetChildPortal,
}) => {
  const { language } = useLanguage();
  const { activeLocation, coordinates, radarRadiusKm } = useLocationSettings();
  const isBn = language === 'bn';

  const [sortBy, setSortBy] = useState<'recommended' | 'price_low' | 'price_high' | 'rating'>('recommended');
  const [visibleCount, setVisibleCount] = useState(12);
  const [wholesaleQtyMap, setWholesaleQtyMap] = useState<Record<string, number>>({});
  const [addedNoticeMap, setAddedNoticeMap] = useState<Record<string, boolean>>({});
  const [isPrescriptionModalOpen, setIsPrescriptionModalOpen] = useState(false);
  const loadMoreRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    setVisibleCount(12);
  }, [config.portalId, externalActivePortal, externalSubCategory, externalSearchQuery, sortBy]);

  const hyperlocalMetaMap = useMemo(() => {
    const map: Record<string, ReturnType<typeof computeLocalGeofenceMeta>> = {};
    items.forEach((item, idx) => {
      map[item.id] = computeLocalGeofenceMeta(item, coordinates, radarRadiusKm, idx);
    });
    return map;
  }, [items, coordinates, radarRadiusKm]);

  const filteredItems = useMemo(() => {
    const normalizedSub = (externalSubCategory || 'all').trim().toLowerCase();
    const normalizedQuery = externalSearchQuery.trim().toLowerCase();

    return items
      .filter((item: any) => {
        if (config.itemMatcher && !config.itemMatcher(item)) return false;

        const geoMeta = hyperlocalMetaMap[item.id];
        if (externalActivePortal === 'retail' && item.tradeMode !== 'retail') return false;
        if (externalActivePortal === 'wholesale' && item.tradeMode !== 'wholesale') return false;
        if (externalActivePortal === 'nearby' && (!geoMeta || !geoMeta.withinRadius)) return false;
        if (externalActivePortal === 'services' && item.type !== 'service') return false;
        if (externalActivePortal === 'demand' && !item.isDemandRequest && !item.badge?.includes('Demand')) return false;
        if (externalActivePortal === 'used' && !item.isUsedItem && !item.badge?.includes('Used')) return false;

        if (normalizedSub && normalizedSub !== 'all') {
          const haystack = `${item.title} ${item.description || ''} ${item.category || ''} ${item.badge || ''} ${item.storeName || ''}`.toLowerCase();
          if (!haystack.includes(normalizedSub)) return false;
        }

        if (normalizedQuery) {
          const haystack = `${item.title} ${item.description || ''} ${item.category || ''} ${item.badge || ''} ${item.storeName || ''}`.toLowerCase();
          if (!haystack.includes(normalizedQuery)) return false;
        }

        return true;
      })
      .sort((a, b) => {
        if (externalActivePortal === 'nearby') {
          return (hyperlocalMetaMap[a.id]?.distanceKm ?? 99) - (hyperlocalMetaMap[b.id]?.distanceKm ?? 99);
        }
        if (sortBy === 'price_low') return a.price - b.price;
        if (sortBy === 'price_high') return b.price - a.price;
        if (sortBy === 'rating') return (b.rating || 0) - (a.rating || 0);
        return 0;
      });
  }, [items, hyperlocalMetaMap, config, externalActivePortal, externalSubCategory, externalSearchQuery, sortBy]);

  const visibleItems = filteredItems.slice(0, visibleCount);

  useEffect(() => {
    const sentinel = loadMoreRef.current;
    if (!sentinel || visibleCount >= filteredItems.length) return;
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) setVisibleCount((count) => Math.min(count + 12, filteredItems.length));
      },
      { rootMargin: '360px 0px' }
    );
    observer.observe(sentinel);
    return () => observer.disconnect();
  }, [filteredItems.length, visibleCount]);

  const getDynamicTierPrice = (item: CommerceItem, qty: number): number => {
    if (!item.wholesaleTiers || item.wholesaleTiers.length === 0) return item.price;
    let unitPrice = item.price;
    for (const tier of item.wholesaleTiers) {
      if (qty >= tier.minQty) unitPrice = tier.pricePerUnit;
    }
    return unitPrice;
  };

  const handleQtyChange = (itemId: string, qty: number, minQty = 1) => {
    setWholesaleQtyMap((prev) => ({ ...prev, [itemId]: Math.max(minQty, qty) }));
  };

  const handleAddWithFeedback = (item: CommerceItem, isWholesale: boolean) => {
    const qty = wholesaleQtyMap[item.id] || (isWholesale ? item.minWholesaleQty || 25 : 1);
    onAddToCart(item, qty, isWholesale);
    setAddedNoticeMap((prev) => ({ ...prev, [item.id]: true }));
    setTimeout(() => {
      setAddedNoticeMap((prev) => ({ ...prev, [item.id]: false }));
    }, 2000);
  };

  const handleBuyNow = (item: CommerceItem, isWholesale: boolean) => {
    const qty = wholesaleQtyMap[item.id] || (isWholesale ? item.minWholesaleQty || 25 : 1);
    if (onBuyNow) {
      onBuyNow(item, qty, isWholesale);
      return;
    }
    onAddToCart(item, qty, isWholesale);
  };

  return (
    <div className="space-y-5 pb-20 animate-fadeIn">
      <section className={`rounded-3xl bg-gradient-to-r ${config.accentGradient} p-5 sm:p-6 text-white shadow-lg overflow-hidden`}>
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div className="max-w-2xl space-y-1.5">
            <p className="text-[10px] font-black uppercase tracking-[0.18em] text-white/75">
              {isBn ? config.badgeBn : config.badgeEn}
            </p>
            <h1 className="text-xl sm:text-2xl font-black tracking-tight">
              {isBn ? config.titleBn : config.titleEn}
            </h1>
            <p className="text-xs sm:text-sm text-white/85">
              {isBn ? config.subtitleBn : config.subtitleEn}
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-2">
            {config.showRxUploadCta && (
              <button
                type="button"
                onClick={() => setIsPrescriptionModalOpen(true)}
                className="px-4 py-2 rounded-xl bg-white text-teal-700 font-bold text-xs shadow-sm hover:bg-white/95 transition-colors cursor-pointer"
              >
                {isBn ? 'Rx প্রেসক্রিপশন আপলোড' : 'Upload Rx Prescription'}
              </button>
            )}
            {onResetChildPortal && (
              <button
                type="button"
                onClick={onResetChildPortal}
                className="px-3.5 py-2 rounded-xl bg-white/15 hover:bg-white/25 text-white font-bold text-xs backdrop-blur-sm transition-colors cursor-pointer"
              >
                {isBn ? 'সব মার্কেট ফিড' : 'All Mixed Feed'}
              </button>
            )}
          </div>
        </div>
      </section>

      <div className="px-1 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
        <div className="flex items-center gap-2">
          <h2 className="text-lg font-black tracking-tight text-[var(--pm-text)]">
            {isBn ? `${filteredItems.length}টি পণ্য পাওয়া গেছে` : `${filteredItems.length} Products Found`}
          </h2>
          <div className="flex items-center gap-1 px-2 py-0.5 rounded-full bg-[var(--pm-accent-soft)] text-[var(--pm-accent)] text-[10px] font-bold">
            <Zap className="w-3 h-3" />
            <span>{isBn ? 'লাইভ' : 'Live'}</span>
          </div>
        </div>

        <div className="flex items-center gap-2 w-full sm:w-auto">
          <div className="flex items-center gap-1.5 px-2.5 py-1.5 rounded-xl bg-[var(--pm-card)] border border-[var(--pm-border)] text-xs font-semibold text-[var(--pm-text)]">
            <SlidersHorizontal className="w-3.5 h-3.5 text-[var(--pm-muted)]" />
            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value as typeof sortBy)}
              aria-label="Sort products"
              className="bg-transparent focus:outline-none text-xs font-bold cursor-pointer"
            >
              <option value="recommended">{isBn ? 'সাজেস্টেড' : 'Recommended'}</option>
              <option value="price_low">{isBn ? 'কম দাম আগে' : 'Price: Low to High'}</option>
              <option value="price_high">{isBn ? 'বেশি দাম আগে' : 'Price: High to Low'}</option>
              <option value="rating">{isBn ? 'সেরা রেটিং' : 'Top Rated'}</option>
            </select>
          </div>

          <button
            type="button"
            onClick={() => onSelectTab?.('wholesale')}
            className="px-3.5 py-1.5 rounded-xl bg-[var(--pm-card)] border border-[var(--pm-border)] text-[var(--pm-text)] text-xs font-bold hover:border-[var(--pm-accent)] hover:text-[var(--pm-accent)] transition-all flex items-center justify-center gap-1.5 cursor-pointer"
          >
            <Package className="w-3.5 h-3.5 text-[var(--pm-accent)]" />
            <span>{isBn ? 'পাইকারি' : 'Wholesale'}</span>
          </button>
        </div>
      </div>

      {config.showVouchers !== false && (
        <VoucherDealsStrip
          isBn={isBn}
          appliedVoucherCode={appliedVoucherCode}
          onSelectVoucher={(code) => onSelectVoucher?.(code)}
          onOpenPrescriptionModal={() => setIsPrescriptionModalOpen(true)}
        />
      )}

      {visibleItems.length > 0 ? (
        <div className="grid grid-cols-1 xs:grid-cols-2 lg:grid-cols-3 gap-3 sm:gap-4">
          {visibleItems.map((item: any, idx: number) => {
            const isWholesale = item.tradeMode === 'wholesale';
            const currentQty = wholesaleQtyMap[item.id] || (isWholesale ? item.minWholesaleQty || 25 : 1);
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
                    key={`ad_card_${config.portalId}_${idx}`}
                    index={Math.floor((idx + 1) / 4) - 1}
                    isBn={isBn}
                  />
                )}
              </React.Fragment>
            );
          })}
        </div>
      ) : (
        <div className="rounded-2xl border border-[var(--pm-border)] bg-[var(--pm-card)] p-8 text-center space-y-3">
          <p className="text-sm font-bold text-[var(--pm-text)]">
            {isBn ? 'এই ক্যাটাগরিতে কোনো পণ্য পাওয়া যায়নি' : 'No matching products in this category'}
          </p>
          <p className="text-xs text-[var(--pm-muted)]">
            {isBn ? 'অন্য ফিল্টার বা সব মার্কেটপ্লেস ফিড দেখুন।' : 'Try another filter or return to the full mixed feed.'}
          </p>
          {onResetChildPortal && (
            <button
              type="button"
              onClick={onResetChildPortal}
              className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl bg-[var(--pm-accent)] text-white text-xs font-bold cursor-pointer"
            >
              <RotateCcw className="w-3.5 h-3.5" />
              <span>{isBn ? 'সব মার্কেট ফিড দেখুন' : 'View All Marketplace'}</span>
            </button>
          )}
        </div>
      )}

      {visibleCount < filteredItems.length && (
        <div ref={loadMoreRef} className="h-10 flex items-center justify-center text-xs font-semibold text-[var(--pm-muted)]">
          {isBn ? 'আরও পণ্য লোড হচ্ছে…' : 'Loading more products…'}
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
