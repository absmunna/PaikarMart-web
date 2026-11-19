import React, { useState } from 'react';
import { Search, Package, MapPin, ArrowRight } from 'lucide-react';
import { Order } from '@/types';

interface GuestOrderTrackerProps {
  orders: Order[];
  onTrack: (order: Order) => void;
}

export const GuestOrderTracker: React.FC<GuestOrderTrackerProps> = ({ orders, onTrack }) => {
  const [orderId, setOrderId] = useState('');
  const [error, setError] = useState<string | null>(null);

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    
    const found = orders.find(o => o.id.toLowerCase() === orderId.toLowerCase().trim());
    if (found) {
      onTrack(found);
    } else {
      setError('Order not found. Please check the ID and try again.');
    }
  };

  return (
    <div className="bg-[var(--pm-card)] text-[var(--pm-text)] border border-[var(--pm-border)] rounded-3xl p-6 sm:p-8 space-y-6">
      <div className="space-y-2">
        <h3 className="text-xl font-black text-[var(--pm-text)]">Track Your Guest Order</h3>
        <p className="text-xs text-[var(--pm-muted)]">Enter your order ID (e.g., ORD-123456) to see live status updates.</p>
      </div>

      <form onSubmit={handleSearch} className="space-y-4">
        <div className="relative">
          <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-5 h-5 text-[var(--pm-muted)]" />
          <input 
            type="text" 
            placeholder="Order ID" 
            className="w-full pl-11 pr-4 py-3 rounded-2xl bg-[var(--pm-input)] text-sm font-bold text-[var(--pm-text)] placeholder:text-[var(--pm-muted)] border border-[var(--pm-border)] focus:border-[var(--pm-accent)] outline-none"
            value={orderId}
            onChange={e => setOrderId(e.target.value)}
          />
        </div>
        
        {error && <p className="text-[10px] font-bold text-[var(--pm-danger)] px-1">{error}</p>}

        <button 
          type="submit"
          className="w-full py-3.5 rounded-2xl bg-[var(--pm-accent)] hover:bg-[var(--pm-accent-hover)] text-[var(--pm-accent-fg)] font-bold text-xs shadow-lg transition-all flex items-center justify-center gap-2 cursor-pointer"
        >
          <span>Track Order Now</span>
          <ArrowRight className="w-4 h-4" />
        </button>
      </form>

      <div className="pt-4 border-t border-[var(--pm-border)]">
        <div className="p-4 rounded-2xl bg-[var(--pm-accent-soft)] border border-[var(--pm-accent-border)] flex items-start gap-3">
          <Package className="w-5 h-5 text-[var(--pm-accent)] shrink-0 mt-0.5" />
          <div className="space-y-1">
            <p className="text-xs font-bold text-[var(--pm-text)]">Don't have an ID?</p>
            <p className="text-[10px] text-[var(--pm-muted)] leading-relaxed">
              Check your SMS or Email for the order confirmation. If you just placed an order, it might take a few minutes to appear.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};
