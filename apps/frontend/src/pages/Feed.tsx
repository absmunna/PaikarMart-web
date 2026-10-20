import React, { useState, useEffect, useMemo } from 'react';
import { 
  Sparkles, Package, Store, PlusCircle, Compass, 
  RefreshCw, Users, ShieldCheck, Flame, Filter
} from 'lucide-react';
import { StoryBar } from '@/design-system/components/feed/StoryBar';
import { CreatePostComposer } from '@/design-system/components/feed/CreatePostComposer';
import CreatePostModal from '@/design-system/components/feed/CreatePostModal';
import { SocialFeedCard } from '@/modules/feed/components/SocialFeedCard';
import { FeedPost } from '@/modules/feed/types';
import { useAuth } from '@/modules/auth';
import { useLocationStore } from '@/modules/location';
import { toast } from 'sonner';
import { feedService } from '@/modules/feed/services/feedService';
import { postService } from '@/core/services/postService';

const SOCIAL_FILTER_PILLS = [
  { id: 'all', label: 'সব পোস্ট', icon: Sparkles },
  { id: 'nearby', label: '📍 কাছাকাছি সেলার', icon: Compass },
  { id: 'following', label: 'অনুসরণকৃত শপ', icon: Users },
  { id: 'wholesale', label: 'পাইকারি আড়ত', icon: Package },
  { id: 'retail', label: 'খুচরা অফার', icon: Store }
];

export default function Feed() {
  const { user, isSeller } = useAuth();
  const { city: userLocation, setLocation: setCurrentLocation } = useLocationStore();

  // Filter and Location States
  const [activeSocialFilter, setActiveSocialFilter] = useState<string>('all');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  // Social Feed Data
  const [socialPosts, setSocialPosts] = useState<FeedPost[]>([]);

  // Subscribe to real-time posts from Firestore
  useEffect(() => {
    setIsLoading(true);
    const unsubscribe = postService.subscribeToFeed((posts) => {
      setSocialPosts(posts);
      setIsLoading(false);
    });

    return () => unsubscribe();
  }, []);

  // Handle post creation
  const handlePostCreated = (newPost: FeedPost) => {
    setSocialPosts(prev => {
      const exists = prev.some(p => p.id === newPost.id);
      if (exists) return prev;
      return [newPost, ...prev];
    });
  };

  // Filtered social posts based on active pills
  const displayedSocialPosts = useMemo(() => {
    const activeLoc = userLocation || 'Dhaka';
    if (activeSocialFilter === 'all') return socialPosts;
    if (activeSocialFilter === 'nearby') {
      return socialPosts.filter(p => 
        (p.location && p.location.toLowerCase().includes(activeLoc.toLowerCase())) ||
        (p.district && p.district.toLowerCase().includes(activeLoc.toLowerCase()))
      );
    }
    if (activeSocialFilter === 'following') {
      return socialPosts.filter(p => p.isFollowing || p.userInteractions?.isFollowing);
    }
    return socialPosts.filter(p => 
      p.type?.toLowerCase() === activeSocialFilter.toLowerCase() ||
      p.postType?.toLowerCase() === activeSocialFilter.toLowerCase() ||
      (activeSocialFilter === 'wholesale' && p.postType === 'product')
    );
  }, [socialPosts, activeSocialFilter, userLocation]);


  return (
    <div className="w-full pb-24 min-h-screen bg-[var(--pm-bg)] select-none">
      <div className="max-w-4xl mx-auto px-3 sm:px-6 space-y-5 pt-3">
        
        {/* ─── 1. STORIES RAIL ─── */}
        <div className="pt-1">
          <StoryBar />
        </div>

        {/* ─── 2. SOCIAL FEED CONTENT ─── */}
        <div className="space-y-4">
          
          {/* Real User Account Identity Card */}
          <div className="flex items-center justify-between gap-3 bg-[var(--pm-surface)] border border-[var(--pm-border)] p-3.5 rounded-3xl shadow-sm">
            <div className="flex items-center gap-3 min-w-0">
              <div className="w-10 h-10 rounded-full p-[2px] bg-gradient-to-tr from-[var(--pm-accent)] via-rose-500 to-amber-400 shrink-0">
                <img
                  src={user?.avatarUrl || user?.avatar || `https://api.dicebear.com/7.x/avataaars/svg?seed=${user?.fullName || user?.name || 'User'}`}
                  alt="User Avatar"
                  className="w-full h-full rounded-full object-cover bg-zinc-900"
                />
              </div>
              <div className="flex flex-col min-w-0">
                <div className="flex items-center gap-1.5 flex-wrap">
                  <span className="font-bold text-xs text-white truncate">
                    {user?.fullName || user?.name || "PaikarMart ইউজার"}
                  </span>
                  <span className="text-[10px] font-black px-1.5 py-0.2 rounded bg-white/10 text-amber-300">
                    {user?.role === 'seller' ? '🏢 সেলার' : user?.role === 'factory' ? '🏭 কারখানা' : user?.role === 'buyer' ? '🛒 বায়ার' : 'সদস্য'}
                  </span>
                  {user?.verification?.status === 'verified' && (
                    <span className="text-[10px] text-emerald-400 font-bold flex items-center gap-0.5">
                      ✓ ভেরিফায়েড
                    </span>
                  )}
                </div>
                <span className="text-[11px] text-[var(--pm-text-muted)] truncate">
                  {user?.seller?.shopName ? `শপ: ${user.seller.shopName}` : (user?.phone || user?.email || "রিয়েল একাউন্ট প্রোফাইল")}
                </span>
              </div>
            </div>

            <div className="flex items-center gap-2 shrink-0">
              <button
                onClick={() => setIsModalOpen(true)}
                className="flex items-center gap-1.5 px-3.5 py-2 bg-[var(--pm-accent)] hover:opacity-90 active:scale-95 text-white text-xs font-black rounded-xl shadow-md shadow-[var(--pm-accent)]/20 transition-all cursor-pointer"
              >
                <PlusCircle className="w-4 h-4" />
                <span className="hidden sm:inline">নতুন পোস্ট</span>
                <span className="sm:hidden">পোস্ট</span>
              </button>
            </div>
          </div>

          {/* Instant Feed Composer */}
          <div className="max-w-[580px] mx-auto w-full">
            <CreatePostComposer
              onPostCreated={handlePostCreated}
              onOpenModal={() => setIsModalOpen(true)}
            />
          </div>

          {/* Social Filter Pills */}
          <div className="flex items-center gap-2 overflow-x-auto hide-scrollbar pb-1 pt-1 max-w-[580px] mx-auto w-full">
            {SOCIAL_FILTER_PILLS.map((pill) => {
              const Icon = pill.icon;
              const isSelected = activeSocialFilter === pill.id;
              return (
                <button
                  key={pill.id}
                  onClick={() => setActiveSocialFilter(pill.id)}
                  className={`flex items-center gap-1.5 px-3.5 py-1.5 rounded-xl text-xs font-black whitespace-nowrap transition-all border shrink-0 cursor-pointer ${
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

          {/* Vertical 1:1 Aspect Ratio Social Feed Stream */}
          <div className="max-w-[580px] mx-auto space-y-6">
            {isLoading && socialPosts.length === 0 ? (
              <div className="text-center py-12 bg-[var(--pm-surface)] rounded-3xl border border-[var(--pm-border)] p-6">
                <RefreshCw className="w-6 h-6 animate-spin text-[var(--pm-accent)] mx-auto mb-2" />
                <p className="text-xs text-zinc-400 font-bold">লাইভ পোস্ট লোড হচ্ছে...</p>
              </div>
            ) : displayedSocialPosts.length === 0 ? (
              <div className="text-center py-16 bg-[var(--pm-surface)] rounded-3xl border border-[var(--pm-border)] p-6">
                <p className="text-sm font-black text-zinc-300">কোনো পোস্ট পাওয়া যায়নি</p>
                <p className="text-xs text-[var(--pm-text-muted)] mt-1">
                  অন্য ফিল্টার সিলেক্ট করুন অথবা নতুন পোস্ট করুন।
                </p>
              </div>
            ) : (
              displayedSocialPosts.map((post) => (
                <SocialFeedCard
                  key={post.id}
                  post={post}
                  onTagClick={(tag) => {
                    toast.info(`ট্যাগ ফিল্টারিং: ${tag}`);
                  }}
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

      {/* Create Post Modal */}
      <CreatePostModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onPostCreated={handlePostCreated}
      />
    </div>
  );
}

