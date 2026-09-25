import React, { useState } from 'react';
import { useWalletStore } from '../store/walletStore';
import { ArrowUpRight, ArrowDownLeft, Coins, CreditCard, Send, Sparkles } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

export const BalanceCard = () => {
  const { bdtBalance, coinBalance, topUp, sendMoney } = useWalletStore();
  const [showTopUp, setShowTopUp] = useState(false);
  const [showSend, setShowSend] = useState(false);
  const [amount, setAmount] = useState('');
  const [receiver, setReceiver] = useState('');
  const [error, setError] = useState('');

  const handleTopUp = () => {
    const val = parseFloat(amount);
    if (isNaN(val) || val <= 0) {
      setError('Please enter a valid amount');
      return;
    }
    topUp(val);
    setAmount('');
    setShowTopUp(false);
    setError('');
  };

  const handleSend = () => {
    const val = parseFloat(amount);
    if (isNaN(val) || val <= 0) {
      setError('Please enter a valid amount');
      return;
    }
    if (!receiver.trim()) {
      setError('Please enter receiver name');
      return;
    }
    const success = sendMoney(val, receiver);
    if (!success) {
      setError('Insufficient BDT balance');
      return;
    }
    setAmount('');
    setReceiver('');
    setShowSend(false);
    setError('');
  };

  return (
    <div className="space-y-4">
      {/* Visual Rich Double Wallet Card */}
      <div className="grid grid-cols-2 gap-4">
        {/* BDT Wallet */}
        <div className="relative rounded-[32px] overflow-hidden bg-gradient-to-br from-indigo-900 via-indigo-950 to-slate-900 border border-white/10 p-6 shadow-2xl flex flex-col justify-between h-[160px] group">
          <div className="absolute top-0 right-0 w-24 h-24 bg-indigo-500/10 blur-[40px] rounded-full" />
          <div className="flex items-center justify-between">
            <span className="text-[10px] font-bold text-indigo-300 uppercase tracking-widest flex items-center gap-1">
              <CreditCard className="w-3.5 h-3.5" /> BDT Wallet
            </span>
            <span className="text-[9px] bg-indigo-500/20 text-indigo-300 px-2 py-0.5 rounded-full border border-indigo-500/30">Active</span>
          </div>
          <div>
            <p className="text-[10px] text-indigo-200/50 uppercase font-black tracking-wider leading-none mb-1">Available Balance</p>
            <h3 className="text-2xl font-black text-white leading-none">৳ {bdtBalance.toLocaleString()}</h3>
          </div>
        </div>

        {/* PK Coins Wallet */}
        <div className="relative rounded-[32px] overflow-hidden bg-gradient-to-br from-amber-950 via-slate-900 to-black border border-white/10 p-6 shadow-2xl flex flex-col justify-between h-[160px] group">
          <div className="absolute top-0 right-0 w-24 h-24 bg-amber-500/10 blur-[40px] rounded-full" />
          <div className="flex items-center justify-between">
            <span className="text-[10px] font-bold text-amber-400 uppercase tracking-widest flex items-center gap-1">
              <Coins className="w-3.5 h-3.5" /> PK Coins
            </span>
            <span className="text-[9px] bg-amber-500/20 text-amber-400 px-2 py-0.5 rounded-full border border-amber-500/30 flex items-center gap-0.5">
              <Sparkles className="w-2.5 h-2.5" /> Rewards
            </span>
          </div>
          <div>
            <p className="text-[10px] text-amber-200/50 uppercase font-black tracking-wider leading-none mb-1">Active Coins</p>
            <h3 className="text-2xl font-black text-amber-400 leading-none">{coinBalance.toLocaleString()} <span className="text-xs text-amber-500">Coins</span></h3>
          </div>
        </div>
      </div>

      {/* Action Buttons */}
      <div className="grid grid-cols-2 gap-3 pt-2">
        <button 
          onClick={() => { setShowSend(false); setShowTopUp(true); setError(''); }}
          className="flex items-center justify-center gap-2 bg-[var(--pm-accent)] text-white py-3.5 rounded-2xl text-xs font-black shadow-lg shadow-[var(--pm-accent)]/20 active:scale-95 transition-all"
        >
          <ArrowDownLeft className="w-4 h-4" /> Top Up Wallet
        </button>
        <button 
          onClick={() => { setShowTopUp(false); setShowSend(true); setError(''); }}
          className="flex items-center justify-center gap-2 bg-white/5 border border-[var(--pm-border)]/40 text-[var(--pm-text)] py-3.5 rounded-2xl text-xs font-black active:scale-95 transition-all hover:bg-white/10"
        >
          <Send className="w-4 h-4 text-[var(--pm-accent)]" /> Send Money
        </button>
      </div>

      {/* Interactive Action Modals */}
      <AnimatePresence>
        {(showTopUp || showSend) && (
          <motion.div
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 15 }}
            className="p-5 rounded-3xl glass border border-[var(--pm-border)]/40 shadow-xl space-y-4"
          >
            <div className="flex items-center justify-between">
              <h4 className="text-xs font-black text-[var(--pm-text)] uppercase tracking-wider">
                {showTopUp ? 'Top Up Wallet Balance' : 'Send Money to Vendor/User'}
              </h4>
              <button 
                onClick={() => { setShowTopUp(false); setShowSend(false); setError(''); }}
                className="text-[var(--pm-text-muted)] hover:text-[var(--pm-text)] text-xs font-bold"
              >
                Cancel
              </button>
            </div>

            <div className="space-y-3">
              {showSend && (
                <div className="flex flex-col gap-1.5">
                  <span className="text-[9px] font-bold text-[var(--pm-text-muted)] uppercase">Receiver Name</span>
                  <input
                    type="text"
                    placeholder="Enter receiver name or phone..."
                    value={receiver}
                    onChange={(e) => setReceiver(e.target.value)}
                    className="w-full bg-[var(--pm-bg)]/40 border border-[var(--pm-border)]/40 rounded-xl px-4 py-2.5 text-xs text-[var(--pm-text)] outline-none focus:border-[var(--pm-accent)]/50"
                  />
                </div>
              )}
              
              <div className="flex flex-col gap-1.5">
                <span className="text-[9px] font-bold text-[var(--pm-text-muted)] uppercase">Amount (BDT)</span>
                <input
                  type="number"
                  placeholder="Enter amount in ৳..."
                  value={amount}
                  onChange={(e) => setAmount(e.target.value)}
                  className="w-full bg-[var(--pm-bg)]/40 border border-[var(--pm-border)]/40 rounded-xl px-4 py-2.5 text-xs text-[var(--pm-text)] outline-none focus:border-[var(--pm-accent)]/50"
                />
              </div>

              {error && <p className="text-[10px] text-red-400 font-bold">{error}</p>}

              <button
                onClick={showTopUp ? handleTopUp : handleSend}
                className="w-full bg-[var(--pm-accent)] text-white py-3 rounded-xl text-xs font-black shadow-lg shadow-[var(--pm-accent)]/20 active:scale-95 transition-all mt-2"
              >
                {showTopUp ? 'Confirm Top Up' : 'Confirm Send'}
              </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};
