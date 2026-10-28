import { ProductCard } from "./ProductCard";
import { ProductGridSkeleton } from "@/components/ui/ProductCard/ProductGridSkeleton";
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
    return <ProductGridSkeleton count={skeletonCount} viewMode={viewMode} />;
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
