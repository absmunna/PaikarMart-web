import React from 'react';
import { TrendingUp, ArrowUpRight } from 'lucide-react';

export const RevenueAnalyticsChart: React.FC<{ kpis: any }> = ({ kpis }) => {
  return (
    <div className="bg-white/5 border border-white/5 p-6 rounded-3xl">
      <div className="flex items-center justify-between mb-8">
        <div>
           <h3 className="text-xs font-black uppercase tracking-[0.2em] text-zinc-500 mb-1">Revenue Stream</h3>
           <div className="flex items-baseline gap-2">
              <span className="text-2xl font-mono font-black text-white">৳ {kpis.totalSales.toLocaleString()}</span>
              <span className="text-[10px] text-cyan-400 font-bold flex items-center gap-0.5">
                 <ArrowUpRight className="w-3 h-3" /> +12.4%
              </span>
           </div>
        </div>
      </div>
      <div className="h-40 flex items-end justify-between gap-2">
        {[40, 60, 35, 90, 50, 70, 55].map((h, i) => (
          <div key={i} className="flex-1 bg-cyan-500/20 rounded-t-lg hover:bg-cyan-500 transition-all cursor-pointer" style={{ height: `${h}%` }} />
        ))}
      </div>
    </div>
  );
};
