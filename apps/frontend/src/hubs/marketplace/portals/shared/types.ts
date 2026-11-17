import type React from 'react';
import type { CommerceItem, PortalTab } from '@/types';

export interface MarketplacePortalHomeProps {
  items: CommerceItem[];
  totalCount: number;
  hasMore: boolean;
  loadMoreRef: React.RefObject<HTMLDivElement | null>;
  isBn: boolean;
  appliedVoucherCode?: string;
  sortBy: 'recommended' | 'price_low' | 'price_high' | 'rating' | 'moq';
  addedNoticeMap: Record<string, boolean>;
  wholesaleQtyMap: Record<string, number>;
  onSortChange: (value: MarketplacePortalHomeProps['sortBy']) => void;
  onQuantityChange: (itemId: string, quantity: number, minimumQuantity: number) => void;
  onAddToCart: (item: CommerceItem, isWholesale: boolean) => void;
  onBuyNow: (item: CommerceItem, isWholesale: boolean) => void;
  onSelectTab?: (tab: PortalTab) => void;
  onSelectVoucher?: (code: string) => void;
  onOpenPrescription: () => void;
}
