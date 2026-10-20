import { prisma, db } from '../../config/database';

export interface GeoLocation {
  latitude: number;
  longitude: number;
  address?: string;
}

export interface HyperlocalStoreData {
  id: string;
  storeName: string;
  slug: string;
  storeType: 'food' | 'grocery' | 'retail' | 'wholesale' | 'service' | 'digital';
  category: string;
  avatarUrl: string;
  bannerUrl: string;
  address: string;
  latitude: number;
  longitude: number;
  serviceRadiusKm: number;
  isOpen: boolean;
  estimatedPrepMinutes: number;
  rating: number;
  reviewCount: number;
  isVerified: boolean;
  followersCount: number;
}

export interface GeofenceCalculationResult {
  storeId: string;
  storeName: string;
  storeType: string;
  isOpen: boolean;
  userDistanceKm: number;
  serviceRadiusKm: number;
  isWithinGeofence: boolean;
  isInstantDeliveryAvailable: boolean;
  estimatedPrepMinutes: number;
  transitMinutes: number;
  totalEstimatedDeliveryMinutes: number;
  etaFormatted: string;
  deliveryFee: number;
}

// In-memory persistent state for store toggles in development/mock mode
const STORE_STATUS_REGISTRY: Record<string, boolean> = {
  'store-food-01': true,
  'store-groc-02': true,
  'store-pharm-03': true,
  'store-bakery-04': true,
  '1': true,
  '2': true,
  '3': true
};

const DEFAULT_HYPERLOCAL_STORES: HyperlocalStoreData[] = [
  {
    id: 'store-food-01',
    storeName: 'সুলতান ডাইন চিলিং কিচেন (Food)',
    slug: 'sultans-dine-banani',
    storeType: 'food',
    category: 'রেস্টুরেন্ট ও ফুড',
    avatarUrl: 'https://images.unsplash.com/photo-1555396273-367ea4eb4db5?w=100&h=100&fit=crop',
    bannerUrl: 'https://images.unsplash.com/photo-1555396273-367ea4eb4db5?w=800&h=400&fit=crop',
    address: 'বাড়ি ৮, রোড ১১, বনানী, ঢাকা',
    latitude: 23.8120,
    longitude: 90.4135,
    serviceRadiusKm: 5.0,
    isOpen: true,
    estimatedPrepMinutes: 18,
    rating: 4.9,
    reviewCount: 3400,
    isVerified: true,
    followersCount: 12500
  },
  {
    id: 'store-groc-02',
    storeName: 'স্বপ্ন এক্সপ্রেস গ্রোসারি (Grocery)',
    slug: 'shwapno-express-bashundhara',
    storeType: 'grocery',
    category: 'ডেইলি গ্রোসারি ও ফলমূল',
    avatarUrl: 'https://images.unsplash.com/photo-1542838132-92c53300491e?w=100&h=100&fit=crop',
    bannerUrl: 'https://images.unsplash.com/photo-1542838132-92c53300491e?w=800&h=400&fit=crop',
    address: 'ব্লক ডি, বসুন্ধরা আর/এ, ঢাকা',
    latitude: 23.8150,
    longitude: 90.4160,
    serviceRadiusKm: 4.5,
    isOpen: true,
    estimatedPrepMinutes: 10,
    rating: 4.8,
    reviewCount: 2150,
    isVerified: true,
    followersCount: 8900
  },
  {
    id: 'store-pharm-03',
    storeName: 'লাজ ফার্মা এক্সপ্রেস (Medicine)',
    slug: 'lazz-pharma-express',
    storeType: 'grocery',
    category: 'জরুরি ওষুধ ও ফার্মেসি',
    avatarUrl: 'https://images.unsplash.com/photo-1587854692152-cbe660dbde88?w=100&h=100&fit=crop',
    bannerUrl: 'https://images.unsplash.com/photo-1587854692152-cbe660dbde88?w=800&h=400&fit=crop',
    address: 'রোড ৭, সেক্টর ৩, উত্তরা, ঢাকা',
    latitude: 23.8180,
    longitude: 90.4110,
    serviceRadiusKm: 6.0,
    isOpen: true,
    estimatedPrepMinutes: 8,
    rating: 4.9,
    reviewCount: 1820,
    isVerified: true,
    followersCount: 6200
  },
  {
    id: 'store-bakery-04',
    storeName: 'বেকিং স্ট্রিট আর্টিশানাল বেকারি',
    slug: 'baking-street-gulshan',
    storeType: 'food',
    category: 'বেকারি ও মিষ্টি',
    avatarUrl: 'https://images.unsplash.com/photo-1509440159596-0249088772ff?w=100&h=100&fit=crop',
    bannerUrl: 'https://images.unsplash.com/photo-1509440159596-0249088772ff?w=800&h=400&fit=crop',
    address: 'গুলশান ২ সার্কেল, ঢাকা',
    latitude: 23.7925,
    longitude: 90.4180,
    serviceRadiusKm: 4.0,
    isOpen: true,
    estimatedPrepMinutes: 12,
    rating: 4.7,
    reviewCount: 940,
    isVerified: true,
    followersCount: 4300
  }
];

export class HyperlocalEngineService {
  /**
   * Calculates precise distance between two GPS coordinates using the Haversine formula
   */
  static calculateDistanceKm(lat1: number, lon1: number, lat2: number, lon2: number): number {
    const R = 6371; // Earth's radius in kilometers
    const dLat = (lat2 - lat1) * (Math.PI / 180);
    const dLon = (lon2 - lon1) * (Math.PI / 180);
    const a =
      Math.sin(dLat / 2) * Math.sin(dLat / 2) +
      Math.cos(lat1 * (Math.PI / 180)) * Math.cos(lat2 * (Math.PI / 180)) *
      Math.sin(dLon / 2) * Math.sin(dLon / 2);
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
    return parseFloat((R * c).toFixed(2));
  }

  /**
   * Calculates Instant Delivery ETA & transit time
   * Transit speed assumption in dense urban traffic: ~3.5 minutes per km + prep time
   */
  static calculateInstantDeliveryEta(prepMinutes: number, distanceKm: number): {
    prepMinutes: number;
    transitMinutes: number;
    totalMinutes: number;
    etaFormatted: string;
    deliveryFee: number;
  } {
    const transitMinutes = Math.max(5, Math.ceil(distanceKm * 3.5));
    const totalMinutes = prepMinutes + transitMinutes;
    const minRange = Math.max(10, totalMinutes - 3);
    const maxRange = totalMinutes + 5;
    
    // Dynamic delivery fee calculation (Base ৳40 + ৳12 per km after first 2km)
    const baseFee = 40;
    const additionalKm = Math.max(0, distanceKm - 2);
    const deliveryFee = Math.round(baseFee + (additionalKm * 12));

    return {
      prepMinutes,
      transitMinutes,
      totalMinutes,
      etaFormatted: `${minRange}-${maxRange} মিনিট`,
      deliveryFee
    };
  }

  /**
   * Verifies if a user's location falls within a specific store's geofence
   */
  static async checkGeofence(
    storeId: string,
    userLocation: GeoLocation
  ): Promise<GeofenceCalculationResult> {
    const store = await this.getStoreById(storeId);
    if (!store) {
      throw new Error(`Store with ID ${storeId} not found`);
    }

    const distanceKm = this.calculateDistanceKm(
      userLocation.latitude,
      userLocation.longitude,
      store.latitude,
      store.longitude
    );

    const isWithinGeofence = distanceKm <= store.serviceRadiusKm;
    const isStoreOpen = this.isStoreOpen(store.id, store.isOpen);

    const eta = this.calculateInstantDeliveryEta(store.estimatedPrepMinutes, distanceKm);

    return {
      storeId: store.id,
      storeName: store.storeName,
      storeType: store.storeType,
      isOpen: isStoreOpen,
      userDistanceKm: distanceKm,
      serviceRadiusKm: store.serviceRadiusKm,
      isWithinGeofence,
      isInstantDeliveryAvailable: isWithinGeofence && isStoreOpen,
      estimatedPrepMinutes: store.estimatedPrepMinutes,
      transitMinutes: eta.transitMinutes,
      totalEstimatedDeliveryMinutes: eta.totalMinutes,
      etaFormatted: isStoreOpen ? eta.etaFormatted : 'দোকান বর্তমানে বন্ধ',
      deliveryFee: eta.deliveryFee
    };
  }

  /**
   * Retrieves stores within geofence radius (default 5.0 km) sorted by proximity
   */
  static async getNearbyStores(
    userLocation: GeoLocation,
    options: {
      maxRadiusKm?: number;
      category?: string;
      storeType?: string;
      openOnly?: boolean;
    } = {}
  ): Promise<{
    stores: Array<HyperlocalStoreData & { distanceKm: number; eta: string; isOpen: boolean; isInstantEligible: boolean; deliveryFee: number }>;
    meta: {
      userLocation: GeoLocation;
      maxRadiusKm: number;
      totalFound: number;
      instantDeliveryEnabled: boolean;
    };
  }> {
    const maxRadius = options.maxRadiusKm || 5.0; // Default 5km geofencing radius
    const allStores = await this.getAllStores();

    let computedList = allStores.map(store => {
      const distanceKm = this.calculateDistanceKm(
        userLocation.latitude,
        userLocation.longitude,
        store.latitude,
        store.longitude
      );
      const isStoreOpen = this.isStoreOpen(store.id, store.isOpen);
      const eta = this.calculateInstantDeliveryEta(store.estimatedPrepMinutes, distanceKm);
      const isWithinGeofence = distanceKm <= (store.serviceRadiusKm || maxRadius);

      return {
        ...store,
        isOpen: isStoreOpen,
        distanceKm,
        eta: isStoreOpen ? eta.etaFormatted : 'বন্ধ রয়েছে',
        deliveryFee: eta.deliveryFee,
        isInstantEligible: isStoreOpen && isWithinGeofence
      };
    });

    // Apply geofence filter (within 5km by default)
    computedList = computedList.filter(s => s.distanceKm <= maxRadius);

    if (options.storeType) {
      computedList = computedList.filter(s => s.storeType.toLowerCase() === options.storeType?.toLowerCase());
    }

    if (options.category) {
      computedList = computedList.filter(s => s.category.toLowerCase().includes(options.category!.toLowerCase()));
    }

    if (options.openOnly) {
      computedList = computedList.filter(s => s.isOpen);
    }

    // Sort by proximity
    computedList.sort((a, b) => a.distanceKm - b.distanceKm);

    return {
      stores: computedList,
      meta: {
        userLocation,
        maxRadiusKm: maxRadius,
        totalFound: computedList.length,
        instantDeliveryEnabled: true
      }
    };
  }

  /**
   * Toggle store status (Open / Closed)
   */
  static async toggleStoreStatus(storeId: string, isOpen: boolean): Promise<{
    storeId: string;
    isOpen: boolean;
    message: string;
  }> {
    STORE_STATUS_REGISTRY[storeId] = !!isOpen;

    if (db.isConnected()) {
      try {
        await prisma.sellerStore.updateMany({
          where: { id: storeId },
          data: { isOpen: !!isOpen }
        });
      } catch (err) {
        console.warn('DB update failed, using in-memory state:', err);
      }
    }

    return {
      storeId,
      isOpen: !!isOpen,
      message: `স্টোরের স্ট্যাটাস সফলভাবে আপডেট করা হয়েছে: ${isOpen ? 'খোলা (Open)' : 'বন্ধ (Closed)'}`
    };
  }

  private static isStoreOpen(storeId: string, defaultOpen: boolean): boolean {
    if (STORE_STATUS_REGISTRY[storeId] !== undefined) {
      return STORE_STATUS_REGISTRY[storeId];
    }
    return defaultOpen;
  }

  private static async getAllStores(): Promise<HyperlocalStoreData[]> {
    if (db.isConnected()) {
      try {
        const stores = await prisma.sellerStore.findMany({
          where: {
            storeType: { in: ['food', 'grocery', 'retail'] }
          }
        });
        if (stores && stores.length > 0) {
          return stores.map((s: any) => ({
            id: s.id,
            storeName: s.storeName,
            slug: s.slug || `store-${s.id}`,
            storeType: (s.storeType || 'retail') as any,
            category: s.storeType === 'food' ? 'Food & Restaurant' : 'Grocery & Daily Needs',
            avatarUrl: s.avatarUrl || 'https://images.unsplash.com/photo-1542838132-92c53300491e?w=100&h=100&fit=crop',
            bannerUrl: s.bannerUrl || 'https://images.unsplash.com/photo-1542838132-92c53300491e?w=800&h=400&fit=crop',
            address: s.address || 'ঢাকা, বাংলাদেশ',
            latitude: s.latitude || 23.8103,
            longitude: s.longitude || 90.4125,
            serviceRadiusKm: s.serviceRadiusKm || 5.0,
            isOpen: s.isOpen !== false,
            estimatedPrepMinutes: s.estimatedPrepMinutes || 15,
            rating: s.rating || 4.8,
            reviewCount: s.reviewCount || 100,
            isVerified: s.isVerified !== false,
            followersCount: s.followersCount || 500
          }));
        }
      } catch (err) {
        console.warn('Failed to fetch stores from DB, using defaults:', err);
      }
    }
    return DEFAULT_HYPERLOCAL_STORES;
  }

  private static async getStoreById(storeId: string): Promise<HyperlocalStoreData | null> {
    const all = await this.getAllStores();
    return all.find(s => s.id === storeId) || null;
  }
}
