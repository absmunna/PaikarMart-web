import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { AppRole } from '@/config/roles.config.ts';

export type UserRole = AppRole;
export type VerificationLevel = 'email' | 'phone' | 'nid' | 'business';

export interface UserActivity {
  id: string;
  type: 'order' | 'product' | 'review' | 'payment' | 'security';
  label: string;
  timestamp: string;
  metadata?: string;
  status?: string;
}

export interface ReputationSummary {
  totalReviews: number;
  averageRating: number;
  sellerScore: number;
  buyerReliability: number;
  disputeHistory: number;
  badges: string[];
}

export interface UserProfile {
  id: string;
  name: string;
  avatar: string;
  role: UserRole;
  joinDate: string;
  verificationLevels: VerificationLevel[];
  verificationStatus?: 'unverified' | 'pending' | 'verified' | 'rejected';
  trustScore: number;
  reputation: ReputationSummary;
  activities: UserActivity[];
}

interface ProfileState {
  profile: UserProfile | null;
  viewMode: UserRole;
  isLoading: boolean;
  
  setProfile: (profile: UserProfile) => void;
  setViewMode: (mode: UserRole) => void;
  setLoading: (loading: boolean) => void;
  addActivity: (activity: UserActivity) => void;
  updateTrustScore: (score: number) => void;
}

export const useProfileStore = create<ProfileState>()(
  persist(
    (set) => ({
      profile: null,
      viewMode: 'user',
      isLoading: false,

      setProfile: (profile) => set({ profile, viewMode: profile.role }),
      setViewMode: (viewMode) => set({ viewMode }),
      setLoading: (isLoading) => set({ isLoading }),
      addActivity: (activity) => set((state) => ({
        profile: state.profile ? {
          ...state.profile,
          activities: [activity, ...state.profile.activities].slice(0, 50)
        } : null
      })),
      updateTrustScore: (trustScore) => set((state) => ({
        profile: state.profile ? { ...state.profile, trustScore } : null
      })),
    }),
    {
      name: 'pm-profile-ecosystem-v1',
    }
  )
);
