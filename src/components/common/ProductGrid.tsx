import React from 'react';
import ProductCard, { ProductCardProps } from './ProductCard';

interface ProductGridProps {
  products: ProductCardProps[];
  title?: string;
  subtitle?: string;
  columns?: 2 | 3 | 4 | 5;
  className?: string;
  onQuickView?: (product: ProductCardProps) => void;
}

export const ProductGrid: React.FC<ProductGridProps> = ({
  products,
  title,
  subtitle,
  columns = 4,
  className = '',
  onQuickView
}) => {
  const getGridColsClass = () => {
    switch (columns) {
      case 2: return 'grid-cols-2';
      case 3: return 'grid-cols-2 md:grid-cols-3';
      case 5: return 'grid-cols-2 sm:grid-cols-3 md:grid-cols-4 xl:grid-cols-5';
      case 4:
      default:
        return 'grid-cols-2 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4';
    }
  };

  return (
    <div className={`w-full py-4 ${className}`}>
      {title && (
        <div className="flex items-center justify-between mb-4">
          <div>
            <h2 className="text-lg md:text-xl font-black text-zinc-900 dark:text-zinc-100 tracking-tight">
              {title}
            </h2>
            {subtitle && (
              <p className="text-xs text-zinc-500 dark:text-zinc-400 mt-0.5">
                {subtitle}
              </p>
            )}
          </div>
        </div>
      )}

      <div className={`grid ${getGridColsClass()} gap-3 sm:gap-4 product-sink-grid`}>
        {products.map((product) => (
          <ProductCard
            key={product.id}
            {...product}
            onQuickView={onQuickView}
          />
        ))}
      </div>
    </div>
  );
};
