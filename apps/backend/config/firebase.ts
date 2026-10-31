import { initializeApp, cert, getApps } from 'firebase-admin/app';
import { getAuth } from 'firebase-admin/auth';
import dotenv from 'dotenv';

dotenv.config();

const isProduction = process.env.NODE_ENV === 'production';

function initializeFirebase() {
  try {
    let serviceAccount: any;

    if (process.env.FIREBASE_SERVICE_ACCOUNT_JSON) {
      serviceAccount = JSON.parse(process.env.FIREBASE_SERVICE_ACCOUNT_JSON);
    } 
    else if (process.env.FIREBASE_PROJECT_ID && process.env.FIREBASE_CLIENT_EMAIL && process.env.FIREBASE_PRIVATE_KEY) {
      serviceAccount = {
        projectId: process.env.FIREBASE_PROJECT_ID,
        clientEmail: process.env.FIREBASE_CLIENT_EMAIL,
        privateKey: process.env.FIREBASE_PRIVATE_KEY.replace(/\\n/g, '\n'),
      };
    }

    if (!serviceAccount) {
      if (isProduction && process.env.STRICT_FIREBASE_REQUIRED === 'true') {
        throw new Error('Firebase credentials missing in production.');
      } else {
        console.warn('⚠️ Firebase Admin SDK credentials missing. Operating in resilient fallback mode.');
        return null;
      }
    }

    if (getApps().length === 0) {
      initializeApp({
        credential: cert(serviceAccount),
      });
    }
    return getAuth();
  } catch (error) {
    if (isProduction && process.env.STRICT_FIREBASE_REQUIRED === 'true') {
      throw error;
    } else {
      console.error('Failed to initialize Firebase Admin SDK:', error);
      return null;
    }
  }
}

export const firebaseAuthInstance = initializeFirebase();
export const initializeFirebaseAdmin = () => firebaseAuthInstance;
