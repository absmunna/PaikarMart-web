import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { toast } from 'sonner';

export type OrderStatus = 'pending' | 'confirmed' | 'shipped' | 'delivered';
export type SellerTier = 'factory' | 'wholesaler' | 'local_shop' | 'rider';

export interface OrderItem {
  id: string; // product id
  name: string;
  price: number;
  quantity: number;
  sellerId: string;
  sellerTier: SellerTier;
}

export interface Order {
  id: string;
  items: OrderItem[];
  totalAmount: number;
  status: OrderStatus;
  createdAt: string;
  customerId: string;
}

interface OrderStore {
  orders: Order[];
  createOrder: (items: OrderItem[], customerId: string) => Promise<string>;
  updateOrderStatus: (orderId: string, newStatus: OrderStatus) => void;
  getOrdersBySeller: (sellerId: string) => Order[];
  getOrdersByCustomer: (customerId: string) => Order[];
}

export const useOrderStore = create<OrderStore>()(
  persist(
    (set, get) => ({
      orders: [],
      
      createOrder: async (items, customerId) => {
        const totalAmount = items.reduce((sum, item) => sum + item.price * item.quantity, 0);
        
        // Multi-tier inventory validation hook would trigger here
        // E.g. Check stock in factory/wholesaler/local shop respective databases

        const newOrder: Order = {
          id: `ORD-${Date.now().toString(36).toUpperCase()}`,
          items,
          totalAmount,
          status: 'pending',
          createdAt: new Date().toISOString(),
          customerId,
        };

        set((state) => ({
          orders: [newOrder, ...state.orders]
        }));
        
        toast.success(`Order ${newOrder.id} created successfully`);
        return newOrder.id;
      },
      
      updateOrderStatus: (orderId, newStatus) => {
        set((state) => ({
          orders: state.orders.map(order => 
            order.id === orderId 
              ? { ...order, status: newStatus } 
              : order
          )
        }));
        toast.success(`Order updated to ${newStatus}`);
      },
      
      getOrdersBySeller: (sellerId) => {
        return get().orders.filter(order => 
          order.items.some(item => item.sellerId === sellerId)
        );
      },
      
      getOrdersByCustomer: (customerId) => {
        return get().orders.filter(order => order.customerId === customerId);
      }
    }),
    {
      name: 'paikar-mart-orders',
    }
  )
);
