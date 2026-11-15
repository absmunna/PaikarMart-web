import React from 'react';
import { MarketplacePortal } from '@/portals/marketplace';

type MarketplaceHubProps = React.ComponentProps<typeof MarketplacePortal>;

/**
 * Canonical Marketplace Hub shell.
 * The existing commerce surface supplies the mixed product feed and child portal rail.
 */
export const MarketplaceHub: React.FC<MarketplaceHubProps> = (props) => (
  <div data-hub-id="marketplace" data-feed-mode="mixed">
    <MarketplacePortal {...props} />
  </div>
);
