import crypto from 'crypto';
import type { CourierPartner, ShipmentRecord, ShipmentStatus } from './logisticsService.js';

const PARTNER_ALIAS_MAP: Record<string, CourierPartner> = {
  paikarforce: 'PaikarForce',
  paikar_force: 'PaikarForce',
  steadfast: 'Steadfast',
  pathao: 'Pathao',
  redx: 'RedX',
};

export function normalizeCourierPartner(raw?: string): CourierPartner | null {
  if (!raw) return null;
  const key = raw.trim().toLowerCase().replace(/[\s-]+/g, '_');
  return PARTNER_ALIAS_MAP[key] || null;
}

export function mapPartnerStatusToShipmentStatus(
  partner: CourierPartner,
  rawStatus?: string
): ShipmentStatus {
  const normalized = String(rawStatus || '').trim().toLowerCase().replace(/[\s-]+/g, '_');

  const commonMap: Record<string, ShipmentStatus> = {
    pending: 'PENDING',
    created: 'PENDING',
    in_review: 'PICKUP_ASSIGNED',
    pickup_requested: 'PICKUP_ASSIGNED',
    pickup_pending: 'PICKUP_ASSIGNED',
    ready_for_pickup: 'PICKUP_ASSIGNED',
    assigned_for_pickup: 'PICKUP_ASSIGNED',
    picked: 'IN_TRANSIT',
    picked_up: 'IN_TRANSIT',
    in_transit: 'IN_TRANSIT',
    hold: 'IN_TRANSIT',
    agent_hold: 'IN_TRANSIT',
    at_sorting_hub: 'IN_TRANSIT',
    at_the_sorting_hub: 'IN_TRANSIT',
    out_for_delivery: 'OUT_FOR_DELIVERY',
    delivering: 'OUT_FOR_DELIVERY',
    delivery_in_progress: 'OUT_FOR_DELIVERY',
    assigned_for_delivery: 'OUT_FOR_DELIVERY',
    on_the_way_to_delivery: 'OUT_FOR_DELIVERY',
    delivered: 'DELIVERED',
    partial_delivered: 'DELIVERED',
    delivered_approval_pending: 'DELIVERED',
    return: 'RETURN_REQUESTED',
    returned: 'RETURN_REQUESTED',
    return_requested: 'RETURN_REQUESTED',
    agent_returning: 'RETURN_REQUESTED',
    cancelled: 'CANCELLED',
    canceled: 'CANCELLED',
  };

  if (normalized in commonMap) {
    return commonMap[normalized];
  }

  // Partner-specific fallback heuristics
  if (partner === 'Steadfast' && normalized.includes('approval_pending')) {
    return 'IN_TRANSIT';
  }
  if (partner === 'Pathao' && normalized.includes('pickup')) {
    return 'PICKUP_ASSIGNED';
  }
  if (partner === 'RedX' && normalized.includes('delivery')) {
    return 'OUT_FOR_DELIVERY';
  }

  return 'IN_TRANSIT';
}

export function buildOutboundCourierPayload(shipment: ShipmentRecord) {
  switch (shipment.courierPartner) {
    case 'Steadfast':
      return {
        invoice: shipment.orderId,
        recipient_address: shipment.dropLocation,
        cod_amount: shipment.shippingFee,
        note: `PaikarMart Waybill ${shipment.trackingNumber}`,
      };
    case 'Pathao':
      return {
        merchant_order_id: shipment.orderId,
        recipient_address: shipment.dropLocation,
        item_type: 2,
        delivery_type: 48,
        special_instruction: `OTP Verification Required · ${shipment.trackingNumber}`,
      };
    case 'RedX':
      return {
        merchant_invoice_id: shipment.orderId,
        customer_address: shipment.dropLocation,
        parcel_weight: 1000,
        instruction: `Waybill ${shipment.trackingNumber}`,
      };
    case 'PaikarForce':
    default:
      return {
        orderId: shipment.orderId,
        trackingNumber: shipment.trackingNumber,
        pickupLocation: shipment.pickupLocation,
        dropLocation: shipment.dropLocation,
        shippingFee: shipment.shippingFee,
      };
  }
}

export function timingSafeEqualStrings(a: string, b: string): boolean {
  const bufA = Buffer.from(a, 'utf8');
  const bufB = Buffer.from(b, 'utf8');
  if (bufA.length !== bufB.length) return false;
  return crypto.timingSafeEqual(bufA, bufB);
}

export function verifyWebhookSignature(params: {
  rawBody?: Buffer | string;
  bodyFallback?: unknown;
  providedSignature?: string;
  providedSecretHeader?: string;
  authorizationHeader?: string;
  secret: string;
}): boolean {
  const {
    rawBody,
    bodyFallback,
    providedSignature,
    providedSecretHeader,
    authorizationHeader,
    secret,
  } = params;

  if (!secret) return false;

  if (providedSignature) {
    const cleanSig = providedSignature.trim().replace(/^sha256=/i, '');
    const payloadBuffer =
      typeof rawBody === 'string'
        ? Buffer.from(rawBody, 'utf8')
        : Buffer.isBuffer(rawBody)
          ? rawBody
          : Buffer.from(JSON.stringify(bodyFallback ?? {}), 'utf8');
    const expectedHmac = crypto
      .createHmac('sha256', secret)
      .update(payloadBuffer)
      .digest('hex');

    if (/^[0-9a-f]{64}$/i.test(cleanSig)) {
      return timingSafeEqualStrings(cleanSig.toLowerCase(), expectedHmac.toLowerCase());
    }
  }

  if (providedSecretHeader && timingSafeEqualStrings(providedSecretHeader.trim(), secret)) {
    return true;
  }

  if (authorizationHeader) {
    const match = authorizationHeader.match(/^Bearer\s+(.+)$/i);
    if (match && timingSafeEqualStrings(match[1].trim(), secret)) {
      return true;
    }
  }

  return false;
}
