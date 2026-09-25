import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  ArrowRight, Sparkles, Building2, Store, ShieldCheck, 
  ChevronLeft, ChevronRight, Zap, TrendingUp, CheckCircle2 
} from 'lucide-react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '@/features/auth/AuthContext';
import { LocationPicker } from '@/components/common/navigation/LocationPicker';

// High-fidelity generated imagery
import heroWholesaleImg from '@/assets/images/paikarmart_hero_wholesale_1790278225564.jpg';
import heroRetailImg from '@/assets/images/paikarmart_hero_retail_1790278236779.jpg';

const HERO_SLIDES = [
  {
    id: 'wholesale',
    kicker: '🇧🇩 জাতীয় পাইকারি ও বি২বি হাব',
    title: 'সরাসরি মিল-গেট ও কারখানা দরে পাইকারি সংগ্রহ',
    subtitle: 'টেক্সটাইল, খাদ্যশস্য, ভোগ্যপণ্য ও ইলেকট্রনিক্স—দেশব্যাপী ভেরিফাইড ইমপোর্টার ও প্রস্তুতকারক থেকে পাইকারিতে কিনুন।',
    ctaPrimary: 'পাইকারি আড়তে প্রবেশ',
    ctaPrimaryPath: '/wholesale',
    ctaSecondary: 'ডিমান্ড পোস্ট করুন',
    ctaSecondaryPath: '/demand',
    badge: '০% প্ল্যাটফর্ম ফি',
    stat: '৫০,০০০+ সক্রিয় পাইকার',
    image: heroWholesaleImg,
    themeColor: 'from-orange-500/30 via-black/70 to-black/90',
  },
  {
    id: 'retail',
    kicker: '✨ প্রিমিয়াম রিটেইল ও ট্রেন্ডস',
    title: 'প্রামাণিক ব্র্যান্ড ও দেশীয় ঐতিহ্যের সেরা কালেকশন',
    subtitle: 'জামদানি শাড়ি, চামড়াজাত জুতো ও ওয়ালেট, লেটেস্ট অরিজিনাল গ্যাজেট—১০০% সুরক্ষিত এসক্রো ট্রাস্টে হোম ডেলিভারি।',
    ctaPrimary: 'রিটেইল মার্কেট দেখুন',
    ctaPrimaryPath: '/b2c',
    ctaSecondary: 'ফ্ল্যাশ ডিলস',
    ctaSecondaryPath: '/b2c?b2cView=deals',
    badge: '১০০% ক্যাশব্যাক গ্যারান্টি',
    stat: '১০,০০০+ কাস্টমার রিভিউ',
    image: heroRetailImg,
    themeColor: 'from-emerald-500/25 via-black/70 to-black/90',
  },
];

export default function HeroSection() {
  const { user, isAuthenticated } = useAuth();
  const [slideIndex, setSlideIndex] = useState(0);
  const navigate = useNavigate();

  useEffect(() => {
    const timer = setInterval(() => {
      setSlideIndex((prev) => (prev + 1) % HERO_SLIDES.length);
    }, 6000);
    return () => clearInterval(timer);
  }, []);

  const currentSlide = HERO_SLIDES[slideIndex];

  const handleNext = () => {
    setSlideIndex((prev) => (prev + 1) % HERO_SLIDES.length);
  };

  const handlePrev = () => {
    setSlideIndex((prev) => (prev - 1 + HERO_SLIDES.length) % HERO_SLIDES.length);
  };

  return (
    <div className="w-full relative select-none rounded-3xl overflow-hidden border border-[var(--pm-border)] shadow-xl bg-[var(--pm-surface)]">
      
      {/* Background Image Container with Cross-Fade */}
      <div className="relative w-full h-[220px] sm:h-[260px] md:h-[300px] lg:h-[340px] overflow-hidden">
        <AnimatePresence mode="wait">
          <motion.div
            key={currentSlide.id}
            initial={{ opacity: 0, scale: 1.04 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.7, ease: 'easeOut' }}
            className="absolute inset-0 bg-cover bg-center"
            style={{ backgroundImage: `url(${currentSlide.image})` }}
          />
        </AnimatePresence>

        {/* Dynamic Dark Gradient Scrim for WCAG AA readability */}
        <div className={`absolute inset-0 bg-gradient-to-r from-black/90 via-black/75 to-black/40 z-10`} />
        <div className="absolute inset-0 bg-radial at-top-left from-transparent via-black/20 to-black/60 z-10" />

        {/* Content Container */}
        <div className="relative z-20 h-full flex flex-col justify-between p-4 sm:p-6 md:p-8 lg:p-10">
          
          {/* Top Bar inside Hero: Location & User Greeting */}
          <div className="flex items-center justify-between gap-2">
            <div className="flex items-center gap-2">
              <span className="text-[10px] sm:text-xs font-black uppercase tracking-wider text-[var(--pm-accent)] flex items-center gap-1.5 bg-black/40 backdrop-blur-md px-2.5 py-1 rounded-full border border-white/10">
                <Sparkles className="w-3 h-3" />
                {currentSlide.kicker}
              </span>
              <span className="hidden md:inline-flex text-[10px] font-bold text-emerald-400 bg-emerald-500/10 border border-emerald-500/20 px-2 py-0.5 rounded-full">
                {currentSlide.badge}
              </span>
            </div>

            <div className="flex items-center gap-2">
              <div className="hidden sm:block">
                <LocationPicker />
              </div>
            </div>
          </div>

          {/* Center Text Block */}
          <div className="max-w-2xl space-y-2 sm:space-y-3">
            <AnimatePresence mode="wait">
              <motion.div
                key={currentSlide.title}
                initial={{ opacity: 0, y: 12 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -12 }}
                transition={{ duration: 0.4 }}
                className="space-y-2"
              >
                <h1 className="text-lg sm:text-2xl md:text-3xl lg:text-4xl font-black text-white tracking-tight leading-tight sm:leading-tight">
                  {currentSlide.title}
                </h1>
                <p className="text-xs sm:text-sm text-zinc-300 font-medium line-clamp-2 md:line-clamp-none max-w-xl leading-relaxed">
                  {currentSlide.subtitle}
                </p>
              </motion.div>
            </AnimatePresence>

            {/* CTAs */}
            <div className="pt-1 sm:pt-2 flex flex-wrap items-center gap-2.5 sm:gap-3.5">
              <button
                onClick={() => navigate(currentSlide.ctaPrimaryPath)}
                className="px-4 sm:px-6 py-2 sm:py-2.5 rounded-xl bg-[var(--pm-accent)] hover:bg-[var(--pm-accent-hover)] text-white text-xs sm:text-sm font-black transition-all shadow-lg shadow-[var(--pm-accent)]/25 flex items-center gap-1.5 active:scale-95 whitespace-nowrap"
              >
                <span>{currentSlide.ctaPrimary}</span>
                <ArrowRight className="w-4 h-4" />
              </button>

              <button
                onClick={() => navigate(currentSlide.ctaSecondaryPath)}
                className="px-3.5 sm:px-5 py-2 sm:py-2.5 rounded-xl bg-white/10 hover:bg-white/20 text-white text-xs sm:text-sm font-bold border border-white/20 backdrop-blur-md transition-all active:scale-95 whitespace-nowrap"
              >
                <span>{currentSlide.ctaSecondary}</span>
              </button>

              <span className="hidden lg:inline-flex text-[11px] font-semibold text-zinc-400 items-center gap-1.5 pl-2">
                <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" />
                {currentSlide.stat}
              </span>
            </div>
          </div>

          {/* Bottom Controls: Indicators and Next/Prev */}
          <div className="flex items-center justify-between pt-2">
            <div className="flex items-center gap-2">
              {HERO_SLIDES.map((_, i) => (
                <button
                  key={i}
                  onClick={() => setSlideIndex(i)}
                  className={`h-2 rounded-full transition-all duration-300 ${
                    slideIndex === i 
                      ? 'w-8 bg-[var(--pm-accent)] shadow-sm shadow-[var(--pm-accent)]/50' 
                      : 'w-2 bg-white/30 hover:bg-white/60'
                  }`}
                  title={`Slide ${i + 1}`}
                />
              ))}
            </div>

            {/* Next / Prev Navigation */}
            <div className="flex items-center gap-1.5">
              <button
                onClick={handlePrev}
                className="w-7 h-7 sm:w-8 sm:h-8 rounded-full bg-black/40 hover:bg-black/70 border border-white/15 text-white flex items-center justify-center transition-all active:scale-90"
                title="Previous Slide"
              >
                <ChevronLeft className="w-4 h-4" />
              </button>
              <button
                onClick={handleNext}
                className="w-7 h-7 sm:w-8 sm:h-8 rounded-full bg-black/40 hover:bg-black/70 border border-white/15 text-white flex items-center justify-center transition-all active:scale-90"
                title="Next Slide"
              >
                <ChevronRight className="w-4 h-4" />
              </button>
            </div>
          </div>

        </div>
      </div>
    </div>
  );
}
