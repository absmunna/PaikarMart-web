import React from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { 
  Newspaper, PlayCircle, Film, ClipboardList, 
  Sparkles, Radio, MessageSquare, PlusCircle
} from 'lucide-react';
import { GlassCard } from '@/components/ui/GlassCard';

export default function CommunityHubPortal() {
  const navigate = useNavigate();

  const CONTENT_PORTALS = [
    { 
      id: 'social', 
      name: 'সোশ্যাল ফিড', 
      desc: 'আপনার নেটওয়ার্কের লাইভ আপডেট ও সামাজিক পোস্ট', 
      path: '/', 
      icon: Newspaper, 
      color: 'bg-rose-500' 
    },
    { 
      id: 'video', 
      name: 'ভিডিও ও ওটিটি', 
      desc: 'শপেবল ভিডিও রিভিউ ও ফ্যাক্টরি ট্যুর', 
      path: '/video', 
      icon: PlayCircle, 
      color: 'bg-orange-500' 
    },
    { 
      id: 'reels', 
      name: 'রিলস (Shorts)', 
      desc: 'ট্রেন্ডিং শর্ট ভিডিও ও প্রোডাক্ট শোকেস', 
      path: '/reels', 
      icon: Film, 
      color: 'bg-purple-500' 
    },
    { 
      id: 'news', 
      name: 'নিউজ পোর্টাল', 
      desc: 'পাইকারি বাজার ও শিল্পের সর্বশেষ সংবাদ', 
      path: '/news', 
      icon: Radio, 
      color: 'bg-blue-500' 
    },
    { 
      id: 'demand', 
      name: 'ডিমান্ড বোর্ড', 
      desc: 'পণ্যের চাহিদা বা রিকোয়েস্ট পোস্ট করুন', 
      path: '/demand', 
      icon: ClipboardList, 
      color: 'bg-amber-500' 
    },
  ];

  return (
    <div className="min-h-screen pb-32">
      <header className="mb-8">
        <h1 className="text-2xl font-black text-white flex items-center gap-2">
          <Sparkles className="text-[var(--pm-accent)]" />
          কনটেন্ট ও কমিউনিটি হাব
        </h1>
        <p className="text-sm text-zinc-400 mt-1 font-medium">পাইকারমার্ট ইকোসিস্টেমের সকল কনটেন্ট ফিড একসাথে</p>
      </header>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        {CONTENT_PORTALS.map((portal) => {
          const Icon = portal.icon;
          return (
            <motion.div
              key={portal.id}
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              onClick={() => navigate(portal.path)}
              className="cursor-pointer"
            >
              <GlassCard className="p-5 flex items-center gap-4 h-full border border-white/5 hover:border-[var(--pm-accent)]/30 transition-all">
                <div className={`w-14 h-14 rounded-2xl ${portal.color} flex items-center justify-center text-white shadow-lg shrink-0`}>
                  <Icon className="w-7 h-7" />
                </div>
                <div className="min-w-0">
                  <h3 className="font-black text-white text-base truncate">{portal.name}</h3>
                  <p className="text-xs text-zinc-400 mt-0.5 line-clamp-2 leading-relaxed">
                    {portal.desc}
                  </p>
                </div>
              </GlassCard>
            </motion.div>
          );
        })}
      </div>

      {/* Community Section */}
      <section className="mt-12 space-y-4">
        <div className="flex items-center justify-between px-1">
          <h2 className="text-lg font-bold text-white flex items-center gap-2">
            <MessageSquare className="w-5 h-5 text-[var(--pm-accent)]" />
            কমিউনিটি ডিসকাশন
          </h2>
          <button className="text-xs font-black text-[var(--pm-accent)] uppercase tracking-wider">সব দেখুন</button>
        </div>
        
        <GlassCard className="p-12 text-center border-dashed border-white/10">
          <div className="w-16 h-16 bg-white/5 rounded-full flex items-center justify-center mx-auto mb-4">
            <PlusCircle className="w-8 h-8 text-zinc-600" />
          </div>
          <h4 className="text-sm font-bold text-white">নতুন গ্রুপ বা ফোরাম তৈরি করুন</h4>
          <p className="text-xs text-zinc-500 mt-1">কমিউনিটি ফিচারটি বর্তমানে ডেভেলপমেন্ট মোডে আছে</p>
        </GlassCard>
      </section>
    </div>
  );
}
