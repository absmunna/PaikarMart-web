import { ProductCard } from "./ProductCard";
import { Product } from "@/modules/app/api/client/hooks";
import { GlassCard } from "@/components/ui/GlassCard";

interface ProductGridProps {
  products?: Product[];
  emptyMessage?: string;
  isLoading?: boolean;
  skeletonCount?: number;
}

export function ProductGrid({
  products,
  emptyMessage = "No products found.",
  isLoading = false,
  skeletonCount = 8,
}: ProductGridProps) {
  if (isLoading || products === undefined) {
    return (
      <div className="product-sink-grid">
        {Array.from({ length: skeletonCount }).map((_, i) => (
          <GlassCard key={i} className="h-full overflow-hidden bg-[var(--pm-surface)]">
            <div className="aspect-[4/3] skeleton-shimmer" />
            <div className="p-4 flex flex-col gap-2">
              <div className="h-3 w-1/2 rounded skeleton-shimmer" />
              <div className="h-4 w-full rounded skeleton-shimmer" />
              <div className="h-4 w-1/3 rounded skeleton-shimmer mt-1" />
            </div>
          </GlassCard>
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
    <div className="product-sink-grid">
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
