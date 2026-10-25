import React from 'react';
import { Route } from 'react-router-dom';
import { AuthGuard } from '@/guards/AuthGuard';
import { RoleGuard } from '@/guards/RoleGuard';

import { SettingsPage } from '@/pages/SettingsPage';
import { NotificationSettingsPage } from '@/modules/notification/pages/NotificationSettingsPage';
import { ProfilePage } from '@/modules/profile';
import { WalletPage } from '@/pages/WalletPage';
import { SellerCentralPortal } from '@/portals/seller-central/SellerCentralPortal';
import BecomeSellerPage from '@/portals/seller-central/pages/BecomeSellerPage';

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
