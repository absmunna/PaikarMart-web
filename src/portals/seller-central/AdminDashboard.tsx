import React from 'react';
import { GlassCard } from "@/components/ui/GlassCard";

export const AdminDashboard: React.FC = () => {
  return (
    <div className="p-6 space-y-6">
      <h1 className="text-2xl font-black text-white">Admin Control Panel</h1>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <GlassCard className="p-6">
          <h3 className="text-zinc-500 font-bold uppercase tracking-widest text-xs">Total GMV</h3>
          <p className="text-2xl font-black text-white mt-2">৳ 1,240,500</p>
        </GlassCard>
        <GlassCard className="p-6">
          <h3 className="text-zinc-500 font-bold uppercase tracking-widest text-xs">Active Vendors</h3>
          <p className="text-2xl font-black text-white mt-2">412</p>
        </GlassCard>
        <GlassCard className="p-6">
          <h3 className="text-zinc-500 font-bold uppercase tracking-widest text-xs">Pending KYC</h3>
          <p className="text-2xl font-black text-rose-500 mt-2">24</p>
        </GlassCard>
      </div>
    </div>
  );
};
