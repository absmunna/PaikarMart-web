import React from 'react';
import { SmartSellerWizard } from '@/features/registration/SmartSellerWizard';
import { StoryBar } from '@shared/StoryBar';
import { PortalIconBar } from '@shared/PortalIconBar';

export default function BecomeSellerPage() {
  return (
    <div className="w-full min-h-screen bg-black text-[var(--pm-text)] flex flex-col">
      
      {/* 1. MANDATORY STORY BAR */}
      <section className="pt-2 px-4 md:px-6">
        <StoryBar context="seller" />
      </section>

      {/* 2. MANDATORY STICKY PORTAL BAR */}
      <div className="sticky top-16 z-40 bg-black/90 backdrop-blur-lg border-b border-[var(--pm-border)]/50 px-4 md:px-6 mt-2">
        <PortalIconBar context="seller" />
      </div>

      <div className="flex-1 w-full">
        <SmartSellerWizard />
      </div>
    </div>
  );
}
