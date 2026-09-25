import React from 'react';
import { QueryProvider } from './QueryProvider';
import { ThemeProvider } from './ThemeProvider';
import { RouterProvider } from './RouterProvider';
import { AuthProvider } from '@/features/auth/AuthContext';
import { LanguageProvider } from '@/features/language/LanguageContext';
import { SellerProvider } from '@/modules/seller/SellerContext';

export const AppProviders = ({ children }: { children: React.ReactNode }) => (
  <QueryProvider>
    <ThemeProvider>
      <LanguageProvider>
        <AuthProvider>
          <SellerProvider>
            <RouterProvider>
              {children}
            </RouterProvider>
          </SellerProvider>
        </AuthProvider>
      </LanguageProvider>
    </ThemeProvider>
  </QueryProvider>
);
