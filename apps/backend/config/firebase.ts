import { initializeApp, getApps, getApp, cert } from 'firebase-admin/app';
import dotenv from 'dotenv';

dotenv.config();

const initializeFirebaseAdmin = () => {
  const apps = getApps();
  if (apps.length > 0) return apps[0];

  const projectId = process.env.FIREBASE_PROJECT_ID;
  const clientEmail = process.env.FIREBASE_CLIENT_EMAIL;
  const privateKey = process.env.FIREBASE_PRIVATE_KEY;

  if (projectId && clientEmail && privateKey) {
    try {
      return initializeApp({
        credential: cert({
          projectId,
          clientEmail,
          privateKey: privateKey.replace(/\\n/g, '\n'),
        }),
      });
    } catch (error) {
      console.error('Firebase Admin initialization error:', error);
    }
  } else {
    console.warn('Firebase Admin credentials missing. Auth verification will fail in production.');
  }
  
  return null;
};

export { initializeFirebaseAdmin };
