import React, { useState, useEffect } from 'react';
import { NavLink, Link, useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  X, Search, SlidersHorizontal, User, Shield, Bell, Lock, Globe, Database,
  Store, LayoutDashboard, PenTool, BarChart, DollarSign, FileCheck2,
  ShoppingBag, Users, Gamepad2, Video, Settings, LogOut, LogIn, UserPlus,
  ChevronDown, ChevronRight, Palette, Check, HelpCircle, Info, Download, Sparkles
} from 'lucide-react';
import { useTheme } from '@/providers/ThemeProvider';
import { useAuth } from '@/modules/auth';
import { useAppStore } from '@/store/appStore';
import { useTranslation } from '@/core/lib/i18n';
import { usePWAInstall } from '@/shared/hooks/usePWAInstall';
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
  const { lang, setLang } = useAppStore();
  const navigate = useNavigate();
  const [searchQuery, setSearchQuery] = useState('');
  const { isInstallable, promptInstall } = usePWAInstall();

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

  // Accordion Expand/Collapse state (defaulting sections to closed by default)
  const [expandedSections, setExpandedSections] = useState<Record<string, boolean>>({
    account: false,
    business: false,
    hubs: false,
    appSettings: false,
  });

  const toggleSection = (key: string) => {
    setExpandedSections((prev) => ({ ...prev, [key]: !prev[key] }));
  };

  const isBn = lang === 'BN' || lang === 'bn';

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

  const themes = [
    { id: 'deepDark', name: 'ডিপ ডার্ক', color: 'bg-slate-900 border-slate-700' },
    { id: 'colourful', name: 'কালারফুল', color: 'bg-gradient-to-r from-pink-500 to-indigo-500 border-white/20' },
    { id: 'nakshiLight', name: 'নকশী লাইট', color: 'bg-amber-50/80 border-amber-200' },
    { id: 'greenField', name: 'সবুজ মাঠ', color: 'bg-emerald-950 border-emerald-800' }
  ];

  // Search filter query
  const q = searchQuery.toLowerCase().trim();

  // Check if item matches search query
  const matchesSearch = (text: string) => {
    if (!q) return true;
    return text.toLowerCase().includes(q);
  };

  const sidebarContent = (
    <div className="flex flex-col h-full w-full select-none text-[var(--pm-text)] bg-[var(--pm-surface)] overflow-hidden font-sans border-r border-[var(--pm-border)]">
      
      {/* ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
          1. BRAND HEADER & CLOSE CONTROL
         ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━ */}
      <div className="p-4 border-b border-[var(--pm-border)] flex items-center justify-between shrink-0 bg-[var(--pm-surface)]">
        <Link to="/" onClick={handleNavClick} className="group flex items-center gap-3">
          <div className="w-10 h-10 rounded-2xl bg-gradient-to-br from-emerald-400 via-green-500 to-teal-600 flex items-center justify-center text-white font-black text-xl shadow-lg shadow-emerald-500/20 group-hover:scale-105 transition-transform">
            P
          </div>
          <div>
            <h1 className="text-xl font-black text-[var(--pm-text)] tracking-tight leading-none">
              Paikar<span className="text-[var(--pm-accent)]">Mart</span>
            </h1>
            <span className="text-[9px] text-[var(--pm-accent)] font-extrabold uppercase tracking-widest block mt-1">
              🇧🇩 সুপার কমার্স আড়ত
            </span>
          </div>
        </Link>

        {isMobileDrawer && (
          <button 
            onClick={onClose} 
            className="w-9 h-9 rounded-2xl bg-[var(--pm-surface-hover)] text-[var(--pm-text-muted)] hover:text-white transition-colors active:scale-95 cursor-pointer flex items-center justify-center border border-[var(--pm-border)]"
            title={isBn ? 'বন্ধ করুন' : 'Close'}
          >
            <X className="w-5 h-5" />
          </button>
        )}
      </div>

      {/* ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
          2. SEARCH INPUT BAR
         ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━ */}
      <div className="p-3.5 border-b border-[var(--pm-border)]/60 bg-[var(--pm-bg)]/40 shrink-0">
        <div className="relative flex items-center">
          <Search className="absolute left-3.5 w-4 h-4 text-[var(--pm-text-muted)]" />
          <input 
            type="text"
            placeholder={isBn ? 'পোস্ট, পণ্য, দোকান বা কিছু খুঁজুন...' : 'Search posts, products, shops...'}
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full bg-[var(--pm-bg)] border border-[var(--pm-border)] rounded-2xl pl-10 pr-9 py-2.5 text-xs text-[var(--pm-text)] placeholder-[var(--pm-text-muted)] focus:outline-none focus:border-[var(--pm-accent)] transition-all shadow-inner"
          />
          {searchQuery ? (
            <button 
              onClick={() => setSearchQuery('')}
              className="absolute right-3 text-zinc-400 hover:text-white cursor-pointer"
            >
              <X className="w-3.5 h-3.5" />
            </button>
          ) : (
            <SlidersHorizontal className="absolute right-3 w-4 h-4 text-[var(--pm-text-muted)] pointer-events-none" />
          )}
        </div>
      </div>

      {/* ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
          3. MAIN SCROLLABLE DRAWER CONTENT
         ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━ */}
      <div className="flex-1 overflow-y-auto no-scrollbar p-3.5 space-y-3.5">
        
        {/* ━ SECTION 1: MY ACCOUNT (ACCORDION CARD) ━ */}
        <div className="rounded-2xl border border-emerald-500/30 border-l-4 border-l-emerald-500 bg-[var(--pm-bg)]/60 overflow-hidden shadow-xs">
          {/* Card Header */}
          <button
            onClick={() => toggleSection('account')}
            className="w-full p-3.5 flex items-center justify-between bg-[var(--pm-surface)] hover:bg-[var(--pm-surface-hover)] transition-colors cursor-pointer text-left"
          >
            <div className="flex items-center gap-3">
              <div className="w-9 h-9 rounded-xl bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 flex items-center justify-center shrink-0">
                <User className="w-5 h-5" />
              </div>
              <div>
                <div className="flex items-center gap-2">
                  <h2 className="text-sm font-black text-[var(--pm-text)]">My Account</h2>
                  <span className={cn(
                    "px-2 py-0.5 rounded-full text-[9px] font-black uppercase tracking-wider",
                    isAuthenticated 
                      ? "bg-emerald-500/20 text-emerald-400 border border-emerald-500/30"
                      : "bg-amber-500/20 text-amber-400 border border-amber-500/30"
                  )}>
                    {isAuthenticated ? 'Logged In' : 'Guest'}
                  </span>
                </div>
                <p className="text-[10px] text-[var(--pm-text-muted)] mt-0.5">
                  {isBn ? 'প্রোফাইল • নিরাপত্তা • প্রাইভেসি • নোটিফিকেশন' : 'Profile • Security • Privacy • Notifications'}
                </p>
              </div>
            </div>
            <ChevronDown className={cn(
              "w-4 h-4 text-[var(--pm-text-muted)] transition-transform duration-200",
              expandedSections.account ? "rotate-180" : "rotate-0"
            )} />
          </button>

          {/* Card Body - Account Items */}
          <AnimatePresence>
            {(expandedSections.account || Boolean(q)) && (
              <motion.div
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: 'auto' }}
                exit={{ opacity: 0, height: 0 }}
                className="p-2 space-y-1 border-t border-[var(--pm-border)]/40 bg-[var(--pm-surface)]/40"
              >
                {!isAuthenticated ? (
                  /* Guest Options */
                  <div className="space-y-1.5 p-1">
                    {matchesSearch('Log In') && (
                      <NavLink
                        to="/login"
                        onClick={handleNavClick}
                        className="flex items-center justify-between p-2.5 rounded-xl bg-[var(--pm-accent)]/15 border border-[var(--pm-accent)]/30 text-[var(--pm-accent)] font-black text-xs hover:bg-[var(--pm-accent)] hover:text-white transition-all cursor-pointer"
                      >
                        <div className="flex items-center gap-2.5">
                          <LogIn className="w-4 h-4" />
                          <span>{isBn ? 'লগইন করুন (Log In)' : 'Log In'}</span>
                        </div>
                        <ChevronRight className="w-4 h-4" />
                      </NavLink>
                    )}
                    {matchesSearch('Register') && (
                      <NavLink
                        to="/register"
                        onClick={handleNavClick}
                        className="flex items-center justify-between p-2.5 rounded-xl border border-[var(--pm-border)] text-[var(--pm-text)] font-bold text-xs hover:bg-[var(--pm-surface-hover)] transition-all cursor-pointer"
                      >
                        <div className="flex items-center gap-2.5">
                          <UserPlus className="w-4 h-4 text-[var(--pm-text-muted)]" />
                          <span>{isBn ? 'অ্যাকাউন্ট তৈরি করুন (Register)' : 'Create Account'}</span>
                        </div>
                        <ChevronRight className="w-4 h-4 text-[var(--pm-text-muted)]" />
                      </NavLink>
                    )}
                  </div>
                ) : (
                  /* Registered User Options */
                  <>
                    {matchesSearch('প্রোফাইল সেটিংস Profile') && (
                      <NavLink
                        to="/settings/account/profile"
                        onClick={handleNavClick}
                        className={({ isActive }) => cn(
                          "flex items-center justify-between p-2.5 rounded-xl text-xs font-bold transition-all cursor-pointer group",
                          isActive ? "bg-[var(--pm-accent)]/15 text-[var(--pm-accent)] border border-[var(--pm-accent)]/30" : "text-[var(--pm-text-muted)] hover:bg-[var(--pm-surface-hover)] hover:text-[var(--pm-text)]"
                        )}
                      >
                        <div className="flex items-center gap-2.5">
                          <User className="w-4 h-4 text-[var(--pm-text-muted)] group-hover:text-[var(--pm-text)] shrink-0" />
                          <span>{isBn ? 'প্রোফাইল সেটিংস' : 'Profile Settings'}</span>
                        </div>
                        <ChevronRight className="w-3.5 h-3.5 text-[var(--pm-text-muted)]" />
                      </NavLink>
                    )}

                    {matchesSearch('নিরাপত্তা সেটিংস Security') && (
                      <NavLink
                        to="/settings/account/security"
                        onClick={handleNavClick}
                        className={({ isActive }) => cn(
                          "flex items-center justify-between p-2.5 rounded-xl text-xs font-bold transition-all cursor-pointer group",
                          isActive ? "bg-[var(--pm-accent)]/15 text-[var(--pm-accent)] border border-[var(--pm-accent)]/30" : "text-[var(--pm-text-muted)] hover:bg-[var(--pm-surface-hover)] hover:text-[var(--pm-text)]"
                        )}
                      >
                        <div className="flex items-center gap-2.5">
                          <Shield className="w-4 h-4 text-[var(--pm-text-muted)] group-hover:text-[var(--pm-text)] shrink-0" />
                          <span>{isBn ? 'নিরাপত্তা সেটিংস' : 'Security Settings'}</span>
                        </div>
                        <ChevronRight className="w-3.5 h-3.5 text-[var(--pm-text-muted)]" />
                      </NavLink>
                    )}

                    {matchesSearch('নোটিফিকেশন সেটিংস Notifications') && (
                      <NavLink
                        to="/settings/app/notifications"
                        onClick={handleNavClick}
                        className={({ isActive }) => cn(
                          "flex items-center justify-between p-2.5 rounded-xl text-xs font-bold transition-all cursor-pointer group",
                          isActive ? "bg-[var(--pm-accent)]/15 text-[var(--pm-accent)] border border-[var(--pm-accent)]/30" : "text-[var(--pm-text-muted)] hover:bg-[var(--pm-surface-hover)] hover:text-[var(--pm-text)]"
                        )}
                      >
                        <div className="flex items-center gap-2.5">
                          <Bell className="w-4 h-4 text-[var(--pm-text-muted)] group-hover:text-[var(--pm-text)] shrink-0" />
                          <span>{isBn ? 'নোটিফিকেশন সেটিংস' : 'Notification Settings'}</span>
                        </div>
                        <ChevronRight className="w-3.5 h-3.5 text-[var(--pm-text-muted)]" />
                      </NavLink>
                    )}

                    {matchesSearch('প্রাইভেসি সেটিংস Privacy') && (
                      <NavLink
                        to="/settings/app/privacy"
                        onClick={handleNavClick}
                        className={({ isActive }) => cn(
                          "flex items-center justify-between p-2.5 rounded-xl text-xs font-bold transition-all cursor-pointer group",
                          isActive ? "bg-[var(--pm-accent)]/15 text-[var(--pm-accent)] border border-[var(--pm-accent)]/30" : "text-[var(--pm-text-muted)] hover:bg-[var(--pm-surface-hover)] hover:text-[var(--pm-text)]"
                        )}
                      >
                        <div className="flex items-center gap-2.5">
                          <Lock className="w-4 h-4 text-[var(--pm-text-muted)] group-hover:text-[var(--pm-text)] shrink-0" />
                          <span>{isBn ? 'প্রাইভেসি সেটিংস' : 'Privacy Settings'}</span>
                        </div>
                        <ChevronRight className="w-3.5 h-3.5 text-[var(--pm-text-muted)]" />
                      </NavLink>
                    )}

                    {matchesSearch('ভাষা ও লোকেশন Language Location') && (
                      <NavLink
                        to="/settings/app/language"
                        onClick={handleNavClick}
                        className={({ isActive }) => cn(
                          "flex items-center justify-between p-2.5 rounded-xl text-xs font-bold transition-all cursor-pointer group",
                          isActive ? "bg-[var(--pm-accent)]/15 text-[var(--pm-accent)] border border-[var(--pm-accent)]/30" : "text-[var(--pm-text-muted)] hover:bg-[var(--pm-surface-hover)] hover:text-[var(--pm-text)]"
                        )}
                      >
                        <div className="flex items-center gap-2.5">
                          <Globe className="w-4 h-4 text-[var(--pm-text-muted)] group-hover:text-[var(--pm-text)] shrink-0" />
                          <span>{isBn ? 'ভাষা ও লোকেশন' : 'Language & Location'}</span>
                        </div>
                        <ChevronRight className="w-3.5 h-3.5 text-[var(--pm-text-muted)]" />
                      </NavLink>
                    )}

                    {matchesSearch('অ্যাকাউন্ট ডাটা ও এক্সপোর্ট Data') && (
                      <NavLink
                        to="/settings/app/data"
                        onClick={handleNavClick}
                        className={({ isActive }) => cn(
                          "flex items-center justify-between p-2.5 rounded-xl text-xs font-bold transition-all cursor-pointer group",
                          isActive ? "bg-[var(--pm-accent)]/15 text-[var(--pm-accent)] border border-[var(--pm-accent)]/30" : "text-[var(--pm-text-muted)] hover:bg-[var(--pm-surface-hover)] hover:text-[var(--pm-text)]"
                        )}
                      >
                        <div className="flex items-center gap-2.5">
                          <Database className="w-4 h-4 text-[var(--pm-text-muted)] group-hover:text-[var(--pm-text)] shrink-0" />
                          <span>{isBn ? 'অ্যাকাউন্ট ডাটা ও এক্সপোর্ট' : 'Account Data & Export'}</span>
                        </div>
                        <ChevronRight className="w-3.5 h-3.5 text-[var(--pm-text-muted)]" />
                      </NavLink>
                    )}
                  </>
                )}
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        {/* ━ SECTION 2: MY BUSINESS (ACCORDION CARD) ━ */}
        <div className="rounded-2xl border border-amber-500/30 border-l-4 border-l-amber-500 bg-[var(--pm-bg)]/60 overflow-hidden shadow-xs">
          {/* Card Header */}
          <button
            onClick={() => toggleSection('business')}
            className="w-full p-3.5 flex items-center justify-between bg-[var(--pm-surface)] hover:bg-[var(--pm-surface-hover)] transition-colors cursor-pointer text-left"
          >
            <div className="flex items-center gap-3">
              <div className="w-9 h-9 rounded-xl bg-amber-500/10 text-amber-400 border border-amber-500/20 flex items-center justify-center shrink-0">
                <Store className="w-5 h-5" />
              </div>
              <div>
                <div className="flex items-center gap-2">
                  <h2 className="text-sm font-black text-[var(--pm-text)]">My Business</h2>
                  <span className={cn(
                    "px-2 py-0.5 rounded-full text-[9px] font-black uppercase tracking-wider",
                    isSeller 
                      ? "bg-amber-500/20 text-amber-400 border border-amber-500/30"
                      : "bg-zinc-700/50 text-zinc-300 border border-zinc-600"
                  )}>
                    {isSeller ? 'Seller' : 'Store'}
                  </span>
                </div>
                <p className="text-[10px] text-[var(--pm-text-muted)] mt-0.5">
                  {isBn ? 'সেলার সেন্টার • স্টোর • কন্টেন্ট' : 'Seller Central • Store • Content'}
                </p>
              </div>
            </div>
            <ChevronDown className={cn(
              "w-4 h-4 text-[var(--pm-text-muted)] transition-transform duration-200",
              expandedSections.business ? "rotate-180" : "rotate-0"
            )} />
          </button>

          {/* Card Body - Business Items */}
          <AnimatePresence>
            {(expandedSections.business || Boolean(q)) && (
              <motion.div
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: 'auto' }}
                exit={{ opacity: 0, height: 0 }}
                className="p-2 space-y-1.5 border-t border-[var(--pm-border)]/40 bg-[var(--pm-surface)]/40"
              >
                {/* Prominent "Create Seller Account" CTA Item */}
                {(!isSeller || matchesSearch('সেলার অ্যাকাউন্ট তৈরি করুন Seller')) && (
                  <NavLink
                    to="/become-seller"
                    onClick={handleNavClick}
                    className="p-3 rounded-2xl bg-gradient-to-r from-amber-500/15 via-orange-500/10 to-amber-600/15 border border-amber-500/50 hover:border-amber-400 transition-all cursor-pointer flex items-center justify-between group shadow-sm my-1 block"
                  >
                    <div className="flex items-center gap-3">
                      <div className="w-8 h-8 rounded-xl bg-amber-500 text-black flex items-center justify-center font-black shrink-0 shadow-md">
                        <Store className="w-4 h-4" />
                      </div>
                      <div>
                        <p className="text-xs font-black text-amber-300 group-hover:text-amber-200 transition-colors">
                          {isBn ? 'সেলার অ্যাকাউন্ট তৈরি করুন' : 'Create Seller Account'}
                        </p>
                        <p className="text-[10px] text-[var(--pm-text-muted)] mt-0.5">
                          {isBn ? 'সহজেই সেলার হন এবং আপনার ব্যবসা শুরু করুন' : 'Become a merchant & start selling today'}
                        </p>
                      </div>
                    </div>
                    <ChevronRight className="w-4 h-4 text-amber-400 group-hover:translate-x-0.5 transition-transform shrink-0" />
                  </NavLink>
                )}

                {/* Seller Tools (Active Sellers Only) */}
                {isSeller && (
                  <>
                    {matchesSearch('সেলার সেন্টার Seller Central Dashboard') && (
                      <NavLink
                        to="/seller/dashboard"
                        onClick={handleNavClick}
                        className={({ isActive }) => cn(
                          "flex items-center justify-between p-2.5 rounded-xl text-xs font-bold transition-all cursor-pointer group",
                          isActive ? "bg-amber-500/15 text-amber-400 border border-amber-500/30" : "text-[var(--pm-text-muted)] hover:bg-[var(--pm-surface-hover)] hover:text-[var(--pm-text)]"
                        )}
                      >
                        <div className="flex items-center gap-2.5">
                          <LayoutDashboard className="w-4 h-4 text-[var(--pm-text-muted)] group-hover:text-[var(--pm-text)] shrink-0" />
                          <span>{isBn ? 'সেলার সেন্টার' : 'Seller Central'}</span>
                        </div>
                        <ChevronRight className="w-3.5 h-3.5 text-[var(--pm-text-muted)]" />
                      </NavLink>
                    )}

                    {matchesSearch('স্টোর ম্যানেজমেন্ট Store Management') && (
                      <NavLink
                        to="/seller/store"
                        onClick={handleNavClick}
                        className={({ isActive }) => cn(
                          "flex items-center justify-between p-2.5 rounded-xl text-xs font-bold transition-all cursor-pointer group",
                          isActive ? "bg-amber-500/15 text-amber-400 border border-amber-500/30" : "text-[var(--pm-text-muted)] hover:bg-[var(--pm-surface-hover)] hover:text-[var(--pm-text)]"
                        )}
                      >
                        <div className="flex items-center gap-2.5">
                          <Store className="w-4 h-4 text-[var(--pm-text-muted)] group-hover:text-[var(--pm-text)] shrink-0" />
                          <span>{isBn ? 'স্টোর ম্যানেজমেন্ট' : 'Store Management'}</span>
                        </div>
                        <ChevronRight className="w-3.5 h-3.5 text-[var(--pm-text-muted)]" />
                      </NavLink>
                    )}

                    {matchesSearch('কন্টেন্ট ক্রিয়েশন Content Creation') && (
                      <NavLink
                        to="/seller/content"
                        onClick={handleNavClick}
                        className={({ isActive }) => cn(
                          "flex items-center justify-between p-2.5 rounded-xl text-xs font-bold transition-all cursor-pointer group",
                          isActive ? "bg-amber-500/15 text-amber-400 border border-amber-500/30" : "text-[var(--pm-text-muted)] hover:bg-[var(--pm-surface-hover)] hover:text-[var(--pm-text)]"
                        )}
                      >
                        <div className="flex items-center gap-2.5">
                          <PenTool className="w-4 h-4 text-[var(--pm-text-muted)] group-hover:text-[var(--pm-text)] shrink-0" />
                          <span>{isBn ? 'কন্টেন্ট ক্রিয়েশন' : 'Content Creation'}</span>
                        </div>
                        <ChevronRight className="w-3.5 h-3.5 text-[var(--pm-text-muted)]" />
                      </NavLink>
                    )}

                    {matchesSearch('সেলস অ্যানালিটিক্স Sales Analytics') && (
                      <NavLink
                        to="/seller/analytics"
                        onClick={handleNavClick}
                        className={({ isActive }) => cn(
                          "flex items-center justify-between p-2.5 rounded-xl text-xs font-bold transition-all cursor-pointer group",
                          isActive ? "bg-amber-500/15 text-amber-400 border border-amber-500/30" : "text-[var(--pm-text-muted)] hover:bg-[var(--pm-surface-hover)] hover:text-[var(--pm-text)]"
                        )}
                      >
                        <div className="flex items-center gap-2.5">
                          <BarChart className="w-4 h-4 text-[var(--pm-text-muted)] group-hover:text-[var(--pm-text)] shrink-0" />
                          <span>{isBn ? 'সেলস অ্যানালিটিক্স' : 'Sales Analytics'}</span>
                        </div>
                        <ChevronRight className="w-3.5 h-3.5 text-[var(--pm-text-muted)]" />
                      </NavLink>
                    )}
                  </>
                )}
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        {/* ━ SECTION 3: MAIN MARKETPLACE HUBS CARDS ━ */}
        <div className="space-y-2">
          {matchesSearch('Marketplace মার্কেটপ্লেস') && (
            <NavLink
              to="/marketplace"
              onClick={handleNavClick}
              className={({ isActive }) => cn(
                "p-3.5 rounded-2xl border border-[var(--pm-border)] bg-[var(--pm-surface)] hover:bg-[var(--pm-surface-hover)] flex items-center justify-between transition-all cursor-pointer group shadow-xs border-l-4 border-l-cyan-500",
                isActive && "bg-cyan-500/10 border-cyan-500/40 text-cyan-400"
              )}
            >
              <div className="flex items-center gap-3">
                <div className="w-9 h-9 rounded-xl bg-cyan-500/10 text-cyan-400 border border-cyan-500/20 flex items-center justify-center shrink-0">
                  <ShoppingBag className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="text-xs font-black text-[var(--pm-text)]">Marketplace</h3>
                  <p className="text-[10px] text-[var(--pm-text-muted)] mt-0.5">
                    {isBn ? 'পণ্য কিনুন ও বিক্রি করুন' : 'Buy & Sell Products'}
                  </p>
                </div>
              </div>
              <ChevronRight className="w-4 h-4 text-[var(--pm-text-muted)] group-hover:translate-x-0.5 transition-transform" />
            </NavLink>
          )}

          {matchesSearch('Groups গ্রুপ ডিমান্ড') && (
            <NavLink
              to="/demand"
              onClick={handleNavClick}
              className={({ isActive }) => cn(
                "p-3.5 rounded-2xl border border-[var(--pm-border)] bg-[var(--pm-surface)] hover:bg-[var(--pm-surface-hover)] flex items-center justify-between transition-all cursor-pointer group shadow-xs border-l-4 border-l-sky-500",
                isActive && "bg-sky-500/10 border-sky-500/40 text-sky-400"
              )}
            >
              <div className="flex items-center gap-3">
                <div className="w-9 h-9 rounded-xl bg-sky-500/10 text-sky-400 border border-sky-500/20 flex items-center justify-center shrink-0">
                  <Users className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="text-xs font-black text-[var(--pm-text)]">Groups</h3>
                  <p className="text-[10px] text-[var(--pm-text-muted)] mt-0.5">
                    {isBn ? 'কম্যুনিটি ও আলোচনা' : 'B2B Community & Demands'}
                  </p>
                </div>
              </div>
              <ChevronRight className="w-4 h-4 text-[var(--pm-text-muted)] group-hover:translate-x-0.5 transition-transform" />
            </NavLink>
          )}

          {matchesSearch('Games গেমস') && (
            <NavLink
              to="/apps"
              onClick={handleNavClick}
              className={({ isActive }) => cn(
                "p-3.5 rounded-2xl border border-[var(--pm-border)] bg-[var(--pm-surface)] hover:bg-[var(--pm-surface-hover)] flex items-center justify-between transition-all cursor-pointer group shadow-xs border-l-4 border-l-purple-500",
                isActive && "bg-purple-500/10 border-purple-500/40 text-purple-400"
              )}
            >
              <div className="flex items-center gap-3">
                <div className="w-9 h-9 rounded-xl bg-purple-500/10 text-purple-400 border border-purple-500/20 flex items-center justify-center shrink-0">
                  <Gamepad2 className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="text-xs font-black text-[var(--pm-text)]">Games</h3>
                  <p className="text-[10px] text-[var(--pm-text-muted)] mt-0.5">
                    {isBn ? 'খেলুন ও পুরস্কার জিতুন' : 'Play & Win Rewards'}
                  </p>
                </div>
              </div>
              <ChevronRight className="w-4 h-4 text-[var(--pm-text-muted)] group-hover:translate-x-0.5 transition-transform" />
            </NavLink>
          )}

          {matchesSearch('Video ভিডিও') && (
            <NavLink
              to="/video"
              onClick={handleNavClick}
              className={({ isActive }) => cn(
                "p-3.5 rounded-2xl border border-[var(--pm-border)] bg-[var(--pm-surface)] hover:bg-[var(--pm-surface-hover)] flex items-center justify-between transition-all cursor-pointer group shadow-xs border-l-4 border-l-pink-500",
                isActive && "bg-pink-500/10 border-pink-500/40 text-pink-400"
              )}
            >
              <div className="flex items-center gap-3">
                <div className="w-9 h-9 rounded-xl bg-pink-500/10 text-pink-400 border border-pink-500/20 flex items-center justify-center shrink-0">
                  <Video className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="text-xs font-black text-[var(--pm-text)]">Video</h3>
                  <p className="text-[10px] text-[var(--pm-text-muted)] mt-0.5">
                    {isBn ? 'ভিডিও দেখুন ও শেয়ার করুন' : 'Watch & Share Videos'}
                  </p>
                </div>
              </div>
              <ChevronRight className="w-4 h-4 text-[var(--pm-text-muted)] group-hover:translate-x-0.5 transition-transform" />
            </NavLink>
          )}
        </div>

        {/* ━ SECTION 4: APP SETTINGS (PUBLIC & ACCESSIBLE TO ALL) ━ */}
        {matchesSearch('App Settings অ্যাপ সেটিংস') && (
          <NavLink
            to="/settings/app"
            onClick={handleNavClick}
            className={({ isActive }) => cn(
              "p-3.5 rounded-2xl border border-[var(--pm-border)] bg-[var(--pm-surface)] hover:bg-[var(--pm-surface-hover)] flex items-center justify-between transition-all cursor-pointer group shadow-xs border-l-4 border-l-indigo-500 block",
              isActive && "bg-indigo-500/10 border-indigo-500/40 text-indigo-400"
            )}
          >
            <div className="flex items-center gap-3">
              <div className="w-9 h-9 rounded-xl bg-indigo-500/10 text-indigo-400 border border-indigo-500/20 flex items-center justify-center shrink-0">
                <Settings className="w-5 h-5" />
              </div>
              <div>
                <h3 className="text-xs font-black text-[var(--pm-text)]">App Settings</h3>
                <p className="text-[10px] text-[var(--pm-text-muted)] mt-0.5">
                  {isBn ? 'থিম • ভাষা • নোটিফিকেশন • আরও' : 'Theme • Language • Notifications • More'}
                </p>
              </div>
            </div>
            <ChevronRight className="w-4 h-4 text-[var(--pm-text-muted)] group-hover:translate-x-0.5 transition-transform" />
          </NavLink>
        )}

      </div>

      {/* ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
          4. GLOBAL CONTROLS (Theme & Language Switcher)
         ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━ */}
      <div className="p-3 border-t border-[var(--pm-border)] bg-[var(--pm-surface-hover)]/30 shrink-0 space-y-2">
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
              className={`px-2.5 py-0.5 rounded-md text-[9px] font-black transition-all cursor-pointer ${lang === 'EN' || lang === 'en' ? 'bg-[var(--pm-accent)] text-white shadow-xs' : 'text-[var(--pm-text-muted)]'}`}
            >
              EN
            </button>
            <button
              onClick={() => setLang('BN')}
              className={`px-2.5 py-0.5 rounded-md text-[9px] font-black transition-all cursor-pointer ${lang === 'BN' || lang === 'bn' ? 'bg-[var(--pm-accent)] text-white shadow-xs' : 'text-[var(--pm-text-muted)]'}`}
            >
              বাংলা
            </button>
          </div>
        </div>
      </div>

      {/* ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
          5. FOOTER & SEPARATE LOG OUT BUTTON
         ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━ */}
      <div className="p-3 border-t border-[var(--pm-border)] bg-[var(--pm-surface)] shrink-0 space-y-2">
        {isInstallable && (
          <button
            onClick={() => promptInstall()}
            className="flex items-center justify-center gap-2 w-full py-2 rounded-xl bg-gradient-to-r from-emerald-600 to-teal-600 text-white text-xs font-black shadow-md shadow-emerald-500/20 active:scale-95 transition-all cursor-pointer"
          >
            <Download className="w-3.5 h-3.5" /> {isBn ? 'অ্যাপ ইনস্টল করুন (PWA)' : 'Install App (PWA)'}
          </button>
        )}

        {/* Separate Log Out Button */}
        {isAuthenticated ? (
          <button
            onClick={handleLogout}
            className="flex items-center justify-center gap-2 w-full py-2.5 rounded-2xl bg-[var(--pm-bg)] hover:bg-red-500/15 text-zinc-300 hover:text-red-400 border border-[var(--pm-border)] hover:border-red-500/30 text-xs font-black transition-all cursor-pointer shadow-xs active:scale-95"
          >
            <LogOut className="w-4 h-4 text-red-400" />
            <span>Log Out</span>
          </button>
        ) : (
          <Link
            to="/login"
            onClick={handleNavClick}
            className="flex items-center justify-center gap-2 w-full py-2.5 rounded-2xl bg-[var(--pm-accent)] hover:bg-[var(--pm-accent-hover)] text-white text-xs font-black shadow-md shadow-[var(--pm-accent)]/20 active:scale-95 transition-all"
          >
            <LogIn className="w-4 h-4" /> {isBn ? 'লগইন / রেজিস্ট্রেশন' : 'Log In / Register'}
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
