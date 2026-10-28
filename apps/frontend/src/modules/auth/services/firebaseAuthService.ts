import { 
  auth, 
  googleProvider, 
  signInWithPopup, 
  signInWithEmailAndPassword, 
  createUserWithEmailAndPassword,
  sendPasswordResetEmail,
  signOut,
  signInWithPhoneNumber,
  RecaptchaVerifier
} from '@/core/lib/firebase';
import { apiClient } from '@/api/client';
import { ConfirmationResult, User } from 'firebase/auth';

export const firebaseAuthService = {
  // 1. Google Sign-In
  googleSignIn: async () => {
    const result = await signInWithPopup(auth, googleProvider);
    return firebaseAuthService.syncWithBackend(result.user);
  },

  // 2. Email & Password Sign-In
  emailSignIn: async (email: string, pass: string) => {
    const result = await signInWithEmailAndPassword(auth, email, pass);
    return firebaseAuthService.syncWithBackend(result.user);
  },

  // 3. Email & Password Registration
  emailRegister: async (email: string, pass: string, fullName: string, role: string = 'buyer') => {
    const result = await createUserWithEmailAndPassword(auth, email, pass);
    return firebaseAuthService.syncWithBackend(result.user, { fullName, role });
  },

  // 4. Password Reset
  resetPassword: async (email: string) => {
    await sendPasswordResetEmail(auth, email);
  },

  // 5. Phone Auth
  setupRecaptcha: (containerId: string) => {
    if ((window as any).recaptchaVerifier) {
       (window as any).recaptchaVerifier.clear();
    }
    (window as any).recaptchaVerifier = new RecaptchaVerifier(auth, containerId, {
      size: 'invisible',
      callback: () => {
        // reCAPTCHA solved, allow signInWithPhoneNumber.
      }
    });
    return (window as any).recaptchaVerifier;
  },

  sendOtp: async (phoneNumber: string, appVerifier: RecaptchaVerifier): Promise<ConfirmationResult> => {
    return signInWithPhoneNumber(auth, phoneNumber, appVerifier);
  },

  verifyOtp: async (confirmationResult: ConfirmationResult, code: string) => {
    const result = await confirmationResult.confirm(code);
    return firebaseAuthService.syncWithBackend(result.user);
  },

  // 6. Backend Synchronization (The bridge)
  syncWithBackend: async (user: User, extraData: any = {}) => {
    const idToken = await user.getIdToken();
    
    // Call our backend to sync the user record with Supabase via Prisma
    const { data } = await apiClient.post('/auth/sync', {
      role: extraData.role || 'buyer',
      fullName: extraData.fullName || user.displayName,
      avatarUrl: user.photoURL,
      phone: user.phoneNumber,
      ...extraData
    }, {
      headers: {
        Authorization: `Bearer ${idToken}`
      }
    });

    // Store the tokens returned by our backend (which are likely JWTs for our own API)
    if (data.token || data.accessToken) {
       localStorage.setItem('pm_token', data.token || data.accessToken);
    }
    
    return data;
  },

  logout: async () => {
    await signOut(auth);
    localStorage.removeItem('pm_token');
  }
};
