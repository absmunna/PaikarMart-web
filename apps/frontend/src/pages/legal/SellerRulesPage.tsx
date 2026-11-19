import React from 'react';
import { Gavel, CheckCircle2, ShieldAlert, BadgeInfo, Scale, Sparkles, ArrowLeft, Film, Video } from 'lucide-react';
import { Link } from 'react-router-dom';
import { useAppStore } from '@/modules/app';

export default function SellerRulesPage() {
  const { lang } = useAppStore();

  const rules = [
    {
      title: '১. ট্রেড লাইসেন্স ও ডকুমেন্টেশন (Trade License & Business Verification)',
      text: 'ভেরিফাইড হোলসেলার বা ম্যানুফ্যাকচারার হিসেবে কাজ করতে চাইলে অবশ্যই বৈধ ট্রেড লাইসেন্স, এবং এনআইডি কার্ড দিয়ে অ্যাকাউন্ট সেটআপ করতে হবে। ডুপ্লিকেট অ্যাকাউন্ট বা ফেক ট্রেড ডকুমেন্ট সাবমিট করলে অ্যাকাউন্ট পার্মানেন্ট ব্যান হবে।',
      icon: CheckCircle2,
      color: 'text-cyan-400'
    },
    {
      title: '২. পণ্যের বিবরণ ও সঠিক মূল্য (Product Accuracy & Pricing)',
      text: 'পণ্যের বর্ণনায় আসল ফটো ব্যবহার করা বাধ্যতামূলক। স্টক বা ওজনের কোনো গরমিলা থাকলে তা তাৎক্ষণিক প্রোডাক্ট আপডেট এ সংশোধন করতে হবে। অযৌক্তিক অতিরিক্ত মূল্য বা বিভ্রান্তিকর ডিসকাউন্ট অ্যাডমিন টিম ট্র্যাকিং করবে।',
      icon: BadgeInfo,
      color: 'text-blue-400'
    },
    {
      title: '৩. ডেলিভারি সময়সীমা ও এসক্রো রিলিজ (Fulfillment Timeline & Escrow)',
      text: 'অর্ডার আসার পর ৪৮ ঘণ্টার মধ্যে শিপমেন্ট প্রস্তুত করে আমাদের লজিস্টিকস পার্টনারদের কাছে হস্তান্তর করতে হবে। কাস্টমার পণ্য পাওয়ার পর আমাদের এসক্রো সিস্টেমে পেমেন্ট ভ্যালিডেট করলে আপনার হোলসেলার ওয়ালেটে তা যুক্ত হবে।',
      icon: Scale,
      color: 'text-orange-400'
    },
    {
      title: '৪. ভেজাল ও নকল পণ্য নিষেধাজ্ঞা (Counterfeit & Adulteration Ban)',
      text: 'পাইকার মার্টে কোনো ধরণের কপি, ভেজাল বা নিষিদ্ধ ড্রাগ/লাইসেন্সবিহীন কেমিক্যাল এবং রিফ্যাশন্ড কপি বিক্রি করা সম্পূর্ণ নিষিদ্ধ। কোনো বায়ার জাল প্রডাক্ট প্রুফ সহ রিপোর্ট করলে সেলারের জমানো সিকিউরিটি ওয়ালেটের সম্পূর্ণ টাকা বাজেয়াপ্ত করা হবে।',
      icon: ShieldAlert,
      color: 'text-red-400'
    }
  ];

  const creatorRules = [
    {
      title: '৫. কনটেন্ট ক্রিয়েটর রোল ও ভিডিও ক্যাটাগরি (Creator Roles & 3-Min Standard)',
      text: 'কনটেন্ট ক্রিয়েটরদের জন্য ভিডিওর স্থায়িত্ব ন্যূনতম ৩ মিনিট হতে হবে (ডিটেইলড রিভিউ বা ফ্যাক্টরি ট্যুর)। সেলিং ভিডিও বা রিলসের ক্ষেত্রে ৩০-৬০ সেকেন্ডের শর্ট ফরম্যাট প্রযোজ্য। কপিরাইট ফ্রি অরিজিনাল ভিডিও আপলোড বাধ্যতামূলক।',
      icon: Film,
      color: 'text-purple-400'
    },
    {
      title: '৬. শপেবল ভিডিও কমিশন ও এফিলিয়েট নীতি (Shoppable Video & Commission)',
      text: 'ক্রিয়েটররা ভিডিওর সাথে যেকোনো ভেরিফাইড পাইকারি বা খুচরা পণ্য ট্যাগ (Tag) করতে পারবেন। কোনো দর্শক ওই ভিডিও থেকে পণ্য কিনলে ক্রিয়েটর শর্ত সাপেক্ষে ১%-৫% সেলস কমিশন সরাসরি সুপার ওয়ালেটে পাবেন।',
      icon: Video,
      color: 'text-emerald-400'
    }
  ];

  return (
    <div className="container mx-auto px-4 py-8 max-w-3xl">
      <Link 
        to="/" 
        className="inline-flex items-center gap-2 text-xs font-bold text-[var(--pm-muted)] hover:text-[var(--pm-accent)] transition-colors mb-6"
      >
        <ArrowLeft className="w-4 h-4" />
        {lang === 'EN' ? 'Back to Home' : 'হোম পেজে ফিরে যান'}
      </Link>
      {/* Banner */}
      <div className="relative overflow-hidden bg-gradient-to-r from-orange-400/10 to-transparent border border-white/5 rounded-3xl p-6 md:p-8 mb-8 shadow-xl">
        <h1 className="text-2xl md:text-3xl font-black text-white flex items-center gap-3">
          <Gavel className="w-8 h-8 text-[var(--pm-accent)] animate-pulse" />
          সেলার ও কনটেন্ট ক্রিয়েটর গাইডলাইন
        </h1>
        <p className="text-xs md:text-sm text-[var(--pm-text-muted)] mt-2">
          পাইকার মার্ট বাংলাদেশের সবচেয়ে স্বচ্ছ ও নিয়মতান্ত্রিক সামাজিক পাইকারি বিপণন মাধ্যম। সুস্থ ব্যবসায়িক পরিবেশ বজায় রাখতে সকল বিক্রেতা ও কনটেন্ট ক্রিয়েটরদের নিচের নিয়মনীতি কঠোরভাবে মেনে চলতে হবে।
        </p>
      </div>

      {/* Grid Rules list with nice cards */}
      <div className="space-y-4 mb-8">
        <h2 className="text-sm font-black text-white px-1">🏪 বিক্রেতা ও হোলসেলার নীতিমালা</h2>
        {rules.map((rule, idx) => {
          const Icon = rule.icon;
          return (
            <div 
              key={idx}
              className="p-5 bg-[var(--pm-surface)] border border-[var(--pm-border)] rounded-2xl hover:border-orange-500/20 transition-all shadow-sm flex gap-4"
            >
              <div className="p-3 bg-black/30 rounded-xl max-h-12 flex items-center justify-center shrink-0">
                <Icon className={`w-5 h-5 ${rule.color}`} />
              </div>

              <div className="space-y-1">
                <h3 className="text-xs md:text-sm font-black text-white leading-tight">
                  {rule.title}
                </h3>
                <p className="text-[11px] md:text-xs text-[var(--pm-text-muted)] leading-relaxed font-semibold">
                  {rule.text}
                </p>
              </div>
            </div>
          );
        })}

        <h2 className="text-sm font-black text-white px-1 pt-4">🎬 কনটেন্ট ক্রিয়েটর নীতিমালা ও রোল</h2>
        {creatorRules.map((rule, idx) => {
          const Icon = rule.icon;
          return (
            <div 
              key={idx}
              className="p-5 bg-[var(--pm-surface)] border border-[var(--pm-border)] rounded-2xl hover:border-purple-500/20 transition-all shadow-sm flex gap-4"
            >
              <div className="p-3 bg-black/30 rounded-xl max-h-12 flex items-center justify-center shrink-0">
                <Icon className={`w-5 h-5 ${rule.color}`} />
              </div>

              <div className="space-y-1">
                <h3 className="text-xs md:text-sm font-black text-white leading-tight">
                  {rule.title}
                </h3>
                <p className="text-[11px] md:text-xs text-[var(--pm-text-muted)] leading-relaxed font-semibold">
                  {rule.text}
                </p>
              </div>
            </div>
          );
        })}
      </div>

      {/* Safety Shield Info Box */}
      <div className="p-5 rounded-3xl bg-slate-950/70 border border-white/5 space-y-3">
        <div className="flex gap-2 text-white font-extrabold text-xs">
          <span>⚖️</span> বাংলাদেশ কমার্স ও সাইবার সিকিউরিটি আইন
        </div>
        <p className="text-[10px] md:text-xs text-white/50 leading-relaxed font-medium">
          পাইকার মার্টের সকল সেলার ও ক্রিয়েটরদের কার্যক্রম ডিজিটাল কমার্স পরিচালনা নির্দেশিকা-২০২১ এর আলোকেই নির্ধারিত। কোনো অবহেলা বা ডেলিভারি গড়মিল হলে জাতীয় ভোক্তা অধিকার সংরক্ষণ অধিদপ্তরে বায়ার সরাসরি সেলারের ট্রেড লাইসেন্স ও এনআইডি বিপরীতে মামলা ফাইল করতে আইনত ক্ষমতাবান।
        </p>
      </div>
    </div>
  );
}
