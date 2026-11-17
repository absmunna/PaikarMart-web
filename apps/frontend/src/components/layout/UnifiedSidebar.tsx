import React, { useState } from 'react';
import {
  X,
  Newspaper,
  Package,
  Wrench,
  Car,
  Sparkles,
  Store,
  Cloud,
  ShoppingBag,
  ShieldCheck,
  ShieldAlert,
  Grid,
  Settings as SettingsIcon,
  BookOpen,
  Wallet,
  MessageSquare,
  ShoppingCart,
  Bell,
  ChevronRight,
  LogOut,
  LogIn,
  Check,
  Languages,
  MapPin,
  Navigation,
  Tag,
  Shirt,
  Smartphone,
  Pill,
  Egg,
  ClipboardList,
  Layers,
  Boxes,
  Lock,
  Loader2,
  ChevronDown,
  User as UserIcon,
  HelpCircle,
  ExternalLink,
} from 'lucide-react';
import { PortalTab, User } from '@/types';
import { useLanguage } from '@/contexts/LanguageContext';
import { useTheme, ThemeMode } from '@/contexts/ThemeContext';
import { useLocationSettings } from '@/contexts/LocationContext';
import { useAuth } from '@/features/auth';
import { SettingsSectionId } from '@/portals/settings-center';

export interface UnifiedSidebarProps {
  mode: 'desktop' | 'drawer';
  isOpen?: boolean;
  onClose?: () => void;
  currentTab?: PortalTab;
  onSelectTab: (tab: PortalTab) => void;
  currentUser: User;
  onOpenVendorModal: () => void;
  onOpenCloudGuide: () => void;
  onOpenHub?: () => void;
  onOpenWallet?: () => void;
  onOpenNotifications?: () => void;
  onOpenSettings?: () => void;
  onOpenSettingsPortal?: (section?: SettingsSectionId) => void;
  onOpenSuperAdminModal?: () => void;
  onOpenCart?: () => void;
  cartCount?: number;
  unreadNotificationsCount?: number;
  onOpenLocationModal?: () => void;
  onOpenAuthModal?: (tab?: 'login' | 'register') => void;
  onQuickFilter?: (query: string, targetTab?: PortalTab) => void;
}

const QUICK_THEME_SWATCHES: {
  id: ThemeMode;
  labelEn: string;
  labelBn: string;
  bgClass: string;
  dotClass: string;
}[] = [
  { id: 'light', labelEn: 'Light', labelBn: 'লাইট', bgClass: 'bg-slate-100', dotClass: 'bg-blue-600' },
  { id: 'nakshiLight', labelEn: 'Nakshi', labelBn: 'নকশী', bgClass: 'bg-amber-50', dotClass: 'bg-amber-700' },
  { id: 'greenField', labelEn: 'Green', labelBn: 'সবুজ', bgClass: 'bg-emerald-950', dotClass: 'bg-emerald-400' },
  { id: 'deepDark', labelEn: 'Deep', labelBn: 'ডিপ', bgClass: 'bg-zinc-950', dotClass: 'bg-orange-500' },
];

export const UnifiedSidebar: React.FC<UnifiedSidebarProps> = ({
  mode,
  isOpen = true,
  onClose,
  currentTab = 'feed',
  onSelectTab,
  currentUser,
  onOpenVendorModal,
  onOpenCloudGuide,
  onOpenHub,
  onOpenWallet,
  onOpenNotifications,
  onOpenSettings,
  onOpenSettingsPortal,
  onOpenSuperAdminModal,
  onOpenCart,
  cartCount = 0,
  unreadNotificationsCount = 0,
  onOpenLocationModal,
  onOpenAuthModal,
  onQuickFilter,
}) => {
  const { language, setLanguage, t } = useLanguage();
  const { themeMode, setThemeMode } = useTheme();
  const { activeLocation, radarRadiusKm, detectLiveLocation, isLocating } = useLocationSettings();
  const { firebaseUser, signOut } = useAuth();
  const isBn = language === 'bn';

  // Collapsible category section states
  const [openSections, setOpenSections] = useState<{
    portals: boolean;
    mokams: boolean;
    merchant: boolean;
    system: boolean;
  }>({
    portals: true,
    mokams: true,
    merchant: true,
    system: true,
  });

  const toggleSection = (section: keyof typeof openSections) => {
    setOpenSections((prev) => ({ ...prev, [section]: !prev[section] }));
  };

  if (mode === 'drawer' && !isOpen) return null;

  const navigateAndClose = (tab: PortalTab) => {
    onSelectTab(tab);
    onClose?.();
  };

  const handleQuickCategoryJump = (query: string, targetTab: PortalTab = 'commerce') => {
    if (onQuickFilter) {
      onQuickFilter(query, targetTab);
    } else {
      onSelectTab(targetTab);
    }
    onClose?.();
  };

  const openSettingsTarget = (section: SettingsSectionId = 'appearance') => {
    onClose?.();
    if (onOpenSettingsPortal) {
      onOpenSettingsPortal(section);
    } else if (onOpenSettings) {
      onOpenSettings();
    } else {
      onSelectTab('settings');
    }
  };

  const isSuperAdmin =
    currentUser.role === 'super_admin' ||
    currentUser.role === 'admin' ||
    currentUser.email === 'abs.munna1@gmail.com' ||
    firebaseUser?.email === 'abs.munna1@gmail.com';

  const primaryPortals: {
    id: PortalTab;
    labelEn: string;
    labelBn: string;
    badgeEn?: string;
    badgeBn?: string;
    icon: React.ComponentType<{ className?: string }>;
  }[] = [
    { id: 'feed', labelEn: 'Social Hub', labelBn: 'সোশ্যাল হাব', badgeEn: 'Feed', badgeBn: 'ফিড', icon: Newspaper },
    { id: 'commerce', labelEn: 'Marketplace Hub', labelBn: 'মার্কেটপ্লেস হাব', badgeEn: 'Market', badgeBn: 'বাজার', icon: ShoppingBag },
    { id: 'services', labelEn: 'Services Hub', labelBn: 'সার্ভিস হাব', badgeEn: 'Book', badgeBn: 'সেবা', icon: Wrench },
    { id: 'creator', labelEn: 'Creator Hub', labelBn: 'ক্রিয়েটর হাব', badgeEn: 'Video', badgeBn: 'ভিডিও', icon: Sparkles },
    { id: 'rides', labelEn: 'Logistics Hub', labelBn: 'লজিস্টিকস হাব', badgeEn: 'Ride', badgeBn: 'রাইড', icon: Car },
    { id: 'explore', labelEn: 'Hub Directory', labelBn: 'হাব ডিরেক্টরি', badgeEn: 'All', badgeBn: 'সব', icon: Grid },
    { id: 'messages', labelEn: 'Messages', labelBn: 'মেসেজ', badgeEn: 'Chat', badgeBn: 'চ্যাট', icon: MessageSquare },
  ];

  const commercialMokams: {
    id: string;
    titleEn: string;
    titleBn: string;
    subtitleEn: string;
    subtitleBn: string;
    query: string;
    targetTab: PortalTab;
    icon: React.ComponentType<{ className?: string }>;
    accentColor: string;
  }[] = [
    {
      id: 'chawkbazar',
      titleEn: 'Chawkbazar Bulk Wholesale',
      titleBn: 'চকবাজার পাইকারি আড়ত',
      subtitleEn: 'Factory lots, MOQ deals & bulk stock',
      subtitleBn: 'পাইকারি রেট ও মোকাম ডিল',
      query: 'Chawkbazar',
      targetTab: 'wholesale',
      icon: Boxes,
      accentColor: 'text-amber-500 bg-amber-500/10 border-amber-500/20',
    },
    {
      id: 'islampur',
      titleEn: 'Islampur Textile & Fashion',
      titleBn: 'ইসলামপুর ফ্যাশন ও পোশাক',
      subtitleEn: 'Fabrics, ethnic wear & garments',
      subtitleBn: 'পোশাক, শাড়ি ও টেক্সটাইল',
      query: 'Fashion',
      targetTab: 'commerce',
      icon: Shirt,
      accentColor: 'text-pink-500 bg-pink-500/10 border-pink-500/20',
    },
    {
      id: 'gadgets',
      titleEn: 'Gadget & Tech Market',
      titleBn: 'মোবাইল ও গ্যাজেট মোকাম',
      subtitleEn: 'Phones, laptops & accessories',
      subtitleBn: 'ইলেকট্রনিক্স ও প্রযুক্তি পণ্য',
      query: 'Electronics',
      targetTab: 'commerce',
      icon: Smartphone,
      accentColor: 'text-blue-500 bg-blue-500/10 border-blue-500/20',
    },
    {
      id: 'pharmacy',
      titleEn: '24/7 Pharmacy & Medicine',
      titleBn: '২৪/৭ ফার্মেসি ও ওষুধ',
      subtitleEn: 'Instant Rx & health supplies',
      subtitleBn: 'জরুরি ওষুধ ও প্রেসক্রিপশন',
      query: 'Pharmacy',
      targetTab: 'commerce',
      icon: Pill,
      accentColor: 'text-teal-500 bg-teal-500/10 border-teal-500/20',
    },
    {
      id: 'grocery',
      titleEn: 'Daily Fresh Grocery & Bazar',
      titleBn: 'নিত্যপণ্য ও কাঁচা বাজার',
      subtitleEn: 'Fresh vegetables, milk & staples',
      subtitleBn: 'টাটকা সবজি, ডিম ও নিত্যপণ্য',
      query: 'Grocery',
      targetTab: 'commerce',
      icon: Egg,
      accentColor: 'text-emerald-500 bg-emerald-500/10 border-emerald-500/20',
    },
    {
      id: 'demand',
      titleEn: 'Buyer Demand RFQ Board',
      titleBn: 'ডিমান্ড বোর্ড (RFQ বায়ার রিকুয়েস্ট)',
      subtitleEn: 'Post bulk needs, receive supplier bids',
      subtitleBn: 'পণ্য চেয়ে দরপত্র আহ্বান করুন',
      query: 'demand',
      targetTab: 'commerce',
      icon: ClipboardList,
      accentColor: 'text-orange-500 bg-orange-500/10 border-orange-500/20',
    },
  ];

  const innerContent = (
    <div className="flex flex-col h-full text-[var(--pm-text)] select-none">
      {/* 1. Header Bar (Drawer Mode) */}
      {mode === 'drawer' && (
        <div className="p-4 border-b border-[var(--pm-border)] bg-[var(--pm-surface)] flex items-center justify-between shrink-0">
          <div className="flex items-center gap-2.5">
            <div className="w-9 h-9 rounded-xl bg-[var(--pm-accent)] text-[var(--pm-accent-fg)] flex items-center justify-center font-black text-lg shadow-sm">
              P
            </div>
            <div>
              <h3 className="text-sm font-black text-[var(--pm-text)] leading-tight">
                {isBn ? 'পাইকারমার্ট সুপার অ্যাপ' : 'PaikarMart Super App'}
              </h3>
              <p className="text-[11px] text-[var(--pm-muted)]">
                {isBn ? 'অল-ইন-ওয়ান মার্কেটপ্লেস ও মোকাম' : 'All-in-One Super Marketplace'}
              </p>
            </div>
          </div>
          <button
            type="button"
            onClick={onClose}
            aria-label="Close menu"
            className="p-2 rounded-xl text-[var(--pm-muted)] hover:text-[var(--pm-text)] hover:bg-[var(--pm-card-hover)] transition-colors cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>
      )}

      {/* 2. Scrollable Navigation Body */}
      <div className={`flex-1 overflow-y-auto no-scrollbar space-y-4 ${mode === 'drawer' ? 'p-4' : 'pr-2'}`}>
        
        {/* User Profile Card with Quick Balance & Action Buttons */}
        <div className="p-3.5 rounded-2xl bg-[var(--pm-card)] border border-[var(--pm-border)] shadow-xs space-y-3">
          <div className="flex items-center justify-between gap-3">
            <div className="flex items-center gap-3 min-w-0">
              <div className="relative shrink-0">
                <img
                  src={currentUser.avatar}
                  alt={currentUser.name}
                  referrerPolicy="no-referrer"
                  className="w-11 h-11 rounded-full object-cover ring-2 ring-[var(--pm-accent)]/30"
                />
                <span className="absolute bottom-0 right-0 w-3 h-3 rounded-full bg-emerald-500 ring-2 ring-[var(--pm-card)]" />
              </div>
              <div className="min-w-0">
                <div className="flex items-center gap-1.5">
                  <span className="text-xs font-black text-[var(--pm-text)] truncate">
                    {currentUser.name}
                  </span>
                  {currentUser.isVendor && (
                    <ShieldCheck className="w-3.5 h-3.5 text-[var(--pm-accent)] shrink-0" />
                  )}
                </div>
                <span className="text-[10px] text-[var(--pm-muted)] block truncate">
                  {currentUser.isVendor
                    ? isBn
                      ? 'ভেরিফাইড মার্চেন্ট'
                      : 'Verified Merchant'
                    : isBn
                      ? 'রেগুলার মেম্বার'
                      : 'General Buyer'}
                </span>
                <span className="text-[11px] text-[var(--pm-accent)] font-mono font-bold block truncate">
                  ৳{currentUser.balance.toLocaleString()} {isBn ? 'ব্যালেন্স' : 'Balance'}
                </span>
              </div>
            </div>
          </div>

          {/* Quick Dual Profile & Orders Buttons */}
          <div className="grid grid-cols-2 gap-2 pt-1 border-t border-[var(--pm-border)]">
            <button
              type="button"
              onClick={() => navigateAndClose('profile')}
              className={`py-1.5 px-2.5 rounded-xl text-xs font-bold transition-all flex items-center justify-center gap-1.5 cursor-pointer ${
                currentTab === 'profile'
                  ? 'bg-[var(--pm-accent)] text-[var(--pm-accent-fg)]'
                  : 'bg-[var(--pm-surface)] hover:bg-[var(--pm-card-hover)] text-[var(--pm-text)] border border-[var(--pm-border)]'
              }`}
            >
              <UserIcon className="w-3.5 h-3.5 shrink-0" />
              <span className="truncate">{isBn ? 'প্রোফাইল' : 'Profile'}</span>
            </button>

            <button
              type="button"
              onClick={() => navigateAndClose('orders')}
              className={`py-1.5 px-2.5 rounded-xl text-xs font-bold transition-all flex items-center justify-center gap-1.5 cursor-pointer ${
                currentTab === 'orders'
                  ? 'bg-[var(--pm-accent)] text-[var(--pm-accent-fg)]'
                  : 'bg-[var(--pm-surface)] hover:bg-[var(--pm-card-hover)] text-[var(--pm-text)] border border-[var(--pm-border)]'
              }`}
            >
              <Package className="w-3.5 h-3.5 text-amber-500 shrink-0" />
              <span className="truncate">{isBn ? 'অর্ডারসমূহ' : 'My Orders'}</span>
            </button>
          </div>
        </div>

        {/* Hyperlocal Radar Bar (Quick Interactive Location & GPS Trigger) */}
        <div className="p-3 rounded-2xl bg-[var(--pm-surface)] border border-[var(--pm-border)] space-y-2">
          <div className="flex items-center justify-between text-xs">
            <div className="flex items-center gap-2 min-w-0">
              <div className="w-6 h-6 rounded-lg bg-emerald-500/15 text-emerald-500 flex items-center justify-center shrink-0">
                <MapPin className="w-3.5 h-3.5" />
              </div>
              <div className="min-w-0">
                <span className="text-[10px] text-[var(--pm-muted)] block font-semibold">
                  {isBn ? 'লোকাল রাডার লোকেশন' : 'Hyperlocal Radar Zone'}
                </span>
                <span className="text-xs font-bold text-[var(--pm-text)] truncate block">
                  {activeLocation || 'Dhaka, Bangladesh'}
                </span>
              </div>
            </div>
            <span className="text-[10px] font-mono font-bold px-2 py-0.5 rounded-full bg-emerald-500/10 text-emerald-500 border border-emerald-500/20 shrink-0">
              {radarRadiusKm}km
            </span>
          </div>

          <div className="grid grid-cols-2 gap-1.5">
            <button
              type="button"
              onClick={() => {
                if (onOpenLocationModal) {
                  onClose?.();
                  onOpenLocationModal();
                }
              }}
              className="py-1.5 px-2 rounded-xl bg-[var(--pm-card)] hover:bg-[var(--pm-card-hover)] border border-[var(--pm-border)] text-[11px] font-bold text-[var(--pm-text)] hover:text-[var(--pm-accent)] transition-all flex items-center justify-center gap-1 cursor-pointer"
            >
              <MapPin className="w-3 h-3 text-[var(--pm-accent)]" />
              <span className="truncate">{isBn ? 'মোকাম পরিবর্তন' : 'Change Mokam'}</span>
            </button>

            <button
              type="button"
              onClick={() => detectLiveLocation()}
              disabled={isLocating}
              className="py-1.5 px-2 rounded-xl bg-[var(--pm-card)] hover:bg-[var(--pm-card-hover)] border border-[var(--pm-border)] text-[11px] font-bold text-[var(--pm-text)] hover:text-emerald-500 transition-all flex items-center justify-center gap-1 cursor-pointer disabled:opacity-50"
            >
              {isLocating ? (
                <Loader2 className="w-3 h-3 text-emerald-500 animate-spin" />
              ) : (
                <Navigation className="w-3 h-3 text-emerald-500" />
              )}
              <span className="truncate">{isLocating ? (isBn ? 'খুঁজছে...' : 'Locating...') : (isBn ? 'লাইভ GPS' : 'Live GPS')}</span>
            </button>
          </div>
        </div>

        {/* 4-Grid Quick Action Matrix with Badges (Cart, Orders, Wallet, Alerts) */}
        <div className="grid grid-cols-2 gap-2">
          {/* Cart / Bag Button */}
          <button
            type="button"
            onClick={() => {
              if (onOpenCart) {
                onOpenCart();
                onClose?.();
              } else {
                navigateAndClose('commerce');
              }
            }}
            className="p-2.5 rounded-xl border bg-[var(--pm-card)] border-[var(--pm-border)] hover:bg-[var(--pm-card-hover)] text-left transition-all cursor-pointer flex items-center justify-between"
          >
            <div className="flex items-center gap-2 min-w-0">
              <ShoppingCart className="w-4 h-4 text-blue-500 shrink-0" />
              <span className="text-[11px] font-bold truncate">{isBn ? 'শপিং ব্যাগ' : 'Cart'}</span>
            </div>
            {cartCount > 0 && (
              <span className="px-1.5 py-0.5 rounded-full bg-[var(--pm-accent)] text-[var(--pm-accent-fg)] text-[10px] font-mono font-bold shrink-0">
                {cartCount}
              </span>
            )}
          </button>

          {/* Orders Hub */}
          <button
            type="button"
            onClick={() => navigateAndClose('orders')}
            className={`p-2.5 rounded-xl border text-left transition-all cursor-pointer flex items-center justify-between ${
              currentTab === 'orders'
                ? 'bg-[var(--pm-accent-soft)] border-[var(--pm-accent)]/40 text-[var(--pm-accent)]'
                : 'bg-[var(--pm-card)] border-[var(--pm-border)] hover:bg-[var(--pm-card-hover)]'
            }`}
          >
            <div className="flex items-center gap-2 min-w-0">
              <Package className="w-4 h-4 text-amber-500 shrink-0" />
              <span className="text-[11px] font-bold truncate">{isBn ? 'অর্ডারসমূহ' : 'Orders'}</span>
            </div>
            <span className="text-[10px] font-bold text-amber-500 bg-amber-500/10 px-1.5 py-0.2 rounded-md">
              Live
            </span>
          </button>

          {/* Wallet & Escrow */}
          <button
            type="button"
            onClick={() => {
              if (onOpenWallet) {
                onOpenWallet();
                onClose?.();
              } else {
                navigateAndClose('wallet');
              }
            }}
            className={`p-2.5 rounded-xl border text-left transition-all cursor-pointer flex items-center justify-between ${
              currentTab === 'wallet'
                ? 'bg-[var(--pm-accent-soft)] border-[var(--pm-accent)]/40 text-[var(--pm-accent)]'
                : 'bg-[var(--pm-card)] border-[var(--pm-border)] hover:bg-[var(--pm-card-hover)]'
            }`}
          >
            <div className="flex items-center gap-2 min-w-0">
              <Wallet className="w-4 h-4 text-emerald-500 shrink-0" />
              <span className="text-[11px] font-bold truncate">{isBn ? 'ওয়ালেট' : 'Wallet'}</span>
            </div>
            <span className="text-[10px] font-mono font-bold text-emerald-500">
              ৳{currentUser.balance > 999 ? `${(currentUser.balance / 1000).toFixed(1)}k` : currentUser.balance}
            </span>
          </button>

          {/* Notifications / Alerts */}
          <button
            type="button"
            onClick={() => {
              if (onOpenNotifications) {
                onOpenNotifications();
                onClose?.();
              } else {
                navigateAndClose('notifications');
              }
            }}
            className="p-2.5 rounded-xl border bg-[var(--pm-card)] border-[var(--pm-border)] hover:bg-[var(--pm-card-hover)] text-left transition-all cursor-pointer flex items-center justify-between"
          >
            <div className="flex items-center gap-2 min-w-0">
              <Bell className="w-4 h-4 text-sky-500 shrink-0" />
              <span className="text-[11px] font-bold truncate">{isBn ? 'অ্যালার্ট' : 'Alerts'}</span>
            </div>
            {unreadNotificationsCount > 0 && (
              <span className="px-1.5 py-0.5 rounded-full bg-rose-500 text-white text-[10px] font-mono font-bold shrink-0">
                {unreadNotificationsCount}
              </span>
            )}
          </button>
        </div>

        {/* SECTION 1: Core Super App Portals (সুপার অ্যাপ পোর্টাল) */}
        <div className="space-y-1">
          <button
            type="button"
            onClick={() => toggleSection('portals')}
            className="w-full px-2 py-1.5 flex items-center justify-between text-[11px] font-black uppercase tracking-wider text-[var(--pm-muted)] hover:text-[var(--pm-text)] transition-colors cursor-pointer"
          >
            <span className="flex items-center gap-1.5">
              <Layers className="w-3.5 h-3.5 text-[var(--pm-accent)]" />
              <span>{isBn ? 'সুপার অ্যাপ পোর্টালসমূহ' : 'Super App Portals'}</span>
            </span>
            <ChevronDown className={`w-3.5 h-3.5 transition-transform duration-200 ${openSections.portals ? 'rotate-180' : ''}`} />
          </button>

          {openSections.portals && (
            <div className="space-y-1 pt-0.5">
              {primaryPortals.map((portal) => {
                const Icon = portal.icon;
                const isActive = currentTab === portal.id;
                return (
                  <button
                    key={portal.id}
                    type="button"
                    onClick={() => navigateAndClose(portal.id)}
                    className={`w-full flex items-center justify-between px-3 py-2.5 rounded-2xl text-xs font-bold text-left transition-all cursor-pointer active:scale-[0.98] ${
                      isActive
                        ? 'bg-[var(--pm-accent-soft)] text-[var(--pm-accent)] border border-[var(--pm-accent)]/30 shadow-2xs'
                        : 'text-[var(--pm-text)] hover:bg-[var(--pm-card-hover)] border border-transparent'
                    }`}
                  >
                    <div className="flex items-center gap-3 min-w-0">
                      <div
                        className={`p-1.5 rounded-xl transition-colors shrink-0 ${
                          isActive
                            ? 'bg-[var(--pm-accent)] text-[var(--pm-accent-fg)] shadow-xs'
                            : 'bg-[var(--pm-surface)] border border-[var(--pm-border)] text-[var(--pm-muted)]'
                        }`}
                      >
                        <Icon className="w-4 h-4" />
                      </div>
                      <span className="truncate">{isBn ? portal.labelBn : portal.labelEn}</span>
                    </div>

                    {(portal.badgeBn || portal.badgeEn) && (
                      <span
                        className={`text-[10px] font-semibold px-2 py-0.5 rounded-md shrink-0 ${
                          isActive
                            ? 'bg-[var(--pm-accent)] text-[var(--pm-accent-fg)]'
                            : 'bg-[var(--pm-surface)] text-[var(--pm-muted)] border border-[var(--pm-border)]'
                        }`}
                      >
                        {isBn ? portal.badgeBn : portal.badgeEn}
                      </span>
                    )}
                  </button>
                );
              })}
            </div>
          )}
        </div>

        <div className="border-t border-[var(--pm-border)]" />

        {/* SECTION 2: Popular BD Mokam & Categories (জনপ্রিয় মোকাম ও ক্যাটাগরি) */}
        <div className="space-y-1">
          <button
            type="button"
            onClick={() => toggleSection('mokams')}
            className="w-full px-2 py-1.5 flex items-center justify-between text-[11px] font-black uppercase tracking-wider text-[var(--pm-muted)] hover:text-[var(--pm-text)] transition-colors cursor-pointer"
          >
            <span className="flex items-center gap-1.5">
              <Store className="w-3.5 h-3.5 text-amber-500" />
              <span>{isBn ? 'জনপ্রিয় মোকাম ও ক্যাটাগরি' : 'BD Trade Mokams & Markets'}</span>
            </span>
            <ChevronDown className={`w-3.5 h-3.5 transition-transform duration-200 ${openSections.mokams ? 'rotate-180' : ''}`} />
          </button>

          {openSections.mokams && (
            <div className="grid grid-cols-1 gap-1.5 pt-0.5">
              {commercialMokams.map((mokam) => {
                const Icon = mokam.icon;
                return (
                  <button
                    key={mokam.id}
                    type="button"
                    onClick={() => handleQuickCategoryJump(mokam.query, mokam.targetTab)}
                    className="w-full p-2 rounded-xl bg-[var(--pm-surface)] hover:bg-[var(--pm-card-hover)] border border-[var(--pm-border)] hover:border-[var(--pm-accent-border)] transition-all text-left flex items-center justify-between gap-2.5 cursor-pointer group"
                  >
                    <div className="flex items-center gap-2.5 min-w-0">
                      <div className={`p-1.5 rounded-lg border shrink-0 ${mokam.accentColor}`}>
                        <Icon className="w-3.5 h-3.5" />
                      </div>
                      <div className="min-w-0">
                        <span className="text-xs font-bold text-[var(--pm-text)] group-hover:text-[var(--pm-accent)] transition-colors block truncate">
                          {isBn ? mokam.titleBn : mokam.titleEn}
                        </span>
                        <span className="text-[10px] text-[var(--pm-muted)] block truncate">
                          {isBn ? mokam.subtitleBn : mokam.subtitleEn}
                        </span>
                      </div>
                    </div>
                    <ChevronRight className="w-3.5 h-3.5 text-[var(--pm-muted)] group-hover:text-[var(--pm-accent)] shrink-0 transition-transform group-hover:translate-x-0.5" />
                  </button>
                );
              })}
            </div>
          )}
        </div>

        <div className="border-t border-[var(--pm-border)]" />

        {/* SECTION 3: Merchant, Seller Central & B2B Suite (ব্যবসা ও সেলার সেন্ট্রাল) */}
        <div className="space-y-1">
          <button
            type="button"
            onClick={() => toggleSection('merchant')}
            className="w-full px-2 py-1.5 flex items-center justify-between text-[11px] font-black uppercase tracking-wider text-[var(--pm-muted)] hover:text-[var(--pm-text)] transition-colors cursor-pointer"
          >
            <span className="flex items-center gap-1.5">
              <ShieldCheck className="w-3.5 h-3.5 text-emerald-500" />
              <span>{isBn ? 'ব্যবসা ও সেলার সেন্ট্রাল' : 'Merchant & Vendor Suite'}</span>
            </span>
            <ChevronDown className={`w-3.5 h-3.5 transition-transform duration-200 ${openSections.merchant ? 'rotate-180' : ''}`} />
          </button>

          {openSections.merchant && (
            <div className="space-y-1.5 pt-0.5">
              {currentUser.isVendor ? (
                <>
                  <button
                    type="button"
                    onClick={() => navigateAndClose('vendor-dash')}
                    className={`w-full flex items-center justify-between px-3 py-2.5 rounded-2xl text-xs font-bold text-left transition-all cursor-pointer ${
                      currentTab === 'vendor-dash'
                        ? 'bg-emerald-500/15 text-emerald-500 border border-emerald-500/30'
                        : 'bg-[var(--pm-card)] hover:bg-[var(--pm-card-hover)] border border-[var(--pm-border)]'
                    }`}
                  >
                    <div className="flex items-center gap-2.5 min-w-0">
                      <div className="p-1.5 rounded-xl bg-emerald-500/15 text-emerald-500 shrink-0">
                        <Store className="w-4 h-4" />
                      </div>
                      <span className="truncate">{isBn ? 'মার্চেন্ট ড্যাশবোর্ড' : 'Vendor Central'}</span>
                    </div>
                    <span className="text-[10px] font-bold text-emerald-500 bg-emerald-500/10 px-2 py-0.5 rounded-full">
                      Active
                    </span>
                  </button>

                  <button
                    type="button"
                    onClick={() => openSettingsTarget('vendor_store')}
                    className="w-full flex items-center justify-between px-3 py-2 rounded-xl text-xs font-semibold text-[var(--pm-text)] hover:bg-[var(--pm-card-hover)] transition-all cursor-pointer"
                  >
                    <span className="truncate">{isBn ? '📦 ক্যাটালগ ও স্টোরফ্রন্ট' : '📦 Products & Catalog'}</span>
                    <ChevronRight className="w-3.5 h-3.5 text-[var(--pm-muted)]" />
                  </button>

                  <button
                    type="button"
                    onClick={() => openSettingsTarget('vendor_kyc')}
                    className="w-full flex items-center justify-between px-3 py-2 rounded-xl text-xs font-semibold text-[var(--pm-text)] hover:bg-[var(--pm-card-hover)] transition-all cursor-pointer"
                  >
                    <span className="truncate">{isBn ? '🛡️ কেওয়াইসি ভল্ট ও লাইসেন্স' : '🛡️ KYC Vault & Trade License'}</span>
                    <ChevronRight className="w-3.5 h-3.5 text-[var(--pm-muted)]" />
                  </button>

                  <button
                    type="button"
                    onClick={() => openSettingsTarget('vendor_payout')}
                    className="w-full flex items-center justify-between px-3 py-2 rounded-xl text-xs font-semibold text-[var(--pm-text)] hover:bg-[var(--pm-card-hover)] transition-all cursor-pointer"
                  >
                    <span className="truncate">{isBn ? '💳 ব্যাংক ও বিকাশ পে-আউট' : '💳 Bank & MFS Payouts'}</span>
                    <ChevronRight className="w-3.5 h-3.5 text-[var(--pm-muted)]" />
                  </button>
                </>
              ) : (
                <button
                  type="button"
                  onClick={() => {
                    onClose?.();
                    onOpenVendorModal();
                  }}
                  className="w-full p-3 rounded-2xl bg-gradient-to-r from-blue-600 to-indigo-600 text-white font-bold text-xs flex items-center justify-between shadow-md hover:opacity-95 transition-all cursor-pointer active:scale-[0.98]"
                >
                  <div className="flex items-center gap-2.5">
                    <ShieldCheck className="w-5 h-5 text-white" />
                    <div className="text-left">
                      <span className="block leading-tight">{isBn ? 'সেলার একাউন্ট খুলুন' : 'Become Verified Seller'}</span>
                      <span className="text-[10px] text-blue-100 font-normal">{isBn ? 'পাইকারি বা রিটেইল মোকাম' : 'B2B/B2C Free Registration'}</span>
                    </div>
                  </div>
                  <ChevronRight className="w-4 h-4 text-white" />
                </button>
              )}

              {/* Developer & Admin Restricted Console */}
              {isSuperAdmin && onOpenSuperAdminModal && (
                <button
                  type="button"
                  onClick={() => {
                    onClose?.();
                    onOpenSuperAdminModal();
                  }}
                  className="w-full flex items-center justify-between px-3 py-2.5 rounded-2xl text-xs font-bold text-purple-600 dark:text-purple-300 bg-purple-500/10 hover:bg-purple-500/20 border border-purple-500/25 transition-all cursor-pointer"
                >
                  <div className="flex items-center gap-2.5 min-w-0">
                    <ShieldAlert className="w-4 h-4 text-purple-500 shrink-0" />
                    <span className="truncate">{isBn ? 'সুপার অ্যাডমিন সেন্টার' : 'Super Admin Center'}</span>
                  </div>
                  <span className="text-[10px] font-mono font-bold bg-purple-500/20 px-1.5 py-0.5 rounded">
                    Admin
                  </span>
                </button>
              )}
            </div>
          )}
        </div>

        <div className="border-t border-[var(--pm-border)]" />

        {/* SECTION 4: System, Guide & Preferences (সিস্টেম ও সহায়তা) */}
        <div className="space-y-1">
          <button
            type="button"
            onClick={() => toggleSection('system')}
            className="w-full px-2 py-1.5 flex items-center justify-between text-[11px] font-black uppercase tracking-wider text-[var(--pm-muted)] hover:text-[var(--pm-text)] transition-colors cursor-pointer"
          >
            <span className="flex items-center gap-1.5">
              <SettingsIcon className="w-3.5 h-3.5 text-violet-500" />
              <span>{isBn ? 'সিস্টেম, গাইড ও সেটিংস' : 'System, Guide & Settings'}</span>
            </span>
            <ChevronDown className={`w-3.5 h-3.5 transition-transform duration-200 ${openSections.system ? 'rotate-180' : ''}`} />
          </button>

          {openSections.system && (
            <div className="space-y-1 pt-0.5">
              <button
                type="button"
                onClick={() => navigateAndClose('guide')}
                className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-2xl text-xs font-bold text-left transition-all cursor-pointer ${
                  currentTab === 'guide'
                    ? 'bg-[var(--pm-accent-soft)] text-[var(--pm-accent)]'
                    : 'hover:bg-[var(--pm-card-hover)]'
                }`}
              >
                <div className="p-1.5 rounded-xl bg-sky-500/15 text-sky-500 shrink-0">
                  <BookOpen className="w-4 h-4" />
                </div>
                <span className="truncate">{isBn ? 'ব্যবহারকারী ও সেলার গাইড' : 'User & Vendor Guide'}</span>
              </button>

              <button
                type="button"
                onClick={() => {
                  onClose?.();
                  onOpenCloudGuide();
                }}
                className="w-full flex items-center gap-3 px-3 py-2.5 rounded-2xl text-xs font-bold text-left hover:bg-[var(--pm-card-hover)] transition-all cursor-pointer"
              >
                <div className="p-1.5 rounded-xl bg-[var(--pm-surface)] border border-[var(--pm-border)] text-[var(--pm-accent)] shrink-0">
                  <Cloud className="w-4 h-4" />
                </div>
                <span className="truncate">{isBn ? 'মাল্টি-ক্লাউড ডিপ্লয় গাইড' : 'Multi-Cloud Deploy Config'}</span>
              </button>

              <button
                type="button"
                onClick={() => openSettingsTarget('appearance')}
                className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-2xl text-xs font-bold text-left transition-all cursor-pointer ${
                  currentTab === 'settings'
                    ? 'bg-[var(--pm-accent-soft)] text-[var(--pm-accent)]'
                    : 'hover:bg-[var(--pm-card-hover)]'
                }`}
              >
                <div className="p-1.5 rounded-xl bg-violet-500/15 text-violet-500 shrink-0">
                  <SettingsIcon className="w-4 h-4" />
                </div>
                <span className="truncate">{isBn ? 'অ্যাপ সেটিংস ও ডিসপ্লে' : 'Settings Center'}</span>
              </button>

              <button
                type="button"
                onClick={() => openSettingsTarget('account_security')}
                className="w-full flex items-center gap-3 px-3 py-2.5 rounded-2xl text-xs font-bold text-left hover:bg-[var(--pm-card-hover)] transition-all cursor-pointer"
              >
                <div className="p-1.5 rounded-xl bg-emerald-500/15 text-emerald-500 shrink-0">
                  <Lock className="w-4 h-4" />
                </div>
                <span className="truncate">{isBn ? 'সিকিউরিটি ও প্রাইভেসি' : 'Security & Privacy'}</span>
              </button>
            </div>
          )}
        </div>

        {/* SECTION 5: Authentication State & Action Button */}
        <div className="p-3 rounded-2xl bg-[var(--pm-surface)] border border-[var(--pm-border)]">
          {firebaseUser ? (
            <div className="flex items-center justify-between gap-2">
              <div className="min-w-0">
                <span className="text-[10px] text-[var(--pm-muted)] block">
                  {isBn ? 'লগইন একাউন্ট' : 'Active Account'}
                </span>
                <span className="text-xs font-bold text-[var(--pm-text)] truncate block">
                  {firebaseUser.email || currentUser.email}
                </span>
              </div>
              <button
                type="button"
                onClick={async () => {
                  await signOut();
                  onClose?.();
                }}
                className="py-1.5 px-3 rounded-xl bg-rose-500/15 hover:bg-rose-500/25 text-rose-500 font-bold text-xs flex items-center gap-1.5 transition-colors cursor-pointer shrink-0"
              >
                <LogOut className="w-3.5 h-3.5" />
                <span>{isBn ? 'লগআউট' : 'Sign Out'}</span>
              </button>
            </div>
          ) : (
            <div className="flex items-center justify-between gap-2">
              <div className="min-w-0">
                <span className="text-[10px] text-[var(--pm-muted)] block">
                  {isBn ? 'গেস্ট হিসেবে আছেন' : 'Browsing as Guest'}
                </span>
                <span className="text-xs font-bold text-[var(--pm-text)] truncate block">
                  {isBn ? 'সকল ফিচার পেতে লগইন করুন' : 'Sign in to access all tools'}
                </span>
              </div>
              <button
                type="button"
                onClick={() => {
                  onClose?.();
                  if (onOpenAuthModal) onOpenAuthModal('login');
                }}
                className="py-1.5 px-3 rounded-xl bg-[var(--pm-accent)] hover:bg-[var(--pm-accent-hover)] text-[var(--pm-accent-fg)] font-bold text-xs flex items-center gap-1.5 transition-colors cursor-pointer shrink-0"
              >
                <LogIn className="w-3.5 h-3.5" />
                <span>{isBn ? 'লগইন' : 'Sign In'}</span>
              </button>
            </div>
          )}
        </div>

      </div>

      {/* 3. Unified Sticky Footer: Theme Swatches + EN / বাংলা Switch */}
      <div
        className={`shrink-0 border-t border-[var(--pm-border)] bg-[var(--pm-surface)] space-y-2.5 ${
          mode === 'drawer' ? 'p-4' : 'p-3 mt-3 rounded-2xl border'
        }`}
      >
        <div className="flex items-center justify-between gap-2">
          {/* 4 Theme Color Swatches */}
          <div className="flex items-center gap-1.5" role="group" aria-label="Sidebar theme selector">
            {QUICK_THEME_SWATCHES.map((swatch) => {
              const isSelected = themeMode === swatch.id;
              return (
                <button
                  key={swatch.id}
                  type="button"
                  onClick={() => setThemeMode(swatch.id)}
                  title={isBn ? swatch.labelBn : swatch.labelEn}
                  aria-label={isBn ? swatch.labelBn : swatch.labelEn}
                  className={`w-7 h-7 rounded-full flex items-center justify-center border transition-all cursor-pointer ${swatch.bgClass} ${
                    isSelected
                      ? 'ring-2 ring-[var(--pm-accent)] ring-offset-1 border-white scale-110'
                      : 'border-[var(--pm-border)] opacity-80 hover:opacity-100 hover:scale-105'
                  }`}
                >
                  {isSelected ? (
                    <Check
                      className={`w-3.5 h-3.5 ${
                        swatch.id === 'light' || swatch.id === 'nakshiLight' ? 'text-slate-900' : 'text-white'
                      }`}
                    />
                  ) : (
                    <span className={`w-2.5 h-2.5 rounded-full ${swatch.dotClass}`} />
                  )}
                </button>
              );
            })}
          </div>

          {/* One-Click EN / বাংলা Switch */}
          <button
            type="button"
            onClick={() => setLanguage(language === 'bn' ? 'en' : 'bn')}
            className="px-2.5 py-1.5 rounded-xl bg-[var(--pm-card)] border border-[var(--pm-border)] hover:border-[var(--pm-accent)] text-[11px] font-bold flex items-center gap-1.5 text-[var(--pm-text)] transition-all cursor-pointer shrink-0"
            title={isBn ? 'Switch to English' : 'বাংলায় পরিবর্তন করুন'}
          >
            <Languages className="w-3.5 h-3.5 text-[var(--pm-accent)]" />
            <span>{isBn ? 'EN / বাংলা' : 'বাংলা / EN'}</span>
          </button>
        </div>

        <div className="flex items-center justify-between text-[10px] text-[var(--pm-muted)] pt-0.5">
          <span>PaikarMart v2.6 · Bangladesh</span>
          {mode === 'drawer' && onClose && (
            <button
              type="button"
              onClick={onClose}
              className="flex items-center gap-1 text-[var(--pm-danger)] font-bold hover:underline cursor-pointer"
            >
              <LogOut className="w-3 h-3" />
              <span>{isBn ? 'বন্ধ করুন' : 'Close'}</span>
            </button>
          )}
        </div>
      </div>
    </div>
  );

  if (mode === 'drawer') {
    return (
      <div className="fixed inset-0 z-50 flex justify-start bg-black/70 backdrop-blur-xs animate-fadeIn">
        <div
          className="relative w-full max-w-xs sm:max-w-sm h-full bg-[var(--pm-surface)] border-r border-[var(--pm-border)] shadow-2xl overflow-hidden flex flex-col"
          onClick={(e) => e.stopPropagation()}
        >
          {innerContent}
        </div>
        <div className="flex-1" onClick={onClose} aria-hidden="true" />
      </div>
    );
  }

  return (
    <aside className="hidden lg:block w-64 xl:w-72 shrink-0 sticky top-18 h-[calc(100vh-5rem)] rounded-3xl transition-all duration-300">
      {innerContent}
    </aside>
  );
};
