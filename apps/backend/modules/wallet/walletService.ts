import { isPersistentFinanceEnabled } from '../../config/env.js';
import {
  resolveOrderUuidByOrderKey,
  resolveProfileUuidByAuthUid,
  supabaseAdmin
} from '../../services/dbService.js';

export type WalletTxType = 'deposit' | 'withdrawal' | 'transfer' | 'purchase' | 'cashback' | 'escrow_hold' | 'escrow_release';
export type WalletTxStatus = 'completed' | 'pending' | 'failed';
export type EscrowStatus = 'held' | 'released' | 'disputed' | 'refunded';

export interface ServerWalletTransaction {
  id: string;
  idempotencyKey?: string;
  type: WalletTxType;
  amount: number;
  currency: 'BDT' | 'COIN';
  description: string;
  method?: string;
  referenceId: string;
  timestamp: string;
  status: WalletTxStatus;
}

export interface ServerWalletAccount {
  userId: string;
  balance: number;
  coins: number;
  escrowHeldBalance: number;
  transactions: ServerWalletTransaction[];
  updatedAt: string;
}

export interface ServerEscrowRecord {
  id: string;
  orderId: string;
  poNumber?: string;
  title: string;
  amount: number;
  buyerId: string;
  buyerName: string;
  sellerId: string;
  sellerName: string;
  status: EscrowStatus;
  holdDays: number;
  disputeReason?: string;
  createdAt: string;
  releaseAt: string;
  releasedAt?: string;
}

const walletStore = new Map<string, ServerWalletAccount>();
const escrowStore = new Map<string, ServerEscrowRecord>();
const processedIdempotencyKeys = new Set<string>();

function computeHeldBalanceForUser(userId: string): number {
  let held = 0;
  for (const esc of escrowStore.values()) {
    if ((esc.buyerId === userId || esc.sellerId === userId) && esc.status === 'held') {
      held += esc.amount;
    }
  }
  return held;
}

export function getOrCreateWallet(userId = 'user_me'): ServerWalletAccount {
  const key = userId || 'user_me';
  let wallet = walletStore.get(key);
  if (!wallet) {
    wallet = {
      userId: key,
      balance: 0,
      coins: 0,
      escrowHeldBalance: computeHeldBalanceForUser(key),
      transactions: [],
      updatedAt: new Date().toISOString()
    };
    walletStore.set(key, wallet);
  } else {
    wallet.escrowHeldBalance = computeHeldBalanceForUser(key);
  }
  return wallet;
}

export function depositToWallet(params: {
  userId?: string;
  amount: number;
  method?: string;
  referenceId?: string;
  idempotencyKey?: string;
}) {
  const { userId = 'user_me', amount, method = 'bKash Mobile Banking', referenceId, idempotencyKey } = params;
  if (!Number.isFinite(amount) || amount <= 0 || amount > 5000000) {
    throw new Error('INVALID_AMOUNT');
  }

  const wallet = getOrCreateWallet(userId);
  if (idempotencyKey && processedIdempotencyKeys.has(idempotencyKey)) {
    return { wallet, transaction: wallet.transactions[0], isDuplicate: true };
  }

  const earnedCoins = Math.max(5, Math.floor(amount / 100));
  wallet.balance += amount;
  wallet.coins += earnedCoins;
  wallet.updatedAt = new Date().toISOString();

  const tx: ServerWalletTransaction = {
    id: `tx_${Date.now()}`,
    idempotencyKey,
    type: 'deposit',
    amount,
    currency: 'BDT',
    description: `${method} এর মাধ্যমে ডিপোজিট`,
    method,
    referenceId: referenceId || `PM-DEP-${Math.floor(100000 + Math.random() * 900000)}`,
    timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
    status: 'completed'
  };

  wallet.transactions.unshift(tx);
  if (idempotencyKey) processedIdempotencyKeys.add(idempotencyKey);
  return { wallet, transaction: tx, earnedCoins, isDuplicate: false };
}

export function withdrawFromWallet(params: {
  userId?: string;
  amount: number;
  method?: string;
  accountDetails?: string;
  idempotencyKey?: string;
}) {
  const {
    userId = 'user_me',
    amount,
    method = 'bKash Mobile Wallet',
    accountDetails,
    idempotencyKey
  } = params;

  if (!Number.isFinite(amount) || amount < 50 || amount > 1000000) {
    throw new Error('INVALID_WITHDRAW_AMOUNT');
  }

  const wallet = getOrCreateWallet(userId);
  if (idempotencyKey && processedIdempotencyKeys.has(idempotencyKey)) {
    return { wallet, transaction: wallet.transactions[0], isDuplicate: true };
  }

  if (wallet.balance < amount) {
    throw new Error('INSUFFICIENT_BALANCE');
  }

  wallet.balance -= amount;
  wallet.updatedAt = new Date().toISOString();

  const tx: ServerWalletTransaction = {
    id: `tx_${Date.now()}`,
    idempotencyKey,
    type: 'withdrawal',
    amount,
    currency: 'BDT',
    description: accountDetails ? `উইথড্র (${method}: ${accountDetails})` : `উইথড্র (${method})`,
    method,
    referenceId: `PM-WTH-${Math.floor(100000 + Math.random() * 900000)}`,
    timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
    status: 'completed'
  };

  wallet.transactions.unshift(tx);
  if (idempotencyKey) processedIdempotencyKeys.add(idempotencyKey);
  return { wallet, transaction: tx, isDuplicate: false };
}

export function transferWalletP2P(params: {
  userId?: string;
  amount: number;
  recipient: string;
  note?: string;
  idempotencyKey?: string;
}) {
  const { userId = 'user_me', amount, recipient, note, idempotencyKey } = params;
  if (!Number.isFinite(amount) || amount <= 0 || amount > 500000) {
    throw new Error('INVALID_AMOUNT');
  }
  if (!recipient.trim()) {
    throw new Error('INVALID_RECIPIENT');
  }

  const wallet = getOrCreateWallet(userId);
  if (idempotencyKey && processedIdempotencyKeys.has(idempotencyKey)) {
    return { wallet, transaction: wallet.transactions[0], isDuplicate: true };
  }

  if (wallet.balance < amount) {
    throw new Error('INSUFFICIENT_BALANCE');
  }

  wallet.balance -= amount;
  wallet.updatedAt = new Date().toISOString();

  const tx: ServerWalletTransaction = {
    id: `tx_${Date.now()}`,
    idempotencyKey,
    type: 'transfer',
    amount,
    currency: 'BDT',
    description: note ? `${recipient}-কে সেন্ড মানি (${note})` : `${recipient}-কে ইনস্ট্যান্ট সেন্ড মানি`,
    method: 'PaikarMart P2P',
    referenceId: `PM-TRF-${Math.floor(100000 + Math.random() * 900000)}`,
    timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
    status: 'completed'
  };

  wallet.transactions.unshift(tx);
  if (idempotencyKey) processedIdempotencyKeys.add(idempotencyKey);
  return { wallet, transaction: tx, isDuplicate: false };
}

export function redeemWalletCoins(params: { userId?: string; coinsToRedeem: number }) {
  const { userId = 'user_me', coinsToRedeem } = params;
  const wallet = getOrCreateWallet(userId);

  if (!Number.isFinite(coinsToRedeem) || coinsToRedeem < 10) {
    throw new Error('INVALID_COINS');
  }
  if (wallet.coins < coinsToRedeem) {
    throw new Error('INSUFFICIENT_COINS');
  }

  const bdtValue = Math.floor(coinsToRedeem / 5);
  wallet.coins -= coinsToRedeem;
  wallet.balance += bdtValue;
  wallet.updatedAt = new Date().toISOString();

  const tx: ServerWalletTransaction = {
    id: `tx_${Date.now()}`,
    type: 'cashback',
    amount: bdtValue,
    currency: 'BDT',
    description: `${coinsToRedeem} রিওয়ার্ড কয়েন থেকে ৳${bdtValue} কনভার্সন`,
    method: 'Coin Redemption',
    referenceId: `PM-REDEEM-${Math.floor(1000 + Math.random() * 9000)}`,
    timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
    status: 'completed'
  };

  wallet.transactions.unshift(tx);
  return { wallet, transaction: tx, bdtValue };
}

export function createEscrowHoldRecord(params: {
  orderId: string;
  poNumber?: string;
  title?: string;
  amount: number;
  buyerId?: string;
  buyerName?: string;
  sellerId?: string;
  sellerName?: string;
  holdDays?: number;
}) {
  const {
    orderId,
    poNumber,
    title = `Escrow Protection for ${orderId}`,
    amount,
    buyerId = 'user_me',
    buyerName = 'Alex Rivera',
    sellerId = 'vendor_verified',
    sellerName = 'Verified PaikarMart Merchant',
    holdDays = 7
  } = params;

  if (!orderId || !Number.isFinite(amount) || amount <= 0) {
    throw new Error('INVALID_ESCROW_PARAMS');
  }

  const buyerWallet = getOrCreateWallet(buyerId);
  if (buyerWallet.balance < amount) {
    throw new Error('INSUFFICIENT_BALANCE');
  }

  buyerWallet.balance -= amount;
  buyerWallet.updatedAt = new Date().toISOString();

  const now = Date.now();
  const escrowId = `ESC-${new Date().getFullYear()}-${String(now).slice(-4)}`;
  const escrow: ServerEscrowRecord = {
    id: escrowId,
    orderId,
    poNumber,
    title,
    amount,
    buyerId,
    buyerName,
    sellerId,
    sellerName,
    status: 'held',
    holdDays,
    createdAt: new Date(now).toISOString(),
    releaseAt: new Date(now + holdDays * 86400000).toISOString()
  };

  escrowStore.set(escrowId, escrow);
  buyerWallet.escrowHeldBalance = computeHeldBalanceForUser(buyerId);

  const tx: ServerWalletTransaction = {
    id: `tx_${now}`,
    type: 'escrow_hold',
    amount,
    currency: 'BDT',
    description: `Escrow Hold Locked — ${orderId}`,
    method: 'PaikarMart Escrow',
    referenceId: escrowId,
    timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
    status: 'completed'
  };
  buyerWallet.transactions.unshift(tx);

  return { escrow, wallet: buyerWallet, transaction: tx };
}

export function releaseEscrowRecord(escrowId: string) {
  let target: ServerEscrowRecord | undefined = escrowStore.get(escrowId);
  if (!target) {
    for (const esc of escrowStore.values()) {
      if (esc.orderId === escrowId || esc.poNumber === escrowId) {
        target = esc;
        break;
      }
    }
  }

  if (!target) {
    throw new Error('ESCROW_NOT_FOUND');
  }
  if (target.status === 'released') {
    return { escrow: target, wallet: getOrCreateWallet(target.buyerId) };
  }
  if (target.status === 'disputed') {
    throw new Error('ESCROW_DISPUTED');
  }

  target.status = 'released';
  target.releasedAt = new Date().toISOString();

  // Credit seller wallet and add release ledger item to buyer/viewer wallet
  const sellerWallet = getOrCreateWallet(target.sellerId);
  sellerWallet.balance += target.amount;
  sellerWallet.updatedAt = new Date().toISOString();
  sellerWallet.transactions.unshift({
    id: `tx_rel_${Date.now()}`,
    type: 'escrow_release',
    amount: target.amount,
    currency: 'BDT',
    description: `Escrow Payout Released — ${target.orderId}`,
    method: 'PaikarMart Escrow',
    referenceId: target.id,
    timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
    status: 'completed'
  });

  const buyerWallet = getOrCreateWallet(target.buyerId);
  buyerWallet.escrowHeldBalance = computeHeldBalanceForUser(target.buyerId);
  buyerWallet.transactions.unshift({
    id: `tx_rel_b_${Date.now()}`,
    type: 'escrow_release',
    amount: target.amount,
    currency: 'BDT',
    description: `Delivery Confirmed · Escrow Released (${target.sellerName})`,
    method: 'PaikarMart Escrow',
    referenceId: target.id,
    timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
    status: 'completed'
  });

  return { escrow: target, wallet: buyerWallet };
}

export function disputeEscrowRecord(escrowId: string, reason: string) {
  let target: ServerEscrowRecord | undefined = escrowStore.get(escrowId);
  if (!target) {
    for (const esc of escrowStore.values()) {
      if (esc.orderId === escrowId || esc.poNumber === escrowId) {
        target = esc;
        break;
      }
    }
  }

  if (!target) {
    throw new Error('ESCROW_NOT_FOUND');
  }
  if (!reason.trim()) {
    throw new Error('DISPUTE_REASON_REQUIRED');
  }

  target.status = 'disputed';
  target.disputeReason = reason.trim();

  const buyerWallet = getOrCreateWallet(target.buyerId);
  buyerWallet.escrowHeldBalance = computeHeldBalanceForUser(target.buyerId);

  return { escrow: target, wallet: buyerWallet };
}

export function getEscrowSummaryForUser(userId = 'user_me') {
  const all = Array.from(escrowStore.values()).filter(
    (e) => e.buyerId === userId || e.sellerId === userId || userId === 'user_me'
  );

  const totalHeld = all
    .filter((e) => e.status === 'held')
    .reduce((sum, e) => sum + e.amount, 0);

  const totalReleased = all
    .filter((e) => e.status === 'released')
    .reduce((sum, e) => sum + e.amount, 0);

  const disputedCount = all.filter((e) => e.status === 'disputed').length;

  const nextRelease = all
    .filter((e) => e.status === 'held')
    .sort((a, b) => new Date(a.releaseAt).getTime() - new Date(b.releaseAt).getTime())[0];

  return {
    summary: {
      totalHeld,
      totalReleased,
      disputedCount,
      nextPayoutAmount: nextRelease ? nextRelease.amount : 0,
      nextPayoutDate: nextRelease ? nextRelease.releaseAt : null
    },
    escrows: all.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())
  };
}

function summarizeEscrows(escrows: ServerEscrowRecord[]) {
  const totalHeld = escrows
    .filter((e) => e.status === 'held')
    .reduce((sum, e) => sum + e.amount, 0);
  const totalReleased = escrows
    .filter((e) => e.status === 'released')
    .reduce((sum, e) => sum + e.amount, 0);
  const disputedCount = escrows.filter((e) => e.status === 'disputed').length;
  const nextRelease = escrows
    .filter((e) => e.status === 'held')
    .sort((a, b) => new Date(a.releaseAt).getTime() - new Date(b.releaseAt).getTime())[0];

  return {
    totalHeld,
    totalReleased,
    disputedCount,
    nextPayoutAmount: nextRelease ? nextRelease.amount : 0,
    nextPayoutDate: nextRelease ? nextRelease.releaseAt : null
  };
}

function mapDbEscrowRow(row: any, viewerProfileUuid: string, viewerAuthUid: string): ServerEscrowRecord {
  const createdMs = row.created_at ? new Date(row.created_at).getTime() : Date.now();
  const releaseAt = new Date(createdMs + 7 * 86400000).toISOString();
  return {
    id: String(row.id),
    orderId: String(row.order_id),
    title: `Escrow Protection · Order ${String(row.order_id).slice(0, 8)}`,
    amount: Number(row.amount_bdt ?? 0),
    buyerId: row.buyer_id === viewerProfileUuid ? viewerAuthUid : String(row.buyer_id),
    buyerName: row.buyer_id === viewerProfileUuid ? 'You' : 'Buyer',
    sellerId: row.vendor_id === viewerProfileUuid ? viewerAuthUid : String(row.vendor_id),
    sellerName: row.vendor_id === viewerProfileUuid ? 'Your Store' : 'Verified Merchant',
    status: (row.status || 'held') as EscrowStatus,
    holdDays: 7,
    createdAt: String(row.created_at || new Date(createdMs).toISOString()),
    releaseAt,
    releasedAt: row.released_at ? String(row.released_at) : undefined
  };
}

export async function getPersistentEscrowSummary(authUid: string): Promise<{
  source: 'supabase' | 'memory';
  summary: ReturnType<typeof summarizeEscrows>;
  escrows: ServerEscrowRecord[];
}> {
  if (supabaseAdmin) {
    const profileUuid = await resolveProfileUuidByAuthUid(authUid);
    if (profileUuid) {
      try {
        const { data, error } = await supabaseAdmin
          .from('escrow_records')
          .select('*')
          .or(`buyer_id.eq.${profileUuid},vendor_id.eq.${profileUuid}`)
          .order('created_at', { ascending: false })
          .limit(50);

        if (!error && Array.isArray(data)) {
          const mapped = data.map((row) => mapDbEscrowRow(row, profileUuid, authUid));
          return {
            source: 'supabase',
            summary: summarizeEscrows(mapped),
            escrows: mapped
          };
        }
      } catch (err: any) {
        console.warn('Supabase escrow summary fallback to memory:', err?.message || err);
      }
    }
  }

  const fallback = getEscrowSummaryForUser(authUid);
  return {
    source: 'memory',
    summary: fallback.summary,
    escrows: fallback.escrows
  };
}

export async function getPersistentWalletOverview(authUid: string): Promise<{
  source: 'supabase' | 'memory';
  wallet: ServerWalletAccount;
  escrowSummary: ReturnType<typeof summarizeEscrows>;
  escrows: ServerEscrowRecord[];
}> {
  if (supabaseAdmin) {
    const profileUuid = await resolveProfileUuidByAuthUid(authUid);
    if (profileUuid) {
      try {
        const [{ data: profile, error: profileErr }, { data: txRows, error: txErr }, escrowData] =
          await Promise.all([
            supabaseAdmin
              .from('profiles')
              .select('wallet_balance, reward_points, updated_at')
              .eq('id', profileUuid)
              .maybeSingle(),
            supabaseAdmin
              .from('wallet_transactions')
              .select('*')
              .eq('user_id', profileUuid)
              .order('created_at', { ascending: false })
              .limit(50),
            getPersistentEscrowSummary(authUid)
          ]);

        if (!profileErr && profile) {
          const transactions: ServerWalletTransaction[] = (!txErr && Array.isArray(txRows) ? txRows : []).map(
            (row: any) => ({
              id: String(row.id),
              type: (row.type || 'deposit') as WalletTxType,
              amount: Number(row.amount ?? 0),
              currency: 'BDT',
              description: String(row.description || ''),
              referenceId: String(row.reference_id || row.id),
              timestamp: row.created_at
                ? new Date(row.created_at).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
                : '',
              status: (row.status || 'completed') as WalletTxStatus
            })
          );

          const wallet: ServerWalletAccount = {
            userId: authUid,
            balance: Number(profile.wallet_balance ?? 0),
            coins: Number(profile.reward_points ?? 0),
            escrowHeldBalance: escrowData.summary.totalHeld,
            transactions,
            updatedAt: String(profile.updated_at || new Date().toISOString())
          };

          return {
            source: 'supabase',
            wallet,
            escrowSummary: escrowData.summary,
            escrows: escrowData.escrows
          };
        }
      } catch (err: any) {
        console.warn('Supabase wallet overview fallback to memory:', err?.message || err);
      }
    }
  }

  const wallet = getOrCreateWallet(authUid);
  const escrowData = getEscrowSummaryForUser(authUid);
  return {
    source: 'memory',
    wallet,
    escrowSummary: escrowData.summary,
    escrows: escrowData.escrows
  };
}

export async function applyVerifiedPaymentWebhook(params: {
  idempotencyKey: string;
  authUid: string;
  amount: number;
  type: 'deposit' | 'withdrawal' | 'cashback';
  method?: string;
  description?: string;
  referenceId?: string;
}) {
  if (!supabaseAdmin || !isPersistentFinanceEnabled()) {
    throw new Error('FINANCE_UNAVAILABLE');
  }

  const amount = Number(params.amount);
  if (!Number.isFinite(amount) || amount <= 0 || amount > 5000000) {
    throw new Error('INVALID_AMOUNT');
  }

  const refKey = String(params.idempotencyKey || params.referenceId || '').trim();
  if (!refKey) {
    throw new Error('IDEMPOTENCY_KEY_REQUIRED');
  }

  const profileUuid = await resolveProfileUuidByAuthUid(params.authUid);
  if (!profileUuid) {
    throw new Error('PROFILE_NOT_FOUND');
  }

  const { data: existingTx } = await supabaseAdmin
    .from('wallet_transactions')
    .select('*')
    .eq('reference_id', refKey)
    .maybeSingle();

  if (existingTx) {
    return { duplicate: true, transaction: existingTx };
  }

  const { data: profile, error: profErr } = await supabaseAdmin
    .from('profiles')
    .select('wallet_balance, reward_points')
    .eq('id', profileUuid)
    .single();

  if (profErr || !profile) {
    throw new Error('PROFILE_NOT_FOUND');
  }

  const currentBalance = Number(profile.wallet_balance ?? 0);
  const currentCoins = Number(profile.reward_points ?? 0);
  const delta = params.type === 'withdrawal' ? -amount : amount;
  const nextBalance = Number((currentBalance + delta).toFixed(2));

  if (nextBalance < 0) {
    throw new Error('INSUFFICIENT_BALANCE');
  }

  const earnedCoins = params.type === 'deposit' ? Math.max(5, Math.floor(amount / 100)) : 0;
  const nextCoins = currentCoins + earnedCoins;

  const { data: updatedProf, error: updateErr } = await supabaseAdmin
    .from('profiles')
    .update({
      wallet_balance: nextBalance,
      reward_points: nextCoins,
      updated_at: new Date().toISOString()
    })
    .eq('id', profileUuid)
    .eq('wallet_balance', currentBalance)
    .select('wallet_balance, reward_points')
    .maybeSingle();

  if (updateErr || !updatedProf) {
    throw new Error('CONCURRENT_LEDGER_CONFLICT');
  }

  const description =
    params.description?.trim() ||
    `${params.method || 'Verified Payment Gateway'} (${params.type})`;

  const { data: txRow, error: txErr } = await supabaseAdmin
    .from('wallet_transactions')
    .insert({
      user_id: profileUuid,
      type: params.type,
      amount,
      description,
      status: 'completed',
      reference_id: refKey
    })
    .select('*')
    .single();

  if (txErr) {
    throw new Error('LEDGER_WRITE_FAILED');
  }

  return {
    duplicate: false,
    balance: Number(updatedProf.wallet_balance),
    coins: Number(updatedProf.reward_points),
    earnedCoins,
    transaction: txRow
  };
}

export async function redeemPersistentWalletCoins(authUid: string, coinsToRedeem: number) {
  if (!supabaseAdmin || !isPersistentFinanceEnabled()) {
    throw new Error('FINANCE_UNAVAILABLE');
  }
  if (!Number.isFinite(coinsToRedeem) || coinsToRedeem < 10) {
    throw new Error('INVALID_COINS');
  }
  const cleanCoins = Math.floor(coinsToRedeem);
  const profileUuid = await resolveProfileUuidByAuthUid(authUid);
  if (!profileUuid) {
    throw new Error('PROFILE_NOT_FOUND');
  }

  const { data: profile, error: profErr } = await supabaseAdmin
    .from('profiles')
    .select('wallet_balance, reward_points')
    .eq('id', profileUuid)
    .single();

  if (profErr || !profile) {
    throw new Error('PROFILE_NOT_FOUND');
  }

  const currentCoins = Number(profile.reward_points ?? 0);
  const currentBalance = Number(profile.wallet_balance ?? 0);
  if (currentCoins < cleanCoins) {
    throw new Error('INSUFFICIENT_COINS');
  }

  const bdtValue = Math.floor(cleanCoins / 5);
  const nextCoins = currentCoins - cleanCoins;
  const nextBalance = Number((currentBalance + bdtValue).toFixed(2));

  const { data: updatedProf, error: updErr } = await supabaseAdmin
    .from('profiles')
    .update({
      wallet_balance: nextBalance,
      reward_points: nextCoins,
      updated_at: new Date().toISOString()
    })
    .eq('id', profileUuid)
    .eq('reward_points', currentCoins)
    .eq('wallet_balance', currentBalance)
    .select('wallet_balance, reward_points')
    .maybeSingle();

  if (updErr || !updatedProf) {
    throw new Error('CONCURRENT_LEDGER_CONFLICT');
  }

  const refId = `PM-REDEEM-${Date.now()}`;
  const { data: txRow } = await supabaseAdmin
    .from('wallet_transactions')
    .insert({
      user_id: profileUuid,
      type: 'cashback',
      amount: bdtValue,
      description: `${cleanCoins} রিওয়ার্ড কয়েন থেকে ৳${bdtValue} কনভার্সন`,
      status: 'completed',
      reference_id: refId
    })
    .select('*')
    .single();

  return {
    bdtValue,
    balance: Number(updatedProf.wallet_balance),
    coins: Number(updatedProf.reward_points),
    transaction: txRow
  };
}

export async function createPersistentEscrowHold(params: {
  orderKey: string;
  buyerAuthUid: string;
  vendorAuthUidOrProfileId: string;
  amount: number;
}) {
  if (!supabaseAdmin) {
    throw new Error('FINANCE_UNAVAILABLE');
  }
  const amount = Number(params.amount);
  if (!Number.isFinite(amount) || amount <= 0) {
    throw new Error('INVALID_ESCROW_PARAMS');
  }

  const buyerUuid = await resolveProfileUuidByAuthUid(params.buyerAuthUid);
  const orderUuid = await resolveOrderUuidByOrderKey(params.orderKey);
  if (!buyerUuid || !orderUuid) {
    throw new Error('ORDER_OR_PROFILE_NOT_FOUND');
  }

  let vendorUuid: string | null = await resolveProfileUuidByAuthUid(params.vendorAuthUidOrProfileId);
  if (!vendorUuid && /^[0-9a-f-]{36}$/i.test(params.vendorAuthUidOrProfileId)) {
    vendorUuid = params.vendorAuthUidOrProfileId;
  }
  if (!vendorUuid) {
    throw new Error('VENDOR_NOT_FOUND');
  }

  const { data: existingEscrow } = await supabaseAdmin
    .from('escrow_records')
    .select('*')
    .eq('order_id', orderUuid)
    .maybeSingle();

  if (existingEscrow) {
    return { escrow: mapDbEscrowRow(existingEscrow, buyerUuid, params.buyerAuthUid), duplicate: true };
  }

  const { data: buyerProf } = await supabaseAdmin
    .from('profiles')
    .select('wallet_balance')
    .eq('id', buyerUuid)
    .single();

  const currentBalance = Number(buyerProf?.wallet_balance ?? 0);
  if (currentBalance < amount) {
    throw new Error('INSUFFICIENT_BALANCE');
  }

  const nextBalance = Number((currentBalance - amount).toFixed(2));
  const { data: updatedBuyer, error: debitErr } = await supabaseAdmin
    .from('profiles')
    .update({ wallet_balance: nextBalance, updated_at: new Date().toISOString() })
    .eq('id', buyerUuid)
    .eq('wallet_balance', currentBalance)
    .select('wallet_balance')
    .maybeSingle();

  if (debitErr || !updatedBuyer) {
    throw new Error('CONCURRENT_LEDGER_CONFLICT');
  }

  const { data: escrowRow, error: escErr } = await supabaseAdmin
    .from('escrow_records')
    .insert({
      order_id: orderUuid,
      buyer_id: buyerUuid,
      vendor_id: vendorUuid,
      amount_bdt: amount,
      status: 'held'
    })
    .select('*')
    .single();

  if (escErr || !escrowRow) {
    throw new Error('ESCROW_CREATE_FAILED');
  }

  await supabaseAdmin.from('wallet_transactions').insert({
    user_id: buyerUuid,
    type: 'escrow_hold',
    amount,
    description: `Escrow Hold Locked — ${params.orderKey}`,
    status: 'completed',
    reference_id: String(escrowRow.id)
  });

  return {
    escrow: mapDbEscrowRow(escrowRow, buyerUuid, params.buyerAuthUid),
    duplicate: false
  };
}

export async function releasePersistentEscrow(params: {
  escrowIdOrOrderKey: string;
  actorAuthUid: string;
  isPrivileged: boolean;
}) {
  if (!supabaseAdmin) {
    throw new Error('FINANCE_UNAVAILABLE');
  }

  const actorUuid = await resolveProfileUuidByAuthUid(params.actorAuthUid);
  if (!actorUuid && !params.isPrivileged) {
    throw new Error('FORBIDDEN');
  }

  let query = supabaseAdmin.from('escrow_records').select('*');
  if (/^[0-9a-f-]{36}$/i.test(params.escrowIdOrOrderKey)) {
    query = query.or(`id.eq.${params.escrowIdOrOrderKey},order_id.eq.${params.escrowIdOrOrderKey}`);
  } else {
    const orderUuid = await resolveOrderUuidByOrderKey(params.escrowIdOrOrderKey);
    if (!orderUuid) throw new Error('ESCROW_NOT_FOUND');
    query = query.eq('order_id', orderUuid);
  }

  const { data: escrowRow } = await query.maybeSingle();
  if (!escrowRow) {
    throw new Error('ESCROW_NOT_FOUND');
  }

  if (!params.isPrivileged && escrowRow.buyer_id !== actorUuid) {
    throw new Error('FORBIDDEN');
  }

  if (escrowRow.status === 'disputed') {
    throw new Error('ESCROW_DISPUTED');
  }
  if (escrowRow.status === 'released') {
    return {
      escrow: mapDbEscrowRow(escrowRow, actorUuid || escrowRow.buyer_id, params.actorAuthUid),
      alreadyReleased: true
    };
  }

  const releasedAt = new Date().toISOString();
  const { data: updatedEscrow, error: updEscErr } = await supabaseAdmin
    .from('escrow_records')
    .update({ status: 'released', released_at: releasedAt })
    .eq('id', escrowRow.id)
    .eq('status', 'held')
    .select('*')
    .maybeSingle();

  if (updEscErr || !updatedEscrow) {
    throw new Error('CONCURRENT_LEDGER_CONFLICT');
  }

  const payoutAmount = Number(escrowRow.amount_bdt ?? 0);
  const { data: vendorProf } = await supabaseAdmin
    .from('profiles')
    .select('wallet_balance')
    .eq('id', escrowRow.vendor_id)
    .single();

  if (vendorProf) {
    const currentVendorBal = Number(vendorProf.wallet_balance ?? 0);
    await supabaseAdmin
      .from('profiles')
      .update({
        wallet_balance: Number((currentVendorBal + payoutAmount).toFixed(2)),
        updated_at: releasedAt
      })
      .eq('id', escrowRow.vendor_id);
  }

  await supabaseAdmin.from('wallet_transactions').insert({
    user_id: escrowRow.vendor_id,
    type: 'escrow_release',
    amount: payoutAmount,
    description: `Escrow Payout Released — Order ${String(escrowRow.order_id).slice(0, 8)}`,
    status: 'completed',
    reference_id: String(escrowRow.id)
  });

  return {
    escrow: mapDbEscrowRow(updatedEscrow, actorUuid || escrowRow.buyer_id, params.actorAuthUid),
    alreadyReleased: false
  };
}

export async function disputePersistentEscrow(params: {
  escrowIdOrOrderKey: string;
  actorAuthUid: string;
  isPrivileged: boolean;
  reason: string;
}) {
  if (!supabaseAdmin) {
    throw new Error('FINANCE_UNAVAILABLE');
  }
  if (!params.reason.trim()) {
    throw new Error('DISPUTE_REASON_REQUIRED');
  }

  const actorUuid = await resolveProfileUuidByAuthUid(params.actorAuthUid);
  if (!actorUuid && !params.isPrivileged) {
    throw new Error('FORBIDDEN');
  }

  let query = supabaseAdmin.from('escrow_records').select('*');
  if (/^[0-9a-f-]{36}$/i.test(params.escrowIdOrOrderKey)) {
    query = query.or(`id.eq.${params.escrowIdOrOrderKey},order_id.eq.${params.escrowIdOrOrderKey}`);
  } else {
    const orderUuid = await resolveOrderUuidByOrderKey(params.escrowIdOrOrderKey);
    if (!orderUuid) throw new Error('ESCROW_NOT_FOUND');
    query = query.eq('order_id', orderUuid);
  }

  const { data: escrowRow } = await query.maybeSingle();
  if (!escrowRow) {
    throw new Error('ESCROW_NOT_FOUND');
  }

  const isParty = actorUuid && (escrowRow.buyer_id === actorUuid || escrowRow.vendor_id === actorUuid);
  if (!params.isPrivileged && !isParty) {
    throw new Error('FORBIDDEN');
  }

  const { data: updated, error } = await supabaseAdmin
    .from('escrow_records')
    .update({ status: 'disputed' })
    .eq('id', escrowRow.id)
    .select('*')
    .single();

  if (error || !updated) {
    throw new Error('ESCROW_UPDATE_FAILED');
  }

  return {
    escrow: {
      ...mapDbEscrowRow(updated, actorUuid || updated.buyer_id, params.actorAuthUid),
      disputeReason: params.reason.trim()
    }
  };
}

