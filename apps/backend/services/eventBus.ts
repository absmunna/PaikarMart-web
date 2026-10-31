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
    this.on('COMMENT_CREATED', this.handleEngagementUpdate);
    this.on('POST_SHARED', this.handleEngagementUpdate);
    this.on('POST_SAVED', this.handleEngagementUpdate);
    
    // Notification Triggers
    this.on('ORDER_CREATED', this.handleOrderCreatedNotification);
    this.on('ORDER_STATUS_UPDATED', this.handleOrderStatusNotification);
    this.on('NEW_BID_RECEIVED', this.handleNewBidNotification);
    this.on('WALLETTX_COMPLETED', this.handleWalletNotification);

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

  private async handleOrderCreatedNotification(event: any) {
    try {
      const { order, vendorUserId } = event.payload;
      const { sendNotification } = require('./notificationService');
      await sendNotification(
        vendorUserId,
        'নতুন অর্ডার এসেছে! 📦',
        `আপনার শপে একটি নতুন অর্ডার (#${order.id}) এসেছে। এখনই প্রসেসিং শুরু করুন।`,
        'order_created',
        'selling',
        `/seller/orders/${order.id}`
      );
    } catch (err) {
      console.error('[EventBus Notification Handler] Failed for ORDER_CREATED', err);
    }
  }

  private async handleOrderStatusNotification(event: any) {
    try {
      const { orderId, userId, status, title } = event.payload;
      const { sendNotification } = require('./notificationService');
      
      let body = `আপনার অর্ডার #${orderId} এখন ${status} অবস্থায় আছে।`;
      if (status === 'shipped') body = `সুখবর! আপনার অর্ডার #${orderId} পাঠানো হয়েছে। শীঘ্রই পৌঁছাবে।`;
      if (status === 'delivered') body = `আপনার অর্ডার #${orderId} সফলভাবে ডেলিভারি করা হয়েছে। রিভিউ দিন!`;

      await sendNotification(
        userId,
        title || 'অর্ডার আপডেট 🛒',
        body,
        'order_status',
        'buying',
        `/orders/${orderId}`
      );
    } catch (err) {
      console.error('[EventBus Notification Handler] Failed for ORDER_STATUS_UPDATED', err);
    }
  }

  private async handleNewBidNotification(event: any) {
    try {
      const { demandId, buyerId, bidderName, amount } = event.payload;
      const { sendNotification } = require('./notificationService');
      await sendNotification(
        buyerId,
        'নতুন বিড পাওয়া গেছে! 💰',
        `${bidderName} আপনার ডিমান্ডে ৳${amount} বিড করেছেন। বিস্তারিত দেখুন।`,
        'new_bid',
        'buying',
        `/demand/${demandId}`
      );
    } catch (err) {
      console.error('[EventBus Notification Handler] Failed for NEW_BID_RECEIVED', err);
    }
  }

  private async handleWalletNotification(event: any) {
    try {
      const { userId, amount, type, title } = event.payload;
      const { sendNotification } = require('./notificationService');
      await sendNotification(
        userId,
        title || 'ওয়ালেট আপডেট 💳',
        `আপনার ওয়ালেটে ৳${amount} ${type === 'credit' ? 'যোগ' : 'ডেবিট'} করা হয়েছে।`,
        'wallet_update',
        'system',
        '/wallet'
      );
    } catch (err) {
      console.error('[EventBus Notification Handler] Failed for WALLETTX_COMPLETED', err);
    }
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
      const pAny = product as any;
      await prisma.contentItem.create({
        data: {
          contentType: 'PRODUCT',
          title: `নতুন পণ্য: ${product.title}`,
          content: `${product.description?.substring(0, 150)}...`,
          mediaUrl: product.images?.[0] || null,
          authorId: sellerId,
          categoryId: pAny.categoryId || pAny.portalCategoryId || 'general',
          isPromoted: Boolean(pAny.isPKStore),
          metadata: {
            productId: product.id,
            price: Number(product.price),
            type: pAny.type || 'product'
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
