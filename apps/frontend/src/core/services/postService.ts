import {
  collection,
  doc,
  addDoc,
  getDoc,
  getDocs,
  setDoc,
  updateDoc,
  deleteDoc,
  query,
  orderBy,
  limit,
  onSnapshot,
  serverTimestamp,
  increment,
  Timestamp
} from "firebase/firestore";
import { db, handleFirestoreError, OperationType } from "@/lib/firebase";
import { FeedPost, ProductCardItem, ReviewItem } from "@/modules/feed/types";

export interface CreatePostInput {
  authorId: string;
  authorName: string;
  authorAvatar?: string;
  authorRole?: string;
  storeName?: string;
  isVerified?: boolean;
  sellerPhone?: string;
  sellerEmail?: string;
  location?: string;
  district?: string;
  
  content: string;
  postType: 'text' | 'photo' | 'video' | 'file' | 'product';
  category?: string;
  tags?: string[];
  
  // Media attachments
  mediaUrls?: string[];
  videoUrl?: string | null;
  fileAttachment?: {
    name: string;
    url: string;
    size?: string;
    type?: string;
  } | null;
  
  // Product attachment
  product?: {
    title: string;
    price: number;
    originalPrice?: number;
    discount?: number;
    moq?: number;
    stock?: number;
    category?: string;
    image?: string;
  } | null;
}

// Initial verified community posts seeded when database is empty
export const SEED_POSTS: FeedPost[] = [
  {
    id: 'post-sample-product-1',
    postType: 'product',
    sellerId: 'seller-cotton-bd',
    authorId: 'seller-cotton-bd',
    sellerName: 'প্রিমিয়াম কটন টেক্সটাইল আড়ত',
    storeName: 'প্রিমিয়াম কটন টেক্সটাইল আড়ত',
    avatarUrl: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop',
    location: 'ইসলামপুর, ঢাকা',
    district: 'Dhaka',
    division: 'Dhaka',
    isVerified: true,
    authorRole: 'seller',
    sellerPhone: '+8801711223344',
    isFollowing: true,
    followersCount: 1420,
    createdAt: new Date(Date.now() - 3600000 * 2).toISOString(),
    content: 'রমজান ও ঈদের স্পেশাল প্রিমিয়াম জ্যাকার্ড সুতি পাঞ্জাবি ফেব্রিক্স সরাসরি টেক্সটাইল মিল থেকে পাইকারি অফার! পাইকারি লটে ন্যূনতম ১০ পিস থেকে সরাসরি অর্ডার বা বুকিং করুন। #পাইকারি #ঈদকালেকশন #টেক্সটাইল',
    tags: ['#পাইকারি', '#ঈদকালেকশন', '#টেক্সটাইল', '#হোলসেল'],
    mediaType: 'image',
    mediaUrls: [
      'https://images.unsplash.com/photo-1602810318383-e386cc2a3ccf?w=800&auto=format&fit=crop&q=80',
      'https://images.unsplash.com/photo-1596755094514-f87e34085b2c?w=800&auto=format&fit=crop&q=80'
    ],
    product: {
      id: 'prod-cotton-101',
      title: 'প্রিমিয়াম কটন জ্যাকার্ড পাঞ্জাবি ফেব্রিক (১০ পিস বান্ডিল)',
      price: 6500,
      originalPrice: 8500,
      discount: 24,
      moq: 10,
      stock: 450,
      rating: 4.9,
      reviewCount: 38,
      category: 'Wholesale',
      image: 'https://images.unsplash.com/photo-1602810318383-e386cc2a3ccf?w=800&auto=format&fit=crop&q=80'
    },
    stats: { likes: 342, comments: 48, shares: 28, saves: 89 },
    userInteractions: { isLiked: false, isSaved: false, isFollowing: true },
    reviews: []
  },
  {
    id: 'post-sample-video-2',
    postType: 'video',
    sellerId: 'seller-agro-organic',
    authorId: 'seller-agro-organic',
    sellerName: 'খাঁটি সুন্দরবন এগ্রো ফার্ম',
    storeName: 'খাঁটি সুন্দরবন এগ্রো ফার্ম',
    avatarUrl: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&auto=format&fit=crop',
    location: 'সাতক্ষীরা, খুলনা',
    district: 'Satkhira',
    division: 'Khulna',
    isVerified: true,
    authorRole: 'seller',
    sellerPhone: '+8801822334455',
    isFollowing: false,
    followersCount: 890,
    createdAt: new Date(Date.now() - 3600000 * 5).toISOString(),
    content: 'সরাসরি সুন্দরবনের চাক কাটা প্রাকৃতিক খাটি মধু সংগ্রহের ভিডিও ও ফ্রেশ স্টক এরাইভাল! ১০০% খাঁটি ল্যাব-টেস্টেড মধুর পাইকারি ড্রাম ও ৫০০ গ্রাম/১ কেজি জার বুকিং চলছে। #অর্গানিক #সুন্দরবনমধু #পাইকারমার্ট',
    tags: ['#অর্গানিক', '#সুন্দরবনমধু', '#পাইকারমার্ট', '#খাঁটিপণ্য'],
    mediaType: 'video',
    mediaUrls: [
      'https://images.unsplash.com/photo-1587049352846-4a222e784d38?w=800&auto=format&fit=crop&q=80'
    ],
    videoUrl: 'https://assets.mixkit.co/videos/preview/mixkit-honey-drip-from-a-wooden-spoon-32986-large.mp4',
    product: {
      id: 'prod-honey-201',
      title: '১০০% খাঁটি সুন্দরবনের প্রাকৃতিক মধু (১ কেজি কাঁচের জার)',
      price: 850,
      originalPrice: 1100,
      discount: 22,
      moq: 5,
      stock: 120,
      rating: 5.0,
      reviewCount: 42,
      category: 'Wholesale',
      image: 'https://images.unsplash.com/photo-1587049352846-4a222e784d38?w=800&auto=format&fit=crop&q=80'
    },
    stats: { likes: 215, comments: 29, shares: 19, saves: 45 },
    userInteractions: { isLiked: false, isSaved: false, isFollowing: false },
    reviews: []
  },
  {
    id: 'post-sample-file-3',
    postType: 'file',
    sellerId: 'factory-denim-dhaka',
    authorId: 'factory-denim-dhaka',
    sellerName: 'গাজীপুর এক্সপোর্ট ডেনিম অ্যাপারেলস',
    storeName: 'গাজীপুর ডেনিম ম্যানুফ্যাকচারিং',
    avatarUrl: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=150&auto=format&fit=crop',
    location: 'কোনাবাড়ী, গাজীপুর',
    district: 'Gazipur',
    division: 'Dhaka',
    isVerified: true,
    authorRole: 'factory',
    sellerPhone: '+8801933445566',
    isFollowing: false,
    followersCount: 2340,
    createdAt: new Date(Date.now() - 3600000 * 8).toISOString(),
    content: 'আমাদের ২০২৬ সালের সামার এক্সপোর্ট কোয়ালিটি ডেনিম জিন্স এবং টুইল প্যান্টের সম্পূর্ণ পাইকারি ক্যাটালগ এবং প্রাইস শিট PDF অ্যাটাচ করা হলো। পাইকারি আমদানিকারক ও রিটেইলাররা সরাসরি ডাউনলোড করে কারখানা রেটে অর্ডার দিন। #ডেনিম #গার্মেন্টস #পাইকারিদর',
    tags: ['#ডেনিম', '#গার্মেন্টস', '#পাইকারিদর', '#ক্যাটালগ'],
    mediaType: 'file',
    mediaUrls: [
      'https://images.unsplash.com/photo-1542272604-780c96856592?w=800&auto=format&fit=crop&q=80'
    ],
    fileAttachment: {
      name: 'PaikarMart_Denim_Apparel_Catalog_2026.pdf',
      url: 'https://www.w3.org/WAI/ER/tests/xhtml/testfiles/resources/pdf/dummy.pdf',
      size: '3.4 MB',
      type: 'application/pdf'
    },
    product: {
      id: 'prod-denim-301',
      title: 'এক্সপোর্ট কোয়ালিটি স্ট্রেচ ডেনিম জিন্স (১০০ পিস বান্ডিল)',
      price: 38000,
      originalPrice: 48000,
      discount: 20,
      moq: 50,
      stock: 2500,
      rating: 4.8,
      reviewCount: 19,
      category: 'Wholesale',
      image: 'https://images.unsplash.com/photo-1542272604-780c96856592?w=800&auto=format&fit=crop&q=80'
    },
    stats: { likes: 184, comments: 23, shares: 35, saves: 76 },
    userInteractions: { isLiked: false, isSaved: false, isFollowing: false },
    reviews: []
  },
  {
    id: 'post-sample-text-4',
    postType: 'text',
    sellerId: 'buyer-chittagong-trade',
    authorId: 'buyer-chittagong-trade',
    sellerName: 'চট্টগ্রাম হোলসেল ট্রেডার্স সিন্ডিকেট',
    storeName: 'মেসার্স রহমান ব্রাদার্স',
    avatarUrl: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=150&auto=format&fit=crop',
    location: 'খাতুনগঞ্জ, চট্টগ্রাম',
    district: 'Chittagong',
    division: 'Chittagong',
    isVerified: true,
    authorRole: 'buyer',
    sellerPhone: '+8801819998877',
    isFollowing: false,
    followersCount: 560,
    createdAt: new Date(Date.now() - 3600000 * 12).toISOString(),
    content: 'জরুরি রিকোয়ারমেন্ট: খাতুনগঞ্জ আড়তের জন্য ফ্রেশ এলাচ, জিরা ও দারুচিনির পাইকারি ৫০ বস্তা কোটেশন প্রয়োজন। প্রকৃত আমদানিকারক ও মিলাররা সরাসরি ইনবক্সে বা হোয়াটসঅ্যাপে দরপত্র জমা দিন। ক্যাশ অন ডেলিভারি সুবিধা সম্পন্ন ডিলারদের অগ্রাধিকার দেওয়া হবে।',
    tags: ['#জরুরিডিমান্ড', '#খাতুনগঞ্জ', '#মশলাবাজার', '#পাইকারি'],
    mediaType: 'text',
    mediaUrls: [],
    product: null,
    stats: { likes: 98, comments: 37, shares: 14, saves: 22 },
    userInteractions: { isLiked: false, isSaved: false, isFollowing: false },
    reviews: []
  }
];

export const postService = {
  /**
   * Create a new post in Firestore
   */
  async createPost(input: CreatePostInput): Promise<FeedPost> {
    const postCollection = collection(db, "posts");
    
    // Determine media type
    let mediaType: 'image' | 'video' | 'carousel' | 'file' | 'text' = 'text';
    if (input.postType === 'video' || input.videoUrl) {
      mediaType = 'video';
    } else if (input.postType === 'file' || input.fileAttachment) {
      mediaType = 'file';
    } else if (input.mediaUrls && input.mediaUrls.length > 1) {
      mediaType = 'carousel';
    } else if (input.mediaUrls && input.mediaUrls.length === 1) {
      mediaType = 'image';
    } else if (input.product?.image) {
      mediaType = 'image';
    }

    const mediaList = input.mediaUrls && input.mediaUrls.length > 0
      ? input.mediaUrls
      : (input.product?.image ? [input.product.image] : []);

    const productPayload: ProductCardItem | null = input.product ? {
      id: `prod-${Date.now()}`,
      title: input.product.title,
      price: Number(input.product.price) || 0,
      originalPrice: input.product.originalPrice ? Number(input.product.originalPrice) : null,
      discount: input.product.discount || (input.product.originalPrice ? Math.round(((input.product.originalPrice - input.product.price) / input.product.originalPrice) * 100) : 0),
      moq: Number(input.product.moq) || 1,
      stock: Number(input.product.stock) || 50,
      rating: 5.0,
      reviewCount: 0,
      category: input.product.category || input.category || 'Wholesale',
      image: input.product.image || mediaList[0] || 'https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=800'
    } : null;

    const firestorePayload = {
      authorId: input.authorId,
      sellerId: input.authorId,
      sellerName: input.authorName,
      storeName: input.storeName || input.authorName,
      avatarUrl: input.authorAvatar || `https://api.dicebear.com/7.x/avataaars/svg?seed=${input.authorName}`,
      authorRole: input.authorRole || 'buyer',
      isVerified: Boolean(input.isVerified),
      sellerPhone: input.sellerPhone || '',
      sellerEmail: input.sellerEmail || '',
      location: input.location || 'ঢাকা, বাংলাদেশ',
      district: input.district || 'Dhaka',
      
      content: input.content,
      postType: input.postType,
      category: input.category || 'Wholesale',
      tags: input.tags || ['#PaikarMart', '#পোস্ট'],
      
      mediaType,
      mediaUrls: mediaList,
      videoUrl: input.videoUrl || null,
      fileAttachment: input.fileAttachment || null,
      product: productPayload,
      
      stats: {
        likes: 0,
        comments: 0,
        shares: 0,
        saves: 0
      },
      createdAt: serverTimestamp(),
      updatedAt: serverTimestamp()
    };

    try {
      const docRef = await addDoc(postCollection, firestorePayload);
      
      return {
        id: docRef.id,
        ...firestorePayload,
        createdAt: new Date().toISOString(),
        stats: firestorePayload.stats,
        userInteractions: { isLiked: false, isSaved: false, isFollowing: false },
        reviews: []
      } as FeedPost;
    } catch (error) {
      console.warn("Firestore post creation error, falling back locally:", error);
      handleFirestoreError(error, OperationType.CREATE, "posts");
      // Fallback return if error handled
      return {
        id: `post-local-${Date.now()}`,
        ...firestorePayload,
        createdAt: new Date().toISOString(),
        stats: firestorePayload.stats,
        userInteractions: { isLiked: false, isSaved: false, isFollowing: false },
        reviews: []
      } as FeedPost;
    }
  },

  /**
   * Subscribe to real-time posts from Firestore.
   * If Firestore has no documents, automatically populates seed posts.
   */
  subscribeToFeed(onPostsUpdate: (posts: FeedPost[]) => void): () => void {
    const postsCollection = collection(db, "posts");
    const q = query(postsCollection, orderBy("createdAt", "desc"), limit(50));

    const unsubscribe = onSnapshot(
      q,
      (snapshot) => {
        if (!snapshot.empty) {
          const list: FeedPost[] = snapshot.docs.map((d) => {
            const data = d.data();
            let dateStr = new Date().toISOString();
            if (data.createdAt instanceof Timestamp) {
              dateStr = data.createdAt.toDate().toISOString();
            } else if (typeof data.createdAt === 'string') {
              dateStr = data.createdAt;
            }

            return {
              id: d.id,
              authorId: data.authorId || data.sellerId,
              sellerId: data.sellerId || data.authorId,
              sellerName: data.sellerName || 'PaikarMart সেলার',
              storeName: data.storeName || data.sellerName || 'আমার পাইকার শপ',
              avatarUrl: data.avatarUrl || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150',
              location: data.location || 'ঢাকা, বাংলাদেশ',
              district: data.district || 'Dhaka',
              isVerified: Boolean(data.isVerified),
              authorRole: data.authorRole || 'seller',
              sellerPhone: data.sellerPhone,
              sellerEmail: data.sellerEmail,
              createdAt: dateStr,
              content: data.content || '',
              postType: data.postType || (data.mediaType === 'video' ? 'video' : 'photo'),
              tags: data.tags || [],
              mediaType: data.mediaType || 'image',
              mediaUrls: Array.isArray(data.mediaUrls) ? data.mediaUrls : [],
              videoUrl: data.videoUrl || null,
              fileAttachment: data.fileAttachment || null,
              product: data.product || null,
              stats: data.stats || { likes: 0, comments: 0, shares: 0, saves: 0 },
              userInteractions: { isLiked: false, isSaved: false, isFollowing: false },
              reviews: []
            } as FeedPost;
          });

          onPostsUpdate(list);
        } else {
          // If Firestore is empty, seed initial sample posts
          this.seedInitialPosts();
          onPostsUpdate(SEED_POSTS);
        }
      },
      (error) => {
        console.warn("Firestore posts listener notice (using seed feed):", error.message);
        onPostsUpdate(SEED_POSTS);
      }
    );

    return unsubscribe;
  },

  /**
   * Seed authentic posts into Firestore if collection is empty
   */
  async seedInitialPosts(): Promise<void> {
    try {
      const postsCol = collection(db, "posts");
      const snap = await getDocs(query(postsCol, limit(1)));
      if (!snap.empty) return;

      for (const p of SEED_POSTS) {
        await addDoc(postsCol, {
          ...p,
          createdAt: serverTimestamp(),
          updatedAt: serverTimestamp()
        });
      }
    } catch (e) {
      console.info("Firestore seed skipped (offline or permissions):", e);
    }
  },

  /**
   * Toggle Like on a post in Firestore
   */
  async togglePostLike(postId: string, userId: string, isCurrentlyLiked: boolean): Promise<void> {
    try {
      const postRef = doc(db, "posts", postId);
      await updateDoc(postRef, {
        "stats.likes": increment(isCurrentlyLiked ? -1 : 1)
      });
      
      const likeDocRef = doc(db, "posts", postId, "likes", userId);
      if (isCurrentlyLiked) {
        await deleteDoc(likeDocRef);
      } else {
        await setDoc(likeDocRef, {
          userId,
          createdAt: serverTimestamp()
        });
      }
    } catch (err) {
      console.warn("Firestore like toggle warning:", err);
    }
  },

  /**
   * Add comment to post in Firestore
   */
  async addComment(postId: string, author: { id: string; name: string; avatar?: string }, text: string): Promise<ReviewItem> {
    const commentsCol = collection(db, "posts", postId, "comments");
    const commentPayload = {
      authorId: author.id,
      authorName: author.name,
      authorAvatar: author.avatar || '',
      verifiedBuyer: true,
      rating: 5,
      text,
      createdAt: serverTimestamp()
    };

    try {
      const docRef = await addDoc(commentsCol, commentPayload);
      const postRef = doc(db, "posts", postId);
      await updateDoc(postRef, {
        "stats.comments": increment(1)
      });

      return {
        id: docRef.id,
        authorName: author.name,
        verifiedBuyer: true,
        rating: 5,
        text,
        timestamp: 'এখনই'
      };
    } catch (err) {
      console.warn("Firestore comment creation error:", err);
      return {
        id: `com-${Date.now()}`,
        authorName: author.name,
        verifiedBuyer: true,
        rating: 5,
        text,
        timestamp: 'এখনই'
      };
    }
  }
};
