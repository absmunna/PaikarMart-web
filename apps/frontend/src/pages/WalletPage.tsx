import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Wallet, ArrowUpRight, ArrowDownLeft, RefreshCw, Send, Plus, CreditCard,
  Search, Filter, ChevronRight, CheckCircle2, AlertCircle, Copy, HelpCircle, Phone
} from 'lucide-react';
import { apiClient } from '@/api/client';
import { useWalletStore } from '@/modules/wallet';
import { toast } from 'sonner';

interface Transaction {
  id: string;
  type: 'inflow' | 'outflow';
  title: string;
  subtitle: string;
  amount: number;
  createdAt?: string;
  date?: string; // fallback
  status: 'completed' | 'pending' | 'failed';
}

const FALLBACK_TRANSACTIONS: Transaction[] = [
  {
    id: 'TXN10293',
    type: 'inflow',
    title: 'রেফারেল বোনাস (Referral Bonus)',
    subtitle: 'পাইকার মার্ট রেফারেল ক্যাম্পেইন',
    amount: 500,
    date: '১৯ মে ২০২৬, সকাল ১০:১৫',
    status: 'completed'
  },
  {
    id: 'TXN10292',
    type: 'outflow',
    title: 'পণ্য ক্রয় (Order Purchase)',
    subtitle: 'অর্ডার আইডি #PM-88210',
    amount: 3200,
    date: '১৮ মে ২০২৬, বিকাল ৪:৩০',
    status: 'completed'
  }
];

export const WalletPage = () => {
  const storeWallet = useWalletStore();
  const [balance, setBalance] = useState(storeWallet.balance || 45280);
  const [coins, setCoins] = useState(storeWallet.coins || 2500);
  // Simulate pending escrow balance
  const [pendingEscrow, setPendingEscrow] = useState(12450);
  const [transactions, setTransactions] = useState<Transaction[]>(FALLBACK_TRANSACTIONS);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (storeWallet.balance !== undefined) setBalance(storeWallet.balance);
    if (storeWallet.coins !== undefined) setCoins(storeWallet.coins);
  }, [storeWallet.balance, storeWallet.coins]);

  const [activeModal, setActiveModal] = useState<'add' | 'send' | 'recharge' | 'withdraw' | null>(null);
  const [amountInput, setAmountInput] = useState('');
  const [phoneInput, setPhoneInput] = useState('');
  const [selectedProvider, setSelectedProvider] = useState('Grameenphone');
  const [filter, setFilter] = useState<'all' | 'inflow' | 'outflow'>('all');

  const fetchWalletData = async () => {
    try {
      setLoading(true);
      const res = await apiClient.get('/wallet');
      if (res.data) {
        setBalance(Number(res.data.balance));
        setCoins(res.data.coins);
        setPendingEscrow(res.data.pendingEscrow || 0);
        storeWallet.updateWallet(Number(res.data.balance), res.data.coins || coins);
        if (res.data.transactions?.length) setTransactions(res.data.transactions);
      }
    } catch (err) {
      setBalance(storeWallet.balance || 45280);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchWalletData();
  }, []);

  const handleAction = (type: 'add' | 'send' | 'recharge' | 'withdraw') => {
    setActiveModal(type);
  };

  const filteredTransactions = transactions.filter(t => {
    if (filter === 'all') return true;
    return t.type === filter;
  });

  return (
    <div className="w-full max-w-4xl mx-auto px-4 pb-28 text-[var(--pm-text)] pt-4 space-y-8">

      {/* ─── WALLET COCKPIT HEADER ─── */}
      <div className="flex flex-col md:flex-row gap-6">
        {/* Main Balance Card */}
        <motion.div
          className="flex-1 bg-gradient-to-tr from-purple-700 via-indigo-800 to-indigo-900 rounded-[2.5rem] p-8 shadow-2xl border border-indigo-500/30 relative overflow-hidden group"
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
        >
          <div className="absolute top-0 right-0 w-48 h-48 bg-white/5 rounded-full blur-[80px] -mr-16 -mt-16 group-hover:bg-white/10 transition-all duration-700" />

          <div className="relative z-10 space-y-6">
            <div className="flex justify-between items-start">
              <div className="space-y-1">
                <p className="text-[10px] uppercase font-black tracking-widest text-indigo-200 opacity-80">Available Balance</p>
                <h2 className="text-4xl font-black text-white leading-none">৳{balance.toLocaleString('bn-BD')}</h2>
              </div>
              <div className="bg-white/10 backdrop-blur-md text-white border border-white/20 px-4 py-2 rounded-2xl text-[10px] font-black uppercase tracking-widest">
                Verified Account
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4 pt-6 border-t border-white/10">
               <div>
                  <p className="text-[9px] text-indigo-200 font-bold uppercase tracking-tighter mb-1">Mart Coins</p>
                  <div className="flex items-center gap-1.5">
                    <span className="text-lg">🪙</span>
                    <span className="text-sm font-black text-white">{coins.toLocaleString('bn-BD')}</span>
                  </div>
               </div>
               <div>
                  <p className="text-[9px] text-indigo-200 font-bold uppercase tracking-tighter mb-1">Rewards Val</p>
                  <div className="flex items-center gap-1.5">
                    <span className="text-lg">🎁</span>
                    <span className="text-sm font-black text-white">৳{(coins / 10).toLocaleString()}</span>
                  </div>
               </div>
            </div>
          </div>
        </motion.div>

        {/* Escrow & Security Info */}
        <motion.div
          className="md:w-80 bg-[#0c101c] border border-white/5 rounded-[2.5rem] p-8 flex flex-col justify-between"
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
        >
          <div className="space-y-4">
             <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-amber-500/10 border border-amber-500/20 flex items-center justify-center text-amber-500">
                  <RefreshCw className="w-5 h-5 animate-spin-slow" />
                </div>
                <div>
                   <p className="text-[10px] font-black text-zinc-500 uppercase tracking-widest leading-none">Pending Escrow</p>
                   <p className="text-xl font-black text-amber-500 mt-1">৳{pendingEscrow.toLocaleString('bn-BD')}</p>
                </div>
             </div>
             <p className="text-[10px] text-zinc-500 font-bold leading-relaxed uppercase">
                Payment is securely held in Escrow and only released to the seller after you confirm order delivery.
             </p>
          </div>

          <div className="pt-6">
             <div className="flex items-center gap-2 p-3 rounded-2xl bg-emerald-500/5 border border-emerald-500/10">
                <CheckCircle2 className="w-4 h-4 text-emerald-500 shrink-0" />
                <span className="text-[9px] font-black text-emerald-400 uppercase tracking-tighter">100% Buyer Protection Active</span>
             </div>
          </div>
        </motion.div>
      </div>

      {/* Quick Action Grid */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
        {[
          { label: 'Top Up', bn: 'অ্যাড মানি', icon: Plus, type: 'add', color: 'bg-emerald-500/10 text-emerald-500 border-emerald-500/20' },
          { label: 'Withdraw', bn: 'টাকা তুলুন', icon: ArrowUpRight, type: 'withdraw', color: 'bg-blue-500/10 text-blue-500 border-blue-500/20' },
          { label: 'Send Money', bn: 'টাকা পাঠান', icon: Send, type: 'send', color: 'bg-indigo-500/10 text-indigo-500 border-indigo-500/20' },
          { label: 'Recharge', bn: 'রিচার্জ', icon: Phone, type: 'recharge', color: 'bg-orange-500/10 text-orange-500 border-orange-500/20' }
        ].map((item, idx) => (
          <button
            key={idx}
            onClick={() => handleAction(item.type as any)}
            className={`p-6 rounded-3xl border ${item.color} flex flex-col items-center gap-3 hover:scale-[1.02] active:scale-95 transition-all cursor-pointer shadow-lg shadow-black/20`}
          >
            <item.icon className="w-6 h-6" />
            <div className="text-center">
              <p className="text-[10px] font-black uppercase tracking-widest opacity-70">{item.label}</p>
              <p className="text-xs font-black">{item.bn}</p>
            </div>
          </button>
        ))}
      </div>

      {/* Transactions */}
      <div className="bg-[#0c101c] border border-white/5 rounded-[2.5rem] overflow-hidden">
        <div className="p-8 border-b border-white/5 flex flex-col sm:flex-row justify-between items-center gap-4">
          <div className="space-y-1">
            <h3 className="font-black text-lg text-white uppercase tracking-tighter">Transaction History</h3>
            <p className="text-[10px] text-zinc-500 font-bold uppercase tracking-widest">Real-time settlement logs</p>
          </div>

          <div className="flex items-center gap-2 bg-black/20 p-1 rounded-2xl">
            {['all', 'inflow', 'outflow'].map(t => (
              <button
                key={t}
                onClick={() => setFilter(t as any)}
                className={`px-4 py-2 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all ${
                  filter === t ? 'bg-indigo-500 text-white shadow-lg' : 'text-zinc-500 hover:text-white'
                }`}
              >
                {t}
              </button>
            ))}
          </div>
        </div>

        <div className="p-4 sm:p-8 space-y-4">
          {loading ? (
             <div className="py-20 text-center animate-pulse text-zinc-600 font-black uppercase text-xs">Processing data ledger...</div>
          ) : filteredTransactions.length === 0 ? (
             <div className="py-20 text-center space-y-4">
                <Wallet className="w-12 h-12 text-zinc-800 mx-auto" />
                <p className="text-zinc-600 font-black uppercase text-xs">No transaction records found</p>
             </div>
          ) : (
             filteredTransactions.map(txn => (
               <div key={txn.id} className="p-5 rounded-3xl bg-white/[0.02] border border-white/5 flex justify-between items-center gap-4 hover:border-white/10 transition-all group">
                  <div className="flex items-center gap-4">
                    <div className={`w-12 h-12 rounded-2xl flex items-center justify-center shrink-0 shadow-inner ${
                       txn.type === 'inflow' ? 'bg-emerald-500/10 text-emerald-500' : 'bg-rose-500/10 text-rose-500'
                    }`}>
                      {txn.type === 'inflow' ? <ArrowDownLeft className="w-6 h-6" /> : <ArrowUpRight className="w-6 h-6" />}
                    </div>
                    <div>
                       <h4 className="text-sm font-black text-white uppercase leading-none">{txn.title}</h4>
                       <p className="text-[10px] text-zinc-500 font-bold mt-1.5 uppercase tracking-tighter">
                          {txn.id} · {txn.date || txn.createdAt}
                       </p>
                    </div>
                  </div>
                  <div className="text-right">
                     <p className={`text-sm font-black ${txn.type === 'inflow' ? 'text-emerald-400' : 'text-rose-400'}`}>
                        {txn.type === 'inflow' ? '+' : '-'} ৳{txn.amount.toLocaleString()}
                     </p>
                     <span className="text-[8px] font-black text-zinc-600 uppercase tracking-widest mt-1 inline-block">Success</span>
                  </div>
               </div>
             ))
          )}
        </div>
      </div>

      {/* SHARED MODALS (Mock implementation) */}
      <AnimatePresence>
        {activeModal && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-xl">
             <motion.div
               initial={{ opacity: 0, scale: 0.95 }}
               animate={{ opacity: 1, scale: 1 }}
               exit={{ opacity: 0, scale: 0.95 }}
               className="bg-[#0c101c] border border-white/10 w-full max-w-sm rounded-[2.5rem] p-8 space-y-6 shadow-2xl relative"
             >
                <button
                  onClick={() => setActiveModal(null)}
                  className="absolute top-6 right-6 p-2 rounded-full bg-white/5 text-zinc-500 hover:text-white"
                >
                  <XIcon className="w-5 h-5" />
                </button>

                <div className="space-y-1">
                   <h3 className="text-xl font-black text-white uppercase">
                      {activeModal === 'add' ? 'Add Money' : activeModal === 'withdraw' ? 'Withdraw' : activeModal === 'send' ? 'Send Money' : 'Recharge'}
                   </h3>
                   <p className="text-[10px] text-zinc-500 font-bold uppercase tracking-widest">Select payment gateway method</p>
                </div>

                <div className="space-y-4">
                   <button className="w-full p-4 rounded-2xl bg-[#e2136e] flex items-center justify-between text-white font-black text-xs uppercase tracking-widest hover:brightness-110 transition-all">
                      <span>Direct via bKash</span>
                      <ChevronRight className="w-4 h-4" />
                   </button>
                   <button className="w-full p-4 rounded-2xl bg-orange-600 flex items-center justify-between text-white font-black text-xs uppercase tracking-widest hover:brightness-110 transition-all">
                      <span>Nagad Gateway</span>
                      <ChevronRight className="w-4 h-4" />
                   </button>
                   <button className="w-full p-4 rounded-2xl bg-zinc-800 border border-white/5 flex items-center justify-between text-white font-black text-xs uppercase tracking-widest hover:bg-zinc-700 transition-all">
                      <span>Rocket / Others</span>
                      <ChevronRight className="w-4 h-4" />
                   </button>
                </div>

                <div className="pt-2 text-center">
                   <p className="text-[9px] text-zinc-500 font-bold uppercase leading-relaxed">
                      Powered by PaikarMart Secure Payment Bridge.<br/>PCI-DSS Compliant Infrastructure.
                   </p>
                </div>
             </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
};

// Helper SVG X Icon Component
const XIcon = ({ className }: { className: string }) => (
  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2.5} stroke="currentColor" className={className}>
    <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
  </svg>
);
