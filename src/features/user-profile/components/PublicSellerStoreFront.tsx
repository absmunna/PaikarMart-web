import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  Store, ShoppingBag, Search, Filter, ArrowUpDown, 
  Plus, Share2, Star, Clock, ShieldCheck, 
  ChevronRight, LayoutGrid, List, SlidersHorizontal,
  Smartphone, Zap, Shirt, UtensilsCrossed, Settings,
  Eye, ShoppingCart, Heart, RefreshCw
} from 'lucide-react';
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
}

const MOCK_PRODUCTS: Product[] = [
  { id: '1', name: 'Premium Cotton T-Shirt', nameBn: 'প্রিমিয়াম কটন টি-শার্ট', price: 450, category: 'Fashion', categoryBn: 'ফ্যাশন', rating: 4.8, reviews: 124, image: 'https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?w=400&q=80', stock: 85 },
  { id: '2', name: 'Wireless Noise Cancelling Headphones', nameBn: 'ওয়্যারলেস হেডফোন', price: 2500, category: 'Electronics', categoryBn: 'ইলেকট্রনিক্স', rating: 4.9, reviews: 89, image: 'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=400&q=80', stock: 12 },
  { id: '3', name: 'Home Cleaning Service', nameBn: 'হোম ক্লিনিং সার্ভিস', price: 1200, category: 'Services', categoryBn: 'সার্ভিস', rating: 4.7, reviews: 56, image: 'https://images.unsplash.com/photo-1581578731548-c64695ce6958?w=400&q=80', stock: 1, isService: true },
  { id: '4', name: 'Handmade Leather Wallet', nameBn: 'হ্যান্ডমেড লেদার ওয়ালেট', price: 850, category: 'Fashion', categoryBn: 'ফ্যাশন', rating: 4.6, reviews: 45, image: 'https://images.unsplash.com/photo-1627123424574-724758594e93?w=400&q=80', stock: 0 },
  { id: '5', name: 'Organic Honey (500g)', nameBn: 'অর্গানিক মধু', price: 650, category: 'Food', categoryBn: 'খাবার', rating: 4.9, reviews: 210, image: 'https://images.unsplash.com/photo-1587049352846-4a222e784d38?w=400&q=80', stock: 45 },
  { id: '6', name: 'Smartphone Tripod Mount', nameBn: 'স্মার্টফোন ট্রাইপড মাউন্ট', price: 350, category: 'Electronics', categoryBn: 'ইলেকট্রনিক্স', rating: 4.5, reviews: 34, image: 'https://images.unsplash.com/photo-1563227812-0ea4c22e6cc8?w=400&q=80', stock: 20 },
];

const CATEGORIES = [
  { id: 'all', label: 'All', labelBn: 'সবগুলো', icon: LayoutGrid },
  { id: 'Fashion', label: 'Fashion', labelBn: 'ফ্যাশন', icon: Shirt },
  { id: 'Electronics', label: 'Electronics', labelBn: 'ইলেকট্রনিক্স', icon: Smartphone },
  { id: 'Food', label: 'Food', labelBn: 'খাবার', icon: UtensilsCrossed },
  { id: 'Services', label: 'Services', labelBn: 'সার্ভিস', icon: Settings },
];

export function PublicSellerStoreFront({ sellerName = "PaikarMart Official Store", isBilingual = true, hideHeader = false }) {
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
    <div className={`space-y-8 animate-in fade-in duration-700 ${hideHeader ? '' : 'pb-12'}`}>
      
      {/* ── STORE HEADER ── */}
      {!hideHeader && (
        <div className="relative rounded-[2.5rem] overflow-hidden bg-[#0a0f1d] border border-white/5 shadow-2xl">
          <div className="absolute top-0 right-0 w-96 h-96 bg-cyan-500/5 rounded-full blur-3xl pointer-events-none" />
          
          {/* Cover Image Placeholder */}
          <div className="h-32 md:h-52 bg-gradient-to-r from-cyan-600/30 via-[#030704] to-blue-600/30 relative">
            <div className="absolute inset-0 bg-black/40 backdrop-blur-[1px]" />
            <div className="absolute bottom-4 right-6 flex gap-2">
               <Button variant="ghost" size="sm" className="bg-black/40 hover:bg-black/60 text-white rounded-full text-[10px] font-black uppercase tracking-widest px-4 h-8">
                 {t('Update Cover', 'কভার পরিবর্তন')}
               </Button>
            </div>
          </div>

          <div className="px-8 pb-10 -mt-16 relative z-10">
            <div className="flex flex-col md:flex-row items-end gap-6">
              <div className="relative group">
                <div className="w-28 h-28 md:w-40 md:h-40 rounded-[2.5rem] bg-black border-8 border-[#030704] shadow-2xl overflow-hidden flex items-center justify-center relative transition-transform duration-500 group-hover:scale-[1.02]">
                  <Store className="w-14 h-14 md:w-20 md:h-20 text-cyan-400" />
                  <div className="absolute inset-0 bg-cyan-500/10 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                     <Eye className="w-8 h-8 text-white/50" />
                  </div>
                </div>
              </div>

              <div className="flex-1 pb-2 space-y-3 text-left">
                <div className="flex flex-wrap items-center gap-3">
                  <h1 className="text-2xl md:text-4xl font-black text-white uppercase tracking-tighter leading-none">{sellerName}</h1>
                  <div className="flex items-center gap-1.5 px-3 py-1 rounded-full bg-cyan-500/10 border border-cyan-500/20 text-[10px] font-black text-cyan-400 uppercase tracking-widest">
                    <ShieldCheck className="w-3.5 h-3.5" />
                    VERIFIED SELLER
                  </div>
                </div>
                <div className="flex flex-wrap items-center gap-x-6 gap-y-2 text-zinc-400 text-[11px] font-black uppercase tracking-[0.15em]">
                  <span className="flex items-center gap-2"><ShoppingBag className="w-4 h-4 text-cyan-500/60" /> 45 {t('Products', 'পণ্য')}</span>
                  <span className="flex items-center gap-2"><Star className="w-4 h-4 text-amber-500/60" /> 4.9 (1.2k {t('Reviews', 'রিভিউ')})</span>
                  <span className="flex items-center gap-2"><Clock className="w-4 h-4 text-blue-500/60" /> Joined 2 {t('Years Ago', 'বছর আগে')}</span>
                </div>
                <p className="text-xs text-zinc-500 font-bold max-w-2xl line-clamp-2">
                  {t('Wholesale and retail hub for premium electronics and fashion in Chawkbazar. Fast delivery and authentic products guaranteed.', 'চকবাজারের প্রিমিয়াম ইলেকট্রনিক্স এবং ফ্যাশনের পাইকারি ও খুচরা হাব। দ্রুত ডেলিভারি এবং অথেন্টিক পণ্যের নিশ্চয়তা।')}
                </p>
              </div>

              <div className="flex gap-3 pb-2 w-full md:w-auto">
                <Button size="sm" variant="outline" className="flex-1 md:flex-none rounded-2xl border-white/10 hover:bg-white/5 text-[10px] font-black uppercase tracking-widest h-12 px-6 gap-2">
                  <Share2 className="w-4 h-4" />
                  {t('Share Store', 'শেয়ার')}
                </Button>
                <Button 
                  onClick={() => setIsFollowing(!isFollowing)}
                  size="sm" 
                  className={`flex-1 md:flex-none rounded-2xl font-black text-[10px] uppercase tracking-widest h-12 px-8 transition-all active:scale-95 ${
                    isFollowing ? 'bg-white/5 text-cyan-400 border border-cyan-500/20' : 'bg-cyan-600 hover:bg-cyan-500 text-white shadow-lg shadow-cyan-600/20'
                  }`}
                >
                  {isFollowing ? <Check className="w-4 h-4 mr-2" /> : null}
                  {isFollowing ? t('Following', 'ফলো করছেন') : t('Follow Store', 'ফলো করুন')}
                </Button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* ── FILTER & TOOLS BAR ── */}
      <div className="flex flex-col lg:flex-row gap-4 items-center justify-between sticky top-4 z-20 bg-[#030704]/90 backdrop-blur-2xl p-4 rounded-3xl border border-white/10 shadow-2xl">
        <div className="flex items-center gap-2 overflow-x-auto pb-2 lg:pb-0 no-scrollbar w-full lg:w-auto">
          {CATEGORIES.map((cat) => {
            const Icon = cat.icon;
            const isActive = activeCategory === cat.id;
            return (
              <button
                key={cat.id}
                onClick={() => setActiveCategory(cat.id)}
                className={`flex items-center gap-2 px-5 py-3 rounded-2xl text-[10px] font-black uppercase tracking-widest transition-all whitespace-nowrap border ${
                  isActive 
                    ? 'bg-cyan-500/10 border-cyan-500/30 text-cyan-400 shadow-inner' 
                    : 'bg-white/5 border-transparent text-zinc-500 hover:bg-white/10'
                }`}
              >
                <Icon className={`w-4 h-4 ${isActive ? 'text-cyan-400' : 'text-zinc-500'}`} />
                {t(cat.label, cat.labelBn)}
              </button>
            );
          })}
        </div>

        <div className="flex items-center gap-3 w-full lg:w-auto">
          <div className="relative flex-1 lg:w-72">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-zinc-600" />
            <Input 
              placeholder={t('Search in store...', 'দোকানে খুঁজুন...')}
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="bg-white/5 border-white/10 pl-12 h-12 text-[11px] font-bold rounded-2xl focus:ring-cyan-500/20"
            />
          </div>
          <Button variant="outline" size="icon" className="rounded-2xl border-white/10 hover:bg-white/5 h-12 w-12 shrink-0">
            <ArrowUpDown className="w-4 h-4 text-zinc-500" />
          </Button>
          <div className="hidden md:flex p-1.5 bg-white/5 rounded-2xl border border-white/10 shrink-0">
            <button 
              onClick={() => setViewMode('grid')}
              className={`p-2 rounded-xl transition-all ${viewMode === 'grid' ? 'bg-cyan-500/20 text-cyan-400' : 'text-zinc-600 hover:text-zinc-400'}`}
            >
              <LayoutGrid className="w-4 h-4" />
            </button>
            <button 
              onClick={() => setViewMode('list')}
              className={`p-2 rounded-xl transition-all ${viewMode === 'list' ? 'bg-cyan-500/20 text-cyan-400' : 'text-zinc-600 hover:text-zinc-400'}`}
            >
              <List className="w-4 h-4" />
            </button>
          </div>
        </div>
      </div>

      {/* ── PRODUCTS GRID ── */}
      {filteredProducts.length > 0 ? (
        <div className={`grid gap-6 ${viewMode === 'grid' ? 'grid-cols-2 md:grid-cols-3 xl:grid-cols-4' : 'grid-cols-1'}`}>
          <AnimatePresence mode="popLayout">
            {filteredProducts.map((product, idx) => (
              <motion.div
                key={product.id}
                layout
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, scale: 0.95 }}
                transition={{ duration: 0.4, delay: idx * 0.05 }}
                className={`group relative bg-[#0a0f1d] border border-white/5 rounded-[2rem] overflow-hidden hover:border-cyan-500/30 transition-all duration-500 shadow-xl ${viewMode === 'list' ? 'flex gap-6 h-48 md:h-52' : 'flex flex-col'}`}
              >
                {/* Image Section */}
                <div className={`relative overflow-hidden ${viewMode === 'list' ? 'w-48 md:w-56 h-full shrink-0' : 'aspect-square'}`}>
                  <img 
                    src={product.image} 
                    alt={product.name} 
                    className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-1000 ease-out"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-[#030704] via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity flex items-end justify-center p-5">
                    <Button 
                      onClick={() => toast.info(`Viewing ${product.name}`)}
                      size="sm" 
                      className="w-full bg-cyan-600 hover:bg-cyan-500 text-white font-black text-[10px] uppercase tracking-widest rounded-xl h-10"
                    >
                      {product.isService ? t('Book Service', 'বুক করুন') : t('Quick View', 'দ্রুত দেখুন')}
                    </Button>
                  </div>
                  {product.stock === 0 && (
                    <div className="absolute inset-0 bg-black/60 backdrop-blur-[2px] flex items-center justify-center">
                      <span className="bg-rose-600/20 text-rose-400 border border-rose-500/30 text-[9px] font-black px-4 py-1.5 rounded-full uppercase tracking-[0.2em] backdrop-blur-md">
                        Out of Stock
                      </span>
                    </div>
                  )}
                  {product.isService && (
                    <div className="absolute top-4 left-4 bg-blue-600 text-white text-[9px] font-black px-3 py-1 rounded-full uppercase tracking-widest shadow-lg">
                      SERVICE
                    </div>
                  )}
                </div>

                {/* Content Section */}
                <div className="p-5 flex flex-col flex-1 justify-between text-left">
                  <div className="space-y-2">
                    <div className="flex justify-between items-start">
                      <span className="text-[10px] text-zinc-500 font-black uppercase tracking-[0.15em]">{t(product.category, product.categoryBn)}</span>
                      <div className="flex items-center gap-1.5 px-2 py-0.5 rounded-lg bg-amber-500/5 text-[10px] text-amber-500 font-black">
                        <Star className="w-3.5 h-3.5 fill-amber-500" />
                        {product.rating}
                      </div>
                    </div>
                    <h3 className="text-sm md:text-base font-black text-white leading-tight uppercase tracking-tight group-hover:text-cyan-400 transition-colors line-clamp-2">
                      {t(product.name, product.nameBn)}
                    </h3>
                  </div>

                  <div className="mt-6 pt-4 border-t border-white/5 flex items-center justify-between">
                    <div>
                      <p className="text-xl font-black text-white leading-none tracking-tight">৳{product.price.toLocaleString()}</p>
                      <p className="text-[9px] text-zinc-500 font-black mt-1.5 uppercase tracking-widest">{t('Cash/Online', 'ক্যাশ/অনলাইন পেমেন্ট')}</p>
                    </div>
                    <div className="flex gap-2">
                      <button className="w-10 h-10 flex items-center justify-center bg-white/5 hover:bg-rose-500/10 text-zinc-500 hover:text-rose-400 rounded-xl transition-all border border-white/5">
                        <Heart className="w-4 h-4" />
                      </button>
                      <button 
                        onClick={(e) => { e.stopPropagation(); toast.success(`${product.name} added to cart`); }}
                        className="w-10 h-10 flex items-center justify-center bg-cyan-500/10 hover:bg-cyan-600 text-cyan-400 hover:text-white rounded-xl transition-all border border-cyan-500/20"
                      >
                        <ShoppingCart className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                </div>
              </motion.div>
            ))}
          </AnimatePresence>
        </div>
      ) : (
        <div className="py-24 text-center space-y-6 bg-white/[0.01] border-2 border-dashed border-white/5 rounded-[3rem] animate-in fade-in zoom-in duration-500">
          <div className="w-24 h-24 bg-white/5 rounded-full flex items-center justify-center mx-auto ring-8 ring-white/0 group">
            <Search className="w-10 h-10 text-zinc-700" />
          </div>
          <div className="space-y-2">
            <h4 className="text-xl font-black text-white uppercase tracking-tight">{t('No matches found', 'কোনো পণ্য পাওয়া যায়নি')}</h4>
            <p className="text-xs text-zinc-500 font-medium tracking-wide uppercase">Try adjusting your filters or search query.</p>
          </div>
          <Button 
            variant="outline" 
            onClick={() => { setActiveCategory('all'); setSearchQuery(''); }}
            className="rounded-2xl border-white/10 text-[10px] font-black uppercase tracking-widest h-12 px-8 hover:bg-white/5"
          >
            Reset All Filters
          </Button>
        </div>
      )}

      {/* ── STORE POLICIES ── */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 pt-16 border-t border-white/5">
        {[
          { title: 'Secure Transaction', titleBn: 'নিরাপদ লেনদেন', icon: ShieldCheck, color: 'text-blue-400', desc: 'Encrypted payment systems' },
          { title: 'Flash Delivery', titleBn: 'দ্রুত ডেলিভারি', icon: Zap, color: 'text-amber-400', desc: 'Same-day within Dhaka' },
          { title: 'Easy Support', titleBn: 'সহজ সাপোর্ট', icon: RefreshCw, color: 'text-cyan-400', desc: '24/7 dedicated assistance' },
        ].map((policy, i) => (
          <div key={i} className="flex items-center gap-5 p-6 rounded-3xl bg-[#0a0f1d] border border-white/5 hover:border-white/10 transition-colors">
            <div className={`w-14 h-14 shrink-0 rounded-2xl bg-white/5 flex items-center justify-center ${policy.color} shadow-inner`}>
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

function Check(props: any) {
  return (
    <svg
      {...props}
      xmlns="http://www.w3.org/2000/svg"
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="3"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <polyline points="20 6 9 17 4 12" />
    </svg>
  );
}
