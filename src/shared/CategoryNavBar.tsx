import React from 'react';
import { cn } from "@/lib/utils";

interface CategoryNavBarProps {
  context: string;
  activeFilter: string;
  onFilterChange: (id: string) => void;
  topOffset?: string;
}

export const CategoryNavBar: React.FC<CategoryNavBarProps> = ({ 
  context, 
  activeFilter, 
  onFilterChange,
  topOffset = '0px'
}) => {
  const categories = [
    { id: 'all', label: 'All Feed' },
    { id: 'electronics', label: 'Electronics' },
    { id: 'fashion', label: 'Fashion' },
    { id: 'grocery', label: 'Grocery' },
    { id: 'pharmacy', label: 'Pharmacy' },
    { id: 'home', label: 'Home' },
  ];

  return (
    <div 
      className="sticky z-40 bg-[#04070f]/80 backdrop-blur-xl border-b border-white/5 overflow-x-auto no-scrollbar"
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
