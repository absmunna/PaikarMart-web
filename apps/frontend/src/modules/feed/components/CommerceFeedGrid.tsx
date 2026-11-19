import React from 'react';
import { ShoppingCart, Star, MapPin, Zap, CheckCircle2, Heart } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { useCartStore } from '@/modules/cart';
import { useWishlistStore } from '@/modules/wishlist';
import { toast } from 'sonner';

export interface CommerceProductItem {
  id: string;
  name: string;
  title?: string;
  price: number;
  originalPrice?: number | null;
  discount?: number;
  category: string;
  moq?: number;
  stock?: number;
  rating?: number;
  reviewCount?: number;
  soldCount?: number;
  image: string;
  images?: string[];
  seller: {
    id: string;
    name: string;
    storeName: string;
    location: string;
    district?: string;
    division?: string;
    isVerified?: boolean;
    rating?: number;
  };
}

interface CommerceFeedGridProps {
  products: CommerceProductItem[];
  isLoading?: boolean;
}

export const CommerceFeedGrid: React.FC<CommerceFeedGridProps> = ({ products, isLoading }) => {
  const navigate = useNavigate();
  const { addItem } = useCartStore();
  const { toggleWishlist, isInWishlist } = useWishlistStore();

  const handleCardClick = (productId: string) => {
    navigate(`/product/${productId}`);
  };

  const handleAddToCart = (e: React.MouseEvent, product: CommerceProductItem) => {
    e.stopPropagation();
    addItem({
      id: product.id,
      name: product.name || product.title || '',
      price: product.price,
      originalPrice: product.originalPrice || undefined,
      image: product.image,
      quantity: 1,
      moq: product.moq || 1,
      vendorName: product.seller.storeName || product.seller.name,
      portal: product.category === 'wholesale' ? 'b2b' : 'b2c'
    });
    toast.success(`${(product.name || product.title || '').slice(0, 24)}... কার্টে যোগ হয়েছে! 🛒`);
  };

  const handleWishlist = (e: React.MouseEvent, product: CommerceProductItem) => {
    e.stopPropagation();
    toggleWishlist({
      id: product.id,
      name: product.name,
      price: product.price,
      originalPrice: product.originalPrice || undefined,
      image: product.image,
      category: product.category,
      stock: product.stock || 50,
      sellerName: product.seller.storeName,
      sellerLocation: product.seller.location,
      rating: product.rating || 5.0,
      reviewCount: product.reviewCount || 10,
      isVerifiedSeller: product.seller.isVerified || true
    } as any);

    if (!isInWishlist(product.id)) {
      toast.success('পণ্যটি উইশলিস্টে যুক্ত হয়েছে! ❤️');
    } else {
      toast.info('উইশলিস্ট থেকে সরানো হয়েছে');
    }
  };

  if (isLoading) {
    return (
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3 sm:gap-4.5">
        {[...Array(8)].map((_, i) => (
          <div key={i} className="rounded-3xl bg-white/[0.03] border border-white/5 animate-pulse overflow-hidden p-3 space-y-3">
            <div className="aspect-square bg-white/5 rounded-2xl w-full" />
            <div className="h-4 bg-white/5 rounded-md w-3/4" />
            <div className="h-4 bg-white/5 rounded-md w-1/2" />
          </div>
        ))}
      </div>
    );
  }

  if (products.length === 0) {
    return (
      <div className="w-full text-center py-16 bg-[var(--pm-surface)]/60 rounded-3xl border border-[var(--pm-border)] p-6">
        <p className="text-base font-black text-zinc-300">কোনো প্রোডাক্ট পাওয়া যায়নি</p>
        <p className="text-xs text-[var(--pm-text-muted)] mt-1">অন্য কোনো ফিল্টার বা লোকেশন নির্বাচন করে চেষ্টা করুন</p>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3 sm:gap-4.5">
      {products.map((product) => {
        const title = product.name || product.title || '';
        const inWish = isInWishlist(product.id);

        return (
          <div
            key={product.id}
            onClick={() => handleCardClick(product.id)}
            className="group relative bg-[var(--pm-surface)] border border-[var(--pm-border)] rounded-2xl sm:rounded-3xl overflow-hidden hover:border-[var(--pm-accent)]/50 transition-all duration-300 shadow-sm hover:shadow-xl hover:shadow-black/50 flex flex-col cursor-pointer"
          >
            {/* 1:1 Product Image Container */}
            <div className="relative w-full aspect-square bg-zinc-900 overflow-hidden">
              <img
                src={product.image}
                alt={title}
                className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                loading="lazy"
              />

              {/* Discount Badge */}
              {product.discount && product.discount > 0 && (
                <div className="absolute top-2.5 left-2.5 bg-rose-600 text-white text-[10px] font-black px-2 py-0.5 rounded-lg shadow-md">
                  {product.discount}% OFF
                </div>
              )}

              {/* Wholesale MOQ Badge */}
              {product.moq && product.moq > 1 && (
                <div className="absolute bottom-2.5 left-2.5 bg-indigo-600 text-white text-[9px] font-black px-2 py-0.5 rounded-lg shadow-md">
                  MOQ: {product.moq} পিস
                </div>
              )}

              {/* Wishlist Floating Button */}
              <button
                onClick={(e) => handleWishlist(e, product)}
                className={`absolute top-2.5 right-2.5 w-8 h-8 rounded-full bg-black/60 backdrop-blur-md flex items-center justify-center transition-transform hover:scale-110 active:scale-95 ${
                  inWish ? 'text-rose-500' : 'text-white/80 hover:text-white'
                }`}
                title="উইশলিস্টে রাখুন"
              >
                <Heart className={`w-4 h-4 ${inWish ? 'fill-rose-500 text-rose-500' : ''}`} />
              </button>
            </div>

            {/* Product Meta Body */}
            <div className="p-3 sm:p-4 flex-1 flex flex-col justify-between space-y-2">
              <div>
                {/* Seller Location Tag */}
                <div className="flex items-center gap-1 text-[10px] text-[var(--pm-text-muted)] font-bold mb-1">
                  <MapPin className="w-3 h-3 text-[var(--pm-accent)] shrink-0" />
                  <span className="truncate">{product.seller.location}</span>
                </div>

                {/* Title */}
                <h4 className="text-xs sm:text-sm font-black text-white line-clamp-2 group-hover:text-[var(--pm-accent)] transition-colors leading-snug">
                  {title}
                </h4>
              </div>

              {/* Price & Rating & Add to Cart Action */}
              <div className="pt-1 border-t border-[var(--pm-border)]/50">
                <div className="flex items-baseline gap-1.5 flex-wrap">
                  <span className="text-sm sm:text-base font-black text-white">
                    ৳{product.price.toLocaleString('bn-BD')}
                  </span>
                  {product.originalPrice && (
                    <span className="text-[11px] text-zinc-500 line-through">
                      ৳{product.originalPrice.toLocaleString('bn-BD')}
                    </span>
                  )}
                </div>

                <div className="flex items-center justify-between mt-2 pt-1">
                  {/* Star Rating */}
                  <div className="flex items-center gap-1 text-[11px] font-bold text-amber-400">
                    <Star className="w-3.5 h-3.5 fill-amber-400 text-amber-400" />
                    <span>{product.rating || '4.9'}</span>
                    <span className="text-zinc-500 text-[10px]">
                      ({product.reviewCount || product.soldCount || 24})
                    </span>
                  </div>

                  {/* Add to Cart Quick Trigger */}
                  <button
                    onClick={(e) => handleAddToCart(e, product)}
                    className="p-2 sm:px-3 sm:py-1.5 rounded-xl bg-[var(--pm-accent)] hover:opacity-90 active:scale-95 text-white text-xs font-black flex items-center gap-1.5 transition-all shadow-md shadow-[var(--pm-accent)]/20"
                    title="কার্টে যোগ করুন"
                  >
                    <ShoppingCart className="w-3.5 h-3.5" />
                    <span className="hidden sm:inline">যোগ করুন</span>
                  </button>
                </div>
              </div>
            </div>
          </div>
        );
      })}
    </div>
  );
};
