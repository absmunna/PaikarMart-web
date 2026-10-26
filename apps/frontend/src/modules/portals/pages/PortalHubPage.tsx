import React, { Suspense, lazy } from 'react';
import { useParams, Navigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'motion/react';
import { Skeleton } from '@/components/ui/skeleton';

// Lazy load portal views
const WholesalePortal = lazy(() => import('../components/WholesalePortal').then(m => ({ default: m.WholesalePortal })));
const NearbyPortal = lazy(() => import('../components/NearbyPortal').then(m => ({ default: m.NearbyPortal })));
const ServicesPortal = lazy(() => import('../components/ServicesPortal').then(m => ({ default: m.ServicesPortal })));
const DigitalPortal = lazy(() => import('../components/DigitalPortal').then(m => ({ default: m.DigitalPortal })));
const RFQPortal = lazy(() => import('../components/RFQPortal').then(m => ({ default: m.RFQPortal })));

const PORTAL_MAP: Record<string, React.ReactNode> = {
  'wholesale': <WholesalePortal />,
  'nearby': <NearbyPortal />,
  'services': <ServicesPortal />,
  'digital': <DigitalPortal />,
  'rfq': <RFQPortal />,
  // Retail could be a separate portal or use the main marketplace
  'retail': <Navigate to="/marketplace" replace />
};

export const PortalHubPage: React.FC = () => {
  const { type } = useParams<{ type: string }>();

  if (!type || !PORTAL_MAP[type]) {
    return <Navigate to="/apps" replace />;
  }

  return (
    <div className="w-full max-w-7xl mx-auto px-4 md:px-8 py-8 pb-32">
      <AnimatePresence mode="wait">
        <motion.div
          key={type}
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          exit={{ opacity: 0, x: -20 }}
          transition={{ duration: 0.3 }}
        >
          <Suspense fallback={<PortalSkeleton />}>
            {PORTAL_MAP[type]}
          </Suspense>
        </motion.div>
      </AnimatePresence>
    </div>
  );
};

const PortalSkeleton = () => (
  <div className="space-y-8 animate-pulse">
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
