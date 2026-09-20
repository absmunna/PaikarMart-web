import React from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  ShoppingBag, Trash2, ArrowLeft, Plus, Minus, 
  ShieldCheck, ArrowRight, Info, AlertTriangle 
} from 'lucide-react';
import { useNavigate, Link } from 'react-router-dom';
import { useCartStore, CartItem } from '@/modules/cart/useCartStore';
import { formatBDT } from '@/lib/format';
import { Button } from '@/components/ui/button';

export const CartPage: React.FC = () => {
  const navigate = useNavigate();
  const { items, addItem, removeItem, updateQuantity, getTotalPrice, getDominantDomain } = useCartStore();

  const subtotal = getTotalPrice();
  // Standard freight inside BD
  const deliveryFee = subtotal > 15000 ? 0 : 80;
  const vatAmount = Math.round(subtotal * 0.05);
  const totalAmount = subtotal + deliveryFee + vatAmount;

  const handleIncrement = (item: CartItem) => {
    updateQuantity(item.id, item.quantity + 1);
  };

  const handleDecrement = (item: CartItem) => {
    if (item.quantity > 1) {
      updateQuantity(item.id, item.quantity - 1);
    } else {
      removeItem(item.id);
    }
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

        <Link to="/marketplace">
          <Button className="h-12 px-8 rounded-xl bg-cyan-400 hover:bg-cyan-500 text-black text-xs font-bold uppercase tracking-wider cursor-pointer shadow-lg shadow-cyan-400/20 active:scale-95 transition-all">
            Return to Marketplace (মার্কেটপ্লেসে ফিরে যান)
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
              onClick={() => navigate('/marketplace')}
              className="p-2.5 bg-[#0b101d] hover:bg-white/5 rounded-xl text-gray-400 hover:text-white transition-all border border-white/5 cursor-pointer"
            >
              <ArrowLeft className="w-4 h-4" />
            </button>
            <div>
              <h1 className="text-[10px] uppercase tracking-[0.2em] text-cyan-400 font-bold">Checkout pipeline</h1>
              <span className="text-base sm:text-xl font-black tracking-tight uppercase">Sourcing Cart (সোর্সিং কার্ট)</span>
            </div>
          </div>
          
          <div className="flex items-center gap-1.5 px-3 py-1.5 bg-cyan-500/10 border border-cyan-500/20 rounded-lg text-xs font-bold text-cyan-400 uppercase tracking-wider">
            <ShieldCheck className="w-4 h-4" /> SECURED DATA PORTAL
          </div>
        </div>

        {/* Grid Layout */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          
          {/* LEFT: Sourced Items list (8 Columns) */}
          <div className="lg:col-span-8 space-y-4">
            <AnimatePresence mode="popLayout">
              {items.map((item) => {
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
                        {item.portal && (
                          <span className="absolute bottom-1 right-1 px-1.5 py-0.5 rounded text-[8px] font-bold bg-cyan-950 text-cyan-400 border border-cyan-500/20 uppercase">
                            {item.portal}
                          </span>
                        )}
                      </div>
                      
                      <div className="min-w-0 flex-1 space-y-1">
                        <span className="text-[9px] uppercase font-bold tracking-wider text-cyan-400 bg-cyan-950/45 px-2 py-0.5 rounded border border-cyan-500/10 inline-block">
                          {item.sellerTier || 'Wholesale Lot'}
                        </span>
                        <h3 className="text-sm font-black text-white leading-tight truncate">
                          {item.name}
                        </h3>
                        {item.vendorName && (
                          <p className="text-[10px] text-zinc-500 truncate font-semibold">
                            Sourced from: <span className="text-zinc-400">{item.vendorName}</span>
                          </p>
                        )}
                        {!satisfiesMoq && (
                          <div className="flex items-center gap-1 text-[10px] text-amber-500 font-bold bg-amber-500/5 border border-amber-500/25 px-2.5 py-0.5 rounded-lg w-max">
                            <AlertTriangle className="w-3.5 h-3.5 shrink-0" /> MOQ Limit: Min {item.moq} units
                          </div>
                        )}
                      </div>
                    </div>

                    {/* Quantity Selector & Price */}
                    <div className="flex items-center justify-between md:justify-end gap-6 w-full md:w-auto shrink-0 border-t border-white/5 pt-4 md:border-none md:pt-0">
                      {/* Counter */}
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

                      {/* Line Prices */}
                      <div className="text-right shrink-0">
                        <span className="block text-xs text-zinc-500 font-bold font-mono">
                          {formatBDT(item.price)} each
                        </span>
                        <span className="block text-sm font-mono font-black text-white mt-0.5">
                          {formatBDT(item.price * item.quantity)}
                        </span>
                      </div>

                      {/* Delete Trigger */}
                      <button 
                        onClick={() => removeItem(item.id)}
                        className="p-2.5 bg-red-950/10 hover:bg-red-900/20 border border-red-500/10 hover:border-red-500/30 text-red-400 hover:text-red-300 rounded-xl transition-all cursor-pointer"
                        title="Remove lot"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>

                  </motion.div>
                );
              })}
            </AnimatePresence>
          </div>

          {/* RIGHT: Bill Summary (4 Columns) */}
          <div className="lg:col-span-4 lg:sticky lg:top-[120px] bg-[var(--pm-surface)]/30 border border-[var(--pm-border)] p-6 rounded-2xl flex flex-col gap-6 select-none">
            
            <div className="border-b border-[var(--pm-border)] pb-3">
              <h3 className="text-xs uppercase tracking-wider text-[var(--pm-text-secondary)] font-bold">
                Sourcing tally summary
              </h3>
            </div>

            <div className="flex flex-col gap-3.5 text-xs font-semibold text-[var(--pm-text-secondary)]">
              <div className="flex justify-between items-center">
                <span>Items subtotal (সাবটোটাল)</span>
                <span className="font-mono text-white text-sm font-extrabold">{formatBDT(subtotal)}</span>
              </div>
              <div className="flex justify-between items-center">
                <span>Govt VAT (৫% ভ্যাট)</span>
                <span className="font-mono text-white text-sm font-extrabold">+ {formatBDT(vatAmount)}</span>
              </div>
              <div className="flex justify-between items-center">
                <span>Freight fee (পরিবহন খরচ)</span>
                <span className="font-mono text-white text-sm font-extrabold">
                  {deliveryFee === 0 ? "FREE Sourcing" : formatBDT(deliveryFee)}
                </span>
              </div>
              <div className="border-t border-[var(--pm-border)] pt-4 mt-1 flex justify-between items-center text-sm font-black text-white uppercase">
                <span>Grand Total (সর্বমোট)</span>
                <span className="font-mono text-cyan-400 text-base">{formatBDT(totalAmount)}</span>
              </div>
            </div>

            <div className="p-4 bg-cyan-950/10 rounded-xl border border-cyan-500/15 flex gap-2.5 text-[10px] text-zinc-400 leading-relaxed">
              <Info className="w-4 h-4 text-cyan-400 shrink-0 mt-0.5" />
              <div>
                <p className="font-extrabold text-cyan-400 uppercase tracking-widest mb-1">Central Escrow Protection</p>
                All wholesale transactions conform strictly to Central Bank settlement guidelines. Consignments remain fully locked until delivery verification is complete.
              </div>
            </div>

            <Button
              onClick={() => navigate('/checkout', { state: { checkoutType: getDominantDomain() } })}
              className="w-full h-12 rounded-xl bg-cyan-400 hover:bg-cyan-500 text-black text-xs font-black uppercase tracking-wider flex items-center justify-center gap-1.5 cursor-pointer shadow-lg shadow-cyan-400/15 group active:scale-95 transition-all"
            >
              Proceed to checkout (চেকআউট করুন)
              <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
            </Button>

            <Link to="/marketplace" className="text-center">
              <span className="text-[11px] underline text-cyan-400 hover:text-cyan-300 font-bold cursor-pointer transition-all">
                Continue Sourcing (আরও পণ্য যোগ করুন)
              </span>
            </Link>

          </div>

        </div>

      </div>
    </div>
  );
};
