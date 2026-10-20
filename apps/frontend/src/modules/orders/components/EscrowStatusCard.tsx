import React, { useState } from 'react';
import { motion } from 'motion/react';
import { 
  ShieldCheck, Info, AlertCircle, Lock, Unlock, 
  CheckCircle2, Clock, AlertTriangle, MessageSquare, Loader2
} from 'lucide-react';
import { Order, useOrderTrackingStore } from '@/modules/orders';
import { formatBDT } from '@/lib/format';
import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/button';
import { toast } from 'sonner';

interface EscrowStatusCardProps {
  order: Order;
}

export const EscrowStatusCard: React.FC<EscrowStatusCardProps> = ({ order }) => {
  const { escrowStatus } = order;
  const { releaseEscrow, raiseDispute } = useOrderTrackingStore();

  const [isReleasing, setIsReleasing] = useState(false);
  const [showDisputeModal, setShowDisputeModal] = useState(false);
  const [disputeReason, setDisputeReason] = useState('');
  const [isSubmittingDispute, setIsSubmittingDispute] = useState(false);

  const isDisputed = escrowStatus.disputeStatus === 'opened';

  const handleConfirmRelease = async () => {
    setIsReleasing(true);
    try {
      await releaseEscrow(order.id);
      toast.success('এসক্রো ব্যালেন্স সফলভাবে বিক্রেতার একাউন্টে রিলিজ করা হয়েছে!');
    } catch {
      toast.error('এসক্রো রিলিজ প্রক্রিয়া সম্পন্ন করা যায়নি');
    } finally {
      setIsReleasing(false);
    }
  };

  const handleDisputeSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!disputeReason.trim()) {
      toast.error('দয়া করে সমস্যার বিস্তারিত বিবরণ দিন');
      return;
    }
    setIsSubmittingDispute(true);
    try {
      await raiseDispute(order.id, disputeReason.trim());
      toast.success('ডিসপুট সফলভাবে দাখিল হয়েছে। কমপ্লায়েন্স টীম পর্যালোচনা করছে।');
      setShowDisputeModal(false);
      setDisputeReason('');
    } catch {
      toast.error('ডিসপুট দাখিল ব্যর্থ হয়েছে');
    } finally {
      setIsSubmittingDispute(false);
    }
  };

  return (
    <motion.div 
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
      className="bg-[var(--pm-surface)]/20 border border-[var(--pm-border)] p-5 sm:p-6 rounded-2xl flex flex-col gap-4 select-none text-left"
    >
      <div className="flex items-center justify-between">
        <h3 className="text-xs uppercase tracking-wider text-[var(--pm-text-secondary)] font-bold flex items-center gap-2">
          <ShieldCheck className="w-4 h-4 text-cyan-400" /> Escrow Safe-Vault (নিরাপদ এসক্রো ভল্ট)
        </h3>
        {escrowStatus.isReleased ? (
          <span className="text-[10px] font-black text-cyan-400 bg-cyan-500/10 px-2.5 py-0.5 rounded-full border border-cyan-500/20">
            FUNDS RELEASED (রিলিজড)
          </span>
        ) : isDisputed ? (
          <span className="text-[10px] font-black text-rose-400 bg-rose-500/10 px-2.5 py-0.5 rounded-full border border-rose-500/20">
            DISPUTE ACTIVE (ডিসপুট)
          </span>
        ) : (
          <span className="text-[10px] font-black text-amber-400 bg-amber-500/10 px-2.5 py-0.5 rounded-full border border-amber-500/20">
            7-DAY INSPECTION (সুরক্ষিত)
          </span>
        )}
      </div>

      <div className="p-4 bg-black/40 rounded-xl border border-[var(--pm-border)] flex items-center justify-between">
        <div>
          <span className="text-[9px] text-[var(--pm-text-secondary)] uppercase font-bold block mb-1">
            Locked Settlement Amount
          </span>
          <span className="text-xl font-mono font-black text-white">
            {formatBDT(escrowStatus.lockedAmount || order.total)}
          </span>
        </div>
        <div className={cn(
          "w-12 h-12 rounded-2xl border flex items-center justify-center transition-all",
          escrowStatus.isReleased 
            ? "border-cyan-400/30 bg-cyan-400/10 text-cyan-400" 
            : isDisputed
            ? "border-rose-400/30 bg-rose-400/10 text-rose-400"
            : "border-amber-400/30 bg-amber-400/10 text-amber-400"
        )}>
          {escrowStatus.isReleased ? <Unlock className="w-5 h-5" /> : isDisputed ? <AlertTriangle className="w-5 h-5" /> : <Lock className="w-5 h-5" />}
        </div>
      </div>

      {/* Inspection condition and timer */}
      <div className="space-y-2.5 text-xs">
        <div className="flex items-center justify-between">
          <span className="text-[var(--pm-text-secondary)]">রিলিজ শর্ত:</span>
          <span className="text-white font-bold text-right max-w-[240px] truncate">
            {escrowStatus.releaseCondition}
          </span>
        </div>
        <div className="flex items-center justify-between">
          <span className="text-[var(--pm-text-secondary)]">রিফান্ড সুরক্ষা:</span>
          <span className={cn("font-bold", escrowStatus.refundEligible ? "text-cyan-400" : "text-zinc-500")}>
            {escrowStatus.refundEligible ? "✓ ১০০% সুরক্ষাপ্রাপ্ত (Protected)" : "লকড / ট্রানজিট সম্পন্ন"}
          </span>
        </div>
      </div>

      {/* Disputed Alert Banner */}
      {isDisputed && (
        <div className="p-3 bg-rose-500/10 border border-rose-500/20 rounded-xl text-xs text-rose-300 space-y-1">
          <div className="flex items-center gap-1.5 font-bold">
            <AlertTriangle className="w-4 h-4 text-rose-400" />
            <span>ডিসপুট রিভিউ সক্রিয় রয়েছে</span>
          </div>
          <p className="text-[10px] text-rose-300/80">
            কারণ: {escrowStatus.disputeReason || 'পণ্য ক্ষতিগ্রস্থ বা অমিল'}. পেইকারমার্ট কমপ্লায়েন্স টীম ৪৮ ঘণ্টার মধ্যে সমাধান প্রদান করবে।
          </p>
        </div>
      )}

      {/* Action Buttons for Buyer if funds not released yet */}
      {!escrowStatus.isReleased && !isDisputed && (
        <div className="pt-2 flex flex-col sm:flex-row gap-2.5">
          <Button
            type="button"
            onClick={handleConfirmRelease}
            disabled={isReleasing}
            className="flex-1 h-11 bg-cyan-400 hover:bg-cyan-500 text-black text-xs font-black uppercase tracking-wider rounded-xl shadow-md shadow-cyan-500/15"
          >
            {isReleasing ? (
              <>
                <Loader2 className="w-4 h-4 animate-spin" />
                রিলিজ হচ্ছে...
              </>
            ) : (
              <>
                <CheckCircle2 className="w-4 h-4" />
                পণ্য পেয়েছি — এসক্রো রিলিজ
              </>
            )}
          </Button>

          <Button
            type="button"
            variant="outline"
            onClick={() => setShowDisputeModal(true)}
            className="h-11 px-4 bg-white/5 border-white/10 hover:bg-rose-500/10 hover:border-rose-500/30 hover:text-rose-400 text-zinc-300 text-xs font-bold uppercase rounded-xl transition-colors"
          >
            <AlertCircle className="w-4 h-4" />
            অভিযোগ / ডিসপুট
          </Button>
        </div>
      )}

      {escrowStatus.isReleased && (
        <div className="p-3 bg-cyan-500/10 border border-cyan-500/20 rounded-xl text-xs text-cyan-300 flex items-center gap-2">
          <CheckCircle2 className="w-4 h-4 text-cyan-400 shrink-0" />
          <span>এসক্রো সেটেলমেন্ট সফলভাবে বিক্রেতার ওয়ালেটে স্থানান্তরিত হয়েছে। লেনদেন সম্পন্ন।</span>
        </div>
      )}

      <div className="h-px bg-[var(--pm-border)] w-full" />

      <div className="flex gap-2 p-3 bg-zinc-800/10 rounded-xl text-[10px] text-[var(--pm-text-secondary)] leading-tight italic">
        <Info className="w-4 h-4 shrink-0 text-cyan-400" />
        পেইকারমার্ট এসক্রো পলিসি: ডেলিভারি গ্রহণের পর আপনার কাছে ৭ দিনের ইন্সপেকশন উইন্ডো থাকে। আপনি সন্তোষজনক ডেলিভারি নিশ্চিত করলেই কেবল বিক্রেতাকে অর্থ প্রদান করা হয়।
      </div>

      {/* Dispute Modal */}
      {showDisputeModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-sm">
          <div className="bg-[#0e1017] border border-white/10 rounded-2xl w-full max-w-md p-6 space-y-4 shadow-2xl">
            <div className="flex items-center justify-between border-b border-white/5 pb-3">
              <h4 className="text-sm font-black text-white flex items-center gap-2">
                <AlertCircle className="w-4 h-4 text-rose-400" />
                ৭-দিনের ইন্সপেকশন ডিসপুট দাখিল
              </h4>
              <button 
                onClick={() => setShowDisputeModal(false)}
                className="text-zinc-500 hover:text-white text-xs font-bold"
              >
                ✕
              </button>
            </div>

            <p className="text-xs text-zinc-400">
              পণ্য ক্ষতিগ্রস্ত, অসম্পূর্ণ বা বর্ণনার সাথে অমিল থাকলে অভিযোগ দিন। সমাধান না হওয়া পর্যন্ত এসক্রো ব্যালেন্স হোল্ড থাকবে।
            </p>

            <form onSubmit={handleDisputeSubmit} className="space-y-4">
              <div>
                <label className="block text-[10px] uppercase font-bold text-zinc-400 mb-1.5">
                  সমস্যার বিবরণ
                </label>
                <textarea
                  rows={3}
                  value={disputeReason}
                  onChange={(e) => setDisputeReason(e.target.value)}
                  placeholder="যেমন: কাপড়ে ডিফেক্ট রয়েছে অথবা লটের ৫০ পিসের জায়গায় ৪৫ পিস পাওয়া গেছে..."
                  className="w-full bg-black/40 border border-white/10 rounded-xl p-3 text-xs text-white placeholder-zinc-500 focus:outline-none focus:border-rose-400 transition-colors resize-none"
                />
              </div>

              <div className="flex gap-2.5">
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => setShowDisputeModal(false)}
                  className="flex-1 h-10 rounded-xl bg-white/5 border-white/10 text-xs font-bold text-zinc-300 hover:text-white"
                >
                  বাতিল
                </Button>
                <Button
                  type="submit"
                  disabled={isSubmittingDispute}
                  className="flex-1 h-10 rounded-xl bg-rose-500 hover:bg-rose-600 text-white text-xs font-black uppercase tracking-wider"
                >
                  {isSubmittingDispute ? <Loader2 className="w-4 h-4 animate-spin" /> : 'ডিসপুট দাখিল করুন'}
                </Button>
              </div>
            </form>
          </div>
        </div>
      )}
    </motion.div>
  );
};
