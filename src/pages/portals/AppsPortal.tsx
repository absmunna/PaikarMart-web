import React, { useState } from "react";
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
  EyeOff,
  Eye,
  ArrowRight,
  ChevronDown,
  LayoutDashboard,
  Film,
  Radio,
  Tag,
  MessageSquare,
  ShieldCheck,
  Zap,
  Sparkles,
  ShoppingBasket,
  Shirt,
  Utensils,
  Cpu
} from "lucide-react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";

interface CategoryItem {
  id: string;
  nameBn: string;
  nameEn: string;
  icon: any;
  itemsCount: string;
  bgGradient: string;
  accentColor: string;
  link: string;
}

const FEATURED_CATEGORIES: CategoryItem[] = [
  {
    id: "apparel",
    nameBn: "গার্মেন্টস ও পোশাক",
    nameEn: "Wholesale Apparel",
    icon: Shirt,
    itemsCount: "৪,৫২০+ আইটেম",
    bgGradient: "from-blue-900/40 via-indigo-900/30 to-purple-900/20",
    accentColor: "text-blue-400",
    link: "/wholesale?cat=apparel",
  },
  {
    id: "grocery",
    nameBn: "চাল, ডাল ও তেল",
    nameEn: "Bulk Grocery",
    icon: ShoppingBasket,
    itemsCount: "২,৩৪০+ আইটেম",
    bgGradient: "from-emerald-900/40 via-teal-900/30 to-cyan-900/20",
    accentColor: "text-emerald-400",
    link: "/wholesale?cat=grocery",
  },
  {
    id: "electronics",
    nameBn: "ইলেকট্রনিক্স ও গ্যাজেট",
    nameEn: "Electronics & Gadgets",
    icon: Cpu,
    itemsCount: "৩,১১০+ আইটেম",
    bgGradient: "from-purple-900/40 via-pink-900/30 to-rose-900/20",
    accentColor: "text-purple-400",
    link: "/marketplace?cat=electronics",
  },
  {
    id: "food",
    nameBn: "খাবার ও রেস্টুরেন্ট",
    nameEn: "Food & Delivery",
    icon: Utensils,
    itemsCount: "১,৮০০+ শপ",
    bgGradient: "from-amber-900/40 via-orange-900/30 to-red-900/20",
    accentColor: "text-[#FF7A00]",
    link: "/local?cat=food",
  },
];

export default function AppsPortal() {
  const { user } = useAuth();
  const [showWallet, setShowWallet] = useState(false);
  const navigate = useNavigate();
  
  const walletBalance = "৳ ১২,৪৫০"; 

  return (
    <div className="flex flex-col gap-6 px-4 py-6 md:px-6 md:py-8 bg-[#0f111a] min-h-screen text-white">
      
      {/* Top Cards Section */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        {/* Welcome & Wallet Card */}
        <div className="flex flex-col justify-between rounded-3xl bg-[#141624] p-5 shadow-xl border border-white/5 relative overflow-hidden">
          <div className="absolute top-0 right-0 w-32 h-32 bg-[#FF7A00]/5 blur-3xl pointer-events-none" />
          <div>
            <div className="flex items-center justify-between">
              <span className="text-xs font-semibold text-zinc-400">স্বাগতম! 👋</span>
              <span className="text-[10px] px-2.5 py-0.5 rounded-full bg-emerald-500/10 text-emerald-400 font-bold border border-emerald-500/20">
                Verified Profile
              </span>
            </div>
            <h2 className="mt-1 text-lg font-black text-white line-clamp-1">
              {user?.name || "সম্মানিত ব্যবহারকারী"}
            </h2>
            <div className="mt-2 inline-flex items-center gap-1.5 rounded-full bg-black/40 px-3 py-1 text-xs text-zinc-300 border border-white/5">
              <MapPin className="h-3.5 w-3.5 text-[#FF7A00]" />
              <span>Dhaka, Bangladesh</span>
              <ChevronDown className="h-3.5 w-3.5 ml-1 text-zinc-500" />
            </div>
          </div>
          
          <div className="mt-6 flex items-center justify-between rounded-2xl bg-black/40 px-4 py-3 border border-white/5 backdrop-blur-sm">
            <div 
              onClick={() => navigate("/wallet")}
              className="cursor-pointer group flex-1"
            >
              <div className="flex items-center gap-1.5">
                <Wallet className="h-3.5 w-3.5 text-[#FF7A00]" />
                <p className="text-xs font-bold text-[#FF7A00] group-hover:underline">PaikarMart ওয়ালেট</p>
              </div>
              <p className="mt-1 text-lg tracking-widest text-white font-black">
                {showWallet ? walletBalance : "••••••••"}
              </p>
            </div>
            <div className="flex items-center gap-2">
              <button 
                onClick={() => setShowWallet(!showWallet)}
                className="p-2 hover:bg-white/10 rounded-xl transition-colors text-zinc-400 hover:text-white"
                title={showWallet ? "ব্যালেন্স লুকান" : "ব্যালেন্স দেখুন"}
              >
                {showWallet ? (
                  <Eye className="h-4 w-4 text-[#FF7A00]" />
                ) : (
                  <EyeOff className="h-4 w-4 text-zinc-500" />
                )}
              </button>
              <Link 
                to="/wallet"
                className="px-3 py-1.5 rounded-xl bg-[#FF7A00] hover:bg-[#e06b00] text-white text-[11px] font-black transition-colors"
              >
                টপ-আপ
              </Link>
            </div>
          </div>
        </div>

        {/* Promo Banner Card */}
        <div className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-indigo-950 via-purple-950 to-slate-900 p-6 shadow-xl border border-white/10 flex flex-col justify-between">
          <div className="absolute -right-6 -top-6 h-36 w-36 rounded-full bg-[#FF7A00]/20 blur-2xl pointer-events-none" />
          <div className="relative z-10">
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#FF7A00]/20 text-[#FF7A00] border border-[#FF7A00]/30 text-[10px] font-black uppercase tracking-wider mb-2">
              <Sparkles className="h-3 w-3" /> পাইকারি মেগা অফার
            </div>
            <h2 className="text-xl font-black text-white leading-tight mt-1">
              সরাসরি কারখানা থেকে হোলসেল লট
            </h2>
            <p className="mt-1.5 text-xs text-zinc-300 line-clamp-2">
              ন্যূনতম MOQ এবং ফ্যাক্টরি পাইকারি মূল্যে সারা বাংলাদেশে ক্যাশ অন ডেলিভারি।
            </p>
          </div>
          
          <div className="relative z-10 mt-6 flex items-center gap-3">
            <Link 
              to="/wholesale" 
              className="inline-flex items-center justify-center gap-2 rounded-2xl bg-[#FF7A00] px-5 py-2.5 text-xs font-black text-white hover:bg-[#e06b00] transition-colors shadow-lg shadow-[#FF7A00]/25 active:scale-95"
            >
              পাইকারি বাজার <ArrowRight className="h-3.5 w-3.5" />
            </Link>
            <Link 
              to="/demand" 
              className="inline-flex items-center justify-center gap-1.5 rounded-2xl bg-white/10 px-4 py-2.5 text-xs font-bold text-white hover:bg-white/20 transition-colors border border-white/10"
            >
              <Tag className="h-3.5 w-3.5 text-[#FF7A00]" /> ডিমান্ড দিন
            </Link>
          </div>
        </div>
      </div>

      {/* Super App Portals & Hubs Grid */}
      <section className="bg-[#141624] border border-white/5 rounded-3xl p-5 shadow-xl">
        <div className="flex items-center justify-between mb-5">
          <div>
            <h2 className="text-base font-black text-white flex items-center gap-2">
              <Sparkles className="h-4 w-4 text-[#FF7A00]" /> PaikarMart Super Hubs
            </h2>
            <p className="text-[11px] text-zinc-400">সকল সেবা ও কমার্স হাব এক প্ল্যাটফর্মে</p>
          </div>
          <span className="text-[10px] font-bold text-zinc-500 uppercase tracking-wider">
            ১৫টি মডিউল
          </span>
        </div>

        <div className="grid grid-cols-4 sm:grid-cols-5 md:grid-cols-7 gap-y-6 gap-x-2">
          <AppIcon icon={ShoppingBag} label="Marketplace" bangla="মার্কেটপ্লেস" gradient="from-blue-500 to-indigo-600" href="/marketplace" />
          <AppIcon icon={Building2} label="Wholesale" bangla="পাইকারি" gradient="from-amber-500 to-[#FF7A00]" href="/wholesale" badge="B2B" />
          <AppIcon icon={Film} label="Video & OTT" bangla="ভিডিও হাব" gradient="from-rose-500 to-pink-600" href="/video" badge="New" />
          <AppIcon icon={Radio} label="Live & Shorts" bangla="লাইভ স্ট্রিম" gradient="from-red-600 to-rose-700" href="/video/shorts" />
          <AppIcon icon={Tag} label="Demand Hub" bangla="ডিমান্ড পোস্ট" gradient="from-orange-500 to-amber-600" href="/demand" />
          <AppIcon icon={Wrench} label="Services" bangla="সার্ভিসেস" gradient="from-emerald-500 to-teal-600" href="/services" />
          <AppIcon icon={Truck} label="Logistics" bangla="রাইড ও কুরিয়ার" gradient="from-amber-600 to-yellow-600" href="/logistic" />
          
          <AppIcon icon={MapPin} label="Nearby Shops" bangla="লোকাল হাব" gradient="from-purple-500 to-indigo-600" href="/local" />
          <AppIcon icon={Monitor} label="Digital Goods" bangla="ডিজিটাল" gradient="from-cyan-500 to-blue-600" href="/digital" />
          <AppIcon icon={Box} label="Orders" bangla="অর্ডার ট্র্যাকিং" gradient="from-sky-500 to-blue-600" href="/orders" />
          <AppIcon icon={Wallet} label="Wallet" bangla="ওয়ালেট" gradient="from-emerald-600 to-green-600" href="/wallet" />
          <AppIcon icon={MessageSquare} label="Messages" bangla="মেসেজ" gradient="from-blue-600 to-indigo-700" href="/messages" />
          <AppIcon icon={LayoutDashboard} label="Seller Hub" bangla="সেলার সেন্ট্রাল" gradient="from-orange-600 to-amber-600" href="/seller-central" badge="Pro" />
          <AppIcon icon={ShieldCheck} label="Client Vault" bangla="কেওয়াইসি ভল্ট" gradient="from-zinc-700 to-zinc-800" href="/vault" />
        </div>
      </section>

      {/* Featured Categories */}
      <section className="mt-2">
        <div className="flex items-center justify-between mb-4">
          <div>
            <h2 className="text-base font-black text-white">ফিচার্ড ক্যাটাগরি</h2>
            <p className="text-[11px] text-zinc-400">জনপ্রিয় পাইকারি ও খুচরা ক্যাটাগরি ব্রাউজ করুন</p>
          </div>
          <Link to="/marketplace" className="text-xs font-black text-[#FF7A00] flex items-center gap-1 hover:underline">
            সব দেখুন <ArrowRight className="h-3.5 w-3.5" />
          </Link>
        </div>
        
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {FEATURED_CATEGORIES.map((cat) => {
            const Icon = cat.icon;
            return (
              <Link 
                key={cat.id} 
                to={cat.link}
                className="group relative overflow-hidden rounded-3xl bg-[#141624] border border-white/5 p-5 shadow-lg hover:border-white/15 transition-all duration-300 flex flex-col justify-between"
              >
                <div className={`absolute -right-6 -bottom-6 w-28 h-28 bg-gradient-to-br ${cat.bgGradient} rounded-full blur-2xl group-hover:scale-125 transition-transform duration-500 pointer-events-none`} />
                <div>
                  <div className="flex items-center justify-between mb-4">
                    <div className={`p-3 rounded-2xl bg-white/5 border border-white/10 ${cat.accentColor} group-hover:scale-110 transition-transform`}>
                      <Icon className="h-6 w-6" />
                    </div>
                    <span className="text-[10px] font-bold text-zinc-400 bg-white/5 px-2.5 py-1 rounded-full border border-white/5">
                      {cat.itemsCount}
                    </span>
                  </div>
                  <h3 className="text-sm font-black text-white group-hover:text-[#FF7A00] transition-colors">
                    {cat.nameBn}
                  </h3>
                  <p className="text-xs text-zinc-400 mt-0.5">
                    {cat.nameEn}
                  </p>
                </div>
                
                <div className="mt-4 pt-3 border-t border-white/5 flex items-center justify-between text-xs font-bold text-zinc-400 group-hover:text-white transition-colors">
                  <span>পণ্য দেখুন</span>
                  <ArrowRight className="h-3.5 w-3.5 group-hover:translate-x-1 transition-transform text-[#FF7A00]" />
                </div>
              </Link>
            );
          })}
        </div>
      </section>
    </div>
  );
}

function AppIcon({ 
  icon: Icon, 
  label, 
  bangla, 
  gradient, 
  href,
  badge
}: { 
  icon: any; 
  label: string; 
  bangla?: string; 
  gradient: string; 
  href: string;
  badge?: string;
}) {
  return (
    <Link to={href} className="flex flex-col items-center gap-1.5 group text-center relative">
      <div className={`relative flex h-14 w-14 md:h-16 md:w-16 items-center justify-center rounded-2xl md:rounded-[22px] bg-gradient-to-br ${gradient} shadow-lg transition-all group-hover:scale-105 active:scale-95 border border-white/10`}>
        <Icon className="h-6 w-6 md:h-7 md:w-7 text-white" strokeWidth={2} />
        {badge && (
          <span className="absolute -top-1.5 -right-1 px-1.5 py-0.5 rounded-full bg-black/80 backdrop-blur-md text-[9px] font-black text-[#FF7A00] border border-[#FF7A00]/30 shadow-md">
            {badge}
          </span>
        )}
      </div>
      <div className="flex flex-col">
        <span className="text-[11px] font-black text-zinc-200 group-hover:text-white transition-colors leading-tight truncate max-w-[72px]">
          {label}
        </span>
        {bangla && (
          <span className="text-[9px] text-zinc-500 truncate max-w-[72px] mt-0.5">
            {bangla}
          </span>
        )}
      </div>
    </Link>
  );
}
