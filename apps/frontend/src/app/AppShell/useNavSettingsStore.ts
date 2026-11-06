import { create } from 'zustand';
import { persist } from 'zustand/middleware';

interface NavSettingsState {
  navBehavior: 'fixed' | 'auto-hide';
  isNavVisible: boolean;
  setNavBehavior: (behavior: 'fixed' | 'auto-hide') => void;
  setNavVisible: (visible: boolean) => void;
}

export const useNavSettingsStore = create<NavSettingsState>()(
  persist(
    (set) => ({
      navBehavior: 'auto-hide', // Default behavior is scroll-responsive auto-hide
      isNavVisible: true,
      setNavBehavior: (navBehavior) => set({ navBehavior }),
      setNavVisible: (isNavVisible) => set({ isNavVisible }),
    }),
    {
      name: 'nav-settings-store',
      partialize: (state) => ({ navBehavior: state.navBehavior }),
    }
  )
);
