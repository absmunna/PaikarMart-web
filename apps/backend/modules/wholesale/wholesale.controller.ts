import { Request, Response } from 'express';
import { prisma, db } from '../../config/database';

export interface B2BTierPrice {
  range: string;
  min_qty: number;
  max_qty: number | null;
  unit_price: number;
  discount_percent: number;
}

export interface B2BWholesaleProduct {
  id: string;
  portal_id: string;
  name: string;
  title: string;
  description: string;
  category: string;
  industry: string;
  images: string[];
  image: string;
  moq: number;
  lead_time: string;
  lead_time_days: number;
  factory_location: string;
  tier_pricing: B2BTierPrice[];
  factory_certifications: string[];
  is_published: boolean;
  status: string;
  sample_available: boolean;
  sample_price?: number;
  supply_capacity: string;
  vendor: {
    id: string;
    store_name: string;
    factory_name: string;
    business_type: 'manufacturer' | 'wholesaler' | 'importer';
    trade_license_number: string;
    trade_license_verified: boolean;
    rating: number;
    review_count: number;
    years_in_business: number;
    inspection_available: boolean;
    location: string;
    response_rate: string;
  };
  createdAt: string;
}

// In-memory storage for RFQs and POs in dev resilient mode
const IN_MEMORY_RFQS: any[] = [];

// Seed B2B wholesale dataset representing authentic Bangladeshi manufacturing & trade
const SEED_B2B_PRODUCTS: B2BWholesaleProduct[] = [
  {
    id: "b2b-01",
    portal_id: "wholesale",
    name: "প্রিমিয়াম কম্বড কটন টি-শার্ট বাল্ক লট (১৮০ GSM)",
    title: "100% Combed Cotton 180 GSM Round Neck T-Shirt Lot",
    description: "রপ্তানিমুখী নিট কম্পোজিট মিল থেকে সরাসরি কম্বড সিঙ্গেল জার্সি টি-শার্ট। রিয়্যাক্টিভ ডাইং, কালার ফাস্টনেস গ্রেড ৪+ গ্যারান্টিযুক্ত।",
    category: "apparel_textile",
    industry: "পোশাক ও টেক্সটাইল",
    images: [
      "https://images.unsplash.com/photo-1521572267360-ee0c2909d518?w=700&auto=format&fit=crop",
      "https://images.unsplash.com/photo-1581655353564-df123a1eb820?w=700&auto=format&fit=crop"
    ],
    image: "https://images.unsplash.com/photo-1521572267360-ee0c2909d518?w=700&auto=format&fit=crop",
    moq: 50,
    lead_time: "৩-৫ কার্যদিবস (স্টক লট)",
    lead_time_days: 4,
    factory_location: "কেরানীগঞ্জ নিটওয়্যার জোন, ঢাকা",
    tier_pricing: [
      { range: "৫০ - ১৯৯ পিস", min_qty: 50, max_qty: 199, unit_price: 185, discount_percent: 0 },
      { range: "২০০ - ৪৯৯ পিস", min_qty: 200, max_qty: 499, unit_price: 170, discount_percent: 8.1 },
      { range: "৫০০+ পিস (কারখানা রেট)", min_qty: 500, max_qty: null, unit_price: 155, discount_percent: 16.2 }
    ],
    factory_certifications: [
      "ট্রেড লাইসেন্স নং: TL-DHK-2024-8192",
      "OEKO-TEX Standard 100",
      "বিকেএমইএ (BKMEA) মেম্বারশিপ",
      "ISO 9001:2015 কোয়ালিটি সার্টিফাইড"
    ],
    is_published: true,
    status: "active",
    sample_available: true,
    sample_price: 350,
    supply_capacity: "৫০,০০০ পিস / মাস",
    vendor: {
      id: "fact-keraniganj-01",
      store_name: "কেরানীগঞ্জ নিট কম্পোজিট মিলস",
      factory_name: "কেরানীগঞ্জ নিট কম্পোজিট মিলস",
      business_type: "manufacturer",
      trade_license_number: "TL-DHK-2024-8192",
      trade_license_verified: true,
      rating: 4.9,
      review_count: 240,
      years_in_business: 12,
      inspection_available: true,
      location: "কেরানীগঞ্জ, ঢাকা",
      response_rate: "৯৯%"
    },
    createdAt: new Date().toISOString()
  },
  {
    id: "b2b-02",
    portal_id: "wholesale",
    name: "স্মার্ট ওয়াচ ও ব্লুটুথ হেডসেট কম্বো ইমপোর্ট মাস্টার লট",
    title: "AMOLED Smart Watch + ANC TWS Earbuds Wholesale Carton",
    description: "হংকং ও শেনজেন থেকে সরাসরি আমদানিকৃত প্রিমিয়াম গ্যাজেট বাল্ক লট। রিকন্ডিশন বা নন-ব্র্যান্ড নয়, রিটেল রেডি প্যাকেজিং সহ সম্পূর্ণ আসল পণ্য।",
    category: "electronics_hardware",
    industry: "ইলেকট্রনিক্স ও গেজেটস",
    images: [
      "https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=700&auto=format&fit=crop",
      "https://images.unsplash.com/photo-1579586337278-3befd40fd17a?w=700&auto=format&fit=crop"
    ],
    image: "https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=700&auto=format&fit=crop",
    moq: 20,
    lead_time: "১-২ কার্যদিবস (ঢাকা ওয়্যারহাউস)",
    lead_time_days: 2,
    factory_location: "নবাবপুর রোড / মতিঝিল, ঢাকা",
    tier_pricing: [
      { range: "২০ - ৪৯ পিস", min_qty: 20, max_qty: 49, unit_price: 490, discount_percent: 0 },
      { range: "৫০ - ৯৯ পিস", min_qty: 50, max_qty: 99, unit_price: 450, discount_percent: 8.2 },
      { range: "১০০+ পিস (ইমপোর্টার ডিলার রেট)", min_qty: 100, max_qty: null, unit_price: 410, discount_percent: 16.3 }
    ],
    factory_certifications: [
      "ট্রেড লাইসেন্স নং: TL-MOTI-2023-4519",
      "আমদানি নিবন্ধন সনদ (IRC) ভেরিফাইড",
      "বিটিআরসি (BTRC) রেডিও ফ্রিকোয়েন্সি ক্লিয়ারেন্স",
      "CE & RoHS কমপ্লায়েন্ট"
    ],
    is_published: true,
    status: "active",
    sample_available: true,
    sample_price: 850,
    supply_capacity: "১০,০০০ পিস / মাস",
    vendor: {
      id: "imp-motijheel-02",
      store_name: "মতিঝিল গ্যাজেট ইমপোর্ট সিন্ডিকেট",
      factory_name: "মতিঝিল গ্যাজেট ইমপোর্ট সিন্ডিকেট",
      business_type: "wholesaler",
      trade_license_number: "TL-MOTI-2023-4519",
      trade_license_verified: true,
      rating: 4.8,
      review_count: 185,
      years_in_business: 9,
      inspection_available: true,
      location: "মতিঝিল, ঢাকা",
      response_rate: "৯৭%"
    },
    createdAt: new Date().toISOString()
  },
  {
    id: "b2b-03",
    portal_id: "wholesale",
    name: "জেনুইন লেদার ফর্মাল শু এক্সপোর্ট লট (২৫ জোড়া কার্টন)",
    title: "100% Genuine Full Grain Crust Leather Formal Shoes Lot",
    description: "হাজারীবাগ ট্যানারি জোন থেকে সরাসরি প্রক্রিয়াজাত চামড়ার অফিসিয়াল শু। রাবার সোল, মেমোরি ফোম ইনসোল, সাইজ ৪০-৪৪ মিক্সড অনুপাত।",
    category: "leather_footwear",
    industry: "চামড়াজাত পণ্য ও জুতো",
    images: [
      "https://images.unsplash.com/photo-1533867617858-e7b97e060509?w=700&auto=format&fit=crop",
      "https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=700&auto=format&fit=crop"
    ],
    image: "https://images.unsplash.com/photo-1533867617858-e7b97e060509?w=700&auto=format&fit=crop",
    moq: 25,
    lead_time: "৫-৭ কার্যদিবস",
    lead_time_days: 6,
    factory_location: "হাজারীবাগ লেদার এস্টেট, ঢাকা",
    tier_pricing: [
      { range: "২৫ - ৭৪ জোড়া", min_qty: 25, max_qty: 74, unit_price: 650, discount_percent: 0 },
      { range: "৭৫ - ১৪৯ জোড়া", min_qty: 75, max_qty: 149, unit_price: 610, discount_percent: 6.2 },
      { range: "১৫০+ জোড়া (কারখানা ডিরেক্ট রেট)", min_qty: 150, max_qty: null, unit_price: 560, discount_percent: 13.8 }
    ],
    factory_certifications: [
      "ট্রেড লাইসেন্স নং: TL-HZB-2024-3011",
      "লেদার টেকনোলজিস্ট অ্যাসোসিয়েশন ভেরিফাইড",
      "ল্যাব টেস্টেড ফুল গ্রেইন লেদার সার্টিফিকেট",
      "ISO 14001 এনভায়রনমেন্টাল স্ট্যান্ডার্ড"
    ],
    is_published: true,
    status: "active",
    sample_available: true,
    sample_price: 1200,
    supply_capacity: "৫,০০০ জোড়া / মাস",
    vendor: {
      id: "fact-leather-03",
      store_name: "হাজারীবাগ লেদার কমপ্লেক্স",
      factory_name: "হাজারীবাগ লেদার কমপ্লেক্স",
      business_type: "manufacturer",
      trade_license_number: "TL-HZB-2024-3011",
      trade_license_verified: true,
      rating: 4.9,
      review_count: 142,
      years_in_business: 15,
      inspection_available: true,
      location: "হাজারীবাগ, ঢাকা",
      response_rate: "১০০%"
    },
    createdAt: new Date().toISOString()
  },
  {
    id: "b2b-04",
    portal_id: "wholesale",
    name: "সুন্দরবনের খাঁটি বন্য খলিশা মধু (৫০ কেজি বাল্ক ড্রাম লট)",
    title: "100% Raw Wild Mangrove Honey Bulk Drums (50kg Drum)",
    description: "সুন্দরবনের সরাসরি মৌয়ালদের থেকে সংগৃহীত অপরিশোধিত কাঁচা মধু। ল্যাব টেস্ট ও পোলেন অ্যানালাইসিস সার্টিফিকেট সহ আড়তদার রেটে সরবরাহ।",
    category: "agro_commodity",
    industry: "কৃষি ও খাদ্য কমোডিটি",
    images: [
      "https://images.unsplash.com/photo-1587049352846-4a222e784d38?w=700&auto=format&fit=crop"
    ],
    image: "https://images.unsplash.com/photo-1587049352846-4a222e784d38?w=700&auto=format&fit=crop",
    moq: 10,
    lead_time: "৩-৫ কার্যদিবস (সাতক্ষীরা/খুলনা ডিপো)",
    lead_time_days: 4,
    factory_location: "শ্যামনগর, সাতক্ষীরা",
    tier_pricing: [
      { range: "১০ - ২৪ কেজি", min_qty: 10, max_qty: 24, unit_price: 520, discount_percent: 0 },
      { range: "২৫ - ৯৯ কেজি", min_qty: 25, max_qty: 99, unit_price: 480, discount_percent: 7.7 },
      { range: "১০০+ কেজি (আড়তদার বাল্ক ড্রাম)", min_qty: 100, max_qty: null, unit_price: 440, discount_percent: 15.4 }
    ],
    factory_certifications: [
      "ট্রেড লাইসেন্স নং: TL-STK-2023-1184",
      "বিএসটিআই (BSTI) স্ট্যান্ডার্ড কমপ্লায়েন্স",
      "খাদ্য নিরাপত্তা ও সাইন্স ল্যাব পিউরিটি টেস্ট",
      "বন বিভাগ ওয়াইল্ড হার্ভেস্টিং লাইসেন্স"
    ],
    is_published: true,
    status: "active",
    sample_available: true,
    sample_price: 700,
    supply_capacity: "১৫,০০০ কেজি / সিজন",
    vendor: {
      id: "agro-satkhira-04",
      store_name: "সাতক্ষীরা ন্যাচারাল এগ্রো আড়ত",
      factory_name: "সাতক্ষীরা ন্যাচারাল এগ্রো আড়ত",
      business_type: "wholesaler",
      trade_license_number: "TL-STK-2023-1184",
      trade_license_verified: true,
      rating: 4.9,
      review_count: 310,
      years_in_business: 18,
      inspection_available: true,
      location: "সাতক্ষীরা ও খুলনা",
      response_rate: "৯৮%"
    },
    createdAt: new Date().toISOString()
  },
  {
    id: "b2b-05",
    portal_id: "wholesale",
    name: "৫-প্লাই হেভি ডিউটি এক্সপোর্ট মাস্টার কার্টন (২০০ পিস বান্ডিল)",
    title: "5-Ply Corrugated Heavy Duty Shipping Cartons (Bundle of 200)",
    description: "ক্রাফট পেপার ভার্জিন লাইনার যুক্ত হেভি ডাবল ওয়াল কার্টন। গার্মেন্ট এবং বড় পার্সেল বহনে ২০০+ কেজি ভারবহন ক্ষমতা।",
    category: "packaging_machinery",
    industry: "প্যাকেজিং ও ইন্ডাস্ট্রিয়াল সাপ্লাই",
    images: [
      "https://images.unsplash.com/photo-1589939705384-5185137a7f0f?w=700&auto=format&fit=crop"
    ],
    image: "https://images.unsplash.com/photo-1589939705384-5185137a7f0f?w=700&auto=format&fit=crop",
    moq: 200,
    lead_time: "২-৪ কার্যদিবস",
    lead_time_days: 3,
    factory_location: "টঙ্গী ইন্ডাস্ট্রিয়াল এরিয়া, গাজীপুর",
    tier_pricing: [
      { range: "২০০ - ৯৯৯ পিস", min_qty: 200, max_qty: 999, unit_price: 24, discount_percent: 0 },
      { range: "১,০০০ - ৪,৯৯৯ পিস", min_qty: 1000, max_qty: 4999, unit_price: 21, discount_percent: 12.5 },
      { range: "৫,০০০+ পিস (সরাসরি মিল রেট)", min_qty: 5000, max_qty: null, unit_price: 18, discount_percent: 25.0 }
    ],
    factory_certifications: [
      "ট্রেড লাইসেন্স নং: TL-GZP-2024-6019",
      "ইন্ডাস্ট্রিয়াল পলিমার ও পেপার মিল সনদ",
      "বার্স্টিং স্ট্রেন্থ ল্যাব টেস্ট সার্টিফিকেট",
      "ISO 9001:2015 কোয়ালিটি সার্টিফাইড"
    ],
    is_published: true,
    status: "active",
    sample_available: true,
    sample_price: 100,
    supply_capacity: "১,০০,০০০ পিস / মাস",
    vendor: {
      id: "fact-tongi-05",
      store_name: "টঙ্গী পেপার অ্যান্ড প্যাকেজিং কমপ্লেক্স",
      factory_name: "টঙ্গী পেপার অ্যান্ড প্যাকেজিং কমপ্লেক্স",
      business_type: "manufacturer",
      trade_license_number: "TL-GZP-2024-6019",
      trade_license_verified: true,
      rating: 4.7,
      review_count: 88,
      years_in_business: 14,
      inspection_available: true,
      location: "গাজীপুর",
      response_rate: "৯৬%"
    },
    createdAt: new Date().toISOString()
  },
  {
    id: "b2b-06",
    portal_id: "wholesale",
    name: "টাঙ্গাইল তাঁত সুতি ও জামদানি শাড়ি হোলসেল বান্ডিল (১২ পিস প্যাক)",
    title: "Handloom Tangail Pure Cotton & Soft Jamdani Saree Bundle",
    description: "ঐতিহ্যবাহী তাঁত সমিতি থেকে সরাসরি কারিগরদের বোনা শাড়ি। কোনো মধ্যস্বত্বভোগী নেই, ১২ পিস বিভিন্ন আকর্ষণীয় রঙের সেট।",
    category: "apparel_textile",
    industry: "পোশাক ও টেক্সটাইল",
    images: [
      "https://images.unsplash.com/photo-1610030469983-98e550d6193c?w=700&auto=format&fit=crop"
    ],
    image: "https://images.unsplash.com/photo-1610030469983-98e550d6193c?w=700&auto=format&fit=crop",
    moq: 12,
    lead_time: "৩-৫ কার্যদিবস",
    lead_time_days: 4,
    factory_location: "বাজিতপুর তাঁত পল্লী, টাঙ্গাইল",
    tier_pricing: [
      { range: "১২ - ৩৬ পিস", min_qty: 12, max_qty: 36, unit_price: 850, discount_percent: 0 },
      { range: "৩৭ - ৭২ পিস", min_qty: 37, max_qty: 72, unit_price: 800, discount_percent: 5.8 },
      { range: "৭৩+ পিস (তাঁত আড়তদার রেট)", min_qty: 73, max_qty: null, unit_price: 740, discount_percent: 12.9 }
    ],
    factory_certifications: [
      "ট্রেড লাইসেন্স নং: TL-TGL-2024-2201",
      "বাংলাদেশ তাঁত বোর্ড নিবন্ধিত সমবায়",
      "১০০% খাঁটি সুতি ও জারি সুতা টেস্ট সনদ"
    ],
    is_published: true,
    status: "active",
    sample_available: true,
    sample_price: 1100,
    supply_capacity: "৩,০০০ পিস / মাস",
    vendor: {
      id: "agro-tangail-06",
      store_name: "টাঙ্গাইল ঐতিহ্য তাঁত সমিতি",
      factory_name: "টাঙ্গাইল ঐতিহ্য তাঁত সমিতি",
      business_type: "manufacturer",
      trade_license_number: "TL-TGL-2024-2201",
      trade_license_verified: true,
      rating: 4.8,
      review_count: 165,
      years_in_business: 22,
      inspection_available: true,
      location: "টাঙ্গাইল ও ঢাকা",
      response_rate: "৯৯%"
    },
    createdAt: new Date().toISOString()
  }
];

export const getWholesaleProducts = async (req: Request, res: Response) => {
  try {
    const portal = (req.query.portal || req.query.portal_id || 'wholesale') as string;
    const category = (req.query.category || '') as string;
    const industry = (req.query.industry || '') as string;
    const moqMax = req.query.moq_max ? parseInt(req.query.moq_max as string, 10) : null;
    const search = ((req.query.search || req.query.q || '') as string).toLowerCase();
    const verifiedOnly = req.query.verified_only === 'true';

    if (!db.isConnected()) {
      let filtered = [...SEED_B2B_PRODUCTS];

      if (category && category !== 'all' && category !== 'সব ক্যাটাগরি') {
        filtered = filtered.filter(p => p.category === category || p.industry.includes(category));
      }

      if (industry && industry !== 'all') {
        filtered = filtered.filter(p => p.industry.toLowerCase().includes(industry.toLowerCase()));
      }

      if (moqMax !== null && !isNaN(moqMax)) {
        filtered = filtered.filter(p => p.moq <= moqMax);
      }

      if (verifiedOnly) {
        filtered = filtered.filter(p => p.vendor.trade_license_verified);
      }

      if (search) {
        filtered = filtered.filter(p => 
          p.name.toLowerCase().includes(search) || 
          p.title.toLowerCase().includes(search) ||
          p.description.toLowerCase().includes(search) ||
          p.vendor.factory_name.toLowerCase().includes(search) ||
          p.factory_location.toLowerCase().includes(search)
        );
      }

      return res.json(filtered);
    }

    // Live Database query with Prisma
    const whereClause: any = {
      moq: { gt: 1 }
    };

    if (category && category !== 'all') {
      whereClause.category = { contains: category, mode: 'insensitive' };
    }

    if (search) {
      whereClause.OR = [
        { title: { contains: search, mode: 'insensitive' } },
        { description: { contains: search, mode: 'insensitive' } }
      ];
    }

    const products = await prisma.product.findMany({
      where: whereClause,
      include: {
        vendor: true
      }
    });

    const formatted: B2BWholesaleProduct[] = products.map((p: any) => {
      const tiers: B2BTierPrice[] = p.tieredPrices && p.tieredPrices.length > 0
        ? p.tieredPrices.map((t: any) => ({
            range: t.maxUnits ? `${t.minUnits}-${t.maxUnits} পিস` : `${t.minUnits}+ পিস`,
            min_qty: t.minUnits,
            max_qty: t.maxUnits,
            unit_price: Number(t.unitPrice),
            discount_percent: Math.round(((Number(p.price) - Number(t.unitPrice)) / Number(p.price)) * 100)
          }))
        : [
            { range: `${p.moq || 10}-99 পিস`, min_qty: p.moq || 10, max_qty: 99, unit_price: Number(p.price), discount_percent: 0 },
            { range: `100+ পিস`, min_qty: 100, max_qty: null, unit_price: Math.round(Number(p.price) * 0.9), discount_percent: 10 }
          ];

      return {
        id: p.id,
        portal_id: 'wholesale',
        name: p.title,
        title: p.title,
        description: p.description,
        category: p.category || 'apparel_textile',
        industry: p.category || 'পোশাক ও টেক্সটাইল',
        images: p.images && p.images.length > 0 ? p.images : [p.image || "https://images.unsplash.com/photo-1521572267360-ee0c2909d518?w=700"],
        image: p.image || (p.images && p.images[0]) || "https://images.unsplash.com/photo-1521572267360-ee0c2909d518?w=700",
        moq: p.moq || 20,
        lead_time: "৩-৭ কার্যদিবস",
        lead_time_days: 5,
        factory_location: p.store?.district || p.vendor?.location || "ঢাকা",
        tier_pricing: tiers,
        factory_certifications: [
          `ট্রেড লাইসেন্স নং: ${p.vendor?.tradeLicense || 'TL-VERIFIED-2024'}`,
          "ভেরিফাইড হোলসেলার সনদ",
          "কোয়ালিটি স্ট্যান্ডার্ড ইন্সপেকশন"
        ],
        is_published: true,
        status: "active",
        sample_available: true,
        sample_price: Math.round(Number(p.price) * 1.5),
        supply_capacity: "২০,০০০ পিস / মাস",
        vendor: {
          id: p.vendorId || p.storeId || 'vendor-01',
          store_name: p.store?.storeName || p.vendor?.shopName || 'ভেরিফায়েড মিলার ও হোলসেলার',
          factory_name: p.store?.storeName || p.vendor?.shopName || 'ভেরিফায়েড মিলার ও হোলসেলার',
          business_type: 'manufacturer',
          trade_license_number: p.vendor?.tradeLicense || 'TL-BD-VERIFIED',
          trade_license_verified: Boolean(p.vendor?.isVerified ?? true),
          rating: p.store?.rating || 4.9,
          review_count: p.store?.reviewCount || 120,
          years_in_business: 8,
          inspection_available: true,
          location: p.store?.district || 'ঢাকা',
          response_rate: "৯৮%"
        },
        createdAt: p.createdAt ? p.createdAt.toISOString() : new Date().toISOString()
      };
    });

    res.json(formatted);
  } catch (error) {
    console.error('Fetch Wholesale Products Error:', error);
    res.status(500).json({ error: 'Failed to fetch wholesale products' });
  }
};

export const submitRFQ = async (req: Request, res: Response) => {
  try {
    const {
      productId,
      productName,
      quantity,
      targetPrice,
      deliveryDistrict,
      paymentTerms, // 'wholesale_credit' | 'lc' | 'bank_transfer' | 'escrow'
      notes,
      buyerName,
      buyerPhone,
      buyerCompany
    } = req.body;

    const requestedQty = parseInt(quantity, 10);
    if (!requestedQty || requestedQty <= 0) {
      return res.status(400).json({ error: 'সঠিক পরিমাণ উল্লেখ করুন' });
    }

    // Look up product to compute tier rate & supplier
    const targetProduct = SEED_B2B_PRODUCTS.find(p => p.id === productId) || SEED_B2B_PRODUCTS[0];
    
    // Determine effective unit price based on tier pricing
    let agreedUnitPrice = targetPrice ? parseFloat(targetPrice) : targetProduct.tier_pricing[0].unit_price;
    for (const tier of targetProduct.tier_pricing) {
      if (requestedQty >= tier.min_qty && (tier.max_qty === null || requestedQty <= tier.max_qty)) {
        agreedUnitPrice = targetPrice ? Math.min(parseFloat(targetPrice), tier.unit_price) : tier.unit_price;
        break;
      }
    }

    const subtotal = agreedUnitPrice * requestedQty;
    const estimatedAitVat = Math.round(subtotal * 0.05); // 5% AIT / Withholding Tax estimation
    const grandTotal = subtotal + estimatedAitVat;

    // Generate formal B2B Purchase Order (PO) Draft
    const poNumber = `PO-B2B-2026-${Date.now().toString().slice(-5)}`;
    const rfqId = `RFQ-${Date.now().toString().slice(-6)}`;

    const poDraft = {
      poNumber,
      rfqId,
      status: 'draft_submitted',
      buyer: {
        name: buyerName || 'ট্রেডার্স বায়ার',
        phone: buyerPhone || '০১XXXXXXXXX',
        company: buyerCompany || 'রেজিস্টার্ড রিটেল শপ',
        district: deliveryDistrict || 'ঢাকা'
      },
      supplier: {
        factoryName: targetProduct.vendor.factory_name,
        tradeLicense: targetProduct.vendor.trade_license_number,
        location: targetProduct.vendor.location,
        verified: targetProduct.vendor.trade_license_verified
      },
      product: {
        id: targetProduct.id,
        name: productName || targetProduct.name,
        moq: targetProduct.moq,
        leadTime: targetProduct.lead_time
      },
      financials: {
        quantity: requestedQty,
        unitPrice: agreedUnitPrice,
        subtotal,
        estimatedAitVat,
        grandTotal,
        currency: 'BDT'
      },
      paymentTerms: paymentTerms || 'wholesale_credit',
      paymentTermsLabel: paymentTerms === 'lc'
        ? 'লেটার অফ ক্রেডিট (LC 90 Days At Sight)'
        : paymentTerms === 'bank_transfer'
        ? 'আরটিজিএস / ব্যাংক ট্রান্সফার (RTGS/BEFTN)'
        : 'পাইকার মার্ট হোলসেল ট্রেড ক্রেডিট ও এসক্রো (Wholesale Escrow)',
      deliveryDistrict: deliveryDistrict || 'ঢাকা',
      notes: notes || 'কোনো অতিরিক্ত শর্ত নেই।',
      createdAt: new Date().toISOString(),
      expiresAt: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString()
    };

    IN_MEMORY_RFQS.unshift(poDraft);

    res.status(201).json({
      success: true,
      message: 'বাল্ক কোটেশন রিকোয়েস্ট (RFQ) সফলভাবে সাবমিট হয়েছে এবং পারচেজ অর্ডার (PO) ড্রাফট তৈরি হয়েছে।',
      rfqId,
      poDraft
    });
  } catch (error) {
    console.error('Submit RFQ Error:', error);
    res.status(500).json({ error: 'Failed to submit RFQ' });
  }
};

export const getRFQs = async (req: Request, res: Response) => {
  try {
    return res.json(IN_MEMORY_RFQS);
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch RFQs' });
  }
};

export const respondToRFQ = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const { status, counterPrice, comments } = req.body;

    const rfq = IN_MEMORY_RFQS.find(r => r.rfqId === id || r.poNumber === id);
    if (!rfq) {
      return res.status(404).json({ error: 'RFQ বা পারচেজ অর্ডার পাওয়া যায়নি' });
    }

    rfq.status = status || 'supplier_accepted';
    if (counterPrice) {
      rfq.financials.counterPrice = parseFloat(counterPrice);
    }
    rfq.supplierComments = comments || 'প্রস্তাবিত শর্তে প্রোফরমা ইনভয়েস (PI) ইস্যু করা হলো।';
    rfq.respondedAt = new Date().toISOString();

    return res.json({
      success: true,
      message: 'সাপ্লায়ার সফলভাবে রেসপন্ড করেছেন।',
      poDraft: rfq
    });
  } catch (error) {
    res.status(500).json({ error: 'Failed to respond to RFQ' });
  }
};
