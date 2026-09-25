import React, { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { useAuth } from "@/features/auth/AuthContext";
import { useCartStore } from "@/modules/cart/cartStore";
import { useCartDrawerStore } from "@/modules/cart/cartDrawerStore";
import { MerchantHomeView } from "@/features/home/components/MerchantHomeView";
import { AdminDashboard as AdminHomeView } from "@/portals/seller-central/AdminDashboard";
import HeroSection from "@/components/home/HeroSection";
import { mockProducts } from "@/lib/workspace-stub";
import { ProductQuickViewModal } from "@/components/product/ProductQuickViewModal";
import { toast } from "sonner";

import {
  Star,
  ShoppingBag,
  Building2,
  MapPin,
  Newspaper,
  Wrench,
  Monitor,
  Wallet,
  Truck,
  Box,
  Cpu,
  Shirt,
  Home as HomeIcon,
  Sparkles as SparklesIcon,
  Heart,
  Plus,
  ArrowRight,
  Eye,
  CheckCircle2,
  ChevronRight,
  ShoppingBasket,
  Zap,
  ShieldCheck,
  Store,
  Flame,
  Play,
  MessageSquareQuote,
  Layers,
  ThumbsUp,
  Share2
} from "lucide-react";
import { motion, AnimatePresence } from "motion/react";

// Reels assets
import reelTextileImg from '@/assets/images/paikarmart_reel_textile_1790278682631.jpg';
import reelLeatherImg from '@/assets/images/paikarmart_reel_leather_1790278692894.jpg';

const MERCHANT_ROLES = new Set([
  "seller",
  "wholesale",
  "factory",
  "digital_seller",
  "service_provider",
  "rider",
  "nearby_shop",
]);

const ADMIN_ROLES = new Set(["admin", "super_admin", "moderator"]);

export default function Home() {
  const { role } = useAuth();
  const isRetailSeller = role === "seller";

  if (role && MERCHANT_ROLES.has(role) && !isRetailSeller) {
    return <MerchantHomeView />;
  }

  if (role && ADMIN_ROLES.has(role)) {
    return <AdminHomeView />;
  }

  return <BuyerHomeView />;
}

const SUPER_HUBS = [
  { id: "wholesale", nameBn: "পাইকারি আড়ত", nameEn: "B2B Wholesale", icon: Building2, color: "text-blue-400 bg-blue-500/10 border-blue-500/20 hover:bg-blue-500/20 hover:border-blue-500/40", route: "/wholesale", badge: "MOQ" },
  { id: "market", nameBn: "খুচরা মার্কেট", nameEn: "Retail Mart", icon: ShoppingBag, color: "text-orange-400 bg-orange-500/10 border-orange-500/20 hover:bg-orange-500/20 hover:border-orange-500/40", route: "/b2c", badge: "হট" },
  { id: "services", nameBn: "সার্ভিস হাব", nameEn: "Services", icon: Wrench, color: "text-amber-400 bg-amber-500/10 border-amber-500/20 hover:bg-amber-500/20 hover:border-amber-500/40", route: "/services", badge: "সার্ভিস" },
  { id: "nearby", nameBn: "লোকাল শপ", nameEn: "Nearby Shops", icon: MapPin, color: "text-rose-400 bg-rose-500/10 border-rose-500/20 hover:bg-rose-500/20 hover:border-rose-500/40", route: "/nearby", badge: "কাছে" },
  { id: "pk-shop", nameBn: "পিকে শপ", nameEn: "PK Exclusive", icon: Star, color: "text-purple-400 bg-purple-500/10 border-purple-500/20 hover:bg-purple-500/20 hover:border-purple-500/40", route: "/pk-shop", badge: "কয়েন" },
  { id: "grocery", nameBn: "মুদি আড়ত", nameEn: "Grocery Mart", icon: ShoppingBasket, color: "text-emerald-400 bg-emerald-500/10 border-emerald-500/20 hover:bg-emerald-500/20 hover:border-emerald-500/40", route: "/portal/grocery", badge: "খামার" },
  { id: "feed", nameBn: "কমার্শিয়াল ফিড", nameEn: "Live Reels", icon: Newspaper, color: "text-cyan-400 bg-cyan-500/10 border-cyan-500/20 hover:bg-cyan-500/20 hover:border-cyan-500/40", route: "/reels", badge: "ভিডিও" },
  { id: "digital", nameBn: "ডিজিটাল শপ", nameEn: "Digital Goods", icon: Monitor, color: "text-indigo-400 bg-indigo-500/10 border-indigo-500/20 hover:bg-indigo-500/20 hover:border-indigo-500/40", route: "/digital", badge: "ইনস্ট্যান্ট" },
  { id: "ride", nameBn: "লজিস্টিকস ও রাইড", nameEn: "Ride & Cargo", icon: Truck, color: "text-zinc-400 bg-zinc-500/10 border-zinc-500/20 hover:bg-zinc-500/20 hover:border-zinc-500/40", route: "/ride", badge: "ট্রাক" },
  { id: "orders", nameBn: "অর্ডার ট্র্যাকিং", nameEn: "Orders", icon: Box, color: "text-sky-400 bg-sky-500/10 border-sky-500/20 hover:bg-sky-500/20 hover:border-sky-500/40", route: "/orders", badge: "লাইভ" },
];

const FEATURED_CATEGORIES = [
  { id: "electronics", nameBn: "ইলেকট্রনিক্স", nameEn: "Electronics", count: "১,২৪৫ পণ্য", icon: Cpu, color: "text-blue-400 bg-blue-500/10 border-blue-500/20" },
  { id: "fashion", nameBn: "ফ্যাশন ও টেক্সটাইল", nameEn: "Fashion & Fabric", count: "২,৩৪০+ আইটেম", icon: Shirt, color: "text-pink-400 bg-pink-500/10 border-pink-500/20" },
  { id: "home-living", nameBn: "হোম ও লিভিং", nameEn: "Home & Living", count: "৮৫০ আইটেম", icon: HomeIcon, color: "text-amber-400 bg-amber-500/10 border-amber-500/20" },
  { id: "beauty", nameBn: "বিউটি ও স্কিনকেয়ার", nameEn: "Beauty & Care", count: "৪২০ আইটেম", icon: SparklesIcon, color: "text-purple-400 bg-purple-500/10 border-purple-500/20" },
  { id: "grocery", nameBn: "খাদ্য ও শস্য খামার", nameEn: "Agro & Food", count: "১,১৫০ আইটেম", icon: ShoppingBasket, color: "text-emerald-400 bg-emerald-500/10 border-emerald-500/20" },
];

const TOP_STORES = [
  { name: "বাটা বাংলাদেশ (Bata)", role: "অফিসিয়াল ফুটওয়্যার", rating: 4.9, reviews: "২৫.২কে", badge: "ভেরিফাইড ব্র্যান্ড", logo: "B", color: "from-amber-500 to-orange-600" },
  { name: "আড়ং ফ্যাশন (Aarong)", role: "ঐতিহ্যের টেক্সটাইল", rating: 4.9, reviews: "৩৪.৫কে", badge: "প্রিমিয়াম ম্যানুফ্যাকচারার", logo: "A", color: "from-pink-500 to-rose-600" },
  { name: "চামড়া হাট (Leather House)", role: "হোলসেল এক্সপোর্টার", rating: 4.8, reviews: "১২.৪কে", badge: "পাইকারি কারখানা", logo: "L", color: "from-orange-500 to-amber-700" },
  { name: "গেজেট বাইট (GadgetByte)", role: "ইমপোর্টার ও ডিলার", rating: 4.8, reviews: "১৯.২কে", badge: "ভেরিফাইড ডিলার", logo: "G", color: "from-cyan-500 to-blue-600" },
];

const SOCIAL_COMMERCE_REELS = [
  {
    id: 'reel-1',
    title: 'সোনারগাঁ জামদানি বুননের খাঁটি কারুশিল্প লাইভ',
    merchant: 'ঐতিহ্যবাহী তাঁত ঘর',
    views: '৪৫.২কে ভিউ',
    likes: '৩.৮কে',
    image: reelTextileImg,
    productId: 'jamdani-saree',
    productName: 'প্রিমিয়াম ঢাকাই জামদানি শাড়ি',
    price: '৳ ৮,৫০০'
  },
  {
    id: 'reel-2',
    title: 'জেনুইন লেদার ওয়ালেট ও বেল্ট আনবক্সিং রিভিউ',
    merchant: 'লেদার ক্রাফটস বিডি',
    views: '২৮.৬কে ভিউ',
    likes: '২.১কে',
    image: reelLeatherImg,
    productId: 'leather-wallet',
    productName: 'হ্যান্ডক্রাফটেড ব্রাউন লেদার ওয়ালেট',
    price: '৳ ১,২৫০'
  }
];

const VERIFIED_TESTIMONIALS = [
  {
    author: "মোঃ কামরুল হাসান",
    role: "স্বত্বাধিকারী, হাসান টেক্সটাইল",
    city: "চকবাজার, ঢাকা",
    content: "পাইকারমার্ট থেকে সরাসরি মিল-গেট দরে সুতা ও কাপড় সংগ্রহ করে আমার রিটেইল ব্যবসায় ৩৫% খরচ কমেছে। এসক্রো পেমেন্ট সিস্টেমের কারণে টাকা হারানোর কোনো ভয় নেই।",
    rating: 5,
  },
  {
    author: "ফারহানা জাহান",
    role: "মার্চেন্ট, রুরাল অর্গানিক মার্ট",
    city: "সিলেট",
    content: "সুন্দরবনের মধু ও দিনাজপুরের আতপ চাল সরাসরি পাইকারি ক্রেতাদের কাছে বিক্রয় করছি। ০% প্ল্যাটফর্ম চার্জে ডেলিভারি পেয়ে খামারিরাও খুশি, ক্রেতারাও লাভবান।",
    rating: 5,
  },
  {
    author: "তানভীর আহমেদ",
    role: "পরিচালক, গ্যাজেট প্লাজা",
    city: "জিইসি মোড়, চট্টগ্রাম",
    content: "বড় বড় ইমপোর্টারদের সাথে সরাসরি যোগাযোগ করে পাইকারি অর্ডার করতে পারি। কোনো মধ্যস্বত্বভোগী নেই, অর্ডার ট্র্যাকিং অত্যন্ত স্বচ্ছ।",
    rating: 5,
  }
];

function BuyerHomeView() {
  const navigate = useNavigate();
  const addItem = useCartStore((state) => state.addItem);
  const openCart = useCartDrawerStore((state) => state.open);
  
  const [activeFilterTab, setActiveFilterTab] = useState<'all' | 'wholesale' | 'retail' | 'grocery' | 'electronics'>('all');
  const [likedProducts, setLikedProducts] = useState<Record<string, boolean>>({});
  const [quickViewProduct, setQuickViewProduct] = useState<any | null>(null);

  // Products
  const products = mockProducts.filter((p: any) => p.type !== 'ride' && p.type !== 'service');
  const flashSaleItems = products.filter((p: any) => p.discount || p.isFlashSale).slice(0, 4);

  // Filtered products for tab selector
  const filteredTabProducts = products.filter((p: any) => {
    if (activeFilterTab === 'all') return true;
    if (activeFilterTab === 'wholesale') return p.portal === 'wholesale' || p.moq;
    if (activeFilterTab === 'retail') return p.portal === 'b2c' || !p.moq;
    if (activeFilterTab === 'grocery') return p.category?.toLowerCase().includes('মুদি') || p.category?.toLowerCase().includes('agro') || p.category?.toLowerCase().includes('food');
    if (activeFilterTab === 'electronics') return p.category?.toLowerCase().includes('ইলেকট্রনিক্স') || p.category?.toLowerCase().includes('tech');
    return true;
  }).slice(0, 8);

  const toggleLike = (id: string, e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setLikedProducts(prev => {
      const next = !prev[id];
      if (next) {
        toast.success("পণ্যটি পছন্দের তালিকায় যুক্ত হয়েছে");
      }
      return { ...prev, [id]: next };
    });
  };

  const handleQuickAdd = (p: any, e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    addItem({
      id: p.id,
      name: p.title || p.name,
      price: p.price,
      image: p.image || (p.images && p.images[0]) || "",
      portal: p.portal === 'wholesale' ? 'wholesale' : 'b2c',
    });
    toast.success(`"${p.title || p.name}" কার্টে যুক্ত হয়েছে!`);
  };

  const handleOpenQuickView = (p: any, e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setQuickViewProduct(p);
  };

  return (
    <div className="w-full flex flex-col gap-6 sm:gap-8 pb-14 select-none text-[var(--pm-text)]">
      
      {/* Quick View Modal */}
      <ProductQuickViewModal
        product={quickViewProduct}
        isOpen={Boolean(quickViewProduct)}
        onClose={() => setQuickViewProduct(null)}
      />

      {/* ━━━ 1. EXPANSIVE FULL-WIDTH HERO SECTION ━━━ */}
      <section className="w-full">
        <HeroSection />
      </section>

      {/* ━━━ 2. PAIKARMART SUPER HUBS (10 MODULES COCKPIT) ━━━ */}
      <section className="rounded-3xl bg-[var(--pm-surface)]/80 border border-[var(--pm-border)] p-4 sm:p-5 lg:p-6 shadow-sm">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 mb-4 sm:mb-5">
          <div>
            <h2 className="text-base sm:text-lg font-black text-[var(--pm-text)] flex items-center gap-2 tracking-tight">
              <SparklesIcon className="h-4 w-4 sm:h-5 sm:w-5 text-[var(--pm-accent)]" /> 
              PaikarMart Super Hubs
            </h2>
            <p className="text-[10px] sm:text-xs text-[var(--pm-text-muted)] font-semibold mt-0.5">
              সকল কমার্স ও পাইকারি আড়ত সেবা এক ক্লিকে • ALL COMMERCIAL HUBS IN ONE APP
            </p>
          </div>
          <span className="self-start sm:self-auto text-[10px] font-black text-[var(--pm-text-muted)] uppercase tracking-wider bg-[var(--pm-surface-hover)] border border-[var(--pm-border)] rounded-full px-3 py-1">
            ১০টি সমন্বিত মডিউল
          </span>
        </div>

        {/* 10 Hubs Grid */}
        <div className="grid grid-cols-5 md:grid-cols-5 lg:grid-cols-10 gap-2.5 sm:gap-3 lg:gap-3.5">
          {SUPER_HUBS.map((hub) => {
            const IconComp = hub.icon;
            return (
              <Link
                key={hub.id}
                to={hub.route}
                className="flex flex-col items-center gap-2 group cursor-pointer text-center p-2 rounded-2xl hover:bg-[var(--pm-surface-hover)] border border-transparent hover:border-[var(--pm-border)] transition-all"
              >
                <div
                  className={`w-12 h-12 sm:w-14 sm:h-14 rounded-2xl flex items-center justify-center border transition-all duration-300 relative shadow-sm group-hover:scale-105 group-hover:shadow-md ${hub.color}`}
                >
                  <IconComp className="w-5 h-5 sm:w-6 sm:h-6 transition-transform group-hover:scale-110" />
                  {hub.badge && (
                    <span className="absolute -top-1 -right-1 bg-[var(--pm-accent)] text-white text-[7px] sm:text-[8px] font-black px-1.5 py-0.2 rounded-full uppercase shadow">
                      {hub.badge}
                    </span>
                  )}
                </div>
                <div className="w-full truncate px-0.5">
                  <span className="block text-[10px] sm:text-xs font-bold text-[var(--pm-text)] group-hover:text-[var(--pm-accent)] transition-colors leading-tight truncate">
                    {hub.nameBn}
                  </span>
                  <span className="hidden sm:block text-[8px] text-[var(--pm-text-muted)] font-medium uppercase tracking-wider truncate mt-0.5">
                    {hub.nameEn}
                  </span>
                </div>
              </Link>
            );
          })}
        </div>
      </section>

      {/* ━━━ 3. FLASH DEALS & LIMITED CAMPAIGNS (DESKTOP GRID) ━━━ */}
      <section className="rounded-3xl bg-gradient-to-br from-red-600/10 via-orange-600/5 to-transparent border border-red-500/20 p-4 sm:p-5 lg:p-6">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-xl bg-red-600 flex items-center justify-center text-white shadow-md shadow-red-600/30">
              <Zap className="w-4 h-4 fill-white" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h3 className="text-sm sm:text-base font-black text-white uppercase tracking-tight">
                  লাইভ ফ্ল্যাশ ডিলস
                </h3>
                <span className="bg-red-600 text-white font-mono text-[9px] font-black px-2 py-0.5 rounded animate-pulse">
                  ০৪:২৮:১২ বাকি
                </span>
              </div>
              <p className="text-[10px] sm:text-xs text-zinc-400 font-medium">সীমিত স্টক · সরাসরি কারখানা অফার</p>
            </div>
          </div>
          <Link
            to="/b2c?b2cView=deals"
            className="text-xs font-bold text-[var(--pm-accent)] hover:underline flex items-center gap-1"
          >
            সব ডিল দেখুন <ArrowRight className="w-3.5 h-3.5" />
          </Link>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-4 gap-3 sm:gap-4">
          {flashSaleItems.map((p, idx) => {
            const stockPct = 65 + (idx * 9) % 30;
            return (
              <div
                key={p.id}
                onClick={() => navigate(`/product/${p.id}`)}
                className="rounded-2xl bg-[var(--pm-surface)] border border-white/5 hover:border-[var(--pm-accent)]/40 p-3 flex flex-col justify-between group cursor-pointer transition-all hover:-translate-y-1 shadow-md relative"
              >
                <div>
                  <div className="relative aspect-square rounded-xl overflow-hidden bg-zinc-900 mb-2.5">
                    <img
                      src={p.image}
                      alt={p.name}
                      referrerPolicy="no-referrer"
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                    />
                    <span className="absolute top-2 left-2 bg-red-600 text-white text-[8px] sm:text-[9px] font-black px-2 py-0.5 rounded-full shadow">
                      -{p.discount || 30}% ছাড়
                    </span>

                    {/* Quick View Button on Hover */}
                    <button
                      onClick={(e) => handleOpenQuickView(p, e)}
                      className="absolute inset-x-2 bottom-2 py-1.5 rounded-xl bg-black/75 backdrop-blur-md text-white text-[10px] font-bold flex items-center justify-center gap-1.5 opacity-0 group-hover:opacity-100 transition-opacity border border-white/10 hover:bg-[var(--pm-accent)]"
                      title="কুইক প্রিভিউ"
                    >
                      <Eye className="w-3 h-3" />
                      <span>কুইক ভিউ</span>
                    </button>
                  </div>
                  <h4 className="text-xs sm:text-sm font-bold text-white line-clamp-1 group-hover:text-[var(--pm-accent)] transition-colors">
                    {p.name || p.title}
                  </h4>
                  <div className="flex items-baseline gap-1.5 mt-1">
                    <span className="text-sm font-black text-white">৳{p.price.toLocaleString()}</span>
                    {p.originalPrice && (
                      <span className="text-[10px] text-zinc-500 line-through">৳{p.originalPrice.toLocaleString()}</span>
                    )}
                  </div>
                </div>

                <div className="mt-3 space-y-1.5">
                  <div className="w-full bg-white/10 h-1.5 rounded-full overflow-hidden">
                    <div className="bg-gradient-to-r from-red-600 to-amber-500 h-full" style={{ width: `${stockPct}%` }} />
                  </div>
                  <div className="flex items-center justify-between text-[9px] text-zinc-400 font-semibold">
                    <span>স্টক অবশিষ্ট</span>
                    <span className="text-amber-400 font-bold">{100 - stockPct}% ফ্রি</span>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </section>

      {/* ━━━ 4. INTERACTIVE RECOMMENDED PRODUCTS WITH TAB FILTERS ━━━ */}
      <section className="space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div>
            <h3 className="text-base sm:text-lg font-black text-[var(--pm-text)] tracking-tight uppercase flex items-center gap-2">
              <span>আপনার জন্য নির্বাচিত পণ্য</span>
              <span className="hidden sm:inline-block text-[9px] font-black px-2 py-0.5 rounded-full bg-[var(--pm-accent)]/15 text-[var(--pm-accent)]">
                ভেরিফাইড ক্যাটালগ
              </span>
            </h3>
            <p className="text-[10px] sm:text-xs text-[var(--pm-text-muted)] font-semibold">
              ক্যাটাগরি অনুযায়ী সরাসরি ফিল্টার করুন এবং বাল্ক রেটে সংগ্রহ করুন
            </p>
          </div>

          {/* Interactive Filter Tabs */}
          <div className="flex items-center gap-1.5 bg-[var(--pm-surface)] p-1 rounded-2xl border border-[var(--pm-border)] overflow-x-auto hide-scrollbar">
            {[
              { id: 'all', label: 'সব পণ্য' },
              { id: 'wholesale', label: 'পাইকারি (MOQ)' },
              { id: 'retail', label: 'রিটেইল' },
              { id: 'grocery', label: 'মুদি ও শস্য' },
              { id: 'electronics', label: 'গ্যাজেট' },
            ].map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveFilterTab(tab.id as any)}
                className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all shrink-0 active:scale-95 ${
                  activeFilterTab === tab.id
                    ? 'bg-[var(--pm-accent)] text-white shadow-sm font-black'
                    : 'text-[var(--pm-text-muted)] hover:text-[var(--pm-text)] hover:bg-white/5'
                }`}
              >
                {tab.label}
              </button>
            ))}
          </div>
        </div>

        {/* Responsive Multi-Column Product Grid */}
        <div className="grid grid-cols-2 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3 sm:gap-4 lg:gap-5">
          {filteredTabProducts.map((p) => (
            <div
              key={p.id}
              onClick={() => navigate(`/product/${p.id}`)}
              className="rounded-3xl bg-[var(--pm-surface)] border border-[var(--pm-border)] hover:border-[var(--pm-accent)]/50 overflow-hidden cursor-pointer transition-all hover:-translate-y-1 relative group shadow-sm flex flex-col justify-between"
            >
              {/* Product Image Box */}
              <div className="relative aspect-square overflow-hidden bg-[var(--pm-surface-hover)] shrink-0">
                <img
                  src={p.image}
                  alt={p.name}
                  referrerPolicy="no-referrer"
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                />
                
                {/* Wishlist button */}
                <button
                  onClick={(e) => toggleLike(p.id, e)}
                  className="absolute top-2.5 right-2.5 w-8 h-8 rounded-full bg-black/50 backdrop-blur-md border border-white/15 flex items-center justify-center text-white hover:text-rose-500 active:scale-90 transition-all z-10"
                  title="পছন্দের তালিকায় রাখুন"
                >
                  <Heart className={`w-4 h-4 ${likedProducts[p.id] ? "fill-rose-500 text-rose-500" : "text-white"}`} />
                </button>
                
                {/* Quick View Button Overlay */}
                <button
                  onClick={(e) => handleOpenQuickView(p, e)}
                  className="absolute inset-x-3 bottom-2.5 py-2 rounded-xl bg-black/80 backdrop-blur-md text-white text-[11px] font-bold flex items-center justify-center gap-1.5 opacity-0 group-hover:opacity-100 transition-all border border-white/10 hover:bg-[var(--pm-accent)] z-10"
                >
                  <Eye className="w-3.5 h-3.5" />
                  <span>কুইক প্রিভিউ</span>
                </button>

                {/* Discount Tag */}
                {p.discount && (
                  <span className="absolute bottom-2.5 left-2.5 bg-rose-600 text-white text-[8px] sm:text-[9px] font-black uppercase px-2 py-0.5 rounded-full shadow-md">
                    -{p.discount}% ছাড়
                  </span>
                )}

                {/* Wholesale MOQ Badge */}
                {p.moq && (
                  <span className="absolute top-2.5 left-2.5 bg-blue-600 text-white text-[8px] sm:text-[9px] font-black uppercase px-2 py-0.5 rounded-md shadow-md">
                    MOQ: {p.moq} পিস
                  </span>
                )}
              </div>

              {/* Product Metadata */}
              <div className="p-3 sm:p-4 flex flex-col gap-2 flex-1 justify-between">
                <div>
                  <div className="flex items-center justify-between">
                    <span className="text-[9px] text-[var(--pm-text-muted)] font-bold uppercase tracking-wider block">
                      {p.category || "জেনারেল"}
                    </span>
                    <span className="text-[9px] text-zinc-500 font-semibold">
                      ১,৪২০+ বিক্রিত
                    </span>
                  </div>
                  
                  <h4 className="text-xs sm:text-sm font-black text-[var(--pm-text)] line-clamp-1 group-hover:text-[var(--pm-accent)] transition-colors mt-0.5">
                    {p.name || p.title}
                  </h4>
                  <p className="text-[10px] text-[var(--pm-text-muted)] font-medium line-clamp-1 mt-0.5 flex items-center gap-1">
                    <Store className="w-3 h-3 text-[var(--pm-accent)] shrink-0" />
                    <span>{p.seller || "পাইকারমার্ট ভেরিফাইড আড়ত"}</span>
                  </p>
                </div>

                <div className="flex items-center justify-between pt-2 border-t border-[var(--pm-border)]/50 mt-1">
                  <div className="flex flex-col">
                    <span className="text-sm sm:text-base font-black text-[var(--pm-accent)]">
                      ৳{p.price.toLocaleString()}
                    </span>
                    {p.originalPrice && (
                      <span className="text-[10px] text-[var(--pm-text-muted)] line-through">
                        ৳{p.originalPrice.toLocaleString()}
                      </span>
                    )}
                  </div>
                  
                  {/* Working Add to Cart Button */}
                  <button
                    onClick={(e) => handleQuickAdd(p, e)}
                    className="w-8 h-8 rounded-xl bg-[var(--pm-accent-soft)] hover:bg-[var(--pm-accent)] text-[var(--pm-accent)] hover:text-white border border-[var(--pm-accent)]/30 flex items-center justify-center transition-all active:scale-95 shadow-xs"
                    title="কার্টে যুক্ত করুন"
                  >
                    <Plus className="w-4 h-4 stroke-[2.5px]" />
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* ━━━ 5. SOCIAL COMMERCE VIDEO REELS STRIP (LIVE IN ACTION) ━━━ */}
      <section className="rounded-3xl bg-[var(--pm-surface)]/80 border border-[var(--pm-border)] p-4 sm:p-5 lg:p-6 shadow-sm">
        <div className="flex items-center justify-between mb-4">
          <div>
            <h3 className="text-base sm:text-lg font-black text-[var(--pm-text)] tracking-tight uppercase flex items-center gap-2">
              <Play className="w-4 h-4 text-rose-500 fill-rose-500" />
              লাইভ কমার্স ও শর্ট ভিডিও রিলস
            </h3>
            <p className="text-[10px] sm:text-xs text-[var(--pm-text-muted)] font-semibold">
              সরাসরি মার্চেন্টদের তৈরি ভিডিও দেখে পণ্যের মান যাচাই করে ক্রয় করুন
            </p>
          </div>
          <Link to="/reels" className="text-xs font-bold text-[var(--pm-accent)] hover:underline flex items-center gap-1">
            সব রিলস <ChevronRight className="w-3.5 h-3.5" />
          </Link>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 lg:gap-5">
          {SOCIAL_COMMERCE_REELS.map((reel) => (
            <div
              key={reel.id}
              onClick={() => navigate('/reels')}
              className="rounded-2xl bg-black/40 border border-[var(--pm-border)] overflow-hidden flex flex-col sm:flex-row gap-4 p-3.5 hover:border-[var(--pm-accent)]/50 transition-all cursor-pointer group shadow-sm"
            >
              {/* Vertical Video Thumbnail with Play Button */}
              <div className="relative w-full sm:w-36 h-48 sm:h-44 rounded-xl overflow-hidden shrink-0 bg-zinc-900">
                <img
                  src={reel.image}
                  alt={reel.title}
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                />
                <div className="absolute inset-0 bg-black/30 flex items-center justify-center">
                  <div className="w-10 h-10 rounded-full bg-white/25 backdrop-blur-md border border-white/30 flex items-center justify-center text-white group-hover:scale-110 transition-transform">
                    <Play className="w-5 h-5 fill-white ml-0.5" />
                  </div>
                </div>
                <span className="absolute bottom-2 left-2 text-[9px] font-black text-white bg-black/60 px-2 py-0.5 rounded backdrop-blur-xs">
                  {reel.views}
                </span>
              </div>

              {/* Video Info & Product Card */}
              <div className="flex flex-col justify-between flex-1 py-1">
                <div className="space-y-1.5">
                  <span className="text-[9px] font-black uppercase text-[var(--pm-accent)] tracking-wider">
                    {reel.merchant}
                  </span>
                  <h4 className="text-xs sm:text-sm font-bold text-white group-hover:text-[var(--pm-accent)] transition-colors line-clamp-2">
                    {reel.title}
                  </h4>
                </div>

                {/* Attached Commerce Mini Product Card */}
                <div className="mt-3 p-2.5 rounded-xl bg-white/5 border border-white/5 flex items-center justify-between gap-3">
                  <div className="min-w-0">
                    <p className="text-[10px] text-zinc-400 font-medium truncate">{reel.productName}</p>
                    <p className="text-xs font-black text-[var(--pm-accent)]">{reel.price}</p>
                  </div>
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      navigate('/b2c');
                    }}
                    className="px-3 py-1.5 rounded-lg bg-[var(--pm-accent)] text-white text-[10px] font-bold shrink-0 hover:bg-[var(--pm-accent-hover)] transition-colors active:scale-95"
                  >
                    পণ্য কিনুন
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* ━━━ 6. TOP VERIFIED MANUFACTURERS & WHOLESALERS SHOWCASE ━━━ */}
      <section className="rounded-3xl bg-[var(--pm-surface)]/80 border border-[var(--pm-border)] p-4 sm:p-5 lg:p-6 shadow-sm">
        <div className="flex items-center justify-between mb-4">
          <div>
            <h3 className="text-sm sm:text-base font-black text-[var(--pm-text)] tracking-tight uppercase flex items-center gap-2">
              <Building2 className="w-4 h-4 text-emerald-400" />
              ভেরিফাইড হোলসেলার ও টপ ম্যানুফ্যাকচারার
            </h3>
            <p className="text-[9px] sm:text-xs text-[var(--pm-text-muted)] font-semibold">
              সরাসরি কারখানার প্রোফাইল ভিজিট করুন এবং বাল্ক ডিল করুন
            </p>
          </div>
          <Link to="/wholesale" className="text-xs font-bold text-[var(--pm-accent)] hover:underline flex items-center gap-1">
            সব সেলার <ChevronRight className="w-3.5 h-3.5" />
          </Link>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4">
          {TOP_STORES.map((st, i) => (
            <div
              key={i}
              onClick={() => navigate(`/wholesale`)}
              className="p-3.5 rounded-2xl bg-[var(--pm-surface)] border border-[var(--pm-border)] hover:border-[var(--pm-accent)]/40 hover:bg-[var(--pm-surface-hover)] transition-all cursor-pointer flex items-center gap-3.5 group shadow-xs"
            >
              <div className={`w-11 h-11 rounded-2xl bg-gradient-to-tr ${st.color} flex items-center justify-center text-white font-black text-base shadow-sm shrink-0 group-hover:scale-105 transition-transform`}>
                {st.logo}
              </div>
              <div className="min-w-0 flex-1">
                <div className="flex items-center gap-1">
                  <h4 className="text-xs sm:text-sm font-black text-[var(--pm-text)] truncate group-hover:text-[var(--pm-accent)] transition-colors">
                    {st.name}
                  </h4>
                  <ShieldCheck className="w-3.5 h-3.5 text-emerald-400 shrink-0" />
                </div>
                <p className="text-[10px] text-[var(--pm-text-muted)] truncate">{st.role}</p>
                <div className="flex items-center gap-2 mt-1 text-[9px]">
                  <span className="text-amber-400 font-bold flex items-center gap-0.5">
                    <Star className="w-3 h-3 fill-amber-400" /> {st.rating}
                  </span>
                  <span className="text-[var(--pm-text-muted)] font-medium">• {st.reviews} রিভিউ</span>
                </div>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* ━━━ 7. URGENT WHOLESALE BUYER DEMANDS (LIVE B2B TICKER) ━━━ */}
      <section className="rounded-3xl bg-[var(--pm-surface)]/80 border border-[var(--pm-border)] p-4 sm:p-5 lg:p-6 shadow-sm">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-2">
            <Flame className="w-5 h-5 text-orange-500" />
            <div>
              <h3 className="text-sm sm:text-base font-black text-[var(--pm-text)] tracking-tight uppercase">
                জরুরি বায়ার ডিমান্ড বোর্ড (Live Requests)
              </h3>
              <p className="text-[9px] sm:text-xs text-[var(--pm-text-muted)] font-semibold">
                সরাসরি পাইকারি ক্রেতাদের চাহিদায় কোটেশন পাঠান
              </p>
            </div>
          </div>
          <Link
            to="/demand"
            className="px-3 py-1.5 rounded-xl bg-[var(--pm-accent)] hover:bg-[var(--pm-accent-hover)] text-white text-[11px] font-black transition-all shadow-xs flex items-center gap-1"
          >
            <Plus className="w-3.5 h-3.5 stroke-[3px]" />
            <span>ডিমান্ড দিন</span>
          </Link>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-3 sm:gap-4">
          {[
            { title: 'মিরপুরে ২০ কার্টন খাঁটি সরিষার তেল', budget: '৳ ১৮,০০০', location: 'মিরপুর, ঢাকা', time: '২৫ মিনিট আগে', inquiries: '৪টি কোটেশন' },
            { title: 'চকবাজারে ৫০ ডজন মেনস জেনুইন লেদার বেল্ট', budget: '৳ ৪৫,০০০', location: 'চকবাজার, ঢাকা', time: '১ ঘণ্টা আগে', inquiries: '৭টি কোটেশন' },
            { title: 'যাত্রাবাড়িতে ১০০ বস্তা চিনিগুঁড়া আতপ চাল', budget: '৳ ১,২০,০০০', location: 'যাত্রাবাড়ী, ঢাকা', time: '২ ঘণ্টা আগে', inquiries: '১২টি কোটেশন' },
          ].map((item, idx) => (
            <div
              key={idx}
              onClick={() => navigate('/demand')}
              className="p-3.5 rounded-2xl bg-[var(--pm-surface)] border border-[var(--pm-border)] hover:border-[var(--pm-accent)]/50 transition-all cursor-pointer group flex flex-col justify-between gap-3 shadow-xs"
            >
              <div>
                <span className="text-[9px] font-black text-[var(--pm-accent)] uppercase tracking-wider block">
                  {item.location} • {item.time}
                </span>
                <h4 className="text-xs sm:text-sm font-bold text-[var(--pm-text)] group-hover:text-[var(--pm-accent)] transition-colors mt-1 line-clamp-2">
                  {item.title}
                </h4>
              </div>
              <div className="flex items-center justify-between pt-2 border-t border-[var(--pm-border)]/50 text-[11px]">
                <span className="font-black text-[var(--pm-accent)]">{item.budget}</span>
                <span className="text-[9px] text-[var(--pm-text-muted)] font-bold">{item.inquiries}</span>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* ━━━ 8. REAL VERIFIED BUYER TESTIMONIALS (SOCIAL PROOF) ━━━ */}
      <section className="rounded-3xl bg-[var(--pm-surface)]/80 border border-[var(--pm-border)] p-4 sm:p-5 lg:p-6 shadow-sm">
        <div className="flex items-center gap-2 mb-4">
          <MessageSquareQuote className="w-5 h-5 text-[var(--pm-accent)]" />
          <div>
            <h3 className="text-sm sm:text-base font-black text-[var(--pm-text)] tracking-tight uppercase">
              সন্তুষ্ট মার্চেন্ট ও ক্রেতাদের মতামত
            </h3>
            <p className="text-[9px] sm:text-xs text-[var(--pm-text-muted)] font-semibold">
              দেশব্যাপী হাজারো রিটেইলার ও হোলসেলারদের আস্থা
            </p>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {VERIFIED_TESTIMONIALS.map((t, idx) => (
            <div
              key={idx}
              className="p-4 rounded-2xl bg-[var(--pm-surface)] border border-[var(--pm-border)] flex flex-col justify-between gap-3 shadow-xs"
            >
              <div className="space-y-2">
                <div className="flex items-center gap-0.5 text-amber-400">
                  {[...Array(t.rating)].map((_, i) => (
                    <Star key={i} className="w-3.5 h-3.5 fill-amber-400" />
                  ))}
                </div>
                <p className="text-xs text-[var(--pm-text-muted)] leading-relaxed italic">
                  "{t.content}"
                </p>
              </div>

              <div className="pt-2 border-t border-[var(--pm-border)]/50 flex items-center justify-between">
                <div>
                  <h5 className="text-xs font-bold text-[var(--pm-text)]">{t.author}</h5>
                  <p className="text-[10px] text-[var(--pm-text-muted)]">{t.role} · {t.city}</p>
                </div>
                <span className="text-[9px] font-bold text-emerald-400 bg-emerald-500/10 px-2 py-0.5 rounded-full border border-emerald-500/20">
                  ভেরিফাইড
                </span>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* ━━━ 9. TRUST, SECURITY & ESCROW VALUE PROPOSITION ━━━ */}
      <section className="rounded-3xl bg-gradient-to-r from-emerald-500/10 via-[var(--pm-surface)] to-cyan-500/10 border border-emerald-500/20 p-5 sm:p-6 shadow-sm">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-center">
          <div className="space-y-1">
            <div className="w-10 h-10 mx-auto rounded-2xl bg-emerald-500/15 text-emerald-400 flex items-center justify-center shadow-xs">
              <ShieldCheck className="w-5 h-5" />
            </div>
            <h4 className="text-xs sm:text-sm font-black text-[var(--pm-text)]">১০০% এসক্রো ট্রাস্ট</h4>
            <p className="text-[9px] sm:text-[10px] text-[var(--pm-text-muted)] font-medium">পণ্য হাতে পেয়ে নিশ্চিত করার পর পেমেন্ট রিলিজ</p>
          </div>

          <div className="space-y-1">
            <div className="w-10 h-10 mx-auto rounded-2xl bg-blue-500/15 text-blue-400 flex items-center justify-center shadow-xs">
              <Building2 className="w-5 h-5" />
            </div>
            <h4 className="text-xs sm:text-sm font-black text-[var(--pm-text)]">সরাসরি মিল-গেট দর</h4>
            <p className="text-[9px] sm:text-[10px] text-[var(--pm-text-muted)] font-medium">কোনো মধ্যস্বত্বভোগী ছাড়া আসল পাইকারি রেট</p>
          </div>

          <div className="space-y-1">
            <div className="w-10 h-10 mx-auto rounded-2xl bg-amber-500/15 text-amber-400 flex items-center justify-center shadow-xs">
              <Truck className="w-5 h-5" />
            </div>
            <h4 className="text-xs sm:text-sm font-black text-[var(--pm-text)]">দেশজুড়ে ফাস্ট লজিস্টিকস</h4>
            <p className="text-[9px] sm:text-[10px] text-[var(--pm-text-muted)] font-medium">৬৪ জেলায় দ্রুততম পরিবহন ও ক্যাশ অন ডেলিভারি</p>
          </div>

          <div className="space-y-1">
            <div className="w-10 h-10 mx-auto rounded-2xl bg-purple-500/15 text-purple-400 flex items-center justify-center shadow-xs">
              <SparklesIcon className="w-5 h-5" />
            </div>
            <h4 className="text-xs sm:text-sm font-black text-[var(--pm-text)]">২৪/৭ হটলাইন সাপোর্ট</h4>
            <p className="text-[9px] sm:text-[10px] text-[var(--pm-text-muted)] font-medium">০৯৬-৩৮০২২২২ (কল সেন্টার ও লাইভ চ্যাট)</p>
          </div>
        </div>
      </section>

    </div>
  );
}
