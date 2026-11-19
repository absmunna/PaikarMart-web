export type HubId = 'marketplace' | 'services' | 'community' | 'utility';

export type HubFeedCardKind =
  | 'product'
  | 'service'
  | 'demand'
  | 'offer'
  | 'seller'
  | 'provider'
  | 'ride'
  | 'logistics'
  | 'post'
  | 'creator';

export interface HubPortalDefinition {
  id: string;
  hubId: HubId;
  labelEn: string;
  labelBn: string;
  entryRoute: string;
  iconName: string;
  feedKinds: HubFeedCardKind[];
  categories: Array<{
    id: string;
    labelEn: string;
    labelBn: string;
    filterKey: string;
  }>;
  enabled: boolean;
  order: number;
}
