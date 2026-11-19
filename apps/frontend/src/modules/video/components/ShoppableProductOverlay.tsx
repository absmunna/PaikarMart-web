import React from 'react';
import { ShoppingBag, Zap, Check, ChevronRight } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { toast } from 'sonner';
import { useCartStore, useCartDrawerStore } from '@/modules/cart';
import { LinkedProduct } from '../types';

interface ShoppableProductOverlayProps {
  product: LinkedProduct;
  className?: string;
  variant?: 'compact' | 'expanded' | 'banner';
}

export const ShoppableProductOverlay: React.FC<ShoppableProductOverlayProps> = ({
  product,
  className = '',
  variant = 'compact'
}) => {
  const navigate = useNavigate();
  const addItem = useCartStore((s) => s.addItem);
  const openCart = useCartDrawerStore((s) => s.open);

  const handleAddToCart = (e: React.MouseEvent) => {
    e.stopPropagation();
    addItem({
      id: product.id,
      name: product.title || product.name || 'পণ্য',
      price: product.price,
      originalPrice: product.originalPrice,
      image: product.image,
      quantity: product.moq || 1,
      moq: product.moq || 1,
      stock: 100,
      portal: product.portal || 'wholesale',
      seller: 'ভেরিফাইড পাইকার সেলার'
    });
    toast.success(`"${product.title.slice(0, 24)}..." কার্টে যোগ হয়েছে!`);
    openCart();
  };

  const handleBuyNow = (e: React.MouseEvent) => {
    e.stopPropagation();
    addItem({
      id: product.id,
      name: product.title || product.name || 'পণ্য',
      price: product.price,
      originalPrice: product.originalPrice,
      image: product.image,
      quantity: product.moq || 1,
      moq: product.moq || 1,
      stock: 100,
      portal: product.portal || 'wholesale',
      seller: 'ভেরিফাইড পাইকার সেলার'
    });
    navigate('/checkout');
  };

  if (variant === 'banner') {
    return (
      <div className={`p-3 sm:p-4 rounded-2xl bg-black/75 backdrop-blur-xl border border-white/15 flex items-center justify-between gap-3 shadow-2xl ${className}`}>
        <div 
          onClick={() => navigate(`/product/${product.id}`)}
          className="flex items-center gap-3 cursor-pointer group min-w-0"
        >
          <img 
            src={product.image} 
            alt={product.title} 
            className="w-12 h-12 sm:w-14 sm:h-14 rounded-xl object-cover border border-white/10 shrink-0 group-hover:scale-105 transition-transform" 
            referrerPolicy="no-referrer"
          />
          <div className="min-w-0">
            <span className="text-[9px] font-black uppercase text-[#FF7A00] tracking-wider block">
              ভিডিওতে উল্লেখিত পণ্য
            </span>
            <h4 className="text-xs font-bold text-white truncate group-hover:text-[#FF7A00] transition-colors">
              {product.title}
            </h4>
            <div className="flex items-center gap-2 mt-0.5">
              <span className="text-xs sm:text-sm font-black text-[#FF7A00]">
                ৳{product.price.toLocaleString()}
              </span>
              {product.originalPrice && (
                <span className="text-[10px] text-zinc-400 line-through">
                  ৳{product.originalPrice.toLocaleString()}
                </span>
              )}
              {product.moq && product.moq > 1 && (
                <span className="text-[9px] font-bold px-1.5 py-0.2 rounded bg-white/10 text-zinc-300">
                  MOQ: {product.moq}
                </span>
              )}
            </div>
          </div>
        </div>

        <div className="flex items-center gap-2 shrink-0">
          <button
            onClick={handleAddToCart}
            className="p-2 sm:px-3 sm:py-2 rounded-xl bg-white/10 hover:bg-white/20 text-white text-xs font-bold transition-all active:scale-95 flex items-center gap-1.5 cursor-pointer"
            title="কার্টে যোগ করুন"
          >
            <ShoppingBag className="w-3.5 h-3.5 text-[#FF7A00]" />
            <span className="hidden sm:inline">কার্ট</span>
          </button>
          <button
            onClick={handleBuyNow}
            className="px-3.5 py-2 rounded-xl bg-[#FF7A00] hover:bg-[#e06b00] text-white text-xs font-black shadow-lg shadow-[#FF7A00]/25 transition-all active:scale-95 flex items-center gap-1 cursor-pointer"
          >
            <Zap className="w-3.5 h-3.5" />
            <span>কিনুন</span>
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className={`p-2.5 rounded-2xl bg-black/70 backdrop-blur-md border border-white/10 flex items-center justify-between gap-3 shadow-xl ${className}`}>
      <div 
        onClick={() => navigate(`/product/${product.id}`)}
        className="flex items-center gap-2.5 cursor-pointer min-w-0"
      >
        <img 
          src={product.image} 
          alt={product.title} 
          className="w-10 h-10 rounded-xl object-cover shrink-0 border border-white/10"
          referrerPolicy="no-referrer"
        />
        <div className="min-w-0">
          <p className="text-[11px] font-bold text-white truncate max-w-[150px] sm:max-w-[180px]">
            {product.title}
          </p>
          <p className="text-xs font-black text-[#FF7A00]">
            ৳{product.price.toLocaleString()}
          </p>
        </div>
      </div>

      <button
        onClick={handleAddToCart}
        className="px-2.5 py-1.5 rounded-xl bg-[#FF7A00] hover:bg-[#e06b00] text-white text-[11px] font-bold shrink-0 transition-all active:scale-95 flex items-center gap-1 cursor-pointer"
      >
        <ShoppingBag className="w-3 h-3" />
        <span>কার্ট</span>
      </button>
    </div>
  );
};
