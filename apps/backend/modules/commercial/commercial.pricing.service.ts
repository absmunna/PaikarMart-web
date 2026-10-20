import { prisma, db } from '../../config/database';

export interface PriceTier {
  id?: string;
  minUnits: number;
  maxUnits: number | null; // null represents unbounded (e.g. 100+)
  unitPrice: number;
  label?: string;
  discountPercentage?: number;
}

export interface PricingCalculationResult {
  productId: string;
  productName: string;
  requestedQuantity: number;
  moq: number;
  isMoqMet: boolean;
  baseUnitPrice: number;
  effectiveUnitPrice: number;
  totalAmount: number;
  originalTotalAmount: number;
  totalSavings: number;
  savingsPercentage: number;
  appliedTier: PriceTier | null;
  availableTiers: PriceTier[];
  isBulkDiscountApplied: boolean;
  currency: string;
}

// Built-in tiered pricing catalogs for PaikarMart's commercial inventory
const DEFAULT_PRODUCT_TIERS: Record<string, { name: string; moq: number; basePrice: number; tiers: PriceTier[] }> = {
  'b2b-05': {
    name: 'Wholesale Cotton Polo Shirts (Pack of 50)',
    moq: 10,
    basePrice: 7500,
    tiers: [
      { minUnits: 10, maxUnits: 49, unitPrice: 7500, label: '১০ - ৪৯ প্যাক (বেসিক রেট)', discountPercentage: 0 },
      { minUnits: 50, maxUnits: 99, unitPrice: 6800, label: '৫০ - ৯৯ প্যাক (পাইকারি ছাড়)', discountPercentage: 9.3 },
      { minUnits: 100, maxUnits: null, unitPrice: 5900, label: '১০০+ প্যাক (মেগা ডিলার রেট)', discountPercentage: 21.3 }
    ]
  },
  'b2b-06': {
    name: 'Factory Direct Leather Footwear (20 Pairs)',
    moq: 5,
    basePrice: 18000,
    tiers: [
      { minUnits: 5, maxUnits: 19, unitPrice: 18000, label: '৫ - ১৯ কার্টুন (স্ট্যান্ডার্ড রেট)', discountPercentage: 0 },
      { minUnits: 20, maxUnits: 49, unitPrice: 16500, label: '২০ - ৪৯ কার্টুন (ডিলার ছাড়)', discountPercentage: 8.3 },
      { minUnits: 50, maxUnits: null, unitPrice: 14500, label: '৫০+ কার্টুন (ফ্যাক্টরি রেট)', discountPercentage: 19.4 }
    ]
  },
  'pk-01': {
    name: 'প্রিমিয়াম লেদার ওয়ালেট',
    moq: 1,
    basePrice: 2499,
    tiers: [
      { minUnits: 1, maxUnits: 9, unitPrice: 2499, label: '১ - ৯ পিস (খুচরা মূল্য)', discountPercentage: 0 },
      { minUnits: 10, maxUnits: 49, unitPrice: 2199, label: '১০ - ৪৯ পিস (স্মল হোলসেল)', discountPercentage: 12.0 },
      { minUnits: 50, maxUnits: null, unitPrice: 1899, label: '৫০+ পিস (সুপার সেভার পাইকারি)', discountPercentage: 24.0 }
    ]
  },
  'b2c-01': {
    name: 'একোস্টিক্স প্রো ওয়্যারলেস এয়ারবাডস',
    moq: 1,
    basePrice: 1899,
    tiers: [
      { minUnits: 1, maxUnits: 4, unitPrice: 1899, label: '১ - ৪ পিস (সিঙ্গেল রিটেল)', discountPercentage: 0 },
      { minUnits: 5, maxUnits: 19, unitPrice: 1699, label: '৫ - ১৯ পিস (গ্রুপ বায়িং ডিসকাউন্ট)', discountPercentage: 10.5 },
      { minUnits: 20, maxUnits: null, unitPrice: 1499, label: '২০+ পিস (পাইকারি সেল)', discountPercentage: 21.1 }
    ]
  },
  'b2c-02': {
    name: 'NeoFit Smart Watch Series X',
    moq: 1,
    basePrice: 3200,
    tiers: [
      { minUnits: 1, maxUnits: 4, unitPrice: 3200, label: '১ - ৪ পিস (খুচরা)', discountPercentage: 0 },
      { minUnits: 5, maxUnits: 14, unitPrice: 2850, label: '৫ - ১৪ পিস (কম্বো অফার)', discountPercentage: 10.9 },
      { minUnits: 15, maxUnits: null, unitPrice: 2500, label: '১৫+ পিস (রিটেইলার প্রাইস)', discountPercentage: 21.8 }
    ]
  },
  'prod-digital-01': {
    name: 'Windows 11 Pro Enterprise OEM License',
    moq: 1,
    basePrice: 1450,
    tiers: [
      { minUnits: 1, maxUnits: 4, unitPrice: 1450, label: '১ - ৪ লাইসেন্স কী (একক ব্যবহার)', discountPercentage: 0 },
      { minUnits: 5, maxUnits: 19, unitPrice: 1200, label: '৫ - ১৯ লাইসেন্স কী (অফিস বাল্ক)', discountPercentage: 17.2 },
      { minUnits: 20, maxUnits: null, unitPrice: 950, label: '২০+ লাইসেন্স কী (আইটি ভেন্ডর রেট)', discountPercentage: 34.5 }
    ]
  }
};

export class CommercialPricingService {
  /**
   * Retrieves active price tiers and MOQ for a product
   */
  static async getProductTiers(productId: string): Promise<{
    name: string;
    moq: number;
    basePrice: number;
    tiers: PriceTier[];
  }> {
    if (db.isConnected()) {
      try {
        const product = await prisma.product.findUnique({
          where: { id: productId },
          include: {
            tieredPrices: {
              orderBy: { minUnits: 'asc' }
            }
          }
        });

        if (product) {
          const dbTiers: PriceTier[] = product.tieredPrices.map((t: any) => ({
            id: t.id,
            minUnits: t.minUnits,
            maxUnits: t.maxUnits,
            unitPrice: Number(t.unitPrice),
            label: `${t.minUnits}${t.maxUnits ? ` - ${t.maxUnits}` : '+'} পিস`,
            discountPercentage: Math.max(0, parseFloat((((Number(product.price) - Number(t.unitPrice)) / Number(product.price)) * 100).toFixed(1)))
          }));

          return {
            name: product.title,
            moq: product.moq || 1,
            basePrice: Number(product.price),
            tiers: dbTiers.length > 0 ? dbTiers : [
              { minUnits: 1, maxUnits: null, unitPrice: Number(product.price), label: 'স্ট্যান্ডার্ড ইউনিট রেট', discountPercentage: 0 }
            ]
          };
        }
      } catch (err) {
        console.warn('Fallback to catalog product tiers:', err);
      }
    }

    const catalogProduct = DEFAULT_PRODUCT_TIERS[productId] || {
      name: 'Paikar Mart স্ট্যান্ডার্ড পণ্য',
      moq: 1,
      basePrice: 1500,
      tiers: [
        { minUnits: 1, maxUnits: 9, unitPrice: 1500, label: '১ - ৯ পিস (একক ক্রয়)', discountPercentage: 0 },
        { minUnits: 10, maxUnits: 49, unitPrice: 1350, label: '১০ - ৪৯ পিস (বাল্ক রেট)', discountPercentage: 10 },
        { minUnits: 50, maxUnits: null, unitPrice: 1200, label: '৫০+ পিস (পাইকারি রেট)', discountPercentage: 20 }
      ]
    };

    return catalogProduct;
  }

  /**
   * Validates MOQ and calculates tiered pricing
   */
  static async calculateTieredPricing(
    productId: string,
    requestedQuantity: number
  ): Promise<PricingCalculationResult> {
    const qty = Math.max(1, Math.floor(requestedQuantity));
    const productInfo = await this.getProductTiers(productId);
    const moq = productInfo.moq || 1;
    const isMoqMet = qty >= moq;

    // Find matching tier
    let effectiveUnitPrice = productInfo.basePrice;
    let appliedTier: PriceTier | null = null;

    for (const tier of productInfo.tiers) {
      const withinMin = qty >= tier.minUnits;
      const withinMax = tier.maxUnits === null || tier.maxUnits === undefined || qty <= tier.maxUnits;
      if (withinMin && withinMax) {
        effectiveUnitPrice = tier.unitPrice;
        appliedTier = tier;
        break;
      }
    }

    // If no tier bounded range matched but qty exceeds highest tier min
    if (!appliedTier && productInfo.tiers.length > 0) {
      const highestTier = [...productInfo.tiers].sort((a, b) => b.minUnits - a.minUnits)[0];
      if (qty >= highestTier.minUnits) {
        effectiveUnitPrice = highestTier.unitPrice;
        appliedTier = highestTier;
      } else {
        effectiveUnitPrice = productInfo.basePrice;
      }
    }

    const totalAmount = effectiveUnitPrice * qty;
    const originalTotalAmount = productInfo.basePrice * qty;
    const totalSavings = Math.max(0, originalTotalAmount - totalAmount);
    const savingsPercentage = originalTotalAmount > 0
      ? parseFloat(((totalSavings / originalTotalAmount) * 100).toFixed(1))
      : 0;

    return {
      productId,
      productName: productInfo.name,
      requestedQuantity: qty,
      moq,
      isMoqMet,
      baseUnitPrice: productInfo.basePrice,
      effectiveUnitPrice,
      totalAmount,
      originalTotalAmount,
      totalSavings,
      savingsPercentage,
      appliedTier,
      availableTiers: productInfo.tiers,
      isBulkDiscountApplied: effectiveUnitPrice < productInfo.basePrice,
      currency: 'BDT'
    };
  }

  /**
   * Validates order items list against MOQ requirements
   */
  static async validateCartItems(
    items: Array<{ productId: string; quantity: number }>
  ): Promise<{
    isValid: boolean;
    violations: Array<{ productId: string; requestedQuantity: number; requiredMoq: number; message: string }>;
    calculatedItems: PricingCalculationResult[];
    grandTotal: number;
    totalSavings: number;
  }> {
    const violations: Array<{ productId: string; requestedQuantity: number; requiredMoq: number; message: string }> = [];
    const calculatedItems: PricingCalculationResult[] = [];
    let grandTotal = 0;
    let totalSavings = 0;

    for (const item of items) {
      const calc = await this.calculateTieredPricing(item.productId, item.quantity);
      calculatedItems.push(calc);
      grandTotal += calc.totalAmount;
      totalSavings += calc.totalSavings;

      if (!calc.isMoqMet) {
        violations.push({
          productId: item.productId,
          requestedQuantity: item.quantity,
          requiredMoq: calc.moq,
          message: `নূন্যতম অর্ডার পরিমাণ (MOQ) পূর্ণ হয়নি। "${calc.productName}" এর জন্য নূন্যতম ${calc.moq} টি প্রয়োজন, কিন্তু সিলেক্ট করা হয়েছে ${item.quantity} টি।`
        });
      }
    }

    return {
      isValid: violations.length === 0,
      violations,
      calculatedItems,
      grandTotal,
      totalSavings
    };
  }
}
