import React, { useRef, useState } from 'react';
import { X, Upload, FileText, CheckCircle2, AlertCircle, Pill, ShoppingBasket } from 'lucide-react';
import { Order, User } from '@/types';
import { retailApiClient } from '@/features/marketplace/services/retailApiClient';

interface PrescriptionUploadModalProps {
  isOpen: boolean;
  onClose: () => void;
  isBn: boolean;
  currentUser: User;
  onOrderCreated: (order: Order) => void;
}

const MAX_FILE_BYTES = 2_500_000;
const ALLOWED_MIME_TYPES = ['image/jpeg', 'image/png', 'image/webp', 'application/pdf'];

export const PrescriptionUploadModal: React.FC<PrescriptionUploadModalProps> = ({
  isOpen,
  onClose,
  isBn,
  currentUser,
  onOrderCreated,
}) => {
  const fileInputRef = useRef<HTMLInputElement | null>(null);
  const [orderType, setOrderType] = useState<'pharmacy_rx' | 'grocery_list'>('pharmacy_rx');
  const [contactPhone, setContactPhone] = useState(currentUser.phone || '');
  const [deliveryAddress, setDeliveryAddress] = useState(currentUser.location || '');
  const [notes, setNotes] = useState('');
  const [fileMeta, setFileMeta] = useState<{
    fileName: string;
    mimeType: string;
    fileSizeBytes: number;
    previewDataUrl?: string;
  } | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submittedRef, setSubmittedRef] = useState<{ refCode: string; orderId: string } | null>(null);

  if (!isOpen) return null;

  const handleFileSelected = (e: React.ChangeEvent<HTMLInputElement>) => {
    setError(null);
    const file = e.target.files?.[0];
    if (!file) return;

    if (!ALLOWED_MIME_TYPES.includes(file.type)) {
      setError(
        isBn
          ? 'শুধুমাত্র JPG, PNG, WebP অথবা PDF ফাইল আপলোড করা যাবে।'
          : 'Only JPG, PNG, WebP, or PDF files are supported.'
      );
      return;
    }

    if (file.size > MAX_FILE_BYTES) {
      setError(
        isBn
          ? 'ফাইলের সাইজ ২.৫ মেগাবাইটের কম হতে হবে।'
          : 'Attachment size must be under 2.5 MB.'
      );
      return;
    }

    const reader = new FileReader();
    reader.onload = () => {
      setFileMeta({
        fileName: file.name,
        mimeType: file.type,
        fileSizeBytes: file.size,
        previewDataUrl: typeof reader.result === 'string' && file.type.startsWith('image/')
          ? reader.result
          : undefined,
      });
    };
    reader.readAsDataURL(file);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    if (contactPhone.trim().length < 6) {
      setError(isBn ? 'সঠিক মোবাইল নম্বর লিখুন।' : 'Please enter a valid contact phone number.');
      return;
    }
    if (deliveryAddress.trim().length < 4) {
      setError(isBn ? 'ডেলিভারি ঠিকানা লিখুন।' : 'Please enter a delivery address.');
      return;
    }
    if (!fileMeta && notes.trim().length < 3) {
      setError(
        isBn
          ? 'প্রেসক্রিপশন/লিস্টের ছবি আপলোড করুন অথবা পণ্যের তালিকা লিখুন।'
          : 'Please attach a file or write your items list.'
      );
      return;
    }

    setIsSubmitting(true);
    try {
      const response = await retailApiClient.submitPrescriptionOrder({
        orderType,
        customerId: currentUser.id,
        customerName: currentUser.name,
        contactPhone: contactPhone.trim(),
        deliveryAddress: deliveryAddress.trim(),
        notes: notes.trim(),
        fileName: fileMeta?.fileName,
        mimeType: fileMeta?.mimeType,
        fileSizeBytes: fileMeta?.fileSizeBytes,
        previewDataUrl: fileMeta?.previewDataUrl,
      });

      const title =
        orderType === 'pharmacy_rx'
          ? `Pharmacy Rx Quote (${response.prescription.id})`
          : `Grocery Bazar List (${response.prescription.id})`;

      const createdOrder: Order = {
        id: response.orderId,
        createdAt: response.prescription.createdAt,
        items: [
          {
            product: {
              id: response.prescription.id,
              storeId: orderType === 'pharmacy_rx' ? 'vendor_city_pharma' : 'vendor_city_group',
              storeName: orderType === 'pharmacy_rx' ? 'PaikarCare Verified Pharmacy' : 'City Mart Express',
              type: orderType === 'pharmacy_rx' ? 'retail' : 'grocery',
              tradeMode: 'retail',
              title,
              description: notes.trim() || `Attached document: ${fileMeta?.fileName || 'Prescription'}`,
              price: 0,
              rating: 4.9,
              reviewsCount: 1,
              deliveryEta: '45 mins after quote',
              imageUrl: '/src/assets/images/pharmacy_interior_clean_1794253691558.jpg',
              category: orderType === 'pharmacy_rx' ? 'Pharmacy' : 'Grocery',
              inStock: true,
            },
            quantity: 1,
            isWholesale: false,
            specialInstructions: notes.trim() || fileMeta?.fileName,
          },
        ],
        subtotal: 0,
        deliveryFee: 60,
        tax: 0,
        total: 60,
        status: 'confirmed',
        deliveryAddress: deliveryAddress.trim(),
        paymentMethod: 'Cash on Delivery',
        estimatedArrival: 'Quote in 10 mins',
        trackingStep: 1,
        buyerName: currentUser.name,
        buyerPhone: contactPhone.trim(),
      };

      onOrderCreated(createdOrder);
      setSubmittedRef({ refCode: response.prescription.id, orderId: response.orderId });
    } catch (err: any) {
      setError(err?.message || (isBn ? 'আপলোড ব্যর্থ হয়েছে। আবার চেষ্টা করুন।' : 'Submission failed. Please retry.'));
    } finally {
      setIsSubmitting(false);
    }
  };

  const resetAndClose = () => {
    setSubmittedRef(null);
    setError(null);
    setNotes('');
    setFileMeta(null);
    onClose();
  };

  return (
    <div
      role="presentation"
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-xs"
      onClick={resetAndClose}
    >
      <div
        role="dialog"
        aria-modal="true"
        aria-labelledby="prescription-upload-title"
        className="w-full max-w-lg rounded-2xl bg-[var(--pm-card)] text-[var(--pm-text)] border border-[var(--pm-border)] shadow-2xl overflow-hidden"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="px-6 py-4 border-b border-[var(--pm-border)] bg-[var(--pm-surface)] flex items-center justify-between">
          <div>
            <h3 id="prescription-upload-title" className="text-base font-bold text-[var(--pm-text)]">
              {isBn ? 'প্রেসক্রিপশন ও বাজার লিস্ট অর্ডার' : 'Prescription & Grocery List Order'}
            </h3>
            <p className="text-xs text-[var(--pm-muted)]">
              {isBn
                ? 'ফার্মেসি অথবা গ্রোসারি ফর্দ পাঠান — ভেরিফাইড শপ কোটেশন পাঠাবে'
                : 'Submit to verified local pharmacy or grocery hub for itemized quote'}
            </p>
          </div>
          <button
            type="button"
            onClick={resetAndClose}
            aria-label={isBn ? 'উইন্ডো বন্ধ করুন' : 'Close upload window'}
            className="p-2 rounded-lg text-[var(--pm-muted)] hover:text-[var(--pm-text)] hover:bg-[var(--pm-card-hover)] cursor-pointer"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {submittedRef ? (
          <div className="p-6 text-center space-y-4">
            <div className="w-12 h-12 rounded-2xl bg-[var(--pm-success-soft)] text-[var(--pm-success)] flex items-center justify-center mx-auto">
              <CheckCircle2 className="w-6 h-6" />
            </div>
            <div className="space-y-1">
              <h4 className="text-base font-bold text-[var(--pm-text)]">
                {isBn ? 'রিকোয়েস্ট সফলভাবে জমা হয়েছে' : 'Request Submitted Successfully'}
              </h4>
              <p className="text-xs text-[var(--pm-muted)]">
                {isBn
                  ? 'ভেরিফাইড ফার্মাসিস্ট/স্টোর কিছুক্ষণের মধ্যে মোট বিল কনফার্ম করবে।'
                  : 'A verified merchant is reviewing your items and will confirm the quote shortly.'}
              </p>
            </div>
            <div className="p-4 rounded-xl bg-[var(--pm-surface)] border border-[var(--pm-border)] text-xs space-y-2 text-left">
              <div className="flex justify-between">
                <span className="text-[var(--pm-muted)]">{isBn ? 'রেফারেন্স কোড:' : 'Reference ID:'}</span>
                <span className="font-mono font-bold text-[var(--pm-accent)]">{submittedRef.refCode}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-[var(--pm-muted)]">{isBn ? 'ট্র্যাকিং অর্ডার:' : 'Tracking Order:'}</span>
                <span className="font-mono font-bold text-[var(--pm-text)]">{submittedRef.orderId}</span>
              </div>
            </div>
            <button
              type="button"
              onClick={resetAndClose}
              className="w-full py-2.5 px-4 rounded-xl bg-[var(--pm-accent)] hover:bg-[var(--pm-accent-hover)] text-[var(--pm-accent-fg)] text-xs font-bold cursor-pointer"
            >
              {isBn ? 'অর্ডার ট্র্যাকে ফিরুন' : 'Done'}
            </button>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="p-6 space-y-4">
            {/* Mode Switcher */}
            <div className="grid grid-cols-2 gap-2 p-1 rounded-xl bg-[var(--pm-surface)] border border-[var(--pm-border)]">
              <button
                type="button"
                onClick={() => setOrderType('pharmacy_rx')}
                className={`py-2 px-3 rounded-lg text-xs font-semibold flex items-center justify-center gap-1.5 whitespace-nowrap cursor-pointer transition-colors ${
                  orderType === 'pharmacy_rx'
                    ? 'bg-[var(--pm-card)] text-[var(--pm-text)] shadow-xs'
                    : 'text-[var(--pm-muted)] hover:text-[var(--pm-text)]'
                }`}
              >
                <Pill className="w-3.5 h-3.5 text-rose-500" />
                <span>{isBn ? 'ফার্মেসি প্রেসক্রিপশন' : 'Pharmacy Rx'}</span>
              </button>
              <button
                type="button"
                onClick={() => setOrderType('grocery_list')}
                className={`py-2 px-3 rounded-lg text-xs font-semibold flex items-center justify-center gap-1.5 whitespace-nowrap cursor-pointer transition-colors ${
                  orderType === 'grocery_list'
                    ? 'bg-[var(--pm-card)] text-[var(--pm-text)] shadow-xs'
                    : 'text-[var(--pm-muted)] hover:text-[var(--pm-text)]'
                }`}
              >
                <ShoppingBasket className="w-3.5 h-3.5 text-[var(--pm-success)]" />
                <span>{isBn ? 'গ্রোসারি বাজার ফর্দ' : 'Grocery List'}</span>
              </button>
            </div>

            {/* File Dropzone */}
            <div
              onClick={() => fileInputRef.current?.click()}
              className="border-2 border-dashed border-[var(--pm-border-strong)] hover:border-[var(--pm-accent)] rounded-xl p-4 text-center cursor-pointer bg-[var(--pm-surface)] transition-colors"
            >
              <input
                ref={fileInputRef}
                type="file"
                aria-label={isBn ? 'প্রেসক্রিপশন বা বাজারের তালিকা আপলোড করুন' : 'Upload prescription or grocery list'}
                accept="image/jpeg,image/png,image/webp,.pdf"
                onChange={handleFileSelected}
                className="hidden"
              />
              {fileMeta ? (
                <div className="space-y-2">
                  {fileMeta.previewDataUrl ? (
                    <img
                      src={fileMeta.previewDataUrl}
                      alt="Uploaded prescription preview"
                      className="max-h-36 mx-auto rounded-lg object-contain border border-[var(--pm-border)]"
                    />
                  ) : (
                    <FileText className="w-8 h-8 text-[var(--pm-accent)] mx-auto" />
                  )}
                  <p className="text-xs font-semibold text-[var(--pm-text)] truncate">
                    {fileMeta.fileName} · {(fileMeta.fileSizeBytes / 1024).toFixed(0)} KB
                  </p>
                  <p className="text-[11px] text-[var(--pm-accent)]">
                    {isBn ? 'পরিবর্তন করতে ক্লিক করুন' : 'Click to replace attachment'}
                  </p>
                </div>
              ) : (
                <div className="space-y-1.5 py-2">
                  <Upload className="w-6 h-6 text-[var(--pm-muted)] mx-auto" />
                  <p className="text-xs font-semibold text-[var(--pm-text)]">
                    {orderType === 'pharmacy_rx'
                      ? isBn ? 'প্রেসক্রিপশনের ছবি বা PDF আপলোড করুন' : 'Attach Prescription Photo or PDF'
                      : isBn ? 'বাজারের ফর্দের ছবি বা PDF আপলোড করুন' : 'Attach Grocery List Photo or PDF'}
                  </p>
                  <p className="text-[11px] text-[var(--pm-muted)]">JPG, PNG, WebP, PDF (Max 2.5 MB)</p>
                </div>
              )}
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div className="space-y-1">
                <label className="text-xs font-semibold text-[var(--pm-text)]">
                  {isBn ? 'মোবাইল নম্বর' : 'Contact Phone'}
                </label>
                <input
                  type="tel"
                  required
                  value={contactPhone}
                  onChange={(e) => setContactPhone(e.target.value)}
                  placeholder="01XXXXXXXXX"
                  className="w-full px-3 py-2 rounded-xl bg-[var(--pm-input)] border border-[var(--pm-border)] text-xs text-[var(--pm-text)] placeholder:text-[var(--pm-muted)] focus:outline-none focus:border-[var(--pm-accent)]"
                />
              </div>
              <div className="space-y-1">
                <label className="text-xs font-semibold text-[var(--pm-text)]">
                  {isBn ? 'ডেলিভারি এলাকা / ঠিকানা' : 'Delivery Address'}
                </label>
                <input
                  type="text"
                  required
                  value={deliveryAddress}
                  onChange={(e) => setDeliveryAddress(e.target.value)}
                  placeholder={isBn ? 'বাসা, রোড, এলাকা' : 'House, Road, Area'}
                  className="w-full px-3 py-2 rounded-xl bg-[var(--pm-input)] border border-[var(--pm-border)] text-xs text-[var(--pm-text)] placeholder:text-[var(--pm-muted)] focus:outline-none focus:border-[var(--pm-accent)]"
                />
              </div>
            </div>

            <div className="space-y-1">
              <label className="text-xs font-semibold text-[var(--pm-text)]">
                {orderType === 'pharmacy_rx'
                  ? isBn ? 'ওষুধের নাম / কয় দিনের ডোজ (ঐচ্ছিক)' : 'Medicine names or dosage notes'
                  : isBn ? 'প্রয়োজনীয় বাজারের তালিকা ও পরিমাণ' : 'Itemized grocery list & quantities'}
              </label>
              <textarea
                rows={3}
                value={notes}
                onChange={(e) => setNotes(e.target.value)}
                placeholder={
                  orderType === 'pharmacy_rx'
                    ? isBn ? 'যেমন: Napa Extra 2 পাতা, Seclo 20mg 1 পাতা...' : 'e.g. Napa Extra 2 strips, full course...'
                    : isBn ? 'যেমন: মিনিকেট চাল ৫ কেজি, মসুর ডাল ২ কেজি...' : 'e.g. Miniket Rice 5kg, Soybean Oil 2L...'
                }
                className="w-full p-3 rounded-xl bg-[var(--pm-input)] border border-[var(--pm-border)] text-xs text-[var(--pm-text)] placeholder:text-[var(--pm-muted)] focus:outline-none focus:border-[var(--pm-accent)] resize-none"
              />
            </div>

            {error && (
              <div className="p-3 rounded-xl bg-[var(--pm-danger-soft)] border border-[var(--pm-danger)]/30 text-[var(--pm-danger)] text-xs flex items-center gap-2">
                <AlertCircle className="w-4 h-4 shrink-0" />
                <span>{error}</span>
              </div>
            )}

            <button
              type="submit"
              disabled={isSubmitting}
              className="w-full py-2.5 px-4 rounded-xl bg-[var(--pm-accent)] hover:bg-[var(--pm-accent-hover)] disabled:opacity-50 text-[var(--pm-accent-fg)] text-xs font-bold cursor-pointer transition-colors"
            >
              {isSubmitting
                ? isBn ? 'জমা হচ্ছে...' : 'Submitting...'
                : isBn ? 'ভেরিফাইড স্টোরে অর্ডার পাঠান' : 'Submit for Merchant Quote'}
            </button>
          </form>
        )}
      </div>
    </div>
  );
};
