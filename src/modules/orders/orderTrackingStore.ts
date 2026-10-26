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
  };
}

interface OrderTrackingState {
  orders: Order[];
  activeOrder: Order | null;
  setOrders: (orders: Order[]) => void;
  updateOrder: (orderId: string, updates: Partial<Order>) => void;
  setActiveOrder: (order: Order | null) => void;
  addOrder: (order: Order) => void;
}

export const useOrderTrackingStore = create<OrderTrackingState>()(
  persist(
    (set) => ({
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
    }),
    {
      name: 'pm-orders-storage-v1',
    }
  )
);
