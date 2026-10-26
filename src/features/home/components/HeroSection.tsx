import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { MapPin, Eye, EyeOff, ArrowRight } from 'lucide-react';
import { useAuth } from '@/features/auth/AuthContext';

const banners = [
  {
    title: "মেগা হোলসেল",
    subtitle: "৪০% পর্যন্ত ছাড়",
    gradient: "from-purple-600 to-indigo-700",
    emoji: "📦",
    cta: "কিনুন"
  },
  {
    title: "ফ্ল্যাশ ডিলস",
    subtitle: "সীমিত সময়ের জন্য",
    gradient: "from-orange-500 to-pink-600",
    emoji: "⚡",
    cta: "অফার দেখুন"
  },
  {
    title: "তাজা ফসল",
    subtitle: "সরাসরি খামার থেকে",
    gradient: "from-cyan-500 to-teal-700",
    emoji: "🥬",
    cta: "অর্ডার করুন"
  }
];

import { LocationPicker } from '@/components/common/navigation/LocationPicker';

export default function HeroSection() {
  const { user, isAuthenticated } = useAuth();
  const [balanceVisible, setBalanceVisible] = useState(false);
  const [bannerIndex, setBannerIndex] = useState(0);

  useEffect(() => {
    const timer = setInterval(() => {
      setBannerIndex((prev) => (prev + 1) % banners.length);
    }, 3600);

    return () => clearInterval(timer);
  }, []);

  return (
    <div className="w-full flex flex-row gap-3 px-1">
      {/* Left Card - Profile & Wallet */}
      <motion.div 
        className="w-[42%] flex-shrink-0 bg-zinc-950/40 rounded-2xl p-4 flex flex-col justify-between border border-white/[0.04] backdrop-blur-xl relative overflow-hidden group shadow-2xl"
        initial={{ opacity: 0, x: -20 }}
        animate={{ opacity: 1, x: 0 }}
      >
        <div className="absolute inset-0 bg-gradient-to-br from-cyan-500/[0.02] to-transparent pointer-events-none" />
        
        <div className="space-y-1 z-10">
          <p className="text-[9px] uppercase tracking-[0.2em] font-black text-cyan-500/60 drop-shadow-sm">Welcome Back</p>
          <h2 className="text-sm font-black text-white truncate tracking-tight">
            {isAuthenticated ? user?.name || user?.email?.split('@')[0] : 'Guest User'}
          </h2>
          <div className="pt-2">
            <LocationPicker />
          </div>
        </div>

        <div className="mt-4 p-3 rounded-xl bg-cyan-500/5 border border-cyan-500/10 space-y-1.5 relative z-10 overflow-hidden">
          <div className="absolute inset-0 bg-gradient-to-tr from-cyan-500/[0.03] to-transparent pointer-events-none" />
          <div className="flex items-center justify-between">
             <p className="text-[8px] font-black text-cyan-500/80 uppercase tracking-widest leading-none">Wallet Balance</p>
             <button onClick={() => setBalanceVisible(!balanceVisible)} className="text-cyan-500/50 hover:text-cyan-500 transition-colors">
               {balanceVisible ? <Eye className="w-3 h-3" /> : <EyeOff className="w-3 h-3" />}
             </button>
          </div>
          <p className="text-[15px] font-black text-white tracking-tighter">
            {balanceVisible ? '৳ ৪৫,২৮০' : '••••••'}
          </p>
        </div>
      </motion.div>

      {/* Right Card - Banner Carousel */}
      <motion.div 
        className="flex-1 rounded-2xl relative overflow-hidden shadow-[0_20px_50px_rgba(0,0,0,0.5)] border border-white/5"
        initial={{ opacity: 0, x: 20 }}
        animate={{ opacity: 1, x: 0 }}
      >
        <AnimatePresence mode="wait">
          <motion.div
            key={bannerIndex}
            className={`absolute inset-0 bg-gradient-to-br ${banners[bannerIndex].gradient} p-4 flex flex-col justify-center gap-1`}
            initial={{ opacity: 0, x: 50 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -50 }}
            transition={{ duration: 0.4 }}
          >
            <span className="text-2xl mb-1">{banners[bannerIndex].emoji}</span>
            <h3 className="text-xs font-black text-white uppercase leading-none">{banners[bannerIndex].title}</h3>
            <p className="text-[10px] text-white/90 font-medium mb-1">{banners[bannerIndex].subtitle}</p>
            <button className="flex items-center gap-1 bg-white/20 backdrop-blur-md text-white text-[9px] font-bold rounded-full px-2.5 py-1.5 w-fit border border-white/20 hover:bg-white/30 active:scale-95 transition-all">
              {banners[bannerIndex].cta} <ArrowRight className="w-2.5 h-2.5" />
            </button>

            {/* Pagination Dots */}
            <div className="absolute bottom-3 right-3 flex gap-1">
              {banners.map((_, i) => (
                <div 
                  key={i} 
                  className={`h-1 rounded-full transition-all duration-300 ${i === bannerIndex ? 'w-3 bg-white' : 'w-1 bg-white/40'}`} 
                />
              ))}
            </div>
          </motion.div>
        </AnimatePresence>
      </motion.div>
    </div>
  );
}
