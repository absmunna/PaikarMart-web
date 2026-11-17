import React from 'react';
import { MarketplaceHubPage } from '@/hubs/marketplace/pages/MarketplaceHubPage';

type MarketplaceHubProps = React.ComponentProps<typeof MarketplaceHubPage>;

/**
 * Canonical Marketplace Hub shell.
 * The existing commerce surface supplies the mixed product feed and child portal rail.
 */
export const MarketplaceHub: React.FC<MarketplaceHubProps> = (props) => (
  <div data-hub-id="marketplace" data-feed-mode="mixed">
    <MarketplaceHubPage {...props} />
  </div>
);
