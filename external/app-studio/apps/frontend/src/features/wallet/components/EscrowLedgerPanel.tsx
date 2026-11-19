import React, { useState } from 'react';
import {
  ShieldCheck,
  Clock,
  CheckCircle2,
  AlertTriangle,
  Lock,
  Calendar,
  X
} from 'lucide-react';
import { EscrowRecord, EscrowSummary } from '@/features/wallet/types/walletTypes';

interface EscrowLedgerPanelProps {
  summary: EscrowSummary;
  escrows: EscrowRecord[];
  isLoading?: boolean;
  isBn?: boolean;
  onReleaseEscrow: (escrowId: string) => Promise<void>;
  onDisputeEscrow: (escrowId: string, reason: string) => Promise<void>;
}

export const EscrowLedgerPanel: React.FC<EscrowLedgerPanelProps> = ({
  summary,
  escrows,
  isLoading = false,
  isBn = false,
  onReleaseEscrow,
  onDisputeEscrow
}) => {
  const [filterStatus, setFilterStatus] = useState<'all' | 'held' | 'released' | 'disputed'>('all');
  const [disputingId, setDisputingId] = useState<string | null>(null);
  const [disputeReason, setDisputeReason] = useState('');
  const [busyId, setBusyId] = useState<string | null>(null);
  const [statusFeedback, setStatusFeedback] = useState<string | null>(null);

  const filteredEscrows = escrows.filter((item) =>
    filterStatus === 'all' ? true : item.status === filterStatus
  );

  const handleRelease = async (escrowId: string) => {
    setBusyId(escrowId);
    try {
      await onReleaseEscrow(escrowId);
      setStatusFeedback(
        isBn
          ? 'ডেলিভারি নিশ্চিত হয়েছে এবং এসক্রো পেআউট ভেন্ডর ওয়ালেটে রিলিজ হয়েছে।'
          : 'Delivery confirmed. Escrow payout has been released to merchant wallet.'
      );
      setTimeout(() => setStatusFeedback(null), 4000);
    } finally {
      setBusyId(null);
    }
  };

  const handleConfirmDispute = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!disputingId || !disputeReason.trim()) return;
    setBusyId(disputingId);
    try {
      await onDisputeEscrow(disputingId, disputeReason.trim());
      setDisputingId(null);
      setDisputeReason('');
      setStatusFeedback(
        isBn
          ? 'ডিসপিউট রেকর্ড করা হয়েছে। সমাধান না হওয়া পর্যন্ত ফান্ড লক থাকবে।'
          : 'Dispute logged. Escrow funds remain locked pending review.'
      );
      setTimeout(() => setStatusFeedback(null), 4000);
    } finally {
      setBusyId(null);
    }
  };

  return (
    <div className="space-y-6 animate-fade-in">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div>
          <h3 className="text-lg font-black text-[var(--pm-text)] tracking-tight">
            {isBn ? 'এসক্রো সিকিউরিটি ও সেটেলমেন্ট লেজার' : 'Escrow Security & Settlement Ledger'}
          </h3>
          <p className="text-xs text-[var(--pm-muted)] mt-0.5">
            {isBn
              ? 'B2B ও রিটেল অর্ডারের ৭-দিনের ইন্সপেকশন উইন্ডো এবং পেআউট নিয়ন্ত্রণ'
              : '7-day inspection protection window, instant release & dispute arbitration'}
          </p>
        </div>

        <div className="flex items-center gap-2 text-xs text-[var(--pm-success)] font-semibold">
          <ShieldCheck className="w-4 h-4 shrink-0" />
          <span>{isBn ? '১০০% ক্রেতা ও বিক্রেতা সুরক্ষা' : '100% Buyer & Seller Protection'}</span>
        </div>
      </div>

      {statusFeedback && (
        <div className="p-3.5 rounded-[1.5rem] bg-[var(--pm-success-soft)] border border-[var(--pm-success)]/30 text-xs font-semibold text-[var(--pm-success)] flex items-center gap-2">
          <CheckCircle2 className="w-4 h-4 shrink-0" />
          <span>{statusFeedback}</span>
        </div>
      )}

      {/* 4-Column Escrow Summary Strip (Tabular Numerals) */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
        <div className="p-4 rounded-[1.5rem] bg-[var(--pm-surface)] border border-[var(--pm-border)]">
          <span className="text-[11px] font-semibold text-[var(--pm-muted)] block">
            {isBn ? 'এসক্রোতে লকড' : 'Total Held'}
          </span>
          <p className="text-lg font-mono tabular-nums font-black text-[var(--pm-warning)] mt-1">
            ৳{summary.totalHeld.toLocaleString()}
          </p>
        </div>

        <div className="p-4 rounded-[1.5rem] bg-[var(--pm-surface)] border border-[var(--pm-border)]">
          <span className="text-[11px] font-semibold text-[var(--pm-muted)] block">
            {isBn ? 'মোট রিলিজড' : 'Total Released'}
          </span>
          <p className="text-lg font-mono tabular-nums font-black text-[var(--pm-success)] mt-1">
            ৳{summary.totalReleased.toLocaleString()}
          </p>
        </div>

        <div className="p-4 rounded-[1.5rem] bg-[var(--pm-surface)] border border-[var(--pm-border)]">
          <span className="text-[11px] font-semibold text-[var(--pm-muted)] block">
            {isBn ? 'পরবর্তী পেআউট' : 'Next Scheduled'}
          </span>
          <p className="text-lg font-mono tabular-nums font-black text-[var(--pm-text)] mt-1">
            ৳{summary.nextPayoutAmount.toLocaleString()}
          </p>
        </div>

        <div className="p-4 rounded-[1.5rem] bg-[var(--pm-surface)] border border-[var(--pm-border)]">
          <span className="text-[11px] font-semibold text-[var(--pm-muted)] block">
            {isBn ? 'চলমান ডিসপিউট' : 'Active Disputes'}
          </span>
          <p className="text-lg font-mono tabular-nums font-black text-[var(--pm-danger)] mt-1">
            {summary.disputedCount}
          </p>
        </div>
      </div>

      {/* Filter Bar */}
      <div className="flex items-center gap-1.5 p-1 bg-[var(--pm-surface)] border border-[var(--pm-border)] rounded-[2rem] w-fit">
        {[
          { id: 'all', label: isBn ? 'সকল' : 'All' },
          { id: 'held', label: isBn ? 'হোল্ডড' : 'Held' },
          { id: 'released', label: isBn ? 'রিলিজড' : 'Released' },
          { id: 'disputed', label: isBn ? 'ডিসপিউট' : 'Disputed' }
        ].map((tab) => (
          <button
            key={tab.id}
            type="button"
            onClick={() => setFilterStatus(tab.id as any)}
            className={`px-3.5 py-1.5 rounded-[2rem] text-xs font-bold whitespace-nowrap transition-all active-scale cursor-pointer ${
              filterStatus === tab.id
                ? 'bg-[var(--pm-card)] text-[var(--pm-accent)] shadow-xs'
                : 'text-[var(--pm-muted)] hover:text-[var(--pm-text)]'
            }`}
          >
            {tab.label}
          </button>
        ))}
      </div>

      {/* Escrow Records List */}
      <div className="space-y-3">
        {isLoading && escrows.length === 0 ? (
          <div className="py-10 text-center text-xs text-[var(--pm-muted)]">
            {isBn ? 'এসক্রো তথ্য লোড হচ্ছে...' : 'Loading escrow ledger...'}
          </div>
        ) : filteredEscrows.length > 0 ? (
          filteredEscrows.map((esc) => {
            const releaseDateLabel = new Date(esc.releaseAt).toLocaleDateString();
            const isBusy = busyId === esc.id;

            return (
              <div
                key={esc.id}
                className="p-4 rounded-[1.5rem] bg-[var(--pm-surface)] border border-[var(--pm-border)] flex flex-col sm:flex-row sm:items-center justify-between gap-4"
              >
                <div className="space-y-1 min-w-0">
                  <div className="flex items-center gap-2 text-[11px] text-[var(--pm-muted)]">
                    <span className="font-mono font-bold text-[var(--pm-text)]">
                      {esc.id}
                    </span>
                    <span aria-hidden="true">·</span>
                    <span className="font-mono">{esc.orderId}</span>
                    <span aria-hidden="true">·</span>
                    <span
                      className={`font-bold flex items-center gap-1 ${
                        esc.status === 'released'
                          ? 'text-[var(--pm-success)]'
                          : esc.status === 'disputed'
                          ? 'text-[var(--pm-danger)]'
                          : 'text-[var(--pm-warning)]'
                      }`}
                    >
                      {esc.status === 'released' ? (
                        <CheckCircle2 className="w-3.5 h-3.5" />
                      ) : esc.status === 'disputed' ? (
                        <AlertTriangle className="w-3.5 h-3.5" />
                      ) : (
                        <Lock className="w-3.5 h-3.5" />
                      )}
                      {esc.status === 'held'
                        ? isBn
                          ? 'এসক্রো হোল্ডড'
                          : 'Held in Escrow'
                        : esc.status === 'released'
                        ? isBn
                          ? 'পেআউট রিলিজড'
                          : 'Released'
                        : isBn
                        ? 'ডিসপিউট লকড'
                        : 'Disputed'}
                    </span>
                  </div>

                  <h4 className="text-sm font-bold text-[var(--pm-text)] truncate">
                    {esc.title}
                  </h4>

                  <div className="flex flex-wrap items-center gap-2 text-xs text-[var(--pm-muted)]">
                    <span>{esc.sellerName}</span>
                    <span aria-hidden="true">·</span>
                    <span className="flex items-center gap-1 font-mono tabular-nums">
                      <Calendar className="w-3.5 h-3.5" />
                      {esc.status === 'released'
                        ? isBn
                          ? `রিলিজ: ${releaseDateLabel}`
                          : `Released ${releaseDateLabel}`
                        : isBn
                        ? `রিলিজ উইন্ডো: ${releaseDateLabel}`
                        : `Auto-release ${releaseDateLabel}`}
                    </span>
                  </div>

                  {esc.disputeReason && (
                    <p className="text-xs text-[var(--pm-danger)] pt-1">
                      {isBn ? 'কারণ:' : 'Reason:'} {esc.disputeReason}
                    </p>
                  )}
                </div>

                <div className="flex sm:flex-col items-center sm:items-end justify-between gap-2 shrink-0">
                  <span className="text-base font-mono tabular-nums font-black text-[var(--pm-text)]">
                    ৳{esc.amount.toLocaleString()}
                  </span>

                  {esc.status === 'held' && (
                    <div className="flex items-center gap-2">
                      <button
                        type="button"
                        disabled={isBusy}
                        onClick={() => void handleRelease(esc.id)}
                        className="px-3.5 py-1.5 rounded-[2rem] bg-[var(--pm-success)] hover:opacity-90 disabled:opacity-50 text-white text-xs font-bold whitespace-nowrap active-scale cursor-pointer"
                      >
                        {isBusy
                          ? '...'
                          : isBn
                          ? 'ডেলিভারি নিশ্চিত ও রিলিজ'
                          : 'Confirm & Release'}
                      </button>
                      <button
                        type="button"
                        disabled={isBusy}
                        onClick={() => setDisputingId(esc.id)}
                        className="px-3 py-1.5 rounded-[2rem] border border-[var(--pm-border)] hover:border-[var(--pm-danger)] text-[var(--pm-muted)] hover:text-[var(--pm-danger)] text-xs font-bold whitespace-nowrap active-scale cursor-pointer"
                      >
                        {isBn ? 'ডিসপিউট' : 'Dispute'}
                      </button>
                    </div>
                  )}
                </div>
              </div>
            );
          })
        ) : (
          <div className="py-12 text-center rounded-[1.5rem] border border-dashed border-[var(--pm-border)] space-y-2">
            <Clock className="w-8 h-8 text-[var(--pm-muted)] mx-auto" />
            <p className="text-xs font-semibold text-[var(--pm-muted)]">
              {isBn ? 'এই ক্যাটাগরিতে কোনো এসক্রো রেকর্ড নেই' : 'No escrow records match this filter'}
            </p>
          </div>
        )}
      </div>

      {/* Dispute Modal */}
      {disputingId && (
        <div className="fixed inset-0 z-60 flex items-center justify-center p-4 bg-black/70 backdrop-blur-xs">
          <form
            onSubmit={(e) => void handleConfirmDispute(e)}
            className="w-full max-w-md bg-[var(--pm-card)] text-[var(--pm-text)] rounded-[2rem] p-6 border border-[var(--pm-border)] shadow-2xl space-y-4"
          >
            <div className="flex items-center justify-between">
              <h4 className="text-sm font-black text-[var(--pm-text)] flex items-center gap-2">
                <AlertTriangle className="w-4 h-4 text-[var(--pm-danger)]" />
                <span>{isBn ? 'এসক্রো ডিসপিউট দাখিল করুন' : 'Raise Escrow Dispute'}</span>
              </h4>
              <button
                type="button"
                onClick={() => setDisputingId(null)}
                className="w-7 h-7 rounded-full bg-[var(--pm-surface)] text-[var(--pm-muted)] hover:text-[var(--pm-text)] flex items-center justify-center cursor-pointer"
              >
                <X className="w-3.5 h-3.5" />
              </button>
            </div>

            <p className="text-xs text-[var(--pm-muted)]">
              {isBn
                ? 'ডিসপিউট দাখিল করলে অটোমেটিক ভেন্ডর পেআউট স্থগিত থাকবে যতক্ষণ না অ্যাডমিন/আর্বিট্রেশন টিম সমাধান করে।'
                : 'Filing a dispute immediately freezes automatic vendor payout until arbitration is resolved.'}
            </p>

            <div>
              <label className="block text-xs font-bold text-[var(--pm-text)] mb-1.5">
                {isBn ? 'সমস্যার বিবরণ *' : 'Dispute Reason *'}
              </label>
              <textarea
                rows={3}
                required
                value={disputeReason}
                onChange={(e) => setDisputeReason(e.target.value)}
                placeholder={
                  isBn
                    ? 'যেমন: পণ্যের কোয়ালিটি নমুনার সাথে মিলছে না বা কার্টন সংখ্যা কম...'
                    : 'e.g. Received lot does not match approved sample GSM specification...'
                }
                className="w-full px-3.5 py-2.5 text-xs rounded-[1.25rem] bg-[var(--pm-input)] text-[var(--pm-text)] placeholder:text-[var(--pm-muted)] border border-[var(--pm-border)] outline-none focus:border-[var(--pm-danger)] resize-none"
              />
            </div>

            <div className="flex items-center justify-end gap-2 pt-2">
              <button
                type="button"
                onClick={() => setDisputingId(null)}
                className="px-4 py-2 rounded-[2rem] text-xs font-bold text-[var(--pm-muted)] hover:bg-[var(--pm-card-hover)] cursor-pointer"
              >
                {isBn ? 'বাতিল' : 'Cancel'}
              </button>
              <button
                type="submit"
                disabled={!disputeReason.trim() || busyId === disputingId}
                className="px-5 py-2 rounded-[2rem] bg-[var(--pm-danger)] hover:opacity-90 disabled:opacity-50 text-white text-xs font-bold active-scale cursor-pointer"
              >
                {isBn ? 'ফান্ড লক ও ডিসপিউট দিন' : 'Freeze Funds & Submit'}
              </button>
            </div>
          </form>
        </div>
      )}
    </div>
  );
};
