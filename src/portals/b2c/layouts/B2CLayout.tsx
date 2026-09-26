import React from 'react';
import { ArrowLeft, Home, ShoppingBag, ShieldCheck } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

export const B2CLayout = ({ children }: { children: React.ReactNode }) => {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-[var(--pm-bg)] text-[var(--pm-text)] pb-12">
      {/* Premium Header */}
      <header className="sticky top-0 w-full z-40 bg-[var(--pm-surface)]/75 backdrop-blur-xl border-b border-[var(--pm-border)] h-[60px] flex items-center justify-between px-4 sm:px-6">
        <div className="flex items-center gap-3">
          <button 
            onClick={() => navigate('/')}
            className="p-2 rounded-xl hover:bg-[var(--pm-surface-hover)] text-[var(--pm-text-muted)] hover:text-[var(--pm-text)] transition-colors active:scale-95"
          >
            <ArrowLeft className="w-4 h-4" />
          </button>
          
          <div className="flex items-center gap-1.5">
            <span className="text-xl">🛍️</span>
            <div className="flex flex-col">
              <span className="font-black text-sm tracking-tight text-[var(--pm-text)]">
                পাইকার <span className="text-[var(--pm-accent)]">খুচরা বাজার</span>
              </span>
              <span className="text-[8px] text-[var(--pm-text-muted)] font-black uppercase tracking-wider">Paikar B2C Retail</span>
            </div>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <span className="bg-indigo-500/10 text-indigo-400 border border-indigo-500/25 px-2.5 py-1 rounded-xl text-[9px] font-black flex items-center gap-1">
            <ShieldCheck className="w-3.5 h-3.5 text-blue-500" />
            নিরাপদ শপিং পোর্টাল
          </span>
        </div>
      </header>

      {/* Main Content Area */}
      <main className="w-full">
        {children}
      </main>
    </div>
  );
};
