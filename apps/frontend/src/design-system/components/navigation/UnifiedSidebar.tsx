import React, { useState, useEffect } from 'react';
import { NavLink, Link, useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import {
  X, User, Store, ShoppingBag, Users, Video, Gamepad2, Wrench,
  LayoutDashboard, Package, Wallet, Heart, Bell, Settings,
  LogOut, LogIn, UserPlus, ChevronRight, Globe, Download, Check, Building2
} from 'lucide-react';
import { useTheme } from '@/providers/ThemeProvider';
import { useAuth } from '@/modules/auth';
import { useAppStore } from '@/store/appStore';
import { usePWAInstall } from '@/shared/hooks/usePWAInstall';
import { cn } from '@/lib/utils';

export interface UnifiedSidebarProps {
  isMobileDrawer?: boolean;
  isOpen?: boolean;
  onClose?: () => void;
  className?: string;
}

/* ── Theme palette (main 4) ─────────────────────────────────────────── */
const THEME_SWATCHES = [
  { id: 'dark', name: 'ডার্ক', className: 'bg-[#101117] border-[#2a2c36]' },
  { id: 'deepDark', name: 'পিওর ডার্ক', className: 'bg-[#050505] border-[#333]' },
  { id: 'light', name: 'লাইট', className: 'bg-[#f4f4f7] border-[#d4d4dc]' },
  { id: 'greenField', name: 'সবুজ', className: 'bg-[#0c1f16] border-[#1e4634]' },
] as const;

/* ── Portal directory (grouped) ─────────────────────────────────────── */
const PORTAL_GROUPS: {
  title: string;
  items: { to: string; label: string; labelBn: string; icon: React.ElementType }[];
}[] = [
  {
    title: 'কমার্স',
    items: [
      { to: '/market', label: 'Marketplace', labelBn: 'মার্কেটপ্লেস', icon: ShoppingBag },
      { to: '/b2c', label: 'Retail Store', labelBn: 'খুচরা দোকান', icon: Store },
      { to: '/wholesale', label: 'Wholesale', labelBn: 'পাইকারি আড়ত', icon: Building2 },
    ],
  },
  {
    title: 'সার্ভিস ও এক্সপ্রেস',
    items: [
      { to: '/services', label: 'Services', labelBn: 'সার্ভিস হাব', icon: Wrench },
    ],
  },
  {
    title: 'কমিউনিটি ও কনটেন্ট',
    items: [
      { to: '/demand', label: 'Demand Board', labelBn: 'ডিমান্ড বোর্ড', icon: Users },
      { to: '/video', label: 'Video', labelBn: 'ভিডিও', icon: Video },
      { to: '/apps', label: 'Games', labelBn: 'গেমস', icon: Gamepad2 },
    ],
  },
];

const QUICK_LINKS = [
  { to: '/orders', label: 'অর্ডার', labelBn: 'অর্ডার', icon: Package },
  { to: '/wallet', label: 'Wallet', labelBn: 'ওয়ালেট', icon: Wallet },
  { to: '/wishlist', label: 'Wishlist', labelBn: 'উইশলিস্ট', icon: Heart },
  { to: '/notifications', label: 'Notifications', labelBn: 'নোটিফিকেশন', icon: Bell },
] as const;

export const UnifiedSidebar: React.FC<UnifiedSidebarProps> = ({
  isMobileDrawer = false,
  isOpen = false,
  onClose,
  className
}) => {
  const { theme, setTheme } = useTheme();
  const { user, isAuthenticated, logout, isSeller } = useAuth();
  const { lang, setLang } = useAppStore();
  const navigate = useNavigate();
  const { isInstallable, promptInstall } = usePWAInstall();

  const isBn = lang === 'BN' || lang === 'bn';

  // Lock body scroll and listen for Escape key when mobile drawer is open
  useEffect(() => {
    if (!isMobileDrawer || !isOpen) return;

    const originalOverflow = document.body.style.overflow;
    document.body.style.overflow = 'hidden';

    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        onClose?.();
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => {
      document.body.style.overflow = originalOverflow;
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, [isMobileDrawer, isOpen, onClose]);

  const handleLogout = () => {
    logout();
    onClose?.();
    navigate('/login');
  };

  const handleNavClick = () => {
    if (isMobileDrawer) {
      onClose?.();
    }
  };

  const navLinkClass = ({ isActive }: { isActive: boolean }) =>
    cn(
      'flex items-center gap-3 px-3 py-2.5 rounded-xl text-[13px] font-semibold transition-all cursor-pointer group',
      isActive
        ? 'bg-[var(--pm-accent-soft)] text-[var(--pm-accent)]'
        : 'text-[var(--pm-text-secondary)] hover:bg-[var(--pm-surface-hover)] hover:text-[var(--pm-text)]'
    );

  const sidebarContent = (
    <div className="flex flex-col h-full w-full select-none text-[var(--pm-text)] bg-[var(--pm-surface)] overflow-hidden font-sans border-r border-[var(--pm-border)]">

      {/* ── 1. BRAND HEADER ─────────────────────────────────────────── */}
      <div className="p-4 border-b border-[var(--pm-border)] flex items-center justify-between shrink-0">
        <Link to="/" onClick={handleNavClick} className="flex items-center gap-2.5 cursor-pointer">
          <div className="w-9 h-9 rounded-xl bg-[var(--pm-accent)] flex items-center justify-center text-white font-black text-lg">
            P
          </div>
          <h1 className="text-lg font-black tracking-tight leading-none">
            <span className="text-[var(--pm-accent)]">Paikar</span>
            <span className="text-[var(--pm-text)]">Mart</span>
          </h1>
        </Link>

        {isMobileDrawer && (
          <button
            onClick={onClose}
            className="w-9 h-9 rounded-xl bg-[var(--pm-surface-hover)] text-[var(--pm-text-muted)] hover:text-[var(--pm-text)] transition-colors active:scale-95 cursor-pointer flex items-center justify-center border border-[var(--pm-border)]"
            title={isBn ? 'বন্ধ করুন' : 'Close'}
          >
            <X className="w-4.5 h-4.5" />
          </button>
        )}
      </div>

      {/* ── 2. SCROLLABLE CONTENT ───────────────────────────────────── */}
      <div className="flex-1 overflow-y-auto no-scrollbar p-3 space-y-4">

        {/* 2a. User card / guest actions */}
        {isAuthenticated ? (
          <Link
            to="/profile"
            onClick={handleNavClick}
            className="flex items-center gap-3 p-3 rounded-2xl bg-[var(--pm-card)] border border-[var(--pm-border)] hover:border-[var(--pm-accent)]/40 transition-all cursor-pointer"
          >
            {user?.avatarUrl ? (
              <img src={user.avatarUrl} alt={user?.fullName || ''} className="w-11 h-11 rounded-full object-cover border border-[var(--pm-border)] shrink-0" />
            ) : (
              <span className="w-11 h-11 rounded-full bg-[var(--pm-accent-soft)] text-[var(--pm-accent)] flex items-center justify-center font-black text-lg shrink-0">
                {user?.fullName?.charAt(0)?.toUpperCase() || 'U'}
              </span>
            )}
            <div className="min-w-0 flex-1">
              <p className="text-sm font-bold truncate">{user?.fullName}</p>
              <p className="text-[11px] text-[var(--pm-text-muted)] truncate">
                {user?.email || user?.phone || (isBn ? 'প্রোফাইল দেখুন' : 'View profile')}
              </p>
            </div>
            <ChevronRight className="w-4 h-4 text-[var(--pm-text-muted)] shrink-0" />
          </Link>
        ) : (
          <div className="p-3 rounded-2xl bg-[var(--pm-card)] border border-[var(--pm-border)] space-y-2">
            <p className="text-xs text-[var(--pm-text-muted)]">
              {isBn ? 'পোস্ট, অর্ডার ও ডিমান্ডের জন্য লগইন করুন' : 'Sign in to post, order and send demands'}
            </p>
            <Link
              to="/login"
              onClick={handleNavClick}
              className="flex items-center justify-center gap-2 w-full py-2.5 rounded-xl bg-[var(--pm-accent)] hover:bg-[var(--pm-accent-hover)] text-white text-xs font-black active:scale-95 transition-all"
            >
              <LogIn className="w-4 h-4" />
              {isBn ? 'লগইন করুন' : 'Log In'}
            </Link>
            <Link
              to="/register"
              onClick={handleNavClick}
              className="flex items-center justify-center gap-2 w-full py-2.5 rounded-xl border border-[var(--pm-border)] text-[var(--pm-text)] text-xs font-bold hover:bg-[var(--pm-surface-hover)] transition-all"
            >
              <UserPlus className="w-4 h-4" />
              {isBn ? 'অ্যাকাউন্ট খুলুন' : 'Create Account'}
            </Link>
          </div>
        )}

        {/* 2b. Business CTA / My Business */}
        {!isSeller ? (
          <NavLink
            to="/become-seller"
            onClick={handleNavClick}
            className="flex items-center gap-3 p-3.5 rounded-2xl bg-[var(--pm-accent)]/12 border border-[var(--pm-accent)]/40 hover:border-[var(--pm-accent)] transition-all cursor-pointer group"
          >
            <span className="w-9 h-9 rounded-xl bg-[var(--pm-accent)] text-white flex items-center justify-center shrink-0">
              <Store className="w-4.5 h-4.5" />
            </span>
            <span className="flex-1 min-w-0">
              <span className="block text-[13px] font-black text-[var(--pm-accent)] leading-tight">
                {isBn ? 'ব্যবসা শুরু করুন / দোকান খুলুন' : 'Start Business / Open Shop'}
              </span>
              <span className="block text-[10px] text-[var(--pm-text-muted)] mt-0.5">
                {isBn ? 'সেলার, সার্ভিস বা রাইডার অ্যাকাউন্ট' : 'Seller, service or rider account'}
              </span>
            </span>
            <ChevronRight className="w-4 h-4 text-[var(--pm-accent)] group-hover:translate-x-0.5 transition-transform shrink-0" />
          </NavLink>
        ) : (
          <div className="p-3 rounded-2xl bg-[var(--pm-card)] border border-[var(--pm-border)]">
            <p className="text-[10px] font-black uppercase tracking-wider text-[var(--pm-text-muted)] mb-2">
              {isBn ? 'আমার ব্যবসা' : 'My Business'}
            </p>
            <div className="space-y-1">
              <NavLink to="/seller/dashboard" onClick={handleNavClick} className={navLinkClass}>
                <LayoutDashboard className="w-4 h-4 shrink-0" />
                <span className="flex-1">{isBn ? 'সেলার সেন্ট্রাল' : 'Seller Central'}</span>
                <ChevronRight className="w-3.5 h-3.5 text-[var(--pm-text-muted)]" />
              </NavLink>
              <NavLink to="/seller/store" onClick={handleNavClick} className={navLinkClass}>
                <Store className="w-4 h-4 shrink-0" />
                <span className="flex-1">{isBn ? 'স্টোর ম্যানেজমেন্ট' : 'Store Management'}</span>
                <ChevronRight className="w-3.5 h-3.5 text-[var(--pm-text-muted)]" />
              </NavLink>
              <NavLink to="/become-seller" onClick={handleNavClick} className={navLinkClass}>
                <UserPlus className="w-4 h-4 shrink-0" />
                <span className="flex-1">{isBn ? 'নতুন পোর্টাল যোগ করুন' : 'Add another role'}</span>
                <ChevronRight className="w-3.5 h-3.5 text-[var(--pm-text-muted)]" />
              </NavLink>
            </div>
          </div>
        )}

        {/* 2c. Quick links */}
        <div className="grid grid-cols-2 gap-2">
          {QUICK_LINKS.map((item) => {
            const Icon = item.icon;
            return (
              <NavLink
                key={item.to}
                to={item.to}
                onClick={handleNavClick}
                className={({ isActive }) => cn(
                  'flex items-center gap-2 px-3 py-2.5 rounded-xl border border-[var(--pm-border)] text-xs font-bold transition-all cursor-pointer',
                  isActive
                    ? 'bg-[var(--pm-accent-soft)] text-[var(--pm-accent)] border-[var(--pm-accent)]/40'
                    : 'text-[var(--pm-text-secondary)] bg-[var(--pm-card)] hover:bg-[var(--pm-surface-hover)] hover:text-[var(--pm-text)]'
                )}
              >
                <Icon className="w-4 h-4 shrink-0" />
                <span className="truncate">{isBn ? item.labelBn : item.label}</span>
              </NavLink>
            );
          })}
        </div>

        {/* 2d. Portal directory */}
        <div className="space-y-3">
          {PORTAL_GROUPS.map((group) => (
            <div key={group.title}>
              <p className="px-3 text-[10px] font-black uppercase tracking-wider text-[var(--pm-text-muted)] mb-1">
                {group.title}
              </p>
              <div className="space-y-0.5">
                {group.items.map((item) => {
                  const Icon = item.icon;
                  return (
                    <NavLink key={item.to} to={item.to} onClick={handleNavClick} className={navLinkClass}>
                      <Icon className="w-4.5 h-4.5 shrink-0" />
                      <span className="flex-1">{isBn ? item.labelBn : item.label}</span>
                      <ChevronRight className="w-3.5 h-3.5 text-[var(--pm-text-muted)] opacity-0 group-hover:opacity-100 transition-opacity" />
                    </NavLink>
                  );
                })}
              </div>
            </div>
          ))}
        </div>

        {/* 2e. Settings entry */}
        <NavLink to="/settings/app" onClick={handleNavClick} className={navLinkClass}>
          <Settings className="w-4.5 h-4.5 shrink-0" />
          <span className="flex-1">{isBn ? 'সেটিংস' : 'Settings'}</span>
          <ChevronRight className="w-3.5 h-3.5 text-[var(--pm-text-muted)]" />
        </NavLink>
      </div>

      {/* ── 3. FOOTER: theme, language, PWA, logout ─────────────────── */}
      <div className="p-3 border-t border-[var(--pm-border)] bg-[var(--pm-surface)] shrink-0 space-y-2.5">
        {/* Theme palette */}
        <div className="flex items-center justify-between px-1">
          <span className="text-[10px] font-bold text-[var(--pm-text-muted)] uppercase tracking-wider">
            {isBn ? 'থিম' : 'Theme'}
          </span>
          <div className="flex gap-1.5">
            {THEME_SWATCHES.map((swatch) => (
              <button
                key={swatch.id}
                onClick={() => setTheme(swatch.id as never)}
                className={cn(
                  'w-5 h-5 rounded-full border-2 relative cursor-pointer transition-transform hover:scale-110 flex items-center justify-center',
                  swatch.className
                )}
                title={swatch.name}
              >
                {theme === swatch.id && <Check className="w-2.5 h-2.5 text-[var(--pm-accent)]" />}
              </button>
            ))}
          </div>
        </div>

        {/* Language switch */}
        <div className="flex items-center justify-between px-1">
          <span className="text-[10px] font-bold text-[var(--pm-text-muted)] uppercase tracking-wider flex items-center gap-1">
            <Globe className="w-3 h-3 text-[var(--pm-accent)]" /> {isBn ? 'ভাষা' : 'Language'}
          </span>
          <div className="flex bg-[var(--pm-bg)]/80 p-0.5 rounded-lg border border-[var(--pm-border)]">
            <button
              onClick={() => setLang('EN')}
              className={cn(
                'px-2.5 py-0.5 rounded-md text-[10px] font-black transition-all cursor-pointer',
                !isBn ? 'bg-[var(--pm-accent)] text-white' : 'text-[var(--pm-text-muted)]'
              )}
            >
              EN
            </button>
            <button
              onClick={() => setLang('BN')}
              className={cn(
                'px-2.5 py-0.5 rounded-md text-[10px] font-black transition-all cursor-pointer',
                isBn ? 'bg-[var(--pm-accent)] text-white' : 'text-[var(--pm-text-muted)]'
              )}
            >
              বাংলা
            </button>
          </div>
        </div>

        {/* PWA install */}
        {isInstallable && (
          <button
            onClick={() => promptInstall()}
            className="flex items-center justify-center gap-2 w-full py-2 rounded-xl bg-[var(--pm-card)] border border-[var(--pm-border)] text-[var(--pm-text)] text-xs font-black active:scale-95 transition-all cursor-pointer"
          >
            <Download className="w-3.5 h-3.5" />
            {isBn ? 'অ্যাপ ইনস্টল করুন' : 'Install App'}
          </button>
        )}

        {/* Logout / login footer */}
        {isAuthenticated ? (
          <button
            onClick={handleLogout}
            className="flex items-center justify-center gap-2 w-full py-2.5 rounded-xl text-[var(--pm-text-muted)] hover:text-[var(--pm-danger)] hover:bg-[var(--pm-danger)]/10 border border-[var(--pm-border)] text-xs font-black transition-all cursor-pointer active:scale-95"
          >
            <LogOut className="w-4 h-4" />
            <span>{isBn ? 'লগ আউট' : 'Log Out'}</span>
          </button>
        ) : (
          <Link
            to="/login"
            onClick={handleNavClick}
            className="flex items-center justify-center gap-2 w-full py-2.5 rounded-xl bg-[var(--pm-accent)] hover:bg-[var(--pm-accent-hover)] text-white text-xs font-black active:scale-95 transition-all"
          >
            <LogIn className="w-4 h-4" />
            {isBn ? 'লগইন / রেজিস্ট্রেশন' : 'Log In / Register'}
          </Link>
        )}
      </div>
    </div>
  );

  // Mobile drawer
  if (isMobileDrawer) {
    return (
      <AnimatePresence>
        {isOpen && (
          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={onClose}
              className="fixed inset-0 bg-black/60 backdrop-blur-xs z-50 lg:hidden"
            />
            <motion.aside
              initial={{ x: '-100%' }}
              animate={{ x: 0 }}
              exit={{ x: '-100%' }}
              transition={{ type: 'spring', damping: 26, stiffness: 200 }}
              className="fixed inset-y-0 left-0 w-[290px] sm:w-[320px] bg-[var(--pm-surface)] z-50 shadow-2xl border-r border-[var(--pm-border)] flex flex-col lg:hidden"
            >
              {sidebarContent}
            </motion.aside>
          </>
        )}
      </AnimatePresence>
    );
  }

  // Desktop rail
  return (
    <aside
      className={cn(
        'hidden lg:flex w-64 xl:w-72 2xl:w-80 h-[100dvh] sticky top-0 flex-col border-r border-[var(--pm-border)] bg-[var(--pm-surface)]/95 backdrop-blur-xl shrink-0 overflow-hidden select-none z-30',
        className
      )}
    >
      {sidebarContent}
    </aside>
  );
};

export const RoleBasedSidebar: React.FC<any> = ({ isOpen, onClose, className }) => (
  <UnifiedSidebar isMobileDrawer={isOpen !== undefined} isOpen={isOpen} onClose={onClose} className={className} />
);

export const SideNavDrawer: React.FC<{ isOpen: boolean; onClose: () => void }> = ({ isOpen, onClose }) => (
  <UnifiedSidebar isMobileDrawer isOpen={isOpen} onClose={onClose} />
);

export default UnifiedSidebar;
