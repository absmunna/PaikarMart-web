import React, { useState } from 'react';
import { 
  Sparkles, 
  Video,
  Newspaper,
  Play
} from 'lucide-react';
import { CreatorContent, User } from '@/types';
import { INITIAL_CREATOR_POSTS } from '@/data/mockData';
import { AdMobBanner } from '@/components/shared/AdMobBanner';
import { CreatorContentCard } from '@/hubs/creator/components/CreatorContentCard';

interface CreatorHubPageProps {
  currentUser: User;
  onDeductBalance: (amount: number) => boolean;
}

export const CreatorHubPage: React.FC<CreatorHubPageProps> = ({
  currentUser,
  onDeductBalance,
}) => {
  const [posts, setPosts] = useState<CreatorContent[]>(INITIAL_CREATOR_POSTS);
  const [activeTab, setActiveTab] = useState<'all' | 'video' | 'news'>('all');

  const visiblePosts = activeTab === 'all'
    ? posts
    : posts.filter((post) => activeTab === 'video' ? Boolean(post.mediaUrl) : !post.mediaUrl);

  const handleUnlock = (postId: string, price: number) => {
    const success = onDeductBalance(price);
    if (success) {
      setPosts(prev => prev.map(p => 
        p.id === postId ? { ...p, isUnlocked: true } : p
      ));
    }
  };

  return (
    <div className="space-y-4 sm:space-y-6 animate-fadeIn pb-20">
      
      {/* OTT Style Banner */}
      <div className="bg-slate-900 rounded-2xl sm:rounded-3xl p-4 sm:p-8 text-white shadow-xl relative overflow-hidden aspect-[4/3] sm:aspect-auto sm:min-h-[300px] flex items-end">
        <img 
          src="https://images.unsplash.com/photo-1485846234645-a62644f84728?auto=format&fit=crop&w=1200&h=600&q=80" 
          className="absolute inset-0 w-full h-full object-cover opacity-60"
          alt="OTT Hero"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-slate-950/40 to-transparent" />
        
        <div className="relative z-10 space-y-2.5 sm:space-y-4 max-w-xl">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-red-600 text-white text-[10px] font-black uppercase tracking-widest animate-pulse">
            <Video className="w-3 h-3" />
            <span>PaikarMart Original</span>
          </div>
          <h1 className="text-2xl sm:text-5xl font-black tracking-tight leading-tight">Mastering Global Wholesale Logistics</h1>
          <p className="text-sm text-slate-300 line-clamp-2">Exclusive 12-part series on importing from East-Asia and navigating local trade laws.</p>
          <button className="px-6 py-3 rounded-2xl bg-white text-slate-950 font-bold text-sm flex items-center gap-2 hover:bg-slate-100 transition-all active:scale-[0.98]">
            <Play className="w-4 h-4 fill-slate-950" />
            <span>Watch Trailer</span>
          </button>
        </div>
      </div>

      {/* Tab Switcher */}
      <div className="flex items-center gap-2 overflow-x-auto no-scrollbar py-2">
        {(['all', 'video', 'news'] as const).map(tab => (
          <button
            key={tab}
            onClick={() => setActiveTab(tab)}
            className={`px-4 py-2 rounded-xl text-xs font-bold capitalize transition-all cursor-pointer ${
              activeTab === tab
                ? 'bg-[var(--pm-accent)] text-[var(--pm-accent-fg)] shadow-lg'
                : 'bg-[var(--pm-card)] text-[var(--pm-muted)] border border-[var(--pm-border)] hover:text-[var(--pm-text)]'
            }`}
          >
            {tab === 'all' ? 'Discovery' : tab === 'video' ? 'OTT Videos' : 'Industry News'}
          </button>
        ))}
      </div>

      {/* Creator Feed Cards with OTT focus */}
      <div className="grid grid-cols-1 gap-4 sm:gap-8">
        {visiblePosts.map((post) => (
          <CreatorContentCard
            key={post.id}
            post={post}
            onUnlock={handleUnlock}
          />
        ))}
      </div>

      <AdMobBanner />
      
      {/* Industry News Section */}
      <div className="bg-[var(--pm-surface)] border border-[var(--pm-border)] rounded-3xl p-6 space-y-4">
        <div className="flex items-center justify-between">
          <h3 className="text-sm font-black uppercase tracking-widest text-[var(--pm-text)] flex items-center gap-2">
            <Newspaper className="w-4 h-4 text-[var(--pm-accent)]" />
            PaikarMart Trade News
          </h3>
          <button className="text-[10px] font-bold text-[var(--pm-accent)] underline cursor-pointer">View Archive</button>
        </div>
        <div className="space-y-3">
           {[1, 2].map(i => (
             <div key={i} className="bg-[var(--pm-card)] p-4 rounded-2xl flex gap-3 shadow-sm border border-[var(--pm-border)]">
               <div className="w-16 h-16 rounded-xl bg-[var(--pm-surface)] shrink-0 overflow-hidden">
                  <img src={`https://images.unsplash.com/photo-1460925895917-afdab827c52f?auto=format&fit=crop&w=200&h=200&q=80`} alt="News" className="w-full h-full object-cover" />
               </div>
               <div className="space-y-1">
                  <h4 className="text-xs font-bold text-[var(--pm-text)] line-clamp-2">New Import Regulations for Consumer Electronics in Q4 2026</h4>
                  <p className="text-[10px] text-[var(--pm-muted)]">2 hours ago · 4 min read</p>
               </div>
             </div>
           ))}
        </div>
      </div>
    </div>
  );
};
