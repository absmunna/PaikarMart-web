import { 
  collection, 
  query, 
  where, 
  getDocs,
  getDoc,
  doc,
  orderBy, 
  limit, 
  onSnapshot,
  addDoc,
  updateDoc,
  deleteDoc,
  serverTimestamp
} from "firebase/firestore";
import { db, handleFirestoreError, OperationType } from "../lib/firebase";
import { SellerProduct } from "../modules/seller/types";

// Mock data for when Firestore is disabled
const MOCK_PRODUCTS: SellerProduct[] = [
  {
    id: "sp_1",
    title: "Handwoven Cotton Throw",
    description: "Soft, breathable cotton throw, ethically made by local artisans.",
    price: 38,
    stock: 24,
    categoryId: "home",
    categoryName: "Home & Lifestyle",
    type: "retail",
    location: "Dhaka, Bangladesh",
    images: ["https://images.unsplash.com/photo-1600585154340-be6161a56a0c?w=600"],
    tags: ["home", "cotton", "handmade"],
    views: 248,
    status: 'active',
    sellerId: "seed-seller-1",
    sellerName: "Aurora Goods Co.",
    createdAt: new Date().toISOString()
  },
  {
    id: "sp_2",
    title: "Ceramic Pour-over Set",
    description: "A minimalist matte ceramic pour-over kit for the perfect morning cup.",
    price: 54,
    stock: 12,
    categoryId: "home",
    categoryName: "Kitchen",
    type: "retail",
    location: "Dhaka, Bangladesh",
    images: ["https://images.unsplash.com/photo-1495474472287-4d71bcdd2085?w=600"],
    tags: ["coffee", "ceramic"],
    views: 412,
    status: 'active',
    sellerId: "seed-seller-1",
    sellerName: "Aurora Goods Co.",
    createdAt: new Date().toISOString()
  },
  {
    id: "sp_4",
    title: "Homemade Chocolate Cake",
    description: "Rich, moist dark chocolate cake made at home with premium ingredients.",
    price: 15,
    stock: 5,
    categoryId: "homemade",
    categoryName: "Home Made",
    type: "homemade",
    location: "Dhanmondi, Dhaka",
    images: ["https://images.unsplash.com/photo-1578985545062-69928b1d9587?w=600"],
    tags: ["cake", "homemade", "food"],
    views: 156,
    status: 'active',
    sellerId: "seed-seller-2",
    sellerName: "Sweet Cravings",
    createdAt: new Date().toISOString()
  },
  {
    id: "sp_5",
    title: "Fast Pharmacy - Medicine Delivery",
    description: "Life-saving medicines and healthcare products delivered fast.",
    price: 10,
    stock: 100,
    categoryId: "pharmacy",
    categoryName: "Pharmacy",
    type: "nearby",
    location: "Gulshan, Dhaka",
    images: ["https://images.unsplash.com/photo-1586015555751-63bb77f4322a?w=600"],
    tags: ["medicine", "health", "pharmacy"],
    views: 89,
    status: 'active',
    sellerId: "seed-seller-3",
    sellerName: "QuickCare Pharma",
    createdAt: new Date().toISOString()
  }
];

export const productService = {
  /**
   * Search products by title prefix
   */
  async searchProductsByTitle(searchTerm: string, maxResults: number = 5): Promise<SellerProduct[]> {
    if (!searchTerm.trim()) return [];
    if (!db) {
      return MOCK_PRODUCTS.filter(p => p.title.toLowerCase().includes(searchTerm.toLowerCase())).slice(0, maxResults);
    }

    const path = "products";
    try {
      const q = query(
        collection(db, path),
        where("title", ">=", searchTerm),
        where("title", "<=", searchTerm + "\uf8ff"),
        limit(maxResults)
      );

      const querySnapshot = await getDocs(q);
      return querySnapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      })) as SellerProduct[];
    } catch (error) {
      handleFirestoreError(error, OperationType.LIST, path);
      return [];
    }
  },

  /**
   * Filter products by category
   */
  async getProductsByCategory(categoryName: string, maxResults: number = 20): Promise<SellerProduct[]> {
    if (!db) {
      return MOCK_PRODUCTS.filter(p => p.categoryName.toLowerCase() === categoryName.toLowerCase()).slice(0, maxResults);
    }
    const path = "products";
    try {
      const q = query(
        collection(db, path),
        where("categoryName", "==", categoryName),
        where("status", "==", "active"),
        orderBy("createdAt", "desc"),
        limit(maxResults)
      );

      const querySnapshot = await getDocs(q);
      return querySnapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      })) as SellerProduct[];
    } catch (error) {
      handleFirestoreError(error, OperationType.LIST, path);
      return [];
    }
  },

  /**
   * Get products by type (retail or wholesale)
   */
  async getProductsByType(type: 'retail' | 'wholesale', maxResults: number = 20): Promise<SellerProduct[]> {
    if (!db) {
      return MOCK_PRODUCTS.filter(p => p.type === type).slice(0, maxResults);
    }
    const path = "products";
    try {
      const q = query(
        collection(db, path),
        where("type", "==", type),
        where("status", "==", "active"),
        orderBy("createdAt", "desc"),
        limit(maxResults)
      );

      const querySnapshot = await getDocs(q);
      return querySnapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      })) as SellerProduct[];
    } catch (error) {
      handleFirestoreError(error, OperationType.LIST, path);
      return [];
    }
  },

  /**
   * Get a single product by ID
   */
  async getProductById(productId: string): Promise<SellerProduct | null> {
    if (!db) {
      return MOCK_PRODUCTS.find(p => p.id === productId) || null;
    }
    const path = `products/${productId}`;
    try {
      const docRef = doc(db, "products", productId);
      const docSnap = await getDoc(docRef);
      if (docSnap.exists()) {
        return {
          id: docSnap.id,
          ...docSnap.data()
        } as SellerProduct;
      }
      return null;
    } catch (error) {
      handleFirestoreError(error, OperationType.GET, path);
      return null;
    }
  },

  /**
   * Get all products (Admin)
   */
  async getAllProducts(maxResults: number = 50): Promise<SellerProduct[]> {
    if (!db) return MOCK_PRODUCTS.slice(0, maxResults);
    const path = "products";
    try {
      const q = query(
        collection(db, path),
        orderBy("createdAt", "desc"),
        limit(maxResults)
      );

      const querySnapshot = await getDocs(q);
      return querySnapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      })) as SellerProduct[];
    } catch (error) {
      handleFirestoreError(error, OperationType.LIST, path);
      return [];
    }
  },

  /**
   * Add a new product (Admin/Seller)
   */
  async addProduct(productData: Partial<SellerProduct>): Promise<string | null> {
    if (!db) {
      console.warn("Database disabled. Product not saved.");
      return "mock-id-" + Math.random();
    }
    const path = "products";
    try {
      const docRef = await addDoc(collection(db, path), {
        ...productData,
        status: productData.status || "active",
        createdAt: serverTimestamp(),
        updatedAt: serverTimestamp(),
      });
      return docRef.id;
    } catch (error) {
      handleFirestoreError(error, OperationType.CREATE, path);
      return null;
    }
  },

  /**
   * Update an existing product
   */
  async updateProduct(productId: string, productData: Partial<SellerProduct>): Promise<boolean> {
    if (!db) return true;
    const path = `products/${productId}`;
    try {
      const docRef = doc(db, "products", productId);
      await updateDoc(docRef, {
        ...productData,
        updatedAt: serverTimestamp(),
      });
      return true;
    } catch (error) {
      handleFirestoreError(error, OperationType.UPDATE, path);
      return false;
    }
  },

  /**
   * Delete a product
   */
  async deleteProduct(productId: string): Promise<boolean> {
    if (!db) return true;
    const path = `products/${productId}`;
    try {
      const docRef = doc(db, "products", productId);
      await deleteDoc(docRef);
      return true;
    } catch (error) {
      handleFirestoreError(error, OperationType.DELETE, path);
      return false;
    }
  },

  /**
   * Real-time search for the header (Title prefix or Category match)
   */
  subscribeToSearch(searchTerm: string, callback: (products: SellerProduct[]) => void) {
    if (!searchTerm.trim()) {
      callback([]);
      return () => {};
    }

    if (!db) {
      const term = searchTerm.toLowerCase();
      const filtered = MOCK_PRODUCTS.filter(p => 
        p.title.toLowerCase().includes(term) || 
        p.categoryName.toLowerCase().includes(term)
      );
      callback(filtered);
      return () => {};
    }

    const path = "products";
    const term = searchTerm.trim();
    
    // Query for title prefix
    const qTitle = query(
      collection(db, path),
      where("title", ">=", term),
      where("title", "<=", term + "\uf8ff"),
      limit(10)
    );

    // Query for exact category name match
    const qCategory = query(
      collection(db, path),
      where("categoryName", "==", term),
      limit(10)
    );

    let titleResults: SellerProduct[] = [];
    let categoryResults: SellerProduct[] = [];

    const updateResults = () => {
      const combined = [...titleResults];
      categoryResults.forEach(p => {
        if (!combined.find(cp => cp.id === p.id)) {
          combined.push(p);
        }
      });
      callback(combined.slice(0, 8));
    };

    const unsubTitle = onSnapshot(qTitle, (snapshot) => {
      titleResults = snapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data(),
        // Convert firestore timestamp to ISO string if needed
        createdAt: doc.data().createdAt?.toDate?.()?.toISOString() || new Date().toISOString()
      })) as SellerProduct[];
      updateResults();
    }, (error) => handleFirestoreError(error, OperationType.LIST, path));

    const unsubCategory = onSnapshot(qCategory, (snapshot) => {
      categoryResults = snapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data(),
        createdAt: doc.data().createdAt?.toDate?.()?.toISOString() || new Date().toISOString()
      })) as SellerProduct[];
      updateResults();
    }, (error) => handleFirestoreError(error, OperationType.LIST, path));

    return () => {
      unsubTitle();
      unsubCategory();
    };
  }
};
