import React from 'react';
import { useWalletStore } from '../store/walletStore';
import { ArrowUpRight, ArrowDownLeft, Coins, CreditCard, Clock } from 'lucide-react';

export const TransactionList = () => {
  const { transactions } = useWalletStore();

  const getIcon = (type: string) => {
    switch (type) {
      case 'topup':
        return <ArrowDownLeft className="w-5 h-5 text-emerald-400" />;
      case 'send':
        return <ArrowUpRight className="w-5 h-5 text-rose-400" />;
      case 'cashback':
        return <Coins className="w-5 h-5 text-amber-400 animate-bounce" />;
      default:
        return <CreditCard className="w-5 h-5 text-indigo-400" />;
    }
  };

  return (
    <div className="glass p-5 rounded-3xl border border-[var(--pm-border)]/30 space-y-4 shadow-lg">
      <div className="flex items-center justify-between border-b border-[var(--pm-border)]/20 pb-3">
        <h4 className="text-xs font-black text-[var(--pm-text)] uppercase tracking-wider">Recent Transactions</h4>
        <span className="text-[9px] bg-white/5 text-[var(--pm-text-muted)] px-2.5 py-1 rounded-full border border-white/5 flex items-center gap-1">
          <Clock className="w-3 h-3" /> Live Feed
        </span>
      </div>

      <div className="space-y-3">
        {transactions.length === 0 ? (
          <p className="text-xs text-[var(--pm-text-muted)] text-center py-4">No transactions found.</p>
        ) : (
          transactions.map((tx) => (
            <div 
              key={tx.id} 
              className="flex items-center justify-between p-3 rounded-2xl bg-white/[0.02] border border-[var(--pm-border)]/20 hover:border-[var(--pm-accent)]/20 transition-colors group"
            >
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-full bg-white/5 flex items-center justify-center border border-white/5 shrink-0 group-hover:scale-105 transition-transform">
                  {getIcon(tx.type)}
                </div>
                <div className="flex flex-col min-w-0">
                  <span className="text-xs font-bold text-[var(--pm-text)] truncate">{tx.description}</span>
                  <span className="text-[9px] text-[var(--pm-text-muted)]">{tx.date}</span>
                </div>
              </div>

              <div className="flex flex-col items-end gap-1 shrink-0">
                <span className={`text-xs font-black ${
                  tx.type === 'send' ? 'text-rose-400' : tx.type === 'cashback' ? 'text-amber-400' : 'text-emerald-400'
                }`}>
                  {tx.type === 'send' ? '-' : '+'}
                  {tx.currency === 'BDT' ? '৳' : ''}
                  {tx.amount}
                  {tx.currency === 'COIN' ? ' Coins' : ''}
                </span>
                <span className="text-[8px] font-black uppercase text-emerald-400 bg-emerald-500/10 px-2 py-0.5 rounded-full border border-emerald-500/20">
                  {tx.status}
                </span>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
};
