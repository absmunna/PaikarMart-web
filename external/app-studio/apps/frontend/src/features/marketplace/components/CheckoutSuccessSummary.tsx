import React from 'react';
import { CheckCircle2, Receipt, ArrowRight } from 'lucide-react';
import { Order } from '@/types';

interface CheckoutSuccessSummaryProps {
  order: Order;
  onClose: () => void;
}

export const CheckoutSuccessSummary: React.FC<CheckoutSuccessSummaryProps> = ({ order, onClose }) => {
  return (
    <div className="p-6 space-y-6 animate-fadeIn">
      <div className="text-center space-y-2">
        <div className="w-16 h-16 rounded-full bg-[var(--pm-success)] text-white flex items-center justify-center mx-auto shadow-lg">
          <CheckCircle2 className="w-9 h-9" />
        </div>
        <h3 className="text-xl font-black text-[var(--pm-text)]">Order Confirmed!</h3>
        <p className="text-xs text-[var(--pm-muted)]">Your order {order.id} has been placed successfully.</p>
      </div>

      <div className="p-4 rounded-2xl bg-[var(--pm-surface)] border border-[var(--pm-border)] space-y-3">
        <div className="flex items-center gap-2 text-xs font-bold text-[var(--pm-muted)] uppercase tracking-wider">
          <Receipt className="w-4 h-4" />
          <span>Order Breakdown</span>
        </div>
        <div className="space-y-1.5 text-xs text-[var(--pm-muted)]">
          <div className="flex justify-between"><span>Subtotal</span><span>৳{order.subtotal.toFixed(2)}</span></div>
          <div className="flex justify-between"><span>Delivery Fee</span><span>৳{order.deliveryFee.toFixed(2)}</span></div>
          <div className="flex justify-between"><span>Tax</span><span>৳{order.tax.toFixed(2)}</span></div>
          <div className="flex justify-between font-black text-[var(--pm-text)] pt-2 border-t border-[var(--pm-border)]">
            <span>Total</span><span>৳{order.total.toFixed(2)}</span>
          </div>
        </div>
      </div>

      <button onClick={onClose} className="w-full py-3.5 rounded-xl bg-[var(--pm-accent)] hover:bg-[var(--pm-accent-hover)] text-[var(--pm-accent-fg)] font-bold text-xs shadow-md transition-all flex items-center justify-center gap-2 cursor-pointer">
        Continue Shopping
        <ArrowRight className="w-4 h-4" />
      </button>
    </div>
  );
};
