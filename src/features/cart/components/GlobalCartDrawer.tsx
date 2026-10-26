import React, { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { ShoppingBag, Trash2, Plus, Minus, Coins, X, ArrowRight, ShieldCheck, HelpCircle } from 'lucide-react';
import { CloseButton } from '@/components/ui/CloseButton';
import { useCommerceCartStore } from '@/modules/commerce/cart/useCartStore';
import { useNotificationStore } from '@/modules/notification/notificationStore';
import { useNavigate } from 'react-router-dom';

interface GlobalCartDrawerProps {
  isOpen: boolean;
  onClose: () => void;
}

export const GlobalCartDrawer: React.FC<GlobalCartDrawerProps> = ({ isOpen, onClose }) => {
  const navigate = useNavigate();
  const { items, removeItem, updateQuantity, getTotalPrice, getTotalItems } = useCommerceCartStore();
  const addNotification = useNotificationStore((state: any) => state.addNotification);
  const [isMobile, setIsMobile] = useState(false);

  // Responsive state detection (new add)
  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth < 768);
    };
    checkMobile();
    window.addEventListener('resize', checkMobile);
    return () => window.removeEventListener('resize', checkMobile);
  }, []);

  // Accessibility: Close drawer on pressing Escape key (new add)
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && isOpen) {
        onClose();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, onClose]);

  const itemsCount = getTotalItems();
  const subtotal = getTotalPrice();
  const getTotalCoins = () => items.reduce((acc, item) => acc + ((item.metadata?.coinCashback || 0) * item.quantity), 0);
  // Realistic localized delivery charge
  const deliveryCharge = itemsCount > 0 ? 80 : 0;
  const grandTotal = subtotal + deliveryCharge;

  const handleRemove = (id: string, name: string) => {
    removeItem(id);
    addNotification(`"${name}" কার্ট থেকে সরানো হয়েছে`, 'info');
  };

  const handleCheckout = () => {
    onClose();
    navigate('/checkout');
    addNotification('চেতনাময় চেকআউট পোর্টালের দিকে এগিয়ে যাচ্ছে...', 'success');
  };

  // Modern portal translation label helper
  const getPortalBadgeText = (domain: string) => {
    switch (domain) {
      case 'food':
        return 'ফুড (Food)';
      case 'pharmacy':
        return 'ফার্মাসি (Pharmacy)';
      case 'b2b':
        return 'বিটুবি মার্কেট';
      case 'retail':
      case 'b2c':
      default:
        return 'রিটেইল সপ';
    }
  };

  // Responsive variants for Framer Motion matching desktop vs mobile behaviors
  const drawerVariants = {
    hidden: {
      x: isMobile ? 0 : '100%',
      y: isMobile ? '100%' : 0,
      opacity: 0.8
    },
    visible: {
      x: 0,
      y: 0,
      opacity: 1,
      transition: {
        type: 'spring' as const,
        damping: 30,
        stiffness: 300
      }
    },
    exit: {
      x: isMobile ? 0 : '100%',
      y: isMobile ? '100%' : 0,
      opacity: 0.8,
      transition: {
        type: 'spring' as const,
        damping: 30,
        stiffness: 300
      }
    }
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          {/* Backdrop Blur Overlay with click listener to close */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="fixed inset-0 z-[9990] bg-black/60 backdrop-blur-md"
          />

          {/* Drawer Container */}
          <motion.div
            variants={drawerVariants}
            initial="hidden"
            animate="visible"
            exit="exit"
            className={`fixed z-[9991] bg-[var(--pm-surface)]/95 backdrop-blur-2xl border-[var(--pm-border)] shadow-2xl flex flex-col overflow-hidden outline-none
              ${isMobile 
                ? 'bottom-0 left-0 right-0 h-[80dvh] rounded-t-[32px] border-t' 
                : 'top-0 right-0 bottom-0 w-[420px] rounded-l-[32px] border-l'
              }`}
          >
            {/* Header section with responsive visual cues */}
            <div className="p-5 border-b border-[var(--pm-border)] flex items-center justify-between">
              <div className="flex items-center gap-2.5">
                <div className="w-10 h-10 rounded-2xl bg-[var(--pm-accent-soft)] flex items-center justify-center text-[var(--pm-accent)]">
                  <ShoppingBag className="w-5 h-5 text-[var(--pm-accent)]" />
                </div>
                <div>
                  <h3 className="font-bold text-base text-[var(--pm-text)]">আমার ব্যাগ (Cart Bag)</h3>
                  <p className="text-xs text-[var(--pm-text-secondary)]">{itemsCount}টি পণ্য যুক্ত আছে</p>
                </div>
              </div>
              <CloseButton size="md" variant="glass" className="rounded-full shadow-inner" onClose={onClose} />
            </div>

            {/* Scrollable list of multi-portal products */}
            <div className="flex-1 overflow-y-auto p-5 space-y-4 hide-scrollbar">
              {items.length === 0 ? (
                /* Beautiful animated vector style empty state */
                <div className="h-full flex flex-col items-center justify-center text-center p-8 space-y-4">
                  <motion.div
                    animate={{ scale: [1, 1.05, 1] }}
                    transition={{ repeat: Infinity, duration: 4 }}
                    className="w-24 h-24 rounded-full bg-[var(--pm-surface-hover)] flex items-center justify-center"
                  >
                    <ShoppingBag className="w-10 h-10 text-[var(--pm-text-muted)] opacity-60" />
                  </motion.div>
                  <div className="space-y-1">
                    <h4 className="font-bold text-base text-[var(--pm-text)]">কার্ট সম্পূর্ণ খালি!</h4>
                    <p className="text-xs text-[var(--pm-text-secondary)] max-w-[240px] mx-auto">
                      ব্যাগে কোনো পণ্য নেই। আমাদের ক্যাটাগরিগুলো থেকে সেরা মূল্যের পণ্য বেছে নিন।
                    </p>
                  </div>
                  <button
                    onClick={onClose}
                    className="px-6 py-2.5 rounded-full bg-[var(--pm-accent)] hover:opacity-90 text-white text-xs font-bold shadow-sm transition-all active:scale-95"
                  >
                    শপিং শুরু করুন
                  </button>
                </div>
              ) : (
                <div className="space-y-3">
                  {items.map((item) => (
                    <motion.div
                      layout
                      key={item.id}
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      className="p-3.5 rounded-2xl bg-[var(--pm-surface-hover)] border border-[var(--pm-border)] flex gap-3 relative group transition-colors hover:border-[var(--pm-accent)]/20"
                    >
                      {/* Product square thumbnail */}
                      <div className="w-16 h-16 rounded-xl overflow-hidden shrink-0 border border-[var(--pm-border)] bg-[var(--pm-bg)]">
                        <img 
                          src={item.image} 
                          alt={item.name} 
                          className="w-full h-full object-cover" 
                          onError={(e) => {
                            e.currentTarget.src = 'https://images.unsplash.com/photo-1542496658-e33a6d0d50f6?auto=format&fit=crop&w=400&q=80';
                          }}
                        />
                      </div>

                  <div className="flex-grow flex flex-col justify-between min-w-0 pr-6">
                    <div>
                      <h4 className="text-xs font-bold text-[var(--pm-text)] line-clamp-1 truncate text-left">
                        {item.name}
                      </h4>
                      {/* Portal badge source */}
                      <span className="text-[9px] font-black uppercase text-[var(--pm-accent)] bg-[var(--pm-accent-soft)] px-2 py-0.5 rounded-md mt-1 inline-block border border-[var(--pm-accent)]/10">
                        {getPortalBadgeText(item.domain || item.portal || 'retail')}
                      </span>
                    </div>

                    <div className="flex items-center justify-between mt-2">
                      <span className="text-sm font-black text-[var(--pm-text)]">
                        ৳ {(item.price * item.quantity).toLocaleString()}
                      </span>

                      {/* Micro quantity modifier layout compliant with accessibility guidelines */}
                      <div className="flex items-center bg-[var(--pm-bg)] border border-[var(--pm-border)] rounded-lg p-1">
                        <button
                          onClick={() => updateQuantity(item.id, item.quantity - 1)}
                          className="p-1 hover:bg-[var(--pm-surface-hover)] hover:text-[var(--pm-accent)] text-[var(--pm-text-secondary)] rounded transition-colors"
                          title="সংখ্যা কমান"
                        >
                          <Minus className="w-3 h-3" />
                        </button>
                        <span className="text-xs font-bold px-2.5 text-[var(--pm-text)]">{item.quantity}</span>
                        <button
                          onClick={() => updateQuantity(item.id, item.quantity + 1)}
                          className="p-1 hover:bg-[var(--pm-surface-hover)] hover:text-[var(--pm-accent)] text-[var(--pm-text-secondary)] rounded transition-colors"
                          title="সংখ্যা বাড়ান"
                        >
                          <Plus className="w-3 h-3" />
                        </button>
                      </div>
                    </div>
                  </div>

                      {/* Remove item button with easy target tap zone */}
                      <button
                        onClick={() => handleRemove(item.id, item.name)}
                        className="absolute top-3 right-3 p-1.5 text-[var(--pm-text-secondary)] hover:text-red-500 rounded-lg hover:bg-red-500/10 transition-all cursor-pointer"
                        title="কার্ট থেকে সরান"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </motion.div>
                  ))}
                </div>
              )}
            </div>

            {/* Sticky summary footer calculation sheet */}
            {items.length > 0 && (
              <div className="p-5 border-t border-[var(--pm-border)] space-y-4 bg-[var(--pm-surface-hover)]/30">
                {/* Rewards coins estimation overlay */}
                <div className="p-3 bg-amber-500/5 border border-amber-500/10 rounded-2xl flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <Coins className="w-4 h-4 text-amber-500 animate-pulse" />
                    <span className="text-xs font-bold text-[var(--pm-text)]">পিকার কয়েন অর্জন</span>
                  </div>
                  <span className="text-xs font-black text-amber-500">+{getTotalCoins()} PK Coins</span>
                </div>

                {/* Subtotal, delivery & grand total calculation lists */}
                <div className="space-y-2 text-xs">
                  <div className="flex items-center justify-between text-[var(--pm-text-secondary)]">
                    <span>উপমোট (Subtotal)</span>
                    <span className="font-semibold">৳ {subtotal.toLocaleString()}</span>
                  </div>
                  <div className="flex items-center justify-between text-[var(--pm-text-secondary)]">
                    <span>ডেলিভারি চার্জ</span>
                    <span className="font-semibold">৳ {deliveryCharge.toLocaleString()}</span>
                  </div>
                  <div className="w-full h-px bg-[var(--pm-border)]" />
                  <div className="flex items-center justify-between text-sm py-1">
                    <span className="font-extrabold text-[var(--pm-text)]">সর্বমোট মূল্য (Total)</span>
                    <span className="font-black text-lg text-[var(--pm-accent)]">
                      ৳ {grandTotal.toLocaleString()}
                    </span>
                  </div>
                </div>

                {/* Terms notification visual decoration */}
                <div className="flex gap-1.5 items-center justify-center text-[10px] text-[var(--pm-text-secondary)]">
                  <ShieldCheck className="w-3.5 h-3.5 text-cyan-500" />
                  <span>শতভাগ নিরাপদ পেমেন্ট ও সোশাল সিকিউরিটি সুরক্ষায় পিকার মার্ট</span>
                </div>

                {/* checkout CTA */}
                <button
                  onClick={handleCheckout}
                  className="w-full py-4.5 rounded-2xl bg-[var(--pm-accent)] hover:opacity-95 text-white font-extrabold text-sm tracking-wide shadow-md shadow-[var(--pm-accent)]/15 active:scale-[0.99] transition-all flex items-center justify-center gap-2 cursor-pointer"
                >
                  <span>অর্ডার সম্পন্ন করতে এগিয়ে যান (Checkout)</span>
                  <ArrowRight className="w-4 h-4" />
                </button>
              </div>
            )}
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
};
