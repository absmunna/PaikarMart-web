import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { Post, Comment } from '../types/index';

interface FeedState {
  posts: Post[];
  isLoading: boolean;
  error: string | null;
}

interface FeedActions {
  addPost: (post: Omit<Post, 'id' | 'createdAt' | 'likes' | 'comments' | 'isLiked'>) => void;
  addComment: (postId: string, comment: any) => void;
  toggleLike: (postId: string) => void;
  setLoading: (loading: boolean) => void;
  setError: (error: string | null) => void;
}

export const useFeedStore = create<FeedState & FeedActions>()(
  persist(
    (set) => ({
      posts: [
        {
          id: '1',
          type: 'Retail',
          authorId: 'v1',
          sellerName: 'Premium Cotton Traders',
          isVerified: true,
          location: 'Dhaka',
          content: 'High quality cotton panjabi for upcoming Eid. Available in 5 colors.',
          price: '৳১,২৫০',
          rating: '৫.০',
          soldCount: '০',
          image: 'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=800&q=80',
          category: 'কমার্স',
          createdAt: new Date().toISOString(),
          likes: 45,
          comments: 12,
          isLiked: false,
          commentsList: []
        }
      ],
      isLoading: false,
      error: null,

      addPost: (postData) => set((state) => ({
        posts: [
          {
            ...postData,
            id: Math.random().toString(36).substr(2, 9),
            createdAt: new Date().toISOString(),
            likes: 0,
            comments: 0,
            isLiked: false,
            commentsList: []
          } as Post,
          ...state.posts
        ]
      })),

      addComment: (postId, comment) => set((state) => ({
        posts: state.posts.map((p) =>
          p.id === postId ? { ...p, comments: p.comments + 1 } : p
        )
      })),

      toggleLike: (postId) => set((state) => ({
        posts: state.posts.map((p) =>
          p.id === postId
            ? { ...p, likes: p.isLiked ? p.likes - 1 : p.likes + 1, isLiked: !p.isLiked }
            : p
        )
      })),

      setLoading: (loading) => set({ isLoading: loading }),
      setError: (error) => set({ error })
    }),
    {
      name: 'paikarmart-feed-storage'
    }
  )
);
