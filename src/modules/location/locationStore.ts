import { create } from 'zustand';
import { persist } from 'zustand/middleware';

interface LocationState {
  city: string;
  lat?: number;
  lng?: number;
  isAutoDetected: boolean;
  routeHistory: { lat: number; lng: number; timestamp: string }[];
  setLocation: (city: string, lat?: number, lng?: number) => void;
  setAutoDetected: (status: boolean) => void;
  updateLiveLocation: (lat: number, lng: number) => void;
}

export const useLocationStore = create<LocationState>()(
  persist(
    (set) => ({
      city: 'Dhaka', // Default
      isAutoDetected: false,
      routeHistory: [],
      setLocation: (city, lat, lng) => set({ city, lat, lng, isAutoDetected: false }),
      setAutoDetected: (status) => set({ isAutoDetected: status }),
      updateLiveLocation: (lat, lng) => set((state) => ({
        lat,
        lng,
        routeHistory: [...state.routeHistory, { lat, lng, timestamp: new Date().toISOString() }]
      })),
    }),
    {
      name: 'pm-location-storage',
    }
  )
);
