import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  Zap, 
  Plus, 
  Trash2, 
  Clock, 
  Flame, 
  TrendingUp, 
  Package, 
  Tag,
  AlertCircle,
  ChevronRight,
  Sparkles,
  X
} from 'lucide-react';
import { cn } from '@lib/utils';
import { formatBDT } from '@lib/format';
import { ExclusiveDeal } from '../types';
import { GlassCard } from '@ui/GlassCard';
import { Button } from '@ui/button';
import { toast } from 'sonner';
import { useSellerDeals } from '../hooks/useSellerDeals';

export const SellerDealManager: React.FC = () => {
  const [isCreating, setIsCreating] = useState(false);
  const { deals, loading } = useSellerDeals();

  if (loading) return <div className="p-10 text-center text-zinc-500 italic">প্রসেস হচ্ছে...</div>;

  return (
    <div className="space-y-6">
      {/* Header Panel */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h2 className="text-2xl font-black text-white tracking-tight flex items-center gap-3">
            <Zap className="w-8 h-8 text-violet-400 fill-violet-400/20" />
            Exclusive Deal Manager
          </h2>
          <p className="text-zinc-500 text-sm font-medium mt-1">
            Subsidize your inventory to drive rapid sales volume.
          </p>
        </div>
        <Button 
          onClick={() => setIsCreating(true)}
          className="bg-violet-600 hover:bg-violet-500 text-white font-black uppercase tracking-tight gap-2 h-12 px-6 rounded-2xl transition-all active:scale-95"
        >
          <Plus className="w-5 h-5" />
          Create New Drop
        </Button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {Array.isArray(deals) && deals.map((deal) => (
          <GlassCard key={deal.id} className="relative overflow-hidden group">
            <div className="p-5">
              <div className="flex items-center justify-between mb-4">
                <div className="px-2 py-1 rounded-md bg-violet-500/10 border border-violet-500/20 text-[10px] font-black text-violet-400 uppercase tracking-widest">
                  Active Flash Sale
                </div>
                <button className="text-zinc-500 hover:text-red-400 transition-colors">
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>

              <h3 className="text-white font-bold text-lg mb-2 truncate">
                {deal.product?.title || 'Loading...'}
              </h3>

              <div className="grid grid-cols-2 gap-3 mb-6">
                <div className="p-3 rounded-xl bg-white/5 border border-white/5">
                  <p className="text-[10px] text-zinc-500 font-bold uppercase mb-1">Deal Price</p>
                  <p className="text-lg font-black text-cyan-400">{formatBDT(deal.dealPrice)}</p>
                </div>
                <div className="p-3 rounded-xl bg-white/5 border border-white/5">
                  <p className="text-[10px] text-zinc-500 font-bold uppercase mb-1">Remaining</p>
                  <p className="text-lg font-black text-white">{deal.currentStock}/{deal.initialStock}</p>
                </div>
              </div>

              <div className="space-y-4">
                 <div className="h-1.5 w-full bg-white/5 rounded-full overflow-hidden">
                    <motion.div 
                      initial={{ width: 0 }}
                      animate={{ width: `${(deal.currentStock / deal.initialStock) * 100}%` }}
                      className="h-full bg-violet-500 rounded-full" 
                    />
                 </div>
                 <div className="flex items-center justify-between text-[10px] font-black text-zinc-500 uppercase tracking-widest">
                    <span className="flex items-center gap-1">
                      <Clock className="w-3 h-3" />
                      Expires in 4h 20m
                    </span>
                    <span className="text-violet-400">{Math.round((deal.currentStock / deal.initialStock) * 100)}% Available</span>
                 </div>
              </div>
            </div>
            
            <div className="p-4 bg-white/[0.02] border-t border-white/5 flex items-center justify-between">
              <div className="flex items-center gap-2">
                <TrendingUp className="w-4 h-4 text-cyan-500" />
                <span className="text-xs font-bold text-white">Active</span>
              </div>
              <ChevronRight className="w-4 h-4 text-zinc-600" />
            </div>
          </GlassCard>
        ))}

        {deals.length === 0 && (
          <div className="lg:col-span-3 py-20 text-center space-y-4">
             <div className="w-20 h-20 rounded-full bg-white/5 flex items-center justify-center mx-auto border-2 border-dashed border-white/10">
                <Zap className="w-10 h-10 text-zinc-700" />
             </div>
             <div>
                <p className="text-white font-black text-lg">No Active Drops</p>
                <p className="text-zinc-500 text-sm italic">Create your first flash deal to boost store traffic.</p>
             </div>
          </div>
        )}
      </div>

      {/* Creation Modal / Overlay */}
      <AnimatePresence>
        {isCreating && (
          <div className="fixed inset-0 z-[100] flex items-center justify-center p-6 sm:p-4">
            <motion.div 
              initial={{ opacity: 0 }} 
              animate={{ opacity: 1 }} 
              exit={{ opacity: 0 }}
              onClick={() => setIsCreating(false)}
              className="absolute inset-0 bg-black/80 backdrop-blur-sm" 
            />
            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 20 }}
              className="relative w-full max-w-lg"
            >
              <GlassCard className="overflow-hidden border-violet-500/20">
                <div className="p-6 border-b border-white/5 flex items-center justify-between bg-violet-500/5">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-xl bg-violet-600/20 flex items-center justify-center border border-violet-500/30">
                       <Plus className="w-6 h-6 text-violet-400" />
                    </div>
                    <div>
                       <h3 className="text-white font-black text-lg tracking-tight">Create Exclusive Drop</h3>
                       <p className="text-[10px] text-zinc-500 font-bold uppercase tracking-widest">Promotion Engine v2.0</p>
                    </div>
                  </div>
                  <button onClick={() => setIsCreating(false)} className="p-2 rounded-full hover:bg-white/5 text-zinc-500 hover:text-white transition-colors">
                     <X className="w-5 h-5" />
                  </button>
                </div>

                <div className="p-6 space-y-6">
                  <div className="p-4 rounded-2xl bg-amber-500/5 border border-amber-500/20 flex gap-3">
                    <AlertCircle className="w-5 h-5 text-amber-500 shrink-0" />
                    <p className="text-[10px] text-amber-500/80 font-bold leading-relaxed">
                      This module is currently in development.
                    </p>
                  </div>
                </div>
              </GlassCard>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
};
