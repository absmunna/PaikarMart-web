import { Router } from 'express';
import { prisma, db } from '../../config/database';

const router = Router();

// Haversine formula to calculate accurate great-circle distance between two GPS coordinates in kilometers
export function calculateHaversineDistanceKm(lat1: number, lon1: number, lat2: number, lon2: number): number {
  const R = 6371; // Earth radius in km
  const dLat = (lat2 - lat1) * (Math.PI / 180);
  const dLon = (lon2 - lon1) * (Math.PI / 180);
  const a =
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos(lat1 * (Math.PI / 180)) * Math.cos(lat2 * (Math.PI / 180)) *
    Math.sin(dLon / 2) * Math.sin(dLon / 2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  return parseFloat((R * c).toFixed(2));
}

// In-memory store state for reactive status toggle in development mode
let dynamicStoresState: Record<string, boolean> = {
  '1': true,
  '2': true,
  '3': true,
  'store-food-01': true,
  'store-groc-02': true
};

// Base nearby shops catalog with complete inventory and store profiles
const BASE_NEARBY_SHOPS = [
  {
    id: 'shop-01',
    name: 'আলম সুপার শপ ও অর্গানিক গ্রোসারি',
    avatar: 'https://images.unsplash.com/photo-1542838132-92c53300491e?w=200&h=200&fit=crop',
    coverImage: 'https://images.unsplash.com/photo-1542838132-92c53300491e?w=1200&h=600&fit=crop',
    rating: 4.8,
    reviewCount: 320,
    activeProductsCount: 145,
    isVerified: true,
    category: 'Grocery',
    categoryBn: 'মুদি ও গ্রোসারি',
    storeType: 'grocery',
    serviceRadiusKm: 6.0,
    prepTimeMinutes: 10,
    lat: 23.8070,
    lng: 90.3685,
    address: 'রোড ৩, ব্লক বি, মিরপুর-১০, ঢাকা',
    phone: '+880 1711-234567',
    whatsapp: '+880 1711-234567',
    openingHours: 'সকাল ৮:০০ - রাত ১১:০০',
    deliveryFee: 30,
    minOrder: 100,
    freeDeliveryThreshold: 600,
    categories: ['সব পণ্য', 'দুগ্ধজাত ও ডিম', 'চাল ও ডাল', 'তেল ও মসলা', 'স্ন্যাকস ও পানীয়', 'অর্গানিক সবজি'],
    popularItems: [
      { id: 'item-01', name: 'দেশি গরুর খাঁটি দুধ (১ লিটার)', category: 'দুগ্ধজাত ও ডিম', price: 95, originalPrice: 105, unit: '১ লিটার', image: 'https://images.unsplash.com/photo-1550583724-b2692b85b150?w=400', stock: 45, description: 'প্রতিদিন সকালে সরাসরি খামার থেকে সংগৃহীত নির্ভেজাল ও খাঁটি দুধ।' },
      { id: 'item-02', name: 'অর্গানিক ফার্ম ডিম (১ ডজন)', category: 'দুগ্ধজাত ও ডিম', price: 145, originalPrice: 155, unit: '১২ পিস', image: 'https://images.unsplash.com/photo-1582722872445-44dc5f7e3c8f?w=400', stock: 120, description: 'পুষ্টিকর লাল ও বাদামি দেশি কোয়ালিটি ডিম।' },
      { id: 'item-03', name: 'চিনিগুঁড়া পোলাও চাল (১ কেজি)', category: 'চাল ও ডাল', price: 135, originalPrice: 150, unit: '১ কেজি', image: 'https://images.unsplash.com/photo-1586201375761-83865001e31c?w=400', stock: 80, description: 'সুগন্ধি দিনাজপুরের ঐতিহ্যবাহী চিনিগুঁড়া চাল।' },
      { id: 'item-03b', name: 'তীর সয়াবিন তেল (৫ লিটার)', category: 'তেল ও মসলা', price: 890, originalPrice: 920, unit: '৫ লিটার বোতল', image: 'https://images.unsplash.com/photo-1474979266404-7eaacbcd87c5?w=400', stock: 35, description: 'ভিটামিন এ সমৃদ্ধ বিশুদ্ধ ভোজ্য তেল।' },
      { id: 'item-03c', name: 'প্রাণ খাঁটি সরিষার তেল (৫০০ মিলি)', category: 'তেল ও মসলা', price: 175, originalPrice: 190, unit: '৫০০ মিলি', image: 'https://images.unsplash.com/photo-1474979266404-7eaacbcd87c5?w=400', stock: 60, description: 'ঘানির আসল ঝাঁঝালো সরিষার তেল।' },
      { id: 'item-03d', name: 'রাধুনী গুঁড়া হলুদ ও মরিচ কম্বো', category: 'তেল ও মসলা', price: 140, originalPrice: 160, unit: '২০০ গ্রাম x ২', image: 'https://images.unsplash.com/photo-1596040033229-a9821ebd058d?w=400', stock: 50, description: 'আসল রঙের প্রাকৃতিক মশলা প্যাক।' }
    ]
  },
  {
    id: 'shop-02',
    name: 'মডার্ন ফার্মা ও হেলথকেয়ার পয়েন্ট',
    avatar: 'https://images.unsplash.com/photo-1586015555751-63bb77f4322a?w=200&h=200&fit=crop',
    coverImage: 'https://images.unsplash.com/photo-1586015555751-63bb77f4322a?w=1200&h=600&fit=crop',
    rating: 4.9,
    reviewCount: 215,
    activeProductsCount: 890,
    isVerified: true,
    category: 'Pharmacy',
    categoryBn: 'ফার্মেসি ও স্বাস্থ্যসেবা',
    storeType: 'pharmacy',
    serviceRadiusKm: 7.0,
    prepTimeMinutes: 8,
    lat: 23.8055,
    lng: 90.3700,
    address: 'সেনপাড়া পর্বতা, মিরপুর-১০, ঢাকা',
    phone: '+880 1819-334455',
    whatsapp: '+880 1819-334455',
    openingHours: '২৪ ঘণ্টা খোলা (24 Hours Open)',
    deliveryFee: 25,
    minOrder: 50,
    freeDeliveryThreshold: 500,
    categories: ['সব পণ্য', 'ওটিসি ও জরুরি ঔষধ', 'বেবি কেয়ার', 'হাইজিন ও ফার্স্ট এইড', 'ডায়াবেটিস ও টেস্ট কিট'],
    popularItems: [
      { id: 'item-04', name: 'নাপা এক্সট্রা ৫০ প্যাক', category: 'ওটিসি ও জরুরি ঔষধ', price: 125, originalPrice: 130, unit: '৫০ ট্যাবলেট', image: 'https://images.unsplash.com/photo-1584308666744-24d5c474f2ae?w=400', stock: 200, description: 'প্যারাসিটামল ও ক্যাফেইন সমৃদ্ধ দ্রুত ব্যথানাশক।' },
      { id: 'item-05', name: 'হ্যান্ড স্যানিটাইজার ৫০০ মিলি', category: 'হাইজিন ও ফার্স্ট এইড', price: 180, originalPrice: 210, unit: '৫০০ মিলি', image: 'https://images.unsplash.com/photo-1584515979956-d9f6e5d09982?w=400', stock: 75, description: '৯৯.৯% জীবাণু ধ্বংসকারী ইনস্ট্যান্ট স্যানিটাইজার।' },
      { id: 'item-06', name: 'ডিজিটাল থার্মোমিটার', category: 'ডায়াবেটিস ও টেস্ট কিট', price: 290, originalPrice: 350, unit: '১ পিস', image: 'https://images.unsplash.com/photo-1588776814546-1ffcf47267a5?w=400', stock: 40, description: 'দ্রুত এবং নিখুঁত শরীরের তাপমাত্রা পরিমাপক যন্ত্র।' },
      { id: 'item-06b', name: 'স্যাভলন অ্যান্টিসেপটিক লিকুইড', category: 'হাইজিন ও ফার্স্ট এইড', price: 115, originalPrice: 125, unit: '২৫০ মিলি', image: 'https://images.unsplash.com/photo-1584515979956-d9f6e5d09982?w=400', stock: 90, description: 'ক্ষত পরিষ্কার ও জীবাণুমুক্ত করার জন্য কার্যকর।' },
      { id: 'item-06c', name: 'হাগিস বেবি ডায়াপার (লার্জ)', category: 'বেবি কেয়ার', price: 1150, originalPrice: 1250, unit: '৪৮ পিস প্যাক', image: 'https://images.unsplash.com/photo-1515488042361-ee00e0ddd4e4?w=400', stock: 30, description: '১২ ঘণ্টার ড্রাই প্রটেকশনসহ কমফোর্ট ডায়াপার।' }
    ]
  },
  {
    id: 'shop-03',
    name: 'ঢাকা কাচ্চি ঘর ও রেস্তোরাঁ',
    avatar: 'https://images.unsplash.com/photo-1563379091339-03b21ab4a4f8?w=200&h=200&fit=crop',
    coverImage: 'https://images.unsplash.com/photo-1563379091339-03b21ab4a4f8?w=1200&h=600&fit=crop',
    rating: 4.7,
    reviewCount: 580,
    activeProductsCount: 42,
    isVerified: true,
    category: 'Food',
    categoryBn: 'রেস্টুরেন্ট ও খাবার',
    storeType: 'food',
    serviceRadiusKm: 5.0,
    prepTimeMinutes: 18,
    lat: 23.8080,
    lng: 90.3650,
    address: 'মিরপুর স্টেডিয়াম রোড, ঢাকা',
    phone: '+880 1912-778899',
    whatsapp: '+880 1912-778899',
    openingHours: 'দুপুর ১২:০০ - রাত ১১:০০',
    deliveryFee: 40,
    minOrder: 150,
    freeDeliveryThreshold: 800,
    categories: ['সব খাবার', 'বিরিয়ানি ও কাচ্চি', 'কাবাব ও রোস্ট', 'পানীয় ও ডেজার্ট'],
    popularItems: [
      { id: 'item-07', name: 'বাসমতী খাসির কাচ্চি বিরিয়ানি', category: 'বিরিয়ানি ও কাচ্চি', price: 380, originalPrice: 420, unit: '১ প্লেট ফুল', image: 'https://images.unsplash.com/photo-1563379091339-03b21ab4a4f8?w=400', stock: 100, description: 'আসল জাফরানি বাসমতী চাল ও নরম খাসির মাংসের ঐতিহ্যবাহী কাচ্চি।' },
      { id: 'item-08', name: 'স্পেশাল বোরহানি ২৫০ মিলি', category: 'পানীয় ও ডেজার্ট', price: 60, originalPrice: 70, unit: '২৫০ মিলি', image: 'https://images.unsplash.com/photo-1513558161293-cdaf765ed2fd?w=400', stock: 150, description: 'দই ও বিশেষ মসলায় প্রস্তুত খাঁটি ঢাকাইয়া বোরহানি।' },
      { id: 'item-09', name: 'চিকেন রোস্ট লেগ পিস', category: 'কাবাব ও রোস্ট', price: 150, originalPrice: 170, unit: '১ পিস', image: 'https://images.unsplash.com/photo-1598515214211-89d3c73ae83b?w=400', stock: 80, description: 'ঘিয়ে ভাজা বাদামি রঙের বিয়ে বাড়ির স্বাদের চিকেন রোস্ট।' },
      { id: 'item-09b', name: 'শাহী ফিরনি মাটির পাত্রে', category: 'পানীয় ও ডেজার্ট', price: 75, originalPrice: 90, unit: '১ বাটি', image: 'https://images.unsplash.com/photo-1589119908995-c6837fa14d48?w=400', stock: 65, description: 'জাফরান ও কাজুবাদামে ভরপুর মাটির পাত্রে জমানো ফিরনি।' }
    ]
  },
  {
    id: 'shop-04',
    name: 'দেশি গ্যাজেট অ্যান্ড মোবাইল হাব',
    avatar: 'https://images.unsplash.com/photo-1550009158-9ebf69173e03?w=200&h=200&fit=crop',
    coverImage: 'https://images.unsplash.com/photo-1550009158-9ebf69173e03?w=1200&h=600&fit=crop',
    rating: 4.6,
    reviewCount: 142,
    activeProductsCount: 320,
    isVerified: true,
    category: 'Electronics',
    categoryBn: 'ইলেকট্রনিক্স ও গ্যাজেট',
    storeType: 'retail',
    serviceRadiusKm: 8.0,
    prepTimeMinutes: 15,
    lat: 23.8060,
    lng: 90.3690,
    address: 'মিরপুর শপিং সেন্টার, লেভেল ২',
    phone: '+880 1670-112233',
    whatsapp: '+880 1670-112233',
    openingHours: 'সকাল ১০:০০ - রাত ৯:০০',
    deliveryFee: 50,
    minOrder: 150,
    freeDeliveryThreshold: 1000,
    categories: ['সব পণ্য', 'চার্জার ও ক্যাবল', 'পাওয়ার ব্যাংক', 'হেডফোন ও ইয়ারবাডস'],
    popularItems: [
      { id: 'item-10', name: 'ফাস্ট চার্জিং টাইপ-সি ক্যাবল (৬৫W)', category: 'চার্জার ও ক্যাবল', price: 190, originalPrice: 250, unit: '১ মিটার', image: 'https://images.unsplash.com/photo-1583863788434-e58a36330cf0?w=400', stock: 60, description: 'ব্রেইডেড মজবুত নাইলন ক্যাবল ও ফাস্ট ডেটা ট্রান্সফার।' },
      { id: 'item-11', name: '১০,০০০ mAh ফাস্ট পাওয়ারব্যাংক', category: 'পাওয়ার ব্যাংক', price: 1150, originalPrice: 1350, unit: '২২.৫W ফাস্ট চার্জ', image: 'https://images.unsplash.com/photo-1609592424109-dd9892f1b177?w=400', stock: 25, description: 'ডুয়েল আউটপুট ও এলইডি পাওয়ার ইন্ডিকেটর।' },
      { id: 'item-11b', name: 'ওয়্যারলেস ব্লুটুথ ইয়ারবাডস', category: 'হেডফোন ও ইয়ারবাডস', price: 850, originalPrice: 990, unit: '১ সেট', image: 'https://images.unsplash.com/photo-1590658268037-6bf12165a8df?w=400', stock: 40, description: 'ক্রিস্টাল ক্লিয়ার কল কোয়ালিটি ও ডিপ ব্যাস।' }
    ]
  },
  {
    id: 'shop-05',
    name: 'মিষ্টি মেলা ও বেকারি কনফেকশনারি',
    avatar: 'https://images.unsplash.com/photo-1578985545062-69928b1d9587?w=200&h=200&fit=crop',
    coverImage: 'https://images.unsplash.com/photo-1578985545062-69928b1d9587?w=1200&h=600&fit=crop',
    rating: 4.8,
    reviewCount: 280,
    activeProductsCount: 75,
    isVerified: true,
    category: 'Bakery',
    categoryBn: 'বেকারি ও মিষ্টি',
    storeType: 'food',
    serviceRadiusKm: 5.5,
    prepTimeMinutes: 10,
    lat: 23.8110,
    lng: 90.3640,
    address: 'পল্লবী মেইন রোড, মিরপুর, ঢাকা',
    phone: '+880 1722-556677',
    whatsapp: '+880 1722-556677',
    openingHours: 'সকাল ৮:০০ - রাত ১০:৩০',
    deliveryFee: 30,
    minOrder: 120,
    freeDeliveryThreshold: 700,
    categories: ['সব মিষ্টি ও বেকারি', 'মিষ্টির সম্ভার', 'বিস্কুট ও কুকিজ', 'কেক ও পেস্ট্রি'],
    popularItems: [
      { id: 'item-12', name: 'স্পঞ্জ রসগোল্লা ১ কেজি বক্স', category: 'মিষ্টির সম্ভার', price: 320, originalPrice: 350, unit: '১ কেজি বক্স', image: 'https://images.unsplash.com/photo-1589119908995-c6837fa14d48?w=400', stock: 35, description: 'ছানার নরম ও রসালো ঐতিহ্যবাহী স্পঞ্জ রসগোল্লা।' },
      { id: 'item-13', name: 'বাটার কুকিজ ২৫০ গ্রাম', category: 'বিস্কুট ও কুকিজ', price: 160, originalPrice: 180, unit: '২৫০ গ্রাম বক্স', image: 'https://images.unsplash.com/photo-1558961363-fa8fdf82db35?w=400', stock: 55, description: 'খাঁটি মাখনে বেক করা ক্রিস্পি ও সুস্বাদু কুকিজ।' }
    ]
  },
  {
    id: 'shop-06',
    name: 'টাটকা ফ্রুটস ও ভেজিটেবল কর্নার',
    avatar: 'https://images.unsplash.com/photo-1610832958506-aa56368176cf?w=200&h=200&fit=crop',
    coverImage: 'https://images.unsplash.com/photo-1610832958506-aa56368176cf?w=1200&h=600&fit=crop',
    rating: 4.7,
    reviewCount: 190,
    activeProductsCount: 110,
    isVerified: true,
    category: 'Grocery',
    categoryBn: 'তাজা ফল ও কাঁচাবাজার',
    storeType: 'grocery',
    serviceRadiusKm: 4.5,
    prepTimeMinutes: 8,
    lat: 23.8075,
    lng: 90.3695,
    address: 'মিরপুর-১০ কাঁচাবাজার, ঢাকা',
    phone: '+880 1933-445566',
    whatsapp: '+880 1933-445566',
    openingHours: 'সকাল ৭:০০ - রাত ১০:০০',
    deliveryFee: 25,
    minOrder: 80,
    freeDeliveryThreshold: 500,
    categories: ['সব কাঁচাবাজার', 'তাজা ফলমূল', 'শাকসবজি', 'সালাদ ও লেবু'],
    popularItems: [
      { id: 'item-14', name: 'রাজশাহীর মিষ্টি আম্রপালি আম', category: 'তাজা ফলমূল', price: 120, originalPrice: 140, unit: '১ কেজি', image: 'https://images.unsplash.com/photo-1553279768-865429fa0078?w=400', stock: 70, description: 'ফরমালিনমুক্ত গাছপাকা মিষ্টি রসালো আম্রপালি আম।' },
      { id: 'item-15', name: 'দেশি শসা ও কাগজি লেবু প্যাক', category: 'সালাদ ও লেবু', price: 80, originalPrice: 95, unit: '৫০০ গ্রাম + ৪ পিস', image: 'https://images.unsplash.com/photo-1449339854873-750e6913301b?w=400', stock: 45, description: 'প্রতিদিন সকালের ফ্রেশ কাটিং সালাদ প্যাকেজ।' }
    ]
  }
];

// Helper to calculate shop distance and delivery ETA
function enrichShopWithDistance(shop: any, userLat: number, userLng: number, maxGeofenceRadius: number) {
  const distanceKm = calculateHaversineDistanceKm(userLat, userLng, shop.lat, shop.lng);
  const isStoreOpen = dynamicStoresState[shop.id] !== undefined ? dynamicStoresState[shop.id] : true;
  const transitMinutes = Math.max(5, Math.ceil(distanceKm * 3.5));
  const totalEstimatedMinutes = (shop.prepTimeMinutes || 12) + transitMinutes;
  const etaFormatted = `${totalEstimatedMinutes - 3}-${totalEstimatedMinutes + 5} মিনিট`;
  const isWithinGeofence = distanceKm <= (shop.serviceRadiusKm || maxGeofenceRadius);

  return {
    ...shop,
    isOpen: isStoreOpen,
    distance: distanceKm,
    deliveryTime: etaFormatted,
    estimatedDeliveryMinutes: totalEstimatedMinutes,
    isInstantDeliveryEligible: isStoreOpen && isWithinGeofence,
    geofenceRadiusKm: shop.serviceRadiusKm || maxGeofenceRadius,
    isWithinGeofence
  };
}

// 1. GET Nearby stores with GPS Geofencing radius (e.g., within 5km) and instant delivery ETA
router.get('/', async (req, res) => {
  try {
    const { lat, lng, radius, category, openOnly } = req.query;
    
    // User GPS Coordinates (defaults to central Dhaka if not permitted)
    const userLat = lat ? parseFloat(lat as string) : 23.8103;
    const userLng = lng ? parseFloat(lng as string) : 90.4125;
    const maxGeofenceRadius = radius ? parseFloat(radius as string) : 8.0;

    let computedShops = BASE_NEARBY_SHOPS.map(shop => 
      enrichShopWithDistance(shop, userLat, userLng, maxGeofenceRadius)
    );

    // If geofence radius was specified, apply filter
    if (radius) {
      computedShops = computedShops.filter(s => s.distance <= maxGeofenceRadius);
    }

    // Optional category filter
    if (category && category !== 'all') {
      computedShops = computedShops.filter(s => 
        s.category.toLowerCase() === (category as string).toLowerCase() ||
        s.storeType.toLowerCase() === (category as string).toLowerCase()
      );
    }

    // Optional open-only filter
    if (openOnly === 'true') {
      computedShops = computedShops.filter(s => s.isOpen);
    }

    // Sort by proximity
    computedShops.sort((a, b) => a.distance - b.distance);

    res.json({
      status: 'success',
      data: computedShops,
      meta: {
        userLocation: { lat: userLat, lng: userLng },
        geofenceRadiusKm: maxGeofenceRadius,
        count: computedShops.length,
        instantDeliveryGuaranteed: true
      }
    });
  } catch (error) {
    console.error('Nearby Stores Error:', error);
    res.status(500).json({ error: 'Failed to query nearby stores' });
  }
});

// Alias for /shops
router.get('/shops', async (req, res) => {
  try {
    const userLat = req.query.lat ? parseFloat(req.query.lat as string) : 23.8103;
    const userLng = req.query.lng ? parseFloat(req.query.lng as string) : 90.4125;
    const maxGeofenceRadius = req.query.radius ? parseFloat(req.query.radius as string) : 10.0;

    const computedShops = BASE_NEARBY_SHOPS.map(shop => 
      enrichShopWithDistance(shop, userLat, userLng, maxGeofenceRadius)
    );
    res.json({ status: 'success', data: computedShops });
  } catch (error) {
    res.status(500).json({ error: 'Failed to query shops' });
  }
});

// 2. GET Specific shop details with inventory catalog
router.get('/shops/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const userLat = req.query.lat ? parseFloat(req.query.lat as string) : 23.8103;
    const userLng = req.query.lng ? parseFloat(req.query.lng as string) : 90.4125;

    const shop = BASE_NEARBY_SHOPS.find(s => s.id === id);
    if (!shop) {
      return res.status(404).json({ status: 'error', message: 'দোকানটি পাওয়া যায়নি (Shop not found)' });
    }

    const enriched = enrichShopWithDistance(shop, userLat, userLng, 10.0);
    res.json({
      status: 'success',
      data: enriched
    });
  } catch (error) {
    console.error('Shop Detail Error:', error);
    res.status(500).json({ error: 'Failed to fetch shop details' });
  }
});

// Single id route fallback
router.get('/:id', async (req, res) => {
  const { id } = req.params;
  if (['feed', 'services', 'events', 'shops'].includes(id)) {
    return; // let other handlers process
  }
  const shop = BASE_NEARBY_SHOPS.find(s => s.id === id);
  if (shop) {
    const enriched = enrichShopWithDistance(shop, 23.8103, 90.4125, 10.0);
    return res.json({ status: 'success', data: enriched });
  }
  res.status(404).json({ status: 'error', message: 'Shop not found' });
});

// 3. Store Status Toggle (Open / Closed)
router.patch('/stores/:id/status', async (req, res) => {
  try {
    const { id } = req.params;
    const { isOpen } = req.body;

    if (isOpen === undefined) {
      return res.status(400).json({ error: 'isOpen boolean state is required' });
    }

    dynamicStoresState[id] = !!isOpen;

    if (db.isConnected()) {
      await prisma.sellerStore.updateMany({
        where: { id },
        data: { isOpen: !!isOpen }
      });
    }

    res.json({
      status: 'success',
      storeId: id,
      isOpen: !!isOpen,
      message: `দোকানের স্ট্যাটাস পরিবর্তন করা হয়েছে: ${isOpen ? 'খোলা (Open)' : 'বন্ধ (Closed)'}`
    });
  } catch (error) {
    console.error('Toggle Store Status Error:', error);
    res.status(500).json({ error: 'Failed to update store status' });
  }
});

router.get('/feed', (req, res) => {
    const posts = [
        {
            id: 'p1',
            author: { name: 'ফারহানা আহমেদ', isVerified: true, role: 'বাসিন্দা (Resident)' },
            content: 'আমাদের মিরপুর ১০ এলাকায় কোনো অর্গানিক দুধের নিয়মিত হোম ডেলিভারি সার্ভিস চালু আছে কি? থাকলে ইনবক্সে যোগাযোগ করবেন। 🥛',
            type: 'demand',
            location: 'মিরপুর-১০, ঢাকা',
            timestamp: '১ ঘণ্টা আগে',
            stats: { likes: 18, comments: 6, shares: 2 },
            tags: ['অর্গানিক', 'দুধ', 'হোম_ডেলিভারি']
        },
        {
            id: 'p2',
            author: { name: 'আলম সুপার শপ', isVerified: true, role: 'ভেরিফায়েড লোকাল শপ' },
            content: 'সুসংবাদ! আজ থেকে আলম সুপার শপে যেকোনো কাঁচাবাজার ও গ্রোসারি অর্ডারে ১৫-২৫ মিনিটে ফ্রি এক্সপ্রেস ডেলিভারি দিচ্ছি। 🛵⚡',
            type: 'update',
            location: 'ব্লক বি, মিরপুর',
            timestamp: '২ ঘণ্টা আগে',
            stats: { likes: 45, comments: 12, shares: 8 },
            tags: ['অফার', 'ফ্রি_ডেলিভারি', 'মুদি']
        },
        {
            id: 'p3',
            author: { name: 'ইলেকট্রিশিয়ান করিম ভাই', isVerified: true, role: 'দক্ষ সার্ভিস প্রোভাইডার' },
            content: 'মিরপুর ও পল্লবী এলাকায় এসি সার্ভিসিং ও ফ্যান মেরামতে জরুরি কল পেলেই ২০ মিনিটে উপস্থিত। সার্ভিস চার্জ মাত্র ২০০ টাকা। ⚡🛠️',
            type: 'update',
            location: 'পল্লবী ও মিরপুর',
            timestamp: '৩ ঘণ্টা আগে',
            stats: { likes: 32, comments: 9, shares: 4 },
            tags: ['সার্ভিস', 'মিস্ত্রি', 'এসি_মেরামত']
        }
    ];
    res.json({ status: 'success', data: posts });
});

router.get('/services', (req, res) => {
    const services = [
        {
            id: 's1',
            name: 'মাস্টার ইলেকট্রিশিয়ান ও এসি টেকনিশিয়ান',
            category: 'ইলেকট্রিক্যাল ও এসি',
            provider: 'করিম উদ্দিন মিস্ত্রি',
            rating: 4.9,
            reviews: 156,
            price: '৳২০০ থেকে শুরু',
            availability: 'এখনই এভেইলএবল (১৫ মিনিটে হাজির)',
            image: 'https://images.unsplash.com/photo-1621905251189-08b45d6a269e?w=400&q=80',
            isVerified: true,
            phone: '+880 1819-223344'
        },
        {
            id: 's2',
            name: 'প্ল্যাম্বিং ও স্যানিটারি মেরামত',
            category: 'স্যানিটারি ও পাইপ',
            provider: 'রফিক হোসেন',
            rating: 4.8,
            reviews: 94,
            price: '৳২৫০ থেকে শুরু',
            availability: 'সকাল ৮:০০ - রাত ১০:০০',
            image: 'https://images.unsplash.com/photo-1581092160607-ee22621dd758?w=400&q=80',
            isVerified: true,
            phone: '+880 1711-889900'
        },
        {
            id: 's3',
            name: 'বাসা পরিবর্তন ও লোডিং লেবার সার্ভিস',
            category: 'শিফটিং ও লজিস্টিক',
            provider: 'মিরপুর দ্রুত শিফটার্স',
            rating: 4.7,
            reviews: 112,
            price: '৳৫০০ থেকে শুরু',
            availability: '২৪ ঘণ্টা প্রি-বুকিং',
            image: 'https://images.unsplash.com/photo-1600585154340-be6161a56a0c?w=400&q=80',
            isVerified: true,
            phone: '+880 1922-334455'
        }
    ];
    res.json({ status: 'success', data: services });
});

router.get('/events', (req, res) => {
    const events = [
        {
            id: 'e1',
            title: 'মিরপুর সাপ্তাহিক তাজা কৃষক হাট',
            date: 'প্রতি শুক্রবার ও শনিবার',
            time: 'সকাল ৭:০০ - দুপুর ১২:০০',
            location: 'মিরপুর স্টেডিয়াম সংলগ্ন মাঠ',
            organizer: 'লোকাল ফার্মার্স অ্যাসোসিয়েশন',
            attendees: 350,
            image: 'https://images.unsplash.com/photo-1533900298318-6b8da08a523e?w=600&q=80',
            category: 'কৃষি ও হাট'
        },
        {
            id: 'e2',
            title: 'মহল্লা ব্লাড ডোনেশন ক্যাম্পেইন',
            date: 'আগামী রবিবার',
            time: 'সকাল ৯:০০ - বিকাল ৪:০০',
            location: 'মিরপুর-১০ কমিউনিটি সেন্টার',
            organizer: 'তারুণ্য ব্লাড ক্লাব',
            attendees: 180,
            image: 'https://images.unsplash.com/photo-1531415074968-036ba1b575da?w=600&q=80',
            category: 'সামাজিক উদ্যোগ'
        }
    ];
    res.json({ status: 'success', data: events });
});

export const nearbyRoutes = router;
