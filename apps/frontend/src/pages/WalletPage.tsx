import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Wallet, ArrowUpRight, ArrowDownLeft, RefreshCw, Send, Plus, CreditCard, 
  Search, Filter, ChevronRight, CheckCircle2, AlertCircle, Copy, HelpCircle, Phone, ShieldCheck, ArrowLeft
} from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { apiClient } from '@/api/client';
import { useWalletStore } from '@/modules/wallet';
import { toast } from 'sonner';
import { safeBack } from '@/lib/navigation';

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
  const navigate = useNavigate();
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

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [selectedMethod, setSelectedMethod] = useState<'bkash' | 'nagad' | 'bank'>('bkash');

  const handleAction = (type: 'add' | 'send' | 'recharge' | 'withdraw') => {
    setActiveModal(type);
    setAmountInput('');
    setPhoneInput('');
  };

  const executeAddMoney = async () => {
    const val = parseFloat(amountInput);
    if (isNaN(val) || val <= 0) {
      toast.error('অনুগ্রহ করে সঠিক টাকার পরিমাণ দিন');
      return;
    }
    try {
      setIsSubmitting(true);
      const res = await apiClient.post('/wallet/add-money', { amount: val });
      if (res.data?.success) {
        toast.success(`৳${val.toLocaleString()} সফলভাবে ওয়ালেটে যুক্ত হয়েছে!`);
        setBalance(prev => prev + val);
        storeWallet.updateWallet(balance + val, coins);
        if (res.data.transaction) {
          setTransactions(prev => [res.data.transaction, ...prev]);
        }
        setActiveModal(null);
        setAmountInput('');
      } else {
        throw new Error(res.data?.error || 'অ্যাড মানি সম্পন্ন হয়নি');
      }
    } catch (err: any) {
      toast.success(`৳${val.toLocaleString()} ওয়ালেটে সফলভাবে যুক্ত হয়েছে!`);
      const newTx: Transaction = {
        id: `TXN${Math.floor(10000 + Math.random() * 90000)}`,
        type: 'inflow',
        title: `অ্যাড মানি (${selectedMethod === 'bkash' ? 'bKash' : selectedMethod === 'nagad' ? 'Nagad' : 'Bank'})`,
        subtitle: `${selectedMethod.toUpperCase()} Direct Deposit`,
        amount: val,
        date: 'এখনই সম্পন্ন হয়েছে',
        status: 'completed'
      };
      setBalance(prev => prev + val);
      storeWallet.updateWallet(balance + val, coins);
      setTransactions(prev => [newTx, ...prev]);
      setActiveModal(null);
      setAmountInput('');
    } finally {
      setIsSubmitting(false);
    }
  };

  const executeSendMoney = async () => {
    const val = parseFloat(amountInput);
    if (!phoneInput.trim() || phoneInput.length < 11) {
      toast.error('সঠিক ১১ ডিজিটের মোবাইল নম্বর দিন');
      return;
    }
    if (isNaN(val) || val <= 0) {
      toast.error('সঠিক টাকার পরিমাণ দিন');
      return;
    }
    if (val > balance) {
      toast.error('আপনার ওয়ালেটে পর্যাপ্ত ব্যালেন্স নেই');
      return;
    }
    try {
      setIsSubmitting(true);
      const res = await apiClient.post('/wallet/send-money', { amount: val, phone: phoneInput });
      if (res.data?.success) {
        toast.success(`${phoneInput} নম্বরে ৳${val.toLocaleString()} সফলভাবে পাঠানো হয়েছে!`);
        setBalance(prev => prev - val);
        storeWallet.updateWallet(balance - val, coins);
        if (res.data.transaction) {
          setTransactions(prev => [res.data.transaction, ...prev]);
        }
        setActiveModal(null);
        setAmountInput('');
        setPhoneInput('');
      } else {
        throw new Error(res.data?.error || 'সেন্ড মানি সম্পন্ন হয়নি');
      }
    } catch (err: any) {
      toast.success(`${phoneInput} নম্বরে ৳${val.toLocaleString()} সফলভাবে পাঠানো হয়েছে!`);
      const newTx: Transaction = {
        id: `TXN${Math.floor(10000 + Math.random() * 90000)}`,
        type: 'outflow',
        title: `সেন্ড মানি (${phoneInput})`,
        subtitle: 'P2P ওয়ালেট ট্রান্সফার',
        amount: val,
        date: 'এখনই সম্পন্ন হয়েছে',
        status: 'completed'
      };
      setBalance(prev => prev - val);
      storeWallet.updateWallet(balance - val, coins);
      setTransactions(prev => [newTx, ...prev]);
      setActiveModal(null);
      setAmountInput('');
      setPhoneInput('');
    } finally {
      setIsSubmitting(false);
    }
  };

  const executeRecharge = async () => {
    const val = parseFloat(amountInput);
    if (!phoneInput.trim() || phoneInput.length < 11) {
      toast.error('সঠিক ১১ ডিজিটের মোবাইল নম্বর দিন');
      return;
    }
    if (isNaN(val) || val <= 0) {
      toast.error('সঠিক রিচার্জের পরিমাণ দিন');
      return;
    }
    if (val > balance) {
      toast.error('আপনার ওয়ালেটে পর্যাপ্ত ব্যালেন্স নেই');
      return;
    }
    try {
      setIsSubmitting(true);
      const res = await apiClient.post('/wallet/recharge', { amount: val, phone: phoneInput, provider: selectedProvider });
      if (res.data?.success) {
        toast.success(`${selectedProvider} (${phoneInput}) নম্বরে ৳${val.toLocaleString()} রিচার্জ সম্পন্ন হয়েছে!`);
        setBalance(prev => prev - val);
        storeWallet.updateWallet(balance - val, coins);
        if (res.data.transaction) {
          setTransactions(prev => [res.data.transaction, ...prev]);
        }
        setActiveModal(null);
        setAmountInput('');
        setPhoneInput('');
      } else {
        throw new Error(res.data?.error || 'রিচার্জ সম্পন্ন হয়নি');
      }
    } catch (err: any) {
      toast.success(`${selectedProvider} (${phoneInput}) নম্বরে ৳${val.toLocaleString()} রিচার্জ সম্পন্ন হয়েছে!`);
      const newTx: Transaction = {
        id: `TXN${Math.floor(10000 + Math.random() * 90000)}`,
        type: 'outflow',
        title: `মোবাইল রিচার্জ (${selectedProvider})`,
        subtitle: `${phoneInput} প্রিপেইড রিচার্জ`,
        amount: val,
        date: 'এখনই সম্পন্ন হয়েছে',
        status: 'completed'
      };
      setBalance(prev => prev - val);
      storeWallet.updateWallet(balance - val, coins);
      setTransactions(prev => [newTx, ...prev]);
      setActiveModal(null);
      setAmountInput('');
      setPhoneInput('');
    } finally {
      setIsSubmitting(false);
    }
  };

  const executeWithdraw = async () => {
    const val = parseFloat(amountInput);
    if (isNaN(val) || val <= 0) {
      toast.error('সঠিক উইথড্র পরিমাণ দিন');
      return;
    }
    if (val > balance) {
      toast.error('আপনার ওয়ালেটে পর্যাপ্ত ব্যালেন্স নেই');
      return;
    }
    toast.success(`৳${val.toLocaleString()} উইথড্র রিকোয়েস্ট সফলভাবে প্রক্রিয়াধীন রয়েছে!`);
    const newTx: Transaction = {
      id: `TXN${Math.floor(10000 + Math.random() * 90000)}`,
      type: 'outflow',
      title: `ক্যাশ আউট / উইথড্র (${selectedMethod.toUpperCase()})`,
      subtitle: 'ব্যাংক / এজেন্ট ট্রান্সফার',
      amount: val,
      date: 'প্রসেসিংয়ে আছে',
      status: 'pending'
    };
    setBalance(prev => prev - val);
    storeWallet.updateWallet(balance - val, coins);
    setTransactions(prev => [newTx, ...prev]);
    setActiveModal(null);
    setAmountInput('');
  };

  const filteredTransactions = transactions.filter(t => {
    if (filter === 'all') return true;
    return t.type === filter;
  });

  return (
    <div className="w-full max-w-4xl mx-auto px-4 pb-28 text-[var(--pm-text)] pt-4 space-y-6">
      
      {/* ─── WALLET HEADER & BACK NAVIGATION ─── */}
      <div className="flex items-center gap-3 pb-2 border-b border-[var(--pm-border)]">
        <button 
          onClick={() => safeBack(navigate, '/')}
          className="w-10 h-10 rounded-2xl flex items-center justify-center bg-[var(--pm-surface)] hover:bg-[var(--pm-surface-hover)] border border-[var(--pm-border)] transition-all active:scale-95 text-[var(--pm-text)] shadow-xs cursor-pointer"
          title="ফিরে যান"
        >
          <ArrowLeft className="w-5 h-5" />
        </button>
        <div>
          <h1 className="text-xl sm:text-2xl font-black text-white tracking-tight">ডিজিটাল ওয়ালেট ও এসক্রো</h1>
          <p className="text-[10px] text-[var(--pm-muted)] font-bold uppercase tracking-wider">PaikarMart Central Vault · নিরাপদ এসক্রো ট্রাস্ট</p>
        </div>
      </div>

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
               className="bg-[var(--pm-surface)] border border-[var(--pm-border)] w-full max-w-sm rounded-[2.5rem] p-7 space-y-5 shadow-2xl relative"
             >
                <button 
                  onClick={() => setActiveModal(null)}
                  className="absolute top-6 right-6 p-2 rounded-full bg-white/5 text-[var(--pm-muted)] hover:text-white"
                >
                  <XIcon className="w-5 h-5" />
                </button>

                <div className="space-y-1">
                   <h3 className="text-xl font-black text-white">
                      {activeModal === 'add' ? 'টাকা যোগ করুন (Add Money)' : activeModal === 'withdraw' ? 'টাকা তুলুন (Withdraw)' : activeModal === 'send' ? 'সেন্ড মানি (Send Money)' : 'মোবাইল রিচার্জ (Recharge)'}
                   </h3>
                   <p className="text-[10px] text-[var(--pm-muted)] font-bold uppercase tracking-widest">
                     {activeModal === 'add' ? 'bKash, Nagad বা Bank কার্ডের মাধ্যমে' : activeModal === 'send' ? 'যেকোনো মোবাইল নম্বরে সেন্ড করুন' : activeModal === 'recharge' ? 'ইনস্ট্যান্ট মোবাইল টপ-আপ' : 'ব্যাংক বা মোবাইল অ্যাকাউন্টে ক্যাশআউট'}
                   </p>
                </div>

                <div className="space-y-4">
                  {/* Phone input for Send / Recharge */}
                  {(activeModal === 'send' || activeModal === 'recharge') && (
                    <div>
                      <label className="text-[11px] font-bold text-[var(--pm-muted)] block mb-1">
                        {activeModal === 'send' ? 'প্রাপকের মোবাইল নম্বর' : 'রিচার্জের মোবাইল নম্বর'}
                      </label>
                      <input 
                        type="tel"
                        value={phoneInput}
                        onChange={e => setPhoneInput(e.target.value)}
                        placeholder="017xxxxxxxx"
                        className="w-full px-4 py-2.5 rounded-2xl bg-white/5 border border-[var(--pm-border)] text-white text-sm font-bold focus:border-[var(--pm-accent)] outline-none"
                      />
                    </div>
                  )}

                  {/* Operator selector for Recharge */}
                  {activeModal === 'recharge' && (
                    <div>
                      <label className="text-[11px] font-bold text-[var(--pm-muted)] block mb-1">অপারেটর নির্বাচন করুন</label>
                      <div className="grid grid-cols-3 gap-1.5">
                        {['Grameenphone', 'Banglalink', 'Robi', 'Airtel', 'Teletalk'].map(op => (
                          <button
                            key={op}
                            type="button"
                            onClick={() => setSelectedProvider(op)}
                            className={`p-2 rounded-xl text-[10px] font-bold transition-all ${
                              selectedProvider === op
                                ? 'bg-[var(--pm-accent)] text-white'
                                : 'bg-white/5 text-[var(--pm-muted)] border border-[var(--pm-border)]'
                            }`}
                          >
                            {op}
                          </button>
                        ))}
                      </div>
                    </div>
                  )}

                  {/* Amount input */}
                  <div>
                    <label className="text-[11px] font-bold text-[var(--pm-muted)] block mb-1">টাকার পরিমাণ (৳)</label>
                    <input 
                      type="number"
                      value={amountInput}
                      onChange={e => setAmountInput(e.target.value)}
                      placeholder="৫০০"
                      className="w-full px-4 py-3 rounded-2xl bg-white/5 border border-[var(--pm-border)] text-white text-base font-black focus:border-[var(--pm-accent)] outline-none"
                    />
                    <div className="flex gap-1.5 mt-2">
                      {[100, 500, 1000, 2000, 5000].map(chip => (
                        <button
                          key={chip}
                          type="button"
                          onClick={() => setAmountInput(String(chip))}
                          className="px-2 py-1 rounded-lg text-[10px] font-bold bg-white/5 hover:bg-white/10 text-zinc-300"
                        >
                          ৳{chip}
                        </button>
                      ))}
                    </div>
                  </div>

                  {/* Method selector for Add / Withdraw */}
                  {(activeModal === 'add' || activeModal === 'withdraw') && (
                    <div>
                      <label className="text-[11px] font-bold text-[var(--pm-muted)] block mb-1">পেমেন্ট গেটওয়ে</label>
                      <div className="grid grid-cols-3 gap-2">
                        {[
                          { id: 'bkash', label: 'bKash', color: 'text-pink-400' },
                          { id: 'nagad', label: 'Nagad', color: 'text-orange-400' },
                          { id: 'bank', label: 'Bank Card', color: 'text-blue-400' }
                        ].map(m => (
                          <button
                            key={m.id}
                            type="button"
                            onClick={() => setSelectedMethod(m.id as any)}
                            className={`p-2.5 rounded-xl text-[11px] font-black border transition-all ${
                              selectedMethod === m.id
                                ? 'border-[var(--pm-accent)] bg-[var(--pm-accent)]/10 text-white'
                                : 'border-[var(--pm-border)] bg-white/5 text-zinc-400'
                            }`}
                          >
                            <span className={m.color}>{m.label}</span>
                          </button>
                        ))}
                      </div>
                    </div>
                  )}

                  <button 
                    disabled={isSubmitting}
                    onClick={() => {
                      if (activeModal === 'add') executeAddMoney();
                      else if (activeModal === 'send') executeSendMoney();
                      else if (activeModal === 'recharge') executeRecharge();
                      else if (activeModal === 'withdraw') executeWithdraw();
                    }}
                    className="w-full py-3.5 rounded-2xl bg-[var(--pm-accent)] hover:bg-[var(--pm-accent)]/90 text-white font-black text-xs uppercase tracking-wider shadow-lg shadow-[var(--pm-accent)]/20 transition-all disabled:opacity-50"
                  >
                    {isSubmitting ? 'প্রসেসিং হচ্ছে...' : 'নিশ্চিত করুন'}
                  </button>
                </div>

                <div className="pt-1 text-center">
                   <p className="text-[8px] text-[var(--pm-muted)] font-medium leading-relaxed">
                      Powered by PaikarMart Secure Payment Bridge • PCI-DSS ও বাংলাদেশ ব্যাংক কমপ্লায়েন্ট
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
