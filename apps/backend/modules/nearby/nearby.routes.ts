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

// Base nearby shops catalog
const BASE_NEARBY_SHOPS = [
  {
    id: 'store-food-01',
    name: 'সুলতান ডাইন চিলিং কিচেন (Food)',
    avatar: 'https://images.unsplash.com/photo-1555396273-367ea4eb4db5?w=100&h=100&fit=crop',
    coverImage: 'https://images.unsplash.com/photo-1555396273-367ea4eb4db5?w=800&h=400&fit=crop',
    rating: 4.9,
    reviewCount: 3400,
    activeProductsCount: 85,
    isVerified: true,
    category: 'Food',
    storeType: 'food',
    serviceRadiusKm: 5.0,
    prepTimeMinutes: 15,
    lat: 23.8120,
    lng: 90.4135,
    address: 'বাড়ি ৮, রোড ১১, বনানী, ঢাকা'
  },
  {
    id: 'store-groc-02',
    name: 'স্বপ্ন এক্সপ্রেস গ্রোসারি (Grocery)',
    avatar: 'https://images.unsplash.com/photo-1542838132-92c53300491e?w=100&h=100&fit=crop',
    coverImage: 'https://images.unsplash.com/photo-1542838132-92c53300491e?w=800&h=400&fit=crop',
    rating: 4.8,
    reviewCount: 2150,
    activeProductsCount: 650,
    isVerified: true,
    category: 'Grocery',
    storeType: 'grocery',
    serviceRadiusKm: 4.0,
    prepTimeMinutes: 10,
    lat: 23.8150,
    lng: 90.4160,
    address: 'ব্লক ডি, বসুন্ধরা আর/এ, ঢাকা'
  },
  {
    id: '1',
    name: 'Dhaka Wholesale Central',
    avatar: 'https://images.unsplash.com/photo-1534723452862-4c874018d66d?w=100&h=100&fit=crop',
    coverImage: 'https://images.unsplash.com/photo-1534723452862-4c874018d66d?w=800&h=400&fit=crop',
    rating: 4.8,
    reviewCount: 1240,
    activeProductsCount: 450,
    isVerified: true,
    category: 'Wholesale',
    storeType: 'wholesale',
    serviceRadiusKm: 8.0,
    prepTimeMinutes: 30,
    lat: 23.8203,
    lng: 90.4225,
    address: '১২/এ, ধানমন্ডি, ঢাকা'
  },
  {
    id: '2',
    name: 'Tech Haven Electronics',
    avatar: 'https://images.unsplash.com/photo-1550009158-9ebf69173e03?w=100&h=100&fit=crop',
    coverImage: 'https://images.unsplash.com/photo-1550009158-9ebf69173e03?w=800&h=400&fit=crop',
    rating: 4.5,
    reviewCount: 850,
    activeProductsCount: 1200,
    isVerified: true,
    category: 'Electronics',
    storeType: 'retail',
    serviceRadiusKm: 6.0,
    prepTimeMinutes: 20,
    lat: 23.7950,
    lng: 90.4320,
    address: 'মাল্টিপ্ল্যান সেন্টার, এলিফ্যান্ট রোড'
  },
  {
    id: '3',
    name: 'Green Groceries Local',
    avatar: 'https://images.unsplash.com/photo-1542838132-92c53300491e?w=100&h=100&fit=crop',
    coverImage: 'https://images.unsplash.com/photo-1542838132-92c53300491e?w=800&h=400&fit=crop',
    rating: 4.9,
    reviewCount: 3200,
    activeProductsCount: 150,
    isVerified: true,
    category: 'Food',
    storeType: 'food',
    serviceRadiusKm: 4.5,
    prepTimeMinutes: 12,
    lat: 23.8153,
    lng: 90.4075,
    address: 'কারওয়ান বাজার, ঢাকা'
  }
];

// 1. GET Nearby stores with GPS Geofencing radius (e.g., within 5km) and instant delivery ETA
router.get('/', async (req, res) => {
  try {
    const { lat, lng, radius, category, openOnly } = req.query;

    // User GPS Coordinates (defaults to central Dhaka if not permitted)
    const userLat = lat ? parseFloat(lat as string) : 23.8103;
    const userLng = lng ? parseFloat(lng as string) : 90.4125;
    const maxGeofenceRadius = radius ? parseFloat(radius as string) : 5.0; // Default 5km geofence

    let computedShops = BASE_NEARBY_SHOPS.map(shop => {
      const distanceKm = calculateHaversineDistanceKm(userLat, userLng, shop.lat, shop.lng);
      const isStoreOpen = dynamicStoresState[shop.id] !== undefined ? dynamicStoresState[shop.id] : true;

      // Estimated Instant Delivery Time = Preparation Time + (Distance * 3.5 minutes transit per km)
      const transitMinutes = Math.ceil(distanceKm * 3.5);
      const totalEstimatedMinutes = (shop.prepTimeMinutes || 15) + transitMinutes;
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
    });

    // Filter by Geofencing radius (within 5km by default)
    computedShops = computedShops.filter(s => s.distance <= maxGeofenceRadius);

    // Optional category filter
    if (category) {
      computedShops = computedShops.filter(s => s.category.toLowerCase() === (category as string).toLowerCase());
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

// 2. Store Status Toggle (Open / Closed)
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
            author: { name: 'Farhana Ahmed', isVerified: true, role: 'Resident' },
            content: 'Does anyone know if the local community center is open for badminton today? 🏸',
            type: 'update',
            location: 'Mirpur DOHS',
            timestamp: '2 hours ago',
            stats: { likes: 12, comments: 4, shares: 1 },
            tags: ['Sports', 'Community']
        },
        {
            id: 'p2',
            author: { name: 'Electrician Karim', isVerified: true, role: 'Service Provider' },
            content: 'Available for AC servicing and electrical repairs in Mirpur 10 area today. Fast response guaranteed! ⚡',
            type: 'update',
            location: 'Mirpur 10',
            timestamp: '4 hours ago',
            stats: { likes: 25, comments: 8, shares: 5 },
            tags: ['Service', 'Electrician']
        }
    ];
    res.json({ status: 'success', data: posts });
});

router.get('/services', (req, res) => {
    const services = [
        {
            id: 's1',
            name: 'Master Electrician',
            category: 'Electrical',
            provider: 'Karim Uddin',
            rating: 4.9,
            reviews: 156,
            price: 'From ৳200',
            availability: 'Available Now',
            image: 'https://images.unsplash.com/photo-1621905251189-08b45d6a269e?w=400&q=80',
            isVerified: true
        }
    ];
    res.json({ status: 'success', data: services });
});

router.get('/events', (req, res) => {
    const events = [
        {
            id: 'e1',
            title: 'Mirpur Community Cricket Tournament',
            date: 'July 15, 2026',
            time: '9:00 AM',
            location: 'Mirpur Stadium Grounds',
            organizer: 'Local Sports Club',
            attendees: 124,
            image: 'https://images.unsplash.com/photo-1531415074968-036ba1b575da?w=600&q=80',
            category: 'Sports'
        }
    ];
    res.json({ status: 'success', data: events });
});

export const nearbyRoutes = router;
