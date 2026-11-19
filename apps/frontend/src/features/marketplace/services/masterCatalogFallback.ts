import { 
  MasterProduct, 
  SellerListing, 
  MasterCatalogSubmission,
  MasterService,
  ProviderServiceOffer,
  CommerceItem
} from '@/types';

// Canonical Master Products Data
export const INITIAL_MASTER_PRODUCTS: MasterProduct[] = [
  {
    id: 'master_iphone_15_pro_max',
    barcode: '019425371001',
    titleEn: 'Apple iPhone 15 Pro Max (Natural Titanium)',
    titleBn: 'অ্যাপল আইফোন ১৫ প্রো ম্যাক্স (ন্যাচারাল টাইটানিয়াম)',
    brand: 'Apple',
    category: 'Electronics',
    description: 'A17 Pro powered iPhone with a pro camera system, titanium design, and USB-C connectivity.',
    canonicalImages: [
      '/src/assets/images/paikarmart_iphone_15_pro_max_1794490099283.jpg',
      '/src/assets/images/paikarmart_samsung_phone_1794489802379.jpg'
    ],
    specifications: { Storage: '256 GB', Display: '6.7-inch OLED', Connectivity: '5G / USB-C' },
    isVerified: true,
    createdAt: '2026-01-12'
  },
  {
    id: 'master_samsung_s24_ultra',
    barcode: '880609534001',
    titleEn: 'Samsung Galaxy S24 Ultra (Titanium Series)',
    titleBn: 'স্যামসাং গ্যালাক্সি এস২৪ আল্ট্রা (টাইটানিয়াম সিরিজ)',
    brand: 'Samsung',
    category: 'Electronics',
    description: 'Flagship smartphone featuring Galaxy AI, Snapdragon 8 Gen 3 Processor, 200MP Quad Telephoto Camera, and built-in S-Pen.',
    canonicalImages: [
      'https://images.unsplash.com/photo-1707246210664-28a962a7a72d?auto=format&fit=crop&w=800&h=600&q=80',
      'https://images.unsplash.com/photo-1511707171634-5f897ff02aa9?auto=format&fit=crop&w=800&h=600&q=80'
    ],
    specifications: {
      'Display': '6.8-inch Dynamic AMOLED 2X 120Hz',
      'RAM & Storage': '12GB RAM, 256GB / 512GB ROM',
      'Camera': '200MP Main + 50MP + 12MP + 10MP',
      'Battery': '5000mAh, 45W Fast Charge'
    },
    isVerified: true,
    createdAt: '2026-01-15'
  },
  {
    id: 'master_cotton_tshirt_bulk',
    barcode: '894000123984',
    titleEn: '180 GSM Pre-Shrunk Pure Cotton Crewneck T-Shirt',
    titleBn: '১৮০ জিএসএম প্রিস্রাঙ্ক খাঁটি সুতি ক্রুনেক টি-শার্ট',
    brand: 'Standard Apparel Mills',
    category: 'Apparel',
    description: 'Premium combed cotton blank t-shirts engineered for screen printing, embroidery, and retail resale. Export quality guaranteed.',
    canonicalImages: [
      '/src/assets/images/garment_factory_floor_1794253693154.jpg',
      'https://images.unsplash.com/photo-1521572267360-ee0c2909d518?auto=format&fit=crop&w=800&h=600&q=80'
    ],
    specifications: {
      'Fabric Weight': '180 GSM Combed Cotton',
      'Stitching': 'Double Needle Hem & Sleeve',
      'Color Options': 'Black, White, Navy, Charcoal',
      'Care': 'Machine Wash Cold'
    },
    isVerified: true,
    createdAt: '2026-01-20'
  },
  {
    id: 'master_usbc_braided_cable',
    barcode: '697012345678',
    titleEn: '65W PD Fast Charging USB-C to USB-C Braided Cable (1.2m)',
    titleBn: '৬৫W পিডি ফাস্ট চার্জিং ইউএসবি-সি ব্রেইডেড ক্যাবল (১.২ মি)',
    brand: 'Pacific Rim Importers',
    category: 'Electronics',
    description: 'Heavy duty nylon-braided fast charging cable with E-Mark chip supporting power delivery up to 65W for laptops and phones.',
    canonicalImages: [
      '/src/assets/images/wholesale_electronics_pallet_1794246669477.jpg',
      'https://images.unsplash.com/photo-1583863788434-e58a36330cf0?auto=format&fit=crop&w=800&h=600&q=80'
    ],
    specifications: {
      'Length': '1.2 Meters / 4 Feet',
      'Power Output': 'Up to 65W Power Delivery',
      'Material': 'High-Tenacity Nylon Braid',
      'Warranty': '6 Months Replacement Warranty'
    },
    isVerified: true,
    createdAt: '2026-02-01'
  },
  {
    id: 'master_hass_avocados',
    barcode: '0401123998',
    titleEn: 'Fresh Organic Hass Avocados (Farm Selected)',
    titleBn: 'ফ্রেশ অর্গানিক হাস অ্যাভোকাডো (ফার্ম সিলেকশন)',
    brand: 'Green Valley Organic Farms',
    category: 'Grocery',
    description: 'Nutrient-rich, creamy Hass avocados harvested fresh daily from certified organic orchards.',
    canonicalImages: [
      'https://images.unsplash.com/photo-1523049673857-eb18f1d7b578?auto=format&fit=crop&w=800&h=600&q=80'
    ],
    specifications: {
      'Origin': 'Hill Tracts Organic Farm',
      'Grade': 'Export Grade A',
      'Storage': 'Keep in cool dry place (10-15°C)'
    },
    isVerified: true,
    createdAt: '2026-02-10'
  }
];

// Multiple Seller Listings per Master Product (1:N)
export const INITIAL_SELLER_LISTINGS: SellerListing[] = [
  // Offers for Fresh Organic Hass Avocados
  {
    id: 'listing_avocado_green_valley',
    masterProductId: 'master_hass_avocados',
    sellerId: 'vendor_corner_mart',
    sellerName: 'Green Valley Local Mart',
    sellerRating: 4.8,
    sellerReviewsCount: 85,
    price: 5.50,
    originalPrice: 6.00,
    stockQuantity: 24,
    tradeMode: 'retail',
    deliveryEta: '15 min',
    proximityDistance: '0.4 km',
    location: 'Dhanmondi, Dhaka',
    sellerRealPhotos: [],
    isActive: true,
    createdAt: '2026-02-10'
  },
  {
    id: 'listing_avocado_fresh_basket',
    masterProductId: 'master_hass_avocados',
    sellerId: 'vendor_fresh_basket',
    sellerName: 'Fresh Basket Organic Shop',
    sellerRating: 4.7,
    sellerReviewsCount: 51,
    price: 5.25,
    originalPrice: 5.75,
    stockQuantity: 16,
    tradeMode: 'retail',
    deliveryEta: '25 min',
    proximityDistance: '1.1 km',
    location: 'Mohammadpur, Dhaka',
    sellerRealPhotos: [],
    isActive: true,
    createdAt: '2026-02-11'
  },
  {
    id: 'listing_avocado_farm_direct',
    masterProductId: 'master_hass_avocados',
    sellerId: 'vendor_green_valley_farms',
    sellerName: 'Green Valley Organic Farms',
    sellerRating: 4.9,
    sellerReviewsCount: 39,
    price: 4.95,
    originalPrice: 5.50,
    stockQuantity: 40,
    tradeMode: 'retail',
    deliveryEta: 'Same Day',
    proximityDistance: '4.2 km',
    location: 'Tejgaon, Dhaka',
    sellerRealPhotos: [],
    isActive: true,
    createdAt: '2026-02-12'
  },
  // Offers for Apple iPhone 15 Pro Max
  {
    id: 'listing_iphone_gadget_gear',
    masterProductId: 'master_iphone_15_pro_max',
    sellerId: 'vendor_apple_authorized',
    sellerName: 'Gadget & Gear Official',
    sellerRating: 4.9,
    sellerReviewsCount: 150,
    price: 185000,
    originalPrice: 194000,
    stockQuantity: 12,
    tradeMode: 'retail',
    deliveryEta: '2-3 Days',
    proximityDistance: '3.5 km',
    location: 'Bashundhara City, Dhaka',
    sellerRealPhotos: ['/src/assets/images/paikarmart_iphone_15_pro_max_1794490099283.jpg'],
    isActive: true,
    createdAt: '2026-02-02'
  },
  {
    id: 'listing_iphone_dhaka_telecom',
    masterProductId: 'master_iphone_15_pro_max',
    sellerId: 'vendor_dhaka_telecom',
    sellerName: 'Dhaka Telecom & Gadgets',
    sellerRating: 4.8,
    sellerReviewsCount: 115,
    price: 181500,
    originalPrice: 189000,
    stockQuantity: 5,
    tradeMode: 'retail',
    deliveryEta: '1-2 Hours',
    proximityDistance: '0.8 km',
    location: 'Gulshan 1, Dhaka',
    sellerRealPhotos: [],
    isActive: true,
    createdAt: '2026-02-04'
  },
  {
    id: 'listing_iphone_chittagong',
    masterProductId: 'master_iphone_15_pro_max',
    sellerId: 'vendor_ctg_electronics',
    sellerName: 'Chittagong Electronics Mart',
    sellerRating: 4.7,
    sellerReviewsCount: 64,
    price: 179900,
    originalPrice: 187000,
    stockQuantity: 8,
    tradeMode: 'retail',
    deliveryEta: '2-3 Days',
    proximityDistance: '240 km',
    location: 'GEC Circle, Chittagong',
    sellerRealPhotos: [],
    isActive: true,
    createdAt: '2026-02-06'
  },
  // Offers for Samsung S24 Ultra
  {
    id: 'listing_samsung_official',
    masterProductId: 'master_samsung_s24_ultra',
    sellerId: 'vendor_samsung',
    sellerName: 'Samsung Official Brand Shop',
    sellerRating: 4.9,
    sellerReviewsCount: 240,
    price: 1299.00,
    originalPrice: 1399.00,
    stockQuantity: 50,
    tradeMode: 'retail',
    deliveryEta: 'Same Day Express',
    proximityDistance: '1.2 km',
    location: 'Gulshan 2, Dhaka',
    sellerRealPhotos: [
      'https://images.unsplash.com/photo-1511707171634-5f897ff02aa9?auto=format&fit=crop&w=600&q=80'
    ],
    isActive: true,
    createdAt: '2026-02-01'
  },
  {
    id: 'listing_dhaka_telecom',
    masterProductId: 'master_samsung_s24_ultra',
    sellerId: 'vendor_dhaka_telecom',
    sellerName: 'Dhaka Telecom & Gadgets',
    sellerRating: 4.8,
    sellerReviewsCount: 115,
    price: 1249.00,
    originalPrice: 1299.00,
    stockQuantity: 18,
    tradeMode: 'retail',
    deliveryEta: '1-2 Hours',
    proximityDistance: '0.5 km',
    location: 'Bashundhara City, Dhaka',
    sellerRealPhotos: [
      'https://images.unsplash.com/photo-1580910051074-3eb694886505?auto=format&fit=crop&w=600&q=80'
    ],
    isActive: true,
    createdAt: '2026-02-05'
  },
  {
    id: 'listing_chittagong_electronics',
    masterProductId: 'master_samsung_s24_ultra',
    sellerId: 'vendor_ctg_electronics',
    sellerName: 'Chittagong Electronics Mart',
    sellerRating: 4.7,
    sellerReviewsCount: 64,
    price: 1220.00,
    originalPrice: 1299.00,
    stockQuantity: 30,
    tradeMode: 'wholesale',
    minWholesaleQty: 5,
    wholesaleTiers: [
      { minQty: 5, pricePerUnit: 1220.00 },
      { minQty: 20, pricePerUnit: 1180.00 }
    ],
    deliveryEta: '2-3 Days',
    proximityDistance: '240 km',
    location: 'GEC Circle, Chittagong',
    sellerRealPhotos: [],
    isActive: true,
    createdAt: '2026-02-08'
  },

  // Offers for Cotton T-Shirts
  {
    id: 'listing_standard_garments',
    masterProductId: 'master_cotton_tshirt_bulk',
    sellerId: 'vendor_textile_mill',
    sellerName: 'Standard Garments Factory',
    sellerRating: 4.9,
    sellerReviewsCount: 32,
    price: 2.80,
    originalPrice: 3.50,
    stockQuantity: 5000,
    tradeMode: 'wholesale',
    minWholesaleQty: 100,
    wholesaleTiers: [
      { minQty: 100, pricePerUnit: 2.80 },
      { minQty: 500, pricePerUnit: 2.45 },
      { minQty: 1000, pricePerUnit: 2.10 }
    ],
    deliveryEta: '5-7 Days Freight',
    proximityDistance: '12 km',
    location: 'Gazipur Industrial Zone',
    sellerRealPhotos: [
      '/src/assets/images/garment_factory_floor_1794253693154.jpg'
    ],
    isActive: true,
    createdAt: '2026-01-22'
  },
  {
    id: 'listing_bengal_knitwear',
    masterProductId: 'master_cotton_tshirt_bulk',
    sellerId: 'vendor_bengal_knit',
    sellerName: 'Bengal Knitwear Exporters',
    sellerRating: 4.8,
    sellerReviewsCount: 88,
    price: 2.65,
    originalPrice: 3.20,
    stockQuantity: 12000,
    tradeMode: 'wholesale',
    minWholesaleQty: 200,
    wholesaleTiers: [
      { minQty: 200, pricePerUnit: 2.65 },
      { minQty: 1000, pricePerUnit: 2.25 }
    ],
    deliveryEta: '3-5 Days Cargo',
    proximityDistance: '18 km',
    location: 'Narayanganj Export Hub',
    sellerRealPhotos: [],
    isActive: true,
    createdAt: '2026-02-02'
  }
];

// Initial Pending Submissions for Admin Review Queue
export const INITIAL_CATALOG_SUBMISSIONS: MasterCatalogSubmission[] = [
  {
    id: 'sub_901',
    sellerId: 'vendor_green_tech',
    sellerName: 'GreenTech Solutions BD',
    proposedTitle: 'Portable Solar Power Station 500W Outdoor Generator',
    proposedBrand: 'EcoFlow BD',
    proposedCategory: 'Electronics',
    proposedDescription: 'Compact lithium battery generator for outdoor camping and emergency home backup. Includes AC outlet and fast USB-C.',
    proposedImages: [
      'https://images.unsplash.com/photo-1617788138017-80ad40651399?auto=format&fit=crop&w=600&q=80'
    ],
    proposedPrice: 34500,
    tradeMode: 'retail',
    status: 'pending_review',
    aiConfidenceScore: 98,
    aiAuditNotes: 'High quality image detected. Clear brand logo. No prohibited items.',
    createdAt: 'Just now'
  }
];

// Canonical Master Services Data (Service Hub 1:N)
export const INITIAL_MASTER_SERVICES: MasterService[] = [
  {
    id: 'master_service_ac_wash',
    titleEn: 'Split AC Master Jet Wash & Deep Cleaning',
    titleBn: 'স্প্লিট এসি মাস্টার জেট ওয়াশ ও ডিপ ক্লিনিং',
    serviceType: 'repair',
    description: 'Complete indoor & outdoor unit deep cleaning using high-pressure jet wash, eco-friendly chemical coil wash, drain line flushing, and gas pressure measurement.',
    includedChecklist: [
      'High-pressure indoor blower & filter wash',
      'Outdoor condenser coil chemical flush',
      'Drain line unclogging & leak check',
      'Freon gas pressure measurement'
    ],
    estimatedDuration: '60 Minutes',
    canonicalImageUrl: 'https://images.unsplash.com/photo-1581094288338-2314dddb7bc3?auto=format&fit=crop&w=800&h=600&q=80',
    createdAt: '2026-01-10'
  },
  {
    id: 'master_service_plumbing_fix',
    titleEn: 'Emergency Sanitary Plumbing & Leakage Repair',
    titleBn: 'ইমার্জেন্সি স্যানিটারি প্লাম্বিং ও লিক মেরামত',
    serviceType: 'plumber',
    description: 'Instant repair for pipe leaks, faucet replacements, sink blockage clearance, and bathroom toilet flushing mechanism servicing.',
    includedChecklist: [
      'Pipeline leak detection & sealing',
      'Faucet / Angle valve replacement',
      'Drainage blockage clearing',
      'Pressure testing'
    ],
    estimatedDuration: '45 Minutes',
    canonicalImageUrl: 'https://images.unsplash.com/photo-1504328345606-18bbc8c9d7d1?auto=format&fit=crop&w=800&h=600&q=80',
    createdAt: '2026-01-12'
  }
];

// Provider Service Offers (1:N Technicians mapped to Master Service)
export const INITIAL_PROVIDER_SERVICE_OFFERS: ProviderServiceOffer[] = [
  {
    id: 'service_offer_coolmaster',
    masterServiceId: 'master_service_ac_wash',
    providerId: 'vendor_cool_tech',
    providerName: 'CoolMaster AC Service BD',
    baseRate: 45.00,
    serviceRadiusKm: 5.0,
    verifiedBadge: true,
    rating: 4.9,
    reviewsCount: 420,
    proximityDistance: '0.6 km',
    estimatedArrival: 'Within 45 min'
  },
  {
    id: 'service_offer_kalam_ac',
    masterServiceId: 'master_service_ac_wash',
    providerId: 'vendor_kalam_ac',
    providerName: 'Kalam AC & Electronics Care',
    baseRate: 38.00,
    serviceRadiusKm: 8.0,
    verifiedBadge: true,
    rating: 4.8,
    reviewsCount: 185,
    proximityDistance: '1.4 km',
    estimatedArrival: 'Today Afternoon'
  },
  {
    id: 'service_offer_instant_pro',
    masterServiceId: 'master_service_ac_wash',
    providerId: 'vendor_instant_pro',
    providerName: 'InstantFix Certified Engineers',
    baseRate: 55.00,
    serviceRadiusKm: 10.0,
    verifiedBadge: true,
    rating: 5.0,
    reviewsCount: 92,
    proximityDistance: '2.1 km',
    estimatedArrival: 'Express 20 min'
  }
];

// Helper functions for Master Catalog System
export const getMasterProducts = (searchQuery?: string, category?: string): MasterProduct[] => {
  return INITIAL_MASTER_PRODUCTS.filter((mp) => {
    if (category && category !== 'all' && mp.category.toLowerCase() !== category.toLowerCase()) {
      return false;
    }
    if (searchQuery && searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      const matchTitleEn = mp.titleEn.toLowerCase().includes(q);
      const matchTitleBn = mp.titleBn.toLowerCase().includes(q);
      const matchBrand = mp.brand.toLowerCase().includes(q);
      const matchBarcode = mp.barcode?.toLowerCase().includes(q);
      if (!matchTitleEn && !matchTitleBn && !matchBrand && !matchBarcode) return false;
    }
    return true;
  });
};

export const getSellerListingsForMasterProduct = (masterProductId: string): SellerListing[] => {
  return INITIAL_SELLER_LISTINGS.filter(
    listing => listing.masterProductId === masterProductId && listing.isActive
  );
};

export const getProviderOffersForService = (masterServiceId: string): ProviderServiceOffer[] => {
  return INITIAL_PROVIDER_SERVICE_OFFERS.filter(
    offer => offer.masterServiceId === masterServiceId
  );
};
