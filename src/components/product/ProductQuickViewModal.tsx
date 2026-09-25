import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  X, Star, ShoppingBag, ShieldCheck, Truck, Plus, Minus, 
  Store, CheckCircle2, ArrowRight, Heart 
} from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { useCartStore } from '@/modules/cart/cartStore';
import { useCartDrawerStore } from '@/modules/cart/cartDrawerStore';
import { toast } from 'sonner';

interface ProductQuickViewModalProps {
  product: any | null;
  isOpen: boolean;
  onClose: () => void;
}

export const ProductQuickViewModal: React.FC<ProductQuickViewModalProps> = ({
  product,
  isOpen,
  onClose
}) => {
  const [quantity, setQuantity] = useState(1);
  const addItem = useCartStore((state) => state.addItem);
  const openCart = useCartDrawerStore((state) => state.open);
  const navigate = useNavigate();

  if (!product) return null;

  const moq = product.moq || 1;
  const currentQuantity = Math.max(quantity, moq);
  const unitPrice = product.price;

  // Wholesale tiered pricing calculation
  const effectivePrice = currentQuantity >= 50 
    ? Math.round(unitPrice * 0.82) 
    : currentQuantity >= 10 
      ? Math.round(unitPrice * 0.90) 
      : unitPrice;

  const totalPrice = effectivePrice * currentQuantity;

  const handleAddToCart = () => {
    for (let i = 0; i < currentQuantity; i++) {
      addItem({
        id: product.id,
        name: product.title || product.name,
        price: effectivePrice,
        image: product.image || (product.images && product.images[0]) || "",
        portal: product.portal === 'wholesale' ? 'wholesale' : 'b2c',
      });
    }
    toast.success(`${currentQuantity}টি "${product.title || product.name}" কার্টে যুক্ত হয়েছে!`);
    onClose();
  };

  const handleBuyNow = () => {
    handleAddToCart();
    navigate('/checkout');
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-3 sm:p-4 select-none">
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="fixed inset-0 bg-black/75 backdrop-blur-md"
          />

          {/* Dialog Container */}
          <motion.div
            initial={{ opacity: 0, scale: 0.94, y: 16 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.94, y: 16 }}
            transition={{ type: 'spring', damping: 25, stiffness: 250 }}
            className="relative w-full max-w-2xl bg-[var(--pm-surface)] border border-[var(--pm-border)] rounded-3xl shadow-2xl overflow-hidden z-10 flex flex-col max-h-[90vh]"
          >
            {/* Header Close */}
            <div className="absolute top-4 right-4 z-20">
              <button
                onClick={onClose}
                className="w-9 h-9 rounded-full bg-black/50 hover:bg-black/80 text-white flex items-center justify-center transition-colors border border-white/10"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            {/* Content Scrollable */}
            <div className="overflow-y-auto p-5 sm:p-7 flex flex-col md:flex-row gap-6">
              
              {/* Product Image Column */}
              <div className="md:w-1/2 flex flex-col gap-3">
                <div className="relative aspect-square rounded-2xl overflow-hidden bg-zinc-900 border border-white/5">
                  <img
                    src={product.image || (product.images && product.images[0])}
                    alt={product.name || product.title}
                    className="w-full h-full object-cover"
                    referrerPolicy="no-referrer"
                  />
                  {product.discount && (
                    <span className="absolute top-3 left-3 bg-rose-600 text-white text-[10px] font-black px-2.5 py-0.5 rounded-full shadow">
                      -{product.discount}% ছাড়
                    </span>
                  )}
                  {product.moq && (
                    <span className="absolute bottom-3 left-3 bg-blue-600 text-white text-[10px] font-black px-2.5 py-0.5 rounded-lg shadow">
                      MOQ: {product.moq} পিস
                    </span>
                  )}
                </div>

                {/* Trust Badges */}
                <div className="flex items-center justify-between p-3 rounded-xl bg-white/5 border border-white/5 text-[10px] font-semibold text-zinc-300">
                  <span className="flex items-center gap-1 text-emerald-400">
                    <ShieldCheck className="w-3.5 h-3.5" /> ১০০% খাঁটি পণ্য
                  </span>
                  <span className="flex items-center gap-1 text-cyan-400">
                    <Truck className="w-3.5 h-3.5" /> ফাস্ট ডেলিভারি
                  </span>
                </div>
              </div>

              {/* Details & Action Column */}
              <div className="md:w-1/2 flex flex-col justify-between space-y-4">
                <div className="space-y-2">
                  <div className="flex items-center gap-2">
                    <span className="text-[10px] font-black text-[var(--pm-accent)] uppercase tracking-wider bg-[var(--pm-accent-soft)] px-2 py-0.5 rounded-md">
                      {product.category || "পাইকারমার্ট স্পেশাল"}
                    </span>
                    <span className="text-[10px] text-zinc-400 flex items-center gap-0.5 font-bold">
                      <Star className="w-3 h-3 text-amber-400 fill-amber-400" />
                      {product.rating || "৪.৮"} ({product.reviewCount || 48} রিভিউ)
                    </span>
                  </div>

                  <h3 className="text-lg sm:text-xl font-black text-white leading-snug">
                    {product.title || product.name}
                  </h3>

                  <p className="text-xs text-[var(--pm-text-muted)] flex items-center gap-1.5">
                    <Store className="w-3.5 h-3.5 text-[var(--pm-accent)]" />
                    <span>প্রস্তুতকারক: <strong className="text-zinc-200">{product.seller || "পাইকারমার্ট ভেরিফাইড আড়ত"}</strong></span>
                  </p>

                  {/* Pricing Matrix */}
                  <div className="p-3 rounded-2xl bg-[var(--pm-surface-hover)] border border-[var(--pm-border)] space-y-2">
                    <div className="flex items-baseline justify-between">
                      <span className="text-xs text-[var(--pm-text-muted)] font-semibold">একক মূল্য:</span>
                      <div className="flex items-baseline gap-2">
                        <span className="text-xl font-black text-[var(--pm-accent)]">
                          ৳{effectivePrice.toLocaleString()}
                        </span>
                        {product.originalPrice && (
                          <span className="text-xs text-zinc-500 line-through">
                            ৳{product.originalPrice.toLocaleString()}
                          </span>
                        )}
                      </div>
                    </div>

                    {/* Tiered Bulk Rates for Wholesale */}
                    <div className="grid grid-cols-3 gap-1.5 text-center text-[9px] font-semibold pt-1 border-t border-white/5">
                      <div className={`p-1.5 rounded-lg border ${currentQuantity < 10 ? 'bg-[var(--pm-accent-soft)] border-[var(--pm-accent)]/40 text-[var(--pm-accent)]' : 'bg-black/20 border-white/5 text-zinc-400'}`}>
                        <span>১-৯ পিস</span>
                        <p className="font-bold">৳{unitPrice}</p>
                      </div>
                      <div className={`p-1.5 rounded-lg border ${currentQuantity >= 10 && currentQuantity < 50 ? 'bg-[var(--pm-accent-soft)] border-[var(--pm-accent)]/40 text-[var(--pm-accent)]' : 'bg-black/20 border-white/5 text-zinc-400'}`}>
                        <span>১০-৪৯ পিস</span>
                        <p className="font-bold">৳{Math.round(unitPrice * 0.90)}</p>
                      </div>
                      <div className={`p-1.5 rounded-lg border ${currentQuantity >= 50 ? 'bg-[var(--pm-accent-soft)] border-[var(--pm-accent)]/40 text-[var(--pm-accent)]' : 'bg-black/20 border-white/5 text-zinc-400'}`}>
                        <span>৫০+ বাল্ক</span>
                        <p className="font-bold">৳{Math.round(unitPrice * 0.82)}</p>
                      </div>
                    </div>
                  </div>

                  {/* Quantity Stepper */}
                  <div className="flex items-center justify-between pt-1">
                    <span className="text-xs font-bold text-zinc-300">পরিমাণ (Quantity):</span>
                    <div className="flex items-center bg-[var(--pm-surface-hover)] border border-[var(--pm-border)] rounded-xl p-1">
                      <button
                        onClick={() => setQuantity(Math.max(moq, currentQuantity - 1))}
                        className="w-8 h-8 rounded-lg hover:bg-white/10 flex items-center justify-center text-white transition-colors"
                      >
                        <Minus className="w-3.5 h-3.5" />
                      </button>
                      <span className="w-12 text-center font-black text-sm text-white">
                        {currentQuantity}
                      </span>
                      <button
                        onClick={() => setQuantity(currentQuantity + 1)}
                        className="w-8 h-8 rounded-lg hover:bg-white/10 flex items-center justify-center text-white transition-colors"
                      >
                        <Plus className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  </div>

                  {/* Total Calculation */}
                  <div className="flex items-center justify-between p-3 rounded-xl bg-white/[0.03] border border-white/5">
                    <span className="text-xs font-bold text-zinc-400">সর্বমোট প্রদেয়:</span>
                    <span className="text-lg font-black text-white">৳{totalPrice.toLocaleString()}</span>
                  </div>
                </div>

                {/* Direct Action Buttons */}
                <div className="space-y-2 pt-2">
                  <button
                    onClick={handleBuyNow}
                    className="w-full py-3 rounded-2xl bg-[var(--pm-accent)] hover:bg-[var(--pm-accent-hover)] text-white text-xs font-black shadow-lg shadow-[var(--pm-accent)]/20 active:scale-95 transition-all flex items-center justify-center gap-2"
                  >
                    <span>সরাসরি কিনুন (Buy Now)</span>
                    <ArrowRight className="w-4 h-4" />
                  </button>

                  <button
                    onClick={handleAddToCart}
                    className="w-full py-2.5 rounded-2xl bg-white/5 hover:bg-white/10 text-white text-xs font-bold border border-white/10 active:scale-95 transition-all flex items-center justify-center gap-2"
                  >
                    <ShoppingBag className="w-4 h-4 text-[var(--pm-accent)]" />
                    <span>কার্টে যোগ করুন</span>
                  </button>
                </div>

              </div>

            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
};
