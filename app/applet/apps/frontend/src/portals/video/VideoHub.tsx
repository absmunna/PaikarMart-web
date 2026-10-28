import React, { useState, useEffect } from "react";
import { 
  Film, Compass, Radio, Flame, Sparkles, PlusCircle, Search, 
  ArrowRight, Eye, TrendingUp, Store, Filter, RefreshCw
} from "lucide-react";
import { Link, useNavigate } from "react-router-dom";
import { useVideoStore } from "@/modules/video";
import { ShoppableVideoCard } from "@/modules/video/components/ShoppableVideoCard";
import { VideoUploadModal } from "@/modules/video/components/VideoUploadModal";
import { StoryBar } from "@/shared/StoryBar";

const CATEGORIES = [
  { id: "all", label: "সব ভিডিও (All)" },
  { id: "creator", label: "🎬 কনটেন্ট ক্রিয়েটর (৩ মি:)" },
  { id: "seller_product", label: "🛍️ প্রোডাক্ট সেলিং (৩০-৬০ সে:)" },
  { id: "vlog_premium", label: "⭐ পার্সোনাল ব্লগ ও পেড শো" },
  { id: "wholesale", label: "পাইকারি বাজার (Wholesale)" },
  { id: "factory", label: "ফ্যাক্টরি ট্যুর (Factory)" },
  { id: "agro", label: "কৃষি ও খামার (Agro)" },
  { id: "tech", label: "গ্যাজেট আনবক্সিং (Tech)" }
];

export default function VideoHubPortal() {
  const navigate = useNavigate();
  const { 
    videos, 
    reels, 
    liveStreams, 
    fetchVideos, 
    selectedCategory, 
    setSelectedCategory,
    searchQuery,
    setSearchQuery,
    isLoading 
  } = useVideoStore();

  const [isUploadOpen, setIsUploadOpen] = useState(false);

  useEffect(() => {
    fetchVideos();
  }, []);

  const filteredVideos = videos.filter(v => {
    if (selectedCategory !== "all") {
      if (['creator', 'seller_product', 'vlog_premium'].includes(selectedCategory)) {
        if (v.categoryType !== selectedCategory) return false;
      } else if (v.category !== selectedCategory) {
        return false;
      }
    }
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      return (
        v.title.toLowerCase().includes(q) ||
        v.description.toLowerCase().includes(q) ||
        v.creator.name.toLowerCase().includes(q)
      );
    }
    return true;
  });

  const featuredLive = liveStreams[0];

  return (
    <div className="w-full max-w-7xl mx-auto px-4 py-4 text-white pb-28 space-y-6 select-none">
      {/* ─── 1. TOP HEADER & ACTIONS ─── */}
      <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3 pb-4 border-b border-white/10">
        <div>
          <div className="flex items-center gap-2">
            <span className="p-2 rounded-xl bg-[#FF7A00]/20 text-[#FF7A00] border border-[#FF7A00]/30">
              <Film className="h-5 w-5" />
            </span>
            <h1 className="text-lg sm:text-xl font-black tracking-tight text-white">
              PaikarMart Video OTT
            </h1>
          </div>
          <p className="text-[11px] text-zinc-400 mt-0.5">
            শপেবল ভিডিও রিভিউ, মোকাম লাইভ ও ক্রিয়েটর রিলস
          </p>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={() => setIsUploadOpen(true)}
            className="flex-1 sm:flex-initial flex items-center justify-center gap-1.5 px-3.5 py-2 rounded-xl bg-[#FF7A00] hover:bg-[#e06b00] text-white text-xs font-black shadow-md shadow-[#FF7A00]/20 transition-all active:scale-95 cursor-pointer"
          >
            <PlusCircle className="h-3.5 w-3.5" />
            <span>আপলোড</span>
          </button>

          <Link
            to="/video/shorts"
            className="flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-white/10 hover:bg-white/15 text-white text-xs font-bold border border-white/10 transition-all"
          >
            <Flame className="h-3.5 w-3.5 text-[#FF7A00]" />
            <span>রিলস ফিড</span>
          </Link>
        </div>
      </div>

      {/* ─── 2. STORYBAR RIGHT BELOW MAIN HEADER ─── */}
      <section className="space-y-2">
        <div className="flex items-center justify-between px-1">
          <h2 className="text-xs font-bold uppercase tracking-wider text-zinc-400">স্টোরিজ ও শর্টস</h2>
          <span className="text-[10px] text-[var(--pm-accent)] font-bold">ট্যাপ করে দেখুন</span>
        </div>
        <StoryBar context="video" />
      </section>

      {/* ─── 3. SEARCH & CATEGORY FILTERS ─── */}
      <div className="space-y-3">
        {/* Search Bar */}
        <div className="relative">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-zinc-500" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="পাইকারি পণ্য, মোকাম, ফ্যাক্টরি ট্যুর কিংবা ব্র্যান্ড রিভিউ খুঁজুন..."
            className="w-full pl-11 pr-4 py-2.5 rounded-2xl bg-zinc-900/80 border border-white/10 text-xs text-white placeholder-zinc-500 focus:outline-none focus:border-[#FF7A00] transition-colors"
          />
          {searchQuery && (
            <button
              onClick={() => setSearchQuery('')}
              className="absolute right-3.5 top-1/2 -translate-y-1/2 text-xs text-zinc-400 hover:text-white"
            >
              ✕
            </button>
          )}
        </div>

        {/* Category Pills */}
        <div className="flex items-center gap-2 overflow-x-auto pb-1 no-scrollbar">
          {CATEGORIES.map((cat) => {
            const isActive = selectedCategory === cat.id;
            return (
              <button
                key={cat.id}
                onClick={() => setSelectedCategory(cat.id)}
                className={`flex items-center gap-1 px-3.5 py-1.5 rounded-xl text-xs font-bold whitespace-nowrap transition-all border shrink-0 cursor-pointer ${
                  isActive
                    ? 'bg-gradient-to-r from-[#FF7A00] to-amber-500 text-white border-transparent shadow-sm'
                    : 'bg-zinc-900/60 text-zinc-400 border-white/5 hover:bg-zinc-800 hover:text-white'
                }`}
              >
                <span>{cat.label}</span>
              </button>
            );
          })}
        </div>
      </div>

      {/* ─── 4. FEATURED LIVE SELLING HERO BANNER ─── */}
      {featuredLive && (
        <section className="relative rounded-2xl overflow-hidden bg-gradient-to-r from-red-950/40 via-zinc-900 to-[#121424] border border-rose-500/20 p-5 shadow-xl">
          <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4 relative z-10">
            <div className="space-y-2 max-w-xl">
              <div className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-rose-600 text-white text-[10px] font-black uppercase tracking-wider animate-pulse">
                <Radio className="w-3 h-3" />
                <span>লাইভ সেলিং ব্রডকাস্ট</span>
              </div>
              <h2 className="text-base sm:text-lg font-black text-white leading-tight">
                {featuredLive.title}
              </h2>
              <p className="text-xs text-zinc-300">
                খাতুনগঞ্জ মোকাম থেকে পাইকারি পণ্যের লাইভ নিলাম ও বিশেষ ছাড়।
              </p>
            </div>

            <Link
              to={`/video/live/${featuredLive.id}`}
              className="px-5 py-2.5 rounded-xl bg-rose-600 hover:bg-rose-500 text-white font-black text-xs shadow-md shadow-rose-600/30 transition-all active:scale-95"
            >
              লাইভে যোগ দিন
            </Link>
          </div>
        </section>
      )}

      {/* ─── 5. TRENDING REELS / SHORTS HORIZONTAL CAROUSEL ─── */}
      <section className="space-y-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-1.5">
            <Flame className="w-4 h-4 text-[#FF7A00]" />
            <h2 className="text-sm font-black text-white">ট্রেন্ডিং রিলস ও শর্ট ভিডিও</h2>
          </div>
          <Link
            to="/video/shorts"
            className="text-xs font-bold text-[#FF7A00] hover:underline flex items-center gap-1"
          >
            <span>সবগুলো</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </Link>
        </div>

        <div className="flex gap-3 overflow-x-auto pb-2 no-scrollbar snap-x snap-mandatory items-center">
          {reels.map((reel) => (
            <div
              key={reel.id}
              onClick={() => navigate('/video/shorts')}
              className="relative w-[120px] sm:w-[140px] aspect-[9/16] rounded-2xl overflow-hidden bg-zinc-900 border border-white/10 shrink-0 snap-start group hover:border-[#FF7A00]/50 transition-all cursor-pointer shadow-lg flex flex-col justify-between p-2.5"
            >
              <img 
                src={reel.thumbnail} 
                alt={reel.title} 
                className="absolute inset-0 w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                referrerPolicy="no-referrer"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black via-black/20 to-transparent pointer-events-none" />

              <div className="relative z-10 flex justify-end">
                <span className="px-1.5 py-0.5 rounded bg-black/70 backdrop-blur-md text-[9px] text-white font-bold flex items-center gap-0.5">
                  <Eye className="w-2.5 h-2.5 text-[#FF7A00]" /> {reel.views}
                </span>
              </div>

              <div className="relative z-10">
                <p className="text-[11px] font-bold text-white line-clamp-2 leading-tight drop-shadow-md">
                  {reel.title}
                </p>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* ─── 6. COMMERCE VIDEO REVIEWS & FEED GRID ─── */}
      <section className="space-y-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-1.5">
            <Compass className="w-4 h-4 text-indigo-400" />
            <h2 className="text-sm font-black text-white">
              শপেবল কমার্স ও ফ্যাক্টরি ভিডিও ({filteredVideos.length})
            </h2>
          </div>
          <button
            onClick={() => fetchVideos()}
            className="p-1.5 rounded-lg bg-white/5 hover:bg-white/10 text-zinc-400 hover:text-white transition-colors cursor-pointer"
            title="রিফ্রেশ"
          >
            <RefreshCw className={`w-3.5 h-3.5 ${isLoading ? 'animate-spin' : ''}`} />
          </button>
        </div>

        {filteredVideos.length === 0 ? (
          <div className="p-8 text-center bg-zinc-900/50 rounded-2xl border border-dashed border-white/10 space-y-2">
            <Film className="w-8 h-8 text-zinc-600 mx-auto" />
            <p className="text-xs text-zinc-500">কোনো ভিডিও পাওয়া যায়নি</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {filteredVideos.map((video) => (
              <ShoppableVideoCard key={video.id} video={video} />
            ))}
          </div>
        )}
      </section>

      {/* Upload Modal */}
      <VideoUploadModal 
        isOpen={isUploadOpen}
        onClose={() => setIsUploadOpen(false)}
      />
    </div>
  );
}
