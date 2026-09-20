import { SellerTier } from '@/modules/cart/store/useCartStore';

export function calculateCommission(
  totalAmount: number,
  sellerTier: SellerTier | 'rider',
  isBulkOrder: boolean = false
) {
  let commissionRate = 0;

  switch (sellerTier) {
    case 'factory':
      // 3-5% for factories, let's use 3%
      commissionRate = 0.03;
      break;
    case 'wholesaler':
      // 5-8% for wholesalers, let's use 5%
      commissionRate = 0.05;
      break;
    case 'local_shop':
      // 8-10% for local shops, let's use 8%
      commissionRate = 0.08;
      break;
    case 'rider':
      // Fixed fee 50 BDT, not rate based.
      return { commissionRate: 0, commissionAmount: 50 };
  }

  let commissionAmount = totalAmount * commissionRate;

  // Apply bulk order discount (e.g. 10% discount on the commission itself if it's large scale)
  if (isBulkOrder && totalAmount > 10000) {
    commissionAmount *= 0.9;
  }

  return {
    commissionRate,
    commissionAmount: parseFloat(commissionAmount.toFixed(2)),
  };
}
