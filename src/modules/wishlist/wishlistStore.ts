import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { Product } from '@/modules/product/types/product.types';

interface WishlistedProduct extends Product {
  addedPrice: number;
}

interface WishlistState {
  items: WishlistedProduct[];
  addToWishlist: (product: Product) => void;
  removeFromWishlist: (id: string) => void;
  toggleWishlist: (product: Product) => void;
  isInWishlist: (id: string) => boolean;
  clearWishlist: () => void;
}

export const useWishlistStore = create<WishlistState>()(
  persist(
    (set, get) => ({
      items: [],
      addToWishlist: (product) => set((state) => {
        if (state.items.some((item) => item.id === product.id)) {
          return state;
        }
        return { items: [...state.items, { ...product, addedPrice: product.price }] };
      }),
      removeFromWishlist: (id) => set((state) => ({
        items: state.items.filter((item) => item.id !== id)
      })),
      toggleWishlist: (product) => set((state) => {
        const exists = state.items.some((item) => item.id === product.id);
        if (exists) {
          return { items: state.items.filter((item) => item.id !== product.id) };
        }
        return { items: [...state.items, { ...product, addedPrice: product.price }] };
      }),
      isInWishlist: (id) => {
        return get().items.some((item) => item.id === id);
      },
      clearWishlist: () => set({ items: [] }),
    }),
    {
      name: 'pm-wishlist-storage',
    }
  )
);
