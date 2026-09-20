import React from 'react';
import { StoryBar } from '@/shared/StoryBar';
import { PortalIconBar } from '@/shared/PortalIconBar';
import { GlassCard } from '@/components/ui/GlassCard';
import { Users } from 'lucide-react';

export default function CommunityHubPortal() {
  return (
    <div className="min-h-screen pb-20">
      <StoryBar context="community-hub" />
      <PortalIconBar context="community-hub" />
      <main className="p-4 space-y-4">
        <GlassCard className="p-6 flex items-center gap-4">
          <Users className="w-8 h-8 text-[var(--pm-accent)]" />
          <div>
            <h2 className="text-lg font-bold">Community Hub | কমিউনিটি হাব</h2>
            <p className="text-sm text-muted-foreground mt-1">Groups, forums & local community — নির্মাণাধীন</p>
          </div>
        </GlassCard>
      </main>
    </div>
  );
}
