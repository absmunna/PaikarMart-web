/**
 * Profit share configuration.
 * NEVER hardcode numbers in business logic — always read from this config.
 * Admin can override at runtime via /admin/settings (saved to localStorage now,
 * to a `platform_settings` table when the backend is wired up).
 *
 * All percentages are 0..100. They MUST sum to <= 100.
 */
export interface ProfitShareConfig {
  enabled: boolean;
  /** Cut taken by PaikarMart on every sale. */
  platformPercent: number;
  /** Share returned to the seller. */
  sellerPercent: number;
  /** Share routed to an affiliate / referrer when present. */
  affiliatePercent: number;
  /** PK Coin reward minted for the buyer when buying a platform-owned product. */
  pkCoinRewardPercent: number;
  /** Only platform-owned products earn PK Coin. */
  pkCoinOnlyOnOwnProducts: boolean;
}

const STORAGE_KEY = "pm.profitShare.v1";

export const DEFAULT_PROFIT_SHARE: ProfitShareConfig = {
  enabled: true,
  platformPercent: 8,
  sellerPercent: 90,
  affiliatePercent: 2,
  pkCoinRewardPercent: 3,
  pkCoinOnlyOnOwnProducts: true,
};

export function getProfitShare(): ProfitShareConfig {
  if (typeof window === "undefined") return { ...DEFAULT_PROFIT_SHARE };
  try {
    const raw = window.localStorage.getItem(STORAGE_KEY);
    if (!raw) return { ...DEFAULT_PROFIT_SHARE };
    return { ...DEFAULT_PROFIT_SHARE, ...JSON.parse(raw) };
  } catch {
    return { ...DEFAULT_PROFIT_SHARE };
  }
}

export function setProfitShare(next: Partial<ProfitShareConfig>) {
  if (typeof window === "undefined") return;
  const merged = { ...getProfitShare(), ...next };
  window.localStorage.setItem(STORAGE_KEY, JSON.stringify(merged));
  window.dispatchEvent(new CustomEvent("pm:profit:changed"));
}

export function splitOrderProfit(total: number, hasAffiliate: boolean) {
  const cfg = getProfitShare();
  if (!cfg.enabled) return { platform: 0, seller: total, affiliate: 0 };
  const affiliate = hasAffiliate ? (total * cfg.affiliatePercent) / 100 : 0;
  const platform = (total * cfg.platformPercent) / 100;
  const seller = total - platform - affiliate;
  return { platform, seller, affiliate };
}
