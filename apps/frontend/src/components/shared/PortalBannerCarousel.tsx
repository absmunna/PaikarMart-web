import React, { useState, useEffect } from 'react';
import { ChevronLeft, ChevronRight, Sparkles, ArrowRight, Tag, Zap, ShieldCheck } from 'lucide-react';

export interface BannerSlide {
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
  badgeColor: string;
  imageUrl?: string;
}

interface PortalBannerCarouselProps {
  portalType: 'market' | 'wholesale' | 'services' | 'transit' | 'creator' | 'explore' | 'wallet' | 'orders';
  isBn: boolean;
  onCtaClick?: (slideId: string) => void;
}

const PORTAL_SLIDES: Record<string, BannerSlide[]> = {
  market: [
    {
      id: 'm_1',
      tagEn: 'COMMERCE MEGA FEST',
      tagBn: 'মেগা কমার্স ফেস্ট',
      titleEn: 'Factory Direct Retail Deals - Up to 45% Off',
      titleBn: 'ফ্যাক্টরি রেটে খুচরা কেনাকাটা — ৪৫% পর্যন্ত ছাড়',
      descEn: 'Verified authentic brands with 24-hour hyperlocal delivery across Bangladesh.',
      descBn: 'সারাদেশে ২৪ ঘণ্টার মধ্যে হাইপারলোকাল হোম ডেলিভারি ও অরিজিনাল ব্র্যান্ড গ্যারান্টি।',
      ctaEn: 'Explore Deals',
      ctaBn: 'অফার দেখুন',
      bgGradient: 'from-blue-600 via-indigo-600 to-purple-700',
      badgeColor: 'bg-white/20 text-white',
    },
    {
      id: 'm_2',
      tagEn: '24/7 PHARMACY & RX',
      tagBn: '২৪/৭ ফার্মেসি ও ওষুধ',
      titleEn: 'Instant Prescription Upload & Verified Drugs',
      titleBn: 'প্রেসক্রিপশন আপলোড করুন ও দ্রুত ওষুধ পান',
      descEn: 'Get authentic medicines delivered within 30 minutes from nearby licensed pharmacies.',
      descBn: 'নিকটস্থ লাইসেন্সপ্রাপ্ত ফার্মেসি থেকে ৩০ মিনিটে খাঁটি ওষুধ ডেলিভারি।',
      ctaEn: 'Upload Prescription',
      ctaBn: 'প্রেসক্রিপশন দিন',
      bgGradient: 'from-teal-600 via-emerald-600 to-cyan-700',
      badgeColor: 'bg-white/20 text-white',
    },
    {
      id: 'm_3',
      tagEn: 'BUYER DEMAND RFQ',
      tagBn: 'ডিমান্ড বোর্ড (RFQ)',
      titleEn: 'Post Your Product Requirement & Get Bids',
      titleBn: 'আপনার প্রয়োজনীয় পণ্যের রিকোয়েস্ট পোস্ট করুন',
      descEn: 'Let verified suppliers and wholesalers compete to give you the lowest price.',
      descBn: 'সাপ্লায়ার ও পাইকারদের কাছ থেকে সেরা মূল্যের কোটেশন সংগ্রহ করুন।',
      ctaEn: 'Post Demand',
      ctaBn: 'ডিমান্ড পোস্ট করুন',
      bgGradient: 'from-amber-600 via-orange-600 to-red-700',
      badgeColor: 'bg-white/20 text-white',
    },
  ],
  wholesale: [
    {
      id: 'w_1',
      tagEn: 'CHAWKBAZAR B2B SOURCING',
      tagBn: 'চকবাজার পাইকারি মোকাম',
      titleEn: 'Direct Mill Sourcing & Volume MOQ Tiers',
      titleBn: 'সরাসরি মিল গেট রেট ও ভলিউম ডিসকাউন্ট',
      descEn: 'Empower your retail shop with factory-direct wholesale pricing and secure L/C terms.',
      descBn: 'ফ্যাক্টরি রেটে পাইকারি পণ্য কিনে আপনার রিটেইল দোকানের প্রফিট মার্জিন বাড়ান।',
      ctaEn: 'Browse Bulk Lots',
      ctaBn: 'পাইকারি লট দেখুন',
      bgGradient: 'from-amber-700 via-yellow-700 to-stone-900',
      badgeColor: 'bg-amber-400/20 text-amber-200',
    },
    {
      id: 'w_2',
      tagEn: 'EXPORT & IMPORT HUB',
      tagBn: 'এক্সপোর্ট ও ইম্পোর্ট হাব',
      titleEn: 'Global Container Shipping & Escrow Protection',
      titleBn: 'গ্লোবাল কন্টেইনার শিপিং ও এসক্রো সিকিউরিটি',
      descEn: 'Certified bonded warehouse inventory with inspection guarantee before fund release.',
      descBn: 'ফান্ড রিলিজের আগে সম্পূর্ণ পরিদর্শন গ্যারান্টি সহ সার্টিফাইড গুদামজাত পণ্য।',
      ctaEn: 'View Export Catalog',
      ctaBn: 'আমদানি ক্যাটালগ',
      bgGradient: 'from-blue-800 via-slate-800 to-indigo-950',
      badgeColor: 'bg-blue-400/20 text-blue-200',
    },
  ],
  services: [
    {
      id: 's_1',
      tagEn: 'PRO REPAIR & MAINTENANCE',
      tagBn: 'সার্টিফাইড টেকনিশিয়ান সেবা',
      titleEn: 'Verified AC & Appliance Experts Near You',
      titleBn: 'কাছাকাছি অভিজ্ঞ ও ভেরিফাইড টেকনিশিয়ান',
      descEn: 'Book expert AC master service, plumbing, and electrical repairs with 30-day warranty.',
      descBn: 'এসি সার্ভিসিং, প্লাম্বিং ও ইলেকট্রিক্যাল কাজ বুক করুন ৩০ দিনের সার্ভিস ওয়ারেন্টি সহ।',
      ctaEn: 'Book Technician',
      ctaBn: 'টেকনিশিয়ান বুক করুন',
      bgGradient: 'from-emerald-700 via-teal-700 to-slate-900',
      badgeColor: 'bg-emerald-400/20 text-emerald-200',
    },
    {
      id: 's_2',
      tagEn: 'WALLET CASHBACK OFFER',
      tagBn: 'ওয়ালেট পেমেন্ট ক্যাশব্যাক',
      titleEn: 'Save 5% Instantly Paying via Escrow Wallet',
      titleBn: 'এসক্রো ওয়ালেটে পেমেন্ট করলে তাৎক্ষণিক ৫% সাশ্রয়',
      descEn: 'Secure milestone bookings with zero cancellation fee and verified professional tracking.',
      descBn: 'জিরো ক্যান্সেলেশন ফি এবং ভেরিফাইড প্রফেশনাল ট্র্যাকিং সহ নিরাপদ সার্ভিস বুকিং।',
      ctaEn: 'Add Funds',
      ctaBn: 'টাকা যোগ করুন',
      bgGradient: 'from-purple-700 via-indigo-800 to-slate-900',
      badgeColor: 'bg-purple-400/20 text-purple-200',
    },
  ],
  transit: [
    {
      id: 't_1',
      tagEn: 'EXPRESS BIKE & CAR RIDES',
      tagBn: 'ইনস্ট্যান্ট রাইড ও পার্সেল',
      titleEn: 'Fastest Commute & Doorstep Courier Dispatch',
      titleBn: 'দ্রুততম যাতায়াত ও ডোরস্টেপ পার্সেল ডেলিভারি',
      descEn: 'Live GPS tracking, professional helmet riders, and verified commercial drivers.',
      descBn: 'লাইভ জিপিএস ট্র্যাকিং, দক্ষ রাইডার এবং ভেরিফাইড ড্রাইভারের সাথে নিরাপদ ট্রানজিট।',
      ctaEn: 'Request Ride',
      ctaBn: 'রাইড খুঁজুন',
      bgGradient: 'from-sky-700 via-blue-800 to-slate-950',
      badgeColor: 'bg-sky-400/20 text-sky-200',
    },
    {
      id: 't_2',
      tagEn: 'B2B CARGO TRUCK RENTALS',
      tagBn: 'বিটুবি কার্গো ও ট্রাক রেন্টাল',
      titleEn: 'Hire Covered Vans & Pickups for Intercity Trade',
      titleBn: 'ইন্টারসিটি ব্যবসার জন্য কাভার্ড ভ্যান ও পিকআপ ভাড়া নিন',
      descEn: 'Transparent tonnage rates, GPS monitored freight, and instant waybill receipts.',
      descBn: 'স্বচ্ছ ভাড়ার হার, জিপিএস মনিটরিং ফ্রেট এবং ইনস্ট্যান্ট ওয়েবিল রিসিট।',
      ctaEn: 'Rent Cargo',
      ctaBn: 'ট্রাক ভাড়া নিন',
      bgGradient: 'from-orange-700 via-amber-800 to-stone-900',
      badgeColor: 'bg-orange-400/20 text-orange-200',
    },
  ],
  creator: [
    {
      id: 'c_1',
      tagEn: 'PAIKARMART CREATOR OTT',
      tagBn: 'ক্রিয়েটর ওটিটি স্টুডিও',
      titleEn: 'Exclusive Business Masterclasses & Trade Docs',
      titleBn: 'এক্সক্লুসিভ বিজনেস মাস্টারক্লাস ও ট্রেড ডকুমেন্টারি',
      descEn: 'Learn import strategies, digital marketing, and wholesale scaling from industry leaders.',
      descBn: 'ইম্পোর্ট স্ট্র্যাটেজি, ডিজিটাল মার্কেটিং এবং হোলসেল ব্যবসা বাড়ানোর সঠিক কৌশল শিখুন।',
      ctaEn: 'Watch Series',
      ctaBn: 'ভিডিও দেখুন',
      bgGradient: 'from-rose-700 via-red-800 to-slate-950',
      badgeColor: 'bg-rose-400/20 text-rose-200',
    },
  ],
  explore: [
    {
      id: 'e_1',
      tagEn: 'SUPER APP COMMAND CENTER',
      tagBn: 'সুপার অ্যাপ কমান্ড সেন্টার',
      titleEn: '28+ Integrated Portals for Complete Ecosystem',
      titleBn: 'সম্পূর্ণ ইকোসিস্টেমের জন্য ২৮+ ইন্টিগ্রেটেড পোর্টাল',
      descEn: 'Seamlessly switch between retail shopping, B2B wholesale, rides, wallet, and creator studio.',
      descBn: 'খুচরা শপিং, পাইকারি মোকাম, রাইড, ওয়ালেট এবং ক্রিয়েটর স্টুডিওর মধ্যে নির্বিঘ্নে যাতায়াত করুন।',
      ctaEn: 'Explore All',
      ctaBn: 'সব দেখুন',
      bgGradient: 'from-indigo-700 via-purple-800 to-slate-950',
      badgeColor: 'bg-indigo-400/20 text-indigo-200',
    },
  ],
  wallet: [
    {
      id: 'vl_1',
      tagEn: 'SECURE ESCROW PROTECTION',
      tagBn: 'নিরাপদ এসক্রো প্রটেকশন',
      titleEn: 'Zero-Risk B2B & Retail Payments via Escrow',
      titleBn: 'এসক্রোর মাধ্যমে শতভাগ ঝুঁকিমুক্ত লেনদেন',
      descEn: 'Funds are held securely in escrow and released only after delivery confirmation.',
      descBn: 'পণ্য হাতে পাওয়ার পর কনফার্ম করলে তবেই ভেন্ডরের কাছে টাকা রিলিজ হয়।',
      ctaEn: 'View Escrow',
      ctaBn: 'এসক্রো লেজার',
      bgGradient: 'from-emerald-800 via-teal-900 to-slate-950',
      badgeColor: 'bg-emerald-400/20 text-emerald-200',
    },
  ],
  orders: [
    {
      id: 'o_1',
      tagEn: 'REAL-TIME WAYBILL TRACKING',
      tagBn: 'রিয়েল-টাইম ওয়েবিল ট্র্যাকিং',
      titleEn: 'Live Courier Dispatch & Delivery Status',
      titleBn: 'লাইভ কুরিয়ার ডিসপাচ ও ডেলিভারি স্ট্যাটাস',
      descEn: 'Track your retail packages, bulk wholesale shipments, and service bookings instantly.',
      descBn: 'আপনার খুচরা পার্সেল, পাইকারি শিপমেন্ট এবং সার্ভিস বুকিংয়ের লাইভ আপডেট জানুন।',
      ctaEn: 'Track Order',
      ctaBn: 'অর্ডার ট্র্যাক করুন',
      bgGradient: 'from-blue-700 via-slate-800 to-indigo-950',
      badgeColor: 'bg-blue-400/20 text-blue-200',
    },
  ],
};

export const PortalBannerCarousel: React.FC<PortalBannerCarouselProps> = ({
  portalType,
  isBn,
  onCtaClick
}) => {
  const slides = PORTAL_SLIDES[portalType] || PORTAL_SLIDES.market;
  const [currentIndex, setCurrentIndex] = useState(0);

  // Auto slide every 6 seconds
  useEffect(() => {
    if (slides.length <= 1) return;
    const interval = setInterval(() => {
      setCurrentIndex((prev) => (prev + 1) % slides.length);
    }, 6000);
    return () => clearInterval(interval);
  }, [slides.length]);

  const currentSlide = slides[currentIndex] || slides[0];

  const handleNext = () => {
    setCurrentIndex((prev) => (prev + 1) % slides.length);
  };

  const handlePrev = () => {
    setCurrentIndex((prev) => (prev - 1 + slides.length) % slides.length);
  };

  return (
    <div className={`relative overflow-hidden rounded-[2rem] bg-gradient-to-r ${currentSlide.bgGradient} p-5 sm:p-6 text-white shadow-lg transition-all duration-500`}>
      <div className="absolute inset-0 bg-black/10 backdrop-blur-[1px]" />

      <div className="relative z-10 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div className="space-y-1.5 max-w-xl">
          <div className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-white/20 backdrop-blur-md text-[10px] font-black uppercase tracking-wider">
            <Sparkles className="w-3 h-3 text-amber-300 animate-pulse" />
            <span>{isBn ? currentSlide.tagBn : currentSlide.tagEn}</span>
          </div>

          <h2 className="text-lg sm:text-2xl font-black tracking-tight leading-tight">
            {isBn ? currentSlide.titleBn : currentSlide.titleEn}
          </h2>

          <p className="text-xs text-white/90 line-clamp-2 max-w-lg font-medium">
            {isBn ? currentSlide.descBn : currentSlide.descEn}
          </p>
        </div>

        <div className="flex items-center gap-3 shrink-0 self-stretch sm:self-auto justify-between sm:justify-start">
          <button
            type="button"
            onClick={() => onCtaClick?.(currentSlide.id)}
            className="px-4 py-2.5 rounded-xl bg-white text-slate-950 text-xs font-black shadow-md hover:bg-slate-100 transition-all active:scale-95 flex items-center gap-1.5 cursor-pointer whitespace-nowrap"
          >
            <span>{isBn ? currentSlide.ctaBn : currentSlide.ctaEn}</span>
            <ArrowRight className="w-3.5 h-3.5 text-slate-950" />
          </button>

          {slides.length > 1 && (
            <div className="flex items-center gap-1 bg-black/20 backdrop-blur-md border border-white/20 rounded-xl p-1">
              <button
                type="button"
                onClick={handlePrev}
                aria-label="Previous slide"
                className="p-1.5 rounded-lg hover:bg-white/20 text-white transition-colors cursor-pointer"
              >
                <ChevronLeft className="w-3.5 h-3.5" />
              </button>
              <span className="text-[10px] font-mono px-1 font-bold">
                {currentIndex + 1}/{slides.length}
              </span>
              <button
                type="button"
                onClick={handleNext}
                aria-label="Next slide"
                className="p-1.5 rounded-lg hover:bg-white/20 text-white transition-colors cursor-pointer"
              >
                <ChevronRight className="w-3.5 h-3.5" />
              </button>
            </div>
          )}
        </div>
      </div>

      {/* Indicator dots */}
      {slides.length > 1 && (
        <div className="relative z-10 flex items-center justify-center gap-1.5 mt-3">
          {slides.map((s, idx) => (
            <button
              key={s.id}
              onClick={() => setCurrentIndex(idx)}
              aria-label={`Go to slide ${idx + 1}`}
              className={`h-1.5 rounded-full transition-all cursor-pointer ${
                currentIndex === idx ? 'w-6 bg-white' : 'w-1.5 bg-white/40'
              }`}
            />
          ))}
        </div>
      )}
    </div>
  );
};
