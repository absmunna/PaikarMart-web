import { create } from 'zustand';
import { PortalContextType } from '@/shared/constants/categoriesData';

interface CategoryState {
  portalContext: PortalContextType;
  activeMainCategory: string;
  activeSubCategory: string | null;
  feedTab: 'commerce' | 'social';
  
  setPortalContext: (context: PortalContextType) => void;
  setMainCategory: (mainId: string) => void;
  setSubCategory: (subId: string | null) => void;
  setFeedTab: (tab: 'commerce' | 'social') => void;
  resetCategory: () => void;
}

export const useCategoryStore = create<CategoryState>((set) => ({
  portalContext: 'all',
  activeMainCategory: 'all',
  activeSubCategory: null,
  feedTab: 'commerce',

  setPortalContext: (context) => set({ 
    portalContext: context, 
    activeMainCategory: 'all', 
    activeSubCategory: null 
  }),

  setMainCategory: (mainId) => set({ 
    activeMainCategory: mainId, 
    activeSubCategory: null 
  }),

  setSubCategory: (subId) => set({ 
    activeSubCategory: subId 
  }),

  setFeedTab: (tab) => set({ 
    feedTab: tab 
  }),

  resetCategory: () => set({ 
    activeMainCategory: 'all', 
    activeSubCategory: null 
  }),
}));
