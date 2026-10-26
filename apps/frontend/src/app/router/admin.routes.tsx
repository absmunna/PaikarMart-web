import React from 'react';
import { Route } from 'react-router-dom';
import { RoleGuard } from '@/guards/RoleGuard';

import SellerDashboard from '@/portals/seller-central/pages/SellerDashboard';
import { AdminDashboard } from '@/portals/admin/pages/dashboards/AdminDashboard';
import { ModeratorDashboard } from '@/portals/admin/pages/dashboards/ModeratorDashboard';

export const adminRoutes = (
  <>
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
  </>
);
