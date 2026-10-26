import React from 'react';
import { SocialPostCard } from './SocialPostCard';

// Mock data - replace with API call
const mockPosts = [
  { id: '1', author: 'Fashion House', avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=1', content: 'New collection available!', media: 'https://picsum.photos/400/400', likes: 120, comments: 10 },
  { id: '2', author: 'Tech Gadgets', avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=2', content: 'Best price for smartphones!', likes: 85, comments: 5 },
];

export const SocialFeedSection = () => {
  return (
    <div className="space-y-4">
      <h3 className="text-lg font-black text-[var(--pm-text)] px-2">সোশ্যাল ফিড</h3>
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
        {mockPosts.map(post => <SocialPostCard key={post.id} post={post} />)}
      </div>
    </div>
  );
};
