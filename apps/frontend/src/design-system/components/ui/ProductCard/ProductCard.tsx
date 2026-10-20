import React from 'react';
import { motion } from 'framer-motion';
import { 
  Star, Heart, ShoppingBag, Store, Activity, 
  Wrench, Laptop, Coins, ShieldCheck, MapPin, 
  ArrowUpRight, Clock
} from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { toast } from 'sonner';
import { useCartStore } from '@/modules/cart';
import { useCartDrawerStore } from '@/modules/cart/store/cartDrawerStore';
import productPlaceholder from '@/assets/images/product_placeholder_retail_1791196580439.jpg';

export interface Product {
  id: string | number;
  name?: string;
  title?: string;
  price: number;
  originalPrice?: number;
  rating?: number;
  reviewCount?: number;
  image?: string;
  imageUrl?: string;
  seller?: string;
  vendorName?: string;
  location?: string;
  category?: string;
  portal?: string;
  type?: string;
  moq?: number;
  unit?: string;
  [key: string]: any;
}

export interface ProductCardProps {
  product: any; // Using any for maximum compatibility with existing mock data
  className?: string;
  onQuickAdd?: (product: any) => void;
  activePortal?: string;
  noLink?: boolean;
  customAction?: React.ReactNode;
  onClick?: (e?: any) => void;
  isFlashSale?: boolean;
}

export const ProductCard = React.forwardRef<HTMLDivElement, ProductCardProps>(function ProductCard({ 
  product, 
  className = "",
  onQuickAdd,
  activePortal,
  noLink = false,
  customAction,
  onClick,
  isFlashSale
}, ref) {
  const navigate = useNavigate();
  const [imageLoaded, setImageLoaded] = React.useState(false);
  
  const title = product.name || product.title || 'Product';
  const img = product.image || product.imageUrl || productPlaceholder;
  
  // Classification Logic
  const isWholesaleItem = product.type === 'wholesale' || product.portal === 'wholesale' || Boolean(product.moq && product.moq > 1);
  const isPharmacyItem = product.portal === 'pharmacy';
  const isServiceItem = product.type === 'service' || product.portal === 'services' || product.portal === 'ride';
  const isDigitalItem = product.type === 'digital' || product.portal === 'digital';
  const isPkItem = activePortal === 'pk-shop' || product.isPkExclusive || ['1', '5', '10', '58', '62'].includes(String(product.id));
  const isBrandItem = ['Bata', 'Aarong', 'Apple', 'Samsung', 'Walton', 'Vision'].includes(product.seller || '');
  const isNearbyItem = activePortal === 'nearby' || product.portal === 'food' || product.portal === 'ride';

  const handleNavigate = (e: React.MouseEvent) => {
    if (noLink) {
      onClick?.(e);
      return;
    }
    navigate(`/product/${product.id}`);
    onClick?.(e);
  };

  return (
    <motion.div
      ref={ref}
      layout
      initial={{ opacity: 0, scale: 0.96 }}
      animate={{ opacity: 1, scale: 1 }}
      exit={{ opacity: 0, scale: 0.96 }}
      transition={{ duration: 0.2 }}
      onClick={handleNavigate}
      className={`group bg-[var(--pm-surface)] rounded-3xl border border-[var(--pm-border)] overflow-hidden hover:border-orange-500/40 hover:shadow-xl transition-all duration-300 flex flex-col justify-between cursor-pointer ${className}`}
      whileHover={{ y: -4 }}
    >
      <div>
        {/* Product Image Section (1:1 Aspect Ratio) */}
        <div className="aspect-square w-full relative overflow-hidden bg-zinc-900">
          {/* Skeleton Shimmer */}
          {!imageLoaded && (
            <div className="absolute inset-0 bg-zinc-800 animate-pulse flex items-center justify-center">
              <ShoppingBag className="w-8 h-8 text-zinc-700 opacity-20" />
            </div>
          )}

          <img
            src={img}
            alt={title}
            onLoad={() => setImageLoaded(true)}
            onError={(e) => {
              const target = e.currentTarget;
              if (target.src !== productPlaceholder) {
                target.src = productPlaceholder;
              }
            }}
            className={`w-full h-full object-cover group-hover:scale-105 transition-all duration-500 ${
              imageLoaded ? 'opacity-100' : 'opacity-0'
            }`}
            referrerPolicy="no-referrer"
          />
          
          {isFlashSale && (
            <div className="absolute top-0 right-0 z-20 bg-rose-600 text-white text-[8px] font-black uppercase px-2 py-1 rounded-bl-xl shadow-lg">
              Flash Sale
            </div>
          )}
          
          {/* Top Left Labels (Subtle Overlays) */}
          <div className="absolute top-3 left-3 flex flex-wrap gap-1.5 z-10 max-w-full">
            {isPkItem && (
              <span className="px-2 py-0.5 rounded-lg bg-amber-500 text-black text-[7px] font-black uppercase tracking-wider shadow-md">
                PK Exclusive
              </span>
            )}
          </div>

          {/* Bottom Right Floating Badge */}
          <div className="absolute bottom-3 right-3 z-10">
            {isNearbyItem && (
              <span className="px-2 py-1 rounded-xl bg-black/75 backdrop-blur-md text-emerald-400 text-[8px] font-black border border-emerald-500/20">
                📍 {product.distance || '৪৫০ মি'} দূরে · ১৫ মিনিট
              </span>
            )}
            {isBrandItem && (
              <span className="px-2 py-1 rounded-xl bg-black/75 backdrop-blur-md text-pink-400 text-[8px] font-black border border-pink-500/20">
                🛡️ অফিশিয়াল ব্রান্ড
              </span>
            )}
          </div>
        </div>

        {/* Product Content Details */}
        <div className="p-4 space-y-2 text-left">
          {/* Unboxed Metadata / Kicker */}
          <div className="flex items-center gap-1 text-[8px] font-black uppercase tracking-widest text-zinc-500">
            {isWholesaleItem && <span className="text-indigo-400">Wholesale · MOQ {product.moq || 20}</span>}
            {isPharmacyItem && <span className="text-teal-400">Pharmacy</span>}
            {isServiceItem && <span className="text-purple-400">Professional Service</span>}
            {isDigitalItem && <span className="text-violet-400">Digital Good</span>}
            {!isWholesaleItem && !isPharmacyItem && !isServiceItem && !isDigitalItem && <span>Retail Market</span>}
          </div>

          <h4 className="text-xs sm:text-sm font-bold text-white line-clamp-2 leading-snug group-hover:text-[var(--pm-accent)] transition-colors min-h-[2.4rem]">
            {title}
          </h4>

          {/* Seller Info (Unboxed & Clickable) */}
          <div 
            onClick={(e) => {
              e.stopPropagation();
              const sellerSlug = product.vendorId || product.sellerId || product.seller;
              if (sellerSlug) {
                navigate(`/store/${encodeURIComponent(sellerSlug)}`);
              }
            }}
            className="flex items-center gap-1.5 text-[10px] text-zinc-400 font-medium hover:text-[var(--pm-accent)] transition-colors cursor-pointer"
          >
            <span className="truncate max-w-[100px] underline-offset-2 hover:underline">
              {product.seller || product.vendorName || 'PaikarMart Partner'}
            </span>
            <span aria-hidden="true" className="opacity-30">·</span>
            <span>{product.location || 'Dhaka'}</span>
          </div>

          {/* Contextual Info */}
          {isPkItem && (
            <div className="flex items-center gap-1 text-[10px] font-black text-amber-400">
              <Coins className="w-3 h-3" />
              <span className="tabular-nums">+{Math.floor(product.price * 0.05)} Coins Cashback</span>
            </div>
          )}

          {/* Pricing Row */}
          <div className="flex items-baseline justify-between pt-1 border-t border-white/[0.04]">
            <div className="flex items-baseline gap-1.5">
              <span className="text-base font-black text-[var(--pm-accent)] tabular-nums">
                {typeof product.price === 'number' 
                  ? `৳${product.price.toLocaleString('bn-BD')}` 
                  : product.price}
              </span>
              {product.unit && (
                <span className="text-[9px] text-zinc-500 font-medium">/ {product.unit}</span>
              )}
            </div>
            
            {product.originalPrice && (
              <span className="text-[10px] text-zinc-500 line-through tabular-nums">
                {typeof product.originalPrice === 'number' 
                  ? `৳${product.originalPrice.toLocaleString('bn-BD')}` 
                  : product.originalPrice}
              </span>
            )}
          </div>

          {/* Meta Info: Rating & Sales */}
          <div className="flex items-center justify-between text-[10px] text-zinc-400 font-bold">
            <div className="flex items-center gap-1">
              <Star className="w-3 h-3 fill-amber-400 stroke-amber-400" />
              <span className="text-amber-400 tabular-nums">{product.rating || '4.5'}</span>
              <span aria-hidden="true" className="opacity-30">·</span>
              <span className="tabular-nums">{product.reviewCount || 45} reviews</span>
            </div>
            {customAction ? customAction : (isServiceItem && (
              <span className="flex items-center gap-1 text-purple-400 text-[9px] font-black uppercase">
                <Clock className="w-3 h-3" /> 20m Slot
              </span>
            ))}
          </div>
        </div>
      </div>

      {/* Action Buttons Footer */}
      <div className="p-4 pt-0 grid grid-cols-2 gap-2">
        <button
          onClick={(e) => {
            e.stopPropagation();
            if (onQuickAdd) {
              onQuickAdd(product);
            } else {
              useCartStore.getState().addItem({
                id: String(product.id),
                title: product.name || product.title || 'Product',
                name: product.name || product.title || 'Product',
                price: Number(product.price) || 0,
                quantity: product.moq || 1,
                image: product.image || product.imageUrl || productPlaceholder,
                seller: product.seller || product.vendorName || 'PaikarMart Partner',
                sellerId: product.vendorId || product.sellerId || 'seller-1',
                portal: product.portal || 'retail',
                moq: product.moq || 1,
              });
              useCartDrawerStore.getState().open();
              toast.success('কার্টে যোগ করা হয়েছে');
            }
          }}
          className="w-full py-2 rounded-xl bg-white/10 hover:bg-white/15 active:scale-95 text-white text-[10px] font-black transition-all flex items-center justify-center gap-1 outline-none cursor-pointer"
        >
          <ShoppingBag className="w-3.5 h-3.5" /> কার্টে
        </button>
        
        <button
          onClick={(e) => {
            e.stopPropagation();
            if (isServiceItem) {
              navigate(`/checkout?type=service`, { state: { items: [product], subtotal: product.price } });
            } else {
              if (onQuickAdd) {
                onQuickAdd(product);
              } else {
                useCartStore.getState().addItem({
                  id: String(product.id),
                  title: product.name || product.title || 'Product',
                  name: product.name || product.title || 'Product',
                  price: Number(product.price) || 0,
                  quantity: product.moq || 1,
                  image: product.image || product.imageUrl || productPlaceholder,
                  seller: product.seller || product.vendorName || 'PaikarMart Partner',
                  sellerId: product.vendorId || product.sellerId || 'seller-1',
                  portal: product.portal || 'retail',
                  moq: product.moq || 1,
                });
              }
              navigate('/checkout');
            }
          }}
          className="w-full py-2 rounded-xl bg-gradient-to-r from-orange-500 to-[#FF7A00] hover:from-orange-600 hover:to-[#e06b00] active:scale-95 text-white text-[10px] font-black shadow-md shadow-[#FF7A00]/25 transition-all text-center flex items-center justify-center gap-1 outline-none cursor-pointer"
        >
          {isServiceItem ? 'বুক করুন' : 'কিনুন'}
        </button>
      </div>
    </motion.div>
  );
});

ProductCard.displayName = 'ProductCard';
