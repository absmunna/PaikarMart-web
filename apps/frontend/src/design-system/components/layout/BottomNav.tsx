import React, { useState, useEffect, useRef } from 'react';
import { Home, Grid, ShoppingBag, Wrench, Car } from 'lucide-react';
import { useNavigate, useLocation } from 'react-router-dom';
import { cn } from '@/lib/utils';

export interface BottomNavProps {
  onOpenHub?: () => void;
  className?: string;
}

const TABS = [
  { id: 'home', path: '/', label: 'Home', labelBn: 'হোম', icon: Home },
  { id: 'market', path: '/market', label: 'Shop', labelBn: 'শপ', icon: ShoppingBag },
  { id: 'hub', path: '#hub', label: 'Hub', labelBn: 'হাব', icon: Grid, isHub: true },
  { id: 'services', path: '/services', label: 'Service', labelBn: 'সার্ভিস', icon: Wrench },
  { id: 'rides', path: '/logistics', label: 'Ride', labelBn: 'রাইড', icon: Car },
] as const;

/**
 * Version-2 style mobile bottom navigation.
 * Center elevated button opens Super App Hub modal.
 */
export function BottomNav({ onOpenHub, className }: BottomNavProps) {
  const navigate = useNavigate();
  const location = useLocation();
  const [isHidden, setIsHidden] = useState(false);
  const lastScrollY = useRef(0);

  useEffect(() => {
    const handleScroll = () => {
      const currentY = window.scrollY;
      if (currentY > 90 && currentY > lastScrollY.current + 12) {
        setIsHidden(true);
      } else if (currentY < lastScrollY.current - 8 || currentY <= 40) {
        setIsHidden(false);
      }
      lastScrollY.current = currentY;
    };
    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const isActive = (path: string) => {
    if (path === '/') return location.pathname === '/';
    return location.pathname.startsWith(path);
  };

  return (
    <nav
      className={cn(
        'md:hidden fixed bottom-0 left-0 right-0 z-40',
        'bg-background/95 backdrop-blur border-t border-border',
        'px-1 flex items-center justify-around h-[4.5rem] pb-safe shadow-2xl',
        'transition-transform duration-300',
        isHidden ? 'translate-y-full' : 'translate-y-0',
        className
      )}
      aria-label="Mobile bottom navigation"
    >
      {TABS.map((tab) => {
        const Icon = tab.icon;
        if ('isHub' in tab && tab.isHub) {
          return (
            <div
              key={tab.id}
              className="relative flex flex-col items-center justify-end flex-1 h-full pb-2.5 pointer-events-none"
            >
              <button
                type="button"
                onClick={() => onOpenHub?.()}
                className="absolute -top-5 w-12 h-12 rounded-2xl bg-primary text-primary-foreground flex items-center justify-center shadow-xl pointer-events-auto active:scale-95 ring-4 ring-background transition-transform"
                aria-label="Open Super App Hub"
              >
                <Grid className="w-6 h-6" />
              </button>
              <span className="text-[10px] font-black text-primary tracking-normal whitespace-nowrap leading-none">
                {tab.labelBn}
              </span>
            </div>
          );
        }

        const active = isActive(tab.path);
        return (
          <button
            key={tab.id}
            type="button"
            onClick={() => navigate(tab.path)}
            className={cn(
              'relative flex flex-col items-center justify-center flex-1 min-h-[44px] h-full transition-all active:scale-90',
              active ? 'text-primary font-black' : 'text-muted-foreground hover:text-foreground'
            )}
          >
            {active && (
              <span className="absolute top-0 left-1/2 -translate-x-1/2 w-8 h-[3px] rounded-b-full bg-primary" />
            )}
            <Icon className={cn('w-5 h-5 mb-1 transition-transform', active && 'scale-110')} />
            <span className="text-[10px] font-bold tracking-normal whitespace-nowrap leading-none">
              {tab.labelBn}
            </span>
          </button>
        );
      })}
    </nav>
  );
}

export default BottomNav;
