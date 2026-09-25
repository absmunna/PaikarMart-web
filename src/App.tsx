/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */
import { ThemeProvider } from './providers/ThemeProvider';
import { AppRoutes } from './routes/AppRoutes';
import { ToastContainer } from './components/common/ToastContainer';

export default function App() {
  return (
    <>
      <AppRoutes />
      <ToastContainer />
    </>
  );
}
