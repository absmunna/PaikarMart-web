import React from 'react';
import { Link } from 'react-router-dom';
import { ShoppingCart, Star, MapPin } from 'lucide-react';
import { useCartStore } from '@/modules/cart';

export interface ProductCardProps {
  product: any;
  className?: string;
  onQuickAdd?: (product: any) => void;
  activePortal?: string;
  noLink?: boolean;
  customAction?: React.ReactNode;
  onClick?: (e?: any) => void;
  isFlashSale?: boolean;
  [key: string]: any;
}

export const ProductCard = React.forwardRef<HTMLDivElement, ProductCardProps>(function ProductCard({
  product,
  className = "",
  onQuickAdd,
  noLink,
  customAction,
  onClick,
  isFlashSale
}, ref) {
  const addItem = useCartStore((state) => state.addItem);

  if (!product) return null;

  const title = product.name || product.title || product.nameBn || 'প্রোডাক্ট';
  const price = Number(product.price) || 0;
  const originalPrice = product.originalPrice ? Number(product.originalPrice) : undefined;
  const discount = product.discount || (originalPrice && originalPrice > price ? Math.round(((originalPrice - price) / originalPrice) * 100) : undefined);
  const imageUrl = product.image || product.images?.[0] || product.imageUrl || 'https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=600&q=80';
  const seller = product.sellerName || product.seller || product.vendorName || (typeof product.vendor === 'string' ? product.vendor : product.vendor?.name) || 'পিকআর্ট মার্চেন্ট';
  const location = product.sellerLocation || product.location || 'ঢাকা';
  const rating = product.rating || 4.8;
  const reviewCount = product.reviewCount || product.reviews || 45;
  const moq = product.moq || product.minOrder;
  const unit = product.unit || 'পিস';

  const handleAddToCart = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (onQuickAdd) {
      onQuickAdd(product);
    } else {
      addItem({
        id: String(product.id),
        productId: String(product.id),
        quantity: Number(moq) || 1,
        product: {
          id: String(product.id),
          name: title,
          title,
          price,
          image: imageUrl,
          seller,
          unit
        }
      });
    }
  };

  const cardContent = (
    <div
      ref={ref}
      onClick={onClick}
      className={`bg-white dark:bg-slate-900 rounded-xl border border-slate-200/80 dark:border-slate-800 shadow-sm hover:shadow-lg transition-all duration-300 overflow-hidden flex flex-col group ${className}`}
    >
      {/* Image Container */}
      <div className="relative aspect-square bg-slate-100 dark:bg-slate-800 overflow-hidden">
        <img
          src={imageUrl}
          alt={title}
          referrerPolicy="no-referrer"
          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
        />

        {/* Discount Badge */}
        {discount && discount > 0 && (
          <span className="absolute top-2.5 left-2.5 bg-[var(--pm-accent,#ff6b00)] text-white text-[11px] font-bold px-2 py-0.5 rounded-md shadow-sm">
            {discount}% ছাড়
          </span>
        )}

        {/* MOQ Badge */}
        {moq && Number(moq) > 1 && (
          <span className="absolute top-2.5 right-2.5 bg-slate-900/80 backdrop-blur-md text-white text-[10px] font-medium px-2 py-0.5 rounded-md">
            MOQ: {moq} {unit}
          </span>
        )}
      </div>

      {/* Content Body */}
      <div className="p-3 flex flex-col flex-1 justify-between gap-2.5">
        <div className="space-y-1.5">
          {/* Seller & Location */}
          <div className="flex items-center justify-between text-[11px] text-slate-500 dark:text-slate-400">
            <span className="truncate max-w-[110px]">{seller}</span>
            <span className="flex items-center gap-0.5 shrink-0">
              <MapPin className="w-3 h-3 text-slate-400" />
              {location}
            </span>
          </div>

          {/* Title */}
          <h3 className="font-semibold text-slate-900 dark:text-white text-xs leading-snug line-clamp-2 group-hover:text-[var(--pm-accent,#ff6b00)] transition-colors">
            {title}
          </h3>

          {/* Rating */}
          <div className="flex items-center gap-1 text-[11px]">
            <div className="flex items-center text-amber-500">
              <Star className="w-3 h-3 fill-amber-500" />
              <span className="font-bold ml-0.5 text-slate-800 dark:text-slate-200">{rating}</span>
            </div>
            <span className="text-slate-400">({reviewCount})</span>
          </div>
        </div>

        {/* Price & Action */}
        <div className="pt-2 border-t border-slate-100 dark:border-slate-800 flex items-center justify-between gap-2">
          <div>
            <div className="flex items-baseline gap-1.5">
              <span className="text-sm font-bold text-slate-900 dark:text-white">
                ৳{price.toLocaleString()}
              </span>
              {originalPrice && originalPrice > price && (
                <span className="text-[11px] text-slate-400 line-through">
                  ৳{originalPrice.toLocaleString()}
                </span>
              )}
            </div>
            {unit && <span className="text-[10px] text-slate-500">প্রতি {unit}</span>}
          </div>

          {customAction ? (
            customAction
          ) : (
            <button
              type="button"
              onClick={handleAddToCart}
              className="p-2 bg-[var(--pm-accent,#ff6b00)] text-white rounded-lg hover:opacity-90 transition-all shadow-sm active:scale-95 flex items-center justify-center"
              title="কার্টে যোগ করুন"
            >
              <ShoppingCart className="w-4 h-4" />
            </button>
          )}
        </div>
      </div>
    </div>
  );

  if (noLink || onClick) {
    return cardContent;
  }

  return (
    <Link to={`/marketplace/product/${product.id}`} className="flex flex-col flex-1">
      {cardContent}
    </Link>
  );
});

ProductCard.displayName = 'ProductCard';
