import React, { useState } from 'react';
import {
  VendorProfile,
  BusinessRole,
  BusinessDocument,
  PayoutAccount,
  SellerTier
} from '@/types';
import { SELLER_TIER_DEFINITIONS } from '@paikarmart/shared';
import { vendorApiClient } from '@/features/vendors';
import {
  X,
  Store,
  ShoppingBag,
  Package,
  Wrench,
  Truck,
  Video,
  CheckCircle2,
  ShieldCheck,
  ChevronRight,
  ChevronLeft,
  AlertCircle
} from 'lucide-react';
import { useLanguage } from '@/contexts/LanguageContext';

interface MultiRoleOnboardingModalProps {
  isOpen: boolean;
  onClose: () => void;
  applicantId?: string;
  onCompleteOnboarding: (profile: VendorProfile) => void;
}

export const MultiRoleOnboardingModal: React.FC<MultiRoleOnboardingModalProps> = ({
  isOpen,
  onClose,
  applicantId = 'user_me',
  onCompleteOnboarding
}) => {
  const { language } = useLanguage();
  const isBn = language === 'bn';

  const [step, setStep] = useState<1 | 2 | 3 | 4 | 5>(1);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  // Step 1: Identity & 7-Tier Hierarchy
  const [storeName, setStoreName] = useState('');
  const [legalEntityName, setLegalEntityName] = useState('');
  const [sellerTier, setSellerTier] = useState<SellerTier>('retail_seller');
  const [storeLocation, setStoreLocation] = useState('Dhaka Central Commercial Hub');

  // Step 2: Business Capabilities (Multi-Select)
  const [selectedRoles, setSelectedRoles] = useState<BusinessRole[]>([
    'retail_merchant',
    'wholesale_supplier'
  ]);

  // Step 3: Legal Verification (NID, Trade License, e-TIN)
  const [nidNumber, setNidNumber] = useState('');
  const [businessRegNumber, setBusinessRegNumber] = useState('');
  const [tinNumber, setTinNumber] = useState('');
  const [tradeLicenseFileName, setTradeLicenseFileName] = useState('Trade_License_2026.pdf');
  const [nidFileName, setNidFileName] = useState('NID_Verification_Scan.jpg');

  // Step 4: Payout Settlement Method
  const [payoutType, setPayoutType] = useState<PayoutAccount['type']>('bKash Merchant');
  const [payoutAccountNumber, setPayoutAccountNumber] = useState('');
  const [routingNumber, setRoutingNumber] = useState('');

  if (!isOpen) return null;

  const selectedTierMeta =
    SELLER_TIER_DEFINITIONS.find((t) => t.tier === sellerTier) || SELLER_TIER_DEFINITIONS[0];

  const toggleRole = (role: BusinessRole) => {
    if (selectedRoles.includes(role)) {
      if (selectedRoles.length === 1) return;
      setSelectedRoles(selectedRoles.filter((r) => r !== role));
    } else {
      setSelectedRoles([...selectedRoles, role]);
    }
  };

  const handleNext = () => {
    setErrorMsg(null);
    if (step === 1 && !storeName.trim()) {
      setErrorMsg(isBn ? 'অনুগ্রহ করে স্টোর বা ব্যবসার নাম লিখুন।' : 'Please enter your Store / Trading Name.');
      return;
    }
    if (step === 3 && !nidNumber.trim()) {
      setErrorMsg(isBn ? 'বৈধ এনআইডি (NID) নম্বর প্রদান করুন।' : 'National ID (NID) number is required for KYC.');
      return;
    }
    if (step === 4 && !payoutAccountNumber.trim()) {
      setErrorMsg(isBn ? 'পেআউট একাউন্ট বা বিকাশ/নগদ নম্বর লিখুন।' : 'Payout wallet or bank account number is required.');
      return;
    }
    setStep((prev) => Math.min(5, prev + 1) as 1 | 2 | 3 | 4 | 5);
  };

  const handleFinishOnboarding = async () => {
    setIsSubmitting(true);
    setErrorMsg(null);
    try {
      const docs: BusinessDocument[] = [];
      if (tradeLicenseFileName.trim()) {
        docs.push({
          id: `doc_${Date.now()}_1`,
          type: 'Trade License',
          fileName: tradeLicenseFileName.trim(),
          status: 'pending',
          uploadedAt: new Date().toISOString().split('T')[0]
        });
      }
      if (nidFileName.trim()) {
        docs.push({
          id: `doc_${Date.now()}_2`,
          type: 'NID / Passport',
          fileName: nidFileName.trim(),
          status: 'pending',
          uploadedAt: new Date().toISOString().split('T')[0]
        });
      }
      if (tinNumber.trim()) {
        docs.push({
          id: `doc_${Date.now()}_3`,
          type: 'TIN Certificate',
          fileName: `TIN_${tinNumber.trim()}.pdf`,
          status: 'pending',
          uploadedAt: new Date().toISOString().split('T')[0]
        });
      }

      const response = await vendorApiClient.registerVendorKyc({
        applicantId,
        storeName: storeName.trim(),
        legalEntityName: (legalEntityName || storeName).trim(),
        sellerTier,
        nidNumber: nidNumber.trim(),
        businessRegistrationNumber: businessRegNumber.trim() || `TRD-2026-${Math.floor(1000 + Math.random() * 9000)}`,
        taxIdentificationNumber: tinNumber.trim() || 'TIN-PENDING',
        activeRoles: selectedRoles,
        payoutAccount: {
          type: payoutType,
          accountName: storeName.trim(),
          accountNumber: payoutAccountNumber.trim(),
          routingNumber: payoutType === 'Bank Account' ? routingNumber.trim() : undefined
        },
        documents: docs,
        location: storeLocation.trim()
      });

      onCompleteOnboarding(response.vendorProfile);
      onClose();
    } catch (err: any) {
      setErrorMsg(err?.message || 'Unable to submit KYC registration.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const roleOptions: { id: BusinessRole; title: string; subtitle: string; icon: any }[] = [
    {
      id: 'retail_merchant',
      title: isBn ? 'রিটেইল মার্চেন্ট (Retail Store)' : 'Retail Merchant',
      subtitle: isBn ? 'খুচরা গ্রাহকদের কাছে সরাসরি পণ্য বিক্রি করুন' : 'Sell individual items directly to consumers',
      icon: ShoppingBag
    },
    {
      id: 'wholesale_supplier',
      title: isBn ? 'হোলসেল সাপ্লায়ার (Wholesale B2B)' : 'Wholesale Supplier (B2B)',
      subtitle: isBn ? 'বাল্ক অর্ডারে টায়ার্ড ডিসকাউন্ট ও RFQ কোট' : 'Bulk orders with MOQ tier slabs & RFQ bidding',
      icon: Package
    },
    {
      id: 'service_provider',
      title: isBn ? 'সার্ভিস টেকনিশিয়ান (Services)' : 'Service Technician & Provider',
      subtitle: isBn ? 'হোম রিপেয়ার, সেলুন বা ডিজিটাল সেবা বুকিং' : 'Bookable appointments & verified local slots',
      icon: Wrench
    },
    {
      id: 'rideshare_driver',
      title: isBn ? 'ফ্লিট ও ডেলিভারি পার্টনার (Fleet)' : 'Fleet & Rider Partner',
      subtitle: isBn ? 'বাইক/কার রাইড এবং এক্সপ্রেস পার্সেল পরিবহন' : 'Passenger rides, cargo trucks & courier POD',
      icon: Truck
    },
    {
      id: 'content_creator',
      title: isBn ? 'কন্টেন্ট ক্রিয়েটর (OTT Studio)' : 'Content Creator & Live Streamer',
      subtitle: isBn ? 'শপেবল রিলস, ভিডিও ও ফ্যান টিপস আয়' : 'Publish shoppable reels & receive creator payouts',
      icon: Video
    }
  ];

  const STEP_TITLES = [
    'Store & Tier',
    'Capabilities',
    'NID & Trade KYC',
    'Payout Account',
    'Review & Submit'
  ];

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-black/65 backdrop-blur-xs animate-fadeIn">
      <div role="dialog" aria-modal="true" aria-labelledby="merchant-onboarding-title" className="bg-[var(--pm-card)] text-[var(--pm-text)] border border-[var(--pm-border)] rounded-3xl w-full max-w-2xl shadow-2xl overflow-hidden flex flex-col max-h-[90vh]">
        {/* Header */}
        <div className="p-5 border-b border-[var(--pm-border)] flex items-center justify-between shrink-0 bg-[var(--pm-surface)]">
          <div className="flex items-center gap-3 min-w-0">
            <div className="w-10 h-10 rounded-2xl bg-[var(--pm-accent)] text-[var(--pm-accent-fg)] flex items-center justify-center shrink-0">
              <Store className="w-5 h-5" />
            </div>
            <div className="min-w-0">
              <div className="flex items-center gap-2 text-xs text-[var(--pm-muted)]">
                <h3 id="merchant-onboarding-title" className="text-base font-bold text-[var(--pm-text)] truncate">
                  {isBn ? 'মার্চেন্ট কেওয়াইসি (KYC) অনবোর্ডিং' : '5-Step Merchant KYC Onboarding'}
                </h3>
                <span aria-hidden="true">·</span>
                <span className="font-mono font-bold text-[var(--pm-accent)]">
                  Step {step}/5
                </span>
              </div>
              <p className="text-xs text-[var(--pm-muted)] truncate">
                {STEP_TITLES[step - 1]} · One Unified Account for Retail, B2B, Fleet & Services
              </p>
            </div>
          </div>

          <button
            type="button"
            onClick={onClose}
            aria-label="Close merchant onboarding"
            className="p-2 rounded-full text-[var(--pm-muted)] hover:text-[var(--pm-text)] hover:bg-[var(--pm-card-hover)] cursor-pointer transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Step Progress Bar */}
        <div className="px-5 pt-3 pb-2 border-b border-[var(--pm-border)] flex items-center gap-1.5 overflow-x-auto no-scrollbar">
          {STEP_TITLES.map((title, idx) => {
            const num = (idx + 1) as 1 | 2 | 3 | 4 | 5;
            const active = step === num;
            const done = step > num;
            return (
              <button
                key={title}
                type="button"
                onClick={() => num < step && setStep(num)}
                disabled={num > step}
                className={`px-2.5 py-1 rounded-lg text-[11px] font-bold whitespace-nowrap transition-colors ${
                  active
                    ? 'bg-[var(--pm-accent)] text-[var(--pm-accent-fg)]'
                    : done
                    ? 'bg-[var(--pm-success-soft)] text-[var(--pm-success)] cursor-pointer'
                    : 'text-[var(--pm-muted)]'
                }`}
              >
                {num}. {title}
              </button>
            );
          })}
        </div>

        {/* Form Body */}
        <div className="flex-1 overflow-y-auto p-5 space-y-4">
          {errorMsg && (
            <div className="p-3 rounded-xl bg-[var(--pm-danger-soft)] border border-[var(--pm-danger)]/30 text-xs font-bold text-[var(--pm-danger)] flex items-center gap-2">
              <AlertCircle className="w-4 h-4 shrink-0" />
              <span>{errorMsg}</span>
            </div>
          )}

          {/* STEP 1: Store & 7-Tier Hierarchy */}
          {step === 1 && (
            <div className="space-y-4 text-xs">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="font-bold text-[var(--pm-text)] block mb-1">
                    Store / Brand Name *
                  </label>
                  <input
                    type="text"
                    required
                    value={storeName}
                    onChange={(e) => setStoreName(e.target.value)}
                    placeholder="e.g., Padma Electronics Flagship"
                    className="w-full px-3.5 py-2.5 rounded-xl bg-[var(--pm-input)] border border-[var(--pm-border)] text-[var(--pm-text)] placeholder:text-[var(--pm-muted)] focus:border-[var(--pm-accent)] outline-none"
                  />
                </div>
                <div>
                  <label className="font-bold text-[var(--pm-text)] block mb-1">
                    Legal Entity / Proprietor
                  </label>
                  <input
                    type="text"
                    value={legalEntityName}
                    onChange={(e) => setLegalEntityName(e.target.value)}
                    placeholder="e.g., Rahman Traders Ltd."
                    className="w-full px-3.5 py-2.5 rounded-xl bg-[var(--pm-input)] border border-[var(--pm-border)] text-[var(--pm-text)] placeholder:text-[var(--pm-muted)] focus:border-[var(--pm-accent)] outline-none"
                  />
                </div>
              </div>

              <div>
                <label className="font-bold text-[var(--pm-text)] block mb-1.5">
                  7-Tier Seller Classification (Commission & Trust Tier)
                </label>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                  {SELLER_TIER_DEFINITIONS.map((tierItem) => (
                    <button
                      key={tierItem.tier}
                      type="button"
                      onClick={() => setSellerTier(tierItem.tier)}
                      className={`p-3 rounded-xl border text-left transition-all cursor-pointer ${
                        sellerTier === tierItem.tier
                          ? 'bg-[var(--pm-accent-soft)] border-[var(--pm-accent-border)] text-[var(--pm-accent)]'
                          : 'bg-[var(--pm-surface)] border-[var(--pm-border)] text-[var(--pm-text)] hover:bg-[var(--pm-card-hover)]'
                      }`}
                    >
                      <div className="font-bold text-xs">{tierItem.label}</div>
                      <div className="text-[11px] text-[var(--pm-muted)] mt-0.5 font-mono">
                        {tierItem.commissionLabel} · Min Trust L{tierItem.minTrustLevel}
                      </div>
                    </button>
                  ))}
                </div>
              </div>

              <div>
                <label className="font-bold text-[var(--pm-text)] block mb-1">
                  Primary Hub / District Location
                </label>
                <input
                  type="text"
                  value={storeLocation}
                  onChange={(e) => setStoreLocation(e.target.value)}
                  placeholder="e.g., Chawkbazar, Dhaka / BSCIC Gazipur"
                  className="w-full px-3.5 py-2.5 rounded-xl bg-[var(--pm-input)] border border-[var(--pm-border)] text-[var(--pm-text)] placeholder:text-[var(--pm-muted)] focus:border-[var(--pm-accent)] outline-none"
                />
              </div>
            </div>
          )}

          {/* STEP 2: Multi-Role Capabilities */}
          {step === 2 && (
            <div className="space-y-3 text-xs">
              <div className="flex items-center justify-between pb-1">
                <h4 className="font-bold text-[var(--pm-text)]">
                  {isBn ? 'ব্যবসায়িক ভূমিকা নির্বাচন করুন' : 'Select Active Business Capabilities'}
                </h4>
                <span className="font-mono font-bold text-[var(--pm-accent)]">
                  {selectedRoles.length} active
                </span>
              </div>

              <div className="space-y-2">
                {roleOptions.map((opt) => {
                  const isChecked = selectedRoles.includes(opt.id);
                  const Icon = opt.icon;
                  return (
                    <button
                      key={opt.id}
                      type="button"
                      onClick={() => toggleRole(opt.id)}
                      className={`w-full p-3.5 rounded-2xl border text-left transition-all cursor-pointer flex items-center justify-between gap-3 ${
                        isChecked
                          ? 'bg-[var(--pm-accent-soft)] border-[var(--pm-accent-border)]'
                          : 'border-[var(--pm-border)] bg-[var(--pm-surface)] hover:bg-[var(--pm-card-hover)]'
                      }`}
                    >
                      <div className="flex items-center gap-3 min-w-0">
                        <div className="w-9 h-9 rounded-xl bg-[var(--pm-card)] border border-[var(--pm-border)] text-[var(--pm-accent)] flex items-center justify-center shrink-0">
                          <Icon className="w-4 h-4" />
                        </div>
                        <div className="min-w-0">
                          <div className="font-bold text-[var(--pm-text)] truncate">{opt.title}</div>
                          <div className="text-[11px] text-[var(--pm-muted)] truncate">{opt.subtitle}</div>
                        </div>
                      </div>

                      <div
                        className={`w-5 h-5 rounded-full border flex items-center justify-center shrink-0 ${
                          isChecked ? 'bg-[var(--pm-accent)] border-[var(--pm-accent)] text-[var(--pm-accent-fg)]' : 'border-[var(--pm-border)]'
                        }`}
                      >
                        {isChecked && <CheckCircle2 className="w-3.5 h-3.5" />}
                      </div>
                    </button>
                  );
                })}
              </div>
            </div>
          )}

          {/* STEP 3: Legal Verification (NID, Trade License, e-TIN) */}
          {step === 3 && (
            <div className="space-y-4 text-xs">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="font-bold text-[var(--pm-text)] block mb-1">
                    National ID (NID / Smart Card) *
                  </label>
                  <input
                    type="text"
                    required
                    value={nidNumber}
                    onChange={(e) => setNidNumber(e.target.value)}
                    placeholder="10 or 17-digit NID (e.g., 1992004819283)"
                    className="w-full px-3.5 py-2.5 rounded-xl bg-[var(--pm-input)] border border-[var(--pm-border)] text-[var(--pm-text)] placeholder:text-[var(--pm-muted)] focus:border-[var(--pm-accent)] font-mono outline-none"
                  />
                </div>
                <div>
                  <label className="font-bold text-[var(--pm-text)] block mb-1">
                    Trade License / DBID No.
                  </label>
                  <input
                    type="text"
                    value={businessRegNumber}
                    onChange={(e) => setBusinessRegNumber(e.target.value)}
                    placeholder="TRD-DHK-2026-4410"
                    className="w-full px-3.5 py-2.5 rounded-xl bg-[var(--pm-input)] border border-[var(--pm-border)] text-[var(--pm-text)] placeholder:text-[var(--pm-muted)] focus:border-[var(--pm-accent)] font-mono outline-none"
                  />
                </div>
              </div>

              <div>
                <label className="font-bold text-[var(--pm-text)] block mb-1">
                  e-TIN Certificate Number
                </label>
                <input
                  type="text"
                  value={tinNumber}
                  onChange={(e) => setTinNumber(e.target.value)}
                  placeholder="12-digit e-TIN (Optional for Micro Retail, Required for L5+)"
                  className="w-full px-3.5 py-2.5 rounded-xl bg-[var(--pm-input)] border border-[var(--pm-border)] text-[var(--pm-text)] placeholder:text-[var(--pm-muted)] focus:border-[var(--pm-accent)] font-mono outline-none"
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-2 border-t border-[var(--pm-border)]">
                <div>
                  <label className="font-bold text-[var(--pm-text)] block mb-1">
                    NID Document Scan Reference
                  </label>
                  <input
                    type="text"
                    value={nidFileName}
                    onChange={(e) => setNidFileName(e.target.value)}
                    className="w-full px-3 py-2 rounded-xl bg-[var(--pm-input)] border border-[var(--pm-border)] text-[var(--pm-text)] font-mono text-xs outline-none focus:border-[var(--pm-accent)]"
                  />
                </div>
                <div>
                  <label className="font-bold text-[var(--pm-text)] block mb-1">
                    Trade License File Reference
                  </label>
                  <input
                    type="text"
                    value={tradeLicenseFileName}
                    onChange={(e) => setTradeLicenseFileName(e.target.value)}
                    className="w-full px-3 py-2 rounded-xl bg-[var(--pm-input)] border border-[var(--pm-border)] text-[var(--pm-text)] font-mono text-xs outline-none focus:border-[var(--pm-accent)]"
                  />
                </div>
              </div>
            </div>
          )}

          {/* STEP 4: Settlement Account */}
          {step === 4 && (
            <div className="space-y-4 text-xs">
              <div>
                <label className="font-bold text-[var(--pm-text)] block mb-1">
                  Payout Account Provider
                </label>
                <select
                  value={payoutType}
                  onChange={(e) => setPayoutType(e.target.value as PayoutAccount['type'])}
                  className="w-full px-3.5 py-2.5 rounded-xl bg-[var(--pm-input)] border border-[var(--pm-border)] text-[var(--pm-text)] font-bold outline-none focus:border-[var(--pm-accent)]"
                >
                  <option value="bKash Merchant">bKash Merchant Mobile Banking</option>
                  <option value="Nagad Merchant">Nagad Merchant Mobile Wallet</option>
                  <option value="Rocket">Rocket Commercial Wallet</option>
                  <option value="Bank Account">Bank Account (BEFTN / NPSB Wire)</option>
                </select>
              </div>

              <div>
                <label className="font-bold text-[var(--pm-text)] block mb-1">
                  Wallet Number or Bank Account Number *
                </label>
                <input
                  type="text"
                  required
                  value={payoutAccountNumber}
                  onChange={(e) => setPayoutAccountNumber(e.target.value)}
                  placeholder="e.g., 01711-223344"
                  className="w-full px-3.5 py-2.5 rounded-xl bg-[var(--pm-input)] border border-[var(--pm-border)] text-[var(--pm-text)] placeholder:text-[var(--pm-muted)] focus:border-[var(--pm-accent)] font-mono outline-none"
                />
              </div>

              {payoutType === 'Bank Account' && (
                <div>
                  <label className="font-bold text-[var(--pm-text)] block mb-1">
                    Bank Branch Routing Number
                  </label>
                  <input
                    type="text"
                    value={routingNumber}
                    onChange={(e) => setRoutingNumber(e.target.value)}
                    placeholder="9-digit BEFTN Routing Number"
                    className="w-full px-3.5 py-2.5 rounded-xl bg-[var(--pm-input)] border border-[var(--pm-border)] text-[var(--pm-text)] placeholder:text-[var(--pm-muted)] focus:border-[var(--pm-accent)] font-mono outline-none"
                  />
                </div>
              )}
            </div>
          )}

          {/* STEP 5: Final Review */}
          {step === 5 && (
            <div className="space-y-3 text-xs">
              <div className="p-4 rounded-2xl bg-[var(--pm-surface)] border border-[var(--pm-border)] space-y-2.5">
                <div className="flex items-center justify-between border-b border-[var(--pm-border)] pb-2">
                  <span className="font-bold text-[var(--pm-text)]">KYC Application Summary</span>
                  <span className="font-mono font-bold text-[var(--pm-accent)]">
                    {selectedTierMeta.label}
                  </span>
                </div>
                <div className="grid grid-cols-2 gap-y-2 text-[var(--pm-muted)]">
                  <span>Store Name:</span>
                  <span className="font-bold text-[var(--pm-text)] text-right">{storeName}</span>
                  <span>Commission Rate:</span>
                  <span className="font-mono font-bold text-[var(--pm-text)] text-right">
                    {selectedTierMeta.commissionLabel}
                  </span>
                  <span>NID Number:</span>
                  <span className="font-mono font-bold text-[var(--pm-text)] text-right">{nidNumber}</span>
                  <span>Trade License:</span>
                  <span className="font-mono text-[var(--pm-text)] text-right">
                    {businessRegNumber || 'Auto-Generated Ref'}
                  </span>
                  <span>Payout Settlement:</span>
                  <span className="font-mono font-bold text-[var(--pm-text)] text-right">
                    {payoutType} · {payoutAccountNumber}
                  </span>
                  <span>Active Roles:</span>
                  <span className="font-bold text-[var(--pm-text)] text-right">
                    {selectedRoles.length} capabilities
                  </span>
                </div>
              </div>

              <div className="p-3 rounded-xl bg-[var(--pm-success-soft)] border border-[var(--pm-success)]/30 text-[var(--pm-success)] flex items-center gap-2">
                <ShieldCheck className="w-4 h-4 shrink-0" />
                <span>
                  10+ digit NID + Trade License applications qualify for instant Trust Level 4–5 activation; incomplete applications route to Governance KYC review.
                </span>
              </div>
            </div>
          )}
        </div>

        {/* Modal Footer Controls */}
        <div className="p-4 border-t border-[var(--pm-border)] bg-[var(--pm-surface)] flex items-center justify-between shrink-0">
          {step > 1 ? (
            <button
              type="button"
              onClick={() => {
                setErrorMsg(null);
                setStep((prev) => Math.max(1, prev - 1) as 1 | 2 | 3 | 4 | 5);
              }}
              className="px-4 py-2 rounded-xl bg-[var(--pm-card)] border border-[var(--pm-border)] text-[var(--pm-muted)] hover:text-[var(--pm-text)] text-xs font-bold flex items-center gap-1 hover:bg-[var(--pm-card-hover)] cursor-pointer transition-colors"
            >
              <ChevronLeft className="w-4 h-4" />
              <span>Back</span>
            </button>
          ) : (
            <div />
          )}

          {step < 5 ? (
            <button
              type="button"
              onClick={handleNext}
              className="px-6 py-2.5 rounded-xl bg-[var(--pm-accent)] hover:bg-[var(--pm-accent-hover)] text-[var(--pm-accent-fg)] font-bold text-xs flex items-center gap-1 cursor-pointer active-scale transition-colors"
            >
              <span>Next Step</span>
              <ChevronRight className="w-4 h-4" />
            </button>
          ) : (
            <button
              type="button"
              disabled={isSubmitting}
              onClick={() => void handleFinishOnboarding()}
              className="px-6 py-2.5 rounded-xl bg-[var(--pm-success)] hover:opacity-90 disabled:opacity-60 text-white font-bold text-xs flex items-center gap-1.5 cursor-pointer active-scale transition-all"
            >
              <ShieldCheck className="w-4 h-4" />
              <span>
                {isSubmitting
                  ? 'Verifying KYC...'
                  : isBn
                  ? 'কেওয়াইসি জমা দিন'
                  : 'Submit Merchant KYC'}
              </span>
            </button>
          )}
        </div>
      </div>
    </div>
  );
};
