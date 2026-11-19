import React, { useEffect, useMemo, useState } from 'react';
import { CommerceItem, Order, PortalTab, User } from '@/types';
import { type PortalFilterType } from '@/features/marketplace';
import { findRegisteredPortal } from '@/hubs/shared/portalRegistry';
import {
  MarketplaceCategoryPortal,
  type MarketplacePortalBaseProps,
} from '@/portals/marketplaces/shared/MarketplaceCategoryPortal';
import { RetailPortal } from '@/portals/marketplaces/retail';
import { WholesalePortal } from '@/portals/marketplaces/wholesale';
import { GroceryPortal } from '@/portals/marketplaces/grocery';
import { PharmacyPortal } from '@/portals/marketplaces/pharmacy';
import { BrandShopsPortal } from '@/portals/marketplaces/brand-shops';
import { DigitalGoodsPortal } from '@/portals/marketplaces/digital';

export type { PortalFilterType };

const MARKETPLACE_CHILD_VIEWS: Record<string, React.ComponentType<MarketplacePortalBaseProps>> = {
  retail: RetailPortal,
  grocery: GroceryPortal,
  pharmacy: PharmacyPortal,
  'brand-shops': BrandShopsPortal,
  digital: DigitalGoodsPortal,
};

interface MarketplacePortalProps {
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
  externalChildPortalId?: string;
}

export const MarketplaceMixedFeed: React.FC<MarketplacePortalProps> = ({
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
  externalChildPortalId = 'all',
}) => {
  const [activeChildPortalId, setActiveChildPortalId] = useState(externalChildPortalId || 'all');

  useEffect(() => {
    setActiveChildPortalId(externalChildPortalId || 'all');
  }, [externalChildPortalId]);

  const fullDiscoveryItems = useMemo(() => {
    const base = [...items];
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
      imageUrl: '/src/assets/images/paikarmart_electronics_wholesale_1794489877741.jpg',
      category: 'Electronics',
      badge: 'Demand / RFQ',
      inStock: true,
      proximityDistance: '1.2 km',
      isDemandRequest: true,
    };

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
      imageUrl: '/src/assets/images/paikarmart_iphone_15_pro_max_1794490099283.jpg',
      category: 'Electronics',
      badge: 'Used / Pre-Owned',
      inStock: true,
      proximityDistance: '0.6 km',
      isUsedItem: true,
    };

    return [demandMock, usedMock, ...base];
  }, [items]);

  const sharedPortalProps: MarketplacePortalBaseProps = {
    items: fullDiscoveryItems,
    onAddToCart,
    onBuyNow,
    onSelectTab,
    currentUser,
    appliedVoucherCode,
    onSelectVoucher,
    onOrderPlaced,
    externalSearchQuery,
    externalActivePortal,
    externalSubCategory,
    onResetChildPortal: () => setActiveChildPortalId('all'),
  };

  const normalizedPortalId = activeChildPortalId.replace(/^c-/, '').replace(/-home$/, '');
  const registeredPortal = normalizedPortalId !== 'all' ? findRegisteredPortal(normalizedPortalId) : undefined;

  if (registeredPortal?.id === 'wholesale') {
    return (
      <WholesalePortal
        items={items}
        onAddToCart={onAddToCart}
        onSelectTab={onSelectTab}
        externalSearchQuery={externalSearchQuery}
        externalSubCategory={externalSubCategory}
      />
    );
  }

  const ChildPortalComponent = registeredPortal ? MARKETPLACE_CHILD_VIEWS[registeredPortal.id] : undefined;
  if (ChildPortalComponent) {
    return <ChildPortalComponent {...sharedPortalProps} />;
  }

  return (
    <MarketplaceCategoryPortal
      {...sharedPortalProps}
      onResetChildPortal={undefined}
      config={{
        portalId: 'mixed-feed',
        badgeEn: 'Marketplace Hub · Mixed Discovery',
        badgeBn: 'মার্কেটপ্লেস হাব · মিক্সড ফিড',
        titleEn: 'Discover Retail, Wholesale, Grocery & Brands',
        titleBn: 'রিটেইল, হোলসেল, গ্রোসারি ও ব্র্যান্ড — সব এক ফিডে',
        subtitleEn: 'Browse all marketplace portals together or pick a category tile above to enter its dedicated portal.',
        subtitleBn: 'সব মার্কেটপ্লেস পণ্য একসাথে দেখুন অথবা উপরের টাইলস থেকে নির্দিষ্ট পোর্টালে প্রবেশ করুন।',
        accentGradient: 'from-indigo-600 via-sky-600 to-teal-600',
      }}
    />
  );
};
