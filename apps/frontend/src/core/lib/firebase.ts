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
import fallbackConfig from "@config/firebase-applet-config.json";

/**
 * Prefer VITE_FIREBASE_* env (Vercel) so public repo does not hard-depend on committed keys.
 * Fallback to firebase-applet-config.json only when env is incomplete (local/dev migration).
 * Client apiKey is not a secret, but domain restrictions + App Check + Firestore rules are required.
 */
function buildFirebaseConfig() {
  const fromEnv = {
    apiKey: import.meta.env.VITE_FIREBASE_API_KEY as string | undefined,
    authDomain: import.meta.env.VITE_FIREBASE_AUTH_DOMAIN as string | undefined,
    projectId: import.meta.env.VITE_FIREBASE_PROJECT_ID as string | undefined,
    storageBucket: import.meta.env.VITE_FIREBASE_STORAGE_BUCKET as string | undefined,
    messagingSenderId: import.meta.env.VITE_FIREBASE_MESSAGING_SENDER_ID as string | undefined,
    appId: import.meta.env.VITE_FIREBASE_APP_ID as string | undefined,
    measurementId: (import.meta.env.VITE_FIREBASE_MEASUREMENT_ID as string | undefined) || "",
    firestoreDatabaseId:
      (import.meta.env.VITE_FIREBASE_FIRESTORE_DATABASE_ID as string | undefined) ||
      (fallbackConfig as any).firestoreDatabaseId,
  };

  const hasEnvCore =
    Boolean(fromEnv.apiKey) &&
    Boolean(fromEnv.projectId) &&
    Boolean(fromEnv.appId) &&
    Boolean(fromEnv.authDomain);

  if (hasEnvCore) {
    return {
      apiKey: fromEnv.apiKey!,
      authDomain: fromEnv.authDomain!,
      projectId: fromEnv.projectId!,
      storageBucket: fromEnv.storageBucket || `${fromEnv.projectId}.appspot.com`,
      messagingSenderId: fromEnv.messagingSenderId || "",
      appId: fromEnv.appId!,
      measurementId: fromEnv.measurementId,
      firestoreDatabaseId: fromEnv.firestoreDatabaseId,
    };
  }

  return {
    apiKey: (fallbackConfig as any).apiKey,
    authDomain: (fallbackConfig as any).authDomain,
    projectId: (fallbackConfig as any).projectId,
    storageBucket: (fallbackConfig as any).storageBucket,
    messagingSenderId: (fallbackConfig as any).messagingSenderId,
    appId: (fallbackConfig as any).appId,
    measurementId: (fallbackConfig as any).measurementId || "",
    firestoreDatabaseId: (fallbackConfig as any).firestoreDatabaseId,
  };
}

const firebaseConfig = buildFirebaseConfig();

export const isFirebaseConfigValid = (config: any): boolean => {
  if (
    !config ||
    !config.projectId ||
    String(config.projectId).includes("your-project-id") ||
    config.projectId === "remixed-project-id"
  ) {
    return false;
  }
  return true;
};

if (!isFirebaseConfigValid(firebaseConfig)) {
  console.warn(
    "⚠️ Firebase configuration is missing or using placeholder values. Authentication will not work correctly."
  );
}

const app = getApps().length === 0 ? initializeApp(firebaseConfig) : getApps()[0];

export const db = firebaseConfig.firestoreDatabaseId
  ? getFirestore(app, firebaseConfig.firestoreDatabaseId)
  : getFirestore(app);

export const auth = getAuth(app);
export const storage = getStorage(app);

export const googleProvider = new GoogleAuthProvider();
googleProvider.setCustomParameters({ prompt: "select_account" });
googleProvider.addScope("profile");
googleProvider.addScope("email");

export const facebookProvider = new FacebookAuthProvider();

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

let cachedAccessToken: string | null = null;

export const getAccessToken = async (forceRefresh = false): Promise<string | null> => {
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

export enum OperationType {
  CREATE = "create",
  UPDATE = "update",
  DELETE = "delete",
  LIST = "list",
  GET = "get",
  WRITE = "write",
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
    providerInfo?: { providerId?: string | null; email?: string | null }[];
  };
}

export function handleFirestoreError(error: unknown, operationType: OperationType, path: string | null) {
  const errorMessage = error instanceof Error ? error.message : String(error);
  const errorCode = (error as any)?.code || "";

  const errInfo: FirestoreErrorInfo = {
    error: errorMessage,
    authInfo: {
      userId: auth.currentUser?.uid,
      email: auth.currentUser?.email,
      emailVerified: auth.currentUser?.emailVerified,
      isAnonymous: auth.currentUser?.isAnonymous,
      tenantId: auth.currentUser?.tenantId,
      providerInfo:
        auth.currentUser?.providerData?.map((provider) => ({
          providerId: provider.providerId,
          email: provider.email,
        })) || [],
    },
    operationType,
    path,
  };

  if (errorCode === "unavailable" || errorCode === "failed-precondition" || errorMessage.includes("offline")) {
    console.warn("Firestore offline mode:", JSON.stringify(errInfo));
    return;
  }

  console.error("Firestore Error: ", JSON.stringify(errInfo));
  throw new Error(JSON.stringify(errInfo));
}

async function testConnection() {
  if (typeof window !== "undefined" && !navigator.onLine) return;
  if (!isFirebaseConfigValid(firebaseConfig)) return;
  try {
    const connRef = doc(db, "test", "connection");
    await getDocFromServer(connRef).catch(() => null);
  } catch {
    console.info("Firestore connection check bypassed or limited.");
  }
}
testConnection();
