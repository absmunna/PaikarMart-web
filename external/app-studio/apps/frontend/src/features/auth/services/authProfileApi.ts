import { auth } from '@/lib/firebase';
import { SavedAddress } from '@/types';

const API_BASE = ((import.meta as any).env?.VITE_API_BASE_URL || '').replace(/\/$/, '');

async function authHeaders(): Promise<Record<string, string>> {
  const token = auth.currentUser ? await auth.currentUser.getIdToken() : null;
  return token ? { Authorization: `Bearer ${token}`, 'Content-Type': 'application/json' } : { 'Content-Type': 'application/json' };
}

export async function syncAuthenticatedProfile(payload: { name: string; handle?: string; avatar?: string; location?: string; phone?: string }): Promise<unknown | null> {
  const response = await fetch(`${API_BASE}/api/auth/profile`, { method: 'PUT', headers: await authHeaders(), body: JSON.stringify(payload) });
  if (!response.ok) throw new Error((await response.json().catch(() => ({})))?.error || 'Profile sync failed.');
  return (await response.json()).profile || null;
}

export async function fetchSavedAddresses(): Promise<SavedAddress[]> {
  const response = await fetch(`${API_BASE}/api/auth/addresses`, { headers: await authHeaders() });
  if (!response.ok) return [];
  return ((await response.json()).addresses || []).map((item: any) => ({ id: item.id, label: item.label, recipientName: item.recipient_name, phone: item.phone, streetAddress: item.street_address, apartment: item.apartment || undefined, city: item.city, postalCode: item.postal_code || undefined, tag: item.tag, isDefault: item.is_default, notes: item.notes || undefined }));
}

export async function createSavedAddress(address: Omit<SavedAddress, 'id'>): Promise<SavedAddress> {
  const response = await fetch(`${API_BASE}/api/auth/addresses`, { method: 'POST', headers: await authHeaders(), body: JSON.stringify(address) });
  const data = await response.json().catch(() => ({}));
  if (!response.ok) throw new Error(data?.error || 'Unable to save address.');
  const item = data.address;
  return { id: item.id, label: item.label, recipientName: item.recipient_name, phone: item.phone, streetAddress: item.street_address, apartment: item.apartment || undefined, city: item.city, postalCode: item.postal_code || undefined, tag: item.tag, isDefault: item.is_default, notes: item.notes || undefined };
}

export async function deleteSavedAddress(id: string): Promise<void> {
  const response = await fetch(`${API_BASE}/api/auth/addresses/${encodeURIComponent(id)}`, { method: 'DELETE', headers: await authHeaders() });
  if (!response.ok) throw new Error('Unable to delete address.');
}

export async function setDefaultSavedAddress(id: string): Promise<SavedAddress> {
  const response = await fetch(`${API_BASE}/api/auth/addresses/${encodeURIComponent(id)}/default`, { method: 'PATCH', headers: await authHeaders() });
  const data = await response.json().catch(() => ({}));
  if (!response.ok) throw new Error(data?.error || 'Unable to set default address.');
  const item = data.address;
  return { id: item.id, label: item.label, recipientName: item.recipient_name, phone: item.phone, streetAddress: item.street_address, apartment: item.apartment || undefined, city: item.city, postalCode: item.postal_code || undefined, tag: item.tag, isDefault: item.is_default, notes: item.notes || undefined };
}

export async function fetchAuthenticatedProfile(): Promise<unknown | null> {
  const response = await fetch(`${API_BASE}/api/auth/profile`, { headers: await authHeaders() });
  if (!response.ok) return null;
  return (await response.json()).profile || null;
}
