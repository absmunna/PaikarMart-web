import { 
  collection, 
  doc, 
  setDoc, 
  getDoc, 
  getDocs, 
  updateDoc, 
  deleteDoc,
  query,
  where,
  serverTimestamp,
  orderBy
} from "firebase/firestore";
import { db, handleFirestoreError, OperationType } from "../lib/firebase";
import { SellerProduct, SellerOrder, SellerProfile } from "../modules/seller/types";

export const sellerService = {
  // --- Profile ---
  async getSellerProfile(userId: string): Promise<SellerProfile | null> {
    try {
      const docRef = doc(db, "sellers", userId);
      const docSnap = await getDoc(docRef);
      if (docSnap.exists()) {
        return { id: docSnap.id, ...docSnap.data() } as unknown as SellerProfile;
      }
      return null;
    } catch (error) {
      handleFirestoreError(error, OperationType.GET, `sellers/${userId}`);
      return null;
    }
  },

  async updateSellerProfile(userId: string, data: Partial<SellerProfile>): Promise<void> {
    try {
      const docRef = doc(db, "sellers", userId);
      // Attempt to update; if it doesn't exist, we might need setDoc.
      const docSnap = await getDoc(docRef);
      if (docSnap.exists()) {
        await updateDoc(docRef, { ...data, updatedAt: serverTimestamp() });
      } else {
        await setDoc(docRef, { ...data, createdAt: serverTimestamp(), updatedAt: serverTimestamp() });
      }
    } catch (error) {
      handleFirestoreError(error, OperationType.UPDATE, `sellers/${userId}`);
      throw error;
    }
  },

  // --- Products ---
  async getSellerProducts(userId: string): Promise<SellerProduct[]> {
    try {
      const q = query(
        collection(db, "products"),
        where("sellerId", "==", userId),
        orderBy("createdAt", "desc")
      );
      const querySnapshot = await getDocs(q);
      return querySnapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data(),
        createdAt: doc.data().createdAt?.toDate?.()?.toISOString() || new Date().toISOString()
      })) as SellerProduct[];
    } catch (error) {
      handleFirestoreError(error, OperationType.LIST, "products");
      return [];
    }
  },

  async createProduct(userId: string, product: Omit<SellerProduct, "id" | "views" | "createdAt">): Promise<SellerProduct> {
    try {
      const newDocRef = doc(collection(db, "products"));
      const newProduct = {
        ...product,
        sellerId: userId,
        views: 0,
        createdAt: serverTimestamp(),
      };
      await setDoc(newDocRef, newProduct);
      return { 
        id: newDocRef.id, 
        ...newProduct, 
        createdAt: new Date().toISOString() 
      } as SellerProduct;
    } catch (error) {
      handleFirestoreError(error, OperationType.CREATE, "products");
      throw error;
    }
  },

  async updateProduct(productId: string, data: Partial<SellerProduct>): Promise<void> {
    try {
      const docRef = doc(db, "products", productId);
      await updateDoc(docRef, { ...data, updatedAt: serverTimestamp() });
    } catch (error) {
      handleFirestoreError(error, OperationType.UPDATE, `products/${productId}`);
      throw error;
    }
  },

  async deleteProduct(productId: string): Promise<void> {
    try {
      const docRef = doc(db, "products", productId);
      await deleteDoc(docRef);
    } catch (error) {
      handleFirestoreError(error, OperationType.DELETE, `products/${productId}`);
      throw error;
    }
  },

  // --- Orders ---
  async getSellerOrders(userId: string): Promise<SellerOrder[]> {
    try {
      const q = query(
        collection(db, "orders"),
        where("sellerId", "==", userId),
        orderBy("createdAt", "desc")
      );
      const querySnapshot = await getDocs(q);
      return querySnapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data(),
        createdAt: doc.data().createdAt?.toDate?.()?.toISOString() || new Date().toISOString()
      })) as SellerOrder[];
    } catch (error) {
      handleFirestoreError(error, OperationType.LIST, "orders");
      return [];
    }
  },

  async updateOrderStatus(orderId: string, status: string): Promise<void> {
    try {
      const docRef = doc(db, "orders", orderId);
      await updateDoc(docRef, { status, updatedAt: serverTimestamp() });
    } catch (error) {
      handleFirestoreError(error, OperationType.UPDATE, `orders/${orderId}`);
      throw error;
    }
  }
};
