import React from 'react';
import { motion } from 'framer-motion';
import { Star, Heart } from 'lucide-react';

export interface Product {
  id: number | string;
  name?: string;
  title?: string;
  price: string | number;
  rating?: string | number;
  reviews?: string | number;
  image?: string;
  [key: string]: any;
}

export interface ProductCardProps {
  product: Product;
  className?: string;
  noLink?: boolean;
  onClick?: () => void;
  customAction?: React.ReactNode;
  isFlashSale?: boolean;
  [key: string]: any;
}

export const ProductCard: React.FC<ProductCardProps> = ({ 
  product, 
  className = "", 
  onClick, 
  customAction 
}) => {
  const title = product.name || product.title || 'Product';
  const rating = product.rating ?? '4.8';
  const reviews = product.reviews ?? '120';
  const priceDisplay = typeof product.price === 'number' ? `৳${product.price.toLocaleString()}` : product.price;

  return (
    <motion.div 
      className={`rounded-2xl bg-[var(--pm-surface)] border border-[var(--pm-border)] overflow-hidden flex flex-col relative shrink-0 ${className} group cursor-pointer`}
      whileHover={{ y: -4 }}
      whileTap={{ scale: 0.98 }}
      onClick={onClick}
    >
      <button 
        type="button"
        onClick={(e) => { e.stopPropagation(); }}
        className="absolute top-2 right-2 z-10 p-1.5 bg-black/20 backdrop-blur-md rounded-full text-white hover:bg-black/40"
      >
        <Heart className="w-3.5 h-3.5" />
      </button>
      <div className="h-[160px] bg-[var(--pm-surface-hover)] flex items-center justify-center overflow-hidden">
        <img 
          src={product.image || product.images?.[0] || `https://picsum.photos/seed/${product.id}/400/300`}
          alt={title}
          className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
          referrerPolicy="no-referrer"
        />
      </div>
      <div className="p-3 flex flex-col gap-1 flex-1 justify-between">
        <div>
          <h3 className="text-sm font-medium text-[var(--pm-text)] truncate">{title}</h3>
          <div className="flex items-center gap-1">
            <Star className="w-3 h-3 text-yellow-500 fill-yellow-500" />
            <span className="text-[10px] text-[var(--pm-text-muted)]">{rating} ({reviews})</span>
          </div>
          <p className="text-sm font-bold text-[var(--pm-accent)] mt-1">{priceDisplay}</p>
        </div>
        {customAction && (
          <div className="mt-2" onClick={(e) => e.stopPropagation()}>
            {customAction}
          </div>
        )}
      </div>
    </motion.div>
  );
};
