import * as React from "react";
import { useState } from "react";
import { useParams, Link } from "react-router-dom";
import { motion, AnimatePresence } from "motion/react";
import {
  useGetVendor,
  getGetVendorQueryKey,
} from "@/modules/app/api/client/hooks";
import { ProductGrid } from "@/features/product/components/ProductGrid";
import { ProductCard } from "@/components/ui/ProductCard";
import { UniversalFeedCard } from "@/modules/social/components/UniversalFeedCard";
import { mapPostToFeedItem } from "@/modules/social/utils/mappers";
import { useFeedStore } from "@/modules/social/store/useFeedStore";
import {
  MapPin,
  Star,
  Users,
  BadgeCheck,
  Mail,
  Share2,
  Heart,
  Bell,
  MessageSquare,
  Store,
  ShoppingBag,
  ChevronRight,
  Package,
  BarChart3,
  Calendar,
  ArrowLeft,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { toast } from "sonner";

export default function VendorDetail() {
  const { id } = useParams<{ id: string }>();
  const { toggleLike } = useFeedStore();
  const { data: vendor, isLoading } = useGetVendor(id ?? "", {
    query: { queryKey: getGetVendorQueryKey(id ?? ""), enabled: !!id },
  });
  const [tab, setTab] = useState<"products" | "posts" | "about">("products");
  const [followed, setFollowed] = useState(false);

  if (isLoading || !vendor) {
    return (
      <div className="min-h-screen bg-[#010804] pt-16 flex flex-col items-center">
        <div className="w-full max-w-[480px]">
          <div className="h-52 bg-white/[0.03] animate-pulse" />
          <div className="px-5 -mt-16 space-y-4">
            <div className="w-24 h-24 rounded-[32px] bg-white/[0.03] animate-pulse border-4 border-[#010804]" />
            <div className="h-6 w-1/2 rounded-full bg-white/[0.03] animate-pulse" />
            <div className="h-3 w-1/3 rounded-full bg-white/[0.03] animate-pulse" />
            <div className="h-20 w-full rounded-[24px] bg-white/[0.03] animate-pulse" />
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#010804] pb-28 flex flex-col items-center">
      <div className="w-full max-w-4xl bg-[#010804] min-h-screen border-x border-white/5 relative">
        {/* Cover Photo */}
        <div className="relative h-56 overflow-hidden">
          {vendor.coverUrl ? (
            <img
              src={vendor.coverUrl}
              alt="Cover"
              className="w-full h-full object-cover"
            />
          ) : (
            <div className="w-full h-full bg-gradient-to-br from-[#0c2a17] via-[#051109] to-[#010804]" />
          )}
          <div className="absolute inset-0 bg-gradient-to-t from-[#010804] via-[#010804]/40 to-transparent" />

          {/* Back button */}
          <Link
            to="/vendors"
            className="absolute top-5 left-5 w-9 h-9 rounded-full bg-black/40 backdrop-blur-md border border-white/10 flex items-center justify-center cursor-pointer hover:bg-black/60 transition-all"
          >
            <ArrowLeft className="w-4 h-4 text-white" />
          </Link>
          <div className="absolute top-5 right-5 flex gap-2">
            <button
              onClick={() => {
                navigator.clipboard.writeText(window.location.href);
                toast.success("Link copied!");
              }}
              className="w-9 h-9 rounded-full bg-black/40 backdrop-blur-md border border-white/10 flex items-center justify-center cursor-pointer"
            >
              <Share2 className="w-4 h-4 text-white" />
            </button>
          </div>
        </div>

        <div className="px-5 -mt-16 relative z-10">
          {/* Avatar + Info */}
          <div className="flex items-end gap-4 mb-4">
            <div className="w-24 h-24 rounded-[32px] overflow-hidden border-4 border-[#010804] bg-[#050D08] shrink-0 shadow-2xl">
              {vendor.avatarUrl ? (
                <img
                  src={vendor.avatarUrl}
                  alt={vendor.name}
                  className="w-full h-full object-cover"
                />
              ) : (
                <div className="w-full h-full flex items-center justify-center text-3xl font-black text-cyan-400 bg-[#0c1a12]">
                  {vendor.name?.[0]}
                </div>
              )}
            </div>
            <div className="flex-1 min-w-0 pb-1">
              <div className="flex items-center gap-1.5">
                <h1 className="text-lg font-black text-white truncate">
                  {vendor.name}
                </h1>
                {vendor.verified && (
                  <BadgeCheck className="w-4.5 h-4.5 text-blue-500 fill-white shrink-0" />
                )}
              </div>
              <p className="text-[11px] text-zinc-500 font-bold leading-tight line-clamp-1">
                {vendor.tagline || "Verified PaikarMart Wholesaler"}
              </p>
            </div>
          </div>

          {/* Stats Bar */}
          <div className="grid grid-cols-3 gap-2.5 mb-5">
            {[
              {
                label: "PRODUCTS",
                value: (vendor.products || []).length,
                icon: Package,
                color: "text-cyan-400",
              },
              {
                label: "FOLLOWERS",
                value: vendor.followers?.toLocaleString() || "0",
                icon: Users,
                color: "text-blue-400",
              },
              {
                label: "RATING",
                value: vendor.rating ? `${vendor.rating.toFixed(1)}★` : "4.9★",
                icon: Star,
                color: "text-amber-500",
              },
            ].map(({ label, value, icon: Icon, color }) => (
              <div
                key={label}
                className="flex flex-col items-center gap-1 py-3 px-2 rounded-[24px] bg-[#050D08] border border-[#1e3425] text-center shadow-lg"
              >
                <Icon className={cn("w-4 h-4", color)} />
                <p className="text-[14px] font-black text-white leading-none">
                  {value}
                </p>
                <p className="text-[8px] text-zinc-600 font-black tracking-widest">
                  {label}
                </p>
              </div>
            ))}
          </div>

          {/* Action Row */}
          <div className="flex gap-2.5 mb-6">
            <button
              onClick={() => {
                setFollowed((f) => !f);
                toast.success(
                  followed ? "Unfollowed" : `Following ${vendor.name}`,
                );
              }}
              className={cn(
                "flex-[1.5] h-[48px] rounded-[18px] text-[12px] font-black uppercase tracking-wider transition-all cursor-pointer shadow-3d active:translate-y-1 active:shadow-none",
                followed
                  ? "bg-white/[0.03] border border-white/10 text-zinc-500"
                  : "bg-[#00a859] border border-[#008f4c] text-white",
              )}
            >
              {followed ? "Following" : "Follow Store"}
            </button>
            <button
              onClick={() => toast.info("Messaging coming soon")}
              className="flex-1 h-[48px] rounded-[18px] bg-white/[0.04] border border-white/10 text-white text-[12px] font-black uppercase tracking-wider hover:bg-white/[0.06] transition-all flex items-center justify-center gap-2 cursor-pointer shadow-3d active:translate-y-1 active:shadow-none"
            >
              <MessageSquare className="w-4 h-4" /> Message
            </button>
          </div>

          {/* Tab Selector */}
          <div className="flex gap-1.5 p-1.5 rounded-[22px] bg-[#050D08] border border-[#1e3425] mb-6 shadow-xl">
            {(["products", "posts", "about"] as const).map((t) => (
              <button
                key={t}
                onClick={() => setTab(t)}
                className={cn(
                  "flex-1 py-2.5 rounded-[16px] text-[11px] font-bold uppercase tracking-wider transition-all cursor-pointer",
                  tab === t
                    ? "bg-cyan-400/10 border border-cyan-400/30 text-cyan-400"
                    : "text-zinc-500 hover:text-zinc-300",
                )}
              >
                {t}
              </button>
            ))}
          </div>

          {/* Tab Content Area */}
          <div className="animate-in fade-in slide-in-from-bottom-4 duration-500">
            {tab === "products" && (
              <div className="product-sink-grid">
                {(vendor.products || []).length > 0 ? (
                  vendor.products.map((p: any) => (
                    <ProductCard key={p.id} product={p} />
                  ))
                ) : (
                  <div className="col-span-full py-20 text-center bg-[#050D08] border border-[#1e3425] border-dashed rounded-[28px] text-zinc-600 font-bold uppercase tracking-widest">
                    No Products listed
                  </div>
                )}
              </div>
            )}

            {tab === "posts" && (
              <div className="space-y-4">
                {(vendor.recentPosts || []).length > 0 ? (
                  (vendor.recentPosts || []).map((post: any) => (
                    <UniversalFeedCard 
                      key={post.id} 
                      item={mapPostToFeedItem(post)} 
                      onLike={toggleLike}
                    />
                  ))
                ) : (
                  <div className="py-20 text-center bg-[#050D08] border border-[#1e3425] border-dashed rounded-[28px] text-zinc-600 font-bold uppercase tracking-widest">
                    No Posts found
                  </div>
                )}
              </div>
            )}

            {tab === "about" && (
              <div className="space-y-4">
                <div className="p-5 rounded-[28px] bg-[#050D08] border border-[#1e3425] shadow-lg">
                  <h3 className="text-[10px] font-black text-cyan-400 uppercase tracking-[0.2em] mb-3">
                    Shop Biography
                  </h3>
                  <p className="text-[13px] text-zinc-400 leading-relaxed italic">
                    "
                    {vendor.description ||
                      `${vendor.name} is a leading wholesaler on Paikar Mart, committed to quality and fair pricing.`}
                    "
                  </p>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  {[
                    {
                      label: "MEMBER SINCE",
                      value: vendor.createdAt
                        ? new Date(vendor.createdAt).getFullYear()
                        : "2023",
                    },
                    { label: "AVAILABILITY", value: "24/7 Support" },
                    { label: "TRUST SCORE", value: "98% Positive" },
                    { label: "VERIFIED", value: "Official Store ✓" },
                  ].map(({ label, value }) => (
                    <div
                      key={label}
                      className="p-4 rounded-[22px] bg-[#050D08] border border-[#1e3425] shadow-sm"
                    >
                      <p className="text-[8px] text-zinc-600 font-black tracking-widest mb-1">
                        {label}
                      </p>
                      <p className="text-[12px] font-black text-white">
                        {value}
                      </p>
                    </div>
                  ))}
                </div>

                <div className="p-5 rounded-[28px] bg-[#050D08] border border-[#1e3425] flex items-center justify-between gap-4">
                  <div className="flex items-center gap-3">
                    <Store className="w-5 h-5 text-zinc-600" />
                    <div>
                      <p className="text-[10px] font-black text-white">
                        Physical Address
                      </p>
                      <p className="text-[11px] text-zinc-500">
                        {vendor.location || "Bangladesh Marketplace"}
                      </p>
                    </div>
                  </div>
                  <button className="h-10 px-4 bg-white/[0.03] border border-white/10 rounded-xl text-[10px] font-black text-white">
                    MAP VIEW
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
