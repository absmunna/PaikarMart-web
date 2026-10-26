import { create } from 'zustand';
import { persist } from 'zustand/middleware';

export interface Transaction {
  id: string;
  type: 'topup' | 'send' | 'receive' | 'cashback';
  amount: number;
  currency: 'BDT' | 'COIN';
  description: string;
  date: string;
  status: 'Completed' | 'Pending';
}

interface WalletState {
  bdtBalance: number;
  coinBalance: number;
  transactions: Transaction[];
  topUp: (amount: number) => void;
  sendMoney: (amount: number, receiver: string) => boolean;
  addCoins: (amount: number) => void;
  deductCoins: (amount: number) => boolean;
  addTransaction: (tx: Omit<Transaction, 'id' | 'date'>) => void;
}

export const useWalletStore = create<WalletState>()(
  persist(
    (set, get) => ({
      bdtBalance: 45280, // Premium default matching top sidebar
      coinBalance: 1250, // PK Coins default
      transactions: [
        { id: 'tx-01', type: 'cashback', amount: 250, currency: 'COIN', description: 'PK Watch Order Cashback', date: 'May 16, 2026', status: 'Completed' },
        { id: 'tx-02', type: 'topup', amount: 5000, currency: 'BDT', description: 'Card Top Up', date: 'May 15, 2026', status: 'Completed' },
        { id: 'tx-03', type: 'send', amount: 1200, currency: 'BDT', description: 'Sent to Rahim Electronics', date: 'May 14, 2026', status: 'Completed' }
      ],
      topUp: (amount) => set((state) => {
        const newBdt = state.bdtBalance + amount;
        const newTx: Transaction = {
          id: `tx-${Math.random().toString(36).substr(2, 9)}`,
          type: 'topup',
          amount,
          currency: 'BDT',
          description: 'Wallet Top Up',
          date: new Date().toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' }),
          status: 'Completed'
        };
        return {
          bdtBalance: newBdt,
          transactions: [newTx, ...state.transactions]
        };
      }),
      sendMoney: (amount, receiver) => {
        const current = get().bdtBalance;
        if (current < amount) return false;
        
        set((state) => {
          const newBdt = state.bdtBalance - amount;
          const newTx: Transaction = {
            id: `tx-${Math.random().toString(36).substr(2, 9)}`,
            type: 'send',
            amount,
            currency: 'BDT',
            description: `Sent to ${receiver}`,
            date: new Date().toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' }),
            status: 'Completed'
          };
          return {
            bdtBalance: newBdt,
            transactions: [newTx, ...state.transactions]
          };
        });
        return true;
      },
      addCoins: (amount) => set((state) => {
        const newCoins = state.coinBalance + amount;
        const newTx: Transaction = {
          id: `tx-${Math.random().toString(36).substr(2, 9)}`,
          type: 'cashback',
          amount,
          currency: 'COIN',
          description: 'PK Coin Cashback Reward',
          date: new Date().toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' }),
          status: 'Completed'
        };
        return {
          coinBalance: newCoins,
          transactions: [newTx, ...state.transactions]
        };
      }),
      deductCoins: (amount) => {
        const current = get().coinBalance;
        if (current < amount) return false;
        set((state) => ({ coinBalance: state.coinBalance - amount }));
        return true;
      },
      addTransaction: (tx) => set((state) => ({
        transactions: [
          {
            ...tx,
            id: `tx-${Math.random().toString(36).substr(2, 9)}`,
            date: new Date().toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })
          },
          ...state.transactions
        ]
      }))
    }),
    {
      name: 'pm-wallet-storage',
    }
  )
);
