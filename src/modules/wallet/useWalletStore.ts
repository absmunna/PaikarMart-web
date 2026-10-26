import { create } from 'zustand';
import { persist } from 'zustand/middleware';

export type TransactionType = 'credit' | 'debit' | 'topup' | 'send' | 'receive' | 'cashback';
export type TransactionStatus = 'success' | 'pending' | 'failed' | 'Completed' | 'Pending';

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
  date?: string;
  metadata?: Record<string, any>;
}

interface WalletStoreState {
  // Coexisting balances under single-source sync
  balance: number;      // BDT
  fiatBalance: number;  // BDT (Legacy sync)
  coins: number;        // PK Coin
  pkCoinBalance: number; // PK Coin (Legacy sync)
  transactions: WalletTransaction[];
  isLoading: boolean;
  error: string | null;

  // Actions
  updateBalance: (amount: number, type: 'credit' | 'debit') => void;
  updateCoins: (amount: number, type: 'credit' | 'debit') => void;
  updateWallet: (fiat: number, coins: number) => void;
  addTransaction: (tx: any) => void;
  
  // High-level wallet functions
  topUp: (amount: number) => void;
  sendMoney: (amount: number, receiver: string) => boolean;
  addCoins: (amount: number) => void;
  
  fetchWalletData: () => Promise<void>;
  processPayment: (amount: number, label: string) => Promise<boolean>;
  redeemCoins: (coins: number) => Promise<number>;
  depositCash: (amount: number, reference: string) => Promise<void>;
}

export const useWalletStore = create<WalletStoreState>()(
  persist(
    (set, get) => ({
      balance: 45280,
      fiatBalance: 45280,
      coins: 1250,
      pkCoinBalance: 1250,
      transactions: [
        { id: 't1', type: 'credit', amount: 250, label: 'পিকে শপ ক্যাশব্যাক', sublabel: 'পিকে শপ ক্যাশব্যাক', time: 'May 23, 2026', status: 'success', currency: 'COIN', description: 'পিকে শপ ক্যাশব্যাক', date: 'May 23, 2026' },
        { id: 't2', type: 'credit', amount: 5000, label: 'বিকাশ টপ আপ', sublabel: 'বিকাশ টপ আপ', time: 'May 22, 2026', status: 'success', currency: 'BDT', description: 'বিকাশ টপ আপ', date: 'May 22, 2026' },
        { id: 't3', type: 'debit', amount: 1200, label: 'রহিম ইলেকট্রনিক্স পেমেন্ট', sublabel: 'রহিম ইলেকট্রনিক্স পেমেন্ট', time: 'May 20, 2026', status: 'success', currency: 'BDT', description: 'রহিম ইলেকট্রনিক্স পেমেন্ট', date: 'May 20, 2026' }
      ],
      isLoading: false,
      error: null,

      updateWallet: (fiat, coins) => set({
        balance: fiat,
        fiatBalance: fiat,
        coins: coins,
        pkCoinBalance: coins
      }),

      updateBalance: (amount, type) => set((state) => {
        const nextBalance = type === 'credit' ? state.balance + amount : state.balance - amount;
        return {
          balance: nextBalance,
          fiatBalance: nextBalance
        };
      }),

      updateCoins: (amount, type) => set((state) => {
        const nextCoins = type === 'credit' ? state.coins + amount : state.coins - amount;
        return {
          coins: nextCoins,
          pkCoinBalance: nextCoins
        };
      }),

      addTransaction: (tx) => set((state) => {
        const id = `tx-${Math.random().toString(36).substr(2, 9)}`;
        const dateStr = new Date().toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });
        const timeStr = new Date().toLocaleString('en-US', { hour: 'numeric', minute: 'numeric', hour12: true, day: '2-digit', month: 'short' });

        const newTx: WalletTransaction = {
          id,
          type: tx.type || 'credit',
          amount: tx.amount,
          label: tx.label || tx.description || 'Transaction',
          sublabel: tx.sublabel || tx.description || 'Processed via Wallet',
          time: tx.time || timeStr,
          status: tx.status || 'success',
          currency: tx.currency || (tx.type === 'cashback' ? 'COIN' : 'BDT'),
          description: tx.description || tx.label || 'Transaction',
          date: tx.date || dateStr,
          metadata: tx.metadata
        };

        return {
          transactions: [newTx, ...state.transactions]
        };
      }),

      topUp: (amount) => {
        const dateStr = new Date().toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });
        const timeStr = new Date().toLocaleString('en-US', { hour: 'numeric', minute: 'numeric', hour12: true, day: '2-digit', month: 'short' });
        
        set((state) => {
          const nextBalance = state.balance + amount;
          const newTx: WalletTransaction = {
            id: `tx-${Math.random().toString(36).substr(2, 9)}`,
            type: 'credit',
            amount,
            label: 'ওয়ালেট টপ আপ (MFS)',
            sublabel: 'ওয়ালেট টপ আপ (MFS)',
            time: timeStr,
            status: 'success',
            currency: 'BDT',
            description: 'ওয়ালেট টপ আপ (MFS)',
            date: dateStr
          };
          return {
            balance: nextBalance,
            fiatBalance: nextBalance,
            transactions: [newTx, ...state.transactions]
          };
        });
      },

      sendMoney: (amount, receiver) => {
        const currentBalance = get().balance;
        if (currentBalance < amount) return false;

        const dateStr = new Date().toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });
        const timeStr = new Date().toLocaleString('en-US', { hour: 'numeric', minute: 'numeric', hour12: true, day: '2-digit', month: 'short' });

        set((state) => {
          const nextBalance = state.balance - amount;
          const newTx: WalletTransaction = {
            id: `tx-${Math.random().toString(36).substr(2, 9)}`,
            type: 'debit',
            amount,
            label: `${receiver} কে পাঠানো হয়েছে`,
            sublabel: `${receiver} কে পাঠানো হয়েছে`,
            time: timeStr,
            status: 'success',
            currency: 'BDT',
            description: `${receiver} কে পাঠানো হয়েছে`,
            date: dateStr
          };
          return {
            balance: nextBalance,
            fiatBalance: nextBalance,
            transactions: [newTx, ...state.transactions]
          };
        });
        return true;
      },

      addCoins: (amount) => {
        const dateStr = new Date().toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });
        const timeStr = new Date().toLocaleString('en-US', { hour: 'numeric', minute: 'numeric', hour12: true, day: '2-digit', month: 'short' });

        set((state) => {
          const nextCoins = state.coins + amount;
          const newTx: WalletTransaction = {
            id: `tx-${Math.random().toString(36).substr(2, 9)}`,
            type: 'credit',
            amount,
            label: 'রিওয়ার্ড পয়েন্ট বোনাস',
            sublabel: 'রিওয়ার্ড পয়েন্ট বোনাস',
            time: timeStr,
            status: 'success',
            currency: 'COIN',
            description: 'রিওয়ার্ড পয়েন্ট বোনাস',
            date: dateStr
          };
          return {
            coins: nextCoins,
            pkCoinBalance: nextCoins,
            transactions: [newTx, ...state.transactions]
          };
        });
      },

      fetchWalletData: async () => {
        set({ isLoading: true });
        try {
          await new Promise(resolve => setTimeout(resolve, 500));
          set({ isLoading: false });
        } catch (error) {
          set({ error: 'Failed to fetch wallet data', isLoading: false });
        }
      },

      processPayment: async (amount, label) => {
        const { balance, updateBalance, addTransaction } = get();
        if (balance < amount) return false;

        await new Promise(resolve => setTimeout(resolve, 300));
        
        updateBalance(amount, 'debit');
        addTransaction({
          type: 'debit',
          amount,
          label,
          sublabel: 'Payment via Wallet',
          status: 'success'
        });
        
        return true;
      },

      redeemCoins: async (coinsToRedeem) => {
        const { coins, updateCoins, addTransaction } = get();
        if (coins < coinsToRedeem) return 0;

        const currencyValue = Math.floor(coinsToRedeem / 10);
        
        updateCoins(coinsToRedeem, 'debit');
        addTransaction({
          type: 'credit',
          amount: currencyValue,
          label: 'Coin Redemption',
          sublabel: `${coinsToRedeem} coins converted`,
          status: 'success'
        });

        set((state) => {
          const nextBalance = state.balance + currencyValue;
          return {
            balance: nextBalance,
            fiatBalance: nextBalance
          };
        });
        
        return currencyValue;
      },

      depositCash: async (amount, reference) => {
        const { addTransaction } = get();
        // Simulate API call to bank/MFS for deposit
        await new Promise(resolve => setTimeout(resolve, 1000));

        addTransaction({
          type: 'credit',
          amount,
          label: `ক্যাশ ডিপোজিট (Collected)`,
          sublabel: `Ref: ${reference}`,
          status: 'success',
          metadata: { isCashDeposit: true, reference }
        });

        set((state) => {
          const nextBalance = state.balance + amount;
          return {
            balance: nextBalance,
            fiatBalance: nextBalance
          };
        });
      }
    }),
    {
      name: 'pm-wallet-storage-unified',
    }
  )
);
