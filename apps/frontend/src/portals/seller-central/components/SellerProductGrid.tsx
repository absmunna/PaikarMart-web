import React from 'react';
import { Edit3, Trash2, Eye, ShoppingCart } from 'lucide-react';

export const SellerProductGrid: React.FC<{ products: any[] }> = ({ products }) => {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
      {products.map((product) => (
        <div key={product.id} className="bg-white/5 border border-white/5 rounded-2xl p-4 flex gap-4">
          <div className="w-20 h-20 rounded-xl bg-zinc-900 overflow-hidden shrink-0">
            <img src={product.images?.[0] || product.image || ''} alt={product.title} className="w-full h-full object-cover" />
          </div>
          <div className="flex-1 min-w-0">
            <h3 className="text-sm font-bold text-white truncate">{product.title}</h3>
            <p className="text-xs font-black text-cyan-400 mt-1">৳{product.price}</p>
            <div className="flex gap-4 mt-3">
              <div className="flex flex-col">
                <span className="text-[8px] uppercase font-bold text-zinc-500">Views</span>
                <span className="text-[10px] font-black text-white">{product.views}</span>
              </div>
              <div className="flex flex-col">
                <span className="text-[8px] uppercase font-bold text-zinc-500">Sales</span>
                <span className="text-[10px] font-black text-white">{product.sales}</span>
              </div>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
};
