import { 
  doc, 
  getDoc, 
  collection, 
  query, 
  where, 
  orderBy, 
  limit, 
  getDocs,
  onSnapshot,
  Timestamp
} from "firebase/firestore";
import { db, handleFirestoreError, OperationType } from "../lib/firebase";

export interface Transaction {
  id: string;
  userId: string;
  type: 'deposit' | 'payment' | 'refund' | 'withdrawal';
  amount: number;
  title: string;
  status: 'completed' | 'pending' | 'failed';
  createdAt: Timestamp;
}

export interface Wallet {
  userId: string;
  balance: number;
  updatedAt: Timestamp;
}

export const walletService = {
  /**
   * Get current wallet balance
   */
  async getBalance(userId: string): Promise<number> {
    try {
      const docRef = doc(db, "wallets", userId);
      const docSnap = await getDoc(docRef);
      if (docSnap.exists()) {
        return docSnap.data().balance || 0;
      }
      return 0;
    } catch (error) {
      handleFirestoreError(error, OperationType.GET, `wallets/${userId}`);
      return 0;
    }
  },

  /**
   * Real-time wallet updates
   */
  subscribeToWallet(userId: string, callback: (wallet: Wallet | null) => void) {
    const docRef = doc(db, "wallets", userId);
    return onSnapshot(docRef, (docSnap) => {
      if (docSnap.exists()) {
        callback({
          userId: docSnap.id,
          ...docSnap.data()
        } as Wallet);
      } else {
        callback(null);
      }
    }, (error) => handleFirestoreError(error, OperationType.GET, `wallets/${userId}`));
  },

  /**
   * Get transaction history
   */
  async getTransactions(userId: string, maxResults: number = 20): Promise<Transaction[]> {
    try {
      const q = query(
        collection(db, `wallets/${userId}/transactions`),
        orderBy("createdAt", "desc"),
        limit(maxResults)
      );
      const querySnapshot = await getDocs(q);
      return querySnapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      })) as Transaction[];
    } catch (error) {
      handleFirestoreError(error, OperationType.LIST, `wallets/${userId}/transactions`);
      return [];
    }
  },

  /**
   * Real-time transactions
   */
  subscribeToTransactions(userId: string, callback: (txs: Transaction[]) => void) {
    const q = query(
      collection(db, `wallets/${userId}/transactions`),
      orderBy("createdAt", "desc"),
      limit(20)
    );
    return onSnapshot(q, (snapshot) => {
      const txs = snapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      })) as Transaction[];
      callback(txs);
    }, (error) => handleFirestoreError(error, OperationType.LIST, `wallets/${userId}/transactions`));
  }
};
