import React, { useState } from 'react';
import { Navbar } from '@/components/navigation/Navbar';
import { BottomNav } from '@/components/navigation/BottomNav';
import { UnifiedSidebar } from '@/design-system/components/navigation/UnifiedSidebar';
import { PortalHubOverlay } from '@/components/layout/PortalHubOverlay';

/**
 * Lightweight mobile shell (V2).
 * Hub overlay mounted so center BottomNav button works outside RootLayout too.
 */
export const MobileLayout = ({ children }: { children: React.ReactNode }) => {
  const [menuOpen, setMenuOpen] = useState(false);

  return (
    <div className="h-[100dvh] overflow-hidden bg-[var(--pm-bg)] flex flex-col relative">
      <Navbar onMenuClick={() => setMenuOpen(true)} />
      <UnifiedSidebar isMobileDrawer isOpen={menuOpen} onClose={() => setMenuOpen(false)} />
      <main className="flex-grow overflow-hidden relative pt-[60px] pb-[64px]">{children}</main>
      <BottomNav />
      <PortalHubOverlay />
    </div>
  );
};
