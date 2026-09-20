/**
 * Safe local storage wrapper.
 * Prevents throwing DOMException when iframe cookies/storage are blocked.
 */
export const safeStorage = {
  getItem(key: string): string | null {
    try {
      if (typeof window !== "undefined") {
         return window.localStorage.getItem(key);
      }
    } catch {
      return null;
    }
    return null;
  },
  setItem(key: string, value: string): void {
    try {
      if (typeof window !== "undefined") {
         window.localStorage.setItem(key, value);
      }
    } catch {}
  },
  removeItem(key: string): void {
    try {
      if (typeof window !== "undefined") {
         window.localStorage.removeItem(key);
      }
    } catch {}
  }
};
