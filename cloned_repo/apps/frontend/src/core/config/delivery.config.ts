/**
 * Delivery provider configuration. Modular & ready to activate.
 */
export type DeliveryProviderId =
  | "self_pickup"
  | "platform_courier"
  | "pathao"
  | "redx"
  | "steadfast"
  | "dhl"
  | "fedex";

export interface DeliveryProviderConfig {
  id: DeliveryProviderId;
  label: string;
  region: "global" | "local";
  enabled: boolean;
  baseFee: number;
  perKgFee: number;
  estDays: [number, number];
}

export const DELIVERY_PROVIDERS: DeliveryProviderConfig[] = [
  { id: "self_pickup",      label: "Self Pickup",       region: "local",  enabled: true,  baseFee: 0,  perKgFee: 0,  estDays: [0, 1] },
  { id: "platform_courier", label: "PaikarMart Courier", region: "local", enabled: false, baseFee: 60, perKgFee: 20, estDays: [1, 3] },
  { id: "pathao",           label: "Pathao",            region: "local",  enabled: false, baseFee: 70, perKgFee: 25, estDays: [1, 2] },
  { id: "redx",             label: "RedX",              region: "local",  enabled: false, baseFee: 60, perKgFee: 20, estDays: [1, 3] },
  { id: "steadfast",        label: "Steadfast",         region: "local",  enabled: false, baseFee: 65, perKgFee: 22, estDays: [1, 3] },
  { id: "dhl",              label: "DHL",               region: "global", enabled: false, baseFee: 25, perKgFee: 10, estDays: [3, 7] },
  { id: "fedex",            label: "FedEx",             region: "global", enabled: false, baseFee: 28, perKgFee: 12, estDays: [3, 7] },
];

export function getEnabledDeliveryProviders() {
  return DELIVERY_PROVIDERS.filter((p) => p.enabled);
}
