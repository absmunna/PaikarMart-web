import React from 'react';
import { HomeHeader } from '@/components/home/HomeHeader';
import { PortalIconBar } from '@/shared/PortalIconBar';
import { GlassCard } from '@/components/ui/GlassCard';
import { Wrench } from 'lucide-react';

export default function ServicesHubPortal() {
  return (
    <div className="min-h-screen pb-20 p-4 space-y-6 bg-[var(--pm-bg)]">
      <main className="space-y-4">
        <GlassCard className="p-6 flex items-center gap-4 border-[var(--pm-border)] bg-[var(--pm-surface)]">
          <Wrench className="w-8 h-8 text-[var(--pm-accent)]" />
          <div>
            <h2 className="text-lg font-black text-[var(--pm-text)]">Services Hub | সার্ভিস হাব</h2>
            <p className="text-sm text-[var(--pm-text-muted)] mt-1 font-medium">Home services, bookings & professionals — নির্মাণাধীন</p>
          </div>
        </GlassCard>
      </main>
    </div>
  );
}
