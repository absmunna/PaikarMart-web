import React from 'react';
import { StoryBar } from '@/shared/StoryBar';
import { PortalIconBar } from '@/shared/PortalIconBar';
import { AdminDashboard } from './pages/dashboards/AdminDashboard';

export default function AdminPortal() {
  return (
    <div className="min-h-screen pb-20 bg-[var(--pm-bg)]">
      <StoryBar context="admin" />
      <PortalIconBar context="admin" />
      <main className="w-full">
        <AdminDashboard />
      </main>
    </div>
  );
}
