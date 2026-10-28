import { VideoItem, LiveStreamSession, VideoComment, VideoUploadPayload } from '../types';

export const INITIAL_VIDEOS: VideoItem[] = [
  {
    id: "v-yt-creator-1",
    title: "ইউটিউব কনটент ক্রিয়েটর গাইড: টেক্সটাইল আড়তের নতুন জ্যাকার্ড ও সুতি পাঞ্জাবি রিভিউ (৩ মিনিট)",
    description: "ইউটিউব চ্যানেল থেকে যুক্ত করা সরাসরি ভিডিও কন্টেন্ট। ফুল ভিডিও প্লেব্যাক ইন-অ্যাপ অটোমেটিক সাপোর্ট করে। ইসলামপুরের প্রধান টেক্সটাইল আড়ত থেকে সরাসরি রিভিউ।",
    videoUrl: "https://www.youtube.com/watch?v=dQw4w9WgXcQ",
    thumbnail: "https://images.unsplash.com/photo-1617137984095-74e4e5e3613f?auto=format&fit=crop&q=80&w=800",
    duration: "02:45",
    durationSeconds: 165,
    views: "24.8K",
    likes: 1850,
    shares: 340,
    commentsCount: 142,
    createdAt: new Date(Date.now() - 1000 * 60 * 60 * 3).toISOString(),
    timeAgo: "৩ ঘণ্টা আগে",
    categoryType: "creator",
    category: "কনটент ক্রিয়েটর (৩ মি:)",
    isExternalLink: true,
    externalSource: "youtube",
    embedUrl: "https://www.youtube.com/embed/dQw4w9WgXcQ?autoplay=1",
    creator: {
      id: "creator-islampur",
      name: "Dhaka Creator Zone",
      handle: "dhaka_creator",
      avatar: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop",
      verified: true,
      followers: "48.2K",
      location: "ইসলামপুর, ঢাকা"
    },
    linkedProduct: {
      id: "prod-cotton-101",
      title: "প্রিমিয়াম কটন জ্যাকার্ড পাঞ্জাবি (১০ পিস বান্ডিল)",
      price: 6500,
      originalPrice: 8500,
      discount: 24,
      rating: 4.9,
      image: "https://images.unsplash.com/photo-1602810318383-e386cc2a3ccf?w=800&auto=format&fit=crop&q=80",
      moq: 10,
      inStock: true,
      category: "wholesale"
    },
    tags: ["ক্রিয়েটর", "ইউটিউব", "পাঞ্জাবি", "টেক্সটাইল"]
  },
  {
    id: "v-seller-prod-2",
    title: "খাতুনগঞ্জ পাইকারি সরিষার তেল ও মসলা প্রমোশনাল শট (৪৫ সেকেন্ড)",
    description: "প্রোডাক্ট সেলিং ভিডিও। সাথে যুক্ত রয়েছে সরাসরি দারাজ ও অ্যামাজন এবং পাইকারমার্ট মাই সেলার অ্যাকাউন্ট পণ্য লিঙ্ক।",
    videoUrl: "https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ElephantsDream.mp4",
    thumbnail: "https://images.unsplash.com/photo-1542838132-92c53300491e?auto=format&fit=crop&q=80&w=800",
    duration: "00:45",
    durationSeconds: 45,
    views: "42.1K",
    likes: 3120,
    shares: 610,
    commentsCount: 289,
    createdAt: new Date(Date.now() - 1000 * 60 * 60 * 6).toISOString(),
    timeAgo: "৬ ঘণ্টা আগে",
    categoryType: "seller_product",
    category: "প্রোডাক্ট সেলিং (৩০-৬০ সে:)",
    productLinkConfig: {
      type: "daraz",
      url: "https://www.daraz.com.bd/products/pure-mustard-oil-5l.html",
      title: "Daraz Affiliate: খাঁটি সরিষার তেল ৫ লিটার",
      price: 1150
    },
    creator: {
      id: "creator-khatunganj",
      name: "Chittagong Agro Trade",
      handle: "ctg_agro",
      avatar: "https://images.unsplash.com/photo-1570295999919-56ceb5ecca61?auto=format&fit=crop&q=80&w=150",
      verified: true,
      followers: "89.5K",
      location: "খাতুনগঞ্জ, চট্টগ্রাম",
      storeName: "চট্টগ্রাম এগ্রো ট্রেড"
    },
    linkedProduct: {
      id: "prod-oil-202",
      title: "খাঁটি ঘানি ভাঙা সরিষার তেল ৫ লিটার ক্যান",
      price: 1150,
      originalPrice: 1350,
      discount: 15,
      rating: 5.0,
      image: "https://images.unsplash.com/photo-1474979266404-7eaacbcd87c5?auto=format&fit=crop&q=80&w=200",
      moq: 4,
      inStock: true
    },
    tags: ["প্রোডাক্টসেলিংশট", "দারাজ", "মসলা", "তেল"]
  },
  {
    id: "v-paid-vlog-3",
    title: "⭐ এক্সক্লুসিভ পার্সোনাল ব্লগ ও ফ্যাক্টরি সিক্রেট গাইড (৮ মিনিট)",
    description: "এক্সক্লুসিভ পার্সোনাল ব্লগ ও মাস্টারক্লাস। প্রথম ৩০ সেকেন্ড বিনামূল্যে দেখার পর সম্পূর্ণ ভিডিওটি উপভোগ করতে ওয়ালেট থেকে মাত্র ৳২০ টাকা আনলক ফি প্রযোজ্য।",
    videoUrl: "https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerEscapes.mp4",
    thumbnail: "https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?auto=format&fit=crop&q=80&w=800",
    duration: "08:15",
    durationSeconds: 495,
    views: "31.4K",
    likes: 2480,
    shares: 490,
    commentsCount: 167,
    createdAt: new Date(Date.now() - 1000 * 60 * 60 * 36).toISOString(),
    timeAgo: "১ দিন আগে",
    categoryType: "vlog_premium",
    category: "পার্সোনাল ব্লগ ও পেড শো",
    isPaidContent: true,
    priceAmount: 20,
    previewDurationSeconds: 30,
    creator: {
      id: "creator-leather",
      name: "Bengal Master Crafts",
      handle: "bengal_master",
      avatar: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&auto=format&fit=crop",
      verified: true,
      followers: "65.3K",
      location: "হাজারীবাগ, ঢাকা"
    },
    linkedProduct: {
      id: "prod-wallet-404",
      title: "RFID সুরক্ষিত জেনুইন ক্রাফটেড লেদার ওয়ালেট",
      price: 950,
      originalPrice: 1400,
      discount: 32,
      rating: 4.9,
      image: "https://images.unsplash.com/photo-1627123424574-724758594e93?w=800&auto=format&fit=crop&q=80",
      moq: 5,
      inStock: true
    },
    tags: ["পার্সোনালব্লগ", "পেডশো", "লেদার", "এক্সক্লুসিভ"]
  }
];

export const INITIAL_REELS: VideoItem[] = [
  {
    id: "reel-1",
    title: "সুন্দরবনের খাঁটি খলিশা ফুলের মধুর ঘন আঠালো ঘনত্ব দেখুন! 🍯✨",
    description: "কোন প্রকার মিশ্রণ ছাড়া সরাসরি মৌচাক থেকে সংগৃহীত। ল্যাবে পরীক্ষিত ১০০% খাঁটি মধু।",
    videoUrl: "https://assets.mixkit.co/videos/preview/mixkit-honey-drip-from-a-wooden-spoon-32986-large.mp4",
    thumbnail: "https://images.unsplash.com/photo-1587049352846-4a222e784d38?auto=format&fit=crop&q=80&w=800",
    views: "52.3K",
    likes: 4890,
    shares: 820,
    commentsCount: 245,
    createdAt: new Date().toISOString(),
    timeAgo: "এখনই",
    categoryType: "seller_product",
    category: "প্রোডাক্ট সেলিং (৩০-৬০ সে:)",
    isShort: true,
    creator: {
      id: "v-honey-2",
      name: "সুন্দরবন পিওর এগ্রো",
      handle: "sundarban_pure",
      avatar: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&auto=format&fit=crop",
      verified: true,
      followers: "35.2K",
      location: "খুলনা"
    },
    linkedProduct: {
      id: "prod-honey-202",
      title: "খাঁটি সুন্দরবনের খলিশা ফুলের মধু (১ কেজি জার)",
      price: 1150,
      originalPrice: 1400,
      discount: 18,
      rating: 5.0,
      image: "https://images.unsplash.com/photo-1587049352846-4a222e784d38?w=800&auto=format&fit=crop&q=80",
      moq: 1,
      inStock: true
    },
    tags: ["মধু", "সুন্দরবন", "অর্গানিক", "Shorts"]
  },
  {
    id: "reel-2",
    title: "নতুন জেনারেশনের ওয়াটারপ্রুফ স্মার্ট ওয়াচ সিরিজ ৯ আলটিমেট আনবক্সিং ⌚🔥",
    description: "এমোলেড ডিসপ্লে, ব্লুটুথ কলিং, হার্টরেট ও অক্সিজেন সেন্সর সহ সুপারফাস্ট রেসপন্স।",
    videoUrl: "https://assets.mixkit.co/videos/preview/mixkit-smartwatch-on-a-users-wrist-40242-large.mp4",
    thumbnail: "https://images.unsplash.com/photo-1546868871-70c122467d9b?auto=format&fit=crop&q=80&w=800",
    views: "38.7K",
    likes: 3410,
    shares: 490,
    commentsCount: 178,
    createdAt: new Date().toISOString(),
    timeAgo: "১ ঘণ্টা আগে",
    categoryType: "seller_product",
    category: "প্রোডাক্ট সেলিং (৩০-৬০ সে:)",
    isShort: true,
    creator: {
      id: "v-gadget-3",
      name: "স্টার ইলেকট্রনিক্স হাব",
      handle: "star_gadgets",
      avatar: "https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=150&auto=format&fit=crop",
      verified: true,
      followers: "62.8K",
      location: "হাতিরপুল, ঢাকা"
    },
    linkedProduct: {
      id: "prod-watch-9",
      title: "Smart Watch Series 9 Ultimate AMOLED",
      price: 2450,
      originalPrice: 3200,
      discount: 23,
      rating: 4.8,
      image: "https://images.unsplash.com/photo-1546868871-70c122467d9b?w=800&auto=format&fit=crop&q=80",
      moq: 1,
      inStock: true
    },
    tags: ["স্মার্টওয়াচ", "গ্যাজেট", "টেকনোলজি", "Shorts"]
  },
  {
    id: "reel-3",
    title: "টাঙ্গাইল তাঁতের খাঁটি সুতি জামদানি শাড়ি সরাসরি তাঁত পল্লী থেকে 🥻🇧🇩",
    description: "নরম সুতা ও নিখুঁত বুনন। কোনো মধ্যস্বত্বভোগী ছাড়া সরাসরি তাঁতিদের থেকে ন্যায্যমূল্যে।",
    videoUrl: "https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/WeAreGoingOnBullrun.mp4",
    thumbnail: "https://images.unsplash.com/photo-1610030469983-98e550d6193c?auto=format&fit=crop&q=80&w=800",
    views: "44.2K",
    likes: 4120,
    shares: 670,
    commentsCount: 312,
    createdAt: new Date().toISOString(),
    timeAgo: "২ ঘণ্টা আগে",
    categoryType: "seller_product",
    category: "প্রোডাক্ট সেলিং (৩০-৬০ সে:)",
    isShort: true,
    creator: {
      id: "v-saree-4",
      name: "তাঁত পল্লী টাঙ্গাইল",
      handle: "tangail_tant",
      avatar: "https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=150&auto=format&fit=crop",
      verified: true,
      followers: "54.1K",
      location: "টাঙ্গাইল"
    },
    linkedProduct: {
      id: "prod-saree-808",
      title: "হাতে বোনা সুতি জামদানি শাড়ি (রয়েল ব্লু)",
      price: 3200,
      originalPrice: 4500,
      discount: 28,
      rating: 4.9,
      image: "https://images.unsplash.com/photo-1610030469983-98e550d6193c?w=800&auto=format&fit=crop&q=80",
      moq: 1,
      inStock: true
    },
    tags: ["জামদানি", "শাড়ি", "টাঙ্গাইল", "তাঁত"]
  }
];

export const INITIAL_LIVE_STREAMS: LiveStreamSession[] = [
  {
    id: "live-khatunganj",
    title: "🔴 খাতুনগঞ্জ পাইকারি বাজার সরাসরি লাইভ সেলিং ও স্পেশাল লট অফার!",
    host: {
      id: "creator-khatunganj",
      name: "Chittagong Agro Trade",
      handle: "ctg_agro",
      avatar: "https://images.unsplash.com/photo-1570295999919-56ceb5ecca61?auto=format&fit=crop&q=80&w=150",
      verified: true,
      followers: "89.5K",
      location: "খাতুনগঞ্জ, চট্টগ্রাম"
    },
    viewersCount: 4280,
    streamUrl: "https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ElephantsDream.mp4",
    thumbnail: "https://images.unsplash.com/photo-1542838132-92c53300491e?auto=format&fit=crop&q=80&w=1200",
    isLive: true,
    startedAt: "15 minutes ago",
    category: "wholesale",
    pinnedProduct: {
      id: "prod-oil-202",
      title: "খাঁটি ঘানি ভাঙা সরিষার তেল ৫ লিটার ক্যান",
      price: 980,
      originalPrice: 1250,
      discount: 22,
      rating: 5.0,
      image: "https://images.unsplash.com/photo-1474979266404-7eaacbcd87c5?auto=format&fit=crop&q=80&w=200",
      moq: 1,
      inStock: true
    },
    chatMessages: [
      { id: "m1", user: "রফিক উল্লাহ (ব্যবসায়ী)", text: "ভাই, ১০০ লিটার অর্ডার দিলে ট্রান্সপোর্ট ফ্রি হবে কি?", time: "10:14 AM" },
      { id: "m2", user: "সায়মা বেগম", text: "তেলের ঘ্রাণ একদম খাঁটি তো ভাইয়া?", time: "10:15 AM" },
      { id: "m3", user: "Chittagong Agro Trade", text: "জি ভাই, লাইভ চলাকালীন অর্ডারে সম্পূর্ণ ফ্রি ডেলিভারি!", time: "10:16 AM", isSeller: true },
      { id: "m4", user: "তানভীর হাসান", text: "অর্ডার দিয়েছি, ক্যাশ অন ডেলিভারি সিলেক্ট করলাম।", time: "10:17 AM" }
    ]
  }
];

class VideoService {
  async getVideos(params?: { category?: string; search?: string }): Promise<VideoItem[]> {
    try {
      const query = new URLSearchParams();
      if (params?.category && params.category !== 'all') query.append('tag', params.category);
      if (params?.search) query.append('search', params.search);
      query.append('type', 'video');

      const res = await fetch(`/api/v1/feed?${query.toString()}`);
      if (res.ok) {
        const data = await res.json();
        if (data.posts && data.posts.length > 0) {
          // Format posts into VideoItems
          const mapped: VideoItem[] = data.posts
            .filter((p: any) => p.videoUrl)
            .map((p: any) => ({
              id: p.id,
              title: p.content.slice(0, 90) + '...',
              description: p.content,
              videoUrl: p.videoUrl,
              thumbnail: p.mediaUrls?.[0] || 'https://images.unsplash.com/photo-1617137984095-74e4e5e3613f?w=800',
              duration: "04:30",
              views: `${p.stats?.likes || 10}K`,
              likes: p.stats?.likes || 120,
              shares: p.stats?.shares || 20,
              commentsCount: p.stats?.comments || 15,
              createdAt: p.createdAt,
              timeAgo: "কিছুক্ষণ আগে",
              category: p.type || "wholesale",
              creator: {
                id: p.sellerId,
                name: p.sellerName || "সেলার",
                avatar: p.avatarUrl || "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150",
                verified: p.isVerified ?? true,
                followers: `${p.followersCount || 1000}`,
                location: p.location
              },
              linkedProduct: p.product ? {
                id: p.product.id,
                title: p.product.title,
                price: p.product.price,
                originalPrice: p.product.originalPrice,
                discount: p.product.discount,
                rating: p.product.rating,
                image: p.product.image,
                moq: p.product.moq,
                inStock: p.product.stock > 0
              } : undefined,
              tags: p.tags || []
            }));
          if (mapped.length > 0) return [...mapped, ...INITIAL_VIDEOS];
        }
      }
    } catch (e) {
      console.warn("VideoService.getVideos fallback:", e);
    }
    return INITIAL_VIDEOS;
  }

  async getVideoById(id: string): Promise<VideoItem | undefined> {
    const all = [...INITIAL_VIDEOS, ...INITIAL_REELS];
    const found = all.find(v => v.id === id);
    if (found) return found;
    // Default fallback to first video
    return INITIAL_VIDEOS[0];
  }

  async getReels(): Promise<VideoItem[]> {
    return INITIAL_REELS;
  }

  async getLiveStreams(): Promise<LiveStreamSession[]> {
    return INITIAL_LIVE_STREAMS;
  }

  async uploadVideo(payload: VideoUploadPayload): Promise<VideoItem> {
    const isYtOrFb = payload.videoUrl.includes('youtube.com') || payload.videoUrl.includes('youtu.be') || payload.videoUrl.includes('facebook.com') || payload.videoUrl.includes('fb.watch');

    const newItem: VideoItem = {
      id: `v-custom-${Date.now()}`,
      title: payload.title,
      description: payload.description,
      videoUrl: payload.videoUrl,
      thumbnail: payload.thumbnail || "https://images.unsplash.com/photo-1617137984095-74e4e5e3613f?w=800",
      duration: "03:00",
      durationSeconds: payload.durationSeconds || 180,
      views: "1",
      likes: 0,
      shares: 0,
      commentsCount: 0,
      createdAt: new Date().toISOString(),
      timeAgo: "এখনই",
      categoryType: payload.categoryType || 'creator',
      category: payload.category || 'কনটেন্ট ক্রিয়েটর (৩ মি:)',
      isExternalLink: isYtOrFb,
      productLinkConfig: payload.productLinkConfig,
      isPaidContent: payload.isPaidContent || false,
      priceAmount: payload.priceAmount || 0,
      previewDurationSeconds: 30,
      creator: {
        id: "current-user",
        name: "আমার চ্যানেল",
        avatar: "https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=150",
        verified: true,
        followers: "1",
        location: "ঢাকা"
      },
      tags: payload.tags || []
    };

    try {
      await fetch('/api/v1/content', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          contentType: payload.isShort ? 'REEL' : 'VIDEO',
          title: payload.title,
          content: payload.description,
          mediaUrl: payload.videoUrl,
          metadata: {
            thumbnail: payload.thumbnail,
            category: payload.category,
            tags: payload.tags
          }
        })
      });
    } catch (e) {
      console.warn("Content API upload sync note:", e);
    }

    return newItem;
  }
}

export const videoService = new VideoService();
