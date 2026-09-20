import React from 'react';
import { StoryBar } from '@/shared/StoryBar';
import { PortalIconBar } from '@/shared/PortalIconBar';
import { GlassCard } from '@/components/ui/GlassCard';
import { Wallet } from 'lucide-react';

export default function WalletPortal() {
  return (
    <div className="min-h-screen pb-20">
      <StoryBar context="wallet" />
      <PortalIconBar context="wallet" />
      <main className="p-4 space-y-4">
        <GlassCard className="p-6 flex items-center gap-4">
          <Wallet className="w-8 h-8 text-[var(--pm-accent)]" />
          <div>
            <h2 className="text-lg font-bold">My Wallet | আমার ওয়ালেট</h2>
            <p className="text-sm text-muted-foreground mt-1">বর্তমান ব্যালেন্স / Current Balance — নির্মাণাধীন</p>
          </div>
        </GlassCard>
      </main>
    </div>
  );
}
