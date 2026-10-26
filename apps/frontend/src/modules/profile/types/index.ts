import type { AppRole } from '@/config/roles.config.ts';

export type FeedItemType = 'post' | 'photo' | 'product' | 'demand' | 'bid' | 'service' | 'ride' | 'video' | 'job' | 'news';
export type UserRole = AppRole;

export interface UserProfile {
  id: string;
  name: string;
  handle: string;
  avatarUrl: string;
  coverUrl: string;
  role: UserRole;
  isVerified: boolean;
  bio?: string;
  location?: string;
  rating?: number;
  reviewCount?: number;
  followersCount?: number;
  followingCount?: number;
  walletBalance?: number;
  loyaltyCoins?: number;
}

// Compatibility types for other modules
export interface SocialProfile extends UserProfile {
  username: string; // compatibility
}

export interface FeedItem {
  id: string;
  type: FeedItemType;
  content?: string;
  imageUrl?: string;
  timestamp: string;
  likes: number;
  comments: number;
  product?: {
    id: string;
    title: string;
    price: number;
    imageUrl: string;
    category?: string;
    enLabel?: string;
    bnLabel?: string;
  };
}

export interface SellerStore {
  id: string;
  ownerId: string;
  storeName: string;
  slug: string;
  category: 'Retail' | 'Wholesale' | 'Hyperlocal' | 'Service' | 'Digital' | 'Export';
  avatarUrl: string;
  coverUrl: string;
  rating: number;
  reviewCount: number;
  totalSales: number;
  responseTimeMinutes: number;
  location: string;
  isVerified: boolean;
  followersCount: number;
  bio: string;
  policies?: {
    return?: string;
    delivery?: string;
    warranty?: string;
  };
}

export interface ProfileProduct {
  id: string;
  storeId: string;
  title: string;
  titleBn?: string;
  price: number;
  originalPrice?: number;
  moq: number;
  stock: number;
  category: string;
  image: string;
  images: string[];
  isService?: boolean;
}
