import React from 'react';
import { Route, Routes } from 'react-router-dom';

import { B2CLayout } from '../portals/marketplace-hub/retail/layouts/B2CLayout';
import { B2CHome } from '../portals/marketplace-hub/retail/pages/B2CHome';
import { PKShopHome } from '../portals/marketplace-hub/pk-shop';
import { B2BLayout } from '../portals/marketplace-hub/wholesale/layouts/B2BLayout';
import { B2BHome } from '../portals/marketplace-hub/wholesale/pages/B2BHome';
import { Dashboard as B2BDashboard } from '../portals/marketplace-hub/wholesale/pages/Dashboard';
import { Products as B2BProducts } from '../portals/marketplace-hub/wholesale/pages/Products';
import { Orders as B2BOrders } from '../portals/marketplace-hub/wholesale/pages/Orders';

import NearbyHome from '../portals/local-hub/subportals/nearby/pages/NearbyHome';
import ServicesHome from '../portals/services-hub/services/pages/ServicesHome';
import RideHome from '../portals/logistics-hub/ride/pages/RideHome';
import DigitalHome from '../portals/marketplace-hub/digital/pages/DigitalHome';
import { GroceryHome } from '../portals/local-hub/subportals/grocery/pages/GroceryHome';
import { PharmacyHome } from '../portals/local-hub/subportals/pharmacy/pages/PharmacyHome';
import { ElectronicsHome } from '../portals/local-hub/subportals/electronics/pages/ElectronicsHome';
import { ProductDetails } from '../pages/ProductDetails';
import BecomeSellerPage from '../portals/seller-central/pages/BecomeSellerPage';
import { SellerCentralPortal } from '../portals/seller-central/SellerCentralPortal';

export const portalRoutes = (
  <>
    {/* Become Seller & Seller Central */}
    <Route path="/become-seller" element={<BecomeSellerPage />} />
    <Route path="/seller/*" element={<SellerCentralPortal />} />

    {/* Core Retail / B2C Portals */}
    <Route path="/shop" element={<B2CHome />} />
    <Route 
      path="/b2c/*" 
      element={
        <B2CLayout>
          <Routes>
            <Route path="/" element={<B2CHome />} />
            <Route path="/product/:id" element={<ProductDetails />} />
          </Routes>
        </B2CLayout>
      } 
    />
    <Route 
      path="/marketplace/*" 
      element={
        <B2CLayout>
          <Routes>
            <Route path="/" element={<B2CHome />} />
            <Route path="/product/:id" element={<ProductDetails />} />
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

    {/* B2B / Wholesale Portals */}
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
    <Route 
      path="/b2b/*" 
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

    {/* Become Seller */}
    <Route path="/become-seller" element={<BecomeSellerPage />} />

    {/* Specialized Category Portals & Friendly Aliases */}
    <Route path="/portal/grocery" element={<GroceryHome />} />
    <Route path="/grocery" element={<GroceryHome />} />
    <Route path="/portal/pharmacy" element={<PharmacyHome />} />
    <Route path="/pharmacy" element={<PharmacyHome />} />
    <Route path="/portal/electronics" element={<ElectronicsHome />} />
    <Route path="/electronics" element={<ElectronicsHome />} />
    <Route path="/portal/nearby" element={<NearbyHome />} />
    <Route path="/nearby" element={<NearbyHome />} />
    <Route path="/local" element={<NearbyHome />} />
    <Route path="/local/*" element={<NearbyHome />} />
    <Route path="/portal/services" element={<ServicesHome />} />
    <Route path="/services" element={<ServicesHome />} />
    <Route path="/portal/ride" element={<RideHome />} />
    <Route path="/ride" element={<RideHome />} />
    <Route path="/portal/digital" element={<DigitalHome />} />
    <Route path="/digital" element={<DigitalHome />} />
  </>
);
