import {
  ShoppingBag, Building2, Store, Wrench, Monitor,
  MapPin, Star, Tag, Newspaper, Radio,
  Package, Wallet, User, Bell, Car, PlayCircle,
  Pill, Egg, Utensils, Hotel, Briefcase, Landmark,
  Home, HeartPulse, GraduationCap, Calendar, Wifi, HelpCircle,
  ShieldCheck, Boxes, Plane, Tv, Bus, Compass, Tractor, ClipboardList, Video, Truck
} from 'lucide-react';

export interface PortalHub {
  id: string;
  nameEn: string;
  nameBn: string;
  descriptionEn: string;
  descriptionBn: string;
  color: string;
  iconName: string;
}

export interface PortalItem {
  id: string;
  hubId: string;
  nameEn: string;
  nameBn: string;
  realWorldModel: string;
  route: string;
  color: string;
  status: 'active' | 'upcoming' | 'merged';
  iconName: string;
}

export const HUB_REGISTRY: PortalHub[] = [
  {
    id: 'marketplace-hub',
    nameEn: 'Marketplace',
    nameBn: 'মার্কেটপ্লেস',
    descriptionEn: 'National product commerce, retail, wholesale & brands',
    descriptionBn: 'দেশব্যাপী প্রোডাক্ট কমার্স, রিটেইল এবং ব্র্যান্ডস',
    color: 'from-blue-600 to-indigo-800',
    iconName: 'ShoppingBag'
  },
  {
    id: 'services-hub',
    nameEn: 'Services',
    nameBn: 'সার্ভিসেস',
    descriptionEn: 'Professional, digital and home services',
    descriptionBn: 'প্রফেশনাল, ডিজিটাল এবং হোম সার্ভিসেস',
    color: 'from-amber-500 to-orange-700',
    iconName: 'Wrench'
  },
  {
    id: 'logistics-hub',
    nameEn: 'Logistics',
    nameBn: 'লজিস্টিকস',
    descriptionEn: 'Ride, delivery, courier & transport',
    descriptionBn: 'রাইড, ডেলিভারি, কুরিয়ার এবং ট্রান্সপোর্ট',
    color: 'from-sky-500 to-blue-700',
    iconName: 'Truck'
  },
  {
    id: 'local-hub',
    nameEn: 'Nearby',
    nameBn: 'নিয়ারবাই',
    descriptionEn: 'Hyperlocal shops, instant delivery & deals',
    descriptionBn: 'এলাকাভিত্তিক শপ, ইনস্ট্যান্ট ডেলিভারি ও ডিলস',
    color: 'from-cyan-500 to-teal-700',
    iconName: 'MapPin'
  },
  {
    id: 'business-hub',
    nameEn: 'Business',
    nameBn: 'বিজনেস',
    descriptionEn: 'B2B growth, corporate and manufacturers',
    descriptionBn: 'বিটুবি গ্রোথ, কর্পোরেট এবং ম্যানুফ্যাকচারার',
    color: 'from-slate-700 to-zinc-900',
    iconName: 'Building2'
  },
  {
    id: 'community-hub',
    nameEn: 'Community',
    nameBn: 'কমিউনিটি',
    descriptionEn: 'Social feed, demands, news & video',
    descriptionBn: 'সোশ্যাল ফিড, ডিমান্ড, নিউজ এবং ভিডিও',
    color: 'from-purple-600 to-pink-800',
    iconName: 'PlayCircle'
  }
];

export const PORTAL_REGISTRY: PortalItem[] = [
  // --- WHOLESALE HUB ---
  {
    id: 'b2b',
    hubId: 'business-hub',
    nameEn: 'B2B Trade',
    nameBn: 'পাইকার ট্রেড',
    realWorldModel: 'Alibaba',
    route: '/b2b',
    color: 'from-blue-500 to-indigo-700',
    status: 'active',
    iconName: 'Building2'
  },
  {
    id: 'factory',
    hubId: 'business-hub',
    nameEn: 'Factory Direct',
    nameBn: 'ফ্যাক্টরি ডাইরেক্ট',
    realWorldModel: 'Factory Sourcing',
    route: '/b2b/factory',
    color: 'from-slate-600 to-slate-800',
    status: 'active',
    iconName: 'Landmark'
  },
  {
    id: 'dropship',
    hubId: 'business-hub',
    nameEn: 'Dropship',
    nameBn: 'ড্রপশিপিং',
    realWorldModel: 'Oberlo',
    route: '/dropship',
    color: 'from-cyan-500 to-blue-600',
    status: 'active',
    iconName: 'Package'
  },
  {
    id: 'wholesale-main',
    hubId: 'business-hub',
    nameEn: 'Wholesale Market',
    nameBn: 'হোলসেল মার্কেট',
    realWorldModel: 'Indiamart',
    route: '/wholesale',
    color: 'from-blue-600 to-cyan-800',
    status: 'active',
    iconName: 'Boxes'
  },
  {
    id: 'export',
    hubId: 'business-hub',
    nameEn: 'Export Hub',
    nameBn: 'রপ্তানি হাব',
    realWorldModel: 'TradeKey',
    route: '/export',
    color: 'from-sky-500 to-indigo-600',
    status: 'active',
    iconName: 'Plane'
  },

  // --- RETAIL HUB ---
  {
    id: 'marketplace',
    hubId: 'marketplace-hub',
    nameEn: 'Marketplace',
    nameBn: 'মার্কেটপ্লেস',
    realWorldModel: 'Daraz',
    route: '/marketplace',
    color: 'from-orange-400 to-pink-500',
    status: 'active',
    iconName: 'ShoppingBag'
  },
  {
    id: 'retail-main',
    hubId: 'marketplace-hub',
    nameEn: 'Retail Store',
    nameBn: 'রিটেইল স্টোর',
    realWorldModel: 'Standard B2C',
    route: '/retail',
    color: 'from-teal-400 to-cyan-600',
    status: 'active',
    iconName: 'Store'
  },
  {
    id: 'fashion',
    hubId: 'marketplace-hub',
    nameEn: 'Fashion',
    nameBn: 'ফ্যাশন',
    realWorldModel: 'Myntra',
    route: '/fashion',
    color: 'from-pink-400 to-rose-600',
    status: 'active',
    iconName: 'Tag'
  },
  {
    id: 'brand-shops',
    hubId: 'marketplace-hub',
    nameEn: 'Brand Shops',
    nameBn: 'ব্র্যান্ড শপ',
    realWorldModel: 'Tmall',
    route: '/brand-shops',
    color: 'from-amber-500 to-red-600',
    status: 'active',
    iconName: 'Award'
  },
  {
    id: 'pk-shop',
    hubId: 'marketplace-hub',
    nameEn: 'PK Store',
    nameBn: 'পিকে স্টোর',
    realWorldModel: 'Verified Store',
    route: '/pk-shop',
    color: 'from-cyan-500 to-teal-600',
    status: 'active',
    iconName: 'ShieldCheck'
  },

  // --- HYPERLOCAL HUB ---
  {
    id: 'food',
    hubId: 'local-hub',
    nameEn: 'Food Delivery',
    nameBn: 'ফুড ডেলিভারি',
    realWorldModel: 'FoodPanda',
    route: '/food',
    color: 'from-rose-500 to-red-600',
    status: 'active',
    iconName: 'Utensils'
  },
  {
    id: 'grocery',
    hubId: 'local-hub',
    nameEn: 'Grocery',
    nameBn: 'গ্রোসারি',
    realWorldModel: 'Chaldal',
    route: '/grocery',
    color: 'from-green-400 to-cyan-600',
    status: 'active',
    iconName: 'Egg'
  },
  {
    id: 'pharmacy',
    hubId: 'local-hub',
    nameEn: 'Pharmacy',
    nameBn: 'ফার্মেসি',
    realWorldModel: 'Pillstock',
    route: '/pharmacy',
    color: 'from-teal-400 to-cyan-600',
    status: 'active',
    iconName: 'Pill'
  },
  {
    id: 'nearby',
    hubId: 'local-hub',
    nameEn: 'Nearby Shops',
    nameBn: 'লোকাল শপ',
    realWorldModel: 'Google Local',
    route: '/local',
    color: 'from-rose-400 to-purple-600',
    status: 'active',
    iconName: 'MapPin'
  },
  {
    id: 'ride',
    hubId: 'logistics-hub',
    nameEn: 'Ride Share',
    nameBn: 'রাইড শেয়ার',
    realWorldModel: 'Pathao',
    route: '/ride',
    color: 'from-yellow-400 to-amber-600',
    status: 'active',
    iconName: 'Car'
  },

  // --- SERVICE HUB ---
  {
    id: 'services',
    hubId: 'services-hub',
    nameEn: 'Expert Services',
    nameBn: 'সার্ভিসেস',
    realWorldModel: 'Sheba.xyz',
    route: '/services',
    color: 'from-amber-400 to-orange-600',
    status: 'active',
    iconName: 'Wrench'
  },
  {
    id: 'digital-products',
    hubId: 'services-hub',
    nameEn: 'Digital Goods',
    nameBn: 'ডিজিটাল প্রোডাক্ট',
    realWorldModel: 'Envato',
    route: '/digital-products',
    color: 'from-indigo-400 to-purple-600',
    status: 'active',
    iconName: 'Monitor'
  },
  {
    id: 'jobs',
    hubId: 'services-hub',
    nameEn: 'Jobs & Gigs',
    nameBn: 'চাকরি ও গিগ',
    realWorldModel: 'Bdjobs',
    route: '/jobs',
    color: 'from-cyan-500 to-blue-700',
    status: 'active',
    iconName: 'Briefcase'
  },
  {
    id: 'logistics',
    hubId: 'logistics-hub',
    nameEn: 'Delivery & Logistics',
    nameBn: 'ডেলিভারি ও লজিস্টিকস',
    realWorldModel: 'Pathao Courier',
    route: '/logistics',
    color: 'from-orange-500 to-red-600',
    status: 'active',
    iconName: 'Truck'
  },
  {
    id: 'demand',
    hubId: 'community-hub',
    nameEn: 'Demand Board',
    nameBn: 'ডিমান্ড বোর্ড',
    realWorldModel: 'TaskRabbit',
    route: '/demand',
    color: 'from-amber-400 to-orange-600',
    status: 'active',
    iconName: 'ClipboardList'
  },
  {
    id: 'offer',
    hubId: 'community-hub',
    nameEn: 'Offers',
    nameBn: 'অফার',
    realWorldModel: 'Discount Board',
    route: '/offer',
    color: 'from-pink-500 to-rose-600',
    status: 'active',
    iconName: 'Tag'
  },
  {
    id: 'live',
    hubId: 'community-hub',
    nameEn: 'Live Streams',
    nameBn: 'লাইভ',
    realWorldModel: 'Facebook Live',
    route: '/live',
    color: 'from-red-500 to-rose-600',
    status: 'active',
    iconName: 'Radio'
  },
  {
    id: 'workspace',
    hubId: 'services-hub',
    nameEn: 'Workspace Office',
    nameBn: 'ওয়ার্কস্পেস অফিস',
    realWorldModel: 'Google Workspace',
    route: '/workspace',
    color: 'from-blue-500 to-cyan-600',
    status: 'active',
    iconName: 'ClipboardList'
  },
  {
    id: 'finance',
    hubId: 'services-hub',
    nameEn: 'Finance',
    nameBn: 'অর্থনীতি',
    realWorldModel: 'Bank',
    route: '/finance',
    color: 'from-cyan-500 to-teal-700',
    status: 'active',
    iconName: 'Wallet'
  },

  // --- MEDIA ---
  {
    id: 'reels',
    hubId: 'community-hub',
    nameEn: 'Shorts',
    nameBn: 'রিলস',
    realWorldModel: 'TikTok',
    route: '/reels',
    color: 'from-purple-500 to-pink-600',
    status: 'active',
    iconName: 'PlayCircle'
  },
  {
    id: 'video',
    hubId: 'community-hub',
    nameEn: 'Video Library',
    nameBn: 'ভিডিও লাইব্রেরি',
    realWorldModel: 'YouTube',
    route: '/video',
    color: 'from-red-500 to-rose-700',
    status: 'active',
    iconName: 'Video'
  },
  {
    id: 'news',
    hubId: 'community-hub',
    nameEn: 'News',
    nameBn: 'নিউজ',
    realWorldModel: 'Prothom Alo',
    route: '/news',
    color: 'from-sky-500 to-blue-600',
    status: 'active',
    iconName: 'Newspaper'
  },
  
  // --- SPECIALIZED HUB ---
  {
    id: 'electronics',
    hubId: 'services-hub',
    nameEn: 'Electronics',
    nameBn: 'ইলেকট্রনিক্স',
    realWorldModel: 'Star Tech',
    route: '/electronics',
    color: 'from-blue-500 to-indigo-600',
    status: 'active',
    iconName: 'Tv'
  },
  {
    id: 'auto',
    hubId: 'services-hub',
    nameEn: 'Automotive',
    nameBn: 'অটোমোবাইল',
    realWorldModel: 'Auto Trader',
    route: '/auto',
    color: 'from-gray-500 to-slate-700',
    status: 'active',
    iconName: 'Car'
  },
  {
    id: 'real-estate',
    hubId: 'services-hub',
    nameEn: 'Real Estate',
    nameBn: 'রিয়েল এস্টেট',
    realWorldModel: 'Bproperty',
    route: '/real-estate',
    color: 'from-teal-500 to-cyan-700',
    status: 'active',
    iconName: 'Home'
  },
  {
    id: 'hotel',
    hubId: 'services-hub',
    nameEn: 'Hotel Booking',
    nameBn: 'হোটেল বুকিং',
    realWorldModel: 'Agoda',
    route: '/hotel',
    color: 'from-indigo-400 to-blue-600',
    status: 'active',
    iconName: 'Hotel'
  },
  {
    id: 'transport',
    hubId: 'logistics-hub',
    nameEn: 'Transport',
    nameBn: 'ট্রান্সপোর্ট',
    realWorldModel: 'Shohoz Bus',
    route: '/transport',
    color: 'from-amber-500 to-orange-700',
    status: 'active',
    iconName: 'Bus'
  },
  {
    id: 'rent',
    hubId: 'logistics-hub',
    nameEn: 'Rent',
    nameBn: 'ভাড়া',
    realWorldModel: 'Rentals',
    route: '/rent',
    color: 'from-zinc-500 to-slate-700',
    status: 'active',
    iconName: 'Key'
  },
  {
    id: 'emergency',
    hubId: 'logistics-hub',
    nameEn: 'Emergency',
    nameBn: 'ইমার্জেন্সি',
    realWorldModel: 'Ambulance/Police',
    route: '/emergency',
    color: 'from-red-500 to-rose-700',
    status: 'active',
    iconName: 'AlertTriangle'
  },
  {
    id: 'travel',
    hubId: 'services-hub',
    nameEn: 'Travel Tour',
    nameBn: 'ট্রাভেল ট্যুর',
    realWorldModel: 'ShareTrip',
    route: '/travel',
    color: 'from-cyan-400 to-sky-600',
    status: 'active',
    iconName: 'Compass'
  },
  {
    id: 'healthcare',
    hubId: 'services-hub',
    nameEn: 'Healthcare',
    nameBn: 'হেলথকেয়ার',
    realWorldModel: 'DocTime',
    route: '/healthcare',
    color: 'from-rose-500 to-pink-700',
    status: 'active',
    iconName: 'HeartPulse'
  },
  {
    id: 'education',
    hubId: 'services-hub',
    nameEn: 'Education',
    nameBn: 'এডুকেশন',
    realWorldModel: '10 Minute School',
    route: '/education',
    color: 'from-blue-400 to-cyan-600',
    status: 'active',
    iconName: 'GraduationCap'
  },
  {
    id: 'events',
    hubId: 'services-hub',
    nameEn: 'Events',
    nameBn: 'ইভেন্টস',
    realWorldModel: 'Eventbrite',
    route: '/events',
    color: 'from-purple-400 to-fuchsia-600',
    status: 'active',
    iconName: 'Calendar'
  },
  {
    id: 'agriculture',
    hubId: 'services-hub',
    nameEn: 'Agriculture',
    nameBn: 'এগ্রিকালচার',
    realWorldModel: 'Agro',
    route: '/agriculture',
    color: 'from-cyan-400 to-green-600',
    status: 'active',
    iconName: 'Tractor'
  },
  {
    id: 'telecom',
    hubId: 'services-hub',
    nameEn: 'Telecom',
    nameBn: 'টেলিকম',
    realWorldModel: 'MyGP',
    route: '/telecom',
    color: 'from-slate-400 to-gray-600',
    status: 'active',
    iconName: 'Wifi'
  }
];


export const ICON_COMPONENTS_MAP: Record<string, any> = {
  ShoppingBag,
  Building2,
  Store,
  Wrench,
  Monitor,
  MapPin,
  Star,
  Tag,
  Newspaper,
  Radio,
  Package,
  Wallet,
  User,
  Bell,
  Car,
  PlayCircle,
  Pill,
  Egg,
  Utensils,
  Hotel,
  Briefcase,
  Landmark,
  Home,
  HeartPulse,
  GraduationCap,
  Calendar,
  Wifi,
  HelpCircle,
  ShieldCheck,
  Boxes,
  Plane,
  Tv,
  Bus,
  Compass,
  Tractor,
  ClipboardList,
  Video,
  Truck
};
