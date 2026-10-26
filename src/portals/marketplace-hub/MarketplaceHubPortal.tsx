import React from 'react';
import { StoryBar } from '@/shared/StoryBar';
import { PortalIconBar } from '@/shared/PortalIconBar';
import { GlassCard } from '@/components/ui/GlassCard';
import { ShoppingBag } from 'lucide-react';

export default function MarketplaceHubPortal() {
  return (
    <div className="min-h-screen pb-20">
      <StoryBar context="marketplace-hub" />
      <PortalIconBar context="marketplace-hub" />
      <main className="p-4 space-y-4">
        <GlassCard className="p-6 flex items-center gap-4">
          <ShoppingBag className="w-8 h-8 text-[var(--pm-accent)]" />
          <div>
            <h2 className="text-lg font-bold">Marketplace | মার্কেটপ্লেস</h2>
            <p className="text-sm text-muted-foreground mt-1">Buy & sell products — নির্মাণাধীন</p>
          </div>
        </GlassCard>
      </main>
    </div>
  );
}
