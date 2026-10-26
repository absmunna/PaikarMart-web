import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { RootLayout } from '../layouts/RootLayout';
import { publicRoutes } from './public.routes';
import { RoleGuard } from '../guards/RoleGuard';
import { SellerDashboard } from '../pages/dashboards/SellerDashboard';
import { AdminDashboard } from '../pages/dashboards/AdminDashboard';
import { ModeratorDashboard } from '../pages/dashboards/ModeratorDashboard';
import { B2BLayout } from '../portals/wholesale/layouts/B2BLayout';
import { B2BHome } from '../portals/wholesale/pages/B2BHome';
import { Dashboard as B2BDashboard } from '../portals/wholesale/pages/Dashboard';
import { Products as B2BProducts } from '../portals/wholesale/pages/Products';
import { Orders as B2BOrders } from '../portals/wholesale/pages/Orders';
import { NotFound } from '../pages/NotFound';
import Login from '../modules/auth/pages/Login';
import { Register } from '../modules/auth/pages/Register';
import ForgotPassword from '../modules/auth/pages/ForgotPassword';
import { CheckoutPage } from '../pages/CheckoutPage';

import { PKShopHome } from '../portals/pk-shop';
import { B2CLayout } from '../portals/b2c/layouts/B2CLayout';
import { B2CHome } from '../portals/b2c/pages/B2CHome';
import { WalletPage } from '../pages/WalletPage';
import { VendorsPage } from '../pages/VendorsPage';
import NearbyHome from '../portals/nearby/pages/NearbyHome';
import ServicesHome from '../portals/services/pages/ServicesHome';
import RideHome from '../portals/ride/pages/RideHome';
import DigitalHome from '../portals/digital/pages/DigitalHome';

export const AppRoutes = () => {
  return (
    <Routes>
      <Route path="/login" element={<Login />} />
      <Route path="/register" element={<Register />} />
      <Route path="/forgot-password" element={<ForgotPassword />} />
      <Route path="/checkout" element={<CheckoutPage />} />
      <Route path="/*" element={
        <RootLayout>
          <Routes>
            {publicRoutes}
            <Route 
              path="/wholesale/*" 
              element={
                <B2BLayout>
                  <Routes>
                    <Route path="/" element={<B2BHome />} />
                    <Route path="/dashboard" element={<B2BDashboard />} />
                    <Route path="/products" element={<B2BProducts />} />
                    <Route path="/orders" element={<B2BOrders />} />
                  </Routes>
                </B2BLayout>
              } 
            />
            {/* The following portals are "coming soon" */}
            <Route path="/wallet/*" element={<WalletPage />} />
            <Route path="/vendors" element={<VendorsPage />} />
            <Route path="/portal/nearby" element={<NearbyHome />} />
            <Route path="/portal/services" element={<ServicesHome />} />
            <Route path="/portal/ride" element={<RideHome />} />
            <Route path="/portal/digital" element={<DigitalHome />} />
            <Route 
              path="/b2c/*" 
              element={
                <B2CLayout>
                  <Routes>
                    <Route path="/" element={<B2CHome />} />
                  </Routes>
                </B2CLayout>
              } 
            />
            <Route 
              path="/pk-shop/*" 
              element={
                  <Routes>
                    <Route path="/" element={<PKShopHome />} />
                  </Routes>
              } 
            />
            <Route path="*" element={<NotFound />} />
            
            {/* Dashboard Routing with strict RoleGuard */}
            <Route 
              path="/dashboard" 
              element={
                <RoleGuard allowedRoles={['seller', 'moderator', 'admin', 'super_admin']}>
                  <SellerDashboard />
                </RoleGuard>
              } 
            />
            <Route 
              path="/dashboard/admin/*" 
              element={
                <RoleGuard allowedRoles={['admin', 'super_admin']}>
                  <AdminDashboard />
                </RoleGuard>
              } 
            />
            <Route 
              path="/dashboard/moderator/*" 
              element={
                <RoleGuard allowedRoles={['moderator', 'admin', 'super_admin']}>
                  <ModeratorDashboard />
                </RoleGuard>
              } 
            />
          </Routes>
        </RootLayout>
      } />
    </Routes>
  );
};
