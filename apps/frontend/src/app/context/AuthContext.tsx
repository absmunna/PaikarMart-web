import {
  AuthProvider,
  useAuth as useFeatureAuth,
  AuthContextValue,
  AppUser
} from '@/modules/auth';

export { AuthProvider, useFeatureAuth };
export { UserRole } from '@/permissions/roles';
export type { AuthContextValue as AuthContextType, AppUser as User };

export const useAuth = () => {
  return useFeatureAuth();
};
