import React, { useState } from 'react';
import { AppNotification, PortalTab } from '@/types';
import { 
  Bell, 
  CheckCheck, 
  Package, 
  Wrench, 
  Heart, 
  Wallet, 
  Sparkles, 
  Trash2, 
  ChevronRight, 
  Settings, 
  Filter,
  Check,
  ArrowLeft
} from 'lucide-react';
import { useLanguage } from '@/contexts/LanguageContext';
import { useSettings } from '@/contexts/SettingsContext';

interface NotificationsCenterPageProps {
  notifications: AppNotification[];
  onMarkAsRead: (id: string) => void;
  onMarkAllAsRead: () => void;
  onClearAll: () => void;
  onSelectTab: (tab: PortalTab) => void;
  onOpenSettingsPortal?: (section?: any) => void;
}

export const NotificationsCenterPage: React.FC<NotificationsCenterPageProps> = ({
  notifications,
  onMarkAsRead,
  onMarkAllAsRead,
  onClearAll,
  onSelectTab,
  onOpenSettingsPortal,
}) => {
  const { language } = useLanguage();
  const { openSettings } = useSettings();
  const isBn = language === 'bn';

  const [activeFilter, setActiveFilter] = useState<'all' | 'orders' | 'social' | 'wallet' | 'system'>('all');

  const unreadCount = notifications.filter(n => !n.read).length;

  const filteredNotifications = notifications.filter(n => {
    if (activeFilter === 'orders') return n.type === 'order' || n.type === 'booking';
    if (activeFilter === 'social') return n.type === 'social';
    if (activeFilter === 'wallet') return n.type === 'wallet';
    if (activeFilter === 'system') return n.type === 'system';
    return true;
  });

  const getNotificationIcon = (type: AppNotification['type']) => {
    switch (type) {
      case 'order':
        return <div className="p-2.5 rounded-2xl bg-blue-500/10 text-blue-600 dark:text-blue-400"><Package className="w-5 h-5" /></div>;
      case 'booking':
        return <div className="p-2.5 rounded-2xl bg-emerald-500/10 text-emerald-600 dark:text-emerald-400"><Wrench className="w-5 h-5" /></div>;
      case 'social':
        return <div className="p-2.5 rounded-2xl bg-pink-500/10 text-pink-600 dark:text-pink-400"><Heart className="w-5 h-5" /></div>;
      case 'wallet':
        return <div className="p-2.5 rounded-2xl bg-purple-500/10 text-purple-600 dark:text-purple-400"><Wallet className="w-5 h-5" /></div>;
      case 'system':
      default:
        return <div className="p-2.5 rounded-2xl bg-amber-500/10 text-amber-600 dark:text-amber-400"><Sparkles className="w-5 h-5" /></div>;
    }
  };

  const handleNotificationClick = (notif: AppNotification) => {
    onMarkAsRead(notif.id);
    if (notif.actionTab) {
      onSelectTab(notif.actionTab);
    }
  };

  return (
    <div className="max-w-4xl mx-auto space-y-4 sm:space-y-6 pb-20 animate-fadeIn">
      {/* Header Banner */}
      <div className="p-4 sm:p-6 rounded-2xl sm:rounded-3xl bg-[var(--pm-card)] border border-[var(--pm-border)] shadow-xs flex flex-col sm:flex-row sm:items-center justify-between gap-3 sm:gap-4">
        <div className="flex items-center gap-3 sm:gap-4">
          <div className="relative">
            <div className="w-12 h-12 sm:w-14 sm:h-14 rounded-xl sm:rounded-2xl bg-[var(--pm-accent)] text-[var(--pm-accent-fg)] flex items-center justify-center shadow-lg">
              <Bell className="w-7 h-7" />
            </div>
            {unreadCount > 0 && (
              <span className="absolute -top-1 -right-1 w-5 h-5 rounded-full bg-[var(--pm-danger)] text-white text-xs font-bold flex items-center justify-center ring-2 ring-[var(--pm-card)] animate-pulse">
                {unreadCount}
              </span>
            )}
          </div>

          <div>
            <div className="flex items-center gap-2">
              <span className="text-[10px] font-black uppercase tracking-wider text-[var(--pm-accent)] bg-[var(--pm-accent-soft)] px-2 py-0.5 rounded-full border border-[var(--pm-accent-border)]">
                {isBn ? 'নোটিফিকেশন সেন্টার' : 'Notifications Center'}
              </span>
              {unreadCount > 0 && (
                <span className="text-xs text-[var(--pm-danger)] font-bold">
                  {isBn ? `${unreadCount} টি নতুন বার্তা` : `${unreadCount} Unread`}
                </span>
              )}
            </div>
            <h1 className="text-lg sm:text-2xl font-black text-[var(--pm-text)] tracking-tight mt-0.5">
              {isBn ? 'আপনার সকল নোটিফিকেশন ও অ্যালার্ট' : 'All Updates & Alerts History'}
            </h1>
            <p className="text-xs text-[var(--pm-muted)]">
              {isBn ? 'অর্ডার আপডেট, কুরিয়ার রাইডার পিন, রিয়্যাকশন ও ওয়ালেট স্টেটমেন্ট' : 'Track order dispatches, rider updates, social reactions, and wallet payouts'}
            </p>
          </div>
        </div>

        {/* Action Controls */}
        <div className="flex items-center gap-2 self-start sm:self-auto">
          {unreadCount > 0 && (
            <button
              type="button"
              onClick={onMarkAllAsRead}
              className="px-3.5 py-2 rounded-2xl bg-[var(--pm-accent-soft)] hover:opacity-90 text-[var(--pm-accent)] border border-[var(--pm-accent-border)] text-xs font-bold transition-colors cursor-pointer flex items-center gap-1.5"
            >
              <CheckCheck className="w-4 h-4" />
              <span>{isBn ? 'সব পঠিত হিসেবে চিহ্নিত করুন' : 'Mark All Read'}</span>
            </button>
          )}

          <button
            type="button"
            onClick={() => {
              if (onOpenSettingsPortal) {
                onOpenSettingsPortal('account_notifications');
              } else {
                openSettings('appearance');
              }
            }}
            className="p-2.5 rounded-2xl bg-[var(--pm-surface)] hover:bg-[var(--pm-card-hover)] border border-[var(--pm-border)] text-[var(--pm-text)] transition-colors cursor-pointer"
            title={isBn ? 'নোটিফিকেশন সেটিংস' : 'Notification Preferences'}
          >
            <Settings className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* Category Filter Pills */}
      <div className="flex items-center gap-2 overflow-x-auto no-scrollbar pb-1">
        {[
          { id: 'all', label: isBn ? 'সব নোটিফিকেশন' : 'All Activity', count: notifications.length },
          { id: 'orders', label: isBn ? 'অর্ডার ও কুরিয়ার' : 'Orders & Delivery', count: notifications.filter(n => n.type === 'order' || n.type === 'booking').length },
          { id: 'social', label: isBn ? 'সোশ্যাল ও কমেন্ট' : 'Social & Comments', count: notifications.filter(n => n.type === 'social').length },
          { id: 'wallet', label: isBn ? 'ওয়ালেট ও পেমেন্ট' : 'Wallet & Payouts', count: notifications.filter(n => n.type === 'wallet').length },
          { id: 'system', label: isBn ? 'সিস্টেম অ্যালার্ট' : 'System Alerts', count: notifications.filter(n => n.type === 'system').length },
        ].map(filter => (
          <button
            key={filter.id}
            type="button"
            onClick={() => setActiveFilter(filter.id as any)}
            className={`px-3 py-1.5 rounded-xl text-xs font-bold whitespace-nowrap transition-all flex items-center gap-2 cursor-pointer ${
              activeFilter === filter.id
                ? 'bg-[var(--pm-accent)] text-[var(--pm-accent-fg)] shadow-md'
                : 'bg-[var(--pm-card)] border border-[var(--pm-border)] text-[var(--pm-muted)] hover:text-[var(--pm-text)] hover:bg-[var(--pm-card-hover)]'
            }`}
          >
            <span>{filter.label}</span>
            <span className={`text-[10px] px-1.5 py-0.2 rounded-full font-mono font-bold ${
              activeFilter === filter.id ? 'bg-black/15 text-[var(--pm-accent-fg)]' : 'bg-[var(--pm-surface)] text-[var(--pm-muted)]'
            }`}>
              {filter.count}
            </span>
          </button>
        ))}
      </div>

      {/* Notifications List */}
      <div className="bg-[var(--pm-card)] border border-[var(--pm-border)] rounded-2xl sm:rounded-3xl p-3 sm:p-6 shadow-xs space-y-3">
        {filteredNotifications.length > 0 ? (
          <div className="divide-y divide-[var(--pm-border)]">
            {filteredNotifications.map((notif) => (
              <div
                key={notif.id}
                onClick={() => handleNotificationClick(notif)}
                className={`py-3 px-2.5 sm:py-3.5 sm:px-3 rounded-xl sm:rounded-2xl flex items-start gap-3 sm:gap-4 transition-all cursor-pointer group ${
                  !notif.read 
                    ? 'bg-[var(--pm-accent-soft)] hover:bg-[var(--pm-card-hover)]' 
                    : 'hover:bg-[var(--pm-card-hover)]'
                }`}
              >
                {/* Icon or Avatar */}
                {notif.avatar ? (
                  <img
                    src={notif.avatar}
                    alt="User"
                    className="w-10 h-10 rounded-2xl object-cover ring-2 ring-[var(--pm-accent-border)] shrink-0 mt-0.5"
                  />
                ) : (
                  getNotificationIcon(notif.type)
                )}

                <div className="flex-1 min-w-0 space-y-1">
                  <div className="flex items-center justify-between gap-2">
                    <h4 className={`text-sm font-bold truncate ${!notif.read ? 'text-[var(--pm-accent)] font-black' : 'text-[var(--pm-text)]'}`}>
                      {notif.title}
                    </h4>
                    <span className="text-[10px] text-[var(--pm-muted)] shrink-0 font-medium">{notif.timestamp}</span>
                  </div>

                  <p className="text-xs text-[var(--pm-muted)] leading-relaxed">
                    {notif.message}
                  </p>
                </div>

                <div className="flex items-center gap-2 self-center shrink-0">
                  {!notif.read && (
                    <div className="w-2.5 h-2.5 rounded-full bg-[var(--pm-accent)] animate-pulse" />
                  )}
                  <ChevronRight className="w-4 h-4 text-[var(--pm-muted)] group-hover:text-[var(--pm-accent)] transition-colors" />
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="py-16 text-center space-y-3">
            <div className="w-14 h-14 rounded-full bg-[var(--pm-surface)] text-[var(--pm-muted)] flex items-center justify-center mx-auto border border-[var(--pm-border)]">
              <Bell className="w-6 h-6" />
            </div>
            <h4 className="text-sm font-bold text-[var(--pm-text)]">
              {isBn ? 'কোনো নোটিফিকেশন পাওয়া যায়নি' : 'No notifications in this filter'}
            </h4>
            <p className="text-xs text-[var(--pm-muted)]">
              {isBn ? 'নতুন কোনো আপডেট এলে এখানে দেখা যাবে' : 'Check back later for order dispatches, comments and alerts'}
            </p>
          </div>
        )}

        {/* Clear All Footer Button */}
        {notifications.length > 0 && (
          <div className="pt-4 border-t border-[var(--pm-border)] flex justify-end">
            <button
              type="button"
              onClick={onClearAll}
              className="text-xs font-bold text-[var(--pm-danger)] hover:opacity-80 flex items-center gap-1.5 transition-colors cursor-pointer"
            >
              <Trash2 className="w-3.5 h-3.5" />
              <span>{isBn ? 'সমস্ত নোটিফিকেশন মুছে ফেলুন' : 'Clear All Notifications'}</span>
            </button>
          </div>
        )}
      </div>
    </div>
  );
};
