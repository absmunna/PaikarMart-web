import { SellerOffer, BuyBoxResult } from '../types/catalog.types';

/**
 * Generates an Amazon-style 10-character unique ASIN / PMIN
 * Format: PM + 8 uppercase alphanumeric characters
 * Example: PM9B8X2K4L
 */
export function generateASIN(): string {
  const chars = '0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZ';
  let randomPart = '';
  for (let i = 0; i < 8; i++) {
    const randomIndex = Math.floor(Math.random() * chars.length);
    randomPart += chars[randomIndex];
  }
  return `PM${randomPart}`;
}

/**
 * Buy Box Algorithm (Featured Offer Selection Engine):
 * Evaluates competing seller offers on the Master Product:
 * - Landed Price (Price + Shipping): 45% weight
 * - Fulfillment Type (Fulfilled by PaikarMart / Prime speed): 25% weight
 * - Seller Rating & Positive Feedback: 20% weight
 * - Stock Capacity & Inventory Availability: 10% weight
 */
export function calculateBuyBox(offers: SellerOffer[]): BuyBoxResult | null {
  const activeInStockOffers = offers.filter(o => o.stock > 0);
  if (activeInStockOffers.length === 0) {
    if (offers.length === 0) return null;
    // If all are out of stock, pick the lowest price for backorder
    const sorted = [...offers].sort((a, b) => a.price - b.price);
    return {
      winner: { ...sorted[0], isBuyBoxWinner: true },
      allOffers: sorted,
      lowestPrice: sorted[0].price,
      totalSellers: offers.length
    };
  }

  // Calculate scores
  const lowestLandedPrice = Math.min(
    ...activeInStockOffers.map(o => o.price + (o.shippingFee || 0))
  );

  const scoredOffers = activeInStockOffers.map(offer => {
    const landedPrice = offer.price + (offer.shippingFee || 0);

    // Price score (0-45 pts): 45 if equal to lowest, diminishes if higher
    const priceRatio = lowestLandedPrice / landedPrice;
    const priceScore = 45 * Math.max(0, Math.min(1, priceRatio));

    // Fulfillment score (0-25 pts): FBP gets 25 pts, FBM gets 15 pts
    const fulfillmentScore = offer.fulfillmentType === 'FBP' ? 25 : 15;

    // Seller rating score (0-20 pts)
    const ratingScore = 20 * (Math.max(1, Math.min(5, offer.sellerRating)) / 5);

    // Stock score (0-10 pts)
    const stockScore = offer.stock >= 5 ? 10 : 5;

    const totalScore = Math.round(priceScore + fulfillmentScore + ratingScore + stockScore);

    return {
      ...offer,
      score: totalScore
    };
  });

  // Sort by highest score first, then by lowest landed price
  scoredOffers.sort((a, b) => {
    if (b.score !== a.score) return (b.score || 0) - (a.score || 0);
    return (a.price + a.shippingFee) - (b.price + b.shippingFee);
  });

  const winningOffer = { ...scoredOffers[0], isBuyBoxWinner: true };

  // Update original offers array preserving order
  const finalAllOffers = offers.map(o => {
    if (o.id === winningOffer.id) return winningOffer;
    return { ...o, isBuyBoxWinner: false };
  }).sort((a, b) => (a.price + a.shippingFee) - (b.price + b.shippingFee));

  return {
    winner: winningOffer,
    allOffers: finalAllOffers,
    lowestPrice: Math.min(...offers.map(o => o.price)),
    totalSellers: offers.length
  };
}
