import React from 'react';
import {
  ServiceCategoryPortal,
  ServicePortalBaseProps,
} from '@/portals/services/shared/ServiceCategoryPortal';

const FOOD_KEYWORDS = ['food', 'restaurant', 'homemade', 'bakery', 'cake', 'biryani', 'kitchen', 'meal', 'catering', 'snack'];

export const FoodDeliveryPortal: React.FC<ServicePortalBaseProps> = (props) => (
  <ServiceCategoryPortal
    {...props}
    config={{
      portalId: 'food-delivery',
      badgeEn: 'Services Hub · Food Delivery',
      badgeBn: 'সার্ভিস হাব · ফুড ডেলিভারি',
      titleEn: 'Restaurants, Homemade Kitchens & Bakery',
      titleBn: 'রেস্টুরেন্ট, হোমমেড কিচেন ও বেকারি',
      subtitleEn: 'Order hot meals, neighborhood homemade tiffin, and fresh bakery items with fast rider delivery.',
      subtitleBn: 'আশেপাশের রেস্টুরেন্ট, হোমমেড খাবার এবং ফ্রেশ বেকারি অর্ডার করুন।',
      accentGradient: 'from-orange-600 to-rose-700',
      searchPlaceholderEn: 'Search restaurants, homemade meals, bakery...',
      searchPlaceholderBn: 'রেস্টুরেন্ট, হোমমেড খাবার, বেকারি খুঁজুন...',
      itemMatcher: (item) => {
        const text = `${item.title} ${item.category || ''} ${item.subCategory || ''} ${item.description || ''} ${item.badge || ''}`.toLowerCase();
        return FOOD_KEYWORDS.some((kw) => text.includes(kw));
      },
    }}
  />
);
