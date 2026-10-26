import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { MapPin, Eye, EyeOff, ArrowRight } from 'lucide-react';
import { useAuthStore } from '../../modules/auth/store/authStore';

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
    gradient: "from-emerald-500 to-teal-700",
    emoji: "🥬",
    cta: "অর্ডার করুন"
  }
];

import { LocationPicker } from '../navigation/LocationPicker';

export default function HeroSection() {
  const { user, isAuthenticated } = useAuthStore();
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
        className="w-[45%] flex-shrink-0 bg-[var(--pm-surface)] rounded-2xl p-4 flex flex-col justify-between border border-[var(--pm-border)] shadow-sm"
        initial={{ opacity: 0, x: -20 }}
        animate={{ opacity: 1, x: 0 }}
      >
        <div className="space-y-1.5">
          <p className="text-[10px] uppercase tracking-wider font-bold text-[var(--pm-text-secondary)]">স্বাগতম! 👋</p>
          <h2 className="text-sm font-bold text-[var(--pm-text)] truncate">
            {isAuthenticated ? user?.name || user?.email?.split('@')[0] : 'অতিথি'}
          </h2>
          <div className="pt-1">
            <LocationPicker />
          </div>
        </div>

        <div className="mt-4 p-2.5 rounded-xl bg-[var(--pm-accent)]/10 border border-[var(--pm-accent)]/10 space-y-1">
          <div className="flex items-center justify-between">
             <p className="text-[9px] font-bold text-[var(--pm-accent)] uppercase">ওয়ালেট</p>
             <button onClick={() => setBalanceVisible(!balanceVisible)} className="text-[var(--pm-accent)] hover:opacity-70 transition-opacity">
               {balanceVisible ? <Eye className="w-3.5 h-3.5" /> : <EyeOff className="w-3.5 h-3.5" />}
             </button>
          </div>
          <p className="text-sm font-black text-[var(--pm-text)]">
            {balanceVisible ? '৳ ৪৫,২৮০' : '••••••'}
          </p>
        </div>
      </motion.div>

      {/* Right Card - Banner Carousel */}
      <motion.div 
        className="flex-1 rounded-2xl relative overflow-hidden shadow-lg"
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
