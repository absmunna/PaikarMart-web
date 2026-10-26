import { FeedPost, ProductCardItem } from "../types";

export interface FeedResponse<T> {
  status: string;
  data: T[];
  pagination?: {
    total: number;
    page: number;
    limit: number;
  };
}

export const feedApi = {
  /**
   * Fetch Social Feed
   * GET /api/v1/feed/social
   */
  async getSocialFeed(params: {
    district?: string;
    filter?: string;
    page?: number;
    limit?: number;
  }): Promise<{ posts: FeedPost[] }> {
    const query = new URLSearchParams({
      district: params.district || '',
      filter: params.filter || 'all',
      page: String(params.page || 1),
      limit: String(params.limit || 10)
    });

    const response = await fetch(`/api/v1/feed/social?${query.toString()}`);
    if (!response.ok) {
      throw new Error('Failed to fetch social feed');
    }
    return response.json();
  },

  /**
   * Fetch Commerce Feed
   * GET /api/v1/feed/commerce
   */
  async getCommerceFeed(params: {
    district?: string;
    category?: string;
    page?: number;
    limit?: number;
  }): Promise<{ products: ProductCardItem[] }> {
    const query = new URLSearchParams({
      district: params.district || '',
      category: params.category || '',
      page: String(params.page || 1),
      limit: String(params.limit || 20)
    });

    const response = await fetch(`/api/v1/feed/commerce?${query.toString()}`);
    if (!response.ok) {
      throw new Error('Failed to fetch commerce feed');
    }
    return response.json();
  },

  /**
   * Toggle Wishlist for a post
   * POST /api/v1/feed/posts/:postId/wishlist
   */
  async toggleWishlist(postId: string): Promise<{ success: boolean; isWishlisted: boolean }> {
    const response = await fetch(`/api/v1/feed/posts/${postId}/wishlist`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' }
    });
    if (!response.ok) {
      throw new Error('Failed to toggle wishlist');
    }
    return response.json();
  },

  /**
   * Add Comment or Review
   * POST /api/v1/feed/posts/:postId/comments
   */
  async addComment(postId: string, comment: {
    content: string;
    rating?: number;
    isReview?: boolean;
    mediaUrls?: string[];
  }): Promise<{ success: boolean; commentId: string }> {
    const response = await fetch(`/api/v1/feed/posts/${postId}/comments`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(comment)
    });
    if (!response.ok) {
      throw new Error('Failed to add comment');
    }
    return response.json();
  }
};
