import React from 'react';
import { SlidersHorizontal, Sparkles, Zap } from 'lucide-react';
import type { CommerceItem } from '@/types';
import { CommerceProductCard, VoucherDealsStrip } from '@/features/marketplace';
import { PromotionalAdCard } from '@/components/shared/PromotionalAdCard';
import { marketplacePortals } from '@/hubs/marketplace/config/marketplacePortals';
import type { MarketplacePortalHomeProps } from './types';

interface MarketplaceCatalogHomeProps extends MarketplacePortalHomeProps {
  portalId: 'retail' | 'grocery' | 'pharmacy' | 'brand-shops' | 'digital' | 'demand' | 'used';
}

const PORTAL_COPY: Record<MarketplaceCatalogHomeProps['portalId'], { en: string; bn: string }> = {
  retail: {
    en: 'Find everyday products from retail stores and verified sellers.',
    bn: 'রিটেইল দোকান ও যাচাইকৃত বিক্রেতার দৈনন্দিন পণ্য দেখুন।',
  },
  grocery: {
    en: 'Browse fresh produce, pantry staples and local grocery offers.',
    bn: 'তাজা বাজার, নিত্যপণ্য ও স্থানীয় গ্রোসারি অফার দেখুন।',
  },
  pharmacy: {
    en: 'Find health and care products from pharmacy listings.',
    bn: 'ফার্মেসির স্বাস্থ্য ও পরিচর্যা পণ্য খুঁজুন।',
  },
  'brand-shops': {
    en: 'Explore brand-store listings from the shared catalog.',
    bn: 'একই ক্যাটালগ থেকে ব্র্যান্ড শপের পণ্য দেখুন।',
  },
  digital: {
    en: 'Discover digital products and device-related listings.',
    bn: 'ডিজিটাল পণ্য ও প্রযুক্তি-সম্পর্কিত listing দেখুন।',
  },
  demand: {
    en: 'Review buyer requests and send an offer that fits the requirement.',
    bn: 'ক্রেতার চাহিদা দেখে উপযুক্ত প্রস্তাব পাঠান।',
  },
  used: {
    en: 'Browse pre-owned listings and resale offers.',
    bn: 'ব্যবহৃত পণ্য ও পুনর্বিক্রয়ের offer দেখুন।',
  },
};

const formatPrice = (item: CommerceItem, quantity: number) => item.price * quantity;

export const MarketplaceCatalogHome: React.FC<MarketplaceCatalogHomeProps> = ({
  portalId,
  items,
  totalCount,
  hasMore,
  loadMoreRef,
  isBn,
  appliedVoucherCode,
  sortBy,
  addedNoticeMap,
  wholesaleQtyMap,
  onSortChange,
  onQuantityChange,
  onAddToCart,
  onBuyNow,
  onSelectTab,
  onSelectVoucher,
  onOpenPrescription,
}) => {
  const portal = marketplacePortals.find((entry) => entry.id === portalId);

  return (
    <div className="space-y-4 pb-4 sm:space-y-5">
      <section className="flex flex-col gap-4 rounded-2xl border border-[var(--pm-border)] bg-[var(--pm-card)] p-4 text-[var(--pm-text)] shadow-xs sm:flex-row sm:items-center sm:justify-between sm:rounded-3xl sm:p-6">
        <div className="min-w-0">
          <p className="flex items-center gap-1.5 text-xs font-bold text-[var(--pm-accent)]">
            <Sparkles className="h-3.5 w-3.5" aria-hidden="true" />
            {isBn ? 'Marketplace Hub' : 'Marketplace Hub'}
          </p>
          <h1 className="mt-1 text-xl font-black tracking-tight sm:text-2xl">
            {isBn ? portal?.labelBn : portal?.labelEn}
          </h1>
          <p className="mt-1.5 max-w-2xl text-xs leading-5 text-[var(--pm-muted)] sm:text-sm">
            {isBn ? PORTAL_COPY[portalId].bn : PORTAL_COPY[portalId].en}
          </p>
        </div>

        <div className="flex shrink-0 items-center gap-3">
          <div className="rounded-xl border border-[var(--pm-border)] bg-[var(--pm-surface)] px-3 py-2">
            <p className="text-[10px] text-[var(--pm-muted)]">{isBn ? 'লিস্টিং' : 'Listings'}</p>
            <p className="text-lg font-black tabular-nums text-[var(--pm-text)]">{totalCount}</p>
          </div>
        </div>
      </section>

      <VoucherDealsStrip
        isBn={isBn}
        appliedVoucherCode={appliedVoucherCode}
        onSelectVoucher={(code) => onSelectVoucher?.(code)}
        onOpenPrescriptionModal={onOpenPrescription}
        showPrescriptionShortcut={portalId === 'pharmacy' || portalId === 'grocery'}
      />

      <div className="flex items-center justify-between gap-3 px-1">
        <div className="flex items-center gap-1.5 text-xs font-semibold text-[var(--pm-muted)]">
          <Zap className="h-3.5 w-3.5 text-[var(--pm-accent)]" aria-hidden="true" />
          {isBn ? `${items.length} টি দেখানো হচ্ছে` : `Showing ${items.length} of ${totalCount}`}
        </div>
        <div className="relative shrink-0">
          <select
            value={sortBy}
            onChange={(event) => onSortChange(event.target.value as MarketplacePortalHomeProps['sortBy'])}
            aria-label={isBn ? 'পণ্য সাজান' : 'Sort listings'}
            className="min-h-10 appearance-none rounded-xl border border-[var(--pm-border)] bg-[var(--pm-card)] py-2 pl-3 pr-8 text-xs font-semibold text-[var(--pm-text)] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--pm-accent)]"
          >
            <option value="recommended">{isBn ? 'সেরা ম্যাচ' : 'Recommended'}</option>
            <option value="price_low">{isBn ? 'দাম: কম' : 'Price: Low'}</option>
            <option value="price_high">{isBn ? 'দাম: বেশি' : 'Price: High'}</option>
            <option value="rating">{isBn ? 'রেটিং' : 'Rating'}</option>
          </select>
          <SlidersHorizontal className="pointer-events-none absolute right-2.5 top-1/2 h-3.5 w-3.5 -translate-y-1/2 text-[var(--pm-muted)]" aria-hidden="true" />
        </div>
      </div>

      {items.length > 0 ? (
        <div className="grid grid-cols-1 gap-3 xs:grid-cols-2 lg:grid-cols-3 sm:gap-4">
          {items.map((item, index) => {
            const isWholesale = item.tradeMode === 'wholesale';
            const currentQty = wholesaleQtyMap[item.id] || (isWholesale ? (item.minWholesaleQty || 25) : 1);
            const unitPrice = item.price;
            return (
              <React.Fragment key={item.id}>
                <CommerceProductCard
                  item={item}
                  isBn={isBn}
                  currentQty={currentQty}
                  unitPrice={unitPrice}
                  totalPrice={formatPrice(item, currentQty)}
                  isAddedNotice={Boolean(addedNoticeMap[item.id])}
                  onQtyChange={onQuantityChange}
                  onAddToCart={onAddToCart}
                  onBuyNow={onBuyNow}
                  onSelectTab={onSelectTab}
                />
                {(index + 1) % 4 === 0 && (
                  <PromotionalAdCard
                    key={`marketplace-ad-${portalId}-${index}`}
                    index={Math.floor((index + 1) / 4) - 1}
                    isBn={isBn}
                  />
                )}
              </React.Fragment>
            );
          })}
        </div>
      ) : (
        <div className="rounded-2xl border border-dashed border-[var(--pm-border)] bg-[var(--pm-card)] px-5 py-12 text-center">
          <p className="font-bold text-[var(--pm-text)]">{isBn ? 'এখনো কোনো listing নেই' : 'No listings yet'}</p>
          <p className="mt-1 text-xs text-[var(--pm-muted)]">
            {isBn ? 'অন্য ক্যাটাগরি বেছে দেখুন।' : 'Try another category or check back later.'}
          </p>
        </div>
      )}

      {hasMore && (
        <div ref={loadMoreRef} className="flex h-10 items-center justify-center text-xs font-semibold text-[var(--pm-muted)]" aria-live="polite">
          {isBn ? 'আরও পণ্য লোড হচ্ছে…' : 'Loading more listings…'}
        </div>
      )}
    </div>
  );
};
