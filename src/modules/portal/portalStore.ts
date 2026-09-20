import { create } from 'zustand';

export type PortalType = 'retail-b2c' | 'wholesale-b2b' | 'ott' | 'ride' | 'services';

interface PortalState {
  currentPortal: PortalType;
  switchPortal: (portal: PortalType) => void;
}

export const usePortalStore = create<PortalState>((set) => ({
  currentPortal: 'retail-b2c',
  switchPortal: (portal) => set({ currentPortal: portal }),
}));
