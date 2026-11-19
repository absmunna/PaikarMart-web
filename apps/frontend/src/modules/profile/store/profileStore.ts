import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { AppRole } from '@/config/roles.config.ts';
import { UserProfile, UserRole } from '../types';

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
      viewMode: 'user' as UserRole,
      isLoading: false,

      setProfile: (profile) => set({ profile, viewMode: profile.role }),
      setViewMode: (viewMode) => set({ viewMode }),
      setLoading: (isLoading) => set({ isLoading }),
      addActivity: (activity) => set((state) => ({
        profile: state.profile ? {
          ...state.profile,
          activities: [activity, ...(state.profile as any).activities || []].slice(0, 50)
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
