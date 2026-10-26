import React, { useState } from 'react';
import { 
  Play, Radio, User, Users, 
  MessageSquare, Heart, Share2, 
  Eye, Calendar, Star, Search,
  Bell, Globe, ShoppingCart, Zap,
  Flame, Sparkles, ChevronRight, Video, Megaphone, Clock
} from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { Button } from '@/components/ui/button';
import { StoryBar } from '@/shared/StoryBar';
import { PortalIconBar } from '@/shared/PortalIconBar';
import { toast } from 'sonner';

// Mock Live Streams
const LIVE_STREAMS = [
  { id: 'l1', titleEn: 'B2B Wholesale Electronics Review', titleBn: 'B2B পাইকারি ইলেকট্রনিক্স রিভিউ', host: 'Rifat Tech', viewers: '4.2k', img: '📱' },
  { id: 'l2', titleEn: 'Cook with Shana: Traditional Pitha', titleBn: 'শানার সাথে রান্না: ঐতিহ্যবাহী পিঠা', host: 'Chef Shana', viewers: '1.5k', img: '🥘' },
  { id: 'l3', titleEn: 'Market Walk: Gabtoli Cow Market', titleBn: 'মার্কেট ওয়াক: গাবতলী গরুর হাট', host: 'Market Insider', viewers: '8.9k', img: '🐄' },
];

const UPCOMING_STREAMS = [
  { id: 'u1', titleEn: 'Gaming Gear Launch Event', titleBn: 'গেমিং গিয়ার লঞ্চ ইভেন্ট', time: 'Tonight 9:00 PM', host: 'Gaming BD' },
  { id: 'u2', titleEn: 'Budget Smartphone Unboxing', titleBn: 'বাজেট স্মার্টফোন আনবক্সিং', time: 'Tomorrow 4:30 PM', host: 'Tech BD' },
];

export default function LiveHome() {
  const [isBilingual, setIsBilingual] = useState(true);
  const [activeTab, setActiveTab] = useState<'all' | 'shopping' | 'community' | 'news'>('all');
  
  const t = (en: string, bn: string) => isBilingual ? bn : en;

  const handleRemind = (title: string) => {
    toast.success(`${t('Reminder set for', 'রিমাইন্ডার সেট করা হয়েছে')}: ${title}`);
  };

  return (
    <div className="min-h-screen bg-[#020202] text-white pb-32">
      {/* Portal Header Rule */}
      <section className="pt-4 px-2 space-y-1">
        <StoryBar context="live" />
        <PortalIconBar context="community" />
      </section>

      <div className="max-w-7xl mx-auto px-4 mt-6 space-y-10">
        {/* Live Hero */}
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="relative rounded-[3rem] bg-gradient-to-br from-rose-950/20 via-zinc-950 to-black border border-white/5 p-8 md:p-12 overflow-hidden shadow-2xl"
        >
          <div className="absolute top-0 right-0 w-96 h-96 bg-rose-500/5 rounded-full blur-3xl animate-pulse" />
          
          <div className="relative z-10 flex flex-col md:flex-row items-center gap-12">
            <div className="flex-1 space-y-6">
              <div className="flex items-center gap-3">
                <span className="flex items-center gap-1.5 px-3 py-1 rounded-full bg-rose-500/20 border border-rose-500/30 text-rose-500 text-[10px] font-black uppercase tracking-[0.2em]">
                  <span className="w-1.5 h-1.5 rounded-full bg-rose-500 animate-ping" />
                  LIVE NOW
                </span>
                <button 
                  onClick={() => setIsBilingual(!isBilingual)}
                  className="text-[10px] text-zinc-500 hover:text-white"
                >
                  {isBilingual ? 'English' : 'বাংলা'}
                </button>
              </div>
              
              <h1 className="text-4xl md:text-7xl font-black tracking-tighter leading-none">
                {t('Connect in', 'যুক্ত হোন')} <br />
                <span className="text-rose-500">{t('Real-Time', 'রিয়েল-টাইমে')}</span>
              </h1>
              
              <p className="text-zinc-400 text-sm max-w-md leading-relaxed">
                {t(
                  'Watch live shopping, community events, and product reviews from verified sellers and creators.',
                  'ভেরিফাইড বিক্রেতা এবং নির্মাতাদের কাছ থেকে লাইভ শপিং, কমিউনিটি ইভেন্ট এবং প্রোডাক্ট রিভিউ দেখুন।'
                )}
              </p>

              <div className="flex flex-wrap gap-4 pt-2">
                <Button className="bg-rose-600 hover:bg-rose-700 text-white rounded-2xl px-10 h-16 font-black text-lg shadow-xl shadow-rose-500/20">
                  <Play className="h-6 w-6 mr-3 fill-current" />
                  {t('Watch Now', 'এখনই দেখুন')}
                </Button>
                <div className="flex -space-x-3 items-center pl-2">
                  {[1, 2, 3].map(i => (
                    <div key={i} className="w-10 h-10 rounded-full border-2 border-black bg-zinc-800" />
                  ))}
                  <span className="pl-6 text-xs text-zinc-500 font-bold tracking-tight">
                    {t('12.4k People Watching', '১২.৪ হাজার মানুষ দেখছে')}
                  </span>
                </div>
              </div>
            </div>
            
            <div className="w-full md:w-80 aspect-[9/16] rounded-[2.5rem] bg-zinc-900/40 border border-white/10 relative overflow-hidden group shadow-2xl">
              <div className="absolute inset-0 bg-gradient-to-t from-black via-transparent to-transparent z-10" />
              <div className="absolute inset-0 flex items-center justify-center text-7xl opacity-50 group-hover:scale-110 transition-transform">
                🎥
              </div>
              <div className="absolute bottom-6 left-6 right-6 z-20 space-y-2">
                <div className="flex items-center gap-2">
                  <div className="w-2 h-2 rounded-full bg-rose-500 animate-pulse" />
                  <span className="text-[10px] font-black uppercase text-rose-500">{t('Featured Stream', 'ফিচারড লাইভ')}</span>
                </div>
                <h4 className="text-sm font-bold text-white line-clamp-2">{t('B2B Wholesale Electronics Review', 'B2B পাইকারি ইলেকট্রনিক্স রিভিউ')}</h4>
              </div>
            </div>
          </div>
        </motion.div>

        {/* Live Now Grid */}
        <div className="space-y-6">
          <div className="flex items-center justify-between">
            <h2 className="text-xl font-black uppercase tracking-wider flex items-center gap-2">
              <Radio className="h-5 w-5 text-rose-500" />
              {t('Live Now', 'এখন লাইভ')}
            </h2>
            <div className="flex gap-2">
              {['all', 'shopping', 'community'].map(tab => (
                <button 
                  key={tab}
                  onClick={() => setActiveTab(tab as any)}
                  className={`px-4 py-2 rounded-xl text-[10px] font-black uppercase border transition-all ${
                    activeTab === tab ? 'bg-white text-black border-white' : 'bg-white/5 text-zinc-500 border-white/10 hover:border-white/20'
                  }`}
                >
                  {t(tab, tab === 'all' ? 'সব' : tab === 'shopping' ? 'শপিং' : 'কমিউনিটি')}
                </button>
              ))}
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
            {LIVE_STREAMS.map((stream, idx) => (
              <motion.div 
                key={stream.id}
                initial={{ opacity: 0, scale: 0.98 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: idx * 0.1 }}
                className="group relative rounded-[2.5rem] bg-zinc-900/20 border border-white/5 overflow-hidden hover:bg-zinc-900/40 transition-all shadow-xl"
              >
                <div className="aspect-video bg-white/5 flex items-center justify-center text-5xl group-hover:scale-105 transition-transform duration-500">
                  {stream.img}
                  <div className="absolute top-4 left-4 px-3 py-1 rounded-full bg-rose-600 text-white text-[10px] font-black uppercase flex items-center gap-2 shadow-lg">
                    <Eye className="h-3 w-3" />
                    {stream.viewers}
                  </div>
                </div>
                
                <div className="p-6 space-y-4">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-2xl bg-zinc-800 flex items-center justify-center text-zinc-500">
                      <User className="h-5 w-5" />
                    </div>
                    <div>
                      <h3 className="text-sm font-bold text-white group-hover:text-rose-500 transition-colors leading-tight">{t(stream.titleEn, stream.titleBn)}</h3>
                      <p className="text-[10px] text-zinc-500 font-bold uppercase">{stream.host}</p>
                    </div>
                  </div>
                  
                  <div className="flex gap-2">
                    <Button className="flex-1 bg-rose-600/10 border border-rose-500/20 text-rose-500 hover:bg-rose-600 hover:text-white rounded-xl text-xs font-bold h-10 transition-all">
                      {t('Join Stream', 'যুক্ত হোন')}
                    </Button>
                    <Button variant="outline" size="icon" className="rounded-xl border-white/10 hover:bg-white/5 text-zinc-500">
                      <Share2 className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </div>

        {/* Upcoming Section */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2 space-y-6">
            <h2 className="text-xl font-black uppercase tracking-wider flex items-center gap-2">
              <Calendar className="h-5 w-5 text-rose-500" />
              {t('Upcoming Streams', 'আসন্ন লাইভ স্ট্রীম')}
            </h2>
            
            <div className="grid gap-4">
              {UPCOMING_STREAMS.map(stream => (
                <div 
                  key={stream.id}
                  className="p-5 rounded-[2rem] bg-zinc-900/20 border border-white/5 flex flex-col md:flex-row md:items-center justify-between gap-4"
                >
                  <div className="flex items-center gap-4">
                    <div className="w-14 h-14 rounded-2xl bg-white/5 flex flex-col items-center justify-center text-rose-500 border border-rose-500/10">
                      <Video className="h-6 w-6" />
                    </div>
                    <div>
                      <h4 className="font-bold text-white">{t(stream.titleEn, stream.titleBn)}</h4>
                      <p className="text-[10px] text-zinc-500 font-bold uppercase tracking-wide">{stream.host}</p>
                      <div className="flex items-center gap-1.5 text-[10px] text-rose-500 font-black uppercase pt-1">
                        <Clock className="h-3 w-3" />
                        {t(stream.time, stream.time)}
                      </div>
                    </div>
                  </div>
                  <Button 
                    onClick={() => handleRemind(t(stream.titleEn, stream.titleBn))}
                    className="rounded-xl bg-white/5 border border-white/10 hover:border-rose-500/50 hover:bg-rose-500/10 text-zinc-400 hover:text-rose-500 text-xs font-bold h-10 px-6"
                  >
                    <Bell className="h-4 w-4 mr-2" />
                    {t('Remind Me', 'রিমাইন্ডার')}
                  </Button>
                </div>
              ))}
            </div>
          </div>

          <div className="p-8 rounded-[3rem] bg-zinc-900/40 border border-white/5 space-y-6">
            <div className="w-14 h-14 rounded-2xl bg-rose-500/10 flex items-center justify-center text-rose-500 border border-rose-500/20">
              <Megaphone className="h-7 w-7" />
            </div>
            <h3 className="text-xl font-black leading-tight">
              {t('Start Your Own Stream', 'নিজে লাইভ স্ট্রীম শুরু করুন')}
            </h3>
            <p className="text-xs text-zinc-500 leading-relaxed">
              {t(
                'Showcase your products to thousands of potential buyers in real-time. Verified sellers only.',
                'হাজার হাজার সম্ভাব্য ক্রেতার কাছে রিয়েল-টাইমে আপনার পণ্য প্রদর্শন করুন। শুধুমাত্র ভেরিফাইড বিক্রেতাদের জন্য।'
              )}
            </p>
            <Button className="w-full bg-rose-500 hover:bg-rose-600 text-white rounded-2xl h-14 font-black shadow-lg shadow-rose-500/20">
              {t('Go Live Now', 'এখনই লাইভে যান')}
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}
