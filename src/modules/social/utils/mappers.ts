import { UnifiedFeedItem, PortalDomain, FeedItemType } from '../types';

export function mapPostToFeedItem(post: any): UnifiedFeedItem {
  return {
    id: post.id,
    type: (post.postType?.toUpperCase() as FeedItemType) || 'NEWS',
    domain: (post.domain?.toUpperCase() as PortalDomain) || 'SOCIAL',
    author: {
      id: post.author?.id || 'unknown',
      name: post.author?.name || 'Anonymous',
      avatar: post.author?.avatarUrl || 'https://ui-avatars.com/api/?name=Anonymous',
      isVerified: post.author?.verified
    },
    content: {
      title: post.title || 'Untitled Post',
      description: post.content || '',
      media: post.images || [],
      price: post.price,
      currency: post.currency || 'BDT',
      location: post.location || 'Bangladesh',
      timestamp: post.createdAt || new Date().toISOString(),
      tags: post.tags,
      metadata: post.metadata
    },
    stats: {
      likes: post.likeCount || 0,
      comments: post.commentCount || 0,
      shares: post.shareCount || 0
    },
    interactions: {
      hasLiked: false,
      hasSaved: false
    },
    cta: post.cta || { label: 'Learn More', action: 'VIEW_DETAILS' }
  };
}

export function mapDemandToFeedItem(demand: any): UnifiedFeedItem {
  return {
    id: demand.id,
    type: 'DEMAND',
    domain: (demand.domain?.toUpperCase() as PortalDomain) || 'B2B',
    author: {
      id: demand.author?.id || 'unknown',
      name: demand.author?.name || 'Anonymous Buyer',
      avatar: demand.author?.avatarUrl || demand.author?.avatar || 'https://ui-avatars.com/api/?name=Buyer',
      isVerified: true
    },
    content: {
      title: demand.title || 'Untitled Demand',
      description: demand.description || '',
      media: demand.images || [],
      price: demand.budget,
      currency: 'BDT',
      location: demand.location || 'Bangladesh',
      timestamp: demand.createdAt || new Date().toISOString(),
      metadata: {
        ...demand.metadata,
        urgency: demand.urgency,
        status: demand.status,
        deadline: demand.deadline,
        category: demand.category
      }
    },
    stats: {
      likes: 0,
      comments: (demand.matches ?? []).length,
      shares: 0,
      views: 0
    },
    interactions: {
      hasLiked: false,
      hasSaved: false
    },
    cta: {
      label: 'Submit Bid',
      action: 'BID_PROPOSAL'
    }
  };
}

export function mapProductToFeedItem(product: any): UnifiedFeedItem {
  // Determine domain based on portal attribute or some heuristic
  const domain = (product.portal?.toUpperCase() as PortalDomain) || 'RETAIL';
  const type = (domain === 'SERVICES' ? 'SERVICE' : 'PRODUCT') as FeedItemType;

  return {
    id: product.id,
    type,
    domain,
    author: {
      id: product.seller?.id || product.vendorId || 'unknown',
      name: product.seller?.name || product.vendorName || 'Venerable Vendor',
      avatar: product.seller?.avatar || 'https://ui-avatars.com/api/?name=Vendor',
      isVerified: true
    },
    content: {
      title: product.title || product.name || 'Untitled Product',
      description: product.description || '',
      media: product.images || [product.image] || [],
      price: product.price,
      currency: 'BDT',
      location: product.location || 'Dhaka',
      timestamp: product.createdAt || new Date().toISOString(),
      metadata: {
        ...product.metadata,
        portal: product.portal,
        category: product.category,
        serviceType: product.serviceType || product.category,
        duration: product.duration || product.metadata?.duration,
        bookingType: product.bookingType || product.metadata?.bookingType,
      }
    },
    stats: {
      likes: product.likes || 0,
      comments: 0,
      shares: 0,
      views: product.views || 0
    },
    interactions: {
      hasLiked: false,
      hasSaved: false
    },
    cta: {
      label: domain === 'SERVICES' ? 'Book Now' : 'Add to Cart',
      action: domain === 'SERVICES' ? 'BOOK_NOW' : 'ADD_TO_CART'
    }
  };
}
