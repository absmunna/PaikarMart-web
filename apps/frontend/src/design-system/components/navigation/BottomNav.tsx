import React from 'react';
import { 
  Home, Newspaper, LayoutGrid, MessageSquare, User
} from 'lucide-react';
import { Link, useLocation } from 'react-router-dom';
import { useTranslation } from '@/core/lib/i18n';
import { useAuth } from '@/modules/auth';

export const BottomNav = () => {
  const location = useLocation();
  const { t } = useTranslation();
  const { user } = useAuth();

  const isPortalActive = location.pathname === '/portals' || 
                         location.pathname === '/apps' || 
                         location.pathname === '/hub' || 
                         location.pathname === '/portal-hub' ||
                         location.pathname.startsWith('/portals/');

  const isActive = (path: string) => {
    if (path === '/portals') return isPortalActive;
    return location.pathname === path;
  };

  const navItems = [
    { label: t('home'), icon: Home, path: '/' },
    { label: t('feed'), icon: Newspaper, path: '/feed' },
    { label: t('apps'), icon: LayoutGrid, path: '/portals', isCenter: true },
    { label: t('messages'), icon: MessageSquare, path: '/messages' },
    { label: t('profile'), icon: User, path: '/profile' },
  ];

  return (
    <nav className="fixed bottom-0 left-1/2 -translate-x-1/2 z-40 glass h-[64px] w-full max-w-[480px] sm:max-w-[540px] md:max-w-[600px] lg:max-w-[640px] border-t border-[var(--pm-border)] pb-safe shadow-[0_-4px_16px_rgba(0,0,0,0.1)] flex items-center select-none">
      <div className="w-full h-full flex items-center justify-around px-2 relative">
        {navItems.map((item) => (
          item.isCenter ? (
            <Link 
              key={item.path}
              to={item.path}
              className={`relative -mt-6 w-12 h-12 rounded-full flex items-center justify-center shadow-md transition-all duration-300 active:scale-95 cursor-pointer ${
                isActive(item.path) 
                ? 'bg-[var(--pm-accent)] text-white shadow-[var(--pm-accent)]/30 scale-105' 
                : 'bg-[var(--pm-surface)] text-[var(--pm-accent)] border border-[var(--pm-border)] hover:border-[var(--pm-accent)]'
              }`}
              title="Super Hubs (10 Modules)"
              aria-label="Super Hubs / Portals"
            >
              <item.icon className="w-6 h-6 transition-transform duration-300" />
            </Link>
          ) : (
            <Link 
              key={item.label}
              to={item.path}
              className={`flex flex-col items-center justify-center min-w-[44px] min-h-[44px] px-1 gap-0.5 transition-all duration-200 active:scale-95 cursor-pointer ${
                isActive(item.path)
                ? 'text-[var(--pm-accent)]' 
                : 'text-[var(--pm-text-muted)] hover:text-[var(--pm-text)]'
              }`}
            >
              {item.path === '/profile' && user && (user.avatar || user.avatarUrl) ? (
                <div className={`w-5 h-5 rounded-full overflow-hidden border ${isActive(item.path) ? 'border-[var(--pm-accent)]' : 'border-[var(--pm-border)]'}`}>
                  <img 
                    src={user.avatar || user.avatarUrl} 
                    alt="Profile" 
                    className="w-full h-full object-cover"
                    referrerPolicy="no-referrer"
                    onError={(e) => {
                      (e.currentTarget as HTMLImageElement).style.display = 'none';
                    }}
                  />
                </div>
              ) : (
                <item.icon className={`w-5 h-5 ${isActive(item.path) ? 'stroke-[2.5px]' : 'stroke-[2px]'}`} />
              )}
              <span className={`text-[9px] font-bold ${isActive(item.path) ? 'opacity-100 font-black' : 'opacity-70'}`}>
                {item.label}
              </span>
            </Link>
          )
        ))}
      </div>
    </nav>
  );
};

export default BottomNav;


