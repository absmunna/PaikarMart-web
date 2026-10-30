import React, { lazy } from 'react';
import { Route } from 'react-router-dom';
import { AuthGuard } from '@/guards/AuthGuard';
import { RoleGuard } from '@/guards/RoleGuard';

const SettingsPage = lazy(() => import('@/pages/SettingsPage').then(m => ({ default: m.SettingsPage })));
const NotificationSettingsPage = lazy(() => import('@/modules/notification/pages/NotificationSettingsPage').then(m => ({ default: m.NotificationSettingsPage })));
const ProfilePage = lazy(() => import('@/modules/profile').then(m => ({ default: m.ProfilePage })));
const WalletPage = lazy(() => import('@/pages/WalletPage').then(m => ({ default: m.WalletPage })));
const SellerCentralPortal = lazy(() => import('@/portals/seller-central/SellerCentralPortal').then(m => ({ default: m.SellerCentralPortal })));
const BecomeSellerPage = lazy(() => import('@/portals/seller-central/pages/BecomeSellerPage'));

const ALLOWED_BUSINESS_ROLES = [
  'seller',
  'admin',
  'super_admin',
  'nearby_shop',
  'service_provider',
  'digital_seller',
  'wholesale_seller'
];

export const settingsRoutes = (
  <>
    {/* ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
        1. APP SETTINGS PORTAL (Public - Accessible to All Users & Guests)
       ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━ */}
    <Route path="/settings/app" element={<SettingsPage />} />
    <Route path="/settings/app/notifications" element={<NotificationSettingsPage />} />
    <Route path="/settings/app/theme" element={<SettingsPage />} />
    <Route path="/settings/app/language" element={<SettingsPage />} />
    <Route path="/settings/app/privacy" element={<SettingsPage />} />
    <Route path="/settings/app/data" element={<SettingsPage />} />
    <Route path="/settings/app/about" element={<SettingsPage />} />

    {/* Legacy / Direct Shortcuts for App Settings */}
    <Route path="/settings/notifications" element={<NotificationSettingsPage />} />
    <Route path="/notifications/settings" element={<NotificationSettingsPage />} />
    <Route path="/settings/theme" element={<SettingsPage />} />
    <Route path="/settings/privacy" element={<SettingsPage />} />
    <Route path="/settings/data" element={<SettingsPage />} />

    {/* ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
        2. MY ACCOUNT SETTINGS PORTAL (Registered Users - AuthGuard)
       ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━ */}
    <Route 
      path="/settings/account" 
      element={
        <AuthGuard>
          <SettingsPage />
        </AuthGuard>
      } 
    />
    <Route 
      path="/settings/account/profile" 
      element={
        <AuthGuard>
          <ProfilePage />
        </AuthGuard>
      } 
    />
    <Route 
      path="/settings/account/security" 
      element={
        <AuthGuard>
          <SettingsPage />
        </AuthGuard>
      } 
    />
    <Route 
      path="/settings/account/addresses" 
      element={
        <AuthGuard>
          <SettingsPage />
        </AuthGuard>
      } 
    />
    <Route 
      path="/settings/account/preferences" 
      element={
        <AuthGuard>
          <SettingsPage />
        </AuthGuard>
      } 
    />
    <Route 
      path="/settings/account/wallet" 
      element={
        <AuthGuard>
          <WalletPage />
        </AuthGuard>
      } 
    />

    {/* ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
        3. MY BUSINESS SETTINGS PORTAL (Registered Sellers - RoleGuard)
       ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━ */}
    <Route 
      path="/settings/business" 
      element={
        <RoleGuard allowedRoles={ALLOWED_BUSINESS_ROLES} redirectTo="/become-seller">
          <SellerCentralPortal />
        </RoleGuard>
      } 
    />
    <Route 
      path="/settings/business/store" 
      element={
        <RoleGuard allowedRoles={ALLOWED_BUSINESS_ROLES} redirectTo="/become-seller">
          <SellerCentralPortal />
        </RoleGuard>
      } 
    />
    <Route 
      path="/settings/business/content" 
      element={
        <RoleGuard allowedRoles={ALLOWED_BUSINESS_ROLES} redirectTo="/become-seller">
          <SellerCentralPortal />
        </RoleGuard>
      } 
    />
    <Route 
      path="/settings/business/analytics" 
      element={
        <RoleGuard allowedRoles={ALLOWED_BUSINESS_ROLES} redirectTo="/become-seller">
          <SellerCentralPortal />
        </RoleGuard>
      } 
    />
    <Route 
      path="/settings/business/payout" 
      element={
        <RoleGuard allowedRoles={ALLOWED_BUSINESS_ROLES} redirectTo="/become-seller">
          <SellerCentralPortal />
        </RoleGuard>
      } 
    />
    <Route 
      path="/settings/business/verification" 
      element={
        <RoleGuard allowedRoles={ALLOWED_BUSINESS_ROLES} redirectTo="/become-seller">
          <SellerCentralPortal />
        </RoleGuard>
      } 
    />
    <Route 
      path="/settings/business/shipping" 
      element={
        <RoleGuard allowedRoles={ALLOWED_BUSINESS_ROLES} redirectTo="/become-seller">
          <SellerCentralPortal />
        </RoleGuard>
      } 
    />
  </>
);
