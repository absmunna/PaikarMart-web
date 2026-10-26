import { create } from 'zustand';
import { persist } from 'zustand/middleware';

interface LocationState {
  city: string;
  lat?: number;
  lng?: number;
  isAutoDetected: boolean;
  setLocation: (city: string, lat?: number, lng?: number) => void;
  updateLiveLocation: (lat: number, lng: number) => void;
  setAutoDetected: (status: boolean) => void;
}

export const useLocationStore = create<LocationState>()(
  persist(
    (set) => ({
      city: 'Dhaka', // Default
      isAutoDetected: false,
      setLocation: (city, lat, lng) => set({ city, lat, lng, isAutoDetected: false }),
      updateLiveLocation: (lat, lng) => set((s) => ({ ...s, lat, lng })),
      setAutoDetected: (status) => set({ isAutoDetected: status }),
    }),
    {
      name: 'pm-location-storage',
    }
  )
);
