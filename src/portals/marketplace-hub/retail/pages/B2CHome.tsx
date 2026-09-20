import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  ShoppingBag, Search, Star, ShieldCheck, ArrowRight,
  ShoppingCart, Plus, Minus, Store, ChevronRight, Zap, 
  BadgePercent, X, Mic, RefreshCw, Layers, Award, Sparkles,
  Shirt, Laptop, Sofa, Grape, Smartphone, Trophy, Compass,
  LayoutGrid, Megaphone, HelpCircle, Flame, Grid, Gift
} from 'lucide-react';
import { useNavigate, useSearchParams } from 'react-router-dom';

// Import our newly created high fidelity B2C detail screens
import { B2CProductDetail } from './B2CProductDetail';
import { B2CStoreProfile } from './B2CStoreProfile';
import { B2CBrandProfile } from './B2CBrandProfile';
import { B2CDeals } from './B2CDeals';

// Import Product interface and mock products list
import { ProductCard } from "@/features/product/components/ProductCard";
import { Product } from '@/modules/product/types/product.types';
import { mockProducts } from '@/portals/marketplace-hub/retail/data/products';

import { useCartStore } from '@modules/cart';
import { useNotificationStore } from '@/modules/notification/notificationStore';
import { useAuth } from '@/features/auth/AuthContext';
import { useCartDrawerStore } from '@/modules/cart/cartDrawerStore';
import { StoryBar } from '@shared/StoryBar';
import { CategoryNavBar } from '@shared/CategoryNavBar';
import { toast } from 'sonner';

const CATEGORIES = [
  { id: 'fashion', name: 'ফ্যাশন', icon: Shirt, searchTag: 'ফ্যাশন' },
  { id: 'electronics', name: 'ইলেকট্রনিক্স', icon: Laptop, searchTag: 'ইলেকট্রনিক্স' },
  { id: 'home', name: 'হোম ডেকো', icon: Sofa, searchTag: 'গৃহস্থালি' },
  { id: 'grocery', name: 'গ্রোসারি', icon: Grape, searchTag: 'গ্রোসারি' },
  { id: 'beauty', name: 'রূপচর্চা', icon: Sparkles, searchTag: 'সৌন্দর্য' },
  { id: 'mobile', name: 'মোবাইল', icon: Smartphone, searchTag: 'ইলেকট্রনিক্স' },
  { id: 'sports', name: 'খেলাধুলা', icon: Trophy, searchTag: 'গৃহস্থালি' }
];

const BRANDS = [
  { id: 'Bata', name: 'Bata', short: 'B', color: 'from-amber-500 to-orange-600', tagline: 'পছন্দের জুতো' },
  { id: 'Aarong', name: 'Aarong', short: 'A', color: 'from-pink-500 to-rose-600', tagline: 'ঐতিহ্যের ফ্যাশন' },
  { id: 'Unilever', name: 'Unilever', short: 'U', color: 'from-blue-500 to-cyan-600', tagline: 'দৈনন্দিন লাইফস্টাইল' }
];

const FEATURED_STORES = [
  { name: 'চামড়া হাট (Leather House)', icon: ShoppingBag, followers: '১২.৪কে', rating: 4.9, color: 'text-orange-400 bg-orange-500/10 border-orange-500/20' },
  { name: 'গেজেট বাইট (GadgetByte)', icon: Smartphone, followers: '১৯.২কে', rating: 4.8, color: 'text-cyan-400 bg-cyan-500/10 border-cyan-500/20' },
  { name: 'সাউন্ড বিডি (SoundBD)', icon: Laptop, followers: '৮.৫কে', rating: 4.7, color: 'text-pink-400 bg-pink-500/10 border-pink-500/20' }
];

const SPOTLIGHT_SLIDES = [
  {
    id: 1,
    title: 'ফ্যাশন মেগা সেল',
    desc: 'দেশীয় বুটিক ও এক্সক্লুসিভ পাঞ্জাবি কালেকশনে ৫০% পর্যন্ত ফ্ল্যাট ছাড়!',
    badge: 'ঈদ স্পেশাল ক্যাম্পেইন',
    btnText: 'সংগ্রহ দেখুন',
    gradient: 'from-orange-500/20 via-pink-600/10 to-transparent',
    borderGlow: 'border-orange-500/30',
    accentColor: 'text-[var(--pm-accent)]',
    image: 'https://images.unsplash.com/photo-1596783074918-c84cb06531ca?auto=format&fit=crop&w=300&q=80',
    category: 'fashion'
  },
  {
    id: 2,
    title: 'প্রিমিয়াম গ্যাজেট হাব',
    desc: 'ভেরিফাইড হোলসেলার থেকে সরাসরি লেটেস্ট ইয়ারবাডস ও স্মার্টওয়াচ।',
    badge: '১০০% অরিজিনাল অ্যারাইভাল',
    btnText: 'অফার চেক করুন',
    gradient: 'from-cyan-500/20 via-indigo-600/10 to-transparent',
    borderGlow: 'border-cyan-500/30',
    accentColor: 'text-cyan-400',
    image: 'https://images.unsplash.com/photo-1546868871-7041f2a55e12?auto=format&fit=crop&w=300&q=80',
    category: 'electronics'
  },
  {
    id: 3,
    title: 'বিশুদ্ধ খাস অর্গানিক',
    desc: 'সুন্দরবনের খাঁটি মধু ও প্রিমিয়াম সরিষার তেল সরাসরি শস্য খামার থেকে।',
    badge: 'অর্গানিক ফুড গ্যারান্টি',
    btnText: 'বিশুদ্ধতা কিনুন',
    gradient: 'from-cyan-500/20 via-teal-600/10 to-transparent',
    borderGlow: 'border-cyan-500/30',
    accentColor: 'text-cyan-400',
    image: 'https://images.unsplash.com/photo-1587049352846-4a222e784d38?auto=format&fit=crop&w=300&q=80',
    category: 'grocery'
  }
];

export const B2CHome = () => {
  const navigate = useNavigate();
  const [searchParams, setSearchParams] = useSearchParams();
  
  // Dynamic navigation views states
  const [view, setView] = useState<'home' | 'product' | 'store' | 'brand' | 'deals'>('home');
  const [selectedEntityId, setSelectedEntityId] = useState<string>('');
  const [selectedProduct, setSelectedProduct] = useState<any | null>(null);

  // Spotlight rotation slide (new add)
  const [activeHeroSlide, setActiveHeroSlide] = useState(0);

  // Search & Filters state
  const [searchQuery, setSearchQuery] = useState('');
  const [activeCategory, setActiveCategory] = useState<string>('all');
  const [sortBy, setSortBy] = useState('trending');
  
  // Notice board and rating dropdowns
  const [showBanner, setShowBanner] = useState(true);
  const [ratingStore, setRatingStore] = useState<string | null>(null);
  
  // Voice Search states
  const [voiceListening, setVoiceListening] = useState(false);

  // Auto-play Spotlight timer
  useEffect(() => {
    const timer = setInterval(() => {
      setActiveHeroSlide(prev => (prev + 1) % SPOTLIGHT_SLIDES.length);
    }, 4500);
    return () => clearInterval(timer);
  }, []);

  // Guest & Auth status checks
  const { user, isAuthenticated } = useAuth();
  const [showGuestWarn, setShowGuestWarn] = useState(false);

  const cartItems = useCartStore((state) => state.items);
  const addItem = useCartStore((state) => state.addItem);
  const cartTotalItems = useCartStore((state) => state.getTotalItems());
  const cartTotalValue = useCartStore((state) => state.getTotalPrice());
  const openCart = useCartDrawerStore((state) => state.open);

  const addNotification = useNotificationStore((state) => state.addNotification);

  // Sync state with URL Search Params for pristine PWA bookmark routing matching
  useEffect(() => {
    const routeView = searchParams.get('b2cView');
    const entityId = searchParams.get('b2cId');
    const cat = searchParams.get('cat') || 'all';

    setActiveCategory(cat);

    if (routeView === 'product' && entityId) {
      const found = mockProducts.find((p: any) => p.id === entityId);
      if (found) {
        setSelectedProduct(found);
        setView('product');
        return;
      }
    } else if (routeView === 'store' && entityId) {
      setSelectedEntityId(entityId);
      setView('store');
      return;
    } else if (routeView === 'brand' && entityId) {
      setSelectedEntityId(entityId);
      setView('brand');
      return;
    } else if (routeView === 'deals') {
      setView('deals');
      return;
    }
    
    // Fallback to Main landing
    setView('home');
  }, [searchParams]);

  // Unified voice search simulation
  const handleTriggerVoice = () => {
    setVoiceListening(true);
    setTimeout(() => {
      // Simulate speaking "ওয়ালেট" (Wallet)
      const vocalResults = ["ওয়ালেট", "স্মার্ট ওয়াচ", "পাঞ্জাবি", "মধু"];
      const randomQuery = vocalResults[Math.floor(Math.random() * vocalResults.length)];
      setSearchQuery(randomQuery);
      setVoiceListening(false);
      toast.info(`ভয়েস ইনপুট সনাক্ত হয়েছে: "${randomQuery}"`);
    }, 1800);
  };

  // Filter products matching parameters
  const filteredProducts = mockProducts.filter((p: any) => {
    // Exclude strict B2B portal listings if B2C is browsed, unless matching category
    const isB2COrPk = p.portal === 'b2c' || p.portal === 'pk-shop';
    const matchesSearch = p.title.toLowerCase().includes(searchQuery.toLowerCase()) || 
                          p.category.toLowerCase().includes(searchQuery.toLowerCase()) ||
                          p.sellerId.toLowerCase().includes(searchQuery.toLowerCase());
    
    // Normalize Category ID
    let mappedCat = activeCategory;
    if (activeCategory === 'tech') mappedCat = 'electronics';
    
    const matchesCategory = mappedCat === 'all' 
      ? true 
      : p.category === CATEGORIES.find(c => c.id === mappedCat)?.searchTag;

    return isB2COrPk && matchesSearch && matchesCategory;
  });

  // Calculate sorted products dynamically (new add)
  const getSortedProducts = (productsToSort: any[]) => {
    const list = [...productsToSort];
    if (sortBy === 'price-asc') {
      return list.sort((a, b) => a.price - b.price);
    }
    if (sortBy === 'price-desc') {
      return list.sort((a, b) => b.price - a.price);
    }
    if (sortBy === 'rating') {
      return list.sort((a, b) => (b.rating || 4.5) - (a.rating || 4.5));
    }
    // Default trending/popularity sorting: by sold count descending
    return list.sort((a, b) => (b.reviewCount || 0) - (a.reviewCount || 0));
  };

  const sortedFilteredProducts = getSortedProducts(filteredProducts);

  const toggleRatingStore = (e: React.MouseEvent, storeName: string) => {
    e.stopPropagation();
    if (ratingStore === storeName) {
      setRatingStore(null);
    } else {
      setRatingStore(storeName);
      toast.info(`${storeName} এর ৪.৯ রেট রিভিউ পরিসংখ্যান বিশ্লেষণ করা হয়েছে`);
    }
  };

  // Highlight Deals Items (Horizontal flash sale roll banner with progress)
  const flashDeals = mockProducts.filter((p: any) => p.isFlashSale);

  const handleSelectProduct = (prod: Product) => {
    setSearchParams({ b2cView: 'product', b2cId: prod.id });
  };

  const handleSelectStore = (storeName: string) => {
    setSearchParams({ b2cView: 'store', b2cId: storeName });
  };

  const handleSelectBrand = (brandName: string) => {
    setSearchParams({ b2cView: 'brand', b2cId: brandName });
  };

  const handleBackToHome = () => {
    setSearchParams({});
  };

  // Check out block validation restricting guests
  const handleTriggerCheckout = () => {
    if (!isAuthenticated) {
      setShowGuestWarn(true);
    } else {
      openCart();
    }
  };

  // ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
  // Sub-Router Views Rendering Conditions
  // ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
  if (view === 'product' && selectedProduct) {
    return (
      <B2CProductDetail
        product={selectedProduct}
        onBack={handleBackToHome}
        onVisitStore={handleSelectStore}
        onVisitBrand={handleSelectBrand}
      />
    );
  }

  if (view === 'store' && selectedEntityId) {
    return (
      <B2CStoreProfile
        storeName={selectedEntityId}
        products={mockProducts as any}
        onBack={handleBackToHome}
        onSelectProduct={handleSelectProduct}
      />
    );
  }

  if (view === 'brand' && selectedEntityId) {
    return (
      <B2CBrandProfile
        brandId={selectedEntityId}
        products={mockProducts as any}
        onBack={handleBackToHome}
        onSelectProduct={handleSelectProduct}
      />
    );
  }

  if (view === 'deals') {
    return (
      <B2CDeals
        products={mockProducts}
        onBack={handleBackToHome}
        onSelectProduct={handleSelectProduct}
      />
    );
  }

  return (
    <div className="w-full pb-28 text-[var(--pm-text)] flex flex-col gap-0 select-none">
      
      {/* ━━━ HERO ZONE: Stories ━━━ */}
      <section className="pt-2 animate-fade-in">
        <StoryBar context="retail" />
      </section>

      {/* ━━━ STICKY PORTAL NAVIGATION CATEGORIES BAR ━━━ */}
      <div className="md:sticky top-16 z-40 bg-[var(--pm-bg)]/95 backdrop-blur-lg border-b border-white/[0.06] mt-2 -mx-4 px-1">
        <CategoryNavBar context="retail" />
      </div>

      {/* ━━━ DISMISSIBLE HIGH-VISIBILITY NOTICE MARQUEE BANNER (v01 upgrade) ━━━ */}
      <AnimatePresence>
        {showBanner && (
          <motion.div
            initial={{ opacity: 0, height: 0, marginTop: 0 }}
            animate={{ opacity: 1, height: 'auto', marginTop: 12 }}
            exit={{ opacity: 0, height: 0, marginTop: 0 }}
            className="relative bg-gradient-to-r from-pink-600/15 via-orange-600/10 to-amber-600/15 border border-orange-500/15 rounded-2xl p-3 flex items-center justify-between gap-3 overflow-hidden"
          >
            <div className="absolute inset-y-0 left-0 w-1 bg-[var(--pm-accent)]" />
            <div className="flex items-center gap-2.5">
              <span className="relative flex h-2 w-2">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-red-400 opacity-75"></span>
                <span className="relative inline-flex rounded-full h-2 w-2 bg-red-500"></span>
              </span>
              <div className="text-left">
                <p className="text-[10px] font-black text-white flex items-center gap-1.5 uppercase tracking-wide">
                  <Zap className="w-3.5 h-3.5 text-amber-400 fill-amber-400" /> ক্যাম্পেইন অফার
                </p>
                <p className="text-[9px] text-[var(--pm-text-secondary)] font-semibold leading-relaxed mt-0.5">
                  বিকাশ ও নগদ পেমেন্টে <span className="text-[var(--pm-accent)] font-extrabold">১০% ক্যাশব্যাক</span> অফার চলমান! অর্ডার ভ্যালু ছাড়িয়ে এখনই লুফে নিন।
                </p>
              </div>
            </div>
            <button 
              onClick={() => setShowBanner(false)}
              className="p-1 rounded-full text-zinc-500 hover:text-white transition-colors shrink-0"
              title="বন্ধ করুন"
            >
              <X className="w-3.5 h-3.5" />
            </button>
          </motion.div>
        )}
      </AnimatePresence>

      {/* ━━━ TOP COMPACT SEARCH BAR WITH INSTANT VOICE ENGAGE ━━━ */}
      <div className="mt-4 flex gap-2">
        <div className="flex-1 h-11 bg-[var(--pm-surface)] rounded-xl border border-white/[0.08] px-3.5 flex items-center gap-2 focus-within:border-[var(--pm-accent)] transition-all">
          <Search className="w-4.5 h-4.5 text-[var(--pm-text-secondary)]" />
          <input 
            type="text" 
            placeholder="ফ্যাশন, ইলেকট্রনিক্স বা শপ খুঁজুন..."
            value={searchQuery}
            onChange={e => setSearchQuery(e.target.value)}
            className="flex-1 bg-transparent border-none text-[11px] text-white focus:outline-none placeholder-zinc-500 font-semibold"
          />
          {searchQuery && (
            <button 
              onClick={() => setSearchQuery('')}
              className="p-1 rounded-full text-zinc-500 hover:text-white"
            >
              <X className="w-4 h-4" />
            </button>
          )}
        </div>
        <button 
          onClick={handleTriggerVoice}
          className="w-11 h-11 rounded-xl bg-[var(--pm-surface)] border border-white/[0.08] flex items-center justify-center text-[var(--pm-accent)] transition-all active:scale-95 hover:bg-white/5 outline-none"
          title="ভয়েস ডিক্টেশন"
        >
          <Mic className="w-4.5 h-4.5" />
        </button>
      </div>

      {/* ━━━ POPULAR SEARCH SUGGESTIONS CAROUSEL (update-v01) ━━━ */}
      <div className="mt-2.5 flex items-center gap-1.5 overflow-x-auto pb-1 scrollbar-none flex-nowrap">
        <span className="text-[9px] text-[var(--pm-text-secondary)] font-bold shrink-0">আজকের ট্রেন্ড:</span>
        {['ওয়ালেট', 'স্মার্ট ওয়াচ', 'পাঞ্জাবি', 'মধু', 'ব্লুটুথ'].map((tag) => (
          <button
            key={tag}
            onClick={() => {
              setSearchQuery(tag);
              toast.success(`"${tag}" সার্চ ফিল্টারে যুক্ত হয়েছে`);
            }}
            className="px-2.5 py-1 rounded-full bg-[var(--pm-surface)] hover:bg-[var(--pm-surface-hover)] border border-white/[0.04] text-[9px] font-bold text-zinc-300 hover:text-[var(--pm-accent)] transition-all shrink-0 active:scale-95 whitespace-nowrap"
          >
            #{tag}
          </button>
        ))}
      </div>

      {/* ━━━ SORT AND FILTER TOOLBAR (new add) ━━━ */}
      <div className="mt-4 bg-[var(--pm-surface)]/60 border border-white/[0.04] p-2.5 rounded-2xl flex items-center justify-between gap-2 overflow-hidden">
        <div className="flex items-center gap-1.5 text-[10px] text-zinc-400 font-extrabold shrink-0">
          <Layers className="w-3.5 h-3.5 text-[var(--pm-accent)]" />
          <span>সাজানো:</span>
        </div>
        <div className="flex gap-1.5 overflow-x-auto scrollbar-none select-none">
          {[
            { id: 'trending', label: 'জনপ্রিয়' },
            { id: 'price-asc', label: 'দাম: কম ৳' },
            { id: 'price-desc', label: 'দাম: বেশি ৳' },
            { id: 'rating', label: 'সেরা রেটিং' }
          ].map(opt => (
            <button
              key={opt.id}
              onClick={() => {
                setSortBy(opt.id);
                toast.success(`পদ্ধতিতে সাজানো হয়েছে: ${opt.label}`);
              }}
              className={`px-3 py-1 rounded-xl text-[9px] font-black tracking-wide shrink-0 transition-all ${
                sortBy === opt.id
                  ? 'bg-[var(--pm-accent)] text-white scale-[1.02]'
                  : 'bg-[var(--pm-surface)] text-[var(--pm-text-secondary)] border border-white/[0.03] active:scale-95'
              }`}
            >
              {opt.label}
            </button>
          ))}
        </div>
      </div>

      {/* ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
          CONDITIONAL LANDING DISPLAY (Defaults when no query is typed)
          ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━ */}
      {searchQuery === '' && activeCategory === 'all' ? (
        <div className="space-y-6 mt-4">
          
          {/* ━━━ B2C HERO SPOTLIGHT CAROUSEL SECTION (update-v01) ━━━ */}
          <section className="relative overflow-hidden rounded-3xl border border-white/[0.08] bg-[var(--pm-surface)] h-[170px] flex flex-col justify-end p-4 select-none">
            {/* Background Image Carousel with absolute transition */}
            <div className="absolute inset-0 z-0">
              <AnimatePresence mode="wait">
                <motion.div
                  key={activeHeroSlide}
                  initial={{ opacity: 0, scale: 1.05 }}
                  animate={{ opacity: 0.6, scale: 1 }}
                  exit={{ opacity: 0 }}
                  transition={{ duration: 0.6 }}
                  className="absolute inset-0 bg-cover bg-center"
                  style={{ backgroundImage: `url(${SPOTLIGHT_SLIDES[activeHeroSlide].image})` }}
                />
              </AnimatePresence>
              {/* Radial gradient shading */}
              <div className="absolute inset-0 bg-gradient-to-t from-[var(--pm-surface)] via-[var(--pm-surface)]/85 to-transparent z-10" />
              {/* Selected slide dynamic gradient accent layer */}
              <div className={`absolute inset-0 bg-gradient-to-r ${SPOTLIGHT_SLIDES[activeHeroSlide].gradient} z-10 opacity-70`} />
            </div>

            {/* Slide Content */}
            <div className="relative z-20 space-y-2 text-left max-w-[85%]">
              <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full bg-[var(--pm-accent)]/25 border border-[var(--pm-accent)]/30 text-[8px] font-black text-[var(--pm-accent)] uppercase tracking-wide">
                <Sparkles className="w-2.5 h-2.5" />
                {SPOTLIGHT_SLIDES[activeHeroSlide].badge}
              </span>
              <h2 className="text-base font-black text-white tracking-tight leading-snug">
                {SPOTLIGHT_SLIDES[activeHeroSlide].title}
              </h2>
              <p className="text-[10px] text-[var(--pm-text-secondary)] font-medium leading-normal line-clamp-1 max-w-[90%]">
                {SPOTLIGHT_SLIDES[activeHeroSlide].desc}
              </p>
              
              <div className="pt-1 flex items-center gap-3.5">
                <button
                  onClick={() => {
                    const slide = SPOTLIGHT_SLIDES[activeHeroSlide];
                    setActiveCategory(slide.category);
                    toast.success(`"${slide.title}" সেকশনে আপনাকে স্বাগতম!`);
                  }}
                  className="px-4 py-1.5 rounded-full bg-white text-black font-black text-[9px] hover:bg-zinc-200 transition-all select-none duration-150 active:scale-95 shadow-md shadow-white/5 cursor-pointer flex items-center gap-1 hover:gap-1.5"
                >
                  <span>{SPOTLIGHT_SLIDES[activeHeroSlide].btnText}</span>
                  <ChevronRight className="w-3 h-3 text-black stroke-[3px]" />
                </button>
              </div>
            </div>

            {/* Slide Indicators Dots */}
            <div className="absolute bottom-4.5 right-4 z-20 flex gap-1.5">
              {SPOTLIGHT_SLIDES.map((_, i) => (
                <button
                  key={i}
                  onClick={() => setActiveHeroSlide(i)}
                  className={`h-1.5 rounded-full transition-all ${
                    activeHeroSlide === i 
                      ? 'w-4 bg-[var(--pm-accent)]' 
                      : 'w-1.5 bg-white/30 hover:bg-white/60'
                  }`}
                  title={`স্লাইড ${i + 1}`}
                />
              ))}
            </div>
          </section>
          
          {/* FLASH DEALS COUNTDOWN TIMER COMPONENT */}
          <section className="p-4 rounded-3xl bg-gradient-to-br from-red-600/10 via-orange-600/5 to-transparent border border-red-500/15">
            <div className="flex items-center justify-between mb-3.5">
              <div className="flex items-center gap-1.5 text-xs font-black text-white select-none">
                <Zap className="w-4.5 h-4.5 text-red-500 fill-red-500" />
                <span>ফ্ল্যাশ সেল</span>
                <span className="bg-red-600 font-mono text-[9px] text-white px-2 py-0.5 rounded ml-1 animate-pulse">৩ ঘণ্টা বাকি</span>
              </div>
              <button 
                onClick={() => setSearchParams({ b2cView: 'deals' })}
                className="text-[9px] font-black uppercase text-[var(--pm-accent)] tracking-wider flex items-center gap-0.5"
              >
                সব দেখুন <ArrowRight className="w-3 h-3" />
              </button>
            </div>

            {/* Horizontal Scroll Deals List */}
            <div className="flex gap-3 overflow-x-auto pb-1 scrollbar-none -mx-4 px-4">
              {flashDeals.map((prod: any, index: number) => {
                const claimed = (index * 17 + 29) % 100;
                return (
                  <div 
                    key={prod.id} 
                    onClick={() => handleSelectProduct(prod)}
                    className="w-32 bg-[var(--pm-surface)] border border-white/[0.04] p-2.5 rounded-2xl shrink-0 space-y-2 cursor-pointer relative hover:scale-102 transition-all"
                  >
                    <div className="aspect-square rounded-xl overflow-hidden bg-white relative">
                      <img src={prod.image} alt={prod.title} className="w-full h-full object-cover" />
                      <span className="absolute bottom-1 left-1 bg-red-600 text-white font-black text-[7px] px-1 py-0.2 rounded">
                        -{prod.oldPrice ? Math.round(((prod.oldPrice - prod.price) / prod.oldPrice) * 100) : 30}%
                      </span>
                    </div>
                    <div className="text-left space-y-0.5 select-none">
                      <h4 className="text-[10px] font-black text-white leading-snug truncate">{prod.title}</h4>
                      <p className="text-xs font-semibold text-red-500">৳{prod.price}</p>
                    </div>
                    {/* Compact stock bar */}
                    <div className="w-full h-1 bg-white/5 rounded-full overflow-hidden">
                      <div className="h-full bg-gradient-to-r from-red-600 to-amber-500" style={{ width: `${claimed}%` }} />
                    </div>
                  </div>
                );
              })}
            </div>
          </section>

          {/* BRAND HIGHLIGHTS CAROUSEL */}
          <section className="space-y-3 select-none">
            <h3 className="text-[11px] font-black uppercase text-zinc-400 tracking-wider">সেরা ব্র্যান্ড সমূহ</h3>
            <div className="grid grid-cols-3 gap-2.5">
              {BRANDS.map(br => (
                <div 
                  key={br.id}
                  onClick={() => handleSelectBrand(br.id)}
                  className="bg-[var(--pm-surface)] hover:bg-[var(--pm-surface-hover)] border border-white/[0.06] rounded-2xl p-3.5 text-center cursor-pointer transition-all hover:y-[-2px] hover:shadow-lg flex flex-col items-center gap-1.5"
                >
                  <div className={`w-9 h-9 rounded-full bg-gradient-to-br ${br.color} flex items-center justify-center text-xs font-black text-white shadow-md shadow-black/20`}>
                    {br.short}
                  </div>
                  <div>
                    <h4 className="text-[10px] font-extrabold text-white">{br.name}</h4>
                    <p className="text-[8px] text-[var(--pm-text-secondary)] font-semibold mt-0.5 truncate max-w-full">{br.tagline}</p>
                  </div>
                </div>
              ))}
            </div>
          </section>

          {/* TRENDING PRODUCTS (Horizontal scroll popularity) */}
          <section className="space-y-3">
            <div className="flex items-center justify-between">
              <h3 className="text-[11px] font-black uppercase text-zinc-400 tracking-wider flex items-center gap-1">
                <Sparkles className="w-3.5 h-3.5 text-amber-400" /> ট্রেন্ডিং প্রোডাক্টস
              </h3>
            </div>
            <div className="flex gap-3 overflow-x-auto pb-2 scrollbar-none -mx-4 px-4">
              {mockProducts.slice(4, 9).map((prod: any) => (
                <div 
                  key={prod.id}
                  onClick={() => handleSelectProduct(prod)}
                  className="w-36 bg-[var(--pm-surface)] border border-white/[0.05] rounded-2xl p-2.5 shrink-0 space-y-2.5 text-left cursor-pointer hover:y-[-2px] transition-transform"
                >
                  <div className="aspect-square rounded-xl bg-white overflow-hidden">
                    <img src={prod.image} alt={prod.title} className="w-full h-full object-cover" />
                  </div>
                  <div className="space-y-1">
                    <h4 className="text-[10px] font-bold text-white line-clamp-1">{prod.title}</h4>
                    <div className="flex items-center justify-between">
                      <span className="text-xs font-black text-[var(--pm-accent)]">৳{prod.price}</span>
                      <span className="text-[8px] text-[var(--pm-text-secondary)] font-extrabold">{prod.reviewCount || 100}+ পিস</span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </section>

          {/* RETAIL STORE SPOTLIGHT SECTION WITH RATING STATISTICS MATRIX (update-v01) */}
          <section className="space-y-3">
            <h3 className="text-[11px] font-black uppercase text-zinc-400 tracking-wider">রিসেন্ট মার্চেন্ট স্পটলাইট</h3>
            <div className="space-y-2.5">
              {FEATURED_STORES.map((sh, index) => {
                const isBreakdownOpen = ratingStore === sh.name;
                const IconComponent = sh.icon;
                return (
                  <div key={index} className="flex flex-col gap-0 rounded-2xl bg-[var(--pm-surface)] border border-white/[0.05] overflow-hidden">
                    <div 
                      onClick={() => handleSelectStore(sh.name)}
                      className="p-3.5 hover:bg-[var(--pm-surface-hover)] transition-all flex items-center gap-3.5 cursor-pointer text-left"
                    >
                      <div className={`w-10 h-10 rounded-xl flex items-center justify-center shrink-0 border border-white/[0.04] ${sh.color}`}>
                        <IconComponent className="w-5 h-5" />
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-1">
                          <h4 className="text-xs font-black text-white truncate">{sh.name}</h4>
                          <ShieldCheck className="w-3.5 h-3.5 text-cyan-400 fill-cyan-400/10 shrink-0" />
                        </div>
                        {/* Rating click triggers animated dropdown */}
                        <div 
                          onClick={(e) => toggleRatingStore(e, sh.name)}
                          className="flex items-center gap-1.5 mt-0.5 text-[9px] text-[var(--pm-text-secondary)] font-bold hover:text-amber-400 transition-colors"
                          title="রিভিউ পরিসংখ্যান দেখুন"
                        >
                          <span className="flex items-center gap-0.5 text-amber-400">
                            <Star className="w-3 h-3 fill-amber-400" />
                            {sh.rating}
                          </span>
                          <span>• {sh.followers} ক্রেতা • বিশ্লেষণ দেখুন</span>
                        </div>
                      </div>
                      <button className="text-[8px] font-black bg-[var(--pm-accent)]/10 text-[var(--pm-accent)] border border-[var(--pm-accent)]/20 px-3 py-1.5 rounded-xl uppercase tracking-wider shrink-0 transition-all hover:bg-[var(--pm-accent)] hover:text-white">
                        ভিজিট
                      </button>
                    </div>

                    {/* Animated Star Rating Breakdown Metrics Chart (update-v01) */}
                    <AnimatePresence>
                      {isBreakdownOpen && (
                        <motion.div
                          initial={{ opacity: 0, height: 0 }}
                          animate={{ opacity: 1, height: 'auto' }}
                          exit={{ opacity: 0, height: 0 }}
                          className="px-4 pb-3.5 pt-1.5 border-t border-white/[0.03] bg-zinc-950/20 text-left space-y-1.5 text-[9px] select-none"
                        >
                          <p className="text-[8px] font-bold text-zinc-400 uppercase tracking-wider">রেটিং বিতরণ বিশ্লেষণ (Rating Metrics)</p>
                          {[
                            { stars: 5, pct: 88, count: '১০.৯কে' },
                            { stars: 4, pct: 9, count: '১.১কে' },
                            { stars: 3, pct: 2, count: '২৪০' },
                            { stars: 2, pct: 1, count: '১০০' },
                            { stars: 1, pct: 0, count: '০' }
                          ].map(metric => (
                            <div key={metric.stars} className="flex items-center gap-2">
                              <span className="w-8 text-[8px] font-bold text-zinc-400 flex items-center gap-0.5">
                                {metric.stars}★
                              </span>
                              <div className="flex-1 h-1.5 bg-white/5 rounded-full overflow-hidden">
                                <motion.div 
                                  initial={{ width: 0 }}
                                  animate={{ width: `${metric.pct}%` }}
                                  transition={{ duration: 0.6 }}
                                  className="h-full bg-gradient-to-r from-amber-400 to-orange-500 rounded-full"
                                />
                              </div>
                              <span className="w-8 text-right font-mono font-medium text-zinc-300">{metric.pct}%</span>
                              <span className="w-8 text-right text-zinc-500 font-bold">({metric.count})</span>
                            </div>
                          ))}
                        </motion.div>
                      )}
                    </AnimatePresence>
                  </div>
                );
              })}
            </div>
          </section>

          {/* RECOMMENDED FOR YOU (Vertical Grid list displaying live sorted items) */}
          <section className="space-y-3">
            <h3 className="text-[11px] font-black uppercase text-zinc-400 tracking-wider">আপনার জন্য সাজেকশনস</h3>
            <div className="product-sink-grid">
              {getSortedProducts(mockProducts.filter((p: any) => p.portal === 'b2c' || p.portal === 'pk-shop')).slice(0, 8).map((prod: any) => (
                <div key={prod.id} onClick={() => handleSelectProduct(prod)}>
                  <ProductCard product={prod} />
                </div>
              ))}
            </div>
          </section>

        </div>
      ) : (
        /* FILTERED CATALOG SEARCH RESULTS GRID VIEW WITH SORT ENGINE */
        <div className="mt-5 space-y-4">
          <div className="flex items-center justify-between text-xs select-none">
            <span className="text-[var(--pm-text-secondary)] font-black uppercase tracking-wider">ডিল অনুসন্ধান ফলাফল ({sortedFilteredProducts.length})</span>
            <span className="text-[10px] font-bold text-zinc-500">ফিল্টারিং ক্যাটাগরি: {activeCategory.toUpperCase()}</span>
          </div>

          {sortedFilteredProducts.length === 0 ? (
            <div className="py-20 text-center rounded-3xl bg-[var(--pm-surface)]/40 border border-white/5 flex flex-col items-center">
              <Layers className="w-12 h-12 text-zinc-600 mb-3 animate-bounce" />
              <p className="text-xs font-black text-white">দুঃখিত, কোনো মিল খুঁজে পাওয়া যায়নি</p>
              <p className="text-[10px] text-[var(--pm-text-secondary)] font-bold mt-1 max-w-[200px]">অনুগ্রহ করে অন্য শব্দ নিয়ে পুনরায় খুঁজুন অথবা ক্যাটাগরি পরিবর্তন করুন।</p>
            </div>
          ) : (
            <div className="product-sink-grid">
              {sortedFilteredProducts.map(prod => (
                <div key={prod.id} onClick={() => handleSelectProduct(prod)}>
                  <ProductCard product={prod} />
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      {/* FLOATING ACTION BOTTOM CART PREVIEW FOR EXPEDITED PURCHASES AND GUEST BLOCKERS */}
      <AnimatePresence>
        {cartTotalItems > 0 && (
          <motion.div
            initial={{ opacity: 0, y: 100, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 100, scale: 0.95 }}
            className="fixed bottom-[84px] left-4 right-4 max-w-[440px] mx-auto z-[99] bg-[var(--pm-surface)]/95 backdrop-blur-md border border-[var(--pm-accent)]/40 rounded-2xl p-3 shadow-2xl flex items-center justify-between gap-3 select-none"
          >
            <div className="flex items-center gap-2">
              <div className="relative p-2.5 rounded-xl bg-[var(--pm-accent)] text-white">
                <ShoppingBag className="w-4.5 h-4.5" />
                <span className="absolute -top-1.5 -right-1.5 bg-red-600 text-white text-[9px] font-black w-4.5 h-4.5 rounded-full flex items-center justify-center">
                  {cartTotalItems}
                </span>
              </div>
              <div className="text-left">
                <p className="text-[8px] text-[var(--pm-text-secondary)] font-black uppercase">মোট কার্ট বিল</p>
                <p className="text-sm font-black text-white">৳{cartTotalValue.toLocaleString()}</p>
              </div>
            </div>

            <button 
              onClick={handleTriggerCheckout}
              className="bg-white hover:bg-neutral-100 text-black px-4 py-2.5 rounded-xl text-[10px] font-black uppercase tracking-wider flex items-center gap-1 outline-none"
            >
              চেকআউট করুন <ChevronRight className="w-3.5 h-3.5" />
            </button>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Guest Authentication Validation Modal Drawer */}
      <AnimatePresence>
        {showGuestWarn && (
          <div className="fixed inset-0 z-[9999] flex items-center justify-center p-4">
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setShowGuestWarn(false)}
              className="absolute inset-0 bg-black/75 backdrop-blur-md"
            />
            <motion.div
              initial={{ scale: 0.95, y: 20, opacity: 0 }}
              animate={{ scale: 1, y: 0, opacity: 1 }}
              exit={{ scale: 0.95, y: 20, opacity: 0 }}
              className="relative bg-[var(--pm-surface)] border border-white/[0.08] p-6 rounded-[28px] max-w-sm w-full text-center space-y-4 shadow-2xl z-10"
            >
              <div className="w-12 h-12 rounded-full bg-orange-500/10 text-orange-400 flex items-center justify-center mx-auto">
                <Award className="w-6 h-6" />
              </div>
              <div className="space-y-1.5">
                <h3 className="text-sm font-black text-white">লগইন প্রয়োজন (B2C Authentication)</h3>
                <p className="text-[10px] text-[var(--pm-text-secondary)] leading-relaxed font-semibold">সম্মানিত ভিজিটর, গেস্ট অ্যাকাউন্ট থেকে সরাসরি অর্ডার প্লেস করা সীমিত। অর্ডার সম্পন্ন করতে অনুগ্রহ করে লগইন করুন।</p>
              </div>
              <div className="flex gap-2 text-[10px] font-black select-none">
                <button 
                  onClick={() => setShowGuestWarn(false)}
                  className="flex-1 py-3.5 rounded-xl bg-white/5 border border-white/10 text-white"
                >
                  পরে করব
                </button>
                <button 
                  onClick={() => {
                    setShowGuestWarn(false);
                    navigate('/login');
                  }}
                  className="flex-1 py-3.5 rounded-xl bg-[var(--pm-accent)] text-white"
                >
                  লগইন পেইজ
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* Audio Microphone voice listening pulsing dialog overlay */}
      <AnimatePresence>
        {voiceListening && (
          <div className="fixed inset-0 z-[10000] flex items-center justify-center">
            <div className="absolute inset-0 bg-black/80 backdrop-blur-md" />
            <motion.div 
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              className="relative p-8 rounded-3xl bg-[var(--pm-surface)] border border-white/10 max-w-xs text-center space-y-5 z-20 flex flex-col items-center"
            >
              {/* Pulsing microphone animation nodes */}
              <div className="relative">
                <div className="absolute inset-0 rounded-full bg-[var(--pm-accent)]/20 animate-ping" />
                <div className="w-14 h-14 rounded-full bg-[var(--pm-accent)] text-white flex items-center justify-center relative shadow-lg">
                  <Mic className="w-6 h-6 animate-bounce" />
                </div>
              </div>
              <div className="space-y-1 select-none">
                <h4 className="text-xs font-black text-white">বলুন, আমরা শুনছি...</h4>
                <p className="text-[9px] text-[var(--pm-text-secondary)] font-bold">যেমন: "জেনুইন লেদার ওয়ালেট"</p>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

    </div>
  );
};
