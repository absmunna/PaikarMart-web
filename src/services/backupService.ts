import { collection, query, where, getDocs, doc, setDoc, serverTimestamp } from "firebase/firestore";
import { ref, uploadString, getDownloadURL } from "firebase/storage";
import { db, storage, auth, handleFirestoreError, OperationType } from "../lib/firebase";

export interface BackupItem {
  id: string;
  backupName: string;
  storageUrl?: string;
  sizeBytes: number;
  itemCount: number;
  createdAt: any;
}

export const backupService = {
  /**
   * Create a full JSON backup snapshot of user's products, posts, vault files, services & reels,
   * upload it to Firebase Storage, and save metadata in Firestore.
   */
  async createBackupSnapshot(): Promise<{ backupName: string; itemCount: number; jsonString: string }> {
    const user = auth.currentUser;
    const userId = user?.uid || 'guest-user';
    const timestamp = Date.now();
    const backupName = `paikarmart_backup_${timestamp}.json`;

    let products: any[] = [];
    let posts: any[] = [];
    let vaultFiles: any[] = [];
    let services: any[] = [];

    // Fetch user products
    try {
      const qProd = query(collection(db, 'products'), where('sellerId', '==', userId));
      const snapProd = await getDocs(qProd);
      products = snapProd.docs.map(d => ({ id: d.id, ...d.data() }));
    } catch (e) {}

    // Fetch user posts
    try {
      const qPosts = query(collection(db, 'posts'), where('sellerId', '==', userId));
      const snapPosts = await getDocs(qPosts);
      posts = snapPosts.docs.map(d => ({ id: d.id, ...d.data() }));
    } catch (e) {}

    // Fetch user vault files
    try {
      const qVault = query(collection(db, 'client_vault_files'), where('userId', '==', userId));
      const snapVault = await getDocs(qVault);
      vaultFiles = snapVault.docs.map(d => ({ id: d.id, ...d.data() }));
    } catch (e) {}

    // Fetch user services
    try {
      const qServ = query(collection(db, 'services'), where('providerId', '==', userId));
      const snapServ = await getDocs(qServ);
      services = snapServ.docs.map(d => ({ id: d.id, ...d.data() }));
    } catch (e) {}

    const backupPayload = {
      app: "PaikarMart WebApp",
      version: "1.0",
      userId,
      createdAt: new Date().toISOString(),
      counts: {
        products: products.length,
        posts: posts.length,
        vaultFiles: vaultFiles.length,
        services: services.length,
        total: products.length + posts.length + vaultFiles.length + services.length
      },
      data: {
        products,
        posts,
        vaultFiles,
        services
      }
    };

    const jsonString = JSON.stringify(backupPayload, null, 2);
    const sizeBytes = new Blob([jsonString]).size;
    const itemCount = backupPayload.counts.total;

    // Upload snapshot to Firebase Storage
    let storageUrl = "";
    try {
      const storageRef = ref(storage, `backups/${userId}/${backupName}`);
      await uploadString(storageRef, jsonString, 'raw', { contentType: 'application/json' });
      storageUrl = await getDownloadURL(storageRef);
    } catch (err) {
      console.warn("Storage snapshot backup notice:", err);
    }

    // Save metadata record in Firestore
    const backupId = `backup_${timestamp}`;
    try {
      await setDoc(doc(db, 'backups', backupId), {
        id: backupId,
        userId,
        backupName,
        storageUrl,
        sizeBytes,
        itemCount,
        createdAt: serverTimestamp()
      });
    } catch (e) {}

    // Auto-download JSON file for user local backup
    const blob = new Blob([jsonString], { type: 'application/json' });
    const link = document.createElement('a');
    link.href = URL.createObjectURL(blob);
    link.download = backupName;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);

    return { backupName, itemCount, jsonString };
  },

  /**
   * Restore products & posts from a JSON backup file content
   */
  async restoreFromJSON(jsonString: string): Promise<{ restoredCount: number }> {
    const user = auth.currentUser;
    const userId = user?.uid || 'guest-user';
    let restoredCount = 0;

    try {
      const payload = JSON.parse(jsonString);
      const data = payload.data || {};

      if (Array.isArray(data.products)) {
        for (const item of data.products) {
          const docId = item.id || `restored_prod_${Date.now()}_${Math.random().toString(36).substring(2, 7)}`;
          await setDoc(doc(db, 'products', docId), {
            ...item,
            sellerId: userId,
            updatedAt: serverTimestamp()
          });
          restoredCount++;
        }
      }

      if (Array.isArray(data.posts)) {
        for (const item of data.posts) {
          const docId = item.id || `restored_post_${Date.now()}_${Math.random().toString(36).substring(2, 7)}`;
          await setDoc(doc(db, 'posts', docId), {
            ...item,
            sellerId: userId,
            updatedAt: serverTimestamp()
          });
          restoredCount++;
        }
      }
    } catch (error) {
      console.error("Failed to parse or restore backup JSON:", error);
      throw new Error("Invalid backup file format");
    }

    return { restoredCount };
  },

  /**
   * Fetch list of user's existing backups from Firestore
   */
  async getUserBackups(): Promise<BackupItem[]> {
    const user = auth.currentUser;
    if (!user) return [];

    try {
      const q = query(collection(db, 'backups'), where('userId', '==', user.uid));
      const snap = await getDocs(q);
      return snap.docs.map(d => ({
        id: d.id,
        ...d.data()
      })) as BackupItem[];
    } catch (e) {
      return [];
    }
  }
};
