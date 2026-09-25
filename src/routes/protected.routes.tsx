import React from 'react';
import { Route } from 'react-router-dom';
import { AuthGuard } from '../guards/AuthGuard';

import { OrdersPage } from '../pages/OrdersPage';
import { WishlistPage } from '../pages/WishlistPage';
import { HubPage } from '../pages/HubPage';
import { SettingsPage } from '../pages/SettingsPage';
import { WalletPage } from '../pages/WalletPage';
import { VendorsPage } from '../pages/VendorsPage';

export const protectedRoutes = (
  <>
    <Route path="/orders" element={<AuthGuard><OrdersPage /></AuthGuard>} />
    <Route path="/wishlist" element={<AuthGuard><WishlistPage /></AuthGuard>} />
    <Route path="/portals" element={<HubPage />} />
    <Route path="/settings" element={<SettingsPage />} />
    <Route path="/wallet/*" element={<AuthGuard><WalletPage /></AuthGuard>} />
    <Route path="/vendors" element={<VendorsPage />} />
  </>
);
