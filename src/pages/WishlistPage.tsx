import React, { useState } from "react";
import { 
  Heart, ShoppingBag, Trash2, ArrowRight, Star, 
  Store, Check, AlertCircle, Share2, Sparkles, Package
} from "lucide-react";
import { Link } from "react-router-dom";
import { useCartStore } from "../modules/cart/store/useCartStore";
import { motion, AnimatePresence } from "motion/react";

interface WishlistItem {
  id: string;
  title: string;
  price: number;
  originalPrice?: number;
  storeName: string;
  imageUrl: string;
  inStock: boolean;
  rating: number;
  reviews: number;
  isWholesale?: boolean;
  moq?: number;
}

const INITIAL_WISHLIST: WishlistItem[] = [
  {
    id: "w-1",
    title: "Premium Cotton T-Shirt - Summer Collection",
    price: 450,
    originalPrice: 600,
    storeName: "Fashion Hub BD",
    imageUrl: "https://images.unsplash.com/photo-1521572267360-ee0c2909d518?w=500",
    inStock: true,
    rating: 4.8,
    reviews: 124
  },
  {
    id: "w-2",
    title: "Plain T-Shirts Bulk (100% Export Combed Cotton)",
    price: 120,
    storeName: "Dhaka Garments Ltd.",
    imageUrl: "https://images.unsplash.com/photo-1521572267360-ee0c2909d518?w=500",
    inStock: true,
    rating: 4.7,
    reviews: 85,
    isWholesale: true,
    moq: 100
  },
  {
    id: "w-3",
    title: "Wireless Noise Cancelling Bluetooth Headphones",
    price: 3200,
    originalPrice: 4000,
    storeName: "TechGadgets BD",
    imageUrl: "https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=500",
    inStock: true,
    rating: 4.5,
    reviews: 89
  },
  {
    id: "w-4",
    title: "Organic Sundarban Raw Honey 500gm",
    price: 850,
    originalPrice: 950,
    storeName: "Nature's Gift BD",
    imageUrl: "https://images.unsplash.com/photo-1587049352847-4a222e784d38?w=500",
    inStock: false,
    rating: 4.9,
    reviews: 412
  }
];

export default function WishlistPage() {
  const [items, setItems] = useState<WishlistItem[]>(INITIAL_WISHLIST);
  const [addedIds, setAddedIds] = useState<Set<string>>(new Set());
  const [copiedLink, setCopiedLink] = useState(false);
  const addItem = useCartStore((state) => state.addItem);

  const handleRemove = (id: string) => {
    setItems(items.filter((item) => item.id !== id));
  };

  const handleAddToCart = (item: WishlistItem) => {
    addItem({
      id: item.id,
      title: item.title,
      price: item.price,
      image: item.imageUrl,
      store: item.storeName,
      isWholesale: item.isWholesale,
      moq: item.moq
    });
    setAddedIds(prev => new Set(prev).add(item.id));
    setTimeout(() => {
      setAddedIds(prev => {
        const next = new Set(prev);
        next.delete(item.id);
        return next;
      });
    }, 2000);
  };

  const handleAddAllToCart = () => {
    items.filter(i => i.inStock).forEach(item => {
      addItem({
        id: item.id,
        title: item.title,
        price: item.price,
        image: item.imageUrl,
        store: item.storeName,
        isWholesale: item.isWholesale,
        moq: item.moq
      });
    });
    const allInStockIds = new Set(items.filter(i => i.inStock).map(i => i.id));
    setAddedIds(allInStockIds);
    setTimeout(() => setAddedIds(new Set()), 2500);
  };

  const handleShareWishlist = () => {
    if (navigator.clipboard) {
      navigator.clipboard.writeText(window.location.href);
      setCopiedLink(true);
      setTimeout(() => setCopiedLink(false), 2000);
    }
  };

  return (
    <div className="px-4 py-6 md:px-8 md:py-10 max-w-7xl mx-auto space-y-8 pb-32">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <Heart className="h-5 w-5 text-rose-500 fill-rose-500" />
            <span className="text-xs font-black uppercase tracking-widest text-rose-500">Saved For Later</span>
          </div>
          <h1 className="text-2xl md:text-4xl font-black text-white italic tracking-tight">
            My Wishlist ({items.length})
          </h1>
          <p className="text-zinc-400 text-sm mt-1">
            Keep track of products you love and want to purchase or source later.
          </p>
        </div>

        {items.length > 0 && (
          <div className="flex items-center gap-3">
            <button
              onClick={handleShareWishlist}
              className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-white/5 border border-white/10 hover:bg-white/10 text-zinc-300 hover:text-white text-xs font-bold transition-all"
            >
              <Share2 className="h-4 w-4" />
              {copiedLink ? "Link Copied!" : "Share"}
            </button>
            <button
              onClick={handleAddAllToCart}
              className="flex items-center gap-2 px-5 py-2.5 rounded-xl bg-[#FF7A00] hover:bg-[#e06b00] text-white text-xs font-bold transition-all shadow-md shadow-[#FF7A00]/20"
            >
              <ShoppingBag className="h-4 w-4" />
              Add All In-Stock to Cart
            </button>
          </div>
        )}
      </div>

      {/* Content */}
      {items.length === 0 ? (
        <div className="bg-[#141624] border border-white/10 rounded-[2.5rem] p-12 text-center max-w-lg mx-auto space-y-5 my-12 shadow-2xl">
          <div className="h-20 w-20 rounded-full bg-rose-500/10 text-rose-500 flex items-center justify-center mx-auto">
            <Heart className="h-10 w-10 stroke-[1.5]" />
          </div>
          <h3 className="text-xl font-bold text-white">Your wishlist is empty</h3>
          <p className="text-sm text-zinc-400">
            Explore wholesale catalogs and retail products to save items you want to buy later.
          </p>
          <Link
            to="/marketplace"
            className="inline-flex items-center gap-2 bg-[#FF7A00] hover:bg-[#e06b00] text-white px-6 py-3 rounded-xl font-bold text-xs uppercase tracking-wider transition-all shadow-lg"
          >
            <Sparkles className="h-4 w-4" /> Browse Marketplace
          </Link>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          <AnimatePresence>
            {items.map((item) => (
              <motion.div
                key={item.id}
                layout
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.9 }}
                className="bg-[#141624] border border-white/10 rounded-2xl overflow-hidden flex flex-col justify-between hover:border-[#FF7A00]/30 transition-all group shadow-xl"
              >
                <div>
                  {/* Image container */}
                  <div className="relative h-48 bg-zinc-800 overflow-hidden">
                    <img 
                      src={item.imageUrl} 
                      alt={item.title} 
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" 
                    />
                    
                    {/* Badges */}
                    <div className="absolute top-3 left-3 flex flex-col gap-1">
                      {item.isWholesale ? (
                        <span className="bg-amber-500 text-black text-[10px] font-black px-2 py-0.5 rounded-md uppercase">
                          Wholesale (MOQ {item.moq})
                        </span>
                      ) : (
                        <span className="bg-blue-600 text-white text-[10px] font-bold px-2 py-0.5 rounded-md">
                          Retail
                        </span>
                      )}
                    </div>

                    {/* Remove button */}
                    <button
                      onClick={() => handleRemove(item.id)}
                      className="absolute top-3 right-3 p-2 rounded-full bg-black/60 hover:bg-red-600 text-zinc-300 hover:text-white backdrop-blur-md transition-colors shadow-md"
                      title="Remove from wishlist"
                    >
                      <Trash2 className="h-3.5 w-3.5" />
                    </button>
                  </div>

                  {/* Body info */}
                  <div className="p-4 space-y-2.5">
                    <div className="flex items-center justify-between text-xs text-zinc-400">
                      <span className="flex items-center gap-1 truncate max-w-[130px]">
                        <Store className="h-3 w-3 text-[#FF7A00]" /> {item.storeName}
                      </span>
                      <span className="flex items-center gap-1 font-bold text-amber-400">
                        <Star className="h-3 w-3 fill-amber-400" /> {item.rating} ({item.reviews})
                      </span>
                    </div>

                    <h3 className="text-sm font-bold text-white line-clamp-2 leading-snug group-hover:text-[#FF7A00] transition-colors">
                      {item.title}
                    </h3>

                    {/* Price and Stock status */}
                    <div className="flex items-center justify-between pt-1">
                      <div className="flex items-baseline gap-1.5">
                        <span className="text-lg font-black text-[#FF7A00]">৳{item.price.toLocaleString()}</span>
                        {item.originalPrice && (
                          <span className="text-xs text-zinc-500 line-through">৳{item.originalPrice.toLocaleString()}</span>
                        )}
                      </div>

                      <span className={`text-[10px] font-black uppercase px-2 py-0.5 rounded-full ${
                        item.inStock ? "bg-emerald-500/10 text-emerald-400" : "bg-red-500/10 text-red-400"
                      }`}>
                        {item.inStock ? "In Stock" : "Out of Stock"}
                      </span>
                    </div>
                  </div>
                </div>

                {/* Footer action */}
                <div className="p-4 pt-0">
                  <button
                    disabled={!item.inStock}
                    onClick={() => handleAddToCart(item)}
                    className={`w-full py-2.5 px-3 rounded-xl text-xs font-bold transition-all flex items-center justify-center gap-2 ${
                      !item.inStock 
                        ? "bg-zinc-800 text-zinc-500 cursor-not-allowed" 
                        : addedIds.has(item.id)
                          ? "bg-emerald-500 text-white"
                          : "bg-[#FF7A00] hover:bg-[#e06b00] text-white shadow-md shadow-[#FF7A00]/20"
                    }`}
                  >
                    {addedIds.has(item.id) ? (
                      <>
                        <Check className="h-4 w-4" /> Added to Cart!
                      </>
                    ) : item.inStock ? (
                      <>
                        <ShoppingBag className="h-4 w-4" /> Add to Cart
                      </>
                    ) : (
                      "Currently Unavailable"
                    )}
                  </button>
                </div>
              </motion.div>
            ))}
          </AnimatePresence>
        </div>
      )}
    </div>
  );
}
