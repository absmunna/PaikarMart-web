import React from 'react';
import { Search } from 'lucide-react';
import { InventoryFilter } from '@/features/inventory/types/inventoryTypes';

interface InventoryToolbarProps {
  isBn: boolean;
  searchQuery: string;
  filter: InventoryFilter;
  visibleCount: number;
  totalCount: number;
  onSearchChange: (value: string) => void;
  onFilterChange: (value: InventoryFilter) => void;
}

export const InventoryToolbar: React.FC<InventoryToolbarProps> = ({
  isBn,
  searchQuery,
  filter,
  visibleCount,
  totalCount,
  onSearchChange,
  onFilterChange,
}) => (
  <div className="bg-[var(--pm-card)] border border-[var(--pm-border)] rounded-2xl p-3 sm:p-4 flex flex-col sm:flex-row gap-3 sm:items-center sm:justify-between">
    <div className="relative flex-1 min-w-0">
      <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-[var(--pm-muted)]" />
      <input
        type="search"
        value={searchQuery}
        onChange={(event) => onSearchChange(event.target.value)}
        placeholder={isBn ? 'প্রোডাক্ট, ক্যাটাগরি বা SKU খুঁজুন' : 'Search product, category or SKU'}
        className="w-full pl-9 pr-3 py-2.5 rounded-xl bg-[var(--pm-input)] border border-[var(--pm-border)] text-xs text-[var(--pm-text)] placeholder:text-[var(--pm-muted)] focus:border-[var(--pm-accent)] focus:outline-none"
      />
    </div>
    <div className="flex items-center gap-2">
      <span className="text-[11px] font-bold text-[var(--pm-muted)] whitespace-nowrap">
        {visibleCount}/{totalCount} {isBn ? 'টি SKU' : 'SKUs'}
      </span>
      <select
        value={filter}
        onChange={(event) => onFilterChange(event.target.value as InventoryFilter)}
        className="px-3 py-2.5 rounded-xl bg-[var(--pm-input)] border border-[var(--pm-border)] text-xs font-bold text-[var(--pm-text)] focus:border-[var(--pm-accent)] focus:outline-none"
        aria-label={isBn ? 'ইনভেন্টরি ফিল্টার' : 'Inventory filter'}
      >
        <option value="all">{isBn ? 'সব স্টক' : 'All stock'}</option>
        <option value="inStock">{isBn ? 'স্টকে আছে' : 'In stock'}</option>
        <option value="outOfStock">{isBn ? 'স্টক শেষ' : 'Out of stock'}</option>
      </select>
    </div>
  </div>
);
