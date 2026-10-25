import React from 'react';
import { Route } from 'react-router-dom';
import { AuthGuard } from '@/guards/AuthGuard';

import { OrdersPage } from '@/pages/OrdersPage';
import OrderDetailPage from '@/portals/orders/pages/OrderDetailPage';
import { WishlistPage } from '@/pages/WishlistPage';
import { HubPage } from '@/pages/HubPage';
import { SettingsPage } from '@/pages/SettingsPage';
import { NotificationSettingsPage } from '@/modules/notification/pages/NotificationSettingsPage';
import { WalletPage } from '@/pages/WalletPage';
import { VendorsPage } from '@/pages/VendorsPage';

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
