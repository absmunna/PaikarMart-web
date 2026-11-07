import React, { Suspense, lazy } from 'react';
import { PageSkeleton } from '@/app/AppShell/GlobalSkeletonSystem';

const ServicesHome = lazy(() => import('@/portals/services-hub/services/pages/ServicesHome'));

export const ServicesPortalHome: React.FC = () => {
  return (
    <Suspense fallback={<PageSkeleton />}>
      <ServicesHome />
    </Suspense>
  );
};

export default ServicesPortalHome;
