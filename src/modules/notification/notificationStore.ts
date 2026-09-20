import { create } from 'zustand';
import { persist } from 'zustand/middleware';

export type UserNotificationCategory = 'order' | 'promo' | 'security' | 'b2b' | 'system';

export interface UserNotification {
  id: string;
  type: UserNotificationCategory;
  title: string;
  description: string;
  timestamp: string;
  isRead: boolean;
  actionUrl?: string;
}

interface NotificationState {
  notifications: UserNotification[];
  unreadCount: number;
  addNotification: (notif: Omit<UserNotification, 'id' | 'isRead' | 'timestamp'>) => void;
  markAsRead: (id: string) => void;
  markAllAsRead: () => void;
  removeNotification: (id: string) => void;
  clearAll: () => void;
}

const INITIAL_NOTIFICATIONS: UserNotification[] = [
  {
    id: "notif-1",
    type: "order",
    title: "অর্ডার সফলভাবে পাঠানো হয়েছে!",
    description: "আপনার Afnan Electronics থেকে করা অর্ডার #PM-89241 লজিস্টিক পার্টনারের কাছে হস্তান্তর করা হয়েছে।",
    timestamp: new Date().toISOString(),
    isRead: false,
    actionUrl: "/orders/PM-89241"
  },
  {
    id: "notif-2",
    type: "b2b",
    title: "নতুন B2B ডিমান্ড ম্যাচ পাওয়া গেছে!",
    description: "১০০০ পিস সুতি শাড়ির জন্য আপনার সোর্সিং ম্যাচিং রেজাল্ট প্রস্তুত।",
    timestamp: new Date(Date.now() - 3600000).toISOString(),
    isRead: false,
    actionUrl: "/b2b"
  },
  {
    id: "notif-3",
    type: "promo",
    title: "শীতকালীন মেগা সেল ❄️",
    description: "সকল ইলেকট্রনিক্স গ্যাজেটে ২০% ফ্ল্যাট ক্যাশব্যাক! অফার চলবে মাত্র ৩ দিন।",
    timestamp: new Date(Date.now() - 86400000).toISOString(),
    isRead: true,
  },
  {
    id: "notif-4",
    type: "security",
    title: "নতুন ডিভাইস থেকে লগইন",
    description: "আপনার অ্যাকাউন্টে 'iPhone 15 Pro Max' থেকে লগইন করা হয়েছে। আপনি না হলে সাথে সাথে পাসওয়ার্ড পরিবর্তন করুন।",
    timestamp: new Date(Date.now() - 172800000).toISOString(),
    isRead: true,
    actionUrl: "/settings/security"
  }
];

export const useNotificationStore = create<NotificationState>()(
  persist(
    (set) => ({
      notifications: INITIAL_NOTIFICATIONS,
      unreadCount: INITIAL_NOTIFICATIONS.filter(n => !n.isRead).length,
      
      addNotification: (notif) => set((state) => {
        const newNotif: UserNotification = {
          ...notif,
          id: `notif-${Date.now()}`,
          isRead: false,
          timestamp: new Date().toISOString()
        };
        const updated = [newNotif, ...state.notifications];
        return {
          notifications: updated,
          unreadCount: updated.filter(n => !n.isRead).length
        };
      }),

      markAsRead: (id) => set((state) => {
        const updated = state.notifications.map(n => 
          n.id === id ? { ...n, isRead: true } : n
        );
        return {
          notifications: updated,
          unreadCount: updated.filter(n => !n.isRead).length
        };
      }),

      markAllAsRead: () => set((state) => {
        const updated = state.notifications.map(n => ({ ...n, isRead: true }));
        return {
          notifications: updated,
          unreadCount: 0
        };
      }),

      removeNotification: (id) => set((state) => {
        const updated = state.notifications.filter(n => n.id !== id);
        return {
          notifications: updated,
          unreadCount: updated.filter(n => !n.isRead).length
        };
      }),

      clearAll: () => set({ notifications: [], unreadCount: 0 })
    }),
    {
      name: 'pm-notifications-store',
    }
  )
);
