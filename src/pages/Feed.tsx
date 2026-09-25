import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Heart, MessageCircle, Share2, MoreHorizontal, MapPin, 
  ShoppingBag, Star, CheckCircle2, Send, Building2, Store, 
  Flame, Tag, TrendingUp, Sparkles, MessageSquare
} from 'lucide-react';
import { StoryBar } from '../components/feed/StoryBar';
import { TrendingRail } from '../components/feed/TrendingRail';
import { useCartStore } from '../modules/cart';
import { useCartDrawerStore } from '../modules/cart/cartDrawerStore';
import { toast } from 'sonner';
import { Link } from 'react-router-dom';

interface CommercePost {
  id: string;
  author: {
    name: string;
    avatar: string;
    type: 'factory' | 'wholesaler' | 'retail' | 'buyer';
    typeLabel: string;
    location: string;
    verified: boolean;
  };
  content: string;
  badge: string;
  image?: string;
  productInfo?: {
    id: string;
    title: string;
    price: number;
    originalPrice?: number;
    moq?: number;
    unit?: string;
  };
  likes: number;
  commentsCount: number;
  timeAgo: string;
  isLiked?: boolean;
}

const INITIAL_POSTS: CommercePost[] = [
  {
    id: 'post-01',
    author: {
      name: 'ঢাকা টেক্সটাইল অ্যান্ড ডেনিম মিলস',
      avatar: '🏭',
      type: 'factory',
      typeLabel: 'ফ্যাক্টরি ডিরেক্ট',
      location: 'টঙ্গী শিল্পাঞ্চল, গাজীপুর',
      verified: true
    },
    content: 'নতুন লটের প্রিমিয়াম এক্সপোর্ট কোয়ালিটি ডেনিম ফেব্রিক (১২.৫ ওজ) মিল-গেটে উপলব্ধ। ন্যূনতম অর্ডার ৫০০ গজ। যেকোনো ডাইং ও ওয়াশ স্পেসিফিকেশনে সরবরাহ সম্ভব। কোটেশন পাঠাতে ইনবক্স করুন। 👖🧵',
    badge: 'বাল্ক টেক্সটাইল অফার',
    image: 'https://images.unsplash.com/photo-1582533561751-ef6f6ab93a2e?w=800',
    productInfo: {
      id: 'prod-denim-01',
      title: 'প্রিমিয়াম এক্সপোর্ট ডেনিম ফেব্রিক (১২.৫ ওজ)',
      price: 180,
      originalPrice: 240,
      moq: 500,
      unit: 'গজ'
    },
    likes: 342,
    commentsCount: 38,
    timeAgo: '১ ঘন্টা আগে'
  },
  {
    id: 'post-02',
    author: {
      name: 'রাজশাহী খাঁটি আম্রপালি বাগান',
      avatar: '🥭',
      type: 'wholesaler',
      typeLabel: 'ফার্ম সোর্সড',
      location: 'বাঘা, রাজশাহী',
      verified: true
    },
    content: 'রাসায়নিকমুক্ত গাছপাকা আম্রপালি আমের প্রথম চালান সরাসরি বাগান থেকে ঢাকায় এসে পৌঁছেছে। খুচরা ক্রেতা ও ফ্রুটস শপের জন্য স্পেশাল অফার চলছে। প্রতি ক্যারেট ২০ কেজি। 🥭🌿',
    badge: 'মৌসুমি ফ্রেশ অফার',
    image: 'https://images.unsplash.com/photo-1553279768-865429fa0078?w=800',
    productInfo: {
      id: 'prod-mango-01',
      title: 'ফরমালিনমুক্ত প্রিমিয়াম আম্রপালি আম (২০ কেজি ক্যারেট)',
      price: 2400,
      originalPrice: 2800,
      moq: 1,
      unit: 'ক্যারেট'
    },
    likes: 512,
    commentsCount: 64,
    timeAgo: '২ ঘন্টা আগে'
  },
  {
    id: 'post-03',
    author: {
      name: 'মতিঝিল গ্যাজেট ইমপোর্টার্স সিন্ডিকেট',
      avatar: '🔌',
      type: 'wholesaler',
      typeLabel: 'ভেরিফাইড ইমপোর্টার',
      location: 'মতিঝিল, ঢাকা',
      verified: true
    },
    content: 'হট সামার এক্সক্লুসিভ! ফোল্ডেবল রিচার্জেবল নেক ফ্যান ও ডেস্ক ফ্যান বাল্ক কোয়ান্টিটিতে রেডি স্টক। ছোট ও মাঝারি রিটেইলারদের জন্য আকর্ষণীয় মার্জিন। দ্রুত বুকিং দিন! ⚡🌬️',
    badge: 'হোলসেল গ্যাজেট লট',
    image: 'https://images.unsplash.com/photo-1563245372-f21724e3856d?w=800',
    productInfo: {
      id: 'prod-fan-01',
      title: 'রিচার্জেবল মিনি নেক ফ্যান (৫০ পিস বাল্ক লট)',
      price: 420,
      originalPrice: 650,
      moq: 50,
      unit: 'পিস'
    },
    likes: 289,
    commentsCount: 22,
    timeAgo: '৪ ঘন্টা আগে'
  },
  {
    id: 'post-04',
    author: {
      name: 'উত্তরা সুপার মার্ট (ক্রেতা)',
      avatar: '🏪',
      type: 'buyer',
      typeLabel: 'বায়ার ডিমান্ড',
      location: 'উত্তরা সেক্টর-১১, ঢাকা',
      verified: true
    },
    content: '【জরুরি বায়ার ডিমান্ড】 আমাদের ৫টি চেইন স্টোরের জন্য মাসিক ২০০০ কেজি মিনিকেট ও নাজিরশাইল চাল প্রয়োজন। সরাসরি অটো রাইস মিলারদের সাথে দীর্ঘমেয়াদী চুক্তির জন্য যোগাযোগ করতে অনুরোধ করা হচ্ছে। 🌾',
    badge: 'জরুরি বাল্ক ক্রয় রিকোয়েস্ট',
    image: 'https://images.unsplash.com/photo-1586201375761-83865001e31c?w=800',
    likes: 198,
    commentsCount: 45,
    timeAgo: '৬ ঘন্টা আগে'
  }
];

const FILTERS = ['সব কমার্স ফিড', 'পাইকারি অফার', 'ফ্রেশ ফুড ও এগ্রো', 'গ্যাজেট ও টেক', 'ক্রেতার ডিমান্ড'];

export default function Feed() {
  const [activeFilter, setActiveFilter] = useState('সব কমার্স ফিড');
  const [posts, setPosts] = useState<CommercePost[]>(INITIAL_POSTS);
  const [commentInput, setCommentInput] = useState<{ [key: string]: string }>({});
  const [activeCommentPostId, setActiveCommentPostId] = useState<string | null>(null);

  const addItem = useCartStore((state) => state.addItem);
  const openCart = useCartDrawerStore((state) => state.open);

  const handleToggleLike = (postId: string) => {
    setPosts((prev) =>
      prev.map((post) => {
        if (post.id === postId) {
          const isLiked = !post.isLiked;
          return {
            ...post,
            isLiked,
            likes: isLiked ? post.likes + 1 : post.likes - 1
          };
        }
        return post;
      })
    );
  };

  const handleAddPostProductToCart = (post: CommercePost) => {
    if (!post.productInfo) return;
    const p = post.productInfo;
    addItem({
      id: p.id,
      name: `${p.title}${p.moq && p.moq > 1 ? ` (${p.moq} ${p.unit || 'পিস'} লট)` : ''}`,
      price: p.price * (p.moq || 1),
      image: post.image || 'https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=500',
      portal: post.author.type === 'factory' || post.author.type === 'wholesaler' ? 'wholesale' : 'b2c',
      vendorName: post.author.name
    });
    toast.success(`কার্টে যোগ করা হয়েছে: ${p.title}`);
    openCart();
  };

  const handleSharePost = (post: CommercePost) => {
    if (navigator.clipboard) {
      navigator.clipboard.writeText(window.location.href);
      toast.success("পোস্টের লিংক কপি করা হয়েছে!");
    } else {
      toast.success("শেয়ার অপশন সম্পন্ন হয়েছে");
    }
  };

  const handleSendComment = (postId: string) => {
    const text = commentInput[postId];
    if (!text || !text.trim()) return;

    setPosts((prev) =>
      prev.map((p) => (p.id === postId ? { ...p, commentsCount: p.commentsCount + 1 } : p))
    );
    setCommentInput((prev) => ({ ...prev, [postId]: '' }));
    toast.success("ইনকোয়ারি/মন্তব্য পোস্ট করা হয়েছে");
  };

  return (
    <div className="w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 pb-28 text-[var(--pm-text)]">
      
      {/* Commerce Feed Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
        <div>
          <div className="flex items-center gap-2">
            <span className="p-1.5 rounded-lg bg-rose-500/10 text-rose-400">
              <TrendingUp className="w-5 h-5" />
            </span>
            <h1 className="text-xl sm:text-2xl font-black tracking-tight">সোশ্যাল কমার্স ফিড</h1>
          </div>
          <p className="text-xs text-[var(--pm-text-muted)] mt-0.5">
            সরাসরি সেলারদের পণ্যের আপডেট, পাইকারি অফার ও বায়ারদের ডিমান্ড পোস্ট
          </p>
        </div>

        {/* Filter Chips */}
        <div className="flex gap-2 overflow-x-auto pb-1 no-scrollbar">
          {FILTERS.map((f) => (
            <button
              key={f}
              onClick={() => setActiveFilter(f)}
              className={`px-3.5 py-1.5 rounded-xl text-xs font-bold transition-all whitespace-nowrap border shrink-0 ${
                activeFilter === f
                  ? "bg-rose-500 text-white border-rose-500 shadow-md shadow-rose-500/20"
                  : "bg-[var(--pm-surface)] hover:bg-[var(--pm-surface-hover)] text-[var(--pm-text-muted)] hover:text-[var(--pm-text)] border-[var(--pm-border)]"
              }`}
            >
              {f}
            </button>
          ))}
        </div>
      </div>

      {/* Main Grid: Desktop 2-Column Contract */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        
        {/* Left / Center Feed Column (8 cols) */}
        <div className="lg:col-span-8 space-y-6">
          
          {/* Story Bar */}
          <StoryBar />

          {/* Posts Stream */}
          <div className="space-y-6">
            {posts.map((post) => (
              <div
                key={post.id}
                className="rounded-3xl bg-[var(--pm-surface)] border border-[var(--pm-border)] overflow-hidden shadow-sm hover:shadow-md transition-shadow"
              >
                {/* Author Bar */}
                <div className="p-4 sm:p-5 flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className="w-11 h-11 rounded-2xl bg-gradient-to-br from-rose-500/15 to-orange-500/15 border border-[var(--pm-border)] flex items-center justify-center text-xl shrink-0 shadow-xs">
                      {post.author.avatar}
                    </div>
                    <div>
                      <div className="flex items-center gap-2">
                        <h3 className="text-sm font-bold text-[var(--pm-text)]">{post.author.name}</h3>
                        {post.author.verified && (
                          <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" />
                        )}
                        <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-white/5 border border-white/10 text-rose-400">
                          {post.author.typeLabel}
                        </span>
                      </div>
                      <div className="flex items-center gap-2 text-[11px] text-[var(--pm-text-muted)] mt-0.5">
                        <span className="flex items-center gap-1">
                          <MapPin className="w-3 h-3 text-rose-400" />
                          {post.author.location}
                        </span>
                        <span>• {post.timeAgo}</span>
                      </div>
                    </div>
                  </div>

                  <span className="text-[10px] font-black uppercase px-2.5 py-1 rounded-full bg-rose-500/10 text-rose-400 border border-rose-500/20 hidden sm:inline-block">
                    {post.badge}
                  </span>
                </div>

                {/* Text Content */}
                <div className="px-4 sm:px-5 pb-3">
                  <p className="text-xs sm:text-sm text-[var(--pm-text)] leading-relaxed whitespace-pre-line">
                    {post.content}
                  </p>
                </div>

                {/* Media Section with Price Overlay */}
                {post.image && (
                  <div className="relative aspect-[16/9] w-full overflow-hidden bg-black/20 border-y border-[var(--pm-border)]">
                    <img
                      src={post.image}
                      alt="Post visual"
                      className="w-full h-full object-cover hover:scale-102 transition-transform duration-500"
                    />
                    {post.productInfo && (
                      <div className="absolute bottom-3 left-3 right-3 sm:right-auto bg-black/80 backdrop-blur-md border border-white/15 p-3 rounded-2xl flex items-center justify-between gap-4 shadow-xl">
                        <div>
                          <p className="text-xs font-bold text-white line-clamp-1">{post.productInfo.title}</p>
                          <div className="flex items-baseline gap-2 mt-0.5">
                            <span className="text-sm font-black text-rose-400">৳{post.productInfo.price}</span>
                            {post.productInfo.originalPrice && (
                              <span className="text-[10px] text-zinc-400 line-through">৳{post.productInfo.originalPrice}</span>
                            )}
                            {post.productInfo.moq && (
                              <span className="text-[10px] text-amber-400 font-bold bg-amber-500/20 px-1.5 py-0.5 rounded">
                                MOQ: {post.productInfo.moq} {post.productInfo.unit}
                              </span>
                            )}
                          </div>
                        </div>
                        <button
                          onClick={() => handleAddPostProductToCart(post)}
                          className="px-3.5 py-2 rounded-xl bg-rose-500 hover:bg-rose-600 text-white text-xs font-black shrink-0 active:scale-95 transition-all shadow-md shadow-rose-500/20 flex items-center gap-1.5"
                        >
                          <ShoppingBag className="w-3.5 h-3.5" /> কিনুন
                        </button>
                      </div>
                    )}
                  </div>
                )}

                {/* Action Toolbar */}
                <div className="p-3 sm:p-4 flex items-center justify-between">
                  <div className="flex items-center gap-4">
                    <button
                      onClick={() => handleToggleLike(post.id)}
                      className={`flex items-center gap-1.5 text-xs font-bold transition-all ${
                        post.isLiked ? "text-rose-500" : "text-[var(--pm-text-muted)] hover:text-rose-500"
                      }`}
                    >
                      <Heart className={`w-4 h-4 ${post.isLiked ? "fill-rose-500" : ""}`} />
                      <span>{post.likes}</span>
                    </button>

                    <button
                      onClick={() => setActiveCommentPostId(activeCommentPostId === post.id ? null : post.id)}
                      className="flex items-center gap-1.5 text-xs font-bold text-[var(--pm-text-muted)] hover:text-blue-400 transition-colors"
                    >
                      <MessageCircle className="w-4 h-4" />
                      <span>{post.commentsCount}</span>
                    </button>

                    <button
                      onClick={() => handleSharePost(post)}
                      className="flex items-center gap-1.5 text-xs font-bold text-[var(--pm-text-muted)] hover:text-emerald-400 transition-colors"
                    >
                      <Share2 className="w-4 h-4" />
                    </button>
                  </div>

                  <Link
                    to="/messages"
                    className="px-3 py-1.5 rounded-xl bg-[var(--pm-surface-hover)] hover:bg-[var(--pm-border)] text-xs font-bold text-[var(--pm-text)] transition-colors flex items-center gap-1.5"
                  >
                    <MessageSquare className="w-3.5 h-3.5 text-rose-400" />
                    <span>সেলার চ্যাট</span>
                  </Link>
                </div>

                {/* Comment / Inquire Box */}
                {activeCommentPostId === post.id && (
                  <div className="p-3 sm:p-4 pt-0 border-t border-[var(--pm-border)]/50 space-y-2">
                    <div className="flex items-center gap-2 pt-2">
                      <input
                        type="text"
                        placeholder="পণ্য সম্পর্কে প্রশ্ন বা কোটেশন চান? এখানে লিখুন..."
                        value={commentInput[post.id] || ''}
                        onChange={(e) => setCommentInput({ ...commentInput, [post.id]: e.target.value })}
                        onKeyDown={(e) => {
                          if (e.key === 'Enter') handleSendComment(post.id);
                        }}
                        className="flex-1 bg-[var(--pm-surface-hover)] border border-[var(--pm-border)] rounded-xl px-4 py-2 text-xs text-[var(--pm-text)] outline-none focus:border-rose-500"
                      />
                      <button
                        onClick={() => handleSendComment(post.id)}
                        className="p-2 rounded-xl bg-rose-500 text-white hover:bg-rose-600 transition-colors"
                      >
                        <Send className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  </div>
                )}
              </div>
            ))}
          </div>

        </div>

        {/* Right Desktop Rail (4 cols) */}
        <aside className="hidden lg:block lg:col-span-4 space-y-6 shrink-0">
          
          {/* Trending Deals Rail */}
          <TrendingRail />

          {/* Urgent Wholesale Demands Box */}
          <div className="p-5 rounded-3xl bg-[var(--pm-surface)] border border-[var(--pm-border)] shadow-xs space-y-4">
            <div className="flex items-center justify-between">
              <h3 className="text-sm font-black text-[var(--pm-text)] flex items-center gap-2">
                <Flame className="w-4 h-4 text-amber-400" /> জরুরি বায়ার ডিমান্ড
              </h3>
              <Link to="/demand" className="text-xs font-bold text-rose-400 hover:underline">
                সব দেখুন
              </Link>
            </div>

            <div className="space-y-3">
              {[
                { title: "১০০% কটন গ্রে ফেব্রিক (৫০০০ গজ)", budget: "৳ ৩,৫০,০০০", buyer: "আরাফাত টেক্সটাইল", days: "২ দিন বাকি" },
                { title: "মিনিকেট চাল ৫০ বস্তা (মিলার রেট)", budget: "৳ ১,৫০,০০০", buyer: "গ্রিন গ্রোসারি", days: "জরুরি" },
                { title: "টি-শার্ট প্রিন্টিং সাব-কন্ট্রাক্ট (২০০০ পিস)", budget: "৳ ৭০,০০০", buyer: "ডিজাইন পয়েন্ট", days: "৩ দিন বাকি" }
              ].map((item, idx) => (
                <div key={idx} className="p-3 rounded-2xl bg-[var(--pm-surface-hover)] border border-[var(--pm-border)]/50 space-y-1.5">
                  <p className="text-xs font-bold text-[var(--pm-text)]">{item.title}</p>
                  <div className="flex items-center justify-between text-[11px]">
                    <span className="font-black text-emerald-400">{item.budget}</span>
                    <span className="text-[var(--pm-text-muted)]">{item.buyer}</span>
                  </div>
                  <div className="flex items-center justify-between pt-1 border-t border-[var(--pm-border)]/40 text-[10px]">
                    <span className="text-amber-400 font-bold">{item.days}</span>
                    <Link to="/demand" className="text-rose-400 font-bold hover:underline">
                      কোটেশন পাঠান →
                    </Link>
                  </div>
                </div>
              ))}
            </div>
          </div>

        </aside>

      </div>

    </div>
  );
}
