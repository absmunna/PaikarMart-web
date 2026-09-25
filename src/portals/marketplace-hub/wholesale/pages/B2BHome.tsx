import React, { useState, useMemo } from "react";
import { 
  Search, ArrowLeft, TrendingUp, Package, Users, ShieldCheck, 
  Building2, PlusCircle, Filter, ArrowUpRight, CheckCircle2, 
  Send, Sparkles, ShoppingBag, Layers, Percent, Clock
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { useNavigate, Link } from "react-router-dom";
import { useCartStore } from "@/modules/cart";
import { useCartDrawerStore } from "@/modules/cart/cartDrawerStore";
import { toast } from "sonner";
import { mockProducts } from "@/lib/workspace-stub";

interface B2BProduct {
  id: string;
  name: string;
  category: string;
  price: number;
  originalPrice: number;
  wholesalePrice?: number;
  moq: number;
  rating: number;
  reviews: number;
  image: string;
  tag: string;
  factoryName: string;
  location: string;
  verified: boolean;
  tierPricing?: { range: string; price: number }[];
}

const wholesaleProducts: B2BProduct[] = [
  {
    id: "b2b-01",
    name: "প্রিমিয়াম কম্বড কটন টি-শার্ট লট (১৮০ GSM)",
    category: "পোশাক ও টেক্সটাইল",
    price: 185,
    originalPrice: 350,
    moq: 50,
    rating: 4.9,
    reviews: 142,
    image: "https://images.unsplash.com/photo-1521572267360-ee0c2909d518?w=600",
    tag: "ফ্যাক্টরি ডিরেক্ট",
    factoryName: "কেরানীগঞ্জ নিটওয়্যার কমপ্লেক্স",
    location: "ঢাকা",
    verified: true,
    tierPricing: [
      { range: "৫০-১৯৯ পিস", price: 185 },
      { range: "২০০-৪৯৯ পিস", price: 170 },
      { range: "৫০০+ পিস", price: 155 }
    ]
  },
  {
    id: "b2b-02",
    name: "স্মার্ট ওয়াচ ও ব্লুটুথ হেডসেট কম্বো হোলসেল লট",
    category: "ইলেকট্রনিক্স",
    price: 490,
    originalPrice: 950,
    moq: 20,
    rating: 4.8,
    reviews: 98,
    image: "https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=600",
    tag: "ইমপোর্টার বাল্ক",
    factoryName: "মতিঝিল গ্যাজেট ইমপোর্ট সিন্ডিকেট",
    location: "ঢাকা",
    verified: true,
    tierPricing: [
      { range: "২০-৪৯ পিস", price: 490 },
      { range: "৫০-৯৯ পিস", price: 450 },
      { range: "১০০+ পিস", price: 420 }
    ]
  },
  {
    id: "b2b-03",
    name: "জেনুইন লেদার এক্সপোর্ট ফর্মাল জুতো (বাল্ক লট)",
    category: "চামড়াজাত পণ্য",
    price: 650,
    originalPrice: 1400,
    moq: 25,
    rating: 4.7,
    reviews: 76,
    image: "https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=600",
    tag: "এক্সপোর্ট কোয়ালিটি",
    factoryName: "হাজারীবাগ লেদার ওয়ার্কস",
    location: "ঢাকা",
    verified: true,
    tierPricing: [
      { range: "২৫-৭৪ জোড়া", price: 650 },
      { range: "৭৫-১৪৯ জোড়া", price: 610 },
      { range: "১৫০+ জোড়া", price: 575 }
    ]
  },
  {
    id: "b2b-04",
    name: "অর্গানিক সুন্দরবন খলিসা মধু (বাল্ক জার ৫০ কেজি)",
    category: "কৃষি ও খাদ্য",
    price: 520,
    originalPrice: 900,
    moq: 10,
    rating: 4.9,
    reviews: 184,
    image: "https://images.unsplash.com/photo-1587049352846-4a222e784d38?w=600",
    tag: "ফার্ম সোর্সড",
    factoryName: "সাতক্ষীরা ন্যাচারাল এগ্রো",
    location: "সাতক্ষীরা",
    verified: true,
    tierPricing: [
      { range: "১০-২৪ কেজি", price: 520 },
      { range: "২৫-৯৯ কেজি", price: 480 },
      { range: "১০০+ কেজি", price: 450 }
    ]
  },
  {
    id: "b2b-05",
    name: "প্রিমিয়াম করোগেটেড কার্টন ও প্যাকেজিং বক্স লট",
    category: "প্যাকেজিং",
    price: 18,
    originalPrice: 35,
    moq: 200,
    rating: 4.6,
    reviews: 64,
    image: "https://images.unsplash.com/photo-1589939705384-5185137a7f0f?w=600",
    tag: "ফ্যাক্টরি রেট",
    factoryName: "টঙ্গী পেপার অ্যান্ড প্যাকেজিং",
    location: "গাজীপুর",
    verified: true,
    tierPricing: [
      { range: "২০০-৯৯৯ পিস", price: 18 },
      { range: "১০০০-৪৯৯৯ পিস", price: 16 },
      { range: "৫০০০+ পিস", price: 14 }
    ]
  },
  {
    id: "b2b-06",
    name: "টাঙ্গাইল তাঁত শাড়ি হোলসেল বান্ডেল (১২ পিস প্যাক)",
    category: "পোশাক ও টেক্সটাইল",
    price: 850,
    originalPrice: 1600,
    moq: 12,
    rating: 4.8,
    reviews: 119,
    image: "https://images.unsplash.com/photo-1610030469983-98e550d6193c?w=600",
    tag: "তাঁত সমিতি",
    factoryName: "টাঙ্গাইল ঐতিহ্য তাঁত সমিতি",
    location: "টাঙ্গাইল",
    verified: true,
    tierPricing: [
      { range: "১২-৩৬ পিস", price: 850 },
      { range: "৩৭-৭২ পিস", price: 810 },
      { range: "৭৩+ পিস", price: 770 }
    ]
  },
  {
    id: "b2b-07",
    name: "মিনি ইউএসবি রিচার্জেবল ডেস্ক ফ্যান বাল্ক লট",
    category: "ইলেকট্রনিক্স",
    price: 240,
    originalPrice: 550,
    moq: 30,
    rating: 4.7,
    reviews: 92,
    image: "https://images.unsplash.com/photo-1563245372-f21724e3856d?w=600",
    tag: "হট সামার ডিল",
    factoryName: "নবাবপুর টেক ট্রেডার্স",
    location: "ঢাকা",
    verified: true,
    tierPricing: [
      { range: "৩০-৯৯ পিস", price: 240 },
      { range: "১০০-২৯৯ পিস", price: 220 },
      { range: "৩০০+ পিস", price: 195 }
    ]
  },
  {
    id: "b2b-08",
    name: "মিনিকেট চাল ৫০ কেজি বস্তা (মিল গেট রেট)",
    category: "কৃষি ও খাদ্য",
    price: 3100,
    originalPrice: 3600,
    moq: 10,
    rating: 4.8,
    reviews: 215,
    image: "https://images.unsplash.com/photo-1586201375761-83865001e31c?w=600",
    tag: "অটো রাইস মিল",
    factoryName: "কুষ্টিয়া অটো রাইস মিলস",
    location: "কুষ্টিয়া",
    verified: true,
    tierPricing: [
      { range: "১০-২৪ বস্তা", price: 3100 },
      { range: "২৫-৯৯ বস্তা", price: 3050 },
      { range: "১০০+ বস্তা", price: 2980 }
    ]
  }
];

const CATEGORIES = [
  "সব ক্যাটাগরি",
  "পোশাক ও টেক্সটাইল",
  "ইলেকট্রনিক্স",
  "কৃষি ও খাদ্য",
  "চামড়াজাত পণ্য",
  "প্যাকেজিং"
];

export const B2BHome: React.FC = () => {
  const navigate = useNavigate();
  const [search, setSearch] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("সব ক্যাটাগরি");
  const [isRfqOpen, setIsRfqOpen] = useState(false);
  const [rfqTitle, setRfqTitle] = useState("");
  const [rfqQty, setRfqQty] = useState("");
  const [rfqBudget, setRfqBudget] = useState("");
  const [rfqPhone, setRfqPhone] = useState("");
  const [isSubmittingRfq, setIsSubmittingRfq] = useState(false);

  const addItem = useCartStore((state) => state.addItem);
  const openCart = useCartDrawerStore((state) => state.open);

  const filteredProducts = useMemo(() => {
    return wholesaleProducts.filter((product) => {
      const matchSearch = product.name.toLowerCase().includes(search.toLowerCase()) ||
                          product.factoryName.toLowerCase().includes(search.toLowerCase());
      const matchCategory = selectedCategory === "সব ক্যাটাগরি" || product.category === selectedCategory;
      return matchSearch && matchCategory;
    });
  }, [search, selectedCategory]);

  const handleAddWholesaleToCart = (product: B2BProduct) => {
    addItem({
      id: product.id,
      name: `${product.name} (MOQ: ${product.moq} পিস লট)`,
      price: product.price * product.moq,
      image: product.image,
      portal: "wholesale",
      quantity: 1,
      sellerTier: "factory",
      vendorName: product.factoryName,
      moq: product.moq
    });
    toast.success(`পাইকারি কার্টে যোগ করা হয়েছে: ${product.moq} পিস লট (৳${(product.price * product.moq).toLocaleString()})`);
    openCart();
  };

  const handleSubmitRfq = (e: React.FormEvent) => {
    e.preventDefault();
    if (!rfqTitle || !rfqQty || !rfqPhone) {
      toast.error("দয়া করে প্রয়োজনীয় তথ্যগুলো পূরণ করুন");
      return;
    }

    setIsSubmittingRfq(true);
    setTimeout(() => {
      setIsSubmittingRfq(false);
      setIsRfqOpen(false);
      setRfqTitle("");
      setRfqQty("");
      setRfqBudget("");
      setRfqPhone("");
      toast.success("আপনার বাল্ক কোটেশন রিকোয়েস্ট (RFQ) ভেরিফাইড পাইকার ও মিলারদের নিকট পাঠানো হয়েছে!");
    }, 1200);
  };

  return (
    <div className="w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 pb-28 text-[var(--pm-text)]">
      
      {/* Top Header & Breadcrumb */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
        <div className="flex items-center gap-3">
          <button 
            onClick={() => navigate(-1)}
            className="w-10 h-10 rounded-2xl flex items-center justify-center bg-[var(--pm-surface)] hover:bg-[var(--pm-surface-hover)] border border-[var(--pm-border)] transition-all active:scale-95 text-[var(--pm-text)] shadow-xs"
          >
            <ArrowLeft className="w-5 h-5" />
          </button>
          <div>
            <div className="flex items-center gap-2">
              <span className="p-1.5 rounded-lg bg-blue-500/10 text-blue-400">
                <Building2 className="w-5 h-5" />
              </span>
              <h1 className="text-xl sm:text-2xl font-black tracking-tight">পাইকারি আড়ত ও বিটুবি মার্কেটপ্লেস</h1>
            </div>
            <p className="text-xs text-[var(--pm-text-muted)] mt-0.5">
              সরাসরি ফ্যাক্টরি ও আমদানিকারক রেট · বাল্ক কোটেশন · নিরাপদ এসক্রো পেমেন্ট
            </p>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex items-center gap-3">
          <button
            onClick={() => setIsRfqOpen(true)}
            className="px-4 py-2.5 rounded-xl bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-500 hover:to-indigo-500 text-white font-bold text-xs shadow-lg shadow-blue-500/20 active:scale-95 transition-all flex items-center gap-2"
          >
            <PlusCircle className="w-4 h-4" /> বাল্ক ডিমান্ড / RFQ পোস্ট
          </button>
          <Link
            to="/become-seller"
            className="px-4 py-2.5 rounded-xl bg-[var(--pm-surface)] hover:bg-[var(--pm-surface-hover)] border border-[var(--pm-border)] text-xs font-bold text-[var(--pm-text)] transition-colors hidden sm:flex items-center gap-1.5"
          >
            <Building2 className="w-4 h-4 text-blue-400" /> মিলার/সাপ্লায়ার হন
          </Link>
        </div>
      </div>

      {/* Hero Banner for Wholesale Sourcing */}
      <div className="relative rounded-3xl overflow-hidden border border-white/10 bg-gradient-to-r from-[#0b1329] via-[#101b3b] to-[#0f172a] p-6 sm:p-8 mb-8 shadow-2xl">
        <div className="absolute -right-12 -bottom-12 w-80 h-80 bg-blue-500/10 rounded-full blur-3xl pointer-events-none" />
        <div className="max-w-2xl relative z-10 space-y-3">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-blue-500/20 text-blue-300 text-xs font-black border border-blue-500/30 uppercase tracking-wider">
            <Sparkles className="w-3.5 h-3.5" /> বাংলাদেশ পাইকার মার্ট B2B হাব
          </div>
          <h2 className="text-2xl sm:text-3xl lg:text-4xl font-black text-white leading-tight">
            মাঝখানে কোনো দালাল নেই, <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-cyan-300">সরাসরি মিল-গেট মূল্যে</span> পণ্য সংগ্রহ করুন।
          </h2>
          <p className="text-zinc-300 text-xs sm:text-sm leading-relaxed max-w-xl">
            গার্মেন্টস ফেব্রিক, গ্যাজেট লট, এগ্রো কমোডিটি ও প্যাকেজিং ম্যাটেরিয়াল সাশ্রয়ী পাইকারি রেটে কিনুন। সাথে থাকছে পেইকার মার্ট গ্যারান্টিযুক্ত এসক্রো প্রটেকশন।
          </p>

          <div className="pt-2 flex flex-wrap items-center gap-4 text-xs text-zinc-300">
            <span className="flex items-center gap-1.5"><ShieldCheck className="w-4 h-4 text-emerald-400" /> ভেরিফাইড ফ্যাক্টরি ও আমদানিকারক</span>
            <span className="flex items-center gap-1.5"><CheckCircle2 className="w-4 h-4 text-blue-400" /> সর্বনিম্ন MOQ ফ্লেক্সিবিলিটি</span>
            <span className="flex items-center gap-1.5"><Clock className="w-4 h-4 text-amber-400" /> সারা দেশে ট্রাক ও কার্গো ডেলিভারি</span>
          </div>
        </div>
      </div>

      {/* KPI Stats Strip */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 sm:gap-4 mb-8">
        {[
          { label: "লিস্টেড ফ্যাক্টরি ও মিল", value: "৫২০+", desc: "ঢাকা, চট্টগ্রাম ও টঙ্গী", icon: Building2, color: "text-blue-400" },
          { label: "সরাসরি বাল্ক মূল্যছাড়", value: "৪০% পর্যন্ত", desc: "খুচরা বাজারের চেয়ে সাশ্রয়ী", icon: Percent, color: "text-emerald-400" },
          { label: "গড় MOQ ফ্লেক্সিবিলিটি", value: "২০-৫০ পিস", desc: "ছোট উদ্যোক্তাদের জন্য সুবিধাজনক", icon: Layers, color: "text-amber-400" },
          { label: "সফল বাল্ক সাপ্লাই", value: "১৮,০০০+", desc: "১০০% ভেরিফাইড ডেলিভারি", icon: ShieldCheck, color: "text-cyan-400" }
        ].map((stat, i) => (
          <div key={i} className="p-4 rounded-2xl bg-[var(--pm-surface)] border border-[var(--pm-border)] shadow-xs">
            <div className="flex items-center justify-between mb-2">
              <span className={`text-xs font-bold ${stat.color}`}>{stat.label}</span>
              <stat.icon className={`w-4 h-4 ${stat.color}`} />
            </div>
            <p className="text-xl sm:text-2xl font-black text-[var(--pm-text)]">{stat.value}</p>
            <p className="text-[10px] text-[var(--pm-text-muted)] mt-0.5">{stat.desc}</p>
          </div>
        ))}
      </div>

      {/* Search & Category Filter Bar */}
      <div className="space-y-4 mb-8">
        {/* Search Input */}
        <div className="relative">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-[var(--pm-text-muted)]" />
          <input
            type="text"
            placeholder="পণ্য বা ফ্যাক্টরির নাম দিয়ে পাইকারি আড়তে অনুসন্ধান করুন..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full h-12 sm:h-14 bg-[var(--pm-surface)] border border-[var(--pm-border)] rounded-2xl pl-12 pr-4 text-sm outline-none focus:border-blue-500 shadow-sm transition-all text-[var(--pm-text)] placeholder:text-[var(--pm-text-muted)]"
          />
        </div>

        {/* Category Pills */}
        <div className="flex gap-2 overflow-x-auto pb-2 no-scrollbar">
          {CATEGORIES.map((cat) => (
            <button
              key={cat}
              onClick={() => setSelectedCategory(cat)}
              className={`px-4 py-2 rounded-xl text-xs font-bold transition-all whitespace-nowrap border shrink-0 ${
                selectedCategory === cat
                  ? "bg-blue-600 text-white border-blue-600 shadow-md shadow-blue-500/20"
                  : "bg-[var(--pm-surface)] hover:bg-[var(--pm-surface-hover)] text-[var(--pm-text-muted)] hover:text-[var(--pm-text)] border-[var(--pm-border)]"
              }`}
            >
              {cat}
            </button>
          ))}
        </div>
      </div>

      {/* Products Grid - Multi-Column on Desktop */}
      {filteredProducts.length === 0 ? (
        <div className="py-20 text-center rounded-3xl bg-[var(--pm-surface)] border border-[var(--pm-border)]">
          <Package className="w-12 h-12 text-[var(--pm-text-muted)] mx-auto mb-3 opacity-40" />
          <h3 className="text-base font-bold text-[var(--pm-text)]">কোনো পাইকারি পণ্য পাওয়া যায়নি</h3>
          <p className="text-xs text-[var(--pm-text-muted)] mt-1">অন্য কি-ওয়ার্ড অথবা ক্যাটাগরি নির্বাচন করুন</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 sm:gap-6">
          {filteredProducts.map((product) => (
            <div
              key={product.id}
              className="group bg-[var(--pm-surface)] rounded-3xl border border-[var(--pm-border)] overflow-hidden hover:border-blue-500/50 hover:shadow-xl transition-all duration-300 flex flex-col justify-between"
            >
              <div>
                {/* Product Image & Badges */}
                <div className="aspect-[4/3] w-full relative overflow-hidden bg-black/20">
                  <img
                    src={product.image}
                    alt={product.name}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                  />
                  <span className="absolute top-3 left-3 bg-blue-600/90 backdrop-blur-md text-white text-[10px] font-black uppercase px-2.5 py-0.5 rounded-full border border-blue-400/30 shadow-md">
                    {product.tag}
                  </span>
                  <span className="absolute bottom-3 right-3 bg-black/75 backdrop-blur-md text-amber-400 text-[10px] font-black px-2.5 py-1 rounded-xl border border-amber-400/20">
                    MOQ: {product.moq} পিস
                  </span>
                </div>

                {/* Info Container */}
                <div className="p-4 space-y-3">
                  <div>
                    <div className="flex items-center gap-1.5 text-[10px] text-zinc-400 font-medium mb-1">
                      <Building2 className="w-3 h-3 text-blue-400" />
                      <span className="truncate">{product.factoryName}</span>
                      <span>• {product.location}</span>
                    </div>
                    <Link to={`/product/${product.id}`}>
                      <h3 className="text-sm font-bold text-[var(--pm-text)] line-clamp-2 group-hover:text-blue-400 transition-colors leading-snug">
                        {product.name}
                      </h3>
                    </Link>
                  </div>

                  {/* Pricing Details */}
                  <div className="p-3 rounded-2xl bg-[var(--pm-surface-hover)] border border-[var(--pm-border)]/50 space-y-1.5">
                    <div className="flex items-baseline justify-between">
                      <span className="text-[10px] text-[var(--pm-text-muted)] font-bold">পাইকারি রেট:</span>
                      <div className="flex items-baseline gap-1.5">
                        <span className="text-base font-black text-blue-400">৳{product.price}</span>
                        <span className="text-[10px] text-[var(--pm-text-muted)]">/ পিস</span>
                      </div>
                    </div>
                    <div className="flex items-center justify-between text-[11px] pt-1 border-t border-[var(--pm-border)]/40">
                      <span className="text-[var(--pm-text-muted)]">মোট লট প্রাইস:</span>
                      <span className="font-bold text-[var(--pm-text)]">৳{(product.price * product.moq).toLocaleString()}</span>
                    </div>
                  </div>

                  {/* Tier Pricing Snippet */}
                  {product.tierPricing && (
                    <div className="space-y-1">
                      <span className="text-[9px] font-black uppercase text-[var(--pm-text-muted)] tracking-wider">বাল্ক টিয়ার প্রাইসিং:</span>
                      <div className="grid grid-cols-3 gap-1 text-[9px] text-center">
                        {product.tierPricing.map((tier, idx) => (
                          <div key={idx} className="p-1 rounded-lg bg-[var(--pm-bg)] border border-[var(--pm-border)]/40">
                            <p className="text-[var(--pm-text-muted)] truncate">{tier.range}</p>
                            <p className="font-bold text-emerald-400">৳{tier.price}</p>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              </div>

              {/* Action Buttons */}
              <div className="p-4 pt-0 grid grid-cols-2 gap-2">
                <button
                  onClick={() => handleAddWholesaleToCart(product)}
                  className="w-full py-2.5 rounded-xl bg-blue-600 hover:bg-blue-500 text-white font-bold text-xs transition-colors flex items-center justify-center gap-1.5 shadow-sm active:scale-95"
                >
                  <ShoppingBag className="w-3.5 h-3.5" /> কার্টে নিন
                </button>
                <Link
                  to={`/product/${product.id}`}
                  className="w-full py-2.5 rounded-xl bg-[var(--pm-surface-hover)] hover:bg-[var(--pm-border)] border border-[var(--pm-border)] text-xs font-bold text-[var(--pm-text)] transition-colors flex items-center justify-center gap-1 text-center"
                >
                  বিস্তারিত <ArrowUpRight className="w-3.5 h-3.5" />
                </Link>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* RFQ / Bulk Demand Submission Modal */}
      <AnimatePresence>
        {isRfqOpen && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-sm">
            <motion.div
              initial={{ scale: 0.95, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.95, opacity: 0 }}
              className="w-full max-w-lg bg-[var(--pm-surface)] border border-[var(--pm-border)] rounded-3xl p-6 shadow-2xl relative"
            >
              <div className="flex items-center justify-between mb-4 pb-3 border-b border-[var(--pm-border)]">
                <div>
                  <h3 className="text-lg font-black text-[var(--pm-text)]">বাল্ক ডিমান্ড / RFQ কোটেশন পাঠান</h3>
                  <p className="text-xs text-[var(--pm-text-muted)] mt-0.5">আপনার চাহিদামতো পণ্য ভেরিফাইড মিলার ও পাইকারদের কাছ থেকে সংগ্রহ করুন</p>
                </div>
                <button
                  onClick={() => setIsRfqOpen(false)}
                  className="p-2 text-[var(--pm-text-muted)] hover:text-[var(--pm-text)] rounded-full hover:bg-[var(--pm-surface-hover)]"
                >
                  ✕
                </button>
              </div>

              <form onSubmit={handleSubmitRfq} className="space-y-4">
                <div>
                  <label className="block text-xs font-bold text-[var(--pm-text)] mb-1">প্রয়োজনীয় পণ্যের বিবরণ ও স্পেক্স *</label>
                  <input
                    type="text"
                    required
                    placeholder="যেমন: কটন টি-শার্ট ২০০ GSM অথবা মিনিকেট চাল ২০ বস্তা"
                    value={rfqTitle}
                    onChange={(e) => setRfqTitle(e.target.value)}
                    className="w-full bg-[var(--pm-surface-hover)] border border-[var(--pm-border)] rounded-xl px-4 py-2.5 text-xs text-[var(--pm-text)] outline-none focus:border-blue-500"
                  />
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="block text-xs font-bold text-[var(--pm-text)] mb-1">পরিমাণ (পিস / কেজি / বস্তা) *</label>
                    <input
                      type="text"
                      required
                      placeholder="যেমন: ১০০ পিস"
                      value={rfqQty}
                      onChange={(e) => setRfqQty(e.target.value)}
                      className="w-full bg-[var(--pm-surface-hover)] border border-[var(--pm-border)] rounded-xl px-4 py-2.5 text-xs text-[var(--pm-text)] outline-none focus:border-blue-500"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-bold text-[var(--pm-text)] mb-1">টার্গেট বাজেট (৳ আনুমানিক)</label>
                    <input
                      type="text"
                      placeholder="যেমন: ৳ ২০,০০০"
                      value={rfqBudget}
                      onChange={(e) => setRfqBudget(e.target.value)}
                      className="w-full bg-[var(--pm-surface-hover)] border border-[var(--pm-border)] rounded-xl px-4 py-2.5 text-xs text-[var(--pm-text)] outline-none focus:border-blue-500"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-bold text-[var(--pm-text)] mb-1">আপনার যোগাযোগের ফোন নম্বর *</label>
                  <input
                    type="tel"
                    required
                    placeholder="০১৭xxxxxxxx"
                    value={rfqPhone}
                    onChange={(e) => setRfqPhone(e.target.value)}
                    className="w-full bg-[var(--pm-surface-hover)] border border-[var(--pm-border)] rounded-xl px-4 py-2.5 text-xs text-[var(--pm-text)] outline-none focus:border-blue-500"
                  />
                </div>

                <div className="pt-2 flex items-center justify-end gap-3">
                  <button
                    type="button"
                    onClick={() => setIsRfqOpen(false)}
                    className="px-4 py-2.5 rounded-xl border border-[var(--pm-border)] text-xs font-bold text-[var(--pm-text-muted)] hover:text-[var(--pm-text)]"
                  >
                    বাতিল
                  </button>
                  <button
                    type="submit"
                    disabled={isSubmittingRfq}
                    className="px-6 py-2.5 rounded-xl bg-blue-600 hover:bg-blue-500 text-white text-xs font-bold flex items-center gap-2 shadow-lg shadow-blue-500/20 active:scale-95 transition-all disabled:opacity-50"
                  >
                    {isSubmittingRfq ? "পাঠানো হচ্ছে..." : "RFQ সাবমিট করুন"}
                    <Send className="w-3.5 h-3.5" />
                  </button>
                </div>
              </form>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

    </div>
  );
};
