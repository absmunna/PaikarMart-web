export const CURRENCY_SYMBOL = "৳";

export function formatBDT(value: number | null | undefined, opts: { decimals?: boolean } = {}): string {
  if (value == null || Number.isNaN(value)) return `${CURRENCY_SYMBOL}—`;
  const decimals = opts.decimals ?? false;
  const n = decimals ? value : Math.round(value);
  return `${CURRENCY_SYMBOL}${n.toLocaleString("en-IN", { maximumFractionDigits: decimals ? 2 : 0 })}`;
}

export function discountPercent(price: number, compareAt?: number | null): number | null {
  if (!compareAt || compareAt <= price) return null;
  return Math.round(((compareAt - price) / compareAt) * 100);
}
