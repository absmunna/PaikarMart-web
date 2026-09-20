import { useProfileStore, UserProfile, UserActivity } from './profileStore';

const MOCK_PROFILE: UserProfile = {
  id: 'u-9921',
  name: 'Nirjon Munna',
  avatar: 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?auto=format&fit=crop&q=80&w=200',
  role: 'seller',
  joinDate: '2023-11-12T10:00:00Z',
  verificationLevels: ['email', 'phone', 'nid'],
  trustScore: 88,
  reputation: {
    totalReviews: 124,
    averageRating: 4.8,
    sellerScore: 92,
    buyerReliability: 98,
    disputeHistory: 2,
    badges: ['Trusted Seller', 'Top Buyer', 'Verified Business'],
  },
  activities: [
    { id: 'a1', type: 'order', label: 'Order #ORD-8821 placed', timestamp: new Date().toISOString(), metadata: 'Premium Cotton Panjabi' },
    { id: 'a2', type: 'product', label: 'New product listed', timestamp: new Date(Date.now() - 3600000).toISOString(), metadata: 'Silk Saree - Handloom' },
    { id: 'a3', type: 'review', label: 'Review received: 5 Stars', timestamp: new Date(Date.now() - 86400000).toISOString(), metadata: 'Quality exceeded expectations' },
    { id: 'a4', type: 'security', label: 'Security checkpoint passed', timestamp: new Date(Date.now() - 172800000).toISOString(), metadata: 'NID Verification Success' },
  ]
};

export const profileService = {
  init: () => {
    const store = useProfileStore.getState();
    store.setLoading(true);
    
    // Simulate API fetch
    setTimeout(() => {
      store.setProfile(MOCK_PROFILE);
      store.setLoading(false);
    }, 800);
  },

  initEventListeners: () => {
    if (typeof window === 'undefined') return;

    window.addEventListener('TRUST_SCORE_UPDATED', (e: any) => {
      const { score } = e.detail;
      useProfileStore.getState().updateTrustScore(score);
    });

    window.addEventListener('ORDER_COMPLETED', (e: any) => {
      const activity: UserActivity = {
        id: Math.random().toString(36).substr(2, 9),
        type: 'order',
        label: 'Order fulfillment completed',
        timestamp: new Date().toISOString(),
        metadata: e.detail.orderId
      };
      useProfileStore.getState().addActivity(activity);
    });
  },

  switchViewMode: (mode: any) => {
    useProfileStore.getState().setViewMode(mode);
  }
};
