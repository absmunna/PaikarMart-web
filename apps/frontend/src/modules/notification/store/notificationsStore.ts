import { create } from 'zustand';
import { persist } from 'zustand/middleware';

export interface AppNotification {
  id: string;
  title: string;
  message: string;
  time: string;
  category: 'orders' | 'offers' | 'demands' | 'system';
  isRead: boolean;
  link?: string;
  iconType?: 'order' | 'coin' | 'demand' | 'discount' | 'system';
}

interface NotificationsState {
  notifications: AppNotification[];
  isOpen: boolean;
  openDrawer: () => void;
  closeDrawer: () => void;
  markAsRead: (id: string) => void;
  markAllAsRead: () => void;
  removeNotification: (id: string) => void;
  addNotification: (notif: Omit<AppNotification, 'id' | 'isRead' | 'time'>) => void;
  getUnreadCount: () => number;
}

const DEFAULT_NOTIFICATIONS: AppNotification[] = [
  {
    id: 'notif_1',
    title: 'অর্ডার নিশ্চিতকরণ (#PM-9482)',
    message: 'আপনার মিনিকেট চাল (৫০ কেজি) অর্ডারটি বিক্রেতা অনুমোদন করেছেন। ডেলিভারি ট্র্যাক করুন।',
    time: '১০ মিনিট আগে',
    category: 'orders',
    isRead: false,
    link: '/orders',
    iconType: 'order'
  },
  {
    id: 'notif_2',
    title: 'পিকে কয়েন ক্যাশব্যাক অর্জিত! 🪙',
    message: 'আপনার ওয়ালেটে ৳৭৫ মূল্যের ৭৫টি পিকে কয়েন জমা হয়েছে। পরবর্তী কেনাকাটায় ব্যবহার করুন।',
    time: '১ ঘন্টা আগে',
    category: 'system',
    isRead: false,
    link: '/wallet',
    iconType: 'coin'
  },
  {
    id: 'notif_3',
    title: 'এলাকা ভিত্তিক নতুন ডিমান্ড রিকোয়েস্ট',
    message: 'মিরপুর-১০ এলাকায় ২০ কার্টন সরিষার তেলের একটি পাইকারি চাহিদা এসেছে। বিড করুন।',
    time: '৩ ঘন্টা আগে',
    category: 'demands',
    isRead: false,
    link: '/demand',
    iconType: 'demand'
  },
  {
    id: 'notif_4',
    title: 'পাইকারি ফ্ল্যাশ সেল অফার! 🔥',
    message: 'আজকের স্পেশাল গ্যাজেট লট বুকিংয়ে ফ্ল্যাট ১৫% ছাড়ের কুপন: PAIKAR15',
    time: 'গতকাল',
    category: 'offers',
    isRead: true,
    link: '/portal/electronics',
    iconType: 'discount'
  }
];

export const useNotificationsStore = create<NotificationsState>()(
  persist(
    (set, get) => ({
      notifications: DEFAULT_NOTIFICATIONS,
      isOpen: false,
      openDrawer: () => set({ isOpen: true }),
      closeDrawer: () => set({ isOpen: false }),
      markAsRead: (id) =>
        set((state) => ({
          notifications: state.notifications.map((n) =>
            n.id === id ? { ...n, isRead: true } : n
          ),
        })),
      markAllAsRead: () =>
        set((state) => ({
          notifications: state.notifications.map((n) => ({ ...n, isRead: true })),
        })),
      removeNotification: (id) =>
        set((state) => ({
          notifications: state.notifications.filter((n) => n.id !== id),
        })),
      addNotification: (notif) => {
        const newNotif: AppNotification = {
          ...notif,
          id: `notif_${Date.now()}`,
          isRead: false,
          time: 'এইমাত্র'
        };
        set((state) => ({
          notifications: [newNotif, ...state.notifications]
        }));
      },
      getUnreadCount: () => {
        return get().notifications.filter((n) => !n.isRead).length;
      }
    }),
    {
      name: 'pm-notifications-store',
    }
  )
);
