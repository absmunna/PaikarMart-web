import React from 'react';
import { StoryBar } from '@/shared/StoryBar';
import { PortalIconBar } from '@/shared/PortalIconBar';
import { GlassCard } from '@/components/ui/GlassCard';
import { MessageCircle } from 'lucide-react';

export default function MessagesPortal() {
  return (
    <div className="min-h-screen pb-20">
      <StoryBar context="messages" />
      <PortalIconBar context="messages" />
      <main className="p-4 space-y-4">
        <GlassCard className="p-6 flex items-center gap-4">
          <MessageCircle className="w-8 h-8 text-[var(--pm-accent)]" />
          <div>
            <h2 className="text-lg font-bold">Messages & AI Chat | মেসেজ ও AI চ্যাট</h2>
            <p className="text-sm text-muted-foreground mt-1">Buyer-seller chat + Aloop AI assistant — নির্মাণাধীন</p>
          </div>
        </GlassCard>
      </main>
    </div>
  );
}
