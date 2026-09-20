import React from 'react';
import { useListProducts } from '@/modules/app/api/client/hooks';
import { Link } from 'react-router-dom';
import { Loader2 } from 'lucide-react';
import { ProductCard } from '@/features/product/components/ProductCard';

export const ProductFeed = () => {
  const { data: featuredRaw, isLoading: l1 } = useListProducts({ sort: "rating", limit: "6" } as any);
  const { data: forYouRaw, isLoading: l2 } = useListProducts({ sort: "newest", limit: "6" } as any);

  const featured = Array.isArray(featuredRaw) ? featuredRaw : [];
  const forYou = Array.isArray(forYouRaw) ? forYouRaw : [];

  if (l1 && l2) {
    return (
      <div className="flex items-center justify-center py-16">
        <Loader2 className="w-6 h-6 animate-spin text-[var(--pm-accent)]" />
      </div>
    );
  }

  return (
    <section className="flex flex-col gap-6 px-4 pb-10">
      {/* Featured Products Row */}
      <div className="flex flex-col gap-3">
        <div className="flex items-center justify-between">
          <h2 className="font-bold text-[var(--pm-text)] text-sm uppercase tracking-wider">ফিচার্ড পণ্য</h2>
          <Link to="/marketplace" className="text-primary text-xs font-bold hover:underline">সব দেখুন →</Link>
        </div>
        {featured.length > 0 ? (
          <div className="flex flex-row gap-3.5 overflow-x-auto hide-scrollbar pb-3 scrollbar-none">
            {featured.map((p: any) => (
              <div key={p.id} className="w-[190px] shrink-0">
                <ProductCard product={{
                  ...p,
                  portal: "b2c"
                }} />
              </div>
            ))}
          </div>
        ) : (
          <p className="text-xs text-[var(--pm-text-muted)] text-center py-4">কোনো পণ্য পাওয়া যায়নি</p>
        )}
      </div>

      {/* For You Grid */}
      <div className="flex flex-col gap-3">
        <div className="flex items-center justify-between">
          <h2 className="font-bold text-[var(--pm-text)] text-sm uppercase tracking-wider">আপনার জন্য</h2>
          <Link to="/marketplace" className="text-primary text-xs font-bold hover:underline">সব দেখুন →</Link>
        </div>
        {forYou.length > 0 ? (
          <div className="grid grid-cols-2 gap-3.5">
            {forYou.map((p: any) => (
              <ProductCard key={p.id} product={{ 
                ...p,
                portal: "b2c" 
              }} />
            ))}
          </div>
        ) : (
          <p className="text-xs text-[var(--pm-text-muted)] text-center py-4">কোনো পণ্য পাওয়া যায়নি</p>
        )}
      </div>
    </section>
  );
};
