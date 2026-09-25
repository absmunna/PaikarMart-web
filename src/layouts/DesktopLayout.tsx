import React from 'react';
import { Navbar } from '../components/navigation/Navbar';

export const DesktopLayout = ({ children }: { children: React.ReactNode }) => {
  return (
    <div className="h-[100dvh] overflow-hidden bg-[#050508] flex items-center justify-center">
      <div className="w-[480px] h-[100dvh] overflow-hidden bg-[var(--pm-bg)] shadow-2xl relative">
        <Navbar onMenuClick={() => {}} />
        <main className="h-full overflow-hidden pt-[64px] pb-0">{children}</main>
      </div>
    </div>
  );
};
