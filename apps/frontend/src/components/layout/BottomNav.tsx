import React, { useState, useEffect, useRef } from 'react';
import { Home, Grid, ShoppingBag, Sparkles, Wrench } from 'lucide-react';
import { PortalTab, User } from '@/types';
import { useLanguage } from '@/contexts/LanguageContext';

interface BottomNavProps {
  currentTab: PortalTab;
  onSelectTab: (tab: PortalTab) => void;
  onOpenHub: () => void;
  onOpenCart: () => void;
  cartCount: number;
  currentUser?: User;
}

export const BottomNav: React.FC<BottomNavProps> = ({
  currentTab,
  onSelectTab,
  onOpenHub,
}) => {
  const { t, language } = useLanguage();
  const isBn = language === 'bn';
  const [isHidden, setIsHidden] = useState(false);
  const lastScrollY = useRef(0);

  // Scroll-direction auto-hide behavior
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

  const renderTabButton = (
    tabId: PortalTab,
    isActive: boolean,
    label: string,
    Icon: React.ComponentType<{ className?: string }>,
    onClick: () => void
  ) => (
    <button
      key={tabId}
      type="button"
      onClick={onClick}
      className={`relative flex flex-col items-center justify-center flex-1 min-h-[44px] h-full transition-all active:scale-90 cursor-pointer ${
        isActive
          ? 'text-[var(--pm-accent)] font-black'
          : 'text-[var(--pm-muted)] hover:text-[var(--pm-text)]'
      }`}
    >
      {/* Top active accent bar */}
      {isActive && (
        <span className="absolute top-0 left-1/2 -translate-x-1/2 w-8 h-[3px] rounded-b-full bg-[var(--pm-accent)]" />
      )}
      <Icon className={`w-5 h-5 mb-1 transition-transform ${isActive ? 'scale-110' : ''}`} />
      <span className="text-[10px] font-bold tracking-normal whitespace-nowrap leading-none">
        {label}
      </span>
    </button>
  );

  return (
    <nav
      className={`md:hidden fixed bottom-0 left-0 right-0 z-40 pm-glass border-t border-[var(--pm-border)] px-2 flex items-center justify-around h-[4.5rem] pb-safe shadow-2xl transition-transform duration-300 ${
        isHidden ? 'translate-y-full' : 'translate-y-0'
      }`}
    >
      {/* 1. Home Feed */}
      {renderTabButton(
        'feed',
        currentTab === 'feed',
        isBn ? 'ফিড' : t.nav.home,
        Home,
        () => onSelectTab('feed')
      )}

      {/* 2. Commerce Marketplace */}
      {renderTabButton(
        'commerce',
        currentTab === 'commerce' || currentTab === 'wholesale',
        isBn ? 'বাজার' : t.nav.shop,
        ShoppingBag,
        () => onSelectTab('commerce')
      )}

      {/* 3. Center Elevated Super App Hub Button */}
      <div className="relative flex flex-col items-center justify-end flex-1 h-full pb-2.5 pointer-events-none">
        <button
          type="button"
          onClick={onOpenHub}
          className={`absolute -top-5 w-12 h-12 rounded-2xl bg-[var(--pm-accent)] text-[var(--pm-accent-fg)] flex items-center justify-center shadow-xl pointer-events-auto active:scale-95 ring-4 ring-[var(--pm-card)] transition-transform ${
            currentTab === 'explore' ? 'scale-105' : ''
          }`}
          aria-label="Open Super App Hub"
        >
          <Grid className="w-6 h-6" />
        </button>
        <span className="text-[10px] font-black text-[var(--pm-accent)] tracking-normal whitespace-nowrap leading-none">
          {isBn ? 'হাব' : t.nav.superHub}
        </span>
      </div>

      {/* 4. Creator Hub */}
      {renderTabButton(
        'creator',
        currentTab === 'creator',
        isBn ? 'ভিডিও' : t.nav.creator,
        Sparkles,
        () => onSelectTab('creator')
      )}

      {/* 5. Services & Rides Switcher */}
      {renderTabButton(
        'services',
        currentTab === 'services' || currentTab === 'rides',
        currentTab === 'rides'
          ? isBn
            ? 'রাইড'
            : t.nav.rides
          : isBn
            ? 'সেবা'
            : t.nav.services,
        Wrench,
        () => onSelectTab(currentTab === 'services' ? 'rides' : 'services')
      )}
    </nav>
  );
};
