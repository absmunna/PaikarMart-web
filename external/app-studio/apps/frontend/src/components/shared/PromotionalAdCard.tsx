import React, { useState } from 'react';
import { Sparkles, ArrowRight, Tag, ShieldCheck, Zap } from 'lucide-react';

export interface AdCardData {
  id: string;
  tagEn: string;
  tagBn: string;
  titleEn: string;
  titleBn: string;
  descEn: string;
  descBn: string;
  ctaEn: string;
  ctaBn: string;
  bgGradient: string;
  discountBadge?: string;
  imageUrl?: string;
}

const SAMPLE_AD_CARDS: AdCardData[] = [
  {
    id: 'ad_1',
    tagEn: 'SPONSORED MEGA DEAL',
    tagBn: 'স্পন্সরড মেগা অফার',
    titleEn: 'Factory Direct Retail Deals — Up to 45% Off',
    titleBn: 'ফ্যাক্টরি রেটে খুচরা কেনাকাটা — ৪৫% পর্যন্ত ছাড়',
    descEn: 'Verified authentic brands with 24-hour hyperlocal delivery across Bangladesh.',
    descBn: 'সারাদেশে ২৪ ঘণ্টার মধ্যে হাইপারলোকাল হোম ডেলিভারি ও অরিজিনাল ব্র্যান্ড গ্যারান্টি।',
    ctaEn: 'Grab Offer',
    ctaBn: 'অফার নিন',
    bgGradient: 'from-blue-600 via-indigo-600 to-purple-700',
    discountBadge: '45% OFF',
    imageUrl: 'https://images.unsplash.com/photo-1607083206869-4c7672e72a8a?auto=format&fit=crop&w=600&h=450&q=80',
  },
  {
    id: 'ad_2',
    tagEn: '24/7 PHARMACY & RX',
    tagBn: '২৪/৭ ফার্মেসি ও ওষুধ',
    titleEn: 'Instant Prescription Upload & Verified Drugs',
    titleBn: 'প্রেসক্রিপশন আপলোড করুন ও দ্রুত ওষুধ পান',
    descEn: 'Get authentic medicines delivered within 30 minutes from nearby licensed pharmacies.',
    descBn: 'নিকটস্থ লাইসেন্সপ্রাপ্ত ফার্মেসি থেকে ৩০ মিনিটে খাঁটি ওষুধ ডেলিভারি।',
    ctaEn: 'Upload Rx',
    ctaBn: 'প্রেসক্রিপশন দিন',
    bgGradient: 'from-teal-600 via-emerald-600 to-cyan-700',
    discountBadge: '30 MIN',
    imageUrl: 'https://images.unsplash.com/photo-1584308666744-24d5c474f2ae?auto=format&fit=crop&w=600&h=450&q=80',
  },
  {
    id: 'ad_3',
    tagEn: 'ESCROW PROTECTION',
    tagBn: 'এসক্রো ক্যাশব্যাক',
    titleEn: 'Save 5% Instantly Paying via Escrow Wallet',
    titleBn: 'এসক্রো ওয়ালেটে পেমেন্ট করলে ৫% ইনস্ট্যান্ট সাশ্রয়',
    descEn: 'Secure milestone bookings with zero cancellation fee and verified tracking.',
    descBn: 'জিরো ক্যান্সেলেশন ফি এবং ভেরিফাইড ট্র্যাকিং সহ নিরাপদ সার্ভিস বুকিং।',
    ctaEn: 'Add Funds',
    ctaBn: 'ওয়ালেট',
    bgGradient: 'from-amber-600 via-orange-600 to-red-700',
    discountBadge: '5% CASHBACK',
    imageUrl: 'https://images.unsplash.com/photo-1559526324-4b87b5e36e44?auto=format&fit=crop&w=600&h=450&q=80',
  },
  {
    id: 'ad_4',
    tagEn: 'B2B SOURCING RFQ',
    tagBn: 'পাইকারি ডিমান্ড বোর্ড',
    titleEn: 'Post Your Product Requirement & Get Bids',
    titleBn: 'আপনার প্রয়োজনীয় পণ্যের রিকোয়েস্ট পোস্ট করুন',
    descEn: 'Let verified suppliers and wholesalers compete to give you the lowest price.',
    descBn: 'সাপ্লায়ার ও পাইকারদের কাছ থেকে সেরা মূল্যের কোটেশন সংগ্রহ করুন।',
    ctaEn: 'Post RFQ',
    ctaBn: 'পোস্ট করুন',
    bgGradient: 'from-purple-700 via-pink-700 to-slate-900',
    discountBadge: 'BEST BIDS',
    imageUrl: 'https://images.unsplash.com/photo-1586528116311-ad8dd3c8310d?auto=format&fit=crop&w=600&h=450&q=80',
  },
];

interface PromotionalAdCardProps {
  index: number;
  isBn: boolean;
  onCtaClick?: (adId: string) => void;
}

export const PromotionalAdCard: React.FC<PromotionalAdCardProps> = ({
  index,
  isBn,
  onCtaClick,
}) => {
  const ad = SAMPLE_AD_CARDS[index % SAMPLE_AD_CARDS.length];

  return (
    <div
      onClick={() => onCtaClick?.(ad.id)}
      className="p-2.5 rounded-[2rem] bg-[var(--pm-card)] text-[var(--pm-text)] border border-[var(--pm-accent)]/40 transition-shadow hover:shadow-xl flex flex-col justify-between gap-2.5 group cursor-pointer premium-shadow active-scale relative overflow-hidden"
    >
      <div className="space-y-2.5">
        <div className={`relative aspect-[4/3] rounded-[1.5rem] overflow-hidden bg-gradient-to-br ${ad.bgGradient} p-3.5 flex flex-col justify-between text-white shadow-md`}>
          <div className="absolute inset-0 bg-black/15 backdrop-blur-[1px]" />

          <div className="relative z-10 flex items-center justify-between">
            <span className="px-2 py-0.5 rounded-full bg-white/20 backdrop-blur-md text-[9px] font-bold text-white flex items-center gap-1">
              <Sparkles className="w-2.5 h-2.5 text-amber-300" />
              <span>{isBn ? ad.tagBn : ad.tagEn}</span>
            </span>

            {ad.discountBadge && (
              <span className="px-2 py-0.5 rounded-full bg-amber-400 text-slate-950 font-black text-[9px] uppercase tracking-wider shadow-sm">
                {ad.discountBadge}
              </span>
            )}
          </div>

          <div className="relative z-10 space-y-1 my-auto">
            <h3 className="text-sm sm:text-base font-black tracking-tight leading-tight line-clamp-2 text-white">
              {isBn ? ad.titleBn : ad.titleEn}
            </h3>
            <p className="text-[11px] text-white/90 line-clamp-2 font-medium">
              {isBn ? ad.descBn : ad.descEn}
            </p>
          </div>

          <div className="relative z-10 pt-2 flex items-center justify-between">
            <span className="text-[9px] font-bold text-white/80 flex items-center gap-1">
              <ShieldCheck className="w-3 h-3 text-emerald-300" />
              <span>Sponsored Ad</span>
            </span>
            <div className="px-3 py-1.5 rounded-xl bg-white text-slate-950 text-[11px] font-black shadow-md flex items-center gap-1 group-hover:bg-slate-100 transition-colors">
              <span>{isBn ? ad.ctaBn : ad.ctaEn}</span>
              <ArrowRight className="w-3 h-3" />
            </div>
          </div>
        </div>

      </div>

      <div className="pt-2 border-t border-[var(--pm-border)] flex items-center justify-between gap-2">
        <span className="text-[10px] font-bold text-[var(--pm-muted)] flex items-center gap-1 min-w-0">
          <Zap className="w-3.5 h-3.5 text-amber-500" />
          <span className="truncate">{isBn ? 'স্পন্সরড অফার' : 'Sponsored offer'} · #{index + 1}</span>
        </span>
        <button
          type="button"
          onClick={(e) => {
            e.stopPropagation();
            onCtaClick?.(ad.id);
          }}
          className="px-3 py-1.5 rounded-xl bg-[var(--pm-accent)] text-[var(--pm-accent-fg)] text-[11px] font-bold hover:opacity-90 active:scale-95 transition-all cursor-pointer"
        >
          {isBn ? ad.ctaBn : ad.ctaEn}
        </button>
      </div>
    </div>
  );
};
