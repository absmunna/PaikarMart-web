import React, { useState, useEffect } from 'react';
import { User, WalletTransaction as SharedWalletTransaction, PortalTab } from '@/types';
import {
  Wallet,
  ArrowUpRight,
  ArrowDownLeft,
  CheckCircle2,
  History,
  ShieldAlert,
  Send,
  Award,
  Search,
  ArrowDown,
  ArrowUp,
  Layers,
  TrendingUp,
  UserCheck,
  ShieldCheck,
  Lock
} from 'lucide-react';
import { useLanguage } from '@/contexts/LanguageContext';
import { useWalletStore, EscrowLedgerPanel } from '@/features/wallet';
import { ResponsiveContainer, AreaChart, Area, XAxis, YAxis, Tooltip, CartesianGrid } from 'recharts';

interface WalletPortalProps {
  currentUser: User;
  onUpdateUser: (updatedUser: User) => void;
  onSelectTab: (tab: PortalTab) => void;
  onOpenVendorModal: () => void;
}

export const WalletPortal: React.FC<WalletPortalProps> = ({
  currentUser,
  onUpdateUser
}) => {
  const { language } = useLanguage();
  const isBn = language === 'bn';

  const {
    balance,
    coins,
    transactions: storeTransactions,
    escrows,
    escrowSummary,
    isLoading,
    fetchWalletData,
    depositFunds,
    withdrawFunds,
    transferFunds,
    releaseEscrow,
    disputeEscrow,
    redeemCoins
  } = useWalletStore();

  const [activeTab, setActiveTab] = useState<
    'balance' | 'escrow' | 'history' | 'deposit' | 'withdraw' | 'transfer'
  >('balance');
  const [amount, setAmount] = useState<string>('1000');
  const [paymentMethod, setPaymentMethod] = useState<string>('bKash Mobile Banking');
  const [accountDetails, setAccountDetails] = useState<string>('017********');
  const [recipientHandle, setRecipientHandle] = useState<string>('');
  const [transferNote, setTransferNote] = useState<string>('');
  const [successMsg, setSuccessMsg] = useState<string | null>(null);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  // Transaction history filter & search states
  const [txSearchQuery, setTxSearchQuery] = useState('');
  const [txFilterType, setTxFilterType] = useState<'all' | 'incoming' | 'outgoing'>('all');

  useEffect(() => {
    void fetchWalletData(currentUser.id || 'user_me');
  }, [currentUser.id, fetchWalletData]);

  // Keep currentUser synced with authoritative store balance/coins
  const displayBalance = balance;
  const displayCoins = coins ?? 0;

  const syncUserState = (nextBalance: number, nextCoins: number) => {
    const mappedTx: SharedWalletTransaction[] = useWalletStore.getState().transactions.slice(0, 20).map((t) => ({
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
      balance: nextBalance,
      rewardPoints: nextCoins,
      transactions: mappedTx
    });
  };

  // Registered contacts for P2P transfer
  const registeredUsers = [
    {
      handle: '@sarah_johnson',
      name: 'Sarah Johnson',
      avatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&w=128&h=128&q=80',
      verified: true
    },
    {
      handle: '@david_kim',
      name: 'David Kim',
      avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=128&h=128&q=80',
      verified: true
    },
    {
      handle: '@apex_electronics',
      name: 'Apex Electronics (Store)',
      avatar: 'https://images.unsplash.com/photo-1555529669-e69e7aa0ba9a?auto=format&fit=crop&w=128&h=128&q=80',
      verified: true
    }
  ];

  const filteredUsers = registeredUsers.filter(
    (u) =>
      u.handle.toLowerCase().includes(recipientHandle.toLowerCase()) ||
      u.name.toLowerCase().includes(recipientHandle.toLowerCase())
  );

  const handleDeposit = async (e: React.FormEvent) => {
    e.preventDefault();
    const val = parseFloat(amount);
    if (Number.isNaN(val) || val <= 0) {
      setErrorMsg(isBn ? 'দয়া করে সঠিক পরিমাণ লিখুন।' : 'Please enter a valid amount.');
      return;
    }

    try {
      await depositFunds({
        userId: currentUser.id || 'user_me',
        amount: val,
        method: paymentMethod
      });
      const state = useWalletStore.getState();
      syncUserState(state.balance, state.coins);
      setErrorMsg(null);
      setSuccessMsg(
        isBn
          ? `সফলভাবে ৳${val.toLocaleString()} ওয়ালেটে জমা হয়েছে!`
          : `Successfully added ৳${val.toLocaleString()} to your PaikarMart Wallet!`
      );
      setTimeout(() => {
        setSuccessMsg(null);
        setActiveTab('balance');
      }, 2200);
    } catch (err: any) {
      setErrorMsg(err?.message || 'Deposit failed');
    }
  };

  const handleWithdraw = async (e: React.FormEvent) => {
    e.preventDefault();
    const val = parseFloat(amount);
    if (Number.isNaN(val) || val < 50) {
      setErrorMsg(
        isBn ? 'সর্বনিম্ন ৫০ টাকা উইথড্র করা যাবে।' : 'Minimum withdrawal amount is ৳50.'
      );
      return;
    }

    try {
      await withdrawFunds({
        userId: currentUser.id || 'user_me',
        amount: val,
        method: paymentMethod,
        accountDetails
      });
      const state = useWalletStore.getState();
      syncUserState(state.balance, state.coins);
      setErrorMsg(null);
      setSuccessMsg(
        isBn
          ? `সফলভাবে ৳${val.toLocaleString()} উইথড্র রিকোয়েস্ট সম্পন্ন হয়েছে!`
          : `Successfully withdrew ৳${val.toLocaleString()} to your payout account!`
      );
      setTimeout(() => {
        setSuccessMsg(null);
        setActiveTab('balance');
      }, 2200);
    } catch (err: any) {
      setErrorMsg(err?.message || 'Withdrawal failed');
    }
  };

  const handleTransfer = async (e: React.FormEvent) => {
    e.preventDefault();
    const val = parseFloat(amount);
    if (Number.isNaN(val) || val <= 0) {
      setErrorMsg(isBn ? 'দয়া করে সঠিক পরিমাণ লিখুন।' : 'Please enter a valid amount.');
      return;
    }
    if (!recipientHandle.trim()) {
      setErrorMsg(
        isBn ? 'প্রাপকের ইউজারনেম বা ফোন নম্বর দিন।' : 'Please enter recipient handle or phone.'
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
      const state = useWalletStore.getState();
      syncUserState(state.balance, state.coins);
      setErrorMsg(null);
      setSuccessMsg(
        isBn
          ? `${recipientHandle}-কে ৳${val.toLocaleString()} সফলভাবে পাঠানো হয়েছে!`
          : `Successfully sent ৳${val.toLocaleString()} to ${recipientHandle}!`
      );
      setTimeout(() => {
        setSuccessMsg(null);
        setActiveTab('balance');
        setRecipientHandle('');
        setTransferNote('');
      }, 2200);
    } catch (err: any) {
      setErrorMsg(err?.message || 'Transfer failed');
    }
  };

  const handleRedeemAllCoins = async () => {
    if (displayCoins < 10) return;
    const bdt = await redeemCoins(Math.min(500, displayCoins), currentUser.id || 'user_me');
    if (bdt > 0) {
      const state = useWalletStore.getState();
      syncUserState(state.balance, state.coins);
      setSuccessMsg(
        isBn
          ? `রিওয়ার্ড কয়েন থেকে ৳${bdt.toLocaleString()} ওয়ালেটে যোগ হয়েছে!`
          : `Converted reward coins to ৳${bdt.toLocaleString()} wallet credit!`
      );
      setTimeout(() => setSuccessMsg(null), 3000);
    }
  };

  // Filtered transactions for ledger view
  const filteredTransactions = storeTransactions.filter((tx) => {
    const desc = (tx.description || tx.label || '').toLowerCase();
    const ref = (tx.referenceId || '').toLowerCase();
    const matchesSearch =
      desc.includes(txSearchQuery.toLowerCase()) || ref.includes(txSearchQuery.toLowerCase());

    const isIncoming =
      tx.type === 'deposit' ||
      tx.type === 'cashback' ||
      tx.type === 'credit' ||
      tx.type === 'receive' ||
      tx.type === 'escrow_release';
    const matchesType =
      txFilterType === 'all' ||
      (txFilterType === 'incoming' && isIncoming) ||
      (txFilterType === 'outgoing' && !isIncoming);

    return matchesSearch && matchesType;
  });

  const totalIncoming = storeTransactions
    .filter(
      (t) =>
        (t.currency === 'BDT' || !t.currency) &&
        (t.type === 'deposit' || t.type === 'cashback' || t.type === 'credit' || t.type === 'escrow_release')
    )
    .reduce((sum, t) => sum + t.amount, 0);

  const totalOutgoing = storeTransactions
    .filter(
      (t) =>
        (t.currency === 'BDT' || !t.currency) &&
        (t.type === 'withdrawal' ||
          t.type === 'transfer' ||
          t.type === 'purchase' ||
          t.type === 'escrow_hold' ||
          t.type === 'debit')
    )
    .reduce((sum, t) => sum + t.amount, 0);

  const monthlyActivityData = [
    { month: 'Jan', inflow: 14500, outflow: 9200 },
    { month: 'Feb', inflow: 18900, outflow: 11400 },
    { month: 'Mar', inflow: 24000, outflow: 15800 },
    { month: 'Apr', inflow: 21500, outflow: 13200 },
    { month: 'May', inflow: 32000, outflow: 18900 },
    { month: 'Jun', inflow: Math.max(displayBalance, 25000), outflow: totalOutgoing || 14500 }
  ];

  return (
    <div className="max-w-5xl mx-auto space-y-4 sm:space-y-6 pb-24 animate-fade-in">
      {/* Wallet Portal Banner */}
      <div className="relative overflow-hidden rounded-2xl sm:rounded-[2rem] bg-[var(--pm-card)] border border-[var(--pm-border)] p-4 sm:p-8 text-[var(--pm-text)] shadow-xl">
        <div className="relative z-10 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div className="space-y-1.5">
            <div className="flex items-center gap-2 text-xs font-semibold text-[var(--pm-accent)]">
              <Wallet className="w-4 h-4" />
              <span>{isBn ? 'পাইকারমার্ট পে & এসক্রো ভল্ট' : 'PaikarMart Pay & Escrow Vault'}</span>
            </div>
            <h1 className="text-xl sm:text-3xl font-black tracking-tight">
              {isBn ? 'ফাইন্যান্সিয়াল হাব ও এসক্রো লেজার' : 'Financial Hub & Escrow Ledger'}
            </h1>
            <p className="text-xs sm:text-sm text-[var(--pm-muted)] line-clamp-2">
              {isBn
                ? 'ইনস্ট্যান্ট MFS টপ-আপ, B2B এসক্রো সিকিউরিটি হোল্ড এবং পিটুপি ট্রান্সফার'
                : 'Instant MFS top-ups, B2B Escrow security holds & automated merchant settlements'}
            </p>
          </div>

          <button
            type="button"
            onClick={() => setActiveTab('escrow')}
            className="px-4 py-2.5 rounded-[2rem] bg-[var(--pm-surface)] hover:bg-[var(--pm-card-hover)] border border-[var(--pm-border)] text-xs font-bold flex items-center gap-2 whitespace-nowrap active-scale cursor-pointer shrink-0"
          >
            <ShieldCheck className="w-4 h-4 text-emerald-300" />
            <span>
              {isBn
                ? `এসক্রো হোল্ড: ৳${escrowSummary.totalHeld.toLocaleString()}`
                : `Escrow Held: ৳${escrowSummary.totalHeld.toLocaleString()}`}
            </span>
          </button>
        </div>
      </div>

      {/* Success / Error Banners */}
      {successMsg && (
        <div className="p-4 rounded-[1.5rem] bg-[var(--pm-success-soft)] border border-[var(--pm-success)]/30 flex items-center gap-3 text-[var(--pm-success)] text-xs font-bold animate-fade-in">
          <CheckCircle2 className="w-5 h-5 shrink-0" />
          <span>{successMsg}</span>
        </div>
      )}

      {errorMsg && (
        <div className="p-4 rounded-[1.5rem] bg-[var(--pm-danger-soft)] border border-[var(--pm-danger)]/30 flex items-center gap-3 text-[var(--pm-danger)] text-xs font-bold animate-fade-in">
          <ShieldAlert className="w-5 h-5 shrink-0" />
          <span>{errorMsg}</span>
        </div>
      )}

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 sm:gap-6">
        {/* Left Column: Balance Card & Action Tabs */}
        <div className="lg:col-span-1 space-y-5">
          {/* Balance Card */}
          <div className="p-4 sm:p-6 rounded-2xl sm:rounded-[2rem] bg-gradient-to-br from-slate-900 via-blue-900 to-indigo-900 text-white shadow-xl space-y-4 sm:space-y-5 border border-white/10">
            <div className="flex items-start justify-between gap-3">
              <div>
                <span className="text-[11px] font-bold text-blue-200 block">
                  {isBn ? 'উপলব্ধ ব্যালেন্স (BDT)' : 'Available Balance (BDT)'}
                </span>
                <h2 className="text-3xl font-mono tabular-nums font-black mt-1 tracking-tight">
                  ৳{displayBalance.toLocaleString()}
                </h2>
              </div>

              <button
                type="button"
                onClick={() => void handleRedeemAllCoins()}
                title={isBn ? 'কয়েন ক্যাশে রূপান্তর করুন' : 'Redeem coins to BDT'}
                className="bg-white/10 hover:bg-white/20 px-3 py-2 rounded-[1.25rem] text-right transition-colors active-scale cursor-pointer"
              >
                <div className="flex items-center gap-1.5 text-amber-300 justify-end">
                  <Award className="w-4 h-4" />
                  <span className="text-xs font-black font-mono tabular-nums">{displayCoins}</span>
                </div>
                <span className="text-[10px] text-blue-200 block">
                  {isBn ? 'রিডিম কয়েন' : 'Redeem Coins'}
                </span>
              </button>
            </div>

            <div className="pt-4 border-t border-white/15 flex items-center justify-between text-xs">
              <div className="text-blue-100">
                <span className="block text-[10px] text-blue-300">
                  {isBn ? 'এসক্রোতে সংরক্ষিত' : 'Locked in Escrow'}
                </span>
                <span className="font-mono tabular-nums font-bold text-amber-300">
                  ৳{escrowSummary.totalHeld.toLocaleString()}
                </span>
              </div>
              <div className="text-right text-blue-100">
                <span className="block text-[10px] text-blue-300">
                  {isBn ? 'অ্যাকাউন্ট' : 'Account'}
                </span>
                <span className="font-bold flex items-center gap-1">
                  <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" />
                  {currentUser.name}
                </span>
              </div>
            </div>
          </div>

          {/* Action Tabs Menu */}
          <div className="bg-[var(--pm-card)] border border-[var(--pm-border)] rounded-2xl sm:rounded-[2rem] p-2 shadow-sm space-y-1">
            {[
              { id: 'balance', label: isBn ? 'ওভারভিউ ড্যাশবোর্ড' : 'Overview Dashboard', icon: Wallet },
              {
                id: 'escrow',
                label: isBn ? 'এসক্রো সিকিউরিটি হোল্ড' : 'Escrow Security Holds',
                icon: ShieldCheck
              },
              { id: 'history', label: isBn ? 'লেনদেনের ইতিহাস ও গ্রাফ' : 'Transactions & Graph', icon: History },
              { id: 'deposit', label: isBn ? 'টাকা ডিপোজিট করুন' : 'Deposit Funds', icon: ArrowDownLeft },
              { id: 'withdraw', label: isBn ? 'উইথড্র রিকোয়েস্ট' : 'Withdrawal Payout', icon: ArrowUpRight },
              { id: 'transfer', label: isBn ? 'পিটুপি সেন্ড মানি' : 'P2P Transfer', icon: Send }
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
                  className={`w-full flex items-center gap-3 px-4 py-2.5 rounded-[1.5rem] text-xs font-bold transition-all active-scale cursor-pointer ${
                    isActive
                      ? 'bg-[var(--pm-accent)] text-[var(--pm-accent-fg)] shadow-sm'
                      : 'text-[var(--pm-muted)] hover:bg-[var(--pm-card-hover)] hover:text-[var(--pm-text)]'
                  }`}
                >
                  <Icon className="w-4 h-4 shrink-0" />
                  <span className="truncate">{tab.label}</span>
                </button>
              );
            })}
          </div>
        </div>

        {/* Right Column: Tab Content Area */}
        <div className="lg:col-span-2 bg-[var(--pm-card)] border border-[var(--pm-border)] rounded-2xl sm:rounded-[2rem] p-4 sm:p-7 shadow-sm">
          {/* Overview Tab */}
          {activeTab === 'balance' && (
            <div className="space-y-6 animate-fade-in">
              <div>
                <h3 className="text-lg font-black text-[var(--pm-text)]">
                  {isBn ? 'ওয়ালেট ও এসক্রো ওভারভিউ' : 'Wallet & Escrow Overview'}
                </h3>
                <p className="text-xs text-[var(--pm-muted)] mt-0.5">
                  {isBn
                    ? 'আপনার ফাইন্যান্সিয়াল স্ট্যাটাস, এসক্রো হোল্ড এবং কুইক অ্যাকশন'
                    : 'Financial summary, protected B2B escrow holds & instant transfers'}
                </p>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                <button
                  type="button"
                  onClick={() => setActiveTab('deposit')}
                  className="p-4 rounded-[1.5rem] bg-[var(--pm-accent-soft)] border border-[var(--pm-accent-border)] hover:border-[var(--pm-accent)] text-left transition-all active-scale cursor-pointer"
                >
                  <div className="w-9 h-9 rounded-[1rem] bg-[var(--pm-accent)] text-[var(--pm-accent-fg)] flex items-center justify-center mb-3 shadow-sm">
                    <ArrowDownLeft className="w-4 h-4" />
                  </div>
                  <h4 className="text-xs font-black text-[var(--pm-text)]">
                    {isBn ? 'টাকা যোগ করুন' : 'Deposit Funds'}
                  </h4>
                  <p className="text-[11px] text-[var(--pm-muted)] mt-0.5">
                    {isBn ? 'বিকাশ, নগদ, কার্ড' : 'bKash, Nagad, Card'}
                  </p>
                </button>

                <button
                  type="button"
                  onClick={() => setActiveTab('escrow')}
                  className="p-4 rounded-[1.5rem] bg-[var(--pm-success-soft)] border border-[var(--pm-success)]/30 hover:border-[var(--pm-success)] text-left transition-all active-scale cursor-pointer"
                >
                  <div className="w-9 h-9 rounded-[1rem] bg-[var(--pm-success)] text-white flex items-center justify-center mb-3 shadow-sm">
                    <Lock className="w-4 h-4" />
                  </div>
                  <h4 className="text-xs font-black text-[var(--pm-text)]">
                    {isBn ? 'এসক্রো লেজার' : 'Escrow Vault'}
                  </h4>
                  <p className="text-[11px] text-[var(--pm-success)] font-mono tabular-nums mt-0.5">
                    ৳{escrowSummary.totalHeld.toLocaleString()} held
                  </p>
                </button>

                <button
                  type="button"
                  onClick={() => setActiveTab('transfer')}
                  className="p-4 rounded-[1.5rem] bg-[var(--pm-surface)] border border-[var(--pm-border)] hover:border-[var(--pm-accent)] text-left transition-all active-scale cursor-pointer"
                >
                  <div className="w-9 h-9 rounded-[1rem] bg-[var(--pm-accent)] text-[var(--pm-accent-fg)] flex items-center justify-center mb-3 shadow-sm">
                    <Send className="w-4 h-4" />
                  </div>
                  <h4 className="text-xs font-black text-[var(--pm-text)]">
                    {isBn ? 'সেন্ড মানি' : 'P2P Transfer'}
                  </h4>
                  <p className="text-[11px] text-[var(--pm-muted)] mt-0.5">
                    {isBn ? 'ইউজার বা নম্বরে' : 'Handle or Phone'}
                  </p>
                </button>
              </div>

              {/* Recent Transactions Preview */}
              <div className="space-y-3 pt-1">
                <div className="flex items-center justify-between text-xs font-bold text-[var(--pm-muted)]">
                  <span>{isBn ? 'সাম্প্রতিক লেনদেন' : 'Recent Transactions'}</span>
                  <button
                    type="button"
                    onClick={() => setActiveTab('history')}
                    className="text-[var(--pm-accent)] hover:underline text-xs cursor-pointer"
                  >
                    {isBn ? 'সব দেখুন' : 'View All'}
                  </button>
                </div>

                <div className="space-y-2">
                  {storeTransactions.slice(0, 5).map((tx) => {
                    const isIncoming =
                      tx.type === 'deposit' ||
                      tx.type === 'cashback' ||
                      tx.type === 'credit' ||
                      tx.type === 'escrow_release';
                    const isCoin = tx.currency === 'COIN';
                    return (
                      <div
                        key={tx.id}
                        className="p-3.5 rounded-[1.25rem] bg-[var(--pm-surface)] border border-[var(--pm-border)] flex items-center justify-between gap-3"
                      >
                        <div className="flex items-center gap-3 min-w-0">
                          <div
                            className={`w-9 h-9 rounded-[1rem] flex items-center justify-center shrink-0 ${
                              isIncoming
                                ? 'bg-[var(--pm-success-soft)] text-[var(--pm-success)]'
                                : 'bg-[var(--pm-warning-soft)] text-[var(--pm-warning)]'
                            }`}
                          >
                            {isIncoming ? (
                              <ArrowDownLeft className="w-4 h-4" />
                            ) : (
                              <ArrowUpRight className="w-4 h-4" />
                            )}
                          </div>
                          <div className="min-w-0">
                            <p className="text-xs font-bold text-[var(--pm-text)] truncate">
                              {tx.description || tx.label}
                            </p>
                            <p className="text-[11px] text-[var(--pm-muted)] font-mono truncate">
                              {tx.timestamp || tx.time} · Ref: {tx.referenceId || tx.id}
                            </p>
                          </div>
                        </div>
                        <span
                          className={`text-xs font-mono tabular-nums font-black shrink-0 ${
                            isIncoming ? 'text-[var(--pm-success)]' : 'text-[var(--pm-text)]'
                          }`}
                        >
                          {isIncoming ? '+' : '-'}
                          {isCoin ? `${tx.amount} Coins` : `৳${tx.amount.toLocaleString()}`}
                        </span>
                      </div>
                    );
                  })}
                </div>
              </div>
            </div>
          )}

          {/* Escrow & Protection Tab */}
          {activeTab === 'escrow' && (
            <EscrowLedgerPanel
              summary={escrowSummary}
              escrows={escrows}
              isLoading={isLoading}
              isBn={isBn}
              onReleaseEscrow={async (escrowId) => {
                await releaseEscrow(escrowId);
                const state = useWalletStore.getState();
                syncUserState(state.balance, state.coins);
              }}
              onDisputeEscrow={async (escrowId, reason) => {
                await disputeEscrow(escrowId, reason);
              }}
            />
          )}

          {/* History Tab */}
          {activeTab === 'history' && (
            <div className="space-y-5 animate-fade-in">
              <div>
                <h3 className="text-lg font-black text-[var(--pm-text)]">
                  {isBn ? 'লেনদেনের ইতিহাস ও গ্রাফ অ্যানালিটিক্স' : 'Transaction History & Analytics'}
                </h3>
                <p className="text-xs text-[var(--pm-muted)] mt-0.5">
                  {isBn ? 'মাসিক আয় বনাম খরচ এবং বিস্তারিত লেজার' : 'Monthly cashflow & ledger audit'}
                </p>
              </div>

              {/* Monthly Inflow vs Outflow Area Chart */}
              <div className="p-4 rounded-[1.5rem] bg-[var(--pm-surface)] border border-[var(--pm-border)] space-y-3">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <TrendingUp className="w-4 h-4 text-[var(--pm-accent)]" />
                    <h4 className="text-xs font-bold text-[var(--pm-text)]">
                      {isBn ? 'মাসিক ইনফ্লো বনাম আউটফ্লো (৳)' : 'Monthly Cashflow (BDT)'}
                    </h4>
                  </div>
                  <span className="text-[11px] text-[var(--pm-muted)] font-mono">2026 YTD</span>
                </div>

                <div className="h-48 w-full">
                  <ResponsiveContainer width="100%" height="100%">
                    <AreaChart data={monthlyActivityData} margin={{ top: 10, right: 10, left: -10, bottom: 0 }}>
                      <defs>
                        <linearGradient id="colorInflowPortal" x1="0" y1="0" x2="0" y2="1">
                          <stop offset="5%" stopColor="#10b981" stopOpacity={0.35} />
                          <stop offset="95%" stopColor="#10b981" stopOpacity={0} />
                        </linearGradient>
                        <linearGradient id="colorOutflowPortal" x1="0" y1="0" x2="0" y2="1">
                          <stop offset="5%" stopColor="#f59e0b" stopOpacity={0.35} />
                          <stop offset="95%" stopColor="#f59e0b" stopOpacity={0} />
                        </linearGradient>
                      </defs>
                      <CartesianGrid strokeDasharray="3 3" stroke="currentColor" opacity={0.12} />
                      <XAxis dataKey="month" stroke="#94a3b8" fontSize={10} tickLine={false} />
                      <YAxis stroke="#94a3b8" fontSize={10} tickLine={false} />
                      <Tooltip
                        contentStyle={{
                          backgroundColor: 'var(--pm-card)',
                          borderColor: 'var(--pm-border)',
                          borderRadius: '14px',
                          fontSize: '11px',
                          color: 'var(--pm-text)'
                        }}
                      />
                      <Area
                        type="monotone"
                        dataKey="inflow"
                        stroke="#10b981"
                        strokeWidth={2}
                        fillOpacity={1}
                        fill="url(#colorInflowPortal)"
                        name="Inflow (৳)"
                      />
                      <Area
                        type="monotone"
                        dataKey="outflow"
                        stroke="#f59e0b"
                        strokeWidth={2}
                        fillOpacity={1}
                        fill="url(#colorOutflowPortal)"
                        name="Outflow (৳)"
                      />
                    </AreaChart>
                  </ResponsiveContainer>
                </div>
              </div>

              {/* Summary Stats Strip */}
              <div className="grid grid-cols-2 gap-3">
                <div className="p-3.5 rounded-[1.5rem] bg-[var(--pm-success-soft)] border border-[var(--pm-success)]/30 flex items-center gap-3">
                  <div className="p-2 rounded-[1rem] bg-[var(--pm-success)] text-white">
                    <ArrowDown className="w-4 h-4" />
                  </div>
                  <div>
                    <span className="text-[11px] font-bold text-[var(--pm-success)]">
                      {isBn ? 'মোট ইনকামিং' : 'Total Incoming'}
                    </span>
                    <p className="text-base font-mono tabular-nums font-black text-[var(--pm-success)]">
                      ৳{totalIncoming.toLocaleString()}
                    </p>
                  </div>
                </div>

                <div className="p-3.5 rounded-[1.5rem] bg-[var(--pm-warning-soft)] border border-[var(--pm-warning)]/30 flex items-center gap-3">
                  <div className="p-2 rounded-[1rem] bg-[var(--pm-warning)] text-white">
                    <ArrowUp className="w-4 h-4" />
                  </div>
                  <div>
                    <span className="text-[11px] font-bold text-[var(--pm-warning)]">
                      {isBn ? 'মোট আউটগোয়িং' : 'Total Outgoing'}
                    </span>
                    <p className="text-base font-mono tabular-nums font-black text-[var(--pm-warning)]">
                      ৳{totalOutgoing.toLocaleString()}
                    </p>
                  </div>
                </div>
              </div>

              {/* Search & Filter Toolbar */}
              <div className="flex flex-col sm:flex-row items-center gap-3">
                <div className="relative w-full sm:flex-1">
                  <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-[var(--pm-muted)]" />
                  <input
                    type="text"
                    value={txSearchQuery}
                    onChange={(e) => setTxSearchQuery(e.target.value)}
                    placeholder={isBn ? 'লেনদেন বা রেফারেন্স খুঁজুন...' : 'Search description or ref ID...'}
                    className="w-full pl-10 pr-4 py-2.5 bg-[var(--pm-input)] rounded-[2rem] text-xs font-medium text-[var(--pm-text)] placeholder:text-[var(--pm-muted)] border border-[var(--pm-border)] focus:border-[var(--pm-accent)] outline-none"
                  />
                </div>

                <div className="flex items-center gap-1.5 w-full sm:w-auto">
                  {[
                    { id: 'all', label: isBn ? 'সকল' : 'All' },
                    { id: 'incoming', label: isBn ? 'ইনকামিং' : 'Incoming' },
                    { id: 'outgoing', label: isBn ? 'আউটগোয়িং' : 'Outgoing' }
                  ].map((filter) => (
                    <button
                      key={filter.id}
                      type="button"
                      onClick={() => setTxFilterType(filter.id as any)}
                      className={`flex-1 sm:flex-initial px-3.5 py-2 rounded-[2rem] text-[11px] font-bold transition-all active-scale cursor-pointer ${
                        txFilterType === filter.id
                          ? 'bg-[var(--pm-accent)] text-[var(--pm-accent-fg)] shadow-xs'
                          : 'bg-[var(--pm-surface)] border border-[var(--pm-border)] text-[var(--pm-muted)] hover:bg-[var(--pm-card-hover)] hover:text-[var(--pm-text)]'
                      }`}
                    >
                      {filter.label}
                    </button>
                  ))}
                </div>
              </div>

              {/* Detailed Transaction Items List */}
              <div className="space-y-2.5 max-h-80 overflow-y-auto pr-1">
                {filteredTransactions.length > 0 ? (
                  filteredTransactions.map((tx) => {
                    const isIncoming =
                      tx.type === 'deposit' ||
                      tx.type === 'cashback' ||
                      tx.type === 'credit' ||
                      tx.type === 'escrow_release';
                    const isCoin = tx.currency === 'COIN';
                    return (
                      <div
                        key={tx.id}
                        className="p-4 rounded-[1.5rem] bg-[var(--pm-surface)] border border-[var(--pm-border)] flex items-center justify-between gap-3"
                      >
                        <div className="flex items-center gap-3 min-w-0">
                          <div
                            className={`w-9 h-9 rounded-[1rem] flex items-center justify-center shrink-0 ${
                              isIncoming
                                ? 'bg-[var(--pm-success-soft)] text-[var(--pm-success)]'
                                : 'bg-[var(--pm-warning-soft)] text-[var(--pm-warning)]'
                            }`}
                          >
                            {isIncoming ? (
                              <ArrowDownLeft className="w-4 h-4" />
                            ) : (
                              <ArrowUpRight className="w-4 h-4" />
                            )}
                          </div>
                          <div className="min-w-0">
                            <p className="text-xs font-bold text-[var(--pm-text)] truncate">
                              {tx.description || tx.label}
                            </p>
                            <p className="text-[11px] text-[var(--pm-muted)] mt-0.5 font-mono truncate">
                              {tx.type.replace('_', ' ')} · {tx.timestamp || tx.time} · Ref:{' '}
                              {tx.referenceId || tx.id}
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
                            {isCoin ? `${tx.amount} Coins` : `৳${tx.amount.toLocaleString()}`}
                          </span>
                          <span className="block text-[10px] text-[var(--pm-success)] font-semibold">
                            {tx.status}
                          </span>
                        </div>
                      </div>
                    );
                  })
                ) : (
                  <div className="text-center py-12">
                    <Layers className="w-10 h-10 text-[var(--pm-muted)] mx-auto mb-2 opacity-50" />
                    <p className="text-xs font-bold text-[var(--pm-muted)]">
                      {isBn ? 'কোনো লেনদেন পাওয়া যায়নি' : 'No transactions found'}
                    </p>
                  </div>
                )}
              </div>
            </div>
          )}

          {/* Deposit Tab */}
          {activeTab === 'deposit' && (
            <form onSubmit={(e) => void handleDeposit(e)} className="space-y-4 animate-fade-in">
              <div>
                <h3 className="text-lg font-black text-[var(--pm-text)]">
                  {isBn ? 'ওয়ালেটে টাকা যোগ করুন' : 'Deposit Funds (BDT)'}
                </h3>
                <p className="text-xs text-[var(--pm-muted)] mt-0.5">
                  {isBn ? 'বিকাশ, নগদ, রকেট বা ব্যাংক নির্বাচন করুন' : 'Select MFS or bank gateway'}
                </p>
              </div>

              <div>
                <label className="text-xs font-bold text-[var(--pm-text)] block mb-1.5">
                  {isBn ? 'পরিমাণ (৳)' : 'Amount (৳)'}
                </label>
                <div className="relative">
                  <span className="text-xs font-mono font-black text-[var(--pm-muted)] absolute left-3.5 top-1/2 -translate-y-1/2 select-none">
                    ৳
                  </span>
                  <input
                    type="number"
                    min="10"
                    step="any"
                    required
                    value={amount}
                    onChange={(e) => setAmount(e.target.value)}
                    className="w-full pl-9 pr-4 py-3 rounded-[1.5rem] bg-[var(--pm-input)] text-xs font-mono font-bold text-[var(--pm-text)] placeholder:text-[var(--pm-muted)] border border-[var(--pm-border)] focus:border-[var(--pm-accent)] outline-none"
                    placeholder="5000"
                  />
                </div>
              </div>

              <div>
                <label className="text-xs font-bold text-[var(--pm-text)] block mb-1.5">
                  {isBn ? 'পেমেন্ট গেটওয়ে' : 'Payment Gateway'}
                </label>
                <select
                  value={paymentMethod}
                  onChange={(e) => setPaymentMethod(e.target.value)}
                  className="w-full px-4 py-3 rounded-[1.5rem] bg-[var(--pm-input)] text-xs font-bold text-[var(--pm-text)] border border-[var(--pm-border)] focus:border-[var(--pm-accent)] outline-none"
                >
                  <option>bKash Mobile Banking</option>
                  <option>Nagad Mobile Wallet</option>
                  <option>Rocket DBBL Mobile</option>
                  <option>SSLCommerz Visa / Mastercard</option>
                  <option>Direct Bank Wire (RTGS / BEFTN)</option>
                </select>
              </div>

              <div className="flex gap-2 pt-1">
                {['500', '1000', '5000', '10000', '25000'].map((preset) => (
                  <button
                    key={preset}
                    type="button"
                    onClick={() => setAmount(preset)}
                    className="flex-1 py-2 rounded-[2rem] bg-[var(--pm-surface)] border border-[var(--pm-border)] hover:bg-[var(--pm-accent-soft)] hover:text-[var(--pm-accent)] hover:border-[var(--pm-accent-border)] text-xs font-mono font-bold text-[var(--pm-text)] transition-colors active-scale cursor-pointer"
                  >
                    ৳{Number(preset).toLocaleString()}
                  </button>
                ))}
              </div>

              <div className="pt-2">
                <button
                  type="submit"
                  disabled={isLoading}
                  className="w-full py-3.5 rounded-[2rem] bg-[var(--pm-accent)] hover:bg-[var(--pm-accent-hover)] disabled:opacity-50 text-[var(--pm-accent-fg)] font-bold text-xs shadow-lg transition-all active-scale cursor-pointer"
                >
                  {isBn ? 'ডিপোজিট নিশ্চিত করুন' : 'Confirm & Deposit Funds'}
                </button>
              </div>
            </form>
          )}

          {/* Withdraw Tab */}
          {activeTab === 'withdraw' && (
            <form onSubmit={(e) => void handleWithdraw(e)} className="space-y-4 animate-fade-in">
              <div>
                <h3 className="text-lg font-black text-[var(--pm-text)]">
                  {isBn ? 'উইথড্রয়াল রিকোয়েস্ট' : 'Withdrawal Payout'}
                </h3>
                <p className="text-xs text-[var(--pm-muted)] mt-0.5">
                  {isBn ? 'আপনার ব্যাংক বা মোবাইল ওয়ালেটে ফান্ড তুলুন' : 'Withdraw funds to MFS or verified bank'}
                </p>
              </div>

              <div>
                <label className="text-xs font-bold text-[var(--pm-text)] block mb-1.5">
                  {isBn ? 'উইথড্রয়ালের পরিমাণ (৳)' : 'Withdrawal Amount (৳)'}
                </label>
                <input
                  type="number"
                  min="50"
                  max={displayBalance}
                  step="any"
                  required
                  value={amount}
                  onChange={(e) => setAmount(e.target.value)}
                  className="w-full px-4 py-3 rounded-[1.5rem] bg-[var(--pm-input)] text-xs font-mono font-bold text-[var(--pm-text)] placeholder:text-[var(--pm-muted)] border border-[var(--pm-border)] focus:border-[var(--pm-accent)] outline-none"
                  placeholder="1000"
                />
                <p className="text-[11px] text-[var(--pm-muted)] mt-1 font-mono tabular-nums">
                  Available for payout: ৳{displayBalance.toLocaleString()}
                </p>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="text-xs font-bold text-[var(--pm-text)] block mb-1.5">
                    {isBn ? 'মাধ্যম' : 'Payout Method'}
                  </label>
                  <select
                    value={paymentMethod}
                    onChange={(e) => setPaymentMethod(e.target.value)}
                    className="w-full px-4 py-3 rounded-[1.5rem] bg-[var(--pm-input)] text-xs font-bold text-[var(--pm-text)] border border-[var(--pm-border)] focus:border-[var(--pm-accent)] outline-none"
                  >
                    <option>bKash Mobile Wallet</option>
                    <option>Nagad Mobile Wallet</option>
                    <option>Verified Bank Account (BEFTN)</option>
                  </select>
                </div>

                <div>
                  <label className="text-xs font-bold text-[var(--pm-text)] block mb-1.5">
                    {isBn ? 'অ্যাকাউন্ট / মোবাইল নম্বর' : 'Account / Phone Number'}
                  </label>
                  <input
                    type="text"
                    required
                    value={accountDetails}
                    onChange={(e) => setAccountDetails(e.target.value)}
                    className="w-full px-4 py-3 rounded-[1.5rem] bg-[var(--pm-input)] text-xs font-mono font-bold text-[var(--pm-text)] border border-[var(--pm-border)] focus:border-[var(--pm-accent)] outline-none"
                  />
                </div>
              </div>

              <div className="pt-2">
                <button
                  type="submit"
                  disabled={isLoading}
                  className="w-full py-3.5 rounded-[2rem] bg-[var(--pm-accent)] hover:bg-[var(--pm-accent-hover)] disabled:opacity-50 text-[var(--pm-accent-fg)] font-bold text-xs shadow-lg transition-all active-scale cursor-pointer"
                >
                  {isBn ? 'উইথড্র রিকোয়েস্ট পাঠান' : 'Request Payout Withdrawal'}
                </button>
              </div>
            </form>
          )}

          {/* P2P Transfer Tab */}
          {activeTab === 'transfer' && (
            <form onSubmit={(e) => void handleTransfer(e)} className="space-y-4 animate-fade-in">
              <div>
                <h3 className="text-lg font-black text-[var(--pm-text)]">
                  {isBn ? 'পিটুপি ইনস্ট্যান্ট সেন্ড মানি' : 'P2P Instant Transfer'}
                </h3>
                <p className="text-xs text-[var(--pm-muted)] mt-0.5">
                  {isBn
                    ? 'ইউজারনেম বা মোবাইল নম্বর দিয়ে মুহূর্তেই টাকা পাঠান'
                    : 'Send funds instantly by user handle or phone number'}
                </p>
              </div>

              <div>
                <label className="text-xs font-bold text-[var(--pm-text)] block mb-1.5">
                  {isBn ? 'প্রাপকের ইউজারনেম বা মোবাইল নম্বর' : 'Recipient Handle or Phone'}
                </label>
                <input
                  type="text"
                  required
                  value={recipientHandle}
                  onChange={(e) => setRecipientHandle(e.target.value)}
                  className="w-full px-4 py-3 rounded-[1.5rem] bg-[var(--pm-input)] text-xs font-bold text-[var(--pm-text)] placeholder:text-[var(--pm-muted)] border border-[var(--pm-border)] focus:border-[var(--pm-accent)] outline-none"
                  placeholder="e.g. @sarah_johnson or 017XXXXXXXX"
                />

                {recipientHandle.trim() === '' && (
                  <div className="mt-2.5 flex flex-wrap gap-2">
                    {registeredUsers.map((u) => (
                      <button
                        key={u.handle}
                        type="button"
                        onClick={() => setRecipientHandle(u.handle)}
                        className="flex items-center gap-2 p-1.5 pr-3 rounded-[2rem] bg-[var(--pm-surface)] hover:bg-[var(--pm-accent-soft)] transition-all border border-[var(--pm-border)] hover:border-[var(--pm-accent-border)] text-left cursor-pointer"
                      >
                        <img src={u.avatar} alt={u.name} className="w-6 h-6 rounded-full object-cover" />
                        <div>
                          <p className="text-[11px] font-bold text-[var(--pm-text)] leading-tight">
                            {u.name}
                          </p>
                          <p className="text-[9px] text-[var(--pm-accent)] font-mono">
                            {u.handle}
                          </p>
                        </div>
                      </button>
                    ))}
                  </div>
                )}

                {recipientHandle.trim() !== '' && filteredUsers.length > 0 && (
                  <div className="mt-1.5 bg-[var(--pm-card)] border border-[var(--pm-border)] rounded-[1.5rem] shadow-lg overflow-hidden">
                    {filteredUsers.map((u) => (
                      <button
                        key={u.handle}
                        type="button"
                        onClick={() => setRecipientHandle(u.handle)}
                        className="w-full p-3 flex items-center justify-between hover:bg-[var(--pm-card-hover)] cursor-pointer transition-colors border-b border-[var(--pm-border)] last:border-none text-left"
                      >
                        <div className="flex items-center gap-3">
                          <img src={u.avatar} alt={u.name} className="w-8 h-8 rounded-full object-cover" />
                          <div>
                            <p className="text-xs font-bold text-[var(--pm-text)] flex items-center gap-1">
                              <span>{u.name}</span>
                              {u.verified && <UserCheck className="w-3.5 h-3.5 text-[var(--pm-accent)]" />}
                            </p>
                            <p className="text-[10px] text-[var(--pm-muted)] font-mono">{u.handle}</p>
                          </div>
                        </div>
                        <span className="text-[10px] font-bold text-[var(--pm-accent)]">
                          Select
                        </span>
                      </button>
                    ))}
                  </div>
                )}
              </div>

              <div>
                <label className="text-xs font-bold text-[var(--pm-text)] block mb-1.5">
                  {isBn ? 'টাকার পরিমাণ (৳)' : 'Transfer Amount (৳)'}
                </label>
                <input
                  type="number"
                  min="1"
                  max={displayBalance}
                  step="any"
                  required
                  value={amount}
                  onChange={(e) => setAmount(e.target.value)}
                  className="w-full px-4 py-3 rounded-[1.5rem] bg-[var(--pm-input)] text-xs font-mono font-bold text-[var(--pm-text)] placeholder:text-[var(--pm-muted)] border border-[var(--pm-border)] focus:border-[var(--pm-accent)] outline-none"
                  placeholder="500"
                />
              </div>

              <div>
                <label className="text-xs font-bold text-[var(--pm-text)] block mb-1.5">
                  {isBn ? 'নোট / রেফারেন্স (ঐচ্ছিক)' : 'Transfer Note / Memo (Optional)'}
                </label>
                <input
                  type="text"
                  value={transferNote}
                  onChange={(e) => setTransferNote(e.target.value)}
                  className="w-full px-4 py-3 rounded-[1.5rem] bg-[var(--pm-input)] text-xs font-medium text-[var(--pm-text)] placeholder:text-[var(--pm-muted)] border border-[var(--pm-border)] focus:border-[var(--pm-accent)] outline-none"
                  placeholder="e.g. Advance sample payment..."
                />
              </div>

              <div className="pt-2">
                <button
                  type="submit"
                  disabled={isLoading}
                  className="w-full py-3.5 rounded-[2rem] bg-[var(--pm-accent)] hover:bg-[var(--pm-accent-hover)] disabled:opacity-50 text-[var(--pm-accent-fg)] font-bold text-xs shadow-lg transition-all flex items-center justify-center gap-2 active-scale cursor-pointer"
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
