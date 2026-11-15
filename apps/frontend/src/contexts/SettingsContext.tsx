import React, { createContext, useContext, useState, useMemo } from 'react';

export type SettingsTab = 'appearance' | 'language' | 'location' | 'about';

interface SettingsContextType {
  isSettingsOpen: boolean;
  activeSettingsTab: SettingsTab;
  openSettings: (tab?: SettingsTab) => void;
  closeSettings: () => void;
  setActiveSettingsTab: (tab: SettingsTab) => void;
}

const SettingsContext = createContext<SettingsContextType | undefined>(undefined);

export const SettingsModalProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [isSettingsOpen, setIsSettingsOpen] = useState(false);
  const [activeSettingsTab, setActiveSettingsTab] = useState<SettingsTab>('appearance');

  const openSettings = (tab?: SettingsTab) => {
    if (tab) setActiveSettingsTab(tab);
    setIsSettingsOpen(true);
  };

  const closeSettings = () => {
    setIsSettingsOpen(false);
  };

  const value = useMemo(
    () => ({
      isSettingsOpen,
      activeSettingsTab,
      openSettings,
      closeSettings,
      setActiveSettingsTab,
    }),
    [isSettingsOpen, activeSettingsTab]
  );

  return <SettingsContext.Provider value={value}>{children}</SettingsContext.Provider>;
};

export const useSettings = (): SettingsContextType => {
  const context = useContext(SettingsContext);
  if (!context) {
    throw new Error('useSettings must be used within a SettingsModalProvider');
  }
  return context;
};
