import { create } from 'zustand';
import { useWishlistStore } from '@/modules/wishlist/wishlistStore';

export interface Comment {
  id: string;
  authorName: string;
  authorRole?: string;
  isSellerReply?: boolean;
  verifiedBuyer?: boolean;
  rating?: number;
  text: string;
  createdAt: string;
  parentId?: string;
}

export interface Post {
  id: string;
  sellerName: string;
  isVerified?: boolean;
  location: string;
  type: 'Wholesale' | 'Retail' | 'Service' | 'Demand';
  content: string;
  price: string;
  originalPrice?: string;
  discount?: string;
  rating: string;
  reviews?: string;
  soldCount: string;
  image: string;
  timestamp: string;
  distance?: string;
  likes: number;
  commentsCount: number;
  isLiked?: boolean;
  commentsList: Comment[];
  category?: string;
  stock?: string;
  authorId?: string; // to track whose profile this belongs to
}

interface FeedStore {
  posts: Post[];
  radius: number;
  setRadius: (radius: number) => void;
  addPost: (post: Omit<Post, 'id' | 'likes' | 'commentsCount' | 'commentsList' | 'timestamp'>) => void;
  toggleLike: (postId: string) => void;
  addComment: (postId: string, comment: Omit<Comment, 'id' | 'createdAt'>) => void;
}

const INITIAL_POST_STORY_COMMENTS: Record<string, Comment[]> = {
  'p-1': [
    {
      id: 'c-1-1',
      authorName: 'Nirjon Munna',
      authorRole: 'buyer',
      text: 'PPS charging support আছে কি? S24 Ultra চার্জ করা যাবে?',
      createdAt: '১০ মিনিট আগে',
    },
    {
      id: 'c-1-2',
      authorName: 'TechZone BD',
      authorRole: 'seller',
      isSellerReply: true,
      text: 'জী ভাইয়া, এটি সম্পূর্ণ PPS প্রোটোকল সাপোর্ট করে। ৪৫ ওয়াট সুপার ফাস্ট চার্জিং ২.০ পাবেন S24 Ultra তে।',
      createdAt: '৮ মিনিট আগে',
      parentId: 'c-1-1',
    },
    {
      id: 'c-1-3',
      authorName: 'আরিফুল ইসলাম',
      authorRole: 'buyer',
      verifiedBuyer: true,
      rating: 5,
      text: 'অরিজিনাল প্রোডাক্ট। ১০ পিস নিয়েছিলাম পাইকার মার্ত দিয়ে, সব গ্রাহক দারুণ রিভিউ দিচ্ছে। সেলার দারুণ সহযোগী!',
      createdAt: '১ ঘণ্টা আগে',
    }
  ],
  'p-2': [
    {
      id: 'c-2-1',
      authorName: 'মাশরাফি মর্তুজা',
      authorRole: 'buyer',
      text: 'কালার কি কি পাওয়া যাবে পঞ্জাবীর?',
      createdAt: '৩০ মিনিট আগে',
    },
    {
      id: 'c-2-2',
      authorName: 'Fashion Hub',
      authorRole: 'seller',
      isSellerReply: true,
      text: 'জী এটি লাল, মেরুন, নেভি ব্লু এবং ক্লাসিক হোয়াইট কালারে পাওয়া যাচ্ছে।',
      createdAt: '২৫ মিনিট আগে',
      parentId: 'c-2-1',
    },
    {
      id: 'c-2-3',
      authorName: 'তারেক রহমান',
      authorRole: 'buyer',
      verifiedBuyer: true,
      rating: 4,
      text: 'কাপড়ের কোয়ালিটি অত্যন্ত চমৎকার এবং প্রিমিয়াম সুতো দিয়ে বোনা। দাম ঠিক আছে!',
      createdAt: '২ ঘণ্টা আগে',
    }
  ],
  'p-3': [
    {
      id: 'c-3-1',
      authorName: 'মিনহাজুল আবেদিন',
      authorRole: 'buyer',
      text: 'MOQ ১০ পিসের কমে কি অর্ডার করা যাবে?',
      createdAt: '৩ ঘণ্টা আগে',
    },
    {
      id: 'c-3-2',
      authorName: 'Gadget Express',
      authorRole: 'seller',
      isSellerReply: true,
      text: 'দুঃখিত ভাইয়া, এটি পাইকারি লটের জন্য। নূন্যতম ১০ পিস অর্ডার কনফার্ম করতে হবে।',
      createdAt: '২ ঘণ্টা আগে',
      parentId: 'c-3-1',
    }
  ]
};

const INITIAL_POSTS: Post[] = [
  {
    id: 'p-1',
    sellerName: 'TechZone BD',
    isVerified: true,
    location: 'Mirpur, Dhaka',
    type: 'Wholesale',
    content: 'Samsung 65W USB-C Super Fast Charger. Bulk orders available with premium speed!',
    originalPrice: '৳১,৮০০',
    price: '৳১,২৫০',
    discount: '-৩১% OFF',
    rating: '৪.৮',
    reviews: '২৫',
    soldCount: '৩১২',
    image: 'https://images.unsplash.com/photo-1583394838336-acd977736f90?w=800&q=80',
    timestamp: '২ মিনিট আগে',
    distance: '১.২ কিমি',
    likes: 148,
    commentsCount: 3,
    isLiked: false,
    commentsList: INITIAL_POST_STORY_COMMENTS['p-1'] || [],
    category: 'Electronics',
    stock: "৫০০",
    authorId: "u-demo"
  },
  {
    id: 'p-2',
    sellerName: 'Fashion Hub',
    isVerified: true,
    location: 'Gulshan, Dhaka',
    type: 'Retail',
    content: 'Premium Cotton Panjabi for Eid 2026 Collection - Soft fabric and modern slim fit.',
    originalPrice: '৳৩,৫০০',
    price: '৳২,৮০০',
    discount: '-২০% OFF',
    rating: '৪.৯',
    reviews: '১২',
    soldCount: '৮৫',
    image: 'https://images.unsplash.com/photo-1593030761757-71fae46af504?w=800&q=80',
    timestamp: '১৫ মিনিট আগে',
    distance: '৩.৫ কিমি',
    likes: 532,
    commentsCount: 3,
    isLiked: false,
    commentsList: INITIAL_POST_STORY_COMMENTS['p-2'] || [],
    category: 'Clothing',
    stock: "১০০",
    authorId: "s-4"
  },
  {
    id: 'p-3',
    sellerName: 'Gadget Express',
    isVerified: false,
    location: 'Uttara, Dhaka',
    type: 'Wholesale',
    content: 'Smart Watch Series 8 Ultra - Minimum MOQ 10pcs with dual strap bundle offer!',
    originalPrice: '৳১,৫০০',
    price: '৳৯৫০',
    discount: 'Bulk ৩৬% OFF',
    rating: '৪.৫',
    reviews: '৪',
    soldCount: '১২০০+',
    image: 'https://images.unsplash.com/photo-1546868871-7041f2a55e12?w=800&q=80',
    timestamp: '১ ঘণ্টা আগে',
    distance: '৫.৮ কিমি',
    likes: 89,
    commentsCount: 2,
    isLiked: false,
    commentsList: INITIAL_POST_STORY_COMMENTS['p-3'] || [],
    category: 'Electronics',
    stock: "১৫০০",
    authorId: "s-2"
  },
  {
    id: 'p-4',
    sellerName: 'TechFix BD',
    isVerified: true,
    location: 'Banani, Dhaka',
    type: 'Service',
    content: 'Professional Laptop & Motherboard Repair. Free diagnosis and 90-day warranty!',
    originalPrice: '৳২,০০০',
    price: '৳১,৫০০',
    discount: '২৫% OFF',
    rating: '৪.৯',
    reviews: '৮',
    soldCount: '৪৫০+',
    image: 'https://images.unsplash.com/photo-1597872200969-2b65d56bd16b?w=800&q=80',
    timestamp: '২ ঘণ্টা আগে',
    distance: '২.১ কিমি',
    likes: 210,
    commentsCount: 0,
    isLiked: false,
    commentsList: [],
    category: 'Services',
    stock: "৯৯",
    authorId: "s-3"
  }
];

export const useFeedStore = create<FeedStore>((set) => ({
  posts: INITIAL_POSTS,
  radius: 10,
  setRadius: (radius) => set({ radius }),
  addPost: (newPostData) => set((state) => {
    const id = `p-user-${Date.now()}`;
    const newPost: Post = {
      ...newPostData,
      id,
      likes: 0,
      commentsCount: 0,
      commentsList: [],
      timestamp: 'এইমাত্র'
    };
    return {
      posts: [newPost, ...state.posts]
    };
  }),

  toggleLike: (postId) => set((state) => {
    const wishlistStore = useWishlistStore.getState();
    const updatedPosts = state.posts.map((post) => {
      if (post.id === postId) {
        const nextLiked = !post.isLiked;
        
        // Sync wishlist
        const productAdapter = {
          id: String(post.id),
          name: post.content ? post.content.substring(0, 50) : 'Post',
          price: parseInt(post.price?.replace(/[^\d]/g, '') || '0', 10),
          image: post.image || '',
          description: post.content || '',
          vendorName: post.sellerName || '',
        } as any;
        wishlistStore.toggleWishlist(productAdapter);

        return {
          ...post,
          isLiked: nextLiked,
          likes: nextLiked ? post.likes + 1 : post.likes - 1
        };
      }
      return post;
    });

    return { posts: updatedPosts };
  }),

  addComment: (postId, commentBody) => set((state) => {
    const updatedPosts = state.posts.map((post) => {
      if (post.id === postId) {
        const newComment: Comment = {
          ...commentBody,
          id: `c-user-${Date.now()}`,
          createdAt: 'এইমাত্র'
        };
        return {
          ...post,
          commentsCount: post.commentsCount + 1,
          commentsList: [...post.commentsList, newComment]
        };
      }
      return post;
    });

    return { posts: updatedPosts };
  })
}));
