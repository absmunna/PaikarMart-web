import { prisma } from '../config/database';
import { getFirestore } from 'firebase-admin/firestore';

/**
 * Sends a notification by persisting it in PostgreSQL and mirroring to Firestore for real-time delivery.
 * @param userId - Target user ID
 * @param title - Notification title
 * @param body - Notification body
 * @param type - Internal type identifier
 * @param category - 'buying' | 'selling' | 'system'
 * @param link - Deep link URL
 * @param actorAvatarUrl - Avatar of the user who triggered the notification
 * @param metadata - Additional flexible JSON metadata
 */
export const sendNotification = async (
  userId: string, 
  title: string, 
  body: string, 
  type: string,
  category: 'buying' | 'selling' | 'system' = 'system',
  link?: string,
  actorAvatarUrl?: string,
  metadata?: any
) => {
  // 1. Persist in PostgreSQL (Prisma) for history/audit
  const notification = await prisma.notification.create({
    data: {
      userId,
      title,
      body,
      type,
      category,
      link,
      actorAvatarUrl,
      metadata: metadata || {}
    }
  });

  // 2. Mirror to Firestore for real-time delivery to the frontend
  try {
    const db = getFirestore();
    await db.collection('notifications').doc(notification.id).set({
      id: notification.id,
      userId,
      title,
      body,
      type,
      category,
      link: link || '',
      actorAvatarUrl: actorAvatarUrl || '',
      read: false,
      createdAt: notification.createdAt.toISOString(),
      metadata: metadata || {}
    });
  } catch (error) {
    console.error('Failed to sync notification to Firestore:', error);
    // We don't throw here to ensure the primary DB write remains successful
  }

  return notification;
};
