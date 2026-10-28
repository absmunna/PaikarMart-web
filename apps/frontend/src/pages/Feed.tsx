import React, { useState, useEffect, useMemo, useRef, useCallback } from 'react';
import { 
  Sparkles, Package, Store, PlusCircle, Compass, 
  RefreshCw, Users, MapPin, X
} from 'lucide-react';

import CreatePostModal from '@/design-system/components/feed/CreatePostModal';
import { SocialFeedCard } from '@/modules/feed/components/SocialFeedCard';
import { FeedPost } from '@/modules/feed/types';
import { useAuth } from '@/modules/auth';
import { useLocationStore } from '@/modules/location';
import { toast } from 'sonner';
import { postService } from '@/core/services/postService';
import { StoryBar } from '@/design-system/components/feed/StoryBar';

// Standard non-location category pills for Feed
const SOCIAL_FILTER_PILLS = [
  { id: 'all', label: 'সব পোস্ট', icon: Sparkles },
  { id: 'following', label: 'অনুসরণকৃত শপ', icon: Users },
  { id: 'wholesale', label: 'পাইকারি আড়ত', icon: Package },
  { id: 'retail', label: 'খুচরা অফার', icon: Store }
];

export default function Feed() {
  const { user } = useAuth();
  const { 
    city: userCity, 
    district: userDistrict, 
    area: userArea,
    formattedAddress,
    openLocationModal 
  } = useLocationStore();

  // Location guidance popup modal state
  const [showLocationGuideModal, setShowLocationGuideModal] = useState(false);

  // Active filter state
  const [activeSocialFilter, setActiveSocialFilter] = useState<string>('all');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  // Infinite Scroll / Auto-Loading Pagination States
  const [visibleCount, setVisibleCount] = useState<number>(5);
  const [isLoadingMore, setIsLoadingMore] = useState<boolean>(false);
  const sentinelRef = useRef<HTMLDivElement>(null);

  // Real-time Social Feed Data
  const [socialPosts, setSocialPosts] = useState<FeedPost[]>([]);

  // Active location from global location store (Main Header)
  const activeHeaderLocation = useMemo(() => {
    return formattedAddress || userArea || userDistrict || userCity || 'ঢাকা';
  }, [formattedAddress, userArea, userDistrict, userCity]);

  // Subscribe to real-time live posts from Firestore with fallback seed support
  useEffect(() => {
    setIsLoading(true);
    const unsubscribe = postService.subscribeToFeed((posts) => {
      setSocialPosts(posts);
      setIsLoading(false);
    });

    return () => unsubscribe();
  }, []);

  // Handle new post creation callback
  const handlePostCreated = (newPost: FeedPost) => {
    setSocialPosts(prev => {
      const exists = prev.some(p => p.id === newPost.id);
      if (exists) return prev;
      return [newPost, ...prev];
    });
    toast.success('আপনার পোস্টটি সফলভাবে লাইভ ফিডে প্রকাশিত হয়েছে!');
  };

  // Filtered posts stream based on Main Header's active location & filter pill
  const filteredSocialPosts = useMemo(() => {
    let posts = [...socialPosts];

    // 1. Auto-filter by Main Header's global location
    if (activeHeaderLocation && activeHeaderLocation !== 'all') {
      const locTarget = activeHeaderLocation.toLowerCase();
      const locMatches = posts.filter(p => {
        const pLoc = (p.location || '').toLowerCase();
        const pDist = (p.district || '').toLowerCase();
        const pDiv = (p.division || '').toLowerCase();
        return pLoc.includes(locTarget) || pDist.includes(locTarget) || pDiv.includes(locTarget);
      });

      // If location filter returns matches, display those prioritized
      if (locMatches.length > 0) {
        posts = locMatches;
      }
    }

    // 2. Social Type Filter Pill
    if (activeSocialFilter === 'following') {
      return posts.filter(p => p.isFollowing || p.userInteractions?.isFollowing);
    }
    if (activeSocialFilter === 'wholesale') {
      return posts.filter(p => p.postType === 'product' || p.product?.category === 'Wholesale');
    }
    if (activeSocialFilter === 'retail') {
      return posts.filter(p => p.postType !== 'product');
    }

    return posts;
  }, [socialPosts, activeHeaderLocation, activeSocialFilter]);

  // Paginated visible posts stream for infinite scroll
  const displayedPosts = useMemo(() => {
    return filteredSocialPosts.slice(0, visibleCount);
  }, [filteredSocialPosts, visibleCount]);

  const hasMore = visibleCount < filteredSocialPosts.length;

  // Auto-load more posts when scrolling near the bottom (Infinite Scroll Sentinel)
  const handleLoadMore = useCallback(() => {
    if (isLoadingMore || !hasMore) return;
    setIsLoadingMore(true);
    setTimeout(() => {
      setVisibleCount(prev => Math.min(prev + 4, filteredSocialPosts.length));
      setIsLoadingMore(false);
    }, 600);
  }, [isLoadingMore, hasMore, filteredSocialPosts.length]);

  useEffect(() => {
    const sentinel = sentinelRef.current;
    if (!sentinel) return;

    const observer = new IntersectionObserver(
      (entries) => {
        if (entries[0].isIntersecting && hasMore && !isLoadingMore) {
          handleLoadMore();
        }
      },
      { threshold: 0.1, rootMargin: '150px' }
    );

    observer.observe(sentinel);
    return () => observer.disconnect();
  }, [handleLoadMore, hasMore, isLoadingMore]);

  // Prompt location guidance modal when user taps location action inside feed
  const triggerLocationGuide = () => {
    setShowLocationGuideModal(true);
    toast.info("লোকেশন সিলেক্ট করতে মেইন হেডার-এর লোকেশন বাটনে ক্লিক করুন", {
      action: {
        label: "হেডার লোকেশন",
        onClick: () => openLocationModal()
      }
    });
  };

  return (
    <div className="w-full pb-28 min-h-screen bg-[var(--pm-bg)] select-none">
      <div className="max-w-4xl mx-auto px-3 sm:px-6 space-y-4 pt-3">
        
        {/* ─── 1. SELLER STORIES BAR ─── */}
        <div className="max-w-[620px] mx-auto w-full">
          <StoryBar />
        </div>

        {/* ─── 2. SOCIAL FILTER PILLS & POST CREATION BUTTON ─── */}
        <div className="flex items-center justify-between gap-2 max-w-[620px] mx-auto w-full pt-1">
          <div className="flex items-center gap-2 overflow-x-auto no-scrollbar pb-1 flex-1 min-w-0">
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
                      : 'bg-[var(--pm-surface)] text-[var(--pm-text-muted)] border-[var(--pm-border)] hover:bg-[var(--pm-surface-hover)] hover:text-[var(--pm-text)]'
                  }`}
                >
                  <Icon className="w-3.5 h-3.5" />
                  <span>{pill.label}</span>
                </button>
              );
            })}
          </div>

          <button
            onClick={() => setIsModalOpen(true)}
            className="flex items-center gap-1.5 px-3.5 py-2 bg-gradient-to-r from-[var(--pm-accent)] to-amber-500 hover:opacity-90 active:scale-95 text-white text-xs font-black rounded-xl shadow-md transition-all cursor-pointer shrink-0"
            title="নতুন সামাজিক বা ব্যবসায়িক পোস্ট করুন"
          >
            <PlusCircle className="w-4 h-4" />
            <span className="hidden sm:inline">নতুন পোস্ট</span>
          </button>
        </div>

        {/* ─── 3. LIVE AUTO-SYNCING FEED STREAM ─── */}
        <div className="max-w-[620px] mx-auto space-y-5 pt-1">
          {isLoading && socialPosts.length === 0 ? (
            <div className="text-center py-16 bg-[var(--pm-surface)] rounded-3xl border border-[var(--pm-border)] p-8 shadow-sm space-y-3">
              <RefreshCw className="w-7 h-7 animate-spin text-[var(--pm-accent)] mx-auto" />
              <p className="text-xs text-[var(--pm-text-muted)] font-bold">লাইভ ফিড লোড হচ্ছে...</p>
            </div>
          ) : displayedPosts.length === 0 ? (
            <div className="text-center py-16 px-4 bg-[var(--pm-surface)] rounded-3xl border border-[var(--pm-border)] border-dashed space-y-3 shadow-sm">
              <div className="w-14 h-14 mx-auto rounded-2xl bg-[var(--pm-accent)]/10 flex items-center justify-center text-[var(--pm-accent)]">
                <Sparkles className="w-6 h-6" />
              </div>
              <h3 className="text-base font-bold text-[var(--pm-text)]">
                {activeHeaderLocation} এলাকায় কোনো নির্দিষ্ট পোস্ট পাওয়া যায়নি
              </h3>
              <p className="text-xs text-[var(--pm-text-muted)] max-w-sm mx-auto leading-relaxed">
                লোকেশন পরিবর্তন করতে মেইন হেডারের লোকেশন বাটনে ক্লিক করুন অথবা আপনার প্রথম প্রোডাক্ট পোস্ট শেয়ার করুন।
              </p>
              <button
                onClick={triggerLocationGuide}
                className="inline-flex items-center gap-1.5 px-4 py-2 bg-emerald-500 text-white text-xs font-bold rounded-xl shadow-sm hover:opacity-90 transition-all cursor-pointer mt-2"
              >
                হেডার লোকেশন চেঞ্জ গাইড
              </button>
            </div>
          ) : (
            displayedPosts.map((post) => (
              <SocialFeedCard
                key={post.id}
                post={post}
                onTagClick={(tag) => {
                  toast.info(`ট্যাগ ফিল্টারিং: ${tag}`);
                }}
                onLocationClick={() => {
                  triggerLocationGuide();
                }}
              />
            ))
          )}

          {/* ─── 4. AUTO-LOADING INFINITE SCROLL SENTINEL & SPINNER ─── */}
          <div ref={sentinelRef} className="py-4 text-center">
            {isLoadingMore && (
              <div className="inline-flex items-center gap-2 px-4 py-2 rounded-2xl bg-[var(--pm-surface)] border border-[var(--pm-border)] shadow-md text-xs font-bold text-zinc-300">
                <RefreshCw className="w-4 h-4 animate-spin text-[var(--pm-accent)]" />
                <span>আরও পোস্ট অটো-লোড হচ্ছে...</span>
              </div>
            )}
            {!hasMore && displayedPosts.length > 0 && (
              <p className="text-xs text-[var(--pm-text-muted)] font-medium">
                ✓ আপনি সব সাম্প্রতিক পোস্ট দেখে ফেলেছেন
              </p>
            )}
          </div>

        </div>

      </div>

      {/* ─── LOCATION GUIDANCE POPUP MODAL ─── */}
      {showLocationGuideModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/75 backdrop-blur-md animate-fade-in">
          <div className="bg-[#121827] border border-emerald-500/30 rounded-3xl p-6 max-w-sm w-full text-center space-y-4 shadow-2xl relative">
            <button 
              onClick={() => setShowLocationGuideModal(false)}
              className="absolute top-3.5 right-3.5 p-1.5 rounded-full text-zinc-400 hover:text-white bg-white/5 transition-colors"
            >
              <X className="w-4 h-4" />
            </button>

            <div className="w-14 h-14 mx-auto rounded-2xl bg-emerald-500/10 border border-emerald-500/20 flex items-center justify-center text-emerald-400">
              <MapPin className="w-7 h-7 animate-bounce" />
            </div>

            <div className="space-y-2">
              <h3 className="text-base font-black text-white">লোকেশন সিলেক্ট করার নির্দেশিকা</h3>
              <p className="text-xs text-zinc-300 leading-relaxed font-medium">
                লোকেশন সিলেক্ট বা পরিবর্তন করতে উপরের <strong className="text-emerald-400">মেইন হেডার-এর লোকেশন বাটনে</strong> ক্লিক করুন।
              </p>
              <p className="text-[11px] text-zinc-400 leading-normal">
                মেইন হেডারের লোকেশন পরিবর্তনের সাথে সাথে ফিডের সকল প্রোডাক্ট, সার্ভিস, অফার ও শপ অটো-লোড হবে।
              </p>
            </div>

            <div className="pt-2 space-y-2">
              <button
                onClick={() => {
                  setShowLocationGuideModal(false);
                  openLocationModal();
                }}
                className="w-full py-3 px-4 bg-gradient-to-r from-emerald-500 to-teal-500 hover:opacity-90 active:scale-95 text-white font-black text-xs rounded-2xl shadow-lg shadow-emerald-500/20 transition-all flex items-center justify-center gap-2 cursor-pointer"
              >
                <Compass className="w-4 h-4" />
                <span>মেইন হেডারে লোকেশন চেঞ্জ করুন</span>
              </button>

              <button
                onClick={() => setShowLocationGuideModal(false)}
                className="w-full py-2 text-xs font-bold text-zinc-400 hover:text-white"
              >
                বন্ধ করুন
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Real-time Create Post Modal */}
      <CreatePostModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onPostCreated={handlePostCreated}
      />
    </div>
  );
}
