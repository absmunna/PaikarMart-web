import { useOrderTrackingStore, Order, OrderState } from '../orderTrackingStore';

const MOCK_RIDERS = [
  { name: "Rafat Ahmed", phone: "01788239XXX", distance: "2.4 km", eta: "12 mins" },
  { name: "Suman Ali", phone: "01912345XXX", distance: "1.1 km", eta: "5 mins" }
];

export const orderTrackingService = {
  /**
   * Listen for global events to keep the store in sync
   */
  initEventListener: () => {
    if (typeof window === 'undefined') return;

    window.addEventListener('ORDER_CREATED', (e: any) => {
      const { orderId, total, cashbackCoinsCount } = e.detail;
      const store = useOrderTrackingStore.getState();
      
      const newOrder: Order = {
        id: orderId,
        total,
        items: [], // Would ideally come from storage or payload
        status: 'ORDER_CREATED',
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
        address: "Referenced during checkout",
        deliveryMethod: "Standard",
        paymentMethod: "COD / Wallet",
        activities: [
          {
            status: 'ORDER_CREATED',
            timestamp: new Date().toISOString(),
            source: 'system',
            description: 'Order successfully logged into the Paikar Trade Ledger.'
          }
        ],
        escrowStatus: {
          lockedAmount: total,
          releaseCondition: 'Delivered & Verified',
          isReleased: false,
          refundEligible: true
        }
      };

      store.addOrder(newOrder);
      
      // Simulation: Auto-confirm payment after 2 seconds
      setTimeout(() => {
        orderTrackingService.updateStatus(orderId, 'PAYMENT_CONFIRMED', 'Escrow block successfully locked from account credits.');
      }, 3000);
    });

    window.addEventListener('LOGISTICS_UPDATED', (e: any) => {
        // Handle external logistics hub signals
        const { orderId, status, description } = e.detail;
        orderTrackingService.updateStatus(orderId, status, description);
    });
  },

  updateStatus: (orderId: string, status: OrderState, description: string) => {
    const store = useOrderTrackingStore.getState();
    const order = store.orders.find(o => o.id === orderId);
    if (!order) return;

    const newActivity = {
      status,
      timestamp: new Date().toISOString(),
      source: status === 'PACKING' ? 'seller' : status.includes('TRANSIT') ? 'logistics' : 'system' as any,
      description
    };

    const updates: any = {
      status,
      updatedAt: new Date().toISOString(),
      activities: [...order.activities, newActivity]
    };

    // Simulate rider assignment when picked up
    if (status === 'PICKED_UP' || status === 'OUT_FOR_DELIVERY') {
        updates.riderInfo = MOCK_RIDERS[Math.floor(Math.random() * MOCK_RIDERS.length)];
    }

    store.updateOrder(orderId, updates);
  }
};
