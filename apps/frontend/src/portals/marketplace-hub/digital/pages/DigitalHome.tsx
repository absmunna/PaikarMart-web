import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Search, ArrowLeft, Laptop, Sparkles, Download, ShieldCheck, Clock } from "lucide-react";
import { HomeHeader } from "@/design-system/components/home/HomeHeader";
import { SubPortalNav } from "@/design-system/components/navigation/SubPortalNav";
import { ProductCard } from "@/design-system/components/ui/ProductCard";

const TYPES = ["সব", "eBook", "Course", "Template", "Software", "Music", "Art"];

interface DigitalProduct {
  id: number | string;
  name: string;
  price: string | number;
  rating: string | number;
  reviews: string | number;
  image: string;
  seller_type: string;
  location: string;
  type: string;
  portal?: string;
}

const mockProducts: DigitalProduct[] = [
  { id: 1, name: "React & TypeScript কোর্স", price: 999, rating: 4.9, reviews: 312, image: "https://images.unsplash.com/photo-1461749280684-dccba630e2f6?w=400&h=400&fit=crop", seller_type: "digital_seller", location: "অনলাইন", type: "Course", portal: "digital" },
  { id: 2, name: "গ্রাফিক ডিজাইন টেমপ্লেট প্যাক", price: 299, rating: 4.7, reviews: 189, image: "https://images.unsplash.com/photo-1561070791-2526d30994b5?w=400&h=400&fit=crop", seller_type: "digital_seller", location: "অনলাইন", type: "Template", portal: "digital" },
  { id: 3, name: "বাংলা ই-বুক সংকলন", price: 150, rating: 4.5, reviews: 78, image: "https://images.unsplash.com/photo-1507842217343-583bb7270b66?w=400&h=400&fit=crop", seller_type: "digital_seller", location: "অনলাইন", type: "eBook", portal: "digital" },
  { id: 4, name: "ওয়েব ডেভেলপমেন্ট স্টার্টার কিট", price: 499, rating: 4.8, reviews: 145, image: "https://images.unsplash.com/photo-1498050108023-c5249f4df085?w=400&h=400&fit=crop", seller_type: "digital_seller", location: "অনলাইন", type: "Software", portal: "digital" },
];

export default function DigitalHome() {
  const [search, setSearch] = useState("");
  const [activeType, setActiveType] = useState("সব");
  const navigate = useNavigate();

  const filtered = mockProducts.filter(p => {
    const matchSearch = p.name.toLowerCase().includes(search.toLowerCase());
    const matchType = activeType === "সব" || p.type === activeType;
    return matchSearch && matchType;
  });

  return (
    <div className="w-full pb-20 space-y-6 bg-[var(--pm-bg)] min-h-screen text-[var(--pm-text)] select-none">
      <HomeHeader />
      <SubPortalNav />

      <div className="max-w-7xl mx-auto px-4 md:px-8 space-y-8">
        {/* Digital Hero Banner */}
        <div className="relative rounded-3xl overflow-hidden border border-white/10 bg-gradient-to-br from-[#1a0c2e] via-[#120a1f] to-[#0a050f] p-6 sm:p-8 shadow-2xl">
          <div className="absolute right-0 bottom-0 w-80 h-80 bg-violet-500/10 rounded-full blur-3xl pointer-events-none" />

          <div className="max-w-2xl relative z-10 space-y-4">
            <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-violet-500/10 border border-violet-500/20 text-violet-400 text-[10px] font-black uppercase tracking-wider">
              <Laptop className="w-3.5 h-3.5" /> Premium Digital Assets
            </span>
            <h2 className="text-2xl sm:text-3xl font-black text-white leading-tight">
              সফটওয়্যার, কোর্স ও <span className="text-transparent bg-clip-text bg-gradient-to-r from-violet-400 to-purple-400">ডিজিটাল লাইসেন্স</span> মার্কেটপ্লেস
            </h2>
            <p className="text-zinc-300 text-xs sm:text-sm leading-relaxed">
              পেমেন্ট করা মাত্র তাৎক্ষণিক ইমেইলে ডাউনলোড লিঙ্ক ও লাইসেন্স কি সরবরাহ। কোনো ডেলিভারি চার্জ নেই, কোনো অপেক্ষা নেই।
            </p>
            <div className="flex flex-wrap gap-4 text-[10px] font-black text-violet-300">
              <span className="flex items-center gap-1"><Download className="w-3.5 h-3.5" /> Instant Download</span>
              <span className="flex items-center gap-1"><ShieldCheck className="w-3.5 h-3.5" /> Verified Licenses</span>
              <span className="flex items-center gap-1"><Clock className="w-3.5 h-3.5" /> 24/7 Support</span>
            </div>
          </div>
        </div>

        {/* Filters */}
        <div className="flex flex-col md:flex-row items-center gap-4 justify-between bg-[var(--pm-surface)] border border-[var(--pm-border)] rounded-3xl p-4">
          <div className="flex items-center bg-[var(--pm-bg)] px-3 py-1 rounded-2xl w-full md:w-80 h-11 border border-white/[0.04]">
            <Search className="w-4.5 h-4.5 text-zinc-500 mr-2.5 shrink-0" />
            <input
              type="text"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="ডিজিটাল পণ্য খুঁজুন..."
              className="w-full bg-transparent text-xs text-white placeholder:text-zinc-500 outline-none font-bold"
            />
          </div>

          <div className="flex items-center gap-2 overflow-x-auto no-scrollbar w-full md:w-auto">
            {TYPES.map((t) => (
              <button
                key={t}
                onClick={() => setActiveType(t)}
                className={`px-3.5 py-2 rounded-xl text-[10px] font-black shrink-0 border transition-all ${
                  activeType === t
                    ? "bg-violet-600 text-white border-violet-600"
                    : "bg-black/30 text-zinc-400 border-white/5 hover:text-white"
                }`}
              >
                {t}
              </button>
            ))}
          </div>
        </div>

        {/* Grid */}
        {filtered.length === 0 ? (
          <div className="py-24 text-center rounded-3xl bg-[var(--pm-surface)] border border-[var(--pm-border)]">
            <Laptop className="w-12 h-12 text-zinc-600 mb-3 mx-auto" />
            <p className="text-xs font-black text-white">দুঃখিত, কোনো ডিজিটাল পণ্য পাওয়া যায়নি!</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
            {filtered.map((p) => (
              <ProductCard
                key={p.id}
                product={{...p, portal: 'digital'}}
                activePortal="digital"
              />
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
