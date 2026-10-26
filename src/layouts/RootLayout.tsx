import React, { useState } from 'react';
import { NavLink } from 'react-router-dom';
import { Navbar } from '../components/navigation/Navbar';
import { BottomNav } from '../components/navigation/BottomNav';
import { MobileMenu } from '../components/navigation/MobileMenu';
import { FloatingNavButton } from '../components/navigation/FloatingNavButton';
import { ThemeBlobs } from '../components/layout/ThemeBlobs';
import { NakshiOverlay } from '../components/layout/NakshiOverlay';
import { CartDrawer } from '../components/cart/CartDrawer';
import { useCartDrawerStore } from '../modules/cart/cartDrawerStore';

export const RootLayout = ({ children }: { children: React.ReactNode }) => {
  const [menuOpen, setMenuOpen] = useState(false);
  const { isOpen, close } = useCartDrawerStore();

  return (
    <div className="h-[100dvh] w-full bg-[var(--pm-bg)] transition-colors duration-500 overflow-hidden">
      <ThemeBlobs />
      <NakshiOverlay />

      <div className="mx-auto h-full w-full lg:max-w-7xl bg-[var(--pm-surface)] lg:bg-transparent relative transition-colors duration-500 flex justify-center">

        {/* Left Sidebar - Desktop Only */}
        <aside className="hidden lg:flex w-64 h-[100dvh] sticky top-0 flex-col p-6 border-r border-[var(--pm-border)] bg-[var(--pm-surface)] shrink-0 overflow-y-auto">
          <div className="mb-10 px-4">
            <h1 className="text-2xl font-bold text-[var(--pm-text)]">Paikar<span className="text-[var(--pm-accent)]">Mart</span></h1>
          </div>
          <nav className="flex flex-col gap-1 px-2">
            {[
              { label: 'Home', icon: '🏠', path: '/' },
              { label: 'Marketplace', icon: '🛍️', path: '/b2c' },
              { label: 'PK Shop', icon: '💎', path: '/pk-shop' },
              { label: 'Feed', icon: '📰', path: '/feed' },
              { label: 'Messages', icon: '💬', path: '/messages' },
              { label: 'Wallet', icon: '💰', path: '/wallet' },
              { label: 'Settings', icon: '⚙️', path: '/settings' }
            ].map((item) => (
              <NavLink
                key={item.label}
                to={item.path}
                className={({ isActive }) =>
                  `w-full text-left px-4 py-3 rounded-xl transition-all font-medium flex items-center gap-3 ${isActive
                    ? 'bg-[var(--pm-accent-soft)] text-[var(--pm-accent)]'
                    : 'hover:bg-[var(--pm-surface-hover)] text-[var(--pm-text-muted)] hover:text-[var(--pm-text)]'
                  }`
                }
              >
                <span className="text-lg">{item.icon}</span>
                {item.label}
              </NavLink>
            ))}
          </nav>

          <div className="mt-auto p-4 border-t border-[var(--pm-border)] pt-6">
            <div className="flex items-center gap-3 p-2 rounded-2xl hover:bg-[var(--pm-surface-hover)] transition-all cursor-pointer group">
              <div className="w-10 h-10 rounded-full border-2 border-[var(--pm-accent)] overflow-hidden shrink-0 group-hover:scale-105 transition-transform">
                <img src="https://api.dicebear.com/7.x/avataaars/svg?seed=Munna" alt="Profile" className="w-full h-full" />
              </div>
              <div className="flex flex-col min-w-0">
                <p className="text-sm font-bold text-[var(--pm-text)] truncate">MD MUNNA</p>
                <p className="text-[10px] text-[var(--pm-text-muted)] truncate">Pro Seller</p>
              </div>
            </div>
          </div>
        </aside>

        {/* Main Content Area */}
        <div className="w-full max-w-[480px] sm:max-w-[540px] md:max-w-[600px] lg:max-w-[640px] bg-[var(--pm-surface)] sm:shadow-2xl relative border-x border-[var(--pm-border)] h-full flex flex-col shrink-0 overflow-hidden">
          <Navbar onMenuClick={() => setMenuOpen(true)} />
          
          <MobileMenu isOpen={menuOpen} onClose={() => setMenuOpen(false)} />
          <CartDrawer isOpen={isOpen} onClose={close} />

          <main className="flex-1 pt-[60px] md:pt-[64px] pb-[80px] lg:pb-6 overflow-y-auto hide-scrollbar">
            <FloatingNavButton />
            {children}
          </main>

          <div className="lg:hidden">
            <BottomNav onMenuClick={() => setMenuOpen(true)} />
          </div>
        </div>

        {/* Right Sidebar - Desktop Only */}
        <aside className="hidden xl:flex w-80 h-[100dvh] sticky top-0 flex-col p-8 border-l border-[var(--pm-border)] bg-[var(--pm-surface)] shrink-0 overflow-y-auto">
          <div className="flex flex-col gap-8">
            <div className="p-6 rounded-[24px] bg-[var(--pm-accent-soft)] border border-[var(--pm-accent)]/20 shadow-sm transition-transform hover:scale-[1.02]">
              <h3 className="font-bold text-[var(--pm-text)] mb-3 flex items-center gap-2">
                <span>💰</span> Wallet Balance
              </h3>
              <p className="text-2xl font-bold text-[var(--pm-accent)] tracking-tight">৳ 45,280.00</p>
              <div className="mt-4 flex gap-2">
                <button className="flex-1 px-3 py-2 bg-[var(--pm-accent)] text-white text-xs font-bold rounded-lg hover:opacity-90">Top Up</button>
                <button className="flex-1 px-3 py-2 bg-white/10 text-[var(--pm-text)] text-xs font-bold rounded-lg hover:bg-white/20">History</button>
              </div>
            </div>

            <div className="space-y-4">
              <h3 className="font-bold text-[var(--pm-text)] px-2">Recent Activity</h3>
              <div className="space-y-3">
                {[1, 2, 3].map((i) => (
                  <div key={i} className="flex gap-4 p-3 rounded-2xl bg-[var(--pm-surface-hover)] border border-[var(--pm-border)] transition-colors hover:border-[var(--pm-accent)]/30 group">
                    <div className="w-10 h-10 rounded-full bg-[var(--pm-bg)] flex items-center justify-center text-lg shadow-sm group-hover:scale-110 transition-transform">
                      {['📦', '🎁', '🛒'][i - 1]}
                    </div>
                    <div className="flex flex-col gap-1 justify-center">
                      <p className="text-sm font-medium text-[var(--pm-text)]">New Order #234{i}</p>
                      <p className="text-xs text-[var(--pm-text-muted)]">2 mins ago</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </aside>

      </div>
    </div>
  );
};
