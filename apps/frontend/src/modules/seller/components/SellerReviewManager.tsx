import React from 'react';
import { Star, MessageSquare, ShieldCheck, ThumbsUp, ChevronDown, User, Reply, MoreHorizontal } from 'lucide-react';
import { cn } from '@/lib/utils';
import { GlassCard } from '@/components/ui';

export const SellerReviewManager: React.FC = () => {
  // Mock reviews for the dashboard visibility
  const reviews = [
    { 
      id: 'r1', 
      user: 'Nirjon M.', 
      rating: 5, 
      text: 'Original product quality is quite exceptional. The packaging was also very secure for long distance shipping.', 
      date: '2h ago',
      verified: true
    },
    { 
      id: 'r2', 
      user: 'Rahima B.', 
      rating: 4, 
      text: 'Good value for money. Sizing was slightly smaller than expected but still fits well.', 
      date: '1d ago',
      verified: true
    }
  ];

  return (
    <div className="flex flex-col gap-6 w-full select-none">
       <div className="flex items-center justify-between">
           <h3 className="text-[11px] uppercase tracking-[0.2em] text-zinc-500 font-black flex items-center gap-2">
                <Star className="w-4.5 h-4.5 text-amber-500" /> Reputation
           </h3>
           <GlassCard className="px-3 py-1.5 rounded-xl flex items-center gap-2 border-white/10 hover:border-amber-400/30">
               <span className="text-[11px] font-black text-white">4.8</span>
               <div className="flex items-center gap-0.5">
                   {[1,2,3,4,5].map(i => <Star key={i} className={cn("w-2.5 h-2.5", i <= 4 ? "fill-amber-400 text-amber-400" : "text-zinc-800")} />)}
               </div>
           </GlassCard>
       </div>

       <div className="flex flex-col gap-5">
           {reviews.map((review) => (
               <GlassCard key={review.id} className="p-5 flex flex-col gap-4 border-white/5 hover:border-white/10">
                   <div className="flex items-start justify-between">
                       <div className="flex items-center gap-3">
                           <div className="w-10 h-10 rounded-2xl bg-white/5 border border-white/10 flex items-center justify-center text-[10px] font-black text-zinc-400 uppercase shadow-inner">
                               {review.user.charAt(0)}
                           </div>
                           <div>
                               <div className="flex items-center gap-2">
                                   <p className="text-xs font-black text-white uppercase tracking-tighter">{review.user}</p>
                                   {review.verified && (
                                       <span className="flex items-center gap-1 text-[8px] font-black text-primary uppercase tracking-[0.1em] bg-primary/10 px-2 py-0.5 rounded-full border border-primary/20">
                                           <ShieldCheck className="w-3 h-3" /> Verified
                                       </span>
                                   )}
                               </div>
                               <p className="text-[10px] text-zinc-600 font-black uppercase mt-1 tracking-tighter">{review.date}</p>
                           </div>
                       </div>
                       <div className="flex items-center gap-0.5">
                           {[1,2,3,4,5].map(i => (
                               <Star key={i} className={cn("w-2.5 h-2.5", i <= review.rating ? "fill-amber-400 text-amber-400" : "text-zinc-900")} />
                           ))}
                       </div>
                   </div>

                   <p className="text-[11px] text-zinc-400 leading-relaxed font-bold tracking-tight italic">"{review.text}"</p>

                   <div className="flex items-center gap-4 pt-4 border-t border-white/5">
                       <button className="flex items-center gap-2.5 text-[10px] font-black uppercase text-zinc-500 hover:text-primary transition-all active:scale-95 cursor-pointer">
                           <Reply className="w-3.5 h-3.5" /> Reply
                       </button>
                       <button className="flex items-center gap-2.5 text-[10px] font-black uppercase text-zinc-500 hover:text-white transition-all active:scale-95 cursor-pointer">
                           <ThumbsUp className="w-3.5 h-3.5" /> Thank
                       </button>
                       <button className="ml-auto text-zinc-800 hover:text-zinc-600 transition-colors cursor-pointer">
                           <MoreHorizontal className="w-4.5 h-4.5" />
                       </button>
                   </div>
               </GlassCard>
           ))}
       </div>

       <button className="w-full py-4 rounded-[1.5rem] glass-3d border-white/5 text-[10px] font-black uppercase tracking-[0.2em] text-zinc-500 hover:text-white hover:border-white/10 transition-all active:scale-[0.98] cursor-pointer shadow-lg shadow-black/40">
           Analytics Masterview
       </button>
    </div>
  );
};
