import React, { useState } from 'react';
import { motion } from 'motion/react';
import { Heart, ShoppingCart, Star, Briefcase } from 'lucide-react';
import { cn } from '@/lib/utils';
import { formatBDT } from '@/lib/format';
import { useCartStore } from '@/modules/cart';
import { useNavigate } from 'react-router-dom';
import type { FeedProduct } from '@/features/user-profile/types';

export function ProductCard({ item, product, ...props }: any) {
  const [liked, setLiked] = useState(false);
  const addItem = useCartStore((state) => state.addItem);
  const navigate = useNavigate();

  // Normalize data between 'item' and 'product'
  const p = item || product;
  if (!p) return null;

  const name = p.name || p.title || p.nameLocal || 'Product';
  const price = p.price || 0;
  const originalPrice = p.originalPrice || p.oldPrice;
  const image = p.image || p.imageUrl || p.images?.[0] || 'https://via.placeholder.com/300';
  const category = p.category || p.categoryName || 'General';
  const rating = p.rating || 0;
  const sold = p.sold || p.sales || 0;
  const postedAt = p.postedAt || p.createdAt || 'Just now';
  const stock = p.stock !== undefined ? p.stock : 99;

  const discount = originalPrice ? Math.round(((originalPrice - price) / originalPrice) * 100) : 0;

  const isService = p.type === 'service' || p.portal === 'services';
  const isDigital = p.type === 'digital' || p.portal === 'digital';
  
  const actionText = isService ? 'বুক করুন' : isDigital ? 'ডাউনলোড' : 'কার্টে যোগ করুন';
  const ActionIcon = isService ? Briefcase : ShoppingCart;
  const sellerName = p.seller || p.provider || p.vendorName || p.storeName;

  return (
    <motion.div
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      onClick={() => navigate(`/marketplace/product/${p.id}`)}
      className="bg-[#050D08] border border-[#1e3425] rounded-[28px] overflow-hidden hover:border-cyan-400/40 transition-all duration-300 group shadow-lg cursor-pointer"
    >
      <div className="relative aspect-[4/3] overflow-hidden bg-[#0c1511]">
        <img src={image} alt={name} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />
        {discount > 0 && (
          <div className="absolute top-2.5 left-2.5 bg-red-600 text-white text-[10px] font-black px-2 py-0.5 rounded-lg border border-white/10">
            -{discount}%
          </div>
        )}
        {isService && (
          <div className="absolute top-2.5 left-2.5 bg-indigo-600 text-white text-[10px] font-black px-2 py-0.5 rounded-lg border border-white/10 uppercase">
            Service
          </div>
        )}
        <button
          onClick={(e) => { e.stopPropagation(); setLiked(l => !l); }}
          className="absolute top-2.5 right-2.5 w-8 h-8 bg-black/40 backdrop-blur-md rounded-full flex items-center justify-center transition-all hover:bg-black/60 border border-white/10"
        >
          <Heart className={cn('w-4 h-4 transition-colors', liked ? 'fill-rose-500 text-rose-500' : 'text-white')} />
        </button>
      </div>

      <div className="p-3.5">
        <div className="flex items-center justify-between font-black uppercase tracking-tighter mb-1">
          <p className="text-[10px] text-cyan-400">{category}</p>
          {sellerName && (
            <p className="text-[8px] text-zinc-400 bg-white/5 px-1.5 py-0.5 rounded flex items-center gap-1">
              {sellerName}
            </p>
          )}
        </div>
        <h3 className="text-xs font-bold text-white leading-snug line-clamp-2 mb-2 h-8">{name}</h3>

        <div className="flex items-baseline gap-1.5 mb-2">
          <span className="text-sm font-black text-white">{isService ? 'Starting at ' : ''}{formatBDT(price)}</span>
          {originalPrice && !isService && (
            <span className="text-[10px] text-zinc-500 line-through">{formatBDT(originalPrice)}</span>
          )}
        </div>

        <div className="flex items-center justify-between text-[10px] text-zinc-500 mb-3 font-bold">
          <span className="flex items-center gap-1">
            <Star className="w-3 h-3 fill-amber-500 text-amber-500" />
            {rating} {isService ? '· Expert' : `· ${sold} sold`}
          </span>
        </div>

        <motion.button
          whileTap={{ scale: 0.97 }}
          onClick={(e) => {
            e.stopPropagation();
            if (isService) {
              navigate(`/marketplace/product/${p.id}`);
            } else {
              addItem({...p, id: p.id, name, price, image, quantity: 1, portal: p.portal || 'b2c', stock});
            }
          }}
          className="w-full flex items-center justify-center gap-2 py-2.5 bg-cyan-400 border border-[#00c853] text-[#010804] rounded-xl text-[11px] font-black shadow-[0_2px_0_#008f4c] active:translate-y-[1px] active:shadow-none transition-all uppercase tracking-wide h-[38px] cursor-pointer"
        >
          <ActionIcon className="w-4 h-4" />
          {actionText}
        </motion.button>
      </div>
    </motion.div>
  );
}
