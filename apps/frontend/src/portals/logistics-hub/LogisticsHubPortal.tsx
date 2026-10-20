import React from 'react';
import { StoryBar } from '@/shared/StoryBar';
import { PortalIconBar } from '@/shared/PortalIconBar';
import { GlassCard } from '@/components/ui/GlassCard';
import { Truck } from 'lucide-react';

export default function LogisticsHubPortal() {
  return (
    <div className="min-h-screen pb-20">
      <StoryBar context="logistics-hub" />
      <PortalIconBar context="logistics-hub" />
      <main className="p-4 space-y-4">
        <GlassCard className="p-6 flex items-center gap-4">
          <Truck className="w-8 h-8 text-[var(--pm-accent)]" />
          <div>
            <h2 className="text-lg font-bold">Logistics Hub | লজিস্টিক্স হাব</h2>
            <p className="text-sm text-muted-foreground mt-1">Ride, transport, delivery & fulfillment — নির্মাণাধীন</p>
          </div>
        </GlassCard>
      </main>
    </div>
  );
}
