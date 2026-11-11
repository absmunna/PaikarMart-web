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

  /**
   * Normalize BD mobile numbers to E.164 (+8801XXXXXXXXX).
   * Accepts: 017..., 88017..., +88017...
   */
  normalizePhoneE164: (phone: string): string => {
    const digits = String(phone || '').replace(/[^0-9+]/g, '');
    if (digits.startsWith('+880') && digits.length >= 14) return digits;
    if (digits.startsWith('880') && digits.length >= 13) return `+${digits}`;
    if (digits.startsWith('0') && digits.length === 11) return `+880${digits.slice(1)}`;
    if (digits.startsWith('1') && digits.length === 10) return `+880${digits}`;
    if (digits.startsWith('+') && digits.length > 8) return digits;
    throw new Error('INVALID_PHONE');
  },

  // 5. Phone Auth (Firebase Phone Auth — single standard path)
  setupRecaptcha: (containerId: string = 'recaptcha-container') => {
    if (typeof window === 'undefined') return null;

    let el = document.getElementById(containerId);
    if (!el) {
      el = document.createElement('div');
      el.id = containerId;
      el.style.display = 'none';
      document.body.appendChild(el);
    }

    try {
      if ((window as any).recaptchaVerifier) {
        try { (window as any).recaptchaVerifier.clear(); } catch {}
      }
    } catch {}

    const verifier = new RecaptchaVerifier(auth, containerId, {
      size: 'invisible',
      callback: () => {},
      'expired-callback': () => {
        try { (window as any).recaptchaVerifier = null; } catch {}
      },
    });
    (window as any).recaptchaVerifier = verifier;
    return verifier;
  },

  /** Send SMS OTP via Firebase (requires Phone provider + authorized domain) */
  sendOtp: async (phoneNumber: string, appVerifier?: RecaptchaVerifier | null): Promise<ConfirmationResult> => {
    const e164 = firebaseAuthService.normalizePhoneE164(phoneNumber);
    const verifier = appVerifier || firebaseAuthService.setupRecaptcha('recaptcha-container');
    if (!verifier) throw new Error('RECAPTCHA_UNAVAILABLE');
    return signInWithPhoneNumber(auth, e164, verifier);
  },

  /** Confirm SMS code and sync user with backend */
  verifyOtp: async (confirmationResult: ConfirmationResult, code: string) => {
    const trimmed = String(code || '').trim();
    if (!/^[0-9]{4,8}$/.test(trimmed)) {
      const err = new Error('INVALID_OTP');
      (err as any).code = 'INVALID_OTP';
      throw err;
    }
    const result = await confirmationResult.confirm(trimmed);
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
