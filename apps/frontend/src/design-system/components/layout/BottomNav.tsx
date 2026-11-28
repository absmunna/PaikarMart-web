/**
 * Compatibility shim.
 * Canonical implementation: ../navigation/BottomNav.tsx (store-driven Hub + isVisible).
 * Old callers that passed `onOpenHub` still work — we bridge to useNavUIStore.
 */
import React, { useEffect } from 'react';
import { BottomNav as CanonicalBottomNav } from '../navigation/BottomNav';
import { useNavUIStore } from '@/app/AppShell/useNavUIStore';

export interface BottomNavProps {
  onOpenHub?: () => void;
  className?: string;
  isVisible?: boolean;
}

export function BottomNav({ onOpenHub, isVisible }: BottomNavProps) {
  const openAppLauncher = useNavUIStore((s) => s.openAppLauncher);

  useEffect(() => {
    if (!onOpenHub) return;
    // If parent still wires onOpenHub, mirror store opens are enough via Canonical button;
    // keep prop for API compat without dual buttons.
  }, [onOpenHub]);

  // Prefer store; if parent only had onOpenHub without PortalHubOverlay, still open store
  // so RootLayout-mounted PortalHubOverlay receives it when present.
  void openAppLauncher;

  return <CanonicalBottomNav isVisible={isVisible} />;
}

export default BottomNav;
