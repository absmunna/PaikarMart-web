import { create } from 'zustand';

interface NavUIState {
  isAppLauncherOpen: boolean;
  isSidebarOpen: boolean;
  isSearchOpen: boolean;
  isCartOpen: boolean;
  userLocation: string;
  openAppLauncher: () => void;
  closeAppLauncher: () => void;
  toggleAppLauncher: () => void;
  setSidebarOpen: (open: boolean) => void;
  setSearchOpen: (open: boolean) => void;
  setCartOpen: (open: boolean) => void;
  setUserLocation: (loc: string) => void;
}

export const useNavUIStore = create<NavUIState>((set) => ({
  isAppLauncherOpen: false,
  isSidebarOpen: false,
  isSearchOpen: false,
  isCartOpen: false,
  userLocation: 'Dhaka',
  openAppLauncher: () => set({ isAppLauncherOpen: true }),
  closeAppLauncher: () => set({ isAppLauncherOpen: false }),
  toggleAppLauncher: () => set((state) => ({ isAppLauncherOpen: !state.isAppLauncherOpen })),
  setSidebarOpen: (open) => set({ isSidebarOpen: open }),
  setSearchOpen: (open) => set({ isSearchOpen: open }),
  setCartOpen: (open) => set({ isCartOpen: open }),
  setUserLocation: (loc) => set({ userLocation: loc }),
}));
