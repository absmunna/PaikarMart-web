import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Search, ShoppingCart, User, Bell, Store } from 'lucide-react';
import { BottomNav } from '@/design-system/components/navigation/BottomNav';

interface B2CLayoutProps {
  children: React.ReactNode;
}

export const B2CLayout: React.FC<B2CLayoutProps> = ({ children }) => {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-[var(--pm-bg)] flex flex-col">
      {/* Retail Header */}
      <header className="sticky top-0 z-50 bg-[var(--pm-glass)] backdrop-blur-xl border-b border-[var(--pm-border)] px-4 py-3 flex items-center justify-between sm:px-6">
        <div className="flex items-center gap-2" onClick={() => navigate('/')}>
          <div className="w-10 h-10 rounded-xl bg-[var(--pm-accent)] flex items-center justify-center text-white shadow-lg shadow-[var(--pm-accent)]/25">
            <Store className="w-6 h-6" />
          </div>
          <div className="hidden sm:block">
            <h1 className="text-base font-black tracking-tighter leading-none text-[var(--pm-text)]">PaikarMart</h1>
            <p className="text-[9px] font-bold text-[var(--pm-accent)] uppercase tracking-widest">Retail Hub</p>
          </div>
        </div>

        <div className="flex-1 max-w-lg mx-6 hidden md:block">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-[var(--pm-muted)]" />
            <input
              type="text"
              placeholder="পণ্য, ব্র্যান্ড বা দোকান খুঁজুন..."
              className="w-full h-11 bg-[var(--pm-surface)] border border-[var(--pm-border)] rounded-2xl pl-10 pr-4 text-sm text-[var(--pm-text)] outline-none focus:border-[var(--pm-accent)] transition-colors"
            />
          </div>
        </div>

        <div className="flex items-center gap-2 sm:gap-4">
          <button className="p-2 text-[var(--pm-muted)] hover:text-[var(--pm-text)] hover:bg-[var(--pm-card-hover)] rounded-xl transition-all">
            <Bell className="w-5 h-5" />
          </button>
          <button onClick={() => navigate('/cart')} className="relative p-2 text-[var(--pm-muted)] hover:text-[var(--pm-text)] hover:bg-[var(--pm-card-hover)] rounded-xl transition-all">
            <ShoppingCart className="w-5 h-5" />
            <span className="absolute top-1 right-1 w-4 h-4 bg-[var(--pm-accent)] text-white text-[10px] font-bold rounded-full flex items-center justify-center">২</span>
          </button>
          <button onClick={() => navigate('/profile')} className="w-10 h-10 rounded-xl bg-[var(--pm-surface)] overflow-hidden border border-[var(--pm-border)] hover:border-[var(--pm-accent)] transition-all">
            <img src="https://api.dicebear.com/7.x/avataaars/svg?seed=Munna" alt="User" />
          </button>
        </div>
      </header>

      {/* Main Content Area */}
      <main className="flex-1">
        {children}
      </main>

      {/* Mobile Bottom Navigation */}
      <BottomNav />
    </div>
  );
};

export default B2CLayout;
