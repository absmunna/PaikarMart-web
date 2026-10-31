import {
  ShoppingBag, Building2, Store, Wrench, Monitor,
  MapPin, Star, Tag, Newspaper, Radio,
  Package, Wallet, User, Bell, Car, PlayCircle,
  Pill, Egg, Utensils, Hotel, Briefcase, Landmark,
  Home, HeartPulse, GraduationCap, Calendar, Wifi, HelpCircle,
  ShieldCheck, Boxes, Plane, Tv, Bus, Compass, Tractor, ClipboardList, Video, Truck,
  Award, AlertTriangle, Layout, Key
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
    id: 'commerce-hub',
    nameEn: 'Commerce',
    nameBn: 'কমার্স ও শপিং',
    descriptionEn: 'Everything you need to buy or sell - Retail & Wholesale',
    descriptionBn: 'কেনা-বেচার সবকিছু - রিটেইল এবং হোলসেল',
    color: 'from-blue-600 to-indigo-800',
    iconName: 'ShoppingBag'
  },
  {
    id: 'services-logistics-hub',
    nameEn: 'Services & Help',
    nameBn: 'সেবা ও লজিস্টিকস',
    descriptionEn: 'On-demand services, rides, and local expert help',
    descriptionBn: 'অন-ডিমান্ড সার্ভিস, রাইড এবং লোকাল হেল্প',
    color: 'from-amber-500 to-orange-700',
    iconName: 'Wrench'
  },
  {
    id: 'community-content-hub',
    nameEn: 'Community & Feed',
    nameBn: 'কমিউনিটি ও ফিড',
    descriptionEn: 'Social feed, demands, news and entertainment',
    descriptionBn: 'সোশ্যাল ফিড, ডিমান্ড, নিউজ এবং বিনোদন',
    color: 'from-purple-600 to-pink-800',
    iconName: 'PlayCircle'
  },
  {
    id: 'utility-pro-hub',
    nameEn: 'Utility & Tools',
    nameBn: 'ইউটিলিটি ও টুলস',
    descriptionEn: 'Personal wallet, education, finance and workspace',
    descriptionBn: 'পার্সোনাল ওয়ালেট, এডুকেশন, ফাইন্যান্স এবং ওয়ার্কস্পেস',
    color: 'from-slate-700 to-zinc-900',
    iconName: 'Layout'
  }
];

export const PORTAL_REGISTRY: PortalItem[] = [
  // --- COMMERCE HUB (Retail + Wholesale + Business) ---
  {
    id: 'pk-shop',
    hubId: 'commerce-hub',
    nameEn: 'PK Store',
    nameBn: 'পিকে স্টোর',
    realWorldModel: 'Verified Store',
    route: '/pk-shop',
    color: 'from-orange-500 to-amber-600',
    status: 'active',
    iconName: 'ShieldCheck'
  },
  {
    id: 'marketplace',
    hubId: 'commerce-hub',
    nameEn: 'Marketplace',
    nameBn: 'মার্কেটপ্লেস',
    realWorldModel: 'Daraz',
    route: '/marketplace',
    color: 'from-orange-400 to-pink-500',
    status: 'active',
    iconName: 'ShoppingBag'
  },
  {
    id: 'wholesale-main',
    hubId: 'commerce-hub',
    nameEn: 'Wholesale Market',
    nameBn: 'হোলসেল মার্কেট',
    realWorldModel: 'Indiamart',
    route: '/wholesale',
    color: 'from-blue-600 to-indigo-800',
    status: 'active',
    iconName: 'Boxes'
  },
  {
    id: 'b2b',
    hubId: 'commerce-hub',
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
    hubId: 'commerce-hub',
    nameEn: 'Factory Direct',
    nameBn: 'ফ্যাক্টরি ডাইরেক্ট',
    realWorldModel: 'Factory Sourcing',
    route: '/b2b/factory',
    color: 'from-slate-600 to-slate-800',
    status: 'active',
    iconName: 'Landmark'
  },
  {
    id: 'fashion',
    hubId: 'commerce-hub',
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
    hubId: 'commerce-hub',
    nameEn: 'Brand Shops',
    nameBn: 'ব্র্যান্ড শপ',
    realWorldModel: 'Tmall',
    route: '/brand-shops',
    color: 'from-amber-500 to-red-600',
    status: 'active',
    iconName: 'Award'
  },
  {
    id: 'export',
    hubId: 'commerce-hub',
    nameEn: 'Export Hub',
    nameBn: 'রপ্তানি হাব',
    realWorldModel: 'TradeKey',
    route: '/export',
    color: 'from-sky-500 to-indigo-600',
    status: 'active',
    iconName: 'Plane'
  },

  // --- SERVICES & LOGISTICS HUB (Nearby + Help + Transport) ---
  {
    id: 'nearby',
    hubId: 'services-logistics-hub',
    nameEn: 'Nearby Shops',
    nameBn: 'লোকাল শপ',
    realWorldModel: 'Google Local',
    route: '/local',
    color: 'from-rose-400 to-purple-600',
    status: 'active',
    iconName: 'MapPin'
  },
  {
    id: 'food',
    hubId: 'services-logistics-hub',
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
    hubId: 'services-logistics-hub',
    nameEn: 'Grocery',
    nameBn: 'গ্রোসারি',
    realWorldModel: 'Chaldal',
    route: '/grocery',
    color: 'from-green-400 to-emerald-600',
    status: 'active',
    iconName: 'Egg'
  },
  {
    id: 'pharmacy',
    hubId: 'services-logistics-hub',
    nameEn: 'Pharmacy',
    nameBn: 'ফার্মেসি',
    realWorldModel: 'Pillstock',
    route: '/pharmacy',
    color: 'from-teal-400 to-cyan-600',
    status: 'active',
    iconName: 'Pill'
  },
  {
    id: 'services',
    hubId: 'services-logistics-hub',
    nameEn: 'Expert Services',
    nameBn: 'সার্ভিসেস',
    realWorldModel: 'Sheba.xyz',
    route: '/services',
    color: 'from-amber-400 to-orange-600',
    status: 'active',
    iconName: 'Wrench'
  },
  {
    id: 'ride',
    hubId: 'services-logistics-hub',
    nameEn: 'Ride Share',
    nameBn: 'রাইড শেয়ার',
    realWorldModel: 'Pathao',
    route: '/ride',
    color: 'from-yellow-400 to-amber-600',
    status: 'active',
    iconName: 'Car'
  },
  {
    id: 'logistics',
    hubId: 'services-logistics-hub',
    nameEn: 'Logistics',
    nameBn: 'ডেলিভারি',
    realWorldModel: 'Pathao Courier',
    route: '/logistics',
    color: 'from-orange-500 to-red-600',
    status: 'active',
    iconName: 'Truck'
  },
  {
    id: 'transport',
    hubId: 'services-logistics-hub',
    nameEn: 'Transport',
    nameBn: 'ট্রান্সপোর্ট',
    realWorldModel: 'Shohoz Bus',
    route: '/transport',
    color: 'from-amber-500 to-orange-700',
    status: 'active',
    iconName: 'Bus'
  },
  {
    id: 'emergency',
    hubId: 'services-logistics-hub',
    nameEn: 'Emergency',
    nameBn: 'ইমার্জেন্সি',
    realWorldModel: 'Ambulance/Police',
    route: '/emergency',
    color: 'from-red-500 to-rose-700',
    status: 'active',
    iconName: 'AlertTriangle'
  },

  // --- COMMUNITY & CONTENT HUB (Social + Media + Demand) ---
  {
    id: 'demand',
    hubId: 'community-content-hub',
    nameEn: 'Demand Board',
    nameBn: 'ডিমান্ড বোর্ড',
    realWorldModel: 'TaskRabbit',
    route: '/demand',
    color: 'from-amber-400 to-orange-600',
    status: 'active',
    iconName: 'ClipboardList'
  },
  {
    id: 'reels',
    hubId: 'community-content-hub',
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
    hubId: 'community-content-hub',
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
    hubId: 'community-content-hub',
    nameEn: 'News',
    nameBn: 'নিউজ',
    realWorldModel: 'Prothom Alo',
    route: '/news',
    color: 'from-sky-500 to-blue-600',
    status: 'active',
    iconName: 'Newspaper'
  },
  {
    id: 'offer',
    hubId: 'community-content-hub',
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
    hubId: 'community-content-hub',
    nameEn: 'Live Streams',
    nameBn: 'লাইভ',
    realWorldModel: 'Facebook Live',
    route: '/live',
    color: 'from-red-500 to-rose-600',
    status: 'active',
    iconName: 'Radio'
  },

  // --- UTILITY & PRO HUB (Tools + Finance + Others) ---
  {
    id: 'finance',
    hubId: 'utility-pro-hub',
    nameEn: 'Finance',
    nameBn: 'অর্থনীতি',
    realWorldModel: 'Bank',
    route: '/finance',
    color: 'from-orange-500 to-amber-700',
    status: 'active',
    iconName: 'Wallet'
  },
  {
    id: 'workspace',
    hubId: 'utility-pro-hub',
    nameEn: 'Workspace Office',
    nameBn: 'ওয়ার্কস্পেস অফিস',
    realWorldModel: 'Google Workspace',
    route: '/workspace',
    color: 'from-blue-500 to-indigo-600',
    status: 'active',
    iconName: 'Monitor'
  },
  {
    id: 'healthcare',
    hubId: 'utility-pro-hub',
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
    hubId: 'utility-pro-hub',
    nameEn: 'Education',
    nameBn: 'এডুকেশন',
    realWorldModel: '10 Minute School',
    route: '/education',
    color: 'from-blue-400 to-indigo-600',
    status: 'active',
    iconName: 'GraduationCap'
  },
  {
    id: 'dropship',
    hubId: 'utility-pro-hub',
    nameEn: 'Dropship',
    nameBn: 'ড্রপশিপিং',
    realWorldModel: 'Oberlo',
    route: '/dropship',
    color: 'from-amber-500 to-orange-600',
    status: 'active',
    iconName: 'Package'
  },
  {
    id: 'jobs',
    hubId: 'utility-pro-hub',
    nameEn: 'Jobs & Gigs',
    nameBn: 'চাকরি ও গিগ',
    realWorldModel: 'Bdjobs',
    route: '/jobs',
    color: 'from-orange-500 to-blue-700',
    status: 'active',
    iconName: 'Briefcase'
  },
  {
    id: 'agriculture',
    hubId: 'utility-pro-hub',
    nameEn: 'Agriculture',
    nameBn: 'এগ্রিকালচার',
    realWorldModel: 'Agro',
    route: '/agriculture',
    color: 'from-orange-400 to-green-600',
    status: 'active',
    iconName: 'Tractor'
  },
  {
    id: 'hotel',
    hubId: 'utility-pro-hub',
    nameEn: 'Hotel Booking',
    nameBn: 'হোটেল বুকিং',
    realWorldModel: 'Agoda',
    route: '/hotel',
    color: 'from-indigo-400 to-blue-600',
    status: 'active',
    iconName: 'Hotel'
  },
  {
    id: 'telecom',
    hubId: 'utility-pro-hub',
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
  Truck,
  Award,
  AlertTriangle,
  Layout,
  Key
};
