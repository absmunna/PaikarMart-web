import React from 'react';
import { cn } from "@/lib/utils";

export interface CategoryFilterItem {
  id: string;
  label: string;
  labelBn?: string;
  icon?: any;
  color?: string;
}

export interface CategoryNavBarProps {
  context?: string;
  activeFilter?: string;
  onFilterChange?: (id: string) => void;
  items?: CategoryFilterItem[];
  topOffset?: string;
}

export const CategoryNavBar: React.FC<CategoryNavBarProps> = ({
  context,
  activeFilter = 'all',
  onFilterChange = () => {},
  items,
  topOffset = '0px'
}) => {
  const defaultCategories: CategoryFilterItem[] = [
    { id: 'all', label: 'All Feed' },
    { id: 'electronics', label: 'Electronics' },
    { id: 'fashion', label: 'Fashion' },
    { id: 'grocery', label: 'Grocery' },
    { id: 'pharmacy', label: 'Pharmacy' },
    { id: 'home', label: 'Home' },
  ];

  const categories = items && items.length > 0 ? items : defaultCategories;

  return (
    <div
      className="sticky z-40 bg-[var(--pm-surface)]/85 backdrop-blur-xl border-b border-[var(--pm-border)] overflow-x-auto no-scrollbar"
      style={{ top: topOffset }}
    >
      <div className="flex gap-2 p-2 max-w-7xl mx-auto">
        {categories.map((cat) => (
          <button
            key={cat.id}
            onClick={() => onFilterChange(cat.id)}
            className={cn(
              "px-4 py-2 rounded-xl text-xs font-bold transition-all whitespace-nowrap",
              activeFilter === cat.id
                ? "bg-[var(--pm-accent)] text-white shadow-md shadow-[var(--pm-accent)]/20"
                : "text-[var(--pm-muted)] hover:text-[var(--pm-text)] hover:bg-[var(--pm-surface-hover)]"
            )}
          >
            {cat.label}
          </button>
        ))}
      </div>
    </div>
  );
};
