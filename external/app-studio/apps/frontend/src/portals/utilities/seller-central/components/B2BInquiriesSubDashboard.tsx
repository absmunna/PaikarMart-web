import React, { useState } from 'react';
import {
  FileText,
  DollarSign,
  Package,
  ShieldCheck,
  CheckCircle2,
  Clock,
  ArrowRight,
  Send,
  Lock,
  Truck,
  ExternalLink,
  ChevronDown,
  X,
  Plus,
  AlertCircle
} from 'lucide-react';
import { useLanguage } from '@/contexts/LanguageContext';
import {
  useB2BRFQStore,
  type RFQ,
  type PurchaseOrderDraft,
  type WholesaleSampleOrder,
} from '@/features/b2b';
import { useWalletStore } from '@/features/wallet';

interface B2BInquiriesSubDashboardProps {
  vendorName: string;
}

export const B2BInquiriesSubDashboard: React.FC<B2BInquiriesSubDashboardProps> = ({ vendorName }) => {
  const { language } = useLanguage();
  const isBn = language === 'bn';

  const { rfqs, poDrafts, sampleOrders, addQuoteToRFQ } = useB2BRFQStore();
  const { createEscrowHold } = useWalletStore();

  const [activeTab, setActiveTab] = useState<'rfqs' | 'orders' | 'samples'>('rfqs');
  const [selectedRfqForQuote, setSelectedRfqForQuote] = useState<RFQ | null>(null);

  // Quote form state
  const [quotePrice, setQuotePrice] = useState('');
  const [deliveryDays, setDeliveryDays] = useState('15');
  const [quoteMessage, setQuoteMessage] = useState('');
  const [successToast, setSuccessToast] = useState<string | null>(null);

  const showSuccessToast = (message: string) => {
    setSuccessToast(message);
    window.setTimeout(() => setSuccessToast(null), 4000);
  };

  const handleSendQuote = (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedRfqForQuote || !quotePrice) return;

    addQuoteToRFQ(selectedRfqForQuote.id, {
      id: `q-${Date.now()}`,
      companyName: vendorName || 'Official Factory Supplier',
      quotePrice: parseFloat(quotePrice),
      deliveryTime: `${deliveryDays} days`,
      message: quoteMessage.trim() || 'Official factory production bid with verified inspection standards.',
      date: new Date().toISOString().split('T')[0]
    });

    showSuccessToast(isBn ? 'দরপত্র বিড সফলভাবে পাঠানো হয়েছে!' : 'Quotation submitted successfully to buyer!');
    setSelectedRfqForQuote(null);
    setQuotePrice('');
    setQuoteMessage('');
  };

  const totalEscrowLockedBdt = poDrafts
    .filter((po) => po.status === 'escrow_locked')
    .reduce((acc, po) => acc + po.financials.grandTotal, 0);

  return (
    <div className="space-y-6 animate-fadeIn">
      {/* 4-KPI Overview Banner */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
        <div className="p-4 rounded-3xl bg-[var(--pm-card)] border border-[var(--pm-border)] shadow-xs">
          <div className="flex items-center gap-2 text-xs font-bold text-[var(--pm-muted)]">
            <FileText className="w-4 h-4 text-[var(--pm-accent)]" />
            <span>{isBn ? 'সক্রিয় আরএফকিউ' : 'Active RFQ Tenders'}</span>
          </div>
          <span className="text-xl font-mono tabular-nums font-black text-[var(--pm-text)] mt-1 block">
            {rfqs.length}
          </span>
          <span className="text-[10px] text-[var(--pm-muted)] mt-0.5 block">
            {isBn ? 'বায়ারদের সরাসরি দরপত্র' : 'Open for factory bids'}
          </span>
        </div>

        <div className="p-4 rounded-3xl bg-[var(--pm-card)] border border-[var(--pm-border)] shadow-xs">
          <div className="flex items-center gap-2 text-xs font-bold text-[var(--pm-muted)]">
            <Package className="w-4 h-4 text-amber-500" />
            <span>{isBn ? 'পারচেজ অর্ডার (PO)' : 'Purchase Orders'}</span>
          </div>
          <span className="text-xl font-mono tabular-nums font-black text-amber-500 mt-1 block">
            {poDrafts.length}
          </span>
          <span className="text-[10px] text-[var(--pm-muted)] mt-0.5 block">
            {isBn ? 'ড্রাফট ও প্রস্তুত অর্ডার' : 'Drafts & active contracts'}
          </span>
        </div>

        <div className="p-4 rounded-3xl bg-[var(--pm-card)] border border-[var(--pm-border)] shadow-xs">
          <div className="flex items-center gap-2 text-xs font-bold text-[var(--pm-muted)]">
            <Lock className="w-4 h-4 text-emerald-500" />
            <span>{isBn ? 'লকড এসক্রো ফান্ড' : 'Escrow Locked Value'}</span>
          </div>
          <span className="text-xl font-mono tabular-nums font-black text-emerald-500 mt-1 block">
            ৳{totalEscrowLockedBdt.toLocaleString()}
          </span>
          <span className="text-[10px] text-[var(--pm-muted)] mt-0.5 block">
            {isBn ? 'নিরাপদ ব্যাংকিং হোল্ড' : '100% payment guaranteed'}
          </span>
        </div>

        <div className="p-4 rounded-3xl bg-[var(--pm-card)] border border-[var(--pm-border)] shadow-xs">
          <div className="flex items-center gap-2 text-xs font-bold text-[var(--pm-muted)]">
            <Truck className="w-4 h-4 text-sky-500" />
            <span>{isBn ? 'স্যাম্পল রিকুয়েস্ট' : 'Sample Requests'}</span>
          </div>
          <span className="text-xl font-mono tabular-nums font-black text-sky-500 mt-1 block">
            {sampleOrders.length}
          </span>
          <span className="text-[10px] text-[var(--pm-muted)] mt-0.5 block">
            {isBn ? 'বাল্ক অর্ডারের আগে যাচাই' : 'Quality proofing queue'}
          </span>
        </div>
      </div>

      {/* Success Notification Banner */}
      {successToast && (
        <div className="p-3.5 rounded-2xl bg-emerald-500/15 border border-emerald-500/30 text-emerald-500 text-xs font-bold flex items-center justify-between animate-fadeIn">
          <div className="flex items-center gap-2">
            <CheckCircle2 className="w-4 h-4" />
            <span>{successToast}</span>
          </div>
          <button onClick={() => setSuccessToast(null)} className="cursor-pointer">
            <X className="w-4 h-4" />
          </button>
        </div>
      )}

      {/* Tab Switcher */}
      <div className="flex items-center gap-2 border-b border-[var(--pm-border)] pb-2 overflow-x-auto no-scrollbar">
        <button
          type="button"
          onClick={() => setActiveTab('rfqs')}
          className={`px-4 py-2 rounded-2xl text-xs font-bold transition-all cursor-pointer flex items-center gap-2 ${
            activeTab === 'rfqs'
              ? 'bg-[var(--pm-accent)] text-[var(--pm-accent-fg)] shadow-sm'
              : 'bg-[var(--pm-card)] border border-[var(--pm-border)] text-[var(--pm-muted)] hover:text-[var(--pm-text)]'
          }`}
        >
          <FileText className="w-3.5 h-3.5" />
          <span>{isBn ? 'বায়ারদের আরএফকিউ দরপত্র' : 'Buyer RFQ Tenders'}</span>
          <span className="font-mono text-[10px] px-1.5 py-0.2 rounded-full bg-black/15">
            {rfqs.length}
          </span>
        </button>

        <button
          type="button"
          onClick={() => setActiveTab('orders')}
          className={`px-4 py-2 rounded-2xl text-xs font-bold transition-all cursor-pointer flex items-center gap-2 ${
            activeTab === 'orders'
              ? 'bg-amber-500 text-slate-950 shadow-sm font-black'
              : 'bg-[var(--pm-card)] border border-[var(--pm-border)] text-[var(--pm-muted)] hover:text-[var(--pm-text)]'
          }`}
        >
          <Package className="w-3.5 h-3.5" />
          <span>{isBn ? 'পারচেজ অর্ডার ও এসক্রো' : 'Purchase Orders & Escrow'}</span>
          <span className="font-mono text-[10px] px-1.5 py-0.2 rounded-full bg-black/15">
            {poDrafts.length}
          </span>
        </button>

        <button
          type="button"
          onClick={() => setActiveTab('samples')}
          className={`px-4 py-2 rounded-2xl text-xs font-bold transition-all cursor-pointer flex items-center gap-2 ${
            activeTab === 'samples'
              ? 'bg-sky-500 text-white shadow-sm font-black'
              : 'bg-[var(--pm-card)] border border-[var(--pm-border)] text-[var(--pm-muted)] hover:text-[var(--pm-text)]'
          }`}
        >
          <Truck className="w-3.5 h-3.5" />
          <span>{isBn ? 'স্যাম্পল রিকুয়েস্ট' : 'Sample Requests'}</span>
          <span className="font-mono text-[10px] px-1.5 py-0.2 rounded-full bg-black/15">
            {sampleOrders.length}
          </span>
        </button>
      </div>

      {/* TAB 1: BUYER RFQ TENDERS */}
      {activeTab === 'rfqs' && (
        <div className="space-y-4">
          <div className="flex items-center justify-between px-1">
            <span className="text-xs font-bold text-[var(--pm-muted)]">
              {isBn ? 'সরাসরি কারখানার জন্য বায়ারদের চাহিদা তালিকা' : 'Direct factory requirements posted by bulk buyers'}
            </span>
          </div>

          <div className="grid grid-cols-1 gap-4">
            {rfqs.map((rfq) => (
              <div
                key={rfq.id}
                className="p-5 rounded-3xl bg-[var(--pm-card)] border border-[var(--pm-border)] shadow-xs hover:border-[var(--pm-accent-border)] transition-all space-y-4"
              >
                <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-3">
                  <div className="space-y-1 min-w-0">
                    <div className="flex items-center gap-2 flex-wrap">
                      <h4 className="text-base font-black text-[var(--pm-text)]">{rfq.title}</h4>
                      {rfq.isUrgent && (
                        <span className="px-2 py-0.5 rounded-full bg-rose-500/15 text-rose-500 text-[10px] font-bold border border-rose-500/20">
                          {isBn ? 'জরুরি বিড' : 'Urgent Bid'}
                        </span>
                      )}
                      <span className="px-2 py-0.5 rounded-full bg-emerald-500/15 text-emerald-500 text-[10px] font-mono font-bold">
                        {rfq.status}
                      </span>
                    </div>
                    <p className="text-xs text-[var(--pm-muted)] line-clamp-2">{rfq.description}</p>
                  </div>

                  <button
                    type="button"
                    onClick={() => setSelectedRfqForQuote(rfq)}
                    className="px-4 py-2 rounded-xl bg-[var(--pm-accent)] hover:bg-[var(--pm-accent-hover)] text-[var(--pm-accent-fg)] font-bold text-xs flex items-center justify-center gap-1.5 shadow-sm transition-all cursor-pointer shrink-0 active-scale"
                  >
                    <Send className="w-3.5 h-3.5" />
                    <span>{isBn ? 'কোটেশন বিড দিন' : 'Submit Quotation'}</span>
                  </button>
                </div>

                {/* Specs Strip */}
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 text-xs pt-3 border-t border-[var(--pm-border)]">
                  <div>
                    <span className="text-[10px] font-bold text-[var(--pm-muted)] block">
                      {isBn ? 'প্রয়োজনীয় পরিমাণ' : 'Target Volume'}
                    </span>
                    <span className="font-mono font-bold text-[var(--pm-text)]">
                      {rfq.quantity.toLocaleString()} {rfq.unit}
                    </span>
                  </div>

                  <div>
                    <span className="text-[10px] font-bold text-[var(--pm-muted)] block">
                      {isBn ? 'বায়ারের বাজেট' : 'Target Budget'}
                    </span>
                    <span className="font-mono font-bold text-[var(--pm-text)]">{rfq.budget}</span>
                  </div>

                  <div>
                    <span className="text-[10px] font-bold text-[var(--pm-muted)] block">
                      {isBn ? 'বায়ার প্রতিষ্ঠান' : 'Buyer & Location'}
                    </span>
                    <span className="font-bold text-[var(--pm-text)] truncate block">
                      {rfq.buyerName} · {rfq.buyerRegion}
                    </span>
                  </div>

                  <div>
                    <span className="text-[10px] font-bold text-[var(--pm-muted)] block">
                      {isBn ? 'জমার শেষ তারিখ' : 'Deadline'}
                    </span>
                    <span className="font-mono text-[var(--pm-muted)]">{rfq.deadline}</span>
                  </div>
                </div>

                {/* Already Submitted Quotes */}
                {rfq.quotes && rfq.quotes.length > 0 && (
                  <div className="p-3 rounded-2xl bg-[var(--pm-surface)] border border-[var(--pm-border)] space-y-1.5">
                    <span className="text-[10px] font-black uppercase tracking-wider text-[var(--pm-muted)]">
                      {isBn ? 'জমা হওয়া কোটেশনসমূহ' : 'Current Supplier Quotes'} ({rfq.quotes.length})
                    </span>
                    <div className="space-y-1">
                      {rfq.quotes.map((q) => (
                        <div key={q.id} className="flex items-center justify-between text-xs py-1">
                          <span className="font-bold text-[var(--pm-text)]">{q.companyName}</span>
                          <div className="flex items-center gap-3">
                            <span className="font-mono font-bold text-emerald-500">৳{q.quotePrice}/unit</span>
                            <span className="text-[11px] text-[var(--pm-muted)]">{q.deliveryTime}</span>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      )}

      {/* TAB 2: PURCHASE ORDERS & ESCROW */}
      {activeTab === 'orders' && (
        <div className="space-y-4">
          <div className="flex items-center justify-between px-1">
            <span className="text-xs font-bold text-[var(--pm-muted)]">
              {isBn ? 'বায়ারদের তৈরি করা অফিশিয়াল পারচেজ অর্ডার ড্রাফট ও পেমেন্ট স্ট্যাটাস' : 'Contract drafts and escrow payment commitments'}
            </span>
          </div>

          {poDrafts.length === 0 ? (
            <div className="p-12 text-center rounded-3xl bg-[var(--pm-card)] border border-[var(--pm-border)] space-y-2">
              <Package className="w-10 h-10 text-[var(--pm-muted)] mx-auto opacity-40" />
              <p className="text-sm font-bold text-[var(--pm-text)]">
                {isBn ? 'কোনো পারচেজ অর্ডার অপেক্ষমাণ নেই' : 'No Purchase Order Drafts pending'}
              </p>
              <p className="text-xs text-[var(--pm-muted)]">
                {isBn ? 'বায়াররা হোলসেল হাবে কোটেশন অনুমোদন দিলে এখানে ড্রাফট চলে আসবে।' : 'When bulk buyers confirm RFQs in Wholesale Hub, formal PO contracts appear here.'}
              </p>
            </div>
          ) : (
            <div className="space-y-4">
              {poDrafts.map((po) => (
                <div
                  key={po.poNumber}
                  className="p-5 rounded-3xl bg-[var(--pm-card)] border border-[var(--pm-border)] shadow-xs space-y-4"
                >
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                    <div className="space-y-0.5">
                      <div className="flex items-center gap-2">
                        <span className="font-mono font-black text-sm text-[var(--pm-text)]">
                          {po.poNumber}
                        </span>
                        {po.status === 'escrow_locked' ? (
                          <span className="px-2 py-0.5 rounded-full bg-emerald-500/15 text-emerald-500 border border-emerald-500/30 text-[10px] font-bold flex items-center gap-1">
                            <Lock className="w-3 h-3" />
                            <span>{isBn ? 'এসক্রো সুরক্ষিত' : 'Escrow Locked'}</span>
                          </span>
                        ) : (
                          <span className="px-2 py-0.5 rounded-full bg-amber-500/15 text-amber-500 border border-amber-500/30 text-[10px] font-bold flex items-center gap-1">
                            <Clock className="w-3 h-3" />
                            <span>{po.status.replace(/_/g, ' ')}</span>
                          </span>
                        )}
                      </div>
                      <h5 className="text-sm font-bold text-[var(--pm-text)]">{po.product.name}</h5>
                    </div>

                    <div className="text-left sm:text-right">
                      <span className="text-[10px] font-bold text-[var(--pm-muted)] block">
                        {isBn ? 'চুক্তির মোট মূল্য' : 'Grand Total'}
                      </span>
                      <span className="text-lg font-mono font-black text-emerald-500 block">
                        ৳{po.financials.grandTotal.toLocaleString()}
                      </span>
                    </div>
                  </div>

                  {/* Buyer & Financial Grid */}
                  <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 text-xs pt-3 border-t border-[var(--pm-border)]">
                    <div>
                      <span className="text-[10px] font-bold text-[var(--pm-muted)] block">
                        {isBn ? 'বায়ার প্রতিষ্ঠান' : 'Buyer Company'}
                      </span>
                      <span className="font-bold text-[var(--pm-text)] truncate block">
                        {po.buyer.company || po.buyer.name}
                      </span>
                    </div>
                    <div>
                      <span className="text-[10px] font-bold text-[var(--pm-muted)] block">
                        {isBn ? 'পরিমাণ ও রেট' : 'Qty & Unit Price'}
                      </span>
                      <span className="font-mono font-bold text-[var(--pm-text)]">
                        {po.financials.quantity} pcs @ ৳{po.financials.unitPrice}
                      </span>
                    </div>
                    <div>
                      <span className="text-[10px] font-bold text-[var(--pm-muted)] block">
                        {isBn ? 'পেমেন্ট শর্তাবলী' : 'Payment Terms'}
                      </span>
                      <span className="font-bold text-[var(--pm-text)]">{po.paymentTermsLabel}</span>
                    </div>
                    <div>
                      <span className="text-[10px] font-bold text-[var(--pm-muted)] block">
                        {isBn ? 'ডেলিভারি জেলা' : 'Destination'}
                      </span>
                      <span className="font-bold text-[var(--pm-text)]">{po.deliveryDistrict}</span>
                    </div>
                  </div>

                  {/* Action Bar */}
                  <div className="flex items-center justify-between gap-3 pt-2">
                    <span className="text-[11px] text-[var(--pm-muted)]">
                      {isBn ? 'তৈরি হয়েছে:' : 'Created:'} <span className="font-mono">{po.createdAt.split('T')[0]}</span>
                    </span>
                    <button
                      type="button"
                      onClick={() => showSuccessToast(isBn
                        ? `PO ${po.poNumber} যাচাই হয়েছে। ডিসপ্যাচ ট্র্যাকিংয়ের জন্য এসক্রো লেনদেন প্রস্তুত।`
                        : `PO ${po.poNumber} verified. Escrow transaction ready for dispatch tracking.`)}
                      className="px-4 py-2 rounded-xl bg-[var(--pm-surface)] hover:bg-[var(--pm-card-hover)] border border-[var(--pm-border)] text-xs font-bold text-[var(--pm-text)] hover:text-[var(--pm-accent)] transition-colors cursor-pointer"
                    >
                      {isBn ? 'চালান ডাউনলোড' : 'View PO Invoice'}
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      {/* TAB 3: SAMPLE ORDERS */}
      {activeTab === 'samples' && (
        <div className="space-y-4">
          <div className="flex items-center justify-between px-1">
            <span className="text-xs font-bold text-[var(--pm-muted)]">
              {isBn ? 'বায়ারদের স্যাম্পল প্রুফিং রিকুয়েস্ট তালিকা' : 'Sample testing units requested by prospective buyers'}
            </span>
          </div>

          {sampleOrders.length === 0 ? (
            <div className="p-12 text-center rounded-3xl bg-[var(--pm-card)] border border-[var(--pm-border)] space-y-2">
              <Truck className="w-10 h-10 text-[var(--pm-muted)] mx-auto opacity-40" />
              <p className="text-sm font-bold text-[var(--pm-text)]">
                {isBn ? 'কোনো স্যাম্পল অর্ডার অপেক্ষমাণ নেই' : 'No sample orders pending'}
              </p>
            </div>
          ) : (
            <div className="space-y-3">
              {sampleOrders.map((so) => (
                <div
                  key={so.id}
                  className="p-5 rounded-3xl bg-[var(--pm-card)] border border-[var(--pm-border)] shadow-xs flex flex-col sm:flex-row sm:items-center justify-between gap-4"
                >
                  <div className="space-y-1 min-w-0">
                    <div className="flex items-center gap-2">
                      <span className="font-mono font-bold text-xs text-sky-500">{so.id}</span>
                      <span className="px-2 py-0.5 rounded-full bg-sky-500/15 text-sky-500 text-[10px] font-bold">
                        {so.status}
                      </span>
                    </div>
                    <h5 className="text-sm font-black text-[var(--pm-text)]">{so.productTitle}</h5>
                    <p className="text-xs text-[var(--pm-muted)] truncate">
                      {so.companyName} ({so.contactPerson}) · {so.phone}
                    </p>
                    <p className="text-[11px] text-[var(--pm-muted)] truncate">📍 {so.shippingAddress}</p>
                  </div>

                  <div className="flex items-center gap-3 shrink-0">
                    <div className="text-right">
                      <span className="text-[10px] text-[var(--pm-muted)] block">{isBn ? 'স্যাম্পল ফি' : 'Fee'}</span>
                      <span className="text-sm font-mono font-black text-[var(--pm-text)]">৳{so.sampleFee}</span>
                    </div>
                    <button
                      type="button"
                      onClick={() => showSuccessToast(isBn
                        ? `স্যাম্পল পার্সেল ${so.trackingCode} কুরিয়ার ডিসপ্যাচ কিউতে যোগ হয়েছে।`
                        : `Sample parcel ${so.trackingCode} queued for courier dispatch.`)}
                      className="px-4 py-2 rounded-xl bg-sky-600 hover:bg-sky-500 text-white font-bold text-xs shadow-sm transition-all cursor-pointer"
                    >
                      {isBn ? 'কুরিয়ার ডিসপ্যাচ' : 'Dispatch Sample'}
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      {/* Modal: Submit Quote to Buyer RFQ */}
      {selectedRfqForQuote && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-xs animate-fadeIn">
          <form
            onSubmit={handleSendQuote}
            className="w-full max-w-lg bg-[var(--pm-card)] text-[var(--pm-text)] border border-[var(--pm-border)] rounded-3xl p-6 shadow-2xl space-y-5"
          >
            <div className="flex items-center justify-between pb-3 border-b border-[var(--pm-border)]">
              <div>
                <h3 className="text-base font-black text-[var(--pm-text)]">
                  {isBn ? 'দরপত্র বিড জমা দিন' : 'Submit Quotation Bid'}
                </h3>
                <p className="text-xs text-[var(--pm-muted)] line-clamp-1">
                  {selectedRfqForQuote.title}
                </p>
              </div>
              <button
                type="button"
                onClick={() => setSelectedRfqForQuote(null)}
                className="p-1.5 rounded-full hover:bg-[var(--pm-card-hover)] text-[var(--pm-muted)] cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="p-3 rounded-2xl bg-[var(--pm-surface)] border border-[var(--pm-border)] text-xs space-y-1">
              <div className="flex justify-between">
                <span className="text-[var(--pm-muted)]">{isBn ? 'বায়ার:' : 'Buyer:'}</span>
                <span className="font-bold">{selectedRfqForQuote.buyerName}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-[var(--pm-muted)]">{isBn ? 'চাহিদা পরিমাণ:' : 'Volume:'}</span>
                <span className="font-mono font-bold">
                  {selectedRfqForQuote.quantity.toLocaleString()} {selectedRfqForQuote.unit}
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-[var(--pm-muted)]">{isBn ? 'টার্গেট বাজেট:' : 'Target:'}</span>
                <span className="font-mono text-emerald-500 font-bold">{selectedRfqForQuote.budget}</span>
              </div>
            </div>

            <div className="space-y-4 text-xs">
              <div className="grid grid-cols-2 gap-3">
                <div className="space-y-1">
                  <label className="font-bold text-[var(--pm-text)] block">
                    {isBn ? 'আপনার প্রতি ইউনিট মূল্য (৳)' : 'Your Unit Price (BDT ৳)'}
                  </label>
                  <input
                    type="number"
                    step="0.01"
                    required
                    value={quotePrice}
                    onChange={(e) => setQuotePrice(e.target.value)}
                    placeholder="e.g. 140"
                    className="w-full p-3 rounded-xl bg-[var(--pm-input)] border border-[var(--pm-border)] font-mono font-bold focus:border-[var(--pm-accent)] outline-none text-[var(--pm-text)]"
                  />
                </div>

                <div className="space-y-1">
                  <label className="font-bold text-[var(--pm-text)] block">
                    {isBn ? 'প্রোডাকশন ও ডেলিভারি দিন' : 'Lead Time (Days)'}
                  </label>
                  <input
                    type="number"
                    required
                    value={deliveryDays}
                    onChange={(e) => setDeliveryDays(e.target.value)}
                    placeholder="e.g. 15"
                    className="w-full p-3 rounded-xl bg-[var(--pm-input)] border border-[var(--pm-border)] font-mono font-bold focus:border-[var(--pm-accent)] outline-none text-[var(--pm-text)]"
                  />
                </div>
              </div>

              <div className="space-y-1">
                <label className="font-bold text-[var(--pm-text)] block">
                  {isBn ? 'কোটেশন বার্তা ও স্পেসিফিকেশন' : 'Quotation Proposal / Tech Specs'}
                </label>
                <textarea
                  value={quoteMessage}
                  onChange={(e) => setQuoteMessage(e.target.value)}
                  placeholder={isBn ? 'ফেব্রিক্স জিএসএম, প্যাকেজিং, ওয়েকো-টেক্স সার্টিফিকেট ইত্যাদি লিখুন...' : 'Specify fabric GSM, certified laboratory tests, or batch delivery schedule...'}
                  className="w-full p-3 rounded-xl bg-[var(--pm-input)] border border-[var(--pm-border)] min-h-[90px] focus:border-[var(--pm-accent)] outline-none text-[var(--pm-text)]"
                />
              </div>
            </div>

            <div className="flex items-center gap-3 pt-2">
              <button
                type="button"
                onClick={() => setSelectedRfqForQuote(null)}
                className="flex-1 py-3 rounded-xl bg-[var(--pm-surface)] hover:bg-[var(--pm-card-hover)] border border-[var(--pm-border)] text-xs font-bold transition-colors cursor-pointer"
              >
                {isBn ? 'বাতিল' : 'Cancel'}
              </button>
              <button
                type="submit"
                className="flex-1 py-3 rounded-xl bg-[var(--pm-accent)] hover:bg-[var(--pm-accent-hover)] text-[var(--pm-accent-fg)] text-xs font-bold shadow-md transition-colors cursor-pointer flex items-center justify-center gap-1.5"
              >
                <Send className="w-3.5 h-3.5" />
                <span>{isBn ? 'বিড পাঠান' : 'Submit Bid'}</span>
              </button>
            </div>
          </form>
        </div>
      )}
    </div>
  );
};
