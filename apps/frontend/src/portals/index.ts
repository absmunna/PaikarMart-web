/**
 * PaikarMart Central Portal & Hub Registry
 * 
 * Re-exports the standardized 4 core pillars (Commerce, Services, Community, Utility)
 * and their specialized sub-portals.
 */

export { 
  HUB_REGISTRY, 
  PORTAL_REGISTRY, 
  ICON_COMPONENTS_MAP,
  type PortalHub, 
  type PortalItem 
} from "@/core/config/portals.config";

export { usePortalStore, type PortalType } from "./usePortalStore";

import { PORTAL_REGISTRY } from "@/core/config/portals.config";

/**
 * Backward compatibility for components expecting ALL_PORTALS
 */
export const ALL_PORTALS = PORTAL_REGISTRY.map(p => ({
  id: p.id,
  hubId: p.hubId,
  label: p.nameEn,
  labelBn: p.nameBn,
  path: p.route,
  icon: p.iconName,
  roles: [] as string[]
}));

export type PortalId = typeof ALL_PORTALS[number]["id"];
export { LOCAL_HUB_PORTAL } from "./local-hub";
