export function formatBdt(amount: number): string {
  return `৳${Math.round(amount).toLocaleString('en-US')}`;
}

export function clampNumber(value: number, min: number, max: number): number {
  return Math.min(Math.max(value, min), max);
}
