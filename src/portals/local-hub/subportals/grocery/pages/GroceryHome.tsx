import * as React from "react";
import { useState } from "react";
import { motion } from "motion/react";
import { Search, Leaf } from "lucide-react";
import { useListProducts, getListProductsQueryKey } from "@/modules/app/api/client/hooks";
import { ProductGrid } from "@/features/product/components/ProductGrid";
import { StoryBar } from "@shared/StoryBar";
import { CategoryNavBar } from "@shared/CategoryNavBar";
import { useLanguage } from "@/features/language/LanguageContext";

const CATEGORIES = [
  { id: "all", label: "All Items", emoji: "🛒" },
  { id: "vegetables", label: "Vegetables", emoji: "🥦" },
  { id: "fruits", label: "Fruits", emoji: "🍎" },
  { id: "dairy", label: "Dairy & Eggs", emoji: "🥛" },
  { id: "meat", label: "Meat & Fish", emoji: "🐟" },
  { id: "grains", label: "Rice & Grains", emoji: "🌾" },
  { id: "spices", label: "Spices", emoji: "🌶️" },
  { id: "snacks", label: "Snacks", emoji: "🍿" },
  { id: "beverages", label: "Drinks", emoji: "🧃" },
];

export function GroceryHome() {
  const { isBn } = useLanguage();
  const [activeCategory, setActiveCategory] = useState("all");
  const [searchQuery, setSearchQuery] = useState("");

  const { data: products, isLoading } = useListProducts(
    { type: "grocery" },
    { query: { queryKey: getListProductsQueryKey({ type: "grocery" }) } }
  );

  const filteredProducts = products?.filter((p: any) => {
    let matches = true;
    if (activeCategory !== "all") {
      matches = p.category?.toLowerCase() === activeCategory.toLowerCase();
    }
    if (searchQuery) {
      matches = matches && p.name?.toLowerCase().includes(searchQuery.toLowerCase());
    }
    return matches;
  }) || [];

  return (
    <div className="min-h-screen bg-[var(--pm-bg)] pb-28 pt-0 max-w-7xl mx-auto px-4">
      <section className="pt-2"><StoryBar context="grocery" /></section>
      
      <div className="md:sticky top-16 z-40 bg-[var(--pm-bg)]/90 backdrop-blur-lg border-b border-[var(--pm-border)]/40 -mx-4 px-4 mt-2">
        <CategoryNavBar context="grocery" />
      </div>

      <div className="mt-4">
        {/* HERO */}
        <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }}
          className="relative overflow-hidden rounded-[28px] border border-cyan-500/20 p-5 bg-[#050D08] mb-4 shadow-xl"
        >
          <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top_right,rgba(16,185,129,0.1)_0%,transparent_60%)]" />
          <div className="relative z-10 flex items-center gap-4">
            <div className="w-14 h-14 rounded-2xl bg-cyan-500/10 border border-cyan-500/20 flex items-center justify-center shrink-0 shadow-inner">
              <Leaf className="w-7 h-7 text-cyan-400" />
            </div>
            <div>
              <div className="flex items-center gap-2 mb-1">
                <span className="px-2 py-0.5 rounded-full bg-cyan-500/10 border border-cyan-500/20 text-[9px] font-black text-cyan-400 uppercase tracking-widest">Fresh Grocery</span>
              </div>
              <h1 className="text-lg font-black text-white leading-tight">
                {isBn ? "তাজা বাজার" : "Daily Fresh Grocery"}
              </h1>
              <p className="text-[11px] text-zinc-500 font-bold mt-0.5">
                {isLoading ? "Loading..." : (isBn ? `${filteredProducts.length} টি আইটেম পাওয়া গেছে` : `${filteredProducts.length} items available`)}
              </p>
            </div>
          </div>
        </motion.div>

        {/* SEARCH */}
        <div className="mb-4">
          <div className="relative group">
            <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-zinc-500 group-focus-within:text-cyan-400 transition-colors" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder={isBn ? "মুদি পণ্য বা ব্র্যান্ড খুঁজুন..." : "Search groceries or brands..."}
              className="w-full h-12 bg-[#050D08] rounded-2xl border border-white/5 pl-10 pr-4 text-[12px] text-white placeholder:text-zinc-600 focus:outline-none focus:border-cyan-500/40 focus:ring-1 focus:ring-cyan-500/40 transition-all font-semibold shadow-inner"
            />
          </div>
        </div>

        {/* CATEGORIES */}
        <div className="flex gap-2 overflow-x-auto no-scrollbar mb-6 pb-2 -mx-4 px-4 snap-x">
          {CATEGORIES.map(cat => {
            const isActive = activeCategory === cat.id;
            return (
              <motion.button
                key={cat.id}
                whileTap={{ scale: 0.95 }}
                onClick={() => setActiveCategory(cat.id)}
                className={`snap-center shrink-0 flex items-center gap-2 px-4 py-2.5 rounded-2xl text-[11px] font-black transition-all border ${
                  isActive 
                    ? 'bg-cyan-500/10 border-cyan-500/30 text-cyan-400'
                    : 'bg-[#050D08] border-white/5 text-zinc-400 hover:bg-white/5'
                }`}
              >
                <span>{cat.emoji}</span>
                <span className="uppercase tracking-widest">{cat.label}</span>
              </motion.button>
            );
          })}
        </div>

        <ProductGrid 
          products={filteredProducts} 
          isLoading={isLoading} 
          emptyMessage={searchQuery ? "No matching grocery items found." : "No grocery items available in this category yet."}
        />
      </div>
    </div>
  );
}
