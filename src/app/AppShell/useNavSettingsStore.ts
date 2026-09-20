import { create } from 'zustand';
import { persist } from 'zustand/middleware';

interface NavSettingsState {
  navBehavior: 'fixed' | 'auto-hide';
  setNavBehavior: (behavior: 'fixed' | 'auto-hide') => void;
}

export const useNavSettingsStore = create<NavSettingsState>()(
  persist(
    (set) => ({
      navBehavior: 'auto-hide', // Default behavior
      setNavBehavior: (navBehavior) => set({ navBehavior }),
    }),
    {
      name: 'nav-settings-store',
    }
  )
);
