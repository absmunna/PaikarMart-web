import React, { Suspense, lazy } from 'react';
import { Helmet } from 'react-helmet-async';
import { PageSkeleton } from '@/app/AppShell/GlobalSkeletonSystem';

const B2BLayout = lazy(() => import('@/portals/marketplace-hub/wholesale/layouts/B2BLayout').then(m => ({ default: m.B2BLayout })));
const B2BHome = lazy(() => import('@/portals/marketplace-hub/wholesale/pages/B2BHome').then(m => ({ default: m.B2BHome })));

export const WholesalePortalHome: React.FC = () => {
  return (
    <>
      <Helmet>
        <title>B2B Wholesale Hub – Bulk Buying & Supplier Marketplace | Paikar Mart</title>
        <meta name="description" content="Connect with verified wholesale suppliers, source bulk inventory at factory prices, and scale your retail business across Bangladesh with Paikar Mart B2B." />
      </Helmet>
      <Suspense fallback={<PageSkeleton />}>
        <B2BLayout>
          <B2BHome />
        </B2BLayout>
      </Suspense>
    </>
  );
};

export default WholesalePortalHome;
