import React from 'react';
import { StoryBar } from '@/shared/StoryBar';
import { PortalIconBar } from '@/shared/PortalIconBar';
import { GlassCard } from '@/components/ui/GlassCard';
import { Wrench } from 'lucide-react';

export default function ServicesHubPortal() {
  return (
    <div className="min-h-screen pb-20">
      <StoryBar context="services-hub" />
      <PortalIconBar context="services-hub" />
      <main className="p-4 space-y-4">
        <GlassCard className="p-6 flex items-center gap-4">
          <Wrench className="w-8 h-8 text-[var(--pm-accent)]" />
          <div>
            <h2 className="text-lg font-bold">Services Hub | সার্ভিস হাব</h2>
            <p className="text-sm text-muted-foreground mt-1">Home services, bookings & professionals — নির্মাণাধীন</p>
          </div>
        </GlassCard>
      </main>
    </div>
  );
}
