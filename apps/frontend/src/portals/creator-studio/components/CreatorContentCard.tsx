import React from 'react';
import { Lock, Play, CheckCircle2, Heart, Coins, BookOpen } from 'lucide-react';
import { CreatorContent } from '@/types';

interface CreatorContentCardProps {
  post: CreatorContent;
  onUnlock: (postId: string, price: number) => void;
}

export const CreatorContentCard: React.FC<CreatorContentCardProps> = ({ post, onUnlock }) => {
  return (
    <article className="bg-[var(--pm-card)] text-[var(--pm-text)] border border-[var(--pm-border)] rounded-3xl overflow-hidden shadow-xs group transition-all duration-300 hover:shadow-xl">
      
      <div className="relative aspect-video overflow-hidden bg-[var(--pm-surface)] cursor-pointer">
        <img 
          src={post.mediaUrl || "https://images.unsplash.com/photo-1498050108023-c5249f4df085?auto=format&fit=crop&w=800&h=450&q=80"} 
          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700" 
          alt={post.title} 
          loading="lazy"
          decoding="async"
        />
        <div className="absolute inset-0 bg-black/10 group-hover:bg-transparent transition-colors" />
        
        {post.isPremium && !post.isUnlocked && (
          <div className="absolute inset-0 backdrop-blur-md bg-black/50 flex items-center justify-center transition-all">
            <div className="text-center space-y-4 px-6">
              <div className="w-14 h-14 rounded-full bg-white/20 flex items-center justify-center mx-auto border border-white/40 shadow-xl">
                <Lock className="w-7 h-7 text-white" />
              </div>
              <p className="text-white font-black text-sm uppercase tracking-widest drop-shadow-md">Premium Content Locked</p>
              <button 
                onClick={() => onUnlock(post.id, post.unlockPrice || 4.99)}
                className="px-6 py-2.5 rounded-2xl bg-[var(--pm-accent)] hover:bg-[var(--pm-accent-hover)] text-[var(--pm-accent-fg)] font-black text-xs uppercase tracking-widest shadow-lg transition-all active:scale-95 cursor-pointer"
              >
                Unlock for ${post.unlockPrice?.toFixed(2)}
              </button>
            </div>
          </div>
        )}

        {(!post.isPremium || post.isUnlocked) ? (
          <div className="absolute bottom-4 left-4 right-4 flex items-center justify-between">
            <div className="w-12 h-12 rounded-full bg-white/20 backdrop-blur-md flex items-center justify-center border border-white/30 text-white shadow-xl group-hover:scale-110 transition-transform">
              <Play className="w-6 h-6 fill-white" />
            </div>
            <span className="px-2.5 py-1 rounded-xl bg-black/70 backdrop-blur-md text-white text-[10px] font-black font-mono shadow-sm">14:28</span>
          </div>
        ) : null}
      </div>

      <div className="p-6 space-y-4">
        <div className="flex items-center gap-4">
          <img src={post.creatorAvatar} className="w-10 h-10 rounded-full object-cover ring-2 ring-[var(--pm-border)] shadow-sm" alt={post.creatorName} />
          <div className="min-w-0">
            <div className="flex items-center gap-1.5">
              <h4 className="text-sm font-bold text-[var(--pm-text)] truncate">{post.creatorName}</h4>
              {post.verified && <CheckCircle2 className="w-3.5 h-3.5 text-[var(--pm-accent)]" />}
            </div>
            <p className="text-[10px] font-bold text-[var(--pm-muted)] uppercase tracking-tighter">{post.timestamp} · {post.isPremium ? 'Premium Course' : 'Public Vlog'}</p>
          </div>
        </div>

        <h2 className="text-lg sm:text-xl font-bold text-[var(--pm-text)] leading-tight group-hover:text-[var(--pm-accent)] transition-colors">{post.title}</h2>
        <p className="text-sm text-[var(--pm-muted)] line-clamp-2 leading-relaxed">{post.previewText}</p>
        
        <div className="pt-4 border-t border-[var(--pm-border)] flex items-center justify-between text-[11px] font-bold text-[var(--pm-muted)] uppercase tracking-wider">
          <div className="flex items-center gap-6">
             <button className="flex items-center gap-1.5 hover:text-[var(--pm-danger)] transition-colors cursor-pointer"><Heart className="w-4 h-4"/> {post.likes}</button>
             <button className="flex items-center gap-1.5 hover:text-[var(--pm-warning)] transition-colors cursor-pointer"><Coins className="w-4 h-4"/> Tip Creator</button>
          </div>
          <button className="flex items-center gap-1.5 hover:text-[var(--pm-accent)] transition-colors cursor-pointer"><BookOpen className="w-4 h-4"/> Read Details</button>
        </div>
      </div>
    </article>
  );
};
