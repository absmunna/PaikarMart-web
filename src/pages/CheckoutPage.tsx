import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { ArrowLeft, MapPin, CreditCard, Banknote, ShieldCheck, CheckCircle2 } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { useCartStore } from '../modules/cart/cartStore';
import { useWalletStore } from '../modules/wallet/store/walletStore';
import { useNotificationStore } from '../store/notificationStore';

export const CheckoutPage = () => {
  const navigate = useNavigate();
  const { items, getTotalPrice, clearCart, getTotalCoins } = useCartStore();
  const { bdtBalance, sendMoney, addTransaction, addCoins } = useWalletStore();
  const { addNotification } = useNotificationStore();

  const [shippingAddress, setShippingAddress] = useState('');
  const [phone, setPhone] = useState('');
  const [paymentMethod, setPaymentMethod] = useState<'cod' | 'wallet'>('cod');
  const [isProcessing, setIsProcessing] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);

  const subtotal = getTotalPrice();
  const deliveryFee = 60;
  const total = subtotal + deliveryFee;

  // Auto redirect if cart is empty
  if (items.length === 0 && !isSuccess) {
    navigate('/pk-shop');
    return null;
  }

  const handleConfirmOrder = () => {
    if (!shippingAddress || !phone) return;

    if (paymentMethod === 'wallet' && bdtBalance < total) {
      addNotification('Insufficient Wallet Balance. Please top up or select Cash on Delivery.', 'error');
      return;
    }

    setIsProcessing(true);

    setTimeout(() => {
      if (paymentMethod === 'wallet') {
        // Deduct from wallet
        sendMoney(total, 'PaikarMart Store (Order Payment)');
      }

      // Add coins cashback
      const cashback = getTotalCoins();
      if (cashback > 0) {
        addCoins(cashback);
      }

      setIsProcessing(false);
      setIsSuccess(true);
      clearCart();

      setTimeout(() => {
        navigate('/');
      }, 3000);
    }, 2000); // 2 second fake loading
  };

  if (isSuccess) {
    return (
      <div className="min-h-[100dvh] flex flex-col items-center justify-center p-6 text-center space-y-4">
        <motion.div
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          transition={{ type: 'spring', damping: 15 }}
          className="w-24 h-24 bg-emerald-500/20 rounded-full flex items-center justify-center mb-4"
        >
          <CheckCircle2 className="w-12 h-12 text-emerald-500" />
        </motion.div>
        <h1 className="text-2xl font-black text-[var(--pm-text)]">Order Placed Successfully!</h1>
        <p className="text-sm text-[var(--pm-text-muted)]">Your items are being processed for delivery.</p>
        <p className="text-xs font-bold text-amber-500">+{getTotalCoins()} PK Coins Rewarded!</p>
      </div>
    );
  }

  return (
    <div className="flex flex-col min-h-[100dvh] bg-[var(--pm-bg)] relative">
      {/* Header */}
      <header className="sticky top-0 z-40 glass border-b border-[var(--pm-border)]/50 p-4 flex items-center gap-4">
        <button onClick={() => navigate(-1)} className="p-2 bg-[var(--pm-surface-hover)] rounded-full text-[var(--pm-text)] active:scale-95 transition-all">
          <ArrowLeft className="w-5 h-5" />
        </button>
        <h1 className="text-lg font-black text-[var(--pm-text)] uppercase tracking-wider">Secure Checkout</h1>
      </header>

      <div className="flex-1 overflow-y-auto p-4 space-y-6 pb-[100px] hide-scrollbar">
        {/* Shipping Address */}
        <section className="glass rounded-3xl p-5 border border-[var(--pm-border)]/50 space-y-4">
          <div className="flex items-center gap-2 mb-2">
            <MapPin className="w-5 h-5 text-[var(--pm-accent)]" />
            <h2 className="font-bold text-sm text-[var(--pm-text)]">Shipping Details</h2>
          </div>
          <div className="space-y-3">
            <input 
              type="text" 
              placeholder="Full Delivery Address (e.g. House 12, Road 5, Mirpur)" 
              value={shippingAddress}
              onChange={(e) => setShippingAddress(e.target.value)}
              className="w-full bg-[var(--pm-surface-hover)] border border-[var(--pm-border)] rounded-2xl px-4 py-3 text-sm text-[var(--pm-text)] outline-none focus:border-[var(--pm-accent)]"
            />
            <input 
              type="tel" 
              placeholder="Contact Phone Number" 
              value={phone}
              onChange={(e) => setPhone(e.target.value)}
              className="w-full bg-[var(--pm-surface-hover)] border border-[var(--pm-border)] rounded-2xl px-4 py-3 text-sm text-[var(--pm-text)] outline-none focus:border-[var(--pm-accent)]"
            />
          </div>
        </section>

        {/* Order Summary */}
        <section className="glass rounded-3xl p-5 border border-[var(--pm-border)]/50 space-y-4">
          <h2 className="font-bold text-sm text-[var(--pm-text)]">Order Summary ({items.length} items)</h2>
          <div className="space-y-3">
            {items.map(item => (
              <div key={item.id} className="flex justify-between items-center text-sm">
                <span className="text-[var(--pm-text-muted)] truncate max-w-[70%]">{item.quantity}x {item.name}</span>
                <span className="text-[var(--pm-text)] font-bold">৳ {item.price * item.quantity}</span>
              </div>
            ))}
          </div>
          <div className="w-full h-[1px] bg-[var(--pm-border)]/50" />
          <div className="space-y-2 text-sm">
            <div className="flex justify-between text-[var(--pm-text-muted)]">
              <span>Subtotal</span>
              <span>৳ {subtotal}</span>
            </div>
            <div className="flex justify-between text-[var(--pm-text-muted)]">
              <span>Delivery Fee</span>
              <span>৳ {deliveryFee}</span>
            </div>
            <div className="flex justify-between font-black text-lg text-[var(--pm-text)] pt-2">
              <span>Total Payable</span>
              <span className="text-[var(--pm-accent)]">৳ {total.toLocaleString()}</span>
            </div>
          </div>
        </section>

        {/* Payment Methods */}
        <section className="space-y-3">
          <h2 className="font-bold text-sm text-[var(--pm-text)] px-2">Payment Method</h2>
          <div className="grid grid-cols-1 gap-3">
            <button 
              onClick={() => setPaymentMethod('cod')}
              className={`p-4 rounded-2xl border-2 flex items-center justify-between transition-all ${paymentMethod === 'cod' ? 'border-[var(--pm-accent)] bg-[var(--pm-accent)]/5' : 'border-[var(--pm-border)] bg-glass'}`}
            >
              <div className="flex items-center gap-3">
                <Banknote className={`w-6 h-6 ${paymentMethod === 'cod' ? 'text-[var(--pm-accent)]' : 'text-[var(--pm-text-muted)]'}`} />
                <div className="text-left">
                  <h3 className="font-bold text-[var(--pm-text)] text-sm">Cash on Delivery</h3>
                  <p className="text-[10px] text-[var(--pm-text-muted)]">Pay when you receive the order</p>
                </div>
              </div>
              <div className={`w-5 h-5 rounded-full border-2 flex items-center justify-center ${paymentMethod === 'cod' ? 'border-[var(--pm-accent)]' : 'border-[var(--pm-border)]'}`}>
                {paymentMethod === 'cod' && <div className="w-2.5 h-2.5 rounded-full bg-[var(--pm-accent)]" />}
              </div>
            </button>

            <button 
              onClick={() => setPaymentMethod('wallet')}
              className={`p-4 rounded-2xl border-2 flex items-center justify-between transition-all ${paymentMethod === 'wallet' ? 'border-[var(--pm-accent)] bg-[var(--pm-accent)]/5' : 'border-[var(--pm-border)] bg-glass'}`}
            >
              <div className="flex items-center gap-3">
                <CreditCard className={`w-6 h-6 ${paymentMethod === 'wallet' ? 'text-[var(--pm-accent)]' : 'text-[var(--pm-text-muted)]'}`} />
                <div className="text-left">
                  <h3 className="font-bold text-[var(--pm-text)] text-sm">Super Wallet</h3>
                  <p className="text-[10px] text-[var(--pm-text-muted)]">Balance: ৳ {bdtBalance.toLocaleString()}</p>
                </div>
              </div>
              <div className={`w-5 h-5 rounded-full border-2 flex items-center justify-center ${paymentMethod === 'wallet' ? 'border-[var(--pm-accent)]' : 'border-[var(--pm-border)]'}`}>
                {paymentMethod === 'wallet' && <div className="w-2.5 h-2.5 rounded-full bg-[var(--pm-accent)]" />}
              </div>
            </button>
          </div>
        </section>
      </div>

      {/* Bottom Sticky Action */}
      <div className="fixed bottom-0 left-1/2 -translate-x-1/2 w-full max-w-[480px] sm:max-w-[540px] md:max-w-[600px] lg:max-w-[640px] p-4 glass border-t border-[var(--pm-border)] z-50">
        <button
          onClick={handleConfirmOrder}
          disabled={!shippingAddress || !phone || isProcessing}
          className="w-full bg-[var(--pm-accent)] text-white py-4 rounded-2xl font-black text-sm shadow-xl shadow-[var(--pm-accent)]/20 active:scale-95 transition-all flex items-center justify-center gap-2 disabled:opacity-50"
        >
          {isProcessing ? 'Processing Payment...' : `Confirm Order (৳ ${total.toLocaleString()})`}
          {!isProcessing && <ShieldCheck className="w-4 h-4" />}
        </button>
      </div>
    </div>
  );
};
