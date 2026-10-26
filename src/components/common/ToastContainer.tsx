import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useNotificationStore, NotificationType } from '../../store/notificationStore';
import { CheckCircle, XCircle, Info, AlertTriangle, X } from 'lucide-react';

const icons: Record<NotificationType, React.ReactNode> = {
  success: <CheckCircle className="w-5 h-5 text-emerald-500" />,
  error: <XCircle className="w-5 h-5 text-red-500" />,
  info: <Info className="w-5 h-5 text-blue-500" />,
  warning: <AlertTriangle className="w-5 h-5 text-amber-500" />,
};

const backgrounds: Record<NotificationType, string> = {
  success: 'border-emerald-500/20 bg-emerald-500/10',
  error: 'border-red-500/20 bg-red-500/10',
  info: 'border-blue-500/20 bg-blue-500/10',
  warning: 'border-amber-500/20 bg-amber-500/10',
};

export const ToastContainer = () => {
  const { notifications, removeNotification } = useNotificationStore();

  return (
    <div className="fixed top-4 right-4 z-[9999] flex flex-col gap-2 max-w-sm w-full pointer-events-none">
      <AnimatePresence>
        {notifications.map((notification) => (
          <motion.div
            key={notification.id}
            initial={{ opacity: 0, y: -20, scale: 0.9 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, scale: 0.9, transition: { duration: 0.2 } }}
            className={`pointer-events-auto flex items-start gap-3 p-4 rounded-xl border backdrop-blur-md shadow-lg ${backgrounds[notification.type]}`}
          >
            <div className="shrink-0">{icons[notification.type]}</div>
            <p className="flex-1 text-sm font-medium text-[var(--pm-text)] drop-shadow-sm mt-0.5">
              {notification.message}
            </p>
            <button
              onClick={() => removeNotification(notification.id)}
              className="shrink-0 text-[var(--pm-text-muted)] hover:text-[var(--pm-text)] transition-colors"
            >
              <X className="w-4 h-4" />
            </button>
          </motion.div>
        ))}
      </AnimatePresence>
    </div>
  );
};
