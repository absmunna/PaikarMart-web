import React, { useState } from 'react';
import { 
  Car, Truck, Construction, Hammer, 
  Calendar, MapPin, Search, Star,
  CheckCircle2, Clock, Filter, 
  ArrowRight, Info, Building2, Tag,
  PartyPopper, Home as HomeIcon, Building
} from 'lucide-react';
import { motion } from 'motion/react';
import { Button } from '@/components/ui/button';
import { StoryBar } from '@/shared/StoryBar';
import { PortalIconBar } from '@/shared/PortalIconBar';
import { toast } from 'sonner';

// Mock Categories
const CATEGORIES = [
  { id: 'cars', nameEn: 'Vehicles', nameBn: 'যানবাহন', icon: Car, color: 'text-blue-400' },
  { id: 'trucks', nameEn: 'Trucks', nameBn: 'ট্রাক ও লরি', icon: Truck, color: 'text-orange-400' },
  { id: 'const', nameEn: 'Construction', nameBn: 'নির্মাণ যন্ত্র', icon: Construction, color: 'text-yellow-500' },
  { id: 'tools', nameEn: 'Tools', nameBn: 'যন্ত্রপাতি', icon: Hammer, color: 'text-emerald-400' },
  { id: 'events', nameEn: 'Events', nameBn: 'ইভেন্ট সামগ্রী', icon: PartyPopper, color: 'text-pink-400' },
];

const FEATURED_RENTALS = [
  { id: 'r1', nameEn: 'Toyota Noah (with Driver)', nameBn: 'টয়োটা নোহা (চালকসহ)', price: '4,500', unit: 'day', rating: '4.8', img: '🚐', category: 'cars' },
  { id: 'r2', nameEn: 'Concrete Mixer', nameBn: 'কংক্রিট মিক্সার', price: '2,500', unit: 'day', rating: '4.5', img: '🏗️', category: 'const' },
  { id: 'r3', nameEn: 'Sound System (Basic)', nameBn: 'সাউন্ড সিস্টেম (বেসিক)', price: '1,500', unit: 'event', rating: '4.9', img: '🔊', category: 'events' },
  { id: 'r4', nameEn: '10 Ton Pickup', nameBn: '১০ টন পিকআপ', price: '8,000', unit: 'trip', rating: '4.7', img: '🚚', category: 'trucks' },
];

export default function RentHome() {
  const [isBilingual, setIsBilingual] = useState(true);
  const [activeCat, setActiveCat] = useState('all');
  
  const t = (en: string, bn: string) => isBilingual ? bn : en;

  const handleRent = (name: string) => {
    toast.success(`${t('Booking Request Sent for', 'বুকিং অনুরোধ পাঠানো হয়েছে')}: ${name}`);
  };

  return (
    <div className="min-h-screen bg-[#02040a] text-white pb-32">
      {/* Portal Header Rule */}
      <section className="pt-4 px-2 space-y-1">
        <StoryBar context="rent" />
        <PortalIconBar context="logistics" />
      </section>

      <div className="max-w-7xl mx-auto px-4 mt-6 space-y-10">
        {/* Hero Section */}
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="relative rounded-[3rem] bg-gradient-to-br from-indigo-950/30 via-zinc-900/40 to-black border border-white/5 p-10 overflow-hidden shadow-2xl"
        >
          <div className="absolute top-0 right-0 w-80 h-80 bg-indigo-500/5 rounded-full blur-3xl" />
          <div className="relative z-10 space-y-6">
            <div className="flex items-center gap-3">
              <span className="px-4 py-1.5 rounded-full bg-indigo-500/10 border border-indigo-500/20 text-indigo-400 text-[10px] font-black uppercase tracking-[0.2em]">
                {t('Rental Marketplace', 'রেন্টাল মার্কেটপ্লেস')}
              </span>
              <button 
                onClick={() => setIsBilingual(!isBilingual)}
                className="text-[10px] text-zinc-500 hover:text-white"
              >
                {isBilingual ? 'English' : 'বাংলা'}
              </button>
            </div>
            
            <h1 className="text-4xl md:text-6xl font-black tracking-tighter leading-none">
              {t('Rent Everything', 'ভাড়া নিন সবকিছু')} <br />
              <span className="text-indigo-400">{t('Pay as you use', 'ব্যবহার অনুযায়ী পেমেন্ট')}</span>
            </h1>
            
            <p className="text-zinc-400 text-sm max-w-md leading-relaxed">
              {t(
                'From daily car rentals to heavy construction machinery, find the best verified rental providers in your area.',
                'প্রতিদিনের গাড়ি ভাড়া থেকে শুরু করে ভারী নির্মাণ যন্ত্রপাতি, আপনার এলাকায় সেরা ভেরিফাইড রেন্টাল সার্ভিস খুঁজে নিন।'
              )}
            </p>

            <div className="flex flex-wrap gap-4 pt-4">
              <div className="relative flex-1 max-w-md">
                <Search className="absolute left-4 top-1/2 -translate-y-1/2 h-4 w-4 text-zinc-500" />
                <input 
                  type="text"
                  placeholder={t('Search vehicles, tools, equipment...', 'গাড়ি, যন্ত্রপাতি বা ইভেন্ট সামগ্রী খুঁজুন...')}
                  className="w-full bg-white/5 border border-white/10 rounded-2xl py-4 pl-12 pr-4 text-sm outline-none focus:border-indigo-500/50 transition-colors"
                />
              </div>
              <Button className="bg-indigo-500 hover:bg-indigo-600 text-white rounded-2xl px-8 h-14 font-bold shadow-xl shadow-indigo-500/20">
                {t('Find Now', 'খুঁজুন')}
              </Button>
            </div>
          </div>
        </motion.div>

        {/* Categories Bar */}
        <div className="flex items-center gap-4 overflow-x-auto pb-4 scrollbar-hide">
          <button 
            onClick={() => setActiveCat('all')}
            className={`px-6 py-3 rounded-2xl text-xs font-black uppercase tracking-wider whitespace-nowrap transition-all border ${
              activeCat === 'all' ? 'bg-white text-black border-white' : 'bg-white/5 text-zinc-500 border-white/5 hover:border-white/20'
            }`}
          >
            {t('All Items', 'সব আইটেম')}
          </button>
          {CATEGORIES.map(cat => (
            <button 
              key={cat.id}
              onClick={() => setActiveCat(cat.id)}
              className={`flex items-center gap-3 px-6 py-3 rounded-2xl text-xs font-bold whitespace-nowrap transition-all border ${
                activeCat === cat.id ? 'bg-indigo-500/10 border-indigo-500 text-indigo-400' : 'bg-white/5 text-zinc-400 border-white/5 hover:border-white/20'
              }`}
            >
              <cat.icon className={`h-4 w-4 ${cat.color}`} />
              {t(cat.nameEn, cat.nameBn)}
            </button>
          ))}
        </div>

        {/* Featured Grid */}
        <div className="space-y-6">
          <div className="flex items-center justify-between">
            <h2 className="text-xl font-black uppercase tracking-wider flex items-center gap-2">
              <Star className="h-5 w-5 text-indigo-400 fill-indigo-400" />
              {t('Featured Rentals', 'জনপ্রিয় রেন্টাল আইটেম')}
            </h2>
            <div className="flex items-center gap-2">
              <Filter className="h-4 w-4 text-zinc-500" />
              <span className="text-xs text-zinc-500 font-bold uppercase">{t('Sort by: Popular', 'সর্ট: জনপ্রিয়')}</span>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {FEATURED_RENTALS.map((item, idx) => (
              <motion.div 
                key={item.id}
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: idx * 0.1 }}
                className="group relative rounded-[2rem] bg-zinc-900/20 border border-white/5 p-5 hover:bg-zinc-900/40 transition-all flex flex-col"
              >
                <div className="aspect-[4/3] rounded-2xl bg-white/5 flex items-center justify-center text-4xl mb-4 group-hover:scale-105 transition-transform">
                  {item.img}
                </div>
                
                <div className="flex-1 space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="text-[10px] text-zinc-500 font-black uppercase">{item.category}</span>
                    <div className="flex items-center gap-1">
                      <Star className="h-3 w-3 text-yellow-500 fill-yellow-500" />
                      <span className="text-[10px] font-bold">{item.rating}</span>
                    </div>
                  </div>
                  <h3 className="font-bold text-white group-hover:text-indigo-400 transition-colors">{t(item.nameEn, item.nameBn)}</h3>
                  
                  <div className="pt-2 flex items-end justify-between">
                    <div>
                      <p className="text-[10px] text-zinc-500 uppercase font-black">{t('Starting from', 'শুরু')}</p>
                      <p className="text-lg font-black text-white">
                        ৳{item.price} <span className="text-[10px] text-zinc-500">/ {t(item.unit, item.unit)}</span>
                      </p>
                    </div>
                    <Button 
                      size="icon" 
                      onClick={() => handleRent(t(item.nameEn, item.nameBn))}
                      className="rounded-xl bg-white/5 hover:bg-indigo-500 text-white border border-white/10"
                    >
                      <ArrowRight className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </div>

        {/* Benefits Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 pt-10">
          {[
            { title: 'Verified Owners', titleBn: 'ভেরিফাইড মালিক', desc: 'Every rental provider is NID & Trade License verified.', descBn: 'প্রতিটি রেন্টাল প্রোভাইডার এনআইডি এবং ট্রেড লাইসেন্স ভেরিফাইড।', icon: CheckCircle2 },
            { title: 'Flexible Booking', titleBn: 'সহজ বুকিং', desc: 'Daily, weekly or custom long-term rentals available.', descBn: 'দৈনিক, সাপ্তাহিক বা কাস্টম দীর্ঘমেয়াদী ভাড়া নেওয়ার সুবিধা।', icon: Calendar },
            { title: 'Secured Payments', titleBn: 'নিরাপদ পেমেন্ট', desc: 'Pay via PaikarMart Escrow for 100% security.', descBn: '১০০% নিরাপত্তার জন্য পাইকারমার্ট এসক্রো ব্যবহার করুন।', icon: Building2 },
          ].map((benefit, idx) => (
            <div key={idx} className="p-8 rounded-[2.5rem] bg-indigo-500/5 border border-indigo-500/10 space-y-4">
              <div className="w-12 h-12 rounded-2xl bg-indigo-500/10 flex items-center justify-center text-indigo-400">
                <benefit.icon className="h-6 w-6" />
              </div>
              <h3 className="font-bold text-white">{t(benefit.title, benefit.titleBn)}</h3>
              <p className="text-xs text-zinc-500 leading-relaxed">{t(benefit.desc, benefit.descBn)}</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
