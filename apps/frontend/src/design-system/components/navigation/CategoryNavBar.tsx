import React from 'react';
import { cn } from "@/lib/utils";
import { DynamicCategoryBar } from './DynamicCategoryBar';
import { PortalContextType } from '@/shared/constants/categoriesData';

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
  activeFilter, 
  onFilterChange,
  items,
  topOffset = '0px'
}) => {
  // If no custom items and no onFilterChange handler, RootLayout's global DynamicCategoryBar
  // already provides the context-aware dynamic category bar; return null to prevent duplicate rendering.
  if (!items && !onFilterChange) {
    return null;
  }

  const defaultCategories: CategoryFilterItem[] = [
    { id: 'all', label: 'All Feed', labelBn: 'সব ফিড' },
    { id: 'fashion', label: 'Fashion', labelBn: 'পোশাক' },
    { id: 'electronics', label: 'Electronics', labelBn: 'ইলেকট্রনিক্স' },
    { id: 'grocery', label: 'Grocery', labelBn: 'মুদি' },
    { id: 'pharmacy', label: 'Pharmacy', labelBn: 'ফার্মেসি' },
    { id: 'home', label: 'Home', labelBn: 'গৃহস্থালি' },
  ];

  const categories = items && items.length > 0 ? items : defaultCategories;

  return (
    <div 
      className="sticky z-40 bg-[var(--pm-bg)]/90 backdrop-blur-xl border-b border-[var(--pm-border)] overflow-x-auto no-scrollbar py-2"
      style={{ top: topOffset }}
    >
      <div className="flex gap-2 px-3 max-w-7xl mx-auto">
        {categories.map((cat) => (
          <button
            key={cat.id}
            onClick={() => onFilterChange && onFilterChange(cat.id)}
            className={cn(
              "px-3.5 py-1.5 rounded-xl text-xs font-black transition-all whitespace-nowrap cursor-pointer",
              activeFilter === cat.id 
                ? "bg-[var(--pm-accent)] text-white shadow-md shadow-[var(--pm-accent)]/20" 
                : "text-[var(--pm-muted)] hover:text-[var(--pm-text)] bg-[var(--pm-surface)]/60 hover:bg-[var(--pm-surface-hover)] border border-[var(--pm-border)]/40"
            )}
          >
            {cat.labelBn || cat.label}
          </button>
        ))}
      </div>
    </div>
  );
};

export default CategoryNavBar;
