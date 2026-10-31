import { useState, useEffect, useCallback, useMemo } from 'react';
import { api } from '@/core/lib/api';
import { db, auth } from '@/core/lib/firebase';
import { collection, query, where, orderBy, onSnapshot, doc, updateDoc, deleteDoc, writeBatch } from 'firebase/firestore';

export type UserRoleType = 'buyer' | 'seller' | 'system' | 'all';

export interface NotificationItem {
  id: string;
  type: string;
  category: 'buying' | 'selling' | 'system';
  targetRole?: 'buyer' | 'seller' | 'both';
  title: string;
  body: string;
  message?: string;
  link?: string;
  actorAvatarUrl?: string;
  read: boolean;
  isRead?: boolean;
  createdAt: string;
  metadata?: any;
}

const DEFAULT_MOCK_NOTIFICATIONS: NotificationItem[] = [
  {
    id: "notif-b1",
    type: "order_shipped",
    category: "buying",
    targetRole: "buyer",
    title: "অর্ডার ডেলিভারিতে পাঠানো হয়েছে! 🚚",
    body: "আপনার প্রিমিয়াম লেদার ওয়ালেট অর্ডার (#ORD-78901) রাইডারের কাছে হস্তান্তরিত হয়েছে।",
    link: "/orders/ORD-78901",
    actorAvatarUrl: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=100&h=100&fit=crop",
    read: false,
    createdAt: new Date(Date.now() - 1000 * 60 * 15).toISOString(),
    metadata: { orderId: "ORD-78901" }
  },
  {
    id: "notif-b2",
    type: "new_bid",
    category: "buying",
    targetRole: "buyer",
    title: "ডিমান্ডে নতুন বিড অফার! 💰",
    body: "রহিম ট্রেডার্স আপনার '৫০ কেজি সুগন্ধি কাটারীভোগ চাল' ডিমান্ডে ৳৪,৫০০ বিড সাবমিট করেছেন।",
    link: "/demand/DEMAND-102",
    actorAvatarUrl: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=100&h=100&fit=crop",
    read: false,
    createdAt: new Date(Date.now() - 1000 * 60 * 45).toISOString(),
    metadata: { demandId: "DEMAND-102" }
  },
  {
    id: "notif-s1",
    type: "new_order",
    category: "selling",
    targetRole: "seller",
    title: "নতুন পাইকারি অর্ডার প্রাপ্তি! 📦",
    body: "আরিফ ট্রেডার্স আপনার শপ থেকে ১০টি কাস্টম শার্টের পাইকারি অর্ডার প্রদান করেছেন।",
    link: "/seller/orders/ORD-78903",
    actorAvatarUrl: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=100&h=100&fit=crop",
    read: false,
    createdAt: new Date(Date.now() - 1000 * 60 * 120).toISOString(),
    metadata: { orderId: "ORD-78903" }
  },
  {
    id: "notif-s2",
    type: "bid_accepted",
    category: "selling",
    targetRole: "seller",
    title: "আপনার বিড গ্রহণযোগ্য হয়েছে! 🎉",
    body: "মেসার্স রফিক স্টোর আপনার কাস্টম কোটেশন গ্রহণ করেছেন। পেমেন্ট কনফার্মেশনের জন্য ওয়েট করুন।",
    link: "/demand/DEMAND-99",
    actorAvatarUrl: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=100&h=100&fit=crop",
    read: true,
    createdAt: new Date(Date.now() - 1000 * 60 * 360).toISOString(),
    metadata: { demandId: "DEMAND-99" }
  },
  {
    id: "notif-sys1",
    type: "wallet_credit",
    category: "system",
    targetRole: "both",
    title: "পিকে ক্যাশ ব্যাক যোগ হয়েছে 💳",
    body: "আপনার ওয়ালেটে ৳১৫০ পিকে ক্যাশ ব্যাক রিওয়ার্ড জমা করা হয়েছে।",
    link: "/wallet",
    read: true,
    createdAt: new Date(Date.now() - 1000 * 60 * 720).toISOString(),
    metadata: { amount: 150 }
  }
];

export function useNotifications() {
  const [notifications, setNotifications] = useState<NotificationItem[]>(DEFAULT_MOCK_NOTIFICATIONS);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [activeRoleFilter, setActiveRoleFilter] = useState<UserRoleType>('all');

  // Helper to unify read state property
  const normalizeNotification = (n: any): NotificationItem => ({
    ...n,
    body: n.body || n.message || '',
    message: n.message || n.body || '',
    read: n.read !== undefined ? n.read : (n.isRead !== undefined ? n.isRead : false),
    isRead: n.read !== undefined ? n.read : (n.isRead !== undefined ? n.isRead : false),
    category: n.category || (n.targetRole === 'seller' ? 'selling' : n.targetRole === 'buyer' ? 'buying' : 'system'),
    targetRole: n.targetRole || (n.category === 'selling' ? 'seller' : n.category === 'buying' ? 'buyer' : 'both')
  });

  const fetchBackendNotifications = useCallback(async () => {
    try {
      setIsLoading(true);
      const res: any = await api.get('/notifications');
      if (res && Array.isArray(res.notifications) && res.notifications.length > 0) {
        setNotifications(res.notifications.map(normalizeNotification));
      }
    } catch (error) {
      console.warn('Backend notifications fetch failed, using default mock data', error);
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchBackendNotifications();

    if (auth?.currentUser) {
      try {
        const q = query(
          collection(db, 'notifications'),
          where('userId', '==', auth.currentUser.uid),
          orderBy('createdAt', 'desc')
        );

        const unsubscribe = onSnapshot(q, (snapshot) => {
          if (!snapshot.empty) {
            const docs = snapshot.docs.map(d => normalizeNotification({ id: d.id, ...d.data() }));
            setNotifications(docs);
          }
          setIsLoading(false);
        }, (error) => {
          console.warn('Firestore Notifications listener warning:', error);
        });

        return () => unsubscribe();
      } catch (err) {
        console.warn('Firestore init skipped', err);
      }
    }
  }, [fetchBackendNotifications]);

  const buyerNotifications = useMemo(() => {
    return notifications.filter(n => n.category === 'buying' || n.targetRole === 'buyer');
  }, [notifications]);

  const sellerNotifications = useMemo(() => {
    return notifications.filter(n => n.category === 'selling' || n.targetRole === 'seller');
  }, [notifications]);

  const systemNotifications = useMemo(() => {
    return notifications.filter(n => n.category === 'system' || n.targetRole === 'both');
  }, [notifications]);

  const filteredNotifications = useMemo(() => {
    if (activeRoleFilter === 'buyer') return buyerNotifications;
    if (activeRoleFilter === 'seller') return sellerNotifications;
    if (activeRoleFilter === 'system') return systemNotifications;
    return notifications;
  }, [activeRoleFilter, buyerNotifications, sellerNotifications, systemNotifications, notifications]);

  const unreadCount = useMemo(() => notifications.filter(n => !n.read).length, [notifications]);
  const buyerUnreadCount = useMemo(() => buyerNotifications.filter(n => !n.read).length, [buyerNotifications]);
  const sellerUnreadCount = useMemo(() => sellerNotifications.filter(n => !n.read).length, [sellerNotifications]);
  const systemUnreadCount = useMemo(() => systemNotifications.filter(n => !n.read).length, [systemNotifications]);

  const markAsRead = async (id: string) => {
    setNotifications(prev => prev.map(n => n.id === id ? { ...n, read: true, isRead: true } : n));
    try {
      await api.patch(`/notifications/${id}/read`).catch(() => {});
      if (auth?.currentUser) {
        await updateDoc(doc(db, 'notifications', id), { read: true }).catch(() => {});
      }
    } catch (err) {
      console.error('Failed to mark notification read', err);
    }
  };

  const markAllAsRead = async (roleFilter?: UserRoleType) => {
    const targetFilter = roleFilter || activeRoleFilter;
    setNotifications(prev => prev.map(n => {
      const match = targetFilter === 'all' || 
        (targetFilter === 'buyer' && (n.category === 'buying' || n.targetRole === 'buyer')) ||
        (targetFilter === 'seller' && (n.category === 'selling' || n.targetRole === 'seller')) ||
        (targetFilter === 'system' && (n.category === 'system' || n.targetRole === 'both'));
      return match ? { ...n, read: true, isRead: true } : n;
    }));

    try {
      const catParam = targetFilter === 'buyer' ? 'buying' : targetFilter === 'seller' ? 'selling' : targetFilter === 'system' ? 'system' : 'all';
      await api.patch('/notifications/read-all', { category: catParam }).catch(() => {});

      if (auth?.currentUser) {
        const batch = writeBatch(db);
        const unreadDocs = notifications.filter(n => !n.read);
        unreadDocs.forEach(n => {
          const ref = doc(db, 'notifications', n.id);
          batch.update(ref, { read: true });
        });
        await batch.commit().catch(() => {});
      }
    } catch (err) {
      console.error('Failed to mark all as read', err);
    }
  };

  const deleteNotification = async (id: string) => {
    setNotifications(prev => prev.filter(n => n.id !== id));
    try {
      await api.delete(`/notifications/${id}`).catch(() => {});
      if (auth?.currentUser) {
        await deleteDoc(doc(db, 'notifications', id)).catch(() => {});
      }
    } catch (err) {
      console.error('Failed to delete notification', err);
    }
  };

  const clearAll = async (roleFilter?: UserRoleType) => {
    const targetFilter = roleFilter || activeRoleFilter;
    setNotifications(prev => prev.filter(n => {
      const match = targetFilter === 'all' || 
        (targetFilter === 'buyer' && (n.category === 'buying' || n.targetRole === 'buyer')) ||
        (targetFilter === 'seller' && (n.category === 'selling' || n.targetRole === 'seller')) ||
        (targetFilter === 'system' && (n.category === 'system' || n.targetRole === 'both'));
      return !match;
    }));

    try {
      const catParam = targetFilter === 'buyer' ? 'buying' : targetFilter === 'seller' ? 'selling' : targetFilter === 'system' ? 'system' : 'all';
      await api.delete('/notifications/clear-all').catch(() => {});
    } catch (err) {
      console.error('Failed to clear notifications', err);
    }
  };

  return {
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
    clearAll,
    refetch: fetchBackendNotifications
  };
}
