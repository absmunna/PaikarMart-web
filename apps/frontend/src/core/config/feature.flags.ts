/**
 * Feature flag system — single source of truth for what is ON/OFF.
 * Admin can toggle these via /admin/settings (UI persists to localStorage; in
 * production these will be backed by a server-side `feature_flags` table).
 */
export type FeatureFlagKey =
  | "auth.user.register"
  | "auth.seller.register"
  | "auth.otp"
  | "cart.enabled"
  | "wishlist.enabled"
  | "buyNow.enabled"
  | "digitalContent.enabled"
  | "digitalContent.preview"
  | "pkCoin.enabled"
  | "profitShare.enabled"
  | "location.detect"
  | "location.nearby"
  | "ai.productAssistant"
  | "admin.panel"
  | "darkMode"
  | "theme.eyeComfort"
  | "theme.colorful";

export const DEFAULT_FEATURE_FLAGS: Record<FeatureFlagKey, boolean> = {
  "auth.user.register": true,
  "auth.seller.register": true,
  "auth.otp": false,                 // structure ready, gateway not connected
  "cart.enabled": true,
  "wishlist.enabled": true,
  "buyNow.enabled": true,
  "digitalContent.enabled": true,
  "digitalContent.preview": true,
  "pkCoin.enabled": true,
  "profitShare.enabled": true,
  "location.detect": true,
  "location.nearby": true,
  "ai.productAssistant": true,
  "admin.panel": true,
  "darkMode": true,
  "theme.eyeComfort": true,
  "theme.colorful": true,
};

const STORAGE_KEY = "pm.feature.flags.v1";

export function getFlags(): Record<FeatureFlagKey, boolean> {
  if (typeof window === "undefined") return { ...DEFAULT_FEATURE_FLAGS };
  try {
    const raw = window.localStorage.getItem(STORAGE_KEY);
    if (!raw) return { ...DEFAULT_FEATURE_FLAGS };
    return { ...DEFAULT_FEATURE_FLAGS, ...JSON.parse(raw) };
  } catch {
    return { ...DEFAULT_FEATURE_FLAGS };
  }
}

export function setFlag(key: FeatureFlagKey, value: boolean) {
  if (typeof window === "undefined") return;
  const next = { ...getFlags(), [key]: value };
  window.localStorage.setItem(STORAGE_KEY, JSON.stringify(next));
  window.dispatchEvent(new CustomEvent("pm:flags:changed"));
}

export function isEnabled(key: FeatureFlagKey): boolean {
  return !!getFlags()[key];
}
