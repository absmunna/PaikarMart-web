import React from 'react';
import { useGetTrendingProducts, getGetTrendingProductsQueryKey } from "@/modules/app";
import { formatBDT } from "@/lib/format";
import { Link } from "react-router-dom";

const fallbackTrending = [
  { id: '1', title: 'সুন্দরবনের খাঁটি মধু', price: 850, images: ['https://images.unsplash.com/photo-1587049352847-4d4b126a51d8?auto=format&fit=crop&q=80&w=200'] },
  { id: '2', title: 'স্মার্ট ওয়াচ ৯ প্রো', price: 2500, images: ['https://images.unsplash.com/photo-1546868871-70c122467d9b?q=80&w=200&auto=format&fit=crop'] },
  { id: '3', title: 'জামদানি শাড়ি হোলসেল', price: 1200, images: ['https://images.unsplash.com/photo-1583391733956-6c78276477e2?q=80&w=200&auto=format&fit=crop'] },
  { id: '4', title: 'লেদার জেনুইন ওয়ালেট', price: 1500, images: ['https://images.unsplash.com/photo-1595950653106-6c9ebd614d3a?q=80&w=200&auto=format&fit=crop'] },
];

export const TrendingRail = () => {
  const { data: realProducts, isLoading } = useGetTrendingProducts({ 
    query: { queryKey: getGetTrendingProductsQueryKey() } 
  });

  const products = realProducts && realProducts.length > 0 ? realProducts.slice(0, 4) : fallbackTrending;

  if (isLoading) {
    return (
      <div className="bg-[var(--pm-surface)] rounded-3xl border border-[var(--pm-border)] shadow-sm p-4 animate-pulse">
        <h3 className="font-black text-[var(--pm-text)] mb-4 tracking-tight">ট্রেন্ডিং প্রোডাক্ট</h3>
        <div className="grid grid-cols-2 gap-3">
          {Array.from({ length: 4 }).map((_, i) => (
            <div key={i} className="aspect-square rounded-2xl bg-[var(--pm-surface-hover)] border border-[var(--pm-border)]/50" />
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="bg-[var(--pm-surface)] rounded-3xl border border-[var(--pm-border)] shadow-sm p-4">
      <h3 className="font-black text-[var(--pm-text)] mb-4 tracking-tight">ট্রেন্ডিং প্রোডাক্ট</h3>
      <div className="grid grid-cols-2 gap-3">
        {products.map((product: any) => {
          const img = product.images?.[0] || product.image || 'https://images.unsplash.com/photo-1587049352847-4d4b126a51d8?auto=format&fit=crop&q=80&w=200';
          return (
            <Link
              key={product.id}
              to={`/product/${product.id}`}
              className="group relative rounded-2xl overflow-hidden border border-[var(--pm-border)] bg-[var(--pm-bg)] shadow-sm"
            >
              <div className="aspect-square bg-[var(--pm-surface-hover)]">
                <img
                  src={img}
                  alt={product.title || product.name}
                  className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
                />
              </div>
              <div className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-black/90 to-transparent p-2.5 pt-6">
                <p className="text-xs font-bold text-white truncate drop-shadow-sm">{product.title || product.name}</p>
                <p className="text-xs text-[var(--pm-accent)] font-black drop-shadow-sm">{formatBDT(product.price)}</p>
              </div>
            </Link>
          );
        })}
      </div>
    </div>
  );
};

export default TrendingRail;
