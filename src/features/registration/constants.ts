import { 
  User, Store, Factory, ShoppingBag, Boxes, Plane, Landmark, Truck, Wrench 
} from "lucide-react";
import { AccountTypeConfig } from "./types";

export const ACCOUNT_TYPES: AccountTypeConfig[] = [
  { 
    id: "buyer", 
    labelEn: "Buyer (Retail & Social)", 
    labelBn: "সাধারণ ক্রেতা (খুচরা ও সামাজিক কমার্স)", 
    icon: User, 
    color: "text-[var(--pm-accent)]",
    bgColor: "bg-[var(--pm-accent)]/10",
    borderColor: "border-[var(--pm-accent)]/20",
    securityRequired: false,
    expectedTrustLevel: 1,
    descEn: "Browse feed, buy products, and book localized services.",
    descBn: "পণ্য ক্রয়, সামাজিক যোগাযোগ ও যেকোনো সার্ভিস বুকিং করুন।",
    group: 'buyer'
  },
  { 
    id: "retail_seller", 
    labelEn: "Retail Seller", 
    labelBn: "খুচরা বিক্রেতা / রিটেইল দোকান", 
    icon: Store, 
    color: "text-emerald-400",
    bgColor: "bg-emerald-500/10",
    borderColor: "border-emerald-500/20",
    securityRequired: false,
    expectedTrustLevel: 4,
    descEn: "Sell products directly to consumers and local buyers.",
    descBn: "স্থানীয় সাধারণ ক্রেতাদের কাছে সরাসরি পণ্য বিক্রয় করুন।",
    group: 'seller'
  },
  { 
    id: "wholesale_seller", 
    labelEn: "Wholesale Dealer", 
    labelBn: "পাইকারি বিক্রেতা ও ডিলার (Wholesale)", 
    icon: Boxes, 
    color: "text-indigo-400",
    bgColor: "bg-indigo-500/10",
    borderColor: "border-indigo-500/20",
    securityRequired: true,
    expectedTrustLevel: 5,
    descEn: "Supply bulk products, tiered quantities & B2B orders.",
    descBn: "ইসলামপুর, খাতুনগঞ্জ বা পাইকারি মার্কেট থেকে বাল্ক পণ্য সরবরাহ করুন।",
    group: 'seller'
  },
  { 
    id: "factory_seller", 
    labelEn: "Manufacturer / Factory", 
    labelBn: "প্রস্তুতকারক ও শিল্প কারখানা (Factory)", 
    icon: Factory, 
    color: "text-rose-400",
    bgColor: "bg-rose-500/10",
    borderColor: "border-rose-500/20",
    securityRequired: true,
    expectedTrustLevel: 6,
    descEn: "Showcase manufacturing capacity, certifications & export lines.",
    descBn: "কারখানা উৎপাদন ক্ষমতা, আরএফকিউ ও বাল্ক প্রোডাকশন পরিচালনা করুন।",
    group: 'seller'
  },
  { 
    id: "rural_seller", 
    labelEn: "Rural Merchant & Hat", 
    labelBn: "গ্রামীণ খামারি ও সাপ্তাহিক হাট ব্যবসায়ী", 
    icon: Store, 
    color: "text-orange-400",
    bgColor: "bg-orange-500/10",
    borderColor: "border-orange-500/20",
    securityRequired: false,
    expectedTrustLevel: 4,
    descEn: "Agro crops, organic farming, cottage industry & local hat bazaar.",
    descBn: "সরাসরি মাঠের ফসল, খামারজাত পণ্য ও গ্রামীণ সাপ্তাহিক হাটের দোকান।",
    group: 'seller'
  },
  { 
    id: "exporter", 
    labelEn: "Exporter", 
    labelBn: "রপ্তানিকারক প্রতিষ্ঠান (Exporter)", 
    icon: Plane, 
    color: "text-violet-400",
    bgColor: "bg-violet-500/10",
    borderColor: "border-violet-500/20",
    securityRequired: true,
    expectedTrustLevel: 6,
    descEn: "Sell made-in-Bangladesh products to international buyers.",
    descBn: "আন্তর্জাতিক বাজারে পণ্য রপ্তানি ও লেটার অফ ক্রেডিট পরিচালনা।",
    group: 'seller'
  },
  { 
    id: "importer", 
    labelEn: "Importer", 
    labelBn: "আমদানিকারক প্রতিষ্ঠান (Importer)", 
    icon: Landmark, 
    color: "text-blue-400",
    bgColor: "bg-blue-500/10",
    borderColor: "border-blue-500/20",
    securityRequired: true,
    expectedTrustLevel: 6,
    descEn: "Import commodities & goods for local wholesale distribution.",
    descBn: "বিদেশ থেকে পণ্য আমদানি ও পাইকারি বাজারে বিতরণ করুন।",
    group: 'seller'
  },
  { 
    id: "rider", 
    labelEn: "Rider & Logistics", 
    labelBn: "রাইডার ও ট্রান্সপোর্ট পার্টনার", 
    icon: Truck, 
    color: "text-amber-400",
    bgColor: "bg-amber-500/10",
    borderColor: "border-amber-500/20",
    securityRequired: true,
    expectedTrustLevel: 4,
    descEn: "Parcel delivery, passenger rides, and goods transport.",
    descBn: "পার্সেল ডেলিভারি, মোটরসাইকেল বা কাভার্ড ভ্যান পরিবহন সেবা দিন।",
    group: 'logistics'
  },
  { 
    id: "service_provider", 
    labelEn: "Professional Services", 
    labelBn: "পেশাদার ও কারিগরি সার্ভিস", 
    icon: Wrench, 
    color: "text-purple-400",
    bgColor: "bg-purple-500/10",
    borderColor: "border-purple-500/20",
    securityRequired: true,
    expectedTrustLevel: 4,
    descEn: "Offer specialized repair, installation, or technical labor.",
    descBn: "ইলেকট্রিশিয়ান, এসি টেকনিশিয়ান ও হোম সার্ভিস বুকিং সেবা দিন।",
    group: 'service'
  }
];

export const WHOLESALE_HUBS = [
  "ইসলামপুর (Islampur), ঢাকা",
  "খাতুনগঞ্জ (Khatunganj), চট্টগ্রাম",
  "বঙ্গবাজার (Bangabazar), ঢাকা",
  "নিউমার্কেট এলাকা (New Market), ঢাকা",
  "মৌলভীবাজার (Moulvibazar), ঢাকা",
  "চকবাজার (Chawkbazar), ঢাকা",
  "টঙ্গী বিসিক শিল্প এলাকা (Tongi BSCIC)",
  "নারায়ণগঞ্জ হোসিয়ারি মার্কেট (Narayanganj)",
  "অন্যান্য পাইকারি মোকাম (Other)"
];

export const FACTORY_CATEGORIES = [
  "Readymade Garments (RMG)",
  "Knitwear / Sweaters",
  "Leather & Leather Goods",
  "Jute & Jute Products",
  "Pharmaceuticals",
  "Ceramics & Tiles",
  "Electronics & Appliances",
  "Footwear",
  "Plastics & Packaging",
  "Agro Processing & Foods",
  "Handicrafts",
  "Furniture & Timber"
];

export const FACTORY_CERTIFICATIONS = [
  "ISO 9001", "ISO 14001", "OEKO-TEX", "GOTS", "BSCI", 
  "WRAP", "SEDEX", "LEED", "Halal", "FDA", "BSTI"
];

export const EXPORT_TARGET_COUNTRIES = [
  "USA", "UK", "Germany", "France", "Italy", "Spain", 
  "Canada", "Australia", "Japan", "UAE", "Saudi Arabia", "India", "Other"
];

export const RURAL_HAT_DAYS = ["শনিবার", "রবিবার", "সোমবার", "মঙ্গলবার", "বুধবার", "বৃহস্পতিবার", "শুক্রবার"];
