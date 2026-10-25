import React, { useState, useEffect, useMemo } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  ArrowLeft, Store, MapPin, Clock, Phone, MessageSquare, 
  Share2, Star, Search, Plus, Minus, ShoppingBag, ShieldCheck, 
  Bike, AlertCircle, Check, Loader2, Sparkles, Navigation
} from 'lucide-react';
import { HomeHeader } from '@/design-system/components/home/HomeHeader';
import { useCartStore, useCartDrawerStore } from '@/modules/cart';
import { ChatModal } from '@/modules/chat';
import { useLanguage } from '@/modules/language';
import { toast } from 'sonner';
import { safeBack } from '@/lib/navigation';

interface ShopProduct {
  id: string;
  name: string;
  category: string;
  price: number;
  originalPrice?: number;
  unit: string;
  image: string;
  stock: number;
  description: string;
}

interface LocalShopDetail {
  id: string;
  name: string;
  avatar: string;
  coverImage?: string;
  rating: number;
  reviewCount: number;
  activeProductsCount?: number;
  isVerified: boolean;
  category: string;
  categoryBn?: string;
  storeType: string;
  distance: number;
  deliveryTime: string;
  isOpen: boolean;
  address: string;
  phone?: string;
  whatsapp?: string;
  openingHours?: string;
  deliveryFee?: number;
  minOrder?: number;
  freeDeliveryThreshold?: number;
  categories?: string[];
  popularItems?: ShopProduct[];
}

export const LocalShopDetailPage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { isBn } = useLanguage();
  const [shop, setShop] = useState<LocalShopDetail | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('সব পণ্য');
  const [isChatOpen, setIsChatOpen] = useState(false);

  const { items, addItem, updateQuantity, removeItem } = useCartStore();
  const openCart = useCartDrawerStore((state) => state.open);

  // Fetch shop details from backend
  useEffect(() => {
    let isMounted = true;
    async function fetchShop() {
      setIsLoading(true);
      try {
        const res = await fetch(`/api/v1/nearby/shops/${id}`);
        if (res.ok) {
          const json = await res.json();
          const shopData = json.data || json;
          if (isMounted && shopData) {
            setShop(shopData);
            if (shopData.categories && shopData.categories.length > 0) {
              setSelectedCategory(shopData.categories[0]);
            }
          }
        } else {
          // Fallback if not found on /shops/:id, try /:id
          const fallbackRes = await fetch(`/api/v1/nearby/${id}`);
          if (fallbackRes.ok) {
            const fallbackJson = await fallbackRes.json();
            if (isMounted) setShop(fallbackJson.data || fallbackJson);
          }
        }
      } catch (err) {
        console.warn('Shop detail fetch error, using resilient store profile:', err);
      } finally {
        if (isMounted) setIsLoading(false);
      }
    }
    fetchShop();
    return () => { isMounted = false; };
  }, [id]);

  // Filter products by search and category
  const products = useMemo(() => {
    if (!shop?.popularItems) return [];
    return shop.popularItems.filter((p) => {
      const matchSearch = p.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                          p.description?.toLowerCase().includes(searchQuery.toLowerCase());
      const matchCat = selectedCategory === 'সব পণ্য' || p.category === selectedCategory;
      return matchSearch && matchCat;
    });
  }, [shop, searchQuery, selectedCategory]);

  const handleShare = () => {
    if (navigator.share) {
      navigator.share({
        title: shop?.name || 'Paikar Mart Local Shop',
        url: window.location.href,
      }).catch(() => {});
    } else {
      navigator.clipboard.writeText(window.location.href);
      toast.success('দোকানের লিংক কপি করা হয়েছে!');
    }
  };

  const handleAddToCart = (product: ShopProduct) => {
    addItem({
      id: product.id,
      name: product.name,
      price: product.price,
      originalPrice: product.originalPrice,
      image: product.image,
      quantity: 1,
      moq: 1,
      vendorName: shop?.name || 'Local Shop',
      portal: 'b2c',
      domain: 'food',
      stock: product.stock,
    });
    toast.success(`${product.name} কার্টে যোগ হয়েছে!`);
  };

  const getCartQuantity = (productId: string) => {
    const found = items.find((item) => item.id === productId);
    return found ? found.quantity : 0;
  };

  // Calculate items in cart belonging to this shop
  const shopCartItems = useMemo(() => {
    if (!shop) return [];
    return items.filter(i => i.vendorName === shop.name);
  }, [items, shop]);

  const shopCartTotal = useMemo(() => {
    return shopCartItems.reduce((acc, curr) => acc + curr.price * curr.quantity, 0);
  }, [shopCartItems]);

  if (isLoading) {
    return (
      <div className="min-h-screen bg-[var(--pm-bg)] text-[var(--pm-text)] pb-20">
        <HomeHeader />
        <div className="max-w-7xl mx-auto px-4 py-16 flex flex-col items-center justify-center space-y-4">
          <Loader2 className="w-10 h-10 animate-spin text-cyan-400" />
          <p className="text-sm font-bold text-zinc-400">দোকানের তথ্য ও প্রোডাক্ট ক্যাটালগ লোড হচ্ছে...</p>
        </div>
      </div>
    );
  }

  if (!shop) {
    return (
      <div className="min-h-screen bg-[var(--pm-bg)] text-[var(--pm-text)] pb-20">
        <HomeHeader />
        <div className="max-w-md mx-auto px-4 py-20 text-center space-y-4">
          <Store className="w-16 h-16 text-zinc-600 mx-auto" />
          <h2 className="text-lg font-black text-white">দোকানটি পাওয়া যায়নি</h2>
          <p className="text-xs text-zinc-400">এই আইডি-র কোনো সক্রিয় লোকাল দোকান খুঁজে পাওয়া যায়নি।</p>
          <button
            onClick={() => navigate('/nearby')}
            className="px-6 py-2.5 bg-cyan-500 hover:bg-cyan-400 text-black font-black text-xs uppercase tracking-wider rounded-xl transition-all cursor-pointer"
          >
            অন্যান্য দোকান দেখুন
          </button>
        </div>
      </div>
    );
  }

  const freeDeliveryRemaining = (shop.freeDeliveryThreshold || 500) - shopCartTotal;

  return (
    <div className="min-h-screen bg-[var(--pm-bg)] text-[var(--pm-text)] pb-28 select-none">
      <HomeHeader />

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 sm:py-6 space-y-6">
        
        {/* Navigation Bar */}
        <div className="flex items-center justify-between">
          <button
            onClick={() => safeBack(navigate, '/nearby')}
            className="flex items-center gap-2 px-3.5 py-2 rounded-2xl bg-[var(--pm-surface)] hover:bg-[var(--pm-surface-hover)] border border-[var(--pm-border)] text-xs font-bold transition-all cursor-pointer shadow-xs active:scale-95"
          >
            <ArrowLeft className="w-4 h-4 text-zinc-300" />
            <span>কাছের দোকানে ফিরে যান</span>
          </button>

          <div className="flex items-center gap-2">
            <button
              onClick={handleShare}
              className="p-2.5 rounded-2xl bg-[var(--pm-surface)] hover:bg-[var(--pm-surface-hover)] border border-[var(--pm-border)] text-zinc-300 hover:text-white transition-all cursor-pointer active:scale-95 shadow-xs"
              title="শেয়ার করুন"
            >
              <Share2 className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Hero Cover & Shop Identity Card */}
        <div className="bg-[var(--pm-surface)] border border-[var(--pm-border)] rounded-3xl overflow-hidden shadow-xl">
          {/* Cover Photo */}
          <div className="w-full h-44 sm:h-64 relative bg-zinc-900 overflow-hidden">
            <img
              src={shop.coverImage || shop.avatar}
              alt={shop.name}
              className="w-full h-full object-cover"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-[var(--pm-surface)] via-black/40 to-black/20" />

            {/* Badges on cover */}
            <div className="absolute top-4 left-4 flex items-center gap-2">
              <span className={`px-3 py-1 rounded-full text-xs font-black uppercase tracking-wider backdrop-blur-md shadow-md border ${
                shop.isOpen
                  ? "bg-emerald-600/90 text-white border-emerald-400/40"
                  : "bg-rose-600/90 text-white border-rose-400/40"
              }`}>
                {shop.isOpen ? "খোলা আছে (Open)" : "এখন বন্ধ (Closed)"}
              </span>
              <span className="px-3 py-1 rounded-full text-xs font-bold bg-black/75 backdrop-blur-md text-white border border-white/10">
                {shop.categoryBn || shop.category}
              </span>
            </div>

            <div className="absolute bottom-4 right-4 flex items-center gap-2 bg-black/80 backdrop-blur-md px-3.5 py-1.5 rounded-2xl border border-white/15 text-xs font-bold text-white shadow-lg">
              <Bike className="w-4 h-4 text-cyan-400" />
              <span>ডেলিভারি: {shop.deliveryTime}</span>
            </div>
          </div>

          {/* Shop Details Container */}
          <div className="p-5 sm:p-7 space-y-5">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
              <div className="flex items-start gap-4">
                <div className="w-16 h-16 sm:w-20 sm:h-20 rounded-2xl overflow-hidden border-2 border-cyan-400/30 shrink-0 bg-zinc-900 shadow-md">
                  <img src={shop.avatar} alt={shop.name} className="w-full h-full object-cover" />
                </div>
                <div className="space-y-1">
                  <div className="flex items-center gap-2 flex-wrap">
                    <h1 className="text-xl sm:text-2xl font-black text-white">{shop.name}</h1>
                    {shop.isVerified && (
                      <span className="flex items-center gap-1 px-2 py-0.5 rounded-md bg-cyan-500/10 text-cyan-400 border border-cyan-500/20 text-[10px] font-black uppercase">
                        <ShieldCheck className="w-3 h-3" /> ভেরিফায়েড শপ
                      </span>
                    )}
                  </div>
                  <p className="text-xs text-[var(--pm-text-muted)] flex items-center gap-1.5">
                    <MapPin className="w-3.5 h-3.5 text-rose-500 shrink-0" />
                    <span>{shop.address}</span>
                    <span className="text-cyan-400 font-bold">({shop.distance} কিমি দূরত্ব)</span>
                  </p>
                  <div className="flex items-center gap-3 text-xs pt-1 flex-wrap">
                    <div className="flex items-center gap-1 text-amber-400 bg-amber-500/10 px-2 py-0.5 rounded-lg font-black">
                      <Star className="w-3.5 h-3.5 fill-amber-400" />
                      <span>{shop.rating}</span>
                      <span className="text-zinc-500 font-normal">({shop.reviewCount} রিভিউ)</span>
                    </div>
                    {shop.openingHours && (
                      <div className="flex items-center gap-1 text-zinc-400">
                        <Clock className="w-3.5 h-3.5 text-zinc-500" />
                        <span>{shop.openingHours}</span>
                      </div>
                    )}
                  </div>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="flex items-center gap-2 self-start md:self-auto flex-wrap">
                {shop.phone && (
                  <a
                    href={`tel:${shop.phone}`}
                    className="flex items-center gap-1.5 px-4 py-2.5 rounded-2xl bg-white/5 hover:bg-white/10 border border-white/10 text-white text-xs font-bold transition-all active:scale-95 shadow-xs"
                  >
                    <Phone className="w-3.5 h-3.5 text-emerald-400" />
                    <span>সরাসরি কল</span>
                  </a>
                )}
                <button
                  type="button"
                  onClick={() => setIsChatOpen(true)}
                  className="flex items-center gap-1.5 px-4 py-2.5 rounded-2xl bg-cyan-500/15 hover:bg-cyan-500/25 border border-cyan-500/30 text-cyan-300 text-xs font-black uppercase tracking-wider transition-all active:scale-95 shadow-xs cursor-pointer"
                >
                  <MessageSquare className="w-3.5 h-3.5 text-cyan-400" />
                  <span>দোকানদারের সাথে চ্যাট</span>
                </button>
              </div>
            </div>

            {/* Delivery Terms & Guarantees */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 pt-3 border-t border-[var(--pm-border)]/50 text-xs">
              <div className="p-3 rounded-2xl bg-black/20 border border-white/5 flex items-center gap-3">
                <Bike className="w-5 h-5 text-emerald-400 shrink-0" />
                <div>
                  <div className="font-bold text-white">ডেলিভারি ফি ৳{shop.deliveryFee || 30}</div>
                  <div className="text-[11px] text-zinc-400">১৫-২৫ মিনিটে রাইডার সার্ভিস</div>
                </div>
              </div>
              <div className="p-3 rounded-2xl bg-black/20 border border-white/5 flex items-center gap-3">
                <Sparkles className="w-5 h-5 text-amber-400 shrink-0" />
                <div>
                  <div className="font-bold text-white">ফ্রি ডেলিভারি ৳{shop.freeDeliveryThreshold || 500}+</div>
                  <div className="text-[11px] text-zinc-400">নির্দিষ্ট অ্যামাউন্টের অর্ডারে ফি ফ্রি</div>
                </div>
              </div>
              <div className="p-3 rounded-2xl bg-black/20 border border-white/5 flex items-center gap-3">
                <ShieldCheck className="w-5 h-5 text-cyan-400 shrink-0" />
                <div>
                  <div className="font-bold text-white">১০০% নির্ভেজাল গ্যারান্টি</div>
                  <div className="text-[11px] text-zinc-400">দোকানের একই খুচরা মূল্যে পণ্য</div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Catalog Search & Category Filters */}
        <div className="space-y-4">
          <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3">
            <div className="relative flex-1">
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-zinc-500" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder={`${shop.name}-এর পণ্য খুঁজুন...`}
                className="w-full h-12 pl-11 pr-4 bg-[var(--pm-surface)] border border-[var(--pm-border)] rounded-2xl text-xs text-white placeholder:text-zinc-500 focus:outline-none focus:border-cyan-400 transition-colors shadow-xs"
              />
            </div>

            {/* Product Count Pill */}
            <div className="px-3.5 py-2.5 rounded-2xl bg-[var(--pm-surface)] border border-[var(--pm-border)] text-xs text-zinc-400 font-bold shrink-0 text-center">
              প্রদর্শিত পণ্য: <strong className="text-white">{products.length}টি</strong>
            </div>
          </div>

          {/* Category Tabs */}
          {shop.categories && shop.categories.length > 0 && (
            <div className="flex gap-2 overflow-x-auto pb-2 no-scrollbar">
              {shop.categories.map((cat) => (
                <button
                  key={cat}
                  onClick={() => setSelectedCategory(cat)}
                  className={`px-4 py-2 rounded-xl text-xs font-bold transition-all whitespace-nowrap border shrink-0 cursor-pointer ${
                    selectedCategory === cat
                      ? "bg-cyan-500 text-black border-cyan-400 font-black shadow-md shadow-cyan-500/20"
                      : "bg-[var(--pm-surface)] hover:bg-[var(--pm-surface-hover)] text-zinc-400 hover:text-white border-[var(--pm-border)]"
                  }`}
                >
                  {cat}
                </button>
              ))}
            </div>
          )}
        </div>

        {/* Products Grid */}
        {products.length === 0 ? (
          <div className="py-20 text-center rounded-3xl bg-[var(--pm-surface)] border border-[var(--pm-border)] space-y-3">
            <ShoppingBag className="w-12 h-12 text-zinc-600 mx-auto" />
            <h3 className="text-base font-bold text-white">কোনো পণ্য পাওয়া যায়নি</h3>
            <p className="text-xs text-zinc-400">সার্চ কিওয়ার্ড পরিবর্তন করে পুনরায় চেষ্টা করুন</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 sm:gap-5">
            {products.map((product) => {
              const qty = getCartQuantity(product.id);
              const discount = product.originalPrice 
                ? Math.round(((product.originalPrice - product.price) / product.originalPrice) * 100) 
                : 0;

              return (
                <div
                  key={product.id}
                  className="bg-[var(--pm-surface)] rounded-2xl border border-[var(--pm-border)] overflow-hidden hover:border-cyan-400/40 hover:shadow-xl transition-all duration-300 flex flex-col justify-between group"
                >
                  <div>
                    {/* Product Image */}
                    <div className="aspect-[4/3] w-full relative overflow-hidden bg-black/20">
                      <img
                        src={product.image}
                        alt={product.name}
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                      />
                      {discount > 0 && (
                        <div className="absolute top-2.5 left-2.5 px-2 py-0.5 rounded-lg bg-rose-500 text-white font-black text-[10px] shadow-md">
                          {discount}% ছাড়
                        </div>
                      )}
                      <div className="absolute bottom-2 right-2 px-2 py-0.5 rounded-lg bg-black/75 backdrop-blur-md text-zinc-300 font-bold text-[10px] border border-white/10">
                        {product.unit}
                      </div>
                    </div>

                    {/* Product Details */}
                    <div className="p-4 space-y-2">
                      <span className="text-[10px] font-black uppercase text-cyan-400 tracking-wider">
                        {product.category}
                      </span>
                      <h3 className="text-xs sm:text-sm font-bold text-white line-clamp-2 leading-tight">
                        {product.name}
                      </h3>
                      {product.description && (
                        <p className="text-[11px] text-zinc-400 line-clamp-2 leading-relaxed">
                          {product.description}
                        </p>
                      )}
                    </div>
                  </div>

                  {/* Price & Add to Cart Action */}
                  <div className="p-4 pt-0">
                    <div className="flex items-center justify-between pt-3 border-t border-[var(--pm-border)]/50">
                      <div>
                        <div className="text-base font-black text-cyan-300">
                          ৳{product.price}
                        </div>
                        {product.originalPrice && product.originalPrice > product.price && (
                          <div className="text-[10px] text-zinc-500 line-through">
                            ৳{product.originalPrice}
                          </div>
                        )}
                      </div>

                      {qty === 0 ? (
                        <button
                          type="button"
                          onClick={() => handleAddToCart(product)}
                          className="px-3.5 py-2 rounded-xl bg-cyan-500 hover:bg-cyan-400 text-black font-black text-xs uppercase tracking-wider flex items-center gap-1.5 transition-all active:scale-95 shadow-md shadow-cyan-500/20 cursor-pointer"
                        >
                          <Plus className="w-3.5 h-3.5" />
                          <span>কার্টে যোগ</span>
                        </button>
                      ) : (
                        <div className="flex items-center gap-2 bg-black/30 border border-cyan-500/30 rounded-xl p-1">
                          <button
                            type="button"
                            onClick={() => {
                              if (qty === 1) removeItem(product.id);
                              else updateQuantity(product.id, qty - 1);
                            }}
                            className="w-7 h-7 rounded-lg bg-white/10 hover:bg-white/20 text-white flex items-center justify-center transition-all active:scale-90"
                          >
                            <Minus className="w-3.5 h-3.5" />
                          </button>
                          <span className="text-xs font-black text-white px-1">{qty}</span>
                          <button
                            type="button"
                            onClick={() => updateQuantity(product.id, qty + 1)}
                            className="w-7 h-7 rounded-lg bg-cyan-500 hover:bg-cyan-400 text-black flex items-center justify-center transition-all active:scale-90"
                          >
                            <Plus className="w-3.5 h-3.5" />
                          </button>
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}

      </main>

      {/* Floating Bottom Cart Bar for this Shop */}
      {shopCartItems.length > 0 && (
        <motion.div
          initial={{ y: 50, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          className="fixed bottom-4 left-4 right-4 max-w-xl mx-auto z-40"
        >
          <div className="bg-gradient-to-r from-emerald-600 to-teal-700 text-white rounded-2xl p-4 shadow-2xl flex items-center justify-between border border-emerald-400/30 backdrop-blur-xl">
            <div className="space-y-0.5">
              <div className="flex items-center gap-2">
                <span className="text-xs font-black uppercase tracking-wider bg-black/30 px-2 py-0.5 rounded-md">
                  {shopCartItems.length}টি আইটেম
                </span>
                <span className="text-sm font-black">মোট: ৳{shopCartTotal}</span>
              </div>
              <div className="text-[11px] text-emerald-100">
                {freeDeliveryRemaining > 0 
                  ? `আর মাত্র ৳${freeDeliveryRemaining} অর্ডারে ফ্রি ডেলিভারি!` 
                  : '🎉 অভিনন্দন! আপনি ফ্রি ডেলিভারি পাচ্ছেন!'}
              </div>
            </div>

            <button
              onClick={openCart}
              className="px-5 py-2.5 bg-white text-emerald-800 hover:bg-emerald-50 rounded-xl text-xs font-black uppercase tracking-wider shadow-md transition-all active:scale-95 cursor-pointer flex items-center gap-1.5"
            >
              <span>কার্ট দেখুন</span>
              <ShoppingBag className="w-4 h-4" />
            </button>
          </div>
        </motion.div>
      )}

      {/* Live Chat Modal with Store Keeper */}
      {isChatOpen && (
        <ChatModal
          isOpen={isChatOpen}
          onClose={() => setIsChatOpen(false)}
          vendorId={shop.id}
          vendorName={shop.name}
          productName="লোকাল শপ ক্যাটালগ ও ডেলিভারি অনুসন্ধান"
        />
      )}
    </div>
  );
};

export default LocalShopDetailPage;
