import { useListCategories, getListCategoriesQueryKey } from "@/modules/app/api/client/hooks";
import { Link } from "react-router-dom";
import * as Icons from "lucide-react";

export function CategoryChips({ activeId }: { activeId?: string }) {
  const { data: categories } = useListCategories({ query: { queryKey: getListCategoriesQueryKey() } });

  if (!categories?.length) return null;

  return (
    <div className="flex overflow-x-auto gap-2 pb-1 no-scrollbar items-center">
      <Link 
        to="/marketplace" 
        className={`shrink-0 flex items-center gap-1.5 px-3.5 py-1.5 rounded-2xl border text-[11px] font-black transition-all ${
          !activeId 
            ? "bg-[var(--pm-accent)]/15 border-[var(--pm-accent)]/20 text-[var(--pm-accent)]" 
            : "bg-white/[0.02] border-white/[0.05] text-zinc-500 hover:text-zinc-300 hover:border-white/[0.12]"
        }`}
      >
        All
      </Link>
      
      {categories.map((category: any) => {
        const IconComponent = (Icons as any)[category.icon ?? ''] || Icons.Tag;
        const isActive = activeId === category.id;
        
        return (
          <Link 
            key={category.id}
            to={`/marketplace?categoryId=${category.id}`} 
            className={`shrink-0 flex items-center gap-1.5 px-3.5 py-1.5 rounded-2xl border text-[11px] font-black transition-all ${
              isActive 
                ? "bg-[var(--pm-accent)]/15 border-[var(--pm-accent)]/20 text-[var(--pm-accent)]" 
                : "bg-white/[0.02] border-white/[0.05] text-zinc-500 hover:text-zinc-300 hover:border-white/[0.12]"
            }`}
          >
            <IconComponent className="w-3.5 h-3.5" />
            <span>{category.name}</span>
          </Link>
        );
      })}
    </div>
  );
}
