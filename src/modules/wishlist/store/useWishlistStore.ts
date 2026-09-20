import { create } from 'zustand';

interface WishlistStore {
  items: string[];
  toggleItem: (id: string) => void;
}

export const useWishlistStore = create<WishlistStore>((set) => ({
  items: [],
  toggleItem: (id) => set((state) => ({
    items: state.items.includes(id) 
      ? state.items.filter(itemId => itemId !== id) 
      : [...state.items, id]
  })),
}));
