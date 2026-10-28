import { create } from 'zustand';
import { persist } from 'zustand/middleware';

interface DomainViewState {
  isDesktopView: boolean;
  isWwwDomain: boolean;
  hostname: string;
  initDomainView: () => void;
  setDesktopView: (value: boolean) => void;
  toggleViewMode: () => void;
}

export const useDomainViewStore = create<DomainViewState>()(
  persist(
    (set, get) => ({
      isDesktopView: false,
      isWwwDomain: false,
      hostname: '',

      initDomainView: () => {
        if (typeof window !== 'undefined') {
          const host = window.location.hostname.toLowerCase();
          const isWww = host.startsWith('www.');
          const isLargeScreen = window.innerWidth >= 1024;
          
          const savedPref = localStorage.getItem('pm_domain_view_preference');
          // If saved preference exists, honor it; otherwise default to desktop on desktop/laptop screens or www domain
          let initialDesktop = isWww || isLargeScreen;
          
          if (savedPref === 'desktop') {
            initialDesktop = true;
          } else if (savedPref === 'mobile') {
            initialDesktop = false;
          }

          set({
            hostname: host,
            isWwwDomain: isWww,
            isDesktopView: initialDesktop
          });
        }
      },

      setDesktopView: (value: boolean) => {
        localStorage.setItem('pm_domain_view_preference', value ? 'desktop' : 'mobile');
        set({ isDesktopView: value });
      },

      toggleViewMode: () => {
        const nextValue = !get().isDesktopView;
        localStorage.setItem('pm_domain_view_preference', nextValue ? 'desktop' : 'mobile');
        set({ isDesktopView: nextValue });
      }
    }),
    {
      name: 'pm_domain_view_storage',
      partialize: (state) => ({ isDesktopView: state.isDesktopView })
    }
  )
);
