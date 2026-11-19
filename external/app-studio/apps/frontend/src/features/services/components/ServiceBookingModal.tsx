import React, { useEffect, useMemo, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { normalizeHandle } from '@paikarmart/shared';
import {
  Clock,
  ShieldCheck,
  ArrowRight,
  MapPin,
  Star,
  UserCheck,
  Wallet,
  Banknote,
  MessageCircle,
  AlertCircle
} from 'lucide-react';
import { CommerceItem, ServiceBooking, ProviderServiceOffer, User } from '@/types';
import { getServiceIcon } from '@/features/services/components/ServiceCard';
import { getProviderOffersForService } from '@/features/marketplace';
import type { ComputedHyperlocalMeta } from '@/features/logistics';

interface ServiceBookingModalProps {
  selectedService: CommerceItem | null;
  onClose: () => void;
  onBookService: (booking: Omit<ServiceBooking, 'id' | 'status'>) => void;
  currentUser?: User;
  onDeductBalance?: (amount: number) => boolean;
  hyperlocalMeta?: ComputedHyperlocalMeta;
}

export const ServiceBookingModal: React.FC<ServiceBookingModalProps> = ({
  selectedService,
  onClose,
  onBookService,
  currentUser,
  onDeductBalance,
  hyperlocalMeta
}) => {
  const navigate = useNavigate();
  const masterServiceId = selectedService?.masterProductId || selectedService?.id || '';
  const providerOffers = useMemo(() => {
    return masterServiceId ? getProviderOffersForService(masterServiceId) : [];
  }, [masterServiceId]);

  const [selectedOffer, setSelectedOffer] = useState<ProviderServiceOffer | null>(null);
  const [payWithWallet, setPayWithWallet] = useState<boolean>(true);
  const [selectedSlot, setSelectedSlot] = useState<string>('Today · 4:00 PM - 6:00 PM');
  const [serviceAddress, setServiceAddress] = useState<string>(currentUser?.location || 'Gulshan-2, Dhaka');
  const [customerPhone, setCustomerPhone] = useState<string>('01700-000000');
  const [notes, setNotes] = useState<string>('');
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  useEffect(() => {
    setSelectedOffer(providerOffers.length > 0 ? providerOffers[0] : null);
    setServiceAddress(currentUser?.location || 'Gulshan-2, Dhaka');
    setErrorMsg(null);
  }, [selectedService?.id, providerOffers, currentUser?.location]);

  if (!selectedService) return null;

  const activeProviderName = selectedOffer ? selectedOffer.providerName : selectedService.storeName;
  const activePrice = selectedOffer ? selectedOffer.baseRate : selectedService.price;
  const discountAmount = payWithWallet ? Math.round(activePrice * 0.05) : 0;
  const finalPayable = Math.max(0, activePrice - discountAmount);
  const etaSummary = hyperlocalMeta
    ? `${hyperlocalMeta.totalEtaMin} min (Prep ${hyperlocalMeta.estimatedPrepMin}m + Transit ${hyperlocalMeta.estimatedTransitMin}m)`
    : selectedOffer?.estimatedArrival || selectedService.serviceDuration || '45-60 min';

  const activeLocation = hyperlocalMeta
    ? `${hyperlocalMeta.distanceKm.toFixed(1)} km away (${hyperlocalMeta.radiusLimitKm}km radar)`
    : selectedOffer
    ? `${selectedOffer.proximityDistance} away (${selectedOffer.serviceRadiusKm}km radius)`
    : `${selectedService.proximityDistance || 'Nearby'} away`;

  const handleConfirmBooking = () => {
    setErrorMsg(null);
    if (payWithWallet && currentUser) {
      if (currentUser.balance < finalPayable) {
        setErrorMsg(
          `Insufficient Wallet Balance (৳${currentUser.balance.toLocaleString()}). Required ৳${finalPayable.toLocaleString()} after 5% discount, or switch to Pay After Visit.`
        );
        return;
      }
      if (onDeductBalance) {
        const ok = onDeductBalance(finalPayable);
        if (!ok) {
          setErrorMsg('Wallet deduction could not be completed. Please try Pay After Visit.');
          return;
        }
      }
    }

    onBookService({
      serviceId: selectedService.id,
      serviceTitle: selectedService.title,
      providerName: activeProviderName,
      customerName: currentUser?.name || 'Verified Member',
      customerPhone,
      serviceAddress,
      date: selectedSlot.startsWith('Today') ? 'Today' : 'Tomorrow',
      timeSlot: selectedSlot,
      depositAmount: payWithWallet ? finalPayable : 0,
      totalEstimate: finalPayable,
      notes: notes || (payWithWallet ? 'Paid Advance via Wallet (5% Discount Applied)' : 'Pay After Service Visit')
    });
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center p-0 sm:p-4 bg-black/70 backdrop-blur-xs animate-fadeIn">
      <div className="bg-[var(--pm-card)] text-[var(--pm-text)] border border-[var(--pm-border)] rounded-t-3xl sm:rounded-3xl w-full max-w-lg p-6 shadow-2xl space-y-5 max-h-[90vh] overflow-y-auto">
        <div className="flex items-start justify-between gap-3">
          <div className="flex gap-3 min-w-0">
            <div className="w-12 h-12 rounded-xl bg-[var(--pm-success-soft)] text-[var(--pm-success)] flex items-center justify-center shrink-0">
              {getServiceIcon(selectedService.subCategory)}
            </div>
            <div className="min-w-0">
              <h2 className="text-lg font-bold text-[var(--pm-text)] truncate">{selectedService.title}</h2>
              <button
                type="button"
                onClick={() => {
                  onClose();
                  navigate(`/u/${normalizeHandle(activeProviderName)}`);
                }}
                className="text-xs text-[var(--pm-accent)] hover:underline font-bold cursor-pointer"
              >
                Visit @{normalizeHandle(activeProviderName)} Profile →
              </button>
            </div>
          </div>
          <button type="button" onClick={onClose} className="p-2 -mr-2 text-[var(--pm-muted)] hover:text-[var(--pm-text)] font-bold cursor-pointer">
            ✕
          </button>
        </div>

        {/* Multi-Provider Selection Section */}
        {providerOffers.length > 0 && (
          <div className="space-y-2.5">
            <h4 className="text-xs font-black text-[var(--pm-muted)] uppercase tracking-wider flex items-center gap-1.5">
              <UserCheck className="w-4 h-4 text-[var(--pm-success)]" />
              <span>Available Local Technicians & Agencies ({providerOffers.length})</span>
            </h4>

            <div className="space-y-2 max-h-40 overflow-y-auto pr-1">
              {providerOffers.map((offer: ProviderServiceOffer) => {
                const isSelected = selectedOffer?.id === offer.id;
                return (
                  <div
                    key={offer.id}
                    onClick={() => setSelectedOffer(offer)}
                    className={`p-3 rounded-2xl border transition-all cursor-pointer flex items-center justify-between gap-3 ${
                      isSelected
                        ? 'bg-[var(--pm-accent-soft)] border-[var(--pm-accent)] shadow-xs'
                        : 'bg-[var(--pm-surface)] border-[var(--pm-border)] hover:border-[var(--pm-accent-border)]'
                    }`}
                  >
                    <div className="flex items-center gap-2.5">
                      <div className={`w-8 h-8 rounded-full flex items-center justify-center font-bold text-xs ${isSelected ? 'bg-[var(--pm-accent)] text-[var(--pm-accent-fg)]' : 'bg-[var(--pm-card)] border border-[var(--pm-border)] text-[var(--pm-text)]'}`}>
                        {offer.providerName[0]}
                      </div>
                      <div>
                        <div className="flex items-center gap-1.5">
                          <h5 className="text-xs font-bold text-[var(--pm-text)]">{offer.providerName}</h5>
                          {offer.verifiedBadge && <ShieldCheck className="w-3 h-3 text-[var(--pm-success)]" />}
                        </div>
                        <div className="flex items-center gap-2 text-[10px] text-[var(--pm-muted)]">
                          <span className="flex items-center gap-0.5 text-amber-500 font-bold"><Star className="w-2.5 h-2.5 fill-amber-500" /> {offer.rating}</span>
                          <span>·</span>
                          <span>{offer.proximityDistance}</span>
                        </div>
                      </div>
                    </div>

                    <div className="text-right">
                      <p className="text-sm font-mono tabular-nums font-black text-[var(--pm-success)]">৳{offer.baseRate.toLocaleString()}</p>
                      <span className="text-[9px] text-[var(--pm-muted)] block">{offer.estimatedArrival}</span>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        )}

        {/* Chosen Provider + ETA Summary */}
        <div className="p-4 rounded-2xl bg-[var(--pm-surface)] border border-[var(--pm-border)] space-y-2.5">
          <div className="flex items-center justify-between border-b border-[var(--pm-border)] pb-2">
            <span className="text-xs font-bold text-[var(--pm-muted)]">Chosen Provider</span>
            <div className="flex items-center gap-2">
              <span className="text-xs font-black text-[var(--pm-text)]">{activeProviderName}</span>
              <button
                type="button"
                onClick={() => {
                  onClose();
                  navigate('/portal/messages');
                }}
                className="text-[11px] font-bold text-[var(--pm-accent)] hover:underline flex items-center gap-1 cursor-pointer"
              >
                <MessageCircle className="w-3 h-3" />
                <span>Chat</span>
              </button>
            </div>
          </div>
          <div className="flex flex-wrap items-center justify-between gap-2 text-xs">
            <span className="flex items-center gap-1 font-bold text-[var(--pm-text)]">
              <Clock className="w-3.5 h-3.5 text-[var(--pm-success)]" /> {etaSummary}
            </span>
            <span className="flex items-center gap-1 font-bold text-[var(--pm-text)]">
              <MapPin className="w-3.5 h-3.5 text-[var(--pm-success)]" /> {activeLocation}
            </span>
          </div>
        </div>

        {/* Service Address, Slot & Phone */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          <div>
            <label className="text-[11px] font-bold text-[var(--pm-muted)] block mb-1">Service Location</label>
            <input
              type="text"
              value={serviceAddress}
              onChange={(e) => setServiceAddress(e.target.value)}
              className="w-full px-3 py-2 rounded-xl bg-[var(--pm-input)] text-xs font-semibold text-[var(--pm-text)] border border-[var(--pm-border)] outline-none focus:border-[var(--pm-accent)]"
            />
          </div>
          <div>
            <label className="text-[11px] font-bold text-[var(--pm-muted)] block mb-1">Time Slot</label>
            <select
              value={selectedSlot}
              onChange={(e) => setSelectedSlot(e.target.value)}
              className="w-full px-3 py-2 rounded-xl bg-[var(--pm-input)] text-xs font-semibold text-[var(--pm-text)] border border-[var(--pm-border)] outline-none focus:border-[var(--pm-accent)]"
            >
              <option value="Today · 4:00 PM - 6:00 PM">Today · 4:00 PM - 6:00 PM</option>
              <option value="Tomorrow · 10:00 AM - 12:00 PM">Tomorrow · 10:00 AM - 12:00 PM</option>
              <option value="Tomorrow · 2:00 PM - 4:00 PM">Tomorrow · 2:00 PM - 4:00 PM</option>
            </select>
          </div>
          <div>
            <label className="text-[11px] font-bold text-[var(--pm-muted)] block mb-1">Contact Phone</label>
            <input
              type="text"
              value={customerPhone}
              onChange={(e) => setCustomerPhone(e.target.value)}
              className="w-full px-3 py-2 rounded-xl bg-[var(--pm-input)] text-xs font-semibold text-[var(--pm-text)] border border-[var(--pm-border)] outline-none focus:border-[var(--pm-accent)]"
            />
          </div>
          <div>
            <label className="text-[11px] font-bold text-[var(--pm-muted)] block mb-1">Instruction Note</label>
            <input
              type="text"
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              placeholder="Gate code / floor..."
              className="w-full px-3 py-2 rounded-xl bg-[var(--pm-input)] text-xs font-semibold text-[var(--pm-text)] placeholder:text-[var(--pm-muted)] border border-[var(--pm-border)] outline-none focus:border-[var(--pm-accent)]"
            />
          </div>
        </div>

        {/* Payment Method with 5% Advance Wallet Discount */}
        <div className="space-y-2">
          <span className="text-xs font-bold text-[var(--pm-muted)] block">Payment Method</span>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
            <button
              type="button"
              onClick={() => setPayWithWallet(true)}
              className={`p-3 rounded-2xl border text-left transition-all cursor-pointer ${
                payWithWallet
                  ? 'bg-[var(--pm-success-soft)] border-[var(--pm-success)]'
                  : 'bg-[var(--pm-surface)] border-[var(--pm-border)] hover:bg-[var(--pm-card-hover)]'
              }`}
            >
              <div className="flex items-center justify-between">
                <Wallet className="w-4 h-4 text-[var(--pm-success)]" />
                <span className="text-[10px] font-black text-[var(--pm-success)]">SAVE 5%</span>
              </div>
              <p className="text-xs font-bold text-[var(--pm-text)] mt-1.5">Advance via Wallet</p>
              <p className="text-[11px] text-[var(--pm-muted)] font-mono tabular-nums">
                Pay ৳{Math.max(0, activePrice - Math.round(activePrice * 0.05)).toLocaleString()} (Bal: ৳{(currentUser?.balance ?? 0).toLocaleString()})
              </p>
            </button>

            <button
              type="button"
              onClick={() => setPayWithWallet(false)}
              className={`p-3 rounded-2xl border text-left transition-all cursor-pointer ${
                !payWithWallet
                  ? 'bg-[var(--pm-accent-soft)] border-[var(--pm-accent)]'
                  : 'bg-[var(--pm-surface)] border-[var(--pm-border)] hover:bg-[var(--pm-card-hover)]'
              }`}
            >
              <div className="flex items-center justify-between">
                <Banknote className="w-4 h-4 text-[var(--pm-accent)]" />
                <span className="text-[10px] font-bold text-[var(--pm-muted)]">STANDARD</span>
              </div>
              <p className="text-xs font-bold text-[var(--pm-text)] mt-1.5">Pay After Service</p>
              <p className="text-[11px] text-[var(--pm-muted)] font-mono tabular-nums">
                Pay ৳{activePrice.toLocaleString()} on completion
              </p>
            </button>
          </div>
        </div>

        {errorMsg && (
          <div className="p-3 rounded-xl bg-[var(--pm-danger-soft)] border border-[var(--pm-danger)]/30 text-[var(--pm-danger)] text-xs font-bold flex items-start gap-2">
            <AlertCircle className="w-4 h-4 shrink-0 mt-0.5" />
            <span>{errorMsg}</span>
          </div>
        )}

        <button
          type="button"
          onClick={handleConfirmBooking}
          className="w-full py-3.5 rounded-2xl bg-[var(--pm-accent)] hover:bg-[var(--pm-accent-hover)] text-[var(--pm-accent-fg)] font-bold text-sm shadow-lg transition-all active:scale-[0.98] flex items-center justify-center gap-2 cursor-pointer"
        >
          <span>
            {payWithWallet
              ? `Pay ৳${finalPayable.toLocaleString()} & Confirm (5% Saved)`
              : `Schedule Visit · ৳${activePrice.toLocaleString()} Due After`}
          </span>
          <ArrowRight className="w-4 h-4" />
        </button>
      </div>
    </div>
  );
};
