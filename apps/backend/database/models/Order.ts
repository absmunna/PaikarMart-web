// backend/database/models/Order.ts
export interface OrderInterface {
  id: string;
  userId: string;
  productId: string;
  status: 'pending' | 'completed' | 'cancelled';
}
