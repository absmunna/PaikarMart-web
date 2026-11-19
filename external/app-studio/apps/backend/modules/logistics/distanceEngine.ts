import { HYPERLOCAL_TARIFF_CONFIG } from './tariffConfig.js';

export interface GeoPoint {
  lat: number;
  lng: number;
}

const EARTH_RADIUS_KM = 6371;

function toRadians(deg: number): number {
  return (deg * Math.PI) / 180;
}

/**
 * Great-circle distance between two coordinates using Haversine formula.
 */
export function calculateHaversineKm(a: GeoPoint, b: GeoPoint): number {
  const dLat = toRadians(b.lat - a.lat);
  const dLng = toRadians(b.lng - a.lng);
  const sinLat = Math.sin(dLat / 2);
  const sinLng = Math.sin(dLng / 2);

  const h =
    sinLat * sinLat +
    Math.cos(toRadians(a.lat)) * Math.cos(toRadians(b.lat)) * sinLng * sinLng;

  const distance = 2 * EARTH_RADIUS_KM * Math.asin(Math.min(1, Math.sqrt(h)));
  return Number(distance.toFixed(2));
}

export interface GeofenceEvaluation {
  withinRadius: boolean;
  distanceKm: number;
  radiusLimitKm: number;
  hyperlocalDeliveryFeeBdt: number;
  estimatedPrepMin: number;
  estimatedTransitMin: number;
  totalEtaMin: number;
  reason?: string;
}

/**
 * Evaluates whether buyer coordinates fall inside a store's hyperlocal service radius
 * and computes BDT delivery fee + prep/transit ETA.
 */
export function evaluateStoreGeofence(params: {
  storeLat: number;
  storeLng: number;
  buyerLat: number;
  buyerLng: number;
  serviceRadiusKm?: number;
  prepMinutes?: number;
}): GeofenceEvaluation {
  const rawRadius = Number(params.serviceRadiusKm || HYPERLOCAL_TARIFF_CONFIG.defaultRadiusKm);
  const radiusLimitKm = Math.max(1, Math.min(20, Number.isFinite(rawRadius) ? rawRadius : 5));
  const prepMinutes = Number(params.prepMinutes || 12);

  const distanceKm = calculateHaversineKm(
    { lat: params.storeLat, lng: params.storeLng },
    { lat: params.buyerLat, lng: params.buyerLng }
  );

  const withinRadius = distanceKm <= radiusLimitKm;
  const extraKm = Math.max(0, distanceKm - HYPERLOCAL_TARIFF_CONFIG.includedKm);
  const hyperlocalDeliveryFeeBdt = Math.round(
    HYPERLOCAL_TARIFF_CONFIG.baseFeeBdt + extraKm * HYPERLOCAL_TARIFF_CONFIG.extraPerKmBdt
  );

  const estimatedTransitMin = Math.max(
    HYPERLOCAL_TARIFF_CONFIG.minTransitMinutes,
    Math.ceil(distanceKm * HYPERLOCAL_TARIFF_CONFIG.minutesPerKm)
  );

  return {
    withinRadius,
    distanceKm,
    radiusLimitKm,
    hyperlocalDeliveryFeeBdt,
    estimatedPrepMin: prepMinutes,
    estimatedTransitMin,
    totalEtaMin: prepMinutes + estimatedTransitMin,
    reason: withinRadius
      ? undefined
      : `Destination (${distanceKm} km) exceeds store ${radiusLimitKm} km hyperlocal boundary. Standard courier applies.`
  };
}

export interface HyperlocalProviderInput {
  id: string;
  lat: number;
  lng: number;
  prepMinutes?: number;
  isOpen?: boolean;
}

export interface HyperlocalProviderRankedResult extends GeofenceEvaluation {
  id: string;
  isOpen: boolean;
}

export function rankHyperlocalProviders(params: {
  buyerLat: number;
  buyerLng: number;
  radiusKm?: number;
  providers: HyperlocalProviderInput[];
}): HyperlocalProviderRankedResult[] {
  const rawRadius = Number(params.radiusKm ?? HYPERLOCAL_TARIFF_CONFIG.defaultRadiusKm);
  const clampedRadius = Math.max(1, Math.min(20, Number.isFinite(rawRadius) ? rawRadius : 5));

  return params.providers
    .map((p) => {
      const evalResult = evaluateStoreGeofence({
        storeLat: Number(p.lat),
        storeLng: Number(p.lng),
        buyerLat: Number(params.buyerLat),
        buyerLng: Number(params.buyerLng),
        serviceRadiusKm: clampedRadius,
        prepMinutes: p.prepMinutes ?? 12
      });
      return {
        id: p.id,
        isOpen: p.isOpen ?? true,
        ...evalResult
      };
    })
    .sort((a, b) => a.distanceKm - b.distanceKm);
}
