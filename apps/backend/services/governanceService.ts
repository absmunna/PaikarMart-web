import { prisma } from '../config/database';
import { eventBus } from './eventBus';

export class GovernanceService {
  /**
   * Monitor Event Bus signals for potential policy violations
   */
  static async evaluateEvent(eventName: string, payload: any): Promise<void> {
    try {
      // Example rule: Rapid engagement detection (spam)
      if (eventName === 'REACTION_ADDED' || eventName === 'COMMENT_CREATED') {
        const { userId, contentItemId } = payload;
        
        // Check for high-frequency activity for this user in last 60 seconds
        const recentActionCount = await prisma.contentReaction.count({
          where: {
            userId,
            createdAt: {
              gte: new Date(Date.now() - 60000)
            }
          }
        });

        if (recentActionCount > 20) {
          await this.triggerViolation(userId, 'SPAM_ACTIVITY', 'HIGH', `User ${userId} performed ${recentActionCount} actions in 60s`);
        }
      }
    } catch (error) {
      console.error('[Governance Service] Error evaluating event', error);
    }
  }

  static async triggerViolation(userId: string, action: string, severity: string, note?: string): Promise<void> {
    await prisma.violationLog.create({
      data: {
        userId,
        action,
        severity
      }
    });

    await eventBus.emitEvent('POLICY_VIOLATION_DETECTED', { userId, action, severity, note });
  }

  static async getFlaggedContent(): Promise<any> {
    return await prisma.flaggedContent.findMany({
      where: { status: 'pending' },
      orderBy: { createdAt: 'desc' }
    });
  }
}
