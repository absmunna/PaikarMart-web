import { 
  auth, 
  googleProvider, 
  signInWithPopup, 
  signInWithEmailAndPassword, 
  createUserWithEmailAndPassword,
  sendPasswordResetEmail,
  logout as firebaseLogout,
  signInWithPhoneNumber,
  RecaptchaVerifier,
  getAccessToken
} from '@/core/lib/firebase';
import { apiClient } from '@/core/api';
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
  emailRegister: async (email: string, pass: string, fullName: string) => {
    const result = await createUserWithEmailAndPassword(auth, email, pass);
    return firebaseAuthService.syncWithBackend(result.user, { fullName });
  },

  // 4. Password Reset
  resetPassword: async (email: string) => {
    await sendPasswordResetEmail(auth, email);
  },

  // 5. Phone Auth
  setupRecaptcha: (containerId: string) => {
    if (typeof window === 'undefined') return null;
    if ((window as any).recaptchaVerifier) {
       (window as any).recaptchaVerifier.clear();
    }
    (window as any).recaptchaVerifier = new RecaptchaVerifier(auth, containerId, {
      size: 'invisible'
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

  // 6. Backend Synchronization
  syncWithBackend: async (user: User, extraData: any = {}) => {
    const idToken = await getAccessToken(true);
    if (!idToken) throw new Error('Authentication token missing');
    
    // Role is NOT accepted from client in production
    const { data } = await apiClient.post('/auth/sync', {
      fullName: extraData.fullName || user.displayName,
      avatarUrl: user.photoURL,
      phone: user.phoneNumber,
    }, {
      headers: {
        Authorization: `Bearer ${idToken}`
      }
    });

    if (data.token || data.accessToken) {
       const t = data.token || data.accessToken;
       localStorage.setItem('pm_token', t);
       localStorage.setItem('accessToken', t);
    }
    
    return data;
  },

  logout: async () => {
    await firebaseLogout();
  }
};
