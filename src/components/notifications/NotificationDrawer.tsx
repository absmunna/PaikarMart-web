import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Bell, X, CheckCheck, Trash2, Package, Coins, 
  Tag, AlertCircle, ChevronRight, ExternalLink 
} from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { useNotificationsStore, AppNotification } from '../../modules/notification/notificationsStore';

export const NotificationDrawer: React.FC = () => {
  const { 
    isOpen, 
    closeDrawer, 
    notifications, 
    markAsRead, 
    markAllAsRead, 
    removeNotification 
  } = useNotificationsStore();
  const [activeTab, setActiveTab] = useState<'all' | 'orders' | 'demands' | 'offers'>('all');
  const navigate = useNavigate();

  const filtered = notifications.filter((n) => {
    if (activeTab === 'all') return true;
    return n.category === activeTab;
  });

  const getIcon = (type?: AppNotification['iconType']) => {
    switch (type) {
      case 'order':
        return <Package className="w-5 h-5 text-orange-500" />;
      case 'coin':
        return <Coins className="w-5 h-5 text-amber-400" />;
      case 'demand':
        return <AlertCircle className="w-5 h-5 text-sky-500" />;
      case 'discount':
        return <Tag className="w-5 h-5 text-emerald-500" />;
      default:
        return <Bell className="w-5 h-5 text-[var(--pm-accent)]" />;
    }
  };

  const handleNotificationClick = (notif: AppNotification) => {
    markAsRead(notif.id);
    if (notif.link) {
      closeDrawer();
      navigate(notif.link);
    }
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-50 overflow-hidden flex justify-end">
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={closeDrawer}
            className="fixed inset-0 bg-black/60 backdrop-blur-sm transition-opacity"
          />

          {/* Drawer container */}
          <motion.div
            initial={{ x: '100%' }}
            animate={{ x: 0 }}
            exit={{ x: '100%' }}
            transition={{ type: 'spring', damping: 25, stiffness: 200 }}
            className="relative w-full max-w-md bg-[var(--pm-surface)] h-full shadow-2xl flex flex-col border-l border-[var(--pm-border)] z-10"
          >
            {/* Header */}
            <div className="p-4 border-b border-[var(--pm-border)] flex items-center justify-between">
              <div className="flex items-center gap-2.5">
                <div className="w-9 h-9 rounded-xl bg-[var(--pm-accent)]/10 flex items-center justify-center text-[var(--pm-accent)]">
                  <Bell className="w-5 h-5" />
                </div>
                <div>
                  <h2 className="font-bold text-base text-[var(--pm-text)]">বিজ্ঞপ্তি (Notifications)</h2>
                  <p className="text-[11px] text-[var(--pm-text-muted)]">আপনার সাম্প্রতিক সব আপডেট</p>
                </div>
              </div>

              <div className="flex items-center gap-2">
                <button
                  onClick={markAllAsRead}
                  title="সব পঠিত করুন"
                  className="p-2 text-xs text-[var(--pm-accent)] hover:bg-[var(--pm-surface-hover)] rounded-lg flex items-center gap-1 font-medium transition-colors"
                >
                  <CheckCheck className="w-4 h-4" />
                  <span className="hidden sm:inline">সব পঠিত</span>
                </button>
                <button
                  onClick={closeDrawer}
                  className="p-2 text-[var(--pm-text-muted)] hover:text-[var(--pm-text)] rounded-full hover:bg-[var(--pm-surface-hover)] transition-colors"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>
            </div>

            {/* Filter Tabs */}
            <div className="flex gap-1 p-2 bg-[var(--pm-bg)] border-b border-[var(--pm-border)] text-xs font-semibold overflow-x-auto hide-scrollbar">
              {[
                { id: 'all', label: 'সব' },
                { id: 'orders', label: 'অর্ডারস' },
                { id: 'demands', label: 'ডিমান্ড' },
                { id: 'offers', label: 'অফার' },
              ].map((tab) => (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id as any)}
                  className={`px-3 py-1.5 rounded-lg transition-all shrink-0 ${
                    activeTab === tab.id
                      ? 'bg-[var(--pm-accent)] text-white shadow-sm'
                      : 'text-[var(--pm-text-muted)] hover:text-[var(--pm-text)] hover:bg-[var(--pm-surface)]'
                  }`}
                >
                  {tab.label}
                </button>
              ))}
            </div>

            {/* Notifications List */}
            <div className="flex-1 overflow-y-auto divide-y divide-[var(--pm-border)]/50 p-2 space-y-1">
              {filtered.length === 0 ? (
                <div className="flex flex-col items-center justify-center h-64 text-center p-6 text-[var(--pm-text-muted)]">
                  <Bell className="w-12 h-12 stroke-[1.2] mb-3 opacity-40 text-[var(--pm-accent)]" />
                  <p className="font-bold text-sm">কোনো বিজ্ঞপ্তি নেই</p>
                  <p className="text-xs mt-1">নতুন আপডেট আসলে আপনি এখানে তা দেখতে পাবেন।</p>
                </div>
              ) : (
                filtered.map((item) => (
                  <div
                    key={item.id}
                    onClick={() => handleNotificationClick(item)}
                    className={`p-3 rounded-xl cursor-pointer transition-all flex items-start gap-3 group relative ${
                      item.isRead
                        ? 'bg-transparent hover:bg-[var(--pm-surface-hover)]'
                        : 'bg-[var(--pm-accent)]/5 border border-[var(--pm-accent)]/20 hover:bg-[var(--pm-accent)]/10'
                    }`}
                  >
                    <div className="w-10 h-10 rounded-xl bg-[var(--pm-surface)] border border-[var(--pm-border)] flex items-center justify-center shrink-0 shadow-sm mt-0.5">
                      {getIcon(item.iconType)}
                    </div>

                    <div className="flex-1 min-w-0">
                      <div className="flex items-center justify-between gap-2">
                        <h4 className={`text-xs font-bold truncate ${item.isRead ? 'text-[var(--pm-text)]' : 'text-[var(--pm-accent)]'}`}>
                          {item.title}
                        </h4>
                        <span className="text-[10px] text-[var(--pm-text-muted)] shrink-0">{item.time}</span>
                      </div>
                      <p className="text-[11px] text-[var(--pm-text-muted)] leading-relaxed mt-1 line-clamp-2">
                        {item.message}
                      </p>
                    </div>

                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        removeNotification(item.id);
                      }}
                      title="মুছুন"
                      className="opacity-0 group-hover:opacity-100 p-1 text-[var(--pm-text-muted)] hover:text-red-500 rounded-md transition-opacity"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </div>
                ))
              )}
            </div>

            {/* Bottom Action Footer */}
            <div className="p-3 border-t border-[var(--pm-border)] bg-[var(--pm-bg)] flex items-center justify-between text-xs">
              <span className="text-[var(--pm-text-muted)]">
                অপঠিত: {notifications.filter((n) => !n.isRead).length} টি
              </span>
              <button
                onClick={() => {
                  closeDrawer();
                  navigate('/settings');
                }}
                className="text-[var(--pm-accent)] font-semibold hover:underline flex items-center gap-1"
              >
                বিজ্ঞপ্তি সেটিংস
                <ChevronRight className="w-3.5 h-3.5" />
              </button>
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
};
