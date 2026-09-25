import React from 'react';
import { motion } from 'framer-motion';
import { Star, Heart } from 'lucide-react';

export interface Product {
  id: string | number;
  name?: string;
  title?: string;
  price: string | number;
  rating?: string | number;
  reviews?: string | number;
  image?: string;
  imageUrl?: string;
  [key: string]: any;
}

export interface ProductCardProps {
  product: any;
  className?: string;
  onSelectProduct?: (product: any) => void;
  onClick?: (e?: any) => void;
  isFlashSale?: boolean;
  noLink?: boolean;
  customAction?: React.ReactNode;
  [key: string]: any;
}

export const ProductCard: React.FC<ProductCardProps> = ({ 
  product, 
  className = "",
  onSelectProduct,
  onClick,
  isFlashSale,
  customAction
}) => {
  const title = product.name || product.title || 'Product';
  const img = product.image || product.imageUrl || (Array.isArray(product.images) ? product.images[0] : null) || `https://picsum.photos/seed/${product.id}/400/300`;
  const priceVal = typeof product.price === 'number' ? `৳${product.price.toLocaleString()}` : product.price;

  const handleClick = (e: React.MouseEvent) => {
    onClick?.(e);
    onSelectProduct?.(product);
  };

  return (
    <motion.div 
      className={`rounded-2xl bg-[var(--pm-surface)] border border-[var(--pm-border)] overflow-hidden flex flex-col relative shrink-0 cursor-pointer ${className} group`}
      whileHover={{ y: -4 }}
      whileTap={{ scale: 0.98 }}
      onClick={handleClick}
    >
      {isFlashSale && (
        <span className="absolute top-2 left-2 z-10 bg-red-600 text-white text-[9px] font-black uppercase px-2 py-0.5 rounded shadow">
          Flash Sale
        </span>
      )}
      <button 
        type="button"
        onClick={(e) => { e.stopPropagation(); }}
        className="absolute top-2 right-2 z-10 p-1.5 bg-black/20 backdrop-blur-md rounded-full text-white hover:bg-black/40"
      >
        <Heart className="w-3.5 h-3.5" />
      </button>
      <div className="h-[160px] bg-[var(--pm-surface-hover)] flex items-center justify-center overflow-hidden">
        <img 
          src={img}
          alt={title}
          className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
          referrerPolicy="no-referrer"
        />
      </div>
      <div className="p-3 flex flex-col flex-1 justify-between">
        <div>
          <h4 className="font-semibold text-sm line-clamp-1 group-hover:text-[var(--pm-accent)] transition-colors">{title}</h4>
          <p className="text-[var(--pm-accent)] font-bold text-sm mt-1">{priceVal}</p>
        </div>
        <div className="flex items-center justify-between mt-2">
          <div className="flex items-center gap-1 text-xs text-[var(--pm-text-muted)]">
            <Star className="w-3.5 h-3.5 fill-amber-400 text-amber-400" />
            <span>{product.rating ?? '4.8'}</span>
            <span>({product.reviews ?? '12'})</span>
          </div>
          {customAction}
        </div>
      </div>
    </motion.div>
  );
};
