import { prisma } from '../config/database';

export const sendNotification = async (userId: string, title: string, body: string, type: string) => {
  return await prisma.notification.create({
    data: {
      userId,
      title,
      body,
      type
    }
  });
};
