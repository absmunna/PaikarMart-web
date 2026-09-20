import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { motion, AnimatePresence } from "motion/react";
// Removed useListNotifications from @/modules/app/api/client/hooks
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
  BellOff
} from "lucide-react";
import { toast } from "sonner";
import { cn } from "@/lib/utils";

interface NotificationItem {
  id: string;
  type: "order" | "promo" | "security" | "b2b" | "chat";
  title: string;
  description: string;
  timestamp: string;
  isRead: boolean;
  actionUrl?: string;
}

const INITIAL_MOCK_NOTIFICATIONS: NotificationItem[] = [
  {
    id: "notif-1",
    type: "order",
    title: "অর্ডার সফলভাবে পাঠানো হয়েছে!",
    description: "আপনার Afnan Electronics থেকে করা অর্ডার #PM-89241 লজিস্টিক পার্টনারের কাছে হস্তান্তর করা হয়েছে। ঢাকা পৌঁছাবে আগামীকাল।",
    timestamp: "২ মিনিট আগে",
    isRead: false,
    actionUrl: "/orders/PM-89241"
  },
  {
    id: "notif-2",
    type: "b2b",
    title: "নতুন B2B ডিমান্ড ম্যাচ পাওয়া গেছে!",
    description: "১০০০ পিস সুতি শাড়ির জন্য আপনার সোর্সিং ম্যাচিং রেজাল্ট প্রস্তুত। এখনই কোটেশন সাবমিট করুন।",
    timestamp: "২৫ মিনিট আগে",
    isRead: false,
    actionUrl: "/b2b"
  },
  {
    id: "notif-3",
    type: "chat",
    title: "TechZone Official থেকে নতুন মেসেজ",
    description: "\"ভাইয়া, আপনার পছন্দের কালারটি স্টকে চলে এসেছে। অর্ডার করতে ক্লিক করুন।\"",
    timestamp: "১ ঘণ্টা আগে",
    isRead: false,
    actionUrl: "/messages"
  },
  {
    id: "notif-4",
    type: "promo",
    title: "৫০% পর্যন্ত মেগা ক্যাশব্যাক অফার! 💥",
    description: "শুধুমাত্র আজকের জন্য রিটেইল কার্ট পেমেন্টে পাচ্ছেন আকর্ষণীয় ফ্লাশ ডিসকাউন্ট অফার।",
    timestamp: "৪ ঘণ্টা আগে",
    isRead: true,
    actionUrl: "/marketplace"
  },
  {
    id: "notif-5",
    type: "security",
    title: "নতুন ডিভাইস থেকে লগইন ডিটেক্টেড",
    description: "Chrome Browser on Windows (Dhaka) থেকে আপনার অ্যাকাউন্টে সাকসেসফুল লগইন হয়েছে।",
    timestamp: "১ দিন আগে",
    isRead: true
  },
  {
    id: "notif-6",
    type: "order",
    title: "পেমেন্ট সফল হয়েছে",
    description: "অর্ডার #PM-87102 এর জন্য ৪,৫০০ টাকা পেমেন্ট নিশ্চিত করা হয়েছে। ধন্যবাদ।",
    timestamp: "২ দিন আগে",
    isRead: true,
    actionUrl: "/orders/PM-87102"
  }
];

export default function Notifications() {
  const navigate = useNavigate();
  
  // Real Backend Data Fetching (Disabled for now)
  const dbNotifications: any[] = [];
  const isDbLoading = false;

  // Local state for fallback notifications & deletion tracking
  const [localNotifs, setLocalNotifs] = useState<NotificationItem[]>(INITIAL_MOCK_NOTIFICATIONS);
  const [deletedIds, setDeletedIds] = useState<Set<string>>(new Set());
  const [readIds, setReadIds] = useState<Set<string>>(new Set());
  const [activeTab, setActiveTab] = useState<"all" | "order" | "b2b" | "promo" | "security">("all");

  // Merge & Normalise real database entries and mock items seamlessly
  const parsedDbNotifications: NotificationItem[] = (dbNotifications || []).map((n: any) => ({
    id: n.id || String(Math.random()),
    type: (n.type === "review" || n.type === "message" || n.type === "delivery" || n.type === "system")
      ? (n.type === "message" ? "chat" : "order") 
      : (n.type || "order"),
    title: n.title || "নতুন নোটিফিকেশন",
    description: n.body || n.message || "",
    timestamp: n.createdAt ? new Date(n.createdAt).toLocaleTimeString("bn-BD", { hour: '2-digit', minute: '2-digit' }) : "সম্প্রতি",
    isRead: n.read || false,
    actionUrl: n.link || undefined
  }));

  // Create complete combined list
  const combinedNotifications = [
    ...parsedDbNotifications.filter(n => !deletedIds.has(n.id)),
    ...localNotifs.filter(n => !deletedIds.has(n.id) && !parsedDbNotifications.some(dbN => dbN.id === n.id))
  ].map(n => ({
    ...n,
    isRead: readIds.has(n.id) ? true : n.isRead
  }));

  const unreadCount = combinedNotifications.filter(n => !n.isRead).length;

  const handleMarkAllRead = () => {
    const updatedReadIds = new Set(readIds);
    combinedNotifications.forEach(n => updatedReadIds.add(n.id));
    setReadIds(updatedReadIds);
    setLocalNotifs(prev => prev.map(n => ({ ...n, isRead: true })));
    toast.success("সবগুলো নোটিফিকেশন পড়া হয়েছে বলে চিহ্নিত করা হয়েছে!");
  };

  const handleClearAll = () => {
    const allIds = combinedNotifications.map(n => n.id);
    setDeletedIds(new Set([...Array.from(deletedIds), ...allIds]));
    setLocalNotifs([]);
    toast.success("সব নোটিফিকেশন মুছে ফেলা হয়েছে!");
  };

  const handleItemClick = (item: NotificationItem) => {
    setReadIds(prev => {
      const next = new Set(prev);
      next.add(item.id);
      return next;
    });
    setLocalNotifs(prev => prev.map(n => n.id === item.id ? { ...n, isRead: true } : n));
    if (item.actionUrl) {
      navigate(item.actionUrl);
    }
  };

  const handleDeleteItem = (e: React.MouseEvent, id: string) => {
    e.stopPropagation();
    setDeletedIds(prev => {
      const next = new Set(prev);
      next.add(id);
      return next;
    });
    setLocalNotifs(prev => prev.filter(n => n.id !== id));
    toast.success("নোটিফিকেশনটি মুছে ফেলা হয়েছে।");
  };

  const filteredNotifications = combinedNotifications.filter(n => {
    if (activeTab === "all") return true;
    return n.type === activeTab;
  });

  const getIcon = (type: NotificationItem["type"]) => {
    switch (type) {
      case "order":
        return <ShoppingBag className="w-5 h-5 text-cyan-500" />;
      case "b2b":
        return <Cpu className="w-5 h-5 text-amber-500" />;
      case "promo":
        return <Tag className="w-5 h-5 text-rose-500" />;
      case "security":
        return <ShieldAlert className="w-5 h-5 text-red-500" />;
      case "chat":
        return <MessageCircle className="w-5 h-5 text-sky-500" />;
      default:
        return <Bell className="w-5 h-5 text-white/70" />;
    }
  };

  const getBgClass = (type: NotificationItem["type"], isRead: boolean) => {
    if (!isRead) {
      return "bg-white/[0.05] border-l-[3.5px] border-[var(--pm-accent)]";
    }
    return "bg-white/[0.01] border-l-[3.5px] border-transparent hover:bg-white/[0.02]";
  };

  return (
    <div id="notifications-page-container" className="bg-[var(--pm-bg)] min-h-screen pb-32 pt-4">
      {/* 1. Header Card */}
      <div className="max-w-[480px] mx-auto px-4 mb-4">
        <motion.div 
          initial={{ opacity: 0, y: 12 }} 
          animate={{ opacity: 1, y: 0 }}
          className="relative overflow-hidden pb-4 pt-5 px-4 rounded-none border-b border-[var(--pm-border)] bg-[var(--pm-bg)] border-b border-[var(--pm-border)] shadow-sm"
        >
          <div className="relative z-10 flex items-center justify-between">
            <div className="flex items-center gap-3">
              <button 
                id="btn-back-to-home"
                onClick={() => navigate(-1)} 
                className="p-2 -ml-2 rounded-full hover:bg-white/[0.06] active:scale-95 transition-all text-white/80 cursor-pointer"
              >
                <ArrowLeft className="w-5 h-5" strokeWidth={2} />
              </button>
              <div>
                <h1 id="title-notifications" className="text-base font-black text-white tracking-tight flex items-center gap-2">
                  নোটিফিকেশন
                  {unreadCount > 0 && (
                    <span id="badge-unread-count" className="text-[9px] px-1.5 py-0.5 rounded-full bg-rose-500 text-white font-black animate-pulse">
                      {unreadCount} নতুন
                    </span>
                  )}
                </h1>
                <p className="text-[10px] text-[var(--pm-accent)]/90 font-bold uppercase tracking-wider">Super App Info Hub</p>
              </div>
            </div>

            {combinedNotifications.length > 0 && (
              <div className="flex items-center gap-1">
                <button
                  id="btn-mark-all-read"
                  onClick={handleMarkAllRead}
                  title="সব পড়ুন"
                  className="px-2.5 py-1.5 rounded-lg text-[var(--pm-accent)] bg-[var(--pm-accent)]/10 hover:bg-[var(--pm-accent)]/20 transition-all cursor-pointer flex items-center gap-1 text-[9px] font-black"
                >
                  <Check className="w-3.5 h-3.5" />
                  সব পড়ুন
                </button>
                <button
                  id="btn-clear-all"
                  onClick={handleClearAll}
                  title="সব মুছুন"
                  className="p-1.5 rounded-lg text-white/40 hover:text-red-400 hover:bg-white/[0.06] transition-all cursor-pointer"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
            )}
          </div>
        </motion.div>
      </div>

      <div className="max-w-[480px] mx-auto px-4">
        {/* 2. Categorization Tabs Bar */}
        <div 
          id="notifications-category-tabs" 
          className="flex items-center gap-1.5 overflow-x-auto pb-2 mb-3 scrollbar-none"
        >
          {[
            { id: "all", label: "All / সব" },
            { id: "order", label: "Orders / অর্ডার" },
            { id: "b2b", label: "B2B / বিটুবি" },
            { id: "promo", label: "Offers / অফার" },
            { id: "security", label: "Alerts / অ্যালার্ট" },
          ].map((tab) => {
            const isActive = activeTab === tab.id;
            return (
              <button
                key={tab.id}
                id={`tab-btn-${tab.id}`}
                onClick={() => setActiveTab(tab.id as any)}
                className={`py-1.5 px-3 rounded-full text-[11px] font-bold whitespace-nowrap transition-all duration-200 cursor-pointer border ${
                  isActive 
                    ? "bg-[var(--pm-accent)]/15 border-[var(--pm-accent)]/40 text-[var(--pm-accent)]" 
                    : "bg-white/[0.02] text-white/60 border-white/[0.05] hover:bg-white/[0.04]"
                }`}
              >
                {tab.label}
              </button>
            );
          })}
        </div>

        {/* 3. Notifications List */}
        <div id="notifications-list-wrapper" className="space-y-2">
          {isDbLoading ? (
            <div className="space-y-2">
              {Array.from({ length: 4 }).map((_, i) => (
                <div key={i} className="h-16 bg-white/[0.02] rounded-2xl animate-pulse" />
              ))}
            </div>
          ) : (
            <AnimatePresence mode="popLayout">
              {filteredNotifications.length > 0 ? (
                filteredNotifications.map((item) => (
                  <motion.div
                    key={item.id}
                    id={`notif-card-${item.id}`}
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, scale: 0.95 }}
                    onClick={() => handleItemClick(item)}
                    className={cn(
                      "group p-3.5 rounded-2xl border border-[var(--pm-border)] transition-all flex gap-3 cursor-pointer relative shadow-none",
                      getBgClass(item.type, item.isRead)
                    )}
                  >
                    {/* Unread Indicator Glow Dot */}
                    {!item.isRead && (
                      <span 
                        id={`unread-dot-${item.id}`}
                        className="absolute top-4 right-4 w-1.5 h-1.5 rounded-full bg-[var(--pm-accent)]" 
                      />
                    )}

                    {/* Icon Section with Dark Glass style */}
                    <div className="flex-shrink-0 w-9 h-9 rounded-xl bg-[var(--pm-card)] border border-[var(--pm-border)] flex items-center justify-center">
                      {getIcon(item.type)}
                    </div>

                    {/* Content Section */}
                    <div className="flex-1 min-w-0 pr-1">
                      <h3 className={cn(
                        "text-xs leading-tight mb-0.5",
                        item.isRead ? "font-semibold text-white/80" : "font-extrabold text-white"
                      )}>
                        {item.title}
                      </h3>
                      <p className="text-[10px] text-white/50 leading-relaxed font-semibold">
                        {item.description}
                      </p>
                      <span className="text-[8px] text-[var(--pm-accent)]/70 font-black block mt-1 uppercase tracking-wider">
                        {formatDistanceToNow(new Date(item.timestamp), { addSuffix: true })}
                      </span>
                    </div>

                    {/* Right Button/Action Delete Control */}
                    <div className="flex flex-col items-end justify-between flex-shrink-0 self-stretch">
                      <button
                        id={`btn-delete-${item.id}`}
                        onClick={(e) => handleDeleteItem(e, item.id)}
                        className="p-1 rounded-lg text-white/30 hover:text-red-400 hover:bg-white/[0.06] transition-all cursor-pointer opacity-80 group-hover:opacity-100"
                        title="মুছুন"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                      {item.actionUrl && (
                        <ChevronRight className="w-4 h-4 text-white/30 mt-auto group-hover:text-[var(--pm-accent)] transition-colors" />
                      )}
                    </div>
                  </motion.div>
                ))
              ) : (
                <motion.div
                  id="no-notifications-placeholder"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  className="py-16 text-center"
                >
                  <div className="w-14 h-14 rounded-full bg-[var(--pm-card)] border border-[var(--pm-border)] flex items-center justify-center mx-auto mb-4">
                    <BellOff className="w-6 h-6 text-[var(--pm-accent)]" strokeWidth={1.5} />
                  </div>
                  <h3 className="text-xs font-extrabold text-white">No Notifications / কোন নোটিফিকেশন নেই</h3>
                  <p className="text-[10px] text-white/40 max-w-[200px] mx-auto mt-1 leading-relaxed font-semibold">
                    Major alerts and updates will appear here.
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
