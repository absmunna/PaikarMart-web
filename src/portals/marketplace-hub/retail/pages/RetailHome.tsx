import React, { useState, useEffect, useMemo } from 'react';
import { useQuery } from '@tanstack/react-query';
import { motion, AnimatePresence } from 'motion/react';
import { 
  ShoppingBag, Star, Heart, ShoppingCart, Zap, TrendingUp, Sparkles, 
  Store, Package, Tag, Layers, MapPin, Truck, ShieldCheck, Search,
  MessageSquare, ChevronRight, SlidersHorizontal, ArrowRight, X, Clock,
  ChevronLeft, Award, ThumbsUp, AlertCircle, RefreshCw
} from 'lucide-react';
import { StoryBar } from "@shared/StoryBar";
import { CategoryNavBar } from "@shared/CategoryNavBar";
import { ProductCard } from "@/features/product/components/ProductCard";
import { useCommerceCartStore } from '@modules/commerce/cart/useCartStore';
import { formatBDT } from '@lib/format';
import { Button } from '@ui/button';
import { toast } from 'sonner';
import { useNavigate } from 'react-router-dom';
import { HeroSpotlight } from "@shared/HeroSpotlight";

/* ═══════════════════════════════════════════════
   Bangladeshi Localized B2C Retail Mock Dataset
   ═══════════════════════════════════════════════ */
const LOCAL_MOCK_RETAIL_PRODUCTS = [
  {
    id: "ret-p1",
    title: "SoundTouch Wireless ANC Headset (প্রিমিয়াম নয়েজ ক্যানসেলিং হেডফোন)",
    description: "Experience premium active noise cancelling, 30-hour battery life, and Bluetooth 5.3 deep bass technology tailored specifically for busy urban commuters navigating Dhaka.",
    price: 4999,
    compareAtPrice: 6500,
    currency: "BDT",
    images: ["https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=600&q=80"],
    stock: 14,
    vendorId: "v1",
    vendorName: "Dhaka Electronics",
    categoryId: "electronics",
    categoryName: "Electronics",
    rating: 4.8,
    reviewCount: 142,
    location: "Motijheel, Dhaka",
    coinCashback: 50,
    isTrending: true,
    isVerified: true,
    brand: "SoundTouch Pro"
  },
  {
    id: "ret-p2",
    title: "Handloom Traditional Jamdani Saree (হাতে বোনা ঢাকাই তাঁতের জামদানি শাড়ি)",
    description: "Elegant, hand-crafted designer saree featuring geometric floral motifs meticulously woven by generational master weavers of Sonargaon, Bangladesh.",
    price: 12500,
    compareAtPrice: 15800,
    currency: "BDT",
    images: ["https://images.unsplash.com/photo-1610030469983-98e550d6193c?w=600&q=80"],
    stock: 4,
    vendorId: "v2",
    vendorName: "Chittagong Fashion Hub",
    categoryId: "clothing",
    categoryName: "Fashion",
    rating: 4.9,
    reviewCount: 38,
    location: "Aman Bazar, Chittagong",
    coinCashback: 150,
    isTrending: true,
    isVerified: true,
    brand: "Heritage Weavers"
  },
  {
    id: "ret-p3",
    title: "Sundarbans Wild Organic Honey (সুন্দরবনের খাঁটি বন্য খলিশা মধু)",
    description: "100% pure, raw, and unpasteurized natural honey collected ethically from wild bee hives deep inside the mangrove forest of Sundarbans.",
    price: 1200,
    compareAtPrice: 1500,
    currency: "BDT",
    images: ["https://images.unsplash.com/photo-1587049352846-4a222e784d38?w=600&q=80"],
    stock: 35,
    vendorId: "v3",
    vendorName: "Sylhet Fresh Mart",
    categoryId: "grocery",
    categoryName: "Grocery",
    rating: 4.7,
    reviewCount: 96,
    location: "Zindabazar, Sylhet",
    coinCashback: 20,
    isTrending: false,
    isVerified: true,
    brand: "Shundorbon Direct"
  },
  {
    id: "ret-p4",
    title: "Aura Smart LED AMOLED Fitness Band (স্মার্ট অ্যাক্টিভিটি ট্র্যাকার ওয়াচ)",
    description: "IP68 water resistant watch featuring real-time blood oxygen monitoring, dynamic sleep tracking cycles, and a bright always-on curved AMOLED touch screen.",
    price: 2450,
    compareAtPrice: 3200,
    currency: "BDT",
    images: ["https://images.unsplash.com/photo-1575311373937-040b8e1fd5b6?w=600&q=80"],
    stock: 8,
    vendorId: "v4",
    vendorName: "Smarttech BD",
    categoryId: "electronics",
    categoryName: "Electronics",
    rating: 4.5,
    reviewCount: 64,
    location: "GEC Circle, Chittagong",
    coinCashback: 30,
    isTrending: true,
    isVerified: false,
    brand: "Aura Tech"
  },
  {
    id: "ret-p5",
    title: "Organic Chinigura Aromatic Rice Premium Lot (চিনিগুঁড়া সুগন্ধি আতপ চাল)",
    description: "Polishing-free, organic premium aromatic long-grain rice harvested with love in the plains of Dinajpur. Perfect for fragrant biryanis and Eid polao.",
    price: 650,
    compareAtPrice: 750,
    currency: "BDT",
    images: ["https://images.unsplash.com/photo-1586201375761-83865001e31c?w=600&q=80"],
    stock: 120,
    vendorId: "v3",
    vendorName: "Sylhet Fresh Mart",
    categoryId: "grocery",
    categoryName: "Grocery",
    rating: 4.6,
    reviewCount: 110,
    location: "Zindabazar, Sylhet",
    coinCashback: 10,
    isTrending: false,
    isVerified: true,
    brand: "KhamarBD"
  },
  {
    id: "ret-p6",
    title: "Hand-Stitched Traditional Nakshi Kantha (গ্রামীণ নকশিকাঁথা হাত-সেলাই)",
    description: "Exquisite hand-embroidered traditional cotton quilt, narrating rural stories and cultural heritage with beautiful threadwork. Woven by rural women artisans of Jessore.",
    price: 5500,
    compareAtPrice: 7200,
    currency: "BDT",
    images: ["https://images.unsplash.com/photo-1583337130417-3346a1be7dee?w=600&q=80"],
    stock: 3,
    vendorId: "v2",
    vendorName: "Chittagong Fashion Hub",
    categoryId: "home-decor",
    categoryName: "Home Decor",
    rating: 5.0,
    reviewCount: 22,
    location: "Jessore Village",
    coinCashback: 80,
    isTrending: true,
    isVerified: true,
    brand: "Rural Empowerment Link"
  }
];

const HERO_SLIDES = [
  {
    id: 1,
    title: "Monsoon Gadgets Fest ⚡",
    subtitle: "Up to 40% OFF + 50 Coin Cashback",
    bg: "from-cyan-900/40 via-cyan-950/20 to-[#03060d]",
    accent: "text-cyan-400",
    border: "border-cyan-500/20",
    buttonText: "Shop Gadgets",
    desc: "Upgrade your gear with fully verified 1-year product warranty options."
  },
  {
    id: 2,
    title: "100% Organic Honey & Spice 🍯",
    subtitle: "From Sundarbans to Your Doorstep",
    bg: "from-amber-900/40 via-amber-950/20 to-[#03060d]",
    accent: "text-amber-400",
    border: "border-amber-500/20",
    buttonText: "Get Pure Honey",
    desc: "Ethically harvested chemical-free fresh grocery items directly sourced."
  },
  {
    id: 3,
    title: "Traditional Jamdani & Silk 🌾",
    subtitle: "Handloom Heritage Premium Showcase",
    bg: "from-pink-900/40 via-pink-950/20 to-[#03060d]",
    accent: "text-pink-400",
    border: "border-pink-500/20",
    buttonText: "Explore Weaves",
    desc: "Support local Bangladeshi artisan cooperatives with premium luxury wear."
  }
];

const CATEGORIES = [
  { id: "all", label: "সব পণ্য (All Items)", slug: "all" },
  { id: "electronics", label: "ইলেক্ট্রনিক্স (Electronics)", slug: "electronics" },
  { id: "clothing", label: "ফ্যাশন (Fashion)", slug: "fashion" },
  { id: "grocery", label: "গ্রোসারি (Grocery)", slug: "grocery" },
  { id: "home-decor", label: "হোম ডেকর (Home Decor)", slug: "home-decor" }
];

export const RetailHome = () => {
  const navigate = useNavigate();
  const { addItem, items: cartItems } = useCommerceCartStore();

  // Search & Filter State
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("all");
  const [sortBy, setSortBy] = useState("trending");
  const [wishlist, setWishlist] = useState<string[]>([]);
  const [selectedProduct, setSelectedProduct] = useState<any>(null);

  // Active Promo Slides
  const [activeSlide, setActiveSlide] = useState(0);

  // Countdown timer for Retail Flash Sales
  const [timeLeft, setTimeLeft] = useState({ hours: 4, minutes: 32, seconds: 18 });

  // Carousel loop
  useEffect(() => {
    const slideInterval = setInterval(() => {
      setActiveSlide((prev) => (prev + 1) % HERO_SLIDES.length);
    }, 6000);
    return () => clearInterval(slideInterval);
  }, []);

  // Tick the countdown timer down
  useEffect(() => {
    const timer = setInterval(() => {
      setTimeLeft(prev => {
        if (prev.seconds > 0) {
          return { ...prev, seconds: prev.seconds - 1 };
        } else if (prev.minutes > 0) {
          return { ...prev, minutes: prev.minutes - 1, seconds: 59 };
        } else if (prev.hours > 0) {
          return { hours: prev.hours - 1, minutes: 59, seconds: 59 };
        } else {
          return { hours: 12, minutes: 0, seconds: 0 }; // Loop back with fresh 12h
        }
      });
    }, 1000);
    return () => clearInterval(timer);
  }, []);

  // Live Products Query
  const { data: serverProducts, isLoading: isQueryLoading } = useQuery({
    queryKey: ['products', 'retail'],
    queryFn: () => fetch('/api/v1/products?type=retail').then(res => res.json())
  });

  // Normalize full B2C products (merging live server products + localized mocks gracefully)
  const normalizedProducts = useMemo(() => {
    const processedMocks = LOCAL_MOCK_RETAIL_PRODUCTS;
    const processedServer = (serverProducts || []).map((item: any) => {
      let imageSrc = "https://images.unsplash.com/photo-1542838132-92c53300491e?w=600";
      if (item.images && item.images.length > 0) {
        imageSrc = item.images[0];
      } else if (item.imageUrl) {
        imageSrc = item.imageUrl;
      } else if (item.image) {
        imageSrc = item.image;
      }

      return {
        id: item.id || `live-${Math.random()}`,
        title: item.title || item.name || "Premium Retail Product",
        description: item.description || "Premium Quality retail product from top verified merchant partner on Paikar Mart.",
        price: item.price || 850,
        compareAtPrice: item.compareAtPrice || item.originalPrice || undefined,
        currency: item.currency || "BDT",
        images: [imageSrc],
        stock: item.stock !== undefined ? item.stock : 15,
        vendorId: item.vendorId || "v1",
        vendorName: item.vendorName || (item.vendor && item.vendor.name) || "Dhaka Electronics",
        categoryId: item.categoryId === "c1" || item.categoryId === "electronics" ? "electronics" :
                    item.categoryId === "c2" || item.categoryId === "fashion" ? "clothing" :
                    item.categoryId === "c3" || item.categoryId === "grocery" ? "grocery" :
                    item.categoryId === "c4" || item.categoryId === "home" || item.categoryId === "home-decor" ? "home-decor" : "electronics",
        categoryName: item.categoryName || (item.category && item.category.name) || "Electronics",
        rating: item.rating || 4.6,
        reviewCount: item.reviewCount || 34,
        location: item.location || "Dhaka, BD",
        coinCashback: item.coinCashback || 15,
        isTrending: item.isTrending ?? true,
        isVerified: item.isVerified ?? true,
        brand: item.brand || "Premium Brand"
      };
    });

    // Remove duplicates if any matching IDs
    const serverIds = new Set(processedServer.map((p: any) => p.id));
    const uniqueMocks = processedMocks.filter(m => !serverIds.has(m.id));

    return [...processedServer, ...uniqueMocks];
  }, [serverProducts]);

  // Combined Filters and Searches
  const filteredProducts = useMemo(() => {
    return normalizedProducts.filter((product) => {
      const q = searchQuery.toLowerCase();
      const matchesSearch = (product.title || "").toLowerCase().includes(q) || 
                            (product.description || "").toLowerCase().includes(q) ||
                            (product.vendorName || "").toLowerCase().includes(q);
      
      const matchesCategory = selectedCategory === "all" || product.categoryId === selectedCategory;
      
      return matchesSearch && matchesCategory;
    }).sort((a, b) => {
      if (sortBy === "price_asc") return a.price - b.price;
      if (sortBy === "price_desc") return b.price - a.price;
      if (sortBy === "rating") return b.rating - a.rating;
      // 'trending'
      return (b.isTrending ? 1 : 0) - (a.isTrending ? 1 : 0);
    });
  }, [normalizedProducts, searchQuery, selectedCategory, sortBy]);

  // Quick operations triggers
  const handleWishlistToggle = (id: string, e: React.MouseEvent) => {
    e.stopPropagation();
    if (wishlist.includes(id)) {
      setWishlist(prev => prev.filter(item => item !== id));
      toast.success("পছন্দের তালিকা থেকে সরানো হয়েছে।");
    } else {
      setWishlist(prev => [...prev, id]);
      toast.success("পছন্দের তালিকায় যোগ করা হয়েছে!");
    }
  };

  const handleAddToCart = (product: any, e: React.MouseEvent) => {
    e.stopPropagation();
    addItem({
      id: product.id,
      sourceId: product.id,
      name: product.title,
      price: product.price,
      image: product.images[0],
      domain: 'retail',
      quantity: 1,
      metadata: {
        originalPrice: product.compareAtPrice,
        coinCashback: product.coinCashback,
        vendorId: product.vendorId,
        vendorName: product.vendorName,
        stock: product.stock
      }
    });
    toast.success(`${product.title.slice(0, 20)}... রিটেইল কার্টে যোগ করা হয়েছে!`);
  };

  const handleOpenChat = (product: any, e: React.MouseEvent) => {
    e.stopPropagation();
    toast.info(`${product.vendorName} এর সাথে চ্যাট ওপেন হচ্ছে...`);
    navigate('/messages');
  };

  return (
    <div className="w-full max-w-[480px] md:max-w-4xl lg:max-w-6xl mx-auto px-4 pb-28 text-[var(--pm-text)] flex flex-col pt-0" id="retail-portal-root">
      
      {/* 1. MANDATORY STORY BAR */}
      <section className="pt-2 -mx-4 md:mx-0">
        <StoryBar context="retail" />
      </section>

      {/* 2. MANDATORY STICKY PORTAL BAR */}
      <div className="md:sticky top-16 z-40 bg-[var(--pm-bg)]/90 backdrop-blur-lg border-b border-[var(--pm-border)]/50 -mx-4 px-4 mt-2">
        <CategoryNavBar 
          context="retail" 
          activeFilter={selectedCategory}
          onFilterChange={setSelectedCategory}
        />
      </div>

      {/* 3. HERO SPOTLIGHT CAROUSEL */}
      <div className="mt-4">
        <HeroSpotlight context="retail" />
      </div>

      {/* 4. ACTIVE FLASH OFFER & TIMER */}
      <div className="mt-4 p-4 rounded-2xl bg-white/[0.02] border border-white/[0.04] flex flex-col sm:flex-row items-center justify-between gap-4">
        <div className="flex items-center gap-3 w-full sm:w-auto">
          <div className="w-9 h-9 rounded-xl bg-amber-500/10 border border-amber-500/20 flex items-center justify-center text-amber-500">
            <Clock className="w-5 h-5 animate-spin" style={{ animationDuration: '8s' }} />
          </div>
          <div>
            <h3 className="text-xs font-black text-white uppercase tracking-wider">দ্রুত অফার জোন (Flash Deal Area)</h3>
            <p className="text-[10px] text-zinc-500 font-bold uppercase mt-0.5">Limited B2C stock lots close soon</p>
          </div>
        </div>

        {/* Dynamic Countdown Display */}
        <div className="flex items-center gap-2.5 shrink-0 bg-black/40 px-4 py-2 rounded-xl border border-white/5 font-mono">
          <span className="text-[9px] font-bold uppercase text-zinc-500 mr-1.5 tracking-tight">Ends in</span>
          <div className="flex items-center gap-1 text-xs">
            <span className="p-1 rounded bg-white/5 font-black text-white">{timeLeft.hours.toString().padStart(2, '0')}</span>
            <span className="text-zinc-600 font-bold">:</span>
            <span className="p-1 rounded bg-white/5 font-black text-pink-400">{timeLeft.minutes.toString().padStart(2, '0')}</span>
            <span className="text-zinc-600 font-bold">:</span>
            <span className="p-1 rounded bg-white/5 font-black text-pink-500">{timeLeft.seconds.toString().padStart(2, '0')}</span>
          </div>
        </div>
      </div>

      {/* 5. SEARCH & ADVANCED PORTAL FILTERS */}
      <div className="mt-5 flex flex-col gap-3">
        {/* Dynamic Search bar with Lucide Icons */}
        <div className="flex gap-2 w-full">
          <div className="flex-1 h-11 bg-[var(--pm-surface)]/50 rounded-2xl border border-white/[0.08] px-4 flex items-center gap-2.5 focus-within:border-pink-500/40 transition-all">
            <Search className="w-4 h-4 text-pink-500" />
            <input
              type="text"
              placeholder="সার্চ করুন (যেমন: জামদানি শাড়ি, সুন্দরবনের মধু...)"
              value={searchQuery}
              onChange={e => setSearchQuery(e.target.value)}
              className="flex-1 bg-transparent text-[11px] sm:text-[12px] text-white placeholder-zinc-600 outline-none font-semibold"
            />
            {searchQuery && (
              <button onClick={() => setSearchQuery("")}>
                <X className="w-3.5 h-3.5 text-zinc-500 hover:text-white" />
              </button>
            )}
          </div>
          
          <div className="relative shrink-0 select-none">
            <select
              value={sortBy}
              onChange={e => setSortBy(e.target.value)}
              className="h-11 px-3 bg-[var(--pm-surface)]/60 border border-white/[0.08] text-[9px] font-black text-zinc-400 rounded-2xl outline-none uppercase tracking-wider cursor-pointer"
            >
              <option value="trending">Sort: Popularity</option>
              <option value="price_asc">Price: Low-High</option>
              <option value="price_desc">Price: High-Low</option>
              <option value="rating">Top Ratings</option>
            </select>
          </div>
        </div>
      </div>

      {/* 6. PRODUCT COUNT SUMMARY */}
      <div className="mt-5 flex items-center justify-between text-[11px] font-bold text-zinc-500 uppercase tracking-widest px-1">
        <span>গ্রুপকৃত {filteredProducts.length} টি পণ্য পাওয়া গেছে (Items matching)</span>
        {searchQuery || selectedCategory !== "all" ? (
          <button 
            onClick={() => { setSearchQuery(""); setSelectedCategory("all"); }}
            className="text-pink-400 hover:text-pink-300 font-black cursor-pointer flex items-center gap-1 lowercase"
          >
            clear filters <X className="w-3 h-3" />
          </button>
        ) : null}
      </div>

      {/* 7. REVOLUTIONARY RESPONSIVE GRID FEED */}
      <div className="mt-3">
        <AnimatePresence mode="popLayout">
          {isQueryLoading && filteredProducts.length === 0 ? (
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3">
              {Array.from({ length: 6 }).map((_, idx) => (
                <div key={idx} className="rounded-3xl border border-white/[0.04] bg-white/[0.02] overflow-hidden animate-pulse">
                  <div className="aspect-square bg-white/5" />
                  <div className="p-3 space-y-2.5">
                    <div className="h-2 w-1/3 bg-white/5 rounded-full" />
                    <div className="h-3 w-4/5 bg-white/5 rounded-full" />
                    <div className="h-2 w-1/2 bg-white/5 rounded-full" />
                    <div className="h-8 w-full bg-white/5 rounded-xl mt-3" />
                  </div>
                </div>
              ))}
            </div>
          ) : filteredProducts.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-20 bg-white/[0.01] border border-dashed border-white/10 rounded-3xl gap-4 text-center">
              <div className="w-14 h-14 rounded-2xl bg-white/5 border border-white/10 flex items-center justify-center text-zinc-600">
                <Package className="w-6 h-6" />
              </div>
              <div>
                <p className="text-sm font-black text-white">দুঃখিত, কোনো রিটেইল পণ্য পাওয়া যায়নি</p>
                <p className="text-[10px] text-zinc-500 mt-0.5">Please adjust key phrases or select another store category</p>
              </div>
              <button
                onClick={() => { setSearchQuery(""); setSelectedCategory("all"); }}
                className="px-4 py-2 rounded-xl bg-pink-500/10 hover:bg-pink-500/20 text-[10px] font-black text-pink-400 border border-pink-500/20 active:scale-95 transition-all text-xs"
              >
                Reset Default Search
              </button>
            </div>
          ) : (
            <motion.div 
              layout
              className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3"
            >
              {filteredProducts.map((p) => (
                <ProductCard
                  key={p.id}
                  product={p as any}
                  noLink
                  onClick={() => setSelectedProduct(p)}
                  customAction={
                    <div className="flex gap-1.5 shrink-0">
                      <button
                        onClick={(e) => { e.stopPropagation(); handleOpenChat(p, e); }}
                        className="w-8 h-8 rounded-xl bg-white/[0.03] border border-white/[0.06] flex items-center justify-center text-zinc-400 hover:text-white hover:bg-white/[0.08] transition-all cursor-pointer"
                      >
                        <MessageSquare className="w-3.5 h-3.5" />
                      </button>
                      <button
                        onClick={(e) => { e.stopPropagation(); handleAddToCart(p, e); }}
                        className="w-8 h-8 rounded-xl bg-[var(--pm-accent)] hover:bg-[var(--pm-accent)]/90 text-white flex items-center justify-center transition-all shadow-[0_4px_12px_rgba(0,168,89,0.25)] cursor-pointer"
                      >
                        <ShoppingCart className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  }
                />
              ))}
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* 8. QUICK SPEC / PRODUCT INFO MODAL DRAWER */}
      <AnimatePresence>
        {selectedProduct && (
          <>
            {/* Backdrop layer */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setSelectedProduct(null)}
              className="fixed inset-0 z-[600] bg-black/75 backdrop-blur-sm flex items-center justify-center p-4"
            >
              {/* Product Card Details overlay */}
              <motion.div
                initial={{ scale: 0.95, y: 15 }}
                animate={{ scale: 1, y: 0 }}
                exit={{ scale: 0.95, y: 15 }}
                onClick={(e) => e.stopPropagation()}
                className="w-full max-w-[440px] rounded-3xl bg-zinc-950 border border-white/10 overflow-hidden text-left relative text-white max-h-[85vh] flex flex-col justify-between"
              >
                
                {/* Header visual close */}
                <button
                  onClick={() => setSelectedProduct(null)}
                  className="absolute top-4 right-4 z-10 w-8 h-8 rounded-full bg-black/60 border border-white/15 flex items-center justify-center text-zinc-400 hover:text-white transition-all cursor-pointer"
                >
                  <X className="w-4 h-4" />
                </button>

                {/* Detail Content */}
                <div className="overflow-y-auto p-5 space-y-4 no-scrollbar">
                  
                  {/* Photo & overlays */}
                  <div className="aspect-[16/10] relative rounded-2xl overflow-hidden border border-white/5 bg-zinc-900 leading-none">
                    <img src={selectedProduct.images[0]} alt={selectedProduct.title} className="w-full h-full object-cover" />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent" />
                    
                    <div className="absolute bottom-3 left-3 flex flex-wrap gap-1.5 items-center">
                      <span className="px-2 py-0.5 rounded-md bg-pink-500 text-[8px] font-black text-white uppercase tracking-widest leading-none">
                        B2C Retail Unit
                      </span>
                      <span className="px-1.5 py-0.5 rounded-md bg-black/40 text-[8px] font-bold text-zinc-300 uppercase leading-none">
                        Brand: {selectedProduct.brand}
                      </span>
                    </div>
                  </div>

                  {/* Title & Brand */}
                  <div>
                    <span className="text-[10px] text-pink-400 font-black uppercase tracking-wider">{selectedProduct.categoryName} Corner</span>
                    <h2 className="text-base sm:text-lg font-black text-white uppercase tracking-tight mt-1 leading-snug">
                      {selectedProduct.title}
                    </h2>
                  </div>

                  {/* Vendor Spec info */}
                  <div className="p-3 bg-white/[0.02] border border-white/5 rounded-xl flex items-center justify-between">
                    <div className="flex items-center gap-2.5">
                      <div className="w-9 h-9 rounded-xl bg-pink-500/10 border border-pink-500/20 flex items-center justify-center text-pink-500 shrink-0">
                        <Store className="w-4.5 h-4.5" />
                      </div>
                      <div>
                        <div className="flex items-center gap-1">
                          <h4 className="text-[11px] font-black text-white uppercase leading-none">{selectedProduct.vendorName}</h4>
                          <ShieldCheck className="w-3 h-3 text-cyan-400 shrink-0" />
                        </div>
                        <p className="text-[9px] text-zinc-500 font-bold uppercase mt-1 flex items-center gap-1.5">
                          <MapPin className="w-3 h-3" /> {selectedProduct.location}
                        </p>
                      </div>
                    </div>

                    <button 
                      onClick={(e) => { handleOpenChat(selectedProduct, e); setSelectedProduct(null); }}
                      className="px-3 py-1.5 rounded-lg bg-pink-500/10 hover:bg-pink-500/20 border border-pink-500/20 text-[9px] font-black text-pink-400 uppercase tracking-wider transition-all"
                    >
                      Chat
                    </button>
                  </div>

                  {/* Star rating breakdown distributions */}
                  <div className="space-y-2">
                    <h4 className="text-[9px] font-black uppercase text-zinc-400 tracking-wider">পরিষেবা ও রেটিং ব্রেকডাউন (Customer feedback ratios)</h4>
                    
                    <div className="grid grid-cols-3 items-center gap-3 bg-white/[0.01] border border-white/[0.03] p-3 rounded-xl">
                      <div className="text-center border-r border-white/5 pr-1">
                        <span className="text-xl sm:text-2xl font-black text-white">{selectedProduct.rating}</span>
                        <div className="flex items-center justify-center gap-1 mt-1 text-amber-400">
                          <Star className="w-3 h-3 fill-amber-400" />
                        </div>
                        <p className="text-[7.5px] text-zinc-500 uppercase font-bold mt-1.5">Rating ratio</p>
                      </div>
                      
                      <div className="col-span-2 space-y-1">
                        {[
                          { star: 5, pct: "84%" },
                          { star: 4, pct: "12%" },
                          { star: 3, pct: "4%" }
                        ].map((m) => (
                          <div key={m.star} className="flex items-center gap-2 text-[8px] font-bold text-zinc-400 uppercase">
                            <span className="w-3">{m.star}★</span>
                            <div className="flex-1 h-1.5 rounded-full bg-white/5 overflow-hidden">
                              <div className="bg-pink-500 h-full rounded-full" style={{ width: m.pct }} />
                            </div>
                            <span className="w-6 text-right font-mono font-bold">{m.pct}</span>
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>

                  {/* Core description block */}
                  <div className="space-y-1.5">
                    <h4 className="text-[9px] font-black uppercase text-zinc-400 tracking-wider">পণ্য বিস্তারিত (Product Overview)</h4>
                    <p className="text-[11px] text-zinc-400 leading-relaxed font-medium">
                      {selectedProduct.description}
                    </p>
                  </div>

                  {/* Policy and Logistics assurances */}
                  <div className="grid grid-cols-2 gap-2 mt-4 text-[9px] font-black uppercase">
                    <div className="p-2.5 rounded-xl bg-white/[0.02] border border-white/5 flex items-center gap-2 text-zinc-300">
                      <Truck className="w-3.5 h-3.5 text-pink-500 shrink-0" />
                      <span>সারা বাংলাদেশে ৮-১২ দিন ডেলিভারি</span>
                    </div>
                    <div className="p-2.5 rounded-xl bg-white/[0.02] border border-white/5 flex items-center gap-2 text-zinc-300">
                      <Award className="w-3.5 h-3.5 text-pink-500 shrink-0" />
                      <span>গ্যারান্টেড খাঁটি ও অথেনটিক পণ্য</span>
                    </div>
                  </div>

                  {/* Live stock block checker */}
                  <div className="flex items-center justify-between text-[10px] font-bold mt-4 pt-1 border-t border-white/5">
                    <span className="text-zinc-500 uppercase">স্টক স্ট্যাটাস (Inventory):</span>
                    {selectedProduct.stock > 5 ? (
                      <span className="text-cyan-400 flex items-center gap-1 font-black uppercase">
                        ✓ {selectedProduct.stock} Pcs available in warehouse
                      </span>
                    ) : (
                      <span className="text-amber-400 font-extrabold flex items-center gap-1 uppercase">
                        <AlertCircle className="w-3 h-3" /> Limited lot: only {selectedProduct.stock} left in stock
                      </span>
                    )}
                  </div>

                </div>

                {/* Footer Drawer pricing and Actions */}
                <div className="p-5 border-t border-white/10 bg-black/60 flex items-center justify-between gap-4 select-none shrink-0 rounded-b-3xl">
                  <div className="flex flex-col">
                    <span className="text-[8px] text-zinc-500 font-black uppercase">Cash price settling</span>
                    <span className="text-xl sm:text-2xl font-black text-[#22d3ee] font-mono leading-tight">{formatBDT(selectedProduct.price)}</span>
                    {selectedProduct.compareAtPrice && (
                      <span className="text-[10px] text-zinc-600 line-through leading-tight font-bold mt-0.5">{formatBDT(selectedProduct.compareAtPrice)}</span>
                    )}
                  </div>

                  <div className="flex gap-2 shrink-0">
                    <Button
                      variant="outline"
                      onClick={(e) => { handleWishlistToggle(selectedProduct.id, e); }}
                      className={`h-11 px-3.5 rounded-xl border border-white/10 bg-white/[0.02] text-white hover:bg-white/5 cursor-pointer ${
                        wishlist.includes(selectedProduct.id) ? "border-rose-500 bg-rose-500/10 text-rose-400 hover:bg-rose-500/15" : ""
                      }`}
                    >
                      <Heart className="w-4 h-4 fill-current" />
                    </Button>
                    <Button
                      onClick={(e) => { handleAddToCart(selectedProduct, e); setSelectedProduct(null); }}
                      className="h-11 px-5 rounded-xl bg-pink-500 hover:bg-pink-600 text-white text-xs font-black uppercase tracking-wider flex items-center gap-1.5 transition-all shadow-md shadow-pink-500/15 cursor-pointer active:scale-95"
                    >
                      <span>আর্ডার করুন (Secure Lot)</span>
                      <ShoppingCart className="w-4 h-4" />
                    </Button>
                  </div>

                </div>

              </motion.div>
            </motion.div>
          </>
        )}
      </AnimatePresence>

    </div>
  );
};

