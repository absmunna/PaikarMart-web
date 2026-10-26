import React from 'react';
import { Radar, TrendingUp, TrendingDown, Minus, Info, AlertTriangle } from 'lucide-react';
import { useAdminGovernanceStore } from '@/modules/admin/adminGovernanceStore';
import { cn } from '@/lib/utils';

export const RiskAnalyticsPanel: React.FC = () => {
  const { riskMetrics } = useAdminGovernanceStore();

  return (
    <div className="flex flex-col gap-6 w-full select-none">
       <div className="flex items-center justify-between">
           <h3 className="text-xs uppercase tracking-wider text-zinc-500 font-bold flex items-center gap-2">
                <Radar className="w-4 h-4 text-cyan-400" /> Platform Risk Vectors
           </h3>
           <div className="flex items-center gap-2">
               <span className="text-[10px] font-black text-white px-2 py-0.5 rounded bg-cyan-500/10 border border-cyan-500/20">Overall: 24/100</span>
           </div>
       </div>

       <div className="flex flex-col gap-4">
           {riskMetrics.map((metric: any) => (
               <div key={metric.id} className="p-4 rounded-2xl bg-[var(--pm-surface)]/10 border border-[var(--pm-border)] flex flex-col gap-3 group">
                   <div className="flex items-center justify-between">
                       <span className="text-[11px] font-black text-white uppercase tracking-tight">{metric.title}</span>
                       <div className="flex items-center gap-1.5">
                           {metric.trend === 'up' ? <TrendingUp className="w-3 h-3 text-rose-500" /> : 
                            metric.trend === 'down' ? <TrendingDown className="w-3 h-3 text-cyan-400" /> :
                            <Minus className="w-3 h-3 text-zinc-600" />}
                           <span className={cn(
                               "text-[10px] font-mono font-black",
                               metric.score > 40 ? "text-rose-500" : "text-cyan-400"
                           )}>{metric.score}%</span>
                       </div>
                   </div>

                   <div className="h-1.5 w-full bg-zinc-900 rounded-full overflow-hidden border border-white/5">
                        <div 
                            className={cn(
                                "h-full transition-all duration-1000",
                                metric.score > 50 ? "bg-rose-500" : metric.score > 25 ? "bg-amber-400" : "bg-cyan-400"
                            )} 
                            style={{ width: `${metric.score}%` }} 
                        />
                   </div>

                   <p className="text-[10px] text-zinc-500 leading-relaxed font-bold uppercase tracking-tight">
                       {metric.description}
                   </p>
               </div>
           ))}
       </div>

       <div className="mt-2 p-4 rounded-2xl bg-indigo-500/5 border border-indigo-500/10">
           <div className="flex items-start gap-3">
               <Info className="w-4 h-4 text-indigo-400 shrink-0 mt-0.5" />
               <p className="text-[10px] text-zinc-500 leading-normal italic">
                   Risk vectors are calculated using real-time packet analysis and checkout interaction patterns. All anomalies are auto-routed to the moderation queue.
               </p>
           </div>
       </div>
    </div>
  );
};
