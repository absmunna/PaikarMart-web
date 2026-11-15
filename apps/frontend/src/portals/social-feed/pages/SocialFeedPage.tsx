import React from 'react';
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
        {posts.map((post) => (
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
        
        {/* Load More Simulation */}
        <div className="pt-4 text-center">
          <button className="px-8 py-3 rounded-2xl bg-[var(--pm-card)] border border-[var(--pm-border)] text-xs font-bold text-[var(--pm-muted)] hover:text-[var(--pm-accent)] hover:border-[var(--pm-accent)] transition-colors shadow-sm cursor-pointer">
            Show Older Posts
          </button>
        </div>
      </div>
    </div>
  );
};
