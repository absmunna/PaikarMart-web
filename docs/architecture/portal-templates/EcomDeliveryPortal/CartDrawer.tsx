import React from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { ShoppingBag, X, Trash2, Plus, Minus, CreditCard, Sparkles } from 'lucide-react';
import { EcomProduct } from './types';
import { cn } from '@/lib/utils';
import { formatBDT } from '@/lib/format';

interface CartDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  items: Array<{
    id: string;
    name: string;
    price: number;
    image: string;
    quantity: number;
    domain?: string;
    metadata?: any;
  }>;
  onUpdateQuantity: (id: string, qty: number) => void;
  onRemoveItem: (id: string) => void;
  onClearCart: () => void;
  onCheckout: () => void;
  domainTitleEn: string;
  domainTitleBn: string;
}

export const CartDrawer: React.FC<CartDrawerProps> = ({
  isOpen,
  onClose,
  items,
  onUpdateQuantity,
  onRemoveItem,
  onClearCart,
  onCheckout,
  domainTitleEn,
  domainTitleBn
}) => {
  const subtotal = items.reduce((sum, item) => sum + item.price * item.quantity, 0);
  const vat = subtotal * 0.05; // 5% auto on checkout (Bangladesh specific standard)
  const deliveryCharge = items.length > 0 ? 60 : 0;
  const grandTotal = subtotal + vat + deliveryCharge;

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="fixed inset-0 bg-black/60 backdrop-blur-md z-50 cursor-pointer"
          />

          {/* Drawer Body */}
          <motion.div
            initial={{ x: "100%" }}
            animate={{ x: 0 }}
            exit={{ x: "100%" }}
            transition={{ type: "spring", damping: 30, stiffness: 300 }}
            className="fixed inset-y-0 right-0 w-full max-w-md bg-neutral-950 border-l border-white/5 z-55 flex flex-col justify-between"
          >
            {/* Header */}
            <div className="p-6 border-b border-white/5 flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-2xl bg-white/5 border border-white/5 flex items-center justify-center text-[var(--pm-accent)]">
                  <ShoppingBag className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="font-extrabold text-sm text-white flex items-center gap-1.5">
                    {domainTitleBn} কার্ট <span className="text-zinc-500 font-normal">| {domainTitleEn} Cart</span>
                  </h3>
                  <p className="text-[10px] text-zinc-500 font-bold uppercase tracking-wider">{items.length} Items Selected</p>
                </div>
              </div>
              <button
                onClick={onClose}
                className="w-10 h-10 rounded-2xl bg-white/5 border border-white/5 flex items-center justify-center text-zinc-400 hover:text-white hover:bg-white/10 transition-all cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Content list */}
            <div className="flex-1 overflow-y-auto p-6 space-y-4 scrollbar-hide">
              {items.length === 0 ? (
                <div className="h-full flex flex-col items-center justify-center text-center">
                  <div className="w-16 h-16 rounded-full bg-white/[0.02] border border-white/5 flex items-center justify-center mb-4 text-zinc-500">
                    <ShoppingBag className="w-6 h-6" />
                  </div>
                  <h4 className="font-extrabold text-sm text-white">কার্টটি খালি (Cart is empty)</h4>
                  <p className="text-[10px] text-zinc-500 font-bold uppercase tracking-wider mt-1">Add items to proceed</p>
                </div>
              ) : (
                items.map((item) => (
                  <div key={item.id} className="flex gap-4 p-3 rounded-2xl bg-white/[0.01] border border-white/5">
                    <img
                      src={item.image}
                      alt={item.name}
                      className="w-16 h-16 rounded-xl object-cover border border-white/5 bg-neutral-900 shrink-0"
                      referrerPolicy="no-referrer"
                    />
                    <div className="flex-1 min-w-0 flex flex-col justify-between">
                      <div>
                        <h5 className="font-bold text-xs text-zinc-200 line-clamp-1">{item.name}</h5>
                        {item.metadata?.nameLocal && (
                          <p className="text-[10px] text-zinc-500 font-semibold line-clamp-1 mt-0.5">{item.metadata.nameLocal}</p>
                        )}
                        <span className="text-xs font-black text-[var(--pm-accent)] mt-1 block">{formatBDT(item.price)}</span>
                      </div>

                      {/* Quantity Toggles */}
                      <div className="flex items-center justify-between mt-2">
                        <div className="flex items-center bg-white/5 border border-white/5 rounded-xl h-8 overflow-hidden">
                          <button
                            onClick={() => {
                              if (item.quantity > 1) {
                                onUpdateQuantity(item.id, item.quantity - 1);
                              } else {
                                onRemoveItem(item.id);
                              }
                            }}
                            className="w-8 h-full flex items-center justify-center text-zinc-400 hover:text-white hover:bg-white/10 active:scale-90 transition-all cursor-pointer"
                          >
                            <Minus className="w-3 h-3" />
                          </button>
                          <span className="w-7 text-center text-xs font-black text-white">{item.quantity}</span>
                          <button
                            onClick={() => onUpdateQuantity(item.id, item.quantity + 1)}
                            className="w-8 h-full flex items-center justify-center text-zinc-400 hover:text-white hover:bg-white/10 active:scale-90 transition-all cursor-pointer"
                          >
                            <Plus className="w-3 h-3" />
                          </button>
                        </div>

                        <button
                          onClick={() => onRemoveItem(item.id)}
                          className="text-xs font-bold text-rose-500 hover:text-rose-400 transition-colors flex items-center gap-1 cursor-pointer"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                          <span>মুছুন (Remove)</span>
                        </button>
                      </div>
                    </div>
                  </div>
                ))
              )}
            </div>

            {/* Footer Summary & Process */}
            {items.length > 0 && (
              <div className="p-6 border-t border-white/5 bg-neutral-950/90 backdrop-blur-lg space-y-4">
                <div className="space-y-2">
                  <div className="flex justify-between text-xs text-zinc-400 font-bold uppercase tracking-wider">
                    <span>উপমোট (Subtotal)</span>
                    <span className="text-white">{formatBDT(subtotal)}</span>
                  </div>
                  <div className="flex justify-between text-xs text-zinc-400 font-bold uppercase tracking-wider">
                    <span>ভ্যাট ৫% (VAT 5%)</span>
                    <span className="text-white">{formatBDT(vat)}</span>
                  </div>
                  <div className="flex justify-between text-xs text-zinc-400 font-bold uppercase tracking-wider">
                    <span>ডেলিভারি চার্জ</span>
                    <span className="text-cyan-400">{formatBDT(deliveryCharge)}</span>
                  </div>
                  <div className="border-t border-white/5 pt-2 flex justify-between items-center">
                    <span className="text-sm font-black text-white uppercase tracking-wider">সর্বমোট (Grand Total)</span>
                    <span className="text-base font-black text-[var(--pm-accent)]">{formatBDT(grandTotal)}</span>
                  </div>
                </div>

                <div className="pb-2 pt-1 flex gap-2">
                  <button
                    onClick={onClearCart}
                    className="flex-1 h-12 rounded-2xl bg-rose-500/10 border border-rose-500/20 hover:bg-rose-500/20 text-rose-400 font-bold text-xs uppercase tracking-wider active:scale-95 transition-all flex items-center justify-center gap-1.5 cursor-pointer"
                  >
                    <Trash2 className="w-4 h-4" />
                    <span>সব মুছুন</span>
                  </button>
                  <button
                    onClick={onCheckout}
                    className="flex-[2] h-12 rounded-2xl bg-gradient-to-tr from-orange-500 to-amber-500 text-black font-black text-xs uppercase tracking-widest active:scale-95 hover:scale-[1.01] transition-all flex items-center justify-center gap-2 cursor-pointer shadow-lg shadow-orange-500/10"
                  >
                    <CreditCard className="w-4 h-4" />
                    <span>অর্ডার করুন</span>
                  </button>
                </div>
              </div>
            )}
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
};
