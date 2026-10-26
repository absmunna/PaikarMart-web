import { prisma } from '../config/database';

export const sendNotification = async (userId: string, title: string, body: string, type: string) => {
  if (!process.env.DATABASE_URL) {
    return {
      id: `notif-${Date.now()}`,
      userId,
      title,
      body,
      type,
      read: false,
      createdAt: new Date()
    };
  }

  try {
    return await prisma.notification.create({
      data: {
        userId,
        title,
        body,
        type
      }
    });
  } catch (error) {
    return {
      id: `notif-${Date.now()}`,
      userId,
      title,
      body,
      type,
      read: false,
      createdAt: new Date()
    };
  }
};

