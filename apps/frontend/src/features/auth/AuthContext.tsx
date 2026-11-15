import React, { createContext, useContext, useState, useEffect } from 'react';
import { 
  auth, 
  signInWithGoogle as firebaseGoogleSignIn, 
  signOutFirebase, 
  onAuthStateChanged,
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  updateProfile,
  syncUserProfileToFirestore,
  validateFirestoreConnection,
  isFirebaseConfigured,
  type FirebaseUser 
} from '@/lib/firebase';
import { User, UserRole } from '@/types';
import { CURRENT_USER } from '@/data/mockData';
import { loadStoredData, saveStoredData } from '@/lib/supabase';
import { syncAuthenticatedProfile } from '@/features/auth/services/authProfileApi';

interface AuthContextType {
  firebaseUser: FirebaseUser | null;
  currentUser: User;
  setCurrentUser: React.Dispatch<React.SetStateAction<User>>;
  loading: boolean;
  isFirebaseReady: boolean;
  signInWithGoogle: () => Promise<void>;
  signUpWithEmail: (email: string, pass: string, name: string, selectedRole?: UserRole) => Promise<void>;
  signInWithEmail: (email: string, pass: string) => Promise<void>;
  signOut: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [firebaseUser, setFirebaseUser] = useState<FirebaseUser | null>(null);
  const [currentUser, setCurrentUser] = useState<User>(() => {
    const storedUser = loadStoredData<User>('USER', CURRENT_USER);
    return {
      ...storedUser,
      role: 'consumer',
      isVendor: false,
      kycStatus: 'none',
      vendorProfile: undefined,
      balance: 0,
    };
  });
  const [loading, setLoading] = useState<boolean>(true);
  const isFirebaseReady = isFirebaseConfigured();

  useEffect(() => {
    void validateFirestoreConnection();

    // Listen to Firebase Auth state changes
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      setFirebaseUser(user);
      if (user) {
        const assignedRole: UserRole = 'consumer';
        const resolvedHandle = user.email ? `@${user.email.split('@')[0]}` : currentUser.handle;

        // Sync Firebase User with Application User profile
        const syncedUser: User = {
          ...currentUser,
          id: user.uid,
          name: user.displayName || currentUser.name || 'PaikarMart User',
          email: user.email || currentUser.email || '',
          handle: resolvedHandle,
          avatar: user.photoURL || currentUser.avatar,
          role: assignedRole
        };
        setCurrentUser(syncedUser);
        saveStoredData('USER', syncedUser);
        void syncAuthenticatedProfile({ name: syncedUser.name, handle: syncedUser.handle, avatar: syncedUser.avatar, location: syncedUser.location }).catch((error) => console.warn('Profile API sync unavailable:', error));

        // Background sync to Firestore user document + Zero-PII public handle profile
        void syncUserProfileToFirestore({
          id: user.uid,
          email: user.email || '',
          name: user.displayName || currentUser.name || 'PaikarMart User',
          handle: resolvedHandle,
          role: assignedRole,
          avatar: user.photoURL || currentUser.avatar,
          location: currentUser.location,
          emailVerified: user.emailVerified
        });
      }
      setLoading(false);
    });

    return () => unsubscribe();
  }, []);

  const signInWithGoogle = async () => {
    try {
      setLoading(true);
      const user = await firebaseGoogleSignIn();
      if (user) {
        const assignedRole: UserRole = 'consumer';
        const syncedUser: User = {
          ...currentUser,
          id: user.uid,
          name: user.displayName || 'Google User',
          email: user.email || currentUser.email || '',
          handle: user.email ? `@${user.email.split('@')[0]}` : '@user',
          avatar: user.photoURL || currentUser.avatar,
          role: assignedRole
        };
        setCurrentUser(syncedUser);
        saveStoredData('USER', syncedUser);
        await syncAuthenticatedProfile({ name: syncedUser.name, handle: syncedUser.handle, avatar: syncedUser.avatar, location: syncedUser.location }).catch((error) => console.warn('Profile API sync unavailable:', error));

        await syncUserProfileToFirestore({
          id: user.uid,
          email: user.email || '',
          name: user.displayName || 'Google User',
          handle: syncedUser.handle,
          role: assignedRole,
          avatar: user.photoURL || currentUser.avatar,
          location: syncedUser.location,
          emailVerified: user.emailVerified
        });
      }
    } catch (err) {
      console.error('Google Sign-in failed:', err);
      throw err;
    } finally {
      setLoading(false);
    }
  };

  const signUpWithEmail = async (email: string, pass: string, name: string, _selectedRole: UserRole = 'consumer') => {
    try {
      setLoading(true);
      const creds = await createUserWithEmailAndPassword(auth, email, pass);
      if (creds.user) {
        await updateProfile(creds.user, { displayName: name });
        const assignedRole: UserRole = 'consumer';
        
        const newUser: User = {
          ...currentUser,
          id: creds.user.uid,
          name: name,
          email: email,
          handle: `@${email.split('@')[0]}`,
          role: assignedRole,
          isVendor: false
        };
        setCurrentUser(newUser);
        saveStoredData('USER', newUser);
        await syncAuthenticatedProfile({ name: newUser.name, handle: newUser.handle, avatar: newUser.avatar, location: newUser.location }).catch((error) => console.warn('Profile API sync unavailable:', error));

        await syncUserProfileToFirestore({
          id: creds.user.uid,
          email: email,
          name: name,
          handle: newUser.handle,
          role: assignedRole,
          avatar: newUser.avatar,
          location: newUser.location,
          emailVerified: creds.user.emailVerified
        });
      }
    } catch (err) {
      console.error('Email Registration Failed:', err);
      throw err;
    } finally {
      setLoading(false);
    }
  };

  const signInWithEmail = async (email: string, pass: string) => {
    try {
      setLoading(true);
      const creds = await signInWithEmailAndPassword(auth, email, pass);
      if (creds.user) {
        const assignedRole: UserRole = 'consumer';

        const loggedInUser: User = {
          ...currentUser,
          id: creds.user.uid,
          name: creds.user.displayName || 'Registered User',
          email: email,
          handle: `@${email.split('@')[0]}`,
          role: assignedRole
        };
        setCurrentUser(loggedInUser);
        saveStoredData('USER', loggedInUser);
        await syncAuthenticatedProfile({ name: loggedInUser.name, handle: loggedInUser.handle, avatar: loggedInUser.avatar, location: loggedInUser.location }).catch((error) => console.warn('Profile API sync unavailable:', error));
      }
    } catch (err) {
      console.error('Email Login Failed:', err);
      throw err;
    } finally {
      setLoading(false);
    }
  };

  const signOut = async () => {
    try {
      setLoading(true);
      await signOutFirebase();
      setFirebaseUser(null);
      setCurrentUser((previous) => ({
        ...previous,
        role: 'consumer',
        isVendor: false,
        kycStatus: 'none',
        vendorProfile: undefined,
        balance: 0,
      }));
    } catch (err) {
      console.error('Sign-out failed:', err);
      throw err;
    } finally {
      setLoading(false);
    }
  };

  return (
    <AuthContext.Provider
      value={{
        firebaseUser,
        currentUser,
        setCurrentUser,
        loading,
        isFirebaseReady,
        signInWithGoogle,
        signUpWithEmail,
        signInWithEmail,
        signOut,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = (): AuthContextType => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
