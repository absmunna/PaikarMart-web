import React from 'react';
import { ShoppingBag, Clock, User } from 'lucide-react';
import { GlassCard } from '@/components/ui/GlassCard';

export const SellerOrderPanel: React.FC<{ orders: any[] }> = ({ orders }) => {
  return (
    <div className="flex flex-col gap-4">
      <h3 className="text-xs font-black uppercase text-zinc-500 tracking-widest">Recent Orders</h3>
      {orders.map((order) => (
        <GlassCard key={order.id} className="p-4 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-white/5 flex items-center justify-center text-zinc-500">
              <User size={18} />
            </div>
            <div>
              <p className="text-xs font-black text-white uppercase">{order.buyerName}</p>
              <p className="text-[10px] text-zinc-500 font-bold uppercase">{order.itemCount} Units • #{order.id}</p>
            </div>
          </div>
          <div className="text-right">
            <p className="text-sm font-black text-cyan-400">৳{order.amount}</p>
            <span className="text-[8px] font-black uppercase bg-cyan-500/10 text-cyan-500 px-2 py-0.5 rounded-full border border-cyan-500/20">{order.status}</span>
          </div>
        </GlassCard>
      ))}
    </div>
  );
};
