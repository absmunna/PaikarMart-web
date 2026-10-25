import React, { useState } from 'react';
import { 
  Sparkles, Package, Store, PlusCircle, Compass, 
  RefreshCw, Users, MapPin, X
} from 'lucide-react';
import CreatePostModal from '@/design-system/components/feed/CreatePostModal';
import { SocialFeedCard } from '../components/SocialFeedCard';
import { useAuth } from '@/modules/auth';
import { useLocationStore } from '@/modules/location';
import { useFeed } from '../hooks/useFeed';
import { toast } from 'sonner';
import { FeedPost } from '../types';

const SOCIAL_FILTER_PILLS = [
  { id: 'all', label: 'সব পোস্ট', icon: Sparkles },
  { id: 'following', label: 'অনুসরণকৃত শপ', icon: Users },
  { id: 'wholesale', label: 'পাইকারি আড়ত', icon: Package },
  { id: 'retail', label: 'খুচরা অফার', icon: Store }
];

export const FeedPage: React.FC = () => {
  const { user } = useAuth();
  const { 
    city: userCity, 
    district: userDistrict, 
    area: userArea,
    formattedAddress,
    openLocationModal 
  } = useLocationStore();

  const [showLocationGuideModal, setShowLocationGuideModal] = useState(false);
  const [activeSocialFilter, setActiveSocialFilter] = useState<string>('all');
  const [isModalOpen, setIsModalOpen] = useState(false);

  const { socialPosts, isLoading, refresh } = useFeed('social', activeSocialFilter);

  const activeHeaderLocation = formattedAddress || userArea || userDistrict || userCity || 'ঢাকা';

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
    <div className="w-full pb-24 min-h-screen bg-[var(--pm-bg)] select-none">
      <div className="max-w-4xl mx-auto px-3 sm:px-6 space-y-4 pt-3">

        {/* ─── 2. ACTION & FILTER BAR ─── */}
        <div className="flex items-center justify-between gap-2 max-w-[620px] mx-auto w-full">
          {/* Social Filter Pills */}
          <div className="flex items-center gap-2 overflow-x-auto hide-scrollbar pb-1 flex-1 min-w-0">
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

          <button
            onClick={() => setIsModalOpen(true)}
            className="flex items-center gap-1.5 px-3.5 py-1.5 bg-[var(--pm-accent)] hover:opacity-90 active:scale-95 text-white text-xs font-black rounded-xl shadow-md shadow-[var(--pm-accent)]/20 transition-all cursor-pointer shrink-0"
          >
            <PlusCircle className="w-4 h-4" />
            <span className="hidden sm:inline">নতুন পোস্ট</span>
          </button>
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
                মেইন হেডারের লোকেশন বা অন্য ফিল্টার চেঞ্জ করুন।
              </p>
            </div>
          ) : (
            socialPosts.map((post: FeedPost) => (
              <SocialFeedCard
                key={post.id}
                post={post as any}
                onTagClick={(tag) => toast.info(`ট্যাগ ফিল্টারিং: ${tag}`)}
                onLocationClick={() => triggerLocationGuide()}
              />
            ))
          )}
        </div>

      </div>

      {/* Location Guidance Popup Modal */}
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

      <CreatePostModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
      />
    </div>
  );
};

export default FeedPage;
