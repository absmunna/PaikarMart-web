import React from 'react';
import { useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'motion/react';
import { formatDistanceToNow } from 'date-fns';
import { bn } from 'date-fns/locale';
import { 
  Bell, 
  ShoppingBag, 
  Store, 
  Package, 
  Tag, 
  ShieldAlert, 
  Check, 
  Trash2, 
  ChevronRight, 
  CreditCard,
  BellOff,
  UserCheck,
  Zap,
  BadgeCheck,
  TrendingUp,
  Cpu
} from 'lucide-react';
import { useNotifications, NotificationItem, UserRoleType } from './useNotifications';
import { cn } from '@/lib/utils';
import { toast } from 'sonner';

export interface NotificationListProps {
  /** Optional fixed filter lock ('buyer', 'seller', 'system', 'all') */
  roleFilter?: UserRoleType;
  /** Whether to render top category tab buttons for Buyer / Seller / System switching */
  showTabs?: boolean;
  /** Compact rendering mode for drawers/popovers */
  compact?: boolean;
  /** Custom click handler override for notifications */
  onNotificationClick?: (notification: NotificationItem) => void;
  /** Optional max items to render */
  maxItems?: number;
  /** Whether to show clear / mark all read header action buttons */
  showActions?: boolean;
  /** Additional CSS class names */
  className?: string;
}

export const NotificationList: React.FC<NotificationListProps> = ({
  roleFilter: initialRoleFilter,
  showTabs = true,
  compact = false,
  onNotificationClick,
  maxItems,
  showActions = true,
  className
}) => {
  const navigate = useNavigate();
  const {
    notifications,
    buyerNotifications,
    sellerNotifications,
    systemNotifications,
    filteredNotifications,
    unreadCount,
    buyerUnreadCount,
    sellerUnreadCount,
    systemUnreadCount,
    isLoading,
    activeRoleFilter,
    setActiveRoleFilter,
    markAsRead,
    markAllAsRead,
    deleteNotification,
    clearAll
  } = useNotifications();

  // If a role filter prop is locked, sync state
  const activeTab = initialRoleFilter || activeRoleFilter;

  const currentList = React.useMemo(() => {
    let list = filteredNotifications;
    if (initialRoleFilter) {
      if (initialRoleFilter === 'buyer') list = buyerNotifications;
      else if (initialRoleFilter === 'seller') list = sellerNotifications;
      else if (initialRoleFilter === 'system') list = systemNotifications;
      else list = notifications;
    }
    return maxItems ? list.slice(0, maxItems) : list;
  }, [filteredNotifications, initialRoleFilter, buyerNotifications, sellerNotifications, systemNotifications, notifications, maxItems]);

  const handleItemClick = (item: NotificationItem) => {
    if (!item.read) {
      markAsRead(item.id);
    }
    if (onNotificationClick) {
      onNotificationClick(item);
    } else if (item.link) {
      navigate(item.link);
    }
  };

  const handleDelete = (e: React.MouseEvent, id: string) => {
    e.stopPropagation();
    deleteNotification(id);
    toast.success('নোটিফিকেশন মুছে ফেলা হয়েছে');
  };

  const getNotificationIcon = (type: string, category: string) => {
    switch (type) {
      case 'new_order':
      case 'order_created':
        return <Package className="w-5 h-5 text-emerald-400" />;
      case 'order_shipped':
      case 'order_status':
        return <ShoppingBag className="w-5 h-5 text-cyan-400" />;
      case 'new_bid':
        return <Cpu className="w-5 h-5 text-amber-400" />;
      case 'bid_accepted':
        return <BadgeCheck className="w-5 h-5 text-emerald-400" />;
      case 'wallet_credit':
      case 'wallet_update':
        return <CreditCard className="w-5 h-5 text-purple-400" />;
      case 'promo':
      case 'discount':
        return <Tag className="w-5 h-5 text-rose-400" />;
      case 'security':
        return <ShieldAlert className="w-5 h-5 text-red-400" />;
      default:
        if (category === 'selling') return <Store className="w-5 h-5 text-emerald-400" />;
        if (category === 'buying') return <ShoppingBag className="w-5 h-5 text-cyan-400" />;
        return <Bell className="w-5 h-5 text-amber-400" />;
    }
  };

  const getRoleBadge = (category: string, targetRole?: string) => {
    const isSeller = category === 'selling' || targetRole === 'seller';
    const isBuyer = category === 'buying' || targetRole === 'buyer';

    if (isSeller) {
      return (
        <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[9px] font-extrabold bg-emerald-500/15 text-emerald-400 border border-emerald-500/30">
          <Store className="w-2.5 h-2.5" />
          বিক্রেতা (Seller)
        </span>
      );
    }

    if (isBuyer) {
      return (
        <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[9px] font-extrabold bg-cyan-500/15 text-cyan-400 border border-cyan-500/30">
          <ShoppingBag className="w-2.5 h-2.5" />
          ক্রেতা (Buyer)
        </span>
      );
    }

    return (
      <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[9px] font-extrabold bg-purple-500/15 text-purple-400 border border-purple-500/30">
        <Zap className="w-2.5 h-2.5" />
        সিস্টেম (System)
      </span>
    );
  };

  const formatTimestamp = (dateStr: string) => {
    try {
      const date = new Date(dateStr);
      return formatDistanceToNow(date, { addSuffix: true, locale: bn });
    } catch {
      return 'সম্প্রতি';
    }
  };

  return (
    <div className={cn("w-full space-y-3 select-none", className)}>
      {/* Optional Top Tabs for Buyer / Seller / System switching */}
      {showTabs && !initialRoleFilter && (
        <div className="flex items-center gap-1.5 p-1 bg-[var(--pm-surface,#181c24)] border border-[var(--pm-border,#262c36)] rounded-2xl shadow-inner">
          {[
            { id: 'all', label: 'সকল (All)', count: unreadCount, color: 'text-white' },
            { id: 'buyer', label: 'ক্রয় (Buyer)', count: buyerUnreadCount, color: 'text-cyan-400' },
            { id: 'seller', label: 'বিক্রয় (Seller)', count: sellerUnreadCount, color: 'text-emerald-400' },
            { id: 'system', label: 'সিস্টেম', count: systemUnreadCount, color: 'text-purple-400' },
          ].map((tab) => {
            const isActive = activeTab === tab.id;
            return (
              <button
                key={tab.id}
                onClick={() => setActiveRoleFilter(tab.id as UserRoleType)}
                className={cn(
                  "flex-1 py-2 px-1.5 rounded-xl text-[10px] font-extrabold transition-all relative flex items-center justify-center gap-1 cursor-pointer",
                  isActive
                    ? "bg-[var(--pm-accent,#ff6b00)] text-white shadow-md scale-[1.02]"
                    : "text-white/60 hover:text-white hover:bg-white/5"
                )}
              >
                <span className="truncate">{tab.label}</span>
                {tab.count > 0 && (
                  <span className={cn(
                    "flex items-center justify-center min-w-[14px] h-3.5 px-1 rounded-full text-[8px] font-black",
                    isActive ? "bg-white text-[var(--pm-accent,#ff6b00)]" : "bg-rose-500 text-white"
                  )}>
                    {tab.count}
                  </span>
                )}
              </button>
            );
          })}
        </div>
      )}

      {/* Header Actions */}
      {showActions && currentList.length > 0 && (
        <div className="flex items-center justify-between px-1 py-0.5">
          <span className="text-[11px] font-bold text-white/50">
            {currentList.length} টি নোটিফিকেশন
          </span>
          <div className="flex items-center gap-2">
            <button
              onClick={() => markAllAsRead(activeTab)}
              className="flex items-center gap-1 text-[11px] font-bold text-[var(--pm-accent,#ff6b00)] hover:underline cursor-pointer"
            >
              <Check className="w-3.5 h-3.5" />
              সব পড়ুন
            </button>
            <span className="text-white/20">|</span>
            <button
              onClick={() => clearAll(activeTab)}
              className="flex items-center gap-1 text-[11px] font-bold text-white/40 hover:text-rose-400 cursor-pointer"
            >
              <Trash2 className="w-3.5 h-3.5" />
              মুছুন
            </button>
          </div>
        </div>
      )}

      {/* Notification List Content */}
      <div className="space-y-2">
        {isLoading ? (
          <div className="space-y-2.5">
            {Array.from({ length: 4 }).map((_, i) => (
              <div key={i} className="h-16 bg-white/5 rounded-2xl animate-pulse" />
            ))}
          </div>
        ) : (
          <AnimatePresence mode="popLayout">
            {currentList.length > 0 ? (
              currentList.map((item) => {
                const isUnread = !item.read && !item.isRead;
                return (
                  <motion.div
                    key={item.id}
                    initial={{ opacity: 0, y: 8 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, scale: 0.96 }}
                    onClick={() => handleItemClick(item)}
                    className={cn(
                      "group rounded-2xl border transition-all flex gap-3 cursor-pointer relative",
                      compact ? "p-3" : "p-4",
                      isUnread
                        ? "bg-white/[0.06] border-[var(--pm-accent,#ff6b00)]/40 shadow-md shadow-[var(--pm-accent,#ff6b00)]/5"
                        : "bg-white/[0.02] border-white/[0.06] hover:bg-white/[0.04]"
                    )}
                  >
                    {/* Unread Indicator Pulse Dot */}
                    {isUnread && (
                      <div className="absolute top-3.5 right-3.5 w-2 h-2 rounded-full bg-[var(--pm-accent,#ff6b00)] animate-pulse shadow-[0_0_8px_var(--pm-accent,#ff6b00)]" />
                    )}

                    {/* Actor Avatar / Category Icon */}
                    <div className="flex-shrink-0">
                      {item.actorAvatarUrl ? (
                        <img 
                          src={item.actorAvatarUrl} 
                          alt="Avatar" 
                          className="w-10 h-10 rounded-xl object-cover border border-white/10" 
                        />
                      ) : (
                        <div className="w-10 h-10 rounded-xl bg-[var(--pm-surface,#181c24)] border border-white/10 flex items-center justify-center shadow-inner">
                          {getNotificationIcon(item.type, item.category)}
                        </div>
                      )}
                    </div>

                    {/* Main Text Content */}
                    <div className="flex-1 min-w-0 pr-4">
                      <div className="flex items-center gap-2 mb-1 flex-wrap">
                        {getRoleBadge(item.category, item.targetRole)}
                        <span className="text-[10px] text-white/40 font-semibold">
                          {formatTimestamp(item.createdAt)}
                        </span>
                      </div>

                      <h4 className={cn(
                        "text-xs leading-tight mb-0.5 truncate",
                        isUnread ? "font-black text-white" : "font-bold text-white/80"
                      )}>
                        {item.title}
                      </h4>

                      <p className="text-[11px] text-white/60 leading-relaxed font-semibold line-clamp-2">
                        {item.body || item.message}
                      </p>
                    </div>

                    {/* Right Action Trigger */}
                    <div className="flex flex-col items-end justify-between flex-shrink-0 self-stretch">
                      <button
                        onClick={(e) => handleDelete(e, item.id)}
                        className="p-1 rounded-lg text-white/20 hover:text-rose-400 hover:bg-rose-500/10 transition-all opacity-0 group-hover:opacity-100 cursor-pointer"
                        title="মুছুন"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                      {item.link && (
                        <ChevronRight className="w-4 h-4 text-white/30 group-hover:text-[var(--pm-accent,#ff6b00)] transition-colors" />
                      )}
                    </div>
                  </motion.div>
                );
              })
            ) : (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="py-12 text-center"
              >
                <div className="w-12 h-12 rounded-2xl bg-white/5 border border-white/10 flex items-center justify-center mx-auto mb-3">
                  <BellOff className="w-6 h-6 text-white/30" />
                </div>
                <h4 className="text-xs font-black text-white">কোনো নোটিফিকেশন নেই</h4>
                <p className="text-[10px] text-white/40 max-w-[200px] mx-auto mt-1 font-semibold">
                  নতুন কোনো আপডেট বা অ্যালার্ট আসলে এখানে দেখতে পাবেন।
                </p>
              </motion.div>
            )}
          </AnimatePresence>
        )}
      </div>
    </div>
  );
};

export default NotificationList;
