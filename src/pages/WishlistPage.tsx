import React, { useState } from "react";
import { 
  Heart, ShoppingBag, Trash2, ArrowRight, Star, 
  Store, Check, AlertCircle, Share2, Sparkles, Package, Plus 
} from "lucide-react";
import { Link, useNavigate } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import { useCartStore } from "../modules/cart/cartStore";

interface WishlistItem {
  id: string;
  name: string;
  price: number;
  originalPrice?: number;
  storeName: string;
  imageUrl: string;
  inStock: boolean;
  rating: number;
  reviews: number;
  portal: 'pk-shop' | 'b2c' | 'wholesale';
}

const DEFAULT_WISHLIST: WishlistItem[] = [
  {
    id: "w-1",
    name: "PK Exclusive Sundarban Honey (100% Pure, 1kg)",
    price: 850,
    originalPrice: 1050,
    storeName: "PaikarMart Store",
    imageUrl: "https://images.unsplash.com/photo-1587049352846-4a222e784d38?w=500",
    inStock: true,
    rating: 4.9,
    reviews: 124,
    portal: 'pk-shop'
  },
  {
    id: "w-2",
    name: "Smart Watch Series 9 AMOLED Calling",
    price: 2450,
    originalPrice: 3200,
    storeName: "Rahim Electronics",
    imageUrl: "https://images.unsplash.com/photo-1546868871-70c122467d9b?w=500",
    inStock: true,
    rating: 4.7,
    reviews: 92,
    portal: 'b2c'
  },
  {
    id: "w-3",
    name: "মিনিকেট চাল ৫০ কেজি বস্তা (আড়ত রেট)",
    price: 3450,
    originalPrice: 3800,
    storeName: "মদিনা রাইস এজেন্সি",
    imageUrl: "https://images.unsplash.com/photo-1586201375761-83865001e31c?w=500",
    inStock: true,
    rating: 4.9,
    reviews: 184,
    portal: 'wholesale'
  }
];

export const WishlistPage: React.FC = () => {
  const [items, setItems] = useState<WishlistItem[]>(DEFAULT_WISHLIST);
  const [addedItem, setAddedItem] = useState<string | null>(null);
  const addItem = useCartStore((state) => state.addItem);
  const navigate = useNavigate();

  const handleAddToCart = (item: WishlistItem) => {
    addItem({
      id: item.id,
      name: item.name,
      price: item.price,
      image: item.imageUrl,
      portal: item.portal,
      coinCashback: Math.floor(item.price * 0.02)
    });
    setAddedItem(item.id);
    setTimeout(() => setAddedItem(null), 1500);
  };

  const handleRemove = (id: string) => {
    setItems((prev) => prev.filter((i) => i.id !== id));
  };

  return (
    <div className="flex flex-col gap-6 pb-28 w-full mx-auto px-4 max-w-4xl mt-4">
      <div className="flex items-center justify-between pb-3 border-b border-[var(--pm-border)]">
        <div>
          <h1 className="text-2xl font-black text-[var(--pm-text)] tracking-tight">আমার পছন্দের তালিকা</h1>
          <p className="text-xs text-[var(--pm-text-muted)]">সংরক্ষিত পণ্যের তালিকা ও অফার নোটিফিকেশন</p>
        </div>
        <span className="text-xs font-bold px-3 py-1.5 rounded-full bg-[var(--pm-accent)]/10 text-[var(--pm-accent)]">
          {items.length} টি পণ্য
        </span>
      </div>

      {items.length === 0 ? (
        <div className="flex flex-col items-center justify-center p-12 text-center bg-[var(--pm-surface)] rounded-3xl border border-[var(--pm-border)]">
          <Heart className="w-16 h-16 text-[var(--pm-text-muted)] stroke-[1] mb-4 opacity-40" />
          <h3 className="text-base font-bold text-[var(--pm-text)]">আপনার পছন্দের তালিকা খালি</h3>
          <p className="text-xs text-[var(--pm-text-muted)] mt-1 max-w-xs">
            পণ্য ব্রাউজ করার সময় হার্ট আইকনে ট্যাপ করে আপনার পছন্দের তালিকা তৈরি করুন।
          </p>
          <button
            onClick={() => navigate('/b2c')}
            className="mt-5 px-6 py-2.5 bg-[var(--pm-accent)] text-white text-xs font-bold rounded-xl shadow-xs"
          >
            কেনাকাটা শুরু করুন
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          <AnimatePresence>
            {items.map((item) => (
              <motion.div
                key={item.id}
                layout
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.9 }}
                className="bg-[var(--pm-surface)] border border-[var(--pm-border)] rounded-2xl overflow-hidden shadow-xs hover:shadow-md transition-all flex flex-col justify-between"
              >
                <div className="relative aspect-video w-full overflow-hidden bg-zinc-900">
                  <img src={item.imageUrl} alt={item.name} className="w-full h-full object-cover" />
                  <button
                    onClick={() => handleRemove(item.id)}
                    className="absolute top-2.5 right-2.5 w-8 h-8 rounded-full bg-black/60 text-white hover:text-red-400 flex items-center justify-center backdrop-blur-xs transition-colors"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>

                <div className="p-4 flex flex-col gap-2 flex-1 justify-between">
                  <div>
                    <span className="text-[10px] text-[var(--pm-text-muted)] font-semibold">{item.storeName}</span>
                    <h3 className="font-bold text-xs text-[var(--pm-text)] line-clamp-2 mt-0.5">{item.name}</h3>
                    <div className="flex items-center gap-1 text-[11px] text-amber-500 font-bold mt-1">
                      <Star className="w-3.5 h-3.5 fill-amber-500" />
                      {item.rating} ({item.reviews})
                    </div>
                  </div>

                  <div className="pt-2 border-t border-[var(--pm-border)]/60 flex items-center justify-between">
                    <div>
                      <span className="text-sm font-black text-[var(--pm-text)]">৳{item.price.toLocaleString()}</span>
                      {item.originalPrice && (
                        <span className="text-[10px] text-[var(--pm-text-muted)] line-through ml-1.5">
                          ৳{item.originalPrice.toLocaleString()}
                        </span>
                      )}
                    </div>

                    <button
                      onClick={() => handleAddToCart(item)}
                      className={`px-3 py-1.5 rounded-xl text-xs font-bold flex items-center gap-1 transition-all cursor-pointer ${
                        addedItem === item.id
                          ? 'bg-emerald-600 text-white'
                          : 'bg-[var(--pm-accent)] text-white hover:bg-[var(--pm-accent)]/90'
                      }`}
                    >
                      {addedItem === item.id ? (
                        <>
                          <Check className="w-3.5 h-3.5" />
                          কার্টে আছে
                        </>
                      ) : (
                        <>
                          <Plus className="w-3.5 h-3.5" />
                          কার্টে যোগ
                        </>
                      )}
                    </button>
                  </div>
                </div>
              </motion.div>
            ))}
          </AnimatePresence>
        </div>
      )}
    </div>
  );
};

export default WishlistPage;
