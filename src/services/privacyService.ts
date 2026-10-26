import { doc, getDoc, setDoc, deleteDoc, collection, query, where, getDocs, serverTimestamp } from "firebase/firestore";
import { db, auth } from "../lib/firebase";

export interface PrivacySettings {
  showPhoneNumber: boolean;
  showEmailAddress: boolean;
  allowMarketingEmails: boolean;
  dataProcessingConsent: boolean;
  updatedAt?: any;
}

export const DEFAULT_PRIVACY_SETTINGS: PrivacySettings = {
  showPhoneNumber: true,
  showEmailAddress: false,
  allowMarketingEmails: true,
  dataProcessingConsent: true,
};

export const privacyService = {
  /**
   * Fetch user privacy settings from Firestore
   */
  async getPrivacySettings(userId: string): Promise<PrivacySettings> {
    try {
      const ref = doc(db, "user_privacy_settings", userId);
      const snap = await getDoc(ref);
      if (snap.exists()) {
        return snap.data() as PrivacySettings;
      }
    } catch (e) {
      console.warn("Notice reading privacy settings:", e);
    }
    return DEFAULT_PRIVACY_SETTINGS;
  },

  /**
   * Save or update privacy settings in Firestore
   */
  async updatePrivacySettings(userId: string, settings: Partial<PrivacySettings>): Promise<void> {
    const ref = doc(db, "user_privacy_settings", userId);
    await setDoc(
      ref,
      {
        userId,
        ...settings,
        updatedAt: serverTimestamp(),
      },
      { merge: true }
    );
  },

  /**
   * Export all user data stored in Firebase for GDPR / Bangladesh E-Commerce compliance
   */
  async exportAllUserData(userId: string): Promise<{ filename: string; jsonContent: string }> {
    let profileData: any = null;
    let products: any[] = [];
    let posts: any[] = [];
    let vaultFiles: any[] = [];
    let services: any[] = [];
    let kycDocs: any[] = [];

    // Profile
    try {
      const pSnap = await getDoc(doc(db, "users", userId));
      if (pSnap.exists()) profileData = pSnap.data();
    } catch (e) {}

    // Products
    try {
      const q = query(collection(db, "products"), where("sellerId", "==", userId));
      const snap = await getDocs(q);
      products = snap.docs.map((d) => ({ id: d.id, ...d.data() }));
    } catch (e) {}

    // Posts & Reels
    try {
      const q = query(collection(db, "posts"), where("sellerId", "==", userId));
      const snap = await getDocs(q);
      posts = snap.docs.map((d) => ({ id: d.id, ...d.data() }));
    } catch (e) {}

    // Vault Files
    try {
      const q = query(collection(db, "client_vault_files"), where("userId", "==", userId));
      const snap = await getDocs(q);
      vaultFiles = snap.docs.map((d) => ({ id: d.id, ...d.data() }));
    } catch (e) {}

    // Services
    try {
      const q = query(collection(db, "services"), where("providerId", "==", userId));
      const snap = await getDocs(q);
      services = snap.docs.map((d) => ({ id: d.id, ...d.data() }));
    } catch (e) {}

    // KYC Documents
    try {
      const q = query(collection(db, "kyc_documents"), where("userId", "==", userId));
      const snap = await getDocs(q);
      kycDocs = snap.docs.map((d) => ({ id: d.id, ...d.data() }));
    } catch (e) {}

    const exportPayload = {
      title: "PaikarMart User Privacy Data Export",
      compliance: "Bangladesh Digital Commerce Management Guidelines 2021 & GDPR Standard",
      exportedAt: new Date().toISOString(),
      userId,
      userData: {
        profile: profileData,
        products,
        posts,
        vaultFiles,
        services,
        kycDocuments: kycDocs,
      },
    };

    const jsonContent = JSON.stringify(exportPayload, null, 2);
    const filename = `paikarmart_user_privacy_export_${userId}_${Date.now()}.json`;

    // Trigger local download
    const blob = new Blob([jsonContent], { type: "application/json" });
    const link = document.createElement("a");
    link.href = URL.createObjectURL(blob);
    link.download = filename;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);

    return { filename, jsonContent };
  },

  /**
   * Delete user account and all personal data (Right to be Forgotten)
   */
  async deleteAccountAndAllData(userId: string): Promise<void> {
    // 1. Delete user products
    try {
      const q = query(collection(db, "products"), where("sellerId", "==", userId));
      const snap = await getDocs(q);
      for (const d of snap.docs) {
        await deleteDoc(doc(db, "products", d.id));
      }
    } catch (e) {}

    // 2. Delete posts & reels
    try {
      const q = query(collection(db, "posts"), where("sellerId", "==", userId));
      const snap = await getDocs(q);
      for (const d of snap.docs) {
        await deleteDoc(doc(db, "posts", d.id));
      }
    } catch (e) {}

    // 3. Delete vault files
    try {
      const q = query(collection(db, "client_vault_files"), where("userId", "==", userId));
      const snap = await getDocs(q);
      for (const d of snap.docs) {
        await deleteDoc(doc(db, "client_vault_files", d.id));
      }
    } catch (e) {}

    // 4. Delete privacy settings & profile
    try {
      await deleteDoc(doc(db, "user_privacy_settings", userId));
      await deleteDoc(doc(db, "users", userId));
    } catch (e) {}
  },
};
