export const feedService = {
  fetchFeed: async () => {
    return [
      {
        id: "post-afnan-watch",
        author: {
          id: "afnan-elec",
          name: "Afnan Electronics",
          handle: "@afnan_electronics",
          avatarUrl: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=100&q=80",
          verified: true,
          sellerType: "retail",
          badgeText: "Trusted Seller • 4.8 (1.2k)"
        },
        content: "Afnan Galaxy Note Pro",
        title: "Afnan Galaxy Note Pro",
        description: "Afnan Galaxy Note Pro. Premium quality design built chronographically to absolute perfection.",
        imageUrl: "https://images.unsplash.com/photo-1547996160-81dfa63595aa?w=600&q=80", // Premium watch image matching the mockup beautifully
        price: 89.99,
        originalPrice: 129.99,
        badgeText: "Premium Quality",
        rating: 4.8,
        reviewCount: 230,
        likes: 1240,
        comments: 98,
        isLiked: true,
        tag1to1: "1:1"
      },
      {
        id: "post-rahim-farm",
        author: {
          id: "rahim-wholesale",
          name: "Rahim Wholesalers",
          handle: "@rahim_wholesale",
          avatarUrl: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=100&q=80",
          verified: true,
          sellerType: "wholesale",
          badgeText: "Verified Importer • 4.9 (2.4k)"
        },
        content: "Fresh Organic Vegetables Bundle",
        title: "Organic Daily Bundle",
        description: "Pure green vegetables direct from our organic micro-farms in Savar. Bulk rates available.",
        imageUrl: "https://images.unsplash.com/photo-1542838132-92c53300491e?w=600&q=80",
        price: 45.00,
        originalPrice: 60.00,
        badgeText: "Fresh Harvest",
        rating: 4.9,
        reviewCount: 185,
        likes: 932,
        comments: 42,
        isLiked: false,
        tag1to1: ""
      },
      {
        id: "post-tech-mega",
        author: {
          id: "tech-mega",
          name: "Smart Tech BD",
          handle: "@smart_tech_bd",
          avatarUrl: "https://images.unsplash.com/photo-1492562080023-ab3db95bfbce?w=100&q=80",
          verified: true,
          sellerType: "retail",
          badgeText: "Star Merchant • 4.7 (742)"
        },
        content: "Premium Noise Cancelling Headphones",
        title: "Smart Bass Headphones X1",
        description: "Experience absolute acoustics with 40dB active hybrid noise cancellation and deep bass drivers.",
        imageUrl: "https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=600&q=80",
        price: 199.99,
        originalPrice: 299.99,
        badgeText: "Best Deals",
        rating: 4.7,
        reviewCount: 140,
        likes: 654,
        comments: 18,
        isLiked: false,
        tag1to1: "1:1"
      },
      {
        id: "demand-bulk-shirts",
        author: {
          id: "user-nirjon",
          name: "Nirjon Munna",
          handle: "@nirjon",
          avatarUrl: "https://i.pravatar.cc/100?img=11",
          verified: false,
          sellerType: "buyer",
          badgeText: "Corporate Client"
        },
        content: "Need 500 Custom Cotton T-Shirts for Event",
        isDemand: true,
        urgency: "high",
        budget: 75000,
        location: "Dhaka, Mirpur",
        matchCount: 12,
        likes: 45,
        comments: 8,
        createdAt: new Date().toISOString()
      },
      {
        id: "demand-laptop-batteries",
        author: {
          id: "user-munir",
          name: "Munir Ahmed",
          handle: "@munir_it",
          avatarUrl: "https://i.pravatar.cc/100?img=12",
          verified: false,
          sellerType: "buyer",
          badgeText: "IT Support"
        },
        content: "Bulk Requirement: 50x Dell Latitude Batteries",
        isDemand: true,
        urgency: "normal",
        budget: 125000,
        location: "Chattogram",
        matchCount: 4,
        likes: 22,
        comments: 3,
        createdAt: new Date().toISOString()
      }
    ];
  },
  subscribeToEvents: (callback: (event: any) => void) => {
    return () => {};
  }
};
