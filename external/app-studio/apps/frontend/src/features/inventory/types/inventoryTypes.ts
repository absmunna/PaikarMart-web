import { CommerceItem } from '@/types';

export type InventoryFilter = 'all' | 'inStock' | 'outOfStock';

export interface InventoryProductCardProps {
  item: CommerceItem;
  isBn: boolean;
  isHighlighted?: boolean;
  onCreatePromoPost: (product: CommerceItem) => void;
}
