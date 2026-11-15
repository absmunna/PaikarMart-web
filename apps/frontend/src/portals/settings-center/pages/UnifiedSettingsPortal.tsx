import React, { useState, useEffect } from 'react';
import { 
  Palette, 
  Languages, 
  MapPin, 
  Info, 
  User as UserIcon, 
  ShieldCheck, 
  Home, 
  CreditCard, 
  Bell, 
  Store, 
  FileCheck2, 
  Landmark, 
  Truck, 
  Clock, 
  ChevronRight, 
  ChevronLeft, 
  Search, 
  X, 
  ArrowLeft,
  Sparkles,
  Sun,
  Moon,
  Laptop,
  Check,
  Building2,
  ExternalLink,
  ShieldAlert
} from 'lucide-react';
import { PortalTab, User } from '@/types';
import { useLanguage } from '@/contexts/LanguageContext';
import { useTheme, ThemeMode } from '@/contexts/ThemeContext';
import { LocationPreferences } from '@/portals/settings-center/components/LocationPreferences';

// User Account Pages
import {
  PersonalProfilePage,
  SecuritySettingsPage,
  SavedAddressesPage,
  PaymentMethodsPage,
  NotificationPreferencesPage
} from '@/portals/user-profile';

// Vendor Merchant Pages
import {
  StorefrontSettingsPage,
  BusinessKYCSettingsPage,
  PayoutSettingsPage,
  FulfillmentSettingsPage,
  StoreHoursSettingsPage
} from '@/portals/seller-central';

export type SettingsSectionId = 
  | 'appearance'
  | 'language'
  | 'location'
  | 'about'
  | 'account_profile'
  | 'account_security'
  | 'account_addresses'
  | 'account_payments'
  | 'account_notifications'
  | 'vendor_store'
  | 'vendor_kyc'
  | 'vendor_payout'
  | 'vendor_fulfillment'
  | 'vendor_hours';

interface UnifiedSettingsPortalProps {
  initialSection?: SettingsSectionId;
  onSelectTab?: (tab: PortalTab) => void;
  currentUser?: User;
  onUpdateUser?: (updated: User) => void;
  onClose?: () => void;
}

export const UnifiedSettingsPortal: React.FC<UnifiedSettingsPortalProps> = ({
  initialSection = 'account_profile',
  onSelectTab,
  currentUser,
  onUpdateUser,
  onClose
}) => {
  const { language, setLanguage, t } = useLanguage();
  const { themeMode, setThemeMode, accentColor, setAccentColor } = useTheme();
  const isBn = language === 'bn';

  const [activeSection, setActiveSection] = useState<SettingsSectionId>(initialSection);
  const [searchQuery, setSearchQuery] = useState('');
  const [mobileDetailView, setMobileDetailView] = useState(false);

  // Sync if initialSection changes from outside (e.g. from Sidebar drawer link click)
  useEffect(() => {
    if (initialSection) {
      setActiveSection(initialSection);
      setMobileDetailView(true);
    }
  }, [initialSection]);

  const navGroups: {
    id: 'common' | 'account' | 'vendor';
    title: string;
    description: string;
    items: {
      id: SettingsSectionId;
      label: string;
      desc: string;
      icon: React.ComponentType<{ className?: string }>;
      badge?: string;
      accentColor: string;
    }[];
  }[] = [
    {
      id: 'common',
      title: isBn ? 'সাধারণ সেটিংস ও সিস্টেম' : 'General & System Preferences',
      description: isBn ? 'থিম, ভাষা, লাইভ জিপিএস লোকেশন ও অ্যাপ তথ্য' : 'Theme, language, GPS radar & system configuration',
      items: [
        {
          id: 'appearance',
          label: isBn ? 'থিম ও ডিসপ্লে মোড' : 'Theme & Display',
          desc: isBn ? 'ডার্ক মোড, ওলেড নাইট, লাইট মোড ও সিস্টেম অটো' : 'Dark, light, and system display theme',
          icon: Palette,
          accentColor: 'text-violet-500 bg-violet-500/10 dark:bg-violet-500/20',
        },
        {
          id: 'language',
          label: isBn ? 'ভাষা ও আঞ্চলিক রূপ' : 'Language & Region',
          desc: isBn ? 'বাংলা ও ইংরেজি ভাষা নির্বাচন, মুদ্রা ও সংখ্যা' : 'Switch Bengali and English localization',
          icon: Languages,
          accentColor: 'text-emerald-500 bg-emerald-500/10 dark:bg-emerald-500/20',
        },
        {
          id: 'location',
          label: isBn ? 'লাইভ জিপিএস রাডার' : 'Live GPS Radar & Zones',
          desc: isBn ? 'রিয়েলটাইম ডিভাইস কোঅর্ডিনেট ও ডেলিভারি হাব' : 'Real-time GPS device coordinates & delivery hubs',
          icon: MapPin,
          badge: isBn ? 'সক্রিয়' : 'LIVE',
          accentColor: 'text-blue-500 bg-blue-500/10 dark:bg-blue-500/20',
        },
        {
          id: 'about',
          label: isBn ? 'অ্যাপ সম্পর্কিত তথ্য' : 'About Platform & Policies',
          desc: isBn ? 'ভার্সন, টার্মস অব সার্ভিস এবং নিরাপত্তা নীতিমালা' : 'App build version, terms, privacy & license',
          icon: Info,
          accentColor: 'text-amber-500 bg-amber-500/10 dark:bg-amber-500/20',
        },
      ],
    },
    {
      id: 'account',
      title: isBn ? 'ব্যবহারকারী অ্যাকাউন্ট' : 'User Account & Security',
      description: isBn ? 'প্রোফাইল তথ্য, ঠিকানা, পেমেন্ট কার্ড এবং নোটিফিকেশন' : 'Personal information, security, addresses & payments',
      items: [
        {
          id: 'account_profile',
          label: isBn ? 'ব্যক্তিগত তথ্য ও প্রোফাইল' : 'Personal Profile',
          desc: isBn ? 'নাম, ইউজারনেম, ইমেল, মোবাইল নম্বর ও বায়ো' : 'Name, handle, email, phone & avatar',
          icon: UserIcon,
          accentColor: 'text-sky-500 bg-sky-500/10 dark:bg-sky-500/20',
        },
        {
          id: 'account_security',
          label: isBn ? 'পাসওয়ার্ড ও ২-ফ্যাক্টর নিরাপত্তা' : 'Login & Security',
          desc: isBn ? 'পাসওয়ার্ড পরিবর্তন, ২FA এবং সক্রিয় লগইন সেশন' : 'Password updates, 2FA & active device sessions',
          icon: ShieldCheck,
          accentColor: 'text-indigo-500 bg-indigo-500/10 dark:bg-indigo-500/20',
        },
        {
          id: 'account_addresses',
          label: isBn ? 'সংরক্ষিত ডেলিভারি ঠিকানা' : 'Saved Addresses',
          desc: isBn ? 'হোম ও অফিস ঠিকানা, ডেলিভারি রোডম্যাপ ও নোট' : 'Home, office, and default delivery destinations',
          icon: Home,
          accentColor: 'text-rose-500 bg-rose-500/10 dark:bg-rose-500/20',
        },
        {
          id: 'account_payments',
          label: isBn ? 'পেমেন্ট মাধ্যম ও ওয়ালেট' : 'Payment Methods',
          desc: isBn ? 'ভিসা/মাস্টারকার্ড এবং বিকাশ/নগদ ওয়ালেট' : 'Credit/debit cards and mobile banking wallets',
          icon: CreditCard,
          accentColor: 'text-teal-500 bg-teal-500/10 dark:bg-teal-500/20',
        },
        {
          id: 'account_notifications',
          label: isBn ? 'নোটিফিকেশন ও অ্যালার্ট' : 'Notification Preferences',
          desc: isBn ? 'অর্ডার ট্র্যাকিং এসএমএস, রাইডার আপডেট ও প্রোমো' : 'Order tracking SMS, email alerts & deals',
          icon: Bell,
          accentColor: 'text-amber-500 bg-amber-500/10 dark:bg-amber-500/20',
        },
      ],
    },
    {
      id: 'vendor',
      title: isBn ? 'মার্চেন্ট ও বিক্রেতা হাব' : 'Vendor & Merchant Business',
      description: isBn ? 'দোকানের ব্র্যান্ডিং, ট্রেড লাইসেন্স, পেআউট এবং কুরিয়ার' : 'Storefront profile, business KYC, payouts & delivery',
      items: [
        {
          id: 'vendor_store',
          label: isBn ? 'দোকানের ব্র্যান্ডিং ও পরিচিতি' : 'Storefront & Branding',
          desc: isBn ? 'দোকানের লোগো, ব্যানার, স্লোগান ও কাস্টমার হেল্পলাইন' : 'Store trade name, banner, logo & public helpline',
          icon: Store,
          accentColor: 'text-purple-500 bg-purple-500/10 dark:bg-purple-500/20',
        },
        {
          id: 'vendor_kyc',
          label: isBn ? 'ট্রেড লাইসেন্স ও ট্যাক্স (KYC)' : 'Business KYC & Tax',
          desc: isBn ? 'ট্রেড লাইসেন্স নম্বর, ই-টিন ও ভ্যাট বিআইএন রেজিস্ট্রেশন' : 'Trade license, e-TIN, BIN VAT certificate verification',
          icon: FileCheck2,
          badge: isBn ? 'ভেরিফাইড' : 'VERIFIED',
          accentColor: 'text-emerald-500 bg-emerald-500/10 dark:bg-emerald-500/20',
        },
        {
          id: 'vendor_payout',
          label: isBn ? 'পেআউট ও ব্যাংক অ্যাকাউন্ট' : 'Payout & Settlements',
          desc: isBn ? 'ব্যাংক ট্রান্সফার, বিকাশ মার্চেন্ট ও উইথড্র শিডিউল' : 'Bank settlement, MFS merchant wallet & auto-payout',
          icon: Landmark,
          accentColor: 'text-green-500 bg-green-500/10 dark:bg-green-500/20',
        },
        {
          id: 'vendor_fulfillment',
          label: isBn ? 'ডেলিভারি চার্জ ও কুরিয়ার' : 'Delivery & Fulfillment',
          desc: isBn ? 'শিপিং রেট, ফ্রি ডেলিভারি অফার ও কুরিয়ার পার্টনার' : 'Shipping charges, courier APIs & delivery radius',
          icon: Truck,
          accentColor: 'text-cyan-500 bg-cyan-500/10 dark:bg-cyan-500/20',
        },
        {
          id: 'vendor_hours',
          label: isBn ? 'কর্মঘণ্টা ও ছুটি মোড' : 'Store Hours & Vacation',
          desc: isBn ? 'সাপ্তাহিক খোলার সময় ও জরুরি ভ্যাকেশন পজ নোটিশ' : 'Daily timetable, off-days & emergency store pause',
          icon: Clock,
          accentColor: 'text-orange-500 bg-orange-500/10 dark:bg-orange-500/20',
        },
      ],
    },
  ];

  // Flat list for searching
  const allItems = navGroups.flatMap(g => g.items.map(item => ({ ...item, group: g.title })));
  const filteredItems = searchQuery.trim()
    ? allItems.filter(item => 
        item.label.toLowerCase().includes(searchQuery.toLowerCase()) ||
        item.desc.toLowerCase().includes(searchQuery.toLowerCase()) ||
        item.group.toLowerCase().includes(searchQuery.toLowerCase())
      )
    : null;

  const handleSelectSection = (id: SettingsSectionId) => {
    setActiveSection(id);
    setMobileDetailView(true);
  };

  const currentItem = allItems.find(i => i.id === activeSection) || navGroups[0].items[0];

  return (
    <div className="min-h-[calc(100vh-4rem)] bg-[var(--pm-bg)] text-[var(--pm-text)] pb-16">
      {/* Top Banner Header */}
      <div className="bg-[var(--pm-surface)] border-b border-[var(--pm-border)] sticky top-14 sm:top-16 z-20 backdrop-blur-md">
        <div className="max-w-7xl mx-auto px-3 sm:px-6 lg:px-8 py-2.5 sm:py-3.5 flex items-center justify-between gap-3 sm:gap-4">
          <div className="flex items-center gap-3">
            {onClose ? (
              <button
                type="button"
                onClick={onClose}
                className="p-2 -ml-2 rounded-xl text-[var(--pm-muted)] hover:text-[var(--pm-text)] hover:bg-[var(--pm-card-hover)] transition-colors cursor-pointer"
                title={isBn ? 'ফিরে যান' : 'Go back'}
              >
                <ArrowLeft className="w-5 h-5" />
              </button>
            ) : onSelectTab ? (
              <button
                type="button"
                onClick={() => onSelectTab('feed')}
                className="p-2 -ml-2 rounded-xl text-[var(--pm-muted)] hover:text-[var(--pm-text)] hover:bg-[var(--pm-card-hover)] transition-colors cursor-pointer"
                title={isBn ? 'হোমে ফিরে যান' : 'Back to Home'}
              >
                <ArrowLeft className="w-5 h-5" />
              </button>
            ) : null}

            <div>
              <div className="flex items-center gap-2">
                <span className="text-xs font-black uppercase tracking-wider text-[var(--pm-accent)] bg-[var(--pm-accent-soft)] px-2 py-0.5 rounded-full border border-[var(--pm-accent-border)]">
                  {isBn ? 'মডেল ১ • ইউনিফাইড সেটিংস' : 'Model 1 • Unified Portal'}
                </span>
                <span className="text-xs text-[var(--pm-muted)] font-medium hidden sm:inline">•</span>
                <span className="text-xs text-[var(--pm-muted)] hidden sm:inline">
                  {isBn ? 'সেন্ট্রালাইজড কনফিগারেশন' : 'Centralized Settings Hub'}
                </span>
              </div>
              <h1 className="text-lg sm:text-xl font-black text-[var(--pm-text)] tracking-tight flex items-center gap-2">
                {isBn ? 'সেটিংস ও প্রেফারেন্স পোর্টাল' : 'Settings & Preferences Portal'}
              </h1>
            </div>
          </div>

          <div className="flex items-center gap-2">
            {/* Quick Switch to User Profile or Vendor Dash */}
            {onSelectTab && (
              <div className="hidden sm:flex items-center gap-2">
                <button
                  type="button"
                  onClick={() => onSelectTab('profile')}
                  className="px-3 py-1.5 rounded-xl border border-[var(--pm-border)] bg-[var(--pm-card)] hover:bg-[var(--pm-card-hover)] text-xs font-bold text-[var(--pm-text)] transition-colors cursor-pointer flex items-center gap-1.5"
                >
                  <UserIcon className="w-3.5 h-3.5" />
                  <span>{isBn ? 'প্রোফাইল' : 'Profile'}</span>
                </button>
                <button
                  type="button"
                  onClick={() => onSelectTab('vendor-dash')}
                  className="px-3 py-1.5 rounded-xl bg-[var(--pm-accent)] hover:bg-[var(--pm-accent-hover)] text-[var(--pm-accent-fg)] text-xs font-bold transition-colors cursor-pointer flex items-center gap-1.5 shadow-xs"
                >
                  <Store className="w-3.5 h-3.5" />
                  <span>{isBn ? 'মার্চেন্ট ড্যাশবোর্ড' : 'Vendor Hub'}</span>
                </button>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Main Container */}
      <div className="max-w-7xl mx-auto px-3 sm:px-6 lg:px-8 pt-4 sm:pt-6">
        <div className="grid grid-cols-1 md:grid-cols-12 gap-4 sm:gap-6 items-start">
          
          {/* =======================
              LEFT SIDEBAR NAVIGATION
              (Desktop always, Mobile hidden if detailView)
             ======================= */}
          <aside className={`md:col-span-4 lg:col-span-4 space-y-4 ${mobileDetailView ? 'hidden md:block' : 'block'}`}>
            {/* User Quick Info Tile */}
            {currentUser && (
              <div className="p-3 sm:p-4 rounded-2xl sm:rounded-3xl bg-[var(--pm-card)] border border-[var(--pm-border)] shadow-xs flex items-center gap-3.5">
                <img
                  src={currentUser.avatar}
                  alt={currentUser.name}
                  className="w-12 h-12 rounded-2xl object-cover ring-2 ring-[var(--pm-accent-border)]"
                />
                <div className="flex-1 min-w-0">
                  <h4 className="text-sm font-black text-[var(--pm-text)] truncate">
                    {currentUser.name}
                  </h4>
                  <p className="text-xs text-[var(--pm-muted)] font-mono truncate">
                    @{currentUser.handle}
                  </p>
                  <div className="flex items-center gap-2 mt-1">
                    <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-[var(--pm-accent-soft)] text-[var(--pm-accent)] capitalize">
                      {currentUser.role}
                    </span>
                    {currentUser.isVendor && (
                      <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-[var(--pm-success-soft)] text-[var(--pm-success)]">
                        {isBn ? 'মার্চেন্ট' : 'Vendor'}
                      </span>
                    )}
                  </div>
                </div>
              </div>
            )}

            {/* In-Settings Fast Search Filter */}
            <div className="relative">
              <Search className="w-4 h-4 text-[var(--pm-muted)] absolute left-3.5 top-3" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder={isBn ? 'সেটিংস খুঁজুন (যেমন: পাসওয়ার্ড, বিকাশ, থিম)...' : 'Filter settings (e.g. password, bank, theme)...'}
                className="w-full pl-9 pr-9 py-2.5 rounded-2xl border border-[var(--pm-border)] bg-[var(--pm-input)] text-xs text-[var(--pm-text)] focus:border-[var(--pm-accent)] focus:outline-hidden shadow-xs placeholder:text-[var(--pm-muted)]"
              />
              {searchQuery && (
                <button
                  type="button"
                  onClick={() => setSearchQuery('')}
                  className="absolute right-3 top-2.5 text-[var(--pm-muted)] hover:text-[var(--pm-text)]"
                >
                  <X className="w-4 h-4" />
                </button>
              )}
            </div>

            {/* Filtered Search Results or Categorized Groups */}
            {filteredItems ? (
              <div className="p-2.5 sm:p-3 rounded-2xl sm:rounded-3xl bg-[var(--pm-card)] border border-[var(--pm-border)] shadow-xs space-y-1">
                <p className="text-[10px] font-black uppercase tracking-wider text-[var(--pm-muted)] px-3 py-1">
                  {isBn ? `খোঁজের ফলাফল (${filteredItems.length})` : `Matching Sections (${filteredItems.length})`}
                </p>
                {filteredItems.length === 0 ? (
                  <p className="text-xs text-[var(--pm-muted)] p-4 text-center">
                    {isBn ? 'কোনো সেটিংস পাওয়া যায়নি' : 'No settings matching your search'}
                  </p>
                ) : (
                  filteredItems.map(item => {
                    const Icon = item.icon;
                    const isActive = activeSection === item.id;
                    return (
                      <button
                        key={item.id}
                        type="button"
                        onClick={() => handleSelectSection(item.id)}
                        className={`w-full p-2.5 rounded-2xl text-left flex items-center justify-between gap-3 transition-all cursor-pointer ${
                          isActive
                            ? 'bg-[var(--pm-accent)] text-[var(--pm-accent-fg)] shadow-md'
                            : 'hover:bg-[var(--pm-card-hover)] text-[var(--pm-text)]'
                        }`}
                      >
                        <div className="flex items-center gap-3 min-w-0">
                          <div className={`p-2 rounded-xl shrink-0 ${isActive ? 'bg-black/15 text-[var(--pm-accent-fg)]' : item.accentColor}`}>
                            <Icon className="w-4 h-4" />
                          </div>
                          <div className="min-w-0">
                            <p className="text-xs font-bold truncate">{item.label}</p>
                            <p className={`text-[10px] truncate ${isActive ? 'opacity-80' : 'text-[var(--pm-muted)]'}`}>
                              {item.group}
                            </p>
                          </div>
                        </div>
                        <ChevronRight className={`w-4 h-4 shrink-0 ${isActive ? 'text-[var(--pm-accent-fg)]' : 'text-[var(--pm-muted)]'}`} />
                      </button>
                    );
                  })
                )}
              </div>
            ) : (
              /* Grouped List */
              <div className="space-y-4">
                {navGroups.map(group => (
                  <div
                    key={group.id}
                    className="p-3 sm:p-4 rounded-3xl bg-[var(--pm-card)] border border-[var(--pm-border)] shadow-xs space-y-1"
                  >
                    <div className="px-3 py-1 mb-1">
                      <h3 className="text-xs font-black uppercase tracking-wider text-[var(--pm-text)]">
                        {group.title}
                      </h3>
                      <p className="text-[10px] text-[var(--pm-muted)] truncate">
                        {group.description}
                      </p>
                    </div>

                    <div className="space-y-1">
                      {group.items.map(item => {
                        const Icon = item.icon;
                        const isActive = activeSection === item.id;
                        return (
                          <button
                            key={item.id}
                            type="button"
                            onClick={() => handleSelectSection(item.id)}
                            className={`w-full p-2.5 sm:p-3 rounded-2xl text-left flex items-center justify-between gap-3 transition-all cursor-pointer ${
                              isActive
                                ? 'bg-[var(--pm-accent)] text-[var(--pm-accent-fg)] shadow-md'
                                : 'hover:bg-[var(--pm-card-hover)] text-[var(--pm-text)]'
                            }`}
                          >
                            <div className="flex items-center gap-3 min-w-0">
                              <div className={`p-2 rounded-xl shrink-0 ${isActive ? 'bg-black/15 text-[var(--pm-accent-fg)]' : item.accentColor}`}>
                                <Icon className="w-4 h-4" />
                              </div>
                              <div className="min-w-0">
                                <div className="flex items-center gap-2">
                                  <span className="text-xs font-bold truncate">{item.label}</span>
                                  {item.badge && (
                                    <span className={`text-[9px] font-black px-1.5 py-0.2 rounded-full uppercase ${
                                      isActive 
                                        ? 'bg-black/20 text-[var(--pm-accent-fg)]' 
                                        : 'bg-[var(--pm-success-soft)] text-[var(--pm-success)]'
                                    }`}>
                                      {item.badge}
                                    </span>
                                  )}
                                </div>
                                <p className={`text-[10px] truncate ${isActive ? 'opacity-80' : 'text-[var(--pm-muted)]'}`}>
                                  {item.desc}
                                </p>
                              </div>
                            </div>
                            <ChevronRight className={`w-4 h-4 shrink-0 transition-transform ${isActive ? 'text-[var(--pm-accent-fg)] translate-x-0.5' : 'text-[var(--pm-muted)]'}`} />
                          </button>
                        );
                      })}
                    </div>
                  </div>
                ))}
              </div>
            )}
          </aside>

          {/* =======================
              RIGHT DETAIL CONTENT PANEL
              (Desktop always, Mobile hidden if !detailView)
             ======================= */}
          <main className={`md:col-span-8 lg:col-span-8 ${mobileDetailView ? 'block' : 'hidden md:block'}`}>
            {/* Mobile Drill-Down Back Header */}
            <div className="md:hidden mb-4 flex items-center justify-between p-3 rounded-2xl bg-[var(--pm-card)] border border-[var(--pm-border)] shadow-xs">
              <button
                type="button"
                onClick={() => setMobileDetailView(false)}
                className="flex items-center gap-2 text-xs font-black text-[var(--pm-accent)] cursor-pointer"
              >
                <ChevronLeft className="w-4 h-4" />
                <span>{isBn ? 'সেটিংস মেন্যুতে ফিরে যান' : 'Back to Settings Menu'}</span>
              </button>

              <span className="text-xs font-bold text-[var(--pm-muted)]">
                {currentItem.label}
              </span>
            </div>

            {/* Desktop Breadcrumbs Bar */}
            <div className="hidden md:flex items-center justify-between pb-4 mb-4 border-b border-[var(--pm-border)]">
              <div className="flex items-center gap-2 text-xs text-[var(--pm-muted)]">
                <span>{isBn ? 'সেটিংস' : 'Settings'}</span>
                <ChevronRight className="w-3.5 h-3.5 text-[var(--pm-muted)]" />
                <span className="font-bold text-[var(--pm-text)]">{currentItem.label}</span>
              </div>

              <div className="flex items-center gap-2">
                <span className="text-[11px] text-[var(--pm-muted)]">
                  {isBn ? 'অটো-সিঙ্ক সক্রিয়' : 'Instant Cloud Sync'}
                </span>
                <div className="w-2 h-2 rounded-full bg-[var(--pm-success)] animate-pulse" />
              </div>
            </div>

            {/* Dynamic Content View based on activeSection */}
            <div className="transition-all">
              {/* COMMON: Theme & Appearance */}
              {activeSection === 'appearance' && (
                <div className="space-y-6 animate-fadeIn">
                  <div>
                    <h3 className="text-lg font-black text-[var(--pm-text)]">
                      {isBn ? 'ডিসপ্লে থিম ও ভিজ্যুয়াল স্টাইল' : 'Appearance & Visual Theme'}
                    </h3>
                    <p className="text-xs text-[var(--pm-muted)]">
                      {isBn ? 'আপনার পছন্দের থিম নির্বাচন করুন — এক ক্লিকেই পুরো অ্যাপ ও সাইডবার বদলে যাবে' : 'Select any studio theme token to transform the entire app, header, and sidebar'}
                    </p>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                    {[
                      { id: 'light' as ThemeMode, label: isBn ? 'ক্লিন লাইট (Light)' : 'Clean Light', desc: isBn ? 'উজ্জ্বল ও পরিষ্কার দিনকালীন ভিউ' : 'Crisp and bright daylight appearance', icon: Sun, swatchBg: '#f1f5f9', swatchAccent: '#2563eb' },
                      { id: 'nakshiLight' as ThemeMode, label: isBn ? 'নকশী লাইট (Nakshi)' : 'Nakshi Light', desc: isBn ? 'বাংলার উষ্ণ সোনালি ঐতিহ্যবাহী আবহ' : 'Warm saffron cream heritage canvas', icon: Sparkles, swatchBg: '#fffbeb', swatchAccent: '#b45309' },
                      { id: 'greenField' as ThemeMode, label: isBn ? 'সবুজ প্রান্তর (Green Field)' : 'Green Field', desc: isBn ? 'সবুজ বাংলার গভীর পান্না হাই-কনট্রাস্ট' : 'Deep emerald soil & mint contrast', icon: Sparkles, swatchBg: '#021a12', swatchAccent: '#10b981' },
                      { id: 'deepDark' as ThemeMode, label: isBn ? 'ডিপ ডার্ক (Deep Dark)' : 'Deep Dark', desc: isBn ? 'গভীর ওলেড কালো ও অ্যাম্বার অ্যাকসেন্ট' : 'Obsidian OLED with vibrant orange', icon: Moon, swatchBg: '#07080b', swatchAccent: '#ff7a00' },
                      { id: 'dark' as ThemeMode, label: isBn ? 'ডার্ক মোড (Dark)' : 'Midnight Slate', desc: isBn ? 'চোখের আরামদায়ক ক্লাসিক নাইট ভিউ' : 'Comfortable for low-light environments', icon: Moon, swatchBg: '#020617', swatchAccent: '#3b82f6' },
                      { id: 'system' as ThemeMode, label: isBn ? 'সিস্টেম অটো (System)' : 'System Default', desc: isBn ? 'ডিভাইসের ওএস সেটিং অনুসরণ করবে' : 'Automatically syncs with OS theme', icon: Laptop, swatchBg: '#334155', swatchAccent: '#0ea5e9' },
                    ].map((mode) => {
                      const Icon = mode.icon;
                      const isSelected = themeMode === mode.id;
                      return (
                        <button
                          key={mode.id}
                          type="button"
                          onClick={() => setThemeMode(mode.id)}
                          className={`p-4 rounded-3xl border text-left transition-all cursor-pointer relative ${
                            isSelected
                              ? 'border-[var(--pm-accent)] bg-[var(--pm-accent-soft)] ring-2 ring-[var(--pm-accent-border)] shadow-md'
                              : 'border-[var(--pm-border)] bg-[var(--pm-card)] hover:bg-[var(--pm-card-hover)] text-[var(--pm-text)]'
                          }`}
                        >
                          <div className="flex items-center justify-between mb-3">
                            <div
                              className="p-2.5 rounded-2xl w-fit border border-black/10 shadow-xs"
                              style={{ backgroundColor: mode.swatchBg, color: mode.swatchAccent }}
                            >
                              <Icon className="w-5 h-5" />
                            </div>
                            <span
                              className="w-4 h-4 rounded-full border border-white/50 shadow-xs"
                              style={{ backgroundColor: mode.swatchAccent }}
                            />
                          </div>
                          <p className="text-sm font-black text-[var(--pm-text)]">{mode.label}</p>
                          <p className="text-xs text-[var(--pm-muted)] mt-1">{mode.desc}</p>
                          {isSelected && (
                            <div
                              className="absolute top-3 right-3 p-1 rounded-full text-white"
                              style={{ backgroundColor: mode.swatchAccent }}
                            >
                              <Check className="w-3.5 h-3.5" />
                            </div>
                          )}
                        </button>
                      );
                    })}
                  </div>

                  <div className="p-5 rounded-3xl bg-[var(--pm-card)] border border-[var(--pm-border)] shadow-xs space-y-3">
                    <h4 className="text-xs font-black uppercase tracking-wider text-[var(--pm-text)]">
                      {isBn ? 'ভিজ্যুয়াল অ্যাকসেন্ট ও কালার প্যালেট' : 'Accent Color Palette'}
                    </h4>
                    <p className="text-xs text-[var(--pm-muted)]">
                      {isBn ? 'বাটন, হাইলাইট এবং সক্রিয় ট্যাবের প্রধান ব্র্যান্ড কালার' : 'Primary color applied to buttons, badges and focus rings'}
                    </p>
                    <div className="flex items-center gap-3 pt-1">
                      {['#2563eb', '#ff7a00', '#10b981', '#b45309', '#e11d48'].map((col) => (
                        <button
                          key={col}
                          type="button"
                          onClick={() => setAccentColor(col)}
                          aria-label={`Select accent ${col}`}
                          style={{ backgroundColor: col }}
                          className={`w-8 h-8 rounded-full cursor-pointer transition-all ${
                            accentColor.toLowerCase() === col.toLowerCase()
                              ? 'ring-2 ring-offset-2 ring-[var(--pm-accent)] scale-110'
                              : 'opacity-80 hover:opacity-100'
                          }`}
                        />
                      ))}
                    </div>
                  </div>
                </div>
              )}

              {/* COMMON: Language & Region */}
              {activeSection === 'language' && (
                <div className="space-y-6 animate-fadeIn">
                  <div>
                    <h3 className="text-lg font-black text-[var(--pm-text)]">
                      {isBn ? 'ভাষা ও আঞ্চলিক সেটিংস' : 'Language & Regional Localization'}
                    </h3>
                    <p className="text-xs text-[var(--pm-muted)]">
                      {isBn ? 'আপনার পছন্দের ইন্টারফেস ভাষা নির্বাচন করুন' : 'Select your preferred language and regional formatting'}
                    </p>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <button
                      type="button"
                      onClick={() => setLanguage('bn')}
                      className={`p-5 rounded-3xl border text-left transition-all cursor-pointer relative ${
                        language === 'bn'
                          ? 'border-[var(--pm-accent)] bg-[var(--pm-accent-soft)] text-[var(--pm-text)] ring-2 ring-[var(--pm-accent-border)] shadow-md'
                          : 'border-[var(--pm-border)] bg-[var(--pm-card)] hover:bg-[var(--pm-card-hover)] text-[var(--pm-text)]'
                      }`}
                    >
                      <div className="flex items-center justify-between mb-2">
                        <span className="text-2xl font-black">বাংলা</span>
                        <span className="text-xs font-bold px-2 py-0.5 rounded-full bg-[var(--pm-success-soft)] text-[var(--pm-success)]">
                          Bangladesh
                        </span>
                      </div>
                      <p className="text-xs text-[var(--pm-muted)]">
                        সম্পূর্ণ ইন্টারফেস, পণ্য ক্যাটাগরি, তারিখ ও টাকা (৳) ফরম্যাট বাংলায় প্রদর্শিত হবে।
                      </p>
                      {language === 'bn' && (
                        <div className="mt-4 flex items-center gap-1.5 text-xs font-black text-[var(--pm-accent)]">
                          <Check className="w-4 h-4" />
                          <span>বর্তমান নির্বাচিত ভাষা</span>
                        </div>
                      )}
                    </button>

                    <button
                      type="button"
                      onClick={() => setLanguage('en')}
                      className={`p-5 rounded-3xl border text-left transition-all cursor-pointer relative ${
                        language === 'en'
                          ? 'border-[var(--pm-accent)] bg-[var(--pm-accent-soft)] text-[var(--pm-text)] ring-2 ring-[var(--pm-accent-border)] shadow-md'
                          : 'border-[var(--pm-border)] bg-[var(--pm-card)] hover:bg-[var(--pm-card-hover)] text-[var(--pm-text)]'
                      }`}
                    >
                      <div className="flex items-center justify-between mb-2">
                        <span className="text-2xl font-black">English</span>
                        <span className="text-xs font-bold px-2 py-0.5 rounded-full bg-[var(--pm-accent-soft)] text-[var(--pm-accent)]">
                          Global
                        </span>
                      </div>
                      <p className="text-xs text-[var(--pm-muted)]">
                        Universal English interface with international number formatting and currency previews.
                      </p>
                      {language === 'en' && (
                        <div className="mt-4 flex items-center gap-1.5 text-xs font-black text-[var(--pm-accent)]">
                          <Check className="w-4 h-4" />
                          <span>Active Language</span>
                        </div>
                      )}
                    </button>
                  </div>
                </div>
              )}

              {/* COMMON: Live GPS Radar & Preferences */}
              {activeSection === 'location' && (
                <div className="space-y-6 animate-fadeIn">
                  <div>
                    <h3 className="text-lg font-black text-[var(--pm-text)]">
                      {isBn ? 'লাইভ জিপিএস রাডার ও ডেলিভারি হাব' : 'Live GPS Radar & Delivery Region'}
                    </h3>
                    <p className="text-xs text-[var(--pm-muted)]">
                      {isBn ? 'রিয়েলটাইম ডিভাইস কোঅর্ডিনেট, নিকটস্থ বিক্রেতা ও সার্ভিস এরিয়া' : 'Continuous location radar for distance calculations and instant delivery routing'}
                    </p>
                  </div>

                  <LocationPreferences />
                </div>
              )}

              {/* COMMON: About App & Policies */}
              {activeSection === 'about' && (
                <div className="space-y-6 animate-fadeIn">
                  <div>
                    <h3 className="text-lg font-black text-[var(--pm-text)]">
                      {isBn ? 'অ্যাপ্লিকেশন সম্পর্কিত তথ্য' : 'About Platform & Policies'}
                    </h3>
                    <p className="text-xs text-[var(--pm-muted)]">
                      {isBn ? 'সংস্করণ, সিস্টেম আর্কিটেকচার এবং লাইসেন্স বিবরণ' : 'Build version, privacy standards, and architectural overview'}
                    </p>
                  </div>

                  <div className="p-6 rounded-3xl bg-[var(--pm-card)] border border-[var(--pm-border)] shadow-xs space-y-4">
                    <div className="flex items-center gap-3">
                      <div className="w-12 h-12 rounded-2xl bg-[var(--pm-accent)] flex items-center justify-center text-[var(--pm-accent-fg)] font-black text-xl shadow-md">
                        S
                      </div>
                      <div>
                        <h4 className="text-base font-black text-[var(--pm-text)]">
                          SuperApp Bangladesh Ecosystem
                        </h4>
                        <p className="text-xs text-[var(--pm-muted)]">v2.4.0 (Unified Enterprise Build 2026)</p>
                      </div>
                    </div>

                    <p className="text-xs text-[var(--pm-muted)] leading-relaxed">
                      {isBn
                        ? 'সুপারঅ্যাপ প্ল্যাটফর্মটিতে সোশ্যাল ফিড, ই-কমার্স ট্রেডিং হাব, লোকাল সার্ভিস ও রাইড বুকিং এবং মার্চেন্ট ড্যাশবোর্ড একসাথে একীভূত করা হয়েছে।'
                        : 'A multi-vertical omnichannel application bridging social commerce, on-demand physical services, live GPS delivery radar, and full-featured merchant enterprise tooling.'}
                    </p>

                    <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 pt-3 border-t border-[var(--pm-border)] text-xs">
                      <div className="p-3 rounded-2xl bg-[var(--pm-surface)] border border-[var(--pm-border)]">
                        <span className="text-[10px] text-[var(--pm-muted)] block font-mono">FRAMEWORK</span>
                        <span className="font-bold text-[var(--pm-text)]">React 18 + Vite</span>
                      </div>
                      <div className="p-3 rounded-2xl bg-[var(--pm-surface)] border border-[var(--pm-border)]">
                        <span className="text-[10px] text-[var(--pm-muted)] block font-mono">STYLING</span>
                        <span className="font-bold text-[var(--pm-text)]">Tailwind CSS 4.0</span>
                      </div>
                      <div className="p-3 rounded-2xl bg-[var(--pm-surface)] border border-[var(--pm-border)]">
                        <span className="text-[10px] text-[var(--pm-muted)] block font-mono">DATABASE</span>
                        <span className="font-bold text-[var(--pm-text)]">Cloud Synced</span>
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {/* USER ACCOUNT PAGES */}
              {activeSection === 'account_profile' && (
                <PersonalProfilePage
                  currentUser={currentUser}
                  onUpdateUser={onUpdateUser}
                />
              )}

              {activeSection === 'account_security' && (
                <SecuritySettingsPage />
              )}

              {activeSection === 'account_addresses' && (
                <SavedAddressesPage />
              )}

              {activeSection === 'account_payments' && (
                <PaymentMethodsPage />
              )}

              {activeSection === 'account_notifications' && (
                <NotificationPreferencesPage />
              )}

              {/* VENDOR MERCHANT PAGES */}
              {activeSection === 'vendor_store' && (
                <StorefrontSettingsPage />
              )}

              {activeSection === 'vendor_kyc' && (
                <BusinessKYCSettingsPage />
              )}

              {activeSection === 'vendor_payout' && (
                <PayoutSettingsPage />
              )}

              {activeSection === 'vendor_fulfillment' && (
                <FulfillmentSettingsPage />
              )}

              {activeSection === 'vendor_hours' && (
                <StoreHoursSettingsPage />
              )}
            </div>
          </main>
        </div>
      </div>
    </div>
  );
};
