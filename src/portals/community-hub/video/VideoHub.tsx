import React, { useState } from "react";
import { 
  Play, Radio, Film, Compass, Heart, Share2, ShoppingBag, 
  MessageCircle, PlusCircle, Sparkles, TrendingUp, User, Eye, CheckCircle2, Flame
} from "lucide-react";
import { motion, AnimatePresence } from "motion/react";
import { Link, useNavigate } from "react-router-dom";
import { cn } from "@/lib/utils";

interface VideoItem {
  id: string;
  title: string;
  creator: {
    id: string;
    name: string;
    avatar: string;
    verified: boolean;
    followers: string;
  };
  thumbnail: string;
  views: string;
  timeAgo: string;
  category: string;
  isLive?: boolean;
  isShort?: boolean;
  linkedProduct?: {
    name: string;
    price: number;
    rating: number;
    image: string;
  };
}

const MOCK_VIDEOS: VideoItem[] = [
  {
    id: "v1",
    title: "লেকচারার কোয়ালিটি এক্সক্লুসিভ প্রিমিয়াম পাঞ্জাবি কালেকশন | Direct Factory Review",
    creator: {
      id: "dhaka-fashion",
      name: "Dhaka Fashion Hub",
      avatar: "https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?auto=format&fit=crop&q=80&w=150",
      verified: true,
      followers: "45.2K",
    },
    thumbnail: "https://images.unsplash.com/photo-1617137984095-74e4e5e3613f?auto=format&fit=crop&q=80&w=800",
    views: "12.4K",
    timeAgo: "2 hours ago",
    category: "Wholesale & Fashion",
    linkedProduct: {
      name: "Executive Cotton Panjabi 2026",
      price: 1850,
      rating: 4.9,
      image: "https://images.unsplash.com/photo-1617137984095-74e4e5e3613f?auto=format&fit=crop&q=80&w=200",
    }
  },
  {
    id: "v2",
    title: "খাতুনগঞ্জ পাইকারি বাজার লাইভ: আজকের মসলা ও ভোজ্য তেলের পাইকারি দর",
    creator: {
      id: "chittagong-agro",
      name: "Chittagong Agro Trade",
      avatar: "https://images.unsplash.com/photo-1570295999919-56ceb5ecca61?auto=format&fit=crop&q=80&w=150",
      verified: true,
      followers: "89.1K",
    },
    thumbnail: "https://images.unsplash.com/photo-1542838132-92c53300491e?auto=format&fit=crop&q=80&w=800",
    views: "34.8K",
    timeAgo: "Live Now",
    category: "Wholesale Market",
    isLive: true,
  },
  {
    id: "v3",
    title: "Smart Home Automation Gadgets Unboxing & Setup Guide in Bangladesh",
    creator: {
      id: "tech-review",
      name: "Tech Review BD",
      avatar: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&q=80&w=150",
      verified: true,
      followers: "120K",
    },
    thumbnail: "https://images.unsplash.com/photo-1558089687-f282ffcbc126?auto=format&fit=crop&q=80&w=800",
    views: "8.9K",
    timeAgo: "1 day ago",
    category: "Electronics",
    linkedProduct: {
      name: "Smart Wireless Security Cam Pro",
      price: 3200,
      rating: 4.8,
      image: "https://images.unsplash.com/photo-1558089687-f282ffcbc126?auto=format&fit=crop&q=80&w=200",
    }
  },
];

export default function VideoHubPortal() {
  const [activeTab, setActiveTab] = useState<"home" | "shorts" | "live" | "categories">("home");
  const [uploadModalOpen, setUploadModalOpen] = useState(false);
  const navigate = useNavigate();

  const handleTabChange = (tabId: string) => {
    if (tabId === "shorts") {
      navigate("/video/shorts");
    } else if (tabId === "live") {
      navigate("/video/live");
    } else {
      setActiveTab(tabId as any);
    }
  };

  return (
    <div className="w-full max-w-7xl mx-auto px-4 py-6 text-white">
      {/* Header Banner & Upload CTA */}
      <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4 mb-8 pb-6 border-b border-white/10">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="p-1.5 rounded-xl bg-rose-500/10 text-rose-500 border border-rose-500/20">
              <Film className="h-5 w-5" />
            </span>
            <h1 className="text-2xl font-black tracking-tight text-white">PaikarMart Video & OTT Hub</h1>
          </div>
          <p className="text-xs text-zinc-400">
            Discover commerce-linked product videos, factory reviews, wholesale streams, and creator shorts.
          </p>
        </div>

        <button
          onClick={() => setUploadModalOpen(true)}
          className="flex items-center gap-2 px-5 py-3 rounded-2xl bg-[#FF7A00] hover:bg-[#e06b00] text-white text-xs font-black shadow-lg shadow-[#FF7A00]/25 transition-all active:scale-95"
        >
          <PlusCircle className="h-4 w-4" /> Create / Upload Video
        </button>
      </div>

      {/* Navigation Tabs */}
      <div className="flex items-center gap-2 overflow-x-auto pb-4 mb-6 no-scrollbar">
        {[
          { id: "home", label: "Video Feed", icon: Compass },
          { id: "shorts", label: "Shorts", icon: Flame },
          { id: "live", label: "Live Streams", icon: Radio },
          { id: "categories", label: "OTT Categories", icon: Sparkles },
        ].map((tab) => {
          const Icon = tab.icon;
          const isActive = activeTab === tab.id;
          return (
            <button
              key={tab.id}
              onClick={() => handleTabChange(tab.id)}
              className={cn(
                "flex items-center gap-2 px-4 py-2.5 rounded-2xl text-xs font-bold transition-all shrink-0 border",
                isActive
                  ? "bg-white text-zinc-900 border-white shadow-md shadow-white/10"
                  : "bg-zinc-900/60 text-zinc-400 border-white/5 hover:bg-zinc-800 hover:text-white"
              )}
            >
              <Icon className={cn("h-4 w-4", isActive ? "text-[#FF7A00]" : "text-zinc-500")} />
              {tab.label}
            </button>
          );
        })}
      </div>

      {/* Content Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {MOCK_VIDEOS.map((video) => (
          <motion.div
            key={video.id}
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-[#141624] border border-white/5 rounded-3xl overflow-hidden shadow-xl hover:border-white/10 transition-all group flex flex-col justify-between"
          >
            <div>
              {/* Thumbnail Container */}
              <div className="relative aspect-video w-full overflow-hidden bg-zinc-900">
                <img 
                  src={video.thumbnail} 
                  alt={video.title} 
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" 
                  referrerPolicy="no-referrer"
                />
                
                {/* Badges */}
                <div className="absolute top-3 left-3 flex items-center gap-2">
                  {video.isLive ? (
                    <span className="flex items-center gap-1 px-2.5 py-1 rounded-full bg-rose-600 text-white text-[10px] font-black uppercase tracking-wider shadow-lg animate-pulse">
                      <span className="w-1.5 h-1.5 rounded-full bg-white animate-ping" /> LIVE
                    </span>
                  ) : (
                    <span className="px-2.5 py-1 rounded-full bg-black/60 backdrop-blur-md text-white text-[10px] font-bold">
                      {video.category}
                    </span>
                  )}
                </div>

                <div className="absolute bottom-3 right-3 px-2 py-1 rounded-lg bg-black/70 backdrop-blur-md text-white text-[10px] font-bold flex items-center gap-1">
                  <Eye className="h-3 w-3 text-[#FF7A00]" /> {video.views}
                </div>

                {/* Play Button Overlay */}
                <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity bg-black/30 backdrop-blur-[2px]">
                  <div className="h-12 w-12 rounded-full bg-[#FF7A00] text-white flex items-center justify-center shadow-lg shadow-[#FF7A00]/40 transform group-hover:scale-110 transition-transform">
                    <Play className="h-5 w-5 fill-current ml-0.5" />
                  </div>
                </div>
              </div>

              {/* Video Info */}
              <div className="p-5">
                <Link to={`/video/channel/${video.creator.id}`} className="flex items-center gap-3 mb-3 group/creator">
                  <img 
                    src={video.creator.avatar} 
                    alt={video.creator.name} 
                    className="h-9 w-9 rounded-full object-cover border border-white/10 group-hover/creator:border-[#FF7A00] transition-colors" 
                    referrerPolicy="no-referrer"
                  />
                  <div>
                    <div className="flex items-center gap-1">
                      <span className="text-xs font-bold text-white group-hover/creator:text-[#FF7A00] transition-colors">{video.creator.name}</span>
                      {video.creator.verified && <CheckCircle2 className="h-3.5 w-3.5 text-[#FF7A00]" />}
                    </div>
                    <span className="text-[10px] text-zinc-500">{video.creator.followers} followers • {video.timeAgo}</span>
                  </div>
                </Link>

                <h3 className="text-sm font-bold text-zinc-200 line-clamp-2 leading-snug mb-3">
                  {video.title}
                </h3>
              </div>
            </div>

            {/* Commerce Linked Product Box */}
            {video.linkedProduct && (
              <div className="mx-5 mb-5 p-3 rounded-2xl bg-zinc-900/60 border border-white/5 flex items-center justify-between gap-3">
                <div className="flex items-center gap-3">
                  <img 
                    src={video.linkedProduct.image} 
                    alt={video.linkedProduct.name} 
                    className="h-12 w-12 rounded-xl object-cover shrink-0 border border-white/10" 
                    referrerPolicy="no-referrer"
                  />
                  <div className="min-w-0">
                    <p className="text-[11px] font-bold text-white truncate">{video.linkedProduct.name}</p>
                    <p className="text-xs font-black text-[#FF7A00]">৳{video.linkedProduct.price.toLocaleString()}</p>
                  </div>
                </div>
                <Link
                  to="/marketplace"
                  className="px-3 py-2 rounded-xl bg-[#FF7A00] hover:bg-[#e06b00] text-white text-[11px] font-bold shrink-0 shadow-md shadow-[#FF7A00]/20 transition-all"
                >
                  Buy Now
                </Link>
              </div>
            )}
          </motion.div>
        ))}
      </div>

      {/* Upload Modal Mockup */}
      <AnimatePresence>
        {uploadModalOpen && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md">
            <motion.div 
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="w-full max-w-lg bg-[#141624] border border-white/10 rounded-3xl p-6 shadow-2xl relative"
            >
              <div className="flex items-center justify-between mb-4 pb-3 border-b border-white/10">
                <h3 className="text-base font-black text-white">Upload Commerce Video or Short</h3>
                <button 
                  onClick={() => setUploadModalOpen(false)}
                  className="text-zinc-400 hover:text-white text-xs font-bold"
                >
                  ✕ Close
                </button>
              </div>

              <div className="space-y-4">
                <div>
                  <label className="block text-xs font-bold text-zinc-400 mb-1">Select Video File</label>
                  <div className="border-2 border-dashed border-white/10 rounded-2xl p-6 text-center bg-zinc-900/40 hover:bg-zinc-900/80 transition-colors cursor-pointer">
                    <Film className="h-8 w-8 text-[#FF7A00] mx-auto mb-2" />
                    <p className="text-xs font-bold text-zinc-300">Click to browse or drag & drop video</p>
                    <p className="text-[10px] text-zinc-500 mt-1">MP4, MOV up to 500MB</p>
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-bold text-zinc-400 mb-1">Video Title</label>
                  <input 
                    type="text" 
                    placeholder="Enter catchy title..." 
                    className="w-full px-4 py-3 rounded-xl bg-zinc-900 border border-white/10 text-xs text-white focus:outline-none focus:border-[#FF7A00]"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-zinc-400 mb-1">Link Product / Service (Optional)</label>
                  <select className="w-full px-4 py-3 rounded-xl bg-zinc-900 border border-white/10 text-xs text-white focus:outline-none focus:border-[#FF7A00]">
                    <option value="">-- Select from your store products --</option>
                    <option value="p1">Executive Cotton Panjabi 2026 (৳1,850)</option>
                    <option value="p2">Smart Wireless Security Cam Pro (৳3,200)</option>
                  </select>
                </div>

                <div className="flex items-center justify-end gap-3 pt-4 border-t border-white/10">
                  <button 
                    onClick={() => setUploadModalOpen(false)}
                    className="px-4 py-2.5 rounded-xl bg-white/5 hover:bg-white/10 text-zinc-300 text-xs font-bold"
                  >
                    Cancel
                  </button>
                  <button 
                    onClick={() => {
                      alert("Video uploaded and sent for review successfully!");
                      setUploadModalOpen(false);
                    }}
                    className="px-5 py-2.5 rounded-xl bg-[#FF7A00] hover:bg-[#e06b00] text-white text-xs font-black shadow-lg shadow-[#FF7A00]/25"
                  >
                    Publish Now
                  </button>
                </div>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
}
