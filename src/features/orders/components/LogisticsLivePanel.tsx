import React from 'react';
import { Truck, MapPin, Navigation, Phone, Info } from 'lucide-react';
import { Order } from '@/modules/orders/orderTrackingStore';

interface LogisticsLivePanelProps {
  order: Order;
}

export const LogisticsLivePanel: React.FC<LogisticsLivePanelProps> = ({ order }) => {
  const { riderInfo } = order;

  return (
    <div className="bg-[var(--pm-surface)]/40 border border-[var(--pm-border)] p-6 rounded-2xl flex flex-col gap-5 select-none">
      <div className="flex items-center justify-between">
        <h3 className="text-xs uppercase tracking-wider text-[var(--pm-text-secondary)] font-bold flex items-center gap-2">
            <Navigation className="w-4 h-4 text-cyan-400" /> Live Dynamics
        </h3>
        {riderInfo && (
            <span className="text-[10px] font-bold text-cyan-400 bg-cyan-500/10 px-2 py-0.5 rounded-full border border-cyan-500/10 animate-pulse">
                RIDER ASSIGNED
            </span>
        )}
      </div>

      {/* Map visual placeholder */}
      <div className="w-full aspect-[16/9] rounded-xl bg-[var(--pm-bg)]/80 border border-[var(--pm-border)] relative overflow-hidden flex items-center justify-center">
        <div className="absolute inset-0 grayscale opacity-20 bg-[url('https://api.dicebear.com/7.x/initials/svg?seed=Map')] bg-cover" />
        <div className="relative z-10 flex flex-col items-center gap-2">
           <MapPin className="w-8 h-8 text-cyan-400 drop-shadow-[0_0_10px_rgba(34,211,238,0.5)]" />
           <span className="text-[10px] font-mono text-cyan-400 font-bold uppercase tracking-tight">Geo-Sync Active</span>
        </div>
        
        {/* Animated pulse at location */}
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2">
            <div className="w-12 h-12 rounded-full border border-cyan-400 animate-ping opacity-20" />
        </div>
      </div>

      {/* Logistics data cards */}
      <div className="grid grid-cols-2 gap-3">
        <div className="p-3 rounded-xl bg-black/20 border border-[var(--pm-border)]">
            <span className="text-[9px] text-[var(--pm-text-secondary)] uppercase font-bold block mb-1">Traveled Distance</span>
            <span className="text-sm font-mono font-black text-white">{riderInfo?.distance || 'Pending...'}</span>
        </div>
        <div className="p-3 rounded-xl bg-black/20 border border-[var(--pm-border)]">
            <span className="text-[9px] text-[var(--pm-text-secondary)] uppercase font-bold block mb-1">Est. Arrival (ETA)</span>
            <span className="text-sm font-mono font-black text-cyan-400">{riderInfo?.eta || 'Syncing...'}</span>
        </div>
      </div>

      {/* Rider Info */}
      {riderInfo && (
        <div className="p-4 rounded-xl bg-cyan-400/5 border border-cyan-400/20 flex items-center gap-4">
            <div className="w-10 h-10 rounded-full bg-black/40 border border-cyan-400/30 flex items-center justify-center text-cyan-400 font-black text-xs">
                {riderInfo.name.charAt(0)}
            </div>
            <div className="flex-1">
                <h4 className="text-xs font-bold text-white leading-tight">{riderInfo.name}</h4>
                <p className="text-[10px] text-[var(--pm-text-secondary)]">Paikar Verified Partner</p>
            </div>
            <button className="w-9 h-9 rounded-xl bg-cyan-400 hover:bg-cyan-500 text-black flex items-center justify-center transition-all cursor-pointer shadow-lg shadow-cyan-400/20 active:scale-95">
                <Phone className="w-4 h-4" />
            </button>
        </div>
      )}

      {!riderInfo && (
          <div className="bg-zinc-800/20 border border-white/5 p-3 rounded-xl flex gap-3 text-[10px] text-[var(--pm-text-secondary)]">
              <Info className="w-4 h-4 text-zinc-500 shrink-0 mt-0.5" />
              <p className="leading-relaxed">Dispatch team is currently allocating the most efficient cargo route for your order.</p>
          </div>
      )}
    </div>
  );
};
