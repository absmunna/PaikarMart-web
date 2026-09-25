import React from 'react';
import { motion } from 'framer-motion';

const categories = [
  { name: 'ইলেকট্রনিক্স', count: '1,245 পণ্য', bg: '#1e3a5f' },
  { name: 'ফ্যাশন', count: '3,876 পণ্য', bg: '#3b1f5e' },
  { name: 'হোম ও লিভিং', count: '982 পণ্য', bg: '#1a3a2a' },
  { name: 'বিউটি', count: '2,341 পণ্য', bg: '#5e1f3a' },
  { name: 'স্পোর্টস', count: '654 পণ্য', bg: '#1f3a1a' },
  { name: 'খাদ্য', count: '445 পণ্য', bg: '#3a2a1f' },
];

export const FeaturedCategories = () => {
  return (
    <section className="flex flex-col gap-3">
      <div className="flex items-center justify-between px-4">
        <h2 className="font-bold text-[var(--pm-text)]">ফিচার্ড ক্যাটাগরি</h2>
        <button className="text-[var(--pm-accent)] text-sm font-medium">সব দেখুন →</button>
      </div>
      
      <div className="flex flex-row gap-3 overflow-x-auto hide-scrollbar px-4 pb-2">
        {categories.map((cat, i) => (
          <motion.div
            key={i}
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: i * 0.1 }}
            className="min-w-[100px] h-[120px] rounded-2xl relative overflow-hidden flex flex-col justify-end p-3 cursor-pointer shrink-0"
            style={{ backgroundColor: cat.bg }}
          >
            <div className="absolute inset-0 bg-gradient-to-t from-black/70 to-transparent" />
            <div className="relative z-10">
              <p className="text-white font-bold text-xs truncate">{cat.name}</p>
              <p className="text-[var(--pm-text-secondary)] text-[10px] truncate">{cat.count}</p>
            </div>
          </motion.div>
        ))}
      </div>
    </section>
  );
};
