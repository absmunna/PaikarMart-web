import React, { Suspense, lazy } from 'react';
import { PageSkeleton } from '@/app/AppShell/GlobalSkeletonSystem';

import MarketPage from '@/pages/MarketPage';

export const MarketplacePortalHome: React.FC = () => {
  return (
    <Suspense fallback={<PageSkeleton />}>
      <MarketPage />
    </Suspense>
  );
};

export default MarketplacePortalHome;
