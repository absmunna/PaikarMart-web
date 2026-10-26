import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { AddressDetails } from '@/components/common/BDAddressSelector';

export interface SavedAddress extends AddressDetails {
  id: string;
  label: string;
  labelBn: string;
  isDefault?: boolean;
  fullName?: string;
  phone?: string;
  zipCode?: string;
  road?: string;
  house?: string;
  landmark?: string;
  deliveryNote?: string;
  [key: string]: any;
}

interface AddressStore {
  addresses: SavedAddress[];
  addAddress: (address: Omit<SavedAddress, 'id'>) => void;
  updateAddress: (id: string, address: Partial<SavedAddress>) => void;
  removeAddress: (id: string) => void;
  setDefault: (id: string) => void;
  getDefaultAddress: () => SavedAddress | undefined;
}

export const useAddressStore = create<AddressStore>()(
  persist(
    (set, get) => ({
      addresses: [
        {
          id: 'addr-1',
          label: 'Home',
          labelBn: 'বাসা',
          fullName: 'Rahim Islam',
          phone: '01712345678',
          division: 'Dhaka',
          district: 'Dhaka',
          upazila: 'Dhanmondi',
          area: 'House 12, Road 5, Sat Masjid Road, Dhanmondi',
          zipCode: '1209',
          isDefault: true
        }
      ],

      addAddress: (newAddr) => set((state) => ({
        addresses: [...state.addresses, { ...newAddr, id: `addr-${Date.now()}` } as SavedAddress]
      })),

      updateAddress: (id, updatedFields) => set((state) => ({
        addresses: state.addresses.map(a => a.id === id ? { ...a, ...updatedFields } : a)
      })),

      removeAddress: (id) => set((state) => ({
        addresses: state.addresses.filter(a => a.id !== id)
      })),

      setDefault: (id) => set((state) => ({
        addresses: state.addresses.map(a => ({ ...a, isDefault: a.id === id }))
      })),

      getDefaultAddress: () => {
        return get().addresses.find(a => a.isDefault) || get().addresses[0];
      }
    }),
    {
      name: 'pm-address-storage',
    }
  )
);
