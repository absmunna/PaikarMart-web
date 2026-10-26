import React from 'react';
import { StoryBar } from '@/shared/StoryBar';
import { PortalIconBar } from '@/shared/PortalIconBar';
import { GlassCard } from '@/components/ui/GlassCard';
import { Briefcase } from 'lucide-react';

export default function BusinessHubPortal() {
  return (
    <div className="min-h-screen pb-20">
      <StoryBar context="business-hub" />
      <PortalIconBar context="business-hub" />
      <main className="p-4 space-y-4">
        <GlassCard className="p-6 flex items-center gap-4">
          <Briefcase className="w-8 h-8 text-[var(--pm-accent)]" />
          <div>
            <h2 className="text-lg font-bold">Business Hub | বিজনেস হাব</h2>
            <p className="text-sm text-muted-foreground mt-1">B2B wholesale & business tools — নির্মাণাধীন</p>
          </div>
        </GlassCard>
      </main>
    </div>
  );
}
