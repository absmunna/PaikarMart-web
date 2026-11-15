import { useMemo, useState } from 'react';
import { CommerceItem } from '@/types';
import { InventoryFilter } from '@/features/inventory/types/inventoryTypes';
import { filterInventoryProducts, selectCommerceProducts } from '@/features/inventory/services/inventoryService';

export function useSellerInventory(products: CommerceItem[]) {
  const [searchQuery, setSearchQuery] = useState('');
  const [inventoryFilter, setInventoryFilter] = useState<InventoryFilter>('all');

  const commerceProducts = useMemo(() => selectCommerceProducts(products), [products]);

  const filteredProducts = useMemo(() => {
    return filterInventoryProducts(commerceProducts, searchQuery, inventoryFilter);
  }, [commerceProducts, inventoryFilter, searchQuery]);

  return {
    commerceProducts,
    filteredProducts,
    searchQuery,
    setSearchQuery,
    inventoryFilter,
    setInventoryFilter,
  };
}
