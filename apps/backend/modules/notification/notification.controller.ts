import { Response } from 'express';
import { prisma, db } from '../../config/database';
import { sendNotification } from '../../services/notificationService';
import { AuthenticatedRequest } from '../../middleware/auth';

// Sample mock notifications for fallback / initial seeding
const mockNotifications = [
  {
    id: "notif-001",
    userId: "usr-demo",
    type: "order_status",
    category: "buying",
    title: "অর্ডার ডেলিভারি শুরু হয়েছে! 🚚",
    body: "আপনার প্রিমিয়াম লেদার ওয়ালেট অর্ডার (#ORD-78901) রাইডারের কাছে হস্তান্তরিত হয়েছে।",
    link: "/orders/ORD-78901",
    actorAvatarUrl: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=100&h=100&fit=crop",
    read: false,
    createdAt: new Date(Date.now() - 1000 * 60 * 15).toISOString(),
    metadata: { orderId: "ORD-78901" }
  },
  {
    id: "notif-002",
    userId: "usr-demo",
    type: "new_bid",
    category: "buying",
    title: "নতুন বিড অফার পাওয়া গেছে! 💰",
    body: "রহিম ট্রেডার্স আপনার '৫০ কেজি সুগন্ধি কাটারীভোগ চাল' ডিমান্ডে ৳৪,৫০০ বিড সাবমিট করেছেন।",
    link: "/demand/DEMAND-102",
    actorAvatarUrl: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=100&h=100&fit=crop",
    read: false,
    createdAt: new Date(Date.now() - 1000 * 60 * 45).toISOString(),
    metadata: { demandId: "DEMAND-102", bidAmount: 4500 }
  },
  {
    id: "notif-003",
    userId: "usr-demo",
    type: "order_created",
    category: "selling",
    title: "নতুন পাইকারি অর্ডার পাওয়া গেছে! 📦",
    body: "আরিফ ট্রেডার্স আপনার শপ থেকে ১০টি শার্টের কাস্টম পাইকারি অর্ডার সাবমিট করেছেন।",
    link: "/seller/orders/ORD-78903",
    actorAvatarUrl: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=100&h=100&fit=crop",
    read: false,
    createdAt: new Date(Date.now() - 1000 * 60 * 120).toISOString(),
    metadata: { orderId: "ORD-78903" }
  },
  {
    id: "notif-004",
    userId: "usr-demo",
    type: "bid_accepted",
    category: "selling",
    title: "আপনার বিড গ্রহণযোগ্য হয়েছে! 🎉",
    body: "ক্রেতা মেসার্স রফিক স্টোর আপনার কাস্টম কোটেশন গ্রহণ করেছেন। কাজের বিস্তারিত দেখুন।",
    link: "/demand/DEMAND-99",
    actorAvatarUrl: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=100&h=100&fit=crop",
    read: true,
    createdAt: new Date(Date.now() - 1000 * 60 * 360).toISOString(),
    metadata: { demandId: "DEMAND-99" }
  },
  {
    id: "notif-005",
    userId: "usr-demo",
    type: "wallet_update",
    category: "system",
    title: "ক্যাশব্যাক জমা হয়েছে 💳",
    body: "আপনার সাম্প্রতিক সফল অর্ডারের জন্য ৳১৫০ পিকে ক্যাশ ব্যাক পাওয়া গেছে।",
    link: "/wallet",
    actorAvatarUrl: null,
    read: true,
    createdAt: new Date(Date.now() - 1000 * 60 * 720).toISOString(),
    metadata: { amount: 150, type: "cashback" }
  },
  {
    id: "notif-006",
    userId: "usr-demo",
    type: "verification_update",
    category: "system",
    title: "অ্যাকাউন্ট ভেরিফিকেশন সফল 🛡️",
    body: "আপনার বিক্রেতা প্রোফাইল ও ট্রেড লাইসেন্স সফলভাবে ভেরিফাইড হয়েছে।",
    link: "/profile/verification",
    actorAvatarUrl: null,
    read: true,
    createdAt: new Date(Date.now() - 1000 * 60 * 1440).toISOString(),
    metadata: { status: "approved" }
  }
];

export const getNotifications = async (req: AuthenticatedRequest, res: Response) => {
  try {
    const userId = req.user?.id || 'usr-demo';
    const { category, unreadOnly } = req.query;

    if (!db.isConnected()) {
      let filtered = [...mockNotifications];
      if (category && category !== 'all') {
        filtered = filtered.filter(n => n.category === category);
      }
      if (unreadOnly === 'true') {
        filtered = filtered.filter(n => !n.read);
      }

      const unreadCount = mockNotifications.filter(n => !n.read).length;
      const unreadBuying = mockNotifications.filter(n => n.category === 'buying' && !n.read).length;
      const unreadSelling = mockNotifications.filter(n => n.category === 'selling' && !n.read).length;
      const unreadSystem = mockNotifications.filter(n => n.category === 'system' && !n.read).length;

      return res.json({
        notifications: filtered,
        counts: {
          total: mockNotifications.length,
          unread: unreadCount,
          unreadBuying,
          unreadSelling,
          unreadSystem
        }
      });
    }

    const whereClause: any = { userId };
    if (category && category !== 'all') {
      whereClause.category = category as string;
    }
    if (unreadOnly === 'true') {
      whereClause.read = false;
    }

    const [notifications, totalUnread, unreadBuying, unreadSelling, unreadSystem] = await Promise.all([
      prisma.notification.findMany({
        where: whereClause,
        orderBy: { createdAt: 'desc' }
      }),
      prisma.notification.count({ where: { userId, read: false } }),
      prisma.notification.count({ where: { userId, category: 'buying', read: false } }),
      prisma.notification.count({ where: { userId, category: 'selling', read: false } }),
      prisma.notification.count({ where: { userId, category: 'system', read: false } })
    ]);

    // If database exists but user has 0 notifications yet, present the mock notifications so initial UI is pre-populated
    if (notifications.length === 0 && !category && unreadOnly !== 'true') {
      return res.json({
        notifications: mockNotifications,
        counts: {
          total: mockNotifications.length,
          unread: mockNotifications.filter(n => !n.read).length,
          unreadBuying: mockNotifications.filter(n => n.category === 'buying' && !n.read).length,
          unreadSelling: mockNotifications.filter(n => n.category === 'selling' && !n.read).length,
          unreadSystem: mockNotifications.filter(n => n.category === 'system' && !n.read).length
        }
      });
    }

    return res.json({
      notifications,
      counts: {
        total: notifications.length,
        unread: totalUnread,
        unreadBuying,
        unreadSelling,
        unreadSystem
      }
    });
  } catch (error) {
    console.error('Fetch Notifications Error:', error);
    res.status(500).json({ error: 'Failed to fetch notifications' });
  }
};

export const markAsRead = async (req: AuthenticatedRequest, res: Response) => {
  try {
    const { id } = req.params;
    const userId = req.user?.id || 'usr-demo';

    if (!db.isConnected()) {
      const match = mockNotifications.find(n => n.id === id);
      if (match) {
        match.read = true;
      }
      return res.json({ success: true, id, read: true });
    }

    const notification = await prisma.notification.updateMany({
      where: { id, userId },
      data: { read: true }
    });

    return res.json({ success: true, count: notification.count });
  } catch (error) {
    console.error('Mark Notification Read Error:', error);
    res.status(500).json({ error: 'Failed to mark notification as read' });
  }
};

export const markAllAsRead = async (req: AuthenticatedRequest, res: Response) => {
  try {
    const userId = req.user?.id || 'usr-demo';
    const { category } = req.body;

    if (!db.isConnected()) {
      mockNotifications.forEach(n => {
        if (!category || category === 'all' || n.category === category) {
          n.read = true;
        }
      });
      return res.json({ success: true, message: 'All notifications marked as read' });
    }

    const whereClause: any = { userId, read: false };
    if (category && category !== 'all') {
      whereClause.category = category;
    }

    const result = await prisma.notification.updateMany({
      where: whereClause,
      data: { read: true }
    });

    return res.json({ success: true, count: result.count });
  } catch (error) {
    console.error('Mark All Notifications Read Error:', error);
    res.status(500).json({ error: 'Failed to mark all notifications as read' });
  }
};

export const deleteNotification = async (req: AuthenticatedRequest, res: Response) => {
  try {
    const { id } = req.params;
    const userId = req.user?.id || 'usr-demo';

    if (!db.isConnected()) {
      const index = mockNotifications.findIndex(n => n.id === id);
      if (index !== -1) {
        mockNotifications.splice(index, 1);
      }
      return res.json({ success: true, id });
    }

    await prisma.notification.deleteMany({
      where: { id, userId }
    });

    return res.json({ success: true, id });
  } catch (error) {
    console.error('Delete Notification Error:', error);
    res.status(500).json({ error: 'Failed to delete notification' });
  }
};

export const clearAllNotifications = async (req: AuthenticatedRequest, res: Response) => {
  try {
    const userId = req.user?.id || 'usr-demo';
    const { category } = req.body;

    if (!db.isConnected()) {
      if (category && category !== 'all') {
        for (let i = mockNotifications.length - 1; i >= 0; i--) {
          if (mockNotifications[i].category === category) {
            mockNotifications.splice(i, 1);
          }
        }
      } else {
        mockNotifications.length = 0;
      }
      return res.json({ success: true, message: 'Notifications cleared' });
    }

    const whereClause: any = { userId };
    if (category && category !== 'all') {
      whereClause.category = category;
    }

    const result = await prisma.notification.deleteMany({
      where: whereClause
    });

    return res.json({ success: true, count: result.count });
  } catch (error) {
    console.error('Clear All Notifications Error:', error);
    res.status(500).json({ error: 'Failed to clear notifications' });
  }
};

export const createNotification = async (req: AuthenticatedRequest, res: Response) => {
  try {
    const { targetUserId, title, body, type, category, link, actorAvatarUrl, metadata } = req.body;
    const userId = targetUserId || req.user?.id || 'usr-demo';

    if (!title || !body) {
      return res.status(400).json({ error: 'Title and body are required' });
    }

    if (!db.isConnected()) {
      const newNotif = {
        id: `notif-${Date.now()}`,
        userId,
        type: type || 'custom_alert',
        category: category || 'system',
        title,
        body,
        link: link || null,
        actorAvatarUrl: actorAvatarUrl || null,
        read: false,
        createdAt: new Date().toISOString(),
        metadata: metadata || {}
      };
      mockNotifications.unshift(newNotif as any);
      return res.status(201).json(newNotif);
    }

    const notification = await sendNotification(
      userId,
      title,
      body,
      type || 'custom_alert',
      category || 'system',
      link,
      actorAvatarUrl,
      metadata
    );

    return res.status(201).json(notification);
  } catch (error) {
    console.error('Create Notification Error:', error);
    res.status(500).json({ error: 'Failed to create notification' });
  }
};
