import React from 'react';
import {
  MarketplaceCategoryPortal,
  MarketplacePortalBaseProps,
} from '@/portals/marketplaces/shared/MarketplaceCategoryPortal';

const BRAND_KEYWORDS = ['brand', 'official', 'flagship', 'warranty', 'samsung', 'apple', 'vision', 'walton', 'aarong', 'bata'];

export const BrandShopsPortal: React.FC<MarketplacePortalBaseProps> = (props) => (
  <MarketplaceCategoryPortal
    {...props}
    config={{
      portalId: 'brand-shops',
      badgeEn: 'Marketplace Hub · Brand Shops',
      badgeBn: 'মার্কেটপ্লেস হাব · ব্র্যান্ড শপ',
      titleEn: 'Official Brand Shops',
      titleBn: 'অফিসিয়াল ব্র্যান্ড শপ হোম',
      subtitleEn: 'Authentic flagship stores, manufacturer warranties, and verified brand catalogs.',
      subtitleBn: 'Official flagship shop, গ্যারান্টিযুক্ত পণ্য ও verified brand catalog।',
      accentGradient: 'from-amber-600 to-red-700',
      itemMatcher: (item) => {
        const text = `${item.badge || ''} ${item.storeName || ''} ${item.title} ${item.description || ''}`.toLowerCase();
        return BRAND_KEYWORDS.some((kw) => text.includes(kw));
      },
    }}
  />
);
