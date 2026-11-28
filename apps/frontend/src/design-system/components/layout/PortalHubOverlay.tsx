import React from 'react';
import { useNavUIStore } from '@/app/AppShell/useNavUIStore';
import { SuperAppHubModal } from './SuperAppHubModal';
import { useAuth } from '@/modules/auth';

/**
 * Global Super App Hub host.
 * BottomNav center button → useNavUIStore.openAppLauncher → this overlay.
 * UI = Version-2 SuperAppHubModal (portal cards, BN copy).
 * Mount once in RootLayout (already done).
 */
export const PortalHubOverlay: React.FC = () => {
  const isAppLauncherOpen = useNavUIStore((s) => s.isAppLauncherOpen);
  const closeAppLauncher = useNavUIStore((s) => s.closeAppLauncher);
  const { isSeller, user } = useAuth();

  const isVendor = Boolean(
    isSeller ||
      (user as { isSeller?: boolean; role?: string } | null)?.isSeller ||
      ['seller', 'vendor', 'admin'].includes(
        String((user as { role?: string } | null)?.role || '').toLowerCase()
      )
  );

  return (
    <SuperAppHubModal
      isOpen={isAppLauncherOpen}
      onClose={closeAppLauncher}
      isVendor={isVendor}
    />
  );
};

export default PortalHubOverlay;
