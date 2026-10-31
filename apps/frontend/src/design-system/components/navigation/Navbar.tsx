import React, { useState } from 'react';
import { Bell, Search, Menu, ShoppingBag, Palette, MessageSquare, Plus, Sparkles, Building2, Store, Wrench, Flame, User, LogIn, Monitor, Smartphone } from 'lucide-react';
import { Link, NavLink, useNavigate } from 'react-router-dom';
import { SearchBar } from './SearchBar';
import { useCartStore, useCartDrawerStore } from '@/modules/cart';
import { useTheme } from '@/providers/ThemeProvider';
import { useAuth } from '@/modules/auth';
import { useNotificationsStore } from '@/modules/notification';
import { useLiveChatStore } from '../chat/LiveChatDrawer';
import { useLanguage } from '@/modules/language';
import { LocationPicker } from './LocationPicker';
import { ThemeLangSwitcher } from './ThemeLangSwitcher';
import { useDomainViewMode } from '@/core/hooks/useDomainViewMode';
import { useNavSettingsStore } from '@/app/AppShell/useNavSettingsStore';

export const Navbar = ({ onMenuClick, isVisible }: { onMenuClick?: () => void; isVisible?: boolean }) => {
  const totalItems = useCartStore((state) => state.getTotalItems());
  const openCart = useCartDrawerStore((state) => state.open);
  const { user, isAuthenticated, isSeller } = useAuth();
  const { getUnreadCount } = useNotificationsStore();
  const { isBn } = useLanguage();
  const unreadNotifications = getUnreadCount();
  const navigate = useNavigate();
  const { isDesktopView, toggleViewMode } = useDomainViewMode();
  const isNavVisibleStore = useNavSettingsStore((s) => s.isNavVisible);
  const navBehavior = useNavSettingsStore((s) => s.navBehavior);

  const shouldShow = navBehavior === 'fixed' ? true : (isVisible !== undefined ? isVisible : isNavVisibleStore);

  return (
    <header className={`absolute top-0 left-0 right-0 z-50 glass h-[60px] md:h-[64px] w-full border-b border-[var(--pm-border)]/60 select-none transition-transform duration-300 ease-in-out ${
      shouldShow ? 'translate-y-0' : '-translate-y-full pointer-events-none shadow-none'
    }`}>
      <nav className="w-full mx-auto px-3 sm:px-4 lg:px-6 h-full flex items-center justify-between gap-2 sm:gap-4">
        
        {/* Zone 1: Brand / Portal Switcher */}
        <div className="flex items-center gap-2 sm:gap-3 shrink-0">
          <button
            onClick={onMenuClick}
            className="p-2 -ml-2 text-[var(--pm-text)] active:bg-[var(--pm-surface-hover)] rounded-xl transition-colors cursor-pointer"
            title="Menu"
          >
            <Menu className="w-5 h-5 sm:w-6 sm:h-6" />
          </button>
          
          <Link to="/" className="font-black text-lg sm:text-xl flex items-center gap-1.5 tracking-tight group">
            <span>
              <span className="text-[var(--pm-accent)]">Paikar</span>
              <span className="text-[var(--pm-text)]">Mart</span>
            </span>
          </Link>

          {/* Desktop Direct Hub Shortcuts */}
          <div className="hidden 2xl:flex items-center gap-1 pl-3 border-l border-[var(--pm-border)]">
            {[
              { label: isBn ? 'পাইকারি আড়ত' : 'Wholesale', path: '/wholesale', icon: Building2 },
              { label: isBn ? 'খুচরা মার্কেট' : 'Retail', path: '/b2c', icon: Store },
              { label: isBn ? 'সার্ভিস হাব' : 'Services', path: '/services', icon: Wrench },
              { label: isBn ? 'ডিমান্ড বোর্ড' : 'Demands', path: '/demand', icon: Flame },
            ].map((nav) => {
              const Icon = nav.icon;
              return (
                <NavLink
                  key={nav.path}
                  to={nav.path}
                  className={({ isActive }) =>
                    `px-2.5 py-1.5 rounded-lg text-xs font-semibold flex items-center gap-1.5 transition-colors whitespace-nowrap ${
                      isActive
                        ? 'bg-[var(--pm-accent-soft)] text-[var(--pm-accent)] font-bold'
                        : 'text-[var(--pm-text-muted)] hover:text-[var(--pm-text)] hover:bg-[var(--pm-surface-hover)]'
                    }`
                  }
                >
                  <Icon className="w-3.5 h-3.5" />
                  <span>{nav.label}</span>
                </NavLink>
              );
            })}
          </div>
        </div>

        {/* Zone 2: Prominent Desktop Search Bar */}
        <div className="hidden sm:block flex-1 max-w-sm md:max-w-md lg:max-w-lg xl:max-w-xl mx-2">
          <SearchBar />
        </div>

        {/* Zone 3: Interactive Controls & Direct Mobile Entries */}
        <div className="flex items-center gap-1 sm:gap-1.5 shrink-0">
          
          {/* Mobile Search Trigger - Directly navigates to Search Page */}
          <button
            onClick={() => navigate('/search')}
            className="sm:hidden p-2 text-[var(--pm-text-muted)] hover:text-[var(--pm-accent)] active:scale-95 transition-all rounded-xl"
            title="Search"
          >
            <Search className="w-5 h-5" />
          </button>

          {/* Global Location Selector (Moved from banner) */}
          <div className="shrink-0">
            <LocationPicker />
          </div>

          {/* Global Theme & Language Picker */}
          <div className="shrink-0 hidden sm:block">
            <ThemeLangSwitcher />
          </div>

          {/* View Mode Toggle: Desktop Full Screen vs Mobile Frame */}
          <button
            onClick={toggleViewMode}
            className="hidden sm:flex items-center gap-1.5 px-2.5 py-1.5 rounded-xl bg-[var(--pm-surface)] hover:bg-[var(--pm-surface-hover)] border border-[var(--pm-border)] text-[var(--pm-text)] text-xs font-bold transition-all shadow-xs cursor-pointer active:scale-95"
            title={isDesktopView ? "মোবাইল ফ্রেম ভিউতে স্যুইচ করুন" : "ফুল স্ক্রিন ডেস্কটপ ভিউতে স্যুইচ করুন"}
          >
            {isDesktopView ? (
              <>
                <Smartphone className="w-3.5 h-3.5 text-[var(--pm-accent)]" />
                <span className="hidden xl:inline text-[11px]">মোবাইল ফ্রেম</span>
              </>
            ) : (
              <>
                <Monitor className="w-3.5 h-3.5 text-[var(--pm-accent)]" />
                <span className="hidden xl:inline text-[11px]">ডেস্কটপ ভিউ</span>
              </>
            )}
          </button>

          {/* Cart Icon with badge */}
          <button 
            onClick={openCart}
            className="relative p-2 text-[var(--pm-text-muted)] hover:text-[var(--pm-text)] hover:bg-[var(--pm-surface-hover)] rounded-xl transition-all"
            title="Shopping Cart"
          >
            <ShoppingBag className="w-4.5 h-4.5" />
            {totalItems > 0 && (
              <span className="absolute top-1 right-1 w-4 h-4 bg-[var(--pm-accent)] text-white text-[8px] font-black rounded-full flex items-center justify-center border border-[var(--pm-surface)] shadow-xs">
                {totalItems}
              </span>
            )}
          </button>

          {/* Notifications Icon - Directly navigates to Notifications Page */}
          <button 
            onClick={() => navigate('/notifications')}
            className="relative p-2 text-[var(--pm-text-muted)] hover:text-[var(--pm-text)] hover:bg-[var(--pm-surface-hover)] rounded-xl transition-all cursor-pointer"
            title="Notifications"
          >
            <Bell className="w-4.5 h-4.5" />
            {isAuthenticated && unreadNotifications > 0 && (
              <span className="absolute top-1 right-1 min-w-[16px] h-4 px-1 bg-red-500 text-white text-[8px] font-black rounded-full flex items-center justify-center border border-[var(--pm-surface)]">
                {unreadNotifications}
              </span>
            )}
          </button>

          {/* Message Icon - Only shown when user is logged in */}
          {isAuthenticated && user && (
            <button 
              onClick={() => navigate('/messages')}
              className="relative p-2 text-[var(--pm-text-muted)] hover:text-[var(--pm-text)] hover:bg-[var(--pm-surface-hover)] rounded-xl transition-all cursor-pointer"
              title="Messages"
            >
              <MessageSquare className="w-4.5 h-4.5" />
            </button>
          )}

          {/* Direct Desktop CTA: Post Demand */}
          <button
            onClick={() => navigate('/demand')}
            className="hidden md:flex items-center gap-1.5 ml-1 px-3 py-1.5 rounded-xl bg-[var(--pm-accent)] hover:bg-[var(--pm-accent-hover)] text-white text-xs font-bold transition-all shadow-sm shadow-[var(--pm-accent)]/20 active:scale-95 whitespace-nowrap cursor-pointer"
          >
            <Plus className="w-3.5 h-3.5 stroke-[3px]" />
            <span>{isBn ? 'ডিমান্ড দিন' : 'Post Demand'}</span>
          </button>

        </div>
      </nav>
    </header>
  );
};
