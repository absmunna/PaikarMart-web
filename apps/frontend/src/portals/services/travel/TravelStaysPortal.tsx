import React from 'react';
import {
  ServiceCategoryPortal,
  ServicePortalBaseProps,
} from '@/portals/services/shared/ServiceCategoryPortal';

const TRAVEL_KEYWORDS = ['travel', 'hotel', 'stay', 'resort', 'tour', 'venue', 'ticket', 'trip', 'room', 'cox', 'sylhet'];

export const TravelStaysPortal: React.FC<ServicePortalBaseProps> = (props) => (
  <ServiceCategoryPortal
    {...props}
    config={{
      portalId: 'travel',
      badgeEn: 'Services Hub · Travel & Stays',
      badgeBn: 'সার্ভিস হাব · ট্রাভেল ও স্টে',
      titleEn: 'Hotels, Resorts, Tours & Event Venues',
      titleBn: 'হোটেল, রিসোর্ট, ট্যুর ও ভেন্যু বুকিং',
      subtitleEn: 'Reserve verified stays, guided local tours, and event venues with escrow-protected booking.',
      subtitleBn: 'হোটেল, ট্যুর প্যাকেজ এবং ইভেন্ট ভেন্যু বুক করুন নিরাপদ এসক্রো পেমেন্টে।',
      accentGradient: 'from-indigo-600 to-purple-700',
      searchPlaceholderEn: 'Search hotels, resorts, tours, venues...',
      searchPlaceholderBn: 'হোটেল, রিসোর্ট, ট্যুর, ভেন্যু খুঁজুন...',
      itemMatcher: (item) => {
        const text = `${item.title} ${item.category || ''} ${item.subCategory || ''} ${item.description || ''} ${item.badge || ''}`.toLowerCase();
        return TRAVEL_KEYWORDS.some((kw) => text.includes(kw));
      },
    }}
  />
);
