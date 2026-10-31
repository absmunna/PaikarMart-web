import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { motion, AnimatePresence } from "motion/react";
import { formatDistanceToNow } from "date-fns";
import { 
  collection, 
  query, 
  where, 
  onSnapshot, 
  orderBy, 
  doc, 
  updateDoc, 
  deleteDoc,
  writeBatch
} from "firebase/firestore";
import { db, auth } from "@/core/lib/firebase";
import { 
  Bell, 
  ShoppingBag, 
  Cpu, 
  ArrowLeft, 
  Check, 
  Trash2, 
  ShieldAlert, 
  Tag, 
  ChevronRight,
  MessageCircle,
  BellOff,
  Settings,
  CreditCard
} from "lucide-react";
import { toast } from "sonner";
import { safeBack } from "@/lib/navigation";
import { cn } from "@/lib/utils";
import { api } from "@/core/lib/api";

interface NotificationItem {
  id: string;
  type: string;
  category: "buying" | "selling" | "system";
  title: string;
  body: string;
  link?: string;
  actorAvatarUrl?: string;
  read: boolean;
  createdAt: any;
}

export default function Notifications() {
  const navigate = useNavigate();
  const [notifications, setNotifications] = useState<NotificationItem[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [activeTab, setActiveTab] = useState<"buying" | "selling" | "system">("buying");

  useEffect(() => {
    let isMounted = true;

    const loadNotifications = async () => {
      try {
        const res: any = await api.get("/notifications");
        if (isMounted && res && Array.isArray(res.notifications) && res.notifications.length > 0) {
          setNotifications(res.notifications);
        }
      } catch (err) {
        console.warn("Backend notifications API fetch error, falling back to local/Firestore", err);
      } finally {
        if (isMounted) setIsLoading(false);
      }
    };

    loadNotifications();

    if (auth?.currentUser) {
      try {
        const q = query(
          collection(db, "notifications"),
          where("userId", "==", auth.currentUser.uid),
          orderBy("createdAt", "desc")
        );

        const unsubscribe = onSnapshot(q, (snapshot) => {
          if (isMounted && !snapshot.empty) {
            const docs = snapshot.docs.map(doc => ({
              id: doc.id,
              ...doc.data()
            })) as NotificationItem[];
            setNotifications(docs);
          }
          if (isMounted) setIsLoading(false);
        }, (error) => {
          console.warn("Firestore Notifications listener info:", error);
        });

        return () => {
          isMounted = false;
          unsubscribe();
        };
      } catch (err) {
        console.warn("Firestore listener init failed", err);
      }
    }
    return () => { isMounted = false; };
  }, []);

  const handleMarkAllRead = async () => {
    setNotifications(prev => prev.map(n => n.category === activeTab ? { ...n, read: true } : n));
    try {
      await api.patch('/notifications/read-all', { category: activeTab }).catch(() => {});
      if (auth?.currentUser) {
        const batch = writeBatch(db);
        const unreadNotifs = notifications.filter(n => !n.read && n.category === activeTab);
        unreadNotifs.forEach(n => {
          const ref = doc(db, "notifications", n.id);
          batch.update(ref, { read: true });
        });
        await batch.commit().catch(() => {});
      }
      toast.success("সবগুলো পড়া হয়েছে বলে চিহ্নিত করা হয়েছে!");
    } catch (error) {
      toast.error("ত্রুটি ঘটেছে। আবার চেষ্টা করুন।");
    }
  };

  const handleClearAll = async () => {
    setNotifications(prev => prev.filter(n => n.category !== activeTab));
    try {
      await api.delete('/notifications/clear-all').catch(() => {});
      if (auth?.currentUser) {
        const batch = writeBatch(db);
        const tabNotifs = notifications.filter(n => n.category === activeTab);
        tabNotifs.forEach(n => {
          const ref = doc(db, "notifications", n.id);
          batch.delete(ref);
        });
        await batch.commit().catch(() => {});
      }
      toast.success("এই ক্যাটাগরির সব নোটিফিকেশন মুছে ফেলা হয়েছে!");
    } catch (error) {
      toast.error("মুছে ফেলতে সমস্যা হয়েছে।");
    }
  };

  const handleItemClick = async (item: NotificationItem) => {
    if (!item.read) {
      setNotifications(prev => prev.map(n => n.id === item.id ? { ...n, read: true } : n));
      try {
        await api.patch(`/notifications/${item.id}/read`).catch(() => {});
        if (auth?.currentUser) {
          await updateDoc(doc(db, "notifications", item.id), { read: true }).catch(() => {});
        }
      } catch (error) {
        console.error("Update read status failed:", error);
      }
    }
    
    if (item.link) {
      navigate(item.link);
    }
  };

  const handleDeleteItem = async (e: React.MouseEvent, id: string) => {
    e.stopPropagation();
    setNotifications(prev => prev.filter(n => n.id !== id));
    try {
      await api.delete(`/notifications/${id}`).catch(() => {});
      if (auth?.currentUser) {
        await deleteDoc(doc(db, "notifications", id)).catch(() => {});
      }
      toast.success("মুছে ফেলা হয়েছে।");
    } catch (error) {
      toast.error("মুছে ফেলতে ব্যর্থ হয়েছে।");
    }
  };

  const filteredNotifications = notifications.filter(n => n.category === activeTab);
  const unreadCount = notifications.filter(n => !n.read).length;

  const getIcon = (type: string) => {
    switch (type) {
      case "order_update":
      case "order":
        return <ShoppingBag className="w-5 h-5 text-cyan-500" />;
      case "new_bid":
      case "bid":
        return <Cpu className="w-5 h-5 text-amber-500" />;
      case "promo":
      case "offer":
        return <Tag className="w-5 h-5 text-rose-500" />;
      case "security":
        return <ShieldAlert className="w-5 h-5 text-red-500" />;
      case "chat":
      case "message":
        return <MessageCircle className="w-5 h-5 text-sky-500" />;
      case "wallet":
      case "payment":
        return <CreditCard className="w-5 h-5 text-emerald-500" />;
      default:
        return <Bell className="w-5 h-5 text-white/70" />;
    }
  };

  const formatNotificationTime = (createdAt: any) => {
    if (!createdAt) return "সম্প্রতি";
    const date = typeof createdAt.toDate === 'function' ? createdAt.toDate() : new Date(createdAt);
    return formatDistanceToNow(date, { addSuffix: true });
  };

  return (
    <div className="bg-[var(--pm-bg)] min-h-screen pb-32 pt-4 select-none">
      <div className="max-w-[480px] mx-auto px-4 mb-4 pt-2">
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center gap-3">
            <button 
              onClick={() => safeBack(navigate, '/')} 
              className="w-10 h-10 flex items-center justify-center rounded-2xl bg-[var(--pm-surface)] border border-[var(--pm-border)] hover:bg-[var(--pm-surface-hover)] active:scale-95 transition-all text-white/80 cursor-pointer"
            >
              <ArrowLeft className="w-5 h-5" strokeWidth={2.5} />
            </button>
            <div>
              <h1 className="text-xl font-black text-white tracking-tight">নোটিফিকেশন</h1>
              <p className="text-[10px] text-[var(--pm-accent)] font-bold uppercase tracking-widest">Update Center</p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            {filteredNotifications.length > 0 && (
              <>
                <button
                  onClick={handleMarkAllRead}
                  className="w-9 h-9 flex items-center justify-center rounded-xl text-[var(--pm-accent)] bg-[var(--pm-accent)]/10 border border-[var(--pm-accent)]/20 hover:bg-[var(--pm-accent)]/20 transition-all cursor-pointer"
                  title="সব পড়ুন"
                >
                  <Check className="w-4 h-4" strokeWidth={3} />
                </button>
                <button
                  onClick={handleClearAll}
                  className="w-9 h-9 flex items-center justify-center rounded-xl text-white/40 border border-white/10 hover:text-red-400 hover:bg-red-500/10 transition-all cursor-pointer"
                  title="সব মুছুন"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </>
            )}
            <button
              onClick={() => navigate('/settings/notifications')}
              className="w-9 h-9 flex items-center justify-center rounded-xl text-white/60 border border-white/10 hover:text-[var(--pm-accent)] hover:bg-white/10 transition-all cursor-pointer"
            >
              <Settings className="w-4 h-4" />
            </button>
          </div>
        </div>
      </div>

      <div className="max-w-[480px] mx-auto px-4">
        {/* Role-Based Tabs with Counts */}
        <div className="flex items-center gap-2 p-1 bg-[var(--pm-surface)] border border-[var(--pm-border)] rounded-2xl mb-4 shadow-inner">
          {[
            { id: "buying", label: "ক্রয় (Buying)" },
            { id: "selling", label: "বিক্রয় (Selling)" },
            { id: "system", label: "সিস্টেম (System)" },
          ].map((tab) => {
            const isActive = activeTab === tab.id;
            const count = notifications.filter(n => n.category === tab.id && !n.read).length;
            
            return (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id as any)}
                className={cn(
                  "flex-1 py-2.5 rounded-xl text-[10px] font-black transition-all relative flex items-center justify-center gap-1.5",
                  isActive 
                    ? "bg-[var(--pm-accent)] text-white shadow-lg" 
                    : "text-white/50 hover:text-white hover:bg-white/5"
                )}
              >
                <span>{tab.label}</span>
                {count > 0 && (
                  <span className={cn(
                    "flex items-center justify-center min-w-[16px] h-4 px-1 rounded-full text-[8px] font-black",
                    isActive ? "bg-white text-[var(--pm-accent)]" : "bg-rose-500 text-white"
                  )}>
                    {count}
                  </span>
                )}
              </button>
            );
          })}
        </div>

        {/* List */}
        <div className="space-y-2.5">
          {isLoading ? (
            <div className="space-y-3">
              {Array.from({ length: 5 }).map((_, i) => (
                <div key={i} className="h-20 bg-white/5 rounded-2xl animate-pulse" />
              ))}
            </div>
          ) : (
            <AnimatePresence mode="popLayout">
              {filteredNotifications.length > 0 ? (
                filteredNotifications.map((item) => (
                  <motion.div
                    key={item.id}
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, scale: 0.95 }}
                    onClick={() => handleItemClick(item)}
                    className={cn(
                      "group p-4 rounded-2xl border transition-all flex gap-3.5 cursor-pointer relative",
                      item.read 
                        ? "bg-white/[0.02] border-white/[0.05] hover:bg-white/[0.04]" 
                        : "bg-white/[0.05] border-[var(--pm-accent)]/30 shadow-lg shadow-[var(--pm-accent)]/5"
                    )}
                  >
                    {!item.read && (
                      <div className="absolute top-4 right-4 w-2 h-2 rounded-full bg-[var(--pm-accent)] animate-pulse shadow-[0_0_8px_var(--pm-accent)]" />
                    )}

                    <div className="flex-shrink-0 w-11 h-11 rounded-xl bg-[var(--pm-surface)] border border-white/10 flex items-center justify-center shadow-inner">
                      {getIcon(item.type)}
                    </div>

                    <div className="flex-1 min-w-0">
                      <h3 className={cn(
                        "text-sm leading-tight mb-1",
                        item.read ? "font-bold text-white/80" : "font-black text-white"
                      )}>
                        {item.title}
                      </h3>
                      <p className="text-[11px] text-white/50 leading-relaxed font-semibold line-clamp-2">
                        {item.body}
                      </p>
                      <div className="flex items-center gap-2 mt-2">
                        <span className="text-[9px] text-[var(--pm-accent)] font-black uppercase tracking-wider">
                          {formatNotificationTime(item.createdAt)}
                        </span>
                      </div>
                    </div>

                    <div className="flex flex-col items-end justify-between flex-shrink-0 self-stretch">
                      <button
                        onClick={(e) => handleDeleteItem(e, item.id)}
                        className="p-1.5 rounded-lg text-white/20 hover:text-rose-400 hover:bg-rose-500/10 transition-all opacity-0 group-hover:opacity-100"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                      {item.link && (
                        <ChevronRight className="w-4 h-4 text-white/20 group-hover:text-[var(--pm-accent)] transition-colors" />
                      )}
                    </div>
                  </motion.div>
                ))
              ) : (
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  className="py-20 text-center"
                >
                  <div className="w-16 h-16 rounded-3xl bg-white/5 border border-white/10 flex items-center justify-center mx-auto mb-5">
                    <BellOff className="w-7 h-7 text-white/20" strokeWidth={1.5} />
                  </div>
                  <h3 className="text-sm font-black text-white">কোনো নোটিফিকেশন নেই</h3>
                  <p className="text-[11px] text-white/40 max-w-[220px] mx-auto mt-2 leading-relaxed font-bold">
                    আপনার {activeTab === 'buying' ? 'ক্রয়' : activeTab === 'selling' ? 'বিক্রয়' : 'সিস্টেম'} সংক্রান্ত সকল আপডেট এখানে দেখা যাবে।
                  </p>
                </motion.div>
              )}
            </AnimatePresence>
          )}
        </div>
      </div>
    </div>
  );
}
