import { create } from 'zustand';

interface B2BProductUIState {
  search: string;
  category: string;
  moq: number;
  price: number;
  verifiedOnly: boolean;
  exportOnly: boolean;
  savedProducts: string[];
  setSearch: (search: string) => void;
  setCategory: (category: string) => void;
  setMoq: (moq: number) => void;
  setPrice: (price: number) => void;
  setVerifiedOnly: (verifiedOnly: boolean) => void;
  setExportOnly: (exportOnly: boolean) => void;
  toggleSaveProduct: (productId: string) => void;
  resetUIState: () => void;
}

export const useB2BProductUIStore = create<B2BProductUIState>((set) => ({
  search: '',
  category: '',
  moq: 1000,
  price: 1000,
  verifiedOnly: false,
  exportOnly: false,
  savedProducts: [],
  setSearch: (search) => set({ search }),
  setCategory: (category) => set({ category }),
  setMoq: (moq) => set({ moq }),
  setPrice: (price) => set({ price }),
  setVerifiedOnly: (verifiedOnly) => set({ verifiedOnly }),
  setExportOnly: (exportOnly) => set({ exportOnly }),
  toggleSaveProduct: (productId) => set((state) => ({
    savedProducts: state.savedProducts.includes(productId)
      ? state.savedProducts.filter(id => id !== productId)
      : [...state.savedProducts, productId]
  })),
  resetUIState: () => set({
    search: '',
    category: '',
    moq: 1000,
    price: 1000,
    verifiedOnly: false,
    exportOnly: false
  })
}));
