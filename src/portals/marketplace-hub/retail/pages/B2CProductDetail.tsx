import React from 'react';
import { motion } from 'motion/react';
import { ArrowLeft, ShoppingBag, ShoppingCart, CheckCircle2 } from 'lucide-react';
import { useLanguage } from '@/features/language/LanguageContext';
import { useCartStore } from '@/modules/cart';
import { toast } from 'sonner';

export interface B2CProductDetailProps {
  product: any;
  onBack: () => void;
  onVisitStore?: (storeName: string) => void;
  onVisitBrand?: (brandName: string) => void;
}

export const B2CProductDetail: React.FC<B2CProductDetailProps> = ({ product, onBack, onVisitStore, onVisitBrand }) => {
  const { isBn } = useLanguage();
  const { addItem } = useCartStore();

  const handleAddToCart = () => {
    addItem({
      id: product?.id,
      sourceId: product?.id,
      name: isBn ? product?.nameBn || product?.name || 'সুপার কটন প্রিমিয়াম শার্ট' : product?.name || 'Super Cotton Premium Shirt',
      price: product?.price || 1250,
      quantity: 1,
      image: product?.image || 'https://images.unsplash.com/photo-1607082348824-0a96f2a4b9da?q=80&w=300',
      domain: 'retail'
    });
    toast.success(isBn ? 'কার্টে যোগ করা হয়েছে!' : 'Added to Cart!');
  };

  return (
    <div className="bg-[#020604] min-h-screen text-white pb-20 p-5 max-w-[480px] mx-auto">
      {/* Header */}
      <div className="flex items-center gap-4 mb-6">
        <button onClick={onBack} className="h-11 w-11 flex items-center justify-center rounded-2xl bg-zinc-950 border border-white/5 hover:bg-zinc-900 active:scale-95 transition-all">
          <ArrowLeft className="h-5 w-5 text-white" />
        </button>
        <div>
          <h1 className="text-sm font-black text-white uppercase tracking-widest">
            {isBn ? "পণ্যের বিবরণ" : "Product Detail"}
          </h1>
          <p className="text-[10px] text-cyan-400 font-bold uppercase tracking-widest mt-0.5">
            Retail Hub
          </p>
        </div>
      </div>

      {/* Main product card */}
      <div className="space-y-6">
        <div className="aspect-square w-full rounded-[2.5rem] overflow-hidden bg-zinc-900 border border-white/5 relative">
          <img src={product?.image || "https://images.unsplash.com/photo-1607082348824-0a96f2a4b9da?q=80&w=600"} alt="Product" className="w-full h-full object-cover" />
        </div>

        <div className="space-y-3">
          <div className="flex items-center gap-2">
            <span className="px-2.5 py-1 rounded-lg bg-cyan-500/10 border border-cyan-500/20 text-[8px] font-black text-cyan-400 uppercase tracking-widest">
              {product?.category || 'EXCLUSIVE'}
            </span>
            <span className="text-[10px] text-emerald-400 font-bold flex items-center gap-1">
              <CheckCircle2 className="w-3.5 h-3.5" /> {isBn ? "স্টকে আছে" : "In Stock"}
            </span>
          </div>

          <h2 className="text-lg font-black tracking-tight leading-snug">
            {isBn ? product?.nameBn || product?.name || 'সুপার কটন প্রিমিয়াম শার্ট' : product?.name || 'Super Cotton Premium Shirt'}
          </h2>

          <div className="flex items-baseline gap-2">
            <span className="text-2xl font-black text-cyan-400">৳{product?.price || '১,২৫০'}</span>
            {product?.originalPrice && (
              <span className="text-xs text-zinc-500 line-through">৳{product?.originalPrice}</span>
            )}
          </div>
        </div>

        <div className="h-[1px] w-full bg-white/5" />

        <p className="text-xs text-zinc-400 leading-relaxed font-medium">
          {isBn 
            ? "প্রিমিয়াম মানের পণ্য, অফিস অথবা যেকোনো ক্যাজুয়াল অনুষ্ঠানে ব্যবহার করার জন্য উপযুক্ত। অত্যন্ত আরামদায়ক এবং দীর্ঘস্থায়ী।" 
            : "Premium quality product, perfect for daily use or special occasions. Designed for high durability and performance."}
        </p>

        {/* CTAs */}
        <div className="flex gap-3 pt-4">
          <button 
            onClick={handleAddToCart}
            className="flex-1 h-14 bg-zinc-900 border border-white/5 text-zinc-100 rounded-2xl font-black text-xs uppercase tracking-[0.2em] hover:bg-zinc-800 transition-all active:scale-95 flex items-center justify-center gap-2 min-h-[44px]"
          >
            <ShoppingCart className="w-4 h-4" />
            <span>{isBn ? "কার্টে যোগ করুন" : "Add to Cart"}</span>
          </button>

          <button 
            onClick={handleAddToCart}
            className="flex-1 h-14 bg-cyan-400 text-black rounded-2xl font-black text-xs uppercase tracking-[0.2em] hover:bg-cyan-300 transition-all active:scale-95 flex items-center justify-center gap-2 min-h-[44px]"
          >
            <ShoppingBag className="w-4 h-4" />
            <span>{isBn ? "কিনুন" : "Buy Now"}</span>
          </button>
        </div>
      </div>
    </div>
  );
};
