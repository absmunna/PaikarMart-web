import React from 'react';
import { Link } from 'react-router-dom';

interface SectionHeaderProps {
  title: string;
  subtitle?: string;
  viewAllLink?: string;
  viewAllLabel?: string;
}

export const SectionHeader = ({ title, subtitle, viewAllLink, viewAllLabel = "সব দেখুন" }: SectionHeaderProps) => {
  return (
    <div className="flex items-center justify-between mb-4 px-1">
      <div className="flex flex-col">
        <h2 className="text-sm font-bold text-white uppercase tracking-tight italic">{title}</h2>
        {subtitle && <p className="text-[10px] text-zinc-600 font-bold uppercase tracking-widest leading-none mt-1">{subtitle}</p>}
      </div>
      {viewAllLink && (
        <Link to={viewAllLink} className="text-[10px] font-black text-cyan-400 uppercase tracking-widest hover:underline active:scale-95 transition-all">
          {viewAllLabel} →
        </Link>
      )}
    </div>
  );
};
