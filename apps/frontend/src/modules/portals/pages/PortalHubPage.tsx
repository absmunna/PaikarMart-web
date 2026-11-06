import React, { Suspense, lazy } from 'react';
import { useParams, Navigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'motion/react';
import { Skeleton } from '@/components/ui/skeleton';

// Lazy load portal archetype views & specific hubs
const B2CLayout = lazy(() => import('@/portals/marketplace-hub/retail/layouts/B2CLayout').then(m => ({ default: m.B2CLayout })));
const B2CHome = lazy(() => import('@/portals/marketplace-hub/retail/pages/B2CHome').then(m => ({ default: m.B2CHome })));
const B2BLayout = lazy(() => import('@/portals/marketplace-hub/wholesale/layouts/B2BLayout').then(m => ({ default: m.B2BLayout })));
const B2BHome = lazy(() => import('@/portals/marketplace-hub/wholesale/pages/B2BHome').then(m => ({ default: m.B2BHome })));
const PKShopHome = lazy(() => import('@/portals/marketplace-hub/pk-shop').then(m => ({ default: m.PKShopHome })));
const BrandShopsHome = lazy(() => import('@/portals/marketplace-hub/brand-shops/pages/BrandShopsHome'));
const DropshipStore = lazy(() => import('@/portals/marketplace-hub/dropship/pages/DropshipStore'));
const AutoHome = lazy(() => import('@/portals/marketplace-hub/auto/pages/AutoHome'));
const ServicesHome = lazy(() => import('@/portals/services-hub/services/pages/ServicesHome'));
const RideHome = lazy(() => import('@/portals/logistics-hub/ride/pages/RideHome'));
const DigitalHome = lazy(() => import('@/portals/marketplace-hub/digital/pages/DigitalHome'));
const GroceryHome = lazy(() => import('@/portals/local-hub/subportals/grocery/pages/GroceryHome').then(m => ({ default: m.GroceryHome })));
const PharmacyHome = lazy(() => import('@/portals/local-hub/subportals/pharmacy/pages/PharmacyHome').then(m => ({ default: m.PharmacyHome })));
const ElectronicsHome = lazy(() => import('@/portals/local-hub/subportals/electronics/pages/ElectronicsHome').then(m => ({ default: m.ElectronicsHome })));
const NearbyHome = lazy(() => import('@/portals/local-hub/subportals/nearby/pages/NearbyHome'));
const ExportHome = lazy(() => import('@/portals/marketplace-hub/wholesale/pages/export/ExportHome').then(m => ({ default: m.ExportHome })));
const Demand = lazy(() => import('@/pages/Demand'));
const CommunityHubPortal = lazy(() => import('@/portals/community-hub/CommunityHubPortal'));
const PortalComingSoon = lazy(() => import('@/pages/PortalComingSoon'));
const RFQPortal = lazy(() => import('../components/RFQPortal').then(m => ({ default: m.RFQPortal })));

const getPortalComponent = (portalId: string): React.ReactNode => {
  const id = portalId.toLowerCase();

  switch (id) {
    // Archetype 1: Retail & E-Commerce
    case 'retail':
    case 'b2c':
    case 'marketplace':
    case 'shop':
    case 'fashion':
      return <B2CLayout><B2CHome /></B2CLayout>;
    case 'grocery':
    case 'food':
      return <GroceryHome />;
    case 'pharmacy':
    case 'medicine':
      return <PharmacyHome />;
    case 'electronics':
    case 'gadgets':
      return <ElectronicsHome />;
    case 'digital':
      return <DigitalHome />;
    case 'pk-shop':
    case 'pk-store':
      return <PKShopHome />;
    case 'brands':
    case 'brand-shops':
      return <BrandShopsHome />;
    case 'dropship':
      return <DropshipStore />;
    case 'auto':
    case 'automotive':
      return <AutoHome />;

    // Archetype 2: Wholesale & B2B Trade
    case 'wholesale':
    case 'b2b':
    case 'factory-direct':
    case 'agro-wholesale':
      return <B2BLayout><B2BHome /></B2BLayout>;
    case 'export':
      return <ExportHome />;
    case 'rfq':
      return <RFQPortal />;

    // Archetype 3: On-Demand Services & Booking
    case 'services':
    case 'repairs':
    case 'technician':
    case 'beauty':
    case 'education':
    case 'tutors':
    case 'hotels':
    case 'travel':
    case 'rentals':
      return <ServicesHome />;

    // Archetype 4: Logistics & Express Delivery
    case 'logistics':
    case 'ride':
    case 'trucking':
    case 'parcel':
    case 'express':
    case 'delivery':
      return <RideHome />;

    // Archetype 5: Community, Content & Classifieds
    case 'demand':
    case 'rfq-board':
      return <Demand />;
    case 'community':
    case 'social':
      return <CommunityHubPortal />;
    case 'nearby':
    case 'local':
      return <NearbyHome />;

    // Default Fallback
    default:
      return <PortalComingSoon />;
  }
};

export const PortalHubPage: React.FC = () => {
  const params = useParams<{ portal_id?: string; type?: string }>();
  const activeId = params.portal_id || params.type || 'explore';

  return (
    <div className="w-full max-w-7xl mx-auto px-4 md:px-8 py-4 pb-32">
      <AnimatePresence mode="wait">
        <motion.div
          key={activeId}
          initial={{ opacity: 0, y: 8 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -8 }}
          transition={{ duration: 0.2 }}
        >
          <Suspense fallback={<PortalSkeleton />}>
            {getPortalComponent(activeId)}
          </Suspense>
        </motion.div>
      </AnimatePresence>
    </div>
  );
};

const PortalSkeleton = () => (
  <div className="space-y-8 animate-pulse p-4">
    <div className="h-48 bg-white/5 rounded-[2.5rem]" />
    <div className="flex gap-4">
      <Skeleton className="h-14 flex-1 bg-white/5 rounded-2xl" />
      <Skeleton className="h-14 w-32 bg-white/5 rounded-2xl" />
    </div>
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      {[1, 2, 3, 4, 5, 6].map((i) => (
        <Skeleton key={i} className="h-96 bg-white/5 rounded-[2rem]" />
      ))}
    </div>
  </div>
);
