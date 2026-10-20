import { EventEmitter } from 'events';
import { prisma } from '../config/database';

class EventBus extends EventEmitter {
  constructor() {
    super();
    this.setupListeners();
  }

  private setupListeners() {
    this.on('FOLLOW_CREATED', this.handleFollowCreated);
    this.on('REACTION_ADDED', this.handleEngagementUpdate);
    this.on('REACTION_REMOVED', this.handleEngagementUpdate);
    this.on('COMMENT_CREATED', this.handleEngagementUpdate);
    this.on('POST_SHARED', this.handleEngagementUpdate);
    this.on('POST_SAVED', this.handleEngagementUpdate);
    // Intelligence Layer Observes everything
    this.on('PRODUCT_ADDED', this.handleIntelligenceObservation);
    this.on('PRODUCT_ADDED', this.handleProductLifecycle);
    this.on('ORDER_CREATED', this.handleIntelligenceObservation);
    this.on('ORDER_CONFIRMED', this.handleIntelligenceObservation);
    
    // Governance Layer observes critical events
    this.on('REACTION_ADDED', this.handleGovernanceEvaluation);
    this.on('COMMENT_CREATED', this.handleGovernanceEvaluation);
    this.on('ORDER_CREATED', this.handleGovernanceEvaluation);
  }

  private async handleGovernanceEvaluation(event: any) {
    try {
      const { GovernanceService } = require('./governanceService');
      await GovernanceService.evaluateEvent(event.name, event.payload);
    } catch (err) {
      console.error('[EventBus Governance Handler] Failed to evaluate event', err);
    }
  }

  private async handleIntelligenceObservation(event: any) {
    try {
      const { IntelligenceService } = require('./intelligenceService');
      await IntelligenceService.logEventSignal(event.payload?.type || event.name || 'generic', event.payload);
    } catch (err) {
      console.error('[EventBus Intelligence Handler] Failed to log signal', err);
    }
  }

  private async handleProductLifecycle(event: any) {
    try {
      const { productId, sellerId, title } = event.payload;
      const product = await prisma.product.findUnique({ where: { id: productId } });
      
      if (!product) return;

      // Automatically create a ContentItem (social feed post) for the new product
      await prisma.contentItem.create({
        data: {
          contentType: 'PRODUCT',
          title: `নতুন পণ্য: ${product.title}`,
          content: `${product.description?.substring(0, 150)}...`,
          mediaUrl: product.images?.[0] || null,
          authorId: sellerId,
          categoryId: product.categoryId,
          isPromoted: product.isPKStore,
          metadata: {
            productId: product.id,
            price: Number(product.price),
            type: product.type
          }
        }
      });

      console.log(`[Product Lifecycle] Auto-published product ${productId} to Social Feed`);
    } catch (err) {
      console.error('[Product Lifecycle] Failed to auto-publish product to feed', err);
    }
  }

  private async handleEngagementUpdate(event: any) {
    try {
      const contentItemId = event.payload?.contentItemId;
      if (contentItemId) {
        const { ViralityService } = require('./viralityService');
        await ViralityService.computePerformanceMetrics(contentItemId);
      }
    } catch (err) {
      console.error('[EventBus Engagement Handler] Failed to update post metrics', err);
    }
  }

  async emitEvent(eventName: string, payload: any) {
    const eventId = crypto.randomUUID();
    console.log(`[EventBus] Emitting ${eventName}: ${eventId}`);
    
    try {
      // Ensure all event emissions are durably persisted to Database
      await prisma.platformEventLog.create({
        data: {
          eventId,
          type: eventName,
          payload: payload,
          status: 'processed'
        }
      });
    } catch (err) {
      console.error(`[EventBus] Failed to persist event log for ${eventName}`, err);
    }

    this.emit(eventName, { eventId, payload });
  }

  private async handleFollowCreated(event: any) {
    // Decoupled asynchronous side-effects can trigger here safely
    console.log(`[EventBus Handler] Decoupled handler called for: FOLLOW_CREATED`, event.payload);
  }
}

export const eventBus = new EventBus();
