import React, { lazy } from 'react';
import { Route } from 'react-router-dom';
import { AuthGuard } from '@/guards/AuthGuard';

const OrdersPage = lazy(() => import('@/pages/OrdersPage').then(m => ({ default: m.OrdersPage })));
const OrderDetailPage = lazy(() => import('@/portals/orders/pages/OrderDetailPage'));
const WishlistPage = lazy(() => import('@/pages/WishlistPage').then(m => ({ default: m.WishlistPage })));
const HubPage = lazy(() => import('@/pages/HubPage').then(m => ({ default: m.HubPage })));
const SettingsPage = lazy(() => import('@/pages/SettingsPage').then(m => ({ default: m.SettingsPage })));
const NotificationSettingsPage = lazy(() => import('@/modules/notification/pages/NotificationSettingsPage').then(m => ({ default: m.NotificationSettingsPage })));
const WalletPage = lazy(() => import('@/pages/WalletPage').then(m => ({ default: m.WalletPage })));
const VendorsPage = lazy(() => import('@/pages/VendorsPage').then(m => ({ default: m.VendorsPage })));

export const protectedRoutes = (
  <>
    <Route path="/orders" element={<AuthGuard><OrdersPage /></AuthGuard>} />
    <Route path="/user/orders" element={<AuthGuard><OrdersPage /></AuthGuard>} />
    <Route path="/orders/:id" element={<AuthGuard><OrderDetailPage /></AuthGuard>} />
    <Route path="/orders/track/:id" element={<AuthGuard><OrderDetailPage /></AuthGuard>} />
    <Route path="/wishlist" element={<AuthGuard><WishlistPage /></AuthGuard>} />
    <Route path="/user/wishlist" element={<AuthGuard><WishlistPage /></AuthGuard>} />
    <Route path="/portals" element={<HubPage />} />
    <Route path="/settings" element={<SettingsPage />} />
    <Route path="/settings/notifications" element={<NotificationSettingsPage />} />
    <Route path="/notifications/settings" element={<NotificationSettingsPage />} />
    <Route path="/settings/theme" element={<SettingsPage />} />
    <Route path="/settings/privacy" element={<SettingsPage />} />
    <Route path="/settings/data" element={<SettingsPage />} />
    <Route path="/settings/security" element={<SettingsPage />} />
    <Route path="/wallet/*" element={<AuthGuard><WalletPage /></AuthGuard>} />
    <Route path="/vendors" element={<VendorsPage />} />
  </>
);
