import { TransactionType, TransactionStatus, WalletTransaction } from './useWalletStore';

export type { TransactionType, TransactionStatus, WalletTransaction };

export interface WalletState {
  balance: number;
  coins: number;
  transactions: WalletTransaction[];
  isLoading: boolean;
  error: string | null;
}

export interface WalletActions {
  updateBalance: (amount: number, type: TransactionType) => void;
  updateCoins: (amount: number, type: TransactionType) => void;
  addTransaction: (transaction: Omit<WalletTransaction, 'id' | 'time'>) => void;
  fetchWalletData: () => Promise<void>;
  processPayment: (amount: number, label: string) => Promise<boolean>;
  redeemCoins: (coins: number) => Promise<number>; // returns currency value
}
