export type EscrowStatus = 'held' | 'pending_release' | 'released' | 'disputed' | 'refunded';

export interface EscrowTransaction {
  id: string;
  orderId: string;
  amount: number;
  status: EscrowStatus;
  releaseDate: string; // ISO string
  createdAt: string; // ISO string
  description: string;
}

export interface EscrowSummary {
  totalHeld: number;
  totalReleased: number;
  pendingWithdrawal: number;
  nextPayoutAmount: number;
  nextPayoutDate: string | null;
}
