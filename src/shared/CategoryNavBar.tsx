import React, { useState } from 'react';
import { cn } from "@/lib/utils";

export interface CategoryFilterItem {
  id: string;
  label: string;
  icon?: any;
  count?: number;
  [key: string]: any;
}

export interface CategoryNavBarProps {
  context?: string;
  activeFilter?: string;
  onFilterChange?: (id: string) => void;
  items?: CategoryFilterItem[];
  categories?: CategoryFilterItem[];
  topOffset?: string;
  className?: string;
  [key: string]: any;
}

export const CategoryNavBar: React.FC<CategoryNavBarProps> = ({ 
  context, 
  activeFilter: controlledActiveFilter, 
  onFilterChange,
  items,
  categories: customCategories,
  topOffset = '0px',
  className = ""
}) => {
  const [internalFilter, setInternalFilter] = useState('all');
  const activeFilter = controlledActiveFilter ?? internalFilter;

  const defaultCategories: CategoryFilterItem[] = [
    { id: 'all', label: 'All Feed' },
    { id: 'electronics', label: 'Electronics' },
    { id: 'fashion', label: 'Fashion' },
    { id: 'grocery', label: 'Grocery' },
    { id: 'pharmacy', label: 'Pharmacy' },
    { id: 'home', label: 'Home' },
  ];

  const list = items || customCategories || defaultCategories;

  const handleSelect = (id: string) => {
    setInternalFilter(id);
    if (onFilterChange) {
      onFilterChange(id);
    }
  };

  return (
    <div 
      className={cn("sticky z-40 bg-[#04070f]/80 backdrop-blur-xl border-b border-white/5 overflow-x-auto no-scrollbar", className)}
      style={{ top: topOffset }}
    >
      <div className="flex gap-2 p-2 max-w-7xl mx-auto">
        {list.map((cat) => (
          <button
            key={cat.id}
            type="button"
            onClick={() => handleSelect(cat.id)}
            className={cn(
              "px-4 py-2 rounded-xl text-xs font-bold transition-all whitespace-nowrap cursor-pointer",
              activeFilter === cat.id 
                ? "bg-[#FF7A00] text-white shadow-md shadow-[#FF7A00]/20" 
                : "text-zinc-400 hover:text-white hover:bg-white/10"
            )}
          >
            {cat.label}
          </button>
        ))}
      </div>
    </div>
  );
};
