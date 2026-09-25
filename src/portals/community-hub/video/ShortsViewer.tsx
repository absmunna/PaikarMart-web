import React, { useState } from "react";
import { Heart, MessageCircle, Share2, ShoppingBag, Music, ChevronUp, ChevronDown, CheckCircle2, ArrowLeft } from "lucide-react";
import { motion, AnimatePresence } from "motion/react";
import { Link, useNavigate } from "react-router-dom";
import { cn } from "@/lib/utils";

interface ShortItem {
  id: string;
  videoUrl: string;
  caption: string;
  creator: {
    name: string;
    avatar: string;
    verified: boolean;
  };
  likes: number;
  comments: number;
  shares: number;
  product?: {
    name: string;
    price: number;
    image: string;
  };
}

const MOCK_SHORTS: ShortItem[] = [
  {
    id: "s1",
    videoUrl: "https://images.unsplash.com/photo-1512436991641-6745cdb1723f?auto=format&fit=crop&q=80&w=800",
    caption: "এক্সক্লুসিভ খাদি পাঞ্জাবি সরাসরি তাঁত থেকে! সীমিত সময়ের ডিসকাউন্ট 💥 #PaikarMart #Wholesale #Panjabi",
    creator: {
      name: "Bangla Fab Tech",
      avatar: "https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?auto=format&fit=crop&q=80&w=150",
      verified: true,
    },
    likes: 1420,
    comments: 89,
    shares: 230,
    product: {
      name: "Handloom Khadi Panjabi",
      price: 1450,
      image: "https://images.unsplash.com/photo-1617137984095-74e4e5e3613f?auto=format&fit=crop&q=80&w=200",
    }
  },
  {
    id: "s2",
    videoUrl: "https://images.unsplash.com/photo-1542838132-92c53300491e?auto=format&fit=crop&q=80&w=800",
    caption: "খাতুনগঞ্জ থেকে পাইকারি মূল্যে খাঁটি সরিষার তেল ও মসলা সংগ্রহ করুন। 🌾 #LocalHub #Grocery",
    creator: {
      name: "Chittagong Agro",
      avatar: "https://images.unsplash.com/photo-1570295999919-56ceb5ecca61?auto=format&fit=crop&q=80&w=150",
      verified: true,
    },
    likes: 3890,
    comments: 245,
    shares: 512,
    product: {
      name: "Pure Mustard Oil 5L",
      price: 980,
      image: "https://images.unsplash.com/photo-1474979266404-7eaacbcd87c5?auto=format&fit=crop&q=80&w=200",
    }
  }
];

export default function ShortsViewer() {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [liked, setLiked] = useState<Record<string, boolean>>({});
  const navigate = useNavigate();

  const current = MOCK_SHORTS[currentIndex];

  const handleNext = () => {
    if (currentIndex < MOCK_SHORTS.length - 1) {
      setCurrentIndex(currentIndex + 1);
    } else {
      setCurrentIndex(0); // loop
    }
  };

  const handlePrev = () => {
    if (currentIndex > 0) {
      setCurrentIndex(currentIndex - 1);
    }
  };

  return (
    <div className="relative w-full h-[calc(100vh-4rem)] bg-black overflow-hidden flex items-center justify-center text-white">
      {/* Back button */}
      <button 
        onClick={() => navigate("/video")}
        className="absolute top-4 left-4 z-30 p-2.5 rounded-full bg-black/50 backdrop-blur-md text-white hover:bg-black/80 transition-colors"
      >
        <ArrowLeft className="h-5 w-5" />
      </button>

      {/* Video Background / Poster */}
      <div className="absolute inset-0 z-0">
        <img 
          src={current.videoUrl} 
          alt={current.caption}
          className="w-full h-full object-cover filter brightness-90"
          referrerPolicy="no-referrer"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black via-black/20 to-black/40" />
      </div>

      {/* Main Content Overlay */}
      <div className="relative z-10 w-full max-w-md h-full flex flex-col justify-between p-6 pb-20">
        <div className="flex justify-between items-center">
          <span className="px-3 py-1 rounded-full bg-white/20 backdrop-blur-md text-xs font-bold">
            PaikarMart Shorts ({currentIndex + 1}/{MOCK_SHORTS.length})
          </span>
        </div>

        <div className="flex items-end justify-between gap-4">
          {/* Caption & Creator info */}
          <div className="space-y-3 flex-1">
            <div className="flex items-center gap-3">
              <img 
                src={current.creator.avatar} 
                alt={current.creator.name} 
                className="h-10 w-10 rounded-full object-cover border-2 border-[#FF7A00]"
                referrerPolicy="no-referrer"
              />
              <div className="flex items-center gap-1.5">
                <span className="text-sm font-bold">{current.creator.name}</span>
                {current.creator.verified && <CheckCircle2 className="h-4 w-4 text-[#FF7A00]" />}
              </div>
              <button className="px-3 py-1 rounded-full bg-[#FF7A00] text-white text-xs font-bold shadow-md">
                Follow
              </button>
            </div>

            <p className="text-xs text-zinc-200 leading-relaxed line-clamp-3">
              {current.caption}
            </p>

            <div className="flex items-center gap-2 text-[11px] text-zinc-400">
              <Music className="h-3.5 w-3.5 animate-spin text-[#FF7A00]" /> Original Audio - PaikarMart Creator Studio
            </div>

            {/* Attached Product CTA */}
            {current.product && (
              <div className="p-3 rounded-2xl bg-black/60 backdrop-blur-md border border-white/10 flex items-center justify-between gap-3">
                <div className="flex items-center gap-3">
                  <img 
                    src={current.product.image} 
                    alt={current.product.name} 
                    className="h-11 w-11 rounded-xl object-cover"
                    referrerPolicy="no-referrer"
                  />
                  <div>
                    <p className="text-xs font-bold text-white line-clamp-1">{current.product.name}</p>
                    <p className="text-xs font-black text-[#FF7A00]">৳{current.product.price.toLocaleString()}</p>
                  </div>
                </div>
                <Link
                  to="/marketplace"
                  className="px-3 py-2 rounded-xl bg-[#FF7A00] text-white text-xs font-black shrink-0 hover:bg-[#e06b00]"
                >
                  Buy Now
                </Link>
              </div>
            )}
          </div>

          {/* Right side interaction buttons */}
          <div className="flex flex-col items-center gap-4 pb-4">
            <button 
              onClick={() => setLiked({ ...liked, [current.id]: !liked[current.id] })}
              className="flex flex-col items-center gap-1 group"
            >
              <div className={cn(
                "p-3 rounded-full bg-black/50 backdrop-blur-md transition-colors",
                liked[current.id] ? "text-rose-500 bg-rose-500/20" : "text-white group-hover:bg-white/20"
              )}>
                <Heart className={cn("h-6 w-6", liked[current.id] && "fill-current")} />
              </div>
              <span className="text-xs font-bold">{current.likes + (liked[current.id] ? 1 : 0)}</span>
            </button>

            <button className="flex flex-col items-center gap-1 group">
              <div className="p-3 rounded-full bg-black/50 backdrop-blur-md text-white group-hover:bg-white/20 transition-colors">
                <MessageCircle className="h-6 w-6" />
              </div>
              <span className="text-xs font-bold">{current.comments}</span>
            </button>

            <button className="flex flex-col items-center gap-1 group">
              <div className="p-3 rounded-full bg-black/50 backdrop-blur-md text-white group-hover:bg-white/20 transition-colors">
                <Share2 className="h-6 w-6" />
              </div>
              <span className="text-xs font-bold">{current.shares}</span>
            </button>

            {/* Navigation buttons */}
            <div className="flex flex-col gap-2 mt-4">
              <button 
                onClick={handlePrev}
                disabled={currentIndex === 0}
                className="p-2.5 rounded-full bg-black/60 text-white disabled:opacity-30 hover:bg-black/90"
              >
                <ChevronUp className="h-5 w-5" />
              </button>
              <button 
                onClick={handleNext}
                className="p-2.5 rounded-full bg-black/60 text-white hover:bg-black/90"
              >
                <ChevronDown className="h-5 w-5" />
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
