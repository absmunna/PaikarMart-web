import React, { useState } from 'react';
import { motion } from 'motion/react';
import { ArrowLeft, Star, Heart, CheckCircle2, Bookmark, Gift, ShieldAlert, BadgeInfo } from 'lucide-react';
import { ProductCard } from "@/features/product/components/ProductCard";
import { Product } from '@/modules/product/types/product.types';
import { toast } from 'sonner';

interface B2CBrandProfileProps {
  brandId: string; // e.g., 'Aarong', 'Samsung', 'Bata', etc.
  products: Product[];
  onBack: () => void;
  onSelectProduct: (product: Product) => void;
}

export const B2CBrandProfile: React.FC<B2CBrandProfileProps> = ({ 
  brandId, 
  products, 
  onBack,
  onSelectProduct
}) => {
  const [isLikedBrand, setIsLikedBrand] = useState(false);
  const [followers, setFollowers] = useState(4820);

  // Mapped brand items
  const brandProducts = products.filter(p => {
    const bId = (brandId || "").toLowerCase();
    return (p.sellerId && p.sellerId.toLowerCase().includes(bId)) || 
           (p.seller && p.seller.toLowerCase().includes(bId)) ||
           (p.title && p.title.toLowerCase().includes(bId)) ||
           (p.name && p.name.toLowerCase().includes(bId));
  });

  const handleFollowBrand = () => {
    if (isLikedBrand) {
      setFollowers(followers - 1);
      setIsLikedBrand(false);
    } else {
      setFollowers(followers + 1);
      setIsLikedBrand(true);
      toast.success(`আপনি ${brandId} স্পেশাল চ্যানেল সাবস্ক্রাইব করেছেন!`);
    }
  };

  // Pre-configured custom details per brand
  const brandDetails: Record<string, { banner: string, logo: string, desc: string, established: string }> = {
    'Bata': {
      banner: 'https://images.unsplash.com/photo-1549298916-b41d501d3772?auto=format&fit=crop&w=500&q=80',
      logo: '🥾',
      desc: 'বাটা হলো গুণমান সম্পন্ন দীর্ঘস্থায়ী ও স্টাইলিশ জুতার আন্তর্জাতিক প্রতীক। গত কয়েক দশক ধরে এটি বিশ্বজুড়ে কোটি কোটি গ্রাহকদের আস্থার চূড়ান্ত সমাধান প্রদান করে চলেছে।',
      established: '১৮৯৪'
    },
    'Aarong': {
      banner: 'https://images.unsplash.com/photo-1583391733956-6c78276477e2?auto=format&fit=crop&w=500&q=80',
      logo: '🧵',
      desc: 'আড়ং বাংলাদেশের দেশীয় ঐতিহ্যের শীর্ষস্থানীয় আধুনিক ও ট্র্যাডিশনাল ফ্যাশন ব্র্যান্ড। প্রতিটি সূক্ষ্ম সুতোর গাঁথনিতে মিশে আছে বাংলার বিশুদ্ধ কারুশিল্পীদের অপার হাতের ছোঁয়া।',
      established: '১৯৭৮'
    },
    'Unilever': {
      banner: 'https://images.unsplash.com/photo-1608248597279-f99d160bfcbc?auto=format&fit=crop&w=500&q=80',
      logo: '🧼',
      desc: 'ইউনিলিভার হলো বিশ্বের কোটি মানুষের দৈনন্দিন রূপচর্চা, পরিষ্কার পরিচ্ছন্নতা, ও লাইফস্টাইল পণ্য সরবরাহের এক নির্ভরযোগ্য বৈশ্বিক পথিকৃৎ ও অভিভাবক।',
      established: '১৯২৯'
    }
  };

  const currentBrand = brandDetails[brandId] || {
    banner: 'https://images.unsplash.com/photo-1542496658-e33a6d0d50f6?auto=format&fit=crop&w=500&q=80',
    logo: '🏷️',
    desc: `${brandId} নিয়ে এসেছে যুগের সাথে তাল মিলিয়ে আধুনিক পণ্যের সেরা কালেকশন যা শতভাগ অথেন্টিসিটি ও পিকার-সুরক্ষা গ্যারান্টির দ্বারা সংরক্ষিত।`,
    established: '২০০৮'
  };

  return (
    <div className="w-full bg-[var(--pm-bg)] min-h-screen text-[var(--pm-text)] pb-24 text-left">
      {/* Search menu headers */}
      <div className="sticky top-16 z-50 bg-[var(--pm-bg)]/90 backdrop-blur-md px-4 py-3 flex items-center justify-between border-b border-white/[0.08]">
        <div className="flex items-center gap-3">
          <button 
            onClick={onBack}
            className="p-2 -ml-1 rounded-full hover:bg-white/5 text-[var(--pm-text)] transition-colors active:scale-95"
          >
            <ArrowLeft className="w-5 h-5" />
          </button>
          <span className="text-xs font-black uppercase tracking-wider text-[var(--pm-text-secondary)]">ব্র্যান্ড কর্নার</span>
        </div>
      </div>

      {/* Cover background */}
      <div className="h-32 sm:h-36 relative overflow-hidden bg-zinc-900 border-b border-white/5">
        <img src={currentBrand.banner} alt={brandId} className="w-full h-full object-cover opacity-60" />
        <div className="absolute inset-0 bg-gradient-to-t from-black via-black/40 to-transparent" />
        <span className="absolute bottom-3 left-4 bg-[var(--pm-accent)] text-white text-[8px] font-black tracking-widest px-2 py-0.5 rounded uppercase">
          Authorized Brand Hub
        </span>
      </div>

      {/* Brand Profile Details card block */}
      <div className="px-4 -mt-8 relative z-10">
        <div className="flex items-end justify-between">
          <div className="w-16 h-16 rounded-2xl bg-[var(--pm-surface)] border-2 border-[var(--pm-bg)] flex items-center justify-center font-black text-2xl shadow-xl">
            {currentBrand.logo}
          </div>
          <button 
            onClick={handleFollowBrand}
            className={`px-4.5 py-1.5 rounded-full text-[10px] font-black uppercase tracking-wider transition-all active:scale-95 ${
              isLikedBrand 
                ? 'bg-cyan-500/10 text-cyan-400 border border-cyan-500/20'
                : 'bg-[var(--pm-accent)] hover:bg-[var(--pm-accent-hover)] text-white'
            }`}
          >
            {isLikedBrand ? 'রিসিভড' : 'সাবস্ক্রাইব'}
          </button>
        </div>

        <div className="mt-3.5 space-y-1.5 select-none">
          <div className="flex items-center gap-1.5">
            <h1 className="text-lg font-black text-white">{brandId} Brand</h1>
            <CheckCircle2 className="w-4 h-4 text-cyan-400 fill-cyan-400/10 shrink-0" />
          </div>
          <div className="flex items-center gap-2 text-[9px] text-[var(--pm-text-secondary)] font-extrabold uppercase tracking-wide">
            <span>প্রতিষ্ঠিত: {currentBrand.established} খ্রিষ্টাব্দ</span>
            <span>•</span>
            <span>{followers.toLocaleString('bn-BD')} জন গ্রাহক</span>
          </div>
        </div>

        {/* Brand Core info description */}
        <div className="mt-4 p-4 rounded-xl border border-white/[0.06] bg-white/5 text-[10px] text-[var(--pm-text-secondary)] leading-relaxed font-semibold flex gap-2.5">
          <BadgeInfo className="w-4.5 h-4.5 text-orange-400 shrink-0 mt-0.5" />
          <p>{currentBrand.desc}</p>
        </div>

        {/* Product listing headline */}
        <div className="mt-6 space-y-4">
          <h3 className="text-[11px] font-black text-white uppercase tracking-wider">রিলিজড পার্টনার কালেকশনস</h3>
          
          {brandProducts.length === 0 ? (
            <div className="grid grid-cols-[repeat(auto-fill,minmax(145px,1fr))] sm:grid-cols-[repeat(auto-fill,minmax(175px,1fr))] md:grid-cols-[repeat(auto-fill,minmax(205px,1fr))] lg:grid-cols-[repeat(auto-fill,minmax(225px,1fr))] gap-4 sm:gap-5">
              {/* Fallback to display standard fashion/electronics elements of this sub layout */}
              {products.slice(0, 4).map(itm => (
                <ProductCard
                  key={itm.id}
                  product={itm}
                />
              ))}
            </div>
          ) : (
            <div className="grid grid-cols-[repeat(auto-fill,minmax(145px,1fr))] sm:grid-cols-[repeat(auto-fill,minmax(175px,1fr))] md:grid-cols-[repeat(auto-fill,minmax(205px,1fr))] lg:grid-cols-[repeat(auto-fill,minmax(225px,1fr))] gap-4 sm:gap-5">
              {brandProducts.map(itm => (
                <ProductCard
                  key={itm.id}
                  product={itm}
                />
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
