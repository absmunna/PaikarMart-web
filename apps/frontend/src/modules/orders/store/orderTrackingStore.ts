import { create } from 'zustand';
import { persist } from 'zustand/middleware';

export type OrderState =
  | 'ORDER_CREATED'
  | 'PAYMENT_CONFIRMED'
  | 'PACKING'
  | 'READY_FOR_PICKUP'
  | 'PICKED_UP'
  | 'IN_TRANSIT'
  | 'OUT_FOR_DELIVERY'
  | 'DELIVERED'
  | 'COMPLETED';

export interface OrderActivity {
  status: OrderState;
  timestamp: string;
  source: 'system' | 'seller' | 'logistics';
  description: string;
}

export interface Order {
  id: string;
  orderNo?: string;
  total: number;
  items: any[];
  status: OrderState;
  createdAt: string;
  updatedAt: string;
  address: string;
  deliveryMethod: string;
  paymentMethod: string;
  activities: OrderActivity[];
  riderInfo?: {
    name: string;
    phone: string;
    location?: { lat: number; lng: number };
    distance?: string;
    eta?: string;
  };
  escrowStatus: {
    lockedAmount: number;
    releaseCondition: string;
    isReleased: boolean;
    refundEligible: boolean;
    disputeStatus?: 'none' | 'opened' | 'resolved';
    disputeReason?: string;
    inspectionDaysRemaining?: number;
    releasedAt?: string;
  };
}

interface OrderTrackingState {
  orders: Order[];
  activeOrder: Order | null;
  setOrders: (orders: Order[]) => void;
  updateOrder: (orderId: string, updates: Partial<Order>) => void;
  setActiveOrder: (order: Order | null) => void;
  addOrder: (order: Order) => void;
  releaseEscrow: (orderId: string) => Promise<void>;
  raiseDispute: (orderId: string, reason: string) => Promise<void>;
}

export const useOrderTrackingStore = create<OrderTrackingState>()(
  persist(
    (set, get) => ({
      orders: [],
      activeOrder: null,
      setOrders: (orders) => set({ orders }),
      addOrder: (order) => set((state) => ({ orders: [order, ...state.orders] })),
      updateOrder: (orderId, updates) => set((state) => {
        const updatedOrders = state.orders.map(o => o.id === orderId ? { ...o, ...updates } : o);
        const updatedActive = state.activeOrder?.id === orderId ? { ...state.activeOrder, ...updates } : state.activeOrder;
        return { orders: updatedOrders, activeOrder: updatedActive };
      }),
      setActiveOrder: (order) => set({ activeOrder: order }),

      releaseEscrow: async (orderId: string) => {
        // Call backend escrow release endpoint
        fetch(`/api/v1/escrow/release/${orderId}`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ amount: 1500 })
        }).catch(() => {});

        // Update local store
        const timestamp = new Date().toISOString();
        get().updateOrder(orderId, {
          status: 'COMPLETED',
          updatedAt: timestamp,
          escrowStatus: {
            lockedAmount: 0,
            releaseCondition: 'ক্রেতা কর্তৃক পণ্য ডেলিভারি সন্তোষজনক নিশ্চিতকরণ সম্পন্ন',
            isReleased: true,
            refundEligible: false,
            disputeStatus: 'none',
            releasedAt: timestamp
          },
          activities: [
            ...(get().orders.find(o => o.id === orderId)?.activities || []),
            {
              status: 'COMPLETED',
              timestamp,
              source: 'system',
              description: 'ক্রেতা কর্তৃক পণ্য সন্তোষজনক ডেলিভারি নিশ্চিত হয়েছে। এসক্রো ব্যালেন্স বিক্রেতার অ্যাকাউন্টে সফলভাবে রিলিজ করা হয়েছে।'
            }
          ]
        });
      },

      raiseDispute: async (orderId: string, reason: string) => {
        // Call backend dispute endpoint
        fetch(`/api/v1/escrow/dispute/${orderId}`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ reason })
        }).catch(() => {});

        const timestamp = new Date().toISOString();
        const existingOrder = get().orders.find(o => o.id === orderId);
        if (!existingOrder) return;

        get().updateOrder(orderId, {
          updatedAt: timestamp,
          escrowStatus: {
            ...existingOrder.escrowStatus,
            disputeStatus: 'opened',
            disputeReason: reason,
            releaseCondition: 'ডিসপুট রিভিউ চলছে — এসক্রো ব্যালেন্স সাময়িকভাবে অবরুদ্ধ',
            refundEligible: true
          },
          activities: [
            ...existingOrder.activities,
            {
              status: existingOrder.status,
              timestamp,
              source: 'system',
              description: `৭-দিনের ইনস্পেকশন ডিসপুট দাখিল করা হয়েছে: "${reason}"। পেইকারমার্ট কমপ্লায়েন্স টীম বিষয়টি পর্যালোচনা করছে।`
            }
          ]
        });
      }
    }),
    {
      name: 'pm-orders-storage-v1',
    }
  )
);
