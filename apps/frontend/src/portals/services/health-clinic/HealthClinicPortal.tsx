import React from 'react';
import {
  ServiceCategoryPortal,
  ServicePortalBaseProps,
} from '@/portals/services/shared/ServiceCategoryPortal';

const HEALTH_KEYWORDS = ['clinic', 'doctor', 'health', 'medical', 'test', 'diagnostic', 'nurse', 'telehealth', 'prescription', 'pharma'];

export const HealthClinicPortal: React.FC<ServicePortalBaseProps> = (props) => (
  <ServiceCategoryPortal
    {...props}
    config={{
      portalId: 'health-clinic',
      badgeEn: 'Services Hub · Health & Clinic Care',
      badgeBn: 'সার্ভিস হাব · হেলথ ও ক্লিনিক কেয়ার',
      titleEn: 'Telehealth, Doctor Visits & Diagnostic Tests',
      titleBn: 'ডাক্তার অ্যাপয়েন্টমেন্ট, টেলিহেলথ ও ডায়াগনস্টিক টেস্ট',
      subtitleEn: 'Book verified doctors for home visits, video consultations, and certified diagnostic lab tests.',
      subtitleBn: 'হোম ভিজিট ডাক্তার, ভিডিও কনসালটেশন এবং ডায়াগনস্টিক টেস্ট বুক করুন ঘরে বসেই।',
      accentGradient: 'from-cyan-600 to-blue-800',
      searchPlaceholderEn: 'Search doctor, clinic, diagnostic test, nursing...',
      searchPlaceholderBn: 'ডাক্তার, ক্লিনিক, ডায়াগনস্টিক টেস্ট, নার্স খুঁজুন...',
      itemMatcher: (item) => {
        const text = `${item.title} ${item.category || ''} ${item.subCategory || ''} ${item.description || ''} ${item.badge || ''}`.toLowerCase();
        return HEALTH_KEYWORDS.some((kw) => text.includes(kw));
      },
    }}
  />
);
