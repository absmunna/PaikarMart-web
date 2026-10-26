import { create } from 'zustand';
import { persist } from 'zustand/middleware';

type Language = 'EN' | 'BN';

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
