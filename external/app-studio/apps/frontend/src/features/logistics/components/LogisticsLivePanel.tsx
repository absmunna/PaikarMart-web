import React, { useEffect, useState } from 'react';
import {
  Truck,
  PhoneCall,
  Navigation,
  MapPin,
  CheckCircle2,
  Clock,
  ShieldCheck,
  KeyRound,
  Camera,
  PenTool,
  RotateCcw,
  AlertCircle
} from 'lucide-react';
import { CourierPartner, ShipmentStatus } from '@/features/logistics/types/logisticsTypes';
import { useLogisticsStore } from '@/features/logistics/store/useLogisticsStore';

interface LogisticsLivePanelProps {
  orderId: string;
  deliveryAddress: string;
  isBn?: boolean;
  allowCheckpointUpdate?: boolean;
}

const COURIER_PARTNERS: CourierPartner[] = ['PaikarForce', 'Steadfast', 'Pathao', 'RedX'];

export const LogisticsLivePanel: React.FC<LogisticsLivePanelProps> = ({
  orderId,
  deliveryAddress,
  isBn = false,
  allowCheckpointUpdate = true
}) => {
  const {
    shipments,
    fetchShipment,
    assignCourierPartner,
    advanceShipmentCheckpoint,
    verifyShipmentPod,
    requestReturnPickup
  } = useLogisticsStore();

  const [isUpdating, setIsUpdating] = useState(false);
  const [showPodPad, setShowPodPad] = useState(false);
  const [otpInput, setOtpInput] = useState('');
  const [recipientName, setRecipientName] = useState('');
  const [hasPhotoProof, setHasPhotoProof] = useState(true);
  const [hasSignatureProof, setHasSignatureProof] = useState(true);
  const [podFeedback, setPodFeedback] = useState<{ type: 'ok' | 'err'; text: string } | null>(null);

  const [showReturnForm, setShowReturnForm] = useState(false);
  const [returnReason, setReturnReason] = useState('Item damaged / mismatch during inspection');
  const [returnSuccess, setReturnSuccess] = useState<string | null>(null);

  const shipment = shipments[orderId];

  useEffect(() => {
    void fetchShipment(orderId, deliveryAddress);
  }, [orderId, deliveryAddress, fetchShipment]);

  if (!shipment) {
    return (
      <div className="p-4 rounded-[1.5rem] bg-[var(--pm-surface)] border border-[var(--pm-border)] text-xs text-[var(--pm-muted)]">
        {isBn ? 'কুরিয়ার ট্র্যাকিং তথ্য লোড হচ্ছে...' : 'Loading courier waybill & telemetry...'}
      </div>
    );
  }

  const nextCheckpointMap: Partial<Record<ShipmentStatus, { status: ShipmentStatus; msg: string; loc: string }>> = {
    PENDING: {
      status: 'PICKUP_ASSIGNED',
      msg: 'Courier rider arrived at seller warehouse for pickup',
      loc: shipment.pickupLocation
    },
    PICKUP_ASSIGNED: {
      status: 'IN_TRANSIT',
      msg: 'Parcel scanned & dispatched via central sorting hub',
      loc: 'Tejgaon Sorting Hub, Dhaka'
    },
    IN_TRANSIT: {
      status: 'OUT_FOR_DELIVERY',
      msg: 'Rider left final delivery hub for recipient doorstep',
      loc: 'Last-Mile Zone'
    }
  };

  const nextStep = nextCheckpointMap[shipment.status];

  const handleAdvanceCheckpoint = async () => {
    if (!nextStep) return;
    setIsUpdating(true);
    try {
      await advanceShipmentCheckpoint(orderId, nextStep.status, nextStep.msg, nextStep.loc);
    } finally {
      setIsUpdating(false);
    }
  };

  const handleVerifyPodSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setPodFeedback(null);
    setIsUpdating(true);
    try {
      const res = await verifyShipmentPod(orderId, {
        otp: otpInput,
        recipientName: recipientName.trim() || undefined,
        photoDataUrl: hasPhotoProof ? 'pod://verified-package-photo' : undefined,
        signatureDataUrl: hasSignatureProof ? 'pod://verified-recipient-signature' : undefined
      });
      if (!res.ok) {
        setPodFeedback({ type: 'err', text: res.error || 'OTP mismatch' });
        return;
      }
      setPodFeedback({
        type: 'ok',
        text: isBn
          ? '৩-ধাপ POD ভেরিফিকেশন সম্পন্ন ও এসক্রো রিলিজ হয়েছে।'
          : '3-Step POD verified. Shipment delivered & Escrow notified.'
      });
      setShowPodPad(false);
    } finally {
      setIsUpdating(false);
    }
  };

  const handleReturnSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!returnReason.trim()) return;
    setIsUpdating(true);
    try {
      const rtn = await requestReturnPickup({
        orderId,
        reason: returnReason.trim(),
        pickupAddress: deliveryAddress,
        courierPartner: shipment.courierPartner
      });
      setReturnSuccess(
        isBn
          ? `রিটার্ন পিকআপ বুক হয়েছে (${rtn.returnWaybill})`
          : `Return pickup scheduled (${rtn.returnWaybill})`
      );
      setShowReturnForm(false);
    } finally {
      setIsUpdating(false);
    }
  };

  return (
    <div className="p-4 sm:p-5 rounded-[1.75rem] bg-[var(--pm-surface)] text-[var(--pm-text)] border border-[var(--pm-border)] space-y-4">
      {/* Header & Waybill Metadata (Zero-Pill) */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
        <div>
          <div className="flex items-center gap-2 text-xs font-bold text-[var(--pm-text)]">
            <Navigation className="w-4 h-4 text-[var(--pm-accent)]" />
            <span>{isBn ? 'লাইভ কুরিয়ার ট্র্যাকিং ও ওয়েবিল' : 'Live Courier Waybill & Dispatch'}</span>
          </div>
          <div className="flex flex-wrap items-center gap-2 text-[11px] text-[var(--pm-muted)] font-mono mt-0.5">
            <span className="font-bold text-[var(--pm-text)]">{shipment.trackingNumber}</span>
            <span aria-hidden="true">·</span>
            <span>{shipment.courierPartner}</span>
            <span aria-hidden="true">·</span>
            <span>OTP: {shipment.deliveryOtp}</span>
          </div>
        </div>

        <span className="text-xs font-mono tabular-nums font-bold text-[var(--pm-success)] flex items-center gap-1">
          <ShieldCheck className="w-3.5 h-3.5" />
          <span>{shipment.status.replace(/_/g, ' ')}</span>
        </span>
      </div>

      {/* Courier Partner Segmented Selector */}
      <div className="flex flex-wrap items-center justify-between gap-2">
        <span className="text-[11px] font-semibold text-[var(--pm-muted)]">
          {isBn ? 'কুরিয়ার নেটওয়ার্ক:' : 'Courier Network:'}
        </span>
        <div className="flex items-center gap-1 p-1 rounded-[2rem] bg-[var(--pm-card)] border border-[var(--pm-border)] overflow-x-auto no-scrollbar">
          {COURIER_PARTNERS.map((partner) => (
            <button
              key={partner}
              type="button"
              onClick={() => void assignCourierPartner(orderId, partner)}
              className={`px-3 py-1 rounded-[2rem] text-[11px] font-bold whitespace-nowrap transition-all active-scale cursor-pointer ${
                shipment.courierPartner === partner
                  ? 'bg-[var(--pm-accent)] text-[var(--pm-accent-fg)] shadow-xs'
                  : 'text-[var(--pm-muted)] hover:text-[var(--pm-text)]'
              }`}
            >
              {partner}
            </button>
          ))}
        </div>
      </div>

      {/* 3-Metric Telemetry Strip (Tabular Numerals) */}
      <div className="grid grid-cols-3 gap-2.5">
        <div className="p-3 rounded-[1.25rem] bg-[var(--pm-card)] border border-[var(--pm-border)]">
          <span className="text-[10px] text-[var(--pm-muted)] block">
            {isBn ? 'বাকি দূরত্ব' : 'Distance Left'}
          </span>
          <span className="text-sm font-mono tabular-nums font-black text-[var(--pm-text)] mt-0.5 block">
            {shipment.distanceRemaining}
          </span>
        </div>
        <div className="p-3 rounded-[1.25rem] bg-[var(--pm-card)] border border-[var(--pm-border)]">
          <span className="text-[10px] text-[var(--pm-muted)] block">
            {isBn ? 'সম্ভাব্য সময়' : 'Live ETA'}
          </span>
          <span className="text-sm font-mono tabular-nums font-black text-[var(--pm-accent)] mt-0.5 block">
            {shipment.etaText}
          </span>
        </div>
        <div className="p-3 rounded-[1.25rem] bg-[var(--pm-card)] border border-[var(--pm-border)]">
          <span className="text-[10px] text-[var(--pm-muted)] block">
            {isBn ? 'শিপিং ফি' : 'Courier Tariff'}
          </span>
          <span className="text-sm font-mono tabular-nums font-black text-[var(--pm-text)] mt-0.5 block">
            ৳{shipment.shippingFee.toLocaleString()}
          </span>
        </div>
      </div>

      {/* Assigned Rider Card */}
      <div className="p-3.5 rounded-[1.25rem] bg-[var(--pm-card)] border border-[var(--pm-border)] flex items-center justify-between gap-3">
        <div className="flex items-center gap-3 min-w-0">
          <div className="w-10 h-10 rounded-[1rem] bg-[var(--pm-accent-soft)] text-[var(--pm-accent)] flex items-center justify-center shrink-0 font-black text-sm">
            <Truck className="w-5 h-5" />
          </div>
          <div className="min-w-0">
            <p className="text-xs font-bold text-[var(--pm-text)] truncate">
              {shipment.rider.name}
            </p>
            <p className="text-[11px] text-[var(--pm-muted)] font-mono truncate">
              {shipment.rider.rating}★ · {shipment.rider.tripsCount} trips · {shipment.rider.phone}
            </p>
          </div>
        </div>

        <a
          href={`tel:${shipment.rider.phone}`}
          className="px-3.5 py-2 rounded-[2rem] bg-[var(--pm-accent)] hover:bg-[var(--pm-accent-hover)] text-[var(--pm-accent-fg)] text-xs font-bold flex items-center gap-1.5 whitespace-nowrap shrink-0 active-scale transition-colors"
        >
          <PhoneCall className="w-3.5 h-3.5" />
          <span>{isBn ? 'কল' : 'Call Rider'}</span>
        </a>
      </div>

      {podFeedback && (
        <div
          className={`p-3 rounded-[1.25rem] border text-xs font-bold flex items-center gap-2 ${
            podFeedback.type === 'ok'
              ? 'bg-[var(--pm-success-soft)] border-[var(--pm-success)]/30 text-[var(--pm-success)]'
              : 'bg-[var(--pm-danger-soft)] border-[var(--pm-danger)]/30 text-[var(--pm-danger)]'
          }`}
        >
          {podFeedback.type === 'ok' ? (
            <CheckCircle2 className="w-4 h-4 shrink-0" />
          ) : (
            <AlertCircle className="w-4 h-4 shrink-0" />
          )}
          <span>{podFeedback.text}</span>
        </div>
      )}

      {returnSuccess && (
        <div className="p-3 rounded-[1.25rem] bg-[var(--pm-warning-soft)] border border-[var(--pm-warning)]/30 text-xs font-bold text-[var(--pm-warning)] flex items-center gap-2">
          <RotateCcw className="w-4 h-4 shrink-0" />
          <span>{returnSuccess}</span>
        </div>
      )}

      {/* 3-Step POD Pad (OTP + Photo Proof + Signature) */}
      {showPodPad && shipment.status !== 'DELIVERED' && (
        <form
          onSubmit={(e) => void handleVerifyPodSubmit(e)}
          className="p-4 rounded-[1.5rem] bg-[var(--pm-card)] border border-[var(--pm-success)]/40 space-y-3"
        >
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-[var(--pm-text)] flex items-center gap-1.5">
              <KeyRound className="w-4 h-4 text-[var(--pm-success)]" />
              <span>{isBn ? '৩-ধাপ ডেলিভারি POD যাচাই' : '3-Step POD & Escrow Release'}</span>
            </span>
            <span className="text-[11px] font-mono text-[var(--pm-muted)]">Waybill OTP: {shipment.deliveryOtp}</span>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
            <input
              type="text"
              required
              maxLength={4}
              value={otpInput}
              onChange={(e) => setOtpInput(e.target.value)}
              placeholder={isBn ? '৪-ডিজিট ডেলিভারি OTP লিখুন' : 'Enter 4-digit OTP'}
              className="px-3.5 py-2.5 rounded-xl bg-[var(--pm-input)] text-xs font-mono font-bold text-[var(--pm-text)] placeholder:text-[var(--pm-muted)] border border-[var(--pm-border)] outline-none focus:border-[var(--pm-accent)]"
            />
            <input
              type="text"
              value={recipientName}
              onChange={(e) => setRecipientName(e.target.value)}
              placeholder={isBn ? 'গ্রহীতার নাম (ঐচ্ছিক)' : 'Recipient Name (Optional)'}
              className="px-3.5 py-2.5 rounded-xl bg-[var(--pm-input)] text-xs font-medium text-[var(--pm-text)] placeholder:text-[var(--pm-muted)] border border-[var(--pm-border)] outline-none focus:border-[var(--pm-accent)]"
            />
          </div>

          <div className="flex flex-wrap items-center gap-3 text-xs">
            <label className="flex items-center gap-1.5 cursor-pointer text-[var(--pm-text)]">
              <input
                type="checkbox"
                checked={hasPhotoProof}
                onChange={(e) => setHasPhotoProof(e.target.checked)}
                className="rounded border-[var(--pm-border)] accent-[var(--pm-accent)]"
              />
              <Camera className="w-3.5 h-3.5 text-[var(--pm-accent)]" />
              <span>{isBn ? 'প্যাকেজ ছবি সংযুক্ত' : 'Package Photo Proof'}</span>
            </label>

            <label className="flex items-center gap-1.5 cursor-pointer text-[var(--pm-text)]">
              <input
                type="checkbox"
                checked={hasSignatureProof}
                onChange={(e) => setHasSignatureProof(e.target.checked)}
                className="rounded border-[var(--pm-border)] accent-[var(--pm-success)]"
              />
              <PenTool className="w-3.5 h-3.5 text-[var(--pm-success)]" />
              <span>{isBn ? 'ডিজিটাল স্বাক্ষর সম্পন্ন' : 'Digital Signature Captured'}</span>
            </label>
          </div>

          <div className="flex justify-end gap-2">
            <button
              type="button"
              onClick={() => setShowPodPad(false)}
              className="px-3.5 py-2 rounded-xl text-xs font-bold text-[var(--pm-muted)] hover:bg-[var(--pm-card-hover)] cursor-pointer"
            >
              {isBn ? 'বাতিল' : 'Cancel'}
            </button>
            <button
              type="submit"
              disabled={isUpdating}
              className="px-4 py-2 rounded-xl bg-[var(--pm-success)] hover:opacity-90 text-white text-xs font-bold cursor-pointer active-scale"
            >
              {isBn ? 'POD ও ডেলিভারি নিশ্চিত করুন' : 'Verify OTP & Complete POD'}
            </button>
          </div>
        </form>
      )}

      {/* Reverse Return Request Form */}
      {showReturnForm && (
        <form
          onSubmit={(e) => void handleReturnSubmit(e)}
          className="p-4 rounded-[1.5rem] bg-[var(--pm-card)] border border-[var(--pm-warning)]/40 space-y-3"
        >
          <p className="text-xs font-bold text-[var(--pm-text)] flex items-center gap-1.5">
            <RotateCcw className="w-4 h-4 text-[var(--pm-warning)]" />
            <span>{isBn ? 'রিভার্স কুরিয়ার রিটার্ন রিকোয়েস্ট' : 'Reverse Logistics Return Pickup'}</span>
          </p>
          <input
            type="text"
            required
            value={returnReason}
            onChange={(e) => setReturnReason(e.target.value)}
            placeholder={isBn ? 'রিটার্নের কারণ লিখুন...' : 'Reason for return pickup...'}
            className="w-full px-3.5 py-2.5 rounded-xl bg-[var(--pm-input)] text-xs text-[var(--pm-text)] placeholder:text-[var(--pm-muted)] border border-[var(--pm-border)] outline-none focus:border-[var(--pm-accent)]"
          />
          <div className="flex justify-end gap-2">
            <button
              type="button"
              onClick={() => setShowReturnForm(false)}
              className="px-3.5 py-2 rounded-xl text-xs font-bold text-[var(--pm-muted)] cursor-pointer"
            >
              {isBn ? 'বন্ধ করুন' : 'Cancel'}
            </button>
            <button
              type="submit"
              disabled={isUpdating}
              className="px-4 py-2 rounded-xl bg-amber-600 hover:bg-amber-700 text-white text-xs font-bold cursor-pointer"
            >
              {isBn ? 'পিকআপ শিডিউল করুন' : 'Schedule Return Pickup'}
            </button>
          </div>
        </form>
      )}

      {/* Checkpoint Scan History & Actions */}
      <div className="space-y-2">
        <div className="flex flex-wrap items-center justify-between gap-2">
          <span className="text-[11px] font-bold text-[var(--pm-muted)]">
            {isBn ? 'কুরিয়ার স্ক্যান লগ' : 'Transit Checkpoint Scans'}
          </span>
          <div className="flex items-center gap-2">
            {allowCheckpointUpdate && nextStep && (
              <button
                type="button"
                disabled={isUpdating}
                onClick={() => void handleAdvanceCheckpoint()}
                className="px-3 py-1 rounded-[2rem] bg-[var(--pm-accent)] hover:bg-[var(--pm-accent-hover)] disabled:opacity-50 text-[var(--pm-accent-fg)] text-[11px] font-bold whitespace-nowrap active-scale cursor-pointer transition-colors"
              >
                {isUpdating
                  ? '...'
                  : isBn
                  ? 'পরবর্তী স্ক্যান আপডেট'
                  : `Log: ${nextStep.status.replace(/_/g, ' ')}`}
              </button>
            )}

            {allowCheckpointUpdate && shipment.status !== 'DELIVERED' && (
              <button
                type="button"
                onClick={() => setShowPodPad((v) => !v)}
                className="px-3 py-1 rounded-[2rem] bg-[var(--pm-success)] hover:opacity-90 text-white text-[11px] font-bold whitespace-nowrap active-scale cursor-pointer"
              >
                {isBn ? 'OTP POD যাচাই' : 'Verify POD OTP'}
              </button>
            )}

            {shipment.status === 'DELIVERED' && !showReturnForm && (
              <button
                type="button"
                onClick={() => setShowReturnForm(true)}
                className="px-3 py-1 rounded-[2rem] bg-amber-600 hover:bg-amber-700 text-white text-[11px] font-bold whitespace-nowrap active-scale cursor-pointer"
              >
                {isBn ? 'রিটার্ন পিকআপ' : 'Request Return'}
              </button>
            )}
          </div>
        </div>

        <div className="space-y-2 max-h-44 overflow-y-auto pr-1">
          {shipment.checkpoints.map((cp, index) => (
            <div
              key={cp.id}
              className="p-2.5 rounded-[1rem] bg-[var(--pm-card)] border border-[var(--pm-border)] flex items-start justify-between gap-3"
            >
              <div className="flex items-start gap-2.5 min-w-0">
                <div
                  className={`mt-0.5 shrink-0 ${
                    index === 0 ? 'text-[var(--pm-accent)]' : 'text-[var(--pm-success)]'
                  }`}
                >
                  {index === 0 ? <Clock className="w-3.5 h-3.5" /> : <CheckCircle2 className="w-3.5 h-3.5" />}
                </div>
                <div className="min-w-0">
                  <p className="text-xs font-bold text-[var(--pm-text)] leading-snug">
                    {cp.message}
                  </p>
                  <p className="text-[10px] text-[var(--pm-muted)] flex items-center gap-1 mt-0.5">
                    <MapPin className="w-3 h-3 shrink-0" />
                    <span className="truncate">{cp.location}</span>
                  </p>
                </div>
              </div>
              <span className="text-[10px] font-mono tabular-nums text-[var(--pm-muted)] shrink-0">
                {new Date(cp.time).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
              </span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
