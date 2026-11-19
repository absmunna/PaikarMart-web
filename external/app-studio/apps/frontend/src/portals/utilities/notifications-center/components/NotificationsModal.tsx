import React, { useState, useEffect } from 'react';
import { AppNotification, PortalTab } from '@/types';
import { useLanguage } from '@/contexts/LanguageContext';
import { 
  Bell, 
  X, 
  CheckCheck, 
  Package, 
  Wrench, 
  Heart, 
  Wallet, 
  Sparkles, 
  Trash2, 
  ChevronRight,
  Lock,
  LogIn
} from 'lucide-react';

interface NotificationsModalProps {
  isOpen: boolean;
  onClose: () => void;
  notifications: AppNotification[];
  onMarkAsRead: (id: string) => void;
  onMarkAllAsRead: () => void;
  onClearAll: () => void;
  onSelectTab: (tab: PortalTab) => void;
  isGuest?: boolean;
  onOpenAuthModal?: (tab?: 'login' | 'register') => void;
}

const PROTECTED_TABS: PortalTab[] = ['profile', 'orders', 'wallet', 'messages', 'notifications', 'vendor-dash'];

export const NotificationsModal: React.FC<NotificationsModalProps> = ({
  isOpen,
  onClose,
  notifications,
  onMarkAsRead,
  onMarkAllAsRead,
  onClearAll,
  onSelectTab,
  isGuest = false,
  onOpenAuthModal,
}) => {
  const [filter, setFilter] = useState<'all' | 'orders' | 'social' | 'system'>('all');
  const { language } = useLanguage();
  const isBn = language === 'bn';

  useEffect(() => {
    if (isGuest && (filter === 'orders' || filter === 'social')) {
      setFilter('all');
    }
  }, [isGuest, filter]);

  if (!isOpen) return null;

  // Defense-in-depth: Guest users only view up to 3 public/system notifications
  const scopedNotifications = isGuest
    ? notifications.filter((n) => n.type === 'system').slice(0, 3)
    : notifications;

  const unreadCount = scopedNotifications.filter(n => !n.read).length;

  const filteredNotifications = scopedNotifications.filter(n => {
    if (filter === 'orders') return n.type === 'order' || n.type === 'booking';
    if (filter === 'social') return n.type === 'social';
    if (filter === 'system') return n.type === 'system' || n.type === 'wallet';
    return true;
  });

  const getNotificationIcon = (type: AppNotification['type']) => {
    switch (type) {
      case 'order':
        return <div className="p-2 rounded-xl bg-blue-500/10 text-blue-600 dark:text-blue-400"><Package className="w-4 h-4" /></div>;
      case 'booking':
        return <div className="p-2 rounded-xl bg-emerald-500/10 text-emerald-600 dark:text-emerald-400"><Wrench className="w-4 h-4" /></div>;
      case 'social':
        return <div className="p-2 rounded-xl bg-pink-500/10 text-pink-600 dark:text-pink-400"><Heart className="w-4 h-4" /></div>;
      case 'wallet':
        return <div className="p-2 rounded-xl bg-purple-500/10 text-purple-600 dark:text-purple-400"><Wallet className="w-4 h-4" /></div>;
      case 'system':
      default:
        return <div className="p-2 rounded-xl bg-amber-500/10 text-amber-600 dark:text-amber-400"><Sparkles className="w-4 h-4" /></div>;
    }
  };

  const handleNotificationClick = (notif: AppNotification) => {
    onMarkAsRead(notif.id);
    if (isGuest && notif.actionTab && PROTECTED_TABS.includes(notif.actionTab)) {
      onClose();
      onOpenAuthModal?.('login');
      return;
    }
    if (notif.actionTab) {
      onSelectTab(notif.actionTab);
    }
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-start sm:items-center justify-center p-3 sm:p-4 bg-black/65 backdrop-blur-xs animate-fadeIn">
      <div className="bg-[var(--pm-card)] text-[var(--pm-text)] border border-[var(--pm-border)] rounded-3xl w-full max-w-lg shadow-2xl overflow-hidden flex flex-col max-h-[85vh] mt-12 sm:mt-0 animate-scaleUp">
        
        {/* Header */}
        <div className="p-4 sm:p-5 border-b border-[var(--pm-border)] flex items-center justify-between shrink-0">
          <div className="flex items-center gap-3">
            <div className="relative">
              <div className="w-10 h-10 rounded-2xl bg-[var(--pm-accent)] text-[var(--pm-accent-fg)] flex items-center justify-center shadow-md">
                <Bell className="w-5 h-5" />
              </div>
              {unreadCount > 0 && (
                <span className="absolute -top-1 -right-1 min-w-[16px] h-4 px-1 rounded-full bg-[var(--pm-danger)] text-white text-[10px] font-bold flex items-center justify-center ring-2 ring-[var(--pm-card)] animate-pulse">
                  {unreadCount > 99 ? '99+' : unreadCount}
                </span>
              )}
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h3 className="text-base font-black text-[var(--pm-text)]">
                  {isBn ? 'নোটিফিকেশন' : 'Notifications'}
                </h3>
                {isGuest && (
                  <span className="px-2 py-0.5 rounded-md bg-[var(--pm-warning-soft)] text-[var(--pm-warning)] text-[10px] font-bold">
                    {isBn ? 'গেস্ট সীমিত' : 'Guest Limited'}
                  </span>
                )}
              </div>
              <p className="text-xs text-[var(--pm-muted)]">
                {isGuest
                  ? (isBn ? 'শুধুমাত্র পাবলিক সিস্টেম আপডেট দেখানো হচ্ছে' : 'Showing public system updates only')
                  : unreadCount > 0
                  ? (isBn ? `${unreadCount}টি অপঠিত আপডেট` : `${unreadCount} unread updates`)
                  : (isBn ? 'সব পড়া হয়ে গেছে!' : 'All caught up!')}
              </p>
            </div>
          </div>

          <div className="flex items-center gap-1">
            {!isGuest && unreadCount > 0 && (
              <button
                type="button"
                onClick={onMarkAllAsRead}
                className="p-2 rounded-xl text-[var(--pm-muted)] hover:text-[var(--pm-accent)] hover:bg-[var(--pm-surface)] transition-colors text-xs font-bold flex items-center gap-1 cursor-pointer"
                title="Mark all as read"
              >
                <CheckCheck className="w-4 h-4" />
                <span className="hidden sm:inline">{isBn ? 'সব পড়া হয়েছে' : 'Mark read'}</span>
              </button>
            )}
            <button
              type="button"
              onClick={onClose}
              aria-label="Close notifications"
              className="p-2 rounded-full text-[var(--pm-muted)] hover:text-[var(--pm-text)] hover:bg-[var(--pm-surface)] transition-colors cursor-pointer"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Guest Mode Notification Limitation Banner */}
        {isGuest && (
          <div className="px-4 py-3 bg-[var(--pm-warning-soft)] border-b border-[var(--pm-warning)]/25 flex flex-col sm:flex-row sm:items-center justify-between gap-2.5 shrink-0">
            <div className="flex items-start gap-2.5 min-w-0">
              <Lock className="w-4 h-4 text-[var(--pm-warning)] shrink-0 mt-0.5" />
              <div className="min-w-0">
                <p className="text-xs font-bold text-[var(--pm-text)]">
                  {isBn ? 'গেস্ট নোটিফিকেশন সীমাবদ্ধতা' : 'Guest Notification Limit'}
                </p>
                <p className="text-[11px] text-[var(--pm-muted)] leading-snug">
                  {isBn
                    ? 'অর্ডার, বুকিং, ওয়ালেট ও সোশ্যাল অ্যালার্ট পেতে লগইন করুন। গেস্ট হিসেবে সর্বোচ্চ ৩টি সিস্টেম বার্তা দেখা যায়।'
                    : 'Sign in to unlock live order, booking, wallet, and social alerts. Guests can only view up to 3 public system notices.'}
                </p>
              </div>
            </div>
            {onOpenAuthModal && (
              <button
                type="button"
                onClick={() => {
                  onClose();
                  onOpenAuthModal('login');
                }}
                className="px-3 py-1.5 rounded-xl bg-[var(--pm-accent)] hover:bg-[var(--pm-accent-hover)] text-[var(--pm-accent-fg)] text-xs font-bold inline-flex items-center justify-center gap-1.5 shrink-0 cursor-pointer shadow-xs"
              >
                <LogIn className="w-3.5 h-3.5" />
                <span>{isBn ? 'লগইন করুন' : 'Sign In'}</span>
              </button>
            )}
          </div>
        )}

        {/* Filter Pills */}
        <div className="px-4 py-2.5 bg-[var(--pm-surface)] border-b border-[var(--pm-border)] flex items-center justify-between gap-2 overflow-x-auto no-scrollbar shrink-0">
          <div className="flex items-center gap-1.5">
            {[
              { id: 'all', label: isBn ? 'সব' : 'All', locked: false },
              { id: 'orders', label: isBn ? 'অর্ডার ও বুকিং' : 'Orders & Bookings', locked: isGuest },
              { id: 'social', label: isBn ? 'সোশ্যাল' : 'Social', locked: isGuest },
              { id: 'system', label: isBn ? 'সিস্টেম' : 'System', locked: false }
            ].map(tab => (
              <button
                key={tab.id}
                type="button"
                onClick={() => {
                  if (tab.locked) {
                    onClose();
                    onOpenAuthModal?.('login');
                    return;
                  }
                  setFilter(tab.id as any);
                }}
                className={`px-3 py-1.5 rounded-xl text-xs font-bold whitespace-nowrap transition-all cursor-pointer inline-flex items-center gap-1 ${
                  tab.locked
                    ? 'bg-[var(--pm-card)] text-[var(--pm-muted)]/65 border border-[var(--pm-border)] opacity-75 hover:opacity-100'
                    : filter === tab.id
                    ? 'bg-[var(--pm-accent)] text-[var(--pm-accent-fg)] shadow-xs'
                    : 'bg-[var(--pm-card)] text-[var(--pm-muted)] border border-[var(--pm-border)] hover:text-[var(--pm-text)] hover:bg-[var(--pm-card-hover)]'
                }`}
                title={tab.locked ? (isBn ? 'দেখতে লগইন করুন' : 'Sign in to unlock') : undefined}
              >
                {tab.locked && <Lock className="w-3 h-3 shrink-0" />}
                <span>{tab.label}</span>
              </button>
            ))}
          </div>

          {!isGuest && scopedNotifications.length > 0 && (
            <button
              type="button"
              onClick={onClearAll}
              className="p-1.5 text-[var(--pm-muted)] hover:text-[var(--pm-danger)] transition-colors text-xs font-medium flex items-center gap-1 shrink-0 cursor-pointer"
              title="Clear all notifications"
            >
              <Trash2 className="w-3.5 h-3.5" />
            </button>
          )}
        </div>

        {/* Notification List */}
        <div className="flex-1 overflow-y-auto p-3 sm:p-4 space-y-2.5 no-scrollbar">
          {filteredNotifications.length > 0 ? (
            filteredNotifications.map(notif => (
              <div
                key={notif.id}
                onClick={() => handleNotificationClick(notif)}
                className={`p-3.5 rounded-2xl border transition-all cursor-pointer flex items-start gap-3 group relative ${
                  notif.read
                    ? 'bg-[var(--pm-card)] border-[var(--pm-border)] hover:bg-[var(--pm-card-hover)]'
                    : 'bg-[var(--pm-accent-soft)] border-[var(--pm-accent-border)] shadow-xs hover:bg-[var(--pm-card-hover)]'
                }`}
              >
                {/* Unread indicator dot */}
                {!notif.read && (
                  <div className="absolute top-3.5 right-3.5 w-2 h-2 rounded-full bg-[var(--pm-accent)] animate-pulse" />
                )}

                {notif.avatar ? (
                  <img
                    src={notif.avatar}
                    alt="Author"
                    referrerPolicy="no-referrer"
                    className="w-10 h-10 rounded-full object-cover shrink-0 ring-2 ring-[var(--pm-border)]"
                  />
                ) : (
                  getNotificationIcon(notif.type)
                )}

                <div className="flex-1 min-w-0 pr-4">
                  <div className="flex items-center justify-between gap-2">
                    <h4 className="text-xs font-bold text-[var(--pm-text)] truncate group-hover:text-[var(--pm-accent)] transition-colors">
                      {notif.title}
                    </h4>
                    <span className="text-[10px] font-medium text-[var(--pm-muted)] shrink-0 font-mono">
                      {notif.timestamp}
                    </span>
                  </div>
                  <p className="text-xs text-[var(--pm-muted)] mt-1 line-clamp-2 leading-relaxed">
                    {notif.message}
                  </p>
                </div>

                <ChevronRight className="w-4 h-4 text-[var(--pm-muted)] group-hover:text-[var(--pm-accent)] group-hover:translate-x-0.5 transition-all shrink-0 self-center" />
              </div>
            ))
          ) : (
            <div className="py-12 text-center space-y-3">
              <div className="w-12 h-12 rounded-full bg-[var(--pm-surface)] border border-[var(--pm-border)] text-[var(--pm-muted)] flex items-center justify-center mx-auto">
                <Bell className="w-6 h-6" />
              </div>
              <p className="text-xs font-medium text-[var(--pm-muted)]">
                {isBn ? 'এই ক্যাটাগরিতে কোনো নোটিফিকেশন নেই।' : 'No notifications found in this view.'}
              </p>
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="p-3 border-t border-[var(--pm-border)] bg-[var(--pm-surface)] text-center shrink-0 flex items-center justify-between px-4">
          {isGuest && onOpenAuthModal ? (
            <button
              type="button"
              onClick={() => {
                onClose();
                onOpenAuthModal('login');
              }}
              className="text-xs font-bold text-[var(--pm-accent)] hover:underline flex items-center gap-1.5 cursor-pointer"
            >
              <Lock className="w-3.5 h-3.5" />
              <span>{isBn ? 'সব নোটিফিকেশন দেখতে লগইন করুন' : 'Sign In for Full Notification Center'}</span>
            </button>
          ) : (
            <button
              type="button"
              onClick={() => {
                onSelectTab('notifications');
                onClose();
              }}
              className="text-xs font-bold text-[var(--pm-accent)] hover:underline flex items-center gap-1 cursor-pointer"
            >
              <span>{isBn ? 'সব নোটিফিকেশন দেখুন' : 'View Full Notification Center'}</span>
              <ChevronRight className="w-3.5 h-3.5" />
            </button>
          )}
          <button
            type="button"
            onClick={onClose}
            className="text-xs font-bold text-[var(--pm-muted)] hover:text-[var(--pm-text)] transition-colors cursor-pointer"
          >
            {isBn ? 'বন্ধ করুন' : 'Close'}
          </button>
        </div>

      </div>
    </div>
  );
};
