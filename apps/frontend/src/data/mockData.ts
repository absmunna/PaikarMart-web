import { User, SocialPost, CommerceItem, Story, CreatorContent, RideOption, AppNotification, Order } from '@/types';

export const CURRENT_USER: User = {
  id: 'usr_001',
  name: 'Alex Rivera',
  handle: '@alexrivera',
  avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=256&h=256&q=80',
  role: 'consumer',
  isVendor: false,
  location: 'San Francisco, CA',
  balance: 384.50,
  rewardPoints: 1250,
  transactions: [
    {
      id: 'tx_01',
      type: 'deposit',
      amount: 150.00,
      description: 'Deposit via bKash Merchant Gateway',
      timestamp: '2 hours ago',
      status: 'completed',
      referenceId: 'BKX-984210'
    },
    {
      id: 'tx_02',
      type: 'purchase',
      amount: 45.00,
      description: 'Order Payment #ORD-8491 (Organic Darjeeling Tea)',
      timestamp: 'Yesterday',
      status: 'completed',
      referenceId: 'PM-PAY-582'
    },
    {
      id: 'tx_03',
      type: 'cashback',
      amount: 4.50,
      description: 'Loyalty Cashback Reward (10%)',
      timestamp: 'Yesterday',
      status: 'completed',
      referenceId: 'REWARD-849'
    }
  ]
};

export const INITIAL_NOTIFICATIONS: AppNotification[] = [
  {
    id: 'notif_1',
    type: 'order',
    title: 'Order Confirmed! 📦',
    message: 'Your order #ORD-9482 (Wireless ANC Headphones) has been verified by Apex Electronics.',
    timestamp: '10m ago',
    read: false,
    actionTab: 'profile',
  },
  {
    id: 'notif_2',
    type: 'social',
    title: 'New Reaction & Comment ❤️',
    message: 'Urban Grill HQ loved your post: "Just ordered gourmet burger platters!"',
    timestamp: '25m ago',
    read: false,
    actionTab: 'feed',
    avatar: 'https://images.unsplash.com/photo-1570295999919-56ceb5ecca61?auto=format&fit=crop&w=150&h=150&q=80',
  },
  {
    id: 'notif_3',
    type: 'booking',
    title: 'Technician Assigned 🔧',
    message: 'FixPro Master Electrician assigned for your HVAC Repair appointment tomorrow at 10:00 AM.',
    timestamp: '1h ago',
    read: false,
    actionTab: 'services',
  },
  {
    id: 'notif_4',
    type: 'wallet',
    title: 'Wallet Deposit Success 💳',
    message: '+$50.00 added to your PaikarMart Wallet via bKash mobile banking.',
    timestamp: '3h ago',
    read: true,
    actionTab: 'profile',
  },
  {
    id: 'notif_5',
    type: 'system',
    title: 'Welcome to PaikarMart Super App 🚀',
    message: 'Explore retail & wholesale commerce, nearby services, ride transit, and creator hubs all in one app!',
    timestamp: '1d ago',
    read: true,
    actionTab: 'hub',
  }
];

export const INITIAL_STORIES: Story[] = [
  {
    id: 'story_user',
    authorName: 'Your Story',
    authorAvatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=256&h=256&q=80',
    mediaUrl: '',
    viewed: false
  },
  {
    id: 'story_1',
    authorName: 'Urban Grill HQ',
    authorAvatar: 'https://images.unsplash.com/photo-1570295999919-56ceb5ecca61?auto=format&fit=crop&w=150&h=150&q=80',
    mediaUrl: '/src/assets/images/food_delivery_gourmet_burger_1794246670761.jpg',
    isLive: true,
    viewed: false
  },
  {
    id: 'story_2',
    authorName: 'Apex Electronics',
    authorAvatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=150&h=150&q=80',
    mediaUrl: '/src/assets/images/wholesale_electronics_pallet_1794246669477.jpg',
    viewed: false
  },
  {
    id: 'story_3',
    authorName: 'FixPro Care',
    authorAvatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&w=150&h=150&q=80',
    mediaUrl: '/src/assets/images/service_technician_home_repair_1794246675258.jpg',
    viewed: true
  },
  {
    id: 'story_4',
    authorName: 'VoltRide Fleet',
    authorAvatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&w=150&h=150&q=80',
    mediaUrl: '/src/assets/images/rideshare_urban_electric_car_1794246674656.jpg',
    viewed: false
  }
];

export const INITIAL_COMMERCE_ITEMS: CommerceItem[] = [
  // --- REAL RETAIL PRODUCTS ---
  {
    id: 'prod_retail_iphone_15',
    masterProductId: 'master_iphone_15_pro_max',
    storeId: 'vendor_apple_authorized',
    storeName: 'Gadget & Gear Official',
    type: 'retail',
    tradeMode: 'retail',
    subCategory: 'brand',
    title: 'Apple iPhone 15 Pro Max - Natural Titanium',
    description: 'A17 Pro chip with 6-core GPU, Pro camera system, and USB-C. Official Apple warranty.',
    price: 185000.00,
    rating: 4.9,
    reviewsCount: 150,
    deliveryEta: '2-3 Days',
    proximityDistance: '3.5 km',
    imageUrl: '/src/assets/images/paikarmart_iphone_15_pro_max_1794490099283.jpg',
    galleryImages: ['/src/assets/images/paikarmart_samsung_phone_1794489802379.jpg'],
    brand: 'Apple',
    specifications: { Storage: '256 GB', Display: '6.7-inch OLED', Connectivity: '5G / USB-C' },
    variantOptions: [
      { id: 'storage', label: 'Storage', values: ['256 GB', '512 GB'] },
      { id: 'color', label: 'Color', values: ['Natural Titanium', 'Blue Titanium', 'Black Titanium'] }
    ],
    highlights: ['Official Apple warranty', 'Pro camera system', 'Titanium design', 'Fast 5G delivery'],
    warrantyLabel: '2-year official warranty',
    category: 'Electronics',
    inStock: true,
    badge: 'Official Warranty'
  },
  {
    id: 'prod_retail_soybean_oil',
    storeId: 'vendor_city_group',
    storeName: 'City Mart',
    type: 'retail',
    tradeMode: 'retail',
    subCategory: 'nearby',
    title: 'Rupchanda Fortified Soybean Oil - 5 Litre',
    description: 'Enriched with Vitamin A and D. Heart-healthy and premium quality oil.',
    price: 840.00,
    rating: 4.8,
    reviewsCount: 1200,
    deliveryEta: '30 min',
    proximityDistance: '0.5 km',
    imageUrl: '/src/assets/images/paikarmart_soybean_oil_5l_1794490111555.jpg',
    brand: 'Rupchanda',
    specifications: { Volume: '5 Litre', Type: 'Fortified Soybean Oil', Delivery: '30 minutes nearby' },
    highlights: ['Vitamin A and D enriched', 'Sealed original pack', 'Nearby same-day delivery'],
    category: 'Grocery',
    variantOptions: [
      { id: 'volume', label: 'Volume', values: ['1 Litre', '2 Litre', '5 Litre'] }
    ],
    inStock: true,
    badge: 'Best Seller'
  },
  {
    id: 'prod_retail_vision_tv',
    storeId: 'vendor_rfl_best_buy',
    storeName: 'Vision Official Gallery',
    type: 'retail',
    tradeMode: 'retail',
    subCategory: 'brand',
    title: 'Vision 43" Google Android Smart LED TV - G3S',
    description: '4K resolution, voice control, and built-in apps. Official warranty included.',
    price: 32500.00,
    rating: 4.7,
    reviewsCount: 450,
    deliveryEta: 'Next Day',
    proximityDistance: '2.8 km',
    imageUrl: '/src/assets/images/paikarmart_smart_tv_43_1794490138186.jpg',
    brand: 'Vision',
    specifications: { Screen: '43-inch 4K', Platform: 'Google Android TV', Warranty: 'Official brand warranty' },
    highlights: ['4K resolution', 'Voice control', 'Built-in streaming apps'],
    category: 'Electronics',
    inStock: true,
    badge: 'Popular'
  },

  // --- REAL WHOLESALE PRODUCTS ---
  {
    id: 'prod_wholesale_shirts_01',
    storeId: 'vendor_moscovium',
    storeName: 'Moscovium Wholesale Hub',
    type: 'wholesale',
    tradeMode: 'wholesale',
    subCategory: 'factory',
    title: 'Premium Slim Fit Formal Shirts (Wholesale Pack of 50)',
    description: 'High-quality cotton blend, various sizes and colors. Perfect for retail boutiques.',
    price: 450.00,
    minWholesaleQty: 50,
    wholesaleTiers: [
      { minQty: 50, pricePerUnit: 450.00 },
      { minQty: 200, pricePerUnit: 410.00 },
      { minQty: 500, pricePerUnit: 380.00 }
    ],
    rating: 4.9,
    reviewsCount: 85,
    deliveryEta: '3-5 Days',
    imageUrl: '/src/assets/images/paikarmart_formal_shirts_wholesale_1794490125051.jpg',
    variantOptions: [
      { id: 'size', label: 'Size mix', values: ['S-M-L-XL', 'M-L-XL-2XL', 'Custom size mix'] },
      { id: 'color', label: 'Color mix', values: ['Black & White', 'Navy & Grey', 'Custom colors'] }
    ],
    category: 'Apparel',
    inStock: true,
    badge: 'Top Wholesale'
  },
  {
    id: 'prod_wholesale_lentils_01',
    storeId: 'vendor_akij_group',
    storeName: 'Akij Commodities Wholesale',
    type: 'wholesale',
    tradeMode: 'wholesale',
    subCategory: 'factory',
    title: 'Muskan Premium Red Lentils (Masur Dal) - 50kg Bag',
    description: 'Sorted, polished, and moisture-controlled export quality lentils.',
    price: 115.00, // per kg
    minWholesaleQty: 10, // 10 bags of 50kg
    wholesaleTiers: [
      { minQty: 10, pricePerUnit: 115.00 },
      { minQty: 50, pricePerUnit: 112.00 },
      { minQty: 100, pricePerUnit: 108.00 }
    ],
    rating: 4.8,
    reviewsCount: 62,
    deliveryEta: '2-4 Days',
    imageUrl: '/src/assets/images/paikarmart_red_lentils_wholesale_1794490151453.jpg',
    category: 'Grocery',
    variantOptions: [
      { id: 'pack', label: 'Pack size', values: ['Pack of 3', 'Pack of 6'] }
    ],
    inStock: true,
    badge: 'Essential'
  },

  // --- EXISTING PRODUCTS ---
  {
    id: 'prod_retail_brand_01',
    masterProductId: 'master_samsung_s24_ultra',
    storeId: 'vendor_samsung',
    storeName: 'Samsung Official Brand Shop',
    type: 'retail',
    tradeMode: 'retail',
    subCategory: 'brand',
    title: 'Samsung Galaxy S24 Ultra - Titanium Gray',
    description: 'Direct from brand store with 2-year official warranty and certified original seal.',
    price: 1299.00,
    rating: 4.9,
    reviewsCount: 240,
    deliveryEta: 'Same Day',
    proximityDistance: '1.2 km',
    imageUrl: '/src/assets/images/paikarmart_samsung_phone_1794489802379.jpg',
    variantOptions: [
      { id: 'storage', label: 'Storage', values: ['256 GB', '512 GB', '1 TB'] },
      { id: 'color', label: 'Color', values: ['Titanium Gray', 'Titanium Black', 'Titanium Violet'] }
    ],
    category: 'Electronics',
    inStock: true,
    badge: 'Brand Official'
  },
  {
    id: 'prod_retail_nearby_01',
    masterProductId: 'master_hass_avocados',
    storeId: 'vendor_corner_mart',
    storeName: 'Green Valley Local Mart',
    type: 'retail',
    tradeMode: 'retail',
    subCategory: 'nearby',
    title: 'Organic Hass Avocados (Pack of 3)',
    description: 'Freshly stocked this morning from local organic farms.',
    price: 5.50,
    rating: 4.8,
    reviewsCount: 85,
    deliveryEta: '15 min',
    proximityDistance: '0.4 km',
    imageUrl: '/src/assets/images/paikarmart_fresh_grocery_1794489814176.jpg',
    category: 'Grocery',
    inStock: true,
    badge: 'Nearest'
  },
  {
    id: 'prod_retail_homemade_01',
    storeId: 'vendor_sarah_kitchen',
    storeName: 'Sarah\'s Artisan Bakery',
    type: 'retail',
    tradeMode: 'retail',
    subCategory: 'homemade',
    title: 'Sourdough Country Loaf (Freshly Baked)',
    description: 'Hand-kneaded with 48-hour slow fermentation. Zero preservatives.',
    price: 8.00,
    rating: 5.0,
    reviewsCount: 112,
    deliveryEta: '30 min',
    proximityDistance: '2.1 km',
    imageUrl: '/src/assets/images/paikarmart_artisan_bakery_1794489890831.jpg',
    category: 'Bakery',
    inStock: true,
    badge: 'Homemade'
  },
  {
    id: 'prod_retail_pharmacy_01',
    storeId: 'vendor_city_meds',
    storeName: 'City Care Pharmacy',
    type: 'retail',
    tradeMode: 'retail',
    subCategory: 'pharmacy',
    title: 'Emergency First Aid Kit (Travel Size)',
    description: 'Compact kit with essential medical supplies for hiking and travel.',
    price: 24.99,
    rating: 4.7,
    reviewsCount: 45,
    deliveryEta: '20 min',
    proximityDistance: '0.8 km',
    imageUrl: '/src/assets/images/paikarmart_ac_service_1794489851598.jpg', // AC service tech for health/tech feel or replace with better
    category: 'Health',
    inStock: true,
    badge: 'Pharmacy'
  },

  // --- WHOLESALE HUB ---
  {
    id: 'prod_wholesale_factory_01',
    storeId: 'vendor_textile_mill',
    storeName: 'Standard Garments Factory',
    type: 'wholesale',
    tradeMode: 'wholesale',
    subCategory: 'factory',
    title: 'Cotton Crew Neck T-Shirts (Bulk Case 100pcs)',
    description: '180 GSM pre-shrunk cotton. Mix colors available. Direct from factory floor.',
    price: 2.80,
    minWholesaleQty: 100,
    wholesaleTiers: [
      { minQty: 100, pricePerUnit: 2.80 },
      { minQty: 500, pricePerUnit: 2.45 },
      { minQty: 1000, pricePerUnit: 2.10 }
    ],
    rating: 4.9,
    reviewsCount: 32,
    deliveryEta: '5-7 Days',
    imageUrl: '/src/assets/images/paikarmart_garment_wholesale_1794489826754.jpg',
    category: 'Apparel',
    inStock: true,
    badge: 'Direct Factory'
  },
  {
    id: 'prod_wholesale_exporter_01',
    storeId: 'vendor_global_trade',
    storeName: 'Asia-Pacific Export House',
    type: 'wholesale',
    tradeMode: 'wholesale',
    subCategory: 'exporter',
    title: 'Premium Jasmine Rice (20 Metric Ton Container)',
    description: 'Grade A long grain rice. Export quality certified. FOB Pricing.',
    price: 480.00,
    minWholesaleQty: 20,
    rating: 4.8,
    reviewsCount: 15,
    deliveryEta: '14-21 Days',
    imageUrl: '/src/assets/images/paikarmart_rice_wholesale_1794489840098.jpg',
    category: 'Agri-Bulk',
    inStock: true,
    badge: 'Exporter'
  },
  {
    id: 'prod_wholesale_importer_01',
    storeId: 'vendor_pacific_electronics',
    storeName: 'Pacific Rim Direct Importers',
    type: 'wholesale',
    tradeMode: 'wholesale',
    subCategory: 'importer',
    title: 'Fast-Charging USB-C Braided Cables (Carton of 250 pcs)',
    description: 'High-speed 65W PD braided cables, factory boxed in master packaging. Direct import batch from Shenzhen.',
    price: 1.65,
    minWholesaleQty: 50,
    wholesaleTiers: [
      { minQty: 50, pricePerUnit: 1.65 },
      { minQty: 250, pricePerUnit: 1.35 },
      { minQty: 1000, pricePerUnit: 1.15 }
    ],
    rating: 4.9,
    reviewsCount: 48,
    deliveryEta: '2-3 Days',
    imageUrl: '/src/assets/images/paikarmart_electronics_wholesale_1794489877741.jpg',
    category: 'Electronics',
    inStock: true,
    badge: 'Direct Importer'
  },
  {
    id: 'prod_wholesale_dealer_01',
    storeId: 'vendor_apex_hardware',
    storeName: 'Bengal Industrial Hardware Supply',
    type: 'wholesale',
    tradeMode: 'wholesale',
    subCategory: 'dealer',
    title: 'Commercial Heavy-Duty Tool Sets (Crate of 20 Sets)',
    description: 'Cr-V alloy steel ratchet sets in shockproof molded cases. Authorized nationwide distributor wholesale pricing.',
    price: 38.50,
    minWholesaleQty: 10,
    wholesaleTiers: [
      { minQty: 10, pricePerUnit: 38.50 },
      { minQty: 50, pricePerUnit: 34.00 },
      { minQty: 100, pricePerUnit: 29.50 }
    ],
    rating: 4.7,
    reviewsCount: 19,
    deliveryEta: '3-4 Days',
    imageUrl: '/src/assets/images/paikarmart_ac_service_1794489851598.jpg',
    category: 'Hardware',
    inStock: true,
    badge: 'Authorized Dealer'
  },

  // --- SERVICES HUB ---
  {
    id: 'prod_service_ac_01',
    storeId: 'vendor_cool_tech',
    storeName: 'CoolMaster AC Repairs',
    type: 'service',
    subCategory: 'repair',
    title: 'Split AC Deep Cleaning & Gas Refill',
    description: 'Certified technicians with high-pressure jet cleaning and vacuuming.',
    price: 45.00,
    rating: 4.9,
    reviewsCount: 420,
    deliveryEta: 'Today',
    proximityDistance: '0.6 km',
    imageUrl: '/src/assets/images/paikarmart_ac_service_1794489851598.jpg',
    category: 'Home Services',
    inStock: true,
    badge: 'Verified Pro'
  },
  {
    id: 'prod_service_salon_01',
    storeId: 'vendor_style_bar',
    storeName: 'Groom & Glow Salon',
    type: 'service',
    subCategory: 'salon',
    title: 'Premium Haircut & Beard Grooming',
    description: 'Luxury grooming experience with hot towel treatment.',
    price: 35.00,
    rating: 4.8,
    reviewsCount: 890,
    deliveryEta: 'Slot at 4:00 PM',
    proximityDistance: '0.3 km',
    imageUrl: '/src/assets/images/paikarmart_ac_service_1794489851598.jpg', // Generic service image or generate salon
    category: 'Beauty',
    inStock: true,
    badge: 'Nearest'
  },

  // --- RIDE SHARE HUB ---
  {
    id: 'prod_ride_bike_01',
    storeId: 'vendor_moto_express',
    storeName: 'Express Moto',
    type: 'rides',
    subCategory: 'bike',
    title: 'Moto Rider Pickup',
    description: 'Fastest urban transit. Single passenger with helmet.',
    price: 0.85, // per km
    rating: 4.7,
    reviewsCount: 2400,
    deliveryEta: '2 min',
    proximityDistance: '0.2 km',
    imageUrl: '/src/assets/images/paikarmart_bike_ride_1794489864569.jpg',
    category: 'Transport',
    inStock: true,
    badge: 'Quickest'
  },
  {
    id: 'prod_ride_pickup_01',
    storeId: 'vendor_load_haul',
    storeName: 'LoadHaul Logistics',
    type: 'rides',
    subCategory: 'pickup',
    title: 'Small Pickup / Mini Truck Hire',
    description: 'Ideal for furniture delivery or light logistics moving.',
    price: 12.00, // base fare
    rating: 4.9,
    reviewsCount: 310,
    deliveryEta: '10 min',
    proximityDistance: '1.5 km',
    imageUrl: '/src/assets/images/paikarmart_bike_ride_1794489864569.jpg',
    category: 'Logistics',
    inStock: true,
    badge: 'Commercial'
  }
];

export const INITIAL_POSTS: SocialPost[] = [
  {
    id: 'post_demand_01',
    authorId: 'usr_maya',
    authorName: 'Maya Lin',
    authorAvatar: 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?auto=format&fit=crop&w=120&h=120&q=80',
    timestamp: '15m ago',
    content: 'Looking for a reliable plumber in the downtown area who can fix a leak today. Need someone available within 2 hours! #PlumberNeeded #BuyingRequest',
    postType: 'demand',
    reactionsCount: { like: 12, love: 2, care: 1 },
    sharesCount: 5,
    comments: []
  },
  {
    id: 'post_sale_01',
    authorId: 'usr_carlos',
    authorName: 'Carlos Vega',
    authorAvatar: 'https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?auto=format&fit=crop&w=120&h=120&q=80',
    timestamp: '1h ago',
    content: 'Selling my gently used mechanical keyboard. Switches are Brown, great condition. $45 OBO. DM me if interested! #UsedItems #ForSale',
    postType: 'sale',
    mediaUrl: '/src/assets/images/paikarmart_electronics_wholesale_1794489877741.jpg',
    reactionsCount: { like: 24, love: 5, care: 0 },
    sharesCount: 2,
    comments: []
  },
  {
    id: 'post_regular_01',
    authorId: 'vendor_samsung',
    authorName: 'Samsung Official Shop',
    authorAvatar: 'https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?auto=format&fit=crop&w=150&h=150&q=80',
    authorVerified: true,
    timestamp: '3h ago',
    content: 'The new S24 Ultra is redefining mobile intelligence. Order today for same-day delivery through our PaikarMart portal!',
    postType: 'regular',
    mediaUrl: '/src/assets/images/paikarmart_samsung_phone_1794489802379.jpg',
    taggedProduct: {
      id: 'prod_retail_brand_01',
      title: 'Samsung Galaxy S24 Ultra',
      price: 1299.00,
      image: '/src/assets/images/paikarmart_samsung_phone_1794489802379.jpg',
      category: 'Electronics',
      storeName: 'Samsung Official Shop',
      type: 'retail'
    },
    reactionsCount: { like: 1450, love: 420, care: 55 },
    sharesCount: 88,
    comments: []
  }
];

export const INITIAL_RIDE_OPTIONS: RideOption[] = [
  {
    id: 'ride_01',
    tier: 'Economy',
    name: 'Volt Eco Express',
    description: 'Compact EV sedan, fastest nearby driver',
    baseFare: 4.50,
    perKm: 1.85,
    estimatedMinutes: 3,
    seats: 4,
    imageUrl: '/src/assets/images/paikarmart_bike_ride_1794489864569.jpg'
  },
  {
    id: 'ride_02',
    tier: 'Comfort',
    name: 'Volt Premier SUV',
    description: 'Spacious electric SUV, premium air & charger',
    baseFare: 7.00,
    perKm: 2.65,
    estimatedMinutes: 5,
    seats: 5,
    imageUrl: '/src/assets/images/paikarmart_bike_ride_1794489864569.jpg'
  },
  {
    id: 'ride_03',
    tier: 'Express Bike',
    name: 'City Moto Courier',
    description: 'Fast single-rider or parcel package delivery',
    baseFare: 2.50,
    perKm: 1.15,
    estimatedMinutes: 2,
    seats: 1,
    imageUrl: '/src/assets/images/paikarmart_bike_ride_1794489864569.jpg'
  }
];

export const INITIAL_CREATOR_POSTS: CreatorContent[] = [
  {
    id: 'creator_01',
    creatorName: 'Elena Rostova',
    creatorAvatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=150&h=150&q=80',
    creatorHandle: '@elenacreative',
    verified: true,
    title: 'How I Scaled My Wholesale Electronics Store to $45,000/mo on NexSphere',
    previewText: 'A breakdown of finding verified overseas suppliers, calculating logistics margins, and using NexSphere Facebook feed tags to drive B2B volume orders...',
    fullContent: 'Full 14-page comprehensive master guide covering supplier inspection checklists, tariff codes, automated re-ordering rules, and proven product tag conversions. Includes Excel margin calculator download and direct supplier directory.',
    isPremium: true,
    unlockPrice: 4.99,
    isUnlocked: false,
    likes: 624,
    tipsReceived: 42,
    timestamp: '3h ago',
    admobBannerSlot: true
  },
  {
    id: 'creator_02',
    creatorName: 'Chef Antoine Laurent',
    creatorAvatar: 'https://images.unsplash.com/photo-1583394838336-acd977736f90?auto=format&fit=crop&w=150&h=150&q=80',
    creatorHandle: '@cheflaurant',
    verified: true,
    title: 'Mastering the Perfect Cast-Iron Smashed Patty with Homemade Brioche',
    previewText: 'The secret to high-heat sear crusts, proper fat-to-lean ratios (80/20 brisket blend), and 12-hour fermented potato buns...',
    fullContent: 'Free community recipe and step-by-step video breakdown for home cooks and restaurant popups.',
    isPremium: false,
    likes: 1280,
    tipsReceived: 18,
    timestamp: '6h ago',
    mediaUrl: '/src/assets/images/paikarmart_artisan_bakery_1794489890831.jpg'
  }
];

export const INITIAL_ORDERS: Order[] = [
  {
    id: 'ORD-948271',
    createdAt: new Date(Date.now() - 3600000 * 2).toISOString(),
    items: [
      {
        product: INITIAL_COMMERCE_ITEMS[0], // Samsung Galaxy S24 Ultra
        quantity: 1,
        isWholesale: false,
      }
    ],
    subtotal: 1299.00,
    deliveryFee: 15.00,
    tax: 103.92,
    total: 1417.92,
    status: 'in_transit',
    deliveryAddress: '742 Evergreen Terrace, San Francisco, CA',
    paymentMethod: 'Credit / Debit Card',
    estimatedArrival: 'Today by 5:30 PM (25 mins away)',
    trackingStep: 3,
  },
  {
    id: 'ORD-839210',
    createdAt: new Date(Date.now() - 86400000 * 2).toISOString(),
    items: [
      {
        product: INITIAL_COMMERCE_ITEMS[1], // Organic Hass Avocados
        quantity: 2,
        isWholesale: false,
      },
      {
        product: INITIAL_COMMERCE_ITEMS[2], // Sourdough Country Loaf
        quantity: 1,
        isWholesale: false,
      }
    ],
    subtotal: 19.00,
    deliveryFee: 3.50,
    tax: 1.52,
    total: 24.02,
    status: 'delivered',
    deliveryAddress: '742 Evergreen Terrace, San Francisco, CA',
    paymentMethod: 'Mobile Wallet (bKash/Venmo)',
    estimatedArrival: 'Delivered safely at doorstep',
    trackingStep: 4,
  }
];

