import React from 'react';
import { Sparkles, TrendingUp, DollarSign, AlertTriangle, ArrowRight } from 'lucide-react';
import { GlassCard } from '@/components/ui/GlassCard';

export const SellerAIInsightsPanel: React.FC<{ insights: any[] }> = ({ insights }) => {
  return (
    <GlassCard className="p-6 flex flex-col gap-6">
      <div className="flex items-center gap-2.5">
        <Sparkles className="w-4.5 h-4.5 text-cyan-400" />
        <h3 className="text-[11px] uppercase tracking-[0.2em] text-white font-black italic">AI Intelligence</h3>
      </div>
      <div className="flex flex-col gap-4">
        {insights.map((insight) => (
          <div key={insight.id} className="p-4 rounded-2xl bg-white/[0.03] border border-white/5 space-y-3">
            <p className="text-[10px] text-zinc-400 font-bold uppercase">{insight.message}</p>
            <button className="flex items-center justify-between w-full text-[9px] font-black uppercase text-cyan-400">
                <span>{insight.ctaLabel}</span>
                <ArrowRight className="w-3 h-3" />
            </button>
          </div>
        ))}
      </div>
    </GlassCard>
  );
};
