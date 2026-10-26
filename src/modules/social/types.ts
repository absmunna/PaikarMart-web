export type FeedItemType = 'PRODUCT' | 'DEMAND' | 'BID' | 'NEWS' | 'RIDE' | 'SERVICE';
export type PortalDomain = 'RETAIL' | 'WHOLESALE' | 'LOCAL' | 'B2B' | 'SOCIAL' | 'SERVICES';

export interface FeedAuthor {
  id: string;
  name: string;
  avatar: string;
  isVerified?: boolean;
  role?: string;
}

export interface UnifiedFeedItem {
  id: string;
  type: FeedItemType;
  domain: PortalDomain;
  author: FeedAuthor;
  content: {
    title: string;
    description: string;
    media: string[];
    price?: number;
    currency?: string;
    location?: string;
    timestamp: string;
    tags?: string[];
    metadata?: Record<string, any>;
  };
  stats: {
    likes: number;
    comments: number;
    shares: number;
    views?: number;
  };
  interactions: {
    hasLiked: boolean;
    hasSaved: boolean;
  };
  cta: {
    label: string;
    action: string; // e.g., 'ADD_TO_CART', 'PLACE_BID', 'BOOK_NOW', 'READ_MORE'
    link?: string;
  };
}

export interface SocialState {
  items: UnifiedFeedItem[];
  customItems: UnifiedFeedItem[];
  isLoading: boolean;
  error: string | null;
  activeFilter: PortalDomain | 'ALL';
  selectedType: 'all' | 'wholesale' | 'retail' | 'grocery';
  selectedSector: 'all' | 'trending' | 'verified' | 'demands';
  viewMode: 'feed' | 'grid';
  city: string;
  isFilterOpen: boolean;
  isLocationDrawerOpen: boolean;
}

export interface SocialActions {
  fetchFeed: (filter?: PortalDomain | 'ALL') => Promise<void>;
  toggleLike: (postId: string) => void;
  addItem: (item: UnifiedFeedItem) => void;
  setFilter: (filter: PortalDomain | 'ALL') => void;
  setSelectedType: (type: 'all' | 'wholesale' | 'retail' | 'grocery') => void;
  setSelectedSector: (sector: 'all' | 'trending' | 'verified' | 'demands') => void;
  setViewMode: (mode: 'feed' | 'grid') => void;
  setCity: (city: string) => void;
  setIsFilterOpen: (open: boolean) => void;
  setIsLocationDrawerOpen: (open: boolean) => void;
}
