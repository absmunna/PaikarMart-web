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
      <div className="w-full grid grid-cols-[42%_minmax(0,1fr)] sm:grid-cols-12 gap-3 md:gap-4 px-3 md:px-4 py-4 max-w-7xl mx-auto">
        {/* Left Card - Profile & Wallet (Glassmorphism + Premium Border) */}
        <motion.div 
          className="sm:col-span-5 flex-shrink-0 bg-white/[0.02] backdrop-blur-3xl rounded-[20px] md:rounded-3xl p-3 md:p-5 flex flex-col justify-between border border-white/10 shadow-[0_8px_32px_rgba(0,0,0,0.4)] relative overflow-hidden"
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
        >
        {/* Subtle decorative "Jamdani" dashed element in the background */}
        <div className="absolute inset-0 pointer-events-none border border-white/5 border-dashed m-2 rounded-[16px] opacity-20" />
        <div className="absolute inset-0 pointer-events-none bg-gradient-to-br from-white/[0.05] to-transparent opacity-50" />

        <div className="space-y-1 z-10 relative">
          <p className="text-[10px] md:text-[12px] font-bold text-white tracking-wider drop-shadow-sm">স্বাগতম! 👋</p>
          <h2 className="text-sm md:text-xl font-black text-white truncate drop-shadow-sm pb-1.5 md:pb-2">
            {isAuthenticated ? user?.name || user?.email?.split('@')[0] : 'অতিথি'}
          </h2>
          <div>
            <LocationPicker />
          </div>
        </div>

        <div className="mt-2 md:mt-4 p-2 md:p-3 rounded-[12px] md:rounded-2xl bg-cyan-400/10 border border-cyan-400/20 space-y-1 md:space-y-1.5 z-10 relative shadow-[inset_0_1px_1px_rgba(255,255,255,0.05)]">
          <div className="flex items-center justify-between">
             <p className="text-[9px] md:text-[11px] font-bold text-[#ff6b00]">ওয়ালেট</p>
             <button onClick={() => setBalanceVisible(!balanceVisible)} className="text-[#ff6b00] hover:opacity-70 transition-opacity">
               {balanceVisible ? <Eye className="w-3.5 h-3.5 md:w-4 md:h-4 ml-1" /> : <EyeOff className="w-3.5 h-3.5 md:w-4 md:h-4 ml-1" />}
             </button>
          </div>
          <p className="text-[12px] md:text-[15px] font-black text-white drop-shadow-md">
            {balanceVisible ? '৳ ৪৫,২৮০' : '••••••'}
          </p>
        </div>
      </motion.div>

      {/* Right Card - Banner Carousel */}
      <motion.div 
        className="sm:col-span-7 flex-1 min-h-[160px] md:min-h-[200px] rounded-[20px] md:rounded-3xl relative overflow-hidden shadow-[0_8px_32px_rgba(0,0,0,0.4)] border border-white/10"
        initial={{ opacity: 0, x: 20 }}
        animate={{ opacity: 1, x: 0 }}
      >
        <AnimatePresence mode="wait">
          <motion.div
            key={bannerIndex}
            className={`absolute inset-0 bg-gradient-to-br ${banners[bannerIndex].gradient} p-4 md:p-6 flex flex-col justify-center gap-1 md:gap-2`}
            initial={{ opacity: 0, x: 50 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -50 }}
            transition={{ duration: 0.4 }}
          >
            <span className="text-2xl md:text-3xl mb-0 md:mb-1 drop-shadow-md">{banners[bannerIndex].emoji}</span>
            <h3 className="text-sm md:text-lg font-black text-white uppercase leading-tight md:leading-none tracking-tight drop-shadow-sm">
              {banners[bannerIndex].title}
            </h3>
            <p className="text-[9px] md:text-[11px] text-white/90 font-bold mb-1.5 md:mb-2 tracking-wide uppercase line-clamp-1">
              {banners[bannerIndex].subtitle}
            </p>
            <button className="flex items-center gap-1 bg-white/20 backdrop-blur-xl text-white text-[9px] md:text-[10px] font-black uppercase tracking-wider rounded-full px-3 md:px-4 py-1.5 md:py-2 w-fit border border-white/30 hover:bg-white/30 active:scale-95 transition-all shadow-lg hover:shadow-xl">
              {banners[bannerIndex].cta} <ArrowRight className="w-3 h-3 md:w-3.5 md:h-3.5 ml-1" />
            </button>

            {/* Pagination Dots */}
            <div className="absolute bottom-4 right-4 flex gap-1.5">
              {banners.map((_, i) => (
                <div 
                  key={i} 
                  className={`h-1.5 rounded-full transition-all duration-300 shadow-sm ${i === bannerIndex ? 'w-4 bg-white' : 'w-1.5 bg-white/40'}`} 
                />
              ))}
            </div>
          </motion.div>
        </AnimatePresence>
      </motion.div>
    </div>
  );
}
