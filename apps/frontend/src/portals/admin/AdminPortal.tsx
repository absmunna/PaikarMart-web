import React from 'react';
import { PortalIconBar } from '@/shared/PortalIconBar';
import { AdminDashboard } from './pages/dashboards/AdminDashboard';

export default function AdminPortal() {
  return (
    <div className="min-h-screen pb-20 bg-[var(--pm-bg)]">
      <PortalIconBar context="admin" />
      <main className="w-full">
        <AdminDashboard />
      </main>
    </div>
  );
}
