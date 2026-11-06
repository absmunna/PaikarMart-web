import React from 'react';
import { motion } from 'motion/react';
import { UnifiedPostCard, UnifiedPost } from '@/design-system/components/feed/UnifiedPostCard';
import type { FeedItem, SocialProfile } from '../types';
import { useNavigate } from 'react-router-dom';

interface FeedItemCardProps {
  item: FeedItem;
  profile?: SocialProfile | null;
}

export const FeedItemCard = React.forwardRef<HTMLDivElement, FeedItemCardProps>(({ item, profile }, ref) => {
  const authorName = profile?.name || 'রহমান সুজ ও ফুটওয়্যার';
  const authorAvatar = profile?.avatarUrl || 'https://images.unsplash.com/photo-1542838132-92c53300491e?w=100';
  const isVerified = profile?.isVerified ?? true;
  const authorRole = profile?.role || 'seller';

  const unifiedPost: UnifiedPost = {
    id: item.id,
    type: item.type === 'demand' ? 'demand' : (item.type === 'product' || Boolean(item.product)) ? 'product' : 'status',
    authorName,
    authorAvatar,
    isVerified,
    authorRole,
    timestamp: item.timestamp,
    content: item.content,
    imageUrl: item.imageUrl,
    likes: item.likes,
    comments: item.comments,
    product: item.product ? {
        id: item.product.id,
        title: item.product.title,
        price: item.product.price,
        imageUrl: item.product.imageUrl || item.imageUrl || ''
    } : undefined
  };

  return <UnifiedPostCard post={unifiedPost} />;
});

