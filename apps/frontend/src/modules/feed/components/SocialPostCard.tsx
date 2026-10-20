import React from 'react';
import { Heart, MessageSquare, Share2, ShoppingCart } from 'lucide-react';

interface SocialPostCardProps {
  post: {
    id: string;
    author: string;
    avatar: string;
    content: string;
    media?: string;
    mediaType?: 'image' | 'video';
    likes: number;
    comments: number;
  };
}

export const SocialPostCard: React.FC<SocialPostCardProps> = ({ post }) => {
  return (
    <div className="bg-[var(--pm-surface)] border border-[var(--pm-border)] rounded-3xl overflow-hidden shadow-sm hover:shadow-md hover:border-[var(--pm-accent)]/30 transition-all flex flex-col group">
      <div className="p-4 flex items-center gap-3">
        <div className="w-10 h-10 rounded-2xl bg-gradient-to-tr from-[var(--pm-accent)] to-rose-500 p-[1px]">
          <img src={post.avatar} alt={post.author} className="w-full h-full rounded-[15px] object-cover bg-[var(--pm-surface)]" />
        </div>
        <div className="flex flex-col">
          <span className="font-black text-sm text-[var(--pm-text)] tracking-tight">{post.author}</span>
          <span className="text-[10px] text-[var(--pm-text-muted)] font-bold uppercase tracking-wider">Verified Seller</span>
        </div>
      </div>
      
      {post.media && (
        <div className="aspect-square bg-zinc-900 overflow-hidden relative">
          <img src={post.media} alt="Post media" className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105" />
          <div className="absolute top-3 right-3">
             <span className="bg-black/40 backdrop-blur-md px-2.5 py-1 rounded-full text-[10px] font-black text-white border border-white/10">NEW ARRIVAL</span>
          </div>
        </div>
      )}

      <div className="p-4 flex-1 flex flex-col">
        <p className="text-xs text-[var(--pm-text-muted)] font-medium leading-relaxed mb-4 line-clamp-2">{post.content}</p>
        
        <div className="mt-auto pt-4 border-t border-[var(--pm-border)]/50 flex items-center justify-between">
          <div className="flex items-center gap-4">
            <button className="flex items-center gap-1.5 text-xs font-bold text-[var(--pm-text-muted)] hover:text-rose-500 transition-colors">
              <Heart className="w-4 h-4" /> 
              <span>{post.likes}</span>
            </button>
            <button className="flex items-center gap-1.5 text-xs font-bold text-[var(--pm-text-muted)] hover:text-emerald-500 transition-colors">
              <MessageSquare className="w-4 h-4" /> 
              <span>{post.comments}</span>
            </button>
          </div>
          
          <button className="px-4 py-2 rounded-xl bg-[var(--pm-accent)] text-white text-[11px] font-black shadow-sm shadow-[var(--pm-accent)]/20 hover:brightness-110 active:scale-95 transition-all flex items-center gap-1.5">
            <ShoppingCart className="w-3.5 h-3.5" />
            কিনুন
          </button>
        </div>
      </div>
    </div>
  );
};
