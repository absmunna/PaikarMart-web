import React from 'react';
import { QueryProvider } from './QueryProvider';
import { ThemeProvider } from './ThemeProvider';
import { RouterProvider } from './RouterProvider';
import { AuthProvider } from '@/modules/auth';
import { LanguageProvider } from '@/modules/language';
import { SellerProvider } from '@/modules/seller';

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
