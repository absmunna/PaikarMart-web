import { useProfileStore, UserProfile, UserActivity } from '../index';

const MOCK_PROFILE: UserProfile = {
  id: 'u-9921',
  name: 'Nirjon Munna',
  handle: 'nirjon_munna',
  avatarUrl: 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?auto=format&fit=crop&q=80&w=200',
  coverUrl: 'https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?w=1200',
  role: 'seller',
  isVerified: true,
  bio: 'Premium sourcing expert.',
  location: 'Dhaka, BD',
  rating: 4.8,
  reviewCount: 124,
  followersCount: 850,
  followingCount: 45,
  walletBalance: 12500,
  loyaltyCoins: 450
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
