/**
 * @deprecated EXPERIMENTAL — not mounted by RootLayout.
 * Production top chrome is `design-system/components/navigation/Navbar.tsx`
 * (search, wallet, cart, location, notifications, account).
 *
 * Keep this file only for AppShell experiments / legacy previews.
 * New features → Navbar + useNavUIStore, not here.
 */
import React from 'react';
import { Navbar } from '@/design-system/components/navigation/Navbar';

interface GlobalTopBarProps {
  onToggleSidebar?: () => void;
  isSidebarOpen?: boolean;
}

/** Thin adapter so any leftover import still renders production Navbar. */
export const GlobalTopBar: React.FC<GlobalTopBarProps> = ({ onToggleSidebar }) => {
  return <Navbar onMenuClick={onToggleSidebar} isVisible />;
};

export default GlobalTopBar;
