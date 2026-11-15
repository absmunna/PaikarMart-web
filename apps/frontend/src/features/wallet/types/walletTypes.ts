export type TransactionType =
  | 'credit'
  | 'debit'
  | 'topup'
  | 'send'
  | 'receive'
  | 'cashback'
  | 'deposit'
  | 'withdrawal'
  | 'transfer'
  | 'purchase'
  | 'escrow_hold'
  | 'escrow_release';

export type TransactionStatus = 'success' | 'pending' | 'failed' | 'completed' | 'Completed' | 'Pending';
export type EscrowStatus = 'held' | 'released' | 'disputed' | 'refunded';

export interface WalletTransaction {
  id: string;
  type: TransactionType;
  amount: number;
  label: string;
  sublabel: string;
  time: string;
  status: TransactionStatus;
  currency?: 'BDT' | 'COIN';
  description?: string;
  method?: string;
  referenceId?: string;
  date?: string;
  timestamp?: string;
  metadata?: Record<string, any>;
}

export interface EscrowRecord {
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

export interface EscrowSummary {
  totalHeld: number;
  totalReleased: number;
  disputedCount: number;
  nextPayoutAmount: number;
  nextPayoutDate: string | null;
}

export interface WalletServerPayload {
  userId: string;
  balance: number;
  coins: number;
  escrowHeldBalance: number;
  transactions: Array<{
    id: string;
    type: TransactionType;
    amount: number;
    currency: 'BDT' | 'COIN';
    description: string;
    method?: string;
    referenceId: string;
    timestamp: string;
    status: TransactionStatus;
  }>;
  updatedAt: string;
}
