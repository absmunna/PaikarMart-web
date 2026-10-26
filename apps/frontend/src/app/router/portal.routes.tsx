import React from 'react';
import { Route, Routes } from 'react-router-dom';

import { B2CLayout } from '@/portals/marketplace-hub/retail/layouts/B2CLayout';
import { B2CHome } from '@/portals/marketplace-hub/retail/pages/B2CHome';
import { PKShopHome } from '@/portals/marketplace-hub/pk-shop';
import { PKShopAdminView } from '@/modules/portals/pk-shop';
import MarketplaceHubPortal from '@/portals/marketplace-hub/MarketplaceHubPortal';
import BrandShopsHome from '@/portals/marketplace-hub/brand-shops/pages/BrandShopsHome';
import DropshipStore from '@/portals/marketplace-hub/dropship/pages/DropshipStore';
import AutoPortal from '@/portals/marketplace-hub/auto/pages/AutoHome';
import { B2BLayout } from '@/portals/marketplace-hub/wholesale/layouts/B2BLayout';
import { B2BHome } from '@/portals/marketplace-hub/wholesale/pages/B2BHome';
import { Dashboard as B2BDashboard } from '@/portals/marketplace-hub/wholesale/pages/Dashboard';
import { Products as B2BProducts } from '@/portals/marketplace-hub/wholesale/pages/Products';
import { Orders as B2BOrders } from '@/portals/marketplace-hub/wholesale/pages/Orders';

import NearbyHome from '@/portals/local-hub/subportals/nearby/pages/NearbyHome';
import ServicesHome from '@/portals/services-hub/services/pages/ServicesHome';
import RideHome from '@/portals/logistics-hub/ride/pages/RideHome';
import DigitalHome from '@/portals/marketplace-hub/digital/pages/DigitalHome';
import { GroceryHome } from '@/portals/local-hub/subportals/grocery/pages/GroceryHome';
import { PharmacyHome } from '@/portals/local-hub/subportals/pharmacy/pages/PharmacyHome';
import { ElectronicsHome } from '@/portals/local-hub/subportals/electronics/pages/ElectronicsHome';
import ProductDetails from '@/portals/marketplace-hub/marketplace/pages/ProductDetailsView';
import BecomeSellerPage from '@/portals/seller-central/pages/BecomeSellerPage';
import { SellerCentralPortal } from '@/portals/seller-central/SellerCentralPortal';
import { ExportHome } from '@/portals/marketplace-hub/wholesale/pages/export/ExportHome';
import PortalComingSoon from '@/pages/PortalComingSoon';
import VaultDashboard from '@/portals/client-vault/VaultDashboard';
import VaultLogin from '@/portals/client-vault/VaultLogin';

export const portalRoutes = (
  <>
    {/* Client Vault */}
    <Route path="/client-vault" element={<VaultDashboard />} />
    <Route path="/client-vault/login" element={<VaultLogin />} />
    <Route path="/vault" element={<VaultDashboard />} />

    {/* Become Seller & Seller Central */}
    <Route path="/become-seller" element={<BecomeSellerPage />} />
    <Route path="/seller/onboarding" element={<BecomeSellerPage />} />
    <Route path="/seller/dashboard" element={<SellerCentralPortal />} />
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
    {/* Marketplace Hub Main Entry & Subroutes */}
    <Route path="/marketplace" element={<MarketplaceHubPortal />} />
    <Route path="/marketplace/hub" element={<MarketplaceHubPortal />} />
    <Route
      path="/marketplace/*"
      element={
        <Routes>
          <Route path="/" element={<MarketplaceHubPortal />} />
          <Route path="/all" element={<B2CLayout><B2CHome /></B2CLayout>} />
          <Route path="/product/:id" element={<ProductDetails />} />
        </Routes>
      }
    />
    <Route
      path="/pk-shop/*"
      element={
        <Routes>
          <Route path="/" element={<PKShopHome />} />
          <Route path="/admin" element={<PKShopAdminView />} />
        </Routes>
      }
    />
    <Route path="/pk-shop/admin" element={<PKShopAdminView />} />
    <Route path="/portals/pk-shop/admin" element={<PKShopAdminView />} />
    <Route path="/portals/pk-shop" element={<PKShopHome />} />
    <Route path="/pk-store" element={<PKShopHome />} />
    <Route path="/pk-store/*" element={<PKShopHome />} />
    <Route path="/brands" element={<BrandShopsHome />} />
    <Route path="/brands/*" element={<BrandShopsHome />} />
    <Route path="/dropship" element={<DropshipStore />} />
    <Route path="/dropship/*" element={<DropshipStore />} />
    <Route path="/auto" element={<AutoPortal />} />
    <Route path="/auto/*" element={<AutoPortal />} />

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
    <Route path="/register/seller" element={<BecomeSellerPage />} />
    <Route path="/seller/register" element={<BecomeSellerPage />} />
    <Route path="/seller-central" element={<SellerCentralPortal />} />
    <Route path="/seller-central/*" element={<SellerCentralPortal />} />
    <Route path="/categories" element={<MarketplaceHubPortal />} />

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
    <Route path="/logistic" element={<RideHome />} />
    <Route path="/logistic/*" element={<RideHome />} />
    <Route path="/logistics" element={<RideHome />} />
    <Route path="/logistics/*" element={<RideHome />} />
    <Route path="/portal/digital" element={<DigitalHome />} />
    <Route path="/digital" element={<DigitalHome />} />

    {/* Export / International Trade & Food */}
    <Route path="/export" element={<ExportHome />} />
    <Route path="/export/*" element={<ExportHome />} />
    <Route path="/food" element={<GroceryHome />} />

    {/* Specialized Verticals & Safe Boundary Coming Soon Portals */}
    <Route path="/jobs" element={<PortalComingSoon />} />
    <Route path="/real-estate" element={<PortalComingSoon />} />
    <Route path="/hotel" element={<PortalComingSoon />} />
    <Route path="/hotels" element={<PortalComingSoon />} />
    <Route path="/agriculture" element={<PortalComingSoon />} />
    <Route path="/healthcare" element={<PortalComingSoon />} />
    <Route path="/education" element={<PortalComingSoon />} />
    <Route path="/finance" element={<PortalComingSoon />} />
    <Route path="/events" element={<PortalComingSoon />} />
  </>
);
