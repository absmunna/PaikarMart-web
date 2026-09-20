/**
 * Payment gateway configuration.
 * Each gateway is "ready to activate" — flip `enabled: true` in admin to turn on.
 * Actual provider SDK wiring happens in /features/payment/providers/* (stubbed).
 */
export type PaymentGatewayId =
  | "stripe"
  | "paypal"
  | "bkash"
  | "nagad"
  | "rocket"
  | "cod"
  | "pk_coin";

export interface PaymentGatewayConfig {
  id: PaymentGatewayId;
  label: string;
  region: "global" | "local";
  currencies: string[];
  enabled: boolean;
  /** If true, the UI shows the option but checkout is mocked. */
  mock: boolean;
  iconHint?: string;
}

export const PAYMENT_GATEWAYS: PaymentGatewayConfig[] = [
  { id: "cod",     label: "Cash on Delivery", region: "local",  currencies: ["BDT", "USD"], enabled: true,  mock: true },
  { id: "bkash",   label: "bKash",            region: "local",  currencies: ["BDT"],        enabled: false, mock: true },
  { id: "nagad",   label: "Nagad",            region: "local",  currencies: ["BDT"],        enabled: false, mock: true },
  { id: "rocket",  label: "Rocket",           region: "local",  currencies: ["BDT"],        enabled: false, mock: true },
  { id: "stripe",  label: "Stripe",           region: "global", currencies: ["USD", "EUR"], enabled: false, mock: true },
  { id: "paypal",  label: "PayPal",           region: "global", currencies: ["USD"],        enabled: false, mock: true },
  { id: "pk_coin", label: "Pay with PK Coin", region: "global", currencies: ["PKC"],        enabled: true,  mock: true },
];

export function getEnabledGateways() {
  return PAYMENT_GATEWAYS.filter((g) => g.enabled);
}

export const PAYMENT_PROVIDERS = {
  bkash:  { color: '#e2136e', flow: 'otp-pin', icon: 'bkash.svg' },
  nagad:  { color: '#f37021', flow: 'otp-pin', icon: 'nagad.svg' },
  rocket: { color: '#8B0000', flow: 'otp-pin', icon: 'rocket.svg' },
  card:   { flow: 'card-form' },
  bank:   { flow: 'bank-transfer', swiftEnabled: true },
  pk_coin: { flow: 'internal' }
};

export const VAT_RATE = 0.05; // Bangladesh: 5% auto on checkout

