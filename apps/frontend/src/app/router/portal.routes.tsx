import React, { lazy } from 'react';
import { Route, Routes } from 'react-router-dom';

const B2CLayout = lazy(() => import('@/portals/marketplace-hub/retail/layouts/B2CLayout').then(m => ({ default: m.B2CLayout })));
const B2CHome = lazy(() => import('@/portals/marketplace-hub/retail/pages/B2CHome').then(m => ({ default: m.B2CHome })));
const PKShopHome = lazy(() => import('@/portals/marketplace-hub/pk-shop').then(m => ({ default: m.PKShopHome })));
const PKShopAdminView = lazy(() => import('@/modules/portals/pk-shop').then(m => ({ default: m.PKShopAdminView })));
const MarketplaceHubPortal = lazy(() => import('@/portals/marketplace-hub/MarketplaceHubPortal'));
const BrandShopsHome = lazy(() => import('@/portals/marketplace-hub/brand-shops/pages/BrandShopsHome'));
const DropshipStore = lazy(() => import('@/portals/marketplace-hub/dropship/pages/DropshipStore'));
const AutoPortal = lazy(() => import('@/portals/marketplace-hub/auto/pages/AutoHome'));
const B2BLayout = lazy(() => import('@/portals/marketplace-hub/wholesale/layouts/B2BLayout').then(m => ({ default: m.B2BLayout })));
const B2BHome = lazy(() => import('@/portals/marketplace-hub/wholesale/pages/B2BHome').then(m => ({ default: m.B2BHome })));
const B2BDashboard = lazy(() => import('@/portals/marketplace-hub/wholesale/pages/Dashboard').then(m => ({ default: m.Dashboard })));
const B2BProducts = lazy(() => import('@/portals/marketplace-hub/wholesale/pages/Products').then(m => ({ default: m.Products })));
const B2BOrders = lazy(() => import('@/portals/marketplace-hub/wholesale/pages/Orders').then(m => ({ default: m.Orders })));

const NearbyHome = lazy(() => import('@/portals/local-hub/subportals/nearby/pages/NearbyHome'));
const LocalHubHome = lazy(() => import('@/portals/local-hub/pages/LocalHubHome').then(m => ({ default: m.LocalHubHome })));
const LocalShopDetailPage = lazy(() => import('@/portals/local-hub/pages/LocalShopDetailPage'));
const ServicesHome = lazy(() => import('@/portals/services-hub/services/pages/ServicesHome'));
const RideHome = lazy(() => import('@/portals/logistics-hub/ride/pages/RideHome'));
const DigitalHome = lazy(() => import('@/portals/marketplace-hub/digital/pages/DigitalHome'));
const GroceryHome = lazy(() => import('@/portals/local-hub/subportals/grocery/pages/GroceryHome').then(m => ({ default: m.GroceryHome })));
const PharmacyHome = lazy(() => import('@/portals/local-hub/subportals/pharmacy/pages/PharmacyHome').then(m => ({ default: m.PharmacyHome })));
const ElectronicsHome = lazy(() => import('@/portals/local-hub/subportals/electronics/pages/ElectronicsHome').then(m => ({ default: m.ElectronicsHome })));
const ProductDetails = lazy(() => import('@/portals/marketplace-hub/marketplace/pages/ProductDetailsView'));
const BecomeSellerPage = lazy(() => import('@/portals/seller-central/pages/BecomeSellerPage'));
const SellerCentralPortal = lazy(() => import('@/portals/seller-central/SellerCentralPortal').then(m => ({ default: m.SellerCentralPortal })));
const ExportHome = lazy(() => import('@/portals/marketplace-hub/wholesale/pages/export/ExportHome').then(m => ({ default: m.ExportHome })));
const PortalComingSoon = lazy(() => import('@/pages/PortalComingSoon'));
const VaultDashboard = lazy(() => import('@/portals/client-vault/VaultDashboard'));
const VaultLogin = lazy(() => import('@/portals/client-vault/VaultLogin'));

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
    {/* Local Hub, Nearby Stores & Dedicated Local Shop Detail Page */}
    <Route path="/nearby/shop/:id" element={<LocalShopDetailPage />} />
    <Route path="/portal/nearby/shop/:id" element={<LocalShopDetailPage />} />
    <Route path="/local/shop/:id" element={<LocalShopDetailPage />} />
    <Route path="/local-hub/shop/:id" element={<LocalShopDetailPage />} />
    <Route path="/local-hub" element={<LocalHubHome />} />
    <Route path="/portal/local-hub" element={<LocalHubHome />} />
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
