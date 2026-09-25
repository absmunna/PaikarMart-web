import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Eye, EyeOff, ArrowRight, Wallet, Sparkles, ChevronRight } from 'lucide-react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '@/features/auth/AuthContext';
import { useWalletStore } from '@/modules/wallet/useWalletStore';
import { LocationPicker } from '../navigation/LocationPicker';

const banners = [
  {
    title: "মেগা হোলসেল",
    subtitle: "৪০% পর্যন্ত মিল-গেট ছাড়",
    gradient: "from-purple-600 via-indigo-700 to-indigo-900",
    emoji: "📦",
    cta: "কিনুন",
    path: "/wholesale",
    badge: "B2B ডিরেক্ট"
  },
  {
    title: "ফ্ল্যাশ ডিলস",
    subtitle: "সীমিত সময়ের কারখানা অফার",
    gradient: "from-orange-500 via-rose-600 to-pink-600",
    emoji: "⚡",
    cta: "অফার দেখুন",
    path: "/b2c?b2cView=deals",
    badge: "হট সেল"
  },
  {
    title: "তাজা ফসল",
    subtitle: "সরাসরি মাঠ থেকে পাইকারি দর",
    gradient: "from-emerald-600 via-teal-700 to-slate-900",
    emoji: "🥬",
    cta: "অর্ডার করুন",
    path: "/portal/grocery",
    badge: "ফার্ম ফ্রেশ"
  },
  {
    title: "পিকে শপ এক্সক্লুসিভ",
    subtitle: "কয়েন ক্যাশব্যাক ও অরিজিনাল গ্যাজেট",
    gradient: "from-violet-600 via-purple-700 to-fuchsia-900",
    emoji: "⭐",
    cta: "কালেকশন দেখুন",
    path: "/pk-shop",
    badge: "ক্যাশব্যাক"
  }
];

export default function HeroSection() {
  const { user, isAuthenticated } = useAuth();
  const { balance, coins } = useWalletStore();
  const [balanceVisible, setBalanceVisible] = useState(false);
  const [bannerIndex, setBannerIndex] = useState(0);
  const navigate = useNavigate();

  useEffect(() => {
    const timer = setInterval(() => {
      setBannerIndex((prev) => (prev + 1) % banners.length);
    }, 4000);

    return () => clearInterval(timer);
  }, []);

  const currentBanner = banners[bannerIndex];

  return (
    <div className="w-full flex flex-row gap-2.5 sm:gap-4 select-none">
      {/* ━━━ Left Card: Profile & Wallet Balance ━━━ */}
      <motion.div 
        className="w-[45%] sm:w-[40%] md:w-[34%] flex-shrink-0 bg-[var(--pm-surface)] rounded-2xl sm:rounded-3xl p-3 sm:p-4.5 flex flex-col justify-between border border-[var(--pm-border)] shadow-sm relative overflow-hidden group"
        initial={{ opacity: 0, x: -15 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ duration: 0.3 }}
      >
        {/* Subtle decorative glow */}
        <div className="absolute -top-10 -left-10 w-24 h-24 bg-[var(--pm-accent)]/10 rounded-full blur-2xl pointer-events-none" />

        {/* Top Info: Greeting & Location */}
        <div className="space-y-1 sm:space-y-1.5 relative z-10">
          <div className="flex items-center justify-between">
            <span className="text-[9px] sm:text-[10px] uppercase tracking-wider font-extrabold text-[var(--pm-text-muted)]">
              স্বাগতম! 👋
            </span>
            <span className="inline-flex items-center gap-1 text-[8px] sm:text-[9px] font-black text-amber-400 bg-amber-500/10 px-1.5 py-0.5 rounded-full border border-amber-500/20">
              🪙 {coins ? coins.toLocaleString() : '১,২৫০'}
            </span>
          </div>

          <h2 className="text-xs sm:text-sm font-black text-[var(--pm-text)] truncate leading-tight">
            {isAuthenticated ? (user?.fullName || user?.name || user?.email?.split('@')[0]) : 'অতিথি ইউজার'}
          </h2>

          <div className="pt-0.5">
            <LocationPicker />
          </div>
        </div>

        {/* Bottom Box: Live Wallet Balance */}
        <div className="mt-2.5 sm:mt-3 p-2 sm:p-2.5 rounded-xl bg-gradient-to-r from-[var(--pm-accent)]/15 via-[var(--pm-accent)]/10 to-transparent border border-[var(--pm-accent)]/20 relative z-10">
          <div className="flex items-center justify-between">
            <Link 
              to="/wallet"
              className="text-[8px] sm:text-[9px] font-black text-[var(--pm-accent)] uppercase flex items-center gap-1 hover:underline tracking-wider"
            >
              <Wallet className="w-2.5 h-2.5 sm:w-3 sm:h-3" /> ওয়ালেট ব্যালেন্স
            </Link>
            <button 
              onClick={(e) => {
                e.stopPropagation();
                setBalanceVisible(!balanceVisible);
              }} 
              className="text-[var(--pm-accent)] hover:opacity-80 p-0.5 rounded transition-opacity"
              title={balanceVisible ? "ব্যালেন্স লুকান" : "ব্যালেন্স দেখুন"}
            >
              {balanceVisible ? <Eye className="w-3 h-3 sm:w-3.5 sm:h-3.5" /> : <EyeOff className="w-3 h-3 sm:w-3.5 sm:h-3.5" />}
            </button>
          </div>

          <div className="flex items-baseline justify-between mt-1">
            <p className="text-xs sm:text-base font-black text-[var(--pm-text)] tracking-tight">
              {balanceVisible ? `৳ ${balance ? balance.toLocaleString() : '৪৫,২৮০'}` : '••••••••'}
            </p>
            <Link 
              to="/wallet" 
              className="text-[8px] sm:text-[9px] font-bold text-[var(--pm-text-muted)] hover:text-[var(--pm-accent)] flex items-center"
            >
              টপ-আপ <ChevronRight className="w-2.5 h-2.5" />
            </Link>
          </div>
        </div>
      </motion.div>

      {/* ━━━ Right Card: Banner Carousel (Side by Side) ━━━ */}
      <motion.div 
        className="flex-1 rounded-2xl sm:rounded-3xl relative overflow-hidden shadow-md border border-white/10 min-h-[145px] sm:min-h-[165px]"
        initial={{ opacity: 0, x: 15 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ duration: 0.3 }}
      >
        <AnimatePresence mode="wait">
          <motion.div
            key={bannerIndex}
            className={`absolute inset-0 bg-gradient-to-br ${currentBanner.gradient} p-3 sm:p-5 flex flex-col justify-between`}
            initial={{ opacity: 0, scale: 0.98 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 1.02 }}
            transition={{ duration: 0.35 }}
          >
            {/* Top row in banner: Emoji and Badge */}
            <div className="flex items-center justify-between">
              <span className="text-xl sm:text-2xl filter drop-shadow">{currentBanner.emoji}</span>
              <span className="bg-white/20 backdrop-blur-md text-white text-[8px] sm:text-[9px] font-black uppercase px-2 py-0.5 rounded-full border border-white/25 shadow-xs">
                {currentBanner.badge}
              </span>
            </div>

            {/* Middle Title & Subtitle */}
            <div className="space-y-0.5 sm:space-y-1 my-auto">
              <h3 className="text-xs sm:text-base font-black text-white uppercase tracking-tight leading-snug drop-shadow-sm line-clamp-1">
                {currentBanner.title}
              </h3>
              <p className="text-[9px] sm:text-xs text-white/90 font-medium line-clamp-1">
                {currentBanner.subtitle}
              </p>
            </div>

            {/* Bottom Row: CTA Button & Pagination Dots */}
            <div className="flex items-center justify-between pt-1">
              <button 
                onClick={() => navigate(currentBanner.path)}
                className="flex items-center gap-1 bg-white text-zinc-900 text-[8px] sm:text-[10px] font-black rounded-full px-2.5 sm:px-3 py-1 sm:py-1.5 shadow-md hover:bg-zinc-100 active:scale-95 transition-all"
              >
                {currentBanner.cta} <ArrowRight className="w-2.5 h-2.5 sm:w-3 sm:h-3" />
              </button>

              {/* Pagination Dots */}
              <div className="flex items-center gap-1">
                {banners.map((_, i) => (
                  <button
                    key={i}
                    onClick={() => setBannerIndex(i)}
                    className={`h-1 rounded-full transition-all duration-300 ${
                      i === bannerIndex ? 'w-3.5 bg-white' : 'w-1 bg-white/40 hover:bg-white/70'
                    }`}
                    aria-label={`Slide ${i + 1}`}
                  />
                ))}
              </div>
            </div>
          </motion.div>
        </AnimatePresence>
      </motion.div>
    </div>
  );
}
