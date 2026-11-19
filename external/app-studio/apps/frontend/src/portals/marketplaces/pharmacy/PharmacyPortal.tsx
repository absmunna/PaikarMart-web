import React from 'react';
import {
  MarketplaceCategoryPortal,
  MarketplacePortalBaseProps,
} from '@/portals/marketplaces/shared/MarketplaceCategoryPortal';

const PHARMACY_KEYWORDS = ['pharmacy', 'health', 'medicine', 'rx', 'first aid', 'care', 'vitamin', 'surgical', 'medical'];

export const PharmacyPortal: React.FC<MarketplacePortalBaseProps> = (props) => (
  <MarketplaceCategoryPortal
    {...props}
    config={{
      portalId: 'pharmacy',
      badgeEn: 'Marketplace Hub · Pharmacy & Rx',
      badgeBn: 'মার্কেটপ্লেস হাব · ফার্মেসি ও Rx',
      titleEn: 'Pharmacy & Rx Home',
      titleBn: 'ফার্মেসি ও Rx হোম',
      subtitleEn: 'Licensed pharmacies, prescription upload delivery, OTC medicines, and healthcare essentials.',
      subtitleBn: 'লাইসেন্সপ্রাপ্ত pharmacy, Rx প্রেসক্রিপশন আপলোড ও healthcare products।',
      accentGradient: 'from-teal-600 to-cyan-700',
      showRxUploadCta: true,
      itemMatcher: (item) => {
        const text = `${item.category || ''} ${item.title} ${item.description || ''} ${item.badge || ''}`.toLowerCase();
        return PHARMACY_KEYWORDS.some((kw) => text.includes(kw));
      },
    }}
  />
);
