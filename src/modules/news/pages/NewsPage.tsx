import React, { useState, useMemo } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { CategoryTabs } from '../components/CategoryTabs';
import { NewsCard } from '../components/NewsCard';
import { MOCK_NEWS_ARTICLES } from '../mockNewsData';
import { StoryBar } from '@shared/StoryBar';
import { CategoryNavBar } from '@shared/CategoryNavBar';
import { 
  Search, 
  Sparkles, 
  TrendingUp, 
  BookOpen, 
  Newspaper,
  BellRing,
  Globe,
  Plus
} from 'lucide-react';
import { useAuth } from '@/features/auth/AuthContext';

export const NewsPage: React.FC = () => {
  const { user } = useAuth();
  const [activeCategory, setActiveCategory] = useState('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [isSubscribed, setIsSubscribed] = useState(false);
  const [newsAlertEmail, setNewsAlertEmail] = useState(user?.email || '');

  // Filter articles based on active category and search query
  const filteredArticles = useMemo(() => {
    return MOCK_NEWS_ARTICLES.filter(article => {
      const matchesCategory = activeCategory === 'all' || article.category === activeCategory;
      const matchesSearch = 
        article.titleBn.toLowerCase().includes(searchQuery.toLowerCase()) ||
        article.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        article.summaryBn.toLowerCase().includes(searchQuery.toLowerCase()) ||
        article.summary.toLowerCase().includes(searchQuery.toLowerCase());
      
      return matchesCategory && matchesSearch;
    });
  }, [activeCategory, searchQuery]);

  const handleSubscribe = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newsAlertEmail.trim()) return;
    setIsSubscribed(true);
  };

  return (
    <div className="min-h-screen bg-background/30 backdrop-blur-3xl text-white pb-28">
      {/* 1st Element: Promotional Stories context bar */}
      <section className="pt-2 px-6">
        <StoryBar context="media" />
      </section>

      {/* 2nd Element: Portals list icons top nav bar */}
      <div className="sticky top-16 z-40 bg-[var(--pm-bg)]/90 backdrop-blur-lg border-b border-white/[0.08] px-6 mt-2">
        <CategoryNavBar context="media" />
      </div>

      {/* Top Banner section with dual-gradient glass glow */}
      <header className="relative py-12 px-6 overflow-hidden">
        <div className="absolute inset-0 bg-radial-gradient from-[var(--pm-accent)]/20 via-transparent to-transparent pointer-events-none" />
        
        {/* Subtle decorative grid mesh background */}
        <div className="absolute inset-0 bg-[radial-gradient(#ffffff03_1px,transparent_1px)] [background-size:16px_16px] pointer-events-none" />
        
        <div className="max-w-5xl mx-auto flex flex-col md:flex-row items-center justify-between gap-6 relative z-10">
          <div className="space-y-3 text-center md:text-left">
            <div className="inline-flex items-center gap-1.5 px-3 py-1 bg-[var(--pm-accent)]/10 border border-[var(--pm-accent)]/20 rounded-full text-xs font-black text-[var(--pm-accent)] uppercase tracking-widest leading-none">
              <Sparkles className="w-3.5 h-3.5" /> Paikar News Portal
            </div>
            <h1 className="text-3xl md:text-5xl font-black italic tracking-tight uppercase">
               সুপার কমার্স <span className="text-transparent bg-clip-text bg-gradient-to-r from-[var(--pm-accent)] via-orange-400 to-amber-400">ট্রেন্ডস ও ইনসাইটস</span>
            </h1>
            <p className="text-xs md:text-sm text-zinc-400 font-medium max-w-xl">
               বাংলাদেশের পাইকারি বাজার, ঐতিহ্যবাহী তাঁত শিল্প এবং রিটেইল ট্রেন্ড নিয়ে নির্ভরযোগ্য ও তথ্যবহুল খবরের একমাত্র স্থান।
            </p>
          </div>

          {/* Quick Stat indicators */}
          <div className="flex gap-4 p-4 rounded-[2rem] bg-white/[0.02] border border-white/5 backdrop-blur-md">
            <div className="text-center px-4 border-r border-white/5">
              <span className="block text-xl font-black text-[var(--pm-accent)]">{MOCK_NEWS_ARTICLES.length}+</span>
              <span className="text-[9px] text-zinc-500 font-extrabold uppercase tracking-wider">মোট সংবাদ</span>
            </div>
            <div className="text-center px-4 border-r border-white/5">
              <span className="block text-xl font-black text-amber-400">৩টি</span>
              <span className="text-[9px] text-zinc-500 font-extrabold uppercase tracking-wider">ট্রেন্ডিং লাইভ</span>
            </div>
            <div className="text-center px-4">
              <span className="block text-xl font-black text-[var(--pm-accent)]">১০০%</span>
              <span className="text-[9px] text-zinc-500 font-extrabold uppercase tracking-wider">ভেরিফাইড সোর্স</span>
            </div>
          </div>
        </div>
      </header>

      {/* Main Structural Boundary */}
      <section className="max-w-5xl mx-auto px-4 md:px-8 space-y-4">
        {/* Dynamic Category filtering and search integration */}
        <div className="p-4 md:p-6 rounded-[2.5rem] bg-white/[0.02] border border-white/5 space-y-4">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
            <div className="flex items-center gap-2">
              <Newspaper className="w-5 h-5 text-[var(--pm-accent)]" />
              <h3 className="font-extrabold text-lg text-white uppercase tracking-wide italic">বিশেষজ্ঞ কলাম</h3>
            </div>

            {/* Premium, glassmorphic search box */}
            <div className="relative flex-1 md:max-w-xs group">
              <input 
                type="text" 
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="ম্যাগাজিন খবর খুঁজুন..."
                className="w-full bg-white/5 text-xs text-white placeholder-zinc-500 rounded-2xl pl-10 pr-4 py-3 focus:outline-none focus:ring-1 focus:ring-[var(--pm-accent)] border border-white/5 transition-all"
              />
              <Search className="w-4 h-4 text-zinc-500 group-focus-within:text-[var(--pm-accent)] absolute left-3.5 top-3.5 transition-colors" />
            </div>
          </div>

          <CategoryTabs 
            activeCategory={activeCategory} 
            onCategoryChange={setActiveCategory} 
          />
        </div>
      </section>

      {/* Main News Stream Column Layout */}
      <main className="max-w-5xl mx-auto px-4 md:px-8 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
          
          {/* Left Main Stream Grid: 8 columns wide */}
          <div className="lg:col-span-8 space-y-8">
            <AnimatePresence mode="popLayout">
              {filteredArticles.length > 0 ? (
                filteredArticles.map((article) => (
                  <NewsCard key={article.id} article={article} />
                ))
              ) : (
                <motion.div 
                  initial={{ opacity: 0, scale: 0.95 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.95 }}
                  className="p-16 rounded-[2.5rem] border border-white/5 bg-white/[0.01] flex flex-col items-center text-center"
                >
                  <div className="w-20 h-20 bg-white/[0.03] rounded-full flex items-center justify-center mb-6">
                    <BookOpen className="w-8 h-8 text-zinc-600 animate-pulse" />
                  </div>
                  <h3 className="text-lg font-black text-white uppercase tracking-wide mb-2 italic">কোনো খবর পাওয়া যায়নি</h3>
                  <p className="text-xs text-zinc-500 font-medium max-w-md">আপনার সার্চ কিওয়ার্ড পরিবর্তন করে দেখতে পারেন অথবা ক্যাটাগরি পাল্টে পুনরায় চেষ্টা করুন।</p>
                </motion.div>
              )}
            </AnimatePresence>
          </div>

          {/* Right Editorial Spotlight Sidebar: 4 columns wide */}
          <aside className="lg:col-span-4 space-y-6">
            
            {/* SME Support Widget */}
            <section className="p-6 rounded-[2.5rem] bg-gradient-to-br from-[var(--pm-accent)]/10 via-white/[0.02] to-transparent border border-white/5 space-y-4">
              <div className="flex items-center gap-2 text-[var(--pm-accent)] font-bold text-sm">
                <TrendingUp className="w-4 h-4" />
                <span>বাজার বিশ্লেষণ ও ট্রেন্ডস</span>
              </div>
              <h4 className="text-lg font-black leading-snug italic uppercase text-white">হোম পেজ রিপোর্টার প্রোগ্রাম</h4>
              <p className="text-xs text-zinc-400 leading-relaxed font-semibold">
                আপনার এলাকার পণ্য বা ঐতিহ্যবাহী কাজের লাইভ আপডেট পাঠাতে চান? পাইকার রিপোর্টার হাবে যোগ দিয়ে প্রতি মাসে আকর্ষণীয় পুরষ্কার ও পিকে কয়েন জিতে নিন!
              </p>
              <button className="w-full py-3 bg-[var(--pm-accent)] hover:opacity-90 text-white text-[10px] font-black uppercase tracking-widest rounded-xl transition-all cursor-pointer">
                রিপোর্টার হতে আবেদন করুন
              </button>
            </section>

            {/* Newsletter Subscription Card with Premium feedback animation */}
            <section className="p-6 rounded-[2.5rem] bg-white/[0.03] border border-gradient border-white/5 space-y-5">
              <div className="flex items-center gap-2">
                <BellRing className="w-5 h-5 text-amber-400" />
                <h4 className="font-extrabold text-sm uppercase tracking-wider text-white">বাল্ক প্রাইস ড্রপ এলার্ট</h4>
              </div>
              <p className="text-xs text-zinc-400 leading-relaxed font-semibold">
                কোনো পাইকারি বুকিং সস্তা হলে অথবা স্পেশাল পণ্য রিলিজ হলে সরাসরি আপনার ইনবক্সে ফ্রি আপডেট পান।
              </p>

              <AnimatePresence mode="wait">
                {!isSubscribed ? (
                  <motion.form 
                    key="sub-form"
                    onSubmit={handleSubscribe} 
                    className="space-y-3"
                    initial={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                  >
                    <input 
                      type="email" 
                      required
                      value={newsAlertEmail}
                      onChange={(e) => setNewsAlertEmail(e.target.value)}
                      placeholder="আপনার ইমেইল দিন..."
                      className="w-full bg-white/5 text-xs text-white placeholder-zinc-500 rounded-xl px-4 py-3 focus:outline-none focus:ring-1 focus:ring-amber-500 border border-white/5"
                    />
                    <button 
                      type="submit"
                      className="w-full py-3 bg-amber-500 hover:bg-amber-400 text-black text-[10px] font-black uppercase tracking-widest rounded-xl transition-all cursor-pointer"
                    >
                      সাবস্ক্রাইব করুন
                    </button>
                  </motion.form>
                ) : (
                  <motion.div 
                    key="sub-success"
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="p-4 rounded-2xl bg-[var(--pm-accent)]/10 border border-[var(--pm-accent)]/20 text-center text-xs font-bold text-[var(--pm-accent)]"
                  >
                    অভিনন্দন! আপনি সফলভাবে সাবস্ক্রাইব করেছেন।
                  </motion.div>
                )}
              </AnimatePresence>
            </section>

            {/* Global Marketplace Spot Banner */}
            <section className="p-6 rounded-[2.5rem] bg-gradient-to-br from-[#00A859]/20 to-black border border-[var(--pm-accent)]/10 text-white relative overflow-hidden group">
              <div className="absolute top-0 right-0 p-4 opacity-10 group-hover:scale-110 transition-transform">
                <Globe className="w-24 h-24 text-[var(--pm-accent)]" />
              </div>
              <div className="relative z-10 space-y-4">
                <span className="text-[10px] font-black uppercase tracking-[0.2em] text-[var(--pm-accent)]/80">ইন্টারন্যাশনাল ট্রেড</span>
                <h3 className="text-xl font-bold leading-tight italic uppercase">রপ্তানি পোর্টাল চালু হয়েছে</h3>
                <p className="text-xs text-zinc-400 leading-relaxed font-semibold">আপনার তাঁতের শাড়ি বা দেশি হস্তশিল্প সরাসরি ইউরোপ ও আমেরিকার বাজারে রপ্তানির জন্য বুকিং করুন।</p>
                <div className="inline-flex items-center gap-1.5 text-xs font-black text-[var(--pm-accent)] hover:opacity-80 transition-colors cursor-pointer uppercase tracking-wider">
                  <span>ফ্যাক্টরি হাব দেখুন</span>
                  <span>→</span>
                </div>
              </div>
            </section>

          </aside>
        </div>
      </main>
    </div>
  );
};
