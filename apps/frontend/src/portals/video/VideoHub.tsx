import React, { useState, useEffect } from "react";
import { 
  Film, Compass, Radio, Flame, Sparkles, PlusCircle, Search, 
  ArrowRight, Eye, TrendingUp, Store, Filter, RefreshCw
} from "lucide-react";
import { motion } from "motion/react";
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

  const [activeTab, setActiveTab] = useState<"feed" | "reels" | "live">("feed");
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
    <div className="w-full max-w-7xl mx-auto px-4 py-6 text-white pb-28 space-y-8 select-none">
      {/* ─── 1. TOP HEADER & SEARCH ─── */}
      <div className="flex flex-col md:flex-row items-stretch md:items-center justify-between gap-4 pb-6 border-b border-white/10">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="p-2 rounded-2xl bg-[#FF7A00]/20 text-[#FF7A00] border border-[#FF7A00]/30">
              <Film className="h-5 w-5" />
            </span>
            <h1 className="text-xl sm:text-2xl font-black tracking-tight text-white">
              PaikarMart Video & Commerce OTT
            </h1>
          </div>
          <p className="text-xs text-zinc-400">
            শপেবল ভিডিও রিভিউ, ফ্যাক্টরি ইনস্পেকশন, পাইকারি মোকাম লাইভ ও ক্রিয়েটর রিলস
          </p>
        </div>

        {/* Action Controls */}
        <div className="flex items-center gap-2.5">
          <button
            onClick={() => setIsUploadOpen(true)}
            className="flex-1 sm:flex-initial flex items-center justify-center gap-2 px-4 py-2.5 rounded-2xl bg-[#FF7A00] hover:bg-[#e06b00] text-white text-xs font-black shadow-lg shadow-[#FF7A00]/25 transition-all active:scale-95 cursor-pointer"
          >
            <PlusCircle className="h-4 w-4" />
            <span>ভিডিও আপলোড</span>
          </button>

          <Link
            to="/video/shorts"
            className="flex items-center gap-1.5 px-4 py-2.5 rounded-2xl bg-white/10 hover:bg-white/15 text-white text-xs font-bold border border-white/10 transition-all"
          >
            <Flame className="h-4 w-4 text-[#FF7A00]" />
            <span>রিলস ফিড</span>
          </Link>
        </div>
      </div>

      {/* ─── 2. SEARCH & CATEGORY FILTERS ─── */}
      <div className="space-y-3">
        {/* Search Bar */}
        <div className="relative">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-zinc-500" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="পাইকারি পণ্য, মোকাম, ফ্যাক্টরি ট্যুর কিংবা ব্র্যান্ড রিভিউ খুঁজুন..."
            className="w-full pl-11 pr-4 py-3 rounded-2xl bg-zinc-900/80 border border-white/10 text-xs text-white placeholder-zinc-500 focus:outline-none focus:border-[#FF7A00] transition-colors"
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
        <div className="flex items-center gap-2 overflow-x-auto pb-2 no-scrollbar">
          {CATEGORIES.map((cat) => {
            const isActive = selectedCategory === cat.id;
            return (
              <button
                key={cat.id}
                onClick={() => setSelectedCategory(cat.id)}
                className={`flex items-center gap-1.5 px-4 py-2 rounded-xl text-xs font-bold whitespace-nowrap transition-all border shrink-0 cursor-pointer ${
                  isActive
                    ? 'bg-gradient-to-r from-[#FF7A00] to-amber-500 text-white border-transparent shadow-md shadow-[#FF7A00]/20'
                    : 'bg-zinc-900/60 text-zinc-400 border-white/5 hover:bg-zinc-800 hover:text-white'
                }`}
              >
                <span>{cat.label}</span>
              </button>
            );
          })}
        </div>
      </div>



      {/* ─── 4. TRENDING REELS / SHORTS HORIZONTAL CAROUSEL ─── */}
      <section className="space-y-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <span className="p-1.5 rounded-xl bg-[#FF7A00]/20 text-[#FF7A00]">
              <Flame className="w-4 h-4" />
            </span>
            <h2 className="text-base font-black text-white">ট্রেন্ডিং রিলস ও শর্ট ভিডিও</h2>
          </div>

          <Link
            to="/video/shorts"
            className="text-xs font-bold text-[#FF7A00] hover:underline flex items-center gap-1"
          >
            <span>সবগুলো দেখুন</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </Link>
        </div>

        <div className="flex gap-3.5 sm:gap-4 overflow-x-auto pb-4 no-scrollbar snap-x snap-mandatory items-center">
          {reels.map((reel, idx) => (
            <div
              key={reel.id}
              onClick={() => navigate('/video/shorts')}
              className="relative w-[130px] sm:w-[150px] md:w-[170px] aspect-[9/16] rounded-2xl sm:rounded-3xl overflow-hidden bg-zinc-900 border border-white/10 shrink-0 snap-start group hover:border-[#FF7A00]/50 transition-all cursor-pointer shadow-xl flex flex-col justify-between p-3"
            >
              <img 
                src={reel.thumbnail} 
                alt={reel.title} 
                className="absolute inset-0 w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                referrerPolicy="no-referrer"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black via-black/20 to-black/30 pointer-events-none" />

              {/* Top View Badge */}
              <div className="relative z-10 flex justify-end">
                <span className="px-2 py-0.5 rounded-md bg-black/70 backdrop-blur-md text-[10px] text-white font-bold flex items-center gap-1">
                  <Eye className="w-3 h-3 text-[#FF7A00]" /> {reel.views}
                </span>
              </div>

              {/* Bottom Caption & Product */}
              <div className="relative z-10 space-y-2 text-left">
                <p className="text-xs font-bold text-white line-clamp-2 leading-snug drop-shadow-md">
                  {reel.title}
                </p>

                {reel.linkedProduct && (
                  <div className="p-2 rounded-xl bg-black/80 backdrop-blur-md border border-white/10 flex items-center gap-2">
                    <img 
                      src={reel.linkedProduct.image} 
                      alt={reel.linkedProduct.title} 
                      className="w-7 h-7 rounded-lg object-cover"
                      referrerPolicy="no-referrer"
                    />
                    <div className="min-w-0">
                      <p className="text-[10px] font-bold text-white truncate">{reel.linkedProduct.title}</p>
                      <p className="text-[11px] font-black text-[#FF7A00]">৳{reel.linkedProduct.price.toLocaleString()}</p>
                    </div>
                  </div>
                )}
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* ─── 5. COMMERCE VIDEO REVIEWS & FEED GRID ─── */}
      <section className="space-y-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <span className="p-1.5 rounded-xl bg-indigo-500/20 text-indigo-400">
              <Compass className="w-4 h-4" />
            </span>
            <h2 className="text-base font-black text-white">
              শপেবল কমার্স ও ফ্যাক্টরি ভিডিও ({filteredVideos.length})
            </h2>
          </div>

          <button
            onClick={() => fetchVideos()}
            className="p-2 rounded-xl bg-white/5 hover:bg-white/10 text-zinc-400 hover:text-white transition-colors cursor-pointer"
            title="রিফ্রেশ করুন"
          >
            <RefreshCw className={`w-4 h-4 ${isLoading ? 'animate-spin' : ''}`} />
          </button>
        </div>

        {filteredVideos.length === 0 ? (
          <div className="p-12 text-center bg-zinc-900/50 rounded-3xl border border-dashed border-white/10 space-y-3">
            <Film className="w-10 h-10 text-zinc-600 mx-auto" />
            <h4 className="font-bold text-sm text-white">কোনো ভিডিও পাওয়া যায়নি</h4>
            <p className="text-xs text-zinc-500">অন্য কোনো ক্যাটাগরি বা সার্চ কিওয়ার্ড বেছে নিয়ে চেষ্টা করুন।</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
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
