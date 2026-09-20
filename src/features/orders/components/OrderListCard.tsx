import React from 'react';
import { ChevronRight, Clock, ShieldCheck, Package } from 'lucide-react';
import { Order, OrderState } from '@/modules/orders/orderTrackingStore';
import { formatBDT } from '@/lib/format';
import { cn } from '@/lib/utils';
import { format } from 'date-fns';

interface OrderListCardProps {
  order: Order;
  onClick: () => void;
}

const STATUS_CONFIG: Record<OrderState, { label: string; color: string; bg: string }> = {
  ORDER_CREATED: { label: 'Order Placed', color: 'text-cyan-400', bg: 'bg-cyan-400/10' },
  PAYMENT_CONFIRMED: { label: 'Payment Verified', color: 'text-cyan-400', bg: 'bg-cyan-400/10' },
  PACKING: { label: 'Packing', color: 'text-amber-400', bg: 'bg-amber-400/10' },
  READY_FOR_PICKUP: { label: 'Ready for Pickup', color: 'text-amber-400', bg: 'bg-amber-400/10' },
  PICKED_UP: { label: 'Picked Up', color: 'text-indigo-400', bg: 'bg-indigo-400/10' },
  IN_TRANSIT: { label: 'In Transit', color: 'text-indigo-400', bg: 'bg-indigo-400/10' },
  OUT_FOR_DELIVERY: { label: 'Out for Delivery', color: 'text-blue-400', bg: 'bg-blue-400/10' },
  DELIVERED: { label: 'Delivered', color: 'text-cyan-400', bg: 'bg-cyan-400/10' },
  COMPLETED: { label: 'Completed', color: 'text-zinc-400', bg: 'bg-zinc-400/10' },
};

export const OrderListCard: React.FC<OrderListCardProps> = React.memo(({ order, onClick }) => {
  const status = STATUS_CONFIG[order.status] || STATUS_CONFIG.ORDER_CREATED;

  return (
    <button
      onClick={onClick}
      className="w-full text-left p-4 rounded-2xl bg-[var(--pm-surface)]/40 border border-[var(--pm-border)] hover:border-cyan-500/30 transition-all flex items-center gap-4 group cursor-pointer"
    >
      {/* 80x80 Thumbnail */}
      <div className="w-20 h-20 rounded-xl bg-black/20 border border-[var(--pm-border)] overflow-hidden shrink-0 flex items-center justify-center relative">
        {order.items && order.items[0]?.image ? (
          <img src={order.items[0].image} alt="Product" className="w-full h-full object-cover" />
        ) : (
          <Package className="w-8 h-8 text-[var(--pm-text-secondary)]" />
        )}
        <div className="absolute inset-0 bg-black/10 group-hover:bg-transparent transition-colors" />
      </div>

      {/* Info Block */}
      <div className="flex-1 min-w-0">
        <div className="flex items-center justify-between mb-1">
          <span className="text-[10px] font-mono font-black text-[var(--pm-text-secondary)] uppercase tracking-widest">
            {order.id}
          </span>
          <span className="text-[10px] text-[var(--pm-text-secondary)] font-medium flex items-center gap-1">
            <Clock className="w-3 h-3" /> {format(new Date(order.createdAt), 'MMM dd, h:mm a')}
          </span>
        </div>

        <h3 className="text-sm font-bold text-white truncate mb-2">
          {order.items?.length > 1 ? `${order.items[0].name} + ${order.items.length - 1} more` : order.items?.[0]?.name || 'Sourcing Order'}
        </h3>

        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <span className={cn("text-[9px] font-black uppercase px-2 py-0.5 rounded-md border border-white/5", status.color, status.bg)}>
              {status.label}
            </span>
            <span className="text-xs font-mono font-black text-cyan-400">
              {formatBDT(order.total)}
            </span>
          </div>
          
          <div className="flex items-center gap-1 text-[var(--pm-text-secondary)] group-hover:text-cyan-400 transition-colors">
            <span className="text-[9px] font-bold uppercase tracking-wider hidden sm:inline">Track Detail</span>
            <ChevronRight className="w-4 h-4" />
          </div>
        </div>
      </div>
    </button>
  );
});
