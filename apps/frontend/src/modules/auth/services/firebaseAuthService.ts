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
  getAccessToken,
  sendEmailVerification
} from '@/core/lib/firebase';
import { apiClient } from '@/core/api';
import { ConfirmationResult, User } from 'firebase/auth';

export const firebaseAuthService = {
  // 1. Google Sign-In (Google accounts are typically pre-verified by Google)
  googleSignIn: async () => {
    const result = await signInWithPopup(auth, googleProvider);
    return firebaseAuthService.syncWithBackend(result.user);
  },

  // 2. Email & Password Sign-In — email verification enforced
  emailSignIn: async (email: string, pass: string) => {
    const result = await signInWithEmailAndPassword(auth, email, pass);
    const user = result.user;
    if (!user.emailVerified) {
      try {
        await sendEmailVerification(user);
      } catch {}
      await firebaseLogout();
      const err = new Error('EMAIL_NOT_VERIFIED');
      (err as any).code = 'EMAIL_NOT_VERIFIED';
      throw err;
    }
    return firebaseAuthService.syncWithBackend(user);
  },

  // 3. Email & Password Registration — always send verification mail
  emailRegister: async (email: string, pass: string, fullName: string) => {
    const result = await createUserWithEmailAndPassword(auth, email, pass);
    const user = result.user;
    try {
      await sendEmailVerification(user);
    } catch (e) {
      console.warn('sendEmailVerification failed', e);
    }
    return firebaseAuthService.syncWithBackend(user, { fullName });
  },

  // Resend verification email for the currently signed-in user
  resendEmailVerification: async () => {
    const user = auth.currentUser;
    if (!user) throw new Error('NOT_SIGNED_IN');
    if (user.emailVerified) return { alreadyVerified: true as const };
    await sendEmailVerification(user);
    return { sent: true as const };
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
