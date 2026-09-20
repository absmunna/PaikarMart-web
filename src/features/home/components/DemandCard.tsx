import React from 'react';
import { motion } from 'motion/react';
import { FileText, MapPin, Clock, Tag } from 'lucide-react';
import { formatBDT } from '@/lib/format';

export interface DemandItem {
  id: string;
  title: string;
  description: string;
  budget: number;
  quantity: number;
  unit: string;
  category: string;
  location: string;
  postedAt: string;
}

export const DemandCard = ({ demand }: { demand: DemandItem }) => {
  return (
    <motion.div
      whileHover={{ y: -4 }}
      className="bg-[#050D08] border border-[#1e3425] rounded-[28px] p-5 h-full flex flex-col justify-between hover:border-cyan-500/40 transition-all group"
    >
      <div>
        <div className="flex items-start justify-between mb-3">
          <div className="p-2 bg-cyan-500/10 rounded-xl border border-cyan-500/20">
            <FileText className="w-5 h-5 text-cyan-400" />
          </div>
          <span className="text-[10px] font-black uppercase text-zinc-500 tracking-widest">{demand.category}</span>
        </div>
        
        <h3 className="text-sm font-bold text-white line-clamp-2 leading-snug mb-2 group-hover:text-cyan-400 transition-colors">
          {demand.title}
        </h3>
        
        <p className="text-[10px] text-zinc-400 line-clamp-2 mb-4 font-medium italic">
          "{demand.description}"
        </p>
      </div>

      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <div className="flex flex-col">
            <span className="text-[8px] font-black text-zinc-600 uppercase tracking-widest">Budget</span>
            <span className="text-sm font-black text-cyan-400">{formatBDT(demand.budget)}</span>
          </div>
          <div className="flex flex-col items-end">
            <span className="text-[8px] font-black text-zinc-600 uppercase tracking-widest">Needed</span>
            <span className="text-[10px] font-black text-white">{demand.quantity} {demand.unit}</span>
          </div>
        </div>

        <div className="pt-4 border-t border-white/5 flex items-center justify-between text-[9px] font-bold text-zinc-500 uppercase tracking-tighter">
          <span className="flex items-center gap-1">
            <MapPin className="w-3 h-3 text-zinc-700" />
            {demand.location || 'Bangladesh'}
          </span>
          <span className="flex items-center gap-1">
            <Clock className="w-3 h-3 text-zinc-700" />
            {demand.postedAt}
          </span>
        </div>
      </div>
    </motion.div>
  );
};
