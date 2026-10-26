import * as React from "react";
import { useState } from "react";
import { motion } from "motion/react";
import { useListCategories, getListCategoriesQueryKey } from "@/modules/app/api/client/hooks";
import { Link } from "react-router-dom";
import * as Icons from "lucide-react";
import { Search, Sparkles, TrendingUp, Package } from "lucide-react";
import { StoryBar } from "@shared/StoryBar";
import { CategoryNavBar } from "@shared/CategoryNavBar";
import { cn } from "@/lib/utils";

const CATEGORY_COLORS = [
  "from-cyan-500/20 to-blue-600/10 border-cyan-500/20 text-cyan-400",
  "from-violet-500/20 to-purple-600/10 border-violet-500/20 text-violet-400",
  "from-cyan-500/20 to-green-600/10 border-cyan-500/20 text-cyan-400",
  "from-orange-500/20 to-red-600/10 border-orange-500/20 text-orange-400",
  "from-pink-500/20 to-rose-600/10 border-pink-500/20 text-pink-400",
  "from-amber-500/20 to-yellow-600/10 border-amber-500/20 text-amber-400",
  "from-teal-500/20 to-cyan-600/10 border-teal-500/20 text-teal-400",
  "from-indigo-500/20 to-blue-600/10 border-indigo-500/20 text-indigo-400",
  "from-lime-500/20 to-green-600/10 border-lime-500/20 text-lime-400",
  "from-sky-500/20 to-blue-600/10 border-sky-500/20 text-sky-400",
];

const FEATURED_CATS = ["Electronics", "Fashion", "Groceries", "Mobile", "Home & Living", "Sports"];

export default function Categories() {
  const [search, setSearch] = useState("");
  const { data: categories, isLoading } = useListCategories({ query: { queryKey: getListCategoriesQueryKey() } });

  const filtered = categories?.filter((c: any) => !search || c.name.toLowerCase().includes(search.toLowerCase()));
  const featured = filtered?.filter((c: any) => FEATURED_CATS.some(f => c.name.toLowerCase().includes(f.toLowerCase())));
  const rest = filtered?.filter((c: any) => !FEATURED_CATS.some(f => c.name.toLowerCase().includes(f.toLowerCase())));

  return (
    <div className="flex flex-col gap-6 pb-28 pt-0">
      <section className="mt-2 text-[var(--pm-text)]">
        <StoryBar context="categories" />
      </section>
      <div className="sticky top-16 z-40 bg-[var(--pm-bg)]/90 backdrop-blur-lg border-b border-[var(--pm-border)]/40 px-0">
        <CategoryNavBar context="categories" />
      </div>

      <div className="mt-4">
        {/* Hero */}
        <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }}
          className="relative overflow-hidden rounded-3xl border border-cyan-500/20 p-5 bg-gradient-to-br from-cyan-900/15 via-[var(--pm-surface)]/60 to-[var(--pm-bg)] mb-4"
        >
          <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top_right,rgba(34,211,238,0.10)_0%,transparent_60%)]" />
          <div className="relative z-10 flex items-center gap-3 mb-3">
            <div className="w-12 h-12 rounded-2xl bg-cyan-500/20 border border-cyan-500/30 flex items-center justify-center">
              <Icons.Grid3X3 className="w-6 h-6 text-cyan-400" />
            </div>
            <div>
              <h1 className="text-base font-black text-white">All Categories</h1>
              <p className="text-[11px] text-zinc-400">{categories?.length || 0} categories · {categories?.reduce((s: number, c: any) => s + (c.productCount || 0), 0).toLocaleString()} products</p>
            </div>
          </div>
        </motion.div>

        {/* Search */}
        <div className="flex items-center gap-2 p-3 rounded-2xl bg-[var(--pm-surface)]/50 border border-white/[0.06] focus-within:border-cyan-500/40 transition-all mb-4">
          <Search className="w-4 h-4 text-zinc-600 shrink-0" />
          <input type="text" value={search} onChange={e => setSearch(e.target.value)} placeholder="Search categories..." className="bg-transparent flex-1 text-[12px] text-white placeholder-zinc-600 outline-none" />
        </div>

        {/* Loading State */}
        {isLoading && (
          <div className="grid grid-cols-3 gap-2">
            {Array.from({ length: 12 }).map((_, i) => <div key={i} className="h-24 rounded-2xl skeleton-shimmer" />)}
          </div>
        )}

        {/* Featured */}
        {!isLoading && featured && featured.length > 0 && !search && (
          <div className="mb-5">
            <div className="flex items-center gap-2 mb-2">
              <TrendingUp className="w-3.5 h-3.5 text-amber-400" />
              <p className="text-[10px] font-black text-zinc-500 uppercase tracking-widest">Popular Categories</p>
            </div>
            <div className="grid grid-cols-2 gap-2">
              {featured.map((cat: any, i: number) => {
                const IconComponent = (Icons as any)[cat.icon ?? ''] || Icons.Tag;
                const colorClass = CATEGORY_COLORS[i % CATEGORY_COLORS.length];
                const [gradient, , border, textColor] = colorClass.split(" ");
                return (
                  <Link key={cat.id} to={`/marketplace?categoryId=${cat.id}`}>
                    <motion.div initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} transition={{ delay: i * 0.05 }} whileTap={{ scale: 0.97 }}
                      className={cn("flex items-center gap-3 p-3.5 rounded-2xl border bg-gradient-to-br transition-all", gradient, border)}
                    >
                      <div className={cn("w-10 h-10 rounded-xl flex items-center justify-center bg-black/20")}>
                        <IconComponent className={cn("w-5 h-5", textColor)} />
                      </div>
                      <div>
                        <p className="text-[11px] font-black text-white">{cat.name}</p>
                        <p className="text-[9px] text-zinc-500 mt-0.5">{cat.productCount?.toLocaleString() || 0} items</p>
                      </div>
                    </motion.div>
                  </Link>
                );
              })}
            </div>
          </div>
        )}

        {/* All Categories Grid */}
        {!isLoading && (
          <div>
            <p className="text-[10px] font-black text-zinc-600 uppercase tracking-widest mb-3">{search ? `${filtered?.length || 0} Results` : "All Categories"}</p>
            <div className="grid grid-cols-3 gap-2">
              {(search ? filtered : rest)?.map((cat: any, i: number) => {
                const IconComponent = (Icons as any)[cat.icon ?? ''] || Icons.Tag;
                const colorClass = CATEGORY_COLORS[i % CATEGORY_COLORS.length];
                const [gradient, , border, textColor] = colorClass.split(" ");
                return (
                  <Link key={cat.id} to={`/marketplace?categoryId=${cat.id}`}>
                    <motion.div initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} transition={{ delay: i * 0.03 }} whileTap={{ scale: 0.95 }}
                      className={cn("flex flex-col items-center gap-2 p-3 rounded-2xl border bg-gradient-to-br transition-all text-center", gradient, border)}
                    >
                      <div className="w-10 h-10 rounded-xl flex items-center justify-center bg-black/20">
                        <IconComponent className={cn("w-5 h-5", textColor)} />
                      </div>
                      <p className="text-[10px] font-black text-white leading-tight">{cat.name}</p>
                      <p className="text-[8px] text-zinc-600">{cat.productCount?.toLocaleString() || 0}</p>
                    </motion.div>
                  </Link>
                );
              })}
              {!isLoading && !filtered?.length && (
                <div className="col-span-3 py-16 text-center">
                  <Package className="w-10 h-10 text-zinc-700 mx-auto mb-3" />
                  <p className="text-[13px] font-black text-zinc-600">No categories found</p>
                </div>
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
