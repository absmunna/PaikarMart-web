import { prisma } from '../config/database';

export class IntelligenceService {
  /**
   * Log an event signal for system-wide health
   */
  static async logEventSignal(type: string, payload: any): Promise<void> {
    try {
      // Simply log for now
      await prisma.platformMetric.create({
        data: {
          name: `event_type:${type}`,
          value: 1.0
        }
      });
      // We could add more complex processing here
    } catch (error) {
      console.error('[Intelligence Aggregator] Failed to log signal', error);
    }
  }

  static async getPlatformSummary(): Promise<any> {
    const totalEvents = await prisma.platformEventLog.count();
    const eventDistribution = await prisma.platformMetric.groupBy({
      by: ['name'],
      _sum: { value: true }
    });
    
    return {
      totalEvents,
      eventDistribution
    };
  }
}
