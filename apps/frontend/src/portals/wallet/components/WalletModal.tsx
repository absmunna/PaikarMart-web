import React, { useState, useEffect } from 'react';
import { User, WalletTransaction as SharedWalletTransaction } from '@/types';
import {
  Wallet,
  ArrowUpRight,
  ArrowDownLeft,
  X,
  CheckCircle2,
  ShieldAlert,
  Send,
  ShieldCheck
} from 'lucide-react';
import { useLanguage } from '@/contexts/LanguageContext';
import { useWalletStore } from '@/features/wallet';

interface WalletModalProps {
  isOpen: boolean;
  onClose: () => void;
  currentUser: User;
  onUpdateUser: (updatedUser: User) => void;
}

export const WalletModal: React.FC<WalletModalProps> = ({
  isOpen,
  onClose,
  currentUser,
  onUpdateUser
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
    transferFunds
  } = useWalletStore();

  const [activeTab, setActiveTab] = useState<'balance' | 'deposit' | 'withdraw' | 'transfer'>('balance');
  const [amount, setAmount] = useState<string>('1000');
  const [paymentMethod, setPaymentMethod] = useState<string>('bKash Mobile Banking');
  const [recipientHandle, setRecipientHandle] = useState<string>('');
  const [transferNote, setTransferNote] = useState<string>('');
  const [successMsg, setSuccessMsg] = useState<string | null>(null);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  useEffect(() => {
    if (isOpen) {
      void fetchWalletData(currentUser.id || 'user_me');
    }
  }, [isOpen, currentUser.id, fetchWalletData]);

  if (!isOpen) return null;

  const syncUser = () => {
    const state = useWalletStore.getState();
    const mappedTx: SharedWalletTransaction[] = state.transactions.slice(0, 15).map((t) => ({
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
      referenceId: t.referenceId
    }));
    onUpdateUser({
      ...currentUser,
      balance: state.balance,
      rewardPoints: state.coins,
      transactions: mappedTx
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
        setActiveTab('balance');
      }, 1800);
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
        method: paymentMethod
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
        setActiveTab('balance');
      }, 1800);
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
        note: transferNote
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
        setActiveTab('balance');
        setRecipientHandle('');
        setTransferNote('');
      }, 1800);
    } catch (err: any) {
      setErrorMsg(err?.message || 'Transfer failed');
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-xs animate-fade-in">
      <div className="bg-[var(--pm-card)] text-[var(--pm-text)] border border-[var(--pm-border)] rounded-[2rem] w-full max-w-lg shadow-2xl overflow-hidden flex flex-col max-h-[90vh]">
        {/* Modal Header */}
        <div className="p-5 border-b border-[var(--pm-border)] flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-[1.25rem] bg-[var(--pm-accent)] text-[var(--pm-accent-fg)] flex items-center justify-center shadow-lg">
              <Wallet className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-base font-black text-[var(--pm-text)]">
                {isBn ? 'পাইকারমার্ট পে ও এসক্রো' : 'PaikarMart Pay & Escrow'}
              </h3>
              <p className="text-[11px] text-[var(--pm-muted)]">
                {coins} Coins · Escrow Held: ৳{escrowSummary.totalHeld.toLocaleString()}
              </p>
            </div>
          </div>
          <button
            type="button"
            onClick={onClose}
            aria-label="Close wallet"
            className="w-9 h-9 rounded-full text-[var(--pm-muted)] hover:bg-[var(--pm-card-hover)] hover:text-[var(--pm-text)] flex items-center justify-center transition-colors cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Success / Error Banners */}
        {successMsg && (
          <div className="mx-5 mt-4 p-3 rounded-[1.25rem] bg-[var(--pm-success-soft)] border border-[var(--pm-success)]/30 flex items-center gap-2.5 text-[var(--pm-success)] text-xs font-bold">
            <CheckCircle2 className="w-4 h-4 shrink-0" />
            <span>{successMsg}</span>
          </div>
        )}

        {errorMsg && (
          <div className="mx-5 mt-4 p-3 rounded-[1.25rem] bg-[var(--pm-danger-soft)] border border-[var(--pm-danger)]/30 flex items-center gap-2.5 text-[var(--pm-danger)] text-xs font-bold">
            <ShieldAlert className="w-4 h-4 shrink-0" />
            <span>{errorMsg}</span>
          </div>
        )}

        {/* Scrollable Body */}
        <div className="p-5 space-y-5 overflow-y-auto">
          {/* Balance Card */}
          <div className="p-5 rounded-[2rem] bg-gradient-to-br from-slate-900 via-blue-900 to-indigo-900 text-white shadow-xl flex items-center justify-between gap-3 border border-white/10">
            <div>
              <span className="text-[10px] font-bold text-blue-200 block">
                {isBn ? 'উপলব্ধ ব্যালেন্স (BDT)' : 'Available Balance (BDT)'}
              </span>
              <h2 className="text-3xl font-mono tabular-nums font-black mt-1 tracking-tight">
                ৳{balance.toLocaleString()}
              </h2>
            </div>
            <div className="text-right">
              <span className="text-[10px] text-emerald-300 font-bold flex items-center gap-1 justify-end">
                <ShieldCheck className="w-3.5 h-3.5" />
                Escrow Held
              </span>
              <p className="text-sm font-mono tabular-nums font-black text-amber-300 mt-0.5">
                ৳{escrowSummary.totalHeld.toLocaleString()}
              </p>
            </div>
          </div>

          {/* Action Tabs */}
          <div className="grid grid-cols-4 gap-1.5 bg-[var(--pm-surface)] border border-[var(--pm-border)] p-1.5 rounded-[2rem]">
            {[
              { id: 'balance', label: isBn ? 'ওভারভিউ' : 'Overview' },
              { id: 'deposit', label: isBn ? 'ডিপোজিট' : 'Deposit' },
              { id: 'withdraw', label: isBn ? 'উইথড্র' : 'Withdraw' },
              { id: 'transfer', label: isBn ? 'ট্রান্সফার' : 'Transfer' }
            ].map((tab) => (
              <button
                key={tab.id}
                type="button"
                onClick={() => {
                  setActiveTab(tab.id as any);
                  setErrorMsg(null);
                }}
                className={`py-2 rounded-[2rem] text-xs font-bold transition-all active-scale cursor-pointer ${
                  activeTab === tab.id
                    ? 'bg-[var(--pm-card)] text-[var(--pm-accent)] shadow-sm'
                    : 'text-[var(--pm-muted)] hover:text-[var(--pm-text)]'
                }`}
              >
                {tab.label}
              </button>
            ))}
          </div>

          {/* Overview Tab */}
          {activeTab === 'balance' && (
            <div className="space-y-2.5 animate-fade-in">
              <p className="text-xs font-bold text-[var(--pm-muted)]">
                {isBn ? 'সাম্প্রতিক লেনদেন' : 'Recent Activity'}
              </p>
              {transactions.slice(0, 4).map((tx) => {
                const isIncoming =
                  tx.type === 'deposit' ||
                  tx.type === 'cashback' ||
                  tx.type === 'credit' ||
                  tx.type === 'escrow_release';
                return (
                  <div
                    key={tx.id}
                    className="p-3 rounded-[1.25rem] bg-[var(--pm-surface)] border border-[var(--pm-border)] flex items-center justify-between gap-2"
                  >
                    <div className="flex items-center gap-2.5 min-w-0">
                      <div
                        className={`p-2 rounded-[1rem] shrink-0 ${
                          isIncoming
                            ? 'bg-[var(--pm-success-soft)] text-[var(--pm-success)]'
                            : 'bg-[var(--pm-warning-soft)] text-[var(--pm-warning)]'
                        }`}
                      >
                        {isIncoming ? (
                          <ArrowDownLeft className="w-3.5 h-3.5" />
                        ) : (
                          <ArrowUpRight className="w-3.5 h-3.5" />
                        )}
                      </div>
                      <div className="min-w-0">
                        <p className="text-xs font-bold text-[var(--pm-text)] truncate">
                          {tx.description || tx.label}
                        </p>
                        <p className="text-[10px] text-[var(--pm-muted)] font-mono truncate">
                          {tx.timestamp || tx.time}
                        </p>
                      </div>
                    </div>
                    <span
                      className={`text-xs font-mono tabular-nums font-black shrink-0 ${
                        isIncoming ? 'text-[var(--pm-success)]' : 'text-[var(--pm-text)]'
                      }`}
                    >
                      {isIncoming ? '+' : '-'}
                      {tx.currency === 'COIN'
                        ? `${tx.amount} Coins`
                        : `৳${tx.amount.toLocaleString()}`}
                    </span>
                  </div>
                );
              })}
            </div>
          )}

          {/* Deposit Tab */}
          {activeTab === 'deposit' && (
            <form onSubmit={(e) => void handleDeposit(e)} className="space-y-4 animate-fade-in">
              <div>
                <label className="text-xs font-bold text-[var(--pm-text)] block mb-1.5">
                  {isBn ? 'পরিমাণ (৳)' : 'Deposit Amount (৳)'}
                </label>
                <input
                  type="number"
                  min="10"
                  step="any"
                  required
                  value={amount}
                  onChange={(e) => setAmount(e.target.value)}
                  className="w-full px-4 py-3 rounded-[1.5rem] bg-[var(--pm-input)] text-xs font-mono font-bold text-[var(--pm-text)] border border-[var(--pm-border)] focus:border-[var(--pm-accent)] outline-none"
                />
              </div>
              <div>
                <label className="text-xs font-bold text-[var(--pm-text)] block mb-1.5">
                  {isBn ? 'পেমেন্ট মাধ্যম' : 'Payment Method'}
                </label>
                <select
                  value={paymentMethod}
                  onChange={(e) => setPaymentMethod(e.target.value)}
                  className="w-full px-4 py-3 rounded-[1.5rem] bg-[var(--pm-input)] text-xs font-bold text-[var(--pm-text)] border border-[var(--pm-border)] focus:border-[var(--pm-accent)] outline-none"
                >
                  <option>bKash Mobile Banking</option>
                  <option>Nagad Mobile Wallet</option>
                  <option>Rocket DBBL Mobile</option>
                  <option>Direct Bank Wire</option>
                </select>
              </div>
              <button
                type="submit"
                disabled={isLoading}
                className="w-full py-3 rounded-[2rem] bg-[var(--pm-accent)] hover:bg-[var(--pm-accent-hover)] disabled:opacity-50 text-[var(--pm-accent-fg)] font-bold text-xs shadow-lg active-scale cursor-pointer"
              >
                {isBn ? 'ডিপোজিট নিশ্চিত করুন' : 'Confirm Deposit'}
              </button>
            </form>
          )}

          {/* Withdraw Tab */}
          {activeTab === 'withdraw' && (
            <form onSubmit={(e) => void handleWithdraw(e)} className="space-y-4 animate-fade-in">
              <div>
                <label className="text-xs font-bold text-[var(--pm-text)] block mb-1.5">
                  {isBn ? 'উইথড্র পরিমাণ (৳)' : 'Withdraw Amount (৳)'}
                </label>
                <input
                  type="number"
                  min="50"
                  max={balance}
                  step="any"
                  required
                  value={amount}
                  onChange={(e) => setAmount(e.target.value)}
                  className="w-full px-4 py-3 rounded-[1.5rem] bg-[var(--pm-input)] text-xs font-mono font-bold text-[var(--pm-text)] border border-[var(--pm-border)] focus:border-[var(--pm-accent)] outline-none"
                />
              </div>
              <div>
                <label className="text-xs font-bold text-[var(--pm-text)] block mb-1.5">
                  {isBn ? 'পেমেন্ট মাধ্যম' : 'Payout Destination'}
                </label>
                <select
                  value={paymentMethod}
                  onChange={(e) => setPaymentMethod(e.target.value)}
                  className="w-full px-4 py-3 rounded-[1.5rem] bg-[var(--pm-input)] text-xs font-bold text-[var(--pm-text)] border border-[var(--pm-border)] focus:border-[var(--pm-accent)] outline-none"
                >
                  <option>bKash Mobile Wallet</option>
                  <option>Nagad Mobile Wallet</option>
                  <option>Verified Bank Account</option>
                </select>
              </div>
              <button
                type="submit"
                disabled={isLoading}
                className="w-full py-3 rounded-[2rem] bg-[var(--pm-accent)] hover:bg-[var(--pm-accent-hover)] disabled:opacity-50 text-[var(--pm-accent-fg)] font-bold text-xs shadow-lg active-scale cursor-pointer"
              >
                {isBn ? 'উইথড্র রিকোয়েস্ট পাঠান' : 'Submit Withdrawal'}
              </button>
            </form>
          )}

          {/* Transfer Tab Content */}
          {activeTab === 'transfer' && (
            <form onSubmit={(e) => void handleTransfer(e)} className="space-y-4 animate-fade-in">
              <div>
                <label className="text-xs font-bold text-[var(--pm-text)] block mb-1.5">
                  {isBn ? 'প্রাপকের ইউজারনেম বা আইডি' : 'Recipient Username or Phone'}
                </label>
                <input
                  type="text"
                  required
                  value={recipientHandle}
                  onChange={(e) => setRecipientHandle(e.target.value)}
                  className="w-full px-4 py-3 rounded-[1.5rem] bg-[var(--pm-input)] text-xs font-bold text-[var(--pm-text)] placeholder:text-[var(--pm-muted)] border border-[var(--pm-border)] focus:border-[var(--pm-accent)] outline-none"
                  placeholder="@handle or 017XXXXXXXX"
                />
              </div>

              <div>
                <label className="text-xs font-bold text-[var(--pm-text)] block mb-1.5">
                  {isBn ? 'টাকার পরিমাণ (৳)' : 'Transfer Amount (৳)'}
                </label>
                <input
                  type="number"
                  min="1"
                  max={balance}
                  step="any"
                  required
                  value={amount}
                  onChange={(e) => setAmount(e.target.value)}
                  className="w-full px-4 py-3 rounded-[1.5rem] bg-[var(--pm-input)] text-xs font-mono font-bold text-[var(--pm-text)] placeholder:text-[var(--pm-muted)] border border-[var(--pm-border)] focus:border-[var(--pm-accent)] outline-none"
                  placeholder="500"
                />
              </div>

              <div className="pt-2">
                <button
                  type="submit"
                  disabled={isLoading}
                  className="w-full py-3 rounded-[2rem] bg-[var(--pm-accent)] hover:bg-[var(--pm-accent-hover)] disabled:opacity-50 text-[var(--pm-accent-fg)] font-bold text-xs shadow-lg transition-all flex items-center justify-center gap-2 active-scale cursor-pointer"
                >
                  <Send className="w-4 h-4" />
                  <span>{isBn ? 'তক্ষণাৎ সেন্ড মানি করুন' : 'Send Money Instantly'}</span>
                </button>
              </div>
            </form>
          )}
        </div>
      </div>
    </div>
  );
};
