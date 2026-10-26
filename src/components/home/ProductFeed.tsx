import React from 'react';
import { ProductCard } from '@/components/ui/ProductCard';

const products = [
  { id: 1, name: 'স্মার্টফোন কেস', price: '৳ 299', rating: '4.5', reviews: '89' },
  { id: 2, name: 'ওয়্যারলেস ইয়ারবাড', price: '৳ 1,299', rating: '4.8', reviews: '234' },
  { id: 3, name: 'টি-শার্ট কালেকশন', price: '৳ 599', rating: '4.2', reviews: '156' },
  { id: 4, name: 'স্কিনকেয়ার সেট', price: '৳ 899', rating: '4.7', reviews: '312' },
  { id: 5, name: 'ব্লুটুথ স্পিকার', price: '৳ 2,199', rating: '4.6', reviews: '178' },
  { id: 6, name: 'ব্যাগ কালেকশন', price: '৳ 749', rating: '4.3', reviews: '95' },
];

export const ProductFeed = () => {
  return (
    <section className="flex flex-col gap-6 px-4 pb-10">
      {/* Featured Products */}
      <div className="flex flex-col gap-3">
        <div className="flex items-center justify-between">
          <h2 className="font-bold text-[var(--pm-text)]">ফিচার্ড পণ্য</h2>
          <button className="text-[var(--pm-accent)] text-sm font-medium">সব দেখুন →</button>
        </div>
        <div className="flex flex-row gap-3 overflow-x-auto hide-scrollbar pb-2">
          {products.map((p) => (
            <ProductCard key={p.id} product={p} className="w-[160px]" />
          ))}
        </div>
      </div>

      {/* For You Grid */}
      <div className="flex flex-col gap-3">
        <div className="flex items-center justify-between">
          <h2 className="font-bold text-[var(--pm-text)]">আপনার জন্য</h2>
          <button className="text-[var(--pm-accent)] text-sm font-medium">সব দেখুন →</button>
        </div>
        <div className="grid grid-cols-2 gap-3">
          {products.map((p) => (
            <ProductCard key={p.id} product={p} className="w-full" />
          ))}
        </div>
      </div>
    </section>
  );
};
