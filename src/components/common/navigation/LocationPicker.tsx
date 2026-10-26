import React from 'react';
import { MapPin, ChevronDown } from 'lucide-react';

export const LocationPicker = () => {
  return (
    <button className="flex items-center gap-2 px-3 py-1.5 rounded-full bg-white/5 border border-white/10 hover:border-cyan-500/30 transition-all font-black text-[10px] uppercase tracking-widest text-cyan-400">
      <MapPin className="w-3 h-3" />
      <span>ঢাকা, বাংলাদেশ</span>
      <ChevronDown className="w-3 h-3 opacity-50" />
    </button>
  );
};
