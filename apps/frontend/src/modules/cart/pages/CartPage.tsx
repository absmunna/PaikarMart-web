import React from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  ShoppingBag, Trash2, ArrowLeft, Plus, Minus, 
  ShieldCheck, ArrowRight, Info, AlertTriangle, Store 
} from 'lucide-react';
import { useNavigate, Link } from 'react-router-dom';
import { useCartStore, CartItem } from '@/modules/cart';
import { formatBDT } from '@/lib/format';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';
import { toast } from 'sonner';

export const CartPage: React.FC = () => {
  const navigate = useNavigate();
  const { items, removeItem, updateQuantity, getTotalPrice, getSellerGroups } = useCartStore();

  const sellerGroups = getSellerGroups();
  const subtotal = getTotalPrice();
  const vatAmount = Math.round(subtotal * 0.05);
  // Estimate shipping: 80 per unique seller
  const sellerCount = Object.keys(sellerGroups).length;
  const deliveryFee = sellerCount * 80;
  const totalAmount = subtotal + deliveryFee + vatAmount;

  const handleIncrement = (item: CartItem) => {
    updateQuantity(item.id, item.quantity + 1);
  };

  const handleDecrement = (item: CartItem) => {
    if (item.quantity > (item.moq || 1)) {
      updateQuantity(item.id, item.quantity - 1);
    } else {
      removeItem(item.id);
    }
  };

  const calculateItemPrice = (item: CartItem) => {
    let currentPrice = item.price;
    if (item.tieredPricing && item.tieredPricing.length > 0) {
      const tiers = [...item.tieredPricing].sort((a, b) => b.minQty - a.minQty);
      const applicableTier = tiers.find(t => item.quantity >= t.minQty);
      if (applicableTier) {
        currentPrice = applicableTier.price;
      }
    }
    return currentPrice;
  };

  if (items.length === 0) {
    return (
      <div className="min-h-[80vh] flex flex-col items-center justify-center gap-6 text-white text-center p-6 bg-[#03060d]">
        <motion.div 
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          className="w-24 h-24 bg-cyan-950/20 border border-cyan-500/20 rounded-full flex items-center justify-center text-cyan-400 select-none shadow-lg shadow-cyan-500/5 shadow-inner"
        >
          <ShoppingBag className="w-12 h-12" />
        </motion.div>
        
        <div className="space-y-2">
          <h2 className="text-xl font-black uppercase tracking-tight text-white sm:text-2xl">
            আপনার কার্টটি খালি (Your Cart is Empty)
          </h2>
          <p className="text-zinc-400 text-xs sm:text-sm max-w-sm mx-auto leading-relaxed">
            Please browse our wholesale portals, local directories, or digital shops to fill your cart.
          </p>
        </div>

        <Link to="/">
          <Button className="h-12 px-8 rounded-xl bg-cyan-400 hover:bg-cyan-500 text-black text-xs font-bold uppercase tracking-wider cursor-pointer shadow-lg shadow-cyan-400/20 active:scale-95 transition-all">
            Return to Shopping (শপিং এ ফিরে যান)
          </Button>
        </Link>
      </div>
    );
  }

  return (
    <div className="min-h-screen text-white bg-[#03060d] font-sans pb-24">
      <div className="w-full max-w-[1280px] mx-auto px-4 md:px-6 py-6">
        
        {/* Navigation Breadcrumb headers */}
        <div className="flex items-center justify-between mb-8 pb-4 border-b border-white/5 select-none md:flex-row flex-col items-start gap-4">
          <div className="flex items-center gap-3">
            <button 
              onClick={() => navigate(-1)}
              className="p-2.5 bg-[#0b101d] hover:bg-white/5 rounded-xl text-gray-400 hover:text-white transition-all border border-white/5 cursor-pointer"
            >
              <ArrowLeft className="w-4 h-4" />
            </button>
            <div>
              <h1 className="text-[10px] uppercase tracking-[0.2em] text-cyan-400 font-bold">Checkout pipeline</h1>
              <span className="text-base sm:text-xl font-black tracking-tight uppercase">Multi-Vendor Cart (সোর্সিং কার্ট)</span>
            </div>
          </div>
          
          <div className="flex items-center gap-1.5 px-3 py-1.5 bg-cyan-500/10 border border-cyan-500/20 rounded-lg text-xs font-bold text-cyan-400 uppercase tracking-wider">
            <ShieldCheck className="w-4 h-4" /> SECURED ESCROW PORTAL
          </div>
        </div>

        {/* Grid Layout */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          
          {/* LEFT: Sourced Items grouped by Seller (8 Columns) */}
          <div className="lg:col-span-8 space-y-8">
            {Object.entries(sellerGroups).map(([sellerName, sellerItems]) => (
              <div key={sellerName} className="space-y-4">
                <div className="flex items-center justify-between px-2">
                  <div className="flex items-center gap-2">
                    <div className="w-8 h-8 rounded-lg bg-cyan-500/10 flex items-center justify-center border border-cyan-500/20">
                      <Store className="w-4 h-4 text-cyan-400" />
                    </div>
                    <h2 className="font-black text-sm uppercase tracking-wider text-zinc-300">
                      Store: <span className="text-white">{sellerName}</span>
                    </h2>
                  </div>
                  <span className="text-[10px] font-bold text-zinc-500 uppercase tracking-widest bg-white/5 px-2 py-1 rounded-md">
                    {sellerItems.length} Items
                  </span>
                </div>

                <div className="space-y-3">
                  <AnimatePresence mode="popLayout">
                    {sellerItems.map((item) => {
                      const itemPrice = calculateItemPrice(item);
                      const satisfiesMoq = !item.moq || item.quantity >= item.moq;
                      
                      return (
                        <motion.div 
                          key={item.id}
                          layout
                          initial={{ opacity: 0, y: 15 }}
                          animate={{ opacity: 1, y: 0 }}
                          exit={{ opacity: 0, x: -100 }}
                          className="p-5 rounded-2xl bg-[var(--pm-surface)]/40 border border-[var(--pm-border)] hover:border-cyan-500/20 transition-all duration-300 flex md:flex-row flex-col justify-between items-start md:items-center gap-4 group"
                        >
                          {/* Item Details */}
                          <div className="flex gap-4 items-center min-w-0 flex-1">
                            <div className="w-[72px] h-[72px] rounded-xl border border-[var(--pm-border)] bg-black/40 overflow-hidden shrink-0 flex items-center justify-center relative">
                              <img src={item.image} alt={item.name} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300" />
                              <span className="absolute bottom-1 right-1 px-1.5 py-0.5 rounded text-[8px] font-bold bg-cyan-950 text-cyan-400 border border-cyan-500/20 uppercase">
                                {item.domain}
                              </span>
                            </div>
                            
                            <div className="min-w-0 flex-1 space-y-1">
                              <span className="text-[9px] uppercase font-bold tracking-wider text-cyan-400 bg-cyan-950/45 px-2 py-0.5 rounded border border-cyan-500/10 inline-block">
                                {item.sellerTier || 'Product'}
                              </span>
                              <h3 className="text-sm font-black text-white leading-tight truncate">
                                {item.name}
                              </h3>
                              {item.variantInfo && (
                                <p className="text-[10px] text-zinc-500 font-bold uppercase tracking-tighter">
                                  Variant: <span className="text-zinc-400">{item.variantInfo}</span>
                                </p>
                              )}
                              
                              <div className="flex flex-wrap gap-2 mt-1">
                                {item.moq && (
                                  <div className={cn(
                                    "flex items-center gap-1 text-[9px] font-black px-2 py-0.5 rounded-lg border",
                                    satisfiesMoq ? "bg-emerald-500/5 border-emerald-500/20 text-emerald-400" : "bg-amber-500/5 border-amber-500/20 text-amber-400"
                                  )}>
                                    {satisfiesMoq ? <ShieldCheck className="w-3 h-3" /> : <AlertTriangle className="w-3 h-3" />}
                                    MOQ: {item.moq}
                                  </div>
                                )}
                                {item.tieredPricing && item.tieredPricing.length > 0 && (
                                  <div className="flex items-center gap-1 text-[9px] font-black px-2 py-0.5 rounded-lg border bg-blue-500/5 border-blue-500/20 text-blue-400">
                                    <Info className="w-3 h-3" /> Tiered Pricing Active
                                  </div>
                                )}
                              </div>
                            </div>
                          </div>

                          {/* Quantity Selector & Price */}
                          <div className="flex items-center justify-between md:justify-end gap-6 w-full md:w-auto shrink-0 border-t border-white/5 pt-4 md:border-none md:pt-0">
                            {/* Counter */}
                            <div className="flex flex-col items-center gap-1.5">
                              <div className="flex items-center bg-black/40 border border-[var(--pm-border)] rounded-xl overflow-hidden p-1 shrink-0">
                                <button 
                                  onClick={() => handleDecrement(item)}
                                  className="w-8 h-8 flex items-center justify-center rounded-lg text-gray-400 hover:text-white hover:bg-white/5 active:scale-90 transition-all cursor-pointer"
                                >
                                  <Minus className="w-3.5 h-3.5" />
                                </button>
                                <span className="w-10 text-center text-xs font-mono font-black text-white">
                                  {item.quantity}
                                </span>
                                <button 
                                  onClick={() => handleIncrement(item)}
                                  className="w-8 h-8 flex items-center justify-center rounded-lg text-gray-400 hover:text-white hover:bg-white/5 active:scale-90 transition-all cursor-pointer"
                                >
                                  <Plus className="w-3.5 h-3.5" />
                                </button>
                              </div>
                              {item.stock && item.stock < 20 && (
                                <span className="text-[8px] font-black text-rose-500 uppercase tracking-widest animate-pulse">Only {item.stock} left</span>
                              )}
                            </div>

                            {/* Line Prices */}
                            <div className="text-right shrink-0 min-w-[100px]">
                              <span className="block text-xs text-zinc-500 font-bold font-mono">
                                {formatBDT(itemPrice)} / unit
                              </span>
                              <span className="block text-sm font-mono font-black text-white mt-0.5">
                                {formatBDT(itemPrice * item.quantity)}
                              </span>
                              {item.originalPrice && item.originalPrice > itemPrice && (
                                <span className="block text-[10px] text-emerald-500 font-black uppercase tracking-tighter">
                                  Saved {formatBDT((item.originalPrice - itemPrice) * item.quantity)}
                                </span>
                              )}
                            </div>

                            {/* Delete Trigger */}
                            <button 
                              onClick={() => removeItem(item.id)}
                              className="p-2.5 bg-red-950/10 hover:bg-red-900/20 border border-red-500/10 hover:border-red-500/30 text-red-400 hover:text-red-300 rounded-xl transition-all cursor-pointer"
                              title="Remove item"
                            >
                              <Trash2 className="w-4 h-4" />
                            </button>
                          </div>

                        </motion.div>
                      );
                    })}
                  </AnimatePresence>
                </div>
              </div>
            ))}
          </div>

          {/* RIGHT: Bill Summary (4 Columns) */}
          <div className="lg:col-span-4 lg:sticky lg:top-[120px] bg-[var(--pm-surface)]/30 border border-[var(--pm-border)] p-6 rounded-2xl flex flex-col gap-6 select-none">
            
            <div className="border-b border-[var(--pm-border)] pb-3">
              <h3 className="text-xs uppercase tracking-wider text-[var(--pm-text-secondary)] font-bold">
                Order tally summary
              </h3>
            </div>

            <div className="flex flex-col gap-3.5 text-xs font-semibold text-[var(--pm-text-secondary)]">
              <div className="flex justify-between items-center">
                <span>Items subtotal ({items.length} types)</span>
                <span className="font-mono text-white text-sm font-extrabold">{formatBDT(subtotal)}</span>
              </div>
              <div className="flex justify-between items-center">
                <span>Govt VAT (৫% ভ্যাট)</span>
                <span className="font-mono text-white text-sm font-extrabold">+ {formatBDT(vatAmount)}</span>
              </div>
              <div className="flex justify-between items-center">
                <div className="flex flex-col">
                  <span>Shipping fee ({sellerCount} vendors)</span>
                  <span className="text-[9px] text-zinc-500 font-bold uppercase tracking-tighter">Flat ৳80 per vendor sourcing</span>
                </div>
                <span className="font-mono text-white text-sm font-extrabold">
                  {formatBDT(deliveryFee)}
                </span>
              </div>
              <div className="border-t border-[var(--pm-border)] pt-4 mt-1 flex justify-between items-center text-sm font-black text-white uppercase">
                <span>Grand Total (সর্বমোট)</span>
                <span className="font-mono text-cyan-400 text-base">{formatBDT(totalAmount)}</span>
              </div>
            </div>

            <div className="p-4 bg-emerald-500/5 rounded-xl border border-emerald-500/15 flex gap-2.5 text-[10px] text-zinc-400 leading-relaxed">
              <ShieldCheck className="w-4 h-4 text-emerald-500 shrink-0 mt-0.5" />
              <div>
                <p className="font-extrabold text-emerald-500 uppercase tracking-widest mb-1">PaikarMart Escrow Protection</p>
                Your payment is securely held in our escrow system. Funds are only released to vendors after you confirm receipt of quality-verified goods.
              </div>
            </div>

            <Button
              onClick={() => {
                const invalidItems = items.filter(i => i.moq && i.quantity < i.moq);
                if (invalidItems.length > 0) {
                  return toast.error(`Please satisfy MOQ for: ${invalidItems.map(i => i.name).join(', ')}`);
                }
                navigate('/checkout');
              }}
              className="w-full h-12 rounded-xl bg-emerald-500 hover:bg-emerald-400 text-black text-xs font-black uppercase tracking-wider flex items-center justify-center gap-1.5 cursor-pointer shadow-lg shadow-emerald-500/15 group active:scale-95 transition-all"
            >
              Secure checkout (চেকআউট করুন)
              <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
            </Button>

            <Link to="/" className="text-center">
              <span className="text-[11px] underline text-cyan-400 hover:text-cyan-300 font-bold cursor-pointer transition-all">
                Continue Shopping (আরও পণ্য যোগ করুন)
              </span>
            </Link>

          </div>

        </div>

      </div>
    </div>
  );
};

export default CartPage;
