import React from 'react';
import { Link } from 'react-router-dom';

const mockTrending = [
  { id: '1', title: 'Organic Spinach', price: 45, images: ['https://images.unsplash.com/photo-1576045057995-568f588f82fb?q=80&w=200&auto=format&fit=crop'] },
  { id: '2', title: 'Smart Watch 9', price: 2500, images: ['https://images.unsplash.com/photo-1546868871-70c122467d9b?q=80&w=200&auto=format&fit=crop'] },
  { id: '3', title: 'Nakshi Kantha', price: 1200, images: ['https://images.unsplash.com/photo-1583391733956-6c78276477e2?q=80&w=200&auto=format&fit=crop'] },
  { id: '4', title: 'Premium Sneakers', price: 3500, images: ['https://images.unsplash.com/photo-1595950653106-6c9ebd614d3a?q=80&w=200&auto=format&fit=crop'] },
];

export const TrendingRail = () => {
  return (
    <div className="bg-[var(--pm-surface)] rounded-3xl border border-[var(--pm-border)] shadow-sm p-4">
      <h3 className="font-black text-[var(--pm-text)] mb-4 tracking-tight">ট্রেন্ডিং প্রোডাক্ট</h3>
      <div className="grid grid-cols-2 gap-3">
        {mockTrending.map((product) => {
          const img = product.images[0];
          return (
            <Link
              key={product.id}
              to={`/b2c/product/${product.id}`}
              className="group relative rounded-2xl overflow-hidden border border-[var(--pm-border)] bg-[var(--pm-bg)] shadow-sm"
            >
              <div className="aspect-square bg-[var(--pm-surface-hover)]">
                <img
                  src={img}
                  alt={product.title}
                  className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
                />
              </div>
              <div className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-black/90 to-transparent p-2.5 pt-6">
                <p className="text-xs font-bold text-white truncate drop-shadow-sm">{product.title}</p>
                <p className="text-xs text-[var(--pm-accent)] font-black drop-shadow-sm">৳ {product.price}</p>
              </div>
            </Link>
          );
        })}
      </div>
    </div>
  );
};
