import { create } from 'zustand';
import { persist } from 'zustand/middleware';

interface SearchState {
  recentSearches: string[];
  addRecentSearch: (query: string) => void;
  removeRecentSearch: (query: string) => void;
  clearRecentSearches: () => void;
}

export const useSearchStore = create<SearchState>()(
  persist(
    (set) => ({
      recentSearches: [
        'Saree Wholesale',
        'iPhone 15 Pro',
        'অর্গানিক মধু (Organic Honey)',
        'স্মার্ট ওয়াচ (Smart Watch)',
      ],
      addRecentSearch: (query) => set((state) => {
        const trimmed = query.trim();
        if (!trimmed) return state;
        // Filter out existing and keep only top 8 items
        const filtered = state.recentSearches.filter((item) => item.toLowerCase() !== trimmed.toLowerCase());
        return {
          recentSearches: [trimmed, ...filtered].slice(0, 8),
        };
      }),
      removeRecentSearch: (query) => set((state) => ({
        recentSearches: state.recentSearches.filter((item) => item !== query),
      })),
      clearRecentSearches: () => set({ recentSearches: [] }),
    }),
    {
      name: 'pm-search-history',
    }
  )
);
