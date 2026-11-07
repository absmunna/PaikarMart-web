import { create } from 'zustand';
import { persist } from 'zustand/middleware';

export type Language = 'EN' | 'BN' | 'AR' | 'HI';

interface AppState {
  lang: Language;
  setLang: (lang: Language) => void;
}

export const useAppStore = create<AppState>()(
  persist(
    (set) => ({
      lang: 'BN',
      setLang: (lang) => set({ lang }),
    }),
    {
      name: 'paikar-mart-app-store',
    }
  )
);
