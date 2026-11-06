export function formatPrice(price: number | undefined | null): string {
  if (price === undefined || price === null) return "৳ 0";
  return `৳ ${price.toLocaleString("en-BD")}`;
}
export default formatPrice;
