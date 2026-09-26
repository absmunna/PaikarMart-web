import React from 'react';
import { useLanguage } from "@/features/language/LanguageContext";
import { Shield, Info, Hourglass, CheckCircle2 } from 'lucide-react';
import { motion } from 'motion/react';
import { cn } from '@/lib/utils';

export interface EscrowItem {
  id: string;
  orderId: string;
  amount: number;
  status: 'held' | 'released' | 'disputed';
  releaseDate: string;
}

export const EscrowPanel: React.FC<{ items: EscrowItem[] }> = ({ items }) => {
  const { isBn } = useLanguage();

  return (
    <div className="bg-zinc-950/50 border border-violet-500/10 rounded-3xl p-5 overflow-hidden relative">
      <div className="absolute top-0 right-0 p-4 opacity-5">
        <Shield size={64} className="text-violet-500" />
      </div>

      <div className="flex items-center gap-2 mb-4">
        <Shield size={18} className="text-violet-400" />
        <h3 className="text-sm font-black text-white tracking-tight">
          {isBn ? "এসক্রো (নিরাপত্তা হোল্ড)" : "Escrow (Security Hold)"}
        </h3>
      </div>

      <div className="space-y-3">
        {items.map((item) => (
          <motion.div 
            key={item.id}
            initial={{ opacity: 0, scale: 0.98 }}
            animate={{ opacity: 1, scale: 1 }}
            className="p-3 bg-white/5 border border-white/5 rounded-2xl flex items-center justify-between"
          >
            <div className="flex items-center gap-3">
              <div className={cn(
                "w-8 h-8 rounded-lg flex items-center justify-center",
                item.status === 'held' ? "bg-amber-500/10 text-amber-500" : "bg-cyan-500/10 text-cyan-500"
              )}>
                {item.status === 'held' ? <Hourglass size={16} /> : <CheckCircle2 size={16} />}
              </div>
              <div>
                <p className="text-[11px] font-bold text-white">
                  {isBn ? `অর্ডার ${item.orderId}` : `Order ${item.orderId}`}
                </p>
                <div className="flex items-center gap-1.5 mt-0.5">
                  <span className="text-[9px] text-zinc-500 font-medium">
                    {isBn ? `মুক্ত হবে: ${item.releaseDate}` : `Release: ${item.releaseDate}`}
                  </span>
                </div>
              </div>
            </div>
            <div className="text-right">
              <p className="text-[12px] font-black text-white">৳{item.amount.toLocaleString()}</p>
              <div className={cn(
                "text-[8px] font-black uppercase tracking-widest px-1.5 py-0.5 rounded-full inline-block mt-1",
                item.status === 'held' ? "bg-amber-500/10 text-amber-500" : "bg-cyan-500/10 text-cyan-500"
              )}>
                {item.status === 'held' ? (isBn ? "হোল্ড করা" : "held") : (isBn ? "মুক্ত করা" : "released")}
              </div>
            </div>
          </motion.div>
        ))}

        {items.length === 0 && (
          <div className="text-center py-4">
            <p className="text-[10px] text-zinc-600 font-bold uppercase tracking-widest">
              {isBn ? "এসক্রোতে কোনো ফান্ড নেই" : "No funds in escrow"}
            </p>
          </div>
        )}
      </div>

      <div className="mt-4 p-3 bg-violet-500/5 border border-violet-500/10 rounded-xl flex items-start gap-2">
        <Info size={14} className="text-violet-400 mt-0.5" />
        <p className="text-[10px] text-violet-300 leading-normal">
          {isBn ? "গ্রাহক সন্তুষ্টি নিশ্চিত করতে ডেলিভারির পর ৩-৫ দিনের জন্য ফান্ড নিরাপদে জমা রাখা হয় এবং এরপর আপনার ওয়ালেটে রিলিজ করা হয়।" : "Funds are held for 3-5 days after delivery to ensure customer satisfaction before being released to your wallet."}
        </p>
      </div>
    </div>
  );
};
