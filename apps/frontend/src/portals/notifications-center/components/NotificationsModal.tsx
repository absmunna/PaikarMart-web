import React, { useState } from 'react';
import { AppNotification, PortalTab } from '@/types';
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
  ChevronRight 
} from 'lucide-react';

interface NotificationsModalProps {
  isOpen: boolean;
  onClose: () => void;
  notifications: AppNotification[];
  onMarkAsRead: (id: string) => void;
  onMarkAllAsRead: () => void;
  onClearAll: () => void;
  onSelectTab: (tab: PortalTab) => void;
}

export const NotificationsModal: React.FC<NotificationsModalProps> = ({
  isOpen,
  onClose,
  notifications,
  onMarkAsRead,
  onMarkAllAsRead,
  onClearAll,
  onSelectTab,
}) => {
  const [filter, setFilter] = useState<'all' | 'orders' | 'social' | 'system'>('all');

  if (!isOpen) return null;

  const unreadCount = notifications.filter(n => !n.read).length;

  const filteredNotifications = notifications.filter(n => {
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
                <span className="absolute -top-1 -right-1 w-4 h-4 rounded-full bg-[var(--pm-danger)] text-white text-[10px] font-bold flex items-center justify-center ring-2 ring-[var(--pm-card)] animate-pulse">
                  {unreadCount}
                </span>
              )}
            </div>
            <div>
              <h3 className="text-base font-black text-[var(--pm-text)]">Notifications</h3>
              <p className="text-xs text-[var(--pm-muted)]">{unreadCount > 0 ? `${unreadCount} unread updates` : 'All caught up!'}</p>
            </div>
          </div>

          <div className="flex items-center gap-1">
            {unreadCount > 0 && (
              <button
                onClick={onMarkAllAsRead}
                className="p-2 rounded-xl text-[var(--pm-muted)] hover:text-[var(--pm-accent)] hover:bg-[var(--pm-surface)] transition-colors text-xs font-bold flex items-center gap-1 cursor-pointer"
                title="Mark all as read"
              >
                <CheckCheck className="w-4 h-4" />
                <span className="hidden sm:inline">Mark read</span>
              </button>
            )}
            <button
              onClick={onClose}
              aria-label="Close notifications"
              className="p-2 rounded-full text-[var(--pm-muted)] hover:text-[var(--pm-text)] hover:bg-[var(--pm-surface)] transition-colors cursor-pointer"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Filter Pills */}
        <div className="px-4 py-2.5 bg-[var(--pm-surface)] border-b border-[var(--pm-border)] flex items-center justify-between gap-2 overflow-x-auto no-scrollbar shrink-0">
          <div className="flex items-center gap-1.5">
            {[
              { id: 'all', label: 'All' },
              { id: 'orders', label: 'Orders & Bookings' },
              { id: 'social', label: 'Social' },
              { id: 'system', label: 'System' }
            ].map(tab => (
              <button
                key={tab.id}
                onClick={() => setFilter(tab.id as any)}
                className={`px-3 py-1.5 rounded-xl text-xs font-bold whitespace-nowrap transition-all cursor-pointer ${
                  filter === tab.id
                    ? 'bg-[var(--pm-accent)] text-[var(--pm-accent-fg)] shadow-xs'
                    : 'bg-[var(--pm-card)] text-[var(--pm-muted)] border border-[var(--pm-border)] hover:text-[var(--pm-text)] hover:bg-[var(--pm-card-hover)]'
                }`}
              >
                {tab.label}
              </button>
            ))}
          </div>

          {notifications.length > 0 && (
            <button
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
              <p className="text-xs font-medium text-[var(--pm-muted)]">No notifications found in this view.</p>
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="p-3 border-t border-[var(--pm-border)] bg-[var(--pm-surface)] text-center shrink-0 flex items-center justify-between px-4">
          <button
            onClick={() => {
              onSelectTab('notifications');
              onClose();
            }}
            className="text-xs font-bold text-[var(--pm-accent)] hover:underline flex items-center gap-1 cursor-pointer"
          >
            <span>View Full Notification Center</span>
            <ChevronRight className="w-3.5 h-3.5" />
          </button>
          <button
            onClick={onClose}
            className="text-xs font-bold text-[var(--pm-muted)] hover:text-[var(--pm-text)] transition-colors cursor-pointer"
          >
            Close
          </button>
        </div>

      </div>
    </div>
  );
};
