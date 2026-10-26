import React from 'react';
import { Bell, X, Info, AlertTriangle, CheckCircle2, MessageSquare, Tag, ShieldAlert } from 'lucide-react';
import { cn } from '@/lib/utils';
import { motion, AnimatePresence } from 'motion/react';
import { useNotificationStore, UserNotificationCategory } from '@/modules/notification/notificationStore';
import { formatDistanceToNow } from 'date-fns';
import { useNavigate } from 'react-router-dom';

export const GlobalNotificationCenter: React.FC<{ isOpen: boolean; onClose: () => void }> = ({ isOpen, onClose }) => {
  const { notifications, unreadCount, markAsRead, clearAll } = useNotificationStore();
  const navigate = useNavigate();

  if (!isOpen) return null;

  const handleNotificationClick = (id: string, url?: string) => {
    markAsRead(id);
    if (url) {
      navigate(url);
      onClose();
    }
  };

  const getIcon = (type: UserNotificationCategory) => {
    switch (type) {
      case 'order': return <CheckCircle2 className="w-4 h-4" />;
      case 'b2b': return <MessageSquare className="w-4 h-4" />;
      case 'promo': return <Tag className="w-4 h-4" />;
      case 'security': return <ShieldAlert className="w-4 h-4" />;
      default: return <Info className="w-4 h-4" />;
    }
  };

  const getColorClass = (type: UserNotificationCategory) => {
    switch (type) {
      case 'order': return "bg-[var(--pm-accent)]/10 text-[var(--pm-accent)]";
      case 'security': return "bg-rose-500/10 text-rose-400";
      case 'b2b': return "bg-indigo-500/10 text-indigo-400";
      case 'promo': return "bg-amber-500/10 text-amber-400";
      default: return "bg-[var(--pm-accent)]/10 text-[var(--pm-accent)]";
    }
  };

  return (
    <AnimatePresence>
        <motion.div 
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: 20 }}
            className="fixed top-20 right-6 z-[200] w-[360px] max-h-[600px] bg-[var(--pm-bg)] border border-[var(--pm-border)] rounded-2xl shadow-lg overflow-hidden flex flex-col"
        >
            <div className="p-5 border-b border-[var(--pm-border)] flex items-center justify-between">
                <div className="flex items-center gap-2">
                    <Bell className="w-5 h-5 text-[var(--pm-accent)]" />
                    <h3 className="text-sm font-black text-white uppercase tracking-widest leading-none">Notifications</h3>
                    {unreadCount > 0 && (
                      <span className="bg-rose-500 text-white text-[9px] font-black px-1.5 py-0.5 rounded-full ml-1">
                        {unreadCount} NEW
                      </span>
                    )}
                </div>
                <button onClick={onClose} className="p-2 rounded-lg bg-[var(--pm-card)] border border-[var(--pm-border)] hover:text-rose-500 hover:bg-rose-500/10 transition-colors cursor-pointer">
                    <X className="w-4 h-4" />
                </button>
            </div>
            
            <div className="flex-1 overflow-y-auto p-2 max-h-[400px]">
                {notifications.length === 0 ? (
                    <div className="p-12 text-center text-[var(--pm-text-muted)] text-xs font-bold uppercase tracking-widest italic">
                        All clear. No signals.
                    </div>
                ) : (
                    notifications.map((n) => (
                        <div 
                          key={n.id} 
                          onClick={() => handleNotificationClick(n.id, n.actionUrl)}
                          className={cn(
                            "p-4 rounded-2xl hover:bg-white/5 transition-all group cursor-pointer border border-transparent",
                            !n.isRead && "bg-[var(--pm-accent)]/5 border-[var(--pm-accent)]/10"
                        )}>
                            <div className="flex gap-4">
                                <div className={cn("p-2 h-fit rounded-xl", getColorClass(n.type))}>
                                    {getIcon(n.type)}
                                </div>
                                <div className="flex-1">
                                    <h4 className="text-xs font-black text-white tracking-tight mb-1">{n.title}</h4>
                                    <p className="text-[10px] text-[var(--pm-text-muted)] font-bold leading-relaxed">{n.description}</p>
                                    <p className="text-[9px] text-[var(--pm-accent)]/70 font-black mt-2 uppercase">
                                      {formatDistanceToNow(new Date(n.timestamp), { addSuffix: true })}
                                    </p>
                                </div>
                            </div>
                        </div>
                    ))
                )}
            </div>
            <div className="p-4 bg-[var(--pm-card)] border-t border-[var(--pm-border)] flex items-center justify-between">
                <button 
                  onClick={() => { navigate('/notifications'); onClose(); }}
                  className="text-[10px] font-black text-[var(--pm-accent)] uppercase tracking-widest hover:text-white transition-colors"
                >
                  View All
                </button>
                <button 
                  onClick={clearAll}
                  className="text-[10px] font-black text-[var(--pm-text-muted)] uppercase tracking-widest hover:text-rose-400 transition-colors"
                >
                  Clear All
                </button>
            </div>
        </motion.div>
    </AnimatePresence>
  );
};
