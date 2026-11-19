import React from 'react';
import {
  ServiceCategoryPortal,
  ServicePortalBaseProps,
} from '@/portals/services/shared/ServiceCategoryPortal';

const LOCAL_SERVICE_KEYWORDS = ['repair', 'ac', 'electric', 'plumb', 'salon', 'beauty', 'hair', 'clinic', 'care', 'tech', 'cleaning'];

export const LocalServicesPortal: React.FC<ServicePortalBaseProps> = (props) => (
  <ServiceCategoryPortal
    {...props}
    config={{
      portalId: 'local-services',
      badgeEn: 'Services Hub · Local Services',
      badgeBn: 'সার্ভিস হাব · লোকাল সার্ভিস',
      titleEn: 'Local Technicians, Repair & Grooming',
      titleBn: 'লোকাল টেকনিশিয়ান, রিপেয়ার ও গ্রুমিং',
      subtitleEn: 'Book verified electricians, AC repair, plumbers, salon specialists, and home care within your radius.',
      subtitleBn: 'কাছাকাছি verified ইলেকট্রিশিয়ান, এসি রিপেয়ার, সেলুন ও হোম সার্ভিস বুক করুন।',
      accentGradient: 'from-emerald-600 to-teal-700',
      searchPlaceholderEn: 'Search AC repair, electrician, salon, clinic...',
      searchPlaceholderBn: 'এসি রিপেয়ার, ইলেকট্রিশিয়ান, সেলুন খুঁজুন...',
      itemMatcher: (item) => {
        if (item.type !== 'service') return false;
        const text = `${item.title} ${item.category || ''} ${item.subCategory || ''} ${item.description || ''}`.toLowerCase();
        return LOCAL_SERVICE_KEYWORDS.some((kw) => text.includes(kw)) || (!text.includes('food') && !text.includes('hotel') && !text.includes('tour'));
      },
    }}
  />
);
