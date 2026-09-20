import React from 'react';
import { ShoppingBag, Clock, CheckCircle2, Truck, XCircle, ChevronRight, User } from 'lucide-react';
import { SellerOrder } from '@/modules/seller/sellerDashboardStore';
import { formatBDT } from '@/lib/format';
import { cn } from '@/lib/utils';
import { format } from 'date-fns';
import { GlassCard } from '@/components/ui';

interface SellerOrderPanelProps {
  orders: SellerOrder[];
  onAccept: (id: string) => void;
  onShip: (id: string) => void;
}

const STATUS_CONFIG: Record<SellerOrder['status'], { label: string; color: string; bg: string; icon: any }> = {
  new: { label: 'New Order', color: 'text-primary', bg: 'bg-primary/10', icon: ShoppingBag },
  processing: { label: 'In Packing', color: 'text-amber-400', bg: 'bg-amber-400/10', icon: Clock },
  shipped: { label: 'Dispatched', color: 'text-indigo-400', bg: 'bg-indigo-400/10', icon: Truck },
  completed: { label: 'Settled', color: 'text-[var(--pm-accent)]', bg: 'bg-[var(--pm-accent)]/10', icon: CheckCircle2 },
  cancelled: { label: 'Cancelled', color: 'text-rose-400', bg: 'bg-rose-400/10', icon: XCircle },
};

export const SellerOrderPanel: React.FC<SellerOrderPanelProps> = ({ orders, onAccept, onShip }) => {
  return (
    <div className="flex flex-col gap-5">
      {orders.length === 0 ? (
          <GlassCard className="py-16 flex flex-col items-center justify-center text-center bg-[var(--pm-card)] border-dashed border-[var(--pm-border)] rounded-[2.5rem]">
              <div className="w-16 h-16 rounded-full bg-white/5 border border-[var(--pm-border)] flex items-center justify-center mb-5 shadow-inner">
                <ShoppingBag className="w-8 h-8 text-zinc-800" />
              </div>
              <p className="text-zinc-500 text-[11px] font-black uppercase tracking-[0.2em] italic">No Active Trade Flow</p>
          </GlassCard>
      ) : (
        orders.map((order) => {
          const status = STATUS_CONFIG[order.status];
          const StatusIcon = status.icon;

          return (
            <GlassCard key={order.id} className="p-5 hover:border-[var(--pm-border)] transition-all group border-[var(--pm-border)] bg-white/[0.02]">
              <div className="flex items-center justify-between mb-4">
                  <div className="flex items-center gap-3">
                     <div className="px-3 py-1.5 rounded-xl bg-black/40 border border-[var(--pm-border)] shadow-inner">
                        <span className="text-[10px] font-black text-white uppercase tracking-widest">#{order.id.slice(0, 8)}</span>
                     </div>
                     <span className={cn("text-[9px] font-black uppercase px-2.5 py-1 rounded-full border border-[var(--pm-border)] shadow-lg shadow-black/20", status.color, status.bg)}>
                        {status.label}
                     </span>
                  </div>
                  <span className="text-[10px] text-zinc-600 font-black uppercase tracking-tighter">
                    {format(new Date(order.createdAt), 'h:mm a')}
                  </span>
              </div>

              <div className="flex items-center justify-between mb-6">
                  <div className="flex items-center gap-3.5">
                      <div className="w-11 h-11 rounded-2xl bg-white/5 border border-[var(--pm-border)] flex items-center justify-center text-zinc-500 shadow-xl">
                          <User className="w-5 h-5" />
                      </div>
                      <div>
                          <p className="text-xs font-black text-white leading-none uppercase tracking-tighter">{order.buyerName}</p>
                          <p className="text-[10px] text-zinc-600 font-black mt-1.5 uppercase tracking-wide">{order.itemCount} Units • Secured COD</p>
                      </div>
                  </div>
                  <p className="text-lg font-black text-primary tracking-tighter">{formatBDT(order.amount)}</p>
              </div>

              <div className="flex items-center gap-3 pt-5 border-t border-[var(--pm-border)]">
                  {order.status === 'new' && (
                      <button 
                        onClick={() => onAccept(order.id)}
                        className="flex-1 py-3.5 rounded-2xl bg-primary hover:bg-primary/90 text-white text-[10px] font-black uppercase tracking-widest transition-all cursor-pointer shadow-xl shadow-primary/20 active:scale-[0.97]"
                      >
                        Authorize
                      </button>
                  )}
                  {order.status === 'processing' && (
                      <button 
                        onClick={() => onShip(order.id)}
                        className="flex-1 py-3.5 rounded-2xl bg-amber-400 hover:bg-amber-500 text-black text-[10px] font-black uppercase tracking-widest transition-all cursor-pointer shadow-xl shadow-amber-400/20 active:scale-[0.97]"
                      >
                        Ship Manifest
                      </button>
                  )}
                  <button className="flex-1 py-3.5 rounded-2xl bg-white/5 hover:bg-white/10 text-white/70 hover:text-white text-[10px] font-black uppercase tracking-widest transition-all cursor-pointer border border-[var(--pm-border)]">
                      Log Details
                  </button>
              </div>
            </GlassCard>
          );
        })
      )}
    </div>
  );
};
