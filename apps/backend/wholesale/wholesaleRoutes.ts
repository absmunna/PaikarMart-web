import express from 'express';
import type { Request, Response } from 'express';

export const wholesaleRouter = express.Router();

export interface B2BTierPrice {
  range: string;
  min_qty: number;
  max_qty: number | null;
  unit_price: number;
  discount_percent: number;
}

export interface B2BWholesaleProduct {
  id: string;
  portal_id: string;
  name: string;
  title: string;
  description: string;
  category: string;
  industry: string;
  moq: number;
  lead_time: string;
  lead_time_days: number;
  factory_location: string;
  tier_pricing: B2BTierPrice[];
  factory_certifications: string[];
  sample_available: boolean;
  sample_price: number;
  supply_capacity: string;
  vendor: {
    id: string;
    store_name: string;
    factory_name: string;
    business_type: 'manufacturer' | 'wholesaler' | 'importer';
    trade_license_number: string;
    trade_license_verified: boolean;
    rating: number;
    location: string;
    response_rate: string;
  };
}

export interface PurchaseOrderDraft {
  poNumber: string;
  rfqId: string;
  status: 'draft_submitted' | 'supplier_accepted' | 'counter_offered' | 'escrow_locked' | 'declined';
  buyer: {
    name: string;
    phone: string;
    company: string;
    district: string;
    email?: string;
  };
  supplier: {
    id: string;
    factoryName: string;
    tradeLicense: string;
    location: string;
    verified: boolean;
  };
  product: {
    id: string;
    name: string;
    moq: number;
    leadTime: string;
  };
  financials: {
    quantity: number;
    unitPrice: number;
    subtotal: number;
    estimatedAitVat: number;
    grandTotal: number;
    counterPrice?: number;
    currency: 'BDT';
  };
  paymentTerms: 'wholesale_credit' | 'lc' | 'bank_transfer' | 'escrow';
  paymentTermsLabel: string;
  deliveryDistrict: string;
  notes: string;
  supplierComments?: string;
  escrowId?: string;
  createdAt: string;
  respondedAt?: string;
  expiresAt: string;
}

export interface WholesaleSampleOrder {
  id: string;
  productId: string;
  productTitle: string;
  companyName: string;
  contactPerson: string;
  phone: string;
  shippingAddress: string;
  sampleFee: number;
  status: 'requested' | 'dispatched' | 'delivered';
  trackingCode: string;
  createdAt: string;
}

const SEED_B2B_PRODUCTS: B2BWholesaleProduct[] = [
  {
    id: 'b2b-01',
    portal_id: 'wholesale',
    name: 'প্রিমিয়াম কম্বড কটন টি-শার্ট বাল্ক লট (১৮০ GSM)',
    title: '100% Combed Cotton 180 GSM Round Neck T-Shirt Lot',
    description: 'রপ্তানিমুখী নিট কম্পোজিট মিল থেকে সরাসরি কম্বড সিঙ্গেল জার্সি টি-শার্ট। রিয়্যাক্টিভ ডাইং, কালার ফাস্টনেস গ্রেড ৪+ গ্যারান্টিযুক্ত।',
    category: 'apparel_textile',
    industry: 'পোশাক ও টেক্সটাইল',
    moq: 50,
    lead_time: '৩-৫ কার্যদিবস (স্টক লট)',
    lead_time_days: 4,
    factory_location: 'কেরানীগঞ্জ নিটওয়্যার জোন, ঢাকা',
    tier_pricing: [
      { range: '৫০ - ১৯৯ পিস', min_qty: 50, max_qty: 199, unit_price: 185, discount_percent: 0 },
      { range: '২০০ - ৪৯৯ পিস', min_qty: 200, max_qty: 499, unit_price: 170, discount_percent: 8.1 },
      { range: '৫০০+ পিস (কারখানা রেট)', min_qty: 500, max_qty: null, unit_price: 155, discount_percent: 16.2 }
    ],
    factory_certifications: [
      'ট্রেড লাইসেন্স নং: TL-DHK-2024-8192',
      'OEKO-TEX Standard 100',
      'বিকেএমইএ (BKMEA) মেম্বারশিপ'
    ],
    sample_available: true,
    sample_price: 350,
    supply_capacity: '৫০,০০০ পিস / মাস',
    vendor: {
      id: 'fact-keraniganj-01',
      store_name: 'কেরানীগঞ্জ নিট কম্পোজিট মিলস',
      factory_name: 'কেরানীগঞ্জ নিট কম্পোজিট মিলস',
      business_type: 'manufacturer',
      trade_license_number: 'TL-DHK-2024-8192',
      trade_license_verified: true,
      rating: 4.9,
      location: 'কেরানীগঞ্জ, ঢাকা',
      response_rate: '৯৯%'
    }
  },
  {
    id: 'b2b-02',
    portal_id: 'wholesale',
    name: 'স্মার্ট ওয়াচ ও ব্লুটুথ হেডসেট কম্বো ইমপোর্ট মাস্টার লট',
    title: 'AMOLED Smart Watch + ANC TWS Earbuds Wholesale Carton',
    description: 'হংকং ও শেনজেন থেকে সরাসরি আমদানিকৃত প্রিমিয়াম গ্যাজেট বাল্ক লট। রিটেল রেডি প্যাকেজিং সহ সম্পূর্ণ আসল পণ্য।',
    category: 'electronics_hardware',
    industry: 'ইলেকট্রনিক্স ও গেজেটস',
    moq: 20,
    lead_time: '১-২ কার্যদিবস (ঢাকা ওয়্যারহাউস)',
    lead_time_days: 2,
    factory_location: 'নবাবপুর রোড / মতিঝিল, ঢাকা',
    tier_pricing: [
      { range: '২০ - ৪৯ পিস', min_qty: 20, max_qty: 49, unit_price: 490, discount_percent: 0 },
      { range: '৫০ - ৯৯ পিস', min_qty: 50, max_qty: 99, unit_price: 450, discount_percent: 8.2 },
      { range: '১০০+ পিস (ইমপোর্টার ডিলার রেট)', min_qty: 100, max_qty: null, unit_price: 410, discount_percent: 16.3 }
    ],
    factory_certifications: [
      'ট্রেড লাইসেন্স নং: TL-MOTI-2023-4519',
      'আমদানি নিবন্ধন সনদ (IRC) ভেরিফাইড',
      'CE & RoHS কমপ্লায়েন্ট'
    ],
    sample_available: true,
    sample_price: 850,
    supply_capacity: '১০,০০০ পিস / মাস',
    vendor: {
      id: 'imp-motijheel-02',
      store_name: 'মতিঝিল গ্যাজেট ইমপোর্ট সিন্ডিকেট',
      factory_name: 'মতিঝিল গ্যাজেট ইমপোর্ট সিন্ডিকেট',
      business_type: 'importer',
      trade_license_number: 'TL-MOTI-2023-4519',
      trade_license_verified: true,
      rating: 4.8,
      location: 'মতিঝিল, ঢাকা',
      response_rate: '৯৭%'
    }
  },
  {
    id: 'b2b-03',
    portal_id: 'wholesale',
    name: 'জেনুইন লেদার ফর্মাল শু এক্সপোর্ট লট (২৫ জোড়া কার্টন)',
    title: '100% Genuine Full Grain Crust Leather Formal Shoes Lot',
    description: 'হাজারীবাগ ট্যানারি জোন থেকে সরাসরি প্রক্রিয়াজাত চামড়ার অফিসিয়াল শু।',
    category: 'leather_footwear',
    industry: 'চামড়াজাত পণ্য ও জুতো',
    moq: 25,
    lead_time: '৫-৭ কার্যদিবস',
    lead_time_days: 6,
    factory_location: 'হাজারীবাগ লেদার এস্টেট, ঢাকা',
    tier_pricing: [
      { range: '২৫ - ৭৪ জোড়া', min_qty: 25, max_qty: 74, unit_price: 650, discount_percent: 0 },
      { range: '৭৫ - ১৪৯ জোড়া', min_qty: 75, max_qty: 149, unit_price: 610, discount_percent: 6.2 },
      { range: '১৫০+ জোড়া (কারখানা ডিরেক্ট রেট)', min_qty: 150, max_qty: null, unit_price: 560, discount_percent: 13.8 }
    ],
    factory_certifications: [
      'ট্রেড লাইসেন্স নং: TL-HZB-2024-3011',
      'ল্যাব টেস্টেড ফুল গ্রেইন লেদার সার্টিফিকেট',
      'ISO 14001 এনভায়রনমেন্টাল স্ট্যান্ডার্ড'
    ],
    sample_available: true,
    sample_price: 1200,
    supply_capacity: '৫,০০০ জোড়া / মাস',
    vendor: {
      id: 'fact-leather-03',
      store_name: 'হাজারীবাগ লেদার কমপ্লেক্স',
      factory_name: 'হাজারীবাগ লেদার কমপ্লেক্স',
      business_type: 'manufacturer',
      trade_license_number: 'TL-HZB-2024-3011',
      trade_license_verified: true,
      rating: 4.9,
      location: 'হাজারীবাগ, ঢাকা',
      response_rate: '১০০%'
    }
  }
];

const rfqStore: PurchaseOrderDraft[] = [
  {
    poNumber: 'PO-B2B-2026-84102',
    rfqId: 'RFQ-841020',
    status: 'supplier_accepted',
    buyer: {
      name: 'Alex Rivera',
      phone: '01711223344',
      company: 'Dhaka Apparel Syndicate',
      district: 'Dhaka'
    },
    supplier: {
      id: 'fact-keraniganj-01',
      factoryName: 'কেরানীগঞ্জ নিট কম্পোজিট মিলস',
      tradeLicense: 'TL-DHK-2024-8192',
      location: 'কেরানীগঞ্জ, ঢাকা',
      verified: true
    },
    product: {
      id: 'b2b-01',
      name: '100% Combed Cotton 180 GSM Round Neck T-Shirt Lot',
      moq: 50,
      leadTime: '৩-৫ কার্যদিবস'
    },
    financials: {
      quantity: 250,
      unitPrice: 170,
      subtotal: 42500,
      estimatedAitVat: 2125,
      grandTotal: 44625,
      currency: 'BDT'
    },
    paymentTerms: 'escrow',
    paymentTermsLabel: 'পাইকারমার্ট হোলসেল ট্রেড এসক্রো (Wholesale Escrow)',
    deliveryDistrict: 'Dhaka',
    notes: 'Export grade polybag & woven size label required.',
    supplierComments: 'প্রস্তাবিত ২০০+ লট রেটে প্রোফরমা ইনভয়েস (PI) অনুমোদিত। এসক্রো লক করলে ৪৮ ঘণ্টায় প্রোডাকশন শুরু হবে।',
    createdAt: new Date(Date.now() - 86400000).toISOString(),
    respondedAt: new Date(Date.now() - 43200000).toISOString(),
    expiresAt: new Date(Date.now() + 6 * 86400000).toISOString()
  }
];

const sampleStore: WholesaleSampleOrder[] = [];

function getPaymentTermsLabel(terms?: string): string {
  switch (terms) {
    case 'lc':
      return 'লেটার অফ ক্রেডিট (LC 90 Days At Sight)';
    case 'bank_transfer':
      return 'আরটিজিএস / ব্যাংক ট্রান্সফার (RTGS/BEFTN)';
    case 'wholesale_credit':
      return 'পাইকারমার্ট হোলসেল ট্রেড ক্রেডিট (Trade Credit)';
    case 'escrow':
    default:
      return 'পাইকারমার্ট হোলসেল ট্রেড এসক্রো (Wholesale Escrow)';
  }
}

wholesaleRouter.get('/products', (req: Request, res: Response) => {
  const category = String(req.query.category || '');
  const search = String(req.query.search || req.query.q || '').toLowerCase();
  const moqMax = req.query.moq_max ? parseInt(String(req.query.moq_max), 10) : null;

  let filtered = [...SEED_B2B_PRODUCTS];
  if (category && category !== 'all') {
    filtered = filtered.filter((p) => p.category === category || p.industry.includes(category));
  }
  if (moqMax !== null && !Number.isNaN(moqMax)) {
    filtered = filtered.filter((p) => p.moq <= moqMax);
  }
  if (search) {
    filtered = filtered.filter(
      (p) =>
        p.name.toLowerCase().includes(search) ||
        p.title.toLowerCase().includes(search) ||
        p.vendor.factory_name.toLowerCase().includes(search) ||
        p.factory_location.toLowerCase().includes(search)
    );
  }

  res.json({ success: true, products: filtered });
});

wholesaleRouter.get('/rfqs', (_req: Request, res: Response) => {
  res.json({ success: true, rfqs: rfqStore });
});

wholesaleRouter.post('/rfq', (req: Request, res: Response) => {
  const {
    productId,
    productName,
    quantity,
    targetPrice,
    deliveryDistrict,
    paymentTerms,
    notes,
    buyerName,
    buyerPhone,
    buyerCompany,
    email,
    baseUnitPrice
  } = req.body;

  const requestedQty = parseInt(String(quantity), 10);
  if (!requestedQty || requestedQty <= 0) {
    res.status(400).json({ error: 'সঠিক পরিমাণ উল্লেখ করুন' });
    return;
  }

  const targetProduct =
    SEED_B2B_PRODUCTS.find((p) => p.id === productId) || SEED_B2B_PRODUCTS[0];

  let agreedUnitPrice =
    targetPrice && Number(targetPrice) > 0
      ? Number(targetPrice)
      : Number(baseUnitPrice) || targetProduct.tier_pricing[0].unit_price;

  if (!targetPrice && targetProduct) {
    for (const tier of targetProduct.tier_pricing) {
      if (requestedQty >= tier.min_qty && (tier.max_qty === null || requestedQty <= tier.max_qty)) {
        agreedUnitPrice = tier.unit_price;
        break;
      }
    }
  }

  const subtotal = Math.round(agreedUnitPrice * requestedQty);
  const estimatedAitVat = Math.round(subtotal * 0.05);
  const grandTotal = subtotal + estimatedAitVat;

  const suffix = Date.now().toString().slice(-5);
  const poNumber = `PO-B2B-2026-${suffix}`;
  const rfqId = `RFQ-${suffix}${Math.floor(10 + Math.random() * 89)}`;
  const normalizedTerms = (['wholesale_credit', 'lc', 'bank_transfer', 'escrow'].includes(paymentTerms)
    ? paymentTerms
    : 'escrow') as PurchaseOrderDraft['paymentTerms'];

  const poDraft: PurchaseOrderDraft = {
    poNumber,
    rfqId,
    status: 'draft_submitted',
    buyer: {
      name: buyerName || 'ট্রেডার্স বায়ার',
      phone: buyerPhone || '01700000000',
      company: buyerCompany || 'রেজিস্টার্ড রিটেল শপ',
      district: deliveryDistrict || 'Dhaka',
      email: email || undefined
    },
    supplier: {
      id: targetProduct.vendor.id,
      factoryName: targetProduct.vendor.factory_name,
      tradeLicense: targetProduct.vendor.trade_license_number,
      location: targetProduct.vendor.location,
      verified: targetProduct.vendor.trade_license_verified
    },
    product: {
      id: productId || targetProduct.id,
      name: productName || targetProduct.title,
      moq: targetProduct.moq,
      leadTime: targetProduct.lead_time
    },
    financials: {
      quantity: requestedQty,
      unitPrice: agreedUnitPrice,
      subtotal,
      estimatedAitVat,
      grandTotal,
      currency: 'BDT'
    },
    paymentTerms: normalizedTerms,
    paymentTermsLabel: getPaymentTermsLabel(normalizedTerms),
    deliveryDistrict: deliveryDistrict || 'Dhaka',
    notes: notes || 'কোনো অতিরিক্ত শর্ত নেই।',
    createdAt: new Date().toISOString(),
    expiresAt: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString()
  };

  rfqStore.unshift(poDraft);

  res.status(201).json({
    success: true,
    message:
      'বাল্ক কোটেশন রিকোয়েস্ট (RFQ) সফলভাবে সাবমিট হয়েছে এবং পারচেজ অর্ডার (PO) ড্রাফট তৈরি হয়েছে।',
    rfqId,
    poDraft
  });
});

wholesaleRouter.post('/rfq/:id/respond', (req: Request, res: Response) => {
  const { id } = req.params;
  const { status, counterPrice, comments, escrowId } = req.body;

  const rfq = rfqStore.find((r) => r.rfqId === id || r.poNumber === id);
  if (!rfq) {
    res.status(404).json({ error: 'RFQ বা পারচেজ অর্ডার পাওয়া যায়নি' });
    return;
  }

  if (status) {
    rfq.status = status;
  }
  if (counterPrice && !Number.isNaN(Number(counterPrice))) {
    rfq.financials.counterPrice = Number(counterPrice);
    rfq.financials.unitPrice = Number(counterPrice);
    rfq.financials.subtotal = Math.round(rfq.financials.unitPrice * rfq.financials.quantity);
    rfq.financials.estimatedAitVat = Math.round(rfq.financials.subtotal * 0.05);
    rfq.financials.grandTotal = rfq.financials.subtotal + rfq.financials.estimatedAitVat;
  }
  if (escrowId) {
    rfq.escrowId = escrowId;
    rfq.status = 'escrow_locked';
  }
  if (comments) {
    rfq.supplierComments = comments;
  }
  rfq.respondedAt = new Date().toISOString();

  res.json({
    success: true,
    message: 'RFQ / PO স্ট্যাটাস আপডেট করা হয়েছে।',
    poDraft: rfq
  });
});

wholesaleRouter.get('/samples', (_req: Request, res: Response) => {
  res.json({ success: true, samples: sampleStore });
});

wholesaleRouter.post('/sample', (req: Request, res: Response) => {
  const {
    productId,
    productTitle,
    companyName,
    contactPerson,
    phone,
    shippingAddress,
    sampleFee
  } = req.body;

  if (!companyName || !contactPerson || !phone || !shippingAddress) {
    res.status(400).json({ error: 'কোম্পানি, কন্টাক্ট পারসন, ফোন ও ডেলিভারি ঠিকানা দিন।' });
    return;
  }

  const newSample: WholesaleSampleOrder = {
    id: `SMP-${Date.now().toString().slice(-6)}`,
    productId: productId || 'b2b-custom',
    productTitle: productTitle || 'Wholesale Sample Unit',
    companyName,
    contactPerson,
    phone,
    shippingAddress,
    sampleFee: Number(sampleFee) || 500,
    status: 'dispatched',
    trackingCode: `PM-TRK-${Math.floor(100000 + Math.random() * 900000)}`,
    createdAt: new Date().toISOString()
  };

  sampleStore.unshift(newSample);

  res.status(201).json({
    success: true,
    message: 'স্যাম্পল ইভ্যালুয়েশন রিকোয়েস্ট কনফার্ম হয়েছে এবং ডিসপ্যাচ ট্র্যাকিং তৈরি হয়েছে।',
    sample: newSample
  });
});
