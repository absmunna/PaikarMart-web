import React from 'react';
import { UnifiedPostCard, UnifiedPost } from '@/design-system/components/feed/UnifiedPostCard';
import { UnifiedFeedItem } from '../types';

interface UniversalFeedCardProps {
  item: UnifiedFeedItem;
  onLike?: (id: string) => void;
}

export const UniversalFeedCard = React.memo(({ item }: UniversalFeedCardProps) => {
  const unifiedPost: UnifiedPost = {
    id: item.id,
    type: (item.type?.toLowerCase() as any) || 'status',
    domain: item.domain,
    authorName: item.author.name,
    authorAvatar: item.author.avatar,
    isVerified: item.author.isVerified,
    authorRole: item.author.role || '',
    timestamp: item.content.timestamp ? new Date(item.content.timestamp).toLocaleDateString() : 'Just now',
    content: item.content.description || item.content.title || '',
    imageUrl: item.content.media?.[0],
    location: item.content.location,
    likes: item.stats?.likes || 0,
    comments: item.stats?.comments || 0,
    product: (item.type === 'PRODUCT' || item.domain === 'RETAIL') ? {
      id: item.id,
      title: item.content.title,
      price: item.content.price || 0,
      imageUrl: item.content.media?.[0] || '',
      moq: item.content.metadata?.moq
    } : undefined,
    metadata: {
      urgency: item.content.metadata?.urgency,
      readTime: item.content.metadata?.readTimeBn,
      views: item.stats?.views,
      serviceType: item.content.metadata?.serviceType,
      duration: item.content.metadata?.duration
    }
  };

  return <UnifiedPostCard post={unifiedPost} />;
});

export const UniversalFeedCardBridge = React.memo(({ post }: { post: any }) => {
  if (!post) return null;

  const item: UnifiedFeedItem = {
    id: post.id,
    type: (post.postType || post.type || 'PRODUCT').toUpperCase() as any,
    domain: (post.domain || 'SOCIAL').toUpperCase() as any,
    author: {
      id: post.authorId || post.sellerId || '',
      name: post.sellerName || post.authorName || 'User',
      avatar: post.avatarUrl || post.authorAvatar || '',
      isVerified: post.isVerified || false,
      role: post.authorRole || 'user'
    },
    content: {
      title: post.title || post.content?.slice(0, 50) || '',
      description: post.content || post.description || '',
      media: post.mediaUrls || [post.imageUrl || post.image].filter(Boolean),
      price: post.price ? parseFloat(post.price.toString()) : 0,
      location: post.location,
      timestamp: post.createdAt || post.timestamp
    },
    stats: {
      likes: post.stats?.likes || post.likes || 0,
      comments: post.stats?.comments || post.comments || 0,
      shares: post.stats?.shares || post.shares || 0
    },
    interactions: {
      hasLiked: post.isLiked || false,
      hasSaved: post.isSaved || false
    },
    cta: {
      label: 'View',
      action: 'VIEW'
    }
  };

  return <UniversalFeedCard item={item} />;
});
