import React from 'react';
import { UnifiedPostCard, UnifiedPost } from '@/design-system/components/feed/UnifiedPostCard';

// Mock data - replace with API call
const mockPosts: UnifiedPost[] = [
  { 
    id: '1', 
    type: 'status',
    authorName: 'Fashion House', 
    authorAvatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=1', 
    isVerified: true,
    authorRole: 'Verified Seller',
    timestamp: '2h ago',
    content: 'New collection available!', 
    imageUrl: 'https://picsum.photos/400/400', 
    likes: 120, 
    comments: 10 
  },
  { 
    id: '2', 
    type: 'status',
    authorName: 'Tech Gadgets', 
    authorAvatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=2', 
    isVerified: true,
    authorRole: 'Verified Seller',
    timestamp: '5h ago',
    content: 'Best price for smartphones!', 
    likes: 85, 
    comments: 5 
  },
];

export const SocialFeedSection = () => {
  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between px-2">
        <h3 className="text-xl font-black text-[var(--pm-text)] tracking-tight">সোশ্যাল ফিড</h3>
        <button className="text-xs font-bold text-[var(--pm-accent)] hover:underline">View All</button>
      </div>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-3 sm:gap-4 md:gap-5">
        {mockPosts.map(post => <UnifiedPostCard key={post.id} post={post} />)}
      </div>
    </div>
  );
};
