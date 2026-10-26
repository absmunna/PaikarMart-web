export type PostType = "Product" | "Service" | "Demand" | "Wholesale" | "Retail" | "Regular";

export interface Post {
  id: string;
  type: PostType;
  authorId: string;
  sellerName: string;
  isVerified: boolean;
  location: string;
  content: string;
  price: string;
  rating: string;
  soldCount: string;
  image: string;
  category: string;
  createdAt: string;
  likes: number;
  comments: number;
  commentsCount?: number;
  commentsList?: any[];
  isLiked?: boolean;
  originalPrice?: string;
  discount?: string;
  stock?: string;
  timestamp?: string;
  title?: string;
  description?: string;
  mediaUrl?: string;
}

export interface ProductCardItem {
  id: string;
  name?: string;
  title: string;
  price: number;
  originalPrice?: number | null;
  discount?: number;
  category?: string;
  moq?: number;
  stock?: number;
  rating?: number;
  reviewCount?: number;
  soldCount?: number;
  image: string;
  images?: string[];
  seller?: {
    id: string;
    name: string;
    storeName: string;
    slug?: string;
    location: string;
    district?: string;
    division?: string;
    isVerified?: boolean;
    rating?: number;
  };
}

export interface ReviewItem {
  id: string;
  authorName: string;
  verifiedBuyer: boolean;
  rating: number;
  text: string;
  timestamp: string;
  images?: string[];
}

export interface FeedPost {
  id: string;
  type?: string;
  sellerId: string;
  sellerName: string;
  storeName: string;
  slug?: string;
  avatarUrl: string;
  location: string;
  district?: string;
  division?: string;
  isVerified: boolean;
  isFollowing?: boolean;
  followersCount?: number;
  createdAt: string;
  content: string;
  tags?: string[];
  mediaType: 'image' | 'video' | 'carousel';
  mediaUrls: string[];
  videoUrl?: string | null;
  product?: ProductCardItem | null;
  stats: {
    likes: number;
    comments: number;
    shares?: number;
    saves?: number;
  };
  userInteractions?: {
    isLiked?: boolean;
    isSaved?: boolean;
    isFollowing?: boolean;
  };
  reviews?: ReviewItem[];
}
