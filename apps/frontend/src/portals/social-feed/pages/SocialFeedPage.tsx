import React, { useEffect, useRef, useState } from 'react';
import { StoriesTray } from '@/portals/social-feed/components/StoriesTray';
import { PostComposer } from '@/portals/social-feed/components/PostComposer';
import { FeedPostCard } from '@/portals/social-feed/components/FeedPostCard';
import { AdMobBanner } from '@/components/shared/AdMobBanner';
import { INITIAL_STORIES } from '@/data/mockData';
import { User, SocialPost, CommerceItem, ReactionType, PostType, TaggedProduct } from '@/types';

interface SocialFeedPageProps {
  currentUser: User;
  posts: SocialPost[];
  commerceItems: CommerceItem[];
  onCreatePost: (content: string, taggedProduct?: TaggedProduct, mediaUrl?: string, postType?: PostType) => void;
  onReactToPost: (postId: string, reaction: ReactionType) => void;
  onAddComment: (postId: string, commentText: string) => void;
  onAddToCart: (item: CommerceItem) => void;
}

export const SocialFeedPage: React.FC<SocialFeedPageProps> = ({
  currentUser,
  posts,
  commerceItems,
  onCreatePost,
  onReactToPost,
  onAddComment,
  onAddToCart
}) => {
  const [visibleCount, setVisibleCount] = useState(5);
  const loadMoreRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    setVisibleCount(5);
  }, [posts.length]);

  useEffect(() => {
    const sentinel = loadMoreRef.current;
    if (!sentinel || visibleCount >= posts.length) return;
    const observer = new IntersectionObserver(([entry]) => {
      if (entry.isIntersecting) setVisibleCount((count) => Math.min(count + 5, posts.length));
    }, { rootMargin: '280px 0px' });
    observer.observe(sentinel);
    return () => observer.disconnect();
  }, [posts.length, visibleCount]);

  return (
    <div className="space-y-4 sm:space-y-6 pb-2 animate-fadeIn">
      {/* Facebook Horizontal Stories Carousel */}
      <StoriesTray
        stories={INITIAL_STORIES}
        currentUser={currentUser}
      />

      {/* "What's on your mind?" Post Composer with Tag Commerce Product */}
      <PostComposer
        currentUser={currentUser}
        commerceItems={commerceItems}
        onCreatePost={onCreatePost}
      />

      {/* Google AdMob Sponsored Card in Feed */}
      <AdMobBanner />

      {/* Feed Posts List */}
      <div className="space-y-4 sm:space-y-6">
        {posts.slice(0, visibleCount).map((post) => (
          <FeedPostCard
            key={post.id}
            post={post}
            currentUser={currentUser}
            onReact={onReactToPost}
            onAddComment={onAddComment}
            onAddToCart={onAddToCart}
            commerceItems={commerceItems}
          />
        ))}
        
        {visibleCount < posts.length && (
          <div ref={loadMoreRef} className="h-10 flex items-center justify-center text-xs font-semibold text-[var(--pm-muted)]" aria-live="polite">
            Loading older posts…
          </div>
        )}
      </div>
    </div>
  );
};
