import React from 'react';
import { BrowserRouter } from 'react-router-dom';

export const RouterProvider = ({ children }: { children: React.ReactNode }) => (
  <BrowserRouter>
    {children}
  </BrowserRouter>
);
