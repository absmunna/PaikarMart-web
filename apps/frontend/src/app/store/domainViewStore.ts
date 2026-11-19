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
          const savedPref = localStorage.getItem('pm_domain_view_preference');

          if (savedPref === 'desktop') {
            set({ hostname: host, isWwwDomain: isWww, isDesktopView: true });
          } else if (savedPref === 'mobile') {
            set({ hostname: host, isWwwDomain: isWww, isDesktopView: false });
          } else {
            // When visiting real production domain:
            // www.paikarmart.com -> Desktop Web View
            // paikarmart.com -> Mobile App Screen View
            if (host.includes('paikarmart.com')) {
              set({ hostname: host, isWwwDomain: isWww, isDesktopView: isWww });
            } else {
              // Dev/Preview environment: auto-detect by screen width
              const isDesktopDevice = window.innerWidth >= 1024;
              set({ hostname: host, isWwwDomain: isWww, isDesktopView: isDesktopDevice });
            }
          }
        }
      },

      setDesktopView: (value: boolean) => {
        if (typeof window !== 'undefined') {
          localStorage.setItem('pm_domain_view_preference', value ? 'desktop' : 'mobile');
        }
        set({ isDesktopView: value });
      },

      toggleViewMode: () => {
        const nextValue = !get().isDesktopView;
        if (typeof window !== 'undefined') {
          localStorage.setItem('pm_domain_view_preference', nextValue ? 'desktop' : 'mobile');
        }
        set({ isDesktopView: nextValue });
      }
    }),
    {
      name: 'pm_domain_view_storage',
      partialize: (state) => ({ isDesktopView: state.isDesktopView })
    }
  )
);
