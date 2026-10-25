import React, { useState, useMemo, useEffect } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { useNavigate } from "react-router-dom";
import { toast } from "sonner";
import { 
  Sparkles, Package, Store, Shirt, Smartphone, Apple, 
  Pill, Zap, Search, ArrowDownUp, 
  X, Flame, RefreshCw, ChevronDown, Check
} from "lucide-react";


import { UnifiedPostCard } from "@/design-system/components/feed/UnifiedPostCard";
import { ProductCardSkeleton } from "@/design-system/components/ui/ProductCard";
import { useCartStore } from "@/modules/cart";
import { ECOMMERCE_PRODUCTS, EcommerceProduct } from "@/modules/product";
import { PageSkeleton } from "@/app/AppShell/GlobalSkeletonSystem";
import { useLocationStore } from "@/modules/location";
import { useCategoryStore } from "@/store/categoryStore";

export default function Home() {
  const navigate = useNavigate();
  const { addItem } = useCartStore();
  const { city: userLocation } = useLocationStore();
  const { activeMainCategory, activeSubCategory, setMainCategory, setSubCategory } = useCategoryStore();

  // State Management
  const [isLoading, setIsLoading] = React.useState(true);
  const [selectedCategory, setSelectedCategory] = useState<string>("all");
  const [searchQuery, setSearchQuery] = useState<string>("");
  const [onlyDiscounted, setOnlyDiscounted] = useState<boolean>(false);
  const [onlyWholesale, setOnlyWholesale] = useState<boolean>(false);
  const [sortBy, setSortBy] = useState<string>("popular");
  const [productsList, setProductsList] = useState<EcommerceProduct[]>(ECOMMERCE_PRODUCTS);

  const effectiveCategory = activeMainCategory !== "all" ? activeMainCategory : selectedCategory;

  // Fetch products from backend API with fallback to static ECOMMERCE_PRODUCTS
  useEffect(() => {
    let isMounted = true;
    async function fetchProducts() {
      try {
        const res = await fetch('/api/v1/products');
        if (res.ok) {
          const data = await res.json();
          if (isMounted && Array.isArray(data) && data.length > 0) {
            const mapped: EcommerceProduct[] = data.map((p: any) => ({
              id: p.id,
              name: p.name,
              title: p.name,
              category: p.category === 'wholesale' ? 'wholesale' : 'retail',
              price: Number(p.price),
              originalPrice: p.originalPrice ? Number(p.originalPrice) : undefined,
              discount: p.originalPrice ? Math.round(((p.originalPrice - p.price) / p.originalPrice) * 100) : 0,
              image: p.images?.[0] || 'https://images.unsplash.com/photo-1521572267360-ee0c2909d518?w=800&q=80',
              description: p.description,
              sellerName: p.sellerName || 'PaikarMart Verified Merchant',
              sellerLocation: p.sellerLocation || 'Dhaka, Bangladesh',
              isVerified: true,
              rating: 4.8,
              reviewCount: 120,
              stock: p.stock || 50,
              moq: p.category === 'wholesale' ? 20 : 1
            }));
            setProductsList(mapped);
          }
        }
      } catch (err) {
        console.warn('Backend products unreachable, using resilient offline catalog.');
      } finally {
        if (isMounted) setIsLoading(false);
      }
    }
    fetchProducts();
    return () => { isMounted = false; };
  }, []);

  const handleAddToCart = (product: EcommerceProduct, e?: React.MouseEvent) => {
    if (e?.stopPropagation) e.stopPropagation();
    addItem({
      id: product.id,
      name: product.name,
      price: product.price,
      originalPrice: product.originalPrice,
      image: product.image,
      quantity: 1,
      moq: product.moq || 1,
      vendorName: product.sellerName,
      portal: product.category === 'wholesale' ? 'b2b' : 'b2c',
      stock: product.stock,
    });
    toast.success(`${product.name.slice(0, 32)}... কার্টে যোগ হয়েছে!`);
  };

  // Filtered and Sorted Products
  const filteredProducts = useMemo(() => {
    const activeLoc = userLocation || 'Dhaka';
    return productsList.filter((product) => {
      // Category Filter
      if (effectiveCategory !== "all") {
        if (effectiveCategory === "wholesale" && product.category !== "wholesale") return false;
        if (effectiveCategory !== "wholesale") {
          const matchCat = product.category === effectiveCategory || product.name.toLowerCase().includes(effectiveCategory.toLowerCase());
          if (!matchCat) return false;
        }
      }

      // Subcategory Filter
      if (activeSubCategory && activeSubCategory !== "all") {
        const matchSub = product.name.toLowerCase().includes(activeSubCategory.toLowerCase()) || 
                         (product.description && product.description.toLowerCase().includes(activeSubCategory.toLowerCase()));
        if (!matchSub) return false;
      }

      // Search Filter
      if (searchQuery.trim()) {
        const query = searchQuery.toLowerCase();
        const matchesName = product.name.toLowerCase().includes(query);
        const matchesSeller = product.sellerName.toLowerCase().includes(query);
        const matchesLoc = product.sellerLocation.toLowerCase().includes(query);
        if (!matchesName && !matchesSeller && !matchesLoc) return false;
      }

      // Discount Toggle Filter
      if (onlyDiscounted && (!product.discount || product.discount <= 0)) {
        return false;
      }

      // Wholesale (MOQ) Toggle Filter
      if (onlyWholesale && (!product.moq || product.moq <= 1)) {
        return false;
      }

      return true;
    }).sort((a, b) => {
      // Proximity boost
      const aNear = a.sellerLocation.toLowerCase().includes(activeLoc.toLowerCase()) ? 1 : 0;
      const bNear = b.sellerLocation.toLowerCase().includes(activeLoc.toLowerCase()) ? 1 : 0;
      if (aNear !== bNear) return bNear - aNear;

      if (sortBy === "price_asc") return a.price - b.price;
      if (sortBy === "price_desc") return b.price - a.price;
      if (sortBy === "rating") return b.rating - a.rating;
      if (sortBy === "discount") return (b.discount || 0) - (a.discount || 0);
      return b.reviewCount - a.reviewCount; // 'popular'
    });
  }, [effectiveCategory, activeSubCategory, searchQuery, onlyDiscounted, onlyWholesale, sortBy, userLocation, productsList]);

  const hasActiveFilters = effectiveCategory !== "all" || Boolean(activeSubCategory) || searchQuery !== "" || onlyDiscounted || onlyWholesale || sortBy !== "popular" || (userLocation && userLocation !== "Dhaka");

  const resetFilters = () => {
    setSelectedCategory("all");
    setMainCategory("all");
    setSubCategory(null);
    setSearchQuery("");
    setOnlyDiscounted(false);
    setOnlyWholesale(false);
    setSortBy("popular");
  };

  if (isLoading) return <PageSkeleton />;

  return (
    <div className="w-full pb-24 space-y-6 bg-[var(--pm-bg)] min-h-screen text-[var(--pm-text)] select-none">
      <div className="max-w-7xl mx-auto px-3.5 sm:px-6 space-y-6">


        {/* ─── 2. COMMERCE PRODUCTS SECTION ─── */}
        <section className="space-y-4 pt-1">
          <div className="space-y-4">
              {/* Section Header */}
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-2 border-b border-[var(--pm-border)]">
                <div>
                  <div className="flex items-center gap-2">
                    <h2 className="text-xl sm:text-2xl font-black text-white tracking-tight flex items-center gap-2.5">
                      <span>ই-কমার্স প্রোডাক্ট ডিসকভারি</span>
                      <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
                    </h2>
                  </div>
                  <p className="text-xs text-[var(--pm-text-muted)] font-medium mt-1">
                    সরাসরি ফ্যাক্টরি, আড়ৎ ও ভেরিফায়েড সেলারদের পণ্য তালিকা · যেকোনো পণ্যে ট্যাপ করে বিস্তারিত দেখুন
                  </p>
                </div>

                <div className="flex items-center gap-2.5 self-end sm:self-auto">
                  <span className="text-xs font-bold text-zinc-400">
                    মোট <strong className="text-white font-black">{filteredProducts.length}</strong>টি পণ্য প্রদর্শিত
                  </span>
                  {hasActiveFilters && (
                    <button
                      onClick={resetFilters}
                      className="text-[11px] font-bold text-[var(--pm-accent)] hover:underline flex items-center gap-1 active:scale-95 transition-all"
                    >
                      <RefreshCw className="w-3 h-3" />
                      <span>রিসেট</span>
                    </button>
                  )}
                </div>
              </div>

              {/* Active Category Filter Context Bar */}
              {effectiveCategory !== "all" && (
                <div className="flex items-center justify-between bg-[var(--pm-surface)]/80 border border-[var(--pm-accent)]/30 px-3.5 py-2 rounded-xl text-xs select-none">
                  <div className="flex items-center gap-2">
                    <span className="text-[var(--pm-muted)] font-bold">ফিল্টারিং ক্যাটাগরি:</span>
                    <span className="px-2.5 py-0.5 rounded-lg bg-[var(--pm-accent)] text-white font-black text-[11px] uppercase tracking-wide">
                      {effectiveCategory}
                    </span>
                    {activeSubCategory && (
                      <span className="px-2.5 py-0.5 rounded-lg bg-white/10 text-white font-bold text-[11px]">
                        {activeSubCategory}
                      </span>
                    )}
                  </div>
                  <button
                    onClick={() => {
                      setMainCategory("all");
                      setSubCategory(null);
                      setSelectedCategory("all");
                    }}
                    className="text-[11px] font-bold text-[var(--pm-accent)] hover:underline flex items-center gap-1 cursor-pointer"
                  >
                    <RefreshCw className="w-3 h-3" />
                    <span>সব পণ্য দেখুন</span>
                  </button>
                </div>
              )}

              {/* Search & Filter Controls Toolbar */}
              <div className="bg-[var(--pm-surface)] p-3 sm:p-4 rounded-3xl border border-[var(--pm-border)] shadow-sm space-y-3">
                <div className="flex flex-col md:flex-row items-stretch md:items-center justify-between gap-3">
                  {/* Live Search Input */}
                  <div className="relative flex-1">
                    <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-zinc-400 pointer-events-none" />
                    <input
                      type="text"
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                      placeholder="পণ্য, সেলার বা এরিয়ার নাম দিয়ে লাইভ সার্চ করুন..."
                      className="w-full bg-black/30 border border-white/10 rounded-2xl pl-10 pr-9 py-2.5 text-xs text-white placeholder-zinc-500 focus:outline-none focus:border-[var(--pm-accent)] focus:ring-2 focus:ring-[var(--pm-accent)]/20 transition-all"
                    />
                    {searchQuery && (
                      <button
                        onClick={() => setSearchQuery("")}
                        className="absolute right-3 top-1/2 -translate-y-1/2 p-1 text-zinc-400 hover:text-white rounded-lg active:scale-90"
                        title="সার্চ মুছুন"
                      >
                        <X className="w-3.5 h-3.5" />
                      </button>
                    )}
                  </div>

                  {/* Filter Toggles & Sort Dropdown */}
                  <div className="flex flex-wrap items-center gap-2">
                    {/* Only Discounted Toggle */}
                    <button
                      type="button"
                      onClick={() => setOnlyDiscounted(!onlyDiscounted)}
                      className={`flex items-center gap-1.5 px-3.5 py-2.5 rounded-xl text-xs font-bold transition-all border active:scale-95 cursor-pointer ${
                        onlyDiscounted
                          ? "bg-rose-500/20 text-rose-300 border-rose-500/40 shadow-xs"
                          : "bg-white/5 text-zinc-400 border-white/10 hover:bg-white/10 hover:text-zinc-200"
                      }`}
                    >
                      <Flame className={`w-3.5 h-3.5 ${onlyDiscounted ? "text-rose-400 fill-rose-400" : ""}`} />
                      <span>অফার/ছাড়</span>
                      {onlyDiscounted && <Check className="w-3 h-3 text-rose-400 ml-0.5" />}
                    </button>

                    {/* Wholesale (MOQ) Toggle */}
                    <button
                      type="button"
                      onClick={() => setOnlyWholesale(!onlyWholesale)}
                      className={`flex items-center gap-1.5 px-3.5 py-2.5 rounded-xl text-xs font-bold transition-all border active:scale-95 cursor-pointer ${
                        onlyWholesale
                          ? "bg-amber-500/20 text-amber-300 border-amber-500/40 shadow-xs"
                          : "bg-white/5 text-zinc-400 border-white/10 hover:bg-white/10 hover:text-zinc-200"
                      }`}
                    >
                      <Package className="w-3.5 h-3.5 text-amber-400" />
                      <span>হোলসেল (MOQ)</span>
                      {onlyWholesale && <Check className="w-3 h-3 text-amber-400 ml-0.5" />}
                    </button>

                    {/* Sort Selector */}
                    <div className="relative flex items-center gap-1.5 bg-black/30 border border-white/10 rounded-xl px-3 py-2">
                      <ArrowDownUp className="w-3.5 h-3.5 text-[var(--pm-accent)] shrink-0" />
                      <select
                        value={sortBy}
                        onChange={(e) => setSortBy(e.target.value)}
                        className="bg-transparent text-xs font-bold text-white focus:outline-none cursor-pointer pr-4 appearance-none"
                      >
                        <option value="popular" className="bg-[#12141f] text-white">জনপ্রিয় পণ্য</option>
                        <option value="price_asc" className="bg-[#12141f] text-white">দাম: কম থেকে বেশি</option>
                        <option value="price_desc" className="bg-[#12141f] text-white">দাম: বেশি থেকে কম</option>
                        <option value="rating" className="bg-[#12141f] text-white">সর্বোচ্চ রেটিং</option>
                        <option value="discount" className="bg-[#12141f] text-white">সর্বোচ্চ ছাড় (%)</option>
                      </select>
                      <ChevronDown className="w-3.5 h-3.5 text-zinc-400 absolute right-2 pointer-events-none" />
                    </div>
                  </div>
                </div>
              </div>

              {/* 2-column on mobile, 4-column on desktop Product Cards Grid */}
              {isLoading ? (
                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 sm:gap-6">
                  {[1, 2, 3, 4, 5, 6, 7, 8].map((n) => (
                    <ProductCardSkeleton key={n} />
                  ))}
                </div>
              ) : filteredProducts.length === 0 ? (
                <div className="text-center py-16 px-4 bg-[var(--pm-surface)] rounded-3xl border border-[var(--pm-border)] border-dashed space-y-3">
                  <div className="w-14 h-14 mx-auto rounded-2xl bg-white/5 flex items-center justify-center text-zinc-400">
                    <Search className="w-6 h-6" />
                  </div>
                  <h3 className="text-base font-bold text-white">কোনো পণ্য পাওয়া যায়নি</h3>
                  <p className="text-xs text-[var(--pm-text-muted)] max-w-sm mx-auto">
                    আপনার ফিল্টার অথবা সার্চের সাথে কোনো পণ্যের মিল খুঁজে পাওয়া যায়নি। ফিল্টার রিসেট করে আবার চেষ্টা করুন।
                  </p>
                  <button
                    onClick={resetFilters}
                    className="inline-flex items-center gap-1.5 px-5 py-2.5 bg-[var(--pm-accent)] text-white text-xs font-bold rounded-xl shadow-md transition-all active:scale-95"
                  >
                    <RefreshCw className="w-3.5 h-3.5" />
                    <span>ফিল্টার রিসেট করুন</span>
                  </button>
                </div>
              ) : (
                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 sm:gap-6">
                  <AnimatePresence mode="popLayout">
                    {filteredProducts.map((product) => (
                      <motion.div
                        key={product.id}
                        layout
                        initial={{ opacity: 0, scale: 0.96 }}
                        animate={{ opacity: 1, scale: 1 }}
                        exit={{ opacity: 0, scale: 0.96 }}
                        transition={{ duration: 0.2 }}
                      >
                        <UnifiedPostCard
                          post={{
                            id: product.id.toString(),
                            type: 'product',
                            domain: product.category === 'wholesale' ? 'WHOLESALE' : 'RETAIL',
                            authorName: product.sellerName || 'Verified Seller',
                            authorAvatar: `https://api.dicebear.com/7.x/initials/svg?seed=${product.sellerName || 'seller'}`,
                            isVerified: product.isVerified || true,
                            authorRole: product.category === 'wholesale' ? 'পাইকারি আড়ত' : 'খুচরা বিক্রেতা',
                            timestamp: 'Just now',
                            content: product.description || `নতুন ${product.name} এখন সহজলভ্য। সরাসরি পেইকার মার্ট থেকে অর্ডার করুন।`,
                            imageUrl: product.image,
                            location: product.sellerLocation,
                            likes: product.reviewCount || 0,
                            comments: Math.floor((product.reviewCount || 0) / 4),
                            product: {
                              id: product.id.toString(),
                              title: product.name,
                              price: product.price,
                              imageUrl: product.image,
                              moq: product.moq
                            },
                            metadata: {
                              isFlashSale: product.discount && product.discount > 20,
                              isPkExclusive: ['1', '5', '10'].includes(product.id.toString()),
                              discountTag: product.discount ? `${product.discount}% ছাড়` : undefined,
                              distance: '৪৫০ মি',
                              deliveryTime: '১৫ মিনিট'
                            }
                          }}
                        />
                      </motion.div>
                    ))}
                  </AnimatePresence>
                </div>
              )}
            </div>
        </section>
      </div>
    </div>
  );
}
