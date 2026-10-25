import { initializeApp, getApps } from "firebase/app";
import { getAuth, GoogleAuthProvider, FacebookAuthProvider } from "firebase/auth";
import { getFirestore, doc, getDocFromServer } from "firebase/firestore";
import { getStorage } from "firebase/storage";
import firebaseConfig from "@config/firebase-applet-config.json";

// Initialize Firebase App
const app = getApps().length === 0 ? initializeApp(firebaseConfig) : getApps()[0];

// Initialize Firestore with firestoreDatabaseId (CRITICAL: Required for Firestore Enterprise)
export const db = getFirestore(app, firebaseConfig.firestoreDatabaseId);

// Initialize Firebase Authentication
export const auth = getAuth(app);
export const storage = getStorage(app);

export const googleProvider = new GoogleAuthProvider();
googleProvider.setCustomParameters({ prompt: 'select_account' });
export const facebookProvider = new FacebookAuthProvider();

export enum OperationType {
  CREATE = 'create',
  UPDATE = 'update',
  DELETE = 'delete',
  LIST = 'list',
  GET = 'get',
  WRITE = 'write',
}

export interface FirestoreErrorInfo {
  error: string;
  operationType: OperationType;
  path: string | null;
  authInfo: {
    userId?: string | null;
    email?: string | null;
    emailVerified?: boolean | null;
    isAnonymous?: boolean | null;
    tenantId?: string | null;
    providerInfo?: {
      providerId?: string | null;
      email?: string | null;
    }[];
  };
}

export function handleFirestoreError(error: unknown, operationType: OperationType, path: string | null) {
  const errorMessage = error instanceof Error ? error.message : String(error);
  const errorCode = (error as any)?.code || '';

  const errInfo: FirestoreErrorInfo = {
    error: errorMessage,
    authInfo: {
      userId: auth.currentUser?.uid,
      email: auth.currentUser?.email,
      emailVerified: auth.currentUser?.emailVerified,
      isAnonymous: auth.currentUser?.isAnonymous,
      tenantId: auth.currentUser?.tenantId,
      providerInfo: auth.currentUser?.providerData?.map((provider) => ({
        providerId: provider.providerId,
        email: provider.email,
      })) || [],
    },
    operationType,
    path,
  };

  // Check if error is due to offline/network/unavailable state
  const isOfflineOrUnavailable = 
    errorCode === 'unavailable' ||
    errorCode === 'failed-precondition' ||
    errorMessage.includes('unavailable') ||
    errorMessage.includes('Could not reach Cloud Firestore backend') ||
    errorMessage.includes('client is offline') ||
    errorMessage.includes('network');

  if (isOfflineOrUnavailable) {
    console.warn("Firestore connection unavailable or offline:", JSON.stringify(errInfo));
    // Gracefully handle offline mode without throwing fatal crashes
    return;
  }

  console.error("Firestore Error: ", JSON.stringify(errInfo));
  throw new Error(JSON.stringify(errInfo));
}

// Test connection on boot gracefully
async function testConnection() {
  if (typeof window !== "undefined" && !navigator.onLine) {
    console.info("Firestore client is offline. Operating in offline cache mode.");
    return;
  }
  try {
    const connRef = doc(db, "test", "connection");
    await getDocFromServer(connRef).catch(() => null);
  } catch {
    console.info("Firestore operating in offline/mock mode or backend unreachable.");
  }
}
testConnection();
