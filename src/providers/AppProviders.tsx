import React from 'react';
import { QueryProvider } from './QueryProvider';
import { ThemeProvider } from './ThemeProvider';
import { RouterProvider } from './RouterProvider';

export const AppProviders = ({ children }: { children: React.ReactNode }) => (
  <QueryProvider>
    <ThemeProvider>
      <RouterProvider>
        {children}
      </RouterProvider>
    </ThemeProvider>
  </QueryProvider>
);
