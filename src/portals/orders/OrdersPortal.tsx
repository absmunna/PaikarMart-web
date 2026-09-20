import React from 'react';
import { StoryBar } from '@/shared/StoryBar';
import { PortalIconBar } from '@/shared/PortalIconBar';
import { GlassCard } from '@/components/ui/GlassCard';
import { Package } from 'lucide-react';

export default function OrdersPortal() {
  return (
    <div className="min-h-screen pb-20">
      <StoryBar context="orders" />
      <PortalIconBar context="orders" />
      <main className="p-4 space-y-4">
        <GlassCard className="p-6 flex items-center gap-4">
          <Package className="w-8 h-8 text-[var(--pm-accent)]" />
          <div>
            <h2 className="text-lg font-bold">Orders | অর্ডার</h2>
            <p className="text-sm text-muted-foreground mt-1">List of all orders — নির্মাণাধীন</p>
          </div>
        </GlassCard>
      </main>
    </div>
  );
}
