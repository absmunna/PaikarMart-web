import React from 'react';
import {
  MarketplaceCategoryPortal,
  MarketplacePortalBaseProps,
} from '@/portals/marketplaces/shared/MarketplaceCategoryPortal';

const GROCERY_KEYWORDS = ['grocery', 'rice', 'grain', 'fresh', 'produce', 'oil', 'spice', 'bakery', 'food', 'chal', 'dal', 'fish', 'fruit', 'milk'];

export const GroceryPortal: React.FC<MarketplacePortalBaseProps> = (props) => (
  <MarketplaceCategoryPortal
    {...props}
    config={{
      portalId: 'grocery',
      badgeEn: 'Marketplace Hub · Grocery',
      badgeBn: 'মার্কেটপ্লেস হাব · গ্রোসারি',
      titleEn: 'Grocery Market Home',
      titleBn: 'গ্রোসারি মার্কেট হোম',
      subtitleEn: 'Find daily essentials, rice, fresh produce, cooking oil, and neighborhood bazar nearby.',
      subtitleBn: 'দৈনন্দিন বাজার, চাল-ডাল, তেল-মসলা ও fresh grocery দ্রুত খুঁজুন।',
      accentGradient: 'from-emerald-600 to-green-700',
      itemMatcher: (item) => {
        const text = `${item.category || ''} ${item.title} ${item.description || ''} ${item.badge || ''}`.toLowerCase();
        return item.type === 'grocery' || GROCERY_KEYWORDS.some((kw) => text.includes(kw));
      },
    }}
  />
);
