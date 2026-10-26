import React from 'react';
import { StoryBar } from '@/shared/StoryBar';
import { PortalIconBar } from '@/shared/PortalIconBar';
import { GlassCard } from '@/components/ui/GlassCard';
import { Shield } from 'lucide-react';

export default function AdminPortal() {
  return (
    <div className="min-h-screen pb-20">
      <StoryBar context="admin" />
      <PortalIconBar context="admin" />
      <main className="p-4 space-y-4">
        <GlassCard className="p-6 flex items-center gap-4">
          <Shield className="w-8 h-8 text-[var(--pm-accent)]" />
          <div>
            <h2 className="text-lg font-bold">Admin Panel | অ্যাডমিন প্যানেল</h2>
            <p className="text-sm text-muted-foreground mt-1">System management dashboard — নির্মাণাধীন</p>
          </div>
        </GlassCard>
      </main>
    </div>
  );
}
