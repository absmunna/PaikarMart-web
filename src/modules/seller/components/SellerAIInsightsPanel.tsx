import React from 'react';
import { Sparkles, TrendingUp, DollarSign, AlertTriangle, ArrowRight, Zap } from 'lucide-react';
import { SellerAIInsight } from '@/modules/seller/sellerDashboardStore';
import { cn } from '@/lib/utils';
import { GlassCard } from '@/components/ui';

interface SellerAIInsightsPanelProps {
  insights: SellerAIInsight[];
}

const TYPE_CONFIG: Record<SellerAIInsight['type'], { icon: any; color: string; bg: string }> = {
  trending: { icon: TrendingUp, color: 'text-indigo-400', bg: 'bg-indigo-400/10' },
  price_demand: { icon: DollarSign, color: 'text-[var(--pm-accent)]', bg: 'bg-[var(--pm-accent)]/10' },
  refund_risk: { icon: AlertTriangle, color: 'text-rose-400', bg: 'bg-rose-400/10' },
  suggestion: { icon: Sparkles, color: 'text-amber-400', bg: 'bg-amber-400/10' },
};

export const SellerAIInsightsPanel: React.FC<SellerAIInsightsPanelProps> = ({ insights }) => {
  return (
    <GlassCard className="p-6 flex flex-col gap-6 relative overflow-hidden group">
      <div className="absolute -top-12 -right-12 p-4 opacity-[0.03] group-hover:opacity-[0.07] transition-opacity pointer-events-none">
          <Zap className="w-48 h-48 text-primary fill-primary" />
      </div>

      <div className="flex items-center gap-2.5">
        <div className="p-2 rounded-xl bg-primary/10 border border-primary/20 shadow-lg shadow-primary/5">
            <Sparkles className="w-4.5 h-4.5 text-primary" />
        </div>
        <h3 className="text-[11px] uppercase tracking-[0.2em] text-white font-black italic">AI Intelligence</h3>
      </div>

      <div className="flex flex-col gap-4">
        {insights.map((insight) => {
          const config = TYPE_CONFIG[insight.type];
          const Icon = config.icon;

          return (
            <div key={insight.id} className="p-4 rounded-[1.5rem] bg-white/[0.03] border border-white/5 flex flex-col gap-4 hover:bg-white/[0.06] hover:border-white/10 transition-all shadow-inner">
                <div className="flex items-start gap-4">
                    <div className={cn("p-2.5 rounded-2xl shrink-0 border border-white/5 shadow-xl", config.color, config.bg)}>
                        <Icon className="w-4 h-4" />
                    </div>
                    <p className="text-[10px] text-zinc-400 leading-relaxed font-black uppercase tracking-tight">
                        {insight.message}
                    </p>
                </div>
                
                <button className="flex items-center justify-between w-full p-3 rounded-xl bg-white/5 hover:bg-white/10 text-[9px] font-black uppercase tracking-[0.1em] text-primary group/btn transition-all">
                    <span>{insight.ctaLabel}</span>
                    <ArrowRight className="w-3.5 h-3.5 group-hover/btn:translate-x-1.5 transition-transform" />
                </button>
            </div>
          );
        })}
      </div>

      <div className="mt-2 p-4 bg-black/20 rounded-[1.25rem] border border-white/5 shadow-inner">
          <p className="text-[9px] text-zinc-500 italic leading-loose font-bold uppercase tracking-tighter">
              Paikar AI analyzes 10k+ local signals daily to optimize your performance.
          </p>
      </div>
    </GlassCard>
  );
};
