import React from 'react';
import { GlassCard } from "@/components/ui/GlassCard";
import { Sparkles, TrendingUp } from 'lucide-react';

export interface HeroSpotlightProps {
  context?: string;
  [key: string]: any;
}

export const HeroSpotlight: React.FC<HeroSpotlightProps> = ({ context }) => {
  return (
    <div className="relative h-64 w-full rounded-[2.5rem] overflow-hidden group">
      <img src="https://images.unsplash.com/photo-1607082348824-0a96f2a4b9da?q=80&w=1200" className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-[2000ms]" />
      <div className="absolute inset-0 bg-gradient-to-t from-black via-black/40 to-transparent" />
      <div className="absolute bottom-8 left-8 right-8 flex items-end justify-between">
        <div className="space-y-2">
          <div className="flex gap-2">
            <span className="px-3 py-1 rounded-full bg-cyan-500 text-black text-[10px] font-black uppercase tracking-widest flex items-center gap-1">
              <Sparkles size={10} /> Viral Now
            </span>
            <span className="px-3 py-1 rounded-full bg-white/10 backdrop-blur-md text-white text-[10px] font-black uppercase tracking-widest flex items-center gap-1">
              <TrendingUp size={10} /> Trending
            </span>
          </div>
          <h2 className="text-3xl font-black text-white tracking-tighter uppercase leading-none">PaikarMart Flash Sale</h2>
          <p className="text-zinc-300 text-sm font-medium">Up to 40% off on all wholesale electronics. Limited time only!</p>
        </div>
        <button className="bg-white text-black px-6 py-3 rounded-2xl font-black uppercase text-xs tracking-widest hover:bg-cyan-400 transition-colors">
          Shop Now
        </button>
      </div>
    </div>
  );
};
