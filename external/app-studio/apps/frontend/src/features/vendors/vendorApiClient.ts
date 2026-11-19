import type { PublicProfileProjection } from '@paikarmart/shared';
import { auth } from '@/lib/firebase';
import {
  BusinessDocument,
  BusinessRole,
  KycStatus,
  PayoutAccount,
  SellerTier,
  TrustLevel,
  UserRole,
  VendorProfile
} from '@/types';

const API_BASE = ((import.meta as any).env?.VITE_API_BASE_URL || '').replace(/\/$/, '');

async function authenticatedHeaders(extra: Record<string, string> = {}): Promise<Record<string, string>> {
  const token = auth.currentUser ? await auth.currentUser.getIdToken() : null;
  return token ? { ...extra, Authorization: `Bearer ${token}` } : extra;
}

export interface VendorKycSubmissionRequest {
  applicantId: string;
  storeName: string;
  legalEntityName: string;
  sellerTier: SellerTier;
  nidNumber: string;
  businessRegistrationNumber: string;
  taxIdentificationNumber: string;
  activeRoles: BusinessRole[];
  payoutAccount: PayoutAccount;
  documents: BusinessDocument[];
  location?: string;
}

export interface KycApplicationItem {
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
  documents: BusinessDocument[];
  status: KycStatus;
  submittedAt: string;
  reviewedAt?: string;
  reviewedBy?: string;
  reviewNote?: string;
  vendorId: string;
}

export interface VendorAnalyticsSummary {
  vendorId: string;
  storeName: string;
  kycStatus: KycStatus;
  trustLevel: TrustLevel;
  sellerTier: SellerTier;
  commissionTier: string;
  metrics: {
    grossSalesBdt: number;
    escrowHeldBdt: number;
    netPayoutReadyBdt: number;
    completedEscrows: number;
    pendingEscrows: number;
    rating: number;
  };
}

export const vendorApiClient = {
  async registerVendorKyc(payload: VendorKycSubmissionRequest): Promise<{
    application: KycApplicationItem;
    vendorProfile: VendorProfile;
    message: string;
  }> {
    const res = await fetch(`${API_BASE}/api/vendors/register`, {
      method: 'POST',
      headers: await authenticatedHeaders({ 'Content-Type': 'application/json' }),
      body: JSON.stringify(payload)
    });
    const data = await res.json();
    if (!res.ok) {
      throw new Error(data?.error || 'Failed to submit KYC application.');
    }
    return data;
  },

  async fetchVendorAnalytics(vendorId: string, userId?: string): Promise<VendorAnalyticsSummary | null> {
    try {
      const res = await fetch(`${API_BASE}/api/vendors/${encodeURIComponent(vendorId)}/analytics`, {
      headers: await authenticatedHeaders()
      });
      if (!res.ok) return null;
      const data = await res.json();
      return data.analytics || null;
    } catch {
      return null;
    }
  },

  async fetchPublicStores(): Promise<VendorProfile[]> {
    try {
      const res = await fetch(`${API_BASE}/api/vendors/stores`);
      if (!res.ok) return [];
      const data = await res.json();
      return data.stores || [];
    } catch {
      return [];
    }
  },

  async fetchPublicStoreById(storeId: string): Promise<VendorProfile | null> {
    try {
      const res = await fetch(`${API_BASE}/api/vendors/stores/${encodeURIComponent(storeId)}`);
      if (!res.ok) return null;
      const data = await res.json();
      return data.store || null;
    } catch {
      return null;
    }
  },

  async fetchPublicProfileByHandle(handle: string): Promise<PublicProfileProjection | null> {
    try {
      const res = await fetch(`${API_BASE}/api/vendors/profile/${encodeURIComponent(handle)}`);
      if (!res.ok) return null;
      const data = await res.json();
      return data.profile || null;
    } catch {
      return null;
    }
  },

  async fetchKycQueue(requesterRole: UserRole): Promise<KycApplicationItem[]> {
    const res = await fetch(`${API_BASE}/api/vendors/kyc/queue`, { headers: await authenticatedHeaders() });
    const data = await res.json();
    if (!res.ok) {
      throw new Error(data?.error || 'Governance access required.');
    }
    return data.applications || [];
  },

  async decideKycApplication(params: {
    applicationId: string;
    decision: 'approved' | 'rejected' | 'suspended';
    requesterRole: UserRole;
    reviewerEmail: string;
    note?: string;
  }): Promise<KycApplicationItem> {
    const res = await fetch(`${API_BASE}/api/vendors/kyc/${encodeURIComponent(params.applicationId)}/decision`, {
      method: 'POST',
      headers: await authenticatedHeaders({ 'Content-Type': 'application/json' }),
      body: JSON.stringify({
        decision: params.decision,
        reviewerEmail: params.reviewerEmail,
        note: params.note
      })
    });
    const data = await res.json();
    if (!res.ok) {
      throw new Error(data?.error || 'Failed to record KYC decision.');
    }
    return data.application;
  }
};
