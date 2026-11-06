import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ArrowRight } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

import heroMegaWholesale from '@/assets/images/hero_mega_wholesale_1791196538584.jpg';
import heroFlashDeals from '@/assets/images/hero_flash_deals_1791196549956.jpg';
import heroFarmFresh from '@/assets/images/hero_farm_fresh_1791196560285.jpg';
import heroPkExclusive from '@/assets/images/hero_pk_exclusive_1791196570502.jpg';

const banners = [
  {
    title: "মেগা হোলসেল",
    subtitle: "৪০% পর্যন্ত মিল-গেট ছাড় সরাসরি কারখানা থেকে",
    gradient: "from-purple-900/80 via-indigo-950/70 to-black/90",
    image: heroMegaWholesale,
    emoji: "📦",
    cta: "হোলসেল অর্ডারে যান",
    path: "/wholesale",
    badge: "B2B ডিরেক্ট"
  },
  {
    title: "ফ্ল্যাশ ডিলস",
    subtitle: "সীমিত সময়ের বিশেষ মূল্যছাড় ও সারপ্রাইজ ক্যাশব্যাক",
    gradient: "from-orange-900/80 via-rose-950/70 to-black/90",
    image: heroFlashDeals,
    emoji: "⚡",
    cta: "অফার দেখুন",
    path: "/b2c?b2cView=deals",
    badge: "হট সেল"
  },
  {
    title: "তাজা ফসল",
    subtitle: "সরাসরি কৃষক ও ক্ষেত থেকে সংগৃহীত পাইকারি বাজার",
    gradient: "from-emerald-900/80 via-teal-950/70 to-black/90",
    image: heroFarmFresh,
    emoji: "🥬",
    cta: "অর্ডার করুন",
    path: "/portal/grocery",
    badge: "ফার্ম ফ্রেশ"
  },
  {
    title: "পিকে শপ এক্সক্লুসিভ",
    subtitle: "কয়েন ক্যাশব্যাক ও অরিজিনাল গ্যাজেটের প্রিমিয়াম কালেকশন",
    gradient: "from-violet-900/80 via-purple-950/70 to-black/90",
    image: heroPkExclusive,
    emoji: "⭐",
    cta: "কালেকশন দেখুন",
    path: "/pk-shop",
    badge: "ক্যাশব্যাক"
  }
];

export default function HeroSection() {
  const [bannerIndex, setBannerIndex] = useState(0);
  const navigate = useNavigate();

  useEffect(() => {
    const timer = setInterval(() => {
      setBannerIndex((prev) => (prev + 1) % banners.length);
    }, 4500);

    return () => clearInterval(timer);
  }, []);

  const currentBanner = banners[bannerIndex];

  return (
    <div className="w-full select-none">
      {/* ━━━ Clean Full Width Hero Banner Carousel ━━━ */}
      <motion.div 
        className="w-full rounded-2xl sm:rounded-3xl relative overflow-hidden shadow-2xl border border-white/10 min-h-[180px] sm:min-h-[220px] md:min-h-[260px]"
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3 }}
      >
        <AnimatePresence mode="wait">
          <motion.div
            key={bannerIndex}
            className="absolute inset-0"
            initial={{ opacity: 0, scale: 1.03 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.97 }}
            transition={{ duration: 0.4 }}
          >
            {/* Background Image */}
            <img 
              src={currentBanner.image} 
              alt={currentBanner.title}
              className="w-full h-full object-cover"
              referrerPolicy="no-referrer"
              onError={(e) => {
                const target = e.target as HTMLImageElement;
                target.style.opacity = '0';
              }}
            />
            {/* Dark Scrim Gradient Overlay */}
            <div className={`absolute inset-0 bg-gradient-to-r ${currentBanner.gradient} backdrop-blur-[1px]`} />
            
            {/* Content Container */}
            <div className="absolute inset-0 p-4 sm:p-6 md:p-8 flex flex-col justify-between z-10">
              {/* Top Row: Badge only */}
              <div className="flex items-center justify-end">
                <span className="bg-white/15 backdrop-blur-md text-white text-[9px] sm:text-xs font-black uppercase px-3 py-1 rounded-full border border-white/20 shadow-sm">
                  {currentBanner.badge}
                </span>
              </div>

              {/* Middle Title & Subtitle */}
              <div className="space-y-1 sm:space-y-1.5 my-auto py-2">
                <div className="flex items-center gap-2">
                  <span className="text-2xl sm:text-3xl filter drop-shadow-md">{currentBanner.emoji}</span>
                  <h3 className="text-base sm:text-2xl md:text-3xl font-black text-white uppercase tracking-tight leading-tight drop-shadow-lg">
                    {currentBanner.title}
                  </h3>
                </div>
                <p className="text-xs sm:text-sm md:text-base text-white/90 font-medium drop-shadow-md max-w-2xl line-clamp-2">
                  {currentBanner.subtitle}
                </p>
              </div>

              {/* Bottom Row: CTA Button & Pagination Dots */}
              <div className="flex items-center justify-between pt-1">
                <button 
                  onClick={() => navigate(currentBanner.path)}
                  className="flex items-center gap-2 bg-white text-zinc-950 text-xs sm:text-sm font-black rounded-full px-4 sm:px-6 py-2 sm:py-2.5 shadow-xl hover:bg-[var(--pm-accent)] hover:text-white active:scale-95 transition-all cursor-pointer"
                >
                  {currentBanner.cta} <ArrowRight className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
                </button>

                {/* Pagination Dots */}
                <div className="flex items-center gap-1.5">
                  {banners.map((_, i) => (
                    <button
                      key={i}
                      onClick={() => setBannerIndex(i)}
                      className={`h-1.5 rounded-full transition-all duration-300 cursor-pointer ${
                        i === bannerIndex ? 'w-6 bg-white' : 'w-2 bg-white/40 hover:bg-white/60'
                      }`}
                      aria-label={`Slide ${i + 1}`}
                    />
                  ))}
                </div>
              </div>
            </div>
          </motion.div>
        </AnimatePresence>
      </motion.div>
    </div>
  );
}
