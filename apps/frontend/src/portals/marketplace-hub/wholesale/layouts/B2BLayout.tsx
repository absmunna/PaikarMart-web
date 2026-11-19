import React from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft, Building2 } from 'lucide-react';
import { safeBack } from '@/lib/navigation';

export const B2BLayout = ({ children }: { children: React.ReactNode }) => {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-[var(--pm-bg)] text-[var(--pm-text)]">
      <header className="sticky top-0 w-full z-40 bg-[var(--pm-bg)]/90 backdrop-blur-md h-[56px] border-b border-[var(--pm-border)] flex items-center justify-between px-4">
        <div className="flex items-center gap-2.5">
          <button
            onClick={() => safeBack(navigate, '/wholesale')}
            className="w-8 h-8 rounded-xl bg-[var(--pm-card)] border border-[var(--pm-border)] flex items-center justify-center text-[var(--pm-text)] hover:opacity-80 transition-all cursor-pointer"
          >
            <ArrowLeft className="w-4 h-4" />
          </button>
          <div className="flex items-center gap-2">
            <Building2 className="w-4 h-4 text-blue-400" />
            <h1 className="font-extrabold text-sm tracking-tight">Paikar Wholesale</h1>
            <span className="text-[10px] font-bold px-2 py-0.5 rounded-full text-blue-300 bg-blue-500/10 border border-blue-500/20">
              B2B
            </span>
          </div>
        </div>
      </header>
      <main className="pb-20">
        {children}
      </main>
    </div>
  );
};

export default B2BLayout;
