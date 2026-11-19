import {
  SELLER_TIER_DEFINITIONS,
  TRUST_LEVEL_DEFINITIONS,
  isGovernanceRole,
  normalizeHandle,
  type BusinessRole,
  type KycStatus,
  type PublicProfileProjection,
  type SellerTier,
  type TrustLevel,
  type UserRole
} from '../../../../packages/shared/src/index.js';
import { getEscrowSummaryForUser } from '../wallet/walletService.js';

export interface ServerVendorDocument {
  id: string;
  type: 'Trade License' | 'NID / Passport' | 'TIN Certificate' | 'Vehicle Registration';
  fileName: string;
  status: 'pending' | 'verified' | 'rejected';
  uploadedAt: string;
}

export interface ServerVendorProfile {
  id: string;
  handle: string;
  applicantId: string;
  storeName: string;
  legalEntityName: string;
  businessRegNumber: string;
  taxIdentificationNumber: string;
  nidNumber: string;
  sellerTier: SellerTier;
  kycStatus: KycStatus;
  trustLevel: TrustLevel;
  category: string;
  verified: boolean;
  status: 'active' | 'pending' | 'suspended';
  commissionTier: 'Standard 8%' | 'Wholesale 4%' | 'Enterprise 2.5%';
  rating: number;
  totalSales: number;
  location: string;
  isOpen?: boolean;
  openingHoursLabel?: string;
  coordinates?: { lat: number; lng: number };
  createdAt: string;
  activeRoles: BusinessRole[];
  documents: ServerVendorDocument[];
  payoutAccount: {
    type: 'Bank Account' | 'bKash Merchant' | 'Nagad Merchant' | 'Rocket';
    accountName: string;
    accountNumber: string;
    routingNumber?: string;
  };
}

export interface KycApplicationRecord {
  id: string;
  applicantId: string;
  storeName: string;
  legalEntityName: string;
  sellerTier: SellerTier;
  nidNumber: string;
  businessRegNumber: string;
  taxIdentificationNumber: string;
  payoutProvider: string;
  payoutNumber: string;
  activeRoles: BusinessRole[];
  documents: ServerVendorDocument[];
  status: KycStatus;
  submittedAt: string;
  reviewedAt?: string;
  reviewedBy?: string;
  reviewNote?: string;
  vendorId: string;
}

const seededStores: ServerVendorProfile[] = [
  {
    id: 'store_dhaka_electro',
    handle: 'technova_bd_flagship',
    applicantId: 'usr_vendor_1',
    storeName: 'TechNova BD Flagship',
    legalEntityName: 'TechNova Bangladesh Ltd.',
    businessRegNumber: 'TRD-DHK-2025-4410',
    taxIdentificationNumber: 'TIN-880192837',
    nidNumber: '1991448273610',
    sellerTier: 'brand_seller',
    kycStatus: 'approved',
    trustLevel: 5,
    category: 'retail',
    verified: true,
    status: 'active',
    commissionTier: 'Standard 8%',
    rating: 4.9,
    totalSales: 482500,
    location: 'Bashundhara City, Dhaka',
    isOpen: true,
    openingHoursLabel: '10:00 AM – 9:30 PM',
    coordinates: { lat: 23.751, lng: 90.3905 },
    createdAt: '2026-01-12T08:00:00Z',
    activeRoles: ['retail_merchant', 'service_provider'],
    documents: [
      { id: 'doc_seed_1', type: 'Trade License', fileName: 'TechNova_Trade_2026.pdf', status: 'verified', uploadedAt: '2026-01-12' },
      { id: 'doc_seed_2', type: 'NID / Passport', fileName: 'Director_NID_Verified.jpg', status: 'verified', uploadedAt: '2026-01-12' }
    ],
    payoutAccount: {
      type: 'bKash Merchant',
      accountName: 'TechNova Bangladesh Ltd.',
      accountNumber: '01711-889900'
    }
  },
  {
    id: 'store_chawkbazar_bulk',
    handle: 'chawkbazar_wholesale_syndicate',
    applicantId: 'usr_vendor_2',
    storeName: 'Chawkbazar Wholesale Syndicate',
    legalEntityName: 'Al-Madina Textiles & Wholesale Co.',
    businessRegNumber: 'TRD-CHWK-2024-9012',
    taxIdentificationNumber: 'TIN-773399110',
    nidNumber: '1986441002938',
    sellerTier: 'wholesale_seller',
    kycStatus: 'approved',
    trustLevel: 6,
    category: 'wholesale',
    verified: true,
    status: 'active',
    commissionTier: 'Wholesale 4%',
    rating: 4.8,
    totalSales: 1940000,
    location: 'Chawkbazar, Old Dhaka',
    isOpen: true,
    openingHoursLabel: '8:30 AM – 8:00 PM',
    coordinates: { lat: 23.7152, lng: 90.3965 },
    createdAt: '2025-11-20T08:00:00Z',
    activeRoles: ['wholesale_supplier', 'retail_merchant'],
    documents: [
      { id: 'doc_seed_3', type: 'Trade License', fileName: 'Chawk_Trade_License.pdf', status: 'verified', uploadedAt: '2025-11-20' },
      { id: 'doc_seed_4', type: 'TIN Certificate', fileName: 'eTIN_773399110.pdf', status: 'verified', uploadedAt: '2025-11-20' }
    ],
    payoutAccount: {
      type: 'Bank Account',
      accountName: 'Al-Madina Textiles Co.',
      accountNumber: '110200334455',
      routingNumber: '090270012'
    }
  },
  {
    id: 'store_gazipur_factory',
    handle: 'gazipur_knitwear_oem_mills',
    applicantId: 'usr_vendor_3',
    storeName: 'Gazipur Knitwear OEM Mills',
    legalEntityName: 'Padma Apparel Exports Ltd.',
    businessRegNumber: 'EPB-EXP-2024-771',
    taxIdentificationNumber: 'TIN-662200441',
    nidNumber: '1982003948172',
    sellerTier: 'factory_seller',
    kycStatus: 'approved',
    trustLevel: 7,
    category: 'wholesale',
    verified: true,
    status: 'active',
    commissionTier: 'Enterprise 2.5%',
    rating: 4.95,
    totalSales: 6240000,
    location: 'BSCIC Industrial Area, Gazipur',
    isOpen: true,
    openingHoursLabel: '8:00 AM – 6:00 PM',
    coordinates: { lat: 23.9999, lng: 90.4203 },
    createdAt: '2025-09-05T08:00:00Z',
    activeRoles: ['wholesale_supplier', 'rideshare_driver'],
    documents: [
      { id: 'doc_seed_5', type: 'Trade License', fileName: 'EPB_Factory_License.pdf', status: 'verified', uploadedAt: '2025-09-05' },
      { id: 'doc_seed_6', type: 'NID / Passport', fileName: 'MD_Passport_Scan.pdf', status: 'verified', uploadedAt: '2025-09-05' }
    ],
    payoutAccount: {
      type: 'Bank Account',
      accountName: 'Padma Apparel Exports Ltd.',
      accountNumber: '205011229900',
      routingNumber: '125260431'
    }
  }
];

const vendorStoreRegistry = new Map<string, ServerVendorProfile>(
  seededStores.map((s) => [s.id, s])
);

const kycApplicationQueue: KycApplicationRecord[] = [
  {
    id: 'KYC-2026-104',
    applicantId: 'usr_pending_1',
    storeName: 'Sylhet Organic Tea & Spices',
    legalEntityName: 'Surma Agro Valley Traders',
    sellerTier: 'wholesale_seller',
    nidNumber: '1993558102934',
    businessRegNumber: 'TRD-SYL-2026-3318',
    taxIdentificationNumber: 'TIN-551109234',
    payoutProvider: 'bKash Merchant',
    payoutNumber: '01819-445566',
    activeRoles: ['retail_merchant', 'wholesale_supplier'],
    documents: [
      { id: 'doc_q_1', type: 'Trade License', fileName: 'Sylhet_CityCorp_License.pdf', status: 'pending', uploadedAt: '2026-11-11' },
      { id: 'doc_q_2', type: 'NID / Passport', fileName: 'Proprietor_NID_1993.jpg', status: 'pending', uploadedAt: '2026-11-11' }
    ],
    status: 'under_review',
    submittedAt: '2026-11-11T14:22:00Z',
    vendorId: 'store_sylhet_tea'
  }
];

export interface VendorSubmissionPayload {
  applicantId?: string;
  handle?: string;
  storeName?: string;
  tradingName?: string;
  legalEntityName?: string;
  sellerTier?: SellerTier;
  category?: string;
  nidNumber?: string;
  businessRegistrationNumber?: string;
  taxIdentificationNumber?: string;
  activeRoles?: BusinessRole[];
  payoutAccount?: {
    type: 'Bank Account' | 'bKash Merchant' | 'Nagad Merchant' | 'Rocket';
    accountName?: string;
    accountNumber: string;
    routingNumber?: string;
  };
  documents?: ServerVendorDocument[];
  location?: string;
}

export function computeTrustLevel(payload: {
  nidNumber?: string;
  businessRegNumber?: string;
  taxIdentificationNumber?: string;
  sellerTier?: SellerTier;
}): TrustLevel {
  let level: TrustLevel = 2;
  if (payload.nidNumber && payload.nidNumber.trim().length >= 8) {
    level = 4;
  }
  if (
    level >= 4 &&
    payload.businessRegNumber &&
    payload.businessRegNumber.trim().length >= 5 &&
    payload.taxIdentificationNumber &&
    payload.taxIdentificationNumber.trim().length >= 5
  ) {
    level = 5;
  }
  if (
    level >= 5 &&
    (payload.sellerTier === 'factory_seller' || payload.sellerTier === 'importer')
  ) {
    level = 6;
  }
  if (level >= 5 && payload.sellerTier === 'exporter') {
    level = 7;
  }
  return level;
}

export function submitVendorKycApplication(payload: VendorSubmissionPayload): {
  application: KycApplicationRecord;
  vendorProfile: ServerVendorProfile;
  trustMeta: (typeof TRUST_LEVEL_DEFINITIONS)[TrustLevel];
} {
  const storeName = (payload.storeName || payload.tradingName || 'Verified Merchant Store').trim();
  const sellerTier: SellerTier = payload.sellerTier || 'retail_seller';
  const tierMeta =
    SELLER_TIER_DEFINITIONS.find((t) => t.tier === sellerTier) || SELLER_TIER_DEFINITIONS[0];

  const nidNumber = (payload.nidNumber || '').trim();
  const businessRegNumber = (payload.businessRegistrationNumber || `TRD-2026-${Math.floor(1000 + Math.random() * 9000)}`).trim();
  const taxIdentificationNumber = (payload.taxIdentificationNumber || '').trim();

  const docs: ServerVendorDocument[] =
    Array.isArray(payload.documents) && payload.documents.length > 0
      ? payload.documents.map((d, i) => ({
          id: d.id || `doc_${Date.now()}_${i}`,
          type: d.type,
          fileName: d.fileName,
          status: 'pending' as const,
          uploadedAt: new Date().toISOString().split('T')[0]
        }))
      : [
          {
            id: `doc_${Date.now()}_nid`,
            type: 'NID / Passport',
            fileName: `NID_${nidNumber || 'Submitted'}.jpg`,
            status: 'pending' as const,
            uploadedAt: new Date().toISOString().split('T')[0]
          },
          {
            id: `doc_${Date.now()}_trd`,
            type: 'Trade License',
            fileName: `${businessRegNumber}.pdf`,
            status: 'pending' as const,
            uploadedAt: new Date().toISOString().split('T')[0]
          }
        ];

  const hasCompleteCredentials = nidNumber.length >= 10 && businessRegNumber.length >= 5;
  // Zero Demo-Bypass Rule: Merchant KYC must always be reviewed and approved by Platform Governance.
  const kycStatus: KycStatus = hasCompleteCredentials ? 'under_review' : 'submitted';
  const trustLevel = computeTrustLevel({
    nidNumber,
    businessRegNumber,
    taxIdentificationNumber,
    sellerTier
  });

  const vendorId = `vnd_${Date.now()}`;
  const vendorHandle = normalizeHandle(payload.handle || storeName);
  const vendorProfile: ServerVendorProfile = {
    id: vendorId,
    handle: vendorHandle,
    applicantId: payload.applicantId || 'user_me',
    storeName,
    legalEntityName: (payload.legalEntityName || storeName).trim(),
    businessRegNumber,
    taxIdentificationNumber: taxIdentificationNumber || 'TIN-PENDING',
    nidNumber: nidNumber || 'NID-PENDING',
    sellerTier,
    kycStatus,
    trustLevel,
    category: payload.category || (sellerTier.includes('wholesale') || sellerTier === 'factory_seller' ? 'wholesale' : 'retail'),
    verified: false,
    status: 'pending',
    commissionTier: tierMeta.commissionLabel,
    rating: 5.0,
    totalSales: 0,
    location: payload.location || 'Dhaka Central Commercial Hub',
    isOpen: true,
    openingHoursLabel: '9:00 AM – 9:00 PM',
    createdAt: new Date().toISOString(),
    activeRoles: payload.activeRoles && payload.activeRoles.length > 0 ? payload.activeRoles : ['retail_merchant'],
    documents: docs,
    payoutAccount: {
      type: payload.payoutAccount?.type || 'bKash Merchant',
      accountName: payload.payoutAccount?.accountName || storeName,
      accountNumber: payload.payoutAccount?.accountNumber || '01700000000',
      routingNumber: payload.payoutAccount?.routingNumber
    }
  };

  vendorStoreRegistry.set(vendorId, vendorProfile);

  const application: KycApplicationRecord = {
    id: `KYC-${Date.now().toString().slice(-6)}`,
    applicantId: vendorProfile.applicantId,
    storeName: vendorProfile.storeName,
    legalEntityName: vendorProfile.legalEntityName,
    sellerTier,
    nidNumber: vendorProfile.nidNumber,
    businessRegNumber: vendorProfile.businessRegNumber,
    taxIdentificationNumber: vendorProfile.taxIdentificationNumber,
    payoutProvider: vendorProfile.payoutAccount.type,
    payoutNumber: vendorProfile.payoutAccount.accountNumber,
    activeRoles: vendorProfile.activeRoles,
    documents: docs,
    status: kycStatus,
    submittedAt: new Date().toISOString(),
    reviewedAt: undefined,
    reviewedBy: undefined,
    vendorId
  };

  kycApplicationQueue.unshift(application);

  return {
    application,
    vendorProfile,
    trustMeta: TRUST_LEVEL_DEFINITIONS[trustLevel]
  };
}

export function listKycQueue(requesterRole?: UserRole): {
  authorized: boolean;
  applications: KycApplicationRecord[];
} {
  if (!isGovernanceRole(requesterRole)) {
    return { authorized: false, applications: [] };
  }
  return { authorized: true, applications: kycApplicationQueue };
}

export function decideKycApplication(params: {
  applicationId: string;
  decision: 'approved' | 'rejected' | 'suspended';
  reviewerEmail: string;
  requesterRole?: UserRole;
  note?: string;
}): { ok: boolean; statusCode: number; error?: string; application?: KycApplicationRecord } {
  if (!isGovernanceRole(params.requesterRole)) {
    return {
      ok: false,
      statusCode: 403,
      error: 'Admin or Super Admin governance permissions required to approve merchant KYC.'
    };
  }

  const app = kycApplicationQueue.find((a) => a.id === params.applicationId);
  if (!app) {
    return { ok: false, statusCode: 404, error: 'KYC application record not found.' };
  }

  app.status = params.decision;
  app.reviewedAt = new Date().toISOString();
  app.reviewedBy = params.reviewerEmail || 'Platform Governance';
  app.reviewNote = params.note;
  app.documents = app.documents.map((doc) => ({
    ...doc,
    status: params.decision === 'approved' ? 'verified' : params.decision === 'rejected' ? 'rejected' : 'pending'
  }));

  const store = vendorStoreRegistry.get(app.vendorId);
  if (store) {
    store.kycStatus = params.decision;
    store.verified = params.decision === 'approved';
    store.status = params.decision === 'approved' ? 'active' : params.decision === 'suspended' ? 'suspended' : 'pending';
    store.documents = app.documents;
    if (params.decision === 'approved') {
      store.trustLevel = computeTrustLevel({
        nidNumber: store.nidNumber,
        businessRegNumber: store.businessRegNumber,
        taxIdentificationNumber: store.taxIdentificationNumber,
        sellerTier: store.sellerTier
      });
    }
  } else if (params.decision === 'approved') {
    const newStore: ServerVendorProfile = {
      id: app.vendorId,
      handle: normalizeHandle(app.storeName),
      applicantId: app.applicantId,
      storeName: app.storeName,
      legalEntityName: app.legalEntityName,
      businessRegNumber: app.businessRegNumber,
      taxIdentificationNumber: app.taxIdentificationNumber,
      nidNumber: app.nidNumber,
      sellerTier: app.sellerTier,
      kycStatus: 'approved',
      trustLevel: 5,
      category: app.sellerTier.includes('wholesale') ? 'wholesale' : 'retail',
      verified: true,
      status: 'active',
      commissionTier: app.sellerTier === 'wholesale_seller' ? 'Wholesale 4%' : 'Standard 8%',
      rating: 5.0,
      totalSales: 0,
      location: 'Sylhet & Dhaka Logistics Network',
      isOpen: true,
      openingHoursLabel: '9:00 AM – 9:00 PM',
      createdAt: app.submittedAt,
      activeRoles: app.activeRoles,
      documents: app.documents,
      payoutAccount: {
        type: 'bKash Merchant',
        accountName: app.storeName,
        accountNumber: app.payoutNumber
      }
    };
    vendorStoreRegistry.set(app.vendorId, newStore);
  }

  return { ok: true, statusCode: 200, application: app };
}

export type PublicStoreSummary = Omit<
  ServerVendorProfile,
  'nidNumber' | 'taxIdentificationNumber' | 'businessRegNumber' | 'payoutAccount' | 'documents' | 'applicantId'
>;

function sanitizePublicStore(store: ServerVendorProfile): PublicStoreSummary {
  const {
    nidNumber: _nid,
    taxIdentificationNumber: _tin,
    businessRegNumber: _reg,
    payoutAccount: _payout,
    documents: _docs,
    applicantId: _applicantId,
    ...publicFields
  } = store;
  return publicFields;
}

export function isStoreOwnedByUser(storeId: string | undefined, uid: string | undefined): boolean {
  if (!storeId || !uid) return false;
  const store = vendorStoreRegistry.get(storeId);
  return Boolean(store && store.applicantId === uid);
}

export function getStoreOwnerId(storeId: string): string | null {
  return vendorStoreRegistry.get(storeId)?.applicantId || null;
}

export function listPublicStores(): PublicStoreSummary[] {
  return Array.from(vendorStoreRegistry.values())
    .filter((s) => s.status !== 'suspended' && s.verified)
    .map(sanitizePublicStore);
}

export function getPublicStoreById(storeId: string): PublicStoreSummary | null {
  const store = vendorStoreRegistry.get(storeId);
  if (!store || store.status === 'suspended' || !store.verified) return null;
  return sanitizePublicStore(store);
}

/**
 * Strictly Zero-PII Public Profile Projection lookup by @handle or storeId.
 * Strips nidNumber, taxIdentificationNumber, businessRegNumber, payoutAccount, and emails.
 */
export function getPublicProfileByHandle(handleOrId: string): PublicProfileProjection | null {
  const normalized = normalizeHandle(handleOrId);
  const matched = Array.from(vendorStoreRegistry.values()).find(
    (s) =>
      s.status !== 'suspended' &&
      (s.id === handleOrId ||
        s.applicantId === handleOrId ||
        s.handle === normalized ||
        normalizeHandle(s.storeName) === normalized)
  );

  if (!matched) return null;

  return {
    handle: matched.handle || normalizeHandle(matched.storeName),
    storeId: matched.id,
    displayName: matched.storeName,
    location: matched.location,
    verified: matched.verified,
    trustLevel: matched.trustLevel,
    sellerTier: matched.sellerTier,
    category: matched.category,
    rating: matched.rating,
    activeRoles: matched.activeRoles,
    isOpen: matched.isOpen ?? true,
    openingHoursLabel: matched.openingHoursLabel || '9:00 AM – 9:00 PM',
    coordinates: matched.coordinates
  };
}

export function getVendorAnalytics(vendorId: string, userId = 'user_me') {
  const store = vendorStoreRegistry.get(vendorId);
  const escrowSummary = getEscrowSummaryForUser(userId);
  const grossSalesBdt = (store?.totalSales || 0) + escrowSummary.summary.totalReleased;
  const escrowHeldBdt = escrowSummary.summary.totalHeld;
  const completedEscrows = escrowSummary.escrows.filter((e) => e.status === 'released').length;
  const pendingEscrows = escrowSummary.escrows.filter((e) => e.status === 'held').length;
  const commissionRate =
    store?.commissionTier === 'Enterprise 2.5%'
      ? 0.025
      : store?.commissionTier === 'Wholesale 4%'
      ? 0.04
      : 0.08;

  return {
    vendorId,
    storeName: store?.storeName || 'PaikarMart Merchant Store',
    kycStatus: store?.kycStatus || 'approved',
    trustLevel: store?.trustLevel || 5,
    sellerTier: store?.sellerTier || 'retail_seller',
    commissionTier: store?.commissionTier || 'Standard 8%',
    metrics: {
      grossSalesBdt,
      escrowHeldBdt,
      netPayoutReadyBdt: Math.round(grossSalesBdt * (1 - commissionRate)),
      completedEscrows,
      pendingEscrows,
      rating: store?.rating || 5.0
    }
  };
}
