import React from 'react';
import { cn } from '@/lib/utils';
import { Activity } from 'lucide-react';

export const GlobalSkeletonSystem: React.FC<{ className?: string }> = ({ className }) => {
  return (
    <div className={cn(
        "relative overflow-hidden bg-zinc-800/30 rounded-2xl border border-white/5",
        "before:absolute before:inset-0 before:-translate-x-full before:animate-[shimmer_2s_infinite] before:bg-gradient-to-r before:from-transparent before:via-white/5 before:to-transparent",
        className
    )} />
  );
};

export const PageSkeleton = () => (
    <div className="flex flex-col gap-8 p-6 animate-pulse">
        <div className="h-64 bg-zinc-800/50 rounded-[40px]" />
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="h-32 bg-zinc-800/40 rounded-3xl" />
            <div className="h-32 bg-zinc-800/40 rounded-3xl" />
            <div className="h-32 bg-zinc-800/40 rounded-3xl" />
        </div>
        <div className="h-96 bg-zinc-800/30 rounded-[32px]" />
    </div>
);

export const SidebarSkeleton = () => (
    <div className="flex flex-col gap-2 p-4 animate-pulse">
        {[1,2,3,4,5,6].map(i => (
            <div key={i} className="h-11 bg-zinc-800/40 rounded-xl" />
        ))}
    </div>
);

export const SafeFallbackCard: React.FC<{ message?: string; onRetry?: () => void }> = ({ 
    message = "Synchronization Failed", 
    onRetry 
}) => (
    <div className="p-8 rounded-[32px] bg-zinc-900/50 border border-white/5 backdrop-blur-xl flex flex-col items-center justify-center text-center gap-4 border-dashed">
        <div className="w-12 h-12 bg-zinc-800 rounded-2xl flex items-center justify-center text-zinc-500">
            <Activity className="w-6 h-6 animate-pulse" />
        </div>
        <div className="space-y-1">
            <h4 className="text-[10px] font-black text-white uppercase tracking-widest leading-none mb-2">{message}</h4>
            <p className="text-[8px] text-zinc-600 font-bold uppercase tracking-tight max-w-[180px]">
                The context failed to resolve. Regional latency or governance blocks may be active.
            </p>
        </div>
        {onRetry && (
            <button 
                onClick={onRetry}
                className="mt-2 h-9 px-6 bg-white/5 hover:bg-white/10 rounded-xl text-[8px] font-black text-white uppercase tracking-widest transition-all"
            >
                Re-Initialize
            </button>
        )}
    </div>
);
