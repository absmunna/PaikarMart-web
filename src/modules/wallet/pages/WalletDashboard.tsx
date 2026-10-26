import React from 'react';
import { BalanceCard } from '../components/BalanceCard';
import { TransactionList } from '../components/TransactionList';
import { ShieldCheck, ArrowLeft } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

export const WalletDashboard = () => {
  const navigate = useNavigate();

  return (
    <div className="flex flex-col gap-6 px-4 pb-12">
      {/* Premium Header */}
      <div className="flex items-center gap-3">
        <button 
          onClick={() => navigate('/')} 
          className="p-2 rounded-full glass border border-[var(--pm-border)] text-[var(--pm-text-muted)] hover:text-[var(--pm-text)] active:scale-95 transition-all"
        >
          <ArrowLeft className="w-4 h-4" />
        </button>
        <div>
          <h2 className="text-lg font-black text-[var(--pm-text)] uppercase tracking-wider">Super Wallet</h2>
          <p className="text-[10px] text-[var(--pm-text-muted)]">Secure BDT & PK Reward Coins Management</p>
        </div>
      </div>

      {/* Trust Shield Banner */}
      <div className="flex items-center gap-3 p-4 rounded-2xl bg-indigo-500/10 border border-indigo-500/20 shadow-inner">
        <ShieldCheck className="w-6 h-6 text-indigo-400 shrink-0" />
        <p className="text-[10px] text-indigo-200/80 leading-snug">
          Your wallet transactions are secured with military-grade 256-bit encryption. Authorized by Paikar Mart Security Protocol.
        </p>
      </div>

      <BalanceCard />
      <TransactionList />
    </div>
  );
};
export default WalletDashboard;
