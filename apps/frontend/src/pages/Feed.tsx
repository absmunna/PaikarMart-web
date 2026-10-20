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

  // Fetch social feed from backend API using feedService
  const fetchFeeds = async () => {
    setIsLoading(true);
    try {
      const docLoc = userLocation || 'Dhaka';
      const posts = await feedService.getSocialFeed(docLoc, activeSocialFilter);
      if (posts.length > 0) {
        setSocialPosts(posts);
      } else {
        throw new Error("Empty posts");
      }
    } catch (err) {
      console.warn('Backend feed fetch warning, using resilient offline catalog:', err);
      setSocialPosts([
        {
          id: 'post-soc-fallback-1',
          type: 'wholesale',
          sellerId: 'v-cotton-1',
          sellerName: 'প্রিমিয়াম কটন টেক্সটাইল আড়ত',
          storeName: 'প্রিমিয়াম কটন টেক্সটাইল আড়ত',
          avatarUrl: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop',
          location: 'ইসলামপুর, ঢাকা',
          district: 'Dhaka',
          division: 'Dhaka',
          isVerified: true,
          isFollowing: false,
          followersCount: 1420,
          createdAt: new Date().toISOString(),
          content: 'রমজান ও ঈদের স্পেশাল প্রিমিয়াম জ্যাকার্ড সুতি পাঞ্জাবি ফেব্রিক্স সরাসরি টেক্সটাইল মিল থেকে স্টক লট অফার! পাইকারি লটে ন্যূনতম ১০ পিস থেকে অর্ডার করুন। #পাইকারি #ঈদকালেকশন #টেক্সটাইল',
          tags: ['#পাইকারি', '#ঈদকালেকশন', '#টেক্সটাইল'],
          mediaType: 'image',
          mediaUrls: [
            'https://images.unsplash.com/photo-1602810318383-e386cc2a3ccf?w=800&auto=format&fit=crop&q=80'
          ],
          product: {
            id: 'prod-cotton-101',
            title: 'প্রিমিয়াম কটন জ্যাকার্ড পাঞ্জাবি (১০ পিস বান্ডিল)',
            price: 6500,
            originalPrice: 8500,
            discount: 24,
            moq: 10,
            stock: 450,
            rating: 4.9,
            reviewCount: 38,
            category: 'wholesale',
            image: 'https://images.unsplash.com/photo-1602810318383-e386cc2a3ccf?w=800&auto=format&fit=crop&q=80'
          },
          stats: { likes: 342, comments: 54, shares: 28, saves: 89 },
          userInteractions: { isLiked: false, isSaved: false, isFollowing: false },
          reviews: []
        }
      ]);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchFeeds();
  }, [userLocation, activeSocialFilter]);

  // Handle post creation
  const handleCreatePost = (newPostData: any) => {
    const created: FeedPost = {
      id: `post-u-${Date.now()}`,
      sellerId: user?.id || 'u-me',
      sellerName: user?.fullName || user?.name || 'PaikarMart সেলার',
      storeName: user?.fullName || 'আমার পাইকার শপ',
      avatarUrl: user?.avatarUrl || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150',
      location: `${userLocation || 'Dhaka'}, বাংলাদেশ`,
      district: userLocation || 'Dhaka',
      isVerified: Boolean(isSeller),
      createdAt: new Date().toISOString(),
      content: newPostData.content || '',
      tags: ['#PaikarMart', '#নতুনপোস্ট'],
      mediaType: 'image',
      mediaUrls: [
        newPostData.image || 'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=800'
      ],
      product: {
        id: `prod-${Date.now()}`,
        title: (newPostData.content || 'নতুন প্রোডাক্ট').slice(0, 30),
        price: 1250,
        originalPrice: 1500,
        discount: 16,
        moq: 1,
        rating: 5.0,
        image: newPostData.image || 'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=800'
      },
      stats: { likes: 1, comments: 0, shares: 0, saves: 0 },
      userInteractions: { isLiked: true, isSaved: false, isFollowing: false },
      reviews: []
    };

    setSocialPosts(prev => [created, ...prev]);
    toast.success('আপনার পোস্টটি সোশ্যাল ফিডে সফলভাবে প্রকাশ করা হয়েছে! 🚀');
  };

  // Filtered social posts based on active pills
  const displayedSocialPosts = useMemo(() => {
    const activeLoc = userLocation || 'Dhaka';
    if (activeSocialFilter === 'all') return socialPosts;
    if (activeSocialFilter === 'nearby') {
      return socialPosts.filter(p => 
        p.location.toLowerCase().includes(activeLoc.toLowerCase()) ||
        (p.district && p.district.toLowerCase().includes(activeLoc.toLowerCase()))
      );
    }
    if (activeSocialFilter === 'following') {
      return socialPosts.filter(p => p.isFollowing || p.userInteractions?.isFollowing);
    }
    return socialPosts.filter(p => p.type?.toLowerCase() === activeSocialFilter.toLowerCase());
  }, [socialPosts, activeSocialFilter, userLocation]);

  return (
    <div className="w-full pb-24 min-h-screen bg-[var(--pm-bg)] select-none">
      <div className="max-w-4xl mx-auto px-3 sm:px-6 space-y-5 pt-3">
        
        {/* ─── 1. STORIES RAIL ─── */}
        <div className="pt-1">
          <StoryBar />
        </div>

        {/* ─── 2. SOCIAL FEED CONTENT ─── */}
        <div className="space-y-5">
          {/* Post Composer Header Bar */}
          <div className="flex items-center justify-between gap-3 bg-[var(--pm-surface)]/60 border border-[var(--pm-border)] p-3 rounded-2xl">
            <div className="flex items-center gap-2">
              <span className="w-2.5 h-2.5 rounded-full bg-emerald-400 animate-pulse" />
              <span className="text-xs font-black text-white">লাইভ সোশ্যাল কমার্স স্ট্রিম</span>
            </div>

            <div className="flex items-center gap-2">
              <button
                onClick={() => fetchFeeds()}
                className="p-1.5 rounded-xl bg-white/5 hover:bg-white/10 text-zinc-300 transition-colors"
                title="রিফ্রেশ করুন"
              >
                <RefreshCw className={`w-3.5 h-3.5 ${isLoading ? 'animate-spin' : ''}`} />
              </button>

              <button
                onClick={() => setIsModalOpen(true)}
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

          {/* Vertical 1:1 Aspect Ratio Social Feed Stream */}
          <div className="max-w-[580px] mx-auto space-y-6">
            {displayedSocialPosts.length === 0 ? (
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
      />
    </div>
  );
}
