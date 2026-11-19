import { Router } from 'express';
import type { Request, Response } from 'express';
import { supabase } from '../../services/dbService.js';
import { isPrivilegedRole, optionalFirebaseAuth, requireFirebaseAuth } from '../../middleware/requireFirebaseAuth.js';

export const retailRouter = Router();

export interface VoucherDefinition {
  code: string;
  titleBn: string;
  titleEn: string;
  descriptionBn: string;
  descriptionEn: string;
  discountType: 'percent' | 'flat' | 'free_shipping';
  discountValue: number;
  maxDiscountBdt?: number;
  minSpendBdt: number;
  eligibleCategory?: string;
  expiresAt: string;
  isActive: boolean;
}

export interface VoucherEvaluationResult {
  valid: boolean;
  code: string;
  discountBdt: number;
  freeShipping: boolean;
  message: string;
  voucher?: VoucherDefinition;
}

export interface ProductReviewRecord {
  id: string;
  productId: string;
  userId: string;
  userName: string;
  rating: number;
  comment: string;
  isVerifiedPurchase: boolean;
  sellerReply?: string;
  createdAt: string;
}

export interface ProductQuestionRecord {
  id: string;
  productId: string;
  authorId: string;
  authorName: string;
  question: string;
  answer?: string;
  answeredBy?: string;
  answeredAt?: string;
  createdAt: string;
}

export interface PrescriptionRecord {
  id: string;
  orderId: string;
  orderType: 'pharmacy_rx' | 'grocery_list';
  customerId: string;
  customerName: string;
  contactPhone: string;
  deliveryAddress: string;
  notes: string;
  preferredStoreId?: string;
  fileName?: string;
  mimeType?: string;
  fileSizeBytes?: number;
  previewDataUrl?: string;
  status: 'submitted' | 'pharmacist_review' | 'quoted' | 'dispatched';
  createdAt: string;
}

const ACTIVE_VOUCHERS: VoucherDefinition[] = [
  {
    code: 'SUPER10',
    titleBn: '১০% সুপার ডিসকাউন্ট',
    titleEn: '10% Super App Savings',
    descriptionBn: 'সর্বনিম্ন ৳৫০০ অর্ডারে সর্বোচ্চ ৳১,৫০০ পর্যন্ত ছাড়',
    descriptionEn: '10% off up to ৳1,500 on orders over ৳500',
    discountType: 'percent',
    discountValue: 10,
    maxDiscountBdt: 1500,
    minSpendBdt: 500,
    expiresAt: '2027-12-31T23:59:59Z',
    isActive: true,
  },
  {
    code: 'PAIKAR50',
    titleBn: '৳৫০ ফ্ল্যাট ছাড়',
    titleEn: 'Flat ৳50 Off Retail',
    descriptionBn: '৳৪০০+ যেকোনো রিটেইল অর্ডারে তাৎক্ষণিক ৳৫০ ছাড়',
    descriptionEn: 'Instant ৳50 off on retail baskets ৳400+',
    discountType: 'flat',
    discountValue: 50,
    minSpendBdt: 400,
    expiresAt: '2027-12-31T23:59:59Z',
    isActive: true,
  },
  {
    code: 'FREEDEL',
    titleBn: 'ফ্রি হোম ডেলিভারি',
    titleEn: 'Free Home Delivery',
    descriptionBn: '৳৩০০+ অর্ডারে ডেলিভারি চার্জ সম্পূর্ণ ফ্রি',
    descriptionEn: 'Zero delivery fee on orders ৳300+',
    discountType: 'free_shipping',
    discountValue: 0,
    minSpendBdt: 300,
    expiresAt: '2027-12-31T23:59:59Z',
    isActive: true,
  },
  {
    code: 'PHARMA5',
    titleBn: 'ফার্মেসি ও গ্রোসারিতে ৫% ছাড়',
    titleEn: '5% Off Essentials',
    descriptionBn: 'ওষুধ ও গ্রোসারি অর্ডারে ৫% ছাড় (সর্বোচ্চ ৳৪০০)',
    descriptionEn: '5% savings up to ৳400 on Pharmacy & Grocery',
    discountType: 'percent',
    discountValue: 5,
    maxDiscountBdt: 400,
    minSpendBdt: 250,
    eligibleCategory: 'Grocery',
    expiresAt: '2027-12-31T23:59:59Z',
    isActive: true,
  },
];

const serverReviews: ProductReviewRecord[] = [
  {
    id: 'rev_seed_1',
    productId: 'prod_retail_iphone_15',
    userId: 'usr_arif',
    userName: 'Arif Ahmed',
    rating: 5,
    comment: 'Official Apple warranty verified with serial check. Same-day sealed box delivery in Dhaka.',
    isVerifiedPurchase: true,
    sellerReply: 'Thank you for choosing Gadget & Gear Official! Reach out anytime for warranty support.',
    createdAt: '2026-10-28T10:15:00Z',
  },
  {
    id: 'rev_seed_2',
    productId: 'prod_retail_iphone_15',
    userId: 'usr_sultana',
    userName: 'Sultana Begum',
    rating: 4,
    comment: 'Packaging was tamper-evident and courier verified OTP before handover.',
    isVerifiedPurchase: true,
    createdAt: '2026-11-02T14:20:00Z',
  },
  {
    id: 'rev_seed_3',
    productId: 'prod_retail_soybean_oil',
    userId: 'usr_kamal',
    userName: 'Kamal Uddin',
    rating: 5,
    comment: 'Fresh batch with 2027 expiry date, delivered within 25 minutes from City Mart nearby.',
    isVerifiedPurchase: true,
    createdAt: '2026-11-05T09:10:00Z',
  },
];

const serverQuestions: ProductQuestionRecord[] = [
  {
    id: 'qna_seed_1',
    productId: 'prod_retail_iphone_15',
    authorId: 'usr_tanvir',
    authorName: 'Tanvir Hasan',
    question: 'Does this unit include official BTRC registration and 1-year international warranty?',
    answer: 'Yes, all official units are BTRC approved and include 1-year official warranty with VAT invoice.',
    answeredBy: 'Gadget & Gear Official',
    answeredAt: '2026-11-01T12:00:00Z',
    createdAt: '2026-11-01T09:30:00Z',
  },
  {
    id: 'qna_seed_2',
    productId: 'prod_retail_soybean_oil',
    authorId: 'usr_nadia',
    authorName: 'Nadia Islam',
    question: 'What is the manufacturing month of the current stock?',
    answer: 'Current batch is manufactured in October 2026 with 18 months shelf life.',
    answeredBy: 'City Mart',
    answeredAt: '2026-11-04T15:10:00Z',
    createdAt: '2026-11-04T13:45:00Z',
  },
];

const serverPrescriptions: PrescriptionRecord[] = [];

export function evaluateVoucher(
  rawCode: string | undefined,
  subtotalBdt: number,
  categories: string[] = []
): VoucherEvaluationResult {
  const code = String(rawCode || '').trim().toUpperCase();
  if (!code) {
    return {
      valid: false,
      code: '',
      discountBdt: 0,
      freeShipping: false,
      message: 'Please enter a voucher code.',
    };
  }

  const voucher = ACTIVE_VOUCHERS.find((v) => v.code === code && v.isActive);
  if (!voucher) {
    return {
      valid: false,
      code,
      discountBdt: 0,
      freeShipping: false,
      message: `Voucher "${code}" is invalid or expired.`,
    };
  }

  if (new Date(voucher.expiresAt).getTime() < Date.now()) {
    return {
      valid: false,
      code,
      discountBdt: 0,
      freeShipping: false,
      message: `Voucher "${code}" has expired.`,
    };
  }

  if (subtotalBdt < voucher.minSpendBdt) {
    return {
      valid: false,
      code,
      discountBdt: 0,
      freeShipping: false,
      message: `Minimum spend ৳${voucher.minSpendBdt.toLocaleString()} required for ${code}.`,
    };
  }

  if (
    voucher.eligibleCategory &&
    categories.length > 0 &&
    !categories.some((c) => c.toLowerCase().includes(voucher.eligibleCategory!.toLowerCase()))
  ) {
    return {
      valid: false,
      code,
      discountBdt: 0,
      freeShipping: false,
      message: `${code} is valid only for ${voucher.eligibleCategory} / Pharmacy items.`,
    };
  }

  if (voucher.discountType === 'free_shipping') {
    return {
      valid: true,
      code: voucher.code,
      discountBdt: 0,
      freeShipping: true,
      message: `Free delivery unlocked with ${voucher.code}!`,
      voucher,
    };
  }

  let discountBdt =
    voucher.discountType === 'percent'
      ? Math.round((subtotalBdt * voucher.discountValue) / 100)
      : voucher.discountValue;

  if (voucher.maxDiscountBdt && discountBdt > voucher.maxDiscountBdt) {
    discountBdt = voucher.maxDiscountBdt;
  }
  discountBdt = Math.min(discountBdt, subtotalBdt);

  return {
    valid: true,
    code: voucher.code,
    discountBdt,
    freeShipping: false,
    message: `Applied ${voucher.code}: ৳${discountBdt.toLocaleString()} savings`,
    voucher,
  };
}

function buildEngagementSummary(
  productId: string,
  reviews: ProductReviewRecord[],
  qna: ProductQuestionRecord[]
) {
  const breakdown: Record<1 | 2 | 3 | 4 | 5, number> = { 5: 0, 4: 0, 3: 0, 2: 0, 1: 0 };
  let totalScore = 0;

  for (const r of reviews) {
    const clamped = Math.min(5, Math.max(1, Math.round(r.rating))) as 1 | 2 | 3 | 4 | 5;
    breakdown[clamped] += 1;
    totalScore += clamped;
  }

  const totalReviews = reviews.length;
  const averageRating = totalReviews > 0 ? Number((totalScore / totalReviews).toFixed(1)) : 5.0;

  return {
    productId,
    reviews,
    qna,
    stats: {
      averageRating,
      totalReviews,
      verifiedCount: reviews.filter((r) => r.isVerifiedPurchase).length,
      breakdown,
    },
  };
}

// GET /api/retail/deals - Active server vouchers & deals catalog
retailRouter.get('/deals', (_req: Request, res: Response) => {
  res.json({
    success: true,
    vouchers: ACTIVE_VOUCHERS.filter((v) => v.isActive),
  });
});

// POST /api/retail/vouchers/validate - Server-authoritative promo validation
retailRouter.post('/vouchers/validate', (req: Request, res: Response) => {
  const subtotal = Number(req.body?.subtotal || 0);
  const code = req.body?.code as string | undefined;
  const categories = Array.isArray(req.body?.categories)
    ? req.body.categories.map((c: unknown) => String(c || ''))
    : [];

  if (!Number.isFinite(subtotal) || subtotal < 0) {
    res.status(400).json({ valid: false, message: 'Valid cart subtotal is required.' });
    return;
  }

  const result = evaluateVoucher(code, subtotal, categories);
  res.status(result.valid ? 200 : 400).json(result);
});

// POST /api/retail/buybox/rank - Server-side PMIN Buy Box scoring across seller offers
retailRouter.post('/buybox/rank', (req: Request, res: Response) => {
  const offers = Array.isArray(req.body?.offers) ? req.body.offers : [];
  if (offers.length === 0) {
    res.json({ success: true, buyBoxWinnerId: null, rankedOffers: [] });
    return;
  }

  const ranked = offers
    .map((offer: any) => {
      const price = Number(offer.price || 0);
      const shippingFee = Number(offer.shippingFee ?? (offer.deliveryEta?.includes('Same Day') ? 0 : 60));
      const landedPrice = price + shippingFee;
      const rating = Number(offer.sellerRating || 4.5);
      const stock = Number(offer.stockQuantity || 0);
      const isExpress = String(offer.deliveryEta || '').toLowerCase().includes('hour') ||
        String(offer.deliveryEta || '').toLowerCase().includes('same day');

      if (stock <= 0 || offer.isActive === false) {
        return { ...offer, landedPrice, buyBoxScore: -1, isBuyBoxWinner: false };
      }

      const priceFactor = 10000 / Math.max(1, landedPrice);
      const buyBoxScore = Number(
        (priceFactor * 120 + rating * 18 + (isExpress ? 25 : 0) + Math.min(stock, 50) * 0.2).toFixed(2)
      );
      return { ...offer, landedPrice, buyBoxScore, isBuyBoxWinner: false };
    })
    .sort((a: any, b: any) => b.buyBoxScore - a.buyBoxScore);

  const buyBoxWinnerId = ranked[0]?.buyBoxScore >= 0 ? ranked[0].id : null;
  const withWinner = ranked.map((item: any) => ({
    ...item,
    isBuyBoxWinner: item.id === buyBoxWinnerId,
  }));

  res.json({
    success: true,
    buyBoxWinnerId,
    rankedOffers: withWinner,
  });
});

// GET /api/retail/products/:productId/engagement - Verified Reviews + Q&A
retailRouter.get('/products/:productId/engagement', async (req: Request, res: Response) => {
  const { productId } = req.params;
  let reviews = serverReviews.filter((r) => r.productId === productId);
  let qna = serverQuestions.filter((q) => q.productId === productId);

  if (supabase) {
    try {
      const [{ data: dbReviews }, { data: dbQna }] = await Promise.all([
        supabase
          .from('product_reviews')
          .select('*')
          .eq('product_id', productId)
          .order('created_at', { ascending: false })
          .limit(30),
        supabase
          .from('product_questions')
          .select('*')
          .eq('product_id', productId)
          .order('created_at', { ascending: false })
          .limit(30),
      ]);

      if (Array.isArray(dbReviews) && dbReviews.length > 0) {
        const mapped: ProductReviewRecord[] = dbReviews.map((row: any) => ({
          id: row.id,
          productId: row.product_id || productId,
          userId: row.user_id,
          userName: row.reviewer_name || 'Verified Buyer',
          rating: Number(row.rating || 5),
          comment: row.comment || '',
          isVerifiedPurchase: Boolean(row.is_verified_purchase),
          sellerReply: row.seller_reply || undefined,
          createdAt: row.created_at,
        }));
        const existingIds = new Set(mapped.map((m) => m.id));
        reviews = [...mapped, ...reviews.filter((r) => !existingIds.has(r.id))];
      }

      if (Array.isArray(dbQna) && dbQna.length > 0) {
        const mappedQna: ProductQuestionRecord[] = dbQna.map((row: any) => ({
          id: row.id,
          productId: row.product_id || productId,
          authorId: row.author_id,
          authorName: row.author_name || 'Shopper',
          question: row.question,
          answer: row.answer || undefined,
          answeredBy: row.answered_by || undefined,
          answeredAt: row.answered_at || undefined,
          createdAt: row.created_at,
        }));
        const existingIds = new Set(mappedQna.map((m) => m.id));
        qna = [...mappedQna, ...qna.filter((q) => !existingIds.has(q.id))];
      }
    } catch (err) {
      console.warn('Supabase engagement fetch fallback:', err);
    }
  }

  res.json({
    success: true,
    ...buildEngagementSummary(productId, reviews, qna),
  });
});

// POST /api/retail/products/:productId/reviews - Create verified buyer review
retailRouter.post('/products/:productId/reviews', requireFirebaseAuth, async (req: Request, res: Response) => {
  const { productId } = req.params;
  const rating = Number(req.body?.rating);
  const comment = String(req.body?.comment || '').trim();
  const userName = String(req.body?.userName || 'PaikarMart Buyer').trim().slice(0, 80);
  const userId = res.locals.auth.uid;

  if (!Number.isInteger(rating) || rating < 1 || rating > 5) {
    res.status(400).json({ success: false, error: 'Rating must be an integer between 1 and 5.' });
    return;
  }

  if (comment.length < 5 || comment.length > 600) {
    res.status(400).json({ success: false, error: 'Review comment must be between 5 and 600 characters.' });
    return;
  }

  // Server checks if buyer actually has a recorded purchase for this item
  let isVerifiedPurchase = false;
  if (supabase && userId !== 'usr_guest') {
    try {
      const { data: userOrders } = await supabase
        .from('orders')
        .select('id, items')
        .eq('customer_id', userId)
        .limit(20);
      if (Array.isArray(userOrders)) {
        isVerifiedPurchase = userOrders.some(
          (ord: any) =>
            Array.isArray(ord.items) &&
            ord.items.some((itm: any) => itm?.id === productId || itm?.product?.id === productId)
        );
      }
    } catch {
      isVerifiedPurchase = false;
    }
  }

  const newReview: ProductReviewRecord = {
    id: `rev_${Date.now()}`,
    productId,
    userId,
    userName,
    rating,
    comment,
    isVerifiedPurchase,
    createdAt: new Date().toISOString(),
  };

  if (supabase) {
    try {
      await supabase.from('product_reviews').insert({
        product_id: productId,
        user_id: userId,
        rating,
        comment,
        is_verified_purchase: isVerifiedPurchase,
      });
    } catch (err) {
      console.warn('Supabase review insert fallback:', err);
    }
  }

  serverReviews.unshift(newReview);
  const reviews = serverReviews.filter((r) => r.productId === productId);
  const qna = serverQuestions.filter((q) => q.productId === productId);

  res.status(201).json({
    success: true,
    review: newReview,
    ...buildEngagementSummary(productId, reviews, qna),
  });
});

// POST /api/retail/products/:productId/qna - Submit product question
retailRouter.post('/products/:productId/qna', optionalFirebaseAuth, async (req: Request, res: Response) => {
  const { productId } = req.params;
  const question = String(req.body?.question || '').trim();
  const authorName = String(req.body?.authorName || 'Shopper').trim().slice(0, 80);
  const authorId = res.locals.auth?.uid || 'usr_guest';

  if (question.length < 5 || question.length > 400) {
    res.status(400).json({ success: false, error: 'Question must be between 5 and 400 characters.' });
    return;
  }

  const newQuestion: ProductQuestionRecord = {
    id: `qna_${Date.now()}`,
    productId,
    authorId,
    authorName,
    question,
    createdAt: new Date().toISOString(),
  };

  if (supabase) {
    try {
      await supabase.from('product_questions').insert({
        product_id: productId,
        author_id: authorId,
        author_name: authorName,
        question,
      });
    } catch (err) {
      console.warn('Supabase QnA insert fallback:', err);
    }
  }

  serverQuestions.unshift(newQuestion);
  res.status(201).json({ success: true, question: newQuestion });
});

// POST /api/retail/products/:productId/qna/:questionId/answer - Seller answers a question
retailRouter.post('/products/:productId/qna/:questionId/answer', requireFirebaseAuth, async (req: Request, res: Response) => {
  const { productId, questionId } = req.params;
  const answer = String(req.body?.answer || '').trim();
  const answeredBy = String(req.body?.answeredBy || 'Verified Merchant').trim().slice(0, 80);

  if (answer.length < 3 || answer.length > 500) {
    res.status(400).json({ success: false, error: 'Answer must be between 3 and 500 characters.' });
    return;
  }

  const target = serverQuestions.find((q) => q.id === questionId && q.productId === productId);
  if (!target) {
    res.status(404).json({ success: false, error: 'Question not found.' });
    return;
  }

  target.answer = answer;
  target.answeredBy = answeredBy;
  target.answeredAt = new Date().toISOString();

  res.json({ success: true, question: target });
});

// POST /api/retail/prescriptions - Real Pharmacy Prescription & Grocery List Order Flow
retailRouter.post('/prescriptions', optionalFirebaseAuth, async (req: Request, res: Response) => {
  const orderType = req.body?.orderType === 'grocery_list' ? 'grocery_list' : 'pharmacy_rx';
  const contactPhone = String(req.body?.contactPhone || '').trim();
  const deliveryAddress = String(req.body?.deliveryAddress || '').trim();
  const notes = String(req.body?.notes || '').trim();
  const customerId = res.locals.auth?.uid || 'usr_guest';
  const customerName = String(req.body?.customerName || 'PaikarMart Customer').trim().slice(0, 80);
  const fileName = req.body?.fileName ? String(req.body.fileName).slice(0, 160) : undefined;
  const mimeType = req.body?.mimeType ? String(req.body.mimeType).slice(0, 64) : undefined;
  const fileSizeBytes = req.body?.fileSizeBytes ? Number(req.body.fileSizeBytes) : undefined;
  const previewDataUrl = req.body?.previewDataUrl ? String(req.body.previewDataUrl) : undefined;

  if (contactPhone.length < 6 || contactPhone.length > 25) {
    res.status(400).json({ success: false, error: 'Valid contact phone number is required.' });
    return;
  }

  if (deliveryAddress.length < 4 || deliveryAddress.length > 300) {
    res.status(400).json({ success: false, error: 'Delivery address is required.' });
    return;
  }

  if (!fileName && notes.length < 3) {
    res.status(400).json({
      success: false,
      error: 'Please upload a prescription/list file or write item instructions.',
    });
    return;
  }

  if (fileSizeBytes && fileSizeBytes > 2_500_000) {
    res.status(400).json({ success: false, error: 'Attachment must be under 2.5 MB.' });
    return;
  }

  const allowedMimes = ['image/jpeg', 'image/png', 'image/webp', 'application/pdf'];
  if (mimeType && !allowedMimes.includes(mimeType)) {
    res.status(400).json({ success: false, error: 'Only JPG, PNG, WebP, or PDF attachments are accepted.' });
    return;
  }

  const prefix = orderType === 'pharmacy_rx' ? 'RX' : 'LST';
  const id = `${prefix}-${Math.floor(100000 + Math.random() * 900000)}`;
  const orderId = `ORD-${prefix}-${Math.floor(10000 + Math.random() * 90000)}`;

  const record: PrescriptionRecord = {
    id,
    orderId,
    orderType,
    customerId,
    customerName,
    contactPhone,
    deliveryAddress,
    notes,
    preferredStoreId: req.body?.preferredStoreId ? String(req.body.preferredStoreId) : undefined,
    fileName,
    mimeType,
    fileSizeBytes,
    previewDataUrl: previewDataUrl && previewDataUrl.length < 1_500_000 ? previewDataUrl : undefined,
    status: orderType === 'pharmacy_rx' ? 'pharmacist_review' : 'submitted',
    createdAt: new Date().toISOString(),
  };

  if (supabase) {
    try {
      await supabase.from('prescription_uploads').insert({
        reference_code: record.id,
        order_id_ref: record.orderId,
        order_type: record.orderType,
        customer_id: record.customerId,
        contact_phone: record.contactPhone,
        delivery_address: record.deliveryAddress,
        notes: record.notes,
        file_name: record.fileName || null,
        mime_type: record.mimeType || null,
        status: record.status,
      });
    } catch (err) {
      console.warn('Supabase prescription insert fallback:', err);
    }
  }

  serverPrescriptions.unshift(record);
  res.status(201).json({
    success: true,
    prescription: record,
    orderId,
  });
});

// GET /api/retail/prescriptions - Protected owner-isolated prescription history
retailRouter.get('/prescriptions', requireFirebaseAuth, (req: Request, res: Response) => {
  const auth = res.locals.auth;
  const prescriptions = isPrivilegedRole(auth)
    ? serverPrescriptions
    : serverPrescriptions.filter((record) => record.customerId === auth.uid);

  res.json({
    success: true,
    prescriptions,
  });
});
