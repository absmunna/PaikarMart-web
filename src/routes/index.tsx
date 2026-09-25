import React from 'react';
import { Routes, Route } from 'react-router-dom';
import { RootLayout } from '../layouts/RootLayout';
import { publicRoutes } from './public.routes';
import { portalRoutes } from './portal.routes';
import { adminRoutes } from './admin.routes';
import { protectedRoutes } from './protected.routes';

// Standalone pages
import Login from '../modules/auth/pages/Login';
import { Register } from '../modules/auth/pages/Register';
import ForgotPassword from '../modules/auth/pages/ForgotPassword';
import { CheckoutPage } from '../pages/CheckoutPage';
import { NotFound } from '../pages/NotFound';

export const AppRoutes: React.FC = () => {
  return (
    <Routes>
      {/* Standalone Auth & Checkout pages */}
      <Route path="/login" element={<Login />} />
      <Route path="/register" element={<Register />} />
      <Route path="/forgot-password" element={<ForgotPassword />} />
      <Route path="/checkout" element={<CheckoutPage />} />

      {/* Main app wrapped in RootLayout */}
      <Route path="/*" element={
        <RootLayout>
          <Routes>
            {publicRoutes}
            {portalRoutes}
            {protectedRoutes}
            {adminRoutes}

            {/* Fallback */}
            <Route path="*" element={<NotFound />} />
          </Routes>
        </RootLayout>
      } />
    </Routes>
  );
};

export default AppRoutes;
export { publicRoutes } from './public.routes';
export { portalRoutes } from './portal.routes';
export { adminRoutes } from './admin.routes';
export { protectedRoutes } from './protected.routes';
export { ROLE_ROUTE_CONFIG } from './role.routes';
