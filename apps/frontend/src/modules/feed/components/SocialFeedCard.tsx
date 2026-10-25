import React from 'react';
import { UnifiedPostCard, UnifiedPost } from '@/design-system/components/feed/UnifiedPostCard';
import { FeedPost } from '../types';

interface SocialFeedCardProps {
  post: FeedPost;
  onTagClick?: (tag: string) => void;
  onLocationClick?: (loc: string) => void;
}

export const SocialFeedCard: React.FC<SocialFeedCardProps> = ({
  post
}) => {
  const isDemand = (post as any).type?.toLowerCase() === 'demand' || (post as any).postType === 'demand';
  const isProduct = post.postType === 'product' || Boolean(post.product);
  const cardType: 'product' | 'demand' | 'status' = isDemand ? 'demand' : isProduct ? 'product' : 'status';

  const unifiedPost: UnifiedPost = {
    id: post.id,
    type: cardType,
    authorName: post.sellerName || post.storeName || 'পাইকার মার্চেন্ট',
    authorAvatar: post.avatarUrl || `https://api.dicebear.com/7.x/avataaars/svg?seed=${post.sellerName || 'user'}`,
    isVerified: Boolean(post.isVerified),
    authorRole: post.authorRole || (isProduct ? 'বিক্রেতা' : isDemand ? 'ক্রেতা' : 'ইউজার'),
    timestamp: post.createdAt || 'এখনই',
    content: post.content,
    imageUrl: (post.mediaUrls && post.mediaUrls[0]) || (post as any).image || undefined,
    likes: post.stats?.likes ?? 0,
    comments: post.stats?.comments ?? 0,
    product: post.product ? {
        id: post.product.id,
        title: post.product.title || (post.product as any).name || 'পণ্য',
        price: post.product.price || 0,
        imageUrl: post.product.image || (post.product.images && post.product.images[0]) || post.mediaUrls?.[0] || ''
    } : undefined
  };

  return <UnifiedPostCard post={unifiedPost} />;
};
