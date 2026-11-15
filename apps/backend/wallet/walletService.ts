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
