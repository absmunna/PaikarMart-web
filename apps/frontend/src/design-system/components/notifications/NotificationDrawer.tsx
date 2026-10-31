import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Bell, X, ChevronRight } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { NotificationList } from './NotificationList';
import { useNotificationsStore } from '@/modules/notification';

export const NotificationDrawer: React.FC = () => {
  const { isOpen, closeDrawer } = useNotificationsStore();
  const navigate = useNavigate();

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
                  <p className="text-[11px] text-[var(--pm-text-muted)]">আপনার সাম্প্রতিক ক্রয়-বিক্রয় আপডেট</p>
                </div>
              </div>

              <button
                onClick={closeDrawer}
                className="p-2 text-[var(--pm-text-muted)] hover:text-[var(--pm-text)] rounded-full hover:bg-[var(--pm-surface-hover)] transition-colors cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Notifications List using reusable component */}
            <div className="flex-1 overflow-y-auto p-4">
              <NotificationList 
                compact={true} 
                showTabs={true} 
                onNotificationClick={() => closeDrawer()} 
              />
            </div>

            {/* Bottom Action Footer */}
            <div className="p-3 border-t border-[var(--pm-border)] bg-[var(--pm-bg)] flex items-center justify-between text-xs">
              <button
                onClick={() => {
                  closeDrawer();
                  navigate('/notifications');
                }}
                className="text-[var(--pm-accent)] font-semibold hover:underline flex items-center gap-1 cursor-pointer"
              >
                সকল নোটিফিকেশন দেখুন
                <ChevronRight className="w-3.5 h-3.5" />
              </button>
              <button
                onClick={() => {
                  closeDrawer();
                  navigate('/settings/notifications');
                }}
                className="text-white/40 hover:text-white transition-colors cursor-pointer text-[11px]"
              >
                নোটিফিকেশন সেটিংস
              </button>
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
};

export default NotificationDrawer;
