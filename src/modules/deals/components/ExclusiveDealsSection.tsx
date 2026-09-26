import React from 'react';
import { motion } from 'motion/react';
import { Sparkles, ArrowRight, Zap } from 'lucide-react';
import { FlashDealCard } from './FlashDealCard';
import { ExclusiveDeal } from '../types';
import { Link } from 'react-router-dom';

interface ExclusiveDealsSectionProps {
  deals: ExclusiveDeal[];
  loading?: boolean;
}

export const ExclusiveDealsSection: React.FC<ExclusiveDealsSectionProps> = ({ deals, loading }) => {
  if (loading) {
     return (
        <div className="w-full flex gap-4 overflow-x-hidden p-1">
           {[1, 2].map(i => (
              <div key={i} className="w-full md:w-[600px] h-72 animate-pulse bg-white/5 rounded-[2rem]" />
           ))}
        </div>
     );
  }

  if (!Array.isArray(deals) || deals.length === 0) return null;

  return (
    <section className="space-y-6">
      <div className="flex items-center justify-between px-2">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-violet-600/20 flex items-center justify-center border border-violet-500/30">
            <Sparkles className="w-5 h-5 text-violet-400" />
          </div>
          <div>
            <h2 className="text-xl font-black text-white tracking-tight leading-tight">Exclusive Deals</h2>
            <div className="flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-violet-500 animate-pulse" />
              <p className="text-[10px] font-black text-zinc-500 uppercase tracking-widest">Flash Sale Active</p>
            </div>
          </div>
        </div>
        
        <Link 
          to="/marketplace" 
          className="flex items-center gap-2 text-[10px] font-black text-violet-400 uppercase tracking-widest hover:text-violet-300 transition-colors group"
        >
          View All Exclusive Drops
          <ArrowRight className="w-3 h-3 transition-transform group-hover:translate-x-1" />
        </Link>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        {deals.map((deal) => (
          <FlashDealCard key={deal.id} deal={deal} />
        ))}
      </div>

      {/* Trust Banner mini */}
      <div className="mx-2 p-3 rounded-2xl bg-violet-500/5 border border-violet-500/10 flex items-center justify-center gap-4">
        <div className="flex items-center gap-2">
          <Zap className="w-3 h-3 text-violet-400" />
          <span className="text-[9px] font-black text-violet-300 uppercase tracking-[0.2em]">Verified PK Store Exclusive</span>
        </div>
        <div className="w-1 h-1 rounded-full bg-violet-900" />
        <span className="text-[9px] font-bold text-zinc-500 uppercase tracking-widest">Real-time inventory lock</span>
      </div>
    </section>
  );
};
