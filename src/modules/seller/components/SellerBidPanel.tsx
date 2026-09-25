import React from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Gavel, Clock, ChevronRight, FileText } from 'lucide-react';
import { SellerBid } from '@/modules/seller/sellerDashboardStore';
import { formatBDT } from '@/lib/format';
import { formatDistanceToNow } from 'date-fns';
import { cn } from '@/lib/utils';

interface Props {
  bids: SellerBid[];
}

export const SellerBidPanel: React.FC<Props> = ({ bids }) => {
  if (bids.length === 0) {
    return (
      <div className="p-8 rounded-3xl bg-white/[0.02] border border-white/5 border-dashed flex flex-col items-center justify-center text-center">
         <Gavel className="w-10 h-10 text-zinc-700 mb-4" />
         <p className="text-sm font-black uppercase text-zinc-500 tracking-widest">No Active Bids</p>
         <p className="text-[10px] text-zinc-600 mt-2 font-bold uppercase">Explore the Demand Portal to start bidding</p>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      <AnimatePresence initial={false}>
        {bids.map((bid, index) => (
          <motion.div
            key={bid.id}
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: index * 0.05 }}
            className="group relative p-6 rounded-[2.5rem] glass-3d hover:bg-white/[0.08] hover:border-primary/50 transition-all overflow-hidden"
          >
            <div className="absolute top-0 right-0 p-4 opacity-[0.02] group-hover:opacity-[0.05] transition-opacity pointer-events-none">
               <Gavel className="w-16 h-16 -rotate-12" />
            </div>

            <div className="flex flex-col gap-4">
               <div className="flex items-start justify-between">
                  <div className="min-w-0 flex-1">
                     <h4 className="text-sm font-black text-white group-hover:text-[var(--pm-accent)] transition-colors line-clamp-1 mb-1">{bid.demandTitle}</h4>
                     <div className="flex items-center gap-3">
                        <div className="flex items-center gap-1 text-[10px] text-zinc-500 font-bold uppercase">
                           <Clock className="w-3 h-3" />
                           {formatDistanceToNow(new Date(bid.createdAt), { addSuffix: true })}
                        </div>
                        <div className="flex items-center gap-1 text-[10px] text-zinc-500 font-bold uppercase">
                           <FileText className="w-3 h-3" />
                           ID: {bid.demandId}
                        </div>
                     </div>
                  </div>
                  <div className="text-right">
                     <p className="text-sm font-black text-[var(--pm-accent)]">{formatBDT(bid.amount)}</p>
                     <span className={cn(
                        "text-[9px] font-black uppercase tracking-tighter px-2 py-0.5 rounded-full",
                        bid.status === 'pending' ? "bg-amber-500/10 text-amber-400" :
                        bid.status === 'accepted' ? "bg-[var(--pm-accent)]/10 text-[var(--pm-accent)]" :
                        "bg-rose-500/10 text-rose-400"
                     )}>
                        {bid.status}
                     </span>
                  </div>
               </div>

               <div className="p-3 rounded-xl bg-black/20 border border-white/5">
                  <p className="text-[11px] text-zinc-400 leading-relaxed font-medium line-clamp-2">
                     <span className="text-zinc-600 font-black uppercase tracking-widest mr-2">Your Proposal:</span>
                     "{bid.message}"
                  </p>
               </div>

               <button className="flex items-center gap-2 text-[10px] font-black uppercase tracking-widest text-zinc-500 hover:text-[var(--pm-accent)] transition-colors w-fit">
                  View Full Quotation Details <ChevronRight className="w-3 h-3" />
               </button>
            </div>
          </motion.div>
        ))}
      </AnimatePresence>
    </div>
  );
};
