export type VideoCategoryType = 'creator' | 'seller_product' | 'vlog_premium';

export interface ProductLinkConfig {
  type: 'paikarmart' | 'daraz' | 'amazon' | 'website';
  url?: string;
  productId?: string;
  title?: string;
  price?: number;
  image?: string;
  storeName?: string;
}

export interface LinkedProduct {
  id: string;
  title: string;
  name?: string;
  price: number;
  originalPrice?: number;
  discount?: number;
  rating?: number;
  image: string;
  moq?: number;
  inStock?: boolean;
  category?: string;
  portal?: string;
}

export interface VideoCreator {
  id: string;
  name: string;
  handle?: string;
  avatar: string;
  verified: boolean;
  followers: string;
  location?: string;
  storeName?: string;
}

export interface VideoItem {
  id: string;
  title: string;
  description: string;
  videoUrl: string;
  thumbnail: string;
  duration?: string;
  durationSeconds?: number;
  views: string | number;
  likes: number;
  shares: number;
  commentsCount: number;
  createdAt: string;
  timeAgo?: string;
  
  // 3 Category System
  categoryType: VideoCategoryType; // 'creator' | 'seller_product' | 'vlog_premium'
  category: string; // e.g. 'কনটেন্ট ক্রিয়েটর (৩ মি:)', 'প্রোডাক্ট সেলিং (৩০-৬০ সে:)', 'পার্সোনাল ব্লগ ও পেড শো'
  
  // External source parsing (YouTube / Facebook / Direct)
  isExternalLink?: boolean;
  externalSource?: 'youtube' | 'facebook' | 'direct';
  embedUrl?: string;

  // Aspect Ratio (Direct uploads forced to 1:1, embedded videos use default ratio)
  aspectRatio?: '1:1' | '16:9' | '9:16';

  // Category 2: Product Link (PaikarMart / Daraz / Amazon / Website)
  productLinkConfig?: ProductLinkConfig;
  linkedProduct?: LinkedProduct;

  // Category 3: Paid Vlog Content
  isPaidContent?: boolean;
  priceAmount?: number; // e.g. 20 TK
  previewDurationSeconds?: number; // Default 30s free preview
  isUnlockedByCurrentUser?: boolean;

  isShort?: boolean;
  isLive?: boolean;
  creator: VideoCreator;
  tags: string[];
}

export interface VideoComment {
  id: string;
  videoId: string;
  authorName: string;
  authorAvatar: string;
  authorHandle?: string;
  content: string;
  timeAgo: string;
  likes: number;
  isLiked?: boolean;
}

export interface NestedVideoComment {
  id: string;
  videoId: string;
  parentId?: string | null;
  authorName: string;
  authorAvatar: string;
  authorRole?: string;
  content: string;
  timeAgo: string;
  createdAt?: string;
  likes: number;
  isLiked?: boolean;
  replies?: NestedVideoComment[];
}

export interface LiveChatMessage {
  id: string;
  user: string;
  avatar?: string;
  text: string;
  time: string;
  isSeller?: boolean;
}

export interface LiveStreamSession {
  id: string;
  title: string;
  host: VideoCreator;
  viewersCount: number;
  streamUrl: string;
  thumbnail: string;
  isLive: boolean;
  pinnedProduct?: LinkedProduct;
  startedAt: string;
  category: string;
  chatMessages: LiveChatMessage[];
}

export interface VideoCategory {
  id: string;
  labelBn: string;
  labelEn: string;
  iconName: string;
  categoryType?: VideoCategoryType;
  count?: number;
}

export interface VideoUploadPayload {
  title: string;
  description: string;
  categoryType: VideoCategoryType;
  category: string;
  videoUrl: string;
  thumbnail: string;
  isShort?: boolean;
  durationSeconds?: number;
  
  // Category 2 fields
  productLinkConfig?: ProductLinkConfig;
  linkedProductId?: string;

  // Category 3 fields
  isPaidContent?: boolean;
  priceAmount?: number;

  tags?: string[];
}

