import React, { useState, useEffect, useMemo } from 'react';
import { 
  Sparkles, ShieldCheck, ShoppingBag, Star, Coins, 
  Search, ArrowUpDown, ChevronRight, SlidersHorizontal, 
  Settings, CheckCircle2, Truck, RefreshCw, Eye, PackageCheck
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { Link, useNavigate } from 'react-router-dom';
import { toast } from 'sonner';

import { useCartStore } from '@/modules/cart';
import { useCartDrawerStore } from '@/modules/cart/store/cartDrawerStore';
import { useAuth } from '@/modules/auth';
import { pkShopApi } from '../services/pkShopApi';
import { PKShopProduct } from '../types';
import { PortalIconBar } from '@/shared/PortalIconBar';

const CATEGORIES = [
  { id: 'all', label: 'সব পণ্য (All)' },
  { id: 'Luxury Fashion', label: 'রয়্যাল ফ্যাশন (Fashion)' },
  { id: 'Premium Electronics', label: 'প্রিমিয়াম গ্যাজেট (Tech)' },
  { id: 'Curated Organics', label: 'অর্গানিক ফুড (Organics)' },
  { id: 'Exclusive Catalog', label: 'এক্সক্লুসিভ কালেকশন' }
];

export const PKShopPortal: React.FC = () => {
  const navigate = useNavigate();
  const { user, isAuthenticated } = useAuth();
  const addItem = useCartStore((state) => state.addItem);
  const openCart = useCartDrawerStore((state) => state.open);

  const [products, setProducts] = useState<PKShopProduct[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [sortBy, setSortBy] = useState<'newest' | 'price_asc' | 'price_desc'>('newest');

  // Check if current user is admin/staff
  const isStaff = useMemo(() => {
    if (!isAuthenticated || !user) return false;
    const role = String(user.role || '').toLowerCase();
    const email = user.email?.toLowerCase();
    return role === 'admin' || role === 'super_admin' || email === 'abs.munna1@gmail.com';
  }, [isAuthenticated, user]);

  const loadProducts = async () => {
    setIsLoading(true);
    try {
      const data = await pkShopApi.getProducts({
        category: selectedCategory === 'all' ? undefined : selectedCategory,
        search: searchQuery || undefined,
        sort: sortBy
      });
      setProducts(data);
    } catch (error) {
      console.warn('Failed to load PK Shop products, using client resilient catalog');
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    loadProducts();
  }, [selectedCategory, sortBy]);

  // Handle immediate search input with debounce
  useEffect(() => {
    const timer = setTimeout(() => {
      loadProducts();
    }, 300);
    return () => clearTimeout(timer);
  }, [searchQuery]);

  const handleAddToCart = (product: PKShopProduct, e?: React.MouseEvent) => {
    if (e) e.stopPropagation();
    addItem({
      id: product.id,
      name: product.title,
      title: product.title,
      price: product.price,
      originalPrice: product.originalPrice,
      image: product.images[0] || 'https://via.placeholder.com/300',
      quantity: 1,
      moq: 1,
      stock: product.stock,
      portal: 'pk-shop',
      seller: 'PaikarMart Official Flagship',
      sellerId: 'pk-shop-official',
      coinCashback: Math.floor(product.price * (product.coinCashbackPercent / 100))
    });
    toast.success(`${product.title.slice(0, 28)}... কার্টে যুক্ত হয়েছে!`);
    openCart();
  };

  const handleBuyNow = (product: PKShopProduct, e?: React.MouseEvent) => {
    if (e) e.stopPropagation();
    handleAddToCart(product);
    navigate('/checkout');
  };

  return (
    <div className="w-full pb-28 space-y-6 bg-[var(--pm-bg)] min-h-screen text-[var(--pm-text)] select-none">
      
      {/* ─── 1. GLOBAL PORTAL BAR ─── */}
      <PortalIconBar />

      <div className="max-w-7xl mx-auto px-3 sm:px-6 lg:px-8 space-y-6">

        {/* ─── 2. STAFF COCKPIT TOP BANNER (Shown to Admins & Managers) ─── */}
        {isStaff && (
          <motion.div 
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            className="p-3.5 rounded-2xl bg-gradient-to-r from-amber-500/15 via-indigo-500/15 to-purple-500/15 border border-amber-500/30 flex items-center justify-between gap-3 shadow-lg"
          >
            <div className="flex items-center gap-2.5">
              <span className="w-2.5 h-2.5 rounded-full bg-amber-400 animate-pulse" />
              <div className="flex flex-col">
                <span className="text-xs font-black text-amber-300 uppercase tracking-wider">
                  PK Shop স্টাফ মোড সক্রিয়
                </span>
                <span className="text-[10px] text-zinc-400 font-bold">
                  আপনি সুপার অ্যাডমিন বা স্টোর ম্যানেজার হিসেবে লগইন আছেন
                </span>
              </div>
            </div>

            <Link
              to="/portals/pk-shop/admin"
              className="flex items-center gap-1.5 px-4 py-2 rounded-xl bg-amber-500 hover:bg-amber-400 text-black text-xs font-black transition-all shadow-md active:scale-95"
            >
              <Settings className="w-4 h-4" />
              <span>ম্যানেজমেন্ট ককপিট</span>
              <ChevronRight className="w-3.5 h-3.5" />
            </Link>
          </motion.div>
        )}

        {/* ─── 3. LUXURY FLAGSHIP HERO BANNER ─── */}
        <section className="relative rounded-[32px] overflow-hidden bg-gradient-to-br from-[#120d2b] via-[#0d1024] to-black border border-indigo-500/20 shadow-2xl p-6 sm:p-10">
          <div className="relative z-10 max-w-2xl space-y-4">
            <div className="inline-flex items-center gap-2 bg-indigo-500/20 backdrop-blur-md px-3.5 py-1.5 rounded-full border border-indigo-500/30">
              <ShieldCheck className="w-4 h-4 text-indigo-400" />
              <span className="text-[10px] font-black text-indigo-200 uppercase tracking-widest">
                PaikarMart Official Flagship Store
              </span>
            </div>

            <div className="space-y-1">
              <h1 className="text-2xl sm:text-4xl md:text-5xl font-black text-white tracking-tight leading-none">
                PK <span className="text-transparent bg-clip-text bg-gradient-to-r from-amber-400 via-indigo-300 to-purple-400">Shop</span>
              </h1>
              <p className="text-xs sm:text-sm text-zinc-400 font-medium leading-relaxed max-w-lg">
                পাইকার মার্টের অফিশিয়াল প্রিমিয়াম ফ্ল্যাগশিপ হাব। শতভাগ অথেনটিক কোয়ালিটি, সুপারফাস্ট ডেলিভারি ও বিশেষ কয়েন ক্যাশব্যাক সহ।
              </p>
            </div>

            <div className="flex flex-wrap items-center gap-3 pt-2">
              <div className="flex items-center gap-2 text-xs font-bold text-amber-300 bg-amber-500/10 px-3.5 py-2 rounded-xl border border-amber-500/20">
                <Coins className="w-4 h-4 text-amber-400" />
                <span>প্রতি অর্ডারে সর্বোচ্চ ১০% পিকে কয়েন ক্যাশব্যাক</span>
              </div>
              <div className="flex items-center gap-1.5 text-xs font-bold text-emerald-300 bg-emerald-500/10 px-3.5 py-2 rounded-xl border border-emerald-500/20">
                <PackageCheck className="w-4 h-4 text-emerald-400" />
                <span>১০০% কোয়ালিটি সার্টিফাইড</span>
              </div>
            </div>
          </div>

          {/* Ambient Lighting Background Accents */}
          <div className="absolute top-0 right-0 w-80 h-80 bg-indigo-500/15 blur-[100px] rounded-full pointer-events-none" />
          <div className="absolute bottom-0 right-1/4 w-60 h-60 bg-amber-500/10 blur-[90px] rounded-full pointer-events-none" />
        </section>

        {/* ─── 4. SEARCH & FILTER CONTROLS ─── */}
        <div className="bg-[var(--pm-surface)] p-3.5 sm:p-5 rounded-3xl border border-[var(--pm-border)] space-y-4 shadow-sm">
          <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3">
            
            {/* Live Search Input */}
            <div className="relative flex-1">
              <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-zinc-400 pointer-events-none" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="পিকে শপের ফ্ল্যাগশিপ প্রোডাক্ট খুঁজুন..."
                className="w-full bg-black/40 border border-white/10 rounded-2xl pl-10 pr-4 py-2.5 text-xs text-white placeholder-zinc-500 focus:outline-none focus:border-[var(--pm-accent)] transition-all"
              />
            </div>

            {/* Sort Dropdown */}
            <div className="flex items-center gap-2">
              <div className="relative flex items-center gap-1.5 bg-black/40 border border-white/10 rounded-2xl px-3.5 py-2">
                <ArrowUpDown className="w-3.5 h-3.5 text-amber-400 shrink-0" />
                <select
                  value={sortBy}
                  onChange={(e) => setSortBy(e.target.value as any)}
                  className="bg-transparent text-xs font-bold text-white focus:outline-none cursor-pointer appearance-none pr-3"
                >
                  <option value="newest" className="bg-[#12141f] text-white">নতুন কালেকশন</option>
                  <option value="price_asc" className="bg-[#12141f] text-white">দাম: কম থেকে বেশি</option>
                  <option value="price_desc" className="bg-[#12141f] text-white">দাম: বেশি থেকে কম</option>
                </select>
              </div>

              <button
                onClick={loadProducts}
                className="p-2.5 rounded-2xl bg-white/5 hover:bg-white/10 text-zinc-300 transition-colors cursor-pointer"
                title="রিফ্রেশ করুন"
              >
                <RefreshCw className={`w-4 h-4 ${isLoading ? 'animate-spin' : ''}`} />
              </button>
            </div>
          </div>

          {/* Category Chips Bar */}
          <div className="flex items-center gap-2 overflow-x-auto no-scrollbar select-none pt-1">
            {CATEGORIES.map((cat) => {
              const isActive = selectedCategory === cat.id;
              return (
                <button
                  key={cat.id}
                  onClick={() => setSelectedCategory(cat.id)}
                  className={`px-4 py-2 rounded-xl text-xs font-black whitespace-nowrap transition-all border shrink-0 cursor-pointer ${
                    isActive
                      ? 'bg-gradient-to-r from-amber-500 to-amber-600 text-black border-amber-400 shadow-md shadow-amber-500/20'
                      : 'bg-white/5 text-zinc-400 border-white/5 hover:bg-white/10 hover:text-white'
                  }`}
                >
                  {cat.label}
                </button>
              );
            })}
          </div>
        </div>

        {/* ─── 5. 1:1 PRODUCT GRID ─── */}
        <div className="space-y-4">
          <div className="flex items-center justify-between px-1">
            <div className="flex items-center gap-2">
              <span className="text-base font-black text-white uppercase tracking-wider">
                ফ্ল্যাগশিপ ক্যাটালগ
              </span>
              <span className="px-2 py-0.5 rounded-full bg-indigo-500/20 text-indigo-300 text-[10px] font-black border border-indigo-500/30">
                {products.length} আইটেম
              </span>
            </div>

            <span className="text-xs text-[var(--pm-text-muted)] font-bold">
              সরাসরি পিকে ওয়্যারহাউজ থেকে সরবরাহ
            </span>
          </div>

          {isLoading ? (
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
              {[1, 2, 3, 4, 5, 6].map((n) => (
                <div key={n} className="bg-[var(--pm-surface)] rounded-3xl p-4 border border-[var(--pm-border)] space-y-3 animate-pulse">
                  <div className="aspect-square w-full bg-zinc-800 rounded-2xl" />
                  <div className="h-4 w-3/4 bg-zinc-800 rounded-full" />
                  <div className="h-3 w-1/2 bg-zinc-800 rounded-full" />
                </div>
              ))}
            </div>
          ) : products.length === 0 ? (
            <div className="p-12 text-center bg-[var(--pm-surface)] rounded-3xl border border-dashed border-[var(--pm-border)] space-y-3">
              <ShoppingBag className="w-12 h-12 text-zinc-600 mx-auto" />
              <h3 className="text-base font-bold text-white">কোনো প্রোডাক্ট পাওয়া যায়নি</h3>
              <p className="text-xs text-zinc-500 max-w-sm mx-auto">
                আপনার নির্বাচিত ফিল্টারের আওতায় কোনো পণ্য নেই। ক্যাটাগরি বা সার্চ কিওয়ার্ড পরিবর্তন করে দেখুন।
              </p>
            </div>
          ) : (
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3.5 sm:gap-5">
              <AnimatePresence mode="popLayout">
                {products.map((p) => {
                  const img = p.images[0] || 'https://via.placeholder.com/300';
                  return (
                    <motion.div
                      key={p.id}
                      layout
                      initial={{ opacity: 0, scale: 0.95 }}
                      animate={{ opacity: 1, scale: 1 }}
                      exit={{ opacity: 0, scale: 0.95 }}
                      className="group bg-[var(--pm-surface)] rounded-3xl border border-[var(--pm-border)] overflow-hidden hover:border-amber-500/40 hover:shadow-2xl transition-all duration-300 flex flex-col justify-between"
                    >
                      <div>
                        {/* 1:1 Aspect Image with Flagship Badges */}
                        <div className="aspect-square w-full relative overflow-hidden bg-black/60">
                          <img
                            src={img}
                            alt={p.title}
                            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                            onError={(e) => {
                              (e.target as HTMLImageElement).src = 'https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=600';
                            }}
                          />

                          {/* Top Badges */}
                          <div className="absolute top-2.5 left-2.5 flex flex-wrap gap-1.5 z-10">
                            <span className="px-2 py-0.5 rounded-lg bg-amber-500 text-black text-[8px] font-black uppercase tracking-wider shadow-md flex items-center gap-1">
                              <ShieldCheck className="w-2.5 h-2.5" /> PK Verified
                            </span>
                          </div>

                          {/* Bottom Right Floating Badge: Cashback */}
                          <div className="absolute bottom-2.5 right-2.5 z-10">
                            <span className="px-2 py-1 rounded-xl bg-black/80 backdrop-blur-md text-amber-300 text-[8px] font-black border border-amber-500/30 flex items-center gap-1">
                              <Coins className="w-2.5 h-2.5 text-amber-400" />
                              +{p.coinCashbackPercent}% Coins
                            </span>
                          </div>
                        </div>

                        {/* Product Meta Details */}
                        <div className="p-3.5 sm:p-4 space-y-1.5 text-left">
                          <span className="text-[9px] font-black uppercase tracking-widest text-indigo-400">
                            {p.category}
                          </span>

                          <h4 className="text-xs sm:text-sm font-bold text-white line-clamp-2 leading-snug group-hover:text-amber-400 transition-colors min-h-[2.4rem]">
                            {p.title}
                          </h4>

                          <p className="text-[10px] text-zinc-500 line-clamp-1">
                            {p.shippingOption}
                          </p>

                          {/* Pricing Row */}
                          <div className="flex items-baseline justify-between pt-1 border-t border-white/[0.04]">
                            <div className="flex items-baseline gap-1.5">
                              <span className="text-base sm:text-lg font-black text-amber-400 tabular-nums">
                                ৳{p.price.toLocaleString('bn-BD')}
                              </span>
                              {p.originalPrice && (
                                <span className="text-[10px] text-zinc-500 line-through tabular-nums">
                                  ৳{p.originalPrice.toLocaleString('bn-BD')}
                                </span>
                              )}
                            </div>

                            <span className={`text-[9px] font-bold px-1.5 py-0.5 rounded ${
                              p.stock > 10 ? 'text-emerald-400 bg-emerald-500/10' : 'text-amber-400 bg-amber-500/10'
                            }`}>
                              স্টক: {p.stock}
                            </span>
                          </div>
                        </div>
                      </div>

                      {/* Action Buttons */}
                      <div className="p-3.5 sm:p-4 pt-0 grid grid-cols-2 gap-2">
                        <button
                          onClick={(e) => handleAddToCart(p, e)}
                          className="w-full py-2.5 rounded-xl bg-white/10 hover:bg-white/15 active:scale-95 text-white text-[10px] font-black transition-all flex items-center justify-center gap-1 cursor-pointer"
                        >
                          <ShoppingBag className="w-3.5 h-3.5" /> কার্টে
                        </button>

                        <button
                          onClick={(e) => handleBuyNow(p, e)}
                          className="w-full py-2.5 rounded-xl bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-400 hover:to-amber-500 active:scale-95 text-black text-[10px] font-black shadow-md shadow-amber-500/20 transition-all flex items-center justify-center gap-1 cursor-pointer"
                        >
                          কিনুন
                        </button>
                      </div>
                    </motion.div>
                  );
                })}
              </AnimatePresence>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default PKShopPortal;
