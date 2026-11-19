import React from 'react';
import { cn } from '@/lib/utils';

export interface ProductCardSkeletonProps {
  className?: string;
  viewMode?: 'grid' | 'list';
}

/**
 * Standardized skeleton for UnifiedPostCard (Standard Commerce Card)
 */
export const ProductCardSkeleton: React.FC<ProductCardSkeletonProps> = ({ 
  className
}) => {
  return (
    <div className={cn(
      "w-full bg-[var(--pm-surface)] border border-[var(--pm-border)] rounded-2xl sm:rounded-3xl p-4 flex flex-col gap-4 overflow-hidden relative shadow-xs",
      className
    )}>
      {/* Header Skeleton (Author) */}
      <div className="flex items-center gap-3">
        <div className="w-10 h-10 rounded-full skeleton-shimmer shrink-0" />
        <div className="flex flex-col gap-2 flex-1">
          <div className="h-3 w-24 rounded-full skeleton-shimmer" />
          <div className="h-2 w-16 rounded-full skeleton-shimmer" />
        </div>
      </div>

      {/* Content Skeleton */}
      <div className="space-y-2">
        <div className="h-3 w-full rounded-full skeleton-shimmer" />
        <div className="h-3 w-4/5 rounded-full skeleton-shimmer" />
      </div>

      {/* Media Skeleton (Aspect Square) */}
      <div className="aspect-square w-full rounded-2xl skeleton-shimmer" />

      {/* Footer Skeleton */}
      <div className="flex items-center justify-between pt-2 border-t border-[var(--pm-border)]/40">
        <div className="flex gap-3">
          <div className="w-8 h-8 rounded-xl skeleton-shimmer" />
          <div className="w-8 h-8 rounded-xl skeleton-shimmer" />
        </div>
        <div className="h-9 w-20 rounded-xl skeleton-shimmer" />
      </div>
    </div>
  );
};

export const ProductListSkeleton: React.FC<{ count?: number; className?: string; viewMode?: 'grid' | 'list' }> = ({
  count = 8,
  className
}) => {
  return (
    <div className={cn(
      "grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 sm:gap-6",
      className
    )}>
      {Array.from({ length: count }).map((_, i) => (
        <ProductCardSkeleton key={i} />
      ))}
    </div>
  );
};

export default ProductCardSkeleton;
