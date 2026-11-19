import React from 'react';
import { BrowserRouter } from 'react-router-dom';
import { ThemeProvider } from '@/contexts/ThemeContext';
import { LanguageProvider } from '@/contexts/LanguageContext';
import { LocationProvider } from '@/contexts/LocationContext';
import { SettingsModalProvider } from '@/contexts/SettingsContext';
import { AuthProvider } from '@/features/auth';
import { ErrorBoundary } from '@/design-system/components';

interface AppProvidersProps {
  children: React.ReactNode;
  onLocationChanged?: (name: string, coords: { lat: number; lng: number }) => void;
}

export const AppProviders: React.FC<AppProvidersProps> = ({ children, onLocationChanged }) => {
  return (
    <ErrorBoundary>
      <BrowserRouter>
        <AuthProvider>
          <ThemeProvider>
            <LanguageProvider>
              <LocationProvider onLocationChanged={onLocationChanged}>
                <SettingsModalProvider>
                  {children}
                </SettingsModalProvider>
              </LocationProvider>
            </LanguageProvider>
          </ThemeProvider>
        </AuthProvider>
      </BrowserRouter>
    </ErrorBoundary>
  );
};
