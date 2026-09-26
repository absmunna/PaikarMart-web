import { create } from 'zustand';
import { persist } from 'zustand/middleware';

interface LocationState {
  city: string;
  lat?: number;
  lng?: number;
  isAutoDetected: boolean;
  setLocation: (city: string, lat?: number, lng?: number) => void;
  setAutoDetected: (status: boolean) => void;
  updateLiveLocation: (lat: number, lng: number, city?: string) => void;
}

export const useLocationStore = create<LocationState>()(
  persist(
    (set) => ({
      city: 'Dhaka', // Default
      isAutoDetected: false,
      setLocation: (city, lat, lng) => set({ city, lat, lng, isAutoDetected: false }),
      setAutoDetected: (status) => set({ isAutoDetected: status }),
      updateLiveLocation: (lat, lng, city) => set((state) => ({ lat, lng, city: city || state.city, isAutoDetected: true })),
    }),
    {
      name: 'pm-location-storage',
    }
  )
);
