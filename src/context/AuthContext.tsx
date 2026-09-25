import { 
  AuthProvider, 
  useAuth as useFeatureAuth, 
  AuthContextValue,
  AppUser
} from '@/features/auth/AuthContext';

export { AuthProvider, useFeatureAuth };
export { UserRole } from '@/permissions/roles';
export type { AuthContextValue as AuthContextType, AppUser as User };

export const useAuth = () => {
  return useFeatureAuth();
};
