import React, { Suspense, lazy } from 'react';
import { createBrowserRouter, RouterProvider, Outlet, useParams, Navigate, Routes, Route } from 'react-router-dom';
import { RootLayout } from '@/design-system/layouts';
import { publicRoutes } from './public.routes';
import { portalRoutes } from './portal.routes';
import { adminRoutes } from './admin.routes';
import { protectedRoutes } from './protected.routes';
import { settingsRoutes } from './settings.routes';
import { PageSkeleton } from '@/app/AppShell/GlobalSkeletonSystem';
import { ErrorBoundary } from '@/design-system/components/common/ErrorBoundary';
import { ScrollToTop } from '@/shared/components/layout/ScrollToTop';

import { Login } from '@/pages/auth/Login';
import { Register } from '@/pages/auth/Register';
const ForgotPassword = lazy(() => import('@/pages/auth/ForgotPassword'));
const VerifyEmailPage = lazy(() => import('@/pages/auth/VerifyEmailPage'));
const CheckoutPage = lazy(() => import('@/pages/CheckoutPage').then(m => ({ default: m.CheckoutPage })));
const SandboxGatewayPage = lazy(() => import('@/pages/SandboxGatewayPage').then(m => ({ default: m.SandboxGatewayPage })));
const NotFound = lazy(() => import('@/pages/NotFound').then(m => ({ default: m.NotFound })));

// Lazy-loaded Portal Entry Points for the Five Archetypes
const MarketplacePortalHome = lazy(() => import('@/portals/marketplace/PortalHome'));
const MarketplacePortalLayout = lazy(() => import('@/portals/marketplace/PortalLayout'));

const WholesalePortalHome = lazy(() => import('@/portals/wholesale/PortalHome'));
const WholesalePortalLayout = lazy(() => import('@/portals/wholesale/PortalLayout'));

const ServicesPortalHome = lazy(() => import('@/portals/services/PortalHome'));
const ServicesPortalLayout = lazy(() => import('@/portals/services/PortalLayout'));

const LogisticsPortalHome = lazy(() => import('@/portals/logistics/PortalHome'));
const LogisticsPortalLayout = lazy(() => import('@/portals/logistics/PortalLayout'));

const CommunityPortalHome = lazy(() => import('@/portals/community/PortalHome'));
const CommunityPortalLayout = lazy(() => import('@/portals/community/PortalLayout'));

/**
 * Flexible Portal Layout Component.
 * Resolves portalId or portal_id parameter and renders the correct archetype layout and home view.
 */
export const FlexiblePortalLayout: React.FC = () => {
  const { portalId, portal_id } = useParams<{ portalId?: string; portal_id?: string }>();
  const id = (portalId || portal_id || 'marketplace').toLowerCase();

  switch (id) {
    case 'marketplace':
    case 'retail':
    case 'b2c':
    case 'shop':
    case 'grocery':
    case 'pharmacy':
    case 'electronics':
      return (
        <MarketplacePortalLayout>
          <MarketplacePortalHome />
        </MarketplacePortalLayout>
      );

    case 'wholesale':
    case 'b2b':
    case 'factory-direct':
    case 'export':
      return (
        <WholesalePortalLayout>
          <WholesalePortalHome />
        </WholesalePortalLayout>
      );

    case 'services':
    case 'repairs':
    case 'technician':
    case 'beauty':
    case 'hotels':
      return (
        <ServicesPortalLayout>
          <ServicesPortalHome />
        </ServicesPortalLayout>
      );

    case 'logistics':
    case 'ride':
    case 'trucking':
    case 'parcel':
      return (
        <LogisticsPortalLayout>
          <LogisticsPortalHome />
        </LogisticsPortalLayout>
      );

    case 'community':
    case 'demand':
    case 'social':
      return (
        <CommunityPortalLayout>
          <CommunityPortalHome />
        </CommunityPortalLayout>
      );

    default:
      return (
        <MarketplacePortalLayout>
          <MarketplacePortalHome />
        </MarketplacePortalLayout>
      );
  }
};

/**
 * createBrowserRouter Router configuration supporting nested and dynamic routes.
 */
export const router = createBrowserRouter([
  {
    path: '/login',
    element: <Login />,
  },
  {
    path: '/register',
    element: <Register />,
  },
  {
    path: '/auth/login',
    element: <Login />,
  },
  {
    path: '/auth/register',
    element: <Register />,
  },
  {
    path: '/checkout',
    element: (
      <Suspense fallback={<PageSkeleton />}>
        <CheckoutPage />
      </Suspense>
    ),
  },
  {
    path: '/',
    element: (
      <RootLayout>
        <ErrorBoundary>
          <Suspense fallback={<PageSkeleton />}>
            <ScrollToTop />
            <Outlet />
          </Suspense>
        </ErrorBoundary>
      </RootLayout>
    ),
    children: [
      {
        path: 'portal/:portalId/*',
        element: <FlexiblePortalLayout />,
      },
      {
        path: 'portals/:portalId/*',
        element: <FlexiblePortalLayout />,
      },
      {
        path: 'marketplace/:portalId/*',
        element: <FlexiblePortalLayout />,
      },
      {
        path: 'wholesale/:portalId/*',
        element: <FlexiblePortalLayout />,
      },
      {
        path: 'services/:portalId/*',
        element: <FlexiblePortalLayout />,
      },
      {
        path: 'logistics/:portalId/*',
        element: <FlexiblePortalLayout />,
      },
      {
        path: 'community/:portalId/*',
        element: <FlexiblePortalLayout />,
      },
      // Catch-all route for other standard pages
      {
        path: '*',
        element: <NotFound />,
      },
    ],
  },
]);

/**
 * AppRoutes Component for backwards compatibility and fallback rendering.
 */
export const AppRoutes: React.FC = () => {
  return (
    <ErrorBoundary>
      <ScrollToTop />
      <Suspense fallback={<PageSkeleton />}>
        <Routes>
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
          <Route path="/portal/:portalId/*" element={<RootLayout><FlexiblePortalLayout /></RootLayout>} />
          <Route path="/portals/:portalId/*" element={<RootLayout><FlexiblePortalLayout /></RootLayout>} />
          <Route path="/*" element={
            <RootLayout>
              <ErrorBoundary>
                <Suspense fallback={<PageSkeleton />}>
                  <Routes>
                    {publicRoutes}
                    {portalRoutes}
                    {protectedRoutes}
                    {settingsRoutes}
                    {adminRoutes}
                    <Route path="*" element={<NotFound />} />
                  </Routes>
                </Suspense>
              </ErrorBoundary>
            </RootLayout>
          } />
        </Routes>
      </Suspense>
    </ErrorBoundary>
  );
};

export default AppRoutes;
export { publicRoutes } from './public.routes';
export { portalRoutes } from './portal.routes';
export { adminRoutes } from './admin.routes';
export { protectedRoutes } from './protected.routes';
export { settingsRoutes } from './settings.routes';
export { ROLE_ROUTE_CONFIG } from './role.routes';
