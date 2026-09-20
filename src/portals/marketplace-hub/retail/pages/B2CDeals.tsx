import React from 'react';
import { motion } from 'motion/react';
import { ArrowLeft, Tag, Flame, ShieldCheck } from 'lucide-react';
import { useLanguage } from '@/features/language/LanguageContext';
import { ProductCard } from "@/features/product/components/ProductCard";

export interface B2CDealsProps {
  products: any[];
  onBack: () => void;
  onSelectProduct: (product: any) => void;
}

export const B2CDeals: React.FC<B2CDealsProps> = ({ products, onBack, onSelectProduct }) => {
  const { isBn } = useLanguage();

  // Filter flash sale items
  const dealProducts = products.filter(p => p.isFlashSale);

  return (
    <div className="bg-[#020604] min-h-screen text-white pb-20 p-5 max-w-[480px] mx-auto">
      {/* Header */}
      <div className="flex items-center gap-4 mb-6">
        <button onClick={onBack} className="h-11 w-11 flex items-center justify-center rounded-2xl bg-zinc-950 border border-white/5 hover:bg-zinc-900 active:scale-95 transition-all">
          <ArrowLeft className="h-5 w-5 text-white" />
        </button>
        <div>
          <h1 className="text-sm font-black text-white uppercase tracking-widest">
            {isBn ? "আজকের ডিলস" : "Deals of the Day"}
          </h1>
          <p className="text-[10px] text-cyan-400 font-bold uppercase tracking-widest mt-0.5">
            Hot Promotions
          </p>
        </div>
      </div>

      <div className="space-y-6">
        {/* Deal card banner */}
        <div className="bg-gradient-to-r from-orange-500/20 to-rose-600/20 rounded-[2.5rem] p-6 border border-orange-500/30 relative overflow-hidden flex flex-col justify-between h-48">
          <div className="absolute top-0 right-0 p-8 opacity-10">
            <Tag size={120} className="text-white" />
          </div>

          <div className="relative z-10 space-y-2 text-left">
            <span className="px-2.5 py-1 rounded-lg bg-orange-500/20 border border-orange-500/30 text-[8px] font-black text-orange-400 uppercase tracking-widest flex items-center gap-1.5 w-fit">
              <Flame size={12} className="animate-pulse" />
              {isBn ? "সীমিত সময়ের অফার" : "Flash Sale Offer"}
            </span>
            <h2 className="text-lg font-black tracking-tight leading-snug">
              {isBn ? "ইসলামপুর পাইকারি মূল্যে কেনাকাটা করুন!" : "Shop at Islampur wholesale prices!"}
            </h2>
            <p className="text-[10px] text-zinc-400 font-bold uppercase tracking-widest">
              {isBn ? "সব পণ্যে ৫০% পর্যন্ত ছাড়" : "Up to 50% discount on all items"}
            </p>
          </div>
        </div>

        {/* List of deals */}
        {dealProducts.length > 0 ? (
          <div className="grid grid-cols-2 gap-4">
            {dealProducts.map((p) => (
              <div key={p.id} onClick={() => onSelectProduct(p)} className="cursor-pointer">
                <ProductCard product={p} />
              </div>
            ))}
          </div>
        ) : (
          <div className="py-12 flex flex-col items-center justify-center text-center">
            <div className="w-16 h-16 bg-white/5 rounded-2xl flex items-center justify-center mb-4 border border-white/5">
              <Tag className="text-zinc-700" />
            </div>
            <p className="text-zinc-500 text-xs font-bold uppercase tracking-widest">
              {isBn ? "নতুন ডিল আসছে..." : "More hot deals dropping soon..."}
            </p>
          </div>
        )}
      </div>
    </div>
  );
};
