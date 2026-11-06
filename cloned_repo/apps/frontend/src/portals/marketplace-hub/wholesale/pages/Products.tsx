import React from 'react';
import { UnifiedPostCard, UnifiedPost } from '@/design-system/components/feed/UnifiedPostCard';

export const Products = () => {
  const products = [
    { id: '1', name: 'চালের বস্তা ৫০ কেজি', moq: 10, wholesalePrice: 1500, image: 'https://picsum.photos/400/400?sig=1' },
    { id: '2', name: 'রান্নার তেল ৫ লিটার', moq: 20, wholesalePrice: 850, image: 'https://picsum.photos/400/400?sig=2' },
  ];

  return (
    <div className="p-4 space-y-6">
      <h2 className="text-2xl font-black text-[var(--pm-text)]">পাইকারি পণ্য</h2>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {products.map(product => {
          const post: UnifiedPost = {
            id: product.id,
            type: 'product',
            domain: 'WHOLESALE',
            authorName: 'Wholesale Vendor',
            authorAvatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=wholesale',
            isVerified: true,
            authorRole: 'Wholesaler',
            timestamp: 'Just now',
            content: `পাইকারি দরে ${product.name} সংগ্রহ করুন।`,
            imageUrl: product.image,
            likes: 0,
            comments: 0,
            product: {
              id: product.id,
              title: product.name,
              price: product.wholesalePrice,
              imageUrl: product.image,
              moq: product.moq
            }
          };
          return <UnifiedPostCard key={product.id} post={post} />;
        })}
      </div>
    </div>
  );
};
