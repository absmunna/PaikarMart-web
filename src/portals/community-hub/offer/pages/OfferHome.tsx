import React, { useState } from 'react';
import { 
  Tag, Percent, Zap, Flame, 
  Clock, ArrowRight, Star, Gift,
  Filter, ShoppingBag, Timer, CheckCircle2,
  TrendingUp, Sparkles, Megaphone
} from 'lucide-react';
import { motion } from 'motion/react';
import { Button } from '@/components/ui/button';
import { StoryBar } from '@/shared/StoryBar';
import { PortalIconBar } from '@/shared/PortalIconBar';
import { toast } from 'sonner';

// Mock Flash Deals
const FLASH_DEALS = [
  { id: 'f1', titleEn: 'iPhone 15 Pro Max', titleBn: 'আইফোন ১৫ প্রো ম্যাক্স', discount: '15%', price: '1,45,000', oldPrice: '1,70,000', timeLeft: '02:45:12', img: '📱' },
  { id: 'f2', titleEn: 'Sony WH-1000XM5', titleBn: 'সনি হেডফোন', discount: '25%', price: '32,000', oldPrice: '42,500', timeLeft: '05:22:10', img: '🎧' },
  { id: 'f3', titleEn: 'Mechanical Keyboard', titleBn: 'মেকানিক্যাল কিবোর্ড', discount: '40%', price: '4,500', oldPrice: '7,500', timeLeft: '01:10:05', img: '⌨️' },
];

const COUPONS = [
  { id: 'c1', code: 'PMART50', descEn: '50% Off on Food', descBn: 'খাবারে ৫০% ছাড়', minSpend: '500', color: 'from-rose-500 to-pink-600' },
  { id: 'c2', code: 'FIRSTORDER', descEn: '200 Taka Cashback', descBn: '২০০ টাকা ক্যাশব্যাক', minSpend: '1000', color: 'from-cyan-500 to-blue-600' },
];

export default function OfferHome() {
  const [isBilingual, setIsBilingual] = useState(true);
  
  const t = (en: string, bn: string) => isBilingual ? bn : en;

  const handleClaim = (item: string) => {
    toast.success(`${t('Offer Claimed!', 'অফারটি গ্রহণ করা হয়েছে!')}: ${item}`);
  };

  return (
    <div className="min-h-screen bg-[#050505] text-white pb-32">
      {/* Portal Header Rule */}
      <section className="pt-4 px-2 space-y-1">
        <StoryBar context="offer" />
        <PortalIconBar context="marketplace" />
      </section>

      <div className="max-w-7xl mx-auto px-4 mt-6 space-y-10">
        {/* Flash Sale Banner */}
        <motion.div 
          initial={{ opacity: 0, scale: 0.98 }}
          animate={{ opacity: 1, scale: 1 }}
          className="relative rounded-[3rem] bg-gradient-to-br from-pink-900/40 via-zinc-900/40 to-black border border-pink-500/20 p-8 md:p-12 overflow-hidden shadow-2xl"
        >
          <div className="absolute top-0 right-0 w-96 h-96 bg-pink-500/10 rounded-full blur-3xl" />
          <div className="relative z-10 flex flex-col md:flex-row items-center gap-10">
            <div className="flex-1 space-y-6">
              <div className="flex items-center gap-3">
                <span className="px-4 py-1.5 rounded-full bg-pink-500/20 border border-pink-500/30 text-pink-500 text-[10px] font-black uppercase tracking-[0.3em] flex items-center gap-2">
                  <Flame className="h-4 w-4 animate-pulse" />
                  {t('Flash Sale Live', 'ফ্ল্যাশ সেল লাইভ')}
                </span>
                <button 
                  onClick={() => setIsBilingual(!isBilingual)}
                  className="text-[10px] text-zinc-500 hover:text-white"
                >
                  {isBilingual ? 'English' : 'বাংলা'}
                </button>
              </div>
              
              <h1 className="text-4xl md:text-7xl font-black tracking-tighter leading-none">
                {t('Massive Savings', 'বিশাল সেভিংস')} <br />
                <span className="text-pink-500">{t('Ends Tonight', 'আজ রাতেই শেষ')}</span>
              </h1>
              
              <div className="flex items-center gap-6 pt-2">
                <div className="space-y-1">
                  <p className="text-[10px] text-zinc-500 uppercase font-black">{t('Ends In', 'সময় বাকি')}</p>
                  <div className="flex gap-2">
                    {['02', '45', '12'].map((unit, i) => (
                      <div key={i} className="bg-white/5 border border-white/10 rounded-xl px-4 py-3 flex flex-col items-center">
                        <span className="text-2xl font-black text-white">{unit}</span>
                      </div>
                    ))}
                  </div>
                </div>
                <Button className="bg-pink-600 hover:bg-pink-700 text-white rounded-2xl px-10 h-16 font-black text-lg shadow-xl shadow-pink-500/20">
                  {t('Shop Deals', 'কেনাকাটা করুন')}
                </Button>
              </div>
            </div>
            
            <div className="hidden md:block w-72 h-72 rounded-full bg-pink-500/10 border border-pink-500/20 flex items-center justify-center relative">
              <div className="absolute inset-0 bg-gradient-to-t from-pink-500/20 to-transparent rounded-full animate-pulse" />
              <Percent className="h-32 w-32 text-pink-500 opacity-40" />
            </div>
          </div>
        </motion.div>

        {/* Coupons Grid */}
        <div className="space-y-6">
          <h2 className="text-xl font-black uppercase tracking-wider flex items-center gap-2">
            <Gift className="h-5 w-5 text-pink-500" />
            {t('Exclusive Coupons', 'এক্সক্লুসিভ কুপন')}
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {COUPONS.map(coupon => (
              <div key={coupon.id} className="relative overflow-hidden group">
                <div className={`absolute inset-y-0 left-0 w-2 bg-gradient-to-b ${coupon.color} rounded-full z-10`} />
                <div className="p-6 rounded-3xl bg-zinc-900/40 border border-white/5 flex items-center justify-between hover:bg-zinc-900/60 transition-all">
                  <div className="space-y-1">
                    <h3 className="text-lg font-black text-white uppercase tracking-tight">{coupon.code}</h3>
                    <p className="text-xs text-zinc-400">{t(coupon.descEn, coupon.descBn)}</p>
                    <p className="text-[10px] text-zinc-500 font-bold uppercase">{t(`Min Spend: ৳${coupon.minSpend}`, `ন্যূনতম খরচ: ৳${coupon.minSpend}`)}</p>
                  </div>
                  <Button 
                    variant="outline" 
                    onClick={() => handleClaim(coupon.code)}
                    className="rounded-xl border-pink-500/30 text-pink-500 hover:bg-pink-500 hover:text-white font-bold"
                  >
                    {t('Copy Code', 'কপি করুন')}
                  </Button>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Deals Grid */}
        <div className="space-y-6">
          <div className="flex items-center justify-between">
            <h2 className="text-xl font-black uppercase tracking-wider flex items-center gap-2">
              <Zap className="h-5 w-5 text-pink-500" />
              {t('Hot Deals of the Day', 'আজকের সেরা ডিল')}
            </h2>
            <Button variant="ghost" className="text-pink-500 font-bold text-xs uppercase">{t('View All', 'সব দেখুন')}</Button>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
            {FLASH_DEALS.map((deal, idx) => (
              <motion.div 
                key={deal.id}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: idx * 0.1 }}
                className="group p-6 rounded-[2.5rem] bg-zinc-900/20 border border-white/5 hover:bg-zinc-900/40 transition-all space-y-4"
              >
                <div className="relative aspect-video rounded-3xl bg-white/5 flex items-center justify-center text-6xl group-hover:scale-105 transition-transform overflow-hidden">
                  {deal.img}
                  <div className="absolute top-4 left-4 px-3 py-1 rounded-full bg-pink-600 text-white text-[10px] font-black uppercase tracking-widest shadow-lg">
                    {deal.discount} OFF
                  </div>
                </div>
                
                <div className="space-y-2">
                  <h3 className="font-bold text-white group-hover:text-pink-500 transition-colors">{t(deal.titleEn, deal.titleBn)}</h3>
                  <div className="flex items-center gap-3">
                    <span className="text-xl font-black text-white">৳{deal.price}</span>
                    <span className="text-sm text-zinc-600 line-through">৳{deal.oldPrice}</span>
                  </div>
                  
                  <div className="flex items-center justify-between pt-4">
                    <div className="flex items-center gap-2 text-pink-500">
                      <Timer className="h-3 w-3" />
                      <span className="text-[10px] font-black uppercase">{deal.timeLeft}</span>
                    </div>
                    <Button 
                      size="sm"
                      onClick={() => handleClaim(t(deal.titleEn, deal.titleBn))}
                      className="rounded-xl bg-pink-500 hover:bg-pink-600 text-white font-bold h-10 px-6"
                    >
                      {t('Buy Now', 'এখনই কিনুন')}
                    </Button>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
