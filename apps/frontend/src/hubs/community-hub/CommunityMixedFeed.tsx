import React, { useMemo, useState } from 'react';
import { ClipboardList, MessageSquare, Newspaper, Video } from 'lucide-react';
import type { CommerceItem, PortalTab, PostType, ReactionType, SocialPost, TaggedProduct, User } from '@/types';
import { useLanguage } from '@/contexts/LanguageContext';
import { findRegisteredPortal, getPortalsForHub } from '@/hubs/shared/portalRegistry';
import { HubFeedCard } from '@/hubs/shared/HubFeedCard';
import { SocialPortal } from '@/portals/community/social-feed';
import { CreatorPortal } from '@/portals/community/creator-studio';
import { DemandBoardPortal } from '@/portals/shared/demand-board';

const COMMUNITY_ICONS: Record<string, React.ComponentType<{ className?: string }>> = {
  newspaper: Newspaper,
  clipboard: ClipboardList,
  video: Video,
  'message-square': MessageSquare,
};

interface CommunityMixedFeedProps {
  currentUser: User;
  posts: SocialPost[];
  commerceItems: CommerceItem[];
  onCreatePost: (content: string, taggedProduct?: TaggedProduct, mediaUrl?: string, postType?: PostType) => void;
  onReactToPost: (postId: string, reaction: ReactionType) => void;
  onAddComment: (postId: string, commentText: string) => void;
  onAddToCart: (item: CommerceItem) => void;
  onDeductBalance: (amount: number) => boolean;
  onSelectTab: (tab: PortalTab) => void;
  onOpenVendorModal?: () => void;
}

export const CommunityMixedFeed: React.FC<CommunityMixedFeedProps> = ({
  currentUser,
  posts,
  commerceItems,
  onCreatePost,
  onReactToPost,
  onAddComment,
  onAddToCart,
  onDeductBalance,
  onSelectTab,
  onOpenVendorModal,
}) => {
  const { language } = useLanguage();
  const isBn = language === 'bn';
  const [activePortalId, setActivePortalId] = useState<string>('all');

  const registeredPortals = useMemo(() => getPortalsForHub('community'), []);
  const activeRegisteredPortal =
    activePortalId !== 'all' ? findRegisteredPortal(activePortalId) : undefined;

  const highlightItems = useMemo(
    () =>
      commerceItems
        .filter((item) => item.isDemandRequest || item.badge?.toLowerCase().includes('offer') || item.tradeMode === 'wholesale')
        .slice(0, 4),
    [commerceItems]
  );

  const handlePortalSelect = (portalId: string) => {
    if (portalId === 'messages') {
      onSelectTab('messages');
      return;
    }
    setActivePortalId(portalId);
  };

  return (
    <div className="space-y-5 pb-20 animate-fadeIn">
      <section className="rounded-2xl sm:rounded-3xl bg-gradient-to-r from-indigo-600 via-purple-600 to-pink-600 p-5 sm:p-6 text-white shadow-lg">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div className="space-y-1">
            <p className="text-[10px] font-black uppercase tracking-[0.18em] text-white/75">
              {isBn ? 'কমিউনিটি হাব · মিক্সড ফিড' : 'Community Hub · Mixed Feed'}
            </p>
            <h1 className="text-xl sm:text-2xl font-black tracking-tight">
              {isBn ? 'সোশ্যাল ফিড, ডিমান্ড বোর্ড ও ক্রিয়েটর স্টুডিও' : 'Social Feed, Demand Board & Creator Studio'}
            </h1>
            <p className="text-xs sm:text-sm text-white/85">
              {isBn
                ? 'ক্রেতার ডিমান্ড, ভেন্ডর স্টোরি, লাইভ কমার্স রিলস এবং ডিরেক্ট মেসেজ এক জায়গায়।'
                : 'Explore community posts, buyer RFQs, creator reels, and direct trade chats together.'}
            </p>
          </div>
          {activePortalId !== 'all' && (
            <button
              type="button"
              onClick={() => setActivePortalId('all')}
              className="self-start sm:self-center px-3.5 py-2 rounded-xl bg-white/15 hover:bg-white/25 text-white text-xs font-bold backdrop-blur-sm transition-colors cursor-pointer"
            >
              {isBn ? 'মিক্সড ফিড দেখুন' : 'All Mixed Feed'}
            </button>
          )}
        </div>
      </section>

      <div className="flex items-center gap-2 overflow-x-auto no-scrollbar py-1">
        <button
          type="button"
          onClick={() => setActivePortalId('all')}
          className={`shrink-0 px-3.5 py-2 rounded-xl text-xs font-bold border transition-colors cursor-pointer ${
            activePortalId === 'all'
              ? 'bg-[var(--pm-accent)] text-[var(--pm-accent-fg)] border-transparent'
              : 'bg-[var(--pm-card)] text-[var(--pm-text)] border-[var(--pm-border)]'
          }`}
        >
          {isBn ? 'সব কমিউনিটি' : 'All Community'}
        </button>
        {registeredPortals.map((portal) => {
          const Icon = COMMUNITY_ICONS[portal.iconName] || Newspaper;
          const isActive = activePortalId === portal.id;
          return (
            <button
              key={portal.id}
              type="button"
              onClick={() => handlePortalSelect(portal.id)}
              className={`shrink-0 inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl text-xs font-bold border transition-colors cursor-pointer ${
                isActive
                  ? 'bg-[var(--pm-accent)] text-[var(--pm-accent-fg)] border-transparent'
                  : 'bg-[var(--pm-card)] text-[var(--pm-text)] border-[var(--pm-border)] hover:border-[var(--pm-accent)]/50'
              }`}
            >
              <Icon className="w-3.5 h-3.5" />
              <span>{isBn ? portal.labelBn : portal.labelEn}</span>
            </button>
          );
        })}
      </div>

      {activeRegisteredPortal?.id === 'demand-board' ? (
        <DemandBoardPortal
          currentUser={currentUser}
          onSelectTab={onSelectTab}
          onOpenVendorModal={onOpenVendorModal}
        />
      ) : activeRegisteredPortal?.id === 'creator-studio' ? (
        <CreatorPortal
          currentUser={currentUser}
          onDeductBalance={onDeductBalance}
        />
      ) : (
        <div className="space-y-6">
          {activePortalId === 'all' && highlightItems.length > 0 && (
            <section className="space-y-2.5">
              <div className="flex items-center justify-between px-1">
                <h2 className="text-sm font-black uppercase tracking-wider text-[var(--pm-muted)]">
                  {isBn ? 'ডিমান্ড ও কমিউনিটি অফার' : 'Featured Demands & Trade Offers'}
                </h2>
                <button
                  type="button"
                  onClick={() => setActivePortalId('demand-board')}
                  className="text-xs font-bold text-[var(--pm-accent)] cursor-pointer hover:underline"
                >
                  {isBn ? 'সব ডিমান্ড দেখুন' : 'View Demand Board'}
                </button>
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                {highlightItems.map((item) => (
                  <HubFeedCard
                    key={item.id}
                    item={item}
                    kind={item.isDemandRequest ? 'Demand' : 'Offer'}
                    onOpen={() => onAddToCart(item)}
                  />
                ))}
              </div>
            </section>
          )}

          <SocialPortal
            currentUser={currentUser}
            posts={posts}
            commerceItems={commerceItems}
            onCreatePost={onCreatePost}
            onReactToPost={onReactToPost}
            onAddComment={onAddComment}
            onAddToCart={onAddToCart}
          />
        </div>
      )}
    </div>
  );
};
