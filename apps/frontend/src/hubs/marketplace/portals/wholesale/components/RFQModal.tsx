import React, { useState, useEffect } from 'react';
import { X, FileText, CheckCircle2, Building2, MapPin, Phone, Hash, ShieldCheck } from 'lucide-react';
import { CommerceItem, RFQRequest } from '@/types';

interface RFQModalProps {
  product: CommerceItem | null;
  isOpen: boolean;
  onClose: () => void;
  onSubmitRFQ: (rfq: Omit<RFQRequest, 'id' | 'createdAt' | 'status'>) => void;
}

export const RFQModal: React.FC<RFQModalProps> = ({
  product,
  isOpen,
  onClose,
  onSubmitRFQ,
}) => {
  const [targetQuantity, setTargetQuantity] = useState(product?.minWholesaleQty || 100);
  const [targetPrice, setTargetPrice] = useState(product ? Math.round(product.price * 0.8) : 500);
  const [companyName, setCompanyName] = useState('');
  const [contactPerson, setContactPerson] = useState('');
  const [phone, setPhone] = useState('');
  const [email, setEmail] = useState('');
  const [destinationCity, setDestinationCity] = useState('Dhaka');
  const [paymentTerms, setPaymentTerms] = useState<'escrow' | 'wholesale_credit' | 'bank_transfer' | 'lc'>('escrow');
  const [notes, setNotes] = useState('');
  const [isSubmitted, setIsSubmitted] = useState(false);

  useEffect(() => {
    if (product) {
      setTargetQuantity(product.minWholesaleQty || 100);
      setTargetPrice(Math.round(product.price * 0.85));
    }
  }, [product]);

  if (!isOpen || !product) return null;

  const subtotal = Math.round(Number(targetQuantity || 0) * Number(targetPrice || 0));
  const estimatedAitVat = Math.round(subtotal * 0.05);
  const grandTotal = subtotal + estimatedAitVat;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!companyName || !contactPerson || !phone) return;

    onSubmitRFQ({
      productId: product.id,
      productTitle: product.title,
      targetQuantity: Number(targetQuantity),
      targetPricePerUnit: Number(targetPrice),
      companyName,
      contactPerson,
      phone,
      email,
      destinationCity,
      paymentTerms,
      notes,
    });

    setIsSubmitted(true);
    setTimeout(() => {
      setIsSubmitted(false);
      onClose();
    }, 1800);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-sm animate-fade-in">
      <div
        className="w-full max-w-lg bg-[var(--pm-card)] text-[var(--pm-text)] rounded-[2rem] shadow-2xl border border-[var(--pm-border)] overflow-hidden"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-[var(--pm-border)] bg-[var(--pm-surface)]">
          <div className="flex items-center gap-2.5">
            <div className="w-9 h-9 rounded-[1.25rem] bg-[var(--pm-success-soft)] text-[var(--pm-success)] flex items-center justify-center">
              <FileText className="w-4 h-4" />
            </div>
            <div>
              <h3 className="text-sm font-semibold text-[var(--pm-text)]">
                Request for Quotation (RFQ) & PO Draft
              </h3>
              <p className="text-xs text-[var(--pm-muted)]">
                Direct B2B Factory & Supplier Negotiation
              </p>
            </div>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="w-8 h-8 rounded-full text-[var(--pm-muted)] hover:text-[var(--pm-text)] hover:bg-[var(--pm-card-hover)] flex items-center justify-center transition-colors cursor-pointer"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {isSubmitted ? (
          <div className="p-8 text-center space-y-3">
            <div className="w-12 h-12 rounded-full bg-[var(--pm-success-soft)] text-[var(--pm-success)] flex items-center justify-center mx-auto">
              <CheckCircle2 className="w-6 h-6" />
            </div>
            <h4 className="text-base font-semibold text-[var(--pm-text)]">
              Quotation & PO Draft Generated!
            </h4>
            <p className="text-xs text-[var(--pm-muted)] max-w-sm mx-auto">
              Your bulk RFQ for &quot;{product.title}&quot; is logged in Active Purchase Orders. You can lock funds in Escrow once ready.
            </p>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="p-6 space-y-4 max-h-[82vh] overflow-y-auto">
            {/* Product Summary */}
            <div className="flex items-center gap-3 p-3 rounded-[1.25rem] bg-[var(--pm-surface)] border border-[var(--pm-border)]">
              <img
                src={product.imageUrl}
                alt={product.title}
                referrerPolicy="no-referrer"
                className="w-12 h-12 object-cover rounded-xl border border-[var(--pm-border)] shrink-0"
              />
              <div className="min-w-0 flex-1">
                <div className="text-xs font-semibold text-[var(--pm-text)] truncate">
                  {product.title}
                </div>
                <div className="text-[11px] text-[var(--pm-muted)] flex items-center gap-2 mt-0.5 font-mono tabular-nums">
                  <span>Factory Price: ৳{product.price}/pc</span>
                  <span>·</span>
                  <span>MOQ: {product.minWholesaleQty || 20} pcs</span>
                </div>
              </div>
            </div>

            {/* Target Numbers */}
            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="block text-xs font-medium text-[var(--pm-text)] mb-1">
                  Target Quantity (pcs) *
                </label>
                <div className="relative">
                  <Hash className="absolute left-3 top-2.5 w-3.5 h-3.5 text-[var(--pm-muted)]" />
                  <input
                    type="number"
                    min={product.minWholesaleQty || 10}
                    value={targetQuantity}
                    onChange={(e) => setTargetQuantity(Number(e.target.value))}
                    className="w-full pl-9 pr-3 py-2 text-xs rounded-[1.25rem] border border-[var(--pm-border)] bg-[var(--pm-input)] text-[var(--pm-text)] focus:outline-none focus:border-[var(--pm-accent)] font-mono tabular-nums"
                    required
                  />
                </div>
              </div>
              <div>
                <label className="block text-xs font-medium text-[var(--pm-text)] mb-1">
                  Target Price / Unit (৳)
                </label>
                <div className="relative">
                  <span className="absolute left-3 top-2 text-xs font-mono font-bold text-[var(--pm-muted)] select-none">
                    ৳
                  </span>
                  <input
                    type="number"
                    value={targetPrice}
                    onChange={(e) => setTargetPrice(Number(e.target.value))}
                    className="w-full pl-9 pr-3 py-2 text-xs rounded-[1.25rem] border border-[var(--pm-border)] bg-[var(--pm-input)] text-[var(--pm-text)] focus:outline-none focus:border-[var(--pm-accent)] font-mono tabular-nums"
                  />
                </div>
              </div>
            </div>

            {/* Business Contact */}
            <div className="space-y-3">
              <div>
                <label className="block text-xs font-medium text-[var(--pm-text)] mb-1">
                  Business / Store Name *
                </label>
                <div className="relative">
                  <Building2 className="absolute left-3 top-2.5 w-3.5 h-3.5 text-[var(--pm-muted)]" />
                  <input
                    type="text"
                    placeholder="e.g. Dhaka Electronics & Trading"
                    value={companyName}
                    onChange={(e) => setCompanyName(e.target.value)}
                    className="w-full pl-9 pr-3 py-2 text-xs rounded-[1.25rem] border border-[var(--pm-border)] bg-[var(--pm-input)] text-[var(--pm-text)] placeholder:text-[var(--pm-muted)] focus:outline-none focus:border-[var(--pm-accent)]"
                    required
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-medium text-[var(--pm-text)] mb-1">
                    Contact Person *
                  </label>
                  <input
                    type="text"
                    placeholder="Full name"
                    value={contactPerson}
                    onChange={(e) => setContactPerson(e.target.value)}
                    className="w-full px-3 py-2 text-xs rounded-[1.25rem] border border-[var(--pm-border)] bg-[var(--pm-input)] text-[var(--pm-text)] placeholder:text-[var(--pm-muted)] focus:outline-none focus:border-[var(--pm-accent)]"
                    required
                  />
                </div>
                <div>
                  <label className="block text-xs font-medium text-[var(--pm-text)] mb-1">
                    Phone Number *
                  </label>
                  <div className="relative">
                    <Phone className="absolute left-3 top-2.5 w-3.5 h-3.5 text-[var(--pm-muted)]" />
                    <input
                      type="tel"
                      placeholder="017xxxxxxxx"
                      value={phone}
                      onChange={(e) => setPhone(e.target.value)}
                      className="w-full pl-9 pr-3 py-2 text-xs rounded-[1.25rem] border border-[var(--pm-border)] bg-[var(--pm-input)] text-[var(--pm-text)] placeholder:text-[var(--pm-muted)] focus:outline-none focus:border-[var(--pm-accent)]"
                      required
                    />
                  </div>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-medium text-[var(--pm-text)] mb-1">
                    Destination City *
                  </label>
                  <div className="relative">
                    <MapPin className="absolute left-3 top-2.5 w-3.5 h-3.5 text-[var(--pm-muted)]" />
                    <select
                      value={destinationCity}
                      onChange={(e) => setDestinationCity(e.target.value)}
                      className="w-full pl-9 pr-3 py-2 text-xs rounded-[1.25rem] border border-[var(--pm-border)] bg-[var(--pm-input)] text-[var(--pm-text)] focus:outline-none focus:border-[var(--pm-accent)]"
                    >
                      <option value="Dhaka">Dhaka</option>
                      <option value="Chittagong">Chittagong</option>
                      <option value="Sylhet">Sylhet</option>
                      <option value="Rajshahi">Rajshahi</option>
                      <option value="Khulna">Khulna</option>
                      <option value="Barisal">Barisal</option>
                      <option value="Rangpur">Rangpur</option>
                    </select>
                  </div>
                </div>
                <div>
                  <label className="block text-xs font-medium text-[var(--pm-text)] mb-1">
                    Settlement Terms
                  </label>
                  <div className="relative">
                    <ShieldCheck className="absolute left-3 top-2.5 w-3.5 h-3.5 text-[var(--pm-success)]" />
                    <select
                      value={paymentTerms}
                      onChange={(e) =>
                        setPaymentTerms(
                          e.target.value as 'escrow' | 'wholesale_credit' | 'bank_transfer' | 'lc'
                        )
                      }
                      className="w-full pl-9 pr-3 py-2 text-xs rounded-[1.25rem] border border-[var(--pm-border)] bg-[var(--pm-input)] text-[var(--pm-text)] focus:outline-none focus:border-[var(--pm-accent)]"
                    >
                      <option value="escrow">Wholesale Escrow (Recommended)</option>
                      <option value="wholesale_credit">Trade Credit (Net 15)</option>
                      <option value="bank_transfer">Bank RTGS / BEFTN</option>
                      <option value="lc">Letter of Credit (LC)</option>
                    </select>
                  </div>
                </div>
              </div>

              <div>
                <label className="block text-xs font-medium text-[var(--pm-text)] mb-1">
                  Email (Optional)
                </label>
                <input
                  type="email"
                  placeholder="merchant@example.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full px-3 py-2 text-xs rounded-[1.25rem] border border-[var(--pm-border)] bg-[var(--pm-input)] text-[var(--pm-text)] placeholder:text-[var(--pm-muted)] focus:outline-none focus:border-[var(--pm-accent)]"
                />
              </div>

              <div>
                <label className="block text-xs font-medium text-[var(--pm-text)] mb-1">
                  Specifications & Freight Terms
                </label>
                <textarea
                  rows={2}
                  placeholder="Packaging preferences, sample requirements, delivery timeline..."
                  value={notes}
                  onChange={(e) => setNotes(e.target.value)}
                  className="w-full px-3 py-2 text-xs rounded-[1.25rem] border border-[var(--pm-border)] bg-[var(--pm-input)] text-[var(--pm-text)] placeholder:text-[var(--pm-muted)] focus:outline-none focus:border-[var(--pm-accent)] resize-none"
                />
              </div>
            </div>

            {/* Live Proforma PO Estimate */}
            <div className="p-3.5 rounded-[1.25rem] bg-[var(--pm-surface)] border border-[var(--pm-border)] space-y-1.5 text-xs">
              <div className="flex items-center justify-between text-[var(--pm-muted)]">
                <span>Lot Subtotal ({targetQuantity} pcs)</span>
                <span className="font-mono tabular-nums text-[var(--pm-text)]">৳{subtotal.toLocaleString()}</span>
              </div>
              <div className="flex items-center justify-between text-[var(--pm-muted)]">
                <span>Estimated AIT / VAT (5%)</span>
                <span className="font-mono tabular-nums text-[var(--pm-text)]">৳{estimatedAitVat.toLocaleString()}</span>
              </div>
              <div className="flex items-center justify-between pt-1.5 border-t border-[var(--pm-border)] font-bold text-[var(--pm-text)]">
                <span>Proforma PO Total</span>
                <span className="font-mono tabular-nums text-[var(--pm-success)]">
                  ৳{grandTotal.toLocaleString()}
                </span>
              </div>
            </div>

            {/* Actions */}
            <div className="flex items-center justify-end gap-2.5 pt-2 border-t border-[var(--pm-border)]">
              <button
                type="button"
                onClick={onClose}
                className="px-4 py-2 text-xs font-medium rounded-[2rem] text-[var(--pm-muted)] hover:bg-[var(--pm-card-hover)] transition-colors cursor-pointer"
              >
                Cancel
              </button>
              <button
                type="submit"
                className="px-5 py-2 text-xs font-semibold rounded-[2rem] bg-[var(--pm-accent)] hover:bg-[var(--pm-accent-hover)] text-[var(--pm-accent-fg)] transition-colors shadow-sm active-scale cursor-pointer"
              >
                Generate PO & Submit RFQ
              </button>
            </div>
          </form>
        )}
      </div>
    </div>
  );
};
