import { create } from 'zustand';

interface NavUIState {
  isAppLauncherOpen: boolean;
  openAppLauncher: () => void;
  closeAppLauncher: () => void;
  toggleAppLauncher: () => void;
}

export const useNavUIStore = create<NavUIState>((set) => ({
  isAppLauncherOpen: false,
  openAppLauncher: () => set({ isAppLauncherOpen: true }),
  closeAppLauncher: () => set({ isAppLauncherOpen: false }),
  toggleAppLauncher: () => set((state) => ({ isAppLauncherOpen: !state.isAppLauncherOpen })),
}));
