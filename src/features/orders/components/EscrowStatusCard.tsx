import React from 'react';
import { motion } from 'motion/react';
import { ShieldCheck, Info, AlertCircle, Lock, Unlock } from 'lucide-react';
import { Order } from '@/modules/orders/orderTrackingStore';
import { formatBDT } from '@/lib/format';
import { cn } from '@/lib/utils';

interface EscrowStatusCardProps {
  order: Order;
}

export const EscrowStatusCard: React.FC<EscrowStatusCardProps> = ({ order }) => {
  const { escrowStatus } = order;

  return (
    <motion.div 
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
      className="bg-[var(--pm-surface)]/20 border border-[var(--pm-border)] p-6 rounded-2xl flex flex-col gap-4 select-none"
    >
      <div className="flex items-center justify-between">
        <h3 className="text-xs uppercase tracking-wider text-[var(--pm-text-secondary)] font-bold flex items-center gap-2">
            <ShieldCheck className="w-4 h-4 text-cyan-400" /> Escrow Safe-Vault
        </h3>
        {escrowStatus.isReleased ? (
           <span className="text-[10px] font-black text-cyan-400 bg-cyan-500/10 px-2 py-0.5 rounded-full border border-cyan-500/10">
                FUNDS RELEASED
            </span>
        ) : (
            <span className="text-[10px] font-black text-amber-400 bg-amber-500/10 px-2 py-0.5 rounded-full border border-amber-500/10">
                ACTIVE BLOCK
            </span>
        )}
      </div>

      <div className="p-4 bg-black/30 rounded-xl border border-[var(--pm-border)] flex items-center justify-between">
         <div>
            <span className="text-[9px] text-[var(--pm-text-secondary)] uppercase font-bold block mb-1">Locked Settlement</span>
            <span className="text-xl font-mono font-black text-white">{formatBDT(escrowStatus.lockedAmount)}</span>
         </div>
         <div className={cn(
             "w-12 h-12 rounded-full border-2 flex items-center justify-center transition-all",
             escrowStatus.isReleased ? "border-cyan-400 text-cyan-400" : "border-amber-400/40 text-amber-400"
         )}>
             {escrowStatus.isReleased ? <Unlock className="w-5 h-5" /> : <Lock className="w-5 h-5" />}
         </div>
      </div>

      <div className="space-y-3">
         <div className="flex items-center justify-between text-[11px]">
            <span className="text-[var(--pm-text-secondary)]">Release Trigger</span>
            <span className="text-white font-bold">{escrowStatus.releaseCondition}</span>
         </div>
         <div className="flex items-center justify-between text-[11px]">
            <span className="text-[var(--pm-text-secondary)]">Refund Eligibility</span>
            <span className={cn("font-bold", escrowStatus.refundEligible ? "text-cyan-400" : "text-rose-400")}>
                {escrowStatus.refundEligible ? "Yes - Protected" : "Locked / Shipped"}
            </span>
         </div>
      </div>

      <div className="h-px bg-[var(--pm-border)] w-full" />

      <div className="flex gap-2 p-3 bg-zinc-800/10 rounded-xl text-[10px] text-[var(--pm-text-secondary)] leading-tight italic">
          <Info className="w-4 h-4 shrink-0 text-[var(--pm-accent)]" />
          Paikar Escrow ensures your funds are only released to the supplier after you confirm satisfactory delivery or after 72h of verification period.
      </div>
    </motion.div>
  );
};
