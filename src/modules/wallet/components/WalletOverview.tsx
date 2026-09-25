import React, { useState } from 'react';
import { useWalletStore } from '../useWalletStore';
import { useAuth } from '@/features/auth/AuthContext';
import { useLanguage } from "@/features/language/LanguageContext";
import { 
  Wallet, 
  ArrowUpRight, 
  ArrowDownLeft, 
  RefreshCcw, 
  Plus, 
  History,
  ShieldCheck,
  CreditCard,
  Banknote
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';
import { motion, AnimatePresence } from 'motion/react';

export interface WalletOverviewProps {
  onAction?: (action: 'topup' | 'send' | 'withdraw') => void;
}

export const WalletOverview: React.FC<WalletOverviewProps> = ({ onAction }) => {
  const { balance, coins, transactions, isLoading } = useWalletStore();
  const { user } = useAuth();
  const { isBn } = useLanguage();
  const [activeTab, setActiveTab] = useState<'all' | 'credit' | 'debit'>('all');

  // RBAC: Check if user has seller or admin role
  const isSeller = user?.roles?.some(role => ['seller', 'admin', 'super_admin'].includes(role));

  const filteredTransactions = transactions.filter(tx => {
    if (activeTab === 'all') return true;
    return tx.type === activeTab;
  });

  return (
    <div className="space-y-6 pb-20">
      {/* Wallet Card */}
      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="relative overflow-hidden p-6 rounded-[32px] bg-zinc-950 border border-white/5 shadow-2xl"
      >
        <div className="absolute top-0 right-0 p-8 opacity-10">
          <Wallet size={120} className="text-white" />
        </div>

        <div className="relative z-10">
          <p className="text-zinc-500 text-xs font-black uppercase tracking-[0.2em] mb-1">
            {isBn ? "ব্যবহারযোগ্য ব্যালেন্স" : "Available Balance"}
          </p>
          <div className="flex items-baseline gap-2">
            <h1 className="text-4xl font-black text-white tracking-tighter">
              ৳ {balance.toLocaleString()}
            </h1>
            <span className="text-[var(--pm-accent)] text-xs font-bold bg-[var(--pm-accent)]/10 px-2 py-0.5 rounded-full">
              {isBn ? "সুরক্ষিত" : "Safe"}
            </span>
          </div>

          <div className="flex items-center gap-4 mt-8">
            <div className="flex-1 p-3 rounded-2xl bg-white/5 border border-white/5">
              <p className="text-[10px] text-zinc-500 font-bold uppercase tracking-widest mb-1">
                {isBn ? "পিকে কয়েন" : "PK Coins"}
              </p>
              <div className="flex items-center gap-1.5 text-amber-400 font-black">
                <span>{coins.toLocaleString()}</span>
                <div className="w-1 h-1 rounded-full bg-zinc-700" />
                <span className="text-[10px] text-zinc-500">৳ {Math.floor(coins / 10)}</span>
              </div>
            </div>
            
            <div className="flex-1 p-3 rounded-2xl bg-white/5 border border-white/5">
              <p className="text-[10px] text-zinc-500 font-bold uppercase tracking-widest mb-1">
                {isBn ? "অবস্থা" : "Status"}
              </p>
              <div className="flex items-center gap-1.5 text-[var(--pm-accent)] font-black">
                <ShieldCheck size={12} />
                <span className="text-[10.5px]">{isBn ? "যাচাইকৃত" : "Verified"}</span>
              </div>
            </div>
          </div>
        </div>
      </motion.div>

      {/* Quick Actions */}
      <div className="grid grid-cols-2 gap-3">
        <Button 
          onClick={() => onAction?.('topup')}
          className="h-14 rounded-2xl bg-[var(--pm-accent)] hover:opacity-90 text-white font-black text-sm gap-2 cursor-pointer"
        >
          <Plus size={18} />
          {isBn ? "ক্যাশ ইন" : "Cash In"}
        </Button>
        {isSeller && (
          <Button 
            variant="outline" 
            onClick={() => onAction?.('withdraw')}
            className="h-14 rounded-2xl bg-white/5 border-white/10 text-white hover:bg-white/10 font-black text-sm gap-2 cursor-pointer"
          >
            <Banknote size={18} />
            {isBn ? "টাকা উত্তোলন" : "Withdraw"}
          </Button>
        )}
        {!isSeller && (
          <Button 
            variant="outline" 
            onClick={() => onAction?.('send')}
            className="h-14 rounded-2xl bg-white/5 border-white/10 text-white hover:bg-white/10 font-black text-sm gap-2 cursor-pointer"
          >
            <CreditCard size={18} />
            {isBn ? "টাকা পাঠান" : "Send Money"}
          </Button>
        )}
      </div>

      {/* Transactions Section */}
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <History size={16} className="text-zinc-500" />
            <h3 className="text-white font-black text-sm tracking-tight">
              {isBn ? "সাম্প্রতিক লেনদেন" : "Recent Activity"}
            </h3>
          </div>
          <div className="flex bg-white/5 p-1 rounded-xl border border-white/5">
            {([
              { value: 'all', label: isBn ? "সব" : "all" },
              { value: 'credit', label: isBn ? "জমা" : "credit" },
              { value: 'debit', label: isBn ? "খরচ" : "debit" }
            ] as const).map((tab) => (
              <button
                key={tab.value}
                onClick={() => setActiveTab(tab.value)}
                className={cn(
                  "px-3 py-1 text-[10px] font-black uppercase tracking-widest rounded-lg transition-all cursor-pointer",
                  activeTab === tab.value ? "bg-white/10 text-white" : "text-zinc-500 hover:text-zinc-300"
                )}
              >
                {tab.label}
              </button>
            ))}
          </div>
        </div>

        <div className="space-y-3">
          <AnimatePresence mode="popLayout">
            {filteredTransactions.map((tx) => (
              <motion.div
                key={tx.id}
                initial={{ opacity: 0, x: -10 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, scale: 0.95 }}
                className="p-4 rounded-2xl bg-zinc-900 border border-white/5 flex items-center justify-between"
              >
                <div className="flex items-center gap-3">
                  <div className={cn(
                    "w-10 h-10 rounded-xl flex items-center justify-center",
                    tx.type === 'credit' ? "bg-[var(--pm-accent)]/10 text-[var(--pm-accent)]" : "bg-rose-500/10 text-rose-500"
                  )}>
                    {tx.type === 'credit' ? <ArrowDownLeft size={20} /> : <ArrowUpRight size={20} />}
                  </div>
                  <div>
                    <h4 className="text-white text-[13px] font-bold leading-none mb-1">{tx.label}</h4>
                    <p className="text-[10px] text-zinc-500 font-medium truncate max-w-[150px]">{tx.sublabel}</p>
                    <p className="text-[9px] text-zinc-600 font-black uppercase tracking-widest mt-1">{tx.time}</p>
                  </div>
                </div>
                <div className="text-right">
                  <span className={cn(
                    "text-sm font-black tracking-tighter",
                    tx.type === 'credit' ? "text-[var(--pm-accent)]" : "text-white"
                  )}>
                    {tx.type === 'credit' ? '+' : '-'} ৳{tx.amount.toLocaleString()}
                  </span>
                  <div className="flex items-center justify-end gap-1 mt-1">
                    <div className={cn(
                      "w-1 h-1 rounded-full",
                      tx.status === 'success' ? "bg-[var(--pm-accent)]" : "bg-amber-500"
                    )} />
                    <span className="text-[8px] text-zinc-600 font-bold uppercase tracking-widest">
                      {tx.status === 'success' ? (isBn ? "সফল" : "success") : (isBn ? "প্রক্রিয়াধীন" : "pending")}
                    </span>
                  </div>
                </div>
              </motion.div>
            ))}
          </AnimatePresence>
          
          {filteredTransactions.length === 0 && (
            <div className="py-12 flex flex-col items-center justify-center text-center">
              <div className="w-16 h-16 bg-white/5 rounded-2xl flex items-center justify-center mb-4">
                <RefreshCcw className="text-zinc-700" />
              </div>
              <p className="text-zinc-500 text-xs font-bold">
                {isBn ? "এই সময়ে কোনো লেনদেন পাওয়া যায়নি।" : "No transactions found in this period."}
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
