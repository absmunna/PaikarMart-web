import React from 'react';
import { HelmetProvider } from 'react-helmet-async';
import { QueryProvider } from './QueryProvider';
import { ThemeProvider } from './ThemeProvider';
import { RouterProvider } from './RouterProvider';
import { AuthProvider } from '@/modules/auth';
import { LanguageProvider } from '@/modules/language';
import { SellerProvider } from '@/modules/seller';
import { VendorProfileProvider } from './VendorProfileProvider';

export const AppProviders = ({ children }: { children: React.ReactNode }) => (
  <HelmetProvider>
    <QueryProvider>
      <ThemeProvider>
        <LanguageProvider>
          <AuthProvider>
            <SellerProvider>
              <VendorProfileProvider>
                <RouterProvider>
                  {children}
                </RouterProvider>
              </VendorProfileProvider>
            </SellerProvider>
          </AuthProvider>
        </LanguageProvider>
      </ThemeProvider>
    </QueryProvider>
  </HelmetProvider>
);
