import type { HubId, HubPortalDefinition } from '@/hubs/shared/hubTypes';
import { marketplacePortals } from '@/hubs/marketplace-hub/config/marketplacePortals';
import { servicePortals } from '@/hubs/services-hub/config/servicePortals';
import { communityPortals } from '@/hubs/community-hub/config/communityPortals';
import { utilityPortals } from '@/hubs/utility-hub/config/utilityPortals';

export { marketplacePortals, servicePortals, communityPortals, utilityPortals };

export const HUB_METADATA: Record<HubId, { labelEn: string; labelBn: string; entryRoute: string }> = {
  marketplace: {
    labelEn: 'Marketplace Hub',
    labelBn: 'মার্কেটপ্লেস হাব',
    entryRoute: '/hub/marketplace',
  },
  services: {
    labelEn: 'Services Hub',
    labelBn: 'সার্ভিসেস হাব',
    entryRoute: '/hub/services',
  },
  community: {
    labelEn: 'Community Hub',
    labelBn: 'কমিউনিটি হাব',
    entryRoute: '/hub/community',
  },
  utility: {
    labelEn: 'Utility Hub',
    labelBn: 'ইউটিলিটি হাব',
    entryRoute: '/hub/utility',
  },
};

export const PORTAL_REGISTRY: HubPortalDefinition[] = [
  ...marketplacePortals,
  ...servicePortals,
  ...communityPortals,
  ...utilityPortals,
].sort((a, b) => a.order - b.order);

export function getPortalsForHub(hubId: HubId): HubPortalDefinition[] {
  return PORTAL_REGISTRY.filter((portal) => portal.enabled && portal.hubId === hubId);
}

export function findRegisteredPortal(portalId: string): HubPortalDefinition | undefined {
  return PORTAL_REGISTRY.find((portal) => portal.enabled && portal.id === portalId);
}
