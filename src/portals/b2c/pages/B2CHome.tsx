import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  ShoppingBag, Search, MapPin, Star, ShieldCheck, Filter, ArrowRight,
  TrendingUp, Compass, Heart, Share2, Eye, ShoppingCart, Plus, Minus, Check, ArrowLeftRight
} from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { useProductStore, Product } from '../../../modules/products/productStore';

// Products Data Seed (Cohesive with Bangladeshi retail market)
// Removed static B2C_PRODUCTS mock data. We'll fetch products from the backend via the product store.


const CATEGORIES = [
  { id: 'all', name: '🏷️ সকল অফার', emoji: '🛍️' },
  { id: 'grocery', name: '🥦 তাজা গ্রোসারি', emoji: '🥑' },
  { id: 'electronics', name: '⚡ ইলেকট্রনিক্স', emoji: '🔌' },
  { id: 'fashion', name: '👕 ফ্যাশন ও গ্যাজেট', emoji: '👓' }
];

export const B2CHome = () => {
  const navigate = useNavigate();
  const { products, fetchProducts } = useProductStore();

  // Search & Filter state
  useEffect(() => {
    fetchProducts();
  }, [fetchProducts]);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCat, setSelectedCat] = useState('all');
  const [nearMeOnly, setNearMeOnly] = useState(false);
  const [sortBy, setSortBy] = useState('trending');

  // Detail Modal State
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);

  // Cart Local Mock State for seamless retail feel
  const [cart, setCart] = useState<{ [id: string]: number }>({});
  const [animateCart, setAnimateCart] = useState(false);

  // Total cart items count
  const cartTotalItems = Object.values(cart).reduce((a, b) => a + b, 0);
  const cartTotalValue = Object.entries(cart).reduce((total, [id, qty]) => {
    const prod = products.find(p => p.id === id);
    return total + (prod ? prod.price * qty : 0);
  }, 0);

  const handleAddToCart = (id: string, e: React.MouseEvent) => {
    e.stopPropagation();
    setCart(prev => ({
      ...prev,
      [id]: (prev[id] || 0) + 1
    }));
    setAnimateCart(true);
    setTimeout(() => setAnimateCart(false), 300);
  };

  const handleRemoveFromCart = (id: string, e: React.MouseEvent) => {
    e.stopPropagation();
    setCart(prev => {
      const copy = { ...prev };
      if (copy[id] <= 1) {
        delete copy[id];
      } else {
        copy[id]--;
      }
      return copy;
    });
  };

  // Filter products logic
  const filteredProducts = products.filter(product => {
    const matchesSearch = product.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                          (product.vendor && product.vendor.toLowerCase().includes(searchQuery.toLowerCase()));
    const matchesCat = selectedCat === 'all' ? true : product.category === selectedCat;
    const matchesNearMe = nearMeOnly ? product.isNearMe : true;
    return matchesSearch && matchesCat && matchesNearMe;
  }).sort((a, b) => {
    if (sortBy === 'price_asc') return a.price - b.price;
    if (sortBy === 'price_desc') return b.price - a.price;
    if (sortBy === 'rating') return b.rating - a.rating;
    return b.reviews - a.reviews; // Default to trending/popularity
  });

  return (
    <div className="w-full max-w-4xl mx-auto px-4 pb-24 text-[var(--pm-text)]">
      
      {/* Visual Header Banner */}
      <div className="relative w-full rounded-3xl overflow-hidden mb-6 mt-2 h-48 bg-gradient-to-r from-orange-500 via-pink-600 to-indigo-700 shadow-xl border border-[var(--pm-border)] flex flex-col justify-center p-6 sm:p-8">
        <div className="absolute inset-0 bg-black/10 pointer-events-none" />
        <div className="relative z-10 max-w-md">
          <span className="bg-white/20 backdrop-blur-md text-white text-[9px] font-black tracking-widest uppercase px-2.5 py-1 rounded-full border border-white/10">পাইকার রিটেইল (B2C) মার্কেটপ্লেস</span>
          <h2 className="text-xl sm:text-2xl font-black text-white mt-2 leading-tight">সেরা খুচরা পণ্য সামগ্রী <br/>পছন্দ করুন পাইকারি মূল্যে!</h2>
          <p className="text-[10px] sm:text-xs text-white/80 font-medium mt-1">সবচেয়ে জনপ্রিয় দেশী ও বিদেশী কসমেটিকস, গ্রোসারি এবং গেজেটস একই ছাদের নিচে।</p>
        </div>
        <div className="absolute right-4 bottom-0 w-32 h-32 opacity-20 pointer-events-none">
          <ShoppingBag className="w-full h-full text-white" />
        </div>
      </div>

      {/* Interactive Controls & Category Bar */}
      <div className="flex flex-col gap-4 mb-6">
        
        {/* Search and Near Me Toggle */}
        <div className="flex flex-col sm:flex-row gap-3">
          <div className="relative flex-1">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-[var(--pm-text-muted)]" />
            <input 
              type="text" 
              placeholder="খুচরা প্রোডাক্ট বা সেলার শপের নাম দিয়ে সার্চ করুন..."
              value={searchQuery}
              onChange={e => setSearchQuery(e.target.value)}
              className="w-full bg-[var(--pm-surface)] border border-[var(--pm-border)] rounded-2xl py-3 pl-12 pr-4 text-xs font-semibold focus:border-[var(--pm-accent)] outline-none transition-colors"
            />
          </div>
          
          <div className="flex gap-2.5 items-center">
            {/* Near Me Toggle */}
            <button
              onClick={() => setNearMeOnly(!nearMeOnly)}
              className={`flex items-center gap-1.5 px-4 py-2.5 rounded-2xl text-xs font-black border transition-all active:scale-95 ${
                nearMeOnly 
                  ? 'bg-orange-500/10 border-orange-500 text-orange-500' 
                  : 'bg-[var(--pm-surface)] border-[var(--pm-border)] text-[var(--pm-text-muted)]'
              }`}
            >
              <MapPin className="w-4 h-4" />
              আমার কাছাকাছি
            </button>

            {/* Sort Select */}
            <select
              value={sortBy}
              onChange={e => setSortBy(e.target.value)}
              className="bg-[var(--pm-surface)] border border-[var(--pm-border)] rounded-2xl px-4 py-2.5 text-xs font-black text-[var(--pm-text)] focus:outline-none"
            >
              <option value="trending">🔥 ট্রেন্ডিং প্রোডাক্ট</option>
              <option value="price_asc">৳ দাম: নিম্ন থেকে উচ্চ</option>
              <option value="price_desc">৳ দাম: উচ্চ থেকে নিম্ন</option>
              <option value="rating">⭐ সর্বোচ্চ রেটিং</option>
            </select>
          </div>
        </div>

        {/* Category Pills Bar */}
        <div className="flex gap-2 overflow-x-auto pb-1 scrollbar-hide">
          {CATEGORIES.map(cat => (
            <button
              key={cat.id}
              onClick={() => setSelectedCat(cat.id)}
              className={`px-4 py-2.5 rounded-full text-xs font-black shrink-0 transition-all active:scale-95 border ${
                selectedCat === cat.id 
                  ? 'bg-[var(--pm-accent)] text-white border-[var(--pm-accent)] shadow-md shadow-[var(--pm-accent)]/15'
                  : 'bg-[var(--pm-surface)] border-[var(--pm-border)] text-[var(--pm-text-muted)] hover:text-[var(--pm-text)]'
              }`}
            >
              {cat.name}
            </button>
          ))}
        </div>
      </div>

      {/* Products Grid */}
      {filteredProducts.length === 0 ? (
        <div className="bg-[var(--pm-surface)] border border-[var(--pm-border)] rounded-3xl py-16 text-center text-[var(--pm-text-muted)] flex flex-col items-center gap-2">
          <ShoppingBag className="w-12 h-12 mb-2 animate-pulse text-[var(--pm-text-muted)]" />
          <h4 className="font-black text-sm">কোনো প্রোডাক্ট পাওয়া যায়নি!</h4>
          <p className="text-[10px] text-[var(--pm-text-muted)]">অনুগ্রহ করে অন্য কোনো কিউওয়ার্ড বা ক্যাটাগরি ট্রাই করুন।</p>
        </div>
      ) : (
        <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
          {filteredProducts.map(prod => {
            const hasQty = cart[prod.id] || 0;
            return (
              <motion.div
                key={prod.id}
                layout
                onClick={() => setSelectedProduct(prod)}
                className="bg-[var(--pm-surface)] border border-[var(--pm-border)] rounded-3xl overflow-hidden shadow-sm hover:shadow-md cursor-pointer group flex flex-col justify-between"
              >
                <div>
                  {/* Image container */}
                  <div className="aspect-square w-full bg-[var(--pm-bg)] relative overflow-hidden">
                    <img 
                      src={prod.image} 
                      alt={prod.name} 
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                    />
                    
                    {/* Near Me Badge */}
                    {prod.isNearMe && (
                      <span className="absolute top-2.5 left-2.5 bg-indigo-600/90 backdrop-blur-md text-white text-[8px] font-black uppercase tracking-wider px-2 py-0.5 rounded-full flex items-center gap-0.5 shadow-md border border-indigo-500/30">
                        <MapPin className="w-2.5 h-2.5" /> লোকাল দোকান
                      </span>
                    )}

                    {/* Disount Badge */}
                    <span className="absolute top-2.5 right-2.5 bg-red-600 text-white text-[8px] font-black px-2 py-0.5 rounded-full shadow-md">
                      {Math.round(((prod.originalPrice - prod.price) / prod.originalPrice) * 100)}% ছাড়
                    </span>
                  </div>

                  {/* Body Content */}
                  <div className="p-3.5 flex flex-col gap-1.5">
                    <div className="flex items-center gap-1 text-[9px] text-[var(--pm-text-muted)] font-bold">
                      <span>{prod.vendor}</span>
                      <ShieldCheck className="w-3.5 h-3.5 text-blue-500" />
                    </div>

                    <h3 className="text-[11px] sm:text-xs font-black text-[var(--pm-text)] leading-snug line-clamp-2 min-h-[32px] group-hover:text-[var(--pm-accent)] transition-colors">
                      {prod.name}
                    </h3>

                    {/* Rating */}
                    <div className="flex items-center gap-1 mt-0.5">
                      <div className="flex items-center text-amber-500">
                        <Star className="w-3 h-3 fill-amber-500" />
                      </div>
                      <span className="text-[9px] font-black text-[var(--pm-text)]">{prod.rating}</span>
                      <span className="text-[9px] text-[var(--pm-text-muted)] font-bold">({prod.reviews})</span>
                    </div>
                  </div>
                </div>

                {/* Footer Price & Add To Cart Button */}
                <div className="p-3.5 pt-0 border-t border-[var(--pm-border)]/35 mt-2 flex items-center justify-between gap-1.5">
                  <div className="flex flex-col">
                    <span className="text-xs sm:text-sm font-black text-[var(--pm-text)]">৳{prod.price}</span>
                    <span className="text-[9px] text-[var(--pm-text-muted)] line-through">৳{prod.originalPrice}</span>
                  </div>

                  {/* Dynamic Add to Cart with Plus/Minus counter */}
                  {hasQty > 0 ? (
                    <div className="flex items-center bg-[var(--pm-accent)] rounded-xl py-1 px-1.5 gap-1 shrink-0" onClick={e => e.stopPropagation()}>
                      <button 
                        onClick={e => handleRemoveFromCart(prod.id, e)}
                        className="text-white p-0.5 hover:bg-white/10 rounded-lg active:scale-90 transition-transform"
                      >
                        <Minus className="w-3 h-3" />
                      </button>
                      <span className="text-[10px] font-black text-white px-1">{hasQty}</span>
                      <button 
                        onClick={e => handleAddToCart(prod.id, e)}
                        className="text-white p-0.5 hover:bg-white/10 rounded-lg active:scale-90 transition-transform"
                      >
                        <Plus className="w-3 h-3" />
                      </button>
                    </div>
                  ) : (
                    <button
                      onClick={e => handleAddToCart(prod.id, e)}
                      className="bg-[var(--pm-accent)] hover:opacity-90 active:scale-95 transition-all text-white p-2 rounded-xl shrink-0 shadow-md shadow-[var(--pm-accent)]/15"
                    >
                      <ShoppingCart className="w-3.5 h-3.5" />
                    </button>
                  )}
                </div>
              </motion.div>
            );
          })}
        </div>
      )}

      {/* Floating Bottom Cart Bar Summary */}
      <AnimatePresence>
        {cartTotalItems > 0 && (
          <motion.div
            initial={{ opacity: 0, y: 100 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 100 }}
            className="fixed bottom-[80px] left-4 right-4 max-w-xl mx-auto z-40 bg-[var(--pm-surface)]/90 backdrop-blur-xl border border-[var(--pm-accent)]/45 rounded-3xl p-4 shadow-2xl flex items-center justify-between gap-4"
          >
            <div className="flex items-center gap-3">
              <div className={`p-3 rounded-2xl bg-[var(--pm-accent)]/15 text-[var(--pm-accent)] relative ${animateCart ? 'scale-110' : ''} transition-transform`}>
                <ShoppingCart className="w-5 h-5" />
                <span className="absolute -top-1.5 -right-1.5 bg-red-600 text-white text-[9px] font-black w-5 h-5 rounded-full flex items-center justify-center border border-[var(--pm-surface)]">
                  {cartTotalItems}
                </span>
              </div>
              <div>
                <h4 className="text-xs font-black text-[var(--pm-text)]">পাইকার B2C রিটেইল কার্ট</h4>
                <p className="text-[10px] text-[var(--pm-text-muted)] font-bold mt-0.5">মোট মূল্য: <span className="text-[var(--pm-accent)] font-black">৳{cartTotalValue.toLocaleString('bn-BD')} BDT</span></p>
              </div>
            </div>

            <button
              onClick={() => navigate('/checkout')}
              className="bg-[var(--pm-accent)] hover:bg-[var(--pm-accent)]/90 text-white px-5 py-3 rounded-2xl text-xs font-black flex items-center gap-1.5 active:scale-95 transition-all shadow-lg shadow-[var(--pm-accent)]/15"
            >
              চেকআউট করুন
              <ArrowRight className="w-4 h-4" />
            </button>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Product Detail Modal */}
      <AnimatePresence>
        {selectedProduct && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/75 backdrop-blur-md">
            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 20 }}
              className="bg-[var(--pm-surface)] border border-[var(--pm-border)] w-full max-w-md rounded-3xl overflow-hidden shadow-2xl flex flex-col text-[var(--pm-text)]"
            >
              {/* Product Image */}
              <div className="w-full h-56 bg-[var(--pm-bg)] relative">
                <img src={selectedProduct.image} alt={selectedProduct.name} className="w-full h-full object-cover" />
                <button 
                  onClick={() => setSelectedProduct(null)}
                  className="absolute top-4 right-4 bg-black/60 backdrop-blur-md text-white p-2 rounded-full border border-white/20 active:scale-90 transition-transform"
                >
                  <XIcon className="w-4 h-4" />
                </button>
              </div>

              {/* Product Content Details */}
              <div className="p-5 flex flex-col gap-4">
                <div>
                  <div className="flex items-center justify-between gap-4">
                    <span className="text-[9px] text-[var(--pm-accent)] font-black uppercase tracking-widest">{selectedProduct.category}</span>
                    <span className="bg-green-600/20 text-green-400 border border-green-500/20 text-[9px] font-black px-2.5 py-0.5 rounded-full">স্টকে আছে</span>
                  </div>
                  <h3 className="text-sm font-black text-[var(--pm-text)] mt-2 leading-snug">{selectedProduct.name}</h3>
                  
                  {/* Rating */}
                  <div className="flex items-center gap-1.5 mt-2">
                    <div className="flex items-center text-amber-500">
                      <Star className="w-3.5 h-3.5 fill-amber-500" />
                    </div>
                    <span className="text-xs font-black text-[var(--pm-text)]">{selectedProduct.rating}</span>
                    <span className="text-xs text-[var(--pm-text-muted)] font-semibold">({selectedProduct.reviews} টি কাস্টমার রিভিউ)</span>
                  </div>
                </div>

                <div className="bg-[var(--pm-bg)]/50 border border-[var(--pm-border)]/40 p-4 rounded-2xl flex flex-col gap-2.5">
                  <div className="flex justify-between text-xs">
                    <span className="text-[var(--pm-text-muted)] font-semibold">খুচরা অফার মূল্য:</span>
                    <span className="text-[var(--pm-text)] font-black">৳{selectedProduct.price} BDT</span>
                  </div>
                  <div className="flex justify-between text-xs">
                    <span className="text-[var(--pm-text-muted)] font-semibold">বাজার মূল্য:</span>
                    <span className="text-[var(--pm-text-muted)] line-through">৳{selectedProduct.originalPrice} BDT</span>
                  </div>
                  <div className="flex justify-between text-xs">
                    <span className="text-[var(--pm-text-muted)] font-semibold">ভেন্ডর শপ:</span>
                    <span className="text-[var(--pm-text)] font-black flex items-center gap-0.5">
                      {selectedProduct.vendor} <ShieldCheck className="w-3.5 h-3.5 text-blue-500" />
                    </span>
                  </div>
                </div>

                <p className="text-[11px] text-[var(--pm-text-muted)] leading-relaxed font-medium">
                  {selectedProduct.description}
                </p>

                {/* Footer button */}
                <button
                  onClick={e => {
                    handleAddToCart(selectedProduct.id, e);
                    setSelectedProduct(null);
                  }}
                  className="w-full bg-[var(--pm-accent)] text-white font-black py-3.5 rounded-2xl active:scale-95 transition-all shadow-lg shadow-[var(--pm-accent)]/20 flex items-center justify-center gap-2"
                >
                  <ShoppingCart className="w-4 h-4" />
                  কার্টে যোগ করুন
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
};

// Helper SVG X Icon Component
const XIcon = ({ className }: { className: string }) => (
  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2.5} stroke="currentColor" className={className}>
    <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
  </svg>
);
