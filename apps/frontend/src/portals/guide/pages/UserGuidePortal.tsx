import React, { useMemo, useState } from 'react';
import {
  ArrowRight,
  BookOpen,
  Bot,
  Car,
  CheckCircle2,
  Compass,
  HelpCircle,
  MapPin,
  MessageSquare,
  Package,
  Search,
  ShieldCheck,
  ShoppingBag,
  Store,
  Truck,
  UserCheck,
  Wallet,
  Wrench,
} from 'lucide-react';
import { PortalTab } from '@/types';
import { useLanguage } from '@/contexts/LanguageContext';

interface UserGuidePortalProps {
  onSelectTab: (tab: PortalTab) => void;
  onOpenVendorModal?: () => void;
  isVendor?: boolean;
}

interface GuideCardItem {
  id: string;
  audience: 'buyer' | 'vendor' | 'both';
  titleEn: string;
  titleBn: string;
  summaryEn: string;
  summaryBn: string;
  stepsEn: string[];
  stepsBn: string[];
  actionLabelEn: string;
  actionLabelBn: string;
  targetTab?: PortalTab;
  isVendorOnboarding?: boolean;
  icon: React.ComponentType<{ className?: string }>;
  accent: string;
}

const GUIDE_ITEMS: GuideCardItem[] = [
  {
    id: 'feed-discovery',
    audience: 'buyer',
    titleEn: 'Social Feed & Open Demand Board',
    titleBn: 'সোশ্যাল ফিড ও ওপেন ডিমান্ড বোর্ড',
    summaryEn: 'Discover trending products, follow local shops, or post a buyer demand request so suppliers bid to you.',
    summaryBn: 'জনপ্রিয় পণ্য দেখুন, স্থানীয় দোকান ফলো করুন অথবা আপনার প্রয়োজনীয় পণ্যের ডিমান্ড পোস্ট করুন যাতে ভেন্ডররা কোটেশন দেয়।',
    stepsEn: [
      'Open News Feed (Home) to view live stories, reels, and verified merchant updates.',
      'Use the Post Composer to share a review or create a Buyer Demand request.',
      'Tap any tagged product card to add directly to cart or open product details.',
    ],
    stepsBn: [
      'স্টোরি, রিলস ও ভেরিফায়েড ভেন্ডরদের আপডেট দেখতে News Feed (Home)-এ যান।',
      'পোস্ট কম্পোজার দিয়ে রিভিউ বা ক্রেতা ডিমান্ড পোস্ট তৈরি করুন।',
      'ট্যাগ করা প্রোডাক্ট কার্ডে ক্লিক করে সরাসরি কার্টে যোগ করুন বা বিস্তারিত দেখুন।',
    ],
    actionLabelEn: 'Open Social Feed',
    actionLabelBn: 'সোশ্যাল ফিডে যান',
    targetTab: 'feed',
    icon: Compass,
    accent: 'text-blue-600 dark:text-blue-400 bg-blue-500/10',
  },
  {
    id: 'retail-wholesale',
    audience: 'buyer',
    titleEn: 'Retail Shopping & B2B Wholesale (RFQ)',
    titleBn: 'রিটেইল শপিং ও B2B পাইকারি (RFQ)',
    summaryEn: 'Shop single items in Retail Marketplace or source factory-direct bulk slabs and custom quotes in Wholesale Hub.',
    summaryBn: 'Retail Marketplace থেকে একক পণ্য কিনুন অথবা Wholesale Hub-এ MOQ বাল্ক স্ল্যাব ও কাস্টম RFQ কোটেশন নিন।',
    stepsEn: [
      'In Retail, filter by category or nearby sellers and tap Add to Cart.',
      'In Wholesale Hub, inspect MOQ volume tiers (e.g. 50+, 100+ units) for automated bulk discounts.',
      'Click Request Quote (RFQ) to negotiate custom factory orders with your target BDT (৳) budget.',
    ],
    stepsBn: [
      'Retail-এ ক্যাটাগরি বা নিকটস্থ দোকান অনুযায়ী খুঁজে Add to Cart করুন।',
      'Wholesale Hub-এ MOQ ভলিউম স্ল্যাব দেখে বড় অর্ডারে স্বয়ংক্রিয় পাইকারি ছাড় পান।',
      'নিজস্ব বাজেট (৳) অনুযায়ী ফ্যাক্টরি রেট পেতে Request Quote (RFQ) ব্যবহার করুন।',
    ],
    actionLabelEn: 'Open Wholesale Hub',
    actionLabelBn: 'হোলসেল হাবে যান',
    targetTab: 'wholesale',
    icon: ShoppingBag,
    accent: 'text-emerald-600 dark:text-emerald-400 bg-emerald-500/10',
  },
  {
    id: 'logistics-transit',
    audience: 'both',
    titleEn: 'Rides, Parcel Courier & Cargo Freight',
    titleBn: 'রাইড শেয়ার, পার্সেল কুরিয়ার ও কার্গো ট্রাক',
    summaryEn: 'Book instant bikes/cars, send doorstep courier parcels with tracking waybills, or hire 1–5 ton cargo trucks.',
    summaryBn: 'ইনস্ট্যান্ট বাইক/কার বুক করুন, ওয়েবিলসহ ডোরস্টেপ পার্সেল পাঠান অথবা পাইকারি পণ্যের জন্য পিকআপ/ট্রাক ভাড়া করুন।',
    stepsEn: [
      'Pick Instant Fleet for bike, car, pickup, or cargo requests with live BDT (৳) fare quotes.',
      'Switch to Parcel & Waybill to calculate weight-based courier charges and assign PaikarForce, Steadfast, Pathao, or RedX.',
      'Use your GPS location in the Top Navbar for accurate distance and ETA matching.',
    ],
    stepsBn: [
      'Instant Fleet দিয়ে লাইভ BDT (৳) ভাড়ায় বাইক, কার, পিকআপ বা কার্গো রিকোয়েস্ট পাঠান।',
      'Parcel & Waybill মোডে ওজন অনুযায়ী কুরিয়ার চার্জ ও পার্টনার (PaikarForce/Steadfast/Pathao/RedX) সিলেক্ট করুন।',
      'সঠিক দূরত্ব ও ETA পেতে উপরের বারে GPS লোকেশন সেট করে রাখুন।',
    ],
    actionLabelEn: 'Open Transit Hub',
    actionLabelBn: 'লজিস্টিকস হাবে যান',
    targetTab: 'rides',
    icon: Car,
    accent: 'text-sky-600 dark:text-sky-400 bg-sky-500/10',
  },
  {
    id: 'orders-otp',
    audience: 'both',
    titleEn: 'Orders Hub, Delivery OTP & Reorder',
    titleBn: 'অর্ডার হাব, ডেলিভারি OTP ও রিঅর্ডার',
    summaryEn: 'Track every purchase or store sale live, verify your 4-digit delivery OTP, reorder fast, and release Escrow safely.',
    summaryBn: 'সব ক্রয় ও বিক্রয় অর্ডার লাইভ ট্র্যাক করুন, ৪-ডিজিটের ডেলিভারি OTP যাচাই করুন এবং ১-ক্লিকে Reorder করুন।',
    stepsEn: [
      'Buyers check Purchases tab (or Guest Order Tracker) for live courier checkpoints and their 4-digit Delivery OTP.',
      'Share the Delivery OTP with the rider only upon receiving the parcel, then tap Confirm Delivery.',
      'Vendors open Store Sales to advance orders (Preparing -> In Transit) which syncs courier waybills automatically.',
    ],
    stepsBn: [
      'ক্রেতারা Purchases ট্যাব বা Guest Tracker-এ লাইভ কুরিয়ার চেকপয়েন্ট ও ৪-ডিজিট ডেলিভারি OTP দেখতে পাবেন।',
      'পণ্য হাতে পাওয়ার পর রাইডারকে OTP দিন এবং Confirm Delivery চাপুন।',
      'ভেন্ডররা Store Sales ট্যাব থেকে Preparing বা In Transit করলে অটোমেটিক ওয়েবিল আপডেট হবে।',
    ],
    actionLabelEn: 'Open Orders Hub',
    actionLabelBn: 'অর্ডার হাবে যান',
    targetTab: 'orders',
    icon: Package,
    accent: 'text-indigo-600 dark:text-indigo-400 bg-indigo-500/10',
  },
  {
    id: 'wallet-escrow',
    audience: 'both',
    titleEn: 'BDT Wallet, PK Coins & Escrow Protection',
    titleBn: 'BDT ওয়ালেট, PK কয়েন ও এসক্রো সুরক্ষা',
    summaryEn: 'Top up via bKash, Nagad, or Cards, earn PK Coins on orders, and monitor Escrow holds protecting every trade.',
    summaryBn: 'বিকাশ, নগদ বা কার্ডে টাকা অ্যাড করুন, অর্ডারে PK কয়েন রিওয়ার্ড পান এবং এসক্রো লেনদেন ট্র্যাক করুন।',
    stepsEn: [
      'Tap Wallet in navigation to view your BDT (৳) balance, PK Coin rewards, and transaction history.',
      'Order payments stay protected in Escrow Held status until buyer delivery confirmation.',
      'Once delivered, funds settle cleanly into the vendor wallet ledger.',
    ],
    stepsBn: [
      'নেভিগেশন থেকে Wallet ওপেন করে BDT (৳) ব্যালেন্স, PK কয়েন এবং লেনদেনের ইতিহাস দেখুন।',
      'ডেলিভারি নিশ্চিত হওয়া পর্যন্ত পেমেন্ট Escrow Held অবস্থায় সুরক্ষিত থাকে।',
      'ডেলিভারি সম্পন্ন হলে ভেন্ডরের ওয়ালেটে পেমেন্ট স্বয়ংক্রিয়ভাবে সেটেল হয়।',
    ],
    actionLabelEn: 'Open Wallet & Escrow',
    actionLabelBn: 'ওয়ালেট ও এসক্রো দেখুন',
    targetTab: 'wallet',
    icon: Wallet,
    accent: 'text-emerald-600 dark:text-emerald-400 bg-emerald-500/10',
  },
  {
    id: 'vendor-onboarding',
    audience: 'vendor',
    titleEn: 'Vendor KYC Onboarding & Multi-Role Store',
    titleBn: 'ভেন্ডর KYC রেজিস্ট্রেশন ও মাল্টি-রোল স্টোর',
    summaryEn: 'Register as a verified Retail Merchant, Wholesale Supplier, Service Provider, or Fleet Driver in 4 guided steps.',
    summaryBn: '৪টি সহজ ধাপে রিটেইল দোকান, হোলসেল ফ্যাক্টরি, সার্ভিস প্রোভাইডার বা রাইড/ফ্লিট পার্টনার হিসেবে নিবন্ধন করুন।',
    stepsEn: [
      'Click Become a Verified Seller in the left sidebar or Super App Hub.',
      'Select one or more business roles and enter your Trade License, TIN, or NID/Vehicle details.',
      'Configure your payout method (bKash Merchant, Nagad, Rocket, or Bank) to receive settlements.',
    ],
    stepsBn: [
      'বাম পাশের মেনু বা Super App Hub থেকে Become a Verified Seller সিলেক্ট করুন।',
      'আপনার ব্যবসার ধরন বেছে নিয়ে ট্রেড লাইসেন্স, TIN, NID বা গাড়ির তথ্য দিন।',
      'পে-আউট মাধ্যম (বিকাশ/নগদ মার্চেন্ট বা ব্যাংক) সেট করে স্টোর চালু করুন।',
    ],
    actionLabelEn: 'Start / Open Seller Central',
    actionLabelBn: 'সেলার ড্যাশবোর্ড / নিবন্ধন',
    isVendorOnboarding: true,
    icon: Store,
    accent: 'text-amber-600 dark:text-amber-400 bg-amber-500/10',
  },
  {
    id: 'services-ai',
    audience: 'buyer',
    titleEn: 'Nearby Services & Gemini AI Messaging',
    titleBn: 'নিকটস্থ সার্ভিস ও AI মেসেজিং সহায়তা',
    summaryEn: 'Book verified technicians near you or open Messages to chat live with sellers and the AI shopping assistant.',
    summaryBn: 'কাছাকাছি থাকা ভেরিফায়েড টেকনিশিয়ান বুক করুন অথবা Messages-এ গিয়ে ভেন্ডর ও AI সহকারীর সাথে কথা বলুন।',
    stepsEn: [
      'Open Nearby Services to filter AC repair, electricians, plumbers, salons, or clinics.',
      'Open Messages to negotiate B2B quotes directly with merchants or ask AI for product & order help.',
    ],
    stepsBn: [
      'Nearby Services থেকে এসি মেরামত, ইলেকট্রিশিয়ান, প্লাম্বার বা ক্লিনিক সার্ভিস বুক করুন।',
      'Messages-এ ভেন্ডরের সাথে সরাসরি দরদাম করুন অথবা AI-এর কাছ থেকে প্রোডাক্ট ও অর্ডার সহায়তা নিন।',
    ],
    actionLabelEn: 'Open Nearby Services',
    actionLabelBn: 'নিয়ারবাই সার্ভিসে যান',
    targetTab: 'services',
    icon: Wrench,
    accent: 'text-purple-600 dark:text-purple-400 bg-purple-500/10',
  },
];

export const UserGuidePortal: React.FC<UserGuidePortalProps> = ({
  onSelectTab,
  onOpenVendorModal,
  isVendor,
}) => {
  const { language, toggleLanguage } = useLanguage();
  const isBn = language === 'bn';
  const [audienceFilter, setAudienceFilter] = useState<'all' | 'buyer' | 'vendor'>('all');
  const [query, setQuery] = useState('');

  const filteredItems = useMemo(() => {
    return GUIDE_ITEMS.filter((item) => {
      const matchesAudience =
        audienceFilter === 'all' || item.audience === audienceFilter || item.audience === 'both';
      const haystack = `${item.titleEn} ${item.titleBn} ${item.summaryEn} ${item.summaryBn}`.toLowerCase();
      const matchesQuery = !query.trim() || haystack.includes(query.trim().toLowerCase());
      return matchesAudience && matchesQuery;
    });
  }, [audienceFilter, query]);

  const portalShortcuts: Array<{
    tab: PortalTab;
    labelEn: string;
    labelBn: string;
    icon: React.ComponentType<{ className?: string }>;
  }> = [
    { tab: 'feed', labelEn: 'News Feed', labelBn: 'নিউজ ফিড', icon: Compass },
    { tab: 'commerce', labelEn: 'Retail Shop', labelBn: 'রিটেইল শপ', icon: ShoppingBag },
    { tab: 'wholesale', labelEn: 'Wholesale', labelBn: 'পাইকারি হাব', icon: Package },
    { tab: 'rides', labelEn: 'Logistics', labelBn: 'লজিস্টিকস', icon: Truck },
    { tab: 'orders', labelEn: 'Orders', labelBn: 'অর্ডার হাব', icon: CheckCircle2 },
    { tab: 'wallet', labelEn: 'Wallet', labelBn: 'ওয়ালেট', icon: Wallet },
    { tab: 'messages', labelEn: 'Messages & AI', labelBn: 'মেসেজ ও AI', icon: MessageSquare },
    { tab: 'settings', labelEn: 'Settings', labelBn: 'সেটিংস', icon: MapPin },
  ];

  return (
    <div className="space-y-6 pb-20 animate-fade-in">
      {/* Header Banner */}
      <div className="rounded-[2rem] bg-[var(--pm-card)] border border-[var(--pm-border)] p-6 sm:p-8 shadow-sm">
        <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-4">
          <div className="space-y-2 max-w-2xl">
            <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-[var(--pm-accent)]">
              <BookOpen className="w-4 h-4" />
              <span>{isBn ? 'অ্যাপ পরিচালনা নির্দেশিকা' : 'Interactive App Navigation Guide'}</span>
              <span>·</span>
              <span className="font-mono tabular-nums">v2.0</span>
            </div>
            <h1 className="text-2xl sm:text-3xl font-black text-[var(--pm-text)] tracking-tight">
              {isBn ? 'ক্রেতা ও ভেন্ডর ইউজার গাইড' : 'PaikarMart User & Vendor Guide'}
            </h1>
            <p className="text-xs sm:text-sm text-[var(--pm-muted)] leading-relaxed">
              {isBn
                ? 'ক্রেতা, পাইকারি বায়ার, ভেন্ডর এবং রাইডার/ফ্লিট পার্টনারদের জন্য ধাপে ধাপে অ্যাপ পরিচালনা ও নেভিগেশন ম্যানুয়াল।'
                : 'Step-by-step operating instructions for Buyers, B2B Importers, Verified Merchants, and Fleet Partners across every PaikarMart portal.'}
            </p>
          </div>

          <button
            type="button"
            onClick={toggleLanguage}
            className="self-start px-4 py-2.5 rounded-2xl bg-[var(--pm-surface)] hover:bg-[var(--pm-card-hover)] border border-[var(--pm-border)] text-[var(--pm-text)] text-xs font-bold transition-all active:scale-[0.98] cursor-pointer"
          >
            {isBn ? 'Switch to English' : 'বাংলায় পড়ুন'}
          </button>
        </div>

        {/* Search + Audience Filter */}
        <div className="mt-6 flex flex-col sm:flex-row gap-3">
          <div className="relative flex-1">
            <Search className="w-4 h-4 text-[var(--pm-muted)] absolute left-3.5 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder={isBn ? 'যেমন: RFQ, OTP, ওয়ালেট, কুরিয়ার খুঁজুন...' : 'Search topics (RFQ, OTP, Wallet, Courier)...'}
              className="w-full pl-10 pr-4 py-3 rounded-2xl bg-[var(--pm-input)] border border-[var(--pm-border)] text-xs sm:text-sm text-[var(--pm-text)] placeholder:text-[var(--pm-muted)] outline-none focus:border-[var(--pm-accent)]"
            />
          </div>

          <div className="flex items-center gap-1.5 bg-[var(--pm-surface)] border border-[var(--pm-border)] p-1 rounded-2xl">
            {([
              { id: 'all', en: 'All Guides', bn: 'সকল গাইড' },
              { id: 'buyer', en: 'Buyers', bn: 'ক্রেতা' },
              { id: 'vendor', en: 'Vendors & Fleet', bn: 'ভেন্ডর ও রাইডার' },
            ] as const).map((tab) => (
              <button
                key={tab.id}
                type="button"
                onClick={() => setAudienceFilter(tab.id)}
                className={`px-3.5 py-2 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                  audienceFilter === tab.id
                    ? 'bg-[var(--pm-accent)] text-[var(--pm-accent-fg)] shadow-sm'
                    : 'text-[var(--pm-muted)] hover:text-[var(--pm-text)]'
                }`}
              >
                {isBn ? tab.bn : tab.en}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Quick Portal Launcher Strip */}
      <div className="rounded-[2rem] bg-[var(--pm-card)] border border-[var(--pm-border)] p-5 shadow-sm">
        <div className="flex items-center justify-between mb-3">
          <h2 className="text-xs font-black uppercase tracking-widest text-[var(--pm-muted)]">
            {isBn ? 'সরাসরি পোর্টাল শর্টকাট' : 'Quick Portal Navigation'}
          </h2>
          <span className="text-[11px] text-[var(--pm-muted)] font-medium">
            {isBn ? 'যেকোনো পোর্টালে যেতে ক্লিক করুন' : 'Tap any module to jump directly'}
          </span>
        </div>
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5">
          {portalShortcuts.map((shortcut) => {
            const Icon = shortcut.icon;
            return (
              <button
                key={shortcut.tab}
                type="button"
                onClick={() => onSelectTab(shortcut.tab)}
                className="flex items-center gap-2.5 p-3 rounded-2xl bg-[var(--pm-surface)] hover:bg-[var(--pm-accent-soft)] border border-[var(--pm-border)] hover:border-[var(--pm-accent-border)] text-left transition-all active:scale-[0.98] cursor-pointer"
              >
                <Icon className="w-4 h-4 text-[var(--pm-accent)] shrink-0" />
                <span className="text-xs font-bold text-[var(--pm-text)] truncate">
                  {isBn ? shortcut.labelBn : shortcut.labelEn}
                </span>
              </button>
            );
          })}
        </div>
      </div>

      {/* Step-by-Step Guide Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {filteredItems.map((item) => {
          const Icon = item.icon;
          const steps = isBn ? item.stepsBn : item.stepsEn;
          const audienceText =
            item.audience === 'buyer'
              ? isBn ? 'ক্রেতা গাইড' : 'Buyer Guide'
              : item.audience === 'vendor'
                ? isBn ? 'ভেন্ডর গাইড' : 'Vendor & Partner'
                : isBn ? 'ক্রেতা ও ভেন্ডর উভয়ের জন্য' : 'Buyers · Vendors';

          return (
            <div
              key={item.id}
              className="rounded-[2rem] bg-[var(--pm-card)] border border-[var(--pm-border)] p-6 flex flex-col justify-between gap-5 shadow-sm"
            >
              <div className="space-y-4">
                <div className="flex items-start gap-3.5">
                  <div className={`w-11 h-11 rounded-2xl flex items-center justify-center shrink-0 ${item.accent}`}>
                    <Icon className="w-5 h-5" />
                  </div>
                  <div className="min-w-0">
                    <p className="text-[11px] font-bold text-[var(--pm-muted)] uppercase tracking-wider">
                      {audienceText}
                    </p>
                    <h3 className="text-base font-black text-[var(--pm-text)] leading-snug mt-0.5">
                      {isBn ? item.titleBn : item.titleEn}
                    </h3>
                  </div>
                </div>

                <p className="text-xs text-[var(--pm-muted)] leading-relaxed">
                  {isBn ? item.summaryBn : item.summaryEn}
                </p>

                <ol className="space-y-2.5 pt-1">
                  {steps.map((step, idx) => (
                    <li key={idx} className="flex items-start gap-2.5 text-xs text-[var(--pm-text)]">
                      <span className="w-5 h-5 rounded-lg bg-[var(--pm-surface)] border border-[var(--pm-border)] text-[var(--pm-text)] font-mono tabular-nums font-bold text-[11px] flex items-center justify-center shrink-0 mt-0.5">
                        {idx + 1}
                      </span>
                      <span className="leading-relaxed">{step}</span>
                    </li>
                  ))}
                </ol>
              </div>

              <button
                type="button"
                onClick={() => {
                  if (item.isVendorOnboarding) {
                    if (isVendor) {
                      onSelectTab('vendor-dash');
                    } else if (onOpenVendorModal) {
                      onOpenVendorModal();
                    }
                  } else if (item.targetTab) {
                    onSelectTab(item.targetTab);
                  }
                }}
                className="w-full py-3 px-4 rounded-2xl bg-[var(--pm-surface)] hover:bg-[var(--pm-accent)] hover:text-[var(--pm-accent-fg)] border border-[var(--pm-border)] hover:border-[var(--pm-accent)] text-[var(--pm-text)] text-xs font-black uppercase tracking-wider flex items-center justify-between transition-all active:scale-[0.98] cursor-pointer"
              >
                <span>{isBn ? item.actionLabelBn : item.actionLabelEn}</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            </div>
          );
        })}
      </div>

      {/* Role Safety & Support Note */}
      <div className="rounded-[2rem] bg-[var(--pm-card)] border border-[var(--pm-border)] p-5 flex flex-col sm:flex-row sm:items-center justify-between gap-4 shadow-sm">
        <div className="flex items-start gap-3">
          <ShieldCheck className="w-5 h-5 text-[var(--pm-success)] shrink-0 mt-0.5" />
          <div className="space-y-1">
            <h4 className="text-xs font-black text-[var(--pm-text)] uppercase tracking-wider">
              {isBn ? 'নিরাপদ লেনদেন ও এসক্রো নিয়ম' : 'Safe Trading & Escrow Rule'}
            </h4>
            <p className="text-xs text-[var(--pm-muted)] leading-relaxed">
              {isBn
                ? 'পণ্য বুঝে পাওয়ার আগে কখনোই রাইডারকে আপনার ৪-ডিজিটের ডেলিভারি OTP শেয়ার করবেন না। যেকোনো সহায়তার জন্য AI মেসেজিং ব্যবহার করুন।'
                : 'Never share your 4-digit Delivery OTP before inspecting parcel handover. Need live help? Ask the PaikarMart AI Assistant inside Messages.'}
            </p>
          </div>
        </div>
        <button
          type="button"
          onClick={() => onSelectTab('messages')}
          className="px-4 py-2.5 rounded-2xl bg-[var(--pm-accent)] hover:bg-[var(--pm-accent-hover)] text-[var(--pm-accent-fg)] text-xs font-bold flex items-center gap-2 shrink-0 transition-all active:scale-[0.98] cursor-pointer"
        >
          <Bot className="w-4 h-4" />
          <span>{isBn ? 'AI সহায়তা নিন' : 'Ask AI Assistant'}</span>
        </button>
      </div>
    </div>
  );
};
