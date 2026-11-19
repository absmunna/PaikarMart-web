import { useState, useEffect, useCallback } from 'react';
import { feedApi } from '../services/feedApi';
import { FeedPost, ProductCardItem } from '../types';
import { useLocationStore } from '@/modules/location';

export const useFeed = (activeTab: 'social' | 'commerce', filter: string = 'all') => {
  const { city: userLocation } = useLocationStore();
  const [socialPosts, setSocialPosts] = useState<FeedPost[]>([]);
  const [commerceProducts, setCommerceProducts] = useState<ProductCardItem[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchFeeds = useCallback(async () => {
    setIsLoading(true);
    setError(null);
    try {
      const district = userLocation || 'Dhaka';
      
      if (activeTab === 'social') {
        const data = await feedApi.getSocialFeed({ district, filter });
        setSocialPosts(data.posts || []);
      } else {
        const data = await feedApi.getCommerceFeed({ district });
        setCommerceProducts(data.products || []);
      }
    } catch (err: any) {
      console.warn('Feed fetch error:', err);
      setError(err.message || 'Failed to fetch feed');
      // In development, if API fails, we might want to keep the current state or load mock data
    } finally {
      setIsLoading(false);
    }
  }, [activeTab, filter, userLocation]);

  useEffect(() => {
    fetchFeeds();
  }, [fetchFeeds]);

  return {
    socialPosts,
    commerceProducts,
    isLoading,
    error,
    refresh: fetchFeeds
  };
};
