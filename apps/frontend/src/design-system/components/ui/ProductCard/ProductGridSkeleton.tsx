import React from 'react';
import { cn } from '@/lib/utils';
import { ProductCardSkeleton } from './ProductCardSkeleton';

export interface ProductGridSkeletonProps {
  count?: number;
  className?: string;
  viewMode?: 'grid' | 'list';
}

export const ProductGridSkeleton: React.FC<ProductGridSkeletonProps> = ({
  count = 8,
  className,
  viewMode = 'grid',
}) => {
  return (
    <div className={cn(
      viewMode === 'list' 
        ? 'flex flex-col gap-3' 
        : 'grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-4 gap-3.5 sm:gap-4',
      className
    )}>
      {Array.from({ length: count }).map((_, i) => (
        <ProductCardSkeleton key={i} viewMode={viewMode} />
      ))}
    </div>
  );
};
