import React from 'react';
import { UtilityMixedFeed } from '@/hubs/utility-hub/UtilityMixedFeed';

type UtilityHubProps = React.ComponentProps<typeof UtilityMixedFeed>;

/**
 * Canonical Utility Hub shell.
 * Hosts the utility cockpit across Orders, Wallet, Seller Central, Profile, Notifications, Settings, and Guide.
 */
export const UtilityHub: React.FC<UtilityHubProps> = (props) => (
  <div data-hub-id="utility" data-feed-mode="mixed">
    <UtilityMixedFeed {...props} />
  </div>
);
