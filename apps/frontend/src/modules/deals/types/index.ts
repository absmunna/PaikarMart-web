import { Product } from '@/modules/product/types/product.types';

export interface ExclusiveDeal {
  id: string;
  productId: string;
  product: Product;
  dealPrice: number;
  initialStock: number;
  currentStock: number;
  startTime: string;
  endTime: string;
  isActive: boolean;
  createdAt: string;
}
