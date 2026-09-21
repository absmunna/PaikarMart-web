import React from 'react';
import { QueryProvider } from './QueryProvider';
import { RouterProvider } from './RouterProvider';
import { ThemeProvider as FeatureThemeProvider } from '@/features/theme/ThemeContext';
import { LanguageProvider } from '@/features/language/LanguageContext';
import { AppAuthProvider } from '@/features/auth/AuthContext';
import { LocationProvider } from '@/features/location/LocationContext';
import { VideoUnlockProvider } from '@/features/digital-content/VideoUnlockContext';
import { TooltipProvider } from '@/components/ui/tooltip';
import { SellerProvider } from '@/modules/seller';

export const AppProviders = ({ children }: { children: React.ReactNode }) => (
  <QueryProvider>
    <FeatureThemeProvider>
      <LanguageProvider>
        <AppAuthProvider>
          <LocationProvider>
            <VideoUnlockProvider>
              <TooltipProvider>
                <SellerProvider>
                  <RouterProvider>
                    {children}
                  </RouterProvider>
                </SellerProvider>
              </TooltipProvider>
            </VideoUnlockProvider>
          </LocationProvider>
        </AppAuthProvider>
      </LanguageProvider>
    </FeatureThemeProvider>
  </QueryProvider>
);
