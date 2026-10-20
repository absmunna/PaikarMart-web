import React, { useState } from 'react';
import { 
  ShieldCheck, AlertTriangle, ArrowUpRight, Search, 
  RotateCcw, CheckCircle2, Clock, DollarSign, Filter, RefreshCw
} from 'lucide-react';
import { useAdminGovernanceStore, EscrowItem } from '@/modules/admin';
import { toast } from 'sonner';

export const EscrowManagementPanel: React.FC = () => {
  const { escrows, releaseEscrowAction, refundEscrowAction, isLoading, fetchAllAdminData } = useAdminGovernanceStore();
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState<'all' | 'held' | 'disputed' | 'released' | 'refunded'>('all');
  const [actionLoadingId, setActionLoadingId] = useState<string | null>(null);
  const [disputeModalItem, setDisputeModalItem] = useState<EscrowItem | null>(null);
  const [refundReason, setRefundReason] = useState('');

  const filteredEscrows = escrows.filter(item => {
    const matchesSearch = 
      item.orderId.toLowerCase().includes(searchQuery.toLowerCase()) ||
      item.buyer.toLowerCase().includes(searchQuery.toLowerCase()) ||
      item.vendor.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesStatus = statusFilter === 'all' || item.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  const handleRelease = async (item: EscrowItem) => {
    setActionLoadingId(item.id);
    try {
      const ok = await releaseEscrowAction(item.id);
      if (ok) {
        toast.success(`অর্ডার #${item.orderId} এর ৳ ${item.amount.toLocaleString()} ভেন্ডর ওয়ালেটে সফলভাবে রিলিজ করা হয়েছে!`);
      }
    } catch (e) {
      toast.error('এসক্রো রিলিজ করতে সমস্যা হয়েছে');
    } finally {
      setActionLoadingId(null);
    }
  };

  const handleRefundConfirm = async () => {
    if (!disputeModalItem) return;
    setActionLoadingId(disputeModalItem.id);
    try {
      const ok = await refundEscrowAction(disputeModalItem.id, refundReason);
      if (ok) {
        toast.success(`অর্ডার #${disputeModalItem.orderId} এর ৳ ${disputeModalItem.amount.toLocaleString()} ক্রেতার ওয়ালেটে রিফান্ড করা হয়েছে!`);
        setDisputeModalItem(null);
        setRefundReason('');
      }
    } catch (e) {
      toast.error('রিফান্ড সম্পন্ন করতে সমস্যা হয়েছে');
    } finally {
      setActionLoadingId(null);
    }
  };

  const totalHeld = escrows.filter(e => e.status === 'held').reduce((acc, curr) => acc + curr.amount, 0);
  const totalDisputed = escrows.filter(e => e.status === 'disputed').reduce((acc, curr) => acc + curr.amount, 0);

  return (
    <div className="space-y-6">
      {/* Top Escrow Financial Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="p-4 rounded-2xl bg-[var(--pm-surface)] border border-[var(--pm-border)] flex items-center justify-between">
          <div>
            <p className="text-xs text-[var(--pm-text-muted)] font-medium">সক্রিয় এসক্রো ফান্ড (Held in Vault)</p>
            <p className="text-xl font-bold font-mono tabular-nums text-[var(--pm-text)] mt-1">
              ৳ {totalHeld.toLocaleString()}
            </p>
            <p className="text-[11px] text-zinc-500 mt-1">
              {escrows.filter(e => e.status === 'held').length} টি অর্ডার অডিট ও ডেলিভারি উইন্ডোতে
            </p>
          </div>
          <div className="w-10 h-10 rounded-xl bg-amber-500/10 text-amber-500 flex items-center justify-center">
            <Clock className="w-5 h-5" />
          </div>
        </div>

        <div className="p-4 rounded-2xl bg-[var(--pm-surface)] border border-[var(--pm-border)] flex items-center justify-between">
          <div>
            <p className="text-xs text-[var(--pm-text-muted)] font-medium">ডিসপুট লকড ফান্ড (Under Dispute)</p>
            <p className="text-xl font-bold font-mono tabular-nums text-rose-500 mt-1">
              ৳ {totalDisputed.toLocaleString()}
            </p>
            <p className="text-[11px] text-zinc-500 mt-1">
              {escrows.filter(e => e.status === 'disputed').length} টি অর্ডার অ্যাডমিন সালিশিতে পেন্ডিং
            </p>
          </div>
          <div className="w-10 h-10 rounded-xl bg-rose-500/10 text-rose-500 flex items-center justify-center">
            <AlertTriangle className="w-5 h-5" />
          </div>
        </div>

        <div className="p-4 rounded-2xl bg-[var(--pm-surface)] border border-[var(--pm-border)] flex items-center justify-between">
          <div>
            <p className="text-xs text-[var(--pm-text-muted)] font-medium">স্বয়ংক্রিয় রিলিজ প্রটোকল</p>
            <p className="text-sm font-bold text-emerald-500 mt-1 flex items-center gap-1.5">
              <ShieldCheck className="w-4 h-4" /> T+48 Hours Active
            </p>
            <p className="text-[11px] text-zinc-500 mt-1">
              ডেলিভারি পর ৪৮ ঘণ্টায় অভিযোগ না থাকলে অটোমেটিক ভেন্ডর ওয়ালেটে যুক্ত হয়
            </p>
          </div>
          <button 
            onClick={() => fetchAllAdminData()}
            className="p-2.5 rounded-xl bg-[var(--pm-surface-hover)] border border-[var(--pm-border)] text-[var(--pm-text-muted)] hover:text-[var(--pm-text)] transition-colors cursor-pointer"
            title="Refresh Ledger"
          >
            <RefreshCw className={`w-4 h-4 ${isLoading ? 'animate-spin' : ''}`} />
          </button>
        </div>
      </div>

      {/* Filter and Search Bar */}
      <div className="flex flex-col sm:flex-row items-center justify-between gap-3">
        <div className="relative w-full sm:w-80">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-zinc-400" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="অর্ডার নং, ক্রেতা বা ভেন্ডর দিয়ে খুঁজুন..."
            className="w-full pl-9 pr-4 py-2 bg-[var(--pm-surface)] border border-[var(--pm-border)] rounded-xl text-xs text-[var(--pm-text)] outline-none focus:border-[var(--pm-accent)] transition-colors"
          />
        </div>

        {/* Segmented Filter Controls */}
        <div className="flex items-center gap-1 p-1 bg-[var(--pm-surface)] border border-[var(--pm-border)] rounded-xl self-stretch sm:self-auto overflow-x-auto">
          {(['all', 'held', 'disputed', 'released', 'refunded'] as const).map((filter) => (
            <button
              key={filter}
              onClick={() => setStatusFilter(filter)}
              className={`px-3 py-1.5 rounded-lg text-xs font-semibold whitespace-nowrap transition-colors cursor-pointer ${
                statusFilter === filter
                  ? 'bg-[var(--pm-accent)] text-white shadow-sm'
                  : 'text-[var(--pm-text-muted)] hover:text-[var(--pm-text)]'
              }`}
            >
              {filter === 'all' && 'সব এসক্রো'}
              {filter === 'held' && 'হোল্ড (Held)'}
              {filter === 'disputed' && 'ডিসপুট (Dispute)'}
              {filter === 'released' && 'রিলিজড (Released)'}
              {filter === 'refunded' && 'রিফান্ডেড (Refunded)'}
            </button>
          ))}
        </div>
      </div>

      {/* Escrow Ledger List */}
      <div className="space-y-3">
        {filteredEscrows.length === 0 ? (
          <div className="p-8 text-center bg-[var(--pm-surface)] rounded-2xl border border-[var(--pm-border)]">
            <p className="text-sm text-[var(--pm-text-muted)]">কোনো এসক্রো রেকর্ড পাওয়া যায়নি।</p>
          </div>
        ) : (
          filteredEscrows.map((item) => (
            <div 
              key={item.id} 
              className="p-4 rounded-2xl bg-[var(--pm-surface)] border border-[var(--pm-border)] hover:border-zinc-700 transition-colors flex flex-col md:flex-row md:items-center justify-between gap-4"
            >
              <div className="space-y-1.5 flex-1 min-w-0">
                <div className="flex items-center gap-2.5 flex-wrap">
                  <span className="text-sm font-bold font-mono text-[var(--pm-text)]">
                    #{item.orderId}
                  </span>
                  <span className="text-xs text-zinc-500">·</span>
                  <span className="text-xs text-zinc-500 font-mono">
                    ID: {item.id}
                  </span>
                  <span className="text-xs text-zinc-500">·</span>
                  <span className={`text-[11px] font-semibold ${
                    item.status === 'held' ? 'text-amber-400' :
                    item.status === 'disputed' ? 'text-rose-400 font-bold' :
                    item.status === 'released' ? 'text-emerald-400' : 'text-indigo-400'
                  }`}>
                    {item.status === 'held' && 'লকড এসক্রো (Held)'}
                    {item.status === 'disputed' && 'বিতর্কিত (Disputed)'}
                    {item.status === 'released' && 'রিলিজ সম্পন্ন (Released)'}
                    {item.status === 'refunded' && 'রিফান্ড সম্পন্ন (Refunded)'}
                  </span>
                </div>

                <div className="text-xs text-[var(--pm-text-muted)] flex items-center gap-2 flex-wrap">
                  <span>ক্রেতা: <strong className="text-[var(--pm-text)] font-medium">{item.buyer}</strong></span>
                  <span>→</span>
                  <span>ভেন্ডর: <strong className="text-[var(--pm-text)] font-medium">{item.vendor}</strong></span>
                </div>

                {item.disputeReason && (
                  <div className="p-2.5 rounded-lg bg-rose-500/10 border border-rose-500/20 text-xs text-rose-300">
                    <strong>অভিযোগ:</strong> {item.disputeReason}
                  </div>
                )}

                <p className="text-[11px] text-zinc-400">
                  {item.timeRemaining}
                </p>
              </div>

              {/* Amount & Actions */}
              <div className="flex items-center justify-between md:justify-end gap-4 shrink-0 pt-3 md:pt-0 border-t md:border-t-0 border-[var(--pm-border)]">
                <div className="text-left md:text-right">
                  <p className="text-base font-bold font-mono tabular-nums text-[var(--pm-text)]">
                    ৳ {item.amount.toLocaleString()}
                  </p>
                  <p className="text-[10px] text-zinc-500">সুরক্ষিত জামানত</p>
                </div>

                <div className="flex items-center gap-2">
                  {item.status === 'held' && (
                    <button
                      onClick={() => handleRelease(item)}
                      disabled={actionLoadingId === item.id}
                      className="px-3 py-1.5 bg-emerald-600 hover:bg-emerald-500 text-white rounded-lg text-xs font-semibold transition-colors cursor-pointer disabled:opacity-50"
                    >
                      {actionLoadingId === item.id ? 'রিলিজ হচ্ছে...' : 'ভেন্ডরকে রিলিজ'}
                    </button>
                  )}

                  {item.status === 'disputed' && (
                    <>
                      <button
                        onClick={() => handleRelease(item)}
                        disabled={actionLoadingId === item.id}
                        className="px-3 py-1.5 bg-emerald-600 hover:bg-emerald-500 text-white rounded-lg text-xs font-semibold transition-colors cursor-pointer disabled:opacity-50"
                      >
                        ভেন্ডরকে দিন
                      </button>
                      <button
                        onClick={() => setDisputeModalItem(item)}
                        className="px-3 py-1.5 bg-rose-600/20 hover:bg-rose-600/30 text-rose-300 border border-rose-500/30 rounded-lg text-xs font-semibold transition-colors cursor-pointer"
                      >
                        ক্রেতাকে রিফান্ড
                      </button>
                    </>
                  )}

                  {(item.status === 'released' || item.status === 'refunded') && (
                    <span className="text-xs text-zinc-500 font-medium px-2 py-1 bg-zinc-800 rounded">
                      নিষ্পন্ন
                    </span>
                  )}
                </div>
              </div>
            </div>
          ))
        )}
      </div>

      {/* Dispute Arbitration Refund Modal */}
      {disputeModalItem && (
        <div className="fixed inset-0 z-50 bg-black/70 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-[var(--pm-surface)] border border-[var(--pm-border)] rounded-2xl p-6 max-w-md w-full space-y-4">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-rose-500/20 text-rose-500 flex items-center justify-center">
                <AlertTriangle className="w-5 h-5" />
              </div>
              <div>
                <h3 className="text-base font-bold text-[var(--pm-text)]">ক্রেতাকে এসক্রো রিফান্ড অনুমোদন</h3>
                <p className="text-xs text-[var(--pm-text-muted)]">অর্ডার #{disputeModalItem.orderId} (৳ {disputeModalItem.amount.toLocaleString()})</p>
              </div>
            </div>

            <p className="text-xs text-[var(--pm-text-muted)] leading-relaxed">
              এই পদক্ষেপের মাধ্যমে এসক্রো ভল্ট থেকে সরাসরি ক্রেতার অ্যাকাউন্টে অর্থ ফেরত পাঠানো হবে এবং অর্ডারটি 'Refunded' হিসেবে ক্লোজ হবে।
            </p>

            <div className="space-y-1.5">
              <label className="text-xs font-medium text-[var(--pm-text)]">সালিশি সিদ্ধান্তের কারণ (Reason)</label>
              <textarea
                value={refundReason}
                onChange={(e) => setRefundReason(e.target.value)}
                placeholder="যেমন: ভেন্ডর ত্রুটিপূর্ণ পণ্য সরবরাহ করেছে এবং ৭২ ঘণ্টার মধ্যে প্রতিস্থাপন পাঠায়নি..."
                rows={3}
                className="w-full p-3 bg-[var(--pm-surface-hover)] border border-[var(--pm-border)] rounded-xl text-xs text-[var(--pm-text)] outline-none focus:border-[var(--pm-accent)]"
              />
            </div>

            <div className="flex justify-end gap-2 pt-2">
              <button
                onClick={() => setDisputeModalItem(null)}
                className="px-4 py-2 rounded-xl text-xs font-semibold text-[var(--pm-text-muted)] hover:text-[var(--pm-text)] transition-colors"
              >
                বাতিল
              </button>
              <button
                onClick={handleRefundConfirm}
                disabled={actionLoadingId === disputeModalItem.id}
                className="px-4 py-2 rounded-xl text-xs font-semibold bg-rose-600 hover:bg-rose-500 text-white transition-colors cursor-pointer"
              >
                রিফান্ড নিশ্চিত করুন
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
