import React from 'react';
import {
  ServiceCategoryPortal,
  ServicePortalBaseProps,
} from '@/portals/services/shared/ServiceCategoryPortal';

const APPLIANCE_KEYWORDS = ['appliance', 'refrigerator', 'fridge', 'washing', 'machine', 'microwave', 'tv', 'television', 'laptop', 'computer', 'gadget', 'repair'];

export const ApplianceRepairPortal: React.FC<ServicePortalBaseProps> = (props) => (
  <ServiceCategoryPortal
    {...props}
    config={{
      portalId: 'appliance-repair',
      badgeEn: 'Services Hub · Appliance & Tech Repair',
      badgeBn: 'সার্ভিস হাব · অ্যাপ্লায়েন্স ও টেক রিপেয়ার',
      titleEn: 'Refrigerator, Washing Machine & Tech Repair',
      titleBn: 'ফ্রিজ, ওয়াশিং মেশিন ও ল্যাপটপ রিপেয়ার সার্ভিস',
      subtitleEn: 'Expert technicians for home appliances, refrigerators, ACs, TVs, and laptop motherboard repair.',
      subtitleBn: 'হোম অ্যাপ্লায়েন্স, ফ্রিজ, এসি, টিভি ও ল্যাপটপ মেরামতের জন্য অভিজ্ঞ টেকনিশিয়ান বুক করুন।',
      accentGradient: 'from-violet-600 to-indigo-800',
      searchPlaceholderEn: 'Search fridge repair, washing machine, laptop, TV...',
      searchPlaceholderBn: 'ফ্রিজ রিপেয়ার, ওয়াশিং মেশিন, ল্যাপটপ, টিভি খুঁজুন...',
      itemMatcher: (item) => {
        const text = `${item.title} ${item.category || ''} ${item.subCategory || ''} ${item.description || ''} ${item.badge || ''}`.toLowerCase();
        return APPLIANCE_KEYWORDS.some((kw) => text.includes(kw));
      },
    }}
  />
);
