import { CommerceItem } from '@/types';
import { InventoryFilter } from '@/features/inventory/types/inventoryTypes';

export function selectCommerceProducts(products: CommerceItem[]): CommerceItem[] {
  return products.filter((product) =>
    product.tradeMode === 'retail' ||
    product.tradeMode === 'wholesale' ||
    product.type === 'retail' ||
    product.type === 'wholesale'
  );
}

export function filterInventoryProducts(
  products: CommerceItem[],
  searchQuery: string,
  inventoryFilter: InventoryFilter
): CommerceItem[] {
  const query = searchQuery.trim().toLowerCase();
  return products.filter((item) => {
    const matchesQuery = !query || `${item.title} ${item.category} ${item.storeName}`.toLowerCase().includes(query);
    const matchesStock = inventoryFilter === 'all' || (inventoryFilter === 'inStock' ? item.inStock : !item.inStock);
    return matchesQuery && matchesStock;
  });
}
