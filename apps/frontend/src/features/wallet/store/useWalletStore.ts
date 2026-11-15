import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import {
  EscrowRecord,
  EscrowSummary,
  TransactionStatus,
  TransactionType,
  WalletServerPayload,
  WalletTransaction
} from '@/features/wallet/types/walletTypes';
import {
  createEscrowHoldApi,
  depositWalletApi,
  disputeEscrowApi,
  fetchEscrowSummaryApi,
  fetchWalletStateApi,
  redeemCoinsApi,
  releaseEscrowApi,
  transferWalletApi,
  withdrawWalletApi
} from '@/features/wallet/services/walletEscrowApiClient';

export type { WalletTransaction, TransactionType, TransactionStatus };

function mapServerTransactions(serverWallet: WalletServerPayload): WalletTransaction[] {
  return (serverWallet.transactions || []).map((tx) => ({
    id: tx.id,
    type: tx.type,
    amount: tx.amount,
    label: tx.description,
    sublabel: tx.method || 'PaikarMart Pay',
    time: tx.timestamp,
    timestamp: tx.timestamp,
    status: tx.status,
    currency: tx.currency,
    description: tx.description,
    method: tx.method,
    referenceId: tx.referenceId,
    date: tx.timestamp
  }));
}

function calculateSummary(escrows: EscrowRecord[]): EscrowSummary {
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

const INITIAL_ESCROWS: EscrowRecord[] = [];

interface WalletStoreState {
  balance: number;
  fiatBalance: number;
  coins: number;
  transactions: WalletTransaction[];
  escrows: EscrowRecord[];
  escrowSummary: EscrowSummary;
  isLoading: boolean;
  error: string | null;

  updateBalance: (amount: number, type: 'credit' | 'debit') => void;
  updateCoins: (amount: number, type: 'credit' | 'debit') => void;
  addTransaction: (tx: any) => void;
  topUp: (amount: number) => void;
  sendMoney: (amount: number, receiver: string) => boolean;
  addCoins: (amount: number) => void;
  fetchWalletData: (userId?: string) => Promise<void>;
  processPayment: (amount: number, label: string) => Promise<boolean>;
  redeemCoins: (coins: number, userId?: string) => Promise<number>;
  depositCash: (amount: number, reference: string) => Promise<void>;

  // Server-backed Wallet & Escrow operations
  depositFunds: (params: { userId?: string; amount: number; method: string }) => Promise<void>;
  withdrawFunds: (params: {
    userId?: string;
    amount: number;
    method: string;
    accountDetails?: string;
  }) => Promise<void>;
  transferFunds: (params: {
    userId?: string;
    amount: number;
    recipient: string;
    note?: string;
  }) => Promise<void>;
  createEscrowHold: (params: {
    orderId: string;
    poNumber?: string;
    title: string;
    amount: number;
    buyerId?: string;
    buyerName?: string;
    sellerId?: string;
    sellerName?: string;
  }) => Promise<EscrowRecord>;
  releaseEscrow: (escrowId: string) => Promise<void>;
  disputeEscrow: (escrowId: string, reason: string) => Promise<void>;
}

export const useWalletStore = create<WalletStoreState>()(
  persist(
    (set, get) => ({
      balance: 0,
      fiatBalance: 0,
      coins: 0,
      transactions: [],
      escrows: INITIAL_ESCROWS,
      escrowSummary: calculateSummary(INITIAL_ESCROWS),
      isLoading: false,
      error: null,

      updateBalance: (amount, type) =>
        set((state) => {
          const nextBalance =
            type === 'credit' ? state.balance + amount : Math.max(0, state.balance - amount);
          return { balance: nextBalance, fiatBalance: nextBalance };
        }),

      updateCoins: (amount, type) =>
        set((state) => {
          const nextCoins =
            type === 'credit' ? state.coins + amount : Math.max(0, state.coins - amount);
          return { coins: nextCoins };
        }),

      addTransaction: (tx) =>
        set((state) => {
          const id = `tx-${Math.random().toString(36).slice(2, 9)}`;
          const timeStr = new Date().toLocaleString('en-US', {
            hour: 'numeric',
            minute: 'numeric',
            hour12: true,
            day: '2-digit',
            month: 'short'
          });
          const newTx: WalletTransaction = {
            id,
            type: tx.type || 'credit',
            amount: tx.amount,
            label: tx.label || tx.description || 'Transaction',
            sublabel: tx.sublabel || tx.description || 'Processed via Wallet',
            time: tx.time || timeStr,
            timestamp: tx.timestamp || timeStr,
            status: tx.status || 'completed',
            currency: tx.currency || (tx.type === 'cashback' ? 'COIN' : 'BDT'),
            description: tx.description || tx.label || 'Transaction',
            referenceId: tx.referenceId || `PM-${Math.floor(100000 + Math.random() * 900000)}`,
            date: tx.date || timeStr,
            metadata: tx.metadata
          };
          return { transactions: [newTx, ...state.transactions] };
        }),

      topUp: (amount) => {
        void get().depositFunds({ amount, method: 'bKash Mobile Banking' });
      },

      sendMoney: (amount, receiver) => {
        if (get().balance < amount) return false;
        void get().transferFunds({ amount, recipient: receiver });
        return true;
      },

      addCoins: (amount) => {
        set((state) => ({ coins: state.coins + amount }));
        get().addTransaction({
          type: 'cashback',
          amount,
          currency: 'COIN',
          label: 'রিওয়ার্ড কয়েন বোনাস',
          sublabel: 'Loyalty Bonus'
        });
      },

      fetchWalletData: async (userId = 'user_me') => {
        set({ isLoading: true, error: null });
        try {
          const data = await fetchWalletStateApi(userId);
          set({
            balance: data.wallet.balance,
            fiatBalance: data.wallet.balance,
            coins: data.wallet.coins,
            transactions: mapServerTransactions(data.wallet),
            escrows: data.escrows,
            escrowSummary: data.escrowSummary,
            isLoading: false
          });
        } catch {
          try {
            const escData = await fetchEscrowSummaryApi(userId);
            set({
              balance: 0,
              fiatBalance: 0,
              coins: 0,
              transactions: [],
              escrows: escData.escrows,
              escrowSummary: escData.summary,
              isLoading: false
            });
          } catch {
            set({
              balance: 0,
              fiatBalance: 0,
              coins: 0,
              transactions: [],
              escrows: [],
              escrowSummary: calculateSummary([]),
              isLoading: false,
              error: 'Wallet service is unavailable.'
            });
          }
        }
      },

      processPayment: async (amount, label) => {
        void amount;
        void label;
        set({ error: 'Payments are unavailable until the verified payment service is configured.' });
        return false;
      },

      redeemCoins: async (coinsToRedeem, userId = 'user_me') => {
        if (get().coins < coinsToRedeem) return 0;
        try {
          const res = await redeemCoinsApi({ userId, coinsToRedeem });
          set({
            balance: res.wallet.balance,
            fiatBalance: res.wallet.balance,
            coins: res.wallet.coins,
            transactions: mapServerTransactions(res.wallet)
          });
          return res.bdtValue;
        } catch {
          set({ error: 'Coin redemption is unavailable until the wallet ledger is configured.' });
          return 0;
        }
      },

      depositCash: async (amount, reference) => {
        await get().depositFunds({ amount, method: `Cash Deposit (${reference})` });
      },

      depositFunds: async ({ userId = 'user_me', amount, method }) => {
        set({ isLoading: true, error: null });
        try {
          const res = await depositWalletApi({
            userId,
            amount,
            method,
            idempotencyKey: `dep_${Date.now()}_${amount}`
          });
          set({
            balance: res.wallet.balance,
            fiatBalance: res.wallet.balance,
            coins: res.wallet.coins,
            transactions: mapServerTransactions(res.wallet),
            isLoading: false
          });
        } catch (err: any) {
          set({ isLoading: false, error: err?.message || null });
        }
      },

      withdrawFunds: async ({ userId = 'user_me', amount, method, accountDetails }) => {
        if (get().balance < amount) {
          throw new Error('ওয়ালেটে পর্যাপ্ত ব্যালেন্স নেই।');
        }
        set({ isLoading: true, error: null });
        try {
          const res = await withdrawWalletApi({
            userId,
            amount,
            method,
            accountDetails,
            idempotencyKey: `wth_${Date.now()}_${amount}`
          });
          set({
            balance: res.wallet.balance,
            fiatBalance: res.wallet.balance,
            transactions: mapServerTransactions(res.wallet),
            isLoading: false
          });
        } catch (err: any) {
          set({ isLoading: false, error: err?.message || 'Withdrawal failed' });
          throw err;
        }
      },

      transferFunds: async ({ userId = 'user_me', amount, recipient, note }) => {
        if (get().balance < amount) {
          throw new Error('ওয়ালেটে পর্যাপ্ত ব্যালেন্স নেই।');
        }
        set({ isLoading: true, error: null });
        try {
          const res = await transferWalletApi({
            userId,
            amount,
            recipient,
            note,
            idempotencyKey: `trf_${Date.now()}_${amount}`
          });
          set({
            balance: res.wallet.balance,
            fiatBalance: res.wallet.balance,
            transactions: mapServerTransactions(res.wallet),
            isLoading: false
          });
        } catch (err: any) {
          set({ isLoading: false, error: err?.message || 'Transfer failed' });
          throw err;
        }
      },

      createEscrowHold: async (params) => {
        set({ isLoading: true, error: null });
        try {
          const res = await createEscrowHoldApi(params);
          set((state) => {
            const nextEscrows = [
              res.escrow,
              ...state.escrows.filter((e) => e.id !== res.escrow.id)
            ];
            return {
              balance: res.wallet.balance,
              fiatBalance: res.wallet.balance,
              transactions: mapServerTransactions(res.wallet),
              escrows: nextEscrows,
              escrowSummary: calculateSummary(nextEscrows),
              isLoading: false
            };
          });
          return res.escrow;
        } catch (err: any) {
          set({ isLoading: false, error: err?.message || 'Escrow hold failed' });
          throw err;
        }
      },

      releaseEscrow: async (escrowId) => {
        set({ isLoading: true, error: null });
        try {
          const res = await releaseEscrowApi(escrowId);
          set((state) => {
            const nextEscrows = state.escrows.map((e) =>
              e.id === res.escrow.id ? res.escrow : e
            );
            return {
              balance: res.wallet.balance,
              fiatBalance: res.wallet.balance,
              transactions: mapServerTransactions(res.wallet),
              escrows: nextEscrows,
              escrowSummary: calculateSummary(nextEscrows),
              isLoading: false
            };
          });
        } catch (err: any) {
          set({ isLoading: false, error: err?.message || 'Escrow release failed' });
          throw err;
        }
      },

      disputeEscrow: async (escrowId, reason) => {
        set({ isLoading: true, error: null });
        try {
          const res = await disputeEscrowApi(escrowId, reason);
          set((state) => {
            const nextEscrows = state.escrows.map((e) =>
              e.id === res.escrow.id ? res.escrow : e
            );
            return {
              escrows: nextEscrows,
              escrowSummary: calculateSummary(nextEscrows),
              isLoading: false
            };
          });
        } catch (err: any) {
          set({ isLoading: false, error: err?.message || 'Dispute submission failed' });
          throw err;
        }
      }
    }),
    {
      name: 'paikarmart-wallet-storage',
      version: 2,
      migrate: () => ({
        balance: 0,
        fiatBalance: 0,
        coins: 0,
        transactions: [],
        escrows: [],
        escrowSummary: calculateSummary([]),
      }),
    }
  )
);
