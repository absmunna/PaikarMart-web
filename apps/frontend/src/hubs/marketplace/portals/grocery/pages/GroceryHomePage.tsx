import React from 'react';
import { MarketplaceCatalogHome } from '@/hubs/marketplace/portals/shared/MarketplaceCatalogHome';
import type { MarketplacePortalHomeProps } from '@/hubs/marketplace/portals/shared/types';

export const GroceryHomePage: React.FC<MarketplacePortalHomeProps> = (props) => (
  <MarketplaceCatalogHome {...props} portalId="grocery" />
);
