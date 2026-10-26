import React, { useState } from 'react';
import { Navbar } from '../components/navigation/Navbar';
import { BottomNav } from '../components/navigation/BottomNav';
import { MobileMenu } from '../components/navigation/MobileMenu';

export const MobileLayout = ({ children }: { children: React.ReactNode }) => {
  const [menuOpen, setMenuOpen] = useState(false);

  return (
    <div className="h-[100dvh] overflow-hidden bg-[var(--pm-bg)] flex flex-col">
      <Navbar onMenuClick={() => setMenuOpen(true)} />
      <MobileMenu isOpen={menuOpen} onClose={() => setMenuOpen(false)} />
      <main className="flex-grow overflow-hidden relative pt-[60px] pb-[64px]">{children}</main>
      <BottomNav />
    </div>
  );
};
