import { Request, Response } from 'express';
import { prisma, db } from '../../config/database';

// ─── INITIAL RICH SEED FOR MOCK FALLBACK ───
const MOCK_SOCIAL_POSTS = [
  {
    id: 'post-soc-1',
    type: 'wholesale',
    sellerId: 'v-cotton-1',
    sellerName: 'প্রিমিয়াম কটন টেক্সটাইল আড়ত',
    storeName: 'প্রিমিয়াম কটন টেক্সটাইল আড়ত',
    avatarUrl: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop',
    location: 'ইসলামপুর, ঢাকা',
    district: 'Dhaka',
    division: 'Dhaka',
    isVerified: true,
    isFollowing: false,
    followersCount: 1420,
    createdAt: new Date(Date.now() - 1000 * 60 * 45).toISOString(), // 45 mins ago
    content: 'রমজান ও ঈদের স্পেশাল প্রিমিয়াম জ্যাকার্ড সুতি পাঞ্জাবি ফেব্রিক্স সরাসরি টেক্সটাইল মিল থেকে স্টক লট অফার! ১০০% পিওর সুতি, কালার গ্যারান্টি। পাইকারি লটে ন্যূনতম ১০ পিস থেকে অর্ডার করতে পারবেন। #পাইকারি #ঈদকালেকশন #টেক্সটাইল #ঢাকাআড়ত',
    tags: ['#পাইকারি', '#ঈদকালেকশন', '#টেক্সটাইল', '#ঢাকাআড়ত', '#Wholesale'],
    mediaType: 'carousel',
    mediaUrls: [
      'https://images.unsplash.com/photo-1602810318383-e386cc2a3ccf?w=800&auto=format&fit=crop&q=80',
      'https://images.unsplash.com/photo-1620799140408-edc6dcb6d633?w=800&auto=format&fit=crop&q=80',
      'https://images.unsplash.com/photo-1598033129183-c4f50c736f10?w=800&auto=format&fit=crop&q=80'
    ],
    videoUrl: null,
    product: {
      id: 'prod-cotton-101',
      title: 'প্রিমিয়াম কটন জ্যাকার্ড পাঞ্জাবি (১০ পিস বান্ডিল)',
      price: 6500,
      originalPrice: 8500,
      discount: 24,
      moq: 10,
      stock: 450,
      rating: 4.9,
      reviewCount: 38,
      category: 'wholesale',
      image: 'https://images.unsplash.com/photo-1602810318383-e386cc2a3ccf?w=800&auto=format&fit=crop&q=80'
    },
    stats: {
      likes: 342,
      comments: 54,
      shares: 28,
      saves: 89
    },
    userInteractions: {
      isLiked: false,
      isSaved: false,
      isFollowing: false
    },
    reviews: [
      {
        id: 'rev-1',
        authorName: 'তানভীর আহমেদ',
        verifiedBuyer: true,
        rating: 5,
        text: 'কাপড়ের কোয়ালিটি অনেক ভালো! ইসলামপুর গিয়ে কেনার চেয়ে ঘরে বসেই সহজে ডেলিভারি পেলাম।',
        timestamp: '১ ঘণ্টা আগে'
      },
      {
        id: 'rev-2',
        authorName: 'রফিকুল ইসলাম',
        verifiedBuyer: true,
        rating: 5,
        text: 'রং একদম ছবির মতোই পাকা। পরবর্তী লট আবার অর্ডার করবো।',
        timestamp: '৩ ঘণ্টা আগে'
      }
    ]
  },
  {
    id: 'post-soc-2',
    type: 'retail',
    sellerId: 'v-honey-2',
    sellerName: 'সুন্দরবন পিওর এগ্রো ও মধু',
    storeName: 'সুন্দরবন পিওর এগ্রো',
    avatarUrl: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&auto=format&fit=crop',
    location: 'সাতক্ষীরা ও খুলনা (ডেলিভারি ঢাকা)',
    district: 'Khulna',
    division: 'Khulna',
    isVerified: true,
    isFollowing: true,
    followersCount: 2850,
    createdAt: new Date(Date.now() - 1000 * 60 * 120).toISOString(), // 2 hours ago
    content: 'আজ সকালেই সুন্দরবনের প্রত্যন্ত অঞ্চল থেকে সংগৃহীত কাঁচা খলিশা ফুলের প্রাকৃতিক মধু! কোন ধরণের প্রক্রিয়াজাতকরণ ছাড়া খাঁটি মধুর আসল স্বাদ। ভিডিওতে সরাসরি মধুর ঘনত্ব দেখুন। #প্রাকৃতিকমধু #সুন্দরবন #অর্গানিক #স্বাস্থ্যসুরক্ষা',
    tags: ['#প্রাকৃতিকমধু', '#সুন্দরবন', '#অর্গানিক', '#স্বাস্থ্যসুরক্ষা'],
    mediaType: 'video',
    mediaUrls: [
      'https://images.unsplash.com/photo-1587049352846-4a222e784d38?w=800&auto=format&fit=crop&q=80'
    ],
    videoUrl: 'https://assets.mixkit.co/videos/preview/mixkit-honey-drip-from-a-wooden-spoon-32986-large.mp4',
    product: {
      id: 'prod-honey-202',
      title: 'খাঁটি সুন্দরবনের খলিশা ফুলের মধু (১ কেজি জার)',
      price: 1150,
      originalPrice: 1400,
      discount: 18,
      moq: 1,
      stock: 120,
      rating: 5.0,
      reviewCount: 94,
      category: 'grocery',
      image: 'https://images.unsplash.com/photo-1587049352846-4a222e784d38?w=800&auto=format&fit=crop&q=80'
    },
    stats: {
      likes: 620,
      comments: 92,
      shares: 44,
      saves: 135
    },
    userInteractions: {
      isLiked: true,
      isSaved: true,
      isFollowing: true
    },
    reviews: [
      {
        id: 'rev-3',
        authorName: 'সাবিহা সুলতানা',
        verifiedBuyer: true,
        rating: 5,
        text: 'সরাসরি ভিডিও দেখে কিনেছি। মধুর ফ্লেভার অসাধারণ, একদম ন্যাচারাল!',
        timestamp: 'গতকাল'
      }
    ]
  },
  {
    id: 'post-soc-3',
    type: 'retail',
    sellerId: 'v-gadget-3',
    sellerName: 'স্টার ইলেকট্রনিক্স ও গ্যাজেট হাব',
    storeName: 'স্টার ইলেকট্রনিক্স',
    avatarUrl: 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=150&auto=format&fit=crop',
    location: 'মোতালেব প্লাজা, হাতিরপুল, ঢাকা',
    district: 'Dhaka',
    division: 'Dhaka',
    isVerified: true,
    isFollowing: false,
    followersCount: 5620,
    createdAt: new Date(Date.now() - 1000 * 60 * 240).toISOString(), // 4 hours ago
    content: 'নতুন প্রজন্মের আল্ট্রা স্মার্টওয়াচ সিরিজ ১০! ফুল অ্যামোলেড ডিসপ্লে, ব্লুটুথ কলিং, ও ৭ দিনের ব্যাটারি লাইফ। সীমিত সময়ের জন্য ২০% ডিসকাউন্টে ফ্রি ডেলিভারি অফার চলছে। #গ্যাজেট #স্মার্টওয়াচ #টেকঅফার #ঢাকাশপ',
    tags: ['#গ্যাজেট', '#স্মার্টওয়াচ', '#টেকঅফার', '#ঢাকাশপ'],
    mediaType: 'carousel',
    mediaUrls: [
      'https://images.unsplash.com/photo-1546868871-70c122467d9b?w=800&auto=format&fit=crop&q=80',
      'https://images.unsplash.com/photo-1508685096489-7aacd43bd3b1?w=800&auto=format&fit=crop&q=80'
    ],
    videoUrl: null,
    product: {
      id: 'prod-watch-303',
      title: 'Ultra 10 AMOLED Smartwatch (Dual Strap Edition)',
      price: 2450,
      originalPrice: 3200,
      discount: 23,
      moq: 1,
      stock: 65,
      rating: 4.8,
      reviewCount: 112,
      category: 'electronics',
      image: 'https://images.unsplash.com/photo-1546868871-70c122467d9b?w=800&auto=format&fit=crop&q=80'
    },
    stats: {
      likes: 890,
      comments: 130,
      shares: 65,
      saves: 210
    },
    userInteractions: {
      isLiked: false,
      isSaved: false,
      isFollowing: false
    },
    reviews: [
      {
        id: 'rev-4',
        authorName: 'ফারহান মাহমুদ',
        verifiedBuyer: true,
        rating: 5,
        text: 'ডিসপ্লে কোয়ালিটি জোস! ব্যাটারি ব্যাকআপ দারুণ পাচ্ছি। ডেলিভারি মাত্র ২৪ ঘণ্টায় দিয়েছে।',
        timestamp: '২ দিন আগে'
      }
    ]
  },
  {
    id: 'post-soc-4',
    type: 'wholesale',
    sellerId: 'v-tea-4',
    sellerName: 'সিলেট চা বাগান এক্সপোর্ট অ্যান্ড হোলসেল',
    storeName: 'সিলেট টি কর্নার',
    avatarUrl: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=150&auto=format&fit=crop',
    location: 'শ্রীমঙ্গল, সিলেট',
    district: 'Sylhet',
    division: 'Sylhet',
    isVerified: true,
    isFollowing: false,
    followersCount: 920,
    createdAt: new Date(Date.now() - 1000 * 60 * 360).toISOString(),
    content: 'শ্রীমঙ্গলের পাহাড়ি বাগানের ফার্স্ট ফ্লাশ প্রিমিয়াম সিটিসি ও অর্থোডক্স ব্ল্যাক টি। পাইকারি গ্রাহকদের জন্য বিশেষ ছাড়যুক্ত বস্তা লট সরবরাহ করছি। চায়ের ঘ্রাণ ও লিকার শতভাগ খাঁটি। #সিলেটচা #পাইকারিচা #শ্রীমঙ্গল #চাআড়ত',
    tags: ['#সিলেটচা', '#পাইকারিচা', '#শ্রীমঙ্গল', '#চাআড়ত'],
    mediaType: 'carousel',
    mediaUrls: [
      'https://images.unsplash.com/photo-1576092768241-dec231879fc3?w=800&auto=format&fit=crop&q=80',
      'https://images.unsplash.com/photo-1594631252845-29fc4cc8cde9?w=800&auto=format&fit=crop&q=80'
    ],
    videoUrl: null,
    product: {
      id: 'prod-tea-404',
      title: 'শ্রীমঙ্গল স্পেশাল গ্রেড ব্ল্যাক টি (১০ কেজি বস্তা)',
      price: 3800,
      originalPrice: 4500,
      discount: 16,
      moq: 1,
      stock: 80,
      rating: 4.9,
      reviewCount: 42,
      category: 'grocery',
      image: 'https://images.unsplash.com/photo-1576092768241-dec231879fc3?w=800&auto=format&fit=crop&q=80'
    },
    stats: {
      likes: 245,
      comments: 31,
      shares: 19,
      saves: 58
    },
    userInteractions: {
      isLiked: false,
      isSaved: false,
      isFollowing: false
    },
    reviews: [
      {
        id: 'rev-5',
        authorName: 'মো: জহিরুল',
        verifiedBuyer: true,
        rating: 5,
        text: 'আমার দোকানের জন্য ১০ কেজি নিয়েছিলাম, কাস্টমাররা খুব প্রশংসা করছে।',
        timestamp: '১ সপ্তাহ আগে'
      }
    ]
  },
  {
    id: 'post-soc-5',
    type: 'deal',
    sellerId: 'v-crockery-5',
    sellerName: 'চট্টগ্রাম সিরামিকস ও কিচেন মার্ট',
    storeName: 'চিটাগং ক্রকারি হাব',
    avatarUrl: 'https://images.unsplash.com/photo-1519085360753-af0119f7cbe7?w=150&auto=format&fit=crop',
    location: 'টেরিবাজার, চট্টগ্রাম',
    district: 'Chattogram',
    division: 'Chattogram',
    isVerified: true,
    isFollowing: false,
    followersCount: 1180,
    createdAt: new Date(Date.now() - 1000 * 60 * 480).toISOString(),
    content: 'নন-স্টিক ডাইকাস্ট গ্রানাইট কুকওয়্যার ৭ পিস কম্বো সেট! সরাসরি চট্টগ্রাম পোর্ট ইমপোর্ট লট। স্ক্র্যাচ রেজিস্ট্যান্ট ও ইনডাকশন সাপোর্টেড। আজই অর্ডার করুন পাইকারি মূল্যে। #কিচেনমার্ট #চট্টগ্রাম #কুকওয়্যার #হোমঅ্যাপ্লায়েন্স',
    tags: ['#কিচেনমার্ট', '#চট্টগ্রাম', '#কুকওয়্যার', '#হোমঅ্যাপ্লায়েন্স'],
    mediaType: 'carousel',
    mediaUrls: [
      'https://images.unsplash.com/photo-1584990347449-397a61d85600?w=800&auto=format&fit=crop&q=80',
      'https://images.unsplash.com/photo-1584269600464-37b1b58a9fe7?w=800&auto=format&fit=crop&q=80'
    ],
    videoUrl: null,
    product: {
      id: 'prod-cook-505',
      title: '৭ পিস গ্রানাইট নন-স্টিক কুকওয়্যার মাস্টার সেট',
      price: 4900,
      originalPrice: 6500,
      discount: 25,
      moq: 1,
      stock: 40,
      rating: 4.7,
      reviewCount: 29,
      category: 'home',
      image: 'https://images.unsplash.com/photo-1584990347449-397a61d85600?w=800&auto=format&fit=crop&q=80'
    },
    stats: {
      likes: 410,
      comments: 63,
      shares: 32,
      saves: 95
    },
    userInteractions: {
      isLiked: false,
      isSaved: false,
      isFollowing: false
    },
    reviews: []
  }
];

const MOCK_COMMERCE_PRODUCTS = [
  {
    id: 'prod-1',
    name: 'প্রিমিয়াম ব্লুটুথ ট্রু-ওয়্যারলেস ইয়ারবাডস',
    title: 'প্রিমিয়াম ব্লুটুথ ট্রু-ওয়্যারলেস ইয়ারবাডস',
    price: 1350,
    originalPrice: 1950,
    discount: 31,
    category: 'electronics',
    moq: 1,
    stock: 150,
    rating: 4.8,
    reviewCount: 84,
    soldCount: 320,
    image: 'https://images.unsplash.com/photo-1590658268037-6bf12165a8df?w=800&auto=format&fit=crop&q=80',
    images: [
      'https://images.unsplash.com/photo-1590658268037-6bf12165a8df?w=800&auto=format&fit=crop&q=80'
    ],
    seller: {
      id: 'v-elec-1',
      name: 'মোতালেব গ্যাজেট জোন',
      storeName: 'মোতালেব গ্যাজেট জোন',
      location: 'হাতিরপুল, ঢাকা',
      district: 'Dhaka',
      division: 'Dhaka',
      isVerified: true,
      rating: 4.9
    }
  },
  {
    id: 'prod-2',
    name: 'সুতি এমব্রয়ডারি সেমি-লং পাঞ্জাবি (ঈদ স্পেশাল)',
    title: 'সুতি এমব্রয়ডারি সেমি-লং পাঞ্জাবি (ঈদ স্পেশাল)',
    price: 1450,
    originalPrice: 2200,
    discount: 34,
    category: 'fashion',
    moq: 1,
    stock: 90,
    rating: 4.9,
    reviewCount: 65,
    soldCount: 210,
    image: 'https://images.unsplash.com/photo-1602810318383-e386cc2a3ccf?w=800&auto=format&fit=crop&q=80',
    images: [
      'https://images.unsplash.com/photo-1602810318383-e386cc2a3ccf?w=800&auto=format&fit=crop&q=80'
    ],
    seller: {
      id: 'v-fash-2',
      name: 'আড়ত টেক্সটাইল ও ফ্যাশন',
      storeName: 'আড়ত টেক্সটাইল',
      location: 'ইসলামপুর, ঢাকা',
      district: 'Dhaka',
      division: 'Dhaka',
      isVerified: true,
      rating: 4.8
    }
  },
  {
    id: 'prod-3',
    name: 'খাঁটি সুন্দরবনের প্রাকৃতিক পাহাড়ি মধু (১ কেজি)',
    title: 'খাঁটি সুন্দরবনের প্রাকৃতিক পাহাড়ি মধু (১ কেজি)',
    price: 950,
    originalPrice: 1250,
    discount: 24,
    category: 'grocery',
    moq: 1,
    stock: 200,
    rating: 5.0,
    reviewCount: 140,
    soldCount: 580,
    image: 'https://images.unsplash.com/photo-1587049352846-4a222e784d38?w=800&auto=format&fit=crop&q=80',
    images: [
      'https://images.unsplash.com/photo-1587049352846-4a222e784d38?w=800&auto=format&fit=crop&q=80'
    ],
    seller: {
      id: 'v-agro-3',
      name: 'সুন্দরবন ন্যাচারাল ফুডস',
      storeName: 'সুন্দরবন ফুডস',
      location: 'সাতক্ষীরা ও ঢাকা ডেলিভারি',
      district: 'Khulna',
      division: 'Khulna',
      isVerified: true,
      rating: 5.0
    }
  },
  {
    id: 'prod-4',
    name: 'হোলসেল মেনজ ক্যাজুয়াল স্নিকার্স (১২ জোড়া কার্টন)',
    title: 'হোলসেল মেনজ ক্যাজুয়াল স্নিকার্স (১২ জোড়া কার্টন)',
    price: 7800,
    originalPrice: 10500,
    discount: 26,
    category: 'wholesale',
    moq: 12,
    stock: 50,
    rating: 4.7,
    reviewCount: 32,
    soldCount: 140,
    image: 'https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=800&auto=format&fit=crop&q=80',
    images: [
      'https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=800&auto=format&fit=crop&q=80'
    ],
    seller: {
      id: 'v-shoe-4',
      name: 'ফুলবাড়িয়া শু হোলসেল সেন্টার',
      storeName: 'ফুলবাড়িয়া শু সেন্টার',
      location: 'ফুলবাড়িয়া, ঢাকা',
      district: 'Dhaka',
      division: 'Dhaka',
      isVerified: true,
      rating: 4.7
    }
  },
  {
    id: 'prod-5',
    name: 'স্মার্ট মাল্টি-প্লাগ এক্সটেনশন উইথ ফাস্ট ইউএসবি',
    title: 'স্মার্ট মাল্টি-প্লাগ এক্সটেনশন উইথ ফাস্ট ইউএসবি',
    price: 680,
    originalPrice: 950,
    discount: 28,
    category: 'electronics',
    moq: 1,
    stock: 300,
    rating: 4.6,
    reviewCount: 48,
    soldCount: 410,
    image: 'https://images.unsplash.com/photo-1544716278-ca5e3f4abd8c?w=800&auto=format&fit=crop&q=80',
    images: [
      'https://images.unsplash.com/photo-1544716278-ca5e3f4abd8c?w=800&auto=format&fit=crop&q=80'
    ],
    seller: {
      id: 'v-elec-5',
      name: 'নবাবপুর ইলেকট্রিক আড়ত',
      storeName: 'নবাবপুর ইলেকট্রিক',
      location: 'নবাবপুর, ঢাকা',
      district: 'Dhaka',
      division: 'Dhaka',
      isVerified: true,
      rating: 4.8
    }
  },
  {
    id: 'prod-6',
    name: 'শ্রীমঙ্গল সিটিসি ব্ল্যাক চা পাতা (৫ কেজি ব্যাগ)',
    title: 'শ্রীমঙ্গল সিটিসি ব্ল্যাক চা পাতা (৫ কেজি ব্যাগ)',
    price: 1850,
    originalPrice: 2200,
    discount: 16,
    category: 'wholesale',
    moq: 1,
    stock: 75,
    rating: 4.9,
    reviewCount: 52,
    soldCount: 180,
    image: 'https://images.unsplash.com/photo-1576092768241-dec231879fc3?w=800&auto=format&fit=crop&q=80',
    images: [
      'https://images.unsplash.com/photo-1576092768241-dec231879fc3?w=800&auto=format&fit=crop&q=80'
    ],
    seller: {
      id: 'v-tea-6',
      name: 'শ্রীমঙ্গল টি ট্রেডার্স',
      storeName: 'শ্রীমঙ্গল টি ট্রেডার্স',
      location: 'শ্রীমঙ্গল, সিলেট',
      district: 'Sylhet',
      division: 'Sylhet',
      isVerified: true,
      rating: 4.9
    }
  },
  {
    id: 'prod-7',
    name: 'প্রিমিয়াম সিরামিক নন-স্টিক ফ্রাইপ্যান (২৮ সেমি)',
    title: 'প্রিমিয়াম সিরামিক নন-স্টিক ফ্রাইপ্যান (২৮ সেমি)',
    price: 1250,
    originalPrice: 1750,
    discount: 29,
    category: 'home',
    moq: 1,
    stock: 110,
    rating: 4.8,
    reviewCount: 39,
    soldCount: 195,
    image: 'https://images.unsplash.com/photo-1584990347449-397a61d85600?w=800&auto=format&fit=crop&q=80',
    images: [
      'https://images.unsplash.com/photo-1584990347449-397a61d85600?w=800&auto=format&fit=crop&q=80'
    ],
    seller: {
      id: 'v-home-7',
      name: 'টেরিবাজার কিচেন ওয়ার্ল্ড',
      storeName: 'টেরিবাজার কিচেন',
      location: 'টেরিবাজার, চট্টগ্রাম',
      district: 'Chattogram',
      division: 'Chattogram',
      isVerified: true,
      rating: 4.7
    }
  },
  {
    id: 'prod-8',
    name: 'অর্গানিক ভার্জিন নারিকেল তেল (৫০০ মিলি কোল্ড প্রেস)',
    title: 'অর্গানিক ভার্জিন নারিকেল তেল (৫০০ মিলি কোল্ড প্রেস)',
    price: 490,
    originalPrice: 650,
    discount: 25,
    category: 'grocery',
    moq: 1,
    stock: 140,
    rating: 4.9,
    reviewCount: 71,
    soldCount: 380,
    image: 'https://images.unsplash.com/photo-1620916566398-39f1143ab7be?w=800&auto=format&fit=crop&q=80',
    images: [
      'https://images.unsplash.com/photo-1620916566398-39f1143ab7be?w=800&auto=format&fit=crop&q=80'
    ],
    seller: {
      id: 'v-oil-8',
      name: 'বরিশাল ন্যাচারালস',
      storeName: 'বরিশাল ন্যাচারালস',
      location: 'বরিশাল সদর, বরিশাল',
      district: 'Barishal',
      division: 'Barishal',
      isVerified: true,
      rating: 4.9
    }
  }
];

// In-memory runtime state for interactive actions (likes, follows, saves, new comments)
const inMemorySocialPosts = [...MOCK_SOCIAL_POSTS];
const followedStoreIds = new Set<string>(['v-honey-2']);
const savedPostIds = new Set<string>(['post-soc-2']);
const userSavedLocation = { district: 'Dhaka', division: 'Dhaka', area: 'Mirpur' };

// ─── 1. GET /api/feed/social ───
export const getSocialFeed = async (req: Request, res: Response) => {
  try {
    const {
      page = '1',
      limit = '10',
      location,
      district,
      filter = 'all',
      tag,
      search
    } = req.query;

    const pageNum = parseInt(String(page), 10) || 1;
    const limitNum = parseInt(String(limit), 10) || 10;
    const locFilter = String(district || location || '').toLowerCase().trim();
    const tagFilter = String(tag || '').toLowerCase().trim();
    const searchFilter = String(search || '').toLowerCase().trim();

    // If real database is connected, attempt to fetch from DB
    if (db.isConnected()) {
      try {
        const where: any = {};
        if (locFilter && locFilter !== 'all') {
          where.author = {
            vendorProfile: {
              location: { contains: locFilter, mode: 'insensitive' }
            }
          };
        }

        const dbPosts = await prisma.post.findMany({
          where,
          include: {
            author: {
              include: {
                vendorProfile: true
              }
            },
            product: true,
            comments: true
          },
          orderBy: { createdAt: 'desc' },
          skip: (pageNum - 1) * limitNum,
          take: limitNum
        });

        if (dbPosts && dbPosts.length > 0) {
          const formatted = dbPosts.map((p: any) => ({
            id: p.id,
            type: p.type || 'regular',
            sellerId: p.authorId,
            sellerName: p.author?.vendorProfile?.shopName || p.author?.fullName || 'সেলার',
            storeName: p.author?.vendorProfile?.shopName || 'পাইকার শপ',
            avatarUrl: p.author?.avatarUrl || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150',
            location: p.author?.vendorProfile?.location || 'ঢাকা, বাংলাদেশ',
            district: p.author?.vendorProfile?.location || 'Dhaka',
            isVerified: p.author?.vendorProfile?.isVerified ?? true,
            isFollowing: followedStoreIds.has(p.authorId),
            followersCount: 1200,
            createdAt: p.createdAt,
            content: p.content,
            tags: ['#PaikarMart', '#Commerce'],
            mediaType: p.mediaUrls?.length > 1 ? 'carousel' : 'image',
            mediaUrls: p.mediaUrls || [],
            videoUrl: null,
            product: p.product ? {
              id: p.product.id,
              title: p.product.title,
              price: Number(p.product.price),
              originalPrice: p.product.originalPrice ? Number(p.product.originalPrice) : null,
              discount: 15,
              moq: p.product.moq || 1,
              stock: p.product.stock || 50,
              rating: 4.8,
              image: p.product.image || p.mediaUrls?.[0]
            } : null,
            stats: {
              likes: 120,
              comments: p.comments?.length || 0,
              shares: 15,
              saves: 20
            },
            userInteractions: {
              isLiked: false,
              isSaved: false,
              isFollowing: followedStoreIds.has(p.authorId)
            },
            reviews: []
          }));

          return res.json({
            success: true,
            feedType: 'social',
            posts: formatted,
            pagination: {
              page: pageNum,
              limit: limitNum,
              total: formatted.length,
              hasMore: false
            }
          });
        }
      } catch (dbErr) {
        console.warn('Real DB feed query fallback to resilient mock:', dbErr);
      }
    }

    // Resilient recommendation & geo-fencing engine
    let posts = inMemorySocialPosts.map(p => ({
      ...p,
      isFollowing: followedStoreIds.has(p.sellerId),
      userInteractions: {
        ...p.userInteractions,
        isFollowing: followedStoreIds.has(p.sellerId),
        isSaved: savedPostIds.has(p.id)
      }
    }));

    // Filter by location / proximity
    if (locFilter && locFilter !== 'all' && locFilter !== 'সকল বাংলাদেশ' && locFilter !== 'সব বাংলাদেশ') {
      posts = posts.filter(p =>
        p.location.toLowerCase().includes(locFilter) ||
        p.district.toLowerCase().includes(locFilter) ||
        p.division.toLowerCase().includes(locFilter)
      );
    }

    // Filter by followed stores
    if (filter === 'following') {
      posts = posts.filter(p => followedStoreIds.has(p.sellerId));
    }

    // Filter by tag
    if (tagFilter) {
      posts = posts.filter(p =>
        p.tags.some(t => t.toLowerCase().includes(tagFilter)) ||
        p.content.toLowerCase().includes(tagFilter)
      );
    }

    // Filter by search query
    if (searchFilter) {
      posts = posts.filter(p =>
        p.content.toLowerCase().includes(searchFilter) ||
        p.sellerName.toLowerCase().includes(searchFilter) ||
        p.location.toLowerCase().includes(searchFilter)
      );
    }

    // Sort: Nearby location boost first, then recent
    const targetDistrict = locFilter && locFilter !== 'all' ? locFilter : userSavedLocation.district.toLowerCase();
    posts.sort((a, b) => {
      const aIsNear = a.district.toLowerCase().includes(targetDistrict) ? 1 : 0;
      const bIsNear = b.district.toLowerCase().includes(targetDistrict) ? 1 : 0;
      if (aIsNear !== bIsNear) return bIsNear - aIsNear;
      return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime();
    });

    const startIndex = (pageNum - 1) * limitNum;
    const paginated = posts.slice(startIndex, startIndex + limitNum);

    return res.json({
      success: true,
      feedType: 'social',
      locationContext: {
        activeLocation: locFilter || userSavedLocation.district,
        defaultUserLocation: userSavedLocation
      },
      posts: paginated,
      pagination: {
        page: pageNum,
        limit: limitNum,
        total: posts.length,
        hasMore: startIndex + limitNum < posts.length
      }
    });
  } catch (error) {
    console.error('getSocialFeed error:', error);
    res.status(500).json({ error: 'Failed to fetch social feed' });
  }
};

// ─── 2. GET /api/feed/commerce ───
export const getCommerceFeed = async (req: Request, res: Response) => {
  try {
    const {
      page = '1',
      limit = '12',
      category = 'all',
      location,
      district,
      onlyDiscounted = 'false',
      onlyWholesale = 'false',
      sortBy = 'popular',
      search
    } = req.query;

    const pageNum = parseInt(String(page), 10) || 1;
    const limitNum = parseInt(String(limit), 10) || 12;
    const cat = String(category).toLowerCase().trim();
    const locFilter = String(district || location || '').toLowerCase().trim();
    const searchFilter = String(search || '').toLowerCase().trim();
    const isDiscountOnly = onlyDiscounted === 'true';
    const isWholesaleOnly = onlyWholesale === 'true';

    // If real database is connected, attempt DB products query
    if (db.isConnected()) {
      try {
        const where: any = {};
        if (cat && cat !== 'all') where.category = cat;
        if (isWholesaleOnly) where.moq = { gt: 1 };

        const dbProducts = await prisma.product.findMany({
          where,
          include: {
            vendor: true
          },
          take: limitNum,
          skip: (pageNum - 1) * limitNum
        });

        if (dbProducts && dbProducts.length > 0) {
          const formatted = dbProducts.map((p: any) => ({
            id: p.id,
            name: p.title,
            title: p.title,
            price: Number(p.price),
            originalPrice: p.originalPrice ? Number(p.originalPrice) : null,
            discount: p.originalPrice ? Math.round(((Number(p.originalPrice) - Number(p.price)) / Number(p.originalPrice)) * 100) : 0,
            category: p.category,
            moq: p.moq || 1,
            stock: p.stock || 100,
            rating: 4.8,
            reviewCount: 35,
            soldCount: 120,
            image: p.image || p.images?.[0] || 'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=800',
            images: p.images || [p.image],
            seller: {
              id: p.vendor?.id || 'v-1',
              name: p.vendor?.shopName || 'পাইকার বিক্রেতা',
              storeName: p.vendor?.shopName || 'পাইকার মার্ট শপ',
              location: p.vendor?.location || 'ঢাকা',
              district: p.vendor?.location || 'Dhaka',
              isVerified: p.vendor?.isVerified ?? true,
              rating: 4.8
            }
          }));

          return res.json({
            success: true,
            feedType: 'commerce',
            products: formatted,
            pagination: {
              page: pageNum,
              limit: limitNum,
              total: formatted.length,
              hasMore: false
            }
          });
        }
      } catch (dbErr) {
        console.warn('Real DB commerce query fallback to resilient mock:', dbErr);
      }
    }

    // In-memory filter engine
    let products = [...MOCK_COMMERCE_PRODUCTS];

    if (cat && cat !== 'all') {
      products = products.filter(p => p.category.toLowerCase() === cat);
    }

    if (locFilter && locFilter !== 'all' && locFilter !== 'সকল বাংলাদেশ' && locFilter !== 'সব বাংলাদেশ') {
      products = products.filter(p =>
        p.seller.location.toLowerCase().includes(locFilter) ||
        p.seller.district.toLowerCase().includes(locFilter) ||
        p.seller.division.toLowerCase().includes(locFilter)
      );
    }

    if (isDiscountOnly) {
      products = products.filter(p => p.discount && p.discount > 0);
    }

    if (isWholesaleOnly) {
      products = products.filter(p => (p.moq && p.moq > 1) || p.category === 'wholesale');
    }

    if (searchFilter) {
      products = products.filter(p =>
        p.name.toLowerCase().includes(searchFilter) ||
        p.seller.name.toLowerCase().includes(searchFilter) ||
        p.seller.location.toLowerCase().includes(searchFilter)
      );
    }

    // Sort logic
    if (sortBy === 'price_asc') {
      products.sort((a, b) => a.price - b.price);
    } else if (sortBy === 'price_desc') {
      products.sort((a, b) => b.price - a.price);
    } else if (sortBy === 'rating') {
      products.sort((a, b) => b.rating - a.rating);
    } else if (sortBy === 'discount') {
      products.sort((a, b) => (b.discount || 0) - (a.discount || 0));
    } else {
      // Default: popular / soldCount
      products.sort((a, b) => (b.soldCount || 0) - (a.soldCount || 0));
    }

    const startIndex = (pageNum - 1) * limitNum;
    const paginated = products.slice(startIndex, startIndex + limitNum);

    return res.json({
      success: true,
      feedType: 'commerce',
      products: paginated,
      pagination: {
        page: pageNum,
        limit: limitNum,
        total: products.length,
        hasMore: startIndex + limitNum < products.length
      }
    });
  } catch (error) {
    console.error('getCommerceFeed error:', error);
    res.status(500).json({ error: 'Failed to fetch commerce feed' });
  }
};

// ─── 3. INTERACTION: Follow Store ───
export const toggleFollowStore = async (req: Request, res: Response) => {
  try {
    const { sellerId } = req.params;
    const isNowFollowing = !followedStoreIds.has(sellerId);

    if (isNowFollowing) {
      followedStoreIds.add(sellerId);
    } else {
      followedStoreIds.delete(sellerId);
    }

    return res.json({
      success: true,
      sellerId,
      isFollowing: isNowFollowing,
      message: isNowFollowing ? 'দোকানটি অনুসরণ করা হয়েছে' : 'অনুসরণ বাতিল করা হয়েছে'
    });
  } catch (error) {
    res.status(500).json({ error: 'Failed to toggle follow status' });
  }
};

// ─── 4. INTERACTION: Bookmark / Save Post ───
export const toggleSavePost = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const isSaved = savedPostIds.has(id);

    if (isSaved) {
      savedPostIds.delete(id);
    } else {
      savedPostIds.add(id);
    }

    return res.json({
      success: true,
      postId: id,
      isSaved: !isSaved,
      message: !isSaved ? 'পোস্টটি বুকমার্কে সংরক্ষণ করা হয়েছে' : 'বুকমার্ক থেকে সরানো হয়েছে'
    });
  } catch (error) {
    res.status(500).json({ error: 'Failed to toggle save post' });
  }
};

// ─── 5. USER LOCATION ENGINE ───
export const getUserLocation = async (req: Request, res: Response) => {
  return res.json({
    success: true,
    location: userSavedLocation,
    availableDivisions: [
      { id: 'dhaka', nameBn: 'ঢাকা', nameEn: 'Dhaka' },
      { id: 'chattogram', nameBn: 'চট্টগ্রাম', nameEn: 'Chattogram' },
      { id: 'sylhet', nameBn: 'সিলেট', nameEn: 'Sylhet' },
      { id: 'rajshahi', nameBn: 'রাজশাহী', nameEn: 'Rajshahi' },
      { id: 'khulna', nameBn: 'খুলনা', nameEn: 'Khulna' },
      { id: 'barishal', nameBn: 'বরিশাল', nameEn: 'Barishal' },
      { id: 'rangpur', nameBn: 'রংপুর', nameEn: 'Rangpur' },
      { id: 'mymensingh', nameBn: 'ময়মনসিংহ', nameEn: 'Mymensingh' }
    ]
  });
};

export const updateUserLocation = async (req: Request, res: Response) => {
  try {
    const { district, division, area } = req.body;
    if (district) userSavedLocation.district = district;
    if (division) userSavedLocation.division = division;
    if (area) userSavedLocation.area = area;

    return res.json({
      success: true,
      message: 'ইউজার লোকেশন সফলভাবে আপডেট হয়েছে',
      location: userSavedLocation
    });
  } catch (error) {
    res.status(500).json({ error: 'Failed to update location' });
  }
};

// ─── 6. LEGACY / UTILITY COMPATIBILITY ───
export const getPosts = getSocialFeed;

export const createPost = async (req: Request, res: Response) => {
  try {
    const { content, type, images, videoUrl, productId, tags, price, location } = req.body;

    const newPost = {
      id: `post-user-${Date.now()}`,
      type: type || 'retail',
      sellerId: 'u-current',
      sellerName: 'সেলার পার্টনার',
      storeName: 'আমার অনলাইন শপ',
      avatarUrl: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150',
      location: location || 'ঢাকা, বাংলাদেশ',
      district: 'Dhaka',
      division: 'Dhaka',
      isVerified: true,
      isFollowing: false,
      followersCount: 1,
      createdAt: new Date().toISOString(),
      content: content || '',
      tags: tags || ['#PaikarMart'],
      mediaType: videoUrl ? 'video' : (images && images.length > 1 ? 'carousel' : 'image'),
      mediaUrls: images || ['https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=800'],
      videoUrl: videoUrl || null,
      product: productId ? {
        id: productId,
        title: content.slice(0, 30),
        price: price || 1200,
        originalPrice: null,
        discount: 0,
        moq: 1,
        stock: 50,
        rating: 5.0,
        image: images?.[0] || 'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=800'
      } : null,
      stats: { likes: 0, comments: 0, shares: 0, saves: 0 },
      userInteractions: { isLiked: false, isSaved: false, isFollowing: false },
      reviews: []
    };

    inMemorySocialPosts.unshift(newPost as any);
    return res.status(201).json({ success: true, post: newPost });
  } catch (error) {
    res.status(500).json({ error: 'Failed to create post' });
  }
};

export const likePost = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const target = inMemorySocialPosts.find(p => p.id === id);
    if (target) {
      target.userInteractions.isLiked = !target.userInteractions.isLiked;
      target.stats.likes += target.userInteractions.isLiked ? 1 : -1;
      return res.json({
        success: true,
        likes: target.stats.likes,
        isLiked: target.userInteractions.isLiked
      });
    }
    return res.json({ success: true, isLiked: true });
  } catch (error) {
    res.status(500).json({ error: 'Failed to like post' });
  }
};

export const getComments = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const target = inMemorySocialPosts.find(p => p.id === id);
    return res.json(target?.reviews || []);
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch comments' });
  }
};

export const createComment = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const { content, authorName, rating } = req.body;
    const target = inMemorySocialPosts.find(p => p.id === id);

    const newRev = {
      id: `rev-${Date.now()}`,
      authorName: authorName || 'ভেরিফায়েড বায়ার',
      verifiedBuyer: true,
      rating: rating || 5,
      text: content || 'পণ্যটি ভালো লেগেছে!',
      timestamp: 'এইমাত্র'
    };

    if (target) {
      target.reviews.unshift(newRev);
      target.stats.comments += 1;
    }

    return res.status(201).json({ success: true, comment: newRev });
  } catch (error) {
    res.status(500).json({ error: 'Failed to create comment' });
  }
};

export const getStories = async (_req: Request, res: Response) => {
  return res.json([
    { id: 'st-1', name: 'কটন টেক্সটাইল', avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150', hasUnseen: true },
    { id: 'st-2', name: 'সুন্দরবন মধু', avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150', hasUnseen: true },
    { id: 'st-3', name: 'স্টার গ্যাজেট', avatar: 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=150', hasUnseen: false },
    { id: 'st-4', name: 'সিলেট টি কর্নার', avatar: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=150', hasUnseen: true },
    { id: 'st-5', name: 'চিটাগং ক্রকারি', avatar: 'https://images.unsplash.com/photo-1519085360753-af0119f7cbe7?w=150', hasUnseen: false }
  ]);
};
