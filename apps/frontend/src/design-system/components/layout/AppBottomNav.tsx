import React from 'react';
import { Home, LayoutGrid, PlusSquare, Wallet, User, MessageCircle } from 'lucide-react';
import { Link, useLocation } from 'react-router-dom';
import { useNavUIStore } from '@/app/AppShell/useNavUIStore';
import { cn } from '@/lib/utils';
import { useAuth } from '@/app/context/AuthContext';

export const AppBottomNav: React.FC = () => {
  const location = useLocation();
  const { toggleAppLauncher } = useNavUIStore();
  const { isAuthenticated } = useAuth();

  const navItems = [
    { icon: Home, label: 'Home', path: '/' },
    { icon: LayoutGrid, label: 'Feed', path: '/feed' },
    { icon: PlusSquare, label: 'Hub', isCenter: true },
    { icon: MessageCircle, label: 'Chat', path: '/messages', authRequired: true },
    { icon: User, label: 'Profile', path: isAuthenticated ? '/profile' : '/auth/login' },
  ];

  return (
    <nav className="fixed bottom-0 left-0 right-0 z-40 md:hidden bg-black/80 backdrop-blur-xl border-t border-[var(--pm-border)] pb-safe">
      <div className="flex items-center justify-around h-16 px-2">
        {navItems.map((item, idx) => {
          const isActive = location.pathname === item.path;
          const Icon = item.icon;

          if (item.isCenter) {
            return (
              <Link
              key="center-hub"
              to="/portal-hub"
              className="relative -top-4 flex h-14 w-14 items-center justify-center rounded-2xl bg-[var(--pm-accent)] text-white shadow-[0_8px_20px_rgba(255,122,0,0.3)] transition-transform active:scale-90"
            >
              <Icon className="h-7 w-7" />
            </Link>
            );
          }

          const content = (
            <div className={cn(
              "flex flex-col items-center gap-1 transition-all duration-300",
              isActive ? "text-[var(--pm-accent)] scale-110" : "text-[var(--pm-muted)]"
            )}>
              <Icon className={cn("h-5 w-5", isActive ? "stroke-[2.5px]" : "stroke-2")} />
              <span className="text-[10px] font-black uppercase tracking-tighter">{item.label}</span>
            </div>
          );

          if (item.path) {
            return (
              <Link 
                key={item.label} 
                to={item.path}
                className="flex flex-1 flex-col items-center justify-center h-full active:opacity-70"
              >
                {content}
              </Link>
            );
          }

          return (
            <div key={item.label} className="flex flex-1 flex-col items-center justify-center h-full opacity-50 cursor-not-allowed">
              {content}
            </div>
          );
        })}
      </div>
    </nav>
  );
};
