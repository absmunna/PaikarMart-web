import React, { Suspense } from 'react';
import { Routes, Route } from 'react-router-dom';
import { RootLayout } from '@/design-system/layouts';
import { publicRoutes } from './public.routes';
import { portalRoutes } from './portal.routes';
import { adminRoutes } from './admin.routes';
import { protectedRoutes } from './protected.routes';
import { settingsRoutes } from './settings.routes';
import { PageSkeleton } from '@/app/AppShell/GlobalSkeletonSystem';
import { ErrorBoundary } from '@/design-system/components/common/ErrorBoundary';

// Standalone pages
import { Login } from '@/pages/auth/Login';
import { Register } from '@/pages/auth/Register';
import ForgotPassword from '@/pages/auth/ForgotPassword';
import VerifyEmailPage from '@/pages/auth/VerifyEmailPage';
import { CheckoutPage } from '@/pages/CheckoutPage';
import { SandboxGatewayPage } from '@/pages/SandboxGatewayPage';
import { NotFound } from '@/pages/NotFound';
import { ScrollToTop } from '@/shared/components/layout/ScrollToTop';

export const AppRoutes: React.FC = () => {
  return (
    <ErrorBoundary>
      <ScrollToTop />
      <Suspense fallback={<PageSkeleton />}>
        <Routes>
          {/* Standalone Auth & Checkout pages */}
          <Route path="/login" element={<Login />} />
          <Route path="/auth/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
          <Route path="/auth/register" element={<Register />} />
          <Route path="/forgot-password" element={<ForgotPassword />} />
          <Route path="/auth/forgot-password" element={<ForgotPassword />} />
          <Route path="/verify-email" element={<VerifyEmailPage />} />
          <Route path="/checkout" element={<CheckoutPage />} />
          <Route path="/checkout/sandbox-gateway" element={<SandboxGatewayPage />} />

          {/* Main app wrapped in RootLayout */}
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

                    {/* Fallback */}
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
