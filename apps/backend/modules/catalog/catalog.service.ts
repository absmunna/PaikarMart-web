import { prisma } from '../../config/database';

const PMIN_CHARS = 'ABCDEFGHJKLMNPQRSTUVWXYZ23456789';

/** Amazon-style unique catalog code: PMIN-BXXXXXXXXXX */
export function generatePmin(prefix = 'PMIN'): string {
  let code = '';
  for (let i = 0; i < 10; i++) {
    code += PMIN_CHARS[Math.floor(Math.random() * PMIN_CHARS.length)];
  }
  return `${prefix}-B${code}`;
}

export async function generateUniquePmin(maxAttempts = 12): Promise<string> {
  for (let i = 0; i < maxAttempts; i++) {
    const pmin = generatePmin();
    const existing = await prisma.masterProduct.findUnique({ where: { pmin } });
    if (!existing) return pmin;
  }
  // Extremely unlikely collision path
  return generatePmin() + Date.now().toString(36).slice(-4).toUpperCase();
}

export type OfferLike = {
  id: string;
  price: number;
  stock: number;
  shippingFee: number;
  isActive: boolean;
  sellerId: string;
  vendor?: { isVerified?: boolean } | null;
  updatedAt?: Date;
};

/**
 * Buy-Box: lowest price among in-stock active offers.
 * Ties: verified vendor → lower shipping → newer offer.
 */
export function pickBuyBoxWinner<T extends OfferLike>(offers: T[]): T | null {
  const eligible = offers.filter((o) => o.isActive && o.stock > 0);
  if (!eligible.length) return null;

  eligible.sort((a, b) => {
    if (a.price !== b.price) return a.price - b.price;
    const av = a.vendor?.isVerified ? 1 : 0;
    const bv = b.vendor?.isVerified ? 1 : 0;
    if (av !== bv) return bv - av;
    if (a.shippingFee !== b.shippingFee) return a.shippingFee - b.shippingFee;
    const at = a.updatedAt ? new Date(a.updatedAt).getTime() : 0;
    const bt = b.updatedAt ? new Date(b.updatedAt).getTime() : 0;
    return bt - at;
  });

  return eligible[0];
}

/** Persist isBuyBoxWinner flags for all offers of a master product. */
export async function recalculateBuyBox(masterProductId: string): Promise<string | null> {
  const offers = await prisma.sellerOffer.findMany({
    where: { masterProductId },
    include: { vendor: { select: { isVerified: true } } },
  });

  const winner = pickBuyBoxWinner(offers as OfferLike[]);
  const winnerId = winner?.id ?? null;

  await prisma.$transaction([
    prisma.sellerOffer.updateMany({
      where: { masterProductId, isBuyBoxWinner: true },
      data: { isBuyBoxWinner: false },
    }),
    ...(winnerId
      ? [
          prisma.sellerOffer.update({
            where: { id: winnerId },
            data: { isBuyBoxWinner: true },
          }),
        ]
      : []),
  ]);

  return winnerId;
}

export function sanitizeImageUrls(input: unknown, max = 12): string[] {
  if (!Array.isArray(input)) return [];
  return input
    .filter((u): u is string => typeof u === 'string' && u.trim().length > 0)
    .map((u) => u.trim().slice(0, 2048))
    .filter((u) => u.startsWith('https://') || u.startsWith('http://') || u.startsWith('/'))
    .slice(0, max);
}

export function isSellerRole(role?: string, isSellerFlag?: boolean): boolean {
  if (isSellerFlag) return true;
  const r = (role || '').toLowerCase();
  return ['seller', 'vendor', 'admin', 'super_admin', 'moderator', 'creator'].includes(r);
}
