import { create } from 'zustand';
import { SocialState, SocialActions, UnifiedFeedItem, PortalDomain } from '../types';
import { MOCK_NEWS_ARTICLES } from '@modules/news';

const mapNewsToFeedItem = (news: any): UnifiedFeedItem => {
  let domain: PortalDomain = 'SOCIAL';
  if (news.category === 'wholesale') {
    domain = 'WHOLESALE';
  } else if (news.category === 'retail') {
    domain = 'RETAIL';
  }

  return {
    id: `news-${news.id}`,
    type: 'NEWS',
    domain,
    author: {
      id: `author-${news.id}`,
      name: news.author || 'Paikar Journalism',
      avatar: `https://ui-avatars.com/api/?name=${encodeURIComponent(news.author || 'Paikar News')}&background=047857&color=fff`,
      isVerified: true
    },
    content: {
      title: news.titleBn,
      description: news.summaryBn,
      media: news.imageUrl ? [news.imageUrl] : [],
      location: news.source,
      timestamp: news.publishedAt.includes('Today') 
        ? new Date().toISOString() 
        : news.publishedAt.includes('Yesterday') 
          ? new Date(Date.now() - 86400000).toISOString()
          : news.publishedAt.includes('3 days ago')
            ? new Date(Date.now() - 3 * 86400000).toISOString()
            : news.publishedAt.includes('4 days ago')
              ? new Date(Date.now() - 4 * 86400000).toISOString()
              : new Date(Date.now() - 7 * 86400000).toISOString(),
      metadata: {
        categoryLabelBn: news.categoryLabelBn,
        isPremium: news.isPremium,
        readTimeBn: news.readTimeBn,
        contentBn: news.contentBn,
        views: news.views,
        newsId: news.id
      }
    },
    stats: {
      likes: news.initialLikes,
      comments: 2,
      shares: 4,
      views: news.views
    },
    interactions: {
      hasLiked: false,
      hasSaved: false
    },
    cta: {
      label: 'বিস্তারিত পড়ুন',
      action: 'READ_NEWS',
      link: '/news'
    }
  };
};

export const useFeedStore = create<SocialState & SocialActions>((set, get) => ({
  items: [],
  customItems: [],
  isLoading: false,
  error: null,
  activeFilter: 'ALL',
  selectedType: 'all',
  selectedSector: 'all',
  viewMode: 'feed',
  city: 'Chattogram',
  isFilterOpen: false,
  isLocationDrawerOpen: false,

  setFilter: (filter) => set({ activeFilter: filter }),
  setSelectedType: (type) => set({ selectedType: type }),
  setSelectedSector: (sector) => set({ selectedSector: sector }),
  setViewMode: (mode) => set({ viewMode: mode }),
  setCity: (city) => set({ city: city }),
  setIsFilterOpen: (open) => set({ isFilterOpen: open }),
  setIsLocationDrawerOpen: (open) => set({ isLocationDrawerOpen: open }),

  fetchFeed: async () => {
    set({ isLoading: true });
    try {
      // In a real app, this would fetch from /api/v1/feed?filter=...
      await new Promise(resolve => setTimeout(resolve, 800));
      
      const { activeFilter, selectedSector, customItems } = get();
      
      const mockItems: UnifiedFeedItem[] = [
        {
          id: 'p1',
          type: 'PRODUCT',
          domain: 'RETAIL',
          author: {
            id: 'v1',
            name: 'Organic Greens BD',
            avatar: 'https://ui-avatars.com/api/?name=Organic+Greens&background=047857&color=fff',
            isVerified: true,
            role: 'seller'
          },
          content: {
            title: 'Fresh Organic Spinach (পালং শাক)',
            description: 'Directly from farm to your kitchen. Pesticide-free and fresh.',
            media: ['https://images.unsplash.com/photo-1576045057995-568f588f82fb?q=80&w=500'],
            price: 45,
            currency: 'BDT',
            location: 'Dhaka, Banani',
            timestamp: new Date().toISOString(),
            metadata: { weight: '250g' }
          },
          stats: { likes: 24, comments: 5, shares: 2 },
          interactions: { hasLiked: false, hasSaved: false },
          cta: { label: 'Add to Cart', action: 'ADD_TO_CART' }
        },
        {
          id: 'd1',
          type: 'DEMAND',
          domain: 'B2B',
          author: {
            id: 'u1',
            name: 'Karim Textiles',
            avatar: 'https://ui-avatars.com/api/?name=Karim+Textiles&background=1e40af&color=fff',
            role: 'business'
          },
          content: {
            title: 'Bulk Cotton Fabric Requirement',
            description: 'Looking for 5000 yards of premium cotton fabric for summer collection.',
            media: ['https://images.unsplash.com/photo-1524230572899-a752b3835840?q=80&w=500'],
            location: 'Narayanganj',
            timestamp: new Date(Date.now() - 3600000).toISOString(),
            metadata: { deadline: 'June 25, 2026' }
          },
          stats: { likes: 12, comments: 45, shares: 8 },
          interactions: { hasLiked: true, hasSaved: true },
          cta: { label: 'Submit Bid', action: 'PLACE_BID' }
        },
        {
          id: 'p1_logistics',
          type: 'RIDE',
          domain: 'SERVICES',
          author: {
            id: 'v1_rahman',
            name: 'রহমান ট্রেডার্স',
            avatar: 'https://ui-avatars.com/api/?name=Rahman+Traders&background=0284c7&color=fff',
            isVerified: true,
            role: 'seller'
          },
          content: {
            title: 'পিকআপ রিকোয়েস্ট: পোশাক - ২০০ পিস',
            description: 'ঢাকা (ইসলামপুর) থেকে বগুড়া সদর। ওজন: ৮০ কেজি, গাড়ির ধরন: পিকআপ। কমিশন: ৬৫০ টাকা। দ্রুত পিকআপের জন্য যোগাযোগ করুন।',
            media: [],
            location: 'ইসলামপুর, ঢাকা',
            timestamp: new Date(Date.now() - 7200000).toISOString(),
            metadata: { urgency: 'High', price: 650, vehicle: 'pickup' }
          },
          stats: { likes: 3, comments: 1, shares: 0 },
          interactions: { hasLiked: false, hasSaved: false },
          cta: { label: 'Accept Pickup', action: 'BOOK_NOW' }
        }
      ];

      const newsItems = MOCK_NEWS_ARTICLES.map(mapNewsToFeedItem);
      let combinedItems = [...customItems, ...mockItems, ...newsItems];

      // 1. Filter by Domain (Domain Navbar)
      if (activeFilter !== 'ALL') {
        combinedItems = combinedItems.filter(i => i.domain === activeFilter);
      }

      // 2. Filter by Sector (Sub-Navbar)
      if (selectedSector === 'demands') {
        combinedItems = combinedItems.filter(i => i.type === 'DEMAND' || i.type === 'BID');
      } else if (selectedSector === 'trending') {
        combinedItems = combinedItems.filter(i => i.stats.likes > 15);
      } else if (selectedSector === 'verified') {
        combinedItems = combinedItems.filter(i => i.author.isVerified);
      }

      // Sort items by timestamp descending
      combinedItems.sort((a, b) => {
        const dateA = new Date(a.content.timestamp).getTime();
        const dateB = new Date(b.content.timestamp).getTime();
        return isNaN(dateB) || isNaN(dateA) ? 0 : dateB - dateA;
      });

      set({ items: combinedItems, isLoading: false });
    } catch (err) {
      set({ error: 'Failed to load feed', isLoading: false });
    }
  },

  toggleLike: (postId) => {
    set((state) => ({
      items: state.items.map(item => 
        item.id === postId 
          ? { 
              ...item, 
              interactions: { ...item.interactions, hasLiked: !item.interactions.hasLiked },
              stats: { ...item.stats, likes: item.interactions.hasLiked ? item.stats.likes - 1 : item.stats.likes + 1 }
            } 
          : item
      )
    }));
  },

  addItem: (item) => set((state) => ({ 
    customItems: [item, ...state.customItems],
    items: [item, ...state.items] 
  }))
}));
