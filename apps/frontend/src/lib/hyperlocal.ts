import { CommerceItem } from '@/types';
import type { GeofenceEvaluation } from '@/features/logistics/types/logisticsTypes';

const EARTH_RADIUS_KM = 6371;

function toRad(deg: number): number {
  return (deg * Math.PI) / 180;
}

export function computeClientHaversineKm(
  a: { lat: number; lng: number },
  b: { lat: number; lng: number }
): number {
  const dLat = toRad(b.lat - a.lat);
  const dLng = toRad(b.lng - a.lng);
  const h =
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos(toRad(a.lat)) * Math.cos(toRad(b.lat)) * Math.sin(dLng / 2) * Math.sin(dLng / 2);
  return Number((2 * EARTH_RADIUS_KM * Math.asin(Math.min(1, Math.sqrt(h)))).toFixed(2));
}

/**
 * Resolves deterministic coordinates around buyer's active GPS hub when an item
 * doesn't carry explicit lat/lng yet (preserves mock proximityDistance feel).
 */
export function resolveItemCoordinates(
  item: CommerceItem,
  buyerCoords: { lat: number; lng: number },
  index: number
): { lat: number; lng: number } {
  if (item.coordinates) return item.coordinates;
  const parsedKm = item.proximityDistance ? parseFloat(item.proximityDistance) : NaN;
  const baseKm = Number.isFinite(parsedKm) ? parsedKm : 0.7 + (index % 7) * 0.9;
  const angle = ((index * 137.5) % 360) * (Math.PI / 180);
  const dLat = (baseKm / 111.32) * Math.cos(angle);
  const dLng = (baseKm / (111.32 * Math.cos(toRad(buyerCoords.lat)) || 1)) * Math.sin(angle);
  return {
    lat: Number((buyerCoords.lat + dLat).toFixed(5)),
    lng: Number((buyerCoords.lng + dLng).toFixed(5))
  };
}

export interface ComputedHyperlocalMeta extends GeofenceEvaluation {
  id: string;
  isOpen: boolean;
  openingHoursLabel: string;
  coordinates: { lat: number; lng: number };
}

export function computeLocalGeofenceMeta(
  item: CommerceItem,
  buyerCoords: { lat: number; lng: number },
  radiusKm: number,
  index: number
): ComputedHyperlocalMeta {
  const coords = resolveItemCoordinates(item, buyerCoords, index);
  const distanceKm = computeClientHaversineKm(buyerCoords, coords);
  const clampedRadius = Math.max(1, Math.min(20, radiusKm));
  const prepMinutes = item.prepMinutes ?? (item.type === 'service' ? 15 : 10);
  const transitMinutes = Math.max(8, Math.ceil(distanceKm * 4));
  const extraKm = Math.max(0, distanceKm - 2);
  const deliveryFee = Math.round(40 + extraKm * 12);

  return {
    id: item.id,
    coordinates: coords,
    distanceKm,
    withinRadius: distanceKm <= clampedRadius,
    radiusLimitKm: clampedRadius,
    hyperlocalDeliveryFeeBdt: deliveryFee,
    estimatedPrepMin: prepMinutes,
    estimatedTransitMin: transitMinutes,
    totalEtaMin: prepMinutes + transitMinutes,
    isOpen: item.isOpen ?? true,
    openingHoursLabel: item.openingHoursLabel || '9:00 AM – 10:00 PM'
  };
}
