import React, { memo, useState, useEffect, useRef, useCallback } from "react";
import { useNavigate } from "react-router-dom";
import { StoryBar } from "@/shared/StoryBar";
import { PortalIconBar } from "@/shared/PortalIconBar";
import { UniversalFeedCard } from "@/modules/social";
import { useFeedStore } from "@/modules/social";
import { HeroSpotlight } from "@/shared/HeroSpotlight";
import { CategoryNavBar } from "@/shared/CategoryNavBar";
import { ExclusiveDealsRail } from "../components/home/ExclusiveDealsRail";
import { CategoryRail } from "../components/home/CategoryRail";
import { MerchantHomeView } from "@/features/home/components/MerchantHomeView";
import { AdminDashboard as AdminHomeView } from "@/portals/seller-central/AdminDashboard";
import { GlassCard } from "@/components/ui/GlassCard";
import { useAuth } from "@/context/AuthContext";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import {
  AlertCircle,
  Sparkles,
  Volume2,
  RefreshCw,
} from "lucide-react";
import { motion, AnimatePresence } from "motion/react";

/** Roles that get the merchant/seller dashboard on the homepage */
const MERCHANT_ROLES = new Set([
  "seller",
  "wholesale",
  "factory",
  "digital_seller",
  "service_provider",
  "rider",
  "nearby_shop",
]);

/** Roles that get the admin control panel on the homepage */
const ADMIN_ROLES = new Set(["admin", "super_admin", "moderator"]);

export default function Home() {
  const { role, user } = useAuth();
  const navigate = useNavigate();

  // Check if current user is a seller
  const isRetailSeller = role === "seller";

  /* ── Seller / Factory / Merchant → Merchant Dashboard ── */
  if (role && MERCHANT_ROLES.has(role) && !isRetailSeller) {
    return <MerchantHomeView />;
  }

  /* ── Admin / Super Admin / Moderator → Admin Control Panel ── */
  if (role && ADMIN_ROLES.has(role)) {
    return <AdminHomeView />;
  }

  /* ── Guest / Buyer / User / Retail Seller → Standard Restored Home Feed ── */
  return <BuyerHomeView isRetailSeller={isRetailSeller} />;
}

const ANNOUNCEMENTS = [
  {
    id: 1,
    text: "📢 চকবাজারের পাইকারি কসমেটিকস ও গার্মেন্টসের উপর বিশেষ ১০%-১৫% অতিরিক্ত কমিশন ক্যাম্পেইন চলছে!",
  },
  {
    id: 2,
    text: "🔥 খাতুনগঞ্জের ফ্যাক্টরি ডিরেক্ট ভোজ্য তেল এবং মশলার MOQ বুকিং শুরু হয়েছে - সীমিত স্টক।",
  },
  {
    id: 3,
    text: "⚠️ নিরাপত্তা গাইডলাইন: কোনো অগ্রিম পেমেন্ট করার পূর্বে সর্বদা বিক্রেতার 'Verified' ট্যাগ এবং ট্রেড লাইসেন্স চেক করুন।",
  },
];

function BuyerHomeView({ isRetailSeller }: { isRetailSeller?: boolean }) {
  const navigate = useNavigate();
  // const { deals, loading: isDealsLoading } = useExclusiveDeals();
  const { 
    items, 
    isLoading: isFeedLoading, 
    activeFilter, 
    fetchFeed, 
    toggleLike,
    selectedSector,
    setSelectedSector,
  } = useFeedStore();

  useEffect(() => {
    fetchFeed();
  }, [fetchFeed, selectedSector, activeFilter]);

  const [productLimit, setProductLimit] = useState(12);
  const [isRefreshing, setIsRefreshing] = useState(false);
  const observerTarget = useRef<HTMLDivElement>(null);

  const loadMoreProducts = useCallback(() => {
    if (isRefreshing) return;
    setIsRefreshing(true);
    setTimeout(() => {
      setProductLimit((prev) => prev + 12);
      setIsRefreshing(false);
    }, 450);
  }, [isRefreshing]);

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        if (entries[0].isIntersecting) {
          loadMoreProducts();
        }
      },
      { threshold: 0.1, rootMargin: "100px" }
    );

    if (observerTarget.current) {
      observer.observe(observerTarget.current);
    }

    return () => observer.disconnect();
  }, [loadMoreProducts]);

  return (
    <div className="flex flex-col gap-2 pb-24 pt-0 relative min-h-screen">
      {/* ━━━ PORTAL HOMEPAGE HEADER (Top Priority) ━━━ */}
      <section className="mt-4 px-2 lg:px-0 space-y-1">
        <StoryBar context="social-feed" />
        <CategoryRail />
        <PortalIconBar context="marketplace" />
      </section>

      {/* ━━━ PORTAL NAV (Sticky below main header - 72px) ━━━ */}
      <CategoryNavBar 
        context="social-feed" 
        activeFilter={selectedSector}
        onFilterChange={(id) => setSelectedSector(id as any)}
        topOffset="72px"
      />

      {/* ━━━ EXCLUSIVE DEALS ━━━ */}
      <div className="max-w-7xl mx-auto w-full px-4 lg:px-0">
        <ExclusiveDealsRail />
      </div>

      <main className="max-w-7xl mx-auto w-full px-4 lg:px-0 space-y-8">
        {/* ━━━ MAIN FEED ZONE ━━━ */}
        <div className="relative">
          <div className="flex flex-col lg:flex-row gap-10 items-start">
            
            {/* Left Content: The Infinite Feed */}
            <div className="flex-1 w-full min-w-0 flex flex-col gap-8 max-w-2xl mx-auto lg:mx-0">
              
              <div className="flex flex-col gap-4">
                {isFeedLoading && items.length === 0 ? (
                  Array.from({ length: 3 }).map((_, i) => (
                    <div
                      key={`skeleton-${i}`}
                      className="rounded-[2.5rem] p-6 flex flex-col gap-4 bg-white/[0.02] border border-white/5 animate-pulse"
                    >
                      <div className="flex items-center gap-3">
                        <div className="h-11 w-11 rounded-2xl bg-white/[0.03]" />
                        <div className="flex-1 flex flex-col gap-2">
                          <div className="h-3 w-1/3 rounded-full bg-white/[0.03]" />
                          <div className="h-2 w-1/4 rounded-full bg-white/[0.03]" />
                        </div>
                      </div>
                      <div className="aspect-[16/10] rounded-[2rem] bg-white/[0.03]" />
                    </div>
                  ))
                ) : items.length === 0 ? (
                  <div className="py-20 text-center text-zinc-500 border border-white/5 border-dashed rounded-3xl bg-white/[0.02] flex flex-col items-center justify-center p-6 gap-3">
                    <AlertCircle className="w-8 h-8 opacity-50 text-sky-500" />
                    <div>
                      <p className="font-black text-white uppercase tracking-tighter">কোনো কন্টেন্ট পাওয়া যায়নি</p>
                      <p className="text-[10px] text-zinc-500 mt-2 uppercase font-bold tracking-widest leading-none">অন্যান্য ফিল্টার ব্যবহার করে দেখুন</p>
                    </div>
                  </div>
                ) : (
                  items.slice(0, productLimit).map((item, index) => (
                    <React.Fragment key={item.id}>
                      <UniversalFeedCard 
                        item={item} 
                        onLike={toggleLike} 
                      />
                      
                      {/* ━━━ INJECTED HERO SPOTLIGHT (After 7 items) ━━━ */}
                      {index === 6 && (
                        <div className="my-8 animate-in fade-in zoom-in-95 duration-1000">
                          <HeroSpotlight />
                        </div>
                      )}
                    </React.Fragment>
                  ))
                )}
              </div>

              {/* Infinite Scroll Observer Target */}
              {items.length > 0 && productLimit < items.length && (
                <div ref={observerTarget} className="mt-8 flex justify-center pb-12 w-full h-20 items-center">
                  {isRefreshing ? (
                    <RefreshCw className="w-6 h-6 text-cyan-500 animate-spin" />
                  ) : (
                    <div className="w-2 h-2 rounded-full bg-white/20 animate-pulse" />
                  )}
                </div>
              )}
              {items.length > 0 && productLimit >= items.length && (
                <div className="mt-8 flex justify-center pb-12 w-full text-center">
                   <p className="text-[10px] text-zinc-500 font-bold uppercase tracking-widest">আপনি সব পোস্ট দেখে ফেলেছেন</p>
                </div>
              )}
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
