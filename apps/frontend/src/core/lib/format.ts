export function formatBDT(value: number | string | any): string {
  const num = typeof value === 'number' ? value : Number(value);
  if (isNaN(num)) return '৳ 0';
  return `৳ ${num.toLocaleString('en-IN')}`;
}
