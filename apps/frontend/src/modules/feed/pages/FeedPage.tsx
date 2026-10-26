import React, { useState } from 'react';
import {
  Sparkles, Package, Store, PlusCircle, Compass,
  RefreshCw, Users
} from 'lucide-react';
import { StoryBar } from '@/design-system/components/feed/StoryBar';
import CreatePostModal from '@/design-system/components/feed/CreatePostModal';
import { SocialFeedCard } from '../components/SocialFeedCard';
import { useAuth } from '@/modules/auth';
import { useLocationStore } from '@/modules/location';
import { useFeed } from '../hooks/useFeed';
import { toast } from 'sonner';
import { FeedPost } from '../types';

const SOCIAL_FILTER_PILLS = [
  { id: 'all', label: 'সব পোস্ট', icon: Sparkles },
  { id: 'nearby', label: '📍 কাছাকাছি সেলার', icon: Compass },
  { id: 'following', label: 'অনুসরণকৃত শপ', icon: Users },
  { id: 'wholesale', label: 'পাইকারি আড়ত', icon: Package },
  { id: 'retail', label: 'খুচরা অফার', icon: Store }
];

export const FeedPage: React.FC = () => {
  const { user, isSeller } = useAuth();
  const { setLocation: setCurrentLocation } = useLocationStore();

  const [activeSocialFilter, setActiveSocialFilter] = useState<string>('all');
  const [isModalOpen, setIsModalOpen] = useState(false);

  const { socialPosts, isLoading, refresh } = useFeed('social', activeSocialFilter);

  const handleCreatePost = () => {
    setIsModalOpen(true);
  };

  return (
    <div className="w-full pb-24 min-h-screen bg-[var(--pm-bg)] select-none">
      <div className="max-w-4xl mx-auto px-3 sm:px-6 space-y-5 pt-3">

        {/* ─── 1. STORIES RAIL ─── */}
        <div className="pt-1">
          <StoryBar />
        </div>

        {/* ─── 2. SOCIAL STREAM ─── */}
        <div className="space-y-5">
          {/* Post Composer CTA */}
          <div className="flex items-center justify-between gap-3 bg-[var(--pm-surface)]/60 border border-[var(--pm-border)] p-3 rounded-2xl">
            <div className="flex items-center gap-2">
              <span className="w-2.5 h-2.5 rounded-full bg-emerald-400 animate-pulse" />
              <span className="text-xs font-black text-white">লাইভ সোশ্যাল কমার্স স্ট্রিম</span>
            </div>

            <div className="flex items-center gap-2">
              <button
                onClick={refresh}
                className="p-1.5 rounded-xl bg-white/5 hover:bg-white/10 text-zinc-300 transition-colors"
                title="রিফ্রেশ করুন"
              >
                <RefreshCw className={`w-3.5 h-3.5 ${isLoading ? 'animate-spin' : ''}`} />
              </button>

              <button
                onClick={handleCreatePost}
                className="flex items-center gap-1.5 px-3.5 py-1.5 bg-[var(--pm-accent)] hover:opacity-90 active:scale-95 text-white text-xs font-black rounded-xl shadow-md shadow-[var(--pm-accent)]/20 transition-all cursor-pointer"
              >
                <PlusCircle className="w-4 h-4" />
                <span>নতুন পোস্ট লিখুন</span>
              </button>
            </div>
          </div>

          {/* Social Filter Pills */}
          <div className="flex items-center gap-2 overflow-x-auto hide-scrollbar pb-1">
            {SOCIAL_FILTER_PILLS.map((pill) => {
              const Icon = pill.icon;
              const isSelected = activeSocialFilter === pill.id;
              return (
                <button
                  key={pill.id}
                  onClick={() => setActiveSocialFilter(pill.id)}
                  className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-black whitespace-nowrap transition-all border shrink-0 cursor-pointer ${
                    isSelected
                      ? 'bg-[var(--pm-accent)] text-white border-[var(--pm-accent)] shadow-md shadow-[var(--pm-accent)]/20'
                      : 'bg-white/5 text-zinc-300 border-white/10 hover:bg-white/10'
                  }`}
                >
                  <Icon className="w-3.5 h-3.5" />
                  <span>{pill.label}</span>
                </button>
              );
            })}
          </div>

          {/* Social Feed List */}
          <div className="max-w-[580px] mx-auto space-y-6">
            {isLoading && socialPosts.length === 0 ? (
              <div className="space-y-6">
                {[1, 2, 3].map(i => (
                  <div key={i} className="w-full aspect-square bg-white/5 animate-pulse rounded-3xl" />
                ))}
              </div>
            ) : socialPosts.length === 0 ? (
              <div className="text-center py-16 bg-[var(--pm-surface)] rounded-3xl border border-[var(--pm-border)] p-6">
                <p className="text-sm font-black text-zinc-300">কোনো পোস্ট পাওয়া যায়নি</p>
                <p className="text-xs text-[var(--pm-text-muted)] mt-1">
                  অন্য ফিল্টার সিলেক্ট করুন অথবা নতুন পোস্ট করুন।
                </p>
              </div>
            ) : (
              socialPosts.map((post: FeedPost) => (
                <SocialFeedCard
                  key={post.id}
                  post={post as any}
                  onTagClick={(tag) => toast.info(`ট্যাগ ফিল্টারিং: ${tag}`)}
                  onLocationClick={(loc) => {
                    setCurrentLocation(loc);
                    toast.success(`লোকেশন সিলেক্ট হয়েছে: ${loc}`);
                  }}
                />
              ))
            )}
          </div>
        </div>
      </div>

      <CreatePostModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
      />
    </div>
  );
};

export default FeedPage;
