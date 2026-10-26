import React from 'react';
import { motion } from 'motion/react';
import { ShoppingBag, ChevronRight, Sparkles } from 'lucide-react';
import { useLanguage } from '@/features/language/LanguageContext';

export const HomeHero = () => {
  const { isBn } = useLanguage();

  return (
    <div className="relative rounded-[2.5rem] bg-gradient-to-r from-cyan-950 via-slate-900 to-zinc-950 p-6 md:p-10 border border-cyan-500/20 shadow-2xl overflow-hidden min-h-[160px] md:min-h-[220px] flex flex-col justify-center text-left select-none">
      {/* Visual background elements */}
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_30%_30%,rgba(34,211,238,0.15),transparent_60%)]" />
      <div className="absolute top-0 right-0 p-12 opacity-5 pointer-events-none">
        <ShoppingBag size={180} className="text-white" />
      </div>

      <motion.div 
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="relative z-10 space-y-3 max-w-[280px] sm:max-w-md"
      >
        <span className="px-3 py-1 rounded-full bg-cyan-500/10 border border-cyan-500/20 text-cyan-400 font-black text-[8px] uppercase tracking-[0.2em] flex items-center gap-1.5 w-fit">
          <Sparkles size={10} className="animate-pulse" />
          {isBn ? "আজকের মেগা ডিল" : "MEGA DEAL OF THE DAY"}
        </span>
        <h1 className="text-lg sm:text-2xl font-black text-white tracking-tight leading-snug">
          {isBn ? "সেরা পাইকারি মূল্যে চমৎকার কেনাকাটা" : "Incredible Shopping at True Wholesale Prices"}
        </h1>
        <p className="text-[10px] text-zinc-400 font-bold uppercase tracking-widest flex items-center gap-1">
          {isBn ? "৫% ভ্যাট সমন্বয়সহ সরাসরি ক্যাশব্যাক" : "Direct Cashback with 5% Auto VAT Adjustment"}
        </p>
      </motion.div>
    </div>
  );
};
