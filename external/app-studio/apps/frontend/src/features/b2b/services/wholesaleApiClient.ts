import { auth } from '@/lib/firebase';
import { B2BPaymentTerms, PurchaseOrderDraft, WholesaleSampleOrder } from '@/features/b2b/types/b2bTypes';

async function getAuthHeaders(includeJson = false): Promise<Record<string, string>> {
  const token = auth.currentUser ? await auth.currentUser.getIdToken() : null;
  const headers: Record<string, string> = {};
  if (includeJson) headers['Content-Type'] = 'application/json';
  if (token) headers['Authorization'] = `Bearer ${token}`;
  return headers;
}

export async function fetchWholesaleRFQsApi(): Promise<PurchaseOrderDraft[]> {
  const res = await fetch('/api/wholesale/rfqs', { headers: await getAuthHeaders() });
  if (!res.ok) throw new Error('Failed to load wholesale RFQs');
  const data = await res.json();
  return data.rfqs || [];
}

export async function submitWholesaleRFQApi(payload: {
  productId: string;
  productName: string;
  quantity: number;
  targetPrice?: number;
  baseUnitPrice?: number;
  deliveryDistrict: string;
  paymentTerms?: B2BPaymentTerms;
  notes?: string;
  buyerName: string;
  buyerPhone: string;
  buyerCompany: string;
  email?: string;
}): Promise<{ rfqId: string; poDraft: PurchaseOrderDraft }> {
  const res = await fetch('/api/wholesale/rfq', {
    method: 'POST',
    headers: await getAuthHeaders(true),
    body: JSON.stringify(payload)
  });
  if (!res.ok) throw new Error('Failed to submit B2B RFQ');
  return await res.json();
}

export async function updateWholesaleRFQStatusApi(
  id: string,
  payload: { status?: string; counterPrice?: number; comments?: string; escrowId?: string }
): Promise<{ poDraft: PurchaseOrderDraft }> {
  const res = await fetch(`/api/wholesale/rfq/${encodeURIComponent(id)}/respond`, {
    method: 'POST',
    headers: await getAuthHeaders(true),
    body: JSON.stringify(payload)
  });
  if (!res.ok) throw new Error('Failed to update RFQ status');
  return await res.json();
}

export async function fetchWholesaleSamplesApi(): Promise<WholesaleSampleOrder[]> {
  const res = await fetch('/api/wholesale/samples', { headers: await getAuthHeaders() });
  if (!res.ok) throw new Error('Failed to load sample orders');
  const data = await res.json();
  return data.samples || [];
}

export async function submitWholesaleSampleApi(payload: {
  productId: string;
  productTitle: string;
  companyName: string;
  contactPerson: string;
  phone: string;
  shippingAddress: string;
  sampleFee?: number;
}): Promise<{ sample: WholesaleSampleOrder }> {
  const res = await fetch('/api/wholesale/sample', {
    method: 'POST',
    headers: await getAuthHeaders(true),
    body: JSON.stringify(payload)
  });
  if (!res.ok) throw new Error('Failed to submit sample order');
  return await res.json();
}
