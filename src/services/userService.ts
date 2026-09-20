import { 
  doc, 
  getDoc, 
  getDocs,
  collection,
  setDoc, 
  updateDoc, 
  serverTimestamp, 
  Timestamp,
  query,
  limit
} from "firebase/firestore";
import { db, handleFirestoreError, OperationType } from "../lib/firebase";
import { UserProfile } from "../types/user";
export type { UserProfile };

export const userService = {
  /**
   * Fetches a user profile by ID.
   */
  async getUserProfile(userId: string): Promise<UserProfile | null> {
    try {
      const docRef = doc(db, "users", userId);
      const docSnap = await getDoc(docRef);
      if (docSnap.exists()) {
        return docSnap.data() as UserProfile;
      }
      return null;
    } catch (error) {
      handleFirestoreError(error, OperationType.GET, `users/${userId}`);
      return null;
    }
  },

  /**
   * Creates a new user profile or completely overwrites an existing one.
   */
  async createUserProfile(userId: string, data: Partial<UserProfile>): Promise<void> {
    try {
      const docRef = doc(db, "users", userId);
      const profileData = {
        id: userId,
        roles: data.roles || ["buyer"],
        createdAt: serverTimestamp(),
        updatedAt: serverTimestamp(),
      };
      
      if (data.name) (profileData as any).name = data.name;
      if (data.email) (profileData as any).email = data.email;
      if (data.phone) (profileData as any).phone = data.phone;
      if (data.phoneVerified !== undefined) (profileData as any).phoneVerified = data.phoneVerified;
      if (data.avatarUrl) (profileData as any).avatarUrl = data.avatarUrl;

      await setDoc(docRef, profileData);
    } catch (error) {
      handleFirestoreError(error, OperationType.CREATE, `users/${userId}`);
    }
  },

  /**
   * Updates specific fields in an existing user profile.
   */
  async updateUserProfile(userId: string, data: Partial<UserProfile>): Promise<void> {
    try {
      const docRef = doc(db, "users", userId);
      const updateData = {
        ...data,
        updatedAt: serverTimestamp()
      };
      
      // Ensure we don't accidentally update immutable fields during an update
      delete updateData.id;
      delete updateData.createdAt;

      await updateDoc(docRef, updateData);
    } catch (error) {
      handleFirestoreError(error, OperationType.UPDATE, `users/${userId}`);
    }
  },

  /**
   * Fetches all user profiles (limited for performance).
   */
  async getAllUsers(): Promise<UserProfile[]> {
    try {
      const q = query(collection(db, "users"), limit(100));
      const querySnapshot = await getDocs(q);
      return querySnapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      })) as UserProfile[];
    } catch (error) {
      handleFirestoreError(error, OperationType.LIST, "users");
      return [];
    }
  }
};
