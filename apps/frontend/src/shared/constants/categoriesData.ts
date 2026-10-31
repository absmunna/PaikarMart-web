import { 
  ShoppingBag, Shirt, Smartphone, Wheat, Home, 
  Sparkles, Car, Code, Wrench, Truck, Activity, 
  Store, Package, Layers, Navigation, Users, Zap, MapPin
} from 'lucide-react';

export interface SubCategoryItem {
  id: string;
  name: string;
  nameBn: string;
  slug: string;
}

export interface MainCategoryItem {
  id: string;
  name: string;
  nameBn: string;
  icon: any;
  color?: string;
  bgGradient?: string;
  subcategories?: SubCategoryItem[];
}

export type PortalContextType = 
  | 'all' 
  | 'commerce-hub' 
  | 'services-logistics-hub' 
  | 'community-content-hub' 
  | 'utility-pro-hub';

export const PORTAL_CATEGORIES_MAP: Record<PortalContextType, MainCategoryItem[]> = {
  // 1. COMMERCE (B2C + B2B)
  'commerce-hub': [
    {
      id: 'all',
      name: 'All Commerce',
      nameBn: 'সব শপিং',
      icon: ShoppingBag,
      color: 'text-[var(--pm-accent)]',
      bgGradient: 'from-orange-500/25 via-pink-500/15 to-amber-500/25 border-orange-500/40'
    },
    {
      id: 'fashion',
      name: 'Fashion',
      nameBn: 'ফ্যাশন',
      icon: Shirt,
      color: 'text-indigo-400',
      bgGradient: 'from-indigo-500/25 via-purple-500/15 to-indigo-500/25 border-indigo-500/40',
      subcategories: [
        { id: 'f-all', name: 'All Fashion', nameBn: 'সকল ফ্যাশন', slug: 'all' },
        { id: 't-shirts', name: 'T-Shirts', nameBn: 'টি-শার্ট', slug: 't-shirts' },
        { id: 'panjabi', name: 'Panjabi', nameBn: 'পাঞ্জাবি', slug: 'panjabi' }
      ]
    },
    {
      id: 'wholesale',
      name: 'Wholesale',
      nameBn: 'পাইকারি',
      icon: Zap,
      color: 'text-amber-500',
      bgGradient: 'from-amber-500/25 via-orange-500/15 to-amber-500/25 border-amber-500/40',
      subcategories: [
        { id: 'w-all', name: 'All Wholesale', nameBn: 'সব পাইকারি', slug: 'all' },
        { id: 'lots', name: 'Product Lots', nameBn: 'পণ্য লট', slug: 'lots' },
        { id: 'factory', name: 'Factory Direct', nameBn: 'সরাসরি ফ্যাক্টরি', slug: 'factory' }
      ]
    },
    {
      id: 'electronics',
      name: 'Electronics',
      nameBn: 'ইলেকট্রনিক্স',
      icon: Smartphone,
      color: 'text-cyan-400',
      bgGradient: 'from-cyan-500/25 via-blue-500/15 to-cyan-500/25 border-cyan-500/40'
    }
  ],

  // 2. SERVICES & LOGISTICS
  'services-logistics-hub': [
    { 
      id: 'all', 
      name: 'All Services', 
      nameBn: 'সব সেবা', 
      icon: Wrench, 
      color: 'text-purple-400',
      bgGradient: 'from-purple-500/25 via-violet-500/15 to-purple-500/25 border-purple-500/40' 
    },
    { 
      id: 'ride', 
      name: 'Rides', 
      nameBn: 'রাইড', 
      icon: Navigation, 
      color: 'text-emerald-400',
      bgGradient: 'from-emerald-500/25 via-teal-500/15 to-emerald-500/25 border-emerald-500/40' 
    },
    { 
      id: 'logistics', 
      name: 'Logistics', 
      nameBn: 'লজিস্টিকস', 
      icon: Truck, 
      color: 'text-blue-400',
      bgGradient: 'from-blue-500/25 via-sky-500/15 to-blue-500/25 border-blue-500/40' 
    },
    { 
      id: 'nearby', 
      name: 'Nearby Shops', 
      nameBn: 'নিকটস্থ দোকান', 
      icon: MapPin, 
      color: 'text-rose-400',
      bgGradient: 'from-rose-500/25 via-red-500/15 to-rose-500/25 border-rose-500/40' 
    }
  ],

  // 3. COMMUNITY & CONTENT
  'community-content-hub': [
    { 
      id: 'all', 
      name: 'All Community', 
      nameBn: 'সব ফিড', 
      icon: Users, 
      color: 'text-pink-400',
      bgGradient: 'from-pink-500/25 via-rose-500/15 to-pink-500/25 border-pink-500/40' 
    },
    { 
      id: 'video', 
      name: 'Videos', 
      nameBn: 'ভিডিও', 
      icon: Zap, 
      color: 'text-red-400'
    },
    { 
      id: 'demand', 
      name: 'Demands', 
      nameBn: 'ডিমান্ড বোর্ড', 
      icon: Layers, 
      color: 'text-amber-400'
    }
  ],

  // 4. UTILITY & PRO
  'utility-pro-hub': [
    { 
      id: 'all', 
      name: 'All Tools', 
      nameBn: 'সব টুলস', 
      icon: Home, 
      color: 'text-slate-400'
    },
    { 
      id: 'finance', 
      name: 'Finance', 
      nameBn: 'অর্থনীতি', 
      icon: Zap, 
      color: 'text-amber-500'
    },
    { 
      id: 'workspace', 
      name: 'Workspace', 
      nameBn: 'ওয়ার্কস্পেস', 
      icon: Layers, 
      color: 'text-blue-500'
    }
  ],

  // 5. ROOT / GENERAL
  all: [
    { 
      id: 'all', 
      name: 'All', 
      nameBn: 'সব ফিড', 
      icon: ShoppingBag, 
      color: 'text-[var(--pm-accent)]',
      bgGradient: 'from-orange-500/25 via-pink-500/15 to-amber-500/25 border-orange-500/40' 
    },
    { 
      id: 'commerce', 
      name: 'Commerce', 
      nameBn: 'শপিং', 
      icon: Shirt, 
      color: 'text-indigo-400'
    },
    { 
      id: 'services', 
      name: 'Services', 
      nameBn: 'সার্ভিস', 
      icon: Wrench, 
      color: 'text-purple-400'
    },
    { 
      id: 'community', 
      name: 'Community', 
      nameBn: 'কমিউনিটি', 
      icon: Users, 
      color: 'text-pink-400'
    }
  ]
};
