import React from 'react';
import { motion } from 'framer-motion';
import { ChevronRight, Laptop, Shirt, Sofa, Sparkles, Watch, Dumbbell, Apple, ShoppingBag, Star, Users, TrendingUp } from 'lucide-react';

export const HeroBanner = () => (
  <div className="px-4 pt-4">
    <div className="relative h-[180px] rounded-[32px] overflow-hidden bg-gradient-to-br from-indigo-900 via-slate-900 to-black border border-white/10 shadow-2xl group">
      <div className="absolute inset-0 z-10 flex flex-col justify-center px-8">
        <div className="inline-flex items-center gap-2 bg-white/10 backdrop-blur-md px-3 py-1 rounded-full border border-white/20 w-fit mb-3">
          <span className="w-1.5 h-1.5 bg-indigo-400 rounded-full animate-pulse" />
          <span className="text-[10px] font-bold text-indigo-100 uppercase tracking-widest">ফিচার্ড অফার</span>
        </div>
        <h2 className="text-2xl font-black text-white leading-tight">
          স্মার্টফোন <br /> 
          <span className="text-indigo-400">মিড-রেঞ্জ সেল</span>
        </h2>
        <p className="text-[10px] text-indigo-200/70 mt-2 max-w-[180px]">২২% পর্যন্ত ছাড় • প্রথম অর্ডারে ফ্রি পিকে কয়েন ক্যাশব্যাক</p>
        <button className="mt-4 bg-white text-indigo-900 px-5 py-2 rounded-xl font-bold text-[10px] w-fit active:scale-95 transition-transform shadow-lg hover:bg-indigo-50">
          কিনুন
        </button>
      </div>
      <div className="absolute top-0 right-0 w-1/2 h-full bg-indigo-500/10 blur-[80px] rounded-full translate-x-1/4" />
    </div>
  </div>
);

export const StatsRow = () => {
  const stats = [
    { label: 'পণ্য', value: '১.২কে', icon: ShoppingBag, color: 'text-indigo-400', bg: 'bg-indigo-500/10' },
    { label: 'সেলার', value: '৮৫', icon: Star, color: 'text-amber-400', bg: 'bg-amber-500/10' },
    { label: 'ইউজার', value: '৪৫কে', icon: Users, color: 'text-blue-400', bg: 'bg-blue-500/10' },
    { label: 'বৃদ্ধি', value: '+১২%', icon: TrendingUp, color: 'text-emerald-400', bg: 'bg-emerald-500/10' },
  ];

  return (
    <div className="grid grid-cols-4 gap-2 px-4 py-2">
      {stats.map((s, i) => (
        <div key={i} className="glass p-3 rounded-2xl border border-[var(--pm-border)]/20 flex flex-col items-center text-center">
          <div className={`w-8 h-8 rounded-lg ${s.bg} flex items-center justify-center mb-1.5`}>
            <s.icon className={`w-4 h-4 ${s.color}`} />
          </div>
          <span className="text-sm font-black text-[var(--pm-text)] leading-none">{s.value}</span>
          <span className="text-[8px] font-bold text-[var(--pm-text-muted)] uppercase mt-1">{s.label}</span>
        </div>
      ))}
    </div>
  );
};

export const CategorySection = () => {
  const categories = [
    { name: 'ইলেকট্রনিক্স', icon: Laptop, color: 'from-blue-500/20 to-indigo-500/20' },
    { name: 'ফ্যাশন', icon: Shirt, color: 'from-pink-500/20 to-rose-500/20' },
    { name: 'হোম', icon: Sofa, color: 'from-orange-500/20 to-amber-500/20' },
    { name: 'বিউটি', icon: Sparkles, color: 'from-purple-500/20 to-fuchsia-500/20' },
  ];

  return (
    <div className="flex flex-col gap-3 py-2">
      <div className="flex items-center justify-between px-6">
        <h3 className="text-xs font-black text-[var(--pm-text)] uppercase tracking-wider">ক্যাটাগরি দেখুন</h3>
        <button className="text-[var(--pm-accent)] text-[10px] font-bold flex items-center gap-1 hover:underline">
          সব দেখুন <ChevronRight className="w-3 h-3" />
        </button>
      </div>
      <div className="flex gap-4 overflow-x-auto px-6 pb-2 hide-scrollbar">
        {categories.map((cat, i) => (
          <div key={i} className="flex flex-col items-center gap-2 shrink-0 cursor-pointer group">
            <div className={`w-14 h-14 rounded-2xl bg-gradient-to-br ${cat.color} border border-[var(--pm-border)]/30 flex items-center justify-center transition-all group-hover:scale-110`}>
              <cat.icon className="w-6 h-6 text-[var(--pm-text)] opacity-80 group-hover:text-[var(--pm-accent)]" />
            </div>
            <span className="text-[10px] font-bold text-[var(--pm-text-muted)]">{cat.name}</span>
          </div>
        ))}
      </div>
    </div>
  );
};
