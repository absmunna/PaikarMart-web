import { create } from 'zustand';
import { persist } from 'zustand/middleware';

export interface SavedAddress {
  id: string;
  type: 'home' | 'office' | 'shop' | 'factory' | 'other';
  label: string;
  labelBn: string;
  address: string;
  area: string;
  city: string;
  lat: number;
  lng: number;
}

export interface DetailedLocationPayload {
  city: string;
  division?: string;
  district?: string;
  area?: string;
  formattedAddress?: string;
  lat?: number;
  lng?: number;
  isAutoDetected?: boolean;
}

interface LocationState {
  city: string;
  division: string;
  district: string;
  area: string;
  formattedAddress: string;
  lat: number;
  lng: number;
  isAutoDetected: boolean;
  isDetecting: boolean;
  isLocationModalOpen: boolean;
  savedAddresses: SavedAddress[];

  // Actions
  setLocation: (city: string, lat?: number, lng?: number) => void;
  setDetailedLocation: (payload: DetailedLocationPayload) => void;
  updateLiveLocation: (lat: number, lng: number) => void;
  setAutoDetected: (status: boolean) => void;
  setIsDetecting: (status: boolean) => void;
  openLocationModal: () => void;
  closeLocationModal: () => void;
  toggleLocationModal: () => void;
  addSavedAddress: (address: Omit<SavedAddress, 'id'>) => void;
  removeSavedAddress: (id: string) => void;
  selectSavedAddress: (id: string) => void;
}

const DEFAULT_SAVED_ADDRESSES: SavedAddress[] = [
  {
    id: 'default-home',
    type: 'home',
    label: 'Home',
    labelBn: 'বাসা / হোম',
    address: 'মিরপুর-১০, ঢাকা',
    area: 'মিরপুর-১০',
    city: 'ঢাকা',
    lat: 23.8070,
    lng: 90.3686,
  },
  {
    id: 'default-shop',
    type: 'shop',
    label: 'Shop / Outlet',
    labelBn: 'দোকান / আড়ত',
    address: 'ইসলামপুর বস্ত্র মার্কেট, ঢাকা',
    area: 'ইসলামপুর',
    city: 'ঢাকা',
    lat: 23.7089,
    lng: 90.4042,
  },
  {
    id: 'default-office',
    type: 'office',
    label: 'Office',
    labelBn: 'অফিস / বাণিজ্যিক',
    address: 'মতিঝিল বাণিজ্যিক এলাকা, ঢাকা',
    area: 'মতিঝিল',
    city: 'ঢাকা',
    lat: 23.7330,
    lng: 90.4172,
  }
];

export const useLocationStore = create<LocationState>()(
  persist(
    (set, get) => ({
      city: 'ঢাকা',
      division: 'Dhaka',
      district: 'ঢাকা',
      area: 'মিরপুর-১০',
      formattedAddress: 'মিরপুর-১০, ঢাকা',
      lat: 23.8103,
      lng: 90.4125,
      isAutoDetected: false,
      isDetecting: false,
      isLocationModalOpen: false,
      savedAddresses: DEFAULT_SAVED_ADDRESSES,

      setLocation: (city, lat = 23.8103, lng = 90.4125) => 
        set({ 
          city, 
          area: city, 
          formattedAddress: city, 
          lat, 
          lng, 
          isAutoDetected: false 
        }),

      setDetailedLocation: (payload) =>
        set((state) => ({
          city: payload.city || state.city,
          division: payload.division || state.division,
          district: payload.district || state.district,
          area: payload.area || payload.city || state.area,
          formattedAddress: payload.formattedAddress || `${payload.area || payload.city}, ${payload.district || payload.city}`,
          lat: payload.lat ?? state.lat,
          lng: payload.lng ?? state.lng,
          isAutoDetected: payload.isAutoDetected ?? state.isAutoDetected,
        })),

      updateLiveLocation: (lat, lng) => 
        set((state) => ({ ...state, lat, lng })),

      setAutoDetected: (status) => 
        set({ isAutoDetected: status }),

      setIsDetecting: (status) => 
        set({ isDetecting: status }),

      openLocationModal: () => 
        set({ isLocationModalOpen: true }),

      closeLocationModal: () => 
        set({ isLocationModalOpen: false }),

      toggleLocationModal: () => 
        set((state) => ({ isLocationModalOpen: !state.isLocationModalOpen })),

      addSavedAddress: (item) =>
        set((state) => ({
          savedAddresses: [
            ...state.savedAddresses,
            { ...item, id: `saved-${Date.now()}` }
          ]
        })),

      removeSavedAddress: (id) =>
        set((state) => ({
          savedAddresses: state.savedAddresses.filter((a) => a.id !== id)
        })),

      selectSavedAddress: (id) => {
        const found = get().savedAddresses.find((a) => a.id === id);
        if (found) {
          set({
            city: found.city,
            area: found.area,
            formattedAddress: found.address,
            lat: found.lat,
            lng: found.lng,
            isAutoDetected: false,
            isLocationModalOpen: false
          });
        }
      }
    }),
    {
      name: 'pm-location-storage',
      partialize: (state) => ({
        city: state.city,
        division: state.division,
        district: state.district,
        area: state.area,
        formattedAddress: state.formattedAddress,
        lat: state.lat,
        lng: state.lng,
        isAutoDetected: state.isAutoDetected,
        savedAddresses: state.savedAddresses,
      })
    }
  )
);

