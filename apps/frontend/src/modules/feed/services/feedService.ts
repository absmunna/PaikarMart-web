import { FeedPost } from '../types';
import { buildApiUrl } from '@/core/config/api';

export const feedService = {
  getSocialFeed: async (district: string, filter: string): Promise<FeedPost[]> => {
    try {
      const socRes = await fetch(buildApiUrl(`/feed/social?district=${district}&filter=${filter}`));
      if (socRes.ok) {
        const data = await socRes.json();
        return data.posts || [];
      }
      // Try fallback endpoint
      const fallbackRes = await fetch(buildApiUrl(`/feed/social?district=${district}&filter=${filter}`));
      if (fallbackRes.ok) {
        const data = await fallbackRes.json();
        return data.posts || [];
      }
      throw new Error("API call failed");
    } catch (err) {
      console.warn('Backend feed fetch error in FeedService:', err);
      return []; // Return empty, UI should handle fallback if empty
    }
  }
};
