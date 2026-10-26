import React from 'react';
import { Gavel, CheckCircle2, ShieldAlert, BadgeInfo, Scale, Sparkles } from 'lucide-react';
import { useAppStore } from '@/modules/app/appStore';

export default function SellerRulesPage() {
  const { lang } = useAppStore();

  const rules = [
    {
      title: '১. ট্রেড লাইসেন্স ও ডকুমেন্টেশন (Trade License Validation)',
      text: 'ভেরিফাইড হোলসেলার বা ম্যানুফ্যাকচারার হিসেবে কাজ করতে চাইলে অবশ্যই বৈধ ট্রেড লাইসেন্স, এবং এনআইডি কার্ড দিয়ে অ্যাকাউন্ট সেটআপ করতে হবে। ডুপ্লিকেট অ্যাকাউন্ট বা ফেক ট্রেড ডকুমেন্ট সাবমিট করলে অ্যাকাউন্ট পার্মানেন্ট ব্যান হবে।',
      icon: CheckCircle2,
      color: 'text-cyan-400'
    },
    {
      title: '২. পণ্যের বিবরণ ও সঠিক মূল্য (Product Accuracy)',
      text: 'পণ্যের বর্ণনায় আসল ফটো ব্যবহার করা বাধ্যতামূলক। স্টক বা ওজনের কোনো গরমিলা থাকলে তা তাৎক্ষণিক প্রোডাক্ট আপডেট এ সংশোধন করতে হবে। অযৌক্তিক অতিরিক্ত মূল্য বা বিভ্রান্তিকর ডিসকাউন্ট অ্যাডমিন টিম ট্র্যাকিং করবে।',
      icon: BadgeInfo,
      color: 'text-blue-400'
    },
    {
      title: '৩. ডেলিভারি সময়সীমা ও এসক্রো রিলিজ (Fulfillment Timeline)',
      text: 'অর্ডার আসার পর ৪৮ ঘণ্টার মধ্যে শিপমেন্ট প্রস্তুত করে আমাদের লজিস্টিকস পার্টনারদের কাছে হস্তান্তর করতে হবে। কাস্টমার পণ্য পাওয়ার পর আমাদের এসক্রো সিস্টেমে পেমেন্ট ভ্যালিডেট করলে আপনার হোলসেলার ওয়ালেটে তা যুক্ত হবে।',
      icon: Scale,
      color: 'text-orange-400'
    },
    {
      title: '৪. ভেজাল ও নকল পণ্য নিষেধাজ্ঞা (Counterfeit Prohibition)',
      text: 'পাইকার মার্টে কোনো ধরণের কপি, ভেজাল বা নিষিদ্ধ ড্রাগ/লাইসেন্সবিহীন কেমিক্যাল এবং রিফ্যাশন্ড কপি বিক্রি করা সম্পূর্ণ নিষিদ্ধ। কোনো বায়ার জাল প্রডাক্ট প্রুফ সহ রিপোর্ট করলে সেলারের জমানো সিকিউরিটি ওয়ালেটের সম্পূর্ণ টাকা বাজেয়াপ্ত করা হবে।',
      icon: ShieldAlert,
      color: 'text-red-400'
    }
  ];

  return (
    <div className="container mx-auto px-4 py-8 max-w-3xl">
      {/* Banner */}
      <div className="relative overflow-hidden bg-gradient-to-r from-orange-400/10 to-transparent border border-white/5 rounded-3xl p-6 md:p-8 mb-8 shadow-xl">
        <h1 className="text-2xl md:text-3xl font-black text-white flex items-center gap-3">
          <Gavel className="w-8 h-8 text-[var(--pm-accent)] animate-pulse" />
          SELLER RULES & COMPLIANCE
        </h1>
        <p className="text-xs md:text-sm text-[var(--pm-text-muted)] mt-2">
          পাইকার মার্ট বাংলাদেশের সবচেয়ে স্বচ্ছ ও নিয়মতান্ত্রিক সামাজিক পাইকারি বিপণন মাধ্যম। সুস্থ ব্যবসায়িক পরিবেশ বজায় রাখতে সকল বিক্রেতাদের নিচের নিয়মনীতি কঠোরভাবে মেনে নিয়ে ব্যবসা পরিচালনা করতে হবে।
        </p>
      </div>

      {/* Grid Rules list with nice cards */}
      <div className="space-y-4 mb-8">
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
      </div>

      {/* Safety Shield Info Box */}
      <div className="p-5 rounded-3xl bg-slate-950/70 border border-white/5 space-y-3">
        <div className="flex gap-2 text-white font-extrabold text-xs">
          <span>⚖️</span> বাংলাদেশ কমার্স ও সাইবার সিকিউরিটি আইন
        </div>
        <p className="text-[10px] md:text-xs text-white/50 leading-relaxed font-medium">
          পাাইকার মার্টের সকল সেলারদের কার্যক্রম ডিজিটাল কমার্স পরিচালনা নির্দেশিকা-২০২১ এর আলোকেই নির্ধারিত। কোনো অবহেলা বা ডেলিভারি গড়মিল হলে জাতীয় ভোক্তা অধিকার সংরক্ষণ অধিদপ্তরে বায়ার সরাসরি সেলারের ট্রেড লাইসেন্স ও এনআইডি বিপরীতে মামলা ফাইল করতে আইনত ক্ষমতাবান।
        </p>
      </div>
    </div>
  );
}
