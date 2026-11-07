import { initializeApp, getApps, FirebaseError } from "firebase/app";
import { 
  getAuth, 
  GoogleAuthProvider, 
  FacebookAuthProvider,
  signInWithPhoneNumber,
  signInWithPopup,
  signInWithEmailAndPassword,
  createUserWithEmailAndPassword,
  sendPasswordResetEmail,
  signOut,
  onAuthStateChanged,
  RecaptchaVerifier,
  EmailAuthProvider,
  PhoneAuthProvider,
  sendEmailVerification,
  signInAnonymously,
  type User
} from "firebase/auth";
import { getFirestore, doc, getDocFromServer } from "firebase/firestore";
import { getStorage } from "firebase/storage";
import firebaseConfig from "@config/firebase-applet-config.json";

// 1. Config Validation: Ensure the config is not a placeholder
export const isFirebaseConfigValid = (config: any): boolean => {
  if (!config || !config.projectId || config.projectId.includes('your-project-id') || config.projectId === 'remixed-project-id') {
    return false;
  }
  return true;
};

if (!isFirebaseConfigValid(firebaseConfig)) {
  console.warn("⚠️ Firebase configuration is missing or using placeholder values. Authentication will not work correctly.");
}

// 2. Initialize Firebase App
const app = getApps().length === 0 ? initializeApp(firebaseConfig) : getApps()[0];

// 3. Initialize Firestore with Enterprise database ID if provided
export const db = getFirestore(app, firebaseConfig.firestoreDatabaseId);

// 4. Initialize Authentication
export const auth = getAuth(app);
export const storage = getStorage(app);

// 5. Providers with Scopes
export const googleProvider = new GoogleAuthProvider();
googleProvider.setCustomParameters({ prompt: 'select_account' });

// Add Workspace scopes for deep integration
const WORKSPACE_SCOPES = [
  'https://www.googleapis.com/auth/drive.readonly',
  'https://www.googleapis.com/auth/spreadsheets.readonly',
  'https://www.googleapis.com/auth/documents.readonly',
  'https://www.googleapis.com/auth/forms.responses.readonly',
  'https://www.googleapis.com/auth/calendar.readonly'
];
WORKSPACE_SCOPES.forEach(scope => googleProvider.addScope(scope));

export const facebookProvider = new FacebookAuthProvider();

// 6. Re-export Firebase primitives
export { 
  RecaptchaVerifier, 
  signInWithPhoneNumber, 
  signInWithPopup, 
  signInWithEmailAndPassword,
  createUserWithEmailAndPassword,
  sendPasswordResetEmail,
  signOut,
  onAuthStateChanged,
  GoogleAuthProvider,
  EmailAuthProvider,
  PhoneAuthProvider,
  sendEmailVerification,
  signInAnonymously,
  FirebaseError
};
export type { User };

// 7. Session Helpers
let cachedAccessToken: string | null = null;

export const getAccessToken = async (forceRefresh = false): Promise<string | null> => {
  if (cachedAccessToken && !forceRefresh) return cachedAccessToken;
  
  const user = auth.currentUser;
  if (!user) return null;
  
  try {
    cachedAccessToken = await user.getIdToken(forceRefresh);
    return cachedAccessToken;
  } catch (err) {
    console.error("Failed to get Firebase ID Token:", err);
    return null;
  }
};

export const logout = async () => {
  await signOut(auth);
  cachedAccessToken = null;
  if (typeof window !== "undefined") {
    localStorage.removeItem("pm_token");
    localStorage.removeItem("accessToken");
    localStorage.removeItem("pm.auth.token.v2");
  }
};

// 8. Error Handling
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

  if (errorCode === 'unavailable' || errorCode === 'failed-precondition' || errorMessage.includes('offline')) {
    console.warn("Firestore offline mode:", JSON.stringify(errInfo));
    return;
  }

  console.error("Firestore Error: ", JSON.stringify(errInfo));
  throw new Error(JSON.stringify(errInfo));
}

// 9. Startup Check
async function testConnection() {
  if (typeof window !== "undefined" && !navigator.onLine) return;
  if (!isFirebaseConfigValid(firebaseConfig)) return;
  
  try {
    const connRef = doc(db, "test", "connection");
    await getDocFromServer(connRef).catch(() => null);
  } catch (e) {
    console.info("Firestore connection check bypassed or limited.");
  }
}
testConnection();

