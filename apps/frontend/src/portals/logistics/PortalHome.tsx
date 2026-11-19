import React, { Suspense, lazy } from 'react';
import { PageSkeleton } from '@/app/AppShell/GlobalSkeletonSystem';

const RideHome = lazy(() => import('@/portals/logistics-hub/ride/pages/RideHome'));

export const LogisticsPortalHome: React.FC = () => {
  return (
    <Suspense fallback={<PageSkeleton />}>
      <RideHome />
    </Suspense>
  );
};

export default LogisticsPortalHome;
