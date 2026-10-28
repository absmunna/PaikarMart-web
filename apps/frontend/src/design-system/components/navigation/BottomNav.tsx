import React from 'react';
import { 
  Home, Newspaper, LayoutGrid, MessageSquare, User, LogIn, PlayCircle
} from 'lucide-react';
import { Link, useLocation } from 'react-router-dom';
import { useTranslation } from '@/core/lib/i18n';
import { useAuth } from '@/modules/auth';
import { useNavSettingsStore } from '@/app/AppShell/useNavSettingsStore';

export const BottomNav = ({ isVisible }: { isVisible?: boolean }) => {
  const location = useLocation();
  const { t, lang } = useTranslation();
  const { user, isAuthenticated } = useAuth();
  const isNavVisibleStore = useNavSettingsStore((s) => s.isNavVisible);
  const navBehavior = useNavSettingsStore((s) => s.navBehavior);

  const shouldShow = navBehavior === 'fixed' ? true : (isVisible !== undefined ? isVisible : isNavVisibleStore);

  const isPortalActive = location.pathname === '/portals' || 
                         location.pathname === '/apps' || 
                         location.pathname === '/hub' || 
                         location.pathname === '/portal-hub' ||
                         location.pathname.startsWith('/portals/');

  const isVideoActive = location.pathname === '/video' || 
                        location.pathname.startsWith('/video/') || 
                        location.pathname === '/reels';

  const isActive = (path: string) => {
    if (path === '/portals') return isPortalActive;
    if (path === '/video') return isVideoActive;
    return location.pathname === path;
  };

  const profilePath = isAuthenticated ? '/profile' : '/login';
  const profileLabel = isAuthenticated ? t('profile') : (lang === 'BN' ? 'লগইন' : 'Login');
  const ProfileIcon = isAuthenticated ? User : LogIn;

  const navItems = [
    { label: t('home'), icon: Home, path: '/' },
    { label: t('feed'), icon: Newspaper, path: '/feed' },
    { label: t('apps'), icon: LayoutGrid, path: '/portals', isCenter: true },
    { label: lang === 'BN' ? 'ভিডিও' : 'Video', icon: PlayCircle, path: '/video' },
    { label: profileLabel, icon: ProfileIcon, path: profilePath },
  ];

  return (
    <nav className={`absolute bottom-0 left-0 right-0 z-40 glass h-[64px] w-full border-t border-[var(--pm-border)] pb-safe shadow-[0_-4px_16px_rgba(0,0,0,0.1)] flex items-center select-none transition-transform duration-300 ease-in-out ${
      shouldShow ? 'translate-y-0' : 'translate-y-full pointer-events-none'
    }`}>
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
