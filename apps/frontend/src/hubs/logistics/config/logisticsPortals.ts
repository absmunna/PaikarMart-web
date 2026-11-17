export type LogisticsPortalId = 'ride' | 'courier' | 'cargo' | 'fleet';

export interface LogisticsPortalDefinition {
  id: LogisticsPortalId;
  label: string;
  iconName: 'bike' | 'package' | 'truck' | 'shield';
}

export const logisticsPortals: LogisticsPortalDefinition[] = [
  { id: 'ride', label: 'Instant Ride', iconName: 'bike' },
  { id: 'courier', label: 'Parcel & Waybill', iconName: 'package' },
  { id: 'cargo', label: 'Cargo & Rentals', iconName: 'truck' },
  { id: 'fleet', label: 'Fleet Console', iconName: 'shield' },
];
