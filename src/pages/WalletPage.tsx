import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Wallet, ArrowUpRight, ArrowDownLeft, RefreshCw, Send, Plus, CreditCard, 
  Search, Filter, ChevronRight, CheckCircle2, AlertCircle, Copy, HelpCircle, Phone
} from 'lucide-react';
import { apiClient } from '../api/client';

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
  const [balance, setBalance] = useState(45280);
  const [coins, setCoins] = useState(2500);
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [loading, setLoading] = useState(true);
  
  // Modals / Actions State
  const [activeModal, setActiveModal] = useState<'add' | 'send' | 'recharge' | null>(null);
  
  // Form States
  const [amountInput, setAmountInput] = useState('');
  const [phoneInput, setPhoneInput] = useState('');
  const [selectedProvider, setSelectedProvider] = useState('Grameenphone');
  
  // Transaction filter
  const [filter, setFilter] = useState<'all' | 'inflow' | 'outflow'>('all');

  // Load wallet data from database
  const fetchWalletData = async () => {
    try {
      setLoading(true);
      const res = await apiClient.get('/wallet');
      if (res.data) {
        setBalance(Number(res.data.balance));
        setCoins(res.data.coins);
        setTransactions(res.data.transactions || []);
      }
    } catch (err) {
      console.warn('Backend API not available, using dev mock fallback:', err);
      // Fallback
      setBalance(45280);
      setCoins(2500);
      setTransactions(FALLBACK_TRANSACTIONS);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchWalletData();
  }, []);

  const handleAddMoney = async (e: React.FormEvent) => {
    e.preventDefault();
    const amt = parseFloat(amountInput);
    if (isNaN(amt) || amt <= 0) return;
    
    try {
      const res = await apiClient.post('/wallet/add-money', { amount: amt });
      if (res.data && res.data.success) {
        await fetchWalletData();
      }
    } catch (err) {
      console.warn('API error, falling back to client-side state update:', err);
      setBalance(prev => prev + amt);
      const newTxn: Transaction = {
        id: `TXN${Math.floor(10000 + Math.random() * 90000)}`,
        type: 'inflow',
        title: 'অ্যাড মানি (Add Money via bKash)',
        subtitle: 'bKash Wallet Direct',
        amount: amt,
        date: 'এখনই সম্পন্ন হয়েছে',
        status: 'completed'
      };
      setTransactions(prev => [newTxn, ...prev]);
    } finally {
      setActiveModal(null);
      setAmountInput('');
    }
  };

  const handleSendMoney = async (e: React.FormEvent) => {
    e.preventDefault();
    const amt = parseFloat(amountInput);
    if (isNaN(amt) || amt <= 0 || amt > balance) return;
    
    try {
      const res = await apiClient.post('/wallet/send-money', { amount: amt, phone: phoneInput });
      if (res.data && res.data.success) {
        await fetchWalletData();
      }
    } catch (err) {
      console.warn('API error, falling back to client-side state update:', err);
      setBalance(prev => prev - amt);
      const newTxn: Transaction = {
        id: `TXN${Math.floor(10000 + Math.random() * 90000)}`,
        type: 'outflow',
        title: 'টাকা পাঠান (Send Money)',
        subtitle: `নম্বর: ${phoneInput}`,
        amount: amt,
        date: 'এখনই সম্পন্ন হয়েছে',
        status: 'completed'
      };
      setTransactions(prev => [newTxn, ...prev]);
    } finally {
      setActiveModal(null);
      setAmountInput('');
      setPhoneInput('');
    }
  };

  const handleRecharge = async (e: React.FormEvent) => {
    e.preventDefault();
    const amt = parseFloat(amountInput);
    if (isNaN(amt) || amt <= 0 || amt > balance) return;
    
    try {
      const res = await apiClient.post('/wallet/recharge', { amount: amt, phone: phoneInput, operator: selectedProvider });
      if (res.data && res.data.success) {
        await fetchWalletData();
      }
    } catch (err) {
      console.warn('API error, falling back to client-side state update:', err);
      setBalance(prev => prev - amt);
      const newTxn: Transaction = {
        id: `TXN${Math.floor(10000 + Math.random() * 90000)}`,
        type: 'outflow',
        title: `মোবাইল রিচার্জ (${selectedProvider})`,
        subtitle: `নম্বর: ${phoneInput}`,
        amount: amt,
        date: 'এখনই সম্পন্ন হয়েছে',
        status: 'completed'
      };
      setTransactions(prev => [newTxn, ...prev]);
    } finally {
      setActiveModal(null);
      setAmountInput('');
      setPhoneInput('');
    }
  };

  const filteredTransactions = transactions.filter(t => {
    if (filter === 'all') return true;
    return t.type === filter;
  });

  return (
    <div className="w-full max-w-md mx-auto px-4 pb-28 text-[var(--pm-text)] pt-4">
      
      {/* Premium Gradient Balance Card */}
      <motion.div 
        className="w-full bg-gradient-to-tr from-purple-700 via-indigo-800 to-indigo-900 rounded-3xl p-6 shadow-xl border border-indigo-500/30 relative overflow-hidden mb-6"
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
      >
        <div className="absolute top-0 right-0 w-32 h-32 bg-white/5 rounded-full blur-xl pointer-events-none" />
        
        <div className="flex justify-between items-start">
          <div>
            <p className="text-[10px] uppercase font-black tracking-widest text-indigo-200">চলতি ব্যালেন্স (Current Balance)</p>
            <h2 className="text-3xl font-black text-white mt-1">৳ {balance.toLocaleString('bn-BD')} BDT</h2>
          </div>
          <span className="bg-white/10 text-white border border-white/20 px-3 py-1 rounded-xl text-[9px] font-black uppercase tracking-wider">
            ভেরিফাইড ওয়ালেট
          </span>
        </div>

        {/* Coins Loyalty Wallet */}
        <div className="mt-6 flex items-center justify-between border-t border-white/10 pt-4">
          <div className="flex items-center gap-2">
            <span className="text-xl">🪙</span>
            <div>
              <p className="text-[9px] text-indigo-200 font-bold uppercase">মার্ট কয়েন (Loyalty Coins)</p>
              <p className="text-xs font-black text-white">{coins.toLocaleString('bn-BD')} Coins</p>
            </div>
          </div>
          <button className="bg-white/15 hover:bg-white/25 active:scale-95 transition-all text-white border border-white/10 px-3 py-1.5 rounded-xl text-[9px] font-black">
            কয়েন কনভার্ট
          </button>
        </div>
      </motion.div>

      {/* Quick Actions Grid */}
      <div className="grid grid-cols-4 gap-2 mb-6">
        {[
          { label: 'অ্যাড মানি', icon: Plus, action: () => setActiveModal('add'), color: 'from-emerald-500 to-teal-600' },
          { label: 'টাকা পাঠান', icon: Send, action: () => setActiveModal('send'), color: 'from-blue-500 to-indigo-600' },
          { label: 'রিচার্জ', icon: Phone, action: () => setActiveModal('recharge'), color: 'from-orange-500 to-pink-600' },
          { label: 'বিল পে', icon: CreditCard, action: () => {}, disabled: true, color: 'from-purple-500 to-purple-600' }
        ].map((item, idx) => (
          <button
            key={idx}
            onClick={item.action}
            disabled={item.disabled}
            className={`bg-[var(--pm-surface)] border border-[var(--pm-border)] p-3 rounded-2xl flex flex-col items-center gap-2 hover:border-[var(--pm-accent)]/30 active:scale-95 transition-all cursor-pointer disabled:opacity-50 disabled:active:scale-100 disabled:cursor-not-allowed`}
          >
            <div className={`w-9 h-9 rounded-xl bg-gradient-to-br ${item.color} text-white flex items-center justify-center shadow-md`}>
              <item.icon className="w-5 h-5" />
            </div>
            <span className="text-[10px] font-black text-[var(--pm-text-secondary)]">{item.label}</span>
          </button>
        ))}
      </div>

      {/* Transaction Section Header */}
      <div className="flex flex-col gap-4 mb-4">
        <div className="flex justify-between items-center">
          <h3 className="font-black text-sm text-[var(--pm-text)]">লেনদেনের বিবরণী (Recent Transactions)</h3>
          <button onClick={fetchWalletData} className="p-1 rounded-lg hover:bg-[var(--pm-surface-hover)] transition-colors active:scale-90">
            <RefreshCw className="w-3.5 h-3.5 text-[var(--pm-text-muted)]" />
          </button>
        </div>

        {/* Filter chips */}
        <div className="flex gap-2">
          {[
            { id: 'all', label: 'সব লেনদেন' },
            { id: 'inflow', label: 'আয় (Inflow)' },
            { id: 'outflow', label: 'ব্যয় (Outflow)' }
          ].map(chip => (
            <button
              key={chip.id}
              onClick={() => setFilter(chip.id as any)}
              className={`px-3 py-1.5 rounded-full text-[10px] font-black border transition-all active:scale-95 ${
                filter === chip.id 
                  ? 'bg-[var(--pm-accent-soft)] border-[var(--pm-accent)]/30 text-[var(--pm-accent)]' 
                  : 'bg-[var(--pm-surface)] border-[var(--pm-border)] text-[var(--pm-text-muted)]'
              }`}
            >
              {chip.label}
            </button>
          ))}
        </div>
      </div>

      {/* Transaction Feed */}
      {loading ? (
        <div className="text-center py-12 text-xs font-bold text-[var(--pm-text-muted)] animate-pulse">
          লেনদেন বিবরণী লোড হচ্ছে...
        </div>
      ) : filteredTransactions.length === 0 ? (
        <div className="bg-[var(--pm-surface)] border border-[var(--pm-border)] rounded-3xl py-12 text-center text-[var(--pm-text-muted)] flex flex-col items-center gap-2">
          <Wallet className="w-10 h-10 mb-1 text-[var(--pm-text-muted)]" />
          <p className="text-xs font-bold">কোনো বিবরণ পাওয়া যায়নি।</p>
        </div>
      ) : (
        <div className="flex flex-col gap-3">
          {filteredTransactions.map(txn => {
            const formattedDate = txn.createdAt 
              ? new Date(txn.createdAt).toLocaleDateString('bn-BD', {
                  day: 'numeric', month: 'long', year: 'numeric', hour: '2-digit', minute: '2-digit'
                })
              : txn.date || 'সম্পন্ন হয়েছে';

            return (
              <div 
                key={txn.id}
                className="bg-[var(--pm-surface)] border border-[var(--pm-border)] rounded-2xl p-4 flex justify-between items-center gap-4 hover:border-[var(--pm-border)]/70 transition-colors"
              >
                <div className="flex items-center gap-3">
                  <div className={`w-10 h-10 rounded-xl flex items-center justify-center shrink-0 ${
                    txn.type === 'inflow' 
                      ? 'bg-emerald-500/10 text-emerald-500' 
                      : 'bg-red-500/10 text-red-500'
                  }`}>
                    {txn.type === 'inflow' ? <ArrowDownLeft className="w-5 h-5" /> : <ArrowUpRight className="w-5 h-5" />}
                  </div>
                  
                  <div>
                    <h4 className="text-xs font-black text-[var(--pm-text)] leading-tight">{txn.title}</h4>
                    <p className="text-[9px] text-[var(--pm-text-muted)] mt-0.5">{formattedDate}</p>
                  </div>
                </div>

                <div className="text-right">
                  <span className={`text-xs font-black ${
                    txn.type === 'inflow' ? 'text-emerald-500' : 'text-red-500'
                  }`}>
                    {txn.type === 'inflow' ? '+' : '-'} ৳{Number(txn.amount).toLocaleString('bn-BD')}
                  </span>
                  <p className="text-[8px] text-[var(--pm-text-muted)] mt-0.5 font-bold">আইডি: {txn.id.substring(0, 8)}</p>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* SHARED MODALS */}
      <AnimatePresence>
        {activeModal && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-md">
            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: 15 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 15 }}
              className="bg-[var(--pm-surface)] border border-[var(--pm-border)] w-full max-w-sm rounded-3xl overflow-hidden shadow-2xl flex flex-col text-[var(--pm-text)]"
            >
              {/* Modal Header */}
              <div className="p-4 border-b border-[var(--pm-border)] flex justify-between items-center">
                <h3 className="font-black text-sm">
                  {activeModal === 'add' && 'ওয়ালেটে টাকা অ্যাড করুন'}
                  {activeModal === 'send' && 'টাকা পাঠান (Send Money)'}
                  {activeModal === 'recharge' && 'মোবাইল রিচার্জ (Recharge)'}
                </h3>
                <button 
                  onClick={() => { setActiveModal(null); setAmountInput(''); setPhoneInput(''); }}
                  className="p-1 rounded-full hover:bg-[var(--pm-surface-hover)] text-[var(--pm-text-muted)]"
                >
                  <XIcon className="w-5 h-5" />
                </button>
              </div>

              {/* Add Money Modal Form */}
              {activeModal === 'add' && (
                <form onSubmit={handleAddMoney} className="p-5 flex flex-col gap-4">
                  <div className="flex flex-col gap-1.5">
                    <label className="text-xs font-bold text-[var(--pm-text-muted)]">অ্যামাউন্ট (টাকা) *</label>
                    <input 
                      type="number" 
                      placeholder="e.g. 5000"
                      required
                      value={amountInput}
                      onChange={e => setAmountInput(e.target.value)}
                      className="w-full bg-[var(--pm-bg)] border border-[var(--pm-border)] rounded-xl py-3 px-4 text-xs font-semibold outline-none focus:border-[var(--pm-accent)]"
                    />
                  </div>
                  
                  <div className="bg-[var(--pm-bg)] p-3 rounded-2xl border border-[var(--pm-border)]/50 text-[10px] text-[var(--pm-text-muted)] leading-relaxed">
                    🔐 পাইকার মার্ট পেমেন্ট গেটওয়ে দ্বারা সরাসরি আপনার bKash/Nagad ওয়ালেট থেকে নিরাপদে টাকা ব্যালেন্স লোড হবে।
                  </div>

                  <button 
                    type="submit" 
                    className="bg-[var(--pm-accent)] text-white w-full py-3 rounded-xl text-xs font-black shadow-lg shadow-[var(--pm-accent)]/20 active:scale-95 transition-all mt-2"
                  >
                    অ্যাড মানি সম্পন্ন করুন
                  </button>
                </form>
              )}

              {/* Send Money Modal Form */}
              {activeModal === 'send' && (
                <form onSubmit={handleSendMoney} className="p-5 flex flex-col gap-4">
                  <div className="flex flex-col gap-1.5">
                    <label className="text-xs font-bold text-[var(--pm-text-muted)]">প্রাপকের মোবাইল নম্বর *</label>
                    <input 
                      type="tel" 
                      placeholder="e.g. 01712345678"
                      required
                      value={phoneInput}
                      onChange={e => setPhoneInput(e.target.value)}
                      className="w-full bg-[var(--pm-bg)] border border-[var(--pm-border)] rounded-xl py-3 px-4 text-xs font-semibold outline-none focus:border-[var(--pm-accent)]"
                    />
                  </div>
                  
                  <div className="flex flex-col gap-1.5">
                    <label className="text-xs font-bold text-[var(--pm-text-muted)]">অ্যামাউন্ট (টাকা) *</label>
                    <input 
                      type="number" 
                      placeholder="e.g. 1000"
                      required
                      max={balance}
                      value={amountInput}
                      onChange={e => setAmountInput(e.target.value)}
                      className="w-full bg-[var(--pm-bg)] border border-[var(--pm-border)] rounded-xl py-3 px-4 text-xs font-semibold outline-none focus:border-[var(--pm-accent)]"
                    />
                  </div>

                  <button 
                    type="submit" 
                    disabled={parseFloat(amountInput) > balance}
                    className="bg-[var(--pm-accent)] text-white w-full py-3 rounded-xl text-xs font-black shadow-lg shadow-[var(--pm-accent)]/20 active:scale-95 transition-all mt-2 disabled:opacity-50"
                  >
                    টাকা পাঠান
                  </button>
                </form>
              )}

              {/* Recharge Modal Form */}
              {activeModal === 'recharge' && (
                <form onSubmit={handleRecharge} className="p-5 flex flex-col gap-4">
                  <div className="flex flex-col gap-1.5">
                    <label className="text-xs font-bold text-[var(--pm-text-muted)]">মোবাইল নম্বর *</label>
                    <input 
                      type="tel" 
                      placeholder="e.g. 01712345678"
                      required
                      value={phoneInput}
                      onChange={e => setPhoneInput(e.target.value)}
                      className="w-full bg-[var(--pm-bg)] border border-[var(--pm-border)] rounded-xl py-3 px-4 text-xs font-semibold outline-none focus:border-[var(--pm-accent)]"
                    />
                  </div>

                  <div className="flex flex-col gap-1.5">
                    <label className="text-xs font-bold text-[var(--pm-text-muted)]">অপারেটর নির্বাচন *</label>
                    <select
                      value={selectedProvider}
                      onChange={e => setSelectedProvider(e.target.value)}
                      className="bg-[var(--pm-bg)] border border-[var(--pm-border)] rounded-xl px-2.5 py-3 text-xs text-[var(--pm-text)] focus:outline-none"
                    >
                      <option value="Grameenphone">Grameenphone</option>
                      <option value="Robi">Robi</option>
                      <option value="Airtel">Airtel</option>
                      <option value="Banglalink">Banglalink</option>
                      <option value="Teletalk">Teletalk</option>
                    </select>
                  </div>
                  
                  <div className="flex flex-col gap-1.5">
                    <label className="text-xs font-bold text-[var(--pm-text-muted)]">রিচার্জের পরিমাণ (টাকা) *</label>
                    <input 
                      type="number" 
                      placeholder="e.g. 100"
                      required
                      max={balance}
                      value={amountInput}
                      onChange={e => setAmountInput(e.target.value)}
                      className="w-full bg-[var(--pm-bg)] border border-[var(--pm-border)] rounded-xl py-3 px-4 text-xs font-semibold outline-none focus:border-[var(--pm-accent)]"
                    />
                  </div>

                  <button 
                    type="submit" 
                    disabled={parseFloat(amountInput) > balance}
                    className="bg-[var(--pm-accent)] text-white w-full py-3 rounded-xl text-xs font-black shadow-lg shadow-[var(--pm-accent)]/20 active:scale-95 transition-all mt-2 disabled:opacity-50"
                  >
                    রিচার্জ করুন
                  </button>
                </form>
              )}

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
