import React from 'react';
import { UnifiedPostCard, UnifiedPost } from '@/design-system/components/feed/UnifiedPostCard';

export interface ProductCardProps {
  product: any;
  className?: string;
  onQuickAdd?: (product: any) => void;
  activePortal?: string;
  noLink?: boolean;
  customAction?: React.ReactNode;
  onClick?: (e?: any) => void;
  isFlashSale?: boolean;
}

/**
 * ProductCard is now a legacy wrapper for UnifiedPostCard to ensure global UI consistency
 * following the "One Card" standard for Paikar Mart.
 */
export const ProductCard = React.forwardRef<HTMLDivElement, ProductCardProps>(function ProductCard({ 
  product, 
  className = "",
  activePortal,
  isFlashSale
}, ref) {
  if (!product) return null;

  const isWholesale = product.type === 'wholesale' || product.portal === 'wholesale' || product.portal === 'grocery' || Boolean(product.moq && product.moq > 1);
  const domain = isWholesale ? 'WHOLESALE' : 'RETAIL';
  
  const unifiedPost: UnifiedPost = {
    id: String(product.id),
    type: product.type === 'service' ? 'service' : 'product',
    domain: domain as any,
    authorName: product.seller || product.vendorName || product.vendor || 'Verified Merchant',
    authorAvatar: `https://api.dicebear.com/7.x/initials/svg?seed=${product.seller || product.vendor || 'merchant'}`,
    isVerified: true,
    authorRole: isWholesale ? 'হোলসেলার / আড়তদার' : 'রিটেইল সেলার',
    timestamp: 'Active Now',
    content: product.description || `${product.name || product.title || 'Product'} এখন সাশ্রয়ী মূল্যে সহজলভ্য।`,
    imageUrl: product.image || product.imageUrl,
    location: product.location || 'Dhaka',
    likes: product.reviewCount || product.reviews || 0,
    comments: 5,
    product: {
      id: String(product.id),
      title: product.name || product.title || 'Product',
      price: Number(product.price) || 0,
      imageUrl: product.image || product.imageUrl,
      moq: product.moq
    },
    metadata: {
      isFlashSale: isFlashSale || product.isFlashSale,
      isPkExclusive: product.isPkExclusive || ['1', '5', '10'].includes(String(product.id)),
      isOfficialBrand: ['Bata', 'Aarong', 'Apple', 'Samsung', 'Walton', 'Vision'].includes(product.seller || ''),
      discountTag: product.discount ? `${product.discount}% ছাড়` : undefined,
      distance: product.distance,
      deliveryTime: product.deliveryTime
    }
  };

  return (
    <div ref={ref} className={className}>
      <UnifiedPostCard post={unifiedPost} />
    </div>
  );
});

ProductCard.displayName = 'ProductCard';
