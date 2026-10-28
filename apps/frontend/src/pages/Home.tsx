import React, { useState, useMemo, useEffect } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { useNavigate, Link } from "react-router-dom";
import { toast } from "sonner";
import { 
  Sparkles, Package, Store, Shirt, Smartphone, Apple, 
  Pill, Zap, Search, ArrowDownUp, 
  X, Flame, RefreshCw, ChevronDown, Check,
  Building2, MapPin, Newspaper, Wrench, Monitor, Wallet, 
  Car, ShieldCheck, Truck, Headphones, ChevronRight, Star,
  Award, ArrowRight, PlayCircle, ShoppingCart
} from "lucide-react";
import { UnifiedPostCard } from "@/design-system/components/feed/UnifiedPostCard";
import { ProductCardSkeleton } from "@/design-system/components/ui/ProductCard";
import { useCartStore } from "@/modules/cart";
import { ECOMMERCE_PRODUCTS, EcommerceProduct } from "@/modules/product";
import { PageSkeleton } from "@/app/AppShell/GlobalSkeletonSystem";
import { useLocationStore } from "@/modules/location";
import { useCategoryStore } from "@/store/categoryStore";
import { useDomainViewMode } from "@/core/hooks/useDomainViewMode";
import { useNavSettingsStore } from "@/app/AppShell/useNavSettingsStore";

const MOBILE_SUPER_HUBS = [
  { id: 'video', name: 'ভিডিও কমার্স', path: '/video', icon: PlayCircle, gradient: 'from-rose-500 to-red-600' },
  { id: 'wholesale', name: 'পাইকারি আড়ত', path: '/wholesale', icon: Building2, gradient: 'from-blue-600 to-indigo-700' },
  { id: 'retail', name: 'খুচরা মার্কেট', path: '/shop', icon: Store, gradient: 'from-orange-500 to-amber-600' },
  { id: 'nearby', name: 'লোকাল শপ', path: '/nearby', icon: MapPin, gradient: 'from-emerald-500 to-teal-700' },
  { id: 'services', name: 'সার্ভিস হাব', path: '/services', icon: Wrench, gradient: 'from-purple-500 to-pink-600' },
  { id: 'digital', name: 'ডিজিটাল গুডস', path: '/digital', icon: Monitor, gradient: 'from-cyan-500 to-blue-600' },
  { id: 'pk-shop', name: 'পিকে স্টোর', path: '/pk-shop', icon: Star, gradient: 'from-yellow-500 to-amber-600' },
  { id: 'feed', name: 'সোশ্যাল ফিড', path: '/feed', icon: Newspaper, gradient: 'from-rose-500 to-pink-600' },
  { id: 'demand', name: 'ডিমান্ড বোর্ড', path: '/demand', icon: Flame, gradient: 'from-red-500 to-orange-600' },
  { id: 'wallet', name: 'সুপার ওয়ালেট', path: '/wallet', icon: Wallet, gradient: 'from-violet-500 to-purple-700' },
  { id: 'orders', name: 'অর্ডার ট্র্যাকিং', path: '/orders', icon: Package, gradient: 'from-emerald-600 to-teal-800' },
];

const COMMERCE_CATEGORIES = [
  { id: 'all', name: 'সকল পণ্য' },
  { id: 'wholesale', name: 'পাইকারি আড়ত' },
  { id: 'retail', name: 'খুচরা মার্কেট' },
  { id: 'fashion', name: 'ফ্যাশন' },
  { id: 'electronics', name: 'ইলেকট্রনিক্স' },
  { id: 'grocery', name: 'গ্রোসারি' },
  { id: 'pharmacy', name: 'ফার্মেসি' },
  { id: 'dropship', name: 'ড্রপশিপ' },
];

export default function Home() {
  const navigate = useNavigate();
  const { addItem } = useCartStore();
  const { city: userLocation } = useLocationStore();
  const { activeMainCategory, activeSubCategory, setMainCategory, setSubCategory } = useCategoryStore();
  const { isDesktopView, toggleViewMode } = useDomainViewMode();
  const { isNavVisible, navBehavior } = useNavSettingsStore();
  const showNav = navBehavior === 'fixed' || isNavVisible;

  // State Management
  const [isLoading, setIsLoading] = React.useState(true);
  const [selectedCategory, setSelectedCategory] = useState<string>("all");
  const [searchQuery, setSearchQuery] = useState<string>("");
  const [onlyDiscounted, setOnlyDiscounted] = useState<boolean>(false);
  const [onlyWholesale, setOnlyWholesale] = useState<boolean>(false);
  const [sortBy, setSortBy] = useState<string>("popular");
  const [productsList, setProductsList] = useState<EcommerceProduct[]>(ECOMMERCE_PRODUCTS);

  const effectiveCategory = activeMainCategory !== "all" ? activeMainCategory : selectedCategory;

  // Fetch products from backend API with fallback to static ECOMMERCE_PRODUCTS
  useEffect(() => {
    let isMounted = true;
    async function fetchProducts() {
      try {
        const res = await fetch('/api/v1/products');
        if (res.ok) {
          const data = await res.json();
          if (isMounted && Array.isArray(data) && data.length > 0) {
            const mapped: EcommerceProduct[] = data.map((p: any) => ({
              id: p.id,
              name: p.name,
              title: p.name,
              category: p.category === 'wholesale' ? 'wholesale' : 'retail',
              price: Number(p.price),
              originalPrice: p.originalPrice ? Number(p.originalPrice) : undefined,
              discount: p.originalPrice ? Math.round(((p.originalPrice - p.price) / p.originalPrice) * 100) : 0,
              image: p.images?.[0] || 'https://images.unsplash.com/photo-1521572267360-ee0c2909d518?w=800&q=80',
              description: p.description,
              sellerName: p.sellerName || 'PaikarMart Verified Merchant',
              sellerLocation: p.sellerLocation || 'Dhaka, Bangladesh',
              isVerified: true,
              rating: 4.8,
              reviewCount: 120,
              stock: p.stock || 50,
              moq: p.category === 'wholesale' ? 20 : 1
            }));
            setProductsList(mapped);
          }
        }
      } catch (err) {
        console.warn('Backend products unreachable, using resilient offline catalog.');
      } finally {
        if (isMounted) setIsLoading(false);
      }
    }
    fetchProducts();
    return () => { isMounted = false; };
  }, []);

  const handleAddToCart = (product: EcommerceProduct, e?: React.MouseEvent) => {
    if (e?.stopPropagation) e.stopPropagation();
    addItem({
      id: product.id,
      name: product.name,
      price: product.price,
      originalPrice: product.originalPrice,
      image: product.image,
      quantity: 1,
      moq: product.moq || 1,
      vendorName: product.sellerName,
      portal: product.category === 'wholesale' ? 'b2b' : 'b2c',
      stock: product.stock,
    });
    toast.success(`${product.name.slice(0, 32)}... কার্টে যোগ হয়েছে!`);
  };

  // Filtered and Sorted Products
  const filteredProducts = useMemo(() => {
    return productsList.filter((product) => {
      // Category Filter
      if (effectiveCategory !== "all") {
        if (effectiveCategory === "wholesale" && product.category !== "wholesale") return false;
        if (effectiveCategory !== "wholesale") {
          const matchCat = product.category === effectiveCategory || product.name.toLowerCase().includes(effectiveCategory.toLowerCase());
          if (!matchCat) return false;
        }
      }

      // Subcategory Filter
      if (activeSubCategory && activeSubCategory !== "all") {
        const matchSub = product.name.toLowerCase().includes(activeSubCategory.toLowerCase()) || 
                         (product.description && product.description.toLowerCase().includes(activeSubCategory.toLowerCase()));
        if (!matchSub) return false;
      }

      // Search Filter
      if (searchQuery.trim()) {
        const query = searchQuery.toLowerCase();
        const matchesName = product.name.toLowerCase().includes(query);
        const matchesSeller = product.sellerName.toLowerCase().includes(query);
        const matchesLoc = product.sellerLocation.toLowerCase().includes(query);
        if (!matchesName && !matchesSeller && !matchesLoc) return false;
      }

      // Checkbox Filters
      if (onlyDiscounted && (!product.discount || product.discount <= 0)) return false;
      if (onlyWholesale && product.category !== 'wholesale') return false;

      return true;
    }).sort((a, b) => {
      if (sortBy === "price_asc") return a.price - b.price;
      if (sortBy === "price_desc") return b.price - a.price;
      if (sortBy === "discount") return (b.discount || 0) - (a.discount || 0);
      if (sortBy === "rating") return (b.rating || 0) - (a.rating || 0);
      return (b.reviewCount || 0) - (a.reviewCount || 0); // popular default
    });
  }, [productsList, effectiveCategory, activeSubCategory, searchQuery, onlyDiscounted, onlyWholesale, sortBy]);

  const hasActiveFilters = searchQuery !== "" || onlyDiscounted || onlyWholesale || sortBy !== "popular" || effectiveCategory !== "all";

  const resetFilters = () => {
    setSelectedCategory("all");
    setMainCategory("all");
    setSubCategory(null);
    setSearchQuery("");
    setOnlyDiscounted(false);
    setOnlyWholesale(false);
    setSortBy("popular");
  };

  if (isLoading) return <PageSkeleton />;

  return (
    <div className="w-full pb-24 space-y-6 bg-[var(--pm-bg)] min-h-screen text-[var(--pm-text)] select-none">
      
      {/* ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
          MODE 1: MOBILE APP SCREEN VIEW (paikarmart.com)
      ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━ */}
      {!isDesktopView ? (
        <div className="w-full space-y-4 px-1">
          {/* 1. Super App 10-Portal Grid (Native Mobile App Experience) */}
          <div className="bg-[var(--pm-surface)] border border-[var(--pm-border)] rounded-3xl p-3.5 shadow-sm">
            <div className="flex items-center justify-between mb-3 px-1">
              <span className="text-[11px] font-black text-white uppercase tracking-wider flex items-center gap-1.5">
                <Sparkles className="w-3.5 h-3.5 text-[var(--pm-accent)]" />
                সুপার অ্যাপ পোর্টাল হাব
              </span>
              <Link to="/portals" className="text-[10px] font-bold text-[var(--pm-accent)] hover:underline">
                সব দেখুন →
              </Link>
            </div>

            <div className="grid grid-cols-5 gap-2.5">
              {MOBILE_SUPER_HUBS.map((hub) => {
                const Icon = hub.icon;
                return (
                  <Link
                    key={hub.id}
                    to={hub.path}
                    className="flex flex-col items-center gap-1 group active:scale-95 transition-transform"
                  >
                    <div className={`w-12 h-12 rounded-2xl bg-gradient-to-br ${hub.gradient} flex items-center justify-center text-white shadow-md shadow-black/20 group-hover:scale-105 transition-all border border-white/10`}>
                      <Icon className="w-6 h-6 stroke-[2.2px]" />
                    </div>
                    <span className="text-[9px] font-bold text-center text-zinc-300 leading-tight line-clamp-1 group-hover:text-[var(--pm-accent)]">
                      {hub.name}
                    </span>
                  </Link>
                );
              })}
            </div>
          </div>

          {/* 3. Flash Deal / Live Demand Ticker */}
          <div 
            onClick={() => navigate('/demand')}
            className="p-3 rounded-2xl bg-gradient-to-r from-orange-500/15 via-red-500/10 to-orange-500/5 border border-orange-500/30 flex items-center justify-between cursor-pointer group"
          >
            <div className="flex items-center gap-2.5">
              <div className="w-8 h-8 rounded-xl bg-orange-500/20 text-orange-400 flex items-center justify-center shrink-0">
                <Flame className="w-4 h-4 animate-bounce" />
              </div>
              <div>
                <p className="text-xs font-black text-white group-hover:text-orange-400 transition-colors">
                  জরুরি পাইকারি ডিমান্ড বোর্ড
                </p>
                <p className="text-[10px] text-zinc-400">
                  চকবাজার ও মিরপুরে ৩টি জরুরি লট রিকোয়েস্ট সক্রিয়
                </p>
              </div>
            </div>
            <ChevronRight className="w-4 h-4 text-orange-400 group-hover:translate-x-1 transition-transform" />
          </div>

          {/* Commerce Hub Category Chips */}
          <div className={`sticky z-40 transition-all duration-300 bg-[var(--pm-bg)]/95 backdrop-blur-xl py-2 px-1 -mx-1 border-b border-[var(--pm-border)]/50 shadow-sm ${
            showNav ? 'top-[60px] md:top-[64px]' : 'top-0'
          }`}>
            <div className="overflow-x-auto no-scrollbar py-1 flex items-center gap-1.5 px-1">
              {COMMERCE_CATEGORIES.map((cat) => {
                const isActive = effectiveCategory === cat.id;
                return (
                  <button
                    key={cat.id}
                    onClick={() => {
                      setSelectedCategory(cat.id);
                      setMainCategory(cat.id);
                    }}
                    className={`px-3 py-1.5 rounded-xl text-[11px] font-bold shrink-0 transition-all cursor-pointer ${
                      isActive
                        ? 'bg-[var(--pm-accent)] text-white shadow-sm shadow-[var(--pm-accent)]/30'
                        : 'bg-[var(--pm-surface)] text-zinc-300 border border-[var(--pm-border)] hover:text-white'
                    }`}
                  >
                    {cat.name}
                  </button>
                );
              })}
            </div>
          </div>

          {/* 4. Mobile 2-Column Product Grid */}
          <div className="space-y-3 pt-2">
            <div className="flex items-center justify-between px-1">
              <h2 className="text-sm font-black text-white flex items-center gap-2">
                <span>আজকের সেরা কালেকশন</span>
                <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
              </h2>
              <span className="text-[10px] text-zinc-400 font-bold">
                {filteredProducts.length}টি পণ্য
              </span>
            </div>

            <div className="grid grid-cols-2 gap-2.5">
              {filteredProducts.map((product) => (
                <EcommerceProductCard 
                  key={product.id} 
                  product={product} 
                  onAddToCart={handleAddToCart} 
                />
              ))}
            </div>
          </div>
        </div>
      ) : (
        /* ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
            MODE 2: DESKTOP WEB PORTAL (www.paikarmart.com)
        ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━ */
        <div className="max-w-7xl mx-auto px-4 sm:px-6 space-y-8">
          
          {/* 1. Desktop Hero Banner & Promo Cards Slider */}
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-5 pt-2">
            {/* Main Wide Banner (8 cols) */}
            <div className="lg:col-span-8 rounded-3xl bg-gradient-to-br from-zinc-900 via-indigo-950/40 to-black border border-white/10 p-7 sm:p-10 relative overflow-hidden flex flex-col justify-between shadow-2xl min-h-[300px]">
              <div className="relative z-10 max-w-lg space-y-3">
                <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-[var(--pm-accent)]/20 border border-[var(--pm-accent)]/40 text-[var(--pm-accent)] text-xs font-black tracking-wide">
                  <Award className="w-3.5 h-3.5" />
                  বাংলাদেশের ১নং হোলসেল ও রিটেল নেটওয়ার্ক
                </span>
                <h1 className="text-2xl sm:text-4xl font-black text-white tracking-tight leading-tight">
                  সরাসরি মিল-ফ্যাক্টরি থেকে পাইকারি কিনুন
                </h1>
                <p className="text-xs sm:text-sm text-zinc-300 leading-relaxed">
                  চকবাজার, ইসলামপুর, নয়াবাজার ও বাবু বাজারের হাজারো ভেরিফায়েড পাইকারি আড়তদারের সাথে যুক্ত হোন।
                </p>
              </div>

              <div className="relative z-10 pt-6 flex flex-wrap gap-3">
                <Link
                  to="/wholesale"
                  className="px-5 py-3 rounded-2xl bg-[var(--pm-accent)] hover:bg-[var(--pm-accent-hover)] text-white text-xs font-black shadow-lg shadow-[var(--pm-accent)]/25 flex items-center gap-2 active:scale-95 transition-all"
                >
                  <span>পাইকারি আড়ত দেখুন</span>
                  <ArrowRight className="w-4 h-4" />
                </Link>
                <Link
                  to="/demand"
                  className="px-5 py-3 rounded-2xl bg-white/10 hover:bg-white/15 text-white border border-white/15 text-xs font-bold flex items-center gap-2 transition-all"
                >
                  <span>+ বাল্ক ডিমান্ড দিন</span>
                </Link>
              </div>

              {/* Decorative Background Element */}
              <div className="absolute right-0 bottom-0 top-0 w-1/2 opacity-20 pointer-events-none bg-radial from-[var(--pm-accent)] to-transparent" />
            </div>

            {/* Side Dual Promo Cards (4 cols) */}
            <div className="lg:col-span-4 flex flex-col sm:flex-row lg:flex-col gap-4">
              <div className="flex-1 p-5 rounded-3xl bg-[var(--pm-surface)] border border-[var(--pm-border)] flex flex-col justify-between group hover:border-[var(--pm-accent)]/40 transition-all">
                <div className="flex items-center justify-between">
                  <span className="text-[10px] font-black uppercase text-amber-400 bg-amber-400/10 px-2.5 py-1 rounded-lg">
                    ফ্ল্যাশ ডিসকাউন্ট
                  </span>
                  <Flame className="w-4 h-4 text-orange-500" />
                </div>
                <div className="my-2">
                  <h3 className="font-black text-sm text-white">পোশাক ও ফেব্রিক্সে ২৫% ছাড়</h3>
                  <p className="text-[11px] text-zinc-400 mt-1">ইসলামপুরের রফতানিমুখী প্রিমিয়াম টেক্সটাইল লট</p>
                </div>
                <Link to="/wholesale" className="text-xs font-bold text-[var(--pm-accent)] hover:underline flex items-center gap-1">
                  অর্ডার করুন <ChevronRight className="w-3.5 h-3.5" />
                </Link>
              </div>

              <div className="flex-1 p-5 rounded-3xl bg-[var(--pm-surface)] border border-[var(--pm-border)] flex flex-col justify-between group hover:border-[var(--pm-accent)]/40 transition-all">
                <div className="flex items-center justify-between">
                  <span className="text-[10px] font-black uppercase text-emerald-400 bg-emerald-400/10 px-2.5 py-1 rounded-lg">
                    ১০০% এসক্রো
                  </span>
                  <ShieldCheck className="w-4 h-4 text-emerald-400" />
                </div>
                <div className="my-2">
                  <h3 className="font-black text-sm text-white">নিরাপদ পেমেন্ট গ্যারান্টি</h3>
                  <p className="text-[11px] text-zinc-400 mt-1">পণ্য হাতে পেয়ে সন্তুষ্ট না হওয়া পর্যন্ত টাকা সুরক্ষিত</p>
                </div>
                <Link to="/escrow" className="text-xs font-bold text-emerald-400 hover:underline flex items-center gap-1">
                  পলিসি জানুন <ChevronRight className="w-3.5 h-3.5" />
                </Link>
              </div>
            </div>
          </div>

          {/* 2. Desktop Value Highlights Strip */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 py-4 px-6 rounded-3xl bg-[var(--pm-surface)] border border-[var(--pm-border)]">
            <div className="flex items-center gap-3">
              <Truck className="w-6 h-6 text-[var(--pm-accent)] shrink-0" />
              <div>
                <p className="text-xs font-black text-white">সারাদেশে ডেলিভারি</p>
                <p className="text-[10px] text-zinc-400">৬৪ জেলায় দ্রুততম কুরিয়ার</p>
              </div>
            </div>
            <div className="flex items-center gap-3">
              <ShieldCheck className="w-6 h-6 text-emerald-400 shrink-0" />
              <div>
                <p className="text-xs font-black text-white">এসক্রো সুরক্ষা</p>
                <p className="text-[10px] text-zinc-400">১০০% ক্যাশ গ্যারান্টি</p>
              </div>
            </div>
            <div className="flex items-center gap-3">
              <Building2 className="w-6 h-6 text-indigo-400 shrink-0" />
              <div>
                <p className="text-xs font-black text-white">সরাসরি আড়ত রেট</p>
                <p className="text-[10px] text-zinc-400">কোনো মধ্যস্বত্বভোগী নেই</p>
              </div>
            </div>
            <div className="flex items-center gap-3">
              <Headphones className="w-6 h-6 text-amber-400 shrink-0" />
              <div>
                <p className="text-xs font-black text-white">২৪/৭ হেল্পলাইন</p>
                <p className="text-[10px] text-zinc-400">০৯৬-৩৮০২২২২ (হটলাইন)</p>
              </div>
            </div>
          </div>

          {/* 3. Search & Filter Bar */}
          <div className="bg-[var(--pm-surface)] p-4 rounded-3xl border border-[var(--pm-border)] shadow-sm space-y-3">
            <div className="flex flex-col md:flex-row items-stretch md:items-center justify-between gap-3">
              <div className="relative flex-1">
                <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-zinc-400 pointer-events-none" />
                <input
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder="পণ্য, সেলার বা এরিয়ার নাম দিয়ে লাইভ সার্চ করুন..."
                  className="w-full bg-black/30 border border-white/10 rounded-2xl pl-10 pr-9 py-2.5 text-xs text-white placeholder-zinc-500 focus:outline-none focus:border-[var(--pm-accent)] focus:ring-2 focus:ring-[var(--pm-accent)]/20 transition-all"
                />
                {searchQuery && (
                  <button
                    onClick={() => setSearchQuery("")}
                    className="absolute right-3 top-1/2 -translate-y-1/2 p-1 text-zinc-400 hover:text-white rounded-lg"
                  >
                    <X className="w-3.5 h-3.5" />
                  </button>
                )}
              </div>

              <div className="flex items-center gap-2">
                <button
                  onClick={() => setOnlyDiscounted(!onlyDiscounted)}
                  className={`px-3 py-2 rounded-xl text-xs font-bold border transition-all cursor-pointer flex items-center gap-1.5 ${
                    onlyDiscounted
                      ? "bg-[var(--pm-accent)] text-white border-[var(--pm-accent)] shadow-xs"
                      : "bg-black/30 text-zinc-400 border-white/10 hover:text-white"
                  }`}
                >
                  <Flame className="w-3.5 h-3.5 text-orange-400" />
                  <span>ছাড়ের অফার</span>
                </button>

                <button
                  onClick={() => setOnlyWholesale(!onlyWholesale)}
                  className={`px-3 py-2 rounded-xl text-xs font-bold border transition-all cursor-pointer flex items-center gap-1.5 ${
                    onlyWholesale
                      ? "bg-[var(--pm-accent)] text-white border-[var(--pm-accent)] shadow-xs"
                      : "bg-black/30 text-zinc-400 border-white/10 hover:text-white"
                  }`}
                >
                  <Store className="w-3.5 h-3.5 text-blue-400" />
                  <span>হোলসেল (MOQ)</span>
                </button>

                <div className="relative flex items-center gap-1.5 bg-black/30 border border-white/10 rounded-xl px-3 py-2">
                  <ArrowDownUp className="w-3.5 h-3.5 text-[var(--pm-accent)] shrink-0" />
                  <select
                    value={sortBy}
                    onChange={(e) => setSortBy(e.target.value)}
                    className="bg-transparent text-xs font-bold text-white focus:outline-none cursor-pointer pr-4 appearance-none"
                  >
                    <option value="popular" className="bg-[#12141f] text-white">জনপ্রিয় পণ্য</option>
                    <option value="price_asc" className="bg-[#12141f] text-white">দাম: কম থেকে বেশি</option>
                    <option value="price_desc" className="bg-[#12141f] text-white">দাম: বেশি থেকে কম</option>
                    <option value="rating" className="bg-[#12141f] text-white">সর্বোচ্চ রেটিং</option>
                  </select>
                  <ChevronDown className="w-3.5 h-3.5 text-zinc-400 absolute right-2 pointer-events-none" />
                </div>
              </div>
            </div>
          </div>

          {/* Desktop Commerce Category Chips */}
          <div className={`sticky z-40 transition-all duration-300 bg-[var(--pm-bg)]/95 backdrop-blur-xl py-3 px-4 rounded-2xl border border-[var(--pm-border)]/50 shadow-sm flex items-center gap-2 overflow-x-auto no-scrollbar ${
            showNav ? 'top-[60px] md:top-[64px]' : 'top-0'
          }`}>
            {COMMERCE_CATEGORIES.map((cat) => {
              const isActive = effectiveCategory === cat.id;
              return (
                <button
                  key={cat.id}
                  onClick={() => {
                    setSelectedCategory(cat.id);
                    setMainCategory(cat.id);
                  }}
                  className={`px-4 py-2 rounded-2xl text-xs font-bold transition-all cursor-pointer shrink-0 ${
                    isActive
                      ? 'bg-[var(--pm-accent)] text-white shadow-md shadow-[var(--pm-accent)]/30'
                      : 'bg-[var(--pm-surface)] text-zinc-300 border border-[var(--pm-border)] hover:text-white'
                  }`}
                >
                  {cat.name}
                </button>
              );
            })}
          </div>

          {/* 4. Desktop Wide 4-Column Product Grid */}
          <div className="space-y-4">
            <div className="flex items-center justify-between pb-2 border-b border-[var(--pm-border)]">
              <div>
                <h2 className="text-xl font-black text-white flex items-center gap-2.5">
                  <span>ই-কমার্স প্রোডাক্ট ডিসকভারি</span>
                  <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
                </h2>
                <p className="text-xs text-[var(--pm-text-muted)] mt-0.5">
                  সরাসরি ফ্যাক্টরি, আড়ৎ ও ভেরিফায়েড সেলারদের পণ্য তালিকা
                </p>
              </div>
              <span className="text-xs font-bold text-zinc-400">
                মোট <strong className="text-white font-black">{filteredProducts.length}</strong>টি পণ্য প্রদর্শিত
              </span>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
              {filteredProducts.map((product) => (
                <EcommerceProductCard 
                  key={product.id} 
                  product={product} 
                  onAddToCart={handleAddToCart} 
                />
              ))}
            </div>
          </div>

          {/* 5. Desktop Multi-Column Footer */}
          <footer className="pt-12 pb-6 border-t border-[var(--pm-border)] text-xs text-zinc-400 space-y-8">
            <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
              <div className="space-y-3">
                <span className="font-black text-lg text-white">
                  <span className="text-[var(--pm-accent)]">Paikar</span>Mart
                </span>
                <p className="text-[11px] leading-relaxed">
                  বাংলাদেশের প্রথম সোশ্যাল কমার্স ও হোলসেল সুপার অ্যাপ। পাইকারি আড়তদার থেকে খুচরা ক্রেতা—সকলের বিশ্বস্ত ডিজিটাল বাজার।
                </p>
              </div>

              <div>
                <h4 className="font-black text-white text-xs mb-3">ইকোসিস্টেম পোর্টাল</h4>
                <ul className="space-y-2 text-[11px]">
                  <li><Link to="/wholesale" className="hover:text-white transition-colors">পাইকারি আড়ত (B2B)</Link></li>
                  <li><Link to="/shop" className="hover:text-white transition-colors">খুচরা মার্কেট (B2C)</Link></li>
                  <li><Link to="/nearby" className="hover:text-white transition-colors">লোকাল শপ (Hyperlocal)</Link></li>
                  <li><Link to="/demand" className="hover:text-white transition-colors">বায়ার ডিমান্ড বোর্ড</Link></li>
                </ul>
              </div>

              <div>
                <h4 className="font-black text-white text-xs mb-3">গ্রাহক সেবা ও নীতি</h4>
                <ul className="space-y-2 text-[11px]">
                  <li><Link to="/terms" className="hover:text-white transition-colors">ব্যবহারের শর্তাবলী</Link></li>
                  <li><Link to="/privacy" className="hover:text-white transition-colors">গোপনীয়তা নীতি</Link></li>
                  <li><Link to="/escrow" className="hover:text-white transition-colors">এসক্রো সুরক্ষা নীতি</Link></li>
                  <li><Link to="/faq" className="hover:text-white transition-colors">সাধারণ জিজ্ঞাসা (FAQ)</Link></li>
                </ul>
              </div>

              <div>
                <h4 className="font-black text-white text-xs mb-3">যোগাযোগ ও সহায়তা</h4>
                <p className="text-[11px] leading-relaxed">
                  হটলাইন: ০৯৬-৩৮০২২২২<br />
                  ইমেইল: support@paikarmart.com<br />
                  ঢাকা, বাংলাদেশ
                </p>
              </div>
            </div>

            <div className="pt-6 border-t border-white/5 flex flex-col sm:flex-row items-center justify-between text-[11px] gap-2">
              <p>© {new Date().getFullYear()} Paikar Mart Ltd. সর্বস্বত্ব সংরক্ষিত।</p>
              <div className="flex items-center gap-4">
                <span>www.paikarmart.com</span>
                <span>•</span>
                <span>paikarmart.com</span>
              </div>
            </div>
          </footer>
        </div>
      )}
    </div>
  );
}

function EcommerceProductCard({ product, onAddToCart }: { product: EcommerceProduct; onAddToCart: (p: EcommerceProduct, e: React.MouseEvent) => void }) {
  const navigate = useNavigate();
  return (
    <div 
      onClick={() => navigate(`/product/${product.id}`)}
      className="bg-[var(--pm-surface)] border border-[var(--pm-border)] rounded-2xl overflow-hidden hover:border-[var(--pm-accent)]/50 transition-all duration-300 shadow-sm flex flex-col justify-between group cursor-pointer"
    >
      <div>
        <div className="relative aspect-square w-full bg-black/40 overflow-hidden">
          <img 
            src={product.image} 
            alt={product.name} 
            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
            referrerPolicy="no-referrer"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent pointer-events-none" />

          {/* Badges */}
          <div className="absolute top-2.5 left-2.5 flex flex-col gap-1">
            {product.discount && product.discount > 0 && (
              <span className="px-2 py-0.5 rounded-lg bg-orange-500 text-white text-[10px] font-black shadow-md">
                {product.discount}% ছাড়
              </span>
            )}
            {product.category === 'wholesale' && (
              <span className="px-2 py-0.5 rounded-lg bg-blue-600 text-white text-[10px] font-black shadow-md">
                পাইকারি (MOQ {product.moq || 20})
              </span>
            )}
          </div>

          <div className="absolute top-2.5 right-2.5">
            {['1', '5', '10'].includes(String(product.id)) && (
              <span className="px-2 py-0.5 rounded-lg bg-amber-500 text-black text-[9px] font-black shadow-md">
                ★ পিকে এক্সক্লুসিভ
              </span>
            )}
          </div>

          <div className="absolute bottom-2 left-2.5 right-2.5 flex items-center justify-between text-[10px] text-white/90">
            <span className="px-2 py-0.5 rounded-md bg-black/60 backdrop-blur-md truncate max-w-[110px]">
              {product.sellerLocation || 'ঢাকা'}
            </span>
          </div>
        </div>

        <div className="p-3 space-y-2">
          {/* Seller / Brand */}
          <div className="flex items-center justify-between">
            <span className="text-[10px] font-bold text-[var(--pm-accent)] truncate">
              {product.sellerName || 'Verified Merchant'}
            </span>
            <div className="flex items-center gap-0.5 text-amber-400 text-[10px] font-bold">
              <Star className="w-3 h-3 fill-current" />
              <span>{product.rating || 4.8}</span>
            </div>
          </div>

          {/* Title */}
          <h3 className="text-xs font-bold text-white line-clamp-2 leading-snug group-hover:text-[var(--pm-accent)] transition-colors">
            {product.name}
          </h3>

          {/* Price Section */}
          <div className="flex items-baseline gap-2 pt-1">
            <span className="text-sm font-black text-white">
              ৳{product.price.toLocaleString()}
            </span>
            {product.originalPrice && product.originalPrice > product.price && (
              <span className="text-[11px] text-zinc-500 line-through font-semibold">
                ৳{product.originalPrice.toLocaleString()}
              </span>
            )}
          </div>
        </div>
      </div>

      {/* Action Footer */}
      <div className="p-3 pt-0">
        <button
          onClick={(e) => onAddToCart(product, e)}
          className="w-full py-2 rounded-xl bg-[var(--pm-accent)] hover:bg-[var(--pm-accent-hover)] text-white text-xs font-black shadow-md shadow-[var(--pm-accent)]/20 flex items-center justify-center gap-1.5 active:scale-95 transition-all cursor-pointer"
        >
          <ShoppingCart className="w-3.5 h-3.5" />
          <span>কার্টে যোগ করুন</span>
        </button>
      </div>
    </div>
  );
}
