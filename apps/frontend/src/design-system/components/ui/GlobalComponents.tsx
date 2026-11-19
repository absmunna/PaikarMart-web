import React from 'react';
import { X } from 'lucide-react';

export const MarqueeNotice = ({ message, onDismiss }: { message: string, onDismiss: () => void }) => (
  <div className="bg-cyan-500 text-black p-2.5 px-5 flex justify-between items-center text-[10px] font-black uppercase tracking-widest rounded-2xl mb-4 shadow-lg shadow-cyan-500/20">
    <div className="animate-pulse">{message}</div>
    <button onClick={onDismiss} className="hover:bg-black/10 p-1 rounded-full transition-colors"><X className="w-4 h-4" /></button>
  </div>
);

export const SkeletonCard = () => (
  <div className="bg-white/[0.03] p-5 rounded-3xl border border-white/5 animate-pulse backdrop-blur-md">
    <div className="h-40 bg-white/5 rounded-2xl mb-4"></div>
    <div className="h-5 w-3/4 bg-white/5 rounded-full mb-3"></div>
    <div className="h-4 w-1/2 bg-white/5 rounded-full"></div>
  </div>
);
