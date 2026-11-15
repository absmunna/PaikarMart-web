import React, { useState } from 'react';
import { 
  X, 
  Store, 
  ShieldCheck, 
  FileText, 
  CheckCircle, 
  Building2, 
  ArrowRight, 
  ArrowLeft, 
  Upload,
  AlertCircle,
  Package,
  UtensilsCrossed,
  Wrench,
  Car,
  ShoppingBag
} from 'lucide-react';
import { VendorCategory, VendorApplication, VendorProfile } from '@/types';

interface VendorOnboardingModalProps {
  isOpen: boolean;
  onClose: () => void;
  onCompleteOnboarding: (profile: VendorProfile) => void;
}

export const VendorOnboardingModal: React.FC<VendorOnboardingModalProps> = ({
  isOpen,
  onClose,
  onCompleteOnboarding,
}) => {
  const [step, setStep] = useState<number>(1);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [success, setSuccess] = useState(false);

  // Form State
  const [tradingName, setTradingName] = useState('');
  const [legalEntityName, setLegalEntityName] = useState('');
  const [businessType, setBusinessType] = useState<'Sole Proprietorship' | 'Registered Corporation' | 'LLC' | 'Partnership'>('LLC');
  const [category, setCategory] = useState<VendorCategory>('retail');
  const [businessRegNo, setBusinessRegNo] = useState('');
  const [taxId, setTaxId] = useState('');
  const [storeAddress, setStoreAddress] = useState('');
  const [contactEmail, setContactEmail] = useState('alex.business@nexsphere.com');
  const [contactPhone, setContactPhone] = useState('+1 (555) 890-1234');
  const [payoutType, setPayoutType] = useState<'Bank Account' | 'Mobile Banking'>('Bank Account');
  const [accountNumber, setAccountNumber] = useState('9876543210123');
  const [documentType, setDocumentType] = useState<'Trade License' | 'National ID / Passport' | 'Certificate of Incorporation'>('Trade License');
  const [uploadedDocName, setUploadedDocName] = useState('Trade_License_2026_Certified.pdf');
  const [acceptedTerms, setAcceptedTerms] = useState(false);

  if (!isOpen) return null;

  const categories: { id: VendorCategory; label: string; icon: any; desc: string }[] = [
    { id: 'wholesale', label: 'Wholesale B2B Lots', icon: Package, desc: 'Sell bulk volume cases with tiered pricing' },
    { id: 'retail', label: 'Retail Store Direct', icon: ShoppingBag, desc: 'Direct-to-consumer goods & fashion' },
    { id: 'restaurant', label: 'Restaurant & Kitchen', icon: UtensilsCrossed, desc: 'Cook meals with 30m courier dispatch' },
    { id: 'services', label: 'Nearby Services & Repairs', icon: Wrench, desc: 'On-site technical repairs & salon appointments' },
    { id: 'rideshare', label: 'Ride Transit Fleet', icon: Car, desc: 'Register electric vehicles & chauffeur fleets' },
    { id: 'grocery', label: 'Local Grocery Mart', icon: Store, desc: 'Fresh farm produce, pantry, and daily goods' },
  ];

  const handleNext = () => {
    if (step < 4) setStep(step + 1);
  };

  const handleBack = () => {
    if (step > 1) setStep(step - 1);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!acceptedTerms) return;

    setIsSubmitting(true);
    setTimeout(() => {
      setIsSubmitting(false);
      setSuccess(true);

      const newVendorProfile: VendorProfile = {
        id: `vnd_${Date.now()}`,
        storeName: tradingName || 'Modern Commerce Store',
        legalEntityName: legalEntityName || 'Alex Enterprises LLC',
        businessRegNumber: businessRegNo || 'REG-2026-9842',
        taxIdentificationNumber: taxId || 'EIN-84-902184',
        category,
        verified: true,
        status: 'active',
        commissionTier: category === 'wholesale' ? 'Wholesale 4%' : 'Standard 8%',
        rating: 5.0,
        totalSales: 0,
        createdAt: new Date().toISOString()
      };

      setTimeout(() => {
        onCompleteOnboarding(newVendorProfile);
        onClose();
        setSuccess(false);
        setStep(1);
      }, 1800);
    }, 1500);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-black/70 backdrop-blur-md animate-fadeIn">
      <div className="relative w-full max-w-2xl bg-[var(--pm-card)] text-[var(--pm-text)] border border-[var(--pm-border)] rounded-3xl p-6 sm:p-8 shadow-2xl max-h-[92vh] overflow-y-auto">
        
        {/* Header */}
        <div className="flex items-start justify-between pb-4 border-b border-[var(--pm-border)]">
          <div>
            <div className="inline-flex items-center gap-1.5 text-xs font-bold text-[var(--pm-accent)] uppercase tracking-wider mb-1">
              <ShieldCheck className="w-4 h-4" />
              <span>Merchant Legal Compliance & Onboarding</span>
            </div>
            <h2 className="text-xl sm:text-2xl font-bold text-[var(--pm-text)]">
              Open a Verified Merchant Account
            </h2>
            <p className="text-xs sm:text-sm text-[var(--pm-muted)] mt-0.5">
              Follow international ecommerce rules, commercial law compliance, and tax verification.
            </p>
          </div>

          <button
            onClick={onClose}
            className="p-1.5 rounded-full text-[var(--pm-muted)] hover:text-[var(--pm-text)] hover:bg-[var(--pm-card-hover)] transition-colors cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* 4-Step Progress Indicator */}
        <div className="py-4">
          <div className="grid grid-cols-4 gap-2 text-center">
            {[
              { num: 1, label: 'Identity' },
              { num: 2, label: 'Category' },
              { num: 3, label: 'Legal & Tax' },
              { num: 4, label: 'Payout' },
            ].map((s) => (
              <div key={s.num} className="space-y-1">
                <div
                  className={`h-1.5 rounded-full transition-colors ${
                    step >= s.num ? 'bg-[var(--pm-accent)]' : 'bg-[var(--pm-border)]'
                  }`}
                />
                <span className={`text-[10px] font-bold ${
                  step >= s.num ? 'text-[var(--pm-accent)]' : 'text-[var(--pm-muted)]'
                }`}>
                  {s.num}. {s.label}
                </span>
              </div>
            ))}
          </div>
        </div>

        {/* Success View */}
        {success ? (
          <div className="py-12 text-center space-y-4">
            <div className="w-16 h-16 rounded-full bg-[var(--pm-success)] text-white flex items-center justify-center mx-auto shadow-lg animate-bounce">
              <CheckCircle className="w-8 h-8" />
            </div>
            <h3 className="text-xl font-bold text-[var(--pm-text)]">
              Business Verified & Approved!
            </h3>
            <p className="text-xs sm:text-sm text-[var(--pm-muted)] max-w-sm mx-auto leading-relaxed">
              Your store <strong>{tradingName || 'New Store'}</strong> is now officially registered in compliance with commerce regulations. Redirecting to your Vendor Dashboard...
            </p>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="space-y-5">
            
            {/* Step 1: Business Identity */}
            {step === 1 && (
              <div className="space-y-4 animate-fadeIn">
                <h3 className="text-sm font-bold text-[var(--pm-text)] flex items-center gap-2">
                  <Building2 className="w-4 h-4 text-[var(--pm-accent)]" />
                  <span>Step 1: Business Identity & Store Name</span>
                </h3>

                <div className="space-y-3">
                  <div>
                    <label className="text-xs font-semibold text-[var(--pm-text)] block mb-1">
                      Store / Public Trading Name *
                    </label>
                    <input
                      type="text"
                      required
                      value={tradingName}
                      onChange={(e) => setTradingName(e.target.value)}
                      placeholder="e.g. Urban Craft Provisions"
                      className="w-full px-3.5 py-2.5 rounded-xl bg-[var(--pm-input)] text-xs sm:text-sm text-[var(--pm-text)] placeholder:text-[var(--pm-muted)] border border-[var(--pm-border)] focus:border-[var(--pm-accent)] outline-none"
                    />
                  </div>

                  <div>
                    <label className="text-xs font-semibold text-[var(--pm-text)] block mb-1">
                      Registered Legal Entity Name *
                    </label>
                    <input
                      type="text"
                      required
                      value={legalEntityName}
                      onChange={(e) => setLegalEntityName(e.target.value)}
                      placeholder="e.g. Urban Craft Global LLC"
                      className="w-full px-3.5 py-2.5 rounded-xl bg-[var(--pm-input)] text-xs sm:text-sm text-[var(--pm-text)] placeholder:text-[var(--pm-muted)] border border-[var(--pm-border)] focus:border-[var(--pm-accent)] outline-none"
                    />
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    <div>
                      <label className="text-xs font-semibold text-[var(--pm-text)] block mb-1">
                        Business Structure
                      </label>
                      <select
                        value={businessType}
                        onChange={(e) => setBusinessType(e.target.value as any)}
                        className="w-full px-3.5 py-2.5 rounded-xl bg-[var(--pm-input)] text-xs sm:text-sm text-[var(--pm-text)] border border-[var(--pm-border)] focus:border-[var(--pm-accent)] outline-none"
                      >
                        <option value="LLC">Limited Liability Company (LLC)</option>
                        <option value="Registered Corporation">Registered Corporation (Inc / Corp)</option>
                        <option value="Sole Proprietorship">Sole Proprietorship</option>
                        <option value="Partnership">Partnership</option>
                      </select>
                    </div>

                    <div>
                      <label className="text-xs font-semibold text-[var(--pm-text)] block mb-1">
                        Physical Store / Warehouse Address
                      </label>
                      <input
                        type="text"
                        required
                        value={storeAddress}
                        onChange={(e) => setStoreAddress(e.target.value)}
                        placeholder="e.g. 104 Industrial Pkwy, Suite 400"
                        className="w-full px-3.5 py-2.5 rounded-xl bg-[var(--pm-input)] text-xs sm:text-sm text-[var(--pm-text)] placeholder:text-[var(--pm-muted)] border border-[var(--pm-border)] focus:border-[var(--pm-accent)] outline-none"
                      />
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* Step 2: Category Selection */}
            {step === 2 && (
              <div className="space-y-4 animate-fadeIn">
                <h3 className="text-sm font-bold text-[var(--pm-text)] flex items-center gap-2">
                  <Store className="w-4 h-4 text-[var(--pm-accent)]" />
                  <span>Step 2: Select Your Commercial Channel & Portal</span>
                </h3>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  {categories.map((c) => {
                    const Icon = c.icon;
                    const isSelected = category === c.id;

                    return (
                      <div
                        key={c.id}
                        onClick={() => setCategory(c.id)}
                        className={`p-4 rounded-3xl border-2 transition-all cursor-pointer flex items-start gap-4 ${
                          isSelected
                            ? 'border-[var(--pm-accent)] bg-[var(--pm-accent-soft)] shadow-lg'
                            : 'border-[var(--pm-border)] hover:border-[var(--pm-accent-border)] bg-[var(--pm-surface)] shadow-sm'
                        }`}
                      >
                        <div className={`p-3 rounded-2xl shrink-0 transition-colors ${
                          isSelected ? 'bg-[var(--pm-accent)] text-[var(--pm-accent-fg)] shadow-md' : 'bg-[var(--pm-card)] border border-[var(--pm-border)] text-[var(--pm-muted)]'
                        }`}>
                          <Icon className="w-5 h-5" />
                        </div>
                        <div>
                          <h4 className="text-sm font-bold text-[var(--pm-text)]">
                            {c.label}
                          </h4>
                          <p className="text-xs text-[var(--pm-muted)] mt-1 leading-snug">
                            {c.desc}
                          </p>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            )}

            {/* Step 3: Legal & Regulatory Verification */}
            {step === 3 && (
              <div className="space-y-4 animate-fadeIn">
                <h3 className="text-sm font-bold text-[var(--pm-text)] flex items-center gap-2">
                  <FileText className="w-4 h-4 text-[var(--pm-accent)]" />
                  <span>Step 3: Legal Registration, Trade License & Tax ID</span>
                </h3>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div>
                    <label className="text-xs font-semibold text-[var(--pm-text)] block mb-1">
                      Business Registration / Incorporation Number *
                    </label>
                    <input
                      type="text"
                      required
                      value={businessRegNo}
                      onChange={(e) => setBusinessRegNo(e.target.value)}
                      placeholder="e.g. BRN-2026-89410"
                      className="w-full px-3.5 py-2.5 rounded-xl bg-[var(--pm-input)] text-xs sm:text-sm text-[var(--pm-text)] placeholder:text-[var(--pm-muted)] border border-[var(--pm-border)] focus:border-[var(--pm-accent)] outline-none font-mono"
                    />
                  </div>

                  <div>
                    <label className="text-xs font-semibold text-[var(--pm-text)] block mb-1">
                      Tax Identification Number (TIN / EIN / VAT) *
                    </label>
                    <input
                      type="text"
                      required
                      value={taxId}
                      onChange={(e) => setTaxId(e.target.value)}
                      placeholder="e.g. TAX-94-382910"
                      className="w-full px-3.5 py-2.5 rounded-xl bg-[var(--pm-input)] text-xs sm:text-sm text-[var(--pm-text)] placeholder:text-[var(--pm-muted)] border border-[var(--pm-border)] focus:border-[var(--pm-accent)] outline-none font-mono"
                    />
                  </div>
                </div>

                {/* Document Upload Simulation */}
                <div className="p-4 rounded-2xl bg-[var(--pm-surface)] border border-[var(--pm-border)] space-y-2">
                  <label className="text-xs font-bold text-[var(--pm-text)] block">
                    Upload Government Verification Document
                  </label>
                  <div className="flex items-center gap-3">
                    <select
                      value={documentType}
                      onChange={(e) => setDocumentType(e.target.value as any)}
                      className="px-3 py-2 rounded-xl bg-[var(--pm-input)] text-[var(--pm-text)] text-xs border border-[var(--pm-border)] outline-none"
                    >
                      <option value="Trade License">Trade License Certificate</option>
                      <option value="Certificate of Incorporation">Certificate of Incorporation</option>
                      <option value="National ID / Passport">National ID / Gov Passport</option>
                    </select>

                    <div className="flex-1 px-3 py-2 rounded-xl bg-[var(--pm-card)] border border-dashed border-[var(--pm-accent-border)] text-xs flex items-center justify-between text-[var(--pm-accent)] font-medium">
                      <span className="truncate">{uploadedDocName}</span>
                      <Upload className="w-3.5 h-3.5 shrink-0" />
                    </div>
                  </div>
                </div>

                <div className="p-3 rounded-xl bg-[var(--pm-warning-soft)] border border-[var(--pm-warning)]/30 text-xs text-[var(--pm-warning)] flex items-start gap-2">
                  <AlertCircle className="w-4 h-4 shrink-0 mt-0.5" />
                  <span>All submitted documents are verified against state and trade registries before live settlement payouts are enabled.</span>
                </div>
              </div>
            )}

            {/* Step 4: Payout & Terms */}
            {step === 4 && (
              <div className="space-y-4 animate-fadeIn">
                <h3 className="text-sm font-bold text-[var(--pm-text)] flex items-center gap-2">
                  <ShieldCheck className="w-4 h-4 text-[var(--pm-accent)]" />
                  <span>Step 4: Payout Settlement & Compliance Agreement</span>
                </h3>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div>
                    <label className="text-xs font-semibold text-[var(--pm-text)] block mb-1">
                      Settlement Payout Channel
                    </label>
                    <select
                      value={payoutType}
                      onChange={(e) => setPayoutType(e.target.value as any)}
                      className="w-full px-3.5 py-2.5 rounded-xl bg-[var(--pm-input)] text-xs sm:text-sm text-[var(--pm-text)] border border-[var(--pm-border)] outline-none"
                    >
                      <option value="Bank Account">Direct Bank Wire / ACH</option>
                      <option value="Mobile Banking">Mobile Wallet (bKash / Venmo / Stripe)</option>
                    </select>
                  </div>

                  <div>
                    <label className="text-xs font-semibold text-[var(--pm-text)] block mb-1">
                      Account / Routing Number *
                    </label>
                    <input
                      type="text"
                      required
                      value={accountNumber}
                      onChange={(e) => setAccountNumber(e.target.value)}
                      className="w-full px-3.5 py-2.5 rounded-xl bg-[var(--pm-input)] text-xs sm:text-sm text-[var(--pm-text)] border border-[var(--pm-border)] focus:border-[var(--pm-accent)] outline-none font-mono"
                    />
                  </div>
                </div>

                {/* Terms of Service Checkbox */}
                <div className="p-4 rounded-2xl bg-[var(--pm-surface)] border border-[var(--pm-border)] space-y-3">
                  <div className="flex items-start gap-3">
                    <input
                      type="checkbox"
                      id="terms"
                      required
                      checked={acceptedTerms}
                      onChange={(e) => setAcceptedTerms(e.target.checked)}
                      className="mt-1 w-4 h-4 rounded accent-[var(--pm-accent)]"
                    />
                    <label htmlFor="terms" className="text-xs text-[var(--pm-muted)] leading-relaxed">
                      I certify that all information submitted is legally accurate. I agree to PaikarMart&apos;s Standard Vendor Code of Conduct, return policies, anti-counterfeiting warranties, and applicable platform commission terms.
                    </label>
                  </div>
                </div>
              </div>
            )}

            {/* Navigation Buttons */}
            <div className="flex items-center justify-between pt-4 border-t border-[var(--pm-border)]">
              {step > 1 ? (
                <button
                  type="button"
                  onClick={handleBack}
                  className="px-4 py-2 rounded-xl text-xs font-semibold text-[var(--pm-muted)] hover:text-[var(--pm-text)] hover:bg-[var(--pm-card-hover)] transition-colors flex items-center gap-1.5 cursor-pointer"
                >
                  <ArrowLeft className="w-3.5 h-3.5" />
                  <span>Back</span>
                </button>
              ) : (
                <div />
              )}

              {step < 4 ? (
                <button
                  type="button"
                  onClick={handleNext}
                  className="px-5 py-2.5 rounded-xl bg-[var(--pm-accent)] hover:bg-[var(--pm-accent-hover)] text-[var(--pm-accent-fg)] text-xs font-bold shadow-md transition-colors flex items-center gap-1.5 cursor-pointer"
                >
                  <span>Continue</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </button>
              ) : (
                <button
                  type="submit"
                  disabled={!acceptedTerms || isSubmitting}
                  className="px-6 py-2.5 rounded-xl bg-[var(--pm-success)] hover:opacity-90 disabled:opacity-40 text-white text-xs font-bold shadow-md transition-all flex items-center gap-2 cursor-pointer"
                >
                  <span>{isSubmitting ? 'Verifying Legal Credentials...' : 'Submit & Activate Vendor'}</span>
                  <CheckCircle className="w-4 h-4" />
                </button>
              )}
            </div>

          </form>
        )}

      </div>
    </div>
  );
};
