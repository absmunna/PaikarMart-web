import React, { useState, useEffect } from "react";
import { 
  Sparkles, Clock, Flame, Tag, Percent, ArrowRight, 
  ShoppingBag, Check, Copy, ShieldCheck, ChevronRight,
  Filter, Zap, BadgePercent, Gift
} from "lucide-react";
import { motion, AnimatePresence } from "motion/react";
import { useCartStore } from "../modules/cart/store/useCartStore";
import { Link } from "react-router-dom";

interface DealItem {
  id: string;
  title: string;
  category: "flash" | "wholesale" | "cashback" | "clearance";
  categoryLabel: string;
  storeName: string;
  originalPrice: number;
  dealPrice: number;
  discountPct: number;
  claimedPct: number;
  imageUrl: string;
  isWholesale?: boolean;
  moq?: number;
  endsIn: string;
}

const MOCK_DEALS: DealItem[] = [
  {
    id: "deal-1",
    title: "T900 Ultra Smartwatch 2.09'' HD Screen (Waterproof)",
    category: "flash",
    categoryLabel: "Flash Sale",
    storeName: "Gadget Arena BD",
    originalPrice: 1850,
    dealPrice: 890,
    discountPct: 52,
    claimedPct: 84,
    imageUrl: "https://images.unsplash.com/photo-1508685096489-7aacd43bd3b1?w=500",
    endsIn: "04:22:15"
  },
  {
    id: "deal-2",
    title: "100% Export Cotton Casual Half Sleeve Polos (Assorted 50 pcs)",
    category: "wholesale",
    categoryLabel: "Wholesale Bulk",
    storeName: "Dhaka Garments Syndicate",
    originalPrice: 280,
    dealPrice: 165,
    discountPct: 41,
    claimedPct: 62,
    imageUrl: "https://images.unsplash.com/photo-1521572267360-ee0c2909d518?w=500",
    isWholesale: true,
    moq: 50,
    endsIn: "12:45:00"
  },
  {
    id: "deal-3",
    title: "Sundarban Pure Natural Raw Honey 1000g Glass Jar",
    category: "cashback",
    categoryLabel: "bKash Cashback",
    storeName: "Organic Heritage",
    originalPrice: 1450,
    dealPrice: 1050,
    discountPct: 28,
    claimedPct: 45,
    imageUrl: "https://images.unsplash.com/photo-1587049352847-4a222e784d38?w=500",
    endsIn: "08:15:30"
  },
  {
    id: "deal-4",
    title: "Ergonomic High-Back Mesh Executive Office Chair",
    category: "clearance",
    categoryLabel: "Clearance",
    storeName: "FurniTech BD",
    originalPrice: 8500,
    dealPrice: 5200,
    discountPct: 39,
    claimedPct: 91,
    imageUrl: "https://images.unsplash.com/photo-1580481072645-022f9a6d1290?w=500",
    endsIn: "02:10:45"
  },
  {
    id: "deal-5",
    title: "LED Emergency Rechargeable Light with Solar Charging",
    category: "flash",
    categoryLabel: "Flash Sale",
    storeName: "Electra Zone",
    originalPrice: 950,
    dealPrice: 499,
    discountPct: 47,
    claimedPct: 78,
    imageUrl: "https://images.unsplash.com/photo-1550525811-e5869dd03032?w=500",
    endsIn: "05:30:10"
  },
  {
    id: "deal-6",
    title: "Premium Jute Multi-Purpose Tote Bags (Export Grade Lot)",
    category: "wholesale",
    categoryLabel: "Wholesale Bulk",
    storeName: "Eco Fiber Mills",
    originalPrice: 110,
    dealPrice: 65,
    discountPct: 41,
    claimedPct: 53,
    imageUrl: "https://images.unsplash.com/photo-1597484661643-2f5f6e71e16d?w=500",
    isWholesale: true,
    moq: 100,
    endsIn: "18:00:00"
  }
];

const VOUCHERS = [
  { code: "PAIKAR100", title: "৳100 Off First Order", desc: "Valid on retail orders over ৳600", tag: "New User" },
  { code: "BKASH20", title: "20% Cashback via bKash", desc: "Max cashback ৳150 on online checkout", tag: "bKash Exclusive" },
  { code: "WHOLESALE500", title: "৳500 Bulk Discount", desc: "Applicable on wholesale orders above ৳10,000", tag: "B2B Trade" },
];

export default function OffersPage() {
  const [selectedFilter, setSelectedFilter] = useState<string>("all");
  const [copiedCode, setCopiedCode] = useState<string | null>(null);
  const [timeLeft, setTimeLeft] = useState({ hours: 5, minutes: 42, seconds: 19 });
  const addItem = useCartStore((state) => state.addItem);
  const [addedItem, setAddedItem] = useState<string | null>(null);

  useEffect(() => {
    const timer = setInterval(() => {
      setTimeLeft(prev => {
        if (prev.seconds > 0) return { ...prev, seconds: prev.seconds - 1 };
        if (prev.minutes > 0) return { ...prev, minutes: 59, seconds: 59 };
        if (prev.hours > 0) return { hours: prev.hours - 1, minutes: 59, seconds: 59 };
        return { hours: 0, minutes: 0, seconds: 0 };
      });
    }, 1000);
    return () => clearInterval(timer);
  }, []);

  const handleCopy = (code: string) => {
    navigator.clipboard.writeText(code);
    setCopiedCode(code);
    setTimeout(() => setCopiedCode(null), 2500);
  };

  const handleAddToCart = (deal: DealItem) => {
    addItem({
      id: deal.id,
      title: deal.title,
      price: deal.dealPrice,
      image: deal.imageUrl,
      store: deal.storeName,
      isWholesale: deal.isWholesale,
      moq: deal.moq
    });
    setAddedItem(deal.id);
    setTimeout(() => setAddedItem(null), 2000);
  };

  const filteredDeals = selectedFilter === "all" 
    ? MOCK_DEALS 
    : MOCK_DEALS.filter(d => d.category === selectedFilter);

  return (
    <div className="px-4 py-6 md:px-8 md:py-10 max-w-7xl mx-auto space-y-10 pb-32">
      {/* Top Banner */}
      <div className="relative rounded-[2.5rem] p-8 md:p-12 bg-gradient-to-r from-[#141624] via-zinc-900 to-[#FF7A00]/15 border border-white/10 overflow-hidden shadow-2xl">
        <div className="absolute top-0 right-0 w-96 h-96 bg-[#FF7A00]/10 blur-[100px] pointer-events-none" />
        <div className="absolute bottom-0 left-0 w-64 h-64 bg-amber-500/10 blur-[80px] pointer-events-none" />
        
        <div className="relative z-10 flex flex-col lg:flex-row lg:items-center justify-between gap-8">
          <div className="space-y-4 max-w-2xl">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#FF7A00]/20 text-[#FF7A00] text-xs font-black uppercase tracking-widest border border-[#FF7A00]/30">
              <Flame className="h-4 w-4 fill-[#FF7A00]" /> Limited Time Offers
            </div>
            <h1 className="text-3xl md:text-5xl font-black text-white italic tracking-tight">
              Exclusive Deals & <span className="text-[#FF7A00]">Flash Discounts</span>
            </h1>
            <p className="text-zinc-400 text-sm md:text-base leading-relaxed">
              Discover verified daily price drops, bulk wholesale vouchers, and mobile payment cashbacks across Bangladesh.
            </p>
          </div>

          {/* Flash Timer Widget */}
          <div className="bg-[#0f111a]/80 backdrop-blur-md border border-white/10 rounded-3xl p-6 flex flex-col items-center justify-center shrink-0 min-w-[260px] text-center shadow-xl">
            <div className="flex items-center gap-2 text-xs font-black uppercase text-[#FF7A00] tracking-wider mb-3">
              <Clock className="h-4 w-4" /> Flash Sale Ends In
            </div>
            <div className="flex items-center gap-3">
              <div className="bg-zinc-800/90 border border-white/10 rounded-2xl px-4 py-2">
                <span className="text-2xl font-black text-white">{String(timeLeft.hours).padStart(2, "0")}</span>
                <span className="block text-[9px] font-bold text-zinc-400 uppercase">Hours</span>
              </div>
              <span className="text-2xl font-black text-[#FF7A00]">:</span>
              <div className="bg-zinc-800/90 border border-white/10 rounded-2xl px-4 py-2">
                <span className="text-2xl font-black text-white">{String(timeLeft.minutes).padStart(2, "0")}</span>
                <span className="block text-[9px] font-bold text-zinc-400 uppercase">Mins</span>
              </div>
              <span className="text-2xl font-black text-[#FF7A00]">:</span>
              <div className="bg-zinc-800/90 border border-white/10 rounded-2xl px-4 py-2">
                <span className="text-2xl font-black text-[#FF7A00] animate-pulse">{String(timeLeft.seconds).padStart(2, "0")}</span>
                <span className="block text-[9px] font-bold text-zinc-400 uppercase">Secs</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Discount Coupon Vouchers */}
      <div className="space-y-4">
        <div className="flex items-center justify-between px-1">
          <div className="flex items-center gap-2">
            <Gift className="h-5 w-5 text-amber-500" />
            <h2 className="text-xl font-black text-white italic tracking-tight">Active Platform Vouchers</h2>
          </div>
          <span className="text-xs text-zinc-500 font-bold">Tap code to copy</span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {VOUCHERS.map((v) => (
            <div key={v.code} className="relative bg-[#141624] border border-white/10 rounded-2xl p-5 flex flex-col justify-between group hover:border-[#FF7A00]/40 transition-all shadow-lg">
              <div className="space-y-2">
                <span className="text-[10px] font-black uppercase tracking-widest text-[#FF7A00] bg-[#FF7A00]/10 px-2 py-0.5 rounded-md border border-[#FF7A00]/20">
                  {v.tag}
                </span>
                <h3 className="text-base font-bold text-white mt-1">{v.title}</h3>
                <p className="text-xs text-zinc-400">{v.desc}</p>
              </div>

              <div className="mt-4 pt-3 border-t border-white/5 flex items-center justify-between">
                <span className="font-mono text-xs font-black text-[#FF7A00] bg-black/40 px-2.5 py-1 rounded-lg border border-dashed border-[#FF7A00]/40">
                  {v.code}
                </span>
                <button 
                  onClick={() => handleCopy(v.code)}
                  className="flex items-center gap-1.5 text-xs font-bold px-3 py-1 rounded-lg bg-white/5 hover:bg-[#FF7A00] text-zinc-300 hover:text-white transition-all"
                >
                  {copiedCode === v.code ? (
                    <>
                      <Check className="h-3.5 w-3.5 text-emerald-400" /> Copied!
                    </>
                  ) : (
                    <>
                      <Copy className="h-3.5 w-3.5" /> Copy Code
                    </>
                  )}
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Filter Tabs */}
      <div className="flex items-center gap-2 overflow-x-auto pb-2 custom-scrollbar">
        {[
          { id: "all", label: "All Offers", icon: Sparkles },
          { id: "flash", label: "Flash Sales", icon: Zap },
          { id: "wholesale", label: "Wholesale Bulk", icon: Tag },
          { id: "cashback", label: "bKash Cashbacks", icon: BadgePercent },
          { id: "clearance", label: "Clearance Lot", icon: Flame },
        ].map((tab) => (
          <button
            key={tab.id}
            onClick={() => setSelectedFilter(tab.id)}
            className={`flex items-center gap-2 px-5 py-2.5 rounded-xl text-xs font-bold whitespace-nowrap transition-all border ${
              selectedFilter === tab.id
                ? "bg-[#FF7A00] text-white border-[#FF7A00] shadow-md shadow-[#FF7A00]/20"
                : "bg-white/5 text-zinc-400 border-white/5 hover:bg-white/10 hover:text-white"
            }`}
          >
            <tab.icon className="h-3.5 w-3.5" />
            {tab.label}
          </button>
        ))}
      </div>

      {/* Deals Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredDeals.map((deal) => (
          <motion.div
            key={deal.id}
            layout
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-[#141624] border border-white/10 rounded-[2rem] overflow-hidden flex flex-col hover:border-[#FF7A00]/30 transition-all shadow-xl group"
          >
            {/* Image & Badges */}
            <div className="relative h-56 bg-zinc-800 overflow-hidden">
              <img 
                src={deal.imageUrl} 
                alt={deal.title} 
                className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" 
              />
              <div className="absolute inset-0 bg-gradient-to-t from-[#141624] via-transparent to-black/30" />
              
              <div className="absolute top-4 left-4 flex flex-col gap-1.5">
                <span className="bg-red-600 text-white font-black text-xs px-2.5 py-1 rounded-full shadow-lg">
                  -{deal.discountPct}% OFF
                </span>
                {deal.isWholesale && (
                  <span className="bg-amber-500 text-black font-black text-[10px] px-2 py-0.5 rounded-full uppercase tracking-wider">
                    MOQ: {deal.moq} pcs
                  </span>
                )}
              </div>

              <div className="absolute bottom-3 left-4 right-4 flex items-center justify-between text-xs text-white">
                <span className="bg-black/60 backdrop-blur-md px-2.5 py-1 rounded-lg font-mono font-bold flex items-center gap-1.5">
                  <Clock className="h-3.5 w-3.5 text-[#FF7A00]" /> {deal.endsIn}
                </span>
                <span className="text-zinc-300 font-medium text-[11px] truncate max-w-[140px]">{deal.storeName}</span>
              </div>
            </div>

            {/* Content */}
            <div className="p-6 flex flex-col flex-1 justify-between space-y-5">
              <div className="space-y-3">
                <h3 className="text-base font-bold text-white line-clamp-2 leading-snug group-hover:text-[#FF7A00] transition-colors">
                  {deal.title}
                </h3>

                {/* Price Display */}
                <div className="flex items-baseline gap-2.5">
                  <span className="text-2xl font-black text-[#FF7A00]">৳{deal.dealPrice.toLocaleString()}</span>
                  <span className="text-sm font-semibold text-zinc-500 line-through">৳{deal.originalPrice.toLocaleString()}</span>
                </div>

                {/* Claim Progress */}
                <div className="space-y-1.5 pt-1">
                  <div className="flex justify-between text-[11px] font-bold text-zinc-400">
                    <span>Sold: {deal.claimedPct}%</span>
                    <span className="text-amber-400">Almost Gone</span>
                  </div>
                  <div className="w-full h-2 rounded-full bg-zinc-800 overflow-hidden">
                    <div 
                      className="h-full bg-gradient-to-r from-amber-500 to-red-500 rounded-full"
                      style={{ width: `${deal.claimedPct}%` }}
                    />
                  </div>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="flex items-center gap-3 pt-2">
                <button
                  onClick={() => handleAddToCart(deal)}
                  className={`flex-1 py-3 px-4 rounded-xl text-xs font-bold transition-all flex items-center justify-center gap-2 ${
                    addedItem === deal.id 
                      ? "bg-emerald-500 text-white" 
                      : "bg-[#FF7A00] hover:bg-[#e06b00] text-white shadow-md shadow-[#FF7A00]/20"
                  }`}
                >
                  {addedItem === deal.id ? (
                    <>
                      <Check className="h-4 w-4" /> Added to Cart!
                    </>
                  ) : (
                    <>
                      <ShoppingBag className="h-4 w-4" /> Add to Cart
                    </>
                  )}
                </button>
                <Link
                  to={`/product/${deal.id}`}
                  className="p-3 rounded-xl bg-white/5 hover:bg-white/10 text-zinc-300 hover:text-white transition-colors border border-white/5"
                  title="View Details"
                >
                  <ArrowRight className="h-4 w-4" />
                </Link>
              </div>
            </div>
          </motion.div>
        ))}
      </div>
    </div>
  );
}
