import React, { useState } from 'react';
import { 
  CheckCircle2, 
  Package, 
  Truck, 
  MapPin, 
  Clock, 
  Copy, 
  Check, 
  Navigation, 
  PhoneCall, 
  ShieldCheck, 
  ChevronRight,
  RotateCw
} from 'lucide-react';
import { Order } from '@/types';

interface OrderTrackingStepperProps {
  order: Order;
  onUpdateOrder?: (updatedOrder: Order) => void;
  compact?: boolean;
}

interface StepDefinition {
  step: number;
  label: string;
  sublabel: string;
  detail: string;
  icon: React.ComponentType<{ className?: string }>;
}

const STEPS: StepDefinition[] = [
  {
    step: 1,
    label: 'Order Placed',
    sublabel: 'Payment Confirmed',
    detail: 'Order received and inventory reserved by vendor.',
    icon: CheckCircle2,
  },
  {
    step: 2,
    label: 'Packed & Dispatched',
    sublabel: 'Fulfillment Center',
    detail: 'Quality checked, packaged, and handed over to logistics hub.',
    icon: Package,
  },
  {
    step: 3,
    label: 'Out for Delivery',
    sublabel: 'In Transit',
    detail: 'Express courier is on route to your delivery address.',
    icon: Truck,
  },
  {
    step: 4,
    label: 'Delivered',
    sublabel: 'Arrived at Doorstep',
    detail: 'Package delivered safely. Signature on file.',
    icon: MapPin,
  },
];

export const OrderTrackingStepper: React.FC<OrderTrackingStepperProps> = ({
  order,
  onUpdateOrder,
  compact = false,
}) => {
  const [copied, setCopied] = useState(false);
  const currentStep = order.trackingStep || (
    order.status === 'delivered' ? 4 :
    order.status === 'in_transit' ? 3 :
    order.status === 'preparing' ? 2 : 1
  );

  const trackingNumber = `PM-TRK-${order.id.replace(/[^0-9]/g, '').slice(0, 6) || '784920'}-EXP`;

  const handleCopyTracking = () => {
    try {
      navigator.clipboard.writeText(trackingNumber);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch {
      // Fallback
    }
  };

  const handleSimulateNextStep = () => {
    if (!onUpdateOrder) return;
    const nextStep = currentStep >= 4 ? 1 : currentStep + 1;
    const nextStatus: Order['status'] = 
      nextStep === 4 ? 'delivered' :
      nextStep === 3 ? 'in_transit' :
      nextStep === 2 ? 'preparing' : 'confirmed';

    const nextArrival = 
      nextStep === 4 ? 'Delivered safely at front desk' :
      nextStep === 3 ? 'Arriving in ~20-30 minutes' :
      nextStep === 2 ? 'Expected departure in 1 hour' : '1 - 2 business days';

    const updated: Order = {
      ...order,
      trackingStep: nextStep,
      status: nextStatus,
      estimatedArrival: nextArrival,
    };

    onUpdateOrder(updated);
  };

  return (
    <div className="bg-[var(--pm-surface)] border border-[var(--pm-border)] rounded-2xl p-4 sm:p-5 space-y-5 animate-fadeIn">
      
      {/* Top Bar: Live Status & Tracking Number */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3 border-b border-[var(--pm-border)]">
        <div className="flex items-center gap-2">
          <div className="w-2.5 h-2.5 rounded-full bg-[var(--pm-accent)] animate-ping" />
          <span className="text-xs font-black uppercase tracking-wider text-[var(--pm-text)]">
            Shipping Progress
          </span>
          <span className={`px-2 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wide ${
            currentStep === 4
              ? 'bg-[var(--pm-success-soft)] text-[var(--pm-success)]'
              : currentStep === 3
              ? 'bg-[var(--pm-accent-soft)] text-[var(--pm-accent)]'
              : 'bg-[var(--pm-warning-soft)] text-[var(--pm-warning)]'
          }`}>
            Step {currentStep} of 4: {STEPS[currentStep - 1]?.label}
          </span>
        </div>

        <div className="flex items-center gap-2 text-xs">
          <span className="text-[var(--pm-muted)] font-medium">Tracking #:</span>
          <button
            onClick={handleCopyTracking}
            className="flex items-center gap-1 font-mono font-bold text-[var(--pm-text)] bg-[var(--pm-card)] px-2 py-1 rounded-lg border border-[var(--pm-border)] hover:border-[var(--pm-accent)] transition-colors cursor-pointer"
            title="Click to copy tracking code"
          >
            <span>{trackingNumber}</span>
            {copied ? (
              <Check className="w-3 h-3 text-[var(--pm-success)]" />
            ) : (
              <Copy className="w-3 h-3 text-[var(--pm-muted)]" />
            )}
          </button>
        </div>
      </div>

      {/* Visual Stepper Component */}
      <div className="relative pt-2 pb-1">
        {/* Horizontal Stepper (Desktop & Tablet) */}
        <div className="hidden sm:grid sm:grid-cols-4 gap-2 relative">
          
          {/* Background Connector Bar */}
          <div className="absolute top-5 left-[12.5%] right-[12.5%] h-1 bg-[var(--pm-border)] -z-0 rounded-full" />
          
          {/* Active Progress Connector Bar */}
          <div 
            className="absolute top-5 left-[12.5%] h-1 bg-[var(--pm-accent)] -z-0 rounded-full transition-all duration-500 ease-out"
            style={{
              width: `${Math.max(0, ((currentStep - 1) / 3) * 75)}%`
            }}
          />

          {STEPS.map((s) => {
            const isCompleted = s.step < currentStep;
            const isCurrent = s.step === currentStep;
            const Icon = s.icon;

            return (
              <div key={s.step} className="flex flex-col items-center text-center relative z-10 px-1">
                {/* Step Circle Node */}
                <div 
                  className={`w-10 h-10 rounded-full flex items-center justify-center transition-all duration-300 shadow-sm ${
                    isCompleted
                      ? 'bg-[var(--pm-success)] text-white ring-4 ring-[var(--pm-success-soft)]'
                      : isCurrent
                      ? 'bg-[var(--pm-accent)] text-[var(--pm-accent-fg)] ring-4 ring-[var(--pm-accent-soft)] scale-110 shadow-lg'
                      : 'bg-[var(--pm-card)] text-[var(--pm-muted)] border-2 border-[var(--pm-border)]'
                  }`}
                >
                  {isCompleted ? (
                    <CheckCircle2 className="w-5 h-5 text-white" />
                  ) : (
                    <Icon className="w-5 h-5" />
                  )}
                </div>

                {/* Step Text Info */}
                <div className="mt-3 space-y-0.5">
                  <p className={`text-xs font-bold leading-tight ${
                    isCurrent 
                      ? 'text-[var(--pm-accent)]' 
                      : isCompleted 
                      ? 'text-[var(--pm-text)]' 
                      : 'text-[var(--pm-muted)]'
                  }`}>
                    {s.label}
                  </p>
                  <p className="text-[10px] text-[var(--pm-muted)]">
                    {s.sublabel}
                  </p>
                </div>
              </div>
            );
          })}
        </div>

        {/* Vertical Stepper (Mobile Optimized) */}
        <div className="sm:hidden space-y-4 relative pl-3">
          {/* Vertical Continuous Progress Line */}
          <div className="absolute top-4 bottom-4 left-7 w-0.5 bg-[var(--pm-border)]" />
          <div 
            className="absolute top-4 left-7 w-0.5 bg-[var(--pm-accent)] transition-all duration-500" 
            style={{
              height: `${Math.min(100, ((currentStep - 1) / 3) * 100)}%`
            }}
          />

          {STEPS.map((s) => {
            const isCompleted = s.step < currentStep;
            const isCurrent = s.step === currentStep;
            const Icon = s.icon;

            return (
              <div key={s.step} className="flex items-start gap-3 relative z-10">
                <div 
                  className={`w-8 h-8 rounded-full flex items-center justify-center shrink-0 transition-all shadow-xs ${
                    isCompleted
                      ? 'bg-[var(--pm-success)] text-white'
                      : isCurrent
                      ? 'bg-[var(--pm-accent)] text-[var(--pm-accent-fg)] ring-4 ring-[var(--pm-accent-soft)] shadow-md'
                      : 'bg-[var(--pm-card)] text-[var(--pm-muted)] border border-[var(--pm-border)]'
                  }`}
                >
                  {isCompleted ? (
                    <CheckCircle2 className="w-4 h-4 text-white" />
                  ) : (
                    <Icon className="w-4 h-4" />
                  )}
                </div>

                <div className="flex-1 min-w-0 pt-0.5">
                  <div className="flex items-center justify-between">
                    <p className={`text-xs font-bold ${
                      isCurrent 
                        ? 'text-[var(--pm-accent)]' 
                        : isCompleted 
                        ? 'text-[var(--pm-text)]' 
                        : 'text-[var(--pm-muted)]'
                    }`}>
                      {s.label}
                    </p>
                    {isCurrent && (
                      <span className="text-[9px] font-bold px-1.5 py-0.5 rounded-sm bg-[var(--pm-accent-soft)] text-[var(--pm-accent)]">
                        Active
                      </span>
                    )}
                  </div>
                  <p className="text-[11px] text-[var(--pm-muted)] mt-0.5">
                    {s.detail}
                  </p>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Shipment ETA & Courier Info Card */}
      <div className="p-3.5 rounded-xl bg-[var(--pm-card)] border border-[var(--pm-border)] grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
        <div className="flex items-center gap-2.5">
          <div className="w-8 h-8 rounded-lg bg-[var(--pm-accent-soft)] text-[var(--pm-accent)] flex items-center justify-center shrink-0">
            <Clock className="w-4 h-4" />
          </div>
          <div>
            <p className="text-[10px] uppercase font-bold text-[var(--pm-muted)]">Estimated Arrival</p>
            <p className="font-semibold text-[var(--pm-text)]">
              {order.estimatedArrival || 'Today · 30 - 45 Minutes'}
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2.5">
          <div className="w-8 h-8 rounded-lg bg-[var(--pm-success-soft)] text-[var(--pm-success)] flex items-center justify-center shrink-0">
            <MapPin className="w-4 h-4" />
          </div>
          <div className="min-w-0 flex-1">
            <p className="text-[10px] uppercase font-bold text-[var(--pm-muted)]">Delivery Address</p>
            <p className="font-semibold text-[var(--pm-text)] truncate">
              {order.deliveryAddress || '742 Market St, San Francisco, CA'}
            </p>
          </div>
        </div>
      </div>

      {/* Simulator Action for Testing Stepper Progress */}
      {onUpdateOrder && (
        <div className="flex items-center justify-between pt-1">
          <span className="text-[11px] text-[var(--pm-muted)]">
            Demo shipping simulation mode active
          </span>
          <button
            onClick={handleSimulateNextStep}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-[var(--pm-accent-soft)] text-[var(--pm-accent)] hover:bg-[var(--pm-accent)] hover:text-[var(--pm-accent-fg)] text-xs font-bold transition-all cursor-pointer border border-[var(--pm-accent-border)]"
            title="Advance the stepper to the next step for testing"
          >
            <RotateCw className="w-3.5 h-3.5" />
            <span>Simulate Step {currentStep < 4 ? currentStep + 1 : 1}</span>
          </button>
        </div>
      )}

    </div>
  );
};
