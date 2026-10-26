/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */
import { ThemeProvider } from './providers/ThemeProvider';
import { AppRoutes } from './router/AppRoutes';
import { ToastContainer } from '@/components/common/ToastContainer';
import { ErrorBoundary } from '@/components/common/ErrorBoundary';

export default function App() {
  return (
    <ErrorBoundary>
      <AppRoutes />
      <ToastContainer />
    </ErrorBoundary>
  );
}
