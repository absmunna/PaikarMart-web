import React from 'react';
import { StoryBar } from '@/shared/StoryBar';
import { PortalIconBar } from '@/shared/PortalIconBar';
import { GlassCard } from '@/components/ui/GlassCard';
import { MapPin } from 'lucide-react';

export default function LocalHubPortal() {
  return (
    <div className="min-h-screen pb-20">
      <StoryBar context="local-hub" />
      <PortalIconBar context="local-hub" />
      <main className="p-4 space-y-4">
        <GlassCard className="p-6 flex items-center gap-4">
          <MapPin className="w-8 h-8 text-[var(--pm-accent)]" />
          <div>
            <h2 className="text-lg font-bold">Local Hub | লোকাল হাব</h2>
            <p className="text-sm text-muted-foreground mt-1">Local marketplace & nearby services — নির্মাণাধীন</p>
          </div>
        </GlassCard>
      </main>
    </div>
  );
}
