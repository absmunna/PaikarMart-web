import { useOrderTrackingStore, Order } from '@/modules/orders/orderTrackingStore';
import { CommerceItem } from '../types';

export interface CreateOrderPayload {
  items: CommerceItem[];
  totalAmount: number;
  deliveryCharge: number;
  addressId: string;
  paymentMethod: string;
  domain: string; // The primary domain or 'mixed'
}

export const orderService = {
  createOrder: async (payload: CreateOrderPayload) => {
    // Simulate API call to backend
    console.log('Finalizing Order:', payload);
    
    return new Promise((resolve) => {
      setTimeout(() => {
        const orderId = `PM-ORD-${Math.random().toString(36).substr(2, 6).toUpperCase()}`;
        
        // Add to tracking store
        const newOrder: Order = {
          id: orderId,
          total: payload.totalAmount,
          items: payload.items.map(item => ({
            productTitle: item.name,
            productImage: item.image,
            quantity: item.quantity,
            lineTotal: item.price * item.quantity,
            vendorName: (item.metadata as any)?.supermarket || (item.metadata as any)?.restaurantId || 'Paikar Seller'
          })),
          status: 'ORDER_CREATED',
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString(),
          address: payload.addressId,
          deliveryMethod: 'Standard Delivery',
          paymentMethod: payload.paymentMethod,
          activities: [
            {
              status: 'ORDER_CREATED',
              timestamp: new Date().toISOString(),
              source: 'system',
              description: 'Order successfully placed'
            }
          ],
          escrowStatus: {
            lockedAmount: payload.totalAmount,
            releaseCondition: 'delivery_confirmed',
            isReleased: false,
            refundEligible: true
          }
        };

        useOrderTrackingStore.getState().addOrder(newOrder);

        resolve({
          success: true,
          orderId: orderId,
          message: 'Order placed successfully!'
        });
      }, 2000);
    });
  }
};
