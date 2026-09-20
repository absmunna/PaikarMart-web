import React from 'react';
import { TrendingUp, Calendar, ArrowUpRight } from 'lucide-react';
import { formatBDT } from '@/lib/format';

export const RevenueAnalyticsChart: React.FC = () => {
  // Mock data for the visualization
  const data = [
    { day: 'Sat', value: 45, height: '40%' },
    { day: 'Sun', value: 52, height: '55%' },
    { day: 'Mon', value: 38, height: '35%' },
    { day: 'Tue', value: 65, height: '75%' },
    { day: 'Wed', value: 48, height: '45%' },
    { day: 'Thu', value: 72, height: '85%' },
    { day: 'Fri', value: 58, height: '65%' },
  ];

  return (
    <div className="bg-[var(--pm-surface)]/20 border border-[var(--pm-border)] p-6 rounded-3xl select-none">
      <div className="flex items-center justify-between mb-8">
        <div>
           <h3 className="text-xs font-black uppercase tracking-[0.2em] text-zinc-500 mb-1">Revenue Stream</h3>
           <div className="flex items-baseline gap-2">
              <span className="text-2xl font-mono font-black text-white">৳ 12,450.00</span>
              <span className="text-[10px] text-cyan-400 font-bold flex items-center gap-0.5">
                 <ArrowUpRight className="w-3 h-3" /> +12.4%
              </span>
           </div>
        </div>
        
        <div className="flex bg-black/30 p-1 rounded-xl border border-white/5">
           <button className="px-3 py-1.5 rounded-lg bg-cyan-400 text-black text-[10px] font-black uppercase tracking-wider">7D</button>
           <button className="px-3 py-1.5 rounded-lg text-zinc-500 text-[10px] font-black uppercase tracking-wider">30D</button>
        </div>
      </div>

      {/* Visual Chart Shell */}
      <div className="relative h-48 w-full flex items-end justify-between gap-2 px-2 mt-4">
        {/* Horizontal grid lines */}
        <div className="absolute inset-0 flex flex-col justify-between pointer-events-none opacity-10">
            <div className="w-full h-px bg-white" />
            <div className="w-full h-px bg-white" />
            <div className="w-full h-px bg-white" />
            <div className="w-full h-px bg-white" />
        </div>

        {data.map((item, idx) => (
           <div key={item.day} className="flex-1 flex flex-col items-center gap-3 group">
              <div className="relative w-full flex justify-center">
                 {/* Bar */}
                 <div 
                    style={{ height: item.height }} 
                    className="w-2 md:w-4 bg-gradient-to-t from-cyan-400/10 to-cyan-400/40 rounded-t-lg transition-all duration-700 group-hover:from-cyan-400/40 group-hover:to-cyan-400"
                 />
                 
                 {/* Line connection point (decorative) */}
                 <div className="absolute bottom-full mb-[-4px] left-1/2 -translate-x-1/2 w-2 h-2 rounded-full border border-cyan-400 bg-black z-10" />
              </div>
              <span className="text-[10px] font-mono font-bold text-zinc-600 group-hover:text-cyan-400 transition-colors uppercase tracking-widest">{item.day}</span>
           </div>
        ))}
      </div>

      {/* Insight Footer */}
      <div className="mt-8 pt-6 border-t border-white/5 flex items-center justify-between">
         <div className="flex items-center gap-2">
            <TrendingUp className="w-4 h-4 text-cyan-400" />
            <span className="text-[10px] text-zinc-500 font-bold uppercase tracking-wide">Primary Peak on Thursdays</span>
         </div>
         <span className="text-[9px] font-mono text-zinc-600 font-bold uppercase">Real-time settlement data</span>
      </div>
    </div>
  );
};
