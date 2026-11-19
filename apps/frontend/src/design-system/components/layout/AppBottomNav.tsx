import React from 'react';
import { Home, Store, Zap, PlayCircle, Compass } from 'lucide-react';
import { Link, useLocation } from 'react-router-dom';
import { cn } from '@/lib/utils';

export const AppBottomNav: React.FC = () => {
  const location = useLocation();

  const navItems = [
    { icon: Home, label: 'Home', path: '/' },
    { icon: Store, label: 'Market', path: '/market' },
    { icon: Zap, label: 'Service', path: '/services' },
    { icon: PlayCircle, label: 'Video', path: '/video' },
    { icon: Compass, label: 'Explore', path: '/portals' },
  ];

  return (
    <nav className="fixed bottom-0 left-0 right-0 z-40 md:hidden bg-black/80 backdrop-blur-xl border-t border-[var(--pm-border)] pb-safe">
      <div className="flex items-center justify-around h-16 px-2">
        {navItems.map((item) => {
          const isActive = location.pathname === item.path || (item.path !== '/' && location.pathname.startsWith(item.path));
          const Icon = item.icon;

          return (
            <Link 
              key={item.label} 
              to={item.path}
              className="flex flex-1 flex-col items-center justify-center h-full active:opacity-70"
            >
              <div className={cn(
                "flex flex-col items-center gap-1 transition-all duration-300",
                isActive ? "text-[var(--pm-accent)] scale-110" : "text-[var(--pm-muted)]"
              )}>
                <Icon className={cn("h-5 w-5", isActive ? "stroke-[2.5px]" : "stroke-2")} />
                <span className="text-[10px] font-black uppercase tracking-tighter">{item.label}</span>
              </div>
            </Link>
          );
        })}
      </div>
    </nav>
  );
};
