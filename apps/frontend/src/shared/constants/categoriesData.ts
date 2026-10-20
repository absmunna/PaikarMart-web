import { 
  ShoppingBag, Shirt, Smartphone, Wheat, Home, 
  Sparkles, Car, Code, Wrench, Truck, Activity, 
  Store, Package, Layers, Navigation, Users, Zap
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
  | 'retail' 
  | 'wholesale' 
  | 'local' 
  | 'services' 
  | 'logistics';

export const PORTAL_CATEGORIES_MAP: Record<PortalContextType, MainCategoryItem[]> = {
  // 1. RETAIL & GENERAL COMMERCE (B2C)
  retail: [
    {
      id: 'all',
      name: 'All',
      nameBn: 'সব প্রোডাক্ট',
      icon: ShoppingBag,
      color: 'text-[var(--pm-accent)]'
    },
    {
      id: 'fashion',
      name: 'Fashion',
      nameBn: 'ফ্যাশন ও টেক্সটাইল',
      icon: Shirt,
      color: 'text-indigo-400',
      subcategories: [
        { id: 'f-all', name: 'All Fashion', nameBn: 'সকল ফ্যাশন', slug: 'all' },
        { id: 't-shirts', name: 'T-Shirts & Polos', nameBn: 'টি-শার্ট ও পোলো', slug: 't-shirts' },
        { id: 'panjabi', name: 'Panjabi & Pajama', nameBn: 'পাঞ্জাবি ও পায়জামা', slug: 'panjabi' },
        { id: 'sarees', name: 'Jamdani & Sarees', nameBn: 'জামদানি ও শাড়ি', slug: 'sarees' },
        { id: 'denim', name: 'Denim Pants', nameBn: 'ডেনিম ও জিন্স', slug: 'denim' },
        { id: 'kids', name: 'Kids Clothing', nameBn: 'শিশুদের পোশাক', slug: 'kids' }
      ]
    },
    {
      id: 'electronics',
      name: 'Electronics',
      nameBn: 'ইলেকট্রনিক্স ও গ্যাজেট',
      icon: Smartphone,
      color: 'text-cyan-400',
      subcategories: [
        { id: 'e-all', name: 'All Gadgets', nameBn: 'সকল গ্যাজেট', slug: 'all' },
        { id: 'smart-watches', name: 'Smart Watches', nameBn: 'স্মার্ট ওয়াচ', slug: 'smart-watches' },
        { id: 'audio', name: 'Earbuds & Audio', nameBn: 'ইয়ারবাডস ও অডিও', slug: 'audio' },
        { id: 'chargers', name: 'Chargers & Cables', nameBn: 'চার্জার ও কেবল', slug: 'chargers' },
        { id: 'power-banks', name: 'Power Banks', nameBn: 'পাওয়ার ব্যাংক', slug: 'power-banks' },
        { id: 'accessories', name: 'Phone Cases & Glass', nameBn: 'কেস ও গ্লাস', slug: 'accessories' }
      ]
    },
    {
      id: 'grocery',
      name: 'Grocery & Agro',
      nameBn: 'খাদ্য ও আড়ত পণ্য',
      icon: Wheat,
      color: 'text-amber-400',
      subcategories: [
        { id: 'g-all', name: 'All Agro', nameBn: 'সকল খাদ্যসামগ্রী', slug: 'all' },
        { id: 'rice', name: 'Miniket & Aromatic Rice', nameBn: 'মিনিকেট ও পোলাও চাল', slug: 'rice' },
        { id: 'oil-ghee', name: 'Mustard Oil & Pure Ghee', nameBn: 'সরিষার তেল ও ঘি', slug: 'oil-ghee' },
        { id: 'honey', name: 'Sundarbans Honey', nameBn: 'সুন্দরবনের মধু', slug: 'honey' },
        { id: 'spices', name: 'Whole Spices', nameBn: 'আস্ত মশলা', slug: 'spices' },
        { id: 'dry-fish', name: 'Dry Fish (Shutki)', nameBn: 'কক্সবাজার শুঁটকি', slug: 'dry-fish' }
      ]
    },
    {
      id: 'home',
      name: 'Home & Crafts',
      nameBn: 'গৃহসজ্জা ও হস্তশিল্প',
      icon: Home,
      color: 'text-emerald-400',
      subcategories: [
        { id: 'h-all', name: 'All Home', nameBn: 'সকল গৃহসজ্জা', slug: 'all' },
        { id: 'nakshi', name: 'Nakshi Kantha', nameBn: 'নকশী কাঁথা', slug: 'nakshi' },
        { id: 'jute', name: 'Jute Bags & Mats', nameBn: 'পাটের ব্যাগ ও ম্যাট', slug: 'jute' },
        { id: 'linen', name: 'Bed Sheets & Curtains', nameBn: 'বেডশিট ও পর্দা', slug: 'linen' },
        { id: 'ceramics', name: 'Clay & Ceramics', nameBn: 'সিরামিক ও মৃৎশিল্প', slug: 'ceramics' }
      ]
    },
    {
      id: 'beauty',
      name: 'Beauty & Care',
      nameBn: 'রূপচর্চা ও প্রসাধন',
      icon: Sparkles,
      color: 'text-pink-400',
      subcategories: [
        { id: 'b-all', name: 'All Beauty', nameBn: 'সকল রূপচর্চা', slug: 'all' },
        { id: 'skincare', name: 'Organic Skincare', nameBn: 'অর্গানিক স্কিনকেয়ার', slug: 'skincare' },
        { id: 'attar', name: 'Arabic Attar & Scents', nameBn: 'এরাবিক আতর ও সুগন্ধি', slug: 'attar' },
        { id: 'haircare', name: 'Herbal Oils & Shampoos', nameBn: 'ভেষজ তেল ও শ্যাম্পু', slug: 'haircare' }
      ]
    },
    {
      id: 'auto',
      name: 'Auto Parts',
      nameBn: 'মোটর ও গাড়ির পার্টস',
      icon: Car,
      color: 'text-rose-400',
      subcategories: [
        { id: 'a-all', name: 'All Auto', nameBn: 'সকল মোটর পার্টস', slug: 'all' },
        { id: 'helmets', name: 'Helmets & Gear', nameBn: 'হেলমেট ও সেফটি গিয়ার', slug: 'helmets' },
        { id: 'lubricants', name: 'Engine Oils', nameBn: 'ইঞ্জিন অয়েল', slug: 'lubricants' },
        { id: 'batteries', name: 'EV & Bike Batteries', nameBn: 'ই-বাইক ব্যাটারি', slug: 'batteries' }
      ]
    },
    {
      id: 'digital',
      name: 'Digital Goods',
      nameBn: 'ডিজিটাল ও কোড',
      icon: Code,
      color: 'text-violet-400',
      subcategories: [
        { id: 'd-all', name: 'All Digital', nameBn: 'সকল ডিজিটাল', slug: 'all' },
        { id: 'software', name: 'POS & Accounting', nameBn: 'দোকানের হিসাব সফটওয়্যার', slug: 'software' },
        { id: 'templates', name: 'Website Templates', nameBn: 'ওয়েবসাইট টেমপ্লেট', slug: 'templates' },
        { id: 'ebooks', name: 'Business Guides', nameBn: 'ব্যবসা ও ক্যারিয়ার ই-বুক', slug: 'ebooks' }
      ]
    }
  ],

  // 2. ROOT & DUAL FEED GENERAL (Home / Feed)
  all: [
    { id: 'all', name: 'All', nameBn: 'সব ফিড', icon: ShoppingBag, color: 'text-[var(--pm-accent)]' },
    { id: 'fashion', name: 'Fashion', nameBn: 'পোশাক', icon: Shirt, color: 'text-indigo-400',
      subcategories: [
        { id: 't-shirts', name: 'T-Shirts', nameBn: 'টি-শার্ট', slug: 't-shirts' },
        { id: 'panjabi', name: 'Panjabi', nameBn: 'পাঞ্জাবি', slug: 'panjabi' },
        { id: 'sarees', name: 'Sarees', nameBn: 'শাড়ি', slug: 'sarees' },
        { id: 'denim', name: 'Denim', nameBn: 'জিন্স', slug: 'denim' }
      ]
    },
    { id: 'electronics', name: 'Electronics', nameBn: 'ইলেকট্রনিক্স', icon: Smartphone, color: 'text-cyan-400',
      subcategories: [
        { id: 'smart-watches', name: 'Watches', nameBn: 'স্মার্ট ওয়াচ', slug: 'smart-watches' },
        { id: 'audio', name: 'Audio', nameBn: 'ইয়ারবাডস', slug: 'audio' },
        { id: 'chargers', name: 'Accessories', nameBn: 'চার্জার ও কেবল', slug: 'chargers' }
      ]
    },
    { id: 'grocery', name: 'Grocery', nameBn: 'মুদি ও খামার', icon: Wheat, color: 'text-amber-400',
      subcategories: [
        { id: 'honey', name: 'Honey', nameBn: 'মধু', slug: 'honey' },
        { id: 'oil-ghee', name: 'Oil & Ghee', nameBn: 'তেল ও ঘি', slug: 'oil-ghee' },
        { id: 'rice', name: 'Rice', nameBn: 'চাল', slug: 'rice' }
      ]
    },
    { id: 'home', name: 'Home Living', nameBn: 'নকশী ও হস্তশিল্প', icon: Home, color: 'text-emerald-400' },
    { id: 'beauty', name: 'Beauty', nameBn: 'রূপচর্চা', icon: Sparkles, color: 'text-pink-400' },
    { id: 'services', name: 'Services', nameBn: 'সার্ভিস', icon: Wrench, color: 'text-purple-400' },
    { id: 'logistics', name: 'Logistics', nameBn: 'লজিস্টিকস ও রাইড', icon: Truck, color: 'text-blue-400' }
  ],

  // 3. WHOLESALE B2B
  wholesale: [
    { id: 'all', name: 'All Lots', nameBn: 'সকল পাইকারি লট', icon: Layers, color: 'text-[var(--pm-accent)]' },
    { id: 'knitwear-lots', name: 'Export Surplus', nameBn: 'গার্মেন্টস এক্সপোর্ট লট', icon: Shirt, color: 'text-indigo-400',
      subcategories: [
        { id: 'tshirt-lots', name: 'T-Shirt Lots (100+ pcs)', nameBn: 'টি-শার্ট লট (১০০+ পিস)', slug: 'tshirt-lots' },
        { id: 'denim-lots', name: 'Export Denim Lots', nameBn: 'এক্সপোর্ট জিন্স লট', slug: 'denim-lots' },
        { id: 'panjabi-wholesale', name: 'Keraniganj Panjabi', nameBn: 'কেরানীগঞ্জ পাঞ্জাবি', slug: 'panjabi-wholesale' }
      ]
    },
    { id: 'fabrics', name: 'Fabrics & Yarns', nameBn: 'থান কাপড় ও সুতা', icon: Package, color: 'text-pink-400',
      subcategories: [
        { id: 'cotton-voile', name: 'Islampur Voile & Cotton', nameBn: 'ইসলামপুর ভয়েল ও সুতি', slug: 'cotton-voile' },
        { id: 'yarn-spools', name: 'Knitting Yarn Spools', nameBn: 'নিটিং সুতা', slug: 'yarn-spools' }
      ]
    },
    { id: 'bulk-agro', name: 'Commodity Grains', nameBn: 'খাতুনগঞ্জ আড়ত পণ্য', icon: Wheat, color: 'text-amber-400',
      subcategories: [
        { id: 'rice-sack', name: '50kg Rice Sacks', nameBn: '৫০ কেজি চালের বস্তা', slug: 'rice-sack' },
        { id: 'spices-lot', name: 'Cardamom & Cumin Lots', nameBn: 'এলাচ ও জিরা লট', slug: 'spices-lot' },
        { id: 'oil-barrel', name: 'Mustard Oil Drums', nameBn: 'ড্রাম সরিষার তেল', slug: 'oil-barrel' }
      ]
    },
    { id: 'machinery', name: 'Machinery & Tools', nameBn: 'মেশিনারি ও প্যাকেজিং', icon: Wrench, color: 'text-slate-300',
      subcategories: [
        { id: 'sewing-machines', name: 'Industrial Sewing Motors', nameBn: 'ইন্ডাস্ট্রিয়াল সেলাই মেশিন', slug: 'sewing-machines' },
        { id: 'packaging-poly', name: 'Poly & Corrugated Cartons', nameBn: 'পলি ও কার্টন প্যাকেজিং', slug: 'packaging-poly' }
      ]
    }
  ],

  // 4. LOCAL NEARBY
  local: [
    { id: 'all', name: 'All Nearby', nameBn: 'নিকটবর্তী সব', icon: Store, color: 'text-emerald-400' },
    { id: 'grocery', name: 'Daily Grocery', nameBn: 'মুদি দোকান', icon: Wheat, color: 'text-amber-400',
      subcategories: [
        { id: 'rice-flour', name: 'Rice, Flour & Oil', nameBn: 'চাল, ডাল ও তেল', slug: 'rice-flour' },
        { id: 'dairy-eggs', name: 'Milk & Farm Eggs', nameBn: 'দুধ ও ডিম', slug: 'dairy-eggs' },
        { id: 'spices-salt', name: 'Salt & Spices', nameBn: 'লবণ ও মশলা', slug: 'spices-salt' }
      ]
    },
    { id: 'pharmacy', name: 'Pharmacy', nameBn: 'ফার্মেসি ও ঔষধ', icon: Activity, color: 'text-teal-400',
      subcategories: [
        { id: 'otc-medicines', name: 'OTC Medicines', nameBn: 'সাধারণ ঔষধ', slug: 'otc-medicines' },
        { id: 'baby-care', name: 'Baby Food & Diapers', nameBn: 'বেবি ফুড ও ডায়াপার', slug: 'baby-care' },
        { id: 'first-aid', name: 'First Aid & Antiseptic', nameBn: 'ফার্স্ট এইড', slug: 'first-aid' }
      ]
    },
    { id: 'fresh-bazar', name: 'Fresh Bazaar', nameBn: 'তাজা মাছ, মাংস ও সবজি', icon: ShoppingBag, color: 'text-rose-400',
      subcategories: [
        { id: 'fresh-fish', name: 'River Fish & Ilish', nameBn: 'তাজা নদীর মাছ ও ইলিশ', slug: 'fresh-fish' },
        { id: 'chicken-beef', name: 'Halal Beef & Chicken', nameBn: 'গরুর মাংস ও ব্রয়লার', slug: 'chicken-beef' },
        { id: 'vegetables', name: 'Fresh Green Veg', nameBn: 'তাজা শাক-সবজি', slug: 'vegetables' }
      ]
    },
    { id: 'sweets-bakery', name: 'Bakery & Sweets', nameBn: 'মিষ্টি ও বেকারি', icon: Sparkles, color: 'text-amber-500' }
  ],

  // 5. SERVICES HUB
  services: [
    { id: 'all', name: 'All Services', nameBn: 'সকল সার্ভিস', icon: Wrench, color: 'text-purple-400' },
    { id: 'ac-repair', name: 'AC & Fridge', nameBn: 'এসি ও ফ্রিজ মেরামত', icon: Wrench, color: 'text-cyan-400',
      subcategories: [
        { id: 'ac-servicing', name: 'AC Master Service & Gas', nameBn: 'এসি মাস্টার সার্ভিস ও গ্যাস', slug: 'ac-servicing' },
        { id: 'fridge-repair', name: 'Refrigerator Cooling Fix', nameBn: 'ফ্রিজ সার্ভিসিং', slug: 'fridge-repair' }
      ]
    },
    { id: 'electric-plumbing', name: 'Electric & Plumbing', nameBn: 'ইলেকট্রিক ও প্লাম্বিং', icon: Zap, color: 'text-amber-400',
      subcategories: [
        { id: 'wiring', name: 'House Wiring & Short Circuit', nameBn: 'হাউজ ওয়্যারিং', slug: 'wiring' },
        { id: 'pipe-fitting', name: 'Plumbing & Pipe Line', nameBn: 'স্যানিটারি ও পাইপ ফিটিং', slug: 'pipe-fitting' }
      ]
    },
    { id: 'home-shifting', name: 'Home Shifting', nameBn: 'বাসা বদল ও হ্যান্ডেলিং', icon: Truck, color: 'text-indigo-400' },
    { id: 'cleaning-pest', name: 'Cleaning & Pest', nameBn: 'ক্লিনিং ও পেস্ট কন্ট্রোল', icon: Sparkles, color: 'text-emerald-400' }
  ],

  // 6. LOGISTICS & RIDE SHARING
  logistics: [
    { id: 'all', name: 'All Logistics', nameBn: 'সব লজিস্টিকস', icon: Truck, color: 'text-blue-400' },
    { id: 'ride-share', name: 'Inter-City Rides', nameBn: 'আন্তঃজেলা কার ও রাইড', icon: Navigation, color: 'text-emerald-400',
      subcategories: [
        { id: 'dhaka-shariatpur', name: 'Dhaka ⇄ Shariatpur', nameBn: 'ঢাকা ⇄ শরিয়তপুর', slug: 'dhaka-shariatpur' },
        { id: 'dhaka-chattogram', name: 'Dhaka ⇄ Chattogram', nameBn: 'ঢাকা ⇄ চট্টগ্রাম', slug: 'dhaka-chattogram' },
        { id: 'dhaka-sylhet', name: 'Dhaka ⇄ Sylhet', nameBn: 'ঢাকা ⇄ সিলেট', slug: 'dhaka-sylhet' }
      ]
    },
    { id: 'truck-pickup', name: 'Truck & Pickup', nameBn: 'ট্রাক ও পিকআপ ভাড়া', icon: Truck, color: 'text-amber-400',
      subcategories: [
        { id: 'pickup-1ton', name: '1 Ton Pickup Van', nameBn: '১ টন পিকআপ ভ্যান', slug: 'pickup-1ton' },
        { id: 'covered-van-7ton', name: '7 Ton Covered Van', nameBn: '৭ টন কাভার্ড ভ্যান', slug: 'covered-van-7ton' },
        { id: 'open-truck', name: 'Open Truck Long Haul', nameBn: 'খোলা ট্রাক', slug: 'open-truck' }
      ]
    },
    { id: 'parcel-courier', name: 'Parcel Courier', nameBn: 'এক্সপ্রেস পার্সেল ডেলিভারি', icon: Package, color: 'text-cyan-400' },
    { id: 'ambulance', name: 'Ambulance', nameBn: 'জরুরি অ্যাম্বুলেন্স', icon: Activity, color: 'text-red-400' }
  ]
};
