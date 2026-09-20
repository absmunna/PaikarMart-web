import { 
  collection, 
  addDoc, 
  doc, 
  getDoc, 
  getDocs, 
  query, 
  where, 
  orderBy, 
  limit,
  serverTimestamp, 
  Timestamp,
  updateDoc
} from "firebase/firestore";
import { db, handleFirestoreError, OperationType } from "../lib/firebase";

export interface OrderItem {
  productId: string;
  productTitle: string;
  price: number;
  quantity: number;
  total: number;
  image?: string;
}

export interface Order {
  id?: string;
  buyerId: string;
  buyerName: string;
  sellerId: string;
  sellerName: string;
  totalAmount: number;
  status: 'pending' | 'confirmed' | 'processing' | 'shipped' | 'delivered' | 'cancelled';
  paymentStatus: 'unpaid' | 'paid' | 'refunded';
  paymentMethod: string;
  shippingAddress: string;
  items: OrderItem[];
  createdAt: any;
  updatedAt: any;
}

export const orderService = {
  async placeOrder(orderData: Omit<Order, 'id' | 'createdAt' | 'updatedAt'>) {
    const path = "orders";
    try {
      const docRef = await addDoc(collection(db, path), {
        ...orderData,
        createdAt: serverTimestamp(),
        updatedAt: serverTimestamp(),
      });
      return docRef.id;
    } catch (error) {
      handleFirestoreError(error, OperationType.CREATE, path);
    }
  },

  async getUserOrders(userId: string) {
    const path = "orders";
    try {
      const q = query(
        collection(db, path),
        where("buyerId", "==", userId),
        orderBy("createdAt", "desc")
      );
      const querySnapshot = await getDocs(q);
      return querySnapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data(),
        createdAt: (doc.data().createdAt as Timestamp)?.toDate().toISOString(),
        updatedAt: (doc.data().updatedAt as Timestamp)?.toDate().toISOString(),
      })) as Order[];
    } catch (error) {
      handleFirestoreError(error, OperationType.LIST, path);
      return [];
    }
  },

  async getAllOrders(maxResults: number = 50) {
    const path = "orders";
    try {
      const q = query(
        collection(db, path),
        orderBy("createdAt", "desc"),
        limit(maxResults)
      );
      const querySnapshot = await getDocs(q);
      return querySnapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data(),
        createdAt: (doc.data().createdAt as Timestamp)?.toDate().toISOString(),
        updatedAt: (doc.data().updatedAt as Timestamp)?.toDate().toISOString(),
      })) as Order[];
    } catch (error) {
      handleFirestoreError(error, OperationType.LIST, path);
      return [];
    }
  },

  async getOrderById(orderId: string) {
    const path = `orders/${orderId}`;
    try {
      const docRef = doc(db, "orders", orderId);
      const docSnap = await getDoc(docRef);
      if (docSnap.exists()) {
        const data = docSnap.data();
        return {
          id: docSnap.id,
          ...data,
          createdAt: (data.createdAt as Timestamp)?.toDate().toISOString(),
          updatedAt: (data.updatedAt as Timestamp)?.toDate().toISOString(),
        } as Order;
      }
      return null;
    } catch (error) {
      handleFirestoreError(error, OperationType.GET, path);
      return null;
    }
  },

  async updateOrderStatus(orderId: string, status: Order['status']) {
    const path = `orders/${orderId}`;
    try {
      const docRef = doc(db, "orders", orderId);
      await updateDoc(docRef, {
        status,
        updatedAt: serverTimestamp()
      });
    } catch (error) {
      handleFirestoreError(error, OperationType.UPDATE, path);
    }
  }
};
