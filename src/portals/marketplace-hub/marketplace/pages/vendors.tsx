import * as React from "react";
import { useState } from "react";
import { motion } from "motion/react";
import { useListVendors, getListVendorsQueryKey } from "@/modules/app/api/client/hooks";
import { Link } from "react-router-dom";
import {
  Search, Star, MapPin, Users, BadgeCheck, Filter,
  Store, Truck, Wrench, Building2, Sparkles, TrendingUp,
  ShoppingBag, Globe, ChevronRight, Zap
} from "lucide-react";
import { StoryBar } from "@shared/StoryBar";
import { CategoryNavBar } from "@shared/CategoryNavBar";
import { cn } from "@/lib/utils";

const TYPE_META: Record<string, { label: string; icon: React.ElementType; color: string; gradient: string }> = {
  seller:         { label: "Seller",          icon: Store,     color: "text-cyan-400",    gradient: "from-cyan-500/20 to-blue-600/10" },
  wholesaler:     { label: "Wholesaler",       icon: Building2, color: "text-blue-400",    gradient: "from-blue-500/20 to-indigo-600/10" },
  manufacturer:   { label: "Manufacturer",     icon: Building2, color: "text-purple-400",  gradient: "from-purple-500/20 to-violet-600/10" },
  service_provider:{ label: "Service Provider",icon: Wrench,    color: "text-amber-400",   gradient: "from-amber-500/20 to-orange-600/10" },
  logistics:      { label: "Logistics",        icon: Truck,     color: "text-cyan-400", gradient: "from-cyan-500/20 to-green-600/10" },
  exporter:       { label: "Exporter",         icon: Globe,     color: "text-lime-400",    gradient: "from-lime-500/20 to-green-600/10" },
  retailer:       { label: "Retailer",         icon: ShoppingBag, color: "text-rose-400",  gradient: "from-rose-500/20 to-pink-600/10" },
};

const STAT_TILES = [
  { label: "Active Vendors", value: "24,000+", icon: Store, color: "text-cyan-400" },
  { label: "Verified Sellers", value: "8,400+", icon: BadgeCheck, color: "text-cyan-400" },
  { label: "Districts Covered", value: "64", icon: MapPin, color: "text-violet-400" },
];

export default function Vendors() {
  const [search, setSearch] = useState("");
  const [activeType, setActiveType] = useState<string>("all");
  const { data: vendors, isLoading } = useListVendors({}, { query: { queryKey: getListVendorsQueryKey() } });

  const allTypes = ["all", ...Object.keys(TYPE_META)];

  const filtered = vendors?.filter((v: any) => {
    const matchType = activeType === "all" || v.type === activeType;
    const q = search.toLowerCase();
    const matchSearch = !q || v.name.toLowerCase().includes(q) || (v.location || "").toLowerCase().includes(q);
    return matchType && matchSearch;
  });

  const topRated = filtered?.filter((v: any) => v.rating >= 4.5).slice(0, 4);
  const rest = filtered?.filter((v: any) => v.rating < 4.5);

  return (
    <div className="flex flex-col gap-6 pb-28 pt-0 px-0">
      <section className="mt-2 text-[var(--pm-text)]">
        <StoryBar context="vendors" />
      </section>
      <div className="sticky top-16 z-40 bg-[var(--pm-bg)]/90 backdrop-blur-lg border-b border-[var(--pm-border)]/40 px-4">
        <CategoryNavBar context="vendors" />
      </div>

      <div className="px-4 mt-4">
        {/* Hero */}
        <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }}
          className="relative overflow-hidden rounded-3xl border border-violet-500/20 p-5 bg-gradient-to-br from-violet-900/20 via-[var(--pm-surface)]/60 to-[var(--pm-bg)] mb-4"
        >
          <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top_right,rgba(139,92,246,0.12)_0%,transparent_60%)]" />
          <div className="relative z-10 flex items-center gap-3 mb-3">
            <div className="w-12 h-12 rounded-2xl bg-violet-500/20 border border-violet-500/30 flex items-center justify-center text-2xl">🏪</div>
            <div>
              <h1 className="text-base font-black text-white">Vendor Directory</h1>
              <p className="text-[11px] text-zinc-400">Sellers, wholesalers & manufacturers across BD</p>
            </div>
          </div>
          <div className="relative z-10 grid grid-cols-3 gap-2">
            {STAT_TILES.map(({ label, value, icon: Icon, color }) => (
              <div key={label} className="flex flex-col items-center gap-1 p-2.5 rounded-2xl bg-white/[0.03] border border-white/[0.05] text-center">
                <Icon className={cn("w-4 h-4", color)} />
                <p className={cn("text-[11px] font-black", color)}>{value}</p>
                <p className="text-[8px] text-zinc-600">{label}</p>
              </div>
            ))}
          </div>
        </motion.div>

        {/* Search */}
        <div className="flex items-center gap-2 mb-4">
          <div className="flex-1 flex items-center gap-2 p-3 rounded-2xl bg-[var(--pm-surface)]/50 border border-white/[0.06] focus-within:border-violet-500/40 transition-all">
            <Search className="w-4 h-4 text-zinc-600 shrink-0" />
            <input type="text" value={search} onChange={e => setSearch(e.target.value)} placeholder="Search vendors, location..." className="bg-transparent flex-1 text-[12px] text-white placeholder-zinc-600 outline-none" />
          </div>
          <button className="w-11 h-11 rounded-2xl bg-violet-500/10 border border-violet-500/20 flex items-center justify-center">
            <Filter className="w-4 h-4 text-violet-400" />
          </button>
        </div>

        {/* Type Filters */}
        <div className="flex gap-2 overflow-x-auto no-scrollbar mb-5 pb-1">
          {allTypes.map(type => {
            const meta = TYPE_META[type];
            const Icon = meta?.icon || Store;
            return (
              <button key={type} onClick={() => setActiveType(type)} className={cn("flex items-center gap-1.5 px-3 py-2 rounded-2xl text-[11px] font-black whitespace-nowrap border transition-all", activeType === type ? "bg-violet-500/15 border-violet-500/30 text-violet-400" : "bg-white/[0.02] border-white/[0.05] text-zinc-500 hover:border-white/[0.12]")}>
                {type === "all" ? <Sparkles className="w-3 h-3" /> : <Icon className="w-3 h-3" />}
                {type === "all" ? "All" : meta?.label || type}
              </button>
            );
          })}
        </div>

        {/* Loading State */}
        {isLoading && (
          <div className="space-y-3">
            {Array.from({ length: 5 }).map((_, i) => (
              <div key={i} className="h-20 rounded-2xl skeleton-shimmer" />
            ))}
          </div>
        )}

        {/* Top Rated */}
        {!isLoading && topRated && topRated.length > 0 && (
          <div className="mb-5">
            <div className="flex items-center gap-2 mb-2">
              <TrendingUp className="w-3.5 h-3.5 text-amber-400" />
              <p className="text-[10px] font-black text-zinc-500 uppercase tracking-widest">Top Rated</p>
            </div>
            <div className="flex gap-3 overflow-x-auto no-scrollbar pb-2">
              {topRated.map((vendor: any) => (
                <Link key={vendor.id} to={`/vendors/${vendor.id}`}>
                  <motion.div whileTap={{ scale: 0.96 }} className="shrink-0 w-44 overflow-hidden rounded-2xl border border-white/[0.06] bg-white/[0.02] hover:border-white/[0.12] transition-all">
                    <div className="h-20 relative overflow-hidden">
                      {vendor.coverUrl ? <img src={vendor.coverUrl} alt="" className="w-full h-full object-cover opacity-60" loading="lazy" /> : <div className="w-full h-full bg-gradient-to-br from-violet-500/10 to-blue-600/10" />}
                      <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
                      <div className="absolute bottom-1.5 left-1.5">
                        <div className="w-10 h-10 rounded-xl border-2 border-[var(--pm-bg)] overflow-hidden bg-zinc-800">
                          {vendor.avatarUrl && <img src={vendor.avatarUrl} alt="" className="w-full h-full object-cover" loading="lazy" />}
                        </div>
                      </div>
                      {vendor.verified && (
                        <div className="absolute top-1.5 right-1.5 w-5 h-5 rounded-full bg-cyan-500 flex items-center justify-center">
                          <BadgeCheck className="w-3 h-3 text-white" />
                        </div>
                      )}
                    </div>
                    <div className="p-2.5">
                      <p className="text-[11px] font-black text-white truncate">{vendor.name}</p>
                      <div className="flex items-center gap-1 mt-0.5">
                        <Star className="w-3 h-3 text-amber-400 fill-amber-400" />
                        <span className="text-[9px] text-zinc-400">{vendor.rating?.toFixed(1)}</span>
                        <span className="text-[9px] text-zinc-600">· {vendor.followers} followers</span>
                      </div>
                      {vendor.location && (
                        <div className="flex items-center gap-1 mt-0.5">
                          <MapPin className="w-2.5 h-2.5 text-zinc-600" />
                          <p className="text-[9px] text-zinc-600 truncate">{vendor.location}</p>
                        </div>
                      )}
                    </div>
                  </motion.div>
                </Link>
              ))}
            </div>
          </div>
        )}

        {/* All Vendors List */}
        {!isLoading && (
          <div>
            <div className="flex items-center justify-between mb-3">
              <p className="text-[10px] font-black text-zinc-600 uppercase tracking-widest">{filtered?.length || 0} Vendors</p>
            </div>
            <div className="space-y-2.5">
              {(rest ?? filtered ?? []).map((vendor: any, i: number) => {
                const meta = TYPE_META[vendor.type ?? 'seller'] || TYPE_META.seller;
                const Icon = meta.icon;
                return (
                  <motion.div key={vendor.id} initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.025 }}>
                    <Link to={`/vendors/${vendor.id}`}>
                      <div className="flex items-center gap-3 p-3.5 rounded-2xl bg-white/[0.02] border border-white/[0.05] hover:border-white/[0.10] transition-all">
                        <div className="relative shrink-0">
                          <div className="w-12 h-12 rounded-2xl overflow-hidden bg-zinc-800 border border-white/[0.06]">
                            {vendor.avatarUrl ? <img src={vendor.avatarUrl} alt="" className="w-full h-full object-cover" loading="lazy" /> : (
                              <div className={cn("w-full h-full flex items-center justify-center bg-gradient-to-br", meta.gradient)}>
                                <Icon className={cn("w-5 h-5", meta.color)} />
                              </div>
                            )}
                          </div>
                          {vendor.verified && (
                            <div className="absolute -bottom-1 -right-1 w-4 h-4 rounded-full bg-cyan-500 border border-[var(--pm-bg)] flex items-center justify-center">
                              <BadgeCheck className="w-2.5 h-2.5 text-white" />
                            </div>
                          )}
                        </div>
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center gap-1.5">
                            <p className="text-[12px] font-black text-white truncate">{vendor.name}</p>
                          </div>
                          <p className="text-[9px] text-zinc-500 mt-0.5 truncate">{vendor.tagline}</p>
                          <div className="flex items-center gap-2 mt-1.5 flex-wrap">
                            <div className={cn("flex items-center gap-1 px-1.5 py-0.5 rounded-md border text-[8px] font-black", `${meta.color} border-current/20 bg-current/5`)}>
                              <Icon className="w-2.5 h-2.5" />
                              {meta.label}
                            </div>
                            <div className="flex items-center gap-0.5">
                              <Star className="w-3 h-3 text-amber-400 fill-amber-400" />
                              <span className="text-[9px] text-zinc-400">{vendor.rating?.toFixed(1)}</span>
                            </div>
                            {vendor.location && (
                              <div className="flex items-center gap-0.5">
                                <MapPin className="w-2.5 h-2.5 text-zinc-600" />
                                <span className="text-[9px] text-zinc-600 truncate">{vendor.location}</span>
                              </div>
                            )}
                          </div>
                        </div>
                        <div className="shrink-0 flex flex-col items-end gap-1">
                          <div className="flex items-center gap-0.5 text-zinc-600">
                            <Users className="w-3 h-3" />
                            <span className="text-[9px]">{vendor.followers?.toLocaleString()}</span>
                          </div>
                          <ChevronRight className="w-4 h-4 text-zinc-700" />
                        </div>
                      </div>
                    </Link>
                  </motion.div>
                );
              })}
              {!isLoading && !filtered?.length && (
                <div className="py-16 text-center">
                  <Store className="w-10 h-10 text-zinc-700 mx-auto mb-3" />
                  <p className="text-[13px] font-black text-zinc-600">No vendors found</p>
                  <p className="text-[11px] text-zinc-700 mt-1">Try a different search or type</p>
                </div>
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
