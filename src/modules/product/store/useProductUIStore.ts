import { create } from 'zustand';

interface ProductState {
  product: any | null;
  activeImageIndex: number;
  quantity: number;
  selectedVariant: string | null;
  activeTab: 'description' | 'reviews' | 'qa';
  isSaved: boolean;
  setProduct: (product: any) => void;
  setActiveImageIndex: (index: number) => void;
  setQuantity: (qty: number | ((prev: number) => number)) => void;
  setSelectedVariant: (variant: string | null) => void;
  setActiveTab: (tab: 'description' | 'reviews' | 'qa') => void;
  setIsSaved: (isSaved: boolean) => void;
  resetProductState: () => void;
}

export const useProductUIStore = create<ProductState>((set) => ({
  product: null,
  activeImageIndex: 0,
  quantity: 1,
  selectedVariant: null,
  activeTab: 'description',
  isSaved: false,
  setProduct: (product) => set({ product }),
  setActiveImageIndex: (activeImageIndex) => set({ activeImageIndex }),
  setQuantity: (qty) => set((state) => ({ quantity: typeof qty === 'function' ? qty(state.quantity) : qty })),
  setSelectedVariant: (selectedVariant) => set({ selectedVariant }),
  setActiveTab: (activeTab) => set({ activeTab }),
  setIsSaved: (isSaved) => set({ isSaved }),
  resetProductState: () => set({ activeImageIndex: 0, quantity: 1, selectedVariant: null, activeTab: 'description' }),
}));
