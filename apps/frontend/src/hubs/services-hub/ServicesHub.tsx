import React from 'react';
import { ServicesMixedFeed } from '@/hubs/services-hub/ServicesMixedFeed';

type ServicesHubProps = React.ComponentProps<typeof ServicesMixedFeed>;

/**
 * Canonical Services Hub shell.
 * Hosts the hub-level mixed feed inside `hubs/services-hub/` and delegates
 * grouped child portals (`local-services`, `food-delivery`, `travel`)
 * from `portals/services/`.
 */
export const ServicesHub: React.FC<ServicesHubProps> = (props) => (
  <div data-hub-id="services" data-feed-mode="mixed">
    <ServicesMixedFeed {...props} />
  </div>
);
