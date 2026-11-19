import React, { useState, useEffect, useMemo } from 'react';
import {
  Wallet,
  ArrowUpRight,
  ArrowDownLeft,
  CheckCircle2,
  ShieldAlert,
  Send,
  ShieldCheck,
  Coins,
  Lock,
  RefreshCw,
  PlusCircle,
  Building,
  Smartphone,
  Info,
  Clock,
  ArrowRight,
  Search,
} from 'lucide-react';
import { User, PortalTab, WalletTransaction as SharedWalletTransaction } from '@/types';
import { useLanguage } from '@/contexts/LanguageContext';
import { useWalletStore } from '@/features/wallet';

export interface WalletPortalProps {
  currentUser: User;
  onUpdateUser: (updatedUser: User) => void;
  onSelectTab?: (tab: PortalTab) => void;
  onOpenVendorModal?: () => void;
}

export const WalletPortal: React.FC<WalletPortalProps> = ({
  currentUser,
  onUpdateUser,
  onSelectTab,
  onOpenVendorModal,
}) => {
  const { language } = useLanguage();
  const isBn = language === 'bn';

  const {
    balance,
    coins,
    transactions,
    escrowSummary,
    isLoading,
    fetchWalletData,
    depositFunds,
    withdrawFunds,
    transferFunds,
  } = useWalletStore();

  const [activeTab, setActiveTab] = useState<'overview' | 'deposit' | 'withdraw' | 'transfer' | 'escrow'>('overview');
  const [amount, setAmount] = useState<string>('1000');
  const [paymentMethod, setPaymentMethod] = useState<string>('bKash Mobile Banking');
  const [recipientHandle, setRecipientHandle] = useState<string>('');
  const [transferNote, setTransferNote] = useState<string>('');
  const [successMsg, setSuccessMsg] = useState<string | null>(null);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const [filterType, setFilterType] = useState<'all' | 'in' | 'out'>('all');
  const [txSearch, setTxSearch] = useState<string>('');

  useEffect(() => {
    void fetchWalletData(currentUser.id || 'user_me');
  }, [currentUser.id, fetchWalletData]);

  const syncUser = () => {
    const state = useWalletStore.getState();
    const mappedTx: SharedWalletTransaction[] = state.transactions.slice(0, 20).map((t) => ({
      id: t.id,
      type: (t.type === 'credit' || t.type === 'topup' || t.type === 'receive'
        ? 'deposit'
        : t.type === 'debit' || t.type === 'send'
        ? 'transfer'
        : t.type) as SharedWalletTransaction['type'],
      amount: t.amount,
      description: t.description || t.label,
      timestamp: t.timestamp || t.time,
      status: 'completed',
      referenceId: t.referenceId,
    }));
    onUpdateUser({
      ...currentUser,
      balance: state.balance,
      rewardPoints: state.coins,
      transactions: mappedTx,
    });
  };

  const handleDeposit = async (e: React.FormEvent) => {
    e.preventDefault();
    const val = parseFloat(amount);
    if (Number.isNaN(val) || val <= 0) {
      setErrorMsg(isBn ? 'দয়া করে সঠিক পরিমাণ লিখুন।' : 'Please enter a valid amount.');
      return;
    }

    try {
      await depositFunds({ userId: currentUser.id || 'user_me', amount: val, method: paymentMethod });
      syncUser();
      setErrorMsg(null);
      setSuccessMsg(
        isBn
          ? `সফলভাবে ৳${val.toLocaleString()} ওয়ালেটে জমা হয়েছে!`
          : `Successfully added ৳${val.toLocaleString()} to wallet!`
      );
      setTimeout(() => {
        setSuccessMsg(null);
        setActiveTab('overview');
      }, 1600);
    } catch (err: any) {
      setErrorMsg(err?.message || 'Deposit failed');
    }
  };

  const handleWithdraw = async (e: React.FormEvent) => {
    e.preventDefault();
    const val = parseFloat(amount);
    if (Number.isNaN(val) || val < 50) {
      setErrorMsg(isBn ? 'সর্বনিম্ন ৫০ টাকা উইথড্র করা যাবে।' : 'Minimum withdrawal is ৳50.');
      return;
    }

    try {
      await withdrawFunds({
        userId: currentUser.id || 'user_me',
        amount: val,
        method: paymentMethod,
      });
      syncUser();
      setErrorMsg(null);
      setSuccessMsg(
        isBn
          ? `সফলভাবে ৳${val.toLocaleString()} উইথড্র করা হয়েছে!`
          : `Withdrew ৳${val.toLocaleString()} successfully!`
      );
      setTimeout(() => {
        setSuccessMsg(null);
        setActiveTab('overview');
      }, 1600);
    } catch (err: any) {
      setErrorMsg(err?.message || 'Withdrawal failed');
    }
  };

  const handleTransfer = async (e: React.FormEvent) => {
    e.preventDefault();
    const val = parseFloat(amount);
    if (Number.isNaN(val) || val <= 0 || !recipientHandle.trim()) {
      setErrorMsg(
        isBn ? 'সঠিক পরিমাণ ও প্রাপকের তথ্য দিন।' : 'Please enter valid amount and recipient.'
      );
      return;
    }

    try {
      await transferFunds({
        userId: currentUser.id || 'user_me',
        amount: val,
        recipient: recipientHandle.trim(),
        note: transferNote,
      });
      syncUser();
      setErrorMsg(null);
      setSuccessMsg(
        isBn
          ? `${recipientHandle}-কে ৳${val.toLocaleString()} পাঠানো হয়েছে!`
          : `Sent ৳${val.toLocaleString()} to ${recipientHandle}!`
      );
      setTimeout(() => {
        setSuccessMsg(null);
        setActiveTab('overview');
        setRecipientHandle('');
        setTransferNote('');
      }, 1600);
    } catch (err: any) {
      setErrorMsg(err?.message || 'Transfer failed');
    }
  };

  const filteredTransactions = useMemo(() => {
    let list = transactions;
    if (filterType === 'in') {
      list = list.filter(
        (tx) =>
          tx.type === 'deposit' ||
          tx.type === 'credit' ||
          tx.type === 'topup' ||
          tx.type === 'cashback' ||
          tx.type === 'escrow_release' ||
          tx.type === 'receive'
      );
    } else if (filterType === 'out') {
      list = list.filter(
        (tx) =>
          tx.type === 'withdrawal' ||
          tx.type === 'debit' ||
          tx.type === 'purchase' ||
          tx.type === 'escrow_hold' ||
          tx.type === 'send'
      );
    }
    if (txSearch.trim()) {
      const q = txSearch.trim().toLowerCase();
      list = list.filter(
        (tx) =>
          (tx.description && tx.description.toLowerCase().includes(q)) ||
          (tx.label && tx.label.toLowerCase().includes(q)) ||
          (tx.referenceId && tx.referenceId.toLowerCase().includes(q))
      );
    }
    return list;
  }, [transactions, filterType, txSearch]);

  return (
    <div className="space-y-6 pb-20 animate-fadeIn">
      {/* Hero Banner */}
      <section className="rounded-3xl bg-gradient-to-r from-blue-700 via-indigo-800 to-slate-900 p-6 sm:p-8 text-white shadow-xl relative overflow-hidden">
        <div className="absolute right-0 top-0 w-80 h-80 bg-white/10 rounded-full blur-3xl pointer-events-none" />
        <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div className="space-y-2 max-w-xl">
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-white/20 backdrop-blur-md text-[10px] font-black uppercase tracking-widest text-white">
              <ShieldCheck className="w-3.5 h-3.5 text-emerald-400" />
              <span>{isBn ? 'পাইকারমার্ট পে · সুরক্ষিত এসক্রো ওয়ালেট' : 'PaikarMart Pay · Escrow Protected'}</span>
            </div>
            <h1 className="text-2xl sm:text-3xl font-black tracking-tight">
              {isBn ? 'স্মার্ট ওয়ালেট ও নিরাপদ লেনদেন' : 'Smart Wallet & Escrow Ledger'}
            </h1>
            <p className="text-xs sm:text-sm text-white/90 leading-relaxed">
              {isBn
                ? 'স্বয়ংক্রিয় এসক্রো সুরক্ষায় পাইকারি ও রিটেল কেনাকাটা করুন। ডেলিভারি নিশ্চিত হলে টাকা ভেন্ডরের অ্যাকাউন্টে পৌঁছায়।'
                : '100% bank-grade escrow protection for B2B wholesale and hyperlocal orders. Funds are safely held until verified delivery.'}
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-2">
            <button
              type="button"
              onClick={() => void fetchWalletData(currentUser.id || 'user_me')}
              disabled={isLoading}
              className="inline-flex items-center gap-1.5 px-4 py-2.5 rounded-xl bg-white/15 hover:bg-white/25 text-white text-xs font-bold backdrop-blur-sm transition-colors cursor-pointer border border-white/20"
            >
              <RefreshCw className={`w-3.5 h-3.5 ${isLoading ? 'animate-spin' : ''}`} />
              <span>{isBn ? 'ব্যালেন্স রিফ্রেশ' : 'Sync Balance'}</span>
            </button>
            {onOpenVendorModal && !currentUser.isVendor && (
              <button
                type="button"
                onClick={onOpenVendorModal}
                className="inline-flex items-center gap-1.5 px-4 py-2.5 rounded-xl bg-emerald-500 hover:bg-emerald-600 text-white text-xs font-black transition-colors cursor-pointer shadow-md"
              >
                <span>{isBn ? 'মার্চেন্ট অ্যাকাউন্ট খুলুন' : 'Become a Merchant'}</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </button>
            )}
          </div>
        </div>
      </section>

      {/* Metrics Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Available Balance */}
        <div className="p-5 rounded-3xl bg-[var(--pm-card)] border border-[var(--pm-border)] shadow-sm space-y-2">
          <div className="flex items-center justify-between text-[var(--pm-muted)]">
            <span className="text-xs font-bold">{isBn ? 'উপলব্ধ ব্যালেন্স' : 'Available Balance'}</span>
            <Wallet className="w-4 h-4 text-blue-500" />
          </div>
          <p className="text-3xl font-mono tabular-nums font-black text-[var(--pm-text)]">
            ৳{balance.toLocaleString()}
          </p>
          <p className="text-[11px] text-[var(--pm-success)] font-bold flex items-center gap-1">
            <CheckCircle2 className="w-3 h-3" />
            {isBn ? 'তাত্ক্ষণিক কেনাকাটা ও ক্যাশআউট প্রস্তুত' : 'Ready for purchase & payout'}
          </p>
        </div>

        {/* Escrow Protected Funds */}
        <div className="p-5 rounded-3xl bg-[var(--pm-card)] border border-[var(--pm-border)] shadow-sm space-y-2">
          <div className="flex items-center justify-between text-[var(--pm-muted)]">
            <span className="text-xs font-bold">{isBn ? 'এসক্রোতে রক্ষিত' : 'Escrow Held'}</span>
            <Lock className="w-4 h-4 text-amber-500" />
          </div>
          <p className="text-3xl font-mono tabular-nums font-black text-amber-600 dark:text-amber-400">
            ৳{escrowSummary.totalHeld.toLocaleString()}
          </p>
          <p className="text-[11px] text-[var(--pm-muted)] font-medium">
            {isBn ? `রিলিজ সম্পন্ন: ৳${escrowSummary.totalReleased.toLocaleString()}` : `Released to date: ৳${escrowSummary.totalReleased.toLocaleString()}`}
          </p>
        </div>

        {/* PaikarMart Coins */}
        <div className="p-5 rounded-3xl bg-[var(--pm-card)] border border-[var(--pm-border)] shadow-sm space-y-2">
          <div className="flex items-center justify-between text-[var(--pm-muted)]">
            <span className="text-xs font-bold">{isBn ? 'রিওয়ার্ড কয়েন' : 'Reward Coins'}</span>
            <Coins className="w-4 h-4 text-yellow-500" />
          </div>
          <p className="text-3xl font-mono tabular-nums font-black text-[var(--pm-text)]">
            {coins.toLocaleString()}
          </p>
          <p className="text-[11px] text-[var(--pm-muted)] font-medium">
            {isBn ? 'পরবর্তী কেনাকাটায় ছাড়ের সমতুল্য' : 'Redeemable for discount vouchers'}
          </p>
        </div>

        {/* Quick Action Trigger */}
        <div className="p-5 rounded-3xl bg-gradient-to-br from-blue-900 to-indigo-950 text-white shadow-sm flex flex-col justify-between">
          <div className="space-y-1">
            <span className="text-xs font-bold text-blue-200">{isBn ? 'দ্রুত লেনদেন' : 'Quick Actions'}</span>
            <p className="text-xs text-white/80">
              {isBn ? 'bKash/Nagad দিয়ে টপ-আপ বা সেন্ড মানি করুন' : 'Instant deposit or P2P transfer'}
            </p>
          </div>
          <div className="flex items-center gap-2 pt-3">
            <button
              type="button"
              onClick={() => setActiveTab('deposit')}
              className="flex-1 py-2 px-3 rounded-xl bg-white text-slate-900 text-xs font-bold hover:bg-blue-50 transition-colors cursor-pointer text-center"
            >
              {isBn ? 'ডিপোজিট' : 'Deposit'}
            </button>
            <button
              type="button"
              onClick={() => setActiveTab('transfer')}
              className="flex-1 py-2 px-3 rounded-xl bg-white/20 text-white text-xs font-bold hover:bg-white/30 transition-colors cursor-pointer text-center"
            >
              {isBn ? 'ট্রান্সফার' : 'Transfer'}
            </button>
          </div>
        </div>
      </div>

      {/* Success / Error Alerts */}
      {successMsg && (
        <div className="p-3.5 rounded-2xl bg-[var(--pm-success-soft)] border border-[var(--pm-success)]/30 flex items-center gap-2.5 text-[var(--pm-success)] text-xs font-bold animate-fadeIn">
          <CheckCircle2 className="w-4 h-4 shrink-0" />
          <span>{successMsg}</span>
        </div>
      )}

      {errorMsg && (
        <div className="p-3.5 rounded-2xl bg-[var(--pm-danger-soft)] border border-[var(--pm-danger)]/30 flex items-center gap-2.5 text-[var(--pm-danger)] text-xs font-bold animate-fadeIn">
          <ShieldAlert className="w-4 h-4 shrink-0" />
          <span>{errorMsg}</span>
        </div>
      )}

      {/* Tabs Navigation */}
      <div className="flex items-center gap-2 overflow-x-auto no-scrollbar border-b border-[var(--pm-border)] pb-2">
        {[
          { id: 'overview', label: isBn ? 'লেনদেন ইতিহাস' : 'Transaction History', icon: Clock },
          { id: 'deposit', label: isBn ? 'ডিপোজিট / টপ-আপ' : 'Deposit Funds', icon: PlusCircle },
          { id: 'withdraw', label: isBn ? 'উইথড্র / ক্যাশআউট' : 'Withdrawal', icon: ArrowUpRight },
          { id: 'transfer', label: isBn ? 'সেন্ড মানি' : 'Send Money', icon: Send },
          { id: 'escrow', label: isBn ? 'এসক্রো সুরক্ষানীতি' : 'Escrow Guarantee', icon: ShieldCheck },
        ].map((tab) => {
          const Icon = tab.icon;
          const isActive = activeTab === tab.id;
          return (
            <button
              key={tab.id}
              type="button"
              onClick={() => {
                setActiveTab(tab.id as any);
                setErrorMsg(null);
              }}
              className={`inline-flex items-center gap-2 px-4 py-2.5 rounded-2xl text-xs font-bold transition-all cursor-pointer whitespace-nowrap ${
                isActive
                  ? 'bg-[var(--pm-accent)] text-[var(--pm-accent-fg)] shadow-sm'
                  : 'bg-[var(--pm-card)] text-[var(--pm-muted)] hover:text-[var(--pm-text)] border border-[var(--pm-border)]'
              }`}
            >
              <Icon className="w-3.5 h-3.5" />
              <span>{tab.label}</span>
            </button>
          );
        })}
      </div>

      {/* Tab 1: Overview & History */}
      {activeTab === 'overview' && (
        <div className="space-y-4 animate-fadeIn">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-[var(--pm-muted)]" />
              <input
                type="text"
                placeholder={isBn ? 'লেনদেন বিবরণ বা রেফারেন্স আইডি খুঁজুন...' : 'Search transaction by description or ID...'}
                value={txSearch}
                onChange={(e) => setTxSearch(e.target.value)}
                className="w-full pl-9 pr-4 py-2.5 rounded-2xl bg-[var(--pm-input)] text-xs font-medium text-[var(--pm-text)] placeholder:text-[var(--pm-muted)] border border-[var(--pm-border)] focus:border-[var(--pm-accent)] outline-none"
              />
            </div>

            <div className="flex items-center gap-1.5 shrink-0">
              {(['all', 'in', 'out'] as const).map((mode) => (
                <button
                  key={mode}
                  type="button"
                  onClick={() => setFilterType(mode)}
                  className={`px-3 py-1.5 rounded-xl text-xs font-bold capitalize transition-colors cursor-pointer ${
                    filterType === mode
                      ? 'bg-[var(--pm-accent)] text-[var(--pm-accent-fg)]'
                      : 'bg-[var(--pm-surface)] text-[var(--pm-muted)] hover:text-[var(--pm-text)] border border-[var(--pm-border)]'
                  }`}
                >
                  {mode === 'all' ? (isBn ? 'সকল' : 'All') : mode === 'in' ? (isBn ? 'আগত (+)' : 'Received (+)') : (isBn ? 'ব্যয় (-)' : 'Paid (-)')}
                </button>
              ))}
            </div>
          </div>

          <div className="p-4 sm:p-5 rounded-3xl bg-[var(--pm-card)] border border-[var(--pm-border)] shadow-sm space-y-3">
            {filteredTransactions.length === 0 ? (
              <div className="py-12 text-center text-xs text-[var(--pm-muted)] space-y-2">
                <Info className="w-8 h-8 mx-auto text-[var(--pm-muted)]/60" />
                <p className="font-bold text-sm text-[var(--pm-text)]">
                  {isBn ? 'কোনো লেনদেন পাওয়া যায়নি' : 'No transactions found'}
                </p>
                <p>{isBn ? 'আপনার ওয়ালেটে ডিপোজিট করে প্রথম লেনদেন শুরু করুন।' : 'Deposit funds to get started with your first order.'}</p>
              </div>
            ) : (
              filteredTransactions.map((tx) => {
                const isIncoming =
                  tx.type === 'deposit' ||
                  tx.type === 'credit' ||
                  tx.type === 'topup' ||
                  tx.type === 'cashback' ||
                  tx.type === 'escrow_release' ||
                  tx.type === 'receive';
                return (
                  <div
                    key={tx.id}
                    className="p-3.5 rounded-2xl bg-[var(--pm-surface)] border border-[var(--pm-border)] flex items-center justify-between gap-3 hover:border-[var(--pm-accent)]/40 transition-colors"
                  >
                    <div className="flex items-center gap-3 min-w-0">
                      <div
                        className={`p-2.5 rounded-xl shrink-0 ${
                          isIncoming
                            ? 'bg-[var(--pm-success-soft)] text-[var(--pm-success)]'
                            : 'bg-[var(--pm-warning-soft)] text-[var(--pm-warning)]'
                        }`}
                      >
                        {isIncoming ? <ArrowDownLeft className="w-4 h-4" /> : <ArrowUpRight className="w-4 h-4" />}
                      </div>
                      <div className="min-w-0">
                        <p className="text-xs font-bold text-[var(--pm-text)] truncate">
                          {tx.description || tx.label}
                        </p>
                        <p className="text-[11px] text-[var(--pm-muted)] font-mono truncate">
                          {tx.timestamp || tx.time} {tx.referenceId ? `· Ref: ${tx.referenceId}` : ''}
                        </p>
                      </div>
                    </div>

                    <div className="text-right shrink-0">
                      <span
                        className={`text-sm font-mono tabular-nums font-black ${
                          isIncoming ? 'text-[var(--pm-success)]' : 'text-[var(--pm-text)]'
                        }`}
                      >
                        {isIncoming ? '+' : '-'}
                        {tx.currency === 'COIN' ? `${tx.amount} Coins` : `৳${tx.amount.toLocaleString()}`}
                      </span>
                      <p className="text-[10px] text-[var(--pm-muted)] uppercase font-bold tracking-wider">
                        {tx.type.replace('_', ' ')}
                      </p>
                    </div>
                  </div>
                );
              })
            )}
          </div>
        </div>
      )}

      {/* Tab 2: Deposit */}
      {activeTab === 'deposit' && (
        <div className="max-w-xl mx-auto p-6 rounded-3xl bg-[var(--pm-card)] border border-[var(--pm-border)] shadow-sm space-y-5 animate-fadeIn">
          <div>
            <h2 className="text-base font-black text-[var(--pm-text)]">
              {isBn ? 'ওয়ালেট টপ-আপ / ফান্ড ডিপোজিট' : 'Deposit Funds to PaikarMart Wallet'}
            </h2>
            <p className="text-xs text-[var(--pm-muted)]">
              {isBn ? 'bKash, Nagad অথবা ব্যাংক একাউন্ট থেকে তাৎক্ষণিক ব্যালেন্স রিচার্জ করুন।' : 'Add balance instantly via mobile financial services or bank wire.'}
            </p>
          </div>

          <form onSubmit={(e) => void handleDeposit(e)} className="space-y-4">
            <div>
              <label className="text-xs font-bold text-[var(--pm-text)] block mb-1.5">
                {isBn ? 'পরিমাণ (৳)' : 'Deposit Amount (BDT)'}
              </label>
              <input
                type="number"
                min="10"
                step="any"
                required
                value={amount}
                onChange={(e) => setAmount(e.target.value)}
                className="w-full px-4 py-3 rounded-2xl bg-[var(--pm-input)] text-sm font-mono font-bold text-[var(--pm-text)] border border-[var(--pm-border)] focus:border-[var(--pm-accent)] outline-none"
              />
              <div className="flex items-center gap-2 pt-2">
                {['500', '1000', '5000', '10000'].map((preset) => (
                  <button
                    key={preset}
                    type="button"
                    onClick={() => setAmount(preset)}
                    className="px-3 py-1 rounded-xl bg-[var(--pm-surface)] hover:bg-[var(--pm-card-hover)] border border-[var(--pm-border)] text-xs font-mono font-bold text-[var(--pm-text)] cursor-pointer"
                  >
                    +৳{preset}
                  </button>
                ))}
              </div>
            </div>

            <div>
              <label className="text-xs font-bold text-[var(--pm-text)] block mb-1.5">
                {isBn ? 'পেমেন্ট গেটওয়ে নির্বাচন করুন' : 'Select Payment Gateway'}
              </label>
              <select
                value={paymentMethod}
                onChange={(e) => setPaymentMethod(e.target.value)}
                className="w-full px-4 py-3 rounded-2xl bg-[var(--pm-input)] text-xs font-bold text-[var(--pm-text)] border border-[var(--pm-border)] focus:border-[var(--pm-accent)] outline-none cursor-pointer"
              >
                <option>bKash Mobile Banking (Instant 1.5% cashback)</option>
                <option>Nagad Mobile Wallet</option>
                <option>Rocket DBBL Mobile</option>
                <option>Direct Bank Wire / BEFTN</option>
              </select>
            </div>

            <div className="p-3.5 rounded-2xl bg-[var(--pm-surface)] border border-[var(--pm-border)] text-xs text-[var(--pm-muted)] space-y-1">
              <p className="font-bold text-[var(--pm-text)] flex items-center gap-1.5">
                <ShieldCheck className="w-4 h-4 text-emerald-500" />
                {isBn ? 'শূন্য ট্রানজেকশন ফি' : 'Zero Transaction Fees'}
              </p>
              <p>
                {isBn
                  ? 'ওয়ালেটে অর্থ জমা রাখা সম্পূর্ণ নিরাপদ। যেকোনো সময় কেনাকাটায় ব্যবহার বা ক্যাশআউট করতে পারবেন।'
                  : 'Your funds are encrypted and stored under Bank of Bangladesh MFS regulatory compliance.'}
              </p>
            </div>

            <button
              type="submit"
              disabled={isLoading}
              className="w-full py-3.5 rounded-2xl bg-[var(--pm-accent)] hover:bg-[var(--pm-accent-hover)] disabled:opacity-50 text-[var(--pm-accent-fg)] font-black text-xs shadow-md transition-colors cursor-pointer"
            >
              {isBn ? 'টপ-আপ নিশ্চিত করুন' : 'Proceed to Top-Up'}
            </button>
          </form>
        </div>
      )}

      {/* Tab 3: Withdraw */}
      {activeTab === 'withdraw' && (
        <div className="max-w-xl mx-auto p-6 rounded-3xl bg-[var(--pm-card)] border border-[var(--pm-border)] shadow-sm space-y-5 animate-fadeIn">
          <div>
            <h2 className="text-base font-black text-[var(--pm-text)]">
              {isBn ? 'ওয়ালেট উইথড্রয়াল / ক্যাশআউট' : 'Withdraw Funds from Wallet'}
            </h2>
            <p className="text-xs text-[var(--pm-muted)]">
              {isBn ? 'আপনার ব্যাংক বা MFS অ্যাকাউন্টে টাকা পাঠিয়ে নিন।' : 'Transfer available balance back to your verified bank or mobile wallet.'}
            </p>
          </div>

          <form onSubmit={(e) => void handleWithdraw(e)} className="space-y-4">
            <div>
              <label className="text-xs font-bold text-[var(--pm-text)] block mb-1.5">
                {isBn ? 'উইথড্র পরিমাণ (৳)' : 'Withdrawal Amount (BDT)'}
              </label>
              <input
                type="number"
                min="50"
                max={balance}
                step="any"
                required
                value={amount}
                onChange={(e) => setAmount(e.target.value)}
                className="w-full px-4 py-3 rounded-2xl bg-[var(--pm-input)] text-sm font-mono font-bold text-[var(--pm-text)] border border-[var(--pm-border)] focus:border-[var(--pm-accent)] outline-none"
              />
              <p className="text-[11px] text-[var(--pm-muted)] mt-1">
                {isBn ? `সর্বোচ্চ উপলব্ধ ব্যালেন্স: ৳${balance.toLocaleString()}` : `Max available: ৳${balance.toLocaleString()}`}
              </p>
            </div>

            <div>
              <label className="text-xs font-bold text-[var(--pm-text)] block mb-1.5">
                {isBn ? 'গন্তব্য অ্যাকাউন্ট' : 'Destination Account'}
              </label>
              <select
                value={paymentMethod}
                onChange={(e) => setPaymentMethod(e.target.value)}
                className="w-full px-4 py-3 rounded-2xl bg-[var(--pm-input)] text-xs font-bold text-[var(--pm-text)] border border-[var(--pm-border)] focus:border-[var(--pm-accent)] outline-none cursor-pointer"
              >
                <option>bKash Personal / Merchant Account</option>
                <option>Nagad Personal Account</option>
                <option>Verified Bank Account (City Bank, BRAC, DBBL)</option>
              </select>
            </div>

            <button
              type="submit"
              disabled={isLoading || balance < 50}
              className="w-full py-3.5 rounded-2xl bg-[var(--pm-accent)] hover:bg-[var(--pm-accent-hover)] disabled:opacity-50 text-[var(--pm-accent-fg)] font-black text-xs shadow-md transition-colors cursor-pointer"
            >
              {isBn ? 'উইথড্র রিকোয়েস্ট সাবমিট করুন' : 'Submit Withdrawal Request'}
            </button>
          </form>
        </div>
      )}

      {/* Tab 4: Transfer */}
      {activeTab === 'transfer' && (
        <div className="max-w-xl mx-auto p-6 rounded-3xl bg-[var(--pm-card)] border border-[var(--pm-border)] shadow-sm space-y-5 animate-fadeIn">
          <div>
            <h2 className="text-base font-black text-[var(--pm-text)]">
              {isBn ? 'ইনস্ট্যান্ট সেন্ড মানি / P2P ট্রান্সফার' : 'Instant Send Money / P2P Transfer'}
            </h2>
            <p className="text-xs text-[var(--pm-muted)]">
              {isBn ? 'যেকোনো পাইকারমার্ট ইউজার বা মার্চেন্টকে মুহূর্তেই ব্যালেন্স পাঠান।' : 'Send balance instantly to any PaikarMart user handle or phone with zero fees.'}
            </p>
          </div>

          <form onSubmit={(e) => void handleTransfer(e)} className="space-y-4">
            <div>
              <label className="text-xs font-bold text-[var(--pm-text)] block mb-1.5">
                {isBn ? 'প্রাপকের ইউজার হ্যান্ডেল বা ফোন নম্বর' : 'Recipient @Handle or Mobile Number'}
              </label>
              <input
                type="text"
                required
                value={recipientHandle}
                onChange={(e) => setRecipientHandle(e.target.value)}
                placeholder="@shop_bd or 017XXXXXXXX"
                className="w-full px-4 py-3 rounded-2xl bg-[var(--pm-input)] text-xs font-bold text-[var(--pm-text)] placeholder:text-[var(--pm-muted)] border border-[var(--pm-border)] focus:border-[var(--pm-accent)] outline-none"
              />
            </div>

            <div>
              <label className="text-xs font-bold text-[var(--pm-text)] block mb-1.5">
                {isBn ? 'ট্রান্সফার পরিমাণ (৳)' : 'Transfer Amount (BDT)'}
              </label>
              <input
                type="number"
                min="1"
                max={balance}
                step="any"
                required
                value={amount}
                onChange={(e) => setAmount(e.target.value)}
                className="w-full px-4 py-3 rounded-2xl bg-[var(--pm-input)] text-sm font-mono font-bold text-[var(--pm-text)] border border-[var(--pm-border)] focus:border-[var(--pm-accent)] outline-none"
              />
            </div>

            <div>
              <label className="text-xs font-bold text-[var(--pm-text)] block mb-1.5">
                {isBn ? 'রেফারেন্স নোট (ঐচ্ছিক)' : 'Reference Note (Optional)'}
              </label>
              <input
                type="text"
                value={transferNote}
                onChange={(e) => setTransferNote(e.target.value)}
                placeholder={isBn ? 'যেমন: নমুনা কাপড়ের জন্য অগ্রিম' : 'e.g., Advance payment for wholesale sample'}
                className="w-full px-4 py-3 rounded-2xl bg-[var(--pm-input)] text-xs text-[var(--pm-text)] placeholder:text-[var(--pm-muted)] border border-[var(--pm-border)] focus:border-[var(--pm-accent)] outline-none"
              />
            </div>

            <button
              type="submit"
              disabled={isLoading || balance <= 0}
              className="w-full py-3.5 rounded-2xl bg-[var(--pm-accent)] hover:bg-[var(--pm-accent-hover)] disabled:opacity-50 text-[var(--pm-accent-fg)] font-black text-xs shadow-md transition-colors cursor-pointer flex items-center justify-center gap-2"
            >
              <Send className="w-4 h-4" />
              <span>{isBn ? 'এখনই পাঠান' : 'Send Funds Now'}</span>
            </button>
          </form>
        </div>
      )}

      {/* Tab 5: Escrow Guarantee Policy */}
      {activeTab === 'escrow' && (
        <div className="p-6 rounded-3xl bg-[var(--pm-card)] border border-[var(--pm-border)] shadow-sm space-y-6 animate-fadeIn">
          <div>
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-500/15 text-emerald-600 text-[10px] font-black uppercase tracking-wider mb-2">
              <ShieldCheck className="w-3.5 h-3.5" />
              <span>Bank-Grade Escrow Protection</span>
            </div>
            <h2 className="text-lg font-black text-[var(--pm-text)]">
              {isBn ? 'পাইকারমার্ট এসক্রো সুরক্ষা কীভাবে কাজ করে?' : 'How PaikarMart Escrow Protection Works'}
            </h2>
            <p className="text-xs text-[var(--pm-muted)]">
              {isBn
                ? 'ক্রেতা ও বিক্রেতা উভয়ের নিরাপত্তা নিশ্চিত করতে প্রতিটি লেনদেন এসক্রো লকের মাধ্যমে সম্পন্ন হয়।'
                : 'Zero-risk commerce for wholesale bulk purchases and retail bookings.'}
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="p-4 rounded-2xl bg-[var(--pm-surface)] border border-[var(--pm-border)] space-y-2">
              <div className="w-8 h-8 rounded-xl bg-blue-500/15 text-blue-600 flex items-center justify-center font-black text-sm">
                1
              </div>
              <h3 className="text-sm font-bold text-[var(--pm-text)]">
                {isBn ? 'অর্ডার ও এসক্রো লক' : '1. Order Placed & Funds Locked'}
              </h3>
              <p className="text-xs text-[var(--pm-muted)] leading-relaxed">
                {isBn
                  ? 'ক্রেতা অর্ডার করার সাথে সাথে টাকা এসক্রো তহবিলে নিরাপদভাবে লক হয়ে যায়। ভেন্ডর পণ্য প্রস্তুত শুরু করে।'
                  : 'Buyer pays and money is held safely in escrow. The seller prepares the goods without worrying about bogus orders.'}
              </p>
            </div>

            <div className="p-4 rounded-2xl bg-[var(--pm-surface)] border border-[var(--pm-border)] space-y-2">
              <div className="w-8 h-8 rounded-xl bg-amber-500/15 text-amber-600 flex items-center justify-center font-black text-sm">
                2
              </div>
              <h3 className="text-sm font-bold text-[var(--pm-text)]">
                {isBn ? 'ট্র্যাকিং ও রিয়েল-টাইম ডেলিভারি' : '2. Verified Courier Handover'}
              </h3>
              <p className="text-xs text-[var(--pm-muted)] leading-relaxed">
                {isBn
                  ? 'লজিস্টিকস পার্টনার (Steadfast, Pathao, RedX) মারফত পণ্য শিপমেন্ট হয় এবং ক্রেতা লাইভ অবস্থান ট্র্যাক করতে পারে।'
                  : 'Courier collects parcel and scans POD (Proof of Delivery). Tracking updates dynamically in Orders Hub.'}
              </p>
            </div>

            <div className="p-4 rounded-2xl bg-[var(--pm-surface)] border border-[var(--pm-border)] space-y-2">
              <div className="w-8 h-8 rounded-xl bg-emerald-500/15 text-emerald-600 flex items-center justify-center font-black text-sm">
                3
              </div>
              <h3 className="text-sm font-bold text-[var(--pm-text)]">
                {isBn ? 'স্বয়ংক্রিয় রিলিজ ও ক্যাশআউট' : '3. Delivery Confirmed & Release'}
              </h3>
              <p className="text-xs text-[var(--pm-muted)] leading-relaxed">
                {isBn
                  ? 'পণ্য বুঝে পেয়ে ক্রেতা কনফার্ম করলেই বিক্রেতার ওয়ালেটে টাকা সাথে সাথে যুক্ত হয়ে যায়।'
                  : 'Buyer confirms goods or 48-hour inspection timer passes without dispute. Funds are released instantly to vendor.'}
              </p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
