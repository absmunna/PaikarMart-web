import React from 'react';
import { Search, Building2, SlidersHorizontal, Factory, Ship, Award, Package, Layers } from 'lucide-react';

export type WholesaleSupplierFilter = 'all' | 'factory' | 'importer' | 'exporter' | 'dealer' | 'stocklot';
export type MOQFilter = 'all' | 'low' | 'medium' | 'high';

interface WholesaleFilterBarProps {
  searchQuery: string;
  onSearchChange: (q: string) => void;
  selectedCategory: WholesaleSupplierFilter;
  onSelectCategory: (cat: WholesaleSupplierFilter) => void;
  selectedMOQ: MOQFilter;
  onSelectMOQ: (moq: MOQFilter) => void;
  totalItemsCount: number;
}

export const WholesaleFilterBar: React.FC<WholesaleFilterBarProps> = ({
  searchQuery,
  onSearchChange,
  selectedCategory,
  onSelectCategory,
  selectedMOQ,
  onSelectMOQ,
  totalItemsCount,
}) => {
  const categories: { id: WholesaleSupplierFilter; label: string; icon: React.FC<{ className?: string }> }[] = [
    { id: 'all', label: 'All Wholesale', icon: Layers },
    { id: 'factory', label: 'Direct Factories', icon: Factory },
    { id: 'importer', label: 'Primary Importers', icon: Ship },
    { id: 'exporter', label: 'Export Surplus', icon: Package },
    { id: 'dealer', label: 'Authorized Dealers', icon: Award },
    { id: 'stocklot', label: 'Stock Lots', icon: Building2 },
  ];

  return (
    <div className="space-y-3">
      {/* Search & MOQ Row */}
      <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-2.5">
        <div className="relative flex-1">
          <Search className="absolute left-3.5 top-2.5 w-4 h-4 text-[var(--pm-muted)]" />
          <input
            type="text"
            placeholder="Search wholesale products, factories, mill rates, or bulk SKUs..."
            value={searchQuery}
            onChange={(e) => onSearchChange(e.target.value)}
            className="w-full pl-10 pr-4 py-2 text-xs rounded-xl border border-[var(--pm-border)] bg-[var(--pm-input)] text-[var(--pm-text)] placeholder:text-[var(--pm-muted)] focus:outline-none focus:border-[var(--pm-accent)] shadow-sm"
          />
        </div>

        {/* MOQ Segmented filter */}
        <div className="flex items-center gap-1 p-1 bg-[var(--pm-surface)] rounded-xl border border-[var(--pm-border)] shrink-0">
          <span className="text-[10px] uppercase font-semibold text-[var(--pm-muted)] px-2 flex items-center gap-1">
            <SlidersHorizontal className="w-3 h-3" />
            MOQ:
          </span>
          {(['all', 'low', 'medium', 'high'] as MOQFilter[]).map((moq) => (
            <button
              key={moq}
              onClick={() => onSelectMOQ(moq)}
              className={`px-2.5 py-1 text-[11px] font-medium rounded-lg transition-all whitespace-nowrap cursor-pointer ${
                selectedMOQ === moq
                  ? 'bg-[var(--pm-card)] text-[var(--pm-text)] shadow-xs'
                  : 'text-[var(--pm-muted)] hover:text-[var(--pm-text)]'
              }`}
            >
              {moq === 'all' && 'All'}
              {moq === 'low' && '< 50 pcs'}
              {moq === 'medium' && '50-200 pcs'}
              {moq === 'high' && '200+ pcs'}
            </button>
          ))}
        </div>
      </div>

      {/* Supplier Category Tabs */}
      <div className="flex items-center justify-between gap-3 border-b border-[var(--pm-border)] pb-2.5 overflow-x-auto no-scrollbar">
        <div className="flex items-center gap-1.5">
          {categories.map((cat) => {
            const Icon = cat.icon;
            const isActive = selectedCategory === cat.id;
            return (
              <button
                key={cat.id}
                onClick={() => onSelectCategory(cat.id)}
                className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium transition-all whitespace-nowrap shrink-0 cursor-pointer border ${
                  isActive
                    ? 'bg-[var(--pm-accent)] text-[var(--pm-accent-fg)] border-transparent shadow-xs'
                    : 'bg-[var(--pm-surface)] border-[var(--pm-border)] text-[var(--pm-muted)] hover:text-[var(--pm-text)]'
                }`}
              >
                <Icon className="w-3.5 h-3.5" />
                {cat.label}
              </button>
            );
          })}
        </div>

        <div className="text-[11px] text-[var(--pm-muted)] font-mono tabular-nums whitespace-nowrap shrink-0 hidden md:block">
          {totalItemsCount} B2B Listings
        </div>
      </div>
    </div>
  );
};
