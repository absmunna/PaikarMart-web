import React, { useState } from 'react';
import { X, PackageCheck, CheckCircle2, Building2, MapPin, Phone } from 'lucide-react';
import { CommerceItem, SampleRequest } from '@/types';

interface SampleRequestModalProps {
  product: CommerceItem | null;
  isOpen: boolean;
  onClose: () => void;
  onSubmitSample: (sample: Omit<SampleRequest, 'id' | 'createdAt' | 'status'>) => void;
}

export const SampleRequestModal: React.FC<SampleRequestModalProps> = ({
  product,
  isOpen,
  onClose,
  onSubmitSample,
}) => {
  const [companyName, setCompanyName] = useState('');
  const [contactPerson, setContactPerson] = useState('');
  const [phone, setPhone] = useState('');
  const [shippingAddress, setShippingAddress] = useState('');
  const [isSubmitted, setIsSubmitted] = useState(false);

  if (!isOpen || !product) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!companyName || !contactPerson || !phone || !shippingAddress) return;

    onSubmitSample({
      productId: product.id,
      productTitle: product.title,
      companyName,
      contactPerson,
      phone,
      shippingAddress,
    });

    setIsSubmitted(true);
    setTimeout(() => {
      setIsSubmitted(false);
      onClose();
    }, 2000);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-sm animate-fade-in">
      <div 
        className="w-full max-w-md bg-[var(--pm-card)] text-[var(--pm-text)] rounded-2xl shadow-2xl border border-[var(--pm-border)] overflow-hidden"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-[var(--pm-border)] bg-[var(--pm-surface)]">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-lg bg-[var(--pm-accent-soft)] text-[var(--pm-accent)] flex items-center justify-center">
              <PackageCheck className="w-4 h-4" />
            </div>
            <div>
              <h3 className="text-sm font-semibold text-[var(--pm-text)]">
                Request Product Sample
              </h3>
              <p className="text-xs text-[var(--pm-muted)]">
                Pre-Bulk Quality Inspection (1-2 Units)
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-lg text-[var(--pm-muted)] hover:text-[var(--pm-text)] hover:bg-[var(--pm-card-hover)] transition-colors cursor-pointer"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {isSubmitted ? (
          <div className="p-8 text-center space-y-3">
            <div className="w-12 h-12 rounded-full bg-[var(--pm-accent-soft)] text-[var(--pm-accent)] flex items-center justify-center mx-auto">
              <CheckCircle2 className="w-6 h-6" />
            </div>
            <h4 className="text-base font-semibold text-[var(--pm-text)]">
              Sample Order Dispatched!
            </h4>
            <p className="text-xs text-[var(--pm-muted)]">
              Your sample evaluation unit is being prepared by the manufacturer. Tracking details will be SMS-alerted.
            </p>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="p-6 space-y-4">
            <div className="flex items-center gap-3 p-3 rounded-xl bg-[var(--pm-surface)] border border-[var(--pm-border)]">
              <img
                src={product.imageUrl}
                alt={product.title}
                className="w-12 h-12 object-cover rounded-lg border border-[var(--pm-border)] shrink-0"
              />
              <div className="min-w-0 flex-1">
                <div className="text-xs font-semibold text-[var(--pm-text)] truncate">
                  {product.title}
                </div>
                <div className="text-[11px] text-[var(--pm-muted)] font-mono tabular-nums">
                  Sample Fee: ৳{product.price} (Deductible upon bulk order)
                </div>
              </div>
            </div>

            <div>
              <label className="block text-xs font-medium text-[var(--pm-text)] mb-1">
                Store or Company Name *
              </label>
              <div className="relative">
                <Building2 className="absolute left-3 top-2.5 w-3.5 h-3.5 text-[var(--pm-muted)]" />
                <input
                  type="text"
                  placeholder="e.g. Modern Retailers"
                  value={companyName}
                  onChange={(e) => setCompanyName(e.target.value)}
                  className="w-full pl-9 pr-3 py-2 text-xs rounded-lg border border-[var(--pm-border)] bg-[var(--pm-input)] text-[var(--pm-text)] placeholder:text-[var(--pm-muted)] focus:outline-none focus:border-[var(--pm-accent)]"
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
                  className="w-full px-3 py-2 text-xs rounded-lg border border-[var(--pm-border)] bg-[var(--pm-input)] text-[var(--pm-text)] placeholder:text-[var(--pm-muted)] focus:outline-none focus:border-[var(--pm-accent)]"
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
                    className="w-full pl-9 pr-3 py-2 text-xs rounded-lg border border-[var(--pm-border)] bg-[var(--pm-input)] text-[var(--pm-text)] placeholder:text-[var(--pm-muted)] focus:outline-none focus:border-[var(--pm-accent)]"
                    required
                  />
                </div>
              </div>
            </div>

            <div>
              <label className="block text-xs font-medium text-[var(--pm-text)] mb-1">
                Sample Delivery Address *
              </label>
              <div className="relative">
                <MapPin className="absolute left-3 top-2.5 w-3.5 h-3.5 text-[var(--pm-muted)]" />
                <textarea
                  rows={2}
                  placeholder="Full commercial address..."
                  value={shippingAddress}
                  onChange={(e) => setShippingAddress(e.target.value)}
                  className="w-full pl-9 pr-3 py-2 text-xs rounded-lg border border-[var(--pm-border)] bg-[var(--pm-input)] text-[var(--pm-text)] placeholder:text-[var(--pm-muted)] focus:outline-none focus:border-[var(--pm-accent)] resize-none"
                  required
                />
              </div>
            </div>

            <div className="flex items-center justify-end gap-2.5 pt-2 border-t border-[var(--pm-border)]">
              <button
                type="button"
                onClick={onClose}
                className="px-4 py-2 text-xs font-medium rounded-lg text-[var(--pm-muted)] hover:bg-[var(--pm-card-hover)] transition-colors cursor-pointer"
              >
                Cancel
              </button>
              <button
                type="submit"
                className="px-5 py-2 text-xs font-semibold rounded-lg bg-[var(--pm-accent)] hover:bg-[var(--pm-accent-hover)] text-[var(--pm-accent-fg)] transition-colors shadow-sm cursor-pointer"
              >
                Confirm Sample Order
              </button>
            </div>
          </form>
        )}
      </div>
    </div>
  );
};
