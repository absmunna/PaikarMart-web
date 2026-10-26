import React from 'react';
import { ShieldCheck } from 'lucide-react';
import { cn } from "@/lib/utils";

interface TrustBadgeProps {
  level: number;
  size?: 'sm' | 'md' | 'lg';
  interactive?: boolean;
}

export const TrustBadge: React.FC<TrustBadgeProps> = ({ level, size = 'sm', interactive = true }) => {
  const levels = [
    { label: 'Guest', color: 'text-zinc-500', bg: 'bg-zinc-500/10' },
    { label: 'Verified', color: 'text-cyan-500', bg: 'bg-cyan-500/10' },
    { label: 'Pro', color: 'text-emerald-500', bg: 'bg-emerald-500/10' },
    { label: 'Expert', color: 'text-amber-500', bg: 'bg-amber-500/10' },
    { label: 'Partner', color: 'text-violet-500', bg: 'bg-violet-500/10' },
    { label: 'Enterprise', color: 'text-rose-500', bg: 'bg-rose-500/10' },
    { label: 'Supreme', color: 'text-indigo-500', bg: 'bg-indigo-500/10' },
  ];

  const config = levels[Math.min(level, levels.length - 1)];

  return (
    <div className={cn(
      "flex items-center gap-1.5 px-2 py-0.5 rounded-full border border-white/10",
      config.bg, config.color,
      size === 'sm' ? "text-[8px]" : size === 'md' ? "text-[10px]" : "text-xs"
    )}>
      <ShieldCheck size={size === 'sm' ? 10 : 12} />
      <span className="font-black uppercase tracking-widest">{config.label}</span>
    </div>
  );
};
