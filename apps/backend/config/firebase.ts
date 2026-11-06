import { initializeApp, cert, getApps } from 'firebase-admin/app';
import { getAuth } from 'firebase-admin/auth';
import crypto from 'crypto';
import dotenv from 'dotenv';

dotenv.config();

const isProduction = process.env.NODE_ENV === 'production';

/**
 * Normalizes PEM private keys by stripping surrounding quotes and fixing escaped newlines.
 */
function normalizePemKey(rawKey: string): string {
  let key = rawKey.trim();
  if ((key.startsWith('"') && key.endsWith('"')) || (key.startsWith("'") && key.endsWith("'"))) {
    key = key.slice(1, -1);
  }
  return key.replace(/\\n/g, '\n');
}

/**
 * Validates whether a given string is a genuine, parseable PEM private key (not a dummy placeholder).
 */
function isValidPem(key: string | undefined): boolean {
  if (!key || typeof key !== 'string') return false;
  if (key.includes('...') || key.includes('your-private-key') || key.length < 200) {
    return false;
  }
  try {
    crypto.createPrivateKey(key);
    return true;
  } catch {
    return false;
  }
}

/**
 * Detects placeholder values from templates or example environment variables.
 */
function isPlaceholder(value: string | undefined): boolean {
  if (!value) return true;
  const val = value.trim().toLowerCase();
  return (
    val.includes('your-project-id') ||
    val.includes('your-password') ||
    val.includes('xxxxx') ||
    val.includes('placeholder') ||
    val.includes('example.com')
  );
}

function initializeFirebase() {
  try {
    // Check for explicit opt-out
    if (process.env.ALLOW_NO_FIREBASE === 'true') {
      console.log('ℹ️ Firebase Admin disabled via ALLOW_NO_FIREBASE=true. Running in local fallback mode.');
      return null;
    }

    let serviceAccount: any = null;
    const rawJson = process.env.FIREBASE_SERVICE_ACCOUNT_JSON;

    if (rawJson) {
      try {
        // Try parsing as raw JSON first
        serviceAccount = JSON.parse(rawJson);
      } catch {
        // If it fails, try decoding as base64
        try {
          const decoded = Buffer.from(rawJson, 'base64').toString('utf8');
          serviceAccount = JSON.parse(decoded);
        } catch {
          console.warn('⚠️ Unable to parse FIREBASE_SERVICE_ACCOUNT_JSON as JSON or Base64.');
        }
      }

      // Validate the private key inside the parsed JSON
      if (serviceAccount && serviceAccount.private_key) {
        serviceAccount.private_key = normalizePemKey(serviceAccount.private_key);
        if (!isValidPem(serviceAccount.private_key) || isPlaceholder(serviceAccount.project_id)) {
          serviceAccount = null;
        }
      } else {
        serviceAccount = null;
      }
    } 
    else if (
      process.env.FIREBASE_PROJECT_ID &&
      process.env.FIREBASE_CLIENT_EMAIL &&
      process.env.FIREBASE_PRIVATE_KEY
    ) {
      const projectId = process.env.FIREBASE_PROJECT_ID.trim();
      const clientEmail = process.env.FIREBASE_CLIENT_EMAIL.trim();
      const formattedKey = normalizePemKey(process.env.FIREBASE_PRIVATE_KEY);

      // Verify they are not template placeholders
      if (
        !isPlaceholder(projectId) &&
        !isPlaceholder(clientEmail) &&
        isValidPem(formattedKey)
      ) {
        serviceAccount = {
          projectId,
          clientEmail,
          privateKey: formattedKey,
        };
      }
    }

    if (!serviceAccount) {
      if (isProduction && process.env.STRICT_FIREBASE_REQUIRED === 'true') {
        throw new Error(
          '❌ Firebase Admin credentials are REQUIRED in production because STRICT_FIREBASE_REQUIRED=true.'
        );
      } else {
        console.log('ℹ️ Firebase Admin SDK: No valid credentials detected. Operating in resilient fallback mode.');
        return null;
      }
    }

    if (getApps().length === 0) {
      try {
        initializeApp({
          credential: cert(serviceAccount),
        });
        console.log('✅ Firebase Admin SDK initialized successfully.');
      } catch (pemError) {
        if (isProduction && process.env.STRICT_FIREBASE_REQUIRED === 'true') {
          throw pemError;
        }
        console.warn('⚠️ Firebase Admin initialization bypassed due to invalid key format. Operating in fallback mode.');
        return null;
      }
    }

    return getAuth();
  } catch (error: any) {
    if (isProduction && process.env.STRICT_FIREBASE_REQUIRED === 'true') {
      console.error('❌ CRITICAL: Firebase Admin failed to initialize in production:', error);
      throw error;
    } else {
      console.warn('ℹ️ Firebase Admin initialized in fallback mode:', error?.message || error);
      return null;
    }
  }
}

export const firebaseAuthInstance = initializeFirebase();
export const initializeFirebaseAdmin = () => firebaseAuthInstance;
