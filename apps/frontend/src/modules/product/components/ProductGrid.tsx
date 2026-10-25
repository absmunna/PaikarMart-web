import { ProductCard } from "./ProductCard";
import { ProductCardSkeleton } from "@/components/ui/ProductCard/ProductCardSkeleton";
import { Product } from "@/modules/app";

interface ProductGridProps {
  products?: Product[];
  emptyMessage?: string;
  isLoading?: boolean;
  skeletonCount?: number;
  viewMode?: 'grid' | 'list';
}

export function ProductGrid({
  products,
  emptyMessage = "No products found.",
  isLoading = false,
  skeletonCount = 8,
  viewMode = 'grid',
}: ProductGridProps) {
  if (isLoading || products === undefined) {
    return (
      <div className={viewMode === 'list' ? 'flex flex-col gap-3' : 'grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-4 gap-3.5 sm:gap-4'}>
        {Array.from({ length: skeletonCount }).map((_, i) => (
          <ProductCardSkeleton key={i} viewMode={viewMode} />
        ))}
      </div>
    );
  }

  if (products.length === 0) {
    return (
      <div className="py-16 text-center text-[var(--pm-text-secondary)] border border-[var(--pm-border)] border-dashed rounded-3xl bg-[var(--pm-surface)]/50">
        <p>{emptyMessage}</p>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">
      {products.map((product, i) => (
        <div
          key={product.id}
          className="animate-in fade-in slide-in-from-bottom-4"
          style={{ animationDelay: `${Math.min(i, 10) * 40}ms` }}
        >
          <ProductCard product={product} />
        </div>
      ))}
    </div>
  );
}
