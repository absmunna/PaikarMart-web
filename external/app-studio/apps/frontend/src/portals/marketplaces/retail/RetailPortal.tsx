import React from 'react';
import {
  MarketplaceCategoryPortal,
  MarketplacePortalBaseProps,
} from '@/portals/marketplaces/shared/MarketplaceCategoryPortal';

export const RetailPortal: React.FC<MarketplacePortalBaseProps> = (props) => (
  <MarketplaceCategoryPortal
    {...props}
    config={{
      portalId: 'retail',
      badgeEn: 'Marketplace Hub · Retail',
      badgeBn: 'মার্কেটপ্লেস হাব · রিটেইল',
      titleEn: 'Retail Marketplace Home',
      titleBn: 'রিটেইল মার্কেট হোম',
      subtitleEn: 'Retail products, verified sellers, flash deals, and everyday shopping in one feed.',
      subtitleBn: 'সব খুচরা পণ্য, verified seller এবং প্রতিদিনের শপিং এক ফিডে।',
      accentGradient: 'from-sky-600 to-indigo-700',
      itemMatcher: (item) => item.tradeMode === 'retail' && item.type !== 'service',
    }}
  />
);
