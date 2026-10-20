import { create } from 'zustand';

export type CheckoutStep = 'address' | 'delivery' | 'payment' | 'review' | 'success';

interface CheckoutState {
  step: CheckoutStep;
  addressId: string | null;
  deliveryMethod: string | null;
  paymentMethod: string | null;
  couponCode: string | null;
  isProcessing: boolean;
  
  setStep: (step: CheckoutStep) => void;
  setAddress: (id: string) => void;
  setDeliveryMethod: (method: string) => void;
  setPaymentMethod: (method: string) => void;
  setCoupon: (code: string) => void;
  resetCheckout: () => void;
}

export const useCheckoutStore = create<CheckoutState>((set) => ({
  step: 'address',
  addressId: null,
  deliveryMethod: null,
  paymentMethod: null,
  couponCode: null,
  isProcessing: false,

  setStep: (step) => set({ step }),
  setAddress: (addressId) => set({ addressId }),
  setDeliveryMethod: (deliveryMethod) => set({ deliveryMethod }),
  setPaymentMethod: (paymentMethod) => set({ paymentMethod }),
  setCoupon: (couponCode) => set({ couponCode }),
  resetCheckout: () => set({
    step: 'address',
    addressId: null,
    deliveryMethod: null,
    paymentMethod: null,
    couponCode: null,
    isProcessing: false
  })
}));
