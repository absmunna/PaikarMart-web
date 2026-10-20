import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Search, Plus, Filter, MessageSquare, Clock, MapPin, Tag, ChevronRight, Sparkles } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

interface Demand {
  id: string;
  title: string;
  category: string;
  description: string;
  budget: string;
  location: string;
  timeAgo: string;
  responses: number;
  author: string;
  urgent?: boolean;
}

const DEMAND_POSTS: Demand[] = [
  {
    id: 'd1',
    title: '১০০০ পিস কটন টি-শার্ট দরকার (পাইকারি)',
    category: 'fashion',
    description: 'আমাদের শোরুমের জন্য ১০০০ পিস ভালো মানের কটন টি-শার্ট দরকার। লোগো প্রিন্ট করার সুবিধা থাকতে হবে।',
    budget: '৳ ১,০০,০০০ - ১,৫০,০০০',
    location: 'উত্তরা, ঢাকা',
    timeAgo: '২ ঘণ্টা আগে',
    responses: 12,
    author: 'তামীম এন্টারপ্রাইজ',
    urgent: true
  },
  {
    id: 'd2',
    title: 'রাজশাহী সিল্ক শাড়ি - ১০০ পিস বাল্ক অর্ডার',
    category: 'fashion',
    description: 'ঈদের জন্য রাজশাহীর পিওর সিল্ক শাড়ি দরকার। ভালো মানের এবং সরাসরি উৎপাদনকারী হতে হবে।',
    budget: '৳ ৫,০০,০০০+',
    location: 'রাজশাহী',
    timeAgo: '৫ ঘণ্টা আগে',
    responses: 8,
    author: 'মডার্ন ফ্যাশন গ্যালারি'
  },
  {
    id: 'd3',
    title: '৫০ কেজি ওজনের মিনিকেট চাল (১০০ বস্তা)',
    category: 'grocery',
    description: 'রেস্টুরেন্টের জন্য সরাসরি আড়ত থেকে ১০০ বস্তা মিনিকেট চাল দরকার। হোম ডেলিভারি মাস্ট।',
    budget: '৳ ৩,৫০,০০০',
    location: 'মিরপুর, ঢাকা',
    timeAgo: '১ দিন আগে',
    responses: 15,
    author: 'সালাম ক্যাটারিং'
  }
];

export default function DemandHome() {
  const navigate = useNavigate();
  const [selectedCat, setSelectedCat] = useState('all');

  return (
    <div className="flex flex-col gap-6 pb-24 w-full max-w-4xl mx-auto px-4">
      {/* Banner */}
      <div className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-blue-700 to-indigo-900 text-white p-6 sm:p-10 shadow-2xl mt-4">
        <div className="relative z-10">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-blue-500/20 text-blue-300 text-xs font-bold border border-blue-400/30 mb-4">
            <Sparkles className="w-3.5 h-3.5" />
            পণ্য বা সার্ভিসের চাহিদা পোস্ট করুন
          </div>
          <h1 className="text-3xl sm:text-4xl font-black tracking-tight leading-tight mb-4">
            আপনার কী প্রয়োজন? <br/>জানিয়ে দিন বিক্রেতাদের।
          </h1>
          <p className="text-sm sm:text-base text-blue-100 max-w-md opacity-90 leading-relaxed">
            আপনার চাহিদাপত্র সাবমিট করুন এবং ভেরিফাইড বিক্রেতাদের কাছ থেকে সরাসরি সেরা অফার গ্রহণ করুন।
          </p>
          
          <div className="flex flex-wrap gap-3 mt-8">
            <button className="bg-white text-blue-900 px-6 py-3 rounded-2xl text-sm font-bold shadow-lg hover:shadow-xl transition-all active:scale-95 flex items-center gap-2">
              <Plus className="w-4 h-4" />
              ডিমান্ড পোস্ট করুন
            </button>
            <button className="bg-blue-600/40 backdrop-blur-md text-white border border-blue-400/30 px-6 py-3 rounded-2xl text-sm font-bold hover:bg-blue-600/50 transition-all">
              কিভাবে কাজ করে?
            </button>
          </div>
        </div>
        
        {/* Abstract Background Shapes */}
        <div className="absolute top-0 right-0 -mr-20 -mt-20 w-80 h-80 bg-blue-400/20 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute bottom-0 left-0 -ml-20 -mb-20 w-80 h-80 bg-indigo-500/20 rounded-full blur-3xl pointer-events-none" />
      </div>

      {/* Filter Bar */}
      <div className="flex flex-wrap items-center justify-between gap-4">
        <div className="flex gap-2 overflow-x-auto hide-scrollbar pb-1">
          {['all', 'fashion', 'grocery', 'electronics', 'services'].map(cat => (
            <button
              key={cat}
              onClick={() => setSelectedCat(cat)}
              className={`px-4 py-2 rounded-xl text-xs font-bold capitalize transition-all border ${
                selectedCat === cat 
                  ? 'bg-blue-600 text-white border-blue-500 shadow-md' 
                  : 'bg-[var(--pm-surface)] text-[var(--pm-text-muted)] border-[var(--pm-border)] hover:border-blue-400'
              }`}
            >
              {cat === 'all' ? 'সব ডিমান্ড' : cat}
            </button>
          ))}
        </div>
        <button className="flex items-center gap-2 px-4 py-2 rounded-xl bg-[var(--pm-surface)] border border-[var(--pm-border)] text-xs font-bold text-[var(--pm-text-muted)] hover:text-[var(--pm-text)]">
          <Filter className="w-3.5 h-3.5" />
          ফিল্টার
        </button>
      </div>

      {/* Demand List */}
      <div className="grid grid-cols-1 gap-4">
        {DEMAND_POSTS.map((post) => (
          <motion.div
            key={post.id}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            whileHover={{ y: -2 }}
            onClick={() => navigate(`/demand/${post.id}`)}
            className="group relative bg-[var(--pm-surface)] rounded-3xl border border-[var(--pm-border)] p-5 hover:border-blue-500/50 hover:shadow-xl transition-all cursor-pointer overflow-hidden"
          >
            {post.urgent && (
              <div className="absolute top-0 left-0 h-full w-1 bg-red-500" />
            )}
            
            <div className="flex flex-col sm:flex-row gap-5">
              <div className="flex-1">
                <div className="flex items-center gap-2 mb-2">
                  <span className="px-2.5 py-0.5 rounded-lg bg-blue-100 text-blue-700 text-[10px] font-bold uppercase tracking-wider">
                    {post.category}
                  </span>
                  {post.urgent && (
                    <span className="px-2.5 py-0.5 rounded-lg bg-red-100 text-red-600 text-[10px] font-bold uppercase tracking-wider flex items-center gap-1">
                      <Clock className="w-3 h-3" />
                      জরুরী
                    </span>
                  )}
                  <span className="text-[10px] text-[var(--pm-text-muted)] ml-auto flex items-center gap-1">
                    <Clock className="w-3 h-3" />
                    {post.timeAgo}
                  </span>
                </div>
                
                <h3 className="text-base sm:text-lg font-black text-[var(--pm-text)] group-hover:text-blue-600 transition-colors leading-tight mb-2">
                  {post.title}
                </h3>
                
                <p className="text-xs sm:text-sm text-[var(--pm-text-muted)] line-clamp-2 mb-4 leading-relaxed">
                  {post.description}
                </p>
                
                <div className="grid grid-cols-2 sm:flex sm:flex-wrap items-center gap-x-6 gap-y-2 pt-4 border-t border-[var(--pm-border)]/50">
                  <div className="flex items-center gap-1.5 text-xs text-[var(--pm-text-muted)]">
                    <Tag className="w-3.5 h-3.5 text-blue-500" />
                    <span className="font-bold text-[var(--pm-text)]">{post.budget}</span>
                  </div>
                  <div className="flex items-center gap-1.5 text-xs text-[var(--pm-text-muted)]">
                    <MapPin className="w-3.5 h-3.5 text-red-500" />
                    <span>{post.location}</span>
                  </div>
                  <div className="flex items-center gap-1.5 text-xs text-[var(--pm-text-muted)]">
                    <MessageSquare className="w-3.5 h-3.5 text-emerald-500" />
                    <span className="font-bold text-emerald-600">{post.responses} জন বিড করেছে</span>
                  </div>
                </div>
              </div>
              
              <div className="flex flex-row sm:flex-col justify-between items-center sm:items-end gap-3 pt-4 sm:pt-0">
                <div className="text-right sm:block hidden">
                  <p className="text-[10px] text-[var(--pm-text-muted)]">পোস্ট করেছেন</p>
                  <p className="text-xs font-bold text-[var(--pm-text)]">{post.author}</p>
                </div>
                <button className="flex-1 sm:flex-none bg-blue-600 text-white px-5 py-2.5 rounded-2xl text-xs font-bold shadow-md hover:bg-blue-700 transition-all flex items-center justify-center gap-2 group-hover:px-6">
                  অফার দিন
                  <ChevronRight className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>
          </motion.div>
        ))}
      </div>
    </div>
  );
}
