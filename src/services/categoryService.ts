import { 
  collection, 
  getDocs, 
  doc, 
  setDoc, 
  updateDoc, 
  deleteDoc, 
  query, 
  orderBy,
  serverTimestamp,
  Timestamp
} from "firebase/firestore";
import { db, handleFirestoreError, OperationType } from "../lib/firebase";

export interface Category {
  id: string;
  name: string;
  slug: string;
  description?: string;
  icon?: string;
  parentId?: string;
  order: number;
  isActive: boolean;
  createdAt?: Timestamp;
}

export const categoryService = {
  async getAllCategories(): Promise<Category[]> {
    try {
      const q = query(collection(db, "categories"), orderBy("order", "asc"));
      const querySnapshot = await getDocs(q);
      return querySnapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      })) as Category[];
    } catch (error) {
      handleFirestoreError(error, OperationType.LIST, "categories");
      return [];
    }
  },

  async createCategory(data: Omit<Category, 'id' | 'createdAt'>): Promise<void> {
    try {
      const id = data.slug || Math.random().toString(36).substring(7);
      const docRef = doc(db, "categories", id);
      await setDoc(docRef, {
        ...data,
        createdAt: serverTimestamp()
      });
    } catch (error) {
      handleFirestoreError(error, OperationType.CREATE, "categories");
    }
  },

  async updateCategory(id: string, data: Partial<Category>): Promise<void> {
    try {
      const docRef = doc(db, "categories", id);
      await updateDoc(docRef, data);
    } catch (error) {
      handleFirestoreError(error, OperationType.UPDATE, `categories/${id}`);
    }
  },

  async deleteCategory(id: string): Promise<void> {
    try {
      const docRef = doc(db, "categories", id);
      await deleteDoc(docRef);
    } catch (error) {
      handleFirestoreError(error, OperationType.DELETE, `categories/${id}`);
    }
  }
};
