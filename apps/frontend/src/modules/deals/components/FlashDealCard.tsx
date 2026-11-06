import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  Zap, 
  Clock, 
  Flame, 
  ShoppingBag, 
  ArrowRight,
  ShieldCheck,
  TrendingUp
} from 'lucide-react';
import { cn } from '@lib/utils';
import { formatBDT } from '@lib/format';
import { ExclusiveDeal } from '../types';
import { Button } from '@ui/button';
import { useCartStore } from '@/modules/cart';

interface FlashDealCardProps {
  deal: ExclusiveDeal;
  className?: string;
}

export const FlashDealCard: React.FC<FlashDealCardProps> = ({ deal, className }) => {
  const [timeLeft, setTimeLeft] = useState<{h: number, m: number, s: number}>({h: 0, m: 0, s: 0});
  const addToCart = useCartStore((state) => state.addItem);

  useEffect(() => {
    const calculateTimeLeft = () => {
      const difference = +new Date(deal.endTime) - +new Date();
      if (difference > 0) {
        setTimeLeft({
          h: Math.floor((difference / (1000 * 60 * 60)) % 24),
          m: Math.floor((difference / 1000 / 60) % 60),
          s: Math.floor((difference / 1000) % 60)
        });
      }
    };

    const timer = setInterval(calculateTimeLeft, 1000);
    calculateTimeLeft();
    return () => clearInterval(timer);
  }, [deal.endTime]);

  const stockPercentage = (deal.currentStock / deal.initialStock) * 100;
  const isUrgent = stockPercentage < 20;

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className={cn(
        "group relative flex flex-col md:flex-row glass p-2 rounded-[2rem] border-white/5 overflow-hidden transition-all duration-500 hover:border-orange-500/30",
        className
      )}
    >
      {/* Background Glow */}
      <div className="absolute -inset-2 bg-gradient-to-tr from-orange-600/10 via-amber-500/5 to-transparent blur-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-1000" />

      {/* Image Section */}
      <div className="relative w-full md:w-56 h-56 md:h-64 rounded-3xl overflow-hidden shrink-0">
        <img 
          src={(deal.product.images && deal.product.images[0]) || deal.product.image || 'https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=800'}
          alt={deal.product.title}
          className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
        />
        
        {/* Badges */}
        <div className="absolute top-4 left-4 flex flex-col gap-2">
          <div className="bg-orange-600 text-white px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-widest flex items-center gap-1.5 shadow-xl shadow-orange-600/20">
            <Zap className="w-3 h-3 fill-white" />
            Exclusive Deal
          </div>
          <div className="bg-black/60 backdrop-blur-md text-white px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-widest flex items-center gap-1.5 border border-white/10">
            <ShieldCheck className="w-3 h-3 text-[var(--pm-accent)]" />
            Verified PK Store
          </div>
        </div>

        {/* Countdown Overlay */}
        <div className="absolute bottom-4 left-4 right-4 bg-black/40 backdrop-blur-xl border border-white/10 rounded-2xl p-3">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Clock className="w-3 h-3 text-orange-400" />
              <span className="text-[10px] font-black text-white/60 uppercase tracking-widest">Ends In</span>
            </div>
            <div className="flex items-center gap-1.5">
              {[timeLeft.h, timeLeft.m, timeLeft.s].map((unit, i) => (
                <React.Fragment key={i}>
                  <div className="flex flex-col items-center">
                    <span className="text-sm font-black text-white leading-none">
                      {unit.toString().padStart(2, '0')}
                    </span>
                  </div>
                  {i < 2 && <span className="text-white/30 font-bold mb-0.5">:</span>}
                </React.Fragment>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Content Section */}
      <div className="flex-1 p-5 md:p-6 flex flex-col justify-between">
        <div className="space-y-4">
          <div className="space-y-1">
            <div className="flex items-center gap-2 mb-1">
              <span className="text-[10px] font-black text-orange-400 uppercase tracking-widest">
                {typeof deal.product.category === 'string' ? deal.product.category : 'General'}
              </span>
              <span className="w-1 h-1 rounded-full bg-zinc-700" />
              <span className="text-[10px] font-black text-zinc-500 uppercase tracking-widest">
                {(deal.product as any).seller?.shopName || 'Verified Partner'}
              </span>
            </div>
            <h3 className="text-xl font-black text-white leading-tight tracking-tight group-hover:text-orange-200 transition-colors">
              {deal.product.title}
            </h3>
          </div>

          <div className="flex items-end gap-4">
            <div>
              <p className="text-[10px] font-black text-zinc-500 uppercase tracking-widest mb-1">Exclusive Price</p>
              <p className="text-3xl font-black text-white tracking-tighter">
                {formatBDT(deal.dealPrice)}
              </p>
            </div>
            <div className="mb-1">
              <p className="text-xs font-bold text-zinc-500 line-through">
                {formatBDT(Number(deal.product.oldPrice || deal.product.price))}
              </p>
              <div className="inline-block bg-orange-500/10 text-orange-500 text-[10px] font-black px-2 py-0.5 rounded-md mt-1">
                Save {Math.round((1 - deal.dealPrice / Number(deal.product.oldPrice || deal.product.price)) * 100)}%
              </div>
            </div>
          </div>

          {/* Scarcity Indicator */}
          <div className="space-y-2">
            <div className="flex items-center justify-between text-[10px] font-black uppercase tracking-widest">
              <div className="flex items-center gap-1.5">
                <Flame className={cn("w-3 h-3", isUrgent ? "text-amber-500 animate-pulse" : "text-zinc-500")} />
                <span className={cn(isUrgent ? "text-amber-500" : "text-zinc-400")}>
                  {isUrgent ? 'Limited Quantity Left!' : 'FLASH SALE ACTIVE'}
                </span>
              </div>
              <span className="text-white">{deal.currentStock} Remaining</span>
            </div>
            <div className="h-1.5 w-full bg-white/5 rounded-full overflow-hidden">
              <motion.div 
                initial={{ width: 0 }}
                animate={{ width: `${stockPercentage}%` }}
                className={cn(
                  "h-full rounded-full transition-colors duration-500",
                  isUrgent ? "bg-red-500" : "bg-orange-500"
                )}
              />
            </div>
          </div>
        </div>

        <div className="flex items-center gap-3 mt-6">
          <Button 
            className="flex-1 bg-white text-black hover:bg-zinc-200 h-12 rounded-2xl font-black uppercase tracking-tight gap-3 transition-transform active:scale-95"
            onClick={() => addToCart({
               id: deal.product.id,
               name: deal.product.title,
               price: deal.dealPrice,
               originalPrice: deal.product.oldPrice || Number(deal.product.price),
               image: deal.product.image || (deal.product.images && deal.product.images[0]) || '',
               vendorId: deal.product.sellerId,
               portal: (deal.product.portal as any) || 'pk-shop'
            })}
          >
            <ShoppingBag className="w-5 h-5" />
            Claim Deal
          </Button>
          <Button 
            variant="outline"
            className="aspect-square h-12 w-12 rounded-2xl border-white/10 hover:bg-white/5 p-0"
          >
            <ArrowRight className="w-5 h-5 text-white" />
          </Button>
        </div>
      </div>
    </motion.div>
  );
};
