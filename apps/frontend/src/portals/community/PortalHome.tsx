import React, { Suspense, lazy } from 'react';
import { PageSkeleton } from '@/app/AppShell/GlobalSkeletonSystem';

const CommunityHubPortal = lazy(() => import('@/portals/community-hub/CommunityHubPortal'));

export const CommunityPortalHome: React.FC = () => {
  return (
    <Suspense fallback={<PageSkeleton />}>
      <CommunityHubPortal />
    </Suspense>
  );
};

export default CommunityPortalHome;
