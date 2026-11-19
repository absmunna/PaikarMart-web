import React, { useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  ArrowRight,
  Bell,
  BookOpen,
  Package,
  Settings,
  Store,
  User as UserIcon,
  Wallet,
} from 'lucide-react';
import type { Order, PortalTab, User } from '@/types';
import { useLanguage } from '@/contexts/LanguageContext';
import { getPortalsForHub } from '@/hubs/shared/portalRegistry';

const UTILITY_ICONS: Record<string, React.ComponentType<{ className?: string }>> = {
  package: Package,
  wallet: Wallet,
  store: Store,
  user: UserIcon,
  bell: Bell,
  settings: Settings,
  book: BookOpen,
};

interface UtilityMixedFeedProps {
  currentUser: User;
  orders: Order[];
  unreadNotificationsCount: number;
  onSelectTab: (tab: PortalTab) => void;
  onOpenWallet: () => void;
  onOpenNotifications: () => void;
  onOpenSettings: () => void;
  onOpenCloudGuide: () => void;
}

export const UtilityMixedFeed: React.FC<UtilityMixedFeedProps> = ({
  currentUser,
  orders,
  unreadNotificationsCount,
  onSelectTab,
  onOpenWallet,
  onOpenNotifications,
  onOpenSettings,
  onOpenCloudGuide,
}) => {
  const { language } = useLanguage();
  const isBn = language === 'bn';
  const navigate = useNavigate();

  const registeredUtilityPortals = useMemo(() => getPortalsForHub('utility'), []);

  const handleOpenUtilityPortal = (portalId: string, entryRoute: string) => {
    if (portalId === 'wallet') {
      onOpenWallet();
      return;
    }
    if (portalId === 'notifications-center') {
      onOpenNotifications();
      return;
    }
    if (portalId === 'settings-center') {
      onOpenSettings();
      return;
    }
    if (portalId === 'guide') {
      onOpenCloudGuide();
      return;
    }
    if (portalId === 'orders-hub') {
      onSelectTab('orders');
      return;
    }
    if (portalId === 'seller-central') {
      onSelectTab('vendor-dash');
      return;
    }
    if (portalId === 'user-profile') {
      onSelectTab('profile');
      return;
    }
    navigate(entryRoute);
  };

  return (
    <div className="space-y-5 pb-20 animate-fadeIn">
      <section className="rounded-2xl sm:rounded-3xl bg-gradient-to-r from-slate-800 via-slate-900 to-indigo-950 p-5 sm:p-6 text-white shadow-lg">
        <p className="text-[10px] font-black uppercase tracking-[0.18em] text-white/70">
          {isBn ? 'ইউটিলিটি হাব · অ্যাকাউন্ট ককপিট' : 'Utility Hub · Account & Operations'}
        </p>
        <h1 className="mt-1 text-xl sm:text-2xl font-black tracking-tight">
          {isBn ? 'অর্ডার, ওয়ালেট, সেলার সেন্ট্রাল ও সেটিংস' : 'Orders, Wallet, Seller Central & Settings'}
        </h1>
        <p className="mt-1.5 text-xs sm:text-sm text-white/80">
          {isBn
            ? 'আপনার অ্যাকাউন্ট, পেমেন্ট ব্যালেন্স, অর্ডার ট্র্যাকিং এবং ভেন্ডর টুলস এক জায়গা থেকে পরিচালনা করুন।'
            : 'Manage your orders, BDT escrow wallet, storefront tools, notifications, and platform preferences in one cockpit.'}
        </p>

        <div className="mt-4 grid grid-cols-3 gap-2.5">
          <div className="rounded-xl bg-white/10 px-3 py-2.5 backdrop-blur-sm">
            <p className="text-[10px] text-white/70 font-bold">{isBn ? 'ব্যালেন্স' : 'Balance'}</p>
            <p className="text-sm sm:text-base font-mono font-black">৳{(currentUser.balance ?? 0).toLocaleString()}</p>
          </div>
          <div className="rounded-xl bg-white/10 px-3 py-2.5 backdrop-blur-sm">
            <p className="text-[10px] text-white/70 font-bold">{isBn ? 'অর্ডার' : 'Orders'}</p>
            <p className="text-sm sm:text-base font-mono font-black">{orders.length}</p>
          </div>
          <div className="rounded-xl bg-white/10 px-3 py-2.5 backdrop-blur-sm">
            <p className="text-[10px] text-white/70 font-bold">{isBn ? 'অ্যালার্ট' : 'Unread Alerts'}</p>
            <p className="text-sm sm:text-base font-mono font-black">{unreadNotificationsCount}</p>
          </div>
        </div>
      </section>

      <section className="grid grid-cols-1 sm:grid-cols-2 gap-3">
        {registeredUtilityPortals.map((portal) => {
          const Icon = UTILITY_ICONS[portal.iconName] || Package;
          return (
            <button
              key={portal.id}
              type="button"
              onClick={() => handleOpenUtilityPortal(portal.id, portal.entryRoute)}
              className="group text-left rounded-2xl bg-[var(--pm-card)] border border-[var(--pm-border)] p-4 hover:border-[var(--pm-accent)]/60 transition-all shadow-xs flex items-start justify-between gap-3 cursor-pointer"
            >
              <div className="flex items-start gap-3">
                <div className="w-10 h-10 rounded-xl bg-[var(--pm-accent-soft)] text-[var(--pm-accent)] flex items-center justify-center shrink-0">
                  <Icon className="w-5 h-5" />
                </div>
                <div className="space-y-1">
                  <h2 className="text-sm font-black text-[var(--pm-text)] group-hover:text-[var(--pm-accent)] transition-colors">
                    {isBn ? portal.labelBn : portal.labelEn}
                  </h2>
                  <div className="flex flex-wrap gap-1.5">
                    {portal.categories.map((cat) => (
                      <span
                        key={cat.id}
                        className="text-[10px] font-semibold px-2 py-0.5 rounded-md bg-[var(--pm-surface)] border border-[var(--pm-border)] text-[var(--pm-muted)]"
                      >
                        {isBn ? cat.labelBn : cat.labelEn}
                      </span>
                    ))}
                  </div>
                </div>
              </div>
              <ArrowRight className="w-4 h-4 text-[var(--pm-muted)] group-hover:text-[var(--pm-accent)] group-hover:translate-x-0.5 transition-all shrink-0 mt-1" />
            </button>
          );
        })}
      </section>
    </div>
  );
};
