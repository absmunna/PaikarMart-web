import { NavigateFunction } from 'react-router-dom';

/**
 * Safely navigates back in browser history if history state exists,
 * otherwise navigates cleanly to the provided fallback path (default: '/').
 * This prevents dead-ends or unexpectedly exiting the application.
 */
export const safeBack = (navigate: NavigateFunction, fallback: string = '/') => {
  if (typeof window !== 'undefined') {
    const state = window.history.state;
    // In React Router and standard HTML5 history, state.idx indicates position in history stack
    if (state && typeof state.idx === 'number' && state.idx > 0) {
      navigate(-1);
      return;
    }
  }
  navigate(fallback);
};
