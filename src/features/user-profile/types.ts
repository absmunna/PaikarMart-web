import type { AppRole } from '@/config/roles.config.ts';

export type FeedItemType = 'post' | 'photo' | 'product' | 'demand' | 'bid' | 'service' | 'ride' | 'video' | 'job' | 'news';

export interface SocialProfile {
  id: string;
  name: string;
  username: string;
  avatarUrl: string;
  role: AppRole;
  isVerified: boolean;
  bio?: string;
  location?: string;
  joinedAt?: string;
}

export interface FeedProduct {
  id: string;
  title: string;
  price: number;
  imageUrl: string;
  description?: string;
  category?: string;
  enLabel?: string;
  bnLabel?: string;
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
