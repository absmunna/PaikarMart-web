import React from 'react';
import SellerDashboard from './SellerDashboard';
import { VoiceAssistantWidget } from '@modules/ai';

export default function SellerDashboardPage() {
  return (
    <div className="min-h-screen bg-[var(--pm-bg)]">
      <SellerDashboard />
      <VoiceAssistantWidget />
    </div>
  );
}
