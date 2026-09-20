import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Store, ShoppingBag, BarChart3, Package } from 'lucide-react';
import { GlassCard } from '@/components/ui/GlassCard';

export const MerchantHomeView: React.FC = () => {
  const navigate = useNavigate();

  return (
    <div className="p-6 space-y-8">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-black text-white">Merchant Dashboard</h1>
          <p className="text-zinc-500 text-sm font-medium">Manage your business and fulfill orders.</p>
        </div>
        <Button onClick={() => navigate('/seller-central')} className="bg-cyan-500 hover:bg-cyan-400 text-black font-black uppercase text-xs tracking-widest rounded-xl">
          Enter Seller Central
        </Button>
      </div>

      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <GlassCard className="p-4 flex flex-col gap-2 border-cyan-500/10">
          <Store className="w-5 h-5 text-cyan-400" />
          <span className="text-[10px] font-black text-zinc-500 uppercase tracking-widest">Active Orders</span>
          <span className="text-xl font-black text-white">12</span>
        </GlassCard>
        <GlassCard className="p-4 flex flex-col gap-2 border-amber-500/10">
          <ShoppingBag className="w-5 h-5 text-amber-400" />
          <span className="text-[10px] font-black text-zinc-500 uppercase tracking-widest">Today's Sales</span>
          <span className="text-xl font-black text-white">৳ 12,450</span>
        </GlassCard>
        <GlassCard className="p-4 flex flex-col gap-2 border-emerald-500/10">
          <Package className="w-5 h-5 text-emerald-400" />
          <span className="text-[10px] font-black text-zinc-500 uppercase tracking-widest">Low Stock</span>
          <span className="text-xl font-black text-rose-500">3</span>
        </GlassCard>
        <GlassCard className="p-4 flex flex-col gap-2 border-violet-500/10">
          <BarChart3 className="w-5 h-5 text-violet-400" />
          <span className="text-[10px] font-black text-zinc-500 uppercase tracking-widest">Conversion</span>
          <span className="text-xl font-black text-white">4.2%</span>
        </GlassCard>
      </div>
    </div>
  );
};
