import React from 'react';
import { Outlet } from 'react-router-dom';
import { PortalIconBar } from '@/design-system/components/navigation/PortalIconBar';

export const MarketplacePortalLayout: React.FC<{ children?: React.ReactNode }> = ({ children }) => {
  return (
    <div className="w-full min-h-screen bg-[var(--pm-bg)] text-[var(--pm-text)]">
      <PortalIconBar />
      <div className="w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
        {children || <Outlet />}
      </div>
    </div>
  );
};

export default MarketplacePortalLayout;

