import React, { useState } from "react";
import { CheckCircle2, Film, ShoppingBag, Radio, Users, Star, ArrowLeft, Heart, Eye } from "lucide-react";
import { useNavigate, useParams, Link } from "react-router-dom";
import { useVideoStore } from "@/modules/video";
import { ShoppableVideoCard } from "@/modules/video/components/ShoppableVideoCard";

export default function CreatorChannel() {
  const [activeTab, setActiveTab] = useState<"videos" | "shorts" | "products">("videos");
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { videos, reels, followedCreatorIds, toggleFollow } = useVideoStore();

  const channelVideos = videos.filter(v => v.creator.id === id || !id);
  const channelReels = reels.filter(r => r.creator.id === id || !id);
  const sampleCreator = channelVideos[0]?.creator || {
    id: id || "dhaka-fashion",
    name: "Dhaka Textile Sourcing",
    avatar: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=250&auto=format&fit=crop",
    verified: true,
    followers: "48.2K",
    location: "ইসলামপুর, ঢাকা",
    storeName: "ঢাকা টেক্সটাইল আড়ত"
  };

  const isFollowing = followedCreatorIds.includes(sampleCreator.id);

  return (
    <div className="w-full max-w-7xl mx-auto px-4 py-6 text-white pb-28">
      {/* Back Button */}
      <button 
        onClick={() => navigate('/video')}
        className="flex items-center gap-2 text-xs font-bold text-zinc-400 hover:text-white mb-6 transition-colors cursor-pointer"
        title="ভিডিও হাবে ফিরে যান"
      >
        <ArrowLeft className="h-4 w-4" /> ফিরে যান
      </button>

      {/* Channel Header Banner */}
      <div className="relative w-full h-48 md:h-64 rounded-3xl overflow-hidden bg-gradient-to-r from-blue-950 via-purple-950 to-[#FF7A00]/30 mb-6 border border-white/10 shadow-2xl">
        <div className="absolute inset-0 bg-black/40 backdrop-blur-[1px]" />
      </div>

      {/* Creator Profile Info */}
      <div className="relative px-4 -mt-16 md:-mt-20 mb-8 flex flex-col md:flex-row md:items-end justify-between gap-6">
        <div className="flex items-end gap-5">
          <img 
            src={sampleCreator.avatar} 
            alt={sampleCreator.name} 
            className="w-28 h-28 md:w-36 md:h-36 rounded-3xl object-cover border-4 border-[#0f111a] shadow-2xl shrink-0"
            referrerPolicy="no-referrer"
          />
          <div className="pb-2">
            <div className="flex items-center gap-2 mb-1">
              <h1 className="text-xl md:text-2xl font-black text-white">{sampleCreator.name}</h1>
              {sampleCreator.verified && <CheckCircle2 className="h-5 w-5 text-[#FF7A00]" />}
            </div>
            <p className="text-xs text-zinc-400 mb-2">
              ভেরিফাইড পাইকারি প্রস্তুতকারক ও এক্সপোর্টার • {sampleCreator.location}
            </p>
            <div className="flex items-center gap-4 text-xs text-zinc-300">
              <span className="flex items-center gap-1 font-bold text-white">
                <Users className="h-3.5 w-3.5 text-[#FF7A00]" /> {sampleCreator.followers} ফলোয়ার
              </span>
              <span className="flex items-center gap-1 font-bold text-white">
                <Star className="h-3.5 w-3.5 text-amber-400 fill-current" /> 4.9 রেটিং
              </span>
            </div>
          </div>
        </div>

        <div className="flex items-center gap-3">
          <button 
            onClick={() => toggleFollow(sampleCreator.id)}
            className={`px-6 py-3 rounded-2xl text-xs font-black shadow-lg transition-all active:scale-95 cursor-pointer ${
              isFollowing 
                ? 'bg-white/10 text-zinc-200 hover:bg-white/15'
                : 'bg-[#FF7A00] hover:bg-[#e06b00] text-white shadow-[#FF7A00]/25'
            }`}
          >
            {isFollowing ? 'ফলোয়িং' : 'চ্যানেল ফলো করুন'}
          </button>
          <Link 
            to="/messages"
            className="px-5 py-3 rounded-2xl bg-white/10 hover:bg-white/20 text-white text-xs font-bold border border-white/10 transition-all cursor-pointer"
          >
            মেসেজ
          </Link>
        </div>
      </div>

      {/* Channel Tabs */}
      <div className="flex items-center gap-2 overflow-x-auto pb-4 mb-6 border-b border-white/10 no-scrollbar">
        {[
          { id: "videos", label: `ভিডিও (${channelVideos.length})`, icon: Film },
          { id: "shorts", label: `রিলস ও শর্টস (${channelReels.length})`, icon: Radio },
          { id: "products", label: "স্টোর প্রোডাক্টস", icon: ShoppingBag }
        ].map((tab) => {
          const Icon = tab.icon;
          const isActive = activeTab === tab.id;
          return (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id as any)}
              className={`flex items-center gap-2 px-5 py-3 rounded-2xl text-xs font-bold transition-all shrink-0 cursor-pointer ${
                isActive 
                  ? "bg-white text-zinc-900 shadow-md shadow-white/10" 
                  : "bg-zinc-900/60 text-zinc-400 hover:bg-zinc-800 hover:text-white"
              }`}
            >
              <Icon className="h-4 w-4" />
              {tab.label}
            </button>
          );
        })}
      </div>

      {/* Tab Content */}
      {activeTab === "videos" && (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {channelVideos.map((video) => (
            <ShoppableVideoCard key={video.id} video={video} />
          ))}
        </div>
      )}

      {activeTab === "shorts" && (
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">
          {channelReels.map((reel) => (
            <div
              key={reel.id}
              onClick={() => navigate('/video/shorts')}
              className="relative aspect-[9/16] rounded-3xl overflow-hidden bg-zinc-900 border border-white/10 group hover:border-[#FF7A00] transition-all cursor-pointer p-3 flex flex-col justify-between"
            >
              <img 
                src={reel.thumbnail} 
                alt={reel.title} 
                className="absolute inset-0 w-full h-full object-cover group-hover:scale-105 transition-transform duration-300" 
                referrerPolicy="no-referrer"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black via-transparent to-black/30 pointer-events-none" />

              <div className="relative z-10 flex justify-end">
                <span className="px-2 py-0.5 rounded-md bg-black/70 text-[10px] text-white font-bold flex items-center gap-1">
                  <Eye className="w-3 h-3 text-[#FF7A00]" /> {reel.views}
                </span>
              </div>

              <div className="relative z-10">
                <p className="text-xs font-bold text-white line-clamp-2 drop-shadow">
                  {reel.title}
                </p>
              </div>
            </div>
          ))}
        </div>
      )}

      {activeTab === "products" && (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
          {channelVideos.filter(v => v.linkedProduct).map((v) => (
            <div key={v.id} className="p-4 rounded-3xl bg-[#131522] border border-white/5 space-y-3">
              <img 
                src={v.linkedProduct?.image} 
                alt={v.linkedProduct?.title} 
                className="w-full aspect-video rounded-2xl object-cover" 
                referrerPolicy="no-referrer"
              />
              <h4 className="text-xs font-bold text-white line-clamp-2">{v.linkedProduct?.title}</h4>
              <div className="flex items-center justify-between">
                <span className="text-sm font-black text-[#FF7A00]">৳{v.linkedProduct?.price.toLocaleString()}</span>
                <Link to={`/product/${v.linkedProduct?.id}`} className="px-3 py-1.5 rounded-xl bg-[#FF7A00] text-white text-xs font-bold">
                  বিস্তারিত
                </Link>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
