import { initializeApp, getApps, getApp } from 'firebase/app';
import {
  getAuth,
  GoogleAuthProvider,
  signInWithPopup,
  signOut,
  onAuthStateChanged,
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  sendPasswordResetEmail,
  updateProfile,
  type User as FirebaseUser
} from 'firebase/auth';
import {
  getFirestore,
  doc,
  setDoc,
  getDoc,
  getDocFromServer,
  serverTimestamp
} from 'firebase/firestore';
import { getStorage, ref as storageRef, uploadBytes, getDownloadURL } from 'firebase/storage';
import { normalizeHandle } from '@paikarmart/shared';
import rawFirebaseConfig from '../../../../firebase-applet-config.json';

export interface FirebaseAuthConfig {
  apiKey: string;
  authDomain: string;
  projectId: string;
  firestoreDatabaseId?: string;
  storageBucket: string;
  messagingSenderId: string;
  appId: string;
}

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

export const firebaseConfig: FirebaseAuthConfig = {
  apiKey: rawFirebaseConfig?.apiKey || (import.meta as any).env?.VITE_FIREBASE_API_KEY || '',
  authDomain: rawFirebaseConfig?.authDomain || (import.meta as any).env?.VITE_FIREBASE_AUTH_DOMAIN || '',
  projectId: rawFirebaseConfig?.projectId || (import.meta as any).env?.VITE_FIREBASE_PROJECT_ID || '',
  firestoreDatabaseId: rawFirebaseConfig?.firestoreDatabaseId || '(default)',
  storageBucket: rawFirebaseConfig?.storageBucket || '',
  messagingSenderId: rawFirebaseConfig?.messagingSenderId || '',
  appId: rawFirebaseConfig?.appId || '',
};

export const isFirebaseConfigured = (): boolean => {
  return Boolean(firebaseConfig.apiKey && firebaseConfig.apiKey.startsWith('AIzaSy'));
};

// Initialize Firebase App
export const app = getApps().length > 0 ? getApp() : initializeApp(firebaseConfig);

// Initialize Auth & Firestore (bound strictly to provisioned firestoreDatabaseId)
export const auth = getAuth(app);
export const db =
  firebaseConfig.firestoreDatabaseId && firebaseConfig.firestoreDatabaseId !== '(default)'
    ? getFirestore(app, firebaseConfig.firestoreDatabaseId)
    : getFirestore(app);

export const googleProvider = new GoogleAuthProvider();
googleProvider.setCustomParameters({
  prompt: 'select_account',
});

export function handleFirestoreError(
  error: unknown,
  operationType: OperationType,
  path: string | null
): never {
  const errInfo: FirestoreErrorInfo = {
    error: error instanceof Error ? error.message : String(error),
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
  console.error('Firestore Error: ', JSON.stringify(errInfo));
  throw new Error(JSON.stringify(errInfo));
}

let connectionValidated = false;

export const validateFirestoreConnection = async (): Promise<void> => {
  if (connectionValidated || !isFirebaseConfigured()) return;
  connectionValidated = true;
  try {
    await getDocFromServer(doc(db, 'test', 'connection'));
  } catch (error) {
    if (error instanceof Error && error.message.includes('the client is offline')) {
      console.error('Please check your Firebase configuration: Firestore client is offline.');
    }
  }
};

export const signInWithGoogle = async (): Promise<FirebaseUser | null> => {
  try {
    const result = await signInWithPopup(auth, googleProvider);
    return result.user;
  } catch (error) {
    console.error('Firebase Google Sign-In Error:', error);
    throw error;
  }
};

export const signOutFirebase = async (): Promise<void> => {
  try {
    await signOut(auth);
  } catch (error) {
    console.error('Firebase Sign-Out Error:', error);
    throw error;
  }
};

export const sendPasswordReset = async (email: string): Promise<void> => {
  await sendPasswordResetEmail(auth, email.trim());
};

function sanitizeFirestoreHandle(rawHandle: string | undefined, email: string, uid: string): string {
  const fallbackSlug = email.includes('@') ? email.split('@')[0] : `user_${uid.slice(0, 6)}`;
  const normalized = normalizeHandle(rawHandle || fallbackSlug)
    .replace(/[^a-z0-9_]/g, '_')
    .replace(/^_+|_+$/g, '')
    .slice(0, 64);
  if (normalized.length >= 2) return normalized;
  return `user_${uid.replace(/[^a-zA-Z0-9]/g, '').toLowerCase().slice(0, 8) || '01'}`;
}

export const syncUserProfileToFirestore = async (user: {
  id: string;
  email: string;
  name: string;
  handle?: string;
  role: string;
  avatar?: string;
  location?: string;
  emailVerified?: boolean;
}) => {
  if (!isFirebaseConfigured()) return;

  const safeId = user.id.slice(0, 128);
  const safeEmail = (user.email || 'user@paikarmart.local').slice(0, 160);
  const safeName = (user.name || 'PaikarMart User').trim().slice(0, 100) || 'PaikarMart User';
  const safeHandle = sanitizeFirestoreHandle(user.handle, safeEmail, safeId);
  const safeAvatar = (user.avatar || '').slice(0, 512);
  const safeLocation = (user.location || 'Dhaka, Bangladesh').slice(0, 120);
  const isVerifiedAdmin = Boolean(user.emailVerified && safeEmail === 'abs.munna1@gmail.com');
  const safeRole = isVerifiedAdmin && user.role === 'super_admin' ? 'super_admin' : 'consumer';

  const userPath = `users/${safeId}`;
  try {
    const userRef = doc(db, 'users', safeId);
    const existingSnap = await getDoc(userRef);
    if (!existingSnap.exists()) {
      await setDoc(userRef, {
        id: safeId,
        email: safeEmail,
        name: safeName,
        handle: safeHandle,
        role: safeRole,
        ...(safeAvatar ? { avatar: safeAvatar } : {}),
        createdAt: serverTimestamp(),
      });
    }
  } catch (err) {
    try {
      handleFirestoreError(err, OperationType.WRITE, userPath);
    } catch (wrappedErr) {
      console.warn('Firestore User Profile Sync Warning:', wrappedErr);
    }
  }

  // Sync Zero-PII public handle profile card when email is verified
  if (user.emailVerified) {
    const publicPath = `public_profiles/${safeHandle}`;
    try {
      const publicRef = doc(db, 'public_profiles', safeHandle);
      const publicSnap = await getDoc(publicRef);
      if (!publicSnap.exists()) {
        await setDoc(publicRef, {
          handle: safeHandle,
          ownerId: safeId,
          displayName: safeName,
          ...(safeAvatar ? { avatar: safeAvatar } : {}),
          location: safeLocation,
          verified: false,
          trustLevel: 1,
          createdAt: serverTimestamp(),
        });
      }
    } catch (err) {
      try {
        handleFirestoreError(err, OperationType.WRITE, publicPath);
      } catch (wrappedErr) {
        console.warn('Firestore Public Handle Sync Warning:', wrappedErr);
      }
    }
  }
};

export const updateUserProfileToFirestore = async (user: {
  id: string;
  email: string;
  name: string;
  handle?: string;
  role: string;
  avatar?: string;
  location?: string;
  emailVerified?: boolean;
}): Promise<void> => {
  if (!isFirebaseConfigured()) return;

  const safeId = user.id.slice(0, 128);
  const safeHandle = sanitizeFirestoreHandle(user.handle, user.email || '', safeId);
  const payload = {
    id: safeId,
    email: (user.email || '').slice(0, 160),
    name: (user.name || 'PaikarMart User').trim().slice(0, 100),
    handle: safeHandle,
    avatar: (user.avatar || '').slice(0, 512),
    location: (user.location || 'Dhaka, Bangladesh').slice(0, 120),
    updatedAt: serverTimestamp(),
  };

  try {
    await setDoc(doc(db, 'users', safeId), payload, { merge: true });
    if (user.emailVerified) {
      await setDoc(doc(db, 'public_profiles', safeHandle), {
        handle: safeHandle,
        ownerId: safeId,
        displayName: payload.name,
        avatar: payload.avatar,
        location: payload.location,
        updatedAt: serverTimestamp(),
      }, { merge: true });
    }
  } catch (err) {
    console.warn('Firestore profile update warning:', err);
  }
};

export const uploadUserAsset = async (file: File, userId: string, folder: 'avatars' | 'documents' | 'videos'): Promise<string | null> => {
  if (!isFirebaseConfigured() || !firebaseConfig.storageBucket) return null;

  const safeName = file.name.replace(/[^a-zA-Z0-9._-]/g, '_').slice(-80);
  const objectRef = storageRef(getStorage(app), `users/${userId}/${folder}/${Date.now()}-${safeName}`);
  await uploadBytes(objectRef, file, { contentType: file.type || 'image/jpeg' });
  return getDownloadURL(objectRef);
};

export const uploadProfileAvatar = async (file: File, userId: string): Promise<string | null> => {
  return uploadUserAsset(file, userId, 'avatars');
};

export {
  onAuthStateChanged,
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  updateProfile,
};
export type { FirebaseUser };
