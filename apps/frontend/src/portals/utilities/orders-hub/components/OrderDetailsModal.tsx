import React, { useState } from 'react';
import { Order } from '@/types';
import {
  X,
  Package,
  Truck,
  CheckCircle2,
  Clock,
  MapPin,
  CreditCard,
  Store,
  ShieldCheck,
  ShoppingBag,
  RotateCcw
} from 'lucide-react';
import { useLanguage } from '@/contexts/LanguageContext';
import { LogisticsLivePanel } from '@/features/logistics';

interface OrderDetailsModalProps {
  isOpen: boolean;
  onClose: () => void;
  order: Order | null;
  onReorder?: (order: Order) => Promise<void>;
  onConfirmDelivery?: (order: Order) => Promise<void>;
}

export const OrderDetailsModal: React.FC<OrderDetailsModalProps> = ({
  isOpen,
  onClose,
  order,
  onReorder,
  onConfirmDelivery
}) => {
  const { language } = useLanguage();
  const isBn = language === 'bn';
  const [busyAction, setBusyAction] = useState<'reorder' | 'deliver' | null>(null);

  if (!isOpen || !order) return null;

  const trackingSteps = [
    {
      step: 1,
      label: isBn ? 'অর্ডার প্লেসড' : 'Order Confirmed',
      icon: CheckCircle2,
      desc: isBn ? 'মার্চেন্ট প্রাপ্তি স্বীকার করেছে' : 'Merchant acknowledged order'
    },
    {
      step: 2,
      label: isBn ? 'প্রস্তুত হচ্ছে' : 'Preparing Order',
      icon: Package,
      desc: isBn ? 'প্যাকেজিং ও কোয়ালিটি চেক চলছে' : 'Packing & quality check in progress'
    },
    {
      step: 3,
      label: isBn ? 'কুরিয়ার ডেলিভারিতে' : 'In Transit',
      icon: Truck,
      desc: isBn ? 'রাইডার গন্তব্যে রওনা দিয়েছে' : 'Rider is on the way to your address'
    },
    {
      step: 4,
      label: isBn ? 'ডেলিভারি সম্পন্ন' : 'Delivered',
      icon: ShieldCheck,
      desc: isBn ? 'গ্রাহক দ্বারা পার্সেল গ্রহণ' : 'Package successfully handed over'
    }
  ];

  const currentStep =
    order.trackingStep ||
    (order.status === 'confirmed'
      ? 1
      : order.status === 'preparing'
      ? 2
      : order.status === 'in_transit'
      ? 3
      : 4);

  const statusTone =
    order.status === 'delivered'
      ? 'text-[var(--pm-success)]'
      : order.status === 'in_transit'
      ? 'text-[var(--pm-accent)]'
      : order.status === 'preparing'
      ? 'text-[var(--pm-warning)]'
      : 'text-[var(--pm-muted)]';

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-black/70 backdrop-blur-xs animate-fade-in">
      <div className="bg-[var(--pm-card)] text-[var(--pm-text)] border border-[var(--pm-border)] rounded-[2rem] w-full max-w-2xl shadow-2xl overflow-hidden flex flex-col max-h-[90vh]">
        {/* Header */}
        <div className="p-5 border-b border-[var(--pm-border)] flex items-center justify-between shrink-0 bg-[var(--pm-surface)]">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-[1.25rem] bg-[var(--pm-accent)] text-[var(--pm-accent-fg)] flex items-center justify-center shadow-md shrink-0">
              <ShoppingBag className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center gap-2 text-xs">
                <h3 className="text-base font-black text-[var(--pm-text)] font-mono">
                  #{order.id}
                </h3>
                <span aria-hidden="true" className="text-[var(--pm-muted)]">
                  ·
                </span>
                <span className={`font-bold ${statusTone}`}>
                  {order.status.replace('_', ' ')}
                </span>
              </div>
              <p className="text-xs text-[var(--pm-muted)] font-mono">
                {isBn ? `অর্ডার তারিখ: ${order.createdAt}` : `Placed on: ${order.createdAt}`}
              </p>
            </div>
          </div>

          <button
            type="button"
            onClick={onClose}
            className="p-2 rounded-full text-[var(--pm-muted)] hover:text-[var(--pm-text)] hover:bg-[var(--pm-card-hover)] transition-colors cursor-pointer"
            aria-label="Close modal"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content Body */}
        <div className="flex-1 overflow-y-auto p-5 space-y-5 no-scrollbar">
          {/* 4-Step Order Lifecycle Progress */}
          <div className="p-4 sm:p-5 rounded-[1.75rem] bg-[var(--pm-surface)] border border-[var(--pm-border)] space-y-4">
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold text-[var(--pm-accent)] flex items-center gap-1.5">
                <Clock className="w-4 h-4" />
                {isBn ? 'লাইভ অর্ডার স্টেটাস' : 'Order Lifecycle Progress'}
              </span>
              <span className="text-xs font-bold text-[var(--pm-text)] font-mono tabular-nums">
                {isBn ? `সম্ভাব্য পৌঁছানো: ${order.estimatedArrival}` : `Est. Arrival: ${order.estimatedArrival}`}
              </span>
            </div>

            <div className="relative pt-2 pb-4">
              <div className="absolute top-6 left-6 right-6 h-1 bg-[var(--pm-border)] rounded-full z-0" />
              <div
                className="absolute top-6 left-6 h-1 bg-[var(--pm-accent)] rounded-full z-0 transition-all duration-500"
                style={{ width: `${((currentStep - 1) / 3) * 100}%` }}
              />

              <div className="relative z-10 flex items-start justify-between">
                {trackingSteps.map((s) => {
                  const Icon = s.icon;
                  const isDone = currentStep >= s.step;
                  const isCurrent = currentStep === s.step;

                  return (
                    <div key={s.step} className="flex flex-col items-center text-center max-w-[96px]">
                      <div
                        className={`w-9 h-9 rounded-full flex items-center justify-center transition-all ring-4 ring-[var(--pm-surface)] ${
                          isDone
                            ? 'bg-[var(--pm-accent)] text-[var(--pm-accent-fg)] shadow-md'
                            : 'bg-[var(--pm-card)] text-[var(--pm-muted)] border border-[var(--pm-border)]'
                        } ${isCurrent ? 'scale-110' : ''}`}
                      >
                        <Icon className="w-4 h-4" />
                      </div>
                      <span
                        className={`text-[11px] font-bold mt-2 leading-tight ${
                          isDone ? 'text-[var(--pm-text)]' : 'text-[var(--pm-muted)]'
                        }`}
                      >
                        {s.label}
                      </span>
                    </div>
                  );
                })}
              </div>
            </div>

            <div className="p-3 rounded-[1.25rem] bg-[var(--pm-card)] border border-[var(--pm-border)] flex items-center justify-between text-xs">
              <span className="font-semibold text-[var(--pm-text)]">
                {trackingSteps[currentStep - 1]?.desc}
              </span>
              <span className="text-[11px] font-mono tabular-nums font-semibold text-[var(--pm-muted)]">
                Step {currentStep} / 4
              </span>
            </div>
          </div>

          {/* Live Courier Logistics Panel (Waybill, Partner Network, Rider & Checkpoints) */}
          <LogisticsLivePanel
            orderId={order.id}
            deliveryAddress={order.deliveryAddress}
            isBn={isBn}
            allowCheckpointUpdate={order.status !== 'delivered'}
          />

          {/* Merchant, Location & Payment Info */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            <div className="p-3.5 rounded-[1.25rem] bg-[var(--pm-surface)] border border-[var(--pm-border)] space-y-1">
              <span className="text-[11px] font-semibold text-[var(--pm-muted)] flex items-center gap-1">
                <Store className="w-3.5 h-3.5" />
                {isBn ? 'বিক্রেতা' : 'Merchant'}
              </span>
              <p className="text-xs font-bold text-[var(--pm-text)] truncate">
                {order.storeName || order.items[0]?.product.storeName || 'PaikarMart Store'}
              </p>
            </div>

            <div className="p-3.5 rounded-[1.25rem] bg-[var(--pm-surface)] border border-[var(--pm-border)] space-y-1">
              <span className="text-[11px] font-semibold text-[var(--pm-muted)] flex items-center gap-1">
                <MapPin className="w-3.5 h-3.5 text-rose-500" />
                {isBn ? 'ডেলিভারি ঠিকানা' : 'Delivery Location'}
              </span>
              <p className="text-xs text-[var(--pm-text)] leading-snug line-clamp-2">
                {order.deliveryAddress}
              </p>
            </div>

            <div className="p-3.5 rounded-[1.25rem] bg-[var(--pm-surface)] border border-[var(--pm-border)] space-y-1">
              <span className="text-[11px] font-semibold text-[var(--pm-muted)] flex items-center gap-1">
                <CreditCard className="w-3.5 h-3.5 text-[var(--pm-accent)]" />
                {isBn ? 'পেমেন্ট' : 'Payment'}
              </span>
              <p className="text-xs font-bold text-[var(--pm-text)] truncate">
                {order.paymentMethod}
              </p>
            </div>
          </div>

          {/* Itemized Order Items */}
          <div className="space-y-2.5">
            <h4 className="text-xs font-bold text-[var(--pm-muted)]">
              {isBn ? 'অর্ডারকৃত পণ্য' : 'Ordered Items'} ({order.items.reduce((acc, i) => acc + i.quantity, 0)})
            </h4>

            <div className="bg-[var(--pm-surface)] rounded-[1.5rem] p-3.5 border border-[var(--pm-border)] divide-y divide-[var(--pm-border)]">
              {order.items.map((item, idx) => (
                <div key={idx} className="py-2.5 first:pt-0 last:pb-0 flex items-center justify-between gap-3">
                  <div className="flex items-center gap-3 min-w-0">
                    <img
                      src={item.product.imageUrl}
                      alt={item.product.title}
                      referrerPolicy="no-referrer"
                      className="w-11 h-11 rounded-[1rem] object-cover border border-[var(--pm-border)] shrink-0"
                    />
                    <div className="min-w-0">
                      <h5 className="text-xs font-bold text-[var(--pm-text)] truncate">
                        {item.product.title}
                      </h5>
                      <div className="flex items-center gap-2 text-[11px] text-[var(--pm-muted)] font-mono">
                        <span>Qty: {item.quantity}</span>
                        <span aria-hidden="true">·</span>
                        <span className="text-[var(--pm-accent)] font-semibold">
                          {item.isWholesale ? 'Wholesale Tier' : 'Retail'}
                        </span>
                      </div>
                    </div>
                  </div>

                  <span className="text-xs font-bold text-[var(--pm-text)] font-mono tabular-nums shrink-0">
                    ৳{(item.product.price * item.quantity).toLocaleString()}
                  </span>
                </div>
              ))}
            </div>
          </div>

          {/* Order Financial Summary (BDT) */}
          <div className="bg-[var(--pm-surface)] rounded-[1.5rem] p-4 border border-[var(--pm-border)] space-y-2 text-xs">
            <div className="flex justify-between text-[var(--pm-muted)]">
              <span>Subtotal</span>
              <span className="font-mono tabular-nums">৳{order.subtotal.toLocaleString()}</span>
            </div>
            <div className="flex justify-between text-[var(--pm-muted)]">
              <span>Delivery Fee</span>
              <span className="font-mono tabular-nums">৳{order.deliveryFee.toLocaleString()}</span>
            </div>
            <div className="flex justify-between text-[var(--pm-muted)]">
              <span>Tax / VAT</span>
              <span className="font-mono tabular-nums">৳{order.tax.toLocaleString()}</span>
            </div>
            <div className="pt-2 border-t border-[var(--pm-border)] flex justify-between font-black text-sm text-[var(--pm-text)]">
              <span>Total Paid</span>
              <span className="text-[var(--pm-accent)] font-mono tabular-nums">
                ৳{order.total.toLocaleString()}
              </span>
            </div>
          </div>
        </div>

        {/* Modal Footer */}
        <div className="p-4 border-t border-[var(--pm-border)] bg-[var(--pm-surface)] flex flex-wrap items-center justify-between gap-2">
          <div className="flex items-center gap-2">
            {onReorder && (
              <button
                type="button"
                disabled={busyAction !== null}
                onClick={async () => {
                  setBusyAction('reorder');
                  try {
                    await onReorder(order);
                    onClose();
                  } finally {
                    setBusyAction(null);
                  }
                }}
                className="px-4 py-2 rounded-[2rem] bg-[var(--pm-card)] hover:bg-[var(--pm-card-hover)] border border-[var(--pm-border)] text-[var(--pm-text)] text-xs font-bold flex items-center gap-1.5 active-scale cursor-pointer"
              >
                <RotateCcw className="w-3.5 h-3.5" />
                <span>{busyAction === 'reorder' ? '...' : isBn ? 'পুনরায় অর্ডার' : 'Reorder'}</span>
              </button>
            )}

            {onConfirmDelivery && order.status !== 'delivered' && (
              <button
                type="button"
                disabled={busyAction !== null}
                onClick={async () => {
                  setBusyAction('deliver');
                  try {
                    await onConfirmDelivery(order);
                  } finally {
                    setBusyAction(null);
                  }
                }}
                className="px-4 py-2 rounded-[2rem] bg-[var(--pm-success)] hover:opacity-90 text-white text-xs font-bold flex items-center gap-1.5 active-scale cursor-pointer"
              >
                <CheckCircle2 className="w-3.5 h-3.5" />
                <span>{busyAction === 'deliver' ? '...' : isBn ? 'ডেলিভারি নিশ্চিত' : 'Confirm Received'}</span>
              </button>
            )}
          </div>

          <button
            type="button"
            onClick={onClose}
            className="px-6 py-2 rounded-[2rem] bg-[var(--pm-accent)] hover:bg-[var(--pm-accent-hover)] text-[var(--pm-accent-fg)] text-xs font-bold transition-all cursor-pointer active-scale"
          >
            {isBn ? 'বন্ধ করুন' : 'Close'}
          </button>
        </div>
      </div>
    </div>
  );
};
