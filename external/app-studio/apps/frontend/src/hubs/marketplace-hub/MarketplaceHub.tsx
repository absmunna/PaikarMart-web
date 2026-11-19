import React from 'react';
import { MarketplaceMixedFeed } from '@/hubs/marketplace-hub/MarketplaceMixedFeed';

type MarketplaceHubProps = React.ComponentProps<typeof MarketplaceMixedFeed>;

/**
 * Canonical Marketplace Hub shell.
 * Hosts the hub-level mixed feed inside `hubs/marketplace-hub/` and delegates
 * grouped child portals (`retail`, `wholesale`, `grocery`, `pharmacy`, `brand-shops`, `digital`)
 * from `portals/marketplaces/`.
 */
export const MarketplaceHub: React.FC<MarketplaceHubProps> = (props) => (
  <div data-hub-id="marketplace" data-feed-mode="mixed">
    <MarketplaceMixedFeed {...props} />
  </div>
);
