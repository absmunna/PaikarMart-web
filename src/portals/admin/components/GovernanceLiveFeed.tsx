import React from 'react';
import { Radio, Siren, Zap, AlertCircle, ShieldHalf, ArrowRight } from 'lucide-react';
import { useAdminGovernanceStore } from '@/modules/admin/adminGovernanceStore';
import { cn } from '@/lib/utils';

export const GovernanceLiveFeed: React.FC = () => {
  const { logs } = useAdminGovernanceStore();
  const alerts = logs.filter((l: any) => l.severity !== 'info').slice(0, 5);

  return (
    <div className="bg-[var(--pm-surface)]/40 border border-[var(--pm-border)] p-6 rounded-3xl flex flex-col gap-5 select-none relative overflow-hidden">
      <div className="absolute top-0 right-0 p-4 opacity-5 pointer-events-none">
          <Siren className="w-24 h-24 text-rose-500 fill-rose-500" />
      </div>

      <div className="flex items-center gap-2 mb-1">
        <div className="p-1.5 rounded-lg bg-rose-500/10 border border-rose-500/20">
            <Radio className="w-4 h-4 text-rose-500 animate-pulse" />
        </div>
        <h3 className="text-xs uppercase tracking-[0.2em] text-white font-black">Live Violation Feed</h3>
      </div>

      <div className="flex flex-col gap-3">
        {alerts.length === 0 ? (
            <div className="py-6 text-center text-zinc-600 text-[10px] font-black uppercase tracking-widest border border-dashed border-white/5 rounded-2xl">
                No active threats detected.
            </div>
        ) : (
            alerts.map((alert: any) => (
                <div key={alert.id} className="p-3 rounded-2xl bg-black/30 border border-white/5 flex flex-col gap-2 group hover:border-rose-500/20 transition-all cursor-pointer">
                    <div className="flex items-center justify-between">
                         <span className={cn(
                             "text-[8px] font-black uppercase tracking-widest px-1.5 py-0.5 rounded",
                             alert.severity === 'critical' ? "bg-rose-500 text-white" : "bg-amber-500 text-black"
                         )}>
                             {alert.severity}
                         </span>
                         <span className="text-[9px] font-mono text-zinc-600 uppercase">Alert #{alert.id.slice(0, 4)}</span>
                    </div>
                    <p className="text-[10px] text-zinc-400 font-bold uppercase tracking-tight leading-snug">
                        {alert.action} signal on <span className="text-white">{alert.target}</span>
                    </p>
                    <div className="flex items-center justify-between mt-1 pt-2 border-t border-white/5">
                        <span className="text-[8px] text-zinc-700 font-black uppercase">{alert.actor}</span>
                        <ArrowRight className="w-3 h-3 text-zinc-800 group-hover:text-rose-500" />
                    </div>
                </div>
            ))
        )}
      </div>

      <div className="p-4 rounded-2xl bg-zinc-900 border border-[var(--pm-border)] mt-2">
         <div className="flex items-center gap-3 mb-3">
             <div className="p-2 rounded-xl bg-cyan-400/10 border border-cyan-400/20">
                <ShieldHalf className="w-4 h-4 text-cyan-400" />
             </div>
             <div>
                <h4 className="text-[10px] font-black text-white uppercase tracking-widest">Platform Shield</h4>
                <p className="text-[8px] text-zinc-500 font-bold uppercase tracking-tight mt-0.5">Active Enforcement L3</p>
             </div>
         </div>
         <div className="h-1 w-full bg-zinc-800 rounded-full overflow-hidden">
            <div className="h-full bg-cyan-400 w-[92%]" />
         </div>
         <p className="text-[9px] text-zinc-600 mt-3 italic leading-snug">
            Sentinels are operating at 92% efficiency across all nodes.
         </p>
      </div>
    </div>
  );
};
