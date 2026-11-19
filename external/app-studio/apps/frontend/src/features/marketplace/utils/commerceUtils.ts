import { CommerceItem } from '@/types';

/**
 * Calculates the unit price for a commerce item based on quantity and tiered pricing.
 */
export const getEffectiveUnitPrice = (item: CommerceItem, quantity: number): number => {
  const isWholesale = item.tradeMode === 'wholesale' || item.type === 'wholesale';
  
  if (!isWholesale) {
    return item.price;
  }

  const moq = item.minWholesaleQty || 20;

  // Use defined tiers if available
  if (item.wholesaleTiers && item.wholesaleTiers.length > 0) {
    const matchedTier = [...item.wholesaleTiers]
      .sort((a, b) => b.minQty - a.minQty)
      .find(t => quantity >= t.minQty);
    
    if (matchedTier) {
      return matchedTier.pricePerUnit;
    }
  }

  // Standard volume discount fallbacks if no tiers defined
  if (quantity >= moq * 5) return Math.round(item.price * 0.7);
  if (quantity >= moq * 2) return Math.round(item.price * 0.8);
  return Math.round(item.price * 0.9);
};

/**
 * Formats currency values for display.
 */
export const formatCurrency = (amount: number): string => {
  return `৳${amount.toLocaleString()}`;
};
