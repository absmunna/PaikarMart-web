import React, { useState } from 'react';
import { HelpCircle, ChevronDown, Search, ArrowRight } from 'lucide-react';
import { useAppStore } from '@/modules/app/appStore';

interface FAQItem {
  q: string;
  qBn: string;
  a: string;
  aBn: string;
  category: 'general' | 'seller' | 'shipping' | 'payments';
}

const FAQS: FAQItem[] = [
  {
    category: 'general',
    q: 'What is Paikar Mart?',
    qBn: 'পাইকার মার্ট কি?',
    a: 'Paikar Mart is Bangladesh’s pioneer Social Commerce Super App, bridging physical wholesalers, retailers, and single consumers for hassle-free business negotiations, group purchases, and premium PK Stores.',
    aBn: 'পাইকার মার্ট হচ্ছে বাংলাদেশের প্রথম সোশ্যাল কমার্স সুপার অ্যাপ, যা পাইকারি বিক্রেতা, খুচরা বিক্রেতা এবং সাধারণ গ্রাহকদের একই প্ল্যাটফর্মে এনে ব্যবসা পরিচালনা, যৌথ কেনাকাটা এবং প্রিমিয়াম কেনাকাটা সহজ করে তোলে।'
  },
  {
    category: 'shipping',
    q: 'Is there a minimum order quantity (MOQ) for wholesale?',
    qBn: 'পাইকারি ক্রয়ের ক্ষেত্রে কি ন্যূনতম অর্ডারের পরিমাণ (MOQ) আছে?',
    a: 'Yes, wholsale products usually define an MOQ to ensure wholesale rates. However, you can negotiate or do group-buying (Bhaag-bhagi) to share quantities with other local businesses.',
    aBn: 'হ্যাঁ, পাইকারি রেটে পণ্য কেনার জন্য সাধারণত ন্যূনতম অর্ডারের পরিমাণ নির্ধারিত থাকে। তবে আপনি অন্যান্য স্থানীয় ব্যবসার সাথে যৌথভাবে (ভাগাভাগি) অর্ডার করতে পারেন।'
  },
  {
    category: 'payments',
    q: 'Which payment methods do you support?',
    qBn: 'আপনারা কি কি পেমেন্ট মাধ্যম সমর্থন করেন?',
    a: 'We support bKash, Nagad, SSL Commerz (all debit/credit cards), Bank Transfers, and Cash on Delivery (COD) under customized escrow terms to secure both buyer and seller interests.',
    aBn: 'আমরা বিকাশ, নগদ, রকেট, কার্ড (SSL Commerz) এবং ব্যাংক ট্রান্সফার সমর্থন করি। ক্রেতা এবং বিক্রেতা উভয়ের নিরাপত্তা নিশ্চিত করতে আমাদের প্ল্যাটফর্মে কাস্টমাইজড এসক্রো সিস্টেম রয়েছে।'
  },
  {
    category: 'seller',
    q: 'How do I become a verified seller on Paikar Mart?',
    qBn: 'পাইকার মার্টে ভেরিফাইড বিক্রেতা কিভাবে হব?',
    a: 'Go to the "Become Seller" page, upload your Business Trade License, NID, and bank details. Our moderation team will verify and activate your seller privileges within 24 working hours.',
    aBn: 'আমাদের "বিক্রেতা হোন" লিংকে গিয়ে আপনার ট্রেড লাইসেন্স, জাতীয় পরিচয়পত্র (NID) এবং ব্যাংকের তথ্য জমা দিন। আমাদের মডারেশন টিম ২৪ ঘণ্টার মধ্যে যাচাই করে আপনার অ্যাকাউন্ট সক্রিয় করবে।'
  },
  {
    category: 'shipping',
    q: 'What is the standard delivery duration in Bangladesh?',
    qBn: 'বাংলাদেশে ডেলিভারি পেতে কতদিন সময় লাগে?',
    a: 'Within Dhaka, delivery is completed within 24 to 48 hours. Outside Dhaka, B2C takes 2-4 days, while heavy wholesale logistics can take 3-5 days depending on the vehicle availability.',
    aBn: 'ঢাকা সিটির মধ্যে ২৪ থেকে ৪৮ ঘণ্টার মধ্যে ডেলিভারি সম্পন্ন হয়। ঢাকার বাইরে সাধারণ ডেলিভারি ২-৪ দিন এবং বাল্ক বা পাইকারি লজিস্টিকস ৩-৫ দিন সময় নিতে পারে।'
  }
];

export default function FAQPage() {
  const { lang } = useAppStore();
  const [activeCategory, setActiveCategory] = useState<'all' | 'general' | 'seller' | 'shipping' | 'payments'>('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [openIndex, setOpenIndex] = useState<number | null>(0);

  const filteredFaqs = FAQS.filter(faq => {
    const matchesCategory = activeCategory === 'all' || faq.category === activeCategory;
    const term = searchQuery.toLowerCase();
    const queryMatches = (lang === 'EN' ? faq.q : faq.qBn).toLowerCase().includes(term) || 
                         (lang === 'EN' ? faq.a : faq.aBn).toLowerCase().includes(term);
    return matchesCategory && queryMatches;
  });

  return (
    <div className="container mx-auto px-4 py-8">
      {/* Hero Banner with 3D vibe */}
      <div className="relative overflow-hidden bg-gradient-to-r from-orange-500/20 via-orange-600/5 to-transparent border border-white/10 rounded-3xl p-6 md:p-8 mb-8 shadow-2xl">
        <div className="absolute top-0 right-0 w-48 h-48 bg-orange-500/10 blur-3xl rounded-full" />
        <div className="flex items-center gap-4 mb-3">
          <div className="p-3 rounded-2xl bg-orange-500/10 text-orange-500 border border-orange-500/20 shadow-md">
            <HelpCircle className="w-7 h-7" />
          </div>
          <div>
            <span className="text-[10px] font-extrabold uppercase tracking-widest text-orange-500">Paikar Mart Support</span>
            <h1 className="text-2xl md:text-3xl font-black text-white uppercase tracking-tight">
              {lang === 'EN' ? 'Frequently Asked Questions' : 'সাধারণ জিজ্ঞাসা ও উত্তর'}
            </h1>
          </div>
        </div>
        <p className="text-xs md:text-sm text-zinc-400 max-w-xl leading-relaxed">
          {lang === 'EN' ? 'Find swift, reliable answers regarding accounts, social shopping, payments, and trade logistics in Bangladesh.' : 'পাইকার ও খুচরা বেচাকেনা, গ্রুপ বাইং এবং নিরাপদ পেমেন্ট সংক্রান্ত যেকোনো প্রশ্নের উত্তর এখানে খুঁজুন।'}
        </p>

        {/* Custom Input Search Bar */}
        <div className="mt-6 max-w-md relative">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-zinc-500" />
          <input
            type="text"
            placeholder={lang === 'EN' ? "Search FAQs..." : "প্রশ্ন দিয়ে খুঁজুন..."}
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-11 pr-4 py-3 bg-black/40 border border-white/10 rounded-2xl text-xs text-white placeholder-white/30 focus:border-orange-500 outline-none transition-all shadow-inner"
          />
        </div>
      </div>

      {/* Categories chips selection */}
      <div className="flex gap-2.5 overflow-x-auto pb-4 mb-6 hide-scrollbar">
        {['all', 'general', 'seller', 'shipping', 'payments'].map((cat) => {
          const isActive = activeCategory === cat;
          return (
            <button
              key={cat}
              onClick={() => setActiveCategory(cat as any)}
              className={`px-4 py-2 rounded-full text-xs font-black transition-all cursor-pointer border uppercase tracking-wider shrink-0 ${
                isActive 
                  ? 'bg-gradient-to-r from-orange-500 to-amber-600 text-white border-transparent shadow-lg shadow-orange-500/10'
                  : 'bg-zinc-900 text-zinc-400 border-white/5 hover:bg-zinc-800'
              }`}
            >
              {lang === 'EN' ? cat : (
                cat === 'all' ? 'সব প্রশ্ন' : 
                cat === 'general' ? 'সাধারণ' : 
                cat === 'seller' ? 'বিক্রেতা' : 
                cat === 'shipping' ? 'ডেলিভারি' : 'পেমেন্ট'
              )}
            </button>
          );
        })}
      </div>

      {/* Accordion List with custom 3D Shadow Container */}
      <div className="grid grid-cols-1 gap-3 max-w-3xl mb-12">
        {filteredFaqs.length > 0 ? (
          filteredFaqs.map((faq, idx) => {
            const isOpen = openIndex === idx;
            return (
              <div 
                key={idx}
                className={`border rounded-2xl transition-all duration-300 ${
                  isOpen 
                    ? 'bg-zinc-900 border-orange-500/35 shadow-[0_4px_20px_rgba(249,115,22,0.06)] scale-[1.005]' 
                    : 'bg-zinc-900/80 border-white/5 shadow-sm hover:border-white/10'
                }`}
              >
                <button
                  onClick={() => setOpenIndex(isOpen ? null : idx)}
                  className="w-full flex items-center justify-between gap-4 px-5 py-4.5 text-left cursor-pointer"
                >
                  <span className="text-xs md:text-sm font-black text-white leading-snug">
                    {lang === 'EN' ? faq.q : faq.qBn}
                  </span>
                  <div className={`p-1.5 rounded-lg bg-black/20 text-zinc-500 transition-all ${isOpen ? 'rotate-180 text-orange-500' : ''}`}>
                    <ChevronDown className="w-4 h-4" />
                  </div>
                </button>
                {isOpen && (
                  <div className="px-5 pb-5">
                    <div className="h-px bg-white/5 mb-4" />
                    <p className="text-xs md:text-sm text-zinc-400 leading-relaxed font-medium">
                      {lang === 'EN' ? faq.a : faq.aBn}
                    </p>
                  </div>
                )}
              </div>
            );
          })
        ) : (
          <div className="p-8 text-center rounded-2xl border border-white/5 bg-zinc-900 text-zinc-500 text-xs font-bold">
            {lang === 'EN' ? 'No matching FAQ found.' : 'কোন প্রশ্ন পাওয়া যায়নি।'}
          </div>
        )}
      </div>

      {/* Contact redirection CTA Card */}
      <div className="p-6 rounded-3xl bg-slate-950/60 border border-white/5 flex flex-col md:flex-row items-center justify-between gap-6 max-w-3xl">
        <div className="text-center md:text-left">
          <h4 className="text-sm font-black text-white mb-1">
            {lang === 'EN' ? 'Still have outstanding doubts?' : 'আরও কোনো কিছু জানার আছে?'}
          </h4>
          <p className="text-[11px] text-white/50">
            {lang === 'EN' ? 'Speak directly to our dedicated escrow and logistics support centers.' : 'আমাদের এসক্রো ও লজিস্টিকস সহায়তা সেন্টারে সরাসরি বিস্তারিত মেসেজ পাঠান।'}
          </p>
        </div>
        <button 
          onClick={() => window.location.href = '#/contact'}
          className="flex items-center gap-1 px-4 py-2 bg-gradient-to-r from-orange-500 to-amber-600 text-white rounded-xl text-xs font-black shadow-lg hover:brightness-110 cursor-pointer"
        >
          {lang === 'EN' ? 'Contact Support' : 'আমাদের সাথে যোগাযোগ'}
          <ArrowRight className="w-3.5 h-3.5" />
        </button>
      </div>
    </div>
  );
}
