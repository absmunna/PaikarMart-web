import React from 'react';
import { useVendorProfile } from '@/app/providers/VendorProfileProvider';
import { UnifiedPostCard } from '@/design-system/components/feed/UnifiedPostCard';

interface PortalListingProps {
  portalId: string;
  items: any[];
  type: 'product' | 'service';
}

export const PortalListing: React.FC<PortalListingProps> = ({ portalId, items, type }) => {
  const { vendorProfile } = useVendorProfile();

  // Filter items based on portal and potential vendor context
  const filteredItems = items.filter(item => {
    const matchesPortal = item.portal === portalId;
    const matchesVendor = vendorProfile ? item.vendorId === vendorProfile.id : true;
    return matchesPortal && matchesVendor;
  });

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
      {filteredItems.map(item => (
        <UnifiedPostCard
          key={item.id}
          post={{
            id: item.id,
            type: type,
            authorName: item.sellerName || 'Verified Merchant',
            authorAvatar: 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?auto=format&fit=crop&w=100&q=80',
            isVerified: true,
            authorRole: 'Verified Seller',
            timestamp: 'Just now',
            likes: item.likes || 12,
            comments: item.comments || 3,
            content: item.description || item.title,
            imageUrl: item.image || item.images?.[0],
            product: type === 'product' ? {
              id: item.id,
              title: item.title,
              price: item.price,
              imageUrl: item.image || item.images?.[0]
            } : undefined
          }}
        />
      ))}
    </div>
  );
};
