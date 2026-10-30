import React, { lazy } from 'react';
import { Route } from 'react-router-dom';
import { RoleGuard } from '@/guards/RoleGuard';

const SellerDashboard = lazy(() => import('@/portals/seller-central/pages/SellerDashboard'));
const AdminDashboard = lazy(() => import('@/portals/admin/pages/dashboards/AdminDashboard').then(m => ({ default: m.AdminDashboard })));
const ModeratorDashboard = lazy(() => import('@/portals/admin/pages/dashboards/ModeratorDashboard').then(m => ({ default: m.ModeratorDashboard })));

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
      path="/admin" 
      element={
        <RoleGuard allowedRoles={['admin', 'super_admin']}>
          <AdminDashboard />
        </RoleGuard>
      } 
    />
    <Route 
      path="/admin/*" 
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
