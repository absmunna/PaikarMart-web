import React from 'react';
import { Home, ShoppingBag, Newspaper, Wallet, MoreHorizontal } from 'lucide-react';
import { useNavigate, useLocation } from 'react-router-dom';
import { useTranslation } from '../../lib/i18n';

export const BottomNav = ({ onMenuClick }: { onMenuClick?: () => void }) => {
  const navigate = useNavigate();
  const location = useLocation();
  const { t } = useTranslation();

  const isActive = (path: string) => location.pathname === path;

  const navItems = [
    { label: t('home'), icon: Home, path: '/' },
    { label: t('shop'), icon: ShoppingBag, path: '/shop' },
    { label: t('feed'), icon: Newspaper, path: '/feed', isCenter: true },
    { label: t('wallet'), icon: Wallet, path: '/wallet' },
    { label: t('more'), icon: MoreHorizontal, path: '#', isMenu: true },
  ];

  return (
    <nav className="fixed bottom-0 left-1/2 -translate-x-1/2 z-50 glass h-[64px] w-full max-w-[480px] sm:max-w-[540px] md:max-w-[600px] lg:max-w-[640px] border-t border-[var(--pm-border)] pb-safe shadow-[0_-4px_16px_rgba(0,0,0,0.1)] flex items-center">
      <div className="w-full h-full flex items-center justify-around px-2 relative">
        {navItems.map((item) => (
          item.isCenter ? (
            <button 
              key={item.path}
              onClick={() => navigate(item.path)}
              className={`relative -mt-6 w-12 h-12 rounded-full flex items-center justify-center shadow-md transition-all duration-300 active:scale-95 ${
                isActive(item.path) 
                ? 'bg-[var(--pm-accent)] text-white shadow-[var(--pm-accent)]/30' 
                : 'bg-[var(--pm-surface)] text-[var(--pm-accent)] border border-[var(--pm-border)]'
              }`}
            >
              <item.icon className="w-6 h-6" />
            </button>
          ) : (
            <button 
              key={item.label}
              onClick={item.isMenu ? onMenuClick : () => navigate(item.path)}
              className={`flex flex-col items-center gap-0.5 transition-all duration-200 ${
                isActive(item.path) && !item.isMenu
                ? 'text-[var(--pm-accent)]' 
                : 'text-[var(--pm-text-muted)] hover:text-[var(--pm-text)]'
              }`}
            >
              <item.icon className={`w-5 h-5 ${isActive(item.path) && !item.isMenu ? 'stroke-[2.5px]' : 'stroke-[2px]'}`} />
              <span className={`text-[9px] font-bold ${isActive(item.path) && !item.isMenu ? 'opacity-100' : 'opacity-70'}`}>
                {item.label}
              </span>
            </button>
          )
        ))}
      </div>
    </nav>
  );
};
