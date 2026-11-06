import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  Store, ShoppingBag, Search, Filter, ArrowUpDown, 
  Plus, Share2, Star, Clock, ShieldCheck, 
  ChevronRight, LayoutGrid, List, SlidersHorizontal,
  Smartphone, Zap, Shirt, UtensilsCrossed, Settings,
  Eye, ShoppingCart, Heart, RefreshCw, MessageCircle,
  Truck, CheckCircle2
} from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { useCartStore } from '@/modules/cart';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { toast } from 'sonner';

interface Product {
  id: string;
  name: string;
  nameBn: string;
  price: number;
  category: string;
  categoryBn: string;
  rating: number;
  reviews: number;
  image: string;
  stock: number;
  isService?: boolean;
  moq?: number;
  isWholesale?: boolean;
}

const MOCK_PRODUCTS: Product[] = [
  { id: '1', name: 'Premium Cotton T-Shirt', nameBn: 'প্রিমিয়াম কটন টি-শার্ট', price: 450, category: 'Fashion', categoryBn: 'ফ্যাশন', rating: 4.8, reviews: 124, image: 'https://images.unsplash.com/photo-1521572267360-ee0c2909d518?w=400&q=80', stock: 85, isWholesale: true, moq: 12 },
  { id: '2', name: 'Wireless Noise Cancelling Headphones', nameBn: 'ওয়্যারলেস হেডফোন', price: 2500, category: 'Electronics', categoryBn: 'ইলেকট্রনিক্স', rating: 4.9, reviews: 89, image: 'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=400&q=80', stock: 12, isWholesale: false },
  { id: '3', name: 'Home Cleaning Service', nameBn: 'হোম ক্লিনিং সার্ভিস', price: 1200, category: 'Services', categoryBn: 'সার্ভিস', rating: 4.7, reviews: 56, image: 'https://images.unsplash.com/photo-1581578731548-c64695ce6958?w=400&q=80', stock: 1, isService: true },
  { id: '4', name: 'Handmade Leather Wallet', nameBn: 'হ্যান্ডমেড লেদার ওয়ালেট', price: 850, category: 'Fashion', categoryBn: 'ফ্যাশন', rating: 4.6, reviews: 45, image: 'https://images.unsplash.com/photo-1627123424574-724758594e93?w=400&q=80', stock: 0, isWholesale: true, moq: 5 },
  { id: '5', name: 'Organic Honey (500g)', nameBn: 'অর্গানিক মধু', price: 650, category: 'Food', categoryBn: 'খাবার', rating: 4.9, reviews: 210, image: 'https://images.unsplash.com/photo-1587049352846-4a222e784d38?w=400&q=80', stock: 45, isWholesale: true, moq: 20 },
  { id: '6', name: 'Smartphone Tripod Mount', nameBn: 'স্মার্টফোন ট্রাইপড মাউন্ট', price: 350, category: 'Electronics', categoryBn: 'ইলেকট্রনিক্স', rating: 4.5, reviews: 34, image: 'https://images.unsplash.com/photo-1563227812-0ea4c22e6cc8?w=400&q=80', stock: 20, isWholesale: true, moq: 50 },
];

const CATEGORIES = [
  { id: 'all', label: 'All', labelBn: 'সবগুলো', icon: LayoutGrid },
  { id: 'Fashion', label: 'Fashion', labelBn: 'ফ্যাশন', icon: Shirt },
  { id: 'Electronics', label: 'Electronics', labelBn: 'ইলেকট্রনিক্স', icon: Smartphone },
  { id: 'Food', label: 'Food', labelBn: 'খাবার', icon: UtensilsCrossed },
  { id: 'Services', label: 'Services', labelBn: 'সার্ভিস', icon: Settings },
];

export function PublicSellerStoreFront({ sellerName = "PaikarMart Official Store", isBilingual = true, hideHeader = false }) {
  const navigate = useNavigate();
  const addItem = useCartStore((state) => state.addItem);
  const [activeCategory, setActiveCategory] = useState('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');
  const [isFollowing, setIsFollowing] = useState(false);

  const filteredProducts = MOCK_PRODUCTS.filter(p => 
    (activeCategory === 'all' || p.category === activeCategory) &&
    (p.name.toLowerCase().includes(searchQuery.toLowerCase()) || p.nameBn.includes(searchQuery))
  );

  const t = (en: string, bn: string) => isBilingual ? bn : en;

  return (
    <div className={`w-full max-w-[1440px] mx-auto space-y-6 animate-in fade-in duration-700 ${hideHeader ? '' : 'pb-12'}`}>
      
      {/* ── STORE HEADER ── */}
      {!hideHeader && (
        <div className="relative rounded-[2rem] overflow-hidden bg-[var(--pm-surface)] border border-white/10 shadow-2xl">
          <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-[var(--pm-accent)]/5 rounded-full blur-[100px] pointer-events-none" />
          
          {/* Cover Image Placeholder */}
          <div className="h-40 md:h-64 bg-gradient-to-br from-[var(--pm-surface)] via-zinc-900 to-black relative">
            <div className="absolute inset-0 bg-black/40 backdrop-blur-[2px]" />
            <img 
              src="https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?w=1400&q=80" 
              className="w-full h-full object-cover opacity-30" 
              alt="Store Cover"
            />
          </div>

          <div className="px-6 md:px-12 pb-10 -mt-20 md:-mt-24 relative z-10">
            <div className="flex flex-col md:flex-row items-center md:items-end gap-6 text-center md:text-left">
              <div className="relative group">
                <div className="w-32 h-32 md:w-44 md:h-44 rounded-[2.5rem] bg-black border-4 border-[var(--pm-surface)] shadow-2xl overflow-hidden flex items-center justify-center relative transition-transform duration-500 group-hover:scale-[1.02]">
                  <Store className="w-16 h-16 md:w-24 md:h-24 text-[var(--pm-accent)]" />
                </div>
              </div>

              <div className="flex-1 pb-2 space-y-4">
                <div className="flex flex-wrap items-center justify-center md:justify-start gap-4">
                  <h1 className="text-3xl md:text-5xl font-black text-white uppercase tracking-tighter leading-none">{sellerName}</h1>
                  <div className="flex items-center gap-1.5 px-4 py-1.5 rounded-full bg-emerald-500/10 border border-emerald-500/20 text-[10px] font-black text-emerald-400 uppercase tracking-widest">
                    <ShieldCheck className="w-4 h-4" />
                    VERIFIED MERCHANT
                  </div>
                </div>
                <div className="flex flex-wrap items-center justify-center md:justify-start gap-x-8 gap-y-3 text-zinc-400 text-[11px] font-black uppercase tracking-[0.2em]">
                  <span className="flex items-center gap-2.5"><ShoppingBag className="w-4.5 h-4.5 text-[var(--pm-accent)]/60" /> 45 {t('Products', 'পণ্য')}</span>
                  <span className="flex items-center gap-2.5"><Star className="w-4.5 h-4.5 text-amber-500/60" /> 4.9 (1.2k {t('Reviews', 'রিভিউ')})</span>
                  <span className="flex items-center gap-2.5"><Clock className="w-4.5 h-4.5 text-blue-500/60" /> Joined 2 {t('Years Ago', 'বছর আগে')}</span>
                  <span className="flex items-center gap-2.5"><Truck className="w-4.5 h-4.5 text-emerald-500/60" /> Fast Shipping</span>
                </div>
              </div>

              <div className="flex gap-4 pb-2 w-full md:w-auto">
                <Button size="lg" variant="outline" className="flex-1 md:flex-none rounded-2xl border-white/10 hover:bg-white/5 text-[10px] font-black uppercase tracking-widest h-14 px-8 gap-2.5 text-zinc-300">
                  <Share2 className="w-5 h-5" />
                  {t('Share', 'শেয়ার')}
                </Button>
                <Button 
                  onClick={() => setIsFollowing(!isFollowing)}
                  size="lg" 
                  className={`flex-1 md:flex-none rounded-2xl font-black text-[10px] uppercase tracking-widest h-14 px-10 transition-all active:scale-95 ${
                    isFollowing ? 'bg-white/10 text-[var(--pm-accent)] border border-[var(--pm-accent)]/20' : 'bg-[var(--pm-accent)] hover:bg-[var(--pm-accent-hover)] text-white shadow-xl shadow-[var(--pm-accent)]/20'
                  }`}
                >
                  {isFollowing ? t('Following', 'ফলো করছেন') : t('Follow', 'ফলো করুন')}
                </Button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* ── FILTER & TOOLS BAR ── */}
      <div className="flex flex-col lg:flex-row gap-4 items-center justify-between sticky top-4 z-20 bg-[var(--pm-surface)]/90 backdrop-blur-2xl p-4 rounded-[2rem] border border-white/10 shadow-2xl">
        <div className="flex items-center gap-2 overflow-x-auto pb-2 lg:pb-0 no-scrollbar w-full lg:w-auto px-1">
          {CATEGORIES.map((cat) => {
            const Icon = cat.icon;
            const isActive = activeCategory === cat.id;
            return (
              <button
                key={cat.id}
                onClick={() => setActiveCategory(cat.id)}
                className={`flex items-center gap-2.5 px-5 py-3 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all whitespace-nowrap border ${
                  isActive 
                    ? 'bg-[var(--pm-accent)]/10 border-[var(--pm-accent)]/30 text-[var(--pm-accent)] shadow-inner' 
                    : 'bg-white/5 border-transparent text-zinc-500 hover:bg-white/10 hover:text-white'
                }`}
              >
                <Icon className={`w-4 h-4 ${isActive ? 'text-[var(--pm-accent)]' : 'text-zinc-500'}`} />
                {t(cat.label, cat.labelBn)}
              </button>
            );
          })}
        </div>

        <div className="flex items-center gap-3 w-full lg:w-auto px-1">
          <div className="relative flex-1 lg:w-80">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4.5 h-4.5 text-zinc-600" />
            <Input 
              placeholder={t('Search in store...', 'দোকানে খুঁজুন...')}
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="bg-black/30 border-white/10 pl-12 h-12 text-xs font-bold rounded-xl focus:ring-[var(--pm-accent)]/20 placeholder:text-zinc-700"
            />
          </div>
          <Button variant="outline" size="icon" className="rounded-xl border-white/10 hover:bg-white/5 h-12 w-12 shrink-0 text-zinc-500">
            <ArrowUpDown className="w-5 h-5" />
          </Button>
          <div className="hidden md:flex p-1.5 bg-black/40 rounded-xl border border-white/10 shrink-0">
            <button 
              onClick={() => setViewMode('grid')}
              className={`p-2.5 rounded-lg transition-all ${viewMode === 'grid' ? 'bg-[var(--pm-accent)]/20 text-[var(--pm-accent)] shadow-xs' : 'text-zinc-600 hover:text-zinc-400'}`}
            >
              <LayoutGrid className="w-5 h-5" />
            </button>
            <button 
              onClick={() => setViewMode('list')}
              className={`p-2.5 rounded-lg transition-all ${viewMode === 'list' ? 'bg-[var(--pm-accent)]/20 text-[var(--pm-accent)] shadow-xs' : 'text-zinc-600 hover:text-zinc-400'}`}
            >
              <List className="w-5 h-5" />
            </button>
          </div>
        </div>
      </div>

      {/* ── PRODUCTS GRID ── */}
      {filteredProducts.length > 0 ? (
        <div className={`grid gap-5 sm:gap-8 ${viewMode === 'grid' ? 'grid-cols-2 md:grid-cols-3 xl:grid-cols-4' : 'grid-cols-1'}`}>
          <AnimatePresence mode="popLayout">
            {filteredProducts.map((product, idx) => (
              <motion.div
                key={product.id}
                layout
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, scale: 0.9 }}
                transition={{ duration: 0.4, delay: idx * 0.05 }}
                className={`group relative bg-[var(--pm-surface)]/80 border border-white/5 rounded-[2rem] overflow-hidden hover:border-[var(--pm-accent)]/40 transition-all duration-500 shadow-xl ${viewMode === 'list' ? 'flex gap-8 h-56 md:h-64' : 'flex flex-col h-full'}`}
              >
                {/* Image Section */}
                <div className={`relative overflow-hidden ${viewMode === 'list' ? 'w-56 md:w-80 h-full shrink-0' : 'aspect-square w-full'}`}>
                  <img 
                    src={product.image} 
                    alt={product.name} 
                    className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700 ease-out"
                    referrerPolicy="no-referrer"
                  />
                  
                  {/* Badges */}
                  <div className="absolute top-4 left-4 flex flex-col gap-2">
                    {product.isWholesale && (
                      <div className="bg-amber-500 text-black text-[9px] font-black px-3 py-1 rounded-lg uppercase tracking-wider shadow-lg flex items-center gap-1.5">
                        <Store className="w-3.5 h-3.5" />
                        Wholesale
                      </div>
                    )}
                    {product.isService && (
                      <div className="bg-sky-500 text-white text-[9px] font-black px-3 py-1 rounded-lg uppercase tracking-wider shadow-lg">
                        Service
                      </div>
                    )}
                  </div>

                  <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-all duration-300 flex items-end justify-center p-6">
                    <Button 
                      onClick={() => navigate(`/product/${product.id}`)}
                      size="sm" 
                      className="w-full bg-[var(--pm-accent)] hover:bg-[var(--pm-accent-hover)] text-white font-black text-[10px] uppercase tracking-widest rounded-xl h-11 shadow-lg shadow-[var(--pm-accent)]/20"
                    >
                      {t('Quick View', 'দ্রুত দেখুন')}
                    </Button>
                  </div>

                  {product.stock === 0 && (
                    <div className="absolute inset-0 bg-black/70 backdrop-blur-[3px] flex items-center justify-center">
                      <span className="bg-rose-600 text-white text-[10px] font-black px-5 py-2.5 rounded-full uppercase tracking-widest shadow-2xl">
                        Out of Stock
                      </span>
                    </div>
                  )}
                </div>

                {/* Content Section */}
                <div className="p-5 md:p-6 flex flex-col flex-1 justify-between text-left space-y-4">
                  <div className="space-y-2">
                    <div className="flex justify-between items-center">
                      <span className="text-[10px] text-zinc-500 font-black uppercase tracking-[0.2em]">{t(product.category, product.categoryBn)}</span>
                      <div className="flex items-center gap-1.5 text-[11px] text-amber-500 font-black">
                        <Star className="w-4 h-4 fill-amber-500" />
                        {product.rating}
                      </div>
                    </div>
                    <h3 className="text-sm sm:text-base font-black text-white leading-tight uppercase tracking-tight group-hover:text-[var(--pm-accent)] transition-colors line-clamp-2 min-h-[3rem]">
                      {t(product.name, product.nameBn)}
                    </h3>
                  </div>

                  <div className="space-y-4">
                    <div className="flex items-baseline gap-2.5">
                      <span className="text-xl md:text-2xl font-black text-white">৳{product.price.toLocaleString()}</span>
                      {product.isWholesale && product.moq && (
                         <span className="text-[10px] text-amber-400 font-black uppercase tracking-wider bg-amber-500/10 px-2.5 py-1 rounded-md border border-amber-500/20">
                           Min Order: {product.moq}
                         </span>
                      )}
                    </div>

                    <div className="flex items-center gap-3 pt-1">
                      <button 
                        onClick={(e) => { e.stopPropagation(); toast.success(`${product.name} added to wishlist`); }}
                        className="w-12 h-12 flex items-center justify-center bg-white/5 hover:bg-rose-500/10 text-zinc-500 hover:text-rose-400 rounded-xl transition-all border border-white/5 active:scale-95"
                      >
                        <Heart className="w-5 h-5" />
                      </button>
                      <button 
                        disabled={product.stock === 0}
                        onClick={(e) => { 
                          e.stopPropagation(); 
                          addItem({
                            id: product.id,
                            name: product.name,
                            title: product.name,
                            price: product.price,
                            image: product.image,
                            store: sellerName,
                            vendorName: sellerName,
                            quantity: 1,
                            portal: product.isWholesale ? 'wholesale' : product.isService ? 'service' : 'retail'
                          });
                          toast.success(`${product.name} added to cart`); 
                        }}
                        className="flex-1 h-12 flex items-center justify-center gap-2.5 bg-[var(--pm-accent)]/10 hover:bg-[var(--pm-accent)] text-[var(--pm-accent)] hover:text-white rounded-xl transition-all border border-[var(--pm-accent)]/20 text-[10px] font-black uppercase tracking-widest active:scale-95 disabled:opacity-50 disabled:grayscale"
                      >
                        <ShoppingCart className="w-4 h-4" />
                        {t('Add to Cart', 'কার্টে যোগ করুন')}
                      </button>
                    </div>
                  </div>
                </div>
              </motion.div>
            ))}
          </AnimatePresence>
        </div>
      ) : (
        <div className="py-32 text-center space-y-6 bg-white/[0.01] border-2 border-dashed border-white/5 rounded-[3rem] animate-in fade-in zoom-in duration-500">
          <div className="w-24 h-24 bg-white/5 rounded-full flex items-center justify-center mx-auto">
            <Search className="w-10 h-10 text-zinc-800" />
          </div>
          <div className="space-y-2">
            <h4 className="text-2xl font-black text-white uppercase tracking-tight">{t('No products found', 'কোনো পণ্য পাওয়া যায়নি')}</h4>
            <p className="text-xs text-zinc-500 font-bold tracking-widest uppercase">Try adjusting your filters or search query.</p>
          </div>
          <Button 
            variant="outline" 
            onClick={() => { setActiveCategory('all'); setSearchQuery(''); }}
            className="rounded-2xl border-white/10 text-[10px] font-black uppercase tracking-widest h-14 px-10 hover:bg-white/5 text-zinc-400"
          >
            Reset Filters
          </Button>
        </div>
      )}

      {/* ── STORE POLICIES ── */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 pt-16 border-t border-white/5">
        {[
          { title: 'Secure Sourcing', titleBn: 'নিরাপদ সোর্সিং', icon: ShieldCheck, color: 'text-blue-400', desc: 'Protected by PaikarMart Escrow' },
          { title: 'Fast Delivery', titleBn: 'দ্রুত ডেলিভারি', icon: Truck, color: 'text-emerald-400', desc: 'Express shipping across BD' },
          { title: 'Live Support', titleBn: 'লাইভ সাপোর্ট', icon: MessageCircle, color: 'text-cyan-400', desc: 'Direct message with seller' },
        ].map((policy, i) => (
          <div key={i} className="flex items-center gap-5 p-6 rounded-[2rem] bg-[var(--pm-surface)]/50 border border-white/5 hover:border-white/10 transition-all group">
            <div className={`w-14 h-14 shrink-0 rounded-2xl bg-white/5 flex items-center justify-center transition-transform group-hover:scale-110 ${policy.color}`}>
              <policy.icon className="w-7 h-7" />
            </div>
            <div className="text-left">
              <h4 className="text-xs font-black text-white uppercase tracking-widest">{t(policy.title, policy.titleBn)}</h4>
              <p className="text-[10px] text-zinc-500 font-bold uppercase mt-1 tracking-tight">{policy.desc}</p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
