import { EscrowRecord, EscrowSummary, WalletServerPayload } from '@/features/wallet/types/walletTypes';
import { auth } from '@/lib/firebase';

async function authenticatedHeaders(json = false): Promise<Record<string, string>> {
  const user = auth.currentUser;
  if (!user) throw new Error('Please sign in to use wallet services.');
  const token = await user.getIdToken();
  return {
    ...(json ? { 'Content-Type': 'application/json' } : {}),
    Authorization: `Bearer ${token}`,
  };
}

export async function fetchWalletStateApi(userId = 'user_me'): Promise<{
  wallet: WalletServerPayload;
  escrowSummary: EscrowSummary;
  escrows: EscrowRecord[];
}> {
  void userId;
  const res = await fetch('/api/wallet', { headers: await authenticatedHeaders() });
  if (!res.ok) throw new Error('Failed to fetch wallet state');
  return await res.json();
}

export async function depositWalletApi(payload: {
  userId?: string;
  amount: number;
  method: string;
  idempotencyKey?: string;
}): Promise<{ wallet: WalletServerPayload; earnedCoins?: number }> {
  const res = await fetch('/api/wallet/deposit', {
    method: 'POST',
    headers: await authenticatedHeaders(true),
    body: JSON.stringify(payload)
  });
  const data = await res.json();
  if (!res.ok) throw new Error(data.error || 'Deposit failed');
  return data;
}

export async function withdrawWalletApi(payload: {
  userId?: string;
  amount: number;
  method: string;
  accountDetails?: string;
  idempotencyKey?: string;
}): Promise<{ wallet: WalletServerPayload }> {
  const res = await fetch('/api/wallet/withdraw', {
    method: 'POST',
    headers: await authenticatedHeaders(true),
    body: JSON.stringify(payload)
  });
  const data = await res.json();
  if (!res.ok) throw new Error(data.error || 'Withdrawal failed');
  return data;
}

export async function transferWalletApi(payload: {
  userId?: string;
  amount: number;
  recipient: string;
  note?: string;
  idempotencyKey?: string;
}): Promise<{ wallet: WalletServerPayload }> {
  const res = await fetch('/api/wallet/transfer', {
    method: 'POST',
    headers: await authenticatedHeaders(true),
    body: JSON.stringify(payload)
  });
  const data = await res.json();
  if (!res.ok) throw new Error(data.error || 'Transfer failed');
  return data;
}

export async function redeemCoinsApi(payload: {
  userId?: string;
  coinsToRedeem: number;
}): Promise<{ wallet: WalletServerPayload; bdtValue: number }> {
  const res = await fetch('/api/wallet/redeem-coins', {
    method: 'POST',
    headers: await authenticatedHeaders(true),
    body: JSON.stringify(payload)
  });
  const data = await res.json();
  if (!res.ok) throw new Error(data.error || 'Coin redemption failed');
  return data;
}

export async function fetchEscrowSummaryApi(userId = 'user_me'): Promise<{
  summary: EscrowSummary;
  escrows: EscrowRecord[];
}> {
  void userId;
  const res = await fetch('/api/escrow/summary', { headers: await authenticatedHeaders() });
  if (!res.ok) throw new Error('Failed to fetch escrow summary');
  return await res.json();
}

export async function createEscrowHoldApi(payload: {
  orderId: string;
  poNumber?: string;
  title?: string;
  amount: number;
  buyerId?: string;
  buyerName?: string;
  sellerId?: string;
  sellerName?: string;
  holdDays?: number;
}): Promise<{ escrow: EscrowRecord; wallet: WalletServerPayload }> {
  const res = await fetch('/api/escrow/hold', {
    method: 'POST',
    headers: await authenticatedHeaders(true),
    body: JSON.stringify(payload)
  });
  const data = await res.json();
  if (!res.ok) throw new Error(data.error || 'Could not create escrow hold');
  return data;
}

export async function releaseEscrowApi(escrowId: string): Promise<{
  escrow: EscrowRecord;
  wallet: WalletServerPayload;
}> {
  const res = await fetch(`/api/escrow/release/${encodeURIComponent(escrowId)}`, {
    method: 'POST',
    headers: await authenticatedHeaders(true)
  });
  const data = await res.json();
  if (!res.ok) throw new Error(data.error || 'Could not release escrow');
  return data;
}

export async function disputeEscrowApi(
  escrowId: string,
  reason: string
): Promise<{ escrow: EscrowRecord; wallet: WalletServerPayload }> {
  const res = await fetch(`/api/escrow/dispute/${encodeURIComponent(escrowId)}`, {
    method: 'POST',
    headers: await authenticatedHeaders(true),
    body: JSON.stringify({ reason })
  });
  const data = await res.json();
  if (!res.ok) throw new Error(data.error || 'Could not file dispute');
  return data;
}
