import { auth } from '@/lib/firebase';

const API_BASE = ((import.meta as any).env?.VITE_API_BASE_URL || '').replace(/\/$/, '');

async function authHeaders(): Promise<Record<string, string>> {
  const token = auth.currentUser ? await auth.currentUser.getIdToken() : null;
  return token ? { Authorization: `Bearer ${token}`, 'Content-Type': 'application/json' } : { 'Content-Type': 'application/json' };
}

export async function syncAuthenticatedProfile(payload: { name: string; handle?: string; avatar?: string; location?: string }): Promise<unknown | null> {
  const response = await fetch(`${API_BASE}/api/auth/profile`, { method: 'PUT', headers: await authHeaders(), body: JSON.stringify(payload) });
  if (!response.ok) throw new Error((await response.json().catch(() => ({})))?.error || 'Profile sync failed.');
  return (await response.json()).profile || null;
}

export async function fetchAuthenticatedProfile(): Promise<unknown | null> {
  const response = await fetch(`${API_BASE}/api/auth/profile`, { headers: await authHeaders() });
  if (!response.ok) return null;
  return (await response.json()).profile || null;
}
