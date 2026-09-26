import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ArrowRight, ShoppingBag, Trash2, Plus, Minus, Coins } from 'lucide-react';
import { useCartStore } from '../../modules/cart/cartStore';

export const CartDrawer = ({ isOpen, onClose }: { isOpen: boolean; onClose: () => void }) => {
  const { items, removeItem, updateQuantity, getTotalPrice, getTotalCoins } = useCartStore();

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          {/* Backdrop overlay */}
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 0.5 }}
            exit={{ opacity: 0 }}
            className="absolute top-[60px] md:top-[64px] bottom-[64px] lg:bottom-0 left-0 right-0 bg-black/60 z-40 backdrop-blur-sm"
            onClick={onClose}
          />

          {/* Drawer container */}
          <motion.div 
            initial={{ x: '100%' }}
            animate={{ x: 0 }}
            exit={{ x: '100%' }}
            transition={{ ease: "easeOut", duration: 0.4 }}
            className="absolute top-[60px] md:top-[64px] bottom-[64px] lg:bottom-0 right-0 w-[85%] max-w-[320px] glass border-l border-[var(--pm-border)] shadow-2xl z-40 flex flex-col"
          >
            {/* Header */}
            <div className="p-5 border-b border-[var(--pm-border)]/50 flex items-center justify-between">
              <div className="flex items-center gap-2">
                <ShoppingBag className="w-5 h-5 text-[var(--pm-accent)]" />
                <h3 className="font-black text-sm text-[var(--pm-text)] uppercase tracking-wider">My Super Cart</h3>
              </div>
              <button onClick={onClose} className="p-2 rounded-full hover:bg-white/5 text-[var(--pm-text-muted)] hover:text-[var(--pm-text)] transition-colors">
                <ArrowRight className="w-4 h-4" />
              </button>
            </div>

            {/* List */}
            <div className="flex-1 overflow-y-auto p-4 space-y-4 hide-scrollbar">
              {items.length === 0 ? (
                <div className="h-full flex flex-col items-center justify-center gap-4 text-center opacity-70">
                  <div className="w-16 h-16 rounded-full bg-white/5 flex items-center justify-center text-2xl">🛒</div>
                  <p className="text-xs text-[var(--pm-text-muted)]">Your cart is empty.<br />Start shopping from PK Shop!</p>
                </div>
              ) : (
                items.map((item) => (
                  <div key={item.id} className="p-3 rounded-2xl bg-white/5 border border-[var(--pm-border)]/30 flex gap-3 relative group">
                    <div className="w-16 h-16 rounded-xl overflow-hidden shrink-0 border border-[var(--pm-border)]/30">
                      <img src={item.image} alt={item.name} className="w-full h-full object-cover" />
                    </div>
                    <div className="flex-grow flex flex-col justify-between min-w-0 pr-6">
                      <div>
                        <h4 className="text-xs font-bold text-[var(--pm-text)] truncate">{item.name}</h4>
                        <span className="text-[8px] font-black uppercase text-[var(--pm-accent)] bg-[var(--pm-accent-soft)] px-1.5 py-0.5 rounded-full mt-1 inline-block">
                          {item.portal}
                        </span>
                      </div>
                      <div className="flex items-center justify-between mt-2">
                        <span className="text-xs font-black text-[var(--pm-text)]">৳ {item.price * item.quantity}</span>
                        
                        {/* Quantity Controls */}
                        <div className="flex items-center bg-white/5 border border-[var(--pm-border)]/30 rounded-lg p-0.5">
                          <button onClick={() => updateQuantity(item.id, item.quantity - 1)} className="p-1 text-[var(--pm-text-muted)] hover:text-[var(--pm-text)]">
                            <Minus className="w-3 h-3" />
                          </button>
                          <span className="text-xs font-bold px-2 text-[var(--pm-text)]">{item.quantity}</span>
                          <button onClick={() => updateQuantity(item.id, item.quantity + 1)} className="p-1 text-[var(--pm-text-muted)] hover:text-[var(--pm-text)]">
                            <Plus className="w-3 h-3" />
                          </button>
                        </div>
                      </div>
                    </div>

                    <button 
                      onClick={() => removeItem(item.id)}
                      className="absolute top-3 right-3 text-[var(--pm-text-muted)] hover:text-red-500 transition-colors opacity-0 group-hover:opacity-100"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                ))
              )}
            </div>

            {/* Footer */}
            {items.length > 0 && (
              <div className="p-5 border-t border-[var(--pm-border)]/50 space-y-4 bg-white/[0.02]">
                <div className="flex items-center justify-between">
                  <span className="text-xs text-[var(--pm-text-muted)] font-bold">Estimated Cashback</span>
                  <div className="flex items-center gap-1 text-amber-400">
                    <Coins className="w-4 h-4" />
                    <span className="text-xs font-black">{getTotalCoins()} PK Coins</span>
                  </div>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm font-bold text-[var(--pm-text)]">Subtotal</span>
                  <span className="text-base font-black text-[var(--pm-accent)]">৳ {getTotalPrice().toLocaleString()}</span>
                </div>
                <button 
                  onClick={() => {
                    onClose();
                    window.location.href = '/checkout';
                  }}
                  className="w-full bg-[var(--pm-accent)] text-white py-3 rounded-xl text-xs font-black shadow-lg shadow-[var(--pm-accent)]/20 active:scale-95 transition-all"
                >
                  Proceed to Checkout
                </button>
              </div>
            )}
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
};
