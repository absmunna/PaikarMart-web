import React, { useState } from 'react';
import { NavLink, Link, useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import {
  X, Home, ShoppingBag, Grid, Settings, LogOut, Check, LogIn, User,
  Store, Package, Heart, LayoutDashboard, PlusCircle, Search,
  Wallet, Building2, ShoppingBasket, Pill, Zap, Sparkles, MapPin,
  Wrench, Truck, Flame, Shield, Users, ShieldCheck, HelpCircle,
  MessageSquare, Bell, ChevronRight, Award, Palette, Globe
} from 'lucide-react';
import { useTheme } from '@/providers/ThemeProvider';
import { useAuth } from '@/modules/auth';
import { useWalletStore } from '@/modules/wallet';
import { useAppStore } from '@/store/appStore';
import { useTranslation } from '@/core/lib/i18n';
import { cn } from '@/lib/utils';

export interface UnifiedSidebarProps {
  isMobileDrawer?: boolean;
  isOpen?: boolean;
  onClose?: () => void;
  className?: string;
}

export const UnifiedSidebar: React.FC<UnifiedSidebarProps> = ({
  isMobileDrawer = false,
  isOpen = false,
  onClose,
  className
}) => {
  const { theme, setTheme } = useTheme();
  const { t } = useTranslation();
  const { user, isAuthenticated, logout, isSeller } = useAuth();
  const { balance, coins } = useWalletStore();
  const { lang, setLang } = useAppStore();
  const navigate = useNavigate();
  const [searchQuery, setSearchQuery] = useState('');

  const themes = [
    { id: 'deepDark', name: 'ডিপ ডার্ক', color: 'bg-slate-900 border-slate-700' },
    { id: 'colourful', name: 'কালারফুল', color: 'bg-gradient-to-r from-pink-500 to-indigo-500 border-white/20' },
    { id: 'nakshiLight', name: 'নকশী লাইট', color: 'bg-amber-50/80 border-amber-200' },
    { id: 'greenField', name: 'সবুজ মাঠ', color: 'bg-emerald-950 border-emerald-800' }
  ];

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

  const role = (user?.role || (user as any)?.roles?.[0] || 'buyer').toLowerCase();
  const isAdmin = role === 'admin' || role === 'super_admin';

  // Navigation Hub Items
  const hubItems = [
    { label: 'হোম ফিড (Home Feed)', icon: Home, color: 'text-orange-400 bg-orange-500/10', path: '/' },
    { label: 'শপিং মার্কেট (Shop)', icon: ShoppingBag, color: 'text-pink-400 bg-pink-500/10', path: '/shop', badge: 'হট' },
    { label: 'পাইকারি আড়ত (Wholesale B2B)', icon: Building2, color: 'text-blue-400 bg-blue-500/10', path: '/wholesale', badge: 'MOQ' },
    { label: 'মুদি আড়ত (Grocery Mart)', icon: ShoppingBasket, color: 'text-emerald-400 bg-emerald-500/10', path: '/portal/grocery' },
    { label: 'ফার্মেসি (Pharmacy)', icon: Pill, color: 'text-rose-400 bg-rose-500/10', path: '/portal/pharmacy' },
    { label: 'ইলেকট্রনিক্স (Tech Store)', icon: Zap, color: 'text-amber-400 bg-amber-500/10', path: '/portal/electronics' },
    { label: 'পিকে শপ (PK Exclusive)', icon: Sparkles, color: 'text-purple-400 bg-purple-500/10', path: '/pk-shop', badge: 'কয়েন' },
    { label: 'লোকাল শপ (Nearby)', icon: MapPin, color: 'text-cyan-400 bg-cyan-500/10', path: '/portal/nearby' },
    { label: 'সার্ভিস হাব (Services)', icon: Wrench, color: 'text-teal-400 bg-teal-500/10', path: '/services' },
    { label: 'লজিস্টিকস (Logistics)', icon: Truck, color: 'text-indigo-400 bg-indigo-500/10', path: '/logistic' },
    { label: 'ডিমান্ড বোর্ড (Buyer Demands)', icon: Flame, color: 'text-red-400 bg-red-500/10', path: '/demand' },
  ];

  // Personal Commerce Items
  const personalItems = [
    { label: 'আমার অর্ডার (My Orders)', icon: Package, color: 'text-sky-400 bg-sky-500/10', path: '/orders' },
    { label: 'পছন্দের তালিকা (Wishlist)', icon: Heart, color: 'text-rose-400 bg-rose-500/10', path: '/wishlist' },
    { label: 'সুপার ওয়ালেট (Wallet Hub)', icon: Wallet, color: 'text-emerald-400 bg-emerald-500/10', path: '/wallet' },
    { label: 'মেসেজ ও ইনবক্স (Messages)', icon: MessageSquare, color: 'text-blue-400 bg-blue-500/10', path: '/messages' },
    { label: 'নোটিফিকেশনস (Notifications)', icon: Bell, color: 'text-amber-400 bg-amber-500/10', path: '/notifications' },
    { label: 'সব পোর্টাল হাব (All Hubs)', icon: Grid, color: 'text-purple-400 bg-purple-500/10', path: '/portals' },
    { label: 'ডিভাইস সেটিংস (Settings)', icon: Settings, color: 'text-zinc-400 bg-zinc-500/10', path: '/settings' },
  ];

  // Seller Items
  const sellerItems = [
    { label: 'মার্চেন্ট ড্যাশবোর্ড (Overview)', icon: LayoutDashboard, path: '/seller' },
    { label: 'প্রোডাক্ট ম্যানেজমেন্ট (Products)', icon: ShoppingBag, path: '/seller/products' },
    { label: 'অর্ডার ফুলফিলমেন্ট (Orders)', icon: Package, path: '/seller/orders' },
    { label: 'আমার শপসমূহ (My Stores)', icon: Store, path: '/profile?tab=my-stores' },
  ];

  // Admin Items
  const adminItems = [
    { label: 'অ্যাডমিন ড্যাশবোর্ড (Dashboard)', icon: Shield, path: '/admin' },
    { label: 'ইউজার ম্যানেজমেন্ট (Users)', icon: Users, path: '/admin/users' },
    { label: 'পোর্টাল কনফিগ (Portals)', icon: Grid, path: '/admin/portals' },
  ];

  // Filter items by search query if any
  const q = searchQuery.toLowerCase().trim();
  const filterList = (items: any[]) => {
    if (!q) return items;
    return items.filter(it => it.label.toLowerCase().includes(q));
  };

  const filteredHubs = filterList(hubItems);
  const filteredPersonal = filterList(personalItems);
  const filteredSeller = filterList(sellerItems);
  const filteredAdmin = filterList(adminItems);

  // Inner Content of the Sidebar
  const sidebarContent = (
    <div className="flex flex-col h-full w-full select-none">

      {/* 1. Header & Brand / Close Button */}
      <div className="p-4 border-b border-[var(--pm-border)] flex items-center justify-between shrink-0 bg-[var(--pm-surface)]">
        <Link to="/" onClick={handleNavClick} className="group flex items-center gap-2.5">
          <div className="w-8 h-8 rounded-xl bg-gradient-to-tr from-[var(--pm-accent)] to-emerald-400 flex items-center justify-center text-white font-black text-sm shadow-md shadow-[var(--pm-accent)]/20 group-hover:scale-105 transition-transform">
            P
          </div>
          <div>
            <h1 className="text-lg font-black text-[var(--pm-text)] tracking-tight leading-none">
              Paikar<span className="text-[var(--pm-accent)]">Mart</span>
            </h1>
            <span className="text-[8px] text-[var(--pm-accent)] font-extrabold uppercase tracking-widest block mt-0.5">
              🇧🇩 সুপার কমার্স আড়ত
            </span>
          </div>
        </Link>

        {isMobileDrawer && (
          <button
            onClick={onClose}
            className="p-1.5 rounded-xl bg-[var(--pm-surface-hover)] text-[var(--pm-text-muted)] hover:text-[var(--pm-text)] transition-colors active:scale-95 cursor-pointer"
            title="Close"
          >
            <X className="w-4 h-4" />
          </button>
        )}
      </div>

      {/* User Header Profile Card (Header with User Avatar, Name, Role Badge) */}
      {isAuthenticated && user && (
        <div className="px-4 py-3 bg-[var(--pm-surface-hover)]/40 border-b border-[var(--pm-border)]">
          <Link
            to="/profile"
            onClick={handleNavClick}
            className="flex items-center gap-3 group cursor-pointer"
          >
            <div className="relative shrink-0">
              <div className="w-10 h-10 rounded-full border-2 border-[var(--pm-accent)] overflow-hidden bg-[var(--pm-bg)] flex items-center justify-center">
                {user.avatar || (user as any).avatarUrl ? (
                  <img
                    src={user.avatar || (user as any).avatarUrl}
                    alt={user.name || "User"}
                    className="w-full h-full object-cover"
                  />
                ) : (
                  <User className="w-5 h-5 text-[var(--pm-accent)]" />
                )}
              </div>
              <span className="absolute bottom-0 right-0 w-2.5 h-2.5 bg-emerald-500 border-2 border-[var(--pm-surface)] rounded-full" />
            </div>
            <div className="flex flex-col min-w-0">
              <p className="text-xs font-bold text-[var(--pm-text)] truncate group-hover:text-[var(--pm-accent)] transition-colors">
                {user.fullName || user.name || 'ইউজার'}
              </p>
              <div className="flex items-center gap-1.5 mt-0.5">
                <span className={cn(
                  "text-[9px] px-2 py-0.5 rounded-full font-black uppercase tracking-wider",
                  isSeller
                    ? "bg-emerald-500/15 text-emerald-400 border border-emerald-500/30"
                    : "bg-[var(--pm-accent)]/15 text-[var(--pm-accent)] border border-[var(--pm-accent)]/30"
                )}>
                  {isSeller ? `SELLER${(user as any).shopName ? `: ${(user as any).shopName}` : ''}` : 'BUYER'}
                </span>
              </div>
            </div>
          </Link>
        </div>
      )}

      {/* 2. Interactive Search Box */}
      <div className="p-3 border-b border-[var(--pm-border)]/60 bg-[var(--pm-surface-hover)]/30 shrink-0">
        <div className="relative">
          <Search className="absolute left-2.5 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-[var(--pm-text-muted)]" />
          <input
            type="text"
            placeholder="পোর্টাল বা মেনু খুঁজুন... / Search..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full bg-[var(--pm-bg)]/80 border border-[var(--pm-border)] rounded-xl pl-8 pr-7 py-1.5 text-xs text-[var(--pm-text)] placeholder-[var(--pm-text-muted)] focus:outline-none focus:border-[var(--pm-accent)] transition-all"
          />
          {searchQuery && (
            <button
              onClick={() => setSearchQuery('')}
              className="absolute right-2 top-1/2 -translate-y-1/2 text-zinc-500 hover:text-white"
            >
              <X className="w-3 h-3" />
            </button>
          )}
        </div>
      </div>

      {/* 3. Scrollable Navigation List */}
      <div className="flex-1 overflow-y-auto no-scrollbar p-3 space-y-5">

        {/* Admin Section (if admin) */}
        {isAdmin && filteredAdmin.length > 0 && (
          <div className="space-y-1.5">
            <div className="flex items-center gap-1.5 px-2 text-[10px] font-black uppercase text-red-400 tracking-wider">
              <Shield className="w-3.5 h-3.5" /> অ্যাডমিন কমান্ড সেন্টার
            </div>
            <nav className="space-y-0.5">
              {filteredAdmin.map(item => {
                const Icon = item.icon;
                return (
                  <NavLink
                    key={item.path}
                    to={item.path}
                    onClick={handleNavClick}
                    className={({ isActive }) =>
                      `w-full text-left px-3 py-2 rounded-xl transition-all font-semibold text-xs flex items-center gap-2.5 ${isActive
                        ? 'bg-red-500/15 text-red-400 font-bold border border-red-500/30'
                        : 'hover:bg-[var(--pm-surface-hover)] text-[var(--pm-text-muted)] hover:text-[var(--pm-text)]'
                      }`
                    }
                  >
                    <div className="w-6 h-6 rounded-lg bg-red-500/10 flex items-center justify-center shrink-0">
                      <Icon className="w-3.5 h-3.5 text-red-400" />
                    </div>
                    <span className="truncate">{item.label}</span>
                  </NavLink>
                );
              })}
            </nav>
          </div>
        )}

        {/* Seller Section */}
        {isSeller ? (
          filteredSeller.length > 0 && (
            <div className="space-y-1.5">
              <div className="flex items-center gap-1.5 px-2 text-[10px] font-black uppercase text-emerald-400 tracking-wider">
                <Store className="w-3.5 h-3.5" /> মার্চেন্ট সেন্ট্রাল (Seller)
              </div>
              <nav className="space-y-0.5">
                {filteredSeller.map(item => {
                  const Icon = item.icon;
                  return (
                    <NavLink
                      key={item.path}
                      to={item.path}
                      onClick={handleNavClick}
                      className={({ isActive }) =>
                        `w-full text-left px-3 py-2 rounded-xl transition-all font-semibold text-xs flex items-center gap-2.5 ${isActive
                          ? 'bg-emerald-500/15 text-emerald-400 font-bold border border-emerald-500/30'
                          : 'hover:bg-[var(--pm-surface-hover)] text-[var(--pm-text-muted)] hover:text-[var(--pm-text)]'
                        }`
                      }
                    >
                      <div className="w-6 h-6 rounded-lg bg-emerald-500/10 flex items-center justify-center shrink-0">
                        <Icon className="w-3.5 h-3.5 text-emerald-400" />
                      </div>
                      <span className="truncate">{item.label}</span>
                    </NavLink>
                  );
                })}
              </nav>
            </div>
          )
        ) : (
          /* Become a seller banner */
          <div className="p-3.5 rounded-2xl bg-gradient-to-br from-[var(--pm-accent)]/15 via-[var(--pm-accent)]/5 to-transparent border border-[var(--pm-accent)]/25">
            <div className="flex items-center gap-1.5 text-[var(--pm-accent)] font-black text-xs uppercase tracking-wider mb-1">
              <Store className="w-3.5 h-3.5" /> অনলাইন আড়ত খুলুন
            </div>
            <p className="text-[10px] text-[var(--pm-text-muted)] leading-relaxed font-medium mb-2.5">
              ০% ফি-তে দেশজুড়ে পাইকারি ও খুচরা বিক্রয় শুরু করুন।
            </p>
            <Link
              to="/become-seller"
              onClick={handleNavClick}
              className="w-full py-1.5 px-3 rounded-xl bg-[var(--pm-accent)] hover:bg-[var(--pm-accent-hover)] text-white text-[10px] font-bold text-center block transition-all shadow-md shadow-[var(--pm-accent)]/20 active:scale-95"
            >
              সেলার আবেদন করুন →
            </Link>
          </div>
        )}

        {/* Hubs & Marketplace List */}
        {filteredHubs.length > 0 && (
          <div className="space-y-1.5">
            <p className="text-[10px] font-black text-[var(--pm-text-muted)] uppercase tracking-wider px-2">
              মার্কেটপ্লেস ও আড়ত (Hubs)
            </p>
            <nav className="space-y-0.5">
              {filteredHubs.map(item => {
                const IconComp = item.icon;
                return (
                  <NavLink
                    key={item.path}
                    to={item.path}
                    onClick={handleNavClick}
                    className={({ isActive }) =>
                      `w-full text-left px-3 py-2 rounded-xl transition-all font-semibold text-xs flex items-center justify-between group ${isActive
                        ? 'bg-[var(--pm-accent-soft)] text-[var(--pm-accent)] font-bold border border-[var(--pm-accent)]/30'
                        : 'hover:bg-[var(--pm-surface-hover)] text-[var(--pm-text-muted)] hover:text-[var(--pm-text)]'
                      }`
                    }
                  >
                    <div className="flex items-center gap-2.5 min-w-0">
                      <div className={`w-6 h-6 rounded-lg flex items-center justify-center shrink-0 ${item.color} group-hover:scale-105 transition-transform`}>
                        <IconComp className="w-3.5 h-3.5" />
                      </div>
                      <span className="truncate">{item.label}</span>
                    </div>
                    {item.badge && (
                      <span className="text-[8px] font-black px-1.5 py-0.5 rounded bg-[var(--pm-accent)]/15 text-[var(--pm-accent)] uppercase">
                        {item.badge}
                      </span>
                    )}
                  </NavLink>
                );
              })}
            </nav>
          </div>
        )}

        {/* Personal Commerce List */}
        {filteredPersonal.length > 0 && (
          <div className="space-y-1.5">
            <p className="text-[10px] font-black text-[var(--pm-text-muted)] uppercase tracking-wider px-2">
              লেনদেন ও ট্র্যাকিং (Commerce)
            </p>
            <nav className="space-y-0.5">
              {filteredPersonal.map(item => {
                const IconComp = item.icon;
                return (
                  <NavLink
                    key={item.path}
                    to={item.path}
                    onClick={handleNavClick}
                    className={({ isActive }) =>
                      `w-full text-left px-3 py-2 rounded-xl transition-all font-semibold text-xs flex items-center gap-2.5 group ${isActive
                        ? 'bg-[var(--pm-accent-soft)] text-[var(--pm-accent)] font-bold border border-[var(--pm-accent)]/30'
                        : 'hover:bg-[var(--pm-surface-hover)] text-[var(--pm-text-muted)] hover:text-[var(--pm-text)]'
                      }`
                    }
                  >
                    <div className={`w-6 h-6 rounded-lg flex items-center justify-center shrink-0 ${item.color} group-hover:scale-105 transition-transform`}>
                      <IconComp className="w-3.5 h-3.5" />
                    </div>
                    <span className="truncate">{item.label}</span>
                  </NavLink>
                );
              })}
            </nav>
          </div>
        )}

      </div>

      {/* 4. Settings Section (Themes & Language) */}
      <div className="p-3 border-t border-[var(--pm-border)] bg-[var(--pm-surface-hover)]/40 shrink-0 space-y-2.5">

        {/* Theme Palette */}
        <div className="flex items-center justify-between px-1">
          <span className="text-[10px] font-bold text-[var(--pm-text-muted)] uppercase tracking-wider flex items-center gap-1">
            <Palette className="w-3 h-3 text-[var(--pm-accent)]" /> {t('themes')}
          </span>
          <div className="flex gap-1.5">
            {themes.map((tItem) => (
              <button
                key={tItem.id}
                onClick={() => setTheme(tItem.id as any)}
                className={`w-5 h-5 rounded-full border-2 ${tItem.color} relative cursor-pointer transition-transform hover:scale-110 flex items-center justify-center shadow-xs`}
                title={tItem.name}
              >
                {theme === tItem.id && <Check className="w-2.5 h-2.5 text-white drop-shadow-[0_1px_1px_rgba(0,0,0,0.8)]" />}
              </button>
            ))}
          </div>
        </div>

        {/* Language Switch */}
        <div className="flex items-center justify-between px-1">
          <span className="text-[10px] font-bold text-[var(--pm-text-muted)] uppercase tracking-wider flex items-center gap-1">
            <Globe className="w-3 h-3 text-[var(--pm-accent)]" /> ভাষা
          </span>
          <div className="flex bg-[var(--pm-bg)]/80 p-0.5 rounded-lg border border-[var(--pm-border)]">
            <button
              onClick={() => setLang('EN')}
              className={`px-2.5 py-0.5 rounded-md text-[9px] font-black transition-all ${lang === 'EN' ? 'bg-[var(--pm-accent)] text-white shadow-xs' : 'text-[var(--pm-text-muted)]'}`}
            >
              EN
            </button>
            <button
              onClick={() => setLang('BN')}
              className={`px-2.5 py-0.5 rounded-md text-[9px] font-black transition-all ${lang === 'BN' ? 'bg-[var(--pm-accent)] text-white shadow-xs' : 'text-[var(--pm-text-muted)]'}`}
            >
              বাংলা
            </button>
          </div>
        </div>

      </div>

      {/* 5. User Profile Card / Login Footing */}
      <div className="p-3 border-t border-[var(--pm-border)] bg-[var(--pm-surface)] shrink-0">
        {isAuthenticated && user ? (
          <div className="flex items-center justify-between gap-2">
            <Link
              to="/profile"
              onClick={handleNavClick}
              className="flex items-center gap-2.5 min-w-0 flex-1 group"
            >
              <div className="relative shrink-0">
                <div className="w-9 h-9 rounded-full border-2 border-[var(--pm-accent)] overflow-hidden bg-[var(--pm-bg)]">
                  <img
                    src={user.avatar || (user as any).avatarUrl || `https://api.dicebear.com/7.x/avataaars/svg?seed=${user.name}`}
                    alt="Profile"
                    className="w-full h-full object-cover"
                  />
                </div>
                <span className="absolute bottom-0 right-0 w-2.5 h-2.5 bg-emerald-500 border-2 border-[var(--pm-surface)] rounded-full" />
              </div>
              <div className="flex flex-col min-w-0">
                <p className="text-xs font-bold text-[var(--pm-text)] truncate group-hover:text-[var(--pm-accent)] transition-colors">
                  {user.fullName || user.name || 'ইউজার'}
                </p>
                <div className="flex items-center gap-1.5 mt-0.5">
                  <span className="text-[8px] bg-[var(--pm-accent)]/10 text-[var(--pm-accent)] border border-[var(--pm-accent)]/20 px-1.5 py-0.2 rounded font-black uppercase tracking-wider">
                    {user.role}
                  </span>
                  <span className="text-[8px] text-zinc-500 font-bold">• Lvl 3</span>
                </div>
              </div>
            </Link>

            <button
              onClick={handleLogout}
              className="p-2 text-red-400 hover:text-red-300 hover:bg-red-500/10 rounded-xl transition-all"
              title="Logout"
            >
              <LogOut className="w-4 h-4" />
            </button>
          </div>
        ) : (
          <Link
            to="/login"
            onClick={handleNavClick}
            className="flex items-center justify-center gap-2 w-full py-2.5 rounded-xl bg-[var(--pm-accent)] hover:bg-[var(--pm-accent-hover)] text-white text-xs font-bold shadow-md shadow-[var(--pm-accent)]/20 active:scale-95 transition-all"
          >
            <LogIn className="w-4 h-4" /> লগইন / রেজিস্ট্রেশন
          </Link>
        )}
      </div>

    </div>
  );

  // If rendering as a Mobile Drawer:
  if (isMobileDrawer) {
    return (
      <AnimatePresence>
        {isOpen && (
          <>
            {/* Backdrop */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={onClose}
              className="fixed inset-0 bg-black/60 backdrop-blur-xs z-50 lg:hidden"
            />
            {/* Drawer */}
            <motion.aside
              initial={{ x: '-100%' }}
              animate={{ x: 0 }}
              exit={{ x: '-100%' }}
              transition={{ type: 'spring', damping: 26, stiffness: 200 }}
              className="fixed inset-y-0 left-0 w-[290px] sm:w-[330px] bg-[var(--pm-surface)] z-50 shadow-2xl border-r border-[var(--pm-border)] flex flex-col lg:hidden"
            >
              {sidebarContent}
            </motion.aside>
          </>
        )}
      </AnimatePresence>
    );
  }

  // If rendering on Desktop:
  return (
    <aside className={cn(
      "hidden lg:flex w-64 xl:w-72 2xl:w-80 h-[100dvh] sticky top-0 flex-col border-r border-[var(--pm-border)] bg-[var(--pm-surface)]/95 backdrop-blur-xl shrink-0 overflow-hidden select-none z-30",
      className
    )}>
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
