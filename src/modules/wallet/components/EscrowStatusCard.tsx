import React from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'motion/react';
import { 
  ShieldCheck, 
  Clock, 
  Calendar, 
  TrendingUp, 
  ArrowUpRight, 
  Info,
  ChevronRight,
  Wallet
} from 'lucide-react';
import { cn } from '@lib/utils';
import { formatBDT } from '@lib/format';
import { EscrowSummary, EscrowTransaction } from '../types/escrow';
import { GlassCard } from '@ui/GlassCard';
import { Button } from '@ui/button';

export interface EscrowStatusCardProps {
  summary: EscrowSummary;
  recentTransactions: EscrowTransaction[];
  onViewDetails?: () => void;
}

export const EscrowStatusCard: React.FC<EscrowStatusCardProps> = ({ 
  summary, 
  recentTransactions,
  onViewDetails 
}) => {
  return (
    <GlassCard className="overflow-hidden border-violet-500/10">
      <div className="p-6">
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-violet-500/10 flex items-center justify-center border border-violet-500/20">
              <ShieldCheck className="w-5 h-5 text-violet-400" />
            </div>
            <div>
              <h3 className="text-white font-black text-lg tracking-tight">Escrow Transparency</h3>
              <p className="text-zinc-500 text-xs font-bold uppercase tracking-widest">Merchant Trust System</p>
            </div>
          </div>
          <Button 
            variant="ghost" 
            size="sm" 
            onClick={onViewDetails}
            className="text-violet-400 hover:text-violet-300 hover:bg-violet-500/5 gap-2"
          >
            Detailed Ledger
            <ChevronRight className="w-4 h-4" />
          </Button>
        </div>

        {/* Core Stats Grid */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
          <div className="p-4 rounded-2xl bg-white/5 border border-white/5">
            <p className="text-[10px] font-black text-zinc-500 uppercase tracking-widest mb-1">Total Held</p>
            <p className="text-xl font-black text-white">{formatBDT(summary.totalHeld)}</p>
            <div className="flex items-center gap-1 mt-2">
              <Clock className="w-3 h-3 text-amber-500" />
              <span className="text-[9px] text-amber-500/80 font-bold uppercase">Security Hold</span>
            </div>
          </div>

          <div className="p-4 rounded-2xl bg-white/5 border border-white/5">
            <p className="text-[10px] font-black text-zinc-500 uppercase tracking-widest mb-1">Released</p>
            <p className="text-xl font-black text-cyan-400">{formatBDT(summary.totalReleased)}</p>
            <div className="flex items-center gap-1 mt-2">
              <TrendingUp className="w-3 h-3 text-cyan-500" />
              <span className="text-[9px] text-cyan-500/80 font-bold uppercase">+12.5% this week</span>
            </div>
          </div>

          <div className="p-4 rounded-2xl bg-white/5 border border-white/5 bg-violet-500/[0.03]">
            <p className="text-[10px] font-black text-violet-400 uppercase tracking-widest mb-1">Next Payout</p>
            <p className="text-xl font-black text-white">{formatBDT(summary.nextPayoutAmount)}</p>
            <div className="flex items-center gap-1 mt-2">
              <Calendar className="w-3 h-3 text-violet-400" />
              <span className="text-[9px] text-violet-400/80 font-bold uppercase">{summary.nextPayoutDate || 'Calculating...'}</span>
            </div>
          </div>

          <div className="p-4 rounded-2xl bg-white/5 border border-white/5">
            <p className="text-[10px] font-black text-zinc-500 uppercase tracking-widest mb-1">Pending Withdraw</p>
            <p className="text-xl font-black text-white">{formatBDT(summary.pendingWithdrawal)}</p>
            <div className="flex items-center gap-1 mt-2">
              <Wallet className="w-3 h-3 text-zinc-400" />
              <span className="text-[9px] text-zinc-500 font-bold uppercase">Processing</span>
            </div>
          </div>
        </div>

        {/* Release Timeline / Upcoming Payouts */}
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <h4 className="text-sm font-black text-white tracking-tight">Escrow Release Timeline</h4>
            <div className="flex items-center gap-1.5 px-2 py-1 rounded-md bg-white/5 border border-white/10">
              <Info className="w-3 h-3 text-violet-400" />
              <span className="text-[9px] text-zinc-400 font-bold">Payouts happen at 10 AM Daily</span>
            </div>
          </div>

          <div className="grid gap-3">
            {recentTransactions.map((tx, idx) => (
              <motion.div
                key={tx.id}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ type: 'spring', damping: 25, stiffness: 200, delay: idx * 0.05 }}
                className="group flex items-center justify-between p-4 rounded-2xl bg-white/[0.02] border border-white/5 hover:bg-white/[0.04] hover:border-white/10 transition-all cursor-default"
              >
                <div className="flex items-center gap-4">
                  <div className={cn(
                    "w-10 h-10 rounded-xl flex items-center justify-center border",
                    tx.status === 'released' 
                      ? "bg-cyan-500/10 border-cyan-500/20 text-cyan-400" 
                      : "bg-white/5 border-white/10 text-zinc-400"
                  )}>
                    {tx.status === 'released' ? <ShieldCheck className="w-5 h-5" /> : <Clock className="w-5 h-5 text-amber-500" />}
                  </div>
                  <div>
                    <p className="text-white font-bold text-sm tracking-tight">{tx.description}</p>
                    <div className="flex items-center gap-2 mt-0.5">
                      <span className="text-[10px] text-zinc-500 font-medium">Order #{tx.orderId}</span>
                      <span className="w-1 h-1 rounded-full bg-zinc-700" />
                      <span className="text-[10px] text-zinc-400 font-bold uppercase tracking-tight">
                        {tx.status === 'released' ? 'Released on' : 'Scheduled for'} {tx.releaseDate}
                      </span>
                    </div>
                  </div>
                </div>
                <div className="text-right">
                  <p className={cn(
                    "text-sm font-black tracking-tight",
                    tx.status === 'released' ? "text-cyan-400" : "text-white"
                  )}>
                    {tx.status === 'released' ? '+' : ''}{formatBDT(tx.amount)}
                  </p>
                  <div className={cn(
                    "text-[8px] font-black uppercase tracking-[0.2em] px-2 py-0.5 rounded-full inline-block mt-1.5",
                    tx.status === 'released' ? "bg-cyan-500/10 text-cyan-500" : "bg-amber-500/10 text-amber-500"
                  )}>
                    {tx.status.replace('_', ' ')}
                  </div>
                </div>
              </motion.div>
            ))}

            {recentTransactions.length === 0 && (
              <div className="text-center py-8 rounded-2xl border-2 border-dashed border-white/5">
                <p className="text-zinc-600 text-xs font-black uppercase tracking-widest">No active escrow records</p>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Footer Info */}
      <div className="px-6 py-4 bg-violet-500/5 border-t border-violet-500/10 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <ShieldCheck className="w-4 h-4 text-violet-400" />
          <p className="text-[11px] text-violet-300 font-medium">
            Protected by Paikar Mart Escrow Protocol v2.4
          </p>
        </div>
        <Link to="/faq" className="text-[10px] text-violet-400 font-black uppercase tracking-widest hover:text-violet-300 transition-colors">
          Learn how escrow works
        </Link>
      </div>
    </GlassCard>
  );
};
